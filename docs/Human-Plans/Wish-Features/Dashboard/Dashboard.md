# Dashboard

## Doc Header

### Doc History
6. 2026-04-03 17:42: Prepared `Phase 0 - Research New Workspace Foundation` for implementation by grounding it in the live workspace-mode architecture, locking the current owner seams around `AppShell`, `useWorkspaceStore`, `workspaceShellTypes`, `ViewportFrame`, and the workspace surface-action layer, and adding a concrete research sequence, file targets, and verification shape so the dashboard plan can start from the real `Workspace 7.x` foundation instead of a speculative parallel mode system
5. 2026-04-03 17:32: Added a new `Phase 0` research step ahead of implementation so the dashboard plan explicitly starts by studying how new workspace or viewport foundations should be introduced before building `Dashboard` and `Notepad`
4. 2026-04-03 17:29: Added an implementation phase ladder at the end of the document using one `##` section per phase, mirroring the future-doc planning style more closely, and cleaned up the leftover duplicate `Notepad` widget header now that `Notepad` is defined as an editor workspace rather than a dashboard widget
3. 2026-04-03 17:22: Reframed `Notepad` so it is no longer treated as a dashboard widget, but instead as the dedicated editor or workspace surface behind notes, while keeping `Sticky Notes` as the first real dashboard widget and preserving the possibility that `Notepad` could later support more than one note-based feature
2. 2026-04-03 17:18: Restructured the doc so `Dashboard` is the main feature section and each planned widget gets its own section, with `Notepad` and `Sticky Notes` captured as widgets `01` and `02`, while clarifying that both `Dashboard` and `Notepad` are their own viewport or workspace modes
1. 2026-04-03 17:10: Created this wish-feature planning doc to define `Dashboard` as a new ParaHook workspace direction, with `Notepad` and `Sticky Notes` treated as core features inside the dashboard rather than as separate top-level workspace modes

### Purpose

This doc defines the future `Dashboard` direction for ParaHook.

Use it to answer:
- what `Dashboard` should be
- how `Dashboard` should work as its own viewport or workspace mode
- which widgets belong inside `Dashboard`
- how `Notepad` and `Sticky Notes` should relate to it
- what the first useful version should include

### Why This Doc Exists

The idea has now settled into a clearer shape:
- `Dashboard` is its own viewport or workspace mode
- `Notepad` is also its own viewport or workspace mode
- `Dashboard` should also act as the home for widgets
- `Sticky Notes` should be treated as a widget
- `Notepad` should be treated as the editor surface behind notes rather than as a widget

This doc exists to hold that structure in a clean way before architecture planning begins.

The goal here is to:
- define the main `Dashboard` mode
- define the first widgets inside it
- keep the feature organized as more widgets are added later

### Scope

This doc covers:
- `Dashboard` as its own viewport or workspace mode
- the widget structure inside `Dashboard`
- `Notepad` as the editor or note workspace behind note-based content
- `Sticky Notes` as widget `01`
- the relationship between `Dashboard` mode and `Notepad` mode
- future widget expansion such as time or weather

This doc does not cover:
- final visual design details
- cloud sync decisions
- final plugin architecture for widgets
- deep collaboration features
- a full generic productivity suite

## Doc Body

## Dashboard

### Short Version

ParaHook could eventually have a `Dashboard` viewport or workspace mode that acts as a personal board, utility surface, and project thinking area.

`Dashboard` should be the place where the user can:
- see pinned note content
- organize sticky notes
- access lightweight widgets
- later add simple utility surfaces like time or weather

### Core Direction

`Dashboard` should be treated as a real workspace mode, not only as a floating panel.

It should feel like:
- a board
- a personal workspace surface
- a home for lightweight widgets
- a place for thought and organization near the main ParaHook work

It should not feel like:
- a generic operating-system desktop clone
- an overloaded productivity suite
- a random collection of unrelated widgets with no center of gravity

### Workspace Rule

Two important workspace rules should be preserved:

- `Dashboard` is its own viewport or workspace mode
- `Notepad` is also its own viewport or workspace mode

That means `Dashboard` is not replacing `Notepad`.

Instead:
- `Dashboard` is the organization and widget surface
- `Notepad` is the focused writing surface

### Widget Structure

This doc should use one section per widget so the feature can grow in an organized way.

Current first widget:
- `01 - Sticky Notes`

Possible later widgets:
- `02 - Time`
- `03 - Weather`
- later other small project or utility widgets

### Why This Feels Worth Adding

- it gives ParaHook a more human workspace for ideas, reminders, and planning
- it keeps lightweight project thinking inside the app
- it adds a personal studio-like layer without replacing the core design tools
- it creates one place where smaller supporting tools can live

### Good First Non-Goals

- giant widget ecosystems in v1
- making `Dashboard` more important than the main design workspace
- turning ParaHook into a generic desktop shell
- stuffing every utility idea into the first version

## Notepad

### Role

`Notepad` should be a focused text-writing workspace mode and editor surface.

It should be useful for:
- quick thoughts
- scratch notes
- project TODOs
- planning text
- pasted references
- idea capture during work

### Workspace Direction

`Notepad` should have its own viewport or workspace mode because writing deserves a cleaner and more focused surface than a small widget card alone.

That means:
- the user can enter `Notepad` directly as a mode
- the user can write in a larger, calmer editor view
- notes can still relate back to `Dashboard`

### Product Direction

`Notepad` should not be treated as a widget.

It makes more sense as:
- the editor behind sticky notes
- the main note-writing surface
- a reusable text-editing workspace that could later support more than one note-based feature

That means `Notepad` can stay valuable even if ParaHook later adds:
- other note types
- richer text surfaces
- project-linked writing features

### Good First Behaviors

- create note
- edit title
- edit body
- autosave
- reopen saved notes
- send or pin a note to `Dashboard`

### Product Rule

`Notepad` should stay simple in the first pass:
- plain text
- fast editing
- no heavy rich-text or document suite complexity

## Widget 01 - Sticky Notes

### Role

`Sticky Notes` should be the visual note-card widget system inside `Dashboard`.

This widget gives the user a way to:
- pin notes
- see them as cards
- arrange them spatially
- keep important reminders visible

### Good First Behaviors

- pin note to dashboard
- unpin note
- drag note
- resize note
- change color or style preset
- open sticky note back into `Notepad`

### Relationship To Notepad

The strongest version of this idea is:
- notes are written in `Notepad`
- notes can be shown in `Dashboard` as `Sticky Notes`

That keeps writing and organization connected without making them the exact same surface.

### Shared Note Model

There should not be one note system for `Notepad` and a different unrelated card system for `Sticky Notes`.

Instead there should be one note model with shared properties such as:
- title
- body text
- created date
- modified date
- pinned state
- color or style preset
- maybe tags later

This would support a natural workflow:
- write note in `Notepad`
- pin it to `Dashboard`
- move it around as a sticky note
- reopen it in `Notepad`
- unpin it without deleting the note

## Future Widgets

### Expansion Direction

Once `Dashboard`, `Notepad`, and `Sticky Notes` feel solid, more widgets can be added carefully.

Good later examples:
- `Time`
- `Weather`
- maybe a small project status or reminder widget later

Healthy rule:
- each widget should earn its place
- notes and note-organization should remain the main identity at first

## Suggested Rollout

- `v1`
  - add `Dashboard` as its own workspace mode
  - add `Notepad` as its own workspace mode
  - add `Sticky Notes` as a dashboard widget
  - create, edit, and autosave simple notes
  - pin notes from `Notepad` into `Dashboard`
  - drag and arrange sticky notes

- `v2`
  - add tags or categories
  - add multiple dashboard boards or named areas
  - improve note search and filtering
  - maybe add the first utility widget such as time

- `v3`
  - add weather or other optional widgets
  - add richer board organization
  - maybe add project-linked notes later

## Recommended First Cut

The best first cut is probably:
- one `Dashboard` mode
- one `Notepad` mode
- one shared note model
- one `Sticky Notes` widget inside `Dashboard`
- no large widget system yet

That proves the workspace relationship cleanly without overbuilding.

## Implementation Phases

The phases below are meant to capture a sensible implementation order for getting `Dashboard`, `Notepad`, and `Sticky Notes` into ParaHook without trying to build every widget idea at once.

Important rule:
- `Dashboard` and `Notepad` should land as honest workspace or viewport modes first
- `Sticky Notes` should land as the first real dashboard widget
- future widgets should build on the same dashboard structure instead of forcing a redesign later

## [ ] `Phase 0` - `Research New Workspace Foundation`

### Summary

`Phase 0` should study how ParaHook currently creates, owns, and switches workspace or viewport modes so `Dashboard` and `Notepad` can be added on top of a real foundation instead of being bolted on blindly.

This is a research phase, not a feature-build phase.

### Goals

- inspect how current workspace or viewport modes are defined
- identify the real owner seams for:
  - mode registration
  - mode switching
  - surface rendering
  - layout/state persistence
- determine what is reusable versus what must be expanded to support `Dashboard` and `Notepad`
- identify whether one generalized workspace foundation improvement should land before either new mode is added

### Current Live Read

The current codebase already has a real workspace-mode and viewport-slot foundation.

The strongest current owner seams appear to be:
- `src/app/AppShell.tsx`
  - high-level workspace composition
  - slot rendering
  - viewport frame wiring
  - slot-level surface switching callbacks
- `src/app/workspace/useWorkspaceStore.ts`
  - workspace slot tree state
  - split, float, popout, redock, and slot-surface mutation
  - viewport chrome and detached surface ownership
- `src/app/workspace/workspaceShellTypes.ts`
  - canonical workspace types
  - current `WorkspaceSurfaceKind` union
  - slot and detached-surface ownership shapes
- `src/app/workspace/ViewportFrame.tsx`
  - local viewport header and slot chrome
  - split, float, popout, close, and kind-switch affordances
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - surface-kind to rendered-surface resolution
- `src/app/workspace/workspaceSurfaceActions.ts`
  - workspace-aware float, popout, redock, and split helper actions
- `src/app/workspace/workspacePersistence.ts`
  - persisted workspace snapshot normalization and restore

Important read:
- `Dashboard` and `Notepad` probably should not invent a second unrelated mode system
- they should most likely ride the existing `Workspace 7.x` slot and surface architecture if they are meant to be honest workspace or viewport modes

### Locked Direction

The locked direction for `Phase 0` should be:
- study the current workspace-slot system first
- determine whether `Dashboard` and `Notepad` should become new `WorkspaceSurfaceKind` values, a higher-level workspace wrapper, or one slotted surface plus one related editor surface
- prefer extending the current workspace seam over inventing a parallel dashboard-specific mode framework

Important non-goal:
- `Phase 0` should not silently turn into implementation of `Dashboard` or `Notepad`
- it should only make the next implementation seam obvious and safer

### Research Questions

`Phase 0` should answer at least these questions:

- should `Dashboard` be a new `WorkspaceSurfaceKind`
- should `Notepad` also be a new `WorkspaceSurfaceKind`, or should it be a specialized editor surface under a different ownership pattern
- how should these new surfaces appear inside:
  - the slot type picker
  - the viewport header
  - split, float, popout, and redock flows
- what state belongs in shared workspace state versus note-feature state
- what persistence should workspace layout own versus what note content persistence should own
- whether `Dashboard` and `Notepad` should support all host modes immediately or stage that parity later

### Proposed File Targets

The first research pass should read and annotate these files directly:

- `src/app/workspace/workspaceShellTypes.ts`
  - confirm where new surface kinds would be introduced
- `src/app/workspace/useWorkspaceStore.ts`
  - confirm which slot and detached-surface flows would need widening
- `src/app/workspace/ViewportFrame.tsx`
  - confirm how a new surface kind enters the local viewport header and kind picker
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - confirm where a new surface kind is actually rendered
- `src/app/workspace/workspaceSurfaceActions.ts`
  - confirm float, popout, split, and restore expectations for a new surface kind
- `src/app/workspace/workspacePersistence.ts`
  - confirm snapshot and restore implications
- `src/app/AppShell.tsx`
  - confirm current high-level slot rendering and special-case assumptions that may still be viewer, browser, console, or spaghetti specific

Useful supporting docs:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- the live `Workspace 7.x` family docs under `docs/Human-Plans/Architecture/Workspace-Modes/`

### Important Rule

- do not start building `Dashboard` or `Notepad` until the workspace foundation is understood clearly enough
- this phase should reduce implementation risk, not drift into speculative redesign

### Recommended Implementation Order

1. Audit the current workspace surface family and write down the existing live kinds:
   - `modelViewer`
   - `browser`
   - `console`
   - `spaghettiEditor`
2. Trace how one new surface kind would flow through:
   - type definitions
   - slot creation
   - slot switching
   - rendering
   - float and popout
   - persistence and restore
3. Identify all current special-case assumptions in `AppShell.tsx`, `ViewportFrame.tsx`, and workspace action helpers that would block `Dashboard` or `Notepad` from behaving like first-class surfaces.
4. Decide whether the next safest build seam is:
   - adding `Dashboard` first as one new workspace surface kind
   - or first extracting one more generalized workspace registration seam before any new surface kind is added
5. Record the result back into this doc so `Phase 1` starts from one concrete owner model instead of reopening the same research.

### Verification Shape

This is a research phase, so verification should focus on truthfulness of the read rather than shipping behavior.

Useful verification outputs:
- one clear owner inventory for the workspace foundation
- one explicit list of files likely to change first
- one explicit list of current blockers or special cases
- one recommended first implementation seam for `Phase 1`

### Acceptance Shape

- there is a clear read on how a new workspace mode should be introduced in ParaHook
- the likely file owners and architecture seams are known
- the later dashboard phases can proceed without guessing about workspace ownership
- the team can say whether `Dashboard` and `Notepad` should extend the existing surface-kind system directly or whether one smaller workspace generalization cut is needed first

## [ ] `Phase 1` - `Create Dashboard Workspace Foundation`

### Summary

`Phase 1` should create the base `Dashboard` workspace or viewport mode.

This phase is about making `Dashboard` real as a destination inside ParaHook before any meaningful widget system exists.

### Goals

- add `Dashboard` as a real workspace or viewport mode
- give it a dedicated entry path in the app
- define the base surface where widgets will later live
- establish the first board-like layout area

### Important Rule

- do not try to solve note editing, sticky behavior, and utility widgets all in this first phase
- the goal is to create the home surface first

### Acceptance Shape

- the user can enter a real `Dashboard` mode
- the surface has a stable layout and ownership model
- later widgets have a clear place to attach

## [ ] `Phase 2` - `Create Notepad Workspace And Shared Note Model`

### Summary

`Phase 2` should add `Notepad` as its own workspace or viewport mode and introduce the shared note model behind the feature.

This is the phase that makes note creation and editing real.

### Goals

- add `Notepad` as a focused writing workspace
- support creating and editing notes
- add autosave
- define one shared note model that later dashboard widgets can read

### Important Rule

- `Notepad` should not be implemented as only a dashboard card editor
- it should be its own useful writing surface

### Acceptance Shape

- the user can enter `Notepad`
- the user can create, edit, and reopen notes
- notes are stored through one shared data model rather than through widget-local state only

## [ ] `Phase 3` - `Add Sticky Notes As The First Dashboard Widget`

### Summary

`Phase 3` should connect `Notepad` and `Dashboard` by introducing `Sticky Notes` as the first real widget.

This is where the dashboard starts to become useful rather than only structural.

### Goals

- allow notes to be pinned from `Notepad` into `Dashboard`
- render pinned notes as sticky-note cards
- support drag placement on the dashboard
- support opening a sticky note back into `Notepad`

### Important Rule

- `Sticky Notes` should read from the shared note model
- do not create a second isolated card-only note system

### Acceptance Shape

- a note can be written in `Notepad`
- that note can be pinned into `Dashboard`
- the pinned note appears as a movable sticky note
- the user can reopen it for editing

## [ ] `Phase 4` - `Add Sticky Note Styling And Board Organization`

### Summary

`Phase 4` should make `Sticky Notes` feel like a real board system instead of just movable plain cards.

### Goals

- add color or style presets
- add resizing if it feels necessary
- improve note placement behavior
- add the first lightweight organization tools such as groups, tags, or named boards if the model is ready

### Important Rule

- keep the organization model light
- do not turn the first dashboard pass into a full productivity suite

### Acceptance Shape

- sticky notes are visually distinguishable
- the board is easier to scan and organize
- the note system still feels simple rather than overloaded

## [ ] `Phase 5` - `Expand Dashboard With Additional Widgets`

### Summary

`Phase 5` should add the first non-note widgets once the note workflow is already solid.

Good first candidates:
- `Time`
- `Weather`

### Goals

- add one or two small utility widgets
- confirm that the dashboard structure scales beyond sticky notes
- preserve the note-centered identity of the feature

### Important Rule

- new widgets should not displace notes as the main reason the dashboard exists
- each added widget should justify its presence clearly

### Acceptance Shape

- dashboard can host more than one widget type
- notes still remain the central feature
- the feature is ready for slower future expansion without redesigning the whole system

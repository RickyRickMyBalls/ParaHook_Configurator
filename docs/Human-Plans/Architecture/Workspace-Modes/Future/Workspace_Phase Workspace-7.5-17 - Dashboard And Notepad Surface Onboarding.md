# Workspace Phase Workspace-7.5-17 - Dashboard And Notepad Surface Onboarding

## Doc Header

### Doc History
1. 2026-04-03 19:38: Added this native `Workspace 7.5-17` future phase doc to promote `Dashboard` from `Wish-Features` into the real workspace-family execution lane, grounded the first research pass in the live `Workspace 7.x` slot and surface seams across `workspaceShellTypes`, `ViewportFrame`, `ViewportSurfaceRegistry`, `useWorkspaceStore`, `workspaceSurfaceActions`, `workspacePersistence`, and `AppShell`, and locked the first implementation order where `Dashboard` lands as the first new surface before `Notepad` while note content persistence stays outside workspace-layout persistence

### Purpose

Use this phase to onboard `Dashboard` and `Notepad` as honest workspace surfaces inside the existing `Workspace 7.x` architecture.

The goal is not to invent a parallel dashboard-mode framework.
The goal is to extend the current slot, detached-surface, and surface-kind system so these surfaces can live where `Browser`, `Console`, `Spaghetti Editor`, and `Model Viewport` already live.

### Scope

This phase covers:
- promoting `Dashboard` out of `Wish-Features` and into the real workspace-family roadmap
- the first code-backed owner audit for onboarding new surfaces
- deciding what should live in workspace layout state versus note-feature state
- the first implementation order for `Dashboard`, `Notepad`, and later `Sticky Notes`
- the rule that `Sticky Notes` is a dashboard widget, not a separate workspace surface kind

This phase does not cover:
- shipping every widget idea in the first cut
- rich-text or document-suite behavior
- cloud sync or collaboration
- a second parallel persistence system for workspace layout
- utility widgets beyond the note-centered first identity

## Doc Body

### Summary

`Workspace 7.5-17` is the real feature-promotion lane for `Dashboard`.

The product-shape source still lives in:
- `docs/Human-Plans/Wish-Features/Dashboard/Dashboard.md`

The execution-planning home now lives here because the feature is no longer only a wish:
- `Dashboard` and `Notepad` both want to be honest workspace surfaces
- the current workspace architecture already has a real surface-kind, slot, detach, redock, and persistence model
- the next job is to onboard these surfaces through that existing model instead of sketching a second mode system next to it

### Promotion Read

This feature is ready to be treated as real because the current codebase already has the right architecture class for it:
- one `WorkspaceSurfaceKind` union
- one viewport-slot tree
- one detached-surface model for floating and popout
- one surface switch seam in the slot chrome
- one render registry for per-surface content

That means the question is no longer "should dashboard exist only as a wish"
The question is "what is the safest first surface-onboarding cut"

### Current Code-Backed Read

The first research pass against the live code says the onboarding seams are real and finite:

- `src/app/workspace/workspaceShellTypes.ts`
  - defines the canonical `WorkspaceSurfaceKind` union
  - defines slot, retained-surface, detached-surface, and persistence shapes
  - currently hard-codes generated ids for `modelViewer`, `browser`, `console`, and `spaghettiEditor`
- `src/app/workspace/ViewportFrame.tsx`
  - owns the visible surface labels and the slot type picker / action menu options
  - currently hard-codes the same four surface kinds
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - resolves each surface kind to its rendered surface component
  - currently branches explicitly for `browser`, `console`, and `spaghettiEditor`, with `modelViewer` handled outside through the viewport host
- `src/app/workspace/useWorkspaceStore.ts`
  - owns slot creation, slot switching, split, detach, redock, retained-surface restore, and detached-surface bookkeeping
  - is already the real owner seam for introducing new slotted or detached surfaces
- `src/app/workspace/workspaceSurfaceActions.ts`
  - wraps the shared float, split, popout, and redock verbs
  - still contains explicit behavior branches for the current four surface families
- `src/app/workspace/workspacePersistence.ts`
  - serializes and normalizes the workspace layout snapshot
  - currently enumerates the existing four surface kinds and keeps `Spaghetti Editor` placement in its own separate editor-surface band
- `src/app/AppShell.tsx`
  - still carries feature-specific host glue and browser or editor special-cases
  - but already consumes the generic viewport tree and workspace action seams rather than inventing a one-off slot system per feature

### Locked Answers After Phase 0

The first research pass should be treated as answering these planning questions:

- should `Dashboard` be a new `WorkspaceSurfaceKind`
  - yes
- should `Notepad` also be a new `WorkspaceSurfaceKind`
  - probably yes, but its content model must stay separate from workspace layout persistence
- should `Sticky Notes` be a new `WorkspaceSurfaceKind`
  - no
- what belongs in workspace state
  - surface kind
  - slot presence
  - retained surface instance ids
  - detached host mode
  - surface placement and restore
  - active surface targeting
- what should stay outside workspace layout state
  - note records
  - note bodies and titles
  - pin metadata
  - sticky note board positions
  - later note tags or categories
- should `Dashboard` and `Notepad` try to invent a second mode framework
  - no

### First Implementation Recommendation

The safest first execution order is:

1. add `Dashboard` first as the first new `WorkspaceSurfaceKind`
2. make that first dashboard surface a simple slotted or floating board shell with honest workspace routing
3. keep `Dashboard` free of note-editing and widget complexity in its first cut
4. add `Notepad` second with its own surface plus a separate note-data store
5. add `Sticky Notes` only after the shared note model exists and `Dashboard` can read it

Why this is the safest order:

- `Dashboard` proves the workspace onboarding seam without also solving note persistence
- `Notepad` is harder because it needs both surface onboarding and a real shared note model
- `Sticky Notes` depends on the note model and should not force a fake widget-local note system

### First Real Blockers

The first research pass exposed a small set of real blockers, not a vague unknown:

- surface-kind hard-codes currently exist in:
  - `workspaceShellTypes.ts`
  - `ViewportFrame.tsx`
  - `ViewportSurfaceRegistry.tsx`
  - `workspacePersistence.ts`
  - several console workspace-mode helpers
- `workspaceSurfaceActions.ts` still assumes special-case behavior only for the currently shipped surface families
- `AppShell.tsx` and selector helpers still contain Browser and Spaghetti-specific host behavior that later surfaces must either ignore safely or widen carefully
- `Spaghetti Editor` currently has its own placement and binding model; `Notepad` should not casually reuse that editor-specific structure without deciding what its own note-surface placement model really wants to be

### Phase 0 - Research New Workspace Foundation
#### Header

Status:
- [x] completed as the first promotion pass

What this phase resolved:
- the dashboard feature should extend the existing workspace surface-kind model directly
- the first new surface should be `Dashboard`
- `Notepad` should follow as its own surface plus a separate note store
- note content and board data should not be stored inside the workspace layout snapshot

Likely first code files for the first runtime cut:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/AppShell.tsx`
- one new dashboard surface component under `src/app/workspace/` or `src/app/panels/`

Done shape:
- the first real code slice can start without reopening the basic ownership question
- the workspace family has a canonical planning home for this feature
- the old wish doc can stay product truth while this doc becomes execution truth

## [ ] Phase 1 - Dashboard Surface Kind Adoption
### Header

Purpose:
- make `Dashboard` real as a workspace surface before note editing or widgets widen the scope

Main work:
- add `dashboard` to the workspace surface-kind union and generated-id helpers
- widen the slot picker, viewport labels, and render registry to recognize `Dashboard`
- add a first dashboard surface component with a simple board or empty-state shell
- make the new surface survive slot switching, split, float, popout, redock, and layout persistence through the shared workspace model
- keep the first cut free of shared note-model work

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/AppShell.tsx`
- one new dashboard surface component
- focused workspace shell tests

Done shape:
- the user can switch a non-primary slot to `Dashboard`
- `Dashboard` renders as a real surface inside the slot tree
- the new surface can ride the shared split, float, popout, redock, and restore rules without inventing a dashboard-only host system
- the surface is ready for note or widget work later

## [ ] Phase 2 - Notepad Surface And Shared Note Model
### Header

Purpose:
- add `Notepad` as its own surface while creating the first honest note model

Main work:
- add `notepad` as a second new workspace surface kind
- create one shared note store or persistence seam outside the workspace layout snapshot
- support basic note create, edit, reopen, and autosave behavior
- let `Notepad` behave as a focused editor surface rather than a dashboard card editor

Important rule:
- do not store note documents inside the workspace layout state
- do not reuse the `Spaghetti Editor` placement model blindly just because it is another editor-shaped surface

Done shape:
- the user can open `Notepad` as a real workspace surface
- note records persist through a dedicated feature store
- `Dashboard` and later widgets can read the same note model instead of inventing a second note system

## [ ] Phase 3 - Sticky Notes Widget First Usefulness Pass
### Header

Purpose:
- make `Dashboard` useful by reading the shared note model and rendering pinned notes as dashboard widgets

Main work:
- pin and unpin notes
- render pinned notes as sticky-note cards inside `Dashboard`
- store board placement in the note or dashboard feature model, not in workspace layout persistence
- reopen a pinned note back into `Notepad`

Important rule:
- `Sticky Notes` remains a widget inside `Dashboard`
- it should not become a third new workspace surface kind

Done shape:
- `Dashboard` has its first real utility
- `Notepad` and `Dashboard` share one note model
- moving or pinning notes does not fracture the data model

### Carry Forward

Later widgets such as `Time` or `Weather` stay deferred until:
- `Dashboard` exists as a stable surface
- `Notepad` exists as a stable note editor surface
- `Sticky Notes` proves the dashboard identity first

# Dashboard Phase Dashboard-1 - Create Dashboard Workspace Foundation

## Doc Header

### Doc History
3. 2026-04-03 20:05: Marked `Dashboard-1` shipped after the runtime implementation landed across the shared workspace surface seams, recorded that `dashboard` now works in the main workspace slot tree with split, float, popout, redock, persistence, and focused regression coverage, and kept console workspace-modes plus popup-local shell adoption explicitly deferred
2. 2026-04-03 19:51: Tightened this phase into a truly implementation-ready first command by re-reading the live surface-owner seams in `useAppShellViewportActions`, `PopupWorkspaceShell`, `stagedNavigation`, and `radioCommandIdentity`, locking `Dashboard-1` to main-workspace `dashboard` surface-kind adoption plus a minimal shell, and explicitly deferring console workspace-modes and popup-local child-window surface adoption to later follow-ons
1. 2026-04-03 19:44: Added this first dedicated dashboard-family future phase doc by lifting `Phase 1 - Create Dashboard Workspace Foundation` out of the umbrella `Dashboard.md`, grounding it in the live `Workspace 7.x` surface seams across `workspaceShellTypes`, `ViewportFrame`, `ViewportSurfaceRegistry`, `workspaceViewportLabels`, `useWorkspaceStore`, `workspaceSurfaceActions`, `workspacePersistence`, and `AppShell`, and locking the first implementation slice as `dashboard` surface-kind adoption plus a minimal board shell before note-model work starts

### Purpose

Use this phase to make `Dashboard` real as a workspace surface inside the existing ParaHook workspace architecture.

The goal is not to ship sticky notes, notepad editing, or utility widgets all at once.
The goal is to prove one honest `Dashboard` surface kind that can live in the slot tree, detach, redock, and persist through the same workspace rules as the current surfaces.

### Scope

This phase covers:
- adding `Dashboard` as a new workspace surface kind
- making it available through the viewport type picker and related labels
- rendering a first dashboard surface shell inside a workspace slot
- making that first shell participate in split, float, popout, redock, and restore behavior through the shared workspace model
- defining the first minimal dashboard UI surface that later note widgets can attach to

This phase does not cover:
- `Notepad`
- shared note persistence
- `Sticky Notes`
- rich dashboard widgets
- a full visual polish pass
- a second dashboard-specific host or layout system

## Doc Body

### Summary

`Dashboard-1` is the first real implementation slice for the dashboard family.

Current status:
- shipped in the main workspace shell on `2026-04-03`
- console `Workspace Modes` adoption still deferred
- popup-local `PopupWorkspaceShell` adoption still deferred

The current codebase already has the right architectural base for this cut:
- one `WorkspaceSurfaceKind` union
- one viewport-slot tree
- one detached-surface model
- one slot type picker
- one render registry
- one workspace persistence pipeline

That makes the first honest job very small conceptually:
- add one more surface kind
- let the workspace shell host it
- keep the surface itself intentionally simple

### Current Code-Backed Read

The current owner seams for this phase are:

- `src/app/workspace/workspaceShellTypes.ts`
  - add the new canonical `dashboard` surface kind
  - widen generated instance-id helpers
  - keep retained-surface and detached-surface ownership compatible with the new kind
- `src/app/workspace/ViewportFrame.tsx`
  - add the `Dashboard` visible label
  - expose it in the viewport type picker for eligible slots
- `src/app/workspace/workspaceViewportLabels.ts`
  - give `Dashboard` a truthful viewport label in workspace and console-facing UI
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - render the first dashboard surface component
- `src/app/workspace/useWorkspaceStore.ts`
  - ensure slot switching, retained-surface reuse, detach, redock, and slot creation all accept `dashboard`
- `src/app/workspace/workspaceSurfaceActions.ts`
  - verify shared float, popout, split, and redock actions do not accidentally assume only the current four kinds
- `src/app/workspace/workspacePersistence.ts`
  - widen normalization and serialization so `dashboard` survives saved layout restore
- `src/app/AppShell.tsx`
  - verify current workspace-tree and host glue do not special-case `dashboard` out of normal slot behavior
- `src/app/hosts/useAppShellViewportActions.ts`
  - widen the explicit slot-surface switch union so header actions can move a slot into `dashboard`
  - verify close, float, popout, and split helpers stay truthful for a new non-viewer, non-browser, non-console surface
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - currently hard-codes the popup-local available surface kinds
  - this is a known later follow-on seam, not required for the first main-workspace cut
- `src/app/console/stagedNavigation.ts`
  - currently hard-codes the `Workspace Modes` viewport-type action list and supported viewport kinds
  - this should stay out of `Dashboard-1` unless the scope is explicitly widened
- `src/app/console/radioCommandIdentity.ts`
  - currently hard-codes the console `workspace.viewport.type.*` action identities
  - this is another later follow-on seam tied to console workspace-modes adoption, not the first runtime surface cut

### Locked Direction

`Dashboard-1` should:
- add `dashboard` as the next honest `WorkspaceSurfaceKind`
- render one minimal board shell
- behave like a first-class workspace surface
- avoid note-model work entirely

`Dashboard-1` should not:
- add `notepad` in the same cut
- invent a dashboard-only persistence layer
- depend on widget architecture before the first surface exists
- widen into a broad shell cleanup unless a blocker proves that is strictly necessary

### Locked Execution Boundary

In scope for `Dashboard-1`:
- main-workspace slot-tree adoption of `dashboard`
- the in-app viewport type picker, labels, and registry path
- one minimal `DashboardSurface` render shell
- main-workspace split, float, popout, redock, and restore parity
- persistence and focused regression coverage

Explicitly out of scope for `Dashboard-1`:
- `Notepad`
- note persistence or shared note models
- sticky notes or any widget runtime
- console `Workspace Modes` staged-navigation adoption for `Dashboard`
- console radio-command identity additions for `workspace.viewport.type.dashboard`
- popup-local multi-viewport child-window switching to `dashboard` inside `PopupWorkspaceShell`
- dashboard-specific data stores, board saves, or layout rules

Important truth:
- this phase only needs `Dashboard` to work as a real surface in the main workspace shell
- later console and popup-local adoption should be treated as follow-on phases, not hidden inside the first command

### Minimal Product Shape For This Phase

The first shipped `Dashboard` surface only needs:
- a visible `Dashboard` surface type in the slot picker
- a rendered board-like shell or placeholder
- a stable title and identity
- a calm empty-state message that implies future widget space

It does not need:
- editable notes
- card dragging
- board saves
- widget chrome
- time or weather

### First Pass Decisions

- `Dashboard` should behave like `Browser`, `Console`, and `Spaghetti Editor` as a secondary slot surface, not as a new primary-slot surface.
- The protected primary slot should stay `modelViewer`-only in this phase.
- `dashboard` should get normal generated per-slot surface ids and retained-surface reuse through the existing slot model.
- The first visual shell should be static and calm: title, board container, and empty-state copy only.
- No dashboard-only store should be introduced before there is real board data to own.

### Exact First Code Cut

The implementation-ready first cut is:

1. Add `dashboard` to `WorkspaceSurfaceKind` and all generated-id or retained-surface helpers in `workspaceShellTypes.ts`.
2. Add a minimal `DashboardSurface` component and render it from `ViewportSurfaceRegistry.tsx`.
3. Widen `ViewportFrame.tsx`, `workspaceViewportLabels.ts`, and `useAppShellViewportActions.ts` so a non-primary slot can switch into and out of `Dashboard`.
4. Widen `useWorkspaceStore.ts`, `workspaceSurfaceActions.ts`, `workspacePersistence.ts`, and any necessary `AppShell.tsx` call sites so split, float, popout, redock, and restore remain truthful in the main workspace.
5. Add focused regression coverage, then stop without widening into console staged-navigation or popup-local child-window surface switching.

### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/useAppShellViewportActions.ts`
- one new dashboard surface component under `src/app/workspace/` or `src/app/panels/`
- focused tests around workspace slot switching, host-mode actions, and persistence

### Recommended New File

- `src/app/workspace/DashboardSurface.tsx`
  - own the first minimal board shell
  - stay presentation-only in this phase
  - expose obvious future attachment points for widgets without inventing those widgets yet

### Follow-On Seams Already Known

These seams are real, but they should stay outside `Dashboard-1`:

- `src/app/console/stagedNavigation.ts`
  - add `Dashboard` to `Workspace Modes > Viewport Type Menu`
- `src/app/console/radioCommandIdentity.ts`
  - add the matching console action identity for `workspace.viewport.type.dashboard`
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - decide later whether popup-local child-window shells should also switch into `Dashboard`

If any of those need work during implementation, that means the phase boundary should be revisited explicitly instead of widened silently.

### Implementation Risks

The most likely risks in this phase are:

- hard-coded surface-kind unions in workspace and console helpers
- generated instance-id assumptions that currently know only the four shipped kinds
- persistence normalization branches that reject unknown surface kinds
- shell action helpers that treat Browser, Console, and Spaghetti as the only non-viewer families

Healthy constraint:
- if this phase discovers a blocker that affects all future surface onboarding, document that blocker clearly but do not silently widen `Dashboard-1` into a general architecture rewrite

## [x] Phase Checklist

- [x] Add `dashboard` to the canonical workspace surface-kind union and generated-id helpers
- [x] Add one first `DashboardSurface` component and register it in the main viewport surface registry
- [x] Make the in-app slot type picker and viewport labels expose `Dashboard` for non-primary slots
- [x] Widen main-workspace slot switching through `useAppShellViewportActions.ts`
- [x] Verify slot switching can move into and out of `Dashboard` without stale retained-surface behavior
- [x] Verify split, float, popout, redock, and restore accept `dashboard` in the main workspace shell
- [x] Verify workspace layout persistence can serialize and restore `dashboard`
- [x] Add focused regression coverage for slot switching and host-mode behavior
- [x] Keep console workspace-modes adoption, popup-local shell adoption, `Notepad`, and widget work deferred to later phases

## [ ] Verification Shape

Minimum verification for this phase should cover:

- switching a non-primary slot from `Browser`, `Console`, or `Spaghetti Editor` into `Dashboard`
- switching a `Dashboard` slot back into `Browser`, `Console`, and `Spaghetti Editor`
- splitting a `Dashboard` slot and confirming the new slot behaves like the existing shared workspace rules
- floating and redocking a `Dashboard` surface in the main workspace
- popping out and restoring a `Dashboard` surface through the normal detached-surface path
- reloading persisted workspace layout with a `Dashboard` slot present
- confirming the protected primary slot still refuses non-`modelViewer` kinds
- confirming no console staged-navigation or popup-local child-window assumptions were accidentally half-adopted

### Done Shape

`Dashboard-1` is done when:

- the user can open `Dashboard` as a real workspace surface
- the main workspace shell treats it as part of the normal slot and host-mode model
- the first dashboard shell exists without dragging note-model complexity into the same cut
- the phase ends with console workspace-modes and popup-local adoption still clearly deferred instead of partially implied
- later dashboard phases can build on a real hosted surface instead of a speculative placeholder architecture

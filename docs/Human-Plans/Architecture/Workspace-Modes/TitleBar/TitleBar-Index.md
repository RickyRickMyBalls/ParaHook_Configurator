# TitleBar Index

## Doc Header

### Doc History
7. 2026-05-18 11:12:21: Marked `Titlebar-1 / Phase 3 - Regression Proof And Closeout` shipped after the focused titlebar split-menu regression pass proved direct split preservation, selected workspace type split callback separation, canonical workspace type reuse, disabled/no-callback inertness, tree-level Browser split routing, and production build verification, completing the `Titlebar-1` family phase.
6. 2026-05-18 11:08:40: Prepped `Titlebar-1 / Phase 3 - Regression Proof And Closeout` in the active family doc, narrowing the next task to regression coverage for direct split preservation, selected workspace type split routing, canonical workspace type reuse, disabled/no-callback safeguards, and final `Titlebar-1` closeout without broad titlebar redesign or parity widening.
5. 2026-05-18 10:13:04: Marked `Titlebar-1 / Phase 2 - Selected Workspace Split Action` shipped after titlebar split-direction workspace-type choices became active through the shared `ViewportFrame` to `WorkspaceViewportTree` to `splitViewportSlot(..., { surfaceKind })` path, advancing the family to Phase 3 regression proof and closeout.
4. 2026-05-18 09:09:06: Prepped `Titlebar-1 / Phase 2 - Selected Workspace Split Action` for implementation in the active family doc, grounding the next task in the existing `ViewportFrame` third-level menu, `WorkspaceViewportTree` callback bridge, and `splitViewportSlot(..., { surfaceKind })` store path.
3. 2026-05-18 08:50:02: Marked `Titlebar-1 / Phase 1 - Nested Split Direction Menu` shipped after the shared `ViewportFrame` titlebar menu gained third-level canonical workspace-type display submenus under split directions, preserving direct split clicks and advancing the next task to Phase 2 selected workspace split actions.
2. 2026-05-18 08:15:50: Prepped `Titlebar-1 / Phase 1 - Nested Split Direction Menu` for implementation in the active family doc, keeping the next task scoped to `ViewportFrame` menu-state and canonical-choice display without selected workspace split mutation.
1. 2026-05-18 08:08:05: Added this `TitleBar` family index to route the first titlebar-specific workspace-shell phase, `Titlebar-1 - Split Direction Workspace Type Menu`, while keeping the family scoped to shared titlebar interaction planning instead of widening into all workspace chrome.

### Purpose

This file is the umbrella planning index for the `TitleBar` workspace-shell family.

Use it to answer:
- what titlebar-specific workspace shell interactions live in this family
- where the active titlebar implementation plan lives
- how titlebar menu behavior stays shared instead of surface-local
- what should happen next after the first titlebar split-menu phase

### Scope

This doc covers:
- shared workspace titlebar interaction planning
- titlebar context-menu behavior
- titlebar split-authoring affordances
- routing to the active `Titlebar-1` future phase

This doc does not cover:
- workspace body UI behavior
- broad titlebar visual redesign
- floating, popup, or pop-out chrome parity unless a later titlebar phase explicitly owns it
- new workspace surface registration
- geometry, export, or content-authoring behavior

### Family Structure

- `TitleBar-Index.md`
  - umbrella scan surface and current routing
- `Future/`
  - active and future TitleBar family phase docs
- `Shipped/`
  - completed TitleBar records when a whole family phase is archived

Current roadmap home:
- architecture parent:
  - `Workspace-Modes`
- active architecture family phase:
  - `Titlebar-1 - Split Direction Workspace Type Menu`

## Doc Body

### Short Version

The `TitleBar` family owns shared workspace titlebar interaction planning.

The first planned feature is a richer right-click split menu:
- right-click a workspace titlebar
- hover `Split`
- hover a split direction such as `Split Right`
- either click the direction directly for the default split behavior or choose a canonical workspace type from a third-level submenu

The key rule is:
- titlebar split authoring should stay shared and canonical, not copied into each workspace surface body

### Current Status

`Titlebar-1` has completed its internal implementation phases.

Shipped inside `Titlebar-1`:
- Phase 1:
  - `Nested Split Direction Menu`
- Phase 2:
  - `Selected Workspace Split Action`
- Phase 3:
  - `Regression Proof And Closeout`

Current next task:
- no open `Titlebar-1` implementation phase is currently recorded

### Cross-Doc Boundaries

`TitleBar` owns:
- shared titlebar interaction planning
- shared titlebar context-menu behavior
- split-menu affordance shape
- titlebar-specific routing to canonical workspace type choices

`TitleBar` does not own:
- the canonical workspace surface catalog itself
- the workspace split store as a new owner
- individual workspace surface body controls
- broad shared shell adoption rules beyond titlebar interaction details

Neighbor ownership:
- `Workspace-Modes`
  - overall workspace shell, slot tree, surface placement, split, floating, and pop-out architecture
- `Workspace-11`
  - future shared shell adoption contract for new workspace surfaces
- `ViewportFrame`
  - likely runtime owner for shared slotted titlebar UI
- `WorkspaceViewportTree`
  - likely runtime bridge from slot state into titlebar action callbacks
- `workspaceViewportTypeChoices`
  - canonical workspace type list and labels for the third-level menu

### Active Family Phases

#### `Titlebar-1 - Split Direction Workspace Type Menu`

Plan:
- [Titlebar-1 - Split Direction Workspace Type Menu](./Future/Titlebar-1%20-%20Split%20Direction%20Workspace%20Type%20Menu.md)

Purpose:
- add a third-level canonical workspace type menu under each split direction in the workspace titlebar right-click menu

Done shape:
- direct split direction clicks still work
- direction-plus-workspace-type selections split the current pane and open the selected surface type in the new pane
- the third-level menu reads from the same canonical viewport type choices as the existing viewport type picker

## Vision

The user-facing promise is:
- titlebar actions feel consistent across workspace panes
- advanced split authoring stays discoverable from the titlebar
- users can create the workspace layout they want in one menu flow
- new canonical workspace types should naturally appear in titlebar split choices

What must stay true:
- titlebar behavior stays shared where possible
- workspace type lists stay canonical
- split mutations stay owned by the workspace shell/store path
- individual workspace surface bodies do not become titlebar-menu owners

# Browser Phase Browser-4 - Row Click And Action Ownership Cleanup

## Doc Header

### Doc History
3. 2026-03-25 01:14: Marked Browser-4 shipped after the row-click and action-ownership cleanup landed in code, and moved this phase record from `Future/` to `Shipped/`
2. 2026-03-25 01:07: Turned this Browser-4 phase into an implementation-ready spec by locking the fixed row-slot template, family-specific single-click behavior, explicit expand/collapse ownership, double-click focus rules, inline-versus-context-menu action ownership, and the hard rule that Browser row click never directly triggers build behavior
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the later row-click and explicit-action cleanup now has its own planning home under `Browser/Future/` instead of living only as a broader Browser cleanup reminder

### Purpose

This phase simplifies Browser row interaction ownership.

Use it to answer:
- what plain row click means
- what double-click means
- which actions should live on explicit controls instead of normal row click

## Doc Body

## [x] Browser-4 - Row Click And Action Ownership Cleanup

### Summary

Make Browser row interaction predictable by separating:
- single-click selection/context
- double-click open/focus
- explicit branch expand/collapse
- explicit visibility/build-policy controls
- lower-frequency right-click actions

This phase turns Browser rows into one shared interaction grammar instead of several drifting row-family behaviors.

### Owns

- plain left-click behavior
- double-click behavior
- explicit expand/collapse ownership
- inline control ownership versus right-click action ownership
- the fixed Browser row-slot template for ordinary tree rows
- removal of legacy row quick actions that no longer justify permanent inline space

### Does Not Own

- Browser build-policy mode semantics
- Browser-5 selection/focus sync across all workspace surfaces
- Browser-6 deeper BrowserPanel decomposition
- runtime build dispatch behavior

### Public Interfaces And State

This phase should not introduce a second Browser-local interaction truth.

Use existing Browser row VM generation and BrowserPanel row-rendering seams:
- Browser row VMs continue to define row kind and supported actions
- BrowserPanel owns row-event dispatch and row-template rendering
- app/store state continues to own selected targets, active graph/editor context, visibility, and build policy

If additional row-action capability flags are needed, add them to row VMs rather than hard-coding more implicit row-kind branching in the panel.

### Fixed Row Template

Ordinary Browser rows should converge on one fixed left-to-right slot template:

1. branch control slot
2. row/type icon slot
3. visibility slot
4. main loading-bar label surface

Rules:
- the row/type icon slot also carries Browser build-policy color where supported
- unsupported controls use passive placeholders rather than changing row geometry
- keep slots aligned across graph/content/reference/sketch/viewport rows
- section headers may keep their own section-shell layout, but ordinary rows should stop inventing per-family geometry

### Click Ownership

Lock the interaction model to these rules:

- plain row click never directly triggers build behavior
- expand/collapse belongs only to the explicit branch control for ordinary tree rows
- section headers may keep their own dedicated collapse affordance
- lower-frequency row actions live in the right-click menu rather than on the main row surface

### Row-Family Click Rules

Single-click is family-consistent by target domain, not globally identical for every row kind:

- content rows
  - single-click is selection-first against the actual scene/content object
  - this prepares for later viewer-side transform behavior where the user can move the Three.js solid without forcing a full replicad rebuild
- graph-document rows
  - single-click is graph-context select/focus rather than scene-object selection
- other row families
  - should follow the same target-domain rule instead of inventing hidden side effects

### Double-Click Rules

Double-click is the stronger open/focus gesture only where a row has a clear target surface or target context.

Examples that fit:
- graph-document rows
- open-editor rows
- later sketch/editor rows if they gain a clear stronger open action

Do not force a fake double-click meaning onto row families that do not have a real stronger target action.

### Inline Controls Versus Right-Click Actions

Keep inline only the controls with constant high-frequency value:
- branch control
- row/type icon slot
- visibility slot
- main loading-bar label surface

Additional rules:
- remove the legacy graph save quick button from the row surface
- keep export/save-style graph actions in the right-click menu
- move lower-frequency actions to the right-click menu instead of spending permanent inline row space on them

### Implementation Targets

Primary files likely touched in this phase:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserGraphRows.ts`
- Browser panel tests and any Browser row selector tests affected by row action capability flags

Recommended implementation order:

1. normalize ordinary Browser rows onto the fixed slot template
2. remove remaining legacy quick-action layout assumptions such as graph save
3. route expand/collapse strictly through branch controls
4. make single-click and double-click behavior explicit by row family
5. keep lower-frequency actions in the right-click menu only

### Test Plan

- Browser ordinary rows share the same fixed slot geometry even when some controls are passive
- graph save quick button is removed from graph rows
- branch control is the only ordinary-row expand/collapse owner
- row click does not toggle expand/collapse
- row click never directly triggers build behavior
- content-row single-click remains selection-first for scene/content targets
- graph-document single-click remains graph-context select/focus
- double-click performs the stronger open/focus action only on row families that actually support it
- right-click menu still exposes lower-frequency actions previously reachable from row-local affordances
- section headers keep their own dedicated collapse affordance without violating the ordinary-row rule set

### Assumptions

- Browser-1 through Browser-3 remain the shipped baseline underneath this cleanup.
- Browser-4 is allowed to change row-surface structure and event routing, but it should not redefine Browser build-policy semantics.
- Browser-5 later owns the wider workspace sync story; Browser-4 only needs to make row click/action ownership internally coherent.

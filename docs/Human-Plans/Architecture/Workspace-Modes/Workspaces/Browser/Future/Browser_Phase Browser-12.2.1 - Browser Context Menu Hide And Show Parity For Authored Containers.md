# Browser Phase Browser-12.2.1 - Browser Context Menu Hide And Show Parity For Authored Containers

## Doc Header

### Doc History
1. 2026-04-15 22:18:00: Created this first Codex-sized `Browser-12.2` follow-on so authored assembly/component visibility parity can start with the smallest Browser-local gap: matching right-click `Hide` / `Show` actions beside the already-live row eyeball

### Purpose

This phase adds Browser right-click visibility parity for authored containers.

Use it to:
- expose `Hide` / `Show` for authored `Assembly` and `Component` rows in Browser context menus
- keep Browser right-click on the same visibility authority as the existing row eyeball
- avoid widening the first `12.2` slice into console or keyboard command work

## Doc Body

## [ ] Browser-12.2.1 - Browser Context Menu Hide And Show Parity For Authored Containers

### Summary

The live Browser already exposes the authored-container visibility eye:
- authored `Assembly` and `Component` rows already derive aggregated `visibilityPartKeys`
- the row eyeball already toggles those descendant part memberships through the shared content visibility seam

The smallest remaining Browser-local gap is right-click parity:
- Browser context menu should expose `Hide` when the authored container is visible
- Browser context menu should expose `Show` when the authored container is hidden
- both actions should call the same underlying visibility authority as the row eyeball

### Owns

- Browser context-menu visibility entries for authored `Assembly` and `Component` rows
- choosing `Hide` versus `Show` from current row visibility truth
- routing context-menu visibility changes through the same authored content visibility seam as the row eyeball
- focused Browser panel/context-menu regressions for authored container visibility

### Does Not Own

- console selected-target visibility choices
- keyboard visibility shortcuts
- root command flows
- new authored-content visibility state separate from the current part-visibility seam

### Locked Direction

- keep one authored content visibility authority:
  - Browser right-click must reuse the same `setPartVisibility(...)` descendant fan-out the row eyeball already uses
- keep the phase Browser-local:
  - no console target-shape or input-routing work in this slice
- keep labels explicit:
  - use `Hide` when the row is currently visible
  - use `Show` when the row is currently hidden

### Current Seam Read

- `src/app/panels/browserTreeRowPresenter.tsx`
  - already renders the visibility eye for authored `Assembly` / `Component` rows when `visibilityPartKeys.length > 0`
- `src/app/panels/browserInteractions.ts`
  - already owns `handleToggleContentVisibility(...)`
  - already fans visibility changes across the row's aggregated descendant part keys
- `src/app/panels/browserContextMenu.ts`
  - already builds Browser right-click menus for nearby row behaviors
  - does not yet appear to expose matching authored container `Hide` / `Show` entries

### Ready-To-Start Checklist

- confirm authored `Assembly` and `Component` rows reach the context-menu builder with enough visibility data
- add `Hide` / `Show` entries for authored container rows
- route those entries through the same shared authored content visibility seam already used by the row eyeball
- cover visible and hidden authored container rows with focused Browser context-menu proof

### Acceptance Read

- right-clicking a visible authored `Assembly` row shows `Hide`
- right-clicking a hidden authored `Assembly` row shows `Show`
- right-clicking a visible authored `Component` row shows `Hide`
- right-clicking a hidden authored `Component` row shows `Show`
- committing those actions changes viewport visibility through the same authored content visibility seam already used by the row eyeball
- no Browser selection, drag, or build-policy behavior regresses

### Concrete Implementation Targets

Primary expected targets:
- `src/app/panels/browserContextMenu.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserInteractions.ts`

Supporting targets if needed:
- `src/app/panels/browserContextMenu.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`

### Assumptions

- Browser right-click parity is the smallest honest first slice because the authored container visibility seam itself is already live
- users should not have to rely only on the tiny row eyeball when Browser already has a context-menu surface for adjacent row actions

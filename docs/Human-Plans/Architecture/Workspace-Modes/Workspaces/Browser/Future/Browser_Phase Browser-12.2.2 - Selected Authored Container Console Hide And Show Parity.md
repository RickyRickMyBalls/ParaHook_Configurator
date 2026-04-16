# Browser Phase Browser-12.2.2 - Selected Authored Container Console Hide And Show Parity

## Doc Header

### Doc History
1. 2026-04-15 22:18:00: Created this second Codex-sized `Browser-12.2` follow-on so authored container visibility can reach the selected-target Console session after Browser-local right-click parity, without widening immediately into root command-pick flows

### Purpose

This phase exposes selected-target Console visibility actions for authored containers.

Use it to:
- expose `Hide` / `Show` when an authored `Assembly` or `Component` row is the selected target
- keep selected Console visibility on the same authority as Browser row/context-menu visibility
- avoid widening this slice into keyboard routing or root visibility command flows

## Doc Body

## [ ] Browser-12.2.2 - Selected Authored Container Console Hide And Show Parity

### Summary

After Browser-local parity lands, the next gap is selected-target Console parity.

Today:
- authored container visibility already exists in Browser through the row eyeball
- Browser right-click parity is the first queued `12.2.1` slice
- selected Console sessions for authored `Assembly` / `Component` rows still appear to expose rename/delete/zoom behavior without matching visibility actions

This slice fixes that selected-target gap:
- visible authored containers should expose `Hide`
- hidden authored containers should expose `Show`
- those actions should commit through the same authored content visibility seam already used by Browser

### Owns

- selected-target Console visibility eligibility for authored `Assembly` and `Component` rows
- adding `Hide` / `Show` to the selected authored-container staged-navigation sessions
- executing those selected-session actions through the shared authored content visibility seam
- focused selected-target Console regressions for authored container visibility

### Does Not Own

- Browser context-menu parity
- keyboard shortcut routing
- root command-pick visibility flows
- a global authored-content recovery command

### Locked Direction

- keep selected-target scope only:
  - do not add root `Hide` / `Show` pick flows in this slice
- keep one visibility authority:
  - selected Console actions must use the same authored content visibility seam as Browser
- match Browser wording:
  - prefer `Hide` / `Show` for authored containers instead of borrowing the reference-object `Unhide All` recovery language

### Current Seam Read

- `src/app/store/useAppStore.ts`
  - `WorkspaceSelectedTarget` already has authored `assembly` and `component` variants
  - those target shapes do not yet appear to carry selected-target visibility eligibility like `canHide` or `canShow`
- `src/app/console/stagedNavigation.ts`
  - `buildContentAssemblySelectedChoices(...)` currently exposes `New Component`, `Rename`, optional `Delete`, `Select All`, and `Zoom`
  - `buildContentComponentSelectedChoices(...)` currently exposes rename/delete/select-all only
  - neither selected authored-container session currently appears to expose visibility actions
- the Browser already has a live authored container visibility seam, so the next work is selected-target Console parity rather than inventing a second backend

### Ready-To-Start Checklist

- extend selected authored `assembly` / `component` console targets with visibility eligibility and current visible-state truth
- add `Hide` / `Show` choices to the selected authored-container staged sessions
- execute those actions through the shared authored content visibility seam
- request target-selection/console context resync after commits
- cover visible-versus-hidden selected authored containers with focused staged-navigation and Console proof

### Acceptance Read

- when a visible authored `Assembly` is selected, Console exposes `Hide`
- when a hidden authored `Assembly` is selected, Console exposes `Show`
- when a visible authored `Component` is selected, Console exposes `Hide`
- when a hidden authored `Component` is selected, Console exposes `Show`
- committing those actions updates viewport visibility through the same authored content visibility seam already used by Browser
- selected Console context stays synchronized after the visibility change

### Concrete Implementation Targets

Primary expected targets:
- `src/app/store/useAppStore.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/useConsoleInteraction.ts`

Supporting targets if needed:
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/useAppStore.test.ts`

### Assumptions

- selected-target Console parity is the next clean slice once Browser-local parity exists
- authored containers should use Browser-style `Hide` / `Show` wording instead of adopting the reference-only recovery vocabulary

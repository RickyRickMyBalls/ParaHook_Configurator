# Browser Phase Browser-12.2.3 - Selected Authored Container Keyboard Hide Parity

## Doc Header

### Doc History
2. 2026-04-15 23:05:00: Tightened this phase into implementation-prep shape after `Browser-12.2.2` landed, grounding the remaining work in the live keyboard-routing gap now that selected authored `Assembly` / `Component` targets already expose `canHide` / `canShow` plus the selected Console `content.visibility.hide` / `show` action path
1. 2026-04-15 22:18:00: Created this third Codex-sized `Browser-12.2` follow-on so authored container visibility can gain selected-target keyboard parity only after Browser and selected Console visibility authority are already explicit and proven

### Purpose

This phase adds selected-target keyboard parity for authored container hide.

Use it to:
- let selected authored containers enter the same hide path from keyboard
- keep keyboard visibility routing on the same selected-target truth already proven by the Console slice
- avoid widening this slice into root visibility commands or a global authored restore model

## Doc Body

## [ ] Browser-12.2.3 - Selected Authored Container Keyboard Hide Parity

### Summary

Keyboard parity should come last in the initial `12.2` ladder.

By the time this slice starts:
- Browser row/context-menu visibility for authored containers should already be explicit
- selected-target Console `Hide` / `Show` parity should already exist
- selected authored `Assembly` / `Component` targets should already carry `canHide` / `canShow` plus `visibilityPartKeys`

That gives keyboard one clean job:
- let a selected authored container enter the same selected-target hide path without inventing another eligibility detector or another visibility authority

### Owns

- selected-target keyboard entry for authored container hide
- routing that keyboard entry through the same authored-container visibility eligibility proven by the selected Console slice
- focused input-routing proof for authored container hide parity

### Does Not Own

- Browser context-menu parity
- selected Console `Show` / `Hide` target metadata
- root authored visibility commands
- a global authored `Unhide All` recovery model

### Locked Direction

- keep the slice selected-target only:
  - keyboard should act only when an authored `Assembly` or `Component` target is already selected and eligible
- keep one selected-target truth:
  - keyboard routing should depend on the same visibility eligibility used by the selected Console session
- avoid new authored global recovery rules:
  - this slice is hide parity only unless the already-proven selected Console contract makes a matching show shortcut trivial

### Current Seam Read

- `src/app/store/useAppStore.ts`
  - already exposes selected authored `assembly` / `component` targets with `canHide`, `canShow`, and `visibilityPartKeys`
- `src/app/console/stagedNavigation.ts`
  - already maps selected authored-container sessions onto `content.visibility.hide` / `content.visibility.show`
- `src/app/console/useConsoleInteraction.ts`
  - already executes those selected-target visibility actions through the same authored-container `setPartVisibility(...)` seam Browser uses
- `src/app/inputRouting.ts`
  - currently routes `Delete` and `Shift+H` / `Alt+H` with reference-object visibility booleans only
  - does not yet appear to accept selected authored-container hide availability as part of its routing contract
- `src/app/console/useConsoleInteraction.ts`
  - already computes reference hide/restore keyboard eligibility before calling `routeKeyboardInput(...)`
  - does not yet appear to feed selected authored-container hide availability into that same keyboard-routing seam
- Browser already keeps hidden authored container rows visible in the tree, so a larger authored global restore model is not required in this first keyboard slice

### Ready-To-Start Checklist

- extend `routeKeyboardInput(...)` so selected authored-container hide availability can participate without regressing reference hide/recovery routing
- derive authored keyboard-hide eligibility from the same selected-target metadata already powering selected Console `Hide` / `Show`
- map the authored keyboard entry onto the existing `content.visibility.hide` execution path instead of duplicating visibility mutation logic
- cover visible authored `Assembly` / `Component` cases plus ineligible/hidden/reference-only cases with focused keyboard-routing and top-level interaction proof

### Acceptance Read

- when a visible authored `Assembly` is selected and `canHide` is true, keyboard enters the existing selected-target `content.visibility.hide` path without opening a Browser-only codepath
- when a visible authored `Component` is selected and `canHide` is true, keyboard does the same
- hidden authored targets do not falsely advertise authored-container keyboard hide support just because selected Console can still offer `Show`
- existing reference hide/recovery keyboard behavior stays intact while authored-container hide joins the same routing seam

### Concrete Implementation Targets

Primary expected targets:
- `src/app/inputRouting.ts`
- `src/app/console/useConsoleInteraction.ts`

Supporting targets if needed:
- `src/app/inputRouting.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/useAppStore.ts`

### Assumptions

- keyboard parity is safest after Browser and selected Console visibility behavior are already explicit
- `Browser-12.2` does not need a full authored-content root visibility picker or global restore command in the first ladder

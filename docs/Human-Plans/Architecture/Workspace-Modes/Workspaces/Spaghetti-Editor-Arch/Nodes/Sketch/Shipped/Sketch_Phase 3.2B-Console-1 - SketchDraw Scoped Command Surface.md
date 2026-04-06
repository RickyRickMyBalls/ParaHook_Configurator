# Sketch Phase 3.2B-Console-1 - SketchDraw Scoped Command Surface

## Doc Header

### Doc History
1. 2026-03-23 15:02: Created this standalone future phase doc for `[3.2B-Console-1]`, giving the sketch family a dedicated first console-cleanup phase focused on making `SketchDraw` read as one explicit local command surface before the deeper staged-routing migration
2. 2026-03-23 15:12: Tightened this phase into an implementation-ready spec by locking `SketchDraw` as a real local command scope, defining local-versus-global command precedence, explicitly keeping `Radio` available while sketch draw is active, and grounding the phase in the current `ConsoleDock`, `featureAssistDescriptor`, and `geometrySketchSession` seams
3. 2026-03-23 17:19: Marked `[3.2B-Console-1]` shipped after implementing the first scoped-console cleanup in code, so `Radio` now remains reachable while `SketchDraw` is active, `Radio on/off` returns to the active sketch-draw scope instead of root, and the current local sketch-draw command surface now behaves as a real local scope rather than a sealed console branch

### Purpose

This is the first shipped sketch-console cleanup cut.

Use it to answer:
- how `SketchDraw` command selection is grouped today
- what counts as local `SketchDraw` commands
- how global command families like `Radio` remain available while `SketchDraw` is active

### Why This Phase Exists

`SketchDraw` already used the same console shell as the rest of the app, but its command flow was still mostly modeled as feature-assist branching inside `ConsoleDock`.

That created two real problems:
- `SketchDraw` did not read as one clearly modeled command scope
- global console families like `Radio` did not naturally remain available while `SketchDraw` was active

This shipped phase landed the smallest honest cleanup:
- make `SketchDraw` read as one local scope
- define how local sketch commands coexist with global/root console families
- keep the current drawing runtime intact

### Scope

This phase shipped:
- explicit local `SketchDraw` command-surface behavior
- local-versus-global command precedence while `SketchDraw` is active
- `Radio` availability inside `SketchDraw`
- return-to-`SketchDraw` behavior after `Radio on/off`

This phase did not ship:
- full staged `SketchDraw` routing
- point-by-point staged drawing
- replacement of `geometrySketchSession`

## Doc Body

## [x] - `[3.2B-Console-1]` - `SketchDraw Scoped Command Surface`

### Header

Purpose:
- make `SketchDraw` behave as one explicit local command scope instead of a sealed special-case console branch

Shipped behavior:
- local sketch-draw commands continue to work through the active sketch-draw session
- global `Radio` remains reachable while `SketchDraw` is active
- `Radio on/off` returns to the active sketch-draw scope instead of root

### Shipped Result

- `SketchDraw` now behaves as a real local scope rather than a console lockout mode
- local commands remain local
- global `Radio` remains callable with:
  - `radio`
  - `r`
- active drawing/runtime state still belongs to `geometrySketchSession`

### Current Code-To-Target Mapping

Local draw-session truth:
- `geometrySketchSession`

Local prompt/choice truth:
- `featureAssistDescriptor`

Current implementation seam:
- `src/app/console/ConsoleDock.tsx`

Verification seam:
- `src/app/console/ConsoleDock.test.tsx`

### Locked Behavior

`SketchDraw` is:
- a local scope
- not a console lockout mode

Local-versus-global precedence:
1. local `SketchDraw` commands get first chance only for local matching tokens
2. non-local tokens still allow global/root families
3. global `Radio` remains callable while `SketchDraw` is active

`Esc` behavior:
- this phase did not turn `Esc` into a global `SketchDraw` exit
- `SketchDraw` remains durable

### Shipped Verification

Implemented and verified:
- `Radio` opens from inside `SketchDraw`
- `Radio on/off` does not tear down the active draw session
- returning from `Radio on/off` restores the active sketch-draw prompt instead of root

Focused verification command used:

```powershell
npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx src/app/console/stagedNavigation.test.ts src/app/components/ViewerHost.test.tsx src/viewer/scene/CameraController.test.ts
```

Focused result:
- 4 test files passed
- 151 tests passed

### Follow-On

This phase intentionally stopped before staged migration.

Next follow-on:
- `[3.2B-Console-2] SketchDraw Staged Command Routing`

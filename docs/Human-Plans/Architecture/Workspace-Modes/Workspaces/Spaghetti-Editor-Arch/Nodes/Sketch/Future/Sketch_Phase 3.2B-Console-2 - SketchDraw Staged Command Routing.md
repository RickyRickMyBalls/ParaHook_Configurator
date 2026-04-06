# Sketch Phase 3.2B-Console-2 - SketchDraw Staged Command Routing

## Doc Header

### Doc History
1. 2026-03-23 15:02: Created this standalone future phase doc for `[3.2B-Console-2]`, defining the follow-on where `SketchDraw` command selection moves from feature-assist-only branching into staged/scoped command routing while leaving active drawing runtime in the existing sketch session model
2. 2026-03-23 17:18: Tightened this phase into an implementation-ready spec by locking what becomes staged versus what stays in `geometrySketchSession`, grounding the work in the current `ConsoleDock` plus `stagedNavigation` seams, carrying forward the Phase 1 local-versus-global precedence rules, and defining how `Radio` remains reachable while `SketchDraw` command selection becomes staged
3. 2026-03-23 17:29: Tightened the phase further into a handoff-ready implementation spec by locking the exact staged scope ids, action ids, local command tree, `Back` versus `X` behavior, `ConsoleDock` handoff seams, and the concrete automated/manual verification needed before this phase can be marked shipped

### Purpose

This phase moves `SketchDraw` command selection into staged routing.

Use it to answer:
- what part of `SketchDraw` should become staged
- what must stay session-driven
- how local staged branches like `Camera > Projection` should behave
- how staged `SketchDraw` scope should coexist with global/root families like `Radio`

### Why This Phase Exists

After `[3.2B-Console-1]`, `SketchDraw` has a clearer local command surface and explicit local-versus-global precedence.

But command selection still does not use the same routing model as root console families:
- root families use staged/scoped navigation
- `SketchDraw` still uses feature-assist branching for most local command families
- only narrow local seams like `sketchDrawZoomRoot` already read as staged

This phase exists to close that gap:
- make `SketchDraw` command selection staged
- keep actual drawing interaction session-driven
- stop growing local sketch behavior through bespoke `ConsoleDock` branches

### Scope

This phase covers:
- staged `SketchDraw` command selection
- staged local branches such as `Camera > Projection`
- staged local `Zoom`
- handoff from staged local choices into the existing draw-session runtime
- coexistence between local `SketchDraw` staged commands and global/root families like `Radio`

This phase does not cover:
- making every point-entry step staged
- replacing `geometrySketchSession`
- redesigning draw runtime state machines
- whole-app generic command registry work

### Locked Phase Boundary

This is still a console-routing phase, not a sketch-runtime rewrite.

This phase must:
- move idle/local `SketchDraw` command selection into staged routing
- keep active tool prompts and draw-depth state in `geometrySketchSession`
- preserve the shipped `[3.2B-Console-1]` rule that global `Radio` remains callable while `SketchDraw` is active

This phase must not:
- move point-by-point drafting into staged nodes
- invent a second sketch-only staged engine
- widen into the later shared sketch provider/tree work owned by `[3.2B-Console-3]`

## Doc Body

## [ ] - `[3.2B-Console-2]` - `SketchDraw Staged Command Routing`

### Header

Purpose:
- make `SketchDraw` command selection use staged/scoped routing while preserving the existing draw-session runtime model

Owns:
- staged local `SketchDraw` command selection
- staged branches for:
  - `Camera > Projection > Orthographic`
  - `Camera > Projection > Perspective`
  - `Zoom`
  - `Previous`
  - `Delete`
  - `Back`
  - `X`
- handoff from staged local choice into existing draw-session behavior
- coexistence between staged local sketch commands and global/root families like `Radio`

Keeps for later phases:
- shared sketch command tree/provider model
- non-sketch family command-provider unification
- full app-wide command registry design

### Target Result

- `SketchDraw` command selection no longer depends on feature-assist-only branching
- local staged branches like `Camera > Projection` work the same way root staged families do
- local `Zoom` keeps its staged subtree, but under one consistent `SketchDraw` staged model
- actual drawing runtime still stays in the current sketch session model
- global families like `Radio` remain callable while `SketchDraw` is active
- `Back` remains a one-level local staged step-up while `X` remains full sketch-draw exit

### Current Code-To-Target Mapping

Current staged seams:
- root/global staged navigation:
  - `src/app/console/stagedNavigation.ts`
- current local staged sketch seam:
  - `sketchDrawZoomRoot`

Current non-staged local sketch seams:
- `src/app/console/ConsoleDock.tsx`
  - local sketch draw token branches
  - `buildSketchDrawCameraAssistDescriptor()`
  - `buildSketchDrawCameraProjectionAssistDescriptor()`
  - feature-assist breadcrumb checks for:
    - `Sketch Draw`
    - `Sketch Draw > Camera`
    - `Sketch Draw > Camera > Projection`

Current runtime seam that must remain:
- `geometrySketchSession`

Current split problem:
- `SketchDraw` command selection still lives partly in `featureAssistDescriptor` and partly in one-off local branches in `ConsoleDock`
- root families already use staged navigation cleanly
- local `Zoom` is already staged, which proves the approach but also exposes the current inconsistency

### Exact Staged Command Model

Use one local staged tree rooted at the active `SketchDraw` scope.

Recommended scope ids:
- `sketchDrawRoot`
- `sketchDrawCameraRoot`
- `sketchDrawCameraProjectionRoot`
- reuse the existing zoom staged scope under the same local tree instead of leaving it as an isolated special case

Recommended action ids:
- `sketchdraw.tool.line`
- `sketchdraw.tool.pline`
- `sketchdraw.tool.rectangle`
- `sketchdraw.tool.circle`
- `sketchdraw.camera.projection.orthographic`
- `sketchdraw.camera.projection.perspective`
- `sketchdraw.zoom.previous`
- `sketchdraw.delete`
- `sketchdraw.back`
- `sketchdraw.exit`

Recommended local tree:

```text
Sketch Draw
|- Line
|- PLine
|- Rectangle
|- Circle
|- Camera
|  \- Projection
|     |- Orthographic
|     \- Perspective
|- Zoom
|- Previous
|- Delete
|- Back
\- X
```

Recommended visible aliases:
- `L` = `Line`
- `PL` = `PLine`
- `REC` = `Rectangle`
- `C` = `Camera`
- `O` = `Orthographic`
- `P` = `Perspective`
- keep `R` free for global `Radio`

Important alias rule:
- local aliases may only occupy tokens that do not break the shipped `Radio`-inside-`SketchDraw` behavior
- do not let local `Rectangle` or any other sketch command steal bare `R`

### What Becomes Staged Versus What Stays Session-Driven

#### Must Become Staged

Stage command selection for:
- `Line`
- `PLine`
- `Rectangle`
- `Circle`
- `Camera`
- `Projection`
- `Orthographic`
- `Perspective`
- `Zoom`
- `Previous`
- `Delete`
- `Back`
- `X`

The staged system should own:
- visible choices
- aliases
- child branches
- back behavior
- local breadcrumbs
- local command-family prompt shape

Important behavior split:
- staged selection owns the idle/local command tree
- once a tool is chosen, the runtime owns prompt depth like `P1`, `P2`, `Center`, `Radius`

#### Must Stay In `geometrySketchSession`

Do not stage:
- active tool runtime
- draft points
- hover points
- point acceptance
- radius acceptance
- commit rules
- cancel rules inside the active draw runtime
- tool-specific prompt state like:
  - `P1`
  - `P2`
  - `Center`
  - `Radius`

Those still belong to:
- `geometrySketchSession`
- existing draw runtime/store verbs

Important rule:
- stage command selection
- do not stage the full drawing interaction itself

### Local Versus Global Precedence

This phase inherits the Phase 1 command-precedence model.

Locked precedence rules:
1. active local `SketchDraw` staged commands get first chance only for tokens that belong to the local sketch-draw scope
2. if a token does not match the local sketch-draw staged branch, global/root families remain eligible
3. global `Radio` remains reachable while `SketchDraw` is active
4. local aliases must not steal obvious global-family entry tokens like `r`
5. while local staged scope is active, root/global staged families should still be enterable when the token does not belong to the local tree

Examples:
- `line`
  - local `SketchDraw` staged tool choice
- `camera`
  - local `SketchDraw` staged branch
- `radio`
  - global/root family
- `r`
  - global/root `Radio`
- `back`
  - local staged step-up inside `SketchDraw`
- `x`
  - full local `SketchDraw` exit

### Staged Shape

Recommended local staged shape:

```text
Graph
└─ Sketch
   └─ Sketch Draw
      ├─ Line
      ├─ PLine
      ├─ Rectangle
      ├─ Circle
      ├─ Camera
      │  └─ Projection
      │     ├─ Orthographic
      │     └─ Perspective
      ├─ Zoom
      ├─ Previous
      ├─ Delete
      ├─ Back
      └─ X
```

Important rule:
- this is a staged command-selection tree
- it is not a replacement for the draw runtime/depth tree inside active tool sessions

### `Back` Versus `X`

Lock this behavior explicitly:

- `Back`
  - one-level local staged navigation only
  - `Sketch Draw > Camera > Projection` -> `Sketch Draw > Camera`
  - `Sketch Draw > Camera` -> `Sketch Draw`
  - from idle/root `Sketch Draw`, `Back` should follow the existing local return-one-level behavior rather than silently becoming `X`
- `X`
  - full sketch-draw exit
  - leaves the active `SketchDraw` scope entirely

This distinction must survive the staged migration. If `Back` and `X` collapse into one action, the local scope is not behaving correctly.

### Console Structure Changes

`src/app/console/stagedNavigation.ts`
- add staged local scope ids for `SketchDraw` command selection
- add a constructor/helper for the local `SketchDraw` root session
- add staged local choices for the command families listed above
- wire child scope transitions for `Camera` and `Projection`
- reuse the current staged choice/result model instead of inventing a second sketch-only staged system

`src/app/console/radioCommandIdentity.ts`
- add canonical identities for the new staged local `SketchDraw` branches and execute actions

`src/app/console/ConsoleDock.tsx`
- stop owning the permanent local branch logic for:
  - `Sketch Draw > Camera`
  - `Sketch Draw > Camera > Projection`
  - local command-family selection that should now be staged
- keep owning:
  - transcript echo
  - staged submit wiring
  - handoff into the existing draw runtime
  - the `Radio` coexistence behavior shipped in `[3.2B-Console-1]`

`src/app/console/useConsoleStore.ts`
- add any small session-state helpers needed so the active local staged sketch scope can survive a `Radio` round-trip and return cleanly to the same `SketchDraw` root

### Runtime Handoff Rules

When a staged local choice is selected:
- `Line`
  - hand off into `runGeometrySketchDrawCommand('line' | 'l' equivalent behavior)`
- `PLine`
  - hand off into the existing `pline` draw runtime
- `Rectangle`
  - hand off into the existing rectangle draw runtime
- `Circle`
  - hand off into the existing circle draw runtime
- `Previous`
  - hand off into existing draw-runtime previous behavior
- `Delete`
  - hand off into existing delete behavior
- `Back`
  - hand off into the existing return-one-level behavior when already at idle/root `SketchDraw`
- `X`
  - hand off into the existing full sketch-draw exit behavior

When a staged local branch is purely navigational:
- `Camera`
  - advance to local camera branch
- `Projection`
  - advance to projection branch
- `Orthographic`
  - execute projection change
- `Perspective`
  - execute projection change

Important handoff rule:
- selecting a tool must switch the console prompt from staged idle selection into the existing runtime-driven draw prompt
- when that runtime returns to idle `SketchDraw`, the console should resume the local staged root prompt instead of falling back to old feature-assist camera/tool summaries

### Prompt And UI Rules

This phase should make `SketchDraw` read like a staged scope when idle/local-command selection is active.

Recommended prompt behavior:
- local staged prompt should read like the existing root staged prompt style, not like a feature-assist-only summary
- local breadcrumb should name the current staged local branch
- when a staged local command hands off into active drawing runtime, the prompt should then switch back to the existing runtime-driven draw/depth path

That means:
- idle/local command selection = staged prompt model
- active drawing/runtime depth = runtime/session prompt model

### Implementation Spec

Recommended file targets:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/ConsoleDock.tsx`
- likely supporting updates in:
  - `src/app/console/useConsoleStore.ts`
  - `src/app/console/ConsoleBar.tsx` only if prompt rendering needs a small staged-versus-runtime distinction cleanup

Recommended tests:
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`

Recommended implementation order:
1. add the local `SketchDraw` staged root/session constructor and child scope tree in `stagedNavigation.ts`
2. register canonical identities for the new staged local execute actions
3. route `ConsoleDock` idle `SketchDraw` command selection through the staged session instead of bespoke feature-assist camera/tool branches
4. preserve the existing `geometrySketchSession` handoff for live tool runtime and depth prompts
5. re-thread the shipped `Radio` round-trip so entering/leaving `Radio` from inside `SketchDraw` returns to the same local staged root
6. remove obsolete `Sketch Draw > Camera` and `Sketch Draw > Camera > Projection` feature-assist branches once staged coverage is complete

Implementation steps:
1. add explicit staged local scope ids for `SketchDraw`
2. move local command-family selection out of feature-assist-only branching and into staged navigation
3. preserve the existing staged local zoom seam, but align it under the broader `SketchDraw` staged model
4. replace the bespoke `Camera > Projection` feature-assist branches with staged local branches
5. wire staged local execute actions into existing draw/runtime store verbs
6. keep global `Radio` available while `SketchDraw` local staged scope is active
7. keep the active draw runtime and point-entry paths in `geometrySketchSession`

Implementation rules:
- do not make a second staged system only for sketch
- do not redesign root/global staged navigation architecture here
- do not turn active draw-step prompts into staged nodes
- do not replace `geometrySketchSession`
- do not regress the Phase 1 `Radio in SketchDraw` behavior

### Verification

Required automated verification:

- `stagedNavigation.test.ts`
  - local `SketchDraw` staged scopes exist
  - `sketchDrawRoot` exposes `Line`, `PLine`, `Rectangle`, `Circle`, `Camera`, `Zoom`, `Previous`, `Delete`, `Back`, and `X`
  - local `Camera > Projection` branch executes the correct action ids
  - local staged `Zoom` remains valid
- `ConsoleDock.test.tsx`
  - entering `SketchDraw` exposes staged local command selection
  - `Camera > Projection > Orthographic` works from staged local routing
  - `Camera > Projection > Perspective` works from staged local routing
  - `Line`, `PLine`, `Rectangle`, and `Circle` hand off into existing draw runtime
  - `Radio` remains callable while `SketchDraw` staged local scope is active
  - `Radio on/off` returns to the active `SketchDraw` scope instead of root
  - `Back` stays one-level local navigation
  - `X` stays full sketch-draw exit
  - active tool prompts like `P1`, `P2`, `Center`, and `Radius` still come from runtime/session state, not staged nodes

Suggested manual smoke checks:
- enter `SketchDraw`
- confirm idle/local command selection reads as staged
- run:
  - `Camera > Projection > Orthographic`
  - `Camera > Projection > Perspective`
- run:
  - `Line`
  - `Rectangle`
  - `Circle`
- confirm the active draw prompt still uses runtime-driven point/radius state
- run `Radio`
- turn radio on/off
- confirm `SketchDraw` remains active
- while in `Sketch Draw > Camera > Projection`, run `Back` and confirm it only steps to `Camera`
- from idle `SketchDraw`, run `X` and confirm the session exits fully

### Assumptions And Defaults

- `SketchDraw` remains a local scope while the draw session is open
- global `Radio` remains reachable during that local scope
- staged command selection and runtime-driven draw depth are allowed to coexist
- staged local selection replaces feature-assist-only command branching, not the sketch draw runtime
- the later shared sketch command-tree/provider work is deferred to `[3.2B-Console-3]`

### Definition Of Done

- `SketchDraw` command selection no longer depends on feature-assist-only branching
- local staged branches like `Camera > Projection` work the same way root staged families do
- local `Zoom` fits into the broader staged local model cleanly
- tool runtime still stays in `geometrySketchSession`
- `Radio` remains reachable while `SketchDraw` is active
- `Back` and `X` remain distinct after the staged migration
- the phase lands without widening into full app-wide command-provider redesign

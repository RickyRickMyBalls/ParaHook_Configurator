# Build-Path-3 - Viewport Docked Icon Strip And Workspace Surface

## Doc Header

### Doc History
2. 2026-05-22 20:42:43: Implemented and closed `Build-Path-3`, registering Build Path as a shared workspace surface, adding the viewport-docked bottom icon strip above Console, wiring workspace/floating hosted chrome through the shared shell path, and verifying the empty strip plus Sketch/Extrude icon rendering without adding scrub, branch, restore, compare, pin, or checkpoint behavior.
1. 2026-05-22 19:55:49: Added this Build Path family phase doc to plan the first visible Build Path surface: a compact Model Viewport-docked icon strip plus normal workspace chrome when hosted as a pane.

### Purpose

This doc plans `Build-Path-3`.

Use it to answer:
- how Build Path first appears in the app
- how the default viewport-docked icon strip should behave
- how split, tiled, or windowed Build Path should use shared workspace chrome
- how the visible surface stays downstream from Build Path runtime state

Do not use it for:
- event intake state ownership
- scrub replay behavior
- branch-local timeline UI
- restore, branch, compare, or pin actions

## Doc Body

`Build-Path-3` makes Build Path visible.

Default presentation:
- docked inside the Model Viewport
- top or bottom placement
- bottom placement sits above Console
- timeline body has no visible `Build Path` label
- accepted events render as compact CAD/build icons

Workspace-hosted presentation:
- can use normal titlebar chrome
- may show `Build Path` in the titlebar
- should follow shared workspace surface rules instead of custom shell behavior

## Vision

After this phase, the user can point at the app and find Build Path.

It should feel like a quiet construction timeline attached to the modeling viewport, not a large labeled panel competing with Browser or Console.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-1. Add a workspace-family planning home and route `Build Path` through the shared workspace surface model.
- [x] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.
- [x] Build-Path-Gen1-CLG-8. Preserve the compact viewport-docked icon-strip presentation while allowing split/tiled/windowed workspace chrome to show a titlebar.

### `Build-Path-3 / Phase 1`

- [x] Register Build Path in the shared workspace/surface catalog path.
- [x] Keep the first surface read-only.
- [x] `Build-Path-Gen1-HLG-9`

### `Build-Path-3 / Phase 2`

- [x] Render the viewport-docked icon strip from the master timeline read.
- [x] Preserve no visible content label in the compact strip.
- [x] `Build-Path-Gen1-HLG-4`
- [x] `Build-Path-Gen1-HLG-9`

### `Build-Path-3 / Phase 3`

- [x] Support split/tiled/windowed Build Path chrome through the shared workspace shell.
- [x] Keep titlebar naming separate from compact strip content.
- [x] `Build-Path-Gen1-HLG-9`

## [x] `Build-Path-3 / Phase 1` - `Workspace Surface Registration`

### Phase 1 Summary

Register Build Path so the shared workspace model can host it.

### Phase 1 Implementation Spec

The implementation should:
- add Build Path to the relevant workspace surface registry/catalog
- route Build Path through shared workspace shell behavior
- keep body rendering minimal and read-only
- avoid custom titlebar or popout behavior if the shared shell already owns it

Verification should cover:
- Build Path appears as a valid workspace surface where the registry exposes choices
- existing surfaces keep their menu/order behavior

### Phase 1 Result

Implemented. Build Path is now registered as `buildPath` in the shared workspace surface catalog/type path, has explicit slot instance ids, appears in viewport type choices with compact aliases, and routes through `ViewportSurfaceRegistry` as a read-only workspace surface.

## [x] `Build-Path-3 / Phase 2` - `Viewport Docked Icon Strip`

### Phase 2 Summary

Render the default compact Build Path strip inside the Model Viewport.

### Phase 2 Implementation Spec

The implementation should:
- render timeline steps as icon-first items
- use Build Path timeline display metadata
- show an empty strip/read when no events exist
- support top or bottom placement if the current shell has a settled placement seam
- keep bottom placement above Console

Do not include:
- scrub movement
- branch mode
- restore/branch/compare/pin actions

Verification should cover:
- empty state
- one Sketch and one Extrude icon
- no visible `Build Path` label inside the compact timeline body
- bottom-docked placement does not overlap Console

### Phase 2 Result

Implemented. `ViewportWorkspaceHost` now mounts a bottom `BuildPathViewportDock` above the Console row. The compact body renders the empty strip with no visible content label and renders Sketch/Extrude steps from Build Path timeline display metadata in focused tests.

## [x] `Build-Path-3 / Phase 3` - `Workspace Hosted Chrome`

### Phase 3 Summary

Let Build Path behave like a normal workspace-hosted surface when split, tiled, or windowed.

### Phase 3 Implementation Spec

The implementation should:
- reuse normal workspace titlebar chrome
- allow the titlebar to identify `Build Path`
- keep timeline body icon-first and label-light
- avoid duplicating shell controls inside the Build Path surface body

Verification should cover:
- split/tiled/windowed titlebar shows normal workspace chrome
- compact timeline body remains no-label
- existing Console and Browser shell behavior is unchanged

### Phase 3 Result

Implemented within current shell support. Split/tiled hosting uses the existing `ViewportFrame` titlebar path, and floating hosting uses the shared `SimpleFloatingSurfaceHost` with a `Build Path` titlebar while the Build Path body remains icon-first and label-light. Popout remains deferred by catalog support.

### Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/workspace/workspaceSurfaceCatalog.test.ts src/app/workspace/workspaceViewportTypeChoices.test.ts src/app/workspace/ViewportWorkspaceHost.test.tsx`
- `npm.cmd test -- --run src/app/workspace/ViewportSurfaceRegistry.test.tsx -t "build path"`
- `npx.cmd tsc -b`
- `npm.cmd run build`
- Browser verification at `http://localhost:5173/ParaHook_Configurator/`: `[data-build-path-viewport-dock="bottom"]` and `.BuildPathTimelineStrip--viewport-dock` were present, the strip status was `empty`, the strip visible text was empty, and the dock bottom was above the Console row top.

### Adjacent Blocker

- The full `src/app/workspace/ViewportSurfaceRegistry.test.tsx` file still has an unrelated existing Properties assertion failure: the Properties surface body no longer contains the expected `Object` text. The new Build Path registry test passes when targeted, and this blocker was not widened into `Build-Path-3`.

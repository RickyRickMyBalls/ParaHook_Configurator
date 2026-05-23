# Build-Path-4.1 - Viewport Dock Scrub Readback

## Doc Header

### Doc History
2. 2026-05-22 23:09:24: Implemented and verified `Build-Path-4.1`, adding compact viewport-docked selected-step readback plus previous/next scrub controls over Build Path-owned selection state while preserving view-only behavior and Edit History redo safety.
1. 2026-05-22 23:02:00: Added this Build Path follow-up phase to make docked scrub selection visible before the broader `Build-Path-5` parallel branch UI work.

### Purpose

This doc plans `Build-Path-4.1`.

Use it to answer:
- how the compact viewport-docked Build Path strip should show the selected step
- how previous/next scrub movement should work in the dock
- why this remains view-only and does not replay model geometry

Do not use it for:
- graph restore
- model rollback/replay
- branch lane rendering
- compare, pin, or worker checkpoint behavior

## Doc Body

`Build-Path-4.1` fills the usability gap between the icon strip and full model replay.

The user should be able to tell which Build Path step is selected from the viewport dock itself, and move the Build Path playhead one step at a time.

Hard boundary:
- dock scrub movement changes Build Path inspection state only
- it does not mutate graph truth
- it does not create Edit History entries
- it does not clear redo
- it does not replay, hide, or restore geometry

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-4. Define view-only master scrub behavior that does not create canonical undo entries or mutate the authored graph head.
- [x] Build-Path-Gen1-CLG-8. Preserve the compact viewport-docked icon-strip presentation while allowing split/tiled/windowed workspace chrome to show a titlebar.

### `Build-Path-4.1 / Phase 1`

- [x] Show selected step number and command family in the viewport dock.
- [x] Add previous/next dock controls over the existing Build Path playhead state.
- [x] Preserve no-label Build Path strip body.
- [x] Prove dock scrub movement does not touch Edit History redo.

## [x] `Build-Path-4.1 / Phase 1` - `Dock Scrub Readback`

### Phase 1 Summary

Make the docked scrub selection visible and step-navigable.

### Phase 1 Implementation Spec

The implementation should:
- render selected step readback next to the viewport-docked icon strip
- expose previous and next controls
- reuse Build Path runtime selected-step state
- keep the dock compact and no-label

Do not include:
- graph replay
- authored restore
- branch UI
- compare/pin/checkpoint behavior

### Phase 1 Result

Implemented. The viewport-docked Build Path surface now shows a compact selected-step readback with previous and next controls. The controls update Build Path-selected timeline state only, preserve the icon strip, and do not create Edit History entries.

### Verification

- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
- Browser verification at `http://localhost:5173/ParaHook_Configurator/`: the viewport-docked Build Path strip was `ready`, the selected-step dock readback was present, and the live session showed Sketch/Extrude steps with the selected Extrude reflected in the dock readback.

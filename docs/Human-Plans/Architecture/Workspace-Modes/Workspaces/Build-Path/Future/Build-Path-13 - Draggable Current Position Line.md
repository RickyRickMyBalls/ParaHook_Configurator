# Build-Path-13 - Draggable Current Position Line

## Doc Header

### Doc History
10. 2026-05-24 09:43:51: Layered the Model Viewport split-corner handle above the bottom-left Build Path dock so the corner split affordance remains reachable while the dock stays flush to the viewport edge.
9. 2026-05-24 09:31:22: Refined the viewport-docked Build Path rail so the horizontal scrollbar stays hidden while the strip is still growing and appears only after the timeline actually overflows its available Model Viewport width.
8. 2026-05-24 09:19:11: Updated the viewport-docked Build Path timeline so the strip grows with its cards up to full Model Viewport width, then exposes horizontal scrolling for longer timelines.
7. 2026-05-24 09:14:00: Moved the default viewport-docked Build Path placement to the bottom-left Model Viewport edge with zero offset as the first placement-frame cleanup before later drag/resize work.
6. 2026-05-24 09:07:39: Removed the dock-only current-command readback and previous/next panel from Phase 1 because the draggable scrub marker now owns viewport-docked Build Path scrub navigation.
5. 2026-05-24 08:47:02: Corrected the Phase 1 marker placement so the current-position line sits after the loaded/current command card, in the gap before the next card, instead of behind the current position.
4. 2026-05-24 08:43:47: Adjusted the Phase 1 marker placement so the current-position line sits in front of the loaded command card, between timeline cards, instead of centered over the selected card.
3. 2026-05-24 08:36:23: Implemented and closed Phase 1 with a draggable Build Path current-position line, selected-step synchronization, focused surface tests, TypeScript, production build, and local HTTP smoke coverage.
2. 2026-05-24 08:29:49: Prepped Phase 1 for implementation against the live `BuildPathTimelineStrip`, `useBuildPathRuntimeStore.selectTimelineStep`, viewport-dock CSS, and focused Build Path surface tests.
1. 2026-05-24 08:25:38: Added this open-ended Build Path visual cleanup doc with Phase 1 scoped to a Fusion-style draggable current-position line for scrubbing the Build Path timeline.

### Purpose

This doc plans `Build-Path-13`.

Use it to answer:
- how the Build Path strip should get a visible current-position line
- how the user should drag that line left and right to scrub through Build Path time
- how this visual cleanup stays open-ended so later phases can be specified one by one

Do not use it for:
- restore, replay, branch-from-here, compare, or pin execution
- changing accepted Build Path event order
- changing graph truth or Spaghetti node ownership
- replacing Edit History
- redesigning Parallel lane layout before `Build-Path-11` owns that work

## Doc Body

`Build-Path-13` is an open-ended cleanup lane for making the Build Path feel more like a real timeline control instead of only a row of icon buttons.

The first requested cleanup is a current-position line, similar in spirit to the Fusion 360 timeline marker: a vertical playhead/readhead that sits over the current Build Path position and can be dragged left or right to scrub the timeline.

Boundary rule:
- the current-position line is a Build Path scrub control over existing timeline selection state
- dragging the line should select timeline steps through the existing Build Path selection path
- the line must not mutate graph truth, execute restore/replay behavior, or become a second timeline model
- if user-driven selection currently participates in Edit History, dragging should use the same committed selection semantics instead of inventing a separate undo path

This doc is intentionally open ended. After Phase 1, later phases should be added only when the user gives the next cleanup target.

## Vision

The healthy Build Path read should feel like a compact CAD build timeline:
- icons still identify accepted build events
- one visible current-position line tells the user where they are in build time
- dragging the line scrubs the Build Path in a direct, physical-feeling way
- the selected icon/readback, viewport preview masking, and Edit History behavior remain downstream from the same selected timeline step
- future visual cleanup phases can be added without overcommitting the whole Build Path redesign in this first pass

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-14. Add a visible draggable current-position line to the Build Path timeline that scrubs existing selection state without changing graph truth, accepted event order, or restore/replay boundaries.

### `Build-Path-13 / Phase 1`

- [x] Add a vertical current-position line over the Build Path strip.
- [x] Position the line from the selected master timeline step.
- [x] Let the user drag the line left and right to scrub existing Build Path timeline steps.
- [x] Preserve existing icon selection/readback behavior.
- [x] Preserve viewport preview masking as derived presentation from the selected step.
- [x] Preserve graph truth, accepted event order, restore/replay boundaries, and Edit History semantics.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-9`

### Later Phases

- [ ] Reserved for the user's next Build Path cleanup direction.

## [x] `Build-Path-13 / Phase 1` - `Draggable Current Position Line`

### Phase 1 Summary

Add a Fusion-style current-position line to the Build Path strip and make it draggable so the user can scrub through existing Build Path timeline steps.

#### Current Live Read

Live implementation seams as of prep:
- `BuildPathTimelineStrip` renders the compact master timeline as an `ol.BuildPathTimelineStepList` of fixed 24px step buttons with 6px gaps.
- `BuildPathSurface` already passes the resolved selected master step id and `selectTimelineStep` into the strip for both workspace and viewport-dock hosting.
- `useBuildPathRuntimeStore.selectTimelineStep` is the correct selection seam because it clamps selection through `selectBuildPathMasterTimelineStep`, skips no-op entries, and commits the existing global Edit History entry for user-driven master timeline moves.
- viewport-dock previous/next controls already prove selected-step readback and Edit History behavior through `BuildPathSurface.test.tsx`.
- CSS currently keeps the strip compact through `.BuildPathTimelineStrip`, `.BuildPathTimelineStepList`, `.BuildPathTimelineStepItem`, and `.BuildPathTimelineStep`; the marker should layer over that structure instead of changing icon button dimensions.

#### First Pass Decisions

- Render the marker only when the timeline has at least one selectable step and a resolved selected step id.
- Keep the marker inside `BuildPathTimelineStrip` so it works in both `viewport-dock` and `workspace` host modes.
- Position the marker from the selected step's `orderIndex` and a stable fixed geometry that matches the current strip: 24px icon width plus 6px gap, with the marker centered on the selected icon.
- Prefer a small helper such as `readTimelineStepIdFromStripPointer` or `readNearestBuildPathTimelineStepFromPointer` inside `BuildPathSurface.tsx` rather than adding a new shared module for this first pass.
- Use pointer events and pointer capture on the marker/scrub area so drag remains smooth after the pointer leaves the narrow line.
- During drag, call `onSelectTimelineStep` only when the nearest step id changes so no-op Edit History entries continue to be skipped by the store.
- Keep the existing selected icon styling; the marker is a positional affordance, not a replacement for selected-state styling.
- Do not add labels, tick text, or a larger timeline rail in Phase 1.

### Phase 1 Implementation Spec

The implementation pass should:
- add a small current-position marker element to `BuildPathTimelineStrip` when the strip is not empty
- expose marker state with stable attributes such as `data-build-path-current-position-line="true"` and `data-build-path-current-step-id`
- position the marker over the selected step center without changing `.BuildPathTimelineStep` width/height
- make the strip or marker pointer-draggable with `onPointerDown`, `onPointerMove`, `onPointerUp`, and `onPointerCancel`
- map pointer X to the nearest `timeline.steps` entry using the strip/list bounding rect and the existing icon spacing
- call the existing `onSelectTimelineStep` callback with the nearest step id
- avoid repeated callback calls for the same step while dragging
- preserve normal icon button click selection
- preserve previous/next viewport-dock scrub buttons
- keep the selected icon/readback synchronized with the line
- keep viewport scrub preview masking derived from the selected timeline step
- add a small CSS layer for the marker, including active/dragging affordance, while keeping the dock compact
- add focused tests for marker rendering, drag-to-select, icon/previous-next marker synchronization, and no graph mutation

Do not include:
- restore/replay behavior
- graph mutation
- worker checkpoint/cache behavior
- branch-from-here execution
- compare, pin, or checkpoint UI
- Parallel lane icon layout changes beyond avoiding obvious overlap with the marker
- a full timeline redesign beyond the current-position line

Likely seams:
- `src/app/buildPath/BuildPathSurface.tsx`
- `src/app/buildPath/useBuildPathRuntimeStore.ts`
- `src/app/theme/foundation/base.css`
- `src/app/buildPath/BuildPathSurface.test.tsx`

Exact first code cut:
- Add local drag state in `BuildPathTimelineStrip`, likely with `useRef` for the strip/list DOM node, last dragged step id, and active pointer id.
- Compute the selected order index from `timeline.steps.findIndex((step) => step.timelineStepId === selectedTimelineStepId)`.
- Render a marker element inside the strip, sibling to the step list, with inline custom property or style for the selected index offset.
- Make `.BuildPathTimelineStrip` `position: relative` and add enough vertical marker affordance without increasing the dock's height unexpectedly.
- Add pointer handlers that read the step list rect and choose the closest index with `Math.round((clientX - firstStepCenterX) / stepPitch)`, clamped to the `0..steps.length - 1` range.
- Use `setPointerCapture` / `releasePointerCapture` defensively when available.
- Keep the marker non-rendered for empty timelines so the empty-state line does not look like a selectable build step.
- Update tests using synthetic pointer events or fallback mouse-compatible pointer events in jsdom; if geometry is needed, stub `getBoundingClientRect` for the strip/list/step buttons.

Verification should cover:
- the marker appears at the selected Build Path step
- dragging the marker selects the nearest timeline step
- clicking icons and using previous/next still moves the marker
- graph state is unchanged by marker dragging
- viewport preview masking follows the selected step
- Edit History behavior matches the existing user-driven selection contract
- `npx.cmd tsc -b`
- `npm.cmd run build` if runtime source changes
- in-app browser smoke check at `http://localhost:5173/ParaHook_Configurator/` when the app is available

## Open Phase Queue

Later cleanup phases intentionally stay unset until the user names the next desired phase.

When a new phase is added:
- add it to `Wishlist Organization`
- add a new top-level `## [ ] Build-Path-13 / Phase N` section
- keep the scope small enough for one Codex implementation pass
- preserve the Build Path boundary against graph truth, restore/replay, and Edit History ownership

## Completion Read

Implemented:
- added a current-position marker overlay inside `BuildPathTimelineStrip`
- kept the marker synchronized with selected master timeline step ids and selected order index
- aligned the marker to the gap after the loaded/current command card, between the current card and the next card, instead of centering it inside the selected card or sitting behind the current position
- made the marker draggable with pointer capture and nearest-step selection
- routed marker drag through the existing `selectTimelineStep` path so global Edit History and no-op skip behavior stay shared
- kept normal icon click selection and viewport-dock previous/next controls moving the marker
- removed the dock-only current-command readback and previous/next panel so the viewport dock is just the icon timeline plus scrub marker
- moved the default viewport-docked Build Path anchor to bottom-left with zero offset from the Model Viewport edge
- let the viewport-docked Build Path strip grow naturally with its cards until it reaches full Model Viewport width, then scroll horizontally for longer timelines
- kept the scrollbar visually hidden while the strip is still growing and showed it only when the rail actually overflows
- kept the compact viewport-docked strip dimensions and styling intact

Verified:
- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx`
- `npx.cmd tsc -b`
- `npm.cmd run build`
- local HTTP smoke at `http://localhost:5173/ParaHook_Configurator/` returned `HTTP 200`
- marker alignment repair re-ran the focused Build Path tests, TypeScript, production build, and local HTTP smoke at `http://localhost:5173/ParaHook_Configurator/`
- after-current-card placement repair re-ran the focused Build Path tests, TypeScript, production build, and local HTTP smoke at `http://localhost:5173/ParaHook_Configurator/`
- dock-panel removal re-ran the focused Build Path tests, TypeScript, production build, and local HTTP smoke at `http://localhost:5173/ParaHook_Configurator/`
- bottom-left zero-offset placement re-ran the focused Build Path tests, TypeScript, production build, and local HTTP smoke at `http://localhost:5173/ParaHook_Configurator/`
- full-width/scroll rail behavior re-ran the focused Build Path tests, TypeScript, production build, and local HTTP smoke at `http://localhost:5173/ParaHook_Configurator/`
- overflow-only scrollbar visibility re-ran the focused Build Path tests, TypeScript, production build, and local HTTP smoke at `http://localhost:5173/ParaHook_Configurator/`

Browser note:
- in-app Browser smoke could not run because the Browser backend reported `iab` was unavailable in this session.

## Manager Packet

Assignment: `Implemented` for Phase 1.

Scope:
- shipped the `Build-Path-13 / Phase 1` draggable current-position line
- keep later phases open for user-specified cleanup steps

Exclusions:
- no restore/replay
- no graph mutation
- no worker cache implementation
- no Compare/Pin/Branch execution
- no broad Parallel lane layout redesign

Build gate:
- focused Build Path tests passed
- TypeScript passed
- production build passed

Stop condition:
- Phase 1 is closed; wait for the user to name the next Build Path cleanup phase.

# Build-Path-15 - Scrub Future Icon State

## Doc Header

### Doc History
2. 2026-05-25 10:44:40: Implemented and closed Build-Path-15 by adding presentation-only `past` / `current` / `future` temporal-state attributes to Build Path timeline cards, applying Fusion-style visual suppression to future linear icons while keeping them clickable scrub targets, extending future-state dimming into workspace Parallel topology cards and connectors from the master scrub position, and proving the behavior with focused Build Path tests, TypeScript, and production build verification.
1. 2026-05-25 10:38:21: Added this future Build Path phase to plan Fusion-style visual suppression for timeline icons that sit after the current scrub position, keeping them clickable and part of the build story while clearly showing they are not active at the selected build time.

### Purpose

This doc plans `Build-Path-15`.

Use it to answer:
- how Build Path should visually distinguish active/current timeline icons from future icons after the scrub marker
- how a user can scrub from a later build position back to an earlier position and immediately see which later operations are currently inactive
- how the linear strip and Parallel topology read should share one temporal-state language
- how to avoid confusing "future at scrub position" with disabled, invalid, deleted, or unavailable commands

Do not use it for:
- changing accepted build event order
- changing graph truth
- changing Edit History undo/redo semantics
- adding restore/replay behavior
- changing viewport geometry masking logic
- deleting or disabling future timeline cards

## Doc Body

`Build-Path-15` is a visual detail phase for Build Path scrub clarity.

When the user scrubs the master Build Path timeline backward, later build steps should remain visible but read as inactive at the current scrub position. The reference behavior is Fusion's timeline: operations after the timeline marker still exist, but their icons become visually suppressed so the user can tell which future features are currently off.

The important naming decision:
- these icons are not truly disabled
- they should remain clickable as scrub targets
- they should be visually marked as `future`, `inactive`, or `ahead-of-scrub`, not semantically disabled

Suggested visual language:
- active past/current steps keep normal opacity, saturation, border contrast, and hover affordance
- the selected/current step remains the strongest focus
- future steps after the selected master position use reduced opacity, desaturation, flatter border/background, and no glow
- future state should be obvious but still readable enough that the user can pick a future step to scrub forward again

Boundary rule:
- future icon styling is presentation-only over existing selected timeline state
- it must not mutate graph truth, event truth, Edit History, worker checkpoints, or command availability
- it must not use the native `disabled` attribute for future timeline cards because future cards are still valid scrub targets

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-16. Add presentation-only temporal state to Build Path timeline icons so future steps after the scrub position read as inactive without becoming disabled or mutating graph truth.

### `Build-Path-15 / Phase 1`

- [x] Derive per-step temporal state from the selected master timeline position.
- [x] Mark each timeline card as `past`, `current`, or `future` with stable data attributes.
- [x] Style `future` cards as visually suppressed while keeping them clickable.
- [x] Keep current selected card styling stronger than future suppression.
- [x] Preserve viewport-docked and workspace-hosted timeline behavior.
- [x] Prove future styling does not create Edit History entries or change graph truth.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-9`

### `Build-Path-15 / Phase 2`

- [x] Extend temporal-state read into workspace Parallel topology cards.
- [x] Dim topology cards whose timeline steps are after the selected master position.
- [x] Dim connectors that are downstream of or exclusively attached to future topology nodes.
- [x] Keep Output/sink card styling honest when all contributing inputs are future.
- [x] Preserve branch-local playhead behavior and semantic connector colors.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`

## [x] `Build-Path-15 / Phase 1` - `Linear Timeline Future Icon State`

### Phase 1 Summary

Add a derived temporal-state read to the linear Build Path timeline so steps after the selected scrub position look inactive without becoming disabled.

Implementation status:
- `BuildPathTimelineStrip` now derives `past`, `current`, and `future` state from the selected master timeline index
- timeline buttons expose `data-build-path-step-temporal-state`
- future buttons are visually subdued with lower opacity, desaturation, softer border/background, and no glow
- future buttons remain enabled and clickable scrub targets
- viewport-docked and workspace-hosted timeline strips share the same temporal-state attribute

### Phase 1 Implementation Spec

The implementation pass should:
- derive temporal state from `selectedTimelineStepId` and the existing master timeline order
- assign each visible Build Path timeline step one of:
  - `past`
  - `current`
  - `future`
- expose the state through a stable attribute such as `data-build-path-step-temporal-state`
- keep future cards as buttons and keep click-to-scrub behavior intact
- style future cards with reduced opacity, desaturation, softer border/background, and no selected/current glow
- avoid making future cards look like error, deleted, unavailable, or loading states
- preserve the current-position marker as the main time boundary
- preserve selected/current styling for the selected step
- keep viewport-docked and workspace-hosted timeline rendering consistent
- ensure keyboard/focus affordances still work for future cards

Do not include:
- graph mutation
- restore/replay
- worker checkpoint behavior
- Edit History model changes
- branch-local playhead history
- viewport geometry masking changes
- Parallel topology card dimming; Phase 2 owns that

Verification should cover:
- [x] selecting an earlier master step marks later timeline cards as `future`
- [x] selecting the latest step leaves no cards marked `future`
- [x] future cards remain clickable and can scrub the timeline forward
- [x] future card selection still uses the existing timeline selection path
- [x] future styling does not create extra Edit History entries beyond the actual user-driven selection behavior already owned by Build Path
- [x] viewport-docked and workspace-hosted strips expose the same temporal-state attributes
- [x] focused Build Path surface tests
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] `npm.cmd run build`

## [x] `Build-Path-15 / Phase 2` - `Parallel Topology Future State`

### Phase 2 Summary

Carry the same temporal-state language into the workspace Parallel topology graph after the linear strip has the core state.

Implementation status:
- workspace Parallel topology cards now expose `data-build-path-topology-temporal-state`
- command topology cards derive future state from the selected master timeline position
- Output/sink cards derive their state from incoming topology contributor states
- connectors expose `data-build-path-topology-temporal-state` and dim when attached to future topology paths
- semantic connector color attributes remain unchanged; CSS changes visual strength through opacity
- topology card clicks preserve the existing branch-local playhead behavior instead of becoming master timeline selection

### Phase 2 Implementation Spec

The implementation pass should:
- reuse the master timeline temporal-state read from Phase 1
- mark topology command cards as `past`, `current`, or `future` according to their timeline step order
- keep Output/sink cards as presentation reads over their contributing topology nodes
- dim future topology cards without using disabled behavior
- dim connectors when the connector is downstream of the current scrub point or only connects future nodes
- preserve connector semantic color family by changing opacity/strength instead of replacing colors
- keep branch-local playhead selection behavior intact
- keep lane readback disclosure behavior intact

Do not include:
- graph mutation
- topology layout persistence
- manual card dragging
- restore/compare/pin/branch execution
- worker checkpoint/cache behavior

Verification should cover:
- [x] a `1 > 6 > 1` graph dims future Extrude cards when the selected master step is the source Sketch
- [x] connectors attached to future-only paths are visually subdued while preserving connector color attributes
- [x] selecting a future topology card preserves the existing branch-local selection behavior without mutating master order or graph truth
- [x] Edit History behavior matches existing Build Path timeline and branch-local selection semantics
- [x] focused Build Path surface tests
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] `npm.cmd run build`

## Manager Packet

Assignment: `Phases 1-2 Closeout`.

Scope:
- create a presentation-only future-step visual state for Build Path scrub clarity
- start with the linear timeline strip
- extend the same language into Parallel topology after the linear strip is proven
- keep future cards clickable and semantically valid

Exclusions:
- no graph mutation
- no restore/replay
- no command disabling
- no worker cache implementation
- no viewport geometry masking changes

Build gate:
- [x] focused Build Path timeline rendering tests
- [x] focused Parallel topology rendering tests
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] `npm.cmd run build` for runtime/style changes

Stop condition:
- Build Path has Fusion-style inactive future icon visuals when the user scrubs the master timeline backward, including matching Parallel topology future dimming while preserving graph truth and click-to-scrub behavior.

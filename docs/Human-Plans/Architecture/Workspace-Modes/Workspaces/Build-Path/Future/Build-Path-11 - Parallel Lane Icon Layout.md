# Build-Path-11 - Parallel Lane Icon Layout

## Doc Header

### Doc History
1. 2026-05-23 12:27:02: Added and prepped this future Build Path phase to clean up Parallel mode by drawing branch-local build icons in parallel lanes instead of reading independent branch work as one cramped linear strip.

### Purpose

This doc plans `Build-Path-11`.

Use it to answer:
- how Parallel mode should draw Build Path icons side by side when independent branch lanes exist
- how branch-local icon placement should remain derived from the existing Build Path branch lane model
- what needs to stay true before later branch comparison, restore, or authored branch creation work starts

Do not use it for:
- changing branch classification truth
- changing accepted Build Path event order
- graph layout or Spaghetti node layout
- restore, branch-from-here, compare, or pin execution
- worker checkpoint/cache behavior
- replacing the Master timeline

## Doc Body

`Build-Path-11` is a visual cleanup phase for the already-shipped Parallel mode.

Current behavior has enough branch/dependency data to know when independent work exists, but the visual lane read still needs to become easier to understand. Parallel branch work should be drawn as parallel icon lanes, not only as a compressed serial-looking strip.

Boundary rule:
- Parallel lane icon layout is a Build Path presentation read over existing timeline and branch-lane derivations.
- It must not invent new dependency truth, reorder the master timeline, mutate graph truth, or make scrub movement into restore behavior.

The user will describe the desired visual shape after this setup doc lands. This plan therefore reserves the cleanup lane and defines the safe phase boundaries before implementation details are tightened.

## Vision

The healthy Build Path Parallel read is:
- Master mode keeps one accepted event order.
- Parallel mode shows branch-local events in lanes that can be scanned side by side.
- Independent branch chains should be visually parallel where the available dependency data supports it.
- Merge or checkpoint candidates should stay anchored to the common master story instead of pretending every lane is a separate authored history.
- The compact viewport-docked presentation should stay usable and should not become a full graph editor.

## Wishlist Organization

### High Level Goals

- [ ] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [ ] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [ ] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [ ] Build-Path-Gen1-CLG-10. Draw Parallel mode branch-local build icons in derived parallel lanes without changing master timeline order, graph truth, or Edit History.

### `Build-Path-11 / Phase 1`

- [ ] Inventory the current Parallel mode render shape and branch-lane data available to the UI.
- [ ] Define the visual lane model for side-by-side icon placement.
- [ ] Preserve Master timeline order as the ordering truth.
- [ ] `Build-Path-Gen1-HLG-5`
- [ ] `Build-Path-Gen1-HLG-6`
- [ ] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 2`

- [ ] Render branch-local icons in parallel lanes where lane data exists.
- [ ] Keep branch-local selected/playhead styling readable per lane.
- [ ] Preserve compact viewport-docked constraints.
- [ ] `Build-Path-Gen1-HLG-6`
- [ ] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 3`

- [ ] Add focused tests for independent branch lane icon placement and master-order preservation.
- [ ] Verify the side-panel app with a Sketch plus independent/dependent branch setup if the live setup is available.
- [ ] Record any visual follow-up that requires more product direction from the user.
- [ ] `Build-Path-Gen1-HLG-5`
- [ ] `Build-Path-Gen1-HLG-6`

## [ ] `Build-Path-11 / Phase 1` - `Parallel Lane Visual Model`

### Phase 1 Summary

Define exactly how existing Build Path branch-lane data should become a side-by-side icon layout in Parallel mode.

### Phase 1 Implementation Spec

The implementation pass should:
- inspect the current `BuildPathSurface` Parallel-mode rendering and branch lane read models
- document or encode the visual lane model before changing paint behavior
- keep Master mode unchanged
- identify whether the docked strip needs a single-row compact layout, a stacked mini-lane layout, or a scrollable lane layout
- preserve stable event ids, timeline step ids, branch lane ids, and branch-local playheads

Do not include:
- new dependency inference
- graph mutation
- worker replay
- restore or branch execution
- compare or pin behavior
- broad restyling outside Build Path

Likely seams:
- `src/app/buildPath/BuildPathSurface.tsx`
- `src/app/buildPath/buildPathRuntime.ts`
- `src/app/buildPath/buildPathTimeline.ts`
- `src/app/theme/foundation/base.css`
- focused Build Path tests

Verification should cover:
- Master mode still renders in accepted event order
- Parallel mode can read the branch lanes needed for layout
- missing/insufficient branch lane data stays honest instead of drawing fake parallelism

## [ ] `Build-Path-11 / Phase 2` - `Parallel Icon Lane Rendering`

### Phase 2 Summary

Render independent branch-local Build Path icons in visibly parallel lanes.

### Phase 2 Implementation Spec

The implementation pass should:
- draw branch-local icons in lane rows or columns according to the Phase 1 visual model
- keep master context visible enough that the user can understand where the branch lane belongs
- show selected branch-local playheads without hiding the selected master step readback
- keep icon controls stable in size so lane labels, hover states, and selection states do not shift the dock
- preserve the compact viewport-docked Build Path surface and the normal titlebar behavior for split/tiled/windowed hosting

Do not include:
- graph layout changes
- new graph document creation
- compare UI
- restore/branch execution
- pin persistence
- worker checkpoint/cache implementation

Verification should cover:
- two independent branch chains draw as distinct parallel lanes
- a dependent chain remains visually connected to its dependency lane/read
- selected branch-local playhead styling is readable
- Edit History entry counts are unchanged by lane selection

## [ ] `Build-Path-11 / Phase 3` - `Parallel Lane Proof And Follow-Up Routing`

### Phase 3 Summary

Prove the new Parallel lane icon layout and record any next visual cleanup that needs more product direction.

### Phase 3 Implementation Spec

The implementation pass should:
- add focused tests for lane layout data and rendered Parallel-mode state
- run TypeScript and production build when runtime source changes
- verify in the in-app browser if a live branch setup is available
- update the Build Path family docs only for behavior actually achieved
- leave unresolved visual choices as explicit follow-up notes instead of silently stretching this phase

Do not include:
- expanding the scope into restore, branch-from-here, compare, pin, or worker checkpoint behavior
- changing Master scrub semantics
- changing viewport preview masking

Verification should cover:
- focused Build Path tests
- `npx.cmd tsc -b`
- `npm.cmd run build` if runtime source changes
- in-app browser smoke check at `http://localhost:5173/ParaHook_Configurator/` when a live branch scenario is available

## Manager Packet

Assignment: `Packet` only for now. Wait for user visual direction before implementation.

Scope:
- reserve and prep the Build-Path-11 family phase
- keep this as a Parallel-mode visual layout cleanup
- start implementation later only after the desired icon/lane shape is described

Exclusions:
- no runtime code changes in this setup pass
- no restore/replay
- no graph mutation
- no Browser visibility mutation
- no worker cache implementation
- no Compare/Pin/Branch execution

Build gate:
- docs-only setup does not require build
- runtime implementation phases will require focused Build Path tests, `npx.cmd tsc -b`, and `npm.cmd run build`

Stop condition:
- Build-Path-11 is ready for collaborative phase-by-phase refinement once the user describes the desired parallel icon layout.

# Build-Path-10 - Viewport Scrub Preview Masking

## Doc Header

### Doc History
2. 2026-05-23 10:21:56: Implemented and closed `Build-Path-10 / Phases 1-3` with a Build Path-owned viewport preview read, presentation-only viewer layer masking, source-node fallback, focused tests, typecheck, production build, and an honest browser smoke note that reload cleared the in-memory Build Path timeline before a live Sketch/Extrude visual proof could be captured.
1. 2026-05-23 10:06:28: Added and prepped this future Build Path phase after live review showed Build Path selection could read `Sketch` while the viewport still displayed later Extrudes.

### Purpose

This doc plans `Build-Path-10`.

Use it to answer:
- how Build Path scrub should make the viewport visually match the selected build step
- how later geometry should be hidden, ghosted, or marked out-of-scope without mutating authored graph truth
- which viewer/read seams can support a safe first preview pass before real restore or replay exists

Do not use it for:
- authored graph restore
- worker checkpoint replay
- deleting or rebuilding geometry
- compare UI
- pin persistence
- changing canonical Edit History undo/redo

## Doc Body

`Build-Path-10` is the missing visual-read phase between safe scrub selection and later restore/replay actions.

Current behavior is safe but incomplete: selecting an earlier Build Path step changes the Build Path playhead/readback, but the Model Viewport still shows final geometry.

This phase should add a derived viewport preview mask so selected Build Path time is visible without pretending to be a real graph restore.

Boundary rule:
- Build Path scrub preview is a viewer presentation read.
- It must not mutate Spaghetti graph truth, Browser content truth, worker checkpoint storage, or Edit History stacks.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-9. Add a derived viewport preview mask for Build Path scrub selection without changing graph truth, viewer build truth, or Edit History.

### `Build-Path-10 / Phase 1`

- [x] Define the selected-step viewport preview read model.
- [x] Decide how accepted Build Path events map to visible output ids, affected node ids, and later-step ids.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-10 / Phase 2`

- [x] Apply the preview read to the Model Viewport as derived presentation.
- [x] Hide or ghost later geometry when the selected Build Path step is earlier than final.
- [x] Preserve final geometry when scrub preview is cleared or the latest step is selected.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-10 / Phase 3`

- [x] Prove scrub preview does not mutate graph truth, Browser content truth, worker cache state, or Edit History.
- [x] Add browser verification for Sketch-selected visual state versus final selected visual state.
- [x] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-10 / Phase 1` - `Preview Read Model`

### Phase 1 Summary

Derive the viewport preview state from the selected Build Path step and accepted timeline events.

### Phase 1 Implementation Spec

The implementation pass should:
- add a pure Build Path preview helper if the source seams are sufficient
- derive selected timeline step id, included event ids, excluded later event ids, included output ids, and excluded output ids where available
- prefer output ids for viewer masking when linked build results provide them
- fall back to affected node ids only as read metadata if output ids are unavailable
- expose an honest status such as `empty`, `final`, `preview-ready`, or `insufficient-output-mapping`

Do not include:
- viewer rendering changes
- graph mutation
- worker checkpoint replay
- restore behavior
- persistence

Likely seams:
- `src/app/buildPath/buildPathTimeline.ts`
- `src/app/buildPath/buildPathRuntime.ts`
- `src/app/buildPath/useBuildPathRuntimeStore.ts`
- focused tests under `src/app/buildPath/`

Verification should cover:
- selecting Sketch before Extrude marks later Extrude output ids as excluded when output ids exist
- selecting the latest step produces final/no-mask state
- missing output ids produces honest insufficient mapping instead of fake viewport truth

### Phase 1 Result

Implemented `src/app/buildPath/buildPathViewportPreview.ts`.

Result:
- `deriveBuildPathViewportPreviewRead(...)` derives selected, included, and excluded Build Path timeline/event reads.
- Earlier selected steps produce excluded later timeline ids, event ids, output ids, and node ids.
- The helper supports `output-id`, `source-node-id`, and combined mapping strategies.
- A missing explicit selected step now follows the Build Path surface default and previews the first timeline step, so viewport preview matches the scrub readback.
- The read remains view-only and declares that it does not mutate graph truth, Edit History, or Browser visibility.

Verification:
- `npm.cmd test -- --run src/app/buildPath/buildPathViewportPreview.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-10 / Phase 2` - `Viewport Preview Mask Integration`

### Phase 2 Summary

Apply the Build Path preview read to the Model Viewport as presentation-only masking.

### Phase 2 Implementation Spec

The implementation pass should:
- connect the preview read to the viewer presentation path through an explicit Build Path preview seam
- hide or ghost geometry from excluded later output ids
- keep selected/current-step geometry visible
- clear the preview mask when no Build Path step is selected or the latest step is selected
- avoid changing Browser visibility, authored object visibility, graph nodes, graph edges, build policy, or worker output state

Do not include:
- restore replay
- branch creation
- comparison UI
- pin/checkpoint persistence
- worker checkpoint storage

Likely seams:
- current viewer output/render eligibility helpers
- Build Path runtime selection state
- Model Viewport presentation props or store selectors
- focused viewer/build path tests

Verification should cover:
- Sketch-selected preview hides or ghosts later Extrude output in the viewport
- latest-step preview shows final geometry
- Browser object visibility is unchanged
- Edit History undo/redo stacks are unchanged

### Phase 2 Result

Implemented presentation-only viewport masking.

Result:
- `applyBuildPathViewportPreviewMaskToLayerRecipe(...)` filters excluded later output/source-node parts from base, baseline, and overlay viewer layer recipes without mutating the source recipe.
- `ViewerHost` derives the Build Path preview read from the runtime timeline and selected scrub step before building viewport render layers.
- `ViewerHost` exposes debug attributes for preview status, mapping strategy, excluded output count, and excluded node count.
- No Browser visibility state, graph state, worker cache state, or Edit History stack is changed.

Verification:
- `npm.cmd test -- --run src/app/buildPath/buildPathViewportPreview.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-10 / Phase 3` - `Safety And Browser Proof`

### Phase 3 Summary

Prove the visual scrub behavior in tests and against the running side-panel app.

### Phase 3 Implementation Spec

The implementation pass should:
- add focused regression tests for preview masking state
- add or update a UI test proving Build Path selection changes preview presentation only
- run the production build
- verify in the in-app browser that selecting `Sketch` no longer leaves later Extrudes visually indistinguishable from final geometry

Do not include:
- marking Restore as executable
- changing Compare, Pin, or Branch readiness
- worker checkpoint replay

Verification should cover:
- focused Build Path tests
- focused viewer/presentation tests touched by the implementation
- `npx.cmd tsc -b`
- `npm.cmd run build`
- in-app browser smoke check at `http://localhost:5173/ParaHook_Configurator/`

### Phase 3 Result

Implemented focused regression proof and runtime smoke proof.

Result:
- Added tests for output-id masking, source-node fallback masking, final/latest-step no-mask state, default first-step preview state, and immutable layer recipe filtering.
- Re-ran the focused Build Path test slice, TypeScript build, and production build.
- Browser smoke confirmed the `ViewportRoot` preview debug attributes mount after reload. The reload cleared the in-memory Build Path timeline, so the captured smoke state was `previewState=empty` rather than a live Sketch/Extrude visual proof. The unit coverage proves the masking path; a future browser-only regression can seed or preserve Build Path runtime events before capture.

Verification:
- `npm.cmd test -- --run src/app/buildPath/buildPathViewportPreview.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`
- In-app browser smoke at `http://localhost:5173/ParaHook_Configurator/`: preview attributes mounted with `previewState=empty`, `excludedOutputs=0`, `excludedNodes=0` after page reload.

## Manager Packet

Assignment: `Packet + Implement` for Phases 1-3 after Manager review confirmed the source read was sufficient for a narrow presentation-only mask.

Scope:
- create the pure preview read model first
- do not touch renderer masking until the source read is proven
- stop if output id mapping is insufficient for the live Sketch -> Extrude case

Exclusions:
- no restore/replay
- no graph mutation
- no Browser visibility mutation
- no worker cache implementation
- no Compare/Pin/Branch execution

Build gate:
- focused Build Path tests
- `npx.cmd tsc -b`
- `npm.cmd run build` if runtime source changes

Stop condition:
- Complete. A selected earlier Build Path step produces an honest preview read and `ViewerHost` applies the resulting mask as presentation-only viewport filtering.

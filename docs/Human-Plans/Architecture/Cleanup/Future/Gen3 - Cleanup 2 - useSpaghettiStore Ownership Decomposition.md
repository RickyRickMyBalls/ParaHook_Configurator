# `Gen 3 - Cleanup 2` - `useSpaghettiStore Ownership Decomposition`

## Doc Header

### Doc History
1. 2026-05-05 20:30:15: Created this dedicated `Gen 3 - Cleanup 2` future doc to turn the post-`useAppStore` recommendation into the next concrete oversized-sink cleanup lane, grounding it in the current `src/app/spaghetti/store/useSpaghettiStore.ts` read and breaking the work into small owner-boundary phases that Codex can execute one by one

### Purpose
- decompose `src/app/spaghetti/store/useSpaghettiStore.ts` by owner boundary instead of by arbitrary line count
- preserve accepted graph-runtime and authored-node ownership while reducing one file's concentration of selectors, history, viewport/workspace glue, and runtime state
- give `Cleanup Gen3` the next implementation-ready family phase after the closed `useAppStore` lane
- keep the migration incremental enough that each implementation phase stays small enough for one clean Codex pass

### Scope

This phase covers:
- owner confirmation and decomposition planning for `useSpaghettiStore.ts`
- explicit extraction targets for pure types, accepted-runtime helpers, graph-edit history seams, selector/read-model seams, and viewport/workspace helpers
- stable-facade migration rules that preserve one exported `useSpaghettiStore` surface during the split
- verification and stop rules for each implementation phase

This phase does not cover:
- moving accepted build/result truth out of `useSpaghettiStore`
- a same-pass `Viewer.ts` or `ViewportOverlay.tsx` rewrite
- re-deciding app-store, Browser, or workspace canonical ownership
- a blind multi-store split just because the file is large

## Doc Body

### Family Phase Goal

`useSpaghettiStore.ts` should stop acting like one giant graph-runtime plus viewport-session plus workspace read-model bucket.

The target shape is:
- one exported `useSpaghettiStore` facade for callers during migration
- smaller internal modules that own coherent runtime, history, selector, and workspace-facing seams
- accepted graph/runtime truth still canonical in the spaghetti store
- editor/viewer/workspace consumers reading those truths through clearer owner-area modules instead of one 9k-line file

### Boundary Rules

- keep accepted graph-runtime, compile-build, and authored graph-edit truth in `useSpaghettiStore`
- do not move viewer runtime ownership into the app store
- do not turn viewport or workspace selectors into a second owner of graph truth
- do not combine this lane with `ViewportOverlay.tsx` or `Viewer.ts` extraction even when the seams touch each other
- preserve one exported `useSpaghettiStore` facade until the internal owner modules are proven

### Current Live Read

Current `useSpaghettiStore.ts` responsibilities cluster into at least six real owner seams:

1. Graph runtime and accepted build/result truth
- `GraphCompileBuildState`
- `GraphRuntimeState`
- accepted build bundle, preview bundle, accepted geometry result, and impact snapshot helpers

2. Graph edit and CAD history helpers
- graph node move, connect, parameter, and feature history option surfaces
- geometry sketch local-history and child-restore helpers
- edit-history shaping and restore-point coordination

3. Geometry sketch and transform session truth
- sketch plane pick state
- geometry sketch draw/review state
- transform- or session-adjacent helper surfaces that feed viewer and overlay reads

4. Workspace and viewport read/model glue
- editor workspace surface state helpers
- viewport restore and workspace presentation helpers
- split-direction and docking helper imports

5. Large selector/read-model surface
- selector cluster concentrated later in the file before the root store creation
- graph/editor/read-model helpers that are still mixed together with runtime truth

6. Root store composition
- the `create<SpaghettiStoreState>((set, get) => ({ ... }))` facade and the late file-tail setup that still reads as one second app kernel

### Acceptance Read

This family phase is acceptable when:
- `useSpaghettiStore.ts` has one visible owner-map and a small-phase decomposition ladder
- each implementation phase stays small enough for one clean Codex pass
- the eventual runtime split preserves accepted graph/runtime truth in the spaghetti store
- later `ViewportOverlay.tsx` and `Viewer.ts` cleanup can depend on the same owner-pattern without being coupled into the same lane

## Vision

This family phase belongs to `Cleanup Gen3` and advances the shipped pattern from `Gen 3 - Cleanup 1`.

The intended outcome is not "many new stores."

The intended outcome is:
- one honest spaghetti-store facade
- explicit owner-area modules under that facade
- smaller graph-runtime, sketch/history, selector, and workspace-read seams
- a better handoff for later UI and viewer cleanup without weakening graph-native ownership

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen3-HLG-1` - Break `useSpaghettiStore.ts` into smaller honest ownership seams without inventing second owners for graph runtime, accepted build truth, sketch sessions, or viewport-facing graph state.
- [ ] `Cleanup-Gen3-HLG-2` - Keep the migration incremental and proofable so each extraction pass is small enough for one Codex implementation without forcing risky context compaction or a big-bang graph-store rewrite.
- [ ] `Cleanup-Gen3-HLG-3` - Leave the runtime, selector, and session seams clearer so later `ViewportOverlay.tsx` and `Viewer.ts` cleanup can inherit the same pattern instead of reopening graph/store ownership first.

### Codex Level Goals

- [ ] CLG 1. Confirm the live `useSpaghettiStore.ts` owner map and lock the migration rules before any extraction starts.
- [ ] CLG 2. Extract pure types and accepted-runtime helpers before moving heavier graph-edit or viewport-facing action seams.
- [ ] CLG 3. Split graph-edit history, sketch-session, and selector/read-model seams into explicit owner-area modules one narrow slice at a time.
- [ ] CLG 4. End with a smaller spaghetti-store facade plus one explicit handoff for later `ViewportOverlay.tsx` and `Viewer.ts` cleanup.

### `Gen 3 - Cleanup 2 / Phase 1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] reconfirm the exact live owner map inside `useSpaghettiStore.ts`
- [ ] lock keep-one-facade, no-new-store, and no-Viewer/no-Overlay widening rules

### `Gen 3 - Cleanup 2 / Phase 2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract only pure types and accepted-runtime helper seams first

### `Gen 3 - Cleanup 2 / Phase 3`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract graph-edit and geometry-history helper seams without widening into viewport runtime

### `Gen 3 - Cleanup 2 / Phase 4`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract geometry-sketch and sketch-plane session helpers/actions behind explicit owner modules

### `Gen 3 - Cleanup 2 / Phase 5`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] split the large selector/read-model surface into explicit selector modules

### `Gen 3 - Cleanup 2 / Phase 6`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] shrink the root spaghetti-store facade and record the handoff to later UI/viewer cleanup

## [ ] `Gen 3 - Cleanup 2 / Phase 1` - `Owner Map And Migration Rules Lock`

### Phase 1 Summary

#### Purpose
- reconfirm the exact `useSpaghettiStore.ts` owner map and lock the migration rules before any extraction work starts

#### Owns
- live responsibility inventory
- extraction order
- keep-versus-move rules
- stop rules for what must stay in the root store versus what may leave

#### Does Not Own
- runtime behavior changes
- new stores
- selector or session extraction

#### Current Live Read
- `GraphCompileBuildState` starts around `useSpaghettiStore.ts:225`
- `GraphRuntimeState` starts around `useSpaghettiStore.ts:277`
- accepted-build finalization helpers start around `useSpaghettiStore.ts:396`
- the root store creation begins around `useSpaghettiStore.ts:4888`
- the file is carrying graph-runtime truth, history shapes, workspace helpers, selectors, and store composition in one place, which makes the migration order the main risk

### Phase 1 Implementation Spec

#### Exact First Code Cut
- do not move runtime code yet
- inventory the owner buckets with live anchors
- name the first destination-module areas and explicit deferrals for later phases

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen3 - Cleanup 2 - useSpaghettiStore Ownership Decomposition.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen3-Index.md`

#### No-Widening Rule
- do not extract helpers yet
- do not change caller-facing store API
- do not widen into `Viewer.ts` or `ViewportOverlay.tsx`

#### Verification Shape
- the doc records one stable owner map
- the next phase outputs are concrete enough to implement without re-planning the whole file

#### Done Shape
- the file has one explicit owner inventory and one agreed extraction order

## [ ] `Gen 3 - Cleanup 2 / Phase 2` - `Pure Types And Accepted Runtime Helper Extraction`

### Phase 2 Summary

#### Purpose
- move the safest non-action seams out first so later runtime extraction has smaller root-surface noise

#### Owns
- pure exported types that do not need root-store closure access
- accepted build/result helper cluster
- compile-build and accepted-impact helper math

#### Does Not Own
- graph-edit action bodies
- sketch-session actions
- viewport/workspace behavior

#### Current Live Read
- the type surface around `GraphCompileBuildState`, `AcceptedBuildImpactSnapshot`, and `GraphRuntimeState` is already visible near the top of the file
- the accepted-build helper cluster starts around `finalizeAcceptedBuildBundle(...)` and `buildAcceptedBuildImpactSnapshot(...)`
- this is the smallest clean first move after `Phase 1`

### Phase 2 Implementation Spec

#### Exact First Code Cut
- add explicit owner modules for accepted-runtime types and pure helper functions
- re-export or import them through the root facade without changing public callers

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/graphRuntime/*`
- focused runtime tests already covering accepted build/result shaping

#### No-Widening Rule
- do not move action closures that depend on `set` or `get`
- do not widen into selector extraction yet

#### Verification Shape
- `npm.cmd run build` passes
- focused runtime tests still pass for accepted build/result shaping

#### Done Shape
- the root file no longer owns the accepted-runtime helper bulk directly

## [ ] `Gen 3 - Cleanup 2 / Phase 3` - `Graph Edit And History Helper Extraction`

### Phase 3 Summary

#### Purpose
- separate graph-edit and geometry-history helper seams from the accepted-runtime seam before moving sketch-session actions

#### Owns
- graph-edit history option/helper surfaces
- geometry-sketch local-history shaping
- child-summary and restore-point helper clusters

#### Does Not Own
- viewport or workspace runtime behavior
- active sketch-session state mutation
- viewer-specific rendering helpers

#### Current Live Read
- graph node move, connect, parameter, feature, and geometry-sketch history option types cluster early in the file around the first 220 lines
- those history seams touch shared edit-history contracts but do not require the later selector/read-model surface to move with them

### Phase 3 Implementation Spec

#### Exact First Code Cut
- extract only helper and history-shaping seams that already sit next to the graph-edit contracts
- keep store action composition in the root until the helper moves are proven

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/history/*`
- `src/app/store/editHistoryStore.ts`

#### No-Widening Rule
- do not move viewport drag or workspace pick behavior
- do not combine this slice with accepted-runtime or selector cleanup if either grows

#### Verification Shape
- focused graph-edit-history tests still pass
- root history actions still read through the same user-facing flows

#### Done Shape
- history helper bulk has an explicit owner area and the root file keeps only composition glue

## [ ] `Gen 3 - Cleanup 2 / Phase 4` - `Sketch Session And Plane Pick Slice Extraction`

### Phase 4 Summary

#### Purpose
- move the geometry-sketch and sketch-plane session seam behind explicit owner modules without widening into the full viewer runtime

#### Owns
- sketch plane pick session helpers
- geometry sketch session state/actions
- geometry sketch history scrub helper surface

#### Does Not Own
- viewer overlay rendering
- `ViewportOverlay.tsx` VM assembly
- `Viewer.ts` direct-manipulation runtime

#### Current Live Read
- the spaghetti store is already the canonical owner for geometry sketch session truth
- later UI surfaces consume `sketchPlanePickSession`, `geometrySketchSession`, and `geometrySketchHistoryScrub`, so the owner split must happen here first

### Phase 4 Implementation Spec

#### Exact First Code Cut
- create one narrow sketch-session owner module
- move only the session helpers and directly paired action bodies
- keep public store selectors stable through the root facade

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/sketch/*`
- focused sketch-session tests

#### No-Widening Rule
- do not touch `ViewportOverlay.tsx` in the same pass
- do not move viewer event-routing code

#### Verification Shape
- focused sketch-session and history-scrub tests still pass
- active sketch-plane and geometry-sketch flows still read from the same public store surface

#### Done Shape
- sketch-session truth has one explicit owner module beneath the store facade

## [ ] `Gen 3 - Cleanup 2 / Phase 5` - `Selector And Workspace Read-Model Extraction`

### Phase 5 Summary

#### Purpose
- split the late selector/read-model surface so the root file stops owning the huge query layer directly

#### Owns
- large selector clusters
- workspace/editor viewport read-model helpers
- pure projection helpers that derive from store truth

#### Does Not Own
- accepted-runtime truth
- sketch-session action logic
- actual workspace store ownership

#### Current Live Read
- the file carries a large selector cluster before the root `create(...)` block
- workspace and viewport helper imports near the top indicate a mixed read-model seam that should become explicit before the final facade shrink

### Phase 5 Implementation Spec

#### Exact First Code Cut
- extract only pure selectors and read-model helpers first
- route them through owner-area selector files instead of keeping them inline in the root

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/selectors/*`
- `src/app/spaghetti/selectors/*`

#### No-Widening Rule
- do not move action bodies in the same pass
- do not let workspace projections become a second owner of graph truth

#### Verification Shape
- focused selector tests still pass
- viewport/editor reads still resolve through the same public store surface

#### Done Shape
- the root file stops owning the main query layer directly

## [ ] `Gen 3 - Cleanup 2 / Phase 6` - `Root Facade Shrink And UI Handoff`

### Phase 6 Summary

#### Purpose
- reduce `useSpaghettiStore.ts` to composed state wiring, stable exports, and a small amount of honest glue, then record the handoff to later UI/viewer cleanup

#### Owns
- import path normalization
- duplicate helper retirement left behind by earlier phases
- final keep-in-root decisions
- handoff notes for `ViewportOverlay.tsx` and `Viewer.ts`

#### Does Not Own
- a new broad viewer or overlay cleanup in the same pass
- caller-facing API redesign

### Phase 6 Implementation Spec

#### Exact First Code Cut
- remove any duplicate helper residue after the earlier moves
- normalize imports around the extracted owner modules
- keep only state composition, stable facade exports, and minimal shared glue in the root file

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- the extracted `graphRuntime`, `history`, `sketch`, and `selectors` modules
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen3-Index.md`

#### No-Widening Rule
- do not start `Gen 3 - Cleanup 3` or `Gen 3 - Cleanup 4` implementation from this pass

#### Verification Shape
- `useSpaghettiStore.ts` reads like a facade instead of a second graph workspace kernel
- the next family phase recommendation is explicit

#### Done Shape
- the lane is honestly complete and the later UI/viewer cleanup order is recorded

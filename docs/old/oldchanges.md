# Change Log

Numbering rule for major entries:
- Prefix each new `##` section with a sequential command index: `[NNN]`.
- Increment by 1 for every new Codex-added section.

<!-- ============================================================ -->
## [001] 2026-03-03 (Compiled Master Entry)
<!-- ============================================================ -->

### Scope / Locked Invariants
- App-layer only changes in this phase; no worker/protocol/scheduler contract changes.
- Compile/build remains explicit; canvas interactions do not auto-trigger build.
- Determinism preserved for path-aware logic and composite handling (edge traversal sorted by `edgeId` where required).
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Parent composite anchor remains active while collapsed.
- Legacy mixed graphs (whole + leaf edges) are preserved; UI warns but does not delete edges.

### Canvas and Node Editor UX
- Added right-click canvas node-add menu with search, placing nodes at cursor.
- Added typed color coding for ports/anchors so colors match port kinds.
- Updated anchor measurement to use actual small port-circle elements.
- Fixed floating editor/canvas anchoring so node editor fills/anchors correctly in floating window.
- Added collapsible `Preview Mode` and `Parts List` sections.
- Updated node layout to top-left inputs and bottom-right outputs.
- Baseplate node now presents `Drivers` and `Sketch Inputs` sections with grouped labels.

### Wire Routing and Editing
- Added wire curviness slider (`0` linear, `25` baseline, `100` highly curved).
- Added reroute-point editing:
  - double-click wire to add point
  - drag point to reshape
  - double-click point to remove
  - supports multiple points per wire
- Enforced node-end tangency:
  - outputs depart right-tangent
  - inputs arrive left-tangent
- Added tangent controls for selected waypoints:
  - `Flip Tangent Side 1`
  - `Flip Tangent Side 2`
- Reworked waypoint segment routing to keep tangency through reroute points.

### Numeric Controls and Baseplate Sketch UX
- Moved Baseplate `width`/`length` to inline port controls.
- Added matching inline template for `Primitive/Number`.
- Unified value-bar control includes:
  - blue fill by min/max range
  - label + value in one row
  - arrow step nudging
  - horizontal drag-scrub
- Added Baseplate vec2 sketch inputs `anchorPoint1..anchorPoint5` under `Sketch Inputs`.
- Each vec2 sketch input uses 50/50 `X`/`Y` inline layout.
- Width/Length driver updates resync sketch points to canonical rectangle.
- Added Baseplate scrub-speed toggle (`low` blue / `high` green) and increased `high` sensitivity.

### Composite Field Tree and Path Endpoint System
- Added composite field introspection:
  - `getFieldTree`
  - `getFieldNodeAtPath`
  - `isCompositeFieldNode`
  - `listLeafFieldPaths`
  - vec2 mapping for `vec2:mm` and `vec2:unitless` -> `{ x, y }`
- Upgraded endpoints to optional path:
  - `EdgeEndpoint = { nodeId, portId, path?: string[] }`
  - schema keeps no-path compatibility and validates non-empty path segments when present
- Store normalization updates:
  - empty path -> `undefined`
  - legacy synthetic migrations:
    - `anchorPointNX` -> `anchorPointN` + `path: ['x']`
    - `anchorPointNY` -> `anchorPointN` + `path: ['y']`
  - connection drag now carries `fromPath`
- Canvas anchor keys and wire rendering are path-aware:
  - `buildPortAnchorKey` includes encoded path token
  - `parsePortAnchorKey` added
  - wire lookup/render includes endpoint paths
- Connection flow (`SpaghettiCanvas`) is path-aware:
  - hover compatibility checks full endpoint `(nodeId, portId, path)`
  - duplicate detection checks full endpoint
  - rewire uses exact input endpoint (including leaf path)
  - cycle check remains node-level via `validateGraph`
  - details lines display endpoint paths
- Composite renderer changes:
  - NodeView owns transient expansion map
  - PortView local expansion removed
  - composite leaf rows generated from field tree paths
  - child rows register path endpoints/anchors
  - Baseplate vec2 uses canonical `x`/`y` child paths (no synthetic scalar ports)
- Validator updates:
  - base port/path existence checks
  - path endpoints must resolve to leaf
  - leaf type exact-match
  - duplicate leaf target rejection
  - max connections enforced per endpoint key (`node + port + path`)
  - cycle detection unchanged
- Evaluator updates (deterministic):
  - composite input priority:
    1) leaf-path wires
    2) whole-port wire fallback
    3) literal fallback
    4) type-default fallback
  - respects `from.path`
  - edge ordering sorted by `edgeId`
  - unresolved optional composites inject defaults per locked decisions
- Compile helper updates:
  - whole-port compile lookup ignores target leaf edges
  - source extraction respects optional `from.path`

### Composite Vec2 Parent UX (Break/Group + Info Menu)
- Collapsed composite vec2 parent rows render inline `X`/`Y` value bars (blue tone, 50/50 split).
- Parent anchor remains active while collapsed.
- Inline editors continue using existing literal param backing values (no new literal store).
- Whole-port driven authority mode:
  - NodeView computes local driven maps from store edges (sorted by `edgeId`)
  - whole-driven: collapsed/expanded leaf editors become read-only
  - whole-driven: leaf drop/rewire blocked with status `Driven by parent wire`
  - leaf-driven (x/y only): per-axis disable on collapsed row
  - whole display prefers evaluated source output; falls back to literal when unresolved
  - legacy whole+leaf preserved with warning badge `Leaf override exists`
- Parent-row context menu (node-scoped absolute menu):
  - `Break composite` / `Group pins`
  - `Show info` / `Hide info`
  - closes on outside click and `Escape`
  - right-click prevents default/propagation so canvas add-node menu is not triggered
- Menu positioning fix:
  - opens under cursor correctly under canvas transforms/zoom
  - coordinates account for node scale
- Removed top-right composite action buttons in favor of context menu actions.
- Added CSS support for inline XY, driven/disabled states, warning badge, and menu visuals.

### Testing and Tooling
- Added Vitest setup and tests for field tree, validator path rules, and evaluator precedence.
- Added `npm run test` script and `vitest` dev dependency.

### Files Changed (Grouped by Area)
- Canvas/UI core:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - `src/app/spaghetti/canvas/WireLayer.tsx`
  - `src/app/spaghetti/canvas/spaghettiWires.ts`
  - `src/app/spaghetti/canvas/types.ts`
- Node/port/composite UI:
  - `src/app/spaghetti/canvas/NodeView.tsx`
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - `src/app/spaghetti/ui/ExpandedEditor.tsx`
  - `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- Schema/store/types:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
  - `src/app/spaghetti/schema/spaghettiSchema.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/spaghetti/types/fieldTree.ts`
- Compiler/runtime behavior:
  - `src/app/spaghetti/compiler/validateGraph.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.ts`
  - `src/app/spaghetti/compiler/compileGraph.ts`
- Registry/theme/tooling/tests:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/theme/v15Theme.css`
  - `package.json`
  - `src/app/spaghetti/types/fieldTree.test.ts`
  - `src/app/spaghetti/compiler/validateGraph.test.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`

### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [002] 2026-03-03 (Spaghetti Floating Window Follow-up: Default Geometry + Drag)
<!-- ============================================================ -->

### Floating Window Behavior
- Updated default Spaghetti floating window open anchor to start around 30% down from viewport top.
- Re-enabled normal dragging immediately on open (removed resize-first drag gating).
- First drag now marks the floating window as user-positioned so it behaves like a normal float window.
- Updated default open width to span from the left side to the left side of the gizmo/right overlay area.
- Updated default open height to span from the 30% top anchor down to the viewport bottom (subject to existing clamp/padding).

### Files Changed
- `src/app/AppShell.tsx`

<!-- ============================================================ -->
## [003] 2026-03-03 (Feature Stack v1 Spec-Alignment: App Layer)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only changes.
- No worker/protocol/scheduler contract changes.
- No auto-build behavior changes.
- `buildRequestSchema.profile` remains `z.record(z.string(), z.unknown())`.
- Existing composite/path/wiring behavior preserved.

### Feature API Alignment
- Added canonical profile derivation exports:
  - `hashFnv1a32(str)`
  - `profileIdFromSignature(sig)`
  - `deriveProfiles(entities)`
- Kept compatibility alias:
  - `deriveProfilesFromLines = deriveProfiles`
- Added canonical auto-link export:
  - `pickDefaultProfileRef(stack, insertIndex)`
- Kept compatibility alias:
  - `findDefaultExtrudeProfileRef = pickDefaultProfileRef`
- Aligned diagnostics type to canonical shape:
  - `Diagnostic = { featureId, level, message }`
- Kept compatibility type alias:
  - `FeatureDiagnostic = Diagnostic`

### Determinism and Derivation Contract
- Updated profile derivation to locked deterministic rules:
  - point keys use exact `${String(x)}|${String(y)}`
  - exact literal endpoints (no tolerance rounding path)
  - deterministic adjacency and traversal
  - canonical signature normalization (rotation + direction)
  - stable FNV-1a 32-bit base36 profile IDs
  - zero-area loop rejection
  - stable output sorting: area desc, signature asc, profileId asc

### Store / UI Alignment
- Store now uses canonical helpers:
  - `deriveProfiles(...)`
  - `pickDefaultProfileRef(...)`
- Added/used part stack helpers:
  - `getPartFeatureStack(node)`
  - `setPartFeatureStack(node, stack)`
- Sketch profile outputs are recomputed immediately after line edits.
- Feature stack UI diagnostics no longer rely on `diagnostic.code`.
- Diagnostics keys are deterministic:
  - `${featureId}|${level}|${message}|${index}`
- Extrude collapsed summary now matches spec format:
  - `Profile: <SketchShort>/<ProfileLabel>, Depth: <value>`
- Profile labels use `A..Z` then `Profile <n>` fallback.

### Compile / Payload Alignment
- `sp_featureStackIR` compile emission aligned to non-empty feature stack presence.
- Emitted IR payload remains:
  - `{ schemaVersion: 1, parts: Record<PartKey, IR[]> }`
- Existing part-key mapping retained (`baseplate`, `toeHook#1`, `heelKick#1`) with deterministic behavior.
- Patch/change detection path continues using stable hashing and includes `sp_featureStackIR`.

### Files Changed
- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/features/autoLink.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/profileDerivation.test.ts`
- `src/app/spaghetti/features/autoLink.test.ts`

### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [004] 2026-03-03 15:37 (Feature Stack v1 Worker Pipeline: Option-B Runtime Execution)
<!-- ============================================================ -->

### Scope / Constraints
- Implemented worker + CAD runtime execution for Feature Stack v1 with deterministic in-memory mesh-pack adapter.
- No scheduler behavior changes.
- No shared protocol contract changes.
- No auto-build behavior changes.
- Legacy build result envelope remains `PartArtifact[]`.
- Worker payload handling remains branch-specific flat profile patch (`payload.sp_featureStackIR` namespace).

### Summary
- Added app compile emission for Option-B sketch payload:
  - `IRSketch.profilesResolved: [{ profileId, area, vertices[] }]`
  - deterministic ordered loop vertices with CCW normalization
  - runtime closes loops when needed
- Added worker feature stack runtime that:
  - executes parts in sorted key order
  - executes features in IR order
  - treats app-emitted `profileId` as authoritative
  - does not re-derive profiles from lines
  - extrudes by `profileRef.profileId` with `bodyId = ir.bodyId ?? ir.featureId`
  - applies first-wins policy on duplicate `bodyId`
  - performs deterministic mesh-pack merge (not CAD boolean fuse)
- Added bounded deterministic diagnostics:
  - dedup key: `${partKey}|${featureId}|${reason}`
  - single flush per build via worker build orchestrator
- Integrated runtime into active worker build path through a new thin `buildModel` coordinator while preserving legacy artifacts output.

### Files Changed
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/worker/cad/cadTypes.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/products/foothook/buildFoothook.ts`
- `docs/listofchanges.md`

### Behavior Changes
- App compile IR now includes `profilesResolved` loop geometry for sketch ops (Option-B lock).
- Worker Feature Stack execution is active when `sp_featureStackIR` is present in current payload patch namespace.
- Worker now emits at most one aggregated warning log per build for unique runtime warnings.
- Runtime merge semantics are deterministic mesh concatenation in stable bodyId order; no CAD boolean claims.

### Verification
- `npm.cmd --prefix parahook run test`
- `npm.cmd --prefix parahook run build`
- Vite large-chunk warning remains unchanged (non-regression).

<!-- ============================================================ -->
## [005] 2026-03-03 16:05 (Feature Stack v1 Debug Preview: App-Layer IR-Driven UI)
<!-- ============================================================ -->

### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior added.
- Deterministic ordering/labels/rendering enforced for preview and diagnostics.
- Feature Stack panel placement updated to locked order: `uiSections -> params -> Feature Stack`.

### Summary
- Added deterministic Feature Stack Debug Preview driven by compile-path IR (no UI-side `compileFeatureStack` calls).
- Extracted shared compile helper in `compileGraph` so payload emission and UI cache use the same part IR derivation path.
- Added store-level cache and selector for per-part Feature Stack IR mapped from nodeId.
- Added sketch profile SVG previews with deterministic fit mapping, closed-loop visual enforcement, stable labels, and stable numeric formatting.
- Added extrude preview summary and profile highlight based strictly on `profileRef.profileId`.
- Applied deterministic diagnostics sort/key policy and per-level badge counts.
- Added namespaced `fsPrev_*` styles and pure-function tests for preview determinism.

### Files Changed
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/ui/features/profilePreview.tsx`
- `src/app/spaghetti/ui/features/profilePreview.test.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes
- Feature previews now consume compile-path part IR via store cache (`getPartFeatureStackIrForNode`) instead of recompiling in UI.
- Sketch preview profile ordering is now deterministic: area descending, then `profileId` ascending.
- Sketch/extrude preview labels now use `A..Z`, then `Profile <n>` fallback.
- Extrude preview highlight now keys only on `profileRef.profileId`.
- Diagnostics display now applies stable ordering (`error`, `warning`, `info`, then message, then featureId) and deterministic keys.
- Part node panel order is now `uiSections -> params -> Feature Stack`.

### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [006] 2026-03-03 17:04 (Expose Fields + View Modes)
<!-- ============================================================ -->

### Scope / Constraints
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No auto-build trigger behavior changes.
- Determinism preserved for composite field ordering and path-aware endpoint handling.
- Composite context menus remain node-scoped (no `createPortal(document.body)`).
- Legacy mixed whole+leaf graphs preserved with warning behavior; no edge deletion.
- Parent composite anchor remains active in collapsed row mode.
- Part panel ordering preserved when visible: `uiSections -> params -> Feature Stack`.

### Summary
- Added `fieldTree` composite definitions for `spline2` and `profileLoop` with deterministic leaf traversal.
- Added deterministic tests for new `fieldTree` leaf paths.
- Extended `validateGraph` tests with test-local `profileLoop` fixture node defs (no runtime node-type additions).
- Added expanded-canvas row view modes: `collapsed`, `essentials` (default), `everything`.
- Wrapped `NodeView` in `React.memo` and passed `rowViewMode` as a stable union prop from `SpaghettiCanvas`.
- Enforced composite expansion state key scope to parent row only: `spComp|in|${nodeId}|${portId}`.
- Applied mode filters:
  - `collapsed`: parent rows/anchors visible, leaf rows hidden.
  - `essentials`: labels/types/editors/composite expansion visible; debug/info hidden.
  - `everything`: full debug/info visibility and full field disclosure rendering.
- Generalized composite handling beyond vec2 while preserving existing driven-authority behavior.
- Normalized baseplate spline output display labels to:
  - `Base Plate Spline (Inner)`
  - `Base Plate Spline (Outer)`
- Added minimal `spComp_` and `spView_` CSS hooks for mode/control styling.

### Files Changed
- `src/app/spaghetti/types/fieldTree.ts`
- `src/app/spaghetti/types/fieldTree.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes
- Composite types `spline2` and `profileLoop` now expose deterministic leaf paths in app-layer field tree introspection.
- Row mode now controls node-port disclosure without mutating graph edges or compile/evaluate semantics.
- In collapsed row mode, parent composite anchors remain wireable while leaf anchors are hidden.
- Essentials mode now suppresses debug/info UI while preserving core port labels, type tags, editors, and composite expansion interactions.
- Everything mode shows debug/info panels and full recursive composite leaf rendering.
- Baseplate spline output labels are standardized for UI display without changing port IDs/types.

### Verification
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [007] 2026-03-03 17:55 (UI Stabilization Amendments: Composite Map State + Output Leaf Rendering)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only implementation.
- No worker/protocol/scheduler contract changes.
- No CAD/feature execution logic moved into UI.
- No compiler behavior changes for graph semantics.
- Row modes remain render-only controls.

### Summary of Implementation
- Added row-mode helper flags in `rowViewMode` limited to row concerns only:
  - `showEditors`
  - `showDebugInfo`
  - `renderLeafRows`
  - `forceLeafRows`
- Added composite expansion key helper with exact parent-key format:
  - `spComp|in|${nodeId}|${portId}`
  - `spComp|out|${nodeId}|${portId}`
- Moved composite expansion state ownership to `SpaghettiCanvas` using `Map<string, boolean>` and map-safe update helpers.
- Removed `evaluateSpaghettiGraph` usage from `NodeView`; node evaluation/derived display data are now prepared in `SpaghettiCanvas` and passed as node-scoped props.
- Kept `NodeView` render-focused and memoized while avoiding broad store subscriptions.
- Implemented composite output leaf rendering with deterministic field-tree traversal and mode-gated visibility:
  - `collapsed`: parent only
  - `essentials`: expansion-gated leaves
  - `everything`: forced leaf visibility without mutating stored expansion state
- Ensured output leaf anchors mount only when leaf rows are rendered; parent anchors remain mounted.
- Replaced per-node inline hover/drop wrappers from canvas render loop with stable shared callbacks.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/rowViewMode.test.ts`
- `src/app/spaghetti/canvas/compositeExpansion.ts`
- `src/app/spaghetti/canvas/compositeExpansion.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `docs/listofchanges.md`

### Behavior Changes
- Row mode semantics are now explicit and deterministic for composite leaves across input/output columns.
- Composite expansion state is now parent-row scoped for both directions (`in` and `out`) and stored as canvas-local map state.
- `NodeView` no longer performs graph evaluation; UI rendering is separated from evaluation logic.
- Output composite ports now expose deterministic leaf rows/anchors when visible by mode.
- No compiler/worker/protocol behavior changes.

### Perf Check
- Method: render-path stability audit focused on `NodeView` subtree invalidation sources.
- Verified changes:
  - node-scoped derived render payload is memoized in `SpaghettiCanvas` (`nodeRenderDataById`),
  - composite expansion mutation bumps revision for the affected node only,
  - shared hover/drop handlers are stable callbacks rather than per-node inline wrappers.
- Result: non-node canvas state updates no longer introduce avoidable node-subtree prop churn from those prior wrapper/data patterns.

### CSS Impact
- Global theme selectors changed: none.
- Local class strategy retained; no `v15Theme.css` selector edits were required for this pass.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [008] 2026-03-03 18:03 (Canvas Drag Rerender Guard for Port Drop State)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI repair only in allowed canvas layer.
- No changes in `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler edits.
- Row mode and composite expansion behavior remain render-only concerns.

### Summary of Implementation
- Added a stable `connectionDragAnchor` snapshot in `SpaghettiCanvas` derived only from anchor identity fields (`direction`, `nodeId`, `portId`, `path`).
- Switched hover validation and input/output drop-state callbacks to depend on the stable anchor snapshot instead of the full `connectionDrag` object.
- This prevents per-pointer-move callback identity churn from propagating into memoized `NodeView` props during wire dragging.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- While dragging a wire, node drop-state rendering now updates based on anchor/hover target changes rather than every pointer-position update, reducing avoidable node rerenders.
- No graph compile/evaluate semantics were changed; no row mode or composite state semantics were changed.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [009] 2026-03-03 18:09 (Anchor Bar Click Forces Essentials Mode Deterministically)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only patch in canvas layer.
- No changes under `features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- Row-mode transition remains render/UI-only behavior.

### Summary of Implementation
- Added a canvas click-capture guard that detects clicks inside Baseplate sketch anchor-point value bars.
- Detection now resolves to the parent composite group root port label (`Anchor Point 1..5`) so leaf `X/Y` bar clicks are included.
- Mode transition is forced one-way to `essentials` via `requestAnimationFrame` to avoid ending in any other row mode during the same click cycle.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking any sketch anchor-point value bar now settles row mode to `essentials` deterministically, including clicks on expanded leaf bars.
- No compile/evaluate/runtime behavior changed.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [010] 2026-03-03 20:08 (Selected Baseplate Chevron Interaction Guard via Interactive Targets)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No row-mode or composite-evaluation semantic changes.

### Summary of Implementation
- Added reusable interactive-target predicate in canvas:
  - `isSpaghettiInteractiveTarget(target: EventTarget | null)`.
  - Matches `data-sp-interactive="1"` first, then form-control and existing Spaghetti interactive selectors.
- Updated `handleNodePointerDown` in `SpaghettiCanvas`:
  - replaced inline interactive selector logic with predicate call,
  - removed early interactive-branch `stopPropagation`,
  - retained existing drag-init path behavior for non-interactive node surface.
- Marked interactive controls with `data-sp-interactive="1"`:
  - composite chevron button,
  - value bar container/track,
  - range input,
  - context-menu root container.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- When Baseplate node is selected, clicking `Anchor Point 1` (and other composite) chevron now expands/collapses immediately without requiring deselection.
- Node drag still starts from non-interactive node areas.
- Port wire drag, value scrubbing, and context menu interactions remain available through interactive elements.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [011] 2026-03-03 20:20 (Input Node Click Promotes Collapsed Row Mode to Essentials)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only change in allowed layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Updated `handleNodePointerDown` in `SpaghettiCanvas` to resolve the clicked node before drag start.
- In `collapsed` row mode, clicking an input/source-style node now schedules `setRowViewMode('essentials')`.
- Input/source-style node detection is based on node definition shape: zero inputs and at least one output.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking an input/source node while canvas row mode is `collapsed` now opens row mode to `essentials`.
- Existing node selection and drag initiation behavior for non-interactive node surface remains unchanged.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [012] 2026-03-03 22:38 (Data-Driven Part Template v1: Driver VM + Template-Flag NodeView)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only refactor in canvas/registry/theme layers.
- No edits under `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved via metadata order and stable endpoint keys.

### Summary of Implementation
- Added explicit part-template metadata to node definitions:
  - `template?: 'part'`
  - `inputDrivers` and `outputDrivers` specs
  - feature-param driver (`firstExtrudeDepth`) and reserved output (`mesh`, `pending`) support.
- Added generic driver VM resolver (`driverVm.ts`) that maps node metadata + params to render rows without node-type branching in `NodeView`.
- Refactored `NodeView` to a template-driven renderer:
  - chooses part-template path only via `template === 'part'`,
  - renders canonical section order,
  - keeps Output Drivers pinned before everything-only sections,
  - renders Input Drivers rows even in collapsed mode,
  - renders reserved mesh row as disabled (dot visible, non-wireable, no endpoint registration).
- Updated `SpaghettiCanvas` to:
  - precompute and pass compact `driverVm`,
  - handle driver numeric edits generically (`nodeParam` + `featureParam:firstExtrudeDepth`),
  - keep `otherOutputs` deterministic as all outputs minus output-driver endpoints.
- Updated `FeatureStackView` with `mode: 'summary' | 'full'` and wired summary/full behavior by row mode.
- Added disabled-port interaction guard support for reserved rows using `data-sp-disabled-port="1"`.

### Files Changed
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part-node layout is now metadata/template driven rather than node-type branching in `NodeView`.
- Collapsed mode keeps Input Driver and Output Driver endpoint anchors visible; hidden internals do not register anchors.
- Essentials mode shows only drivers + feature stack summary (legacy/debug sections hidden).
- Everything mode shows drivers + full feature stack, then other outputs and legacy/debug sections.
- Reserved Mesh Output row is visibly disabled, always shows a dot, and is non-interactive for wiring.

### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [013] 2026-03-03 20:24 (Baseplate Title Click Forces Collapsed Row Mode)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only change.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate semantic changes.

### Summary of Implementation
- Added a dedicated `onBaseplateTitleClick` callback from `SpaghettiCanvas` to `NodeView`.
- In `NodeView`, made the title text interactive only for Baseplate nodes:
  - stops pointer-down propagation to avoid node drag initiation from title clicks,
  - invokes the callback on click.
- In `SpaghettiCanvas`, callback sets row mode directly to `collapsed`.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking the `Baseplate` text in the node header now forces canvas row mode to `collapsed`.
- Other node title clicks are unchanged.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [014] 2026-03-03 20:25 (Baseplate Drivers Label Moved Below Scrub Controls)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only layout adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph compile/evaluate/runtime behavior changes.

### Summary of Implementation
- Updated Baseplate sketch header layout styles to stack content vertically.
- Positioned scrub speed controls on the first row and the `Drivers` label on the second row.
- Kept existing control behavior and interaction handling unchanged.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- `Drivers` is no longer horizontally aligned with the speed controls; it now appears one row lower.
- Scrub controls remain right-aligned and functionally unchanged.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [015] 2026-03-03 20:27 (Baseplate Scrub Slider: Half-Width Right Anchor + Continuous 0-100)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only changes in canvas/theme layers.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Replaced binary scrub mode (`low`/`high`) with a continuous numeric scrub setting (`0..100`) in `NodeView`/`PortView`.
- Updated Baseplate scrub control UI:
  - slider range now `0..100` with fractional movement (`step=0.1`),
  - removed low/high toggle button,
  - value display now shows percentage.
- Updated scrub drag behavior in `PortView` to interpolate threshold and sensitivity across the full slider range.
- Updated theme styles so the scrub slider is half-width and remains right-anchored in its row.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Scrub speed now glides smoothly from 0 to 100 and uses in-between values.
- Slider occupies half the scrub row width and stays aligned to the right.
- Scrub mode toggle button is removed in favor of continuous slider control.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [016] 2026-03-03 20:28 (Scrub Toggle Presets Restored with Continuous Half-Width Slider)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only change in canvas layer.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Reintroduced scrub toggle button in Baseplate sketch header with two presets:
  - `low` preset => `0%`,
  - `high` preset => `100%`.
- Kept continuous slider behavior (`0..100`) and in-between values.
- Preset state is derived from current slider position and toggles between the two preset endpoints.
- Existing slider layout remains half-width and right-anchored.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Users can now freely scrub with the slider and also jump instantly between low/high preset values via the toggle button.
- Slider remains half-width and anchored right as requested.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [017] 2026-03-03 20:30 (Align Scrub Slider Left Edge with Preset Dropdown)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only style adjustment.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No graph semantic changes.

### Summary of Implementation
- Introduced a shared right-column width token for Baseplate controls (`clamp(140px, 50%, 170px)`).
- Applied the shared width to:
  - `Preset` dropdown (`.SpaghettiNodePresetRow select`),
  - scrub controls row (`.SpaghettiNodeScrubControls`).
- Kept scrub slider at 50% width and right-anchored within that aligned control column.

### Files Changed
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Scrub slider no longer spans the full node row.
- Slider left edge now aligns with the `default` preset dropdown left edge above.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [018] 2026-03-03 20:34 (Baseplate Header Mode Picker: Collapsed / Essentials / Expanded)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only behavior and styling changes.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Replaced Baseplate title click behavior with a header mode picker.
- Clicking the top Baseplate header now toggles a 3-button mode menu:
  - `collapsed`
  - `essentials`
  - `expanded`
- Mode button mapping:
  - `collapsed` => row mode `collapsed`
  - `essentials` => row mode `essentials`
  - `expanded` => row mode `everything` (internal expanded mode)
- Added compact button styles and active-state highlighting for current row mode.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking the top of a Baseplate node now opens mode options instead of immediately forcing `collapsed`.
- Selecting a mode button switches the canvas into that mode and closes the picker.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [019] 2026-03-03 20:39 (Context Menu Routing: Blank Canvas Adds Nodes, Node Blocks Switch Row Mode)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only interaction update.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Updated viewport right-click behavior in `SpaghettiCanvas`:
  - If target is inside a `.SpaghettiNode`, open node row-mode context menu.
  - If target is on blank canvas area, open existing add-node search menu.
- Added canvas-level node row-mode context menu using `SpaghettiContextMenu` with 3 options:
  - `collapsed`
  - `essentials`
  - `expanded` (maps to internal `everything` row mode)
- Menus are mutually exclusive:
  - opening node mode menu closes add-node menu,
  - opening add-node menu closes node mode menu.
- Added Escape handling for the node row-mode context menu.

### Files Changed
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Right-click on blank node editor space now shows the add-node search menu only.
- Right-click on any node block (Baseplate, Toe Hook, Heel Kick, etc.) now shows row-mode options instead of add-node menu.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [020] 2026-03-03 20:44 (Remove Baseplate Title-Click Mode Buttons; Keep Right-Click Mode Menu)
<!-- ============================================================ -->

### Scope / Constraints Honored
- Canvas/UI-only cleanup.
- No edits under `src/app/spaghetti/features/**`, `compiler/**`, or `integration/**`.
- No worker/protocol/scheduler changes.
- No compile/evaluate semantic changes.

### Summary of Implementation
- Removed Baseplate header click-to-open mode picker from `NodeView`.
- Removed associated callback wiring from `SpaghettiCanvas`.
- Removed now-unused mode-picker styles from theme.
- Right-click node context menu (`collapsed` / `essentials` / `expanded`) remains the active mode-switch UI.

### Files Changed
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/v15Theme.css`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Clicking Baseplate title/top no longer opens row-mode buttons.
- Row mode switching from nodes is now right-click menu driven.

### Verification Steps
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

<!-- ============================================================ -->
## [021] 2026-03-03 22:56 (Part Node Template v1 Taxonomy Refactor: Drivers / Inputs / Outputs)
<!-- ============================================================ -->

### Scope / Constraints Honored
- UI-only refactor in canvas/view-model layers.
- No edits under `src/app/spaghetti/features/**`, `src/app/spaghetti/compiler/**`, `src/app/spaghetti/integration/**`, or `src/worker/**`.
- No protocol/scheduler changes.
- Deterministic ordering preserved from metadata arrays and stable endpoint-key subtraction.

### Summary of Implementation
- Refactored part-template row taxonomy in VM and `NodeView` from `Input Drivers/Output Drivers` to:
  - `Drivers` (feature-param controls, non-wireable),
  - `Inputs` (wireable endpoint rows),
  - `Outputs` (pinned endpoint rows + reserved rows),
  - `Other Outputs` (everything-only, non-pinned endpoint rows).
- Updated `driverVm` output shape to `drivers`, `inputs`, `outputs`, `otherOutputs` while keeping existing metadata fields (`inputDrivers`, `outputDrivers`) unchanged for minimal API churn.
- Updated part-template render order in `NodeView` to:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`,
  - then in `everything` only: `Other Outputs -> Other/Debug (Legacy)`.
- Locked collapsed-mode rendering behavior in UI:
  - drivers rows render,
  - inputs rows render with anchors/pins,
  - feature stack internals are hidden,
  - outputs rows render.
- Updated reserved mesh row interaction markers:
  - row and dot now include both `data-sp-interactive="1"` and `data-sp-disabled-port="1"`,
  - row remains endpoint-less and non-wireable.
- Updated canvas interactive-target guard so disabled reserved port targets are still treated as interactive UI targets (preventing node-drag capture on that control area).

### Files Changed
- `src/app/spaghetti/canvas/driverVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `docs/listofchanges.md`

### Behavior Changes (if any)
- Part node sections now display locked taxonomy labels: `Drivers`, `Inputs`, `Feature Stack`, `Outputs`.
- `Outputs` remains the last core section in all modes.
- In `everything`, `Other Outputs` and `Other/Debug (Legacy)` now render below `Outputs`.
- Reserved mesh pending row remains disabled/non-wireable but no longer behaves like non-interactive empty space for node drag/select hit-testing.

### Verification Steps
- `rg -n "Baseplate|ToeHook|HeelKick|Part/Baseplate|Part/ToeHook|Part/HeelKick" src/app/spaghetti/canvas/NodeView.tsx` (no matches)
- `npm.cmd --prefix parahook run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)


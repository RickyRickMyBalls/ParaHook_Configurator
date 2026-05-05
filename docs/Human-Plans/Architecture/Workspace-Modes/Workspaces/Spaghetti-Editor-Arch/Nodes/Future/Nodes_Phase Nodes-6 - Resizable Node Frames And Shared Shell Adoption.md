# `Nodes-6` - `Resizable Node Frames And Shared Shell Adoption`

## Doc Header

### Doc History
15. 2026-05-04 15:09:24: Marked `Nodes-6 / Phase 6 - Hardening, Regression Proof, And Family Handoff` shipped after the lane gained one more west-handle width-floor regression fence, the umbrella `Nodes-Index.md` handoff was refreshed to read as a closed shipped family instead of a pending future lane, and focused node-frame proof now covers the final shared resize/shell contract without widening into later family rollout.
14. 2026-05-04 10:13:33: Tightened `Nodes-6 / Phase 6` into an implementation-ready hardening and handoff pass by grounding the remaining work in the now-shipped `NodeView`, `SpaghettiCanvas`, shared-shell, and focused test seams, locking the slice to regression proof plus family-index handoff instead of more behavior widening, and narrowing verification toward resize, width-floor, undo/history, and shared-shell parity coverage.
13. 2026-05-04 10:13:33: Marked `Nodes-6 / Phase 5 - Family Frame Parity And Overflow Honesty` shipped after the node frame lane adopted one shared `220px` minimum width floor across render, resize, and normalized persistence, the shared shell and attached-body surfaces gained explicit readable overflow behavior instead of relying on accidental spill, and focused node-shell, live-canvas, plus targeted store proof landed without widening into later family rollout or row-semantics rewrites.
12. 2026-05-04 09:49:37: Marked `Nodes-6 / Phase 4 - Output Preview Shared Shell Adoption` shipped after `Output Preview` moved off its older custom wrapper and onto `GeometryNodeShell`, the component editor landed in the shared content lane, the slot-row subtree stayed intact in the shared input rail, and focused `NodeView` plus typecheck proof landed without widening into row-semantics rewrites or Phase 5 overflow cleanup.
11. 2026-05-04 07:44:38: Tightened `Nodes-6 / Phase 5` into an implementation-ready family overflow pass by grounding the current frame-body seams in `NodeView.tsx`, `GeometryNodeShell.tsx`, and `spaghetti.css`, locking the work to one explicit readability and overflow policy across the shared node families, and deferring any broader typography or node-family rollout beyond the current shell set.
10. 2026-05-02 14:37:31: Tightened `Nodes-6 / Phase 4` into an implementation-ready `Output Preview` shell migration by grounding the owning custom path in `renderOutputPreviewTemplate()` inside `NodeView.tsx`, naming `GeometryNodeShell.tsx` as the shared target contract, and locking the pass to shared frame-shell structure while keeping slot, object, and publication semantics unchanged.
9. 2026-05-02 14:35:57: Marked `Nodes-6 / Phase 3 - Resize Commit Persistence And Edit-History Seam` shipped after live resize release started committing one width-aware graph-history entry, resize undo/redo restored full frame snapshots including west-handle `x` shifts, and focused store plus live canvas proof landed without widening into shell migration or authored height.
8. 2026-05-02 13:52:52: Tightened `Nodes-6 / Phase 3` into an implementation-ready resize-commit pass by grounding the work in the existing `commitGraphNodeMoveWithHistory` seam plus the new live resize session, locking width-only before/after snapshot ownership in `useSpaghettiStore.ts`, and narrowing verification to focused resize persistence plus undo/redo proof instead of broad shell migration.
7. 2026-05-02 13:51:38: Marked `Nodes-6 / Phase 2 - Selected Node Resize Handles And Pointer Routing` shipped after selected nodes gained eight shell-owned resize handles, the canvas added a parallel live width-resize pointer session that keeps resize separate from ordinary drag, and focused node-shell plus live canvas proof landed without widening into resize history commits yet.
6. 2026-05-02 13:24:35: Tightened `Nodes-6 / Phase 2` into an implementation-ready selected-node resize pass by grounding the handle surface in `NodeView.tsx`, the live drag-session owner in `SpaghettiCanvas.tsx`, and the visibility plus cursor contract in `spaghetti.css`, while explicitly deferring committed width history and later shell migration to the following phases.
5. 2026-05-02 13:22:38: Marked `Nodes-6 / Phase 1 - Node Frame State Contract` shipped after the graph UI node entry widened to persist `width` beside `x` and `y`, the node render path started reading that graph-authored width instead of only fixed CSS, and focused schema, persistence, store, and node-shell proof landed for the new frame contract.
4. 2026-05-02 13:14:34: Tightened `Nodes-6 / Phase 1` into an implementation-ready graph-UI frame contract by locking `width` onto the canonical `graph.ui.nodes[nodeId]` owner beside `x` and `y`, correcting the graph-document persistence file path, and grounding the first slice against the live normalization, store, render, and persistence seams before implementation.
3. 2026-05-02 12:07:51: Locked the `Nodes-6` frame-sizing direction so node `width` remains the one authored persisted frame dimension while node `height` stays content-derived from the current section/body expansion state, keeping this lane focused on horizontal resize plus later overflow honesty instead of freeform two-axis node windowing.
2. 2026-05-02 12:02:14: Renamed the internal `Nodes-6` execution ladder from `Nodes-6.1` through `Nodes-6.6` to `Nodes-6 / Phase 1` through `Nodes-6 / Phase 6` so Phase 1 prep and later implementation handoff now follow the standard family-phase naming pattern more directly.
1. 2026-05-02 11:48:50: Created this dedicated `Nodes-6` future doc by splitting the planned node-frame resize and shared-shell follow-on out of `Nodes-Index.md`, then routing that work into explicit `Nodes-6.1` through `Nodes-6.6` slices so persisted frame state, canvas resize handles, `Output Preview` shell adoption, and final family parity can be implemented one Codex-sized pass at a time.

### Purpose
- make node frame width a first-class graph UI contract instead of leaving node width fixed in CSS
- let users resize node frames from edges and corners directly on the spaghetti canvas
- bring `Output Preview` onto the same shared shell direction as `Sketch` and `Extrude`
- close with one calmer shared frame/shell parity rule future node families can inherit

### Scope

This phase covers:
- persisted node width
- selected-node edge and corner resize handles
- move-versus-resize interaction boundaries on the spaghetti canvas
- explicit height ownership staying content-derived from section/body expansion state
- `Output Preview` migration onto the shared node shell direction
- family parity and hardening across the main node surfaces

This phase does not cover:
- floating editor window resize ownership
- unrelated output/publication contracts already owned by `Nodes-5`
- broad toolbar redesign
- deeper later-family adoption such as `Loft`, `Sweep`, or `Boolean`

## Doc Body

### Summary

Current seam read:

- `NodeView.tsx` already owns the outer node article and family routing, but node size is still mostly visual:
  - position is persisted
  - row mode is persisted
  - width is still fixed in CSS
  - height is still content-driven rather than frame-authored
- `GeometryNodeShell.tsx` already provides one shared shell direction for `Sketch` and `Extrude`
- `Output Preview` still uses its own older custom template instead of the shared geometry shell
- the canvas already has a proven move interaction and one separate floating-window resize precedent elsewhere in the workspace shell
- the next honest step is therefore not another body/publication contract:
  - it is making node frame size explicit
  - adding node-owned resize handles
  - then closing shell parity so the main node families all inherit one resizable frame contract

Current strongest read:
- do not hide node width inside family params
- do not turn node height into freeform frame state when open sections already own vertical space honestly
- do not ship resize as a CSS-only hack that fails to persist
- start with graph UI frame state first
- keep the first resize cut on selected nodes only
- keep `Output Preview` shell adoption as a dedicated later slice so the frame contract lands before the family-template move

## Questions / Decisions

#### [ ] Question 1 - Where should node frame size live?

##### Suggested answer
- node width should live in graph UI state alongside node position and node row mode, while node height should stay derived from the current section/body expansion state

##### Why
- width is authored editor layout truth for the graph surface
- width should persist with the graph document
- height already reads more honestly as a downstream layout result of open sections and attached content
- neither should become family-local semantic params

#### [ ] Question 2 - What should resize handles attach to?

##### Suggested answer
- the selected node frame only, with one handle per edge and corner

##### Why
- this keeps the first interaction readable and reduces accidental drag overlap
- it matches the existing visible-selection mental model in the canvas

#### [ ] Question 3 - When should `Output Preview` join the shared shell?

##### Suggested answer
- after the frame contract and handle interaction are already stable enough to avoid doing shell migration and resize plumbing in one inseparable pass

##### Why
- that keeps the first implementation slices smaller and easier to verify
- it prevents `Output Preview` shell migration from obscuring frame-state bugs

## Implementation Spec

Locked top-level direction:
- add one explicit persisted node frame contract instead of leaving width fixed in CSS
- keep width as node-frame truth in graph UI state while height stays content-derived
- expose resize from all edges and corners
- keep move and resize as separate pointer intents
- migrate `Output Preview` onto the shared shell direction after the frame contract is real
- end with one family-parity pass so future node families inherit the same resizable shell behavior

Locked implementation boundary:
- keep each slice small enough that one owner seam can change at a time
- prefer code-backed state and pointer seams before family-level polish
- do not reopen `Nodes-5` body/publication semantics in this lane

## Phase Breakdown

## [x] `Nodes-6 / Phase 1` - `Node Frame State Contract`

### Summary

#### Purpose
- add explicit persisted node width to graph UI state before any visible resize-handle work starts, while keeping node height content-derived

#### Owns
- graph UI state for node width
- default frame sizing rules
- schema and persistence support for the new frame field
- the first explicit distinction between node position, node width, and content-derived node height

#### Does Not Own
- visible resize handles
- pointer interaction
- manual node height authoring
- `Output Preview` shell migration

#### Current Live Read
- node position already persists
- node width does not
- `.SpaghettiNode` still gets a fixed width from CSS
- the canvas cannot honestly resize nodes until width state has one owner
- node height already behaves more like a layout result than an authored frame field
- the canonical persisted position owner already lives in `graph.ui.nodes[nodeId]`, which `useSpaghettiStore.ts` normalizes and writes through before `NodeView.tsx` renders the node at `left/top`
- graph-document save/load already serializes the normalized graph shape through `src/app/io/graphDocumentPersistence.ts`, so widening the graph UI frame contract there keeps persistence on the same existing path instead of inventing a second save surface

### Phase 1 Implementation Spec

#### Exact First Code Cut
- widen the canonical graph UI node-frame owner at `graph.ui.nodes[nodeId]` so each node entry can own:
  - `x`
  - `y`
  - `width`
- keep `graph.ui.nodes` as the single graph-authored node-frame map instead of introducing a second `nodeFramesByNodeId` surface or reviving `node.ui` as the primary owner
- normalize defaults so existing graphs stay valid and render at the current width until resized
- keep old graphs without an authored `width` valid by defaulting to the current `.SpaghettiNode` CSS width during normalization and serialization round-trips
- keep node height derived from the currently open sections and attached content instead of persisting an authored `height`

#### Likely Files
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/io/graphDocumentPersistence.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- focused schema/store persistence tests

#### No-Widening Rule
- do not add visible resize handles yet
- do not move family templates yet
- do not create an alternate frame owner outside `graph.ui.nodes`

#### Verification Shape
- focused schema and persistence proof
- existing graphs without authored frame size still render correctly
- node expansion/collapse still drives height without needing a persisted frame-height field
- node render width should read from the canonical graph UI frame entry instead of only from fixed CSS

## [x] `Nodes-6 / Phase 2` - `Selected Node Resize Handles And Pointer Routing`

### Summary

#### Purpose
- expose the first honest edge and corner resize handles for selected nodes on the spaghetti canvas

#### Owns
- handle visibility rules
- edge and corner pointer routing
- separating move intent from resize intent at pointer-down time

#### Does Not Own
- final persisted history commit semantics
- family shell migration

#### Current Live Read
- the canvas already routes move interaction from node header/body seams
- the workspace shell already has one floating resize precedent with eight directions
- node resize needs its own selected-frame interaction surface without stealing ordinary drag behavior
- `NodeView.tsx` already owns the outer node article, selected visual state, and the header-versus-body pointer seams, so the first honest handle surface can stay node-local instead of being painted by the canvas as a second detached overlay owner
- `SpaghettiCanvas.tsx` already owns the live node-move pointer session through `dragStateRef` plus `handleNodePointerDown`, so Phase 2 should add one parallel live resize session there instead of inventing a separate global interaction system
- `spaghetti.css` already carries multiple resize-cursor precedents elsewhere in the shell, so Phase 2 can reuse that direction language for node handles without borrowing workspace-window ownership or styling rules wholesale

### Phase 2 Implementation Spec

#### Exact First Code Cut
- show eight resize handles on the selected node only:
  - `n`
  - `s`
  - `e`
  - `w`
  - `ne`
  - `nw`
  - `se`
  - `sw`
- keep the handles mounted by `NodeView.tsx` on the selected node shell itself, with unselected nodes rendering no handle chrome
- wire pointer-down on those handles into node-frame live resizing instead of node move
- keep the first live resize path width-only even for `n` / `s` / corner handles:
  - east and west family handles should change authored width directly
  - north, south, and corner handles may render as visible future-parity affordances now, but they must not introduce authored height or fake two-axis persistence in this phase
- add one canvas-owned live resize session parallel to the existing node-move drag session so pointer capture, move, and release all stay in `SpaghettiCanvas.tsx`
- keep the live resize path store-local only in this phase:
  - it may call the existing graph UI width write path during drag
  - it must not yet create a new undoable commit entry

#### Likely Files
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- focused canvas render and interaction tests

#### No-Widening Rule
- do not commit edit-history semantics beyond the live resize path yet
- do not migrate `Output Preview` in this slice
- do not turn node height into editable frame state
- do not move handle rendering into a second canvas overlay owner when the selected node shell can own that chrome directly

#### Verification Shape
- selected node shows handles
- unselected nodes do not show handles
- ordinary header drag still moves
- handle drag resizes instead of moving
- live handle drag updates visible node width through the graph UI frame contract without requiring a persisted history commit yet

## [x] `Nodes-6 / Phase 3` - `Resize Commit Persistence And Edit-History Seam`

### Summary

#### Purpose
- turn live resize interaction into one honest persisted and history-aware graph edit path

#### Owns
- resize commit command/store seam
- undoable before/after width snapshots if already consistent with the current graph-history path
- final width clamping rules

#### Does Not Own
- shell migration
- family visual polish

#### Current Live Read
- move already has a graph-history commit path
- resize should not become a second invisible persistence route
- `SpaghettiCanvas.tsx` already flushes the live resize session through `setManyNodePos`, so Phase 3 should add release-time history capture at that same canvas seam instead of inventing a second write owner
- `useSpaghettiStore.ts` already owns `commitGraphNodeMoveWithHistory` plus the lower-level `commitGraphNodeMoveHistoryCommand`, so resize should follow that same store-owned history pattern with width-aware before/after snapshots
- `upsertNodePos` plus `setManyNodePos` already preserve and mutate canonical `graph.ui.nodes[nodeId]` width, so the remaining Phase 3 work is the honest commit boundary, not a new persistence format

### Phase 3 Implementation Spec

#### Exact First Code Cut
- add one canonical node-frame commit path parallel to node move history, but scoped to width-aware node frame changes rather than generic workspace window history
- capture one release-time before/after snapshot from the existing resize session:
  - `from` must include the authored starting `x`, `y`, and `width`
  - `to` must include the final canonical `x`, `y`, and `width`
- keep the first commit seam width-only:
  - use the existing live resize session from `SpaghettiCanvas.tsx`
  - do not widen into authored node height
- keep minimum width and clamp rules explicit and deterministic by reusing the same clamp the live session already obeys instead of introducing a second resize-only threshold
- if the final resize result is unchanged from the starting frame snapshot, do not create a history entry

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- focused store/history and live-canvas tests

#### No-Widening Rule
- do not broaden into generic workspace window-history ownership
- do not migrate family templates here
- do not add a second persistence owner outside canonical `graph.ui.nodes[nodeId]`
- do not mix resize history with ordinary move history labels in a way that hides width-specific behavior

#### Verification Shape
- resize persists across reload
- undo/redo restores prior node width if the current history owner can already take it honestly
- release-time resize creates one history entry only when the frame actually changed
- undo/redo restores west-handle resize `x` shifts together with width, not width alone

## [x] `Nodes-6 / Phase 4` - `Output Preview Shared Shell Adoption`

### Summary

#### Purpose
- move `Output Preview` off its older custom template and onto the shared node shell direction after the frame contract is already real

#### Owns
- `Output Preview` shell migration
- shared-shell parity for title, badge, section rhythm, and frame behavior
- preserving existing slot/object surface meaning during the shell move

#### Does Not Own
- reopening `Nodes-5` output/publication semantics
- final family parity polish

#### Current Live Read
- `Sketch` and `Extrude` already use `GeometryNodeShell`
- `Output Preview` still renders through a custom template path
- resize parity will stay visibly uneven until `Output Preview` uses the same frame/shell contract
- `NodeView.tsx` currently owns that older path directly through `renderOutputPreviewTemplate()`, including the component label editor, slot rows, attached-body metadata, unresolved warning chrome, and published-object grouping
- `GeometryNodeShell.tsx` already owns the shared frame contract for header badge, header chips, summary strip, input rail, optional content rail, output rail, and diagnostics footer, so Phase 4 should migrate `Output Preview` into that shell instead of inventing another parallel template family
- the dedicated `SpaghettiOutputPreview*` CSS already captures slot/object-specific body chrome, so the migration should preserve those semantic sub-blocks while only changing the outer shell owner

### Phase 4 Implementation Spec

#### Exact First Code Cut
- rebuild `Output Preview` around `GeometryNodeShell` while keeping the current slot/object row subtree intact
- map the current `Output Preview` surface into shared shell lanes explicitly:
  - keep the slot rows in the shell input rail
  - move the component label editor into the shell content lane instead of leaving it as a one-off top row
  - keep `Output Preview`-specific attached-body metadata, published-object grouping, and unresolved warning reads inside the same slot-row subtree
- keep the outer node article, resize handles, and width history behavior untouched by reusing the already-shipped frame contract from earlier phases
- prefer the lightest possible `GeometryNodeShell` extension only if `Output Preview` truly needs one shared-shell affordance that `Sketch` and `Extrude` do not already expose
- if a shell tweak is needed, make it generic enough that future node families can inherit it instead of baking `Output Preview`-specific branching into the shared shell

#### Likely Files
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- focused `NodeView` shell-parity tests

#### No-Widening Rule
- keep the pass on shell and frame parity
- do not change slot/publication behavior beyond what the shared shell requires structurally
- do not reopen `Output Preview` data semantics, row ordering rules, or publication wording from `Nodes-5`
- do not create a second shared-shell variant when the existing `GeometryNodeShell` can carry the migration honestly

#### Verification Shape
- `Output Preview` still reads correctly
- `Output Preview` now shares the same outer shell and resize surface contract
- existing component label, slot rows, unresolved warning chrome, and published-object grouping still render with the same semantic meaning after the shell move

## [x] `Nodes-6 / Phase 5` - `Family Frame Parity And Overflow Honesty`

### Summary

#### Purpose
- close the visible parity gap across `Sketch`, `Extrude`, and `Output Preview` once all three are on the same frame contract

#### Owns
- min/max sizing rules
- section/body overflow behavior
- attached-body honesty when the frame is smaller than ideal content size
- the vertical readability policy once width changes produce taller or denser body layouts

#### Does Not Own
- later-family rollout
- unrelated row-contract rewrites

#### Current Live Read
- once all three families share frame sizing and shell ownership, the remaining gap is how they behave under narrow, short, and expanded frames
- `NodeView.tsx` still owns multiple template families with different internal body shapes, while `GeometryNodeShell.tsx` now provides the shared outer shell contract for the main geometry-family lane
- `spaghetti.css` currently mixes node-width defaults, section-body overflow, attached-body expansion chrome, and per-template width assumptions across both legacy template sections and shared-shell sections
- after the shared frame contract and resize history are real, the remaining user-facing inconsistency is not whether nodes resize, but what happens when resized nodes become narrower, denser, or shorter than their ideal content read
- this phase should make the overflow story explicit and shared so users can predict whether content scrolls, clips, wraps, or stays fully expanded when the frame is constrained

### Phase 5 Implementation Spec

#### Exact First Code Cut
- lock one visible parity rule for:
  - minimum width
  - derived-height overflow behavior
  - internal scrolling or clipping behavior when content becomes taller than the preferred shell read
  - section overflow and attached-body readability
- pick one explicit policy per concern and apply it across the shared node families:
  - one minimum node width floor
  - one rule for whether the outer node body clips or scrolls
  - one rule for how attached-body content behaves when its row is open inside a constrained frame
  - one rule for whether long labels/chips wrap, ellipsize, or overflow
- keep the first implementation biased toward readability over chrome-perfect compactness:
  - prefer explicit internal scrolling over silent clipping when content must exceed the visible frame
  - prefer deterministic truncation or wrapping rules over accidental overflow caused by mixed legacy styles
- if the current split between legacy template sections and `GeometryNodeShell` sections makes a parity rule impossible to express in CSS alone, use the lightest `NodeView.tsx` structural cleanup necessary to make that overflow policy shared and testable

#### Likely Files
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- focused family surface and overflow tests

#### No-Widening Rule
- do not pull `Loft` into this pass
- do not turn this into a broader typography redesign
- do not reopen the resize-history seam or node-frame persistence contract
- do not treat overflow cleanup as permission to change slot/publication semantics or unrelated row contracts

#### Verification Shape
- all three main node families remain readable under small and medium frame sizes
- overflow behavior is consistent and explicit
- attached-body and section-open states stay usable when the node is narrower or denser than the ideal content width

## [x] `Nodes-6 / Phase 6` - `Hardening, Regression Proof, And Family Handoff`

### Summary

#### Purpose
- close the node-frame lane with focused regression proof and a cleaner handoff for future node families

#### Owns
- focused regression coverage
- final copy and docs cleanup
- family handoff wording for later node families

#### Does Not Own
- implementing later node families in the same pass

#### Current Live Read
- Phases 1 through 5 are now shipped, so the remaining work is no longer another feature seam; it is proving the lane behaves coherently as one contract
- the real owner seams are already visible:
  - `NodeView.tsx` owns the final outer node render contract for the three main families
  - `SpaghettiCanvas.tsx` owns live resize interaction and release-time history commit behavior
  - `useSpaghettiStore.ts` owns normalized persisted frame state
  - `spaghetti.css` owns the final shared-shell parity and overflow policy
- the next honest risk is regression drift:
  - width-floor behavior could diverge again between normalization, render, and live resize
  - selected-node resize could regress while future shell cleanup lands elsewhere
  - `Output Preview` could quietly fall back out of shared-shell parity without a focused test fence
- the family handoff also still lives mostly in this future doc, while `Nodes-Index.md` has not yet been tightened to reflect that the first five phases are shipped and only hardening remains

### Phase 6 Implementation Spec

#### Exact First Code Cut
- add or tighten focused regression proof for the final shared contract:
  - persisted width normalization
  - selected-node live resize and width-floor clamp
  - resize undo/redo history behavior
  - `Sketch`, `Extrude`, and `Output Preview` shared-shell parity
  - constrained attached-body/detail readability under the Phase 5 overflow rules
- prefer strengthening the focused existing test files over introducing a new broad integration harness
- tighten the family handoff surface in `Nodes-Index.md` so it reflects:
  - Phases 1 through 5 are shipped
  - `Nodes-6 / Phase 6` is the final hardening pass
  - later families should inherit the shared frame/shell contract instead of reopening local node chrome
- if any leftover wording in this future doc still reads like Phase 1 through 5 are pending, clean that wording while keeping the historical record intact

#### Likely Files
- focused tests under `src/app/spaghetti/`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- focused `useSpaghettiStore` / history tests where the final width-floor and resize contract is already covered
- this doc plus `Nodes-Index.md`

#### No-Widening Rule
- do not reopen node frame persistence ownership
- do not widen into `Loft`, `Sweep`, `Boolean`, or another family rollout
- do not treat hardening as permission to redesign shell visuals again
- do not replace focused behavior proof with one large fragile end-to-end test that obscures the actual ownership seams

#### Verification Shape
- focused tests prove the shared node-frame contract instead of only one family-local path
- the family index and future doc now read honestly as a mostly-shipped lane with one remaining hardening pass
- later node-family handoff guidance is explicit enough that future adoption should not need to rediscover width, resize, and shared-shell ownership from scratch

## Suggested Execution Order

1. Lock persisted node frame state in `Nodes-6 / Phase 1`.
2. Add selected-node resize handles and pointer routing in `Nodes-6 / Phase 2`.
3. Commit resize through one honest persistence/history seam in `Nodes-6 / Phase 3`.
4. Move `Output Preview` onto the shared shell in `Nodes-6 / Phase 4`.
5. Lock family frame parity and overflow behavior in `Nodes-6 / Phase 5`.
6. Finish with hardening and later-family handoff in `Nodes-6 / Phase 6`.

## Acceptance Checks

- node width is explicit graph UI truth instead of fixed CSS-only behavior
- node height remains an honest layout result of open sections and attached content instead of becoming freeform frame state
- users can resize from edges and corners directly on the canvas
- move and resize interactions do not fight each other
- `Output Preview` no longer remains outside the shared shell path
- `Sketch`, `Extrude`, and `Output Preview` share one calmer resizable frame contract
- the lane stays split into owner-sized slices small enough for Codex to implement one by one

## Definition Of Done

- `Nodes-6` exists as a real execution home instead of only as a follow-on idea
- the work is split into implementation-grade subphases small enough for one-owner execution
- later node families can inherit one explicit resizable-width and shared-shell contract instead of reinventing node chrome and sizing behavior locally

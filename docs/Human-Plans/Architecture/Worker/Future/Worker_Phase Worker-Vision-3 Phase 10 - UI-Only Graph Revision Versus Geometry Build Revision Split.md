# Worker Phase Worker-Vision-3 Phase 10 - UI-Only Graph Revision Versus Geometry Build Revision Split

## Doc Header

### Doc History
2. 2026-04-10 15:40: Tightened `Worker-Vision-3 Phase 10.1 - UI-Only Graph Edits Stop Triggering Geometry Build Churn` into an implementation-ready first slice by grounding it in the live `graph.ui.nodes` persistence seam, the current broad `currentGraphRevision` bump path in `useSpaghettiStore.ts`, the app-side revision-watch build trigger in `useAppStore.ts`, and one explicit direction where full graph-document truth stays intact while worker-facing geometry invalidation splits off as the narrower owner
1. 2026-04-10 15:40: Added this standalone `Worker-Vision-3 Phase 10` planning surface so the next Worker follow-on can keep persisted graph UI truth such as node position for future spaghetti-graph file export while splitting that document-level truth from the geometry-build invalidation path that should decide when compile and worker work actually run

### Purpose

This doc defines the standalone execution direction for `Worker-Vision-3 Phase 10`.

Use it to answer:
- how full graph-document truth should keep editor/layout state such as node position
- how geometry build invalidation should stop treating UI-only graph edits as worker-relevant churn
- which seams should own document revision truth versus geometry revision truth
- how to keep future graph-file export honest without widening worker payloads into editor layout metadata

Do not use it to:
- redesign the graph file format broadly
- add graph export UI
- move graph UI state out of the graph document unless later direction explicitly chooses that
- reopen Browser scheduling policy beyond the narrow build-trigger ownership split

### Why This Doc Exists

The live repo already stores node position inside graph-document UI state, which is the right long-range direction for later spaghetti-graph save/export truth.

But the current runtime path still appears to let those UI-only graph commits ride the same graph-revision lane that Browser- and viewport-facing build scheduling watches.

That is too broad because:
- layout truth should stay persisted
- worker geometry invalidation should stay geometry-only
- and future graph export should not force the worker to care about canvas position, collapse state, or similar editor metadata

This standalone Phase 10 exists so the next pass can split those ownership layers cleanly without:
- inventing a second hidden graph owner
- throwing away useful saved layout truth
- or teaching the worker about editor-only state

### Scope

This doc covers:
- the internal `10.1` execution slice for separating UI-only graph edits from geometry build invalidation
- the contract between full document revision truth and worker-facing geometry revision truth
- the focused proof bar needed to show node moves no longer trigger geometry rebuild churn
- preserving persisted graph UI state as saved graph truth

This doc does not cover:
- export UI
- node-editor polish
- layout-system redesign
- broader worker scheduling changes beyond the invalidation boundary

## Doc Body

## [ ] Worker-Vision-3 Phase 10 - UI-Only Graph Revision Versus Geometry Build Revision Split

### Header

Purpose:
- keep persisted graph UI truth while splitting document-level revision from geometry build-trigger revision

Owns:
- the Phase 10 internal execution order
- the ownership split between saved graph-document truth and worker-facing geometry-build truth
- the rule that layout-only graph edits must not become worker work
- the proof boundary for `10.1` and any later `10.2+` follow-ons if more drift appears

Does not own:
- export UI
- graph format redesign beyond the narrow revision/invalidation contract
- Browser policy redesign
- broad node-editor interaction changes

### Current Constraints

This phase starts from the already-locked `Worker-Vision-3` direction in:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules.md`

It should stay aligned with:
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

Locked starting constraints:
- graph-authored document truth may include editor/UI metadata when that truth is genuinely part of the saved graph document
- worker payload and geometry invalidation should stay explicit and typed rather than quietly inheriting every document-level edit
- future spaghetti-graph export should be able to preserve node position and similar layout state honestly
- worker-facing compile/build decisions should remain geometry-relevant only
- this phase should not widen into a general graph-export feature pass

Current live seams still expected to matter:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
  - already stores graph UI state under `graph.ui`
  - already includes `graph.ui.nodes[nodeId] = { x, y }`
  - is therefore the clearest proof that node position already belongs to saved graph-document truth
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
  - already updates only `graph.ui.nodes`
  - shows that node moves are modeled as graph UI edits rather than geometry-param edits
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - currently bumps `compileBuild.currentGraphRevision` whenever the active graph document is committed through the shared graph update path
  - is therefore the strongest current clue that UI-only graph edits and geometry-authoring edits still share one broad revision lane
- `src/app/store/useAppStore.ts`
  - watches graph runtime revision changes and may request viewer-target builds from those revision shifts
  - is therefore the strongest current app-side seam where broad graph-revision churn can wake compile/build behavior
- `src/app/spaghetti/compiler/compileGraph.ts`
  - compiles geometry from nodes, params, edges, and evaluation truth rather than from `graph.ui.nodes`
  - is the clearest current sign that node position does not belong in geometry compile meaning
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - builds worker-facing payloads from compile/build inputs and preview preparation rather than graph layout state
  - is the clearest current sign that worker payload should stay free of editor layout metadata

Important current limitation:
- the repo appears to preserve the right long-range document truth by saving node position
- but still risks waking geometry build churn from UI-only graph commits because revision ownership is broader than worker relevance

### Locked Direction

#### 1. Keep saved graph truth broader than worker geometry truth

Recommended first rule:
- keep node position and similar layout metadata inside the saved graph document unless a later explicit export-format decision says otherwise

Important rule:
- do not "solve" worker invalidation drift by deleting honest saved layout truth
- do not force future graph export to reconstruct layout from elsewhere

#### 2. Split document revision from geometry-build revision

Recommended first rule:
- keep one full document revision for save/export/history truth
- add or derive one narrower geometry-facing revision or equivalent geometry-dirty signal that only changes when worker-relevant authored geometry meaning changes

Important rule:
- worker scheduling should follow geometry relevance, not any arbitrary graph commit
- this split should stay explicit rather than encoded as one-off exceptions scattered across UI call sites

#### 3. UI-only graph edits must not trigger geometry compile/build churn

Recommended first rule:
- moving a node, re-laying out the graph, or changing similar editor-only graph UI state should not by itself request worker geometry work

Important rule:
- keep this rule about worker and build invalidation only
- do not accidentally suppress legitimate geometry rebuilds from real params, wires, node creation/removal, or output-preview relevance changes

#### 4. Worker payload stays geometry-only

Recommended first rule:
- the worker-facing compile/build request should continue to exclude layout-only state such as canvas position

Important rule:
- do not widen `compiledBuildData`, invalidation payloads, or worker request identity to include node layout metadata

### Sub-Phase Breakdown

## [ ] Worker-Vision-3 Phase 10.1 - UI-Only Graph Edits Stop Triggering Geometry Build Churn

### Purpose

Create the first explicit ownership split so graph UI edits such as node-position movement remain saved in the graph document but no longer count as geometry build invalidation that should wake compile/build scheduling.

### Owns

- the first explicit split between document-level graph revision truth and geometry-build-trigger truth
- preventing node-position and similar UI-only graph edits from waking geometry build requests
- preserving current saved graph UI state for later graph-file export
- proving that worker payload and progress stay unchanged during layout-only churn

### Does Not Own

- export UI
- broad graph persistence redesign
- worker scheduling redesign beyond the invalidation boundary
- editor interaction polish

### Implementation Target

After this slice:
- node-position edits still persist in the graph document
- UI-only graph edits no longer trigger worker geometry rebuild requests
- geometry-relevant edits still trigger compile/build normally
- worker payload and progress remain geometry-only and layout-free

### Current Strongest Read

The current strongest implementation read is:
- `setNodePosition.ts` already isolates node motion to `graph.ui.nodes`
- `compileGraph.ts` already ignores node position for geometry meaning
- `useSpaghettiStore.ts` currently advances one broad `currentGraphRevision` on graph commits
- `useAppStore.ts` currently watches graph revision change as one meaningful build-trigger seam

That means the likely first safe fix is not in worker execution itself, but in the ownership boundary that decides which graph edits advance geometry-facing revision/build invalidation.

More precise live seam read:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `withUpdatedActiveGraphDocumentState(...)` currently increments `compileBuild.currentGraphRevision` on every committed graph change, regardless of whether the change was geometry-relevant or only `graph.ui` metadata
  - `setNodePos(...)` and `setManyNodePos(...)` currently reuse that same broad graph-commit path
  - is therefore the strongest current owner of the overly broad revision contract this slice needs to split
- `src/app/store/useAppStore.ts`
  - `requestGraphDocumentBuild(...)` still recompiles from the current graph and uses graph-runtime revision identity when staging build requests
  - the later subscription and viewer-target request helpers still treat graph-revision movement as the signal that runtime freshness changed
  - is therefore the strongest app-side seam for teaching build triggers to follow geometry-facing truth rather than document-level edit truth
- `src/app/spaghetti/schema/spaghettiTypes.ts`
  - already makes the important long-range decision that node position is persisted graph-document truth
  - should remain the saved-document owner rather than being "cleaned up" out of the graph just to reduce build churn
- `src/app/spaghetti/compiler/compileGraph.ts`
  - already behaves like a geometry-only consumer and therefore gives this phase a good target: the worker-facing lane can stay geometry-only without inventing position-aware compile meaning

### Locked Direction

#### 1. Prefer one explicit geometry-dirty owner over ad hoc UI-call-site suppression

Recommended first rule:
- centralize the distinction between geometry-relevant and UI-only graph edits in one store/runtime ownership seam

Important rule:
- do not rely on every UI call site remembering whether to request builds

#### 2. Preserve current saved layout truth

Recommended first rule:
- leave `graph.ui.nodes` and nearby graph UI metadata intact in saved graph state

Important rule:
- this phase is about build invalidation ownership, not about removing graph UI state from persistence

#### 3. Proof should cover both persistence and non-rebuild behavior

Recommended first rule:
- prove one node move still updates saved graph state
- prove the same node move does not trigger worker-facing build churn
- prove a real geometry edit still does

Important rule:
- the proof should check runtime/build behavior, not only schema persistence

#### 4. Prefer narrowing the revision/invalidation owner over adding compile-side "ignore layout" patches

Recommended first rule:
- make the build-trigger owner smarter about what kind of graph change occurred instead of letting every graph commit advance into compile/build and then asking later layers to notice that nothing meaningful changed

Important rule:
- do not solve this first slice only by bolting equality checks onto worker payload generation after the app has already treated the graph as build-dirty
- keep the ownership split close to the graph-runtime revision seam so Browser, viewport, and worker consumers all inherit the same narrower truth

#### 5. Keep output-preview relevance and other worker-facing geometry gates unchanged

Recommended first rule:
- this slice should preserve the existing geometry-trigger semantics for:
  - params
  - wires
  - node creation/removal
  - output-preview relevance changes such as the recent extrude worker gating

Important rule:
- do not let the new UI-only suppression accidentally hide legitimate geometry-dirty changes just because those edits also touched nearby UI state

### Estimated Worked On Files

Likely touched files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- focused tests around the graph-runtime revision and build-trigger seam

### Recommended Verification

- move one node and confirm the saved graph still records the new `graph.ui.nodes` position
- move one node and confirm no geometry build request is staged or dispatched from that UI-only edit
- edit one geometry-driving param and confirm geometry build still stages or dispatches normally
- confirm worker-facing build payload remains unchanged by layout-only edits

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/schema/spaghettiTypes.ts`
2. `src/app/spaghetti/graphCommands/setNodePosition.ts`
3. `src/app/spaghetti/store/useSpaghettiStore.ts`
4. `src/app/store/useAppStore.ts`
5. `src/app/spaghetti/compiler/compileGraph.ts`
6. `src/app/spaghetti/integration/buildInputsToRequest.ts`
7. focused store/app tests around graph-runtime revision and build staging

Recommended execution order:
1. identify the narrowest owner that currently turns any graph commit into geometry-facing `currentGraphRevision` churn inside `useSpaghettiStore.ts`
2. split that owner so full graph-document persistence still updates for node-position changes while a separate geometry-facing dirty/revision signal changes only for worker-relevant authored edits
3. update the app-side build-trigger path in `useAppStore.ts` so viewer-target and Browser-triggered build requests follow the geometry-facing signal rather than any document edit
4. add focused proof that node-position edits still persist but no longer stage or dispatch geometry build work
5. add one counter-proof that a real geometry edit still advances the build path normally

Recommended implementation-grade scenarios:
- `moving one node updates graph.ui.nodes but leaves geometry build staging untouched`
- `moving several nodes with setManyNodePos updates saved layout truth without changing worker-facing build readiness`
- `editing one real geometry param still advances the geometry-facing revision or dirty signal and stages build work normally`
- `changing output-preview wiring still counts as geometry-relevant and still reaches the existing worker-facing request path`
- `worker-facing compiled build payload identity stays unchanged across layout-only node moves`

Recommended proof surfaces:
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.test.ts`
- only if needed, one focused compile/request translation proof to show layout-only edits do not leak into worker payload identity

### Family Follow-On Note

If `10.1` exposes more than one clear remaining seam, add later follow-ons inside this same standalone Phase 10 doc as:
- `Worker-Vision-3 Phase 10.2 - ...`
- `Worker-Vision-3 Phase 10.3 - ...`

Do not widen this first slice preemptively before the first revision/invalidation split is proven.

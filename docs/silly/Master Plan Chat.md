# MasterPlan_01_CurrentPhase.md

## Phase
**Phase 4.6 — Spaghetti Editor UI Stabilization**  
Status: Active

---

## Goal

Stabilize the Spaghetti Editor UI so node rendering, composite field exposure, and row view modes behave deterministically and without unnecessary rerenders.

This phase focuses strictly on **UI-layer correctness and performance**.  
No CAD logic, compiler behavior, or worker integration changes are allowed.

Successful completion means the editor can reliably display and interact with complex nodes before geometry generation work begins.

---

## Scope Lock

Allowed modifications:

src/app/spaghetti/canvas/*  
src/app/spaghetti/canvas/tests/*  

Allowed helper modules:

rowViewMode.ts  
compositeExpansion.ts  

Minimal CSS adjustments are allowed **only if necessary** and should prefer local component classes before touching global theme styles.

Strictly forbidden changes:

src/app/spaghetti/features/*  
src/app/spaghetti/compiler/*  
src/app/spaghetti/integration/*  
worker runtime  
protocol definitions  
build scheduler logic  

This phase must remain **UI-only**.

---

## Required Fixes

1. **Row Mode Rendering**

Implement correct behavior for:

collapsed  
essentials  
everything  

Mode semantics:

collapsed  
- parent rows visible  
- leaf rows hidden  

essentials  
- parent rows visible  
- leaf rows visible only when expanded  

everything  
- parent rows visible  
- leaf rows forced visible  
- expansion state not modified  

---

2. **Composite Expansion State**

Composite expansion must be owned by **SpaghettiCanvas**.

State format:

Map<string, boolean>

Expansion key format:

spComp|in|${nodeId}|${portId}  
spComp|out|${nodeId}|${portId}

Composite expansion keys must **never include encoded field paths**.

---

3. **Composite Output Leaf Rendering**

Composite output ports must support expandable leaf rows.

Rules:

Parent output row always renders.

Leaf output rows render based on row mode rules.

Leaf output anchors are mounted **only when the leaf row is rendered**.

Parent anchors must always remain mounted.

---

4. **NodeView Rendering Responsibility**

NodeView must act as a **pure rendering component**.

NodeView must NOT:

- evaluate the graph
- call evaluateSpaghettiGraph
- subscribe to broad graph state

NodeView MAY:

- read minimal node-scoped UI slices using stable Zustand selectors
- render node data passed from SpaghettiCanvas

NodeView should be wrapped in:

React.memo

---

5. **Rerender Control**

Prevent avoidable node subtree rerenders.

Guidelines:

- SpaghettiCanvas owns UI state like rowViewMode and composite expansion
- NodeView receives node-scoped props only
- handlers are stabilized only when they cause measurable cascades
- avoid passing entire graph or registry structures to NodeView

---

## Determinism Rules

Leaf ordering must remain deterministic.

Composite leaf rows must follow the ordering defined by:

fieldTree traversal

If additional iteration occurs outside fieldTree traversal, leaf paths must be sorted deterministically.

Random values, timestamps, or unstable keys are prohibited.

---

## Required Tests

Add deterministic tests for:

1. **Composite Expansion Keys**

Verify exact formats:

spComp|in|nodeId|portId  
spComp|out|nodeId|portId  

Ensure no encoded path values appear.

---

2. **Row Mode Flags**

Verify helper outputs:

collapsed  
renderLeafRows = false  
forceLeafRows = false  

essentials  
renderLeafRows = true  
forceLeafRows = false  

everything  
renderLeafRows = true  
forceLeafRows = true  

---

3. **Compiler Determinism Smoke Test**

Compile the same graph twice and assert deep equality of compile results.

The compiler must remain independent of any UI render state.

---

## Performance Verification

Before closing this phase verify:

- NodeView components do not rerender when unrelated UI elements change
- toggling row modes does not cause full graph rerenders
- expanding a composite only rerenders the affected node

Verification method may include:

React DevTools Profiler  
temporary render counters during validation

---

## Completion Criteria

This phase is complete when:

- row modes behave exactly as defined
- composite inputs and outputs expand correctly
- output leaf anchors are visible and usable
- NodeView rerenders are limited to node-scoped changes
- deterministic tests pass
- no compiler, worker, or protocol changes occurred

---

## Next Phase

Phase 5 — **Baseplate Geometry v0**

Goal:

Generate the first visible CAD geometry using the Feature Stack.

Initial feature stack:

Sketch  
Line  
Line  
Line  
Line  

Extrude  
Profile: Sketch  
Depth: thickness  

Inputs:

width  
length  
thickness

The viewer should render the resulting baseplate body artifact.
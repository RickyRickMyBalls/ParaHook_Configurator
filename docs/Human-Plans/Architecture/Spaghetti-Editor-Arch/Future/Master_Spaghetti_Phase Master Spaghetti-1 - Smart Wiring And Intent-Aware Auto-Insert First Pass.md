# Master Spaghetti Phase Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass

## Doc Header

### Doc History
1. 2026-03-25 03:00: Created this standalone future `Master Spaghetti` phase doc so the first cross-node smart-wiring QoL slice now has an implementation-ready planning surface under `Spaghetti-Editor-Arch/Future/` instead of living only as a short phase block in the umbrella index

### Purpose

This phase adds the first intentional auto-insert behavior to the Spaghetti canvas.

Use it to answer:
- what the first smart-wiring QoL slice should actually do
- which real current node/port contracts it should target
- where the graph mutation should live
- what is in scope for the first narrow implementation versus later broader smart-wiring growth

## Doc Body

## [ ] Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass

Summary:
- prove the first cross-node smart-wiring behavior in the graph canvas
- recognize one narrow authored intent at wire-drop time
- auto-insert `Geometry/Extrude` between `Sketch` and an output-facing solid target

Owns:
- first smart-wiring intent rule in the Spaghetti canvas
- one deterministic missing-step inference:
  - `SketchProfile -> Geometry/Extrude -> OutputPreview`
- automatic intermediate-node creation
- automatic edge creation for the inserted path
- predictable first-pass node placement between source and target

Does not own:
- generic multi-step graph synthesis
- transform-aware extrude runtime alignment
- plural profile-input expansion beyond the current first-pass graph contract
- broader `Extrude` parameter UX
- non-extrude smart-wiring chains

### Current Code Truth

The current relevant contracts already exist:

- `Geometry/Sketch`
  - outputs:
    - `SketchProfile`
- `Geometry/Extrude`
  - inputs:
    - `ExtrusionProfile`
  - outputs:
    - `SolidBody`
- `OutputPreview`
  - dynamic solid-input slots:
    - `in:solid:<slotId>`

This means the first smart-wiring pass should not invent a new conceptual chain.

It should automate the already-honest missing bridge the user would otherwise build manually.

### First Implementation Target

The first target should be:

- drag starts from:
  - `Geometry/Sketch` output `SketchProfile`
- drag ends on:
  - `OutputPreview` dynamic slot input
  - specifically:
    - `in:solid:<slotId>`

If the direct connection is invalid because the target expects a solid body, the canvas should:

1. create one `Geometry/Extrude` node
2. connect:
   - `SketchProfile`
     - to `ExtrusionProfile`
3. connect:
   - `SolidBody`
     - to `in:solid:<slotId>`

Important rule:
- the first pass should target the real current output-facing solid seam:
  - `OutputPreview`
- do not broaden the first implementation around `Output/Assembled` until that node has a richer live wire contract

### Why This Phase Lives Under `Master Spaghetti`

This is not only an extrude-family feature.

It is the first umbrella rule for:
- drag/drop intent interpretation
- canvas-owned graph mutation at drop time
- intermediate-node insertion as a workspace behavior

`Extrude` still owns the deeper profile/body contract, but this phase owns the first workspace-level rule that the canvas may fill in one obvious missing bridge.

### Current Code-To-Target Mapping

Current likely seams:

- connection validation / endpoint truth:
  - `src/app/spaghetti/contracts/endpoints.ts`
- canvas drop/connect behavior:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - `src/app/spaghetti/graphCommands/connectEdgeWithAutoReplace.ts`
- node creation:
  - `src/app/spaghetti/graphCommands/addNode.ts`
- graph schema / edge shape:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
- current node and port contracts:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
- effective `OutputPreview` slot ports:
  - `src/app/spaghetti/features/effectivePorts.ts`

Target direction:

- the canvas should ask one shared smart-wiring planner whether the attempted connection implies one supported missing bridge
- if yes:
  - use one canonical graph mutation path to create the new node and both edges
- if no:
  - fall back to the ordinary direct-connect behavior

### Recommended First Implementation Shape

Create one narrow planner function near the graph-command layer, for example:

- inspect attempted source endpoint
- inspect attempted target endpoint
- confirm the exact supported pattern:
  - `Geometry/Sketch.SketchProfile`
  - to `OutputPreview.in:solid:<slotId>`
- create one `Geometry/Extrude` node with default params
- place it at a stable midpoint or offset midpoint between source and target node positions
- generate two edge records:
  - source sketch -> new extrude
  - new extrude -> target output slot
- return one combined graph mutation plan

Hard rules:
- do not partially apply the insertion
- do not create the node if both edges cannot be created cleanly
- do not silently replace unrelated existing edges
- do not run this behavior on broad type similarity alone
- key it to the explicit supported source/target pair

### Questions / Decisions

#### [x] `q1` What exact first target should this smart-wiring pass support?

Suggestion:
- lock it to:
  - `Geometry/Sketch` `SketchProfile`
  - into `OutputPreview` `in:solid:<slotId>`

Decision:
- yes
- make `OutputPreview` the first real output-facing target because that is the current live solid-slot contract in code

#### [x] `q2` Should the first pass create an extrude with default params and no extra wizard?

Suggestion:
- yes
- the value is immediate graph completion, not another interrupting setup surface

Decision:
- yes
- create `Geometry/Extrude` with default params

#### [x] `q3` Should the first pass live behind one shared planner instead of inside direct canvas event code?

Suggestion:
- yes
- keep the canvas as the caller, not the long-term owner of the inference logic

Decision:
- yes
- the first pass should use one shared smart-wiring planner or graph-command seam

### Phase Boundary

Owned here:
- one supported auto-insert pattern
- graph mutation planning for that pattern
- stable placement rule for the inserted node
- focused regression coverage for the resulting graph shape

Not owned here:
- second or third smart-wiring patterns
- fuzzy matching across many node families
- automatic choice among multiple candidate inserted chains
- post-insert extrude parameter editing flows
- transform/runtime correctness of the produced extrude body

### Acceptance Checks

- dragging from `Geometry/Sketch.SketchProfile` to `OutputPreview.in:solid:<slotId>` can succeed even though the direct profile-to-solid connection is not the final authored graph
- the system inserts exactly one `Geometry/Extrude` node
- the inserted node is placed in a predictable location between source and target
- one edge connects:
  - `SketchProfile`
  - to:
    - `ExtrusionProfile`
- one edge connects:
  - `SolidBody`
  - to:
    - `in:solid:<slotId>`
- if the smart-wiring rule does not match, normal direct-connect behavior remains unchanged
- the resulting graph is editable like a normal manually-authored graph after insertion

### Suggested Verification

- unit test for the planner:
  - matching `SketchProfile -> OutputPreview slot` inserts one extrude and two edges
- unit test for non-match:
  - unrelated drags do not auto-insert anything
- unit test for occupied/invalid target cases:
  - planner stays deterministic and non-destructive
- canvas interaction test:
  - dropping a sketch profile onto an empty output-preview slot yields the inserted extrude path

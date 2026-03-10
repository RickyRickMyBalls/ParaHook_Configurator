1.	Phase Plan — DBG (Spaghetti Debug System)

Purpose:
Create a read-only developer debug inspector that exposes the internal state of the Spaghetti pipeline so rendering, compile, and wiring issues can be diagnosed quickly.

The debug system must:

never mutate graph state

never change runtime behavior

only reveal existing state

This will become the primary way to diagnose issues like:

Cube not rendering

OutputPreview slot mismatch

artifact generation failures

selector filtering bugs

wiring errors

DBG Architecture Overview

The debug system mirrors the actual runtime pipeline.

Graph
→ Resolver
→ compileGraph
→ PartArtifacts
→ OutputPreview slot mapping
→ selectPreviewRenderVm
→ ViewerHost

Each stage gets a debug inspector section.

Phase Breakdown
DBG-1 — Debug Inspector Foundation

Create the basic debug window and pipeline inspection.

[ ] create DebugPanel UI
[ ] create DebugStore / debug selector layer
[ ] implement compileGraph inspector
[ ] implement PartArtifact inspector
[ ] implement OutputPreview slot inspector
[ ] implement PreviewRenderVm inspector
[ ] implement ViewerHost input inspector
[ ] add keyboard toggle for debug panel
Output Example
DEBUG

Compile
Nodes compiled: 4
Artifacts: 2

Artifacts
id: cube_1
partKey: cube
partKeyStr: cube:0

OutputPreview
slot1 → cube_1
slot2 → empty

Preview VM
viewer entries: 1
slot1 → cube_1

Viewer
meshes loaded: 1

This alone will instantly reveal the Cube render bug.

DBG-2 — Graph / Node State Inspector

Add visibility into graph-level state.

[ ] selected node inspector
[ ] node type
[ ] nodeId
[ ] node mode (collapsed / essentials / everything)
[ ] section collapse state
[ ] drivers
[ ] inputs
[ ] outputs

Example:

Selected Node

nodeId: cube_1
type: Part/Cube
mode: essentials

Drivers
width: 100
length: 200

Inputs
widthInput: connected

Outputs
solid
DBG-3 — Feature Stack Inspector

Expose internal feature stack state.

[ ] feature stack listing
[ ] feature id
[ ] feature type
[ ] feature params
[ ] linked param status

Example:

Feature Stack

Sketch
  width: linked
  length: linked

Extrude
  depth: 20
DBG-4 — Resolver / Validation Inspector

Expose resolver output and validation diagnostics.

[ ] resolved param values
[ ] wiring resolution
[ ] validation errors
[ ] dependency resolution

Example:

Resolver

extrude.depth
source: input
value: 25

sketch.width
source: driver
value: 120
DBG-5 — Graph Wiring Inspector

Visualize actual edge resolution.

[ ] edge list
[ ] source node
[ ] source port
[ ] target node
[ ] target port

Example:

Edges

param_1.out:number
→ cube_1.in:feature:sketch:width
Debug UI Placement

Recommended UI placement:

bottom drawer

Reasons:

wide structured data

does not interfere with node canvas

easily toggled

Layout example:

────────────────────────
Canvas
────────────────────────
Debug Panel
────────────────────────
Compile | Artifacts | Preview | Node | Resolver
Debug Toggle

Recommended controls:

F9 → toggle debug panel

or

Ctrl + `
Architectural Rules

The debug system must obey these rules:

read-only
deterministic
no graph mutation
no worker changes
no compile changes

It must observe state, never alter it.

File Structure Suggestion
src/app/spaghetti/debug/

DebugPanel.tsx
DebugCompileInspector.tsx
DebugArtifactInspector.tsx
DebugPreviewInspector.tsx
DebugNodeInspector.tsx
DebugResolverInspector.tsx

Selectors:

src/app/spaghetti/debug/debugSelectors.ts
Roadmap Update

Current priorities become:

[~] NI-3 — Node section collapse consistency
[ ] OP-5A — Fix Cube preview rendering
[ ] DBG-1 — Debug inspector foundation
[ ] PP-1 — Pin to Input system
Why DBG Should Be Early

Without debug visibility, diagnosing issues requires:

scanning compileGraph

scanning selectors

scanning viewer code

With DBG:

You will see failures instantly:

artifact missing
slot mismatch
preview VM empty
viewer mesh missing
After DBG-1

Future development becomes significantly easier:

Pin to Input
RailMath node
multi-part assembly
advanced feature stacks

because every pipeline stage is inspectable.

If you'd like, I can also design the exact debug panel layout used by professional node editors (Blender / Unreal / Houdini style). It would fit your Spaghetti editor extremely well and make debugging almost effortless.

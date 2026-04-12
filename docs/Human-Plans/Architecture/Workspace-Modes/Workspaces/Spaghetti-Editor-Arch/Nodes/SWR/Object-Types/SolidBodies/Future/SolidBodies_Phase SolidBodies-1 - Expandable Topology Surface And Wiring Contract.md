# SolidBodies Phase SolidBodies-1 - Expandable Topology Surface And Wiring Contract

## Doc Header

### Doc History
1. 2026-04-12 13:40: Added the first dedicated `SolidBodies-1` phase doc, locking the initial family slice around a row-first expandable `SolidBody` topology contract with wireable `Origin`, `Vertices`, `Edges`, and `Faces` child surfaces while deferring mandatory inspector-node routing and later face-extrude execution to follow-on phases

## Summary

### Purpose
- make `SolidBody` behave like a real structured SWR instead of an opaque one-line output
- let the user expand the row and directly wire topology children they care about
- establish the first shared identity contract for body subobjects so later viewer selection, toolbar actions, and downstream geometry nodes can all point at the same `Vertex`, `Edge`, and `Face` references

### Owns
- the first structured `SolidBody` node-row contract
- the first visible topology child groups under `SolidBody`
- the first child-member identity contract for wireable body subobjects
- the first clear separation between graph-carried topology refs and runtime-owned topology data
- the first phase boundary for later face-pick and face-extrude follow-ons

### Does Not Own
- making an inspector node the mandatory primary access path
- advanced topology-query helpers
- full persistent topological naming under arbitrary upstream body edits
- final viewer-driven face selection UX
- face extrusion behavior itself

### Current strongest read
- the node row should be the discovery surface
- the graph should carry lightweight references, not heavy body payloads
- `Origin` should be treated as placement/property data rather than topology
- `Origin` should expand into `X`, `Y`, and `Z` scalar rows instead of being read as three geometric lines
- the first cut should expose true topology, not render-tessellation artifacts
- follow-on helper nodes should exist later for semantic filtering and topology analysis, but not replace the row-level contract

## Questions

### [x] Question 1 - What should the first visible `SolidBody` structure be?

#### Locked answer
- `SolidBody`
  - `Origin`
  - `Vertices`
  - `Edges`
  - `Faces`

#### Why
- this gives the user one immediately understandable topology ladder without widening into too many later semantic helper rows in the first cut

### [x] Question 2 - Should `Origin`, `Vertices`, `Edges`, and `Faces` be real wireable rows?

#### Locked answer
- yes

#### Why
- decorative expansion alone would not solve the authored need
- the whole point of the phase is to let the user reference body substructure downstream if they want to

### [x] Question 3 - Should `Vertices`, `Edges`, and `Faces` expose direct child members?

#### Locked answer
- yes
- collection rows should expand into member rows with real output identity

#### Why
- without member-level identity, the surface would still stop short of the user's actual goal of wiring one specific face or edge

### [x] Question 4 - Should `SolidBodies-1` standardize on topology refs instead of raw topology payloads?

#### Locked answer
- yes

#### Why
- ref-based outputs keep the graph lighter and let runtime/authoritative seams remain the owner of richer data, adjacency, surface properties, and later pick-resolution behavior

### [x] Question 5 - Should `Origin` be modeled as a topology primitive or placement data?

#### Locked answer
- placement data
- `Origin` should expand into `X`, `Y`, and `Z` scalar child rows

#### Why
- `Vertex`, `Edge`, and `Face` are the first wireable topology primitives
- `Origin` describes body placement, so it should not be grouped conceptually with topology members
- breaking `Origin` into scalar child rows gives the user an honest primitive breakdown without implying that those components are geometry lines

## Implementation Spec

### Locked direction
- `SolidBody` becomes an expandable structured row
- `Origin` becomes the first placement/property child surface under `SolidBody`
- `Vertices`, `Edges`, and `Faces` become the first visible topology child surfaces
- `Origin` expands into `X`, `Y`, and `Z` scalar rows
- `Vertices`, `Edges`, and `Faces` become expandable collection rows with real member output identity
- graph-visible child outputs carry lightweight refs to runtime-owned topology records
- inspector/query helpers remain future additive work

### First contract shape

Parent output:
- `solidBody`

First placement/property child:
- `Origin`
  - `X`
  - `Y`
  - `Z`

First child collection outputs:
- `solidVertices`
- `solidEdges`
- `solidFaces`

First child singular outputs:
- `solidVertex`
- `solidEdge`
- `solidFace`

First visible member naming direction:
- `Vertex:001`
- `Edge:001`
- `Face:001`

Important rule:
- these names are row/member identity labels, not promises of permanent topological naming across arbitrary rebuilds
- the first cut may be stable within one resolved runtime/body state without yet claiming full persistence across all future geometry mutations
- `Origin` is not one more topology primitive; it is the first structured placement/property row and its `X`, `Y`, and `Z` children are scalar numeric components

### Authoring model

The authored discovery path should be:
1. user sees `SolidBody`
2. user expands `SolidBody`
3. user expands `Origin`
4. user wires `X`, `Y`, or `Z` when they need body placement components
5. user expands `Faces`
6. user wires `Face:00N`

This should work without requiring:
- an intermediate inspector node
- a modal sub-panel
- a viewer-only pick step

Later helper/query nodes may still support cases such as:
- `largest face`
- `all planar faces`
- `adjacent edges`
- `face center`
- `face normal`

But those should build on the same topology-ref contract created here.

### Runtime ownership direction

The graph should not carry full face/edge/vertex payloads inline.

Instead:
- graph values carry lightweight topology refs
- authoritative/runtime storage owns:
  - richer topology data
  - adjacency
  - face/edge/vertex lookup
  - later viewport-pick resolution

For `Origin`:
- the row should read as one structured point/placement value
- `X`, `Y`, and `Z` should be the first scalar child outputs
- later whole-`Origin` wiring may still resolve as one `point3`-style value without changing the scalar-child contract

This keeps:
- graph evaluation lighter
- node surfaces readable
- future viewer integration aligned with the same identity seam

### First implementation seams

Likely seam families to touch later when this phase is implemented:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- later dedicated virtual-port helpers near the existing sketch/extrude child-port pattern
- the authoritative/runtime topology store that can resolve body subobject refs

### Hard rules

- do not make mesh tessellation points the meaning of `Vertices`
- do not describe `Origin` as a topology primitive
- do not describe `X`, `Y`, and `Z` as geometry lines
- do not require an inspector node for first access
- do not make row expansion metadata-only
- do not inline heavy topology payloads into every graph value
- do not bundle face-extrude behavior into this first contract phase

### Acceptance checks

- `SolidBody` reads as a structured expandable SWR
- the row can expand into `Origin`, `Vertices`, `Edges`, and `Faces`
- `Origin` can expand into real wireable scalar rows `X`, `Y`, and `Z`
- `Vertices`, `Edges`, and `Faces` can reveal real member rows
- member rows have real wireable output identity
- the first outputs represent topology refs, not preview-mesh artifacts
- later viewer-picked faces can resolve into the same `Face` identity instead of inventing a separate contract

### Definition of done

- the repo has one explicit first `SolidBody` topology surface contract
- the repo also has one explicit first `Origin` placement/property contract under `SolidBody`
- the user can expand a `SolidBody` row and wire one specific `Vertex`, `Edge`, or `Face`
- the user can expand `Origin` and wire one specific placement component `X`, `Y`, or `Z`
- the first phase stops at the topology surface and wiring contract so later face-selection and face-extrude work can stack on a stable base instead of reopening row meaning first

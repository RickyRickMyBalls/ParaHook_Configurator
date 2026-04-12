# SolidBodies

## Doc Header

### Doc History
1. 2026-04-12 13:40: Added the first `SolidBodies` family index and locked the opening phase as `SolidBodies-1 - Expandable Topology Surface And Wiring Contract`, grounding the family around a row-first `SolidBody` expansion model where topology becomes discoverable and wireable directly from the node surface while inspector/query nodes remain later follow-on work

## [ ] SolidBodies-1 - Expandable Topology Surface And Wiring Contract

### Summary

#### Purpose:
- establish the first honest `SolidBody` SWR contract as an expandable structured object instead of a single opaque row
- let the user open a `SolidBody` and directly see wireable topology surfaces such as `Origin`, `Vertices`, `Edges`, and `Faces`
- define the first repo-native contract for wiring one selected body subobject into later downstream geometry nodes without forcing the user through a required inspector node first

#### Owns:
- the parent-versus-child row meaning for `SolidBody`
- the first expandable `SolidBody` row contract in the node surface
- the first wireable topology child collections:
  - `Origin`
  - `Vertices`
  - `Edges`
  - `Faces`
- the first child-member output identity for:
  - `Vertex`
  - `Edge`
  - `Face`
- the separation between lightweight graph-native topology refs and heavier authoritative/runtime topology storage
- the first explicit direction for viewer-picked face selection to resolve back into a graph-visible `Face` target later

#### Does not own:
- making an inspector node the mandatory access path for solid-body topology
- advanced semantic query helpers such as:
  - `largest face`
  - `planar faces`
  - `adjacent edges`
  - `face normal`
- full persistent topological naming across arbitrary upstream rebuild mutations
- final face-extrude feature behavior
- treating render-mesh tessellation points as authored B-rep topology truth

#### Current strongest read:
- the row itself should be the primary discovery surface
- an inspector/query-node family may still exist later, but it should be additive rather than the only path
- the first cut should expose topological structure, not dump heavy payloads into graph values
- `Origin` should read as placement/property data rather than as one more topology primitive beside `Vertex`, `Edge`, and `Face`
- `Origin` should expand into scalar child rows `X`, `Y`, and `Z` so body placement can be wired directly as numeric components when needed
- the first cut should prefer lightweight ref outputs for `Vertex`, `Edge`, and `Face` while runtime-owned topology data stays in the authoritative/topology store
- the first cut should expose topological vertices and edges, not preview-mesh points or triangle edges

#### Dedicated future doc:
- `Future/SolidBodies_Phase SolidBodies-1 - Expandable Topology Surface And Wiring Contract.md`

### Questions

#### [x] Question 1 - Should `SolidBody` topology access live on the row itself or in a separate inspector node?

##### Locked answer
- row first
- the `SolidBody` row itself should expand and expose the first wireable topology structure
- inspector/query nodes can follow later as optional focused helpers

##### Why
- the main authored discovery surface should not require an extra helper node for basic topology access
- forcing the user through an inspector node for every `Face` or `Edge` read would make the graph feel indirect and hide useful structure behind one more layer of ceremony

#### [x] Question 2 - Should child rows output heavy geometry payloads or lightweight refs?

##### Locked answer
- lightweight refs

##### Why
- the graph should carry stable, cheap topology references rather than duplicating heavy runtime-owned shape data through many wires
- this keeps the graph-native contract readable while allowing the authoritative/runtime topology store to remain the owner of richer face/edge/vertex data

#### [x] Question 3 - Should the first `SolidBodies-1` cut expose render-mesh points as `Points`?

##### Locked answer
- no
- expose topological `Vertices` instead

##### Why
- mesh points would drift toward tessellation artifacts rather than meaningful authored B-rep structure
- the user wants to reference real body topology, so the first contract should reflect topological vertices, edges, and faces rather than preview triangles

#### [x] Question 4 - Should `SolidBodies-1` also own the first face-extrude execution feature?

##### Locked answer
- no
- `SolidBodies-1` should stop at the expandable topology surface and wiring contract

##### Why
- the first missing truth is how a `SolidBody` exposes topology as an SWR
- face extrusion should build on top of that contract later instead of being bundled into the same first phase before the underlying row, port, and topology-ref seams are stable

#### [x] Question 5 - Should `Origin` be treated as topology or placement data?

##### Locked answer
- placement/property data
- `Origin` should expand into `X`, `Y`, and `Z` scalar child rows

##### Why
- `Vertex`, `Edge`, and `Face` are the first wireable topology primitives for a `SolidBody`
- `Origin` is still important, but it describes where the body sits rather than one of the body's topological subobjects
- expanding `Origin` into `X`, `Y`, and `Z` gives the user a clean primitive breakdown without pretending those numeric components are geometry lines or topology members

### Spec

Locked first-cut direction:
- make `SolidBody` read as one expandable structured SWR in the node surface
- let the user open the row and discover topology directly from that row
- keep the graph-visible topology outputs lightweight and reference-oriented
- keep runtime-heavy topology storage out of the graph value itself
- treat inspector/query nodes as later additive helpers, not the primary contract

First visible row shape:
- `SolidBody`
  - `Origin`
    - `X`
    - `Y`
    - `Z`
  - `Vertices`
  - `Edges`
  - `Faces`
- collection rows such as `Vertices`, `Edges`, and `Faces` should be expandable in essentials/expanded states
- child members should become real wireable rows rather than decorative metadata-only summaries
- `Origin` should behave as one structured point/placement row that can expand into three numeric component rows rather than as a collection of topology members

First output contract direction:
- keep `solidBody` as the parent object output
- treat whole-`Origin` wiring as a later `point3`/placement-style value if needed, while `X`, `Y`, and `Z` are the first direct scalar child outputs under `Origin`
- add later child/member output families for:
  - `solidVertex`
  - `solidVertices`
  - `solidEdge`
  - `solidEdges`
  - `solidFace`
  - `solidFaces`
- child outputs should behave like repo-native virtual/member ports rather than bespoke one-off rows

Implementation direction:
- follow the existing parent-plus-virtual-child pattern already used elsewhere in node surfaces
- do not make `SolidBody` itself a giant in-graph payload blob
- keep the contract honest by separating placement/property rows such as `Origin` from topology rows such as `Vertices`, `Edges`, and `Faces`
- attach richer topology identity to authoritative/runtime-owned body records and let row/member outputs resolve back into that data
- when viewport picking later begins selecting faces, it should resolve into the same `Face` identity the row system already exposes

Suggested execution order:
1. Lock the visible `SolidBody` parent row meaning as one structured expandable object row.
2. Add the first placement/property child row for `Origin` and let it expand into `X`, `Y`, and `Z`.
3. Add the first topology child collection rows for `Vertices`, `Edges`, and `Faces`.
4. Give `Vertices`, `Edges`, and `Faces` real member output identity so child rows can be wired directly.
5. Define the first lightweight topology-ref contract that downstream nodes can consume without inlining heavy topology payloads.
6. Leave inspector/query helpers and face-extrude behavior for later follow-ons built on top of that contract.

Acceptance checks:
- a reader can point to one `SolidBody` parent row contract in the node surface
- `SolidBody` can expand into visible topology child rows instead of staying opaque
- `Origin` reads as placement/property data and can expand into wireable numeric `X`, `Y`, and `Z` child rows
- `Vertices`, `Edges`, and `Faces` child entries are real wireable targets rather than display-only copy
- the first contract exposes topological structure rather than mesh tessellation structure
- the graph carries lightweight topology refs while authoritative/runtime seams remain the owner of heavier topology truth
- a later face-selection or face-extrude feature can reuse the same `Face` identity instead of inventing a second incompatible face contract

# Pubwheel Builder-1 - Workspace Foundation And Assembly Carousel

## Doc Header

### Doc History
1. 2026-04-21 16:17:43: Added this `Pubwheel-Builder-1` family phase doc to make the Generation 1 workspace foundation implementation-ready, including the first assembly-carousel shell, Catalog starting-assembly handoff, simple part-type attachment map, and per-connection fastener naming lane.

### Purpose

This doc plans `Pubwheel-Builder-1`.

Use it to answer:
- how the first `Pubwheel Builder` workspace surface should be created
- how the XR and ADV starting assemblies should enter the carousel from Catalog truth
- how the first central assembly turntable, idle rotation, and left/right switching should be scoped
- how the first simple part-type attachment map should be represented
- where connection-specific fastener names should be recorded before detailed compatibility or dimensional proof exists

Do not use it for:
- Catalog source-record creation
- heavy STEP preview fidelity
- Import review or accepted-reference ownership
- full load-as-starting-configuration runtime
- final compatibility verdicts
- dimensional packaging proof
- per-product attachment geometry
- pretending fastener names are known before they are explicitly recorded

## Doc Body

### Short Version

`Pubwheel-Builder-1` should create the first real `Pubwheel Builder` workspace foundation.

The phase has two connected responsibilities:
- create the assembly-carousel workspace shell around known Catalog starting assemblies
- start the simple builder relationship map that says which part types attach to which other part types

The simple relationship map is intentionally not a full compatibility engine.

It should begin as a readable part-type graph:
- `Motor` attaches to `Axle`
- `Axle` attaches to `Rail` and `Motor`
- `Rail` attaches to `Axle`, `Boxes`, `Bumpers`, and `Footpads`

Each connection should also have a fastener lane so the team can name the real screws, nuts, bolts, washers, inserts, plates, brackets, or other connection hardware later.

### Current Source Truth

Known starting assemblies come from Catalog planning and should be consumed from Catalog truth or a Catalog-derived selector:
- `XR PubWheel Assembly 1`
- `ADV Full Assembly`

Known formal Catalog part groups include:
- `Footpads`
- `Bumpers`
- `Rails`
- `Motors`
- `Tires`
- `Boxes`
- `Axle Blocks`
- `FootHolds`
- `Shoes`
- `Screw & Nuts`

Builder slot language may use singular user-facing labels such as `Motor`, `Axle`, `Rail`, and `Box`, but the implementation should keep a clear mapping back to Catalog part groups such as `Motors`, `Axle Blocks`, `Rails`, and `Boxes`.

### Simple Attachment Map

This is the first simple map to preserve from the user direction.

| Part Type | Attaches To | Notes |
|---|---|---|
| `Motor` | `Axle` | First wheel-side connection seed. |
| `Axle` | `Rail`, `Motor` | Bridge between rail structure and motor connection. |
| `Rail` | `Axle`, `Boxes`, `Bumpers`, `Footpads` | Main platform-side attachment spine. |
| `Boxes` | `Rail` | Reciprocal connection from box parts back to rail structure. |
| `Bumpers` | `Rail` | Reciprocal connection from bumper parts back to rail structure. |
| `Footpads` | `Rail` | Reciprocal connection from footpad parts back to rail structure. |

Important rule:
- keep this map part-type-level first
- do not make it claim exact coordinates, holes, dimensions, or final compatibility
- use it to drive builder slot relationships, UI grouping, and future fastener naming

### Fastener Connection Ledger

Each attachment edge should have a fastener ledger entry.

The first ledger fields should be:
- `connectionKey`
- `fromPartType`
- `toPartType`
- `connectionLabel`
- `fastenerNames`
- `quantity`
- `status`
- `notes`

The first connection keys should be:

| Connection Key | Connection Label | Fastener Status |
|---|---|---|
| `motor-to-axle` | `Motor to Axle` | `needs-fastener-names` |
| `axle-to-rail` | `Axle to Rail` | `needs-fastener-names` |
| `rail-to-boxes` | `Rail to Boxes` | `needs-fastener-names` |
| `rail-to-bumpers` | `Rail to Bumpers` | `needs-fastener-names` |
| `rail-to-footpads` | `Rail to Footpads` | `needs-fastener-names` |

Healthy first behavior:
- show that a connection needs fastener names
- allow the data model to accept one or more named fasteners per connection
- allow later quantity and position notes
- avoid blocking the first builder UI just because the fastener names are still incomplete

### Ownership Boundary

`Pubwheel Builder` may own the part-type relationship map as builder presentation and workflow truth.

Catalog should still own the actual item records and source identity.

Later compatibility systems should own:
- whether a specific motor fits a specific axle
- whether a specific axle fits a specific rail
- whether a specific rail and box combination is allowed
- whether dimensions or packaging prove a build impossible

## Wishlist Organization

### High Level Goals

- [ ] `Pubwheel-Builder-Gen1-HLG-1. Pubwheel Builder should be a completely new workspace surface like Catalog, Dashboard, Home Page, and Model Viewport.`
- [ ] `Pubwheel-Builder-Gen1-HLG-2. Pubwheel Builder should open with a full PubWheel assembly centered in a 3D preview, ready to rotate or orbit.`
- [ ] `Pubwheel-Builder-Gen1-HLG-3. The centered assembly should slowly auto-rotate so the surface feels alive before the user interacts.`
- [ ] `Pubwheel-Builder-Gen1-HLG-4. Left and right controls should switch between full starting assemblies, beginning with XR PubWheel Assembly 1 and ADV Full Assembly.`
- [ ] `Pubwheel-Builder-Gen1-HLG-5. The left/right interaction should feel like the assemblies are arranged in a line and the camera or focus moves from one to the next.`
- [ ] `Pubwheel-Builder-Gen1-HLG-6. The first builder surface should reuse Catalog starting-assembly truth instead of creating a second source list.`
- [ ] `Pubwheel-Builder-Gen1-HLG-7. The UI should be honest when a full assembly source is known but heavy preview or load-as-starting-configuration behavior is still planned.`
- [ ] `Pubwheel-Builder-Gen1-HLG-8. Later Pubwheel Builder work should let the user swap parts or fill required build slots without losing Catalog item ownership.`
- [ ] `Pubwheel-Builder-Gen1-HLG-9. Later Pubwheel Builder work should support compatibility or fit reads only when Catalog metadata, Ricky Checker rules, or dimensional truth are ready.`
- [ ] `Pubwheel-Builder-Gen1-HLG-10. Generation 1 should start a simple part-type attachment map so the builder can say which kind of part attaches to which other kind of part.`
- [ ] `Pubwheel-Builder-Gen1-HLG-11. Generation 1 should leave a named fastener lane for each attachment connection so screws, nuts, bolts, washers, inserts, and other connection hardware can be filled in deliberately.`

### `Pubwheel-Builder-1 Phase 1`

- [ ] Create or register the first `Pubwheel Builder` workspace surface.
- [ ] Create the first selected starting-assembly state.
- [ ] Source `XR PubWheel Assembly 1` and `ADV Full Assembly` from Catalog truth or a Catalog-derived selector.
- [ ] Create the central turntable shell.
- [ ] Add idle-rotation behavior when the selected assembly is not actively transitioning.
- [ ] Add left/right controls for moving between starting assemblies.
- [ ] Show honest preview/load availability states.
- [ ] `Pubwheel-Builder-Gen1-HLG-1`
- [ ] `Pubwheel-Builder-Gen1-HLG-2`
- [ ] `Pubwheel-Builder-Gen1-HLG-3`
- [ ] `Pubwheel-Builder-Gen1-HLG-4`
- [ ] `Pubwheel-Builder-Gen1-HLG-5`
- [ ] `Pubwheel-Builder-Gen1-HLG-6`
- [ ] `Pubwheel-Builder-Gen1-HLG-7`

### `Pubwheel-Builder-1 Phase 2`

- [ ] Add the first simple part-type attachment map.
- [ ] Seed `Motor` attaches to `Axle`.
- [ ] Seed `Axle` attaches to `Rail` and `Motor`.
- [ ] Seed `Rail` attaches to `Axle`, `Boxes`, `Bumpers`, and `Footpads`.
- [ ] Add reciprocal readable edges for `Boxes`, `Bumpers`, and `Footpads` back to `Rail`.
- [ ] Add the fastener connection ledger shape.
- [ ] Mark initial fastener entries as `needs-fastener-names`.
- [ ] Keep exact geometry, compatibility verdicts, and dimensional proof out of this phase.
- [ ] `Pubwheel-Builder-Gen1-HLG-8`
- [ ] `Pubwheel-Builder-Gen1-HLG-9`
- [ ] `Pubwheel-Builder-Gen1-HLG-10`
- [ ] `Pubwheel-Builder-Gen1-HLG-11`

## [ ] `Pubwheel-Builder-1` - `Phase 1 - Workspace Surface And Assembly Carousel`

### Phase 1 Summary

Create the first visible `Pubwheel Builder` workspace shell and assembly carousel.

### Phase 1 Implementation Spec

The implementation should:
- add the workspace surface using the existing workspace-mode patterns
- expose a selected starting-assembly state
- route the initial assembly choices through Catalog starting-assembly truth or a small Catalog-derived selector
- render a central turntable area
- add left/right controls
- add idle rotation after transition settles
- show honest planned/unavailable states where heavy preview or builder load is not ready

Verification should cover:
- the workspace can be selected or opened through the expected workspace surface model
- XR and ADV starting assembly options are present
- left/right controls update selected assembly state
- unavailable preview/load states do not imply hidden heavy loading

## [ ] `Pubwheel-Builder-1` - `Phase 2 - Simple Attachment Map And Fastener Ledger`

### Phase 2 Summary

Add the first simple builder relationship map and fastener ledger shape.

This phase should make the builder aware that part types have relationships before full swapping or compatibility systems exist.

### Phase 2 Implementation Spec

The implementation should add a small typed data owner or Catalog-derived projection for the first relationship map.

The first relationship records should preserve:
- `Motor` attaches to `Axle`
- `Axle` attaches to `Rail`
- `Axle` attaches to `Motor`
- `Rail` attaches to `Axle`
- `Rail` attaches to `Boxes`
- `Rail` attaches to `Bumpers`
- `Rail` attaches to `Footpads`

The first fastener ledger records should preserve:
- `motor-to-axle`
- `axle-to-rail`
- `rail-to-boxes`
- `rail-to-bumpers`
- `rail-to-footpads`

Each fastener ledger record should be able to start incomplete with `needs-fastener-names`.

Verification should cover:
- the relationship map returns the expected attachment targets for each seeded part type
- the reciprocal rail-centered reads are available where they help the UI explain a connection
- the fastener ledger exposes every seeded connection
- incomplete fastener names are represented honestly instead of failing the builder

Do not include:
- exact CAD attachment coordinates
- per-product fit rules
- compatibility verdicts
- dimensional packaging checks
- automatic part swapping

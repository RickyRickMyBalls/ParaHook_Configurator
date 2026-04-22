# Pubwheel Builder Gen1 Index

## Doc Header

### Doc History
2. 2026-04-21 16:17:43: Added the simple Generation 1 attachment-map lane to `Pubwheel-Builder-1`, routing the first part-type connections and per-connection fastener placeholders into the workspace foundation phase instead of splitting them into a later generation.
1. 2026-04-21 16:04:39: Added this active Generation 1 planning index for the `Pubwheel Builder` workspace family, routing the new assembly-carousel workspace idea into `Pubwheel-Builder-1` while preserving the boundary that Catalog owns starting-assembly source truth and later builder load, slot swapping, and compatibility work remain separate follow-ons.

### Purpose

This file is the active `Generation 1` planning index for the `Pubwheel Builder` workspace family under `Workspace Modes`.

Use it to answer:
- how the `Pubwheel Builder` `Generation 1` vision becomes family phases
- which `Generation 1` HLG are preserved from `Pubwheel-Builder-Vision.md`
- which first family phase should be created or implemented next
- how the builder stays a workspace surface instead of a Catalog sub-panel, Model Viewport mode, or Import shortcut
- how the first simple part-type attachment map and fastener naming lane fit into Generation 1

Do not use it for:
- broad Pubwheel Builder north-star ownership that belongs in `Pubwheel-Builder-Vision.md`
- later generations after a dedicated `Pubwheel-Builder-GenN-Index.md` exists
- implementation-phase specs that belong in standalone `Future/` Family Phase Docs
- Catalog source truth
- Import review ownership
- STEP loader fidelity
- compatibility verdicts or dimensional proof
- exact part geometry or final fastener truth before real connection data is named

### Family Structure

Use this folder like this:

- `Pubwheel-Builder-Vision.md`
  - north-star product and ownership direction
- `Pubwheel-Builder-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Future/`
  - standalone implementation-ready `Pubwheel Builder` Family Phase Docs

## Doc Body

### Short Version

`Pubwheel Builder` should become a real workspace surface where the user starts from a complete PubWheel assembly.

The first family lane is `Pubwheel-Builder-1`.

`Pubwheel-Builder-1` should prove the assembly-carousel foundation first:
- register `Pubwheel Builder` as a real workspace surface
- show a central full-assembly turntable shell
- source selectable starting assemblies from Catalog truth
- begin with `XR PubWheel Assembly 1` and `ADV Full Assembly`
- add left/right assembly switching that reads like a camera or focus move between assemblies
- seed the first simple part-type attachment map
- provide a per-connection fastener naming ledger
- keep heavy preview and load-as-starting-configuration states honest
- leave full slot swapping, compatibility checks, dimensional proof, and final fastener truth for later work

### Current Planning Read

This file owns the active `Generation 1` family-phase routing.

Current legal family-phase ladder:
- `Pubwheel-Builder-1` - workspace foundation, assembly carousel, simple attachment map, and fastener ledger

Important planning rule:
- use this index to choose and bound the next `Pubwheel-Builder-N` family phase
- use a matching standalone `Future/` Family Phase Doc for Codex-sized implementation phases and implementation specs
- do not start runtime implementation from this index alone

Dispatch next:
- implement from `Future/Pubwheel-Builder-1 - Workspace Foundation And Assembly Carousel.md` when the first runtime slice is approved

## Vision

`Pubwheel-Builder-Vision.md` remains the broad north-star.

This Generation Index Doc owns the current `Generation 1` family-phase routing read.

The healthy Generation 1 read is:
- `Pubwheel Builder` is a workspace-global surface
- the first visible experience is an assembly carousel, not a generic catalog grid
- the selected assembly is centered in a preview/turntable region
- the selected assembly can idle rotate or otherwise feel inspectable
- left/right controls switch the selected starting assembly
- the interaction may feel like a camera rail or carousel move, but the implementation should not eagerly load all heavy sources
- starting assembly records come from Catalog truth or a Catalog-derived selector
- XR and ADV are the first known full assembly options
- preview and load states remain honest when heavy STEP preview, GLB fallback, or builder runtime behavior is not ready
- the first simple part-type attachment map is visible as Generation 1 builder metadata
- per-connection fastener naming has a ledger, even while names remain incomplete
- later full builder slots, part swapping, and compatibility results are visible in the roadmap but not claimed by the first surface

Important boundary rule:
- if a question is about the broad `Pubwheel Builder` purpose, use `Pubwheel-Builder-Vision.md`
- if a question is about current `Generation 1` family-phase order, use this index
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc

## Wishlist Organization

### High Level Goals

The canonical human-level goals live in `Pubwheel-Builder-Vision.md` under `## Vision > ### Human Level Goals`.

This index repeats them so current `Generation 1` family-phase routing stays readable.

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

### Codex Level Goals

- [ ] Pubwheel-Builder-Gen1-CLG-1. Add a workspace-family planning home and route `Pubwheel Builder` through the shared workspace surface model.
- [ ] Pubwheel-Builder-Gen1-CLG-2. Define the first assembly-carousel workspace phase around a centered turntable, selected assembly state, left/right controls, and preview/load honesty.
- [ ] Pubwheel-Builder-Gen1-CLG-3. Consume Catalog starting-assembly records for XR and ADV rather than duplicating source metadata in a builder-only list.
- [ ] Pubwheel-Builder-Gen1-CLG-4. Keep the first carousel implementation preview-safe by avoiding eager heavy STEP loading and by showing planned/unavailable states where needed.
- [ ] Pubwheel-Builder-Gen1-CLG-5. Preserve later builder slot, part swapping, Ricky Checker, and dimensional-fit directions without claiming them in Generation 1.
- [ ] Pubwheel-Builder-Gen1-CLG-6. Define a simple part-type attachment map with `Motor`, `Axle`, `Rail`, `Boxes`, `Bumpers`, and `Footpads` relationships.
- [ ] Pubwheel-Builder-Gen1-CLG-7. Define a connection fastener ledger so each seeded attachment edge can later receive named fasteners and quantities.

### `Pubwheel-Builder-1`

- [x] Create the standalone `Future/Pubwheel-Builder-1 - Workspace Foundation And Assembly Carousel.md` Family Phase Doc.
- [ ] Register or plan the real workspace surface route for `Pubwheel Builder`.
- [ ] Define the first selected-assembly state and source selector boundary.
- [ ] Route initial starting assemblies from Catalog truth, beginning with XR and ADV.
- [ ] Define the central turntable and idle-rotation behavior.
- [ ] Define left/right assembly switching and transition language.
- [ ] Define honest preview/load status copy for heavy or planned assembly sources.
- [ ] Define the first simple part-type attachment map.
- [ ] Define the first per-connection fastener ledger with incomplete fastener-name states.
- [ ] Keep full slot swapping, compatibility, dimensional proof, Import behavior, STEP loader fidelity, exact geometry, and final fastener truth out of the first phase.
- [ ] `Pubwheel-Builder-Gen1-HLG-1`
- [ ] `Pubwheel-Builder-Gen1-HLG-2`
- [ ] `Pubwheel-Builder-Gen1-HLG-3`
- [ ] `Pubwheel-Builder-Gen1-HLG-4`
- [ ] `Pubwheel-Builder-Gen1-HLG-5`
- [ ] `Pubwheel-Builder-Gen1-HLG-6`
- [ ] `Pubwheel-Builder-Gen1-HLG-7`
- [ ] `Pubwheel-Builder-Gen1-HLG-10`
- [ ] `Pubwheel-Builder-Gen1-HLG-11`
- [ ] Pubwheel-Builder-Gen1-CLG-1.
- [ ] Pubwheel-Builder-Gen1-CLG-2.
- [ ] Pubwheel-Builder-Gen1-CLG-3.
- [ ] Pubwheel-Builder-Gen1-CLG-4.
- [ ] Pubwheel-Builder-Gen1-CLG-6.
- [ ] Pubwheel-Builder-Gen1-CLG-7.

## [ ] `Pubwheel-Builder-1` - `Workspace Foundation And Assembly Carousel`

### Family Phase Summary

Create the first implementation-planning surface for the new `Pubwheel Builder` workspace.

This phase should make the new workspace and assembly-carousel direction concrete before any runtime implementation starts.

The first family phase should be small enough to ship as a first visible builder workspace without widening into full part-slot editing, compatibility checks, or heavy loader behavior.

It may also start the simplest builder metadata read:
- `Motor` attaches to `Axle`
- `Axle` attaches to `Rail` and `Motor`
- `Rail` attaches to `Axle`, `Boxes`, `Bumpers`, and `Footpads`
- each connection has a placeholder lane for named fasteners

### HLG / CLG Coverage

- [ ] `Pubwheel-Builder-Gen1-HLG-1. Pubwheel Builder should be a completely new workspace surface like Catalog, Dashboard, Home Page, and Model Viewport.`
- [ ] `Pubwheel-Builder-Gen1-HLG-2. Pubwheel Builder should open with a full PubWheel assembly centered in a 3D preview, ready to rotate or orbit.`
- [ ] `Pubwheel-Builder-Gen1-HLG-3. The centered assembly should slowly auto-rotate so the surface feels alive before the user interacts.`
- [ ] `Pubwheel-Builder-Gen1-HLG-4. Left and right controls should switch between full starting assemblies, beginning with XR PubWheel Assembly 1 and ADV Full Assembly.`
- [ ] `Pubwheel-Builder-Gen1-HLG-5. The left/right interaction should feel like the assemblies are arranged in a line and the camera or focus moves from one to the next.`
- [ ] `Pubwheel-Builder-Gen1-HLG-6. The first builder surface should reuse Catalog starting-assembly truth instead of creating a second source list.`
- [ ] `Pubwheel-Builder-Gen1-HLG-7. The UI should be honest when a full assembly source is known but heavy preview or load-as-starting-configuration behavior is still planned.`
- [ ] `Pubwheel-Builder-Gen1-HLG-10. Generation 1 should start a simple part-type attachment map so the builder can say which kind of part attaches to which other kind of part.`
- [ ] `Pubwheel-Builder-Gen1-HLG-11. Generation 1 should leave a named fastener lane for each attachment connection so screws, nuts, bolts, washers, inserts, and other connection hardware can be filled in deliberately.`
- [ ] Pubwheel-Builder-Gen1-CLG-1. Add a workspace-family planning home and route `Pubwheel Builder` through the shared workspace surface model.
- [ ] Pubwheel-Builder-Gen1-CLG-2. Define the first assembly-carousel workspace phase around a centered turntable, selected assembly state, left/right controls, and preview/load honesty.
- [ ] Pubwheel-Builder-Gen1-CLG-3. Consume Catalog starting-assembly records for XR and ADV rather than duplicating source metadata in a builder-only list.
- [ ] Pubwheel-Builder-Gen1-CLG-4. Keep the first carousel implementation preview-safe by avoiding eager heavy STEP loading and by showing planned/unavailable states where needed.
- [ ] Pubwheel-Builder-Gen1-CLG-6. Define a simple part-type attachment map with `Motor`, `Axle`, `Rail`, `Boxes`, `Bumpers`, and `Footpads` relationships.
- [ ] Pubwheel-Builder-Gen1-CLG-7. Define a connection fastener ledger so each seeded attachment edge can later receive named fasteners and quantities.

### Owns

- first workspace-surface onboarding plan for `Pubwheel Builder`
- selected starting-assembly carousel direction
- central turntable behavior direction
- left/right assembly switching direction
- Catalog starting-assembly handoff boundary
- honest preview/load state direction
- first simple part-type attachment map
- first per-connection fastener ledger
- first focused verification shape for the workspace surface and carousel shell

### Does Not Own

- creating new Catalog starting-assembly source records
- moving or copying assembly assets
- heavy STEP preview
- GLB fallback runtime unless explicitly planned in the future doc
- Import review or accepted reference changes
- load-as-starting-configuration runtime
- full part-slot swapping
- compatibility verdicts
- dimensional fit proof
- exact connection geometry
- final fastener names or quantities before they are recorded

### Planning Read

The first future doc should begin from the currently known Catalog truth:
- `XR PubWheel Assembly 1` has a source asset set with STEP preferred-source and GLB companion-mesh variants.
- `ADV Full Assembly` has known heavy STEP source truth.
- both can use source-reference `Add To Project` behavior through Catalog, but builder load-as-starting-configuration remains planned.

The first implementation should prefer a preview-safe path:
- if a companion mesh or existing preview source can be loaded safely, use it intentionally
- if a source is heavy or not preview-ready, show honest planned/unavailable state
- do not silently make the carousel responsible for Import-5 STEP fidelity or heavy loader progress

The first attachment-map implementation should prefer a data-simple path:
- represent part-type relationships before per-product compatibility
- seed `Motor`, `Axle`, `Rail`, `Boxes`, `Bumpers`, and `Footpads`
- keep reciprocal reads available where they help the UI explain a connection
- give each connection a fastener lane that can start as `needs-fastener-names`
- do not block the workspace foundation on unknown fastener details

### Family Phase Doc

- [x] `Future/Pubwheel-Builder-1 - Workspace Foundation And Assembly Carousel.md`

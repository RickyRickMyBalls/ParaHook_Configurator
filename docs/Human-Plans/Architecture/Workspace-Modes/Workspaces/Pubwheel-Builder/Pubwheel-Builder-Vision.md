# Pubwheel Builder Vision

## Doc Header

### Doc History
2. 2026-04-21 16:17:43: Expanded `Generation 1` so the first builder foundation also starts a simple part-type attachment map and per-connection fastener naming lane, keeping the early truth at the part-type level while deferring detailed geometry, compatibility verdicts, and dimensional proof.
1. 2026-04-21 16:04:39: Added this dedicated `Pubwheel Builder` workspace vision doc so the Tony Hawk-style full-assembly carousel, XR-to-ADV starting-assembly switching, and later part-slot builder direction have one stable planning home without making Catalog, Import, or Model Viewport own builder behavior.

### Purpose

This doc captures the long-range vision for the `Pubwheel Builder` workspace in ParaHook.

Use it to answer:
- what the `Pubwheel Builder` surface is supposed to be for
- how full PubWheel starting assemblies should be selected and previewed
- how the builder should consume Catalog starting-assembly truth without becoming a second Catalog
- how the assembly carousel should stay honest about heavy source files and preview availability
- how the first simple part-type attachment map should begin before full compatibility or dimensional proof exists
- how later slot filling, compatibility reads, and starting-configuration load should grow from the first workspace surface

Do not use it for:
- one specific implementation checklist
- pretending heavy STEP preview or builder load is already implemented
- replacing Catalog source/item ownership
- replacing Import review or accepted reference ownership
- replacing Model Viewport geometry execution and render ownership
- inventing compatibility verdicts without curated metadata or dimensional proof

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping builder presentation downstream from explicit Catalog, project, and geometry truth

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for checking that `Pubwheel Builder` stays one workspace surface inside the graph-native CAD direction

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - umbrella workspace family
  - useful for how `Pubwheel Builder` fits beside `Model Viewport`, `Browser`, `Catalog`, `Console`, and other workspace surfaces

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Vision.md`
  - Catalog family vision
  - useful for the rule that builder selections should reuse Catalog item truth and not invent a second part universe

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`
  - active Catalog Generation 2 routing
  - useful for current XR and ADV full assembly source truth, PubParts source metadata, and starting-assembly records

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-5 - Pre-Built PubWheel Starting Assemblies.md`
  - current starting-assembly planning record
  - useful for the verified `XR PubWheel Assembly 1` and `ADV Full Assembly` source-reference handoff status

## Doc Body

### Why This Doc Exists

The user described a workspace idea that feels like a character select screen from `Tony Hawk Pro Skater`:
- a complete 3D assembly sits in the middle
- the assembly slowly rotates in place
- left and right controls move to the next complete assembly
- the interaction feels like the assemblies are arranged in a line and the camera moves its focus from one to the next

This is a real workspace idea, not only visual polish.

It gives ParaHook a clear place to answer:
- which complete PubWheel assembly am I starting from?
- what platform family is this build for?
- what source files does the app know about?
- can this be previewed yet?
- can this be loaded as a starting configuration yet?
- what parts or slots can be changed later?

Without a dedicated planning home, this idea could drift into weak ownership shapes:
- Catalog starts acting like a builder
- Model Viewport starts owning assembly selection
- Import starts being treated as builder load
- heavy STEP files get previewed eagerly just because the carousel needs something to show
- compatibility reads appear before curated truth exists

This doc keeps the first version narrow and honest while preserving the richer direction.

## Vision

### Human Level Goals

Keep these as the explicit human-level wishlist items for `Pubwheel Builder`:

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

### Pubwheel Builder Generations

The first useful generation is `Generation 1`.

Generation index routing:
- `Generation 1` routes into `Pubwheel-Builder-Gen1-Index.md`.
- later generations should get generation indexes only when the builder grows beyond the first workspace and assembly-carousel foundation.

### Supporting Vision Detail

#### Short Version

`Pubwheel Builder` should be a real workspace surface for choosing and later configuring complete PubWheel starting assemblies.

The first experience should feel like:
- `XR PubWheel Assembly 1` is centered in a dedicated 3D turntable
- the assembly slowly rotates
- clicking `Left` or `Right` moves the focus to `ADV Full Assembly`
- the UI reads like a deliberate assembly carousel, not a generic card list

Important rule:
- the first implementation should make the carousel and selection model real
- it should not pretend the full builder runtime, heavy STEP preview, or compatibility checker already exists

#### Workspace Surface Direction

`Pubwheel Builder` should be treated as a first-class workspace-global surface.

That means:
- it belongs in the shared workspace surface catalog
- it can be launched from Home Page or other workspace launch surfaces
- it should later be hostable inside the shared `Windowed`, `Tiled`, and `Pop-Out` model
- it should not be implemented as a route-only page outside the workspace model

Healthy surface read:
- Catalog remains the browse/source owner
- Pubwheel Builder remains the assembly-selection and later build-configuration owner
- Model Viewport remains the general project/viewer surface
- Import remains the user-granted intake and accepted-reference owner

#### Assembly Carousel Direction

The assembly carousel should prioritize the selected assembly and make neighboring assemblies feel spatially adjacent.

The user-facing read is:
- the selected assembly is centered
- previous and next assembly controls move the focus
- transition animation may feel like a camera rail or carousel move
- the selected assembly can idle rotate after the transition settles

Implementation honesty rule:
- do not eagerly load every heavy full assembly just because the interaction suggests a line of assemblies
- use preview-safe sources where available
- when only heavy STEP source truth exists, show honest planned/unavailable preview state
- preserve the illusion in UI/animation without turning it into a hidden memory or loader debt trap

#### Current Starting Assembly Truth

The first known starting assemblies are sourced from Catalog planning:

- `XR PubWheel Assembly 1`
  - platform family: `XR`
  - source identity: `pubwheel_1`
  - preferred source variant: STEP
  - companion mesh variant: GLB
  - builder load-as-starting-configuration: planned

- `ADV Full Assembly`
  - platform family: `ADV`
  - known heavy STEP source
  - builder load-as-starting-configuration: planned

Important rule:
- these should be consumed from Catalog starting-assembly records or a shared Catalog-derived selector
- do not duplicate their source metadata by hand inside builder-only records unless a later phase creates an explicit projection/cache seam

#### What Pubwheel Builder Should Own

`Pubwheel Builder` should own:
- the builder workspace surface
- selected starting assembly id
- assembly carousel interaction state
- selected assembly presentation and rotation state
- builder-specific action states such as planned preview, planned load, or ready load
- later required slot list presentation
- later part-swap workflow over Catalog items
- later build completion state
- later compatibility result presentation when a compatibility owner exists

#### What Pubwheel Builder Must Not Own

`Pubwheel Builder` must not own:
- Catalog source records
- PubParts external source truth
- Import review intake or accepted imported-reference records
- generic Model Viewport camera/viewer state
- Browser project-content hierarchy
- heavy STEP loader fidelity
- `.step` units, tessellation, progress, or B-Rep truth
- compatibility rules before Catalog/Ricky Checker owns those rules
- dimensional fit proof before the dimensional-check family owns that truth

Important rule:
- Pubwheel Builder may summarize and act on those owners
- it should not absorb them

#### Later Builder Direction

After the assembly carousel foundation, later generations can grow into a real builder.

The later healthy builder read is:
- the user starts from a complete known assembly or an empty recipe
- the builder shows required full-build slots
- the user fills or swaps slots with Catalog items
- compatibility rules explain whether the current build is valid, invalid, unknown, or later possible
- dimensional checks strengthen that read only when reliable dimensional truth exists

The later required-part direction should stay aligned with Catalog Generation 3:
- `Tire`
- `Motor`
- `Axles`
- `Rails`
- `Boxes`
- `ESC`
- `Battery`
- `Footpads`
- `Bumpers`
- `Fasteners`
- `Accessories`

Important rule:
- the builder should reuse Catalog item truth
- it should not invent a separate part universe just because the UI has builder slots

## [ ] Generation 1 - Assembly Carousel Workspace Foundation

### Generation 1 Summary

`Generation 1` creates the new `Pubwheel Builder` workspace family and routes the first implementation ladder toward a real assembly carousel surface.

The first generation should prove:
- the workspace surface exists
- XR and ADV full assemblies can appear as selectable starting records
- the central turntable and left/right switching behavior are planned as the first user-facing experience
- the first simple part-type attachment map exists for builder slot relationships
- connection-specific fastener naming has a clear place to grow
- preview and builder-load availability remain honest
- Catalog, Import, Model Viewport, and compatibility owners are not collapsed into the builder

### Generation 1 Vision Rails

#### Final Generation Vision

The final `Generation 1` read is that a user can open `Pubwheel Builder`, see a centered full-assembly preview surface, use left/right controls to move between XR and ADV starting assemblies, and understand exactly which actions are available now versus planned.

The carousel should be emotionally clear and technically conservative:
- it should feel like assembly selection
- it should use real Catalog starting-assembly truth
- it should not eagerly load unavailable heavy geometry
- it should leave later slot swapping and compatibility checks visible but unclaimed

#### Owns

- new workspace-family planning home
- workspace surface registration direction
- assembly carousel UI direction
- starting-assembly selector direction
- preview/load availability copy
- first handoff rules from Catalog starting assemblies into Builder
- first simple part-type attachment map direction
- first per-connection fastener naming direction
- later builder-generation routing

#### Does Not Own

- Catalog source metadata implementation
- heavy STEP preview
- GLB fallback runtime unless a later preview phase owns it
- Import review or accepted-reference commit behavior
- actual load-as-starting-configuration runtime
- compatibility verdicts
- dimensional proof
- full part-slot swapping implementation
- per-product attachment geometry
- final fastener truth before the user or Catalog data names the real hardware

#### Phase Creation Read

Create `Generation 1` family phases when work is about:
- registering the `Pubwheel Builder` workspace surface
- creating the first carousel shell
- connecting XR and ADV starting assemblies into the carousel read
- defining selected-assembly state and left/right controls
- adding a preview-safe turntable surface
- adding honest planned/available states for preview and builder load
- defining the first simple part-type attachment map
- defining the first per-connection fastener placeholders

If work starts changing Catalog source records, Import review, STEP loader fidelity, or compatibility rule truth, route that work to the owning family instead of hiding it inside `Pubwheel Builder`.

## [ ] Generation 2 - Builder Slots And Part Swapping

### Generation 2 Summary

`Generation 2` should turn the assembly selector into a build workspace.

The user should be able to inspect the selected assembly as a starting point, see required build slots, and begin swapping or filling slots from Catalog item truth.

### Generation 2 Vision Rails

`Generation 2` should not begin until the first carousel workspace is real enough that the selected assembly has stable identity and UI state.

Owns later:
- required slot list
- selected slot state
- Catalog item picker handoff
- swap/fill workflows
- build completeness read

Does not own yet:
- compatibility rule engine
- dimensional fit proof
- automatic part inference

## [ ] Generation 3 - Compatibility And Fit Feedback

### Generation 3 Summary

`Generation 3` should make builder selections explainable through compatibility and fit feedback.

This generation should reuse Catalog/Ricky Checker and dimensional-check truth instead of inventing verdicts locally.

### Generation 3 Vision Rails

The healthy long-range read is:
- the builder can say whether a current build is complete
- the builder can say whether selected parts are known compatible, known incompatible, unknown, or later possible
- result language explains whether the verdict came from curated rules, missing metadata, or dimensional fit checks

Important rule:
- compatibility truth should come from the owning metadata/rule systems
- Pubwheel Builder should present the result in context, not secretly become the rule owner

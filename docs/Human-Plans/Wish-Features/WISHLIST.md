# WISHLIST

## Doc Body

### [ ] - [01] - Turn Parasliders into rows that accept an input - first node to add wil be "LFO" - similar to "timeline" in refrence transform. 

- parasliders like move X, move Y, move Z, `Scale XYZ`, rotate, and similar transform controls could become real authored rows with optional input pins instead of staying value-only widgets
- those pins could accept wires using the same broad language as the spaghetti editor system, so direct manipulation and graph-driven animation/modulation are not separate worlds
- the first proving node could be `LFO`
  - one output pin that drives a float value over time
  - a `rate` paraslider
  - a small editable waveform graph
  - use the reference-transform right-click timeline as a direction reference for playback/session behavior

#### Why this feels interesting

- it would let transform rows act more like real authored control surfaces instead of dead-end numeric entries
- it creates a bridge between:
  - direct toolbar editing
  - timeline-ish motion/modulation
  - graph-native wiring
- it could make later motion, secondary animation, wobble, pulsing, drift, and mechanical repeating actions feel native inside ParaHook instead of bolted on

#### First-pass product suggestions

- keep manual editing valid
  - a user should still be able to type or drag a paraslider even when that row can also accept a wire
- treat wiring as optional enhancement
  - not every row needs to be wired for the feature to feel useful
- start with transform-owned numeric rows only
  - `Move X`
  - `Move Y`
  - `Move Z`
  - maybe later `Rotate`
  - maybe later uniform `Scale`
- keep the first pass float-only
  - avoid trying to solve vector bundles, booleans, enums, and complex authored structs in the same cut

#### Suggested row behavior

- each compatible paraslider row gets:
  - its normal value control
  - a small input-pin area
  - a visible state read that tells whether the row is:
    - manual
    - driven
    - maybe later blended or offset
- if a row is driven:
  - the wire becomes the primary value source
  - the row should still display the live value clearly
- useful first decision:
  - manual value probably becomes a fallback/default when nothing is connected
- useful later idea:
  - manual value could become an offset or amplitude multiplier instead of being ignored once driven

#### Suggested `LFO` shape

- outputs:
  - one float output
- first controls:
  - `rate`
  - `amplitude`
  - `offset`
  - `phase`
- waveform options:
  - start simple with a drawn curve or a few basic presets
  - `sine`
  - `triangle`
  - `square`
  - `saw`
- later follow-ons:
  - loop range
  - clamp/min/max
  - ping-pong
  - random/noise style oscillation
  - sync-to-timeline or sync-to-project time

#### UX suggestions

- the row should make it obvious that it is no longer just a static slider
- show a small live preview sparkline when the row is driven
- let the user jump from the driven row to the source node quickly
- if the source is `LFO`, opening it should feel closer to opening a mini motion editor than a generic node blob
- keep the transform toolbar readable
  - avoid turning every row into a huge graph surface by default
  - compact collapsed state first, deeper editor on demand

#### Architecture suggestions

- avoid making this a transform-only one-off forever
- if the pattern works, it could become a broader authored-control concept:
  - a numeric row can optionally expose an input pin
  - the row owns display and direct editing
  - the graph/wire owns dynamic value production
- keep one honest value-ownership rule
  - do not let viewer drag state, toolbar state, and graph state all fight for the same number
- if time/session ownership matters, reuse the emerging transform-session and history model where possible instead of inventing a disconnected mini-timeline system

#### Good first non-goals

- full animation system
- keyframe editor
- global sequencer
- every toolbar control becoming wireable at once
- solving every data type on day one

#### Small possible rollout

- `v1`
  - one transform row such as `Move X` can accept one float input
  - one `LFO` node can drive that value
  - row shows live driven value
- `v2`
  - add `Move Y` / `Move Z`
  - add more waveform controls and better preview
- `v3`
  - add more transform rows and maybe simple offset/blend behavior

### [ ] - [02] - Animation - a way to animate 3d solids in ways they should move, a gear should turn

- ParaHook could have a motion/animation layer for authored 3D solids where movement is believable to the object type instead of feeling like random scene transforms
- the simplest example:
  - a gear should rotate around its axis
  - linked gears should turn at a ratio
  - a slider-like part should translate along its intended path
  - a hinge-like part should swing around one pivot
- this should feel closer to mechanical motion study than to general VFX animation

#### Why this feels useful

- it would let users prove that a design moves correctly instead of only looking correct when static
- it makes assemblies easier to understand
- it gives ParaHook a stronger CAD/workbench identity
- it creates a bridge between:
  - authored object structure
  - transform systems
  - later driver systems
  - later timeline or playback systems

#### Fusion-style ideas worth stealing

- motion links
  - one moving part can drive another by a defined relationship
  - example:
    - one gear rotation drives the opposite gear at a ratio
- joint-like motion definitions
  - `revolute`
  - `slider`
  - `cylindrical`
  - maybe later `planar`
- motion study playback
  - play, pause, scrub, reverse
  - a small timeline for previewing movement
- contact-like preview
  - later the system could help prevent obvious impossible overlap during motion playback
- exploded and motion storytelling views
  - not only final assembled rest state
  - also "show how this opens / turns / slides" states

#### Suggested first product shape

- keep the first pass focused on authored solids and authored assemblies
- do not start with cloth, physics, or character animation language
- start with simple mechanical motions:
  - rotate around axis
  - slide along axis
  - maybe hinge rotation
- first target examples:
  - gears
  - knobs
  - handles
  - sliders
  - drawers
  - hinges

#### Suggested ownership model

- motion should attach to the authored target or authored relationship
  - not just to one temporary viewer playback state
- good first ownership candidates:
  - object-local motion definition
  - relationship motion between two targets
  - later assembly-level motion groups
- this should stay aligned with the newer transform direction:
  - target-local ownership
  - shared toolbar/Browser/Console entry
  - viewer-owned live preview
  - app/store-owned committed motion definition

#### Suggested first motion types

- `Rotate`
  - around chosen axis
  - with optional limits
- `Slide`
  - along chosen axis
  - with optional min/max travel
- `Hinge`
  - effectively a rotate with more explicit pivot/door-like framing
- later:
  - gear pair
  - rack and pinion
  - pulley/belt style relation
  - cam/follower style relation

#### Suggested gear behavior

- a gear should be able to expose:
  - center/axis
  - tooth-count or effective ratio value
  - direction
- if two gears are linked:
  - one becomes the driver
  - the other becomes the follower
  - turning one updates the other automatically
- useful first simplification:
  - do not require true tooth-contact simulation
  - just support believable ratio-driven motion

#### UX suggestions

- motion entry should be easy from the Browser or transform area
- useful actions might be:
  - `Add Motion`
  - `Link Motion`
  - `Preview Motion`
  - `Play Motion`
- motion should be visible even when not playing
  - show axis
  - show pivot
  - show travel direction
  - show motion limits
- during playback:
  - keep the viewport clean
  - but let the user inspect relationships and active drivers

#### Good first Console ideas

- `animate`
- `play motion`
- `pause motion`
- `reverse motion`
- `link gears`
- `set ratio`
- `set travel`

#### Architecture suggestions

- do not make this only a viewer toy
- if the system is real, motion definitions should live on authored content or authored relationships
- transform history and motion playback should stay related but not be the same thing
  - transform history is "what edits were committed"
  - motion is "how the target is intended to move"
- a later timeline can exist, but first the motion model should be honest even without a full sequencer
- keep one clear distinction between:
  - design-time transform edits
  - motion-definition constraints
  - playback state

#### Good first non-goals

- full physics simulation
- collision-perfect gear solving
- material deformation
- character rigging
- cinematic animation editor
- huge global timeline system in v1

#### Small possible rollout

- `v1`
  - one solid can get a simple rotate or slide motion
  - playback exists with play/pause/scrub
  - viewport shows axis and limits
- `v2`
  - two targets can be linked
  - first gear-ratio relation lands
  - first hinge/slider relationship feels assembly-aware
- `v3`
  - richer motion groups
  - simple study/story playback
  - later contact checks or motion warnings

### [ ] - [03] - Generative Design - can we do a lighter version with the tools we already have?

- maybe yes, but probably not as full "Fusion generative design" on the first pass
- ParaHook could still support a practical lighter-weight generative design workflow using tools that already fit the direction of the app:
  - graph-driven parameter variation
  - constraints and keep-out rules
  - generated option sets
  - scoring and filtering
  - user selection of preferred candidates
- that would already be useful even before true simulation-heavy topology optimization exists

#### What this should probably mean in ParaHook

- not "press one button and invent impossible alien geometry"
- more like:
  - define a design space
  - define what must stay fixed
  - define what can vary
  - generate many candidate outcomes
  - rank and inspect those outcomes
  - keep/refine one or more winners

This would feel closer to:
- parametric option generation
- constrained design exploration
- later optimization

than to:
- fully automatic black-box engineering replacement

#### Why this feels realistic with current direction

- ParaHook is already moving toward:
  - graph-native authoring
  - explicit outputs
  - deterministic build execution
  - Browser/content inspection
  - future scoring/filtering possibilities
- that means the app already has the early shape needed for:
  - vary inputs
  - build candidates
  - compare results
  - keep chosen options

#### Fusion-style ideas worth stealing

- preserve regions and obstacle regions
  - user defines geometry that must stay
  - user defines regions where geometry must not go
- loads and constraints as first-class setup inputs
  - even if first-pass evaluation is simpler than full FEA
- manufacturing intent
  - later the user could say things like:
    - milled
    - printed
    - symmetric
    - minimum thickness
- candidate gallery
  - generate multiple options and inspect them side by side
- outcome ranking
  - weight
  - volume
  - envelope fit
  - stiffness proxy
  - printability/manufacturability proxy

#### A realistic first ParaHook version

- call it something closer to:
  - `Design Exploration`
  - or `Generative Study`
- the user defines:
  - fixed reference geometry
  - variable parameters
  - allowed ranges
  - forbidden/keep-out zones
  - maybe target dimensions or bounds
- the system generates:
  - many graph-driven variants
  - each one with stored inputs and resulting outputs
- the system then shows:
  - thumbnails/previews
  - a few simple metrics
  - sorting/filtering tools

#### Suggested first inputs

- parameter ranges
  - thickness
  - length
  - spacing
  - hole diameter
  - offset
- discrete choices
  - profile type
  - brace pattern
  - feature on/off
- simple spatial rules
  - keep-in box
  - keep-out box
  - preserve mounting points
  - preserve bolt holes

#### Suggested first outputs and metrics

- generated candidate preview
- parameter values used for that candidate
- rough volume
- rough mass proxy
- overall bounding box
- support/contact count if relevant
- simple clearance or overlap pass/fail
- maybe later:
  - center of mass
  - overhang score
  - tool-access score
  - stiffness proxy

#### Good first UX shape

- one `Study` object in the Browser
- inside it:
  - source graph
  - variable set
  - rules
  - generated candidates
- candidate cards should support:
  - preview
  - pin/favorite
  - reject
  - compare
  - promote to real design branch
- this should feel like browsing design branches, not like staring at a spreadsheet only

#### Suggested generation strategies that fit current tools better

- range sweep
  - iterate across chosen numeric ranges
- random sampling
  - generate many parameter combinations inside valid bounds
- weighted random mutation
  - start from one seed design and mutate selected parameters
- graph recipe switching
  - swap between a few known pattern families or brace strategies

Useful first rule:
- do not require AI to make this feature meaningful
- deterministic candidate generation is already valuable

#### Architecture suggestions

- keep the generative study separate from the base authored graph
- a study should reference:
  - the source graph/document
  - the variables it can control
  - the rules/constraints
  - the generated candidate records
- candidate evaluation should reuse normal build/output pipelines as much as possible
- do not invent a fake second geometry engine just for generative mode
- Browser and viewer should stay honest:
  - one place to inspect study candidates
  - one clear action to promote a candidate into a real saved design branch

#### Where AI could help later

- suggest parameter ranges
- suggest variable sets worth exploring
- cluster similar outcomes
- summarize why top candidates differ
- maybe later propose new brace/topology patterns

Important rule:
- AI help should be an assistant on top of the study system
- not the only thing making the feature work

#### Future external-tool possibilities

- if ParaHook ever wants a more advanced generative-design stack, the realistic path is probably integration rather than trying to build every solver internally
- useful future categories:
  - geometry/computational design tools
  - simulation tools
  - optimization/orchestration tools
- examples people use for this kind of work:
  - `nTop`
    - implicit geometry
    - lattices
    - field-driven and topology-style workflows
  - `Ansys`
    - structural/thermal/fluid analysis
    - topology optimization and engineering scoring
  - `COMSOL`
    - multiphysics analysis and optimization
  - `Altair Inspire / OptiStruct`
    - topology optimization and manufacturing-aware optimization
  - `Simcenter HEEDS`
    - design-space exploration and multi-objective search
  - `modeFRONTIER`
    - workflow orchestration, DOE, optimization, and candidate exploration
  - `OpenMDAO`
    - open-source engineering optimization/orchestration
  - `Dakota`
    - open-source optimization, uncertainty, and design exploration

Useful long-range rule:
- ParaHook should still own:
  - the study definition
  - the design graph
  - the candidate gallery
  - the promote-to-branch workflow
- external tools would more likely own:
  - deeper simulation
  - topology optimization
  - heavier multi-objective search

That suggests a healthy future split:
- ParaHook as the graph-native design-study front end
- external solvers/optimizers as optional deeper evaluation engines

#### Good first non-goals

- full cloud-scale topology optimization
- true Fusion-level FEA-driven generative solving in v1
- automatic material science correctness
- dozens of manufacturing processes on day one
- black-box "design this for me" magic with no inspectable logic

#### Small possible rollout

- `v1`
  - create a study from one graph
  - choose a few variables and ranges
  - generate candidate variants
  - inspect them in a candidate gallery with a few simple metrics
- `v2`
  - add keep-out / preserve-region style rules
  - add better ranking and filtering
  - allow promoting one candidate into a new real design branch
- `v3`
  - add smarter mutation/search strategies
  - add better proxy metrics
  - later layer in AI suggestions or deeper engineering analysis

### [ ] - [04] - Materials - real material assignment, presets, and part-level control for authored solids

- ParaHook should probably have a real `Materials` feature instead of keeping appearance as only ad-hoc viewer styling
- there was already a rough earlier proof of this in `C:\Users\Rubbe\Desktop\ParaHookConfig\17.0\replicad-app`
  - a floating materials panel
  - per-part selection
  - preset buttons
  - color picker plus hex entry
  - `metalness`, `roughness`, and `opacity`
  - `New Material`
- that means this is not a purely speculative wish
  - the old app already proved the broad interaction shape is useful

#### Why this feels worth adding

- materials make authored solids feel more like real owned design content instead of anonymous gray meshes
- they give the user another way to communicate:
  - intent
  - grouping
  - finish
  - prototype versus final part distinction
- they would also help:
  - viewport readability
  - presentation/rendering later
  - export fidelity later for formats that can carry appearance data

#### What the old `17.0` app already proved

- a focused `Materials` panel can work as a dedicated editing surface
- material editing can happen at the part/submesh level instead of only at one whole-object level
- simple preset buttons are useful alongside custom editing
- PBR-like controls such as:
  - `color`
  - `metalness`
  - `roughness`
  - `opacity`
  are already enough to make the feature feel real
- there is value in being able to:
  - inspect object parts
  - select odd/even or grouped subsets
  - assign or create a material from that selection

#### Good first ParaHook shape

- make `Materials` a real owned system, not just a temporary float panel
- a user should be able to:
  - create a material
  - reuse an existing material
  - assign a material to an object
  - assign a material to object parts when those parts exist as stable addressable subtargets
  - edit basic appearance values from one clear surface
- likely first controls:
  - `Name`
  - `Color`
  - `Metalness`
  - `Roughness`
  - `Opacity`
  - maybe later `Emissive`
  - maybe later `Transmission` or glass-like controls

#### Ownership suggestions

- materials should probably be authored objects with stable ids, not raw anonymous per-mesh blobs
- assignment should be separate from definition
  - one material definition
  - many assignments
- first useful assignment scopes:
  - whole object
  - stable generated part / face-group / body-group if the generator exposes them honestly
  - maybe later references if imported assets expose valid material slots
- do not hide assignment truth inside viewer-only temporary state

#### UX suggestions

- this could be a toolbar/surface family later, but even before that it needs one honest editing surface
- useful first UI areas:
  - material list/library
  - selected target / selected parts
  - preset swatches
  - custom parameter controls
  - assign / replace / clear actions
- a Browser tie-in would help:
  - selected object shows material assignment state
  - maybe later a `Materials` branch or material usage counts
- a small popout panel is still a valid first-shell direction if the underlying ownership is clean

#### Useful first presets

- `Default`
- `White`
- `Gray`
- `Black`
- `Blue`
- `Red`
- `Green`
- maybe later:
  - brushed metal
  - rubber
  - translucent plastic
  - glass

#### Architecture suggestions

- keep three concerns separate:
  - material definition
  - assignment
  - rendering/export interpretation
- the viewer should consume material truth, not own it
- if a generator emits stable named parts, material assignment should bind to those stable part keys
- if a rebuild deletes or renames a part, the system should surface that honestly instead of silently pretending the assignment still landed
- later this could connect well to:
  - `Layers`
  - `Export`
  - rendering/presentation modes
  - candidate comparison in generative design

#### Export and file-format implications

- some formats can carry appearance/material information better than others
- useful long-range thought:
  - `GLB` / `OBJ` should have a clearer material story
  - `STEP` is more about geometry/product structure than rich modern viewer material appearance
  - project-file or spaghetti-file saves should preserve authored material definitions and assignments as first-class project truth
- that means `Materials` should be planned as product data, not as disposable viewport decoration

#### Good first non-goals

- full physically accurate material science
- advanced node-based shading graphs on day one
- per-pixel texture authoring
- giant asset-library management in v1
- fake material assignment to unstable geometry that has no durable part identity

#### Small possible rollout

- `v1`
  - create and edit basic materials
  - assign one material to a whole authored object
  - include preset swatches and custom color / metalness / roughness / opacity
- `v2`
  - support stable part-level assignment where object generation exposes durable part keys
  - add better Browser visibility for material usage and assignment
- `v3`
  - support richer imported/reference material slots
  - improve export fidelity for material-carrying formats
  - later connect materials to rendering/presentation surfaces

### [ ] - [05] - Layers - real CAD-style authored content layers

- ParaHook should have a real `Layers` system because the architecture direction is already clear but the feature is not implemented yet
- this should mean AutoCAD-style authored content layers
  - not a temporary viewer filter
  - not the Console transcript layer/filter concept
- the user should be able to:
  - create layers
  - rename layers
  - set layer colors
  - toggle layer visibility
  - set one current layer
  - assign supported selected entities and objects onto a layer

#### Why this feels important

- layers are one of the clearest ways to make a CAD workspace feel owned and organized
- they help with:
  - visibility control
  - selection clarity
  - grouping
  - drawing discipline
  - large-scene management
- they also give ParaHook a better answer for:
  - "where should new work land"
  - "how do I temporarily isolate just this kind of content"
  - "how do I color-code authored content without confusing that with final material/render appearance"

#### Core direction worth keeping

- this should be a real authored layer system
- layer membership should live on the authored target, not in one temporary viewer pass
- rebuilds and redraws should preserve layer membership because it belongs to project content
- the first supported members should be:
  - committed sketch entities from `Sketch Draw`
  - authored 3D objects that already participate in Browser/viewport selection

#### Good first manager shape

- ParaHook should eventually have a dedicated `Layer Manager`
- useful first row controls:
  - layer color swatch
  - layer name
  - visibility toggle
  - current-layer indicator
  - assign-selected-to-layer action
- this should feel like the canonical surface for layer ownership and editing
- one clear rule matters:
  - the manager edits the shared layer state
  - it does not invent its own isolated mini-model

#### Current layer direction

- the system should support one `current layer`
- newly created supported authored entities should land on the current layer by default unless a stronger local rule owns that path
- this matters a lot for `Sketch Draw`
  - the user should know where the next line, circle, or similar entity will be authored
- changing the current layer should be easy and visible

#### Selection and assignment suggestions

- do not invent a second layer-local selection system
- layer assignment should consume the same shared selection truth already used across:
  - Browser
  - viewport
  - sketch selection
- the user selects real authored targets first
- then the layer manager or layer command assigns those targets onto a layer

#### Visibility behavior

- if a layer is hidden, its members should leave the active visible/selectable authored surface
- Browser, viewport, and later inspectors should stay in sync with that hidden/visible truth
- layer color should be a clear identity color for management and authored-content recognition
- useful first non-goal:
  - layer color does not need to become the full final material/render system

#### Console ideas worth adding

- a small first-class layer command surface would be useful
- especially:
  - `turn off layer`
  - `turn on all layers`
  - `isolate layers`
- `isolate layers` should work on more than one selected layer at once
- these commands should act on the same layer state owned by the manager

#### Why this is not the same as materials

- `Layers` are about authored organization, selection, visibility, and workflow control
- `Materials` are about appearance/surface definition
- one object may belong to one layer but still use a separate material assignment
- keeping those systems separate will make both features cleaner

#### Architecture suggestions

- keep layer state, membership, and visibility as shared project-owned truth
- let Browser, viewport, sketch systems, and Console all consume the same ownership model
- do not let layer hiding become a fake visual-only mask while the object is still treated as normally selectable elsewhere
- later this should connect naturally to:
  - Browser organization
  - `Sketch Draw`
  - authored 3D object visibility
  - export filtering maybe later

#### Good first non-goals

- full per-viewport layer overrides
- freeze, lock, plot/no-plot, and every advanced CAD layer mode on day one
- reference/import inheritance complexity in the first pass
- using layers as a replacement for materials
- using layers as only a viewer-side cosmetic toggle

#### Small possible rollout

- `v1`
  - canonical layer state
  - create/rename/color/visibility/current-layer behavior
  - `turn off layer`, `turn on all layers`, and multi-layer `isolate layers`
- `v2`
  - committed `Sketch Draw` entity ownership on layers
  - assignment from shared sketch selection truth
- `v3`
  - authored 3D object layer ownership
  - Browser/viewport visibility and selection fully honoring layer membership

### [ ] - [06] - Pasta Path - enriched history / feature tree for graph-native CAD

- ParaHook should have `Pasta Path` because a normal linear history tree is not enough for what the app is becoming
- this is basically ParaHook's answer to:
  - history tree
  - feature timeline
  - rollback/scrub surface
  - branch-aware build-story view
- but it should stay richer than a plain Fusion-style linear stack because ParaHook has real graph branching underneath

#### Why this feels important

- once ParaHook acts more like full CAD, users need a better answer to:
  - what happened in what order
  - where did this geometry come from
  - what happens if I scrub backward
  - how do I understand a branching build without reading the whole graph every time
- the `Spaghetti Editor` is good at explicit graph authoring
- it is weaker at:
  - temporal reading
  - build-story comprehension
  - rollback/debug inspection
  - showing parallel work in a way that still feels readable

#### Core concept worth keeping

- `Pasta Path` should be a hybrid surface between:
  - the source-of-truth `Spaghetti` graph
  - a scrub-friendly history/timeline surface
- the graph stays the source of truth
- the timeline is derived, not separately authored
- the goal is to let the user collapse complex node logic into a readable horizontal build story without throwing away the deeper graph underneath

#### Why this is more than a normal feature tree

- a normal feature tree assumes one mostly linear ordered stack
- ParaHook has graph logic, branching, and parallel construction paths
- so `Pasta Path` should support:
  - one primary left-to-right execution story
  - grouped feature-like steps instead of raw noisy nodes everywhere
  - parallel rows when branch structure actually matters
  - honest mapping back to real graph ownership
- that makes it feel like an enriched feature tree rather than a fake linearization

#### Good first user mechanics

- one strong vertical playhead
- scrub backward and forward through model construction
- earlier model states render when the playhead moves backward
- timeline steps should be inspectable and highlight their graph/source relationship
- the first cut should probably stay:
  - read-only
  - scrub-first
  - debug/inspection oriented

#### Workspace-shape suggestions

- this should likely live as another mode in the same top-left `+/e/-` family
- it should feel more like a slim bottom timeline surface than a second full-height editor
- good first shape:
  - low vertical footprint
  - near full width
  - horizontal reading first
  - vertical growth only when parallel branch rows are truly needed
- this is a good place to borrow from Fusion:
  - dense footer-like form factor
  - clear playhead
  - compact readable step strip

#### Relationship to Spaghetti

- `Spaghetti Editor`
  - full graph authoring
- `Pasta Path`
  - condensed temporal/history surface
- both should describe the same build from different viewpoints
- scrubbing the path should sync back to `Spaghetti`
  - not just change geometry silently
- if the user selects a step in `Pasta Path`, it should be easier to find the relevant graph logic behind it

#### Useful first mapping rule

- do not expose raw every-node history as the default
- that will probably be too noisy
- use a mixed grouped abstraction layer
  - cleaner than raw nodes
  - more honest than a totally fake feature list
- keep mapping deterministic so the same graph reads as the same timeline unless the graph meaningfully changes

#### Debugging and rollback value

- this feature is not only for presentation
- it would be genuinely useful for:
  - debugging bad outputs
  - understanding branch contributions
  - inspecting earlier accepted states
  - teaching/explaining how a design is built
- rollback should be partial evaluation
  - not destructive mutation of the graph

#### Architecture suggestions

- accepted graph/build results should be the stable history foundation
- do not treat every transient preview gesture as permanent history truth
- keep `Pasta Path` derived from the same accepted build state the rest of the app trusts
- highlight sync between:
  - `Pasta Path`
  - `Spaghetti`
  - viewport result state
  should be part of the real value, not an afterthought

#### Good first non-goals

- full direct timeline editing on day one
- drag-reorder of graph logic from the timeline
- pretending the graph is fully linear when it is not
- giant tall card-based timeline UI
- destructive rollback that mutates the authored graph

#### Small possible rollout

- `v1`
  - slim read-only `Pasta Path` mode
  - deterministic grouped left-to-right timeline
  - one scrub playhead with filtered model-state render
  - sync/highlight back to `Spaghetti`
- `v2`
  - smarter branch-row presentation
  - better grouped step labeling
  - stronger debug/inspect affordances
- `v3`
  - richer rollback inspection
  - maybe selective branch expansion
  - later carefully chosen edit affordances if the derived mapping proves stable

### [ ] - [07] - Manufacture / CAM / G-code mode

- ParaHook could eventually have a real `Manufacture` or `CAM` mode that turns authored geometry into machine instructions such as `G-code`
- this should be treated as more than export
  - `Export` saves geometry/data formats
  - `Manufacture` interprets geometry for machining/printing workflows and generates machine-ready output
- the big-picture flow would be:
  - design the part
  - choose machine/process assumptions
  - define setup, tools, and operations
  - preview the toolpath result
  - generate/post the final machine code

#### Why this feels important

- if ParaHook keeps growing into a full CAD workspace, manufacturing needs a home too
- a lot of real work does not stop at:
  - model complete
  - export `STL`
  - done
- users eventually want:
  - process-aware settings
  - setup/origin control
  - repeatable regenerate-and-post workflow
  - machine-specific output

#### Why this should not just live under Export

- `Export` is about describing the model to another tool or format
- `Manufacture` is about planning how the model gets made
- that means this mode should own:
  - process choice
  - stock/setup
  - tools
  - operations
  - postprocessor output
- the emitted `G-code` should be derived output
  - not the source of truth

#### Good first process directions

- useful first supported paths could be:
  - `3-axis mill`
  - `router`
  - maybe later `lathe`
  - maybe later `3D printing` as a separate path even if it also ends in machine code
- first pass should stay disciplined
  - do not try to cover every machine/process family immediately

#### Good first setup controls

- stock size
- units
- origin / work offset
- machine orientation
- safe heights / clearance plane
- maybe later fixtures and clamps

#### Good first tool and operation controls

- tool library basics
  - tool type
  - diameter
  - maybe later flute length / stickout
- first operations:
  - contour
  - pocket
  - drill
  - facing
- first settings:
  - stepdown
  - stepover
  - feed rate
  - plunge rate
  - spindle speed

#### Preview and validation ideas

- this mode needs preview to be useful
- good first preview layers:
  - toolpath lines
  - cut order
  - operation grouping
  - estimated bounds / reach issues maybe later
- later follow-ons:
  - material-removal simulation
  - collision checks
  - time estimate
  - machine-limit warnings

#### Suggested authored-object shape

- this probably wants a real authored project object such as:
  - `Toolpath Job`
  - or `Manufacture Job`
- that job should reference:
  - source geometry
  - process type
  - stock/setup
  - tool definitions
  - operation list
  - post settings
- the user edits the job and regenerates output
- they should not be expected to hand-edit raw generated code as the normal workflow

#### Browser and workspace suggestions

- a manufacture job should probably appear in the Browser as a first-class thing
- useful later views:
  - source part
  - stock/setup
  - tools
  - operations
  - posted output
- this could become its own workspace mode or toolbar family later
- it should feel like:
  - design -> manufacture
  not like one hidden export submenu

#### Architecture suggestions

- keep clear separation between:
  - geometry authoring
  - manufacturing job definition
  - generated/postprocessed machine code
- one geometry model may feed multiple manufacture jobs
  - different machines
  - different tools
  - roughing vs finishing strategies
- regenerate should be normal and expected
- later this could connect naturally to:
  - `Export`
  - `Materials` maybe for process assumptions
  - project file persistence
  - simulation/inspection work

#### Good first non-goals

- full enterprise CAM breadth on day one
- five-axis machining immediately
- complete machine simulation immediately
- every postprocessor format immediately
- treating raw `G-code` editing as the primary workflow

#### Small possible rollout

- `v1`
  - create one `Manufacture Job`
  - choose process, setup, and a few basic operations
  - preview simple toolpaths
  - emit one first `G-code` family through a narrow post path
- `v2`
  - better tool library and operation controls
  - stronger preview and warnings
  - multiple jobs per source model
- `v3`
  - richer postprocessor support
  - more machine/process families
  - later simulation and deeper manufacturing validation

### [ ] - [08] - Enhanced camera controls and saved views like SketchUp

- ParaHook should eventually have stronger camera/navigation tools plus real saved views
- this should feel closer to:
  - SketchUp scenes / saved views for quick recall
  - stronger CAD viewport navigation
  than to only a few temporary camera shortcuts
- the current camera-controls work already handles a lot of input ownership and gesture cleanup
- the next big-picture need is making camera state more reusable, recallable, and project-aware

#### Why this feels important

- once projects get larger, camera control becomes part of design workflow, not just navigation
- users want to:
  - jump back to important angles
  - save presentation views
  - save inspection views
  - quickly explain a model to themselves or someone else
- a good saved-view system also helps:
  - review
  - debugging
  - before/after comparisons
  - later drawings/presentation/manufacture workflows

#### Core direction worth keeping

- camera navigation should stay clean and intentional
- saved views should be first-class project things, not one-session temporary bookmarks
- each saved view should probably preserve at least:
  - camera position
  - target / focus point
  - projection mode
  - zoom/distance
  - maybe later section/style/display settings
- view recall should be fast enough that users actually use it while working

#### Good first camera-control improvements

- better `Zoom Extents` / `Fit`
- better `Zoom Previous`
- better orbit target behavior
- more reliable pan/orbit/zoom consistency across surfaces
- clearer view reset and orientation shortcuts
- maybe later a view cube / orientation widget if it fits the rest of the app

#### Saved view ideas

- let the user create named saved views
- useful first actions:
  - save current view
  - rename saved view
  - update saved view from current camera
  - jump to saved view
  - delete saved view
- good first examples:
  - `Front`
  - `Top Iso`
  - `Hook Detail`
  - `Assembly Fit Check`
  - `Presentation 1`

#### Why this should feel SketchUp-like

- SketchUp-style saved views are useful because they feel lightweight and natural
- the user does not have to think in heavy camera-rig terms
- they just save meaningful viewpoints and jump between them
- that is probably the right tone for ParaHook too
  - practical
  - fast
  - project-oriented
  - useful during normal work, not only for rendering

#### Browser and UI suggestions

- saved views could appear in:
  - a `Views` branch in the Browser
  - a small view manager surface
  - maybe later toolbar dropdowns
- useful per-view metadata later:
  - thumbnail
  - projection type
  - created/updated order
  - tags like inspection / presentation / manufacture
- the first cut does not need to be flashy
  - fast recall matters more than visual decoration

#### Workflow value beyond navigation

- saved views could later feed:
  - drawings
  - presentation/export presets
  - exploded assembly communication
  - review checklists
  - manufacture setup references
- one healthy long-range rule:
  - camera state should become reusable project data, not disposable session memory

#### Architecture suggestions

- keep separation between:
  - live camera state
  - command history like `Zoom Previous`
  - durable saved views
- one view should be recallable from multiple surfaces:
  - viewport tools
  - Console commands
  - Browser/view manager
- saved views should not fight the active camera-control/input-owner model
- they should sit on top of that model as durable recall targets

#### Good first non-goals

- cinematic animation paths on day one
- heavy rendering-only camera rigs
- dozens of per-view display overrides immediately
- requiring a complex media/presentation mode before simple saved views exist
- overdesigning the UI before reliable view recall works

#### Small possible rollout

- `v1`
  - save and recall named views
  - basic update/delete flow
  - stronger `Fit` and `Zoom Previous`
- `v2`
  - Browser/view-manager integration
  - projection-aware saved views
  - maybe thumbnails and ordering
- `v3`
  - richer per-view display/section settings
  - later ties into drawings, presentation, and review workflows

### [ ] - [09] - Library / community asset library with GitHub publishing

- ParaHook could eventually have a real `Library` system for reusable 3D models, graph assets, and project-ready building blocks
- later this could grow into a shared/community library where users publish assets to GitHub from inside the app
- this feels very possible, but it should start as a solid asset-package system before it becomes a full community publishing workflow

#### Why this feels important

- once ParaHook is more than a single generator, reusable content becomes a huge force multiplier
- users will want to:
  - reuse their own parts
  - build personal libraries
  - share models with other users
  - install community-made assets
  - version and improve existing assets over time
- this would make ParaHook feel more like a platform than a one-project-at-a-time tool

#### Core direction worth keeping

- start with a local `Library`
- then support shared git-backed libraries
- then add an in-app publish/install flow later
- that ordering matters because the hardest problem is not "can GitHub host files"
- the real problem is defining one honest asset/package format first

#### What a library item should probably contain

- one library item should be a real package, not a random loose model dump
- useful package contents:
  - metadata
    - name
    - author
    - version
    - tags
    - description
    - license
    - thumbnail
  - source truth
    - project file
    - spaghetti graph
    - ParaHook-native asset format later
  - optional derived outputs
    - `STEP`
    - `STL`
    - `GLB`
    - preview images
- that gives users something reusable and inspectable instead of just a mesh file graveyard

#### Why GitHub is a realistic backend

- GitHub is already good at:
  - version history
  - collaboration
  - pull requests
  - forks
  - public/private hosting
- so a good later model is:
  - ParaHook prepares the asset package
  - ParaHook writes it into a library repo
  - ParaHook can commit/push/pull
  - maybe later ParaHook can open PRs automatically

#### Local-to-community ladder

- `local library`
  - save and install reusable assets from the local machine
- `git-backed library`
  - sync a library repo with git/GitHub
- `community library`
  - browse, publish, update, and install community assets from inside the app

That is probably a healthier progression than trying to start with the full public marketplace flow immediately.

#### Good first library actions

- save current asset to library
- install/import asset from library
- update existing library asset
- duplicate/fork asset into current project
- view asset metadata
- maybe later pin favorite or recent assets

#### Browser and UI suggestions

- a library probably wants its own top-level surface or mode
- useful views:
  - local assets
  - project-linked assets
  - shared/community assets later
- useful first browsing controls:
  - search
  - tags
  - thumbnail/list toggle
  - sort by updated / name / author
- install should feel lighter than "open a full project"
  - more like adding reusable content into current work

#### Publish flow ideas

- a later in-app publish flow could look like:
  - select asset
  - validate package
  - choose repo/library target
  - add metadata
  - commit/push or open PR
- safer first rule:
  - prefer PR-based or reviewable publish flows over silent direct writes to shared public repos

#### Architecture suggestions

- keep separation between:
  - project content
  - library asset package
  - installed instance inside a project
- one library asset may later be:
  - inserted by value
  - referenced by package id
  - forked into local editable project content
- asset dependencies need honest handling
  - if an asset depends on references, materials, or graphs, that should be explicit in the package
- do not make GitHub the source of truth for the asset definition format
  - GitHub is the transport/collaboration layer
  - ParaHook should still own the package contract

#### Trust and moderation questions for later

- public library flows eventually need answers for:
  - author identity
  - license clarity
  - package validation
  - unsafe/broken asset handling
  - version compatibility
- that is another reason to start with:
  - local library first
  - Git-backed publishing second
  - broad community browse/publish later

#### Good first non-goals

- full public marketplace on day one
- direct anonymous uploads with no review path
- solving every dependency/versioning problem immediately
- making community assets the only way to reuse content
- giant cloud-infrastructure work before the package format is stable

#### Small possible rollout

- `v1`
  - local library asset package format
  - save/install/update reusable assets locally
  - metadata plus thumbnail support
- `v2`
  - git-backed library repo support
  - pull/push/update flows
  - maybe GitHub auth and repo targeting
- `v3`
  - in-app community browsing/publish flow
  - PR-based publish/update workflow
  - later ratings, discoverability, and richer community metadata

### [ ] - [10] - ParaHook Genie: `Mr. Noodle` AI assistant and master weaver

- ParaHook could eventually have a graph-native AI assistant represented by an in-app mascot such as `Mr. Noodle` / `Pesto`
- the important product idea is not just "chat inside CAD"
- the important idea is:
  - natural language in
  - real `Spaghetti` graph authoring out
- the Genie should act as a bridge between the user and the graph editor by:
  - adding nodes
  - wiring inputs
  - tuning parameters
  - explaining what it changed
  - helping debug broken or non-manifold logic

#### Core direction worth keeping

- the AI should author the graph, not merely hallucinate geometry
- that means the assistant should work against real project structures:
  - nodes
  - edges/wires
  - parameters
  - references
  - maybe later layers/materials/export/manufacture objects
- this is much stronger than a generic copilot chat bubble because the result is inspectable and editable inside ParaHook's native authoring system

#### Why this feels important

- ParaHook is already graph-native, which makes it a better fit for AI-assisted construction than tools that only emit opaque mesh results
- a user should be able to say things like:
  - "make this hook thicker and shorten the toe"
  - "add a filleted mounting plate with four holes"
  - "mirror this branch and keep the left and right legs linked"
  - "why did this path stop producing manifold output?"
- the Genie then translates that into real graph changes instead of hand-wavy advice only

#### What the assistant should be able to do

- generate a first-pass graph from a prompt
- edit an existing graph safely
- explain a graph in normal language
- suggest fixes when a graph fails
- point to which nodes or parameters matter most
- maybe later:
  - build study candidates
  - suggest materials/layers
  - help set up export/manufacture flows

#### Why a mascot can help

- the `Mr. Noodle` / `Pesto` persona gives the assistant a distinct product identity instead of feeling like a generic embedded chatbot
- useful tone:
  - self-aware
  - slightly silly
  - geometry-obsessed
  - "al dente logic" and manifold-health focused
- but the mascot should support the tool, not replace clarity
- one useful rule:
  - personality should be optional flavor layered on top of solid graph-authoring behavior

#### Sign-in and AI-provider direction

- a `Sign in with ChatGPT` or similar account-linked flow could be attractive if it lets the user bring their own AI plan
- that would reduce the need for ParaHook to fully subsidize heavy ongoing model usage
- but the app should not depend on one provider forever
- healthier long-range rule:
  - keep the Genie product surface provider-flexible
  - let the graph-authoring contract stay ParaHook-owned even if the backend model changes later

#### Good first interaction model

- one prompt box or command surface
- one clear review/apply flow
- before major graph edits, the Genie should show:
  - what it plans to change
  - which nodes/params it will touch
  - what new nodes/wires it will create
- after applying changes, the user should be able to:
  - inspect the exact graph edits
  - undo them
  - ask follow-up refinement questions

#### Architecture suggestions

- keep a hard separation between:
  - natural-language interpretation
  - graph-edit intent
  - actual graph mutation
- the assistant should ideally emit a structured graph-edit plan, not only freeform text
- that would make the system easier to:
  - validate
  - diff
  - preview
  - undo
- a good rule is:
  - the AI proposes graph edits
  - ParaHook validates and applies them through its own authored graph rules

#### Debugging and education value

- this assistant could be useful even when it is not generating new content
- it could also:
  - explain what a graph is doing
  - identify dead branches
  - explain likely manifold failures
  - point out redundant nodes
  - help new users understand the editor faster
- that makes it both:
  - a builder
  - and a teacher/debugger

#### Good first non-goals

- fully autonomous silent graph mutation with no review
- one-click "design the whole product" magic
- personality/comedy being more important than reliable edits
- hard-coupling the entire feature to one AI provider forever
- pretending the assistant can bypass the actual graph/model validity rules

#### Small possible rollout

- `v1`
  - prompt-to-graph draft generation for simple cases
  - graph explanation and parameter-edit suggestions
  - explicit review/apply flow
- `v2`
  - graph edit plans that add nodes, wires, and parameter changes in one structured action
  - better debugging/explanation for failed outputs
  - mascot/persona polish
- `v3`
  - deeper graph-native collaboration
  - multi-step refinement sessions
  - later provider/account flexibility and broader project-surface awareness

### [ ] - [11] - `Al Dente` real-time stress analysis / proxy-FEA

- ParaHook could eventually have a lighter-weight structural feedback mode that acts more like real-time proxy analysis than full engineering-grade FEA
- this should stay distinct from `[03] Generative Design`
  - `Generative Design` explores candidates and constraints
  - `Al Dente` gives immediate visual structural feedback on the current design
- the core idea is:
  - show a live heat-map style read of likely weak vs strong areas
  - make it useful early, fast, and understandable

#### Why this feels important

- many users do not need full solver-heavy engineering workflows for every iteration
- they do need fast feedback like:
  - "this bracket neck is too thin"
  - "this arm is likely to flex too much"
  - "this print will probably snap here"
- that is especially valuable for:
  - 3D printing
  - quick bracket iteration
  - hook/accessory design
  - early design sanity checks before deeper simulation

#### Core metaphor worth keeping

- weak or overloaded regions can go `Soggy`
  - softer/gray/cool or otherwise visually weak
- stronger regions can stay `Al Dente`
  - firm/yellow/healthy
- the metaphor should help readability, not replace clarity
- a user should still be able to read:
  - low confidence / weak
  - medium concern
  - healthy / strong

#### Good first product shape

- treat this as a `Pressure` / `Strength` / `Stress Preview` kind of tool
- the user should be able to:
  - select a body or object
  - click a face/region
  - apply a simple directional force or pressure proxy
  - see a quick visual read of likely stress concentration / weakness
- this is less about exact engineering correctness on day one
- it is more about immediate structural intuition

#### UX ideas worth keeping

- a face-click `Pressure` tool is a strong first interaction
- useful first inputs:
  - force direction
  - relative force amount
  - maybe material/profile assumption
  - maybe fixed/support region selection later
- useful first outputs:
  - heat map on the part
  - weak-point highlighting
  - thin-region warnings
  - simple pass/warn/fail read

#### Why this is different from full FEA

- this should be:
  - fast
  - approximate
  - interactive
  - helpful during modeling
- it should not pretend to be:
  - certification-grade simulation
  - full materials/contacts/mesh workflow
  - detailed nonlinear engineering truth
- a healthy rule is:
  - use it for direction and design sanity
  - not final engineering signoff

#### Why it matters for printing

- one of the strongest early use cases is printability and break-risk intuition
- before the user exports/slices, ParaHook could warn:
  - thin neck
  - likely snap point
  - weak cantilever
  - overstressed transition
- that makes the tool immediately useful even without a full manufacturing stack

#### Mr. Noodle tie-in

- `Mr. Noodle` could make this more fun without making it fake
- examples:
  - react when a part gets too soggy
  - warn when a bracket is about to become structurally silly
  - explain why one area is risky in normal language
- but the visual analysis itself should still stand on its own without requiring the mascot

#### Architecture suggestions

- keep this separate from full generative/simulation infrastructure
- a first proxy system could derive from:
  - thickness
  - unsupported span length
  - local cross-section changes
  - simple user-applied load assumptions
  - maybe later material presets
- one good rule:
  - if deeper simulation ever arrives later, this proxy tool should still remain the fast everyday preview layer

#### Good first non-goals

- full mesh-based FEA pipeline on day one
- exact engineering certification numbers
- pretending proxy results are exact stress values
- every material model and boundary condition immediately
- huge solver wait times that kill iteration speed

#### Small possible rollout

- `v1`
  - face-based `Pressure` tool
  - thickness/span-aware proxy heat map
  - simple weak/healthy visual feedback
- `v2`
  - support-region selection
  - better heuristics and warnings
  - clearer print-focused failure hints
- `v3`
  - richer proxy metrics
  - later optional bridge to deeper simulation or study tooling

### [ ] - [12] - Kitchen Browser and room-code collaboration system

- ParaHook could eventually have a dedicated collaborative lobby system for live shared modeling sessions
- this should feel like a `Kitchen Browser` for pair-cooking / group-cooking on parametric models
- the key user-facing idea is low-friction room-based collaboration:
  - host a live workspace
  - get a short room code like `PASTA-12`
  - friends type the code and join instantly

#### Why this feels important

- collaboration usually has too much friction when it starts from:
  - giant invite URLs
  - manual file passing
  - unclear host/join flows
- a room-code system is strong because:
  - it is easy to say aloud
  - it works well over Discord/voice/chat
  - it feels lightweight enough for spontaneous sessions
- this would make ParaHook feel more like a real collaborative workspace instead of only a solo design tool

#### Core direction worth keeping

- collaboration should bridge `Offline` and `Online`, not replace local-first work
- default state should stay local/offline
- the user explicitly chooses when to go live
- that creates a healthy model:
  - local by default
  - live when invited
  - local again when the session ends

#### Room-code ideas

- every live session gets a short readable code
- examples:
  - `PASTA-12`
  - `BOLT-88`
  - `PENNE-9`
  - `MAC-01`
- the code should map to the actual backend room/session id
- users should be able to:
  - host kitchen
  - join kitchen
  - maybe browse public kitchens later

#### Privacy and permission model

- useful first room modes:
  - `Open Kitchen`
    - public/listed
    - anyone can watch or help
  - `Locked Kitchen`
    - private/password protected
    - maybe later encrypted session data
  - `Offline`
    - local-only default state
- this gives a healthy product ladder from solo work to trusted collaboration to public/demo sessions

#### Offline -> online migration

- a strong idea here is:
  - user works locally
  - user clicks something like `Fire up the Stove`
  - local project state becomes a live shared room
- that should feel like a clean promotion of existing work, not like starting over in a special multiplayer-only mode
- if the live layer uses a CRDT or similar shared-state model, the app can keep collaboration resilient while still respecting local authorship

#### Online -> offline migration

- the reverse direction matters just as much
- user should be able to:
  - stop the live session
  - pull the current shared state back down
  - save a local `.parahook` file or equivalent
- your `Save Leftovers` concept is strong because it makes collaboration feel safe instead of ephemeral

#### Multiplayer presence ideas

- each collaborator could appear as a distinct pasta avatar
  - `Farfalle`
  - `Rotini`
  - `Rigatoni`
- presence should be useful, not just cosmetic
- good first signals:
  - who is in the room
  - who is editing what
  - where someone is focused
  - maybe later camera-follow/spectate

#### Conflict and editing suggestions

- node locking or "busy" state is a strong first anti-chaos rule
- if one user is editing a node, it can show as:
  - busy
  - owned
  - temporarily locked
- that prevents food fights without needing full pessimistic locking everywhere
- a good rule:
  - avoid global freezing
  - prefer local ownership cues around the specific node/object being edited

#### Follow the Chef

- a `Spectate` / `Follow the Chef` mode would be genuinely useful
- good use cases:
  - teaching
  - review walkthroughs
  - pair debugging
  - presentations
- this could sync:
  - viewport camera
  - maybe later selected nodes/object focus
  - maybe later active tool context

#### Why room codes are a UX win

- telling someone "join `BOLT-88`" is much easier than sending a giant encoded link
- it also sets up later mobile/tablet workflows nicely
- if ParaHook ever gets phone/tablet/AR companion views, short codes make join flows dramatically easier

#### Under-the-hood direction

- a lightweight room/broker server could map the short code to the real room/session id
- the shared backend should mostly broadcast:
  - graph edits
  - parameter changes
  - selection/presence updates
  - maybe camera/pointer state for spectate
- each client should still render geometry locally
- that keeps collaboration lighter and avoids shipping fully rendered scene state over the wire

#### Architecture suggestions

- keep separation between:
  - local project file/state
  - shared room state
  - presence/session metadata
- one healthy rule:
  - collaboration should share authored changes, not raw rendered frames
- if CRDT-based sync is used, ParaHook still needs clear ownership rules around:
  - busy edits
  - merge visibility
  - session start/stop
  - local save/export boundaries

#### Good first non-goals

- huge always-online cloud-first rewrite
- anonymous chaotic editing with no presence/ownership cues
- streaming rendered pixels instead of syncing real authored changes
- solving every enterprise permission role on day one
- making online mode mandatory for ordinary work

#### Small possible rollout

- `v1`
  - host/join by room code
  - local project goes live into one shared room
  - presence list plus basic busy-node indicators
- `v2`
  - public/open vs locked room modes
  - `Save Leftovers` local pull-down flow
  - spectate / follow-host camera
- `v3`
  - richer Kitchen Browser
  - better multiplayer presence and moderation
  - later mobile/tablet companion join flows

### [ ] - [13] - Drawings / documentation

- ParaHook could eventually have a real `Drawings` or `Documentation` workflow that turns modeled content into readable production-style sheets
- this should be more than just exporting screenshots or dumping geometry into another app
- the goal is to let the user communicate design intent clearly through:
  - orthographic views
  - dimensions
  - annotations
  - notes
  - printable/exportable sheets

#### Why this feels important

- once a part or assembly is designed, someone still needs to:
  - inspect it
  - review it
  - manufacture it
  - share it with another human
- drawings are one of the clearest bridges between CAD authoring and real-world communication
- they also help ParaHook feel more like a complete CAD system instead of only a modeling workspace

#### Core direction worth keeping

- drawings should be derived from the model, not disconnected manual artwork
- if the model changes, the drawing should be able to update
- that means the drawing system should reference real project entities:
  - parts
  - assemblies
  - saved views maybe later
  - dimensions/metadata where possible
- the output should stay understandable even if the source is graph-native

#### Good first drawing types

- single-part orthographic sheet
- front/top/right views
- isometric view
- detail view maybe later
- section view maybe later
- exploded assembly sheets later if assembly support exists

#### Good first annotation features

- linear dimensions
- angle dimensions
- diameter/radius callouts
- hole notes maybe later
- title block
- notes text
- revision / author / date metadata later

#### Why this matters beyond manufacturing

- drawings are not only for shops
- they are also useful for:
  - design review
  - documentation
  - collaboration handoff
  - teaching
  - library assets
  - presentation packs
- even a lightweight first sheet system would make ParaHook outputs much more communicable

#### Relationship to saved views and camera tools

- saved views could later become useful inputs for drawing generation
- a healthy long-range relationship is:
  - camera tools help define useful viewpoints
  - drawings turn selected viewpoints into durable documented outputs
- this means `[08]` enhanced saved views and `[13]` drawings can reinforce each other

#### Browser and UX suggestions

- drawings should probably be first-class project objects
- useful Browser structure later:
  - `Drawings`
  - one row per sheet
  - maybe nested views/annotations under each sheet
- the user should be able to:
  - create a sheet
  - choose source part/assembly
  - place standard views
  - add dimensions/notes
  - export/print

#### Architecture suggestions

- keep separation between:
  - model/source geometry
  - drawing sheet definition
  - exported document output
- one useful rule:
  - a drawing should store layout and annotation intent, not duplicate the model geometry as unrelated static art
- if the model changes, the drawing should be able to detect:
  - still valid
  - needs refresh
  - broken references

#### Good first non-goals

- full enterprise drafting standard support on day one
- every annotation type immediately
- solving all sheet-template standards immediately
- giant publishing suite before simple useful sheets exist
- treating screenshots as the same thing as drawings

#### Small possible rollout

- `v1`
  - create a drawing sheet from one part
  - place a few standard views
  - add basic dimensions and notes
  - export/print
- `v2`
  - model-update awareness
  - better annotations and title-block metadata
  - section/detail views
- `v3`
  - assembly drawings
  - exploded or instruction-style sheets
  - later tighter links to saved views, collaboration, and manufacture flows

### [ ] - [14] - Parameter manager

- ParaHook could eventually have a dedicated `Parameter Manager` for the important values that drive a project
- this would give the user one place to see and edit the meaningful named parameters behind the graph instead of hunting across many nodes
- for a graph-native CAD system, this feels like one of the clearest missing "maturity" surfaces

#### Why this feels important

- as projects grow, the real design logic often lives in a handful of important variables:
  - width
  - thickness
  - hook depth
  - hole spacing
  - material allowance
- if those values are scattered across many nodes, iteration gets slower and understanding gets harder
- a parameter manager gives the user a more top-down control surface for the project

#### Core direction worth keeping

- parameters should be first-class project things, not only anonymous values buried inside node UIs
- useful first kinds of project parameters:
  - numeric values
  - booleans
  - maybe enums/options later
  - maybe formulas/expressions later
- a healthy rule:
  - graph nodes can still own many local values
  - but the important reusable/project-wide values should be promotable into named parameters

#### Good first user actions

- create named parameter
- rename parameter
- edit value
- change units maybe later
- link a node input to a named parameter
- inspect where a parameter is used
- remove or relink a parameter safely

#### Why this is useful beyond convenience

- this is not just a nicer spreadsheet
- it helps with:
  - design intent clarity
  - reuse
  - configurations later
  - AI-assisted editing
  - documentation
  - collaboration handoff
- if someone opens a project and can immediately see the key 12 parameters, the design becomes much easier to understand

#### Relationship to the graph

- the graph remains the source of authored construction logic
- the parameter manager is a higher-level control surface over important values inside that graph
- one useful rule:
  - the manager should not become a fake second graph system
  - it should expose and organize parameter truth that already matters to the graph

#### Good first parameter metadata

- name
- current value
- type
- unit maybe later
- description/notes
- usage count
- maybe later grouping/category like:
  - dimensions
  - mounting
  - print settings
  - style

#### Formula and dependency ideas

- later this could support expressions such as:
  - `hook_width = base_width * 0.6`
  - `hole_offset = thickness + 2`
- that would make the manager much more powerful
- but the first cut should probably focus on:
  - stable named values
  - usage mapping
  - safe editing

#### Browser and UI suggestions

- this could live as:
  - a dedicated manager panel
  - a Browser branch
  - maybe both later
- useful first views:
  - all parameters
  - only promoted/project parameters
  - grouped categories later
- one especially useful action:
  - click a parameter and highlight which nodes/inputs consume it

#### Architecture suggestions

- keep separation between:
  - project parameter definitions
  - graph input bindings/usages
  - evaluated runtime values
- parameter edits should remain easy to:
  - diff
  - undo
  - inspect
- this system should later connect naturally to:
  - configurations/variants
  - AI graph editing
  - generative studies
  - drawings/documentation

#### Good first non-goals

- full Excel-inside-CAD complexity on day one
- every possible type and formula feature immediately
- replacing node-local values everywhere
- giant dependency solver before simple named parameters exist
- hiding the real graph logic behind a fake spreadsheet-only layer

#### Small possible rollout

- `v1`
  - create and edit named project parameters
  - bind node inputs to them
  - show usage locations
- `v2`
  - better grouping/metadata
  - safer relink/remove behavior
  - clearer graph highlight integration
- `v3`
  - formulas/expressions
  - later ties into configurations, AI assistance, and studies

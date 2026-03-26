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

# ParaHook Vision Roadmap

## Doc Header

### Doc History
1. 2026-03-11 13:15: Added explicit prefix-and-phase labels across the rough lane draft, using canonical ids where they already exist and visible `Phase TBD` markers where the vision lane is real but the family/phase numbering is not locked yet
2. 2026-03-11 13:11: Added a compact core data-flow section, strengthened the `OutputPreview` wording, clarified the Lane `[1]` finish condition, split the distance read into `Tier 1` versus `Tier 2`, and added a lightweight contracts/IR note without turning the vision doc into an implementation spec
3. 2026-03-11 12:43: Added a rough first-pass lane-and-phase completion draft so this vision doc now also shows the major work clusters still needed to reach the long-term product, including Browser, node/wire, part, build-contract, Jake-mode, and cleanup lanes
4. 2026-03-11 12:34: Rebuilt this file as the canonical big-picture vision and decision-check surface so the execution roadmap can stay sequencing-focused while major Codex decision questions can be checked against one stable north-star doc

### Purpose

This file is the big-picture direction check for ParaHook.

Use it for:
- judging whether a proposed decision moves toward or away from the intended product
- keeping long-range product and architecture intent visible while shorter execution plans change
- checking Codex decision questions against one stable north-star surface before locking a local answer

Do not use it for:
- detailed phase sequencing
- task-by-task implementation planning
- proof of what already shipped

### Relationship To Other Planning Docs

- `docs/Human-Plans/roadmap/roadmap.md`
  - the execution-order roadmap
  - use it for what should happen next and in what order

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - the product and architecture direction surface
  - use it for "what kind of app are we trying to become?"

- `docs/Phase-Plans/...`
  - the detailed planning and implementation-question surfaces
  - use them when a direction is already chosen and the next step is to lock execution details

### Scope Note

This file should stay more stable than `roadmap.md`.

If `roadmap.md` is about near-term ordering, this file is about the destination and the guardrails that should shape those local choices.

## Doc Body

### North Star

ParaHook is aiming to become a graph-native CAD workspace in the browser.

The long-term target is not just "a foothook generator with more options."

The long-term target is:
- a node-based parametric CAD environment
- where graphs author real component logic
- where multiple graphs can live inside one project
- where graph outputs can publish upward into a real Browser/project content hierarchy
- and where the worker/build pipeline becomes graph-native instead of being forced through legacy product-specific request shapes

### Product Vision

The product should eventually feel like:
- a graph editor for authoring geometry and part logic
- a Browser/project workspace for understanding graphs, components, objects, assemblies, and parts
- a shared 3D viewer for inspecting the current project content
- a deterministic build pipeline that turns authored graph truth into geometry and exportable outputs

The intended app is closer to:
- "node-based CAD studio"

than to:
- "one special-purpose product configurator with a graph panel attached"

### Core Data Flow

The intended top-level data flow is:

```text
GraphDocument
   ->
Compile / Evaluate
   ->
Graph Runtime Memory
   ->
Graph Output Declaration
   ->
Project Composition
   ->
Viewer Presentation
```

Roughly, that corresponds to:
- `SP - Phase 9`
  - graph documents and graph-owned authored/runtime seams
- `SP - Phase 10`
  - graph-aware routing and graph output handoff
- `GE - Phase 12` / `SP - Phase 11`
  - project composition, Browser hierarchy, and graph collection ownership
- later viewer/workspace phases
  - presentation, visibility, reference context, and richer inspection

This is useful because it shows the intended flow of truth:
- authored graph truth first
- derived runtime/output truth second
- project/browser composition third
- viewer presentation last

not the other way around

### What Must Stay True

#### 1. Graph-Native Truth

- Graph-authored state is the intended long-term source of truth for graph-native work.
- Graph-local compile/build/preview state should stay attached to graph identity whenever possible.
- Avoid creating new app-global runtime buckets when graph-local or project-local ownership is the more honest home.

#### 2. General CAD Direction, Not Permanent Foothook Lock-In

- The current foothook, baseplate, toe hook, and heel kick seams are acceptable as transitional scaffolding.
- They should not become the permanent architecture of the app.
- Prefer registry, schema, IR, template, and contract solutions over product-specific branching in shared layers.

#### 3. Real Browser / Project Hierarchy

- The Browser should grow toward a real project-content hierarchy, not remain a dressed-up flat parts list.
- The long-range direction is:
  - `Project File -> Assemblies -> Components / Objects -> Parts`
- First passes may stay simpler, but they should not block that direction.

#### 4. Explicit Output Handoff

- Graph outputs should be declared and handed off explicitly.
- `OutputPreview` is the first pass of the graph-owned output declaration surface.
- It should keep pointing toward graph-owned published outputs instead of staying a vague viewer-only trick forever.
- Output structure should become clearer over time, not more implicit.

#### 5. Build And View Are Different Systems

- Build/generate controls are not the same thing as visibility/material/presentation controls.
- Viewer-only changes should remain rebuild-free whenever possible.
- Geometry truth should stay out of viewer presentation state.

#### 6. Shared Services, Local Ownership

- A shared worker, shared viewer, and shared dispatcher are all fine.
- What matters is that routed state and accepted results stay tied to explicit graph or project identity.
- Shared service does not mean shared truth.

#### 7. Generic Node / Editor Surfaces

- Node UI should remain registry-driven and template-driven as much as possible.
- `NodeView`, port rendering, feature-stack presentation, selectors, and contracts should stay generic where possible.
- Avoid solving new node families by building one-off special panels when the node system itself should own the behavior.

#### 8. Contracts / Schema / IR Discipline

- ParaHook relies heavily on schema, contracts, and intermediate representations to stay deterministic and evolvable.
- Node registry contracts, compile IR, worker request/result shapes, routing identity, and output declaration seams should stay explicit.
- Prefer clear typed seams over implicit reach-in behavior between app, graph, worker, and viewer layers.

#### 9. Legacy Removal Must Happen By Replacement

- Transitional compatibility seams are allowed.
- Permanent dependency on those seams is not the goal.
- Do not deepen the `Legacy` versus `Spaghetti` split or the `BoxParams` bridge unless it clearly helps the migration toward the graph-native path.

### Desired End State

#### Product Shape

- A user can author geometry through nodes, features, and graph composition rather than only fixed product forms.
- A graph can represent more than the original foothook family.
- Multiple graphs can coexist inside one project without collapsing back into one active singleton mental model.
- The Browser can explain the project structure, not just launch a graph.

#### Architecture Shape

- `GraphDocument` and later `ProjectFile` ownership are explicit.
- Graph outputs publish upward into a project-facing structure.
- Worker request/result contracts are graph-native.
- Compile/build/preview memory is routed by explicit identity.
- Viewer presentation reads from explicit project/graph output surfaces instead of ad hoc global buckets.

#### User Experience Shape

- The user can browse project content, open graphs, edit nodes, inspect outputs, and build deterministic geometry from one coherent workspace.
- The Browser, editor, worker, and viewer feel like coordinated parts of one system rather than separate modes stitched together.
- The graph-native path becomes good enough that the old legacy path can be removed.

### Decision Filter

When Codex asks a major decision question, prefer the option that:
- makes graph-native ownership clearer
- reduces hidden singletons or app-global runtime truth
- strengthens deterministic compile/build contracts
- preserves multi-graph and later project-file growth
- uses registry/template/schema/IR patterns instead of product-specific branching
- keeps build controls separate from view controls
- moves Browser/project hierarchy closer to the intended content model
- removes future legacy debt instead of adding more

Be cautious when an option:
- introduces another global output bucket
- hard-codes foothook/baseplate/toe-hook/heel-kick assumptions deeper into shared contracts
- treats viewer presentation state as geometry truth
- conflates build state with visibility state
- locks the Browser into a flat parts-list mental model
- solves a generic node/editor problem with a custom one-off UI branch
- deepens `BoxParams` or `Legacy` mode as if they are the long-term core

### First-Pass Guardrails

These are good early-phase constraints, not signs that the vision is shrinking:

- do not force final assembly/package/export semantics before graph output handoff and project ownership are ready
- do not force richer materials/reference/control systems into the first Browser foundation pass
- do not treat the first `OutputPreview` shape as the final long-term output model
- do not delete legacy workflow pieces before the graph-native path genuinely replaces them
- do not mistake a temporary compatibility bridge for a stable destination contract

### Big-Picture Roadmap Order

#### 1. Finish The Graph-Native Foundation

Near-term work should continue to strengthen:
- graph-aware routing
- graph-local runtime ownership
- graph output handoff
- multi-document and later project ownership
- the first real Browser hierarchy for graphs and outputs

#### 2. Turn Ownership Into A Real Workspace

After the foundations are honest:
- Browser/project content structure should become clearer
- components, objects, parts, and assemblies should become more legible
- build inspection and Browser workspace interactions should mature
- richer visibility and material control can attach to the correct structure

#### 3. Replace Transitional Contracts

Once graph/project ownership is mature enough:
- replace graph-to-legacy request translation with a graph-native worker contract
- remove the long-lived `BoxParams` dependency from graph-native execution
- collapse the app-wide `Legacy` versus `Spaghetti` split when the graph-native workspace can stand alone

#### 4. Expand Capability After The Core Is Honest

Later growth belongs in:
- richer param nodes
- utility nodes
- assembly behavior
- control surfaces
- export depth
- workspace presentation modes
- advanced simulation/pattern/generative systems

### Vision-Completion Draft

This is a rough first-pass map of the major lanes and phases likely needed to reach the full vision.

It is intentionally broader than the current execution roadmap.

Use it to answer:
- what large work groups still exist between the current app and the intended end state
- whether the plan is over-focusing on one lane while another important lane stays invisible

Do not treat this as locked canonical sequencing.

It is a first draft of the full journey.

Label note:
- when a phase line says `Phase TBD`, the work lane is considered real in the vision draft but the canonical family numbering is not locked yet

#### Lane [1] - Graph-Native Foundation And Ownership `[~]`

Purpose:
- finish the ownership transition from one hybrid singleton app path to explicit graph and project truth

Done condition:
- Lane `[1]` is complete when graphs have explicit ownership, graph-local runtime memory, graph-owned output declaration, project-level graph collection ownership, and a first honest graph-aware Browser hierarchy without singleton assumptions.

Phases:
- [x] `SP - Phase 9 - Graph Document Foundations`
    - graph documents
    - viewport binding
    - graph-local runtime prep
- [x] `GE - Phase 11 - Graph Persistence And Save/Load`
    - document persistence
    - cached graph lifecycle
    - editor save/load interaction
- [x] `SP - Phase 10 - Graph-Aware Worker And Preview Routing`
    - graph-aware request identity
    - graph-local preview/build memory
- [ ] `SP - Phase 10C - Graph Output Handoff`
    - graph-owned published output declaration
    - explicit output handoff surface above `OutputPreview`
- [ ] `GE - Phase 12 - Project File And Multi-Document Ownership`
    - project file
    - graph collection
    - cross-graph rules
- [ ] `SP - Phase 11 - Graphs Panel And Nested Parts`
    - first real graph-aware Browser hierarchy

#### Lane [2] - Node, Wire, Driver, And Authoring System Hardening `[ ]`

Purpose:
- make the graph editor itself strong enough to act like a real authoring tool instead of only an architecture shell

Phases:
- [ ] `NI - Phase 6 - Node System Cleanup And Growth`
    - clearer node families
    - better palette/spawn model
    - stronger generic node rendering rules
- [ ] `NI - Phase 7 / Phase 8 - Wire UX And Flow Readability`
    - better wire rendering
    - validation readability
    - optional active-path/read-flow overlays
- [ ] `DR - Phase 13 / Phase 14 / Phase 16 - Driver And Param System Expansion`
    - stronger driver contracts
    - richer param nodes
    - grouped and equation-ready value flow
- [ ] `PT - Phase TBD - Part Node Hardening`
    - stronger part definitions
    - presets/metadata
    - better part-facing inputs/outputs
- [ ] `FS - Phase TBD - Feature Stack Growth`
    - more feature operations
    - better feature diagnostics
    - cleaner feature-stack authoring experience

#### Lane [3] - Browser Workspace And Project Content Structure `[ ]`

Purpose:
- turn ownership rules into a usable graph/project workspace the user can understand and navigate

Phases:
- [ ] `VR / SP - Phase TBD - Browser Workspace Shell And Item Interaction`
    - stronger graph rows
    - selection/focus/reveal behavior
    - better Browser-to-editor coordination
- [ ] `AS - Phase 5 - Browser-Facing Graph Output Structure`
    - `Component / Object / Part` direction
    - clearer Browser-facing output hierarchy
- [ ] `AS - Phase 6 - Project Content Inspection And Build Control`
    - build-state surfaces
    - build bars
    - row-level build controls
- [ ] `VR - Phase 5 - Reference Asset Workspace`
    - external references
    - compare workspace
    - project-vs-reference separation
- [ ] `VR - Phase 6 - Materials And Rich Visibility`
    - row-level visibility/material/selectability controls

#### Lane [4] - Graph-Native Build, Geometry, Assembly, And Export `[ ]`

Purpose:
- replace the transitional build bridge and deepen real CAD/runtime capability

Phases:
- [ ] `GE / SP - Phase TBD - Graph-Native Worker Contract`
    - replace graph-to-legacy translation
    - remove long-lived `BoxParams` dependence from graph-native execution
- [ ] `GE / FS - Phase TBD - Geometry Runtime Growth`
    - stronger runtime operations
    - caching and diagnostics growth
    - more reliable geometry execution depth
- [ ] `AS - Phase TBD - Assembly And Composition Growth`
    - richer output relationships
    - transforms and composition above single parts
    - clearer assembly semantics
- [ ] `EX - Phase 2 / 3 / 4 / 5 - Export Growth`
    - STL / STEP / profile export
    - manufacturing-facing metadata and output packaging
- [ ] `AS / SP - Phase TBD - Build Sequencing And Build Control`
    - per-object/per-part progress
    - staged build behavior
    - stronger build inspection/control surfaces

#### Lane [5] - Product Modes, Control Surfaces, And Simplified Editing `[ ]`

Purpose:
- expose the same canonical model through easier editing layers and more direct manipulation

Phases:
- [ ] `JK - Phase 3 / 4 / 5 / 6 - Control-Viz Driver Bindings`
    - viewport handles bound to canonical drivers
    - plane-constrained interaction rules
- [ ] `JK - Phase 2 - Jake Mode Foundation`
    - simplified editor over Spaghetti-backed truth
    - no second model
- [ ] `JK - Phase 8 - Jake Mode Expansion`
    - curated user-facing controls
    - richer direct-manipulation editing
    - future equation-aware control exposure
- [ ] `VR / SP - Phase TBD - Workspace Presentation Modes`
    - collapsed / essentials / expanded workspace patterns
    - cleaner inspector/panel/tool balance

#### Lane [6] - Ecosystem, Polish, And Final Replacement `[ ]`

Purpose:
- finish the product into a complete studio instead of only a strong core editor

Phases:
- [ ] `VR - Phase TBD - Viewer/Workbench Personality Return`
    - richer gizmo/workbench identity
    - scenes/reference/inspection improvements where still desired
- [ ] `AS / VR - Phase TBD - Advanced Output And Packaging`
    - broader output types
    - later project/export packaging decisions
- [ ] `GE / SP / AS - Phase TBD - Publish / Receive`
    - graph-to-graph publishing/consuming with stable ownership rules
- [ ] `ADV - Phase TBD - Advanced Systems`
    - simulation
    - patterns
    - generative tools
    - deeper solver-style systems if still desired
- [ ] `LEG - Phase TBD - Final Legacy Phase-Out`
    - remove legacy-only UI
    - remove long-lived compatibility glue
    - leave one graph-native workspace path

#### Rough Read On Distance Remaining

Tier 1 - First real graph-native app

Likely remaining shape:
- finish the rest of Lane `[1]`
- land the most important early pieces of Lane `[2]`
- land the first important pieces of Lane `[3]`
- begin the contract replacement work in Lane `[4]`

This is the likely path to:
- a first coherent graph-native working app

Tier 2 - Vision-complete studio

Likely remaining full shape:
- `6 lanes`
- about `25-30` meaningful phase-sized chunks

This is the likely path to:
- the fuller long-range ParaHook studio vision

### The Five Long-Range Pillars

If a future feature does not fit one of these pillars, its placement probably needs another look:

#### 1. Graph Engine

Deterministic graph storage, schema, validation, compile, routing, and migration.

#### 2. Node And Feature Authoring

The registry, node templates, feature stack, param system, and authoring UX that define how geometry logic is expressed.

#### 3. Project / Browser Ownership

The Browser, graph documents, project files, published outputs, and content hierarchy that explain how authored work is organized.

#### 4. Build / Geometry Execution

The worker, runtime IR, geometry generation, build sequencing, diagnostics, and export-facing execution path.

#### 5. Viewer / Workspace Presentation

The shared viewer, visibility/material/reference controls, workspace modes, and inspection surfaces that present results without owning geometry truth.

### Quick Decision Questions

Before locking a major answer, check:
- Does this make the graph-native path stronger or weaker?
- Does this preserve generic node/editor architecture?
- Does this help multi-graph and later project ownership?
- Does this reduce legacy debt or add more of it?
- Is this a temporary bridge or a contract we are about to depend on permanently?
- If this ships, will the Browser/project model become clearer or more confused?

If the answers trend toward:
- more graph-native
- more deterministic
- more ownership-explicit
- more multi-graph-ready
- less legacy-dependent

then the decision is probably moving in the correct direction.

### One-Sentence Compass

Prefer choices that make ParaHook more graph-native, more deterministic, more ownership-explicit, more multi-graph-ready, and less dependent on legacy product-specific bridges.

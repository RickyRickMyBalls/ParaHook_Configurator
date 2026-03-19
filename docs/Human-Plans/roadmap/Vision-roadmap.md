# ParaHook Vision Roadmap

## Doc Header

### Doc History
9. 2026-03-18 21:35: Performed a large cleanup pass to refocus this file as a true vision document, replacing the older lane-and-phase-heavy middle section with cleaner `Core System Shape`, `What Must Stay True`, `Desired End State`, `Major Future Feature Families`, and `High-Level Growth Path` sections while preserving the important product and architecture direction
8. 2026-03-18 21:22: Tightened the vision doc slightly by adding the long-term app-wide `Console` command-language direction into the higher-level `Product Vision` and `User Experience Shape` sections, so that idea now lives in the north-star document instead of only in the detailed console architecture notes
7. 2026-03-16 12:31: Added a short feature-stack direction note under `Architecture Shape` so the vision now explicitly says Feature Stack should not be permanently trapped as embedded part-node data and should leave room for first-class graph/composite ownership later
6. 2026-03-16 12:24: Added a short Replicad rationale under the build/generate section so the vision now explicitly explains why chunk-level row rebuild control, sibling independence, and future `SEQ / ALL` matter given the current engine constraints; also normalized this local `Doc History` block to newest-first numbering with the highest number at the top
5. 2026-03-16 11:13: Compiled the answered `Content`-row reset questions into the vision doc, clarifying the Root/Sub Assembly hierarchy, the `Graph Documents` versus `Content` split, per-row build-chunk policy/execution ownership, `SEQ / ALL` parent execution mode, calmer row-language rules, and the next-lane goal of making `Part` rebuilds real before full `Part` rows land
4. 2026-03-11 13:15: Added explicit prefix-and-phase labels across the rough lane draft, using canonical ids where they already exist and visible `Phase TBD` markers where the vision lane is real but the family/phase numbering is not locked yet
3. 2026-03-11 13:11: Added a compact core data-flow section, strengthened the `OutputPreview` wording, clarified the Lane `[1]` finish condition, split the distance read into `Tier 1` versus `Tier 2`, and added a lightweight contracts/IR note without turning the vision doc into an implementation spec
2. 2026-03-11 12:43: Added a rough first-pass lane-and-phase completion draft so this vision doc now also shows the major work clusters still needed to reach the long-term product, including Browser, node/wire, part, build-contract, Jake-mode, and cleanup lanes
1. 2026-03-11 12:34: Rebuilt this file as the canonical big-picture vision and decision-check surface so the execution roadmap can stay sequencing-focused while major Codex decision questions can be checked against one stable north-star doc

### Purpose

This file is the big-picture direction check for ParaHook.

Use it for:
- judging whether a proposed decision moves toward or away from the intended product
- keeping long-range product and architecture intent visible while shorter execution plans change
- checking major Codex decision questions against one stable north-star surface before locking local answers

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
- an app-wide `Console` that can later evolve into a command language for navigating and acting across workspace, graph, node, and feature domains
- a deterministic build pipeline that turns authored graph truth into geometry and exportable outputs

The intended app is closer to:
- "node-based CAD studio"

than to:
- "one special-purpose product configurator with a graph panel attached"

### Core System Shape

The intended top-level flow of truth is:

```text
GraphDocument
   ->
Compile / Evaluate
   ->
Graph Runtime Memory
   ->
Published Output Declaration
   ->
Project Composition
   ->
Viewer / Workspace Presentation
```

The important direction is:
- authored graph truth first
- derived runtime and published-output truth second
- project/browser composition third
- viewer and workspace presentation last

ParaHook should keep moving toward explicit ownership at each layer instead of hiding more state in app-global buckets or local UI tricks.

### What Must Stay True

#### 1. Graph-Native Truth

- Graph-authored state is the intended long-term source of truth for graph-native work.
- Compile/build/preview memory should stay attached to explicit graph or project identity whenever possible.
- Shared services are fine; shared truth is not.

#### 2. General CAD Direction, Not Permanent Foothook Lock-In

- The current foothook, baseplate, toe hook, and heel kick seams are acceptable as transitional scaffolding.
- They should not become the permanent architecture of the app.
- Prefer registry, schema, IR, template, and contract solutions over product-specific branching in shared layers.

#### 3. Real Browser / Project Hierarchy

- The Browser should grow toward a real project-content hierarchy instead of staying a dressed-up flat parts list.
- `Graph Documents` and `Content` should remain distinct surfaces:
  - `Graph Documents`
    - authoring identity
    - document/build/save/export actions
    - editor routing
  - `Content`
    - published project structure
    - build-chunk structure
    - later policy and execution visibility
- `Content` should not read like a second graph list.
- The longer-range published hierarchy should still leave room for:
  - `Project File -> Root Assembly -> Sub Assemblies -> Components -> Objects -> later Parts`

#### 4. Explicit Output Handoff

- Graph outputs should be declared and handed off explicitly.
- `OutputPreview` is only the first pass of that graph-owned output declaration surface.
- Output structure should become clearer over time, not more implicit.
- The Browser should not infer project hierarchy from final meshes alone.

#### 5. Build And View Are Different Systems

- Build/generate controls are not the same thing as visibility/material/presentation controls.
- Viewer-only changes should remain rebuild-free whenever possible.
- Geometry truth should stay out of viewer presentation state.
- `Content` rows are part of the build/generate surface, not just passive selection rows.
- Replicad is the current worker-side geometry engine, so ParaHook should expose chunked rebuild control instead of pretending one giant opaque rebuild is always trustworthy.

#### 6. Generic Node / Editor Surfaces

- Node UI should remain registry-driven and template-driven as much as possible.
- `NodeView`, port rendering, feature-stack presentation, selectors, and contracts should stay generic where possible.
- Avoid solving new node families by building one-off special panels when the node system itself should own the behavior.

#### 7. Contracts / Schema / IR Discipline

- Node registry contracts, compile IR, worker request/result shapes, routing identity, and output declaration seams should stay explicit.
- Prefer clear typed seams over implicit reach-in behavior between app, graph, worker, and viewer layers.

#### 8. Legacy Removal Must Happen By Replacement

- Transitional compatibility seams are allowed.
- Permanent dependency on those seams is not the goal.
- Do not deepen the `Legacy` versus `Spaghetti` split or the `BoxParams` bridge unless it clearly helps the migration toward the graph-native path.

### Desired End State

#### Product Shape

- A user can author geometry through nodes, features, and graph composition rather than only fixed product forms.
- A graph can represent more than the original foothook family.
- Multiple graphs can coexist inside one project without collapsing back into one active singleton mental model.
- The Browser can explain the project structure instead of only launching a graph.

#### Architecture Shape

- `GraphDocument` and later `ProjectFile` ownership are explicit.
- Graph outputs publish upward into a project-facing structure.
- Worker request/result contracts are graph-native.
- Compile/build/preview memory is routed by explicit identity.
- Viewer presentation reads from explicit project/graph output surfaces instead of ad hoc global buckets.
- Feature Stack should not be permanently trapped as embedded part-node data.

#### User Experience Shape

- The user can browse project content, open graphs, edit nodes, inspect outputs, and build deterministic geometry from one coherent workspace.
- The Browser, editor, worker, viewer, and console feel like coordinated parts of one system rather than separate modes stitched together.
- The `Console` should eventually become part of the same workspace grammar, not just a debug strip, so typed command flows can navigate and act across the app without creating separate mini-command systems per feature.
- The graph-native path becomes good enough that the old legacy path can be removed.
- Browser content interaction should eventually feel execution-aware and traceable without collapsing back into graph-only language.

### Major Future Feature Families

These are the main long-range feature families the product still needs. They are intentionally broader than the execution roadmap and should stay stable even as phase numbering changes.

#### 1. Graph And Project Ownership

- explicit graph documents
- graph-local runtime and published-output truth
- project file and multi-graph ownership
- honest Browser hierarchy above graph outputs

#### 2. Geometry And Feature Authoring

- stronger node families and better node spawning
- richer sketch and feature authoring
- cleaner wire, driver, and param readability
- later feature-stack growth beyond the current thin foundation
- geometry nodes increasingly aligned with a Replicad-like command vocabulary while still packaged as honest graph-native node surfaces

#### 3. Browser And Content Workspace

- calmer, clearer Browser rows
- stronger `Graph Documents` versus `Content` separation
- better reveal, selection, and editor coordination
- richer project/content inspection without collapsing back into graph-only language

#### 4. Build, Geometry Execution, And Publishing

- graph-native worker contracts
- stronger runtime geometry execution and diagnostics
- explicit publish/output structure
- truthful row-level build state and later build control

#### 5. Console And Workspace Grammar

- app-wide command and feedback surface
- layered transcript and routing
- later command-language navigation across workspace, graph, node, and feature domains
- tighter integration between visible tool state and typed command state

#### 6. Control Surfaces And Direct Manipulation

- transform tools that can generalize beyond one feature
- viewport gizmos and direct-manipulation seams
- later Jake-mode style simplified editing over the same canonical graph truth

#### 7. Export, Ecosystem, And Advanced Systems

- richer export depth
- stronger assembly/composition behavior
- later publish/receive behavior
- future advanced systems such as simulation, patterns, and generative tooling

### High-Level Growth Path

The broad maturity order should stay:

#### 1. Finish The Graph-Native Foundation

- strengthen graph-aware routing
- keep runtime/output ownership graph-native
- finish explicit output handoff
- complete multi-document and project ownership

#### 2. Turn Ownership Into A Real Workspace

- make Browser and project structure clearer
- make components, objects, parts, and assemblies more legible
- mature content inspection and workspace coordination

#### 3. Replace Transitional Contracts

- replace graph-to-legacy request translation with a graph-native worker contract
- remove the long-lived `BoxParams` dependency from graph-native execution
- collapse the app-wide `Legacy` versus `Spaghetti` split when the graph-native workspace can stand alone

#### 4. Expand Capability After The Core Is Honest

- richer param and utility nodes
- deeper feature and assembly behavior
- stronger workspace grammar and control surfaces
- broader export and advanced systems

#### 5. Finish Into A Studio, Not Just A Strong Core

- deepen ecosystem and packaging behavior
- add broader advanced systems where they still fit the product
- complete final legacy replacement only after the new path is truly sufficient

### First-Pass Guardrails

These are good early-phase constraints, not signs that the vision is shrinking:

- do not force final assembly/package/export semantics before graph output handoff and project ownership are ready
- do not force richer materials/reference/control systems into the first Browser foundation pass
- do not treat the first `OutputPreview` shape as the final long-term output model
- do not delete legacy workflow pieces before the graph-native path genuinely replaces them
- do not mistake a temporary compatibility bridge for a stable destination contract

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
- turns `Content` into a duplicate `Graph Documents` list
- solves a generic node/editor problem with a custom one-off UI branch
- deepens `BoxParams` or `Legacy` mode as if they are the long-term core

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

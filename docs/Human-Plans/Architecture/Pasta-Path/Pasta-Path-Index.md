# Pasta Path Index

## Doc Header

### Doc History
5. 2026-03-22 14:18: Added `#### Suggestion` blocks under every open `Pasta Path` question, so the new `Questions / Decisions` section now carries concrete recommended answers for placement, scope, mapping, branching, sync, and representation instead of acting only as a neutral question list
4. 2026-03-22 14:15: Added a dedicated `Questions / Decisions` section to the `Pasta Path` index, turning the main unresolved product and architecture choices into explicit `### [ ] qN - ...` checklist-style headings so the concept can be tightened incrementally instead of leaving those decisions scattered implicitly through the vision text
3. 2026-03-22 14:12: Added a `Fusion` visual-takeaways section to the `Pasta Path` index, locking the recommendation that the first timeline surface should borrow the low-profile footer-like density, horizontal step-strip readability, and clear playhead emphasis of a Fusion-style history bar without literally copying its strictly linear feature-stack assumptions
2. 2026-03-22 14:10: Added the first workspace-placement suggestion for `Pasta Path`, locking the direction that it should likely live as another `+/e/-` style surface mode with a slim full-width bottom footprint, using roughly `100px` of height by default and growing vertically only when parallel branch rows are actually needed
1. 2026-03-22 14:06: Created this folder-root architecture index for the new `Pasta Path` family, establishing the umbrella vision for a hybrid parametric history/timeline surface that bridges the `Spaghetti` node graph and a scrub-friendly linear stack while reserving `Future/` and `Shipped/` for later standalone execution and shipped records

### Purpose

This doc defines the umbrella architecture direction for `Pasta Path`.

This file is the umbrella index for the `Pasta-Path` family.

Use it to answer:
- what the `Pasta Path` concept is trying to accomplish
- how it relates to the existing `Spaghetti Editor`
- what the main user-facing timeline mechanics are
- what technical seams are implied by timeline scrubbing and partial evaluation
- how future standalone planning docs under this family should be organized

### Family Structure

Use this folder like this:

- `Pasta-Path-Index.md`
  - umbrella architecture direction
  - concept explanation
  - initial implementation goals
- `Future/`
  - later standalone `Pasta Path` phase or execution docs
- `Shipped/`
  - later shipped records for completed `Pasta Path` cuts

### Concept

`Pasta Path` is a hybrid parametric UI that bridges the gap between:
- the non-linear `Spaghetti` node graph
- a linear history timeline more like Fusion 360

The goal is to let the user collapse complex graph logic into a structured horizontal history stack that can be scrubbed, inspected, and rolled backward without losing the deeper graph underneath.

### Why This Doc Exists

The current `Spaghetti Editor` is good for explicit graph logic, but it is weaker at:
- showing build order as one readable temporal story
- letting the user scrub backward through model generation
- surfacing parallel construction branches in a way that still feels sequential and understandable

`Pasta Path` exists to explore a second authoring/read surface:
- the graph remains the source of truth
- the timeline becomes a condensed execution/history view

## Doc Body

### Vision

A temporal navigation system for ParaHook that collapses complex node logic into a structured, scrub-friendly history timeline.

### Core Mechanics

- `The Scrub`
  - a vertical playhead that allows the user to move backward and forward through the model's construction
- `Parallel Layers`
  - multi-track rows that represent concurrent or branching logic such as left/right mirrored work, mounting logic, or later hardware layers
- `History Rollback`
  - moving the playhead backward suppresses downstream nodes and shows an earlier model state for debugging, inspection, and explanation

### Timeline Direction

The intended surface is a condensed history view:

- graph execution order is flattened into a left-to-right track
- the current model state is determined by a vertical playhead
- only the nodes or steps to the left of that playhead evaluate into the visible model state
- branching graph logic may occupy parallel rows instead of being forced into one misleading single line

### Relationship To Spaghetti

`Pasta Path` does not replace the `Spaghetti Editor`.

Recommended relationship:
- `Spaghetti Editor`
  - source-of-truth graph authoring surface
- `Pasta Path`
  - condensed temporal/history surface
- both surfaces should describe the same underlying build graph from different viewpoints

### Suggested Workspace Placement

Recommended first placement:

- `Pasta Path` should likely be another mode in the same top-left `+/e/-` family
- it should behave more like a slim collapsed/editor-adjacent surface than a full second graph editor
- it should preserve most of the available width so the user can read a long horizontal timeline at a glance

Suggested first shape:

- default height around `100px`
- full or near-full available width
- horizontal reading and scrubbing first
- vertical growth only when parallel branch rows are actually needed

Recommended relationship to the current editor modes:

- full `Spaghetti Editor`
  - best for graph authoring
- slim `Pasta Path`
  - best for temporal reading, scrub, rollback, and branch overview
- model viewport
  - best for seeing the resulting geometry state

This keeps `Pasta Path` close to the current editor-mode system without forcing it to become another full-height authoring surface on day one.

### Fusion Visual Takeaways

The Fusion-style timeline reference is useful as a form-factor guide.

Good principles to borrow:

- very low vertical footprint
- full-width horizontal history strip
- compact icon- or chip-based step presentation
- a strong vertical playhead that reads clearly against the timeline
- clearly separated utility controls versus the main step strip
- footer-like presentation rather than a second tall editor

Important adaptation for ParaHook:

- Fusion assumes a mostly linear feature stack
- `Pasta Path` needs to support graph branching and parallel logic

So the recommended interpretation is:

- keep one condensed primary horizontal strip by default
- allow extra vertical parallel rows only when branch structure needs to be shown
- do not turn the first cut into a tall card-based timeline
- preserve the density and scan speed of a compact footer/history bar

### Boil Aesthetic

The intended visual language is a boil-themed parametric UI:

- `Stock Pot`
  - the toolbar/tool stock for the timeline surface
- `Lasagna Layers`
  - the parallel timeline tracks
- `Al Dente`
  - a validated/healthy model state

This metaphor should stay secondary to usability. It should give the system flavor without making the timeline harder to read.

### Technical Integration

- input
  - multi-output node graph from the `Spaghetti Editor`
- process
  - sequential index mapping from graph nodes into a horizontal coordinate system
- output
  - a scrub-friendly 1D/2D linear interface for temporal model control

### Implementation Goals

1. implement a node-to-timeline mapping algorithm
2. develop a playhead that supports partial graph evaluation
3. create a multi-track UI layout for the timeline footer or another dedicated timeline surface

### First Constraints

The first `Pasta Path` cut should stay disciplined:

- graph remains the source of truth
- timeline is derived, not separately authored
- rollback should be partial evaluation, not destructive graph mutation
- parallel tracks should visualize branching logic without hiding execution ownership
- the first slice should prioritize read/scrub/debug value before deep edit-in-timeline behavior
- the first slice should stay slim by default and only spend more vertical space when branch rows or denser temporal detail genuinely require it

## Questions / Decisions

### [ ] q1 - should `Pasta Path` live as another mode in the same top-left `+/e/-` family, or should it become a separate always-visible footer surface?

#### Suggestion

Start by making `Pasta Path` another mode in the same top-left `+/e/-` family. That keeps it close to the current editor-mode system and avoids committing to a permanently visible footer before the timeline proves its value.

### [ ] q2 - should the first `Pasta Path` cut be read-only and scrub-only, or should it allow direct editing/reordering from the timeline?

#### Suggestion

Make the first cut read-only and scrub-only. Do not allow direct timeline editing or reordering until the graph-to-timeline mapping and rollback behavior are already stable.

### [ ] q3 - what is the first honest graph-to-timeline mapping rule for turning a branching `Spaghetti` graph into one stable left-to-right history strip?

#### Suggestion

Use a deterministic execution-order mapping with one primary left-to-right strip, then place branch-only segments onto parallel rows when they cannot be represented honestly in one condensed track. The first rule should prioritize stability and readability over perfect graph fidelity.

### [ ] q4 - when graph branching exists, should parallel tracks appear automatically, or should the default strip stay single-row until the user expands branch detail?

#### Suggestion

Keep the default strip single-row whenever possible, and only introduce parallel rows when branch structure would become misleading if forced into one line. That preserves the slim footer feel while still allowing honest branch visualization.

### [ ] q5 - what should happen in the model viewport when the `Pasta Path` playhead moves backward: immediate filtered render only, or filtered render plus explicit node/highlight sync in the `Spaghetti Editor`?

#### Suggestion

The first cut should do immediate filtered render plus explicit highlight sync back to the `Spaghetti Editor`. The geometry change alone is useful, but node/highlight sync is what makes the timeline feel connected to its source-of-truth graph.

### [ ] q6 - should the first visible timeline steps be node-level, feature-level, or a mixed grouped abstraction layer above raw graph nodes?

#### Suggestion

Start with a mixed grouped abstraction layer above raw nodes. Pure node-level history will likely be too noisy, while pure feature-level history risks hiding too much of the graph truth. A grouped layer gives the first cut a cleaner readable strip without severing the link back to real nodes.

# Build Path Vision

## Doc Header

### Doc History
1. 2026-04-13 14:46: Created this dedicated `Build Path` vision doc so future `Build Path` phases can stay anchored to one simple north-star concept: graph history should feel like git-style authored diffs backed by accepted checkpoints, letting the user scrub quickly and honestly without silently mutating the authored head

### Purpose

This doc captures the core product and architecture vision for `Build Path`.

Use it to answer:
- what `Build Path` fundamentally is
- why graph history should feel like diffs plus checkpoints instead of a fragile replay-from-zero chain
- what a checkpoint means in plain language
- how historical scrubbing should differ from restoring or editing the authored head
- which core rules future `Build Path` phases should preserve

Do not use it for:
- final schema definitions
- exact checkpoint cadence
- final UI layout details
- low-level cache implementation details
- phase-by-phase implementation checklists

### Relationship To Other Docs

- `build-path-index.md`
  - family umbrella
  - phase ordering
  - ownership split between worker/runtime and workspace-mode UX

- `../Worker/Future/Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`
  - downstream-only rebuild direction that later `Build Path` replay and branch work should respect

- `../Cleanup/Cleanup-Vision.md`
  - repo-shape and ownership-cleanliness north star
  - useful when future phases decide where shared history contracts and runtime ownership should live

## Doc Body

### Why This Doc Exists

`Build Path` can easily drift into three different stories if the family does not have one stable vision doc:
- a timeline UI story
- a worker cache story
- a command history story

All three matter, but none of them alone is the full idea.

The real concept is:
- the user should be able to move through graph history the way transform history already lets them move through transform diffs
- that history should preserve authored meaning, not only raw build output
- that movement should stay fast because the worker/runtime keeps accepted checkpoints that can be restored without replaying the whole project from zero

This doc exists so future `Build Path` phases keep building the same thing instead of gradually turning into unrelated history, cache, or UI work.

### Short Version

`Build Path` should feel like git for the authored graph, backed by worker-owned accepted checkpoints.

The user-facing experience should be:
- every meaningful accepted edit becomes a history step
- the user can scrub those steps quickly
- historical viewing does not silently overwrite the current authored head
- restoring or branching from history is explicit

The runtime truth underneath that experience should be:
- every accepted step records an authored graph diff
- selected accepted steps also become checkpoints
- scrubbing prefers loading a nearby checkpoint and replaying a short diff tail instead of rebuilding the whole graph from the beginning

### Core Concept

The transform history toolbar already proved a useful mental model:
- store small changes
- reconstruct state at any selected step
- let the user scrub through history

`Build Path` should generalize that idea from one transform target to the whole authored graph.

The difference is that graph history is richer than three `vec3` transform deltas.

A `Build Path` history entry may need to describe changes such as:
- node parameter edits
- node creation or deletion
- connection changes
- authored ordering or graph-structure changes
- accepted result identity for what that graph state actually produced

So the correct generalization is not pure diff-only history.

It is:
- graph diff for authored meaning
- accepted checkpoint for fast honest restore

### What A Checkpoint Means

A checkpoint is a save point the system can jump back to quickly.

Plain-language meaning:
- the worker/runtime remembers enough accepted state from that step that scrubbing does not have to recompute everything from the beginning

That does not necessarily mean:
- a giant permanent raw mesh dump for every single step

It more likely means some combination of:
- accepted build bundle identity
- geometry or cache handles
- result metadata
- enough restore information to make that history step quickly viewable again

The point of a checkpoint is speed and honesty:
- speed, because the user can scrub without waiting on a full rebuild chain
- honesty, because the viewed result comes from accepted runtime truth, not a fake approximation

### Build Path History Should Record Two Truths

Future phases should preserve both of these at the same time.

#### 1. Authored Truth

The history step should say what changed in the graph.

Examples:
- `Extrude B.depth` changed from one accepted value to another
- a `Fillet` node was added
- a connection from `Sketch 1` to `Extrude B` was removed

This is what makes `Build Path` feel like meaningful authored history instead of an anonymous pile of cached outputs.

#### 2. Accepted Result Truth

The history step should also say what accepted runtime result that authored change produced.

Examples:
- accepted build bundle identity
- affected build-unit ids
- cache handles or restorable result handles
- result classification such as success, partial reuse, or error

This is what makes fast scrubbing and trustworthy historical viewing possible.

### Hard Rules

Future `Build Path` phases should keep these rules stable unless the family intentionally decides to change them.

1. `Build Path` history should describe accepted authored steps, not transient pointer-drag noise or every frame of preview churn.
2. Scrubbing history should be view-only by default.
3. Viewing an old step and restoring the authored head are different actions.
4. Editing from an old step should create an explicit branch or explicit replacement rule, not silently overwrite history meaning.
5. The worker/runtime should prefer checkpoint-plus-diff restore over replay-from-zero.
6. Authored graph diff and accepted result truth should stay linked in the same history model.
7. Future replay and branch invalidation should respect true graph dependency flow, meaning changed nodes should only force rebuild of their downstream dependents, not unrelated siblings.

### Relationship To Worker 9

`Build Path` is not the same feature as `Worker 9`, but they should agree on the same dependency truth.

`Worker 9` establishes the runtime idea that:
- when one node changes, rebuild should flow through the true downstream dependency cone only
- unrelated sibling branches should stay retained

That matters for `Build Path` too.

When historical restore, replay, or branch-from-history edits happen later, the system should not fall back to broad whole-graph invalidation if the real dependency cone is smaller.

So the family-level alignment is:
- `Worker 9`
  - downstream-only rebuild truth
- `Build Path`
  - history and scrubbing built on top of that truth

### What The User Should Feel

When `Build Path` is working well, the user should feel:
- "I can move through the history of this graph without fear"
- "I am looking at real accepted states, not fake temporary guesses"
- "Scrubbing is fast because the system remembers good restore points"
- "Restoring or branching is a deliberate decision"
- "My history makes sense as authored changes, not only as opaque build artifacts"

The feature should feel closer to:
- a trustworthy graph history navigator

And less like:
- a generic undo list
- a hidden cache debugger
- a timeline that silently mutates live state while the user is only trying to inspect history

### Recommended First Mental Model

If future phases need a one-line framing, use this:

`Build Path` is graph-history scrubbing built from authored diffs plus accepted checkpoints.

If a slightly longer version helps, use this:

`Build Path` should feel like git for the authored graph, while the worker/runtime keeps enough accepted checkpoint truth to make historical scrubbing fast, honest, and non-destructive by default.

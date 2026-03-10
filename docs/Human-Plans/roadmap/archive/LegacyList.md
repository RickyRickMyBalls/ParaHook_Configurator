# Legacy List

## Doc History
1. 2026-03-06 01:32: Added a practical list of legacy seams, dead-end directions, and structural cleanup targets across the app and Spaghetti editor
2. 2026-03-06 01:32: Created the doc

## Purpose

This doc is not a blame list.

It is a cleanup map for:
- dead ends
- half-migrated systems
- compatibility seams
- structural leftovers
- old ideas that should either be removed, finished, or clearly preserved

Some of these were useful experiments.
Some were necessary transition steps.
The goal here is to identify loose ends so the project gets cleaner over time.

## Main Read

The app has a strong modern direction now:
- layered architecture
- worker/runtime separation
- viewer host vs viewer split
- Spaghetti as a graph compiler front-end

But it still carries several "between two worlds" seams:
- old legacy app behavior still lives beside the newer Spaghetti path
- compatibility aliases exist in many places
- some node types look transitional rather than intentional
- some docs/folders now overlap or drift

So the main cleanup need is:
- decide what is permanent
- decide what is transition-only
- remove or isolate the rest

## Likely Dead Ends Or Half-Finished Directions

These are the areas that look like started directions that either changed, stalled, or were only partially absorbed into the current architecture.

### 1. Dual App Mode As A Long-Term Default

Current seam:
- `inputMode = 'legacy' | 'spaghetti'`

Why it looks transitional:
- the app is still carrying two front-ends into the build pipeline
- legacy mode is still a first-class top-level mode in the store and UI
- much of the new architectural work is clearly going toward Spaghetti

What to decide:
- is legacy mode permanent?
- or is it only a transition bridge until Spaghetti is fully capable?

Cleanup need:
- if permanent, document the contract clearly
- if transitional, start planning how to shrink it and eventually retire it

### 2. Spaghetti As Front-End, But Still Patch-Feeding Legacy Box Params

Current seam:
- Spaghetti compile output still patches into the existing `BoxParams` request path

Why it matters:
- this is a useful bridge, but also a strong sign that the graph compiler is not fully owning its own request contract yet
- it can blur what the "real" build input model is

Cleanup need:
- decide whether this patching layer is permanent compatibility
- or whether Spaghetti should eventually have a more explicit build contract

### 3. Primitive Nodes Vs Param Nodes

Current seam:
- both `Param/*` and `Primitive/*` nodes exist
- selectors explicitly treat some primitives as legacy sources

Why it looks transitional:
- `Param/Number`, `Param/Boolean`, `Param/Vec2` look like the intended authored value system
- `Primitive/Number` and `Primitive/Vec2` look like older compatibility-era nodes

Cleanup need:
- decide whether `Primitive/*` should remain user-facing
- if not, hide them fully or migrate old graphs automatically

### 4. CubeProof As A Persistent Internal Artifact

Current seam:
- `Part/CubeProof` exists but is not user-addable

Why it looks transitional:
- it reads like a proof/test node that became part of the registry

Cleanup need:
- either formalize it as a real internal test node with a clear purpose
- or isolate it to test/dev-only territory

### 5. Output/Assembled Node Exists, But Feels Architecturally Unclear

Current seam:
- `Output/Assembled` exists in the registry, but the main preview/build flow emphasis is on `System/OutputPreview`

Why it feels loose:
- it is not yet a clearly explained core editor concept
- it risks becoming a ghost node type if not integrated into the editor model properly

Cleanup need:
- clarify whether assembled output is a real future graph concept
- or an unfinished node direction that should stay dormant

### 6. Feature Stack Compatibility Layers

Current seam:
- feature schema and compile paths still carry legacy compatibility branches
- old line/entity formats are still being translated

Why it looks transitional:
- the current Feature Stack model is clearly more structured than the older forms

Cleanup need:
- identify which compatibility branches are still needed for real graph persistence
- remove the rest when safe

### 7. Driver Port Canonicalization And Legacy Aliases

Current seam:
- canonical and legacy driver virtual port ids both exist
- alias parsing and replacement behavior is still actively maintained

Why it matters:
- useful during migration
- noisy if kept forever

Cleanup need:
- document the canonical form
- define when legacy aliases can stop being first-class

### 8. Anchor Port Alias Compatibility

Current seam:
- `anchorSpline2` compatibility behavior still exists for ToeHook and HeelKick

Why it looks transitional:
- comments already frame this as a hard compatibility invariant

Cleanup need:
- decide whether old graphs requiring this alias are still important enough to justify permanent complexity
- if yes, document it clearly

### 9. Legacy Section UI In Node Rendering

Current seam:
- `NodeView.tsx` still contains legacy section/group behavior and compatibility rendering

Why it matters:
- the newer section model is much more intentional after NI-2 / NI-3
- leftover legacy section behavior makes the node rendering layer harder to reason about

Cleanup need:
- prune old section concepts that are no longer part of the intended UI model

### 10. Old Viewer Personality Features Missing A Modern Home

Current seam:
- old viewer features like scenes, radio, richer gizmo, layer/material control, and the big "design cockpit" feel are no longer fully present

Why it matters:
- these are not broken code leftovers
- they are product-direction loose ends

Cleanup need:
- decide which old viewer features are core product value
- rebuild those cleanly rather than leaving them as vague nostalgia

## Structural Loose Ends To Clean Up

These are the highest-signal structural cleanup areas.

### 1. Folder / Docs Naming Drift

Current examples:
- `docs/Plan/` vs `docs/Plans/`
- `docs/Phases/` casing
- multiple partially overlapping planning docs

Cleanup need:
- pick one folder naming convention
- move docs into final homes
- stop maintaining duplicate paths

### 2. Docs That Mix Vision, Status, History, And Tasks

Current pattern:
- some docs are plans
- some are active task sheets
- some are history
- some try to be all three

Cleanup need:
- keep one question per doc type:
  - roadmap
  - phase plan
  - task
  - architecture
  - changelog
  - wishlist

### 3. Legacy Compatibility Buried In Core Files

Current pattern:
- core files contain many fallback and alias branches
- these are often correct, but they make the "real" canonical model harder to see

Cleanup need:
- document each compatibility branch
- classify it:
  - keep permanently
  - keep temporarily
  - remove when safe

### 4. Internal/Test Node Types Mixed Into Main Registry

Examples:
- `Part/CubeProof`
- old primitive node variants

Cleanup need:
- mark internal/dev-only node types clearly
- optionally split user node registry from internal registry

### 5. Legacy And Canonical Terms Still Mixed In Places

Examples:
- old node mode names
- old driver port formats
- old feature/profile ids
- old port aliases

Cleanup need:
- define canonical terms once
- map all old terms to them
- eventually remove unnecessary dual naming

### 6. Spaghetti Editor Still Carries "Prototype" Traits

Current signs:
- hidden/internal node types
- proof nodes
- compatibility-heavy behaviors
- some unclear system-node story

Cleanup need:
- separate prototype/dev helpers from product-facing editor concepts

### 7. Build Pipeline Boundaries Still Need Sharpening

Current seam:
- Spaghetti is modern, but still partly routed through older request assumptions

Cleanup need:
- make the boundaries explicit:
  - graph state
  - compile output
  - build request
  - worker result
  - preview mapping
  - viewer input

## Things That Probably Need A Formal Decision

These should eventually become actual decision docs.

- Is `legacy` mode permanent or transitional?
- Are `Primitive/*` nodes still part of the intended user-facing node language?
- Is `CubeProof` a real internal tool or old residue?
- Is `Output/Assembled` a real future system node or an unfinished concept?
- Which compatibility aliases are permanent support contracts?
- Which old viewer features are core enough to rebuild?

## Suggested Cleanup Priorities

If the goal is to reduce confusion fast, these are the best cleanup targets:

### High Priority

- Folder/docs naming cleanup: `Plan` vs `Plans`, casing, duplicate homes
- Formal identity and source-of-truth docs
- Legacy vs Spaghetti mode decision
- Param node vs primitive node cleanup
- Internal node/type audit

### Medium Priority

- Driver alias cleanup
- Anchor alias compatibility cleanup
- Feature Stack compatibility audit
- Output/Assembled clarification

### Product Direction Priority

- Decide which old viewer/workbench features deserve a modern rebuild

## Short Version

The project does not mainly suffer from "bad architecture."

It mainly suffers from:
- successful evolution leaving behind compatibility seams
- multiple generations of ideas coexisting
- a few internal/proof concepts still sitting in product space
- docs/folder drift

So the cleanup job is mostly:
- identify what is canonical
- identify what is transitional
- isolate or remove the rest

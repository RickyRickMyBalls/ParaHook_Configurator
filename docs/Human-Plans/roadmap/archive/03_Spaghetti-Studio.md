# 03 Spaghetti Studio

## Doc History
1. 2026-03-06 15:50: Created this doc as the future-facing Spaghetti Studio concept sheet, defining the platform idea, the main next-gen themes, and the guardrail rules current ParaHook work should follow to avoid major restructuring later

## Purpose

This file is for the long-range idea of `Spaghetti Studio`.

It is not the current product roadmap.
It is the place to think about what the platform could become after ParaHook is stable enough to expand.

Use this file to track:
- the future identity of Spaghetti Studio
- the kinds of products it may eventually support
- the engine-level ideas that should survive beyond ParaHook
- the guardrail rules current ParaHook work should follow so the future platform does not require a full rewrite

Related docs:
- `/docs/roadmap/02_Vision-Roadmap.md`
- `/docs/roadmap/ROADMAP.md`
- `/docs/Phases/01_Phase-Setup.md`

## What Spaghetti Studio Could Become

`Spaghetti Studio` is the strongest current name for the broader platform idea behind ParaHook.

The idea is:
- ParaHook is the first real product built in the system
- Spaghetti Studio is the broader authoring platform that could eventually support many parametric part systems

In that future:
- ParaHook becomes one product/workspace inside the platform
- ParaFootPad or other related systems can become additional product families
- the underlying graph/driver/part/preview engine becomes reusable

So the likely split is:
- `ParaHook`
  - current product
  - the first real proving ground
- `Spaghetti Studio`
  - future authoring platform
  - wider parametric-parts engine and product ecosystem

## Big Future Idea

Spaghetti Studio could eventually become an open-source parametric parts platform with:

- deterministic node-based authoring
- typed graph values and typed graph objects
- part-based product modeling
- control-viz editing
- simplified end-user editing layers
- reusable viewers, debug tools, and export systems

It may gradually grow closer to a general parametric CAD platform, but the stronger long-term goal is not "be generic" by itself.

The stronger goal is:
- reusable typed parametric systems
- deterministic outputs
- product-focused authoring
- easier end-user customization on top of more powerful internal authoring tools

## Main Future Ideas

The future platform ideas currently implied by the repo are:

- one reusable graph engine for multiple product families
- strong typed-value and typed-object flow through the graph
- reusable part-node systems
- reusable Feature Stack behavior inside parts
- reusable driver/control contracts
- reusable OutputPreview / assembly mapping
- reusable viewer/debug/export layers
- multiple editing layers over one canonical model

## Typed Graph Direction

One of the most important next-gen ideas is that the graph should increasingly pass real typed things, not only loose UI params.

That direction may include:

- simple values
  - `number`
  - `boolean`
  - `string`
- grouped values
  - `vec2`
  - `vec3`
  - color-like value groups
- references
  - `part reference`
  - `feature reference`
  - `driver reference`
- richer custom objects
  - `profile`
  - `curve`
  - `sketch result`
  - grouped objects like `(profile, number)`

The long-term goal is a graph that can safely move typed values and typed objects the same way good engine graphs do.

## Product Families Spaghetti Studio Could Support

ParaHook is the current focus, but the platform idea leaves room for:

- `ParaHook`
- `ParaFootPad`
- custom Para parts
- related fitting/support parts
- future user-defined product families if the engine becomes strong enough

The point is not to promise all of that now.
The point is to avoid locking the architecture into a shape that only works for one product forever.

## Editing Layers

Spaghetti Studio likely keeps the same layered idea:

- advanced authoring layer
  - full node/driver/part/feature control
- simplified editing layer
  - user-facing control sets
  - direct manipulation handles
  - guided product customization

The names may change later, but the structure is strong:
- one canonical model
- more than one editing surface
- different levels of complexity for different users

## Guardrail Rules While Still In ParaHook Generator

While the repo is still primarily the ParaHook generator, these are the best rules to follow so the future platform does not require a huge restructure.

- Keep one canonical model truth.
- Do not let Jake mode become a second geometry truth.
- Keep Spaghetti as the real authoring system.
- Keep drivers as reusable control contracts, not ParaHook-only hacks.
- Keep control-viz handles as bindings over model values, not hardcoded special cases.
- Keep viewer-only behavior rebuild-free.
- Keep worker/build rules deterministic and product-agnostic where possible.
- Keep shared contracts typed and reusable.
- Keep part identity and preview identity explicit and separate.
- Keep Feature Stack internal to part nodes instead of turning features into ad hoc nested graph nodes.
- Prefer generic node/driver/value systems over ParaHook-specific one-off logic where it does not hurt current progress.
- Prefer reusable object/value contracts over flat stringly-typed payloads.
- Keep product-specific hacks isolated behind product-specific nodes, presets, adapters, or metadata.
- Do not let old UI experiments force core-engine shape.
- When adding a new system, ask whether it belongs to ParaHook only or to the future Spaghetti Studio platform.

## What Should Stay Product-Specific For Now

Not everything needs to be generalized immediately.

It is still correct to keep these ParaHook-specific for now:

- actual ParaHook product logic
- current part names and presets
- current Jake-mode presentation choices
- current viewer/workbench personality
- current product-facing UX wording

The goal is not premature generalization.
The goal is to keep the core engine reusable while letting the current product stay focused.

## Early Spaghetti Studio Questions

Questions worth keeping open:

- What should eventually count as a first-class typed graph object?
- Which parts of the current driver system should become fully generic?
- Which parts of Feature Stack are truly reusable across products?
- How much of the viewer should be platform-level versus product-level?
- How should a future product family register itself into the platform?
- What is the right boundary between platform code and product code?
- When does `ParaHook` stop being the repo identity and become one workspace inside a broader studio?

## Current Working Position

For now, the best working position is:

- build ParaHook well
- treat it as the first real product on top of the engine
- keep the core system clean enough that it can later expand into Spaghetti Studio
- only generalize where it helps current work and future platform direction at the same time

That keeps the project ambitious without making it vague.

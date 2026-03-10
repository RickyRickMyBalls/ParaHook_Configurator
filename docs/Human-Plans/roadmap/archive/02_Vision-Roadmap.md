# 02 Vision Roadmap

## Doc History
1. 2026-03-06 15:46: Added a naming-ideas list at the end of the `Next Gen Plans - Parametric Parts` section so the long-range platform direction has early candidate names tied to open source, Spaghetti, Parametric Parts, ParaHook, ParaFootPad, and custom part systems
2. 2026-03-06 15:44: Expanded the vision to include the longer-range `Parametric Parts` direction, clarified that the app may grow beyond ParaHook over time, and added the next-gen typed-object/control-system ambition
3. 2026-03-06 15:39: Created the new high-level vision roadmap from the restored engine-birth history, the current phase-prefix system, the go-forward roadmap, and the clarified Spaghetti-to-Jake product direction

## Purpose

This is the new high-level vision roadmap for ParaHook.

It is not:
- the detailed phase checklist
- the task backlog
- the shipped-work changelog

It is the place to answer:
- what this app is becoming
- what the canonical architecture should be
- what product modes should exist
- what major system layers matter long-term
- what order the product should mature in

Use this together with:
- `/docs/roadmap/ROADMAP.md` for the go-forward phase list
- `/docs/Phases/01_Phase-Setup.md` for the prefix/ownership system
- `/docs/History/0 - History-TaskLog.md` for the restored early `/20/` engine-birth context

## What ParaHook Is Becoming

ParaHook is becoming a deterministic parametric part-design app with two editing layers:

- `Spaghetti mode`
  - the advanced authoring system
  - the real model-definition layer
  - the place where parts, drivers, Feature Stack, routing, and relationships are defined
- `Jake mode`
  - the simplified end-user layer
  - a curated control surface over the same canonical model
  - the place where a user adjusts approved controls without seeing the full authoring system

In the current and medium-term product direction, the app is not trying to be a fully open-ended generic CAD sandbox.

The current goal is a focused deterministic product-design system centered on ParaHook and closely related parts.

The long-term product shape is:
- author the real model in Spaghetti
- expose the safe useful controls through drivers
- let Jake mode and control-viz handles manipulate those drivers
- build and preview deterministic manufacturable parts through one shared pipeline

## Next Gen Plans - Parametric Parts

Long-term, ParaHook may grow into a broader `Parametric Parts` platform instead of staying limited to one product family forever.

That future is still far away, but the current architecture should be shaped so it can grow in that direction without being rebuilt again.

The long-range idea is:

- start as a focused ParaHook system
- mature the deterministic node/part/driver pipeline
- prove the authoring model through Spaghetti and Jake mode
- then expand the same architecture into a wider parametric-parts system

If that happens, the app may gradually become closer to a general parametric CAD platform, but still with stronger structure than a freeform sandbox.

The important next-gen idea is not "generic CAD" by itself.
The important idea is a reusable parametric engine with strong typed contracts.

That means the system should increasingly think in terms of:

- scalar values like `number`
- grouped values like `vec2` / `(number, number)`
- symbolic values like `string`
- richer typed custom objects such as:
  - `profile`
  - `curve`
  - `part reference`
  - `feature reference`
  - grouped objects like `(profile, number)`

In plain terms:

- the engine should learn how to pass real typed values through the graph
- not just ad hoc UI params
- and over time it should be able to pass richer custom objects through nodes in the same deterministic way

The long-term architectural hope is something closer to:

- Unreal-style typed graph thinking
- deterministic CAD/product outputs
- user-facing control handles and simplified editing layers
- reusable object contracts that can support many future part families

So the near-term product is still ParaHook.
But the long-term engine can be designed so it is strong enough to become `Parametric Parts`.

Possible next-gen public/open-source naming ideas:

0. `Spaghetti Studio`

1. `Parametric Parts`
2. `Spaghetti Parts`
3. `Open Parametric Parts`
4. `ParaParts`
5. `ParaHook Studio`
6. `ParaHook + ParaFootPad`
7. `Custom Para Parts`
8. `Spaghetti CAD`
9. `Open Spaghetti Parametrics`
10. `Parametric Parts Studio`

## Core Product Truths

These are the truths that now seem stable.

- There should be one canonical model truth.
- Spaghetti is the advanced authoring surface for that truth.
- Jake mode should not become a second geometry truth.
- Drivers are the control contract between authoring and simplified editing.
- Control-viz handles are a UI layer over drivers, not a second model.
- The viewer should render and present state, not own CAD logic.
- The worker should build deterministic outputs, not own UI state.
- The app layer should capture intent, route requests, and own canonical state boundaries.

## Canonical Architecture Direction

The long-term engine direction is:

- app layer owns canonical intent and product state
- selectors/view models shape that state for UI surfaces
- Spaghetti compile logic translates graph/model state into build-ready requests
- one warm worker executes deterministic geometry work
- the worker returns typed artifacts/results
- OutputPreview / assembly mapping selects what should be previewed
- the viewer renders the chosen preview state without redefining the model

Important restart-era rules that should remain:

- one warm worker
- latest-only scheduling
- stale-drop protection
- canonical snapshot rebuild flow
- shared protocol/schema boundaries
- rebuild-free viewer-only presentation changes

## Product Modes

### Spaghetti Mode

Spaghetti mode should become:
- the canonical advanced editor
- the place where real part systems are authored
- the place where driver graphs, part nodes, Feature Stack, OutputPreview wiring, and advanced debugging live

Spaghetti mode is not just a temporary tool.
It is the long-term internal authoring system.

### Jake Mode

Jake mode should become:
- the main simplified product experience
- the easier way to customize a ParaHook
- the place where approved drivers and handles are exposed
- the mode where control-viz spheres can be grabbed and moved directly in the viewport

Jake mode should never fork away from the canonical model.
It should edit the same model through a safer narrower interface.

## Drivers And Control Viz

Drivers are becoming one of the most important system layers in the app.

They should become:
- the canonical editable control values
- the bridge between Spaghetti and Jake mode
- the bridge between UI panels and viewport handles
- the future equation-ready control layer

Control-viz handles should become:
- viewport manipulators bound to drivers
- plane-constrained or rule-constrained controls
- able to edit one value or a grouped value like `vec2`
- eventually able to affect multiple drivers through a binding layer

The long-term rule is:
- Jake mode edits drivers
- drivers control the model
- control-viz handles are one UI for editing drivers

## Parts And Feature Stack

The product should grow around real parts, not around abstract geometry demos.

That means:
- part nodes represent manufacturable components
- Feature Stack remains internal to part nodes
- features like `sketch` and `extrude` stay data/behavior inside parts, not nested graph nodes
- OutputPreview and assembly systems remain separate from build identity
- part identity and preview identity remain intentionally separate

The likely near-to-mid-term part focus is:
- Baseplate hardening
- ToeHook hardening
- HeelKick hardening
- richer part metadata and presets
- stronger multi-part behavior

## Viewer Vision

The viewer should become both:
- a reliable modern preview system for current deterministic parts
- a rebuilt version of the strongest old workbench features

That means the viewer vision includes:
- strong multi-part rendering
- visibility/highlighting controls
- old gizmo parity
- Scenes return
- radio sampler return
- richer materials/layers/section-cut/reference tools
- control-viz handles for Jake mode

But the viewer must keep its boundary:
- presentation and interaction, yes
- canonical CAD ownership, no

## Debug And Understanding

The app is now complex enough that observability is part of the product infrastructure.

That means:
- debug systems are not optional polish
- read-only debug visibility should keep expanding
- internal boundaries should be inspectable without code-diving every time

The debug vision is:
- compile visibility
- artifact visibility
- OutputPreview visibility
- preview VM visibility
- viewer input visibility
- later graph/node/feature/resolver/wire visibility

## Multi-Window And Multi-Document Future

The likely long-term product shape is bigger than one editor window.

Future ParaHook should support:
- multiple Spaghetti editor instances
- possibly browser-window Spaghetti hosts
- multiple documents or multiple independent ParaHooks
- shared viewport composition across outputs

To reach that cleanly, the system will likely need:
- document-level model ownership
- per-editor-instance UI state
- per-document build ownership
- shared viewport composition
- stable document-aware identity rules

## Roadmap Shape

The broad order still looks like this:

1. stabilize the current Spaghetti editor surface
2. strengthen wires, nodes, drivers, and OutputPreview visibility
3. harden the current real parts and Feature Stack behavior
4. make driver contracts good enough for Jake mode
5. bring back the strongest older viewer/workbench capabilities
6. turn Jake mode into the main simplified end-user experience
7. expand into multi-part, multi-document, export, and advanced systems

## What This Roadmap Is Trying To Avoid

This vision specifically tries to avoid:

- two different truths for the model
- viewer-driven geometry ownership
- UI-only rebuild spam
- a return to scrubber-first history thinking
- unclear part identity
- unclear preview identity
- ad hoc feature ownership
- Jake mode becoming a separate hidden product
- Spaghetti being treated like a throwaway prototype instead of the real authoring system

## End State

The ideal end state is:

- Spaghetti is the powerful deterministic authoring engine
- drivers are the clean control contract
- Jake mode is the easy finished product experience
- the worker build pipeline is deterministic and inspectable
- OutputPreview and the viewer make multi-part results easy to understand
- old viewer strengths return in a cleaner modern form
- the whole app feels like one coherent product instead of a collection of experiments

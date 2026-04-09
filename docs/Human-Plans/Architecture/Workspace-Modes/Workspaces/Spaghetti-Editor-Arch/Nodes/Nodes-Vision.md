# Nodes Vision

## Doc Header

### Purpose

This file is the long-range idea surface for node and row behavior that is directionally useful but not yet locked as an execution phase.

Use it to:
- capture ideas that are clearer than a loose note but not yet ready for a numbered phase
- record future node-language directions without forcing immediate implementation scope
- keep sketch, extrude, and later node-family ideas aligned before they harden into dedicated phase docs

### How To Use This File

- add one foldable `## Idea` section per distinct future direction
- keep each idea narrow enough that it can later split into its own future phase
- prefer code-facing and UX-facing language over vague product language
- move ideas out into dedicated future docs once they become implementation-ready

## Doc Body

### Execution

Suggested first-pass phase order:

1. `Sketch-5` - `Idea 2`
   - lock the sketch-side `SketchProfiles` parent collection and growing singular `SketchProfile` child outputs first
   - this is the cleanest foundation because later extrude collection work depends on sketch publishing one honest aggregate output plus singular members
2. `Extrude-5` - `Idea 1`
   - lock the extrude-side `SketchProfiles` collection input after the sketch output contract is stable enough to plug into it
   - this gives the graph one honest parent-collection profile flow before viewport tooling widens the surface
3. `Build-Path-1` - `Idea 5`
   - prove the first simple history-style list view once the basic sketch-to-extrude profile contract exists
   - this should stay narrow: one CAD command per row, expand for options, scrub preview cutoff
4. `Extrude-6` - `Idea 4`
   - add the extrude toolbar launcher and viewport-driven auto-wiring after the graph-native profile collection contract is already trustworthy
   - this keeps the toolbar as a graph-authoring shortcut rather than forcing it to invent missing input semantics
5. `Sketch-6` - `Idea 3`
   - widen the sketch output taxonomy into `SketchCurves` and `SketchSharedPoints` after the simpler profile workflow is already stable
   - this is the broadest and most taxonomy-heavy idea, so it should come after the profile and toolbar proving work instead of before it

Why this order:
- `Idea 2` and `Idea 1` create the smallest coherent sketch-to-extrude profile story
- `Idea 5` can then project that story into a simple `Build-Path` list without waiting for the broader sketch curve taxonomy
- `Idea 4` becomes much safer once the extrude node already owns a correct `SketchProfiles` collection contract
- `Idea 3` is important, but it widens the sketch data model the most, so it is a better later phase than an early proving slice

This is only the top-level phase order.

Each phase should later split into its own dedicated subphases once it becomes implementation-ready.



## Idea 1 - Extrude `SketchProfiles` As A Real Collection Input

### Summary

The `Geometry/Extrude` profile input should stop reading like one singular `SketchProfile` slot that only incidentally accepts aggregate behavior.

Instead, the parent input row should be:
- `SketchProfiles`

That row should mean:
- one ordered collection input owned by the extrude node
- a collection that may accept:
  - one aggregate `SketchProfiles` wire
  - one or more singular `SketchProfile` wires

This keeps the extrude input language aligned with the broader collection-row direction already emerging on the sketch output side.

### Why

- the current singular-looking input label obscures that the node really wants a profile collection
- the user should be able to wire one whole upstream profile array or build the collection incrementally from singular profile members
- the parent collection row should stay visible and honest in collapsed mode
- expanded and essentials modes should reveal what the user actually wired without pretending every connection is the same kind of thing

### Questions

- should the parent row always stay named `SketchProfiles` even when only one singular profile is connected?
- should expanded child rows represent incoming wire entries, resolved profile members, or both?
- should a whole-array `SketchProfiles` input remain one aggregate child row when expanded rather than exploding into every upstream profile member?
- what ordering rule should the extrude collection use when both aggregate and singular sources are connected?

### Suggested Answers

- keep the parent row named `SketchProfiles` at all times because the extrude node owns a collection input, not a singular profile slot
- in expanded and essentials modes, show one child row per actual incoming connection entry
- keep an upstream aggregate `SketchProfiles` wire as one aggregate child row in the extrude input UI instead of exploding it into every resolved upstream member
- flatten the collection for runtime consumption later, but keep the UI organized by connection entry first so the wire story stays readable

### Spec

- `Geometry/Extrude` should expose one parent input row named `SketchProfiles`
- that parent row should accept multiple wires when those wires are valid profile-collection contributors
- valid first inputs for this idea are:
  - one aggregate `SketchProfiles`
  - one singular `SketchProfile`
  - multiple singular `SketchProfile` wires
  - a mixed set of one aggregate `SketchProfiles` wire plus singular `SketchProfile` wires
- in collapsed mode:
  - all incoming wires terminate visually at the one parent `SketchProfiles` row
  - the user does not need to see individual child rows yet
- in essentials and expanded modes:
  - the parent `SketchProfiles` row may reveal one child row per incoming connection entry
  - each child row should keep its own individual wire
  - aggregate entries should stay aggregate entries
  - singular entries should stay singular entries
- if the user wires one upstream `SketchProfiles` array into extrude:
  - collapsed mode should show one wire into the parent row
  - expanded and essentials modes should show one aggregate child row, not an exploded list of every upstream profile member
- if the user wires one upstream singular `SketchProfile` into extrude:
  - collapsed mode should show one wire into the parent row
  - expanded and essentials modes should show one singular child row
- if the user wires multiple singular `SketchProfile` sources into extrude:
  - collapsed mode should still show those wires converging into the parent `SketchProfiles` row
  - expanded and essentials modes should show one child row per singular source
- if the user mixes one aggregate `SketchProfiles` wire with singular `SketchProfile` wires:
  - collapsed mode should still read as one parent collection row with multiple incoming wires
  - expanded and essentials modes should show one child row for the aggregate source and one child row for each singular source

### Display Examples

Collapsed read:

```text
SketchProfiles
```

Expanded read with one aggregate source:

```text
SketchProfiles
  SketchProfiles
```

Expanded read with two singular sources:

```text
SketchProfiles
  SketchProfile
  SketchProfile
```

Expanded read with one aggregate source plus two singular sources:

```text
SketchProfiles
  SketchProfiles
  SketchProfile
  SketchProfile
```

### Scope Notes

This idea owns:
- the input-row naming and collection meaning for extrude profile consumption
- the collapsed versus expanded collection-entry display contract
- the distinction between aggregate input entries and singular input entries

This idea does not yet own:
- flattening and ordering semantics for final runtime evaluation
- broad viewport selection behavior
- later sketch line, polyline, or point collection rollout
- full family adoption work outside the immediate extrude profile-input surface

### Follow-On Potential

If this idea survives first review, it could later split into one dedicated future phase focused on:
- extrude collection input contract
- multi-wire collection input visuals
- collection-entry child-row wiring behavior

## Idea 2 - Sketch `SketchProfiles` As A Growing Output Collection

### Summary

The `Geometry/Sketch` node should expose:
- one parent output row named `SketchProfiles`

That row should mean:
- the whole ordered collection of currently resolved closed sketch profiles

As the user draws more closed profiles in the sketch, that parent output collection should grow by adding one child row per resolved singular profile:
- `SketchProfile`

This gives the sketch node one honest aggregate output while still letting the user target any one resolved profile member directly.

### Why

- the sketch node should publish one aggregate profile collection instead of a confusing mix of unrelated top-level profile rows
- the user should be able to expand the collection and grab one specific `SketchProfile` member when wiring into `Extrude`
- the same singular-member output language should later support downstream consumers such as `Loft`
- the output side should mirror the same parent-versus-child collection contract already becoming clearer on the input side

### Questions

- should `SketchProfiles` always stay visible as the one parent aggregate row even when there is only one resolved closed profile?
- should the child `SketchProfile` rows appear only for resolved closed profiles rather than for every authored sketch entity?
- what ordering rule should the child `SketchProfile` rows use as the user creates, deletes, or edits profiles?
- should the child rows be directly wireable while the parent aggregate row remains wireable too?

### Suggested Answers

- keep `SketchProfiles` as the one always-visible parent aggregate output row
- only add child `SketchProfile` rows for resolved closed profiles
- keep child ordering stable and tied to the sketch node's resolved profile ordering so the user can build trust in what they are wiring
- make both the parent aggregate row and the singular child rows directly wireable because they mean different valid targets

### Spec

- `Geometry/Sketch` should expose one parent output row named `SketchProfiles`
- that parent row should represent the whole ordered collection of resolved closed profiles currently available from the sketch
- as the user creates or resolves more closed profiles, the parent `SketchProfiles` output should gain one child row per singular resolved member
- each child row should be named:
  - `SketchProfile`
- in collapsed mode:
  - the user sees the one parent `SketchProfiles` row
  - the parent row remains the aggregate wire target for downstream nodes that want the whole collection
- in essentials and expanded modes:
  - the parent `SketchProfiles` row may reveal one child `SketchProfile` row per resolved profile member
  - each child row should be a directly wireable singular output
  - the child rows should remain children of the parent collection, not become a separate top-level output family
- if the sketch currently resolves one closed profile:
  - expanded and essentials modes should show one `SketchProfile` child row under `SketchProfiles`
- if the sketch currently resolves multiple closed profiles:
  - expanded and essentials modes should show one `SketchProfile` child row for each resolved profile member
- when a downstream node such as `Extrude` wants one specific profile:
  - the user should be able to expand `SketchProfiles`
  - drag a wire from one singular `SketchProfile` child row
  - connect that singular member into the downstream collection or singular-member input contract as appropriate
- when a downstream node wants the whole collection:
  - the user should be able to wire from the parent `SketchProfiles` row directly

### Display Examples

Collapsed read:

```text
SketchProfiles
```

Expanded read with one resolved closed profile:

```text
SketchProfiles
  SketchProfile
```

Expanded read with three resolved closed profiles:

```text
SketchProfiles
  SketchProfile
  SketchProfile
  SketchProfile
```

### Scope Notes

This idea owns:
- the sketch output-side parent collection versus singular member contract for closed profiles
- the rule that one singular `SketchProfile` child row should appear for each resolved closed profile
- the ability to wire either the whole aggregate collection or any one singular profile member

This idea does not yet own:
- sketch line, polyline, or point output collections
- viewport picking and direct viewport-to-member selection
- the later runtime semantics of `Loft`
- broader sketch entity taxonomy beyond closed profile outputs

### Follow-On Potential

If this idea survives first review, it could later split into one dedicated future phase focused on:
- sketch aggregate profile output behavior
- singular profile child-row output wiring
- stable ordering and identity for resolved profile members

## Idea 3 - Sketch Curve And Point Output Taxonomy

### Summary

The `Geometry/Sketch` node will eventually need to publish more than closed profile regions.

It should also expose:
- the sketch's curve-like entities as aggregate outputs
- the points that those entities own or reference

This is the direction that supports:
- selecting one singular line or curve for downstream use
- exposing joined polyline-like entities as first-class outputs
- exposing sketch points so later editing and shared-endpoint workflows have real graph-visible ownership

### Why

- `SketchProfiles` alone is not enough once the user needs to target one specific line, path, or point
- later consumers will need to distinguish between:
  - closed profile regions
  - singular curve/path entities
  - shared points and endpoint ownership
- viewport selection will be much easier to align with node outputs if the sketch node already publishes real singular members for these entity families

### Proposed Hierarchy

Directionally, the output tree should likely read more like:

```text
Outputs
  SketchProfiles
    SketchProfile
    SketchProfile
  SketchCurves
    SketchLine
    SketchLine
    SketchPLine
      SketchLine
        SketchPoint
        SketchPoint
  SketchSharedPoints
    SketchPoint
    SketchPoint
```

### Questions

- should `SketchCurves` be the one top-level aggregate for all curve-like entities, with `SketchLine`, `SketchPLine`, and later arc-like members under it?
- should line endpoint points be exposed as locally owned points, shared points, or both?
- should `SketchSharedPoints` represent only true topological shared endpoints that are reused by more than one entity?
- how much of this hierarchy should be visible immediately versus revealed only when expanded deeply?

### Suggested Answers

- prefer one broad aggregate parent such as `SketchCurves` for long-term taxonomy stability
- treat `SketchPLine` as one first-class singular curve member that may reveal child segment rows when expanded, rather than forcing polylines into a separate top-level collection
- expose points carefully:
  - local endpoint points are useful for structural inspection
  - shared points are useful for editing and multi-entity movement
- reserve `SketchSharedPoints` for real shared point identities rather than duplicating every endpoint into a fake shared list
- keep the visible top-level output surface small, then let deeper structure appear through expansion

### Spec

- `Geometry/Sketch` should eventually publish one aggregate output for curve-like sketch entities in addition to `SketchProfiles`
- every singular curve or line that the user may later need to target should be representable as a real child output member
- joined polyline-like entities should be first-class outputs rather than only UI groupings
- point exposure should exist because later editing workflows will need graph-visible point identities
- a safe long-range taxonomy is:
  - `SketchProfiles`
    - `SketchProfile`
  - `SketchCurves`
    - `SketchLine`
    - `SketchPLine`
    - later other curve members such as arcs or similar entities
  - `SketchSharedPoints`
    - `SketchPoint`
- if polyline internals are shown:
  - `SketchPLine` may expand into child segment rows such as `SketchLine`
  - those segment rows may expand into endpoint rows such as `SketchPoint`
- if shared point structure is shown:
  - `SketchSharedPoints` should expose only true shared point identities that are reused by more than one entity or otherwise carry shared-edit meaning
- the output contract should distinguish clearly between:
  - aggregate collection rows
  - singular entity rows
  - structural child rows
  - shared point rows

### Display Examples

A conservative top-level read:

```text
SketchProfiles
  SketchProfile
  SketchProfile

SketchCurves
  SketchLine
  SketchLine
  SketchPLine

SketchSharedPoints
  SketchPoint
  SketchPoint
```

A deeper expanded read for one polyline could later become:

```text
SketchCurves
  SketchPLine
    SketchLine
      SketchPoint
      SketchPoint
    SketchLine
      SketchPoint
      SketchPoint
```

### Suggestion

Keep the top-level taxonomy small:
- `SketchProfiles`
- `SketchCurves`
- `SketchSharedPoints`

Then let:
- `SketchLine`
- `SketchPLine`
- later arc-like entities

live as singular members under `SketchCurves`.

That keeps the output surface easier to explain:
- profiles are regions
- curves are path-like entities
- shared points are reusable edit anchors

### Scope Notes

This idea owns:
- the future sketch output taxonomy beyond closed profiles
- the distinction between profile, curve, and point aggregate families
- the idea that singular curves and points should become real wireable members

This idea does not yet own:
- the final naming lock for every curve subtype
- direct viewport selection mechanics
- downstream `Extrude`, `Loft`, or `Sweep` runtime contracts
- the exact flattening behavior for nested polyline internals

### Follow-On Potential

If this idea survives first review, it could later split into one or more dedicated future phases focused on:
- sketch curve output collections
- polyline versus line ownership and expansion
- shared point identity and edit behavior

## Idea 4 - Extrude Toolbar Launcher And Viewport-Driven Auto-Wiring

### Summary

The `Geometry/Extrude` node will need a viewport-first authoring workflow for users who are modeling directly in the viewport instead of wiring everything manually through the graph surface.

The large top section that currently reads like:
- `EXTRUDE GEOMETRY`

should eventually become a launcher button that opens the extrude toolbar.

When that toolbar opens:
- if the spaghetti editor is in float mode, it should minimize or collapse so the model viewport has more room
- if the spaghetti editor is in split mode, it should remain visible

While the extrude toolbar is open, the user should be able to click sketch targets in the viewport and author the active extrude node through direct interaction.

### Why

- extrude needs a workflow that feels natural for direct viewport modeling, not only graph wiring
- the node should stay graph-native underneath, even when the user is operating through a viewport-first tool
- the viewport workflow should feel closer to Fusion-style extrude behavior:
  - pick profile targets
  - preview the result
  - drag a depth handle
  - keep the graph updated in the background

### Questions

- should the large top string area in the extrude node become one explicit toolbar-launcher button instead of a passive title block?
- should opening the extrude toolbar collapse the spaghetti editor only in float mode and not in split mode?
- should clicking a `SketchProfile` in the viewport toggle that profile in or out of the active extrude node's target collection?
- should the viewport tool update the graph automatically by wiring or unwiring the correct `SketchProfile` entries behind the scenes?

### Suggested Answers

- yes, replace the large passive string area with one explicit extrude-toolbar launcher
- yes, collapse or minimize the spaghetti editor only when it is floating, and preserve split mode as-is
- yes, use one unified click model:
  - click an unselected `SketchProfile` to add it
  - click a selected `SketchProfile` again to remove it
- yes, keep the graph as the source of truth by automatically updating the active extrude node's `SketchProfiles` collection wiring in the background

### Spec

- `Geometry/Extrude` should eventually replace the large header strip above its inputs with one button that opens the extrude toolbar
- opening the extrude toolbar should put the active extrude node into a viewport-first target-picking workflow
- if the spaghetti editor is floating when the toolbar opens:
  - collapse or minimize it so the model viewport becomes the primary surface
- if the spaghetti editor is split when the toolbar opens:
  - leave it visible
- when the toolbar closes:
  - the previous float-layout visibility should be restored if it had been auto-collapsed
- while the extrude toolbar is open:
  - clicking one unselected `SketchProfile` in the viewport should add it to the active extrude node's `SketchProfiles` input collection
  - clicking that same selected `SketchProfile` again should remove it from the active extrude node's `SketchProfiles` input collection
  - this one click model should combine single-target and multi-target picking into one continuous selection workflow
- the active extrude preview should always reflect the current selected target set
- after at least one valid `SketchProfile` target is selected:
  - the extrude should preview in the viewport
  - one arrow or drag handle should appear so the user can adjust `Depth`
- dragging the viewport depth handle should update the active extrude node's `Depth` input rather than inventing a separate toolbar-only value
- the viewport workflow should remain graph-native underneath:
  - selecting a target should create or preserve the correct wire into the active extrude node
  - deselecting a target should remove the matching wire from the active extrude node
  - reopening the toolbar should rehydrate the viewport target selection from the active extrude node's current wiring state

### Interaction Examples

Open toolbar, select one target:

```text
Open Extrude Tool
Click SketchProfile 1
=> SketchProfile 1 is added to the active extrude node
=> extrude preview appears
=> depth handle appears
```

Add another target:

```text
Click SketchProfile 2
=> SketchProfile 2 is added too
=> preview updates to include both selected targets
```

Subtract one target:

```text
Click SketchProfile 1 again
=> SketchProfile 1 is removed
=> only SketchProfile 2 remains wired into the active extrude node
```

### Suggestion

The first honest proving slice for this idea should stay narrow:
- toolbar launcher in the extrude node
- float-mode auto-collapse behavior
- viewport picking for `SketchProfile`
- auto-wiring into the active extrude node's `SketchProfiles` collection
- depth-handle editing that writes back into `Depth`

Do not widen the first pass yet into:
- `SketchCurves`
- `SketchLines`
- later thin-extrude or path-style semantics

Those should follow only after the profile-based toolbar workflow is stable.

### Scope Notes

This idea owns:
- the extrude toolbar launcher direction
- float-mode collapse behavior for viewport-first extrude authoring
- viewport click-to-add and click-again-to-remove profile selection
- graph-native auto-wiring for the active extrude node
- depth-handle editing as a direct write into the node's existing parameter surface

This idea does not yet own:
- the final curve or line-based extrude workflow
- broader viewer gizmo architecture outside this immediate extrude authoring contract
- all later toolbar commands or settings that extrude may eventually expose

### Follow-On Potential

If this idea survives first review, it could later split into one or more dedicated future phases focused on:
- extrude toolbar launcher and layout behavior
- viewport profile-picking and target toggling
- auto-wiring between viewport selection and graph state
- depth-handle manipulation and preview feedback

## Idea 5 - Build-Path As A History-Style Node Projection With Scrubbed Preview

### Summary

The broader CAD workflow will need a second workspace mode under `Build-Path` where the user sees the model as a history-style command stack rather than as the full spaghetti graph.

In that mode:
- each CAD command node should appear as one row in a simple vertical list in build order
- the user should be able to expand a row to edit that node's options
- the user should be able to scrub the build path backward or forward
- the output preview should only show the model state up to the current scrub mark

This creates a history-style editing surface without abandoning the graph as the source of truth.

### Why

- many modeling tasks are easier to understand as a sequential build history than as a wire graph
- the same underlying graph can support both:
  - topology-oriented editing in `Spaghetti`
  - history-oriented editing in `Build-Path`
- scrubbing backward through the build path is one of the most useful CAD workflows for understanding where a feature changed the model
- the first implementation will be much easier to ship if `Build-Path` starts as one simple list instead of trying to mirror graph topology visually

### Questions

- should `Build-Path` be treated as a projection of the same graph rather than as a second modeling data structure?
- should every feature-like CAD command node appear as one collapsed row by default?
- should expanding a row reveal the same parameter surface that the node already owns in the spaghetti editor?
- should the scrub mark define the last node whose effect is included in preview while later nodes remain visible but inactive for preview?
- should the top-level `Build-Path` stay as one linear row list even when the underlying graph has parallel upstream dependencies?
- should the first implementation intentionally stay as a simple vertical list of CAD command rows before attempting more advanced history visualization?

### Suggested Answers

- yes, `Build-Path` should be a view over the same graph, not a separate authoring model
- yes, each feature-like CAD command node should appear as one row by default
- yes, expanding a row should edit the real node params rather than a duplicated history-only state
- yes, the scrub mark should truncate preview contribution without deleting, disabling, or hiding later nodes
- yes, the top-level `Build-Path` should stay linear and should show fan-in or parallel dependency truth inside expanded rows rather than by turning the build path into a branching wire view
- yes, the first implementation should deliberately stay as a simple list of CAD command rows because that is the smallest honest proving surface

### Spec

- a later `Build-Path` workspace mode should first show one row per CAD command node in a simple vertical list in build order
- each row should represent one real node from the graph
- each row should be expandable so the user can reveal and edit that node's options
- the top-level `Build-Path` should remain one linear list even when the graph contains parallel upstream feature dependencies
- many-to-one or parallel dependency structure should be shown inside the consuming row rather than as branching top-level build lanes
- the graph should remain the source of truth underneath:
  - editing in `Build-Path` should update the same node params used by `Spaghetti`
  - editing in `Spaghetti` should remain visible when the user returns to `Build-Path`
- the `Build-Path` workspace should expose a scrub control or scrub mark that defines the current preview cutoff
- the output preview should only show geometry differences and accumulated model state up to that scrub mark
- nodes after the scrub mark should remain in the build path list but should not contribute to the active preview until the scrub mark moves forward again
- if one feature consumes multiple upstream sources:
  - the top-level history should still stay linear
  - the consuming row should reveal those inputs when expanded
  - preview at that row should include all upstream dependencies required to evaluate that feature

### Interaction Example

Given a build path like:

```text
Sketch
Extrude
Fillet
Output Preview
```

If the user scrubs back to `Extrude`:

```text
Sketch       => included in preview
Extrude      => included in preview
Fillet       => not included in preview
OutputPreview => shows the model state as of Extrude
```

That means the preview should no longer show the fillets while the scrub mark remains at `Extrude`.

Given a graph where two sketches feed one extrude:

```text
Sketch 1
Sketch 2
Extrude
Output Preview
```

The build path should still stay linear.

When `Extrude` expands, it may reveal its dependency context like:

```text
Extrude
  Inputs
    SketchProfile from Sketch 1
    SketchProfile from Sketch 2
```

That keeps the top-level build path readable while still preserving the truth that `Extrude` depends on both upstream sketches.

### Suggestion

The first honest proving slice for `Build-Path` should stay narrow:
- one simple vertical list
- one row per feature-like CAD command node
- row expand and collapse behavior
- one scrub mark
- preview truncation at the scrub mark
- linear top-level history even when dependencies fan in

Do not widen the first pass yet into:
- drag-reordering the history
- broad graph-authoring changes
- duplicate parameter systems
- deep node taxonomy cleanup

The main thing to prove first is that:
- one graph can support a clean history-style projection
- the scrub mark can reliably gate preview contribution

### Scope Notes

This idea owns:
- the history-style one-row-per-node `Build-Path` direction
- the first-implementation direction that `Build-Path` should begin as a simple vertical list
- expandable node rows in that workspace mode
- scrub-to-preview-cutoff behavior
- the rule that `Build-Path` is a projection of the same graph
- the rule that top-level build history stays linear while dependency fan-in is shown inside expanded rows

This idea does not yet own:
- the full `Build-Path` architecture doc
- exact build-order derivation rules for every graph shape
- reorder or suppression semantics beyond preview scrubbing
- all later command categories that may appear in that workspace mode

### Follow-On Potential

If this idea survives first review, it could later split into one or more dedicated future phases focused on:
- `Build-Path` row projection and inclusion rules
- scrub-state preview truncation
- shared parameter editing between `Build-Path` and `Spaghetti`
- later history UX such as reorder, suppression, or diff views

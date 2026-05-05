# Loft

## Doc Header

### Doc History
1. 2026-05-01 18:43:47: Created this Loft node-family planning guide as the first checklist for every app corner that should be reviewed when adding `Geometry/Loft`, including node UI, Console commands, toolbar workflow, edit history, new parameter/object types, compile/runtime contracts, preview/output publication, and verification.

### Purpose

This doc is the first planning guide for adding the `Geometry/Loft` node.

Use it to answer:
- which app surfaces must be checked when a new feature node is added
- what the first `Loft` node should own
- where `Loft` should reuse existing `Sketch`, `Extrude`, `Nodes`, `OutputPreview`, `Console`, `View-Toolbar`, `Edit-History`, `Worker`, and `Build Path` contracts
- which new parameter or object families may be needed before guided loft behavior is honest
- what should stay out of the first implementation pass

### Scope

This doc covers:
- planning checklist and feature-readiness guide for `Geometry/Loft`
- cross-surface implementation corners that should be reviewed before code work starts
- first-pass phase suggestions for a basic profile-to-profile loft
- follow-on questions for rails, splines, guide curves, toolbar flows, and history coverage

This doc does not cover:
- detailed code implementation for a specific phase
- final B-rep kernel implementation details
- final toolbar visual design
- final sketch-curve taxonomy
- full `Sweep`, `Revolve`, or `Boolean` planning

## Doc Body

### Short Version

Adding `Loft` is not only adding one registry entry.

The implementation needs to check every surface that treats graph-authored CAD as durable app behavior:
- node registry, schema, ports, selector VM, and node UI
- parameter and object types such as `SketchProfile`, profile collections, `Spline`, `Rail`, and later guide curves
- graph compile, evaluator, worker request/result, preview artifact, and output publication
- Console commands and command feedback
- node/viewport toolbar entry points
- canonical Edit History for durable authored row commits
- Browser/project content reads after the loft publishes a body
- tests and docs tracking

Hard rule:
- `Loft` should reuse shared node-row and solid-body collection contracts before inventing custom one-off UI or runtime ownership.

### First Loft Shape

The first honest `Geometry/Loft` should be profile based:

```text
Geometry/Loft
  Inputs
    Profiles
      SketchProfile
      SketchProfile
    Type
      Body / Surface
    Continuity
      Linear / Smooth
  Outputs
    SolidBody
```

Suggested first pass:
- accept two or more `SketchProfile` inputs through one ordered `Profiles` collection row
- produce one `SolidBody` output for a closed body loft when the selected profiles are compatible
- keep guide rails out of the first runtime pass unless the required `Spline` / `Rail` object contracts already exist
- expose unsupported states clearly instead of silently falling back to an extrude-like preview

### App-Corner Checklist

Use this checklist before opening a Loft implementation phase.

#### 1. Product And Ownership

- [ ] Confirm `Loft` strengthens graph-authored geometry truth rather than becoming a toolbar-only feature.
- [ ] Decide whether the first result is `SolidBody`, `SurfaceBody`, or a body/surface mode under one node.
- [ ] Decide whether the first pass supports exactly two profiles or an ordered profile collection.
- [ ] Decide what must happen when profiles are incompatible, non-planar relative to each other, open, reversed, or missing.
- [ ] Keep preview meshes downstream from geometry execution truth.

#### 2. Node Registry, Schema, And Types

- [ ] Add the `Geometry/Loft` registry definition with stable id, title, category, inputs, outputs, defaults, and visible row metadata.
- [ ] Add or reuse schema support for any new authored params.
- [ ] Reuse existing `SketchProfile`, `SketchProfiles`, `solidBody`, and `solidBodies` contracts where they fit.
- [ ] Add new types only when the existing contracts cannot express the shape honestly.
- [ ] If needed, plan new object types separately:
  - `Spline`
  - `SplineCollection`
  - `Rail`
  - `RailGuide`
  - `SurfaceBody`
  - `GuideCurve`

#### 3. Node UI Surface

- [ ] Add a Loft node surface that uses the shared node shell and structured wire rows.
- [ ] Add a `Profiles` collection input row instead of separate hard-coded `StartProfile` and `EndProfile` rows if the runtime needs ordered multiplicity.
- [ ] Show child profile entries only where the shared collection-row rules support it.
- [ ] Add authored option rows such as `Type`, `Continuity`, `Sections`, or `Closed` only when each has runtime meaning.
- [ ] Add a calm unsupported-state message for missing or invalid profiles.
- [ ] Preserve collapsed-mode wire readability.

#### 4. Wiring And Validation

- [ ] Decide valid source matrix:
  - `SketchProfile -> Loft.Profiles`
  - `SketchProfiles -> Loft.Profiles`
  - later `SketchCurve` / `Spline` / `Rail` sources
- [ ] Validate minimum profile count.
- [ ] Preserve authored profile order.
- [ ] Keep aggregate input rows and singular member rows semantically distinct.
- [ ] Add connection validation tests before relying on the UI.

#### 5. Compile, Evaluator, And Worker

- [ ] Add compile support that lowers Loft inputs into one explicit geometry request shape.
- [ ] Keep profile selection/order explicit in the request.
- [ ] Add evaluator support for preview-path values if the graph evaluator owns first-pass node output values.
- [ ] Add worker request/result support for draft and authoritative paths.
- [ ] Return clear diagnostics for unsupported guide rails, invalid profiles, or kernel failures.
- [ ] Do not reconstruct export-only geometry separately from the executed Loft result.

#### 6. Preview, Output, Browser, And Export

- [ ] Publish a preview artifact downstream from executed Loft geometry.
- [ ] Feed `OutputPreview` through the existing solid-body or solid-body-collection contract.
- [ ] Confirm Browser/project content reads the Loft output as a graph-authored body, not as a hidden viewer object.
- [ ] Preserve grouped-versus-split output behavior if Loft later produces multiple bodies.
- [ ] Leave `.step` and richer export handoff grounded in the same executed geometry truth.

#### 7. Console Commands

- [ ] Add command discovery for creating or activating a Loft node.
- [ ] Add parameter commands only for durable authored rows that exist in the node.
- [ ] Add profile-picking commands only if they mutate graph wiring or authored target state clearly.
- [ ] Keep command feedback specific: created node, selected profiles, invalid selection, missing profile, unsupported rail.
- [ ] Do not create a parallel Console-only Loft model.

#### 8. Toolbar And Viewport Workflow

- [ ] Decide whether the first toolbar is a node-header launcher, a viewport toolbar mode, or both.
- [ ] Reuse the same graph-authored `Profiles` input state when viewport picking adds/removes sections.
- [ ] If the toolbar supports profile picking, rehydrate selection from existing wires when reopened.
- [ ] If rails or guide curves are introduced, add them as real object/row contracts before making the toolbar depend on them.
- [ ] Keep viewer-only highlighting separate from authored profile membership.

#### 9. Edit History

- [ ] Add canonical history entries for durable Loft node creation/deletion when those graph operations already route through graph history.
- [ ] Add canonical history for Loft row commits such as `Type`, `Continuity`, `Closed`, and profile collection edits.
- [ ] Collapse live numeric/selector scrubs into semantic commit entries where the row pattern supports it.
- [ ] Exclude runtime progress, preview meshes, hover, selection, toolbar open state, and command transcript from canonical authored history.
- [ ] Update the Edit History planning docs if Loft introduces new row families that the generic node-row history direction does not yet cover.

#### 10. Build Path And History Projection

- [ ] Treat Loft as one feature-like CAD command row in later `Build Path`.
- [ ] Make its expanded row read the same authored params as the graph node.
- [ ] Ensure scrubbed preview can include/exclude the Loft result by graph dependency order.
- [ ] Keep Build Path a projection over the same graph, not a separate Loft feature stack.

#### 11. Tests And Verification

- [ ] Add registry/schema tests for the Loft node definition.
- [ ] Add connection validation tests for allowed and disallowed sources.
- [ ] Add selector/VM tests for visible Loft rows and invalid-state copy.
- [ ] Add evaluator/compiler tests for ordered profile requests.
- [ ] Add worker/runtime tests for supported success and failure cases.
- [ ] Add edit-history tests for durable Loft row commits.
- [ ] Add Console tests for Loft commands when command entry ships.
- [ ] Add UI tests only where behavior changed, not for static markup alone.
- [ ] Run the focused suites plus `npm.cmd run build` before closing an implementation phase.

#### 12. Docs And Tracking

- [ ] Update this Loft index when a new Loft phase is created or closed.
- [ ] Add standalone future docs under `Loft/Future/` once a slice becomes implementation-ready.
- [ ] Update `Nodes-Index.md` and `Nodes-List.md` when Loft status changes.
- [ ] Update `docs/CHANGELOG.md` for shipped implementation work.
- [ ] Update `docs/Doc-Log.md` for docs changes.

### Suggested Phase Ladder

#### [ ] Loft-1 - Family Contract And Profile Input Surface

Goal:
- create the implementation-ready contract for `Geometry/Loft` with one ordered profile collection input and one solid output.

Owns:
- registry/schema shape
- row surface contract
- valid source matrix
- visible unsupported states
- focused tests for node definition and validation

Does not own:
- final kernel geometry
- rails
- toolbar
- Console
- edit-history coverage beyond graph node creation if already generic

#### [ ] Loft-2 - Compile And Runtime Loft Result

Goal:
- lower ordered profiles into draft/authoritative geometry execution and publish one truthful result.

Owns:
- compiler/evaluator request shape
- worker draft/authoritative handling
- preview artifact and output handoff
- invalid profile diagnostics

Does not own:
- guide rails
- multi-body split behavior
- export-specific reconstruction

#### [ ] Loft-3 - Node UI, Console, Toolbar, And History Coverage

Goal:
- make Loft feel like a real authored CAD feature across app surfaces.

Owns:
- final visible node row polish
- Console create/edit commands
- first toolbar or viewport profile-picking workflow
- canonical edit-history entries for durable Loft row commits
- focused cross-surface tests

Does not own:
- advanced guide-rail modeling
- Build Path workspace mode implementation

#### [ ] Loft-4 - Rails, Splines, And Guide Curves

Goal:
- widen Loft beyond profile-only behavior after the app has honest curve/rail object contracts.

Owns:
- `Spline` / `Rail` / `GuideCurve` type decisions
- guide-row UI
- runtime semantics for guided loft
- toolbar selection for rails

Does not own:
- inventing rails as hidden toolbar state
- broad sketch taxonomy cleanup unless a dedicated Sketch phase owns it

### Open Questions

- Should the first Loft input be named `Profiles` or `Sections`?
- Should `StartProfile` and `EndProfile` remain visible aliases for a two-profile starter mode, or would that fight the ordered collection direction?
- Should profile order be controlled only by connection order at first, or should the Loft row support explicit reorder controls?
- Should `SurfaceBody` exist before Loft supports open profile or surface loft behavior?
- Should guide rails wait until `SketchCurves`, `Spline`, and `Rail` object rows are planned under Sketch/Nodes?
- Which Console verbs should ship first: `Loft`, `AddLoft`, `LoftProfile`, or a broader `Create Loft` command grammar?

### First Implementation Read

The safest first code pass is not the full Loft feature.

The safest first code pass is:
- one `Geometry/Loft` registry/schema entry
- one ordered `Profiles` input contract
- one visible node surface using shared rows
- one explicit unsupported runtime state if the kernel path is not ready
- validation that only honest profile sources can connect

Then the runtime pass can make that same authored contract produce geometry without changing the user's mental model.


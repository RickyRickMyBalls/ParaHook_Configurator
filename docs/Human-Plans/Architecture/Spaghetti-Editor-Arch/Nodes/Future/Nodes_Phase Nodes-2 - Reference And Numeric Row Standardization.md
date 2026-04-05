## Doc Header

### Doc History
7. 2026-04-05 01:02: Closed `Nodes-2C` after the live extrude `Depth` row adopted the shared managed-row controller path as the first visibly managed numeric `SWR` row, keeping the extracted numeric-row helper seam from `Nodes-2B` while making the visible `collapsed / essentials / expanded` behavior real enough that the broader `Nodes-2` lane can now close
6. 2026-04-05 00:59: Tightened `Nodes-2C` into an implementation-ready visible-adoption slice by naming the remaining gap between the extracted numeric-row props helper and the still-generic live `Depth` row behavior in `Extrude`, clarifying that this phase should adopt `Depth` as a real managed `SWR` row rather than only a helper-backed inline control, and locking the focused acceptance checks for row-state behavior and rendered summaries
5. 2026-04-05 00:57: Closed `Nodes-2B` after the live extrude `Depth` assembly band in `NodeView.tsx` was extracted into the first shared numeric-row props helper, keeping contract truth in `nodeTemplateContract`, generic rendering in `PortView`, and giving `Nodes-2C` a real extracted seam for visible family adoption cleanup
4. 2026-04-05 00:53: Tightened `Nodes-2B` into an implementation-ready extraction slice by naming the exact live `Depth` band in `NodeView.tsx` that should become the first shared numeric-row props/helper seam, clarifying what should remain owned by `PortView` versus the new extraction, and locking the narrow acceptance checks so the pass reduces real duplication without widening into a broader row-tree rewrite
3. 2026-04-05 00:42: Closed `Nodes-2A` after the first reusable row-family contract landed in `nodeTemplateContract`, the numeric-row contract was made explicit as a unit-aware lane with resolved-summary plus local-fallback rules, and the live extrude `Depth` row began consuming that contract language without widening into the later `Nodes-2B` extraction seam
2. 2026-04-05 00:40: Tightened `Nodes-2A` into an implementation-ready contract-locking slice by naming the live `Depth` row seam in `NodeView.tsx`, clarifying how `PortView` and `structuredWireRowController` fit the current gap, locking the exact numeric-row behavior that should be decided before extraction, and narrowing the acceptance checks so `Nodes-2B` can extract from one stable contract instead of from mixed local assumptions
1. 2026-04-05 00:34: Created this dedicated `Nodes-2` future doc by splitting the reusable row-type standardization ladder out of `Nodes-Index.md`, so the next node-template execution lane now has a real planning home for `reference row` and `numeric row` work before later output/composite/collection adoption

## [x] - `Nodes-2` - `Reference And Numeric Row Standardization`

### Summary

#### Purpose:
- turn the shared `SWR` foundation from `Nodes-1` into the first honest reusable row-family contracts

#### Owns:
- standardizing the first reusable `reference row` behavior
- standardizing the first reusable `numeric row` behavior
- using `Geometry/Extrude` `Depth` as the first real numeric-row proving case
- clarifying how row-owned local editors, wire precedence, units, and summaries should behave
- extracting only the smallest shared helper/component seams needed once the row contracts are locked

#### Does not own:
- full output-row standardization
- composite child-row rollout like `Vec2` / `Vec3`
- collection-row rollout like later plural profiles or loft sections
- the full dedicated extrude toolbar
- `Loft` adoption
- a giant node-template rewrite

#### Current seam read:

- `Nodes-1` already proved the shared shell and managed-row controller path in live `Sketch` and `Extrude` code
- `reference row` behavior is partly proven through:
  - `SketchPlane`
  - `SketchDraw`
  - sketch profile outputs
  - `ExtrusionProfile`
- the first row family that still risks drifting back into one-off node UI is the numeric path, especially `Depth`
- `Depth` still wants to become the first honest reusable `number:mm` row rather than remain only a locally authored extrude control

Current strongest read:
- `Nodes-2` should stay split into focused subphases
- `Depth` is still the best first numeric-row proving target because it is important, visible, bounded, and already adjacent to the shared row foundation

### Questions

#### [ ] Question 1 - What is the first canonical `reference row` proving surface after `Nodes-1`?

##### Suggested answer
- keep the already-landed `SketchPlane`, `SketchDraw`, sketch profile outputs, and `ExtrusionProfile` rows as the reference-row proving band

##### Why
- `Nodes-1` already moved those rows onto the shared foundation
- `Nodes-2` should refine and lock their contract rather than reopen family-specific markup work

#### [ ] Question 2 - What is the first canonical `numeric row` proving case?

##### Suggested answer
- `Geometry/Extrude` `Depth`

##### Why
- it is already user-visible and important
- it carries a real unit (`mm`)
- it needs a compact summary, a local editor, and honest wire precedence
- it is narrow enough to standardize without widening into a full family rewrite

#### [ ] Question 3 - What should the base numeric-row behavior be?

##### Suggested answer
- `collapsed`
  - header only
  - compact value summary
- `essentials`
  - one compact local editor in the attached body
- `expanded`
  - room for richer explanation, diagnostics, and later advanced controls only when the row genuinely needs them

##### Why
- this keeps numeric rows aligned with `SWR`
- it avoids inventing a parallel mini-panel system for simple scalar values

#### [ ] Question 4 - How should local values and wires interact on numeric rows?

##### Suggested answer
- a resolved wire stays the effective source of truth when present
- the row may still preserve the local fallback value
- the attached body should explain that relationship clearly without hiding the local authored value entirely

##### Why
- this matches the existing direction in `SketchPlane` and other managed rows
- it keeps the UI honest about what is driving the final result

### Spec

Locked top-level direction:
- treat `Nodes-2` as the first reusable row-family standardization lane after the shared shell foundation
- keep this lane focused on:
  - `reference row`
  - `numeric row`
- hand later row families forward to `Nodes-3`

Locked `reference row` rules to prove in this lane:
- one row still owns one real wire target/source
- header behavior stays aligned with `SWR`
- row labels may stay user-facing even when internal port ids differ
- attached bodies can host compact reference-specific controls or explanations without becoming detached family panels
- visible behavior across the first reference rows should now be described as one reusable row family, not as isolated local exceptions

Locked `numeric row` rules to prove in this lane:
- numeric rows stay real `SWR` rows, not detached sliders floating elsewhere in the node
- numeric rows must support:
  - compact resolved-value summary in the header
  - unit-aware local editor in `essentials`
  - richer explanation or future controls in `expanded` only when honestly needed
- wire precedence versus local fallback must remain explicit
- labels, summary text, and row-toggle language should stay consistent with the shared row controller path

Locked scope boundary:
- do not widen this phase into:
  - full output-row standardization
  - full composite-row rollout
  - full collection-row rollout
  - loft-family planning
  - broad toolbar redesign

### Subphases

#### [x] `Nodes-2A` - `Lock Reference And Numeric Row Contract`

Purpose:
- finish the rule-locking pass for the first reusable row families before more helper extraction happens

Owns:
- locking the shared forward definition of:
  - `reference row`
  - `numeric row`
- naming `Depth` as the first numeric-row proving case
- locking the base row-state behavior for numeric rows
- locking wire-versus-local-value expectations for numeric rows

Does not own:
- the final extracted numeric-row helper/component
- wider output/composite/collection work
- large visual cleanup by itself

Current seam read:
- the current shared helper seam covers row mode/cycle/labels, but not yet a reusable row-family contract for numbers
- `Depth` is visible enough that leaving its behavior half-local would weaken the foundation we just built
- the live `Depth` path is still mostly a direct `renderInputPortByType(... valueInput ...)` handoff in `src/app/spaghetti/canvas/NodeView.tsx`
- that means the row currently gets generic inline number editing from `PortView`, but it does not yet read as a clearly named reusable `numeric row` family on top of the shared `SWR` controller layer
- the shared seam currently stops at:
  - `src/app/spaghetti/canvas/nodeTemplateContract.ts`
    - row-family inventory and row/block default helpers
  - `src/app/spaghetti/canvas/structuredWireRowController.ts`
    - row mode derivation
    - row cycle behavior
    - row-toggle labels
  - `src/app/spaghetti/canvas/PortView.tsx`
    - generic row header, resolved-value label, inline value editor, and attached-body rendering
- `Nodes-2A` should decide what numeric-row behavior belongs to that reusable family before `Nodes-2B` extracts another shared seam on top

Locked contract questions this subphase should answer:
- what exact summary text should a numeric row show in:
  - `collapsed`
  - `essentials`
  - `expanded`
- when a numeric row is wire-driven, what should stay visible:
  - effective resolved value
  - local fallback value
  - driven message
- whether `essentials` should stay:
  - one compact inline editor only
  - or one compact inline editor plus one short attached-body explanation
- whether `expanded` should add:
  - explanation only
  - diagnostics
  - later advanced controls
  - or stay visually identical to `essentials` until there is a real need
- whether the first numeric-row contract is:
  - `unit-aware number row`
  - or a narrower `Depth-specific` rule set that happens to be reusable later

Locked answer direction for now:
- treat the first proving family as a reusable `unit-aware numeric row`, not as a one-off `Depth` exception
- keep the first numeric-row contract narrow:
  - compact resolved summary in the header
  - compact local editor in `essentials`
  - explicit wire-versus-local explanation
  - no speculative advanced control stack yet
- let `expanded` reserve space for richer explanation or diagnostics, but do not require brand-new controls in `Nodes-2A`

Nearby implementation seams this contract governs next:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/structuredWireRowController.ts`
- `src/app/spaghetti/canvas/nodeTemplateContract.ts`
- focused node-view tests

Specific live code pressure points this subphase should keep in view:
- `src/app/spaghetti/canvas/NodeView.tsx`
  - extrude `Depth` currently renders through `valueInput`
  - summary text is currently only `${formatPinValue(effectiveDepthMm)} mm`
  - no numeric-row-specific attached body exists yet
- `src/app/spaghetti/canvas/PortView.tsx`
  - generic inline number editing already exists
  - `resolvedValueLabel`, `drivenMessage`, and `attachedBodyContent` are the likely reusable numeric-row ingredients
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - already covers extrude presence of `Depth`
  - already covers wired manual-depth editor disable behavior on the older part-template path
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - currently covers extrude `SketchProfile` row cycling more than `Depth`
  - likely needs later expansion once numeric-row state behavior is locked

Implementation-ready checks:
- confirm `Depth` is the first numeric-row proving target
- confirm the numeric row remains attached to the row system instead of becoming a detached mini-toolbar
- confirm `collapsed / essentials / expanded` behavior is described clearly enough that `Nodes-2B` can extract a helper without reopening UX basics
- confirm the reference-row family is described as a reusable lane rather than only as the current sketch/extrude examples
- confirm the first numeric-row contract is explicitly `unit-aware`
- confirm the contract states what remains visible when the numeric row is wire-driven
- confirm `Nodes-2A` does not quietly widen into composite-row or transform-channel decisions

Suggested execution order:
1. Re-read `Nodes-1`, `Nodes-Index.md`, and the live `Sketch` / `Extrude` row surfaces.
2. Re-read the live `Depth` render path in `src/app/spaghetti/canvas/NodeView.tsx` and the generic row affordances in `src/app/spaghetti/canvas/PortView.tsx`.
3. Lock the reusable `reference row` and `numeric row` definitions here.
4. Name the exact numeric-row behaviors that `Nodes-2B` is allowed to extract versus what still stays out of scope.
5. Align the umbrella `Nodes-Index.md` wording only if the top-level summary needs to change.
6. Hand forward into `Nodes-2B` extraction work.

Acceptance checks:
- there is one stable written definition of `reference row`
- there is one stable written definition of `numeric row`
- `Depth` is explicitly named as the first numeric-row target
- `Nodes-2B` can start without reopening the same behavior questions
- the doc names the exact live files that currently hold the `Depth` row seam
- the doc makes clear that `PortView` already owns generic inline number editing, so `Nodes-2B` should extract around that reality instead of duplicating it elsewhere

Definition of done:
- `Nodes-2` has one stable row-family contract for reference and numeric rows
- later implementation can extract helpers from a locked direction instead of from local node assumptions
- `Nodes-2B` can start from an explicit seam read:
  - what `Depth` is today
  - what numeric-row behavior must become reusable next
  - what remains intentionally out of scope until later phases

Current shipped output:
- `src/app/spaghetti/canvas/nodeTemplateContract.ts` now holds the first explicit code-side contract for:
  - reusable `reference row` behavior
  - reusable `numeric row` behavior
  - unit-aware numeric-row summary text
  - wire-driven numeric-row fallback messaging
- `src/app/spaghetti/canvas/NodeView.tsx` now routes the live extrude `Depth` row through that contract language for:
  - header summary
  - driven fallback messaging
  - numeric-row explanation copy
- focused contract coverage now exists in:
  - `src/app/spaghetti/canvas/nodeTemplateContract.test.ts`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`

#### [x] `Nodes-2B` - `Extract Shared Numeric Row Helper`

Purpose:
- turn the locked numeric-row contract into the smallest real shared implementation seam

Owns:
- extracting the first reusable numeric-row helper/component seam
- reducing repeated numeric-row UI glue around summary/value/editor behavior
- preserving the already-landed shared row controller path while layering numeric-row semantics above it

Does not own:
- output/composite/collection standardization
- full family-wide adoption
- a new toolbar system

Current seam read:
- the shell and row controller are now shared
- the remaining missing layer is the first reusable row-family treatment for numeric values with units
- after `Nodes-2A`, the live extrude `Depth` row is now assembled from one narrow band in `src/app/spaghetti/canvas/NodeView.tsx`:
  - derive local/effective depth
  - build unit-aware summary text
  - build driven fallback message
  - build attached-body explanation copy
  - pass those pieces to `renderInputPortByType(... valueInput ...)`
- that is the exact extraction target for `Nodes-2B`
- the pass should not invent a second row-rendering system; it should package the current numeric-row contract into one reusable seam that still hands off to the existing `PortView` path

Locked extraction target:
- extract one shared numeric-row props/helper seam that can package:
  - `resolvedValueLabel`
  - `drivenMessage`
  - `attachedBodyContent`
  - `valueInput`
- keep `PortView` as the owner of:
  - generic row header chrome
  - generic inline number editing
  - generic driven-message rendering
  - generic attached-body rendering
- keep `structuredWireRowController` as the owner of:
  - row mode derivation
  - row cycle behavior
  - row-toggle labels
- do not widen this extraction into:
  - a new parallel port renderer
  - composite-row behavior
  - collection-row behavior
  - output-row standardization
  - a generalized tree-child system

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/nodeTemplateContract.ts`
- a new shared numeric-row helper if needed
- focused canvas tests

Most likely first helper shape:
- one helper in the canvas layer that takes:
  - current value
  - local fallback value
  - unit label
  - driven state
  - editor callbacks
  - explanation copy
- and returns the narrow prop bundle already consumed by `renderInputPortByType`

Specific live code pressure points this subphase should keep in view:
- `src/app/spaghetti/canvas/NodeView.tsx`
  - the current extrude `Depth` block should shrink materially after extraction
  - the extracted seam should stay close enough to `NodeView` that future numeric rows can adopt it without another rewrite
- `src/app/spaghetti/canvas/nodeTemplateContract.ts`
  - already owns the contract wording and message builders
  - should stay the home for contract truth, not for full render orchestration
- `src/app/spaghetti/canvas/PortView.tsx`
  - already provides the generic inline editor and row-body slots
  - should not absorb family-specific numeric-row semantics directly in this pass
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - already has the first `Depth` summary and driven-fallback assertions
  - should expand only enough to protect the extracted seam behavior
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - may stay mostly unchanged in `2B` unless the extraction affects row-state behavior

Implementation-ready checks:
- extract only the smallest numeric-row seam that is clearly shared today
- do not over-design for future composite or collection rows
- preserve existing extrude depth behavior where it is already correct
- keep unit-aware summary and editor behavior explicit
- preserve the `Nodes-2A` contract wording exactly; `2B` should not reopen those decisions
- confirm the extracted seam still routes through the same generic `PortView` rendering path
- confirm the pass measurably reduces the inline `Depth` assembly logic in `NodeView.tsx`

Suggested execution order:
1. Re-read the current extrude `Depth` row assembly band in `NodeView.tsx`.
2. Separate what is contract truth, what is generic `PortView` behavior, and what is numeric-row-specific glue.
3. Extract the smallest helper that returns the numeric-row prop bundle for `renderInputPortByType`.
4. Repoint `Depth` to that seam first.
5. Extend focused tests around the extracted seam plus the visible `Depth` expectations already locked in `2A`.

Acceptance checks:
- one real shared numeric-row helper/component exists
- `Depth` consumes it in the live node surface
- the pass measurably reduces family-local numeric-row glue
- the pass does not widen into unrelated row families
- the extracted seam is clearly layered between:
  - contract truth in `nodeTemplateContract.ts`
  - generic rendering in `PortView.tsx`
  - family adoption in `NodeView.tsx`

Definition of done:
- the first reusable numeric-row seam exists in code
- `Depth` is no longer a one-off local implementation
- `Nodes-2C` can start from a real extracted numeric-row seam instead of from one family-local proving block

Current shipped output:
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts` now owns the first shared numeric-row props/helper seam for:
  - unit-aware summary text
  - wire-driven fallback messaging
  - attached-body explanation copy handoff
  - inline numeric editor prop assembly
- `src/app/spaghetti/canvas/NodeView.tsx` now routes the live extrude `Depth` row through that helper instead of assembling the numeric-row prop bundle inline inside the extrude branch
- focused helper coverage now exists in:
  - `src/app/spaghetti/canvas/structuredWireNumericRowProps.test.ts`
  - the earlier contract coverage in `src/app/spaghetti/canvas/nodeTemplateContract.test.ts`

#### [x] `Nodes-2C` - `Adopt Numeric Row In Extrude`

Purpose:
- prove the shared numeric-row seam in a live family surface

Owns:
- adopting the reusable numeric-row behavior in `Geometry/Extrude`
- locking the visible `Depth` row behavior across `collapsed / essentials / expanded`
- confirming numeric-row summaries, local editor behavior, and wire precedence read well in practice

Does not own:
- full extrude-toolbar enrichment
- output/composite/collection rollout
- loft adoption

Current seam read:
- `Extrude` is the right proving family because it already shares the shell foundation and has one obvious scalar row target
- after `Nodes-2B`, the numeric-row prop bundle is shared, but the live `Depth` row still reads as a generic inline number row inside the extrude secondary stack
- the remaining visible gap is that `Depth` is not yet clearly behaving like a first-class managed `SWR` row in the same deliberate way the earlier reference-row adoption was made visible
- `Nodes-2C` should therefore focus on visible adoption behavior, not on another extraction:
  - how `Depth` opens across `collapsed / essentials / expanded`
  - what stays visible in the header versus the body
  - how the driven/fallback explanation reads in practice
  - whether `Depth` should gain the same explicit managed-row affordances already proven on the reference-row side

Locked adoption target:
- make `Depth` read as the first honest managed numeric row in `Geometry/Extrude`
- keep the extracted numeric-row helper from `Nodes-2B`
- layer visible adoption behavior on top of it instead of rebuilding the seam again

Specific visible questions this subphase should answer:
- should `Depth` stay always open whenever the extrude input stack is visible, or should it adopt managed `collapsed / essentials / expanded` row behavior
- if `Depth` becomes a managed row, what should each state show:
  - `collapsed`
    - compact header summary only
  - `essentials`
    - header plus inline editor
  - `expanded`
    - header, inline editor, and attached-body explanation
- should the numeric-row explanation body be suppressed in `essentials` and reserved only for `expanded`
- should label-click behavior match the managed-row cycle pattern already used elsewhere

Locked answer direction for now:
- treat `Depth` as the first visible managed numeric row, not as an always-open generic control
- keep the state model narrow:
  - `collapsed` = summary only
  - `essentials` = inline editor
  - `expanded` = inline editor plus explanation body
- preserve the current unit-aware summary and driven-fallback contract from `2A`
- preserve the extracted helper seam from `2B`

Acceptance checks:
- `Depth` reads like a real shared row, not a leftover custom control
- compact summary, inline editor, and expanded behavior all feel coherent
- tests cover the expected row-state transitions and rendered summaries
- the visible adoption reuses the shared row controller path instead of inventing a second numeric-row state mechanism
- the visible adoption reuses the extracted numeric-row helper instead of duplicating the prop assembly inline again

Definition of done:
- the first reusable numeric row is visibly real in one live family
- `Nodes-3` can begin from a proven row-family path rather than from theory

Nearby implementation seams most likely to change:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/structuredWireRowController.ts`
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

Implementation-ready checks:
- keep this pass focused on visible adoption of `Depth`, not broader numeric-row rollout
- do not reopen `Nodes-2A` contract wording
- do not collapse the extracted helper back into `NodeView`
- extend geometry-mode tests enough to prove the managed-row state transitions for `Depth`

Current shipped output:
- `src/app/spaghetti/canvas/NodeView.tsx` now treats the live extrude `Depth` row as a managed numeric `SWR` row using:
  - the shared row controller for `collapsed / essentials / expanded`
  - the extracted numeric-row props helper from `Nodes-2B`
- `Depth` now reads visibly as:
  - `collapsed` = summary only
  - `essentials` = inline editor
  - `expanded` = inline editor plus explanation body
- focused visible-adoption coverage now exists in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

### Suggested Execution Order

1. Lock the row-family contract in `Nodes-2A`.
2. Extract the smallest reusable numeric-row seam in `Nodes-2B`.
3. Prove it visibly in `Extrude` through `Nodes-2C`.
4. Hand forward into `Nodes-3` for output/composite/collection row families.

### Acceptance Checks

- `reference row` and `numeric row` both have stable written definitions
- `Depth` is explicitly the first numeric-row target
- the shared implementation seam stays smaller than a broad template rewrite
- the visible node behavior remains aligned with `SWR`
- later row families are intentionally deferred to `Nodes-3`

### Definition Of Done

- `Nodes-2` is only marked complete once:
  - the reusable row-family contract is locked
  - the first shared numeric-row seam exists in code
  - `Depth` visibly proves that seam in `Extrude`

Current shipped output:
- `Nodes-2A` locked the first reusable `reference row` and `numeric row` contract
- `Nodes-2B` extracted the first shared numeric-row props/helper seam
- `Nodes-2C` made `Depth` the first visibly managed numeric row in a live family

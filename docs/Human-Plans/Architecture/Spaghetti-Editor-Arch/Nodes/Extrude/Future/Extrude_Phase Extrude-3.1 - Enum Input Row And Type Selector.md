# `Extrude-3.1` - `Enum Input Row And Type Selector`

## Doc Header

### Doc History
12. 2026-04-05 13:04: Closed `Extrude 3.1 Phase 5 - Primitive Enum Row Value Ownership Parity` after the shared enum row adopted the same unwired-versus-driven ownership rule already proven by `Depth`, so unwired `Type` rows now stay on the authored `Body / Walls` value while real incoming whole-number wires still own the effective displayed slot and the family now points at `Phase 6` only as a final live-surface cleanup reserve
11. 2026-04-05 12:57: Reopened the `Extrude-3.1` ladder by adding `Extrude 3.1 Phase 5 - Primitive Enum Row Value Ownership Parity` and `Extrude 3.1 Phase 6 - Enum Row Integration Verification And Cleanup`, so the shared enum row now has explicit post-`Phase 4` homes for adopting the same unwired-versus-driven ownership contract already proven by `Depth` and for any final live-surface hardening still needed after that parity repair
10. 2026-04-05 11:10: Closed `Extrude 3.1 Phase 4 - Enum Row Fill And Endcap Cleanup` after the shared enum row switched onto the sturdier custom `ParaSelect` track path, the enum fill/marker and step arrows started responding through the same shared interaction logic, and the enum endcap chevrons were tightened to the exact settled `Depth` geometry so the full `Extrude-3.1` ladder now reads as finished enum-row groundwork
9. 2026-04-05 11:02: Added `Extrude 3.1 Phase 4 - Enum Row Fill And Endcap Cleanup` as the new narrow post-`Phase 3` follow-on so the shared enum row now has an explicit home for fixing the still-broken fill response, unreliable step arrows, and the remaining mismatch against the settled `Depth` endcap/chevron treatment before the broader `Extrude-3` authored-semantics stack resumes
8. 2026-04-05 10:56: Closed `Extrude 3.1 Phase 3 - Whole-Number Driven Enum Input` after `Geometry/Extrude` gained a real unitless-number `Type` input port, the shared enum row became a true pin-bearing input row with stable enum color treatment, and whole-number numeric wires now drive the enum fill/marker and effective option while preserving the local authored fallback value
7. 2026-04-05 10:33: Tightened `Extrude 3.1 Phase 3 - Whole-Number Driven Enum Input` into an implementation-ready slice by grounding it in the live shared enum-row helper/view seam, the current `PortKind` and color limitations in `spaghettiTypes.ts` plus `typeColors.ts`, and the already-existing number-input contract on `Geometry/Extrude`, locking the narrow first cut as whole-number-driven enum selection without widening into a full enum/string graph-port type unless the existing wiring model proves insufficient
6. 2026-04-05 10:21: Closed `Extrude 3.1 Phase 2 - Enum Row Visual Shell Parity` after reordering the live `Extrude` input stack to `SketchProfile -> Type -> Depth`, stripping the enum row down to one visible shell, and restyling the shared `ParaSelect` row chrome so `Extrude Type` now reads closer to the settled `Depth` and `SketchProfile` shell language while keeping the later pin-driven enum contract staged for `Phase 3`
5. 2026-04-05 10:11: Normalized the `Extrude-3.1` subphase headings to the cleaner `Extrude 3.1 Phase N` format and tightened `Extrude 3.1 Phase 2 - Enum Row Visual Shell Parity` further into an implementation-ready visual cleanup slice by locking the exact shared row/component and CSS seams, the visual constraints that must stay fixed, and the focused acceptance checks for the next pass
4. 2026-04-05 10:08: Reworked `Extrude-3.1` from one flat phase note into a real `3.1-1` through `3.1-3` subphase ladder so the shipped shared enum-row foundation, the next row-style parity cleanup, and the later whole-number-driven enum-input contract each have their own honest execution home instead of piling more work into one already-closed slice
3. 2026-04-05 09:58: Closed `Extrude-3.1` after the repo gained the first shared `enum input row` helper plus shared `StructuredWireEnumRow` view, `Extrude Type` moved out of the old local `Details`-hosted button group and into `Inputs`, and the first live adoption shipped as the current `Basic` / `Twist` selector while recording that real wire-bearing enum ports still need a later graph type-system lane
2. 2026-04-05 09:45: Tightened `Extrude-3.1` into an implementation-ready slice after reading the live `Extrude Type` button group in `src/app/spaghetti/canvas/NodeView.tsx`, the working `ParaSelect` selector behavior in `src/app/components/ParaSelect.tsx`, the primitive-row render seam in `src/app/spaghetti/canvas/PortView.tsx`, and the already-existing `extrudeType` node param in `src/app/spaghetti/registry/nodeRegistry.ts`, locking the exact helper/render extraction target, the in-scope behavior, and the focused test plan
1. 2026-04-05 09:41: Carved task `1` out of the broader `Extrude-3` stack into this dedicated future phase so the first explicit `Extrude Type` control can be implemented as the first reusable primitive `enum input row` template instead of landing as another one-off node-local selector

### Purpose

Use this doc as the dedicated planning and execution surface for the `Extrude-3 / Task 1` row-family ladder.

The goal here is:
- first ship the shared enum-row foundation
- then make the enum row visually match the newer primitive-row language used by `SketchProfile` and `Depth`
- then let the enum row accept whole-number primitive input so authored number wires can drive enum selection honestly
- then make the enum row obey the same local-versus-driven ownership rule already proven by `Depth`
- then close any remaining live-surface integration gaps without mixing that cleanup into the broader `Extrude-3.2+` semantics work

### Scope

This phase family covers:
- the shared primitive `enum input row` helper and first live `Extrude Type` adoption
- the follow-on row-style cleanup needed to match the newer primitive-row shell language
- later whole-number-driven enum selection through a real input pin contract
- the small post-driven cleanup needed to make enum fill and endcaps behave as cleanly as the settled `Depth` row
- the later ownership-parity repair so unwired enum rows follow the authored local value while driven rows follow the effective wire value
- any final node-surface integration verification and cleanup needed after that ownership parity lands

This phase family does not cover:
- the later `Extrude-3` semantic rename from `Basic/Twist` to the broader `Body/Profile` authored story
- extent-mode rows
- `Start Depth` / `End Depth`
- a broader graph type-system expansion beyond what the later enum-input-driving phase honestly needs

## Doc Body

### Summary

`Extrude-3.1` is now the dedicated enum-row ladder for `Extrude Type`.

Current baseline:
- `Phase 3.1-1` has already shipped the first shared enum-row foundation through:
  - `structuredWireEnumRowProps`
  - `StructuredWireEnumRow`
  - the first live `Extrude Type` adoption under `Inputs`
- `Phase 3.1-2` has now settled the first live enum row into the calmer shell language already proven by:
  - `SketchProfile`
  - `Depth`
- the row now reads as:
  - `SketchProfile`
  - `Type`
  - `Depth`
  under `Inputs` instead of leading with a reused selector widget
- `Phase 3.1-3` has now completed the driven-input contract through:
  - a real `Type` input pin
  - one stable enum-row color
  - whole-number primitive input mapping to enum slots
  - driven fill/marker behavior that follows the effective slot while preserving the local fallback selection
- `Phase 3.1-4` has now closed the remaining parity cleanup through:
  - honest enum fill response
  - reliable left/right step arrows
  - endcap chevrons that match the settled `Depth` row treatment more closely
- `Phase 3.1-5` is now shipped and locks the same value-ownership rule as `Depth`:
  - no wire in -> local authored value owns the row and editing stays enabled
  - wire in -> effective wire value owns the row and local editing is disabled
- `Phase 3.1-6` is reserved as the final shared enum-row hardening slice if any visible menu/arrow/drag integration gaps still remain after the ownership parity fix lands

Locked recommendation:
- keep the already-shipped shared row foundation as `Phase 3.1-1`
- keep the now-shipped visual cleanup as `Phase 3.1-2`
- treat the driven whole-number enum-input contract as shipped in `Phase 3.1-3`
- treat `Phase 3.1-4` as the first post-driven cleanup slice, not the final one
- treat `Phase 3.1-5` as shipped and aligned with the already-proven `Depth` value-ownership contract
- keep `Phase 3.1-6` available for final app-surface integration cleanup if the repaired row still needs hardening after `Phase 3.1-5`
- hand the later authored-semantics work forward to the broader `Extrude-3` ladder instead of mixing those semantics into the remaining `3.1` row-behavior cleanup

Why this order is healthier:
- the first pass already proved the shared row template exists
- visual parity should settle before the row gets cloned into more selectors
- whole-number-driven enum input landed only after the row shell and lane language were already stable

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`
  - already owns the first helper-layer enum row contract
  - is the right place for later value/options/disabled shaping
- `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx`
  - already owns the first shared row-owned enum selector view
  - is the right place for later row-shell parity cleanup
- `src/app/components/ParaSelect.tsx`
  - already owns selector interaction, option cycling, fill, marker, and drag-scrub behavior
  - is the right place to keep shared enum selection behavior reusable
- `src/app/spaghetti/canvas/NodeView.tsx`
  - already uses the shared enum row for `Extrude Type`
  - is the right proving surface for later visual and driven-input follow-ons
- `src/app/theme/surfaces/spaghetti.css`
  - already owns the visual shell language for:
    - `SketchProfile`
    - `Depth`
    - the first enum row skin
  - is the right place for the row-style parity pass
- `src/app/spaghetti/schema/spaghettiTypes.ts`
  - still does not have a real `enum` / `string` port kind
  - is the main reason the first shipped enum row landed as a one-line input control row instead of a true wire-bearing port

### Phase Breakdown

1. `Phase 3.1-1 - Shared Enum Row Foundation And First Extrude Adoption`
Reason:
- the repo first needed one reusable enum-row template before any later shell polish or driven-input behavior could land honestly

2. `Phase 3.1-2 - Enum Row Visual Shell Parity`
Reason:
- the row should visually settle into the same calm shell language as `SketchProfile` and `Depth` before more enum rows adopt the pattern

3. `Phase 3.1-3 - Whole-Number Driven Enum Input`
Reason:
- once the row shell was visually stable, the next honest feature was letting a whole-number primitive input drive enum selection with a real pin, color, and discrete option mapping

4. `Phase 3.1-4 - Enum Row Fill And Endcap Cleanup`
Reason:
- once the real driven enum contract landed, the remaining cleanup could be isolated to the shared enum row itself so fill response, arrow stepping, and endcap visuals could be brought up to the same settled standard as `Depth` without mixing that polish into the broader `Extrude-3` authored-semantics work

5. `Phase 3.1-5 - Primitive Enum Row Value Ownership Parity`
Reason:
- the live `Type` row still needs to follow the same unwired-versus-driven ownership rule already proven by `Depth`, so local authored enum choice stays active when no wire is present and effective wire value only takes over when a real whole-number input is connected

6. `Phase 3.1-6 - Enum Row Integration Verification And Cleanup`
Reason:
- if the row still has visible menu, arrow, drag, or shell-integration issues after ownership parity lands, those should have one final dedicated cleanup slice instead of being folded into the broader `Extrude-3.2+` semantics ladder

## [x] Extrude 3.1 Phase 1 - Shared Enum Row Foundation And First Extrude Adoption

### Summary

#### Purpose:
- ship the first shared primitive `enum input row`
- use `Extrude Type` as the first live proving adoption

#### Current read:
- `Depth` already proved the first primitive numeric row
- `Extrude Type` was still a local button group in `NodeView`
- `ParaSelect` already held the selector interaction behavior needed for a shared enum row
- the graph type system still had no honest `enum` / `string` port kind, so the first shipped enum row had to land as a one-line input control row under `Inputs`

#### Locked output:
- `structuredWireEnumRowProps.ts`
- `StructuredWireEnumRow.tsx`
- `Extrude Type` under `Inputs`
- old `Details`-hosted type buttons removed

### Questions / Decisions

#### [x] Question 1 - What is the row family name?

##### Locked answer
- `enum input row`

##### Why
- `ParaSelect` describes the interaction widget, not the row-family architecture

#### [x] Question 2 - Should the first shipped row be under `Inputs` or `Details`?

##### Locked answer
- `Inputs`

##### Why
- `Extrude-3` already locked the node shell to `Inputs` plus `Outputs`

#### [x] Question 3 - Is the first shipped row a real wire-bearing port?

##### Locked answer
- no
- it is a one-line shared input control row under `Inputs`

##### Why
- the graph port schema still has no `enum` / `string` port kind

### Implementation Spec

Shipped implementation:
1. Added the shared helper in `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`
2. Added the shared row view in `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx`
3. Reused `ParaSelect` interaction inside that shared row
4. Moved `Extrude Type` into `Inputs`
5. Deleted the old local `Details`-hosted type button group from `NodeView`

Shipped verification:
- helper test coverage in `src/app/spaghetti/canvas/structuredWireEnumRowProps.test.ts`
- selector coverage in `src/app/components/ParaSelect.test.tsx`
- static render expectations updated in `src/app/spaghetti/canvas/NodeView.test.tsx`
- direct `NodeView.geometryMode` suite still blocked before collection by the existing `Worker is not defined` runner startup issue

## [x] Extrude 3.1 Phase 2 - Enum Row Visual Shell Parity

### Summary

#### Purpose:
- make the shared enum row visually match the calmer primitive-row shell language already proven by `SketchProfile` and `Depth`

#### Current read:
- the first shipped enum row works, but still reads more like reused `ParaSelect` chrome than a fully settled node-row shell
- the target visual rhythm should be:
  - `SketchProfile` first
  - `Type` second
  - `Depth` third
- `Depth` is currently the closer style reference because it already has:
  - working fill bar
  - endcap arrows
  - settled one-line shell rhythm

#### Locked direction:
- keep the row one line
- keep it under `Inputs`
- move the style closer to `Depth`
- keep the selected enum value visible inline
- make the unfilled lane feel like the normal row shell, not a second nested control

### Questions / Decisions

#### [x] Question 1 - Which visual reference should guide the enum row cleanup?

##### Locked answer
- use `Depth` as the primary visual reference
- keep overall shell parity with the neighboring `SketchProfile` row

##### Why
- `Depth` already has the working fill bar and endcap language
- `SketchProfile` still matters for row height, spacing, and overall shell calmness

#### [x] Question 2 - Should this phase add the later input pin and wiring behavior already?

##### Locked answer
- no

##### Why
- this phase is visual parity first
- the pin-driven enum contract belongs to `Phase 3.1-3`

### Implementation Spec

Shipped implementation:
1. Reordered the live `Extrude` input stack in `src/app/spaghetti/canvas/NodeView.tsx` so the authored rhythm now reads `SketchProfile -> Type -> Depth`
2. Simplified `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx` so the shared enum row uses one visible shell instead of a row shell plus a second nested selector box
3. Extended `src/app/components/ParaSelect.tsx` with shared chevron-cap rendering so the enum row can reuse the calmer primitive-row endcap language without forking selector behavior
4. Rebuilt the enum-row skin in `src/app/theme/surfaces/spaghetti.css` so the shell, track, fill, marker, label lane, and selected-value lane now read closer to `Depth` while staying aligned against `SketchProfile`
5. Updated `src/app/spaghetti/canvas/NodeView.test.tsx` so the static render checks now confirm the settled enum-row shell and the `SketchProfile -> Type -> Depth` ordering

Scope honored:
- kept this pass visual-only
- kept the row under `Inputs`
- avoided adding the later input pin
- avoided whole-number-driven enum selection
- avoided widening the graph schema into an enum/string port type
- avoided renaming `Basic` / `Twist` into the later `Extrude-3` authored-semantic story

Shipped verification:
- passed `npm.cmd exec vitest run src/app/spaghetti/canvas/structuredWireEnumRowProps.test.ts src/app/components/ParaSelect.test.tsx`
- passed `.\node_modules\.bin\tsc.cmd -b --pretty false`
- direct `NodeView` suite verification remains blocked before collection by the existing `Worker is not defined` runner startup issue

#### Definition of done:
- `Extrude Type` now reads like a settled node row instead of reused `ParaSelect` chrome
- the row visually sits between `SketchProfile` and `Depth`
- the shell, endcaps, fill, marker, label lane, and selected-value lane now follow the calmer primitive-row language more closely
- no later pin-driven or enum-port behavior had to leak into this visual cleanup slice

## [x] Extrude 3.1 Phase 3 - Whole-Number Driven Enum Input

### Summary

#### Purpose:
- let the shared enum row become a real input-driven row with:
  - input pin
  - row color
  - whole-number primitive input selecting enum options

#### Current read:
- the current shared enum row is still only a local authored input control row
- the later desired behavior is:
  - a real input pin
  - a visible port color
  - if the user plugs in a whole-number primitive, the row should map that integer to the enum slot
- the graph type system still has no honest `enum` / `string` port kind, so the clean narrow path is likely:
  - number-driven enum selection
  - integer slot mapping
  - clamp/round to valid option indices

#### Locked direction:
- accept a whole-number primitive input
- map integers to enum slots deterministically
- use discrete fill positions across the enum range
- disable local editing while a wire drives the row
- keep the fallback local value visible

### Questions / Decisions

#### [x] Question 1 - What kind of upstream primitive should drive the enum row first?

##### Locked answer
- whole-number numeric input

##### Why
- the current graph port system already has number ports
- this avoids inventing a brand-new enum/string graph port kind in the same slice

#### [x] Question 2 - How should driven enum selection map incoming values?

##### Locked answer
- round to the nearest integer
- clamp to the valid option index range

##### Why
- it is deterministic
- it keeps the first-cut driven contract narrow and easy to reason about

### Implementation Spec

Shipped implementation:
1. Added the real unitless-number `Type` input contract for `Geometry/Extrude` in `src/app/spaghetti/registry/nodeRegistry.ts`, including deterministic whole-number-to-slot helpers plus compute-time mapping from numeric input to the effective `Basic` / `Twist` value
2. Extended `src/app/spaghetti/selectors/selectNodeVm.ts` so the extrude VM now carries:
   - local authored type
   - effective displayed type
   - driven state
   derived from the live `Type` input wire when present
3. Reworked `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts` so the shared enum-row helper now separates:
   - local fallback value
   - displayed effective slot value
   - driven/disabled row state
   - driven fallback messaging
4. Upgraded `src/app/components/ParaSelect.tsx` so the shared selector can display one effective slot for fill/marker while still showing the preserved local authored value text and disabling local editing when driven
5. Rebuilt `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx` into a true pin-bearing shared input row that reuses the settled shell language while exposing:
   - a real left input pin
   - stable enum-row color
   - drop-state handling
   - driven styling
6. Updated `src/app/spaghetti/canvas/NodeView.tsx` so the live `Extrude Type` row now uses the real `Type` input port and the new driven/local fallback split without regaining a local one-off selector implementation

Scope honored:
- kept the first driven contract on whole-number numeric input
- kept the row one line and visually aligned with the `Phase 3.1-2` shell-polished version
- preserved the local authored fallback value when the wire is removed
- avoided renaming `Basic` / `Twist` into the later `Body` / `Profile` authored-semantic story
- avoided extent-mode or depth-mode follow-on work
- avoided widening the graph into a first-class enum/string port kind

Shipped verification:
- passed `npm.cmd exec vitest run src/app/spaghetti/canvas/structuredWireEnumRowProps.test.ts src/app/components/ParaSelect.test.tsx src/app/spaghetti/selectors/selectNodeVm.test.ts`
- passed `.\node_modules\.bin\tsc.cmd -b --pretty false`
- direct `NodeView` suite verification still remains blocked before collection by the existing `Worker is not defined` runner startup issue

#### Definition of done:
- `Extrude Type` now has a real input pin and stable row color
- plugging in a whole-number primitive input deterministically selects the enum slot
- the fill and marker snap to the correct discrete enum position while driven
- local authored editing is disabled while driven
- removing the wire restores the preserved local authored fallback value cleanly

## [x] Extrude 3.1 Phase 4 - Enum Row Fill And Endcap Cleanup

### Summary

#### Purpose:
- fix the remaining shared enum-row cleanup bugs after the driven-input contract shipped:
  - the fill bar still does not read honestly
  - the left/right arrows still do not behave reliably
  - the enum endcap arrows still do not fully match the settled `Depth` row treatment

#### Current read:
- `Phase 3.1-3` successfully added the real `Type` input pin, stable row color, and whole-number-driven slot mapping
- the remaining problems are now localized to the shared enum-row behavior and shell details rather than to the wider graph/input contract
- the strongest visual/interaction reference is still the settled `Depth` row because it already has:
  - working fill response
  - working step arrows
  - settled endcap chevrons

#### Locked direction:
- keep the enum row one line
- keep the real `Type` pin and driven-input contract from `Phase 3.1-3`
- fix the fill bar so it reflects the active enum slot honestly
- fix the left/right arrow stepping so the row can reliably move between `Basic` and `Twist`
- make the enum endcap arrows reuse or visually match the exact `Depth` chevron treatment

### Questions / Decisions

#### [x] Question 1 - What should be the primary parity reference for this cleanup?

##### Locked answer
- `Depth`

##### Why
- `Depth` already proves the desired one-line shell, fill readability, and endcap behavior in the same node surface

#### [x] Question 2 - Should this phase reopen the broader enum/type semantics contract?

##### Locked answer
- no

##### Why
- this is a narrow shared-row cleanup phase
- the broader type meaning work still belongs to `Extrude-3`

### Implementation Spec

Shipped implementation:
1. Switched the shared enum row in `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx` onto the sturdier custom `ParaSelect` track path so the enum row now uses the same shared fill/marker/drag substrate that already behaves correctly in other selector surfaces
2. Updated `src/app/components/ParaSelect.tsx` so:
   - endcap `pointerdown` stops bubbling before canvas drag can interfere
   - the custom-track value handle follows the same live fill percentage during scrub and driven display
   - chevron-cap geometry now matches the settled `Depth` SVG path instead of a near-match
3. Tightened `src/app/theme/surfaces/spaghetti.css` so the enum custom track clips correctly inside the row shell and the handle/marker lane renders like a real node-row control instead of a floating generic selector artifact
4. Extended `src/app/components/ParaSelect.test.tsx` so the shared selector now proves:
   - custom-mode driven fill follows the displayed value
   - endcap stepping updates the custom enum fill state
   - custom handle scrub updates fill and handle position together

Scope honored:
- kept the existing `Type` input pin and whole-number-driven contract from `Phase 3.1-3`
- kept the row one line
- avoided renaming `Basic` / `Twist`
- avoided widening into broader `Extrude-3` semantics or new graph-port kinds
- avoided touching `Depth` behavior beyond using it as the visual/interaction reference

Shipped verification:
- passed `npm.cmd exec vitest run src/app/components/ParaSelect.test.tsx src/app/spaghetti/canvas/structuredWireEnumRowProps.test.ts`
- passed `.\node_modules\.bin\tsc.cmd -b --pretty false`

#### Definition of done:
- the fill bar visibly changes between `Basic` and `Twist`
- the left and right step arrows reliably change the selected option when unwired
- driven state still disables local editing correctly
- endcap arrows visually match the settled `Depth` chevrons more closely

## [x] Extrude 3.1 Phase 5 - Primitive Enum Row Value Ownership Parity

### Summary

#### Purpose:
- make the shared primitive enum row obey the same value-ownership rule already proven by `Depth`

#### Current read:
- the strongest stable primitive-row contract in the repo is now:
  - no wire in -> local authored value owns the row
  - wire in -> effective wire value owns the row and local editing is disabled
- `Depth` already follows that rule
- the live `Type` row still needs that same contract to be fully trustworthy in-node

#### Locked direction:
- unwired enum row uses the local authored enum value for:
  - visible fill
  - visible marker
  - visible selected value
  - enabled editing
- driven enum row uses the effective wire-driven enum slot for:
  - visible fill
  - visible marker
  - visible displayed value
  - disabled editing
- the local authored fallback value survives while driven and becomes active again when the wire is removed

### Questions / Decisions

#### [x] Question 1 - Should `Type` follow the exact same local-versus-driven rule as `Depth`?

##### Suggested answer
- yes

##### Why
- it keeps primitive rows consistent
- it matches the user mental model already established by `Depth`
- it avoids one-off enum selector ownership rules

#### [x] Question 2 - Where should the effective enum value come from when unwired?

##### Suggested answer
- never from the evaluator default alone
- only from a real incoming whole-number `Type` wire

##### Why
- otherwise missing numeric input collapses to `0 -> first slot`, which makes the row snap back to `Body` even when the user selected `Walls`

### Implementation Spec

Shipped implementation:
1. Updated `src/app/spaghetti/selectors/selectNodeVm.ts` so the effective `Geometry/Extrude` type now follows `evaluation.inputsByNodeId[nodeId].Type` only when a real whole-number `Type` wire exists.
2. Kept the shared enum-row helper in `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts` on the same ownership rule as `Depth`:
   - unwired rows display the local authored value
   - driven rows display the effective wire-owned value and disable editing
3. Added focused regressions in:
   - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
   - `src/app/spaghetti/canvas/structuredWireEnumRowProps.test.ts`
   proving unwired `Walls` stays on `Walls` while driven rows still follow the effective mapped slot

Scope honored:
- keep this slice limited to primitive enum-row ownership parity
- do not widen into `Direction`, `Wall Thickness`, `Taper Angle`, or other extrude semantics
- do not reopen visual shell redesign unless ownership parity proves that another tiny cleanup is still necessary

Definition of done:
- unwired `Type` rows stay on the authored `Body / Walls` value after arrow clicks, menu selection, and drag changes
- driven `Type` rows still follow the effective wire value honestly
- the row now matches the same primitive-row ownership rule already proven by `Depth`

## [ ] Extrude 3.1 Phase 6 - Enum Row Integration Verification And Cleanup

### Summary

#### Purpose:
- hold one last explicit cleanup slice for any visible app-surface issues that remain after `Phase 3.1-5` lands

#### Current read:
- the most likely post-ownership work is now integration hardening, not another architecture change
- if menu, arrow, drag, or shell behavior still differs between:
  - isolated shared-row tests
  - the real visible extrude node surface
  this phase should own that cleanup directly

#### Locked direction:
- keep this phase available only for app-surface verification and final cleanup
- do not let broader `Extrude-3.2+` semantics get folded back into the shared enum-row ladder

### Questions / Decisions

#### [ ] Question 1 - Does the live extrude node still need a final dedicated enum-row cleanup pass after `Phase 3.1-5`?

##### Suggested answer
- only if the row still behaves differently in the real canvas surface than it does in focused shared-row tests

##### Why
- this keeps `3.1` honest as a row-family ladder instead of growing into a permanent catch-all

### Implementation Spec

Reserved implementation shape:
1. Add or tighten one real rendered-surface regression around the visible `Extrude Type` row controls.
2. Fix any remaining node-surface hit-testing, clipping, or layering bugs that only appear in the full Spaghetti shell.
3. Close the `Extrude-3.1` family only after the live row is trustworthy enough to validate the shipped `Body / Walls` semantics directly from the node UI.

Scope honored:
- keep this phase limited to final enum-row integration hardening if needed
- do not reopen the broader authored extrude semantics ladder

Definition of done:
- the visible `Extrude Type` row is fully trustworthy for manual `Body / Walls` testing from the node surface
- no remaining menu, arrow, drag, or shell-integration surprises remain in the live canvas path

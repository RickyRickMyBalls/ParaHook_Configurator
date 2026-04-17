# `PV3S - 1` - `Existing Component Enrichment`

## Doc Header

### Doc History
9. 2026-04-17 17:25:17: Refined the shipped `PV3S - 1 / Phase 2.1` field presentation so collapsed `ParaVec3Field` mode now uses the compact `ParaVec3Slider` surface again instead of the temporary custom summary row, keeping expanded mode on stacked row sliders while restoring the intended compact-versus-expanded vec3 progression inside the first `ViewToolbar` proving ground
8. 2026-04-17 17:19:45: Implemented `PV3S - 1 / Phase 2.1 - Expanded Rows Layout For ParaVec3Field` by adding the shared `compact | stacked` layout split to `ParaVec3Slider`, keeping compact mode as the default for existing callers, routing `ParaVec3Field` expanded mode onto stacked row sliders, and strengthening the focused vec3 plus `ViewToolbar` proof so the richer expanded read lands without regressing current compact vec3 surfaces
7. 2026-04-17 17:17:05: Prepped `PV3S - 1 / Phase 2.1 - Expanded Rows Layout For ParaVec3Field` for implementation by locking the new `ParaVec3Slider` layout prop to `compact | stacked`, preserving `compact` as the default for existing callers, requiring `ParaVec3Field` expanded mode to use `stacked`, and tightening the proof surface around true row-based expansion in `ViewToolbar` plus compact-layout regression coverage for existing vec3 callers
6. 2026-04-17 17:14:48: Expanded `PV3S - 1` with a new `Phase 2.1 - Expanded Rows Layout For ParaVec3Field`, locking the follow-on fix for the new shared field so expanded vec3 editing no longer reuses the compact three-box read, but instead renders three full row-style `ParaSlider` lanes through a new low-level `ParaVec3Slider` layout split that preserves compact mode for existing non-field callers
5. 2026-04-17 16:44:44: Implemented `PV3S - 1 / Phase 2 - Expandable Labeled Field Wrapper` by adding the new shared `ParaVec3Field` owner above `ParaVec3Slider`, moving the first `ViewToolbar` proving-ground adoption from feature-local wrapper cards onto the shared field box, and adding focused proof for collapsed-summary rendering, expand/collapse behavior, and continued vec3 value flow through the existing selected-light seam
4. 2026-04-17 16:32:15: Prepped `PV3S - 1 / Phase 2 - Expandable Labeled Field Wrapper` for implementation by locking the new wrapper name to `ParaVec3Field`, grounding the cut in the live `ParaVec3Slider` plus `ViewToolbar` proving-ground wrappers, defining the collapsed-summary-versus-expanded-slider ownership split, and tightening the first adoption plus proof surface so the next implementation pass can land without design ambiguity
3. 2026-04-17 16:29:36: Expanded `PV3S - 1` with a new `Phase 2 - Expandable Labeled Field Wrapper` so the next vec3-family cut can add the recommended higher-level wrapper above `ParaVec3Slider`, giving vec3 fields one shared outer label box, collapsed `X / Y / Z` summary row, and click-to-expand path without overloading the low-level three-slider primitive itself
2. 2026-04-17 16:12:22: Implemented the first `PV3S - 1` proving-ground adoption in `ViewToolbar`, replacing the selected-light `Environment` panel's `Position` and `Target` native `x / y / z` number rows with `ParaVec3Slider` while keeping the same wrapper cards, type-gated visibility, `updateLight(...)` mutation seam, and focused toolbar proof
1. 2026-04-17 15:59:00: Created this standalone future phase doc for `PV3S - 1`, giving the current `ParaVec3Slider` one explicit enrichment home grounded in the live wrapper, test, CSS, `ReferenceTransformToolbar`, `ViewportOverlay`, and nearby `ParaVec2Slider` sibling so the first shared vec3 follow-on can target honest wrapper-level improvements instead of more feature-local drift

### Purpose

This doc locks the first `ParaVec3Slider` phase.

Use it to answer:
- what the current shared vec3 wrapper already does
- where the current component-family drift is real
- how enrichment should stay separate from `ParaSlider` core behavior
- what the first honest shared vec3 improvement pass should target

### Why This Phase Exists

The current `ParaVec3Slider` is real, but still intentionally thin.

Today the app already has:
- one shared vec3 wrapper around three `ParaSlider` instances
- axis-aware change forwarding
- axis-aware display and format hooks
- compact shared three-column styling
- real transform and history call sites

What it does not yet have is one explicit vec3-family plan for the first enrichment step.

It also trails the nearby vec2 sibling in a meaningful way:
- `ParaVec2Slider` already owns clamp-edit wrapper behavior
- `ParaVec3Slider` still exposes a smaller wrapper surface

This phase exists to name that drift honestly and define the first wrapper-level enrichment cut without widening into fake generic vector abstraction.

### Scope

This phase covers:
- the current `ParaVec3Slider` live read
- the honest vec3-versus-vec2 family drift
- the first wrapper-level enrichment direction for shared vec3 call sites
- the likely first code-cut boundary for enriching the component safely

This phase does not cover:
- redesigning `ParaSlider`
- inventing a giant vector control framework
- moving transform business logic into the shared component family
- speculative `Vec4` or arbitrary-dimension component work

## Doc Body

### Goal

Enrich the existing `ParaVec3Slider` so real shared vec3 behavior can live in one honest wrapper owner instead of remaining underspecified or solved repeatedly in feature call sites.

### Boundaries

This phase should:
- preserve `ParaVec3Slider` as a small wrapper over `ParaSlider`
- target vec3 behavior that is already justified by live usage
- treat `ParaVec2Slider` as a family-shape reference, not as a forced copy target
- keep feature-local commands and business logic outside the shared component

This phase should not:
- collapse `ParaVec3Slider` back into `ParaSlider`
- move scalar slider runtime up into the vec3 wrapper family
- over-generalize into a fake template abstraction
- widen into unrelated vector-control families

### Architecture Direction

The right architectural read for this phase is:
- `ParaSlider` stays the scalar runtime owner
- `ParaVec3Slider` owns shared vec3 wrapper behavior
- feature call sites keep feature-local state and command routing

Suggested first enrichment target:
- bring `ParaVec3Slider` closer to honest shared-family parity by defining the first vec3-level wrapper additions that multiple call sites can use directly

Likely enrichment categories for the first pass:
- axis-level wrapper props when the same need appears across callers
- parity review against `ParaVec2Slider` where the vec3 family is missing a real shared affordance
- small presentation or interaction hooks that remove feature-local vec3 drift without redesigning the scalar slider underneath

Important rule:
- enrich the vec3 wrapper by extracting real shared needs, not by stuffing feature-specific behavior into a shared component

### Current Live Read

Current vec3 wrapper owner:
- [src/app/components/ParaVec3Slider.tsx](./../../../../../../../../src/app/components/ParaVec3Slider.tsx)
  - currently owns:
    - fixed `x / y / z` axis order
    - uppercase axis labels
    - shared `min / max / step`
    - shared `allowWrap`
    - shared `showContinuousDragPreview`
    - axis-aware `onChangeAxis(...)`, `onChangeEndAxis(...)`, `formatValue(...)`, and `displayValue(...)`

Current shared proof surfaces:
- [src/app/components/ParaVec3Slider.test.tsx](./../../../../../../../../src/app/components/ParaVec3Slider.test.tsx)
  - currently proves:
    - three capless axis tracks render
    - axis forwarding reaches the right callback axis
- [src/app/theme/foundation/base.css](./../../../../../../../../src/app/theme/foundation/base.css)
  - currently owns:
    - shared three-column vec3 grid styling
    - compact label/value sizing for the vec3 wrapper

Current live callers:
- [src/app/components/ReferenceTransformToolbar.tsx](./../../../../../../../../src/app/components/ReferenceTransformToolbar.tsx)
  - uses `ParaVec3Slider` for snap vec3 values and transform-history entry values
- [src/app/components/ViewportOverlay.tsx](./../../../../../../../../src/app/components/ViewportOverlay.tsx)
  - uses `ParaVec3Slider` for translation and rotation editing
- [src/app/components/ViewToolbar.tsx](./../../../../../../../../src/app/components/ViewToolbar.tsx)
  - now uses `ParaVec3Slider` inside the selected-light `Environment` panel `Position` and `Target` cards as the first proving-ground adoption

Current sibling-family reference:
- [src/app/components/ParaVec2Slider.tsx](./../../../../../../../../src/app/components/ParaVec2Slider.tsx)
  - proves that vector-level wrapper behavior can honestly sit above `ParaSlider`
  - currently includes clamp-edit wrapper support that `ParaVec3Slider` does not yet expose

### Acceptance Read

This phase is healthy when:
- the current vec3 wrapper surface is named honestly
- the first shared enrichment target is explicit
- the family boundary against `ParaSlider` core and feature-local logic stays clean
- later implementation can point here instead of inventing one-off vec3 follow-ons inside feature surfaces

## Wishlist Organization

### High Level Goals

- [ ] `HLG 1. Enrich The Existing ParaVec3Slider Without Turning It Into A Fake Generic Vector Framework`

### `PV3S - 1 Phase 1`

- [ ] `0. The Current ParaVec3Slider Surface And Real Caller Drift Are Named Honestly`
- [ ] `1. The First Shared Vec3 Enrichment Target Is Explicit`
- [ ] `2. Vec3 Wrapper Ownership Stays Separate From ParaSlider Core Behavior`
- [ ] `3. Transform, Snap, And History Vec3 Follow-Ons Now Have A Real Family Home`
- [ ] `HLG 1. Enrich The Existing ParaVec3Slider Without Turning It Into A Fake Generic Vector Framework`

### `PV3S - 1 Phase 2`

- [ ] `4. Add One Shared Higher-Level Vec3 Field Wrapper Above ParaVec3Slider`
- [ ] `5. The New Wrapper Owns A Label Box, Collapsed X/Y/Z Summary Row, And Click-To-Expand Behavior`
- [ ] `6. ParaVec3Slider Stays The Low-Level Expanded Three-Slider Primitive`
- [ ] `7. The First Wrapper Adoption Removes Feature-Local Position/Target Card Ownership Where The Shared Wrapper Can Now Own It Honestly`
- [ ] `HLG 1. Enrich The Existing ParaVec3Slider Without Turning It Into A Fake Generic Vector Framework`

### `PV3S - 1 Phase 2.1`

- [ ] `8. Expanded ParaVec3Field Mode Uses Three Full Row Sliders Instead Of Reusing The Compact Three-Box Vec3 Read`
- [ ] `9. ParaVec3Slider Gains An Honest Shared Layout Split So Compact Callers Stay Compact While Field Expansions Can Read As Full Slider Rows`
- [ ] `10. The First ViewToolbar Field Adoption Expands Into Visibly Richer X, Y, And Z Editing Rows`
- [ ] `HLG 1. Enrich The Existing ParaVec3Slider Without Turning It Into A Fake Generic Vector Framework`

## [ ] `PV3S - 1` - `Phase 1 - Existing Component Enrichment`

### Phase 1 Summary
#### Purpose

Create the first honest enrichment lane for `ParaVec3Slider` and lock what the shared vec3 wrapper should own next.

#### Owns

- current vec3 wrapper seam inventory
- vec3-versus-vec2 family drift read
- first shared wrapper-level enrichment direction
- no-widening boundary between vec3 wrapper behavior and scalar-slider core behavior

#### Does Not Own

- redesigning `ParaSlider`
- feature-local transform commands
- speculative generic vector-template work
- later larger family cleanup outside the first vec3 wrapper cut

#### Current Live Read

The main vec3 wrapper seams currently live across:
- [ParaVec3Slider.tsx](./../../../../../../../../src/app/components/ParaVec3Slider.tsx)
- [ParaVec3Slider.test.tsx](./../../../../../../../../src/app/components/ParaVec3Slider.test.tsx)
- [base.css](./../../../../../../../../src/app/theme/foundation/base.css)
- [ReferenceTransformToolbar.tsx](./../../../../../../../../src/app/components/ReferenceTransformToolbar.tsx)
- [ViewportOverlay.tsx](./../../../../../../../../src/app/components/ViewportOverlay.tsx)
- [ParaVec2Slider.tsx](./../../../../../../../../src/app/components/ParaVec2Slider.tsx)

The most important drift today is:
- `ParaVec3Slider` remains a thinner wrapper than `ParaVec2Slider`
- some real vec3 presentation and interaction needs are still solved at the caller level
- the vec3 family does not yet have one explicit enrichment plan

#### First Pass Decisions

- keep the component as one small three-axis wrapper over `ParaSlider`
- let the first enrichment pass target only vec3 behavior that is already shared across real callers
- use `ParaVec2Slider` as a parity reference only where the behavior is truly shared and justified for vec3
- keep feature-specific transform semantics outside the shared vec3 component

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Read the live vec3 wrapper, styling, proof surface, and current callers.
2. Identify which vec3-level needs are repeated enough to belong in `ParaVec3Slider` instead of staying feature-local.
3. Lock the first wrapper-level enrichment contract so it stays clearly above scalar `ParaSlider` runtime and clearly below feature business logic.
4. Implement only that first enrichment slice, then add focused wrapper proof.

#### Likely Files

- wrapper owner:
  - `src/app/components/ParaVec3Slider.tsx`
- focused proof:
  - `src/app/components/ParaVec3Slider.test.tsx`
- shared styling if needed:
  - `src/app/theme/foundation/base.css`
- live integration proof and adoption targets:
  - `src/app/components/ReferenceTransformToolbar.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- nearby family reference:
  - `src/app/components/ParaVec2Slider.tsx`
- docs update targets after later implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not redesign `ParaSlider` in this phase
- do not widen into a generic vector-control system
- do not move feature-local transform logic into the shared component
- do not add vec3 wrapper behavior that only one call site needs and no shared seam justifies

#### Implementation Risks

- copying vec2 behavior into vec3 without proving the same ownership need
- stuffing feature-local transform behavior into the shared wrapper
- leaving real vec3 shared needs stranded in feature call sites while claiming the component is already complete

#### Checklist

- [ ] name the current vec3 wrapper seams and caller drift
- [ ] lock the first honest shared enrichment target
- [ ] preserve the boundary with `ParaSlider` core behavior
- [ ] prepare focused wrapper proof for the first enrichment slice

#### Verification Shape

Minimum verification for this phase should cover:

- the vec3 family now has a real planning home
- `PV3S - 1` reads as enrichment of an existing shared component, not fake broad framework work
- the first implementation cut can point to specific wrapper seams, tests, and caller surfaces

#### Done Shape

`PV3S - 1` is done when:

- the current `ParaVec3Slider` drift is named honestly
- the first shared enrichment target is explicit
- the next implementation pass can land as a small wrapper-level code cut

Current status:
- `PV3S - 1` has its first proving-ground adoption landed in `ViewToolbar`
- this is the first enrichment lane for the existing shared vec3 wrapper
- the first shipped proving ground is the selected-light `Environment` panel `Position` and `Target` rows, which now use `ParaVec3Slider` with shared `-300..300` bounds and `0.1` precision while preserving the same local wrapper cards and `updateLight(...)` seam
- the next planned cut is a higher-level expandable field wrapper above `ParaVec3Slider`, so shared vec3 fields can own their own label box and collapsed-summary treatment instead of leaving that structure feature-local
- later implementation can now widen `ParaVec3Slider` from one real family home instead of scattering vec3 follow-ons across feature surfaces

## [x] `PV3S - 1` - `Phase 2 - Expandable Labeled Field Wrapper`

### Phase 2 Summary
#### Purpose

Add the first higher-level shared vec3 field wrapper above `ParaVec3Slider` so vec3 editing can ship as one labeled field surface with a collapsed summary row and an expanded three-slider state.

#### Owns

- one new shared vec3 field wrapper above `ParaVec3Slider`
- the outer label box for vec3 fields such as `Position`
- the collapsed `X / Y / Z` summary presentation
- click-to-expand and collapse behavior for the shared vec3 field surface
- the ownership split between the new wrapper and the existing low-level `ParaVec3Slider`

#### Does Not Own

- redesigning `ParaSlider`
- replacing `ParaVec3Slider` as the low-level primitive
- generic accordion behavior for unrelated control families
- feature-specific transform business logic

#### Current Live Read

The current proving-ground read now shows two different vec3 layers:
- [ParaVec3Slider.tsx](./../../../../../../../../src/app/components/ParaVec3Slider.tsx)
  - owns the current expanded three-slider primitive
- [ViewToolbar.tsx](./../../../../../../../../src/app/components/ViewToolbar.tsx)
  - still owns the outer `Position` and `Target` wrapper cards and labels around the proving-ground adoption
- [base.css](./../../../../../../../../src/app/theme/foundation/base.css)
  - still owns the feature-local `.SelectedLightVectorField` visual box that now wraps a shared vec3 primitive instead of the old native `x / y / z` inputs
- [ViewToolbar.test.tsx](./../../../../../../../../src/app/components/ViewToolbar.test.tsx)
  - currently proves the proving-ground adoption through the shared vec3 primitive inside the feature-local wrapper rather than through a shared labeled-field owner

The most important drift after the proving-ground swap is:
- the shared vec3 primitive now exists in a real toolbar field
- the label box and collapsed-summary field treatment still remain feature-local
- the current component family has no shared owner yet for:
  - the field label
  - the collapsed `X / Y / Z` summary row
  - the expand/collapse interaction

#### First Pass Decisions

- keep `ParaVec3Slider` as the low-level expanded primitive
- add one new higher-level wrapper above it instead of overloading the existing primitive
- lock the new wrapper name to `ParaVec3Field`
- let the new wrapper own:
  - the field label such as `Position`
  - the collapsed three-value summary row
  - the expanded/collapsed state
- use one clickable header button as the toggle owner rather than making only the text label interactive
- keep axis labels defaulted to `X / Y / Z` in the first cut
- show the collapsed summary row only while collapsed
- replace the collapsed summary row with the inner `ParaVec3Slider` while expanded instead of showing both at the same time
- keep the first cut uncontrolled inside the wrapper with `defaultExpanded` rather than adding controlled expansion state
- keep the first proving-ground adoption in `ViewToolbar` and move `Position` / `Target` off the feature-local wrapper box once the shared wrapper exists
- do not add animation in the first cut
- do not widen this cut into repo-wide vector-field unification beyond the first `ViewToolbar` proving ground

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Add `src/app/components/ParaVec3Field.tsx` as the new shared wrapper above `ParaVec3Slider`.
2. Give `ParaVec3Field` this first-cut prop surface:
   - `label: string`
   - `value: { x: number; y: number; z: number }`
   - `min: number`
   - `max: number`
   - `step: number`
   - `onChangeAxis(axis, value)`
   - optional `onChangeEndAxis(axis, value)`
   - optional `allowWrap`
   - optional `showContinuousDragPreview`
   - optional `formatValue(axis, value)`
   - optional `displayValue(axis, value)`
   - optional `defaultExpanded`
   - optional `className`
3. Make `ParaVec3Field` render:
   - one outer field box
   - one header button with the visible field label and `aria-expanded`
   - one collapsed summary row with three equal-value cells `X / Y / Z`
   - the inner `ParaVec3Slider` only when expanded
4. Keep `ParaVec3Slider` focused on the expanded three-slider layout only, with no label-box, accordion, or collapsed-summary ownership added into that primitive.
5. Move `ViewToolbar` `Position` and `Target` from the current feature-local `.SelectedLightVectorField` box to direct `ParaVec3Field` adoption while preserving:
   - the same `-300..300` bounds
   - the same `0.1` step
   - the same one-decimal read
   - the same `updateLight(...)` plus `updateVec3Axis(...)` seam
   - the same type-gated visibility rules
6. Add focused component proof for `ParaVec3Field`, then update the existing `ViewToolbar` proving-ground test to assert the new shared wrapper owns the box and expand/collapse treatment.

#### Likely Files

- new wrapper owner:
  - `src/app/components/ParaVec3Field.tsx`
- low-level vec3 primitive:
  - `src/app/components/ParaVec3Slider.tsx`
- focused proof:
  - `src/app/components/ParaVec3Field.test.tsx`
  - `src/app/components/ParaVec3Slider.test.tsx` only if the low-level primitive needs a small expectation update
- first shared proving-ground adoption:
  - `src/app/components/ViewToolbar.tsx`
  - `src/app/components/ViewToolbar.test.tsx`
- shared styling if needed:
  - `src/app/theme/foundation/base.css`
- docs update targets after later implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not collapse the new wrapper and `ParaVec3Slider` back into one overloaded component
- do not redesign scalar slider behavior in this phase
- do not widen into a generic expandable field framework for unrelated control types
- do not move feature business logic into the new shared wrapper
- do not add controlled open-state plumbing unless the first proving-ground adoption truly needs it
- do not preserve the old feature-local wrapper box in `ViewToolbar` just to avoid moving the ownership to the new shared wrapper

#### Implementation Risks

- stuffing too much wrapper behavior into `ParaVec3Slider` and making the primitive harder to reuse
- inventing a field-wrapper abstraction that is broader than the actual vec3 use case
- leaving the first proving-ground adoption half feature-local so the shared ownership split stays muddy
- making the collapsed summary and expanded primitive disagree on formatting or axis order
- creating a wrapper that is harder to keyboard-toggle or scan than the current proving-ground box

#### Checklist

- [x] add `ParaVec3Field` above `ParaVec3Slider`
- [x] keep `ParaVec3Slider` as the low-level expanded primitive
- [x] lock the wrapper prop surface and header-toggle behavior
- [x] move the first honest field-wrapper adoption onto `ViewToolbar`
- [x] add focused proof for collapsed summary, expand/collapse, and value flow

#### Verification Shape

Minimum verification for this phase should cover:

- `ParaVec3Field` renders a visible label box and collapsed summary row
- clicking the header button toggles `aria-expanded` and expands the field into the inner `ParaVec3Slider`
- the collapsed summary row uses the same axis order and display formatting as the expanded field read
- editing expanded axis values still flows through the existing vec3 update seam
- the low-level `ParaVec3Slider` remains reusable without the new field wrapper
- `ViewToolbar` `Position` and `Target` now render through the shared wrapper instead of the old feature-local vec3 box

#### Done Shape

`Phase 2` is done when:

- the vec3 family has one shared `ParaVec3Field` wrapper above `ParaVec3Slider`
- collapsed-summary ownership is no longer feature-local in the first proving-ground caller
- `ParaVec3Slider` still reads as the low-level expanded primitive rather than the full field system

Current status:
- `Phase 2` is implemented
- the vec3 family now has one shared `ParaVec3Field` owner above `ParaVec3Slider`
- the first `ViewToolbar` proving-ground adoption now uses the shared field box, collapsed `X / Y / Z` summary row, and header-toggle expansion path instead of leaving that wrapper ownership feature-local
- the first cut remains intentionally uncontrolled through `defaultExpanded`, so expanded state stays local to each field instance without widening into controlled open-state plumbing
- the next follow-on is `Phase 2.1`, which will make expanded field mode read as three true row sliders instead of the current still-compact vec3 box layout

## [x] `PV3S - 1` - `Phase 2.1 - Expanded Rows Layout For ParaVec3Field`

### Phase 2.1 Summary
#### Purpose

Fix the current expanded vec3-field presentation so `ParaVec3Field` opens into three full row-style `ParaSlider` lanes instead of reusing the compact three-column vec3 box layout.

#### Owns

- the visual distinction between collapsed-summary mode and expanded-edit mode
- one honest shared layout split inside `ParaVec3Slider`
- row-based expanded rendering for `ParaVec3Field`
- the first `ViewToolbar` proving-ground update to the richer expanded read

#### Does Not Own

- redesigning `ParaSlider`
- replacing the compact vec3 layout for existing transform-oriented callers
- controlled open-state plumbing for `ParaVec3Field`
- broader repo-wide vector-field unification

#### Current Live Read

The current shipped state now has:
- [ParaVec3Field.tsx](./../../../../../../../../src/app/components/ParaVec3Field.tsx)
  - correctly owning the outer label box, collapsed summary row, and expand/collapse state
- [ParaVec3Slider.tsx](./../../../../../../../../src/app/components/ParaVec3Slider.tsx)
  - still rendering the same compact three-column vec3 layout when expanded
- [ViewToolbar.tsx](./../../../../../../../../src/app/components/ViewToolbar.tsx)
  - correctly adopting the shared field owner for `Position` and `Target`
- [base.css](./../../../../../../../../src/app/theme/foundation/base.css)
  - still styling expanded vec3 editing through the compact three-box grid

The current problem is:
- collapsed mode looks correct as a compact summary read
- expanded mode is functionally richer but still reads too much like the old three-box vector field
- the field does not yet visually graduate into three full editing rows the way the new wrapper implies

#### First Pass Decisions

- keep `ParaVec3Field` as the owner of collapsed versus expanded mode
- keep compact vec3 layout available for existing non-field callers
- add one explicit layout split inside `ParaVec3Slider` instead of creating a second competing vec3 primitive
- lock the new prop to `layout?: 'compact' | 'stacked'`
- keep `compact` as the default when the prop is omitted
- let `ParaVec3Field` expanded mode use the new stacked row layout by default
- treat the stacked layout as the richer field-editing read, not as a repo-wide forced replacement for all vec3 callers

### Phase 2.1 Implementation Spec

#### Exact First Code Cut

1. Add a shared layout prop to `ParaVec3Slider`, such as `layout="compact" | "stacked"`.
2. Preserve `compact` as the default so current transform and overlay callers keep their existing vec3 presentation.
3. Add the new `stacked` layout path so the component can render:
   - one full-width `X` row
   - one full-width `Y` row
   - one full-width `Z` row
   using the same low-level `ParaSlider` runtime and current axis forwarding seam.
4. Keep the same axis order, formatting hooks, change forwarding, and capless behavior across both layouts so the new split is presentational rather than behavioral.
5. Update `ParaVec3Field` so its expanded state renders `ParaVec3Slider` in the new stacked layout and its collapsed state remains unchanged.
6. Update the `ViewToolbar` proving-ground read so `Position` and `Target` now expand into three real row sliders instead of the compact three-box vec3 layout.
7. Add focused proof that:
   - compact callers remain compact by default
   - `ParaVec3Slider layout="stacked"` renders three vertical row lanes
   - expanded `ParaVec3Field` uses the stacked layout
   - axis edits still flow through the same selected-light seam

#### Likely Files

- low-level vec3 primitive:
  - `src/app/components/ParaVec3Slider.tsx`
- higher-level field wrapper:
  - `src/app/components/ParaVec3Field.tsx`
- focused proof:
  - `src/app/components/ParaVec3Slider.test.tsx`
  - `src/app/components/ParaVec3Field.test.tsx`
  - `src/app/components/ViewToolbar.test.tsx`
- proving-ground caller:
  - `src/app/components/ViewToolbar.tsx`
- shared styling:
  - `src/app/theme/foundation/base.css`
- docs update targets after later implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not replace compact vec3 layout everywhere just because expanded field mode needs stacked rows
- do not add a second field wrapper that duplicates `ParaVec3Field`
- do not overload `ParaVec3Field` with feature-specific light-edit logic
- do not widen this into a full generic responsive-layout system for all vector controls

#### Implementation Risks

- breaking the existing compact vec3 callers while trying to improve field expansion
- creating stacked row styling that diverges from normal `ParaSlider` reads
- leaving expanded field mode only slightly different from collapsed mode instead of clearly richer

#### Checklist

- [x] add a shared compact-versus-stacked layout split to `ParaVec3Slider`
- [x] preserve compact layout for existing callers by default
- [x] preserve axis order, formatting, and callback behavior across both layouts
- [x] make expanded `ParaVec3Field` use stacked row layout
- [x] update the first `ViewToolbar` proving-ground adoption to read as true row sliders when expanded
- [x] add focused proof for layout split plus value-flow continuity

#### Verification Shape

Minimum verification for this phase should cover:

- `ParaVec3Slider` still renders compact mode for existing default callers
- stacked mode renders three vertical full-width axis rows
- `ParaVec3Field` collapsed mode still renders the same summary row
- `ParaVec3Field` expanded mode now reads as three row sliders
- `ViewToolbar` `Position` and `Target` continue to update through the same selected-light seam

#### Done Shape

`Phase 2.1` is done when:

- expanded vec3 fields no longer look like the old compact three-box vector input
- `ParaVec3Slider` can honestly serve both compact and stacked shared layouts
- `ParaVec3Field` expansion now visibly graduates from summary mode into full editing mode

Current status:
- `Phase 2.1` is implemented
- the direction is to add a layout split to `ParaVec3Slider`, not to replace it
- the first target was the shipped `ViewToolbar` `Position` and `Target` field expansion path
- collapsed vec3 fields now use the compact `ParaVec3Slider` surface again while expanded vec3 fields open into three stacked row sliders
- the family now has an honest presentational split between compact vec3 reads and richer field-expansion editing without changing the existing axis-update seam

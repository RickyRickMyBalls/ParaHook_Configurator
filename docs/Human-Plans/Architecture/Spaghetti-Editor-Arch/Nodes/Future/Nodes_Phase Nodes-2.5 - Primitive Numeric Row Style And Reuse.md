# `Nodes-2.5` - `Primitive Numeric Row Style And Reuse`

## Doc Header

### Doc History
10. 2026-04-05 09:16: Tightened the live `Depth` proving read inside `Nodes-2.5` by locking that the first primitive numeric row currently owns magnitude-only distance editing in `mm`, stays paired with separate extrude direction/flip ownership, and should act as a reusable shell example without making later scalar rows inherit extrude-specific semantics by accident
9. 2026-04-05 02:25: Closed `Nodes-2.5C` after the live primitive `Depth` row was rebuilt around a true slider-lane versus value-lane split, keeping shell-edge endcaps, drag, step, direct edit, and driven-state behavior while removing the old combined middle lane so the post-`Nodes-2` primitive numeric row style now has a materially corrected live proving surface
8. 2026-04-05 02:25: Tightened `Nodes-2.5C` into an implementation-ready parity-rebuild slice by naming the exact `PortView.tsx` and `spaghetti.css` rebuild target for the primitive `Depth` row, locking which current primitive-row behaviors must survive the markup/CSS rewrite, and adding concrete acceptance checks for fill readability, label alignment, endcap anchoring, drag, step, and direct-edit parity
7. 2026-04-05 02:24: Closed `Nodes-2.5B` after turning the `2.5A` diagnosis into one locked primitive-row lane contract for the live `Depth` rebuild, fixing the target column count, lane ownership, fill extent, label-alignment expectation, separator survival, and endcap role so `Nodes-2.5C` can now implement visual parity without making fresh layout decisions
6. 2026-04-05 02:21: Tightened `Nodes-2.5B` into an implementation-ready lane-contract slice by turning the `2.5A` diagnosis into one explicit target column model for primitive rows, locking what each lane owns, what the fill may and may not share, how the `Depth` label should align against `SketchProfile`, and the exact acceptance checks the `2.5C` rebuild must satisfy
5. 2026-04-05 02:18: Closed `Nodes-2.5A` after tracing the live primitive `Depth` row seam in `PortView.tsx`, confirming that the fill math already differs correctly for low versus high values while the current over-partitioned lane layout and weak `number` fill contrast make that width change read like a narrow left-side slab, and handing the corrected target-lane decisions forward to `Nodes-2.5B`
4. 2026-04-05 02:12: Tightened `Nodes-2.5A` into an implementation-ready research slice by naming the live primitive-row seam in `PortView.tsx`, the current grid-column breakdown and `SpaghettiPortPrimitiveFill` width path in `spaghetti.css`, the now-proven `353.2 -> 17.656%` versus `2000 -> 100%` fill math, and the exact research outputs needed before `Nodes-2.5B` can lock a corrected lane contract
3. 2026-04-05 02:12: Reopened `Nodes-2.5` and split it into explicit subphases after the first shipped primitive `Depth` row proved the broad direction but still failed the intended visual contract around fill readability, lane alignment, and left/right endcap anchoring, so the remaining work now has one research-first ladder instead of continuing as ad hoc polish
2. 2026-04-05 01:53: Closed `Nodes-2.5` after the primitive `Depth` row in `Geometry/Extrude` adopted the reusable one-line primitive numeric render mode with shell-owned endcaps, divider-bounded fill, center-lane drag, and inline value editing, so the post-`Nodes-2` scalar-row visual language is now both documented and proven in live code
1. 2026-04-05 01:53: Created this focused post-`Nodes-2` planning note so the new primitive numeric row direction proven by `Geometry/Extrude` `Depth` has one reusable visual-and-behavior spec before later nodes copy it ad hoc or the broader `Nodes-3` composite/output work starts

## [x] `Nodes-2.5` - `Primitive Numeric Row Style And Reuse`

### Summary

#### Purpose:
- lock one reusable visual and interaction style for primitive numeric rows after the first live `Depth` proving pass

#### Owns:
- documenting what makes a primitive numeric row different from a managed expandable `SWR` row
- locking the intended one-line visual language for primitive rows
- recording the current `Depth` row lessons so later float-like rows can reuse them
- defining what should stay shared versus what should stay family-local when more primitive rows land

#### Does not own:
- broader composite-row rollout like `Vec2` / `Vec3`
- broader collection-row rollout
- output-row standardization
- a full `Nodes-3` architecture rewrite
- generic toolbar cleanup outside the row itself

#### Current seam read:

- `Nodes-2` proved the first reusable numeric-row contract, helper seam, and live `Depth` adoption
- the follow-on visual iterations exposed a second need:
  - primitive scalar rows should not inherit the same expand/collapse chrome as structured rows
  - primitive rows also should not read like generic panel sliders dropped inside a port shell
- `Depth` is now the proving surface for that next style question:
  - one row
  - one pin-bearing shell
  - one clean numeric control lane
  - one reusable visual rhythm for later float-like rows

Current strongest read:
- primitive numeric rows should become their own documented row style inside the broader `SWR` system
- they should stay compatible with the shared node shell and port language, but not behave like mini expandable sections

Current shipped output:
- `src/app/spaghetti/canvas/PortView.tsx` now owns the reusable primitive numeric row renderer for shell-owned:
  - endcap step controls
  - divider-bounded center lane drag
  - inline right-side numeric editing
  - one-line driven-state preservation
- `src/app/theme/surfaces/spaghetti.css` now styles that primitive row as one shell-owned lane instead of a nested slider box
- focused `NodeView` and primitive-row helper tests now cover the reusable primitive-row structure

Current open gap:
- the first primitive proving pass required one follow-on rebuild before the visual contract became stable

Current shipped read:
- the live primitive `Depth` row now separates:
  - slider lane
  - value lane
  - left/right edge endcaps
- the old combined middle lane is gone
- the row remains one-line and keeps:
  - drag
  - step arrows
  - direct numeric edit
  - driven one-line presentation

### Questions

#### [ ] Question 1 - What is a `primitive numeric row`?

##### Suggested answer
- a one-line scalar row whose primary job is to expose one numeric value plus one wire target

##### Why
- primitive rows do not honestly own richer attached-body content
- they should feel like direct parameter lanes, not compact panels

#### [ ] Question 2 - How should a primitive numeric row differ from a managed `SWR` row?

##### Suggested answer
- it should not expand or collapse
- it should not render an attached explanation body by default
- it should keep all meaningful interaction inside the row shell itself

##### Why
- that keeps primitive scalar rows aligned with the original `EWR` / `SWR` vision where only rows that truly own structure expand into children or attached content

#### [ ] Question 3 - What is the intended visual language?

##### Suggested answer
- use the outer port shell as the only visible container
- keep the left pin in the normal row position
- reserve the far left and far right row ends for small step controls
- separate those endcaps from the main lane with vertical divider lines
- use the center lane for:
  - flat fill bar
  - row label
  - draggable slider surface
  - editable right-side numeric value plus unit

##### Why
- this removes the current box-inside-box feel
- it matches the calmer Blender-style goal more closely
- it keeps the primitive row visually tied to the existing port shell instead of introducing another nested widget

#### [ ] Question 4 - How should the fill behave?

##### Suggested answer
- the fill should span from the left divider line to the right divider line
- the fill color should come from the existing port/type color
- the fill should remain visible for non-zero values without colliding with the rounded row corners

##### Why
- the row should read like one honest scalar lane tied to the wire language
- the fill should communicate value position without becoming a second bordered control

#### [ ] Question 5 - What interactions belong inside the primitive row?

##### Suggested answer
- drag in the center lane
- click the left and right endcap arrows for step-based adjustment
- edit the right-side numeric field directly

##### Why
- those three affordances are enough for the first primitive-row pattern
- they give both coarse and precise control without widening into a toolbar or attached body

### Spec

Locked top-level direction:
- treat primitive numeric rows as a reusable subfamily inside `SWR`
- primitive rows are still real node rows with real pins
- primitive rows do not need managed expand/collapse behavior unless a later type honestly owns more structure

Locked primitive-row rules:
- one primitive numeric row stays one visible lane
- the row shell itself is the slider container
- no nested inner border should appear
- the row label should use the same text rhythm as the nearby collapsed port rows
- the value should remain inline on the right and include its unit
- the main lane should support both drag and typed editing
- the endcaps should support step arrows without stealing the label/value space

Locked visual rules:
- no box-inside-box treatment
- no panel-style slider chrome
- no attached explanatory body by default
- use vertical divider lines to cap the left and right end controls
- the fill should live between those divider lines
- keep the total row height aligned with the other collapsed rows such as `SketchProfile`

Locked behavior rules:
- resolved wire input still owns the effective value when present
- local fallback value may stay visible but the row should show disabled/driven state honestly
- primitive numeric rows should prefer one-line status over explanatory body text
- if a later row needs child structure or attached diagnostics, it should stop being treated as a primitive row

Locked scope boundary:
- do not widen this note into:
  - `Vec2` / `Vec3` child-row decisions
  - transform tree rollout
  - output-row styling
  - collection-row styling
  - toolbar redesign

Locked `Depth` proving read:
- the live `Geometry/Extrude` `Depth` row is the first proving surface for the primitive numeric style, not the whole semantic definition of every later scalar row
- in the currently honest shipped contract, `Depth` owns one positive extrusion magnitude in `mm`
- extrusion direction stays outside this row:
  - flip / reverse remains separate extrude state
  - this row should not imply symmetric, two-sided, or start-offset behavior that the runtime does not own yet
- the row should therefore read as:
  - one scalar magnitude lane
  - one inline unit-bearing numeric value
  - one reusable primitive-row shell that later scalar rows can borrow without inheriting extrude-specific wording
- later primitive rows may reuse:
  - shell structure
  - fill behavior
  - drag / step / direct-edit interaction
  - one-line driven-state presentation
- later primitive rows should not silently inherit:
  - `Depth` naming
  - positive-extrusion-only semantics
  - separate extrude flip ownership
  - `mm` as the permanent unit for every scalar row

### First Reuse Targets

- later float-like geometry rows such as:
  - `Depth`
  - later offsets
  - later taper-style scalar lanes
  - later width / height scalar rows where the type stays honestly primitive

### Nearby Implementation Seams

- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts`
- `src/app/theme/surfaces/spaghetti.css`
- focused node-row render tests

### Subphases

#### [x] `Nodes-2.5A` - `Primitive Row Fill And Lane Research`

Purpose:
- prove exactly why the current fill, label alignment, and endcap anchoring still read incorrectly before another implementation pass lands

Owns:
- tracing the live primitive-row lane breakdown in `PortView`
- proving whether the current fill problem is:
  - width math
  - invalid width expression behavior
  - lane sizing
  - overly weak contrast
  - or some combination
- documenting the exact visible columns the row currently renders
- comparing that current lane structure against the intended target lane structure

Does not own:
- the final layout rewrite by itself

Current strongest questions this phase should answer:
- what exact columns exist in the current row now?
- which of those columns should survive?
- is the current fill really a width-based lane fill, or is it only reading as a local left-side slab?
- why does `Depth` start farther right than `SketchProfile`?
- why do the endcaps still read as detached controls instead of row edges?

Current live seam read this research phase should start from:
- `src/app/spaghetti/canvas/PortView.tsx`
  - primitive-row branch starts at `valueInput.renderAs === 'paraSlider' && valueInput.primitiveRow === true`
  - current computed fill width is driven by:
    - `primitiveFillPercent`
    - `displayedTrackValue`
    - `min / max`
  - current inline width style is:
    - `width: primitiveFillPercent <= 0 ? '0px' : \`max(${primitiveFillPercent.toFixed(3)}%, 6px)\``
- `src/app/theme/surfaces/spaghetti.css`
  - current primitive row grid is:
    - `12px`
    - `1px`
    - `minmax(0, 1fr)`
    - `1px`
    - `12px`
  - current visible subparts are:
    - `SpaghettiPortPrimitiveEndcap`
    - `SpaghettiPortPrimitiveDivider`
    - `SpaghettiPortPrimitiveLane`
    - `SpaghettiPortPrimitiveFill`
    - `SpaghettiPortPrimitiveLaneContent`
    - `SpaghettiPortPrimitiveLabel`
    - `SpaghettiPortPrimitiveValueWrap`
- `src/app/spaghetti/canvas/typeColors.ts`
  - `number` rows currently use `#ffffff`

Current proven facts this phase should preserve:
- the fill math itself is already different for low versus high values
- using the current live range:
  - `353.2 / 2000` computes to about `17.656%`
  - `2000 / 2000` computes to `100%`
- so the strongest current suspicion is:
  - layout/presentation failure first
  - weak visual contrast second

Current visible columns this phase should name explicitly:
1. pin/socket
2. left endcap lane
3. left divider
4. center lane
5. right divider
6. right endcap lane

And inside the current center lane:
1. fill
2. label
3. right-side value/unit

Research outputs this phase must hand to `Nodes-2.5B`:
- one explicit statement of whether the current fill bug is:
  - bad width math
  - invalid width expression rendering
  - over-partitioned lane layout
  - fill being visually mistaken for the divider
  - weak number-row contrast
  - or a combination
- one explicit list of:
  - current columns
  - target columns
- one explicit statement of why the `Depth` label starts farther right than `SketchProfile`
- one explicit statement of what should count as the real slider/fill lane
- one explicit statement of whether the current dividers should remain visible in the target layout

Implementation-ready checks:
- name the current columns and the intended target columns
- prove whether the current fill width input is correct or not
- prove whether the current CSS presentation is masking valid width changes
- lock one target lane model for the next pass
- keep this phase non-mutating in spirit even if later handoff docs are updated: its job is proof and diagnosis, not another visual guess

Definition of done:
- there is one explicit seam read for:
  - current columns
  - target columns
  - actual fill failure mode
  - actual label alignment failure mode
  - actual endcap anchoring failure mode
- `Nodes-2.5B` can start from a written diagnosis instead of from screenshots plus intuition

Current diagnosis:
- the fill math is not the problem
  - the live row currently computes about:
    - `353.2 / 2000 -> 17.656%`
    - `2000 / 2000 -> 100%`
  - so the width input is already meaningfully different for low versus high values
- the main failure is presentation/layout
  - the current primitive row is over-partitioned into:
    - left endcap lane
    - left divider
    - one combined center lane
    - right divider
    - right endcap lane
  - and inside that one combined center lane the fill, label, and right-side value all compete for the same space
- the current visible “fill” can read like a narrow local slab near the left side because:
  - the fill is rendered underneath one shared center lane instead of under a dedicated slider/fill lane
  - the left divider and the pale number-color fill are visually similar enough that the divider can be mistaken for the fill edge
  - the number-row color is currently `#ffffff`, which makes the fill read as a faint gray wash rather than a strong width-tracking bar
- the current `Depth` label starts farther right than `SketchProfile` because:
  - `SketchProfile` starts after one compact control lane
  - `Depth` starts after:
    - the left endcap lane
    - the left divider
    - the center-lane padding
  - so the label is shifted right before the text even begins
- the current endcaps still do not read like true row-edge controls because:
  - each arrow lives inside its own visible narrow grid lane
  - those lanes are still perceived as detached inner controls rather than the real row edges

Current columns:
1. pin/socket
2. left endcap lane
3. left divider
4. combined center lane
5. right divider
6. right endcap lane

Current center-lane contents:
1. fill
2. label
3. value/unit

Research conclusion:
- the actual failure mode is a combination of:
  - over-partitioned lane layout
  - fill being visually mistaken for the divider
  - weak number-row fill contrast
- the strongest next move is not another color-only polish
- `Nodes-2.5B` should lock a new lane contract that separates:
  - edge controls
  - true fill/label slider lane
  - value lane

#### [x] `Nodes-2.5B` - `Primitive Row Lane Contract Lock`

Purpose:
- turn the `2.5A` research into one decision-complete primitive-row lane contract

Owns:
- locking the exact target row columns
- locking where the fill starts and stops
- locking where the label starts relative to the left row edge
- locking where the value sits relative to the right row edge
- locking whether separators remain visible, and if so where

Current strongest target direction:
- keep the pin outside the internal lane model in its normal row position
- treat the primitive row interior as:
  1. left endcap lane
  2. left separator
  3. fill + label slider lane
  4. value lane
  5. right separator
  6. right endcap lane

Why:
- this separates:
  - step controls
  - slider/fill area
  - numeric readout
- it also gives the next pass one clean contract instead of another CSS-only guess

Locked handoff from `Nodes-2.5A`:
- do not keep one combined middle lane for:
  - fill
  - label
  - value
- treat the current fill problem as a layout/readability issue, not as a value math issue
- the next lane contract must make it visually obvious that:
  - the fill owns a horizontal lane
  - the label starts on the same visual rhythm as nearby collapsed rows
  - the value lane is distinct from the slider/fill lane
  - the endcaps are the true row edges

Locked target columns:
1. pin/socket
2. left endcap lane
3. left separator
4. slider lane
5. value lane
6. right separator
7. right endcap lane

Locked target lane ownership:
- `left endcap lane`
  - owns only the decrement arrow
  - arrow should feel anchored to the real row edge, not like an inner button
- `left separator`
  - caps the start of the slider lane
  - should stay visually lighter than the fill
- `slider lane`
  - owns:
    - horizontal fill
    - label
    - drag surface
  - does not own:
    - value text
    - right-side unit/value readout
    - endcap controls
- `value lane`
  - owns:
    - numeric value
    - unit text
    - direct text editing
  - does not own:
    - horizontal fill
    - label
- `right separator`
  - caps the end of the value lane before the increment endcap
- `right endcap lane`
  - owns only the increment arrow

Locked fill rules:
- the fill starts immediately after the left separator
- the fill ends inside the slider lane only
- the fill must not extend under the value lane
- the fill must not be visually mistaken for either separator
- low and high values must produce visibly different horizontal fill lengths
- `300 / 2000` versus `2000 / 2000` should be an obvious visual contrast without needing hover/focus

Locked label-alignment rules:
- the visible `Depth` label should start on the same overall text rhythm as nearby collapsed rows like `SketchProfile`
- the label may sit inside the slider lane, but it should not pay an extra left offset from:
  - detached button chrome
  - oversized inner padding
  - a combined fill/value lane

Locked separator rules:
- keep the separators visible
- separators exist to define the slider lane and value lane boundaries
- separators should read as structural caps, not as the fill itself

Locked endcap rules:
- endcaps are true row-edge lanes, not floating buttons
- endcaps should keep only arrow affordance, no inner-box chrome
- their width should stay as narrow as possible while still remaining clickable

Locked implementation seam for the next pass:
- `src/app/spaghetti/canvas/PortView.tsx`
  - primitive row markup must be rebuilt to reflect the locked slider lane versus value lane split
- `src/app/theme/surfaces/spaghetti.css`
  - primitive row grid must be rebuilt to reflect the new column model
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - later parity checks should assert the corrected lane structure and visual behavior contract where feasible

Implementation-ready checks:
- the target columns are named and ordered explicitly
- each lane owns one clear responsibility
- the fill is no longer allowed to share the same lane as the right-side value
- the label alignment expectation is explicit enough that `2.5C` does not need to invent spacing rules
- the separator/endcap visibility rules are explicit enough that `2.5C` does not need to guess whether they survive

Definition of done:
- `Nodes-2.5C` can rebuild the primitive `Depth` row from one locked lane contract instead of from visual intuition
- the implementer does not need to decide:
  - column count
  - lane ownership
  - fill extent
  - value-lane separation
  - whether separators remain

Current shipped output:
- the primitive-row lane contract is now explicitly locked as:
  1. pin/socket
  2. left endcap lane
  3. left separator
  4. slider lane
  5. value lane
  6. right separator
  7. right endcap lane
- `Nodes-2.5C` now owns only the live rebuild to make the rendered `Depth` row match that contract

Definition of done:
- the primitive row has one locked target lane breakdown that an implementer can rebuild toward without making fresh layout decisions

#### [x] `Nodes-2.5C` - `Primitive Row Visual Parity Rebuild`

Purpose:
- rebuild the live primitive `Depth` row to match the locked `2.5B` lane contract

Owns:
- making the fill visibly track width across the intended lane
- aligning the `Depth` label rhythm with nearby collapsed rows
- anchoring the endcaps honestly to the row edges
- keeping drag, step, direct edit, and driven state intact through the rebuild

Does not own:
- broader composite/output/collection row adoption
- additional primitive-row family rollout beyond the current `Depth` proving surface

Acceptance checks:
- `300 / 2000` and `2000 / 2000` have a clear visible difference
- the fill reads as a horizontal bar, not as a left-side slab
- the `Depth` label starts on the same visual rhythm as `SketchProfile`
- the endcaps read as true row-edge controls

Definition of done:
- the live `Depth` row actually matches the intended primitive-row visual contract, not just the abstract direction

Current strongest rebuild target:
- rebuild the primitive row markup in `src/app/spaghetti/canvas/PortView.tsx` so it follows the locked `2.5B` lane contract directly instead of trying to salvage the current combined middle lane
- rebuild the primitive row grid/styling in `src/app/theme/surfaces/spaghetti.css` so the rendered `Depth` row has:
  - one true slider lane
  - one separate value lane
  - real row-edge endcaps
  - separators that cap lanes without masquerading as fill

Current implementation seams this phase should own:
- `src/app/spaghetti/canvas/PortView.tsx`
  - rebuild the primitive-row markup to match:
    1. left endcap lane
    2. left separator
    3. slider lane
    4. value lane
    5. right separator
    6. right endcap lane
  - keep the pin outside that internal lane model
  - keep the primitive-row branch reusable for later float-like rows
- `src/app/theme/surfaces/spaghetti.css`
  - rebuild the primitive-row grid and lane styling to match the locked contract
  - make the fill visually strong enough to read for `number` rows without becoming a second bordered control
- focused tests:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/structuredWireNumericRowProps.test.ts`

Locked behavior that must survive the rebuild:
- primitive row stays one line only
- no attached `Depth Value` body returns
- direct right-side value editing still works
- left/right step controls still work
- center slider lane drag still works
- driven rows still disable interaction while preserving one-line primitive presentation
- `structuredWireNumericRowProps` stays behavior-facing only; this phase must not push visual layout policy back into that helper

Locked visual target for the rebuild:
- the visible row should read as:
  - pin
  - left edge arrow
  - separator
  - horizontal fill lane with `Depth` label
  - separate value lane with `mm`
  - separator
  - right edge arrow
- the label should no longer start after a detached control gutter plus extra inner padding
- the fill should no longer sit underneath the value lane
- the separators should read as lane boundaries only

Implementation-ready checks:
- the current combined middle lane is removed
- the fill is constrained to the slider lane only
- the label and value no longer compete for the same lane
- the endcaps are rendered and styled as real row-edge lanes
- the resulting row has a visible difference between low and high depth values
- the resulting row keeps the same functional interactions as the current primitive row

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/canvas/structuredWireNumericRowProps.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `.\node_modules\.bin\tsc.cmd -b --pretty false`
- if the direct `NodeView` suites still hit the known `Worker is not defined` runner path, record that explicitly and rely on focused coverage plus manual visual verification

Manual acceptance:
- `353.2 mm` and `2000.0 mm` produce obviously different fill lengths
- the fill reads as a horizontal lane, not as a local slab near the left side
- `Depth` starts on the same visual text rhythm as `SketchProfile`
- the left and right arrows read as true edge controls
- the right-side value lane stays visually distinct from the slider lane

Current shipped output:
- `src/app/spaghetti/canvas/PortView.tsx` now renders the primitive row with:
  - separate slider lane
  - separate value lane
  - fill width driven by plain percentage plus minimum visible width when non-zero
- `src/app/theme/surfaces/spaghetti.css` now styles the fill as a dedicated horizontal lane instead of a faint left-side slab inside one combined center lane
- focused row tests now assert the separate primitive value lane in the rendered structure

### Definition Of Done

- there is one stable doc that explains:
  - what a primitive numeric row is
  - how it differs from expandable managed rows
  - what its shell, fill, label, value, and step controls should look like
- later node work can reuse the primitive-row style intentionally instead of re-discovering it case by case
- the first live proving row actually meets that visual contract instead of only approximating it

# Dashboard Phase Dashboard-12 - Lane Layout Tools And Smart Align

## Doc Header

### Doc History
1. 2026-04-04 19:30: Closed `Phase 12.2 - Smart Align Toggle For Non-Overlapping Stack Alignment` after shipping the lane-local smart-align toggle through `DashboardSurface.tsx` plus focused AppShell coverage, so vertical and horizontal align can now optionally redistribute selected notes without overlap while keeping the exact-edge align mode available when the toggle is off
1. 2026-04-04 19:33: Tightened `Phase 12.2 - Smart Align Toggle For Non-Overlapping Stack Alignment` into an implementation-ready dashboard lane-tools slice by grounding it in the live align helper seam plus the shipped real-note bounds math in `DashboardSurface.tsx`, then locking the visible toggle behavior, selection scope, ordering, shared gap usage, and focused regression shape before runtime work begins
1. 2026-04-04 19:10: Closed `Phase 12.1 - Arrange Notes Into A Lane Grid` after shipping the new lane-local grid action through `DashboardSurface.tsx` so selected notes now arrange into a deterministic non-overlapping lane grid while full-lane fallback still works when there is no meaningful selection, then updated this doc so `Phase 12.2` is the next layout-tools follow-on
1. 2026-04-04 19:08: Created this dedicated `Dashboard-12` future phase doc so the next lane-layout-tool work has one canonical planning home separate from the broader `Dashboard-7` backlog, and locked the first two subphases around one-shot lane grid arrangement plus a smart-align toggle that prevents overlap while preserving note order

### Purpose

Use this doc as the dedicated future planning home for the next dashboard lane-layout tools after the recent top-shell cleanup passes.

This doc is specifically for:
- one-shot lane grid arrangement
- smarter non-overlapping align behavior
- the related toolbar and interaction rules

This doc is not for:
- sticky-note attachment-tree behavior
- sticky-note resizing foundation
- burger-menu cleanup
- global dashboard shell polish outside the lane layout tools

## Doc Body

### Summary

`Dashboard-12` now needs a focused follow-on for lane-level note arrangement tools.

The shared theme is:
- help users quickly clean up messy lanes
- keep alignment useful even with resizable sticky notes
- avoid overlap when the user wants ordered alignment rather than edge collapse

### Scope

The first dedicated `Dashboard-12` tool ladder should stay inside one lane at a time and build on the shipped selection, align, and variable-note-size groundwork.

Important rule:
- all layout math should use the live sticky-note bounds helpers and real note width/height

### Phase Breakdown

1. `Phase 12.1 - Arrange Notes Into A Lane Grid`
Reason:
- this is the clearest one-shot cleanup action and should land first as a deterministic lane organization tool

2. `Phase 12.2 - Smart Align Toggle For Non-Overlapping Stack Alignment`
Reason:
- this widens the existing align actions without replacing them, and should land only after the lane tool surface explicitly owns one more stateful layout action

### Notes

Recommended user model:
- `Grid` is a one-shot action
- `Smart Align` is a visible toggle state
- existing vertical and horizontal align buttons reuse that toggle when active

Ordering rule:
- when redistributing notes, preserve the user’s current rough order
- vertical stack order should sort by current `y`
- horizontal stack order should sort by current `x`

Spacing rule:
- use one default lane-layout gap
- prefer reusing the existing sticky-note spacing language already present in the dashboard board

## [x] Phase 12.1 - Arrange Notes Into A Lane Grid

### Summary

#### Purpose:
- add one lane-local cleanup action that arranges notes into a clean visible grid

#### Current read:
- the dashboard already has lane-local align buttons and lane-local note ownership
- the sticky-note geometry seam now uses real note bounds instead of only fixed-size assumptions
- the lane header toolbar is now compact enough to host one additional one-shot layout action

#### Main work:
- add one `Grid` action to the lane toolbar
- if 2 or more notes are selected in the lane, arrange only the selected notes
- otherwise arrange all notes in the lane
- place notes left-to-right then top-to-bottom
- use real note width and height plus one default gap

#### Done shape:
- the user can clean up a messy lane in one click
- the grid layout is deterministic
- no arranged notes overlap after the action

### Questions / Decisions

#### [x] Question 1 - Should grid operate on selection or whole lane?

##### Locked answer
- selected notes when the lane has 2 or more selected notes; otherwise the full lane

##### Why
- this keeps the action useful both as a full cleanup tool and as a lighter multi-note arrangement tool

#### [x] Question 2 - Should grid use fixed note size or real note bounds?

##### Locked answer
- real note bounds

##### Why
- sticky notes are now resizable, so fixed-size arrangement would immediately feel dishonest

#### [x] Question 3 - Should grid preserve note order or repack arbitrarily?

##### Locked answer
- preserve current visual order

##### Why
- users already communicate intent with approximate placement, and grid should clean that up instead of reshuffling it

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- add one lane-local `Grid` toolbar action
- use selected notes when the lane has a meaningful selection; otherwise use all lane notes
- sort by current `y`, then `x`, then stable note id
- place notes into a simple deterministic left-to-right grid using real note dimensions
- use one default gap shared with the existing board spacing language
- keep the action lane-local and dashboard-owned

Explicit exclusions:
- do not widen this slice into auto-layout persistence or background auto-reflow
- do not change attachment semantics
- do not add cross-lane arrangement

Checklist:
- [x] Add lane-local `Grid` action
- [x] Lock selected-notes-versus-full-lane targeting
- [x] Use real note dimensions
- [x] Prevent overlap in the arranged result
- [x] Add focused dashboard regressions

Verification:
- selected notes arrange into a visible grid without overlap
- full-lane fallback works when there is no meaningful selection
- resized notes still arrange honestly

Current shipped output:
- lane headers now include one lane-local `Grid` action beside the existing layout tools
- when 2 or more notes are selected in the lane, grid arranges only that selected set
- when there is no meaningful selection, grid falls back to arranging the full lane
- arrangement now uses the real sticky-note dimensions, preserving resized note width and height while preventing overlap

## [x] Phase 12.2 - Smart Align Toggle For Non-Overlapping Stack Alignment

### Summary

#### Purpose:
- widen the existing vertical and horizontal align actions so they can optionally stack notes without overlap instead of collapsing them onto the same edge coordinate

#### Current read:
- vertical align currently normalizes `x` to one anchor note
- horizontal align currently normalizes `y` to one anchor note
- that behavior is still useful, but it becomes visually messy when notes are different sizes or close together
- the live owner seam is the current `handleAlignSelectedNotes` path in `DashboardSurface.tsx`
- the shipped sticky-note geometry seam already exposes real width and height for resized notes, so non-overlap redistribution can now stay honest without another geometry refactor
- the lane header already owns the current align buttons and the newly shipped `Grid` tool, so the visible toggle can land in the same lane-local tool row

#### Main work:
- add one visible `Smart Align` toggle
- when off, keep the current exact-edge align behavior
- when on, vertical align should keep one shared `x` but redistribute `y` with padding so notes stack top-to-bottom without overlap
- when on, horizontal align should keep one shared `y` but redistribute `x` with padding so notes stack left-to-right without overlap

#### Done shape:
- the user can choose between exact-edge collapse and ordered non-overlapping alignment
- resizable notes align in a way that still looks deliberate and readable

### Questions / Decisions

#### [x] Question 1 - Should smart align replace the current align behavior or be optional?

##### Locked answer
- optional via visible toggle

##### Why
- the current exact-edge align behavior is still valid for some layout intentions
- replacing it outright would remove a precise alignment mode users may still want

#### [x] Question 2 - How should smart align preserve order?

##### Locked answer
- vertical smart align sorts by current `y`
- horizontal smart align sorts by current `x`

##### Why
- this keeps the user’s rough intended order instead of shuffling notes unexpectedly

#### [x] Question 3 - Should smart align use note bounds or one shared default card size?

##### Locked answer
- note bounds

##### Why
- the dashboard now supports resized sticky notes, so overlap prevention must respect real dimensions

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/foundation/base.css`

Locked first-cut direction:
- add one visible `Smart Align` toggle in the lane toolbar
- keep current align behavior unchanged when the toggle is off
- when on:
  - vertical align anchors `x` and stacks `y` with default gap using each note height
  - horizontal align anchors `y` and stacks `x` with default gap using each note width
- keep the action lane-local and selection-scoped just like the current align behavior
- keep the toggle surface-local rather than persisted
- keep the selection requirement the same as the current align buttons: no meaningful align action until 2 or more notes are selected in the lane
- preserve current visual order when redistributing:
  - vertical smart align sorts by `y`, then `x`, then stable note id
  - horizontal smart align sorts by `x`, then `y`, then stable note id
- reuse the shared dashboard note gap that already powers grid and default placement language

Suggested first-cut execution:
1. Add one lane-local boolean toggle state in `DashboardSurface.tsx`.
2. Add one compact visible toolbar button with active/inactive styling.
3. Split the current align helper into:
   - exact-edge align path
   - smart non-overlapping redistribute path
4. Reuse real note dimensions through the existing sticky-note geometry helper seam.
5. Add focused regressions for smart vertical align, smart horizontal align, and toggle-off parity with current behavior.

Explicit exclusions:
- do not widen this slice into global app preferences
- do not auto-toggle based on note overlap
- do not replace the current exact-edge align mode
- do not change the new grid action
- do not introduce global dashboard-level layout toggles

Checklist:
- [x] Add visible `Smart Align` toggle state
- [x] Keep the toggle surface-local and not persisted
- [x] Keep current align behavior unchanged when off
- [x] Add non-overlapping stack redistribution when on
- [x] Use real note dimensions plus shared gap
- [x] Preserve current note order while redistributing
- [x] Keep existing align enable/disable rules unchanged
- [x] Add focused dashboard regressions

Verification:
- smart vertical align keeps shared `x` and non-overlapping `y`
- smart horizontal align keeps shared `y` and non-overlapping `x`
- toggle-off behavior matches current align output
- resized notes do not overlap after smart align
- the visible toggle state is obvious in the lane toolbar

Current shipped output:
- lane headers now include one visible `Smart` align toggle beside the existing layout tools
- the toggle is lane-local, surface-local, and not persisted
- with the toggle off, the current exact-edge align behavior remains unchanged
- with the toggle on, vertical align keeps one shared `x` while stacking `y` without overlap
- with the toggle on, horizontal align keeps one shared `y` while stacking `x` without overlap
- smart redistribution now uses real sticky-note width and height plus the shared dashboard gap, so resized notes align cleanly

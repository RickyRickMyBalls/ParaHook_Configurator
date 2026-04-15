# View Toolbar Phase View-Toolbar 5 - UI Polish And Surface Clarity

## Doc Header

### Doc History
21. 2026-04-14 22:45:18: Landed a second `View-Toolbar 5 Phase 4 - Immediate Section-Collapse Height Snap` runtime attempt that restores explicit subsection `toggle` wake-up, coalesces toolbar-local height triggers through one queued sync, and keeps the browser-resize plus `.ViewportFrameBody` wake-up path from the first attempt, while leaving the phase at partial `~` status until live viewport behavior confirms the regressions are actually gone
20. 2026-04-14 22:41:44: Reopened `View-Toolbar 5 Phase 4 - Immediate Section-Collapse Height Snap` to partial `~` status after live code review showed the first implementation fixed the browser-resize wake-up seam but regressed truthful content shrink by removing the explicit subsection `toggle` height sync too aggressively, leaving the toolbar dependent on observer-only panel updates and still visually stepping through repeated height recomputes during collapse
19. 2026-04-14 22:33:56: Marked `View-Toolbar 5 Phase 4 - Immediate Section-Collapse Height Snap` complete after the runtime pass removed the redundant subsection `toggle` resync path, moved the open-state natural-height read onto the inner panel seam, and added reliable viewport-body plus browser-resize wake-ups so the toolbar now snaps to its final height and recomputes when the model viewport changes size
18. 2026-04-14 22:08:31: Prepped `View-Toolbar 5 Phase 4 - Immediate Section-Collapse Height Snap` for implementation by locking the live height-sync seam in `ViewToolbar.tsx`, making the browser-resize trigger gap explicit, and narrowing the next runtime cut to one toolbar-local trigger and natural-height cleanup pass with focused `ViewToolbar.test.tsx` proof
17. 2026-04-14 22:02:44: Refined `View-Toolbar 5 Phase 4 - Immediate Section-Collapse Height Snap` after the live resize-chain review, locking in that browser-window resize should also recompute toolbar height because the toolbar derives its max-height math from `.ViewportFrameBody`, and recording the current trigger gap where `ViewToolbar.tsx` only keeps a `window.resize` listener when `ResizeObserver` is unavailable while otherwise observing only `.RightPanelStack` and `.ViewToolbarPanel`
16. 2026-04-14 21:52:11: Added `View-Toolbar 5 Phase 4 - Immediate Section-Collapse Height Snap`, grounding the next toolbar polish slice in the live read that the remaining slow shrink no longer comes from a CSS root-height transition, but from the toolbar's current remeasure loop where `ViewToolbar.tsx` still derives natural height from `.ViewToolbarRoot.scrollHeight` while a `ResizeObserver` watches the inner panel and subsection `toggle` listeners also force repeated height sync during open/close
15. 2026-04-14 21:35:22: Marked `View-Toolbar 5 Phase 3 - Snap Subsection Split` complete after the runtime regrouping pass added the new top-level `Snap` subsection, moved the snap fields and `Apply Snap` action there, kept the non-snap controls in `Transform`, and widened focused toolbar proof so the section ownership split is now explicit and shipped
14. 2026-04-14 21:31:42: Prepped `View-Toolbar 5 Phase 3 - Snap Subsection Split` for implementation by locking the exact snap control move list, grounding the phase in the now-shipped `Transform` versus `Gizmo` split, and narrowing the runtime cut to `ViewToolbar.tsx` plus focused toolbar proof instead of widening into new snap behavior or broader toolbar redesign
13. 2026-04-14 21:26:31: Marked `View-Toolbar 5 Phase 2 - Transform Subsection Split And Gizmo Scope Cleanup` complete after the runtime regrouping pass added the new top-level `Transform` subsection, moved the older transform-interaction controls there, kept the newer gizmo-style controls in `Gizmo`, and widened focused toolbar proof so the ownership split is now explicit and shipped
12. 2026-04-14 21:18:42: Added `View-Toolbar 5 Phase 3 - Snap Subsection Split`, locking the next toolbar regrouping follow-on to one explicit pass that should pull the snap fields and `Apply Snap` action out of `Transform` into a new top-level `Snap` subsection while leaving non-snap transform controls in `Transform`
11. 2026-04-14 21:10:18: Prepped `View-Toolbar 5 Phase 2 - Transform Subsection Split And Gizmo Scope Cleanup` for implementation by locking the exact control move list, keeping the newer gizmo-style controls in place, and narrowing the runtime cut to `ViewToolbar.tsx` plus focused toolbar proof instead of widening into new transform behavior or broader toolbar redesign
10. 2026-04-14 21:01:12: Added `View-Toolbar 5 Phase 2 - Transform Subsection Split And Gizmo Scope Cleanup`, locking the next toolbar-structure follow-on to one explicit regrouping pass where the older transform controls should move out of `Gizmo` into a new top-level `Transform` subsection while the newer gizmo-specific appearance controls stay in `Gizmo`
9. 2026-04-14 20:47:38: Marked `View-Toolbar 5 Phase 1c - Collapse Remeasure Loop And Immediate Height Settle` complete after the runtime pass stopped the toolbar height sync from observing the animating root, switched natural-height reads onto the inner panel-plus-summary seam, and removed the root height transition so submenu collapse now settles promptly instead of dragging through a self-chasing resize loop
8. 2026-04-14 20:40:45: Added `View-Toolbar 5 Phase 1c - Collapse Remeasure Loop And Immediate Height Settle`, locking the next toolbar follow-up to the newly traced slow-collapse seam where `.ViewToolbarRoot` still animates `height/max-height` while a `ResizeObserver` also watches that same root and remeasures from its live `scrollHeight`, so the next implementation slice now explicitly owns breaking that self-chasing height loop instead of treating the problem as generic later polish
7. 2026-04-14 20:25:24: Marked `View-Toolbar 5 Phase 1b - Used-Height Clamp And Console-Bar Reserve` complete after the runtime pass taught `ViewToolbar.tsx` to compute the toolbar's used height as the smaller of natural content height and `model viewport height - toolbar top offset - console reserve`, recording that the black toolbar box now shrinks with submenu closures while the full toolbar root keeps overflow ownership once the cap is reached
6. 2026-04-14 20:18:42: Added `View-Toolbar 5 Phase 1b - Used-Height Clamp And Console-Bar Reserve`, folding the live follow-up height formula into the plan so the next toolbar pass now explicitly clamps the used toolbar height to `model viewport height - toolbar top offset - console reserve (~30px)` and requires the black toolbar box to shrink back down when submenu content no longer needs the full cap
5. 2026-04-14 20:10:18: Marked `View-Toolbar 5 Phase 1 - Toolbar Scroll Ownership And Viewport Clamp` complete after the runtime pass landed in `ViewToolbar.tsx` plus `viewport-overlay.css`, recording that the full toolbar now publishes one measured pixel clamp from the right-panel stack into `.ViewToolbarRoot` while keeping `.ViewToolbarPanel` as content flow with bottom breathing room and proving the seam through focused `ViewToolbar.test.tsx` coverage
4. 2026-04-14 15:52:18: Prepped `View-Toolbar 5 Phase 1 - Toolbar Scroll Ownership And Viewport Clamp` for implementation by locking the live runtime seam to the `ViewToolbar.tsx` plus right-dock CSS path, confirming that the whole toolbar rather than any subsection must own scrolling, and narrowing the first code pass to a model-viewport-owned height/overflow contract with focused toolbar proof coverage
3. 2026-04-14 15:44:58: Corrected `View-Toolbar 5` Phase 1 after the live overflow investigation, replacing the older scrollbar-appearance-first framing with the actual first polish seam: the full `View` toolbar must own one real scroll surface, clamp against the bottom of the model viewport it lives in, and prove working overflow behavior before narrower scrollbar styling polish widens
2. 2026-04-14 15:18:59: Split the new `View-Toolbar 5` polish lane so its first internal execution slice is explicitly the toolbar scrollbar pass, giving overflow and scroll affordance cleanup one concrete starting phase before the broader density and readability polish widens
1. 2026-04-14 15:16:14: Created this standalone future phase doc for `View-Toolbar 5`, turning the later toolbar-shell polish idea into one explicit implementation-ready planning surface centered on density, spacing, active-state legibility, overflow behavior, and overall surface clarity after the core feature phases land

### Purpose

This doc locks the fifth `View-Toolbar` phase.

Use it to answer:
- what later `View-Toolbar` UI polish should own after the core feature families are in place
- which readability and layout problems deserve a dedicated phase instead of being smuggled into feature work
- how toolbar density, spacing, grouping, and active-state clarity should improve without inventing new view-state behavior
- how late polish should stay aligned with the visible `View` surface, console wording, and the in-context UI polish rule already implied by `Gizmo-Vision.md`

### Why This Phase Exists

After the projection, lens, grid, background, and helper families exist, the next honest follow-on is not automatically another feature bucket.

There is also a later surface-quality phase around:
- section density
- row spacing
- visual grouping clarity
- active/selected/read-only state legibility
- overflow and small-width behavior
- copy and label cleanup

Those are real product-quality concerns, but they should stay clearly downstream from feature ownership.

This phase exists so the family can improve the final `View` surface without reopening the earlier architectural questions every time one row feels crowded or one state read feels visually weak.

### Scope

This phase covers:
- view-toolbar shell density and spacing polish
- section and row grouping clarity
- active, inactive, hover, and disabled state readability
- overflow, scroll, wrapping, and compact-width behavior
- label, caption, and readout copy polish

This phase does not cover:
- new projection, lens, grid, background, or helper features
- new transform semantics
- new camera-feel controls
- new console grammar branches
- app-wide theme redesign beyond what the `View` toolbar itself needs

## Doc Body

## [ ] - `View-Toolbar 5` - `UI Polish And Surface Clarity`

### Header

Purpose:
- make the `View` toolbar feel intentionally readable, compact, and visually coherent after the main feature families have landed

Owns:
- spacing and density polish
- section hierarchy/readability polish
- active-state and mode-read legibility
- overflow and narrow-width presentation cleanup
- final toolbar-surface copy cleanup

Keeps for later or elsewhere:
- any new feature family
- broader app-theme redesign
- transform/gizmo semantic changes

### Target Result

At the end of this phase:
- the `View` toolbar reads as one cohesive surface instead of a pile of independently-added rows
- compact layouts remain readable instead of collapsing into crowding or clipped controls
- active state, current mode, and current value are visually obvious
- labels and section wording feel consistent with the console and surrounding viewport UI
- the phase improves polish without becoming a hidden feature-expansion bucket

### Questions / Decisions

#### [ ] q1 - Should the polish priority be compact density or generous readability?

Question:
- when there is tension between fitting more controls on screen and keeping rows calm and readable, which side should lead?

Suggestion:
- favor readable compactness
- reduce wasted space, but do not compress the toolbar until labels, values, and active-state cues become harder to scan

#### [ ] q2 - Should icon-only controls be allowed in the polished toolbar?

Question:
- should late polish replace some text labels with icons, or keep visible wording as the default?

Suggestion:
- keep wording as the default
- use icon-only controls only where the meaning is already extremely stable and obvious

#### [ ] q3 - Should responsive collapse/overflow behavior be part of this phase?

Question:
- if the toolbar grows tall or narrow, should this polish phase include better collapse, wrapping, or compact presentation rules?

Suggestion:
- yes
- responsive and overflow behavior are part of surface clarity, not just styling garnish

### Internal Phase Ladder

This polish lane should still start through one narrow first slice instead of trying to restyle the whole toolbar at once.

## [x] Phase 1 - Toolbar Scroll Ownership And Viewport Clamp

Purpose:
- make the full `View` toolbar own one real scroll surface that clamps to the bottom of the model viewport it lives in instead of clipping against the wrong container or browser-level height math

Owns:
- picking one scroll owner for the whole `View` toolbar rather than one subsection or an accidental ancestor clip box
- proving that the toolbar bottom is measured against the model viewport body, not the page viewport
- establishing a real overflow contract that produces a working scrollbar only when the full toolbar actually exceeds the available model-viewport height
- preserving enough bottom breathing room that the last controls can scroll fully into view instead of being visually cut off

Does not own:
- decorative thumb/track styling as the primary goal
- section density rewrites
- label/copy cleanup
- broader row-spacing and hierarchy polish

Why first:
- the toolbar cannot be polished honestly while its bottom clamp and overflow ownership are still wrong
- visible scrollbar styling is downstream from proving that the full surface scrolls inside the model viewport instead of being clipped by ancestor layout
- this is the smallest honest UI-polish proof because it fixes the basic "can the user reach the last control?" contract before widening into spacing and readability refinement

This phase should:
- identify the actual model-viewport container that defines the toolbar's usable bottom edge
- make the full `View` toolbar, not an individual subsection, the single intended vertical scroll surface
- ensure overflow produces a real usable scrollbar when needed and no persistent scrollbar when the toolbar still fits
- ensure the final controls can scroll fully above any docked surface overlap instead of ending clipped off-screen
- leave thumb/track color and hover-state polish as a follow-on detail once the ownership and height contract are proven

### Current Constraints

Current live seams this phase should read against:
- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/theme/shell/docks.css`

Reference-only viewport container chain:
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/theme/foundation/base.css`

Current code-backed read:
- `ViewToolbar.tsx`
  - renders the toolbar inside one `RightDock` with one `RightPanelStack`, one `.ViewToolbarRoot`, and one `.ViewToolbarPanel`
  - now measures the live `.RightPanelStack` height and publishes both the toolbar-local bottom breathing-room seam and the measured `--v15-view-toolbar-max-height` clamp
- `docks.css`
  - makes `.RightDock` the viewport-side absolute shell with `top: 0`, `bottom: 0`, and `overflow: hidden`
  - makes `.RightPanelStack` the flexible vertical stack with `flex: 1 1 auto` and `min-height: 0`
- `viewport-overlay.css`
  - now gives `.ViewToolbarRoot` a measured `--v15-view-toolbar-max-height` clamp plus open-state `overflow-y: auto`
  - currently keeps `.ViewToolbarPanel` as content flow with bottom padding only
- `ViewportWorkspaceHost.tsx` plus `base.css`
  - place the toolbar inside the model viewport workspace/frame chain, so the correct bottom owner is the model viewport body rather than the page viewport

### Locked Direction

#### 1. Keep The Full Toolbar As The Only Scroll Owner

Important rule:
- do not move scrolling into individual subsections such as `Camera`, `Gizmo`, or `Materials`
- do not split scroll ownership between the toolbar shell and one subsection body

#### 2. Clamp Against The Model Viewport Chain

Important rule:
- do not reintroduce `100dvh` or another browser-window proxy for the toolbar bottom
- the used height must be owned by the model viewport chain the toolbar already lives in

#### 3. Use A Definite Height Contract, Not Only A Soft Max Height

Important rule:
- `max-height: 100%` by itself is not enough if the scroll surface can still size to content and then get clipped by an ancestor
- the first implementation pass should lock one definite flex-owned height/overflow contract so the toolbar itself, not an ancestor clip box, owns the overflow

#### 4. Keep Bottom Breathing Room In The Content Layer

Important rule:
- keep bottom clearance as toolbar-local content padding where practical
- do not solve console overlap by shrinking the whole viewport-owned toolbar height against the wrong bottom reference

### Implementation Target

`Phase 1` should make one behavior shift real:

- the full `View` toolbar should become one reliable vertical scroll surface inside the model viewport, with the scrollbar appearing only when the toolbar truly exceeds the available viewport-owned space and with the last controls remaining reachable above any docked overlap

The minimum meaningful behavior change should be:
1. `RightDock` remains the viewport-owned shell
2. `RightPanelStack` remains the sizing stack
3. `.ViewToolbarRoot` becomes the single intended scroll owner for the full toolbar through a definite height/overflow contract
4. `.ViewToolbarPanel` remains content flow plus bottom breathing room, not a second scroll box

### Expected File Targets

Primary runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`

Possible supporting runtime file:
- `src/app/theme/shell/docks.css`

Possible supporting proof file:
- `src/app/components/ViewToolbar.test.tsx`

No-widening rule:
- do not touch `ViewerHost`
- do not widen into `ConsoleDock` behavior
- do not move the fix into subsection-local components
- do not touch the viewport-frame chain unless the existing owner path truly cannot provide the needed height contract

### Verification Bar

This phase is only done if it proves all of the following:
- the full toolbar owns one clear vertical scroll seam
- the scrollbar does not persist when the toolbar still fits inside the model viewport
- the scrollbar does appear when the toolbar actually overflows
- the last controls can scroll fully into view instead of being clipped at the bottom
- removing the console still lets the toolbar use the real model-viewport bottom rather than stopping early against leftover offset math

Required proof:
- widen `src/app/components/ViewToolbar.test.tsx` so the scroll-owner seam remains attributed to the full toolbar surface
- verify the open/closed state remains local to each viewport while the scroll-owner seam stays stable
- verify the first pass remains toolbar-local instead of widening into broader viewport-shell behavior

### Suggested Implementation Order

1. Confirm the live owner chain from `RightDock` through `RightPanelStack` into `.ViewToolbarRoot` and keep that chain local to the toolbar files.
2. Replace the current soft `max-height`-only clamp with one definite height/overflow contract for the full toolbar scroll surface.
3. Keep `.ViewToolbarPanel` as content flow with bottom breathing room through `--v15-view-toolbar-content-padding-bottom`.
4. Only touch `docks.css` if the toolbar cannot get a reliable height contract from `ViewToolbar.tsx` plus `viewport-overlay.css` alone.
5. Add or widen focused `ViewToolbar.test.tsx` proof so the full-toolbar scroll-owner seam is explicit and stable.

### Phase 1 Result

- `ViewToolbar.tsx` now measures the live `.RightPanelStack` height and publishes `--v15-view-toolbar-max-height` onto the full `.ViewToolbarRoot`.
- `.ViewToolbarRoot` now clamps against that measured pixel cap in `viewport-overlay.css` instead of relying only on a soft percentage height.
- `.ViewToolbarPanel` remains content flow plus the existing bottom breathing-room seam through `--v15-view-toolbar-content-padding-bottom`, so the fix does not create a second nested scroll box.
- `ViewToolbar.test.tsx` now proves the full toolbar scroll surface receives the measured max-height seam while the viewport-local open/closed ownership contract stays intact.

## [x] Phase 1b - Used-Height Clamp And Console-Bar Reserve

Purpose:
- make the black `View` toolbar box use only the height it currently needs while still stopping at the correct bottom limit of the model viewport instead of staying needlessly tall

Owns:
- the used-height rule for how tall the visible toolbar box should be when submenu content grows or shrinks
- the explicit reserve for the docked bottom console bar
- the top-offset subtraction so the toolbar height is measured from where the toolbar actually starts, not from the top of the model viewport

Does not own:
- subsection-local scrollbars
- scrollbar visual styling
- broader spacing, copy, or hierarchy polish outside the height-and-clamp contract

Why next:
- `Phase 1` fixed scroll ownership and the basic viewport-owned clamp seam
- the next remaining bug is that the toolbar can still stay visually taller than it needs to be when content is short
- the honest next slice is to make the toolbar shrink back down while preserving the correct bottom stop above the console bar

Locked height formula:
- `max usable toolbar height = model viewport height - toolbar top offset - console reserve`
- for the current docked-bottom case, the console reserve should start as approximately `30px`

Important interpretation rule:
- do not treat `model viewport height` by itself as the toolbar max height
- the toolbar starts below the top of the model viewport, so the top offset must be subtracted before the bottom reserve is applied

This phase should:
- measure the toolbar's actual top offset inside the model viewport it lives in
- subtract the docked console-bar reserve from the remaining vertical space
- use the smaller of:
  - natural toolbar content height
  - computed usable toolbar height
- keep `.ViewToolbarRoot` as the only scroll owner once the used height hits that cap
- let the black toolbar box shrink back down when closing `Camera`, `Gizmo`, `View`, `Environment`, or `Materials` reduces the natural content height

Expected behavior change:
- when the toolbar content is short, the black `View` box should collapse to its content instead of hanging down with dead space
- when the toolbar content grows, it should stop at:
  - `model viewport height - toolbar top offset - ~30px`
- once that limit is reached, the full toolbar root should continue to own the scrollbar

Done when:
- the toolbar no longer keeps large empty dead space below the last visible section when content is short
- opening or closing subsections changes the used toolbar height immediately
- the toolbar never grows below the docked console bar reserve
- the used-height cap is explicitly based on model viewport height minus toolbar top offset minus console reserve, not a looser viewport-only shortcut

### Phase 1b Result

- `ViewToolbar.tsx` now computes the used toolbar height as the smaller of:
  - natural toolbar content height
  - `model viewport height - toolbar top offset - console reserve`
- the current docked-bottom reserve now starts at approximately `30px` for the collapsed console bar, while the expanded docked case still uses the live expanded console height plus a small gap.
- `.ViewToolbarRoot` now uses the new measured `--v15-view-toolbar-used-height` variable as its actual height, so the black toolbar box shrinks when content is short instead of hanging down with dead space.
- the full toolbar root still owns scrolling once the used height reaches the computed cap.

## [x] Phase 1c - Collapse Remeasure Loop And Immediate Height Settle

Purpose:
- stop the `View` toolbar from collapsing through a long self-chasing settle when submenu content shrinks, so closing `Camera`, `Gizmo`, `View`, `Environment`, or `Materials` snaps the black box to its correct smaller height instead of slowly gliding there

Owns:
- the slow-collapse seam where the toolbar currently animates `height/max-height` while also remeasuring from the same animating root
- the measurement source for natural toolbar content height during submenu open/close
- the observer contract for which elements should trigger toolbar height recomputation

Does not own:
- broader scrollbar styling polish
- new toolbar spacing or copy cleanup
- new view-toolbar feature work
- unrelated dock or viewport animation tuning outside the toolbar-height seam

Why next:
- `Phase 1` fixed scroll ownership
- `Phase 1b` fixed the used-height formula and console reserve
- the next live bug is that collapsing subsections can feel like a `10000ms` animation even though the declared CSS duration is only `180ms`
- the current strongest read is that the toolbar is remeasuring against its own animating root and effectively chasing its own in-flight height on collapse

Current traced seam:
- `viewport-overlay.css`
  - `.ViewToolbarRoot` still transitions `height 180ms ease` and `max-height 180ms ease`
- `ViewToolbar.tsx`
  - `ResizeObserver` currently observes `.RightPanelStack`, `.ViewToolbarRoot`, and `.ViewToolbarPanel`
  - the current `nextUsedHeight` read still derives natural height from `toolbarElement.scrollHeight`
- this means the toolbar can animate its own height while the observer is also watching that same animating element and re-running the size sync from its live changing height read

Locked diagnosis:
- the bug does not currently read as a truly huge CSS duration
- it reads as a self-retriggering settle loop:
  - toolbar content collapses
  - `.ViewToolbarRoot` starts animating its own height
  - the root resize triggers the observer again
  - the next measurement still reads from the animating root's `scrollHeight`
  - the used-height target keeps getting refreshed from an in-flight value instead of one stable natural content height

This phase should:
- break the self-observing height loop during toolbar collapse
- stop using the animating root as the primary natural-content-height read for submenu open/close
- keep `.ViewToolbarRoot` as the only scroll owner while making its collapse settle immediate and truthful
- preserve the `Phase 1b` formula:
  - `model viewport height - toolbar top offset - console reserve`

Suggested implementation direction:
1. stop observing `.ViewToolbarRoot` if that element remains the animated height surface
2. derive natural content height from the inner content seam instead of the animating root:
   - likely `.ViewToolbarPanel`
   - plus the fixed summary/header contribution if needed
3. either:
   - remove the `height/max-height` transition from `.ViewToolbarRoot`, or
   - keep only a small transition once the measurement source no longer depends on the animating root
4. keep the change local to:
   - `src/app/components/ViewToolbar.tsx`
   - `src/app/theme/surfaces/viewport-overlay.css`
   - `src/app/components/ViewToolbar.test.tsx`

Done when:
- collapsing open subsections makes the black `View` toolbar box settle promptly instead of dragging downward over an obviously long slow animation
- the toolbar no longer appears to chase its own height during collapse
- the correct used-height seam from `Phase 1b` remains intact
- `.ViewToolbarRoot` is still the only scroll owner once the toolbar hits its viewport-owned cap
- focused proof covers the height-settle seam without widening into unrelated viewer or console behavior

### Phase 1c Result

- `ViewToolbar.tsx` no longer observes `.ViewToolbarRoot` inside the height-sync `ResizeObserver`, so the toolbar no longer remeasures from its own in-flight root resize while collapsing.
- the natural-height read now comes from the stable inner content seam:
  - closed toolbar uses the summary/header height
  - open toolbar uses `.ViewToolbarPanel` position plus panel scroll height
- `.ViewToolbarRoot` no longer transitions `height` or `max-height`, so collapsing subsections now settles immediately instead of dragging through a self-chasing remeasure loop.
- `ViewToolbar.test.tsx` now proves the used-height seam no longer depends on `.ViewToolbarRoot.scrollHeight` by forcing an incorrect root scroll height while still verifying the correct `180px` open and `48px` closed toolbar heights.

## [x] Phase 2 - Transform Subsection Split And Gizmo Scope Cleanup

Purpose:
- separate older transform-interaction controls from newer gizmo-specific appearance controls so the `View` toolbar reads more honestly and the `Gizmo` section stops carrying two different responsibilities

Owns:
- adding one top-level `Transform` subsection inside the `View` toolbar
- moving the existing transform controls out of the current `Gizmo` subsection
- keeping the newer gizmo-only options inside `Gizmo`
- clarifying the boundary between transform behavior and gizmo appearance/readability tuning

Does not own:
- new transform features
- new gizmo appearance controls
- broader toolbar spacing or copy cleanup outside this structural regrouping
- new console grammar or command-surface changes

Why next:
- the current `Gizmo` section still mixes two different kinds of controls:
  - older transform-interaction controls
  - newer gizmo-specific appearance controls
- that makes the section read more like a catch-all bucket than one coherent surface
- the next honest polish step is therefore structural, not stylistic: split the transform controls into their own section without moving the newer gizmo-only controls

Current regrouping target:
- move these older controls into the new `Transform` subsection:
  - `Gizmo On/Off`
  - `Move`
  - `Rotate`
  - `Scale`
  - `Local / World`
  - `Move Snap`
  - `Rot Snap`
  - `Scale Snap`
  - `Apply Snap`
  - the current transform mode readout such as `Mode: translate`
- keep the newer gizmo-only options in `Gizmo`, including the appearance/readability controls such as:
  - `Main Lines`
  - `Other Lines`
  - `Sphere Size`
  - `Labels`
  - `Text Size`

Locked direction:
- the new `Transform` subsection should be a top-level sibling section in the `View` toolbar, not a nested subpanel hidden inside `Gizmo`
- `Gizmo` should remain in the toolbar, but after this split it should read as the owner of gizmo appearance/readability controls rather than transform-interaction controls
- this should be a regrouping pass only; it should not change the underlying transform/gizmo runtime semantics

Likely runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`

Possible styling file:
- `src/app/theme/surfaces/viewport-overlay.css`

Done when:
- the `View` toolbar has one explicit top-level `Transform` subsection
- the older transform controls no longer live under `Gizmo`
- the newer gizmo-only controls remain under `Gizmo`
- the split reads clearly in the live surface without introducing new behavior or hidden ownership changes

### Phase 2 Result

- `ViewToolbar.tsx` now renders a top-level `Transform` subsection as a sibling of `Camera`, `Gizmo`, `View`, `Environment`, and `Materials`.
- the older transform-interaction controls now live under `Transform`:
  - `Gizmo On/Off`
  - `Move`
  - `Rotate`
  - `Scale`
  - `Local / World`
  - `Move Snap`
  - `Rot Snap`
  - `Scale Snap`
  - `Apply Snap`
  - `Mode: ...`
- the newer gizmo-only appearance controls remain under `Gizmo`, including:
  - `Main Lines`
  - `Other Lines`
  - `Sphere Size`
  - `Labels`
  - `Background`
  - `Text Size`
- `ViewToolbar.test.tsx` now proves the section ownership split directly, confirming the transform controls no longer render under `Gizmo` while the gizmo-style controls remain there.

### Implementation Read

Current live runtime seam:
- `src/app/components/ViewToolbar.tsx`
  - still renders the older transform-interaction controls and the newer gizmo-style controls inside the same top-level `Gizmo` subsection
  - already has the exact shared handlers needed for the older transform block:
    - `toggleGizmo`
    - `setGizmoModeValue(...)`
    - `toggleGizmoSpace`
    - `setGizmoSnap(...)` through `withViewer(...)`
  - already has the exact shared state/readouts needed for the same block:
    - `gizmoEnabled`
    - `gizmoMode`
    - `gizmoSpace`
    - `snapTranslate`
    - `snapRotate`
    - `snapScale`
- `src/app/components/ViewToolbar.test.tsx`
  - is already the focused proof seam for toolbar-local structure and behavior

Implementation boundary:
- keep the runtime cut inside `ViewToolbar.tsx`
- use `ViewToolbar.test.tsx` as the main proof file
- only touch `src/app/theme/surfaces/viewport-overlay.css` if the new sibling section needs a tiny spacing or grouping adjustment after the structural split
- do not widen into `Viewer.ts`, `viewerBridge.ts`, or transform semantics

Exact move list for `Transform`:
- move these existing controls out of the current `Gizmo` subsection into the new top-level `Transform` subsection:
  - `Gizmo On/Off`
  - `Move`
  - `Rotate`
  - `Scale`
  - `Local / World`
  - `Move Snap`
  - `Rot Snap`
  - `Scale Snap`
  - `Apply Snap`
  - `Mode: ...`

Exact keep list for `Gizmo`:
- leave these newer gizmo-only style controls inside `Gizmo`:
  - `Main Lines`
  - `Other Lines`
  - `Sphere Size`
  - `Labels`
  - `Text Size`
  - any newer helper-style presentation controls added after the original transform block

First implementation cut:
1. Add a new top-level `Transform` details section as a sibling of `Camera`, `Gizmo`, `View`, `Environment`, and `Materials`.
2. Move the older transform-interaction controls into that new section without changing handlers, labels, or behavior.
3. Leave the newer gizmo-style controls in `Gizmo` exactly as they are unless a tiny spacing cleanup is needed for readability.
4. Add or widen focused toolbar proof so the section split is explicit and protected.

Likely proof shape:
- the rendered `View` toolbar should expose both `Transform` and `Gizmo` as top-level sections
- the transform-interaction controls should render under `Transform`, not under `Gizmo`
- the gizmo-style controls should still render under `Gizmo`
- the split should preserve the existing shared command and state behavior for the moved controls

No-widening rule:
- do not rename controls unless the live split truly becomes unclear
- do not introduce a nested `Transform` subsection inside `Gizmo`
- do not move the newer gizmo appearance controls into `Transform`
- do not treat this phase as permission to redesign the whole toolbar ordering beyond the one requested split

## [x] Phase 3 - Snap Subsection Split

Purpose:
- give snap configuration its own explicit top-level place in the `View` toolbar so `Transform` can focus on transform-mode behavior while snap configuration reads as a separate concern

Owns:
- adding one top-level `Snap` subsection inside the `View` toolbar
- moving the snap fields and snap-apply action out of `Transform`
- clarifying the boundary between transform behavior and snap configuration

Does not own:
- new snap features
- new transform semantics
- broader toolbar visual redesign
- new console grammar or command-surface changes

Why next:
- after `Phase 2`, `Transform` will still carry two different responsibilities:
  - transform-mode controls
  - snap configuration
- the next honest regrouping cut is to separate snap ownership into its own top-level section instead of leaving it bundled into `Transform`

Current regrouping target:
- move these controls into the new `Snap` subsection:
  - `Move Snap`
  - `Rot Snap`
  - `Scale Snap`
  - `Apply Snap`
- keep these controls in `Transform`:
  - `Gizmo On/Off`
  - `Move`
  - `Rotate`
  - `Scale`
  - `Local / World`
  - `Mode: ...`
- keep the newer appearance/readability controls in `Gizmo`

Locked direction:
- the new `Snap` subsection should be a top-level sibling section in the `View` toolbar, not a nested block inside `Transform`
- the split should be structural only; it should not change the meaning of existing snap values or the shared `setGizmoSnap(...)` behavior
- the `Apply Snap` action should travel with the snap fields into `Snap`

Likely runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`

Possible styling file:
- `src/app/theme/surfaces/viewport-overlay.css`

Done when:
- the `View` toolbar has one explicit top-level `Snap` subsection
- snap fields and `Apply Snap` no longer live under `Transform`
- `Transform` keeps only the non-snap transform controls
- the split reads clearly in the live surface without changing runtime snap behavior

### Phase 3 Result

- `ViewToolbar.tsx` now renders a top-level `Snap` subsection as a sibling of `Camera`, `Transform`, `Gizmo`, `View`, `Environment`, and `Materials`.
- the snap configuration controls now live under `Snap`:
  - `Move Snap`
  - `Rot Snap`
  - `Scale Snap`
  - `Apply Snap`
- `Transform` now keeps only the non-snap transform controls:
  - `Gizmo On/Off`
  - `Move`
  - `Rotate`
  - `Scale`
  - `Local / World`
  - `Mode: ...`
- `ViewToolbar.test.tsx` now proves the section ownership split directly, confirming the snap controls no longer render under `Transform` while the non-snap controls stay there.

### Implementation Read

Current live runtime seam after `Phase 2`:
- `src/app/components/ViewToolbar.tsx`
  - now already renders the older non-snap transform controls inside the top-level `Transform` subsection
  - still keeps the snap configuration controls inside that same `Transform` section:
    - `Move Snap`
    - `Rot Snap`
    - `Scale Snap`
    - `Apply Snap`
  - already has the exact shared state and handler seam needed for the snap block:
    - `snapTranslate`
    - `snapRotate`
    - `snapScale`
    - `withViewer((viewer) => viewer.setGizmoSnap(...))`
- `src/app/components/ViewToolbar.test.tsx`
  - is already the focused proof seam for top-level toolbar section ownership and regrouping behavior

Implementation boundary:
- keep the runtime cut inside `ViewToolbar.tsx`
- use `ViewToolbar.test.tsx` as the main proof file
- only touch `src/app/theme/surfaces/viewport-overlay.css` if the new sibling section needs a tiny spacing or grouping adjustment after the structural split
- do not widen into `Viewer.ts`, `viewerBridge.ts`, or snap semantics

Exact move list for `Snap`:
- move these existing controls out of the current `Transform` subsection into the new top-level `Snap` subsection:
  - `Move Snap`
  - `Rot Snap`
  - `Scale Snap`
  - `Apply Snap`

Exact keep list for `Transform`:
- leave these non-snap transform controls inside `Transform`:
  - `Gizmo On/Off`
  - `Move`
  - `Rotate`
  - `Scale`
  - `Local / World`
  - `Mode: ...`

Exact keep list for `Gizmo`:
- leave the newer gizmo-only appearance controls inside `Gizmo`

First implementation cut:
1. Add a new top-level `Snap` details section as a sibling of `Camera`, `Transform`, `Gizmo`, `View`, `Environment`, and `Materials`.
2. Move the snap fields and `Apply Snap` action into that new section without changing labels, values, or behavior.
3. Leave the remaining non-snap transform controls in `Transform` exactly as they are unless a tiny spacing cleanup is needed for readability.
4. Add or widen focused toolbar proof so the `Transform` versus `Snap` ownership split is explicit and protected.

Likely proof shape:
- the rendered `View` toolbar should expose both `Transform` and `Snap` as top-level sections
- the snap controls should render under `Snap`, not under `Transform`
- the non-snap transform controls should still render under `Transform`
- the split should preserve the existing `setGizmoSnap(...)` behavior for the moved controls

No-widening rule:
- do not rename the snap controls unless the live split truly becomes unclear
- do not introduce a nested `Snap` subsection inside `Transform`
- do not move non-snap transform controls into `Snap`
- do not treat this phase as permission to redesign the rest of the toolbar ordering beyond the requested snap split

## [x] Phase 4 - Immediate Section-Collapse Height Snap

Purpose:
- remove the remaining slow visual shrink when the user opens and then closes `Camera`, `Transform`, `Snap`, `Gizmo`, `View`, `Environment`, or `Materials`, so the black `View` toolbar shell snaps directly to its correct used height instead of stepping downward over time

Owns:
- the remaining toolbar-local height-settle lag after `Phase 1c`
- the measurement contract for natural toolbar height during subsection open/close
- the remeasure triggers that currently cause repeated toolbar height sync while section content is collapsing

Does not own:
- new section regrouping
- new scrollbar styling
- new transform, snap, or gizmo behavior
- broader dock or viewport animation tuning outside the toolbar-height seam

Why next:
- `Phase 1c` removed the explicit root `height/max-height` transition, but the live surface still reads as if the toolbar is shrinking through an animation when subsections close
- the current strongest code read is that the lag now comes from repeated height recomputation rather than from one remaining CSS duration
- the next honest fix is therefore to make section-collapse height updates resolve in one immediate snap instead of allowing the shell to chase a sequence of intermediate heights

Current researched seam:
- `src/app/components/ViewToolbar.tsx`
  - the current shipped attempt now derives open-state natural height from:
    - `Math.round(panelElement.offsetTop + panelElement.scrollHeight)`
  - closed state still falls back to `Math.round(toolbarElement.scrollHeight)`
  - still updates `viewToolbarUsedHeight` and `viewToolbarHasOverflow` inside one shared `syncViewToolbarHeights()` path
  - still computes `viewportHeight` from the nearest `.ViewportFrameBody`
  - still attaches a `ResizeObserver` to:
    - `.RightPanelStack`
    - `.ViewToolbarPanel`
    - `.ViewportFrameBody`
  - now keeps a browser `window.resize` wake-up even when `ResizeObserver` exists
  - no longer attaches explicit subsection `toggle` listeners to every `.ViewSection`
- `src/app/theme/surfaces/viewport-overlay.css`
  - no longer transitions `.ViewToolbarRoot` height directly
  - still uses the measured `--v15-view-toolbar-used-height` seam as the shell height
- `src/app/theme/foundation/base.css`
  - `.ViewportFrameBody` remains the real model-viewport body that should define the toolbar's usable height when the browser window resizes

Locked diagnosis:
- the remaining slow settle does not currently read as one leftover `.ViewToolbarRoot` CSS height transition
- it reads more like a progressive remeasure loop:
  - subsection content changes
  - the toolbar now depends on observer-only panel resize wake-ups instead of one explicit section-toggle sync
  - panel size changes can therefore arrive as repeated intermediate updates rather than one final settled subsection state
  - the shell continues rewriting `viewToolbarUsedHeight` from those intermediate panel measurements
  - the user therefore still sees a slow visual shrink even without a CSS root-height transition
- there are two different `Phase 4` states now:
  - browser-window resize wake-up is improved and should remain in scope as shipped progress
  - truthful content shrink and immediate section-collapse settle are still not done
- the first implementation was too aggressive in one place:
  - removing explicit subsection `toggle` resync broke the honest “shrink to content immediately when a section closes” contract

This phase should:
- make subsection open/close height changes settle in one immediate toolbar snap
- stop the toolbar shell from visually shrinking through repeated intermediate heights
- make browser-window resize reliably recompute the toolbar height because the model viewport body height changes with the app window
- restore truthful content-sized shrink when subsections close instead of leaving the toolbar dependent on observer-only panel updates
- preserve the existing `Phase 1` and `Phase 1b` clamp rules:
  - full toolbar remains the only scroll owner
  - max usable height still equals `model viewport height - toolbar top offset - console reserve`
- keep scrollbar ownership behavior unchanged:
  - no scrollbar while the toolbar still fits
  - scrollbar only once the toolbar truly hits its viewport-owned cap

Suggested implementation direction:
1. restore one truthful subsection open/close wake-up path:
   - likely explicit subsection `toggle`
   - or an equivalent single-shot final-state wake-up
   - but do not leave section collapse dependent only on observer churn
2. add one reliable browser-window / viewport-body resize trigger so the toolbar resyncs when `.ViewportFrameBody` height changes, even in environments where the current observed toolbar descendants do not emit the needed resize
3. keep the improved browser-resize wake-up path unless live proof shows it causes a second regression
4. re-check the natural-height read so it reflects the final subsection state directly without leaving the toolbar stuck tall or walking through repeated intermediate values
5. keep the fix local to:
   - `src/app/components/ViewToolbar.tsx`
   - `src/app/components/ViewToolbar.test.tsx`
   - `src/app/theme/surfaces/viewport-overlay.css` only if a final no-transition safety rule is still needed

Likely runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`

Possible styling file:
- `src/app/theme/surfaces/viewport-overlay.css`

Done when:
- opening or closing a subsection makes the black `View` toolbar shell jump directly to the correct used height
- the toolbar no longer appears to shrink progressively over time after subsection collapse
- resizing the browser window causes the toolbar to recompute against the new model-viewport height without needing a later section toggle to wake it up
- the toolbar still shrinks back to its compact correct height when sections are closed
- the scrollbar still stays hidden while the toolbar fits and only appears once the toolbar truly reaches the viewport-owned cap
- focused proof covers the no-progressive-shrink seam without widening into unrelated viewport or console behavior

### Implementation Read

Current live runtime seam:
- `src/app/components/ViewToolbar.tsx`
  - currently computes all toolbar height state inside one shared `syncViewToolbarHeights()` path
  - currently derives `naturalContentHeight` from `toolbarElement.scrollHeight`
  - currently computes the cap from the nearest `.ViewportFrameBody` through:
    - `viewportHeight`
    - `toolbarTopOffset`
    - `dockedConsoleReserve`
  - currently keeps three height outputs coupled in one pass:
    - `viewToolbarMaxHeight`
    - `viewToolbarUsedHeight`
    - `viewToolbarHasOverflow`
  - currently uses two different trigger families for the same open/close seam:
    - `ResizeObserver` on `.RightPanelStack`
    - `ResizeObserver` on `.ViewToolbarPanel`
    - explicit `toggle` listeners on each `.ViewSection`
  - currently only falls back to `window.resize` when `ResizeObserver` is unavailable
- `src/app/components/ViewToolbar.test.tsx`
  - is already the focused proof seam for viewport-local toolbar height behavior
  - already proves current used-height and scrollable-state behavior through mocked `scrollHeight` and `getBoundingClientRect()`

Reference-only support seam:
- `src/app/theme/foundation/base.css`
  - keeps `.ViewportFrameBody` as the real model-viewport body
- `src/app/workspace/ViewportWorkspaceHost.tsx`
  - keeps the toolbar mounted inside that viewport workspace chain

Implementation boundary:
- keep the runtime cut inside `ViewToolbar.tsx`
- use `ViewToolbar.test.tsx` as the primary proof file
- only touch `src/app/theme/surfaces/viewport-overlay.css` if a tiny no-transition safety rule is still needed after the trigger cleanup
- do not widen into `ViewportWorkspaceHost.tsx`, `ViewerHost`, console runtime behavior, or dock ownership

Locked keep rules:
- keep `.ViewToolbarRoot` as the only scroll owner
- keep the existing max-height formula:
  - `model viewport height - toolbar top offset - console reserve`
- keep the current overflow contract:
  - no scrollbar while the toolbar fits
  - scrollbar only once the toolbar truly clamps at the viewport-owned cap
- do not reintroduce browser-viewport math like `100dvh`

First implementation cut:
1. Keep the new browser-window / viewport-body resize wake-up path that now exists in the shipped attempt.
2. Restore one reliable subsection-close wake-up so the toolbar resyncs to the final collapsed content height immediately.
3. Re-check the open-state natural-height seam against the restored subsection trigger instead of assuming observer-only panel reads are sufficient.
4. Keep the used-height and overflow outputs driven by the same existing clamp formula once the final natural content height is known.
5. Widen focused toolbar proof so both halves of the phase are explicit:
   - browser-resize recompute stays correct
   - subsection collapse again shrinks truthfully and immediately

Likely proof shape:
- opening or closing one subsection should again produce one immediate used-height result rather than a sequence of shrinking intermediate values
- collapsing subsections should still return the toolbar to its correct compact height
- browser-window resize should recompute the toolbar against the new model-viewport height without requiring a later subsection toggle
- the scrollbar flag should remain `false` while the toolbar still fits and turn `true` only when the computed cap is hit

No-widening rule:
- do not change section ordering or regrouping in this phase
- do not change the console reserve formula in this phase
- do not move scroll ownership into subsection bodies
- do not treat this phase as permission to restyle the scrollbar or toolbar shell beyond what the immediate height-settle fix strictly needs

### Phase 4 Current Attempt / Regression Note

The first shipped `Phase 4` attempt landed one real improvement:
- browser-window and viewport-body resize wake-ups are now more explicit, so the toolbar has a better chance of recomputing when the model viewport changes size

But the phase is not done yet because the same attempt also introduced two regressions:
- removing the explicit subsection `toggle` height sync was too aggressive, so the toolbar no longer shrinks truthfully to content when a subsection closes
- the shell can still look animated on collapse because observer-driven panel measurements continue to feed repeated intermediate used-height updates

So the current honest status is:
- browser-resize recompute is partially improved
- immediate subsection-collapse height snap is still open
- truthful content-sized shrink is still open

Second runtime attempt now in place:
- `ViewToolbar.tsx` again listens for subsection `toggle` so one section close can wake height recompute immediately
- toolbar-local resize, viewport-body resize, and browser-window resize now all flow through one queued sync instead of firing immediate overlapping recomputes
- open-state natural height still reads from the inner panel seam, while the original viewport-owned clamp formula remains unchanged

Current status after that second attempt:
- browser-resize recompute remains improved
- subsection-close wake-up is restored
- the phase stays `~` until live viewport behavior confirms the toolbar now truly shrinks to content and no longer reads as animated during collapse

### Implementation Spec

This phase should:
- start with `Phase 1 - Toolbar Scroll Ownership And Viewport Clamp`
- follow with `Phase 1b - Used-Height Clamp And Console-Bar Reserve`
- follow with `Phase 1c - Collapse Remeasure Loop And Immediate Height Settle`
- follow with `Phase 2 - Transform Subsection Split And Gizmo Scope Cleanup`
- follow with `Phase 3 - Snap Subsection Split`
- follow with `Phase 4 - Immediate Section-Collapse Height Snap`
- tighten section spacing and row rhythm so controls feel related instead of loosely stacked
- standardize row heights, gaps, and value/control alignment where the feature phases left drift
- improve active, selected, disabled, and current-value visual states so the toolbar is scannable at a glance
- make narrow-width, smaller-height, or overflow cases feel intentional instead of clipped or accidental
- clean up labels, helper text, and small captions so wording stays concise and consistent
- preserve clear visual grouping between:
  - camera/projection/lens controls
  - grid/background/core view-state controls
  - helper/gizmo controls
- keep all polish downstream from the already-defined owner seams rather than introducing toolbar-local state mutations

### Console Alignment

This phase should keep visible wording and grouping aligned with console language where practical.

Important rule:
- polish must not rename visible controls into a second vocabulary that drifts away from the console command families
- if a section label or control label changes here, the wording should still remain recognizably aligned with the command surface the user would see in the console

### Phase Guardrail

This phase is a polish phase, not a hidden architecture rewrite.

Important rule:
- do not smuggle new features into `View-Toolbar 5` just because the UI is already being touched
- do not reopen the ownership of projection, grid, background, helper, or camera-feel systems here
- do not skip straight past the scroll-owner and viewport-clamp seam into a full visual sweep with no narrow first proof
- fix clarity, density, and readability problems while preserving the feature boundaries proved by the earlier phases

### Acceptance Shape

This phase is done when:
- the `View` toolbar feels visually coherent across its sections
- crowded or narrow cases remain readable and usable
- active modes, toggles, and current values are easy to read at a glance
- the polished surface still maps cleanly to the earlier feature phases instead of hiding new behavior inside styling work

# `View-Toolbar 6 Phase 8` - `Outside Tab Rail And Attached Shell Chrome`

## Doc Header

### Doc History
1. 2026-04-17 18:51:52: Created this standalone future phase doc for `View-Toolbar 6 / Phase 8`, giving the next `Tabs` shell cleanup one explicit planning home for moving the section rail outside the main toolbar box so the active section reads like real attached tab chrome without widening into new command behavior, host-mode changes, or another presentation rewrite

### Purpose

This doc locks `View-Toolbar 6 / Phase 8`.

Use it to answer:
- how `Tabs` mode should move the section rail outside the main toolbar box
- how the active tab should visually attach to the main content panel
- which seams should change in JSX versus CSS
- how the cleanup should stay presentation-only while preserving current tab behavior

### Why This Phase Exists

The shipped `Tabs` presentation already works functionally:
- the left rail exists
- tab switching works
- active-tab persistence works
- the dock and floating follow-ons can still reuse the same body

What still feels unfinished is the shell read.

Right now the rail and content still live inside one `.ViewToolbarPanel--tabs` grid, so the section buttons read more like interior vertical controls than real tab chrome attached to the outside of the toolbar shell.

This phase exists to fix that visual and structural read without reopening the already-landed presentation behavior.

### Scope

This phase covers:
- the `Tabs` shell split between the outer left rail and the inner content box
- the visual treatment that makes the active tab feel attached to the content panel
- keeping the vertical bottom-up tab labels while refining the shell chrome around them
- focused proof that the shell cleanup stays presentation-only

This phase does not cover:
- new toolbar commands or new top-level sections
- changing the current tab keys or persistence model
- floating-window or dock-mode work
- another `Classic` versus `Tabs` behavior rewrite

## Doc Body

### Goal

Make `Tabs` mode read like a real tabbed shell by moving the section rail outside the main toolbar box while keeping the existing tab state, section ownership, and command behavior unchanged.

### Boundaries

This phase should:
- preserve the current left-rail interaction model
- keep the current `Tabs` body owner inside `ViewToolbar.tsx`
- keep one honest scroll owner in the content panel
- stop after the outside-tab shell read is clear and proven

This phase should not:
- add a new source of truth for active tab state
- turn the rail into a second scroll surface unless a narrow viewport proves it is necessary
- widen into broader toolbar chrome redesign beyond what the outside-tab read actually needs

### Architecture Direction

The right structural read is:
- one outer `Tabs` shell that owns the rail-versus-panel relationship
- one inner content panel that still owns the visible section body
- one active-tab chrome treatment that visually bridges the selected rail item into the content shell

Important rule:
- the shell split should stay presentation-only
- the same section list, active-tab state, and section rendering seam should continue to drive both `Classic` and `Tabs`

### Current Live Read

Current tabs body seam:
- `src/app/components/ViewToolbar.tsx`
  - `ViewToolbarBody(...)` currently renders:
    - `.ViewToolbarTabRail`
    - `.ViewToolbarTabContent`
  - both surfaces still live inside the same `.ViewToolbarPanel--tabs` shell
  - the tab buttons already use:
    - `.ViewToolbarTabButton`
    - `.ViewToolbarTabLabel`
  - the label already reads vertically bottom-up through the shipped writing-mode plus rotation treatment

Current tabs skin seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarPanel--tabs` currently uses:
    - `display: grid`
    - `grid-template-columns: 25px minmax(0, 1fr)`
  - that means the rail is still visually framed as part of the same panel box as the content
  - `.ViewToolbarTabButton.isActive` already owns the active color treatment, but not a true attached-tab shell read

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves the `Tabs` rail exists
  - already proves tab switching keeps the correct section body active
  - already proves at least one real control path stays functional in `Tabs`

### Acceptance Read

This phase is healthy when:
- the `Tabs` rail now sits outside the main toolbar box
- the active tab reads as attached to the content shell
- inactive tabs still read as secondary chrome and remain easy to click
- current tab switching, persistence, and shared section ownership stay unchanged
- the content panel still owns the only meaningful vertical scroll surface

## Wishlist Organization

### High Level Goals

- [ ] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [ ] `HLG 2. Tabs Read Like Real Attached Tabs`
- [ ] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1`

- [ ] `0. Split The Tabs Shell Into An Outer Rail Wrapper And Inner Content Panel`
- [ ] `1. Keep The Current Left Rail Ownership And Active Tab State`
- [ ] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [ ] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 2`

- [ ] `2. Make The Active Tab Read As Attached To The Panel Shell`
- [ ] `3. Keep Inactive Tabs Clearly Separate And Clickable`
- [ ] `4. Preserve The Existing Vertical Bottom-Up Label Treatment`
- [ ] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [ ] `HLG 2. Tabs Read Like Real Attached Tabs`
- [ ] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 3`

- [ ] `5. Keep One Honest Scroll Owner After The Shell Split`
- [ ] `6. Prove Tabs Behavior, Active Chrome, And Narrow Cleanup`
- [ ] `HLG 2. Tabs Read Like Real Attached Tabs`
- [ ] `HLG 3. Tabs Cleanup Stays Presentation-Only`

## [ ] `View-Toolbar 6 Phase 8` - `Phase 1 - Outer Rail Wrapper And Inner Panel Split`

### Phase 1 Summary

#### Purpose

Move the section rail outside the main toolbar box by splitting the `Tabs` shell into one outer rail wrapper and one inner content panel.

#### Owns

- the first markup split between outer rail and inner panel
- the matching layout/CSS change that stops the rail from reading as interior panel chrome
- preserving the current section list and active-tab owner during that shell split

#### Does Not Own

- the full attached active-tab chrome treatment
- new tab behavior
- persistence changes
- floating or dock-mode changes

#### Current Live Read

Current markup seam:
- `src/app/components/ViewToolbar.tsx`
  - `ViewToolbarBody(...)` currently renders the rail and content as siblings inside the same panel shell
  - this is the narrowest seam for introducing one extra outer wrapper without changing section ownership

Current layout seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarPanel--tabs` still owns the two-column grid
  - the rail therefore still inherits an inside-the-panel read even though it is logically a tab strip

#### First Pass Decisions

- keep `ViewToolbarBody(...)` as the owner of the split
- prefer one small presentational wrapper instead of a broad component extraction
- keep the current left-to-right layout order:
  - rail
  - content panel
- do not change tab button semantics or data attributes in this phase

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx`, split the current tabs shell so the outer wrapper owns the rail-versus-panel relationship and the inner panel owns the content body.
2. In `src/app/theme/surfaces/viewport-overlay.css`, move the main box chrome off the rail-bearing wrapper and onto the inner content panel so the rail no longer reads as interior panel content.
3. Keep the current `.ViewToolbarTabRail`, `.ViewToolbarTabButton`, and `.ViewToolbarTabContent` owner names when practical unless one new shell class makes the structure much clearer.
4. Keep `ViewToolbar.test.tsx` passing so the first cut proves the shell split did not disturb active-tab behavior.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/components/ViewToolbar.test.tsx`

#### No-Widening Rule

- do not change tab-state ownership in this phase
- do not widen into active-tab chrome flourishes beyond what the shell split strictly needs
- do not introduce nested scroll boxes in this phase

#### Implementation Risks

- leaving the panel border/background on the wrong wrapper so the shell still reads interior even after the markup split
- adding more wrapper markup than needed and making the tabs shell harder to maintain
- accidentally disturbing the current tabs-mode content mounting or section visibility logic

#### Checklist

- [ ] split the tabs shell into one outer rail wrapper and one inner content panel
- [ ] keep the current rail ordering and active-tab owner unchanged
- [ ] make the rail visually sit outside the main panel box
- [ ] keep the existing `Tabs` interaction proof green

#### Verification Shape

Minimum verification for this phase should cover:

- the `Tabs` rail still renders the same section tabs
- selecting a tab still changes the visible section body
- the shell structure now gives the rail an outside-the-box read instead of an interior grid-column read

#### Done Shape

`Phase 1` is done when:

- the rail no longer reads as part of the main content box
- the content panel has its own distinct shell again
- the current tabs behavior still works exactly as before

## [ ] `View-Toolbar 6 Phase 8` - `Phase 2 - Active Tab Attachment And Chrome Cleanup`

### Phase 2 Summary

#### Purpose

Make the selected tab read like attached tab chrome instead of a highlighted button beside the panel.

#### Owns

- the active-tab visual attachment treatment
- inactive-tab separation and spacing cleanup
- preserving the existing vertical bottom-up label treatment inside the new shell

#### Does Not Own

- changing the tab order or labels
- command or section behavior changes
- broader toolbar-shell redesign outside the tabs presentation

#### Current Live Read

Current active-tab seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarTabButton.isActive` already owns stronger border, gradient, and box-shadow treatment
  - what it does not yet own is a clear visual relationship to the content-panel shell

#### First Pass Decisions

- keep the current bottom-up label treatment unless live implementation proves one small spacing tweak is needed
- let the active tab visually merge into the panel shell through border, overlap, inset, or z-index treatment instead of changing the tab semantics
- keep inactive tabs clearly recessed so the active tab attachment reads immediately

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Refine the active-tab CSS so the selected tab visually attaches to the content panel border instead of reading like a standalone pill.
2. Adjust spacing, overlap, border ownership, or z-index only as much as needed to make the attached-tab read clear.
3. Preserve the current inactive-tab click targets and hover states so the rail still scans and feels usable.
4. Keep the existing vertical label treatment unless one narrow spacing tweak is needed for readability in the new attached shell.

#### Likely Files

- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/components/ViewToolbar.tsx` only if one tiny structure hook is needed for the attachment read
- `src/app/components/ViewToolbar.test.tsx` if a narrow shell-class assertion helps keep the owner explicit

#### No-Widening Rule

- do not change the shipped tab keys or persistence model
- do not widen into a generic typography or theme overhaul
- do not replace the current vertical-label direction in this phase

#### Implementation Risks

- making the active tab feel attached at the cost of unclear inactive-tab boundaries
- relying on fragile negative margins or overlap rules that break in narrow widths
- accidentally making the label treatment or hit targets harder to read/use

#### Checklist

- [ ] make the active tab read as attached to the content shell
- [ ] keep inactive tabs clearly separate and clickable
- [ ] preserve the current vertical bottom-up labels
- [ ] keep hover and active state recognition clear

#### Verification Shape

Minimum verification for this phase should cover:

- the selected tab has an explicit visual owner for its attached-shell read
- inactive tabs remain visible and clickable
- the vertical labels still render correctly after the chrome cleanup

#### Done Shape

`Phase 2` is done when:

- the active tab reads like real attached chrome
- inactive tabs still read as secondary options
- the shell cleanup remains purely presentational

## [ ] `View-Toolbar 6 Phase 8` - `Phase 3 - Focused Proof And Narrow Cleanup`

### Phase 3 Summary

#### Purpose

Close the outside-tab cleanup lane with focused proof that the shell split and attached-tab chrome did not disturb the shipped `Tabs` behavior.

#### Owns

- focused tabs-shell proof after the shell cleanup
- one-scroll-owner verification after the shell split
- any small cleanup exposed directly by that proof

#### Does Not Own

- new tabs features
- another shell redesign
- broader `ViewToolbar` refactors unrelated to the outside-tab cleanup

#### Current Live Read

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves the rail exists and tab switching works
  - is the right narrow owner for proving the shell cleanup did not reopen behavior work

#### First Pass Decisions

- prefer focused `ViewToolbar` proof over broader app-shell proof
- add narrow production cleanup only if the proof exposes real drift
- stop after the outside-tab shell lane is structurally proven

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Widen `src/app/components/ViewToolbar.test.tsx` only enough to keep the outside-tabs shell owner explicit after the markup/CSS changes.
2. Verify that tab switching still works, one real control path still functions in `Tabs`, and the content panel remains the meaningful scroll owner.
3. Make only narrow cleanup edits in `ViewToolbar.tsx` or `viewport-overlay.css` if the proof exposes structural drift.
4. Stop after the proof and cleanup read are honest.

#### Likely Files

- `src/app/components/ViewToolbar.test.tsx`
- possible narrow cleanup seams:
  - `src/app/components/ViewToolbar.tsx`
  - `src/app/theme/surfaces/viewport-overlay.css`

#### No-Widening Rule

- do not add new tabs behavior in this phase
- do not widen into floating, docked, or non-tabs toolbar cleanup
- do not turn the proof pass into a broader CSS re-theme

#### Implementation Risks

- letting the shell cleanup accidentally create a second competing scroll surface
- widening the proof pass into speculative refactor work that does not materially support the outside-tab contract
- treating purely visual verification as enough without also keeping behavior proof alive

#### Checklist

- [ ] prove the outside-tab shell keeps current tabs behavior intact
- [ ] prove the content panel still owns the meaningful scroll surface
- [ ] make only narrow cleanup edits exposed by the proof
- [ ] stop without widening into another tabs rewrite

#### Verification Shape

Minimum verification for this phase should cover:

- the rail still switches visible section content
- at least one real control path still works inside `Tabs`
- the content area remains the clear scroll owner
- the shell cleanup does not disturb active-tab persistence or section ownership

#### Done Shape

`Phase 3` is done when:

- the outside-tabs shell read is proven without reopening behavior work
- the content panel still owns the meaningful scroll surface
- the full `View-Toolbar 6 / Phase 8` lane can be treated as a narrow tabs-shell cleanup follow-on instead of a new presentation feature

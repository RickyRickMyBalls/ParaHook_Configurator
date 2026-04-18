# `View-Toolbar 6 Phase 8` - `Outside Tab Rail And Attached Shell Chrome`

## Doc Header

### Doc History
22. 2026-04-17 23:42:31: Added and prepped `View-Toolbar 6 / Phase 8 / Phase 1.8 - Floating Tabs Wrapper Reduction`, recording the live floating-tabs follow-up that the shell still feels wrapper-heavy because one more inner body box remains around the highlighted `.ViewToolbarTabPanel`, and narrowing the next cleanup around retiring or collapsing the extra floating-only `.ViewToolbarPanel` wrapper without reopening the outside-tabs shell split, titlebar ownership, or resize/min-height behavior
21. 2026-04-17 23:10:39: Implemented `View-Toolbar 6 / Phase 8 / Phase 1.7 - Floating Tabs Minimum Height Floor` by deriving a tabs-aware floating minimum-height floor from the measured outside rail plus the floating titlebar, then applying that floor through the floating rect render/default/resize path so short floating content can no longer leave the visible chrome shorter than the rail
20. 2026-04-17 22:58:11: Added and prepped `View-Toolbar 6 / Phase 8 / Phase 1.7 - Floating Tabs Minimum Height Floor`, recording the short-content floating-tabs issue that the visible floating chrome can end up shorter than the outside tab rail so the tabs appear to float below the window, and narrowing the next cut around one floating-only minimum-height contract that keeps the toolbar at least as tall as the rail without reopening shell ownership or tab behavior
19. 2026-04-17 22:46:53: Implemented `View-Toolbar 6 / Phase 8 / Phase 1.4 - Floating Window Interior Padding Tightening Research` by neutralizing the outer floating body-box chrome in `Tabs` mode, removing the extra floating body inset around the highlighted panel, and keeping the floating title row, shell split, handle alignment, and single scroll owner intact so the body no longer reads as a box inside a box
18. 2026-04-17 22:31:18: Folded the new floating-tabs box-in-box finding into `View-Toolbar 6 / Phase 8 / Phase 1.4 - Floating Window Interior Padding Tightening Research`, recording that the extra dead space is not only stacked padding but also a real double-shell read where `.V15Panel.ViewToolbarFloatingChrome` still presents one outer box around the inner highlighted `.ViewToolbarTabPanel`, so the next tightening pass must consider retiring or neutralizing that outer body-box chrome instead of treating the issue as padding-only
17. 2026-04-17 22:22:33: Implemented `View-Toolbar 6 / Phase 8 / Phase 1.6 - Floating Tabs Titlebar Baseline Alignment` by giving floating `Tabs` one titlebar-height-backed rail-start offset so the left tab rail now begins at the bottom edge of the floating `View` title row, while keeping the docked offset rule, `Phase 1.3` shell split, and `Phase 1.5` handle realignment intact
16. 2026-04-17 22:17:08: Added and prepped `View-Toolbar 6 / Phase 8 / Phase 1.6 - Floating Tabs Titlebar Baseline Alignment`, recording the live floating-tabs screenshot issue that the left rail starts too high relative to the `View` title row and should instead begin at the bottom edge of the floating title bar, while narrowing the next cut around one floating-only rail-start offset instead of reopening the broader shell, padding, or resize work
15. 2026-04-17 22:12:22: Implemented `View-Toolbar 6 / Phase 8 / Phase 1.5 - Floating Tabs Resize Handle Realignment Research` by keeping the current floating resize math intact while realigning the west edge, north-west corner, south-west corner, and north/south left insets to the real `.ViewToolbarFloatingChrome` edge in floating `Tabs` mode, so the visible floating box can be resized cleanly again without reopening the `Phase 1.3` shell split
14. 2026-04-17 22:06:11: Added and prepped `View-Toolbar 6 / Phase 8 / Phase 1.5 - Floating Tabs Resize Handle Realignment Research`, recording the live post-Phase-1.3 bug that floating `Tabs` mode can no longer be resized cleanly from the visible left edge and left corners because the west-side hit targets still anchor to the outer `.ViewToolbarFloatingWindow` host while the real visible floating box now starts at the inner `.ViewToolbarFloatingChrome` shell after the fixed tab-rail column
13. 2026-04-17 21:46:38: Implemented `View-Toolbar 6 / Phase 8 / Phase 1.3 - Floating Window True Outside Tabs Research` by moving the real floating window chrome off the outer `.ViewToolbarFloatingWindow` interaction host and onto one inner `.V15Panel.ViewToolbarFloatingChrome` shell, keeping the rail outside that real visible box while preserving the current drag, resize, quick-dock, and tab-state paths plus widening the focused floating proof to assert the rail no longer renders inside the inner floating chrome shell
12. 2026-04-17 21:01:34: Prepped `View-Toolbar 6 / Phase 8 / Phase 1.3 - Floating Window True Outside Tabs Research` for implementation by grounding the next cut in the live floating branch where `.ViewToolbarFloatingWindow` still owns the real outer window chrome, the current `.ViewToolbarFloatingWindowHeader` plus `.V15Panel.ViewToolbarRoot.ViewToolbarFloatingWindowBody` split, and the existing floating drag / resize / quick-dock proof in `ViewToolbar.test.tsx`, while tightening the implementation boundary around one local floating-shell ownership split instead of a broader floating-window framework rewrite
11. 2026-04-17 20:48:01: Implemented `View-Toolbar 6 / Phase 8 / Phase 1.2 - Zero-Gap Attachment And Rail Rhythm Tightening` by tightening the shared tabs-host spacing contract to remove the rail-to-box gap, reducing the rail rhythm from `8px` to `4px`, calming the inactive tab/button read, and adding a minimal active-tab overlap/edge flattening pass so the left rail reads more like attached tabs without widening into the separate floating shell-owner or floating interior-padding phases
10. 2026-04-17 20:32:46: Prepped `View-Toolbar 6 / Phase 8 / Phase 1.2 - Zero-Gap Attachment And Rail Rhythm Tightening` for implementation by grounding the next cut in the live `.ViewToolbarPanel--tabs[data-open='true']` gap contract, the current `.ViewToolbarTabRail` spacing owner, the existing tab button geometry in `viewport-overlay.css`, and the floating-versus-docked host split in `ViewToolbar.tsx`, while explicitly keeping the floating shell-ownership and interior-padding problems deferred to `Phase 1.3` and `Phase 1.4`
9. 2026-04-17 20:32:46: Added and prepped `View-Toolbar 6 / Phase 8 / Phase 1.4 - Floating Window Interior Padding Tightening Research`, recording the research conclusion that the red-marked floating dead space can be tightened because it is currently coming from stacked shell owners like `.V15Panel` padding plus the floating-only `.ViewToolbarPanel` inset and stable scrollbar gutter, so the next cut should be a narrow floating interior-spacing pass rather than a broader tabs rewrite
8. 2026-04-17 20:26:24: Added and prepped `View-Toolbar 6 / Phase 8 / Phase 1.3 - Floating Window True Outside Tabs Research`, locking the research conclusion that floating `Tabs` can reach a true outside-tabs read but not while the current `.ViewToolbarFloatingWindow` still owns the real outer border, radius, background, and `overflow: hidden`, so the next cut must be a floating-shell ownership split rather than more inner host spacing tweaks
7. 2026-04-17 20:22:30: Folded follow-up styling guidance into `View-Toolbar 6 / Phase 8 / Phase 1.2 - Zero-Gap Attachment And Rail Rhythm Tightening`, expanding that prep pass so the next implementation cut explicitly knows to reduce the pill-button read, merge the active tab into the panel border, recess inactive tabs, and keep the tabs hierarchy calmer instead of treating the spacing repair as gap-only cleanup
6. 2026-04-17 20:22:30: Added and prepped `View-Toolbar 6 / Phase 8 / Phase 1.2 - Zero-Gap Attachment And Rail Rhythm Tightening`, locking the next tabs cleanup cut around removing the dead air between the active tab and the real toolbar box, tightening the vertical spacing between tabs so they read like one rail instead of isolated pills, and recording one concrete first-pass spacing suggestion for implementation
5. 2026-04-17 20:11:13: Implemented `View-Toolbar 6 / Phase 8 / Phase 1.1 - Parent Shell Exit And True Outside Tabs` by moving the tabs rail out of the real docked and floating `V15Panel/ViewToolbarRoot` shells into one outer tabs host, keeping the title/content shell as the real toolbar box, widening the focused `ViewToolbar.test.tsx` proof to show the rail now sits outside the parent shell, and preserving the single real content scroll owner
4. 2026-04-17 19:53:42: Added `Phase 1.1 - Parent Shell Exit And True Outside Tabs` and prepped it for implementation after the live post-Phase-1 screenshot confirmed the rail still sits inside the parent `V15Panel/ViewToolbarRoot` shell, tightening the next cut around moving the tabs outside that real parent box instead of only outside the inner `.ViewToolbarTabPanel`
3. 2026-04-17 19:30:01: Implemented `View-Toolbar 6 / Phase 8 / Phase 1 - Outer Rail Wrapper And Inner Panel Split` by moving the tabs-grid owner into `ViewToolbarBody(...)`, adding one dedicated inner `.ViewToolbarTabPanel` wrapper for content-box chrome, keeping the existing tab-state/data-attribute contract intact, and widening the focused `ViewToolbar.test.tsx` tabs proof so the outside-rail shell split lands without reopening tab behavior work
2. 2026-04-17 19:07:24: Prepped `View-Toolbar 6 / Phase 8 / Phase 1 - Outer Rail Wrapper And Inner Panel Split` for implementation by grounding it in the live `ViewToolbarBody(...)` fragment seam, the current `.ViewToolbarPanel.ViewToolbarPanel--tabs` shared shell styling, the missing independent content-panel chrome around `.ViewToolbarTabContent`, and the focused `ViewToolbar.test.tsx` tabs-mode proof surface while keeping the first cut locked to one presentational wrapper split without changing tab-state ownership
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
    - one outer `.ViewToolbarPanel--tabs` shell
    - the existing `.ViewToolbarTabRail`
    - one inner `.ViewToolbarTabPanel`
    - `.ViewToolbarTabContent`
  - the tabs body now owns the rail-versus-panel split directly instead of depending on the shared parent panel wrapper to act as both common spacing owner and tabs-grid owner
  - the tab buttons already use:
    - `.ViewToolbarTabButton`
    - `.ViewToolbarTabLabel`
  - the label already reads vertically bottom-up through the shipped writing-mode plus rotation treatment

Current tabs skin seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarPanel` currently owns the shared panel spacing contract:
    - `display: flex`
    - `flex-direction: column`
    - `margin-top: 10px`
    - `padding-bottom: var(--v15-view-toolbar-content-padding-bottom, 12px)`
  - `.ViewToolbarPanel--tabs` currently uses:
    - `display: grid`
    - `grid-template-columns: 25px minmax(0, 1fr)`
  - that shell now owns only the outer rail-versus-panel relationship
  - `.ViewToolbarTabContent` currently only owns inner flow:
    - `display: flex`
    - `flex-direction: column`
    - `gap: 0`
  - `.ViewToolbarTabPanel` now owns the new inner content-box chrome, which gives the section body a distinct panel read while keeping the rail outside it
  - `.ViewToolbarTabButton.isActive` already owns the active color treatment, but not a true attached-tab shell read

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves the `Tabs` rail exists
  - already proves tab switching keeps the correct section body active
  - already proves at least one real control path stays functional in `Tabs`
  - the current proof already uses:
    - `.ViewToolbarTabRail`
    - `[data-view-toolbar-section="<key>"][data-tab-active="true"]`
  - this is the narrowest existing seam for proving the shell split did not disturb tabs behavior

### Acceptance Read

This phase is healthy when:
- the `Tabs` rail now sits outside the real parent `ViewToolbar` box, not only outside the inner content panel
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

- [x] `0. Split The Tabs Shell Into An Outer Rail Wrapper And Inner Content Panel`
- [x] `1. Keep The Current Left Rail Ownership And Active Tab State`
- [ ] `1A. Current Rail Still Lives Inside The Parent ViewToolbar Box`
- [x] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.1`

- [x] `1B. Move The Tabs Rail Outside The Parent ViewToolbar Box`
- [x] `1C. Keep The Title Row And Inner Content Panel As The Real Toolbar Shell`
- [x] `1D. Keep Current Tab State, Scroll Ownership, And Host Behavior Honest`
- [x] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [x] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.2`

- [x] `1E. Remove The Dead Air Between The Active Tab And The View Box`
- [x] `1F. Tighten The Vertical Gap Between Neighboring Tabs`
- [x] `1G. Keep One Honest Spacing Contract Across Docked And Floating Tabs Hosts`
- [x] `HLG 2. Tabs Read Like Real Attached Tabs`
- [x] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.3`

- [x] `1H. Confirm Why Floating Tabs Still Read Inside The Window Shell`
- [x] `1I. Decide The Smallest Honest Floating Shell Split For True Outside Tabs`
- [x] `1J. Keep The Existing Floating Window Host Model If The Shell Can Be Split Locally`
- [x] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [x] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.4`

- [ ] `1K. Confirm The Real Owners Of The Floating Interior Dead Space`
- [ ] `1L. Tighten Floating Interior Padding Without Reopening Docked Layout`
- [ ] `1M. Keep The Floating Scrollbar, Header, And Tabs Host Honest After The Tightening`
- [ ] `HLG 2. Tabs Read Like Real Attached Tabs`
- [ ] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.5`

- [x] `1N. Confirm Why Floating Tabs Resize Handles Miss The Visible Left Edge`
- [x] `1O. Realign West-Side And Left-Corner Hit Targets To The Real Floating Chrome Edge`
- [x] `1P. Keep The Existing Floating Resize Math, Drag Path, And Tabs Shell Honest`
- [x] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [x] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.6`

- [x] `1Q. Confirm Why Floating Tabs Start Above The Titlebar Baseline`
- [x] `1R. Move The Floating Tabs Rail Down So It Starts At The Bottom Of The View Title Bar`
- [x] `1S. Keep Docked Tabs, Floating Resize Handles, And Padding Cleanup Boundaries Honest`
- [x] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [x] `HLG 2. Tabs Read Like Real Attached Tabs`
- [x] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.7`

- [ ] `1T. Confirm Why Short Floating Content Can End Up Shorter Than The Tabs Rail`
- [ ] `1U. Keep The Floating Toolbar At Least As Tall As The Outside Tabs Rail`
- [ ] `1V. Keep Resize, Docked Height, And Scroll Ownership Honest After The Height Floor`
- [ ] `HLG 1. Tabs Sit Outside The View Toolbar Box`
- [ ] `HLG 2. Tabs Read Like Real Attached Tabs`
- [ ] `HLG 3. Tabs Cleanup Stays Presentation-Only`

### `View-Toolbar 6 Phase 8 Phase 1.8`

- [ ] `1W. Confirm Which Remaining Floating Tabs Wrapper Still Reads Like An Extra Box`
- [ ] `1X. Remove Or Collapse One Redundant Floating Body Wrapper Without Reopening Shell Ownership`
- [ ] `1Y. Keep Header, Scroll, Resize, And Min-Height Ownership Honest After The Wrapper Reduction`
- [ ] `HLG 2. Tabs Read Like Real Attached Tabs`
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

## [x] `View-Toolbar 6 Phase 8` - `Phase 1 - Outer Rail Wrapper And Inner Panel Split`

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
  - `ViewToolbarBody(...)` now renders one explicit outer tabs shell plus one inner content-panel wrapper
  - the section-definition array, active-tab key, and click handlers stayed exactly where they already lived
  - the wrapper split landed without changing the current tab button data attributes or click path

Current layout seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarPanel--tabs` still owns the two-column grid, but no longer doubles as the only content-box owner
  - `.ViewToolbarTabPanel` now owns the first independent content-panel chrome around `.ViewToolbarTabContent`

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - the existing tabs tests already prove:
    - the rail renders in `tabs`
    - section visibility follows the active tab
    - real controls stay usable in the active panel
  - this makes `ViewToolbar.test.tsx` the right place to keep the Phase 1 proof narrow and behavior-focused

#### First Pass Decisions

- keep `ViewToolbarBody(...)` as the owner of the split
- prefer one small presentational wrapper instead of a broad component extraction
- keep the current left-to-right layout order:
  - rail
  - content panel
- do not change tab button semantics or data attributes in this phase
- keep the current `.ViewToolbarTabRail` and `.ViewToolbarTabContent` owner names if possible so the proof surface stays stable
- let the new wrapper classes answer only shell layout and box ownership, not tab behavior

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx`, replace the current fragment return in `ViewToolbarBody(...)` for `tabs` mode with one explicit outer tabs-shell wrapper that contains:
   - the existing `.ViewToolbarTabRail`
   - one inner content-panel wrapper around the existing `.ViewToolbarTabContent`
2. Keep the section-definition array, `activeTab === section.key` read, `onSelectTab(section.key)` click path, and `data-view-toolbar-tab` attributes unchanged so the first cut stays presentation-only.
3. In `src/app/theme/surfaces/viewport-overlay.css`, move the main content-box chrome responsibility off the shared `.ViewToolbarPanel--tabs` grid owner and onto the inner content-panel wrapper or `.ViewToolbarTabContent` owner so the rail no longer inherits the panel box.
4. Keep `.ViewToolbarPanel--tabs` responsible only for the outer shell relationship:
   - rail lane
   - gap
   - outer alignment
   and do not let it keep acting like the only panel-box owner.
5. Keep `src/app/components/ViewToolbar.test.tsx` passing, and only widen it if one narrow shell-owner assertion is needed to make the new wrapper split explicit.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/components/ViewToolbar.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not change tab-state ownership in this phase
- do not widen into active-tab chrome flourishes beyond what the shell split strictly needs
- do not introduce nested scroll boxes in this phase
- do not rename the current tabs-mode data attributes unless the live implementation proves there is no clean alternative

#### Implementation Risks

- leaving the panel border/background on the wrong wrapper so the shell still reads interior even after the markup split
- adding more wrapper markup than needed and making the tabs shell harder to maintain
- accidentally disturbing the current tabs-mode content mounting or section visibility logic
- accidentally moving scroll ownership onto the outer tabs shell instead of preserving it with the inner content panel

#### Checklist

- [ ] split the tabs shell into one outer rail wrapper and one inner content panel
- [ ] keep the current rail ordering and active-tab owner unchanged
- [ ] make the rail visually sit outside the main panel box
- [ ] keep the existing `Tabs` interaction proof green

#### Verification Shape

Minimum verification for this phase should cover:

- the `Tabs` rail still renders the same section tabs
- selecting a tab still changes the visible section body
- at least one existing active tab section still exposes a live control path after the wrapper split
- the shell structure now gives the rail an outside-the-box read instead of an interior grid-column read

#### Done Shape

`Phase 1` is done when:

- the rail no longer reads as part of the main content box
- the content panel has its own distinct shell again
- the current tabs behavior still works exactly as before

Current status:
- `Phase 1` is implemented
- the wrapper split and panel-box ownership move are now the shipped structural baseline for the outside-tabs lane
- the live screenshot still shows the rail inside the real parent `ViewToolbarRoot` box, so the true outside-tabs requirement is not done yet
- `Phase 1.1` is now the next active cut for getting the rail outside the parent shell before the later active-tab attachment chrome pass

#### Implemented Result

- `src/app/components/ViewToolbar.tsx` now gives `tabs` mode one explicit outer `.ViewToolbarPanel--tabs` shell inside `ViewToolbarBody(...)`, with the existing rail kept on the left and one new `.ViewToolbarTabPanel` wrapper owning the inner content box.
- the shared parent `.ViewToolbarPanel` no longer doubles as the tabs-grid owner, so the rail-versus-panel relationship now belongs to the tabs body itself instead of the common toolbar panel wrapper.
- `src/app/theme/surfaces/viewport-overlay.css` now gives the inner `.ViewToolbarTabPanel` its own content-box chrome while the outer `.ViewToolbarPanel--tabs` shell stays responsible only for the rail lane plus panel relationship.
- `src/app/components/ViewToolbar.test.tsx` now explicitly proves the new tabs shell and inner panel wrappers exist while keeping the existing tab-order, tab-switch, and camera-command proof path alive.

Limitation still visible after implementation:
- the tabs shell still renders inside the parent `V15Panel/ViewToolbarRoot` box in both the docked and floating branches
- because that parent shell still owns the real outer border, background, radius, and `overflow: hidden`, the tabs are outside the inner panel but not yet outside the real toolbar box

## [x] `View-Toolbar 6 Phase 8` - `Phase 1.1 - Parent Shell Exit And True Outside Tabs`

### Phase 1.1 Summary

#### Purpose

Move the tabs rail outside the real parent `ViewToolbar` shell so the tabs stop reading as content inside the `V15Panel/ViewToolbarRoot` box and instead become true outside tabs attached to that box.

#### Owns

- the parent-shell ownership fix for docked and floating `Tabs` mode
- moving the rail outside the real `V15Panel/ViewToolbarRoot` box instead of only outside the inner content panel
- keeping the title row and content panel as the actual toolbar shell while the rail sits outside it
- preserving the current tab-state, click-path, and single-scroll-owner behavior during that shell move

#### Does Not Own

- the later active-tab attachment chrome polish
- new tab behavior
- titlebar behavior changes unrelated to the shell exit
- dock-mode or floating-host feature expansion

#### Current Live Read

Current real parent-shell seam:
- `src/app/components/ViewToolbar.tsx`
  - the docked branch still renders the live body inside:
    - `details.V15Panel.ViewToolbarRoot.ViewToolbarScrollSurface`
  - the floating branch still renders the live body inside:
    - `.V15Panel.ViewToolbarRoot.ViewToolbarFloatingWindowBody`
  - in both cases, the tabs shell remains a descendant of the real parent `V15Panel/ViewToolbarRoot` box even after `Phase 1`

Current clipping/chrome seam:
- `src/app/theme/foundation/base.css`
  - `.V15Panel` still owns the real outer:
    - background
    - border
    - border-radius
    - padding
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarRoot` still uses:
    - `overflow: hidden`
  - that means any tabs rendered as ordinary descendants still live inside the real parent shell read even if the inner panel split is cleaner

Current already-landed tabs split:
- `src/app/components/ViewToolbar.tsx`
  - `ViewToolbarBody(...)` already owns:
    - `.ViewToolbarPanel--tabs`
    - `.ViewToolbarTabRail`
    - `.ViewToolbarTabPanel`
    - `.ViewToolbarTabContent`
  - this means the next fix does not need another inner-panel rethink; it needs a parent-shell ownership move

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - currently proves the tabs shell and inner panel wrappers exist
  - does not yet prove that the rail has actually left the parent `ViewToolbarRoot` shell

#### First Pass Decisions

- treat this as a parent-shell ownership pass, not another inner-panel pass
- keep the current `.ViewToolbarTabPanel` content box as the inner shell landed in `Phase 1`
- keep the current tab button semantics, tab keys, and click path unchanged
- keep the title row as part of the real toolbar shell while moving only the rail outside that shell
- prefer one honest structural split around the live `ViewToolbarRoot` owner instead of trying to fake outside tabs with small padding or margin tricks inside the current parent box

### Phase 1.1 Implementation Spec

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx`, restructure the `tabs` presentation host so the rail is no longer rendered inside the real `V15Panel/ViewToolbarRoot` shell in either the docked or floating branch.
2. Keep the current title row plus content panel as the actual toolbar box, and render the rail as a sibling outside that box while preserving the current left-side order and active-tab state path.
3. In `src/app/theme/surfaces/viewport-overlay.css` and only if needed `src/app/theme/foundation/base.css`, move the outer border/background/radius ownership so the real visible box belongs to the title-plus-content shell, not to a parent that still encloses the rail.
4. Keep `overflow: hidden` or scroll ownership on the real content shell only where it is still needed; do not let the old parent-shell overflow rule keep clipping the outside rail.
5. Widen `src/app/components/ViewToolbar.test.tsx` only enough to prove the rail now sits outside the parent shell while existing tab switching and one real control path remain intact.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- possible shared shell touchpoint if truly needed:
  - `src/app/theme/foundation/base.css`
- `src/app/components/ViewToolbar.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not reopen the already-landed inner `.ViewToolbarTabPanel` split unless the parent-shell move truly requires one tiny structure change
- do not widen into active-tab overlap/attachment chrome polish in this phase
- do not change tab-state ownership, tab labels, or section keys in this phase
- do not turn this into a floating-window redesign just because the floating branch shares the same parent-shell issue

#### Implementation Risks

- solving the problem only visually while the rail still remains a descendant of the real parent shell
- breaking the title row or current scroll behavior while trying to move the rail outside the parent box
- fixing the docked branch but leaving the floating branch on the old parent-shell structure
- relying on negative offsets against a still-clipping parent instead of moving the real owner seams

#### Checklist

- [x] move the rail outside the real parent `ViewToolbar` box
- [x] keep the title row and inner content panel as the actual toolbar shell
- [x] preserve current tab-state ownership and section behavior
- [x] keep one honest scroll owner after the parent-shell move
- [x] prove the rail has left the parent shell without breaking tabs behavior

#### Verification Shape

Minimum verification for this phase should cover:

- the rail is no longer a visual child of the real parent toolbar box
- the title row and content panel remain the real toolbar shell
- tab switching still changes the visible section body
- at least one real control path still works in `Tabs`
- the parent-shell move does not create a second competing scroll surface

#### Done Shape

`Phase 1.1` is done when:

- the tabs rail is outside the real parent `ViewToolbar` box rather than merely outside the inner content panel
- the actual visible toolbar box now belongs to the title-plus-content shell only
- current tabs behavior remains unchanged
- `Phase 2` can start from a true outside-tabs structure instead of compensating for the wrong parent shell

Current status:
- `Phase 1.1` is implemented
- the rail now lives in one outer tabs host in both the docked and floating branches instead of as a descendant of the real `V15Panel/ViewToolbarRoot` shell
- the title row plus content panel remain the real toolbar box, and the current tab-state / section-owner seam stayed unchanged
- the focused proof now explicitly checks that `.ViewToolbarTabRail` is owned by the outer tabs host while `.ViewToolbarTabPanel` remains inside `.ViewToolbarRoot`

#### Implemented Result

- `src/app/components/ViewToolbar.tsx` now renders `tabs` mode through one outer `.ViewToolbarPanel--tabs.ViewToolbarTabsHost` wrapper in both docked and floating host modes, with `.ViewToolbarTabRail` outside the real `.ViewToolbarRoot` shell and `.ViewToolbarBody(...)` narrowed back to the inner content-panel owner.
- the docked and floating real toolbar shells still own the title row, inner `.ViewToolbarPanel`, and current scroll surface behavior, while the outer tabs host now owns only the rail-versus-shell relationship.
- the detach/default floating rect seam now measures the outer tabs host first so tabs-mode floating width and dock-exit behavior keep reading from the real outside-tabs shell instead of only the inner panel box.
- `src/app/theme/surfaces/viewport-overlay.css` now treats `.ViewToolbarPanel--tabs` as the real outer tabs host, hides the rail when the docked shell is closed, and offsets the docked rail below the title row so the rail stays outside the parent box while the title/content shell remains intact.
- `src/app/components/ViewToolbar.test.tsx` now proves the tabs shell is a separate host around `.ViewToolbarRoot`, that `.ViewToolbarTabRail` no longer renders inside the root shell, and that the existing tab-switch plus camera-command path still works.

## [x] `View-Toolbar 6 Phase 8` - `Phase 1.2 - Zero-Gap Attachment And Rail Rhythm Tightening`

### Phase 1.2 Summary

#### Purpose

Tighten the tabs-mode spacing so the rail reads like real attached tabs instead of a stack of separate pills sitting near the toolbar box.

#### Owns

- removing the visible horizontal dead air between the active tab and the real toolbar shell
- tightening the vertical spacing between neighboring tabs so the rail reads as one intentional tabs strip
- reducing the current rounded-pill button read so the stack feels like one tabs system instead of isolated controls
- establishing a calmer active-versus-inactive hierarchy so the selected tab clearly owns the shell connection
- keeping those spacing rules aligned across docked and floating tabs hosts without reopening tab behavior

#### Does Not Own

- the later full active-tab chrome polish beyond spacing and attachment geometry
- tab-state or section behavior changes
- typography changes to the current vertical bottom-up labels
- broader toolbar-shell restyling outside the tabs lane

#### Current Live Read

Current spacing seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarPanel--tabs[data-open='true']` currently uses:
    - `grid-template-columns: 25px minmax(0, 1fr)`
    - `gap: 10px`
  - `.ViewToolbarTabRail` currently uses:
    - `gap: 8px`
  - this leaves two reads that still feel too loose in the screenshot:
    - there is still visible dead air between the rail and the toolbar box
    - the tabs are spaced far enough apart that they read like separate pills instead of a tighter tabs strip

Current already-landed ownership:
- `src/app/components/ViewToolbar.tsx`
  - `Phase 1.1` already moved `.ViewToolbarTabRail` outside the real `.ViewToolbarRoot` shell
  - that means the next cut does not need another ownership move; it needs a spacing-contract cleanup on the current outside-tabs structure
  - the current host split is now:
    - docked `.ViewToolbarPanel--tabs.ViewToolbarTabsHost--docked`
    - floating `.ViewToolbarPanel--tabs.ViewToolbarTabsHost--floating`
  - this means the spacing cleanup can stay focused on the shared tabs host and tab-button seams first, while the floating-only shell-owner and interior-padding issues remain separate work under `Phase 1.3` and `Phase 1.4`

#### First Pass Decisions

- keep this as a spacing-only cleanup before the broader active-tab chrome pass
- prefer zero horizontal gap between the active tab edge and the toolbar box
- tighten the vertical stack enough that the rail reads unified, but keep just enough air so inactive tabs still scan as separate click targets
- prefer tab-like geometry over button-like geometry on the panel-facing side
- make inactive tabs feel recessed and secondary instead of equally prominent siblings
- let connection, border ownership, and hierarchy do most of the work instead of adding louder glow first
- avoid widening into shape, label-direction, or interaction changes unless one tiny CSS hook is truly needed

#### Suggested First-Pass Spacing Target

Recommended starting values:
- rail-to-box gap for the attached active tab: `0px`
- inactive tab-to-tab vertical gap: `4px`
- if border-merging still looks soft after `0px`, allow a very small active-tab overlap such as `1px` into the panel edge

Why this is the best first try:
- `0px` makes the active tab read attached instead of adjacent
- `4px` is tight enough to read like a tabs rail, but not so tight that the inactive buttons blur together
- a tiny `1px` overlap is safer than larger negative offsets and should be enough to visually merge borders if needed

#### Styling Guidance To Fold Into The Same Cut

The spacing fix should also push the rail away from a "vertical buttons next to a panel" read and toward a true tabs-system read.

Recommended visual moves:
- let the active tab share or visually merge into the same border owner as the panel edge
- soften or visually remove the panel-facing edge on the active tab if needed so it opens into the box instead of stopping beside it
- slightly reduce the pill feel of the tabs, especially on the panel-facing side, so the geometry reads more like tab chrome than rounded buttons
- recess inactive tabs through lower contrast, flatter fill, and weaker shadow so only the active tab feels structurally connected
- keep one consistent rail width and left-edge alignment so the stack reads like one strip rather than separate loose controls
- if a faint rail spine or anchor line helps, keep it subtle and let the active tab be the one item that visibly breaks or merges through it

Important restraint:
- do not solve this by adding more glow or louder gradients first
- the primary read should come from connection, border ownership, spacing, and hierarchy
- richer active chrome still mainly belongs to `Phase 2`

### Phase 1.2 Implementation Spec

#### Exact First Code Cut

1. In `src/app/theme/surfaces/viewport-overlay.css`, split the current shared `.ViewToolbarPanel--tabs[data-open='true']` spacing owner into an explicit horizontal host-gap contract plus a separate vertical rail rhythm so the rail can sit flush to the box without also collapsing the full stack.
2. Reduce the shared rail-to-box spacing to `0px` as the first pass, and only allow a minimal active-tab overlap if the border still reads detached after that change.
3. Tighten `.ViewToolbarTabRail` spacing to a smaller vertical rhythm, with `4px` as the recommended first pass for inactive neighboring tabs.
4. In the same pass, tune the current `.ViewToolbarTabButton` geometry and hierarchy just enough to reduce the pill-button read:
   - calmer inactive contrast
   - slightly less rounded or flatter panel-facing edge if needed
   - no new flourish-heavy active chrome
5. Keep `.ViewToolbarTabsHost--docked[data-open='true'] > .ViewToolbarTabRail { margin-top: 36px; }` intact unless the implementation proves one tiny alignment correction is needed; the first implementation cut is about attachment spacing and rail rhythm, not a new docked offset pass.
6. Do not widen this implementation cut into the floating-shell ownership problem from `Phase 1.3` or the floating interior dead-space cleanup from `Phase 1.4`; if floating still needs separate tightening after the shared host pass, leave that honest and follow the later owning phases.
7. Keep `src/app/components/ViewToolbar.test.tsx` unchanged unless one narrow class or host-hook assertion becomes necessary because the CSS owner changed.

#### Likely Files

- `src/app/theme/surfaces/viewport-overlay.css`
- possible tiny structure hook only if CSS alone proves insufficient:
  - `src/app/components/ViewToolbar.tsx`
- possible narrow proof touchpoint only if needed:
  - `src/app/components/ViewToolbar.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not reopen the parent-shell move from `Phase 1.1`
- do not widen into later active-tab flourish work beyond the minimal border or shape adjustments needed to support the spacing contract
- do not change the current tab labels, order, or tab-state ownership
- do not try to solve the floating-shell owner problem from `Phase 1.3` in this phase
- do not try to solve the red-marked floating interior dead space from `Phase 1.4` in this phase unless the shared host-gap pass exposes one tiny overlapping seam
- do not let this spacing pass become a general toolbar padding cleanup

#### Implementation Risks

- keeping the tabs technically outside the box but still visually detached because the horizontal gap survives in another owner
- tightening the rail so much that the inactive tabs lose readable separation
- solving the shared host gap while assuming the floating-only shell and padding issues are also fixed when they may still need their later owning phases
- relying on large negative offsets that make the rail fragile in narrow widths

#### Ready-To-Implement Read

`Phase 1.2` is now ready for implementation because:

- the shared tabs spacing owners are explicit:
  - `.ViewToolbarPanel--tabs[data-open='true']`
  - `.ViewToolbarTabRail`
  - `.ViewToolbarTabButton`
- the first-pass numeric targets are explicit:
  - `0px` rail-to-box gap
  - `4px` tab-to-tab rail gap
  - optional `1px` active overlap only if needed
- the phase boundary is explicit:
  - shared tabs host spacing and tab-button read are in scope
  - floating shell ownership and floating interior padding remain owned by `Phase 1.3` and `Phase 1.4`

#### Checklist

- [ ] remove the dead air between the active tab and the toolbar box
- [ ] tighten the vertical gap between neighboring tabs
- [ ] reduce the current pill-button read so the rail feels like a tabs strip
- [ ] make inactive tabs visibly more recessed than the active tab
- [ ] keep the spacing contract consistent across docked and floating tabs hosts
- [ ] preserve current tab behavior and clickability

#### Verification Shape

Minimum verification for this phase should cover:

- the active tab now visually touches or truthfully merges into the toolbar box
- neighboring tabs read like one tighter rail instead of isolated pills
- inactive tabs read as secondary chrome rather than equal-strength buttons
- inactive tabs still remain individually legible and clickable
- the spacing cleanup stays presentation-only

#### Done Shape

`Phase 1.2` is done when:

- there is no visible dead air between the attached active tab and the real toolbar box
- the tabs stack reads like a rail of tabs rather than spaced-out pills
- inactive tabs are calmer and more recessed while the active tab clearly owns the shell connection
- docked and floating tabs hosts use the same honest spacing contract
- `Phase 2` can focus on richer chrome polish instead of basic spacing repair

Current status:
- `Phase 1.2` is implemented
- the shared tabs host now uses a zero-gap attachment read between the rail and the panel shell
- the vertical rail rhythm is tighter and the tab shape/hierarchy is calmer, so the stack reads more like tabs and less like isolated pill buttons
- the separate floating shell-owner and floating interior-padding issues still remain owned by `Phase 1.3` and `Phase 1.4`

#### Implemented Result

- `src/app/theme/surfaces/viewport-overlay.css` now splits the shared open tabs-host spacing into `column-gap: 0` and `row-gap: 0`, removing the previous `10px` rail-to-box dead air while keeping the host relationship explicit.
- the same file now tightens `.ViewToolbarTabRail` from `8px` to `4px`, making the rail scan as one tighter strip instead of spaced-out buttons.
- `.ViewToolbarTabButton` now uses a flatter panel-facing edge, calmer inactive border/background contrast, and a minimal active `-1px` overlap with a transparent panel-facing border so the selected tab reads attached without widening into the later richer chrome pass.
- focused `ViewToolbar` proof stayed green without needing new structure assertions because the implementation remained on the existing shared CSS owners.

## [x] `View-Toolbar 6 Phase 8` - `Phase 1.3 - Floating Window True Outside Tabs Research`

### Phase 1.3 Summary

#### Purpose

Explain why the floating `Tabs` presentation still reads inside the window box and decide whether a true outside-tabs read is possible with the current floating shell.

#### Owns

- the live root-cause read for why floating tabs still look inside the window shell
- the architecture decision on whether the current floating shell can support true outside tabs
- the smallest honest follow-up shape if the answer is yes with a local shell split

#### Does Not Own

- implementing the floating-shell refactor itself
- the spacing or active chrome polish from `Phase 1.2` or `Phase 2`
- any broader floating-window redesign unrelated to tabs ownership

#### Current Live Read

Current floating shell seam:
- `src/app/components/ViewToolbar.tsx`
  - the floating branch renders:
    - outer `.ViewToolbarFloatingWindow`
    - header `.ViewToolbarFloatingWindowHeader`
    - tabs host `.ViewToolbarPanel--tabs.ViewToolbarTabsHost--floating`
    - inner `.V15Panel.ViewToolbarRoot.ViewToolbarFloatingWindowBody`
  - this means the tabs host is outside `.ViewToolbarRoot`, but it is still inside `.ViewToolbarFloatingWindow`

Current real floating box owner:
- `src/app/components/ViewToolbar.tsx`
  - `.ViewToolbarFloatingWindow` currently owns the real outer window chrome inline:
    - `border`
    - `borderRadius`
    - `overflow: hidden`
    - `background`
    - `boxShadow`
  - because those are on the outer floating window wrapper, anything rendered inside that wrapper still reads as inside the real floating box

Current floating tabs skin seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarTabsHost--floating` currently only owns:
    - `height: 100%`
  - there is no floating-only shell split yet that lets the rail become a sibling outside the real bordered/clipped window chrome

#### Research Conclusion

Yes, a true outside-tabs read is still possible with the shell family we are using.

But not with the current floating shell ownership left as-is.

Right now the limiting factor is not the tabs host itself. The limiting factor is that `.ViewToolbarFloatingWindow` is still the real visible window box, and it clips/contains the rail through its own border, radius, background, and `overflow: hidden`.

So:
- it is not enough to keep tuning `.ViewToolbarTabsHost--floating`
- it is not enough to move the rail around inside the current floating wrapper
- the floating branch needs one shell-ownership split similar in spirit to the docked parent-shell exit

#### Smallest Honest Direction

The narrowest likely fix is:
- keep one outer floating positioning/interaction wrapper for:
  - absolute positioning
  - drag
  - resize handles
  - z-index
- move the real bordered/clipped floating window chrome onto one inner floating shell that owns:
  - header
  - content panel
  - background
  - border
  - radius
  - scroll clipping
- render the tabs rail as a sibling of that inner floating shell, not as a child of the real bordered/clipped shell

This should let the rail sit truly outside the floating window box while preserving the current floating host model.

#### First Pass Decisions

- treat the floating issue as a shell-ownership problem, not a spacing problem
- prefer one local floating-shell split inside `ViewToolbar.tsx` before considering any broader shared floating host work
- keep the current drag, resize, and quick-dock behavior on the outer floating host if possible
- keep the header and content panel together as the real floating window box
- keep the existing `.ViewToolbarFloatingWindow` as the outer positioned interaction wrapper unless the local split proves impossible

#### Implementation-Ready Live Read

Current implementation seam is now narrow enough to cut directly:
- `src/app/components/ViewToolbar.tsx`
  - `.ViewToolbarFloatingWindow` currently owns the real outer:
    - `border`
    - `borderRadius`
    - `overflow: hidden`
    - `background`
    - `boxShadow`
  - `.ViewToolbarFloatingWindowHeader` is already a separate node from the body
  - `.ViewToolbarPanel--tabs.ViewToolbarTabsHost--floating` already wraps:
    - `.ViewToolbarTabRail`
    - `.V15Panel.ViewToolbarRoot.ViewToolbarFloatingWindowBody`
  - this means the next cut does not need a new host model; it needs the visual chrome to move off `.ViewToolbarFloatingWindow` and onto one inner floating shell that groups the header plus content body

Current proof seam is already present:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves:
    - floating shell render
    - drag
    - resize
    - quick dock
  - this is the right narrow owner for proving the floating shell split without widening into app-shell work

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx`, stop treating `.ViewToolbarFloatingWindow` as the real bordered/clipped window box for `tabs` mode while keeping it as the outer positioned interaction wrapper.
2. Introduce one inner floating chrome shell under `.ViewToolbarTabsHost--floating` so the header plus `.ViewToolbarFloatingWindowBody` become the real visible window box and own:
   - background
   - border
   - radius
   - clipping
3. Render `.ViewToolbarTabRail` as a sibling outside that inner floating chrome shell while keeping the current outer positioning / resize-handle / drag shell intact.
4. Keep the floating drag, resize handles, quick-dock action, and current tab-state path unchanged, and only widen `ViewToolbar.test.tsx` if one narrow ownership assertion is needed on top of the existing floating behavior proof.
5. Prefer `src/app/theme/surfaces/viewport-overlay.css` for the matching floating host/chrome ownership rules; only touch a broader shared shell file if the local implementation proves there is no honest alternative.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- possible proof touchpoint:
  - `src/app/components/ViewToolbar.test.tsx`

#### No-Widening Rule

- do not turn this into a generic floating-window framework rewrite
- do not reopen docked tabs work in this phase
- do not widen into active-tab chrome polish before the floating shell owner is honest
- do not abandon the current floating shell model unless a local split proves impossible
- do not try to solve the floating interior padding problem from `Phase 1.4` in the same cut unless the shell split exposes one tiny overlapping seam that cannot stay deferred

#### Implementation Risks

- moving the rail outside the inner shell but still leaving it visually trapped by the outer floating wrapper
- breaking resize handles or drag hit-target ownership while splitting the shell
- accidentally creating a second scroll owner inside the floating branch
- widening into shared host abstraction work before proving a local `ViewToolbar` shell split is insufficient

#### Ready-To-Implement Read

`Phase 1.3` is now ready for implementation because:

- the blocking owner is explicit:
  - `.ViewToolbarFloatingWindow` still owns the real floating box chrome
- the narrow target structure is explicit:
  - outer floating interaction wrapper stays
  - inner floating chrome shell becomes the real visible box
  - `.ViewToolbarTabRail` becomes a sibling outside that inner shell
- the proof seam is already in place:
  - existing floating render / drag / resize / quick-dock tests in `ViewToolbar.test.tsx`
- the boundary is explicit:
  - local floating-shell ownership split is in scope
  - floating interior padding remains owned by `Phase 1.4`

#### Checklist

- [ ] confirm the real floating box owner that still encloses the tabs
- [ ] confirm whether true outside tabs are possible with the current shell family
- [ ] identify the smallest honest floating shell split
- [ ] keep the follow-up constrained to local floating tabs ownership

#### Verification Shape

This research phase is healthy when:

- the real root cause is named explicitly
- the answer to "is this possible?" is clear
- the next implementation cut has one concrete shell direction instead of more spacing guesses

#### Done Shape

`Phase 1.3` is done when:

- the plan clearly records that true floating outside tabs are possible
- the plan also clearly records that the current `.ViewToolbarFloatingWindow` ownership prevents that read today
- the next implementation cut is defined as a local floating-shell ownership split rather than another CSS-only tab pass

Current status:
- `Phase 1.3` is implemented
- the outer `.ViewToolbarFloatingWindow` now stays the positioned interaction host while the real visible floating box has moved onto one inner `.ViewToolbarFloatingChrome` shell
- the tabs rail now renders outside that inner floating chrome shell instead of still living inside the real floating box
- the floating render / drag / resize / quick-dock proof stayed on the same `ViewToolbar.test.tsx` surface with one added ownership assertion

#### Implemented Result

- `src/app/components/ViewToolbar.tsx` now splits the floating tabs branch into:
  - one outer `.ViewToolbarFloatingWindow` interaction host for position, drag, resize handles, and z-index
  - one inner `.V15Panel.ViewToolbarFloatingChrome` shell that owns the real visible window box
  - one `.ViewToolbarTabRail` sibling outside that inner floating chrome shell
- the floating header is now part of the inner floating chrome shell, so the real bordered/clipped box is no longer the outer wrapper that also encloses the rail.
- `src/app/theme/surfaces/viewport-overlay.css` now gives `.ViewToolbarFloatingChrome` the inner floating shell layout while keeping `.ViewToolbarTabsHost--floating` as the local tabs host around the outside rail plus inner chrome shell.
- `src/app/components/ViewToolbar.test.tsx` now proves the floating tabs host still renders the rail while `.ViewToolbarFloatingChrome` itself does not contain `.ViewToolbarTabRail`, and the existing drag, resize, and quick-dock behavior stayed green.

## [x] `View-Toolbar 6 Phase 8` - `Phase 1.4 - Floating Window Interior Padding Tightening Research`

### Phase 1.4 Summary

#### Purpose

Explain the red-marked dead space inside the floating `ViewToolbar` window and define the smallest honest pass for tightening it.

#### Owns

- the live root-cause read for the extra top, left, and right interior spacing in floating mode
- deciding whether that space can be tightened without reopening the whole floating shell problem
- the narrow follow-up shape for reducing that dead space while keeping the current header, scrollbar, and tabs host behavior honest

#### Does Not Own

- implementing the floating shell split from `Phase 1.3`
- docked spacing cleanup
- broader active-tab chrome work
- replacing the current floating window host model

#### Current Live Read

Current floating interior owners:
- `src/app/components/ViewToolbar.tsx`
  - `.ViewToolbarFloatingWindowHeader` currently uses:
    - `padding: 0 10px`
  - `.ViewToolbarFloatingChrome` currently wraps:
    - the floating title row
    - the floating scroll/body area
  - floating `.ViewToolbarPanel` currently uses inline:
    - `marginTop: 0`
    - `padding: 12px 12px ${viewToolbarBottomContentPadding}px`
- `src/app/theme/foundation/base.css`
  - `.V15Panel` currently adds:
    - `padding: 12px`
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarTabPanel` currently adds:
    - `padding: 10px`
    - its own border
    - its own radius
    - its own background
  - `.ViewToolbarPanel--tabs[data-open='true']` currently uses:
    - `gap: 10px`
  - `.ViewToolbarRoot[open][data-scrollable='true']` currently uses:
    - `scrollbar-gutter: stable`
  - the themed scrollbar itself uses:
    - `width: 12px`

What this means in the screenshot:
- the top dead space is not only one margin; it is the combined result of the floating header separation plus the inner `V15Panel` padding and the floating-only `.ViewToolbarPanel` top inset
- the left dead space is coming from:
  - the outer floating body box still created by `.V15Panel.ViewToolbarFloatingChrome`
  - the `.V15Panel` padding
  - the floating `.ViewToolbarPanel` left padding
- the right dead space is coming from:
  - the outer floating body box still created by `.V15Panel.ViewToolbarFloatingChrome`
  - the `.V15Panel` padding
  - the floating `.ViewToolbarPanel` right padding
  - the stable scrollbar gutter and custom scrollbar width
- below the title bar, the live floating tabs view is also reading as a box inside a box:
  - one outer floating body box from `.ViewToolbarFloatingChrome`
  - one inner highlighted content box from `.ViewToolbarTabPanel`
  - so part of the apparent padding is actually the visual separation between two active chrome shells, not just empty inset

#### Research Conclusion

Yes, this can be tightened.

The current floating layout is carrying too many stacked interior spacing owners, and the screenshot shows that the issue is not just padding. In floating `Tabs`, we now have one real outer shell from `Phase 1.3` and one inner content box from `.ViewToolbarTabPanel`, so the body area reads as a box inside a box.

So `Phase 1.4` should be treated as a floating body-shell simplification pass as well as a spacing pass: tighten the padding owners, and decide whether the outer floating body box below the title row should be retired or visually neutralized so the highlighted inner panel becomes the only meaningful body box.

#### Smallest Honest Direction

The narrowest likely fix is:
- first decide whether the outer floating body box from `.ViewToolbarFloatingChrome` should keep any visible body chrome below the title row once `.ViewToolbarTabPanel` already owns the highlighted content box
- reduce or rebalance the floating-only `.ViewToolbarPanel` inset after that shell-owner decision
- only then decide whether `.V15Panel` padding should stay shared or get partially overridden for the floating toolbar shell
- keep the right-side scrollbar gutter honest, but avoid paying for both a full content inset and a full stable gutter if the combination creates unnecessary dead space

Likely tightening order:
1. remove, flatten, or visually neutralize the outer floating body-box chrome under `.ViewToolbarFloatingChrome` if `.ViewToolbarTabPanel` is already the intended highlighted shell
2. floating `.ViewToolbarPanel` top/left/right padding
3. floating tabs-host horizontal gap if it still looks loose after step 2
4. floating shell-specific override for `.V15Panel` padding only if the first three are not enough

#### First Pass Decisions

- treat this as a floating body-shell plus interior-spacing problem, not a tabs behavior problem
- keep the current floating header, scroll owner, and tabs host structure while measuring which owner is contributing what
- explicitly question whether floating `Tabs` still needs both:
  - the outer body box from `.ViewToolbarFloatingChrome`
  - the inner highlighted box from `.ViewToolbarTabPanel`
- prefer floating-only overrides before touching shared `.V15Panel` padding
- keep the scrollbar readable and clickable even if the content inset is tightened

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx` and/or `src/app/theme/surfaces/viewport-overlay.css`, decide whether floating `Tabs` should keep the visible outer body-box chrome on `.ViewToolbarFloatingChrome` below the title row once `.ViewToolbarTabPanel` already owns the highlighted content shell.
2. If the answer is no, retire or visually neutralize that outer body-box chrome first so the floating body no longer reads as a box inside a box.
3. Then identify and reduce the floating-only `.ViewToolbarPanel` inset that currently compounds with `.V15Panel` padding.
4. Keep the floating header spacing honest, but trim the content-start distance below it so the first section box sits closer to the top of the real content area.
5. Re-check the left and right interior gutters after those cuts before touching shared `.V15Panel` rules.
6. Only add a floating-specific `.V15Panel` padding override if the outer-box cleanup plus floating-only panel inset reduction still leave obvious dead space.
7. Preserve one honest scroll owner and one honest scrollbar gutter while tightening the right-side interior spacing.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- possible shared override only if truly needed:
  - `src/app/theme/foundation/base.css`

#### No-Widening Rule

- do not reopen docked toolbar spacing in this phase
- do not widen into the broader floating outside-tabs shell split unless that work is already being taken on explicitly under `Phase 1.3`
- do not hide or fake the scrollbar just to reduce visible right-side space
- do not turn this into a general panel-density sweep across unrelated surfaces

#### Implementation Risks

- removing the wrong shell owner and breaking the intended title-row plus body relationship from `Phase 1.3`
- removing the wrong padding owner and making the floating shell feel cramped instead of tighter
- flattening the outer body box but leaving the inner `.ViewToolbarTabPanel` visually stranded
- tightening the content area but leaving the tabs host gap visually dominant
- breaking scrollbar comfort or clipping by over-correcting the right inset
- solving the top spacing while leaving the left/right gutters obviously too wide

#### Checklist

- [x] confirm the actual floating owners contributing to the red-marked dead space
- [x] confirm whether the visible dead space is partly caused by a box-inside-box chrome stack
- [x] define the narrowest floating-only tightening order
- [x] keep the header, scrollbar, and tabs host honest after tightening
- [x] avoid widening into docked or global panel-density changes

#### Verification Shape

This research phase is healthy when:

- the top, left, and right dead space owners are named explicitly
- the box-inside-box owner question is answered explicitly
- the plan clearly says the issue can be tightened
- the next implementation cut has a clear owner order instead of guesswork

#### Done Shape

`Phase 1.4` is done when:

- the plan clearly records that the floating dead space can be tightened
- the real padding owners and body-box owners are named in order of likely impact
- the next implementation cut is framed as a narrow floating body-shell simplification plus interior-spacing pass rather than a broad restyle

Current status:
- `Phase 1.4` is implemented
- floating `tabs` mode no longer uses the outer `.ViewToolbarFloatingChrome` body area as a second visible content box below the title row
- the highlighted `.ViewToolbarTabPanel` now reads as the single meaningful body box while the floating title row, shell split, handle alignment, and scrollbar ownership stay intact

#### Implemented Result

- `src/app/components/ViewToolbar.tsx` now tags the floating chrome and body with `data-presentation`, and floating `tabs` mode removes the extra top/left/right body inset by changing the floating `.ViewToolbarPanel` padding from `12px 12px ...` to `0 0 ...`.
- `src/app/theme/surfaces/viewport-overlay.css` now neutralizes the outer `.ViewToolbarFloatingChrome` body-box chrome in floating `tabs` mode by removing its body border/background/shadow while preserving the title-row chrome on `.ViewToolbarFloatingWindowHeader`.
- the floating title row still presents the visible top chrome, the highlighted inner `.ViewToolbarTabPanel` remains the real content box, and the body no longer reads as a box inside a box.
- `src/app/components/ViewToolbar.test.tsx` now proves the floating `tabs` body is on the tabs presentation path and that the floating body panel no longer carries the old extra top/left/right inset.

## [x] `View-Toolbar 6 Phase 8` - `Phase 1.5 - Floating Tabs Resize Handle Realignment Research`

### Phase 1.5 Summary

#### Purpose

Explain why floating `Tabs` mode no longer resizes cleanly from the visible left edge and left corners, then define the smallest honest fix that restores correct edge and corner hit targets without reopening the resize algorithm itself.

#### Owns

- the live root-cause read for floating `Tabs` resize-hit-target drift after `Phase 1.3`
- deciding whether the current floating shell can keep the existing resize math while relocating only the west-side handle geometry
- the narrow follow-up shape for making the visible left edge, top-left corner, and bottom-left corner resize correctly again in floating `Tabs`

#### Does Not Own

- a broader rewrite of floating drag or resize state
- docked resize behavior
- the floating interior padding cleanup from `Phase 1.4`
- active-tab chrome polish

#### Current Live Read

Current floating resize-handle owner:
- `src/app/components/ViewToolbar.tsx`
  - `.ViewToolbarFloatingWindow` still owns all eight resize handles
  - `resolveViewToolbarFloatingResizeHandleStyle(...)` currently anchors:
    - west edge to `left: 0`
    - north-west corner to `top: 0; left: 0`
    - south-west corner to `bottom: 0; left: 0`
    - north edge to `left: ${VIEW_TOOLBAR_FLOATING_RESIZE_CORNER_SIZE}px`
  - the resize math itself still uses the outer floating rect and remains structurally honest

Current floating tabs shell owner:
- `src/app/components/ViewToolbar.tsx`
  - in floating `tabs` mode, `.ViewToolbarFloatingWindow` now contains:
    - one outer `.ViewToolbarTabsHost--floating`
    - one left `.ViewToolbarTabRail`
    - one inner `.ViewToolbarFloatingChrome` shell for the real visible floating box
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarPanel--tabs[data-open='true']` currently uses:
    - `grid-template-columns: 25px minmax(0, 1fr)`
  - that means the real visible floating box now starts after the fixed left rail column instead of at the outer host edge

What this means in live behavior:
- the visible left edge of the floating box is now the left edge of `.ViewToolbarFloatingChrome`, not the left edge of `.ViewToolbarFloatingWindow`
- but the west-side resize handle and the left corners still live on the outer host edge
- so the user has to hunt on the far-left tabs-host boundary instead of the visible box edge
- there is also a small top-left dead zone because the north handle inset still starts from the outer host while the visible chrome begins after the rail column

#### Research Conclusion

Yes, this is fixable with the current shell family.

The bug does not appear to be in `resizeViewToolbarFloatingRect(...)`. The problem is that `Phase 1.3` moved the real visible floating box to `.ViewToolbarFloatingChrome`, but the west-side resize hit targets still act like the outer `.ViewToolbarFloatingWindow` is the visible box.

So this should be a narrow floating-handle geometry fix, not a resize-state rewrite.

#### Smallest Honest Direction

The narrowest likely fix is:
- keep the outer `.ViewToolbarFloatingWindow` as the resize/drag state owner
- keep the existing floating resize math against the outer rect
- in floating `tabs` mode only, offset the west-facing resize handles so they align with the left edge of `.ViewToolbarFloatingChrome` instead of the far-left tabs-host boundary

Likely realignment order:
1. move the `w`, `nw`, and `sw` hit targets to the real left edge of the inner floating chrome shell
2. make the `n` and `s` handle spans start from that same real left edge so the top-left and bottom-left visible corners are not left with a dead gap
3. prove the right-side handles, drag path, and quick-dock behavior stayed unchanged

#### First Pass Decisions

- treat this as a handle-placement problem, not a resize-math problem
- keep the current outer floating rect as the single source of truth for size and position
- prefer one local floating-tabs offset seam over any generic floating-window abstraction
- keep the rail outside the visible box while making the visible box edges feel resizable again

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx`, teach the floating resize-handle placement logic about floating `tabs` mode so west-facing handles and left corners align to the real `.ViewToolbarFloatingChrome` edge instead of the outer host edge.
2. Keep `resizeViewToolbarFloatingRect(...)` and the current floating drag/resize state model unchanged unless the live implementation proves one tiny geometry parameter is unavoidable.
3. If a local CSS seam is cleaner, use `src/app/theme/surfaces/viewport-overlay.css` only for hit-target sizing or pointer layering; do not move the actual floating ownership back onto the outer host.
4. Widen `src/app/components/ViewToolbar.test.tsx` only enough to prove the left-edge resize handles still exist in floating `tabs` mode and remain aligned to the real visible floating box contract.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- possible local hit-target seam:
  - `src/app/theme/surfaces/viewport-overlay.css`
- possible proof touchpoint:
  - `src/app/components/ViewToolbar.test.tsx`

#### No-Widening Rule

- do not reopen the floating shell split from `Phase 1.3`
- do not mix this with the floating interior padding cleanup from `Phase 1.4`
- do not rewrite the resize algorithm if handle realignment solves the live bug
- do not move the tabs rail back inside the floating chrome shell just to simplify handles

#### Implementation Risks

- realigning only the west handle but leaving the north-west and south-west corners wrong
- fixing the hit targets but accidentally changing the measured floating rect or detach sizing behavior
- widening into a generic resize-handle framework before proving one local floating-tabs offset is enough
- creating a mismatch between visible handle alignment and the test geometry mocks

#### Checklist

- [ ] confirm the exact owner mismatch between the outer host and inner visible floating chrome
- [ ] confirm whether the resize math itself can stay unchanged
- [ ] define the smallest west-side handle realignment for floating `tabs`
- [ ] keep the fix local to floating `tabs` handle geometry

#### Verification Shape

This research phase is healthy when:

- the root cause is named as a handle-placement mismatch instead of vague resize breakage
- the answer to "can this be fixed with the current shell?" is explicit
- the next implementation cut is framed as a narrow handle realignment pass

#### Done Shape

`Phase 1.5` is done when:

- the plan clearly records that the bug comes from west-side handles still anchoring to the outer floating host
- the plan clearly records that the resize math can likely stay as-is
- the next implementation cut is defined as a floating `tabs` handle realignment pass instead of another shell rewrite

Current status:
- `Phase 1.5` is implemented
- floating `tabs` mode now keeps the west edge, north-west corner, and south-west corner handles aligned to the real visible `.ViewToolbarFloatingChrome` edge instead of the far-left outer tabs host edge
- the existing floating resize math, drag path, quick-dock action, and outside-tabs shell split all stayed intact

#### Implemented Result

- `src/app/components/ViewToolbar.tsx` now treats the floating `tabs` rail column as a local left-edge offset only for handle placement, so the `w`, `nw`, `sw`, and the left start of the `n`/`s` handles line up with the real inner floating chrome edge while the outer floating rect remains the single source of truth for size and position.
- the resize algorithm itself in `resizeViewToolbarFloatingRect(...)` stayed unchanged, which keeps the current floating drag, resize, detach sizing, and quick-dock behavior on the same owner model from `Phase 1.3`.
- `src/app/components/ViewToolbar.test.tsx` now proves the floating `tabs` west-side handles moved to the expected visible-edge contract by checking the live inline handle positions for `w`, `nw`, `sw`, and `n` in floating `tabs` mode while preserving the existing shell-ownership proof.

## [x] `View-Toolbar 6 Phase 8` - `Phase 1.6 - Floating Tabs Titlebar Baseline Alignment`

### Phase 1.6 Summary

#### Purpose

Move the floating `Tabs` rail down so the first tab starts at the bottom edge of the floating `View` title bar instead of beginning too high beside it.

#### Owns

- the live root-cause read for the floating-only rail-start misalignment visible in the screenshot
- deciding the smallest honest floating-only offset that makes the tabs begin at the bottom of the title bar
- keeping the docked rail alignment, floating shell split, and recent handle realignment work unchanged while correcting the floating rail baseline

#### Does Not Own

- docked tabs spacing
- the floating interior dead-space cleanup from `Phase 1.4`
- the floating resize-handle realignment from `Phase 1.5`
- broader active-tab chrome polish

#### Current Live Read

Current docked alignment seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - docked tabs already use:
    - `.ViewToolbarTabsHost--docked[data-open='true'] > .ViewToolbarTabRail { margin-top: 36px; }`
  - that means the docked rail already has one explicit start offset that lines it up below the docked title row

Current floating alignment seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarTabsHost--floating` currently has:
    - `height: 100%`
  - but there is no floating-specific top offset for `.ViewToolbarTabRail`
- `src/app/components/ViewToolbar.tsx`
  - floating tabs now render:
    - one outer `.ViewToolbarTabsHost--floating`
    - one `.ViewToolbarTabRail`
    - one inner `.ViewToolbarFloatingChrome`
  - the floating title row lives inside `.ViewToolbarFloatingChrome`, so the rail needs its own alignment rule if it should visually start at the bottom of that title bar

What this means in the screenshot:
- the floating rail currently starts at the top of the outer tabs host instead of at the bottom of the inner floating title bar
- so the first tab sits too high and visually competes with the `View` label instead of reading as chrome attached below it

#### Research Conclusion

Yes, this looks like a narrow floating-only alignment issue.

The existing docked rule already shows the right kind of seam: one explicit rail-start offset. Floating tabs appear to be missing the equivalent alignment rule after the shell split.

So this should be fixable without reopening the shell structure or resize logic.

#### Smallest Honest Direction

The narrowest likely fix is:
- keep the current floating shell ownership from `Phase 1.3`
- keep the current floating handle positions from `Phase 1.5`
- add one floating-only rail-start offset so `.ViewToolbarTabRail` begins at the bottom edge of the floating title bar

Likely alignment order:
1. measure the effective floating titlebar height / bottom edge
2. apply one floating-only top offset on the rail owner
3. verify the tab rail still clears the left-corner resize handles and does not reopen the padding work owned by `Phase 1.4`

#### First Pass Decisions

- treat this as a rail-baseline alignment issue, not a shell-ownership issue
- prefer a floating-only CSS offset first because the docked path already uses that pattern
- keep the rail outside the floating chrome shell while aligning it to the title bar baseline
- leave any broader floating interior spacing cleanup to `Phase 1.4`

#### Exact First Code Cut

1. In `src/app/theme/surfaces/viewport-overlay.css`, add or adjust a floating-only `.ViewToolbarTabRail` top offset so the rail starts at the bottom of the floating `ViewToolbarFloatingWindowHeader` / titlebar.
2. Only touch `src/app/components/ViewToolbar.tsx` if the live implementation proves a small shared titlebar-height variable is needed to avoid a hard-coded mismatch.
3. Keep the docked rail-start rule intact unless the implementation proves one tiny shared rail-offset variable is clearly cleaner.
4. Widen `src/app/components/ViewToolbar.test.tsx` only if one narrow floating-tabs alignment assertion is needed on top of the existing shell and handle proof.

#### Likely Files

- `src/app/theme/surfaces/viewport-overlay.css`
- possible shared value seam only if truly needed:
  - `src/app/components/ViewToolbar.tsx`
- possible proof touchpoint:
  - `src/app/components/ViewToolbar.test.tsx`

#### No-Widening Rule

- do not reopen the floating shell split from `Phase 1.3`
- do not mix this with the floating interior dead-space cleanup from `Phase 1.4`
- do not disturb the floating west-side resize handle realignment from `Phase 1.5`
- do not widen into active-tab chrome polish while solving the rail-start alignment

#### Implementation Risks

- offsetting the rail visually but leaving it slightly out of sync with the real titlebar bottom edge
- fixing the floating rail start while accidentally disturbing the docked offset rule
- using a hard-coded value that drifts if the floating titlebar height changes later
- solving the top alignment while accidentally reintroducing conflict with the top-left resize corner hit target

#### Checklist

- [ ] confirm the floating rail starts from the outer host top instead of the titlebar baseline
- [ ] define the smallest floating-only offset that aligns the rail to the bottom of the title bar
- [ ] keep docked tabs, resize handles, and padding cleanup boundaries intact
- [ ] keep the next cut local to floating tabs alignment

#### Verification Shape

This research phase is healthy when:

- the screenshot issue is captured as a concrete rail-start misalignment
- the existing docked offset rule is recognized as the nearby seam
- the next implementation cut is framed as one floating-only alignment pass

#### Done Shape

`Phase 1.6` is done when:

- the plan clearly records that floating tabs need to start at the bottom of the title bar
- the likely owner is named as a floating-only rail-start offset
- the next implementation cut is defined without reopening shell, resize, or padding work

Current status:
- `Phase 1.6` is implemented
- floating `tabs` mode now offsets the rail start to the bottom edge of the floating `View` title bar instead of starting from the outer host top
- the docked rail-start rule, floating shell split, and floating handle realignment stayed intact

#### Implemented Result

- `src/app/components/ViewToolbar.tsx` now exposes the real floating titlebar height through one `--v15-view-toolbar-floating-titlebar-height` style variable on `.ViewToolbarFloatingWindow`, so the floating rail offset can follow the same owner that already defines the window titlebar height.
- `src/app/theme/surfaces/viewport-overlay.css` now gives `.ViewToolbarTabsHost--floating[data-open='true'] > .ViewToolbarTabRail` a floating-only top offset based on that titlebar-height variable, which moves the first tab down to the bottom edge of the floating `View` title row without disturbing docked tabs.
- `src/app/components/ViewToolbar.test.tsx` now proves the floating window exports the shared titlebar-height variable in the same floating tabs proof that already covers shell ownership and west-side handle alignment.

## [x] `View-Toolbar 6 Phase 8` - `Phase 1.7 - Floating Tabs Minimum Height Floor`

### Phase 1.7 Summary

#### Purpose

Keep the floating `ViewToolbar` at least as tall as the outside tabs rail when the active section body is very short, so the rail no longer hangs below the visible floating window.

#### Owns

- the live root-cause read for the short-content floating-tabs height mismatch visible in the screenshot
- deciding the smallest honest floating-only minimum-height contract that keeps the visible floating chrome from ending above the bottom of the rail
- preserving the current shell split, titlebar alignment, resize behavior, and single scroll owner while adding that height floor

#### Does Not Own

- docked height behavior
- broader floating shell ownership changes from `Phase 1.3`
- floating interior spacing/body-box cleanup already shipped in `Phase 1.4`
- active-tab chrome polish

#### Current Live Read

Current floating height owner:
- `src/app/components/ViewToolbar.tsx`
  - the outer `.ViewToolbarFloatingWindow` currently uses:
    - `height: ${resolvedViewToolbarFloatingRect.height}px`
  - `resolveDefaultViewToolbarFloatingRect()` and resize math already enforce:
    - `VIEW_TOOLBAR_FLOATING_MIN_HEIGHT = 180`
  - but that is a generic window floor, not a tabs-rail-aware floor

Current floating tabs host seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarTabsHost--floating` currently uses:
    - `height: 100%`
  - `.ViewToolbarTabRail` uses natural content height with:
    - `display: flex`
    - `flex-direction: column`
    - `gap: 4px`
  - the rail therefore keeps growing to fit all tabs even when the floating chrome beside it becomes short

Current floating chrome seam:
- `src/app/components/ViewToolbar.tsx`
  - `.ViewToolbarFloatingChrome` still sizes from the floating rect height
  - with short content, the inner body can become much shorter than the full rail stack
- `src/app/theme/surfaces/viewport-overlay.css`
  - `.ViewToolbarFloatingChrome` currently uses:
    - `height: 100%`
    - `min-height: 0`
  - there is no tabs-aware minimum height tying the chrome to the rail height

What this means in the screenshot:
- when the active section body is short, the visible floating window ends early
- the outside rail still shows the full tabs stack
- so the lower tabs read as floating below the window instead of attached to it

#### Research Conclusion

Yes, this looks fixable with the current shell family.

The issue does not look like another shell-ownership problem. It looks like the floating height contract currently respects only the window/content minimums, not the outside rail height.

So the next cut should be one floating-only minimum-height floor that makes the visible floating chrome at least as tall as the rail.

#### Smallest Honest Direction

The narrowest likely fix is:
- measure or derive the rail height in floating `tabs` mode
- apply a floating-only minimum-height floor so the visible floating chrome cannot end before the rail does
- keep the current resize math honest by letting user resizing still work above that floor and by clamping only when the requested height would undershoot the rail

Likely tightening order:
1. identify the narrowest owner for the rail-aware minimum-height floor:
   - outer floating rect
   - `.ViewToolbarTabsHost--floating`
   - or `.ViewToolbarFloatingChrome`
2. make the visible chrome height at least the rail height plus the titlebar
3. verify that drag, resize handles, and scrollbar ownership still behave normally when content becomes longer than the rail

#### First Pass Decisions

- treat this as a floating minimum-height contract problem, not a spacing problem
- keep the rail outside the shell and make the shell honor the rail, not the other way around
- prefer a local floating-tabs height floor before widening into generic viewport-window sizing rules
- keep the user-resizable behavior intact as long as it does not undershoot the rail

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx`, identify or derive the total required minimum height for floating `tabs` mode so the visible floating chrome remains at least as tall as the outside rail stack.
2. Apply that minimum-height floor at the narrowest honest floating owner, likely the outer floating rect or the inner floating chrome, without disturbing classic-mode sizing.
3. Use `src/app/theme/surfaces/viewport-overlay.css` only for any supporting floating-tabs min-height rule if the implementation needs one; do not move shell ownership again.
4. Widen `src/app/components/ViewToolbar.test.tsx` only enough to prove the floating tabs path now exposes or honors a tabs-aware minimum-height contract.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- possible supporting seam:
  - `src/app/theme/surfaces/viewport-overlay.css`
- possible proof touchpoint:
  - `src/app/components/ViewToolbar.test.tsx`

#### No-Widening Rule

- do not reopen the shell split from `Phase 1.3`
- do not mix this with more floating padding cleanup after `Phase 1.4`
- do not disturb the titlebar-baseline alignment from `Phase 1.6`
- do not force the rail to shrink or scroll just to hide the mismatch unless a later phase explicitly owns that behavior

#### Implementation Risks

- applying the height floor to the wrong owner so the outer window grows but the visible chrome still ends early
- making the minimum height too aggressive and reducing useful resize freedom
- accidentally changing classic-mode floating height behavior
- fixing the short-content case while breaking the longer-content scroll path

#### Checklist

- [x] confirm the visible floating chrome can currently end above the bottom of the rail
- [x] identify the narrowest tabs-aware minimum-height owner
- [x] keep resize, scroll, and docked behavior honest after the new floor
- [x] keep the follow-up local to floating tabs height

#### Verification Shape

This research phase is healthy when:

- the screenshot issue is captured as a height-floor mismatch, not vague tab drift
- the likely owner for the tabs-aware minimum height is named explicitly
- the next implementation cut is framed as one floating-only minimum-height pass

#### Done Shape

`Phase 1.7` is done when:

- the plan clearly records that the floating chrome must be at least as tall as the rail
- the likely owner for that minimum-height floor is named
- the next implementation cut is defined without reopening shell, padding, or docked behavior work

Current status:
- `Phase 1.7` is implemented
- floating `tabs` mode now derives a tabs-aware minimum-height floor from the measured outside rail plus the floating titlebar
- the outer floating rect, render height, and resize path now honor that floor so short content can no longer leave the chrome shorter than the rail

#### Implemented Result

- `src/app/components/ViewToolbar.tsx` now measures the real floating `.ViewToolbarTabRail` height, derives a tabs-aware minimum-height floor from that rail plus the titlebar, and stores that value as the local floating-tabs minimum height.
- the floating default rect, resize clamp, drag clamp, and rendered floating-window height now all honor that tabs-aware minimum-height floor instead of only the old generic `VIEW_TOOLBAR_FLOATING_MIN_HEIGHT`.
- the floating window now also exports `--v15-view-toolbar-floating-min-height`, and the focused proof confirms the short-content floating `tabs` case clamps up to the rail-aware floor instead of leaving the rail hanging below the visible chrome.

## [ ] `View-Toolbar 6 Phase 8` - `Phase 1.8 - Floating Tabs Wrapper Reduction`

### Phase 1.8 Summary

#### Purpose

Remove one more unnecessary wrapper from the floating `Tabs` content stack so the shell reads cleaner and less box-in-box-heavy around the highlighted `.ViewToolbarTabPanel`.

#### Owns

- identifying which remaining floating-tabs wrapper still visually reads like an extra body box
- deciding the smallest honest wrapper reduction that keeps the current outside-tabs structure intact
- preserving the current floating host, header, scroll owner, resize behavior, and minimum-height behavior while reducing one layer of wrapper noise

#### Does Not Own

- another outside-tabs shell split after `Phase 1.3`
- the broader floating interior padding cleanup already shipped in `Phase 1.4`
- changes to tab state, tab order, or tab interaction
- richer active-tab chrome polish from `Phase 2`

#### Current Live Read

Current floating tabs stack:
- `src/app/components/ViewToolbar.tsx`
  - floating `Tabs` mode currently renders:
    - outer `.ViewToolbarFloatingWindow`
    - tabs layout shell `.ViewToolbarPanel--tabs.ViewToolbarTabsHost--floating`
    - real visible chrome shell `.V15Panel.ViewToolbarFloatingChrome`
    - scroll owner `.ViewToolbarRoot.ViewToolbarFloatingWindowBody`
    - inner `.ViewToolbarPanel`
    - highlighted content shell `.ViewToolbarTabPanel`

What still feels wrapper-heavy:
- `Phase 1.4` already neutralized the larger outer body-box read so the highlighted panel became the only strong content box
- but there is still one more structural wrapper between `.ViewToolbarFloatingWindowBody` and `.ViewToolbarTabPanel`
- in the current floating branch, that remaining wrapper is the floating-only `.ViewToolbarPanel`
- even with most of its chrome reduced, it can still contribute to a "one more box around the blue box" read

Current likely redundant owner:
- `src/app/components/ViewToolbar.tsx`
  - `.ViewToolbarFloatingWindowBody` already owns:
    - floating body scroll behavior
    - full-height body sizing
    - `overflowY: auto`
    - `overflowX: hidden`
  - the nested `.ViewToolbarPanel` in floating `Tabs` mode currently only adds:
    - `marginTop: 0`
    - `padding: 0 0 ${viewToolbarBottomContentPadding}px`
  - that makes `.ViewToolbarPanel` the cleanest candidate for retirement or collapse in the floating `Tabs` path

#### Research Conclusion

Yes, this looks like it can be cleaned up with the current shell family.

The wrappers that still appear necessary are:
- `.ViewToolbarFloatingWindow` for floating position, z-order, and resize handles
- `.ViewToolbarTabsHost--floating` for the outside-rail-versus-window relationship
- `.ViewToolbarFloatingChrome` for the visible titlebar plus body shell
- `.ViewToolbarFloatingWindowBody` for the real floating scroll owner
- `.ViewToolbarTabPanel` for the highlighted content box

So the most likely wrapper to remove or collapse is the floating-only `.ViewToolbarPanel`, not the floating host, tabs host, chrome shell, or the highlighted content panel.

#### Smallest Honest Direction

The narrowest likely fix is:
- remove or collapse the floating-only `.ViewToolbarPanel` when presentation is `tabs`
- let `.ViewToolbarFloatingWindowBody` host `viewToolbarBodyElement` directly in that path
- move any truly-needed leftover bottom spacing onto the real surviving owner instead of keeping one dedicated wrapper just for that inset

Likely tightening order:
1. split the floating body branch so `tabs` mode can skip `.ViewToolbarPanel`
2. keep `.ViewToolbarFloatingWindowBody` as the only body scroll owner
3. preserve `.ViewToolbarTabPanel` as the only meaningful highlighted content box
4. re-home any still-needed bottom inset to the surviving body or panel owner

#### First Pass Decisions

- treat this as a wrapper-reduction pass, not another box-shadow or border-color tweak
- prefer removing the extra floating-only `.ViewToolbarPanel` before touching any more shell owners
- keep the surviving ownership model explicit:
  - floating host
  - tabs host
  - floating chrome
  - floating body scroll owner
  - highlighted tab panel
- if one tiny spacing rule still needs to move after the wrapper is removed, move that rule instead of keeping the wrapper

### Phase 1.8 Implementation Spec

#### Exact First Code Cut

1. In `src/app/components/ViewToolbar.tsx`, split the floating body branch so floating `Tabs` mode no longer mounts the extra `.ViewToolbarPanel` wrapper if it is only acting as a pass-through spacing shell.
2. Render `viewToolbarBodyElement` directly under `.ViewToolbarFloatingWindowBody` for floating `Tabs` mode, while keeping the existing classic-mode path intact unless one tiny shared seam forces a safer local helper.
3. Re-home any still-needed bottom content inset from the removed wrapper onto the surviving honest owner, likely `.ViewToolbarFloatingWindowBody` or `.ViewToolbarTabPanel`, instead of keeping the wrapper alive for padding alone.
4. Touch `src/app/theme/surfaces/viewport-overlay.css` only as needed to preserve the post-`Phase 1.4` clean single-panel read after the wrapper reduction.
5. Widen `src/app/components/ViewToolbar.test.tsx` only enough to prove the floating `Tabs` path no longer includes the redundant body wrapper while preserving the current floating titlebar, outside rail, resize-handle, and minimum-height behavior.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- possible supporting seam:
  - `src/app/theme/surfaces/viewport-overlay.css`
- possible proof touchpoint:
  - `src/app/components/ViewToolbar.test.tsx`

#### No-Widening Rule

- do not reopen the outside-tabs shell split from `Phase 1.3`
- do not reintroduce the floating box-in-box read already reduced in `Phase 1.4`
- do not disturb the floating titlebar baseline alignment from `Phase 1.6`
- do not disturb the tabs-aware minimum-height floor from `Phase 1.7`
- do not widen into new tab styling polish that belongs to `Phase 2`

#### Implementation Risks

- removing the wrong wrapper and accidentally dropping the only remaining bottom content inset
- collapsing the wrapper in a way that breaks the floating scroll owner or body sizing
- fixing the visual wrapper count while regressing resize/min-height behavior that now depends on the current floating shell stack
- accidentally changing classic-mode structure when only floating `Tabs` needs this cleanup

#### Ready-To-Implement Read

`Phase 1.8` is ready for implementation because:

- the likely redundant wrapper is now named explicitly:
  - floating-only `.ViewToolbarPanel`
- the surviving owners are explicit:
  - `.ViewToolbarFloatingWindow`
  - `.ViewToolbarTabsHost--floating`
  - `.ViewToolbarFloatingChrome`
  - `.ViewToolbarFloatingWindowBody`
  - `.ViewToolbarTabPanel`
- the exact next cut is narrow:
  - remove or collapse one wrapper
  - re-home any tiny leftover inset
  - keep the rest of the floating shell model intact

#### Checklist

- [ ] confirm the remaining extra-box read is coming from the floating-only `.ViewToolbarPanel`
- [ ] remove or collapse one redundant floating body wrapper
- [ ] keep the highlighted `.ViewToolbarTabPanel` as the only meaningful body box
- [ ] preserve floating scroll ownership, resize behavior, and minimum-height behavior
- [ ] avoid changing docked or classic structure

#### Verification Shape

This planning phase is healthy when:

- the extra wrapper is identified concretely instead of vaguely as "another box"
- the likely removable owner is named explicitly
- the next implementation cut is narrow enough to reduce one layer without reopening shell ownership work

#### Done Shape

`Phase 1.8` is done when:

- one redundant floating-tabs wrapper is removed or collapsed
- the floating body stack reads cleaner with fewer nested boxes
- `.ViewToolbarTabPanel` remains the only meaningful content box around the controls
- floating scroll, resize, and minimum-height behavior still work normally

Current status:
- `Phase 1.8` is added and prepped
- the likely wrapper-reduction target is the floating-only `.ViewToolbarPanel` between `.ViewToolbarFloatingWindowBody` and `.ViewToolbarTabPanel`
- the next cut is explicitly constrained to one wrapper cleanup instead of another broad floating-shell rewrite

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

# Browser Phase Browser-13 - Phase 1 - Scrollable Browser Content When Object Lists Overflow

## Doc Header

### Doc History
8. 2026-04-15 13:15:51: Landed `Attempt 3` by removing the docked Browser root's forced full-height filler contract, changing the Browser dock target to `auto-size until viewport-bounded max-height`, and collapsing the empty meatball dock sibling unless it is actually occupied or showing a preview ghost, so the left-docked Browser can read content-sized on first load while still staying bounded above the bottom console area and scrolling internally once it reaches the available left-dock height
7. 2026-04-15 12:56:16: Tightened `Attempt 3` into an implementation-ready slice by grounding it in the live docked Browser stretch rules that still force the Browser target/root to behave like a full-height filler, locking the next pass around `auto-size until viewport-bounded max-height, then scroll` with explicit CSS targets, scope boundaries, and verification goals
6. 2026-04-15 12:54:12: Added an explicit `Attempt 3` direction after confirming the docked Browser height is still being driven mainly by flex stretch rather than content size, locking the next pass around `auto-size until viewport-bounded max-height, then scroll` so the Browser reads as content-sized on first load and only gains a scrollbar once it reaches the available left-dock height
5. 2026-04-15 12:47:01: Landed `Attempt 2` by forcing the primary left-dock stack into its constrained path even in the normal unsplit primary viewport shell, so the Browser-bearing dock no longer depends on split-only gating before it can expose bounded inner scrolling; focused AppShell and BrowserDockHost verification passed
4. 2026-04-15 12:43:37: Added an explicit `Attempt 2` research direction after a deeper live reread showed the remaining scrollbar failure is more likely rooted in the unsplit left-dock constraint gate and the always-rendered empty meatball dock slot than in missing Browser-local `overflow-y` styling
3. 2026-04-15 12:31:13: Marked `Browser-13 - Phase 1` shipped after the docked Browser target gained the missing flex/min-height containment contract, `.BrowserPanelBody` was preserved as the Browser-local scroll owner, BrowserDockHost wheel forwarding began preferring Browser-body scrolling before the outer left-dock stack, and the focused Browser panel plus dock-host verification passed
2. 2026-04-15 12:22:38: Renamed this first Browser-13 follow-on to `Browser-13 - Phase 1`, then tightened it into an implementation-ready slice by grounding the overflow bug in the live docked Browser layout chain where `.BrowserPanelBody` already owns scrollbar styling but the surrounding dock target and panel height contract still appear too loose for that scroll path to engage reliably
1. 2026-04-15 12:20:12: Created this standalone future Browser phase doc as the first `Browser-13` follow-on, locking the overflow-containment pass that keeps long Browser object lists inside the Browser panel and adds a working vertical scrollbar when content exceeds the available height

### Purpose

This phase fixes Browser overflow when large object lists exceed the available panel height.

Use it to:
- keep Browser rows contained inside the Browser panel instead of running off the bottom of the app
- add a normal vertical scrollbar so users can reach all Browser objects in large projects
- choose the right Browser-local scroll container without reopening Browser hierarchy or row behavior

## Doc Body

## [x] Browser-13 - Phase 1

### Summary

`Browser-13 - Phase 1` is the first concrete cleanup slice inside `Browser-13`.

The problem is straightforward:
- the Browser can render more rows than the available panel height
- those rows currently continue past the bottom of the visible app
- the user loses access to part of the Browser tree because there is no proper Browser-local scroll container

This phase fixes that in a narrow way:
- contain Browser list content within the Browser panel
- make the Browser tree/list region vertically scrollable when it overflows
- keep Browser truth, hierarchy, and row actions unchanged

### Shipped Result

- the docked Browser target now has the missing shrink/containment contract, so the Browser panel can stay bounded by the left dock instead of growing with long object lists
- `.BrowserPanelBody` remains the intended Browser-local scroll surface and now scrolls before the outer dock stack when wheel input lands over the docked Browser
- long Browser trees stay reachable inside the Browser panel without changing Browser hierarchy, row rendering, or drag behavior
- `Attempt 2` widened the constrained left-dock stack path into the normal unsplit primary viewport shell, so Browser no longer waits for a viewport split before the dock stack can behave like a bounded scroll-capable column
- `Attempt 3` removed the docked Browser's remaining stretch-to-fill contract, so the left-docked Browser now reads as content-sized when short, stays capped by the primary viewport's left-dock height above the bottom console inset, and only lets `.BrowserPanelBody` take over scrolling once that bounded height is reached
- the empty meatball dock sibling now collapses unless a real meatball editor view is docked or a preview ghost is active, which prevents the unused slot from reserving height that should belong to the Browser

### Attempt 2 Research Direction

The first implementation pass appears insufficient in the live unsplit shell.

Latest research points to a stronger root cause:
- `BrowserPanel.tsx` and `browser.css` already provide a valid Browser-local scroll surface through `.BrowserPanelBody`
- the remaining failure is likely higher in the left-dock height chain, especially in the normal unsplit layout from the user screenshot

Most likely remaining blockers:
- `useAppShellWorkspaceSelectors.ts`
  - `primaryViewportSlotIsConstrained` only becomes true when the primary viewport is split
  - that means the normal unsplit primary viewport path may never opt the left dock into its constrained stack behavior
- `PrimaryViewportLeftDock.tsx`
  - the dock stack only gets the constrained class when `isConstrained` is true
  - the Browser and meatball dock targets are always rendered as siblings inside that stack
- `base.css`
  - `.PanelStack.isConstrained` is the rule that actually grants the left-dock stack its bounded flex/min-height/overflow behavior
  - if the unsplit case never gets this class, the Browser can still size to content instead of overflowing
- `docks.css`
  - `.PrimaryViewportLeftDockPanelTarget--meatball-editor` keeps a full `flex: 1 1 auto` contract even when it is empty
  - that empty sibling may still consume height and starve the Browser area

Attempt 2 recommendation:
- treat this as a primary left-dock layout bug first, not as a Browser row/body styling bug
- make the left-dock panel stack constrained even in the unsplit primary viewport path
- keep `.BrowserPanelBody` as the intended scroll owner
- stop the empty meatball dock target from consuming full flex height unless it actually contains mounted content or an active preview

Attempt 2 likely target order:
1. `src/app/hosts/useAppShellWorkspaceSelectors.ts`
   - revisit the `primaryViewportSlotIsConstrained` gate for the primary left dock
2. `src/app/workspace/PrimaryViewportLeftDock.tsx`
   - verify whether the dock stack should always receive its constrained path for the Browser-bearing primary viewport shell
3. `src/app/theme/foundation/base.css`
   - confirm the constrained stack rule is the real height owner in the left rail
4. `src/app/theme/shell/docks.css`
   - reduce or conditionalize empty meatball-target flex participation if it is stealing height from Browser

Attempt 2 success condition:
- if Browser content is taller than the visible left-dock area below the top status/title region, the Browser itself should show the scrollbar in the normal unsplit app shell, not only in split layouts and not only through outer dock scrolling

### Attempt 3 Direction

The next likely issue is not just containment. It is that the docked Browser is still being stretched too aggressively on first load.

Latest understanding:
- the Browser should not act like a permanent full-height dock panel by default
- the Browser should size to its content first
- the Browser should stop growing once it reaches the available height inside the current primary Model Viewport left dock
- only then should `.BrowserPanelBody` become scrollable

What Attempt 3 should change:
- stop forcing the docked Browser root to behave like a full-height filler in the left dock
- stop treating the Browser dock target as a permanent `flex: 1 1 auto` consumer when the Browser content is short
- preserve a viewport-based maximum height so split layouts automatically reduce the Browser's available vertical span
- keep `.BrowserPanelBody` as the internal scroll owner only after the Browser reaches that maximum available height

Attempt 3 working rule:
- Browser height should be based on the current primary Model Viewport left-dock span
- unsplit viewport:
  - Browser may grow farther downward before it reaches max height
- split viewport:
  - Browser reaches max height sooner because the primary viewport's available vertical span is smaller
- in both cases:
  - Browser should look content-sized first, then become scrollable only after it hits that max

Attempt 3 likely targets:
1. `src/app/theme/surfaces/browser.css`
   - revisit the docked Browser root rule that currently forces `height: 100%`
2. `src/app/theme/shell/docks.css`
   - change the Browser dock target from permanent filler behavior toward `auto-size until max-height`
3. `src/app/workspace/PrimaryViewportLeftDock.tsx`
   - keep the Browser inside the viewport-derived left-dock column, but avoid layout rules that imply the Browser must always consume all remaining height
4. `src/app/theme/foundation/base.css`
   - confirm the constrained left-dock stack still provides the maximum available vertical boundary without forcing the Browser itself to stretch to fill it

Attempt 3 success condition:
- on first load with short Browser content, the docked Browser shrinks to its content instead of appearing much taller than necessary
- when Browser content grows downward to the bottom of the available left-dock span inside the current primary Model Viewport, `.BrowserPanelBody` becomes scrollable
- when the viewport is split, that maximum height naturally becomes smaller without introducing a separate Browser-specific height computation path

### Attempt 3 Implementation Prep

#### Current live Attempt 3 seams

- `src/app/theme/shell/docks.css`
  - `.PrimaryViewportLeftDock` is the viewport-derived outer height owner because it is pinned with `top: 0` and `bottom: 0`
  - `.PrimaryViewportLeftDockContent` and `.PrimaryViewportLeftDockPanelStackShell` already provide the vertical column beneath the top status area
  - `.PrimaryViewportLeftDockPanelTarget--browser` still uses `flex: 1 1 auto`, which makes the Browser act like a filler panel instead of a content-sized panel
  - `.PrimaryViewportLeftDockPanelTarget--meatball-editor` also uses `flex: 1 1 auto`, so the empty sibling remains a potential height participant
- `src/app/theme/surfaces/browser.css`
  - the docked Browser-specific selector currently forces `.BrowserPanelRoot` to `flex: 1 1 auto` plus `height: 100%`
  - that is the clearest live rule causing the Browser to read taller than its content on first load
  - `.BrowserPanelBody` already owns `overflow-y: auto`, so it should remain the internal scroll surface after max height is reached
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - Browser lives inside the viewport-derived left-dock stack under the status bar
  - the Browser and meatball targets remain siblings, so the implementation should be careful not to reintroduce filler behavior through the host structure

#### Locked Attempt 3 in-scope

- stopping the docked Browser from stretching to fill leftover left-dock height when content is short
- keeping the Browser bounded by the available primary viewport left-dock height
- allowing the Browser to grow naturally until it reaches that maximum available height
- keeping `.BrowserPanelBody` as the internal scroll owner once the Browser hits its maximum height
- ensuring split layouts automatically reduce the Browser maximum height through the existing viewport-derived dock layout

#### Locked Attempt 3 out-of-scope

- JavaScript height measurement or `ResizeObserver`-based sizing in the first pass
- Browser hierarchy, row rendering, or action behavior changes
- redesigning the left-dock status bar or the Browser chrome
- reopening outer dock scrolling as the primary solution
- broad meatball docking redesign beyond preventing obvious empty-slot stretch interference if still needed

#### Preferred Attempt 3 implementation shape

1. Keep the left dock as the maximum-height boundary provider.
2. Remove docked Browser rules that force the Browser root to fill the target height by default.
3. Change the Browser dock target so it behaves like `auto-size until max-height` instead of a permanent filler panel.
4. Preserve `min-height: 0` and overflow support so once the Browser reaches the boundary, `.BrowserPanelBody` can scroll normally.
5. Only if Browser still appears too tall after removing stretch rules, reduce empty meatball-slot flex participation as a small follow-on inside the same pass.

#### Concrete implementation targets

Primary expected edits:
- `src/app/theme/surfaces/browser.css`
  - revisit the docked rule under `.PrimaryViewportLeftDockPanelTarget--browser > .V15Panel.BrowserPanelRoot`
  - likely remove `height: 100%`
  - likely replace filler-style `flex: 1 1 auto` behavior with an `auto-size` plus `max-height: 100%` contract
- `src/app/theme/shell/docks.css`
  - revisit `.PrimaryViewportLeftDockPanelTarget--browser`
  - likely move away from permanent `flex: 1 1 auto`
  - keep the target bounded inside the left-dock column while letting it shrink to content

Supporting edits if needed:
- `src/app/theme/foundation/base.css`
  - confirm `.PanelStack.isConstrained` still supplies the correct outer boundary without forcing Browser stretch
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - only if an extra wrapper/class signal is needed to distinguish auto-sized Browser behavior from other dock targets
- `src/app/AppShell.test.tsx`
  - add or refine focused tests around the constrained left-dock baseline if class ownership changes

#### Verification goals

- short Browser content:
  - the docked Browser reads content-sized on first load and does not extend far below its last visible section
- overflowing Browser content:
  - once content reaches the bottom of the available left-dock span, `.BrowserPanelBody` becomes scrollable
- split primary viewport:
  - the Browser hits the maximum height sooner because the available left-dock height is smaller
- non-regression:
  - floating, popout, and split Browser surfaces keep their current height behavior

### Current Live Phase 1 Seams

- `src/app/panels/BrowserPanel.tsx`
  - the docked Browser already renders one obvious scroll-owner candidate: `.BrowserPanelBody`
  - `.BrowserPanelBody` wraps `.BrowserTree`, so this is the right local region to scroll if the height chain is correct
- `src/app/theme/surfaces/browser.css`
  - `.BrowserPanelBody` already has `flex: 1 1 auto`, `min-height: 0`, and `overflow-y: auto`
  - `.BrowserPanelRoot` only gets an explicit `height: 100%` contract in the floating/split/browser-surface selectors, which means the docked left-rail case may still be under-constrained
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - the docked Browser lives inside `.PrimaryViewportLeftDockPanelTarget--browser` within the left dock `PanelStack`
- `src/app/theme/shell/docks.css`
  - `.PrimaryViewportLeftDockPanelTarget--browser` does not currently declare the same explicit `flex: 1 1 auto; min-height: 0` shrink contract that `.PrimaryViewportLeftDockPanelTarget--meatball-editor` already has
  - that makes this file a likely first implementation target for the containment fix
- `src/app/theme/foundation/base.css`
  - `.PanelStack.isConstrained` already provides a broader outer scroll path for the dock stack
  - `Phase 1` should avoid relying on that outer dock scroll unless Browser-local containment proves impossible, because the desired behavior is a Browser-local scrollbar inside the Browser panel

### Locked Phase 1 In-Scope

- fixing the docked Browser height/flex containment chain so `.BrowserPanelBody` can become the active scroll owner
- keeping long Browser trees bounded inside the Browser panel
- preserving Browser-local scrolling with stable header/chrome while the list region moves
- adding or tightening tests around docked Browser overflow behavior

### Locked Phase 1 Out-Of-Scope

- redesigning Browser rows
- changing Browser hierarchy, expansion, drag, or ownership semantics
- moving the primary overflow responsibility to the whole left dock or app shell
- bundling unrelated Browser-13 polish while fixing the scrollbar bug

### Owns

- Browser-local vertical overflow containment
- choosing the correct Browser panel body/tree region to own scrolling
- enabling a vertical scrollbar when Browser content exceeds the available height
- keeping Browser content reachable in large projects without escaping the app frame

### Does Not Own

- Browser hierarchy or ownership changes
- new drag behavior
- row-surface redesign beyond what is needed to support the scroll container
- app-shell layout rewrites outside the Browser panel
- unrelated Browser polish that does not affect overflow usability

### Locked Direction

- keep the Browser panel bounded by the available app height
- make the Browser tree/list region scroll vertically when content overflows
- keep the Browser header/chrome stable instead of letting the whole app shell become the workaround scroll surface
- preserve existing row rendering and interaction behavior while fixing access to overflowing content

### Current Gap

Today large Browser object lists are not properly contained:
- the tree can continue below the visible Browser area
- the bottom of the object list can run off the app viewport
- the user cannot reliably reach all rows through normal Browser interaction

This is a usability bug more than a visual preference:
- long Browser trees are expected
- the Browser needs a standard overflow path for them

### Direction

- find the Browser panel element that should define the available list height
- clamp the Browser list/content area so it cannot grow past the available panel space
- apply vertical overflow scrolling to that Browser-local list region
- verify that the Browser header and controls remain stable while the list scrolls underneath

### Implementation Direction

- inspect the docked Browser layout chain and find where height/overflow currently leak:
  - `.PrimaryViewportLeftDockPanelStackShell`
  - `.PanelStack.isConstrained`
  - `.PrimaryViewportLeftDockPanelTarget--browser`
  - `.BrowserPanelRoot`
  - `.BrowserPanelBody`
- preserve `.BrowserPanelBody` as the intended local scroll owner unless the live DOM proves another Browser-local body wrapper is more correct
- add the missing shrink/containment contract on the docked Browser path so the Browser root cannot size itself purely to content height
- verify that row hit targets, expansion, selection, and drag still behave correctly inside the scrollable region

### Preferred Phase 1 Implementation Shape

1. Start with CSS/layout containment before touching Browser rendering code.
2. Give the docked Browser target and any missing parent shell the explicit `flex` and `min-height: 0` contract needed for child overflow to engage.
3. Reuse the existing `.BrowserPanelBody` scrollbar styling instead of inventing a second scroll surface.
4. Only touch `BrowserPanel.tsx` if the live DOM needs one extra wrapper or class hook to make the containment chain explicit.
5. Verify docked, split, floating, and popout Browser variants so the containment fix does not regress other presentation modes.

### Questions / Decisions

#### [ ] q1 - Should only the Browser content/list region scroll while the Browser chrome remains stable?

Question:
- when Browser content overflows, should the scrollable region be the Browser list/body area rather than the whole app shell or outer workspace column?

Suggestion:
- yes
- keep the scroll behavior local to the Browser panel

#### [ ] q2 - Should the Browser header and panel controls remain visible while the object list scrolls?

Question:
- should the Browser title/header area and nearby controls stay visible while the user scrolls through a long object list?

Suggestion:
- yes
- keep the Browser chrome stable and let the list area carry the scrolling

#### [ ] q3 - Should this phase stay narrowly about overflow containment instead of bundling broader Browser polish?

Question:
- should `Browser-13 - Phase 1` focus only on making long Browser content reachable and contained, leaving unrelated spacing or visual polish to later `13.x` phases?

Suggestion:
- yes
- land the overflow fix cleanly before taking on broader UI cleanup

### Concrete Implementation Targets

Primary expected targets:
- `src/app/theme/shell/docks.css`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`

Supporting targets if needed:
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Tests

- long Browser object lists remain contained inside the Browser panel instead of extending past the bottom of the app
- the Browser exposes a vertical scrollbar when the list exceeds the available panel height
- users can scroll to the last Browser row in large projects
- Browser header/chrome remains visible while the list scrolls
- selection, expansion, and existing Browser row actions still work inside the scrollable region
- split, floating, and popout Browser variants keep their current containment behavior after the docked fix

### Phase 1 Checklist

- confirm the docked Browser reproduction against the current left-rail layout
- lock the specific parent node where height containment currently breaks
- apply the smallest flex/min-height/overflow fix that lets `.BrowserPanelBody` become scrollable
- keep Browser-local scrollbar ownership instead of shifting the problem to outer dock scrolling
- verify no regressions in Browser interaction inside the scroll region
- update Browser tests to cover the intended docked overflow contract

### Assumptions

- the Browser should own its own overflow behavior instead of relying on outer app scrolling
- the current bug is caused more by missing or incorrect height/overflow constraints in the docked Browser layout chain than by missing scrollbar styling
- a narrow scrollbar/containment pass is the right first `Browser-13` cleanup phase because it restores basic usability for large object sets

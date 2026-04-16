# 20 - Browser Multi-Select Scroll FLIP Glitch

## Doc History
8. 2026-04-15 16:38: Landed `Bug 20.2` by adding a Browser FLIP scroll guard in `BrowserAnimatedContentRows` so plain Browser scroll marks the next same-order content rerender as a scroll-stabilization pass instead of replaying stale row-top animation, and added focused row-section regression coverage to prove `scroll -> click` no longer triggers FLIP while real reorder motion still animates
7. 2026-04-15 16:48: Tightened `Bug 20.2` through `Bug 20.5` into implementation-ready slices by adding locked seam reads, in-scope versus out-of-scope boundaries, concrete target files, and phase-specific verification goals so each pass can be implemented by Codex one at a time without re-planning the bug ladder
6. 2026-04-15 16:42: Added a dedicated fix-phase ladder for `Bug 20`, splitting the repair into small implementation slices so Codex can land the Browser scroll-jump fix one pass at a time instead of mixing FLIP stabilization, shift-range verification, wheel-forwarding validation, and cleanup into one larger risky patch
5. 2026-04-15 16:36: Completed the `Bug 20.1` read-only research pass by confirming that Browser selection rerenders rebuild `contentRows`, that `BrowserAnimatedContentRows` replays cached pre-scroll row-top positions on the next click because its FLIP cache is only refreshed during rerender rather than on scroll, and that the existing test surface covers shift-range selection and Browser-body click clearing but does not cover scroll-plus-click or scroll-plus-shift-click regressions
4. 2026-04-15 16:28: Tightened `Bug 20.1` into an implementation-prep research handoff by locking the strongest current seam read, narrowing the first implementation target around Browser FLIP stabilization before any broader Browser interaction changes, and listing the first concrete verification goals
3. 2026-04-15 16:24: Added a dedicated research-phase section so this bug note now doubles as the handoff for the next investigation pass, locking the goal around proving whether the Browser FLIP row animation, wheel-forwarding seam, or a mixed interaction between them is the real cause of the post-scroll jump behavior
2. 2026-04-15 16:12: Expanded the repro to reflect the stronger plain-click symptom where the Browser can jump after the user merely scrolls the Browser and then clicks a row, clarifying that the bug is not limited to multi-select or shift-range interactions
1. 2026-04-15 16:05: Created this bug note to capture the Browser multi-select failure and row-jump glitch that shows up after scrolling large Browser lists, with the current strongest read pointing at the Browser content-row FLIP animation layer rather than the core shift-range selection math itself

## Status

- `[investigating]`

## Summary

This bug looks like:
- Browser multi-select works when all target rows are already on screen
- Browser can jump after a plain scroll + plain click, even without multi-select intent
- Browser shift-click range select becomes unreliable once the user scrolls and then clicks a farther row
- after scrolling, Browser rows can jump or glitch on click
- after a few clicks, the glitch often settles down

The current strongest read is:
- the core shift-range selection math looks structurally correct
- the stronger live suspect is the Browser FLIP row animation firing after scroll-driven row-position changes

## User-Facing Symptom

- selecting `1 -> 10` works
- selecting `1 -> 20` works
- moving into Browser, scrolling up or down, then clicking one object can make the whole Browser jump or scroll unexpectedly
- selecting `1`, scrolling down, then shift-clicking `50` does not reliably select `1 -> 50`
- after scroll, clicking rows can make the Browser jump around visually
- the jumpiness often calms down after a few more clicks

## Current Strongest Read

The current strongest likely cause is the animated Browser content-row layer in:

- `src/app/panels/browserTreeSections.tsx`

That layer stores previous row `top` positions and applies a FLIP-style `translateY(...)` animation whenever row positions change.

That is likely colliding with normal Browser scroll behavior:
- the user scrolls the Browser
- visible row `top` values change on screen
- the next plain click or selection click changes Browser row state
- the FLIP layer treats those new row positions like a re-layout transition
- rows animate or jump even though the user only scrolled and clicked

That matches the observed symptom that the Browser can glitch right after scroll, then settle once the cached row-top values catch up to the new scrolled state.

After the read-only research pass, this is now the strongest concrete code-backed read rather than only a loose suspicion.

## Why This Is Probably Not The First Bug

The current shift-range selection code in:

- `src/app/panels/browserInteractions.ts`

builds the range from the full `browserTreeRows.contentRows` tree model rather than only mounted DOM rows.

That means the strongest first read is not:
- off-screen rows are impossible to range select

It is more likely:
- the Browser visual row animation or post-scroll interaction state is destabilizing the click path after scroll
- or the clicked target appears to be one row while the Browser is still visually translating rows from stale FLIP state

## Secondary Contributing Seam

The dock host also manually forwards wheel input into `.BrowserPanelBody`, then falls back to the outer constrained panel stack if the inner body cannot scroll further:

- `src/app/hosts/BrowserDockHost.tsx`

That may contribute to the feeling that the Browser scrollbar is acting strangely, but it does not currently look like the strongest first cause of the row-jump glitch.

## Likely Files

- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserInteractions.test.ts`
- `src/app/hosts/BrowserDockHost.tsx`

## Research Phase

### `Bug 20.1` - `Browser Scroll Jump Research`

Purpose:
- prove what is actually causing the Browser to jump after scroll + click before any stabilization patch lands

Owns:
- confirming whether the FLIP row animation in `browserTreeSections.tsx` is firing after plain scroll-driven row-position changes
- confirming whether Browser wheel forwarding in `BrowserDockHost.tsx` is contributing to the visible jump or only making the symptom feel worse
- confirming whether the failed post-scroll shift-range selection is a separate selection bug or just collateral damage from the same visual jump
- identifying the smallest safe stabilization seam for the first implementation pass

Does not own:
- the actual stabilization fix
- grouped Browser drag/drop work
- broader Browser row animation redesign beyond what is needed to explain this bug

Research questions:
- does a plain Browser scroll followed by a plain row click trigger FLIP animation because cached row `top` positions were recorded before scroll?
- does Browser selection state change rebuild `contentRows` in a way that causes `BrowserAnimatedContentRows` to animate rows that only moved because the scroll position changed?
- does wheel forwarding ever move the outer constrained stack in the same repro, or is the visible jump happening entirely inside the Browser content-row animation layer?
- when shift-click range fails after scroll, is the wrong row actually being clicked because rows are still visually translating, or is the explicit selection anchor/range calculation also being corrupted?

Research acceptance read:
- the team can say whether the Browser jump is primarily:
  - FLIP-only
  - wheel-forwarding-only
  - or a mixed interaction
- the first implementation seam is explicitly identified
- the first regression tests are explicitly identified before code changes start

### `Bug 20.1` Research Result

Outcome:
- the Browser jump now looks primarily like a FLIP replay bug
- wheel forwarding still looks like a secondary seam worth rechecking, but not like the strongest first cause
- the failed post-scroll shift-range selection still looks more like collateral damage from the jump than a proven independent range-selection math bug

What the code read confirmed:
- `src/app/panels/browserTreeSections.tsx`
  - `BrowserAnimatedContentRows` keeps a `previousTopByRowIdRef`
  - its `useLayoutEffect` runs on `[contentRows]`
  - when it sees a row's current `top` differ from the cached previous `top`, it applies `transform: translateY(...)` and animates back to `0`
- `src/app/panels/useBrowserPanelController.ts`
  - `browserTreeRows` is rebuilt through `selectBrowserTreeRows(...)`
  - that memo depends on selection inputs such as `selectedBrowserRowId`, `selectedBrowserRowIds`, and `groupedSelectedBrowserRowIds`
- `src/app/panels/selectBrowserTreeRows.ts`
  - row VMs embed selection state directly as `isSelected` and `isGroupedSelected`
  - that means a plain click that changes selection rebuilds the `contentRows` input consumed by `BrowserAnimatedContentRows`

Why that likely causes the bug:
- plain Browser scroll changes the on-screen `top` values of visible rows
- scroll alone does not refresh the FLIP cache because the FLIP cache is only updated during rerender
- the next plain click changes selection state
- that selection rerender re-runs `BrowserAnimatedContentRows`
- the FLIP effect compares stale pre-scroll row tops against post-scroll row tops
- rows animate as if they were structurally moved, even though the user only scrolled and clicked
- after one or more further clicks, the cached row tops catch up, which explains why the glitch appears to settle

What still remains to verify during implementation:
- whether wheel forwarding in `src/app/hosts/BrowserDockHost.tsx` amplifies the visible jump in some dock states
- whether post-stabilization shift-click still has any true off-screen range-selection bug left once the jump is removed

Test-surface read:
- existing tests cover normal shift-range selection in:
  - `src/app/panels/browserInteractions.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
- existing BrowserPanel tests also cover clicking empty Browser body space to clear selection
- current tests do not cover:
  - scroll Browser body, then click a row
  - scroll Browser body, then shift-click a farther row
  - FLIP animation behavior after plain scroll-driven row-position changes

### `Bug 20.1` Implementation Prep

Current strongest implementation read:
- start with Browser FLIP stabilization first
- treat wheel forwarding as a secondary seam to re-check after the FLIP layer is stabilized
- do not reopen Browser selection math first unless the post-stabilization repro still shows a true range-selection failure

Locked first-pass direction:
- keep the existing Browser row animation system if possible
- prevent it from treating plain scroll position changes as row-layout transitions
- preserve intentional Browser row motion for real structure changes such as expand, collapse, reorder, or drag-related movement

Most likely first implementation seam:
- `src/app/panels/browserTreeSections.tsx`
  - `BrowserAnimatedContentRows`
  - `previousTopByRowIdRef`
  - the `useLayoutEffect` that compares cached row `top` values and applies `translateY(...)`

Secondary validation seam:
- `src/app/hosts/BrowserDockHost.tsx`
  - confirm that wheel forwarding is not causing the remaining jump after the FLIP change

Supporting read-only seams:
- `src/app/panels/browserInteractions.ts`
  - keep as the current range-selection truth unless the visual-jump fix proves insufficient
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserInteractions.test.ts`
- `src/app/hosts/BrowserDockHost.test.tsx`

Ready-to-start implementation goals:
1. Prevent Browser row FLIP animation from firing after plain Browser scroll plus plain row click.
2. Verify that plain Browser scroll plus plain row click no longer causes the Browser list to jump.
3. Verify that scroll plus shift-click range select behaves normally once the jump is gone.
4. Verify that intentional Browser row motion still works for real structural transitions.

Suggested first regression coverage:
- scroll Browser body, then click a row, and assert no unexpected Browser jump behavior
- select anchor row, scroll Browser body, shift-click a farther row, and assert stable explicit selection range
- retain a narrow positive test for intentional Browser row motion on a real structure-changing transition

## Fix Phases

Use the `Bug 20.x` ladder below as the implementation order.

The goal is:
- stop the Browser jump first
- then prove range selection behaves normally again
- then validate secondary seams
- then clean up and lock regressions

### `[x] Bug 20.2` - `FLIP Scroll Guard`

Purpose:
- stop `BrowserAnimatedContentRows` from replaying FLIP motion after plain Browser scroll plus plain row click

Owns:
- the first narrow stabilization change in `src/app/panels/browserTreeSections.tsx`
- preventing stale pre-scroll row-top cache from being treated like a real structure transition
- preserving the current Browser row animation path everywhere else unless that is impossible

Does not own:
- Browser wheel-forwarding changes
- selection math changes
- broader row-animation redesign

Acceptance read:
- scroll Browser body, click one row, and the Browser no longer jumps
- rows do not animate just because scroll position changed
- no broader Browser interaction seams are changed in this first pass

Implementation prep:

Current strongest seam read:
- `src/app/panels/browserTreeSections.tsx`
  - `BrowserAnimatedContentRows` is the first implementation target
  - `previousTopByRowIdRef` is the stale position cache that currently survives plain scroll
  - the `useLayoutEffect` keyed by `[contentRows]` is the place where stale pre-scroll row tops are being replayed into `translateY(...)`

Locked in-scope:
- guarding the FLIP path so plain scroll alone does not poison the next click-triggered animation pass
- keeping row animation available for real structure changes if possible
- adding the smallest focused test coverage needed to prove `scroll -> click` no longer jumps

Locked out-of-scope:
- wheel-forwarding changes in `BrowserDockHost.tsx`
- selection-anchor or range-selection math changes
- redesigning Browser row animation beyond the minimum needed to stop the bug

Concrete implementation targets:
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/BrowserPanel.test.tsx`

Ready-to-start verification:
- scroll Browser body, click a row, verify no Browser jump
- click a row without prior scroll, verify normal selection still works
- verify a real structure-changing transition still preserves intended row motion if that motion remains in scope

### `[ ] Bug 20.3` - `Post-Scroll Range Verification`

Purpose:
- verify whether shift-range selection still has any independent bug left once the jump is removed

Owns:
- adding or tightening regression coverage for `scroll -> shift-click`
- fixing range behavior only if it still fails after `Bug 20.2`
- keeping this pass narrowly about explicit selection truth after the visual jump is stabilized

Does not own:
- Browser wheel-forwarding changes
- broader Browser animation cleanup

Acceptance read:
- if `scroll -> shift-click` now works once the jump is gone, this phase can stay test-only
- if it still fails, the remaining selection bug is fixed here without reopening unrelated Browser behavior

Implementation prep:

Current strongest seam read:
- `src/app/panels/browserInteractions.ts` still looks structurally correct for range building because it slices over the full `browserTreeRows.contentRows`
- the likely first task in this phase is proving that `Bug 20.2` removed the only real blocker
- if range still fails, the remaining bug likely lives in selection-anchor truth or row targeting after scroll, not in Browser overflow or wheel forwarding

Locked in-scope:
- adding explicit `scroll -> shift-click` coverage
- fixing any remaining post-scroll range-selection bug only if it survives after `Bug 20.2`
- keeping this pass narrowly tied to explicit Browser selection truth

Locked out-of-scope:
- Browser FLIP redesign
- dock-scroll routing changes
- broader multi-select feature work unrelated to the bug repro

Concrete implementation targets:
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserInteractions.test.ts`

Ready-to-start verification:
- select anchor row, scroll Browser body, shift-click farther row, verify stable range
- verify same-screen shift-click behavior still works
- verify plain scroll plus plain click remains stable after any range-specific follow-up

### `[ ] Bug 20.4` - `Wheel Forwarding Validation`

Purpose:
- validate that docked Browser wheel forwarding is not still producing residual jump behavior after FLIP stabilization

Owns:
- rereading and testing `src/app/hosts/BrowserDockHost.tsx`
- confirming whether inner Browser-body scroll versus outer constrained-stack scroll still causes any visible jump
- applying the smallest follow-on fix only if wheel forwarding still contributes to the repro

Does not own:
- FLIP stabilization
- selection-anchor math changes
- Browser drag/drop work

Acceptance read:
- post-fix Browser scrolling feels stable in the docked shell
- no remaining jump is caused by the outer dock stack taking scroll unexpectedly during the repro

Implementation prep:

Current strongest seam read:
- `src/app/hosts/BrowserDockHost.tsx` forwards wheel input into `.BrowserPanelBody` first, then falls back to the outer constrained panel stack
- this seam is only worth changing if a residual docked-shell jump remains after `Bug 20.2`
- the safest posture is to validate it after FLIP stabilization rather than mixing both changes together

Locked in-scope:
- reproducing the docked-shell scroll path after `Bug 20.2`
- changing wheel forwarding only if it is still demonstrably contributing to the residual bug
- tightening dock-host tests if wheel routing behavior changes

Locked out-of-scope:
- Browser row selection math
- BrowserAnimatedContentRows FLIP logic
- Browser drag/drop or dock layout redesign

Concrete implementation targets:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

Ready-to-start verification:
- docked Browser scroll still prefers Browser-body scrolling
- outer dock stack does not unexpectedly steal scroll during the repro
- no residual Browser jump remains in the docked shell after the validation pass

### `[ ] Bug 20.5` - `Regression Lock`

Purpose:
- lock the repaired behavior with focused tests and final cleanup

Owns:
- final focused regression coverage for:
  - `scroll -> click`
  - `scroll -> shift-click`
  - intentional row motion on real structure transitions
- any small cleanup needed to keep the stabilization readable after the earlier passes land

Does not own:
- new Browser features
- broader Browser animation redesign

Acceptance read:
- the repaired behavior is covered by narrow Browser tests
- future Browser work is less likely to reintroduce the scroll-jump bug silently

Implementation prep:

Current strongest seam read:
- by this point the behavioral fix should already be landed
- this slice exists to consolidate focused tests and any tiny readability cleanup without reopening the repaired behavior
- it should only touch code paths already changed by `Bug 20.2` through `Bug 20.4`

Locked in-scope:
- adding final focused regression coverage
- removing any temporary or awkward test scaffolding introduced during the earlier slices
- small readability cleanup that does not alter Browser behavior

Locked out-of-scope:
- new Browser features
- new animation behaviors
- opportunistic Browser refactors unrelated to the bug family

Concrete implementation targets:
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserInteractions.test.ts`
- `src/app/hosts/BrowserDockHost.test.tsx`
- any tiny companion cleanup in `src/app/panels/browserTreeSections.tsx` or `src/app/hosts/BrowserDockHost.tsx` if needed

Ready-to-start verification:
- focused Browser test coverage exists for `scroll -> click`
- focused Browser test coverage exists for `scroll -> shift-click`
- focused coverage exists for intentional row motion on real structure transitions if still supported

## Suggested Fix Direction

The strongest first stabilization pass is:

1. Make sure Browser FLIP row animation does not fire after plain scroll.
2. Keep FLIP only for real Browser row layout transitions such as reorder, expand, collapse, or other intentional structure changes.
3. Add regression coverage for:
   - select anchor row
   - scroll Browser body
   - shift-click farther row
   - verify stable range selection and no row-jump glitch

## Verification Target

This bug should be considered fixed when:

- scrolling the Browser and then clicking one row does not make the Browser scroll or jump unexpectedly
- shift-click range select remains stable after Browser scroll
- clicking a row after scroll does not visually jump the Browser list
- the Browser no longer needs a few extra clicks to settle after scrolling
- existing intentional row motion still works for real Browser structure transitions

## Notes

This bug is a good candidate to track as a Browser FLIP stabilization issue before more grouped Browser reorganization work lands on top of the same panel behavior.

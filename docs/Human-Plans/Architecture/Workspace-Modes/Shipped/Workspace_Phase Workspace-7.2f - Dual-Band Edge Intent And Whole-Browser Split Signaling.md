# Workspace Phase Workspace-7.2f - Dual-Band Edge Intent And Whole-Browser Split Signaling

## Doc Header

### Doc History
2. 2026-03-31 16:20: Closed out this shipped `Workspace 7.2f` umbrella record after the landed dual-band split-preview proof plus four-side follow-through, so the Browser drag-language family now reads as complete and ready to move into `Workspace-Modes/Shipped/`
1. 2026-03-31 12:55: Re-homed the earlier `Workspace 7.2e-3` dual-band edge-intent follow-on into a dedicated `Workspace 7.2f` family and staged it as `7.2f-1` plus `7.2f-2` so the post-`7.2e` Browser drag-language cleanup now has its own explicit umbrella before the later `Workspace 7.3` widening

### Purpose

Use this follow-on to refine the Browser split-preview language again now that the first pane-local precision seam and the first nested-ghost work are already staged under `Workspace 7.2e`.

The goal is to give the user a more expressive edge gesture:
- one near-edge band should mean "split this hovered pane"
- one tighter final-edge band should mean "split the whole browser area"
- the ghost preview should communicate those two different outcomes clearly instead of flickering between two unrelated rectangle sources

## Doc Body

### Summary

`Workspace 7.2f` is the dual-band edge-intent split-preview family.

It should deliver:
- a wider outer edge band for the current good pane-local split preview
- a tighter inner edge band that intentionally escalates to a whole-browser split preview
- stable ghost selection when the cursor crosses from pane-local intent into whole-browser intent
- one explicit staging split so the right-edge proof can land before the full four-side and layering follow-through

Practical read:
- `7.2e-1` already proved cursor-driven pane-local preview precision
- `7.2e-2` already widened the preview language into richer directional suggestions
- this next family is about one specific UX complaint: the current edge overshoot fallback can look like two different preview systems fighting each other

### Locked Direction

`Workspace 7.2f` should be:
- a dual-band edge-intent clarification family
- a split-preview scope-signaling family
- a Browser-first drag-language refinement

`Workspace 7.2f` should not be:
- a new nested-ghost family
- a slot-lifecycle rewrite
- a broad multiple-viewport widening phase

### Scope

This follow-on covers:
- defining two explicit edge bands for Browser split previews
- making the outer band produce the current pane-local split ghost
- making the inner band produce a whole-browser split ghost
- making that same rule apply across all four directional sides once the proof cut is finished
- stabilizing preview behavior when the pointer moves just outside the hovered pane but is still clearly expressing edge intent
- making the whole-browser ghost render above viewport title bars so it visibly reads as a broader-scope action
- staging the work as one right-side proof first and one all-sides plus layering follow-through second

This follow-on does not cover:
- new nested directional-pair logic
- Browser toolbar ownership
- model-viewport runtime widening

### Progress Checklist

Current progress read:
- `7.2e-1` is shipped
- `7.2e-2` is shipped as the richer nested-preview lane
- `7.2f-1` is now shipped as the right-edge dual-band proof
- `7.2f-2` is now shipped as the four-side and layering follow-through
- `Workspace 7.2f` is now complete

- [x] Ship `Workspace 7.2f-1 - Dual-Band Edge Intent State And Right-Side Proof`
- [x] Ship `Workspace 7.2f-2 - Four-Side Expansion And Whole-Browser Ghost Layering`
- [x] Re-run the focused Browser dual-band split-preview bundle and mark `7.2f` complete

### Locked Outcome

At the end of `7.2f`:
- the user can control whether a drag should split just the hovered pane or the whole browser area by how deep they enter the edge band
- the ghost preview explains that scope change clearly
- the preview no longer looks like a bug when the cursor drifts outside the hovered pane
- whole-browser ghost previews visibly sit above viewport headers instead of disappearing behind them

### Current Code Read

Current likely seam:
- `BrowserDockHost` currently resolves a pane-local preview when the pointer still lands on a hovered slot
- once the pointer leaves that hovered pane but remains inside an overshoot tolerance, the preview can fall back to a broader viewport or browser rectangle
- that fallback currently looks like one incorrect second ghost instead of an intentional wider-scope action
- viewport headers currently sit above the lower-z ghost layer, so any future whole-browser preview that should span headers needs its own stronger layer than the pane-local ghost

Current supporting seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.test.tsx`

### First Implementation Cut

`Workspace 7.2f` should land in the smallest safe sequence:

1. ship `7.2f-1` so the dual-band state and right-side proof are explicit and stable
2. ship `7.2f-2` so the same rule widens to `left`, `top`, and `bottom` and the whole-browser ghost layers above viewport headers
3. re-run the focused Browser dual-band verification bundle and then mark `7.2f` complete

Implementation boundary:
- `7.2f-1` should end once one directional proof demonstrates stable pane-local versus whole-browser preview scope on the right edge
- `7.2f-2` should end once the same scope language feels reliable on all four sides and the whole-browser ghost visibly renders above viewport headers

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.2f` is done when:
- dragging Browser toward an edge first shows the pane-local ghost in the `28px -> 14px` band
- dragging deeper into that edge switches cleanly to a whole-browser ghost in the `14px -> 0px` band
- moving just outside the edge keeps the whole-browser ghost stable instead of snapping to a different accidental preview source
- the same rule holds for `left`, `right`, `top`, and `bottom`
- whole-browser previews visibly sit above viewport title bars

### Verification Shape

Focused verification should cover:
- right-edge pane-local to whole-browser transition
- left-edge pane-local to whole-browser transition
- top-edge pane-local to whole-browser transition
- bottom-edge pane-local to whole-browser transition
- stable whole-browser preview during immediate outside-edge overshoot
- whole-browser ghost overdraw above viewport title bars

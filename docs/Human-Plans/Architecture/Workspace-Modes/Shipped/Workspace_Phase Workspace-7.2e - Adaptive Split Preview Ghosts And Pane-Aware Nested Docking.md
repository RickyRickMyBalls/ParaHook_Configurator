# Workspace Phase Workspace-7.2e - Adaptive Split Preview Ghosts And Pane-Aware Nested Docking

## Doc Header

### Doc History
7. 2026-03-31 16:20: Closed out this shipped `Workspace 7.2e` umbrella record after the landed `7.2e-1` and `7.2e-2` split-preview work, so the pane-aware split-authoring family now reads as complete and ready to move into `Workspace-Modes/Shipped/`
6. 2026-03-31 12:55: Re-scoped the post-`7.2e-2` dual-band edge-intent follow-on out of this family and into the new `Workspace 7.2f` umbrella so `7.2e` now cleanly ends at pane-local precision plus adaptive nested ghost work before the later whole-browser split-scope signaling cleanup
5. 2026-03-31 12:38: Added the native `Workspace 7.2e-3` follow-on for dual-band edge-intent signaling so the `7.2e` family now has an explicit post-`7.2e-2` lane for turning the current unstable outside-edge preview fallback into an intentional pane-local-versus-whole-browser split scope model
4. 2026-03-31 11:51: Re-pointed the umbrella `Workspace 7.2e` phase to the newer fixed-direction interaction model so the follow-on no longer promises width/height-driven axis switching, and tightened the staging read so `7.2e-2` now means richer nested directional suggestions plus Browser-first preview cleanup on top of the shipped pane-local seam
3. 2026-03-31 11:18: Broke `Workspace 7.2e` into staged `7.2e-1` and `7.2e-2` subphase docs so the first cut now isolates cursor-driven pane-local four-way split-preview precision while the second cut holds the adaptive dual-ghost nested-split follow-on
2. 2026-03-31 11:17: Tightened this `Workspace 7.2e` follow-on so the first implementation cut is now explicitly the existing `top` / `right` / `bottom` / `left` split-preview cleanup, locking that preview selection should follow cursor position inside the hovered pane instead of the dragged window edge before the later adaptive dual-ghost nested-split follow-on
1. 2026-03-31 11:13: Added this native `Workspace 7.2e` follow-on doc to lock the next split-authoring vision around pane-aware drag targeting, adaptive dual ghost previews, and nested split suggestions that respond to the hovered pane geometry instead of only the outer viewport edges

### Purpose

Use this follow-on to make viewport split previews feel local to the pane the user is actually targeting instead of only reacting to the outer model-viewport frame.

The goal is to make drag-to-split behavior feel smarter and more forgiving:
- top, right, bottom, and left split targeting should key off the hovered target pane
- nested split suggestions should appear when the pointer is already inside an existing split pane
- the ghost preview should stay inside one standard `top` / `right` / `bottom` / `left` directional model instead of silently changing meaning from pane shape

## Doc Body

### Summary

`Workspace 7.2e` is the adaptive split-preview and pane-aware nested-docking cut.

It should deliver:
- easier edge targeting for top, right, bottom, and left splits because preview detection uses the hovered pane rectangle instead of only the dragged window or whole viewport frame
- nested split ghost previews that can offer two choices inside an already split pane
- richer nested suggestions that still preserve fixed directional split semantics
- a reusable preview contract that Browser can prove first and other floating tool surfaces can follow

Practical read:
- the current slot system can already split and rehome surfaces
- the remaining UX gap is that the split ghost still feels global and edge-only
- the first concrete task should now be cleaning up the existing `top` / `right` / `bottom` / `left` preview so it follows cursor position inside the hovered pane before the later adaptive nested-ghost enrichment
- that first task now belongs to `7.2e-1`, while the richer adaptive dual-ghost nested-split work belongs to `7.2e-2`
- this phase should enrich preview targeting before the heavier `Workspace 7.3` multi-viewport widening

### Locked Direction

`Workspace 7.2e` should be:
- a split-preview authoring upgrade
- a pane-aware drag-targeting upgrade
- a nested split-suggestion upgrade
- a Browser-first but reusable floating-surface polish cut

`Workspace 7.2e` should not be:
- a multiple-model-viewport phase
- a broad slot-lifecycle rewrite
- a generic merge/join/close-slot feature pass
- a visual-only ghost restyle with no targeting logic change

Important staging read:
- `7.2e-1` should prove cursor-driven pane-local precision for the existing four-way split preview
- `7.2e-2` should then widen that seam into adaptive dual ghost nested suggestions
- the later dual-band edge-intent scope signaling cleanup now belongs to `Workspace 7.2f`

### Scope

This follow-on covers:
- changing split preview detection so it keys off the hovered candidate pane rectangle
- making top-edge targeting work against the hovered pane instead of forcing the pointer all the way to the top of the dragged Browser window or the wrong global frame
- showing two nested split ghost previews when the pointer is over an already split pane that can accept a further subdivision
- keeping those nested ghost suggestions inside the normal `top` / `right` / `bottom` / `left` split language
- using pane geometry only to help presentation feel local, not to remap what the split directions mean
- proving the first pass with Browser floating-host drag behavior while shaping the helper so `Spaghetti Editor` and similar floating surfaces can reuse it later
- adding focused tests for nested split preview targeting and dual-ghost selection

This follow-on does not cover:
- true multiple `Model Viewport` runtime support, which still belongs to `Workspace 7.3`
- arbitrary quadrant or freeform docking
- slot duplicate, close, merge, or join actions
- final animation polish beyond what is needed to make the new ghost behavior clear

### Progress Checklist

Current progress read:
- `Workspace 7.1` through `7.2d` already proved the slot tree, host-mode parity, and Browser toolbar-owner cleanup direction
- `7.2e-1` is now the shipped pane-local precision seam for the existing `left` / `right` / `top` / `bottom` preview
- `7.2e-2` is now shipped as the nested-suggestion follow-on for richer directional ghost behavior
- `Workspace 7.2e` is now complete

- [x] Ship `Workspace 7.2e-1 - Cursor-Driven Pane Split Preview Precision`
- [x] Ship `Workspace 7.2e-2 - Adaptive Dual Ghost Nested Split Suggestions`
- [x] Re-run the focused pane-aware split-preview bundle and mark `7.2e` complete

### Locked Outcome

At the end of `7.2e`:
- dragging a floating Browser toward a split target should feel like the target pane is inviting the drop
- top, right, bottom, and left previews should appear relative to the pane under the pointer
- hovering an existing split pane should be able to offer two richer nested directional ghosts without changing what `top`, `right`, `bottom`, or `left` mean
- the drag-preview system should feel like one reusable pane-aware authoring layer instead of a set of global edge thresholds

Staging outcome:
- `7.2e-1` owns the first pane-local four-way precision seam
- `7.2e-2` owns the adaptive nested dual-ghost enrichment on top of that seam

### Current Code Read

Current shipped seam:
- Browser and Spaghetti floating-host drag previews still derive split intent from one edge-threshold read against a single rectangle
- the ghost renderer still assumes one preview side at a time
- nested pane-aware suggestions are not yet modeled as first-class preview candidates

Main remaining residue:
- the first existing split-preview choice can still feel anchored to the dragged window edge more than the cursor location within the hovered pane
- dragging Browser to `Split Top` can still feel like the pointer has to travel to the wrong top edge
- hovering an already split pane cannot yet branch into two sensible nested split suggestions
- the ghost system still communicates one coarse outer drop zone instead of one local pane authoring decision

Current supporting seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2d-2 - Browser Toolbar Claim And Rehoming Parity.md`

Current code seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2e - Question 1 - What is the main bug this phase is trying to remove?

##### Locked Answer
- split preview targeting currently feels tied to the wrong rectangle
- the user should be targeting the hovered pane, not the dragged Browser frame and not only the outer model viewport bounds

##### Why
- that is the root of the "I have to move all the way to the top of the Browser" problem
- the ghost should answer "where inside this pane would the drop go?" instead of "which outer edge is nearest?"

#### [x] Workspace 7.2e - Question 2 - What rectangle should control split-preview detection?

##### Locked Answer
- the candidate hovered pane rectangle should control preview detection
- the outer viewport rectangle should only be a fallback when no more specific pane target exists

##### Why
- split authoring becomes intuitive only when the preview is local to the pane the user is over
- this lets top, right, bottom, and left mean the same thing no matter how deep the split tree already is

#### [x] Workspace 7.2e - Question 3 - When should the UI show two ghost previews instead of one?

##### Locked Answer
- when the pointer is over an already split pane that can accept a nested split, the UI should be allowed to show two local ghost options instead of one coarse global edge preview

##### Why
- the user is no longer just choosing one outer edge of the whole viewport
- they are choosing how to further subdivide a specific pane

#### [x] Workspace 7.2e - Question 4 - How should the first adaptive axis decision work?

##### Locked Answer
- do not let hovered-pane width and height change the meaning of the split directions
- keep nested suggestions inside the same fixed `top` / `right` / `bottom` / `left` language as the base preview system
- pane geometry may still influence visual emphasis later, but it should not silently remap the split axis

##### Why
- this keeps the drag language predictable
- it avoids teaching users that the same gesture means something different in wide versus tall panes

#### [x] Workspace 7.2e - Question 5 - What should the first implementation prove first?

##### Locked Answer
- prove that the existing `top` / `right` / `bottom` / `left` split-preview choice follows cursor position inside the hovered pane during floating Browser drag behavior first
- only after that first cleanup should this phase widen into adaptive dual ghost nested-split suggestions
- shape the preview helper so `Spaghetti Editor` and similar floating surfaces can adopt the same logic after the Browser proof

##### Why
- Browser is the concrete pain point driving this phase
- this lets the first cut stay small, visible, and directly tied to the current precision problem
- the code should still avoid locking the smarter preview logic into Browser-only helpers if the same seam already exists in other floating hosts

#### [x] Workspace 7.2e - Question 7 - Should this phase be staged as subphases?

##### Locked Answer
- yes
- `7.2e-1` should isolate cursor-driven pane-local precision for the existing four-way split preview
- `7.2e-2` should isolate adaptive dual ghost nested-split suggestions on top of that first seam

##### Why
- the first precision cleanup is already valuable by itself
- the richer nested suggestion behavior is a second layer that should not block the smaller fix

#### [x] Workspace 7.2e - Question 6 - What should stay out of scope so this phase does not become `7.3` early?

##### Locked Answer
- do not widen into true multiple `Model Viewport` support
- do not redesign the whole slot tree model
- do not add slot merge/join/duplicate lifecycle actions here

##### Why
- this phase is about smarter split authoring within the current viewport-slot system
- `Workspace 7.3` still owns the heavier runtime widening

### Important Interfaces And Types To Lock

- split preview resolution helpers
  - should be able to resolve against a candidate pane rectangle instead of only a global viewport rectangle
- split preview state
  - should be able to express more than one local ghost candidate when nested pane suggestions are active
- split-drop application
  - should still end in the same concrete `top`, `right`, `bottom`, or `left` slot split action once the user commits

Important rule:
- enrich preview authoring
- keep the actual split-commit language stable as `top`, `right`, `bottom`, and `left`

### First Implementation Cut

`Workspace 7.2e` should land in the smallest safe sequence:

1. ship `7.2e-1` so the existing `left` / `right` / `top` / `bottom` split preview becomes cursor-driven and pane-local
2. ship `7.2e-2` so already split panes can offer adaptive dual ghost nested suggestions
3. re-run the focused pane-aware split-preview bundle and then mark `7.2e` complete

Implementation boundary:
- `7.2e-1` should end once the existing four-way split preview behaves like a cursor-driven pane-local target instead of a dragged-window-edge guess
- `7.2e-2` should end once adaptive nested dual ghost suggestions feel reliable on top of that seam
- the full `7.2e` phase should end once pane-aware split previews and adaptive nested ghost suggestions feel reliable in the current one-primary-viewport slot model
- `Workspace 7.3` should begin where multiple model viewport runtime widening becomes the dominant concern

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.2e` is done when:
- the first existing four-way split preview feels precise because it follows cursor position inside the hovered pane
- dragging a floating Browser toward the top of a hovered pane no longer requires chasing the wrong top edge
- nested hovered panes can show richer directional ghost suggestions without width/height-driven semantic flips
- nested ghost suggestions commit to the expected slot split without creating unrelated extra Browser surfaces
- the split-preview system reads like one pane-aware authoring layer instead of one outer-viewport edge hack

### Verification Shape

Focused verification should cover:
- Browser `left` / `right` / `top` / `bottom` split-preview selection resolves from cursor position inside the hovered pane
- Browser top-split preview resolves against the hovered pane
- nested ghost suggestions stay inside the standard `top` / `right` / `bottom` / `left` language
- nested split previews still commit to the expected slot and do not disturb unrelated slots
- the same pane-aware preview helper can be reused by the other floating host that still relies on the old edge-threshold pattern

Recommended manual checks:
- drag a floating Browser slowly across one hovered pane and confirm the existing four split previews switch when the cursor crosses the pane's own left/right/top/bottom targeting regions instead of the dragged window edge
- split the viewport horizontally, drag a floating Browser over the top pane, and confirm the ghost can target that pane's local top edge without chasing the Browser title bar
- drag across already split panes of different shapes and confirm the richer nested suggestions never change what `top`, `right`, `bottom`, or `left` mean

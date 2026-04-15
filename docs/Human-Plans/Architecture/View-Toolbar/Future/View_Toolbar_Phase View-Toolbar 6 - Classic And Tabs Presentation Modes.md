# View Toolbar Phase View-Toolbar 6 - Classic And Tabs Presentation Modes

## Doc Header

### Doc History
1. 2026-04-14 23:40:00: Created this standalone future phase doc for `View-Toolbar 6`, giving expanded-state presentation modes a dedicated planning home around retaining the current stacked layout as `Classic` and adding a new left-tabbed `Tabs` mode without inventing separate command behavior

### Purpose

This doc locks the sixth `View-Toolbar` phase.

Use it to answer:
- how the expanded `View` toolbar should keep the current layout as `Classic`
- how a new `Tabs` presentation mode should work without changing command ownership
- which sections should appear in the left tab rail first
- how the alternate layout should stay viewport-local and persist honestly
- how to use a DCC-style left-tab pattern without blindly copying another app's shell

### Why This Phase Exists

The current `View` toolbar is one stacked vertical surface.

That is still useful and should remain available.
But once the toolbar grows taller and denser, layout polish alone does not solve the next usability question:
- some users want the full stacked toolbar
- some users want one focused section at a time

This phase exists to treat that as a presentation problem, not a command-ownership problem.

The goal is not to create a second toolbar with different behavior.
The goal is to keep the current expanded layout as `Classic`, then add a second expanded presentation called `Tabs` where a left-side tab rail selects which section body is shown in one shared content area.

### Scope

This phase covers:
- expanded-state toolbar presentation modes
- keeping the current expanded stacked layout as `Classic`
- adding a `Tabs` mode with a left-side tab rail and one content area
- viewport-local persistence for the chosen expanded presentation
- section-selection behavior and first-tab ordering
- layout/readability guidance for the tab rail and content pane

This phase does not cover:
- new camera, fly, transform, snap, gizmo, or materials behavior
- new console grammar
- replacing the shared `collapsed / essentials / expanded` density language
- moving toolbar ownership out of `ViewToolbar.tsx`

## Doc Body

## [ ] - `View-Toolbar 6` - `Classic And Tabs Presentation Modes`

### Header

Purpose:
- let the expanded `View` toolbar support both the existing full stacked layout and a new focused tabbed layout without forking command behavior

Owns:
- `Classic` versus `Tabs` presentation naming
- left-tabbed expanded layout behavior
- viewport-local remembered presentation choice
- first tab-set definition and content-pane rules

Keeps elsewhere:
- command ownership
- new feature families
- toolbar density-mode rules

### Target Result

At the end of this phase:
- the current expanded `View` toolbar still exists as `Classic`
- the user can switch the expanded toolbar into `Tabs`
- `Tabs` uses a left-side rail for top-level sections and a single right content pane
- changing tabs only changes presentation, not meaning
- the chosen presentation is remembered per viewport
- the full toolbar still has one clear scroll owner instead of splitting into competing nested scroll boxes

### Suggestions / Decisions

#### [ ] q1 - Should the current expanded stacked layout stay available?

Question:
- once `Tabs` exists, should the current stacked expanded layout be replaced or kept?

Suggestion:
- keep it
- rename the current expanded layout to `Classic`
- make `Classic` the default first shipped presentation so the new mode is additive rather than disruptive

Reason:
- the current layout already works
- it is the safest fallback when later sections widen
- removing it would turn a layout option into a migration risk

#### [ ] q2 - Is `Tabs` a density mode or a separate presentation mode?

Question:
- should `Tabs` replace the repo's existing toolbar density language?

Suggestion:
- no
- treat `Tabs` as an expanded-state presentation mode, not a density mode

Important rule:
- do not overload `collapsed / essentials / expanded`
- `Classic` versus `Tabs` should describe how expanded content is arranged, not how much content exists

#### [ ] q3 - Which sections should the first tab rail include?

Question:
- should the first tabs pass include every current top-level section immediately, or prove the layout on a smaller first set?

Suggestion:
- start with the sections the user reaches most as active tools/settings:
  - `Camera`
  - `Fly Mode`
  - `Transform`
- include `Snap` in the first pass if it fits cleanly beside `Transform`
- widen to `Gizmo`, `View`, `Environment`, and `Materials` only once the shared tab-content seam is stable

Reason:
- this keeps the first cut honest and useful
- it avoids forcing the largest editor-style sections into the new layout before the shell proves itself

#### [ ] q4 - Should the active tab be remembered per viewport?

Question:
- when a viewport is using `Tabs`, should it reopen to the previously selected tab?

Suggestion:
- yes
- remember the last active tab per viewport

Important rule:
- tab selection should stay viewport-local just like other local `View` toolbar chrome state

#### [ ] q5 - How literally should the Blender-style tab look be copied?

Question:
- should the new left tab rail copy the attached DCC panel style exactly?

Suggestion:
- borrow the interaction pattern, not the exact skin
- keep ParaHook typography, spacing, and chrome language
- prefer readable text-first tab buttons over tiny stylized imitation tabs

Reason:
- the layout inspiration is useful
- a pixel-faithful clone would fight the existing ParaHook toolbar style

### Implementation Spec

This phase should:
- keep the current expanded stacked layout as `Classic`
- add a new expanded presentation named `Tabs`
- expose one visible way to switch between those two expanded presentations
- keep the current closed toolbar behavior unchanged
- keep the toolbar mounted in the same viewport-local host chain
- keep one shared command/render ownership seam for each section

#### Presentation Model

Suggested model:
- closed toolbar state remains the current collapsed shell behavior
- open toolbar state gains one expanded presentation choice:
  - `Classic`
  - `Tabs`

Suggested state naming:
- `viewToolbarExpandedPresentationMode: 'classic' | 'tabs'`

Important rule:
- do not create separate per-mode command implementations
- `Classic` and `Tabs` must be two layouts over the same underlying section content

#### Tabs Layout

`Tabs` should:
- place a vertical tab rail on the left side of the expanded toolbar body
- place one section content pane on the right
- show only the currently selected section body in that content pane
- keep the toolbar title bar and outer shell consistent with the existing `View` toolbar

Suggested first tab order:
1. `Camera`
2. `Fly Mode`
3. `Transform`
4. `Snap` if included in the first cut

Later widening candidates:
5. `Gizmo`
6. `View`
7. `Environment`
8. `Materials`

#### Shared Section Ownership

Important rule:
- do not duplicate the `Camera`, `Fly Mode`, or `Transform` UI in two unrelated JSX trees

This phase should prefer:
- shared section renderer helpers
- shared section content components
- or another single-owner rendering seam

So that:
- `Classic` can render the same section bodies in stacked order
- `Tabs` can render the same section bodies one at a time in the content pane

#### Scroll And Height Rules

Important rule:
- keep `.ViewToolbarRoot` as the primary vertical scroll owner for the toolbar shell
- do not create a confusing parent-and-child scroll fight between the whole toolbar and the tab content pane unless a later narrower phase proves that split is necessary

Suggested behavior:
- the left tab rail remains fixed inside the toolbar body
- the content pane scrolls only as part of the existing toolbar body contract, or through one clearly owned inner seam if the current shell cannot support truthful content scrolling any other way

Guardrail:
- do not let `Tabs` undo the already-landed viewport clamp and overflow work

#### Persistence

This phase should:
- store the chosen expanded presentation per viewport
- store the active tab per viewport when `Tabs` is selected
- fall back safely to `Classic` if the remembered tab is no longer available

#### Interaction Rules

This phase should:
- keep all existing button, slider, and select behavior identical between `Classic` and `Tabs`
- keep console alignment unchanged
- avoid mode-specific labels that imply different command meaning
- allow the user to switch back to `Classic` at any time without losing underlying view state

### Suggested Rollout

Suggested order:
1. Keep the current expanded layout and name it `Classic`.
2. Add viewport-local presentation state for `Classic` versus `Tabs`.
3. Extract shared render seams for `Camera`, `Fly Mode`, and `Transform`.
4. Add the left tab rail plus single content pane for those first sections.
5. Persist the active tab per viewport.
6. Only then widen the tab rail to later sections if the first cut feels honest and stable.

### Acceptance Shape

This phase is done when:
- the current expanded toolbar is still available as `Classic`
- `Tabs` is available as an alternate expanded presentation
- the left tab rail selects which section body appears in one content area
- `Camera`, `Fly Mode`, and `Transform` work through the same underlying controls in both presentations
- the choice of `Classic` versus `Tabs` is remembered per viewport
- the already-landed toolbar clamp/overflow behavior still works
- the phase improves navigation and focus without inventing new command behavior

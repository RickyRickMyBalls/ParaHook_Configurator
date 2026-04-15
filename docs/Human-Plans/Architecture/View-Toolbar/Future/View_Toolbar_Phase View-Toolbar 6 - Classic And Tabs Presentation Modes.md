# View Toolbar Phase View-Toolbar 6 - Classic And Tabs Presentation Modes

## Doc Header

### Doc History
4. 2026-04-15 00:18:00: Prepped `View-Toolbar 6 / Phase 1 - Expanded Presentation State And Classic Naming` for implementation by grounding it in the live `ViewToolbar.tsx`, `workspaceShellTypes.ts`, `useWorkspaceStore.ts`, `workspacePersistence.ts`, and focused workspace/toolbar tests, then locking the first cut to one viewport-local state seam plus persistence without any visible layout change yet
3. 2026-04-15 00:10:00: Broke `View-Toolbar 6` into a small internal phase ladder with one Codex-sized slice per `##` section, separating the work into presentation-state groundwork, `ParaSelect`, right-click menu, first shared tab-shell extraction, and later persistence/widening follow-ons
2. 2026-04-15 00:00:00: Expanded `View-Toolbar 6` so the presentation-mode switch is now explicitly owned in two user-facing places: one `ParaSelect` inside the `View` subsection and one expanded-toolbar right-click menu with `Classic` and `Tabs` choices, keeping both routes mapped onto the same viewport-local presentation state
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
- the visible switch surfaces for choosing `Classic` versus `Tabs`
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
- the visible `Classic` versus `Tabs` switch controls
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
- include all current top-level `View` toolbar sections in `Tabs`
- keep the ordering readable and stable instead of shipping a partial tab set first

Reason:
- `Tabs` is meant to be a real alternate presentation for the full `View` toolbar
- hiding some sections in `Tabs` would make it feel like a reduced mode instead of an alternate layout

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

### Internal Phase Ladder

This phase should ship in a few small cuts that Codex can complete one by one without widening into a giant toolbar rewrite.

Shared rule for every subphase:
- keep the current closed-toolbar behavior unchanged
- keep the toolbar mounted in the same viewport-local host chain
- do not fork command behavior between `Classic` and `Tabs`
- keep the already-landed clamp and overflow contract honest

## [ ] Phase 1 - Expanded Presentation State And Classic Naming

Purpose:
- create the viewport-local presentation seam that lets expanded `View` toolbar layout switch between `Classic` and `Tabs`

Owns:
- naming the current expanded stacked layout `Classic`
- adding one viewport-local expanded presentation state
- defining the default fallback behavior

Does not own:
- visible switching UI
- right-click menu behavior
- tab rail layout
- active-tab persistence
- any visible `Tabs` rendering yet

This phase should:
- keep the current stacked expanded layout behavior exactly as-is
- name that behavior `Classic`
- add one viewport-local state seam such as:
  - `viewToolbarExpandedPresentationMode: 'classic' | 'tabs'`
- default existing toolbars to `classic`
- ensure the toolbar still renders the current layout when no later `Tabs` UI exists yet

Why first:
- every later slice needs one real source of truth for presentation mode
- this is the smallest structural cut that does not visibly disrupt the current toolbar

### Current Live Read

Current state/storage seam:
- `src/app/workspace/workspaceShellTypes.ts`
  - `WorkspaceViewportLocalViewState` currently includes:
    - `projectionMode`
    - `axisOverlayEnabled`
    - `viewToolbarOpen`
    - `viewToolbarCompactAxisWidgetSize`
    - `viewToolbarExpandedAxisWidgetSize`
    - `viewportResultMode`
  - `createDefaultWorkspaceViewportLocalViewState()` currently has no presentation field yet
- `src/app/workspace/useWorkspaceStore.ts`
  - `setViewportLocalViewState(...)` already merges patches onto one viewport-local state object through `createDefaultWorkspaceViewportLocalViewState()`
  - this is already the right owner seam for a future `classic` versus `tabs` value
- `src/app/workspace/workspacePersistence.ts`
  - currently normalizes/persists the existing local view-state fields one by one
  - any new presentation field must be added here or it will disappear across saved layout round-trips

Current toolbar read seam:
- `src/app/components/ViewToolbar.tsx`
  - already reads `localViewState` from `useWorkspaceStore(...)`
  - already derives `viewToolbarOpen`, `viewToolbarCompactAxisWidgetSize`, and `viewToolbarExpandedAxisWidgetSize` from that local state
  - does not yet read any expanded presentation mode
  - still renders only the current stacked expanded layout, which should become `Classic`

Current proof seams:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves that toolbar open state stays viewport-local per model viewport
- `src/app/workspace/useWorkspaceStore.test.ts`
  - already proves per-viewport local view state stays separate
  - already proves local viewport state survives serialize/normalize round-trips

### Locked Direction

#### 1. Make Presentation Mode Viewport-Local

Important rule:
- the new presentation field belongs in `WorkspaceViewportLocalViewState`
- do not put `Classic` versus `Tabs` into global UI prefs

Reason:
- the `View` toolbar is already mounted per viewport and already owns viewport-local chrome state

#### 2. Default To `classic`

Important rule:
- old layouts and fresh sessions should resolve to `classic`
- do not require migration logic that guesses a prior user choice

Reason:
- `Classic` is the current visible behavior, so it is the safest zero-surprise fallback

#### 3. No Visible Layout Change In Phase 1

Important rule:
- do not start rendering the `Tabs` shell in this phase
- do not add the `ParaSelect` in this phase
- do not add the right-click presentation menu in this phase

Reason:
- `Phase 1` should only create the state seam and persistence truth the later UI slices will depend on

#### 4. Keep Existing Open-State Ownership Intact

Important rule:
- do not collapse `viewToolbarOpen` into the new presentation field
- `viewToolbarOpen` should keep meaning "is the toolbar open"
- the new field should only answer "when open, is expanded presentation `classic` or `tabs`"

Reason:
- mixing open/closed state with presentation choice would widen the migration and test surface too early

### Suggested State Shape

Suggested field:
- `viewToolbarExpandedPresentationMode: 'classic' | 'tabs'`

Suggested default:
- `classic`

Suggested first rendering read:
- `ViewToolbar.tsx` may read the field in this phase if useful, but it should continue rendering the current stacked layout regardless

### Expected File Targets

Primary runtime files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspacePersistence.ts`

Possible supporting runtime file:
- `src/app/components/ViewToolbar.tsx`

Primary proof files:
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/components/ViewToolbar.test.tsx`

No-widening rule:
- do not touch toolbar section JSX beyond what is needed to keep the current layout reading as `Classic`
- do not touch `viewport-overlay.css`
- do not touch `viewerBridge.ts`, `Viewer.ts`, or command semantics

### Verification Bar

This phase is only done if it proves all of the following:
- `WorkspaceViewportLocalViewState` includes one expanded presentation field
- the default local view state resolves that field to `classic`
- `setViewportLocalViewState(...)` keeps the new field viewport-local without disturbing existing toolbar state
- serialized and normalized workspace layout data preserves the new field
- the current toolbar still renders the same stacked expanded layout by default
- no visible `Tabs` UI appears yet

Required proof:
- widen `src/app/workspace/useWorkspaceStore.test.ts` so one secondary model viewport can store a non-default presentation mode without affecting the primary viewport
- widen the existing serialize/normalize proof in `src/app/workspace/useWorkspaceStore.test.ts` so the new field survives persistence round-trips
- optionally widen `src/app/components/ViewToolbar.test.tsx` only enough to show the toolbar still opens and reads its existing viewport-local shell state normally after the new field is added

### Suggested Implementation Order

1. Add `viewToolbarExpandedPresentationMode` to `WorkspaceViewportLocalViewState`.
2. Add the default `classic` value in `createDefaultWorkspaceViewportLocalViewState()`.
3. Extend persisted layout normalization in `workspacePersistence.ts` so the field round-trips safely.
4. Widen `useWorkspaceStore.test.ts` to prove viewport-local separation plus persistence of the new field.
5. Only touch `ViewToolbar.tsx` if needed to read or tolerate the field while preserving the current stacked layout.

Done when:
- the current expanded toolbar is explicitly modeled as `Classic`
- one viewport-local presentation field exists
- current behavior is unchanged if the presentation remains `classic`

## [ ] Phase 2 - View Section ParaSelect For Presentation

Purpose:
- add the first visible user-facing switch surface for `Classic` versus `Tabs`

Owns:
- one `ParaSelect` inside the `View` subsection
- wiring that `ParaSelect` to the shared presentation state

This phase should:
- add one `ParaSelect` to the `View` subsection
- use:
  - label: `Presentation`
  - options: `Classic`, `Tabs`
- make the `ParaSelect` read and write the shared viewport-local presentation state
- keep the rest of the toolbar layout unchanged

Does not own:
- right-click context menu
- visible tab rail layout
- active-tab persistence

Important rule:
- this `ParaSelect` must not introduce its own local-only presentation state

Done when:
- the `View` subsection exposes `Presentation`
- choosing `Classic` or `Tabs` updates the shared presentation state
- no behavior forks exist yet beyond the presentation-state seam

## [ ] Phase 3 - Expanded Toolbar Right-Click Presentation Menu

Purpose:
- add the second switch surface so the expanded toolbar can change presentation from its shell chrome as well as from the `View` subsection

Owns:
- expanded-toolbar right-click menu entries for `Classic` and `Tabs`
- syncing that menu with the same shared presentation state used by the `ParaSelect`

This phase should:
- add right-click menu behavior to the expanded `View` toolbar shell
- expose:
  - `Classic`
  - `Tabs`
- show active presentation truth in the menu through selected or disabled state
- update the same viewport-local presentation state the `ParaSelect` uses
- keep collapsed-toolbar behavior unchanged

Does not own:
- the left tab rail
- shared section extraction
- active-tab persistence

Important rule:
- the right-click menu is an alternate entry point, not a second owner seam

Done when:
- right-clicking the expanded toolbar shows `Classic` and `Tabs`
- choosing either entry updates the same state as the `ParaSelect`
- the `ParaSelect` reflects the menu change immediately

## [ ] Phase 4 - First Tabs Shell For Camera, Fly Mode, And Transform

Purpose:
- prove the real `Tabs` layout as a full alternate presentation for the current top-level `View` toolbar sections without duplicating section behavior

Owns:
- the left-side tab rail
- one shared content pane
- tabbed rendering for all current top-level `View` toolbar sections
- the shared section-rendering seam needed to support both presentations

This phase should:
- keep `Classic` rendering the current stacked section bodies
- add `Tabs` rendering with:
  - left vertical tab rail
  - right content pane
- show only one selected section body at a time in `Tabs`
- reuse one underlying section owner for the current top-level sections:
  - `Camera`
  - `Fly Mode`
  - `Transform`
  - `Snap`
  - `Gizmo`
  - `View`
  - `Environment`
  - `Materials`

Suggested tab order:
1. `Camera`
2. `Fly Mode`
3. `Transform`
4. `Snap`
5. `Gizmo`
6. `View`
7. `Environment`
8. `Materials`

Does not own:
- remembered active-tab persistence
- later visual polish beyond what the first shell needs

Important rule:
- do not duplicate section behavior into separate `Classic` and `Tabs` JSX trees with diverging logic

Done when:
- `Tabs` is a real alternate presentation
- the left tab rail exposes all current top-level `View` toolbar sections
- those sections still behave exactly the same as in `Classic`

## [ ] Phase 5 - Active Tab Persistence And Honest Widening Follow-On

Purpose:
- finish the first `Tabs` pass with remembered active-tab behavior and define the rule for later section growth if new top-level `View` toolbar sections are added in the future

Owns:
- viewport-local remembered active tab for `Tabs`
- safe fallback behavior when a remembered tab is unavailable
- the rule for onboarding any future new top-level sections into `Tabs`

This phase should:
- store the active selected tab per viewport while `Tabs` is in use
- reopen `Tabs` to the remembered tab when practical
- fall back safely to `Camera` or `Classic` if the remembered tab no longer exists
- define the rule that future new top-level `View` toolbar sections should also appear in `Tabs` unless there is one explicit reason they cannot fit honestly

Does not own by default:
- deeper visual redesign of the tab skin

Important rule:
- do not let future section growth land in `Classic` only and silently leave `Tabs` incomplete

Done when:
- `Tabs` remembers the selected tab per viewport
- fallback behavior is explicit and safe
- the follow-on rule for any newly added top-level section is clear without forcing a new immediate widening cut

### Acceptance Shape

This phase is done when:
- the current expanded toolbar is still available as `Classic`
- `Tabs` is available as an alternate expanded presentation
- the `View` subsection contains a `ParaSelect` for `Classic` versus `Tabs`
- right-clicking the expanded toolbar exposes `Classic` and `Tabs`
- the left tab rail selects which section body appears in one content area
- all current top-level `View` toolbar sections work through the same underlying controls in both presentations
- the choice of `Classic` versus `Tabs` is remembered per viewport
- the already-landed toolbar clamp/overflow behavior still works
- the phase improves navigation and focus without inventing new command behavior

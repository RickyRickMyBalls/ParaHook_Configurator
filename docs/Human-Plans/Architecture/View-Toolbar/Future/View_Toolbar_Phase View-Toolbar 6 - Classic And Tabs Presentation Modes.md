# View Toolbar Phase View-Toolbar 6 - Classic And Tabs Presentation Modes

## Doc Header

### Doc History
13. 2026-04-17 18:51:52: Added `Phase 8 - Outside Tab Rail And Attached Shell Chrome` as a new standalone later planning lane, reopening `View-Toolbar 6` so the next `Tabs` shell cleanup now has one explicit home for moving the section rail outside the main toolbar box and making the active section chrome read like real attached tabs instead of interior buttons inside the panel shell
12. 2026-04-15 08:41:00: Cleaned up the doc after implementation, marking `Phase 5`, `Phase 6`, and `Phase 7` complete, adding result/completion reads for each, and marking the parent `View-Toolbar 6` phase complete now that the shipped `Classic`, `Tabs`, remembered tab, polished vertical rail, and top-right cluster dock work are all landed
11. 2026-04-15 08:19:00: Prepped `Phase 7 - Top-Right Dock Cluster For Gizmo And View Toolbar` for implementation by grounding it in the live `AxisWidget`, `RightDock`, and HUD offset seams, then locking the first cut to a viewport-local dock mode that preserves the current below-axis layout as a fallback while adding a new expanded top-right cluster mode with `gizmo | view toolbar` order
10. 2026-04-15 08:05:00: Added `Phase 7 - Top-Right Dock Cluster For Gizmo And View Toolbar`, framing the next follow-on as a shared top-right cluster layout pass rooted in the existing `RightDock`, `RightPanelStack`, and viewport-HUD offset seams instead of a `ViewToolbar`-only hack
9. 2026-04-15 07:31:00: Added `Phase 6 - Polish And Cleanup` as a post-Phase-5 follow-on bucket, with the first explicit polish task being to rotate the left tab labels so they read vertically bottom-up instead of horizontally left-to-right
8. 2026-04-15 07:22:00: Marked `View-Toolbar 6 / Phase 4 - Full Tabs Shell For All Current Sections` complete after `ViewToolbar.tsx` gained a real `Tabs` presentation with a left rail, one content pane, and shared section-body ownership for all current top-level sections, then prepped `Phase 5` for implementation by grounding it in the current component-local active-tab seam and the already-landed viewport-local presentation persistence
7. 2026-04-15 00:55:00: Marked `View-Toolbar 6 / Phase 3 - Expanded Toolbar Right-Click Presentation Menu` complete after the expanded toolbar shell gained a viewport-local `Classic` / `Tabs` right-click menu that syncs with the `Presentation` `ParaSelect`, then prepped `Phase 4` for implementation by grounding the tabbed-shell work in the live `ViewToolbar.tsx` section stack, the existing single-scroll contract, and the focused toolbar test seam
6. 2026-04-15 00:47:00: Marked `View-Toolbar 6 / Phase 2 - View Section ParaSelect For Presentation` complete after the `View` subsection gained a viewport-local `Presentation` `ParaSelect` for `Classic` versus `Tabs`, then prepped `Phase 3 - Expanded Toolbar Right-Click Presentation Menu` for implementation by grounding it in the live `ViewToolbar.tsx` shell plus the existing `SpaghettiContextMenu` title-bar context-menu pattern
5. 2026-04-15 00:40:00: Marked `View-Toolbar 6 / Phase 1 - Expanded Presentation State And Classic Naming` complete after the groundwork pass added viewport-local `viewToolbarExpandedPresentationMode` state with `classic` default plus workspace-persistence round-trip proof, then prepped `Phase 2 - View Section ParaSelect For Presentation` for implementation by grounding it in the live `ViewToolbar.tsx` `View` section and focused toolbar tests
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
- in `Tabs`, the section rail sits outside the main toolbar box so the active section reads like attached tab chrome instead of an interior button strip
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

## [x] Phase 1 - Expanded Presentation State And Classic Naming

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
  - `WorkspaceViewportLocalViewState` now includes:
    - `projectionMode`
    - `axisOverlayEnabled`
    - `viewToolbarOpen`
    - `viewToolbarExpandedPresentationMode`
    - `viewToolbarCompactAxisWidgetSize`
    - `viewToolbarExpandedAxisWidgetSize`
    - `viewportResultMode`
  - `createDefaultWorkspaceViewportLocalViewState()` now defaults that presentation field to `classic`
- `src/app/workspace/useWorkspaceStore.ts`
  - `setViewportLocalViewState(...)` already merges patches onto one viewport-local state object through `createDefaultWorkspaceViewportLocalViewState()`
  - this is now the live owner seam for `classic` versus `tabs`
- `src/app/workspace/workspacePersistence.ts`
  - now normalizes/persists `viewToolbarExpandedPresentationMode`
  - the new field survives workspace-layout round-trips

Current toolbar read seam:
- `src/app/components/ViewToolbar.tsx`
  - already reads `localViewState` from `useWorkspaceStore(...)`
  - already derives `viewToolbarOpen`, `viewToolbarCompactAxisWidgetSize`, and `viewToolbarExpandedAxisWidgetSize` from that local state
  - still does not yet use the new expanded presentation mode for visible switching UI
  - still renders only the current stacked expanded layout, which should become `Classic`

Current proof seams:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves that toolbar open state stays viewport-local per model viewport
- `src/app/workspace/useWorkspaceStore.test.ts`
  - now proves per-viewport local view state keeps presentation mode separate
  - now proves the presentation field survives serialize/normalize round-trips

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

### Phase 1 Result

- `WorkspaceViewportLocalViewState` now includes `viewToolbarExpandedPresentationMode: 'classic' | 'tabs'`
- `createDefaultWorkspaceViewportLocalViewState()` now defaults that field to `classic`
- workspace persistence normalization now round-trips the field
- focused workspace-store proof now shows one viewport can store `tabs` while another remains `classic`
- no visible `Tabs` UI exists yet, so the toolbar still renders the current stacked expanded layout unchanged

### Completion Read

- complete

## [x] Phase 2 - View Section ParaSelect For Presentation

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

Why next:
- `Phase 1` already created the viewport-local source of truth for `classic` versus `tabs`
- the smallest honest visible follow-on is now one switch surface inside the existing `View` subsection
- adding the `ParaSelect` first proves user-facing ownership before widening into shell-level right-click menu behavior

### Current Live Read

Current state seam:
- `src/app/workspace/workspaceShellTypes.ts`
  - already defines `viewToolbarExpandedPresentationMode: 'classic' | 'tabs'`
  - already defaults it to `classic`
- `src/app/workspace/useWorkspaceStore.ts`
  - already exposes `setViewportLocalViewState(...)` for updating that field per viewport

Current visible owner seam:
- `src/app/components/ViewToolbar.tsx`
  - already reads `localViewState` and `setViewportLocalViewState(...)`
  - already has a top-level `View` subsection
  - already uses `ParaSelect` elsewhere in the same component for toolbar-local visible controls such as:
    - `Fly Mode Activate`
    - `Labels`
    - `Background`
    - `Text Size`
  - does not yet expose any visible presentation switch inside `View`

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves viewport-local toolbar open state
  - already queries existing `.ParaSelectNative[...]` controls
  - is the right focused place to prove the new `Presentation` select updates one viewport-local presentation field

### Locked Direction

#### 1. Put The First Visible Switch In `View`

Important rule:
- the first visible presentation switch should live inside the existing `View` subsection
- do not hide the first user-facing switch only behind right-click shell chrome

Reason:
- `Classic` versus `Tabs` is part of how the `View` toolbar itself is presented, so the existing `View` section is the most honest visible owner

#### 2. Use `ParaSelect`, Not One-Off Buttons

Important rule:
- use the existing `ParaSelect` pattern already used elsewhere in `ViewToolbar.tsx`
- do not invent a one-off button row for this first visible switch

Reason:
- the toolbar already has an established compact selection control language
- `Classic` versus `Tabs` is a small, stable choice set that fits `ParaSelect`

#### 3. Keep Layout Unchanged In Phase 2

Important rule:
- changing the `ParaSelect` to `tabs` in this phase should update the shared state
- but the visible toolbar layout should still remain the current stacked `Classic` layout for now

Reason:
- `Phase 2` is only the first visible switch surface
- the actual `Tabs` shell belongs to `Phase 4`

#### 4. Keep The Choice Viewport-Local

Important rule:
- the `ParaSelect` must read and write `viewToolbarExpandedPresentationMode` through `setViewportLocalViewState(viewportId, ...)`
- do not route this through global UI prefs

Reason:
- one viewport may remain `classic` while another is set to `tabs`

### Suggested Control Shape

Suggested control:
- component:
  - `ParaSelect`
- visible owner:
  - `View` subsection in `ViewToolbar.tsx`
- label:
  - `Presentation`
- options:
  - `Classic`
  - `Tabs`

Suggested stored values:
- `classic`
- `tabs`

### Expected File Targets

Primary runtime file:
- `src/app/components/ViewToolbar.tsx`

Supporting runtime file:
- `src/app/workspace/useWorkspaceStore.ts`
  - likely no runtime change needed, but this remains the owner seam

Primary proof file:
- `src/app/components/ViewToolbar.test.tsx`

No-widening rule:
- do not add the right-click menu in this phase
- do not start rendering the `Tabs` shell in this phase
- do not change `viewport-overlay.css` unless the new `ParaSelect` truly needs a tiny spacing adjustment
- do not widen into persistence, which already landed in `Phase 1`

### Verification Bar

This phase is only done if it proves all of the following:
- the `View` subsection contains a `ParaSelect` labeled `Presentation`
- the `ParaSelect` options are `Classic` and `Tabs`
- changing the `ParaSelect` updates `viewToolbarExpandedPresentationMode` on the active viewport only
- another viewport can still keep its own independent presentation mode
- the visible toolbar layout remains the current stacked `Classic` layout even when the stored value changes to `tabs`

Required proof:
- widen `src/app/components/ViewToolbar.test.tsx` so one viewport can switch `Presentation` to `tabs` while another remains `classic`
- prove the new select uses the viewport-local store seam rather than global prefs
- keep the existing toolbar-open-state proof intact

### Suggested Implementation Order

1. Read `viewToolbarExpandedPresentationMode` from `localViewState` in `ViewToolbar.tsx`.
2. Define the `Classic` / `Tabs` options for one `ParaSelect`.
3. Add the `ParaSelect` to the `View` subsection with label `Presentation`.
4. Wire `onChange` to `setViewportLocalViewState(viewportId, { viewToolbarExpandedPresentationMode: ... })`.
5. Add focused `ViewToolbar.test.tsx` proof for viewport-local updates.

Done when:
- the `View` subsection exposes `Presentation`
- choosing `Classic` or `Tabs` updates the shared presentation state
- no behavior forks exist yet beyond the presentation-state seam

### Phase 2 Result

- the `View` subsection now contains a `Presentation` `ParaSelect`
- the `ParaSelect` now reads and writes `viewToolbarExpandedPresentationMode`
- `Classic` and `Tabs` now share one visible owner seam inside the toolbar itself
- focused toolbar proof now shows the selected presentation remains viewport-local
- the visible toolbar layout still remains the current stacked `Classic` layout for both stored values

### Completion Read

- complete

## [x] Phase 3 - Expanded Toolbar Right-Click Presentation Menu

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

Why next:
- `Phase 2` already proved the visible `Presentation` choice belongs to one shared viewport-local state seam
- the next honest slice is to expose that same choice from the expanded toolbar shell itself
- this lets users switch presentation without digging down into the `View` subsection before the real `Tabs` shell lands in `Phase 4`

### Current Live Read

Current presentation owner seam:
- `src/app/components/ViewToolbar.tsx`
  - already reads `viewToolbarExpandedPresentationMode` from `localViewState`
  - already exposes a `Presentation` `ParaSelect` in the `View` subsection
  - already writes presentation changes through `setViewportLocalViewState(viewportId, ...)`
  - still has no shell-level context menu state or right-click presentation entry point

Current expanded-shell target seam:
- `src/app/components/ViewToolbar.tsx`
  - the expanded shell is still rooted at:
    - `.ViewToolbarRoot`
    - `.ViewToolbarToggle`
    - `.ViewToolbarPanel`
  - `viewToolbarOpen` still determines whether the toolbar is expanded
  - this is the seam where expanded-only right-click behavior should be attached without changing collapsed behavior

Current context-menu pattern seam:
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - already provides the shared simple context-menu primitive with:
    - `id`
    - `label`
    - `onSelect`
    - optional `disabled`
- `src/app/components/ViewportOverlayToolPanel.tsx`
  - already shows the common local pattern for title/shell context menus:
    - hold local `{ x, y } | null` menu state
    - `preventDefault()` and `stopPropagation()`
    - render `SpaghettiContextMenu`
    - close it after selection

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves the `Presentation` `ParaSelect` is viewport-local
  - is the right focused place to prove right-clicking one expanded toolbar opens a shell menu and updates only that viewport's presentation state

### Locked Direction

#### 1. Keep One Presentation Owner Seam

Important rule:
- the right-click menu must read and write `viewToolbarExpandedPresentationMode`
- do not invent a second menu-only presentation state

Reason:
- the `ParaSelect` already established the shared truth
- the right-click menu is only a second entry point into that same truth

#### 2. Expanded Toolbar Only

Important rule:
- the right-click presentation menu should only open for the expanded toolbar
- collapsed-toolbar behavior should remain unchanged in this phase

Reason:
- the user explicitly asked for the expanded toolbar right-click surface
- widening context-menu behavior into the compact state would expand the interaction surface unnecessarily

#### 3. Do Not Steal Right-Click From Native Interactive Controls

Important rule:
- the menu should be owned by the expanded toolbar shell, not by every nested form control
- avoid breaking normal browser/native right-click behavior on inputs, selects, and sliders

Suggested first-pass guard:
- bind the shell right-click to the toolbar container/title area or gate it so nested interactive descendants do not open the presentation menu

Reason:
- the expanded toolbar contains many editable controls
- hijacking every right-click inside them would feel hostile and make future control-specific menus harder

#### 4. Reflect The Active Presentation Honestly

Important rule:
- the menu should visibly communicate the active presentation truth
- if no explicit checkmark pattern is added in this phase, use disabled state on the active entry for the first pass

Reason:
- `SpaghettiContextMenu` already supports `disabled`
- that is enough for the first honest pass without widening the shared menu primitive

#### 5. Keep Layout Unchanged In Phase 3

Important rule:
- changing presentation through the right-click menu should update the shared state
- but the visible toolbar layout should still remain the current stacked `Classic` layout for now

Reason:
- the real `Tabs` shell still belongs to `Phase 4`
- `Phase 3` only adds the second switch surface

### Suggested Menu Shape

Suggested owner:
- expanded `ViewToolbar` shell in `src/app/components/ViewToolbar.tsx`

Suggested menu primitive:
- `SpaghettiContextMenu`

Suggested local menu state:
- one local nullable menu position such as:
  - `{ x: number; y: number } | null`

Suggested menu entries:
- `Classic`
- `Tabs`

Suggested state mapping:
- `Classic` -> `viewToolbarExpandedPresentationMode: 'classic'`
- `Tabs` -> `viewToolbarExpandedPresentationMode: 'tabs'`

Suggested active-truth treatment:
- disable whichever entry matches the current presentation mode

Suggested opening rule:
- right-clicking the expanded toolbar shell opens the menu
- right-clicking when the toolbar is collapsed does nothing new in this phase

### Expected File Targets

Primary runtime file:
- `src/app/components/ViewToolbar.tsx`

Supporting runtime file:
- `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - likely no change needed, but this is the shared primitive the phase should prefer

Primary proof file:
- `src/app/components/ViewToolbar.test.tsx`

No-widening rule:
- do not start rendering the `Tabs` shell in this phase
- do not add active-tab persistence in this phase
- do not widen `workspaceShellTypes.ts` unless a tiny typed helper is truly needed
- do not rework global viewport or frame context-menu systems for this toolbar-local menu

### Verification Bar

This phase is only done if it proves all of the following:
- right-clicking the expanded `View` toolbar opens a presentation menu
- the menu exposes `Classic` and `Tabs`
- the active presentation is communicated honestly in that menu
- choosing a menu entry updates `viewToolbarExpandedPresentationMode` on the active viewport only
- the existing `Presentation` `ParaSelect` reflects the menu-triggered change immediately
- collapsed-toolbar behavior remains unchanged
- the visible toolbar layout still remains the current stacked `Classic` layout for both stored values

Required proof:
- widen `src/app/components/ViewToolbar.test.tsx` so one expanded toolbar can open the right-click presentation menu
- prove selecting `Tabs` or `Classic` from that menu updates only the targeted viewport-local presentation field
- prove the existing `Presentation` `ParaSelect` reflects the menu update without requiring a separate local sync path
- keep the existing `ParaSelect` viewport-local proof intact

### Suggested Implementation Order

1. Add local shell-context-menu state to `ViewToolbar.tsx`.
2. Decide the exact expanded-shell right-click target and guard interactive descendants appropriately.
3. Open the menu only when `viewToolbarOpen === true`.
4. Render a `SpaghettiContextMenu` with `Classic` and `Tabs`.
5. Wire both menu entries to `setViewportLocalViewState(viewportId, { viewToolbarExpandedPresentationMode: ... })`.
6. Disable the currently active presentation entry so the menu reflects truth honestly.
7. Add focused `ViewToolbar.test.tsx` proof for menu open, selection, and `ParaSelect` sync.

Done when:
- right-clicking the expanded toolbar shows `Classic` and `Tabs`
- choosing either entry updates the same state as the `ParaSelect`
- the `ParaSelect` reflects the menu change immediately

### Phase 3 Result

- the expanded toolbar shell now exposes a right-click presentation menu
- that menu now offers `Classic` and `Tabs`
- the active presentation is now reflected honestly through the menu's disabled state
- the menu now writes through the same viewport-local `viewToolbarExpandedPresentationMode` seam as the `Presentation` `ParaSelect`
- focused toolbar proof now shows expanded-only menu behavior plus immediate sync back into the existing select

### Completion Read

- complete

## [x] Phase 4 - Full Tabs Shell For All Current Sections

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

Why next:
- `Phase 3` already finished both visible switch surfaces for presentation choice
- the next honest slice is to make `tabs` mean a real alternate layout instead of just stored state
- this is the first phase where the selected presentation should finally change visible structure, but it still needs to stay constrained to one component and one scroll owner

### Current Live Read

Current presentation seam:
- `src/app/components/ViewToolbar.tsx`
  - already reads `viewToolbarExpandedPresentationMode`
  - already exposes both switch surfaces:
    - `Presentation` `ParaSelect`
    - expanded-toolbar right-click menu
  - still renders the same stacked expanded layout for both `classic` and `tabs`

Current section-owner seam:
- `src/app/components/ViewToolbar.tsx`
  - still renders the current top-level sections inline as one large JSX tree in this order:
    - `Camera`
    - `Fly Mode`
    - `Transform`
    - `Snap`
    - `Gizmo`
    - `View`
    - `Environment`
    - `Materials`
  - each section already owns its current controls and behavior inside the same component
  - this is the seam that now needs extraction or structuring so both `Classic` and `Tabs` can reuse one section body owner

Current shell/layout seam:
- `src/app/components/ViewToolbar.tsx`
  - still mounts the toolbar under:
    - `.ViewToolbarRoot`
    - `.ViewToolbarPanel`
  - still uses `.ViewToolbarRoot` as the scroll owner for the expanded toolbar
- `src/app/theme/surfaces/viewport-overlay.css`
  - still defines the current `ViewToolbarRoot` / `ViewToolbarPanel` overflow contract
  - this must remain honest when `Tabs` is introduced

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves presentation state changes through the select and the right-click menu
  - is the right focused place to prove that switching to `tabs` changes visible structure while keeping controls functional

### Locked Direction

#### 1. Reuse One Section Body Owner

Important rule:
- each top-level section body should still have one real owner implementation
- do not fork every section into separate `ClassicSection` and `TabsSection` behavior trees

Reason:
- the user asked for an alternate layout, not alternate behavior
- duplicated section trees would drift immediately and make later maintenance painful

Suggested first pass:
- extract each top-level section into reusable render units or data-backed section descriptors inside `ViewToolbar.tsx` before widening further

#### 2. Keep `Classic` Honest

Important rule:
- `classic` should still render the full current stacked details list in the same order
- the work for `Tabs` must not regress the current stacked layout

Reason:
- `Classic` remains the default and fallback presentation
- Phase 4 is additive, not a replacement

#### 3. Make `Tabs` A Real Alternate Shell

Important rule:
- when `viewToolbarExpandedPresentationMode === 'tabs'`, the expanded body should visibly switch to:
  - one left vertical tab rail
  - one right content pane
- only one section body should be visible at a time in `Tabs`

Reason:
- until the layout changes, `tabs` is just hidden state
- this phase is where the feature becomes real for users

#### 4. Keep A Single Scroll Owner

Important rule:
- the expanded toolbar should still have one clear scroll owner
- avoid giving both the tab rail and content pane independent scrolling unless absolutely necessary

Suggested first pass:
- keep `.ViewToolbarRoot` as the outer scroll owner
- make the `Tabs` shell live inside `.ViewToolbarPanel`

Reason:
- the existing clamp and overflow system already depends on one honest scroll surface
- nested scroll regions would make height-sync behavior harder immediately

#### 5. Keep Phase 4 Stateless Beyond Presentation

Important rule:
- do not add remembered active-tab persistence in this phase
- use a simple first-tab fallback such as `Camera` for the first visible `Tabs` implementation

Reason:
- active-tab persistence is already reserved for `Phase 5`
- keeping Phase 4 stateless makes the first visible shell much easier to land safely

#### 6. Keep Tab Labels Text-First

Important rule:
- use readable tab labels for the left rail
- do not widen into icon-only or Blender-copy styling in this first pass

Reason:
- the main value here is navigation clarity and section focus
- visual skin polish can happen later if needed

### Suggested Structure Shape

Suggested shell split:
- `classic`
  - existing stacked section list
- `tabs`
  - left tab rail
  - one selected section body pane

Suggested first local tab state:
- one component-local active tab state in `ViewToolbar.tsx`
- default active tab:
  - `Camera`

Suggested section key set:
- `camera`
- `fly-mode`
- `transform`
- `snap`
- `gizmo`
- `view`
- `environment`
- `materials`

Suggested first shared abstraction:
- one ordered section definition list that captures:
  - stable key
  - visible label
  - shared section body renderer

### Expected File Targets

Primary runtime file:
- `src/app/components/ViewToolbar.tsx`

Primary style file:
- `src/app/theme/surfaces/viewport-overlay.css`

Primary proof file:
- `src/app/components/ViewToolbar.test.tsx`

No-widening rule:
- do not add viewport-local active-tab persistence in this phase
- do not widen `workspaceShellTypes.ts` for tab selection yet
- do not invent new commands or alter existing section behavior
- do not move toolbar ownership out of `ViewToolbar.tsx`

### Verification Bar

This phase is only done if it proves all of the following:
- switching the stored presentation to `tabs` changes the visible expanded layout
- `Classic` still renders the current stacked section list
- `Tabs` renders a left tab rail and one right content pane
- the tab rail exposes all current top-level sections:
  - `Camera`
  - `Fly Mode`
  - `Transform`
  - `Snap`
  - `Gizmo`
  - `View`
  - `Environment`
  - `Materials`
- selecting a tab changes only which section body is visible, not the underlying behavior
- the controls inside the selected tab still work through the same command/state seams as `Classic`
- the toolbar still keeps one honest scroll owner and does not regress the existing height clamp behavior

Required proof:
- widen `src/app/components/ViewToolbar.test.tsx` so a toolbar switched to `tabs` exposes the full tab rail
- prove the default selected tab renders one section body and that switching tabs changes the visible section content
- prove at least one real control still works inside the tabbed presentation through the existing owner seam
- keep the existing `Presentation` select and right-click menu sync proof intact

### Suggested Implementation Order

1. Define stable tab keys and the ordered top-level section list.
2. Extract or restructure the current section bodies so `Classic` and `Tabs` can reuse them.
3. Add one component-local active-tab state with a simple `Camera` default for `tabs`.
4. Branch the expanded body on `viewToolbarExpandedPresentationMode`:
   - `classic` -> current stacked list
   - `tabs` -> left rail plus content pane
5. Add the first `Tabs` shell styling in `viewport-overlay.css` without changing the single-scroll contract.
6. Widen `ViewToolbar.test.tsx` to prove full tab availability, tab switching, and one functional control inside `Tabs`.

Done when:
- `Tabs` is a real alternate presentation
- the left tab rail exposes all current top-level `View` toolbar sections
- those sections still behave exactly the same as in `Classic`

### Phase 4 Result

- `Tabs` is now a real alternate expanded presentation instead of stored state only
- the expanded toolbar now renders a left section rail plus one content pane when presentation is `tabs`
- all current top-level sections now appear in that rail:
  - `Camera`
  - `Fly Mode`
  - `Transform`
  - `Snap`
  - `Gizmo`
  - `View`
  - `Environment`
  - `Materials`
- the current section bodies are now reused through one shared section-definition seam inside `ViewToolbar.tsx`
- the existing single-scroll contract remains intact because the outer toolbar shell still owns scrolling
- the first visible active tab is still local component state only, which is the remaining Phase 5 gap

### Completion Read

- complete

## [x] Phase 5 - Active Tab Persistence And Honest Widening Follow-On

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

Why next:
- `Phase 4` made `Tabs` real, but the active tab still resets to the first tab when the component remounts
- the presentation mode is already remembered per viewport, so the remaining usability gap is to remember which tab the user was actually on
- this is also the right moment to lock the follow-on rule for future top-level sections so `Tabs` does not silently drift incomplete over time

### Current Live Read

Current presentation persistence seam:
- `src/app/workspace/workspaceShellTypes.ts`
  - already includes viewport-local `viewToolbarExpandedPresentationMode`
  - still does not include any viewport-local active-tab field for `Tabs`
- `src/app/workspace/workspacePersistence.ts`
  - already round-trips the presentation mode
  - still has no persisted active-tab field to normalize

Current live tab-selection seam:
- `src/app/components/ViewToolbar.tsx`
  - currently stores the selected tab in component-local state:
    - `activeViewToolbarTab`
  - currently defaults that local state to `camera`
  - currently uses that state to drive:
    - `.ViewToolbarTabButton` active treatment
    - `data-tab-active`
    - which section is visibly open in `Tabs`
  - this means the tab selection is currently real, but not remembered

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves the full rail exists in `Tabs`
  - already proves a real camera command still works in `Tabs`
  - is the right focused place to prove remembered tab behavior and safe fallback
- `src/app/workspace/useWorkspaceStore.test.ts`
  - is still the right seam for serialize/normalize proof once an active-tab field is added

### Locked Direction

#### 1. Make Active Tab Viewport-Local

Important rule:
- the selected `Tabs` section should live in `WorkspaceViewportLocalViewState`
- do not keep long-term remembered tab state in component-local `useState`

Reason:
- the user already chose to make presentation mode viewport-local
- the active tab is part of that same viewport-local chrome preference

#### 2. Persist Only Stable Tab Keys

Important rule:
- store one stable tab key, not derived labels or indexes

Suggested field:
- `viewToolbarActiveTab: 'camera' | 'fly-mode' | 'transform' | 'snap' | 'gizmo' | 'view' | 'environment' | 'materials'`

Reason:
- labels can evolve
- indexes become fragile as the rail changes

#### 3. Keep `Camera` As The Safe Fallback

Important rule:
- if the stored key is missing, invalid, or no longer present in the section list, fall back to `camera`
- do not silently fall back to an arbitrary later tab

Reason:
- `Camera` is already the first tab and current first-pass default
- a deterministic fallback keeps persistence migration simple and honest

#### 4. Only Apply Remembered Tab Behavior In `Tabs`

Important rule:
- the remembered tab should matter when presentation is `tabs`
- `Classic` should continue to show the full stacked list and should not be visually affected by the saved active tab

Reason:
- the active tab is a tabs-shell concern, not a classic-layout concern

#### 5. Keep The Shared Section Owner Intact

Important rule:
- Phase 5 should not rework the shared section-definition seam created in Phase 4
- this is a persistence and fallback pass, not another layout rewrite

Reason:
- the main feature is already visible
- the remaining work should stay narrow and low-risk

#### 6. Lock The Future-Section Rule Explicitly

Important rule:
- any future new top-level `View` toolbar section should be added to the shared section definition list so it appears in both `Classic` and `Tabs`
- exceptions should be explicit, not accidental

Reason:
- this is the cheapest point to stop future drift
- Phase 4 already created the shared section seam that makes this rule practical

### Suggested State Shape

Suggested viewport-local field:
- `viewToolbarActiveTab`

Suggested stored values:
- `camera`
- `fly-mode`
- `transform`
- `snap`
- `gizmo`
- `view`
- `environment`
- `materials`

Suggested default:
- `camera`

Suggested first read rule:
- read the stored tab from `localViewState`
- if it is missing or invalid for the current section set, use `camera`

### Expected File Targets

Primary runtime files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/components/ViewToolbar.tsx`

Primary proof files:
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/components/ViewToolbar.test.tsx`

No-widening rule:
- do not redesign the tab rail skin in this phase
- do not widen into a second cleanup/refactor pass here
- do not move toolbar ownership out of `ViewToolbar.tsx`
- do not change command behavior inside any tab

### Verification Bar

This phase is only done if it proves all of the following:
- the active `Tabs` section is stored per viewport, not only in component-local state
- a viewport reopened in `tabs` restores its previously selected tab
- another viewport can still remember a different selected tab
- persistence round-trips preserve the stored active tab
- invalid or missing saved tab data falls back safely to `camera`
- `Classic` still behaves exactly the same visually even if a saved active tab exists
- the follow-on rule for future top-level sections is explicit in the doc and reflected in the shared section seam

Required proof:
- widen `src/app/workspace/useWorkspaceStore.test.ts` so the active tab field survives serialize/normalize round-trips
- widen `src/app/components/ViewToolbar.test.tsx` so a viewport switched to a non-default tab in `Tabs` restores that tab on rerender/remount
- prove a second viewport can hold a different remembered active tab
- prove invalid stored tab data resolves to `camera`

### Suggested Implementation Order

1. Add `viewToolbarActiveTab` to `WorkspaceViewportLocalViewState`.
2. Default it to `camera` in `createDefaultWorkspaceViewportLocalViewState()`.
3. Extend `workspacePersistence.ts` normalization so the field round-trips and invalid values normalize safely.
4. Replace the local-only `activeViewToolbarTab` seam in `ViewToolbar.tsx` with a viewport-local read/write path.
5. Keep `Classic` rendering unchanged while `Tabs` reads the stored active tab.
6. Widen `useWorkspaceStore.test.ts` and `ViewToolbar.test.tsx` to prove viewport-local separation, persistence, and fallback.

Done when:
- `Tabs` remembers the selected tab per viewport
- fallback behavior is explicit and safe
- the follow-on rule for any newly added top-level section is clear without forcing a new immediate widening cut

### Phase 5 Result

- `WorkspaceViewportLocalViewState` now includes viewport-local `viewToolbarActiveTab`
- the active `Tabs` section now persists through workspace round-trips with safe invalid-value fallback to `camera`
- `ViewToolbar.tsx` now reads and writes the active tab through shared viewport-local state instead of component-local `useState`
- the shared section-definition seam remains the onboarding path for any future top-level `View` toolbar section so `Classic` and `Tabs` stay in sync

### Completion Read

- complete

## [x] Phase 6 - Polish And Cleanup

Purpose:
- finish the first shipped `Classic` / `Tabs` pass with visual polish, cleanup, and small ergonomics improvements that are safer to do after the behavior is complete

Owns:
- tabs-shell polish
- shared section cleanup follow-ons
- small CSS/layout cleanup that improves readability without changing command behavior

This phase should:
- clean up any leftover duplication or awkward seams from Phases 4 and 5
- tighten tab-rail readability and presentation
- improve maintainability of the shared section-definition approach without changing feature meaning

Does not own by default:
- new toolbar commands
- new top-level sections
- another presentation-mode rewrite

Important rule:
- this is a polish and cleanup phase, not a hidden behavior-expansion phase

### First Task

First explicit task:
- make the left tabs visually vertical
- the labels should read bottom-up instead of left-to-right

Clarifying rule:
- this means the user should read the tab text by looking from the bottom of the label toward the top
- do not keep the current horizontal left-to-right text treatment for this polish pass

Why first:
- the user already confirmed the interaction model
- the next highest-value polish item is to make the left rail feel more intentional and DCC-like without changing the underlying section behavior

### Current Live Read

Current tabs-shell seam:
- `src/app/components/ViewToolbar.tsx`
  - already renders the tabs shell through:
    - `.ViewToolbarPanel--tabs`
    - `.ViewToolbarTabRail`
    - `.ViewToolbarTabButton`
    - `.ViewToolbarTabContent`
  - already keeps the tab rail on the left and the content pane on the right
  - already drives active state through one shared viewport-local tab key

Current tab-skin seam:
- `src/app/theme/surfaces/viewport-overlay.css`
  - currently styles `.ViewToolbarTabButton` as a normal horizontal text button
  - the labels currently read left-to-right
  - current sizing/hit-target rules are still owned here, so this is the main implementation seam for the first polish pass

Current proof seam:
- `src/app/components/ViewToolbar.test.tsx`
  - already proves the full tab rail exists in `Tabs`
  - already proves the rail still switches visible content and keeps at least one real command functional
  - is the right focused seam for adding a light proof that the vertical-label treatment still preserves a usable rail

### Locked Direction

#### 1. Keep The Rail On The Left

Important rule:
- this first polish pass should not move the rail
- keep the current left-rail / right-content arrangement intact

Reason:
- the interaction model is already settled
- the task here is label orientation polish, not shell relayout

#### 2. Make Labels Read Bottom-Up

Important rule:
- tab labels should read vertically from bottom to top
- do not leave the labels horizontal
- do not switch to top-down unless explicitly requested later

Reason:
- this is the user’s specific directional requirement
- it gives the rail a stronger DCC-like feel without changing behavior

#### 3. Preserve Hit Targets

Important rule:
- rotate the label treatment without collapsing the actual button hit area into thin strips
- the button box should remain easy to click

Reason:
- this is polish, so usability should improve or stay equal
- decorative orientation changes should not make the rail fiddly

#### 4. Keep Active And Hover States Legible

Important rule:
- active and hover states must remain at least as obvious as they are now
- do not let rotated text treatment reduce active-state clarity

Reason:
- in a vertical rail, active-state recognition becomes even more important for scanability

#### 5. Keep The Behavior Surface Unchanged

Important rule:
- do not change tab keys, persistence, right-click menu behavior, or section ownership in this first Phase 6 task

Reason:
- those are already complete behavior seams from earlier phases
- the first Phase 6 cut should stay visual and structural only

### Suggested Direction

Suggested implementation shape:
- keep the rail on the left
- rotate or otherwise style the tab labels so they read vertically bottom-up
- preserve clear active/hover states and click targets
- keep the text readable without shrinking the hit area into tiny slivers

Suggested first-pass CSS direction:
- prefer solving this in `viewport-overlay.css`
- keep `ViewToolbar.tsx` changes minimal unless one tiny wrapper/span is truly needed for text orientation
- if a wrapper is added, keep the tab button as the click target and make the wrapper purely presentational

Suggested guardrails:
- do not break mobile or narrow viewport behavior
- do not reduce accessibility of the tab buttons
- do not let the vertical text treatment make the active state harder to recognize
- do not introduce nested scrolling or shell layout churn while polishing the labels

### Expected File Targets

Primary runtime/style files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`

Primary proof file:
- `src/app/components/ViewToolbar.test.tsx`

No-widening rule:
- do not widen this first Phase 6 task into a full visual redesign of the tabs shell
- do not refactor the shared section list unless it directly helps the orientation pass
- do not touch workspace persistence or command routing in this first polish cut

### Verification Bar

This phase is only done if it proves all of the following:
- the left tab rail still works functionally
- tab labels now read vertically bottom-up
- active and hover states remain visually clear
- click targets remain usable
- no command behavior changes were introduced during cleanup

Required proof:
- keep the existing `Tabs` rail test in `src/app/components/ViewToolbar.test.tsx` passing
- widen `ViewToolbar.test.tsx` only if needed to prove the rail still exposes the same tab buttons after the orientation pass
- verify one real control path still works in `Tabs` so the polish pass does not accidentally disturb behavior

### Suggested Implementation Order

1. Read the live `.ViewToolbarTabRail` and `.ViewToolbarTabButton` skin in `viewport-overlay.css`.
2. Decide whether pure CSS is enough for bottom-up text orientation or whether one small presentational wrapper is needed in `ViewToolbar.tsx`.
3. Apply the vertical bottom-up label treatment while preserving current hit-target sizing.
4. Re-check active and hover styling against the rotated label treatment.
5. Run the focused `ViewToolbar.test.tsx` proof and typecheck to confirm the polish pass stayed behavior-neutral.

### Suggested Follow-On Cleanup Items

After the vertical-tab pass, this phase may also include:
- tightening helper naming around the shared section list
- reducing any remaining repetitive wrapper markup in `ViewToolbar.tsx`
- cleaning CSS organization for `Classic` versus `Tabs`
- polishing spacing and alignment where the new tabs shell still feels rough

Done when:
- the tabs rail feels visually intentional
- the first cleanup pass removes the most obvious rough edges from the shipped `Tabs` implementation
- the vertical bottom-up tab-label treatment is in place

### Phase 6 Result

- the left tabs now read vertically bottom-up instead of horizontally left-to-right
- the rail width and button padding were tightened so the tab column feels slimmer and more intentional
- `ViewToolbar.tsx` only gained a small presentational label wrapper while behavior stayed unchanged
- the focused `Tabs` proof stayed green, so the polish pass remained behavior-neutral

### Completion Read

- complete

## [x] Phase 7 - Top-Right Dock Cluster For Gizmo And View Toolbar

Purpose:
- let the top-right viewport chrome arrange the gizmo and the `View` toolbar as one intentional docked cluster instead of two independently positioned pieces

Owns:
- the shared top-right cluster layout for gizmo plus `View` toolbar
- the first docked order rule for those two surfaces
- the top-right host seam that positions that cluster inside the viewport
- keeping HUD offset behavior honest after the dock changes

This phase should:
- keep using the existing top-right viewport area as the anchor zone
- let the `View` toolbar dock as its own right-side column in that top-right cluster
- place the gizmo to the left of the docked `View` toolbar for the first shipped order
- keep the HUD readable and out of collision with the new cluster width
- preserve the existing toolbar open/close and `Classic` / `Tabs` behavior

Does not own by default:
- new gizmo behavior
- a HUD redesign
- moving overlay ownership out of the viewport host chain

Important note:
- the wording in the feature ask is directionally mixed, but the more explicit sentence is:
  - `the gizmo will live to the left of it`
- this phase therefore recommends the first shipped horizontal order as:
  - `gizmo | view toolbar`

Why next:
- `Classic` and `Tabs` are now real toolbar presentations
- the next layout problem is no longer inside the toolbar body, it is at the viewport top-right anchor level
- treating the gizmo plus toolbar as one shared cluster is safer than bolting another independent absolute position onto the viewport

### Current Live Read

Current top-right dock seam:
- `src/app/components/ViewToolbar.tsx`
  - the toolbar shell currently mounts under:
    - `.RightDock`
    - `.RightPanelStack`
  - the current expanded toolbar is therefore already using the repo's concrete right-dock lane
- `src/app/theme/shell/docks.css`
  - `.RightDock` is the current absolute right-side lane
  - `.RightPanelStack` is the current inner stack
  - this lane currently assumes the toolbar lives below the axis widget, not beside it

Current actual gizmo seam:
- `src/app/components/ViewportOverlay.tsx`
  - the top-right widget in this conversation is currently the `.AxisWidget`
  - it is rendered inside `.ViewportOverlayRoot`, not inside `.RightDock`
  - its live position currently comes from:
    - `top: AXIS_WIDGET_TOP`
    - `right: RIGHT_DOCK_PADDING_X`
  - this means the current "gizmo" is still an independently positioned overlay widget

Current shared size contract:
- `src/app/components/ViewToolbar.tsx`
  - the toolbar already derives `resolvedAxisWidgetSize`
  - the toolbar width reserve currently comes from:
    - `resolveRightDockWidth(resolvedAxisWidgetSize)`
  - the toolbar top anchor currently comes from:
    - `resolveViewAnchorTop(resolvedAxisWidgetSize)`
  - this means the current `RightDock` width is already coupled to axis-widget size, but the toolbar still sits underneath it rather than docking beside it

Current shared layout helper seam:
- `src/app/components/viewToolbarLayout.ts`
  - already defines:
    - `RIGHT_DOCK_PADDING_X`
    - `VIEWPORT_HUD_GAP`
    - `resolveRightDockWidth(...)`
    - `resolveViewportHudRight(...)`
  - this is the cleanest current seam for promoting "toolbar-only width" into a broader "top-right cluster width" concept

Current HUD seam:
- `src/app/components/ViewportOverlay.tsx`
  - the HUD is still rendered separately inside `.ViewportOverlayRoot`
  - its right offset currently comes from:
    - `resolveViewportHudRight(axisWidgetSize)`
  - that means the HUD already knows how to stay clear of the current right-side dock width, but only through the current toolbar-centric width helper

Important architectural read:
- there is not one existing DOM owner today that literally contains:
  - axis widget / gizmo
  - `View` toolbar
  - HUD
- the closest current shared concepts are:
  - render/layout owner: `RightDock`
  - data/chrome owner: viewport `chrome`
- because of that, this phase should add a shared top-right cluster layout seam instead of pretending a perfect single container already exists

### Locked Direction

#### 1. Treat This As A Cluster Layout Phase, Not A Toolbar-Only Phase

Important rule:
- do not solve this by adding another absolute-position branch inside `ViewToolbar.tsx` alone
- introduce a shared "top-right cluster" layout seam that decides how the axis widget / gizmo and toolbar sit together

Reason:
- the request changes the relationship between two viewport tools, not just the toolbar internals
- a shared cluster owner is easier to extend later if more top-right chrome joins the area

#### 2. Keep The Current Below-Axis Layout As A Real Fallback

Important rule:
- do not replace the current layout outright in the first cut
- preserve the existing behavior as the fallback dock mode:
  - toolbar below axis widget

Reason:
- the current top-right layout already works
- keeping it available gives the new cluster dock a low-risk rollback path
- the user asked for the ability to dock differently, which implies a selectable mode rather than a forced migration

#### 3. Use An Explicit Dock Mode Plus Explicit Cluster Order

Important rule:
- model the dock arrangement with one explicit dock mode instead of hidden CSS assumptions
- if the new top-right cluster mode is active, model the horizontal order explicitly too

Suggested viewport-local field:
- `viewToolbarDockMode: 'below-axis' | 'top-right-cluster'`

Suggested first shipped cluster order:
- `gizmo-left-toolbar`

Suggested future-friendly supporting shape:
- `topRightClusterMode: 'stacked' | 'gizmo-left-toolbar' | 'toolbar-left-gizmo'`

Reason:
- the direction matters and should be explicit in state, tests, and docs
- it avoids baking ambiguous left/right assumptions into unrelated style code

Clarifying recommendation:
- for the first implementation cut, the dock mode matters more than supporting every possible order
- it is acceptable to ship:
  - `below-axis`
  - `top-right-cluster` with fixed internal order `gizmo-left-toolbar`
- then widen the order enum later only if the product actually needs both horizontal orders

#### 4. Keep The New Dock Limited To Expanded Toolbar Behavior

Important rule:
- the first cut should apply the new docked cluster behavior only while the toolbar is expanded
- keep compact/closed toolbar behavior unchanged unless the implementation proves the compact path needs the same treatment

Reason:
- the user asked for a new top-right dock for the toolbar, and the meaningful visible difference is in expanded mode
- this keeps the first cut smaller and avoids widening into compact-shell churn unless needed

#### 5. Keep The Toolbar Internals Unchanged

Important rule:
- `Phase 7` should not rework the inside of `Classic` or `Tabs`
- keep the toolbar's own scroll owner, section behavior, and presentation-state logic intact

Reason:
- the layout change is at the dock/cluster level
- touching the internals again would widen the risk surface unnecessarily

#### 6. Promote Dock Width And Offsets Into Shared Cluster Math

Important rule:
- stop thinking only in terms of current `RightDock` width
- promote the width helper into a top-right cluster measurement that can reserve space for:
  - axis widget / gizmo
  - toolbar
  - padding/gap

Important follow-on:
- add matching shared offset helpers for:
  - axis widget right offset
  - toolbar lane width
  - HUD right offset
- do not leave those three surfaces each inventing separate left/right math

Reason:
- the HUD already keys off the current right-dock width helper
- the axis widget, toolbar, and HUD all participate in the same top-right footprint
- the cleanest way to avoid collisions is to make the helpers describe the whole cluster, not only the toolbar lane

#### 7. Keep The Axis Widget In `ViewportOverlay` For The First Cut

Important rule:
- do not move `.AxisWidget` into `RightDock` in the first implementation cut
- let the shared layout helpers coordinate the cluster while ownership stays split:
  - axis widget in `ViewportOverlay`
  - toolbar in `RightDock`

Reason:
- there is no existing shared DOM owner today
- keeping ownership split but coordinated is the narrowest honest cut

#### 8. Keep HUD Ownership Separate But Offset Honest

Important rule:
- do not force the HUD into the new cluster DOM just to make the math work
- keep the HUD where it already lives, but make its right offset respect the new cluster footprint

Reason:
- the HUD is currently overlay chrome, not right-dock content
- changing ownership would widen this phase more than necessary

### Suggested State Shape

Suggested viewport-local field:
- `viewToolbarDockMode`

Suggested first values:
- `below-axis`
- `top-right-cluster`

Suggested default:
- `below-axis`

Suggested supporting helper direction:
- keep cluster order derivation explicit even if the first shipped `top-right-cluster` mode hard-codes:
  - `gizmo-left-toolbar`

Reason:
- the user asked for an added capability, not a replacement of the current behavior
- defaulting to the current below-axis arrangement keeps migration safe

### Suggested Direction

Suggested implementation shape:
- keep `RightDock` as the visual top-right anchor owner
- keep `.AxisWidget` rendered from `ViewportOverlay`
- make the new dock mode work by coordinating shared layout math across:
  - `RightDock`
  - `.AxisWidget`
  - `.ViewportHud`
- in `below-axis`:
  - keep the current layout
- in `top-right-cluster` while expanded:
  - align the toolbar to the top-right anchor instead of below the axis widget
  - shift the axis widget left of the toolbar
  - reserve the combined cluster footprint for the HUD

Suggested first helper responsibilities:
- one helper for toolbar lane width
- one helper for axis-widget right offset
- one helper for HUD right offset
- one helper for toolbar top anchor

Important first-cut simplification:
- if the toolbar width continues to derive from `resolvedAxisWidgetSize`, keep that coupling for the first cut
- do not widen into independent toolbar-width customization during this phase

Suggested state direction:
- keep the first cut viewport-local
- store one explicit cluster order/layout field near the existing viewport-local toolbar/gizmo chrome state

Suggested first UX surface:
- for the first cut, a single visible switch is enough
- the cleanest owner is likely the `View` toolbar itself or the top-right shell context menu
- do not widen into multiple redundant controls on the same first pass unless the need is obvious

Important note:
- this prep pass does not lock the final switch surface yet
- the implementation can start with the dock mode seam plus one temporary wiring point if that helps keep the first code cut small

### Expected File Targets

Primary runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/viewToolbarLayout.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`

Primary style files:
- `src/app/theme/shell/docks.css`
- `src/app/theme/surfaces/viewport-overlay.css`

Primary proof files:
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/workspace/useWorkspaceStore.test.ts`

No-widening rule:
- do not redesign the HUD in this phase
- do not change gizmo commands or math
- do not move `ViewportOverlay` into `RightDock`
- do not rework `Classic` / `Tabs` behavior while changing the dock layout

### Verification Bar

This phase is only done if it proves all of the following:
- a viewport can still use the current below-axis toolbar layout as a fallback
- a viewport can switch into the new top-right cluster mode
- in the new mode, the top-right area renders the axis widget / gizmo and `View` toolbar as one intentional cluster
- the first shipped cluster order is explicitly:
  - `gizmo | view toolbar`
- the `View` toolbar still opens, closes, scrolls, and switches `Classic` / `Tabs` normally
- the axis widget remains usable in its new left-of-toolbar placement
- the HUD stays clear of the new top-right cluster footprint
- the dock-mode choice, if stored, remains viewport-local

Required proof:
- add focused proof that the current below-axis layout still renders honestly
- add focused proof that the top-right cluster renders the axis widget and toolbar in the intended order
- keep existing `ViewToolbar` presentation tests passing so the docking pass does not regress `Classic` / `Tabs`
- add or widen overlay proof so:
  - the axis widget right offset changes correctly in the docked mode
  - the HUD still resolves to a safe right offset after the new cluster width is introduced
- widen workspace-store proof if a new viewport-local dock field is introduced

### Suggested Implementation Order

1. Add one viewport-local dock field that preserves the current layout as `below-axis`.
2. Extend `viewToolbarLayout.ts` so the shared helpers can resolve:
   - toolbar lane width
   - toolbar top anchor
   - axis-widget right offset
   - HUD right offset
3. Keep the current `below-axis` math intact behind that helper layer.
4. Add the new `top-right-cluster` math for expanded toolbar mode with fixed `gizmo-left-toolbar` order.
5. Update `ViewToolbar.tsx` to read the new toolbar width/top-anchor helpers without touching internal `Classic` / `Tabs` behavior.
6. Update `ViewportOverlay.tsx` so `.AxisWidget` and `.ViewportHud` read the shared cluster helpers.
7. Add the first visible control surface for the new dock mode if needed.
8. Widen focused toolbar, overlay, and workspace-store tests to prove fallback, docked order, usability, and persistence.

Done when:
- the current below-axis layout still exists as the safe fallback
- the new top-right cluster mode works in expanded toolbar mode
- the axis widget sits to the left of the `View` toolbar in that cluster
- the HUD still clears the cluster honestly
- the new layout is modeled explicitly enough that future dock-order changes will not require another rewrite

### Phase 7 Result

- viewport-local `viewToolbarDockMode` now preserves the current layout as `below-axis` and adds `top-right-cluster`
- the `View` section now exposes a `Dock` `ParaSelect` for `Below Axis` versus `Top Right Cluster`
- shared layout helpers now coordinate:
  - toolbar top anchor
  - axis-widget right offset
  - HUD right offset
- in expanded `top-right-cluster` mode, the axis widget now sits to the left of the `View` toolbar and the HUD clears the full cluster footprint
- compact and collapsed toolbar behavior still falls back to the current below-axis arrangement

### Completion Read

- complete

## [ ] Phase 8 - Outside Tab Rail And Attached Shell Chrome

Purpose:
- clean up the shipped `Tabs` shell so the section rail sits outside the main `View` toolbar box and reads like real attached tabs instead of interior buttons inside one panel grid

This phase should:
- keep the tab rail on the left
- move the rail outside the main toolbar content box
- make the active tab read as attached to the panel shell
- keep current tab switching, active-tab persistence, and section ownership unchanged
- preserve the current vertical bottom-up tab-label treatment unless a later doc explicitly changes it
- keep the one-scroll-owner rule honest after the shell split

Does not own by default:
- new toolbar commands
- new top-level sections
- floating or docked host-mode changes
- another presentation-mode rewrite

Why next:
- the shipped `Tabs` behavior is already functional, but the shell still reads like a vertical button strip inside the box rather than true tab chrome
- the next honest cleanup step is therefore shell presentation, not command behavior

Execution doc:
- `View_Toolbar_Phase View-Toolbar 6 Phase 8 - Outside Tab Rail And Attached Shell Chrome.md`

### Completion Read

- open

### Acceptance Shape

This phase is done when:
- the current expanded toolbar is still available as `Classic`
- `Tabs` is available as an alternate expanded presentation
- the `View` subsection contains a `ParaSelect` for `Classic` versus `Tabs`
- right-clicking the expanded toolbar exposes `Classic` and `Tabs`
- the left tab rail selects which section body appears in one content area
- in `Tabs`, the section rail sits outside the main toolbar box and the active section reads like attached tab chrome
- all current top-level `View` toolbar sections work through the same underlying controls in both presentations
- the choice of `Classic` versus `Tabs` is remembered per viewport
- the active `Tabs` section is remembered per viewport with safe fallback to `camera`
- the tabs rail uses the shipped vertical bottom-up label treatment
- the `View` subsection contains a `Dock` `ParaSelect` for `Below Axis` versus `Top Right Cluster`
- expanded toolbar mode can dock into a top-right cluster where the axis widget sits to the left of the toolbar and the HUD clears the combined footprint
- the already-landed toolbar clamp/overflow behavior still works
- the phase improves navigation and focus without inventing new command behavior

### Completion Read

- open

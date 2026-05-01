# Workspace Phase Workspace-7.5-16 - Console Workspace Modes Entry

## Doc Header

### Doc History
1. 2026-04-30 20:14:30: Closed `Workspace 7.5-16` as shipped after changelog entries `[934]` through `[947]` confirmed Console Workspace Modes root entry, viewport picker, split commands, viewport-type menu, Open In New Browser, Float, Close, alias cleanup, and Spaghetti Editor viewport-type adoption had landed; prepared this record to move from `Future/` to `Shipped/`.
1. 2026-04-03 14:04: Refreshed the shipped `Phase 2 - Workspace Modes Root Branch And Viewport Picker` block after the later console work and the section reformat, tightening the live owner-seam read around `buildRootChoices()`, `createWorkspaceModesRootSession(...)`, `workspaceViewportOptions`, `buildRootPromptText()`, and `buildStagedSummaryBreadcrumb(...)` so the early root-branch phase still reads implementation-ready in the newer `##` layout
1. 2026-04-03 13:58: Completed `Phase 13 - Spaghetti Editor Viewport Type Adoption Plan`, recording that `Workspace Modes` now includes `Spaghetti Editor` inside `Viewport Type Menu`, that the runtime reuses the existing editor-viewport reuse or duplication seam instead of inventing a console-local mount path, and that a successful switch retargets the staged console session to the new live `spaghettiEditor` surface so breadcrumbs and follow-up actions stay attached to the same visible viewport
1. 2026-04-03 13:45: Tightened `Phase 13 - Spaghetti Editor Viewport Type Adoption Plan` into an implementation-ready slice after tracing `src/app/AppShell.tsx` as the real `spaghettiEditor` slot-switch owner seam, locking that the first console pass should reuse `handleViewportSlotSurfaceKindChange(...)` and its editor-viewport reuse or duplication rules, keep protected primary targets out, and retarget the staged console session to the new live `spaghettiEditor` surface after a successful switch
1. 2026-04-03 13:44: Added `Phase 13 - Spaghetti Editor Viewport Type Adoption Plan`, locking the next `Workspace Modes` later-surface slice as a dedicated `Viewport Type` adoption pass for `Spaghetti Editor` rather than mixing it into the earlier generic workspace-mode action phases
1. 2026-04-03 13:43: Updated the shipped `Phase 12` note after split-menu alias cleanup, locking that the split directions now use the direct mnemonic aliases `t`, `r`, `b`, and `l`, while `Back` is promoted within that one submenu so `Split Bottom` can keep `b`
1. 2026-04-03 13:38: Completed `Phase 12 - Guided Alias Simplification Plan`, recording that `Workspace Modes` guided menus now prefer one-letter aliases by default, reserve `b` for `Back` when present, promote only colliding choices to the shortest deterministic menu-local alias, and keep the visible summary hints aligned with the actual accepted workspace-modes aliases
1. 2026-04-03 13:31: Tightened `Phase 12 - Guided Alias Simplification Plan` into an implementation-ready slice, locking that guided menus should prefer one-letter aliases by default, reserve `b` for `Back` when present, promote only colliding choices to two-letter aliases inside the current menu, and keep the first implementation scoped to `Workspace Modes` plus the existing summary-hint surfaces rather than a full staged-console alias rewrite
1. 2026-04-03 13:30: Added `Phase 12 - Guided Alias Simplification Plan`, locking the next console cleanup as a menu-local alias pass where guided choices should prefer one-letter aliases by default and only promote conflicting choices to two letters when a collision exists inside the same active menu
1. 2026-04-03 13:24: Completed `Phase 11 - Close Action Plan`, recording that `Workspace Modes` now exposes `Close` for eligible non-primary `modelViewer`, `browser`, and `console` viewport targets through a dedicated confirmation submenu, that successful close actions reuse the existing workspace slot-removal cleanup rules, and that the console returns to the refreshed `Root > Workspace Modes` picker after the target viewport disappears
1. 2026-04-03 13:19: Tightened `Phase 11 - Close Action Plan` into an implementation-ready slice, locking that the next `Close` pass should reuse the existing workspace close owner seam, keep protected primary targets out of the chosen-viewport action menu, require one explicit confirmation step for destructive close actions, and preserve truthful console breadcrumbs after either cancel or success
1. 2026-04-03 13:16: Completed `Phase 10 - Float Action Plan`, recording that `Workspace Modes` now exposes `Float` for eligible non-primary `modelViewer`, `browser`, and `console` viewport targets, that the runtime path reuses the existing float owner seams instead of inventing console-local float behavior, and that successful float actions keep the staged console session anchored on the same source viewport branch while protected primary targets stay blocked
1. 2026-04-03 13:07: Tightened `Phase 10 - Float Action Plan` into an implementation-ready slice after tracing the shared float owner seams, locking that later workspace-modes float behavior should reuse `floatWorkspaceSurface(...)` with the existing `AppShell` host-state helpers for Browser and Console, treat primary-slot protections explicitly, and keep Float as a chosen-viewport action-family entry rather than mixing it into popout or close behavior
1. 2026-04-03 13:05: Completed `Phase 9 - Open In New Browser Later-Surface Adoption Plan`, recording that Browser now adopts `Open In New Browser` through the existing browser popout seam, that Console remains deferred outside this action family, and that shared workspace viewport labels now keep the one-browser case singular while reserving numbered browser labels for real multi-browser cases
1. 2026-04-03 12:50: Tightened `Phase 9 - Open In New Browser Later-Surface Adoption Plan` into an implementation-ready planning slice, locking that later browser or console adoption must happen per-surface through the existing workspace viewport label helpers, preserve the simple singular `Browser` label when only one live browser target exists, expand into numbered browser labels only when multiple distinct browser targets actually exist, and answer the truthful runtime owner seam before any non-model implementation starts
1. 2026-04-03 12:46: Tightened the later browser-targeting direction for `7.5-16`, locking that future browser viewport labels in `Workspace Modes` should stay singular when only one live browser target exists and only expand to numbered labels like `Browser 1`, `Browser 2`, and later siblings when multiple distinct browser windows are actually open
1. 2026-04-03 12:41: Completed `Phase 7 - Open In New Browser Menu Presence And Surface Gate` and `Phase 8 - Model Viewport Open In New Browser First Implementation`, recording that the chosen-viewport action menu now exposes `Open In New Browser` only for supported `modelViewer` targets, that the runtime path reuses the existing model viewport browser-copy seam with source-camera carryover, and that the console stays on the source viewport branch after success while later-surface adoption remains deferred
1. 2026-04-03 12:29: Tightened `Phase 8 - Model Viewport Open In New Browser First Implementation` into an implementation-ready slice, locking that the first real runtime cut should expose `Open In New Browser` only for supported `modelViewer` targets, reuse the existing model viewport browser-copy owner seam already used by the titlebar action, keep the source viewport as the active in-app console target after success, and defer Browser or other later-surface adoption behind their own follow-up phase
1. 2026-04-03 12:26: Reworked the later `7.5-16` ladder into smaller implementation chunks so `Open In New Browser` is no longer one broad mixed phase, splitting it into a menu-presence or surface-gate phase, a first `modelViewer` implementation phase, and a later-surface adoption phase before the existing `Float` and `Close` planning work
1. 2026-04-03 12:23: Tightened `Phase 7 - Open In New Browser Plan` into an implementation-ready slice, locking that the first console pass should treat `Open In New Browser` as a chosen-viewport action-family entry, ship the action only for supported surfaces with `modelViewer` as the first required adopter, reuse the existing child-window or browser-open owner seams instead of inventing a console-local popup system, and preserve normal breadcrumb or status output plus truthful post-action handoff behavior
1. 2026-04-03 12:21: Updated the shipped `7.5-16` split behavior after live cleanup work, recording that successful workspace-modes split commands now forward the console into the newly created viewport branch under `Root > Workspace Modes > <New Viewport>` instead of leaving the user parked on the source viewport's split submenu
1. 2026-04-03 12:18: Completed `Phase 5 - Chosen Viewport Action Menu Shape`, recording that the chosen-viewport branch now presents `Split Menu`, `Viewport Type Menu`, and `Back` as the stable action-family layer, that the four split directions now live under their own `Split Menu` submenu instead of crowding the chosen-viewport root, and that the existing viewport-type branch now reads as `Viewport Type Menu` so both submenu families share one consistent console shape
1. 2026-04-03 12:08: Completed `Phase 6 - Viewport Type Submenu Plan`, recording that `Workspace Modes` now includes a real chosen-viewport `Viewport Type` submenu with the first safe options `Model Viewport`, `Browser`, and `Console`, that the runtime path reuses the existing surface-kind owner seam while retargeting the staged console session to the new live surface instance after a successful type change, and that `Spaghetti Editor` remains intentionally deferred behind a later safety pass
1. 2026-04-03 12:00: Tightened `Phase 6 - Viewport Type Submenu Plan` into an implementation-ready slice after tracing the existing surface-kind owner seams in `src/app/AppShell.tsx` and `src/app/workspace/useWorkspaceStore.ts`, locking that the next work should shape `Viewport Type` as a chosen-viewport subfamily, ship `Model Viewport`, `Browser`, and `Console` first, defer `Spaghetti Editor` behind a later safety pass, and reuse `handleViewportSlotSurfaceKindChange(...)` / `setViewportSlotSurfaceKind(...)` instead of inventing a console-local viewport-type mutation path
1. 2026-04-03 11:55: Reworked the post-Phase-4 ladder for `Workspace 7.5-16` after chat clarified the preferred expansion order, turning the old broad `Phase 5 - Workspace Modes Section Expansion Plan` into a smaller chosen-viewport action-menu phase and adding follow-on phases for `Viewport Type`, `Open In New Browser`, `Float`, and `Close` so later workspace-mode console growth can ship in narrower, lower-risk slices
1. 2026-04-03 11:50: Completed `Phase 4 - Titlebar Split Console Reporting`, recording that `src/app/AppShell.tsx` now appends a user-selected console activity entry after a real titlebar split succeeds, that the logged viewport label and split wording now match the existing `Workspace Modes` vocabulary, and that focused `AppShell` coverage now protects the new reporting path
1. 2026-04-03 11:49: Tightened `Phase 4 - Titlebar Split Console Reporting` into an implementation-ready slice after tracing the real titlebar split owner seam in `src/app/AppShell.tsx`, locking that the next code cut should hook console reporting at `handleViewportSlotSplit(...)`, log only committed splits as user-selected UI activity with the existing viewport and split wording, and avoid logging menu-open or preview states
1. 2026-04-03 11:45: Reworked the later `7.5-16` phase ladder after chat clarified that viewport titlebar split actions should also report into the console as user-selected workspace activity, adding that cleanup as the new `Phase 4` and pushing the broader `Workspace Modes Section Expansion Plan` down to `Phase 5`
1. 2026-04-03 11:39: Completed `Phase 3 - Viewport Split Direction Commands`, recording that `src/app/console/stagedNavigation.ts` now exposes `Split Top`, `Split Right`, `Split Bottom`, and `Split Left` after viewport selection, that `src/app/console/ConsoleDock.tsx` now executes those choices against the chosen live viewport while keeping the normal breadcrumb and prompt flow active, and that the real working split seam for this console branch is the existing slot-split runtime path plus model-viewer camera restore rather than a new console-local split system
1. 2026-04-03 11:37: Tightened `Phase 3 - Viewport Split Direction Commands` into an implementation-ready slice, locking that the next code cut should extend the existing selected-viewport staged branch in `src/app/console/stagedNavigation.ts` with the four split choices, keep prompt and breadcrumb truth in `src/app/console/ConsoleDock.tsx` and `src/app/console/ConsoleBar.tsx`, and reuse the shared workspace split commit helpers in `src/app/workspace/workspaceSurfaceActions.ts` rather than inventing console-local split behavior
1. 2026-04-03 11:31: Completed `Phase 2 - Workspace Modes Root Branch And Viewport Picker`, recording that `src/app/console/stagedNavigation.ts` now exposes `Workspace Modes` as a real root staged choice with alias `wm`, that `src/app/console/ConsoleDock.tsx` now feeds live workspace viewport labels into the staged-navigation context and prints honest `Root > Workspace Modes` prompt text, and that `src/app/console/ConsoleBar.tsx` now keeps the normal breadcrumb/status summary for the new branch while split-direction execution remains deferred to `Phase 3`
1. 2026-04-03 11:24: Tightened `Phase 2 - Workspace Modes Root Branch And Viewport Picker` into an implementation-ready slice, locking the exact code seams in `src/app/console/stagedNavigation.ts`, `src/app/console/ConsoleDock.tsx`, and `src/app/console/ConsoleBar.tsx`, the narrow workspace-viewport context adapter expected for the viewport list, the explicit boundary that split execution still belongs to Phase 3, and the concrete done-shape for shipping `Root > Workspace Modes > Choose viewport [...]` with normal breadcrumb/status output
1. 2026-04-03 11:18: Completed `Phase 1 - Console Root Entry And Owner Path Research`, replacing the speculative console-read with the traced owner seams in `src/app/console/stagedNavigation.ts`, `src/app/console/ConsoleDock.tsx`, and `src/app/console/ConsoleBar.tsx`, locking that `Workspace Modes` must be added as a real staged root choice, that `wm` should ride the existing alias-matching path, that the normal breadcrumb summary can be preserved through the existing staged-session status renderer, and that the main missing implementation seam is live viewport choice data in the staged-navigation context
1. 2026-04-03 10:57: Tightened `Phase 1 - Console Root Entry And Owner Path Research` into an implementation-ready research slice, locking the exact owner seams to trace in `ConsoleDock.tsx`, `ConsoleBar.tsx`, and `stagedNavigation.ts`, the exact decisions Phase 1 must answer before code starts, and the concrete handoff shape the first implementation slice should receive for `Root > Workspace Modes > Choose viewport [...]`
1. 2026-04-03 10:52: Tightened this phase doc after chat clarified one more console UX rule, locking that the console status should continue printing normal breadcrumbs throughout the `Workspace Modes` flow rather than switching to a one-off status style or hiding path context once the user enters the viewport and split branches
1. 2026-04-03 10:46: Expanded this phase doc after chat clarified the intended console conversation shape, locking that `>` should be read as console-enter shorthand during planning, that `Root > Workspace Modes > Choose viewport [...]` should lead into a viewport-targeted split menu, standardizing the split wording to `Split Top`, `Split Right`, `Split Bottom`, and `Split Left`, and breaking the work into a clearer multi-phase ladder so the first implementation slice can stay narrow while future workspace-mode actions still have a stable console home
1. 2026-04-03 10:02: Added this future phase doc after chat chose the next workspace cleanup target, locking that the console root should gain a new `Workspace Modes` entry with alias `wm` that enters a dedicated workspace-modes console section rather than leaving workspace-mode actions scattered across unrelated console paths

### Purpose

Use this phase to add an honest console entry for workspace-mode actions.

The goal is:
- one clear `Workspace Modes` root entry in the console
- one short alias `wm` that can enter the same section quickly
- one dedicated console section for workspace-mode options instead of scattering those options across unrelated roots or one-off commands
- one honest viewport-targeted split flow inside that section

### Scope

This phase covers:
- the root console choice for `Workspace Modes`
- the `wm` alias
- the dedicated console section entered from that root choice
- ownership of workspace-mode console navigation inside the staged console flow
- choosing a viewport inside that section
- the first workspace-mode action ladder for split directions
- deciding which later workspace-mode actions should be deferred until after the first split flow ships

This phase does not cover:
- broad console visual redesign
- unrelated Browser or graph command restructuring
- viewport header or split-menu work already covered by the workspace-mode docs
- full implementation of every future workspace-mode command before the section contract is defined

## Doc Body

### Summary

`Workspace 7.5-16` is the next workspace cleanup target after the local model viewport toolbar work closed.

It exists because workspace-mode behavior is now important enough to deserve a real console home:
- the console already has a `Root > Choose next [...]` structure
- workspace-mode actions are becoming a real user-facing system
- but there is not yet one obvious root-level path for entering those workspace-mode options

The intended product truth is:
- from `Root`, the console should offer `Workspace Modes`
- `wm` should be the short alias
- selecting either path should enter a dedicated workspace-modes console section
- that section should become the canonical console home for workspace-mode actions rather than burying them under unrelated roots

The intended first conversation shape is:
- `Root > Workspace Modes`
- `Workspace Modes > Choose viewport [Model Viewport 1, Browser Viewport 2, ...]`
- `Workspace Modes > <Chosen Viewport> > Choose next [Split Top, Split Right, Split Bottom, Split Left]`
- the console status should keep printing normal breadcrumbs at each step of that flow

Planning shorthand:
- during this phase, `>` means `enter`
- example: `Workspace Modes > Model Viewport 1 > Split Right`

### Locked Direction

`Workspace 7.5-16` should be:
- a focused console entry and navigation phase for workspace modes
- a staged-console structure cleanup
- research-first before command breadth is widened

`Workspace 7.5-16` should not be:
- a grab-bag of every workspace command at once
- a hidden rewrite of the whole console root structure
- a replacement for viewport header menus or right-click split actions
- a broad command-parser redesign unless the staged navigation research proves that is necessary
- a mixed first slice that tries to ship split, float, popout, viewport type, and close all at once

### Current Read

Chat-locked product direction:
- `Root` should gain a new choice named `Workspace Modes`
- alias should be `wm`
- entering that choice should open a dedicated workspace-modes console section
- inside that section the user should first choose a viewport
- after choosing a viewport, the first action set should be:
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`
- use `Split Bottom`, not `Split Down`, so the console language matches the existing viewport menu language

Current likely owner seam:
- the real root staged-navigation owner seam lives in `src/app/console/stagedNavigation.ts`
- the prompt transcript text and visible `Choose next [...]` prompt rendering live in `src/app/console/ConsoleDock.tsx`
- the visible breadcrumb summary or status line lives in `src/app/console/ConsoleBar.tsx`

Current main questions:
- how viewport choices should be labeled in a user-facing way
- how the chosen viewport should map to the existing workspace slot or surface identity
- whether the first shipped branch should stay split-only before later widening into float, popout, viewport type, or close actions
- whether this should remain root-global or adapt to current workspace context later

Current shipped truth:
- `Workspace Modes` now has a real chosen-viewport action layer with `Split Menu`, `Viewport Type Menu`, and `Back`
- `Split Menu` owns the four split directions one level deeper
- `Viewport Type Menu` owns the first safe surface switches one level deeper
- successful split commands now forward the console into the newly created viewport branch so the next workspace action naturally targets the new pane
- the current shipped `Viewport Type Menu` options are `Model Viewport`, `Browser`, `Console`, `Spaghetti Editor`, and `Back`
- a successful type change reuses the existing surface-kind owner seam and then retargets the staged console session to the new live surface instance so breadcrumbs and follow-up actions stay attached to the same visible viewport
- `Viewport Type > Spaghetti Editor` now reuses the existing editor-viewport reuse or duplication seam so the console does not invent a console-local editor mount path
- eligible non-primary `modelViewer`, `browser`, and `console` viewport targets now expose `Float`
- successful float commands reuse the existing host-specific float seams and keep the staged console session anchored on the same source viewport branch after the action completes
- protected primary viewport targets keep `Float` blocked from the chosen-viewport menu
- eligible non-primary `modelViewer`, `browser`, and `console` viewport targets now expose `Close`
- `Close` now routes through a dedicated confirmation submenu before execution
- successful close commands reuse the existing workspace slot-removal cleanup rules and then return the console to the refreshed `Root > Workspace Modes` picker
- the split submenu now uses direct mnemonic aliases `t`, `r`, `b`, and `l` for `Top`, `Right`, `Bottom`, and `Left`
- `Back` is promoted only inside that submenu so `Split Bottom` can keep `b`

Desired invariant:
- typing `Workspace Modes` or `wm` from `Root` enters the same section
- the new section reads like one honest console family, not a token alias hack
- future workspace-mode options can grow inside this section without making `Root` noisy
- the first shipped branch is target-first:
- choose viewport
- then choose split direction
- no hidden target guessing
- the console status continues to print breadcrumbs normally throughout the branch

### Phase 1 Findings

#### Root choice owner
- `src/app/console/stagedNavigation.ts` owns the real root staged choices through `buildRootChoices()`
- `createConsoleRootSession()` in that same file seeds `scopeId: 'root'`, `breadcrumb: ['Root']`, and `validChoices: buildRootChoices()`
- Phase 2 should add `Workspace Modes` here as a real `ConsoleStagedNavigationChoice`, not as a one-off parser exception

#### Alias matching owner
- `src/app/console/stagedNavigation.ts` also owns staged alias matching through `matchesChoice(...)`
- that matcher already supports:
- `canonicalToken`
- full label
- compact label without spaces
- explicit `aliases`
- `submitConsoleStagedNavigationToken(...)` reuses that same matcher for both fresh root entry and active root sessions
- Phase 2 should therefore wire `wm` as a normal staged-choice alias on the new `Workspace Modes` root choice

#### Prompt transcript owner
- `src/app/console/ConsoleDock.tsx` owns the visible staged prompt transcript through `buildStagedPromptText(...)`
- `formatStagedBreadcrumb(...)` in that file already prints the normal `Root > ...` breadcrumb text used in the transcript
- `buildRootPromptText()` still hardcodes the fallback root choice labels, so Phase 2 must extend that root prompt list to include `Workspace Modes` or the console transcript will lie about what the root offers

#### Visible breadcrumb or status owner
- `src/app/console/ConsoleBar.tsx` owns the visible staged summary breadcrumb through `buildStagedSummaryBreadcrumb(...)`
- that function already returns normal breadcrumb output for known staged branches and falls back to `Choose next` only for unknown shapes
- Phase 2 should add explicit `Workspace Modes` scope handling there so the branch keeps normal breadcrumb/status output instead of degrading into the fallback summary

#### New branch-shape owner
- `src/app/console/stagedNavigation.ts` is also the right place to add new workspace-modes `scopeId` values and branch transitions
- the next implementation slice should model `Workspace Modes` as a normal staged family with:
- one root-entered branch for viewport selection
- one viewport-targeted branch for split direction selection
- `BACK` should continue to ride the existing staged-navigation back path instead of inventing custom escape rules

#### Missing viewport-data seam
- the current `ConsoleStagedNavigationContext` in `src/app/console/stagedNavigation.ts` does not yet carry workspace viewport choice data
- `src/app/console/ConsoleDock.tsx` already has access to workspace slot state and already builds the staged-navigation context from store state
- the strongest current direction is therefore:
- add one narrow workspace-viewport adapter into the staged-navigation context
- generate user-facing labels like `Model Viewport 1` and `Browser Viewport 2` from live workspace slots
- avoid leaking raw slot ids into the visible console choice labels

#### Split commit reuse seam
- Phase 1 did not need to finalize the concrete split call site yet, but the console branch should stay target-first and reuse an existing workspace split commit seam instead of inventing new split truth inside the console layer
- the next implementation pass should trace the exact split action owner only far enough to wire:
- chosen viewport
- chosen direction
- existing workspace split commit

### Phase 1 Handoff

Phase 1 now locks these concrete implementation inputs for Phase 2:
- add `Workspace Modes` as a real root staged choice in `buildRootChoices()`
- add `wm` as a normal alias on that same choice
- update `buildRootPromptText()` so the root prompt truth includes `Workspace Modes`
- add explicit `Workspace Modes` scope handling in `buildStagedSummaryBreadcrumb(...)` so breadcrumbs keep printing normally
- extend `ConsoleStagedNavigationContext` with live viewport choice data rather than inventing a separate ad hoc workspace picker source
- keep viewport labels user-facing and stable, using labels like `Model Viewport 1` and `Browser Viewport 2`
- keep the first branch split-only after viewport selection:
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`
- defer `Viewport Type`, `Float`, `Open In New Browser`, and `Close` until after the split-only branch proves the section shape

### Likely Files

- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/consoleTypes.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace Mode Rules - Simple.md`

### Research Questions

#### Question 1 - Where should `Workspace Modes` live in the root choice list?
- decide how it should be ordered relative to existing root choices
- preserve root readability while still making workspace modes easy to discover

#### Question 2 - What should the first dedicated section contain?
- define the first stable options inside `Workspace Modes`
- the current preferred first shape is:
- `Choose viewport [Model Viewport 1, Browser Viewport 2, ...]`
- then `Choose next [Split Top, Split Right, Split Bottom, Split Left]`
- avoid dumping every workspace action into the section before a clean structure exists

#### Question 3 - What is the right alias contract?
- lock `wm` as the fast alias
- ensure the alias is readable and deterministic in breadcrumbs, prompt sessions, and choice summaries

#### Question 3.5 - How should viewport labels read?
- prefer user-facing labels like `Model Viewport 1` and `Browser Viewport 2`
- avoid leaking raw slot ids or unstable implementation identifiers into the console

#### Question 4 - What should remain outside this section?
- keep viewport header menus and direct UI gestures as first-class paths
- avoid using the console section as a backdoor replacement for all visible workspace controls

#### Question 5 - How should console status read while navigating?
- keep the normal breadcrumb-style console status
- do not switch `Workspace Modes` into a one-off status format
- make sure each level still prints path context like the rest of the console

### Implementation Readiness

`Workspace 7.5-16` is ready to become the next research-first cleanup target.

The next pass should first trace:
- how `Root` choices are assembled
- how aliases are matched
- how new staged sections are represented
- how breadcrumbs should read once the user enters `Workspace Modes`
- how the normal console status line is produced so the new branch reuses that same breadcrumb output

After that, the first implementation slice should stay narrow:
- add the root entry
- add the `wm` alias
- add one dedicated workspace-modes section shell
- let the user choose a viewport
- let the user choose one of the four split directions
- keep wider workspace-mode actions for later phases

### Recommended Next Cut

Strongest first planning slice:
- trace the current root staged-navigation contract in `ConsoleDock.tsx`, `ConsoleBar.tsx`, and `stagedNavigation.ts`
- identify the exact owner seam for root choices, alias matching, and child-session creation
- define the first `Workspace Modes` submenu shape before implementation begins
- confirm how viewport targets should be listed and labeled
- confirm which existing split commit seam should fire after the user chooses a viewport plus direction
- confirm that the new branch can reuse the same normal breadcrumb/status rendering without special cases

Implementation-ready carry-forward:
- `Root > Workspace Modes` should be the visible long form
- `wm` should enter the same branch
- breadcrumbs should read honestly as `Root > Workspace Modes`
- console status should keep printing those breadcrumbs the same way it does elsewhere
- the first implementation should create the section shell before widening into a long action list
- the first shipped action set should stay split-only:
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`
- later actions like `Float`, `Open In New Browser`, `Viewport Type`, or `Close` should land only after the target-selection shape is proven

### Phase Sections

## [x] Phase 1 - Console Root Entry And Owner Path Research
### info
Purpose:
- trace the root staged-console owner seam before adding the new `Workspace Modes` branch

Current read:
- `ConsoleDock.tsx`, `ConsoleBar.tsx`, and `stagedNavigation.ts` likely already own the root `Choose next [...]` path, alias handling, and staged child-session transitions needed for this feature
- the goal of Phase 1 is not to redesign the console
- the goal is to prove the exact insertion seam for:
- root entry registration
- alias matching
- breadcrumb or status output
- viewport choice generation
- child-branch creation for the split-direction step

Main work:
- trace where `Root > Choose next [...]` choices are assembled
- trace where typed aliases are matched against staged choices
- trace where breadcrumb and status text are rendered for the active staged branch
- trace how a new child staged branch is created after the user chooses a token
- define the exact initial `Workspace Modes` branch shape:
- `Root > Workspace Modes`
- `Workspace Modes > Choose viewport [...]`
- `Workspace Modes > <Chosen Viewport> > Choose next [Split Top, Split Right, Split Bottom, Split Left]`
- confirm how viewport choices should be sourced from live workspace state
- confirm how viewport labels should be rendered in user-facing language
- confirm which existing workspace split action seam should be reused once the user chooses viewport plus direction

Implementation boundaries:
- stay inside console and staged-navigation owner seams unless research proves a tiny workspace-state adapter is required
- prefer tracing:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/consoleTypes.ts`
- only widen into workspace files if needed to source a viewport list or call an existing split action
- do not start implementing split actions, viewport switching, or later workspace-mode commands during Phase 1

Phase 1 must answer:
- where to insert `Workspace Modes` into the root choice list
- how `wm` should map to the same branch
- what shape the staged session or prompt session must take for the viewport picker
- what stable data should back viewport choices
- how to label viewport choices like `Model Viewport 1` without leaking raw ids
- how the console will keep its normal breadcrumb/status output in this branch
- which existing split commit seam should be called in Phase 3

Expected outputs from Phase 1:
- one exact owner-path read for root-choice insertion
- one exact owner-path read for alias matching
- one exact owner-path read for breadcrumb/status rendering
- one exact recommendation for viewport label generation
- one exact branch contract the first implementation slice can follow without guessing
- one explicit note about what is intentionally deferred until after the split-only branch ships

Done shape:
- the doc identifies the exact owner seam for root entry insertion
- the branch label and alias are locked as `Workspace Modes` / `wm`
- the next implementation slice can add the new branch without guessing about console root structure
- the first conversation shape is locked as:
- `Root > Workspace Modes > Choose viewport [...] > Choose next [Split Top, Split Right, Split Bottom, Split Left]`
- breadcrumb/status behavior is locked to the normal console pattern, not a special-case display
- viewport-label sourcing and split-action reuse are both traced well enough that Phase 2 can begin as a narrow implementation slice instead of another exploratory pass

## [x] Phase 2 - Workspace Modes Root Branch And Viewport Picker
### info
Purpose:
- add the first real console branch for workspace modes up through viewport selection

Current read:
- this phase is already shipped, but the same owner read still matters for later console cleanup work
- the real root-choice seam is still `buildRootChoices()` in `src/app/console/stagedNavigation.ts`
- the real first workspace-modes session seam is still `createWorkspaceModesRootSession(...)` in that same file
- the live viewport picker still enters through `workspaceViewportOptions` on `ConsoleStagedNavigationContext`
- root prompt transcript truth still lives in `buildRootPromptText()` inside `src/app/console/ConsoleDock.tsx`
- visible breadcrumb or status truth still lives in `buildStagedSummaryBreadcrumb(...)` inside `src/app/console/ConsoleBar.tsx`
- the narrow data adapter direction still holds: workspace-modes viewport choice data should come from the staged-navigation context, not from a separate console-only list

Main work:
- add `Workspace Modes` as a real root staged choice in `buildRootChoices()`
- add `wm` as an alias on that same staged choice
- extend the staged-navigation scope union with the workspace-modes branch scopes needed for:
- `Root > Workspace Modes`
- `Workspace Modes > Choose viewport [...]`
- create the first child staged session entered by either `Workspace Modes` or `wm`
- extend the staged-navigation context with live viewport choice data sourced from workspace state
- generate stable user-facing viewport labels such as:
- `Model Viewport 1`
- `Browser Viewport 2`
- avoid showing raw viewport ids or slot ids in visible choice labels
- update the root prompt transcript list in `ConsoleDock.tsx` so the visible root prompt truth includes `Workspace Modes`
- update `ConsoleBar.tsx` so the visible summary breadcrumb continues to read normally inside the new branch
- preserve normal staged-navigation `BACK` behavior inside the new branch
- stop at viewport selection; do not implement split direction choices or split execution yet

Implementation boundaries:
- keep the work inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- only widen far enough to source live viewport metadata for the staged-navigation context
- do not add split commands in this phase
- do not wire any workspace split commit action in this phase
- do not add `Viewport Type`, `Float`, `Open In New Browser`, or `Close` in this phase
- do not redesign root prompt styling, command transcript styling, or console summary rendering beyond the minimum needed for the new branch to participate honestly

Phase 2 must answer:
- where `Workspace Modes` should sit in the visible root choice order
Answer:
- as a real root staged choice rather than a one-off parser exception
- what exact staged session shape should represent the viewport-picker level
Answer:
- a dedicated `workspaceModesRoot` session created by `createWorkspaceModesRootSession(...)`
- what live workspace data is sufficient to build viewport choices deterministically
Answer:
- `workspaceViewportOptions` carrying viewport id, slot id, label, surface kind, and primary-state truth
- how viewport numbering should remain stable and readable enough for users
Answer:
- through shared user-facing labels such as `Model Viewport 1` and `Browser Viewport`, not raw ids
- how the console transcript and visible breadcrumb summary should read at:
- `Root`
- `Root > Workspace Modes`
- `Workspace Modes > Choose viewport [...]`
Answer:
- through the normal `buildRootPromptText()` and `buildStagedSummaryBreadcrumb(...)` surfaces without a special status renderer
- how `BACK` should behave from the viewport-picker level without adding a custom escape path
Answer:
- use the existing staged-navigation back behavior and return cleanly to `Root`

Expected outputs from Phase 2:
- one shipped root entry named `Workspace Modes`
- one shipped alias `wm`
- one working `Workspace Modes` staged branch shell
- one viewport picker rendered from live workspace state
- one honest breadcrumb or status path through the viewport-picker level
- one stable base branch that Phase 3 can widen into split-direction choices without reopening root-entry questions

Done shape:
- `Root > Choose next [...]` includes `Workspace Modes`
- typing `wm` enters the same branch
- breadcrumbs and prompt sessions read honestly as `Root > Workspace Modes`
- the branch becomes the stable place for future workspace-mode console actions
- the user can choose a viewport target from inside `Workspace Modes`
- console status still prints the breadcrumb path normally
- viewport choices are sourced from live workspace state through the staged-navigation context rather than through a one-off console-only list
- the branch stops cleanly at viewport selection, leaving split-direction commands explicitly deferred to Phase 3
- the live code seams remain easy to point at later:
- `buildRootChoices()`
- `createWorkspaceModesRootSession(...)`
- `workspaceViewportOptions`
- `buildRootPromptText()`
- `buildStagedSummaryBreadcrumb(...)`

## [x] Phase 3 - Viewport Split Direction Commands
### info
Purpose:
- add the first real workspace-mode action set after the user chooses a viewport

Current read:
- the first action set should stay split-only so the branch contract remains understandable
- the selected viewport branch now exposes the four split directions in `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx` now resolves the chosen viewport id back to the live workspace slot and executes the requested split
- the truthful runtime seam for this branch is the existing slot split path used for slotted viewport duplication
- model-viewer splits also restore the source camera pose onto both viewers after the split so console-issued splits match the main shell behavior

Main work:
- widen the existing `workspaceModeViewportSelected` staged branch in `src/app/console/stagedNavigation.ts`
- after viewport selection, replace the temporary `Back`-only holding scope with:
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`
- keep the split tokens and labels aligned with the existing viewport menu wording
- preserve honest breadcrumbs as:
- `Root > Workspace Modes > <Viewport Label>`
- preserve the normal `Choose next [...]` prompt pattern and normal summary breadcrumb pattern
- add the minimal execute result metadata needed for the console layer to know:
- selected viewport id
- selected split side
- route the actual split commit through the live workspace slot split seam rather than through console-local branching
- keep `BACK` behavior normal:
- from split choices back to the viewport picker
- from viewport picker back to `Root`

Implementation boundaries:
- keep the new branch logic inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- reuse the existing workspace slot split runtime truth for split execution
- do not widen into later workspace-mode actions like `Viewport Type`, `Float`, `Open In New Browser`, or `Close`
- do not redesign the viewport picker introduced in Phase 2
- do not invent a separate console-only split system

Phase 3 must answer:
- what exact staged choice tokens should represent the four split directions
- what execute result shape should carry viewport id plus split side out of staged navigation
- how the selected viewport id should resolve back to the correct live workspace slot split call
- how model-viewer camera persistence should stay truthful when the split is issued from the console instead of the header menu
- how breadcrumbs and prompt text should read before and after split execution
- how the active prompt should behave after a split succeeds:
- remain inside the chosen viewport branch
- or return to the viewport picker

Expected outputs from Phase 3:
- one selected-viewport branch that now exposes the four split direction choices
- one console execution path that commits the split against the chosen viewport
- one reused live workspace slot split path instead of console-local split truth
- one focused regression set covering:
- staged branch shape
- breadcrumb/status output
- split execution against a chosen viewport target

Done shape:
- after choosing a viewport, the console offers the four split directions
- choosing one of those directions executes the expected split on the chosen viewport
- console language matches the existing viewport-menu language exactly
- console status still behaves like the rest of the console and does not drop breadcrumb context
- split execution reuses the truthful live workspace slot split path instead of a console-only split path
- later workspace-mode commands remain deferred until the split-only branch proves itself

## [x] Phase 4 - Titlebar Split Console Reporting
### info
Purpose:
- make viewport titlebar split actions report into the console as user-selected workspace activity

Current read:
- titlebar-driven split actions now report into the console as user-selected workspace activity
- `src/app/AppShell.tsx` owns that reporting through the real split commit seam in `handleViewportSlotSplit(...)`
- the logged viewport labels now match the existing workspace-modes console numbering and wording
- menu-open, hover, and preview states still remain unlogged in this phase

Main work:
- add one titlebar split console entry at the real successful split commit point in `src/app/AppShell.tsx`
- use one user-facing activity shape such as:
- `User selected: Model Viewport 1 > Split Right`
- log only committed split actions, not menu open, hover, or preview states
- keep the event source truthful so console-issued split commands and user-selected titlebar actions remain distinguishable
- route the reporting through the real successful titlebar split commit path rather than through the menu presentation layer
- reuse the same viewport label vocabulary already used in the `Workspace Modes` console flow:
- `Model Viewport 1`
- `Browser Viewport 2`
- keep the split wording aligned with the existing titlebar menu and console branch:
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`
- keep the console layer assignment honest for UI-originated workspace activity, not typed commands
- add focused regression coverage for:
- one successful titlebar split appends the expected console entry
- the entry reads as user-selected UI activity
- menu-open or preview states do not log anything

Implementation boundaries:
- keep the reporting logic attached to the existing titlebar split commit path in `src/app/AppShell.tsx`
- reuse the existing console append helper rather than inventing a second reporting pipe
- do not widen this slice into new workspace-mode console actions or root-branch changes
- do not add logging for menu-open, hover, split-preview, float, or popout behavior in this phase

Phase 4 must answer:
- what exact console layer should own UI-originated split activity entries
- what exact viewport-label helper or local label-building seam should be reused in `AppShell.tsx`
- whether the console entry should log only the final action text or also include a stable `User selected:` prefix
- how to keep titlebar split logging aligned with the console-issued split vocabulary without duplicating label logic in multiple places

Expected outputs from Phase 4:
- one titlebar split reporting path hooked at the real successful split commit seam
- one user-selected console entry shape for viewport titlebar split actions
- one focused regression set covering successful log emission and no-log-on-menu-open truth

Done shape:
- right-click titlebar split actions emit a console entry after the split really succeeds
- the console wording clearly reads as user-selected UI activity rather than typed console input
- the viewport label and split wording match the existing workspace-mode vocabulary exactly
- console-issued split entries and titlebar split entries remain distinguishable by source wording rather than collapsing into one ambiguous log style

## [x] Phase 5 - Chosen Viewport Action Menu Shape
### info
Purpose:
- decide the stable top-level action menu that should live under a chosen viewport once split-only mode proves itself

Current read:
- the next growth step should not flatten every future workspace action into one crowded chosen-viewport menu
- `Split` has already proven the chosen-viewport branch shape
- the next planning slice should lock whether later actions live directly in the chosen viewport branch or under smaller action families
- the shipped direction is now:
- `Root > Workspace Modes > <Viewport> > Choose next [Split Menu, Viewport Type Menu, Back]`
- with `Split Menu` and `Viewport Type Menu` behaving as explicit subfamilies instead of trying to inline every subchoice at one level

Main work:
- decide whether the chosen viewport branch should become a stable action menu with:
- `Split Menu`
- `Viewport Type Menu`
- `Float`
- `Open In New Browser`
- `Close`
- `Back`
- decide which of those should be direct actions versus subfamilies
- lock that `Split` remains a subfamily rather than being collapsed back into the parent menu
- lock that `Viewport Type` should be the first follow-on implementation phase after the menu shape is chosen
- explicitly defer implementation of the later actions until their own narrower phases

Done shape:
- the chosen viewport branch now has one explicit stable action-menu shape:
- `Split Menu`
- `Viewport Type Menu`
- `Back`
- `Split Menu` and `Viewport Type Menu` each own their own submenu layer instead of flattening their concrete options into the chosen-viewport root
- the order of later implementation phases remains explicit for `Open In New Browser`, `Float`, and `Close`
- later console workspace-mode growth can happen without reopening the first branch contract

## [x] Phase 6 - Viewport Type Submenu Plan
### info
Purpose:
- define the first post-split implementation slice for changing a chosen viewport's surface type from inside `Workspace Modes`

Current read:
- `Viewport Type` is the strongest next action after `Split` because it fits the same viewport-targeted model cleanly and stays lower-risk than destructive or host-changing actions
- the existing owner seam is already present in `src/app/AppShell.tsx` through `handleViewportSlotSurfaceKindChange(...)`
- that handler already sits on top of `setViewportSlotSurfaceKind(...)` in `src/app/workspace/useWorkspaceStore.ts`, which is the truthful place to preserve viewport identity while changing the slotted surface kind
- the safest first slice should offer:
- `Model Viewport`
- `Browser`
- `Console`
- `Spaghetti Editor` should stay deferred until a later safety pass because its lifecycle and retained-surface rules are more specialized than the first three viewport kinds

Main work:
- shape `Viewport Type` as a real chosen-viewport subfamily under:
- `Root > Workspace Modes > <Viewport> > Viewport Type Menu > Choose next [...]`
- offer these first options:
- `Model Viewport`
- `Browser`
- `Console`
- defer `Spaghetti Editor` behind a later safety pass instead of mixing it into the first submenu implementation
- keep the submenu vocabulary aligned with the existing viewport-menu wording and visible surface names
- route the actual type change through the existing owner seam:
- `handleViewportSlotSurfaceKindChange(...)` in `src/app/AppShell.tsx`
- `setViewportSlotSurfaceKind(...)` in `src/app/workspace/useWorkspaceStore.ts`
- define how the chosen viewport id from `Workspace Modes` resolves back to the correct `slotId` for that owner seam
- keep normal breadcrumbs and prompt flow through the submenu
- add focused regression coverage for:
- staged submenu shape
- execute result metadata carrying viewport id plus chosen type
- one successful viewport-type change against a chosen viewport target

Implementation boundaries:
- keep the new branch logic inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- reuse the existing `AppShell` / workspace-store surface-kind owner path for the actual mutation
- do not widen this slice into `Open In New Browser`, `Float`, or `Close`
- do not add `Spaghetti Editor` to the first viewport-type implementation slice

Phase 6 must answer:
- what exact staged choice tokens should represent the first `Viewport Type` options
- what execute result shape should carry chosen viewport id plus chosen surface kind out of staged navigation
- how the selected viewport id should resolve back to the correct `slotId` for `handleViewportSlotSurfaceKindChange(...)`
- how breadcrumbs and prompt text should read before and after a successful type change
- how to keep `Viewport Type` aligned with the existing viewport-menu vocabulary without duplicating surface-label truth in multiple places

Expected outputs from Phase 6:
- one chosen-viewport submenu for `Viewport Type`
- one first implementation set limited to `Model Viewport`, `Browser`, and `Console`
- one reused surface-kind owner path instead of console-local viewport-type mutation logic
- one focused regression set covering submenu shape and successful viewport-type execution

Done shape:
- `Workspace Modes` now includes a real chosen-viewport `Viewport Type` submenu under the selected viewport branch
- the first shipped options are `Model Viewport`, `Browser`, `Console`, and `Back`
- successful split commands now hand off to the newly created viewport branch under `Root > Workspace Modes > <New Viewport>`
- successful viewport-type changes reuse the existing surface-kind owner seam and then retarget the staged console session to the new live surface instance so the breadcrumb and active submenu stay truthful
- `Spaghetti Editor` remains deferred to a later safety pass

## [x] Phase 7 - Open In New Browser Menu Presence And Surface Gate
### info
Purpose:
- lock the safe first menu shape for `Open In New Browser` before wiring any real child-window behavior

Current read:
- `Open In New Browser` is the next highest-value action-family entry now that the chosen-viewport menu shape is stable
- this action is surface-specific, especially for `modelViewer`, where the intended behavior is a copy-open path rather than a destructive detach
- the safest next step is to first lock menu presence and surface gating separately from the actual runtime open behavior
- `modelViewer` should be the only required visible adopter in the first shipped console pass unless another surface already has product-truthful open behavior that we explicitly bless
- the shipped gate is now:
- expose `Open In New Browser` only when the selected workspace-modes viewport is a supported `modelViewer`
- keep Browser, Console, and later surfaces out of this action path until their browser-open product truth is explicitly defined

Main work:
- shape `Open In New Browser` as a chosen-viewport action-family entry under:
- `Root > Workspace Modes > <Viewport> > Open In New Browser`
- decide which viewport kinds should expose the action in the first shipped pass
- lock `modelViewer` as the first required visible supported surface
- decide whether unsupported viewport kinds should:
- hide the action
- remain visible but report that the action is unavailable
- or stay deferred outside the chosen-viewport menu entirely until their behavior is defined
- lock the console wording so model viewport copy behavior reads as `Open In New Browser` rather than `Pop Out`
- lock the post-action handoff rule now so the later implementation slice has a fixed expectation
- add focused regression coverage for:
- staged action presence or absence by supported surface kind
- truthful unsupported-surface handling if unsupported surfaces remain visible in the menu

Implementation boundaries:
- keep the branch shaping inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- do not implement the real open behavior yet in this phase
- do not widen this slice into `Float` or `Close`
- do not force Browser or other surfaces into the first pass unless their current browser-open behavior is already product-truthful

Phase 7 must answer:
- what exact staged choice token should represent `Open In New Browser`
- which surface kinds should expose that choice in the first shipped pass
- whether unsupported surfaces should hide the action or report a blocked path
- how breadcrumbs and prompt text should read before and after a successful open
- whether the console should remain on the source viewport branch after open or hand off elsewhere

Expected outputs from Phase 7:
- one chosen-viewport action-family entry for `Open In New Browser`
- one locked first supported-surface set with `modelViewer` required
- one focused regression set covering menu presence and any intentional unsupported-surface behavior

Done shape:
- the `Open In New Browser` branch is explicit and implementation-ready at the menu-contract level
- the first supported-surface scope is locked tightly enough for a narrow `modelViewer` code slice
- the post-action console handoff rule is defined before runtime implementation starts
- the chosen-viewport action menu now exposes `Open In New Browser` only for supported `modelViewer` targets
- unsupported viewport kinds currently omit the action instead of surfacing a blocked placeholder path
- the post-action console handoff rule is now proven live: the console remains on the source viewport branch after a successful browser-copy open

## [x] Phase 8 - Model Viewport Open In New Browser First Implementation
### info
Purpose:
- ship the first real `Open In New Browser` runtime behavior for `modelViewer` from the workspace-modes console path

Current read:
- `modelViewer` already has the clearest product truth for this action: open a copy in a new browser window while the in-app viewport stays where it is
- the strongest next slice should reuse the existing model viewport child-window or browser-open owner seam already used by the titlebar control
- the safest console handoff is to stay on the source viewport branch after success because the new browser window is not part of the same in-app workspace tree
- the safest first pass should not expose the action for unsupported surface kinds in the same menu path unless their open behavior is already separately blessed
- the shipped runtime path now reuses the existing detached model-viewer copy seam, restores the source camera onto the new browser copy, and leaves the source viewport as the active in-app workspace-modes target

Main work:
- expose `Open In New Browser` for supported `modelViewer` targets in the chosen-viewport action menu
- route the actual execution through the existing model viewport open or copy owner seam instead of inventing console-local popout logic
- keep the action wording and app log text aligned with the titlebar behavior
- preserve normal breadcrumbs, prompt text, and source-viewport targeting after success
- add focused regression coverage for:
- staged action presence on a supported model viewport
- one successful model viewport open flow
- truthful post-action console handoff staying on the source viewport branch
- truthful absence or block behavior for non-`modelViewer` surfaces in this first implementation pass

Implementation boundaries:
- keep branch shaping inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- reuse the existing model viewport runtime open or copy seam for the actual behavior
- prefer reusing the same runtime helper or commit path that the titlebar `Open In New Browser` action already relies on
- keep viewport-label truth shared with the existing workspace viewport label helpers
- do not widen this slice into Browser, Console, `Float`, or `Close`

Phase 8 must answer:
- what exact staged action token should represent `Open In New Browser` for the chosen viewport branch
- how supported `modelViewer` targets should expose that action while unsupported surface kinds remain hidden or blocked
- which concrete runtime helper or owner seam should execute the browser-copy behavior without duplicating the titlebar implementation
- what console app-log message should report success in language consistent with the titlebar action
- how the staged session and prompt should look immediately after a successful open while staying on the source viewport branch

Expected outputs from Phase 8:
- one staged action path for `Open In New Browser` on supported `modelViewer` targets
- one reused runtime browser-copy seam instead of console-local popup logic
- one focused regression set covering action presence, successful open, and post-action source-viewport continuity

Done shape:
- `modelViewer` can open a browser copy from the console workspace-modes branch
- the source viewport remains the active in-app target after success
- the console wording matches the shipped titlebar language
- Browser and other later surfaces remain deferred outside this first implementation slice
- focused staged-navigation and console regressions now cover action presence, successful browser-copy execution, and source-viewport continuity after open

## [x] Phase 9 - Open In New Browser Later-Surface Adoption Plan
### info
Purpose:
- decide whether Browser, Console, or other viewport kinds should adopt `Open In New Browser` after the first `modelViewer` pass proves itself

Current read:
- later adoption should only happen per-surface after confirming that each surface already has honest reusable browser-open behavior
- Browser especially may need a separate product truth because copied-shell behavior and detached-surface behavior are not always the same thing
- future browser-targeting labels should stay simple when only one live browser target exists
- numbering like `Browser 1`, `Browser 2`, and later siblings should appear only when multiple distinct live browser windows are actually available to choose from
- the strongest next slice should likely start as browser-target planning first, not a mixed Browser-plus-Console implementation push
- viewport-label scaling should stay owned by the shared workspace viewport label helpers rather than inventing a console-only browser numbering system
- the shipped later-surface adoption now includes Browser through the existing browser popout seam while Console remains deferred outside this action family

Main work:
- evaluate Browser, Console, and any later surfaces one by one
- lock whether each surface should:
- adopt the action
- stay hidden
- or use a different later workspace action instead
- define how future browser viewport labels should scale from one visible browser target to multiple distinct browser targets without forcing unnecessary `Browser 1` wording in the one-browser case
- avoid forcing multiple surface adoptions into the first `modelViewer` implementation slice
- trace whether Browser already has a truthful reusable `Open In New Browser` runtime seam or whether it actually wants a different later action contract
- decide whether Console should ever adopt this action at all or remain outside the browser-open family
- decide whether the next code slice should be:
- menu-presence-only for one later surface
- browser-only runtime adoption
- or a smaller browser-labeling prerequisite before any later-surface runtime work

Implementation boundaries:
- keep the planning and later menu-shaping work anchored in:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- keep viewport-label truth anchored in:
- `src/app/workspace/workspaceViewportLabels.ts`
- do not widen this phase into `Float` or `Close`
- do not silently adopt Browser or Console runtime behavior until the actual owner seam is proven truthful
- do not force browser numbering in the one-browser case

Phase 9 must answer:
- whether Browser should adopt `Open In New Browser` as the same named action or use a different later action contract
- whether Console should adopt this action, remain hidden, or be redirected to a different later behavior
- what exact label rules should govern `Browser` versus `Browser 1`, `Browser 2`, and later siblings
- which existing runtime owner seam should be reused for any later-surface open behavior so console does not duplicate titlebar or host logic
- whether the next implementation slice should begin with menu presence and truthful labels only or with real later-surface runtime adoption

Expected outputs from Phase 9:
- one per-surface adoption decision table for Browser, Console, and any other realistic later surfaces
- one locked browser-label scaling rule tied to the shared workspace viewport label helpers
- one narrowed recommendation for the next code slice, ideally browser-only if runtime adoption is actually truthful
- one explicit defer for any surfaces that still lack a clear product-truthful browser-open contract

Done shape:
- later-surface adoption is shaped clearly enough to happen in narrow follow-up slices without reopening the `modelViewer` contract
- one-browser cases keep the simple `Browser` label while multi-browser cases can grow into truthful numbered labels only when the user actually has multiple live browser targets
- Browser and Console adoption risk is reduced to concrete follow-up choices instead of staying a vague catch-all phase
- Browser now exposes `Open In New Browser` from `Workspace Modes` and routes through the existing browser popout runtime seam instead of a console-local copy path
- Console remains deferred until it has its own explicit product-truthful open behavior

## [x] Phase 10 - Float Action Plan
### info
Purpose:
- define how `Float` should behave from the chosen viewport branch

Current read:
- `Float` now ships from the chosen-viewport branch for eligible non-primary targets only
- the shared float owner seams are reused directly instead of inventing console-local float behavior
- Browser and Console route through their existing host-state-aware float behavior
- non-primary `modelViewer` routes through the existing detach-to-floating path
- primary-slot protections stay explicit, especially for the main model viewport and any surfaces that should not detach or float from their protected slot

Main work:
- expose `Float` only when the selected viewport is actually eligible
- keep unsupported or protected primary targets out of the chosen-viewport action list
- preserve the truthful post-float console handoff rule by keeping the staged session on the same source viewport branch
- route Browser float through the existing browser floating shell state
- route Console float through the current floating-console mode
- route non-primary `modelViewer` through the existing detach-to-floating path

Implementation boundaries:
- keep menu shaping inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- reuse the shared float owner seam in:
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.tsx`
- do not widen this phase into `Open In New Browser` or `Close`
- do not invent console-local floating state for Browser, Console, or model viewers

Phase 10 must answer:
- which surface kinds should expose `Float` in the chosen-viewport action menu on the first shipped pass
Answer:
- non-primary `modelViewer`, `browser`, and `console`
- whether protected primary-slot surfaces should hide `Float` or surface a blocked path
Answer:
- hide `Float` for protected primary targets and keep a defensive blocked-path message in the runtime seam
- what exact staged token and breadcrumb wording should represent `Float`
Answer:
- `Float` with normal chosen-viewport breadcrumb output
- which existing owner seam should execute the action for:
Answer:
- non-primary `modelViewer`: detach to `floating`
- Browser: existing browser floating shell seam
- Console: existing floating console seam
- what the console should do immediately after a successful float so breadcrumbs or active targeting stay truthful
Answer:
- stay on the same source viewport branch and append a completion line for the floated viewport

Expected outputs from Phase 10:
- one locked first-surface set for `Float`
- one explicit primary-slot protection rule for unsupported float targets
- one reused float owner seam instead of console-local floating behavior
- one shipped runtime slice limited to surfaces whose float contract is already truthful

Done shape:
- the chosen-viewport action menu now exposes `Float` only for eligible non-primary targets
- successful float actions reuse the existing `AppShell` / workspace-surface float rules directly
- Browser and Console float behavior are treated as special existing host contracts rather than as generic detached-surface copies
- the staged console session stays on the same source viewport branch after float so follow-up actions remain truthful

## [x] Phase 11 - Close Action Plan
### info
Purpose:
- define the safest way for `Close` to exist in the chosen viewport branch

Current read:
- `Close` now ships as the final generic chosen-viewport action for eligible non-primary targets
- the real close owner seam stays in the existing workspace shell or slot mutation layer, not in console-local staged state
- protected primary targets stay explicit and do not appear closable from this menu
- `Close` stays clearly distinct from `Back` through its own confirmation submenu and post-close handoff

Main work:
- expose `Close` only for eligible non-primary `modelViewer`, `browser`, and `console` targets
- hide `Close` for unsupported or protected primary targets
- route `Close` through a dedicated confirmation submenu
- reuse the real close owner seam in the existing workspace runtime path
- return the console to the refreshed `Root > Workspace Modes` picker after the selected viewport disappears

Implementation boundaries:
- keep menu shaping inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- reuse the existing workspace close owner seam rather than inventing console-local viewport removal
- do not widen this phase into `Spaghetti Editor` adoption, `Open In New Browser`, or any new submenu family
- keep protected primary-slot behavior explicit instead of relying on late runtime failure as the main user experience

Phase 11 must answer:
- which surface kinds should expose `Close` in the chosen-viewport action menu on the first shipped pass
Answer:
- eligible non-primary `modelViewer`, `browser`, and `console`
- whether protected primary-slot targets should hide `Close` entirely or expose a blocked path
Answer:
- hide `Close` for protected primary targets and keep a defensive blocked-path message in the runtime seam
- whether close requires a dedicated confirmation submenu or a typed confirmation token before execution
Answer:
- use a dedicated `Close` confirmation submenu with `Confirm Close` and `Back`
- what the console should do after a successful close when the targeted viewport no longer exists
Answer:
- return to the refreshed `Root > Workspace Modes` picker so the next choices stay truthful
- which existing owner seam should execute the close action for supported targets
Answer:
- reuse the existing workspace slot-removal cleanup rules already used by viewport menu close behavior

Expected outputs from Phase 11:
- one locked first-surface set for `Close`
- one explicit protected-primary rule for unsupported close targets
- one confirmation rule that keeps `Close` clearly separate from `Back`
- one truthful post-close console handoff rule
- one reused workspace close owner seam instead of console-local viewport deletion

Done shape:
- the `Close` action is scoped as a safe later slice instead of being mixed into earlier lower-risk work
- `Workspace Modes` now exposes `Close` only for eligible non-primary targets
- protected primary targets remain outside the chosen-viewport close path
- destructive close behavior now uses a clear confirmation submenu before execution
- successful close returns the console to the refreshed workspace-modes root picker so the visible breadcrumb stays truthful after the viewport disappears

## [x] Phase 12 - Guided Alias Simplification Plan
### info
Purpose:
- simplify guided console aliases so menus prefer one-letter shorthand by default

Current read:
- guided aliasing in `Workspace Modes` now prefers one-letter shorthand by default
- `Back` reserves `b` when present in the active menu
- only colliding choices are promoted to the shortest deterministic menu-local alias
- alias collision handling stays scoped to the currently visible choice set rather than becoming a global console alias registry
- the real owner seams are:
- `src/app/console/stagedNavigation.ts` for staged choice alias matching
- `src/app/console/ConsoleBar.tsx` for the visible guided alias hint rendering
- the first runtime cut intentionally shipped `Workspace Modes`-only

Main work:
- derive effective workspace-modes aliases from the active menu instead of relying only on older hardcoded multi-letter aliases
- keep matching and visible hint rendering synchronized
- preserve readable labels while tightening only the shorthand behavior
- keep the first runtime implementation scoped to `Workspace Modes`

Implementation boundaries:
- keep the alias-shaping work inside the staged-navigation and summary-hint surfaces:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleBar.tsx`
- first implementation stays `Workspace Modes`-only unless the traced alias owner seam makes broader adoption essentially free and low-risk
- do not widen this phase into command-parser redesign or non-guided freeform command aliases
- do not reopen the shipped workspace-mode action structure while doing alias cleanup

Phase 12 must answer:
- whether the active shorthand source of truth stays on each choice's explicit `aliases` array or shifts to a menu-local alias resolver layered on top of those choices
- Answer:
- a menu-local alias resolver now layers on top of the existing workspace-modes choices while explicit aliases remain as compatibility fallbacks
- how the one-letter-first rule should break ties when two labels want the same first letter
- Answer:
- keep the first encountered or reserved owner at one letter and promote only the colliding choices to the shortest unused deterministic alias
- whether `Back` always reserves `b` when present in the current menu
- Answer:
- yes for the shipped workspace-modes pass
- whether the first runtime implementation should ship only for `Workspace Modes` menus or all staged guided menus that use alias hints
- Answer:
- `Workspace Modes` only
- how visible hint rendering should stay aligned with actual accepted aliases so the summary never lies
- Answer:
- the summary hint layer now reads the same effective workspace-modes aliases that matching uses

Expected outputs from Phase 12:
- one locked one-letter-first alias rule for guided menus
- one deterministic collision-promotion rule from one letter to two letters
- one explicit `Back` reservation rule when needed
- one locked recommendation that the first implementation should stay `Workspace Modes`-only unless the shared owner seam proves broader adoption is effectively free
- one implementation-ready owner read for how actual alias matching and visible alias hints should stay synchronized

Done shape:
- the next alias cleanup implementation can stay narrow and deterministic
- guided menus can become easier to teach without making collisions ambiguous
- the implementation shipped without desynchronizing accepted tokens from the visible hint styling
- workspace-modes menus now accept shorter one-letter aliases where no collision exists and promote only the conflicting choices

## [x] Phase 13 - Spaghetti Editor Viewport Type Adoption Plan
### info
Purpose:
- define the first safe `Viewport Type` adoption path for `Spaghetti Editor`

Current read:
- `Viewport Type` now ships `Model Viewport`, `Browser`, `Console`, and `Spaghetti Editor`
- `Spaghetti Editor` entered only after the generic workspace-modes structure, action menus, and shorthand cleanup settled
- this phase shipped as a dedicated later-surface adoption slice for `Spaghetti Editor`, not a mixed catch-all expansion
- the real slot-switch owner seam already exists in `src/app/AppShell.tsx`:
- `handleViewportSlotSurfaceKindChange(...)`
- `resolveEditorSurfaceInstanceIdForSlotSwitch(...)`
- `createDuplicatedEditorSurfaceInstanceId(...)`
- that existing path already knows how to:
- reuse an existing retained `spaghettiEditor` surface when safe
- duplicate or open a graph editor viewport when needed
- discard retained `spaghettiEditor` state when switching away destructively
- primary-slot protection already exists in that seam and should stay explicit in the console path too

Main work:
- traced the existing `spaghettiEditor` slot-switch owner seam
- shipped `Viewport Type > Spaghetti Editor` for eligible non-primary slots through the same chosen-viewport menu that already hosts `Model Viewport`, `Browser`, and `Console`
- locked and shipped the truthful post-switch handoff rule so the console retargets to the new live `spaghettiEditor` surface after success
- honored the existing editor-viewport creation, reuse, and destructive-replace rules from the existing shell
- added `Spaghetti Editor` directly into `Viewport Type Menu` instead of inventing a guarded one-off later menu

Implementation boundaries:
- keep this phase focused on `Viewport Type` adoption only
- did not mix in `Spaghetti Editor` split, float, popout, or close behavior beyond the behavior already inherited through the shared workspace seams
- reuse the existing workspace and editor host seams instead of inventing a console-local `Spaghetti Editor` mount path
- kept the first runtime pass inside:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- with execution delegated to the existing `AppShell` / workspace owner seam rather than a console-only mutation

Phase 13 must answer:
- the first shipped eligibility rule is:
- eligible non-primary workspace slots that can already participate in the shared viewport-type switch seam
- `Viewport Type Menu` labels the new choice as `Spaghetti Editor`
- the console should retarget to the new live `spaghettiEditor` surface id after a successful switch
- the existing editor-viewport reuse or duplication rules from `AppShell` are sufficient for the first console pass without extra editor-specific prompts

Expected outputs from Phase 13:
- one locked owner read for `Spaghetti Editor` viewport-type switching
- one clear first-pass eligibility rule
- one truthful console handoff rule after the switch
- one shipped runtime slice for `Viewport Type > Spaghetti Editor`
- one explicit result that the first console pass reuses the existing `AppShell` slot-switch path directly instead of rebuilding editor-surface lifecycle logic in `ConsoleDock`

Done shape:
- `Spaghetti Editor` adoption shipped as its own safe later-surface slice instead of being bolted onto the older `Viewport Type` work informally
- `Workspace Modes` can now switch eligible chosen viewports into `Spaghetti Editor` while preserving truthful breadcrumbs and live-surface targeting

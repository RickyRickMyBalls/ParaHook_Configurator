# Workspace Phase Workspace-7.5-16 - Console Workspace Modes Entry

## Doc Header

### Doc History
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
- the root staged navigation and choice rendering appear to live around `src/app/console/ConsoleDock.tsx`
- root choice/session shaping likely also depends on `src/app/console/stagedNavigation.ts`
- the visible prompt and `Choose next [...]` rendering also flows through `src/app/console/ConsoleBar.tsx`

Current main questions:
- how viewport choices should be labeled in a user-facing way
- how the chosen viewport should map to the existing workspace slot or surface identity
- whether the first shipped branch should stay split-only before later widening into float, popout, viewport type, or close actions
- whether this should remain root-global or adapt to current workspace context later

Desired invariant:
- typing `Workspace Modes` or `wm` from `Root` enters the same section
- the new section reads like one honest console family, not a token alias hack
- future workspace-mode options can grow inside this section without making `Root` noisy
- the first shipped branch is target-first:
- choose viewport
- then choose split direction
- no hidden target guessing
- the console status continues to print breadcrumbs normally throughout the branch

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

## [ ] Phase 1 - Console Root Entry And Owner Path Research
### info
Purpose:
- trace the root staged-console owner seam before adding the new `Workspace Modes` branch

Current read:
- `ConsoleDock.tsx`, `ConsoleBar.tsx`, and `stagedNavigation.ts` likely already own the root `Choose next [...]` path, alias handling, and staged child-session transitions needed for this feature

Main work:
- confirm where root console choices are assembled
- confirm how aliases are matched and displayed
- confirm how a new child branch should be represented
- define the initial `Workspace Modes` branch shape and first entries
- confirm how viewport choices should be sourced and labeled in user-facing language
- confirm how breadcrumbs should read once the user enters a specific viewport branch
- confirm where the normal console status breadcrumb output is generated so the new branch uses the same path

Done shape:
- the doc identifies the exact owner seam for root entry insertion
- the branch label and alias are locked as `Workspace Modes` / `wm`
- the next implementation slice can add the new branch without guessing about console root structure
- the first conversation shape is locked as:
- `Root > Workspace Modes > Choose viewport [...] > Choose next [Split Top, Split Right, Split Bottom, Split Left]`
- breadcrumb/status behavior is locked to the normal console pattern, not a special-case display

## [ ] Phase 2 - Workspace Modes Root Branch And Viewport Picker
### info
Purpose:
- add the first real console branch for workspace modes up through viewport selection

Current read:
- implementation should stay narrow and prove the branch contract before adding action depth

Main work:
- add `Workspace Modes` to `Root`
- add `wm` as the alias
- create the staged branch entered by either token
- render the viewport choice list
- render honest breadcrumbs through the viewport-pick level
- use readable labels such as `Model Viewport 1` and `Browser Viewport 2`
- keep the visible console status output on the normal breadcrumb pattern

Done shape:
- `Root > Choose next [...]` includes `Workspace Modes`
- typing `wm` enters the same branch
- breadcrumbs and prompt sessions read honestly as `Root > Workspace Modes`
- the branch becomes the stable place for future workspace-mode console actions
- the user can choose a viewport target from inside `Workspace Modes`
- console status still prints the breadcrumb path normally

## [ ] Phase 3 - Viewport Split Direction Commands
### info
Purpose:
- add the first real workspace-mode action set after the user chooses a viewport

Current read:
- the first action set should stay split-only so the branch contract remains understandable

Main work:
- after viewport selection, render:
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`
- route the chosen viewport plus split direction into the existing workspace split commit seam
- make breadcrumbs read honestly as `Root > Workspace Modes > <Viewport>`
- keep console status printing the same breadcrumb path while the split choices are active

Done shape:
- after choosing a viewport, the console offers the four split directions
- choosing one of those directions executes the expected split on the chosen viewport
- console language matches the existing viewport-menu language exactly
- console status still behaves like the rest of the console and does not drop breadcrumb context

## [ ] Phase 4 - Workspace Modes Section Expansion Plan
### info
Purpose:
- decide what should come after the first split-only branch is proven

Current read:
- later actions may belong here, but they should not bloat the first implementation slice

Main work:
- decide whether later workspace-mode console actions should include:
- `Viewport Type`
- `Float`
- `Open In New Browser`
- `Close`
- decide whether those actions should live directly under the chosen viewport or under smaller action families

Done shape:
- the next post-split expansion path is explicit
- later console workspace-mode growth can happen without reopening the first branch contract

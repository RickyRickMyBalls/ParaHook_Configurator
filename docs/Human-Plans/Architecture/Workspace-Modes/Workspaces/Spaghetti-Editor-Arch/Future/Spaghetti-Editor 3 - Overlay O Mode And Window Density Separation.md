# `Spaghetti-Editor-3` - `Overlay O Mode And Window Density Separation`

## Doc Header

### Doc History
3. 2026-04-06 10:39: Tightened `Spaghetti-Editor 3 - Phase 2 - Overlay Titlebar Controls And Surface Cleanup` by explicitly locking that the model viewport titlebar row should show which graph is currently overlaid, for example `O Graph 1`, and that the visible `O` control in that row should serve as the direct exit affordance for leaving overlay mode
2. 2026-04-06 10:36: Reworked `Spaghetti-Editor 3` into an explicit multi-phase ladder by splitting the broad `O`-mode idea into `Phase 1 - Window Density Truth And O Mode Entry` and `Phase 2 - Overlay Titlebar Controls And Surface Cleanup`, so the first implementation pass can stay narrow while the later overlay polish has a clear follow-on home
1. 2026-04-06 10:28: Added this dedicated future phase doc so the proposed new `O` titlebar mode, the cleanup of the current overlay-on-model-viewport experiment, and the restoration of `e` to real essential float-window meaning have one implementation-ready planning surface under `Spaghetti-Editor-Arch/Future/`

### Purpose

Use this doc as the dedicated planning and execution surface for the next Spaghetti editor shell cleanup around titlebar mode meaning and overlay behavior.

The goal here is:
- keep `- / e / +` focused on float-window content density
- add a real fourth titlebar option:
  - `O`
- move the current overlay-on-model-viewport experiment under `O`
- restore `e` to real essential float-window meaning
- stage overlay controls and titlebar cleanup in a second follow-on instead of widening the first pass too far

### Scope

This phase family covers:
- titlebar mode meaning for:
  - `-`
  - `e`
  - `+`
  - `O`
- separating float-window density from overlay placement
- making `O` a real editor presentation mode
- overlay titlebar messaging and first control cleanup

This phase family does not cover:
- node row-density redesign
- per-node `collapsed / essentials / expanded` contract changes
- broad model viewport chrome redesign beyond what `O` needs
- speculative later overlay customization surfaces

## Doc Body

### Summary

`Spaghetti-Editor-3` is the next editor-shell cleanup after the shipped spawn-mode work in `Spaghetti-Editor-2`.

Current read:
- the titlebar mode story is trying to cover both:
  - float-window density
  - overlay-on-model-viewport behavior
- that makes the current `e` meaning muddy
- the desired split is:
  - `-`
    - minimized float window
  - `e`
    - essential float-window content
  - `+`
    - full float-window content
  - `O`
    - overlay the canvas onto the model viewport

Locked recommendation:
- do not add a fourth node row-density mode
- add `O` as an editor presentation mode
- restore `e` to real essential float-window meaning first
- stage overlay control polish after the basic mode split lands

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
  - owns top-level editor presentation branching
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - owns the compact-shell titlebar surface
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - owns the visible titlebar mode buttons in the active canvas shell
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns editor viewport presentation-mode state and transitions
- `src/app/AppShell.test.tsx`
  - already assumes the current editor presentation mode union
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
  - also assumes the current editor presentation mode union

Important architectural note:

The current node row-density contract should stay separate:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/canvas/rowViewMode.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`

This means `O` should not be added as a fourth `NodeRowMode`.

### Phase Breakdown

1. `Spaghetti-Editor 3 - Phase 1 - Window Density Truth And O Mode Entry`
Reason:
- the safest first cut is to restore honest meaning to `- / e / +`, add `O` as a real fourth titlebar option, and lock the editor/store/host mode model before widening into overlay chrome cleanup

2. `Spaghetti-Editor 3 - Phase 2 - Overlay Titlebar Controls And Surface Cleanup`
Reason:
- once `O` exists as a real mode, the next missing truth is how the model viewport titlebar should announce overlay state and what first-pass overlay controls should be available

## [ ] Spaghetti-Editor 3 - Phase 1 - Window Density Truth And O Mode Entry

### Summary

#### Purpose:
- separate float-window density from overlay placement
- restore `e` to honest essential float-window meaning
- add `O` as the real overlay mode entry point
- lock the first store and titlebar contract for the four visible options

#### Current read:
- the current user intent is:
  - `-`
    - minimize the float window into the one-line shell
  - `e`
    - show canvas only
    - keep `C / T / i` closed
  - `+`
    - show full float-window content
  - `O`
    - overlay onto the model viewport
- the current implementation direction has not yet split those meanings cleanly
- the narrowest truthful first cut is:
  - create the fourth editor presentation mode
  - route the current overlay experiment into `O`
  - stop letting `e` stand in for overlay behavior

#### Locked direction:
- keep node density out of this phase
- treat this as editor shell and presentation-state work only
- make `O` a real titlebar-visible mode
- keep later overlay controls deferred to `Phase 2`

### Questions / Decisions

#### [ ] Question 1 - Should `O` be implemented as a fourth editor presentation mode instead of a fourth node row-density mode?

##### Locked answer
- yes

##### Why
- `O` is about editor placement and presentation, not row density inside nodes
- this keeps the row-density contract stable and local

#### [ ] Question 2 - What should `e` mean after the split?

##### Locked answer
- essential float-window content
- canvas visible
- `C / T / i` closed

##### Why
- that is the intended shell-level meaning of essentials
- it is more honest than overloading `e` with overlay behavior

#### [ ] Question 3 - What should `Phase 1` actually promise?

##### Locked answer
- the titlebar/store/host mode split only

##### Why
- the mode model must be explicit before overlay-titlebar cleanup or transparency controls can be judged honestly

#### [ ] Question 4 - What visible mode set should `Phase 1` lock?

##### Locked answer
- `-`
- `e`
- `+`
- `O`

##### Why
- that matches the intended user-facing titlebar language directly

### Implementation Spec

Likely files:
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- focused UI/store/host tests around the new mode model

Locked first-cut direction:
1. introduce a fourth editor presentation mode:
   - `overlay`
2. map the visible titlebar buttons to:
   - `-`
   - `e`
   - `+`
   - `O`
3. restore `e` to essential float-window meaning:
   - canvas visible
   - `C / T / i` closed
4. route the current overlay-on-model-viewport behavior through:
   - `O`
5. update host/store typing and transitions so the editor shell can enter and leave `O` honestly
6. keep overlay chrome cleanup deferred:
   - no background transparency control yet
   - no widened titlebar overlay controls yet

Scope honored:
- keep this slice limited to mode meaning and mode entry
- do not redesign node row-density behavior
- do not widen into broad model viewport titlebar redesign yet
- do not add a full overlay settings surface yet

Verification matrix:
- the titlebar now exposes:
  - `-`
  - `e`
  - `+`
  - `O`
- `e` no longer routes into overlay behavior
- `O` now owns overlay entry
- the editor/store/host layer can enter and leave `O`
- existing node row-density behavior remains unchanged

Definition of done:
- the titlebar mode model is explicit and honest
- `e` and `O` no longer fight over meaning
- `Phase 2` can focus only on overlay-titlebar controls and surface cleanup

## [ ] Spaghetti-Editor 3 - Phase 2 - Overlay Titlebar Controls And Surface Cleanup

### Summary

#### Purpose:
- make `O` feel like a real user-facing overlay mode instead of a hidden implementation state
- add the first useful overlay controls
- clean up the visible model viewport/titlebar surface while overlay is active

#### Current read:
- after `Phase 1`, `O` can exist as a real mode entry point
- the next missing truth is:
  - how overlay state is announced
  - how the user exits overlay mode
  - how the overlaid graph identity is shown in the model viewport titlebar row
  - what first controls help readability between the node canvas and the model viewport behind it

### Questions / Decisions

#### [ ] Question 1 - Should the model viewport titlebar explicitly announce overlay-active state?

##### Must lock
- visible wording such as:
  - `O Graph 1`
  - or the current overlaid graph name equivalent, such as `O <graph name>`

##### Locked direction
- yes
- the model viewport titlebar row should show that an overlay is active and which graph is overlaid
- the first-pass titlebar item should include:
  - an `O` control
  - the active graph name beside it

##### Why
- the user should be able to see immediately which graph is currently overlaid onto the model viewport
- this is more informative than a generic overlay-active badge with no graph identity

#### [ ] Question 2 - What is the first mandatory exit/control surface while `O` is active?

##### Must lock
- obvious exit behavior on the model viewport titlebar row
- and whether the visible `O` control itself is the direct exit affordance

##### Locked direction
- the `O` control shown in the model viewport titlebar row should act as the direct exit affordance for leaving overlay mode

##### Why
- that keeps the overlay state indicator and the exit action in the same obvious place
- it matches the intended compact titlebar-row UX better than requiring a second separate exit button

#### [ ] Question 3 - What is the first overlay readability control?

##### Must lock
- background transparency
- and whether node/card opacity also belongs in the first pass or stays deferred

### Implementation Spec

Likely files:
- model viewport titlebar / viewer host seams that currently render the overlaid editor state
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- focused overlay-host, titlebar, and interaction tests

Locked direction:
1. add a model viewport titlebar row item while `O` is enabled that shows:
   - `O`
   - the active overlaid graph name
2. make the visible `O` control in that row exit overlay mode
3. add the first background transparency control
4. keep the control set narrow and useful
5. defer broader overlay settings until later if the first small control set proves valuable

Definition of done:
- `O` now reads as a real overlay mode, not a hidden test path
- the model viewport titlebar clearly reflects overlay state and the active graph name
- the user can exit overlay mode directly from the visible `O` titlebar control
- background transparency can be adjusted in the first pass

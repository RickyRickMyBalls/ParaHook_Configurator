# Workspace Phase Workspace-7.2f-2 - Four-Side Expansion And Whole-Browser Ghost Layering

## Doc Header

### Doc History
3. 2026-03-31 16:20: Checked off `Workspace 7.2f-2` after the shipped four-side dual-band rollout and whole-browser ghost layering cleanup, so the second `7.2f` subphase record now reads as landed history and is ready to move into `Workspace-Modes/Shipped/`
2. 2026-03-31 13:25: Tightened this `Workspace 7.2f-2` follow-through doc into an implementation-ready Browser-first spec by locking the all-sides dual-band rollout, the whole-browser ghost layering contract, the remaining preview-scope helper seams, and the focused verification boundary
1. 2026-03-31 12:55: Added this staged `Workspace 7.2f-2` follow-through doc so the dual-band Browser drag-language proof can widen from the first right-edge cut into all four sides plus the above-header whole-browser ghost layering rule

### Purpose

Use this subphase to widen the proven dual-band split-preview language across the remaining directional edges and finish the visual scope signaling.

The goal is to make the dual-band rule feel like one coherent Browser drag language:
- all four sides should share the same pane-local versus whole-browser scope behavior
- whole-browser ghosts should visibly sit above viewport headers
- the user should read the broader-scope ghost as intentional instead of hidden behind viewport chrome

## Doc Body

### Summary

`Workspace 7.2f-2` is the full four-side and layering follow-through.

It should deliver:
- the same dual-band rule for `left`, `top`, and `bottom` on top of the proofed `right` edge
- one clear whole-browser ghost layer above viewport title bars
- focused verification that the same scope language now holds across every directional side

Practical read:
- `7.2f-1` proves the hard preview-scope state and one concrete side
- `7.2f-2` finishes the consistent user-facing drag language

### Locked Direction

`Workspace 7.2f-2` should be:
- a four-side expansion cut
- a whole-browser ghost layering cut
- the user-facing completion pass for the dual-band Browser drag-language family

`Workspace 7.2f-2` should not be:
- a broader multi-surface expansion
- a nested-ghost rewrite
- a slot lifecycle or host ownership pass

### Scope

This subphase covers:
- extending the dual-band edge-intent rule to `left`, `top`, and `bottom`
- keeping the side meaning fixed across both preview scopes
- rendering whole-browser ghosts above viewport title bars
- leaving pane-local ghost layering unchanged
- adding focused tests for all remaining sides plus the above-header whole-browser overdraw behavior

This subphase does not cover:
- changing the already-shipped `7.2e` nested preview language
- expanding the rule to Spaghetti or other floating hosts yet
- broader `Workspace 7.3` model-viewport widening

### Locked Interaction Model

Use the same two explicit edge-intent bands on every side:

- `28px -> 14px from the hovered edge`
  - show the pane-local ghost inside the hovered model viewport area
  - this means "split this pane only"

- `14px -> 0px from the hovered edge`, and the immediate overshoot space just outside that edge
  - show the whole-browser ghost that spans the full browser-splittable area
  - this means "split the whole browser area"

Important rule:
- `left`, `right`, `top`, and `bottom` keep the same directional meaning in both bands
- only the preview scope changes

Commit rule:
- releasing while the preview is in the outer `28px -> 14px` band should still commit one normal pane-local split on the active side
- releasing while the preview is in the inner `14px -> 0px` band or the immediate outside-edge overshoot should still commit one normal whole-browser split on that same side
- this phase should widen the existing proofed right-edge contract instead of inventing any new split action names

Visual communication rule:
- pane-local ghost stays inside the hovered model viewport bounds
- whole-browser ghost overdraws viewport title bars so the broader scope is obvious

### Progress Checklist

- [x] Extend the dual-band scope model to the left edge
- [x] Extend the dual-band scope model to the top edge
- [x] Extend the dual-band scope model to the bottom edge
- [x] Keep the chosen side stable while the preview scope changes on all four sides
- [x] Raise the whole-browser ghost above viewport title bars while leaving pane-local ghost layering unchanged
- [x] Add focused Browser tests for left, top, bottom, and above-header whole-browser overdraw

### Current Code Read

Current likely seams:
- `BrowserDockHost` already owns the directional split-preview resolution path
- `base.css` currently keeps viewport headers above the lower ghost layer
- the whole-browser preview needs a stronger layer than the pane-local ghost so the scope shift reads intentionally

Locked code read:
- `BrowserDockHost` should widen the explicit preview-scope helper from the proofed right edge to `left`, `top`, and `bottom`
- whole-browser previews should continue using stable last-valid-target continuation during immediate outside-edge overshoot on every side
- the ghost renderer should be able to distinguish pane-local versus whole-browser previews so only the whole-browser layer moves above viewport headers

Current supporting seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2f - Dual-Band Edge Intent And Whole-Browser Split Signaling.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2f-1 - Dual-Band Edge Intent State And Right-Side Proof.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2e - Adaptive Split Preview Ghosts And Pane-Aware Nested Docking.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`

Current code seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2f-2 - Question 1 - What is the main job of this follow-through after the proofed right edge?

##### Locked Answer
- widen the same dual-band scope model to `left`, `top`, and `bottom`
- keep the already-shipped right-edge behavior aligned with the new all-sides contract
- finish the whole-browser ghost layering so the broader-scope preview reads intentionally

##### Why
- the proof cut already established the state model
- this follow-through should complete the consistent user-facing drag language

#### [x] Workspace 7.2f-2 - Question 2 - Should any side change the meaning of the dual-band model?

##### Locked Answer
- no
- every side keeps the same outer pane-local band and inner whole-browser band
- only the side changes, not the meaning of the bands

##### Why
- the user should learn one drag language, not four slightly different ones

#### [x] Workspace 7.2f-2 - Question 3 - How should whole-browser ghost layering differ from pane-local layering?

##### Locked Answer
- whole-browser ghosts should render above viewport title bars
- pane-local ghosts should keep their current lower in-pane layer
- the layer split should be driven by explicit preview scope, not by guessing from size alone

##### Why
- the whole-browser preview needs to visibly overdraw the header chrome to read like a broader-scope action
- pane-local previews already read correctly inside the hovered pane

#### [x] Workspace 7.2f-2 - Question 4 - What should stay out of scope for this follow-through?

##### Locked Answer
- expanding the same rule to Spaghetti or other floating hosts
- changing the `7.2e` nested-suggestion language
- broader `Workspace 7.3` multiple-model-viewport widening

##### Why
- this phase should finish the Browser drag-language family cleanly before any wider surface or runtime expansion

### Important Interfaces And Types To Lock

- split preview state
  - should already express:
    - directional side
    - preview scope: `pane-local` or `whole-browser`
    - optional pane-local target slot id
- all-sides edge-threshold constants
  - should preserve one shared dual-band contract for `left`, `right`, `top`, and `bottom`
- ghost rendering state
  - should distinguish:
    - pane-local ghost layer
    - whole-browser ghost layer above headers

Important rule:
- one directional side per preview
- two explicit preview scopes
- one shared all-sides dual-band language
- one explicit layering split between pane-local and whole-browser ghosts

### First Implementation Cut

`Workspace 7.2f-2` should land in the smallest safe sequence:

1. widen the explicit dual-band preview-scope helper from the proofed right edge to `left`, `top`, and `bottom`
2. keep the same directional meaning while preview scope changes on all four sides
3. preserve stable last-valid-target continuation through immediate outside-edge overshoot on every side
4. raise the whole-browser ghost above viewport title bars while leaving pane-local ghost layering unchanged
5. add focused Browser tests for left, top, bottom, and above-header whole-browser overdraw behavior

Implementation boundary:
- this cut should end once all four Browser edges share one stable pane-local versus whole-browser split-preview language

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.2f-2` is done when:
- dragging Browser toward `left`, `right`, `top`, or `bottom` first shows the pane-local ghost in the `28px -> 14px` band
- dragging deeper into any of those edges switches cleanly to a whole-browser ghost in the `14px -> 0px` band
- moving just outside the edge keeps the whole-browser ghost stable instead of snapping to a different accidental preview source
- whole-browser ghost previews visibly sit above viewport title bars while pane-local ghosts stay in their current lower in-pane layer

### Verification Shape

Focused verification should cover:
- left-edge pane-local to whole-browser transition
- top-edge pane-local to whole-browser transition
- bottom-edge pane-local to whole-browser transition
- stable whole-browser preview during immediate outside-edge overshoot on all four sides
- whole-browser ghost overdraw above viewport title bars

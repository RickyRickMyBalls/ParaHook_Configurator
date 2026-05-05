# `Spaghetti-Editor-5` - `Meatball Dock Persistence Across Split Layouts`

## Doc Header

### Doc History
1. 2026-05-02 09:39:04: Created this future phase doc after Bug 23 research showed the docked meatball editor is likely being reclassified out of `meatball editor view` when split-right forces Spaghetti surfaces back to `expanded`, and set the first fix cut to one dock-ownership phase that keeps the meatball surface visible across that split transition.

### Purpose

Use this doc as the dedicated planning and execution surface for the meatball-editor disappearance bug.

The goal here is:
- keep the docked meatball editor visible after splitting the model viewport right
- separate dock ownership from split-induced window-mode normalization
- preserve the current left-toolbar meatball slot as an honest surface owner
- add a focused regression that proves the dock survives the split-right repro path

### Scope

This phase family covers:
- docked meatball editor ownership
- split-right behavior for Spaghetti surfaces
- left-dock occupancy truth
- dock-preserving reclassification or rehydration behavior
- regression proof for the exact repro

This phase family does not cover:
- Browser dock behavior
- detached popup behavior
- general maximize/collapse cleanup
- node palette or other unrelated Spaghetti shell work
- broader workspace split-layout redesign beyond the meatball dock seam

## Doc Body

### Summary

`Spaghetti-Editor-5` is the next Spaghetti shell cleanup after the existing `Spaghetti-Editor-3` and `Spaghetti-Editor-4` families.

Current read:
- the docked meatball editor is created correctly
- the bug appears when the model viewport is split right
- the split path likely preserves the editor instance but drops the classification that keeps the left dock rendering the meatball slot

Locked recommendation:
- keep this phase narrowly on meatball dock ownership
- do not widen into browser split behavior or detached popup work
- make the split-right path preserve dock ownership until the user explicitly leaves meatball mode

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/workspace/workspaceSurfaceActions.ts`
  - currently drives split behavior for Spaghetti surfaces and appears to normalize them back to `expanded`
- `src/app/AppShell.tsx`
  - derives meatball dock occupancy from `windowMode === 'meatball editor view'`
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - finds the docked meatball shell from `orderedViewportStates.find((viewportState) => viewportState.isMeatballDock)`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - still owns the `meatball editor view` transition machinery alongside split, collapse, maximize, and separate-window behavior
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - renders the dock target but depends on the meatball occupancy state staying honest

Important architectural note:

The left dock itself is not the problem.
The likely problem is that split-right is changing the editor state so the meatball surface no longer qualifies as dock-owned.

### Phase Breakdown

1. `Spaghetti-Editor 5 - Phase 1 - Preserve Meatball Dock Ownership Through Split-Right`
Reason:
- the bug is one narrow ownership seam, so the first cut should preserve the docked meatball state across the split-right transition and prove the left toolbar keeps the editor alive without widening any unrelated shell behavior

## [ ] `Spaghetti-Editor 5 - Phase 1 - Preserve Meatball Dock Ownership Through Split-Right`

### Summary

#### Purpose:
- keep the docked meatball editor visible after the model viewport is split right
- preserve meatball dock ownership across split handling
- stop split-right from silently reclassifying the docked editor into a plain expanded surface

#### Current read:
- `splitWorkspaceSurfaceToSide(...)` and the Spaghetti split branch still normalize Spaghetti surfaces back to `expanded`
- `AppShell` and `SpaghettiWindowHost` both use `meatball editor view` as the signal that the dock should remain occupied
- that means the split-right path likely needs either a dock-preserving state flag or a more honest dock owner record that survives the transition

#### Locked direction:
- keep this pass focused on the meatball dock seam only
- do not widen into general floating/maximize behavior
- do not change Browser dock behavior
- add one focused regression for the exact repro path

### Questions / Decisions

#### [ ] Question 1 - Should split-right preserve `meatball editor view` instead of normalizing the surface to `expanded`?

##### Locked answer
- yes, if the surface is currently dock-owned and the user has not explicitly undocked it

##### Why
- the bug is specifically that the docked editor disappears after split-right
- losing the dock classification is the likely failure

#### [ ] Question 2 - Should dock ownership become separate from the current `windowMode` value?

##### Locked answer
- yes, if preserving `windowMode` alone is not enough to keep the left dock honest

##### Why
- `windowMode` is being used for both presentation meaning and dock meaning
- this bug suggests those responsibilities are now too coupled

#### [ ] Question 3 - What should the first regression prove?

##### Locked answer
- docked meatball editor remains visible after splitting the model viewport right

##### Why
- that is the exact user repro
- the phase should not be considered complete until that path stays stable

### Implementation Spec

Likely files:
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- focused bug / workspace tests for the split-right repro

Locked first-cut direction:
1. trace the exact state transition that happens when split-right is invoked from meatball mode
2. preserve dock ownership through that transition instead of letting the surface fall back to plain expanded state
3. keep the docked meatball shell visible in the left toolbar
4. add a focused regression proving the meatball editor survives the split-right path

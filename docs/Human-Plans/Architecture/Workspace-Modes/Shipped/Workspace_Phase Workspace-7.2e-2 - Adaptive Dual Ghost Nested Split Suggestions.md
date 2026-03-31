# Workspace Phase Workspace-7.2e-2 - Adaptive Dual Ghost Nested Split Suggestions

## Doc Header

### Doc History
6. 2026-03-31 16:20: Checked off `Workspace 7.2e-2` after the shipped adaptive nested split-preview cleanup, so the second `7.2e` subphase now reads as landed history and is ready to move into `Workspace-Modes/Shipped/`
5. 2026-03-31 11:51: Tightened this `7.2e-2` subphase again so the next live implementation pass is explicitly about Browser-first cleanup on top of the shipped nested-preview seam, including removal of the temporary model-pane center float-drop special case and convergence on one fixed directional preview language
4. 2026-03-31 11:50: Revised the locked `7.2e-2` interaction model so nested split suggestions should now keep standard `top` / `right` / `bottom` / `left` semantics instead of switching axes from hovered-pane width and height, and updated the phase wording to treat aspect ratio as optional visual emphasis rather than a rule that changes split meaning
3. 2026-03-31 11:32: Locked the remaining `7.2e-2` interaction questions before implementation, clarifying that outer-edge intent should win near pane boundaries, near-square panes should fall back to nested `left` / `right`, dual ghosts should appear immediately with Browser as the first proving surface, and the active ghost under the cursor should be the one that commits
2. 2026-03-31 11:27: Tightened this `Workspace 7.2e-2` subphase into an implementation-ready follow-on by grounding it in the shipped `7.2e-1` pointer-driven preview seam, locking the likely dual-ghost state and commit path, naming the concrete Browser and Spaghetti host files to update, and sharpening the first-cut and verification shape
1. 2026-03-31 11:18: Added this native `Workspace 7.2e-2` subphase doc to isolate the follow-on split-authoring cut around adaptive dual ghost previews for nested splits once the first pane-local four-way preview precision seam from `7.2e-1` is in place

### Purpose

Use this subphase to enrich split authoring after the first pane-local four-way preview fix lands.

The goal is to let already split panes offer two sensible nested split ghost suggestions without changing the meaning of the standard directional split model.

## Doc Body

### Summary

`Workspace 7.2e-2` is the adaptive dual-ghost nested-split suggestion cut.

It should deliver:
- dual ghost suggestions when the pointer is over an already split pane that can accept a nested split
- nested split preview behavior that still speaks in fixed `top` / `right` / `bottom` / `left` directions
- richer nested suggestions that can use pane geometry for visual emphasis without remapping the underlying directional meaning

Practical read:
- `7.2e-1` should already have made the first four-way preview choice precise
- this second cut is where the preview system becomes richer than one single active side
- the first task is no longer fixing imprecise edge detection; it is layering a second preview shape on top of the now-shipped cursor-driven pane-local seam

### Locked Direction

`Workspace 7.2e-2` should be:
- a nested split-suggestion cut
- an adaptive dual-ghost preview cut
- a pane-aware authoring upgrade that preserves fixed directional split semantics

`Workspace 7.2e-2` should not be:
- the first pane-local precision fix, which belongs to `7.2e-1`
- a multi-viewport widening cut
- a generic merge/join/duplicate slot lifecycle phase

### Scope

This subphase covers:
- allowing an already split hovered pane to offer two nested split ghost suggestions
- keeping those suggestions inside the normal `top` / `right` / `bottom` / `left` split language
- using pane geometry only to help decide presentation priority or emphasis, not to change the underlying split meaning
- adding focused tests for adaptive nested ghost selection and commit behavior

This subphase does not cover:
- the initial pane-local four-way split-preview precision fix
- multiple-model-viewport runtime widening
- arbitrary freeform multi-drop layouts

### Progress Checklist

Current progress read:
- `7.2e-1` is now shipped as the pointer-driven pane-local precision cut for the existing four-way preview
- this second cut now depends on that shipped seam rather than a hypothetical future helper
- the first Browser proving pass already introduced nested dual ghosts
- the Browser nested-preview cleanup is now shipped as one cleaner fixed-direction preview language without regressing the first pane-local preview choice

- [x] Add dual-ghost preview state for nested split suggestions
- [x] Detect when the hovered pane can accept a nested split suggestion
- [x] Remove the temporary Browser model-pane center float-drop special case so model panes fall back to the normal directional preview language
- [x] Converge the Browser nested preview behavior on one fixed `top` / `right` / `bottom` / `left` directional model
- [x] Decide whether pane geometry still affects visual emphasis only, or whether Browser should use the same nested pair regardless of pane shape
- [x] Keep nested ghost commit behavior deterministic
- [x] Keep the shipped `7.2e-1` single-ghost precision behavior stable when no nested split suggestion is active
- [x] Add focused tests for the fixed-direction Browser nested-suggestion cleanup and no-special-case model-pane behavior

### Locked Outcome

At the end of `7.2e-2`:
- already split panes can offer two sensible nested split suggestions
- those nested suggestions still read as normal `top` / `right` / `bottom` / `left` split actions
- Browser no longer carries a one-off center float-drop preview over model panes
- the full `7.2e` phase can honestly count as complete

### Current Code Read

Current expected seam after `7.2e-1`:
- the first pane-local four-way preview choice should already be precise
- Browser and Spaghetti hosts should already know how to resolve one active preview side from cursor position inside a hovered pane
- what still remains is preview state that can represent more than one local suggestion at once plus the logic that decides when to branch into that richer preview mode

Current Browser-side residue after the first `7.2e-2` proving pass:
- Browser already has a nested dual-ghost preview seam
- Browser still carries a temporary model-pane center float-drop special case that now conflicts with the simpler fixed-direction rule
- the next implementation pass should clean up that Browser-first seam rather than widening it further first

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
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2e - Adaptive Split Preview Ghosts And Pane-Aware Nested Docking.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2e-1 - Cursor-Driven Pane Split Preview Precision.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2e-2 - Question 1 - What is the exact job of this second subphase?

##### Locked Answer
- add adaptive dual ghost suggestions for nested splits after the first pane-local precision seam exists

##### Why
- it is richer behavior that should not block the smaller precision cleanup

#### [x] Workspace 7.2e-2 - Question 2 - When should two ghost previews appear?

##### Locked Answer
- when the pointer is over an already split pane that can accept a meaningful nested subdivision

##### Why
- that is where one single outer-edge ghost stops being enough

#### [x] Workspace 7.2e-2 - Question 3 - How should the first adaptive choice work?

##### Locked Answer
- keep standard `top` / `right` / `bottom` / `left` split semantics everywhere
- pane geometry can influence which nested suggestions are visually emphasized first, but it should not remap the meaning of the split directions

##### Why
- this keeps drag behavior predictable across every pane shape
- it avoids teaching users that the same drag can mean different things in wide versus tall panes

#### [x] Workspace 7.2e-2 - Question 4 - What should still stay stable while dual ghosts are added?

##### Locked Answer
- when no nested split suggestion is active, the shipped `7.2e-1` single pane-local preview should behave exactly as it does today
- dual ghost suggestions should enrich the already split-pane case, not replace the base four-way preview everywhere

##### Why
- this keeps the second cut additive and lower risk
- it avoids turning the adaptive nested-suggestion pass into a regression of the first precision cleanup

#### [x] Workspace 7.2e-2 - Question 5 - What should win if the pointer is near both an outer pane edge and a nested dual-ghost region?

##### Locked Answer
- outer-edge intent should win near the pane boundary
- dual ghosts should take over only when the pointer moves farther into the pane interior

##### Why
- this preserves the shipped `7.2e-1` base split behavior at the edges
- nested suggestions should feel like an enrichment of the pane interior, not like they steal obvious outer-edge intent

#### [x] Workspace 7.2e-2 - Question 6 - Should near-square panes need a special directional fallback?

##### Locked Answer
- no special semantic fallback is needed
- near-square panes should keep the same fixed `top` / `right` / `bottom` / `left` directional meaning as every other pane

##### Why
- fixed directional semantics make the preview system deterministic without another shape-specific rule
- this removes one more source of surprising behavior

#### [x] Workspace 7.2e-2 - Question 7 - How should the user choose between the two nested ghosts?

##### Locked Answer
- the ghost region currently under the cursor should be the active one
- that active ghost should be the one that commits on release

##### Why
- this keeps the interaction immediate and readable
- it avoids adding a second selection step or dwell-state before commit

#### [x] Workspace 7.2e-2 - Question 8 - Should dual ghosts appear immediately or only after a dwell?

##### Locked Answer
- dual ghosts should appear immediately once the pointer is in a valid nested-suggestion region

##### Why
- delayed appearance would make split authoring feel hesitant and harder to read

#### [x] Workspace 7.2e-2 - Question 9 - Which surface should prove this second cut first?

##### Locked Answer
- Browser should prove the first `7.2e-2` pass
- Spaghetti should follow after the Browser behavior feels right

##### Why
- Browser is the live user-facing driver for this phase
- a Browser-first pass keeps the first implementation slice smaller

#### [x] Workspace 7.2e-2 - Question 10 - What should happen to the temporary Browser center "float here" drop over model panes?

##### Locked Answer
- retire that special case
- dragging Browser over a model pane should use the same normal directional preview language as the rest of the split system
- if the user wants to keep Browser floating, they should simply avoid committing a split target

##### Why
- this keeps the drag language consistent
- it avoids teaching a separate Browser-only model-pane drop rule

#### [x] Workspace 7.2e-2 - Question 11 - What is the next implementation-ready cleanup target for this subphase?

##### Locked Answer
- clean up the existing Browser-first `7.2e-2` pass so it follows one fixed directional preview model end-to-end
- remove the temporary model-pane center ghost
- preserve deterministic nested commit behavior and the shipped `7.2e-1` fallback seam

##### Why
- this is the smallest honest follow-up
- it converges the Browser proof instead of widening temporary behavior

### Important Interfaces And Types To Lock

- split preview state
  - should be able to express more than one local nested ghost candidate
  - likely shape:
    - one current base preview side
    - one optional nested preview candidate list with two entries
- split commit path
  - should still end in deterministic `top`, `right`, `bottom`, or `left` split actions
- pane-target selection
  - should keep using the `7.2e-1` hovered-pane and cursor-driven preview seam rather than inventing a second independent targeting rule

Important rule:
- widen preview richness
- keep split commit language stable
- do not let pane aspect ratio change what `top`, `right`, `bottom`, or `left` mean
- do not keep Browser-only center-drop exceptions once the cleaner directional rule is chosen

### First Implementation Cut

`Workspace 7.2e-2` should land in the smallest safe sequence:

1. keep the shipped `7.2e-1` base preview seam as the default path when no nested suggestion is active
2. keep the existing Browser nested dual-ghost preview seam, but remove the temporary model-pane center float-drop branch
3. make Browser model-pane hovers fall back to the normal directional preview system
4. keep the nested pair inside the same fixed directional split language as the base preview path
5. wire nested ghost commit back into the same deterministic `top` / `right` / `bottom` / `left` split actions
6. prove nested ghost commit behavior remains deterministic without regressing the base single-ghost path
7. add focused tests for the Browser cleanup path plus the fallback single-ghost stability without any width/height-based semantic flip or Browser-only model-pane special case

Implementation boundary:
- the next Browser cleanup slice should end once the temporary center-drop special case is gone and Browser follows one cleaner directional preview model
- the full `7.2e-2` subphase should end once adaptive nested dual ghost suggestions feel reliable on top of the pane-local precision seam from `7.2e-1`

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.2e-2` is done when:
- nested hovered panes can offer richer directional ghost suggestions without changing the meaning of `top` / `right` / `bottom` / `left`
- Browser no longer shows a center float-drop ghost over model panes
- nested ghost commit behavior remains deterministic
- the shipped `7.2e-1` single-ghost path remains stable when the pointer is not in a nested-suggestion case
- `Workspace 7.2e` can honestly count as complete

### Verification Shape

Focused verification should cover:
- nested directional ghost suggestion behavior without any width/height-driven semantic flip
- Browser model-pane hover behavior without the temporary center float-drop special case
- deterministic nested split commit behavior
- fallback single-ghost stability when the pointer is not in a nested split-suggestion case

Recommended manual checks:
- keep a short wide top pane alive, drag Browser over it, and confirm the richer nested suggestions still follow normal directional split semantics
- split the viewport vertically, drag Browser over the tall side pane, and confirm pane shape does not silently remap the underlying split directions
- drag Browser across the interior of a model pane and confirm it no longer shows a special center float-drop ghost
- drag across a non-nested split-target case and confirm the earlier `7.2e-1` single pane-local preview still behaves exactly as before

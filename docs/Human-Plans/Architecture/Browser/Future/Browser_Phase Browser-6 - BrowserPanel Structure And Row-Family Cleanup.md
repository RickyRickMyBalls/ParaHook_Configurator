# Browser Phase Browser-6 - BrowserPanel Structure And Row-Family Cleanup

## Doc Header

### Doc History
3. 2026-03-25 16:35: Reframed this Browser-6 phase doc to read more clearly as a long-term Browser-vision enabler, tightening the purpose and summary around later shared Browser primitives while keeping the actual phase contract implementation-bounded, behavior-preserving, and explicitly non-owning of the broader end-state convergence work
2. 2026-03-25 16:20: Made this standalone Browser-6 phase doc implementation-ready, locking the BrowserPanel cleanup around a meaningful layered split, family-specific adapter seams, the rule that shared selection plus console-routing plus reference-batch ownership must stay outside `BrowserPanel`, and the default requirement that Browser-6 preserve shipped Browser-5.x behavior while extracting cleaner seams
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the later BrowserPanel structure and row-family cleanup now has its own planning home under `Browser/Future/` instead of staying folded into the Browser umbrella note only

### Purpose

This phase is the structural Browser cleanup that keeps the long-term Browser vision achievable without pretending to ship that full end state yet.

Use it to answer:
- what structural cleanup Browser-6 should ship now so later Browser convergence stays possible
- how BrowserPanel should be decomposed
- how row VMs and row behavior should be separated
- how graph/content/reference/sketch/viewport rows should follow clearer shared rules without locking today's practical families into forever-separate architecture

## Doc Body

## [ ] Browser-6 - BrowserPanel Structure And Row-Family Cleanup

### Summary

This phase makes the BrowserPanel structure honest enough that later Browser growth can move toward shared Browser primitives instead of continuing to pile more behavior into one oversized panel component.

Phase outcome:
- `BrowserPanel` becomes a thinner host instead of the place where most Browser behavior is decided inline
- row-vm derivation, interaction dispatch, and row-family differences move into clearer seams
- major row families keep shared Browser shell rules while owning their narrower family-specific behavior through adapter seams
- the structure stays open for later authored/imported convergence instead of hardening today's row families into one permanent Browser species split
- Browser-5.x shipped behavior stays intact by default while the structure becomes easier to extend and test

### Long-Term Alignment

Browser-6 is not the phase that fully unifies folders, objects, references, and later imported/generated Browser primitives.

It is the phase that should make that later direction realistic by:
- removing avoidable `BrowserPanel` ownership
- separating shared row-shell behavior from family-specific behavior
- keeping current practical families understandable without treating that first-pass split as the permanent Browser worldview

Hard rule:
- Browser-6 should read as a structural enabler for the longer Browser vision
- Browser-6 should not claim to ship the full folder/object/reference convergence model by itself

### Owns

- BrowserPanel structural cleanup
- row-vm derivation versus interaction-dispatch separation
- row-family adapter seam definition
- row-shell versus row-family rendering separation
- reducing inline row-kind special cases and duplication

### Does Not Own

- new reference-folder authoring features such as rename or add-folder
- new tree move/reorganization behavior
- new transform-command richness
- changing shared selection semantics already shipped in Browser-5.x unless structure forces a bug fix
- re-architecting console ownership away from the existing shared workspace-to-console seam

### Public Interfaces And State

Browser-6 should preserve the shared seams already established by Browser-5.x:
- `workspaceSelection.selectedTarget`
- `workspaceSelection.explicitSelectedTargets`
- `workspaceSelection.selectionAnchorTarget`
- `workspaceSelection.resolvedContentSelection`
- shared console-context routing
- shared reference batch-load ownership

Hard rule:
- Browser-6 should not pull those truths back into `BrowserPanel`
- `BrowserPanel` should compose and dispatch
- shared app/viewer/console seams should continue to own the real state and command routing

### Locked Direction

#### 1. Meaningful structural split

Browser-6 should be a meaningful architecture cleanup, not a cosmetic helper extraction.

Locked rule:
- keep one top-level `BrowserPanel` host
- move row-vm derivation out of the panel body
- move selection / open / context-menu behavior out of the panel body
- keep row rendering on a small reusable shell plus row-family-specific adapters
- avoid a helper-only split that leaves the same logic density trapped in one file

#### 2. Family-specific adapter seams

Row-family-specific differences should not stay in one giant central panel switch.

Locked rule:
- keep the shared row shell and shared click grammar centralized
- move major row-family differences into narrower family-specific adapter seams
- first family seams should group behavior roughly by:
  - graph-document / graph-owned rows
  - content rows
  - reference rows
  - sketch rows

Each family seam should define:
- row identity mapping
- select/open/context-menu capability
- optional grouped-highlight behavior
- optional action surface participation

#### 3. Shared ownership stays outside BrowserPanel

Shared Browser-5.x seams must remain outside `BrowserPanel` ownership.

Locked rule:
- keep these outside `BrowserPanel`:
  - shared selection truth
  - explicit multi-select state
  - resolved grouped content-selection truth
  - console context routing
  - reference batch-load ownership
- `BrowserPanel` should become mainly:
  - row composition
  - event capture
  - dispatch into shared seams
  - visual-state rendering from derived row-vm truth

#### 4. Behavior-preserving cleanup by default

Browser-6 should preserve shipped Browser-5.x behavior unless the current structure forces a targeted bug fix.

Locked rule:
- prefer:
  - extract
  - rename
  - isolate seams
  - reduce duplication
  - improve tests around row-family boundaries
- only change shipped Browser-5.x behavior when the current structure makes a bug or inconsistency impossible to avoid
- keep the main success condition as:
  - Browser behavior still works the same
  - adding the next row-family or Browser action is much easier

### Initial Direction

The safest first Browser-6 cut is:
- preserve the current Browser behavior surface
- identify the current row-vm derivation seams already half-present in the code
- identify the current row-shell and row-family branching seams already half-present in the code
- extract interaction dispatch so `BrowserPanel` stops owning selection/open/context-menu behavior inline
- split row-family behavior into narrower adapters without prematurely unifying current practical families that still differ today

This keeps the phase aligned with the longer Browser vision:
- today:
  - keep practical families such as content, references, graph rows, and sketch rows understandable
- later:
  - leave the architecture open for imported folders/objects and generated folders/objects to converge into broader shared Browser primitives

### Required File Targets

Expected implementation seam owners:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/` new Browser row-family adapter or interaction files as needed
- `src/app/store/useAppStore.ts` only where existing Browser dispatch wiring needs cleaner shared-action entrypoints

Possible related verification seams:
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewerHost.test.tsx`

### Test Plan

Required Browser-6 verification:

- structural regression:
  - existing Browser-5.x selection behavior still works
  - existing Browser-5.3 selection-to-console behavior still works
  - existing Browser-5.4 explicit multi-select behavior still works
  - existing Browser-5.5 reference batch-loading behavior still works

- row-family seams:
  - content rows still keep grouped parent-selection behavior
  - reference rows still keep root/category/item load and selection behavior
  - graph rows still keep their existing select/open behavior
  - sketch rows still keep their current Browser participation rules

- panel ownership:
  - `BrowserPanel` no longer owns shared selection truth directly
  - `BrowserPanel` no longer owns console-context routing directly
  - `BrowserPanel` no longer owns reference batch-load truth directly

- readability/maintainability:
  - row-family behavior is testable in narrower seams
  - shared row shell behavior remains centralized
  - adding one new row-family-specific action no longer requires editing one giant central branch tree

### Assumptions

- Browser-5 through Browser-5.5 shipped behavior remains the product baseline.
- Shared workspace selection and console-routing seams stay canonical.
- Current row families may still differ practically in Browser-6 even if the longer-term Browser vision later converges imported and generated items more closely.
- Browser-6 is a structural enabler phase, not the phase that fully delivers the later folder/object convergence vision.

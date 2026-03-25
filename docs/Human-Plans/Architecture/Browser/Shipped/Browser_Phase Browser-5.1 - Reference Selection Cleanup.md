# Browser Phase Browser-5.1 - Reference Selection Cleanup

## Doc Header

### Doc History
5. 2026-03-25 09:44: Marked Browser-5.1 shipped after the reference-selection cleanup landed in code, moved this phase record into `Shipped/`, and aligned the doc wording with the delivered plain-selection boundary, viewport-to-Browser follow, deselect behavior, shared outline-only highlight, and darker active-versus-dormant reference row treatment
4. 2026-03-25 03:18: Locked `q4` and turned this Browser-5.1 follow-up into an implementation-ready spec, grounding the reference-selection cleanup on the existing Browser-5 shared-target path while naming the concrete Browser/viewer/store seams, deselect rules, reference highlight parity, and required verification targets
3. 2026-03-25 03:13: Locked `q2` in this Browser-5.1 follow-up doc so viewport-picked references now explicitly drive Browser selection whenever one clear matching reference row exists, keeping reference Browser follow aligned with the broader Browser-5 shared-target direction without inventing fake sync for ambiguous cases
2. 2026-03-25 03:12: Locked `q1` in this Browser-5.1 follow-up doc so ordinary reference selection now explicitly means highlight/select only, while stronger transform ownership must remain a separate explicit action instead of piggybacking on normal row or viewport selection
1. 2026-03-25 03:08: Created this standalone future Browser follow-up doc so the post-`Browser-5` reference-selection cleanup now has its own dedicated planning home under `Browser/Future/` instead of staying only as a short follow-up note inside the Browser umbrella index and shipped Browser-5 record

### Purpose

This phase cleans up Browser and viewport reference selection after the first shared Browser-5 selection/focus groundwork landed.

Use it to answer:
- how plain reference selection should differ from stronger reference transform/open actions
- how Browser reference rows and viewport-picked references should stay in sync
- how reference deselect, replacement, and highlight presentation should feel once they are no longer half-shared and half-special-cased

## Doc Body

## [x] Browser-5.1 - Reference Selection Cleanup

### Summary

This phase cleans up reference selection so it behaves more like honest lightweight workspace selection without collapsing reference-specific transform or open actions into ordinary row selection.

Phase outcome:
- Browser reference rows and viewport-picked references follow the same shared target truth where mapping is honest
- plain reference selection stays lightweight
- stronger reference transform/open ownership remains explicit
- deselect and replacement behavior for references reads predictably
- reference highlight/selection presentation matches the same outline/glow treatment already used for content/object selection

### Shipped Result

The first shipped Browser-5.1 cut landed the intended reference-selection cleanup:
- Browser reference-row single-click remains lightweight selection only
- viewport-picked references now resolve back into matching Browser reference rows when one clear row exists
- empty viewport click clears lightweight reference selection
- empty Browser click clears Browser row selection
- selecting a different reference replaces the old one
- selected references now use the same outline-only highlight treatment as selected objects/components/assemblies
- reference rows now also distinguish `active` versus `dormant` loaded state, so loaded references and their parent rows stay visually darker while unloaded rows remain lighter

### Owns

- reference Browser/viewport selection parity
- plain reference selection versus stronger reference transform ownership
- reference highlight and deselect cleanup
- reference replacement behavior
- keeping reference selection lightweight before stronger reference actions begin

### Does Not Own

- grouped parent-content multi-selection
- later explicit additive multi-select
- final reference transform tool design
- broader BrowserPanel structure cleanup

### Public Interfaces And State

This phase should continue treating `workspaceSelection.selectedTarget` as the shared selection truth for Browser rows, viewport reference picks, and selection-clearing behavior.

Reference-selection cleanup in scope:
- `reference-item` Browser rows
- viewport-picked references that can map honestly back to `reference-item` rows

This phase should preserve the Browser-5 split between:
- lightweight selection
- stronger transform/open ownership

That means:
- ordinary reference row click and ordinary viewport reference pick update shared selection truth
- stronger transform ownership remains a separate explicit action

### Locked Behavior

#### 1. Plain reference selection

Selecting a reference only highlights/selects it.

Locked rule:
- ordinary row click does not start `Move`
- ordinary viewport pick does not start `Move`
- ordinary reference selection does not enter transform mode

#### 2. Browser and viewport parity

Viewport-picked references should drive Browser selection whenever one clear matching reference row exists.

Locked rule:
- Browser follows honest one-to-one reference matches
- do not invent fake row sync for ambiguous cases

#### 3. Deselect and replacement

Reference deselect should stay aligned with the lighter Browser-5 selection model.

Locked rule:
- empty viewport click clears lightweight reference selection
- empty Browser click clears Browser row selection
- selecting a different reference replaces the old one unless a later multi-select mode is active
- `Esc` is only a backup clear when no stronger tool/session already owns it

#### 4. Reference highlight presentation

Reference selection should use the same visual highlight style as content/object selection.

Locked rule:
- same outline/glow treatment already used for selected objects/components/assemblies
- no fill-style material swap
- no size change
- no heavier reference-only transform look for plain selection

### Initial Direction

The first safe cleanup should preserve the Browser-5 selection model:
- reference selection writes through shared workspace target truth
- viewport-picked references should map back to Browser rows when a clean match exists
- empty-space deselect behavior should stay aligned with the lighter Browser-5 pattern

But reference-specific stronger actions should remain separate:
- plain reference selection should not immediately become active transform ownership
- transform/open actions should stay explicit instead of being hidden behind ordinary selection

### Questions / Decisions

#### [x] q1 - What is the exact boundary between plain reference selection and active reference transform ownership?

Question:
- when the user selects a reference row or picks a reference in the viewport, when should that stay lightweight selection and when should it escalate into active reference transform ownership?

Suggestion:
- plain click/pick should stay lightweight selection
- stronger transform ownership should require an explicit transform action, gesture, or mode change
- do not overload ordinary selection with transform side effects

Decision:
- selecting a reference only highlights/selects it
- ordinary row click or viewport pick does not start `Move`
- ordinary selection does not enter transform mode
- stronger reference transform ownership must remain a separate explicit action

#### [x] q2 - How should viewport-picked references map back into Browser row selection?

Question:
- when the user clicks a visible reference in the viewport, should the Browser always follow the matching row, and how should ambiguous or grouped reference cases behave?

Suggestion:
- Browser should follow whenever a clean one-to-one reference row match exists
- avoid fake follow behavior for ambiguous cases until the Browser can represent them honestly

Decision:
- yes
- when the user picks a reference in the viewport, the Browser should select the matching reference row whenever one clear matching row exists
- keep Browser follow honest and do not invent fake row sync for ambiguous cases

#### [x] q3 - How should reference deselect and replacement behave while no stronger transform action is active?

Question:
- once plain reference selection is cleaned up, what should empty-space click, replacement click, and `Esc` do for references?

Suggestion:
- keep the same lighter Browser-5 selection baseline:
  - empty viewport click clears lightweight reference selection
  - empty Browser click clears Browser row selection
  - selecting a different reference replaces the old one unless a later multi-select mode is active
  - `Esc` remains a backup clear only when no stronger tool/session already owns it

Decision:
- yes to all three
- empty viewport click clears lightweight reference selection
- empty Browser click clears Browser row selection
- selecting a different reference replaces the old one unless a later multi-select mode is active
- `Esc` remains a backup clear only when no stronger tool/session already owns it

#### [x] q4 - What should the first cleaned-up reference highlight presentation be?

Question:
- should reference selection presentation keep the current look, align more closely with content selection glow, or use a distinct but still lightweight reference-specific highlight?

Suggestion:
- keep it lightweight and visually aligned with the broader Browser-5 selection direction
- avoid full fill/material swaps
- keep stronger transform visuals separate from plain selection styling

Decision:
- use the same highlight treatment already used for objects/components/assemblies
- same outline/glow selection style
- no fill
- no size change
- keep any stronger reference-transform visuals separate from ordinary lightweight selection

### Required File Targets

Expected implementation seam owners:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/app/store/useAppStore.ts`
- Browser/viewer reference-selection bridge files where viewport-picked references resolve back into shared target truth

### Test Plan

Required Browser-5.1 verification:

- Browser reference-row single-click:
  - selects the reference
  - updates shared workspace target truth
  - does not start `Move`
  - does not enter transform mode

- Viewport reference pick:
  - selects the matching Browser reference row when one clear row exists
  - does not fabricate Browser follow for ambiguous cases
  - does not start `Move`

- Deselect and replacement:
  - empty viewport click clears lightweight reference selection
  - empty Browser click clears Browser row selection
  - selecting a different reference replaces the old one
  - `Esc` clears only when no stronger tool/session owns it

- Highlight presentation:
  - selected references use the same outline/glow treatment as selected content objects
  - selected references do not use a fill/material swap
  - selected references do not change size

- Regression:
  - existing reference transform/open actions still require explicit ownership
  - ordinary reference selection remains lightweight
  - Browser-5 content selection behavior remains unchanged

### Assumptions

- Browser-5 shared selection truth remains the base seam for this cleanup.
- Reference transform/open behavior stays separate from ordinary selection.
- Browser-5.2 grouped parent-selection work remains a later follow-up and is not widened into this reference cleanup phase.

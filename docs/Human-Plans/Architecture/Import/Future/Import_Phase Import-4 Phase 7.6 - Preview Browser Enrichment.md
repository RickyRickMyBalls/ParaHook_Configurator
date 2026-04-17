# `Import-4 Phase 7.6` - `Preview Browser Enrichment`

## Doc Header

### Doc History
28. 2026-04-17: Implemented `Import-4.7.6 - phase 6 - Highlighted Preview Row Remove Or Delete Actions`, adding one Preview Browser header-level `X` maintenance action driven by the shipped highlighted preview-row set, projecting explicit removable-owner truth into preview rows, and using one draft-owned dissolve path so authored preview assemblies and components can be removed without deleting truthful source-backed descendants
27. 2026-04-17: Prepped `Import-4.7.6 - phase 6 - Highlighted Preview Row Remove Or Delete Actions` for implementation by correcting the detailed phase-breakdown slot to match the current wishlist, grounding the next cut in the shipped preview-row highlight owner from `phase 5`, the newly shipped staged-file-card removal boundary from `phase 5.1`, and the need for one preview-only maintenance path that can delete highlighted authored preview owners without turning source-backed rows into imported-parts filtering
26. 2026-04-17: Implemented `Import-4.7.6 - phase 5.1 - Staged File Card Removal`, adding a compact top-right `X` action to each left-column staged-file card, reusing the draft-owned staged-file removal path so whole-file removal now updates the staged list and preview rows together, and clearing stale right-column preview selection honestly when the removed file had been feeding the object preview
25. 2026-04-17: Prepped `Import-4.7.6 - phase 5.1 - Staged File Card Removal` for implementation by grounding the next cut in the live left-column `Staged files` card header seam in `browserTreeMenus.tsx`, the existing staged-file removal ownership already present in `useAppStore.ts`, and the need to keep whole-file removal separate from preview-row delete while still clearing stale preview selection truth when the removed file was feeding the right-column object preview
24. 2026-04-17: Added `Import-4.7.6 - phase 5.1 - Staged File Card Removal` as the explicit left-column follow-up after shipped preview-row multi-select, capturing that whole staged-file removal should also be available directly in the `Staged files` card surface through a compact top-right `X` action without widening that behavior into preview-row maintenance, imported-parts acceptance, or broader import-dialog redesign
23. 2026-04-17: Implemented `Import-4.7.6 - phase 5 - Preview Browser Multi-Select Organization`, adding one staged-dialog-local preview-row selection owner plus anchor-backed click / ctrl-click / shift-click row highlighting in the Preview Browser so row highlight now supports truthful local multi-select organization without mutating workspace selection or replacing the selected `L` action as the only object-preview source signal
22. 2026-04-17: Prepped `Import-4 / Phase 7.6.5 - Preview Browser Multi-Select Organization` for implementation by grounding the next cut in the newly cleaned `7.6.4` button-only preview-source truth, the repo's existing main Browser click / shift-click / ctrl-click interaction language, and the need for one staged-dialog-local preview-row selection owner so row highlight can support later preview re-organization and remove/delete actions without leaking into workspace selection or imported-parts acceptance
21. 2026-04-17: Trimmed the shipped `Import-4 / Phase 7.6.4` presentation so active preview-source truth now lives on the selected `L` action only, removing the preview-row active highlight treatment to keep preview-load state separate from future row-highlight selection semantics that belong to `7.6.5`
20. 2026-04-17: Checked off the achieved `Wishlist Organization` items for `Import-4 / Phase 7.6`, marking the honestly landed `Phase 1` through `Phase 3` work plus the shipped portions of `Phase 4`, while intentionally leaving the newer preview-load-versus-row-highlight separation item unchecked because the current `7.6.4` implementation still uses row highlight for active preview-source truth
19. 2026-04-17: Reworked the `Import-4 / Phase 7.6` `Wishlist Organization` again so the high-level goals and phase ladder now match the updated row-highlight vision more honestly, adding explicit HLG ownership for separating preview-load truth from row-selection truth plus highlighted-row maintenance actions, and inserting a new highlighted-row remove/delete phase so the future selection-driven maintenance direction is no longer implied only by prose
18. 2026-04-17: Expanded the top-level `Import-4 / Phase 7.6` vision again so row highlight is now explicitly reserved for preview-Browser selection and organization semantics rather than preview-load state, capturing that later click, shift-click, and ctrl-click row highlighting should support easier preview-tree re-organization and eventually enable actions like remove/delete on the highlighted set
17. 2026-04-17: Implemented `Import-4 / Phase 7.6.4 - Active Preview Selection Truth In The Preview Browser`, widening the preview selection seam with one additive source-row read so the existing dialog-local staged-file object-preview owner can still remain intact while the preview-row selector now projects explicit active-row truth back into the middle-column Browser, letting wrapper object rows or explicitly loaded split child object rows visibly read as the current preview source without falsely marking owner-only rows or nested inspection-only `part` rows as active
16. 2026-04-17: Prepped `Import-4 / Phase 7.6.4 - Active Preview Selection Truth In The Preview Browser` for implementation by grounding the next cut in the shipped `7.6.3` row-level load action, the existing dialog-local `stagedImportPreviewSelection` staged-file seam, and the still-missing selector-owned active-row mapping needed so the middle-column preview Browser can honestly show which row currently feeds the right-column object preview without widening into multi-select, top-assembly grouping, or tree-line hierarchy work
15. 2026-04-17: Implemented `Import-4 / Phase 7.6.3 - Row-Level Load Into Object Preview`, widening the preview-row selector with explicit row-level preview-load source metadata and updating the preview Browser tree so truthful preview-target rows now expose a real compact row-level load action that reuses the existing dialog-local staged-file object-preview seam, while owner-only rows and inspection-only nested `part` rows stay without fake actions and active-row state remains deferred to `7.6.4`
14. 2026-04-17: Prepped `Import-4 / Phase 7.6.3 - Row-Level Load Into Object Preview` for implementation by grounding the next cut in the shipped `7.6.2` preview-target contract, the existing left-column staged-file `Load Into Preview Viewport` action and `stagedImportPreviewSelection` seam, and the still-missing row-level preview-load source metadata needed so middle-column preview-target rows can reuse that same object-preview load path without widening into active-row markers, part-isolation promises, multi-select, or top-assembly organization behavior
13. 2026-04-17: Implemented `Import-4 / Phase 7.6.2 - Preview Browser Preview-Target Contract`, widening the preview-row selector with one explicit preview-target-kind contract so wrapper and split object rows now read as direct preview targets, assembly and component owners now read as organization-only rows, and nested read-only `part` rows now read as inspection-only rows, with focused Browser proof that the contract is visible before any row-level load action, active-preview marker, or later organization behavior lands
12. 2026-04-17: Prepped `Import-4 / Phase 7.6.2 - Preview Browser Preview-Target Contract` for implementation by grounding the next cut in the shipped `7.6.1` preview-row selector widening, the current lack of any explicit preview-target flag on wrapper object versus read-only part rows, and the need to make previewability truthful before later row-level load actions, active-preview state, multi-select, or top-assembly organization land
11. 2026-04-17: Implemented `Import-4 / Phase 7.6.1 - Parts In The Preview Browser For 1 Object Multi-Object Files`, keeping the stored staged preview-organization graph unchanged while widening the preview-row selector and preview tree rendering so `1 Object` files with truthful internal parts now show read-only nested `Part` rows under the wrapper object, with focused Browser proof that the stronger split-mode shape still belongs only to `Multiple Objects In 1 Component`
10. 2026-04-17: Prepped `Import-4 / Phase 7.6.1 - Parts In The Preview Browser For 1 Object Multi-Object Files` again against the restored preview-Browser-only lane, tightening the implementation read around the live selector/store seam while explicitly excluding the later multi-select, `+A` top-assembly organization, and tree-line hierarchy work that now belong to later `7.6.x` phases
9. 2026-04-17: Expanded the restored preview-Browser-only `Import-4 / Phase 7.6` vision around the newly clarified wishlist that the preview Browser should support better multi-select organization, a `+A` flow that adds the current multi-selection into one assembly pinned at the top of the preview tree, and visible tree-line hierarchy readouts for object ownership
8. 2026-04-17: Restored `Import-4 / Phase 7.6` to preview-Browser-and-object-preview enrichment only after the later two-list imported-parts vision was identified as a better fit for `Import-4 / Phase 7.7`, narrowing this doc back down to truthful source-side parts visibility, preview-target truth, row-level object-preview loading, active preview synchronization, and preview-row polish
7. 2026-04-17: Rebuilt the detailed `Phases Breakdown` for `Import-4 / Phase 7.6` so the actual phase sections now match the new `Wishlist Organization` ladder, retiring the older preview-only `7.6.2` through `7.6.6` breakdown and replacing it with the explicit 9-phase two-list selective-import sequence
6. 2026-04-17: Reworked the `Import-4 / Phase 7.6` wishlist ladder again so it now matches the two-list selective-import vision more honestly, renaming the internal `Wishlist Organization` headings to the requested `### Import-4 - Phase 7.6 - Phase N` format and splitting the accepted-list, curation, commit-truth, and automatic mode-shift work into smaller one-by-one Codex-sized phases
5. 2026-04-17: Reformatted the `Import-4 / Phase 7.6` wishlist section to the current `Architecture Setup` shape by replacing `Wishlist Tracking` with `Wishlist Organization`, adding explicit `High Level Goals`, and mapping the `7.6.x` ladder back to those goals so the two-list selective-import direction stays visible while the subphases remain small and honest
4. 2026-04-17: Reframed `Import-4 / Phase 7.6` around a stronger two-list staged-import vision so this lane now explicitly owns not just preview-Browser readability but also the relationship between truthful source-side part rows, the staged `Add To Project` list, and the later selective-part acceptance direction where removing some parts should automatically leave the compatibility-wrapper `1 Object` mode and enter a new selective import mode
3. 2026-04-17: Prepped `Import-4 / Phase 7.6.1 - Parts In The Preview Browser For 1 Object Multi-Object Files` for implementation by grounding the next preview-Browser pass in the live `syncStagedImportPreviewOrganizationState(...)` wrapper-versus-split seam, the current selector-local row-derivation limitation that only expands assembly and component owners, and the Browser proof helper that mirrors that same shape, while locking the first cut to selector-derived read-only part rows instead of widening accepted import or drag ownership
2. 2026-04-16: Expanded the `Import-4 / Phase 7.6` ladder with a new first subphase for showing `Parts` in the preview Browser when a truthfully multi-object file stays on `1 Object`, moving the earlier preview-target, row-action, active-state, and cleanup work down to `7.6.2` through `7.6.6` so this wishlist item now has the first explicit implementation owner
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 7.6`, splitting the later staged preview Browser enrichment lane out of the broader `Phase 7` UI polish record so row-level preview-target truth, row-level object-preview affordances, active loaded-row clarity, and later preview-row readability polish can land in smaller one-by-one cuts

### Purpose

This doc owns the later staged preview Browser enrichment lane after the initial preview Browser organization surface and object preview viewport are already shipped.

Use it to answer:
- how the staged preview Browser should become easier to inspect as well as organize before commit
- how truthful source-side `Parts` and the right-column object preview should relate to one another during staged inspection
- how preview Browser `Parts` visibility, row-level preview targeting, active loaded-row truth, multi-select organization, and later row readability polish should be broken into Codex-sized subphases
- which enrichment changes stay preview-and-inspection-only without widening into imported-parts selection or import-runtime redesign

### Relationship To Parent Doc

Parent lane:
- `Import_Phase Import-4 Phase 7 - UI Cleanup And Polish.md`

This doc exists because:
- the preview Browser organization baseline is already shipped through `Import-3 / Phase 6`
- the right-column object preview viewport is already shipped through `Import-4 / Phase 6`
- the remaining follow-up work is bigger than one small polish footnote but should still land as narrow one-by-one cuts

Keep the parent `Import-4 / Phase 7` doc as the umbrella later UI polish lane.

Use this doc for:
- the detailed planning and phased execution of later staged preview Browser enrichment work

## Doc Body

### Goal

Turn the staged preview Browser lane into the honest planning home for source-side staged inspection:
- one source-side preview Browser that exposes the file's truthful objects or parts
- one right-column object preview for focused inspection

This lane should make those two surfaces easier to inspect, easier to connect, and easier to keep honest, including a truthful `Parts` read when a multiple-object file stays on `1 Object`, without widening this doc into imported-parts selection or accepted-result ownership.

### `7.6 Vision`

- treat the middle-column preview Browser as the truthful source-side structure read:
  - "what is in this uploaded file?"
- treat the right-column object preview as the focused inspection read:
  - "what does this chosen object or part look like?"
- the important honesty rule is:
  - showing truthful source-side parts is not enough by itself
  - the preview Browser must also explain which rows are truthful preview targets and which are structure-only owners
  - once the user loads a row into the right column, the Browser should say so clearly
- keep preview-load truth and row-selection truth as different signals:
  - the `L` action should communicate "this row is feeding the object preview"
  - row highlight should be reserved for preview-Browser selection and organization semantics
  - that highlighted row set should later support easier preview-tree re-organization plus actions like remove/delete on the selected rows
- keep this lane about staged inspection truth:
  - source-side structure truth
  - preview-target truth
  - active loaded-row truth
  - preview-Browser row-selection truth
  - multi-select organization truth
  - row readability polish
- imported-parts curation and selective import behavior belong in `Import-4 / Phase 7.7`, not here

### Locked Direction

- keep this lane staged-dialog-local:
  - no real project-content mutation before `Add To Project`
  - no hidden post-commit reinterpretation outside the staged dialog contract
- keep the source-side preview Browser and the right-column object preview as distinct surfaces:
  - source-side list = truthful file structure and organization read
  - right column = object inspection
- prefer small visible enrichment steps:
  - one-object wrapper rows that can still expose truthful source-side `Parts`
  - row-level preview-target truth
  - row-level load affordances
  - active loaded-row clarity
  - explicit multi-select organization behavior
  - one assembly owner at the top when grouped preview rows are organized together
  - visible tree-line hierarchy readouts
  - row-identity and action readability polish
- keep drag-and-drop on the existing shared Browser drag language instead of inventing a second preview-only drag vocabulary
- only rows backed by truthful staged object or part provenance should behave like direct object-preview targets
- keep assembly and component rows honest if they are organization owners but not direct previewable object targets
- keep `1 Object` preview behavior honest:
  - exposing truthful internal `Parts` should improve inspection
  - it should not imply a different accepted import result
- keep imported-parts selection and selective import behavior out of this lane:
  - no accepted-list ownership here
  - no selective import mode ownership here
  - no import-result filtering work here
- let preview-browser organization still improve within this lane:
  - row highlight should belong to preview-Browser row selection:
    - click = highlight one row
    - shift-click = highlight a range
    - ctrl-click = add or remove individual rows from the highlighted set
  - the row-highlighted set should later support organization and maintenance actions:
    - easier preview-tree re-organization
    - later remove/delete of highlighted rows
  - preview-load state should stay separate from row-highlight state:
    - the `L` button communicates the current object-preview source
    - row highlight is reserved for selection and organization semantics
  - multi-select may organize preview rows
  - `+A` may create one preview assembly owner for the current selection
  - that assembly owner should stay at the top of the preview Browser tree
  - this remains staged preview organization, not imported-parts acceptance

### Likely Architecture Seams

- `src/app/store/useAppStore.ts`
  - strongest seam for the draft-owned preview-organization truth, staged multi-selection ownership, top-assembly organization truth, and any additive preview metadata that must stay centralized instead of being panel-local guesswork
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - strongest seam for the compact preview-row view model and any additive `Parts` rows, `can load into preview`, preview-target truth, or hierarchy-line display metadata
- `src/app/panels/useBrowserPanelController.ts`
  - strongest seam for draft-local row-to-preview wiring, active loaded-row state, and any multi-select-plus-`+A` interaction wiring that must stay synchronized with the existing right-column preview selection
- `src/app/panels/browserTreeMenus.tsx`
  - strongest seam for preview Browser row actions, helper copy, active-state styling, multi-select affordances, top-assembly placement, tree-line rendering, and local row-readability polish
- `src/app/theme/surfaces/browser.css`
  - strongest seam for preview Browser row identity, nested `Parts` readability, active-state treatment, tree-line presentation, and control readability inside the staged dialog columns
- `src/app/panels/BrowserPanel.test.tsx`
  - strongest seam for Browser proof around preview Browser rendering, preview-target truth, row affordances, staged multi-select organization, top-assembly behavior, and draft-local preview synchronization

## Wishlist Organization

These wishlist mappings should be read as the planned `Import-4 / Phase 7.6` ladder for later staged preview Browser enrichment after the earlier preview organization and object preview viewport lanes are already shipped.

### High Level Goals

- [x] `HLG 1. Make The Source-Side Preview Browser Show Truthful Objects Or Parts From The Uploaded File`
- [x] `HLG 2. Let The Preview Browser Truthfully Indicate Which Rows Can Feed The Right-Column Object Preview`
- [x] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`
- [x] `HLG 4. Keep Preview-Load Truth Separate From Preview-Browser Row-Selection Truth`
- [ ] `HLG 5. Let The User Highlight, Multi-Select, And Organize Preview Rows Without Changing Accepted Import Behavior`
- [ ] `HLG 6. Let Highlighted Preview Rows Support Later Maintenance Actions Like Remove Or Delete Without Turning Into Imported-Parts Acceptance`
- [ ] `HLG 7. Make Preview Hierarchy Easier To Read Through Stable Top Assembly Ownership And Tree Lines`

### [x] Import-4.7.6 - phase 1
- [x] `1. Parts In The Preview Browser For 1 Object Multi-Object Files`
- [x] `1A. Show Truthful Parts Even When Import Mode Stays 1 Object`
- [x] `1B. Keep The Parts Nested Under The One Object Wrapper Row`
- [x] `1C. Preserve 1 Object Commit Truth`
- [x] `1D. Make Source-Side Part Visibility A Pure Inspection Read`
- [x] `HLG 1. Make The Source-Side Preview Browser Show Truthful Objects Or Parts From The Uploaded File`
- [x] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`

### [x] Import-4.7.6 - phase 2
- [x] `2. Preview-Target Contract For Source Rows`
- [x] `2A. Add Row-Level Previewability Truth To Source-Side Rows`
- [x] `2B. Keep Organization Owners Distinct From Direct Object-Preview Targets`
- [x] `2C. Preserve Existing Drag And Commit Ownership While Widening Preview Truth`
- [x] `HLG 2. Let The Preview Browser Truthfully Indicate Which Rows Can Feed The Right-Column Object Preview`
- [x] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`

### [x] Import-4.7.6 - phase 3
- [x] `3. Row-Level Load Into Object Preview`
- [x] `3A. Add Source-List Row Actions For Truthfully Previewable Rows`
- [x] `3B. Keep Non-Previewable Organization Rows Honest`
- [x] `3C. Preserve The Existing Draft-Local Preview Load Contract`
- [x] `HLG 2. Let The Preview Browser Truthfully Indicate Which Rows Can Feed The Right-Column Object Preview`
- [x] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`

### [ ] Import-4.7.6 - phase 4
- [x] `4. Active Preview Selection Truth`
- [x] `4A. Show Which Source Row Currently Feeds The Right-Column Object Preview`
- [x] `4B. Keep Preview-Load State Separate From Row-Highlight Selection State`
- [x] `4C. Keep Source-Side Preview State And Right-Column Preview State In Sync`
- [x] `4D. Preserve Draft-Local Preview-Load Ownership`
- [x] `HLG 2. Let The Preview Browser Truthfully Indicate Which Rows Can Feed The Right-Column Object Preview`
- [x] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`
- [x] `HLG 4. Keep Preview-Load Truth Separate From Preview-Browser Row-Selection Truth`

### [x] Import-4.7.6 - phase 5
- [x] `5. Preview Browser Row Highlight And Multi-Select Foundation`
- [x] `5A. Let The User Highlight Preview Rows Through Click, Shift-Click, And Ctrl-Click`
- [x] `5B. Keep Row-Highlight Truth Explicit And Staged-Dialog-Local`
- [x] `5C. Reserve Row Highlight For Selection And Organization Semantics Rather Than Preview-Load State`
- [x] `5D. Preserve Existing Single-Row Preview Behavior When The User Is Not Multi-Selecting`
- [x] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`
- [x] `HLG 4. Keep Preview-Load Truth Separate From Preview-Browser Row-Selection Truth`
- [x] `HLG 5. Let The User Highlight, Multi-Select, And Organize Preview Rows Without Changing Accepted Import Behavior`

### [x] Import-4.7.6 - phase 5.1
- [x] `5.1. Staged File Card Removal`
- [x] `5.1A. Let The User Remove One Whole Staged File Directly From Its Left-Column Card`
- [x] `5.1B. Use One Compact Top-Right X Action Without Hiding The Existing File-Type Pill`
- [x] `5.1C. Keep Whole-File Removal Separate From Preview-Row Highlight And L Button Truth`
- [x] `5.1D. Preserve Draft-Local Staged Import Behavior When A Removed File Was Feeding The Preview`
- [x] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`
- [x] `HLG 5. Let The User Highlight, Multi-Select, And Organize Preview Rows Without Changing Accepted Import Behavior`
- [x] `HLG 6. Let Highlighted Preview Rows Support Later Maintenance Actions Like Remove Or Delete Without Turning Into Imported-Parts Acceptance`

### [x] Import-4.7.6 - phase 6
- [x] `6. Highlighted Preview Row Remove Or Delete Actions`
- [x] `6A. Let The User Remove Or Delete Highlighted Preview Rows`
- [x] `6B. Keep Highlighted-Row Maintenance Actions Staged-Dialog-Local`
- [x] `6C. Preserve Preview-Only Organization Truth Without Widening Into Imported-Parts Acceptance`
- [x] `HLG 5. Let The User Highlight, Multi-Select, And Organize Preview Rows Without Changing Accepted Import Behavior`
- [x] `HLG 6. Let Highlighted Preview Rows Support Later Maintenance Actions Like Remove Or Delete Without Turning Into Imported-Parts Acceptance`

### [ ] Import-4.7.6 - phase 7
- [ ] `7. Add Selected Preview Rows To One Top Assembly`
- [ ] `7A. Let The User Use +A To Add The Current Highlighted Selection Into One Assembly`
- [ ] `7B. Keep That Assembly Pinned At The Top Of The Preview Browser Tree`
- [ ] `7C. Preserve Staged Preview Organization Truth Without Widening Into Imported-Parts Acceptance`
- [ ] `HLG 5. Let The User Highlight, Multi-Select, And Organize Preview Rows Without Changing Accepted Import Behavior`
- [ ] `HLG 7. Make Preview Hierarchy Easier To Read Through Stable Top Assembly Ownership And Tree Lines`

### [ ] Import-4.7.6 - phase 8
- [ ] `8. Preview Browser Tree Lines And Hierarchy Readability`
- [ ] `8A. Show Tree Lines For Preview Hierarchy`
- [ ] `8B. Make Parent-Child Ownership Easier To Scan`
- [ ] `8C. Keep The Top Assembly And Nested Rows Visually Honest`
- [ ] `HLG 5. Let The User Highlight, Multi-Select, And Organize Preview Rows Without Changing Accepted Import Behavior`
- [ ] `HLG 7. Make Preview Hierarchy Easier To Read Through Stable Top Assembly Ownership And Tree Lines`

### [ ] Import-4.7.6 - phase 9
- [ ] `9. Final Cleanup And Regression Proof`
- [ ] `9A. Lock One High-Signal Browser Proof For Preview Browser Enrichment`
- [ ] `9B. Remove Narrow Residue Retired By The New Preview Browser Treatment`
- [ ] `9C. Close Out The Preview Browser Enrichment Lane`
- [ ] `HLG 1. Make The Source-Side Preview Browser Show Truthful Objects Or Parts From The Uploaded File`
- [ ] `HLG 2. Let The Preview Browser Truthfully Indicate Which Rows Can Feed The Right-Column Object Preview`
- [ ] `HLG 3. Keep The Source Browser And The Right-Column Object Preview Distinct But Synchronized`
- [ ] `HLG 4. Keep Preview-Load Truth Separate From Preview-Browser Row-Selection Truth`
- [ ] `HLG 5. Let The User Highlight, Multi-Select, And Organize Preview Rows Without Changing Accepted Import Behavior`
- [ ] `HLG 6. Let Highlighted Preview Rows Support Later Maintenance Actions Like Remove Or Delete Without Turning Into Imported-Parts Acceptance`
- [ ] `HLG 7. Make Preview Hierarchy Easier To Read Through Stable Top Assembly Ownership And Tree Lines`



## Phases Breakdown

## [x] `Import-4.7.6 - phase 1 - Parts In The Preview Browser For 1 Object Multi-Object Files`

### Purpose

- show truthful `Parts` in the staged preview Browser even when the user keeps a truthfully multi-object file on `1 Object`

### Goal

- let the source-side preview Browser expose the file's truthful internal parts under the wrapper-style `1 Object` row so the user can inspect what is inside that file without being forced into `Multiple Objects In 1 Component`
- make that source-side parts read a pure inspection improvement, without widening Phase `7.6.1` into imported-parts selection or import-mode changes
- keep this first implementation cut strictly below the later organization follow-ons:
  - no multi-select ownership yet
  - no `+A` top-assembly grouping yet
  - no tree-line hierarchy rendering yet

### Locked Direction

- keep this first subphase preview-Browser-only:
  - no import-mode behavior changes
  - no commit-path changes
  - no new split-import behavior
- preserve the current `1 Object` meaning:
  - accepted import still commits through the one-object path
  - the preview Browser should not imply that the file will now land as multiple committed objects
- keep the `Parts` nested under the one-object wrapper row rather than promoting them to top-level split rows
- keep the first pass read-only for these `1 Object` part rows:
  - no drag ownership change
  - no add-to-component ownership change
  - no fake commit-time child-object promise
- treat this first cut as source-side truth only:
  - imported-parts list behavior belongs to `Import-4 / Phase 7.7`
  - selective import mode behavior belongs to `Import-4 / Phase 7.7`
  - preview multi-select belongs to `Import-4 / Phase 7.6.5`
  - `+A` top-assembly organization belongs to `Import-4 / Phase 7.6.6`
  - tree-line hierarchy readability belongs to `Import-4 / Phase 7.6.7`

### Expected Implementation Shape

- update `src/app/panels/selectStagedImportPreviewRows.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/store/useAppStore.ts` only if a real metadata gap appears that the selector cannot read honestly from the existing staged file plus preview-organization surfaces

### Implementation-Prep Read

- the shipped `Import-3 / Phase 6` preview-organization direction currently says:
  - `1 Object` files contribute one preview row
  - `Multiple Objects In 1 Component` files contribute truthful part-backed child rows grouped under one draft component-style owner
- that means the current preview Browser stays behaviorally honest, but it hides internal `Parts` whenever the user keeps the compatibility-wrapper `1 Object` path
- `src/app/store/useAppStore.ts`
  - `syncStagedImportPreviewOrganizationState(...)` currently creates one of two honest shapes:
    - `multiple-objects-in-component`:
      - one draft component-style owner row
      - truthful staged-part child object rows
    - `single-object`:
      - one staged-file wrapper object row
      - no nested child rows
  - the current preview node model only supports `assembly`, `component`, and `object`
  - the current parent-validation seam does not let object rows own children
  - that makes store widening a real boundary change, not just a small rendering tweak
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - currently flattens the staged preview graph into Browser rows
  - currently only expands child rows under `assembly` and `component` owners
  - currently returns a narrow row VM that only speaks `assembly`, `component`, and `object`
  - is therefore the strongest seam for adding selector-derived read-only `Part` rows under a `1 Object` wrapper without widening the draft preview-organization graph first
- `src/app/panels/browserTreeMenus.tsx`
  - already renders the preview Browser tree rows, row depth, row icons, and row-local actions
  - currently resolves preview row icons only for `assembly`, `component`, and `object`
  - is the strongest seam for making the new `Parts` read scan clearly as nested under a `1 Object` wrapper instead of reading like a split-import result
  - should stay scoped in this phase to row rendering only:
    - no multi-select affordances yet
    - no `+A` grouping behavior yet
    - no hierarchy-line treatment yet
- `src/app/theme/surfaces/browser.css`
  - already owns preview Browser row spacing and dense nested readability
  - is the strongest seam for visually distinguishing:
    - wrapper object rows
    - read-only part rows under `1 Object`
    - authored assemblies and components used for organization
  - should stay scoped in this phase to nested part readability rather than later tree-line hierarchy work
- `src/app/panels/BrowserPanel.test.tsx`
  - already mirrors the live preview-organization sync shape through the dialog test helper:
    - split mode becomes one component owner plus child part-backed object rows
    - `1 Object` becomes one wrapper object row only
  - should prove the first part-read follow-up stays honest:
    - `1 Object` still renders one wrapper owner row
    - truthful `Parts` now appear nested under that row
    - the mode itself still remains `1 Object`
  - should not widen in this phase into preview-row multi-select or assembly-grouping proof

### First-Pass Decisions

- show `Parts` in the preview Browser only when the staged structure truth already supports them
- keep those rows nested under the wrapper row for `1 Object` mode
- prefer `Part` rows that read as inspection truth, not as accepted split-object promises
- keep the first pass read-only and non-organizational for those nested `Part` rows
- prefer selector-derived preview row enrichment over widening the stored preview-organization graph in this first pass
- do not let the `1 Object` preview read collapse back into the same preview shape as `Multiple Objects In 1 Component`
- do not let this first cut absorb later preview-browser organization asks:
  - no multi-select state
  - no top-assembly creation
  - no tree-line drawing

### Exact First Code Cut

1. Audit the current staged preview-organization derivation for `1 Object` versus `Multiple Objects In 1 Component`.
2. Extend the preview-row selector so a truthfully multi-object staged file on `1 Object` can contribute:
   - one wrapper object row from the existing preview-organization graph
   - nested read-only `Part` rows derived from truthful staged `structureInspection.summary.partRows`
3. Keep the stored preview-organization graph and the existing split-mode shape unchanged so `Multiple Objects In 1 Component` still owns the true split-preview result.
4. Update the preview Browser row rendering and styling so the nested `Part` rows read as internal inspection of the wrapper object rather than a hidden split-import mode.
5. Keep the right-column object-preview, later multi-select, later `+A`, and later tree-line behavior unchanged in this first cut.
6. Add focused Browser proof that `1 Object` now still shows truthful `Parts` in the preview Browser while commit behavior remains on the one-object path.

### Likely Files

- `src/app/panels/selectStagedImportPreviewRows.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.ts` only if the row selector truly cannot stay honest without one additive metadata seam

### No-Widening Rule

- do not change what `1 Object` commits
- do not auto-switch the user into `Multiple Objects In 1 Component`
- do not make these nested `Part` rows a new top-level organization owner
- do not widen into object-preview row actions yet
- do not widen into preview-row multi-select, `+A` top-assembly grouping, or hierarchy-line rendering

### Implementation Risks

- making `1 Object` mode look behaviorally identical to split mode
- implying that nested `Part` rows under the wrapper will commit as separate Browser objects when they will not
- widening the first pass into stored preview-organization graph surgery when selector-local derived rows would have been sufficient
- widening the first pass into drag ownership or preview-target behavior before the nested-parts read is stable
- widening the first pass into later preview-browser organization work before the simple nested-parts inspection read is proven
- regressing the current split-mode preview shape while trying to add the new wrapper-owned part read

### Checklist

- [x] show truthful `Parts` in the preview Browser when a multi-object file stays on `1 Object`
- [x] keep those parts nested under the one-object wrapper row
- [x] preserve `1 Object` commit truth
- [x] keep multi-select, `+A` grouping, and tree-line hierarchy work deferred to later `7.6.x` phases
- [x] add focused Browser proof for the wrapper-plus-parts read

### Verification Shape

Minimum verification for this subphase should cover:

- a truthfully multi-object staged file kept on `1 Object` still shows one wrapper row in the preview Browser
- truthful `Part` rows now appear nested under that wrapper row
- `Multiple Objects In 1 Component` still keeps its stronger split-preview shape
- no preview-browser organization changes such as multi-select, top-assembly grouping, or tree lines land as part of this first cut
- no import-mode behavior, commit behavior, or accepted project-content behavior changes land as part of this preview-only pass

### Done Shape

- the preview Browser can show what is inside a multi-object file even when the user keeps the compatibility-wrapper import mode
- `1 Object` stays honest as one-object commit behavior while the preview Browser still exposes truthful internal `Parts`
- `Import-4 / Phase 7.6.2` remains the next preview-browser follow-up for row-level preview-target truth

## [x] `Import-4.7.6 - phase 2 - Preview Browser Preview-Target Contract`

### Purpose

- add the smallest honest previewability contract needed before row-level object-preview actions can land inside the staged preview Browser

### Goal

- define which source-side rows are truthfully previewable object or part targets
- keep structure-owner rows, read-only rows, and direct object-preview targets visibly distinct

### Locked Direction

- keep this phase contract-focused:
  - no row-level load actions yet
  - no active-preview badges yet
- preserve existing drag and commit ownership while widening preview truth
- keep previewability driven by truthful staged object or part provenance rather than visual row shape alone
- keep this phase below the later preview-browser organization work:
  - no multi-select ownership yet
  - no `+A` top-assembly grouping yet
  - no tree-line hierarchy work yet

### Expected Implementation Shape

- update `src/app/panels/selectStagedImportPreviewRows.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/panels/useBrowserPanelController.ts` only if the current pointer/selection seam cannot stay honest without one additive preview-target read

### Implementation-Prep Read

- `Import-4 / Phase 7.6.1` is now shipped:
  - `1 Object` files with truthful internal parts can now show nested read-only `part` rows under the wrapper object
  - `Multiple Objects In 1 Component` still owns the stronger component-plus-object split shape
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - now derives a preview-row VM that can speak `assembly`, `component`, `object`, and read-only `part`
  - currently does not expose any explicit preview-target contract such as:
    - `isPreviewTarget`
    - `previewTargetKind`
    - `previewTargetSource`
  - therefore still leaves the Browser to visually treat previewable and non-previewable rows too similarly
- `src/app/panels/browserTreeMenus.tsx`
  - now renders wrapper-object rows, split-mode object rows, and read-only `part` rows with distinct row kinds and icons
  - currently does not tell the human which of those rows are truthfully eligible to feed the right-column object preview
  - is therefore the strongest seam for adding the first visible but still non-interactive preview-target read
- `src/app/panels/useBrowserPanelController.ts`
  - currently still resolves preview selection by staged file id from the left staged-file settings column rather than from preview Browser rows
  - should stay mostly untouched in this phase unless one additive seam is needed to keep pointer behavior honest while preview-target truth widens
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the nested `part` read under `1 Object`
  - should next prove the preview-target distinction stays honest, for example:
    - wrapper object rows may be preview targets
    - split-mode object rows may be preview targets
    - structure-only owners should not read as direct preview targets
    - read-only `part` rows should only read as preview targets if the actual later row-action contract can truthfully target them

### First-Pass Decisions

- make preview-target truth explicit in the preview-row VM before adding any row-level load action
- prefer one additive selector-owned contract over panel-local label guessing
- keep structure-owner rows honest:
  - assemblies stay organization owners
  - components stay organization owners
- keep read-only `part` rows honest:
  - do not mark them previewable unless the later row-action phase can really load them through a truthful target seam
- preserve the current drag and commit ownership unchanged in this phase
- do not let this contract phase absorb later work:
  - no row-level load actions
  - no active-preview row markers
  - no multi-select or grouping behavior

### Exact First Code Cut

1. Audit the shipped `7.6.1` preview-row VM and identify which existing row kinds can truthfully feed the right-column object preview.
2. Extend the preview-row selector with one explicit preview-target contract that distinguishes:
   - organization-owner rows
   - inspection-only read-only rows
   - direct preview-target rows
3. Update the preview Browser row rendering so the human can see that distinction without introducing clickable load actions yet.
4. Keep the current object-preview loading path unchanged so this phase remains contract-only.
5. Add focused Browser proof that preview-target truth is now explicit while row actions, active-preview state, and organization behavior remain unchanged.

### Likely Files

- `src/app/panels/selectStagedImportPreviewRows.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/useBrowserPanelController.ts` only if one additive honesty seam is truly required

### No-Widening Rule

- do not add row-level `Load Into Object Preview` actions yet
- do not add active-preview badges yet
- do not change drag ownership
- do not change commit ownership
- do not widen into multi-select, `+A` grouping, or tree-line hierarchy work

### Implementation Risks

- marking structure-only owners as if they could directly feed the object preview
- marking read-only `part` rows previewable before there is a truthful later load path for them
- encoding previewability in panel-local copy instead of one explicit selector contract
- widening this contract pass into the actual row-action or active-selection phases too early
- regressing the newly shipped `7.6.1` nested-parts read while trying to add preview-target truth

### Checklist

- [x] add row-level previewability truth to source-side rows
- [x] keep organization owners and read-only rows distinct from direct object-preview targets
- [x] preserve existing drag and commit ownership while widening preview truth

### Verification Shape

Minimum verification for this subphase should cover:

- previewable source-side rows now expose explicit preview-target truth
- organization-owner rows stay visibly distinct from direct preview-target rows
- the shipped `7.6.1` nested `part` read under `1 Object` remains intact
- no row-level load actions, active-preview badges, multi-select behavior, or grouping behavior land as part of this contract-only pass

### Done Shape

- the preview Browser can now honestly tell the human which rows can feed the right-column object preview before any row-level load actions exist
- wrapper and split object rows now read as `Preview target`, assembly and component owners now read as `Owner only`, and nested read-only `part` rows now read as `Inspect only`
- `Import-4 / Phase 7.6.3` remains the next follow-up for the actual row-level `Load Into Object Preview` affordance

## [x] `Import-4.7.6 - phase 3 - Row-Level Load Into Object Preview`

### Purpose

- add row-level `Load Into Object Preview` affordances only for rows that already satisfy the truthful preview-target contract

### Goal

- let the user load previewable source-side rows into the right-column object preview
- keep non-previewable organization rows honest instead of giving every row the same action language

### Locked Direction

- keep non-previewable organization rows honest:
  - no fake action buttons
  - no row-level preview promises for structure-only owners
- preserve the existing draft-local object-preview load contract rather than inventing a second preview ownership path
- keep this phase below later synchronization and organization work:
  - no active-preview badge or current-row marker yet
  - no multi-select ownership yet
  - no `+A` top-assembly grouping yet
  - no tree-line hierarchy work yet

### Expected Implementation Shape

- update `src/app/panels/selectStagedImportPreviewRows.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- `Import-4 / Phase 7.6.2` is now shipped:
  - preview Browser rows now expose explicit `previewTargetKind` truth
  - wrapper object rows and split child object rows read as `Preview target`
  - assembly and component rows read as `Owner only`
  - nested read-only `part` rows read as `Inspect only`
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - currently exposes row kind, depth, readability meta, and preview-target truth
  - currently does not expose the actual row-to-preview load source needed by a row-level action, such as:
    - `previewLoadStagedFileId`
    - `canLoadIntoObjectPreview`
  - therefore still leaves `browserTreeMenus.tsx` unable to add truthful row-level load actions without local guessing
- `src/app/panels/browserTreeMenus.tsx`
  - already renders the preview Browser tree plus the compact inline `P / O / I` token
  - already owns the visible row-action seam through `BrowserImportDialogPreviewRowAction`
  - therefore is the strongest seam for adding the first real `Load Into Object Preview` row action only where the row VM says it is legal
- `src/app/panels/useBrowserPanelController.ts`
  - already owns `handleLoadStagedImportPreview(stagedFileId)` and the dialog-local `stagedImportPreviewSelection`
  - already powers the left-column staged-file action:
    - `Load <file> into preview viewport`
  - should remain the single preview-load owner in this phase, with the middle-column row action reusing that same staged-file load path instead of inventing a second selection owner
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the left-column staged-file preview load behavior
  - already proves the `7.6.2` preview-target contract
  - should next prove:
    - preview-target rows in the Browser get a truthful row-level load action
    - owner-only and inspect-only rows do not get fake load actions
    - triggering the row action still loads through the same object-preview viewport path
    - active-row highlight still remains deferred to `7.6.4`

### First-Pass Decisions

- keep row-level load ownership on the existing dialog-local staged-file preview selection seam
- add one explicit selector-owned row-level preview load source instead of letting the view guess from row label or row kind
- keep assembly and component rows non-loadable
- keep nested read-only `part` rows non-loadable in this phase:
  - they remain inspection-only
  - this phase should not imply isolated part-level preview loading before a truthful target exists
- allow row-level load actions only on rows that already read as `Preview target`
- do not let this action phase absorb later work:
  - no active-preview badges
  - no current-row synchronization styling
  - no multi-select or grouping behavior

### Exact First Code Cut

1. Audit the shipped `7.6.2` preview-row VM and identify which preview-target rows can truthfully route into the existing staged-file preview load seam.
2. Extend the preview-row selector with one explicit row-level preview load source, likely a staged-file id, so the Browser row action does not guess.
3. Update the preview Browser row rendering so only loadable preview-target rows expose `Load Into Object Preview`.
4. Route that row action through the existing `handleLoadStagedImportPreview(stagedFileId)` path in `useBrowserPanelController.ts`.
5. Keep owner-only rows and inspect-only rows without any fake row action.
6. Add focused Browser proof that the row-level action exists only where truthful and still drives the same right-column preview viewport load path.

### Likely Files

- `src/app/panels/selectStagedImportPreviewRows.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not add active-preview badges or current-row markers yet
- do not change the right-column object-preview runtime itself
- do not introduce isolated part-level preview loading promises yet
- do not change drag ownership
- do not change commit ownership
- do not widen into multi-select, `+A` grouping, or tree-line hierarchy work

### Implementation Risks

- letting `browserTreeMenus.tsx` infer loadability from row kind alone instead of one explicit selector contract
- giving load actions to owner-only assembly or component rows
- giving load actions to nested read-only `part` rows before there is a truthful isolated part-preview target
- inventing a second row-local preview selection owner instead of reusing the existing staged-file preview load path
- widening the row-action pass into active-row synchronization work that belongs to `7.6.4`

### Checklist

- [x] add source-list row actions for truthfully previewable rows
- [x] keep non-previewable organization rows honest
- [x] preserve the existing draft-local preview load contract

### Verification Shape

Minimum verification for this subphase should cover:

- preview-target Browser rows now expose a real row-level `Load Into Object Preview` action
- owner-only and inspect-only rows still do not expose fake row actions
- using the row-level action still drives the same right-column object-preview viewport load path
- the `7.6.2` preview-target contract remains visible and honest
- no active-preview badges, multi-select behavior, grouping behavior, or tree-line behavior land as part of this action pass

### Done Shape

- the preview Browser now lets the user load truthfully previewable rows into the right-column object preview
- row-level load ownership still stays on the existing dialog-local staged-file preview selection seam
- wrapper object rows and split child object rows now expose the compact row-level load action, while owner-only rows and inspection-only nested `part` rows still stay without fake row actions
- `Import-4 / Phase 7.6.4` remains the next follow-up for showing which source row is currently feeding the object preview

## [x] `Import-4.7.6 - phase 4 - Active Preview Selection Truth In The Preview Browser`

### Purpose

- make the preview Browser clearly show which row currently feeds the right-column object preview so the middle and right columns read as one coordinated staged inspection flow

### Goal

- `4A. Show Which Source Row Currently Feeds The Right-Column Object Preview`
- `4B. Keep Preview-Load State Separate From Row-Highlight Selection State`
- `4C. Keep Source-Side Preview State And Right-Column Preview State In Sync`
- keep source-side preview state and right-column preview state synchronized without collapsing them into one hidden owner

### Locked Direction

- keep this phase synchronization-focused:
  - no large styling cleanup pass yet
  - no imported-parts behavior widening here
- preserve draft-local selection ownership while still making cross-column state readable
- keep this phase below later organization work:
  - no multi-select ownership yet
  - no `+A` top-assembly grouping yet
  - no tree-line hierarchy work yet

### Expected Implementation Shape

- update `src/app/panels/selectStagedImportPreviewRows.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/panels/useBrowserPanelController.ts` only if one additive active-row seam is truly required
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- `Import-4 / Phase 7.6.3` is now shipped:
  - preview-target rows now expose a real compact row-level load action
  - the row action still routes through the existing dialog-local `stagedImportPreviewSelection` staged-file seam
  - owner-only rows and inspection-only rows stay without fake actions
- `src/app/panels/useBrowserPanelController.ts`
  - already owns `stagedImportPreviewSelection: { stagedFileId: string } | null`
  - currently treats that state as the right-column object-preview selection owner
  - currently does not project that state back onto preview Browser rows, so the middle column still cannot say which row is active
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - already carries `previewTargetKind`, `previewLoadStagedFileId`, and `canLoadIntoObjectPreview`
  - currently does not carry selector-owned active-preview truth such as:
    - `isActivePreviewSelection`
    - `activePreviewMatchKind`
  - therefore still leaves the Browser to guess active-row state from labels or local click history
- `src/app/panels/browserTreeMenus.tsx`
  - already renders row kinds, preview-target tokens, and row-level load actions
  - is therefore the strongest seam for adding the first visible current-preview marker once the selector exposes explicit active-preview truth
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves row-level preview load actions and the right-column load path
  - should next prove:
    - the loaded preview row is visibly marked in the Browser
    - a different non-active preview-target row is not marked
    - owner-only rows still do not pretend to be the active preview source
    - active-row truth updates when the staged import mode changes from wrapper object to split component/object shape

### First-Pass Decisions

- keep active-preview truth derived from the existing dialog-local staged-file preview selection owner
- prefer one selector-owned active-row contract over panel-local comparisons against row labels
- mark only one truthful source row as active for a given staged-file preview selection
- keep nested inspection-only `part` rows non-active in this phase:
  - the right-column preview still loads by staged file, not isolated part
  - this phase should not imply isolated part-level preview ownership
- allow active-row highlighting on:
  - wrapper object rows in `1 Object`
  - split child object rows when the file is in `Multiple Objects In 1 Component`
- keep owner-only rows visually honest even when they are adjacent to the active row
- do not let this synchronization phase absorb later work:
  - no new load actions
  - no multi-select
  - no grouping
  - no tree-line rendering

### Exact First Code Cut

1. Audit the shipped `7.6.3` preview-row VM and identify how the existing staged-file preview selection should map back onto one truthful source row in each preview shape.
2. Extend the preview-row selector with one explicit active-preview contract derived from `stagedImportPreviewSelection`.
3. Update the preview Browser row rendering so the active source row reads as the current object-preview source without changing row-action ownership.
4. Keep the right-column preview runtime and row-level load action behavior unchanged.
5. Add focused Browser proof that active-row truth follows the existing preview selection state across wrapper-object and split-child-object shapes.

### Likely Files

- `src/app/panels/selectStagedImportPreviewRows.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/useBrowserPanelController.ts` only if one additive active-row seam is honestly needed

### No-Widening Rule

- do not add new row-level load actions
- do not change the right-column object-preview runtime
- do not introduce isolated part-level active-preview promises yet
- do not change drag ownership
- do not change commit ownership
- do not widen into multi-select, `+A` grouping, or tree-line hierarchy work

### Implementation Risks

- deriving active-row truth from local click history instead of the real staged-file preview selection owner
- marking owner-only rows as if they directly feed the object preview
- marking nested inspection-only `part` rows active before isolated part-level preview exists
- allowing multiple rows to look active for one staged-file preview selection
- widening the synchronization pass into styling cleanup or later organization behavior

### Checklist

- [x] `4A. Show Which Source Row Currently Feeds The Right-Column Object Preview`
- [ ] `4B. Keep Preview-Load State Separate From Row-Highlight Selection State`
- [x] `4C. Keep Source-Side Preview State And Right-Column Preview State In Sync`
- [x] `4D. Preserve Draft-Local Preview-Load Ownership`

### Verification Shape

Minimum verification for this subphase should cover:

- the currently loaded object-preview source row is visibly marked in the preview Browser
- non-active preview-target rows stay unmarked
- owner-only and inspection-only rows do not falsely read as the active preview source
- active-row truth stays synchronized with the existing staged-file preview selection across wrapper-object and split-child-object preview shapes
- no multi-select behavior, grouping behavior, or tree-line behavior land as part of this synchronization pass

### Done Shape

- the preview Browser now clearly shows which row currently feeds the right-column object preview
- active-row truth still stays derived from the existing dialog-local staged-file preview selection owner
- single-object wrapper rows can now read as the current preview source through staged-file-only selection, while split child object rows can read as the current preview source when they explicitly triggered the row-level load action
- `Import-4 / Phase 7.6.5` remains the next follow-up for preview Browser multi-select organization

## [x] `Import-4.7.6 - phase 5 - Preview Browser Multi-Select Organization`

### Purpose

- let the preview Browser support small truthful organization moves by allowing the user to highlight multiple preview rows at once before later grouping actions land

### Goal

- let the user highlight preview rows through click, shift-click, and ctrl-click
- keep row-highlight and multi-select staged-dialog-local and honest instead of inventing hidden accepted-result behavior
- preserve existing single-row preview behavior when the user is not multi-selecting

### Locked Direction

- keep this phase selection-focused:
  - no `+A` grouping behavior yet
  - no hierarchy-line rendering yet
- preserve the current single-row object-preview behavior unless the user is explicitly multi-selecting
- keep row-highlight truth separate from preview-load truth:
  - the `L` button continues to communicate the current object-preview source
  - row highlight belongs to selection and organization semantics only
- keep multi-select truth local to the preview Browser and staged preview organization only:
  - no workspace-selection mutation
  - no imported-parts acceptance behavior

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/store/useAppStore.ts` only if one additive staged-dialog-local preview-selection owner is truly needed there instead of controller-local state

### Implementation-Prep Read

- `Import-4 / Phase 7.6.4` is now cleaned up:
  - preview-source truth lives on the selected `L` action only
  - preview rows themselves no longer use active highlight for object-preview source state
- `src/app/panels/browserInteractions.ts`
  - already contains the repo's established Browser interaction language for:
    - click single selection
    - ctrl-click additive selection
    - shift-click range selection
  - is a strong behavior reference, but this phase should not directly reuse workspace selection because the preview Browser is staged-dialog-local
- `src/app/panels/useBrowserPanelController.ts`
  - already owns dialog-local staged import state and preview-row pointer handling
  - is therefore the strongest seam for introducing one preview-row selection owner for highlighted rows, including:
    - selected preview row ids
    - preview selection anchor row id for range selection
  - should keep that selection local to the staged import dialog rather than routing through workspace selection
- `src/app/panels/browserTreeMenus.tsx`
  - already renders preview rows, row-level load buttons, and tree row classes
  - is therefore the strongest seam for surfacing selected-row and grouped-selected-row treatment once the controller exposes preview-row selection state
- `src/app/theme/surfaces/browser.css`
  - already contains the main Browser's `isSelected` and `isGroupedSelected` row treatment language
  - should likely extend that same visual vocabulary to the preview Browser rather than inventing a separate highlight language
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the main Browser's click / ctrl-click / shift-click selection behavior
  - should next prove the staged preview Browser equivalents, for example:
    - click highlights one preview row
    - ctrl-click adds another preview row
    - shift-click builds a range using the staged preview anchor
    - the `L` button still remains the only preview-source signal
    - no workspace selection mutation occurs as part of preview-row highlighting

### First-Pass Decisions

- use the main Browser's click / ctrl-click / shift-click interaction language as the behavior model for preview-row selection
- keep preview-row selection state local to the staged import dialog
- reserve row highlight for selection semantics only
- keep the selected `L` action as the only preview-source truth indicator
- allow multi-select only across preview rows that belong to the preview Browser's own row set
- do not let this selection phase absorb later maintenance or organization work:
  - no remove/delete actions yet
  - no `+A` grouping yet
  - no tree lines yet

### Exact First Code Cut

1. Audit the existing preview-row pointer seam and the main Browser's click / shift-click / ctrl-click interaction rules.
2. Introduce one staged-dialog-local preview-row selection owner plus anchor row ownership.
3. Update preview-row pointer handling so click selects one row, ctrl-click toggles additive selection, and shift-click builds a range within the preview-row set.
4. Update preview Browser rendering so the selected row and grouped-selected rows read clearly without affecting the `L` button preview-source signal.
5. Add focused Browser proof that preview-row highlighting is staged-dialog-local, follows the intended click modifiers, and stays separate from preview-load truth.

### Likely Files

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.ts` only if a controller-local owner would be dishonest

### No-Widening Rule

- do not change the `L` button preview-source semantics
- do not add remove/delete actions yet
- do not add `+A` grouping yet
- do not add tree-line hierarchy work yet
- do not route preview-row highlight through workspace selection
- do not widen into imported-parts acceptance behavior

### Implementation Risks

- reusing workspace selection directly instead of keeping preview-row highlight local to the staged dialog
- letting row highlight and `L` button selected state communicate the same thing again
- skipping range-anchor ownership and therefore making shift-click behavior inconsistent
- widening the selection pass into remove/delete or grouping behavior too early
- inventing a preview-only highlight vocabulary that does not match the repo's main Browser interaction language

### Checklist

- [x] let the user highlight preview rows through click, shift-click, and ctrl-click
- [x] keep row-highlight truth explicit and staged-dialog-local
- [x] preserve existing single-row preview behavior when the user is not multi-selecting

### Verification Shape

Minimum verification for this subphase should cover:

- click highlights one preview row
- ctrl-click adds or removes individual preview rows from the highlighted set
- shift-click builds a preview-row range from the staged preview anchor
- the `L` button still remains the only active preview-source signal
- no workspace selection mutation or imported-parts behavior lands as part of this phase

### Done Shape

- the preview Browser now supports staged-dialog-local row highlighting and multi-select using the repo's established Browser interaction language
- row highlight is now available for later re-organization and maintenance work without replacing the `L` button's preview-source truth
- `Import-4.7.6 - phase 6` remains the next follow-up for highlighted preview-row remove/delete actions

## [x] `Import-4.7.6 - phase 5.1 - Staged File Card Removal`

### Purpose

- let the user remove one whole staged file directly from its left-column `Staged files` card without needing to first target preview rows in the middle-column Browser

### Goal

- add one compact `X` action to the top right of each staged-file card
- preserve the current file-type chip by shifting it left instead of replacing it
- remove the whole staged file and its preview rows from the current draft
- keep this whole-file action separate from preview-row highlight, preview-row delete, and the selected `L` preview-source truth

### Locked Direction

- keep this phase left-column and whole-file focused:
  - this is staged-file-card removal
  - this is not preview-row remove/delete
- keep the action compact and visually stable:
  - one top-right `X`
  - file-type chip stays visible just to the left
- keep the behavior staged-dialog-local:
  - removing the file removes it from the current staged import draft
  - it does not mutate project content directly
- if the removed file was feeding the right-column object preview:
  - clear that preview selection or fall back honestly
  - do not leave stale preview-source truth behind

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/store/useAppStore.ts` only if the existing staged-file removal owner needs one narrow seam widening
- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/theme/surfaces/browser.css` only if the current staged-file card header layout cannot fit the file-type pill plus the new `X` action cleanly

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already renders the left-column `Staged files` cards through the `BrowserImportDialogStagedRowHeader` seam
  - already places the file order, file name, and top-right file-type pill in the exact header area this phase needs
  - is therefore the strongest seam for adding one compact top-right `X` action without widening into preview-Browser row actions
- `src/app/store/useAppStore.ts`
  - already contains the draft-owned staged-file removal path used by commit cleanup and staged-file filtering
  - already re-syncs preview organization from the remaining `stagedFiles`
  - is therefore likely the truthful owner for removing one staged file from the current draft if the controller exposes that action
- `src/app/panels/useBrowserPanelController.ts`
  - already owns dialog-local staged import behavior and the current `stagedImportPreviewSelection`
  - is therefore the strongest seam for wiring the left-column remove action and clearing stale preview selection if the removed file was the current object-preview source
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves staged import dialog layout, preview loading, and later preview-browser actions
  - should next prove:
    - each staged-file card now shows one compact remove action
    - removing a file drops it from the left-column staged list
    - the preview Browser loses the removed file's rows
    - current preview selection is cleared or updated honestly if that file had been loaded
- `src/app/theme/surfaces/browser.css`
  - already styles the staged-file card header row and file-type pill
  - may need only a small layout adjustment so the current top-right file-type pill shifts left cleanly when the `X` action is added

### First-Pass Decisions

- prefer one compact `X` action in the staged-file card header instead of a large secondary row control
- keep the file-type pill visible and move it left rather than replacing it
- treat this as whole-file draft removal:
  - remove the staged file
  - remove its preview rows
  - keep commit/project content untouched
- keep this action separate from preview-row selection:
  - no dependence on highlighted preview rows
  - no row-delete wording leakage into the left-column file cards
- if the removed file is the current object-preview source, clear preview selection unless there is one obvious truthful fallback already defined by the existing dialog logic

### Exact First Code Cut

1. Audit the live staged-file card header in `browserTreeMenus.tsx` and identify the narrowest place to add one compact top-right `X` action while keeping the file-type chip visible.
2. Reuse or expose the existing staged-file draft removal owner from `useAppStore.ts` through `useBrowserPanelController.ts`.
3. Wire the new card-level `X` action so removing a file updates the staged file list and re-syncs preview rows from the remaining draft state.
4. Clear stale `stagedImportPreviewSelection` if the removed file had been feeding the right-column object preview.
5. Add focused Browser proof for card-level removal, preview-row disappearance, and honest preview-state cleanup.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css` only if the card-header layout needs a small fit pass
- `src/app/store/useAppStore.ts` only if the existing removal owner is not already directly reusable

### No-Widening Rule

- do not turn this into preview-row remove/delete
- do not make the left-column remove action depend on preview-row highlight
- do not change imported-parts acceptance behavior
- do not widen into `+A` grouping or tree-line hierarchy work
- do not redesign the full staged-file card layout beyond the narrow top-right action fit

### Implementation Risks

- adding a second removal owner in the controller instead of reusing the draft-owned store path
- leaving stale `stagedImportPreviewSelection` behind after the currently loaded file is removed
- silently hiding or replacing the current file-type pill instead of preserving it
- widening whole-file removal into preview-row maintenance semantics that belong to later phases
- over-styling the staged-file card header when only a compact fit pass is needed

### Checklist

- [x] add one top-right `X` action to each staged-file card
- [x] keep the file-type pill visible while making room for the new remove action
- [x] remove the whole staged file from the current draft when the user presses `X`
- [x] keep preview selection and preview Browser truth synchronized after file removal

### Verification Shape

Minimum verification for this subphase should cover:

- each staged-file card shows one compact top-right remove action
- pressing `X` removes that file from the left-column staged list
- the removed file's preview rows disappear from the middle-column Preview Browser
- if the removed file had been loaded into object preview, the right-column preview selection is cleared or updated honestly
- the `L` button and preview-row selection semantics do not widen or change as part of this phase

### Done Shape

- the left-column `Staged files` surface now lets the user remove one whole staged file directly from its card header
- the file-type pill stays visible while sharing the top-right card area with the compact `X` action
- removing a file now updates the staged draft, the Preview Browser rows, and the right-column preview selection honestly
- `Import-4.7.6 - phase 7` remains the next follow-up for adding the highlighted set into one top assembly

## [x] `Import-4.7.6 - phase 6 - Highlighted Preview Row Remove Or Delete Actions`

### Purpose

- let the user use the shipped preview-row highlighted set for true preview-only maintenance by removing or deleting highlighted preview owners without turning source-backed file rows into accepted-import filtering

### Goal

- let the user remove or delete highlighted preview rows through one explicit staged-preview maintenance action
- keep this maintenance action preview-only and staged-dialog-local
- preserve truthful source-side file structure while still allowing authored preview organization owners to be retired cleanly

### Locked Direction

- keep this phase maintenance-focused:
  - no `+A` grouping behavior here
  - no tree-line rendering here
- keep source-backed rows honest:
  - staged-file removal stays in `Import-4.7.6 - phase 5.1`
  - this phase must not turn source-backed object or part rows into selective import filtering
- prefer one highlighted-set maintenance path:
  - use the shipped row-highlight owner from `phase 5`
  - do not invent a second hidden delete target model
- if an authored preview owner is deleted:
  - preserve its children honestly
  - dissolve the container instead of implying imported content was removed from the uploaded file

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/store/useAppStore.ts`
- update `src/app/panels/selectStagedImportPreviewRows.ts` only if the preview-row VM needs explicit deletable-row truth
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- `Import-4.7.6 - phase 5` is now shipped:
  - the Preview Browser already has one staged-dialog-local row-highlight owner
  - click, `Ctrl`-click, and `Shift`-click already define the highlighted preview-row set
- `Import-4.7.6 - phase 5.1` is now shipped:
  - whole staged-file removal already has its own left-column owner
  - that means `phase 6` should stay below that boundary and not duplicate file removal in the middle-column Preview Browser
- `src/app/panels/useBrowserPanelController.ts`
  - already owns the highlighted preview-row ids
  - is therefore the strongest seam for resolving which highlighted rows are actionable and for clearing selection after rows are removed
- `src/app/store/useAppStore.ts`
  - already owns draft-local preview organization mutation for create/move operations
  - does not yet own one explicit delete/dissolve action for highlighted preview owners
  - is therefore the truthful place for adding one preview-organization delete owner
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the Preview Browser header actions such as `+A`
  - is therefore the strongest seam for exposing one explicit highlighted-set maintenance action like a compact header `X`
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - already exposes row kind, preview-target truth, and active-preview truth
  - may need one additive `canDeleteFromPreviewOrganization` or equivalent truth if the UI should not infer removability from row kind alone
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves preview-row selection and staged-file-card removal
  - should next prove:
    - the highlighted set can drive one preview-only delete/remove action
    - deleting authored preview owners does not silently delete source-backed rows from the uploaded-file truth
    - staged-file-card removal and preview-owner removal stay distinct

### First-Pass Decisions

- prefer one Preview Browser header-level `X` action that targets the current highlighted set
- treat authored preview assemblies and authored preview components as the initial removable rows
- keep source-backed rows non-deletable in this phase:
  - no deleting staged-file wrapper rows here
  - no deleting inspection-only part rows here
  - no selective imported-parts behavior here
- when deleting an authored preview owner, dissolve it:
  - lift or preserve its children under the deleted row's parent or the root
  - do not remove truthful source-backed descendants from the staged file
- after delete/remove completes:
  - clear or recompute the highlighted preview-row set honestly
  - keep the `L` button preview-source truth separate

### Exact First Code Cut

1. Audit the shipped preview-row highlight owner and define which highlighted preview rows are truthfully removable in `phase 6`.
2. Add one draft-owned preview-organization delete action in `useAppStore.ts` for authored preview owners, preserving children by dissolving the removed container.
3. Expose one compact Preview Browser header `X` action that operates on the current highlighted set only when the selection is truthfully removable.
4. Clear or recompute preview-row highlight after removal so deleted rows do not remain selected.
5. Add focused Browser proof for highlighted-owner removal, child preservation, and the continued separation between preview-owner removal and staged-file-card removal.

### Likely Files

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectStagedImportPreviewRows.ts` only if explicit removability truth is needed

### No-Widening Rule

- do not duplicate staged-file-card removal from `phase 5.1`
- do not make source-backed object rows or part rows deletable in this phase
- do not widen into selective imported-parts behavior
- do not add `+A` grouping here
- do not add tree lines here

### Implementation Risks

- treating source-backed preview rows as removable and therefore silently creating imported-parts filtering behavior
- adding delete semantics in the panel instead of one truthful preview-organization store owner
- deleting authored preview owners by dropping their children instead of dissolving the container
- leaving deleted rows inside the highlighted preview-row set after the mutation
- letting the new maintenance action overlap confusingly with the shipped staged-file-card `X`

### Checklist

- [x] let the user remove or delete highlighted preview rows through one explicit preview-only maintenance action
- [x] keep highlighted-row maintenance staged-dialog-local
- [x] preserve truthful source-side file structure by keeping source-backed rows non-deletable in this phase

### Verification Shape

Minimum verification for this subphase should cover:

- the current highlighted preview-row set can drive one explicit Preview Browser remove/delete action
- deleting authored preview owners preserves truthful source-backed descendants by dissolving the container
- source-backed staged rows and inspection-only part rows do not become deletable in this phase
- highlighted-row state is cleared or recomputed honestly after deletion
- staged-file-card removal and `L` button preview-source truth stay separate from this maintenance path

### Done Shape

- the Preview Browser now supports one truthful highlighted-set maintenance action for authored preview owners
- preview-only delete/remove behavior stays staged-dialog-local and does not become imported-parts filtering
- row highlight now supports real preview-organization maintenance in addition to future grouping work
- `Import-4.7.6 - phase 7` remains the next follow-up for adding the highlighted set into one top assembly

## [ ] `Import-4.7.6 - phase 7 - Add Selected Preview Rows To One Top Assembly`

### Purpose

- let the user organize the current preview multi-selection into one assembly owner through the existing `+A` language while keeping that organization clearly staged and preview-local

### Goal

- let the user use `+A` to add the current preview multi-selection into one assembly
- keep that assembly pinned at the top of the preview Browser tree
- preserve staged preview organization truth without widening into imported-parts acceptance

### Locked Direction

- keep this phase organization-focused:
  - requires multi-select from `7.6.5`
  - does not widen into imported-parts selection or commit behavior
- keep the new assembly owner staged and preview-local:
  - it organizes preview rows
  - it does not change accepted import truth by itself
- keep the assembly owner at the top so the grouped result is easy to find and read

### Checklist

- [ ] let the user use `+A` to add the current preview multi-selection into one assembly
- [ ] keep that assembly pinned at the top of the preview Browser tree
- [ ] preserve staged preview organization truth without widening into imported-parts acceptance

## [ ] `Import-4.7.6 - phase 8 - Preview Browser Tree Lines And Hierarchy Readability`

### Purpose

- make the preview Browser hierarchy easier for the human eye to parse after assembly grouping exists by adding explicit tree lines and clearer parent-child visual structure

### Goal

- show tree lines for preview hierarchy
- make parent-child ownership easier to scan
- keep the top assembly and nested rows visually honest

### Locked Direction

- keep this phase hierarchy-readability-focused:
  - no new grouping semantics here
  - no imported-parts behavior here
- prefer tree lines and clear structure reads over decorative styling that does not improve ownership clarity

### Checklist

- [ ] show tree lines for preview hierarchy
- [ ] make parent-child ownership easier to scan
- [ ] keep the top assembly and nested rows visually honest

## [ ] `Import-4.7.6 - phase 9 - Final Cleanup And Regression Proof`

### Purpose

- close out the preview Browser enrichment lane with one durable proof shape and only the smallest cleanup directly retired by the shipped `7.6.x` work

### Goal

- lock the preview Browser enrichment behavior into one high-signal proof shape
- retire only the narrow residue made obsolete by the landed `7.6` changes

### Locked Direction

- keep this phase small and cleanup-biased:
  - no major new UX widening
  - no hidden follow-on feature work under a cleanup label
- prefer proof and residue retirement over extra polish ideas that deserve their own later phase

### Checklist

- [ ] lock one high-signal Browser proof for preview Browser enrichment
- [ ] remove narrow residue retired by the new preview Browser treatment
- [ ] close out the preview Browser enrichment lane

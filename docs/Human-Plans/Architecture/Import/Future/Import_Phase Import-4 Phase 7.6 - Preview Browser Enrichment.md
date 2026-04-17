# `Import-4 Phase 7.6` - `Preview Browser Enrichment`

## Doc Header

### Doc History
2. 2026-04-16: Expanded the `Import-4 / Phase 7.6` ladder with a new first subphase for showing `Parts` in the preview Browser when a truthfully multi-object file stays on `1 Object`, moving the earlier preview-target, row-action, active-state, and cleanup work down to `7.6.2` through `7.6.6` so this wishlist item now has the first explicit implementation owner
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 7.6`, splitting the later staged preview Browser enrichment lane out of the broader `Phase 7` UI polish record so row-level preview-target truth, row-level object-preview affordances, active loaded-row clarity, and later preview-row readability polish can land in smaller one-by-one cuts

### Purpose

This doc owns the later staged preview Browser enrichment lane after the initial preview Browser organization surface and object preview viewport are already shipped.

Use it to answer:
- how the staged preview Browser should become easier to inspect as well as organize before commit
- how preview Browser `Parts` visibility, row-level preview targeting, and active loaded-row truth should be broken into Codex-sized subphases
- which preview Browser changes stay draft-local and clearly separate from accepted import behavior

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

Enrich the staged preview Browser so its organization rows are easier to inspect, easier to connect to the object preview, and easier to read during draft organization, including a truthful `Parts` read when a multiple-object file stays on `1 Object`, while preserving the same draft-owned organization and accepted import behavior that already shipped.

### Locked Direction

- keep this lane preview-Browser-local and draft-local:
  - no commit-path changes
  - no accepted organization ownership changes
  - no real project-content mutation before `Add To Project`
- keep the preview Browser and the right-column object preview as distinct surfaces:
  - middle column = organization
  - right column = object inspection
- prefer small visible enrichment steps:
  - one-object wrapper rows that can still expose truthful `Parts`
  - row-level preview-target truth
  - row-level load affordances
  - active loaded-row clarity
  - row-identity and action readability polish
- keep drag-and-drop on the existing shared Browser drag language instead of inventing a second preview-only drag vocabulary
- only rows backed by truthful staged object or part provenance should behave like direct object-preview targets
- keep assembly and component rows honest if they are organization owners but not direct previewable object targets
- keep `1 Object` behavior honest even if the preview Browser becomes more informative:
  - do not imply split commit behavior
  - do not silently turn wrapper preview into split preview

### Likely Architecture Seams

- `src/app/store/useAppStore.ts`
  - strongest seam for the draft-owned preview-organization node truth when later preview Browser enrichment needs additive source metadata instead of panel-layer guesses
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - strongest seam for the compact preview-row view model and any additive `Parts` rows, `can load into preview`, or preview-target truth
- `src/app/panels/useBrowserPanelController.ts`
  - strongest seam for draft-local row-to-preview wiring and active loaded-row state that must stay synchronized with the existing right-column preview selection
- `src/app/panels/browserTreeMenus.tsx`
  - strongest seam for preview Browser row actions, helper copy, active-state styling, and local row-readability polish
- `src/app/theme/surfaces/browser.css`
  - strongest seam for preview Browser row identity, nested `Parts` readability, active-state treatment, and control readability inside the middle column
- `src/app/panels/BrowserPanel.test.tsx`
  - strongest seam for Browser proof around preview Browser rendering, row affordances, and draft-local preview synchronization

## Wishlist Tracking

These wishlist mappings should be read as the planned `Import-4 / Phase 7.6` ladder for later staged preview Browser enrichment after the earlier preview organization and object preview viewport lanes are already shipped.

### `Import-4 Phase 7.6.1`
- [ ] `1. Parts In The Preview Browser For 1 Object Multi-Object Files`
- [ ] `1A. Show Truthful Parts Even When Import Mode Stays 1 Object`
- [ ] `1B. Keep The Parts Nested Under The One Object Wrapper Row`
- [ ] `1C. Preserve 1 Object Commit Truth`

### `Import-4 Phase 7.6.2`
- [ ] `2. Preview Browser Preview-Target Contract`
- [ ] `2A. Add Row-Level Previewability Truth To Preview Browser Rows`
- [ ] `2B. Keep Draft Assemblies, Components, And Read-Only Parts Distinct From Direct Object Preview Targets`
- [ ] `2C. Preserve Existing Drag And Commit Ownership`

### `Import-4 Phase 7.6.3`
- [ ] `3. Row-Level Load Into Object Preview`
- [ ] `3A. Add Preview Browser Row Actions For Truthfully Previewable Rows`
- [ ] `3B. Keep Non-Previewable Organization Rows Honest`
- [ ] `3C. Preserve The Existing Draft-Local Preview Load Contract`

### `Import-4 Phase 7.6.4`
- [ ] `4. Active Preview Selection Truth In The Preview Browser`
- [ ] `4A. Show Which Preview Browser Row Currently Feeds The Object Preview`
- [ ] `4B. Keep Left-Column And Preview-Browser Load Paths In Sync`
- [ ] `4C. Preserve Draft-Local Selection Ownership`

### `Import-4 Phase 7.6.5`
- [ ] `5. Preview Browser Row Identity And Action Polish`
- [ ] `5A. Make Assembly, Component, Object, And Part Rows Easier To Scan`
- [ ] `5B. Clarify New Assembly And Add Component Affordances`
- [ ] `5C. Keep Dense Nested Drag Reads Legible`

### `Import-4 Phase 7.6.6`
- [ ] `6. Final Cleanup And Regression Proof`
- [ ] `6A. Lock One High-Signal Browser Proof For Preview Browser Enrichment`
- [ ] `6B. Remove Narrow Residue Retired By The New Preview Browser Treatment`
- [ ] `6C. Close Out The Preview Browser Enrichment Lane`

## [ ] `Import-4 Phase 7.6.1 - Parts In The Preview Browser For 1 Object Multi-Object Files`

### Purpose

- show truthful `Parts` in the staged preview Browser even when the user keeps a truthfully multi-object file on `1 Object`

### Goal

- let the preview Browser expose the file's truthful internal parts under the wrapper-style `1 Object` row so the user can inspect what is inside that file without being forced into `Multiple Objects In 1 Component`

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

### Expected Implementation Shape

- update `src/app/store/useAppStore.ts`
- update `src/app/panels/selectStagedImportPreviewRows.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- the shipped `Import-3 / Phase 6` preview-organization direction currently says:
  - `1 Object` files contribute one preview row
  - `Multiple Objects In 1 Component` files contribute truthful part-backed child rows grouped under one draft component-style owner
- that means the current preview Browser stays behaviorally honest, but it hides internal `Parts` whenever the user keeps the compatibility-wrapper `1 Object` path
- `src/app/store/useAppStore.ts`
  - already stores the truthful split provenance needed for staged preview organization through preview nodes backed by:
    - `stagedFileId`
    - `sourcePartKey`
    - `sourceMeshIndex`
  - is the strongest seam if the draft preview graph needs one additive source-kind distinction for wrapper-owned read-only part rows
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - currently flattens the staged preview graph into Browser rows and therefore is the strongest seam for threading these nested `Parts` rows into the middle-column row VM without teaching the panel layer to infer them ad hoc
- `src/app/panels/browserTreeMenus.tsx`
  - already renders the preview Browser tree rows, row depth, row icons, and row-local actions
  - is the strongest seam for making the new `Parts` read scan clearly as nested under a `1 Object` wrapper instead of reading like a split-import result
- `src/app/theme/surfaces/browser.css`
  - already owns preview Browser row spacing and dense nested readability
  - is the strongest seam for visually distinguishing:
    - wrapper object rows
    - read-only part rows under `1 Object`
    - authored assemblies and components used for organization
- `src/app/panels/BrowserPanel.test.tsx`
  - should prove the first part-read follow-up stays honest:
    - `1 Object` still renders one wrapper owner row
    - truthful `Parts` now appear nested under that row
    - the mode itself still remains `1 Object`

### First-Pass Decisions

- show `Parts` in the preview Browser only when the staged structure truth already supports them
- keep those rows nested under the wrapper row for `1 Object` mode
- prefer `Part` rows that read as inspection truth, not as accepted split-object promises
- keep the first pass read-only and non-organizational for those nested `Part` rows
- do not let the `1 Object` preview read collapse back into the same preview shape as `Multiple Objects In 1 Component`

### Exact First Code Cut

1. Audit the current staged preview-organization derivation for `1 Object` versus `Multiple Objects In 1 Component`.
2. Extend the staged preview graph so a truthfully multi-object file can contribute:
   - one wrapper object row when mode is `1 Object`
   - nested read-only `Part` rows under that wrapper when truthful `partRows` exist
3. Keep the existing split-mode shape unchanged so `Multiple Objects In 1 Component` still owns the true split-preview result.
4. Update the preview Browser row rendering and styling so the nested `Part` rows read as internal inspection of the wrapper object rather than a hidden split-import mode.
5. Add focused Browser proof that `1 Object` now still shows truthful `Parts` in the preview Browser while commit behavior remains on the one-object path.

### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/selectStagedImportPreviewRows.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change what `1 Object` commits
- do not auto-switch the user into `Multiple Objects In 1 Component`
- do not make these nested `Part` rows a new top-level organization owner
- do not widen into object-preview row actions yet

### Implementation Risks

- making `1 Object` mode look behaviorally identical to split mode
- implying that nested `Part` rows under the wrapper will commit as separate Browser objects when they will not
- widening the first pass into drag ownership or preview-target behavior before the nested-parts read is stable
- regressing the current split-mode preview shape while trying to add the new wrapper-owned part read

### Checklist

- [ ] show truthful `Parts` in the preview Browser when a multi-object file stays on `1 Object`
- [ ] keep those parts nested under the one-object wrapper row
- [ ] preserve `1 Object` commit truth
- [ ] add focused Browser proof for the wrapper-plus-parts read

### Verification Shape

Minimum verification for this subphase should cover:

- a truthfully multi-object staged file kept on `1 Object` still shows one wrapper row in the preview Browser
- truthful `Part` rows now appear nested under that wrapper row
- `Multiple Objects In 1 Component` still keeps its stronger split-preview shape
- no import-mode behavior, commit behavior, or accepted project-content behavior changes land as part of this preview-only pass

### Done Shape

- the preview Browser can show what is inside a multi-object file even when the user keeps the compatibility-wrapper import mode
- `1 Object` stays honest as one-object commit behavior while the preview Browser still exposes truthful internal `Parts`

## [ ] `Import-4 Phase 7.6.2 - Preview Browser Preview-Target Contract`

### Purpose

- add the smallest honest contract needed for later row-level object-preview enrichment inside the staged preview Browser

## [ ] `Import-4 Phase 7.6.3 - Row-Level Load Into Object Preview`

### Purpose

- add row-level `Load Into Object Preview` affordances inside the staged preview Browser for rows that truthfully represent previewable staged object or part targets

## [ ] `Import-4 Phase 7.6.4 - Active Preview Selection Truth In The Preview Browser`

### Purpose

- make the preview Browser clearly show which row currently feeds the right-column object preview so the middle and right columns read as one coordinated staged inspection flow

## [ ] `Import-4 Phase 7.6.5 - Preview Browser Row Identity And Action Polish`

### Purpose

- polish preview Browser row identity, action readability, and dense nested row scanability after the row-level preview affordances already exist

## [ ] `Import-4 Phase 7.6.6 - Final Cleanup And Regression Proof`

### Purpose

- close out the preview Browser enrichment lane with one durable proof shape and only the smallest cleanup directly retired by the shipped `7.6.x` work

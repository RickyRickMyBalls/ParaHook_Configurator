# `Import-4 Phase 7` - `UI Cleanup And Polish`

## Doc Header

### Doc History
21. 2026-04-16: Added `Import-4 / Phase 7.7 - Part List And Scale Enrichment` as a new standalone later planning lane, extending this parent `Phase 7` record so the next user-provided staged import polish pair now has an explicit home for part-list enrichment and scale enrichment without widening that new lane beyond those two wishlist items
20. 2026-04-16: Added `Import-4 / Phase 7.6 - Preview Browser Enrichment` as a new standalone later planning lane, extending this parent `Phase 7` record so later staged preview-browser follow-up now has an explicit home for row-level preview-target truth, preview-browser-to-object-preview affordances, active loaded-row clarity, and later row-identity polish
19. 2026-04-16: Added `Import-4 / Phase 7.5 - Object Preview Follow-Up And Preview-Output Polish` as a new standalone later planning lane, extending this parent `Phase 7` record so later staged object-preview polish now has an explicit home for zoom-to-fit, preview resize repair, up-axis preview truth, preview grid toggles, and later scale-fix work
18. 2026-04-16: Split `Import-4 / Phase 7.4 - Read-Only Hierarchy Tree Enrichment` into its own standalone future execution doc, reducing this parent `Phase 7` record to the umbrella wishlist pointer for that later hierarchy-tree truth lane while the detailed subphase ladder now lives in its own dedicated planning home
17. 2026-04-16: Tightened the shipped `Import-4 / Phase 7.3 - Staged Settings Paraselect Conversion` follow-up again by replacing the earlier faux grouped-button treatment with the app's real shared `ParaSelect` control, so `Import As`, `Up Axis`, and `Scale / Units` now truly use left-cap, dropdown-track, and right-cap paraselect behavior inside staged file cards
16. 2026-04-16: Implemented `Import-4 / Phase 7.3 - Staged Settings Paraselect Conversion` by turning the staged file card controls for `Import As`, `Up Axis`, and `Scale / Units` into one consistent compact paraselect treatment while preserving the same staged options, selected-state truth, and draft-only behavior
15. 2026-04-16: Prepped `Import-4 / Phase 7.3 - Staged Settings Paraselect Conversion` for implementation by grounding the next settings-polish pass in the live staged-card settings markup in `browserTreeMenus.tsx`, the current button-row styling in `browser.css`, and the BrowserPanel proof seam so the paraselect conversion can stay presentation-only and preserve the existing staged settings contract
14. 2026-04-16: Added `Import-4 / Phase 7.4 - Read-Only Hierarchy Tree Enrichment`, making the next later UI-truth owner a compact staged structure tree for hierarchy-bearing files so the dialog can explain internal file structure more honestly than the current over-broad `Multiple objects` badge
13. 2026-04-16: Added `Import-4 / Phase 7.3 - Staged Settings Paraselect Conversion`, making the next explicit UI-polish owner the conversion of `Import As`, `Up Axis`, and `Scale / Units` from the current grouped button rows into paraselect-style controls inside the staged file card
12. 2026-04-16: Tightened the shipped `Import-4 / Phase 7.1 - Parts Summary List Cleanup` follow-up again by removing the checkbox marker from the staged parts list, darkening the list box itself, and shifting the presentation to a highlight-row read so future on/off state can be conveyed through row emphasis instead of a separate checkbox icon
11. 2026-04-16: Implemented `Import-4 / Phase 7.2 - Staged File Card Re-Organization` by restructuring staged file cards into one shared header row for file number, title, and type badge plus one full-width body section underneath, so dense staged cards no longer read like three competing columns and the `7.1` parts list can use the full body width
10. 2026-04-16: Prepped `Import-4 / Phase 7.2 - Staged File Card Re-Organization` for implementation by grounding the next UI pass in the live staged-card row composition in `browserTreeMenus.tsx`, the current staged-card layout rules in `browser.css`, and the existing BrowserPanel staged-import proof seam so the title-row plus full-width-body reflow can land as one narrow presentation-only change
9. 2026-04-16: Revised `Import-4 / Phase 7.2` so it now explicitly owns the staged file card re-organization pass: one title row containing staged file number, file title, and file type on a single line, followed by one full-width content section underneath so the card no longer reads like the number, content, and type are trapped in three competing columns
8. 2026-04-16: Tightened the shipped `Import-4 / Phase 7.1 - Parts Summary List Cleanup` follow-up again so the new staged part selection list now opens at `100px` tall, keeps local scroll on overflow, and can be resized from the bottom edge during review instead of staying locked to one fixed cap
7. 2026-04-16: Tightened the shipped `Import-4 / Phase 7.1 - Parts Summary List Cleanup` follow-up so the new staged part selection list now caps at `100px` tall and uses a local vertical scrollbar on overflow, keeping dense split-file cards readable without letting the part list dominate the rest of the staged file card
6. 2026-04-16: Implemented `Import-4 / Phase 7.1 - Parts Summary List Cleanup` by replacing the staged split-part chip pile with a compact selection-list treatment that keeps truthful part order, reads like future selectable part rows, and stays presentation-only without changing staged import, preview, or commit behavior
5. 2026-04-16: Revised `Import-4 / Phase 7.1 - Parts Summary List Cleanup` so the first polish cut now explicitly targets a selection-list presentation for staged part rows, making the UI read like future selectable parts while keeping real include or exclude import behavior deferred to a later dedicated phase
4. 2026-04-16: Prepped `Import-4 / Phase 7.1 - Parts Summary List Cleanup` for implementation by grounding the first UI-polish pass in the live staged structure-summary row inside `browserTreeMenus.tsx`, the existing staged card styling in `browser.css`, and the current BrowserPanel staged import proof seam so the list cleanup can land as one narrow presentation-only change
3. 2026-04-16: Reworked this `Import-4 / Phase 7` record to match the Catalog-style wishlist format by replacing the looser UI backlog read with a dedicated `## Wishlist Tracking` section where each planned `7.1` through `7.5` subphase now owns an explicit checklist of the staged import polish items it is expected to achieve
2. 2026-04-16: Expanded this standalone `Import-4 / Phase 7` record from a single first-task stub into a real UI-polish backlog by adding one staged-import wishlist section and sorting the known cleanup ideas into smaller `7.1` through `7.5` subphases so later visual cleanup can land in cleaner one-by-one cuts
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 7`, splitting the next staged-import UI cleanup lane out of the parent staged-session feedback record so later polish tasks can land one by one without bloating the broader `Import-4` umbrella doc

### Purpose

This doc owns the later staged import UI cleanup and polish lane.

Use it to answer:
- what smaller staged import presentation cleanups should land after the heavier session, preview, and recovery work
- how later Import-4 polish tasks should be broken into small enough cuts for one-by-one implementation
- what visual cleanup should stay in scope without widening into new import behavior

### Relationship To Parent Doc

Parent lane:
- `Import_Phase Import-4 - Staged Import Session Feedback And Partial-Failure Reporting.md`

This doc exists because:
- the main staged import session and preview lanes are already large enough on their own
- later UI cleanup work should stay focused and incremental
- the first known polish task is small and presentation-only, with more user-fed cleanup tasks expected afterward

Keep the parent `Import-4` doc as the umbrella lane.

Use this doc for:
- the detailed planning and phased execution of later staged import UI cleanup tasks

## Doc Body

### Goal

Polish the staged import dialog after the heavier correctness, recovery, and preview work is already in place, starting with smaller visual cleanup tasks that improve readability without changing import behavior.

### Locked Direction

- keep this lane UI-only:
  - no new import behavior
  - no new staged settings ownership
  - no commit-path changes
  - no viewer-runtime redesign
- prefer small, user-visible cleanup tasks that can be implemented one at a time
- keep wording and presentation truthful to the current staged import contract
- let later user feedback define additional polish tasks after the first one ships

### Likely Architecture Seams

- `src/app/panels/browserTreeMenus.tsx`
  - current staged file card composition
  - strongest seam for row-level copy, chip, list, and structure-summary presentation cleanup
- `src/app/theme/surfaces/browser.css`
  - strongest seam for visual cleanup of staged file cards, badges, list treatment, spacing, and readability
- `src/app/panels/BrowserPanel.test.tsx`
  - strongest seam for focused Browser proof around staged import UI presentation changes

## Wishlist Tracking

These wishlist mappings should be read as the planned `Import-4 / Phase 7` UI-polish ladder after the heavier staged-session, preview, and recovery work is already shipped.

Use the `Phase 7` subphases to organize the staged import polish items like this:

### `Import-4 Phase 7.1`
- [x] `1. Parts Summary Selection-List Treatment`
- [x] `1A. Preserve Truthful Part Ordering`
- [x] `1B. Retire The Current Part-Label Chip Pile`
- [x] `1C. Read Like Future Selectable Part Rows Without Changing Import Behavior Yet`

### `Import-4 Phase 7.2`
- [ ] `2. Staged File Card Title Row Re-Organization`
- [ ] `2A. Keep File Number, Title, And Type In One Shared Header Row`
- [ ] `2B. Move Card Content To One Full-Width Section Under The Header`
- [ ] `2C. Retire The Current Three-Column-Like Read Inside Dense Staged Cards`

### `Import-4 Phase 7.3`
- [x] `3. Import As Paraselect`
- [x] `3A. Up Axis Paraselect`
- [x] `3B. Scale Or Units Paraselect`
- [x] `3C. Retire The Current Button-Row Read For These Three Controls`

### `Import-4 Phase 7.4`
- [ ] `4. Read-Only Hierarchy Tree For Structured Files`
- [ ] `4A. Distinguish Structured Single-Object Files From Truly Split-Ready Files`
- [ ] `4B. Surface Meaningful Hierarchy Labels Instead Of Only Broad Structure Badges`
- [ ] `4C. Keep The Hierarchy Tree Read-Only And Non-Committing`
- [ ] `4D. Avoid Dumping Generic Loader Noise Into The Tree`

### `Import-4 Phase 7.5`
- [ ] `5. Object Preview Follow-Up And Preview-Output Polish`
- [ ] `5A. Add Object Preview Zoom-To-Fit`
- [ ] `5B. Repair The Object Preview Resize-Adjust Bug`
- [ ] `5C. Reflect Up-Axis Choice In The Output Preview`
- [ ] `5D. Add A 300x300 Grid On Or Off Option For The Output Preview`
- [ ] `5E. Reserve A Later Scale Fix-Up Owner`

### `Import-4 Phase 7.6`
- [ ] `6. Preview Browser Enrichment`
- [ ] `6A. Show Parts In The Preview Browser When A Multiple-Object File Stays On 1 Object`
- [ ] `6B. Add Preview Browser Row-Level Object Preview Truth`
- [ ] `6C. Make The Active Object Preview Row Clear Inside The Preview Browser`
- [ ] `6D. Improve Preview Browser Row Identity And Action Readability`
- [ ] `6E. Keep Preview Browser Organization Draft-Local`

### `Import-4 Phase 7.7`
- [ ] `7. Part List And Scale Enrichment`
- [ ] `7A. Two-Column Part List Enrichment`
- [ ] `7B. Scale Enrichment`

## [x] `Import-4 Phase 7.1 - Parts Summary List Cleanup`

### Purpose

- improve the readability of the staged file structure summary when a reviewed file truthfully exposes `Multiple Objects` plus `Parts`

### Goal

- render the part labels under the `Multiple Objects` / `Parts` summary as a readable selection list instead of the current chip pile

### Locked Direction

- keep this first task presentation-only:
  - no structure-inspection contract changes
  - no import-mode changes
  - no preview-browser changes
  - no add-to-project behavior changes
- let the rows visually read like future selectable parts:
  - one row per part
  - selection-list treatment
  - checkbox or selection marker styling is allowed
  - real part include or exclude behavior stays deferred
- preserve the same truthful labels and ordering already provided by the staged structure summary
- only change how those part labels are presented inside the staged file card

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already owns the full staged file card markup
  - is the strongest seam for splitting the card into:
    - one explicit header row
    - one explicit full-width body region
  - should be able to reorganize the number, title, and type badge without changing staged state or behavior
- `src/app/theme/surfaces/browser.css`
  - already owns the staged card flex layout, spacing, and positioning for:
    - the staged file number
    - the main content block
    - the type badge
  - is the strongest seam for retiring the current implied three-column read and replacing it with a cleaner title-row plus body structure
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged import dialog and the shipped `7.1` parts-selection-list treatment
  - should be tightened here so the next pass proves:
    - the header row contains file number, title, and type together
    - the body content sits below and uses the full card width
    - the `7.1` list still lives inside that full-width body

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already owns the staged file structure-summary markup under each staged card
  - is the strongest seam for changing the part-label presentation from a chip cluster into a selection-list treatment without touching the structure-inspection contract
- `src/app/theme/surfaces/browser.css`
  - already owns staged card spacing, badge treatment, and label presentation
  - is the strongest seam for a readable selection-list style that stays compact inside dense staged cards
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged import dialog, split-file structure summary, and later preview lanes
  - should be tightened here so the first polish pass proves the parts render through a real selection-list structure instead of the current pile treatment

### First-Pass Design Read

- the current UI already tells the truth:
  - the file has `Multiple Objects`
  - the file has `Parts`
  - the current order of the labels already comes from the staged structure summary
- the problem is only scanability:
  - dense split files turn into a hard-to-read chip block
  - the labels stop reading like individual parts and start reading like visual noise
- the first honest fix is to keep the exact same labels and order, but render them through one compact selection-list treatment that scans vertically and already feels compatible with later part selection work

### First Pass Decisions

- keep the summary compact, but let the part labels read as one explicit selection list instead of chip soup
- keep the `Multiple Objects` and `Parts` badges as-is unless a tiny follow-on cleanup becomes obviously necessary during implementation
- preserve the currently truthful part ordering coming from the staged inspection summary
- allow inert checkbox or selection-marker visuals if they help establish the future selection-list shape
- do not let the list visuals imply that import inclusion behavior already works if that behavior is not implemented yet

### Exact First Code Cut

1. Audit the staged structure-summary markup in `src/app/panels/browserTreeMenus.tsx`.
2. Replace the current part-label chip cluster under `Multiple Objects` / `Parts` with a readable selection-list treatment.
3. If helpful, add inert selection markers so each part already reads like a future selectable row while staying presentation-only.
4. Update `src/app/theme/surfaces/browser.css` so the new selection list reads clearly inside the staged file card without widening the card awkwardly.
5. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the parts now render through the new selection-list structure.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change the staged structure-inspection summary contract
- do not change the meaning of `Multiple Objects` or `Parts`
- do not make the list actually control import inclusion in this phase
- do not widen into later polish tasks yet

### Implementation Risks

- accidentally changing the staged structure-summary data instead of only its presentation
- making the new part list much taller than the current card in a way that hurts dense-file review
- letting the first list pass unintentionally restyle the `Multiple Objects` or `Parts` badges instead of keeping the change narrow
- adding a second overlapping summary treatment instead of cleanly replacing the current chip pile
- making the selection-list visuals falsely imply that deselected parts already stay out of commit when that behavior is not implemented yet

### Checklist

- [x] render staged split-part labels as a readable selection list instead of the current chip pile
- [x] preserve truthful labels and ordering
- [x] keep the selection-list visuals presentation-only for now
- [x] keep import behavior unchanged
- [x] add focused Browser proof for the new selection-list treatment

### Verification Shape

Minimum verification for this phase should cover:

- a staged split-ready file still shows `Multiple Objects` and `Parts`
- the same truthful part labels still render in the same order
- the part labels now render through an explicit selection-list structure instead of the prior pile treatment
- the selection-list treatment does not change staged import mode, preview, or commit behavior
- no staged import behavior, preview behavior, or commit behavior changes land as part of the cleanup

### Done Shape

- staged files with `Multiple Objects` and `Parts` read more clearly inside the import dialog through a future-facing selection-list treatment
- the first `Import-4 / Phase 7` cleanup task ships without widening into broader UI redesign

### Implementation Notes

- `src/app/panels/browserTreeMenus.tsx`
  - now renders staged split-part labels through a compact selection list driven by `summary.partRows`, preserving the existing truthful part order and keeping the treatment presentation-only
- `src/app/theme/surfaces/browser.css`
  - now styles the part rows as highlight-state selection-list items instead of checkbox-like rows, darkens the list box itself, opens the list at `100px` tall, gives it a local scrollbar on overflow, and allows bottom-edge vertical resizing during review
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves a split-ready staged file still shows `Multiple Objects` and `Parts`, renders the same part labels in the same order, uses the selection-list structure instead of the old structure-label chip group, and no longer renders the old checkbox marker

## [x] `Import-4 Phase 7.2 - Staged File Card Re-Organization`

### Purpose

- reorganize the staged file card so its header reads cleanly on one row and the rest of the card content can use the full available width underneath

### Goal

- make the staged file card use:
  - one title section row for:
    - staged file number
    - staged file title
    - file type
  - one full-width content section underneath for:
    - structure summary
    - parts selection list
    - import settings
    - preview action

### Locked Direction

- keep this pass layout-and-presentation only:
  - no structure-summary contract changes
  - no preview behavior changes
  - no commit behavior changes
- make the card header read as one intentional row instead of three implied columns
- keep the staged file number visible, but stop letting it push the whole content block inward as a left-side column
- keep the file type visible, but stop letting it read like a separate top-right column that narrows the list and settings area below
- let the content under the title row take the full card width

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`

### First-Pass Read

- the current staged card effectively reads like:
  - left column = staged file number
  - middle column = all main content
  - right column = file type badge
- that layout causes two readability problems:
  - the staged file number visually bumps the main content inward
  - the type badge makes the card content beneath feel narrower than it needs to be
- the first honest fix is to promote the number, title, and type into one shared title row, then let everything else below use the full width of the card body

### First Pass Decisions

- the header should be one explicit staged-card title row
- the content under that row should be one full-width body region
- the parts selection list from `7.1` should stay inside the full-width body region
- the reorganization should preserve existing staged card information and actions while only changing their layout
- the file number should become part of the title row instead of acting like a left-side content column
- the file type badge should stay visually aligned to that same title row instead of floating as a separate top-right column that narrows the content below

### Exact First Code Cut

1. Audit the staged file card markup in `src/app/panels/browserTreeMenus.tsx`.
2. Add one explicit staged-card title row that holds:
   - staged file number
   - file title
   - file type badge
3. Move the current structure summary and settings content into one full-width card body under that title row.
4. Update `src/app/theme/surfaces/browser.css` so the card no longer reads like three competing columns and the body uses the full available width.
5. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the new title-row plus full-width-body structure.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change staged file ordering
- do not change staged file settings or actions
- do not change the new `7.1` parts selection-list behavior
- do not widen into later card-density or spacing cleanup yet

### Implementation Risks

- changing the header structure in a way that breaks current card spacing or truncation on narrow widths
- accidentally making the file title row wrap awkwardly once the number and type badge share the same line
- reorganizing the card body in a way that regresses the new `7.1` selection-list width or overflow behavior
- letting this layout pass drift into broader density cleanup that belongs to later `7.3` or `7.4`

### Checklist

- [x] add one explicit title row for staged file number, title, and type
- [x] move the remaining card content into one full-width section under that row
- [x] keep all staged card behavior unchanged
- [x] add focused Browser proof for the reorganized card structure

### Verification Shape

Minimum verification for this phase should cover:

- a staged file card now renders:
  - one title row containing file number, file title, and file type
  - one full-width content body underneath
- the staged file number no longer pushes the main body inward like a left-side column
- the file type badge no longer narrows the content body from a separate top-right column position
- the `7.1` parts selection list still renders and still gets the body’s full width
- no staged settings, preview actions, or commit behavior change as part of the reorganization

### Done Shape

- staged file cards no longer read like the number, content, and type are trapped in three competing columns
- the title row reads cleanly at the top of the card
- the body content under the title row uses the full available width

### Implementation Notes

- `src/app/panels/browserTreeMenus.tsx`
  - now renders each staged file card through:
    - one explicit header row with the staged file number, file title, and file type badge
    - one full-width body region underneath for structure summary, parts list, settings, and follow-up status content
- `src/app/theme/surfaces/browser.css`
  - now styles the staged file card as a column layout with a true header row and a full-width body section, removing the old implied left-content-right column read
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves the reorganized staged card structure by asserting the title row contains the file number, title, and type together and the `7.1` parts selection list still lives in the full-width body below

## [x] `Import-4 Phase 7.3 - Staged Settings Paraselect Conversion`

### Purpose

- turn the staged file card settings for `Import As`, `Up Axis`, and `Scale / Units` into paraselect-style controls so those settings read as one tighter selection system instead of three separate button-row groups

### Goal

- convert these three staged settings groups:
  - `Import As`
  - `Up Axis`
  - `Scale / Units`
- from their current multi-button rows into paraselect-style controls inside the reorganized staged file card

### Locked Direction

- keep this pass UI-only:
  - no settings meaning changes
  - no staged state ownership changes
  - no commit-path changes
- preserve the exact same options and selection truth already supported today
- only change how the user reads and chooses those options in the staged file card
- keep the new paraselect treatment visually compatible with the staged card layout from `7.2`

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`

### First-Pass Read

- the current settings all work, but they read as three repeated button-row groups
- after `7.2`, the staged card body is cleaner, so the next honest polish pass is to make those settings feel more intentional and less noisy
- a paraselect treatment should preserve the existing option truth while reducing visual clutter

### First Pass Decisions

- keep the option sets exactly the same:
  - `Import As`
  - `Up Axis`
  - `Scale / Units`
- keep the current staged state wiring and setter behavior
- only change the visual control treatment
- keep the result dense enough for large staged cards without hurting readability
- let each setting read as one explicit label-plus-value paraselect surface instead of a loose cluster of sibling buttons
- keep unavailable options truthful:
  - `Multiple Objects In 1 Component` should still only appear when the file truthfully supports it
- keep the object preview action outside this conversion unless the paraselect treatment obviously requires one tiny neighboring spacing adjustment

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - currently renders all three settings through repeated `BrowserImportDialogImportModeGroup` blocks
  - already owns the option arrays, label text, selected-state read, and staged setter wiring
  - is the strongest seam for changing these controls from repeated button rows into one tighter paraselect presentation without changing state ownership
- `src/app/theme/surfaces/browser.css`
  - currently styles the settings through:
    - `.BrowserImportDialogImportModeGroup`
    - `.BrowserImportDialogImportModeOptions`
    - `.BrowserImportDialogImportModeButton`
  - is the strongest seam for retiring the current repeated button-row look and replacing it with a cleaner staged-card-local paraselect treatment
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves staged settings behavior by reading `.BrowserImportDialogImportModeButton.isSelected`
  - should be tightened here so the next pass proves:
    - the three groups render through the new paraselect structure
    - the same options remain available
    - the same selected state still changes when the user chooses a different value

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change what values are available
- do not change how those values are stored
- do not widen into part selection behavior or preview behavior
- do not widen into later spacing or copy cleanup beyond what the paraselect treatment requires

### Checklist

- [x] convert `Import As` to a paraselect-style control
- [x] convert `Up Axis` to a paraselect-style control
- [x] convert `Scale / Units` to a paraselect-style control
- [x] keep all staged settings behavior unchanged
- [x] add focused Browser proof for the new control treatment

### Exact First Code Cut

1. Audit the three staged settings groups in `src/app/panels/browserTreeMenus.tsx`.
2. Replace the current repeated button-row structure for:
   - `Import As`
   - `Up Axis`
   - `Scale / Units`
   with one consistent paraselect presentation pattern.
3. Preserve the current option lists, selected-state truth, and staged setter calls.
4. Update `src/app/theme/surfaces/browser.css` so the new controls read as compact label-plus-selection surfaces instead of repeated button clusters.
5. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the new paraselect treatment while preserving the existing staged behavior.

### Verification Shape

Minimum verification for this phase should cover:

- the staged file card still exposes:
  - `Import As`
  - `Up Axis`
  - `Scale / Units`
- those three settings now render through one consistent paraselect treatment instead of the old repeated button-row read
- the same truthful option sets still appear
- `Multiple Objects In 1 Component` still only appears when the staged file truthfully supports it
- changing each setting still updates the same staged state and leaves preview or commit behavior unchanged

### Done Shape

- the three main staged settings groups read as one cleaner paraselect-based system
- the staged file card stays truthful and behaviorally unchanged
- the current button-row repetition is retired for those controls

### Implementation Notes

- `src/app/panels/browserTreeMenus.tsx`
  - now renders `Import As`, `Up Axis`, and `Scale / Units` through the app's shared `ParaSelect` control with left and right caps plus a dropdown track, preserving the existing staged setter wiring and option truth
- `src/app/theme/surfaces/browser.css`
  - now keeps the staged file card ready for the shared `ParaSelect` control while preserving the neighboring staged action-button styling for controls that remain outside the paraselect conversion
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves the three settings groups render through the real shared `ParaSelect` surface, expose the correct selected values, and still update staged state through both arrow-cycle and dropdown-style interaction without changing import behavior

## [ ] `Import-4 Phase 7.4 - Read-Only Hierarchy Tree Enrichment`

### Purpose

- give hierarchy-bearing staged files a more honest and more informative structure read than the current broad `Multiple objects` badge when the file may still behave like one meaningful object

### Goal

- add a compact read-only structure tree for staged files whose inspection truthfully shows hierarchy
- help the user understand:
  - that the file is structured
  - what meaningful named hierarchy was found
  - whether the file is merely structured or actually split-ready

### Locked Direction

- keep this pass UI-only:
  - no new split-import behavior
  - no new part-selection behavior
  - no commit-path changes
  - no preview-browser ownership changes
- keep the tree read-only and non-committing
- keep split-ready part lists and structure trees as distinct concepts

Execution doc:
- `Import_Phase Import-4 Phase 7.4 - Read-Only Hierarchy Tree Enrichment.md`

## [ ] `Import-4 Phase 7.5 - Object Preview Follow-Up And Preview-Output Polish`

### Purpose

- polish the staged object preview viewport after the heavier three-column preview lane already shipped, keeping the output preview easier to inspect and more truthful without changing accepted import behavior

Execution doc:
- `Import_Phase Import-4 Phase 7.5 - Object Preview Follow-Up And Preview-Output Polish.md`

## [ ] `Import-4 Phase 7.6 - Preview Browser Enrichment`

### Purpose

- enrich the staged preview Browser so its organization rows are easier to inspect and connect more clearly to the object preview, while keeping the preview organization draft-local and behaviorally separate from accepted project content

Execution doc:
- `Import_Phase Import-4 Phase 7.6 - Preview Browser Enrichment.md`

## [ ] `Import-4 Phase 7.7 - Part List And Scale Enrichment`

### Purpose

- hold the next user-provided staged import polish pair as one explicit later lane, keeping `Part list enrichment` and `Scale enrichment` together without widening that new planning home beyond those two wishlist items

Execution doc:
- `Import_Phase Import-4 Phase 7.7 - Part List And Scale Enrichment.md`

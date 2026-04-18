# `Import-4 Phase 7.7` - `Part List And Scale Enrichment`

## Doc Header

### Doc History
5. 2026-04-17: Prepped `Import-4.7.7 - phase 1 - Two-Column Imported-Parts Lists And Default All-Included Truth` for implementation by grounding the next cut in the live staged file-card parts read, the current controller wiring for staged settings, the missing draft-owned imported-parts membership seam, and the already-shipped per-part preview/commit provenance so the first pass can add explicit two-column imported-parts truth without widening into curation, commit filtering, or automatic `Import As` changes yet
4. 2026-04-17: Normalized the `Import-4 / Phase 7.7` internal phase naming so the `Wishlist Organization` headings and detailed phase sections now use the same `Import-4.7.7 - phase N` pattern already used by sibling import docs, pulling each detailed phase title directly from the matching wishlist phase name and removing the extra `Phases Breakdown` wrapper
3. 2026-04-17: Reframed `Import-4 / Phase 7.7` as the real home for the staged imported-parts-list vision after `Import-4 / Phase 7.6` was restored to preview-Browser-only ownership, rewriting this lane around a two-list imported-parts flow, explicit imported-set truth, selective import-mode honesty, later transfer-mode follow-ups, and the separate `Scale enrichment` pass
2. 2026-04-16: Refined this doc around the first concrete `Part list enrichment` vision, reshaping `7.7.1` into a two-column staged part-selector plan with left and right transfer controls, a `display all objects` visibility toggle, and explicit active-row truth so the wishlist is small enough to implement slice by slice without mixing it into `Scale enrichment`
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 7.7`, splitting the next user-provided staged import polish pair out of the broader `Phase 7` record so `Part list enrichment` and `Scale enrichment` can each land as their own Codex-sized follow-up without widening this lane beyond those two wishlist items

### Purpose

This doc owns the later staged import `Part list enrichment` and `Scale enrichment` lane.

Use it to answer:
- how the next two user-provided staged import polish items should be broken into one-by-one implementation steps
- where later part-list and scale enrichment work should live without being mixed back into older `7.1` through `7.6` lanes
- how those two wishlist items can stay narrow, truthful, and implementable one step at a time

### Relationship To Parent Doc

Parent lane:
- `Import_Phase Import-4 Phase 7 - UI Cleanup And Polish.md`

This doc exists because:
- `Phase 7` already has several earlier standalone later-polish owners
- the next wishlist pair should have one explicit planning home instead of being mixed loosely into the umbrella record
- the user explicitly asked that this plan doc be based only on the wishlist items provided here

Keep the parent `Import-4 / Phase 7` doc as the umbrella later UI-polish lane.

Use this doc for:
- the detailed planning and phased execution of `Part list enrichment`
- the detailed planning and phased execution of `Scale enrichment`

## Doc Body

### Goal

Turn this lane into the staged imported-parts-list and scale-enrichment home:
- one explicit source-side parts list
- one explicit imported-parts list that says what the user wants to add
- one later `Scale enrichment` follow-up that stays truthful to the current scale contract

### Locked Direction

- keep this lane focused on imported-parts-list behavior and scale enrichment:
  - imported-parts selection UI
  - imported-set truth
  - selective import-mode honesty
  - later scale read enrichment
- keep the imported-parts flow scoped to the staged file card and staged import contract:
  - no preview-Browser redesign here
  - no right-column object-preview ownership here
- preserve the current staged import truth:
  - part labels and ordering should stay honest
  - the staged imported-parts set should stay explicit and understandable
  - scale meaning should stay honest to the existing staged `Scale / Units` contract
- keep the default imported result simple:
  - all truthful parts start included
  - full-file acceptance can therefore remain on the current compatibility path until the user curates the imported set down to a subset
- if the user curates the imported-parts list down to a subset:
  - the commit result must only include that imported subset
  - the import mode must stop pretending the result is still plain `1 Object`

### Likely Architecture Seams

- `src/app/panels/browserTreeMenus.tsx`
  - strongest seam for the current staged part-list treatment, imported-parts controls, transfer-mode UI, and the current `Scale / Units` surface
- `src/app/theme/surfaces/browser.css`
  - strongest seam for two-column list layout, row active-state styling, transfer controls, deactivated-row treatment, and scale-related readability
- `src/app/panels/BrowserPanel.test.tsx`
  - strongest seam for focused Browser proof around imported-parts curation, staged commit truth, transfer-mode behavior, and scale enrichment
- `src/app/store/useAppStore.ts`
  - likely seam for the current staged selected-parts truth, imported-parts commit truth, selective import-mode truth, and only for `Scale enrichment` if one additive truthful display seam is needed instead of panel-only copy guesses

## Wishlist Organization

These wishlist mappings should be read as the planned `Import-4 / Phase 7.7` ladder for the staged imported-parts-list and `Scale enrichment` lane.

### High Level Goals

- [ ] `HLG 1. Make The Staged File Card Show One Explicit Source Parts List And One Explicit Imported-Parts List`
- [ ] `HLG 2. Let The User Curate Which Truthful Parts Actually Get Imported`
- [ ] `HLG 3. Keep Commit Behavior And Import As Honest When The Imported Set Becomes A Subset`
- [ ] `HLG 4. Enrich The Staged Scale Read Without Changing The Existing Scale Contract`

### Import-4.7.7 - phase 1
- [ ] `1. Two-Column Imported-Parts Lists And Default All-Included Truth`
- [ ] `1A. Turn The Staged File-Card Part Area Into Two Lists In Two Columns`
- [ ] `1B. Show All Parts In The File In The Left Column`
- [ ] `1C. Show The Imported Parts In The Right Column`
- [ ] `1D. Keep All Truthful Parts Included In The Right Column By Default`
- [ ] `1E. Preserve Truthful Labels And Stable File Order`
- [ ] `HLG 1. Make The Staged File Card Show One Explicit Source Parts List And One Explicit Imported-Parts List`
- [ ] `HLG 2. Let The User Curate Which Truthful Parts Actually Get Imported`

### Import-4.7.7 - phase 2
- [ ] `2. Arrow-Button Imported-Parts Curation`
- [ ] `2A. Add Small Move-Left And Move-Right Arrow Buttons Between The Lists`
- [ ] `2B. Let The User Remove Parts From The Imported List`
- [ ] `2C. Let The User Restore Parts To The Imported List Without Reuploading`
- [ ] `2D. Keep Curation Explicit And Staged-Dialog-Local`
- [ ] `HLG 2. Let The User Curate Which Truthful Parts Actually Get Imported`

### Import-4.7.7 - phase 3
- [ ] `3. Imported-Parts Commit Truth`
- [ ] `3A. Make Add To Project Commit Only The Parts Still Present In The Imported List`
- [ ] `3B. Keep Full-File Acceptance Behavior Unchanged When Nothing Has Been Curated`
- [ ] `3C. Prevent Hidden Whole-File Import Behavior After The User Has Curated The Imported Set`
- [ ] `HLG 2. Let The User Curate Which Truthful Parts Actually Get Imported`
- [ ] `HLG 3. Keep Commit Behavior And Import As Honest When The Imported Set Becomes A Subset`

### Import-4.7.7 - phase 4
- [ ] `4. Automatic Import As Mode Shift For Selective Parts`
- [ ] `4A. Keep The Full-File Default On 1 Object`
- [ ] `4B. Automatically Leave 1 Object When The Imported List No Longer Matches The Full Truthful Part Set`
- [ ] `4C. Introduce One Explicit Selective Import Mode Instead Of Hidden Wrapper Mismatch`
- [ ] `HLG 3. Keep Commit Behavior And Import As Honest When The Imported Set Becomes A Subset`

### Import-4.7.7 - phase 5
- [ ] `5. Transfer List And Inventory Transfer List Modes`
- [ ] `5A. Add A Mode Toggle That Flips Between Transfer List And Inventory Transfer List`
- [ ] `5B. In Transfer List Mode Remove Imported Rows From The Left Column`
- [ ] `5C. In Inventory Transfer List Mode Keep All Parts Visible On The Left`
- [ ] `5D. In Inventory Transfer List Mode Deactivate Left Rows Already Present On The Right`
- [ ] `5E. Preserve Useful Left-Column Selection Behavior Across Both Modes`
- [ ] `HLG 1. Make The Staged File Card Show One Explicit Source Parts List And One Explicit Imported-Parts List`
- [ ] `HLG 2. Let The User Curate Which Truthful Parts Actually Get Imported`

### Import-4.7.7 - phase 6
- [ ] `6. Drag-And-Drop Follow-Up For Imported Parts Lists`
- [ ] `6A. Allow Dragging Parts From The Left List Into The Right List After The Button Flow Is Stable`
- [ ] `6B. Keep Drag Semantics Consistent With The Imported-List Truth Already Shipped`
- [ ] `6C. Preserve Stable File Order Unless A Later Phase Explicitly Widens Reordering`
- [ ] `HLG 2. Let The User Curate Which Truthful Parts Actually Get Imported`

### Import-4.7.7 - phase 7
- [ ] `7. Scale Enrichment`
- [ ] `7A. Enrich The Staged Scale Read`
- [ ] `7B. Preserve The Current Scale Contract And Selected-State Truth`
- [ ] `7C. Keep Import Behavior Unchanged`
- [ ] `HLG 4. Enrich The Staged Scale Read Without Changing The Existing Scale Contract`

## [ ] `Import-4.7.7 - phase 1 - Two-Column Imported-Parts Lists And Default All-Included Truth`

### Purpose

- replace the staged file-card `Parts` read with a clearer two-column selector that separates `all parts in the file` from `parts that will be imported`, while keeping staged imported-parts truth understandable and implementable in narrow follow-ups

### Goal

- turn the staged file-card part area into a two-column imported-parts read:
  - left column: all parts in the file
  - right column: imported parts
- keep the default imported result simple:
  - all truthful parts start included on the right
  - the right column becomes the explicit imported-result read even before later curation actions land

### Locked Direction

- keep this subphase focused on the two-column imported-parts scaffold only
- preserve truthful part labels and stable file-ordering where possible
- make the right column the authoritative imported-parts read
- keep all truthful parts included on the right by default in this first pass
- do not add move buttons, transfer modes, or drag-and-drop in this first cut
- do not widen this subphase into scale work, preview-Browser work, or general import-runtime redesign

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/store/useAppStore.ts`

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already owns the staged file-card structure summary, the shipped read-only `Parts` list rendering through `summary.partRows`, and the strongest seam for replacing that one-list treatment with one explicit `All Parts` plus `Imported Parts` layout
  - currently renders the staged file card through `renderStagedImportStructureSummary(...)`, so this phase can stay local to the staged file-card body instead of widening into preview-Browser ownership
- `src/app/panels/useBrowserPanelController.ts`
  - already exposes the staged settings handlers that `renderStagedImportStructureSummary(...)` receives
  - is therefore the strongest seam for adding any new staged imported-parts handlers that should stay dialog-local and validated against the current staged file
- `src/app/theme/surfaces/browser.css`
  - already owns the shipped selection-list treatment through `.BrowserImportDialogStructureSelectionList`
  - is therefore the strongest seam for the first two-column list layout, column labels, and explicit imported-membership styling without redesigning the rest of the staged file card
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged import part-list treatment and the current staged settings behavior
  - should next prove:
    - the old one-list `Parts` area is replaced by one explicit two-column read
    - the left column shows the truthful full part inventory
    - the right column shows the current imported-part membership
    - the first pass still leaves all truthful parts included by default
- `src/app/store/useAppStore.ts`
  - already owns the staged import draft and the per-file staged settings contract
  - already builds source-part preview nodes with stable `sourcePartKey` and `sourceMeshIndex`
  - already commits accepted split children through those same part-provenance fields
  - does not yet own one explicit staged imported-parts membership seam, so phase 1 should add that owner here instead of inventing panel-local right-column state

### First-Pass Decisions

- add one explicit draft-owned imported-parts membership owner per staged file:
  - keyed by the truthful inspected `partKey`
  - using the existing inspected part identity instead of inventing a second row-id-only membership system
- keep phase 1 structural and truthful only:
  - the right column should become the explicit imported-parts read
  - all truthful parts remain included by default
  - no add/remove curation controls land yet
- keep `Import As` unchanged in phase 1:
  - the first pass may show imported-parts truth
  - it must not yet introduce automatic mode switching
  - later `phase 4` still owns the honest `1 Object` exit when the imported set becomes a subset
- keep commit behavior unchanged in phase 1:
  - no selective filtering yet
  - no hidden acceptance changes under a layout-only label
- scope this first pass to staged files whose inspection truthfully exposes `partRows`:
  - no widening into flat files
  - no hierarchy-tree redesign here
- keep the first store addition narrow:
  - enough truth to drive the right-column read now
  - shaped so later `phase 2` and `phase 3` can reuse it for curation and commit filtering

### Vision Summary

- the staged file card should stop reading as one overloaded list and instead read as:
  - `available parts` on the left
  - `imported parts` on the right
- the right column should no longer be implicit:
  - it should say what the dialog will import if committed now
- arrow-button transfer, list modes, and drag-and-drop are all later follow-ups after this clearer two-column truth lands

### Wishlist Breakdown

1. Convert the current single `Parts` area into a two-column list layout inside the staged file card.
2. Make the left column the truthful file-parts inventory.
3. Make the right column the explicit imported-parts list.
4. Keep all truthful parts included on the right by default in this first pass.
5. Leave transfer controls and list-mode behavior to later follow-ups once the two-column truth is stable.

### Suggested Implementation Ladder

1. Land the two-column structure and headings using the existing part data.
2. Add one draft-owned imported-parts membership seam keyed by truthful inspected part identity.
3. Wire the right column to that imported-parts membership as the imported-parts read.
3. Keep all truthful parts included by default in this first pass.
4. Keep `Import As` and commit behavior unchanged in this first pass.
5. Tighten Browser proof around two-column rendering and imported-list truth.
6. Add transfer controls and curation behavior in the next subphase once the structural read is stable.

### Suggestions

- prefer labels closer to `All Parts` and `Imported Parts` in the shipped UI even if the planning shorthand keeps saying `left` and `right`
- keep both columns in stable file order rather than allowing ad hoc reordering in this phase
- treat the right column as the only commit-authoritative imported list so the import result stays easy to reason about
- introduce buttons, list modes, and drag-and-drop only after the two-column structure lands, so we can validate the ownership semantics first

### Exact First Code Cut

1. Audit the live staged `Parts` list treatment in `browserTreeMenus.tsx`, the staged-file controller wiring in `useBrowserPanelController.ts`, and the current draft plus preview/commit part-provenance seams in `useAppStore.ts`.
2. Add one narrow staged imported-parts membership seam to the staged draft in `useAppStore.ts`, defaulting truthful `partKey` membership to the full inspected part set when a staged file has ready `partRows`.
3. Expose any needed imported-parts read or reset helpers through `useBrowserPanelController.ts` without adding curation behavior yet.
4. Replace the current one-list `Parts` area with one explicit two-column imported-parts scaffold in `browserTreeMenus.tsx` and `browser.css`.
5. Wire the left column to the truthful inspected part inventory and the right column to the new imported-parts membership read.
6. Tighten `BrowserPanel.test.tsx` so the first pass proves two-column rendering, default all-included imported membership, and unchanged staged settings behavior.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/store/useAppStore.ts`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not widen into preview-Browser part rows or object-preview behavior
- do not add part-removal or part-restore controls yet
- do not change `Add To Project` commit filtering yet
- do not change `Import As` yet
- do not redesign part ordering beyond preserving stable file order
- do not add transfer controls, transfer modes, or drag-and-drop in the first shipped cut of this subphase; capture them as later follow-ups once the two-column truth is working
- do not add multi-card bulk behavior in this phase
- do not touch scale enrichment work in this subphase

### Implementation Risks

- inventing a panel-local imported-membership array instead of one draft-owned store seam
- using row index or rendered order as imported-membership identity instead of the already truthful `partKey` plus `sourceMeshIndex` provenance
- accidentally changing commit behavior in `phase 1` because the new imported-membership seam is wired too early into acceptance
- accidentally changing `Import As` behavior before the later selective-mode phase owns that shift
- widening the file-card part area into preview-Browser or hierarchy-tree ownership instead of keeping the first pass local to the staged file card
- letting the two columns drift out of truthful file order and therefore making later curation harder to reason about

### Checklist

- [ ] replace the staged file-card part area with a two-column imported-parts selector
- [ ] preserve truthful part labels and stable file order
- [ ] make the right column the explicit imported-parts list
- [ ] keep all truthful parts included on the right by default
- [ ] add one draft-owned imported-parts membership seam that later curation and commit phases can reuse
- [ ] keep `Import As` and commit behavior unchanged in this first pass
- [ ] add focused Browser proof
- [ ] reserve transfer controls, transfer modes, and drag-and-drop as later follow-ups after the two-column truth ships

### Verification Shape

Minimum verification for this subphase should cover:

- a staged file with truthful `partRows` now renders one explicit two-column `All Parts` plus `Imported Parts` read inside the staged file card
- the left column preserves the truthful full part inventory in stable file order
- the right column initially shows that same truthful full set as the imported default
- no add/remove curation controls are present yet
- `Import As` still behaves exactly as before this phase
- `Add To Project` behavior remains unchanged in this first pass

### Done Shape

- the staged file card no longer treats imported-parts truth as implicit
- the dialog now shows one explicit source-side parts inventory and one explicit imported-parts read
- the first phase adds the durable imported-membership owner the later curation and commit-truth phases need
- `Import-4.7.7 - phase 2` remains the next follow-up for actual left-right curation controls

## [ ] `Import-4.7.7 - phase 2 - Arrow-Button Imported-Parts Curation`

### Purpose

- add the smallest explicit imported-parts curation controls after the two-column source-versus-imported read is already visible and stable

### Goal

- let the user move parts out of and back into the imported list through compact arrow-button controls
- keep curation explicit and staged-dialog-local

### Locked Direction

- keep this phase button-driven:
  - no transfer-list mode toggle yet
  - no drag-and-drop yet
- preserve truthful labels, stable file order, and the right column as the imported-result owner
- do not widen into scale or preview-Browser work here

### Checklist

- [ ] add compact move-left and move-right controls between the lists
- [ ] let the user remove parts from the imported list
- [ ] let the user restore parts to the imported list without reuploading
- [ ] keep curation explicit and staged-dialog-local

## [ ] `Import-4.7.7 - phase 3 - Imported-Parts Commit Truth`

### Purpose

- make the imported-parts list the real commit owner so `Add To Project` only imports what the user still has on the right

### Goal

- tie the staged imported set to real import behavior instead of leaving the right column as UI-only theater
- preserve existing full-file behavior when the imported list still matches the full truthful file read

### Locked Direction

- keep this phase commit-truth-focused:
  - no automatic import-mode switching yet
  - no transfer-list mode toggle yet
- prevent hidden whole-file import behavior once the user has curated the imported set down to a subset

### Checklist

- [ ] make `Add To Project` commit only the parts still present in the imported list
- [ ] keep full-file acceptance behavior unchanged when nothing has been curated
- [ ] prevent hidden whole-file import behavior after the imported set becomes a subset

## [ ] `Import-4.7.7 - phase 4 - Automatic Import As Mode Shift For Selective Parts`

### Purpose

- keep `Import As` honest once the imported set becomes selective instead of leaving the user in a misleading full-file wrapper mode

### Goal

- preserve `1 Object` as the default full-file acceptance mode
- automatically leave `1 Object` once the imported list no longer matches the full truthful part set
- introduce one explicit selective import mode instead of a hidden wrapper mismatch

### Locked Direction

- keep this phase focused on mode honesty:
  - no transfer-list mode work yet
  - no drag-and-drop work yet
- prefer one explicit selective mode label over several overlapping selective variants

### Checklist

- [ ] keep the full-file default on `1 Object`
- [ ] automatically leave `1 Object` when the imported list no longer matches the full truthful part set
- [ ] introduce one explicit selective import mode instead of a hidden wrapper mismatch

## [ ] `Import-4.7.7 - phase 5 - Transfer List And Inventory Transfer List Modes`

### Purpose

- add the later visibility and deactivation behavior refinements once the basic imported-parts transfer flow and commit truth are already stable

### Goal

- support two named list behaviors:
  - `Transfer List`
  - `Inventory Transfer List`
- keep the left column useful in both modes without changing the imported-list truth already established by earlier phases

### Locked Direction

- in `Transfer List`, right-column rows should no longer appear on the left
- in `Inventory Transfer List`, all parts should remain visible on the left and imported rows should deactivate there
- preserve useful selected-row behavior of the left column while supporting both list modes

### Checklist

- [ ] add a mode toggle that flips between `Transfer List` and `Inventory Transfer List`
- [ ] in `Transfer List` mode remove imported rows from the left column
- [ ] in `Inventory Transfer List` mode keep all parts visible on the left
- [ ] in `Inventory Transfer List` mode deactivate left rows already present on the right
- [ ] preserve useful left-column selection behavior across both modes

## [ ] `Import-4.7.7 - phase 6 - Drag-And-Drop Follow-Up For Imported Parts Lists`

### Purpose

- add drag-and-drop only after the button-based imported-parts flow and list semantics are already stable and proven

### Goal

- let the user drag parts from the left list into the right list without inventing new imported-set semantics
- preserve stable file order unless a later dedicated phase explicitly widens reordering

### Locked Direction

- keep drag semantics consistent with the imported-list truth already shipped
- do not widen this phase into bulk import behavior or ad hoc right-column reordering

### Checklist

- [ ] allow dragging parts from the left list into the right list after the button flow is stable
- [ ] keep drag semantics consistent with the imported-list truth already shipped
- [ ] preserve stable file order unless a later phase explicitly widens reordering

## [ ] `Import-4.7.7 - phase 7 - Scale Enrichment`

### Purpose

- enrich the current staged `Scale / Units` read so it is easier to understand and scan without changing the existing staged scale behavior by accident

### Goal

- improve how scale is explained or presented in the staged import dialog while staying truthful to the current `Scale / Units` contract

### Locked Direction

- keep this subphase focused on `Scale enrichment` only
- preserve the current staged `Scale / Units` meaning and stored values
- avoid widening into format-specific metadata, loader-parameter work, or commit-path behavior changes
- do not touch part-list enrichment in this subphase except for the smallest shared presentation residue if implementation genuinely requires it

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/store/useAppStore.ts` only if a tiny additive truthful display seam is needed for enrichment

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already owns the current `Scale / Units` `ParaSelect` surface and the visible short labels:
    - `Current`
    - `mm`
    - `cm`
    - `m`
    - `in`
- `src/app/store/useAppStore.ts`
  - already owns the current `StagedImportScaleAlignment` contract and the existing scale-factor truth through `resolveStagedImportScaleAlignmentFactor(...)`
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves staged settings behavior and is the strongest seam for focused proof that any scale enrichment stays behaviorally unchanged

### First-Pass Decisions

- keep the current scale options and meanings intact
- enrich the scale read only through clearer UI presentation or truthful explanatory context supported by the current scale contract
- do not let the enrichment imply format-specific units certainty that the current generic staged contract does not actually have

### Exact First Code Cut

1. Audit the current staged `Scale / Units` presentation in `src/app/panels/browserTreeMenus.tsx`.
2. Narrowly enrich the scale read while preserving the same options and selected-state truth.
3. If needed, reuse existing scale-alignment truth from `src/app/store/useAppStore.ts` instead of inventing panel-only scale claims.
4. Tighten `src/app/panels/BrowserPanel.test.tsx` so the enriched scale read remains truthful and behaviorally unchanged.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.ts` only if needed

### No-Widening Rule

- do not change scale option values
- do not change how scale is stored
- do not widen into `.step`-specific or other format-specific metadata work
- do not widen into preview-output or accepted-result scale behavior

### Checklist

- [ ] enrich the staged `Scale / Units` read
- [ ] preserve the current scale contract and selected-state truth
- [ ] keep import behavior unchanged
- [ ] add focused Browser proof

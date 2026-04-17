# `Import-4 Phase 7.7` - `Part List And Scale Enrichment`

## Doc Header

### Doc History
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 7.7`, splitting the next user-provided staged import polish pair out of the broader `Phase 7` record so `Part list enrichment` and `Scale enrichment` can each land as their own Codex-sized follow-up without widening this lane beyond those two wishlist items
2. 2026-04-16: Refined this doc around the first concrete `Part list enrichment` vision, reshaping `7.7.1` into a two-column staged part-selector plan with left and right transfer controls, a `display all objects` visibility toggle, and explicit active-row truth so the wishlist is small enough to implement slice by slice without mixing it into `Scale enrichment`

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

Enrich the staged import dialog through two narrow follow-ups only:
- `Part list enrichment`
- `Scale enrichment`

### Locked Direction

- keep this lane limited to the two wishlist items provided so far:
  - `Part list enrichment`
  - `Scale enrichment`
- let `Part list enrichment` introduce staged part-picking UI behavior if needed, but keep it narrowly scoped to the staged file card instead of widening into preview-browser or import-runtime redesign
- keep `Scale enrichment` UI-focused unless one tiny additive display seam is genuinely required for truthful scale readout
- preserve the current staged import truth:
  - part labels and ordering should stay honest
  - the staged selected-parts set should stay explicit and understandable
  - scale meaning should stay honest to the existing staged `Scale / Units` contract
- do not add extra wishlist items, cleanup buckets, or follow-on phases here unless the user explicitly provides them later

### Likely Architecture Seams

- `src/app/panels/browserTreeMenus.tsx`
  - strongest seam for the current staged part-list treatment, selected-parts controls, and the current `Scale / Units` UI surface
- `src/app/theme/surfaces/browser.css`
  - strongest seam for two-column list layout, row active-state styling, transfer controls, and scale-related readability
- `src/app/panels/BrowserPanel.test.tsx`
  - strongest seam for focused Browser proof around staged import list-transfer behavior and UI enrichment
- `src/app/store/useAppStore.ts`
  - likely seam for the current staged selected-parts truth and only for `Scale enrichment` if one additive truthful display seam is needed instead of panel-only copy guesses

## Wishlist Tracking

These wishlist mappings should be read as the planned `Import-4 / Phase 7.7` ladder and should stay limited to the wishlist items provided so far.

### `Import-4 Phase 7.7.1`
- [ ] `1. Two-Column Part List Enrichment`
- [ ] `1A. Turn the staged file-card part area into two lists in two columns`
- [ ] `1B. Show all parts in the file in the left column`
- [ ] `1C. Show all parts the user wants to add in the right column`
- [ ] `1D. Add small move-left and move-right arrow buttons between the lists`
- [ ] `1E. Keep the left column as the source list of parts the user can add`
- [ ] `1F. Add a mode toggle that flips between Transfer List and Inventory Transfer List`
- [ ] `1G. When Transfer List mode is on, use classic transfer-list behavior so right-column rows no longer appear in the left column`
- [ ] `1H. When Inventory Transfer List mode is on, keep all parts visible in the left column even if they are already in the right column`
- [ ] `1I. When Inventory Transfer List mode is on, deactivate left-column rows that are already present in the right column`
- [ ] `1J. As parts are added to the right column, deactivate their matching rows on the left in Inventory Transfer List mode`
- [ ] `1K. Preserve the useful selected-row behavior of the left column while supporting both list modes`
- [ ] `1L. After the arrow-button transfer flow ships, add a later follow-up for dragging and dropping parts from the left list into the right list`

### `Import-4 Phase 7.7.2`
- [ ] `2. Scale Enrichment`

## [ ] `Import-4 Phase 7.7.1 - Two-Column Part List Enrichment`

### Purpose

- replace the staged file-card `Parts` read with a clearer two-column selector that separates `all parts in the file` from `parts the user wants to add`, while keeping staged part truth understandable and implementable in narrow follow-ups

### Goal

- turn the staged file-card part area into a transfer-list style selector:
  - left column: all parts in the file
  - middle controls: small left and right move buttons
  - right column: parts the user wants to add
  - extra mode toggle: `Transfer List` or `Inventory Transfer List`

### Locked Direction

- keep this subphase focused on the staged file-card part selector only
- preserve truthful part labels and stable file-ordering where possible
- make the right column the authoritative `parts to add` list
- preserve the useful `selected` behavior of the left column as a browser/source list
- ship arrow-button transfer first
- support two named list modes:
  - `Transfer List`: classic source-and-destination behavior where right-column rows no longer appear on the left
  - `Inventory Transfer List`: full-inventory-left behavior where all file parts stay visible on the left and rows already present on the right become deactivated
- reserve drag-and-drop from the left list into the right list for a later follow-up after the button-driven transfer flow is stable
- do not widen this subphase into scale work, preview-browser work, or general import-runtime redesign

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/store/useAppStore.ts` only if the current staged selected-parts ownership is not already sufficient for transfer-list truth

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already owns the staged file-card structure summary, the shipped `Parts` list rendering through `summary.partRows`, and the strongest seam for replacing that single-list treatment with a two-column selector
- `src/app/theme/surfaces/browser.css`
  - already owns the shipped selection-list treatment through `.BrowserImportDialogStructureSelectionList` and is the strongest seam for two-column layout, transfer-button placement, and activated versus deactivated row styling
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged import part-list treatment and is the strongest seam for focused regression proof around transfer behavior, toggle behavior, and row-state truth
- `src/app/store/useAppStore.ts`
  - likely already owns the selected-parts truth that should drive the right-column membership instead of inventing panel-local state

### Vision Summary

- the staged file card should stop reading as one overloaded list and instead read as:
  - `available parts` on the left
  - `parts to add` on the right
- the center controls should use compact arrow buttons so the move action is obvious without making the card feel heavy
- the mode toggle should switch between:
  - `Transfer List`
  - `Inventory Transfer List`
- in `Inventory Transfer List`, the left list becomes a complete file inventory and selected rows are shown in a deactivated state rather than removed
- in `Transfer List`, the left list becomes a classic source list that only shows addable rows

### Wishlist Breakdown

1. Convert the current single `Parts` area into a two-column list layout inside the staged file card.
2. Add compact move-right and move-left controls between the two columns.
3. Make the right column the explicit `parts the user wants to add` list.
4. Add a mode toggle that flips between `Transfer List` and `Inventory Transfer List`.
5. In `Inventory Transfer List`, keep left rows visible but deactivate any part already present on the right.
6. In `Transfer List`, remove right-column rows from the left list.
7. Preserve left-list row selection so the source-side browser interaction still feels useful in both modes.
8. In a later follow-up after the button-driven version ships, allow dragging parts from the left list into the right list.

### Suggested Implementation Ladder

1. Land the two-column structure and headings using the existing part data without changing row transfer yet.
2. Wire the right column to the staged selected-parts truth and add move-right and move-left behavior.
3. Add the mode toggle and the two named list modes.
4. Add explicit active versus deactivated row styling so the `display all objects` mode stays visually honest.
5. Tighten Browser proof around transfer behavior, toggle behavior, and left-column row-state truth.
6. Plan a later follow-up for drag-and-drop once the arrow-button transfer flow is shipped and stable.

### Suggestions

- prefer labels closer to `All Parts` and `Parts To Add` in the shipped UI even if the planning shorthand keeps saying `left` and `right`
- use `Transfer List` and `Inventory Transfer List` as the explicit mode names in docs and planning so the two behaviors stay easy to discuss
- keep both columns in stable file order rather than allowing ad hoc reordering in this phase
- treat the right column as the only commit-authoritative list so the import result stays easy to reason about
- introduce drag-and-drop only after the button-based flow lands, so we can validate the transfer semantics before adding a second interaction path

### Exact First Code Cut

1. Audit the current staged `Parts` list treatment and the staged selected-parts source of truth in `src/app/panels/browserTreeMenus.tsx` and `src/app/store/useAppStore.ts`.
2. Replace the current one-list `Parts` area with a two-column layout scaffold in `src/app/panels/browserTreeMenus.tsx` and `src/app/theme/surfaces/browser.css`.
3. Wire the left and right columns to truthful source and selected membership.
4. Add the middle transfer controls and the mode toggle for `Transfer List` versus `Inventory Transfer List`.
5. Tighten `src/app/panels/BrowserPanel.test.tsx` so transfer behavior and left-column row-state truth are covered.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not widen into preview-browser part rows or accepted split behavior
- do not redesign part ordering beyond preserving stable file order
- do not add drag-and-drop in the first shipped cut of this subphase; capture it as a later follow-up once arrow-button transfer is working
- do not add multi-card bulk behavior in this phase
- do not touch scale enrichment work in this subphase

### Checklist

- [ ] replace the staged file-card part area with a two-column selector
- [ ] preserve truthful part labels and stable file order
- [ ] make the right column the explicit `parts to add` list
- [ ] support the `Transfer List` and `Inventory Transfer List` mode toggle behavior
- [ ] make left-column active and deactivated row state visually explicit
- [ ] add focused Browser proof
- [ ] reserve drag-and-drop as a later follow-up after the arrow-button transfer flow ships

## [ ] `Import-4 Phase 7.7.2 - Scale Enrichment`

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

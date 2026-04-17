# `Import-4 Phase 7.4` - `Read-Only Hierarchy Tree Enrichment`

## Doc Header

### Doc History
13. 2026-04-16: Implemented `Import-4 / Phase 7.4.4 - True Tree Connector And Root-Line Fidelity` by refining the staged hierarchy tree into a more rooted tree-like read with clearer branch connectors back toward parent levels, keeping the shipped title-plus-scroll-region shell intact, and adding focused Browser proof that the same hierarchy summary seam now carries the stronger tree-structure read without disturbing the parts list
12. 2026-04-16: Prepped `Import-4 / Phase 7.4.4 - True Tree Connector And Root-Line Fidelity` for implementation by grounding the next visual-fidelity pass in the shipped nested `ul/li` hierarchy-tree DOM, the current scroll-region ownership, and the existing CSS-only connector seam so the next cut can focus narrowly on making the tree read more like a true rooted structure without widening back into contract, copy, or behavior work
11. 2026-04-16: Expanded the `Import-4 / Phase 7.4` ladder with a new dedicated later visual-fidelity step for making the staged hierarchy tree read more like the true rooted tree shape with clearer connector lines back toward the root, and moved the cleanup closeout pass to the new final `7.4.5` slot so the hierarchy lane still ends with one explicit regression-and-cleanup phase
10. 2026-04-16: Implemented `Import-4 / Phase 7.4.3 - Badge Truth And Helper-Copy Enrichment` by tightening hierarchy-bearing staged files from the over-broad `Multiple objects` read to a clearer `Structured file` plus one compact no-split-parts helper line, while preserving the stronger split-ready read for true part-backed files and retiring the leftover flat label-chip fallback under split-part rows
9. 2026-04-16: Prepped `Import-4 / Phase 7.4.3 - Badge Truth And Helper-Copy Enrichment` for implementation by grounding the next wording pass in the live staged badge array inside `renderStagedImportStructureSummary(...)`, the newly shipped read-only hierarchy-tree treatment, and the current structured-versus-split-ready confusion seam so the next cut can stay narrowly focused on badge truth plus one compact companion helper read
8. 2026-04-16: Tightened the shipped `Import-4 / Phase 7.4.2 - Hierarchy Tree Rendering` follow-up again by moving the `Hierarchy Tree` title outside the scrolling region so only the nested tree content scrolls inside the `100px`-capped area, keeping the label fixed and easier to scan in dense staged cards
7. 2026-04-16: Tightened the shipped `Import-4 / Phase 7.4.2 - Hierarchy Tree Rendering` follow-up by capping the new staged hierarchy tree block at `100px` and giving it a local scrollbar so dense structured files stay contained inside the staged card without changing hierarchy truth or behavior
6. 2026-04-16: Implemented `Import-4 / Phase 7.4.2 - Hierarchy Tree Rendering` by wiring the new additive `hierarchyRows` seam into the live staged structure-summary owner, rendering a compact read-only nested tree that can coexist with the shipped parts list when both truths exist, and adding focused Browser proof that hierarchy-only files, split-ready files, and flat files now render the right summary treatment without changing import behavior
5. 2026-04-16: Prepped `Import-4 / Phase 7.4.2 - Hierarchy Tree Rendering` for implementation by grounding the next tree-rendering cut in the live `renderStagedImportStructureSummary(...)` seam, the shipped `7.1` parts-list treatment, the new additive `hierarchyRows` contract, and the current staged-card summary CSS so the rendering pass can stay narrowly UI-only without drifting into badge-copy or behavior changes
4. 2026-04-16: Implemented `Import-4 / Phase 7.4.1 - Hierarchy Summary Contract` by extending the staged structure summary with a compact read-only `hierarchyRows` seam, reusing the existing meaningful-name filter so generic wrapper noise stays out where possible, and adding focused viewer-side proof that structured hierarchy and split-ready part rows can coexist without collapsing into one contract
3. 2026-04-16: Prepped `Import-4 / Phase 7.4.1 - Hierarchy Summary Contract` for implementation by grounding the first hierarchy-tree cut in the live staged structure-summary seam in `referenceStructureInspection.ts`, the existing meaningful-name filter in `referencePartDescriptors.ts`, and the current staged hierarchy booleans so the next pass can add a compact read-only hierarchy contract without widening into UI rendering or import behavior
2. 2026-04-16: Expanded this standalone `Import-4 / Phase 7.4` record so each `7.4.x` step now has its own top-level `##` section, turning the hierarchy-tree lane into a cleaner one-Codex-cut-at-a-time ladder instead of leaving only the first subphase fully spelled out
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 7.4`, splitting the later staged hierarchy-tree truth lane out of the broader `Phase 7` UI-polish record so the tree and badge-enrichment work can land in smaller one-by-one cuts

### Purpose

This doc owns the later staged import hierarchy-tree enrichment lane.

Use it to answer:
- how hierarchy-bearing staged files should explain their internal structure more honestly than the current broad `Multiple objects` badge
- how the staged import dialog should distinguish structured single-object files from truly split-ready files
- how the later hierarchy-tree truth work should be broken into small enough subphases for one-by-one implementation

### Relationship To Parent Doc

Parent lane:
- `Import_Phase Import-4 Phase 7 - UI Cleanup And Polish.md`

This doc exists because:
- the later hierarchy-tree enrichment work is bigger than a small polish footnote
- the work should stay distinct from the already-shipped `7.1`, `7.2`, and `7.3` cleanup passes
- hierarchy-tree truth needs its own phased ladder so the data seam, UI rendering, wording cleanup, and closeout proof do not get mixed together

Keep the parent `Import-4 / Phase 7` doc as the umbrella later UI-polish lane.

Use this doc for:
- the detailed planning and phased execution of the read-only staged hierarchy-tree enrichment work

## Doc Body

### Goal

Add a compact, truthful, read-only hierarchy tree for structured staged files so the import dialog can explain named internal structure more honestly than broad structure badges alone, while keeping hierarchy explanation clearly separate from split-ready parts and import behavior.

### Locked Direction

- keep this lane UI-only:
  - no new split-import behavior
  - no new part-selection behavior
  - no commit-path changes
  - no preview-browser ownership changes
- keep the tree read-only:
  - no selection behavior
  - no import inclusion behavior
  - no persistence requirement for expansion state
- prefer meaningful named hierarchy nodes and avoid generic loader noise where possible
- keep split-ready part lists and read-only hierarchy trees as distinct concepts
- let the staged import dialog stay truthful when a file is structured but still effectively one meaningful object

### Likely Architecture Seams

- `src/viewer/referenceStructureInspection.ts`
  - strongest seam for expanding the staged structure summary beyond broad booleans and flat label lists
- `src/viewer/referencePartDescriptors.ts`
  - useful seam for keeping the tree distinct from split-part descriptors and for reusing meaningful-name filtering rules
- `src/app/panels/browserTreeMenus.tsx`
  - strongest seam for staged card hierarchy-tree rendering and helper-copy treatment
- `src/app/theme/surfaces/browser.css`
  - strongest seam for compact staged tree styling and hierarchy-specific badge/readability cleanup
- `src/app/panels/BrowserPanel.test.tsx`
  - strongest seam for focused Browser proof around staged hierarchy-tree treatment

## Wishlist Tracking

These wishlist mappings should be read as the planned `Import-4 / Phase 7.4` ladder for hierarchy-tree truth after the earlier staged import polish work is already shipped.

### `Import-4 Phase 7.4.1`
- [x] `1. Hierarchy Summary Contract`
- [x] `1A. Add Read-Only Hierarchy Tree Data To Staged Structure Inspection`
- [x] `1B. Prefer Meaningful Names And Filter Generic Loader Noise`
- [x] `1C. Keep Hierarchy Data Distinct From Split Part Rows`

### `Import-4 Phase 7.4.2`
- [x] `2. Hierarchy Tree Rendering`
- [x] `2A. Render A Compact Read-Only Tree In The Staged File Card`
- [x] `2B. Keep The Tree Distinct From The Parts Selection List`
- [x] `2C. Keep Structured Single-Object Files Honest`

### `Import-4 Phase 7.4.3`
- [x] `3. Badge Truth And Helper-Copy Enrichment`
- [x] `3A. Reduce Over-Broad Multiple Objects Messaging`
- [x] `3B. Add Clearer Companion Copy For Structured Files`
- [x] `3C. Preserve Split-Ready File Clarity`

### `Import-4 Phase 7.4.4`
- [x] `4. True Tree Connector And Root-Line Fidelity`
- [x] `4A. Make The Hierarchy Tree Read More Like The True Rooted Tree`
- [x] `4B. Show Clearer Connector Lines Back Toward The Root`
- [x] `4C. Preserve Readability In Dense Staged Cards`

### `Import-4 Phase 7.4.5`
- [ ] `5. Final Cleanup And Regression Proof`
- [ ] `5A. Lock One High-Signal Browser Proof For Hierarchy Trees`
- [ ] `5B. Remove Narrow Residue Retired By The New Tree Treatment`
- [ ] `5C. Close Out The Hierarchy-Tree Lane`

## [x] `Import-4 Phase 7.4.1 - Hierarchy Summary Contract`

### Purpose

- add the smallest honest staged-inspection data seam needed for a later read-only hierarchy tree

### Goal

- extend the staged structure summary with read-only hierarchy-tree data for hierarchy-bearing files
- keep that data separate from split-ready part rows and broad structure badges

### Locked Direction

- keep this first cut data-contract-only:
  - no staged card tree rendering yet
  - no helper-copy rewrite yet
  - no import behavior changes
- prefer meaningful names only and filter generic loader labels where possible
- keep the contract compact enough for staged-card rendering without exposing raw loader internals

### Expected Implementation Shape

- update `src/viewer/referenceStructureInspection.ts`
- update `src/viewer/referencePartDescriptors.ts` only if the current meaningful-name filter should be reused rather than duplicated
- update `src/app/panels/BrowserPanel.test.tsx` or a closer unit seam only if one focused proof is needed at this contract layer

### Implementation-Prep Read

- `src/viewer/referenceStructureInspection.ts`
  - currently returns:
    - `hasMultipleObjects`
    - `hasHierarchy`
    - `hasParts`
    - `labels`
    - `partRows`
  - is the strongest seam for adding a compact read-only hierarchy-tree data shape without changing staged settings or commit behavior
- the current structure summary already traverses the loaded object tree and already reuses meaningful-name filtering for labels, so the next honest move is to add one hierarchy-tree read instead of trying to infer hierarchy later in the panel layer
- the current `collectObjectStructureStats(...)` path already distinguishes:
  - `hasMultipleObjects`
  - `hasHierarchy`
  but it cannot explain *why* a file is structured because it throws away the parent-child shape after counting descendants
- `src/viewer/referencePartDescriptors.ts`
  - already owns the repo's strongest current filter for generic loader-noise labels through `isMeaningfulPartLabel(...)`
  - is the best seam to reuse so the hierarchy-tree contract does not drift into a second slightly-different definition of "meaningful label"
- `src/app/panels/browserTreeMenus.tsx`
  - should remain untouched in this first subphase unless a tiny temporary no-op plumbing seam is genuinely required

### First-Pass Decisions

- add one explicit compact hierarchy-tree shape to the staged structure summary
- keep hierarchy-tree rows read-only and label-focused
- allow the first contract cut to cap depth or row count if that keeps the data honest and cheap
- do not treat hierarchy-bearing files as split-ready unless `partRows` truthfully says they are
- keep the first contract shallow and presentation-friendly:
  - one nested row shape with `label` plus `children`
  - no viewer/runtime-only fields
  - no raw `Object3D` references
- only include hierarchy rows when there is truthful value:
  - meaningful labels
  - meaningful parent-child structure
  - not just generic wrapper noise

### Exact First Code Cut

1. Audit the current staged structure-summary contract in `src/viewer/referenceStructureInspection.ts`.
2. Add one compact hierarchy-tree row type to the staged structure summary, likely something like:
   - `hierarchyRows: Array<{ label: string; children: ... }>`
3. Build that tree from the loaded object graph while reusing the existing meaningful-name filter so generic wrapper nodes are excluded where possible.
4. Keep the new hierarchy-tree seam distinct from `partRows`, even when a file truthfully has both hierarchy and split-ready parts.
5. Add one focused proof that the new hierarchy-tree data can represent a structured file without collapsing into the split-parts contract.

### Likely Files

- `src/viewer/referenceStructureInspection.ts`
- `src/viewer/referencePartDescriptors.ts`
- `src/viewer/referenceStructureInspection.test.ts` or another existing focused proof seam if needed

### No-Widening Rule

- do not render the tree in the staged dialog yet
- do not change staged badges or copy yet
- do not widen into import behavior or part-selection behavior
- do not add generic raw scene-node dumping just because hierarchy exists

### Implementation Risks

- producing a hierarchy-tree seam that is too raw for UI use and later forces panel-layer cleanup logic
- accidentally surfacing generic loader wrappers like `STEP Node` or `STEP Mesh N` as if they were meaningful structure
- collapsing split-part rows and hierarchy rows into one mixed contract that becomes hard to explain honestly in the staged card
- over-pruning the tree so aggressively that a genuinely structured file looks empty
- widening the first contract cut into a rendering or copy phase before the data seam is stable

### Checklist

- [x] add a compact read-only hierarchy-tree data shape to staged structure inspection
- [x] prefer meaningful names and filter generic loader noise where possible
- [x] keep hierarchy-tree data distinct from split-part rows
- [x] keep staged import behavior unchanged
- [x] add focused proof for the new contract

### Verification Shape

Minimum verification for this subphase should cover:

- a hierarchy-bearing structured file can produce hierarchy-tree summary data
- a split-ready file can still expose `partRows` without collapsing into the hierarchy-tree-only read
- generic loader-noise labels do not dominate the hierarchy-tree output when better names exist
- no staged import behavior, preview behavior, or commit behavior changes land as part of the contract cut

### Done Shape

- staged structure inspection owns one compact hierarchy-tree seam that later UI phases can render directly
- the later `7.4` UI work no longer needs to infer hierarchy from broad booleans or flat label chips

### Implementation Notes

- `src/viewer/referenceStructureInspection.ts`
  - now returns an additive compact `hierarchyRows` seam alongside the existing staged structure booleans, flat labels, and `partRows`
  - builds the tree from the loaded object graph while reusing the existing meaningful-name filter so generic wrapper labels like `STEP Node` or `STEP Mesh N` stay out where possible
- `src/viewer/referenceStructureInspection.test.ts`
  - now proves the new contract can represent:
    - a structured hierarchy-bearing single-object file without split-part rows
    - a structured split-ready file where hierarchy rows and `partRows` both exist without collapsing into one mixed concept

## [x] `Import-4 Phase 7.4.2 - Hierarchy Tree Rendering`

### Purpose

- render the new hierarchy summary seam as a compact read-only tree inside hierarchy-bearing staged file cards

### Goal

- show a compact read-only hierarchy tree when a staged file truthfully has hierarchy-tree data
- keep that tree clearly distinct from the split-parts list and from broad badges alone

### Locked Direction

- keep this subphase UI-only:
  - no new split-import behavior
  - no part-selection behavior
  - no commit-path changes
- keep the tree compact and staged-card-local
- keep the tree read-only:
  - no selectable rows
  - no import inclusion meaning
  - no preview or commit side effects
- if row count or depth needs a first-pass cap, keep it honest and explicit rather than rendering a noisy uncontrolled dump

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already owns the staged card structure-summary block
  - specifically already renders:
    - structure badges
    - the shipped `7.1` parts selection list
    - the fallback label-chip group
    - the `Import As` paraselect
  - is the strongest seam for inserting hierarchy-tree rows inside the same summary owner instead of inventing a second competing summary region
  - should keep the tree distinct from the shipped `7.1` parts selection-list treatment and from the flat label-chip fallback
- the new additive `hierarchyRows` seam from `7.4.1`
  - is now the truthful rendering source for hierarchy-bearing files
  - means `7.4.2` should render the tree directly from summary data rather than inferring hierarchy from `hasHierarchy`, `labels`, or `partRows`
- `src/app/theme/surfaces/browser.css`
  - already owns staged card list treatment, badge spacing, and summary layout
  - already owns the parts-list treatment through `.BrowserImportDialogStructureSelectionList`
  - is the strongest seam for compact tree indentation, muted connectors, dense structured-file readability, and keeping the tree visually separate from the darker highlight-row parts list
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged structure summary, parts-list treatment, and reorganized staged card layout
  - should be extended here so the next pass proves:
    - the hierarchy tree appears only when `hierarchyRows` truthfully exist
    - hierarchy-only files render a tree without pretending to be split-ready
    - split-ready files can render both a parts list and a read-only hierarchy tree without collapsing one into the other

### First-Pass Decisions

- render the hierarchy tree only when the new summary seam truthfully provides it
- keep the tree visually secondary to the file title and primary structure badges
- keep split-ready files free to show both:
  - a parts list
  - a hierarchy tree
  if both are truthfully available
- avoid over-designing the first tree pass; a clean compact nested list is enough
- keep the first render cut always-expanded and read-only:
  - no collapse toggles
  - no selection affordance
  - no “show more” interaction in this subphase
- prefer a compact nested list or tree block below the parts list when both exist, and below the badge row when the file has hierarchy but no parts
- use the existing `hierarchyRows` caps from `7.4.1` as the first-pass containment story instead of adding another UI-side truncation system

### Exact First Code Cut

1. Audit `renderStagedImportStructureSummary(...)` in `src/app/panels/browserTreeMenus.tsx` and identify the exact insertion point inside the existing structure-summary block.
2. Add one small recursive or helper-backed render path for `summary.hierarchyRows` that outputs a compact read-only nested tree.
3. Keep the hierarchy tree separate from:
   - the `7.1` parts selection list when `partRows` exist
   - the flat label-chip fallback used when no richer list or tree treatment is available
4. Style the tree in `src/app/theme/surfaces/browser.css` so it reads cleanly inside dense staged cards without overpowering badges, parts, or settings.
5. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the tree appears only when truthfully available and remains distinct from the parts list.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change the hierarchy summary contract in this subphase
- do not make tree rows interactive
- do not widen into badge-text rewriting yet
- do not let tree rendering imply split support when `partRows` do not truthfully exist

### Checklist

- [x] render a compact read-only hierarchy tree in hierarchy-bearing staged cards
- [x] keep the hierarchy tree distinct from the split-parts list
- [x] render the tree from `hierarchyRows` rather than inferring hierarchy from broad booleans
- [x] keep staged import behavior unchanged
- [x] add focused Browser proof for tree rendering

### Verification Shape

Minimum verification for this subphase should cover:

- hierarchy-bearing staged files render a compact read-only tree
- hierarchy-absent staged files do not render a tree
- split-part rows still render through the parts-list treatment and are not replaced by the hierarchy tree
- no staged import behavior, preview behavior, or commit behavior changes land as part of the rendering pass

### Done Shape

- the staged import dialog can visibly explain internal file hierarchy through a compact tree instead of relying only on broad badges
- hierarchy-bearing files no longer need the user to infer structure from one or two labels alone

### Implementation Notes

- `src/app/panels/browserTreeMenus.tsx`
  - now renders a compact always-expanded hierarchy tree directly from `summary.hierarchyRows` inside the existing staged structure-summary owner
  - keeps the tree distinct from the shipped `7.1` parts selection list so split-ready files can truthfully show both treatments at once
  - still falls back to flat label chips only when no richer parts-list or hierarchy-tree treatment is available
- `src/app/theme/surfaces/browser.css`
  - now styles the hierarchy tree as a compact nested read-only block with subdued indentation and node markers so it reads as structure, not as another selectable list
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves:
    - hierarchy-only structured files render the hierarchy tree without a parts list
    - split-ready files can render both the hierarchy tree and the parts list
    - flat files do not render a hierarchy tree

## [x] `Import-4 Phase 7.4.3 - Badge Truth And Helper-Copy Enrichment`

### Purpose

- tighten the staged structure wording around hierarchy-bearing files so the dialog reads more honestly once the hierarchy tree exists

### Goal

- reduce over-broad `Multiple objects` messaging where the file may be structured but still effectively one meaningful object
- add clearer helper copy or companion wording for structured files without weakening split-ready clarity

### Locked Direction

- keep this subphase copy-and-badge-only:
  - no new hierarchy-tree data work
  - no new tree rendering behavior
  - no import behavior changes
- preserve split-ready clarity for files that truly have part rows or true multi-object import meaning
- prefer companion clarification over broad wording churn if the truth is mixed

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css` only if tiny companion treatment or helper-copy spacing changes are needed
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - currently builds staged structure badges from broad booleans like `hasMultipleObjects`, `hasHierarchy`, and `hasParts`
  - specifically still maps:
    - `hasMultipleObjects -> Multiple objects`
    - `hasHierarchy -> Hierarchy`
    - `hasParts -> Parts`
    - fallback -> `Flat file`
  - is the strongest seam for refining how those badges and one small companion explanatory line read once hierarchy-tree rendering exists
  - should stay inside the existing structure-summary owner rather than introducing another status panel or helper region
- the newly shipped hierarchy tree from `7.4.2`
  - means the next pass no longer needs broad badges alone to explain structured files
  - allows `7.4.3` to make badge wording stricter and more honest for hierarchy-bearing single-object files
- the current user confusion around files like `hub.step` is mainly wording truth, not raw loader failure
- `src/app/panels/BrowserPanel.test.tsx`
  - already has the new hierarchy-tree proof seam from `7.4.2`
  - should be extended here so the next pass proves:
    - structured hierarchy-bearing files no longer over-read as split-ready just because hierarchy exists
    - split-ready files still clearly read as split-ready
    - the helper copy stays compact and only appears when it adds real truth

### First-Pass Decisions

- only change wording where the new tree meaning justifies it
- keep badge truth compact and scanable
- if a broad badge remains, pair it with clearer helper copy rather than pretending the structure is simpler than it is
- keep split-ready files visually distinct from merely structured files
- prefer one minimal helper line over several new micro-labels
- keep the first wording pass deterministic from current summary truth:
  - `hasParts`
  - `hasHierarchy`
  - `hasMultipleObjects`
  - `hierarchyRows`
  - `labels`
- do not widen this into a general terminology redesign for every import format; only tighten the currently misleading staged reads

### Exact First Code Cut

1. Audit the current badge array in `renderStagedImportStructureSummary(...)` in `src/app/panels/browserTreeMenus.tsx`.
2. Refine the hierarchy-bearing wording so structured files read more honestly once the tree is visible, especially where `hasHierarchy` is true but `hasParts` is false.
3. Add or adjust one compact helper line inside the existing structure-summary block if that is the clearest way to distinguish structured files from truly split-ready files.
4. Keep split-ready files clearly distinct when `partRows` truthfully exist.
5. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the new wording remains truthful for both structured single-object files and split-ready files.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change the staged structure-inspection contract in this subphase
- do not widen into generic import-mode behavior
- do not collapse hierarchy and split-parts concepts into one label set
- do not turn the copy pass into a broader staged-card redesign
- do not remove the hierarchy tree just because the wording gets clearer
- do not introduce interactive hierarchy affordances, part-selection behavior, or preview behavior as part of the wording pass

### Checklist

- [x] reduce over-broad hierarchy-bearing `Multiple objects` messaging where needed
- [x] add clearer companion copy for structured files
- [x] preserve split-ready clarity
- [x] add focused Browser proof for the wording truth pass

### Verification Shape

Minimum verification for this subphase should cover:

- a structured hierarchy-bearing file can read as structured without over-implying split support
- a split-ready file still clearly reads as split-ready
- helper copy remains compact and truthful

### Implementation Notes

- `src/app/panels/browserTreeMenus.tsx`
  - now treats hierarchy-bearing files without split parts as `Structured file` instead of the older over-broad `Multiple objects` read
  - adds one compact helper line:
    - `Structured hierarchy detected. No split parts detected.`
  - keeps true split-ready files on the stronger `Multiple objects`, `Hierarchy`, and `Parts` read when `partRows` truthfully exist
  - also retires the leftover flat label-chip fallback under split-part rows so the parts list remains the only rich list in that case
- `src/app/theme/surfaces/browser.css`
  - now styles the new structured-file helper line inside the existing summary block
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves hierarchy-only files read as structured without over-implying split support
  - still proves split-ready files keep the stronger multi-object read and distinct parts-list treatment
- no staged import behavior, preview behavior, or commit behavior changes land as part of the copy pass

### Done Shape

- the hierarchy tree is paired with clearer badge and helper wording
- structured files and split-ready files read as more distinct concepts in the staged import dialog

## [x] `Import-4 Phase 7.4.4 - True Tree Connector And Root-Line Fidelity`

### Purpose

- make the shipped hierarchy tree read more like the true rooted tree shape instead of only a compact nested list

### Goal

- improve the staged hierarchy tree so the visual treatment communicates:
  - which rows share a parent
  - how child rows connect back toward the root
  - where the currently visible branch sits inside the larger rooted structure
- keep that improvement read-only and staged-card-local

### Locked Direction

- keep this subphase visual-only:
  - no new hierarchy contract work
  - no new badge wording work
  - no import behavior changes
  - no tree interaction changes
- preserve the existing truthful hierarchy content from `hierarchyRows`
- improve connector clarity without turning the staged card into a full Browser-tree clone
- keep the tree compact enough for dense staged cards even when connector lines become more faithful

### Expected Implementation Shape

- update `src/app/theme/surfaces/browser.css`
- update `src/app/panels/browserTreeMenus.tsx` only if tiny structural wrappers are genuinely needed for better connector ownership
- update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- the current shipped tree already renders truthful nested rows, but the visual linework is still a simplified nested-list treatment
- the next improvement should focus on connector ownership and rootward continuity rather than changing what rows exist
- `src/app/panels/browserTreeMenus.tsx`
  - currently renders the hierarchy tree through one nested `ul/li` structure:
    - `.BrowserImportDialogHierarchyTreeList`
    - `.BrowserImportDialogHierarchyTreeItem`
    - `.BrowserImportDialogHierarchyTreeRow`
    - `.BrowserImportDialogHierarchyTreeNode`
    - `.BrowserImportDialogHierarchyTreeLabel`
  - means the next pass already has a stable rooted-tree DOM to style against before adding more wrappers
- `src/app/theme/surfaces/browser.css`
  - is the strongest seam for:
    - vertical connector continuation
    - elbow or branch connectors
    - clearer root-to-child visual continuity
  - already owns:
    - per-depth left-border continuation
    - node-dot styling
    - the separate `Hierarchy Tree` title and scroll-region containment
  - should do most of the work if possible so the render seam stays stable
- the shipped scroll region from `7.4.2`
  - means connector work must still read clearly when only part of a deeper tree is visible inside the `100px` content area
- `src/app/panels/browserTreeMenus.tsx`
  - should only widen if the current nested-list DOM is not enough to support truthful connector styling
- `src/app/panels/BrowserPanel.test.tsx`
  - should add one focused structural proof that the refined tree still renders through the same hierarchy seam, remains distinct from the parts list, and preserves the current title-plus-scroll-region ownership

### First-Pass Decisions

- prefer a CSS-first connector improvement
- keep the rendered hierarchy order unchanged
- do not add expand/collapse behavior just because the connectors become more tree-like
- keep the title, scroll region, and hierarchy content ownership from the shipped `7.4.2` follow-ups
- keep the node dot or another similarly compact row anchor unless a different anchor clearly improves rooted-tree readability without adding noise
- if tiny wrapper spans or pseudo-element hooks are needed, add only the smallest markup support required for truthful connector ownership
- if the first pass cannot show full rootward continuity cleanly in all depths, bias toward the clearest truthful connector read for the first several visible levels instead of forcing a noisy overbuilt solution

### Exact First Code Cut

1. Audit the current hierarchy-tree DOM and connector styling in `src/app/panels/browserTreeMenus.tsx` and `src/app/theme/surfaces/browser.css`, especially the current per-depth left-border continuation.
2. Refine the hierarchy-tree connector treatment so child rows visually read as branches of one rooted tree, with clearer lines back toward parent levels and a more legible rootward relationship.
3. Keep the refined connector treatment compatible with the existing title-plus-scroll-region shell and dense staged-card layout.
4. Only add tiny markup hooks in `src/app/panels/browserTreeMenus.tsx` if the existing nested-list DOM cannot support the rooted-tree connector read cleanly through CSS alone.
5. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the tree still renders through the same summary seam and remains distinct from the parts list after the visual-fidelity pass.

### Likely Files

- `src/app/theme/surfaces/browser.css`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change `hierarchyRows`
- do not widen into badge-copy changes
- do not add tree interaction or selection behavior
- do not collapse this into a larger staged-card redesign

### Checklist

- [x] make the hierarchy tree read more like the true rooted tree shape
- [x] show clearer connector lines back toward the root
- [x] preserve readability in dense staged cards
- [x] keep staged import behavior unchanged
- [x] add focused Browser proof for the visual-fidelity pass

### Verification Shape

Minimum verification for this subphase should cover:

- hierarchy trees still render through the same staged summary seam
- the connector treatment improves rooted-tree readability without breaking dense card containment
- the tree remains distinct from the parts list
- no staged import behavior, preview behavior, or commit behavior changes land as part of the visual-fidelity pass

### Done Shape

- the staged hierarchy tree reads more like a true rooted structure, not just a compact nested list
- users can more easily see how visible child rows connect back toward the root

### Implementation Notes

- `src/app/panels/browserTreeMenus.tsx`
  - now adds only tiny rooted-tree hooks on hierarchy items:
    - `data-depth`
    - `data-has-children`
  - keeps the shipped hierarchy summary seam, title, and scroll-region ownership intact
- `src/app/theme/surfaces/browser.css`
  - now gives the hierarchy tree a stronger rooted read by combining:
    - clearer per-depth vertical continuation
    - horizontal branch connectors from parent guides into child rows
    - slightly stronger anchors for rows that own children
  - preserves dense staged-card containment and the existing `100px` scroll region
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves the hierarchy tree still renders inside the same scroll region and exposes the rooted-tree item hooks without collapsing into the parts-list treatment

## [ ] `Import-4 Phase 7.4.5 - Final Cleanup And Regression Proof`

### Purpose

- close out the hierarchy-tree lane with one durable proof shape and only the smallest cleanup directly retired by the shipped tree treatment

### Goal

- lock one high-signal staged hierarchy-tree proof
- remove any narrow residue directly retired by the new hierarchy-tree and wording work
- close the lane honestly without widening into unrelated import polish

### Locked Direction

- keep this subphase cleanup-and-proof-only
- prefer deleting residue over layering new abstraction
- avoid any new hierarchy behavior, rendering redesign, or import contract changes

### Expected Implementation Shape

- update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/panels/browserTreeMenus.tsx` or `src/app/theme/surfaces/browser.css` only if one real retired seam remains

### Implementation-Prep Read

- `src/app/panels/BrowserPanel.test.tsx`
  - should become the main closeout surface for one integrated high-signal hierarchy-tree proof
- `src/app/panels/browserTreeMenus.tsx`
  - may still hold small transitional wording or branch residue from the staged hierarchy rollout
- `src/app/theme/surfaces/browser.css`
  - may still hold one or two temporary hierarchy styles that can be reduced once the final treatment is proven

### First-Pass Decisions

- keep the closeout proof behavior-focused rather than implementation-detail-heavy
- only remove residue that is clearly retired by the new hierarchy-tree treatment
- do not let this subphase widen into a broader `Phase 7` visual cleanup pass

### Exact First Code Cut

1. Audit the staged hierarchy-tree path for any narrow transitional residue.
2. Tighten one integrated BrowserPanel proof that covers:
   - hierarchy-tree rendering
   - structured-file wording truth
   - continued split-part clarity
3. Remove only the smallest clearly retired UI or test residue left by earlier `7.4.x` cuts.
4. Mark the hierarchy-tree lane complete once the proof and cleanup are in place.

### Likely Files

- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`

### No-Widening Rule

- do not add new hierarchy capabilities
- do not widen into import settings, preview, or commit behavior
- do not rewrite neighboring `Phase 7` work just because this closeout touches the same file

### Checklist

- [ ] lock one high-signal Browser proof for the hierarchy-tree lane
- [ ] remove narrow retired residue if present
- [ ] keep behavior unchanged outside the shipped hierarchy-tree treatment
- [ ] close out `Import-4 / Phase 7.4`

### Verification Shape

Minimum verification for this subphase should cover:

- the final Browser proof covers structured hierarchy-bearing files and split-ready files together
- no behavior outside the hierarchy-tree lane regresses
- any cleanup stays narrow and directly tied to the shipped hierarchy-tree work

### Done Shape

- `Import-4 / Phase 7.4` is fully closed out
- the staged hierarchy-tree truth lane has durable proof and minimal residue

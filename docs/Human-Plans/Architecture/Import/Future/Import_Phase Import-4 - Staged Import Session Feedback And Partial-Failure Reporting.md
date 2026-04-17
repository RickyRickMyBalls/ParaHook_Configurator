# `Import-4` - `Staged Import Session Feedback And Partial-Failure Reporting`

## Doc Header

### Doc History
22. 2026-04-16: Added the standalone future execution doc `Import-4 / Phase 7 - UI Cleanup And Polish`, giving the staged import family one later home for smaller visual cleanup tasks after the heavier session-truth and preview lanes, with the first owned task now explicitly the `Multiple Objects` / `Parts` readability cleanup
21. 2026-04-16: Split the later `Import-4 / Phase 6 - Object Preview Viewport And Resizable Three-Column Layout` lane into its own standalone future execution doc so the object preview viewport and three-column resize work can now grow through smaller `6.1` through `6.4` subphases without overloading this parent staged-session feedback record
20. 2026-04-16: Prepped `Import-4 / Phase 5 - Narrow Cleanup And Regression Pass` for implementation by grounding the closeout pass in the now-shipped staged layout polish, per-file inspection feedback, per-file acceptance result contract, and in-dialog recovery messaging so the final `Import-4` cut can stay tightly focused on cleanup, wording, and regression proof instead of widening into new import features
19. 2026-04-16: Implemented `Import-4 / Phase 4 - Dialog Recovery And Session Messaging` by keeping the staged dialog open after partial or failed acceptance, adding one compact mixed-result summary plus row-local recoverable-failure treatment for remaining staged files, and updating the primary action to read honestly on retry without widening into a second transcript or a broader import job system
18. 2026-04-16: Prepped `Import-4 / Phase 4 - Dialog Recovery And Session Messaging` for implementation by grounding the recovery pass in the newly shipped staged per-file commit-result contract, the controller's new full-success-only close behavior, and the current staged row plus action-button UI seams so mixed-result acceptance can stay open, summarize what happened, and keep failed rows understandable without widening into a second transcript or a generic import job system
17. 2026-04-16: Implemented `Import-4 / Phase 3 - Add-To-Project Partial Result Contract` by widening staged acceptance from `anchor row id or null` into one explicit per-file result contract, preserving successful commits during mixed-result acceptance, keeping only failed staged files available for later recovery, and tightening both store and Browser proof without widening into final dialog summary copy
16. 2026-04-16: Prepped `Import-4 / Phase 3 - Add-To-Project Partial Result Contract` for implementation by grounding the next staged-session cut in the live `commitStagedImportDraft(): string | null` seam, the controller's current non-null means close behavior, and the existing staged store plus Browser proof so mixed-result acceptance can get one explicit per-file result contract before dialog recovery and messaging widen the surface
15. 2026-04-16: Added `Import-4 / Phase 6 - Object Preview Viewport And Resizable Three-Column Layout`, giving the staged import dialog one later home for per-object `Load into preview viewport`, an orbitable object preview surface in a new third column, and draggable vertical dividers so settings, preview organization, and object preview can coexist without freezing one width split
14. 2026-04-16: Implemented `Import-4 / Phase 2 - Per-File Staged Inspection Feedback` by upgrading staged inspection failure rows from one thin unavailable badge plus raw note into a clearer row-local failure block with actionable pre-commit helper copy, while keeping the raw thrown inspection message visible, preserving honest loading versus ready states, and tightening Browser proof around the richer staged failure treatment
13. 2026-04-16: Prepped `Import-4 / Phase 2 - Per-File Staged Inspection Feedback` for implementation by grounding the next staged-session pass in the existing `structureInspection.status` owner model, the current `Reading structure...` plus `Structure unavailable` row UI, and the focused BrowserPanel staged inspection proof seams so richer pre-commit per-file inspection feedback can land without widening into commit-result or recovery behavior
12. 2026-04-16: Updated this parent `Import-4` record so `Phase 0.1` and `Phase 0.2` now read as shipped after the standalone split-import correctness and performance docs were fully implemented, leaving the remaining mainline work focused on staged per-file inspection feedback, mixed-result acceptance, dialog recovery, and the final regression pass
11. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 0.2 - Shared Source Load And Child Derivation For Split Imports.md`, then updated this parent `Import-4` record so the now-correct but still-slow staged split-import path has one dedicated follow-on performance owner beside the earlier `Phase 0.1` correctness repair lane
10. 2026-04-16: Split `Import-4 / Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair` into its own standalone future execution doc with subphases `0.1.1` through `0.1.4`, then reduced this parent `Import-4` record to a pointer so the broken staged split-import lane has one dedicated small-step owner instead of duplicating implementation detail inside the broader staged-session feedback doc
9. 2026-04-16: Tightened `Import-4 / Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair` so the preferred repair direction is now a first-class part-backed split-import load contract for `.glb` children instead of reusing exploded-reference semantics for staged multi-object imports
8. 2026-04-16: Added `Import-4 / Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair`, making the broken staged `Multiple Objects In 1 Component` path the next explicit import-family owner before the broader staged-session feedback phases continue
7. 2026-04-16: Tightened the shipped `Import-4 / Phase 1 - Preview Browser Column And Scroll Polish` layout shell so the dialog body now owns the available height, the full left settings stack scrolls as one dedicated region, the old staged-files nested scrollbar is retired, and the preview Browser remains clipped inside the staged import window with its own local tree scrollbar
6. 2026-04-16: Tightened the shipped `Import-4 / Phase 1 - Preview Browser Column And Scroll Polish` dialog cap again so the staged import window now preserves an explicit `100px` top and bottom viewport buffer, giving the full-height preview Browser stronger clearance from the model viewport title strip and docked console on dense sessions
5. 2026-04-16: Tightened the shipped `Import-4 / Phase 1 - Preview Browser Column And Scroll Polish` layout cap so the staged import window now preserves an explicit `50px` top and bottom viewport buffer, preventing the full-height preview Browser from stepping on the model viewport title strip and docked console when the dialog fills vertically
4. 2026-04-16: Implemented `Import-4 / Phase 1 - Preview Browser Column And Scroll Polish` by widening the staged import dialog into a real two-column shell, moving the preview Browser into its own full-height right-side column with a dedicated local scroll region, preserving the full-width bottom action row, and adding focused Browser proof for the new layout structure without changing staged import behavior
3. 2026-04-16: Prepped `Import-4 / Phase 1 - Preview Browser Column And Scroll Polish` for implementation by grounding the UI pass in the live one-column `BrowserImportDialog` composition, the current preview-tree CSS without local overflow treatment, and the existing BrowserPanel staged-import proof seam so the first `Import-4` cut can stay narrowly focused on layout, scrollbar behavior, and responsive fallback only
2. 2026-04-16: Reframed `Import-4` so its first phase is now a dedicated `Preview Browser Column And Scroll Polish` UI pass, locking that the preview Browser should move into its own full-height right-side column with a local scrollbar before the later staged-session feedback and partial-failure work begins
1. 2026-04-16: Created this standalone future phase doc for `Import-4`, turning the next staged-import follow-on into a dedicated import-family lane for honest per-file session feedback, partial `Add To Project` results, and in-dialog recovery instead of leaving staged-import failure handling as loose future notes after `Import-3` shipped

### Purpose

This doc defines the next import-family phase after the shipped staged import window.

Use it to answer:
- how the shipped import dialog should be polished before deeper feedback work lands
- how staged import should communicate per-file inspection and commit failures
- how `Add To Project` should behave when a staged session partially succeeds
- how successful and failed staged files should be handled after one acceptance attempt
- how much feedback should live in the dialog versus Browser and Console surfaces
- what should stay out of scope while hardening the staged import session

### Why This Phase Exists

`Import-3` shipped the real staged import window:
- supported file intake
- structure review
- import-mode choice
- preview Browser organization
- up-axis and scale or units alignment
- explicit `Add To Project`

That lane solved the biggest ownership problem:
- imported files no longer have to become project content before review

But the shipped session is still mostly success-shaped.

It also still has one obvious layout weakness:
- the preview Browser is visually compressed at the bottom of the left-side settings stack
- it does not yet have its own full-height column
- it does not yet have the same strong local overflow treatment the staged file list already has

The current code-backed read is:
- `src/viewer/referenceStructureInspection.ts`
  - already returns honest pre-add structure summaries
  - already throws real error messages when staged structure reads fail
- `src/app/panels/browserTreeMenus.tsx`
  - already shows `Reading structure...` and `Structure unavailable`
  - already has the strongest visible seam for staged per-file messaging
  - already owns the current one-column dialog composition where the preview Browser sits below accepted-placement controls
  - does not yet provide a fuller staged-session result read after `Add To Project`
- `src/app/store/useAppStore.ts`
  - already owns the staged draft and the accepted commit path
  - `commitStagedImportDraft()` currently returns one anchor row id or `null`
  - does not yet return a structured per-file session result that can explain mixed success and failure
- `src/app/theme/surfaces/browser.css`
  - already owns the staged dialog shell, stacked meta cards, staged-file scroll region, and preview Browser styling
  - is the strongest seam for moving preview organization into a dedicated column and adding a local preview scrollbar without changing import behavior
- `src/app/panels/useBrowserPanelController.ts`
  - currently closes the dialog after any non-null staged commit result
  - does not yet keep failed staged files open for recovery when only part of the session succeeds
- `src/app/components/ViewerHost.tsx`
  - already keeps accepted imported-reference load failures honest after commit
  - is not the right owner for staged-session failure reporting before or during acceptance

So the next honest product gap is not another import setting.

The next honest product gaps are:
- a narrow regression pass for the currently broken `Multiple Objects In 1 Component` staged mode
- a follow-on performance lane so the repaired split-import mode can stop reparsing the same `.glb` once per child
- a cleaner layout where review settings and preview organization read as two distinct working areas
- a later object preview surface for loading and orbiting one staged object inside the dialog before commit
- clearer staged inspection failure feedback
- honest partial `Add To Project` results
- recovery inside the same staged session when some files succeed and others do not

## Doc Body

## [ ] `Import-4` - `Staged Import Session Feedback And Partial-Failure Reporting`

### Summary

#### Purpose:
- polish the shipped staged import window so the preview Browser has the right visual weight first, then harden the deeper feedback and recovery behavior behind that cleaner layout

#### Target result:
- the preview Browser moves into its own full-height content column instead of living as the last card in the left settings stack
- the preview Browser gets its own local scrollbar so large staged organizations stay readable without stretching the whole dialog awkwardly
- one staged object can load into a dedicated preview viewport inside the dialog for orbit inspection before commit
- the dialog can grow into three working columns when the object preview viewport is active:
  - left review and settings
  - middle preview Browser organization
  - right object preview viewport
- vertical divider bars can let the user resize those three working areas during the open staging session
- staged files can show richer per-file inspection failures without pretending the file structure is simply absent
- `Add To Project` can report mixed results honestly instead of reading like all-or-nothing success
- successfully committed staged files can leave the draft while failed staged files remain available for retry, removal, or correction
- Browser and Console feedback can summarize the session without replacing the per-file staged truth inside the dialog
- true failures stay visible instead of being hidden behind generic success text or silent dialog close

#### Scope statement:
- `Import-4` means staged dialog polish plus staged-session feedback and partial-failure handling for the shipped `Import Files...` flow
- `Import-4` does not mean new file formats, drag-and-drop intake, material workflows, or a generalized background import job system

### Current State

After shipped `Import-3`, the import family now has:

- one shipped `.obj` batch lane
- one shipped staged import-window lane
- one still-open direct-row compatibility parity lane

The staged session itself now behaves like this:

- structure inspection can already land in:
  - `idle`
  - `loading`
  - `error`
  - `ready`
- the dialog already shows:
  - `Reading structure...`
  - `Structure unavailable`
  - the thrown inspection error message
- accepted imported-reference load failures now stay honest after the Phase 12 blob-lifetime repair

But the remaining session gaps are:

- the preview Browser does not yet have its own full-height column in the dialog body
- the preview Browser does not yet have a dedicated local scrollbar
- staged per-file failures do not yet have a richer visible recovery model
- `commitStagedImportDraft()` does not yet expose structured per-file commit results
- the controller still treats any non-null commit as a dialog-closing success path
- the user cannot yet stay in the staged session with only the failed files still present after a mixed-result acceptance attempt

### Locked Direction

- keep `Import-4` inside the shipped staged import dialog instead of inventing a second import surface
- make the preview Browser a first-class working area by giving it its own column before widening the deeper feedback contract
- keep the action row spanning the full dialog width below both columns
- on narrower dialog widths, allow the layout to collapse back to one column instead of forcing a cramped two-column shell
- prefer truthful per-file session feedback over one generic success or failure banner
- treat partial success as a first-class staged import result:
  - successful files may commit
  - failed files may remain staged
- keep true parser or loader failures visible and actionable
- let Browser and Console summarize the result, but keep the dialog as the main place where staged-session truth lives
- preserve the explicit `Add To Project` contract instead of turning this lane into background auto-accept behavior

### Non-Goals

`Import-4` should not expand into:
- drag-and-drop import
- `.obj` sidecar material and texture handling
- arbitrary new file-format support
- cancellable background job infrastructure
- generalized asset library or import history systems
- deeper staged hierarchy editing beyond the already-shipped preview Browser organization

### Internal Phase Ladder

The cleanest staged-feedback ladder is:

1. `Import-4 Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair`
2. `Import-4 Phase 0.2 - Shared Source Load And Child Derivation For Split Imports`
3. `Import-4 Phase 1 - Preview Browser Column And Scroll Polish`
4. `Import-4 Phase 2 - Per-File Staged Inspection Feedback`
5. `Import-4 Phase 3 - Add-To-Project Partial Result Contract`
6. `Import-4 Phase 4 - Dialog Recovery And Session Messaging`
7. `Import-4 Phase 5 - Narrow Cleanup And Regression Pass`
8. `Import-4 Phase 6 - Object Preview Viewport And Resizable Three-Column Layout`
9. `Import-4 Phase 7 - UI Cleanup And Polish`

Reason:
- the staged `Multiple Objects In 1 Component` option is already user-visible and currently not behaving correctly, so the next honest step is to inspect and repair that path before treating the rest of the staged-session hardening ladder as the mainline gap
- once the split-import mode is correct, the next honest follow-on for that same user-visible path is performance, because the repaired mode still reparses the shared `.glb` per child instead of using one shared source load
- the preview Browser already matters to the shipped import result, so it should gain the right layout and overflow treatment before deeper feedback complexity lands on top of the old cramped shell
- the staged per-file failure read should become clearer before the final commit result tries to build on it
- the store result contract should exist before dialog copy and recovery behavior are finalized
- the final pass should stay narrow around cleanup and regression hardening once the new session contract is visible
- the object preview viewport should land later as additive preview tooling once the staged feedback and recovery owners are stable, so it does not compete with the earlier dialog-hardening phases for layout and ownership
- the later polish lane should stay split out after the heavier behavior work, so smaller user-fed cleanup tasks can land one by one without making the main `Import-4` doc noisy

## [x] `Import-4` - `Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair`

- inspect and repair the broken staged `Multiple Objects In 1 Component` path before the broader staged-session feedback phases continue
- keep the preferred repair direction as:
  - one first-class part-backed split-import load contract for committed `.glb` child rows
  - not a reuse of exploded-reference semantics as the long-term default
- break the work into standalone small-step subphases so Codex can execute it safely one cut at a time

Execution doc:
- `Future/Import_Phase Import-4 Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair.md`

## [x] `Import-4` - `Phase 0.2 - Shared Source Load And Child Derivation For Split Imports`

- keep the repaired staged split-import mode truthful while making it faster
- prefer a `load once, derive many children` viewer-owned path instead of repeated full-asset child parses
- keep the direct split-import performance lane separate from the broader staged-session feedback and partial-failure work

Execution doc:
- `Future/Import_Phase Import-4 Phase 0.2 - Shared Source Load And Child Derivation For Split Imports.md`

## [x] `Import-4` - `Phase 1 - Preview Browser Column And Scroll Polish`

### Purpose

- give the shipped preview Browser enough space and local overflow behavior to feel like a real organization surface instead of the last compressed card in the left-side settings stack

### Goal

- move the preview Browser into its own full-height right-side column inside the dialog body and add a local scrollbar to the preview tree

### Locked Direction

- keep this phase UI-only:
  - no import-behavior changes
  - no staged-state contract changes
  - no commit-result logic changes
- split the dialog body into two working columns:
  - left column for staged file review and import settings
  - right column for preview Browser organization
- make the right column stretch to the full content-body height
- keep the preview Browser header and actions at the top of that right column
- keep scrolling local to the preview tree region instead of making the whole dialog body scroll awkwardly
- keep the bottom action row spanning the full dialog width below both columns
- prefer a responsive fallback where narrow widths collapse back to one column instead of forcing a broken side-by-side layout

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- add focused Browser proof around:
  - preview Browser column rendering
  - local preview overflow behavior
  - stable action-row placement

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - currently renders the full `BrowserImportDialog` body as one vertical stack under `.BrowserImportDialogBody`
  - currently places:
    - supported file types
    - Browser intake row
    - staged file review
    - landing target
    - accepted placement
    - `BrowserImportPreviewTree`
    in one column
  - is the strongest seam for splitting that body into:
    - a left review-and-settings column
    - a right preview Browser column
  - already keeps the bottom action row outside the body, which makes the full-width action-bar requirement easier to preserve
- `src/app/theme/surfaces/browser.css`
  - currently defines:
    - `.BrowserImportDialog` at `width: min(460px, calc(100vw - 48px))`
    - `.BrowserImportDialogBody` as `display: flex; flex-direction: column`
    - `.BrowserImportDialogStagedListScrollRegion` with the existing local scrollbar treatment
    - `.BrowserImportDialogPreviewTree` as a simple bordered container with no dedicated local overflow behavior
  - is the main seam for:
    - widening the dialog
    - creating the two-column body layout
    - giving the preview Browser column its own height behavior
    - reusing the staged-list scrollbar language for the preview tree
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged import journey, preview Browser presence, and truthful split-row rendering
  - does not yet assert anything about:
    - two-column dialog structure
    - preview-specific scroll container presence
    - responsive layout hooks or class-level structure
  - is the right seam for focused proof that the preview Browser now renders inside its own dedicated column and scroll region without widening into visual snapshot testing

### First Pass Decisions

- keep `Phase 1` strictly UI and layout only
- do not change:
  - staged draft state
  - preview organization data
  - import settings
  - commit behavior
- make the preview Browser visually first-class without turning it into a second permanent Browser owner
- widen the dialog enough to support two real working areas instead of cramming the existing one-column stack
- preserve the existing top header and bottom action row structure
- keep scroll local:
  - staged files keep their existing local scroll region on the left
  - preview Browser gains its own local scroll region on the right
- use responsive fallback instead of forcing side-by-side layout at narrow widths

### Implementation Spec

#### Exact First Code Cut

1. Refactor `BrowserImportDialog` in `src/app/panels/browserTreeMenus.tsx` so the body becomes:
   - intro copy above the columns
   - one two-column content area below the copy
   - left column containing:
     - supported file types
     - Browser intake
     - staged files
     - landing target
     - accepted placement
   - right column containing:
     - preview Browser header
     - preview Browser hint
     - preview tree scroll region
2. Update `src/app/theme/surfaces/browser.css` to:
   - widen the dialog shell to a desktop-friendly width
   - convert `.BrowserImportDialogBody` from one-column stack into the new shell that supports the intro copy plus the two-column content area
   - add one dedicated preview-column container
   - add one dedicated preview-tree scroll region using the same local-scroll language already used for staged files
   - keep the action row full-width below both columns
   - add a narrow-width fallback back to one column
3. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that asserts:
   - the preview Browser is rendered in its own dedicated column/container
   - the preview tree has its own scroll-region element
   - the existing staged import action row still renders separately below the dialog body

#### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

#### No-Widening Rule

- do not add any new import settings
- do not change staged import commit or cancel behavior
- do not widen into per-file feedback, partial-failure contract work, or session recovery yet
- do not redesign the preview Browser row semantics or drag behavior during this phase
- do not turn this UI pass into a generalized Browser theme cleanup outside the import dialog

#### Implementation Risks

- widening the dialog without giving the preview column a true height anchor, which would still leave the preview Browser visually cramped
- making the whole dialog scroll instead of keeping overflow local to the staged list and preview tree
- breaking the current action-row placement by accidentally nesting it inside the new column layout
- overfitting the desktop layout and leaving narrow-width behavior broken or awkward
- coupling layout changes to staged-import data flow when this pass should stay presentation-only

#### Checklist

- [ ] split the import dialog body into left review-settings and right preview-browser columns
- [ ] widen the dialog enough for the two-column layout to read intentionally on desktop
- [ ] add a local scrollbar to the preview Browser tree
- [ ] keep the bottom action row full-width and visually separate from the two-column body
- [ ] add a narrow-width fallback back to one-column stacking
- [ ] add focused Browser proof for the new preview column and scroll-region structure

#### Verification Shape

Minimum verification for this phase should cover:

- the import dialog still opens and renders normally after the layout refactor
- the preview Browser now lives in its own dedicated right-side column on normal desktop widths
- the preview tree has a dedicated local scroll region
- the staged file list keeps its own local scroll region and remains readable in the left column
- the `Add To Project` and `Cancel` action row still spans the full dialog width below the content area
- the layout can collapse back to one column at narrower widths without losing the preview Browser surface

#### Done Shape

`Phase 1` is done when:

- the staged import dialog no longer reads like one long settings stack with a compressed preview at the bottom
- the preview Browser feels like a real working area with its own column and local scrollbar
- the dialog remains readable on both wider and narrower widths
- no staged-import behavior changed beyond the intended layout and overflow polish

#### Implemented Result

- the staged import dialog body now renders as two working columns on normal desktop widths, keeping staged file review and import settings on the left while moving the preview Browser into a dedicated right-side column
- the preview Browser now has its own local scroll region so larger staged organizations can stay inside the preview area instead of compressing the rest of the dialog
- the bottom `Add To Project` and `Cancel` action row still renders separately below the content area, preserving the existing staged acceptance flow
- focused Browser proof now asserts the dedicated preview column, preview scroll-region presence, and the continued separation of the full-width action row from the dialog content layout

## [x] `Import-4` - `Phase 2 - Per-File Staged Inspection Feedback`

### Purpose

- strengthen the per-file failure read inside the staged dialog before the user ever clicks `Add To Project`

### Goal

- make staged inspection errors read as actionable per-file feedback instead of only one thin unavailable badge plus raw note text

### Locked Direction

- keep this phase focused on staged inspection feedback only
- reuse the existing `structureInspection.status` owner model
- keep the structure summary honest:
  - no fake hierarchy
  - no fake successful structure read when the inspection really failed
- do not widen into final commit behavior yet

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- keep using the existing staged inspection error message seam
- add focused Browser proof around richer per-file staged inspection feedback

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - already owns one honest staged inspection status model per file:
    - `idle`
    - `loading`
    - `error`
    - `ready`
  - already preserves the thrown inspection `errorMessage` on the staged file record
  - this means `Phase 2` does not need a new store contract first; the stronger gap is presentation and wording
- `src/app/panels/browserTreeMenus.tsx`
  - already renders:
    - `Reading structure...`
    - `Structure unavailable`
    - the raw staged inspection error note
  - already has the strongest row-local seam for making a failed staged file read as:
    - inspection failure
    - still staged
    - still removable or ignorable
    - not secretly successful
  - this is the primary owner for the richer per-file feedback treatment
- `src/app/theme/surfaces/browser.css`
  - already styles the staged row structure badges, labels, and notes
  - is the strongest seam for adding richer error emphasis and any lightweight row-local helper treatment without redesigning the whole dialog
- `src/app/panels/BrowserPanel.test.tsx`
  - already has focused staged inspection state coverage near:
    - `Reading structure...`
    - `Structure unavailable`
    - row-local error message rendering
  - is the best place to tighten proof for richer staged inspection feedback without widening into acceptance or post-commit flow tests

### First Pass Decisions

- keep `Phase 2` pre-commit-only:
  - no `Add To Project` result changes
  - no partial-success contract changes
  - no dialog recovery behavior changes after acceptance
- preserve the honest inspection model:
  - failed inspection is still failed inspection
  - do not invent fake structure summaries when inspection could not complete
  - do not silently hide the underlying error note
- improve readability rather than inventing a new workflow:
  - clearer row-local failure label
  - clearer helper copy about what the user can still do with the file
  - stronger visual distinction from the successful summary state
- keep success rows and loading rows lightweight
- keep this phase local to staged file cards instead of adding global banners or console spam

### Exact First Code Cut

1. Update the staged-file row rendering in `src/app/panels/browserTreeMenus.tsx` so inspection failures read more clearly than the current thin `Structure unavailable` plus raw note combination.
2. Preserve the existing raw staged inspection `errorMessage`, but wrap it in clearer row-local copy that makes the state actionable before commit.
3. Add any lightweight supporting structure needed in `src/app/theme/surfaces/browser.css` so failed staged rows are visually distinct without implying the file is blocked from all further session actions.
4. Tighten `src/app/panels/BrowserPanel.test.tsx` so it explicitly proves:
   - loading state still reads as loading
   - error state now renders richer per-file staged inspection feedback
   - successful rows still render honest structure summaries instead of the failure treatment

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not change `commitStagedImportDraft()` return shape here
- do not keep failed files open after partial accept yet
- do not add dialog-level mixed-result banners
- do not turn inspection errors into retryable commit errors in this phase
- do not redesign the staged file card layout beyond what the richer inspection feedback directly needs

### Implementation Risks

- making inspection failures sound like successful structure reads with missing details
- hiding the raw parser or loader note so the feedback becomes friendlier but less truthful
- widening into acceptance or recovery behavior that belongs in `Phase 3` or `Phase 4`
- over-styling the failure treatment so it competes with the main import settings instead of clarifying one file row
- adding global messaging when the real owner should stay the affected staged file row

### Checklist

- [ ] strengthen row-local staged inspection failure messaging before commit
- [ ] preserve honest loading, error, and ready distinctions
- [ ] keep the raw staged inspection error note visible in the richer treatment
- [ ] add focused Browser proof for the improved per-file staged inspection feedback
- [ ] keep commit-result and recovery behavior out of scope

### Verification Shape

Minimum verification for this phase should cover:

- staged loading rows still read as `Reading structure...`
- staged error rows now render richer per-file inspection failure feedback
- the thrown inspection message still remains visible in the row
- ready rows still render honest structure summaries and do not receive the failure treatment
- no acceptance, partial-result, or recovery behavior changes land in this phase

### Done Shape

- a staged file with inspection failure reads clearly as a failed inspection before commit
- the dialog no longer relies on one thin unavailable badge plus raw note as the whole failure read
- the later partial-result phases can build on a clearer per-file staged truth instead of compensating for weak pre-commit feedback

#### Implemented Result

- staged inspection failure rows now render one dedicated row-local failure treatment instead of only:
  - `Structure unavailable`
  - raw note text
- the richer staged failure treatment now keeps three truths visible at once:
  - the inspection failed
  - the structure is unavailable before commit
  - the thrown staged inspection message is still visible verbatim
- loading rows still render `Reading structure...`
- ready rows still render honest structure badges and labels without receiving the failure treatment
- focused Browser proof now covers:
  - the richer staged inspection failure block
  - preserved raw thrown error visibility
  - unchanged successful summary treatment

## [x] `Import-4` - `Phase 3 - Add-To-Project Partial Result Contract`

### Purpose

- give staged acceptance one honest per-file result contract instead of only `anchor row id or null`

### Goal

- let `Add To Project` partially succeed without pretending the whole session either fully succeeded or fully failed

### Locked Direction

- keep successful committed imports as accepted project content
- keep failed staged files in the draft when recovery is still possible
- avoid rollback theater when some files already committed cleanly
- keep commit ownership in `src/app/store/useAppStore.ts`
- do not move this logic into viewer-only or Browser-only state

### Expected Implementation Shape

- update `src/app/store/useAppStore.ts`
- replace or widen the current staged commit return shape into one structured result contract
- include enough per-file result truth for the controller and dialog to act honestly after acceptance
- add focused store proof for mixed-result acceptance behavior

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - currently owns the staged draft and the accepted commit seam
  - `commitStagedImportDraft()` currently returns only:
    - one anchor row id
    - or `null`
  - that means the store cannot yet describe:
    - which staged files committed
    - which staged files failed
    - whether the result was full success or partial success
  - this is the primary owner for `Phase 3`
- `src/app/panels/useBrowserPanelController.ts`
  - currently treats any non-null staged commit result as a success path and closes the dialog
  - this is useful context for why `Phase 3` must land before `Phase 4`, but the main contract owner should still stay in the store
- `src/app/store/useAppStore.test.ts`
  - already proves:
    - empty draft returns `null`
    - accepted single-object imports commit only on explicit acceptance
    - accepted split imports preserve truthful part-backed committed results
  - is the strongest proof seam for widening the staged commit result without needing full UI integration first
- `src/app/panels/BrowserPanel.test.tsx`
  - already covers the staged import journey through `Add To Project`
  - should likely stay mostly unchanged in this phase unless one narrow Browser-facing expectation is needed after the store contract lands

### First Pass Decisions

- keep `Phase 3` contract-first:
  - define one explicit staged acceptance result shape in the store
  - do not finalize user-facing dialog recovery copy here
- preserve successful accepted content:
  - no rollback of files that already committed cleanly
  - partial success is real success for the successful files
- keep failed staged files available for later recovery:
  - `Phase 3` should make that result representable
  - `Phase 4` should decide how the dialog stays open and explains it
- keep the contract per-file and deterministic:
  - each staged file should have one explicit result entry
  - avoid global success/failure booleans without per-file truth
- preserve the current all-success path:
  - if every file commits cleanly, the result should still support the current anchor-row behavior

### Exact First Code Cut

1. Replace or widen the staged commit return shape in `src/app/store/useAppStore.ts` from `string | null` to one structured staged-acceptance result contract.
2. Make that result include enough truth for each staged file, such as:
   - staged file id
   - committed or failed outcome
   - committed anchor row id when one exists
   - failure message when one exists
3. Preserve the current successful commit behavior for files that already commit cleanly.
4. Keep failed staged files representable in the result instead of collapsing the whole acceptance into `null`.
5. Tighten `src/app/store/useAppStore.test.ts` so it proves:
   - full success still reports a clean committed result
   - empty draft still reports no acceptance result
   - mixed-result acceptance can be represented honestly without rolling back successful committed files

### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/useBrowserPanelController.ts`

### No-Widening Rule

- do not finalize dialog stay-open/close behavior here beyond whatever compile-safe adaptation the widened contract requires
- do not add final user-facing summary copy here
- do not redesign staged file recovery controls here
- do not widen into Browser or Console messaging ownership
- do not turn this into a generic import job system

### Implementation Risks

- widening the contract without enough per-file truth for `Phase 4` to act honestly
- letting mixed-result acceptance still collapse into one top-level success signal that hides failures
- accidentally rolling back already successful commits to simulate all-or-nothing behavior
- pushing too much controller UX decision-making into the store contract phase
- changing the current all-success path more than necessary

### Checklist

- [x] define one structured per-file staged acceptance result contract
- [x] preserve successful committed imports even when another file in the same session fails
- [x] make failed staged files representable for later recovery
- [x] tighten focused store proof for empty, full-success, and mixed-result acceptance shapes
- [x] keep dialog recovery and user-facing messaging out of scope

### Verification Shape

Minimum verification for this phase should cover:

- empty staged acceptance still reports no meaningful commit result
- full-success acceptance reports a structured success result without regressing the current anchor-row behavior
- mixed-result acceptance reports both successful and failed per-file outcomes honestly
- already successful committed files are not rolled back during mixed-result acceptance
- no dialog recovery or user-facing summary behavior changes land in this phase

### Done Shape

- staged acceptance has one explicit per-file result contract
- the store can now describe full success, no-op acceptance, and partial success without pretending they are the same outcome
- the next phase can keep the dialog open, summarize outcomes, and preserve failed staged rows without first reinventing commit truth

## [x] `Import-4` - `Phase 4 - Dialog Recovery And Session Messaging`

### Purpose

- make the staged dialog and the surrounding Browser or Console messaging read clearly after a mixed-result acceptance attempt

### Goal

- keep the session open when needed, summarize what succeeded, and make the remaining failed rows understandable and recoverable

### Locked Direction

- keep the dialog as the primary staged-session owner
- use Browser and Console as secondary summary surfaces only
- keep recovery lightweight:
  - retry where that already makes sense
  - remove or restage failed files where needed
- do not redesign the whole import dialog or add a second transcript system

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- possibly add narrow Console summary updates where they materially help the user
- add Browser-facing regression coverage for mixed-result staged sessions

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - now returns one explicit staged acceptance result with:
    - `status`
    - `anchorRowId`
    - `committedReferenceCount`
    - per-file committed or failed entries
  - now preserves successful commits during mixed-result acceptance
  - now keeps only failed staged files in the draft after a partial result
  - should remain the owner of commit truth, not the owner of final user-facing recovery copy
- `src/app/panels/useBrowserPanelController.ts`
  - now already keeps the dialog open on partial or failed staged acceptance
  - is the strongest seam for:
    - capturing the most recent staged acceptance result
    - clearing or replacing that result on later dialog actions
    - routing any narrow Console summary write only when it materially helps
- `src/app/panels/browserTreeMenus.tsx`
  - already owns:
    - staged row rendering
    - dialog intro and cards
    - action-row button treatment
  - is the strongest seam for:
    - one post-accept summary block
    - per-file result treatment on rows that remain staged
    - clarifying why the dialog is still open after a partial result
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves:
    - staged inspection failure treatment
    - mixed-result dialog-stays-open behavior
  - should be widened here to prove:
    - visible partial-result summary treatment
    - failed staged rows stay understandable after acceptance
    - the primary action reads honestly after a partial result
- `src/app/console/...`
  - should stay secondary only
  - add Console messaging only if it helps the user understand that some files committed while failed rows remain staged

### First Pass Decisions

- keep `Phase 4` UI-and-controller focused:
  - do not widen the store contract again
  - do not redesign staged file controls
- make the dialog itself explain the result first:
  - one compact mixed-result summary block inside the staged dialog
  - per-file recovery truth should remain row-local where possible
- keep recovery lightweight:
  - failed rows remain staged
  - the user can retry via the existing flow, remove rows, or continue reviewing
  - do not add a dedicated retry queue or a new session-log panel
- keep Browser and Console secondary:
  - Browser selection can still follow the committed anchor row
  - Console summary should stay short and non-competing if added
- keep the successful path calm:
  - full-success acceptance should still close the dialog as it does now
  - only partial or failed acceptance should surface the new recovery read

### Exact First Code Cut

1. Update `src/app/panels/useBrowserPanelController.ts` so the controller stores the most recent staged acceptance result while the dialog remains open after partial or failed acceptance.
2. Clear or replace that stored result when the user:
   - stages new files
   - removes or closes the draft
   - re-attempts acceptance
3. Update `src/app/panels/browserTreeMenus.tsx` so partial or failed acceptance renders one compact staged-session summary block that states:
   - whether the result was partial or failed
   - how many files committed
   - how many files remain staged
4. Reuse the stored per-file result entries to make remaining failed rows read as failed post-accept rows instead of looking like untouched staged rows.
5. If needed, add one narrow Console info or warning entry that mirrors the mixed-result truth without becoming the primary owner of the session.
6. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves:
   - partial acceptance keeps the dialog open
   - the mixed-result summary appears
   - failed rows remain staged and understandable
   - full success still closes the dialog

### Likely Files

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- possibly one narrow Console seam if needed

### No-Widening Rule

- do not widen the staged store result contract again
- do not add a new import transcript, background job model, or retry queue
- do not redesign the preview Browser layout or staged file card structure here
- do not add new import settings or file-inspection owners
- do not widen into the later object preview viewport phase

### Implementation Risks

- letting Browser or Console messaging compete with the dialog instead of supporting it
- duplicating the same summary in too many places so the recovery read becomes noisy
- forgetting to clear stale mixed-result state when the draft changes
- making failed rows read blocked when they are actually still recoverable staged rows
- accidentally regressing the calm full-success close path while adding partial-result messaging

### Checklist

- [x] keep the dialog open on partial or failed acceptance with one visible mixed-result summary
- [x] make remaining failed rows read clearly as post-accept recoverable failures
- [x] keep Browser or Console summaries secondary to the dialog
- [x] preserve the current full-success close behavior
- [x] add focused Browser proof for partial-result recovery messaging

### Verification Shape

Minimum verification for this phase should cover:

- partial acceptance leaves the dialog open and shows one mixed-result summary block
- the summary reports committed versus remaining staged counts honestly
- failed rows remain staged and visibly understandable after the acceptance attempt
- full success still closes the dialog and does not show the recovery summary
- any Console summary added stays aligned with the dialog instead of becoming a competing owner

### Done Shape

- partial staged acceptance reads clearly inside the dialog without inventing new hidden state
- failed rows remain staged and understandable for lightweight recovery
- Browser or Console surfaces can acknowledge the result without replacing the dialog as the staged-session owner
- the next cleanup phase can stay narrow because staged truth and staged recovery messaging are both explicit

## [ ] `Import-4` - `Phase 5 - Narrow Cleanup And Regression Pass`

### Purpose

- finish the staged-feedback lane with any small cleanup left behind by the phased rollout

### Goal

- leave the staged-session result contract narrow, readable, and well covered without widening the import family again

### Locked Direction

- keep this pass small
- prefer cleanup, wording, and regression hardening only
- do not widen into new import features just because the session contract became more explicit

### Expected Implementation Shape

- update only the files that still contain small staged-session residue after `Phases 1` through `4`
- tighten Browser proof around the staged import journey where overlapping tests can be merged or clarified
- make any final wording cleanup in the dialog only where it increases honesty or reduces repetition
- add no new import settings, no new recovery systems, and no new layout owners

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - now owns:
    - the widened staged dialog shell
    - staged inspection failure treatment
    - mixed-result summary treatment
    - row-local recovery messaging
  - is the strongest seam for any final wording cleanup or duplicated helper cleanup
- `src/app/panels/useBrowserPanelController.ts`
  - now owns:
    - staged file browsing
    - staged inspection triggering
    - partial-result session state retention
    - full-success-only close behavior
  - should only change here if a small cleanup clearly retires temporary glue from `Phases 3` and `4`
- `src/app/store/useAppStore.ts`
  - now owns the staged per-file commit-result contract
  - should stay mostly untouched in this phase unless one tiny cleanup is directly justified by the new tests
- `src/app/panels/BrowserPanel.test.tsx`
  - now carries the broadest staged dialog proof surface:
    - truthful split journey
    - inspection failure treatment
    - mixed-result recovery messaging
  - is the primary owner for the final `Import-4` regression pass
- `src/app/store/useAppStore.test.ts`
  - already proves the core staged commit contract
  - should only widen here if one final store-level regression gap remains after the Browser cleanup pass

### First Pass Decisions

- keep `Phase 5` closeout-only:
  - no new staged capabilities
  - no new viewer behavior
  - no new preview Browser behavior
- prefer consolidation over expansion:
  - merge overlapping staged Browser tests where possible
  - remove only residue directly retired by shipped staged-session behavior
- keep wording honest and calm:
  - trim repeated phrasing
  - avoid duplicate “failure” reads that say the same thing twice
  - preserve the current clear difference between:
    - pre-commit inspection failure
    - post-accept partial-result recovery
- treat this phase as the place to make `Import-4` feel finished, not more ambitious

### Exact First Code Cut

1. Audit the staged import dialog surface in `src/app/panels/browserTreeMenus.tsx` for any repeated recovery phrasing, stale helper copy, or small structural duplication left behind by the phased rollout.
2. Audit `src/app/panels/useBrowserPanelController.ts` for any now-obvious temporary session-result glue that can be simplified without changing behavior.
3. Tighten `src/app/panels/BrowserPanel.test.tsx` into the smallest high-signal staged regression shape that still proves:
   - truthful split preview behavior
   - pre-commit inspection failure treatment
   - partial-result recovery treatment
   - calm full-success close behavior
4. Add or tighten one store proof in `src/app/store/useAppStore.test.ts` only if a clear staged contract gap remains after the Browser cleanup.
5. Update the parent `Import-4` doc plus the required changelog and doc-log entries in the same change set.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- possibly `src/app/store/useAppStore.test.ts`

### No-Widening Rule

- do not add new import settings, preview controls, or recovery systems
- do not widen into the later object preview viewport phase
- do not redesign the dialog layout again unless a tiny cleanup is required for correctness
- do not widen the store result contract or invent a new staged-session model
- do not turn this cleanup pass into generic Browser refactoring

### Implementation Risks

- letting a cleanup pass sprawl into a hidden feature phase
- removing proof that still matters just because it looks repetitive locally
- over-compressing UI copy so mixed-result recovery becomes less understandable
- touching store or controller logic that is already correct just for stylistic reasons
- shipping the family without one clear final regression pass that proves the full staged journey still works

### Checklist

- [ ] audit and trim any small staged dialog wording or helper duplication left by the rollout
- [ ] remove only narrow controller or dialog residue directly retired by shipped behavior
- [ ] tighten the staged Browser regression proof into one high-signal closeout shape
- [ ] add store proof only if one real staged contract gap remains
- [ ] keep the phase cleanup-only with no new staged import behavior

### Verification Shape

Minimum verification for this phase should cover:

- the staged import journey still reads correctly from review through accept
- truthful split-import behavior still works after the cleanup
- pre-commit inspection failures and post-accept recovery states remain clearly distinct
- mixed-result recovery still keeps failed files staged without regressing the success path
- no new behavior or new staged settings land during the cleanup pass

### Done Shape

- `Import-4` ends with one narrow, readable staged-session surface
- the shipped staged dialog behavior is well covered without scattered overlapping proof
- the remaining future work can move on to the object preview viewport without needing another cleanup detour for the staged feedback lane

## [x] `Import-4` - `Phase 6 - Object Preview Viewport And Resizable Three-Column Layout`

Execution doc:
- `Future/Import_Phase Import-4 Phase 6 - Object Preview Viewport And Resizable Three-Column Layout.md`

Summary:
- give staged objects one explicit preview viewport inside the dialog so the user can inspect and orbit an individual object before commit
- grow the staged import dialog from two working columns to three:
  - left review and settings
  - middle preview Browser organization
  - right object preview viewport
- add draggable vertical divider bars between the columns so the user can rebalance width during the open session without widening this lane into a general multi-viewport workspace system

## [ ] `Import-4` - `Phase 7 - UI Cleanup And Polish`

Execution doc:
- `Future/Import_Phase Import-4 Phase 7 - UI Cleanup And Polish.md`

Summary:
- give the staged import dialog one later home for smaller presentation and readability cleanup tasks after the heavier feedback, recovery, and preview lanes are already shipped
- start with the `Multiple Objects` / `Parts` readability cleanup by turning the part-label pile into a clearer list treatment inside the staged file card
- keep this lane UI-only and user-feedback-driven instead of widening it into new import behavior

### Verification

Minimum proof for `Import-4`:

1. the preview Browser can render in its own full-height right-side column with a local scrollbar while the left-side review and settings stack remains readable
2. staged inspection failures show honest per-file feedback inside the import dialog
3. `Add To Project` can surface partial success without silently reading like full success
4. successfully accepted files can land in project content while failed staged files remain available for recovery
5. Browser or Console summaries stay aligned with the dialog instead of becoming competing owners of staged-session truth
6. real accepted imported-reference load failures still remain honest after the earlier `Import-3 / Phase 12` fix
7. if the object preview viewport lands later, it remains a dialog-local staged inspection tool and does not replace either the preview Browser organization surface or the main model viewport

### Exit Criteria

`Import-4` is ready to implement when:
- the first phase clearly owns the preview Browser column and scrollbar polish pass
- the family clearly treats staged-session feedback as the next mainline gap after `Import-3`
- the per-file staged inspection seam and the partial commit seam both have explicit owners
- the lane does not overpromise drag-and-drop, new file formats, or generalized background jobs
- the phased ladder is small enough for later prep and implementation turns

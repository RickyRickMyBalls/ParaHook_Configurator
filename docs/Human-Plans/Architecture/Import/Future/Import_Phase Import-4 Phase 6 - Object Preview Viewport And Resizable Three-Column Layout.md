# `Import-4 Phase 6` - `Object Preview Viewport And Resizable Three-Column Layout`

## Doc Header

### Doc History
10. 2026-04-16: Implemented `Import-4 / Phase 6.4 - Cleanup And Regression Proof` by tightening the shipped object-preview wording around orbit and draft-local ownership, adding one integrated BrowserPanel closeout proof for the full three-column preview lane, and closing out `Import-4 / Phase 6` without widening into any new preview capability or shared viewer architecture
9. 2026-04-16: Prepped `Import-4 / Phase 6.4 - Cleanup And Regression Proof` for implementation by grounding the final preview-viewport closeout in the shipped three-column shell, the dialog-local preview load or orbit runtime, and the new divider reset behavior so the last pass can stay tightly scoped to wording cleanup, small residue removal, and one durable Browser regression shape
8. 2026-04-16: Implemented `Import-4 / Phase 6.3 - Orbit Interaction And Divider Resizing` by adding dialog-local three-column width ownership, two draggable divider bars, and orbit-enabled preview-canvas interaction for loaded staged objects while keeping both layout state and preview camera behavior local to the open staged import session
7. 2026-04-16: Prepped `Import-4 / Phase 6.3 - Orbit Interaction And Divider Resizing` for implementation by grounding the next pass in the now-shipped dialog-local preview renderer, the existing three-column staged import shell, and nearby resize-bar plus pointer-drag seams so orbit and width rebalancing can land as one local interaction pass without widening into persisted layout state or another preview-runtime rewrite
6. 2026-04-16: Implemented `Import-4 / Phase 6.2 - Load Into Preview Viewport Action And Preview Rendering` by adding explicit staged-file `Load into preview viewport` actions, wiring the controller's dialog-local preview selection through the staged import dialog, and landing one narrow draft-local preview renderer that reuses the existing reference asset loader for truthful empty/loading/ready/error viewport states while keeping orbit and divider behavior deferred
5. 2026-04-16: Prepped `Import-4 / Phase 6.2 - Load Into Preview Viewport Action And Preview Rendering` for implementation by grounding the first real staged-object preview pass in the shipped third-column shell, the controller's dialog-local preview-selection owner, and the existing reference asset loader plus direct-part isolation seams so the next step can add explicit preview loading and truthful draft-local rendering without widening into orbit controls or divider resizing yet
4. 2026-04-16: Implemented `Import-4 / Phase 6.1 - Preview Selection Contract And Third-Column Shell` by adding one dialog-local staged preview-selection owner, widening the staged import dialog from two working columns to three, and landing one placeholder object preview viewport shell with focused Browser proof while keeping real preview rendering, orbit interaction, and divider resizing deferred to later subphases
3. 2026-04-16: Prepped `Import-4 / Phase 6.1 - Preview Selection Contract And Third-Column Shell` for implementation by grounding the first preview-viewport cut in the shipped two-column staged dialog shell, the controller's existing dialog-local staged state owners, and the current BrowserPanel layout proof so the next step can add only preview selection ownership plus the third-column shell without widening into actual preview rendering or orbit interaction
2. 2026-04-16: Reworked the internal structure of this standalone `Import-4 / Phase 6` execution doc so each planned subphase now lives under its own top-level `##` section instead of being grouped only as smaller `###` entries, making later prep and implementation turns easier to target one step at a time
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 6`, splitting the later object preview viewport lane out of the parent staged-session feedback record so the preview-viewport and resizable three-column dialog work can be planned and implemented in smaller focused steps without bloating the main `Import-4` umbrella doc

### Purpose

This doc owns the later staged import object preview viewport lane.

Use it to answer:
- how one staged object should load into a draft-local preview viewport
- how the staged import dialog should grow from two columns to three
- how resizable vertical divider bars should behave between the dialog columns
- what should stay out of scope while adding object preview tooling

### Relationship To Parent Doc

Parent lane:
- `Import_Phase Import-4 - Staged Import Session Feedback And Partial-Failure Reporting.md`

This doc exists because:
- the staged-session feedback lane now has its own shipped structure through `Phases 1` through `4`
- the later preview viewport work is additive and UI-heavy
- the preview viewport lane is likely to need its own smaller prep and implementation passes

Keep the parent `Import-4` doc as the umbrella lane.

Use this doc for:
- the detailed planning and phased execution of the object preview viewport work

## Doc Body

### Goal

Give staged objects one explicit preview viewport inside the import dialog so the user can inspect and orbit an individual object before commit, while preserving the existing preview Browser organization owner and the main model viewport as separate surfaces.

### Locked Direction

- keep the preview Browser as the staged organization owner
- keep the new object preview viewport as a draft-local inspection surface:
  - it previews one staged object
  - it does not itself accept imports
  - it does not mutate project content
- add one explicit `Load into preview viewport` action for eligible staged objects
- allow orbit interaction inside the preview viewport
- keep the main model viewport separate from this dialog-local preview viewport
- prefer one three-column working shell when the preview viewport is active:
  - left review and settings
  - middle preview Browser organization
  - right object preview viewport
- add draggable vertical divider bars between the columns so the user can rebalance width during the open session
- do not widen this lane into a general multi-viewport workspace system

### Likely Architecture Seams

- `src/app/panels/browserTreeMenus.tsx`
  - current staged import dialog composition
  - likely owner for the third-column viewport shell and divider markup
- `src/app/theme/surfaces/browser.css`
  - current two-column staged import dialog layout
  - likely owner for three-column layout, resizable divider treatment, and preview viewport framing
- `src/app/panels/useBrowserPanelController.ts`
  - likely owner for dialog-local preview selection state and viewport load intent wiring
- `src/app/panels/BrowserPanel.test.tsx`
  - likely owner for focused Browser proof around preview action presence, third-column rendering, and divider structure
- possible narrow viewer bridge or dialog-local preview owner seam
  - only if needed to host one orbitable staged-object preview without touching the main workspace viewer owner

## [x] `Import-4 Phase 6.1 - Preview Selection Contract And Third-Column Shell`

### Purpose

- define the first dialog-local owner for “which staged object is loaded into the preview viewport”

### Goal

- add the third-column shell and preview-selection contract without yet rendering or orbiting a real staged object

### Locked Direction

- keep this first cut contract-and-layout only:
  - no actual preview rendering yet
  - no orbit interaction yet
  - no resizable divider behavior yet
- keep preview selection dialog-local:
  - one selected staged object at a time
  - selection clears when the draft closes
  - selection stays downstream from the staged draft instead of becoming new store truth
- keep the existing left and middle owners intact:
  - left column = review and settings
  - middle column = preview Browser organization
  - right column = preview viewport shell only for now
- avoid widening into asset loading or viewer ownership in this phase

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/theme/surfaces/browser.css`
- add focused Browser proof around:
  - preview selection state presence
  - three-column dialog structure
  - placeholder preview viewport shell rendering

### Implementation-Prep Read

- `src/app/panels/useBrowserPanelController.ts`
  - already owns dialog-local staged state such as:
    - browsing state
    - partial-result session state
    - preview Browser drag state
  - is the strongest seam for adding one dialog-local preview selection owner without widening the store
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the full staged import dialog composition
  - already renders:
    - left settings column
    - middle preview Browser column
    - action row
  - is the strongest seam for:
    - adding one third-column shell
    - rendering one placeholder preview viewport card
    - exposing future object-preview action affordances later
- `src/app/theme/surfaces/browser.css`
  - already owns the two-column staged import layout
  - is the strongest seam for turning the dialog body into a three-column shell while preserving the existing top-level dialog cap and action row
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the current two-column shell and the preview Browser column
  - should be widened here to prove:
    - the third column exists
    - the preview viewport shell is present
    - the action row still stays below the content area

### First Pass Decisions

- add one dialog-local preview selection id only
- keep the selected preview target shape narrow:
  - staged file id
  - possibly preview row id if needed for shell wiring
  - avoid any richer asset contract in this phase
- show one placeholder empty-state read in the new right column when nothing is selected
- preserve the current responsive fallback direction; do not solve final divider behavior yet
- do not add row-level `Load into preview viewport` buttons until the next subphase

### Exact First Code Cut

1. Add one dialog-local preview selection owner in `src/app/panels/useBrowserPanelController.ts`.
2. Clear that selection when:
   - the staged draft closes
   - the selected staged object no longer exists in the draft
3. Update `src/app/panels/browserTreeMenus.tsx` so the staged import dialog body becomes a three-column shell:
   - left settings column
   - middle preview Browser column
   - right preview viewport shell
4. Render one placeholder preview viewport card in the new right column that states no staged object is loaded yet.
5. Update `src/app/theme/surfaces/browser.css` so the third-column shell fits alongside the existing columns without disturbing the action row.
6. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the third-column shell and preview viewport placeholder render correctly without any real object loading yet.

### Likely Files

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not render a real staged object in the preview viewport yet
- do not add orbit interaction yet
- do not add divider dragging or persisted width state yet
- do not widen the app store with a new staged preview owner unless local controller state proves insufficient
- do not redesign the staged settings or preview Browser owners in this phase

### Implementation Risks

- letting the first shell pass accidentally choose a too-rich preview selection contract
- widening into real preview rendering before the shell and ownership are stable
- breaking the current two-column staged import layout or action-row placement while adding the third column
- adding markup that later fights the divider-resize phase instead of setting it up cleanly

### Checklist

- [ ] add one dialog-local preview selection contract for the future object preview viewport
- [ ] render the three-column staged dialog shell with a placeholder preview viewport column
- [ ] preserve the existing left settings and middle preview Browser owners
- [ ] keep the action row below the content area
- [ ] add focused Browser proof for the third-column shell and placeholder viewport

### Verification Shape

Minimum verification for this phase should cover:

- the staged import dialog renders three working columns
- the rightmost column is a placeholder preview viewport shell when no staged object is selected
- the existing preview Browser still renders in the middle column
- the action row remains outside the content shell
- no real staged object loading or orbit behavior lands in this phase

### Done Shape

- the staged import dialog has one clean third-column shell for later preview work
- one narrow preview selection contract exists without widening into rendering or interaction yet
- the next phase can add `Load into preview viewport` and real preview rendering without first reworking layout ownership

### Implementation Notes

- `src/app/panels/useBrowserPanelController.ts`
  - now owns one dialog-local `stagedImportPreviewSelection` value that clears when the staged draft closes or the selected file leaves the draft
- `src/app/panels/browserTreeMenus.tsx`
  - now renders the staged import dialog as:
    - left settings column
    - middle preview Browser column
    - right placeholder object preview viewport column
- `src/app/theme/surfaces/browser.css`
  - now widens the staged import dialog and styles the third-column shell while preserving the existing constrained-body plus action-row structure and the narrow-width single-column fallback
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves the third column renders, the middle preview Browser stays in place, the placeholder viewport shell exists, and the action row remains below the content shell

## [x] `Import-4 Phase 6.2 - Load Into Preview Viewport Action And Preview Rendering`

### Purpose

- turn the new third-column shell into a real draft-local object preview surface for one staged object at a time

### Goal

- let the user explicitly load one staged object into the preview viewport and see a truthful rendered result there before commit

### Locked Direction

- keep the preview session dialog-local:
  - no new app-store preview runtime owner
  - no project-content mutation
  - no committed imported references
- keep this phase to:
  - explicit `Load into preview viewport` action
  - one selected staged object rendered in the dialog-local preview shell
  - truthful empty, loading, ready, and failed preview states
- defer:
  - orbit interaction
  - divider dragging or persisted widths
  - generalized viewer-host reuse
  - previewing multiple staged objects at once
- prefer the already truthful staged file contract:
  - flat files preview as one object
  - multi-object rows may still preview one staged file at a time in this phase
  - if a file carries direct part-backed structure metadata, only use it when needed for truthful single-file preview isolation

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- likely add one narrow dialog-local preview renderer component under `src/app/panels/`
- likely reuse `src/viewer/referenceAssetLoader.ts` for object loading
- likely reuse direct part isolation logic from `src/viewer/Viewer.ts` through a narrow helper extraction only if needed
- add focused Browser proof for:
  - preview action presence
  - preview selection switching
  - truthful placeholder vs loading vs loaded read

### Implementation-Prep Read

- `src/app/panels/useBrowserPanelController.ts`
  - already owns `stagedImportPreviewSelection`
  - is the strongest seam for:
    - setting the selected staged file when the user clicks `Load into preview viewport`
    - clearing preview selection when the draft closes or the selected file disappears
    - owning any lightweight dialog-local preview load state if rendering needs one controller-level status
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the staged-file card rendering and the new placeholder viewport shell
  - is the strongest seam for:
    - exposing the explicit `Load into preview viewport` action on eligible staged files
    - switching the viewport shell between empty, loading, error, and ready states
- `src/viewer/referenceAssetLoader.ts`
  - already knows how to load `.glb`, `.obj`, `.stl`, and `.step` staged assets from blob URLs
  - is the strongest existing truth source for draft-local object loading without inventing a second loader contract
- `src/viewer/Viewer.ts`
  - already owns truthful direct-part and exploded-part mesh isolation
  - should only be touched in this phase if one narrow shared helper extraction is needed so the dialog-local preview can isolate one part-backed object without duplicating fragile mesh-selection logic
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the third-column shell
  - should be widened here to prove:
    - the `Load into preview viewport` action exists
    - the selected staged file name appears in the object preview shell
    - the preview stays dialog-local and does not commit or mutate project content

### First Pass Decisions

- add `Load into preview viewport` only on staged-file rows, not on every preview Browser row yet
- treat preview selection as:
  - one staged file id
  - no multi-select
  - last clicked eligible file wins
- add one narrow preview renderer component that owns:
  - a canvas host element
  - draft-local object load lifecycle
  - empty/loading/error/ready read
- prefer a small renderer owned by the dialog instead of trying to reuse the full workspace viewer host
- keep camera behavior static in this phase:
  - frame the loaded object once
  - no manual orbit yet

### Exact First Code Cut

1. Add one explicit `onLoadStagedImportPreview(stagedFileId)` handler in `src/app/panels/useBrowserPanelController.ts`.
2. Expose a `Load into preview viewport` button on eligible staged-file rows in `src/app/panels/browserTreeMenus.tsx`.
3. Replace the placeholder-only viewport shell with a small dialog-local preview renderer that:
   - shows the empty state when no file is selected
   - shows loading state while the selected staged asset is loading
   - shows an error state if preview loading fails
   - renders the selected staged object when loading succeeds
4. Reuse `src/viewer/referenceAssetLoader.ts` for loading the staged asset object.
5. If part isolation is needed for truthful preview, extract the smallest reusable helper from `src/viewer/Viewer.ts` instead of duplicating mesh-isolation logic inline.
6. Update `src/app/theme/surfaces/browser.css` only as needed for the new button and real viewport canvas shell.
7. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves the new action and the loaded-preview read without widening into orbit or divider work.

### Likely Files

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- likely one new narrow dialog-local preview renderer file under `src/app/panels/`
- possible narrow helper extraction in:
  - `src/viewer/Viewer.ts`
  - or one new shared helper near `src/viewer/referenceAssetLoader.ts`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not add orbit controls yet
- do not add divider dragging yet
- do not persist preview selection or preview camera state beyond the open dialog session
- do not route this preview through the main workspace viewer host
- do not widen into batch previewing or preview Browser row-level object inspection yet

### Implementation Risks

- accidentally building a second full viewer stack instead of one narrow dialog-local preview renderer
- coupling preview rendering too tightly to the workspace viewer or project-content runtime
- duplicating fragile mesh-isolation logic instead of reusing one truthful helper
- widening the preview action surface too early by adding it to too many row types instead of staged-file rows only

### Checklist

- [ ] add explicit `Load into preview viewport` on eligible staged-file rows
- [ ] render the selected staged file inside the right-column preview viewport
- [ ] keep preview loading truthful with empty/loading/error/ready states
- [ ] keep the preview draft-local and non-committing
- [ ] add focused Browser proof for preview action and rendered-preview state

### Verification Shape

Minimum verification for this phase should cover:

- the staged import dialog still renders the three-column shell from `6.1`
- a staged-file row exposes `Load into preview viewport`
- clicking that action selects the staged file for preview
- the viewport shell shows a truthful loading or ready state for that selected staged file
- the preview action does not mutate project content or commit staged files

### Done Shape

- the staged import dialog can load and display one staged object in the new preview viewport
- preview ownership remains local to the staged dialog session
- the next phase can add orbit and divider resizing without first reworking preview selection or render ownership

### Implementation Notes

- `src/app/panels/useBrowserPanelController.ts`
  - now exposes `onLoadStagedImportPreview(stagedFileId)` so staged-file rows can explicitly select one staged object for preview without widening store ownership
- `src/app/panels/browserTreeMenus.tsx`
  - now renders `Load Into Preview Viewport` on staged-file rows and routes the selected staged file into the right-column viewport shell
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now owns the dialog-local preview lifecycle:
    - empty
    - loading
    - ready
    - error
  - and reuses `src/viewer/referenceAssetLoader.ts` to load staged assets truthfully before drawing a framed static preview when WebGL is available
- `src/app/theme/surfaces/browser.css`
  - now styles the preview-load action and the real viewport canvas plus status shell without changing the three-column ownership model from `6.1`
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves one staged file can be loaded into the preview viewport without mutating project content or committing the staged session

## [x] `Import-4 Phase 6.3 - Orbit Interaction And Divider Resizing`

### Purpose

- make the preview viewport feel inspectable and the three-column shell feel adjustable without changing the staged import data model

### Goal

- let the user orbit the currently loaded staged preview object and locally rebalance the three staged import columns with draggable vertical divider bars

### Locked Direction

- keep all new interaction local to the open staged import dialog session:
  - no persisted divider widths yet
  - no stored preview camera state yet
  - no new app-store ownership
- keep this phase to:
  - orbit interaction inside the dialog-local preview viewport
  - two vertical divider bars between:
    - left settings and middle preview Browser
    - middle preview Browser and right object preview viewport
  - local width rebalancing across the three working columns
- defer:
  - keyboard camera controls
  - reset-to-default layout commands unless a tiny local button proves strictly necessary
  - any preview selection or asset-loading redesign
  - any relationship to the main workspace viewer camera

### Expected Implementation Shape

- update `src/app/panels/useBrowserPanelController.ts`
- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/panels/StagedImportPreviewViewport.tsx`
- update `src/app/theme/surfaces/browser.css`
- add focused Browser proof for:
  - divider presence
  - divider drag behavior
  - preview orbit wiring staying local to the preview viewport

### Implementation-Prep Read

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - already owns the dialog-local preview renderer and static framed camera
  - is the strongest seam for:
    - enabling orbit controls on the preview canvas only
    - keeping camera interaction separate from the main workspace viewer
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the three-column staged import dialog composition
  - is the strongest seam for:
    - inserting the two vertical divider bars between columns
    - threading local width values into the content shell
- `src/app/panels/useBrowserPanelController.ts`
  - already owns dialog-local staged UI state and pointer-driven preview Browser drag state
  - is the strongest seam for:
    - local divider drag session state
    - temporary column width values that clear with the dialog
- `src/app/theme/surfaces/browser.css`
  - already owns the three-column shell and the new preview viewport surface
  - is the strongest seam for:
    - resizable grid or flex column sizing
    - divider visuals and hit targets
- nearby resize-bar seams:
  - `src/app/panels/SpaghettiPanel.tsx`
    - shows the local pattern for pointer-driven resize bars without persisting width into a broader settings system
  - `src/app/panels/BrowserPanel.test.tsx`
    - already contains pointer-event helpers and staged import shell proof that can be widened for local divider drag assertions

### First Pass Decisions

- keep divider width state local and ephemeral:
  - reset to defaults each time the staged import dialog reopens
- prefer two explicit divider bars rendered in the shell instead of trying to infer draggable edges from the columns themselves
- use orbit only when a preview object is loaded:
  - no empty-state interaction
  - no need for pan or zoom parity with the main viewer yet beyond what the chosen orbit control naturally gives
- keep minimum widths on all three columns so:
  - settings stay readable
  - preview Browser stays usable
  - preview viewport never collapses into a non-functional sliver

### Exact First Code Cut

1. Add one dialog-local staged import column-width owner in `src/app/panels/useBrowserPanelController.ts`.
2. Add two divider bars to the three-column shell in `src/app/panels/browserTreeMenus.tsx`.
3. Wire pointer-down, pointer-move, and pointer-up handling so dragging a divider locally rebalances adjacent columns only.
4. Update `src/app/theme/surfaces/browser.css` so the staged import content shell accepts local width styling and the divider bars have a clear hit target and visible affordance.
5. Update `src/app/panels/StagedImportPreviewViewport.tsx` so the preview canvas gains orbit interaction for the loaded staged object without changing the load contract from `6.2`.
6. Tighten `src/app/panels/BrowserPanel.test.tsx` so it proves divider bars exist, dragging them updates local layout state, and the preview viewport still stays draft-local.

### Likely Files

- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/StagedImportPreviewViewport.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not persist divider widths outside the open dialog session
- do not persist preview camera or orbit state
- do not widen preview rendering into a second viewer-host architecture
- do not add batch preview selection, preview Browser row previewing, or new import settings here
- do not rework the staged commit or partial-result dialog behavior from earlier `Import-4` phases

### Implementation Risks

- letting divider drag state leak past dialog close instead of staying local
- making the divider hit targets too small or visually ambiguous
- coupling orbit interaction too tightly to preview loading so reloading or changing selection resets badly
- allowing one column to collapse enough to make the staged dialog unusable

### Checklist

- [ ] add orbit interaction inside the loaded object preview viewport
- [ ] add two vertical divider bars between the three working columns
- [ ] keep divider state local to the open staged dialog session
- [ ] preserve readable minimum widths across all three columns
- [ ] add focused Browser proof for divider structure and local resize behavior

### Verification Shape

Minimum verification for this phase should cover:

- the staged import dialog still renders the three working columns from `6.1` and `6.2`
- divider bars render between those columns
- dragging a divider rebalances column widths locally
- the loaded preview object can be orbited inside the preview viewport
- closing and reopening the dialog resets the local divider session back to defaults

### Done Shape

- the staged import dialog supports real object inspection through orbit
- the user can locally rebalance the three working columns while the dialog is open
- the next phase can stay cleanup-and-proof-only instead of needing another interaction redesign first

### Implementation Notes

- `src/app/panels/useBrowserPanelController.ts`
  - now owns local staged import column widths and the divider-drag session handlers
  - resets those widths back to defaults when the staged import dialog closes
- `src/app/panels/browserTreeMenus.tsx`
  - now renders two explicit resize bars between the three working columns
  - threads the local width shares into the content shell through CSS custom properties
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now enables `OrbitControls` on the preview canvas for loaded staged objects while keeping the interaction entirely local to the preview viewport
- `src/app/theme/surfaces/browser.css`
  - now styles the resize bars and uses the local width shares to size the three working columns without overflowing the dialog shell
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves the resize bars render, dragging them updates the local column shares, and closing then reopening the dialog resets those shares back to the default layout

## [x] `Import-4 Phase 6.4 - Cleanup And Regression Proof`

### Purpose

- close out the preview-viewport lane with one high-signal proof pass and only the smallest wording or structure cleanup directly retired by the shipped implementation

### Goal

- leave `Import-4 / Phase 6` with a durable regression shape that covers the three-column shell, preview loading, orbit availability, and local divider reset behavior without adding any new preview capabilities

### Locked Direction

- keep this phase cleanup-and-proof-only:
  - no new preview behavior
  - no new import settings
  - no persisted width or camera state
  - no workspace-viewer integration
- allow only:
  - small wording tightening in the staged import dialog
  - tiny structure cleanup if one helper or class name is now clearly redundant
  - regression-proof expansion where the shipped behavior still lacks one durable assertion
- defer any future polish that changes interaction model or feature scope

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/panels/StagedImportPreviewViewport.tsx`
- update `src/app/theme/surfaces/browser.css` only if one tiny cleanup is clearly justified
- update `src/app/panels/BrowserPanel.test.tsx`
- update store proof only if one real contract gap remains after the Browser proof is tightened

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - now owns the three-column staged dialog shell, preview action copy, and divider markup
  - is the strongest seam for any final wording cleanup or small structure dedupe
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now owns the draft-local preview lifecycle and orbit-enabled preview canvas
  - is the strongest seam for any small status-copy tightening or tiny cleanup around preview readiness wording
- `src/app/theme/surfaces/browser.css`
  - now owns the final shell and divider styling
  - should only be touched if one small residue or duplicated rule is directly retired by the final proof pass
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves:
    - three-column shell presence
    - preview-load action
    - loaded-preview read
    - divider drag and reset behavior
  - should be tightened here into one durable closeout shape that reads like the final staged preview journey

### First Pass Decisions

- prefer one stronger integrated BrowserPanel proof over many overlapping small tests where possible
- keep cleanup limited to residue that is clearly retired by the now-stable preview shell
- do not force a second test family or new renderer-specific test suite unless one real gap cannot be covered by the Browser proof

### Exact First Code Cut

1. Audit the current staged import preview wording in `src/app/panels/browserTreeMenus.tsx` and `src/app/panels/StagedImportPreviewViewport.tsx`.
2. Remove or tighten only wording or structure that now reads as temporary or duplicated after `6.1` through `6.3`.
3. Expand `src/app/panels/BrowserPanel.test.tsx` into one high-signal preview-lane closeout proof that covers:
   - three-column shell
   - preview load action
   - preview loaded-state read
   - local divider resize
   - divider reset after dialog close
4. Add store or controller proof only if one real contract seam remains under-covered after the Browser proof is tightened.

### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/StagedImportPreviewViewport.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`
- possible narrow follow-up in `src/app/panels/useBrowserPanelController.ts` only if one helper cleanup is clearly justified

### No-Widening Rule

- do not add any new preview actions
- do not add persisted divider widths
- do not add persisted preview camera state
- do not widen into a shared preview framework or workspace-viewer reuse
- do not redesign the staged import session flow from earlier `Import-4` phases

### Implementation Risks

- turning the closeout into an unnecessary refactor instead of a narrow cleanup pass
- adding redundant tests that overlap the already-strong Browser proof without improving coverage
- polishing wording in a way that obscures the draft-local or non-committing truth of the preview surface

### Checklist

- [ ] tighten any small temporary wording or shell residue left by `6.1` through `6.3`
- [ ] lock one durable BrowserPanel proof for the full preview-viewport lane
- [ ] keep preview behavior and session ownership unchanged
- [ ] avoid widening into new renderer or viewer architecture

### Verification Shape

Minimum verification for this phase should cover:

- the staged import dialog still renders the full three-column shell
- a staged object can still be loaded into the preview viewport
- orbit remains available for loaded preview objects
- divider drag still rebalances the columns locally
- divider widths still reset after closing and reopening the dialog
- earlier staged-session messaging from `Import-4` stays intact

### Done Shape

- `Import-4 / Phase 6` is closed out with one stable proof shape and no temporary wording or structure residue that still needs another polish pass

### Implementation Notes

- `src/app/panels/browserTreeMenus.tsx`
  - now tightens the object-preview header copy so the shipped right column explicitly reads as a draft-local surface for inspecting and orbiting one staged object before commit
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now tightens the empty-state viewport copy so the idle read matches the shipped `Load Into Preview Viewport` action label and the later orbit-enabled preview behavior without widening the runtime
- `src/app/panels/BrowserPanel.test.tsx`
  - now includes one integrated closeout proof that covers:
    - three-column staged import shell presence
    - object-preview load action
    - truthful loaded-state read in the non-WebGL test environment
    - local divider resize behavior
    - reset back to the default width shares after the dialog closes and reopens

## Verification

Minimum proof for this lane should cover:

1. the staged import dialog can render a third object-preview column without replacing the preview Browser or the main model viewport
2. one staged object can be loaded into the preview viewport through an explicit action
3. the preview viewport stays draft-local and does not mutate project content
4. the user can orbit the staged preview object inside the dialog-local viewport
5. vertical divider bars can rebalance width between the three working columns
6. mixed-result staged-session messaging from earlier `Import-4` phases still remains intact alongside the later preview viewport lane

## Exit Criteria

This lane is ready to implement when:
- the parent `Import-4` doc points here instead of carrying the detailed preview viewport plan inline
- the work is broken into small enough cuts for separate prep and implementation turns
- the object preview viewport stays clearly separate from both the preview Browser and the main model viewport

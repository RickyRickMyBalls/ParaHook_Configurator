# `Import-4 Phase 7.5` - `Object Preview Follow-Up And Preview-Output Polish`

## Doc Header

### Doc History
18. 2026-04-17: Implemented `Import-4 / Phase 7.5.6 - Scale Multiplier Paraselect And Custom Sync` by adding one staged `Scale Multiplier` row under `Scale / Units`, making the numeric multiplier the staged scale source of truth with exact preset-to-label sync plus `Custom` off-preset, and preserving the shipped in-place preview scale update path through focused transform, preview, store, and Browser proof
17. 2026-04-17: Prepped `Import-4 / Phase 7.5.6 - Scale Multiplier Paraselect And Custom Sync` for implementation by grounding the next staged-scale-control pass in the live `scaleAlignment` store seam, the current staged-card `Scale / Units` `ParaSelect`, and the shipped in-place preview-scaling runtime so the future multiplier row can become the explicit numeric scaling truth while preset units stay synced, `Custom` appears only off-preset, and exact multiplier `1` resolves to `mm`
16. 2026-04-17: Added `Import-4 / Phase 7.5.6 - Scale Multiplier Paraselect And Custom Sync` as the next staged object-preview follow-up after the shipped `7.5.5` scale-truth work, extending this lane so the later scale-control pass now has an explicit home for a `Scale Multiplier` paraslider, preset sync with `Scale / Units`, `Custom` state when the multiplier leaves the preset set, and the locked rule that exact multiplier `1` should read as `mm` instead of `Current`
15. 2026-04-17: Implemented `Import-4 / Phase 7.5.5 - Scale Preview Truth And Snappy In-Place Scale Updates` by adding a canonical staged scale-factor helper beside the shipped up-axis helper, making the staged preview apply `Current / mm / cm / m / in` scale directly on the already-loaded preview object, and tightening focused proof that scale changes now happen in place without reloading the staged asset
14. 2026-04-17: Prepped `Import-4 / Phase 7.5.5 - Scale Preview Truth And Snappy In-Place Scale Updates` for implementation by replacing the old scale placeholder with a real preview-local scale-truth owner, adding explicit wishlist tracking for `Current`, `mm`, `cm`, `m`, and `in` preview output honesty plus in-place runtime updates, and grounding the next cut in the live staged preview runtime and the existing canonical staged-transform seam
13. 2026-04-16: Implemented `Import-4 / Phase 7.5.4 - 300x300 Preview Grid Toggle` by adding a small bottom-right preview-overlay grid toggle stacked above the shipped zoom-to-fit action, wiring one lightweight `300 x 300` preview-local grid helper into the staged object preview scene, and tightening focused preview proof that the grid toggles on and off without reloading the staged asset or affecting import behavior
12. 2026-04-16: Tightened the `Import-4 / Phase 7.5.4 - 300x300 Preview Grid Toggle` implementation prep so the future grid owner is explicitly a small preview-overlay action like the shipped zoom-to-fit button, stacked above the magnifying-glass action in one bottom-right one-column two-row action group inside the object preview
11. 2026-04-16: Prepped `Import-4 / Phase 7.5.4 - 300x300 Preview Grid Toggle` for implementation by grounding the next preview-local output-reference pass in the live `StagedImportPreviewViewport.tsx` scene/runtime seam, the existing preview-shell control surface in `browser.css`, and the shipped staged preview proof seam so the next cut can add one lightweight grid on or off owner without widening into scale-fix work or import behavior
10. 2026-04-16: Implemented the `Import-4 / Phase 7.5.3` follow-up so staged `Up Axis` changes now rotate the already-loaded preview object in place instead of tearing down and reloading the full preview runtime, making the preview feel much snappier while preserving the shipped preview-local orientation truth
9. 2026-04-16: Implemented `Import-4 / Phase 7.5.3 - Up-Axis Preview Truth` by reusing the canonical staged up-axis rotation meaning in the staged object preview runtime, so the loaded preview object now visibly honors `Z Up`, `Y Up`, and `X Up` before framing, orbit, and zoom-to-fit are applied
8. 2026-04-16: Prepped `Import-4 / Phase 7.5.3 - Up-Axis Preview Truth` for implementation by grounding the next preview-output pass in the live `StagedImportPreviewViewport.tsx` render seam, the staged `upAxis` ownership already surfaced through the import dialog, and the current preview-local test seam so the next cut can make the output preview reflect `Z Up`, `Y Up`, and `X Up` truthfully without widening into commit behavior, grid work, or scale follow-up
7. 2026-04-16: Tightened the shipped `Import-4 / Phase 7.5.1 - Object Preview Zoom-To-Fit` follow-up so preview framing is now truly viewport-aware, updating the fit math to use the live preview aspect instead of one fixed distance heuristic and adding focused proof that narrower preview windows frame the same object from farther away
6. 2026-04-16: Implemented `Import-4 / Phase 7.5.2 - Object Preview Resize-Adjust Bug Repair` by repairing the staged preview camera resize path so aspect changes now refresh the projection matrix before draw, and added focused preview-viewport proof that divider-style size changes re-run the projection update instead of leaving the object visually stretched
5. 2026-04-16: Prepped `Import-4 / Phase 7.5.2 - Object Preview Resize-Adjust Bug Repair` for implementation by grounding the preview stretch bug in the live `StagedImportPreviewViewport.tsx` resize seam, tightening the likely runtime cause to a missing projection-matrix update after camera aspect changes, and locking the next cut to a narrow preview-local resize-correctness repair without widening into output-orientation, grid, or scale work
4. 2026-04-16: Reported the preview resize stretch bug into `Import-4 / Phase 7.5.2 - Object Preview Resize-Adjust Bug Repair` and added a read-only research note that the most likely runtime cause is the preview camera aspect changing during column resize without a matching `camera.updateProjectionMatrix()` call inside the resize render path, which would explain why loaded objects visually stretch after the preview column width changes
3. 2026-04-16: Implemented `Import-4 / Phase 7.5.1 - Object Preview Zoom-To-Fit` by adding a bottom-right magnifying-glass zoom-to-fit action inside the staged preview viewport, reusing the live preview framing seam so loaded staged objects can be refit without affecting import behavior, and tightening Browser proof that the action appears only after a preview load and remains draft-local
2. 2026-04-16: Prepped `Import-4 / Phase 7.5.1 - Object Preview Zoom-To-Fit` for implementation by grounding the first preview follow-up in the live preview camera-framing seam inside `StagedImportPreviewViewport.tsx`, the shipped preview shell styling in `browser.css`, and the current draft-local Browser proof seam so the next cut can add one explicit bottom-right magnifying-glass zoom-to-fit action without widening into resize repair, up-axis truth, grid work, or scale fixes
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 7.5`, splitting the later staged object-preview polish follow-up out of the broader `Phase 7` UI lane so zoom-to-fit, resize repair, preview-output truth, grid toggles, and later scale-fix work can land in smaller one-by-one cuts

### Purpose

This doc owns the later staged object-preview follow-up lane after the initial three-column preview viewport work is already shipped.

Use it to answer:
- what smaller object-preview polish tasks should land after the staged preview viewport already exists
- how later preview-output truth and preview usability should be broken into Codex-sized subphases
- which preview changes stay UI and preview-runtime local without widening into import commit behavior

### Relationship To Parent Doc

Parent lane:
- `Import_Phase Import-4 Phase 7 - UI Cleanup And Polish.md`

This doc exists because:
- the first object-preview viewport lane is already shipped through `Import-4 / Phase 6`
- later preview polish is bigger than a small footnote inside the umbrella `Phase 7` record
- the preview follow-up items are best handled as separate small subphases instead of one broad mixed polish task

Keep the parent `Import-4 / Phase 7` doc as the umbrella later staged-import polish lane.

Use this doc for:
- the detailed planning and phased execution of later staged object-preview polish work

## Doc Body

### Goal

Polish the staged object preview so it is easier to inspect one staged object truthfully before commit, while keeping the preview draft-local and clearly separate from real project-content import behavior.

### Locked Direction

- keep this lane preview-local:
  - no commit-path changes
  - no import-result ownership changes
  - no staged Browser ownership changes
- prefer small visible preview usability wins:
  - view framing
  - resize correctness
  - truthful preview-output orientation
  - optional lightweight preview reference aids
- keep settings and controls honest to what the preview is actually showing
- keep later scale-fix work explicitly separate until the exact issue is explained and scoped

### Likely Architecture Seams

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - strongest seam for preview-scene framing, preview camera treatment, grid overlays, and local preview runtime behavior
- `src/app/panels/useBrowserPanelController.ts`
  - strongest seam for any dialog-local preview state or small preview control ownership that should not persist outside the open staged dialog
- `src/app/panels/browserTreeMenus.tsx`
  - strongest seam for preview controls shown in the staged dialog shell
- `src/app/theme/surfaces/browser.css`
  - strongest seam for preview-column control layout and small preview-shell polish
- `src/app/panels/BrowserPanel.test.tsx`
  - strongest seam for Browser proof around preview control rendering and dialog-local state

## Wishlist Tracking

These wishlist mappings should be read as the planned `Import-4 / Phase 7.5` ladder for later staged object-preview polish after the heavier preview viewport lane is already shipped.

### `Import-4 Phase 7.5.1`
- [x] `1. Object Preview Zoom-To-Fit`
- [x] `1A. Fit The Loaded Object To The Preview Window`
- [x] `1B. Add A Bottom-Right Magnifying-Glass Zoom-To-Fit Action`
- [x] `1C. Keep Zoom-To-Fit Draft-Local`
- [x] `1D. Preserve Orbit Usability After Fit`

### `Import-4 Phase 7.5.2`
- [x] `2. Object Preview Resize-Adjust Bug Repair`
- [x] `2A. Repair Preview Runtime Response To Column Resizing`
- [x] `2B. Keep The Preview Framing Stable During Resize`
- [x] `2C. Preserve Existing Three-Column Session Ownership`

### `Import-4 Phase 7.5.3`
- [x] `3. Up-Axis Preview Truth`
- [x] `3A. Reflect Z Up / Y Up / X Up In The Output Preview`
- [x] `3B. Keep Preview Orientation Truthful To The Current Staged Setting`
- [x] `3C. Preserve Draft-Only Setting Ownership`

### `Import-4 Phase 7.5.4`
- [x] `4. 300x300 Preview Grid Toggle`
- [x] `4A. Add A Grid On Or Off Option In The Preview`
- [x] `4B. Keep The Grid Lightweight And Preview-Local`
- [x] `4C. Preserve A Clean Empty And Loaded Preview Read`

### `Import-4 Phase 7.5.5`
- [x] `5. Scale Preview Truth`
- [x] `5A. Reflect Current / mm / cm / m / in In The Output Preview`
- [x] `5B. Keep Preview Scale Truthful To The Current Staged Setting`
- [x] `5C. Update Preview Scale In Place Without Reloading The Asset`
- [x] `5D. Reuse Canonical Staged Scale Meaning Across Preview And Import`

### `Import-4 Phase 7.5.6`
- [x] `6. Scale Multiplier Paraselect And Custom Sync`
- [x] `6A. Add A Staged Scale Multiplier Row Under Scale Or Units`
- [x] `6B. Make Scale Multiplier The Explicit Numeric Scaling Truth`
- [x] `6C. Sync Preset Scale Or Units Labels From Exact Multiplier Values`
- [x] `6D. Switch Scale Or Units To Custom When The Multiplier Leaves The Preset Set`
- [x] `6E. Prefer mm Over Current When The Multiplier Is Exactly 1`

## [x] `Import-4 Phase 7.5.1 - Object Preview Zoom-To-Fit`

### Purpose

- add one explicit zoom-to-fit owner for the staged object preview so loaded objects frame cleanly inside the preview window

### Goal

- make the staged preview easier to inspect by fitting the loaded object to the preview window without changing any real import behavior

### Locked Direction

- keep this first preview follow-up local to the staged preview viewport
- keep zoom-to-fit compatible with the existing orbit interaction
- avoid widening into preview resize repair, up-axis truth, grid toggles, or scale fixes in this first subphase

### Expected Implementation Shape

- likely update `src/app/panels/StagedImportPreviewViewport.tsx`
- likely update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/panels/browserTreeMenus.tsx` only if one explicit preview control is needed in the shell

### Implementation-Prep Read

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - already owns the local preview scene and orbit behavior
  - already owns the live camera framing through `framePreviewCameraToObject(...)`
  - is the strongest seam for reusing or re-triggering that fit logic for the currently loaded staged object
- `src/app/theme/surfaces/browser.css`
  - already owns the preview shell and canvas frame treatment
  - is the strongest seam for placing one small bottom-right overlay action inside the preview viewport without widening the dialog shell
- the shipped preview viewport currently shows:
  - empty, loading, ready, and failed states
  - local orbit behavior
  - no explicit camera action affordances yet
  - so the next honest move is one explicit zoom-to-fit owner rather than several new preview controls
- `src/app/panels/BrowserPanel.test.tsx`
  - should prove the preview still loads draft-locally and that:
    - the magnifying-glass control appears only when a staged object is loaded
    - the zoom-to-fit action stays inside the staged dialog session
    - orbit remains usable after fit

### First-Pass Decisions

- prefer one truthful preview fit behavior over many new camera controls
- keep the fit logic object-based, not file-type-special-cased if possible
- do not couple this first pass to later resize-bug repair
- use one explicit small magnifying-glass button in the bottom-right corner of the preview viewport as the main user affordance
- only show that button when a staged object is actually loaded in the preview
- keep the first fit pass stateless beyond the current open dialog session

### Exact First Code Cut

1. Audit the current preview camera and object-load flow in `src/app/panels/StagedImportPreviewViewport.tsx`.
2. Add one explicit bottom-right magnifying-glass action for zoom-to-fit inside the preview viewport shell.
3. Reuse or re-trigger the existing framing logic for the currently loaded staged object when that action is invoked.
4. Keep orbit behavior usable after the fit is applied.
5. Add focused proof that the zoom-to-fit pass stays preview-local and does not affect import behavior.

### Likely Files

- `src/app/panels/StagedImportPreviewViewport.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserTreeMenus.tsx`

### No-Widening Rule

- do not fix preview resize bugs here
- do not widen into up-axis truth yet
- do not add grid controls yet
- do not widen into the later scale-fix lane

### Checklist

- [x] add one object preview zoom-to-fit owner
- [x] add a bottom-right magnifying-glass action for zoom-to-fit
- [x] keep zoom-to-fit preview-local and draft-local
- [x] preserve orbit usability after fit
- [x] keep import behavior unchanged
- [x] add focused preview proof

### Verification Shape

Minimum verification for this subphase should cover:

- a loaded staged object can fit cleanly inside the preview window
- the magnifying-glass action appears only when a staged object is loaded
- the fit stays inside the staged dialog preview lane
- orbit still works after fit
- no import behavior, commit behavior, or staged Browser behavior changes land as part of the fit pass

### Done Shape

- the staged object preview can frame one loaded object cleanly for inspection before commit
- the preview now has one small obvious bottom-right zoom-to-fit affordance instead of relying on hidden camera behavior

### Implementation Notes

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now reuses the existing preview framing seam through one draft-local zoom-to-fit action
  - renders a small bottom-right magnifying-glass button only when a staged object is loaded in the preview
  - keeps the fit behavior local to the staged preview viewport and compatible with the existing orbit ownership
  - now uses the live preview aspect while framing, so zoom-to-fit stays truthful after the preview column width changes
- `src/app/theme/surfaces/browser.css`
  - now styles the preview canvas shell and the bottom-right overlay fit button inside the existing preview viewport
- `src/app/panels/BrowserPanel.test.tsx`
  - now proves the zoom-to-fit action is absent before load, appears after a staged preview load, and does not trigger extra import-side behavior

## [x] `Import-4 Phase 7.5.2 - Object Preview Resize-Adjust Bug Repair`

### Purpose

- fix the preview-specific resize issue so the staged object preview responds cleanly when the dialog columns or preview shell resize

### Goal

- stop the staged object preview from visually stretching or distorting loaded objects when the user drags the vertical divider between the preview Browser and the object preview column

### Bug Report

- current user-visible bug:
  - load one staged object into the object preview
  - drag the vertical bar that resizes the preview Browser and object preview columns
  - the preview viewport visually stretches and the object no longer looks correct
- expected read:
  - resizing the preview column should update the preview cleanly without distorting the object

### Read-Only Research

- strongest likely runtime cause in the current code:
  - `src/app/panels/StagedImportPreviewViewport.tsx`
  - `renderScene()` updates:
    - `renderer.setSize(width, height, false)`
    - `camera.aspect = width / height`
  - but does **not** call:
    - `camera.updateProjectionMatrix()`
- why this likely explains the bug:
  - the divider resize changes the preview canvas aspect ratio
  - the preview renderer then draws using a changed `camera.aspect`
  - but the projection matrix is not recomputed for that new aspect
  - that mismatch is a classic cause of stretched or squashed perspective output
- nearby seam read:
  - the preview already uses a `ResizeObserver`, so the resize event path likely *is* firing
  - the bug looks more like incomplete camera resize handling than missing resize observation
- secondary risk to validate later:
  - even after projection-matrix repair, we may still want to check whether repeated resize should also preserve fit/framing more explicitly
  - but the immediate stretch symptom most likely comes from the missing projection-matrix update

### Likely Fix Direction

- keep the first fix narrow:
  - repair the preview camera resize path so aspect and projection stay in sync
- only widen into framing refinements if the visual stretch is fixed but the preview still feels compositionally unstable during resize

### Locked Direction

- keep this subphase preview-local:
  - no staged import contract changes
  - no preview Browser ownership changes
  - no commit-path changes
- treat the current bug first as resize correctness:
  - keep the object visually undistorted when the preview column width changes
- preserve the shipped three-column session ownership and the shipped zoom-to-fit affordance
- only widen beyond projection-matrix repair if the stretch bug remains after the resize path is made mathematically correct

### Expected Implementation Shape

- likely update `src/app/panels/StagedImportPreviewViewport.tsx`
- likely update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/theme/surfaces/browser.css` only if a tiny preview-shell hook is needed for more reliable resize proof or layout timing

### Implementation-Prep Read

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - already owns:
    - the preview renderer
    - the preview camera
    - the local `ResizeObserver`
    - the render loop and resize path
  - is the strongest seam for fixing the stretch bug because the distortion appears after the divider changes the canvas aspect
- the current runtime already recalculates:
  - preview width
  - preview height
  - `camera.aspect`
  - renderer size
  - so the strongest missing step is not new resize detection, but completing the perspective-camera resize contract correctly
- `src/app/panels/BrowserPanel.test.tsx`
  - is the strongest existing Browser proof seam for the staged preview lane
  - should likely prove that divider resizing keeps the preview shell stable without forcing a wider viewer-runtime test harness
- the shipped `7.5.1` zoom-to-fit affordance should stay intact:
  - resizing should not retire or fight that preview-local camera control

### First-Pass Decisions

- prefer the narrowest mathematically correct camera-resize fix first
- keep the fix inside the preview runtime instead of widening into controller or dialog state
- do not reinterpret resize as a hidden auto-fit event in this first pass
- preserve the current preview scene, orbit ownership, and loaded-object ownership
- only add extra resize stabilization if the aspect-plus-projection repair alone is insufficient

### Exact First Code Cut

1. Audit the current resize path inside `src/app/panels/StagedImportPreviewViewport.tsx`.
2. Repair the preview camera resize sequence so aspect changes are followed by the required projection update before drawing.
3. Verify the object preview no longer stretches when the divider between the preview Browser and object preview is dragged.
4. Keep the shipped zoom-to-fit control and orbit behavior working after resize.
5. Add focused proof that the preview resize bug is repaired without changing staged import behavior.

### Likely Files

- `src/app/panels/StagedImportPreviewViewport.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`

### No-Widening Rule

- do not add preview grid work here
- do not widen into up-axis output truth here
- do not change preview selection ownership here
- do not widen into the later scale-fix lane here
- do not redesign divider behavior or persist divider widths here

### Checklist

- [x] repair preview runtime response to column resizing
- [x] keep the preview camera projection in sync with aspect changes
- [x] stop visible object stretch during divider resize
- [x] preserve the shipped zoom-to-fit and orbit behavior
- [x] keep the preview draft-local and session-local
- [x] add focused proof for the repaired resize path

### Verification Shape

Minimum verification for this subphase should cover:

- load one staged object into the preview
- resize the preview column through the existing divider path
- confirm the preview object no longer visually stretches or squashes
- confirm the preview remains usable afterward:
  - orbit still works
  - zoom-to-fit still works
- confirm no staged import settings or commit behavior changes land as part of the resize repair

### Done Shape

- dragging the divider between the preview Browser and object preview no longer distorts the loaded staged object
- the preview resize path reads as stable and mathematically correct instead of stretched
- the fix stays inside the preview-runtime lane and does not widen into later output-truth or scale work

### Implementation Notes

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now completes the preview resize contract by updating the perspective-camera projection matrix after aspect changes and before drawing the resized frame
  - keeps the fix entirely inside the existing preview-local runtime and preserves the shipped zoom-to-fit plus orbit ownership
- `src/app/panels/StagedImportPreviewViewport.test.tsx`
  - now proves the resize-observer path reruns the projection update when the preview viewport aspect changes, which is the narrow correctness seam behind the reported stretch bug

## [x] `Import-4 Phase 7.5.3 - Up-Axis Preview Truth`

### Purpose

- make the staged output preview reflect the currently selected `Up Axis` setting truthfully

### Goal

- let the object preview visibly match the current staged `Up Axis` choice so `Z Up`, `Y Up`, and `X Up` are not only settings text but are also reflected in the rendered preview output before commit

### Locked Direction

- keep this subphase preview-local:
  - no commit-path changes
  - no accepted transform changes
  - no staged Browser ownership changes
- treat the preview as an honest read of the current staged setting:
  - changing `Up Axis` should change the preview orientation
- preserve the shipped preview selection, zoom-to-fit, orbit, and resize behavior
- do not widen into grid work or later scale-fix work here

### Expected Implementation Shape

- likely update `src/app/panels/StagedImportPreviewViewport.tsx`
- likely update `src/app/panels/BrowserPanel.test.tsx`
- update `src/app/panels/browserTreeMenus.tsx` only if one tiny helper copy change is needed to clarify that the preview now reflects the current `Up Axis`

### Implementation-Prep Read

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - already owns:
    - staged asset loading
    - local preview scene creation
    - camera framing
    - orbit controls
  - is the strongest seam for applying the current staged `upAxis` before the preview is framed and rendered
- the staged `upAxis` setting already exists and is already draft-owned:
  - `src/app/store/useAppStore.ts`
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/panels/browserTreeMenus.tsx`
  - so the missing piece is not setting ownership, but making the preview honor that existing setting visually
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged settings surface and the preview lane separately
  - is the strongest existing seam for proving that changing `Up Axis` changes the preview-output truth while staying draft-local
- likely runtime shape:
  - apply a local orientation transform to the loaded preview object before camera framing
  - keep that transform preview-only and derived from the same staged `upAxis` meaning already used elsewhere in the import flow

### First-Pass Decisions

- prefer reusing the existing staged `upAxis` meaning rather than inventing a preview-only interpretation
- apply the orientation at the preview-object level, not by rotating the whole preview camera rig
- keep the preview output honest even if the environment is in the non-WebGL fallback state:
  - helper copy should still remain truthful about what the preview is meant to show
- avoid adding a second `Up Axis` control inside the preview column

### Exact First Code Cut

1. Audit the current staged `upAxis` ownership and the preview object-load path.
2. Add one preview-local orientation application step so the loaded staged object is rotated according to the current staged `upAxis`.
3. Make sure camera framing and zoom-to-fit still operate on the already-oriented preview object.
4. Verify that switching `Z Up`, `Y Up`, and `X Up` changes the output preview truthfully without affecting import commit behavior.
5. Add focused proof for the preview-orientation change.

### Likely Files

- `src/app/panels/StagedImportPreviewViewport.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserTreeMenus.tsx`

### No-Widening Rule

- do not add grid work here
- do not widen into scale correction here
- do not change accepted transform behavior here
- do not add persisted preview camera state here
- do not redesign the preview viewport shell here

### Checklist

- [x] reflect `Z Up`, `Y Up`, and `X Up` in the output preview
- [x] keep preview orientation truthful to the current staged setting
- [x] preserve draft-only setting ownership
- [x] preserve zoom-to-fit, orbit, and resize behavior
- [x] keep commit behavior unchanged
- [x] add focused preview proof

### Verification Shape

Minimum verification for this subphase should cover:

- load one staged object into the preview
- change `Up Axis` through the existing staged setting control
- confirm the preview output changes orientation to match that choice
- confirm zoom-to-fit still frames the newly oriented object correctly
- confirm orbit and divider resizing still work afterward
- confirm no staged import commit behavior changes land as part of this pass

### Done Shape

- the object preview becomes a truthful read of the current staged `Up Axis` setting
- users can see the effect of `Z Up`, `Y Up`, and `X Up` before commit instead of relying on settings text alone

### Implementation Notes

- `src/app/references/stagedImportTransforms.ts`
  - now owns the canonical staged `Up Axis` rotation meaning so preview output and accepted import transforms can stay aligned
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now applies the staged `Up Axis` rotation to the loaded preview object before camera framing, zoom-to-fit, and orbit behavior run
  - keeps this orientation preview-local and derived from the same staged setting the import flow already owns
- focused proof now covers:
  - the shared canonical up-axis mapping
  - the preview runtime applying that mapping to the loaded staged object

### Follow-Up Note

- follow-up resolved:
  - staged `Up Axis` changes now keep the already-loaded preview object alive
  - the preview now applies the new up-axis rotation in place
  - staged asset load and full preview-runtime teardown are only rerun when the actual previewed file changes

## [x] `Import-4 Phase 7.5.4 - 300x300 Preview Grid Toggle`

### Purpose

- add one lightweight preview-local grid option so users can inspect staged object orientation against a simple reference plane

### Goal

- give the staged object preview one explicit grid on or off owner so users can inspect orientation and scale cues against a simple `300 x 300` reference plane without affecting import behavior

### Locked Direction

- keep this subphase preview-local:
  - no commit-path changes
  - no staged Browser ownership changes
  - no import-setting changes
- treat the grid as an optional reference aid:
  - off should remain a clean preview read
  - on should add one lightweight `300 x 300` ground reference only
- preserve the shipped preview selection, zoom-to-fit, resize behavior, and up-axis truth
- do not widen into the later scale-fix lane here
- render the grid owner as a small preview-overlay action:
  - same general affordance family as the shipped zoom-to-fit action
  - anchored bottom-right inside the object preview
  - stacked above zoom-to-fit in one one-column two-row action group

### Expected Implementation Shape

- likely update `src/app/panels/StagedImportPreviewViewport.tsx`
- likely update `src/app/panels/browserTreeMenus.tsx`
- likely update `src/app/theme/surfaces/browser.css`
- likely update `src/app/panels/BrowserPanel.test.tsx`

### Implementation-Prep Read

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - already owns:
    - the local preview scene
    - preview object loading
    - preview camera framing
    - the overlay zoom-to-fit control
  - is the strongest seam for adding one lightweight preview-only grid helper because the scene/runtime already lives there
- the shipped preview runtime already supports:
  - empty, loading, failed, and ready reads
  - local orbit ownership
  - zoom-to-fit
  - truthful up-axis rotation
  - so the next honest move is one optional reference aid, not a broader preview-runtime redesign
- `src/app/panels/browserTreeMenus.tsx`
  - already owns staged-card shell controls and helper copy
  - is the strongest seam if one tiny preview-local toggle needs to be surfaced alongside the existing `Load Into Preview Viewport` flow or inside the preview shell header
- `src/app/theme/surfaces/browser.css`
  - already owns the preview column shell and overlay control styling
  - is the strongest seam for a small grid toggle affordance that should feel consistent with the shipped preview actions
  - should likely own the bottom-right stacked action-column layout for:
    - top row: grid on or off
    - bottom row: zoom-to-fit
- `src/app/panels/BrowserPanel.test.tsx`
  - is the strongest existing Browser proof seam for showing:
    - the grid owner appears only when it makes sense
    - the control stays local to the open staged dialog
    - preview load behavior and import behavior remain unchanged

### First-Pass Decisions

- prefer one explicit `Grid` on or off control over multiple visual-reference options
- keep the grid plane lightweight and preview-only rather than introducing a heavy environment overlay
- use one fixed `300 x 300` reference size in this first pass
- keep the first implementation session-local:
  - no persistence outside the open staged dialog
- do not make the grid a hidden default-on behavior
- use one small overlay button for the grid toggle instead of a header control or card-level setting row
- keep the grid toggle visually grouped with zoom-to-fit as one bottom-right stacked preview-action cluster

### Exact First Code Cut

1. Audit the current preview scene/runtime seam in `src/app/panels/StagedImportPreviewViewport.tsx`.
2. Add one dialog-local `Grid` on or off owner for the staged object preview.
3. Render that grid owner as a small bottom-right overlay button stacked above the shipped zoom-to-fit button.
4. Render one lightweight `300 x 300` reference grid only when that owner is enabled.
5. Keep the grid distinct from the loaded staged object and preserve zoom-to-fit, orbit, resize, and up-axis behavior.
6. Add focused proof that the grid stays preview-local and does not affect import behavior or staged file ownership.

### Likely Files

- `src/app/panels/StagedImportPreviewViewport.tsx`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

### No-Widening Rule

- do not widen into scale correction here
- do not change import commit behavior here
- do not add persisted preview preferences here
- do not redesign the preview shell here
- do not widen into more than one grid style or size here

### Checklist

- [x] add one preview-local `300 x 300` grid owner
- [x] add a small bottom-right grid on or off overlay button
- [x] stack the grid toggle above zoom-to-fit in one preview-action column
- [x] keep the grid lightweight and distinct from the loaded object
- [x] preserve a clean empty and loaded preview read
- [x] preserve zoom-to-fit, orbit, resize, and up-axis truth
- [x] keep import behavior unchanged
- [x] add focused preview proof

### Verification Shape

Minimum verification for this subphase should cover:

- load one staged object into the preview
- enable the grid and confirm the preview shows one `300 x 300` reference plane
- disable the grid and confirm the preview returns to the clean prior read
- confirm zoom-to-fit, orbit, resize, and up-axis behavior still work with and without the grid
- confirm no staged import contract or commit behavior changes land as part of this pass

### Done Shape

- the staged object preview has one optional `300 x 300` grid reference aid
- users can toggle that aid on and off without affecting import behavior
- the preview remains clean, draft-local, and truthful when the grid is off

### Implementation Notes

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now adds one lightweight `300 x 300` preview-local `GridHelper` to the staged object preview scene
  - now renders a small bottom-right overlay grid-toggle action stacked above the shipped zoom-to-fit button
  - keeps the grid helper local to the preview runtime so toggling it does not reload the staged asset or affect import behavior
- `src/app/theme/surfaces/browser.css`
  - now styles the preview overlay controls as one bottom-right one-column two-row action stack
- `src/app/panels/StagedImportPreviewViewport.test.tsx`
  - now proves the grid toggle appears beside the shipped zoom-to-fit action, toggles the preview-local grid helper on and off, and does not trigger extra asset loads

## [x] `Import-4 Phase 7.5.5 - Scale Preview Truth And Snappy In-Place Scale Updates`

### Purpose

- make the staged object preview reflect the current `Scale / Units` setting truthfully while keeping scale updates fast and preview-local

### Goal

- let the object preview visibly change size when the staged `Scale / Units` setting changes so `Current`, `mm`, `cm`, `m`, and `in` are reflected in the preview output before commit, without tearing down and reloading the preview runtime

### Locked Direction

- keep this subphase preview-local:
  - no commit-path changes
  - no staged Browser ownership changes
  - no import-setting surface changes
- treat preview scale as an honest read of the current staged setting:
  - changing `Scale / Units` should change the rendered preview size
- preserve the shipped preview selection, zoom-to-fit, resize behavior, up-axis truth, and optional grid toggle
- keep scale updates efficient:
  - no staged asset reload when only `scaleAlignment` changes
  - no full preview-runtime teardown when only `scaleAlignment` changes

### Expected Implementation Shape

- likely update `src/app/references/stagedImportTransforms.ts`
- likely update `src/app/references/stagedImportTransforms.test.ts`
- likely update `src/app/panels/StagedImportPreviewViewport.tsx`
- likely update `src/app/panels/StagedImportPreviewViewport.test.tsx`
- likely update `src/app/store/useAppStore.ts` only if the accepted-transform seam should consume the same canonical scale helper more directly

### Implementation-Prep Read

- `src/app/panels/StagedImportPreviewViewport.tsx`
  - already owns:
    - staged asset loading
    - local preview scene creation
    - camera framing
    - in-place `Up Axis` updates on the already-loaded preview object
    - the local preview runtime ref that keeps the loaded object alive across staged-setting changes
  - is the strongest seam for making `Scale / Units` updates just as snappy as the shipped `Up Axis` follow-up
- `src/app/references/stagedImportTransforms.ts`
  - already owns the canonical staged up-axis rotation meaning
  - is the strongest seam for adding the canonical staged scale multiplier meaning so preview output and accepted import transforms can stay aligned
- the shipped preview runtime already distinguishes:
  - real file changes, which should reload
  - `upAxis` changes, which now rotate in place
  - so the next honest move is to treat `scaleAlignment` the same way:
    - transform in place
    - then reframe the camera
- `src/app/panels/StagedImportPreviewViewport.test.tsx`
  - already proves:
    - viewport-aware fit behavior
    - resize correctness
    - truthful up-axis output
    - in-place up-axis updates
    - grid-toggle locality
  - is the strongest seam for proving:
    - scale changes visibly affect the preview
    - scale changes do not reload the asset
    - camera framing remains truthful after scale changes

### First-Pass Decisions

- prefer one canonical staged scale helper over preview-only scale math
- apply preview scale at the loaded object level, not by moving the camera alone
- keep `Current` as the no-override baseline for the preview
- re-run fit after scale changes so the preview remains readable at every staged size
- treat scale changes like the shipped up-axis follow-up:
  - keep the loaded object alive
  - update it in place
  - reload only when the actual file changes

### Exact First Code Cut

1. Audit the current staged `scaleAlignment` ownership and the accepted-transform seam.
2. Add one canonical staged scale multiplier helper alongside the existing staged transform helper.
3. Update the staged preview runtime so the loaded preview object applies that scale in place.
4. Keep `scaleAlignment` changes out of the asset-load effect so the preview does not reload when only scale changes.
5. Refit the preview camera after scale changes while preserving zoom-to-fit, orbit, resize, up-axis truth, and the optional grid.
6. Add focused proof that preview scale changes are truthful and in-place.

### Likely Files

- `src/app/references/stagedImportTransforms.ts`
- `src/app/references/stagedImportTransforms.test.ts`
- `src/app/panels/StagedImportPreviewViewport.tsx`
- `src/app/panels/StagedImportPreviewViewport.test.tsx`
- `src/app/store/useAppStore.ts`

### No-Widening Rule

- do not widen into deeper unit-detection work here
- do not redesign the preview shell here
- do not add new scale controls here
- do not widen into commit-path behavior changes here
- do not widen into file-format-specific unit heuristics here

### Checklist

- [x] reflect `Current`, `mm`, `cm`, `m`, and `in` in the output preview
- [x] keep preview scale truthful to the current staged setting
- [x] update preview scale in place without reloading the staged asset
- [x] reuse canonical staged scale meaning across preview and import
- [x] preserve zoom-to-fit, orbit, resize, up-axis truth, and grid behavior
- [x] keep commit behavior unchanged
- [x] add focused preview proof

### Verification Shape

Minimum verification for this subphase should cover:

- load one staged object into the preview
- change `Scale / Units` through the existing staged setting control
- confirm the preview output changes size to match that choice
- confirm the same loaded asset stays alive while scale changes happen
- confirm zoom-to-fit still frames the newly scaled object correctly
- confirm orbit, resize, up-axis changes, and the optional grid still work afterward
- confirm no staged import contract or commit behavior changes land as part of this pass

### Done Shape

- the object preview becomes a truthful read of the current staged `Scale / Units` setting
- users can see the size effect of `Current`, `mm`, `cm`, `m`, and `in` before commit
- scale changes feel snappy because the preview updates in place instead of reloading the asset

### Implementation Notes

- `src/app/references/stagedImportTransforms.ts`
  - now owns the canonical staged scale-factor meaning beside the shipped up-axis rotation helper so preview output and accepted import transforms can stay aligned
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now applies staged preview scale directly on the already-loaded preview object
  - now treats `scaleAlignment` changes like the shipped fast `upAxis` path:
    - keep the preview runtime alive
    - update the loaded object in place
    - refit the camera without reloading the asset
- `src/app/store/useAppStore.ts`
  - now reuses the shared canonical staged scale helper for accepted-transform override truth instead of owning a duplicate local scale mapping
- focused proof now covers:
  - the shared canonical scale-factor mapping
  - the preview runtime updating loaded object scale in place when only `Scale / Units` changes

## [x] `Import-4 Phase 7.5.6 - Scale Multiplier Paraselect And Custom Sync`

### Purpose

- add one explicit numeric `Scale Multiplier` control under `Scale / Units` so the staged import dialog exposes the actual multiplier being applied and keeps that numeric truth synced with the preset units read

### Goal

- make the staged scale system read more honestly by:
  - exposing the live numeric multiplier directly
  - keeping `Scale / Units` in sync with preset-equivalent multiplier values
  - switching `Scale / Units` to `Custom` when the multiplier no longer matches a preset

### Locked Direction

- keep this later pass staged-dialog and preview-local:
  - no commit-path redesign
  - no asset-reload-on-slider-drag behavior
  - no file-format-specific unit-detection widening
- treat the `Scale Multiplier` as the numeric source of truth
- treat `Scale / Units` as the synced preset read layered on top of that numeric source
- keep both `Current` and `mm` available as future-facing labels, but when the multiplier is exactly `1`, prefer `mm` over `Current`

### Expected Implementation Shape

- likely update `src/app/store/useAppStore.ts`
- likely update `src/app/panels/browserTreeMenus.tsx`
- likely update `src/app/theme/surfaces/browser.css`
- likely update `src/app/panels/BrowserPanel.test.tsx`
- likely update `src/app/panels/StagedImportPreviewViewport.tsx` only if the later slider should drive the already-shipped in-place scale preview path directly

### First-Pass Direction

- add one new staged `Scale Multiplier` row directly under `Scale / Units`
- render that new row through a para-style slider or equivalent staged numeric control
- keep the multiplier and preset units synchronized bidirectionally:
  - preset chosen -> multiplier updates
  - multiplier dragged to a preset value -> units show that preset
  - multiplier dragged to a non-preset value -> units show `Custom`
- lock the first exact preset mapping like this:
  - `1` -> `mm`
  - `10` -> `cm`
  - `1000` -> `m`
  - `25.4` -> `in`
  - any other value -> `Custom`

### No-Widening Rule

- do not widen this future phase into deeper unit-detection work
- do not redesign the shipped `7.5.5` in-place preview scaling contract
- do not collapse `Current` and `mm` into one label
- do not widen into file-type-specific authored-unit inference here

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - currently owns only the staged `scaleAlignment` enum value
  - already exposes `setStagedImportFileScaleAlignment(...)`
  - does not yet expose a separate numeric staged multiplier owner
  - is the strongest seam for introducing one explicit numeric staged scale multiplier while keeping the existing staged file contract centralized
- `src/app/panels/browserTreeMenus.tsx`
  - currently renders:
    - `Import As` through `ParaSelect`
    - `Up Axis` through `ParaSelect`
    - `Scale / Units` through `ParaSelect`
  - does not yet render a second scale row underneath `Scale / Units`
  - is the strongest seam for adding the new `Scale Multiplier` row and keeping the multiplier plus preset read visually grouped
- `src/app/theme/surfaces/browser.css`
  - already owns the staged-card settings layout and the current para-select grouping
  - is the strongest seam for introducing one additional staged settings row without widening into broader staged-card redesign
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - already supports the shipped fast-path pattern:
    - keep the preview runtime alive
    - apply staged transform changes in place
    - re-fit without reloading on settings-only changes
  - means `7.5.6` should reuse that already-shipped preview-scale path instead of inventing a second preview-scaling mechanism
- `src/app/references/stagedImportTransforms.ts`
  - already owns the canonical staged scale-factor mapping for:
    - `Current`
    - `mm`
    - `cm`
    - `m`
    - `in`
  - is the strongest seam for adding preset-label resolution from a numeric multiplier so store, UI, and preview stay aligned
- `src/app/panels/BrowserPanel.test.tsx`
  - is the strongest staged-dialog proof seam for:
    - preset to multiplier sync
    - multiplier to preset sync
    - `Custom` read off-preset
    - the locked `1 -> mm` rule

### First-Pass Decisions

- make the numeric scale multiplier the canonical staged value
- keep `Scale / Units` as the preset label layer on top of that value
- introduce `Custom` as a first-class staged read when the multiplier does not match a preset exactly
- prefer deterministic exact-value mapping in the first pass:
  - do not add fuzzy tolerance matching unless a real usability issue appears
- preserve both `Current` and `mm` as labels in the broader system, but for exact multiplier `1` resolve the visible preset read to `mm`
- let preset selection and multiplier dragging both drive the same staged numeric owner

### Exact First Code Cut

1. Audit the current staged scale ownership in `src/app/store/useAppStore.ts` and the existing `Scale / Units` `ParaSelect` in `src/app/panels/browserTreeMenus.tsx`.
2. Add one explicit numeric staged scale multiplier owner plus setter to the staged import file record.
3. Add or extend shared staged-transform helpers so the app can:
   - resolve preset multiplier values
   - resolve a visible preset label from an exact multiplier
   - return `Custom` when no preset matches
   - prefer `mm` over `Current` when the multiplier is exactly `1`
4. Render one new `Scale Multiplier` row directly under `Scale / Units` in the staged file card.
5. Keep preset and multiplier changes bidirectionally synchronized without reloading the preview asset.
6. Tighten Browser proof for:
   - preset -> multiplier sync
   - multiplier -> preset sync
   - off-preset -> `Custom`
   - exact `1 -> mm`

### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/references/stagedImportTransforms.ts`
- `src/app/references/stagedImportTransforms.test.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/StagedImportPreviewViewport.tsx`

### Checklist

- [x] add one staged `Scale Multiplier` owner and setter
- [x] add a `Scale Multiplier` row under `Scale / Units`
- [x] make the multiplier the numeric source of truth
- [x] sync preset `Scale / Units` labels from exact multiplier values
- [x] switch `Scale / Units` to `Custom` when the multiplier leaves the preset set
- [x] prefer `mm` over `Current` when the multiplier is exactly `1`
- [x] preserve the shipped in-place preview scale updates
- [x] add focused staged-dialog and transform proof

### Verification Shape

Minimum verification for this subphase should cover:

- choosing a preset updates the numeric multiplier row correctly
- dragging or changing the multiplier to an exact preset value updates `Scale / Units` to that preset
- changing the multiplier to a non-preset value updates `Scale / Units` to `Custom`
- exact multiplier `1` resolves to `mm`, not `Current`
- preview scale still updates through the shipped in-place fast path instead of reloading the asset
- no commit behavior or file-format-specific unit-detection work lands as part of this pass

### Done Shape

- the staged dialog exposes the actual numeric scale multiplier directly
- `Scale / Units` becomes an honest synced preset read on top of that numeric truth
- the staged preview remains fast because scale changes still update the already-loaded object in place

### Implementation Notes

- `src/app/references/stagedImportTransforms.ts`
  - now resolves the staged numeric multiplier from either legacy preset state or the explicit stored multiplier
  - now resolves the visible preset read from exact multiplier values and returns `Custom` when no preset matches
  - now locks the exact `1 -> mm` read instead of surfacing `Current` for that multiplier
- `src/app/store/useAppStore.ts`
  - now stores one explicit staged `scaleMultiplier` beside the existing preset read
  - now derives `scaleAlignment` from multiplier changes and keeps preset picks writing back through the same numeric source of truth
  - now commits accepted transform overrides from the numeric multiplier instead of only from the preset enum
- `src/app/panels/browserTreeMenus.tsx`
  - now renders one `Scale Multiplier` `ParaSlider` directly under `Scale / Units`
  - now keeps the staged card read honest by showing `Custom` only when the multiplier leaves the preset set
- `src/app/panels/StagedImportPreviewViewport.tsx`
  - now reads the shared numeric multiplier directly so the shipped in-place preview scale update path stays intact
- focused proof now covers:
  - exact multiplier and preset-label mapping
  - staged dialog preset-to-multiplier and multiplier-to-`Custom` sync
  - in-place preview rescaling from explicit multiplier changes
  - accepted-transform override scale truth for custom multipliers

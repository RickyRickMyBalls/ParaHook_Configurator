# `Import-3` - `Import Window Structure Review And Add-To-Project Settings`

## Doc Header

### Doc History
11. 2026-04-16: Added `Import-3 / Phase 3B - Staged File List Polish Pass` between the staged-list implementation and the later structure-read phase, giving overflow and usability refinements their own narrow home and seeding that new polish lane with the first explicit wishlist item for adding a scrollbar to the staged file list
10. 2026-04-16: Implemented `Import-3 / Phase 3 - Staged File List And Multi-File Review` by rendering a visible staged-file review area inside the browser-owned `Import Files` dialog, showing one ordered row per staged file with file-name and file-type labels, and proving that repeated Browser intake appends into that review list without mutating project content
9. 2026-04-16: Prepped `Import-3 / Phase 3 - Staged File List And Multi-File Review` for implementation by grounding the next staged-import cut in the shipped staged-file draft contract, the current `Import Files` dialog shell, the existing in-dialog Browser intake path, and focused Browser proof targets so the next pass can render honest staged file rows plus readable review order without widening into structure parsing or per-file import settings yet
8. 2026-04-16: Implemented `Import-3 / Phase 2 - Supported Types And Browser Intake` by widening the staged-import draft seam to hold staged file records, adding one multi-type in-dialog `Browser` intake path plus supported `.step`, `.stl`, `.obj`, and `.glb` display inside the shipped `Import Files` dialog, and proving that staged file intake stays draft-only while the older direct import rows remain live as compatibility actions
7. 2026-04-16: Prepped `Import-3 / Phase 2 - Supported Types And Browser Intake` for implementation by grounding the next staged-import cut in the live import-picker helpers, the shipped browser-owned `Import Files` shell, the minimal staged-import draft seam, and focused Browser proof targets so the next pass can add supported-type copy plus one in-window `Browser` intake path without widening into staged-list review, structure parsing, or commit behavior yet
6. 2026-04-16: Implemented `Import-3 / Phase 1 - Menu Entry And Floating Window Shell` by adding `Import Files...` as the first Browser `Import Reference` menu action, shipping one browser-owned transient `Import Files` dialog backed by a minimal store-owned staged-import draft seam, and proving that cancel or close leaves project content unchanged while the older direct import rows stay live as compatibility actions during the first staged-import cut
5. 2026-04-16: Prepped `Import-3 / Phase 1 - Menu Entry And Floating Window Shell` for implementation by grounding the first staged-import cut in the live Browser `Import Reference` menu, the current direct `handleImportReferenceFile(...)` controller path, the Browser-owned floating shell infrastructure, and the Browser panel styling seam so the next pass can add the new `Import Files...` entry plus one transient import-window shell without widening into file intake or project commit behavior yet
4. 2026-04-16: Rebuilt the `Import-3` phase ladder and `## Wishlist Organization` against the fuller `Import-3` vision so every concrete staged-import behavior now has an owning phase, expanding the old six-phase plan into a more Codex-sized ladder that explicitly covers the `Import Files...` menu entry, supported file types, Browser intake row, staged file list, structure read, import mode choice, preview Browser organization, up-axis, scale or units alignment, `New Assembly`, final commit, and narrow cleanup
3. 2026-04-16: Expanded `Import-3` around staged organization before commit, documenting that the import window should expose a preview-style Browser with rows plus easy drag-and-drop into components and sub-assemblies so the accepted imports can land already organized when the user clicks `Add To Project`
2. 2026-04-16: Added a dedicated `## Wishlist Organization` section for `Import-3`, mapping the staged import-window request into one phase-by-phase wishlist ladder so future wishlist items can live under the exact phase expected to land them and later be checked off in place when they ship
1. 2026-04-16: Created this standalone future phase doc for `Import-3`, turning the next staged-import request into a dedicated import-family lane so imported reference files can first land in an import window for file-type and structure review, split-versus-single-object choice, units setup, and explicit `Add to Project` acceptance instead of going straight into project content

### Purpose

This doc defines the later import-family phase for a real pre-add import window.

Use it to answer:
- how imported reference files should stage before they become project content
- which current seams already know file type, part structure, and later exploded provenance
- how the import window should separate inspection settings from accepted project ownership
- how structured files should let the user choose one object versus many part-backed objects
- how unit choice should become an explicit accepted import setting

### Why This Phase Exists

`Import-1` shipped the first batch lane for `.obj`.

`Import-2` is the planned parity pass for the rest of the current supported menu file types.

Once that parity exists, the next honest user need is not another picker widening.

The next honest user need is a real import window before project commit.

The current code-backed read is:
- `src/app/references/importReferenceFile.ts`
  - returns accepted local files from the picker
  - does not create an import draft or inspection result
- `src/app/panels/useBrowserPanelController.ts`
  - resolves the Browser landing parent
  - currently sends selected files straight into `addImportedReference(...)`
  - does not stop on an import-window review step
- `src/app/store/useAppStore.ts`
  - stores imported references only after they are already accepted into project content
  - does not currently hold a separate import-draft state for staged settings such as units or split mode
- `src/viewer/referencePartDescriptors.ts`
  - already extracts meaningful per-mesh part labels when a loaded reference has multiple leaf meshes
  - currently exposes that read only after the import is already part of the project
- `src/viewer/Viewer.ts`
  - already keeps part-descriptor and exploded-provenance seams for loaded references
  - already knows how to isolate truthful per-part content later through the explode path
- `src/app/references/referenceManifest.ts`
  - already has a display-transform seam with scale support
  - suggests unit normalization should become an explicit import decision instead of a hidden viewer-only fix

That means the app already has several pieces needed for a staged import flow, but they are all currently downstream from acceptance.

`Import-3` exists so the user can inspect and decide before the imported result becomes project content.

## Doc Body

## Wishlist Organization

### Wishlist Header
Use the `Import-3` phases to organize wishlist items like this:

- put each wishlist item under the one phase that should own it first
- leave achieved wishlist items in place and change them from `[ ]` to `[x]`
- if a wish grows beyond one phase, keep the first owned entry where it belongs and add the wider follow-on to the later phase instead of moving history around

### `Import-3 Phase 1`
- [x] `0. Import Files Menu Entry Under Browser Plus`
- [x] `1. Import Files Entry Opens A Floating Import Window`
- [x] `2. Import Window Opens Before Project Commit`
- [x] `3. Cancel Or Close Leaves Project Content Unchanged`
#### implementation target:
  - add the `Import Files...` entry and the first floating staged-import window shell without committing project content yet

### `Import-3 Phase 2`
- [x] `4. Supported File Types Are Shown In The Import Window`
- [x] `5. Browser Row Adds Local Files Into The Import Draft`
- [x] `6. Import Files Flow Supports .step`
- [x] `7. Import Files Flow Supports .stl`
- [x] `8. Import Files Flow Supports .obj`
- [x] `9. Import Files Flow Supports .glb`
#### implementation target:
  - add the supported-type read and the Browser intake row so local files stage inside the import window instead of going straight into project content

### `Import-3 Phase 3`
- [x] `10. Selected Files Appear As A Staged File List`
- [x] `11. Staged File Rows Show File Type`
- [x] `12. Multi-File Selection Can Be Reviewed Before Commit`
- [x] `13. Staged File Ordering Stays Clear`
#### implementation target:
  - turn accepted local files into a clear staged file list the user can review before any structure or commit decisions land

### `Import-3 Phase 3B`
- [ ] `13B. Staged File List Has A Scroll Bar`
#### implementation target:
  - add the first narrow staged-list polish pass so the visible review area stays usable when many files are staged

### `Import-3 Phase 4`
- [ ] `14. Structure Read Shows Multiple Objects`
- [ ] `15. Structure Read Shows Hierarchy`
- [ ] `16. Structure Read Shows Parts`
- [ ] `17. Meaningful Structure Labels Are Shown When They Exist`
- [ ] `18. Flat Files Stay Honest Instead Of Showing Fake Hierarchy`
#### implementation target:
  - inspect each staged file and surface the best honest structure read available without inventing fake hierarchy

### `Import-3 Phase 5`
- [ ] `19. Import As 1 Object Option`
- [ ] `20. Import As Multiple Objects In 1 Component Option`
- [ ] `21. Structured Import Choice Appears Only When Supported`
- [ ] `22. Split Import Reuses Truthful Per-Part Provenance`
#### implementation target:
  - let structured files choose between one-object import and multiple-objects-in-one-component import without widening into fake Browser-only ownership

### `Import-3 Phase 6`
- [ ] `23. Preview Browser Rows For Staged Import Organization`
- [ ] `24. Drag And Drop Staged Import Objects Into Components`
- [ ] `25. Drag And Drop Staged Import Objects Into Sub-Assemblies`
- [ ] `26. Pre-Commit Organization Is Preserved On Add To Project`
#### implementation target:
  - expose a preview Browser organization surface so the user can organize staged import rows before final commit

### `Import-3 Phase 7`
- [ ] `27. Z Up Option`
- [ ] `28. Y Up Option`
- [ ] `29. X Up Option`
- [ ] `30. Orientation Choice Becomes Accepted Import Truth`
#### implementation target:
  - make up-axis an explicit staged import decision instead of a hidden post-import correction

### `Import-3 Phase 8`
- [ ] `31. Scale Alignment In The Import Window`
- [ ] `32. Units Alignment In The Import Window`
- [ ] `33. Accepted Scale Or Units Become Import-Owned Truth`
- [ ] `34. Scale Or Units Correction Is Not Hidden As A Viewer-Only Fix`
#### implementation target:
  - make scale and units alignment an explicit staged import decision before the file becomes project content

### `Import-3 Phase 9`
- [ ] `35. Put Accepted Imports In New Assembly Option`
- [ ] `36. Accepted Imports Land In A New Assembly When Enabled`
- [ ] `37. Accepted Imports Use Normal Landing Behavior When New Assembly Is Off`
#### implementation target:
  - add the explicit pre-commit placement choice for whether accepted imports should create and land in a new assembly

### `Import-3 Phase 10`
- [ ] `38. Add To Project Button Commits The Reviewed Import Draft`
- [ ] `39. Single-Object Commit Path Uses The Chosen Import Settings`
- [ ] `40. Part-Backed Commit Path Uses The Chosen Import Settings`
- [ ] `41. Reviewed Organization Survives Final Commit`
#### implementation target:
  - commit the reviewed staged import using the chosen structure, orientation, scale or units, organization, and placement settings only after explicit user acceptance

### `Import-3 Phase 11`
- [ ] `42. Focused Regression Coverage For The Import Window Flow`
- [ ] `43. Cleanup Of Temporary Import-Draft Seams`
- [ ] `44. Final Messaging And UI Copy Stay Honest`
#### implementation target:
  - finish the staged import-window lane with narrow cleanup and proof without widening into a new asset-management system



## [ ] `Import-3` - `Import Window Structure Review And Add-To-Project Settings`

### Summary

#### Purpose:
- route imported files into an import window first so the user can review structure and choose import settings before the model becomes project content

#### Target result:
- the Browser `+` import flow gains a first new `Import Files...` entry that opens the staged import window
- choosing `Import .step`, `Import .stl`, `Import .obj`, or `Import .glb` opens a ParaHook import window after file selection instead of inserting the file immediately
- the import window shows supported file types and one `Browser` intake row for adding local files
- selected files appear as a staged file list before commit
- the import window shows the selected file type and the best available structure read for the file
- if the file has meaningful multi-part or multi-object structure, the user can choose:
  - import as `1 Object`
  - import as `Multiple Objects In 1 Component`
- the import window exposes a preview-style Browser where the user can organize staged import rows before commit
- staged import objects can be dragged into components or sub-assemblies so the import lands organized
- the user can choose `Z Up`, `Y Up`, or `X Up`
- the user can set the units before accepting the import
- the user can align scale or units per staged file
- the user can choose whether accepted imports should land in a `New Assembly`
- the imported result is committed only after the user clicks `Add to Project`
- canceling or closing the import window leaves project content unchanged

#### Scope statement:
- `Import-3` means staged import review, structure preview, split-versus-single-object choice, units setup, and explicit acceptance
- `Import-3` does not mean drag-and-drop import, material mapping, texture pipelines, or a generalized asset-management system

### Current State

After shipped `Import-1` and planned `Import-2`, the live import path is still immediate:

- Browser import starts from the existing `Import Reference` menu
- file picker returns one or more selected files
- accepted files go directly into `addImportedReference(...)`
- imported references then load and later expose part structure only after they already exist in project content
- the only current user path for turning one structured imported wrapper into many real objects is the later explicit explode flow

That means the current import path skips the decision point the user is now asking for:
- inspect the file first
- review file type and structure
- choose units
- choose one-object versus part-backed-object import
- confirm with `Add to Project`

### Locked Direction

- keep the existing Browser `Import Reference` menu as the entrypoint
- use `Import Files...` as the new first staged-import entry label under that menu
- add a real ParaHook import window after file selection and before project insertion
- keep the import window workspace-local and settings-driven rather than hiding choices in later Browser or viewer fixes
- do not create project content rows until the user explicitly accepts the import
- show supported file types and keep the staged import flow scoped to `.step`, `.stl`, `.obj`, and `.glb`
- use one `Browser` intake row inside the import window for local file browsing
- keep selected files visible as a staged list before commit
- treat part of the import window as a preview Browser organization surface with rows
- allow easy drag-and-drop of staged import objects into components and sub-assemblies before commit
- show the best honest structure read available for the selected file:
  - file type
  - whether meaningful multi-part or multi-object structure exists
  - part labels or hierarchy labels when available
- when structured import is supported, offer two explicit modes:
  - `1 Object`
  - `Multiple Objects In 1 Component`
- keep `1 Object` as the compatibility path for files that do not expose meaningful structure or for users who want wrapper behavior
- if the user chooses `Multiple Objects In 1 Component`, reuse the existing truthful part-provenance and explode-style ownership direction rather than inventing a second fake part-import model
- make up-axis an explicit accepted import setting
- make units an explicit accepted import setting whose effect is stored as import-owned truth, not as a viewer-only correction
- make scale or units alignment explicit before commit
- keep `Put Accepted Imports In New Assembly` as an explicit placement choice rather than a hidden side effect
- keep any chosen preview Browser organization as part of the accepted import result
- use one explicit `Add to Project` confirmation button as the commit point

### Non-Goals

`Import-3` should not expand into:
- drag-and-drop import
- `.obj` `.mtl` or texture-bundle support
- material reassignment or per-part material editing
- progress bars or background import jobs
- arbitrary new file formats
- a generalized asset library
- deep hierarchy editing inside the import window
- a second permanent content system separate from project content

### Internal Phase Ladder

The cleanest staged-import ladder is:

1. `Import-3 Phase 1 - Menu Entry And Floating Window Shell`
2. `Import-3 Phase 2 - Supported Types And Browser Intake`
3. `Import-3 Phase 3 - Staged File List And Multi-File Review`
4. `Import-3 Phase 3B - Staged File List Polish Pass`
5. `Import-3 Phase 4 - Pre-Add Structure Inspection Contract`
6. `Import-3 Phase 5 - Structured Import Mode Choice`
7. `Import-3 Phase 6 - Preview Browser Organization Before Commit`
8. `Import-3 Phase 7 - Up-Axis Settings`
9. `Import-3 Phase 8 - Scale And Units Alignment`
10. `Import-3 Phase 9 - New Assembly Placement Option`
11. `Import-3 Phase 10 - Add-To-Project Commit Path`
12. `Import-3 Phase 11 - Narrow Cleanup And Regression Pass`

Reason:
- the menu entry and window shell should exist before intake behavior is widened
- supported file-type intake should exist before the staged file list depends on it
- the staged file list should exist before its first overflow and usability polish pass can tighten it
- the staged file list and its first polish pass should exist before structure inspection and later per-file settings widen the window
- structure inspection should exist before the split-versus-single-object choice depends on it
- preview Browser organization should be explicit before the final commit path depends on it
- orientation, scale or units, and placement should become explicit import settings before the final commit path lands
- the final commit path should consume explicit reviewed settings and reviewed organization rather than discovering them ad hoc

## [x] `Import-3` - `Phase 1 - Menu Entry And Floating Window Shell`

### Purpose

- add the new `Import Files...` entry under the Browser `+` import flow and open the first floating staged import window instead of committing content immediately

### Goal

- clicking the new first `Import Files...` entry opens a floating import window before any project content is created

### Locked Direction

- keep the existing Browser `+` then `Import Reference` entry surface
- use `Import Files...` as the explicit new staged-import label
- keep the floating import window separate from accepted project content
- keep cancel or close as a no-op for project content

### Expected Implementation Shape

- update the Browser import menu and controller entry path
- add the first import-window shell surface
- add the first store-owned staged import draft seam

### Implementation-Prep Read

- `src/app/panels/browserTreeSections.tsx`
  - already owns the Browser `Content` section `+` button with `aria-label="Import reference file"`
  - remains the visible Browser-owned entrypoint for the `Import Reference` menu
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the `Import Reference` menu header and the direct `.step`, `.stl`, `.obj`, and `.glb` action rows
  - is the right first owner for inserting a new top `Import Files...` menu action before the older direct-import rows are retired
- `src/app/panels/useBrowserPanelController.ts`
  - already owns `handleOpenContentImportMenu(...)`
  - already routes the current direct import path through `handleImportReferenceFile(...)`
  - already resolves the Browser landing parent before `addImportedReference(...)`
  - is the right controller seam for splitting the new staged-import-window open path away from the still-live direct-import compatibility path
- `src/app/panels/BrowserPanel.tsx`
  - already renders the Browser-owned overlay layer for the import menu and row context menu
  - is the cleanest first owner for rendering one browser-local floating `Import Files` shell without creating a new workspace surface kind
- `src/app/hosts/BrowserDockHost.tsx`
  - already owns the Browser floating or docked or split shell hosting
  - means `Phase 1` does not need a new workspace surface or persistence contract just to show the import window
- `src/app/store/useAppStore.ts`
  - already owns transient Browser and viewer coordination seams such as transform-shell state and accepted imported-reference insertion
  - is the right long-range home for one minimal staged-import draft contract that later phases can widen
- `src/app/theme/surfaces/browser.css`
  - already owns Browser panel and Browser menu styling
  - is the likely first styling seam for the new import-window shell
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the Browser `Import Reference` menu and the current direct import behavior
  - is the strongest first proof target for the new menu entry, shell open or close behavior, and the no-project-change guarantee

### First Pass Decisions

- keep `Import Files...` as the new first action inside the existing `Import Reference` menu
- keep the current direct `.step`, `.stl`, `.obj`, and `.glb` menu actions below it during `Phase 1` so the new shell can land without blocking the already-shipped direct import path
- keep the first `Import Files` window browser-owned and transient:
  - do not add a new `WorkspaceSurfaceKind`
  - do not add docking, popout, or persistence rules for the import window
- add one minimal staged-import draft seam in `useAppStore.ts`:
  - enough to know whether the shell is open
  - enough to carry the resolved landing parent
  - no file staging, structure results, or settings yet
- resolve the landing parent through the same current Browser logic used by the direct import path, but do not create any project content in this phase
- keep cancel or close as the only exit behavior for the new shell in `Phase 1`
- keep `Add To Project`, file browsing, supported-type display, and staged-file review out of scope until later phases

### Implementation Spec

#### Exact First Code Cut

1. Add one minimal staged-import draft contract to `src/app/store/useAppStore.ts` with:
   - open or closed shell truth
   - resolved landing parent ids
   - open and close actions
   - no accepted files or import settings yet
2. Add a new first `Import Files...` button to the `Import Reference` menu in `src/app/panels/browserTreeMenus.tsx`.
3. Split the Browser controller path in `src/app/panels/useBrowserPanelController.ts` so:
   - `Import Files...` opens the staged import shell and closes the menu
   - the existing direct type rows keep using the current immediate import path unchanged
4. Render one browser-owned floating `Import Files` shell from `src/app/panels/BrowserPanel.tsx` when the staged-import draft is open.
5. Keep the first shell intentionally thin:
   - title
   - close or cancel affordance
   - short placeholder body explaining that staged import review lands here
   - no file browser, staged rows, or commit button yet
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - the `Import Reference` menu now shows `Import Files...` first
   - clicking it opens the import-window shell
   - closing the shell leaves project content unchanged
   - clicking the older direct import rows still uses the current direct path during this phase

#### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

#### No-Widening Rule

- do not route local file browsing into the new shell yet
- do not retire the existing per-type direct import actions yet
- do not add staged file rows, supported-type copy, structure read, units, or `Add To Project` in this phase
- do not create a new workspace surface family or floating-window persistence contract for the import shell

#### Implementation Risks

- accidentally replacing the current direct import path before the staged shell can actually intake files
- introducing a second floating workspace surface when the feature only needs one browser-owned transient shell
- storing too much future import state in the first seam and making the opening slice harder than it needs to be
- letting the new shell create or mutate project content before later phases define the staged import contract

#### Checklist

- [ ] add `Import Files...` as the first `Import Reference` menu action
- [ ] keep the existing direct import rows working below it during `Phase 1`
- [ ] add one minimal staged-import draft seam in `useAppStore.ts`
- [ ] render one browser-owned floating `Import Files` shell
- [ ] make close or cancel leave project content unchanged
- [ ] add focused Browser proof for the new shell-open path and the unchanged direct-import compatibility path

#### Verification Shape

Minimum verification for this phase should cover:

- the Browser `+` button still opens the `Import Reference` menu
- `Import Files...` appears as the first action in that menu
- clicking `Import Files...` opens the floating import-window shell instead of importing content
- closing the shell leaves Browser content and imported-reference state unchanged
- the older direct `.step`, `.stl`, `.obj`, and `.glb` menu actions still use the current immediate import path until later phases replace them

#### Done Shape

`Phase 1` is done when:

- the Browser `Import Reference` menu exposes `Import Files...` as the new staged-import entry
- clicking that entry opens one browser-owned floating `Import Files` shell
- the shell is backed by one minimal staged-import draft seam rather than ad hoc JSX-only state
- cancel or close leaves project content unchanged
- the phase stops before file intake, staged review, and final commit behavior widen the slice

#### Implemented Result

- the Browser `Import Reference` menu now shows `Import Files...` as its first action while keeping the older direct `.step`, `.stl`, `.obj`, and `.glb` rows live below it as compatibility actions
- clicking `Import Files...` now opens one browser-owned transient `Import Files` dialog instead of importing content immediately
- the new dialog is backed by a minimal `referenceWorkspace.stagedImportDraft` seam in `useAppStore.ts`, carrying only open-or-closed truth plus the resolved Browser landing parent
- closing the dialog leaves imported-reference and project-content state unchanged
- focused Browser proof now covers the new staged-dialog open or close path plus the unchanged direct-import compatibility rows

## [x] `Import-3` - `Phase 2 - Supported Types And Browser Intake`

### Purpose

- show the supported import types in the window and let the user add local files through the in-window `Browser` row

### Goal

- the user can click `Browser` inside the import window and stage `.step`, `.stl`, `.obj`, and `.glb` files without adding them directly to project content

### Locked Direction

- keep intake scoped to the current supported `Import Reference` file types only
- keep the `Browser` row as staged-file intake, not project ownership
- do not widen this phase into structure parsing or commit logic yet

### Expected Implementation Shape

- add the supported-file-type read to the import window
- add the `Browser` intake row or button
- route supported file picks into staged import draft state

### Implementation-Prep Read

- `src/app/references/importReferenceFile.ts`
  - already defines the current supported import labels and accept filters through:
    - `REFERENCE_IMPORT_LABEL_BY_FILE_TYPE`
    - `REFERENCE_IMPORT_ACCEPT_BY_FILE_TYPE`
  - already owns the live local picker helpers:
    - `importReferenceFileFromDisk(...)`
    - `importReferenceFilesFromDisk(...)`
  - is the right first seam for keeping `Phase 2` scoped to the same `.step`, `.stl`, `.obj`, and `.glb` support that the Browser import menu already exposes
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the shipped `Import Files` dialog shell from `Phase 1`
  - is the right first owner for:
    - supported-type copy inside the dialog
    - one explicit in-window `Browser` intake row or button
    - one narrow staged-file-count read if the dialog needs to confirm that intake succeeded before `Phase 3` adds the full list
- `src/app/panels/useBrowserPanelController.ts`
  - already owns the open or close path for the staged import dialog
  - already shares the resolved Browser landing parent with the direct import path
  - is the right controller seam for routing in-window file picks into staged import draft state instead of straight into `addImportedReference(...)`
- `src/app/store/useAppStore.ts`
  - already owns the minimal `referenceWorkspace.stagedImportDraft` seam from `Phase 1`
  - should become the owner of one narrow staged-file intake contract in `Phase 2`
  - should still stop short of structure-read results, import-mode settings, or commit semantics
- `src/app/panels/BrowserPanel.tsx`
  - already renders the browser-owned import dialog
  - remains the right shell owner while the staged draft widens only slightly
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the `Import Files...` entry, shell open path, and no-project-change close path
  - is the strongest first proof target for showing supported types in the dialog and proving that in-window `Browser` intake stages files without mutating project content

### First Pass Decisions

- keep the older direct `.step`, `.stl`, `.obj`, and `.glb` Browser menu rows live during `Phase 2` as compatibility actions below `Import Files...`
- treat `Phase 2` as intake-only:
  - the dialog should be able to show supported types
  - the dialog should be able to browse for supported files
  - the dialog should be able to retain those selected files in staged draft state
  - the dialog should not yet render the full staged-file review list from `Phase 3`
- widen `referenceWorkspace.stagedImportDraft` only enough to hold selected-file draft records:
  - local file identity
  - file name
  - supported import type
  - stable staged ordering
  - no structure-read results or per-file import settings yet
- keep multi-file support honest to the existing picker helpers:
  - `.obj` can continue using the current multi-select helper seam
  - the other supported types can continue using their current single-file helper seam unless the implementation proves one shared supported-files picker is simpler without widening the behavior contract
- allow `Phase 2` to show one simple staged-file count or intake confirmation if needed, but keep the visible per-file row list for `Phase 3`
- keep the `Browser` control inside the dialog clearly labeled as local file intake, not as Browser-tree ownership or project insertion
- keep cancel or close behavior unchanged from `Phase 1`: staged draft may be discarded, but project content must remain untouched

### Implementation Spec

#### Exact First Code Cut

1. Widen the staged-import draft contract in `src/app/store/useAppStore.ts` just enough to hold accepted staged file records for supported import types.
2. Teach the `Import Files` dialog in `src/app/panels/browserTreeMenus.tsx` to show the supported `.step`, `.stl`, `.obj`, and `.glb` types explicitly.
3. Add one in-dialog `Browser` intake row or button to that same dialog surface.
4. Add a staged-intake handler in `src/app/panels/useBrowserPanelController.ts` that:
   - opens the existing local picker helper path
   - accepts only the supported import types
   - writes selected files into staged draft state
   - does not call `addImportedReference(...)`
5. Keep the visible dialog response intentionally narrow after intake:
   - supported types remain visible
   - one simple intake confirmation is allowed
   - the full staged per-file list remains deferred to `Phase 3`
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - supported types are shown in the dialog
   - clicking the dialog `Browser` control stages supported files into draft state
   - project content still does not change during staging
   - the older direct import compatibility rows still keep their current immediate behavior

#### Likely Files

- `src/app/references/importReferenceFile.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`

#### No-Widening Rule

- do not add the full visible staged-file row list yet
- do not add structure parsing, hierarchy reads, part reads, or file inspection results yet
- do not add import-mode controls, up-axis, scale, units, `New Assembly`, or `Add To Project` yet
- do not retire the older direct import rows yet
- do not let file intake create project content rows, imported references, or viewer-owned runtime records yet

#### Implementation Risks

- accidentally skipping the staged draft and reusing the current direct import mutation path
- widening the draft contract too early with structure or settings state that belongs to later phases
- building too much visible file-review UI in `Phase 2` and making `Phase 3` redundant
- letting supported-type messaging drift away from the actual picker helpers and current import-family support

#### Checklist

- [x] show supported `.step`, `.stl`, `.obj`, and `.glb` types inside the `Import Files` dialog
- [x] add one explicit in-dialog `Browser` intake row or button
- [x] widen the staged-import draft contract just enough to hold selected supported files
- [x] route supported file picks into staged draft state instead of project content
- [x] keep cancel or close behavior project-safe
- [x] keep the older direct import compatibility rows unchanged during this phase
- [x] add focused Browser proof for staged intake without project mutation

#### Verification Shape

Minimum verification for this phase should cover:

- opening `Import Files...` still shows the browser-owned staged import dialog
- the dialog explicitly shows `.step`, `.stl`, `.obj`, and `.glb` as supported types
- clicking the dialog `Browser` control can intake supported local files into staged draft state
- staging files through that path does not create imported-reference content or other project rows yet
- closing the dialog after staging still leaves project content unchanged
- the older direct import rows in the Browser menu still keep their current immediate behavior during this phase

#### Done Shape

`Phase 2` is done when:

- the staged import dialog clearly advertises the supported import file types
- the dialog exposes one explicit `Browser` intake path for local file selection
- selected supported files can now live in staged draft state without becoming project content
- the phase still stops before visible staged-file review rows, structure inspection, or final commit behavior

#### Implemented Result

- the `Import Files` dialog now shows supported `.step`, `.stl`, `.obj`, and `.glb` types directly inside the staged import window
- the dialog now exposes one explicit in-window `Browser` intake button backed by one multi-type supported-file picker
- selected files now append into `referenceWorkspace.stagedImportDraft.stagedFiles` with stable draft ordering and without creating project content
- closing the dialog still discards the staged draft and leaves project content unchanged
- the older direct `Import .step`, `Import .stl`, `Import .obj`, and `Import .glb` Browser menu rows remain live as compatibility actions during this phase

## [x] `Import-3` - `Phase 3 - Staged File List And Multi-File Review`

### Purpose

- turn accepted local files into a visible staged file list the user can review before structure or commit decisions land

### Goal

- selected files appear as clear staged rows with file-type labels and stable review order before commit

### Locked Direction

- keep the staged file list visible inside the import window
- support multi-file review without creating project content yet
- keep the first list behavior explicit and legible rather than over-optimized

### Expected Implementation Shape

- add staged file rows to the import window
- show file-type labels per row
- keep staged ordering readable for later per-file settings

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - already widens `referenceWorkspace.stagedImportDraft` with:
    - resolved landing parent ids
    - `stagedFiles`
  - already gives each staged file a stable `stagedFileId`
  - is the correct owner for the ordered staged-file review contract that `Phase 3` should read rather than recompute in JSX
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the browser-owned `Import Files` dialog surface
  - already shows:
    - supported type chips
    - one `Browser` intake row
    - one simple staged-file count
  - is the right first owner for rendering the visible staged-file review area directly below that intake seam
- `src/app/panels/useBrowserPanelController.ts`
  - already owns in-dialog `Browser` intake and appends selected files into staged draft state
  - should stay mostly unchanged in `Phase 3`, because the next cut is primarily a draft-read and dialog-rendering pass rather than a new controller mutation path
- `src/app/panels/BrowserPanel.tsx`
  - already passes the staged draft, browsing state, and dialog actions into the import dialog
  - should remain a thin shell owner in this phase
- `src/app/theme/surfaces/browser.css`
  - already owns the `Import Files` dialog styling
  - is the right seam for adding the first visible staged-list row layout, badges, and list spacing
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves:
    - opening the staged dialog
    - supported type chips
    - in-window `Browser` intake
    - staged draft count updates
  - is the strongest first proof target for making sure staged files now appear as visible rows with readable type labels and stable order while still avoiding project mutation

### First Pass Decisions

- keep `Phase 3` focused on rendering the staged files the user already selected in `Phase 2`
- use the existing staged draft ordering as the visible review order:
  - first selected file should render first
  - later appended files should render after earlier ones
  - no drag-reorder behavior yet
- each staged row should show only the review basics in this phase:
  - file name
  - file type label
  - stable visual row identity
- keep the existing staged-file count if it still helps orientation, but the visible row list becomes the main review surface
- keep the visible row language honest:
  - this is a staged review list
  - not project content
  - not structure read
- do not add remove, reorder, expand, preview, or per-file settings in this phase unless one minimal affordance becomes absolutely necessary to keep the list legible
- keep the Browser intake row live above the new list so multi-file review can be exercised through repeated staged browsing without leaving the dialog
- keep cancel or close behavior unchanged:
  - dismissing the dialog still discards the staged draft
  - project content still remains untouched

### Implementation Spec

#### Exact First Code Cut

1. Read `referenceWorkspace.stagedImportDraft.stagedFiles` directly from the existing dialog props in `src/app/panels/browserTreeMenus.tsx`.
2. Add one visible staged-file review section to the `Import Files` dialog below the intake area.
3. Render one row per staged file showing:
   - staged order
   - file name
   - file type label
4. Keep the empty state explicit when no files are staged yet so the dialog still reads clearly before the first browse action.
5. Keep the existing Browser intake flow unchanged so repeated browsing can append more files and visibly extend the review list.
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - staged files now render as visible rows after browse intake
   - file type labels are shown per row
   - appended files keep readable review order
   - project content still does not change during review

#### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

#### No-Widening Rule

- do not add structure parsing, part reads, hierarchy reads, or per-file structure labels yet
- do not add import-mode controls, up-axis, scale, units, `New Assembly`, or `Add To Project` yet
- do not add row drag-and-drop, reordering, or preview Browser organization yet
- do not turn staged rows into real project content rows or Browser tree ownership
- do not retire the older direct import compatibility rows yet

#### Implementation Risks

- rendering the staged list with project-row styling that makes draft rows look like committed Browser content
- letting the staged count and the visible row list drift out of sync
- accidentally introducing per-file controls that belong to structure or settings phases
- making the empty state too subtle so the dialog feels broken before the first file is staged

#### Checklist

- [x] render a visible staged-file review area inside the `Import Files` dialog
- [x] show one row per staged file using the stored staged draft order
- [x] show file name and file type label per staged row
- [x] keep repeated Browser intake appending visibly into that review list
- [x] keep the empty staged state explicit when no files are selected yet
- [x] keep project content unchanged while staged review is happening
- [x] add focused Browser proof for row visibility, file-type labels, and stable review order

#### Verification Shape

Minimum verification for this phase should cover:

- opening `Import Files...` with no selected files still shows a clear empty staged-review state
- browsing for supported files now creates visible staged rows in the dialog
- each row shows the file name and the matching file-type label
- when multiple files are staged, the list keeps the stored review order instead of re-sorting implicitly
- repeated browse intake appends new staged rows after the existing ones
- project content still does not change while the user is only reviewing staged rows

#### Done Shape

`Phase 3` is done when:

- the staged import dialog shows a visible per-file review list instead of only a staged count
- each staged file is legible as its own row with file-type labeling
- multi-file intake can be reviewed in stable staged order before commit
- the phase still stops before structure inspection, per-file import choices, or final commit behavior

#### Implemented Result

- the `Import Files` dialog now shows a visible staged review section instead of only a staged-file count
- each staged file now renders as its own ordered row with file-name and file-type labels
- the dialog now keeps an explicit empty state before the first file is staged
- repeated in-dialog `Browser` intake now appends into the visible review list in stable draft order
- project content still remains unchanged while the user is only staging and reviewing files

## [ ] `Import-3` - `Phase 3B - Staged File List Polish Pass`

### Purpose

- tighten the first staged review surface so it stays usable and visually calm once many files are staged

### Goal

- the staged file list can overflow cleanly and remain reviewable, starting with an explicit scrollbar

### Locked Direction

- keep this pass narrowly scoped to staged-list usability polish only
- start with overflow handling and scrollbar behavior for the visible staged review area
- do not widen this polish pass into structure parsing, file actions, or later import settings

### Expected Implementation Shape

- add bounded staged-list overflow behavior
- add a local staged-list scrollbar
- keep the existing staged row order and row content unchanged unless one tiny readability adjustment is needed to support overflow

## [ ] `Import-3` - `Phase 4 - Pre-Add Structure Inspection Contract`

### Purpose

- inspect each staged file before commit and surface the best honest structure read in the import window

### Goal

- let the user review whether each staged file has multiple objects, hierarchy, parts, and meaningful structure labels before accepting the import

### Locked Direction

- keep inspection results in the staged import draft, not in accepted project content
- reuse existing loader or part-descriptor seams where possible
- if the first honest structure read is flatter than a full hierarchy, show that flatter truth instead of inventing fake hierarchy

### Expected Implementation Shape

- inspect current structure-read seams in `src/viewer/referencePartDescriptors.ts`
- inspect loader or load-owner seams in `src/viewer/Viewer.ts` and the reference loaders
- surface file type plus structure results in the import-window UI

## [ ] `Import-3` - `Phase 5 - Structured Import Mode Choice`

### Purpose

- let structured staged files choose between one-object import and multiple-objects-in-one-component import

### Goal

- if a file has meaningful structure, the import window offers:
  - `1 Object`
  - `Multiple Objects In 1 Component`

### Locked Direction

- keep `1 Object` as the compatibility path
- show the split choice only when the structure read honestly supports it
- if the user chooses the multi-object path, reuse truthful per-part or per-object provenance instead of inventing a second fake Browser-only hierarchy

### Expected Implementation Shape

- inspect the current exploded-reference and part-provenance seams in `src/app/store/useAppStore.ts`
- inspect the current part isolation and provenance seams in `src/viewer/Viewer.ts`
- add import-window state and UI for the explicit import-mode choice

## [ ] `Import-3` - `Phase 6 - Preview Browser Organization Before Commit`

### Purpose

- let the user organize the staged import result through a preview-style Browser before project content is committed

### Goal

- staged import rows can be dragged into components or sub-assemblies so the accepted import lands already organized

### Locked Direction

- keep this Browser-like surface inside the import window as staging-only until acceptance
- show rows for the staged import result
- support easy drag-and-drop into components and sub-assemblies
- keep the chosen organization as part of the staged draft so it can survive final commit

### Expected Implementation Shape

- add the preview Browser organization surface to the import window
- attach organization state to the staged import draft
- prove that staged organization survives into the later commit path

## [ ] `Import-3` - `Phase 7 - Up-Axis Settings`

### Purpose

- make import orientation an explicit staged decision before project acceptance

### Goal

- each staged file can choose `Z Up`, `Y Up`, or `X Up`, and that choice becomes accepted import truth

### Locked Direction

- keep orientation as an import-owned setting
- do not hide up-axis correction as an awkward post-import viewer fix
- keep the first pass to the three explicit up-axis options only

### Expected Implementation Shape

- add per-file up-axis state to the staged import draft
- add `Z Up`, `Y Up`, and `X Up` controls to the import window
- route the chosen up-axis into the accepted import configuration

## [ ] `Import-3` - `Phase 8 - Scale And Units Alignment`

### Purpose

- make scale and units alignment explicit staged import decisions before project acceptance

### Goal

- the user can align scale or units per staged file and that choice becomes accepted import truth

### Locked Direction

- keep scale or units alignment as explicit import-owned truth
- do not hide correction as a viewer-only trick
- prefer deterministic accepted import settings over ad hoc post-import scale edits

### Expected Implementation Shape

- inspect the existing display-transform seam in `src/app/references/referenceManifest.ts`
- inspect the reference transform base and scale application seams in `src/viewer/Viewer.ts`
- add scale or units alignment state and UI to the staged import draft and import window

## [ ] `Import-3` - `Phase 9 - New Assembly Placement Option`

### Purpose

- let the user explicitly choose whether accepted staged imports should land inside a newly created assembly

### Goal

- the import window offers `Put Accepted Imports In New Assembly`, and the accepted imports either create and land in that new assembly or follow normal landing behavior when the option is off

### Locked Direction

- keep `New Assembly` as a pre-commit placement choice
- do not create content rows early just because the option is visible
- keep the off-state aligned with the normal resolved Browser landing behavior

### Expected Implementation Shape

- add staged placement state for the `New Assembly` option
- wire the option into the later final commit path
- keep placement logic separate from earlier intake and structure-read phases

## [ ] `Import-3` - `Phase 10 - Add-To-Project Commit Path`

### Purpose

- commit the reviewed staged import draft into project content only after explicit acceptance

### Goal

- clicking `Add to Project` applies the chosen structure, orientation, scale or units, organization, and placement settings to create the final project result

### Locked Direction

- single-object mode should reuse the existing imported-reference insertion path as much as possible
- the multi-object path should commit through truthful multi-object creation rather than wrapper-first then immediate fake UI splitting
- the accepted commit path should preserve the reviewed preview Browser organization
- cancel should leave project content untouched

### Expected Implementation Shape

- update the import accept path in `src/app/panels/useBrowserPanelController.ts`
- update accepted import ownership in `src/app/store/useAppStore.ts`
- add focused Browser or store or viewer proof for both commit modes

## [ ] `Import-3` - `Phase 11 - Narrow Cleanup And Regression Pass`

### Purpose

- finish the staged-import lane with any small cleanup left behind by the phased rollout

### Goal

- leave the import window explicit, honest, and low-friction without widening the family

### Locked Direction

- keep this pass narrow
- prefer cleanup, message clarity, and regression hardening only
- do not widen into drag-and-drop, material pipelines, or generalized asset management

### Verification

Minimum proof for `Import-3`:

1. the Browser `+` then `Import Reference` flow exposes the new `Import Files...` staged entry and opens a floating import window before project content changes
2. the import window shows supported file types and the `Browser` intake row can stage `.step`, `.stl`, `.obj`, and `.glb` files into a visible staged file list
3. the import window shows the best honest structure read available, including multiple objects, hierarchy, parts, and meaningful labels when they exist
4. structured files can choose between `1 Object` and `Multiple Objects In 1 Component` only when that split is honestly supported
5. the preview Browser can organize staged import rows into components or sub-assemblies before commit
6. up-axis, scale or units alignment, and `New Assembly` placement all become explicit accepted import settings
7. project content changes only after the user clicks `Add to Project`, and the accepted result preserves the reviewed organization and placement

### Exit Criteria

`Import-3` is ready to implement when:
- the staged import draft is clearly separated from accepted project content
- the `Import Files...` menu entry, supported types, Browser intake row, staged file list, structure review, import mode choice, preview Browser organization, up-axis, scale or units, and `New Assembly` choice are all part of one coherent staged import-window contract
- preview Browser organization is part of that same staged contract
- `Add to Project` is the one explicit commit point
- split import reuses truthful part provenance instead of inventing a parallel ownership model

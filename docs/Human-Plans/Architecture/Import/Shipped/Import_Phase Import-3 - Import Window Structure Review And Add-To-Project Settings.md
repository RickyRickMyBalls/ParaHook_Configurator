# `Import-3` - `Import Window Structure Review And Add-To-Project Settings`

## Doc Header

### Doc History
33. 2026-04-16: Moved this completed `Import-3` record from `Future/` into `Shipped/` after the staged import-window lane closed through Phase 12, so the import family now treats the full pre-add review flow as shipped history and hands forward into `Import-4` for staged-session feedback and partial-failure reporting
32. 2026-04-16: Implemented `Import-3 / Phase 12 - Post-Accept Imported Reference Load Failure Research And Fix` by correcting staged-draft blob ownership so accepted imported references keep their committed asset path after draft teardown, preserving cleanup for abandoned staged files, and adding focused store proof that committed staged `.glb` imports no longer lose their blob URL when the dialog closes
31. 2026-04-16: Prepped `Import-3 / Phase 12 - Post-Accept Imported Reference Load Failure Research And Fix` for implementation by grounding the bug-fix lane in the read-only root-cause pass, which traced the accepted staged-import `.glb` failure through `commitStagedImportDraft()` storing the staged blob URL as the committed `assetPath`, `closeStagedImportDraft()` revoking that same staged URL, and the later viewer load flipping the Browser row red when it tries to load the revoked asset
30. 2026-04-16: Added `Import-3 / Phase 12 - Post-Accept Imported Reference Load Failure Research And Fix` after the shipped Phase 11 finish pass so the newly discovered red-bar `.glb` regression has an explicit narrow owner for root-cause research, asset-lifetime repair, honest error surfacing, and targeted proof without reopening the broader staged-import family
29. 2026-04-16: Implemented `Import-3 / Phase 11 - Narrow Cleanup And Regression Pass` by tightening the staged-import Browser proof into one coherent intake-to-acceptance regression, adding one focused empty-draft store guard, polishing the final import-window copy plus disabled-state affordances, and trimming repeated staged-file lookup glue without widening beyond the shipped staged-import contract
28. 2026-04-16: Prepped `Import-3 / Phase 11 - Narrow Cleanup And Regression Pass` for implementation by grounding the final staged-import cleanup pass in the now-shipped dialog copy, the explicit `Add To Project` accept path, the focused Browser and store proof seams, and the remaining temporary staged-import helper surfaces so the last lane can stay narrow around regression hardening, honest messaging, and small cleanup only
27. 2026-04-16: Implemented `Import-3 / Phase 10 - Add-To-Project Commit Path` by adding one explicit `Add To Project` dialog action, routing acceptance through a store-owned staged-import commit helper, translating reviewed up-axis and scale or units settings into accepted import-owned transform truth, and committing reviewed single-object or truthful part-backed multi-object imports through the preview Browser organization only after explicit acceptance
26. 2026-04-16: Prepped `Import-3 / Phase 10 - Add-To-Project Commit Path` for implementation by grounding the final staged-import accept pass in the live staged draft lifecycle, the authored assembly and component creation seams, the imported-reference insertion and transform-override owners, and the staged preview-organization graph so `Add To Project` can become the one explicit commit point without widening into a second permanent content system
25. 2026-04-16: Implemented `Import-3 / Phase 9 - New Assembly Placement Option` by adding one draft-owned `putAcceptedImportsInNewAssembly` setting with the default off-state aligned to the current Browser landing behavior, surfacing an explicit visible placement control plus honest commit-time copy in the import dialog, and proving that placement changes stay inside the staged import draft without creating project content early
24. 2026-04-16: Prepped `Import-3 / Phase 9 - New Assembly Placement Option` for implementation by grounding the next staged-import cut in the existing resolved Browser landing-parent seam, the already-shipped staged preview assembly surface, and the authored `createProjectAssembly(...)` owner so the first placement pass can add an explicit draft-owned `New Assembly` choice without creating project content early or widening into final commit behavior yet
23. 2026-04-16: Implemented `Import-3 / Phase 8 - Scale And Units Alignment` by adding one draft-owned per-file scale-alignment setting with `Current` as the compatibility default, surfacing explicit row-local `Current`, `mm`, `cm`, `m`, and `in` choices for staged files, and proving that size-alignment changes stay inside the staged import draft without mutating project content or accepted reference transforms yet
22. 2026-04-16: Prepped `Import-3 / Phase 8 - Scale And Units Alignment` for implementation by grounding the next staged-import cut in the existing draft-owned per-file import settings, the `referenceManifest` display-transform scale seam, and the viewer's base-plus-override scale application path so the first size-alignment pass can add explicit staged scale or units choices without widening into arbitrary transform editing or final commit behavior yet
21. 2026-04-16: Implemented `Import-3 / Phase 7 - Up-Axis Settings` by adding one draft-owned per-file up-axis setting with `Z Up` as the default, surfacing explicit row-local `Z Up`, `Y Up`, and `X Up` choices for staged files even while structure reads are still loading or unavailable, and proving that orientation changes stay inside the staged import draft without mutating project content
20. 2026-04-16: Prepped `Import-3 / Phase 7 - Up-Axis Settings` for implementation by grounding the next staged-import cut in the existing draft-owned per-file import settings, the shared reference transform-override seam, and the viewer's applied rotation path so the first orientation pass can add explicit `Z Up`, `Y Up`, and `X Up` choices without widening into scale, units, or final commit behavior yet
19. 2026-04-16: Implemented `Import-3 / Phase 6 - Preview Browser Organization Before Commit` by extending staged structure reads with truthful part rows, adding one draft-owned preview-organization graph plus compact preview Browser rows inside the import dialog, and reusing the shared Browser drag-session language so staged rows can be organized into draft assemblies and components before commit while project content remains untouched
18. 2026-04-16: Prepped `Import-3 / Phase 6 - Preview Browser Organization Before Commit` for implementation by grounding the next staged-import cut in the live Browser drag-session helpers, the existing owner-move and content-order seams, and the current staged import draft so the next pass can add staging-only preview organization before commit without mutating project content or widening into final acceptance behavior yet
17. 2026-04-16: Implemented `Import-3 / Phase 5 - Structured Import Mode Choice` by adding one draft-owned per-file import mode with `1 Object` as the default, surfacing truthful row-local `1 Object` versus `Multiple Objects In 1 Component` controls only when the staged structure read is part-backed, and proving that mode changes stay draft-only without mutating project content
16. 2026-04-16: Prepped `Import-3 / Phase 5 - Structured Import Mode Choice` for implementation by grounding the next staged-import cut in the now-shipped draft-owned structure summary seam, the existing `canReferenceItemExplode(...)` gate plus `explodeImportedReference(...)` provenance path, and the viewer's exploded-reference isolation contract so the next pass can add honest `1 Object` versus `Multiple Objects In 1 Component` choices without inventing a second split-ownership model
15. 2026-04-16: Marked `Import-3 / Phase 4 - Pre-Add Structure Inspection Contract` implemented after the staged import draft gained async draft-owned structure summaries plus row-local multiple-object, hierarchy, parts, label, loading, and unavailable reads that stay honest for flat files while project content remains untouched
14. 2026-04-16: Prepped `Import-3 / Phase 4 - Pre-Add Structure Inspection Contract` for implementation by grounding the next staged-import cut in the live reference asset loaders, the existing viewer-owned part-descriptor extraction seam, and the now-scrollable staged review rows so the next pass can surface honest pre-add structure reads without inventing fake hierarchy or widening into import-mode controls yet
13. 2026-04-16: Implemented `Import-3 / Phase 3B - Staged File List Polish Pass` by adding one dedicated bounded scroll region around the staged review list, styling a local scrollbar inside that region, and proving that staged rows still render in stable order while overflow stays local to the staged-list surface
12. 2026-04-16: Prepped `Import-3 / Phase 3B - Staged File List Polish Pass` for implementation by grounding the first polish slice in the shipped staged review list, the current `Import Files` dialog layout and CSS seams, and focused Browser proof targets so the next pass can add bounded staged-list overflow plus a local scrollbar without widening into structure inspection, row actions, or broader visual redesign
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

This doc records the shipped later import-family phase for a real pre-add import window.

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
- [x] `13B. Staged File List Has A Scroll Bar`
#### implementation target:
  - add the first narrow staged-list polish pass so the visible review area stays usable when many files are staged

### `Import-3 Phase 4`
- [x] `14. Structure Read Shows Multiple Objects`
- [x] `15. Structure Read Shows Hierarchy`
- [x] `16. Structure Read Shows Parts`
- [x] `17. Meaningful Structure Labels Are Shown When They Exist`
- [x] `18. Flat Files Stay Honest Instead Of Showing Fake Hierarchy`
#### implementation target:
  - inspect each staged file and surface the best honest structure read available without inventing fake hierarchy

### `Import-3 Phase 5`
- [x] `19. Import As 1 Object Option`
- [x] `20. Import As Multiple Objects In 1 Component Option`
- [x] `21. Structured Import Choice Appears Only When Supported`
- [x] `22. Split Import Reuses Truthful Per-Part Provenance`
#### implementation target:
  - let structured files choose between one-object import and multiple-objects-in-one-component import without widening into fake Browser-only ownership

### `Import-3 Phase 6`
- [x] `23. Preview Browser Rows For Staged Import Organization`
- [x] `24. Drag And Drop Staged Import Objects Into Components`
- [x] `25. Drag And Drop Staged Import Objects Into Sub-Assemblies`
- [x] `26. Pre-Commit Organization Is Preserved On Add To Project`
#### implementation target:
  - expose a preview Browser organization surface so the user can organize staged import rows before final commit

### `Import-3 Phase 7`
- [x] `27. Z Up Option`
- [x] `28. Y Up Option`
- [x] `29. X Up Option`
- [x] `30. Orientation Choice Becomes Accepted Import Truth`
#### implementation target:
  - make up-axis an explicit staged import decision instead of a hidden post-import correction

### `Import-3 Phase 8`
- [x] `31. Scale Alignment In The Import Window`
- [x] `32. Units Alignment In The Import Window`
- [x] `33. Accepted Scale Or Units Become Import-Owned Truth`
- [x] `34. Scale Or Units Correction Is Not Hidden As A Viewer-Only Fix`
#### implementation target:
  - make scale and units alignment an explicit staged import decision before the file becomes project content

### `Import-3 Phase 9`
- [x] `35. Put Accepted Imports In New Assembly Option`
- [x] `36. Accepted Imports Land In A New Assembly When Enabled`
- [x] `37. Accepted Imports Use Normal Landing Behavior When New Assembly Is Off`
#### implementation target:
  - add the explicit pre-commit placement choice for whether accepted imports should create and land in a new assembly

### `Import-3 Phase 10`
- [x] `38. Add To Project Button Commits The Reviewed Import Draft`
- [x] `39. Single-Object Commit Path Uses The Chosen Import Settings`
- [x] `40. Part-Backed Commit Path Uses The Chosen Import Settings`
- [x] `41. Reviewed Organization Survives Final Commit`
#### implementation target:
  - commit the reviewed staged import using the chosen structure, orientation, scale or units, organization, and placement settings only after explicit user acceptance

### `Import-3 Phase 11`
- [x] `42. Focused Regression Coverage For The Import Window Flow`
- [x] `43. Cleanup Of Temporary Import-Draft Seams`
- [x] `44. Final Messaging And UI Copy Stay Honest`
#### implementation target:
  - finish the staged import-window lane with narrow cleanup and proof without widening into a new asset-management system

### `Import-3 Phase 12`
- [x] `45. Post-Accept Imported Reference Load Failures Are Reproduced And Explained`
- [x] `46. Accepted Import Asset Ownership Survives Draft Teardown`
- [x] `47. The Browser Error State Exposes Honest Recovery Information`
#### implementation target:
  - research and fix newly accepted imported-reference load failures, starting with the red-bar `.glb` regression seen immediately after `Add To Project`, without widening back into broader staged-import redesign



## [x] `Import-3` - `Import Window Structure Review And Add-To-Project Settings`

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
13. `Import-3 Phase 12 - Post-Accept Imported Reference Load Failure Research And Fix`

Reason:
- the menu entry and window shell should exist before intake behavior is widened
- supported file-type intake should exist before the staged file list depends on it
- the staged file list should exist before its first overflow and usability polish pass can tighten it
- the staged file list and its first polish pass should exist before structure inspection and later per-file settings widen the window
- structure inspection should exist before the split-versus-single-object choice depends on it
- preview Browser organization should be explicit before the final commit path depends on it
- orientation, scale or units, and placement should become explicit import settings before the final commit path lands
- the final commit path should consume explicit reviewed settings and reviewed organization rather than discovering them ad hoc
- any post-accept imported-reference load failure discovered after ship should get its own narrow follow-up lane instead of being hidden inside the finished cleanup pass

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

## [x] `Import-3` - `Phase 3B - Staged File List Polish Pass`

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

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - already owns the visible staged-file review area inside the browser-owned `Import Files` dialog
  - already renders:
    - the empty staged-list state
    - the ordered staged rows
    - the staged row file-type badges
  - is the right owner for adding one local wrapper or container seam if the staged list needs a bounded scrolling region
- `src/app/theme/surfaces/browser.css`
  - already owns all current `Import Files` dialog styling, including:
    - the staged list container
    - staged row layout
    - empty-state styling
  - is the primary seam for:
    - max-height
    - overflow behavior
    - scrollbar visibility and polish
    - any small spacing adjustment needed to keep the list readable while scrollable
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves:
    - the staged list empty state
    - ordered staged-file row rendering
    - stable append order across repeated browse intake
  - is the strongest first proof target for verifying that the staged review list now owns a bounded scrolling container without changing the staged row contract
- `src/app/panels/BrowserPanel.tsx`
  - should remain a thin shell owner in this phase
  - likely needs no behavior change unless the dialog prop shape widens slightly for a testable list-region label

### First Pass Decisions

- keep `Phase 3B` as the first staged-list usability polish cut, not a redesign pass
- make the scrollbar the first owned behavior:
  - the staged review list should gain a bounded height
  - overflow should scroll inside the list region
  - the rest of the dialog should remain stable
- keep the existing staged row content unchanged:
  - no remove buttons
  - no drag reorder
  - no structure summary
  - no per-file settings
- keep the empty state visible and unscrolled when no files are staged yet
- prefer a dedicated staged-list scroll region over making the entire dialog body scroll first
- keep visual polish narrow:
  - enough spacing and containment so the scrollbar reads intentionally
  - no broader color, typography, or interaction redesign yet

### Implementation Spec

#### Exact First Code Cut

1. Add a dedicated bounded scroll region around the staged-file review list in `src/app/panels/browserTreeMenus.tsx`.
2. Style that region in `src/app/theme/surfaces/browser.css` with:
   - a max height
   - `overflow-y` scrolling
   - local scrollbar treatment that fits the current Browser dialog styling
3. Keep the empty state outside the scroll behavior unless implementation simplicity clearly favors reusing the same container without harming readability.
4. Keep staged row order, row content, and Browser intake behavior unchanged.
5. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - the staged review list exposes a dedicated scrollable region once files are staged
   - repeated staged intake still appends in stable order inside that same region
   - project content still remains untouched

#### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/app/panels/BrowserPanel.test.tsx`

#### No-Widening Rule

- do not add structure parsing, hierarchy reads, or part reads yet
- do not add row actions such as remove, reorder, expand, or drag behavior yet
- do not widen into general dialog redesign or later visual polish themes
- do not add import-mode controls, up-axis, scale, units, `New Assembly`, or `Add To Project` yet
- do not change staged draft ownership or Browser intake behavior in this phase

#### Implementation Risks

- making the entire dialog scroll instead of the staged review region and reducing overall usability
- choosing an unbounded max height so the scrollbar never appears when it should
- styling the scrollbar or list region in a way that makes the staged rows feel like committed Browser content
- accidentally hiding the empty state or the Browser intake controls when the list overflows

#### Checklist

- [x] add one dedicated scrollable region for the staged file list
- [x] bound the staged review list height so overflow stays inside the list
- [x] add a visible local scrollbar style that fits the existing dialog surface
- [x] keep existing staged row order and row content unchanged
- [x] keep the empty state readable when no files are staged yet
- [x] keep project content unchanged during staged review and list overflow
- [x] add focused Browser proof for the new scroll region without widening behavior

#### Verification Shape

Minimum verification for this phase should cover:

- the staged review area now owns a dedicated bounded region instead of growing forever with the dialog
- that region becomes scrollable when enough files are staged
- the staged row order still reflects the stored draft order inside the scroll region
- the empty state still reads clearly before any files are staged
- project content still does not change while the user is only staging and reviewing files

#### Done Shape

`Phase 3B` is done when:

- the staged file list has its own bounded scrollable region
- overflow is handled by a local scrollbar inside the review area
- the list remains readable and ordered without changing staged row behavior
- the phase still stops before structure inspection or later import settings widen the dialog

#### Implemented Result

- the staged review list now lives inside its own bounded scroll region instead of growing indefinitely with the dialog
- the staged list now shows a local scrollbar when overflow is needed
- the existing staged row order, row content, and empty-state behavior remain unchanged
- project content still remains untouched while the user is only staging and reviewing files

## [x] `Import-3` - `Phase 4 - Pre-Add Structure Inspection Contract`

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

### Implementation-Prep Read

- `src/viewer/referencePartDescriptors.ts`
  - already owns the truthful per-mesh part-label extraction seam for loaded references
  - already returns:
    - stable `partKey`
    - user-facing `label`
    - `sourceMeshIndex`
  - is the strongest existing source for the first honest `has parts` and meaningful-label read when a loaded reference resolves to multiple leaf meshes
- `src/viewer/Viewer.ts`
  - already owns the live reference load pipeline through:
    - `loadReferenceObject(...)`
    - `loadReferenceAssetObject(...)`
    - `extractReferencePartDescriptors(...)`
  - already branches by supported file type:
    - `.glb`
    - `.obj`
    - `.stl`
    - `.step`
  - is the right current code-backed read for what truthful structure information is actually available after asset load
- `src/viewer/stepReferenceLoader.ts`
  - already owns the `.step` object build seam
  - may need to be inspected during implementation if the staged structure read wants to preserve any honest assembly or node naming that survives the current STEP object construction path
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the visible staged review rows
  - is the right first owner for surfacing pre-add structure results next to or beneath each staged row once that contract exists
- `src/app/store/useAppStore.ts`
  - already owns the staged import draft and the staged file records
  - should become the owner of any structure-inspection results that the dialog needs to render before commit
  - should still stop short of import-mode choice and commit semantics in this phase
- `src/app/panels/useBrowserPanelController.ts`
  - already owns staged intake into the draft
  - is the likely place to trigger or coordinate the first structure-inspection pass once staged files are present
  - should stay narrow and avoid mutating project content
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves staged row rendering and stable append order
  - is the strongest first proof target for showing honest structure badges or labels per staged row without changing the draft-only ownership model

### First Pass Decisions

- keep `Phase 4` focused on the first honest structure read only
- prefer truthful availability over uniformity:
  - if one file type exposes only part-level truth, show that
  - if another file type reads flatter, show the flatter truth
  - do not force every type into the same fake tree language
- the first structure contract should answer only the review questions the user asked for:
  - does the file have multiple objects
  - does the file have hierarchy
  - does the file have parts
  - are there meaningful structure labels to show
- keep the first visible structure result compact and row-local:
  - per-row summary or badges
  - optional small label preview when truthful labels exist
  - no deep nested tree editor yet
- if a staged file cannot yet be inspected honestly until it loads, store and surface that limitation explicitly instead of inventing structure
- keep structure inspection asynchronous and draft-owned:
  - it should not create imported references
  - it should not publish Browser content rows
  - it should not silently commit anything into project state outside the staged draft
- keep import-mode choice out of this phase even if the structure read makes the later split option possible

### Implementation Spec

#### Exact First Code Cut

1. Add a staged structure-inspection result contract to `src/app/store/useAppStore.ts` for each staged file.
2. Reuse the live supported reference load seams in `src/viewer/Viewer.ts` and `src/viewer/referencePartDescriptors.ts` to derive the first honest structure read per staged file.
3. Store only compact pre-add structure summary results in the staged draft, such as:
   - `hasMultipleObjects`
   - `hasHierarchy`
   - `hasParts`
   - meaningful structure labels when available
4. Surface those results in the `Import Files` dialog rows in `src/app/panels/browserTreeMenus.tsx` without turning the staged review list into a deep Browser tree.
5. Keep any loading or unavailable state explicit if structure cannot yet be read honestly for a staged file.
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - staged rows can show structure-read results
   - flat files do not claim fake hierarchy
   - project content still stays untouched during inspection

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/viewer/referencePartDescriptors.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/stepReferenceLoader.ts`

#### No-Widening Rule

- do not add `1 Object` versus `Multiple Objects In 1 Component` controls yet
- do not add drag-and-drop organization, up-axis, scale, units, `New Assembly`, or `Add To Project` yet
- do not invent nested tree UIs or fake hierarchy when only flat mesh truth exists
- do not create imported references, project content rows, or viewer-owned accepted runtime records during inspection
- do not widen this phase into deep loader refactors unless the current truthful structure read cannot be surfaced otherwise

#### Implementation Risks

- promising hierarchy for file types whose current load seam only exposes flat leaf meshes
- coupling the staged inspection result too tightly to viewer runtime objects instead of storing a compact draft-owned summary
- making structure reads block the staged dialog in a way that harms basic browse-and-review flow
- widening into import-mode decisions before the raw structure contract is stable

#### Checklist

- [x] add a draft-owned pre-add structure result contract per staged file
- [x] derive the first honest structure read from the existing supported reference load seams
- [x] show whether each staged file has multiple objects, hierarchy, and parts when that truth is available
- [x] show meaningful structure labels when they exist
- [x] keep flat files honest instead of showing fake hierarchy
- [x] keep project content unchanged during staged inspection
- [x] add focused proof for row-visible structure reads and honest flat-file behavior

#### Verification Shape

Minimum verification for this phase should cover:

- staged rows can now surface structure-read results without becoming committed Browser content
- files with truthful multi-part reads show that parts exist
- files without honest hierarchy stay flat in the UI instead of claiming nested structure
- meaningful structure labels are shown when the loader seam exposes them
- structure inspection stays draft-only and does not mutate project content

#### Done Shape

`Phase 4` is done when:

- each staged file can show the first honest pre-add structure summary available from the current load seams
- the dialog can communicate multiple objects, hierarchy, parts, and meaningful labels when truthful
- flat files stay clearly flat instead of pretending they have hierarchy
- the phase still stops before import-mode choice or any final commit behavior lands

#### Implemented Result

- the staged import draft now stores async per-file structure inspection state and compact resolved structure summaries before commit
- the staged import flow now reuses the live supported reference loaders plus the truthful part-descriptor seam to derive pre-add multiple-object, hierarchy, parts, and meaningful-label reads
- staged rows in the `Import Files` dialog now show explicit loading, unavailable, and flat-file states instead of inventing fake hierarchy
- project content still remains untouched while the user is only staging and inspecting files

## [x] `Import-3` - `Phase 5 - Structured Import Mode Choice`

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

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - now already owns the staged import draft plus `stagedFiles[*].structureInspection`
  - already exposes the current truthful split-support gate through:
    - `canReferenceItemExplode(...)`
    - loaded runtime part rows with integer `sourceMeshIndex`
  - already owns the current truthful post-acceptance split path through:
    - `explodeImportedReference(...)`
    - child imported-reference creation with:
      - `explodedFromReferenceId`
      - `sourcePartKey`
      - `sourceMeshIndex`
  - is the right owner for the later accepted import-mode setting because the mode should stay draft-owned until `Add To Project`
- `src/viewer/referenceStructureInspection.ts`
  - now already resolves compact pre-add structure summary truth for staged files:
    - `hasMultipleObjects`
    - `hasHierarchy`
    - `hasParts`
    - meaningful `labels`
  - is the right first support signal for whether the UI should even consider showing a structured import choice
  - also makes clear that not every file with some structure truth necessarily has truthful split-ready part provenance
- `src/viewer/referencePartDescriptors.ts`
  - already gives the current truthful per-part extraction seam with stable `sourceMeshIndex`
  - remains the strongest existing code-backed reason to allow `Multiple Objects In 1 Component` only when `hasParts` is true rather than whenever hierarchy or multi-object reads merely exist
- `src/viewer/Viewer.ts`
  - already validates exploded-reference provenance through:
    - `resolveExplodedReferenceLoadProvenance(...)`
    - `isolateReferenceMeshByIndex(...)`
    - `handoffExplodedReferenceChildren(...)`
  - is the current live proof that split children must carry real mesh-index-backed provenance instead of a fake Browser-only grouping story
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the staged import rows plus the row-local structure-summary rendering
  - is the right first owner for a compact visible import-mode control once support is honest
  - should keep the choice row-local and settings-like rather than turning the dialog into a deep Browser tree or settings matrix
- `src/app/panels/useBrowserPanelController.ts`
  - already coordinates staged intake and staged structure inspection
  - should stay narrow in `Phase 5`:
    - read the draft-owned support truth
    - route user mode changes into the staged draft
    - avoid any accepted project mutation
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves staged draft review plus honest structure summary behavior
  - is the strongest first proof target for:
    - showing `1 Object` by default
    - showing `Multiple Objects In 1 Component` only when truly supported
    - keeping project content untouched while the user only changes the staged mode

### First Pass Decisions

- keep `Phase 5` focused on choosing import mode only:
  - no final commit path yet
  - no preview Browser organization yet
  - no up-axis, scale, units, or placement settings yet
- keep `1 Object` as the default compatibility mode for every staged file
- show `Multiple Objects In 1 Component` only when the current truthful support gate is met:
  - the staged structure read says `hasParts`
  - the later split path can still reuse real per-part provenance
  - do not offer split just because a file shows hierarchy or multiple objects if that truth is not yet split-ready
- align the structured import choice with the existing explode ownership model:
  - one accepted wrapper object path for `1 Object`
  - one accepted part-backed child-object path for `Multiple Objects In 1 Component`
  - no second fake staged-only hierarchy contract
- keep the first visible import-mode controls compact and row-local:
  - one small mode group beneath the structure summary
  - no separate side panel
  - no deep nested Browser preview yet
- store the chosen mode per staged file in the staged draft so later phases can consume it deterministically
- if the file is flat or otherwise not truthfully split-ready, keep the row honest:
  - show only `1 Object`
  - do not imply that split import is merely disabled temporarily if the current system cannot support it truthfully

### Implementation Spec

#### Exact First Code Cut

1. Add one draft-owned import-mode contract per staged file in `src/app/store/useAppStore.ts`, with `1 Object` as the default mode.
2. Derive structured split support from the existing staged structure summary and the current truthful part-backed split rules instead of inventing a new looser gate.
3. Surface one explicit row-local mode choice in `src/app/panels/browserTreeMenus.tsx`:
   - always show `1 Object`
   - show `Multiple Objects In 1 Component` only when truthfully supported
4. Route user mode changes through `src/app/panels/useBrowserPanelController.ts` into the staged draft without mutating project content.
5. Keep the current direct import compatibility rows and the later commit path unchanged in this phase.
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - supported staged files show both mode choices
   - unsupported or flat files show only `1 Object`
   - the chosen mode stays in staged draft state
   - project content still remains untouched

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/viewer/referenceStructureInspection.ts`
- `src/viewer/referencePartDescriptors.ts`
- `src/viewer/Viewer.ts`

#### No-Widening Rule

- do not add final `Add To Project` commit behavior yet
- do not mutate accepted imported references or call `explodeImportedReference(...)` during staged review
- do not add preview Browser organization, drag-and-drop, up-axis, scale, units, or `New Assembly` yet
- do not offer split import for hierarchy-only or multi-object-only reads when truthful part-backed provenance is not available
- do not invent a staged-only fake component or child-object model separate from the existing explode direction

#### Implementation Risks

- treating any non-flat structure read as split-capable and over-promising support
- storing the chosen import mode outside the staged draft and creating another hidden owner
- coupling the visible choice too tightly to later commit code before the mode contract is stable
- widening the UI into preview-organization behavior before the explicit mode choice is settled

#### Checklist

- [x] add a draft-owned per-file import-mode setting with `1 Object` as the default
- [x] show `Multiple Objects In 1 Component` only when truthful split support exists
- [x] keep unsupported or flat files honest by showing only `1 Object`
- [x] align the staged split choice with the existing truthful part-provenance direction
- [x] keep project content unchanged while the user only changes staged import mode
- [x] add focused Browser proof for supported versus unsupported mode visibility and draft-owned mode changes

#### Verification Shape

Minimum verification for this phase should cover:

- files with truthful part-backed structure support now show both `1 Object` and `Multiple Objects In 1 Component`
- flat files or non-split-ready files still show only `1 Object`
- changing the selected mode updates staged draft state without creating project content
- the visible mode choice remains aligned with the already-shipped structure summary truth instead of promising unsupported split behavior

#### Done Shape

`Phase 5` is done when:

- each staged file has one explicit draft-owned import mode
- `Multiple Objects In 1 Component` appears only for truthfully split-ready files
- the user can choose between compatibility-wrapper and part-backed modes before commit
- the phase still stops before preview Browser organization or final commit behavior lands

#### Implemented Result

- each staged file now carries one explicit draft-owned import mode with `1 Object` as the default
- staged rows now show `Multiple Objects In 1 Component` only when the shipped pre-add structure read exposes truthful part-backed split support
- flat or otherwise unsupported files now stay honest by showing only `1 Object`
- changing import mode stays inside staged draft state and does not mutate project content or trigger the later commit path

## [x] `Import-3` - `Phase 6 - Preview Browser Organization Before Commit`

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

### Implementation-Prep Read

- `src/app/panels/browserContentDrag.ts`
  - already owns the shared Browser drag-session language through:
    - `BrowserContentDragIntent`
    - `BrowserContentDragSession`
    - `createBrowserContentDragSession(...)`
    - `resolveBrowserContentDragPreviewState(...)`
  - is the right first seam to reuse for hover intent, drop preview, and honest legal-versus-invalid drop feedback inside the staged preview Browser
  - should stay the shared preview contract instead of letting `Phase 6` invent a second drag vocabulary
- `src/app/panels/useBrowserPanelController.ts`
  - already owns the live Browser drag handling plus the content-owner move entry points through:
    - `resolveBrowserDraggableTargetDrop(...)`
    - `moveProjectContentOwner(...)`
    - `moveProjectContentOwnersBatch(...)`
    - `createProjectAssembly(...)`
    - `createProjectComponent(...)`
  - already reads `contentOrderByParentKey`
  - is the strongest current seam for shaping a staged-only preview organization controller because it already knows how Browser rows resolve, group, and move
  - should keep `Phase 6` narrow by coordinating staged preview organization without publishing project content yet
- `src/app/store/useAppStore.ts`
  - already owns the staged import draft plus the per-file structure summary and import mode
  - already owns the live content-order seam through `referenceWorkspace.contentOrderByParentKey`
  - already owns the authored project organization helpers that the later commit path will need to align with
  - is the right owner for staged preview organization state because the organization must remain draft-owned until `Add To Project`
- `src/app/panels/selectBrowserTreeRows.ts`
  - already depends on `contentOrderByParentKey` to flatten owner children into Browser row order
  - is a useful shape reference for how the preview Browser can stay order-aware without inventing a separate fake row language
- `src/app/panels/browserTreeMenus.tsx`
  - already owns the visible staged import rows and the row-local structure plus import-mode UI
  - is the right first place to surface a compact preview Browser section inside the `Import Files` dialog
  - should keep the preview organization readable and Browser-like without widening the dialog into a second full Browser panel
- `src/app/panels/BrowserPanel.test.tsx`
  - already has strong drag and drop proof around:
    - same-parent reorder
    - cross-parent moves
    - grouped owner drag
    - visible drop preview state
  - is the strongest first proof target for staged preview organization because the existing Browser drag semantics already have test language we can mirror without mutating project content

### First Pass Decisions

- keep `Phase 6` focused on staging-only preview organization:
  - no final `Add To Project` commit yet
  - no up-axis, scale, units, or `New Assembly` options yet
  - no widening into a second authored Browser surface outside the import window
- reuse the existing Browser drag vocabulary and drop-intent behavior as much as possible so the staged preview feels like the real Browser instead of a one-off organizer
- keep all preview organization state inside the staged import draft:
  - organization choices must survive dialog interaction
  - organization choices must stay out of published project content
- keep the preview organization honest to the currently staged import truth:
  - `1 Object` files preview as one movable row
  - `Multiple Objects In 1 Component` files can preview the truthful split result that will later commit through real part-backed provenance
  - do not invent fake nested children for flat files
- the first pass should prefer authored organization affordances the system already understands:
  - components
  - sub-assemblies
  - Browser-style reorder and into-drop positioning
- if a staged preview needs lightweight draft-owned owner nodes, keep them explicitly draft-owned and shaped to align with the later real commit path rather than becoming a permanent second project graph

### Implementation Spec

#### Exact First Code Cut

1. Add one staged preview-organization contract to `src/app/store/useAppStore.ts` so the staged import draft can hold Browser-like owner structure and row order without creating project content.
2. Derive the first preview rows from the already-shipped staged structure summary plus staged import mode:
   - `1 Object` files contribute one preview row
   - `Multiple Objects In 1 Component` files contribute truthful part-backed child rows grouped under one draft component-style owner
3. Reuse the shared drag-session and drop-preview helpers in `src/app/panels/browserContentDrag.ts` so the staged preview Browser resolves the same core legal-versus-invalid intent language as the real Browser.
4. Route staged drag and drop through `src/app/panels/useBrowserPanelController.ts` into draft-owned preview organization state instead of `moveProjectContentOwner(...)` or other published project mutations.
5. Render one compact preview Browser section in `src/app/panels/browserTreeMenus.tsx` beneath the staged file settings so the user can reorganize the staged result before commit.
6. Keep the later final commit path unchanged in this phase, but shape the staged preview state so `Phase 10` can consume it deterministically.
7. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - staged preview rows render from the current staged import draft
   - legal reorder and into-drop preview is visible before drop
   - staged organization changes persist in the draft
   - project content remains untouched while the user only reorganizes the staged preview

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserContentDrag.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`

#### No-Widening Rule

- do not commit staged preview organization into project content yet
- do not wire `Add To Project` to consume the preview organization yet
- do not add up-axis, scale, units, or `New Assembly` settings yet
- do not invent fake child rows for flat `1 Object` files
- do not replace the real Browser drag semantics with a separate staged-only drag vocabulary
- do not widen the import window into a full duplicate Browser feature set beyond the narrow preview organization needed for this phase

#### Implementation Risks

- inventing a second Browser ownership model whose shape does not line up with the later commit path
- accidentally mutating `projectContent` while trying to reuse the live owner-move helpers
- over-promising preview hierarchy for files whose chosen import mode still resolves to one flat object
- widening the UI into a full tree editor instead of a compact pre-commit organization surface

#### Checklist

- [x] add a draft-owned staged preview-organization contract that can hold owner rows and order
- [x] derive preview rows from the staged structure summary plus selected import mode
- [x] reuse the shared Browser drag-session preview language for staged preview drag and drop
- [x] support Browser-like reorder and into-drop organization inside the import window
- [x] keep staged preview organization persistent in the draft and out of project content
- [x] add focused Browser proof for visible preview rows, legal drop feedback, and draft-only organization changes

#### Verification Shape

Minimum verification for this phase should cover:

- the import window now shows a preview Browser-style organization surface for the staged result
- `1 Object` files preview as one movable row while split-ready files preview their truthful grouped result
- staged preview drag and drop shows honest legal versus invalid intent before drop
- dropping rows updates only staged draft organization state
- project content remains unchanged until the later commit phase

#### Done Shape

`Phase 6` is done when:

- the import window can preview the staged import result as Browser-like rows before commit
- the user can reorganize those staged rows into components or sub-assemblies using familiar Browser drag and drop behavior
- the chosen organization remains attached to the staged draft
- the phase still stops short of final `Add To Project` commit behavior

#### Implemented Result

- the staged import draft now carries one draft-owned preview-organization graph that stays synchronized with staged files, structure reads, and import mode changes
- the import dialog now shows a compact preview Browser section with truthful split-file component plus part rows, one `New Assembly` action, and per-assembly `Add Component` actions
- staged preview rows now reuse the shared Browser drag-session and drop-preview language so users can reorganize rows before commit without mutating project content
- focused Browser proof now covers visible preview rows, truthful split expansion, visible legal drop feedback, and draft-only staged reorganization

## [x] `Import-3` - `Phase 7 - Up-Axis Settings`

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

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - already owns the staged import draft plus the draft-only per-file import settings added in earlier phases
  - already owns the shared reference transform-override contract through:
    - `buildDefaultReferenceTransformOverride()`
    - `referenceWorkspace.transformOverrideById`
    - `setReferenceTransformOverride(...)`
  - is the right first owner for a draft-only per-file up-axis choice because the setting should live beside the other staged import decisions until the later accept path consumes it
- `src/app/panels/useBrowserPanelController.ts`
  - already coordinates staged file intake, draft structure inspection, import mode changes, and preview organization changes
  - is the strongest current seam for wiring row-local up-axis controls into the staged draft without publishing project content yet
  - should keep `Phase 7` narrow by recording the chosen axis now and leaving final acceptance behavior for the later commit phase
- `src/app/panels/browserTreeMenus.tsx`
  - already renders the staged file rows, truthful structure reads, and import-mode controls
  - is the right first place to surface one explicit row-local orientation choice without widening the dialog into a full transform editor
- `src/viewer/Viewer.ts`
  - already applies base reference transform plus transform overrides through the live `rotationDeg` path
  - already keeps the default imported reference rotation at `{ x: 0, y: 0, z: 0 }`
  - is the authoritative seam for how the later accepted import truth should actually land visually, so `Phase 7` should align with this rotation contract instead of inventing a separate orientation system
- `src/app/panels/BrowserPanel.test.tsx`
  - already has the strongest staged-import dialog proof surface for row-local settings
  - is the right first proof target for visible `Z Up` or `Y Up` or `X Up` controls and draft-only state changes that stay out of project content

### First Pass Decisions

- keep `Phase 7` focused on one explicit per-file up-axis setting only:
  - no scale or units alignment yet
  - no final `Add To Project` commit behavior yet
  - no generic rotation editor and no arbitrary degree entry
- keep the first pass to the three explicit choices only:
  - `Z Up`
  - `Y Up`
  - `X Up`
- store the chosen up-axis in the staged import draft beside the other per-file settings so the decision is visible, editable, and still project-safe before commit
- treat the later accepted orientation as import-owned truth that should align with the existing `rotationDeg` transform seam instead of becoming a hidden post-import viewer correction
- prefer deterministic axis-to-rotation mapping owned by the import flow over ad hoc viewer nudges after acceptance
- keep the row-local UI compact and explicit:
  - the choice should live with the staged file row
  - the choice should not be hidden behind a later Browser or viewer-only control

### Implementation Spec

#### Exact First Code Cut

1. Add one draft-owned per-file up-axis field to the staged import draft in `src/app/store/useAppStore.ts`, with `Z Up` as the default compatibility path.
2. Add one narrow staged setter for that field so the import dialog can update axis choice without touching project content.
3. Render one row-local `Up Axis` control in `src/app/panels/browserTreeMenus.tsx` with explicit `Z Up`, `Y Up`, and `X Up` actions for every staged file.
4. Wire those row-local actions through `src/app/panels/useBrowserPanelController.ts` into the staged draft.
5. Keep the later final commit path unchanged in this phase, but document and shape the staged field so `Phase 10` can deterministically translate the chosen axis into accepted rotation truth through the existing transform-override seam.
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - every staged file shows the explicit up-axis choices
   - the default staged choice is `Z Up`
   - switching to `Y Up` or `X Up` updates only the staged draft state
   - project content remains untouched while the user changes orientation choices inside the import window

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`

#### No-Widening Rule

- do not add scale or units controls yet
- do not add arbitrary numeric rotation editing yet
- do not mutate `projectContent` or accepted reference transforms yet
- do not hide the new axis choice behind a later viewer-only correction path
- do not widen this phase into the final `Add To Project` commit behavior

#### Implementation Risks

- introducing a staged axis choice whose later accepted rotation mapping does not line up with the existing `rotationDeg` transform contract
- leaking orientation writes into published reference transform state before the later commit phase
- overcomplicating the UI by turning a narrow import setting into a general-purpose transform editor
- leaving the staged default ambiguous instead of preserving the current compatibility path

#### Checklist

- [x] add one draft-owned per-file up-axis setting to the staged import draft
- [x] render explicit row-local `Z Up`, `Y Up`, and `X Up` controls in the import window
- [x] keep `Z Up` as the staged default compatibility path
- [x] keep up-axis changes draft-only and out of project content
- [x] align the staged setting with the later accepted `rotationDeg` transform seam
- [x] add focused Browser proof for visible controls and draft-only per-file axis changes

#### Verification Shape

Minimum verification for this phase should cover:

- the import window now shows explicit `Z Up`, `Y Up`, and `X Up` choices for each staged file
- newly staged files default to `Z Up`
- changing a staged file to `Y Up` or `X Up` updates only staged draft state
- project content and accepted reference transform state remain unchanged until the later commit phase

#### Done Shape

`Phase 7` is done when:

- each staged file can explicitly choose `Z Up`, `Y Up`, or `X Up` inside the import window
- that orientation choice lives in the staged import draft as an import-owned decision
- the phase stays aligned with the existing reference transform rotation seam for later acceptance
- the phase still stops short of final commit behavior, scale, and units work

#### Implemented Result

- the staged import draft now carries one explicit per-file `upAxis` setting with `Z Up` as the default compatibility path for newly staged files
- staged file rows now show row-local `Z Up`, `Y Up`, and `X Up` controls even when structure inspection is still loading or unavailable, keeping orientation as an explicit import setting instead of a gated later fix
- changing up-axis now stays draft-only through the staged import controller and does not mutate project content or accepted reference transforms yet
- focused Browser proof now covers visible axis choices, default `Z Up`, and draft-only per-file axis changes inside the `Import Files` dialog

## [x] `Import-3` - `Phase 8 - Scale And Units Alignment`

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

### Implementation-Prep Read

- `src/app/references/referenceManifest.ts`
  - already defines the import-facing base display transform through `ReferenceDisplayTransform`
  - already carries a scalar `displayTransform.scale` seam for accepted reference truth
  - is the strongest current seam for where accepted size alignment should eventually land instead of becoming a viewer-only workaround
- `src/viewer/Viewer.ts`
  - already applies `reference.displayTransform.scale` when creating the imported reference pivot
  - already combines the base transform with `transformOverride.scale` through `applyReferenceTransformOverride(...)`
  - is the authoritative read for how accepted import-owned scale should differ from later user-authored transform edits
- `src/app/store/useAppStore.ts`
  - already owns the staged import draft plus the shipped per-file import mode and up-axis settings
  - is the right first owner for draft-only scale or units alignment choices because those decisions should remain staged until the later commit path accepts them
  - should keep `Phase 8` narrow by storing import-owned size intent without mutating accepted transform override state yet
- `src/app/panels/useBrowserPanelController.ts`
  - already coordinates the staged per-file settings that the import dialog exposes
  - is the right seam for wiring row-local scale or units controls into the staged draft without publishing project content early
- `src/app/panels/browserTreeMenus.tsx`
  - already renders the staged file rows plus the shipped `Import as` and `Up Axis` per-file settings
  - is the right first place to surface one explicit size-alignment control group without widening the dialog into a general transform editor
- `src/app/panels/BrowserPanel.test.tsx`
  - already has the strongest focused proof surface for staged per-file setting visibility and draft-only updates
  - is the best first target for proving default size alignment, visible choices, and project-safe staged updates

### First Pass Decisions

- keep `Phase 8` focused on import-owned size alignment only:
  - no final `Add To Project` commit behavior yet
  - no generic XYZ scale editor
  - no late viewer-only correction path
- treat "scale or units" as one staged import decision surface whose first implementation should stay deterministic:
  - either explicit units presets or explicit alignment presets may be shown
  - the accepted result should resolve to one import-owned scale truth rather than a second freeform transform system
- prefer a small explicit preset set over arbitrary numeric entry in the first pass so the import dialog stays honest and low-friction
- keep the size-alignment setting per-file and row-local beside the other staged import settings
- align the future accepted result with the existing base display-transform scale seam first, leaving later viewer transform overrides for post-import authored edits rather than import normalization

### Implementation Spec

#### Exact First Code Cut

1. Add one draft-owned per-file scale or units alignment field to the staged import draft in `src/app/store/useAppStore.ts`, with a compatibility default that preserves current imported size behavior.
2. Add one narrow staged setter for that field so the import dialog can update size alignment without touching project content or accepted reference transform overrides.
3. Render one row-local size-alignment control group in `src/app/panels/browserTreeMenus.tsx` with a small explicit preset set that maps deterministically to accepted import scale truth.
4. Wire those row-local actions through `src/app/panels/useBrowserPanelController.ts` into the staged draft.
5. Keep the later final commit path unchanged in this phase, but shape the staged field so `Phase 10` can translate the chosen size alignment into accepted import-owned scale truth through the existing display-transform seam.
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - each staged file shows the explicit size-alignment choices
   - newly staged files use the compatibility default
   - changing size alignment updates only staged draft state
   - project content remains untouched while the user changes size alignment in the import window

#### Likely Files

- `src/app/references/referenceManifest.ts`
- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`
- `src/viewer/Viewer.ts`

#### No-Widening Rule

- do not add arbitrary numeric scale editing yet
- do not add post-import viewer-only compensation logic
- do not mutate accepted reference transforms or `projectContent` yet
- do not widen this phase into final `Add To Project` commit behavior
- do not blur the line between import-owned normalization and later authored transform overrides

#### Implementation Risks

- storing size alignment in a way that later lands as a viewer override instead of accepted import-owned truth
- widening the import dialog into a general transform panel instead of a narrow staged import setting surface
- choosing a first-pass preset model whose mapping to accepted scale truth is ambiguous
- coupling units copy too tightly to unsupported real unit parsing before the staged import contract is ready for it

#### Checklist

- [x] add one draft-owned per-file scale or units alignment setting to the staged import draft
- [x] render explicit row-local size-alignment choices in the import window
- [x] keep the staged default aligned with current imported size behavior
- [x] keep size-alignment changes draft-only and out of project content
- [x] align the staged setting with the later accepted display-transform scale seam
- [x] add focused Browser proof for visible controls and draft-only per-file size-alignment changes

#### Verification Shape

Minimum verification for this phase should cover:

- the import window now shows explicit size-alignment choices for each staged file
- newly staged files default to the compatibility path
- changing a staged file's size alignment updates only staged draft state
- project content and accepted reference transform state remain unchanged until the later commit phase

#### Done Shape

`Phase 8` is done when:

- each staged file can explicitly choose size alignment inside the import window
- that size-alignment choice lives in the staged import draft as import-owned intent
- the phase stays aligned with the accepted display-transform scale seam for later commit work
- the phase still stops short of final commit behavior and does not widen into a freeform transform editor

#### Implemented Result

- the staged import draft now carries one explicit per-file `scaleAlignment` setting with `Current` as the default compatibility path for newly staged files
- staged file rows now show row-local `Current`, `mm`, `cm`, `m`, and `in` choices so size alignment is visible as an import-owned setting instead of a later hidden viewer fix
- the staged import store now exposes a deterministic scale-factor mapping seam for those choices so the later commit path can land accepted import-owned scale truth through the existing display-transform contract
- changing size alignment now stays draft-only through the staged import controller and does not mutate project content or accepted reference transforms yet
- focused Browser proof now covers visible size-alignment choices, default `Current`, and draft-only per-file size-alignment changes inside the `Import Files` dialog

## [x] `Import-3` - `Phase 9 - New Assembly Placement Option`

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

### Implementation-Prep Read

- `src/app/panels/useBrowserPanelController.ts`
  - already owns the current Browser import landing-parent resolution through `resolveImportLandingParent()`
  - already opens the staged import draft with that resolved `parentAssemblyId` or `parentComponentId`
  - already owns the authored `createProjectAssembly(...)` seam used outside staged import
  - is the strongest current seam for adding one explicit staged placement option now while leaving real assembly creation for the later accept path
- `src/app/store/useAppStore.ts`
  - already stores the staged import draft's landing context through:
    - `parentAssemblyId`
    - `parentComponentId`
  - already owns the staged preview assembly graph and the authored `createProjectAssembly(...)` owner
  - is the right first owner for one draft-only `putAcceptedImportsInNewAssembly` setting because placement intent should remain staged until commit
- `src/app/panels/browserTreeMenus.tsx`
  - already renders the import dialog's visible landing target label
  - is the right first place to surface one explicit `Put Accepted Imports In New Assembly` control without widening the dialog into final commit UI
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves staged draft opening, landing-target copy, and draft-only per-file setting changes
  - is the strongest first proof target for default off-state, visible toggle behavior, and draft-only placement changes

### First Pass Decisions

- keep `Phase 9` focused on placement intent only:
  - no actual `Add To Project` commit yet
  - no real project assembly creation yet
  - no rework of preview Browser organization ownership yet
- store `New Assembly` as one explicit draft-owned boolean choice:
  - default off
  - visible in the import dialog
  - separate from the existing preview Browser's draft assemblies
- keep the off-state aligned with the current resolved Browser landing-parent behavior
- treat the on-state as accepted-placement intent for later commit work, not as permission to create real content rows early
- keep the visible copy honest that this option affects where accepted imports will land, not the current staged preview graph by itself

### Implementation Spec

#### Exact First Code Cut

1. Add one draft-owned `putAcceptedImportsInNewAssembly` field to the staged import draft in `src/app/store/useAppStore.ts`, defaulting to `false`.
2. Add one narrow staged setter for that field so the import dialog can toggle placement intent without touching project content.
3. Render one explicit `Put Accepted Imports In New Assembly` control in `src/app/panels/browserTreeMenus.tsx` near the landing-target read.
4. Wire that control through `src/app/panels/useBrowserPanelController.ts` into the staged draft.
5. Keep the later final commit path unchanged in this phase, but shape the staged field so `Phase 10` can choose between normal landing-parent behavior and authored `createProjectAssembly(...)` commit behavior.
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - the new assembly placement option is visible in the import dialog
   - newly opened staged import drafts default that option off
   - toggling the option updates only staged draft state
   - project content remains untouched while the user changes placement intent

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`

#### No-Widening Rule

- do not create a real assembly in project content yet
- do not wire the option into `Add To Project` yet
- do not change the existing preview Browser draft-assembly behavior yet
- do not widen this phase into final placement commit logic or broader organization refactors

#### Implementation Risks

- confusing draft preview assemblies with the separate accepted-placement `New Assembly` option
- creating real authored assembly rows too early just because the option becomes visible
- drifting the off-state away from the current resolved landing-parent behavior
- overloading the phase with final commit behavior before the staged contract is complete

#### Checklist

- [x] add one draft-owned `Put Accepted Imports In New Assembly` setting to the staged import draft
- [x] render an explicit visible placement control in the import window
- [x] keep the staged default off and aligned with current Browser landing behavior
- [x] keep placement changes draft-only and out of project content
- [x] shape the staged setting for the later authored-assembly commit path
- [x] add focused Browser proof for visible control and draft-only placement changes

#### Verification Shape

Minimum verification for this phase should cover:

- the import window now shows the `Put Accepted Imports In New Assembly` option
- newly opened staged import drafts default the option off
- toggling the option updates only staged draft state
- project content remains unchanged until the later commit phase

#### Done Shape

`Phase 9` is done when:

- the import window exposes an explicit `New Assembly` placement choice
- that choice lives in the staged import draft as accepted-placement intent
- the off-state still reflects current Browser landing behavior
- the phase still stops short of creating real project assemblies or committing the import

#### Implemented Result

- the staged import draft now carries one explicit `putAcceptedImportsInNewAssembly` setting with the default off-state aligned to current resolved Browser landing behavior
- the import dialog now shows an explicit `Put Accepted Imports In New Assembly` control beside honest commit-time placement copy so the option is visible without creating real project content early
- changing the placement option now stays draft-only through the staged import controller and does not create authored assemblies or mutate project content yet
- focused Browser proof now covers visible placement control, default off-state, and draft-only placement changes inside the `Import Files` dialog

## [x] `Import-3` - `Phase 10 - Add-To-Project Commit Path`

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

### Implementation-Prep Read

- `src/app/panels/useBrowserPanelController.ts`
  - already owns the staged import dialog lifecycle:
    - open
    - browse intake
    - cancel or close
  - already resolves the normal Browser landing parent through `resolveImportLandingParent()`
  - already still holds the older immediate `addImportedReference(...)` compatibility path for direct import rows
  - is the strongest seam for adding one explicit `Add To Project` accept action that consumes the staged draft and then closes it only after a successful commit
- `src/app/store/useAppStore.ts`
  - already stores the full staged import draft contract:
    - staged files
    - per-file import mode
    - per-file up-axis
    - per-file scale alignment
    - placement intent
    - preview organization
  - already owns the authored content creation seams:
    - `createProjectAssembly(...)`
    - `createProjectComponent(...)`
    - `addImportedReference(...)`
  - already owns the import-owned transform seam through `setReferenceTransformOverride(...)`
  - already exposes `resolveStagedImportScaleAlignmentFactor(...)`
  - already preserves the truthful multi-object provenance shape through `sourcePartKey`, `sourceMeshIndex`, and the existing explode-backed imported-reference model
  - is the correct owner for the final accepted import translation because this phase should turn draft intent into real project content without inventing a second hidden owner
- `src/app/panels/browserTreeMenus.tsx`
  - already renders the full staged import dialog body, including:
    - staged file review
    - structure summary
    - import mode
    - preview Browser
    - up-axis
    - scale or units
    - new assembly placement
  - already keeps `Cancel` visible
  - is the right seam for adding the first explicit `Add To Project` button and any narrow disabled-state or helper copy needed for acceptance
- `src/app/panels/BrowserPanel.tsx`
  - already threads the staged draft plus all staged mutators into the dialog
  - should stay a thin wiring shell in this phase while the real commit work stays controller-owned and store-owned
- `src/app/panels/BrowserPanel.test.tsx`
  - already proves the staged draft flow through:
    - intake
    - structure read
    - import mode
    - preview organization
    - up-axis
    - scale alignment
    - placement
  - is the strongest first proof target for final acceptance because it can verify that project content changes only when `Add To Project` is clicked and that reviewed staged choices survive commit

### First Pass Decisions

- keep `Phase 10` focused on the one explicit accept path:
  - `Add To Project` becomes the only staged-import commit point
  - cancel or close still discards the draft without mutating project content
- commit from one stable staged-draft snapshot rather than reading mutable live dialog state during a multi-step write
- keep the accepted placement contract explicit:
  - when `Put Accepted Imports In New Assembly` is off, reuse the resolved Browser landing parent
  - when it is on, create one authored assembly at commit time and use that assembly as the accepted landing shell for the reviewed staged result
- keep single-object imports on the compatibility-shaped path:
  - create one imported reference per staged file
  - then apply the chosen orientation and scale or units through import-owned transform override truth
- keep multi-object imports on the truthful part-backed path:
  - do not visibly commit one wrapper object and then immediately fake-split it
  - commit the accepted result directly as part-backed imported-reference children under one component
- preserve the reviewed preview Browser organization:
  - draft preview assemblies become authored assemblies
  - draft preview components become authored components
  - staged file and part rows land under the accepted parent mapped from that reviewed graph
- keep the first accept pass deterministic and narrow:
  - no background jobs
  - no partial-success recovery UI
  - no generalized transaction framework
  - if commit fails, keep the staged draft open and do not silently clear the user's reviewed state

### Implementation Spec

#### Exact First Code Cut

1. Add one explicit `Add To Project` action to the `Import Files` dialog in `src/app/panels/browserTreeMenus.tsx`, keeping `Cancel` unchanged and disabling acceptance only when there is nothing staged to commit.
2. Wire that action through `src/app/panels/BrowserPanel.tsx` into a new staged-import accept handler in `src/app/panels/useBrowserPanelController.ts`.
3. In `src/app/store/useAppStore.ts`, add one narrow staged-import commit helper that:
   - snapshots the current staged draft
   - resolves the accepted landing root from the normal landing parent plus the staged `putAcceptedImportsInNewAssembly` choice
   - walks the reviewed preview organization in stable order
   - creates authored assemblies and components for reviewed preview owner rows
   - commits staged file rows as either single-object or truthful part-backed imported-reference content under the mapped accepted owner
4. In that same store-owned commit path, translate the reviewed per-file import settings into accepted import truth:
   - apply the chosen up-axis through `setReferenceTransformOverride(...)` or an equivalent store-owned accepted-transform write
   - apply the chosen scale or units through `resolveStagedImportScaleAlignmentFactor(...)` and the same import-owned transform path
   - preserve `sourcePartKey` and `sourceMeshIndex` for multi-object accepted rows
5. Keep the direct Browser import compatibility rows unchanged in this phase, but make the staged dialog the first path that now truly waits for explicit user acceptance before project mutation.
6. Add focused Browser proof in `src/app/panels/BrowserPanel.test.tsx` that:
   - project content does not change before `Add To Project`
   - clicking `Add To Project` commits staged files into project content
   - reviewed single-object settings survive commit
   - reviewed multi-object settings survive commit
   - reviewed preview organization and new-assembly placement survive commit
   - successful accept closes the staged draft

#### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/theme/surfaces/browser.css`

#### No-Widening Rule

- do not widen this phase into drag-and-drop import from outside the dialog
- do not add background import progress, retry queues, or long-running job UI
- do not add arbitrary transform editing beyond consuming the reviewed staged up-axis and scale or units choices
- do not retire the older direct import compatibility rows yet
- do not invent a generalized second import-content model separate from existing project content and imported-reference ownership

#### Implementation Risks

- committing from live mutable draft state and producing inconsistent accepted parentage if the dialog changes mid-commit
- losing reviewed preview Browser organization by flattening accepted rows back onto the landing parent
- applying orientation or scale only as viewer behavior instead of storing import-owned transform truth
- regressing the truthful split path by inserting wrapper references first and then forcing an immediate visible explode sequence
- creating multiple authored top-level assemblies when `Put Accepted Imports In New Assembly` should create one accepted landing shell for the whole reviewed batch

#### Checklist

- [x] add an explicit `Add To Project` button to the staged import dialog
- [x] keep project content unchanged until `Add To Project` is clicked
- [x] commit reviewed single-object staged files through the accepted import path
- [x] commit reviewed multi-object staged files through the truthful part-backed path
- [x] translate reviewed up-axis and scale or units choices into accepted import-owned transform truth
- [x] preserve reviewed preview Browser organization during final commit
- [x] honor the staged `Put Accepted Imports In New Assembly` choice at commit time
- [x] close the staged draft only after successful acceptance
- [x] add focused Browser proof for pre-commit safety and post-commit result shape

#### Verification Shape

Minimum verification for this phase should cover:

- opening the staged import dialog and changing staged settings still does not mutate project content before acceptance
- the dialog now shows an explicit `Add To Project` button when staged files exist
- clicking `Add To Project` commits reviewed single-object files into the accepted Browser landing target
- clicking `Add To Project` commits reviewed multi-object files into a component with truthful part-backed imported-reference children
- the reviewed preview Browser organization is preserved in the accepted project result
- the reviewed `Put Accepted Imports In New Assembly` choice changes final landing ownership only at commit time
- the staged draft closes after successful acceptance and project content now reflects the reviewed result

#### Done Shape

`Phase 10` is done when:

- the import window has one explicit `Add To Project` button as its commit point
- the staged draft remains project-safe until that button is used
- accepted imports preserve the reviewed structure, organization, orientation, scale or units, and placement decisions
- single-object and multi-object reviewed imports both land through honest accepted ownership paths
- the phase still stops short of broader cleanup, regression hardening, or generalized asset-management work

#### Implemented Result

- the import dialog now shows an explicit `Add To Project` action beside `Cancel`, keeps that action disabled when nothing is staged, and no longer describes acceptance as a later phase
- the staged import controller now routes acceptance through one store-owned `commitStagedImportDraft()` seam and only closes the draft after a successful commit
- the staged import store now commits reviewed single-object files as accepted imported references, commits reviewed multi-object files as truthful per-part imported-reference children under authored components, and preserves the reviewed preview Browser organization by creating authored assemblies and components from the staged preview graph
- accepted imports now store the reviewed `Z Up` / `Y Up` / `X Up` and scale or units choices as import-owned transform overrides instead of leaving those settings stranded in draft-only state
- focused Browser and store proof now covers the explicit `Add To Project` click path plus single-object and multi-object accepted-result shape without widening into cleanup or generalized asset-management behavior

## [x] `Import-3` - `Phase 11 - Narrow Cleanup And Regression Pass`

### Purpose

- finish the staged-import lane with any small cleanup left behind by the phased rollout

### Goal

- leave the import window explicit, honest, and low-friction without widening the family

### Locked Direction

- keep this pass narrow
- prefer cleanup, message clarity, and regression hardening only
- do not widen into drag-and-drop, material pipelines, or generalized asset management

### Expected Implementation Shape

- tighten the staged-import proof into one coherent final regression slice
- clean up any temporary or now-redundant staged-import helper seams left behind by the phased rollout
- make the final import-window copy and disabled-state behavior read as intentional and honest

### Implementation-Prep Read

- `src/app/panels/browserTreeMenus.tsx`
  - now owns the final staged import dialog body and almost all user-facing wording for:
    - supported type copy
    - staged empty state
    - structure badges
    - placement hint copy
    - preview Browser hint copy
    - `Add To Project` and `Cancel`
  - is the strongest seam for the last copy and affordance pass because the staged-import family now reads through this one surface
- `src/app/panels/useBrowserPanelController.ts`
  - now owns the full staged import workflow:
    - dialog open
    - browse intake
    - per-file setting changes
    - preview Browser drag behavior
    - structure inspection kickoff
    - final accept and close
  - is the right seam for any narrow cleanup that removes repeated guards, dead staging glue, or awkward flow edges without changing product scope
- `src/app/store/useAppStore.ts`
  - now owns the full staged-import state machine plus the accepted commit seam through `commitStagedImportDraft()`
  - likely still contains a few phase-by-phase helper seams that can now be simplified or clarified because the full import-window contract is finally shipped
  - should only receive cleanup that reduces duplication or makes the final contract easier to trust:
    - not a redesign
    - not a new ownership model
- `src/app/panels/BrowserPanel.test.tsx`
  - now has focused staged-import proof across the visible dialog flow, but still largely as slice-by-slice tests added per phase
  - is the best home for one final end-to-end Browser regression that exercises the real staged journey in one test path instead of only phase-local proofs
- `src/app/store/useAppStore.test.ts`
  - now has direct store proof for accepted single-object and truthful multi-object commit behavior
  - is the right seam for any additional final store-level regression that proves the accepted contract stays deterministic after cleanup
- `src/app/theme/surfaces/browser.css`
  - should only receive small cleanup if a last visual inconsistency or accidental phase-by-phase styling artifact is still visible

### First Pass Decisions

- keep `Phase 11` as the finish pass, not a stealth `Phase 12`
- prefer three narrow buckets only:
  - final regression hardening
  - small staged-import seam cleanup
  - honest wording and disabled-state polish
- treat feedback-shaped polish as welcome input, but do not require new user feedback before this pass can begin
- prefer removing or simplifying temporary rollout glue only when the replacement contract is already clearly present in shipped code
- keep the final copy honest about ownership:
  - staged draft before acceptance
  - project content only after acceptance
  - preview Browser is still preview organization, not a second permanent Browser tree
- if a possible cleanup would materially change the staged-import contract, defer it rather than widening this phase

### Implementation Spec

#### Exact First Code Cut

1. Audit the staged import dialog in `src/app/panels/browserTreeMenus.tsx` for final wording and affordance consistency:
   - intro copy
   - empty-state text
   - placement hint text
   - preview Browser hint text
   - `Add To Project` disabled or enabled behavior
2. Add one final Browser-facing regression in `src/app/panels/BrowserPanel.test.tsx` that walks the import flow as one coherent staged journey:
   - open dialog
   - intake files
   - review structure
   - change one or more settings
   - optionally organize preview rows
   - click `Add To Project`
   - verify the dialog closes and project mutation happens only at the end
3. Add any small store-facing regression in `src/app/store/useAppStore.test.ts` that proves the accepted staged-import contract still stays deterministic after cleanup.
4. In `src/app/panels/useBrowserPanelController.ts` and `src/app/store/useAppStore.ts`, remove or simplify any now-redundant temporary staged-import glue that became obvious only because the feature shipped phase by phase:
   - duplicated guards
   - awkward one-off helper branching
   - unnecessary naming leftovers
5. Keep all cleanup local to the staged-import family and do not widen into other Browser or reference-workspace systems unless a change is strictly required to preserve the already-shipped contract.

#### Likely Files

- `src/app/panels/browserTreeMenus.tsx`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `src/app/theme/surfaces/browser.css`

#### No-Widening Rule

- do not add new import settings, new file formats, or new import modes
- do not widen into drag-and-drop import, material handling, background jobs, or generalized asset management
- do not redesign the preview Browser or the commit path now that they are already shipped
- do not turn cleanup into unrelated Browser, viewer, or graph-output refactors just because the staged-import lane touches those seams

#### Implementation Risks

- turning the cleanup pass into an unbounded “while we are here” refactor across Browser and reference-workspace code
- rewriting honest staged-import copy into misleading wording that blurs staged draft versus accepted content
- weakening proof by deleting phase-local tests without replacing them with stronger final coverage
- changing helper shapes in `commitStagedImportDraft()` enough to destabilize the accepted import contract during a pass that is supposed to be low risk

#### Checklist

- [x] add one final coherent Browser regression for the staged-import journey
- [x] add any missing focused store regression needed after the final cleanup
- [x] tighten final import-window wording so staged versus accepted ownership stays honest
- [x] clean up any now-redundant temporary staged-import helper glue without changing the shipped contract
- [x] keep the pass narrow and avoid scope growth beyond cleanup and regression hardening

#### Verification Shape

Minimum verification for this phase should cover:

- the full staged-import journey still works as one coherent flow from `Import Files...` through `Add To Project`
- project content still remains untouched until explicit acceptance
- accepted single-object and truthful multi-object results still preserve the reviewed settings and organization
- the final import-window copy still reads honestly and clearly after cleanup
- no cleanup change regresses the shipped staged-import contract

#### Done Shape

`Phase 11` is done when:

- the staged-import family has one final end-to-end regression slice plus any missing focused store proof
- the remaining phase-by-phase rollout glue is trimmed or clarified where it improves trust without changing behavior
- the import window wording and disabled states feel intentional, honest, and low-friction
- the lane ends cleanly without widening into a new family of import features

#### Implemented Result

- the Browser test suite now includes one coherent staged-import regression that walks the real `Import Files...` journey from empty draft through Browser intake, honest structure review, staged setting changes, and final `Add To Project` acceptance
- the store test suite now proves `commitStagedImportDraft()` returns `null` and leaves the staged draft intact when acceptance is attempted with no staged files, matching the final disabled-state contract in the dialog
- the import dialog copy and final `Add To Project` affordances now read more intentionally, including clearer staged-versus-accepted ownership text, a more explicit preview Browser hint, and disabled button titles that explain why acceptance is unavailable
- the staged-import controller now resolves draft file records through one shared helper instead of repeating the same staged-file lookup guards across multiple per-file setting handlers
- the cleanup pass stayed narrow and did not widen into new import settings, drag-and-drop intake, material handling, or generalized asset-management work

## [x] `Import-3` - `Phase 12 - Post-Accept Imported Reference Load Failure Research And Fix`

### Purpose

- research and fix imported-reference load failures that appear only after accepted staged imports enter real project content

### Goal

- keep accepted staged imports loadable after `Add To Project`, with honest Browser error feedback when a true asset failure still remains

### Locked Direction

- keep this phase narrow around the newly discovered post-accept load failure
- prefer root-cause research, asset-lifetime repair, and honest recovery messaging only
- do not reopen the broader staged-import feature family unless the fix strictly requires it

### Expected Implementation Shape

- reproduce the red-bar post-accept `.glb` failure from the live staged-import path
- trace accepted imported-reference asset ownership from staged file intake through final draft teardown
- fix the committed asset lifetime so accepted references do not lose their loadable source when the import draft closes
- preserve or improve the Browser error state so real load failures still expose useful retry information

### Read-Only Findings

- the Browser red fill is the imported-reference `error` state, not a loading or warning state
- `commitStagedImportDraft()` currently stores each staged file `objectUrl` directly as the committed imported-reference `assetPath`
- `handleCommitStagedImportDraft()` then closes the staged draft immediately after a successful commit
- `closeStagedImportDraft()` currently revokes every staged file `objectUrl`
- the viewer later tries to load the accepted imported reference from that same `assetPath`, so the accepted row can fail only because the staged draft cleanup revoked the live blob URL
- imported references already appear to own their `assetPath` lifecycle after acceptance because removing an imported reference revokes that asset path only when no other imported reference still shares it
- the most likely narrow fix is therefore accepted imported-reference asset ownership transfer, not a Browser row-state cosmetic change

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - currently owns both the staged draft object URLs and the final accepted imported-reference records
  - is the strongest seam for checking whether accepted references are still pointing at staged draft blob URLs when the draft is closed
  - the read-only pass already found the likely bug path here:
    - `commitStagedImportDraft()` writes `options.file.objectUrl` into committed `assetPath`
    - `closeStagedImportDraft()` later revokes that same staged `objectUrl`
  - likely owns the actual fix if the committed import needs durable asset ownership separate from the staged draft
- `src/app/components/ViewerHost.tsx`
  - owns the runtime imported-reference load transition into `loading`, `loaded`, and `error`
  - is the right seam for confirming exactly when the accepted row flips red and what error message is captured
  - should stay mostly intact unless the fix needs a tighter runtime assertion or clearer error recovery behavior
- `src/viewer/referenceAssetLoader.ts`
  - owns the direct `.glb` / `.obj` / `.stl` / `.step` asset load path
  - should be used to confirm whether the failure is a revoked blob URL, a real parser failure, or another runtime issue
- `src/app/panels/selectBrowserTreeRows.ts`
  - maps imported-reference runtime state into the Browser row state bar
  - is the seam to keep the red error state honest if more explicit recovery or message surfacing is needed
- `src/app/panels/browserContextMenu.ts`
  - already exposes `Retry` for imported rows in error
  - is the likely seam if the fix should make recovery messaging more discoverable without redesigning the Browser
- `src/app/panels/BrowserPanel.test.tsx`
  - should receive the Browser-facing regression that proves accepted staged imports do not flip straight into red because of draft teardown
- `src/app/components/ViewerHost.test.tsx`
  - may be the best place for runtime proof if the failure needs direct viewer-load verification after acceptance
- `src/app/store/useAppStore.test.ts`
  - may need store-level proof if the fix changes blob URL ownership, draft teardown rules, or imported-reference asset persistence

### First Pass Decisions

- start from the observed red-bar `.glb` regression after `Add To Project`
- treat the revoked-blob lifetime path as the leading implementation target because the read-only pass already traced it end to end
- prefer a fix that cleanly separates accepted imported-reference asset ownership from staged-draft cleanup
- keep true runtime load failures visible as errors after the fix; the goal is to remove false failures, not hide real ones
- if the Browser currently stores the error message but does not surface enough of it to help recovery, improve that narrowly rather than redesigning row UI
- avoid widening into import caching, file persistence systems, or generalized asset-library work
- prefer changing ownership at commit time or narrowing staged cleanup revocation rules over adding viewer-only special cases for staged imports

### Implementation Spec

#### Exact First Code Cut

1. Add one focused regression that proves a staged `.glb` accepted through `Add To Project` keeps a loadable committed asset path after the draft closes.
2. In `src/app/store/useAppStore.ts`, separate staged-draft blob ownership from accepted imported-reference blob ownership:
   - either transfer the blob URL into accepted ownership so staged cleanup no longer revokes it
   - or narrow staged cleanup so it revokes only URLs still owned exclusively by abandoned staged files
3. Keep imported-reference removal cleanup aligned with the existing `shouldRevokeImportedReferenceAssetPath(...)` owner model so accepted imports still release blob URLs when the final imported owner is removed.
4. Add targeted proof covering:
   - accepted staged `.glb` imports remain loadable after the import dialog closes
   - real loader failures still land in the Browser `error` state with retryable recovery
5. If needed, tighten the Browser-side error affordance just enough that a user can understand the failure and retry intentionally, but do not treat that as the primary fix.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/referenceAssetLoader.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/browserContextMenu.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.test.ts`

#### No-Widening Rule

- do not reopen staged import UX design, new settings, or broader import-window organization work
- do not widen into persistent asset catalogs, disk-copy pipelines, or generalized file-management systems
- do not hide real imported-reference load failures just to keep the row from turning red
- do not turn this bug lane into a generic viewer-loader refactor unless the fix truly requires a shared helper cleanup

#### Implementation Risks

- fixing the symptom in Browser row state while leaving accepted imported references still backed by revoked staged blob URLs
- changing staged draft teardown in a way that leaks temporary object URLs after cancel or true removal
- masking real `.glb` parse failures by treating every post-accept error as a staged-import lifetime bug
- widening the fix into a larger asset-persistence design without first proving the narrow bug
- duplicating blob-ownership cleanup logic instead of reusing or extending the already-shipped imported-reference revoke contract

#### Checklist

- [x] reproduce the red-bar post-accept imported-reference failure with focused proof
- [x] confirm whether accepted imported references still point at staged draft blob URLs after commit
- [x] fix accepted asset lifetime so draft teardown does not break committed imports
- [x] preserve honest Browser error and retry behavior for real load failures
- [x] keep the pass narrow and avoid reopening the broader staged-import family

#### Verification Shape

Minimum verification for this phase should cover:

- a staged `.glb` import accepted through `Add To Project` no longer turns red just because the draft closed
- accepted imported references still load after the staged import dialog is dismissed
- true imported-reference loader failures still surface as Browser `error` state with retryable recovery
- the fix does not regress cancel or close cleanup for genuinely abandoned staged files
- accepted imported-reference removal still revokes blob URLs only when the final imported owner is gone

#### Done Shape

`Phase 12` is done when:

- the root cause of the post-accept imported-reference load failure is proven and fixed
- accepted staged imports keep a valid load source after draft teardown
- Browser error state remains honest and useful for true failures
- the staged-import family stays otherwise unchanged outside the narrow bug lane
- the final fix reads as an ownership correction, not a viewer workaround

#### Implemented Result

- the staged-import ownership fix now keeps committed imported-reference blob URLs alive when the import draft closes by skipping staged URL revocation for any staged asset path already owned by an accepted imported reference
- accepted imported references still release their blob URL through the existing imported-reference removal contract, so cleanup now happens at the real imported owner boundary instead of the earlier staged draft boundary
- focused store proof now covers both sides of the asset-lifetime contract:
  - accepted staged `.glb` imports keep their blob URL after commit and draft close
  - abandoned staged files still revoke their blob URL when the draft closes without acceptance
- the fix stayed inside the staged-import asset-ownership seam and did not widen into viewer-specific workarounds, import UX redesign, or broader asset-management changes

### Verification

Minimum proof for `Import-3`:

1. the Browser `+` then `Import Reference` flow exposes the new `Import Files...` staged entry and opens a floating import window before project content changes
2. the import window shows supported file types and the `Browser` intake row can stage `.step`, `.stl`, `.obj`, and `.glb` files into a visible staged file list
3. the import window shows the best honest structure read available, including multiple objects, hierarchy, parts, and meaningful labels when they exist
4. structured files can choose between `1 Object` and `Multiple Objects In 1 Component` only when that split is honestly supported
5. the preview Browser can organize staged import rows into components or sub-assemblies before commit
6. up-axis, scale or units alignment, and `New Assembly` placement all become explicit accepted import settings
7. project content changes only after the user clicks `Add to Project`, and the accepted result preserves the reviewed organization and placement
8. accepted staged imported references remain loadable after the import draft closes, and only true loader failures show the red Browser error state

### Exit Criteria

`Import-3` is ready to implement when:
- the staged import draft is clearly separated from accepted project content
- the `Import Files...` menu entry, supported types, Browser intake row, staged file list, structure review, import mode choice, preview Browser organization, up-axis, scale or units, and `New Assembly` choice are all part of one coherent staged import-window contract
- preview Browser organization is part of that same staged contract
- `Add to Project` is the one explicit commit point
- split import reuses truthful part provenance instead of inventing a parallel ownership model
- accepted imported references remain backed by valid asset ownership after staged draft teardown

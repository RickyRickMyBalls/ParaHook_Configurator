# `Import-5` - `STEP Import Metadata, Units, And Loader Fidelity`

## Doc Header

### Doc History
10. 2026-04-16: Renamed this `Import-5` planning doc from the older `...FidelityOLD.md` filename to the clean canonical path already used across the import-family docs so the new master import vision and family index can point at one consistent live STEP-fidelity record
9. 2026-04-16: Added a concrete staged STEP row mock spec to `Import-5`, turning the planned `.step` importer UX into one explicit row-level flow with the `Mesh / B-Rep` toggle, reviewed quality and units controls, explicit `Load` action, and `Add To Project` reuse direction
8. 2026-04-16: Filled in `Import-5 Phase 0.3 - STEP Performance, Memory, And Failure-Surface Research` with measured `ADV3.step` timing and memory findings, confirmed the duplicate staged-versus-final heavy-load cost, and locked the first practical fix direction around explicit staged load, truthful in-dialog progress, reuse, and later worker isolation
7. 2026-04-16: Added explicit staged-import `Load` planning to `Import-5`, so large `.step` files can move toward a user-triggered heavy-load step with in-dialog progress and later `Add To Project` reuse instead of auto-starting the heaviest parse work immediately on stage
6. 2026-04-16: Tightened the early `Import-5` representation-honesty direction so the staged importer now aims for one visible left-right `Mesh / B-Rep` toggle with `Mesh` active today and `B-Rep` present but disabled until later phases instead of relying on copy alone to explain the current mesh-only STEP path
5. 2026-04-16: Replaced the flat `Import-5` wishlist list with a proper `## Wishlist Organization` section, matching the newer import-planning style by parking each STEP fidelity ask under the exact research or implementation phase that should own it first
4. 2026-04-16: Reworked the `Import-5` ladder into a more explicit wishlist-driven plan by adding staged mesh-representation honesty, user-facing tessellation controls, and large-file performance or memory guardrails as their own later homes instead of burying those asks inside generic STEP loader wiring
3. 2026-04-16: Added `Import-5 Phase 0.2 - App B-Rep Display And Viewer Capability Research`, capturing the current mesh-first viewport contract, the repo's existing OpenCascade-backed authoritative geometry seams, and the concrete requirements needed to move ParaHook toward proper B-rep-derived viewport presentation instead of labeling mesh preview as true B-rep display
2. 2026-04-16: Added `Import-5 Phase 0.1 - Current STEP Import Path And Finished-State Research`, capturing the live browser-side STEP staging and load path, the current `ADV3.step` crash-shaped risk read, and the distinction between shipped baseline STEP support and the still-unfinished hardening work
1. 2026-04-16: Created this standalone future phase doc for `Import-5`, giving `.step` imports one explicit later home for stronger staged STEP metadata, units honesty, loader-parameter wiring, and preview-to-commit fidelity instead of leaving those format-specific gaps scattered across generic import notes

### Purpose

This doc defines the later import-family phase focused on `.step` imports.

Use it to answer:
- how `.step` imports should get stronger format-specific truth inside the shipped staged import flow
- which existing STEP seams should own units assumptions, loader configuration, and structure truth
- how far ParaHook should push `occt-import-js` configuration without turning import into a full CAD-healing project
- how this `.step` lane should be broken into smaller implementation cuts
- what should stay out of scope while hardening `.step` import fidelity

### Why This Phase Exists

The import family now has:
- one shipped `.obj` batch lane
- one still-open compatibility parity follow-on for the older direct import rows
- one shipped staged import-window lane
- one next mainline staged-session feedback lane

That means the generic import surface is no longer the biggest `.step` problem.

The current code-backed read is:
- `src/viewer/stepReferenceLoader.ts`
  - already owns real browser-side `.step` parsing through `occt-import-js`
  - already converts the OCCT import result into a Three object tree ParaHook can stage and render
  - still calls `ReadStepFile(fileBuffer, null)` with no dedicated `.step` parameter contract
- `src/viewer/referenceStructureInspection.ts`
  - already gives staged import one honest structure-summary seam
  - still only sees the built object tree, not a richer STEP-specific metadata contract
- `src/viewer/referencePartDescriptors.ts`
  - already filters generic fallback names like `STEP Node` and `STEP Mesh N`
  - still relies on mesh or parent names that were already flattened into the generic object tree
- `src/app/store/useAppStore.ts`
  - already owns staged import settings and the accepted transform override
  - still resolves `Scale / Units` through one generic scalar table instead of a `.step`-specific staged truth model
- `src/app/panels/browserTreeMenus.tsx`
  - already exposes staged structure, import mode, up-axis, and scale or units controls
  - still presents `.step` through the same generic copy and control language used for every other supported type

So the later `.step` gap is not "add another import button."

The later `.step` gap is:
- stronger staged truth around STEP-specific units assumptions
- a cleaner contract for `.step` loader options and preview parity
- better STEP structure labeling and defaults when the source file really contains meaningful assembly or part structure

This should stay a later lane after `Import-4`.

Reason:
- `Import-4` still owns the next mainline staged-session honesty gap
- `.step` fidelity work should land on top of a stable session-result contract instead of expanding a dialog that still closes too eagerly on mixed outcomes

## Doc Body

## [ ] `Import-5` - `STEP Import Metadata, Units, And Loader Fidelity`

### Summary

#### Purpose:
- harden `.step` imports inside the shipped staged import flow so STEP-specific units, structure, and loader behavior read as explicit import truth instead of generic post-import guesswork

#### Target result:
- staged `.step` files can carry a dedicated STEP-specific metadata contract without widening every other import type
- the staged dialog can expose one visible `Mesh / B-Rep` representation toggle where `Mesh` is active today and `B-Rep` is present but unavailable until later phases land
- the staged dialog can explicitly tell the user that ParaHook currently converts imported `.step` geometry into meshes for display and import, while later proper B-rep import remains future work
- the staged dialog can offer a simple preview-quality or tessellation control so users can trade import speed against mesh fidelity on large STEP files
- the staged dialog can expose one explicit `Load` action for large `.step` files so the user chooses when the heavy parse starts
- the heavy STEP progress cue can live inside the staged importer itself instead of only after the file becomes project content
- the staged dialog can explain whether a `.step` units choice is detected, assumed, or manually chosen instead of presenting every option as equally native truth
- the staged `.step` preview and the accepted `.step` result use the same loader settings and units assumptions
- `Add To Project` can reuse an already loaded staged STEP result when that heavy work has already completed successfully
- large `.step` files can use more explicit guardrails instead of silently doing the heaviest possible browser-side parse twice
- meaningful STEP structure can produce better labels and smarter import-mode defaults without inventing hierarchy that the source file does not really expose
- non-STEP imports can stay on their current generic staged path

#### Scope statement:
- `Import-5` means `.step`-specific import fidelity inside the shipped `Import Files...` flow
- `Import-5` does not mean new import surfaces, new file formats, `.step` export, CAD healing, or a generalized material pipeline

### Staged STEP Row Mock Spec

The intended staged-import UX for one `.step` file is:

1. user opens `Import Files...`
2. user clicks `Browser`
3. user selects one or more local files
4. the staged importer lists all selected files
5. any `.step` row exposes the STEP-specific controls below

#### Row layout:

- file identity:
  - filename
  - file type badge such as `.STEP`
  - optional large-file warning when the file is likely to be slow or memory-heavy
- structure summary:
  - `Flat file`, `Multiple objects`, `Hierarchy`, `Parts`, or other honest structure badges
  - labels when meaningful source labels exist
- STEP representation control:
  - one visible left-right `Mesh / B-Rep` toggle
  - `Mesh` is the active side today
  - `B-Rep` is visible but disabled
  - helper copy:
    - `Imported as mesh today`
    - `B-Rep import coming in later phases`
- STEP quality control:
  - either:
    - `Fast / Balanced / Fine`
  - or:
    - one ParaSlider-style fidelity control
  - helper copy should warn that higher fidelity can be slower and more memory-heavy
- import settings:
  - `Import as`
    - `1 Object`
    - `Multiple Objects In 1 Component`
    - only show the multi-object option when the structure read honestly supports it
  - `Up Axis`
    - `Z Up`
    - `Y Up`
    - `X Up`
  - `Scale / Units`
    - current-size and explicit unit choices
    - later wording should distinguish detected versus assumed versus user-chosen STEP units
- explicit staged load control:
  - one `Load` button on the `.step` row or in its detail area
  - this button starts the heavy STEP fetch or parse only after the user reviews settings
  - the heaviest load should not auto-start just because the file was staged
- staged progress surface:
  - while loading, the row should show honest progress in the importer itself
  - use:
    - determinate progress when real measurable byte progress exists
    - milestone progress for real phases such as `Fetching STEP`, `Parsing STEP`, and `Building mesh preview` when exact parse percentage is unavailable
  - do not invent a smooth fake percentage through the heavy parse
- loaded state:
  - the row shows that the `.step` is loaded and ready
  - helper copy can confirm that `Add To Project` will reuse the loaded result when possible

#### Dialog-level expectation:

- non-STEP files still use the normal staged-import flow without unnecessary STEP-specific UI
- `.step` rows get the richer controls because they are the files most likely to need representation honesty, fidelity tradeoffs, and explicit heavy-load timing
- `Add To Project` should feel like final acceptance of already reviewed settings, not the first moment the user discovers that the app must now do all of the heavy lifting

### Current State

Today `.step` already has real support:
- ParaHook can import `.step` through the staged dialog
- the viewer can parse `.step` files through `occt-import-js`
- staged structure inspection can already show hierarchy, multiple objects, parts, and meaningful labels when the built object tree exposes them

But `.step` still behaves like the thinnest special case:
- STEP loader options are not yet part of an explicit staged contract
- staged `Scale / Units` still uses one generic scalar table shared with all file types
- the dialog does not yet distinguish detected STEP truth from user assumption
- structure defaults for `.step` are still limited by what the generic object-tree summary can infer after loading

### Locked Direction

- keep `Import Files...` as the mainline surface for `.step` improvements
- keep the first `.step` pass inside the staged reviewed flow instead of widening the older direct `Import .step` compatibility row first
- prefer real STEP seams the repo already has:
  - `occt-import-js` loader params
  - STEP object-tree structure
  - staged store-owned reviewed settings
- if the current loader cannot truly detect some STEP metadata, represent that honestly as a user choice or assumption instead of pretending it was read from the file
- make staged preview and accepted import result consume the same `.step` import truth
- keep `1 Object` as the compatibility fallback even if later STEP defaults become smarter
- keep Browser row progress, staged-session recovery, and partial-failure messaging owned by their existing or earlier lanes

### Non-Goals

`Import-5` should not expand into:
- arbitrary new file-format support
- `.step` export work
- B-rep editing or CAD healing workflows
- material editing or surface styling for STEP meshes
- generalized background job or progress infrastructure
- replacing the staged dialog with a dedicated STEP-specific window

## Wishlist Organization

### Wishlist Header
Use the `Import-5` phases to organize wishlist items like this:

- put each wishlist item under the one phase that should own it first
- leave achieved wishlist items in place and change them from `[ ]` to `[x]`
- if a wish grows beyond one phase, keep the first owned entry where it belongs and add the wider follow-on to the later phase instead of moving history around

### `Import-5 Phase 0.1`
- [x] `0. Current Browser-Side STEP Import Path Is Mapped`
- [x] `1. Shipped STEP Baseline Support Is Distinguished From Unfinished Hardening`
- [x] `2. ADV3.step Is Recorded As A Real Large-File Stress Case`
#### implementation target:
  - lock the current STEP import path and the unfinished-hardening read before later implementation guesses wrong about the current owner or risk

### `Import-5 Phase 0.2`
- [x] `3. The App Explicitly Admits It Does Not Yet Render Direct Viewport B-Rep`
- [x] `4. previewBrep Is Explained As An Authoritative Mesh-Presentation State Rather Than True Direct B-Rep Display`
- [x] `5. The Repo's Existing OpenCascade-Backed Authoritative Direction Is Documented`
- [x] `6. Proper B-Rep-Derived Viewport Presentation Requirements Are Listed`
#### implementation target:
  - document the current app-side geometry truth so later STEP UX does not imply that today's mesh display is already true B-rep import

### `Import-5 Phase 0.3`
- [ ] `7. Real STEP Parse Time Is Measured`
- [ ] `8. Real STEP Memory Pressure Is Measured`
- [ ] `9. Duplicate Heavy Work Between Staged Inspection And Final Load Is Confirmed`
- [ ] `10. The First Performance Fix Direction Is Chosen Honestly`
#### implementation target:
  - capture the measured performance or memory failure shape before later UX and loader passes try to fix the wrong bottleneck

### `Import-5 Phase 1`
- [ ] `11. Staged Import Shows A Left-Right Mesh / B-Rep Toggle`
- [ ] `12. Mesh Is The Active Side Today`
- [ ] `13. B-Rep Is Visible But Disabled Until Later Phases`
- [ ] `14. The Toggle Explains That Proper B-Rep Import Is Future Work`
- [ ] `15. STEP-Specific Staged Metadata Has One Explicit Owner`
- [ ] `16. Representation Truth, Units Context, And Future Quality Selection Can Live In One STEP-Only Contract`
#### implementation target:
  - add the first STEP-only staged metadata and representation control so the importer can speak honestly about today's mesh-based result while still making the future `B-Rep` direction visible

### `Import-5 Phase 2`
- [ ] `17. STEP Preview Quality Presets Exist`
- [ ] `18. A Simple Fast Balanced Fine Choice Exists Or One Equivalent ParaSlider-Style Fidelity Control Exists`
- [ ] `19. Tessellation Controls Only Use Real Loader Knobs`
- [ ] `20. Higher Fidelity Is Explained As Slower And More Memory-Heavy`
- [ ] `21. Reviewed Tessellation Settings Stay Consistent Between Staged Preview And Accepted Load`
#### implementation target:
  - expose one honest staged speed-versus-fidelity control for STEP tessellation without pretending the control changes the import into true direct B-rep display

### `Import-5 Phase 3`
- [ ] `22. STEP Units Copy Distinguishes Detected, Assumed, And User-Chosen Truth`
- [ ] `23. Accepted Transform Uses Reviewed STEP Units Truth`
- [ ] `24. Units Correction Does Not Hide As A Viewer-Only Fix`
#### implementation target:
  - make STEP units behavior read honestly in the staged dialog and in the accepted import result

### `Import-5 Phase 4`
- [ ] `25. Large STEP Imports Warn Honestly When They May Be Slow Or Memory-Heavy`
- [ ] `26. Large STEP Files Use An Explicit Load Button In The Staged Importer Instead Of Always Starting Heavy Parse Immediately`
- [ ] `27. The Staged Importer Shows Honest STEP Load Progress Inside The Dialog`
- [ ] `28. Add To Project Reuses A Previously Loaded STEP Result When Available`
- [ ] `29. Progress Stays Truthful: Determinate When Real Byte Progress Exists, Milestone-Based During Heavy Parse Until Real Determinate Parse Progress Lands`
- [ ] `30. Cheap Structure Summary Is Preferred Over Full Heavy Parse When Possible`
- [ ] `31. One Disposable Heavy STEP Worker Path Is Preferred If Worker Isolation Lands`
- [ ] `32. Large-File Guardrails Improve UX Without Pretending Full B-Rep Import Already Ships`
#### implementation target:
  - harden the large-file STEP path around explicit load, in-dialog progress, parse reuse, and later worker handoff without reopening generic Browser job infrastructure

### `Import-5 Phase 5`
- [ ] `33. Meaningful STEP Labels Are Preserved`
- [ ] `34. Smarter STEP Import-Mode Defaults Appear Only When The Source Structure Honestly Supports Them`
- [ ] `35. Browser Defaults Do Not Invent Assembly Fidelity The Loader Did Not Really Expose`
#### implementation target:
  - improve STEP structure labels and default choices only after the heavier truth, fidelity, and large-file passes are explicit

### `Import-5 Phase 6`
- [ ] `36. Focused Regression Coverage Exists For The Full STEP Staged-Import Story`
- [ ] `37. Narrow Cleanup Removes Temporary STEP-Specific Glue`
- [ ] `38. Final STEP Messaging Stays Honest About Mesh Import, Quality Choice, Staged Load Progress, And Remaining B-Rep Limits`
#### implementation target:
  - finish the STEP lane with small cleanup and regression proof without widening into another generic import redesign

### Internal Phase Ladder

The cleanest `.step` ladder is:

1. `Import-5 Phase 0.1 - Current STEP Import Path And Finished-State Research`
2. `Import-5 Phase 0.2 - App B-Rep Display And Viewer Capability Research`
3. `Import-5 Phase 0.3 - STEP Performance, Memory, And Failure-Surface Research`
4. `Import-5 Phase 1 - STEP Representation Honesty And Staged Metadata Contract`
5. `Import-5 Phase 2 - STEP Preview Quality Presets And Tessellation Controls`
6. `Import-5 Phase 3 - STEP Units Copy And Accepted Transform Truth`
7. `Import-5 Phase 4 - STEP Explicit Load, Staged Progress, Large-File Guardrails, Parse Reuse, And Worker Handoff`
8. `Import-5 Phase 5 - STEP Structure Labels And Import-Mode Defaults`
9. `Import-5 Phase 6 - Narrow Cleanup And Regression Pass`

Reason:
- the first research cut should lock how `.step` import really behaves today before implementation assumes the wrong owner or failure point
- the second research cut should answer whether ParaHook is actually showing B-rep geometry or only mesh preview, because that changes what STEP hardening can honestly promise
- the third research cut should lock the measured performance or memory failure shape before the later UX and implementation passes try to solve the wrong bottleneck
- the staged contract should exist before the dialog tries to explain richer STEP truth
- representation honesty should land before fidelity controls so the user understands that the current result is still mesh-based
- preview-quality controls should exist before the explicit-load and large-file pass tries to choose or remember reviewed loader settings
- units wording and accepted-transform rules should become honest before the larger large-file hardening pass widens ownership
- large-file guardrails and parse reuse should happen before smarter STEP defaults try to depend on the final import path
- label and default polish should stay downstream from the explicit STEP contract instead of hiding it

## [x] `Import-5` - `Phase 0.1 - Current STEP Import Path And Finished-State Research`

### Purpose

- document how `.step` import actually works right now before later research or implementation guesses wrong about where the app is crashing

### Goal

- lock one concrete read of the live STEP import path, what the repo already shipped, what remains unfinished, and why a large `.step` can still take down the web app during staging

### Research Inputs

- local file under review:
  - `3d models/ADV3.step`
  - current size: `55,896,327` bytes
- current live STEP loader path:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/viewer/referenceStructureInspection.ts`
  - `src/viewer/referenceAssetLoader.ts`
  - `src/viewer/stepReferenceLoader.ts`
  - `src/app/components/ViewerHost.tsx`
- shipped/history docs checked:
  - `docs/CHANGELOG.md`
  - `docs/Phase-Plans/Tasks/Old/02.4B - VR - Expanded Reference File Support.md`
  - `docs/Phase-Plans/Tasks/Old/02.4C - VR - User Reference Import From Disk.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Future/Browser_Phase Browser-12.1 - Real STEP Import Row Progress.md`

### Confirmed Current Path

- staging a file in `Import Files...` already triggers structure inspection before `Add To Project`
- `useBrowserPanelController.ts` starts inspection for each staged file whose state is still `idle`
- that inspection calls `inspectImportedReferenceFileStructure(...)`
- `inspectImportedReferenceFileStructure(...)` loads the real asset object through the shared reference asset loader rather than using a lightweight metadata-only path
- `.step` files therefore already hit the real STEP loader during staging
- the live STEP loader:
  - fetches the whole file
  - creates a full `Uint8Array` from the full response body
  - calls `occtImportModule.ReadStepFile(fileBuffer, null)`
  - builds a full Three object tree from the OCCT result
- after staged inspection, the temporary object is disposed
- after the user later commits the import, the viewer still loads the accepted reference again through the same general reference-loading path

### Confirmed Current Constraints

- STEP parsing is still browser-side through `occt-import-js`
- the current STEP loader call still passes `null` params instead of a reviewed STEP import contract
- there is still no real per-file loader progress seam for this path
- there is still no explicit size guard, memory guard, or staged STEP-specific fallback path
- staged STEP structure inspection is not metadata-only; it pays the real load cost to derive the summary

### `ADV3.step` Read

- `ADV3.step` is large enough to be a serious stress case for the current browser-side STEP path
- the file header shows:
  - `ST-DEVELOPER v20.1`
  - `Autodesk Translation Framework v14.24.0.0`
  - schema `AUTOMOTIVE_DESIGN`
- the file text also includes a millimeter length-unit declaration:
  - `SI_UNIT(.MILLI.,.METRE.)`
- the current staged import flow does not surface detected STEP units explicitly as a distinct STEP-specific truth model

### Most Likely Crash-Shaped Risk

- a large `.step` can hurt the app during staging, not only after final acceptance
- the strongest current reason is that staging already performs a real browser-side STEP parse and temporary object build
- the current code path likely pays the heavy STEP cost twice for one staged file:
  - once during staged structure inspection
  - once again during accepted viewer load after commit
- because the current loader has no real progress seam, the Browser cannot show truthful intermediate state while that heavy parse is happening
- because the current loader is browser-side and not worker-isolated here, a large parse can still freeze or crash the web app even though baseline STEP support exists

### Shipped Vs Unfinished

What is shipped:
- baseline browser-side `.step` support exists
- user import from disk exists for `.step`, `.stl`, `.obj`, and `.glb`
- the staged `Import Files...` flow exists and can stage `.step`
- failed reference rows can remain retryable instead of silently disappearing

What is not finished:
- large-file hardening for `.step`
- truthful per-file STEP load progress
- a dedicated STEP metadata contract
- detected-versus-assumed units honesty in the staged dialog
- loader-parameter wiring for reviewed STEP import behavior
- reuse of staged STEP parse results so staging and final load do not duplicate work

### Decision Read

- the repo did finish the first real STEP-import baseline
- the repo did not finish STEP-import hardening
- `Import-5` remains the correct family home for stronger `.step` import fidelity
- a crash-focused research subphase is warranted before implementation widens the loader or staged contract

### Exit Result

`Phase 0.1` is done when:

- the live STEP import path is mapped from staged intake through viewer load
- the repo history clearly distinguishes shipped STEP baseline support from still-open hardening gaps
- `ADV3.step` is recorded as a real large-file stress case for the current browser-side path
- the next research handoff is clear:
  - document the app-side B-rep display truth in `Phase 0.2`
  - then document the measured STEP performance, memory, and crash-shaped failure surface in `Phase 0.3`

## [x] `Import-5` - `Phase 0.2 - App B-Rep Display And Viewer Capability Research`

### Purpose

- document what ParaHook actually renders today, whether the app already shows true B-rep geometry, and what must change if `.step` import is expected to display proper B-rep-derived geometry instead of only tessellated mesh output

### Goal

- separate three different truths that are easy to blur together:
  - worker-side authoritative geometry truth
  - retained B-rep-capable backend ownership
  - viewport-visible render output
- lock one honest read of what the repo already has, what Three can and cannot do by itself, and what concrete requirements would be needed for proper B-rep-derived viewport presentation

### Research Inputs

- app or viewer render seams checked:
  - `src/viewer/Viewer.ts`
  - `src/viewer/artifactMeshGeometry.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - `src/shared/buildTypes.ts`
  - `src/shared/geometryResult.ts`
- authoritative backend seams checked:
  - `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - `src/worker/authoritative/ocSketchWire.ts`
  - `src/worker/authoritativeGeometryStore.ts`
  - `src/worker/oc/ocInit.ts`
  - `src/worker/oc/opencascadeBrowser.ts`
- STEP loader seams checked:
  - `src/viewer/stepReferenceLoader.ts`
- package and vision reads checked:
  - `package.json`
  - `docs/Vision.md`

### Confirmed Current App Geometry Path

- the current viewer-facing render contract is still mesh-first
- `ArtifactMesh` is only:
  - `vertices`
  - `indices`
- `ViewerRenderablePart` still wraps `PartArtifact`, and renderable mesh parts are still `kind: 'mesh'`
- the viewer bridge converts those arrays into Three `BufferGeometry`
- the current viewport path therefore renders tessellated geometry, not raw CAD topology

### Confirmed Current Authoritative Geometry Path

- the repo does already have a real OpenCascade-backed authoritative worker path
- the worker can:
  - boot `opencascade.js`
  - lower supported sketch loops into OC edges, wires, and faces
  - build supported extrusions through OC prism construction
  - retain owned backend resources behind a worker-owned `shape_set` handle
- authoritative geometry results therefore already have a retained backend identity through `authoritativeHandle`

### What `previewBrep` Means Today

- `previewBrep` is currently a viewport presentation-state name, not proof of direct B-rep rendering
- the selector still builds the visible authoritative preview from `geometryResult.meshPreview`
- that authoritative preview is then wrapped as a `kind: 'mesh'` artifact before it reaches the viewer
- so the app can honestly say:
  - this result came from the authoritative geometry lane
- but it cannot honestly say:
  - the viewport is drawing true B-rep geometry directly

### Current STEP Display Read

- the STEP import path is also mesh display today
- `occt-import-js` reads the STEP file
- ParaHook then converts that STEP import result into a Three object tree made from mesh geometry and materials
- the current STEP reference path therefore renders tessellated STEP output, not a retained B-rep scene graph inside the viewer

### Can Three.js Display Proper B-Rep Geometry?

- not by itself
- Three is a renderer for triangles, lines, points, materials, and scene objects
- Three does not natively understand CAD B-rep topology such as:
  - faces as analytic surfaces
  - loops and trims
  - topological edges
  - shells and solids as kernel-owned entities
- Three can still be the final viewport renderer
- but ParaHook needs its own adapter layer that turns backend B-rep truth into viewer-ready render data

### Do We Need To Install Something?

- not for the first real B-rep display pass
- the repo already has:
  - `opencascade.js`
  - `occt-import-js`
- the missing piece is not a basic dependency install
- the missing piece is a stronger render bridge and display contract between retained backend shape truth and the Three viewport

### Requirement Read For Proper B-Rep Geometry

If ParaHook wants proper B-rep-derived viewport presentation, it will need at least:

- one explicit authoritative render contract beyond `meshPreview`
  - today the shared geometry result still treats `meshPreview` as the renderable surface
  - a later pass needs a contract that can represent retained authoritative render input without pretending the preview mesh is the whole truth
- one authoritative viewer adapter owned at the worker or worker-to-app seam
  - this adapter should derive viewport-ready output from retained `shape_set` resources
  - the adapter can still emit triangles and lines for Three
  - but those triangles and lines should be clearly derived from authoritative B-rep truth rather than treated as ad hoc preview-only geometry
- one explicit decision about what "proper B-rep display" means in ParaHook
  - shaded tessellated faces derived from B-rep truth
  - extracted visible or all topological edges
  - both shaded faces and explicit edge overlays
  - later analytic or higher-fidelity display is optional, but the minimum honest target should be defined
- one retained lifecycle for authoritative display data
  - `shape_set` resources are already retained in the worker
  - the app will need a safe request or release path for any render data derived from those retained resources
  - display-side caching and disposal must stay aligned with handle lifetime
- one honest viewport-state contract
  - the app should distinguish:
    - draft mesh preview
    - authoritative-derived renderable result
    - accepted final retained result
  - the selector should stop implying that `previewBrep` means direct B-rep rendering when it still means mesh presentation from `meshPreview`
- one STEP-specific decision about display ownership
  - imported STEP references can stay on a mesh display path if ParaHook treats them as reference assets only
  - if ParaHook wants STEP references to behave like first-class authoritative B-rep content, they will need a retained backend representation and the same authoritative render bridge instead of the current direct mesh flattening path

### Recommended Minimum Honest Direction

- keep Three as the viewport renderer
- keep OpenCascade as the retained backend truth
- add one bridge that derives:
  - shaded face tessellation
  - optional edge or wire overlays
  - consistent IDs or structure labels where possible
- present that output explicitly as authoritative-derived display data rather than as generic `meshPreview`

This is likely enough to become honest and useful without widening into a full CAD-kernel viewer rewrite.

### Non-Goal Clarification

This phase does not require:

- direct kernel-native viewport rendering with no tessellation at all
- full CAD healing
- full exact-surface interaction tools
- replacing Three.js
- installing an entirely new geometry backend just to begin honest B-rep-derived display

### Decision Read

- ParaHook is not displaying true direct B-rep geometry in the viewport today
- ParaHook does already have a real B-rep-capable backend direction in the worker
- the current gap is the render contract and viewer bridge, not the absence of a CAD kernel dependency
- `.step` import hardening should stay honest about this: improved STEP import does not automatically mean proper B-rep display unless the authoritative render bridge work also lands

### Exit Result

`Phase 0.2` is done when:

- the repo has one explicit written answer to whether the app currently shows true B-rep geometry
- the difference between authoritative backend ownership and viewport-visible mesh rendering is documented
- the current meaning of `previewBrep` is stated honestly
- the minimum requirements for proper B-rep-derived viewport presentation are listed clearly enough to guide later implementation planning

## [x] `Import-5` - `Phase 0.3 - STEP Performance, Memory, And Failure-Surface Research`

### Purpose

- measure why large `.step` files feel slow, frozen, or crash-shaped in the live app before later implementation picks the wrong fix

### Goal

- lock one concrete read of:
  - raw STEP parse time
  - mesh-build overhead versus parser overhead
  - browser-side memory pressure
  - whether staged inspection and final accepted load duplicate the same heavy work

### Locked Direction

- use a real large-file stress case such as `3d models/ADV3.step`
- distinguish:
  - STEP parser cost
  - Three object-tree build cost
  - ParaHook-specific duplicated work
- explicitly measure or document memory pressure, not only elapsed time
- keep this phase research-only; do not widen into implementation yet

### Research Inputs

- local file under review:
  - `3d models/ADV3.step`
  - current size: `55,896,327` bytes
- live app seams checked:
  - `src/viewer/stepReferenceLoader.ts`
  - `src/viewer/referenceStructureInspection.ts`
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/components/ViewerHost.tsx`
- direct importer measurement path used:
  - local `occt-import-js` parse runs against `ADV3.step`
  - direct timing of file read, STEP parse, and Three object build
  - local process-memory snapshots before and after parse

### Measured File Shape

- `ADV3.step` is not only large on disk; it is also real B-rep geometry, not a lightweight pre-triangulated file
- quick text-level read showed:
  - `23` `PRODUCT(...)` entries
  - `23` `MANIFOLD_SOLID_BREP(...)` entries
  - `23` `CLOSED_SHELL(...)` entries
  - `14,061` `ADVANCED_FACE(...)` entries
- additional assembly references exist, but the file does not appear to be a giant deeply nested Browser hierarchy
- the heavy cost therefore looks much more like STEP parse or tessellation work than Browser-tree construction work

### Direct Importer Timing Read

- measured direct `occt-import-js` parse of `ADV3.step` completed successfully in about `43` to `45` seconds with the current default `ReadStepFile(fileBuffer, null)` path
- the imported result was not huge at the final mesh-output level:
  - `23` meshes
  - `25` nodes
  - about `209k` triangles
- building the Three mesh objects from that parse result took only about `45 ms`
- building the final root object tree from those mesh objects was effectively negligible

### Timing Read Conclusion

- the dominant cost is not:
  - Browser row derivation
  - structure label extraction
  - Three object-tree assembly
- the dominant cost is the synchronous STEP parse and tessellation call itself:
  - `occtImportModule.ReadStepFile(fileBuffer, null)`

### Memory Read

- local process RSS after reading the file was about `171 MB`
- local process RSS after the STEP parse jumped to about `1.7 GB`
- after dropping the parse result and forcing garbage collection, memory still stayed around `1.6 GB`
- that strongly suggests the heavy OCCT or WASM heap stays bloated after one large parse instead of shrinking back to a lightweight steady state

### Memory Read Conclusion

- the browser crash-shaped experience is not only about elapsed time
- large `.step` imports currently create severe memory pressure
- keeping the importer module alive after one large parse likely preserves most of that pressure for the rest of the session

### Current Loader Cost Read

- `stepReferenceLoader.ts` currently:
  - fetches the full file
  - creates a full `Uint8Array`
  - calls synchronous `ReadStepFile(...)`
  - builds a full Three object tree
- the current `occt-import-js` surface does not expose:
  - a real parse-progress callback
  - partial intermediate parse percentages
  - any yield point inside the heavy parse itself
- that means the current loader can only support:
  - truthful byte progress while fetching
  - truthful milestone progress around fetch, parse, and mesh-build phases
- it cannot yet support a truly determinate percent bar through the heavy parse itself without a wider loader or worker change

### Confirmed Duplicate Heavy Work

- staged import still auto-starts structure inspection for `.step` files as soon as they are staged
- that inspection currently calls the real reference loader instead of a cheap metadata-only summary path
- after the user later commits the staged import, the viewer still loads the accepted reference again through the normal reference-loading seam
- for a large `.step` file like `ADV3.step`, ParaHook is therefore very likely paying the heaviest parse cost twice:
  - once during staged inspection
  - once again during final accepted load

### Coarser Tessellation Read

- direct tests with real `occt-import-js` loader params showed that coarser tessellation can help, but only moderately
- measured direct parse times moved from about `44.8s` at default settings to about `35.8s` at coarser tested settings
- that is real improvement, but it does not change the deeper bottleneck shape:
  - the parse is still synchronous
  - memory pressure is still severe
  - duplicate staged-versus-final work still dominates the user experience

### Decision Read

- `Phase 0.3` confirms that the main bottleneck is the STEP parse itself, not Three object build or Browser label logic
- `Phase 0.3` confirms that current large-file pain is a combination of:
  - slow synchronous parse time
  - severe memory pressure
  - duplicated heavy work between staged inspection and final load
- `Phase 0.3` also confirms that loader params alone are not the first or best fix, even though they can help somewhat

### First Fix Recommendation

The first practical fix should be:

- stop eager heavy STEP auto-load during staging for large files
- give the user one explicit staged `Load` action after settings are reviewed
- show truthful progress inside the staged importer:
  - determinate when real byte progress exists
  - milestone-based during heavy parse until true determinate parse progress becomes possible
- reuse the loaded staged STEP result when the user later clicks `Add To Project`
- prefer worker isolation later so the UI can stay responsive and the heavy importer heap can be torn down more safely

### Exit Result

`Phase 0.3` is done when:

- one real large-file STEP case has measured parse time
- one real large-file STEP case has measured memory pressure
- the repo has one explicit written read of the parser-versus-Three cost split
- the duplicate staged-versus-final heavy-load cost is documented
- the first practical implementation direction is clear:
  - explicit staged `Load`
  - truthful in-dialog progress
  - result reuse
  - later worker isolation

## [ ] `Import-5` - `Phase 1 - STEP Representation Honesty And Staged Metadata Contract`

### Purpose

- give staged `.step` files one explicit metadata owner and one explicit user-facing representation story instead of leaving STEP-specific truth implied by generic staged settings alone

### Goal

- define a STEP-specific staged metadata shape that can carry:
  - current representation truth
  - loader assumptions
  - reviewed units context
  - future quality selections
- expose one visible left-right `Mesh / B-Rep` toggle in the staged importer
- keep `Mesh` as the active side today
- keep `B-Rep` visible but disabled so the future direction is legible without pretending it already ships
- explicitly tell the user that ParaHook currently converts imported `.step` geometry into meshes for display and import, while proper B-rep import remains a later capability

### Locked Direction

- keep the contract `.step`-only
- keep generic staged import state intact for `.stl`, `.obj`, and `.glb`
- add one staged representation control that reads like a left-right toggle:
  - `Mesh`
  - `B-Rep`
- keep the toggle slider on `Mesh` for the current shipped path
- keep the `B-Rep` side visibly disabled or locked instead of hiding it completely
- pair the toggle with short honest copy such as:
  - `Imported as mesh today`
  - `B-Rep import coming in later phases`
- do not imply that the current viewport path is direct B-rep rendering
- allow the contract to distinguish:
  - detected STEP truth when it really exists
  - assumed or user-selected truth when the loader cannot detect it yet
- keep the first control or wording pass simple and explanatory instead of turning the staged importer into a CAD glossary

### Expected Implementation Shape

- update `src/app/store/useAppStore.ts`
- likely update `src/app/panels/browserTreeMenus.tsx`
- likely widen `src/viewer/referenceStructureInspection.ts` or the surrounding staged-inspection seam so STEP-specific metadata can travel with staged inspection results where needed
- add focused store or inspection coverage for STEP-only staged metadata ownership, toggle state, and representation honesty

## [ ] `Import-5` - `Phase 2 - STEP Preview Quality Presets And Tessellation Controls`

### Purpose

- let the staged importer expose one user-facing speed-versus-fidelity control for `.step` tessellation instead of hard-coding one opaque loader behavior for every file

### Goal

- offer one simple staged quality control such as:
  - `Fast`
  - `Balanced`
  - `Fine`
  - or one ParaSlider-style fidelity control
- keep any advanced details tied to real loader options the repo already has, without inventing fake geometry promises

### Locked Direction

- default to a simple reviewed control first; any advanced STEP settings should stay behind a disclosure or later follow-on
- only use real loader knobs the repo already has today, such as:
  - `linearDeflectionType`
  - `linearDeflection`
  - `angularDeflection`
- keep the control honest:
  - lower fidelity can improve speed
  - higher fidelity can increase import time and memory use
- do not promise exact B-rep viewport display through a tessellation slider
- do not widen this phase into large-file worker isolation yet

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/store/useAppStore.ts`
- likely widen `src/viewer/stepReferenceLoader.ts`
- likely widen `src/viewer/referenceAssetLoader.ts`
- add focused proof around reviewed tessellation settings and staged control behavior

## [ ] `Import-5` - `Phase 3 - STEP Units Copy And Accepted Transform Truth`

### Purpose

- make `.step` units behavior read honestly in the staged dialog and in the accepted import result

### Goal

- stop treating `.step` units choices as generic scale chips only, and make the reviewed STEP units story explicit before commit

### Locked Direction

- keep the accepted result deterministic
- if source units are not truly detected, label the choice as assumed or manually chosen instead of as native file truth
- keep user control explicit rather than hiding a fallback conversion behind commit-time math
- let this phase consume the staged STEP contract and reviewed quality settings already established earlier without taking ownership of them

### Expected Implementation Shape

- update `src/app/panels/browserTreeMenus.tsx`
- update `src/app/store/useAppStore.ts`
- add focused Browser or store proof around truthful STEP units copy and accepted transform behavior

## [ ] `Import-5` - `Phase 4 - STEP Explicit Load, Staged Progress, Large-File Guardrails, Parse Reuse, And Worker Handoff`

### Purpose

- reduce the worst slow or crash-shaped experience for large `.step` files without pretending ParaHook already supports true direct B-rep import

### Goal

- let the user explicitly trigger the heavy STEP load from inside the staged importer after settings are reviewed
- show honest progress inside the staged importer while that heavy load is happening
- make `Add To Project` fast when the staged STEP load has already completed successfully
- stop paying the heaviest STEP cost more times than necessary
- add stronger large-file honesty and safer execution direction for slow browser-side STEP imports
- make staged preview and accepted import load follow the same reviewed STEP loader contract where possible

### Locked Direction

- prefer:
  - explicit staged `Load` over eager heavy STEP auto-load for large files
  - in-dialog progress over hidden background waiting
  - parse reuse over duplicate parse
  - cheap structure summary over full heavy load when possible
  - one disposable worker path over multiple concurrent heavy STEP workers if worker isolation lands later
- keep progress honest:
  - use determinate progress when real measurable byte progress exists
  - use real milestones such as `fetch`, `parse`, or `build mesh` when exact determinate parse progress does not yet exist
- do not invent a smooth percent through the heavy parse if the loader cannot really report one yet
- keep this phase focused on large-file STEP behavior, not all import formats
- do not widen this into generalized background-job architecture for the whole Browser
- do not promise full B-rep import just because the heavy parse path gets safer

### Expected Implementation Shape

- likely update `src/viewer/stepReferenceLoader.ts`
- likely widen `src/viewer/referenceAssetLoader.ts`
- likely widen `src/viewer/referenceStructureInspection.ts`
- likely widen staged preview or accepted import ownership in `src/app/store/useAppStore.ts`
- likely update `src/app/panels/browserTreeMenus.tsx`
- likely update `src/app/panels/useBrowserPanelController.ts`
- likely touch `src/app/components/ViewerHost.tsx` or surrounding load-call seams if parse reuse becomes real
- add focused proof for explicit staged load, in-dialog progress, large-file STEP behavior, reuse, and reviewed preview-to-commit parity

## [ ] `Import-5` - `Phase 5 - STEP Structure Labels And Import-Mode Defaults`

### Purpose

- improve how `.step` structure reads and default import choices land in the staged dialog

### Goal

- make meaningful STEP assemblies or part groupings produce better labels and smarter initial import-mode defaults without inventing Browser-only structure

### Locked Direction

- keep `1 Object` as the compatibility path
- allow smarter defaulting only when the STEP structure read honestly supports it
- keep label cleanup truthful to source names and discovered hierarchy
- do not promise assembly fidelity the current loader result cannot support

### Expected Implementation Shape

- update `src/viewer/referencePartDescriptors.ts`
- update `src/viewer/referenceStructureInspection.ts`
- likely update `src/app/store/useAppStore.ts`
- likely update `src/app/panels/browserTreeMenus.tsx`
- add focused coverage for smarter STEP labels or defaults

## [ ] `Import-5` - `Phase 6 - Narrow Cleanup And Regression Pass`

### Purpose

- finish the `.step` lane with any small cleanup left behind by the staged rollout

### Goal

- leave STEP-specific import truth narrow, readable, and well covered without reopening the rest of the import family

### Locked Direction

- keep this pass small
- prefer cleanup, wording, and regression hardening only
- do not widen into new formats or another generic import refactor

### Verification

Minimum proof for `Import-5`:

1. staged `.step` files can carry STEP-specific metadata without forcing the same contract onto `.stl`, `.obj`, and `.glb`
2. the staged dialog explicitly tells the user that the current STEP import path produces meshes today rather than direct viewport-visible B-rep geometry
3. the staged dialog can offer one honest speed-versus-fidelity control for STEP tessellation using real loader options only
4. the staged dialog can explain `.step` units truth honestly, including when a choice is assumed instead of detected
5. staged `.step` preview and accepted `.step` load use the same reviewed loader settings, or the app explains the exact exception honestly
6. large `.step` files have stronger guardrails against duplicate heavy parsing or silently opaque slow paths
7. meaningful STEP structure can improve labels or defaults without inventing hierarchy the source file does not expose
8. non-STEP imports continue to use the existing generic staged path without regression

### Exit Criteria

`Import-5` is ready to implement when:
- the lane clearly stays `.step`-specific instead of reopening generic import architecture
- the staged metadata owner is explicit before UI wording or loader wiring widens
- mesh-representation honesty, tessellation controls, large-file guardrails, units honesty, and structure-default polish each have a distinct later home
- the doc does not overpromise `.step` export, CAD healing, generalized loader settings, or already-shipped B-rep import

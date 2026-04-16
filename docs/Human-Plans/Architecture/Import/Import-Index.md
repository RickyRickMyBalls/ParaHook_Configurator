# Import Index

## Doc Header

### Doc History
4. 2026-04-16: Added the later future import lane `Import-3 - Import Window Structure Review And Add-To-Project Settings`, so the family now records the next honest post-parity import-window direction as a dedicated planning doc instead of leaving pre-add structure review, split-versus-single-object import choice, and units setup as loose future notes
3. 2026-04-15: Cleaned up the import family after `Import-1` shipped by moving the completed multi-`.obj` batch-import record into `Shipped/`, marking the umbrella `Import-1` lane complete in this index, and advancing the family recommendation to `Import-2` for batch parity across the rest of the supported import menu file types
2. 2026-04-15: Added the next future import lane `Import-2 - Batch Import Parity For Supported Reference Types`, so the family now records a later follow-on for extending batch selection beyond `.obj` to the rest of the current import menu (`.step`, `.stl`, `.glb`) instead of leaving "batch import any file" as an unstructured wishlist note
1. 2026-04-15: Created this folder-root architecture index for the new `Import` family, established `Import-1` as the first open planning lane for multi-`.obj` batch selection from the existing Browser import surface, and pointed the family at a dedicated `Future/` execution doc instead of leaving import growth scattered across ad hoc notes

### Purpose

This doc defines the umbrella architecture direction for `Import`.

This file is the umbrella index for the `Import` family.

Use it to answer:
- what `Import` should mean in ParaHook's architecture
- which existing import surfaces already exist today
- how future import work should be split into standalone planning docs
- what the next open import lane is right now
- where shipped import records should live later

### Family Structure

Use this folder like this:

- `Import-Index.md`
  - umbrella architecture direction
  - current import-family checklist
  - pointers to active future planning docs
- `Future/`
  - standalone open import planning docs
  - `Import_Phase Import-2 - Batch Import Parity For Supported Reference Types.md`
  - `Import_Phase Import-3 - Import Window Structure Review And Add-To-Project Settings.md`
- `Shipped/`
  - shipped records for completed import-family cuts
  - `Import_Phase Import-1 - Multi-OBJ Batch Import.md`

## Doc Body

### Vision

`Import` should define how user-supplied reference assets enter the workspace cleanly, honestly, and at the right scope.

The import family should stay disciplined:
- use the existing Browser `Import Reference` surface
- keep imports workspace-local
- preserve the current supported file-type rules unless a later family phase explicitly widens them
- improve the user flow without widening into a whole new asset-pipeline project

### Current State

The current user-reference import path is now split into:
- one shipped batch lane for `.obj`
- one remaining parity gap for the other supported import menu file types
- one later staging gap where imported files still go straight into the project instead of first landing in an import window for review

The current read that matters is:
- `src/app/references/importReferenceFile.ts`
  - now supports batch helper import for `.obj`
  - still keeps single-file compatibility behavior for the other supported menu file types
- `src/app/panels/useBrowserPanelController.ts`
  - now batch-inserts `.obj` selections from one menu action
  - still keeps `.step`, `.stl`, and `.glb` on the single-file path
  - still routes accepted files directly into `addImportedReference(...)` instead of staging them in a pre-add import window
- `src/app/store/useAppStore.ts`
  - already supports repeated imported-reference insertion
  - already disambiguates duplicate labels
- `src/viewer/referencePartDescriptors.ts`
  - already discovers meaningful per-mesh part labels for structured reference files once they load
  - currently exposes that part read after project insertion rather than before the import is accepted
- `src/viewer/Viewer.ts`
  - already keeps per-reference part-descriptor and exploded-provenance seams
  - still treats user-imported references as accepted project content before any import-window structure or unit decisions exist

That means the next honest blocker is no longer `.obj`.

The next honest blocker is parity:
- `.obj` can now batch import
- `.step`, `.stl`, and `.glb` still cannot

After that parity lane, the next honest blocker is staging:
- imported files still enter the project immediately
- the user still cannot review file structure before commit
- structured files still do not offer an upfront choice between one imported object versus many part-backed objects
- units still do not have an explicit import-time decision surface

### Import Family Rules

The import family should stay disciplined:

- keep import work scoped to real user-facing entry points that already exist
- prefer narrow upgrades to the existing Browser import path over speculative new surfaces
- keep file-type expansion separate from interaction-flow improvements
- keep reference-store ownership honest instead of duplicating imported-reference state
- split broader future import work into dedicated docs when one lane grows beyond a small focused change

### Non-Goals

The import family should not assume all import concerns belong in the first shipped lane or the next parity lane.

Still out of scope unless a later doc opens them explicitly:
- `.obj` `.mtl` dependency handling
- texture-bundle import workflows
- drag-and-drop import
- progress UI or cancellable import sessions
- archive/package import formats
- a new generalized asset library
- persistence/export of imported workspace references beyond today's existing model

## Phases

### [x] Import-1 - Multi-OBJ Batch Import

- allowed the existing `.obj` Browser import action to accept multiple selected `.obj` files in one picker interaction
- kept the first change grounded in the current helper and Browser controller flow
- reused the existing imported-reference insertion path instead of designing a second batch-only store path
- kept the first shipped lane tightly focused on user-facing batch convenience, not format expansion or material-pipeline work

Shipped record:
- `Shipped/Import_Phase Import-1 - Multi-OBJ Batch Import.md`

### [ ] Import-2 - Batch Import Parity For Supported Reference Types

- extend the same batch-import interaction to the rest of the currently supported import menu file types
- keep the scope honest to the menu ParaHook already exposes today: `.step`, `.stl`, `.obj`, `.glb`
- treat this as parity work after the `.obj` batch path shipped
- keep later file-type-specific parsing or asset-pipeline concerns separate from the basic batch-selection parity lane

Execution doc:
- `Future/Import_Phase Import-2 - Batch Import Parity For Supported Reference Types.md`

### [ ] Import-3 - Import Window Structure Review And Add-To-Project Settings

- route imported files into an import window first instead of committing them directly into project content
- show the selected file type plus discovered structure before the user accepts the import
- if a file has meaningful multi-part or multi-object structure, let the user choose between importing it as one object or importing all parts as objects
- let the user set the units before the import is accepted
- use an explicit `Add to Project` confirmation step so import settings become a real accepted decision instead of a hidden post-import correction

Execution doc:
- `Future/Import_Phase Import-3 - Import Window Structure Review And Add-To-Project Settings.md`

### Future Candidate Lanes

Possible later import-family follow-ons:

- `.obj` sidecar material and texture handling
- drag-and-drop reference import
- import cleanup, naming, and grouping policies for larger batches
- later import-session feedback and partial-failure reporting around the staged import flow

### Current Recommendation

The next honest import work should be `Import-2`.

After `Import-2`, the clean next follow-on should be `Import-3`.

Reason:
- the `.obj` batch path is now shipped
- the remaining user-facing inconsistency is batch parity for `.step`, `.stl`, and `.glb`
- the helper/controller pattern from `Import-1` gives the next lane a clear starting point
- once supported batch parity lands, the next honest import-family gap is a real import window where the user can review structure, choose split-versus-single-object import, set units, and then explicitly add the result to the project

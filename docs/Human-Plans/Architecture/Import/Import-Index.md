# Import Index

## Doc Header

### Doc History
18. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 7.7 - Part List And Scale Enrichment.md`, updated the family structure pointer list, and extended the `Import-4` family read so the next later staged import polish pair now has one explicit planning home for `Part list enrichment` and `Scale enrichment` without widening that new lane beyond those two wishlist items
17. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 7.6 - Preview Browser Enrichment.md`, updated the family structure pointer list, and extended the `Import-4` family read so later staged preview Browser follow-up now has one explicit planning home for row-level preview-target truth, preview-browser-to-object-preview affordances, active loaded-row clarity, and later row-identity polish
16. 2026-04-16: Extended the family index and master vision so `Generation 1` now also leaves room for a later `Import-7` `.stl` mesh-cleanup-and-import-controls lane, keeping STL-specific cleanup inside the format-specific generation without pretending it should reuse STEP tessellation language or reopen the generic staged import foundation
15. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 7.5 - Object Preview Follow-Up And Preview-Output Polish.md`, updated the family structure pointer list, and extended the `Import-4` family read so later staged object-preview polish now has one explicit planning home for zoom-to-fit, preview resize repair, up-axis preview truth, grid toggles, and later scale-fix follow-up
14. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 7.4 - Read-Only Hierarchy Tree Enrichment.md`, updated the family structure pointer list, and tightened the `Import-4` family read so the later staged hierarchy-tree truth lane now has its own explicit planning home instead of living only as a later subsection inside the broader `Phase 7` UI-polish record
13. 2026-04-16: Added `Import-6 - GLB Scene Metadata, Materials, And Content Fidelity` as a second `Generation 1` future lane, updated this index so the later format-specific import generation now reads as STEP-first through `Import-5` and then `.glb` enrichment through `Import-6`, and extended the family structure plus current recommendation so the new GLB-specific follow-on is discoverable without changing the next mainline `Import-4` priority
12. 2026-04-16: Collapsed the import-family generation read so `Import-1` through `Import-4` now all live inside one broader `Generation 0`, updated this index so the shipped direct-row baseline, reviewed staged import baseline, and active staged-session hardening read as one foundational import band, and reserved `Generation 1` for the later `.step`-first format-specific fidelity lane beginning with `Import-5`
11. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 7 - UI Cleanup And Polish.md`, updated the family structure pointer list, and extended the `Import-4` family read so later staged import visual cleanup now has its own explicit planning home after the heavier session-truth and preview lanes
10. 2026-04-16: Added `Import-Vision.md`, reframed the import family around explicit `Generation 0` through `Generation 4` reads, and updated this index so the older direct rows, the shipped staged import baseline, the active `Import-4` session-hardening lane, the later `Import-5` STEP-fidelity lane, and the companion `B-rep` direction now map to one clearer master import vision
9. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 6 - Object Preview Viewport And Resizable Three-Column Layout.md`, updated the family structure pointer list, and tightened the `Import-4` family read so the later staged object preview viewport lane now has its own explicit planning home instead of living only as one larger terminal phase inside the parent `Import-4` staged-session feedback record
8. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 0.2 - Shared Source Load And Child Derivation For Split Imports.md`, updated the family structure pointer list, and extended the `Import-4` family read so the repaired split-import path now has one explicit follow-on performance lane for `load once, derive many children` work instead of leaving that optimization as an unowned future note
7. 2026-04-16: Added the standalone future execution doc `Import_Phase Import-4 Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair.md`, updated the family structure pointer list so the new small-step `Import-4` sublane is discoverable, and kept `Import-4` itself as the main staged-session umbrella while the broken split-import mode now has its own dedicated repair record
6. 2026-04-16: Added `Import-5 - STEP Import Metadata, Units, And Loader Fidelity` as a later format-specific future lane, updated the current-state and family-structure notes so `.step` now has one explicit post-`Import-4` home for stronger staged STEP truth, and kept `Import-4` as the next mainline recommendation while `Import-2` remains the older compatibility parity follow-on
5. 2026-04-16: Closed out `Import-3` by moving the completed staged import-window lane into `Shipped/`, added `Import-4 - Staged Import Session Feedback And Partial-Failure Reporting` as the next mainline follow-on, and updated the family recommendation so the import family now hands forward from the shipped review-and-accept flow into honest staged-session feedback while keeping `Import-2` as an older compatibility parity follow-on for the direct import rows if that path is still worth widening
4. 2026-04-16: Added the later future import lane `Import-3 - Import Window Structure Review And Add-To-Project Settings`, so the family now records the next honest post-parity import-window direction as a dedicated planning doc instead of leaving pre-add structure review, split-versus-single-object import choice, and units setup as loose future notes
3. 2026-04-15: Cleaned up the import family after `Import-1` shipped by moving the completed multi-`.obj` batch-import record into `Shipped/`, marking the umbrella `Import-1` lane complete in this index, and advancing the family recommendation to `Import-2` for batch parity across the rest of the supported import menu file types
2. 2026-04-15: Added the next future import lane `Import-2 - Batch Import Parity For Supported Reference Types`, so the family now records a later follow-on for extending batch selection beyond `.obj` to the rest of the current import menu (`.step`, `.stl`, `.glb`) instead of leaving "batch import any file" as an unstructured wishlist note
1. 2026-04-15: Created this folder-root architecture index for the new `Import` family, established `Import-1` as the first open planning lane for multi-`.obj` batch selection from the existing Browser import surface, and pointed the family at a dedicated `Future/` execution doc instead of leaving import growth scattered across ad hoc notes

### Purpose

This doc defines the umbrella architecture direction for `Import`.

This file is the family index for the `Import` planning home.

Use it to answer:
- what `Import` should mean in ParaHook's architecture
- what `generation` the import family is in today
- which import surfaces already exist
- how the family should split work between the broad foundational import generation, the later format-specific fidelity generation, and the later retained imported-geometry direction
- what the next open import lane is right now
- where the active future docs and shipped records live

### Family Structure

Use this folder like this:

- `Import-Vision.md`
  - master import-family north star
  - simplified generation map for the foundational import baseline, format-specific fidelity work, and later retained imported-geometry direction
- `Import-Index.md`
  - umbrella family index
  - generation-aware lane map
  - pointers to active future planning docs
- `Import-3-Vision.md`
  - narrower staged-import-window sub-vision for the shipped reviewed-import baseline now grouped under `Generation 0`
- `B-rep/`
  - companion retained imported-geometry direction
  - `B-rep-Vision.md`
- `Future/`
  - standalone open import planning docs
  - `Import_Phase Import-2 - Batch Import Parity For Supported Reference Types.md`
  - `Import_Phase Import-4 - Staged Import Session Feedback And Partial-Failure Reporting.md`
  - `Import_Phase Import-4 Phase 0.1 - Multiple Objects In 1 Component Mode Investigation And Repair.md`
  - `Import_Phase Import-4 Phase 0.2 - Shared Source Load And Child Derivation For Split Imports.md`
  - `Import_Phase Import-4 Phase 6 - Object Preview Viewport And Resizable Three-Column Layout.md`
  - `Import_Phase Import-4 Phase 7 - UI Cleanup And Polish.md`
  - `Import_Phase Import-4 Phase 7.4 - Read-Only Hierarchy Tree Enrichment.md`
  - `Import_Phase Import-4 Phase 7.5 - Object Preview Follow-Up And Preview-Output Polish.md`
  - `Import_Phase Import-4 Phase 7.6 - Preview Browser Enrichment.md`
  - `Import_Phase Import-4 Phase 7.7 - Part List And Scale Enrichment.md`
  - `Import 5 - Phases.md`
  - `Import_Phase Import-5 - STEP Import Metadata, Units, And Loader Fidelity.md`
  - `Import_Phase Import-6 - GLB Scene Metadata, Materials, And Content Fidelity.md`
- `Shipped/`
  - shipped records for completed import-family cuts
  - `Import_Phase Import-1 - Multi-OBJ Batch Import.md`
  - `Import_Phase Import-3 - Import Window Structure Review And Add-To-Project Settings.md`

## Doc Body

### Vision

Use `Import-Vision.md` as the master north-star for this family.

Short version:
- `Import` should define how user-supplied assets enter ParaHook cleanly, honestly, and at the right scope
- the shipped staged dialog is now the mainline path, but it remains part of the same broader foundational generation as the earlier direct-row work
- the family should widen first through one broad generic import foundation, then through format-specific fidelity, then through retained imported-geometry truth
- retained imported-geometry truth should widen through the companion `B-rep` direction instead of being blurred into the earlier mesh-first import generations

### Generation Map

The family now reads most cleanly like this:

- `Generation 0`
  - broad foundational import baseline and staged-session hardening
  - `Import-1`
  - `Import-2`
  - `Import-3`
  - `Import-4`
- `Generation 1`
  - format-specific fidelity and heavy-source truth
  - `Import-5`
  - `Import-6`
  - `Import-7`
- `Generation 2`
  - later retained imported-geometry direction
  - companion `B-rep/B-rep-Vision.md`

### Current State

The current import-family read is:

- `Generation 0`
  - shipped `Import-1` already widened `.obj` batch convenience for the older direct row
  - `Import-2` remains open as compatibility parity if the older direct `.step`, `.stl`, and `.glb` rows are still worth carrying forward
  - shipped `Import-3` established `Import Files...` as the reviewed staged baseline
  - `Import-4` is the active next mainline lane because the staged dialog still needs stronger generic session truth around layout, per-file feedback, partial results, recovery, object review, and later cleanup polish
- `Generation 1`
  - `Import-5` stays queued behind that as the first later `.step`-specific fidelity lane
  - `Import-6` now gives the same generation one later `.glb` enrichment lane for scene, material, and richer content honesty after the STEP-first proving ground
  - `Import-7` can follow later in the same generation as the `.stl` mesh-cleanup-and-import-controls lane once the family wants explicit STL-specific reviewed options instead of only the current generic staged settings
- `Generation 2`
  - the later retained imported-geometry direction is real, but it should widen through the companion `B-rep` vision after the earlier generic and format-specific generations are honest enough first

The current code-backed read that matters is:
- `src/app/references/importReferenceFile.ts`
  - now supports batch helper import for `.obj`
  - still keeps the older direct single-file compatibility behavior for the other supported menu file types
- `src/app/panels/useBrowserPanelController.ts`
  - now opens the shipped `Import Files...` staged dialog and stages supported files through in-dialog Browser intake
  - still keeps the older `.step`, `.stl`, and `.glb` direct import rows as compatibility actions beside that staged path
  - still closes the staged dialog after a success-only commit read instead of keeping mixed-result sessions open with structured feedback
- `src/app/store/useAppStore.ts`
  - now owns the shipped staged import draft, structure inspection state, preview organization, reviewed settings, explicit commit path, and post-accept blob lifetime cleanup
  - still returns a success-oriented `commitStagedImportDraft()` result (`anchor row id` or `null`) rather than a structured per-file session result
  - still resolves staged `Scale / Units` through one shared scalar table instead of a `.step`-specific metadata or loader contract
- `src/app/panels/browserTreeMenus.tsx`
  - now surfaces staged per-file structure loading and error reads plus the reviewed import settings
  - still keeps final staged-session result feedback fairly thin inside the dialog
- `src/viewer/stepReferenceLoader.ts`
  - already owns real `.step` parsing through `occt-import-js`
  - still calls `ReadStepFile(fileBuffer, null)` without a dedicated staged STEP parameter contract for units or tessellation choices
- `src/viewer/referenceStructureInspection.ts`
  - already provides the honest pre-add structure summary and thrown error message path for staged files
  - gives the next lane a real seam for per-file staged inspection feedback without inventing fake structure states
  - still only sees the built object tree, so any richer `.step`-specific staged truth would need an explicit STEP metadata seam instead of being implied from generic object labels alone

That means the next honest blocker is no longer basic staged review.

The next honest blocker in the mainline path is still inside `Generation 0`:
- the staged import window is now shipped
- the user can already review structure, choose import shape, organize preview rows, and explicitly `Add To Project`
- but mixed-result sessions still do not have a first-class per-file result contract or honest partial-failure recovery flow

There is now also one narrower `Generation 0` split-import follow-on inside the `Import-4` family:
- the staged `Multiple Objects In 1 Component` path can now load correctly
- but it still reparses the same `.glb` too many times after acceptance
- that performance gap now has its own explicit owner under `Import-4 Phase 0.2`

There is now also one later `Generation 0` UI cleanup follow-on inside the `Import-4` family:
- the heavier staged-session truth and object-preview lanes now have their own shipped or standalone owners
- smaller staged import readability or polish tasks now have one explicit later home under `Import-4 Phase 7`
- the first known task there is turning the staged `Multiple Objects` / `Parts` part-label pile into a cleaner list treatment

There is now also one later `Generation 0` staged hierarchy-truth follow-on inside the `Import-4` family:
- some structured files still over-read as `Multiple objects` even when the user may reasonably perceive one meaningful object with named internal hierarchy
- that later UI-truth gap now has its own explicit owner under `Import-4 Phase 7.4`

There is now also one later `Generation 0` staged object-preview polish follow-on inside the `Import-4` family:
- the staged object preview viewport is already shipped through the earlier `Import-4 Phase 6` lane
- but later preview polish still has open follow-up needs around zoom-to-fit, preview resize response, up-axis truth in the preview output, lightweight grid aids, and a later scale-fix owner
- that later preview-only gap now has its own explicit owner under `Import-4 Phase 7.5`

There is now also one later `Generation 0` staged preview Browser enrichment follow-on inside the `Import-4` family:
- the preview Browser organization baseline is already shipped, and the object preview viewport is already present as a separate right-column inspection surface
- but later middle-column follow-up still has open needs around row-level preview-target truth, preview-browser-to-object-preview affordances, active loaded-row clarity, and row-identity polish
- that later preview-Browser-local gap now has its own explicit owner under `Import-4 Phase 7.6`

There is now also one later `Generation 0` staged import polish pair follow-on inside the `Import-4` family:
- the next user-provided polish requests are currently limited to `Part list enrichment` and `Scale enrichment`
- that later narrow pair now has its own explicit owner under `Import-4 Phase 7.7`
- that new lane should stay limited to those two wishlist items unless the user explicitly adds more

`Import-5` is the later `Generation 1` format-specific follow-on:
- the staged import window already handles `.step`, `.stl`, `.obj`, and `.glb` generically
- but `.step` still runs through the thinnest format-specific contract even though the loader already has its own dedicated OCCT seam
- that gap matters after `Import-4` because stronger `.step` truth belongs on top of a stable foundational import surface, not on the still-hardening generic staged-session contract

`Import-6` is the later `Generation 1` `.glb` enrichment follow-on:
- the staged import window already handles `.glb` generically and `Import-4` already owns the generic split-import, performance, recovery, and preview hardening work
- but `.glb` still lacks a clearer format-specific staged contract for scene truth, materials or textures, and richer embedded content honesty
- that gap should widen after `Import-5` proves the first format-specific pattern cleanly instead of widening STEP and GLB fidelity at the same time

`Import-7` is the later `Generation 1` `.stl` cleanup-controls follow-on:
- the staged import window already handles `.stl` generically through the same reviewed `Import Files...` flow
- but `.stl` still has no format-specific reviewed contract for mesh cleanup, unit-assumption honesty, normals repair, or later bounded simplification controls
- that gap should widen only as STL-specific mesh import truth, not as borrowed STEP tessellation wording and not as a reason to reopen the generic staged-session foundation

### Import Family Rules

The import family should stay disciplined:

- keep import work scoped to real user-facing entry points that already exist
- prefer narrow upgrades to the existing Browser import path over speculative new surfaces
- treat the direct-row carry-forward, the reviewed staged baseline, and the staged-session hardening work as one broader foundational import generation
- keep format-specific fidelity work separate from the broader generic import foundation
- keep retained imported-geometry work separate from the earlier mesh-first import generations
- keep reference-store ownership honest instead of duplicating imported-reference state
- split broader future import work into dedicated docs when one lane grows beyond a small focused change

### Non-Goals

The import family should not assume all import concerns belong in the currently active `Import-4` lane.

Still out of scope unless a later doc opens them explicitly:
- `.obj` `.mtl` dependency handling
- texture-bundle import workflows
- drag-and-drop import
- archive/package import formats
- a new generalized asset library
- persistence or export of imported workspace references beyond today's existing model

## Generations And Lanes

## Generation 0 - Foundational Import Baseline And Staged-Session Hardening

### [x] Import-1 - Multi-OBJ Batch Import

- allowed the existing `.obj` Browser import action to accept multiple selected `.obj` files in one picker interaction
- kept the first change grounded in the current helper and Browser controller flow
- reused the existing imported-reference insertion path instead of designing a second batch-only store path
- kept the first shipped lane tightly focused on user-facing batch convenience, not format expansion or material-pipeline work

Shipped record:
- `Shipped/Import_Phase Import-1 - Multi-OBJ Batch Import.md`

### [ ] Import-2 - Batch Import Parity For Supported Reference Types

- extend the same batch-import interaction to the rest of the older direct import menu file types
- keep the scope honest to the menu ParaHook already exposes today: `.step`, `.stl`, `.obj`, `.glb`
- treat this as compatibility parity work after the `.obj` batch path shipped
- keep later file-type-specific parsing or asset-pipeline concerns separate from the basic batch-selection parity lane

Execution doc:
- `Future/Import_Phase Import-2 - Batch Import Parity For Supported Reference Types.md`

### [x] Import-3 - Import Window Structure Review And Add-To-Project Settings

- route imported files into an import window first instead of committing them directly into project content
- show the selected file type plus discovered structure before the user accepts the import
- if a file has meaningful multi-part or multi-object structure, let the user choose between importing it as one object or importing all parts as objects
- let the user set the units before the import is accepted
- use an explicit `Add to Project` confirmation step so import settings become a real accepted decision instead of a hidden post-import correction

Shipped record:
- `Shipped/Import_Phase Import-3 - Import Window Structure Review And Add-To-Project Settings.md`

### [~] Import-4 - Staged Import Session Feedback And Partial-Failure Reporting

- keep the shipped `Import Files...` staged dialog as the mainline import path and strengthen the session-result feedback inside that flow
- add clearer per-file staged inspection and commit-result messaging so real failures stay visible and recoverable
- make partial `Add To Project` results explicit so successful files can land while failed staged files remain in-session for retry, removal, or correction
- keep true loader or parser failures honest instead of closing the dialog as if the whole staged session succeeded

Execution doc:
- `Future/Import_Phase Import-4 - Staged Import Session Feedback And Partial-Failure Reporting.md`

## Generation 1 - Format-Specific Fidelity And Heavy-Source Truth

### [ ] Import-5 - STEP Import Metadata, Units, And Loader Fidelity

- keep the shipped `Import Files...` staged dialog as the mainline import path for `.step` work instead of widening the older direct compatibility rows first
- add a real `.step`-specific staged contract for metadata, units assumptions, and loader options where the repo already has truthful seams
- make the staged `.step` preview and the accepted `.step` result use the same import truth instead of relying only on generic scale chips after commit
- keep this lane focused on `.step` import fidelity only, not on new file formats, export work, or generalized CAD healing

Execution doc:
- `Future/Import_Phase Import-5 - STEP Import Metadata, Units, And Loader Fidelity.md`

### [ ] Import-6 - GLB Scene Metadata, Materials, And Content Fidelity

- keep the shipped `Import Files...` staged dialog as the mainline `.glb` surface instead of reopening the older direct compatibility rows first
- add a real `.glb`-specific staged contract for scene metadata, materials or textures, and richer embedded content honesty where the repo already has truthful seams
- make the staged `.glb` preview and accepted `.glb` result share the same reviewed interpretation instead of relying only on generic structure copy
- keep this lane focused on `.glb` enrichment only, not on animation playback, full material authoring, light-runtime onboarding, or scene editing

Execution doc:
- `Future/Import_Phase Import-6 - GLB Scene Metadata, Materials, And Content Fidelity.md`

### [ ] Import-7 - STL Mesh Cleanup And Import Controls

- keep the shipped `Import Files...` staged dialog as the mainline `.stl` surface instead of reopening the older direct compatibility row first
- add a real `.stl`-specific staged contract for mesh cleanup options, unit-assumption honesty, and bounded reviewed import controls where the repo already has truthful seams
- make the staged `.stl` preview and accepted `.stl` result share the same reviewed cleanup interpretation instead of relying only on generic orientation and scale settings
- keep this lane focused on `.stl` mesh-import cleanup and honesty only, not on STEP-style tessellation claims, retained geometry, or generalized mesh authoring

Future execution doc:
- not created yet

## Generation 2 - Later Retained Imported-Geometry Direction

Companion vision:
- `B-rep/B-rep-Vision.md`

Reason:
- retained imported geometry is a real future direction, especially for `.step`
- but that work should widen through the companion `B-rep` family after the foundational import generation and the `.step`-fidelity generation are explicit enough first
- the import family should not blur mesh-first staged `.step` truth into already-shipped retained B-rep support

## Future Candidate Lanes

Possible later import-family follow-ons:

- `.obj` sidecar material and texture handling
- drag-and-drop reference import
- import cleanup, naming, and grouping policies for larger batches

### Current Recommendation

The next honest import work should be `Import-4` inside `Generation 0`.

`Import-5` should stay queued behind that as the first `Generation 1` `.step`-specific fidelity lane.

`Import-6` should follow inside the same `Generation 1` as the later `.glb` enrichment lane.

`Import-7` can stay later behind that as the `.stl` mesh-cleanup-and-import-controls lane.

`Import-2` can remain as a `Generation 0` compatibility follow-on if the older direct import menu rows stay live long enough to justify widening them.

Reason:
- the staged import window is now the mainline reviewed import path
- the clearest remaining user-facing gap in that foundational import surface is per-file feedback and partial-failure handling around staged inspection and `Add To Project`
- `Import-5` depends on that broader foundational import generation being honest enough before richer `.step`-specific import truth widens on top of it
- `Import-6` should widen only after `Import-5` proves the first format-specific pattern, so `.glb` enrichment stays additive instead of reopening the generic staged foundation
- `Import-7` should stay a later STL-specific cleanup lane so mesh-import controls can be described honestly as mesh cleanup and import options, not as borrowed STEP tessellation language
- `Import-2` is still a valid direct-row parity gap, but it matters less if the older per-type import rows are now mostly compatibility actions next to the shipped `Import Files...` flow

# `Import-5` - `Codex-Sized Phase Ladder`

## Doc Header

### Doc History
2. 2026-04-16: Tightened `Import-5 Phase 1 - STEP Settings Shell And Metadata Owner` into an implementation-ready slice by naming the current code seams, the exact STEP-only staged state to introduce first, the UI shell behavior to land now, the explicit non-goals that stay deferred to later phases, and the focused acceptance proof to use during implementation
1. 2026-04-16: Created this standalone child planning doc for `Import-5`, reorganizing the current STEP import wishlist into a longer whole-number phase ladder so each implementation slice is small enough for Codex to execute one at a time without relying on `1A / 1B / 1C` naming

### Purpose

This doc breaks `Import-5` into small whole-number phases.

Use it to answer:
- what the next concrete `Import-5` implementation step is
- how the current STEP wishlist should be split into Codex-sized slices
- which wishlist items should land together versus separately
- what order the STEP importer improvements should land in after the completed research passes

### Relationship To Other Docs

- `Import_Phase Import-5 - STEP Import Metadata, Units, And Loader Fidelity.md`
  - parent `Import-5` planning surface
  - owns the broad vision, research, wishlist, and staged-row mock spec
- `Import-Index.md`
  - umbrella import-family direction
- `Import/B-rep/B-rep-Vision.md`
  - long-range retained B-rep direction beyond the current mesh-first staged STEP path

## Doc Body

## [ ] `Import-5` - `Codex-Sized Phase Ladder`

### Summary

#### Purpose:
- convert the broader `Import-5` wishlist into small execution phases that can be implemented one at a time

#### Target result:
- the next STEP importer work no longer depends on large mixed-scope phases
- each phase has one narrow user-facing or architecture-facing goal
- all current wishlist items have one clear owning phase
- the early phases focus on honesty and user control before the heavier load and reuse work lands

#### Scope statement:
- this doc is the small-step execution ladder for `Import-5`
- this doc does not replace the parent `Import-5` doc's broader research or vision role

### Assumption

This ladder assumes the parent `Import-5` research passes are already complete enough to begin implementation planning:
- `Phase 0.1`
- `Phase 0.2`
- `Phase 0.3`

### Wishlist Organization

### Wishlist Header
Use this ladder like this:

- put each STEP wishlist item under the first whole-number phase that should own it
- keep later follow-ons in later phases instead of overloading the first phase that mentions the topic
- if a phase lands, mark it `[x]` here and keep the item history in place

### `Import-5 Phase 1`
- [ ] `1. STEP Rows Get One STEP-Only Settings Shell`
- [ ] `2. STEP-Specific Draft Metadata Has One Explicit Store Owner`
- [ ] `3. Non-STEP Files Keep Using The Existing Generic Staged Import UI`
#### implementation target:
  - create the narrow STEP-only staged settings shell and metadata owner without yet widening into final wording, load actions, or loader wiring

### `Import-5 Phase 2`
- [ ] `4. STEP Rows Show A Left-Right Mesh / B-Rep Toggle`
- [ ] `5. Mesh Is Active Today`
- [ ] `6. B-Rep Is Visible But Disabled`
- [ ] `7. The Toggle Copy Explains That B-Rep Import Is Future Work`
#### implementation target:
  - land the visible representation control and honest copy before adding more STEP controls around it

### `Import-5 Phase 3`
- [ ] `8. STEP Rows Show Imported As Mesh Messaging`
- [ ] `9. STEP Rows Explain That Current Viewport Display Is Mesh-Based`
- [ ] `10. Final Messaging Avoids Implying Direct B-Rep Import Already Ships`
#### implementation target:
  - tighten the surrounding wording so the staged importer is explicitly honest even before quality or load behavior widens

### `Import-5 Phase 4`
- [ ] `11. STEP Rows Show Preview Quality Presets`
- [ ] `12. The First Control Uses Simple Choices Such As Fast Balanced Fine`
- [ ] `13. The UI Explains The Speed Versus Fidelity Tradeoff`
#### implementation target:
  - add the first user-facing quality choice without yet exposing raw low-level tessellation parameters

### `Import-5 Phase 5`
- [ ] `14. Quality Presets Map To Real Loader Parameters`
- [ ] `15. Tessellation Settings Stay STEP-Only`
- [ ] `16. Reviewed Preview Quality Becomes Explicit Import Truth`
#### implementation target:
  - wire the simple quality presets into the real STEP loader contract and keep that mapping narrow and honest

### `Import-5 Phase 6`
- [ ] `17. STEP Units Truth Distinguishes Detected Assumed And User-Chosen`
- [ ] `18. STEP Rows Explain Units Truth More Honestly Than Generic Scale Chips`
- [ ] `19. STEP Units State Has One Explicit Staged Owner`
#### implementation target:
  - separate STEP units truth from the generic staged scale language before commit behavior is widened

### `Import-5 Phase 7`
- [ ] `20. Accepted STEP Transform Uses Reviewed Units Truth`
- [ ] `21. Units Correction Stops Reading Like A Viewer-Only Fix`
- [ ] `22. STEP Preview And Accepted Result Stay Aligned On Units Truth`
#### implementation target:
  - make the accepted import result consume the reviewed STEP units decision instead of relying on generic post-accept correction behavior

### `Import-5 Phase 8`
- [ ] `23. Large STEP Files Show An Explicit Load Button`
- [ ] `24. Heavy STEP Work Does Not Auto-Start Just Because The File Was Staged`
- [ ] `25. The User Can Review Settings Before Starting The Heavy Parse`
#### implementation target:
  - change large STEP behavior from eager auto-load toward explicit user-triggered load timing

### `Import-5 Phase 9`
- [ ] `26. The Staged Importer Shows Honest STEP Progress`
- [ ] `27. Determinate Progress Is Used When Real Byte Progress Exists`
- [ ] `28. Parse Progress Uses Real Milestones Until True Determinate Parse Progress Exists`
- [ ] `29. Progress Lives Inside The Staged Importer Instead Of Only After Commit`
#### implementation target:
  - add truthful staged progress UI once the explicit `Load` action exists

### `Import-5 Phase 10`
- [ ] `30. Loaded STEP State Is Retained In The Staged Importer`
- [ ] `31. Add To Project Reuses The Previously Loaded STEP Result When Available`
- [ ] `32. The App Stops Paying The Heaviest Parse Cost Twice When Reuse Is Possible`
#### implementation target:
  - convert staged STEP loading from throwaway preview work into reusable accepted-import input

### `Import-5 Phase 11`
- [ ] `33. Cheap STEP Structure Summary Is Preferred Over Full Heavy Parse When Possible`
- [ ] `34. Large STEP Warnings Become More Explicit`
- [ ] `35. The Importer Warns Honestly About Slow Or Memory-Heavy Files`
#### implementation target:
  - improve large-file honesty and reduce unnecessary heavy work before later worker isolation lands

### `Import-5 Phase 12`
- [ ] `36. STEP Structure Labels Become More Useful`
- [ ] `37. Smarter STEP Import-Mode Defaults Appear Only When Source Structure Honestly Supports Them`
- [ ] `38. Browser Defaults Do Not Invent Assembly Fidelity The Loader Did Not Really Expose`
#### implementation target:
  - polish the structure-reading side only after the heavier truth, quality, units, load, and reuse work is explicit

### `Import-5 Phase 13`
- [ ] `39. Worker-Handoff Seams For Heavy STEP Load Are Introduced`
- [ ] `40. One Disposable Heavy STEP Worker Path Is Preferred Over Long-Lived Main-Thread Pressure`
- [ ] `41. The UI Can Stay Responsive During Later Heavier STEP Parse Work`
#### implementation target:
  - begin the later worker-isolation direction without overpromising that true determinate parse progress or retained B-rep import already ships

### `Import-5 Phase 14`
- [ ] `42. Focused Regression Coverage Exists For The Full STEP Staged-Import Story`
- [ ] `43. Narrow Cleanup Removes Temporary STEP-Specific Glue`
- [ ] `44. Final Messaging Stays Honest About Mesh Import, Quality Choice, Progress, And Remaining B-Rep Limits`
#### implementation target:
  - finish the lane with cleanup and proof after the user-facing behavior is stable

### Internal Phase Ladder

The cleanest whole-number `Import-5` ladder is:

1. `Import-5 Phase 1 - STEP Settings Shell And Metadata Owner`
2. `Import-5 Phase 2 - Mesh / B-Rep Toggle`
3. `Import-5 Phase 3 - Mesh Honesty Copy`
4. `Import-5 Phase 4 - Preview Quality Presets`
5. `Import-5 Phase 5 - Quality Preset Loader Wiring`
6. `Import-5 Phase 6 - STEP Units Truth Model`
7. `Import-5 Phase 7 - Accepted Units Truth`
8. `Import-5 Phase 8 - Explicit STEP Load Action`
9. `Import-5 Phase 9 - Staged STEP Progress`
10. `Import-5 Phase 10 - Loaded Result Reuse On Add To Project`
11. `Import-5 Phase 11 - Large-File Honesty And Cheap Summary Direction`
12. `Import-5 Phase 12 - STEP Structure Labels And Default Import Shape`
13. `Import-5 Phase 13 - Worker Handoff Groundwork`
14. `Import-5 Phase 14 - Narrow Cleanup And Regression Pass`

Reason:
- the STEP-only settings shell should exist before user-facing STEP controls widen on top of it
- the representation toggle should exist before the surrounding copy and messaging are finalized
- honesty copy should land before quality presets so users understand what current STEP import really produces
- simple quality presets should land before their lower-level loader mapping is widened
- units truth should be made explicit before explicit load and reuse behavior depends on reviewed settings
- explicit load should exist before staged progress can read as a user-triggered action instead of hidden background work
- staged progress should exist before reuse can make `Add To Project` feel intentionally lighter
- large-file honesty and cheap summary direction should land before later structure-default polish depends on the final load story
- worker handoff should stay later, after the simpler main-thread behavior is already explicit and testable

## [ ] `Import-5` - `Phase 1 - STEP Settings Shell And Metadata Owner`

### Purpose

- create the first narrow STEP-only staged settings shell and metadata owner

### Goal

- give `.step` rows one explicit place to store future representation, quality, units, and load state without widening the generic staged importer for every file type

### Locked Direction

- keep this phase `.step`-only
- keep the first pass contract-focused
- do not yet widen into:
  - the `Mesh / B-Rep` toggle UI
  - quality presets
  - explicit load
  - progress

### Current Code Read

The current staged STEP path already has the right broad seams, but not a STEP-only metadata owner yet:

- `src/app/store/useAppStore.ts`
  - `appendStagedImportDraftFiles(...)` builds each staged file with generic staged fields only:
    - `importMode`
    - `upAxis`
    - `scaleAlignment`
    - `structureInspection`
  - there is no STEP-only staged sub-state yet
- `src/app/panels/browserTreeMenus.tsx`
  - `renderStagedImportStructureSummary(...)` renders one generic staged settings surface for every supported file type
  - `.step` rows do not yet have their own settings shell
- `src/viewer/referenceStructureInspection.ts`
  - already owns staged structure inspection truth
  - does not yet need to carry new STEP metadata in this phase unless a narrow seam helper is useful

### Implementation Intent

This phase should only create the shell and owner that later STEP phases will build on.

It should not try to land the full visible STEP experience yet.

The intended result is:

- non-STEP rows continue to render exactly as they do today
- `.step` rows gain one visible STEP-only settings section
- the store gains one STEP-only staged metadata contract
- that contract defaults cleanly at stage time
- commit behavior remains unchanged in this phase

### Proposed STEP-Only Staged Contract

Add one narrow staged STEP metadata object on staged `.step` files only.

Recommended shape:

```ts
type StagedStepRepresentationMode = 'mesh'

type StagedStepDraftSettings = {
  representationMode: StagedStepRepresentationMode
  qualityPreset: null
  unitsTruth: null
  loadState: 'idle'
}
```

Implementation notes:

- keep `representationMode` as `'mesh'` only in this phase
- do not add `'brep'` as a selectable stored value yet if the Phase 1 UI cannot actually switch to it
- allow later phases to widen this object instead of scattering STEP-specific fields across the generic file record
- keep non-STEP files free of this object entirely

### Phase 1 UI Shape

In the staged importer, `.step` rows should gain one lightweight STEP-only shell above or before the generic structure summary:

- section label:
  - `STEP Settings`
- initial helper copy:
  - `STEP-specific import settings will appear here.`
- optional secondary helper copy:
  - `Representation, quality, units, and staged load controls land in later phases.`

This shell is intentionally lightweight.

It exists to make the STEP-only ownership visible before later controls widen on top of it.

### Scope

In scope for this phase:

- add one STEP-only staged metadata owner in `useAppStore`
- initialize it when `.step` files are appended to the staged draft
- preserve it when other staged file settings change
- render one STEP-only settings shell for `.step` rows in the staged importer
- keep generic staged structure and import settings working as they do today

Out of scope for this phase:

- visible `Mesh / B-Rep` toggle interaction
- disabled `B-Rep` copy
- quality presets or ParaSlider fidelity controls
- units-truth wording
- explicit staged `Load`
- staged progress
- parse reuse
- loader wiring changes
- commit-path behavior changes

### Suggested File Targets

- `src/app/store/useAppStore.ts`
  - add the STEP-only staged metadata type
  - extend `StagedImportDraftFileRecord` to carry STEP-only metadata only when `fileType === 'step'`
  - initialize STEP metadata in `appendStagedImportDraftFiles(...)`
  - preserve STEP metadata across existing staged-file update helpers
- `src/app/panels/browserTreeMenus.tsx`
  - add one small STEP-only settings shell render path
  - keep the rest of the staged row UI unchanged

### Implementation Order

1. Add the STEP-only staged metadata types in `useAppStore.ts`.
2. Initialize default STEP metadata when staged `.step` files are created.
3. Verify the existing staged mutators preserve the new STEP metadata object.
4. Add the STEP-only shell in `browserTreeMenus.tsx`.
5. Verify `.obj`, `.stl`, and `.glb` rows do not render the STEP shell.

### Acceptance Proof

Phase 1 is ready to call done when:

1. staging one `.step` file creates a staged row with STEP-only metadata in store state
2. staging one non-STEP file does not create that STEP metadata object
3. changing `Import as`, `Up Axis`, or `Scale / Units` on a staged `.step` file does not drop its STEP metadata
4. the staged importer shows one STEP-only settings shell for `.step` rows only
5. no visible `Mesh / B-Rep` toggle exists yet in this phase
6. `Add To Project` behavior stays unchanged

### Risk Notes

- the biggest risk in this phase is overdesigning the STEP state before later phases prove what they really need
- prefer one small owned object with obvious placeholders over a wide generic import-state refactor
- if the UI shell starts needing real toggle copy, stop and move that work to `Phase 2`

### Expected Implementation Shape

- likely update `src/app/store/useAppStore.ts`
- likely update `src/app/panels/browserTreeMenus.tsx`
- add focused proof for STEP-only staged metadata ownership

## [ ] `Import-5` - `Phase 2 - Mesh / B-Rep Toggle`

### Purpose

- add the visible representation toggle for STEP rows

### Goal

- expose one left-right `Mesh / B-Rep` control where `Mesh` is active and `B-Rep` is visible but disabled

### Locked Direction

- keep the toggle visible
- keep `B-Rep` disabled
- do not yet widen this phase into broader wording cleanup or load behavior

### Expected Implementation Shape

- likely update `src/app/panels/browserTreeMenus.tsx`
- likely update `src/app/store/useAppStore.ts`
- add focused UI proof for toggle state and disabled `B-Rep`

## [ ] `Import-5` - `Phase 3 - Mesh Honesty Copy`

### Purpose

- make the staged importer speak honestly about today's mesh-based STEP path

### Goal

- show clear copy like:
  - `Imported as mesh today`
  - `B-Rep import coming later`

### Locked Direction

- keep the wording short and explanatory
- do not imply retained B-rep import already ships

### Expected Implementation Shape

- likely update `src/app/panels/browserTreeMenus.tsx`
- add focused UI proof for the staged STEP wording

## [ ] `Import-5` - `Phase 4 - Preview Quality Presets`

### Purpose

- give the user one simple speed-versus-fidelity control

### Goal

- expose a simple reviewed control such as `Fast / Balanced / Fine`

### Locked Direction

- prefer simple presets first
- do not expose raw low-level tessellation parameters yet

### Expected Implementation Shape

- likely update `src/app/panels/browserTreeMenus.tsx`
- likely update `src/app/store/useAppStore.ts`

## [ ] `Import-5` - `Phase 5 - Quality Preset Loader Wiring`

### Purpose

- map the simple quality presets onto real STEP loader behavior

### Goal

- wire reviewed presets into real loader params without inventing fake controls

### Locked Direction

- only use real knobs already supported by the loader:
  - `linearDeflectionType`
  - `linearDeflection`
  - `angularDeflection`
- keep this mapping `.step`-only

### Expected Implementation Shape

- likely update `src/viewer/stepReferenceLoader.ts`
- likely widen `src/viewer/referenceAssetLoader.ts`
- likely widen staged STEP settings plumbing

## [ ] `Import-5` - `Phase 6 - STEP Units Truth Model`

### Purpose

- distinguish detected, assumed, and user-chosen units truth for STEP

### Goal

- stop treating STEP units as only generic staged scale chips

### Locked Direction

- keep this phase about staged truth modeling and wording
- do not yet widen into accepted transform commit behavior

### Expected Implementation Shape

- likely update `src/app/store/useAppStore.ts`
- likely update `src/app/panels/browserTreeMenus.tsx`

## [ ] `Import-5` - `Phase 7 - Accepted Units Truth`

### Purpose

- make accepted STEP transforms consume the reviewed units truth

### Goal

- keep preview and accepted import aligned on units behavior

### Locked Direction

- keep the accepted result deterministic
- avoid hiding units correction as a viewer-only fix

### Expected Implementation Shape

- likely update `src/app/store/useAppStore.ts`
- likely touch staged commit behavior

## [ ] `Import-5` - `Phase 8 - Explicit STEP Load Action`

### Purpose

- move large STEP heavy work behind one explicit staged `Load` action

### Goal

- let the user review settings before the heaviest parse starts

### Locked Direction

- prefer explicit load over eager heavy auto-load for `.step`
- keep this phase focused on load timing, not yet full progress behavior

### Expected Implementation Shape

- likely update `src/app/panels/browserTreeMenus.tsx`
- likely update `src/app/panels/useBrowserPanelController.ts`
- likely update staged STEP state in `src/app/store/useAppStore.ts`

## [ ] `Import-5` - `Phase 9 - Staged STEP Progress`

### Purpose

- show truthful progress inside the staged importer during heavy STEP work

### Goal

- display:
  - determinate progress when real measurable progress exists
  - milestone progress during heavy parse when exact percentage does not yet exist

### Locked Direction

- keep progress honest
- do not invent smooth fake percentages through the heavy parse

### Expected Implementation Shape

- likely update `src/app/panels/browserTreeMenus.tsx`
- likely widen staged STEP load state in `src/app/store/useAppStore.ts`
- likely widen `src/viewer/stepReferenceLoader.ts`

## [ ] `Import-5` - `Phase 10 - Loaded Result Reuse On Add To Project`

### Purpose

- reuse staged STEP heavy work when the user later accepts the import

### Goal

- make `Add To Project` consume a previously loaded staged result when possible

### Locked Direction

- prefer reuse over reparsing
- keep the first pass narrow around the staged-to-accepted handoff

### Expected Implementation Shape

- likely update `src/app/store/useAppStore.ts`
- likely update `src/app/components/ViewerHost.tsx`
- likely widen surrounding load-call seams

## [ ] `Import-5` - `Phase 11 - Large-File Honesty And Cheap Summary Direction`

### Purpose

- improve large-file honesty and reduce unnecessary heavy work before later worker isolation

### Goal

- warn honestly about slow or memory-heavy STEP imports
- prefer cheap summary behavior when possible

### Locked Direction

- keep this phase about honesty and unnecessary-work reduction
- do not yet widen into full worker isolation

### Expected Implementation Shape

- likely update `src/app/panels/browserTreeMenus.tsx`
- likely update `src/viewer/referenceStructureInspection.ts`
- likely update staged load policy

## [ ] `Import-5` - `Phase 12 - STEP Structure Labels And Default Import Shape`

### Purpose

- improve STEP labels and import-mode defaults after the heavier behavior is explicit

### Goal

- make labels and defaults smarter only when the source structure truly supports that behavior

### Locked Direction

- keep `1 Object` as the compatibility path
- do not invent assembly fidelity the loader did not actually expose

### Expected Implementation Shape

- likely update `src/viewer/referencePartDescriptors.ts`
- likely update `src/viewer/referenceStructureInspection.ts`
- likely update staged STEP row presentation

## [ ] `Import-5` - `Phase 13 - Worker Handoff Groundwork`

### Purpose

- prepare the later worker-isolated heavy STEP load direction

### Goal

- create the first narrow worker handoff seam so UI responsiveness can improve later

### Locked Direction

- keep this phase groundwork-focused
- do not overpromise true determinate parse progress yet
- do not overpromise retained B-rep import yet

### Expected Implementation Shape

- likely touch `src/viewer/stepReferenceLoader.ts`
- likely add one worker-facing seam
- likely widen staged STEP progress plumbing

## [ ] `Import-5` - `Phase 14 - Narrow Cleanup And Regression Pass`

### Purpose

- finish the STEP lane cleanly once the user-facing behavior is stable

### Goal

- leave the staged STEP importer honest, tested, and narrow

### Locked Direction

- keep this pass cleanup-only
- prefer proof and wording cleanup over new behavior

### Verification

Minimum proof for this ladder:

1. `.step` rows gain STEP-only settings without widening the rest of the staged importer unnecessarily.
2. The staged importer is explicit that STEP imports are mesh-based today and that `B-Rep` is future work.
3. The user can choose one reviewed quality setting before heavy STEP load begins.
4. Units truth is explicit and survives into accepted import behavior.
5. Large STEP imports can be loaded explicitly from the staged importer with truthful progress.
6. `Add To Project` can reuse staged STEP heavy work when that result already exists.
7. Large-file warnings and structure labels stay honest.

### Exit Criteria

This child ladder is ready to guide implementation when:

- every current `Import-5` wishlist item has one clear whole-number owning phase
- no phase depends on `1A / 1B / 1C` naming to stay small
- the early phases are small enough for Codex to execute one at a time
- later heavy work such as reuse and worker handoff stays clearly separated from the first honesty and settings passes

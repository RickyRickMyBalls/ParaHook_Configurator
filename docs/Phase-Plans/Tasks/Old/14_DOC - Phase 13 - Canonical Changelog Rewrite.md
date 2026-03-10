# OO - Phase 13 - Canonical Changelog Rewrite

## Doc History
1. 2026-03-07 14:36: Extended this phase to include the post-rewrite changelog cleanup pass, covering doc-header/doc-body structure, heading normalization, forward format rules, and `HUMAN SUMMARY:` rollout
1. 2026-03-07 15:05: Completed the 13D validation/cleanup pass by validating merged numbering continuity, fixing stale plan references/typos, and recording remaining old-number follow-up references in history/archive docs
2. 2026-03-07 12:08: Reworked the planned recovered `CHANGELOG.md` entry shapes using the actual restored history/task logs so the draft section now reads closer to the real entries that will be written
3. 2026-03-07 11:00: Broke this work into internal sub-phases so the canonical changelog rewrite can be executed as a safer multi-phase sequence instead of one large risky pass
4. 2026-03-07 10:48: Upgraded the top checklist into a higher-detail execution checklist so this future phase file can act as the real working plan for the canonical changelog rewrite
5. 2026-03-07 10:44: Created this future phase file from the first phase-loop planning pass and seeded it with the current canonical changelog rewrite plan

## Purpose

This phase plans the rewrite of `docs/CHANGELOG.md` into one canonical changelog that combines:
- recovered pre-changelog history
- current shipped changelog history
- canonical renamed titles aligned to the current prefix system
- later readability/format cleanup so the canonical changelog is easier to scan and maintain

This phase must preserve the difference between:
- strongly supported recovered completed entries
- explicit recovered gap or bridge entries

## Internal Sub-Phases

- `OO - Phase 13A - Recovered Changelog Mapping And Policy Lock`
  - lock the recovered insertion band
  - lock numbering and label rules
  - lock the recovered-history note
- `OO - Phase 13B - Recovered Entry Drafting`
  - draft the recovered completed entries
  - draft the recovered gap and bridge entries
- `OO - Phase 13C - Canonical Changelog Merge And Renumber`
  - insert the recovered band into `docs/CHANGELOG.md`
  - renumber the shipped block
  - rename existing shipped entry titles into the canonical prefix naming system
  - update `docs/change-List.md`
- `OO - Phase 13D - Validation And Follow-Up Cleanup`
  - validate continuity
  - validate naming
  - identify any follow-up doc references that still point at old numbering
- `OO - Phase 13E - Changelog Cleanup And Human Summary Normalization`
  - normalize the current changelog into the proper doc-header/doc-body structure
  - normalize heading levels inside entries
  - document the forward changelog formatting rules
  - roll out `HUMAN SUMMARY:` lines across the full file

## Checklist

- [x] 1. `OO - Phase 13A - Recovered Changelog Mapping And Policy Lock`
  - [x] confirm this phase stays under `OO - Phase 13`
  - [x] confirm `docs/Change-List-COMPILED.md` is the numbering bridge and must not be rewritten during the main merge
  - [x] count and lock the recovered insertion band as compiled `[001]-[025]`
  - [x] split the recovered band into completed recovered entries `[001]-[013]` and `[017]-[023]`
  - [x] split the recovered band into recovered gap entries `[014]-[016]` and `[024]-[025]`
  - [x] write the exact recovered-entry map from compiled ids to final changelog ids
  - [x] write the exact shipped-entry renumber rule so old `[001]` becomes new `[026]`
  - [x] decide the recovered timestamp policy before drafting any rewritten entries
  - [x] decide the exact label style for recovered gap entries
  - [x] draft the top `Recovered History Note` for `docs/CHANGELOG.md`
  - [x] make a safety copy of the current `docs/CHANGELOG.md`

- [x] 2. `OO - Phase 13B - Recovered Entry Drafting`
  - [x] draft recovered entry `[001]` in the current changelog format
  - [x] draft recovered entries `[002]-[013]` in the current changelog format
  - [x] draft recovered gap entries `[014]-[016]` with explicit recovered-gap wording
  - [x] draft recovered entries `[017]-[023]` in the current changelog format
  - [x] draft recovered bridge entries `[024]-[025]` with explicit incomplete-evidence wording

- [ ] 3. `OO - Phase 13C - Canonical Changelog Merge And Renumber`
  - [x] insert the recovered note and recovered entries at the bottom of `docs/CHANGELOG.md`
  - [x] renumber the existing shipped changelog entries by `+25`
  - [x] rename the existing shipped changelog entry titles to the current canonical prefix naming system
  - [x] verify the shipped block still preserves its original order and body text
  - [x] update `docs/change-List.md` to the same merged numbering
  - [x] verify `docs/change-List.md` stays in sync with the rewritten `docs/CHANGELOG.md`

- [x] 4. `OO - Phase 13D - Validation And Follow-Up Cleanup`
  - [x] verify canonical prefix naming against `docs/Phase-Plans/00_Phase-Setup.md`
  - [x] verify recovered entry wording against `docs/Phase-Plans/00_Phase_Log.md`
  - [x] verify that gap rows are visibly different from recovered completed entries
  - [x] verify that no current shipped changelog entry was dropped during renumbering
  - [x] do one final continuity pass from new `[001]` through the last renumbered shipped entry
  - [x] identify any follow-up docs that still reference old changelog numbering

- [x] 5. `OO - Phase 13E - Changelog Cleanup And Human Summary Normalization`
  - [x] add a proper `Doc Header` / `Doc Body` structure to `docs/CHANGELOG.md`
  - [x] normalize numbered changelog entry headings to `###`
  - [x] normalize internal entry sections to `####`
  - [x] document the forward changelog title and format rules
  - [x] add the `HUMAN SUMMARY:` rule
  - [x] add `HUMAN SUMMARY:` lines to all numbered entries
  - [x] add minimal summary lines to reconstructed marker blocks
  - [x] normalize the existing summary lines to the current style
  - [x] verify summary placement directly under each wrapper
  - [ ] hand-polish any awkward generated summaries later if needed

## Plan

### Batch Goal

Rewrite `docs/CHANGELOG.md` into one canonical changelog that combines:
- recovered pre-changelog history
- current shipped changelog history
- canonical renamed titles aligned to the current prefix system
- post-rewrite readability cleanup so the file is easier to scan in folded view

while preserving the difference between:
- strongly supported recovered entries
- explicit recovered gap or bridge entries

### Main Plan

#### Phase 13A - Recovered Changelog Mapping And Policy Lock

1. Freeze the current shipped changelog.
- Make a safety copy of `docs/CHANGELOG.md`.
- Do not touch `docs/Change-List-COMPILED.md`; use it as the numbering and source bridge.

2. Define the recovered insertion band.
- Treat compiled `[001]-[025]` as the pre-changelog insertion band.
- Split that band into:
  - recovered completed entries: `[001]-[013]`, `[017]-[023]`
  - recovered gap entries: `[014]-[016]`, `[024]-[025]`

3. Lock the canonical naming sources.
- Use `docs/Change-List-COMPILED.md` for canonical titles and number mapping.
- Use `docs/Phase-Plans/00_Phase-Setup.md` as the prefix authority.
- Use `docs/Phase-Plans/00_Phase_Log.md` to write the recovered summaries and checklist-style details.

4. Add a recovered-history note at the top of the changelog.
- Draft a visible note such as:
- `Recovered History Note`
- `Entries [001]-[025] were reconstructed from compiled history, phase logs, and recovered conversation evidence. Some entries are strongly supported recovered work; explicit gap entries remain estimates and are labeled as such.`

#### Phase 13B - Recovered Entry Drafting

5. Write recovered entries in normal changelog format.
- Use the current changelog structure:
  - `<!-- ============================================================ -->`
  - `## Reconstructed` for recovered completed entries
  - `## Reconstructed Gap` for recovered gap / bridge entries
  - `## [NNN] [Conv N] (Title)` or `## [NNN] [Gap] (Title)`
  - `<!-- ============================================================ -->`
  - `### Scope / Constraints Honored`
  - `### Summary of Implementation`
  - `### Files Changed`
  - `### Behavior Changes (if any)`
  - `### Verification Steps`
- Be explicit where details are inferred.
- Use a consistent recovered-history timestamp strategy instead of fake precision.

6. Write the gap entries as explicit recovered-gap notes.
- Keep `[014]-[016]` and `[024]-[025]`, but label them clearly.
- Best title shapes:
  - `(Recovered Gap Note: GE - Phase 4 - First Repo Setup Execution)`
  - `(Recovered Bridge Entry: Restored History To First Shipped Changelog Handoff)`
- In `Scope / Constraints Honored` and `Verification Steps`, explicitly say evidence is incomplete.

#### Phase 13C - Canonical Changelog Merge And Renumber

7. Renumber the shipped changelog block.
- Shift all current shipped entries by `+25`.
- Examples:
  - old `[001]` -> new `[026]`
  - old `[002]` -> new `[027]`
  - old `[103]` -> new `[128]`
- Rename the shipped entry titles so they align to the current canonical prefix system.
- Preserve shipped body text as much as possible outside the necessary title renaming and numbering rewrite.

8. Update the one-line change index after the changelog rewrite.
- Update `docs/change-List.md` to match the new numbering.
- Validate carefully so it does not desync from the changelog.

#### Phase 13D - Validation And Follow-Up Cleanup

9. Keep supporting docs stable during the rewrite.
- Do not rewrite `docs/Change-List-COMPILED.md` during the main merge unless truly necessary.
- Only adjust phase or docs references afterward if the new canonical numbering must be referenced elsewhere.

10. Validate the merged result.
- Confirm:
  - `[001]-[025]` exist and stay in recovered order
  - `[026]+` aligns with the old shipped order
  - shipped titles use the current canonical naming system consistently
  - gap entries are visibly marked as recovered or inferred
  - canonical prefixes match `docs/Phase-Plans/00_Phase-Setup.md`
  - no shipped entry text was accidentally dropped during renumbering

#### Phase 13E - Changelog Cleanup And Human Summary Normalization

11. Normalize the canonical changelog structure after the merge.
- Keep the top-level title as `# CHANGELOG`.
- Add and maintain `## Doc Header` and `## Doc Body`.
- Keep numbered entries under `## Doc Body`.
- Keep numbered entry headings at `###`.
- Keep internal entry sections at `####`.

12. Document the forward changelog rules.
- Record the current expected title shape for future entries.
- Record the canonical phase-prefix naming rule for future entries.
- Record the `HUMAN SUMMARY:` placement and formatting rule so folded scanning stays readable.

13. Roll out human-readable summary lines across the full file.
- Add one `HUMAN SUMMARY:` line directly under each numbered entry wrapper.
- Write summaries from entry-body context rather than title-only guessing.
- Normalize pre-existing summary lines to the same style.
- Add minimal summary lines to reconstructed marker blocks where they improve scanning.

14. Validate the cleanup pass.
- Verify every numbered entry has exactly one `HUMAN SUMMARY:` line.
- Verify no entry body headings regressed back to `###`.
- Verify numbering, wrapper comments, dates, and entry bodies remain intact apart from summary insertion and rule cleanup.

## Notes

- The main missing risk is overstating certainty in the recovered gap entries.
- The safest approach is to keep recovered completed entries and recovered gap entries visibly different inside the rewritten changelog.
- This phase also includes renaming older shipped changelog titles so legacy labels like older prefix families or local phase labels are normalized into the current canonical naming system.
- This phase now also includes the cleanup/readability pass that happened after the canonical merge, so the full rewrite history and the later summary-normalization work stay together in one phase record.
- Follow-up references that still use old changelog numbering were found mainly in:
  - `docs/History/5 - chatgpt.md`
  - `docs/History/7 - chatgpt.md`
  - archive files such as `docs/Archive/CHANGELOG copy.md`

These do not block the canonical changelog rewrite, but they remain follow-up cleanup candidates if old numbering references need full repo-wide normalization.

## EXAMPLE FORMAT

<!-- ============================================================ -->
## [003] 2026-03-03 (Feature Stack v1 Spec-Alignment: App Layer)
<!-- ============================================================ -->

### Scope / Constraints Honored
- App-layer only changes.
- No worker/protocol/scheduler contract changes.
- No auto-build behavior changes.
- `buildRequestSchema.profile` remains `z.record(z.string(), z.unknown())`.
- Existing composite/path/wiring behavior preserved.

### Feature API Alignment
- Added canonical profile derivation exports:
  - `hashFnv1a32(str)`
  - `profileIdFromSignature(sig)`
  - `deriveProfiles(entities)`
- Kept compatibility alias:
  - `deriveProfilesFromLines = deriveProfiles`
- Added canonical auto-link export:
  - `pickDefaultProfileRef(stack, insertIndex)`
- Kept compatibility alias:
  - `findDefaultExtrudeProfileRef = pickDefaultProfileRef`
- Aligned diagnostics type to canonical shape:
  - `Diagnostic = { featureId, level, message }`
- Kept compatibility type alias:
  - `FeatureDiagnostic = Diagnostic`

### Determinism and Derivation Contract
- Updated profile derivation to locked deterministic rules:
  - point keys use exact `${String(x)}|${String(y)}`
  - exact literal endpoints (no tolerance rounding path)
  - deterministic adjacency and traversal
  - canonical signature normalization (rotation + direction)
  - stable FNV-1a 32-bit base36 profile IDs
  - zero-area loop rejection
  - stable output sorting: area desc, signature asc, profileId asc

### Store / UI Alignment
- Store now uses canonical helpers:
  - `deriveProfiles(...)`
  - `pickDefaultProfileRef(...)`
- Added/used part stack helpers:
  - `getPartFeatureStack(node)`
  - `setPartFeatureStack(node, stack)`
- Sketch profile outputs are recomputed immediately after line edits.
- Feature stack UI diagnostics no longer rely on `diagnostic.code`.
- Diagnostics keys are deterministic:
  - `${featureId}|${level}|${message}|${index}`
- Extrude collapsed summary now matches spec format:
  - `Profile: <SketchShort>/<ProfileLabel>, Depth: <value>`
- Profile labels use `A..Z` then `Profile <n>` fallback.

### Compile / Payload Alignment
- `sp_featureStackIR` compile emission aligned to non-empty feature stack presence.
- Emitted IR payload remains:
  - `{ schemaVersion: 1, parts: Record<PartKey, IR[]> }`
- Existing part-key mapping retained (`baseplate`, `toeHook#1`, `heelKick#1`) with deterministic behavior.
- Patch/change detection path continues using stable hashing and includes `sp_featureStackIR`.

### Files Changed
- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/features/autoLink.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/profileDerivation.test.ts`
- `src/app/spaghetti/features/autoLink.test.ts`

### Verification
- `npm.cmd run test` (passed)
- `npm.cmd --prefix parahook run build` (passed)

### Interaction Boundary Guard Fix (2026-03-04)
- Fix: prevent node drag/select from capturing UI control pointerdown; audit interactive markers.
- Added shared interaction helper `src/app/spaghetti/spInteractive.ts`:
  - `isInteractiveTarget(target)` selector guard
  - `SP_INTERACTIVE_PROPS` (`data-sp-interactive` + pointerdown stopPropagation)
- Updated canvas drag/select boundary handling:
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` now uses `isInteractiveTarget` in node pointerdown handling
  - stage deselect pointerdown now ignores interactive targets
- Audited/updated interactive control guards in:
  - `src/app/spaghetti/canvas/PortView.tsx`
  - `src/app/spaghetti/canvas/fields/NumberField.tsx`
  - `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - `src/app/spaghetti/canvas/NodeView.tsx`

  ## EXAMPLE FORMAT END



## Reference - Compiled Insertion Band `[025] -> [001]`

Use this section as the direct working reference for the recovered pre-changelog insertion band from `docs/Change-List-COMPILED.md`.

- `[025] [Gap]` First Landed Graph / Feature Stack / Expose Fields Implementation Wave
- `[024] [Gap]` Restored History To First Shipped Changelog Handoff
- `[023] [Conv 9]` `SP - Phase 3 - Spaghetti Editor S3 - Compile To Build Integration`
- `[022] [Conv 9]` `GE - Phase 6 - Worker Affected-Part Routing And Cache Preference`
- `[021] [Conv 9]` `DR - Phase 3 - Param Ownership / Routing v20`
- `[020] [Conv 9]` `SP - Phase 2 - Spaghetti Editor S2 - Compute / Evaluate / Compile Skeleton`
- `[019] [Conv 9]` `SP - Phase 1 - Spaghetti Editor S1 - Schema / Validation / Store`
- `[018] [Conv 9]` `VM - Phase 2 - Instance-Aware Store And ViewModel Baseline`
- `[017] [Conv 9]` `AS - Phase 4 - Canonical Part Identity And Assembled Direction`
- `[016] [Gap]` `AS - Phase 3 - First Parts / Artifact Baseline`
- `[015] [Gap]` `GE - Phase 5 - First Running Box Vertical Slice`
- `[014] [Gap]` `GE - Phase 4 - First Repo Setup Execution`
- `[013] [Conv 8]` `ADV - Phase 2 - Roadmap Ordering`
- `[012] [Conv 8]` `ADV - Phase 1 - Future-Ready Systems`
- `[011] [Conv 8]` `EX - Phase 1 - Future Export Shape`
- `[010] [Conv 8]` `VR - Phase 1 - Viewer Ownership`
- `[009] [Conv 8]` `VM - Phase 1 - Selector Discipline`
- `[008] [Conv 8]` `JK - Phase 1 - Mode Structure`
- `[007] [Conv 8]` `PT - Phase 2 - Param Ownership Direction`
- `[006] [Conv 8]` `PT - Phase 1 - Independent Part Thinking`
- `[005] [Conv 8]` `AS - Phase 2 - Deterministic Part Ordering`
- `[004] [Conv 8]` `AS - Phase 1 - Parts List Replacement`
- `[003] [Conv 8]` `GE - Phase 3 - Engine Roadmap Foundation`
- `[002] [Conv 8]` `GE - Phase 2 - Runtime And Rebuild Rules`
- `[001] [Conv 8]` `GE - Phase 1 - Clean Restart Architecture`






## Reference - Planned `CHANGELOG.md` Entry Shapes

This section translates the compiled insertion band into the actual entry types that will be written into `docs/CHANGELOG.md`.

Every entry below should eventually be written using the same visible structure as the example above:
- changelog header
- scope / constraints
- summary of implementation
- files changed
- behavior changes
- verification steps

Source rule for this draft section:
- use `docs/History/0 - History-TaskLog.md` as the main source for recovered Conv 8 entries `[001]-[013]`
- use `docs/Phase-Plans/00_Phase_Log.md` as the main source for recovered Conv 9 entries `[017]-[023]`
- keep gap/bridge entries visibly inferred

### Recovered Completed Entry Shapes

<!-- ============================================================ -->
## Reconstructed
## [023] [Conv 9] (SP - Phase 3 - Spaghetti Editor S3 - Compile To Build Integration)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on compiled history and later canonical phase reconstruction.
- Preserved the existing warm-worker runtime direction.
- Preserved the existing app -> worker -> viewer separation.

### Summary of Implementation
- Connected Spaghetti compile output into the live build path.
- Turned Spaghetti from an isolated graph/editor experiment into a real authoring input mode.
- Preserved the current worker path while feeding it graph-produced build intent.

### Files Changed
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/buildModel.ts`
- `src/shared/buildTypes.ts`

### Behavior Changes (if any)
- The graph system could now drive the live build path instead of staying only a planning/editor surface.

### Verification Steps
- Review compiled row `[023]` and the canonical phase log for `SP - Phase 3`.
- Confirm the draft stays consistent with the later shipped changelog wording around early Spaghetti integration.


<!-- ============================================================ -->
## Reconstructed
## [022] [Conv 9] (GE - Phase 6 - Worker Affected-Part Routing And Cache Preference)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on conversation-derived task logs.
- Preserved the one warm worker rule.
- Preserved the current deterministic stub-output baseline while routing work matured.

### Summary of Implementation
- Defined worker-side affected-part routing as real build input.
- Added cache-preference thinking around unaffected parts.
- Strengthened the engine toward selective recompute without restarting the architecture.

### Files Changed
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`

### Behavior Changes (if any)
- The worker could reason more directly about which parts were affected by param changes.

### Verification Steps
- Review restored `GE - Phase 6` detail in the phase log.
- Confirm the drafted summary matches the compiled title and recovered routing/signature work.

<!-- ============================================================ -->
## Reconstructed
## [021] [Conv 9] (DR - Phase 3 - Param Ownership / Routing v20)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored `/20/` restart planning.
- Preserved the new canonical param-ownership direction.
- Preserved the engine-first roadmap ordering.

### Summary of Implementation
- Applied modern param ownership and changed-id routing to the `/20/` direction.
- Strengthened the bridge between param namespaces, affected-part routing, and future selective recompute.
- Reduced flat global rebuild thinking in favor of controlled routing.

### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`

### Behavior Changes (if any)
- Param changes became more explicitly tied to part-owned routing behavior.

### Verification Steps
- Review the compiled row `[021]` and the phase log entry for `DR - Phase 3`.
- Confirm the draft stays aligned with the earlier `PT` param-ownership phases.

<!-- ============================================================ -->
## Reconstructed
## [020] [Conv 9] (SP - Phase 2 - Spaghetti Editor S2 - Compute / Evaluate / Compile Skeleton)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored Spaghetti phase mapping.
- Preserved the existing app/worker/viewer split.
- Kept Spaghetti as a graph-authoring layer rather than a second runtime.

### Summary of Implementation
- Added the first compute/evaluate skeleton for the graph system.
- Introduced compile-shape thinking into the Spaghetti layer.
- Prepared the graph to produce deterministic build-facing data.

### Files Changed
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`

### Behavior Changes (if any)
- Spaghetti became capable of producing meaningful compile-oriented graph output.

### Verification Steps
- Review compiled row `[020]` and the phase log entry for `SP - Phase 2`.
- Confirm the draft fits between `SP - Phase 1` store/schema work and `SP - Phase 3` compile-to-build integration.

<!-- ============================================================ -->
## Reconstructed
## [019] [Conv 9] (SP - Phase 1 - Spaghetti Editor S1 - Schema / Validation / Store)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on compiled history and conversation-9 reconstruction.
- Preserved the main app/worker/viewer separation.
- Added graph ownership without changing product truth outside the new graph system.

### Summary of Implementation
- Landed the first serious Spaghetti graph schema and registry foundation.
- Added validation and cycle-awareness around the graph model.
- Gave Spaghetti its own store foundation so it became a real subsystem.

### Files Changed
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`

### Behavior Changes (if any)
- Spaghetti became a concrete graph subsystem with real state ownership.

### Verification Steps
- Review compiled row `[019]` and the phase log entry for `SP - Phase 1`.
- Confirm the draft matches the earliest reconstructed schema/store/validation milestone.

<!-- ============================================================ -->
## Reconstructed
## [018] [Conv 9] (VM - Phase 2 - Instance-Aware Store And ViewModel Baseline)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored task mapping.
- Preserved the selector-first view-model discipline established earlier.
- Preserved the app/worker separation.

### Summary of Implementation
- Made instance-aware state and view-model shaping part of the baseline.
- Reduced single-instance assumptions across store and UI logic.
- Prepared the app for more than one owned part/view path.

### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/store/selectors.ts`
- `src/shared/partsTypes.ts`
- `src/app/panels/PartsListPanel.tsx`

### Behavior Changes (if any)
- The app could reason more cleanly about multiple part/view identities instead of a single monolithic output path.

### Verification Steps
- Review compiled row `[018]` and the phase log entry for `VM - Phase 2`.
- Confirm the draft stays consistent with later multi-part and parts-list work.

<!-- ============================================================ -->
## Reconstructed
## [017] [Conv 9] (AS - Phase 4 - Canonical Part Identity And Assembled Direction)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on compiled history and restored phase summaries.
- Preserved the Parts List and artifact-driven product direction.
- Preserved the move away from scrubber/history UI.

### Summary of Implementation
- Clarified part identity as a canonical concept instead of one loose preview blob.
- Strengthened the distinction between part outputs and the assembled output.
- Moved the product away from looser `final` wording and toward assembled identity.

### Files Changed
- `src/shared/partsTypes.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

### Behavior Changes (if any)
- The output model became easier to reason about in terms of parts versus assembled results.

### Verification Steps
- Review compiled row `[017]` and the phase log entry for `AS - Phase 4`.
- Confirm the draft fits after the early parts/artifact baseline gap.

<!-- ============================================================ -->
## Reconstructed
## [013] [Conv 8] (ADV - Phase 2 - Roadmap Ordering)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored conversation evidence.
- Planning-heavy entry that shaped later implementation order.
- Preserved the clean restart architecture assumptions.

### Summary of Implementation
- Locked routing and ownership work ahead of UI polish.
- Locked engine foundation ahead of richer parts-toolbar expansion.
- Delayed real toe replacement until the routing foundation was stable enough.
- Produced the first human-readable restart roadmap that connected the clean engine baseline to later real-toe work.

### Files Changed
- `PLANS.md`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`

### Behavior Changes (if any)
- No immediate product behavior change.
- Established the priority order that guided the next phases of the restart.

### Verification Steps
- Review restored `ADV - Phase 2` in the history task log and phase log.
- Confirm the draft reflects roadmap sequencing rather than shipped UI behavior.

<!-- ============================================================ -->
## Reconstructed
## [012] [Conv 8] (ADV - Phase 1 - Future-Ready Systems)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored conversation evidence.
- Planning-heavy entry that defined future-ready system direction.
- Preserved the canonical-state rule.

### Summary of Implementation
- Identified undo/redo as canonical-state history rather than mesh history.
- Identified shareable URLs/codes as canonical-state serialization features.
- Kept delta-style performance as a future goal while using full snapshots plus caching as the safer baseline.
- Preserved these systems as future-ready architecture without forcing them into the first clean restart phase.

### Files Changed
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`
- `src/shared/canonicalLayout.ts`
- `src/worker/pipeline/signatures.ts`

### Behavior Changes (if any)
- No immediate product behavior change.
- Established the correct ownership model for future undo/share/performance systems.

### Verification Steps
- Review restored `ADV - Phase 1` detail in the history task log and phase log.
- Confirm the draft reads as a future-system direction lock, not a shipped feature drop.

<!-- ============================================================ -->
## Reconstructed
## [011] [Conv 8] (EX - Phase 1 - Future Export Shape)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved worker ownership of export.
- Preserved deterministic assembled/canonical state as the export source.

### Summary of Implementation
- Kept export as a worker-side concern instead of a viewer or UI convenience.
- Based future export on deterministic assembled/canonical state.
- Preserved export as part of the engine pipeline direction.
- Avoided tying export behavior to ad hoc UI or camera/view state.

### Files Changed
- `src/worker/pipeline/exportService.ts`
- `src/shared/buildTypes.ts`
- `src/shared/exportTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/io/download.ts`

### Behavior Changes (if any)
- No broad export feature landed yet, but the ownership boundary was locked correctly.

### Verification Steps
- Review restored `EX - Phase 1` detail in the history task log and phase log.
- Confirm the draft reflects export direction rather than a full export feature rollout.

<!-- ============================================================ -->
## Reconstructed
## [010] [Conv 8] (VR - Phase 1 - Viewer Ownership)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the rule that viewer-only controls remain rebuild-free.
- Preserved the app/worker/viewer boundary.

### Summary of Implementation
- Locked viewer-only controls as rebuild-free concerns.
- Kept camera, materials, and visibility as presentation behavior rather than CAD behavior.
- Preserved a clean viewer boundary for future workbench systems.
- Kept the worker focused on geometry and export artifacts instead of presentation state.

### Files Changed
- `src/viewer/Viewer.ts`
- `src/viewer/scene/SceneManager.ts`
- `src/app/viewerBridge.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/viewer/gizmo/`
- `src/viewer/controlViz/`

### Behavior Changes (if any)
- Viewer controls and presentation ownership were kept out of the geometry execution path.

### Verification Steps
- Review restored `VR - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft matches the rebuild-free viewer rule.

<!-- ============================================================ -->
## Reconstructed
## [009] [Conv 8] (VM - Phase 1 - Selector Discipline)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved Zustand state ownership.
- Preserved the clean app/worker separation.

### Summary of Implementation
- Treated selectors as architecture, not late optimization.
- Used selectors to keep high-frequency UI surfaces subscribed only to the slices they need.
- Established source-state versus read-model discipline early.
- Prevented whole-store subscriptions from becoming the default pattern for the restart UI.

### Files Changed
- `src/app/store/selectors.ts`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/panels/BuildStatusPanel.tsx`

### Behavior Changes (if any)
- UI rerender boundaries became more explicit and scalable.

### Verification Steps
- Review restored `VM - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft reflects selector discipline rather than a late cleanup pass.

<!-- ============================================================ -->
## Reconstructed
## [008] [Conv 8] (JK - Phase 1 - Mode Structure)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved Profile Editor as the main geometry truth.
- Avoided creating a separate Jake geometry truth.

### Summary of Implementation
- Kept `profileEditor` as the primary geometry-authoring mode.
- Defined Jake Mode as a simplified wrapper over the main system.
- Reserved Jake as a real product layer instead of a vague later add-on.
- Kept Jake visible in the clean-slate repo structure so it would not become a bolted-on afterthought.

### Files Changed
- `src/app/jakeMode/JakeControls.tsx`
- `src/app/jakeMode/jakeConstraints.ts`
- `src/app/jakeMode/jakeAdapter.ts`
- `src/app/profileEditor/ProfileControls.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/productSchema.ts`

### Behavior Changes (if any)
- The mode model became clearer: advanced authoring in the main editor, simplified control in Jake.

### Verification Steps
- Review restored `JK - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with the later Jake-mode vision.

<!-- ============================================================ -->
## Reconstructed
## [007] [Conv 8] (PT - Phase 2 - Param Ownership Direction)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the move toward part-owned params.
- Preserved routing-first sequencing.

### Summary of Implementation
- Defined the early param namespace direction around `bp_*`, `th1_*`, and `hk1_*`.
- Extended the same ownership pattern to future part instances.
- Framed param ownership as the base for scalable per-part recompute.
- Kept param identity tied to part-instance thinking instead of falling back to flat global buckets.

### Files Changed
- `src/app/store/useAppStore.ts`
- `src/shared/partRouting.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`

### Behavior Changes (if any)
- Params became more explicitly tied to part ownership rather than one flat namespace.

### Verification Steps
- Review restored `PT - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft matches the later routing and signature work.

<!-- ============================================================ -->
## Reconstructed
## [006] [Conv 8] (PT - Phase 1 - Independent Part Thinking)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the shift away from one opaque history stream.
- Preserved the move toward independently buildable parts.

### Summary of Implementation
- Reframed the restarted app around independently buildable parts.
- Treated parts as focusable, visible, and eventually independently rebuildable.
- Prepared the product for multiple future part instances instead of one monolithic output.
- Tied part-list selection to part-focused controls so the UI could stay organized around real product pieces.

### Files Changed
- `src/shared/partsTypes.ts`
- `src/shared/productSchema.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/store/useAppStore.ts`

### Behavior Changes (if any)
- The product mental model shifted from one opaque result to multiple real parts.

### Verification Steps
- Review restored `PT - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with the later parts-list and artifact phases.

<!-- ============================================================ -->
## Reconstructed
## [005] [Conv 8] (AS - Phase 2 - Deterministic Part Ordering)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the parts-list direction.
- Preserved stable deterministic ordering rules.

### Summary of Implementation
- Locked base parts first as the default visible ordering.
- Inserted future toe instances after the base parts in deterministic sequence.
- Treated visible part order as a stable product rule rather than arbitrary UI sorting.
- Locked later parts to declared pipeline/build order instead of ad hoc UI order.

### Files Changed
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

### Behavior Changes (if any)
- Part ordering became a deterministic product rule tied to the pipeline, not just display preference.

### Verification Steps
- Review restored `AS - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft stays aligned with later assembly and artifact identity work.

<!-- ============================================================ -->
## Reconstructed
## [004] [Conv 8] (AS - Phase 1 - Parts List Replacement)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the move away from history scrubber UI.
- Preserved artifact-driven inspection as the main direction.

### Summary of Implementation
- Removed the history scrubber direction from the restart baseline.
- Replaced it with a Parts List model.
- Made part selection focus relevant controls instead of scrubbing through time.
- Treated future history support as optional later work layered on top of artifacts instead of the base UI.

### Files Changed
- `src/app/panels/PartsListPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`

### Behavior Changes (if any)
- The product moved from time-travel UI toward part-driven inspection.

### Verification Steps
- Review restored `AS - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft stays consistent with the later deterministic ordering and assembled-direction work.

<!-- ============================================================ -->
## Reconstructed
## [003] [Conv 8] (GE - Phase 3 - Engine Roadmap Foundation)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the clean restart architecture.
- Preserved the routing-first direction for post-restart work.

### Summary of Implementation
- Made param ownership and routing the first real engine milestone after the clean restart.
- Defined deterministic per-part signatures as the basis for selective recompute and artifact stability.
- Ordered the roadmap as routing first, selective recompute second, and real geometry later.
- Added changed-param thinking so the worker could eventually reason about affected parts without guessing from raw UI churn.

### Files Changed
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/signatures.ts`

### Behavior Changes (if any)
- The engine roadmap stopped being UI-first and became routing-first.

### Verification Steps
- Review restored `GE - Phase 3` in the history task log and the canonical phase log.
- Confirm the draft fits between the clean restart and the later worker routing work.

<!-- ============================================================ -->
## Reconstructed
## [002] [Conv 8] (GE - Phase 2 - Runtime And Rebuild Rules)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart history.
- Preserved the one warm worker rule.
- Preserved the clean app -> worker -> viewer separation.

### Summary of Implementation
- Locked one warm worker as the restart invariant.
- Used latest-only scheduling so rapid control churn collapses into the newest valid build request.
- Dropped stale worker results and separated render-only changes from geometry-affecting changes.
- Kept worker communication on shared protocol/schema boundaries instead of app-to-runtime reach-in.

### Files Changed
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/intentClassifier.ts`
- `src/app/protocol.ts`
- `src/worker/worker.ts`
- `src/worker/scheduler.ts`
- `src/worker/validation.ts`
- `src/shared/buildTypes.ts`
- `src/shared/productSchema.ts`

### Behavior Changes (if any)
- The runtime gained clearer rebuild rules and a safer worker scheduling model.

### Verification Steps
- Review restored `GE - Phase 2` in the history task log and the canonical phase log.
- Confirm the draft reflects the warm-worker, latest-only, stale-drop, and render-vs-geometry split.

<!-- ============================================================ -->
## Reconstructed
## [001] [Conv 8] (GE - Phase 1 - Clean Restart Architecture)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered history entry based on restored restart conversation evidence.
- Preserved the clean app -> worker -> viewer architecture as the foundation.
- Preserved the rule that UI captures intent, worker executes CAD, and viewer renders results.

### Summary of Implementation
- Initialized the new `/20/parahook` stack with Vite, React, TypeScript, Three.js, Zustand, and Zod.
- Created the clean-slate source layout for `app`, `viewer`, `worker`, `geometry`, `runtime`, `shared`, and `tests`.
- Built the first warm-worker and viewer skeletons and confirmed the clean restart compiled.
- Established the first hard import and ownership boundaries between app, viewer, worker, and geometry before real CAD work started.

### Files Changed
- `src/index.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/selectors.ts`
- `src/app/buildDispatcher.ts`
- `src/app/protocol.ts`
- `src/app/profileEditor/ProfileControls.tsx`
- `src/app/jakeMode/JakeControls.tsx`
- `src/app/panels/PartsListPanel.tsx`
- `src/app/panels/BuildStatusPanel.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/SceneManager.ts`
- `src/viewer/renderers/MeshRenderer.ts`
- `src/worker/worker.ts`
- `src/worker/scheduler.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/exportService.ts`
- `src/shared/productSchema.ts`
- `src/shared/buildTypes.ts`
- `src/shared/partsTypes.ts`
- `src/shared/constants.ts`

### Behavior Changes (if any)
- Established the clean `/20/` restart architecture and baseline runtime bring-up.

### Verification Steps
- Review restored `GE - Phase 1` in the history task log and the canonical phase log.
- Confirm the draft reflects the original restart architecture, repo layout, worker skeleton, and viewer skeleton.

### Recovered Gap Entry Shapes

<!-- ============================================================ -->
## Reconstructed Gap
## [025] [Gap] (First Landed Graph / Feature Stack / Expose Fields Implementation Wave)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered bridge entry with incomplete evidence.
- Preserved the distinction between recovered completed entries and inferred bridge entries.

### Summary of Implementation
- Likely captured the first landed implementation wave that turned earlier graph, Feature Stack, and expose-fields planning into real shipped work.
- Likely bridged the restored conversation-era systems into the first visible shipped changelog band.
- Likely established enough product/runtime continuity for the later shipped entries to appear as already-standing work.

### Files Changed
- exact file set unknown
- likely touched early Spaghetti, Feature Stack, driver, and build-integration files

### Behavior Changes (if any)
- Likely marked the real transition from restored planning/history into the first shipped modern graph wave.

### Verification Steps
- Review compiled gap row `[025]`.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
## Reconstructed Gap
## [024] [Gap] (Restored History To First Shipped Changelog Handoff)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered bridge entry with incomplete evidence.
- Preserved the distinction between recovered completed entries and inferred bridge entries.

### Summary of Implementation
- Likely captured the handoff from the restored conversation-derived restart work into the first shipped changelog era.
- Likely stabilized enough app/store/panel/runtime behavior for the shipped changelog band to begin.

### Files Changed
- exact file set unknown
- likely touched the app shell, store wiring, and early modern graph/runtime surfaces

### Behavior Changes (if any)
- Likely marks a continuity handoff more than one single isolated feature.

### Verification Steps
- Review compiled gap row `[024]`.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
## Reconstructed Gap
## [016] [Gap] (AS - Phase 3 - First Parts / Artifact Baseline)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the existing parts-list and artifact-driven product direction.

### Summary of Implementation
- Likely defined the first stable part/artifact identity layer between the restart and later assembled-direction work.
- Likely turned the product from one preview mesh into named output parts.
- Likely gave later part-order and assembled work a concrete baseline to build on.

### Files Changed
- exact file set unknown
- likely touched `src/shared/partsTypes.ts`
- likely touched `src/shared/buildTypes.ts`
- likely touched `src/worker/pipeline/artifactEmitter.ts`

### Behavior Changes (if any)
- Likely gave the early restart a clearer part/artifact identity model.

### Verification Steps
- Review compiled gap row `[016]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
## Reconstructed Gap
## [015] [Gap] (GE - Phase 5 - First Running Box Vertical Slice)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the clean app -> worker -> viewer architecture.
- Preserved the one warm worker rule.

### Summary of Implementation
- Likely added the first `width / length / height` controls.
- Likely proved the first real end-to-end box slice through app, worker, and viewer.
- Likely hardened the first dispatcher/latest-only rebuild loop around a running vertical slice.

### Files Changed
- exact file set unknown
- likely touched `src/app/buildDispatcher.ts`
- likely touched `src/app/store/useAppStore.ts`
- likely touched `src/worker/worker.ts`
- likely touched `src/viewer/Viewer.ts`

### Behavior Changes (if any)
- Likely turned the clean restart from a structural skeleton into a live vertical slice.

### Verification Steps
- Review compiled gap row `[015]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

<!-- ============================================================ -->
## Reconstructed Gap
## [014] [Gap] (GE - Phase 4 - First Repo Setup Execution)
<!-- ============================================================ -->
### Scope / Constraints Honored
- Recovered gap note with incomplete evidence.
- Preserved the clean restart architecture direction.
- Preserved the early `/20/` repo setup assumptions.

### Summary of Implementation
- Likely ran the clean restart Codex setup prompt against the real `/20/parahook` repo.
- Likely created the actual folder structure and starter app/viewer/worker/shared files.
- Likely verified the first executable repo baseline before the box vertical slice.

### Files Changed
- exact file set unknown
- likely touched the initial repo bootstrap files under `src/`
- likely touched `package.json`, `vite.config.ts`, and `tsconfig*.json`

### Behavior Changes (if any)
- Likely marks the first real execution step of the `/20/` clean restart.

### Verification Steps
- Review compiled gap row `[014]` and the gap-phase note in the canonical phase log.
- Treat this entry as explicitly inferred until stronger evidence is recovered.

### Shipped Entry Renumber After Merge

After recovered entries `[001]-[025]` are inserted:
- old shipped `[001]` becomes new `[026]`
- old shipped `[002]` becomes new `[027]`
- old shipped `[003]` becomes new `[028]`
- old shipped `[103]` becomes new `[128]`

The shipped body text should stay as intact as possible during this renumber pass.

# 00 Phase Setup

## Doc Header

### Doc History
27. 2026-03-11 12:23: Updated the future `AS`, `VR`, and `GE` ladder entries so the canonical phase setup now matches the newer roadmap carry-forward naming for Browser-facing output structure, project-content inspection/build-control work, richer viewer/browser controls, and the fuller `GE - Phase 12` ownership direction
26. 2026-03-08 00:00: Added the short ownership labels back to the `Future Legacy Updates` reminder list so the compact existing-prefix guidance still says what `VR`, `DBG`, `DOC`, and `LEG` actually mean
25. 2026-03-08 00:00: Pruned the `Future Legacy Updates` candidate list so only the wish-area prefixes that still seem meaningfully distinct remain, while the viewer, inspection, and workbench candidates that fit existing canonical families were removed
24. 2026-03-08 00:00: Simplified the `Future Legacy Updates` section into the same compact prefix-list style as the canonical prefix blocks so future candidates now scan faster without the longer explanatory sub-bullets
23. 2026-03-08 00:00: Added a `Future Legacy Updates` section under the meta/docs prefix area so likely future prefix candidates from `docs/Human-Plans/Wish-Features/00 - legacy-Wishes.md` now have a tracked holding area without being treated as active canonical families yet
22. 2026-03-08 00:00: Trimmed this file back toward a rules-and-registry doc by removing stale workflow sections, duplicated prefix summaries, and the long researched-history interpretation blocks that had started cluttering the active setup file
21. 2026-03-08 00:00: Added the canonical `LEG` family to this setup doc so the active phase system now explicitly includes the reusable legacy-removal planning prefix alongside the existing product and docs/meta families
20. 2026-03-08 00:00: Updated the phase-specific checklist interpretation so it matches the repo-wide marker change where `L` now means legacy feature to remove and `R` means removed
19. 2026-03-08 00:00: Added the canonical reconstructed-title rule for family phase-plan files, so confirmed reconstructed phases now explicitly use the `- Reconstructed` title suffix while gap/provisional rows stay labeled by status rather than pretending to be confirmed reconstructions
18. 2026-03-08 00:00: Added a family-file header note rule so each `Phase-Plans.md` file can include a short fold-mode explanation for later readers, using the current `Ctrl+2 / Ctrl+3 / Ctrl+4` navigation labels
17. 2026-03-08 00:00: Tightened the `Family Phase-Plan Format Rule` so the header description now explicitly matches the live two-step header pattern: `### Fold Hack 3`, `#### Fold Hack 4`, and the real housekeeping sections at `#####`
16. 2026-03-08 00:00: Updated the `Family Phase-Plan Format Rule` again so it now matches the settled `GE` layout exactly, including the overview-only in-phase fold hack and the direct-open checklist level
15. 2026-03-08 00:00: Rewrote the `Family Phase-Plan Format Rule` so it now documents the exact flatter format currently used in `DOC - Phase-Plans.md`, with phase titles at `##`, `Overview` / `CheckList` at `###`, and the lighter header fold-hack kept at the top
14. 2026-03-08 00:00: Moved the repo-wide checklist marker/structure standard into `docs/Doc-Index.md` and reduced this file's checklist rule to a phase-specific reference block
13. 2026-03-08 00:00: Updated the canonical docs/meta prefix references in this file from `OO` to `DOC`, including the family-file example, prefix list, compact checklist block, and researched family section
12. 2026-03-07 17:38: Added a canonical checklist status-marker rule so family phase-plan docs and compact phase checklists use the same marker meanings
11. 2026-03-07 17:27: Added a canonical family phase-plan formatting rule so prefix docs like `DOC - Phase-Plans.md` can be built with a consistent fold-friendly structure
10. 2026-03-07 14:05: Updated this file to the new `docs/Phase-Plans/` workflow so setup/log docs stay separate from phase-plan lifecycle folders `Future`, `Tasks`, and `Old`
9. 2026-03-07 13:18: Re-structured this file to match the `Doc-Index.md` doc rules with `Doc Header` and `Doc Body`, and fixed stale phase-plan path references in the top guidance
8. 2026-03-07 10:51: Added a future phase-file setup rule that requires phase planning docs in `docs/Phases/Future/` to use a parent-checklist-plus-subchecklist shape for the top execution checklist
7. 2026-03-07 10:44: Aligned `DOC - Phase 13` to the first formal phase-loop planning file so the future checklist now points at `Canonical Changelog Rewrite`
6. 2026-03-07 01:40: Tightened the top guidance so this file now explicitly reads as the canonical phase system doc for prefix ownership plus the compact past-and-future phase checklist
5. 2026-03-07 01:34: Folded the compact canonical completed-and-future phase checklist into this setup doc near the top so the active prefixes, rules, and current phase inventory can be read in one place
4. 2026-03-06 21:39: Re-centered this file on the canonical active prefix system only, so legacy prefix conversion now belongs in `/History/` notes instead of the active phase-setup source
3. 2026-03-06 21:30: Expanded this file so it now covers the full prefix system used across both `docs/CHANGELOG.md` and `docs/Change-List-COMPILED.md`, including the canonical `DOC` meta/docs prefix and explicit interpretation rules for canonical, historical, and meta phase families
2. 2026-03-06 20:20: Promoted this file to the single canonical phase-setup source and updated the title and usage text to match the new consolidation rule
1. 2026-03-06 20:03: Rebuilt this file as the history-aware phase map so it now reflects the researched phase families, historical prefix mapping, known gaps, and the relationship between restored conversations and the shipped changelog

### Purpose

This file is the canonical phase system document.

Use this file for:
- the canonical phase prefixes and ownership rules
- the full prefix system used by `docs/CHANGELOG.md` and `docs/Change-List-COMPILED.md`
- the active canonical phase families
- the compact past-and-future canonical phase checklist
- deciding which canonical prefix new or converted work should use
- deciding whether a new idea fits an existing phase family or needs a new future phase

Do not use this file for:
- detailed completed-work proof
- long-form accomplishment checklists
- detailed legacy-prefix conversion notes
- raw historical reconstruction notes

### Family Phase-Plan Format Rule

For family-level prefix docs such as:
- `docs/Phase-Plans/DOC - Phase-Plans.md`
- `docs/Phase-Plans/GE - Phase-Plans.md`
- `docs/Phase-Plans/VM - Phase-Plans.md`

use this fold-friendly structure:

- `# File Title`
- `## Doc Header`
- inside `## Doc Header`, use the two-step header fold pattern:
  - `### Fold Hack 3`
  - `#### Fold Hack 4`
- keep the real housekeeping sections under that header pattern at `#####`, such as:
  - `Doc History`
  - `Purpose`
  - `What <PREFIX> Means`
  - `Format And Depth`
  - `Fold Mode Guide`
- the `Fold Mode Guide` section should be a short reader-facing note near the top of each family file, explaining the quick-fold system in plain language, such as:
  - `Ctrl+2 : List mode`
  - `Ctrl+3 : Human summary`
  - `Ctrl+4 : Checklist`
- after the header area, place each canonical phase directly at `##` in this form:
  - `## [status] - PREFIX - Phase N - `Phase Name``
- if a phase is confirmed reconstructed history rather than direct changelog-backed history, add `- Reconstructed` at the end of the phase title
- do not add the `- Reconstructed` suffix to explicit gap blocks or merely provisional rows unless the phase itself is being presented as a real reconstructed completed phase
- place one plain `Human Summary:` line directly under each phase heading
- use `###` for the main phase buckets:
  - `Phase N Overview`
  - `Phase N CheckList`
- under `### Phase N Overview`, use one overview-only fold wrapper at `####`, such as:
  - `Fold Hack 4`
- place the overview detail under that wrapper at `#####`, such as:
  - `Phase Notes`
  - `Phase Summary`
  - `Phase Sub-Phases`
  - `Phase Plan`
  - `Estimated Worked On Files`
  - `Estimated Added Files`
- under `### Phase N CheckList`, do not add the extra fold wrapper
- let the main checklist open directly under `### Phase N CheckList`
- use deeper sub-headings inside the checklist section only when a phase truly needs them
- use `#####` or deeper only for internal sub-phase/detail blocks when needed, such as:
  - `Phase 13A`
  - `Phase 14A`

Header-depth note:
- the extra depth inside `## Doc Header` is a folding tool, not part of the canonical phase hierarchy
- keep the header hack limited to `Fold Hack 3` and `Fold Hack 4` so real phase content does not run out of heading depth
- keep the real housekeeping content itself at `#####`

Checklist rule for family phase docs:
- each phase should have one visible master checklist block at the `### Phase N CheckList` level
- keep the main checklist directly visible under that `###` heading by default
- use the overview-side fold hack to hide notes, file-footprint sections, summaries, and similar context without hiding the actual checklist
- if a phase needs to act as the main working/history surface, it may include grouped high-detail checklist buckets directly under the checklist section
- if a phase is large and needs internal sub-phase breakdown, keep the main checklist readable and put deeper explanation/history below in deeper headings only when needed
- if a sub-phase is still active, unchecked task lines may stay directly visible under that deeper sub-phase section for easier folding/scan behavior

Folding intent:
- `Ctrl+2` = `Doc Header` plus the phase list
- `Ctrl+3` = phase headers plus `Overview` / `CheckList`
- `Ctrl+4` = overview fold wrapper plus directly visible checklist content
- `Ctrl+5` = notes, summaries, file-footprint sections, and deeper internal sub-phase/detail blocks
- in the header area, the real housekeeping sections should sit under the `Fold Hack 3` / `Fold Hack 4` pair rather than directly under `## Doc Header`
- the header should also be the home for the short fold-mode explanation so later readers can understand the intended quick-fold workflow without opening the setup doc first

### Phase CheckList Rule

Use the repo-wide checklist marker meanings from:
- `docs/Doc-Index.md`
  - `#### Global CheckList Rule`

Phase-specific application:
- compact phase setup checklists should use the shared repo-wide checklist markers
- family phase-plan docs should use the same shared markers for phase headers and major checklist items
- gap rows and uncertain reconstructed phases may use `[?]` when completion is suspected but not fully evidenced
- confirmed reconstructed family phases should keep the reconstructed provenance visible in the heading with the `- Reconstructed` suffix
- `[L]` may be used inside family checklists when a still-present legacy feature or compatibility seam should probably be removed later
- `[R]` may be used when a feature, seam, or old path has already been removed and the checklist should preserve that removal history explicitly

## Doc Body

### Master Prefix List

This is the complete active prefix list currently needed to describe the repo logs across:
- `docs/CHANGELOG.md`
- `docs/Change-List-COMPILED.md`
- converted pre-changelog history

### Canonical Product / Architecture Prefixes

1. `GE` Core foundation
2. `VM` State-to-UI layer
3. `NI` Editor interaction layer
4. `FS` Feature execution layer
5. `PT` Part structure layer
6. `DR` Control/value layer
7. `AS` Preview assembly layer
8. `VR` Viewer layer
9. `DBG` Inspection layer
10. `JK` Simplified product layer
11. `SP` Spaghetti system layer
12. `EX` Output/export layer
13. `ADV` Future systems layer

### Canonical Meta / Docs Prefixe

14. `DOC` Operations / docs meta
15. `LEG` Legacy removal / retirement planning

### Future Legacy Updates

These are not active canonical prefixes yet.

These are future candidates pulled from:
- `docs/Human-Plans/Wish-Features/00 - legacy-Wishes.md`

Prefer existing canonical prefixes first:
- `VR` Viewer layer
- `DBG` Inspection layer
- `DOC` Operations / docs meta
- `LEG` Legacy removal / retirement planning

Only promote one of these if the work grows large enough to justify its own real family:

1. `REF` Reference workspace / comparison environment

Current total prefix count across all repo history coverage:
- `15`

### Phase Setup CheckList

This is the active compact checklist view for canonical phases.

Use it for:
- fast scan of completed phases
- fast scan of planned future phases
- quick lookup of the active phase ladder inside each prefix

Legend:
- `[x]` completed and evidenced in merged history
- `[~]` completed but legacy or drift-prone
- `[ ]` planned future canonical phase
- `[?]` suspected completed phase with incomplete evidence

Checklist rules:
- prefer one line per canonical phase number
- keep completed and future phases in the same prefix block
- use `## Gaps` for speculative bridge/history rows that do not belong in the active future roadmap

### `GE` - Core foundation
- [x] `GE - Phase 1 - Clean Restart Architecture`
- [x] `GE - Phase 2 - Runtime And Rebuild Rules`
- [x] `GE - Phase 3 - Engine Roadmap Foundation`
- [?] `GE - Phase 4 - First Repo Setup Execution`
- [?] `GE - Phase 5 - First Running Box Vertical Slice`
- [x] `GE - Phase 6 - Worker Affected-Part Routing And Cache Preference`
- [x] `GE - Phase 7 - Early Modern Baseline`
- [x] `GE - Phase 8 - Runtime Bridge Hardening`
- [x] `GE - Phase 9 - Graph Command Kernel`
- [x] `GE - Phase 10 - Contract Lock - Resolver Validator Canvas Parity`
- [ ] `GE - Phase 11 - Graph Persistence And Save Load`
- [ ] `GE - Phase 12 - Multi-Document Graph Ownership`

### `VM` - State-to-UI layer
- [x] `VM - Phase 1 - Selector Discipline`
- [x] `VM - Phase 2 - Instance-Aware Store And ViewModel Baseline`
- [x] `VM - Phase 3 - UI Stabilization - Composite Map State + Output Leaf Rendering`
- [x] `VM - Phase 4 - Derived View Model Selectors`
- [x] `VM - Phase 5 - Selector Contract Hardening`
- [ ] `VM - Phase 6 - Source And Derived ViewModel Split`
- [ ] `VM - Phase 7 - Utility And Driver ReadModel Expansion`

### `NI` - Editor interaction layer
- [~] `NI - Phase 3 - Baseplate And Node Surface UI`
- [x] `NI - Phase 4 - Node UI And Wire Layout Pass`
- [x] `NI - Phase 5 - Modern Node Interaction Cleanup`
- [ ] `NI - Phase 6 - Node UI Rendering Cleanup And Consistency`
- [ ] `NI - Phase 7 - Wires UI And Wire Interaction Overhaul`
- [ ] `NI - Phase 8 - Wire Validation Feedback And Render-Path Visuals`

### `FS` - Feature execution layer
- [?] `FS - Phase 1 - First Landed Feature Stack v1`
- [x] `FS - Phase 9 - Feature Stack v1 App-Layer Alignment`
- [x] `FS - Phase 10 - Feature Stack v1 Worker Pipeline - Option-B Runtime Execution`
- [x] `FS - Phase 11 - Feature Stack v1 Debug Preview - App-Layer IR-Driven UI`
- [x] `FS - Phase 12 - First Renderable Part Through Existing Part Pipeline`
- [x] `FS - Phase 13 - Feature Stack Solid Contract Lock`
- [x] `FS - Phase 14 - Feature Stack Expansion And Dependency Visualization`
- [x] `FS - Phase 15 - Multi-Part Feature Stack Support`
- [ ] `FS - Phase 16 - Feature Diagnostics And Dependency Surfacing`
- [ ] `FS - Phase 17 - Feature Parameter Exposure And Promotion Rules`
- [ ] `FS - Phase 18 - Feature Expansion Beyond Sketch And Extrude`

### `PT` - Part structure layer
- [x] `PT - Phase 1 - Independent Part Thinking`
- [x] `PT - Phase 2 - Param Ownership Direction`
- [x] `PT - Phase 5 - Part Template Population`
- [x] `PT - Phase 6 - Part Container Contract`
- [ ] `PT - Phase 7 - Baseplate Hardening Presets And Metadata`
- [ ] `PT - Phase 8 - ToeHook Hardening And Production Controls`
- [ ] `PT - Phase 9 - HeelKick Hardening And Production Controls`
- [ ] `PT - Phase 10 - Baseplate Geometry v0`

### `DR` - Control/value layer
- [x] `DR - Phase 3 - Param Ownership / Routing v20`
- [x] `DR - Phase 7 - Expose Fields And View Modes`
- [x] `DR - Phase 8 - Virtual Feature Wiring Expansion`
- [x] `DR - Phase 9 - Canonical Driver ID Contract`
- [x] `DR - Phase 10 - Driven Numeric Driver Offset Mode`
- [x] `DR - Phase 11 - Driver Diagnostics And Invalid Wiring Visualization`
- [x] `DR - Phase 12 - Param And Input Node Foundation`
- [ ] `DR - Phase 13 - Canonical Driver Node Contract`
- [ ] `DR - Phase 14 - Input And Parameter Node System Completion`
- [ ] `DR - Phase 15 - Pin To Input And Promoted Parameter System`
- [ ] `DR - Phase 16 - User Facing Versus Internal Driver Metadata`

### `AS` - Preview assembly layer
- [x] `AS - Phase 1 - Parts List Replacement`
- [x] `AS - Phase 2 - Deterministic Part Ordering`
- [?] `AS - Phase 3 - First Parts / Artifact Baseline`
- [x] `AS - Phase 4 - Canonical Part Identity And Assembled Direction`
- [ ] `AS - Phase 5 - Browser-Facing Graph Output Structure`
- [ ] `AS - Phase 6 - Project Content Inspection And Build Control Surface`

### `VR` - Viewer layer
- [x] `VR - Phase 1 - Viewer Ownership`
- [ ] `VR - Phase 2 - Gizmo Parity Return`
- [ ] `VR - Phase 3 - Scenes Return`
- [ ] `VR - Phase 4 - Radio Sampler Return`
- [ ] `VR - Phase 5 - Reference Asset Workspace And Project View Layers`
- [ ] `VR - Phase 6 - Browser Controls, Materials, And Rich Visibility`

### `DBG` - Inspection layer
- [x] `DBG - Phase 1 - Debug Inspector Foundation`
- [ ] `DBG - Phase 2 - Graph And Node State Inspector`
- [ ] `DBG - Phase 3 - Feature Stack Inspector`
- [ ] `DBG - Phase 4 - Resolver And Validation Inspector`
- [ ] `DBG - Phase 5 - Graph Wiring Inspector`

### `JK` - Simplified product layer
- [x] `JK - Phase 1 - Mode Structure`
- [ ] `JK - Phase 2 - Jake Mode Shell And App Level Mode Switching`
- [ ] `JK - Phase 3 - Driver Backed Jake Controls`
- [ ] `JK - Phase 4 - Control Viz Spheres`
- [ ] `JK - Phase 5 - Plane Constrained Handle Motion`
- [ ] `JK - Phase 6 - Vec2 Endpoint Style Controls`
- [ ] `JK - Phase 7 - Grouped Controls And Simplified Panels`
- [ ] `JK - Phase 8 - Jake Mode Polish`

### `SP` - Spaghetti system layer
- [x] `SP - Phase 1 - Spaghetti Editor S1 - Schema / Validation / Store`
- [x] `SP - Phase 2 - Spaghetti Editor S2 - Compute / Evaluate / Compile Skeleton`
- [x] `SP - Phase 3 - Spaghetti Editor S3 - Compile To Build Integration`
- [x] `SP - Phase 4 - Floating Window Follow-up - Default Geometry + Drag`
- [x] `SP - Phase 5 - Spaghetti Window And Layout Foundations`
- [x] `SP - Phase 6 - Resizable Debug Inspector Drawer`
- [x] `SP - Phase 7 - Spaghetti Editor Window Update Phase Plan`
- [ ] `SP - Phase 8 - Spaghetti Editor Toolbar Redesign`
- [ ] `SP - Phase 9 - Graph Document Foundations`
- [ ] `SP - Phase 10 - Graph Aware Worker And Preview Routing`
- [ ] `SP - Phase 11 - Graphs Panel And Nested Parts`
- [ ] `SP - Phase 12 - Shared Viewport Composition`
- [ ] `SP - Phase 13 - Multi Window Graph Editing`
- [ ] `SP - Phase 14 - Multi Graph Debug And Polish`

### `EX` - Output/export layer
- [x] `EX - Phase 1 - Future Export Shape`
- [ ] `EX - Phase 2 - STL Export`
- [ ] `EX - Phase 3 - STEP Export`
- [ ] `EX - Phase 4 - Profile Export`
- [ ] `EX - Phase 5 - Manufacturing Metadata Export`

### `ADV` - Future systems layer
- [x] `ADV - Phase 1 - Future-Ready Systems`
- [x] `ADV - Phase 2 - Roadmap Ordering`
- [ ] `ADV - Phase 3 - Typed Graph Objects`
- [ ] `ADV - Phase 4 - Product Family Registration`
- [ ] `ADV - Phase 5 - Platform Versus Product Boundaries`

### `DOC` - Operations / docs meta
- [x] `DOC - Phase 2 - Node Tasking And Checklist Support`
- [x] `DOC - Phase 3 - Roadmap Reorganization`
- [x] `DOC - Phase 4 - Roadmap Restore`
- [x] `DOC - Phase 5 - Docs Policy Cleanup`
- [x] `DOC - Phase 6 - Docs Task And Phase Setup`
- [x] `DOC - Phase 7 - Docs Policy Cleanup - Remove TASKLIST Requirement`
- [x] `DOC - Phase 8 - Wish Features Setup`
- [x] `DOC - Phase 9 - Chill Mode Docs Workflow`
- [x] `DOC - Phase 10 - Docs Planning Sprint`
- [ ] `DOC - Phase 11 - Formal Decision Docs`
- [ ] `DOC - Phase 12 - History Conversion Completion`
- [ ] `DOC - Phase 13 - Canonical Changelog Rewrite`

### `LEG` - Legacy removal / retirement planning
- [~] `LEG - Phase 1 - Legacy Removal Planning And Inventory`

### Checklist Gaps

- [?] `Gap - Restored History To First Shipped Changelog Handoff`
- [?] `Gap - First Landed Graph / Feature Stack / Expose Fields Implementation Wave`
- [?] `Gap - SP - Phase 4 - First Landed Spaghetti Graph UI`

# Materials Gen1 Index

## Doc Header

### Doc History
67. 2026-05-11 08:40: Recorded the selected-material text input sizing follow-up so the full-width `Name` field uses border-box sizing and stays inside the compact row padding.
66. 2026-05-11 08:38: Recorded the selected-material `Name` row width follow-up that gives the name input the full remaining row width by tightening the compact row label column.
65. 2026-05-11 08:33: Recorded the `Materials-5 / Phase 2.1` single-selection `x` follow-up that clears mirrored selected part state through the shared workspace selection clear command when the last focused object is removed.
64. 2026-05-11 08:27: Recorded `Materials-5 / Phase 2.1 - Focused Item Inclusion And Global Deselect Semantics` as shipped, with split Properties surface tests locking assignment-only unhighlighting, inactive-row `x` global removal, and active-row `x` global removal.
63. 2026-05-11 08:22: Recorded the prepared implementation read for `Materials-5 / Phase 2.1 - Focused Item Inclusion And Global Deselect Semantics`, grounding the phase in the live focused-item include/remove controls, local inclusion state, assignment-scope handoff, project-material assignment path, and needed split semantic tests.
62. 2026-05-11 08:17: Added `Materials-5 / Phase 2.1 - Focused Item Inclusion And Global Deselect Semantics` before mixed-value reads so Materials can explicitly separate assignment-only inclusion toggles from right-anchored `x` global deselect/removal behavior.
61. 2026-05-11 07:42: Strengthened the `Materials-5 / Phase 2` focused-item remove coverage so the right-anchored `x` button is proven to clear the removed active object from shared selection truth and resolved content part keys.
60. 2026-05-11 07:24: Recorded the `Materials-5 / Phase 2` focused-item inclusion follow-up that lets users unhighlight focused material objects to exclude them from batch assignment or remove them from the focused item list with a right-anchored `x`.
59. 2026-05-11 07:16: Recorded `Materials-5 / Phase 2 - Project Material Batch Assignment` as shipped, with project-material row clicks now applying through the Phase 1 multi-object assignment scope and one undoable batch material-history entry.
58. 2026-05-10 23:08: Recorded the prepared implementation read for `Materials-5 / Phase 2 - Project Material Batch Assignment`, grounding the next cut in the shipped Phase 1 `assignmentScope`, project-material row click handler, existing batch material-history helper, and focused Properties surface/history verification.
57. 2026-05-10 23:03: Recorded `Materials-5 / Phase 1 - Multi Object Target Read And Assignment Scope` as shipped, with the Properties section context now carrying selected object targets and the Materials view model exposing a non-visual multi-object assignment scope read for Phase 2.
56. 2026-05-10 22:36: Recorded the prepared implementation read for `Materials-5 / Phase 1 - Multi Object Target Read And Assignment Scope`, grounding the phase in the live Properties shell selection context, focused-object list, Materials target-row derivation, imported-reference fallback rows, and deferred batch-assignment seam.
55. 2026-05-10 21:55:15: Added `Materials-5 - Multi Object Material Assignment And Mixed Values` as the next family phase for applying project materials across multi-object selections and planning mixed-value selected-material reads.
54. 2026-05-10 21:48:04: Recorded the `Materials-4 / Phase 5` search follow-up that removes the visible `Search materials` label while keeping the accessible search input label.
53. 2026-05-10 21:46:12: Recorded the `Materials-4 / Phase 5` follow-up that adds a compact Project materials search field above the preset list.
52. 2026-05-10 21:41:50: Recorded the `Materials-4 / Phase 5` follow-up that keeps the project-material list height stable when new or duplicated material presets are added.
51. 2026-05-10 21:30:48: Recorded `Materials-4 / Phase 5 - Compact Material Action Rail` as shipped, with project-material actions moved into the project-material section and grouped assignment actions compacted.
50. 2026-05-10 21:24:42: Recorded the prepared implementation read for `Materials-4 / Phase 5 - Compact Material Action Rail`, grounding it in the live project-material section, material action cards, grouped assignment cards, and owner-routed history tests.
49. 2026-05-10 21:20:36: Recorded the `Materials-4 / Phase 4.1` default-color follow-up that changes zero-intensity default material emissive colors to white while keeping emissive intensity at zero.
48. 2026-05-10 21:15:15: Recorded the shipped `Materials-4 / Phase 4.1 - Reusable Material Color Control Template` implementation and advanced the next planning read to `Materials-4 / Phase 5 - Compact Material Action Rail`.
47. 2026-05-10 21:09:59: Recorded the prepared implementation read for `Materials-4 / Phase 4.1 - Reusable Material Color Control Template`, grounding it in the live inline base-color controls, emissive color row, HSV/RGB helpers, and selected-material history update path.
46. 2026-05-10 21:07:06: Added `Materials-4 / Phase 4.1 - Reusable Material Color Control Template` between compact selected-material controls and Phase 5 action cleanup so base color and emissive color can share one expanded color picker template.
45. 2026-05-10 21:00:47: Recorded the `Materials-4 / Phase 4` hue styling tune-up that mutes the rainbow track with theme-fit color stops, a dark overlay, and an inset track shadow.
44. 2026-05-10 20:56:30: Recorded the `Materials-4 / Phase 4` hue follow-up that adds a rainbow-track `Hue` `ParaSlider` to the expanded base-color controls while preserving the hex material color owner.
43. 2026-05-10 20:48:46: Updated the `Materials-4 / Phase 4` base-color follow-up to replace `White/Black` with HSV-style `Brightness` and add a separate `Saturation` `ParaSlider`.
42. 2026-05-10 20:43:29: Recorded the `Materials-4 / Phase 4` base-color follow-up that adds an expandable base-color row with RGB `ParaSlider` controls and a black-to-white lightness slider.
41. 2026-05-10 20:32:46: Recorded the `Materials-4 / Phase 4` styling follow-up that aligns selected-material `ParaSlider` and `ParaSelect` rows with the compact view toolbar control treatment.
40. 2026-05-10 20:27:17: Recorded `Materials-4 / Phase 4 - Inline Material Source And Compact Control Layout` as shipped, with compact selected-material controls, an inline material-source badge, and `Phase 5 - Compact Material Action Rail` now the next cleanup read.
39. 2026-05-10 20:19:31: Recorded the prepared implementation read for `Materials-4 / Phase 4 - Inline Material Source And Compact Control Layout`, grounding it in the live selected-material controls plus shared `ParaSlider` and `ParaSelect` components.
38. 2026-05-10 20:17:16: Added the Phase 5 action-placement note that `New Material` and `Duplicate Material` should move into the `Project materials` section as compact project-material actions.
37. 2026-05-10 20:10:33: Added the Phase 4 control-language note that compact selected-material controls should reuse existing `ParaSlider` and `ParaSelect` controls where they fit.
36. 2026-05-10 20:04:14: Recorded `Materials-4 / Phase 3 - Project Material Preset List` as shipped, with visible project-material rows under material targets and `Phase 4 - Inline Material Source And Compact Control Layout` now the next cleanup read.
35. 2026-05-10 19:56:36: Recorded the prepared implementation read for `Materials-4 / Phase 3 - Project Material Preset List`, grounding it in `ViewSettings['materials'].presets` and the existing history-wrapped selected-target assignment path.
34. 2026-05-10 19:49:03: Updated the `Materials-4 / Phase 3` handoff to prioritize a project material preset list under the material targets, moving inline source-badge cleanup into the later compact-control phase.
33. 2026-05-10 19:37:23: Recorded the `Materials-4 / Phase 2` list-height follow-up, making both focused-object and material-target scroll lists default to about three rows while shrinking to one or two rows for smaller selections.
32. 2026-05-10 19:33:33: Recorded the `Materials-4 / Phase 2` focused-list shell follow-up, matching the focused-object list to the material target list with dark scrolling and a bottom resize handle while keeping `Phase 3 - Inline Material Source Badge` as the next cleanup read.
31. 2026-05-10 18:02:49: Recorded `Materials-4 / Phase 2 - Focused Item List And Target Header Simplification` as shipped, with the focused-object list and cleaner material-target copy landed and `Phase 3 - Inline Material Source Badge` now the next cleanup read.
30. 2026-05-10 17:58:23: Prepped `Materials-4 / Phase 2 - Focused Item List And Target Header Simplification` as the next implementation slice, widening the phase from copy cleanup into a compact focused-object list backed by shared multi-selection state.
29. 2026-05-10 17:50:11: Recorded `Materials-4 / Phase 1 - Diagnostic And Reference-Proof Row Removal` as shipped, with the bottom diagnostic/proof rows removed and `Phase 2 - Focused Object And Target Header Simplification` now the next cleanup read.
28. 2026-05-10 17:48:01: Recorded the prepared implementation read for `Materials-4 / Phase 1 - Diagnostic And Reference-Proof Row Removal`, narrowing the next cleanup to removing the bottom `viewModel.rows` owner-seam block and `viewModel.owedFeatureGroups` reference-baseline block while preserving material editor behavior.
27. 2026-05-10 17:44:31: Added the standalone `Materials-4 - Materials Content Simplification Cleanup` future doc and turned the open-ended cleanup placeholder into five concrete phases for removing diagnostic/proof rows, simplifying focused-object and target copy, inlining material source, compacting controls, and compacting material actions.
26. 2026-05-10 17:08:15: Added `Materials-4 - Open Cleanup Follow-Through` as a reserved open-ended family phase whose exact scope should come from the next cleanup pass instead of being forced into a premature library, texture, shader, or UI lane.
25. 2026-05-10 17:03: Added the prepared `Materials-3 / Phase 4 - Next Materials Lane Routing Audit` handoff, making the next pass a documentation-first choice between material library/preset browsing, texture asset ownership, or another owner-backed shader field before runtime controls widen again.
24. 2026-05-10 16:53: Recorded the shipped `Materials-3 / Phase 3 - Hosted Field Projection And Library Handoff` pass, closing the first richer-field loop with a hosted `Double-sided` checkbox and leaving material library, texture asset, and broader shader controls as explicit follow-on planning.
23. 2026-05-10 15:49: Recorded the prepared `Materials-3 / Phase 3 - Hosted Field Projection And Library Handoff` implementation read, narrowing the next pass to one hosted `Double-sided` checkbox backed by the shipped `doubleSided` owner field plus a documentation-only library handoff.
22. 2026-05-10 15:43: Recorded the shipped `Materials-3 / Phase 2 - First Typed Richer Field Expansion` runtime pass, landing owner-backed `doubleSided` material state and advancing the active next implementation handoff to `Materials-3 / Phase 3 - Hosted Field Projection And Library Handoff`.
21. 2026-05-10 15:36:12: Recorded the shipped documentation-only `Materials-3 / Phase 1 - Richer Field Owner Audit And First Field Choice` pass, choosing `doubleSided` as the first typed richer field and advancing the active next implementation handoff to `Materials-3 / Phase 2 - First Typed Richer Field Expansion`.
20. 2026-05-10 15:28:44: Recorded the shipped `Materials-3 / Phase 0.1 - Whole Imported Object Material Target Fallback` runtime pass and advanced the active next implementation handoff to `Materials-3 / Phase 1 - Richer Field Owner Audit And First Field Choice`.
19. 2026-05-10 15:18:26: Added `Materials-3 / Phase 0.1 - Whole Imported Object Material Target Fallback` as the required follow-up for imported references with no stored part rows or terminal source part key, keeping richer-field work behind whole-import material assignment and viewer consumption.
18. 2026-05-10 15:09:02: Recorded the shipped `Materials-3 / Phase 0 - Imported Object Material Target Discovery` runtime pass and advanced the active next implementation handoff to `Materials-3 / Phase 1 - Richer Field Owner Audit And First Field Choice`.
17. 2026-05-10 15:04:34: Added `Materials-3 / Phase 0 - Imported Object Material Target Discovery` as the active next implementation phase so imported reference objects can expose real material target rows before richer-field owner audit work begins.
16. 2026-05-10 14:33:48: Recorded the older ParaHook materials-window screenshot as the canonical visual baseline in `Materials-Vision.md` and added the family routing reminder that future implementation phases should preserve its compact focused-object, target-list, material-control, action, and preset-list flow.
15. 2026-05-10 14:30:36: Added the standalone `Materials-3 - Richer Material Fields And Library Direction` future doc and advanced the Materials family routing so the next work starts with a richer-field owner audit before any new field, texture, shader, or library UI is implemented.
14. 2026-05-10 14:25:57: Recorded the shipped `Materials-2 / Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through` pass and closed the first Materials editing ladder with grouped all, odd, and even target assignment reuse plus explicit richer-field deferral.
13. 2026-05-10 14:18:59: Recorded the prepped `Materials-2 / Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through` implementation read, narrowing the next cut around grouped all, odd, and even target assignment reuse plus explicit richer-field deferral.
12. 2026-05-10 14:11:02: Recorded the shipped `Materials-2 / Phase 2 - New Material Assign And Duplicate Flows` pass and advanced the active editing handoff to `Materials-2 / Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through`.
11. 2026-05-10 14:01:18: Recorded the shipped `Materials-2 / Phase 1 - First Editable Material Property Controls` pass and advanced the active editing handoff to `Materials-2 / Phase 2 - New Material Assign And Duplicate Flows`.
10. 2026-05-10 13:48:22: Recorded the shipped `Materials-1 / Phase 3 - First Material Property Projection And Action Handoff` runtime pass, closed the `Materials-1` foundation ladder, and advanced the family handoff to `Materials-2 - First Material Editing And Action Flows`.
9. 2026-05-10 13:41:08: Tightened the active `Materials-1 / Phase 3` implementation handoff so the next pass resolves selected-target material properties from `ViewSettings['materials']`, honors per-part override and preset fallback order, and keeps `New Material`, assign, and duplicate as disabled action handoff affordances for `Materials-2`.
8. 2026-05-10 13:37:50: Recorded the shipped `Materials-1 / Phase 2 - Material-Bearing Target List Projection And Selection Flow` runtime pass and advanced the active implementation handoff to `Materials-1 / Phase 3 - First Material Property Projection And Action Handoff`.
7. 2026-05-10 13:31:45: Tightened the active `Materials-1 / Phase 2` handoff so the next implementation pass now points at explicit authored-object part keys, imported/reference stored part rows, and lane-local selected-target state without mutating top-level workspace selection.
6. 2026-05-10 13:25:24: Recorded the shipped `Materials-1 / Phase 1 - Focused Object Intake And Current Material Truth Read` runtime pass and advanced the active implementation handoff to `Materials-1 / Phase 2 - Material-Bearing Target List Projection And Selection Flow`.
5. 2026-05-10 13:15:16: Expanded the nested materials ladder by adding explicit `Phase 2` and `Phase 3` planning sections to `Materials-1`, added the new follow-on future doc `Materials-2 - First Material Editing And Action Flows`, and updated the active family read so the foundation ladder and later editing ladder now both have honest standalone homes.
4. 2026-05-10 13:05:32: Added the new standalone `Future/Materials-1 - Workspace Foundation And Material Owner Read.md` family phase doc, tightened the nested materials family so the active implementation owner is now that future doc instead of this routing index, and prepped the first runtime cut as `Phase 1 - Focused Object Intake And Current Material Truth Read`.
3. 2026-05-10 10:56:07: Updated this moved generation index so it now reads as the first nested `Materials` subfamily under `Properties`, preserving the same Generation 1 routing while aligning the family-purpose and current-planning wording to the new umbrella workspace structure.
2. 2026-05-10 10:44:20: Added `Materials-Vision.md` as the broad north-star planning home, updated this active Generation 1 index so it now points to that new vision doc for the focused-object materials workflow, and tightened the family-structure plus boundary language so the generation index stays a routing surface instead of carrying the full long-range vision alone.
1. 2026-05-10 10:28:40: Added the new active `Materials` Generation 1 planning index so the workspace family now has one dedicated home under `Workspace Modes`, with a minimal first family-phase ladder for workspace-surface foundation, owner mapping, and later material-library or assignment follow-through.

### Purpose

This file is the active `Generation 1` planning index for the nested `Materials` subfamily under the `Properties` workspace family in `Workspace Modes`.

Use it to answer:
- what the first `Materials` workspace family is trying to become
- how `Materials` should fit the hybrid workspace model
- which high-level goals belong to the first generation
- what the first `Materials` family phase should be
- how the workspace should stay downstream from real material owner systems instead of becoming a hidden second owner

Do not use it for:
- the fully locked long-range `Materials` north-star that now lives in `Materials-Vision.md`
- detailed implementation-phase specs that belong in standalone `Future/` family phase docs
- claiming a final runtime material architecture before the owner seams are read in code

### Family Structure

Use this folder like this:

- `Materials-Vision.md`
  - broad north-star product and ownership direction
- `Materials-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Future/`
  - standalone implementation-ready `Materials` family phase docs
- `Shipped/`
  - shipped records for completed `Materials` cuts

Important setup note:
- this family now has both a vision doc and a Generation 1 index
- keep the long-range focused-object materials direction in `Materials-Vision.md`
- keep this file as the active Generation 1 routing surface

## Doc Body

### Short Version

`Materials` should become a real workspace surface instead of staying only an implied later need spread across viewer, Browser, Catalog, and object-edit seams.

The first honest family read is still structural:
- give `Materials` a dedicated nested subfamily planning home inside `Properties`
- keep it compatible with the hybrid `Windowed`, `Tiled`, and later `Pop-Out` workspace model
- keep material truth outside the workspace shell itself
- prepare one first family phase that can read the real owner seams before heavier material-library, assignment, or preview behavior is planned

The first family lane is `Materials-1`.

`Materials-1` should stay small and foundational:
- identify the likely material-owner seams
- define what the first `Materials` workspace surface actually owns versus only projects
- decide the first safe workspace read for material browsing, inspection, or assignment follow-through
- stop before a broad material system is pretended into existence

### Current Planning Read

This file owns the active `Generation 1` family-phase routing for the nested `Materials` subfamily inside `Properties`.

Current legal family-phase ladder:
- `Materials-1` - Workspace Foundation And Material Owner Read
- `Materials-2` - First Material Editing And Action Flows
- `Materials-3` - Richer Material Fields And Library Direction
- `Materials-4` - Materials Content Simplification Cleanup
- `Materials-5` - Multi Object Material Assignment And Mixed Values

Current active implementation-planning owner:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-5 - Multi Object Material Assignment And Mixed Values.md`

Current shipped editing phase:
- `Materials-2 / Phase 3 - Wider Assignment Reuse And Richer Field Follow-Through`

Current shipped editing read:
- inherit focused object intake from the landed `Properties` shell contract
- keep selected material target identity downstream from the shipped `Materials-1` target-row and material-read helpers
- edit the resolved material preset through history-wrapped material owner actions
- expose first-pass controls for name, base color, metalness, roughness, opacity, emissive color, emissive intensity, and transparency
- create, assign, and duplicate material presets through owner-routed material history
- derive all, odd, and even target groups from the shipped ordered `MaterialsTargetRow[]` list
- assign the selected resolved preset to grouped target rows through one undoable material history action
- adapt the older `Select All Odds` / `Select All Evens` baseline as scoped grouped assignment controls inside the new hosted lane
- keep grouped assignment downstream from the focused object's current material targets instead of creating a new target-selection owner
- expose `Double-sided` as the first owner-backed richer render field, defaulting to the old double-sided viewer behavior while allowing a front-sided opt-out
- defer richer shader, texture, and library fields until the typed `MaterialPreset` owner and asset seams can store them honestly

Current shipped richer-field phase:
- `Materials-3 / Phase 3 - Hosted Field Projection And Library Handoff`

Current next planning read:
- prep `Materials-5 / Phase 3 - Mixed Selected Material Read`
- use the locked focused-item inclusion scope to aggregate selected-material reads and show `Multiple values` when selected objects disagree
- keep multi-object field editing deferred until the mixed-value read projection is honest

Current editing owner:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-5 - Multi Object Material Assignment And Mixed Values.md`

Current planning rules:
- use this index to choose and bound the next `Materials-N` family phase
- use a matching standalone `Future/` family phase doc for Codex-sized implementation phases and implementation specs
- do not start runtime implementation from this index alone
- keep the workspace shell separate from actual material truth, preview truth, and object-assignment truth
- preserve the visual baseline linked in `Materials-Vision.md`: compact focused item, material target list, odds or evens actions, selected material controls, `New Material`, and default preset list without turning the lane into a busy all-controls surface

### Vision

`Materials` is expected to become a real workspace surface, not just a hidden side effect of other tools.

The healthy Generation 1 read is:
- `Materials` should fit the same hybrid workspace model as the other real workspaces
- the workspace should help the user browse, inspect, and later work with material-related state without becoming the canonical owner of that state
- material truth should stay explicit and typed instead of being trapped inside one panel-local UI model
- later material-library, assignment, and preview behavior should stay compatible with Browser, Catalog, Model Viewport, and object/content ownership instead of competing with them

Important boundary rule:
- if a question is about the broad focused-object materials workflow, use `Materials-Vision.md`
- if a question is about current `Generation 1` family-phase order, use this index
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc

## Wishlist Organization

### High Level Goals

- [ ] `Materials-Gen1-HLG-1. Materials should have a real workspace-family home under Workspace Modes instead of staying only an implied later need.`
- [ ] `Materials-Gen1-HLG-2. The Materials workspace should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Materials-Gen1-HLG-3. The Materials workspace should stay downstream from the real material owner systems instead of becoming a hidden second owner.`
- [ ] `Materials-Gen1-HLG-4. The first Materials family phase should map the real owner seams before broader library, assignment, or preview behavior is planned.`
- [ ] `Materials-Gen1-HLG-5. Materials should support natural multi-object workflows without forcing users to edit one object at a time.`

### Codex Level Goals

- [ ] Materials-Gen1-CLG-1. Create a dedicated `Materials` workspace-family planning home under `Workspace Modes`.
- [ ] Materials-Gen1-CLG-2. Keep the family compatible with the shared hybrid workspace model.
- [ ] Materials-Gen1-CLG-3. Define the first owner-boundary read before runtime implementation starts.
- [ ] Materials-Gen1-CLG-4. Route the first implementation-ready work into one standalone `Materials-1` family phase doc when the code seams are understood.

### `Materials-1`

- [x] Create the standalone `Future/Materials-1 - Workspace Foundation And Material Owner Read.md` Family Phase Doc.
- [x] Identify the first live material-owner seams before any workspace UI implementation begins.
- [x] Define what the first Materials workspace surface owns versus only reads or projects.
- [x] Keep the first pass focused on workspace foundation and owner mapping instead of broad material-system behavior.
- [x] `Materials-Gen1-HLG-1`
- [x] `Materials-Gen1-HLG-2`
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`
- [x] Materials-Gen1-CLG-1.
- [x] Materials-Gen1-CLG-2.
- [x] Materials-Gen1-CLG-3.
- [x] Materials-Gen1-CLG-4.

### `Materials-4`

- [x] Create the standalone `Future/Materials-4 - Materials Content Simplification Cleanup.md` Family Phase Doc.
- [x] Remove remaining diagnostic/proof rows from the ready Materials panel.
- [x] Add a focused-item list for one or many selected objects and simplify material-target visible copy.
- [x] Add a project material preset list under material targets for applying existing project materials to the selected target.
- [x] Move material source from a full row into a compact selected-material badge during the compact-control pass.
- [x] Compact selected-material controls.
- [x] Extract the expanded color picker into a reusable selected-material color-control template and reuse it for emissive color.
- [x] Compact material actions, including moving `New Material` and `Duplicate Material` into the `Project materials` section.
- [x] Preserve owner-boundary rules from `Materials-1`, `Materials-2`, and `Materials-3`.
- [x] `Materials-Gen1-HLG-3`
- [x] `Materials-Gen1-HLG-4`

### `Materials-5`

- [x] Create the standalone `Future/Materials-5 - Multi Object Material Assignment And Mixed Values.md` Family Phase Doc.
- [x] Derive a multi-object material target scope from shared workspace selection.
- [x] Let project material row clicks apply to all selected material-bearing objects.
- [x] Separate focused-item assignment inclusion toggling from right-anchored `x` global deselect/removal.
- [ ] Show `Multiple values` when selected objects disagree on material fields.
- [ ] Let later field edits apply across the selected material target scope through material history.
- [ ] Preserve owner-boundary rules from `Materials-1`, `Materials-2`, `Materials-3`, and `Materials-4`.
- [ ] `Materials-Gen1-HLG-2`
- [ ] `Materials-Gen1-HLG-3`
- [ ] `Materials-Gen1-HLG-5`

### Phase Prep Notes

- the first implementation-planning cut should start with a code-grounded owner read
- keep broad material-library, assignment, and viewport-preview behavior out of the index until the first family doc makes those boundaries explicit
- the wider editing and action ladder now lives explicitly in `Materials-2`
- the richer field and library-direction ladder now lives explicitly in `Materials-3`
- the user-facing content simplification ladder now lives explicitly in `Materials-4`
- the multi-object selection and mixed-value ladder now lives explicitly in `Materials-5`

## [x] `Materials-1` - `Workspace Foundation And Material Owner Read`

### Family Phase Summary

Create the first implementation-planning surface for the new `Materials` workspace family.

This phase should make the first owner and workspace boundary concrete before any runtime implementation starts.

The first family phase should stay small:
- one code-grounded owner read
- one workspace-surface boundary
- one first-pass routing answer for later browsing, inspection, or assignment follow-through
- no fake all-at-once materials architecture

Current shipped handoff:
- `Phase 3 - First Material Property Projection And Action Handoff`

Current later follow-on after this family phase:
- `Materials-2`

### HLG / CLG Coverage

- [x] `Materials-Gen1-HLG-1. Materials should have a real workspace-family home under Workspace Modes instead of staying only an implied later need.`
- [x] `Materials-Gen1-HLG-2. The Materials workspace should fit the same hybrid workspace model as the other major workspaces.`
- [x] `Materials-Gen1-HLG-3. The Materials workspace should stay downstream from the real material owner systems instead of becoming a hidden second owner.`
- [x] `Materials-Gen1-HLG-4. The first Materials family phase should map the real owner seams before broader library, assignment, or preview behavior is planned.`
- [x] Materials-Gen1-CLG-1. Create a dedicated `Materials` workspace-family planning home under `Workspace Modes`.
- [x] Materials-Gen1-CLG-2. Keep the family compatible with the shared hybrid workspace model.
- [x] Materials-Gen1-CLG-3. Define the first owner-boundary read before runtime implementation starts.
- [x] Materials-Gen1-CLG-4. Route the first implementation-ready work into one standalone `Materials-1` family phase doc when the code seams are understood.

### Owns

- the first `Materials` workspace foundation read
- the first material-owner boundary map
- the first implementation-ready family-doc handoff for later runtime work

### Does Not Own

- the full long-range material vision if that needs a separate future `Materials-Vision.md`
- the complete runtime material system
- broad assignment, preview, shader, or library behavior before the owner seams are read

## [x] `Materials-4` - `Materials Content Simplification Cleanup`

### Family Phase Summary

Clean up the ready Materials UI so it feels like a normal material editor instead of a phase-proof surface.

The owning future doc is:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-4 - Materials Content Simplification Cleanup.md`

The phase ladder is:
- `Phase 1` - Diagnostic And Reference-Proof Row Removal
- `Phase 2` - Focused Item List And Target Header Simplification
- `Phase 3` - Project Material Preset List
- `Phase 4` - Inline Material Source And Compact Control Layout
- `Phase 4.1` - Reusable Material Color Control Template
- `Phase 5` - Compact Material Action Rail

### Owns

- user-facing cleanup of the hosted Materials content area
- removal or compression of diagnostic/proof rows
- closer alignment with the older compact Materials window inspiration
- preserving material owner and history behavior while simplifying presentation

### Does Not Own

- adding new material fields
- material library, texture asset, or shader graph work
- adding texture, library, or shader controls without a real owner
- moving material truth into the workspace lane

### Current Live Read

`Materials-3` has closed the first richer-field loop by shipping `doubleSided` as owner-backed state and projecting it as a hosted `Double-sided` checkbox.

`Materials-4` has compacted the material target list, removed the earlier phase-proof chrome, shipped `Phase 1` by removing the remaining bottom diagnostic/proof sections, shipped `Phase 2` by adding a focused-object list plus cleaner material-target copy, shipped `Phase 3` by adding a visible project material preset list under the material targets, shipped `Phase 4` by moving material source into compact selected-material context while tightening controls with shared `ParaSlider` / `ParaSelect` components, shipped `Phase 4.1` by extracting the expanded color picker into a reusable color-control template for both base color and emissive color, and shipped `Phase 5` by moving project-material creation actions into the project-material section while compacting grouped assignment actions. Follow-ups changed zero-intensity default material emissive colors to white, kept the project-material list height stable when new or duplicated presets are added, and added a compact Project materials search field above the preset list.

### First Pass Decisions

1. `Materials-4` is closed through `Phase 5`; pick a new Materials or Properties follow-on before widening runtime work.
2. Use shared `ParaSlider` and `ParaSelect` controls where they fit the material field type and do not widen the ownership boundary.
3. Keep behavior stable while removing presentation noise.
4. Preserve shared multi-selection as the source of truth; do not add a Materials-only selected-object owner.
5. Keep the shipped project-material list as current-project preset assignment, not full library, texture, or shader expansion.
6. In Phase 5, move material-creation actions into `Project materials` instead of leaving them below the selected-material editor.
7. Do not add a material draft owner in Phase 4; use the existing material-history update path and defer any slider commit-batching cleanup to a later history-specific pass.

### Verification Shape

- focused Properties surface tests
- production build for runtime slices
- changelog and doc-log entries for shipped implementation phases

## [ ] `Materials-5` - `Multi Object Material Assignment And Mixed Values`

### Family Phase Summary

Widen Materials from active-object-only editing into multi-object editing.

The owning future doc is:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-5 - Multi Object Material Assignment And Mixed Values.md`

The phase ladder is:
- `Phase 1` - Multi Object Target Read And Assignment Scope
- `Phase 2` - Project Material Batch Assignment
- `Phase 3` - Mixed Selected Material Read
- `Phase 4` - Multi Object Field Editing

### Owns

- applying a clicked project material preset to every selected material-bearing object
- preserving single-object assignment behavior
- showing `Multiple values` when selected objects disagree on selected-material fields
- later applying material field edits across the selected material target scope
- preserving material owner and history behavior

### Does Not Own

- material library browsing
- texture asset, shader graph, or new material field work
- changing workspace selection ownership
- making Materials a second material owner

### Current Live Read

`Materials-4` made the normal Materials panel compact enough to support the next workflow widening. The focused-object list already shows multiple selected objects, but project material rows still assign against the active focused object/target. `Materials-5` should first derive the full selected-object material target scope, then let project material row clicks apply to all selected objects, and only then introduce `Multiple values` reads and multi-object field editing.

### First Pass Decisions

1. Start with `Phase 1` as a view-model/readiness phase before changing assignment behavior.
2. Keep the focused-object list as the active-detail selector, not the only assignment scope.
3. For `Phase 2`, clicking `Brushed Metal` with two objects selected should assign `Brushed Metal` to both selected objects.
4. Treat `Multiple values` as a read projection, not material truth.
5. Defer direct mixed-field editing decisions until after batch preset assignment works.

### Verification Shape

- focused Materials view-model tests
- focused Properties surface tests for two selected objects
- production build for runtime slices
- changelog and doc-log entries for shipped implementation phases

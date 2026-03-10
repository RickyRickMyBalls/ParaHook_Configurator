# Chill Log

## Doc Header

### Doc History
1. 2026-03-08 00:00: Restored the local `Doc History` block in this file for header/rule/structure changes only, while ordinary chill-mode activity remains recorded in the active chill batch

### Purpose

This file is the active chill-mode log used during chill mode.

While chill mode is active:
- small rapid edits should be logged here
- permanent `docs/CHANGELOG.md` entries should wait until the user says `Update changelog`
- routine small chill-mode final responses do not need a `Diff:` line unless the user asks for one or the batch is being closed

### Canonical Note
- this is now the canonical chill-mode file named by `AGENTS.md`
- the canonical chill-mode path is `docs/Chill-Log.md`
- older chill-mode files may still exist for history/reference
- do not delete or archive the older files unless the user explicitly asks

### Batch Rules

- Each chill-mode session should start a new section:
  - `Chill Batch #1`
  - `Chill Batch #2`
  - etc.
- There should be only one active chill batch at a time.
- Each individual edit in chill mode should be logged under the active batch.
- Batch entries should use numbered one-line items in this format:
  - `1. 2026-03-06 20:54 - Entry text`
- Batch entries should be kept newest-first in source, with the newest entry at the top of the active batch.
- When explicit numbering is used in source, the highest number should be at the top and the lowest number at the bottom.
- Each batch entry should include its own `YYYY-MM-DD HH:MM` timestamp so rapid edits can still be reconstructed in order later.
- When the user says `Update changelog`, the active batch can be consolidated into one permanent `docs/CHANGELOG.md` entry.

## Doc Body

<!-- ============================================================ -->
### Chill Batch #4
<!-- ============================================================ -->

Status:
- active

Started:
- 2026-03-07 12:40

Ended:
- active

Mode:
- chill mode active

Consolidated To:
- pending

Current Goal:
- continue the current docs-system cleanup, navigation cleanup, and phase/doc-structure alignment work without writing a permanent changelog entry for each small edit yet

Entries:
105. 2026-03-08 00:00 - Normalized the `Foldable Outline Tree` file bullets in `docs/Doc-Index.md` so the doc names now consistently use backticks throughout the tree instead of only `CHANGELOG.md` using the code-style label
104. 2026-03-08 00:00 - Rebuilt the bottom `Foldable Outline Tree` in `docs/Doc-Index.md` so it now matches the current `/docs` structure, including `docs/Agents`, the archived Codex chat/context files, the live roadmap set, the numbered family phase-plan files, and the current `Tasks/Future` plus `Tasks/Old` split
103. 2026-03-08 00:00 - Added a `Planning Mode Rule` to `AGENTS.md` so explicit planning sessions now point to `docs/Agents/Agents-Planning.md` and keep Codex focused on architecture, direction, salvageable/refactor/new/retire classification, and roadmap-oriented reasoning unless code is explicitly requested
102. 2026-03-08 00:00 - Created `docs/Agents/Agents-Planning.md` as the detailed planning-mode rule file, defining how Codex should stay focused on vision tightening, salvageable/refactor/new/retire classification, repo-grounded architecture reasoning, roadmap ordering, and CodexChat capture during explicit planning sessions
101. 2026-03-08 00:00 - Added a `Codex Chat Capture Rule` to `AGENTS.md` so future long-form sessions use the next `docs/Archive/CodexContext/History-Chats/N_CodexChat.md` file as the running notes surface for decisions, architecture clarifications, rule changes, and durable project conclusions, and fixed the stale `OO` family-doc example there to `14_DOC`
100. 2026-03-08 00:00 - Folded the concrete no-legacy roadmap from `docs/Human-Plans/roadmap/LEAVING-legacy.md` into `docs/Phase-Plans/15_LEG - Phase Plan.md`, adding the final target, subsystem-specific removal lanes, practical removal order, and stronger checklist detail so `LEG` can become the main working legacy-removal surface
99. 2026-03-08 00:00 - Reworked `docs/Human-Plans/roadmap/roadmap.md` into a more normal operator roadmap with `Current State / Now / Next / Later`, using the rebuilt family phase files and current app shape to point the next lane toward roadmap consolidation, editor/interaction stabilization, param-input direction, and later legacy removal
98. 2026-03-08 00:00 - Aligned the completed batch state by marking the finished family rows as done in `docs/Archive/CodexContext/4_CodexContext.md`, fixing the nested `3A-3H` indentation there, and updating the stale `DOC - Phase 14F` family-status entries in `docs/Phase-Plans/14_DOC - Phase-Plans.md`
97. 2026-03-08 00:00 - Created, templated, and completed the changelog information pass for `docs/Phase-Plans/11_SP - Phase-Plans.md`, rebuilding reconstructed `SP - Phase 1` through `3`, filling shipped `SP - Phase 4` through `7`, aggregating the multi-entry `SP - Phase 5` layout wave, and marking `SP` complete in both the CodexContext tracker and `DOC - Phase 14F`
96. 2026-03-08 00:00 - Created, templated, and completed the changelog information pass for `docs/Phase-Plans/13_ADV - Phase-Plans.md`, rebuilding reconstructed `ADV - Phase 1` and `2`, keeping later future-systems phases as placeholders, and marking `ADV` complete in both the CodexContext tracker and `DOC - Phase 14F`
95. 2026-03-08 00:00 - Created, templated, and completed the changelog information pass for `docs/Phase-Plans/12_EX - Phase-Plans.md`, rebuilding reconstructed `EX - Phase 1`, keeping later export phases as future placeholders, and marking `EX` complete in both the CodexContext tracker and `DOC - Phase 14F`
94. 2026-03-08 00:00 - Created, templated, and completed the changelog information pass for `docs/Phase-Plans/10_JK - Phase-Plans.md`, rebuilding reconstructed `JK - Phase 1`, leaving later Jake-mode phases as future placeholders, and marking `JK` complete in both the CodexContext tracker and `DOC - Phase 14F`
93. 2026-03-08 00:00 - Created, templated, and completed the changelog information pass for `docs/Phase-Plans/09_DBG - Phase-Plans.md`, rebuilding `DBG - Phase 1` from the shipped debug-inspector entry, keeping later `DBG` phases as future placeholders, and marking `DBG` complete in both the CodexContext tracker and `DOC - Phase 14F`
92. 2026-03-08 00:00 - Created, templated, and completed the changelog information pass for `docs/Phase-Plans/08_VR - Phase-Plans.md`, rebuilding reconstructed `VR - Phase 1`, keeping later viewer phases as future placeholders, and marking `VR` complete in both the CodexContext tracker and `DOC - Phase 14F`
91. 2026-03-08 00:00 - Created, templated, and fully rebuilt `docs/Phase-Plans/07_AS - Phase-Plans.md` from `docs/CHANGELOG.md`, adding reconstructed `AS - Phase 1`, `2`, and `4`, keeping `AS - Phase 3` as an inferred gap phase, then marked `AS` complete in both the temporary CodexContext tracker and `DOC - Phase 14F`
90. 2026-03-08 00:00 - Expanded the temporary normalization workflow in `docs/Archive/CodexContext/4_CodexContext.md` so the `information pass` step now breaks down into concrete sub-steps for changelog scan, phase classification, summary writing, grouped checklist buildout, file-footprint capture, reconstructed labeling, and cautious `L` / `R` marking
89. 2026-03-08 00:00 - Rebuilt `docs/Archive/CodexContext/4_CodexContext.md` into a temporary phase-plan normalization tracker, deleting the older mixed checklists and replacing them with one three-step workflow plus per-file sub-checklists for the remaining family phase-plan files
88. 2026-03-08 00:00 - Added short ownership labels back to the `Future Legacy Updates` reminder list in `docs/Phase-Plans/00_Phase-Setup.md` so the compact existing-prefix guidance still says what `VR`, `DBG`, `DOC`, and `LEG` mean
87. 2026-03-08 00:00 - Pruned the `Future Legacy Updates` section in `docs/Phase-Plans/00_Phase-Setup.md` so only `REF` remains as a plausible future standalone prefix candidate after mapping the other wishlist areas back onto existing canonical families like `VR`, `DBG`, `AS`, and `DOC`
86. 2026-03-08 00:00 - Simplified the `Future Legacy Updates` section in `docs/Phase-Plans/00_Phase-Setup.md` into a compact numbered prefix list so the candidate future families now scan more like the canonical prefix blocks
85. 2026-03-08 00:00 - Added a `Future Legacy Updates` section to `docs/Phase-Plans/00_Phase-Setup.md`, using `docs/Human-Plans/Wish-Features/00 - legacy-Wishes.md` to seed non-canonical candidate prefixes like `GZ`, `SCN`, `REF`, `MAT`, `INS`, `CAM`, `WB`, and `AUD` without promoting them into the active canonical prefix list yet
84. 2026-03-08 00:00 - Added a cautious `L` legacy pass to `docs/Phase-Plans/06_DR - Phase-Plans.md`, marking the old pre-canonical driver ID forms, dual-read alias compatibility, and the still-supported primitive-value compatibility path as likely future removals while leaving the rest of the `DR` checklist history untouched
83. 2026-03-08 00:00 - Rebuilt `docs/Phase-Plans/06_DR - Phase-Plans.md` from `docs/CHANGELOG.md`, promoting `DR - Phase 3` to reconstructed status and adding real summaries, grouped detailed checklists, and file-footprint sections for `DR - Phase 3` and `DR - Phase 7` through `12`, then marked `DR` complete inside `DOC - Phase 14F`
82. 2026-03-08 00:00 - Created `docs/Phase-Plans/06_DR - Phase-Plans.md` in the settled family-file format and seeded it with the canonical `DR` phase ladder from `docs/Phase-Plans/00_Phase-Setup.md`, using placeholder summaries and checklist stubs for the later changelog reconstruction pass
81. 2026-03-08 00:00 - Built `docs/Human-Plans/roadmap/roadmap.md` as a clean short roadmap surface with the immediate three-step direction ordered as `DOC - Phase 14F`, roadmap buildout, then legacy understanding
80. 2026-03-08 00:00 - Trimmed `docs/Phase-Plans/00_Phase-Setup.md` back toward a lean rules-and-registry doc by removing stale workflow sections, duplicated prefix summaries, and the long researched-history interpretation blocks while keeping the canonical family-file rules, prefix list, and compact phase checklist
79. 2026-03-08 00:00 - Added the canonical `LEG` family to `docs/Phase-Plans/00_Phase-Setup.md`, including the meta/docs prefix list, total prefix count, compact checklist row, and researched-family guidance so legacy-removal planning is now part of the active phase system
78. 2026-03-08 00:00 - Rebuilt `docs/Phase-Plans/15_LEG - Phase Plan.md` into the settled phase-plan structure, collapsing the earlier top-level legacy-removal stages into one reusable `LEG - Phase 1` with `1A` through `1F` sub-phases
77. 2026-03-08 00:00 - Built `docs/Phase-Plans/15_LEG - Phase Plan.md` as a real legacy-removal planning file with identification, classification, replacement-path, removal-wave, and verification sections so legacy cleanup now has a structured starting frame
76. 2026-03-08 00:00 - Rebuilt `docs/Phase-Plans/05_PT - Phase-Plans.md` from `docs/CHANGELOG.md`, promoting `PT - Phase 1` and `PT - Phase 2` to reconstructed phases and adding detailed summaries, grouped checklist content, and file-footprint sections for the currently evidenced `PT` family, then marked `PT` complete inside `DOC - Phase 14F`
75. 2026-03-08 00:00 - Replaced the generic grouped placeholder in `docs/Phase-Plans/05_PT - Phase-Plans.md` with the canonical `PT` phase ladder from `docs/Phase-Plans/00_Phase-Setup.md`, so the family file now reflects the real required phase numbers and separates confirmed versus future rows
74. 2026-03-08 00:00 - Created `docs/Phase-Plans/05_PT - Phase-Plans.md` in the settled family-file structure with the canonical header, fold guide, and a temporary grouped placeholder block so the `PT` family now has a proper landing surface for later reconstruction
73. 2026-03-08 00:00 - Restored the local `Doc History` block in `docs/Chill-Log.md` as a structure-only section for header/rule changes, while keeping ordinary chill activity in the active batch
72. 2026-03-08 00:00 - Clarified the `docs/Chill-Log.md` exception in `docs/Doc-Index.md` so ordinary batch activity stays in the active chill batch while real header/rule/structure changes may still use a local `Doc History`
71. 2026-03-08 00:00 - Added the explicit `docs/Chill-Log.md` exception wording to `docs/Doc-Index.md` so the canonical doc-history rule now says this file should log its own changes only in the active chill batch
70. 2026-03-08 00:00 - Removed the local `Doc History` block from `docs/Chill-Log.md` so this file now matches the repo exception rule and records its own changes only in the active chill batch
69. 2026-03-08 00:00 - Updated the canonical checklist rules in `docs/Doc-Index.md` and `docs/Phase-Plans/00_Phase-Setup.md` so `L` now means legacy feature to remove and the new `R` marker means removed
68. 2026-03-08 00:00 - Added a cautious `L` legacy pass to `docs/Phase-Plans/04_FS - Phase-Plans.md`, marking only the explicit FS compatibility aliases, `Option-B` naming debt, debug-preview framing, `CubeProof` proof path, backward-compatible enable behavior, and preserved singleton-key seams as likely future removals
67. 2026-03-08 00:00 - Added the canonical reconstructed-title rule to `docs/Phase-Plans/00_Phase-Setup.md` so confirmed reconstructed family phases now explicitly use the `- Reconstructed` suffix while gap/provisional rows stay separate
66. 2026-03-08 00:00 - Rebuilt `docs/Phase-Plans/04_FS - Phase-Plans.md` from `docs/CHANGELOG.md`, adding detailed summaries, grouped checklist content, and file-footprint sections for `FS - Phase 9` through `FS - Phase 15`, and marked `FS` complete inside `DOC - Phase 14F`
65. 2026-03-08 00:00 - Added the completed `Doc History` cleanup file list from `docs/Archive/CodexContext/4_CodexContext.md` into `DOC - Phase 14G` in `docs/Phase-Plans/14_DOC - Phase-Plans.md` so the canonical docs plan now records the accomplished cleanup targets directly
64. 2026-03-08 00:00 - Added `DOC - Phase 14G - Doc History Standardization` to `docs/Phase-Plans/14_DOC - Phase-Plans.md`, including a short summary and checklist so future doc-history cleanup has a stable tracked home inside the canonical docs buildout
63. 2026-03-08 00:00 - Moved the active remaining family-file checklist from `docs/Archive/CodexContext/4_CodexContext.md` into `DOC - Phase 14` in `docs/Phase-Plans/14_DOC - Phase-Plans.md` so the canonical docs phase plan now carries that working task surface directly
62. 2026-03-08 00:00 - +? -? - Clarified in `docs/Chill-Log.md` that chill-batch entries should stay newest-first in source and re-ordered `Chill Batch #4` so the entry list now follows that rule explicitly
61. 2026-03-08 00:00 - +? -? - Completed the remaining four `Doc History` cleanup files in strict sequence: `docs/Phase-Plans/03_NI - Phase-Plans.md`, `docs/Phase-Plans/04_FS - Phase-Plans.md`, `docs/Phase-Plans/00_Phase-Setup.md`, then `docs/Chill-Log.md`, and checked each one off in `docs/Archive/CodexContext/4_CodexContext.md` immediately after it was done
60. 2026-03-08 00:00 - +? -? - Added a second checklist to `docs/Archive/CodexContext/4_CodexContext.md` tracking which files have had their `Doc History` blocks fixed and which still need explicit renumber cleanup
59. 2026-03-08 00:00 - +? -? - Rebuilt `docs/Archive/CodexContext/4_CodexContext.md` as a compact checklist of the family phase-plan files that still need normalization or historical-content work during `DOC - Phase 14`
58. 2026-03-08 00:00 - +? -? - Re-numbered the `##### Doc History` blocks in `docs/Phase-Plans/01_GE - Phase-Plans.md` and `docs/Phase-Plans/02_VM - Phase-Plans.md` so both files now use explicit newest-first numbering with the highest number at the top
57. 2026-03-08 00:00 - +? -? - Re-numbered the `##### Doc History` block in `docs/Phase-Plans/14_DOC - Phase-Plans.md` so the source now uses explicit newest-first numbering with the highest number at the top
56. 2026-03-08 00:00 - +? -? - Corrected the `docs/CHANGELOG.md` `Doc History` numbering direction so the newest top entry now carries the highest number while the list still stays newest-first
55. 2026-03-08 00:00 - +? -? - Re-numbered the `Doc History` block in `docs/CHANGELOG.md` so the source now explicitly matches the newest-first ordering rule instead of relying on markdown auto-numbering
54. 2026-03-08 00:00 - +? -? - Re-numbered the `Doc History` block in `docs/Doc-Index.md` so the source now explicitly matches the newest-first ordering rule instead of relying on markdown auto-numbering
53. 2026-03-08 00:00 - +? -? - Reformatted `docs/Phase-Plans/04_FS - Phase-Plans.md` to the settled family-file layout, removing `Doc Body`, moving phase titles to `##`, adding the header fold pattern and `Fold Mode Guide`, and using the overview-side fold wrapper consistently
52. 2026-03-08 00:00 - +? -? - Added the direct reconstructed provenance label to the DOC family where it is currently true, so `DOC - Phase 1` in `docs/Phase-Plans/14_DOC - Phase-Plans.md` now says `- Reconstructed` in the heading
51. 2026-03-08 00:00 - +? -? - Added direct reconstructed provenance labels to the reconstructed phase titles in `docs/Phase-Plans/01_GE - Phase-Plans.md` and `docs/Phase-Plans/02_VM - Phase-Plans.md`, matching the same heading-level pattern now used in NI
50. 2026-03-08 00:00 - +? -? - Added direct reconstructed provenance labels to the NI phase titles where it is actually true, so the early gap rows in `docs/Phase-Plans/03_NI - Phase-Plans.md` now read as reconstructed in the heading itself
49. 2026-03-08 00:00 - +? -? - Restored detailed NI phase checklists, added file-footprint sections, and strengthened the summaries in `docs/Phase-Plans/03_NI - Phase-Plans.md` by mining the matching `NI - Phase 3` through `NI - Phase 5` entries from `docs/CHANGELOG.md`
48. 2026-03-08 00:00 - +? -? - Reformatted `docs/Phase-Plans/03_NI - Phase-Plans.md` to the settled family-file layout, removing `Doc Body`, moving phase titles to `##`, adding the overview-side fold wrapper, and adding the header `Fold Mode Guide`
47. 2026-03-08 00:00 - +? -? - Updated `DOC - Phase 14` in `docs/Phase-Plans/14_DOC - Phase-Plans.md` so its notes, decision list, and checklist now reflect the actual completed normalization work across `GE`, `VM`, `DOC`, the setup rule, and the locked family-file format decisions
46. 2026-03-08 00:00 - +? -? - Strengthened the `Phase Summary` blocks in `docs/Phase-Plans/02_VM - Phase-Plans.md` so they now describe the actual VM boundary shifts and why each phase mattered, not just the high-level result labels
45. 2026-03-08 00:00 - +? -? - Restored detailed VM phase checklists and file-footprint sections in `docs/Phase-Plans/02_VM - Phase-Plans.md` by mining the matching `VM - Phase 1` through `VM - Phase 5` entries from `docs/CHANGELOG.md`
44. 2026-03-08 00:00 - +? -? - Added the new `Fold Mode Guide` header section to `docs/Phase-Plans/01_GE - Phase-Plans.md`, `docs/Phase-Plans/02_VM - Phase-Plans.md`, and `docs/Phase-Plans/14_DOC - Phase-Plans.md` so the quick-fold system is documented directly in each active family file
43. 2026-03-08 00:00 - +? -? - Added a family-file header-note rule to `docs/Phase-Plans/00_Phase-Setup.md` so each `Phase-Plans.md` file can include a short fold-mode guide for later readers using the current `Ctrl+2 / Ctrl+3 / Ctrl+4` labels
42. 2026-03-08 00:00 - +? -? - Tightened the header description in `docs/Phase-Plans/00_Phase-Setup.md` so the family-file rule now explicitly matches the live `Fold Hack 3` / `Fold Hack 4` header pattern with the real housekeeping sections at `#####`
41. 2026-03-08 00:00 - +? -? - Tightened the header area in `docs/Phase-Plans/02_VM - Phase-Plans.md` to the clearer `Fold Hack 3` / `Fold Hack 4` pattern, with the real header sections sitting at `#####`
40. 2026-03-08 00:00 - +? -? - Reformatted `docs/Phase-Plans/02_VM - Phase-Plans.md` to the settled family-file layout first, removing `Doc Body`, moving phase titles to `##`, adding the overview-side fold wrapper, and leaving checklist content directly visible for the next content pass
39. 2026-03-08 00:00 - +? -? - Updated `docs/Phase-Plans/14_DOC - Phase-Plans.md` to the settled family-file layout by flattening the header, adding the overview-side fold wrapper, and keeping checklist content directly visible under each phase checklist
38. 2026-03-08 00:00 - +? -? - Updated `docs/Phase-Plans/00_Phase-Setup.md` so the family phase-plan rule now matches the settled `GE` layout exactly: overview-side fold hack only, direct-open checklist section, and the new `Ctrl+3 / Ctrl+4 / Ctrl+5` behavior
37. 2026-03-08 00:00 - +? -? - Removed the checklist-side fold wrapper from every phase in `docs/Phase-Plans/01_GE - Phase-Plans.md` while keeping the overview-side fold wrapper, so `Ctrl+4` now opens checklist content directly but still hides notes and file-footprint sections
36. 2026-03-08 00:00 - +? -? - Added the in-phase `#### Fold Hack` wrapper pattern across every phase in `docs/Phase-Plans/01_GE - Phase-Plans.md` so `Ctrl+4` stays on the compact phase surface and the notes, file-footprint sections, and detailed checklist content now live one fold level deeper
35. 2026-03-08 00:00 - +39 -2 - Expanded `GE - Phase 5` through `GE - Phase 7` in `docs/Phase-Plans/01_GE - Phase-Plans.md` using the reconstructed gap details and changelog bodies, adding likely file-touch sections plus grouped detailed checklist structure for the vertical-slice, affected-part-routing, and early-modern-baseline phases
34. 2026-03-08 00:00 - +54 -3 - Expanded `GE - Phase 8` through `GE - Phase 10` in `docs/Phase-Plans/01_GE - Phase-Plans.md` using the concrete implementation detail from `docs/CHANGELOG.md`, adding grouped detailed checklists plus file-change sections for the runtime bridge hardening, graph command kernel, and contract-lock phases
33. 2026-03-08 00:00 - +2 -58 - Cleaned `docs/Phase-Plans/01_GE - Phase-Plans.md` so `GE - Phase 1` through `GE - Phase 3` each keep one main detailed checklist surface instead of duplicating a second short flat checklist, and moved Phase 1 file-footprint sections into the notes area to match the newer phase layout
32. 2026-03-08 00:00 - +5 -6 - Re-formatted `docs/Phase-Plans/01_GE - Phase-Plans.md` to match the new flatter family-file structure, with the lighter header fold-hack, direct `##` phase titles, and `###` overview/checklist buckets
31. 2026-03-08 00:00 - +19 -14 - Rewrote the `Family Phase-Plan Format Rule` in `docs/Phase-Plans/00_Phase-Setup.md` so it now documents the exact flatter format being kept in `DOC - Phase-Plans.md`, including phase titles at `##`, `Overview` / `CheckList` at `###`, and the lighter header fold-hack
30. 2026-03-08 00:00 - +3 -19 - Removed the old `DOC - Phase 13F` follow-up block from `docs/Phase-Plans/DOC - Phase-Plans.md` after its scope was effectively absorbed by `DOC - Phase 14`
29. 2026-03-08 00:00 - +0 -1 - Re-formatted `docs/Phase-Plans/DOC - Phase-Plans.md` as a test pass to flatten the heading structure, removing the extra family wrapper so canonical phase titles now sit at `##` and `Overview` / `CheckList` blocks sit at `###`
28. 2026-03-08 00:00 - +12 -0 - Added a `Phase 14A` decision list to `docs/Phase-Plans/DOC - Phase-Plans.md` covering the format choices that still need to be locked before the family phase-plan files can be normalized consistently
27. 2026-03-08 00:00 - +101 -0 - Expanded `docs/Phase-Plans/GE - Phase-Plans.md` so `GE - Phase 1` through `GE - Phase 3` now include grouped high-detail checklist buckets and estimated worked-on/added file sections compiled from `docs/Archive/History/0 - History-TaskLog.md`
26. 2026-03-08 00:00 - +12 -1 - Compiled DOC-family evidence from `docs/Archive/History/0 - History-TaskLog.md` into `docs/Phase-Plans/DOC - Phase-Plans.md`, strengthening `DOC - Phase 3`, `DOC - Phase 11`, and `DOC - Phase 14B` with roadmap handoff detail, restored-checklist structure detail, and an explicit primary archived reconstruction source
25. 2026-03-08 00:00 - +9 -5 - Updated `docs/Phase-Plans/DOC - Phase-Plans.md` so `DOC - Phase 14` now reflects that `00_Phase_Log.md` and `TaskHistoryCompilation.md` are archived, marks `00_Phase-Setup.md` complete under the rename sub-phase, and shifts the remaining checklist items to the current live-versus-archived file state
24. 2026-03-08 00:00 - +17 -12 - Moved the repo-wide checklist marker/structure standard into `docs/Doc-Index.md` as `Global CheckList Rule` and reduced `docs/Phase-Plans/00_Phase-Setup.md` to a shorter phase-specific checklist reference block
23. 2026-03-08 00:00 - +21 -20 - Updated `docs/Phase-Plans/00_Phase-Setup.md` so the canonical docs/meta prefix references now use `DOC` instead of `OO`, including the family-file example, prefix list, compact checklist block, and researched family section
22. 2026-03-08 00:00 - +1 -1 - Marked the `docs/CHANGELOG.md` item complete under `DOC - Phase 14E` in `docs/Phase-Plans/DOC - Phase-Plans.md` after the changelog title layer was hand-updated from `OO` to `DOC`
21. 2026-03-08 00:00 - +2 -1 - Cleaned `docs/Doc-Index.md` so its foldable docs map now points to `DOC - Phase-Plans.md` instead of the old `OO - Phase-Plan.md` family file reference
20. 2026-03-08 00:00 - +10 -0 - Expanded `DOC - Phase 14` with a new `14E` sub-phase for the `OO` to `DOC` prefix migration, including a required-file checklist for `CHANGELOG`, `00_Phase-Setup`, `00_Phase_Log`, and `Doc-Index`
19. 2026-03-08 00:00 - +2 -2 - Renamed `docs/Phase-Plans/OO - Phase-Plans.md` to `docs/Phase-Plans/DOC - Phase-Plans.md`, switched the internal family prefix from `OO` to `DOC`, and fixed the file title so the docs/meta family can start moving to the clearer `DOC` prefix
18. 2026-03-08 00:00 - +15 -0 - Expanded `OO - Phase 14A` in `docs/Phase-Plans/OO - Phase-Plans.md` with one checklist item per required canonical family `Phase-Plans.md` file, marking the existing family docs complete and the missing prefix docs as still needing dedicated files
17. 2026-03-08 00:00 - +45 -37 - Re-formatted `docs/Phase-Plans/GE - Phase-Plans.md` into the live family-file structure, adding the fold-oriented header nesting, a single family `##` section, and normalized per-phase `Overview` / `CheckList` buckets while preserving the existing GE phase content
16. 2026-03-08 00:00 - +45 -0 - Added `OO - Phase 14 - Canonical Family Phase-Plan Buildout` to `docs/Phase-Plans/OO - Phase-Plans.md` in the current family-doc format, covering normalization, reconstruction, checklist migration, and roadmap support
15. 2026-03-08 00:00 - +2 -23 - Removed the duplicated local `Doc History` rule from `docs/Chill-Log.md` and marked `docs/Doc-Index.md` as the canonical home for that repo-wide docs rule
14. 2026-03-08 00:00 - +12 -8 - Cleaned the top of `docs/Chill-Log.md` into a proper `Doc Header` / `Doc Body` layout, renamed stale rule headings, and updated old historian/phase path references to the current docs structure
13. 2026-03-07 14:51 - +132 -131 - Batch-normalized the numbered title lines in `docs/CHANGELOG.md` to the new dashed header format, keeping modern entries date-based and reconstructed entries source-tag-based while leaving entry bodies unchanged
12. 2026-03-07 14:24 - +157 -5 - Added normalized `HUMAN SUMMARY:` lines across every numbered entry and reconstructed marker block in `docs/CHANGELOG.md`, using entry-body context and keeping summaries directly under each wrapper for folding-friendly scanning
11. 2026-03-07 13:44 - +4 -0 - Added the new headerless `HUMAN SUMMARY:` rule to `docs/CHANGELOG.md` so future entries include a compact 1-3 sentence readable summary directly under the entry wrapper without adding another fold level
10. 2026-03-07 13:39 - +5 -3 - Tightened the forward changelog-title rule so new entries should use the backticked canonical title shape like ``### [119] 2026-03-05 23:09 `SP - Phase 6 - Resizable Debug Inspector Drawer` `` without requiring a mass rewrite of older entries
9. 2026-03-07 13:36 - +13 -0 - Populated `### Changelog Rules` in `docs/CHANGELOG.md` so the doc header now describes the actual entry wrapper and heading format used in the body
8. 2026-03-07 13:34 - +6 -0 - Tightened `docs/CHANGELOG.md` changelog rules so new permanent entries now explicitly require canonical phase-prefix naming in the entry title when the work belongs to a canonical phase family
7. 2026-03-07 13:31 - +31 -4 - Added a `Changelog Format` block to the `docs/CHANGELOG.md` doc header so the file now documents its own entry wrapper, numbering rule, and heading-level structure
6. 2026-03-07 13:27 - +? -? - Shifted the main `docs/CHANGELOG.md` entry headers from `##` to `###`, shifted per-entry section headings from `###` to `####`, and updated the header rule text so the current changelog folding structure matches the new layout
5. 2026-03-07 13:21 - +17 -2 - Updated the top of `docs/CHANGELOG.md` to use a proper `Doc Header` and `Doc Body` split while keeping the existing changelog entry format and numbering intact
4. 2026-03-07 13:18 - +10 -8 - Re-structured `docs/Phase-Plans/00_Phase-Setup.md` to follow the `Doc-Index.md` doc rules with `Doc Header` and `Doc Body`, and corrected the stale phase-plan lifecycle path references in the top guidance
3. 2026-03-07 12:55 - +24 -0 - Expanded the `Human Docs Map` in `docs/Doc-Index.md` so the `Archive/` branch now includes archived files as well as archive folders
2. 2026-03-07 12:40 - +? -? - Consolidated the docs meta-system into `docs/Doc-Index.md`, rebuilt it as the central docs navigation + rules file, added the `/docs` hierarchy and canonical source guidance there, and removed the now-redundant `docs/Documentation-Rules.md`
1. 2026-03-07 12:40 - +16 -0 - Reactivated chill mode and started `Chill Batch #4` in `docs/Chill-Log.md`

<!-- ============================================================ -->
### Chill Batch #3
<!-- ============================================================ -->

Status:
- compiled

Started:
- 2026-03-06 20:53

Ended:
- 2026-03-07 10:37

Mode:
- chill mode inactive

Consolidated To:
- `docs/CHANGELOG.md` `[104]`

Current Goal:
- rapid repo edits under the canonical chill log without writing a full permanent changelog entry for each small change

Entries:
1. 2026-03-06 20:53 - +22 -0 - Reactivated chill mode and started `Chill Batch #3` in `docs/Chill-Log.md`
2. 2026-03-06 20:54 - +7 -2 - Updated the chill-batch instructions so each entry line now includes its own timestamp in addition to the inline diff
3. 2026-03-06 20:57 - +40 -0 - Added two explicit gap-story sections to `docs/Phases/00_Phase_List.md` so the phase narrative now explains the missing early repo-execution window and the missing handoff into the first shipped changelog wave
4. 2026-03-06 20:59 - +10 -0 - Normalized the `## Phase explination` section headers in `docs/Phases/00_Phase_List.md` so sections `4` through `8` now use the same full-width divider bars above and below the heading as the earlier sections
5. 2026-03-06 21:12 - +? -? - Ran a best-effort HTML-comment cleanup pass on `docs/History/8 - COPY.md`, wrapping likely ChatGPT response blocks while keeping visible user prompt lines and several pasted repo/code seams readable for later history extraction
6. 2026-03-06 21:17 - +? -? - Reformatted the visible ChatGPT block markers in `docs/History/8 - COPY.md` so the start label is followed by a real `<!--` line and the end label is preceded by a real `-->` line
7. 2026-03-06 21:22 - +? -? - Rebuilt the prompt labels in `docs/History/8 - COPY.md` so the file now shows `## total user prompts` as `61`, starts with `## user prompt #1`, and inserts a new incremented `## user prompt #N` immediately after each `<!-- CHATGPT BLOCK END -->`
8. 2026-03-06 21:29 - +? -? - Updated `docs/History/0 - compiled-HISTORY.md` so conversation `8` now explicitly records the preserved seam from pre-repo planning, to the repo-setup Codex prompt, to the later visible jump where the next preserved ask is the `3 sliders` box vertical slice
9. 2026-03-06 21:59 - +? -? - Rebuilt `docs/History/9 - COPY.md` into the new history-reading format with a short top summary, numbered `## User Prompt [N]` sections, backticked short prompts, double-indented pasted prompt/code blocks, and HTML-commented ChatGPT response blocks keyed off `Architectural refactor progress:`
10. 2026-03-06 22:02 - +? -? - Added a `First 10 Achievements` block near the top of `docs/History/9 - COPY.md` so the first routing/planning prompt bands now read like a milestone list instead of only raw transcript sections
11. 2026-03-06 22:07 - +? -? - Extended `docs/History/9 - COPY.md` under `## Prompt/respone Summary` with one-line achievement summaries for prompts `11` through `30`, covering file verification, routing-plan amendments, bootstrap hardening, rename planning, and the move into the instance-aware parts phase
12. 2026-03-06 22:17 - +? -? - Finished `docs/History/9 - COPY.md` under `## Prompt/respone Summary` with one-line achievement summaries for prompts `31` through `46`, covering Spaghetti Editor naming, graph-first direction, the `6A`/`6B` split, and Phase `6B` implementation/validation
13. 2026-03-06 22:31 - +? -? - Created `docs/History/MISSINGTASKS.md` as a best-effort reconstruction doc for the early `/20/` history gap, separating stronger inferred missing tasks from lower-confidence possibilities between conversations `8` and `9`
14. 2026-03-06 22:40 - +? -? - Created `docs/History/12 - COPY.md` in the same readable history format as `9 - COPY.md`, with a top summary, prompt/response summary, one numbered user prompt band, and the assistant reply wrapped in HTML comments
15. 2026-03-06 22:47 - +? -? - Updated `docs/TaskHistoryCompilation.md` by breaking the likely repo-start Codex prompt from `docs/History/12 - COPY.md` into a concrete checklist under the app-creation foundation block
16. 2026-03-06 22:55 - +? -? - Added a new top `Canonical Accepted Phases` section to `docs/TASKLIST.md`, consolidating the accepted canonical phases in chronological order from `docs/Phases/00_Phase_List.md` while leaving the older detailed task blocks intact below
17. 2026-03-07 00:03 - +? -? - Normalized the visible phase prefixes and phase names in `docs/TaskHistoryCompilation.md` to the canonical system by collapsing `CK` and `CT` into `GE`, collapsing `DC` into `OO`, and removing the older `-0A/-0B/-0C` label style from the visible headings
18. 2026-03-07 00:12 - +? -? - Added the remaining restart-era completed task blocks from `/docs/History/` into `docs/TaskHistoryCompilation.md` under `## COMPLETED PHASE TASKLISTS`, covering `AS`, `PT`, `JK`, `VM`, `VR`, `EX`, and `ADV` above the clean-restart `GE` foundation block
19. 2026-03-07 00:19 - +? -? - Created `docs/DOCindex.md` as a raw `/docs` inventory showing the current file count and per-file line counts across the documentation tree
20. 2026-03-07 00:20 - +? -? - Corrected `docs/DOCindex.md` so its self-entry reflects the file's actual current line count instead of the initial pre-write scan value
21. 2026-03-07 00:23 - +? -? - Reformatted the `docs/DOCindex.md` inventory rows to the bracketed zero-padded count style like `[0000] - path`, matching the new raw-scan display format
22. 2026-03-07 00:28 - +? -? - Added separate summed totals to `docs/DOCindex.md` for non-conversation docs and conversation docs, replaced the placeholder main total row with the real non-conversation total, and corrected the file's updated self-count
23. 2026-03-07 00:31 - +? -? - Reformatted all displayed counts in `docs/DOCindex.md` to the bracketed comma style like `[0,000]`, including the separated conversation totals and the main file inventory rows
24. 2026-03-07 00:46 - +? -? - Rebuilt `docs/Phases/00_Phase_Log.md` so it now matches the current canonical `59`-phase completed list from `docs/Phases/00_Phase_List.md`, including the later `OO` phases and the legacy-marked `NI - Phase 3` row
25. 2026-03-07 01:05 - +? -? - Rebuilt `docs/Phases/00_Phase_Log.md` again with fuller checklist-style detail across all canonical `59` phases after the prior compressed rewrite removed too much task-level information
26. 2026-03-07 01:11 - +? -? - Added two explicit speculative `Gap Phase` blocks to `docs/Phases/00_Phase_Log.md` for the missing restart-execution bridge and the missing first-shipped-wave handoff, using `[?]` checklist items and keeping them outside the `59` completed-phase count
27. 2026-03-07 01:16 - +? -? - Cleaned the top of `docs/Phases/00_Phase_Log.md` so it now has a clearer purpose block, reading instructions, canonical rules, and a proper legend for `[x]`, `[~]`, and `[?]`
28. 2026-03-07 01:27 - +? -? - Rebuilt `docs/Phases/00_Phase-CheckList.md` into a real completed-and-future canonical phase checklist, keeping the prefix organization, adding roadmap-derived future phases, and separating speculative gaps from planned work
29. 2026-03-07 01:34 - +? -? - Folded the compact canonical completed-and-future checklist into `docs/Phases/00_Phase-Setup.md` near the top so setup now carries the active prefixes, rules, and grouped phase inventory in one place
30. 2026-03-07 01:36 - +? -? - Aligned the top prefix descriptions in `docs/Phases/00_Phase-Setup.md` to the same ownership wording used by the canonical checklist so the master prefix list and checklist headings now describe each prefix the same way
31. 2026-03-07 01:40 - +? -? - Tightened the top guidance in `docs/Phases/00_Phase-Setup.md` and `docs/Phases/00_Phase_Log.md` to make the split explicit, then added a matching `Phase Docs Rule` to `AGENTS.md` so future phase work follows the same setup-vs-log workflow
32. 2026-03-07 09:50 - +? -? - Rebuilt `docs/repo.md` as a cleaner repository snapshot with a proper header, explicit snapshot timestamp, a smaller core hierarchy, and a medium hierarchy that shows the current `src/` layout
33. 2026-03-07 09:53 - +? -? - Added `Repository Hierarchy (High Detail)` to `docs/repo.md`, expanding only the architecture-defining files across app, Spaghetti, worker, viewer, shared contracts, and core docs
34. 2026-03-07 09:56 - +? -? - Expanded the `Snapshot Info` section in `docs/repo.md` with a readable summary of what the three hierarchy levels mean and what the main repo folders and selected high-detail files are responsible for
35. 2026-03-07 09:57 - +? -? - Added a `Golden Rule` section under the core stack in `docs/repo.md` to restate the main ownership boundaries between app, Spaghetti, worker, viewer, shared contracts, geometry, and docs
36. 2026-03-07 10:02 - +? -? - Relaxed the chill-mode diff rule in `AGENTS.md` and `docs/Chill-Log.md` so routine small chill-mode edits no longer need a `Diff:` line unless requested or during batch closeout
37. 2026-03-07 10:06 - +? -? - Added a formal `Phase Loop Rule` to `AGENTS.md` covering idea classification, future phase-file creation, planning, execution readiness, post-implementation logging, and promotion into the canonical completed phase docs

<!-- ============================================================ -->
### Chill Batch #2
<!-- ============================================================ -->

Status:
- compiled

Started:
- 2026-03-06 09:46

Ended:
- 2026-03-06 20:47

Mode:
- chill mode inactive

Consolidated To:
- `docs/CHANGELOG.md` `[102]`

Current Goal:
- build a prefix-aligned historical task map from the early restart conversations so the engine foundations and surrounding system decisions are easier to understand later

Entries:
1. +0 -0 - Chill mode reactivated and `Chill Batch #2` started
2. +3 -2 - Updated chill-mode batch-entry format so each entry includes its inline diff as `+A -B - Entry text`
3. +19 -0 - Added a top-level current phase-prefix list and local `Doc History` block to `docs/Phases/01_Phase-Setup.md`
4. +3 -0 - Tightened the chill-mode batch rule so entries use real `+A -B` counts when reliable and `+? -?` when a clean count is not possible
5. +? -? - Added a quick prefix cheat sheet to `docs/Phases/01_Phase-Setup.md` mapping common Spaghetti editor, node, driver, feature, viewer, and Jake-mode work to the phase prefixes they should usually use
6. +? -? - Added `Prefix Cheat Sheet 2` to `docs/Phases/01_Phase-Setup.md`, organized by prefix with bullet lists of the kinds of work that usually belong under each phase code
7. +43 -0 - Added `docs/Plans/README.md` as a navigation index linking the main architecture, wish-feature, Spaghetti, decision, and temporary planning docs
8. +? -? - Re-formatted `docs/Plans/README.md` so the link labels begin with `/docs/...` paths and are easier to scan from the repo root
9. +? -? - Removed the duplicate markdown link targets from `docs/Plans/README.md` so the index now shows clean `/docs/...` path lines only
10. +135 -0 - Added `docs/roadmap/ROADMAP.md` as the go-forward project roadmap, grouped by stable phase prefix with planned phases and sub-phases across graph, Spaghetti, drivers, assembly, viewer, Jake mode, debug, and export
11. +? -? - Grouped `docs/roadmap/ROADMAP.md` into named Sections under each prefix so the roadmap can expand without reusing or resetting phase numbers
12. +? -? - Re-formatted the prefix titles in `docs/roadmap/ROADMAP.md` into divider-wrapped code-style labels so the roadmap reads more clearly in raw Markdown while keeping the `###` Section headings
13. +? -? - Expanded the divider lines around the prefix titles in `docs/roadmap/ROADMAP.md` so they read more like horizontal separators in the raw markdown view
14. +? -? - Standardized every prefix divider in `docs/roadmap/ROADMAP.md` to the exact long separator line so all roadmap prefix blocks use the same visual width
15. +? -? - Normalized the rest of `docs/roadmap/ROADMAP.md` to match the `GE` block layout with a compact section list in each prefix header and indented detailed sections and task bullets underneath
16. +? -? - Converted the remaining section labels in `docs/roadmap/ROADMAP.md` to the same backticked code-style format used in the `GE` block so all prefix sections now render consistently
17. +? -? - Changed only the compact section lists in the roadmap prefix headers back to blue `###` headings so they match `GE`, while leaving the detailed section labels underneath in orange backticks
18. +? -? - Added a bottom `Achieved So Far` section to `docs/roadmap/ROADMAP.md` summarizing the major completed phase groups already landed in the repo
19. +? -? - Re-formatted the `Achieved So Far` section in `docs/roadmap/ROADMAP.md` to match the main roadmap block style and changed the completed entries to checked `[x]` items
20. +? -? - Reworked the `Achieved So Far` section so each completed block uses descriptive section names and grouped older completed prefixes under the closest current ownership areas instead of a generic `Completed` label
21. +? -? - Added a `Lost History` block under `Achieved So Far` in `docs/roadmap/ROADMAP.md` for older completed phases that do not map cleanly into the current go-forward prefix system
22. +167 -0 - Compiled the raw ChatGPT conversation in `docs/History/1 - chatgpt.md` into `docs/History/0 - compiled-HISTORY.md` as a structured summary of the early architecture discussion, one-truth principle, rebuild/worker model, and v18 restart ideas
23. +12 -0 - Recreated `docs/History/0 - compiled-HISTORY.md` as a short compiled-history index and added conversation 1 with an estimated `v18 planning era` label and a compact milestone/decision summary
24. +55 -0 - Added a structured summary block to the top of `docs/History/2 - chatgpt.md` covering the node-based input system direction, spaghetti wire rendering idea, gizmo migration strategy, and composite vec2 port UX decisions
25. +? -? - Added conversation 2 to `docs/History/0 - compiled-HISTORY.md` with an estimated `early v20 / Spaghetti planning era` label and a short summary of the node-graph, spaghetti-wire, gizmo-migration, and composite-port decisions
26. +92 -40 - Added a `Historian Mode Rule` to `AGENTS.md` defining the workflow for processing `docs/History/# - chatgpt.md` files into a structured top-of-file summary and a short compiled entry in `docs/History/0 - compiled-HISTORY.md`
27. +56 -0 - Added a structured summary block to the top of `docs/History/3 - chatgpt.md` covering the modern v20 architecture layout, parts-list decision, viewer-only control rules, vertical-slice path, and early real-toe roadmap
28. +? -? - Added conversation 3 to `docs/History/0 - compiled-HISTORY.md` with an estimated `early-to-mid v20 buildout era` label and a short summary of the concrete app/viewer/worker split, parts-list direction, and viewer-only control decisions
29. +? -? - Moved the structured summary to the top of `docs/History/3 - chatgpt.md` and wrapped the full raw transcript below it in an HTML comment so the file renders like a readable summary instead of a giant pasted conversation
30. +50 -0 - Added a structured summary block to the top of `docs/History/4 - chatgpt.md` covering the repo reinitialization, first public v20 Git baseline, and GitHub Pages/Actions recovery decisions
31. +? -? - Added conversation 4 to `docs/History/0 - compiled-HISTORY.md` with an estimated `first public v20 repo baseline` label and a short summary of the Git recovery, force-push baseline, and deployment restoration decisions
32. +108 -40 - Tightened the `Historian Mode Rule` in `AGENTS.md` so the workflow now explicitly requires a roughly 100-line Markdown summary at the top of each history file and wrapping the full raw conversation underneath in an HTML comment
33. +? -? - Brought `docs/History/1 - chatgpt.md`, `2 - chatgpt.md`, and `4 - chatgpt.md` into the historian format by adding clean top summaries and wrapping their raw transcripts in HTML comments
34. +? -? - Added a structured historian summary to `docs/History/5 - chatgpt.md` covering current v20 validation, Zod at the worker boundary, Spaghetti editor maturity, and Feature Stack v1 planning, then wrapped the raw transcript in an HTML comment
35. +? -? - Added conversation 5 to `docs/History/0 - compiled-HISTORY.md` with an estimated `mid v20 / Spaghetti + Feature Stack maturation era` label and a short summary of the validated v20 baseline and Feature Stack becoming the next major system
36. +0 -0 - Audited `docs/History/1 - chatgpt.md` through `5 - chatgpt.md` and confirmed they now all have visible `Doc History` + `Purpose` sections at the top and HTML-commented raw transcripts underneath
37. +? -? - Added a structured historian summary to `docs/History/6 - chatgpt.md`, framed it around the product-module architecture plan, toe recovery pivot, tail-intent rules, and Simple Toe v1 rollout, and wrapped the raw transcript underneath in an HTML comment
38. +? -? - Added conversation 6 to `docs/History/0 - compiled-HISTORY.md` with an estimated `mid v20 / architecture refactor paused for toe recovery` label and a short summary of the architecture plan, toe recovery decisions, and the first Simple Toe v1 direction
39. +? -? - Reordered `docs/History/0 - compiled-HISTORY.md` into estimated project chronology and converted the conversation labels into a realized `/20/` version ladder from `20.1` through `20.6` while keeping the original conversation numbers
40. +? -? - Updated the `Timeline Rule` in `docs/History/0 - compiled-HISTORY.md` so realized versions are generation-aware, allowing older last-gen conversations to use ladders like `18.1`, `18.2`, and `18.3` instead of forcing everything into `/20/`
41. +? -? - Reclassified conversations `1` through `6` in `docs/History/0 - compiled-HISTORY.md` into a mixed last-gen/next-gen timeline: conversations `1-3` now use realized versions `18.1` to `18.3`, and conversations `4-6` now use realized versions `20.1` to `20.3`
42. +? -? - Added an `Active History Note` to `docs/History/0 - compiled-HISTORY.md` recording that we are still searching for the exact restart conversation and starter prompt that should become realized version `20.0`
43. +? -? - Added a structured historian summary to `docs/History/7 - chatgpt.md`, focused on the Feature Stack mental model, feature-level driver promotion, sketch-to-extrude references, and the first concrete Feature Stack v1 plan, then wrapped the raw transcript underneath in an HTML comment
44. +? -? - Added conversation 7 to `docs/History/0 - compiled-HISTORY.md` and re-ordered the next-gen timeline so conversation `7` is realized version `20.3` and conversation `6` becomes `20.4`
45. +? -? - Added a structured historian summary to `docs/History/8 - chatgpt.md`, focused on the clean-slate `/20/` restart architecture, Parts List decision, perfect repo hierarchy, selectors guidance, and param-routing roadmap, then kept the raw transcript underneath in an HTML comment
46. +? -? - Added conversation 8 to `docs/History/0 - compiled-HISTORY.md` as the current best `20.0` candidate and updated the timeline plus active history note to treat it as the clean-slate `/20/` restart conversation
47. +? -? - Reordered the visible conversation entries in `docs/History/0 - compiled-HISTORY.md` so they now follow realized-version order with the newest versions at the top and the oldest at the bottom, while still keeping conversation `8` marked as `20.0`
48. +? -? - Added `Current Goal` text to `docs/chill-mode-ChangeList.md` so this history pass is explicitly framed around building a prefix-aligned map of the early restart conversations and engine foundations
49. +? -? - Created `docs/History/00 - History-Task.md` as the first prefix-aligned historical task map, using conversation `8 - chatgpt.md` to organize the clean `/20/` restart work into phase-style sections under the current prefix scheme and noting the likely future need for a dedicated runtime prefix
50. +? -? - Added a top-level `Legacy Cleanup Checklist` to `docs/History/00 - History-Task.md` so the restart history also points at the main old systems, assumptions, and ownership patterns that should likely be retired
51. +? -? - Created `docs/History/0 - History-TaskList.md` as the short ordered index of phase prefixes and section names copied from `0 - History-TaskLog.md` so the historical task map now has a simple navigation layer
52. +? -? - Reformatted `docs/History/0 - History-TaskList.md` so the phase titles use the orange backtick block style and all section entries use blue `###` headings consistently
53. +? -? - Normalized the rest of `docs/History/0 - History-TaskList.md` to match the new `GE` layout with divider line, phase title, spacing, and indented one-line `Prefix - Section N - Name` entries
54. +? -? - Added a second flat ordered list to `docs/History/0 - History-TaskList.md` using bracketed sequence numbers like `[01]` so all historical sections can be scanned and referenced as one-line entries in order
55. +? -? - Added a new `Historical Task Checklist` section to `docs/History/0 - History-TaskList.md` with a short summary and checked entries for every ordered section so the file also functions like a restored milestone log of the early `/20/` restart
56. +? -? - Broke out `GE - Section 1 - Clean Restart Architecture` in `docs/History/0 - History-TaskLog.md` into a concrete `First Codex Prompt Task List` based on the original master setup prompt from conversation `8 - chatgpt.md`
57. +? -? - Added a note in `docs/History/0 - History-TaskList.md` pointing to the deeper first-prompt checklist now stored under `GE - Section 1` in the history task log
58. +? -? - Normalized the section labels in `docs/History/0 - History-TaskLog.md` to the same prefix-first convention used in `0 - History-TaskList.md`, such as `GE - Section 1 - Clean Restart Architecture`
59. +? -? - Added a compact sub-checklist under `GE - Section 1 - Clean Restart Architecture` in `docs/History/0 - History-TaskList.md` so the historical checklist now shows the main setup tasks inside the first restart phase
60. +? -? - Added a `Historian Mode > Restore Checklist Mode` rule to `docs/chill-mode-ChangeList.md` so old conversations can be reconstructed into `0 - History-TaskLog.md` and then condensed into the `Historical Task Checklist` in `0 - History-TaskList.md`
61. +? -? - Restored `GE - Section 2 - Runtime And Rebuild Rules` in `docs/History/0 - History-TaskLog.md` with a fuller historical checklist covering warm-worker persistence, latest-only scheduling, stale-drop protection, render-vs-build intent classification, canonical state separation, and shared protocol boundaries
62. +? -? - Added the reduced `GE - Section 2 - Runtime And Rebuild Rules` sub-checklist to `docs/History/0 - History-TaskList.md` so the short historical checklist now shows the main runtime/rebuild rules established in conversation `8 - chatgpt.md`
63. +? -? - Converted the `Historical Task Checklist` in `docs/History/0 - History-TaskList.md` to a dual-status legacy format where the first checkbox tracks current-system status and the second checkbox tracks whether the task was achieved historically
64. +? -? - Restored sections `3-13` in `docs/History/0 - History-TaskLog.md` with fuller historical checklists covering the restart engine roadmap, Parts List replacement, deterministic part ordering, independent-part thinking, param ownership, Jake Mode structure, selector discipline, viewer ownership, export shape, future-ready systems, and roadmap ordering from conversation `8 - chatgpt.md`
65. +? -? - Added reduced dual-status sub-checklists for sections `3-13` to `docs/History/0 - History-TaskList.md` so the short historical checklist now summarizes the full clean-restart milestone set from conversation `8 - chatgpt.md`
66. +? -? - Restructured all sections in `docs/History/0 - History-TaskLog.md` into grouped subcategories so the detailed history now reads like a cleaner restored phase checklist, including a condensed grouped rewrite of `GE - Section 1 - Clean Restart Architecture`
67. +? -? - Added a `Restored Checklist Format` section near the top of `docs/History/0 - History-TaskLog.md` so the file now defines how the grouped historical reconstruction format is supposed to be read
68. +? -? - Added a bottom `Humanized Task Summary` section to `docs/History/0 - History-TaskList.md` with plain-English summaries of all 13 restored tasks from the clean `/20/` restart conversation
69. +? -? - Grouped the `Humanized Task Summary` in `docs/History/0 - History-TaskList.md` into numbered `Part` blocks so related sections are clustered by ownership area, starting with `Part 1` for the three `GE` sections
70. +? -? - Added descriptive names to the humanized-summary `Part` headers in `docs/History/0 - History-TaskList.md`, including the prefix and full ownership label for each block
71. +? -? - Added an `Estimated Files Created` block to `GE - Section 1 - Clean Restart Architecture` in `docs/History/0 - History-TaskLog.md` so the restored clean-restart phase now also shows the likely starter file footprint from conversation `8 - chatgpt.md`
72. +? -? - Renamed the main restored-history units in `docs/History/0 - History-TaskLog.md` from `Section` to `Phase`, including the format description, headings, and local doc-history references
73. +? -? - Added global `[001]`-style execution numbers to the restored phases in `docs/History/0 - History-TaskLog.md` and synchronized `docs/History/0 - History-TaskList.md` to the same `Phase` wording and chronological ids
74. +? -? - Added `Estimated Worked On Files` and `Estimated Added Files` blocks across the restored phases in `docs/History/0 - History-TaskLog.md` so each phase now shows a likely file-touch footprint based on conversation `8 - chatgpt.md`
75. +? -? - Rewrote the `Legacy Cleanup Checklist` in `docs/History/0 - History-TaskLog.md` so it now reflects the restored `/20/` restart lessons more precisely: Parts List over scrubber, one warm worker, no second geometry truth, part-owned params, selector discipline, and canonical-state history rules
75. +? -? - Added a summary of the surviving Git commit chain to `docs/History/0 - GIT.md`, covering the four visible commits and what each one most likely represented in the `/20/` repo timeline
75. +? -? - Created `docs/History/0 - GIT.md` as the starting history doc for Git-related repo events, resets, recovery notes, and public-baseline milestones
76. +? -? - Updated `docs/Phases/01_Phase-Setup.md` with engine-birth lessons from the restored `/20/` restart history, confirming the prefix list still stands while sharpening `GE`, `VM`, `DR`, `AS`, `VR`, and `JK` around warm-worker rules, part-owned routing, Parts List direction, selector discipline, and no-second-truth boundaries
77. +? -? - Created `docs/roadmap/02_Vision-Roadmap.md` as the new high-level product and architecture vision, defining Spaghetti as the canonical authoring system, Jake mode as the simplified end-user layer, drivers/control-viz as the bridge between them, and the long-term direction for parts, viewer, debug, and multi-document growth
78. +? -? - Expanded `docs/roadmap/02_Vision-Roadmap.md` with a new `Next Gen Plans - Parametric Parts` section so the vision now reflects the longer-range goal of evolving beyond ParaHook into a typed parametric-parts platform with stronger value/object contracts and reusable graph-engine architecture
79. +? -? - Added a 10-name idea list to the end of the `Next Gen Plans - Parametric Parts` section in `docs/roadmap/02_Vision-Roadmap.md`, exploring public/open-source next-gen naming directions around Parametric Parts, Spaghetti, ParaHook, ParaFootPad, and custom part systems
80. +? -? - Created `docs/roadmap/03_Spaghetti-Studio.md` as the future platform concept doc, capturing what Spaghetti Studio could become after ParaHook, the typed-graph and multi-product ideas behind it, and the guardrail rules current ParaHook work should follow to avoid a major future restructure
81. +? -? - Rebuilt `docs/Plans/Wish-Features/Spaghetti-Editor/01.0 - Master Spaghetti.md` as the top-level Spaghetti system doc, organizing it around graph-first ownership, current editor layers, spawnable node families, and the future multi-graph architecture needed for multiple loaded graph files, graph-aware worker builds, and a Graphs panel above Parts
82. +? -? - Created `docs/Plans/Wish-Features/Spaghetti-Editor/01.5 - Muliple Spaghetti Bowls` as the master plan for the future multi-graph Spaghetti editor, covering graph/document ownership, graph-aware worker and viewer routing, the likely Graphs panel above Parts, and the rules current work should follow so multi-graph support stays feasible later
83. +? -? - Added a concrete phased rollout to `docs/Plans/Wish-Features/Spaghetti-Editor/01.5 - Muliple Spaghetti Bowls.md`, breaking the future multi-graph feature into `SP-7` through `SP-12` across graph-document foundations, graph-aware worker/preview routing, a Graphs panel, shared viewport composition, multi-window editing, and multi-graph debug/polish
84. +? -? - Created `docs/Plans/Wish-Features/WISHLIST.md` as the short master wishlist checklist, collecting the main future feature buckets across Spaghetti editor upgrades, Jake mode, control-viz, multi-graph, Feature Stack, viewer parity returns, export growth, and the longer-range Spaghetti Studio direction
85. +? -? - Created `docs/roadmap/Focused-Roadmap.md` as the short execution-order roadmap and then reformatted it into a numbered phase sequence covering what should happen next across Spaghetti stability, wires/preview/debug, drivers, part hardening, Jake mode, viewer parity, export, and later multi-graph expansion
86. +? -? - Created `docs/Bugs/0_Bug_Report.md` as the structured running bug report, grouping the known Spaghetti window/split issues, the Cube-to-OutputPreview render regression, toolbar fragmentation, and wires-visibility problems into one clean current bug list with status, likely ownership, and related docs
87. +? -? - Populated the new `## Bug List` section in `docs/Bugs/0_Bug_Report.md` with one-line entries for Bugs 2 through 6 so the file now has a short bug index above the detailed writeups
88. +? -? - Re-formatted the `## Priority Order` section in `docs/Bugs/0_Bug_Report.md` to match the one-line bug-list style, ranking the current bugs by `Bug N` labels instead of a separate prose numbering scheme
89. +? -? - Added status tags to all items in the `## Bug List` section of `docs/Bugs/0_Bug_Report.md` so the short bug index now shows `[open]`, `[investigating]`, or `[planned]` at a glance without changing the separate ranked priority list
90. +? -? - Re-formatted the `## Bug List` lines in `docs/Bugs/0_Bug_Report.md` so each entry now reads in the order `Bug N`, then status key, then the note text
91. +? -? - Began unifying `docs/TaskHistoryCompilation.md` with the restored history system by folding the engine-birth phases from `docs/History/0 - History-TaskLog.md` into `Phase A`, adding the clean `/20/` restart architecture, runtime/rebuild rules, and engine-roadmap foundation decisions to the legacy app-creation block
92. +? -? - Replaced the legacy `Phase A-L` labels in `docs/TaskHistoryCompilation.md` with retrofitted prefix-based historical IDs like `GE-0A`, `NI-0A`, `PT-0A`, `FS-0A`, `DR-0A`, `DC-0A`, and `GE-0D`, while preserving the old changelog ranges for traceability
93. +? -? - Created `docs/Phases/00_Phase_List.md` as the unified accomplished-phase history, merging the restored engine-birth phases from `docs/History/0 - History-TaskLog.md` with the shipped product/system phases from `docs/CHANGELOG.md` into one chronological prefix-based checklist with entries `[001]` through `[038]`
94. +? -? - Added a `Transition Note` between `[013]` and `[014]` in `docs/Phases/00_Phase_List.md` clarifying that the remaining seam is a source-transition seam between restored engine-birth history and shipped changelog-derived implementation phases
95. +? -? - Added a `List Of Conversations Compiled` section to `docs/History/0 - compiled-HISTORY.md` so the file now shows a quick index of the currently included conversation summaries and their realized versions before the detailed entries
96. +? -? - Processed `docs/History/9 - chatgpt.md` in historian mode by adding a structured summary at the top, estimating its placement as early next-gen Spaghetti `S3` integration work, and wrapping the raw conversation in an HTML comment
97. +? -? - Added conversation `9` to `docs/History/0 - compiled-HISTORY.md`, placed it into the realized-version ladder as `20.2`, and updated the visible conversation order and timeline mapping so conversations `5`, `7`, and `6` now read as `20.3`, `20.4`, and `20.5`
98. +? -? - Reclassified conversation `6` in `docs/History/0 - compiled-HISTORY.md` from `20.5` to `18.4`, updated its era summary to reflect late legacy-to-next-gen toe recovery work, and reordered the compiled conversation list accordingly
99. +? -? - Added a short `Direct User Prompt Clues` quote list near the top of `docs/History/8 - chatgpt.md` so the clean-restart file now preserves some of the direct user commands that revealed the restart intent and early product direction
100. +? -? - Tightened the extracted-user-lines section in `docs/History/8 - chatgpt.md` into a short numbered in-order list of the lines most likely spoken by the user, instead of a broader mixed prompt dump
101. +? -? - Reworked the `Extracted User Lines` section in `docs/History/8 - chatgpt.md` into a numbered question-only list pulled from the raw conversation so it now reflects the user’s actual asks more cleanly
102. +? -? - Restored the broader mixed `Extracted User Lines` list in `docs/History/8 - chatgpt.md` and added a separate numbered `User Questions` section so the file now keeps both views of the same conversation
103. +? -? - Expanded `Direct User Prompt Clues` in `docs/History/8 - chatgpt.md` with the more directive repo-setup and Codex-command asks, including the explicit `give me full codex command to set up repo` line
104. +? -? - Added restored-history context to `docs/tasks/001 - GE - Phase 1 - Clean Restart.md` so the file is clearly framed as a reconstruction from `docs/History/8 - chatgpt.md` rather than a guaranteed original plan document
105. +? -? - Added top-level `Summary`, `Core Concepts`, and `Golden Rules` sections to `docs/tasks/001 - GE - Phase 1 - Clean Restart.md` so the restored first-phase task reads more like a proper historical phase doc
106. +? -? - Added a `Phase List` section near the top of `docs/History/9 - chatgpt.md` mapping the conversation to the restored `/20/` phase buckets, including completed groundwork and the newly defined routing and Spaghetti `S3` bridge work
107. +? -? - Added a `Phase List` section near the top of `docs/History/4 - chatgpt.md` showing that the conversation reads more like repo/public-baseline recovery and deployment work than a direct core-engine follow-up phase
108. +? -? - Expanded the `Ordered Phase List` in `docs/History/0 - History-TaskList.md` with the phases learned from conversation `9` and inserted explicit open `[ ]` bridge rows for the still-missing setup/vertical-slice/artifact-baseline phases between the clean restart and later Spaghetti integration work
109. +? -? - Reformatted the full `Ordered Phase List` in `docs/History/0 - History-TaskList.md` so every line now shows phase id, completion status, source tag like `Conv 8` or `Gap`, and the phase name in one consistent shape
110. +? -? - Added a historian header and top-level phase breakdown to `docs/History/10 - chatgpt.md`, framing conversation 10 as a later `/20/` checkpoint where canonical layout, the graph system, Feature Stack v1, and expose-fields were treated as complete and baseplate geometry was the next milestone
111. +? -? - Added conversation `10` to `docs/History/0 - compiled-HISTORY.md`, placed it into the realized-version ladder as `20.5`, and inserted its summary into the visible compiled conversation order
112. +? -? - Expanded the `Ordered Phase List` in `docs/History/0 - History-TaskList.md` with the phases learned from conversation `10`, including canonical layout, the Spaghetti graph system, Feature Stack v1, expose-fields, and the open next milestone for `Baseplate Geometry v0`
113. +? -? - Compared conversation `10` against `docs/CHANGELOG.md` and added a `Likely CHANGELOG References` list under `## Conversation 10 - ChatGPT` in `docs/History/0 - compiled-HISTORY.md`, including the strongest matching Feature Stack / Expose Fields entries and notes for missing exact matches
114. +? -? - Compared conversation `7` against `docs/CHANGELOG.md`, added a phase/changelog overlap note near the top of `docs/History/7 - chatgpt.md`, and added a `Likely CHANGELOG References` list under `## Conversation 7 - ChatGPT` in `docs/History/0 - compiled-HISTORY.md`
115. +? -? - Compared conversation `5` against `docs/CHANGELOG.md`, added a phase/changelog overlap note near the top of `docs/History/5 - chatgpt.md`, and added a `Likely CHANGELOG References` list under `## Conversation 5 - ChatGPT` in `docs/History/0 - compiled-HISTORY.md`
116. +? -? - Added `Best Guess Changelog Range` subsections under conversations `5`, `7`, and `10` in `docs/History/0 - compiled-HISTORY.md`, including split primary/later-echo ranges where the conversation seems to span both initial landing and later maturation
117. +? -? - Reworked the `Ordered Phase List` in `docs/History/0 - History-TaskList.md` so each row now carries the best current conversation anchor and a short note describing what that phase actually achieved, including overlap-aware tags for conversations `5`, `7`, and `10`
118. +? -? - Inserted additional explicit `Gap` rows into the `Ordered Phase List` in `docs/History/0 - History-TaskList.md` for the likely missing first-landed Spaghetti graph UI, Feature Stack v1 implementation, and Expose Fields implementation steps before the later mature checkpoint conversations
119. +? -? - Added `## Conversation 9 Task Log` to `docs/History/9 - chatgpt.md`, breaking conversation 9 into restored phase/task buckets for canonical part identity, instance-aware VM baseline, Spaghetti `S1` and `S2`, param routing v20, worker affected-part routing, and the `S3` compile-to-build bridge, with estimated worked-on and added file lists
120. +? -? - Simplified `## Phase List` in `docs/History/9 - chatgpt.md` into a one-line phase-title index so the top of the file now matches the detailed restored task-log phases below
121. +? -? - Added `## Conversation 5 Task Log` to `docs/History/5 - chatgpt.md`, restoring detailed phase/task buckets for engine validation, advanced Spaghetti editor UX, Feature Stack v1 app-layer planning, worker execution planning, and expose-fields direction with estimated worked-on and added file lists
122. +? -? - Populated `## Conversation 5 Phase List` in `docs/History/5 - chatgpt.md` with a one-line phase-title index that matches the restored conversation-5 task log below it
123. +? -? - Added `## Conversation 7 Phase List` and `## Conversation 7 Task Log` to `docs/History/7 - chatgpt.md`, restoring the conversation into phase/task buckets for part-node CAD identity, Feature Stack structure, driver-promotion design, and Sketch-to-Extrude reference rules with estimated worked-on and added file lists
124. +? -? - Added `## Conversation 10 Phase List` and `## Conversation 10 Task Log` to `docs/History/10 - chatgpt.md`, then reconciled `docs/History/0 - History-TaskList.md` so conversations 5, 7, and 10 now occupy one coherent restored phase sequence from `[024]` through `[037]`
125. +? -? - Updated `docs/History/0 - compiled-HISTORY.md` with the current best gap estimate between conversations 8 and 9, noting that the missing middle now looks like a small dense `2-4` conversation implementation burst rather than a large unknown era
126. +? -? - Added a classification heuristic to `docs/History/0 - compiled-HISTORY.md` that HookSpec-heavy conversations should be treated as last-generation by default unless there is strong explicit `/20/` evidence
127. +? -? - Processed `docs/History/11 - chatgpt.md` in historian mode by adding a planning summary, changelog overlap/range notes, a phase list, and a detailed task log, then updated `docs/History/0 - compiled-HISTORY.md` to place conversation `11` before conversation `10` in the realized `/20/` ladder
128. +? -? - Rebuilt `docs/Change-List-COMPILED.md` into one unified historical change index with compiled-order ids, reconstructed `18.x` + pre-`CHANGELOG.md` rows, explicit `Gap` entries, and the real shipped changelog continuing from source id `[001]`
129. +? -? - Reset the first compiled-order ids under `# Change List - compiled` in `docs/Change-List-COMPILED.md` so the separated `/20/` block starts from `[001]` again after the `# Last gen` section and updated the shipped-boundary note to match
130. +? -? - Added the remaining seam gaps to `docs/Change-List-COMPILED.md` after restored phase `[023]`, including an explicit restored-history-to-first-shipped-changelog handoff row and a first-landed graph/Feature-Stack/expose-fields implementation-wave row, then shifted the real changelog boundary down to `[026] [001]`
131. +? -? - Added a leading `[x]` or `[ ]` marker to every row in `docs/Change-List-COMPILED.md` to show whether each entry likely involved real file edits, and corrected restored `GE - Phase 1 - Clean Restart Architecture` to `[x]`
132. +? -? - Added a second vision-alignment marker to every row in `docs/Change-List-COMPILED.md` so each entry now shows both likely file-edit status and whether it still fits the long-term Spaghetti / ParaHook direction, marking obvious legacy scrubber/baseplate UI experiments and explicit gaps with `[ ]`
133. +? -? - Added a legend under `# Change List - compiled` in `docs/Change-List-COMPILED.md` explaining the meaning of the first and second row markers
134. +? -? - Collapsed `docs/Change-List-COMPILED.md` from the two-marker row format into one four-state marker `[x]`, `[~]`, `[?]`, or `[ ]`, and updated the header legend and format notes to match
135. +? -? - Replaced the restored `/20/` row labels in `docs/Change-List-COMPILED.md` from `est. 2026-03-03 pre-CHANGELOG` to direct source tags like `Conv 8`, `Conv 9`, or `Gap`
136. +? -? - Rebuilt `docs/Phases/02_Phase-Setup.md` as the history-aware phase map, covering canonical prefixes, historical alias mapping, researched phase families, and the known remaining gaps between restored history and shipped changelog history
137. +? -? - Added `docs/Documentation-Rules.md` as the central docs-maintenance rules file and recorded that `docs/Phases/00_Phase-Setup.md` is now the canonical source for phase setup decisions
138. +? -? - Consolidated the phase-setup rule so `docs/Phases/00_Phase-Setup.md` now clearly reads as the single active canonical phase-setup source and `docs/Documentation-Rules.md` now says older copied setup docs are reference-only
139. +? -? - Renamed the shipped `docs/Change-List-COMPILED.md` block into prefix-first phase-style entries so the real changelog rows now match the restored pre-changelog history format
140. +? -? - Updated `docs/Phases/00_Phase-CheckList.md` so `## Current Canonical Prefix Phases` now uses the modern canonical prefixes and maps older shipped `CK`, `CT`, `IN`, and `UI` entries into those current ownership buckets
141. +? -? - Added an ordering note and short per-prefix labels to `docs/Phases/00_Phase-CheckList.md` so the canonical prefix checklist now explains why `GE`, `VM`, `NI`, and the later buckets are arranged in that architectural order
142. +? -? - Tightened `docs/Phases/00_Phase-CheckList.md` so the canonical checklist stays compact and each shipped row now uses the `PREFIX - Phase N - Name` format instead of the older mixed short-code labels and longer per-prefix clutter
143. +? -? - Rebuilt `docs/Phases/00_Phase-CheckList.md` from `docs/Change-List-COMPILED.md` so it now groups the full merged history into compact checklist sections for the canonical prefixes plus explicit `Gaps`, `OO / Docs Meta`, and `Last Gen Conversation Anchors`
144. +? -? - Added a short legend under `## Current Canonical Prefix Phases` in `docs/Phases/00_Phase-CheckList.md` clarifying what `[x]`, `[~]`, and `[ ]` mean inside that grouped canonical checklist
145. +? -? - Condensed `docs/Phases/00_Phase-CheckList.md` so repeated rows with the same phase number now collapse into one phase line, removing duplicate phase numbers across the grouped checklist
146. +? -? - Created `docs/Phases/00_Phae_List.md` as the chronological version of the canonical phase checklist by taking the entries from `docs/Phases/00_Phase-CheckList.md` and ordering them by historical sequence instead of by prefix grouping
147. +? -? - Added ordered `[NNN]` numbers to every row in `docs/Phases/00_Phae_List.md` so the chronological canonical phase list can be referenced as a stable numbered sequence
148. +10 -2 - Updated `docs/Chill-Mode-Edits.md` so its instructions now match the current `AGENTS.md` chill-mode workflow and clearly mark this file as the canonical chill log without deleting or archiving older chill files

<!-- ============================================================ -->
### Chill Batch #1
<!-- ============================================================ -->

Status:
- compiled

Started:
- 2026-03-05 23:57

Ended:
- 2026-03-06 02:35

Mode:
- chill mode inactive

Consolidated To:
- `docs/CHANGELOG.md` `[101]`

Entries:
1. Chill mode activated for rapid-edit session
2. Added `docs/Wish-Features/radio-Sampler.md` based on the old `/14/replicad-app` radio feature and its per-control stable-random Keota cue behavior
3. Added `docs/Wish-Features/04 - Gizmo.md` with a parity plan to bring `/20/parahook` back to the old `/15.1` top-right clickable gizmo style and add the missing visual controls for line opacity, text, and text height
4. Added `docs/Wish-Features/11 - Environments.md` from the verified old Scenes system in `/14/replicad-app` and `/18/src/viewer/viewer.ts`, including the full Stars, Nebula, and Swarm control list
5. Renamed `docs/Wish-Features/11 - Environments.md` to `docs/Wish-Features/11 - Scenes.md` so the wishlist uses the original `Scenes` naming consistently
6. Added `docs/Architecture/History.md` with a plain-English per-repo timeline from `/1/` through `/20/`, covering the shift from the earliest worker-driven ParaHook prototype to the classic monolithic generator era, the `/18/` layered-engine reset, and the modern `/20/` React + Spaghetti architecture
7. Added `docs/Wish-Features/old-Wishes.md` as the master consolidated wishlist of notable old-app features and UX qualities missing, reduced, or only partially restored in `/20/`, including gizmo, scenes, radio, reference workspace, layers/materials, section-cut inspection, camera/framing, build/status UX, and the old all-in-one workbench feel
8. Added `docs/Architecture/System-Map.md` as the current `/20/` one-page architecture map covering the app shell, stores, selectors, Spaghetti compiler, build wiring, build dispatcher, worker runtime, viewer host, viewer, preview pipeline, and identity boundaries
9. Added `docs/Architecture/Glossary.md` defining the main `/20/` architecture terms including `PartArtifact`, `partKey`, `partKeyStr`, `slotId`, `viewerKey`, build identity, preview identity, Feature Stack, Spaghetti, OutputPreview, ViewerHost, and worker runtime
10. Added a chill-mode `Docs Header Rule` requiring docs created or edited during chill mode to maintain a local `Doc History` section near the top so stale docs are easier to spot
11. Numbered the entries in `Chill Batch #1` and updated this file to use its own local `Doc History` header
12. Updated the chill-mode docs rule so `Doc History` entries should be numbered newest-first and exempted `docs/chill-mode-ChangeList.md` from needing its own local `Doc History` section
13. Added numbered newest-first `Doc History` blocks to the chill-batch docs under `docs/Plan/Architecture` and `docs/Plan/Wish-Features`
14. Updated the doc history format to include `HH:MM` timestamps and applied that format to the chill-batch docs
15. Cleaned up `docs/Plans/File-List.md` into a structured reference doc with headers, grouped sections, a future-doc checklist at the top, and a local numbered `Doc History`
16. Added plain-English documentation and technical examples to `docs/Plans/Wish-Features/Spaghetti-Editor/01.4 - Nodes.md` explaining what nodes currently are in the Spaghetti system
17. Added a master Spaghetti inventory to `docs/Plans/Wish-Features/Spaghetti-Editor/01.0 - Master Spaghetti.md`, including the main editor elements, current node families, current part nodes, and the node types that can currently be spawned on the canvas
18. Added `docs/roadmap/LegacyList.md` as a practical cleanup map of likely dead ends, legacy seams, structural leftovers, and decisions needed across legacy mode, Spaghetti compatibility, node types, feature compatibility, and docs/folder drift
19. Cleaned up the formatting of the new `/00/` entry in `docs/Plans/Architecture/History.md` so it matches the rest of the repo timeline structure
20. Added `docs/Plans/Wish-Features/Jake-Mode.md` describing Jake mode as the simplified end-user editing layer on top of the Spaghetti-defined model, including drivers, control-viz handles, vec2 controls, multi-driver bindings, and future equations
21. Added `docs/Plans/Decisions.MD` as a decisions backlog covering unresolved product, architecture, Spaghetti, Jake mode, driver, control-viz, identity, viewer, multi-window, and docs/process choices
22. Added a `Decisions Made` section to `docs/Plans/Decisions.MD` and copied the first two resolved decisions there so settled choices are separated from the open backlog
23. Cleaned up `docs/Plans/Wish-Features/Spaghetti-Editor/01.3 - Wires ui` into a structured feature note for active wire visualization, render-path toggle behavior, selector-driven active-path derivation, and compile/build pulse animation
24. Added local `Doc History` blocks to the remaining Spaghetti editor docs so every file in `docs/Plans/Wish-Features/Spaghetti-Editor` now has one
25. Drafted `docs/Plans/Temp-CHANGELOG-Entry.md` as a temporary consolidated `CHANGELOG.md`-style entry for `Chill Batch #1` without touching the real permanent changelog
26. Added a safe final-response diff-summary rule to `AGENTS.md` requiring `Diff: +A / -B` for files Codex changed in the current task, or `Diff: unavailable` when a reliable per-task count cannot be computed
27. Added a header to `docs/change-List.md` explaining that it should remain a fast one-line index of completed changes, not a second full changelog
28. Added `docs/CodexContext/1_CodexContext.md` as a compact handoff of the main product direction, architecture rules, history reconstruction state, canonical doc sources, phase system, and workflow rules established in this conversation
29. Added `docs/CodexContext/History-Chats/1-CodexChat.md` in the structured summary-first chat-history format, using `## Conversation`, `### User Prompt`, and `#### Codex Response` to organize this docs-consolidation session
6. 2026-03-07 13:31 - +31 -4 - Added a `Changelog Format` block to the `docs/CHANGELOG.md` doc header so the file now documents its own entry wrapper, numbering rule, and heading-level structure

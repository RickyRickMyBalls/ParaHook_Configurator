# Catalog Gen2 Index

## Doc Header

### Doc History
102. 2026-04-21 20:29:36: Added and closed `Catalog-Gen2-19 - Catalog Info Page And Rail Utility Cleanup`, `Catalog-Gen2-HLG-24`, and `Catalog-Gen2-CLG-46` after the Catalog left browse rail was refocused on browse navigation, a single top-right `Catalog Info` action opened a combined content page for Staged Sources and Local Downloads, focused CatalogShell tests passed, and production build verification passed.
101. 2026-04-21 19:58:57: Closed `Catalog-Gen2-18`, `Catalog-Gen2-HLG-23`, `Catalog-Gen2-CLG-44`, and `Catalog-Gen2-CLG-45` after the live PubParts projection audit confirmed ParaHook-owned taxonomy mapping remains in `catalogSource.ts`, unknown PubParts labels stay raw metadata plus canonical `Other`, external PubParts item IDs now derive from stable source identity instead of list index, duplicate cached-source IDs remain unique with scoped identity metadata, focused Catalog source/live-source tests passed, and focused CatalogSurface live/source-options tests passed.
100. 2026-04-21 19:45:47: Marked `Catalog-Gen2-18 / Phase 1 - Runtime PubParts Metadata Refresh` complete in the Gen2 scan surface after the live PubParts metadata source owner, direct-then-same-origin Vite dev proxy metadata request fallback, baked-cache-first CatalogSurface live-swap wiring, upstream-only live part proof, failed-refresh baked-cache fallback proof, focused Catalog source tests, full CatalogSurface tests, and production build verification passed; marked `Catalog-Gen2-CLG-43` complete and moved dispatch to `Catalog-Gen2-18 / Phase 2 - Live Source Projection Taxonomy Audit` while keeping HLG 23 open for the taxonomy and source-update preservation audits.
99. 2026-04-21 19:37:28: Added `Catalog-Gen2-HLG-23`, `Catalog-Gen2-CLG-43` through `Catalog-Gen2-CLG-45`, and `Catalog-Gen2-18 - PubParts Live Source Sync And Normalized Projection` after the live PubParts `.json` endpoint discussion and the user's wishlist that Zinc-added PubParts entries should automatically appear in ParaHook on app refresh while ParaHook keeps normalized filters, source-options, local library, and Import/project ownership.
98. 2026-04-21 17:45:20: Closed `Catalog-Gen2-17 / Phase 5 - Final Audit And Follow-Ups`, `Catalog-Gen2-17`, and `Catalog-Gen2-HLG-22` after focused materialization, trusted-provider, source-library metadata index, Catalog source-options, and production build verification passed, confirming direct materialization status, Add To Project-triggered browser ZIP attempt, trusted-provider boundary, OPFS/Internal Library large-byte ownership, Upload ZIP fallback, metadata-only indexing, and Import review ownership are complete for the current lane while persistent IndexedDB/SQLite storage, real provider/native/API deployment, richer metadata UI, live end-to-end provider proof, Import/project, STEP, builder, compatibility, eager scan, and bulk archive import remain future-owner work.
97. 2026-04-21 17:42:01: Marked `Catalog-Gen2-17 / Phase 4 - Source-Library Metadata Index` complete in the Gen2 scan surface after the pure metadata-only PubParts source-library index/query owner passed focused source-library, materialization, provider, ZIP-preview, and production build verification; marked `Catalog-Gen2-CLG-42` complete and moved dispatch to `Catalog-Gen2-17 / Phase 5 - Final Audit And Follow-Ups` while keeping HLG 22 open until final audit confirms direct fetch, provider boundary, OPFS ownership, metadata indexing, Upload ZIP fallback, and Import ownership together.
96. 2026-04-21 17:31:25: Marked `Catalog-Gen2-17 / Phase 3 - Trusted Provider Boundary` complete in the Gen2 scan surface after the trusted source-byte provider boundary owner, default unavailable adapter, fake/injected provider tests, Phase 1 provider-materialized mapping, and same-path Catalog source-options proof passed focused and build verification; moved dispatch to `Catalog-Gen2-17 / Phase 4 - Source-Library Metadata Index` while keeping HLG 22 / CLG 42 open until metadata indexing and final audit phases land.
95. 2026-04-21 17:21:12: Marked `Catalog-Gen2-17 / Phase 2 - Browser Fetch Attempt And Fallback Status` complete in the Gen2 scan surface after the existing Add To Project-triggered PubParts ZIP browser attempt began reading through the Phase 1 materialization contract, same-path assertions covered browser-fetched and Internal Library cached archive bytes, focused Catalog/source materialization tests passed, and production build verification passed; moved dispatch to `Catalog-Gen2-17 / Phase 3 - Trusted Provider Boundary` while keeping HLG 22 / CLG 41-42 open until provider boundary, metadata indexing, and final audit phases land.
94. 2026-04-21 17:11:01: Marked `Catalog-Gen2-17 / Phase 1 - Direct Source Byte Materialization Contract` complete in the Gen2 scan surface after the pure PubParts source materialization contract/helper owner, focused contract tests, nearest PubParts source/downloads owner tests, and build verification passed; moved dispatch to `Catalog-Gen2-17 / Phase 2 - Browser Fetch Attempt And Fallback Status` while keeping HLG 22 / CLG 40-42 open until direct browser fetch, provider boundary, metadata indexing, and final audit phases land.
93. 2026-04-21 16:14:22: Added `Catalog-Gen2-HLG-22`, `Catalog-Gen2-CLG-40` through `Catalog-Gen2-CLG-42`, and `Catalog-Gen2-17 - Direct Source Byte Materialization And Library Metadata Index` after the PubParts/Dropbox buffer-streaming discussion, routing direct in-memory ZIP fetch, trusted source-byte provider/proxy/native boundaries, OPFS-first binary storage, and SQLite/IndexedDB metadata indexing into a new follow-up without rewriting completed Gen2 history.
92. 2026-04-21 15:49:20: Marked `Catalog-Gen2-HLG-19`, `Catalog-Gen2-CLG-35`, `Catalog-Gen2-CLG-36`, and `Catalog-Gen2-15` complete after the OPFS Internal Library and optional Local Library folder mirror work landed through Phase 3.1, including source-options reopen from OPFS, Home Page folder connect/reconnect/disable status, Catalog mirror status, best-effort visible-folder mirror writes from explicit app-owned archive/extracted bytes, OPFS-unavailable mirror proof, and no Dropbox bypass or Import/project auto-commit.
91. 2026-04-21 15:21:03: Marked `Catalog-Gen2-16`, `Catalog-Gen2-HLG-21`, `Catalog-Gen2-CLG-38`, and `Catalog-Gen2-CLG-39` complete after source-options gained uploaded/Internal Library cached PubParts ZIP entry `3D` preview with one-entry extraction, existing Catalog preview viewport reuse, object URL cleanup proof, metadata-only/no-byte/unsupported disabled states, no silent Dropbox fetch, and no Import/project/builder/compatibility side effects.
90. 2026-04-21 14:52:29: Added `Catalog-Gen2-HLG-21`, `Catalog-Gen2-CLG-38`, `Catalog-Gen2-CLG-39`, and `Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview` as the next staged importer preview lane, routing one explicit source-options `3D` preview action for supported uploaded or OPFS-cached PubParts ZIP entries through the existing Catalog preview viewport/reference loader path with object URL cleanup and no Import/project auto-commit.
89. 2026-04-21 12:12:03: Added and closed `Catalog-Gen2-HLG-20`, `Catalog-Gen2-CLG-37`, and `Catalog-Gen2-5 / Phase 3.1 - Verified Full Assembly Add To Project Activation` after the verified ADV and XR full assembly source entries gained available source-reference `Add To Project` behavior while temporary preview, Import-5 STEP fidelity, and load-as-starting-configuration runtime stayed planned.
88. 2026-04-21 11:55:57: Added `Catalog-Gen2-HLG-19`, `Catalog-Gen2-CLG-35`, `Catalog-Gen2-CLG-36`, and `Catalog-Gen2-15 - OPFS Internal Library And Local Folder Mirror` as the next PubParts source-library direction, making OPFS the default ParaHook Internal Library for cached source bytes/extracted files/manifests/inspection results and the user-selected Local Library folder an optional visible mirror.
87. 2026-04-21 11:36:42: Marked `Catalog-Gen2-14`, `Catalog-Gen2-HLG-18`, `Catalog-Gen2-CLG-33`, and `Catalog-Gen2-CLG-34` complete after the imported-reference ownership/rehydration closeout passed focused ViewerHost remount proof and build while preserving full UI click-through and direct split/exploded hardening as optional follow-up surfaces.
86. 2026-04-21 11:09:56: Reopened the Gen2 follow-up lane with `Catalog-Gen2-HLG-18`, `Catalog-Gen2-CLG-33`, `Catalog-Gen2-CLG-34`, and `Catalog-Gen2-14 - Imported Reference Ownership And Viewport Rehydration` after Bug 22 research showed accepted imported references can disappear when a model viewport remounts because global `referenceWorkspace` state can say `loaded` while the new `Viewer` instance has no runtime object loaded.
85. 2026-04-21 10:47:50: Manager-closed `Catalog-Gen2-13` after the scoped Catalog/Import handoff proof passed: `CatalogSurface.test.tsx` passed all 29 tests, targeted BrowserPanel staged Import review/preview tests passed, targeted useAppStore staged-import attribution/commit tests passed, and production build had already passed; recorded the broader full-suite BrowserPanel staged-structure/status failures and useAppStore graph/project-output failures as existing non-Catalog owner issues rather than blockers for the PubParts ZIP staged importer.
84. 2026-04-21 10:44:38: Implemented the approved `Catalog-Gen2-13 / Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit` label/status polish after the PubParts ZIP source-options final action became `Stage Selected to Import Review`, busy/status copy now names Import review, and focused Catalog surface assertions passed while preserving the existing `openStagedImportDraft({})` plus `appendStagedImportDraftFiles(files)` handoff with no direct Catalog `commitStagedImportDraft` or project acceptance; kept `Catalog-Gen2-13` open because the requested broader audit command still fails in existing BrowserPanel staged Import structure/status expectations and useAppStore graph/project-output expectations.
83. 2026-04-21 10:39:17: Prepped `Catalog-Gen2-13 / Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit` in the existing Future doc after researching Catalog source-options handoff, Import review, store commit, BrowserPanel tests, and useAppStore tests; kept the next dispatch on Phase 4 with a recommended small source-options final-action label polish plus docs/test audit proving Catalog stages selected PubParts ZIP files into Import review with attribution, Import remains the Add To Project acceptance gate, committed references are created through `commitStagedImportDraft`, and model viewport geometry display beyond committed reference state belongs to a later reference loader/viewer owner if not covered.
82. 2026-04-21 10:34:03: Closed `Catalog-Gen2-13 / Phase 3 - Preview Affordance For Previewable Supported Files` after staged ZIP entry rows gained an honest `Preview` field with `Preview: In Import review after staging` for selectable supported `step`, `stl`, `obj`, and `glb` entries and `Preview: Not available` for unsupported/blocked/unselectable entries, focused Catalog surface tests passed, and production build verification passed; moved the `Catalog-Gen2-13` dispatch read to `Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit` while keeping direct Catalog geometry preview, early extraction/object URLs, Import accept/project asset behavior, native downloads/folders, STEP fidelity, supported type expansion, builder behavior, and compatibility verdicts deferred.
81. 2026-04-21 10:29:15: Prepped `Catalog-Gen2-13 / Phase 3 - Preview Affordance For Previewable Supported Files` in the existing Future doc after researching Import/staged preview ownership, routing the next implementation to an honest staged ZIP row `Preview in Import review after staging` affordance for supported `step`, `stl`, `obj`, and `glb` entries while keeping direct Catalog geometry preview, early archive materialization, project acceptance, native downloads/folders, STEP fidelity, supported type expansion, builder behavior, and compatibility verdicts deferred.
80. 2026-04-21 10:25:54: Closed `Catalog-Gen2-13 / Phase 2 - ZIP Entry Staged Importer List` after ZIP archive candidates began rendering as staged ZIP entry rows with archive path, file name, type, formatted size, support state, blocked reason when present, selected state, stable selectors, preserved source metadata, preserved selection controls, focused Catalog surface/shell tests, and production build verification; moved the `Catalog-Gen2-13` dispatch read to `Phase 3 - Preview Affordance For Previewable Supported Files`.
79. 2026-04-21 10:22:03: Prepped `Catalog-Gen2-13 / Phase 2 - ZIP Entry Staged Importer List` in the existing Future doc with the exact staged row fields, disabled entry states, selection behavior, source metadata persistence, final action boundary, focused tests, and no-preview/no-project-asset/no-native-download/no-ZIP-rule-change constraints while keeping the next dispatch on Phase 2 implementation.
78. 2026-04-21 10:19:01: Closed `Catalog-Gen2-13 / Phase 1 - Download And Upload Source Actions` after PubParts ZIP source options gained staged importer shell copy, PubParts source metadata, browser-honest `Download ZIP` guidance with Dropbox `dl=1` link preference where possible, explicit `Upload ZIP` local file grant wording, focused Catalog surface/shell tests, and `npm.cmd run build` verification; moved the `Catalog-Gen2-13` dispatch read to `Phase 2 - ZIP Entry Staged Importer List` while keeping preview, native downloads, folder ownership, Import accept changes, and accepted project asset changes deferred.
77. 2026-04-21 10:10:45: Added `Catalog-Gen2-HLG-17` and `Catalog-Gen2-CLG-28` through `Catalog-Gen2-CLG-32`, created `Catalog-Gen2-13 - PubParts ZIP Staged Importer And Preview Handoff` as a new follow-up rather than extending completed `Catalog-Gen2-12`, and set `Catalog-Gen2-13 / Phase 1 - Download And Upload Source Actions` as the proposed first implementation phase for Manager approval.
76. 2026-04-21 01:19:48: Closed `Catalog-Gen2-12 / Phase 5.1 - Local ZIP Fallback For Browser-Blocked PubParts Archives` after PubParts source options gained a `Choose Local ZIP` fallback for live Dropbox ZIP fetch failures, local ZIP blobs list through the existing archive helper, supported entries can be selected and staged from the picked local ZIP into Import review with PubParts attribution, the focused Catalog surface test passed, and eager downloads, native disk writing, remote-byte proxy, persistent ZIP bytes, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts remain deferred.
75. 2026-04-21 01:16:11: Reopened the `Catalog-Gen2-HLG-16` completion read and set `Catalog-Gen2-12 / Phase 5.1 - Local ZIP Fallback For Browser-Blocked PubParts Archives` as the next dispatch after live PubParts Dropbox ZIP fetches proved browser-blocked from localhost/ParaHook, preserving the shipped readable-blob ZIP listing/extraction/cache work while planning a user-picked local `.zip` fallback with no eager downloads, native disk writing, remote-byte proxy, `.stp` support, STEP fidelity, builder behavior, or compatibility verdicts.
74. 2026-04-21 00:57:42: Closed `Catalog-Gen2-12 / Phase 5 - ZIP Lane Final Audit` and the reopened ZIP lane after docs/test audit confirmed `Catalog-Gen2-HLG-16` and CLG 23-26 are satisfied, selected supported entries from ZIP-backed PubParts items stage into Import review with PubParts attribution, focused ZIP/cache/resolver/surface/shell tests and `npm.cmd run build` passed, and eager ZIP downloads, extract-all behavior, persistent ZIP bytes, local library/native downloads, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts remain deferred.
73. 2026-04-21 00:50:16: Marked `Catalog-Gen2-12 / Phase 4 - Archive Manifest Cache` complete after ZIP source options gained a metadata-only archive manifest cache keyed by provider, Catalog item id, Dropbox ZIP source URL, and `archiveLastUpdated` / PubParts `dropboxZipLastUpdated`, cache hits skip listing fetches while selected extraction still revalidates against real ZIP bytes, focused cache/resolver/surface/ZIP tests passed, and `npm.cmd run build` passed; set `Catalog-Gen2-12 / Phase 5 - ZIP Lane Final Audit` as the next dispatch while keeping `Catalog-Gen2-HLG-16` open until final audit.
72. 2026-04-21 00:38:11: Marked `Catalog-Gen2-12 / Phase 3 - Selected ZIP Entry Extraction To Import Review` complete after selected supported ZIP entries gained guarded extraction from the inspected archive blob, PubParts archive candidates materialize into staged Import review files with object URLs and attribution, direct/archive mixed selections stage all-or-nothing, focused ZIP/resolver/surface/shell tests passed, and `npm.cmd run build` passed; set `Catalog-Gen2-12 / Phase 4 - Archive Manifest Cache` as the next dispatch while keeping `Catalog-Gen2-HLG-16` open.
71. 2026-04-21 00:25:32: Marked `Catalog-Gen2-12 / Phase 2 - Source Options Real ZIP Listing` complete after the source-options flow gained user-triggered real ZIP listing through the async shared-link inspection path, retired the hard-coded Gripples manifest proof, preserved direct shared-file staging, and passed focused ZIP/resolver/surface/shell tests plus `npm.cmd run build`; set `Catalog-Gen2-12 / Phase 3 - Selected ZIP Entry Extraction To Import Review` as the next dispatch while keeping `Catalog-Gen2-HLG-16` open.
70. 2026-04-21 00:15:14: Marked `Catalog-Gen2-12 / Phase 1 - Browser ZIP Reader And Entry Manifest Contract` complete after the browser ZIP dependency, pure archive entry helper, fixture ZIP tests, focused resolver proof, and production build landed; set `Catalog-Gen2-12 / Phase 2 - Source Options Real ZIP Listing` as the next dispatch while keeping `Catalog-Gen2-HLG-16` open until source-options listing, selected extraction, Import staging, and manifest caching are complete.
69. 2026-04-21 00:06:31: Reopened Generation 2 with `Catalog-Gen2-12 - Efficient PubParts ZIP Inspection And Selected Extraction` because the current cached PubParts corpus is ZIP-first, adding real one-archive-at-a-time ZIP entry listing, selected supported-file extraction, Import review staging, and manifest-cache goals without deleting the completed `Catalog-Gen2-11` shared-link history.
68. 2026-04-20 23:55:14: Closed `Catalog-Gen2-11 / Phase 3 - Shared-Folder Candidate Listing` and the current-corpus `Catalog-Gen2-11` lane as a docs/test audit after Manager denied the fake folder fixture seam, confirmed the cached PubParts full-parts corpus has 305 Dropbox source URLs, all 305 are `.zip`, and zero shared-folder records exist, marked `Catalog-Gen2-HLG-15` and `Catalog-Gen2-CLG-22` complete for current data, and kept real archive extraction, Dropbox shared-folder listing, API/helper/native materialization, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts deferred.
67. 2026-04-20 23:47:52: Closed `Catalog-Gen2-11 / Phase 2 - ZIP And Archive Candidate Inspection` after the shared-link resolver gained a deterministic manifest-backed candidate provider for the real `3d Printed Gripples` PubParts ZIP, the source-options dialog exposed supported and unsupported archive entries as metadata-only choices with paths and sizes, focused resolver/surface tests passed, and `npm.cmd run build` passed; kept shared-folder listing as the next `Catalog-Gen2-11` follow-up.
66. 2026-04-20 23:35:27: Closed `Catalog-Gen2-11 / Phase 1 - Dropbox Shared Direct File Resolver` after PubParts `Add To Project` began opening the source-options window, direct supported shared-file links gained resolver/fetch staging into Import review with PubParts attribution, ZIP/archive links stayed visible but disabled as inspection-needed candidates, focused Catalog/source tests passed, and `npm.cmd run build` passed; set `Catalog-Gen2-11 / Phase 2 - ZIP And Archive Candidate Inspection` as the next Gen2 follow-up target.
65. 2026-04-20 23:26:39: Added the floating staged-source options window requirement to `Catalog-Gen2-11`, so `Add To Project` opens a chooser-like Catalog dialog for resolved PubParts link candidates and lets the user pick one, some, or all supported files before staging them into Import review.
64. 2026-04-20 23:23:02: Reopened the Gen2 forward plan with `Catalog-Gen2-11 - Dropbox Shared-Link Resolver And Candidate Choice`, separating the completed Chooser bridge from the PubParts-owned shared-link path where `Add To Project` should classify and resolve direct shared files first, then later inspect ZIP/archive and shared-folder candidates without requiring the user to own the Dropbox files.
63. 2026-04-20 23:01:58: Closed `Catalog-Gen2-10 - Dropbox Chooser Add-To-Project Bridge` and the reopened Generation 2 Dropbox follow-up after Catalog gained a typed Dropbox Chooser adapter, PubParts item-page `Add To Project` routing, direct temporary-link fetch into staged Import review, PubParts attribution preservation, chooser unavailable/canceled/unsupported/fetch-failed status reads, local fallback controls, focused tests, and build verification without shipping full Dropbox shared-link API inspection, folder listing, archive extraction, native download, STEP fidelity, builder behavior, or compatibility verdicts.
62. 2026-04-20 22:16:38: Reopened Generation 2 with `Catalog-Gen2-10 - Dropbox Chooser Add-To-Project Bridge`, planning Dropbox Chooser as the recommended first direct Dropbox integration so `Add To Project` can let the user choose an exact supported file and hand the fetched result to Import with PubParts attribution while deferring the heavier Dropbox shared-link API inspector, folder listing, archive extraction, native download, STEP fidelity, builder behavior, and compatibility verdicts.
61. 2026-04-20 21:52:10: Closed `Catalog-Gen2-9 - Local PubParts Library Folder And Auto-Discovery Handoff` and the reopened Generation 2 local-download loop after PubParts local-library metadata, per-item manifests/folder paths, Home Page PubParts Library toggle/status, Catalog `Local Downloads`, one advancing item-page action, Import-owned local file picker handoff, focused tests, and `npm.cmd run build` shipped without silent disk scanning, automatic folder creation, remote byte fetching, archive extraction, native direct download, STEP fidelity, builder behavior, or compatibility verdicts.
60. 2026-04-20 20:41:48: Closed the user-requested `Catalog-Gen2-5 / Phase 2.3 - Catalog Surface Cleanup And Scroll Containment` UI cleanup after Catalog gained scoped dark scrollbars, contained browse-rail/staged-source overflow, compact typography, long-text wrapping, square item-page previews, focused tests, and build verification without reopening source contracts, preview/import behavior, or starting-configuration runtime.
59. 2026-04-20 20:32:22: Simplified the `Catalog-Gen2-9` user-facing action model so PubParts item pages should expose one primary local-library action whose label advances through setup, download/open-source, scan, import, and later preview states instead of separate process buttons, while preserving the deeper folder/scan/import states for implementation.
58. 2026-04-20 20:24:16: Expanded `Catalog-Gen2-9` so the PubParts local library workflow now explicitly requires a Home Page PubParts Library toggle/status surface and a Catalog `Local Downloads` section for downloaded, discovered, unsupported, needs-extraction, import-ready, and imported PubParts items.
57. 2026-04-20 20:15:13: Reopened Gen2 with `Catalog-Gen2-9 - Local PubParts Library Folder And Auto-Discovery Handoff` after the shipped `Open Source Download` browser handoff proved too loose for local organization, adding a user-granted PubParts library folder, per-item folder convention, source manifests, local scan/import handoff, and Import-family ownership boundary without deleting landed Gen2-8 history.
56. 2026-04-20 20:03:53: Closed `Catalog-Gen2-8 / Phase 8 - Remote Source Download And Import Owner Bridge`, `Catalog-Gen2-8`, and the reopened Catalog-owned Generation 2 PubParts import-button lane after source-download/open handoff, local staged Import dialog bridging, and PubParts source attribution preservation shipped with focused tests and `npm.cmd run build`, while remote byte fetching, archive extraction/listing, `.stp` support, STEP loader fidelity, builder behavior, and compatibility verdicts remain later Import/Generation owners.
55. 2026-04-20 18:57:19: Added `Catalog-Gen2-8 / Phase 8 - Remote Source Download And Import Owner Bridge` as the next Worker prep target after Phase 7 closed selected-file handoff/status but left real PubParts download/import ownership, Dropbox ZIP/archive extraction, `.stp` support, local staged import bridging, and imported-reference source attribution unresolved.
54. 2026-04-20 18:53:03: Closed `Catalog-Gen2-8 / Phase 7 - Selected File Import Handoff` as a scoped selected-file Import-family handoff/status implementation after selected supported PubParts direct file candidates gained source-attributed item-page handoff reads, focused tests and `npm.cmd run build` passed, and broader remote URL download/import/project asset ownership stayed open for Import-family routing.
53. 2026-04-20 18:40:07: Closed `Catalog-Gen2-8 / Phase 6 - Supported File Classification And Chooser` after staged PubParts source records gained metadata-only supported direct file candidate selection, item-page chooser/no-selectable states, focused Catalog tests and `npm.cmd run build` passed, and the next Worker prep target moved to `Catalog-Gen2-8 / Phase 7 - Selected File Import Handoff`.
52. 2026-04-20 18:30:32: Closed `Catalog-Gen2-8 / Phase 5 - User-Triggered Source And Archive Inspection` after staged PubParts source records gained user-triggered metadata inspection results, direct supported file URL classification, archive/shared-source needs-inspection states, focused Catalog tests and `npm.cmd run build` passed, and the next Worker prep target moved to `Catalog-Gen2-8 / Phase 6 - Supported File Classification And Chooser`.
51. 2026-04-20 18:20:27: Closed `Catalog-Gen2-8 / Phase 4 - Staged Downloads List And Clear Controls` after the Catalog browse rail gained staged PubParts source metadata list and clear controls, focused Catalog tests and `npm.cmd run build` passed, and the next Worker prep target moved to `Catalog-Gen2-8 / Phase 5 - User-Triggered Source And Archive Inspection`.
50. 2026-04-20 18:14:03: Closed `Catalog-Gen2-8 / Phase 3 - User-Triggered Source Download Or Staging` after metadata-only PubParts source-link staging shipped into the dedicated downloads bucket with staged/not-imported item-page status, focused Catalog tests and `npm.cmd run build` passed, and the next Worker prep target moved to `Catalog-Gen2-8 / Phase 4 - Staged Downloads List And Clear Controls`.
49. 2026-04-20 18:04:30: Closed `Catalog-Gen2-8 / Phase 2 - External Source Action Boundary` after external PubParts item pages gained a disabled linked-archive-only `Inspect Files Planned` source-action boundary, focused Catalog tests and `npm.cmd run build` passed, and the next Worker prep target moved to `Catalog-Gen2-8 / Phase 3 - User-Triggered Source Download Or Staging`.
48. 2026-04-20 18:00:02: Closed `Catalog-Gen2-8 / Phase 1 - PubParts Download Storage And Home Visibility` as a docs/test closeout after focused Home storage tests and `npm.cmd run build` passed, confirming the existing PubParts downloads storage bucket and Home Page visibility satisfy the revised Phase 1 ownership without a `Phase 1.1`; set `Catalog-Gen2-8 / Phase 2 - External Source Action Boundary` as the next Worker prep target.
47. 2026-04-20 17:51:12: Refined the forward `Catalog-Gen2-8` plan around the external source entry to staged/downloaded source to imported project asset lifecycle, adding PubParts download staging, Home visibility, downloaded-versus-imported status, staged clear controls, source classification, chooser, and import handoff items without deleting any landed Gen2 history phases.
46. 2026-04-20 17:44:53: Added the PubParts downloads local storage bucket and Home Page storage display as `Catalog-Gen2-8 / Phase 1` groundwork, keeping it as staging/storage visibility before source inspection, archive download, chooser, or import behavior ships.
45. 2026-04-20 17:40:54: Created `Future/Catalog-Gen2-8 - External PubParts Supported-File Import Handoff.md` and set `Catalog-Gen2-8 / Phase 1 - External Import Action Boundary` as the next Worker prep target.
44. 2026-04-20 17:38:22: Reopened Gen2 with `Catalog-Gen2-8 - External PubParts Supported-File Import Handoff`, adding an honest user-triggered import lane for external PubParts entries that must inspect linked source/archive contents, show supported-file choices, and hand selected files to the existing import/project pipeline without pretending external links are repo-local assets.
43. 2026-04-20 17:18:15: Closed `Catalog-Gen2-7 / Phase 3 - Eager PubParts Preview Images`, the `Catalog-Gen2-7` follow-up family, and the reopened Gen2 wishlist after PubParts preview image URLs gained PubParts-origin normalization, external PubParts images began rendering eagerly in grid cards and item pages, focused PubParts/cache/source/shared/surface tests and `npm.cmd run build` passed, and archive/model/STEP/builder/add-to-project behavior remained unchanged.
42. 2026-04-20 17:11:42: Closed `Catalog-Gen2-7 / Phase 2 - All Cached PubParts Parts In Catalog` after live `CatalogSurface` began composing the full 319-record PubParts part cache, external items began contributing to section options, focused PubParts/source/shared/surface tests and `npm.cmd run build` passed, and `Catalog-Gen2-7 / Phase 3 - Eager PubParts Preview Images` became the next Worker prep target.
41. 2026-04-20 17:05:37: Accepted `Catalog-Gen2-7 / Phase 1 - Full PubParts Cache Coverage` after the deterministic full `parts.json` cache, 319-record source module, deduped full part helper, focused PubParts/cache/source tests, and `npm.cmd run build` passed; set `Catalog-Gen2-7 / Phase 2 - All Cached PubParts Parts In Catalog` as the next Worker prep target and noted that eager image display still must normalize PubParts-root-relative image paths.
40. 2026-04-20 16:51:27: Reopened the Generation 2 working wishlist with `Catalog-Gen2-7 - Full PubParts Catalog Population And Eager Image Display`, adding full cached PubParts part population and eager external image preview display as the next Worker prep target while preserving the earlier scoped Gen2 closeout as the completed core baseline.
39. 2026-04-20 16:38:24: Closed `Catalog-Gen2-6 / Phase 3 - Final Generation 2 Audit And Follow-Up Routing` and Generation 2 as a docs/test audit after focused Catalog tests and `npm.cmd run build` passed, marking the Gen2 HLG/CLG complete under scoped source/metadata/organization/starting-assembly proof while preserving later-owner deferrals for archive runtime, builder runtime, compatibility verdicts, Import-5 STEP fidelity, GT/Pint/XR Classic source-missing starts, future Power/Fasteners growth, and staging-folder extras.
38. 2026-04-20 16:29:35: Corrected the `Catalog-Gen2-6` family section dispatch read so it matches the index-level next Worker prep target, routing the loop to `Catalog-Gen2-6 / Phase 3 - Final Generation 2 Audit And Follow-Up Routing` after Phase 2 closeout.
37. 2026-04-20 16:28:29: Closed `Catalog-Gen2-6 / Phase 2 - Compatibility And Sub-Assembly Metadata Notes` as a docs/test audit after focused Catalog tests and `npm.cmd run build` passed, confirming Gen2 has compatibility-friendly source/platform/start metadata but no truthful part-to-part rules, rear-box sub-assembly requirements, battery/BMS/wiring source truth, dimensional proof, Ricky Checker, or builder runtime; set `Catalog-Gen2-6 / Phase 3 - Final Generation 2 Audit And Follow-Up Routing` as the next Worker prep target.
36. 2026-04-20 16:23:49: Closed `Catalog-Gen2-6 / Phase 1 - Builder-Friendly Metadata Boundary` as a docs/test audit after focused Catalog tests and `npm.cmd run build` passed, confirming the current planned starting assembly, planned source, source asset-set, action-plan, and source-lane contracts already provide the sparse builder-friendly boundary while keeping builder runtime, load-as-starting-config behavior, compatibility verdicts, placeholders, staging-file moves, and Import-5 loader work out of scope; set `Catalog-Gen2-6 / Phase 2 - Compatibility And Sub-Assembly Metadata Notes` as the next Worker prep target.
35. 2026-04-20 16:19:01: Created `Future/Catalog-Gen2-6 - Metadata Groundwork For Later Builder And Compatibility.md` as the final planned Gen2 family phase doc, routing builder-friendly metadata, compatibility/sub-assembly notes, and final HLG/CLG audit into three Worker-prepped phases.
34. 2026-04-20 16:15:56: Closed `Catalog-Gen2-5 - Pre-Built PubWheel Starting Assemblies` after Phase 3 verified the planned/unavailable starting-configuration handoff with focused Catalog tests and `npm.cmd run build`, keeping ADV and XR as the only current known-source planned starting assembly entries, recording GT/Pint/XR Classic as source-missing and placeholder-unapproved, and setting `Catalog-Gen2-6 / Phase 1` as the next Worker prep target.
33. 2026-04-20 16:12:18: Aligned the current planning read after the assistant-added XR STEP/GLB asset-set work was verified, marking `Catalog-Gen2-4.5` as complete for current supplied files and keeping `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State` as the active next Worker prep target.
32. 2026-04-20 16:08:29: Closed `Catalog-Gen2-4.5 - Repo-Backed XR And ADV Asset Folder Intake` for current supplied files after Phase 3 verified the copied Catalog asset set is only the XR PubWheel STEP/GLB pair, left staging-folder files unclassified, and passed focused Catalog tests plus `npm.cmd run build`; set `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State` as the next Worker prep target.
31. 2026-04-20 16:02:39: Recorded `Catalog-Gen2-4.5 / Phase 2 - XR PubWheel 1 Asset Set Migration` complete after the live XR planned seed gained `pubwheel_1` / `v1` source asset-set variants for the STEP preferred source and GLB companion mesh while keeping one Catalog card, bridge fields, disabled planned behavior, and ADV bridge-only; set `Catalog-Gen2-4.5 / Phase 3 - Asset Folder Convention Closeout And Starting Assembly Handoff` as the next Worker prep target.
30. 2026-04-20 15:55:39: Recorded `Catalog-Gen2-4.5 / Phase 1 - Versioned Multi-File Asset Set Contract` complete after Catalog gained planned-source asset-set contract/read support with fixture proof for `pubwheel_1` / `v1` STEP and GLB variants while leaving live XR seed migration to Phase 2; set `Catalog-Gen2-4.5 / Phase 2 - XR PubWheel 1 Asset Set Migration` as the next Worker prep target.
29. 2026-04-20 15:45:58: Added `Catalog-Gen2-HLG-6` and `Catalog-Gen2-CLG-10` for versioned multi-file Catalog item assets, created `Future/Catalog-Gen2-4.5 - Repo-Backed XR And ADV Asset Folder Intake.md`, and reset the next Worker prep target to `Catalog-Gen2-4.5 / Phase 1 - Versioned Multi-File Asset Set Contract` before the starting-configuration handoff continues.
28. 2026-04-20 15:40:36: Recorded the supplied XR PubWheel full-assembly STEP/GLB files under `public/Catalog/assemblies/xr/`, added `Catalog-Gen2-5 / Phase 2.2 - XR PubWheel Planned Starting Assembly Source` as complete, and kept `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State` as the next Worker prep target.
27. 2026-04-20 15:35:34: Recorded `Catalog-Gen2-5 / Phase 2.1 - Planned Starting Assembly Entry Contract For Heavy STEP Starts` complete after Catalog gained a distinct planned source kind, plannedItems snapshot lane, one disabled ADV planned starting assembly card, and planned action/read copy without repo `assetPath` preview, placeholder platform assemblies, Import-5 loader work, or builder load behavior; set `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State` as the next Worker prep target.
26. 2026-04-20 15:27:18: Recorded `Catalog-Gen2-5 / Phase 2 - Curated Platform Starting Assembly Entries` complete as a docs-only truthfulness/routing closeout after the verified 55.8 MB ADV STEP source candidate was kept out of live on-demand preview, and set `Catalog-Gen2-5 / Phase 2.1 - Planned Starting Assembly Entry Contract For Heavy STEP Starts` as the next Worker prep target.
25. 2026-04-20 15:19:27: Added `Import-5 - STEP Import Metadata, Units, And Loader Fidelity` as the cross-family owner for STEP loader fidelity so `Catalog-Gen2-5` Phase 2 can prefer `.step` / `.stp` starting-assembly source assets without taking over STEP units, tessellation, heavy-load progress, parse reuse, or loader-parameter behavior.
24. 2026-04-20 15:16:50: Recorded `Catalog-Gen2-5 / Phase 1 - Starting Assembly Contract And Boundary` complete after the optional starting-assembly contract/read seam shipped without a new action kind or live curated assembly entries; set `Catalog-Gen2-5 / Phase 2 - Curated Platform Starting Assembly Entries` as the next Worker prep target.
23. 2026-04-20 15:08:55: Clarified that repo-backed XR/ADV asset intake should prefer `.step` and `.stp` source files, created `Future/Catalog-Gen2-5 - Pre-Built PubWheel Starting Assemblies.md`, and set `Catalog-Gen2-5 / Phase 1 - Starting Assembly Contract And Boundary` as the next Worker prep target while leaving `Catalog-Gen2-4.5` pending for actual user-supplied STEP asset batches.
22. 2026-04-20 15:06:08: Added `Catalog-Gen2-4.5 - Repo-Backed XR And ADV Asset Folder Intake` as the Manager handoff lane for user-supplied XR/ADV repo-backed assets, defining the folder-convention, loose-part versus starting-assembly split, and future-doc target before `Catalog-Gen2-5` consumes complete assemblies.
21. 2026-04-20 15:00:43: Closed `Catalog-Gen2-4 - System-Level Part Organization` after Phase 3 docs/test audit verified the `Rim Saver` wheel-owned guardrail with focused tests and `npm.cmd run build`, marked current Platform/Wheel organizer coverage complete while leaving Later Power and Later Fasteners open/deferred, and set `Catalog-Gen2-5 / Phase 1` as the next Worker prep target.
20. 2026-04-20 14:57:12: Closed `Catalog-Gen2-4 / Phase 2 - Platform-Owned Part Type Mapping` as a docs/test audit after focused verification and `npm.cmd run build` passed, confirming the already-shipped `Footpad Attachment` and `Controller Box` platform-owned mappings while setting `Catalog-Gen2-4 / Phase 3 - Wheel-Owned Part Guardrails And Closeout` as the next Worker prep target.
19. 2026-04-20 14:51:41: Recorded `Catalog-Gen2-4 / Phase 1 - External Type System Mapping Baseline` complete after external PubParts source `typeOfPart` labels began mapping into existing ParaHook `systemKey`, `partType`, and safe `partGroups` fields while preserving raw source metadata; set `Catalog-Gen2-4 / Phase 2 - Platform-Owned Part Type Mapping` as the next Worker prep target.
18. 2026-04-20 14:46:42: Created `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-4 - System-Level Part Organization.md` as the next family phase doc, blocking PubParts `typeOfPart` mapping into external type baseline, platform-owned part mapping, and wheel-owned guardrail phases while keeping Power/Fasteners expansion, fake motor/tire records, and compatibility verdicts out of scope.
17. 2026-04-20 14:45:20: Closed `Catalog-Gen2-3 - Platform And Fitment Normalization` after Phase 3 verified canonical external platform filtering and searchable source metadata through existing tests without runtime changes; set `Catalog-Gen2-4 / Phase 1` as the next Worker prep target while leaving `typeOfPart` to system/part-group mapping and compatibility verdict work with their later owners.
16. 2026-04-20 14:40:00: Recorded the completed `Catalog-Gen2-3 / Phase 2 - Sub-Platform Tags And Narrow Fitment Notes` implementation after `GT/GT-S`, `GT-S`, and `GTS` source labels gained a metadata-only `Source Fitment Note` while broad canonical `GT` compatibility stayed unchanged; set `Catalog-Gen2-3 / Phase 3 - External Platform Filter And Search Read` as the next Worker prep target and noted it should likely prep as a docs/test closeout audit.
15. 2026-04-20 14:34:12: Recorded the completed `Catalog-Gen2-3 / Phase 1 - Canonical External Platform Mapping` implementation after external PubParts platform labels began mapping into ParaHook-owned `platformCompatibility` values while preserving raw source metadata; set `Catalog-Gen2-3 / Phase 2 - Sub-Platform Tags And Narrow Fitment Notes` as the next Worker prep target.
14. 2026-04-20 14:29:03: Created `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-3 - Platform And Fitment Normalization.md` as the next family phase doc after the Gen1 fitment gate, routing canonical platform mapping, sub-platform notes, and normalized external platform filter/search read into three Worker-prepped implementation phases.
13. 2026-04-20 14:25: Recorded the completed `Catalog-7 / Phase 4` Gen1 fitment gate and set the next Worker prep target to `Catalog-Gen2-3 / Phase 1` so platform and fitment normalization can start after the local wheel-fitment contract/display seam landed without fake motor or tire source records.
12. 2026-04-20 14:19:27: Closed `Catalog-Gen2-2` as complete for honest external source-page, linked archive metadata, and archive classification handoff, while keeping runtime archive download, extraction, import, and supported-file user choice deferred to a later owner; set `Catalog-7 / Phase 4 - Wheel-Specific Motor And Tire Fitment Fields` as the next gate before `Catalog-Gen2-3`.
11. 2026-04-20 14:15:51: Accepted `Catalog-Gen2-2 / Phase 3 - Supported Versus Unsupported Archive Classification` after linked archive/file candidates gained metadata-only supported, unsupported, unknown, no-linked-archive, and archive-container classifications without download, extraction, import, or chooser behavior; kept `Catalog-Gen2-2 / Phase 4` required as the next Worker prep target.
10. 2026-04-20 14:09:46: Accepted `Catalog-Gen2-2 / Phase 2 - Linked Archive Metadata And Handoff States` after linked archive URLs became inspect-only source handoff metadata with no archive download, extraction, import, classification, or action-kind widening; set `Catalog-Gen2-2 / Phase 3` as the next Worker prep target.
9. 2026-04-20 14:02:26: Accepted `Catalog-Gen2-2 / Phase 1 - External Source Page Action Support` after external item pages gained a source-details source-page link affordance with no action-kind, archive/import, or platform/fitment widening; set `Catalog-Gen2-2 / Phase 2` as the next Worker prep target.
8. 2026-04-20 13:53:53: Marked `Catalog-Gen2-1 - External Catalog Source Intake` complete after the external source contract, cached PubParts intake, explicit external snapshot lane, and live external-linked attribution shipped; created `Catalog-Gen2-2 - Linked Models And Archive Handoff` as the next family phase doc and set `Catalog-Gen2-2 / Phase 1` as the next Worker prep target.
7. 2026-04-20 13:10:23: Repaired this index after `Catalog-Gen2-0` completion so the readiness family phase, `G2-0.1` through `G2-0.7`, and `Catalog-Gen2-CLG-0` are marked complete while the broader Gen2 HLG remain open.
6. 2026-04-20 13:06:35: Created `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-1 - External Catalog Source Intake.md` from the accepted `Catalog-Gen2-0` handoff, and updated this index so the external source intake family phase doc is linked as created with `Catalog-Gen2-1 / Phase 1` as the next Worker prep target.
5. 2026-04-20 12:53:31: Added `Catalog-Gen2-0` as the Generation 2 intake-readiness and source-mapping baseline family phase, routing the no-CORS PubParts live-fetch finding, cached normalized source intake decision, current Catalog source audit, and `Catalog-7 / Phase 4` fitment gate before the external source intake lane.
4. 2026-04-20 12:34:34: Cleaned this Generation Index Doc around the newer `Vision`, `Wishlist Organization`, and top-level family-phase routing shape, preserving the six existing Generation 2 lanes while making `Catalog-Gen2-1` the first Dispatch 4 Simple prep target for PubParts JSON source-adapter planning.
3. 2026-04-20 12:22:14: Recorded the live PubParts `.json` endpoint shape for `Generation 2`, clarifying that `parts.json`, filtered part JSON pages, and `resources.json` can feed the first source adapter while keeping source fields mapped into ParaHook-owned Catalog metadata instead of replacing the local contract.
2. 2026-04-16 12:14:00: Expanded the `Generation 2` wishlist tracking again so external-link intake now distinguishes Dropbox shared-folder links from ZIP-file links, adding explicit tracking items for inspect-first folder intake, staged ZIP inspection, supported-versus-unsupported file classification, and user choice over which supported files to import
1. 2026-04-16 11:55:00: Added this dedicated `Catalog-Gen2-Index.md` planning surface so the newer `Generation 2` catalog direction has one focused home for wishlist tracking around PubParts intake, linked `3D` model entries, platform compatibility normalization, system-level part organization, and pre-built PubWheel onboarding before those lanes split into narrower implementation phases

### Purpose

This file is the Generation Index Doc for `Catalog Generation 2`.

Use it to answer:
- what `Generation 2` of `Catalog` is supposed to add beyond the repo-backed `Generation 1` baseline
- which `Catalog-Gen2` HLG and CLG belong to this generation
- how Gen2 wishlist items route into coherent family phases
- which family phase should become the next standalone `Future/` phase doc
- where PubParts JSON intake fits without replacing ParaHook's local catalog contract

### Scope

This doc covers:
- Generation 2 intake readiness and source-mapping baseline
- curated external catalog integration
- PubParts JSON source intake
- linked `3D` model entries and linked archive intake direction
- PubParts normalization into the ParaHook catalog shape
- platform and fitment normalization for external platform parts
- system-level part organization for `Generation 2`
- repo-backed XR/ADV asset folder intake and classification planning
- pre-built PubWheel starting assembly onboarding
- metadata groundwork for later builder and compatibility work
- user-triggered PubParts download staging and supported-file import handoff from curated external PubParts entries
- user-granted local PubParts library folder organization and auto-discovery handoff for user-downloaded PubParts files
- Catalog local-downloads browse/status section and Home Page local-library toggle coordination
- source-options `3D` preview for one supported uploaded or cached PubParts ZIP entry before Import review staging

This doc does not cover:
- `Generation 1` local repo-backed taxonomy completion
- the full `Generation 3` compatibility-check runtime
- the later `Ricky Checker` rules engine
- the later `Generation 3.5` dimensional fit math
- automatic import of every file behind an external source/archive link
- silent browser access to arbitrary local folders without explicit user permission
- owning local filesystem file handles, archive extraction, or staged file-object creation when that belongs to the Import family
- STEP loader fidelity details that belong to the Import family
- treating uploaded/cached ZIP entry preview as Import review staging, project acceptance, builder load, or compatibility proof

## Doc Body

### Short Version

`Catalog Generation 2` widens Catalog from a repo-backed curated asset library into a richer curated external part system.

The main additions are:
- Generation 2 intake readiness and source-mapping baseline
- curated external catalog intake, starting with `pubparts.xyz`
- linked `3D` model entries and linked archive handoff
- stronger platform compatibility normalization for external source records
- higher-level part-system organization beyond one flat platform list
- pre-built PubWheel starting assembly entries
- metadata groundwork for later builder and compatibility systems
- PubParts download staging with visible staged-versus-imported status
- user-triggered supported-file import handoff from external PubParts entries

PubParts now has a direct structured-data intake path. Adding `.json` to browse pages returns the relevant JSON array for that page.

The first known endpoints are:
- `https://pubparts.xyz/parts.json`
- filtered part pages such as `https://pubparts.xyz/parts/gt.json`
- `https://pubparts.xyz/resources.json`

Important rule:
- PubParts records are source truth, not ParaHook's runtime schema
- Gen2 maps PubParts source data into ParaHook-owned Catalog metadata
- Gen2 stays metadata-first and curation-first
- Gen2 keeps external source entries, staged/downloaded source files, and imported project assets as separate lifecycle states
- Gen2 does not ship the full `Generation 3` compatibility checker

### Current Planning Read

This index records the original `Catalog Generation 2` baseline as complete under the scoped source/metadata/organization/starting-assembly proof described below.

The user later added a Gen2 follow-up wishlist item: Catalog should populate with all available PubParts part records, not only the tiny proof cache, and should eagerly display PubParts preview images when the user opens Catalog. `Catalog-Gen2-7` completed that scoped follow-up.

The user has now reopened Gen2 again with the next practical question: can a user hit a button on an external PubParts entry to import supported files? That belongs in Gen2 as a narrow source-inspection and import-handoff lane, not as a fake repo-backed `Add To Project` action and not as the later compatibility/builder system.

The current forward read for `Catalog-Gen2-8` is the three-stage PubParts lifecycle: external source entry, staged/downloaded source, and imported project asset. The index should now outline download staging, Home visibility, staged list/clear controls, source/archive inspection, supported-file choice, and Import handoff in that order while preserving `Catalog-Gen2-0` through `Catalog-Gen2-7` as landed history.

`Catalog-Gen2-8 / Phase 8` is complete for the Catalog-owned bridge: item pages now expose `Open Source Download` as a browser handoff, staged PubParts entries can launch `Import Downloaded Files` into the existing local staged Import dialog, and PubParts attribution can survive from Catalog handoff into staged import files and accepted imported references. Catalog still does not fetch remote bytes, list or extract ZIP/shared-folder contents, accept `.stp`, provide STEP loader fidelity, run builder behavior, or issue compatibility verdicts.

Generation 2 was complete for the Catalog-owned PubParts wishlist then in scope. The remaining archive extraction/listing and remote-byte materialization work was explicitly routed to the Import family or later generations instead of being treated as unfinished Catalog work.

`Catalog-Gen2-9` is complete for the practical local organization problem: `Open Source Download` can send the user to PubParts or Dropbox, but ParaHook cannot know where the browser saved the file afterward. The shipped browser-honest loop now records PubParts Library status, predictable per-item folders, source manifests, a Catalog `Local Downloads` read, and an Import-owned local picker handoff so the user can organize files in a known place without Catalog silently scanning disk.

Browser sandbox rule: the web app cannot silently read `Downloads` or create arbitrary local folders without a user grant. Gen2 stops at explicit local-library metadata and the fallback local file picker/import path. A later desktop/native downloader can own direct byte materialization into the library folder, but Gen2 does not promise that in the browser-only lane.

`Catalog-Gen2-4.5` remains the user-supplied repo-backed asset intake lane, but it is complete for the current supplied files. If the user hands over more XR/ADV asset files later, run a new `Catalog-Gen2-4.5` follow-up phase instead of widening `Catalog-Gen2-5` in place; keep `.step` / `.stp` as the preferred source asset formats.

The first concrete XR handoff is now present: `Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step` and `Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb` are repo-backed source candidates for the same XR PubWheel full assembly item, `pubwheel_1`. `Catalog-Gen2-5 / Phase 2.2` consumed those files as a planned starting-assembly source, using the STEP as source truth and recording the GLB as companion mesh metadata without enabling heavy preview or starting-configuration load. `Catalog-Gen2-4.5 / Phase 1` added the planned-source asset-set contract/read seam with fixture proof for `pubwheel_1` / `v1`; `Catalog-Gen2-4.5 / Phase 2` migrated the live XR planned seed from bridge metadata into that explicit source version and file-variant record.

`Catalog-Gen2-4` is complete for current-sample Platform/Wheel system organization: Platform-owned `Footpad Attachment` and `Controller Box` labels map into existing system/type/group fields, and the current wheel-owned `Rim Saver` sample maps to Wheel without a misleading part group. Later Power/Fasteners organizer growth remains open/deferred because no runtime Power/Fasteners system expansion shipped in Gen2-4.

`Catalog-Gen2-10` is complete for Dropbox Chooser, but Chooser is not enough for PubParts-owned Dropbox links because it asks the user to pick files from a Dropbox account they control. `Catalog-Gen2-11` is now the forward heavier lane: `Add To Project` should start from the PubParts `dropboxUrl` or linked archive URL already on the item, resolve direct shared-file URLs where possible, and stage the selected result through Import with PubParts attribution. Direct shared-file resolution and the first manifest-backed ZIP/archive candidate-choice proof are complete; shared-folder listing remains the next sub-phase because it needs Dropbox shared-link API/helper behavior or another honest listing owner.

`Catalog-Gen2-15` is complete for the scoped source-library direction after the browser-honest ZIP/import flow and viewer rehydration closeout: OPFS is ParaHook's default Internal Library for explicit user-action source bytes, extracted files, manifests, and inspection results, and the optional Local Library folder mirror can copy uploaded/fetched archive bytes and selected extracted candidates into a user-selected visible folder. This does not bypass Dropbox/CORS; remote-byte fetch, user-selected local ZIP, helper/API, or native materialization still owns how bytes enter the library.

`Catalog-Gen2-16` is complete for the source-options-first uploaded/cached PubParts ZIP entry preview lane. Source options now let the user explicitly preview one supported `step`, `stl`, `obj`, or `glb` entry from the current uploaded ZIP or a same-source-version OPFS archive cache before staging files into Import review. The path reuses the existing Catalog preview viewport/reference asset loader, owns object URL cleanup, and keeps image/source metadata as the default browse read.

`Catalog-Gen2-17` is open as the next source-library smoothness lane. The goal is to try direct in-memory PubParts/Dropbox ZIP byte materialization when browser fetch, a trusted PubParts proxy, helper, or native bridge can legally provide bytes after explicit user action, then cache successful archive bytes in OPFS/Internal Library, reuse the source-options preview/staged Import review flow, and fall back to `Open Source` plus `Upload ZIP` when access is blocked. This lane should also plan the metadata index split: large ZIP/model blobs stay in OPFS or real mirror files, while SQLite/IndexedDB-style storage indexes source identity, archive manifests, source versions, preview/importable status, and local mirror state.

## Vision

### Generation 2 Summary

`Generation 2` should make `Catalog` able to:
- intake curated external catalog sources
- normalize external item truth into the ParaHook catalog contract
- represent linked model pages and linked archives honestly
- widen platform compatibility metadata beyond the simpler `Generation 1` read
- organize parts by the system they really belong to
- accept repo-backed XR and ADV asset batches through a clear folder and metadata intake plan
- carry pre-built PubWheel starting assemblies as starting configurations
- prepare metadata that later `Generation 3` builder and compatibility work can consume
- let the user stage or download PubParts sources into a visible downloads area
- let the user start a supported-file import from an external PubParts entry through explicit source/archive inspection and choice
- organize PubParts downloads through a user-granted local library folder so known local files can be found again and handed to Import
- resolve PubParts-owned Dropbox shared links without requiring the user to own the Dropbox files, starting with direct shared files and planning ZIP/archive or folder candidates as inspected follow-ups
- preview one user-selected supported entry from an uploaded or cached PubParts ZIP in source options before Import review staging
- try direct in-memory PubParts ZIP byte materialization when browser-readable source URLs or trusted providers can legally provide bytes, then cache successful archives in the Internal Library and fall back to user-uploaded ZIPs when blocked

PubParts is the first source proof target.

The first PubParts source adapter should read PubParts records as source truth and then map them into ParaHook-owned metadata. PubParts part records currently expose fields such as `title`, `fabricationMethod`, `typeOfPart`, `imageSrc`, `platform`, `externalUrl`, `dropboxUrl`, and `dropboxZipLastUpdated`. PubParts resource records currently expose fields such as `title`, `typeOfResource`, source links, app store links, play store links, and `description`.

The adapter should preserve PubParts fields where useful for:
- attribution
- source links
- image preview
- linked model pages
- archive handoff
- freshness notes

Then it should map them into ParaHook-owned concepts such as:
- source kind
- provider
- source collection
- system
- platform compatibility
- part group
- part type
- preview media
- external item page
- linked archive URL

### Generation 2 Boundaries

Gen2 owns:
- curated external source integration
- PubParts as the first external source proof target
- source adapters that normalize external entries into the ParaHook Catalog metadata shape
- explicit source metadata such as source kind, provider, source page URL, linked model URL, linked archive URL, attribution, and source notes
- externally linked item records whose model data does not yet ship with the repo
- honest handoff actions for source pages, linked models, and linked archives
- dedicated PubParts download staging as a visible source-file state before import
- downloaded-versus-imported status for PubParts source files
- staged PubParts downloads list and clear controls
- user-triggered external import affordances that inspect source/archive contents before supported files can be chosen
- selected supported-file handoff from external PubParts entries into the existing import/project pipeline
- post-handoff ownership proof that accepted imported references remain store-owned and rehydrate into any newly mounted model viewer runtime
- user-granted local PubParts library folder status and per-item folder readiness in the Catalog item flow
- per-item PubParts source manifests and source-version identity for local downloads
- scan/import handoff states that show when supported local files have been found without treating them as project assets
- a Catalog `Local Downloads` section that lists PubParts items with downloaded, discovered, unsupported, needs-extraction, import-ready, or imported local states
- coordination with the Home Page PubParts Library toggle/status row
- a one-primary-action item-page flow that advances through setup, source opening, scanning, import, and later preview states without presenting every internal step as a separate button
- Dropbox Chooser as the first direct Dropbox bridge for user-selected files
- Dropbox shared-link direct-file resolution as the next PubParts-owned source-link bridge, with archive/folder candidate inspection split into later phases
- direct in-memory source-byte materialization for PubParts archive/source links when browser fetch, trusted PubParts proxy, helper, or native bridge can provide bytes after explicit user action
- a source-library metadata index plan that keeps large ZIP/model blobs in OPFS/Internal Library while indexing item, source version, archive manifest, preview/importable status, and local mirror state in SQLite/IndexedDB-style metadata storage
- mapping PubParts `Floatwheel`-style source naming into ParaHook platform vocabulary such as `ADV`
- pre-built PubWheel starting-assembly entries as curated full-build assembly/start records
- metadata groundwork that later builder and compatibility systems can read

Gen2 does not own:
- redefining the Generation 1 local taxonomy from scratch
- open-ended internet search
- arbitrary web browsing inside Catalog
- Dropbox account-wide OAuth browsing or access outside the PubParts source link being resolved
- bypassing CORS, Dropbox API rules, or browser source restrictions just because the workflow streams bytes into memory
- storing large model/archive binaries in `localStorage` or making a SQLite database the hidden primary owner of model blobs without a measured later storage decision
- replacing the normal user import path
- pretending linked files are local files before handoff/import has happened
- silently scanning arbitrary local downloads folders or assuming a browser download path without explicit user permission
- treating staged/downloaded PubParts source files as project assets before Import accepts them
- automatic import of every file behind a linked source/archive URL
- claiming a Dropbox folder or ZIP URL is an importable model before inspection/classification proves which supported files exist
- compatibility checking or PubWheel Builder slot validation
- `Ricky Checker`
- dimensional proof
- STEP units detection, tessellation/quality controls, large-file STEP load progress, parse reuse, or loader-parameter fidelity; those belong to `Import-5 - STEP Import Metadata, Units, And Loader Fidelity`

### Phase Creation Read

Create `Generation 2` family phases when work is about:
- external source records
- source adapters
- PubParts mapping
- linked model entries
- linked archive handoff
- PubParts download staging and Home/storage visibility
- downloaded-versus-imported status
- staged download list and clear controls
- user-granted local PubParts library folder status
- per-item source manifests and local folder scan handoff
- user-triggered external source/archive inspection
- supported-file chooser and selected-file import handoff
- accepted imported-reference ownership and viewer-runtime rehydration after Catalog or workspace layout changes
- Dropbox shared-link direct-file resolution and later ZIP/archive or folder candidate inspection
- direct in-memory source-byte materialization for PubParts archives when browser fetch, trusted PubParts proxy, helper, or native bridge can legally provide bytes
- runtime PubParts structured metadata refresh from the live upstream `.json` source with baked-cache fallback
- source-library metadata indexing across OPFS/Internal Library, optional Local Library mirror, source version, archive manifest, preview/importable status, and provider materialization state
- source attribution
- platform and system normalization for external records
- pre-built PubWheel entries
- metadata groundwork for later builder and compatibility work

If a phase changes the local part/platform taxonomy, it should explain whether it is correcting a `Generation 1` local model or adding source-mapping metadata needed only for external integration.

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-1. keep curated repo assets and later curated external-linked entries distinct even when they appear near each other in the Catalog surface`
- [x] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [x] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`
- [x] `Catalog-Gen2-HLG-4. let Catalog carry pre-built PubWheel starting assemblies without making them the same thing as individual part listings`
- [x] `Catalog-Gen2-HLG-5. let repo-backed XR and ADV asset batches enter Catalog through a clear folder and metadata intake plan before they are used as loose parts or starting assemblies`
- [x] `Catalog-Gen2-HLG-6. let one logical Catalog item keep multiple 3D file variants and source versions together so STEP, GLB, preview, and later updated files do not become duplicate items or overwrite history`
- [x] `Catalog-Gen2-HLG-7. populate Catalog with every available PubParts part record through the cached normalized source lane instead of only showing a small proof sample`
- [x] `Catalog-Gen2-HLG-8. show PubParts preview images eagerly when the Catalog loads because external preview images are cheap compared with model/archive loading`
- [x] `Catalog-Gen2-HLG-9. let the user stage or download PubParts source files into a visible PubParts downloads area before treating them as imported project assets`
- [x] `Catalog-Gen2-HLG-10. let the user inspect staged or downloaded PubParts sources and import only selected supported files into ParaHook with source attribution`
- [x] `Catalog-Gen2-HLG-11. let PubParts downloads resolve through a user-chosen local PubParts library folder so ParaHook can organize per-item folders, scan known local files, and hand supported files to Import without relying on an unknown browser Downloads location`
- [x] `Catalog-Gen2-HLG-12. give Catalog a Local Downloads section so the user can see which PubParts parts or items already have local downloaded, extracted, found, unsupported, or import-ready files`
- [x] `Catalog-Gen2-HLG-13. simplify PubParts item-page download/import/preview workflow into one primary action that advances the next honest step instead of exposing separate process buttons for prepare, scan, import, and preview`
- [x] `Catalog-Gen2-HLG-14. let Add To Project use Dropbox Chooser as the first direct Dropbox bridge so the user can pick an exact supported source file and ParaHook can fetch/stage it with PubParts attribution without requiring manual Downloads-folder hunting`
- [x] `Catalog-Gen2-HLG-15. let Add To Project inspect PubParts-owned Dropbox shared links directly, starting with single shared-file resolution and later widening to ZIP/archive and shared-folder candidate choice, so users do not need to own the Dropbox files before ParaHook can stage supported source files` - complete for the current cached PubParts corpus: all 305 Dropbox source URLs are `.zip` links and shared-folder records are source-missing; reopen if PubParts adds folder-shaped source records.
- [x] `Catalog-Gen2-HLG-16. make PubParts ZIP links usable efficiently by inspecting one user-selected ZIP on demand, listing supported and unsupported entries, extracting only selected supported files, and staging those files into Import review with PubParts attribution instead of eagerly downloading or importing every archive` - complete with the Phase 5.1 browser-honest fallback: readable remote ZIP blobs still inspect directly, and browser-blocked PubParts Dropbox archives can be downloaded/opened by the user, chosen as a local `.zip`, listed, selected, and staged into Import review with PubParts attribution.
- [x] `Catalog-Gen2-HLG-17. make the PubParts ZIP path feel like a real staged importer flow where Add To Project opens source options, ParaHook uses PubParts source metadata, the user downloads or opens the ZIP through normal browser behavior, explicitly uploads the saved ZIP back into ParaHook, reviews staged ZIP entries with preview affordances where feasible, and sends only selected supported files toward Import/project/model-viewport ownership` - complete for the browser-owned Gen2 flow after scoped Catalog/Import handoff proof passed.
- [x] `Catalog-Gen2-HLG-18. keep accepted imported references visible across Catalog close, model-viewport split, and viewer remounts by making the store-owned reference workspace the canonical object truth and rehydrating each disposable viewer runtime from that truth` - complete at the store-to-current-viewer remount seam with focused PubParts ZIP-attributed and normal `.obj` accepted-reference proof; full UI click-through and direct split/exploded hardening remain optional future QA surfaces.
- [x] `Catalog-Gen2-HLG-19. make PubParts Add To Project feel like an app-managed parts library by using OPFS as ParaHook's default Internal Library for cached source bytes, extracted files, manifests, and inspection results, with an optional one-time user-selected Local Library folder mirror for visible files` - complete for explicit user-action archive/extracted-byte ownership: source options can cache/reopen from OPFS, Home can connect/reconnect/disable a visible folder handle for the current session, Catalog shows mirror status, mirror writes remain best-effort from app-owned blobs even when OPFS is unavailable, and Import/project ownership stays unchanged.
- [x] `Catalog-Gen2-HLG-20. let the verified ADV and XR full assembly Catalog entries use Add To Project as a source-reference handoff while heavy preview and load-as-starting-configuration stay planned`
- [x] `Catalog-Gen2-HLG-21. let users preview one supported 3D entry from an uploaded or cached PubParts ZIP inside source options before staging it into Import review, using only user-granted or app-cached archive bytes and without auto-importing or creating project assets` - complete for the source-options-first lane with uploaded and same-source-version OPFS archive cache bytes, one-entry extraction, Catalog preview viewport reuse, object URL cleanup proof, metadata-only/no-byte/unsupported disabled states, and no Import/project/builder/compatibility side effects.
- [x] `Catalog-Gen2-HLG-22. make PubParts Add To Project try direct in-memory source-byte materialization when a source URL, trusted PubParts proxy, helper, or native bridge can legally provide ZIP bytes, then store successful archives in the Internal Library and fall back to Upload ZIP when browser access is blocked` - complete for the Phase 1-5 stack: materialization status/fallback reads are truthful, Add To Project triggers the browser ZIP attempt and Internal Library cache reuse, the trusted-provider boundary exists without browser secrets or mandatory infrastructure, successful bytes use the existing archive list/preview/select/stage path and OPFS/Internal Library ownership, Upload ZIP fallback remains available, and the metadata index stays metadata-only.
- [x] `Catalog-Gen2-HLG-23. make PubParts structured metadata the live upstream source of truth so new PubParts parts added by Zinc can appear in ParaHook after app refresh without requiring a developer to regenerate ParaHook's baked cache, while ParaHook still owns normalized filters, source options, local library state, and Import/project handoff`
- [x] `Catalog-Gen2-HLG-24. keep the Catalog left browse rail focused on browse navigation by moving source utility/status reads into a dedicated Catalog Info page reached from the content title bar`

### Codex Level Goals

- [x] Catalog-Gen2-CLG-0. Establish the Generation 2 source-intake baseline before implementation by recording the PubParts endpoint shape, the browser CORS constraint, the cached normalized source decision, the live Catalog source/action/filter seams, and the `Catalog-7 / Phase 4` fitment gate.
- [x] Catalog-Gen2-CLG-1. Add a PubParts source-adapter planning lane that uses `.json` page endpoints as structured source intake while preserving PubParts attribution, links, preview images, archive URLs, and freshness metadata.
- [x] Catalog-Gen2-CLG-2. Define external source metadata on Catalog entries without weakening the existing repo-backed and imports source split.
- [x] Catalog-Gen2-CLG-3. Map PubParts platform and part-type language into ParaHook-owned platform families, systems, part groups, and item metadata.
- [x] Catalog-Gen2-CLG-4. Keep linked model pages, Dropbox archive URLs, archive download, extraction, import, and add-to-project actions separate instead of collapsing them into one implicit load action.
- [x] Catalog-Gen2-CLG-5. Normalize platform and fitment truth for external records while keeping Gen3 compatibility verdicts deferred.
- [x] Catalog-Gen2-CLG-6. Organize external parts by real system ownership such as Platform, Wheel, and later Power or Fasteners.
- [x] Catalog-Gen2-CLG-7. Route pre-built PubWheel entries as starting assemblies instead of loose individual part listings.
- [x] Catalog-Gen2-CLG-8. Add builder-friendly and compatibility-friendly metadata groundwork without shipping the Ricky Checker, PubWheel Builder validation, or dimensional fit proof in Gen2.
- [x] Catalog-Gen2-CLG-9. Define the repo-backed XR/ADV asset folder convention, asset classification intake, and seed-metadata handoff before loose parts or full assemblies are added to live Catalog entries.
- [x] Catalog-Gen2-CLG-10. Define versioned multi-file source asset sets so one Catalog item can associate STEP, GLB, preview, fallback, and future update files without becoming duplicate cards or losing older source history.
- [x] Catalog-Gen2-CLG-11. Replace the tiny proof PubParts cache with a deterministic full PubParts parts cache so every available PubParts part can appear as an external-linked Catalog entry.
- [x] Catalog-Gen2-CLG-12. Render PubParts `imageSrc` previews eagerly on Catalog load while still avoiding automatic archive downloads, model imports, heavy STEP loads, or builder configuration loads.
- [x] Catalog-Gen2-CLG-13. Add an explicit external PubParts import/source-inspection action that stays visually and behaviorally distinct from repo-backed `Add To Project`.
- [x] Catalog-Gen2-CLG-14. Inspect linked source/archive candidates only after user action, classify supported, unsupported, reference, and unknown files, and require user choice before import.
- [x] Catalog-Gen2-CLG-15. Hand selected supported files to the existing import/project pipeline with source attribution while leaving STEP loader fidelity, compatibility verdicts, and builder behavior to their owning families.
- [x] Catalog-Gen2-CLG-16. Represent the PubParts source lifecycle explicitly with source-entry, staged/downloaded source, and imported project-asset states, including downloaded-versus-imported status and staged-download clear controls.
- [x] Catalog-Gen2-CLG-17. Replace the unknown browser-download-location dependency with a user-granted local PubParts library folder, per-item source manifests, local folder scan status, and staged Import handoff for discovered supported files.
- [x] Catalog-Gen2-CLG-18. Add a Catalog `Local Downloads` section and Home Page toggle coordination so users can enable the PubParts library globally and inspect which PubParts items already have local files.
- [x] Catalog-Gen2-CLG-19. Collapse the PubParts item-page local-library workflow into one primary action resolver that selects the next honest label/action from setup, open source, scan local files, import found files, and later preview local file states.
- [x] Catalog-Gen2-CLG-20. Add a Dropbox Chooser bridge behind the PubParts `Add To Project` flow that loads the Chooser script safely, lets the user select only supported source files, fetches the returned direct temporary link, and stages the resulting file through Import with PubParts attribution.
- [x] Catalog-Gen2-CLG-21. Add a Dropbox shared-link direct-file resolver for PubParts source links that classifies a linked URL, resolves supported direct files when browser fetch permits it, and stages the fetched file through Import with PubParts attribution.
- [x] Catalog-Gen2-CLG-22. Add an inspected candidate-choice lane for PubParts Dropbox ZIP/archive and shared-folder links so ParaHook can list supported files before extraction/import instead of assuming a shared link maps to one importable model. Complete for current cached PubParts data with ZIP/archive inspection states and manifest-backed metadata proof; shared-folder records are source-missing and must reopen a follow-up if they appear.
- [x] Catalog-Gen2-CLG-23. Add a browser ZIP reader seam for PubParts archive blobs that lists entries after a user action without downloading or inspecting every PubParts ZIP on Catalog load.
- [x] Catalog-Gen2-CLG-24. Classify ZIP entries into supported import candidates, unsupported source/reference context, hidden/unsafe entries, and oversized/blocked entries before any extraction happens.
- [x] Catalog-Gen2-CLG-25. Extract only selected supported ZIP entries into `File`/`Blob` objects and stage them in Import review with PubParts attribution while leaving project ownership to the normal Import accept path.
- [x] Catalog-Gen2-CLG-26. Cache cheap archive manifest metadata by PubParts item identity, source URL, and `dropboxZipLastUpdated` so repeat ZIP inspection is fast without turning browser storage into a bulk archive cache.
- [x] Catalog-Gen2-CLG-27. Add a browser-honest local `.zip` picker fallback for PubParts Dropbox ZIP archives that are not readable by `fetch`, then list, select, and extract from the user-picked local ZIP blob with PubParts attribution.
- [x] Catalog-Gen2-CLG-28. Make the ZIP-backed PubParts source-options window present a first-class staged importer state with PubParts metadata, source link context, and browser-honest download/open-source guidance.
- [x] Catalog-Gen2-CLG-29. Add an explicit upload/choose-ZIP action that treats the selected local ZIP as the user's file-read grant and keeps local ZIP bytes ephemeral.
- [x] Catalog-Gen2-CLG-30. Populate a staged ZIP entry list from the chosen ZIP with supported, unsupported, blocked, selected, size, type, and archive-path reads.
- [x] Catalog-Gen2-CLG-31. Add preview affordances for previewable supported staged entries where current Import/viewer helpers can honestly produce preview context before final project acceptance.
- [x] Catalog-Gen2-CLG-32. Route the final staged importer `Add To Project` action through Import review and then existing project/model-viewport handoff ownership without letting Catalog own accepted assets.
- [x] Catalog-Gen2-CLG-33. Make the imported-reference store-to-viewer contract explicit: `referenceWorkspace` owns accepted imported reference identity and visibility while `Viewer.referenceObjects` is only a disposable per-instance runtime cache.
- [x] Catalog-Gen2-CLG-34. Rehydrate visible accepted imported references into a newly mounted model viewer when global state says the reference is loaded but the current viewer runtime does not actually have the object.
- [x] Catalog-Gen2-CLG-35. Add an OPFS-backed Internal Library owner for PubParts source bytes, ZIPs, extracted candidates, source manifests, and inspection results that only caches files after an explicit user action.
- [x] Catalog-Gen2-CLG-36. Add an optional user-selected Local Library folder mirror that can copy app-owned PubParts source/extracted/importable files into a visible filesystem folder when permission is available.
- [x] Catalog-Gen2-CLG-37. Route planned ADV and XR full assembly source paths through the same browser-project reference commit handoff used by repo-backed Add To Project items without enabling temporary preview or builder starting-configuration load.
- [x] Catalog-Gen2-CLG-38. Add a source-options ZIP entry preview contract that identifies one selected supported uploaded or cached archive entry, materializes only that entry for preview, renders it through the existing Catalog preview viewport/reference loader path where possible, and never stages Import review or creates project assets.
- [x] Catalog-Gen2-CLG-39. Prove uploaded/cached ZIP entry preview cleanup and boundary behavior, including object URL revocation, disabled states for metadata-only or stale/no-byte cache records, unsupported-entry blocking, no silent blocked-Dropbox fetch, and no auto-import/project commit.
- [x] Catalog-Gen2-CLG-40. Add a direct source-byte materialization attempt that fetches readable PubParts/Dropbox ZIP bytes into memory after user action, writes successful archives to OPFS/Internal Library, and falls back to Upload ZIP when browser fetch, CORS, or provider access fails. Complete for the existing Add To Project-triggered browser ZIP inspection path: readable archive bytes are represented through the Phase 1 materialization contract, assert the same archive list/preview/select/stage path, write through Internal Library when available, and keep browser-honest Upload ZIP fallback when access fails.
- [x] Catalog-Gen2-CLG-41. Add a trusted source-byte provider boundary for PubParts proxy, native, helper, or API materialization so ParaHook can receive ZIP bytes without exposing Dropbox secrets in browser code or scraping blocked Dropbox pages. Complete for the boundary seam: the app now has a default-unavailable trusted provider owner, fake/injected provider tests, provider-result-to-Phase-1 materialization mapping, and Catalog source-options proof that successful trusted-provider bytes reuse the same Internal Library and ZIP list/preview/select/stage path while blocked/unavailable provider states preserve browser fetch and Upload ZIP fallback.
- [x] Catalog-Gen2-CLG-42. Add a source-library metadata index plan, preferring OPFS file blobs for large archives/models and a SQLite/IndexedDB-style metadata database for item, source, version, file-candidate, manifest, preview/importable, and local mirror status records rather than storing large binaries in localStorage. Complete for the pure metadata-index/query owner: `pubPartsSourceLibraryMetadataIndex.ts` maps staged source, Phase 1 materialization, provider capability, archive manifest, Internal Library, Local Library mirror, stale, blocked, previewable, importable, source-version, and catalog-item reads without storing blobs, file handles, object URLs, or adding SQLite/IndexedDB persistence.
- [x] Catalog-Gen2-CLG-43. Add a runtime PubParts metadata refresh path that reads the live parts JSON endpoint, normalizes successful records through the existing PubParts adapter, composes Catalog from live records when available, and falls back to the baked generated cache when live refresh fails. Complete for Phase 1: `pubPartsLiveSource.ts` reads and validates `parts.json` metadata through an injectable fetch owner, tries direct PubParts metadata then the same-origin Vite dev proxy route when direct browser fetch is blocked, `CatalogSurface` renders baked cache first and swaps in live part records on success, focused tests prove upstream-only live parts appear, and failed live refresh preserves baked PubParts cards/resources.
- [x] Catalog-Gen2-CLG-44. Audit the live source projection so PubParts-owned labels continue to map into ParaHook-owned platform, system, part type, part group, search, and filter fields instead of replacing ParaHook's catalog taxonomy. Complete for the live metadata lane: live records still normalize through PubParts source ownership and project through `catalogSource.ts`, known labels map into ParaHook canonical fields, unknown PubParts labels stay raw metadata with canonical `Other` platform compatibility, and no upstream label automatically creates a new ParaHook system/type/group.
- [x] Catalog-Gen2-CLG-45. Add a source-update preservation audit so live PubParts additions, removals, renames, and reorderings do not silently delete user-granted ZIP bytes, Internal Library entries, staged source records, local mirror state, or accepted imported project assets. Complete for the current lane: external PubParts item IDs now derive from stable source identity rather than list index, duplicate cached-source rows get scoped identity metadata only where required, live additions/reorderings/renames preserve unchanged item IDs, and Catalog source composition does not auto-prune staged/local/Internal Library/Import/project state.
- [x] Catalog-Gen2-CLG-46. Add one Catalog Info title-bar action that opens a combined content page for Staged Sources and Local Downloads, remove those sections from the left rail, and preserve existing staged-source clear plus local-library status behavior. Complete for the current UI cleanup: `CatalogShell` routes a `catalog-info` content mode from one top-right action, `CatalogShellInfoPage` renders the existing utility reads, `CatalogShellBrowseRail` keeps browse navigation plus Preview Session only, and focused CatalogShell tests prove the utility sections moved out of the rail.

### `Catalog-Gen2-0` - Generation 2 Intake Readiness And Source Mapping Baseline

- [x] `G2-0.1. PubParts Endpoint Field Baseline`
- [x] `G2-0.2. Browser Fetch Constraint Read`
- [x] `G2-0.3. Cached Normalized Source Intake Decision`
- [x] `G2-0.4. Current Catalog Source Contract Audit`
- [x] `G2-0.5. Current Catalog Action Plan Audit`
- [x] `G2-0.6. Current Catalog Browse And Filter Audit`
- [x] `G2-0.7. Gen1 Fitment Gate Before Platform Normalization`
- [x] Record that PubParts JSON is source truth but the app should first consume repo-owned cached normalized data unless a later phase proves live browser fetch is safe.
- [x] Confirm that `repo`, `imports`, and later `external` source lanes stay distinct.
- [x] Confirm that `Catalog-7 / Phase 4` is not required before source intake but is required before `Catalog-Gen2-3`.
- [x] `Catalog-Gen2-HLG-1`
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] `Catalog-Gen2-CLG-0`
- [x] `Catalog-Gen2-CLG-1`
- [x] `Catalog-Gen2-CLG-2`

### `Catalog-Gen2-1` - External Catalog Source Intake

- [x] `G2-1. PubParts Source Adapter`
- [x] `G2-2. Curated External Catalog Entries`
- [x] `G2-3. Source Kind Metadata`
- [x] `G2-4. Source Site And Source Collection Labels`
- [x] `G2-5. External Item Page URL Support`
- [x] Use PubParts `.json` page endpoints as the first structured source intake path.
- [x] Preserve PubParts source fields for attribution, source links, preview image, archive handoff, and freshness notes.
- [x] Map PubParts records into ParaHook Catalog metadata instead of mirroring the PubParts website layout as runtime truth.
- [x] `Catalog-Gen2-HLG-1`
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] `Catalog-Gen2-CLG-1`
- [x] `Catalog-Gen2-CLG-2`
- [x] `Catalog-Gen2-CLG-3`

### `Catalog-Gen2-2` - Linked Models And Archive Handoff

- [x] `G2-6. Linked 3D Model Entries` as external source-page and linked metadata handoff, not local asset import.
- [x] `G2-7. Linked Archive URL Metadata`
- [ ] `G2-8. Dropbox Shared Folder Intake` beyond inspect-first linked archive metadata remains deferred.
- [ ] `G2-9. Dropbox ZIP Intake` beyond inspect-first linked archive metadata remains deferred.
- [x] `G2-10. User-Triggered Archive Download` as an explicit browser source-download/open handoff, not app-owned remote bytes.
- [x] `G2-11. Archive Extraction Handoff` deferred to the Import family because Catalog does not list or extract ZIP/shared-folder contents.
- [x] `G2-12. Supported Versus Unsupported File Classification` as metadata-only URL candidate classification.
- [x] `G2-13. Import-Only-When-Supported` for user-selected local supported files staged through the existing Import review dialog.
- [x] `G2-14. User Choice Of Which Supported Files To Import` for local supported files selected by the user after download/extraction, not automatic archive listing.
- [x] Distinguish inspect-first shared-folder intake from staged ZIP intake at the metadata/classification level.
- [x] Keep `open source`, `download`, `import`, and `add to project` as distinct actions by shipping no download/import/add-to-project behavior for external entries.
- [x] `Catalog-Gen2-HLG-1`
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-CLG-4`

### `Catalog-Gen2-3` - Platform And Fitment Normalization

- [x] `G2-15. Canonical Platform Families`
- [x] `G2-16. Floatwheel To ADV Mapping`
- [x] `G2-17. GT Family Versus GTS Fitment Rules`
- [x] `G2-18. XR Classic As Its Own Platform`
- [ ] `G2-19. Sub-Platform Tags`
- [x] `G2-20. Cross-Platform Compatibility Tags`
- [ ] `G2-21. Narrow Component Fitment Notes`
- [x] Normalize platform truth for `ADV`, `GT`, `Pint`, `XR`, and `XR Classic`.
- [x] Keep `GT` as the broad family while allowing narrower `GTS`-specific fitment where needed.
- [x] Let one part be compatible with more than one platform family when that is actually true.
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] `Catalog-Gen2-CLG-3`
- [x] `Catalog-Gen2-CLG-5`

### `Catalog-Gen2-4` - System-Level Part Organization

- [x] `G2-22. Platform Versus Wheel Organizer`
- [x] `G2-23. Platform-Owned Part Types`
- [x] `G2-24. Wheel-Owned Part Types`
- [ ] `G2-25. Later Power Organizer` remains deferred; no runtime Power system expansion shipped in `Catalog-Gen2-4`.
- [ ] `G2-26. Later Fasteners Organizer` remains deferred; no runtime Fasteners system expansion shipped in `Catalog-Gen2-4`.
- [x] Organize current Platform/Wheel part samples by real fitment domain instead of flattening everything into one platform bucket.
- [x] Keep current wheel-side source samples out of fake platform-only ownership and avoid fake motor/tire records.
- [x] Leave room for later `Power` and `Fasteners` growth without forcing them into the wrong lane.
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] `Catalog-Gen2-CLG-3`
- [x] `Catalog-Gen2-CLG-6`

### `Catalog-Gen2-4.5` - Repo-Backed XR And ADV Asset Folder Intake

- [x] `G2-26A. Repo-Backed Asset Folder Convention`
- [x] `G2-26B. XR Platform Asset Intake Lane`
- [x] `G2-26C. ADV Platform Asset Intake Lane`
- [x] `G2-26D. Loose Part Versus Starting Assembly Split`
- [x] `G2-26E. Matching Catalog Preview Folder Convention`
- [x] `G2-26F. Seed Metadata Handoff Checklist`
- [x] `G2-26G. STEP Source Format Preference`
- [x] `G2-26H. XR PubWheel Assembly 1 Source Placement`
- [x] `G2-26I. Versioned Multi-File Asset Set Contract`
- [x] `G2-26J. Same-Item Source Version History`
- [x] `G2-26K. XR PubWheel 1 STEP/GLB Variant Pair Migration`
- [x] Plan repo-backed loose parts under `public/Catalog/parts/xr/` and `public/Catalog/parts/adv/` with part-type subfolders such as `rails`, `boxes`, `bumpers`, `footpads`, `axle-blocks`, `motors`, `tires`, and `hardware` when those folders are actually needed.
- [x] Plan repo-backed full assemblies under `public/Catalog/assemblies/xr/` and `public/Catalog/assemblies/adv/`.
- [x] Prefer `.step` and `.stp` as repo-backed source asset files; keep mesh formats as preview, fallback, or later import artifacts unless a narrower phase proves otherwise.
- [x] Plan matching preview assets under `public/CatalogPreviews/parts/xr/`, `public/CatalogPreviews/parts/adv/`, `public/CatalogPreviews/assemblies/xr/`, and `public/CatalogPreviews/assemblies/adv/`.
- [x] Keep the folder path as repository organization only; Catalog seed metadata still owns `systemKey`, `platformCompatibility`, `partType`, `partGroups`, `position`, source kind, and action kind.
- [x] Keep loose XR/ADV parts out of `Catalog-Gen2-5` unless Manager explicitly identifies a complete starting assembly.
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] `Catalog-Gen2-HLG-5`
- [x] `Catalog-Gen2-HLG-6`
- [x] `Catalog-Gen2-CLG-3`
- [x] `Catalog-Gen2-CLG-6`
- [x] `Catalog-Gen2-CLG-9`
- [x] `Catalog-Gen2-CLG-10`

### `Catalog-Gen2-5` - Pre-Built PubWheel Starting Assemblies

- [x] `G2-27. Pre-Built PubWheel Entries` as current known-source planned/unavailable starting assembly entries.
- [x] `G2-28. ADV Starting Assembly` as a planned/unavailable entry backed by known source metadata.
- [ ] `G2-29. GT Starting Assembly` remains source-missing and placeholder-unapproved; no live entry shipped.
- [ ] `G2-30. Pint Starting Assembly` remains source-missing and placeholder-unapproved; no live entry shipped.
- [x] `G2-31. XR Starting Assembly` as a planned/unavailable `pubwheel_1` source asset-set entry.
- [ ] `G2-32. XR Classic Starting Assembly` remains source-missing and placeholder-unapproved; no live entry shipped.
- [ ] `G2-33. Load Into Model As Starting Configuration` remains deferred to later builder/runtime work; Gen2-5 shipped the honest planned/unavailable handoff read only.
- [x] Let the catalog carry full starting PubWheel assemblies in addition to loose parts.
- [x] Keep those entries honest as starting assemblies, not only reference parts.
- [x] Consume XR/ADV repo-backed assets from `Catalog-Gen2-4.5` only when they are complete starting assemblies or when that phase has explicitly classified them as assembly-ready.
- [x] `Catalog-Gen2-HLG-4`
- [x] `Catalog-Gen2-HLG-5`
- [x] `Catalog-Gen2-CLG-7`
- [x] `Catalog-Gen2-CLG-9`

### `Catalog-Gen2-6` - Metadata Groundwork For Later Builder And Compatibility

- [ ] `G2-34. Part-To-Part Allowed Metadata`
- [ ] `G2-35. Builder-Slot-Friendly Item Fields`
- [ ] `G2-36. Sub-Assembly Metadata`
- [ ] `G2-37. Rear Box Supporting-Part Metadata`
- [x] Lay metadata groundwork that later `Generation 3` builder and compatibility work will depend on.
- [x] Stop at metadata and curation truth instead of trying to ship the whole checker here.
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-4`
- [x] `Catalog-Gen2-CLG-8`

### `Catalog-Gen2-7` - Full PubParts Catalog Population And Eager Image Display

- [x] `G2-38. Full PubParts Parts Cache`
- [x] `G2-39. Full PubParts Catalog Population`
- [x] `G2-40. Eager PubParts Preview Images`
- [x] Populate Catalog from every available cached PubParts part record instead of only the current proof sample.
- [x] Keep PubParts entries source-lane-safe as external-linked records, not repo/import/project assets.
- [x] Deduplicate records that appear in both full and filtered PubParts source sets without losing source-set attribution.
- [x] Eagerly show PubParts preview images on Catalog load because image previews are cheap browse context.
- [x] Do not eagerly download linked archives, import model files, load STEP sources, or create project assets.
- [x] `Catalog-Gen2-HLG-1`
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] `Catalog-Gen2-HLG-7`
- [x] `Catalog-Gen2-HLG-8`
- [x] `Catalog-Gen2-CLG-1`
- [x] `Catalog-Gen2-CLG-2`
- [x] `Catalog-Gen2-CLG-3`
- [x] `Catalog-Gen2-CLG-11`
- [x] `Catalog-Gen2-CLG-12`

### `Catalog-Gen2-8` - PubParts Download Staging And Import Handoff

- [x] `G2-41. External Import Action Boundary`
- [x] `G2-42. PubParts Downloads Staging Area`
- [x] `G2-43. Home Page PubParts Storage Visibility`
- [x] `G2-44. Downloaded Versus Imported Status`
- [x] `G2-45. User-Triggered Source Download Only`
- [x] `G2-46. Staged Downloads List And Clear Controls`
- [x] `G2-47. User-Triggered Source And Archive Inspection`
- [x] `G2-48. Supported File Classification And Chooser`
- [x] `G2-49. Selected-File Import Handoff With Source Attribution`
- [x] `G2-50. Remote Source Download And Import Owner Bridge`
- [x] Add a Catalog action affordance for external PubParts entries that reads as source inspection/import handoff, not repo-backed `Add To Project`.
- [x] Keep external source entries, staged/downloaded source files, and imported project assets as separate lifecycle states.
- [x] Give PubParts downloads a visible staging/storage home before files become import/project truth.
- [x] Do not inspect, download, or import source/archive contents until the user explicitly starts the action.
- [x] Show whether a PubParts source is external-only, staged/downloaded, inspected, selected-for-later-import, not imported, unsupported, archive-needs-inspection, or unknown.
- [x] Let the user clear one staged PubParts download or all staged PubParts downloads without affecting imported project assets.
- [x] Classify clear direct model candidates and preserve archive/folder contents as unknown needs-inspection context when contents cannot be listed without later source inspection.
- [x] Treat `.step`, `.stp`, `.glb`, `.obj`, and `.stl` as first supported direct file candidates when the URL itself identifies the file.
- [x] Let the user choose the supported direct file candidate as staged metadata instead of importing every file behind the source link.
- [x] Preserve PubParts provider/source-page/archive attribution on the selected-file handoff/status read.
- [x] Keep STEP units, tessellation, large-file progress, parse reuse, compatibility verdicts, and PubWheel Builder behavior out of this Catalog lane.
- [x] `Catalog-Gen2-HLG-1`
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-9`
- [x] `Catalog-Gen2-HLG-10` for the local supported-file staged Import bridge with source attribution; remote archive extraction remains an Import-family follow-up.
- [x] `Catalog-Gen2-CLG-4`
- [x] `Catalog-Gen2-CLG-13`
- [x] `Catalog-Gen2-CLG-14`
- [x] `Catalog-Gen2-CLG-15` for local supported-file staged Import handoff with source attribution; remote byte materialization and archive extraction stay outside Catalog.
- [x] `Catalog-Gen2-CLG-16`

### `Catalog-Gen2-9` - Local PubParts Library Folder And Auto-Discovery Handoff

- [x] `G2-51. User-Chosen PubParts Library Root`
- [x] `G2-52. Per-Item PubParts Folder Convention`
- [x] `G2-53. Source Manifest And Source Version History`
- [x] `G2-54. Scan Known Folder For Supported Local Files`
- [x] `G2-55. Import Found Supported Files Through The Staged Import Dialog`
- [x] `G2-56. Browser Sandboxing And Native Downloader Boundary`
- [x] `G2-57. Home Page PubParts Library Toggle And Status`
- [x] `G2-58. Catalog Local Downloads Section`
- [x] `G2-59. One Primary PubParts Local Action`
- [x] Let the user grant or choose one local PubParts library folder instead of relying on an unknown browser download path.
- [x] Create or recognize predictable per-item folders under that library so each PubParts source has a known local place.
- [x] Record source manifests that preserve provider, Catalog item id, source page, archive/source URL, freshness, and source-version identity beside the downloaded files.
- [x] Add a Home Page toggle/status row for enabling, disabling, configuring, and summarizing the PubParts local library.
- [x] Add a Catalog `Local Downloads` section that lists PubParts items with prepared, downloaded, extracted, supported-found, unsupported-only, needs-extraction, import-ready, and imported states.
- [x] Expose one primary item-page local-library action at a time, with label/state derived from the next honest step instead of showing separate prepare, scan, import, and preview buttons together.
- [x] Reserve local preview behavior for a later state that has a known local previewable/importable file, not for remote source links or unknown archives.
- [x] Let Catalog show local-folder readiness, found-file status, and import handoff status without becoming the filesystem owner.
- [x] Let Import own folder permission, supported-file scanning, file handles, archive extraction if it later ships, and staged import review.
- [x] Keep the browser lane honest: no silent local drive scanning, no automatic read of `Downloads`, and no remote byte materialization unless a later desktop/native owner ships it.
- [x] `Catalog-Gen2-HLG-1`
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-9`
- [x] `Catalog-Gen2-HLG-10`
- [x] `Catalog-Gen2-HLG-11`
- [x] `Catalog-Gen2-HLG-12`
- [x] `Catalog-Gen2-HLG-13`
- [x] `Catalog-Gen2-CLG-15`
- [x] `Catalog-Gen2-CLG-16`
- [x] `Catalog-Gen2-CLG-17`
- [x] `Catalog-Gen2-CLG-18`
- [x] `Catalog-Gen2-CLG-19`

### `Catalog-Gen2-10` - Dropbox Chooser Add-To-Project Bridge

- [x] `G2-60. Dropbox Chooser Integration Boundary`
- [x] `G2-61. Supported File Selection Contract`
- [x] `G2-62. Direct Temporary Link Fetch And File Creation`
- [x] `G2-63. Import Staging With PubParts Attribution`
- [x] `G2-64. Add To Project Resolver Hook-In`
- [x] `G2-65. Dropbox Chooser Failure And Fallback States`
- [x] Treat Dropbox Chooser as the first direct Dropbox bridge because it is user-selected and narrower than a full shared-link API inspector.
- [x] Load the Dropbox Chooser script through a small owner seam instead of scattering Dropbox globals through Catalog UI components.
- [x] Require the user to pick the exact supported model/source file from Dropbox; do not claim Catalog can automatically list every shared folder/archive yet.
- [x] Accept only supported file types such as `.step`, `.stp`, `.glb`, `.obj`, and `.stl` in the first bridge.
- [x] Fetch the returned direct temporary link into a `Blob`/`File` only after explicit user selection.
- [x] Hand the fetched file to the existing staged Import review path with PubParts/Catalog source attribution.
- [x] Keep the `Add To Project` button as the user-facing entry point while showing honest chooser, loading, unsupported, canceled, failed, and fallback states.
- [x] Route Dropbox shared-link API inspection, Dropbox folder listing, ZIP extraction, native direct download, and long-lived OAuth/token management to later owners.
- [x] `Catalog-Gen2-HLG-10`
- [x] `Catalog-Gen2-HLG-14`
- [x] `Catalog-Gen2-CLG-15`
- [x] `Catalog-Gen2-CLG-20`

### `Catalog-Gen2-13` - PubParts ZIP Staged Importer And Preview Handoff

- [x] `G2-78. ZIP Source Options Staged Importer Shell`
- [x] `G2-79. Browser-Honest Download/Open-Source Action`
- [x] `G2-80. Explicit Upload/Choose-ZIP User Grant`
- [x] `G2-81. ZIP Entry Staged Importer List`
- [x] `G2-82. Previewable Supported Entry Affordance`
- [x] `G2-83. Final Import Review And Model-Viewport Handoff Audit`
- [x] Keep Catalog ownership on source-options/staged importer UX, PubParts source metadata, local ZIP upload state, entry selection, and selected-file handoff.
- [x] Keep Import ownership on staged review, accepted project assets, STEP fidelity, and project/model insertion after acceptance.
- [x] Keep local/native helper ownership future for automatic source folder ownership, browser download-folder control, remote-byte proxying, native direct downloads, and background materialization.
- [x] `Catalog-Gen2-HLG-17`
- [x] `Catalog-Gen2-CLG-28`
- [x] `Catalog-Gen2-CLG-29`
- [x] `Catalog-Gen2-CLG-30`
- [x] `Catalog-Gen2-CLG-31`
- [x] `Catalog-Gen2-CLG-32`

## [x] `Catalog-Gen2-0` - `Generation 2 Intake Readiness And Source Mapping Baseline`

### Family Phase Summary

Prepare `Catalog Generation 2` for implementation by locking the source-intake assumptions, current app seams, and Gen1 handoff gate before Worker starts external source code.

This first Dispatch 4 Simple Manager-blocked family phase for Gen2 is complete.

The standalone phase doc records the PubParts endpoint shape, the no-CORS live-fetch constraint, the cached normalized source-intake decision, and the live Catalog seams that `Catalog-Gen2-1` must extend.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-1`, `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-3`
- CLG: `Catalog-Gen2-CLG-0`, `Catalog-Gen2-CLG-1`, `Catalog-Gen2-CLG-2`

### Owns

- PubParts endpoint field baseline for `parts.json`, filtered parts JSON pages, and `resources.json`
- the first source-intake architecture decision for cached normalized data instead of direct production browser fetch
- live audit of Catalog source contract, action plan, browse modes, filters, and item page source labeling
- the Gen1/Gen2 boundary for `Catalog-7 / Phase 4`
- the rule that source intake can start before the Gen1 motor/tire fitment phase, but platform/fitment normalization cannot
- creation of the `Catalog-Gen2-1` family phase doc after the readiness baseline is in place

### Does Not Own

- adding the `external` runtime source contract by itself
- normalizing PubParts entries into live Catalog items
- linked archive download, extraction, or import behavior
- completing `Catalog-7 / Phase 4`
- implementing platform and fitment normalization
- any Gen3 compatibility verdicts

### Completion Read

`Catalog-Gen2-0` is complete.

Dispatch next:
- `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork`

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-0 - Generation 2 Intake Readiness And Source Mapping Baseline.md](./Future/Catalog-Gen2-0%20-%20Generation%202%20Intake%20Readiness%20And%20Source%20Mapping%20Baseline.md)

## [x] `Catalog-Gen2-1` - `External Catalog Source Intake`

### Family Phase Summary

Bring curated third-party catalog sources into ParaHook `Catalog` without letting those sources define the ParaHook runtime contract.

This family phase is complete.

The standalone phase doc shipped the generic `external` source contract, tiny exact cached PubParts source slices, explicit external snapshot composition, and live external-linked PubParts attribution without adding linked archive import behavior.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-1`, `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-3`
- CLG: `Catalog-Gen2-CLG-1`, `Catalog-Gen2-CLG-2`, `Catalog-Gen2-CLG-3`

### Owns

- source-adapter direction for `pubparts.xyz`
- PubParts `.json` page endpoint intake
- external-source metadata
- source attribution and source-label truth
- external item page URL support
- image preview URL preservation where allowed by runtime constraints
- the rule that external entries should normalize into ParaHook catalog items

### Does Not Own

- full archive extraction or import runtime by itself
- Dropbox shared-folder or ZIP inspection beyond preserving link metadata
- the later compatibility checker
- one generic web-search lane
- replacing Gen1 local repo-backed item taxonomy

### Planning Read

The `Catalog-Gen2-1` Family Phase Doc exists and is complete.

The completed phase doc shipped four implementation phases for:
- external source contract and PubParts raw/normalized type groundwork
- cached PubParts source intake path
- external items in the Catalog source snapshot
- external attribution and linked source surfacing

Remaining source/platform mapping work is still routed truthfully:
- `Catalog-Gen2-2` owns linked models and archive handoff.
- `Catalog-Gen2-3` and `Catalog-Gen2-4` still own platform, fitment, and system/part-group normalization, so `Catalog-Gen2-HLG-3` and `Catalog-Gen2-CLG-3` remain open here.

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-1 - External Catalog Source Intake.md](./Future/Catalog-Gen2-1%20-%20External%20Catalog%20Source%20Intake.md)

## [x] `Catalog-Gen2-2` - `Linked Models And Archive Handoff`

### Family Phase Summary

Let `Generation 2` entries point at linked models or linked archives honestly, while keeping the user actions explicit and downstream ownership clean.

This family phase is complete for honest source-page, linked archive metadata, inspect-first archive source links, and metadata-only archive/file candidate classification.

Runtime archive download, extraction, import, supported-file user choice, and external add-to-project behavior remain deferred because ParaHook does not yet own the external archive/download/import pipeline needed to make those actions truthful.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-1`, `Catalog-Gen2-HLG-2`
- CLG: `Catalog-Gen2-CLG-4`

### Owns

- linked model URLs
- linked archive URLs
- Dropbox shared-folder intake direction
- Dropbox ZIP intake direction
- user-triggered download deferral direction
- extraction and import handoff deferral direction
- staged supported-versus-unsupported file classification
- user choice deferral until a later import owner exists

### Does Not Own

- generic auto-import of arbitrary internet URLs
- final Browser ownership logic for every imported asset
- later compatibility proof behavior

### Planning Read

This lane is complete as the honest linked source/archive handoff and classification family.

Completed:
- external source-page opening remains distinct from preview, archive inspection, import, and add-to-project
- linked archive URLs display as inspect-only metadata
- linked archive/file candidates classify as supported direct model candidates, archive-container inspect-needed, unsupported file candidates, unknown candidates, or no-linked-archive states
- no runtime archive download, extraction, import, supported-file chooser, or external add-to-project behavior shipped

Dispatch next:
- `Catalog-Gen2-3 / Phase 1` prep

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-2 - Linked Models And Archive Handoff.md](./Future/Catalog-Gen2-2%20-%20Linked%20Models%20And%20Archive%20Handoff.md)

## [x] `Catalog-Gen2-3` - `Platform And Fitment Normalization`

### Family Phase Summary

Define the wider platform compatibility truth needed for `Generation 2` so catalog metadata can stop reading as one oversimplified platform list.

This family phase is complete for canonical external platform mapping, metadata-only GT-S source fitment notes, and the existing platform filter/search read. It intentionally does not complete `typeOfPart` to system/part-group mapping or compatibility verdict/checker behavior.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-3`
- CLG: `Catalog-Gen2-CLG-3`, `Catalog-Gen2-CLG-5`

### Owns

- canonical platform families for external source mapping
- `ADV`, `GT`, `Pint`, `XR`, and `XR Classic`
- `Floatwheel` to `ADV` mapping
- `GT` as the broad family with narrower `GTS` fitment where needed
- sub-platform tags
- cross-platform compatibility metadata

### Does Not Own

- the later true/false checker itself
- final dimensional fit proof
- every later builder rule

### Planning Read

This lane should use the PubParts source vocabulary discovered through `Catalog-Gen2-1` but should not let PubParts rename ParaHook's own platform families.

The Gen1 gate before this lane is complete: `Catalog-7 / Phase 4` added the local wheel-fitment contract/display seam and kept real motor/tire asset population deferred until actual repo-backed assets exist.

`Catalog-Gen2-3 / Phase 1` is complete: external PubParts platform source labels now map into canonical ParaHook platform families, including `Floatwheel` to `ADV`, while raw source wording remains visible and later sub-platform notes remain unimplemented.

`Catalog-Gen2-3 / Phase 2` is complete: `GT/GT-S`, `GT-S`, and `GTS` source labels now produce metadata-only source fitment notes while broad `GT` compatibility remains the canonical platform family. Sub-platform tags and broader narrow component-fitment rules remain open unless Manager chooses to re-scope them later.

`Catalog-Gen2-3 / Phase 3` is complete as a docs/test closeout audit: focused verification confirmed canonical external platform filtering, raw source platform metadata search, GT-S source fitment metadata search, resource records without platform compatibility, and stable repo/import behavior without runtime code changes.

Dispatch next:
- `Catalog-Gen2-4` is now complete; current next target is `Catalog-Gen2-5 / Phase 1` prep.

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-3 - Platform And Fitment Normalization.md](./Future/Catalog-Gen2-3%20-%20Platform%20And%20Fitment%20Normalization.md)

## [x] `Catalog-Gen2-4` - `System-Level Part Organization`

### Family Phase Summary

Organize `Generation 2` parts by the system they actually belong to instead of making every part pretend to be owned by only one board platform.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-3`
- CLG: `Catalog-Gen2-CLG-3`, `Catalog-Gen2-CLG-6`

### Owns

- `Platform` versus `Wheel` as the first explicit systems
- platform-owned part examples such as rails, boxes, bumpers, footpads, and often axle blocks
- current wheel-owned source examples such as rim savers, while real motor/tire asset population remains a later source-data problem
- the rule that later `Power` and `Fasteners` lanes may branch cleanly from the same organizer

### Does Not Own

- one final repo folder layout
- the later full builder slot model
- compatibility proof logic beyond metadata truth

### Planning Read

This lane should map source part types into ParaHook systems after the source adapter and platform mapping lanes have enough sample data to avoid guessing from one-off labels.

`Catalog-Gen2-4 / Phase 1` is complete: external PubParts `typeOfPart` source labels now map into existing ParaHook system/type/group fields only for safe current labels, with `Footpad Attachment` and `Controller Box` treated as platform-owned examples and `Rim Saver` treated as wheel-owned without forcing a bad part group. Raw PubParts `Part Type` metadata remains visible.

`Catalog-Gen2-4 / Phase 2` is complete as a docs/test audit: focused verification confirmed the Phase 1 platform-owned `Footpad Attachment` and `Controller Box` mappings, existing system/type/group filter reads, and raw source metadata preservation without runtime changes or conflict-state widening.

`Catalog-Gen2-4 / Phase 3` is complete as a docs/test audit: focused verification confirmed the current `Rim Saver` sample remains wheel-owned through `systemKey: 'Wheel'` and `partType: 'Rim Saver'`, keeps no misleading `partGroups`, does not appear under platform-owned `Boxes`, and preserves raw source metadata without runtime changes.

`Catalog-Gen2-4` is complete for current-sample Platform/Wheel system organization. Later Power and Fasteners organizer growth remains deferred because no runtime Power/Fasteners system expansion shipped in this family phase.

Dispatch next:
- `Catalog-Gen2-5 / Phase 1` prep

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-4 - System-Level Part Organization.md](./Future/Catalog-Gen2-4%20-%20System-Level%20Part%20Organization.md)

## [x] `Catalog-Gen2-4.5` - `Repo-Backed XR And ADV Asset Folder Intake`

### Family Phase Summary

Define how user-supplied repo-backed XR and ADV assets should enter the Catalog tree before Manager sends Worker to move files, seed entries, or build starting assemblies.

This family phase is complete for current supplied files.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-3`, `Catalog-Gen2-HLG-5`, `Catalog-Gen2-HLG-6`
- CLG: `Catalog-Gen2-CLG-3`, `Catalog-Gen2-CLG-6`, `Catalog-Gen2-CLG-9`, `Catalog-Gen2-CLG-10`

### Owns

- a repo-backed folder convention for loose XR and ADV parts
- a repo-backed folder convention for complete XR and ADV assemblies
- matching preview folder expectations
- deciding which supplied files are loose parts versus assembly candidates
- the metadata handoff checklist for live seed entries
- preserving platform/system/part metadata as Catalog truth rather than deriving it only from paths
- versioned multi-file asset sets where one item can own STEP, GLB, preview, fallback, and later updated source files
- same-item version history so a later `pubwheel_1` update adds a new source version instead of overwriting the current files silently

### Does Not Own

- importing arbitrary user files through the runtime import system
- PubParts or external source synchronization
- compatibility verdicts
- PubWheel Builder validation
- adding fake part records when no real asset file exists
- treating loose parts as starting assemblies
- splitting one logical item into duplicate Catalog cards only because it has more than one 3D file format
- solving STEP or GLB loader fidelity, preview derivation, or builder load behavior

### Planning Read

Manager created `Future/Catalog-Gen2-4.5 - Repo-Backed XR And ADV Asset Folder Intake.md` after the user supplied the XR PubWheel 1 STEP/GLB pair and the files were copied into `public/Catalog/assemblies/xr/`.

The expected planning target should start from this convention:

```text
public/Catalog/parts/
  xr/
    rails/
    boxes/
    bumpers/
    footpads/
    axle-blocks/
    motors/
    tires/
    hardware/
  adv/
    rails/
    boxes/
    bumpers/
    footpads/
    axle-blocks/
    motors/
    tires/
    hardware/

public/Catalog/assemblies/
  xr/
  adv/

public/CatalogPreviews/parts/
  xr/
  adv/

public/CatalogPreviews/assemblies/
  xr/
  adv/
```

The expected preferred source files for repo-backed assets are `.step` and `.stp`. Mesh files may still be useful as previews, fallback display/import artifacts, or later generated derivatives, but Manager should not optimize the repo-backed source lane around mesh-only files when STEP assets are available.

Concrete supplied assembly files now placed:
- `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step` as the preferred XR starting-assembly source truth, `73126597` bytes.
- `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb` as the XR companion mesh for later preview/fallback planning, `79230220` bytes.

These two files are the same item, `pubwheel_1`, and the same current source version. The STEP is the preferred CAD/source variant and the GLB is the companion runtime mesh or preview/fallback variant. `Catalog-Gen2-4.5 / Phase 1` created the planned-source asset-set contract and source-detail read helper for that shape. `Catalog-Gen2-4.5 / Phase 2` migrated the live XR planned seed into the accepted asset-set contract while preserving disabled/planned no-preview behavior and the transitional bridge fields.

`Catalog-Gen2-4.5 / Phase 3` is complete as a docs/test audit: focused verification confirmed the current copied Catalog asset set is only the XR PubWheel STEP/GLB pair above, staging-folder files remain outside the Catalog lane and were not moved/classified/seeded, no additional loose XR/ADV Catalog asset classification is needed for current supplied files, and the accepted source-version model can return to `Catalog-Gen2-5`.

Dispatch next:
- `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State`

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-4.5 - Repo-Backed XR And ADV Asset Folder Intake.md](./Future/Catalog-Gen2-4.5%20-%20Repo-Backed%20XR%20And%20ADV%20Asset%20Folder%20Intake.md)

## [x] `Catalog-Gen2-5` - `Pre-Built PubWheel Starting Assemblies`

### Family Phase Summary

Add full PubWheel starting assemblies to the catalog so the user can begin from a known PubWheel configuration instead of only loose parts.

This family phase is complete for current known-source starting assembly handoff truth.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-4`, `Catalog-Gen2-HLG-20`
- CLG: `Catalog-Gen2-CLG-7`, `Catalog-Gen2-CLG-37`

### Owns

- pre-built PubWheel entries
- one starting PubWheel assembly per main platform family
- the rule that these should load into the model as starting configurations
- consuming XR/ADV assembly-ready assets after `Catalog-Gen2-4.5` classifies the repo-backed file batch
- source-reference `Add To Project` handoff for verified ADV and XR full assembly files while builder load remains planned

### Does Not Own

- loose XR/ADV part folder intake
- the later builder flow
- the later compatibility checker
- every later recall or rebinding rule

### Planning Read

This lane should not turn PubWheel starts into loose part listings. They should read as starting assemblies or full-build records.

If the supplied XR/ADV assets are mostly loose parts, Manager should run `Catalog-Gen2-4.5` before `Catalog-Gen2-5`. If the supplied assets include complete XR or ADV full assemblies, `Catalog-Gen2-5` may consume those assembly-ready files after the folder convention and metadata handoff are clear.

`Catalog-Gen2-5 / Phase 1` is complete: Catalog now has an optional `itemRole: 'starting-assembly'` and planned starting-assembly metadata seam, with helper/item-page read copy that distinguishes starting assemblies from loose parts. No new action kind, live curated starting assembly entry, builder load runtime, import/project commit behavior, external PubParts starting assembly, or loose XR/ADV asset consumption shipped.

`Import-5 - STEP Import Metadata, Units, And Loader Fidelity` is the cross-family owner for actual STEP import behavior. `Catalog-Gen2-5 / Phase 2` may prefer `.step` and `.stp` as source asset truth, but it must not implement STEP units detection, representation toggles, tessellation settings, large-file load progress, staged parse reuse, or loader-parameter wiring.

`Catalog-Gen2-5 / Phase 2` is complete as a docs-only truthfulness/routing closeout: `public/Catalog/boards/adv/ADV_Full Assembly_parts.step` is verified as a real ADV starting-assembly source candidate, but it stays out of live Catalog seeds because current repo `assetPath` plus `load-preview` would expose on-demand preview for a roughly 55.8 MB STEP source before Import-5 guardrails. `ADV`, `GT`, `Pint`, `XR`, and `XR Classic` remain absent from live starting assembly seeds until a planned/unavailable entry shape or safer heavy STEP behavior exists.

`Catalog-Gen2-5 / Phase 2.1` is complete: Catalog now has a distinct `planned` source kind, a `plannedItems` snapshot lane, and one visible disabled/planned `ADV Full Assembly` starting assembly card that preserves the verified `Catalog/boards/adv/ADV_Full Assembly_parts.step` source path and `55825705` byte size as metadata without exposing repo `assetPath` preview. `GT`, `Pint`, `XR`, and `XR Classic` placeholders remained absent in that slice, and real load-as-starting-configuration behavior remained Phase 3 or later.

`Catalog-Gen2-5 / Phase 2.2` is complete as a truthful bridge: the supplied XR PubWheel full assembly files now live at `Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step` and `Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb`, and Catalog has a visible disabled/planned `XR PubWheel Assembly 1` starting assembly card. The STEP source path and `73126597` byte size are preserved as planned source metadata; the GLB companion path and `79230220` byte size are metadata only. No repo `assetPath` preview, Import-5 STEP loader behavior, or builder load behavior shipped.

`Catalog-Gen2-5 / Phase 2.3` is complete as a post-closeout UI cleanup: the now-heavy Catalog surface gained scoped dark scrollbars, left-rail and staged-source scroll containment, compact text sizing, long source/status/URL wrapping, and square item-page preview surfaces. This did not change source contracts, item data, preview/import behavior, or starting-configuration runtime.

Manager follow-up: `Catalog-Gen2-4.5` is complete for current supplied files. The XR PubWheel STEP/GLB pair has an accepted source-version/file-variant read, staging-folder files remain outside the Catalog lane, and starting-configuration handoff planning can resume without moving/classifying extra assets.

`Catalog-Gen2-5 / Phase 3` is complete as a docs/test closeout audit: focused verification confirmed planned ADV and XR starting assemblies remain source-lane-safe, disabled, and visible as starting assemblies without repo preview, builder load, Import-5 loader behavior, project commit, external PubParts conversion, or a new action kind. `GT`, `Pint`, and `XR Classic` starting assemblies remain source-missing and placeholder-unapproved; they are not live entries and should only be added later when real source assets or explicit placeholder policy exists. Real load-as-starting-configuration runtime remains later builder/runtime work, not a Gen2-5 implementation failure.

`Catalog-Gen2-5 / Phase 3.1` is complete: the existing planned ADV and XR full assembly source entries now expose available `Add To Project` behavior that commits the preferred STEP source path as a normal browser-project reference. The items still use the planned source lane, still block temporary preview, still show `Preview Planned`, and still do not claim Import-5 STEP fidelity or builder-owned load-as-starting-configuration runtime.

`Catalog-Gen2-6 / Phase 2` is complete as a docs/test audit: focused verification confirmed current Gen2 source/platform/start metadata and source fitment notes remain visible without claiming compatibility verdicts, part-to-part allowed rules, rear-box sub-assembly requirements, battery/BMS/wiring source truth, dimensional proof, Ricky Checker behavior, or builder runtime.

`Catalog-Gen2-6 / Phase 3` is complete as a docs/test audit: focused verification and final HLG/CLG review confirmed Generation 2 is complete for scoped source/metadata/organization/starting-assembly groundwork. Runtime archive download/import/chooser, PubWheel Builder runtime, load-as-starting-configuration runtime, Ricky Checker, compatibility verdicts, dimensional proof, Import-5 STEP loader fidelity, GT/Pint/XR Classic source-missing starts, future Power/Fasteners growth, and staging-folder extras remain later-owner work.

Dispatch next:
- none from this historical `Catalog-Gen2-5` handoff; the later `Catalog-Gen2-7` follow-up is now complete and the current Gen2 read above owns any new routing.

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-5 - Pre-Built PubWheel Starting Assemblies.md](./Future/Catalog-Gen2-5%20-%20Pre-Built%20PubWheel%20Starting%20Assemblies.md)

## [x] `Catalog-Gen2-6` - `Metadata Groundwork For Later Builder And Compatibility`

### Family Phase Summary

Prepare the metadata truth that later `Generation 3` builder and checker work will need, without trying to ship those runtime features inside `Generation 2`.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-4`
- CLG: `Catalog-Gen2-CLG-8`

### Owns

- part-to-part allowed metadata direction
- builder-slot-friendly metadata
- sub-assembly metadata
- rear-box supporting-part metadata

### Does Not Own

- the `Ricky Checker`
- later dimensional fit math
- the full `PubWheel Builder` runtime

### Planning Read

This lane should stop at metadata and curation truth. Runtime verdicts, builder validation, and dimensional proof belong to later generations.

`Catalog-Gen2-6 / Phase 1` is complete as a docs/test audit: focused verification confirmed the current planned starting assembly, planned source, source asset-set, action-plan, and source-lane contracts already provide the sparse builder-friendly metadata boundary Gen2 can truthfully own. No builder fields, slot validation, load-as-starting-config action, compatibility verdicts, placeholder cards, staging-file moves, or Import-5 loader behavior shipped.

`Catalog-Gen2-6 / Phase 2` is complete as a docs/test audit: focused verification confirmed current Gen2 source/platform/start metadata and source fitment notes remain visible without claiming compatibility verdicts, part-to-part allowed rules, rear-box sub-assembly requirements, battery/BMS/wiring source truth, dimensional proof, Ricky Checker behavior, or builder runtime.

`Catalog-Gen2-6 / Phase 3` is complete as a docs/test audit: focused verification and final HLG/CLG review closed Generation 2 under scoped proof. No `Catalog-Gen2-6 / Phase 3.1` or additional Gen2 family phase is needed.

The original Generation 2 baseline is complete. The user has reopened Gen2 with a follow-up for full PubParts part population and eager image display. Later archive runtime, builder runtime, compatibility verdicts, Import-5 STEP fidelity, missing platform starts, future Power/Fasteners growth, and staging-folder extras remain later-owner work.

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-6 - Metadata Groundwork For Later Builder And Compatibility.md](./Future/Catalog-Gen2-6%20-%20Metadata%20Groundwork%20For%20Later%20Builder%20And%20Compatibility.md)

## [x] `Catalog-Gen2-7` - `Full PubParts Catalog Population And Eager Image Display`

### Family Phase Summary

Populate Catalog from every available PubParts part record and make PubParts preview images visible immediately when the user opens Catalog.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-1`, `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-3`, `Catalog-Gen2-HLG-7`, `Catalog-Gen2-HLG-8`
- CLG: `Catalog-Gen2-CLG-1`, `Catalog-Gen2-CLG-2`, `Catalog-Gen2-CLG-3`, `Catalog-Gen2-CLG-11`, `Catalog-Gen2-CLG-12`

### Owns

- full deterministic cached PubParts part coverage
- dedupe between full and filtered PubParts source sets
- live Catalog population from the full cached PubParts part set
- eager PubParts image preview display on Catalog load
- preserving external-linked PubParts source truth

### Does Not Own

- live browser fetch unless explicitly approved later
- eager archive download
- model file import
- heavy STEP source loading
- builder load-as-starting-configuration behavior
- compatibility verdicts

### Planning Read

This lane exists because the previous Gen2 closeout proved the source contract with a tiny cached PubParts sample, but the user now wants Catalog to show all PubParts parts.

`Catalog-Gen2-7 / Phase 1` is complete: the repo now has a deterministic full PubParts `parts.json` refresh script, a 319-record full part source module, and a deduped full part helper.

`Catalog-Gen2-7 / Phase 2` is complete: live `CatalogSurface` now composes the full cached PubParts part helper, not the old tiny all-parts plus filtered GT proof slices. Tests prove exactly 319 external PubParts part records under `external-pubparts-parts`, separate resource records, duplicate prevention for known filtered overlap, external section-option counting, source-lane-safe external records, and no local asset/add-to-project/archive-import/heavy STEP/builder/compatibility-verdict widening.

`Catalog-Gen2-7 / Phase 3` is complete: PubParts preview image normalization now keeps absolute `http(s)` URLs stable, converts protocol-relative URLs to `https://`, converts PubParts-root-relative `/images/...` paths to `https://pubparts.xyz/images/...`, and preserves first-usable array-shaped `imageSrc` behavior. External PubParts image previews render eagerly in grid cards and item pages without initial temporary preview-session membership. Tests keep source-page URLs, linked archive URLs, Dropbox/archive/model/STEP links, planned heavy STEP entries, add-to-project behavior, builder load, and compatibility verdicts out of eager image rendering.

The expected implementation should still use a repo-owned cached/normalized PubParts source lane first. The worker should not switch to direct browser fetch or production sync without a new Manager approval, because the earlier Gen2 intake read chose caching after the PubParts live-fetch/CORS check.

PubParts preview images should render eagerly. This is intentionally narrower than eager source loading: images are browse context, while archives, model files, STEP sources, and builder actions stay lazy and user-driven.

Dispatch next:
- `Catalog-Gen2-8 / Phase 1 - External Import Action Boundary`

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-7 - Full PubParts Catalog Population And Eager Image Display.md](./Future/Catalog-Gen2-7%20-%20Full%20PubParts%20Catalog%20Population%20And%20Eager%20Image%20Display.md)

## [x] `Catalog-Gen2-8` - `PubParts Download Staging And Import Handoff`

### Family Phase Summary

Add the first honest download/import affordance for external PubParts entries. A user should be able to stage or download source files into a visible PubParts downloads area, inspect what was staged, choose supported files, and only then hand selected files to the normal ParaHook import/project path.

This is still an external source handoff lane. It should not make PubParts entries behave like repo-backed assets before the selected file or files have passed through the normal import/project pipeline, and it should keep source-entry, staged/downloaded, inspected, importable, imported, and unsupported states visually distinct.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-1`, `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-9`, `Catalog-Gen2-HLG-10`
- CLG: `Catalog-Gen2-CLG-4`, `Catalog-Gen2-CLG-13`, `Catalog-Gen2-CLG-14`, `Catalog-Gen2-CLG-15`, `Catalog-Gen2-CLG-16`

### Owns

- external PubParts import/source-inspection action boundary
- dedicated PubParts downloads browser-storage bucket and Home Page storage display
- source-entry to staged/downloaded source to imported project-asset lifecycle state
- downloaded-versus-imported status on PubParts entries and item pages
- staged downloads list and clear controls that do not affect imported project assets
- user-triggered inspection of linked model, archive, or folder candidates
- supported, unsupported, reference, and unknown file classification for inspected source contents
- supported-file chooser before import
- selected-file handoff into the existing import/project path
- PubParts provider, source page, archive URL, and source freshness attribution on the handoff

### Does Not Own

- automatic archive or model download on Catalog load
- treating staged/downloaded PubParts source files as imported project assets
- importing every supported file by default
- pretending a Dropbox folder or ZIP URL is already a local project asset
- replacing the normal import system
- STEP units, tessellation, large-file progress, parse reuse, or loader fidelity beyond the Import-family handoff
- compatibility verdicts, `Ricky Checker`, PubWheel Builder slot validation, or dimensional proof

### Planning Read

This lane exists because `Catalog-Gen2-2` deliberately stopped at inspect-only linked archive metadata and candidate classification, while the user now wants an actual button path. The button path should be honest: `Download Source`, `Inspect Files`, `Import From Source`, or similarly explicit wording is better than exposing normal repo-backed `Add To Project` before a supported file is staged, inspected, and selected.

Phase 1 should own PubParts download storage and Home visibility. It should define or close out the dedicated PubParts downloads storage bucket, Home Page storage display, source-entry versus staged/downloaded state language, and the rule that eager images do not imply eager source downloads.

`Catalog-Gen2-8 / Phase 1` is complete for the revised storage/Home visibility ownership: the dedicated PubParts downloads browser-storage bucket exists as `parahook:catalog:pubparts-downloads`, Home Page Storage Management displays the `Catalog/PubParts/Downloads` folder path, focused Home Page tests passed, and `npm.cmd run build` passed. No `Phase 1.1` is needed. Downloaded-versus-imported Catalog status, staged-download records, staged-download list/clear controls, source inspection, chooser, and import handoff remain open for Phase 2+ as planned.

`Catalog-Gen2-8 / Phase 2` is complete: external PubParts item pages now render a disabled `Inspect Files Planned` source-action boundary from `linkedArchiveUrl`-only candidate metadata, with stable `data-catalog-external-source-action-boundary` proof. Action kinds stayed unchanged, external PubParts entries remain preview-only with no `add-to-project`, and source-page links, linked archive metadata/classification, eager images, repo/import/planned behavior, builder behavior, and compatibility behavior stayed unchanged. Source download/staging records, inspection, chooser, and import handoff remain Phase 3+.

`Catalog-Gen2-8 / Phase 3` is complete: external PubParts item pages can now stage linked source candidates as metadata-only records in `parahook:catalog:pubparts-downloads` through an explicit `Stage Source Link` action. Staged records preserve provider/source attribution, candidate URL, source-page/context URLs, freshness, and source metadata while keeping `binaryStatus: not-downloaded`, `inspectionStatus: not-inspected`, and `importStatus: not-imported`. No records are added to Catalog snapshot lanes, no source bytes are downloaded, no contents are inspected, no chooser/import/project commit behavior ships, and no staging occurs on initial Catalog load.

`Catalog-Gen2-8 / Phase 4` is complete: the Catalog browse rail now lists staged PubParts source-link metadata with empty, per-record clear, and clear-all states. Clear operations mutate only the `parahook:catalog:pubparts-downloads` staged metadata state, immediately refresh item-page staged/ready copy, and do not touch Catalog snapshot lanes, imported references, project assets, attribution history, preview sessions, source-page links, linked archive metadata/classification, eager images, action plans, builder behavior, or compatibility behavior.

`Catalog-Gen2-8 / Phase 5` is complete: staged PubParts source records can now be metadata-inspected only after the user triggers `Inspect Staged Source Metadata`. The inspection result classifies only the staged `sourceCandidateUrl` from `linkedArchiveUrl`; direct `.step`, `.stp`, `.glb`, `.obj`, and `.stl` URLs can become supported direct file candidates, while Dropbox/shared-source and `.zip` links record `Archive Source Needs Inspection` because contents remain unknown. The phase kept `binaryStatus: not-downloaded` and `importStatus: not-imported`, did not inspect on initial load, and did not add byte download, archive listing, extraction, chooser, import, action-kind, builder, or compatibility behavior.

`Catalog-Gen2-8 / Phase 6` is complete: metadata-inspected staged PubParts source records can now expose a supported-file chooser only when the staged `sourceCandidateUrl` is a supported direct `.step`, `.stp`, `.glb`, `.obj`, or `.stl` candidate. The selected supported file is stored as staged metadata only, with `binaryStatus: not-downloaded` and `importStatus: not-imported` preserved. Archive/shared/ZIP, unsupported, unknown, and not-yet-inspected records show no-selectable states instead of invented file contents.

`Catalog-Gen2-8 / Phase 7` is complete as a scoped selected-file handoff/status implementation: item pages now read selected supported PubParts direct file candidates as Import-family handoff candidates with PubParts source attribution, keep `.step`, `.glb`, `.obj`, and `.stl` selected files not downloaded/not imported, and route selected `.stp` files to Import/reference type support. The phase did not create `assetPath`, object URLs, imported reference ids, project commits, action kinds, archive extraction, STEP loader fidelity, builder behavior, or compatibility verdicts.

`Catalog-Gen2-8 / Phase 8` is complete: external PubParts item pages can open the source download in the browser, staged PubParts source records can launch the existing local supported-file picker through `Import Downloaded Files`, chosen local files land in the staged Import review dialog, and PubParts attribution is preserved into staged import files and accepted imported reference records. The phase intentionally did not fetch remote bytes, list or extract ZIP/shared-folder contents, accept `.stp`, add STEP loader fidelity, add builder behavior, add compatibility verdicts, or commit project assets directly from Catalog.

Dispatch next:
- `Catalog-Gen2-9 / Phase 1 - Local Library Boundary And Folder Contract`

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-8 - External PubParts Supported-File Import Handoff.md](./Future/Catalog-Gen2-8%20-%20External%20PubParts%20Supported-File%20Import%20Handoff.md)

## [x] `Catalog-Gen2-9` - `Local PubParts Library Folder And Auto-Discovery Handoff`

### Family Phase Summary

Replace the weak "open a remote source and hope the user can find the downloaded file later" workflow with a known local PubParts library folder. The user should grant or choose a local root once, ParaHook should organize PubParts downloads into predictable per-item folders with source manifests, and the Catalog item page should be able to show whether supported local files were discovered and can be handed to Import.

The workflow should also get two real surfaces: Home Page should expose the global PubParts Library toggle/status row, and Catalog should expose a `Local Downloads` section where the user can see which PubParts parts/items already have local downloaded, extracted, found, unsupported, needs-extraction, import-ready, or imported files.

The item page should feel simpler than the underlying workflow. The first user-facing target is one primary PubParts local action whose label and behavior are derived from the current source/local-file state. It may internally progress through setup, open source, scan, import, and later preview, but the user should not see a row of competing process buttons.

This family phase is a cross-family handoff. Catalog owns the visible source identity, per-item status, and item-page workflow. Import owns folder permission, local file scanning, supported-file detection, file handles, archive extraction if it later ships, and the staged import review dialog.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-1`, `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-9`, `Catalog-Gen2-HLG-10`, `Catalog-Gen2-HLG-11`, `Catalog-Gen2-HLG-12`, `Catalog-Gen2-HLG-13`
- CLG: `Catalog-Gen2-CLG-15`, `Catalog-Gen2-CLG-16`, `Catalog-Gen2-CLG-17`, `Catalog-Gen2-CLG-18`, `Catalog-Gen2-CLG-19`

### Owns

- local PubParts library folder concept in the Catalog flow
- per-item PubParts folder readiness/status
- Catalog `Local Downloads` section for PubParts local file states
- Home Page PubParts Library toggle/status coordination
- one-primary-action item-page resolver for the PubParts local workflow
- source manifest expectations for provider, Catalog item id, source page, source/archive URL, freshness, and source version
- item-page copy/actions for prepare local folder, scan local folder, and import found files
- truthful browser sandbox boundary copy
- routing the implementation owner for folder permission/scanning into the Import family

### Does Not Own

- silently scanning the user's arbitrary `Downloads` folder
- bypassing user folder permission or local file selection
- remote byte fetching into local disk
- Dropbox shared-folder listing or ZIP extraction in Catalog
- retaining raw file handles inside Catalog metadata after Import accepts files
- STEP units, tessellation, heavy-load progress, parse reuse, or loader fidelity
- compatibility verdicts, `Ricky Checker`, PubWheel Builder slot validation, or dimensional proof

### Planning Read

The shipped `Catalog-Gen2-8` handoff was honest but incomplete as a user workflow. `Catalog-Gen2-9` now gives the app a browser-honest local library metadata loop: Home Page exposes the PubParts Library status/toggle, Catalog can prepare predictable per-item folder and manifest paths, and item pages advance through one local-library action instead of exposing a row of competing process buttons.

The first folder convention should be:

```text
<UserSelectedRoot>/PubParts/
  parts/
    <catalog-item-slug>/
      pubparts-source.json
      source/
      downloads/
      extracted/
      importable/
      versions/
        <source-version-key>/
          manifest.json
          files/
```

The browser version must treat this as a permissioned local-library workflow, not as silent filesystem access. Where File System Access API support exists, the user can grant the root folder. Where it does not, the fallback remains explicit file/folder picking and staged Import review. A later desktop/native owner can add true remote-byte download into the library folder, but that is not a Catalog promise.

Home Page now shows the global PubParts Library toggle/status row because this is app-level source-library setup. The current browser-safe toggle records not-configured, permission-needed, and disabled states in the PubParts storage owner seam without pretending local disk permission or background scans have happened.

Catalog now shows local downloads because item-level local source state belongs next to the Catalog browse flow. The first `Local Downloads` rail section lists PubParts items with local-library metadata and keeps folder/manifest reads visible outside the item page.

The item-page action collapsed into one primary button. The current resolver advances through:
- `Prepare PubParts Folder`
- `Stage Source Link`
- `Import Local Files`

Preview should be treated as a later state on the same flow, not as a promise that remote PubParts links can be previewed before the user has a known local file.

Dispatch next:
- `Catalog-Gen2-10 / Phase 1 - Dropbox Chooser Bridge Boundary`

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-9 - Local PubParts Library Folder And Auto-Discovery Handoff.md](./Future/Catalog-Gen2-9%20-%20Local%20PubParts%20Library%20Folder%20And%20Auto-Discovery%20Handoff.md)

## [x] `Catalog-Gen2-10` - `Dropbox Chooser Add-To-Project Bridge`

### Family Phase Summary

Add Dropbox Chooser as the first direct Dropbox path behind PubParts `Add To Project`.

This should make the user flow better without taking on the full Dropbox shared-link API yet. The user picks the exact supported source/model file from Dropbox, ParaHook fetches the returned direct temporary link, and Import stages the resulting file with PubParts attribution.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-10`, `Catalog-Gen2-HLG-14`
- CLG: `Catalog-Gen2-CLG-15`, `Catalog-Gen2-CLG-20`

### Owns

- a small Dropbox Chooser owner seam
- loading/availability/cancel/failure states for the Chooser bridge
- supported file extension filtering for user-selected Dropbox files
- direct temporary link fetch into a local `Blob`/`File`
- PubParts attribution preservation when the fetched file enters staged Import
- `Add To Project` routing into the Chooser bridge for eligible PubParts entries

### Does Not Own

- full Dropbox shared-link API inspection
- OAuth account browsing beyond what Chooser requires
- Dropbox folder listing from arbitrary shared links
- ZIP/shared-folder extraction or archive content listing
- native direct download into the PubParts local library
- STEP loader fidelity
- builder/runtime load behavior
- compatibility verdicts

### Planning Read

Chooser is the recommended first Dropbox integration because it keeps the user explicitly in control of which file is imported. It should not pretend that one PubParts Dropbox URL always maps to one supported file. The bridge should open Dropbox Chooser, accept only supported files, fetch the selected direct link promptly because those links are temporary, and then hand a real file-like object to the existing Import staging path.

`Catalog-Gen2-10` is complete for the first direct Dropbox bridge: `src/app/catalog/dropboxChooserBridge.ts` owns the typed Chooser adapter and direct-link fetch helper, PubParts item pages expose `Add To Project` as the primary direct bridge, selected Dropbox files stage through the existing Import review draft with PubParts attribution, and local fallback controls remain visible for unavailable, canceled, unsupported, `.stp` Import-gap, or fetch-failed states.

Dispatch next:
- `Catalog-Gen2-11 / Phase 1 - Dropbox Shared Direct File Resolver`

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-10 - Dropbox Chooser Add-To-Project Bridge.md](./Future/Catalog-Gen2-10%20-%20Dropbox%20Chooser%20Add-To-Project%20Bridge.md)

## [x] `Catalog-Gen2-11` - `Dropbox Shared-Link Resolver And Candidate Choice`

### Family Phase Summary

Add the heavier PubParts-owned Dropbox path behind `Add To Project`.

This lane is different from Dropbox Chooser. Chooser asks the user to choose a file from a Dropbox account they can access. `Catalog-Gen2-11` should start from the PubParts source URL already attached to the Catalog item and try to resolve that shared link directly.

This family phase is complete for the current cached PubParts corpus. Current source coverage is direct/ZIP-shaped only: the audit found 305 Dropbox source URLs in `src/app/catalog/pubpartsSourceData/fullParts.ts`, all 305 are `.zip`, and there are zero folder-shaped Dropbox records. Future folder-shaped PubParts source records should reopen a follow-up phase instead of relying on fake fixtures.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-10`, `Catalog-Gen2-HLG-15`
- CLG: `Catalog-Gen2-CLG-21`, `Catalog-Gen2-CLG-22`

### Owns

- classifying PubParts Dropbox shared URLs as direct file, ZIP/archive, shared folder, unsupported, blocked, or unknown
- resolving direct shared-file URLs into fetchable browser bytes when Dropbox/CORS permits it
- preserving PubParts attribution when a resolved file is staged in Import review
- showing a supported-file choice when a shared source yields more than one candidate
- a floating staged-source options window, similar to the Import staged-files window, where users can select one, some, or all supported candidates discovered behind the PubParts link
- falling back to `Open Source` / local import when the shared link cannot be resolved safely

### Does Not Own

- account-wide Dropbox OAuth browsing
- access to Dropbox files unrelated to the PubParts item source URL
- pretending ZIP/archive or shared-folder links are importable before inspection proves supported candidates exist
- silent native download into the local PubParts library
- STEP loader fidelity
- builder/runtime load behavior
- compatibility verdicts

### Planning Read

Start with direct shared-file resolution. If a PubParts item points to a single supported `.glb`, `.obj`, `.stl`, `.step`, or `.stp` shared Dropbox file, `Add To Project` should try to resolve/fetch that file, stage it in the existing Import review dialog, and show the same source-attribution boundary as the Chooser bridge.

ZIP/archive and shared-folder links should not be treated as solved by the direct-file resolver. The next phases should inspect/list candidates first, open a Catalog-owned floating staged-source options window, let the user pick the supported source file or files they want, and then stage only those selected files into Import review. If browser-only Dropbox shared-link resolution cannot list shared-folder contents, route that sub-lane to a later Dropbox API/helper or desktop/native owner instead of faking the contents.

The options window should behave like an upstream staging surface, not final import. It should show candidate file names, file types, supported/unsupported state, source path or archive path when known, file size when known, and selection controls for each supported file. It should also provide `Select All Supported`, `Clear Selection`, `Stage Selected`, `Open Source`, and close/cancel controls. Unsupported entries should be visible but unselected and disabled for staging unless a later owner adds support for that file type.

`Catalog-Gen2-11 / Phase 1` is complete: PubParts `Add To Project` now stages the source link if needed, classifies the shared source URL, opens a Catalog-owned `PubParts Source Options` floating window, and can fetch/stage direct supported `.step`, `.glb`, `.obj`, and `.stl` shared files into Import review with PubParts attribution when browser fetch succeeds. `.stp` remains visible as an Import support gap, and ZIP/archive links stay visible as `Archive Needs Inspection` but disabled for staging until a later inspection/listing phase can prove supported candidates.

`Catalog-Gen2-11 / Phase 2` is complete: known manifest-backed archive URLs can now show deterministic archive entries in the source-options window without parsing ZIP bytes. The first trusted manifest is the real `3d Printed Gripples` PubParts ZIP: `gripple_standard.stl` is selectable as metadata, while `gripple_standard.3mf` and the included PDF remain visible but disabled. `Stage Selected` for archive entries reports that extraction/materialization is still required and does not fetch, parse, extract, create object URLs, append Import draft files, or add project assets. Plain ZIP/archive URLs without a trusted manifest still show `Archive Needs Inspection`.

`Catalog-Gen2-11 / Phase 3` is complete as a docs/test source-data audit: Manager denied the fake shared-folder fixture seam because current PubParts source data has no folder-shaped Dropbox records. The audit confirmed 305 cached full-part Dropbox URLs, all `.zip`, with zero shared-folder records. No runtime code is needed for current Gen2 coverage. If PubParts later adds folder-shaped records, route that follow-up to real source data and likely a Dropbox API/helper/native owner or trusted manifest; do not add browser scraping or invented folder contents.

Current-corpus Gen2 closeout before `Catalog-Gen2-12`: all current PubParts parts are populated from the deterministic cache, PubParts images render eagerly, PubParts item-page source actions and `Add To Project` source options cover the current direct/ZIP-shaped corpus honestly, but true ZIP extraction is now reopened as a user-visible Gen2 requirement because most PubParts source links are archives.

Dispatch next:
- `Catalog-Gen2-12 / Phase 1 - Browser ZIP Reader And Entry Manifest Contract`

### Family Phase Doc

- [x] created and completed [Future/Catalog-Gen2-11 - Dropbox Shared-Link Resolver And Candidate Choice.md](./Future/Catalog-Gen2-11%20-%20Dropbox%20Shared-Link%20Resolver%20And%20Candidate%20Choice.md)

## [x] `Catalog-Gen2-12` - `Efficient PubParts ZIP Inspection And Selected Extraction`

### Family Phase Summary

Make ZIP-backed PubParts items actually usable from the Catalog source-options flow.

`Catalog-Gen2-11` proved that PubParts shared links are current-corpus ZIP-shaped and that a Catalog-owned source-options dialog can list candidates. `Catalog-Gen2-12` should replace the one trusted manifest proof with real on-demand ZIP entry inspection and selected extraction for the one PubParts archive the user is acting on.

This must stay efficient. Catalog should not download, inspect, or extract all PubParts ZIPs at startup. It should only fetch the selected item's ZIP after the user asks to add/import that item, list entries, let the user select supported files, and extract only selected supported entries into Import review.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-10`, `Catalog-Gen2-HLG-15`, `Catalog-Gen2-HLG-16`
- CLG: `Catalog-Gen2-CLG-23`, `Catalog-Gen2-CLG-24`, `Catalog-Gen2-CLG-25`, `Catalog-Gen2-CLG-26`, `Catalog-Gen2-CLG-27`

### Owns

- choosing and wiring a browser-safe ZIP reader dependency or local helper
- fetching one user-selected PubParts ZIP when the source-options flow needs inspection
- offering a local `.zip` picker fallback when the selected PubParts ZIP cannot be read by browser fetch
- listing ZIP entries with names, archive paths, sizes when available, directory state, and supported/unsupported classification
- filtering unsafe ZIP paths before display or extraction
- extracting only selected supported entries into browser `File`/`Blob` records
- staging extracted files into Import review with PubParts source attribution
- cheap archive manifest caching keyed by PubParts item identity, source URL, and `dropboxZipLastUpdated`

### Does Not Own

- eager PubParts archive downloads on Catalog load
- inspecting all 305 current PubParts ZIP links up front
- extracting every file in an archive by default
- making unsupported entries importable
- persistent local ZIP byte storage, native downloads, or folder materialization
- STEP loader fidelity, `.stp` support, builder runtime, or compatibility verdicts
- Dropbox shared-folder listing when source data eventually contains real folder-shaped records

### Planning Read

The preferred runtime path is:

1. User clicks the PubParts primary action / `Add To Project` for one external item.
2. Catalog resolves the linked Dropbox ZIP to a direct browser-fetchable archive URL.
3. Catalog fetches that one ZIP blob only.
4. A ZIP reader lists entries without importing them.
5. Catalog classifies entries into supported import candidates and unsupported/reference context.
6. The source-options dialog lets the user select one, some, or all supported entries.
7. `Stage Selected` extracts only the selected supported entries and hands them to the existing staged Import review path with PubParts attribution.

Use a proven browser ZIP library rather than hand-rolling ZIP parsing unless Worker prep finds a repo-specific blocker. Keep the helper pure enough to test with fixture ZIP blobs and without network.

`Catalog-Gen2-12 / Phase 1` is complete: `@zip.js/zip.js` is installed, `src/app/catalog/pubPartsZipArchive.ts` lists and classifies ZIP entries from a Blob through a pure helper, fixture ZIP tests cover supported, unsupported, unsafe, directory, oversized, unknown-size, over-count, and malformed archive cases, and the resolver test/build gate passed. This is only the browser ZIP reader and entry manifest contract; source-options wiring, selected extraction, Import staging, and manifest caching remain open, so `Catalog-Gen2-HLG-16` stays incomplete.

`Catalog-Gen2-12 / Phase 2` is complete: ZIP-backed PubParts source options now open immediately from user action, inspect one browser-fetched Dropbox ZIP through the async shared-link helper, replace the placeholder with real ZIP entry candidates, and keep supported archive selections metadata-only until extraction ships. The hard-coded Gripples production manifest proof is retired and covered by fixture-backed ZIP inspection tests. Selected extraction, Import staging, and manifest caching remain open, so `Catalog-Gen2-HLG-16` stays incomplete.

`Catalog-Gen2-12 / Phase 3` is complete: selected supported archive entries can now be extracted from the inspected ZIP blob, converted into `ImportedReferenceFile` records with object URLs, and staged into the existing Import review draft with PubParts attribution. Direct-only, archive-only, and mixed direct/archive selections materialize first and append as one batch only after every selected file succeeds. Unsupported, unsafe, blocked, hidden/system, directory, oversized, unknown-size, and stale archive candidates remain unstageable. Manifest caching remains open, so `Catalog-Gen2-HLG-16` stays incomplete.

`Catalog-Gen2-12 / Phase 4` is complete: repeat ZIP source-options opens now use a metadata-only archive manifest cache keyed by provider, Catalog item id, Dropbox ZIP source URL, and `archiveLastUpdated` / PubParts `dropboxZipLastUpdated`. Cache hits skip the entry-listing fetch/read for display, but selected archive staging still refetches or reuses real ZIP bytes and reruns Phase 3 extraction guards before Import review. No ZIP bytes, extracted bytes, object URLs, candidates, Import drafts, or project assets are stored in the cache.

`Catalog-Gen2-12 / Phase 5` is complete as a readable-blob/fixture-backed docs/test audit: it inspected the ZIP helper, archive manifest cache, shared-link resolver, source-options dialog, `CatalogSurface`, and Import staged-draft seams; confirmed CLG 23-26 for browser-readable ZIP blobs; and passed focused ZIP/cache/resolver/surface/shell tests plus `npm.cmd run build`. Its original HLG closeout read is superseded by the live PubParts CORS finding below.

Post-closeout correction: live PubParts Dropbox ZIP fetches can fail in the browser with `PubParts ZIP archive fetch failed` because remote ZIP bytes are not browser-readable from localhost/ParaHook when CORS/network policy blocks fetch. The Phase 5 audit remains valid for readable ZIP blobs and fixture-backed extraction, and CLG 23-26 stay complete, but `Catalog-Gen2-HLG-16` is reopened until the source-options flow offers a local `.zip` picker fallback for browser-blocked PubParts archives.

`Catalog-Gen2-12 / Phase 5.1` is prepped for Manager review: keep the current on-demand remote ZIP fetch attempt when readable, and when it fails, let the user manually download/open the PubParts ZIP and choose the local `.zip` file. Catalog should list that local ZIP through the existing `pubPartsZipArchive` helper, show supported/unsupported entries in source options, and let `Stage Selected` extract selected supported entries from the local ZIP blob into Import review with PubParts attribution.

`Catalog-Gen2-12 / Phase 5.1` is complete: source options now keeps the readable-remote ZIP path, but fetch failures no longer dead-end the user. The dialog offers `Open Source` plus `Choose Local ZIP`; after the user downloads/opens the PubParts ZIP and chooses the local `.zip`, Catalog lists entries through `pubPartsZipArchive`, maps them into the existing source-options candidates, stores the local ZIP blob only ephemerally in dialog state, and reuses it for `Stage Selected` so selected supported entries stage into Import review with PubParts attribution. The focused Catalog surface test now proves remote ZIP fetch failure to local ZIP picker to selected entry staging.

Dispatch next:
- `Catalog-Gen2-13 / Phase 1 - Download And Upload Source Actions`

### Family Phase Doc

- [x] created and reopened for [Future/Catalog-Gen2-12 - Efficient PubParts ZIP Inspection And Selected Extraction.md](./Future/Catalog-Gen2-12%20-%20Efficient%20PubParts%20ZIP%20Inspection%20And%20Selected%20Extraction.md)

## [x] `Catalog-Gen2-13` - `PubParts ZIP Staged Importer And Preview Handoff`

### Family Phase Summary

Turn the PubParts ZIP path into a real staged importer flow on top of the completed `Catalog-Gen2-12` ZIP mechanics.

The current ZIP helper can list local ZIP entries and stage selected supported entries into Import review. `Catalog-Gen2-13` should make that flow read clearly to the user: `Add To Project` opens source options, ParaHook shows PubParts metadata and source link context, the user downloads or opens the ZIP through browser behavior, the user explicitly uploads or chooses the saved ZIP, and Catalog populates a staged importer list with entry selection and preview affordances where feasible.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-17`
- CLG: `Catalog-Gen2-CLG-28`, `Catalog-Gen2-CLG-29`, `Catalog-Gen2-CLG-30`, `Catalog-Gen2-CLG-31`, `Catalog-Gen2-CLG-32`

### Owns

- Catalog source-options/staged importer UX for ZIP-backed PubParts items
- PubParts item metadata and source link context in that window
- browser-honest download/open-source action labels and status copy
- explicit upload/choose-ZIP action as the local file-read grant
- ZIP entry staged importer list, selection state, and supported/unsupported/blocked reads
- preview affordance placement for previewable supported entries
- selected supported file handoff into Import review with PubParts attribution

### Does Not Own

- forcing the browser download folder or silently discovering where the user saved the ZIP
- native direct download, remote-byte proxy, helper-managed local folder ownership, or automatic source materialization
- accepted project asset ownership
- model viewport insertion before Import/project accepts the files
- STEP fidelity, `.stp` support, heavy loader progress, builder behavior, or compatibility verdicts

### Planning Read

This is a new `Catalog-Gen2-13` lane rather than `Catalog-Gen2-12 / Phase 6` because `Catalog-Gen2-12` is already the completed ZIP mechanics lane. The new work is a staged importer user-flow and handoff phase. Keeping it separate preserves the historical ZIP reader/listing/extraction phases and lets the next Worker start with a smaller UI/copy/action-label slice.

Browser constraints are part of the phase contract. ParaHook can open the PubParts source or initiate browser download behavior, but it cannot force a save folder and cannot silently read `Downloads`. The upload/choose-ZIP action is the explicit grant that gives ParaHook local ZIP bytes.

Implementation slices:
1. `Phase 1 - Download And Upload Source Actions`
2. `Phase 2 - ZIP Entry Staged Importer List`
3. `Phase 3 - Preview Affordance For Previewable Supported Files`
4. `Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit`

`Catalog-Gen2-13 / Phase 1` is complete: PubParts ZIP source options now read as a staged importer shell, show PubParts source metadata, label ZIP links as `Download ZIP`, prefer Dropbox `dl=1` download URLs where possible, explain that the browser controls the save location, and label the explicit local file-read grant as `Upload ZIP`. Existing ZIP listing/extraction and Import review behavior stayed intact.

`Catalog-Gen2-13 / Phase 2` is prepped for Manager approval: after the user uploads/chooses the downloaded PubParts ZIP, the dialog should become a staged importer list with archive path, file name, type, size, support state, blocked reason when present, selected state, disabled unstageable rows, source metadata still visible, predictable per-row/select-all/clear selection behavior, and the current Import review handoff preserved.

`Catalog-Gen2-13 / Phase 2` is complete: ZIP archive candidates now render as staged ZIP entry rows with archive path, file name, type, formatted size, support state, blocked reason when present, selected state, stable selectors, disabled unstageable rows, source metadata still visible, and the existing Import review handoff preserved.

`Catalog-Gen2-13 / Phase 3` is prepped for Manager approval: current code supports truthful geometry preview for `step`, `stl`, `obj`, and `glb` only after archive entries are materialized into staged Import draft files with object URLs. The next slice should therefore add a staged ZIP row `Preview in Import review after staging` label for supported/selectable entries and `No preview` labels for unsupported or blocked entries, without adding a direct Catalog preview button or changing extraction, Import acceptance, project assets, native downloads, STEP fidelity, builder behavior, or compatibility verdicts.

`Catalog-Gen2-13 / Phase 3` is complete: staged ZIP entry rows now show `Preview: In Import review after staging` for selectable supported current Import reference types and `Preview: Not available` for unsupported, blocked, directory, hidden/system, `.stp`, or otherwise unselectable rows. The affordance is informational only; no Catalog preview button, early extraction, early object URL creation, Import accept behavior, project asset behavior, native download/folder behavior, STEP fidelity, supported type expansion, builder behavior, compatibility verdict, or ZIP extraction rule changed.

`Catalog-Gen2-13 / Phase 4` is prepped for Manager approval: current code already stages selected PubParts ZIP files into Import review with attribution through `openStagedImportDraft` and `appendStagedImportDraftFiles`, while `commitStagedImportDraft` owns accepted imported reference creation. The next slice should polish the Catalog source-options final action from generic `Stage Selected` to `Stage Selected to Import Review`, update focused Catalog tests, run BrowserPanel/useAppStore staged-import audit tests, and document model viewport geometry display as a reference loader/viewer follow-up if committed references exist but rendered geometry is not proven.

`Catalog-Gen2-13 / Phase 4` is complete for the scoped browser-owned PubParts ZIP staged importer: Catalog source options now say `Stage Selected to Import Review`, use `Staging to Import Review...` while busy, and report that selected PubParts source files are staging to Import review. The Catalog-owned handoff remains `openStagedImportDraft({})` plus `appendStagedImportDraftFiles(files)`, focused Catalog surface coverage passed, targeted BrowserPanel staged Import review/preview coverage passed, targeted useAppStore staged-import attribution/commit coverage passed, and production build had already passed. The broader full-suite BrowserPanel staged Import structure/status failures and useAppStore graph/project-output failures are recorded as existing non-Catalog owner issues rather than blockers for `G2-83`, `Catalog-Gen2-CLG-32`, or `Catalog-Gen2-HLG-17`.

Dispatch next:
- none for `Catalog-Gen2-13`; broader BrowserPanel staged Import structure/status failures belong to the Import/BrowserPanel owner, and broader useAppStore graph/project-output failures belong to the project/store graph-output owner.

### Family Phase Doc

- [x] created and closed for [Future/Catalog-Gen2-13 - PubParts ZIP Staged Importer And Preview Handoff.md](./Future/Catalog-Gen2-13%20-%20PubParts%20ZIP%20Staged%20Importer%20And%20Preview%20Handoff.md); Phases 1, 2, 3, and 4 are complete for the scoped Catalog ZIP staged importer, with broader non-Catalog audit failures recorded for their owning lanes

## [x] `Catalog-Gen2-14` - `Imported Reference Ownership And Viewport Rehydration`

### Family Phase Summary

Repair the post-Import ownership gap discovered in Bug 22: accepted imported references can render at first, then disappear when the model viewport remounts after closing Catalog or splitting the workspace.

This follow-up keeps Catalog out of long-term project ownership. The accepted imported reference remains canonical in the store-owned `referenceWorkspace`, Import remains the acceptance gate, and each mounted model `Viewer` remains a disposable runtime that must be rehydrated from canonical reference truth when needed.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-10`, `Catalog-Gen2-HLG-17`, `Catalog-Gen2-HLG-18`
- CLG: `Catalog-Gen2-CLG-15`, `Catalog-Gen2-CLG-32`, `Catalog-Gen2-CLG-33`, `Catalog-Gen2-CLG-34`

### Owns

- the accepted imported-reference ownership contract after Catalog hands selected PubParts files to Import review
- proving that `referenceWorkspace` is canonical imported-reference truth
- proving that `Viewer.referenceObjects` is only per-viewer runtime cache
- reload/rehydration behavior when a visible imported reference is globally loaded but missing from the current viewer instance
- regression tests for Catalog-close and model-viewport-split disappearance paths where practical
- Bug 22 closeout once focused tests and build pass

### Does Not Own

- changing PubParts ZIP staged importer UI or source-options behavior
- changing source download, ZIP extraction, or staged Import review selection behavior
- making Catalog create accepted project assets directly
- replacing the import system or changing accepted reference identity semantics
- STEP units, tessellation, heavy-file progress, parse reuse, or loader fidelity
- broader BrowserPanel staged Import structure/status failures or unrelated graph/project-output suite failures

### Planning Read

Bug 22 shows a runtime truth split:

1. Import creates canonical imported-reference records in `referenceWorkspace`.
2. `ViewerHost` loads visible unloaded references into the current `Viewer`.
3. The store marks the reference `loaded`.
4. A workspace split/close/remount disposes the old `Viewer`, clearing its in-memory `referenceObjects`.
5. The new `ViewerHost` sees global state still says `loaded`, so it skips `ensureReferenceLoaded`.
6. `setReferenceVisible(referenceId, true)` becomes a no-op because the new `Viewer` has no object for that id.

The smallest owner-safe repair is not to make `Viewer` canonical. The repair should let `ViewerHost` ask the current viewer whether that exact viewer instance has the reference before it trusts the global `loaded` flag.

Recommended implementation slices:

1. `Phase 1 - Runtime Ownership Contract And Viewer Possession Query`
2. `Phase 2 - ViewerHost Rehydration For Loaded-But-Missing References`
3. `Phase 3 - Split And Close Regression Coverage`
4. `Phase 4 - Bug 22 Closeout And Gen2 Ownership Audit`

### Closeout Read

`Catalog-Gen2-14` is complete. Phases 1-4 shipped the explicit store/viewer ownership contract, current-viewer possession query, ordinary ViewerHost loaded-but-missing rehydration, focused PubParts ZIP-attributed and normal `.obj` remount proofs, and Bug 22 closeout documentation.

Focused verification passed:
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a visible loaded reference missing from the mounted viewer runtime"`
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not rehydrate a visible loaded reference already present in the mounted viewer runtime"`
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a PubParts ZIP accepted import after ViewerHost remount with an empty runtime cache"`
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a loaded obj import in a newly mounted secondary model viewer"`
- `npm.cmd run build`

Full UI click-through for Catalog close/model viewport split and direct split/import-explosion runtime-possession hardening are not claimed by this closeout and remain optional future QA/hardening surfaces.

Status:
- Phases 1, 2, 2.1, 3, and 3.1 are complete for the scoped Internal Library plus optional Local Library mirror lane.
- Persistent cross-session File System Access handles remain intentionally unclaimed; reconnect-needed status is truthful after reload.

### Family Phase Doc

- [x] created and closed for [Future/Catalog-Gen2-14 - Imported Reference Ownership And Viewport Rehydration.md](./Future/Catalog-Gen2-14%20-%20Imported%20Reference%20Ownership%20And%20Viewport%20Rehydration.md); Phases 1, 2, 3, and 4 are complete for the scoped imported-reference ownership and ViewerHost rehydration fix

## [x] `Catalog-Gen2-15` - `OPFS Internal Library And Local Folder Mirror`

### Family Phase Summary

Make the PubParts `Add To Project` path feel like an app-managed parts library after the browser-honest ZIP/import flow.

The default storage owner should be an OPFS-backed ParaHook Internal Library. After explicit user action, ParaHook can cache source bytes, ZIPs, extracted candidates, source manifests, and inspection results inside browser-private origin storage. This gives Catalog fast repeat source-options reads without forcing the user to choose a folder for every part.

The optional storage owner is a user-selected Local Library folder mirror. When permission exists for the current session, ParaHook can mirror app-owned PubParts source/extracted/importable files into a normal filesystem folder so the user can inspect, back up, and share those files outside the app.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-19`
- CLG: `Catalog-Gen2-CLG-35`, `Catalog-Gen2-CLG-36`

### Owns

- OPFS capability detection and unavailable-state copy
- ParaHook Internal Library folder convention for PubParts source files
- explicit user-action-only source-byte caching
- cached ZIP/source manifest and extracted candidate persistence
- source update invalidation by PubParts item id, source URL, and freshness fields such as `dropboxZipLastUpdated`
- optional File System Access API directory picker for a visible Local Library folder mirror
- permission-needed, reconnect, enabled, disabled, and unavailable states for the mirror
- source-options status copy that distinguishes Internal Library cache, Local Library mirror, and Import review

### Does Not Own

- bypassing Dropbox/CORS restrictions
- silent local-drive writes without user folder permission
- eager downloading every PubParts ZIP/archive
- Dropbox shared-folder listing without real source data or API/helper support
- replacing Import review or making Catalog own accepted project assets
- STEP loader fidelity, `.stp` support, builder behavior, or compatibility verdicts

### Planning Read

OPFS solves the app-owned cache/library problem, not the remote-source access problem. It gives ParaHook a reliable place to store and reuse source bytes after the bytes are obtained by browser fetch, user-selected local ZIP, helper/API materialization, or a later native downloader.

The intended user flow is:

```text
Add To Project
→ Source Options opens
→ ParaHook fetches or accepts the PubParts source
→ source bytes save into Internal Library
→ ZIP/model source is inspected or extracted when possible
→ supported and unsupported candidates appear
→ user stages selected supported files into Import review
→ optional Local Library mirror writes visible files when configured
```

The phase order should keep the default Internal Library useful even before a visible local folder exists. Folder mirroring is valuable, but it should not block the main Catalog `Add To Project` flow because browsers may require permission reconnects after refresh or restart.

Dispatch next:
- `Catalog-Gen2-15 / Phase 1 - OPFS Capability And Internal Library Boundary`

### Family Phase Doc

- [x] created and closed [Future/Catalog-Gen2-15 - OPFS Internal Library And Local Folder Mirror.md](./Future/Catalog-Gen2-15%20-%20OPFS%20Internal%20Library%20And%20Local%20Folder%20Mirror.md); Phases 1, 2, 2.1, 3, and 3.1 are complete for the scoped Internal Library plus optional Local Library mirror lane

## [x] `Catalog-Gen2-16` - `Uploaded ZIP Entry 3D Preview`

### Family Phase Summary

Make the PubParts staged importer preview affordance real after the browser-honest ZIP upload path and OPFS Internal Library cache/reopen loop.

The first user-visible preview should live in the source-options dialog, not the item page. Image/source metadata remains the default Catalog and item-page read. When the source-options dialog has a current uploaded archive blob or a same-source-version OPFS archive cache hit, the user can explicitly preview one supported ZIP entry as `3D` before staging any file into Import review.

The preview path should reuse `CatalogCardPreviewViewport` and the existing reference asset loader where possible. It should not create a second Three.js viewer unless the existing preview viewport cannot support a source-options surface after a small prop/surface widening.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-21`
- CLG: `Catalog-Gen2-CLG-38`, `Catalog-Gen2-CLG-39`

### Owns

- source-options preview candidate contract for uploaded or OPFS-cached PubParts ZIP entries
- explicit row-level or selected-entry `3D` preview action/toggle for one supported entry at a time
- preview materialization from the current dialog `archiveBlob` or same-source-version Internal Library archive bytes
- reuse of the existing Catalog preview viewport/reference asset loader when it can support `step`, `stl`, `obj`, and `glb`
- preview loading, unavailable, unsupported, stale/no-byte, and error states in source options
- object URL creation and revocation for preview-only extracted entry blobs
- tests proving preview does not stage Import review, commit project assets, mutate builder state, or fetch blocked Dropbox bytes silently

### Does Not Own

- source-options default image/source metadata replacement
- item-page preview as the first surface
- multiple simultaneous ZIP entry previews
- auto-staging files into Import review
- accepted project asset creation
- builder/load-as-starting-configuration behavior
- compatibility verdicts
- ZIP/source resolver rewrites
- OPFS byte caching behavior beyond consuming already-available archive bytes
- silent Dropbox fetch/proxy/helper behavior
- STEP loader fidelity or `.stp` support expansion beyond existing renderable preview/import constraints

### Planning Read

`CatalogSurface` already owns the source-options dialog state, including staged candidates, selected candidate ids, status copy, and the Phase 2 OPFS archive cache reopen path. A cache hit hydrates `archiveBlob`, so uploaded ZIPs and Internal Library archive hits can share the same preview byte input.

`CatalogShellSourceOptionsDialog.tsx` already renders one row per staged ZIP entry with support, selection, and preview-state text. This is the smallest honest UI seam for a preview action because it is where the user can see the exact archive entry before staging.

`CatalogCardPreviewViewport.tsx` already loads `step`, `stl`, `obj`, and `glb` object URLs through `loadReferenceAssetObject` and cleans up Three.js resources. It does not own object URL revocation, so the source-options caller must own preview object URL lifecycle.

`CatalogShellItemPage.tsx` should stay out of the first phase. Item-page preview is tied to the Catalog item/default preview session, while uploaded ZIP entry preview is a per-dialog, per-archive-entry decision after a user byte grant.

Dispatch next:
- complete; no next Gen2-16 dispatch is required unless Manager wants a separate item-page preview, multi-preview, or full UI click-through follow-up.

### Family Phase Doc

- [x] created [Future/Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview.md](./Future/Catalog-Gen2-16%20-%20Uploaded%20ZIP%20Entry%203D%20Preview.md)

## [x] `Catalog-Gen2-17` - `Direct Source Byte Materialization And Library Metadata Index`

### Family Phase Summary

Make the PubParts `Add To Project` path attempt the smoothest honest byte path before asking the user to manually download and upload a ZIP.

The first read is browser-owned: after explicit user action, ParaHook may try to fetch the current PubParts/Dropbox ZIP source into memory. If that works, the archive should be written into OPFS/Internal Library, inspected through the existing ZIP/source-options flow, previewed when supported, and staged into Import review only after user choice.

The second read is provider-owned: when browser fetch is blocked by CORS, Dropbox rules, or missing API permission, ParaHook should have a clear trusted provider boundary for a PubParts proxy, helper, native bridge, or later API materializer. That provider may deliver bytes to the browser/app, but browser code must not contain Dropbox secrets or scrape blocked Dropbox pages.

The third read is storage-owned: OPFS/Internal Library and optional Local Library mirror remain the owners for big ZIP/model blobs. SQLite/IndexedDB-style storage may index source metadata, archive manifests, source versions, preview/importable status, and mirror state, but it should not become the hidden primary model-blob owner without a later measured storage decision.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-22`
- CLG: `Catalog-Gen2-CLG-40`, `Catalog-Gen2-CLG-41`, `Catalog-Gen2-CLG-42`

### Owns

- direct in-memory PubParts source-byte materialization attempt after explicit user action
- readable, blocked-by-cors, requires-upload, requires-provider, and materialized status states
- OPFS/Internal Library archive write after successful materialization
- reuse of existing ZIP listing, ZIP entry preview, source-options candidate choice, and Import review staging paths
- trusted PubParts proxy/helper/native/API byte-provider boundary
- source-library metadata index plan for item identity, source URL, source version, archive manifest, preview/importable status, Internal Library state, and Local Library mirror status

### Does Not Own

- eager downloading every PubParts archive on Catalog load
- bypassing CORS, Dropbox rules, or browser source restrictions
- putting Dropbox secrets or API tokens in browser code
- scraping blocked Dropbox pages to infer bytes or folder contents
- replacing the Upload ZIP fallback
- storing large ZIP/model binaries in `localStorage`
- making SQLite the unreviewed primary owner of model/archive blobs
- changing Import review acceptance or project asset ownership
- STEP loader fidelity, builder load behavior, or compatibility verdicts

### Planning Read

This phase is not a contradiction of `Catalog-Gen2-13`, `Catalog-Gen2-15`, or `Catalog-Gen2-16`. Those phases made the browser-honest upload/cache/preview path work. This phase adds a smoother first attempt before the upload fallback: if the bytes are readable or a trusted provider can legally deliver them, ParaHook should not force the user through manual download/upload.

The user-facing flow should read:

```text
Add To Project
-> Source Options opens
-> Try Direct Source Fetch for this item
-> if readable: save archive to Internal Library, inspect ZIP, preview/select supported entries
-> if blocked: show why and keep Open Source + Upload ZIP fallback
-> if provider available: request bytes through trusted provider boundary
-> selected supported entries still stage into Import review
```

Dispatch next:
- none for `Catalog-Gen2-17`; persistent metadata storage, real provider/native/API deployment, richer metadata-index UI, live end-to-end provider proof, Import/project, STEP, builder, compatibility, eager scan, and bulk archive import belong to future owner phases if Manager wants them.

### Family Phase Doc

- [x] created and closed for [Future/Catalog-Gen2-17 - Direct Source Byte Materialization And Library Metadata Index.md](./Future/Catalog-Gen2-17%20-%20Direct%20Source%20Byte%20Materialization%20And%20Library%20Metadata%20Index.md); Phases 1, 2, 3, 4, and 5 are complete for the scoped direct source-byte materialization, trusted provider boundary, OPFS/Internal Library ownership, metadata-only index, Upload ZIP fallback, and final audit lane

## [x] `Catalog-Gen2-18` - `PubParts Live Source Sync And Normalized Projection`

### Family Phase Summary

Make PubParts structured metadata the live upstream source for external PubParts Catalog entries.

The practical wishlist read is that if Zinc adds a part to PubParts, the user should be able to refresh or reopen ParaHook and see that part without waiting for a developer to regenerate `pubpartsSourceData/fullParts.ts`.

The implementation must keep the distinction between metadata and bytes. Reading `https://pubparts.xyz/parts.json` can update cards, source links, preview images, type labels, platform labels, source freshness, and archive links. It must not automatically download Dropbox ZIPs, extract archives, stage Import review files, or create project assets.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-23`
- CLG: `Catalog-Gen2-CLG-43`, `Catalog-Gen2-CLG-44`, `Catalog-Gen2-CLG-45`

### Owns

- runtime read of live PubParts part metadata
- generated/baked cache fallback when the live endpoint is unavailable
- reuse of the existing PubParts source normalizer and Catalog external projection
- proof that an upstream-only part can appear in Catalog after live refresh
- audit that ParaHook-owned filters/platform/system/type/group mapping still owns the runtime taxonomy
- audit that source-update churn does not silently delete user-granted local/library/import state

### Does Not Own

- eager PubParts archive downloads
- Dropbox ZIP byte CORS fixes
- trusted provider/proxy/native byte deployment
- replacing Upload ZIP or source-options staging
- turning PubParts browse categories into ParaHook filter truth
- deleting Internal Library, staged-source, local mirror, or accepted project state because upstream metadata changes
- compatibility, builder, STEP loader, or project acceptance behavior

### Planning Read

`scripts/catalog/refreshPubPartsCache.mjs` is still useful as a developer refresh and fallback generation tool, but it should not be the only way a newly added PubParts record reaches a user's running app.

`src/app/catalog/pubPartsSource.ts` already owns raw PubParts field normalization. `src/app/catalog/catalogSource.ts` already owns the ParaHook projection from normalized PubParts source records into Catalog items and filters. Phase 1 should feed live records into those existing owners instead of creating a new live-only mapper inside `CatalogSurface`.

Dispatch next:
- none for `Catalog-Gen2-18`; production hosting still needs either a same-origin metadata proxy equivalent or PubParts CORS headers, and resource endpoint widening can be planned later if Manager wants live `resources.json`.

`Catalog-Gen2-18` is complete for the wishlist lane: live PubParts part metadata reads now have a pure source owner with direct PubParts plus same-origin Vite dev proxy request fallback, Catalog renders from baked cache immediately, successful live reads replace only the PubParts part lane, failed live reads keep baked parts/resources visible, ParaHook-owned taxonomy projection remains in Catalog source code, external PubParts item identity is source-key stable across additions/reorderings/renames, focused source/live/source-options tests passed, and ZIP/source-options/Import/project/builder/compatibility behavior stayed unchanged.

### Family Phase Doc

- [x] created and closed [Future/Catalog-Gen2-18 - PubParts Live Source Sync And Normalized Projection.md](./Future/Catalog-Gen2-18%20-%20PubParts%20Live%20Source%20Sync%20And%20Normalized%20Projection.md)

## [x] `Catalog-Gen2-19` - `Catalog Info Page And Rail Utility Cleanup`

### Family Phase Summary

Move Catalog source utility/status reads out of the left browse rail and into one content page.

The user first considered two title-bar buttons, one for Local Downloads and one for Staged Sources, then narrowed the preferred UX to one `Catalog Info` button. This keeps the title bar compact and makes the left rail read as browse navigation rather than mixed navigation plus source lifecycle status.

### HLG / CLG Coverage

- HLG: `Catalog-Gen2-HLG-24`
- CLG: `Catalog-Gen2-CLG-46`

### Owns

- one top-right `Catalog Info` content-header action
- a combined content page for Staged Sources and Local Downloads
- removing those utility sections from the left browse rail
- preserving staged-source clear controls and local-library mirror status reads

### Does Not Own

- PubParts source staging behavior
- Local Library mirror writes or folder grants
- source-options, ZIP inspection, Import review, or project acceptance behavior
- preview, builder, or compatibility behavior

### Planning Read

The source utility blocks already existed as Catalog UI reads. The cleanup is not a new storage or source lifecycle owner; it is a placement correction so the browse rail stays focused on navigation while the source utility read gets enough content space.

Dispatch next:
- none for `Catalog-Gen2-19`; add a follow-up only if the Catalog Info page later needs richer metadata-index controls or a broader source-library dashboard.

`Catalog-Gen2-19` is complete for this UI cleanup: the top-right `Catalog Info` action opens a combined content page, Staged Sources and Local Downloads no longer render in the left browse rail, Preview Session remains in the rail, existing staged-source clear/local-library mirror reads are preserved, focused CatalogShell tests passed, and production build verification passed.

### Family Phase Doc

- [x] created and closed [Future/Catalog-Gen2-19 - Catalog Info Page And Rail Utility Cleanup.md](./Future/Catalog-Gen2-19%20-%20Catalog%20Info%20Page%20And%20Rail%20Utility%20Cleanup.md)

# [~] `Catalog-1` - `Workspace Foundation And Catalog Contract`

## Doc Header

### Doc History
54. 2026-04-19 13:46:22: Added the Gen1 CLG coverage checklist into this `Catalog-1` Family Phase Doc so the local phase doc now mirrors the Generation Index read where Catalog-1 HLG are covered but CLG 1, 2, 3, and 5 remain open or broader than the shipped foundation, making any needed follow-up phases visible before the family is marked complete.
53. 2026-04-19 13:39:26: Updated this `Catalog-1` Family Phase Doc format against the current Architecture Setup guide rails, adding the missing top-level `Vision` section, making the top status partial because `Phase 4.1` and `Catalog-1.12` remain open, normalizing implementation-phase fold labels to `Catalog-1 / Phase N`, correcting stale wishlist checkboxes so shipped implementation-phase coverage no longer reads as open, and wrapping the `Catalog-1.12` plus `Catalog-1.13` follow-up branches in the same `Summary` and `Implementation Spec` two-section pattern as the older implementation phases.
52. 2026-04-19 09:21:18: Implemented `Catalog-1.13 - Load All Displayed Preview-Capable Cards`, adding the displayed-grid batch preview action that routes through the existing temporary preview-session owner, skips hidden filtered-out cards and apply-environment entries, and closes the remaining Catalog-1 displayed-preview batch checklist with focused CatalogShell and preview-session proof plus `npm run build`
51. 2026-04-18 22:11:00: Added `Catalog-1.13 - Load All Displayed Preview-Capable Cards` as a new foundation follow-up branch so the Catalog grid can expose one explicit batch preview action for every currently visible preview-capable card without committing project content, applying environment state, or touching hidden filtered-out cards
50. 2026-04-17 23:35:35: Implemented `Catalog-1 / Phase 11.3 - Environment Apply Ownership Proof`, adding one narrow `catalogEnvironmentApply.ts` handoff seam, wiring repo-backed environment items through `CatalogSurface.tsx` into the existing shared `useUiPrefsStore.ts` viewer environment owner, adding one first fixture-backed `Studio Environment` Catalog entry, and proving that `Apply Environment` updates viewer-owned environment state without creating imported references, project geometry content, or temporary preview-session ownership
49. 2026-04-17 23:29:43: Prepped `Catalog-1 / Phase 11.3 - Environment Apply Ownership Proof` for implementation, grounding the next cut in the shipped `catalogActionPlan.ts` `viewer-environment` direction, the current `CatalogSurface.tsx` gap where only Browser-project commit handoff exists, and the nearby `useUiPrefsStore.ts` plus `ViewToolbar.tsx` environment-state owner so the phase now lands as one narrow Catalog-to-viewer environment handoff proof instead of a vague future `HDRI` placeholder
48. 2026-04-17 23:26:08: Implemented `Catalog-1 / Phase 11.2 - Preview Session And Imports Boundary Proof`, adding focused proof that the temporary Catalog preview session stays separate from downstream committed reference truth even after `Phase 11.1`, that imports reuse remains browse-only and never gains a fake second commit path, and that Catalog still does not become the import-pipeline owner just because it can now show committed references back through the reuse surface
47. 2026-04-17 23:18:18: Re-prepped `Catalog-1 / Phase 11.2 - Preview Session And Imports Boundary Proof` for implementation, grounding the next cut in the now-shipped `Phase 11.1` Browser-project commit handoff, the still-local `catalogPreviewSession.ts` temporary loaded-item owner, the `catalogSource.ts` imports reuse seam, and the existing Catalog surface proof so the next phase stays one narrow "not the owner" boundary pass instead of reopening commit routing or widening into new import or preview features
46. 2026-04-17 23:18:18: Implemented `Catalog-1 / Phase 11.1 - Reference Commit Handoff Proof`, turning repo-backed `Add To Project` into a real Catalog-to-Browser handoff by landing one narrow `catalogReferenceCommit.ts` seam, routing the item-page action through the existing `addImportedReference(...)` downstream owner, and adding focused commit-contract plus Catalog surface proof so committed reference results enter Browser or project-owned truth without touching the temporary Catalog preview session
45. 2026-04-17 23:04:06: Re-prepped `Catalog-1 / Phase 11.1 - Reference Commit Handoff Proof` for implementation, grounding the next cut in the shipped `catalogActionPlan.ts` `browser-project` downstream-owner seam, the current `CatalogSurface.tsx` read that still only builds imports and preview-session state, the nearby `useAppStore.ts` `projectContent` plus `referenceWorkspace` owners, and the still-missing downstream commit proof in `CatalogSurface.test.tsx` so the first ownership follow-on stays one narrow reference handoff slice without widening into preview-session, imports, or environment apply
44. 2026-04-17 22:53:27: Split the old broad `Catalog-1 / Phase 11 - Downstream Ownership Proof` into three smaller follow-on phases so the remaining ownership work is Codex-sized: `Phase 11.1` for reference commit handoff, `Phase 11.2` for preview-session and imports-boundary proof, and `Phase 11.3` for environment apply ownership, all grounded in the shipped `catalogActionPlan.ts` downstream-owner seam and the nearby `referenceWorkspace` runtime owner
43. 2026-04-17 22:53:27: Implemented `Catalog-1 / Phase 10.2 - Card Selection And Open Gesture Cleanup`, moving local multi-card selection onto direct card clicks, adding double-click-to-open item-page behavior, and retiring the `Add To Selection` card button while keeping preview-box interaction separate and preserving the shipped local preview-session behavior
42. 2026-04-17 22:43:33: Re-prepped `Catalog-1 / Phase 10.2 - Card Selection And Open Gesture Cleanup` for implementation, grounding the next cut in the live post-`Phase 10.1` shell where `CatalogShell.tsx` already owns the local selected-item set, `CatalogShellGridMode.tsx` still uses one-card click selection plus the `Add To Selection` and `Open Item Page` buttons, and `CatalogSurface.test.tsx` still proves the older button-based interaction path so the cleanup can land as one local card-gesture pass without reopening preview-session or action-routing scope
41. 2026-04-17 22:43:33: Added `Catalog-1 / Phase 10.2 - Card Selection And Open Gesture Cleanup` as the next narrow follow-up after shipped `Phase 10.1`, locking that grid cards should support direct multi-select interaction, double-click-to-open item-page behavior, and retirement of the now-redundant `Add To Selection` button so the Catalog card interaction model gets simpler without reopening preview-session or action-routing scope
40. 2026-04-17 22:41:00: Implemented `Catalog-1 / Phase 10.1 - Preview Session Rail Placement And Weight Reduction`, moving the shipped preview-loaded panel out of the main Catalog content area and into a lighter bottom-left slot inside the browse rail so preview-session management stays available without competing with the primary grid and item-page browse surfaces
39. 2026-04-17 22:38:12: Added `Catalog-1 / Phase 10.1 - Preview Session Rail Placement And Weight Reduction` as the next narrow follow-up after shipped `Phase 10`, locking that the preview-loaded panel should move out of the main content area and into one lighter bottom-left Catalog slot under the browse rail so preview-session management stays available without making the grid or item-page read heavier than the store-style browse surface wants
38. 2026-04-17 22:35:40: Implemented `Catalog-1 / Phase 10 - Preview And Loader Boundary By Asset Type`, adding one Catalog-owned per-`surfaceInstanceId` preview-session seam plus one Catalog-owned action-routing seam, widening the shell to support empty in-card preview boxes, local multi-card preview loading, an in-content preview-loaded list with unload controls, and retained-surface restore proof while keeping preview temporary and distinct from later commit or environment apply runtime
37. 2026-04-17 22:23:28: Re-prepped `Catalog-1 / Phase 10 - Preview And Loader Boundary By Asset Type` against the live post-`Phase 9` shell, grounding the implementation cut more tightly in `CatalogSurface.tsx` plus `surfaceInstanceId`, the current `CatalogShell.tsx` coordinator, the grid and item-page UI split, and the nearby `referenceWorkspace` runtime seam so the next pass stays one Catalog-sized preview-session and action-routing slice instead of drifting into a broader app-store, global-selection, or reference-family runtime rewrite
36. 2026-04-17 22:12:06: Folded the newer Catalog preview-session direction into the `Catalog-1` foundation plan so the future ladder now treats empty card preview boxes, explicit in-card and multi-card preview loading, a Catalog-owned preview-loaded item list with restore-on-reopen during the running session, and unload controls as part of the upcoming `Phase 10` preview boundary instead of leaving the family with the older preview-viewport-only read
35. 2026-04-17 21:58:42: Prepped `Catalog-1 / Phase 10 - Preview And Loader Boundary By Asset Type` for implementation, grounding the next cut in the shipped `catalogItemContract.ts` action-kind seam, the current source snapshot where repo-backed entries already read as `add-to-project` while imports entries read as `load-preview`, and the live `CatalogShellItemPage.tsx` action area that still derives its button behavior inline without any dedicated action-routing or adapter boundary yet
34. 2026-04-17 21:52:38: Implemented `Catalog-1 / Phase 9 - Shell File Boundaries And Placeholder Wiring`, splitting the shipped `src/app/catalog/ui/CatalogShell.tsx` owner into focused browse-rail, grid-mode, item-page, and shared-helper files under `src/app/catalog/ui/` while keeping `src/app/workspace/CatalogSurface.tsx` as the thin workspace host and preserving the existing source-backed shell behavior through the workspace proof seam
33. 2026-04-17 21:44:07: Prepped `Catalog-1 / Phase 9 - Shell File Boundaries And Placeholder Wiring` for implementation, replacing the older placeholder-era wording with the real next cleanup read that `CatalogSurface.tsx` is already a thin host while `src/app/catalog/ui/CatalogShell.tsx` now carries the browse rail, grid mode, item-page mode, selection state, and imports-through-browse flow in one file, so the next cut should split those responsibilities into focused UI owners without reopening the shipped shell behavior
32. 2026-04-17 21:36:04: Implemented `Catalog-1 / Phase 8.2 - Card Density And Overlap Cleanup`, tightening the shared Catalog grid-card presentation with smaller card typography, calmer internal spacing, wider grid minimums, and stronger box containment so the live cards stop visually colliding under real copy while preserving the shipped `Phase 8.1` browse-plus-content behavior
31. 2026-04-17 21:32:40: Added `Catalog-1 / Phase 8.2 - Card Density And Overlap Cleanup` as the next narrow post-Phase-8 shell polish pass, recording the live layout issue that the current Catalog cards are visually colliding under real text load so the next cut should tighten card typography, vertical rhythm, and grid sizing until cards stop overlapping without reopening preview, source, or loader scope
30. 2026-04-17 21:29:26: Implemented `Catalog-1 / Phase 8.1 - Imports As Browse Section`, reworking the shipped shell into a real 2-column browse-plus-content layout where `Imports` now lives inside the browse section list, the shared content area swaps between grid mode and one full item-page mode with a `Back To Catalog` path, and the old separate imports panel plus third-column detail read are both removed without widening into preview runtime or loader behavior
29. 2026-04-17 21:24:06: Expanded `Catalog-1 / Phase 8.1 - Imports As Browse Section` from a placeholder into an implementation-ready cleanup phase, recording the post-Phase-8 layout read that `Catalog` should collapse to a 2-column browse-plus-content shell, move `Imports` into the browse section list, and let the content area swap between the card grid and one full store-style item page instead of keeping the item page as a third competing column
28. 2026-04-17 21:19:17: Added a lightweight `Catalog-1 / Phase 8.1` placeholder plus one new wishlist item clarifying that `Imports` should read as a browse-area section instead of a separate peer panel, so the visible post-Phase-8 layout cleanup direction is recorded without prematurely locking the full implementation spec
27. 2026-04-17 21:14:24: Implemented `Catalog-1 / Phase 8 - First Catalog Shell Regions`, replacing the old placeholder `workspace/CatalogSurface.tsx` body with the first source-backed Catalog shell over the shipped `catalogSource.ts` and `catalogItemContract.ts` seams, extracting one initial `src/app/catalog/ui/CatalogShell.tsx` owner with explicit filters, grid, item-page, actions, and imports regions, locking the no-auto-preview read in visible UI copy, and adding focused `CatalogSurface.test.tsx` plus registry proof so the first browse-first shell is live without widening into preview runtime or real loader behavior
26. 2026-04-17 21:06:07: Prepped `Catalog-1 / Phase 8 - First Catalog Shell Regions` for implementation, grounding the next cut in the still-placeholder `workspace/CatalogSurface.tsx` render owner plus the newly-shipped `src/app/catalog/catalogSource.ts` and `catalogItemContract.ts` seams so the first visible Catalog UI lands as one browse-first shell over explicit source data with extracted regions for categories, grid, item detail, actions, and imports instead of collapsing back into one improvised placeholder component
25. 2026-04-17 21:04:44: Implemented `Catalog-1 / Phase 7 - Manifest Source Seam`, adding the first Catalog-owned curated-source lane with authored repo-backed seed data in `src/app/catalog/catalogSeedItems.ts`, one shared `catalogSource.ts` seam that emits `CatalogItemRecord` for both repo-backed and imports-area reuse entries, and focused `catalogSource.test.ts` proof so later shell work can consume Catalog data without reviving raw arrays, folder walking, or the old Browser-era reference manifest owner
24. 2026-04-17 21:01:34: Prepped `Catalog-1 / Phase 7 - Manifest Source Seam` for implementation, grounding the next cut in the newly-shipped `src/app/catalog/catalogItemContract.ts` seam, the still-Browser-era `references/referenceManifest.ts` precedent, and the current lack of any Catalog-owned authored source module so the phase now lands as one narrow `src/app/catalog/` curated-source owner plus lightweight proof instead of drifting into shell UI, imports runtime, or old manifest migration
23. 2026-04-17 20:57:10: Implemented `Catalog-1 / Phase 6 - Catalog Item Contract`, adding the first Catalog-owned `src/app/catalog/catalogItemContract.ts` seam with explicit asset-kind, action-kind, source-kind, preview-media, and imports-versus-repo source typing plus focused `catalogItemContract.test.ts` proof so later Catalog shell and manifest phases can target one stable item shape without widening into runtime manifest migration yet
22. 2026-04-17 20:47:46: Prepped `Catalog-1 / Phase 6 - Catalog Item Contract` for implementation, grounding the next cut in the still-placeholder `CatalogSurface.tsx`, the absence of any dedicated `src/app/catalog/` contract seam, and the older `references/referenceManifest.ts` item shape that still feeds Browser-side reference behavior so the new contract can land as one Catalog-owned type module without widening into manifest runtime or shell UI yet
21. 2026-04-17 20:45:12: Implemented `Catalog-1 / Phase 5 - Persistence And Popup Decision`, proving saved slotted plus detached `catalog` restore and declined fresh-start overwrite through a focused `useWorkspacePersistenceBridge.test.tsx` harness, narrowing `catalog` metadata to `popout: false`, and adding shared `WorkspaceViewportTree.test.tsx` proof that slotted Catalog panes no longer expose unsupported popout chrome
20. 2026-04-17 20:30:08: Re-prepped `Catalog-1 / Phase 5 - Persistence And Popup Decision` after the shipped `Phase 4.2` titlebar-float fix, tightening the next cut around the real `useWorkspacePersistenceBridge.ts` restore-confirmation seam, the existing `AppShell.test.tsx` startup-restore proof owner, and the explicit `PopupWorkspaceShell.tsx` available-surface exclusion list so the phase starts restore-first and then resolves the still-open Catalog popout truth honestly
19. 2026-04-17 20:26:24: Implemented `Catalog-1 / Phase 4.2 - Slotted Titlebar Float Menu Parity`, fixing the real Catalog titlebar `Float` repro by giving the shared `SimpleFloatingSurfaceHost.tsx` the same visible floating stacking priority as the working Dashboard path and adding focused `AppShell.test.tsx` proof for the full split-to-Catalog-to-titlebar-Float-to-quick-dock user flow
18. 2026-04-17 20:09:32: Added `Catalog-1 / Phase 4.2 - Slotted Titlebar Float Menu Parity` as a second floating follow-up after a live repro showed that right-clicking a slotted `Catalog` titlebar and choosing `Float` still does not surface a floating window, grounding the next cut in the shared `ViewportFrame.tsx` action-menu dispatch path, the `WorkspaceViewportTree.tsx` slot wiring, and the `useAppShellViewportActions.ts` `handleViewportSlotFloat(...)` seam while keeping the drag-out handoff work isolated in `Phase 4.1`
17. 2026-04-17 20:07:37: Added `Catalog-1 / Phase 4.1 - Slotted Header Drag-Out Floating Handoff Parity` as a follow-up to the shipped floating-host baseline after a live repro showed the first slotted `Catalog` titlebar drag-out still falls through to generic default float placement instead of honoring the drag handoff, grounding the next cut in the shared `ViewportFrame.tsx` to `WorkspaceViewportTree.tsx` to `useAppShellViewportActions.ts` seam while keeping broader floating-shell cleanup with `FWS` and later popout decisions separate
16. 2026-04-17 19:59:26: Prepped `Catalog-1 / Phase 5 - Persistence And Popup Decision` for implementation, grounding the next cut in the live `workspacePersistence.ts` plus `useWorkspacePersistenceBridge.ts` restore seam, the existing `useWorkspaceStore.test.ts` detached-layout round-trip proof, and the current popup inconsistency where `catalog` still claims `popout` support in metadata while the app-shell and popup-shell host seams do not yet expose matching Catalog popout behavior
15. 2026-04-17 19:54:19: Implemented `Catalog-1 / Phase 4 - Float And Redock Host-Mode Parity`, proving `catalog` can detach into floating host mode and quick-dock back through the shared workspace host-mode lifecycle while routing the floating shell through one reusable simple-surface host instead of introducing a `Catalog`-only floating wrapper
14. 2026-04-17 19:40:58: Implemented `Catalog-1 / Phase 3 - Tiled Behavior Regression Proof`, widening the shared workspace-store proof so `catalog` now has explicit switch-away and return coverage, retained-surface reuse proof, and neighboring optional-surface regression coverage without needing any new Catalog-only store or UI exceptions
13. 2026-04-17 19:27:51: Prepped `Catalog-1 / Phase 3 - Tiled Behavior Regression Proof` for implementation, grounding the proof pass in the live `useWorkspaceStore.ts` retained-surface seam, the already-shipped `CatalogSurface` plus non-primary picker onboarding from `Phase 2`, and the existing workspace-store test owners for switch-away or return behavior so the next cut stays a shared tiled-lifecycle proof instead of widening Catalog UI
12. 2026-04-17 19:22:53: Implemented `Catalog-1 / Phase 2 - Tiled Slot Switching And First CatalogSurface`, adding the first minimal `CatalogSurface`, wiring `catalog` through the canonical `ViewportSurfaceRegistry.tsx` render-family path, widening the shared non-primary `ViewportFrame.tsx` viewport-type submenu to include `Catalog`, and checking off the shipped phase plus its focused workspace proof
11. 2026-04-17 19:17:01: Checked off the shipped `Catalog-1 / Phase 1 - Surface Kind And Catalog Registration` work and prepped `Catalog-1 / Phase 2 - Tiled Slot Switching And First CatalogSurface` for implementation, grounding the next cut in the live `ViewportSurfaceRegistry.tsx` render gap, the current `ViewportFrame.tsx` non-primary type-picker omission, and the already-landed `catalog` workspace registration baseline without widening into floating or popup scope
10. 2026-04-17 18:53:15: Prepped `Catalog-1 / Phase 1 - Surface Kind And Catalog Registration` for implementation, grounding the next cut in the live `workspaceShellTypes.ts` and `workspaceSurfaceCatalog.ts` seams, making the current missing `catalog` union, generated-id, render-family, and optional-surface gaps explicit, and tightening the verification read around the existing workspace-store, viewport-frame, and persistence proof surfaces without widening into `Phase 2`
9. 2026-04-17 18:42:41: Reworked this `Catalog-1` future doc to the current `Architecture Setup` plan-doc format, adding `Doc Body`, `Wishlist Organization`, and top-level `[ ]` phase sections with `Summary` plus `Implementation Spec` halves while aligning the foundation scope to the newer `Catalog-Index.md` `Generation 1 Vision`, including the `Imports` baseline, lightweight card-grid read, item-page responsibilities, and preview-versus-commit wishlist tracking
8. 2026-04-15 22:59:27: Tightened `Catalog-1 / Phase 1 - Surface Kind And Catalog Registration` into an implementation-ready slice by grounding it in the live `workspaceShellTypes.ts` and `workspaceSurfaceCatalog.ts` seams, locking the exact first code cut around `catalog` kind registration plus generated-id support, and adding phase-specific file targets, risks, checklist items, verification shape, and done shape
7. 2026-04-15 22:11:59: Reworked the internal `Catalog-1` ladder again into a finer-grained ten-phase sequence so Codex can execute the foundation one narrow step at a time, separating surface-kind registration, tiled switch proof, float parity, persistence or popup decisions, item contract, manifest seam, shell regions, shell wiring, loader boundaries, and downstream ownership proof instead of bundling those seams into broader mixed phases
6. 2026-04-15 22:11:00: Reworked the internal `Catalog-1` ladder into a straight `Phase 1` through `Phase 6` sequence by renumbering the earlier `1A / 1B` onboarding split and breaking the old combined loader-boundary or ownership section into separate `Phase 5` and `Phase 6` sections so the foundation lane now reads as one continuous six-step implementation ladder
5. 2026-04-15 22:06:23: Split the old broad `Catalog-1 / Phase 1` into `Phase 1A - Tiled Workspace Mode Adoption` and `Phase 1B - Windowed Host-Mode Parity And Persistence`, keeping the later internal ladder cleanly numbered as `Phase 2` through `Phase 4` while separating the split-and-switch workspace-mode proof from the floating or persistence follow-through
4. 2026-04-15 22:03:14: Tightened `Catalog-1 / Phase 1` so the workspace-onboarding proof is now explicitly framed as a real workspace-mode adoption: the user should be able to split a `modelViewer` pane, keep the original pane as `modelViewer`, and switch the new non-primary pane to `Catalog` through the shared slot type-picker seam
3. 2026-04-15 21:57:57: Tightened `Catalog-1 / Phase 1` so floating-window support is explicit first-pass scope, locking that `Catalog` must participate in the shared workspace float and redock host-mode seam during the initial workspace-surface onboarding cut instead of leaving that behavior implied
2. 2026-04-15 21:23:37: Reworked this `Catalog-1` doc into four internal top-level `##` phase sections so the foundation lane can execute as smaller Codex-sized steps for workspace onboarding, item-contract lock, first shell definition, and loader-boundary proof instead of remaining one broad setup block
1. 2026-04-15 20:24:35: Added this first standalone `Catalog-1` phase doc to define the foundation cut for a real `Catalog` workspace, locking the initial workspace-surface onboarding, curated manifest contract, visible shell shape, and clean loader-action boundaries before later hook, shoe, footpad, and HDRI families widen the implementation

### Purpose

This phase defines the first honest foundation slice for the `Catalog` workspace in ParaHook.

Use it to answer:
- what must exist before `Catalog` can be a real workspace instead of only an idea
- how the first `Catalog` surface should read in `Generation 1`
- what the first catalog data contract and curated-source seam should look like
- how the first visible workspace shell should handle card-grid browse, imports, and preview-versus-commit boundaries
- how visible-card preview loading can batch only the currently displayed preview-capable cards
- how to keep future catalog implementation clean instead of bloating existing shell or Browser files

### Why This Phase Exists

The broader `Catalog-Vision.md` now acts as the kickoff idea and long-range family north star.

The main `Catalog-Index.md` now carries the more specific `Generation 1 Vision`.

That means this `Catalog-1` doc should no longer try to act like the whole family vision.

Instead, it should define the first real implementation-ready foundation slice under that `Generation 1` umbrella:
- make `Catalog` a real workspace surface
- lock the first curated item-contract seam
- lock the first shell contract for card-grid browse, imports reuse, item-page responsibilities, and preview-versus-commit honesty
- stop before the actual reference-family and `HDRI` onboarding lanes that belong to later `Catalog-2` and `Catalog-3`

### Scope

This phase covers:
- `Catalog` workspace-surface onboarding
- split-pane, float, redock, and persistence truth for the new surface
- the first curated catalog-item contract
- the first manifest or catalog-source seam
- the first card-grid, imports, item-page, and preview-shell contract
- displayed-card preview loading as a Catalog-owned preview-session action
- placeholder shell wiring and clean file boundaries
- the first preview-versus-commit and downstream ownership contract

This phase does not cover:
- the real asset-family onboarding for `foothooks`, `shoes`, and `footpads`
- final `HDRI` family runtime
- curated external-source intake
- the later `Platform` versus `Wheel` widening
- final project recall or rebind semantics for loaded catalog items

## Doc Body

### Goal

Create the first clean foundation for `Catalog` as a real workspace family, with one explicit item-contract seam and one visible workspace shell direction, so later catalog families can ship through new focused files instead of inflating existing Browser, viewer, or shell files with special-case logic.

### Boundaries

This phase should:
- start only after the `Generation 0` cleanup band has removed the old Browser-resident preload baseline
- make `Catalog` a real hosted workspace surface
- lock the baseline `Generation 1` browse contract around a lightweight card grid, item-page decision surface, and imports reuse area
- keep `Load Preview` separate from `Add To Project`
- keep batch preview loading scoped to currently visible preview-capable cards
- keep asset-type loader boundaries honest before later family onboarding begins

This phase should not:
- onboard the full real reference families themselves
- onboard final `HDRI` behavior as if it were the same thing as geometry-reference loading
- pull `Generation 2` widening into the baseline
- become a giant all-in-one catalog implementation without clean seams
- treat hidden filtered-out cards, HDRI apply-only cards, or commit-only actions as part of displayed-card preview loading

### Architecture Direction

The right architectural read for this phase is:
- `Catalog` owns browse and choose
- `Browser`, project truth, and viewer state own the loaded result
- the catalog contract should stay explicit and curated
- the shell should be browse-first and preview-first
- imports may be surfaced for reuse after intake, but the import pipeline itself must stay import-owned

The healthy first-pass product read is:
- the user can split a `modelViewer` pane and switch the new non-primary pane to `Catalog`
- the user sees a lightweight card-grid browse surface with empty preview boxes and no auto-loaded repo-backed previews
- the user can trigger temporary preview loading from a card preview box or shared `Load Preview` action without creating project truth
- the user can preview more than one selected card at a time and keep those temporary previews in a Catalog-owned preview-loaded list during the running session
- the user can reach an item page whose primary responsibilities are larger preview, description, and the honest action for that asset type
- the user can reuse already-known imported items through an `Imports` area without collapsing `Catalog` into the import system
- the user can unload preview-loaded items when performance starts to dip
- `Load Preview` stays temporary, and `Add To Project` stays the explicit commit action

### Current Live Read

Current workspace registration seam:
- `src/app/workspace/workspaceShellTypes.ts`
  - owns `WorkspaceSurfaceKind`
  - owns generated surface-instance ids for slotted surfaces
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - owns canonical surface metadata such as:
    - `scope`
    - split support
    - floating support
    - persistence participation

Current workspace rendering seam:
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - is the likely first render registration owner once `catalog` is a real surface kind
- `src/app/workspace/ViewportFrame.tsx`
  - is the likely non-primary slot type-picker seam

Current likely persistence seam:
- `src/app/workspace/workspacePersistence.ts`
  - is the likely owner for serialize and restore truth once `catalog` participates in persisted workspace layout

Current gap read:
- there is no shipped `Catalog` workspace surface yet
- there is no explicit catalog-item contract yet
- there is no manifest or curated-source seam yet
- there is no shipped `CatalogSurface` contract for card-grid browse, imports, item page, or preview actions yet

### Acceptance Read

This phase is healthy when:
- `Catalog` exists as a real optional workspace surface
- the workspace system can split, switch, float, redock, and persist that surface honestly
- the repo has one explicit catalog-item contract and one explicit catalog-source seam
- the first shell contract clearly includes:
  - lightweight card-grid browse
  - no auto-loaded previews
  - empty card preview boxes instead of preloaded repo-backed previews
  - an `Imports` area for already-known imported items
  - an item-page decision surface
  - temporary preview versus explicit commit separation
- the asset-type loader split is explicit enough that later `Catalog-2` and `Catalog-3` do not have to reopen the same ownership questions

## Vision

`Catalog-1` is the first Generation 1 family phase that turns Catalog from planning direction into a real workspace surface.

The phase should stay foundation-shaped:
- prove Catalog can live inside the shared workspace surface system
- give Catalog one curated item contract and source seam
- create the first browse-first shell with card grid, imports reuse, item page, and preview-session boundaries
- keep preview, commit, import, and environment ownership separate before later Catalog families widen asset coverage

The phase is still partial because two follow-up lanes remain open:
- `Catalog-1 / Phase 4.1` for slotted header drag-out floating handoff parity
- `Catalog-1.12` for direct grid-card `Add To Project`

## Wishlist Organization

### Catalog-1 HLG Checklist

- [x] `Catalog-Gen1-HLG-1. let the user keep the model visible while browsing reusable assets in a real Catalog workspace surface`
- [x] `Catalog-Gen1-HLG-3. let the user browse clear item families such as foothooks, shoes, footpads, HDRIs, imports, and later reusable references or preset families`
- [x] `Catalog-Gen1-HLG-5. let reference-style items preview temporarily before explicit Add To Project`
- [x] `Catalog-Gen1-HLG-10. keep imported user files and curated repo assets distinct even when they appear near each other in the Catalog surface`

### Catalog-1 CLG Checklist

- [ ] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.
- [ ] Catalog-Gen1-CLG-2. Keep repo-backed reusable assets optional and Catalog-selected instead of Browser-resident defaults.
- [ ] Catalog-Gen1-CLG-3. Keep preview, commit, and apply behavior distinct by asset type.
- [ ] Catalog-Gen1-CLG-5. Make repo-backed and already-imported user assets visibly distinct in the Catalog surface.
- [x] Catalog-Gen1-CLG-13. Add a displayed-card batch preview action that only affects visible preview-capable cards.

### Catalog-1 Open Coverage Read

The Gen1 HLG routed to `Catalog-1` are covered, but the family phase stays partial because the Gen1 CLG checklist above still has open items.

Current likely follow-up routing:
- `Catalog-1 / Phase 4.1` should close the remaining workspace-surface parity part of `Catalog-Gen1-CLG-1`.
- `Catalog-1.12` should advance the direct grid-card commit part of `Catalog-Gen1-CLG-3`.
- `Catalog-Gen1-CLG-2` and `Catalog-Gen1-CLG-5` need a manager read before closure because they may already be satisfied by later `Catalog-2`/imports work, but the Gen1 index still treats them as broader than the shipped `Catalog-1` foundation proof.

### `Catalog-1 / Phase 1`

- [x] `1. Catalog Registers As A Real Workspace Surface Kind`
- [x] `2. Catalog Gets Deterministic Surface-Instance Ids`
- [x] `3. Catalog Metadata Lives In The Canonical Workspace Surface Catalog`
- [x] `HLG 1. Catalog Is A Real Workspace Surface`
- [x] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.

### `Catalog-1 / Phase 2`

- [x] `4. A Non-Primary Split Pane Can Switch To Catalog`
- [x] `5. Catalog Gets One Minimal First Surface Owner`
- [x] `6. The Primary Protected Model Slot Stays Model-Only`
- [x] `HLG 1. Catalog Is A Real Workspace Surface`
- [x] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.

### `Catalog-1 / Phase 3`

- [x] `7. Tiled Catalog Switching Reuses The Shared Workspace Path`
- [x] `8. Catalog Tiled Behavior Is Proven Against Existing Optional Surfaces`
- [x] `HLG 1. Catalog Is A Real Workspace Surface`
- [x] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.

### `Catalog-1 / Phase 4`

- [x] `9. Catalog Floats And Redocks Through The Shared Host-Mode Path`
- [x] `10. Catalog Does Not Need A One-Off Floating Shell`
- [x] `HLG 1. Catalog Is A Real Workspace Surface`
- [x] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.

### `Catalog-1 / Phase 4.1`

- [ ] `10A. Slotted Catalog Header Drag-Out Reaches A Real Floating Handoff`
- [ ] `10B. Generic Optional Surfaces Stop Falling Back To Default Float Placement On Drag-Out`
- [ ] `HLG 1. Catalog Is A Real Workspace Surface`
- [ ] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.

### `Catalog-1 / Phase 4.2`

- [x] `10C. Slotted Catalog Titlebar Float Menu Action Opens A Real Floating Window`
- [x] `10D. Shared Optional-Surface Float Menu Routing Is Proven Through The Titlebar Action Path`
- [x] `HLG 1. Catalog Is A Real Workspace Surface`
- [x] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.

### `Catalog-1 / Phase 5`

- [x] `11. Workspace Persistence Serializes And Restores Catalog Honestly`
- [x] `12. Popup Or Popout Scope Is Decided Explicitly Instead Of Left Vague`
- [x] `HLG 1. Catalog Is A Real Workspace Surface`
- [x] Catalog-Gen1-CLG-1. Keep Catalog as a real workspace surface that can sit beside the model viewport.

### `Catalog-1 / Phase 6`

- [x] `13. Catalog Gets One Explicit Shared Item Contract`
- [x] `14. The Baseline Contract Includes The Fields Needed For Card-Grid Browse`
- [x] `15. The Baseline Contract Distinguishes Asset Type And Honest Action Kind`
- [x] `16. The Baseline Contract Includes The Imports-Area Read Without Making Imports The Owner`
- [x] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [x] `HLG 4. Catalog Uses Explicit Item Metadata And Curated Source Truth`
- [x] Catalog-Gen1-CLG-3. Keep preview, commit, and apply behavior distinct by asset type.
- [~] Catalog-Gen1-CLG-5. Make repo-backed and already-imported user assets visibly distinct in the Catalog surface.

### `Catalog-1 / Phase 7`

- [x] `17. Catalog Gets One Curated Manifest Or Source Seam`
- [x] `18. Repo-Backed Items And Imports-Area Entries Read Through Explicit Source Truth`
- [x] `19. The Shell Stops Depending On Raw Folder Walking Or Filename Guessing`
- [x] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [x] `HLG 4. Catalog Uses Explicit Item Metadata And Curated Source Truth`
- [~] Catalog-Gen1-CLG-2. Keep repo-backed reusable assets optional and Catalog-selected instead of Browser-resident defaults.
- [~] Catalog-Gen1-CLG-5. Make repo-backed and already-imported user assets visibly distinct in the Catalog surface.

### `Catalog-1 / Phase 8`

- [x] `20. The First Visible Shell Uses A Lightweight Card Grid`
- [x] `21. Catalog Opens With No Auto-Loaded Previews`
- [x] `22. The Shell Includes Categories Or Filters, The Grid, The Item Page, And The Honest Action Area`
- [x] `23. The Item Page Is The Main Decision Surface For A Selected Entry`
- [x] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [x] `HLG 3. Preview Stays Separate From Add To Project`
- [x] Catalog-Gen1-CLG-3. Keep preview, commit, and apply behavior distinct by asset type.
- [~] Catalog-Gen1-CLG-5. Make repo-backed and already-imported user assets visibly distinct in the Catalog surface.

### `Catalog-1 / Phase 8.1`

- [x] `23A. Imports Reads As A Browse Section Instead Of A Separate Peer Panel`
- [x] `23B. Catalog Uses A Two-Column Browse Plus Content Layout Instead Of A Third Item-Page Column`
- [x] `23C. The Content Area Swaps Between The Card Grid And One Full Item Page`
- [x] `23D. The Item Page Reads Like A Store-Style Destination With A Clear Return To Catalog`
- [x] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [x] `HLG 3. Preview Stays Separate From Add To Project`
- [~] Catalog-Gen1-CLG-5. Make repo-backed and already-imported user assets visibly distinct in the Catalog surface.

### `Catalog-1 / Phase 8.2`

- [x] `23E. Catalog Card Typography Tightens So Card Copy Stops Colliding`
- [x] `23F. Catalog Cards Keep Clear Vertical Rhythm Without Visual Overlap`
- [x] `23G. The Grid Sizing Stays Stable Under Real Card Copy`
- [x] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`

### `Catalog-1 / Phase 9`

- [x] `24. CatalogSurface Stays A Thin Workspace Host Instead Of Regaining Shell Logic`
- [x] `25. CatalogShell Splits Into Focused Browse, Grid, And Item-Page UI Owners`
- [x] `26. Imports-Through-Browse Gets An Explicit UI Owner Inside The Shared Shell`
- [x] `HLG 2. Catalog Has A Lightweight Card-Grid, Imports, And Item-Page Baseline`
- [x] `HLG 4. Catalog Uses Explicit Item Metadata And Curated Source Truth`

### `Catalog-1 / Phase 10`

- [x] `27. Load Preview Stays Temporary`
- [x] `28. Add To Project Stays The Explicit Commit Action`
- [x] `29. Multiple Temporary Previews Are Allowed By Contract`
- [x] `29A. Card Preview Boxes Stay Empty Until The User Explicitly Loads Preview State`
- [x] `29B. One Preview Action Can Load Multiple Selected Card Preview Boxes`
- [x] `29C. Catalog Keeps A Preview-Loaded Session List And Restores It When The Surface Reopens During The Running Session`
- [x] `29D. Preview-Loaded Items Can Be Unloaded Without Affecting Project Truth`
- [x] `30. Reference Loading And HDRI Apply Stay Separate`
- [x] `HLG 3. Preview Stays Separate From Add To Project`
- [x] `HLG 5. Catalog Stays Distinct From Browser, Import, And Viewer Ownership`
- [x] Catalog-Gen1-CLG-3. Keep preview, commit, and apply behavior distinct by asset type.

### `Catalog-1 / Phase 11`

- [x] `31. Catalog Never Becomes The Hidden Runtime Owner After Commit`
- [x] `32. Browser Or Project Truth Owns Reference Results`
- [x] `33. Viewer Or Environment State Owns HDRI Results`
- [x] `34. Imports Reuse Still Stays Separate From The Import Pipeline`
- [x] `HLG 3. Preview Stays Separate From Add To Project`
- [x] `HLG 5. Catalog Stays Distinct From Browser, Import, And Viewer Ownership`
- [x] Catalog-Gen1-CLG-3. Keep preview, commit, and apply behavior distinct by asset type.
- [~] Catalog-Gen1-CLG-5. Make repo-backed and already-imported user assets visibly distinct in the Catalog surface.

### `Catalog-1.12`

- [ ] `35. Eligible Catalog Cards Can Add Reference Items To Project Directly From The Grid`
- [ ] `36. Direct Card Add To Project Reuses The Existing Browser-project Commit Handoff`
- [ ] `HLG 3. Preview Stays Separate From Add To Project`
- [ ] `HLG 5. Catalog Stays Distinct From Browser, Import, And Viewer Ownership`
- [ ] Catalog-Gen1-CLG-3. Keep preview, commit, and apply behavior distinct by asset type.

### `Catalog-1.13`

- [x] `37. One Batch Action Loads All Currently Displayed Preview-capable Cards`
- [x] `38. Hidden Filtered-out Cards Are Not Loaded By Displayed-card Batch Preview`
- [x] `39. Commit-only And Apply-environment Cards Are Not Loaded By Displayed-card Batch Preview`
- [x] `HLG 3. Preview Stays Separate From Add To Project`
- [x] `HLG 6. Catalog Can Batch Load Displayed Preview-Capable Cards Without Commit Or Apply Side Effects`
- [x] Catalog-Gen1-CLG-13. Add a displayed-card batch preview action that only affects visible preview-capable cards.

## [x] `Catalog-1 / Phase 1` - `Surface Kind And Catalog Registration`

### Phase 1 Summary
#### Purpose

Add `Catalog` as a first-class workspace surface kind before any UI, manifest, or loader work begins.

#### Owns

- `catalog` in `WorkspaceSurfaceKind`
- deterministic generated-id support for `catalog`
- canonical surface metadata for `catalog`
- optional-surface participation for `catalog`

#### Does Not Own

- visible `CatalogSurface` UI
- slot switching behavior
- manifest reads
- preview or commit behavior

#### Current Live Read

This phase is now shipped. The current registration seam is now:

- `src/app/workspace/workspaceShellTypes.ts`
  - owns the canonical `WorkspaceSurfaceKind` union
  - owns `createWorkspaceSurfaceInstanceIdForSlot(...)`
  - owns the default slot creation helpers that seed a slot with a generated surface instance id
  - now includes `catalog` in the `WorkspaceSurfaceKind` union
  - now gives `catalog` its own explicit `catalog-${slotId}` generated slot-instance branch instead of falling through the `spaghetti` fallback
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - is the bounded source of truth for surface metadata
  - owns:
    - `defaultLabel`
    - `renderFamily`
    - `scope`
    - `supports.slotted`
    - `supports.floating`
    - `supports.popout`
    - `supports.split`
    - persistence participation
    - coordination profile
  - now includes:
    - `catalog` in `WorkspaceSurfaceRenderFamily`
    - `catalog` in `OptionalWorkspaceSurfaceKind`
    - one canonical `catalog` metadata entry with optional-surface, split, floating, popout, slotted, persistence, and plain-coordination truth

The strongest nearby proof seams now show the registration cut is stable:

- `src/app/workspace/workspacePersistence.ts`
  - already calls `parseWorkspaceSurfaceKind(...)` while normalizing persisted surface records
  - now reads the shipped `catalog` kind through the same normalization path
- `src/app/workspace/ViewportFrame.tsx`
  - already types the slot surface picker against `WorkspaceSurfaceKind`
  - now carries the exhaustive `catalog` label follow-through for the widened union
- `src/app/workspace/useWorkspaceStore.ts`
  - already relies on `createWorkspaceSurfaceInstanceIdForSlot(...)` when creating and switching slot surfaces
  - now uses the explicit `catalog` id path during shared slot flows
- `src/app/workspace/workspaceSurfaceCatalog.test.ts`
  - now provides focused proof for `catalog` parse, optional-surface, split-support, and generated-id truth
- `src/app/workspace/useWorkspaceStore.test.ts`
  - now proves a `catalog` slot can detach, redock, and persist through the same shared workspace path as neighboring optional surfaces

#### First Pass Decisions

- `catalog` should enter as an optional workspace surface, not as a core surface
- `catalog` should get its own explicit generated slot-instance prefix instead of falling through the `spaghettiEditor` fallback branch
- `catalog` should be marked as participating in split and persistence from the start, because later tiled and restore phases should not need to reopen metadata truth
- `catalog` should use plain coordination in this phase
- no render registry or type-picker widening belongs in this phase yet

### Phase 1 Implementation Spec
#### Exact First Code Cut

1. Add `catalog` to the `WorkspaceSurfaceKind` union in `workspaceShellTypes.ts`.
2. Add an explicit `catalog-${slotId}` branch to `createWorkspaceSurfaceInstanceIdForSlot(...)`.
3. Verify the default slot helpers still type-check cleanly with the widened union and do not accidentally fall back to the `spaghetti` prefix.
4. Add `catalog` to `WorkspaceSurfaceRenderFamily` in `workspaceSurfaceCatalog.ts`.
5. Add one `catalog` entry to `workspaceSurfaceCatalogEntries` with:
   - an explicit default label
   - `scope: 'optional'`
   - honest split, floating, popout, and slotted support metadata
   - persistence participation enabled
   - `coordination: 'plain'`
6. Widen `OptionalWorkspaceSurfaceKind` so `catalog` is part of the optional surface set.
7. Stop before any `ViewportSurfaceRegistry`, `ViewportFrame`, or shell wiring work begins.

#### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspaceSurfaceCatalog.ts`
- likely focused proof surfaces:
  - `src/app/workspace/useWorkspaceStore.test.ts`
  - `src/app/workspace/ViewportFrame.test.tsx`
  - persistence-adjacent proof if needed through:
    - `src/app/AppShell.test.tsx`

#### No-Widening Rule

- do not start visible surface rendering in this phase
- do not widen into slot switching in this phase
- do not add manifest or shell concerns in this phase

#### Implementation Risks

- forgetting the generated-id branch and silently inheriting the `spaghetti-${slotId}` fallback
- widening the surface union without widening the optional-surface helper types
- adding `catalog` metadata in UI files before the canonical surface catalog is updated
- overreaching into slot switching or rendering work that belongs in `Phase 2`

#### Checklist

- [x] add `catalog` to `WorkspaceSurfaceKind`
- [x] add explicit generated slot-instance id support for `catalog`
- [x] add `catalog` to the surface render-family union
- [x] add one canonical `catalog` metadata entry to `workspaceSurfaceCatalogEntries`
- [x] widen the optional-surface helper type to include `catalog`
- [x] keep render registry, slot switching, and host-mode work deferred to later phases

#### Verification Shape

Minimum verification for this phase should cover:

- `catalog` can be represented by the canonical workspace kind union without type errors
- `createWorkspaceSurfaceInstanceIdForSlot('catalog', slotId)` produces a `catalog-...` id instead of falling through to another surface prefix
- `parseWorkspaceSurfaceKind('catalog')` resolves cleanly through the catalog metadata seam
- `isWorkspaceSurfaceOptional('catalog')` treats `catalog` as an optional surface
- `workspaceSurfaceSupportsSplit('catalog')` and the related support helpers reflect the intended metadata truth
- nearby shared workspace proof still type-checks or passes once `catalog` joins the union, especially around:
  - slot-surface creation or switching
  - slot-frame surface-kind typing
  - persistence normalization of surface kinds

#### Done Shape

`Phase 1` is done when:

- the canonical workspace type system knows `catalog`
- the canonical workspace metadata catalog knows `catalog`
- generated slot-instance ids for `catalog` are explicit and deterministic
- later phases can build slot switching and shell work on top of shared workspace truth instead of local exceptions

## [x] `Catalog-1 / Phase 2` - `Tiled Slot Switching And First CatalogSurface`

### Phase 2 Summary
#### Purpose

Prove the first real workspace-mode user flow: split a `modelViewer` and switch the new non-primary pane to `Catalog`.

#### Owns

- one minimal `CatalogSurface`
- non-primary slot switching to `Catalog`
- the protected-primary-slot rule staying `modelViewer`-only

#### Does Not Own

- full shell layout
- manifest-driven data
- preview or commit behavior
- floating or persistence proof

#### Current Live Read

Phase 1 is already landed, so the live Phase 2 read is now:

- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - is now the clearest first render seam
  - already branches on the canonical `renderFamily`
  - currently has no `renderFamily === 'catalog'` branch yet, so `catalog` still cannot render a real surface body
- `src/app/workspace/ViewportFrame.tsx`
  - is the shared slot type-picker seam for non-primary panes
  - already has the `catalog` label in the exhaustive `surfaceKindLabels` map
  - currently still omits `catalog` from the default `availableSurfaceKinds` picker list, so the shared viewport-type submenu still cannot open `Catalog`
  - already preserves the primary protected-slot rule by disabling every non-`modelViewer` kind when `isPrimary` is true
- `src/app/workspace/WorkspaceViewportTree.tsx`
  - already forwards `onRequestViewportSlotSurfaceKind(...)` through the shared slot-switch path
  - likely does not need a new catalog-only branch in this phase unless proof exposes real drift
- `src/app/workspace/ViewportFrame.test.tsx`
  - is the clearest existing proof seam for the shared viewport-type submenu contents and primary-slot restrictions
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - still owns a narrower popup surface list
  - should stay untouched in this phase because popup widening belongs later, not in the first tiled slot-switch proof

#### First Pass Decisions

- the first `CatalogSurface` can be intentionally minimal in this phase
- the goal is to prove shared split-and-switch flow, not to finish the full browse surface
- phase 2 should start from the already-shipped `catalog` workspace registration baseline rather than reopening type-system or metadata work
- the primary protected slot should stay `modelViewer`-only
- `Catalog` should appear through the same optional-surface path used by neighboring hosted surfaces
- the first picker widening should stay on the existing shared non-primary viewport-type submenu path instead of inventing catalog-only menu wiring

### Phase 2 Implementation Spec
#### Exact First Code Cut

1. Add one minimal `CatalogSurface` owner under the workspace surface area with intentionally placeholder content.
2. Register that surface through the existing `renderFamily === 'catalog'` path in `ViewportSurfaceRegistry.tsx`.
3. Expose `Catalog` in the shared non-primary slot type picker by widening the default `availableSurfaceKinds` list in `ViewportFrame.tsx`.
4. Keep the current primary protected-slot behavior so the primary pane still cannot switch away from `modelViewer`.
5. Add focused proof that the non-primary viewport-type submenu now offers `Catalog` while the primary-protected read stays model-only.
6. Stop once the user can keep the model visible in one pane and switch the sibling pane to a minimal `CatalogSurface`.

#### Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- likely focused proof surfaces:
  - `src/app/workspace/ViewportFrame.test.tsx`
  - `src/app/workspace/useWorkspaceStore.test.ts`

#### No-Widening Rule

- do not add the full shell contract in this phase
- do not add manifest parsing in this phase
- do not widen into floating behavior in this phase
- do not widen popup or popout surface menus in this phase

#### Implementation Risks

- letting the first `CatalogSurface` become an improvised full shell before the shell contract is locked
- breaking the protected-primary-slot rule
- adding catalog-only slot-switching exceptions instead of using the shared path
- widening popup behavior just because `catalog` now exists in the canonical surface catalog

#### Checklist

- [x] add one minimal `CatalogSurface`
- [x] register `Catalog` in the surface registry
- [x] expose `Catalog` in the non-primary slot type picker
- [x] keep the primary protected slot `modelViewer`-only
- [x] stop before full shell work begins

#### Verification Shape

Minimum verification for this phase should cover:

- the user can split a `modelViewer`
- the new non-primary pane can switch to `Catalog`
- the original pane stays `modelViewer`
- the primary protected slot still cannot switch away from `modelViewer`
- the shared viewport-type submenu now contains `Catalog` for non-primary panes
- the first `CatalogSurface` renders through the canonical render-family registry instead of a one-off shell exception

#### Done Shape

`Phase 2` is done when:

- `Catalog` renders as a real non-primary split-pane target
- the shared workspace split-and-switch path remains intact
- later shell work can build on a truthful first hosted surface instead of a shell special case

## [x] `Catalog-1 / Phase 3` - `Tiled Behavior Regression Proof`

### Phase 3 Summary
#### Purpose

Verify the new tiled `Catalog` surface behaves like the other hosted non-primary surfaces before host-mode widening begins.

#### Owns

- split and switch proof for `catalog`
- retained-surface reuse proof for `catalog`
- regression coverage against existing optional surfaces

#### Does Not Own

- floating behavior
- persistence
- shell-contract widening

#### Current Live Read

Phase 2 is now landed, so the live Phase 3 proof owners are:

- `src/app/workspace/useWorkspaceStore.ts`
  - is the real tiled lifecycle owner for slot surface switching
  - already stores per-slot `retainedSurfaceInstanceIdsByKind`
  - already routes slot switching through `setViewportSlotSurfaceKind(...)`
  - already restores a retained surface instance when the requested kind already has one for that slot
  - is the seam most likely to expose any `catalog`-specific drift if switching away and back does not behave like neighboring surfaces
- `src/app/workspace/useWorkspaceStore.test.ts`
  - already proves retained-surface reuse for `console`
  - already proves the first split-then-switch path from `modelViewer` to `catalog`
  - is the clearest owner for the next `catalog` switch-away and return proof
- the neighboring optional-surface set now includes:
  - `dashboard`
  - `notepad`
  - `catalog`
  - so the main regression question is whether `catalog` joins that shared tiled set honestly without disturbing the existing optional-surface lifecycle read

#### First Pass Decisions

- keep this phase a proof pass
- prove `catalog` can participate in the same tiled lifecycle as neighboring optional surfaces
- prefer widening the existing store tests over adding a second ad hoc Catalog-only proof harness
- treat switch-away and return behavior as the main missing truth after Phase 2, because basic split-and-open proof is already shipped
- only clean up real friction exposed by proof

### Phase 3 Implementation Spec
#### Exact First Code Cut

1. Add focused tiled switching coverage for `catalog` in the shared workspace-store proof.
2. Prove a non-primary slot can switch to `catalog`, switch away to another surface kind, and switch back while reusing the retained `catalog` surface instance for that slot.
3. Confirm the new tiled `catalog` path does not regress the neighboring optional-surface lifecycle read, especially `dashboard` and `notepad`.
4. Only if proof exposes friction, make the smallest `useWorkspaceStore.ts` or metadata cleanup needed.
5. Stop once the shared tiled lifecycle is proven honest enough to widen into floating behavior next.

#### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/useWorkspaceStore.test.ts`

#### No-Widening Rule

- do not begin floating or persistence work in this phase
- do not widen shell behavior in this phase
- do not bury fixes in `CatalogSurface` if the real owner is store or metadata truth
- do not widen the picker or registry further in this phase

#### Implementation Risks

- skipping regression proof and discovering shared-slot issues later during floating or persistence work
- widening a proof phase into unrelated surface behavior work
- hiding a store-level issue inside a local `CatalogSurface` patch
- proving only one happy path and missing switch-away or return regressions in the retained-surface map

#### Checklist

- [x] prove split and switch behavior for `catalog`
- [x] prove retained-surface reuse for `catalog`
- [x] prove neighboring optional surfaces still switch correctly
- [x] keep this phase a proof-and-cleanup pass only

#### Verification Shape

Minimum verification for this phase should cover:

- `catalog` can be opened, switched away from, and returned to through the shared tiled path
- returning to `catalog` reuses the slot's retained `catalog` surface instance instead of minting a fresh unexpected id
- existing optional surfaces still behave correctly after `catalog` joins the set
- any retained-surface rules remain honest for `catalog`

#### Done Shape

`Phase 3` is done when:

- the tiled `Catalog` path is proven stable enough to widen into floating behavior next
- no local `Catalog` exception was needed to keep the tiled workspace honest

## [x] `Catalog-1 / Phase 4` - `Float And Redock Host-Mode Parity`

### Phase 4 Summary
#### Purpose

Make `Catalog` behave like the other optional hosted surfaces in the shared floating-window lifecycle.

#### Owns

- float behavior for `Catalog`
- redock behavior for `Catalog`
- keeping host-mode truth on the shared path

#### Does Not Own

- popup or popout scope
- persistence
- full browse shell

#### Current Live Read

The likely owners are:

- `src/app/workspace/workspaceSurfaceActions.ts`
  - is the shared surface host-mode action seam for detaching and redocking slotted surfaces
- `src/app/workspace/useWorkspaceStore.ts`
  - is the detached-surface and host-mode state owner
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - now groups detached floating `catalog` surfaces alongside the other detached optional-surface families
- `src/app/AppShell.tsx`
  - now mounts detached floating `catalog` surfaces through the shared app-shell floating host band
- `src/app/hosts/SimpleFloatingSurfaceHost.tsx`
  - now owns the reusable simple floating shell used by `catalog`, keeping the floating chrome generic instead of `Catalog`-specific

#### First Pass Decisions

- `Catalog` should participate in the same float and redock lifecycle as other optional surfaces
- avoid a `Catalog`-specific floating shell branch when a reusable simple host can own the floating chrome
- keep this phase about shared host-mode parity, not shell polish

### Phase 4 Implementation Spec
#### Exact First Code Cut

1. Verify `Catalog` can enter the shared floating host mode.
2. Verify `Catalog` can redock back to the shared slotted mode.
3. Add focused proof that `Catalog` uses the same host-mode action path as the other optional surfaces.
4. If a shell wrapper is needed, keep it reusable for simple floating surfaces instead of making it `Catalog`-only.
5. Only if necessary, make narrow shared-host cleanup in store or action owners.

#### Likely Files

- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- `src/app/hosts/SimpleFloatingSurfaceHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`

#### No-Widening Rule

- do not widen into popup or popout decisions yet
- do not polish the final shell UI yet
- do not add a `Catalog`-only floating wrapper if the shared host path can own it

#### Implementation Risks

- letting `Catalog` float through a one-off path instead of the shared host-mode contract
- blurring floating parity with later persistence or popup work
- assuming tiled proof already guarantees floating truth without dedicated coverage

#### Checklist

- [x] verify `Catalog` can float
- [x] verify `Catalog` can redock
- [x] keep `Catalog` on the shared floating host-mode path
- [x] avoid a catalog-only floating shell branch

#### Verification Shape

Minimum verification for this phase should cover:

- `Catalog` can move into floating mode
- `Catalog` can return to the slotted layout
- shared optional surfaces remain correct after `Catalog` joins the same host-mode lifecycle

#### Done Shape

`Phase 4` is done when:

- `Catalog` participates in the same float and redock lifecycle as the other optional workspace surfaces
- no catalog-only floating lifecycle exception or shell wrapper is needed

## [ ] `Catalog-1 / Phase 4.1` - `Slotted Header Drag-Out Floating Handoff Parity`

### Phase 4.1 Summary
#### Purpose

Fix the slotted titlebar drag-out path so `Catalog` and the neighboring simple optional surfaces enter floating mode through a real pointer-seeded handoff instead of dropping into generic default float placement.

#### Owns

- slotted header drag-out parity for `catalog`
- the shared handoff from slotted viewport header drag into floating host mode
- pointer-seeded floating placement for the simple optional surface set

#### Does Not Own

- broad floating-shell cleanup under `Floating Window Shell`
- popup or popout support
- persistence
- browse-shell widening

#### Current Live Read

Phase 4 is now landed, so the live follow-up owners are:

- `src/app/workspace/ViewportFrame.tsx`
  - already detects titlebar drag-out and emits `onHeaderDragOut(...)` after the pointer crosses the threshold
- `src/app/workspace/WorkspaceViewportTree.tsx`
  - already enables titlebar drag-out for every non-primary non-`modelViewer` slot
  - so `catalog`, `dashboard`, and `notepad` all currently participate in the same slotted header drag-out path
- `src/app/hosts/useAppShellViewportActions.ts`
  - already gives special drag handoff treatment to:
    - `browser`
    - `spaghettiEditor`
    - `console`
  - but for `catalog`, `dashboard`, and `notepad` it currently falls through to `handleViewportSlotFloat(...)` with no pointer-seeded floating rect handoff
  - that means the simple optional surfaces can enter floating mode, but not through an honest drag-position handoff
- `src/app/hosts/SimpleFloatingSurfaceHost.tsx`
  - currently owns the simple floating shell once a surface is already detached
  - is not the real missing owner for this bug, because the break happens before the surface reaches the floating host
- `src/app/AppShell.test.tsx`
  - already proves detached floating render for `catalog`
  - does not yet prove slotted titlebar drag-out for `catalog`
- `src/app/hosts/BrowserDockHost.test.tsx`
  - already proves the repo pattern for consuming a slotted-header drag seed into a floating handoff

#### First Pass Decisions

- keep this as a workspace host-mode handoff fix, not a broad floating-shell cleanup pass
- treat the bug as `Catalog`-triggered but shared across the simple optional surface set unless proof shows otherwise
- prefer one shared drag-seed or handoff path for `catalog`, `dashboard`, and `notepad` instead of another Catalog-only exception
- keep `Floating Window Shell` cleanup separate, because the missing truth here is the slotted-to-floating handoff before the shell mounts

### Phase 4.1 Implementation Spec
#### Exact First Code Cut

1. Reproduce the slotted `Catalog` titlebar drag-out path from a non-primary split slot and confirm the floating handoff currently falls back to default placement.
2. Add focused AppShell proof for dragging a slotted `catalog` header into floating mode.
3. Add one shared drag-seed or equivalent pointer-handoff path for the simple optional surfaces so `catalog` can enter floating mode at the drag location instead of the default parked float rect.
4. Confirm whether `dashboard` and `notepad` share the same broken path and widen the same fix if they do.
5. Stop once the slotted optional-surface drag-out path is honest enough to match the already-shipped float and redock baseline.

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/hosts/SimpleFloatingSurfaceHost.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx` as the closest existing drag-seed reference

#### No-Widening Rule

- do not turn this into the full `Floating Window Shell` cleanup family
- do not widen into popup or popout support here
- do not reopen the already-shipped generic float and quick-dock baseline from Phase 4
- do not widen shell chrome or resize behavior here

#### Implementation Risks

- fixing only `catalog` locally and leaving the same slotted-header handoff bug in `dashboard` and `notepad`
- patching the floating host after mount instead of fixing the earlier slotted-header handoff owner
- widening a narrow drag-handoff fix into a broad floating-shell abstraction pass
- relying only on detached render proof and still missing the actual user drag path

#### Checklist

- [ ] reproduce the slotted `catalog` titlebar drag-out bug on the shared workspace path
- [ ] add focused proof for slotted `catalog` header drag-out into floating mode
- [ ] give the simple optional surfaces a real pointer-seeded floating handoff
- [ ] keep the fix on the shared slotted-to-floating seam instead of a Catalog-only branch

#### Verification Shape

Minimum verification for this phase should cover:

- a non-primary slotted `catalog` surface can be dragged out by its titlebar into floating mode
- the resulting floating window honors the drag handoff instead of appearing only at the generic default float location
- neighboring simple optional surfaces remain correct after the same handoff path is widened
- the already-shipped float and quick-dock behavior still works after the drag-handoff fix

#### Done Shape

`Phase 4.1` is done when:

- slotted `Catalog` titlebar drag-out enters floating mode through an honest shared handoff
- the simple optional-surface set no longer relies on default float placement when the user explicitly drags the titlebar out

## [x] `Catalog-1 / Phase 4.2` - `Slotted Titlebar Float Menu Parity`

### Phase 4.2 Summary
#### Purpose

Fix the slotted titlebar action-menu float path so a non-primary `Catalog` slot can be right-clicked and floated through the ordinary `Float` menu action.

#### Owns

- slotted titlebar `Float` action parity for `catalog`
- the shared menu-driven float path for the simple optional surfaces
- focused proof that titlebar action-menu float actually produces a detached floating window

#### Does Not Own

- drag-out handoff behavior from `Phase 4.1`
- broad floating-shell cleanup under `Floating Window Shell`
- popup or popout support
- persistence

#### Current Live Read

After the Phase 4 and `Phase 4.1` research passes, the live owners are:

- `src/app/workspace/ViewportFrame.tsx`
  - already renders the titlebar action menu
  - already exposes a `Float` action row that dispatches `onFloat`
- `src/app/workspace/WorkspaceViewportTree.tsx`
  - already wires `onFloat` for non-primary slots through `onFloatViewportSlot(...)`
- `src/app/hosts/useAppShellViewportActions.ts`
  - owns `handleViewportSlotFloat(...)`
  - is the menu-driven float owner once the titlebar action dispatch reaches AppShell
- `src/app/workspace/workspaceSurfaceActions.ts`
  - owns the generic `floatWorkspaceSurface(...)` detach path once the action reaches workspace surface routing
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - routes detached `dashboard` and detached `catalog` surfaces through different floating-host selector bands after detach
- `src/app/hosts/DashboardWindowHost.tsx`
  - is still the working dedicated floating host for detached `dashboard` surfaces
- `src/app/hosts/SimpleFloatingSurfaceHost.tsx`
  - is the newer generic floating host path currently responsible for detached `catalog` surfaces
- `src/app/AppShell.test.tsx`
  - currently proves detached floating `catalog` render only when the store is driven directly
  - does not yet prove the full slotted titlebar menu path for `catalog`

Current honest gap read:

- `dashboard` and `catalog` both enter the same slotted titlebar menu-to-float path, so the front menu dispatch alone is not the strongest suspect
- the current user repro says the slotted `catalog` viewport closes and the model viewport expands, which strongly suggests the detach side effect is already happening
- `dashboard` then survives because it is surfaced through the older dedicated `DashboardWindowHost.tsx` path
- `catalog` is the only nearby comparison surface that depends on the newer generic `SimpleFloatingSurfaceHost.tsx` path for the detached follow-through
- current proof only covers direct detached `catalog` rendering, not the real slotted titlebar UI transition
- so the most honest first read is that the shared slotted action is probably removing the slot successfully, but the detached Catalog surface is not being surfaced through the newer generic floating host path during that real UI transition

#### First Pass Decisions

- keep this phase separate from `Phase 4.1`, because menu-driven float and drag-out float are different user entry paths
- keep `dashboard` as the closest working comparison baseline for the full slotted-titlebar-to-detached-window transition
- add end-to-end AppShell proof for the actual slotted titlebar `Float` action instead of relying on direct store detachment
- treat this phase as owning the full slotted-titlebar-to-detached-Catalog follow-through, not just the titlebar menu callback in isolation
- widen beyond `catalog` only if the same detached follow-through break is real for the neighboring simple optional surfaces

### Phase 4.2 Implementation Spec
#### Exact First Code Cut

1. Reproduce the slotted `Catalog` titlebar right-click `Float` action path and confirm the floating window does not appear.
2. Add focused AppShell proof that a non-primary slotted `catalog` surface can open its titlebar action menu and float through the `Float` row.
3. Trace the shared `ViewportFrame` to `WorkspaceViewportTree` to `useAppShellViewportActions` menu-driven float path, then compare the working detached `dashboard` host follow-through against the detached `catalog` `SimpleFloatingSurfaceHost.tsx` path.
4. Fix the real slotted-titlebar-to-detached-Catalog break and confirm whether the same detached follow-through problem is also real for `notepad` before widening the same fix.
5. Stop once the titlebar `Float` menu path is honest for the simple optional-surface lane.

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`

#### No-Widening Rule

- do not collapse this into the drag-out handoff work from `Phase 4.1`
- do not turn this into a broad floating-shell cleanup pass
- do not widen into popup or popout support
- do not reopen the already-shipped detached floating render host

#### Implementation Risks

- assuming the direct-detach proof already covers the menu-driven user path
- patching only `catalog` if the same slotted titlebar `Float` path is also broken for the neighboring simple optional surfaces
- fixing the action menu visually while leaving the AppShell float routing broken underneath
- accidentally merging the menu-action bug and the drag-out bug into one broader phase that becomes harder to prove

#### Checklist

- [x] reproduce the slotted `catalog` titlebar `Float` action failure
- [x] add focused AppShell proof for menu-driven `catalog` float
- [x] fix the shared slotted titlebar menu-to-float seam
- [x] widen to neighboring simple optional surfaces only if the same break is real

#### Verification Shape

Minimum verification for this phase should cover:

- a non-primary slotted `catalog` surface can be right-clicked and floated through the titlebar action menu
- the resulting floating Catalog window actually appears in AppShell
- the slotted source slot leaves the slot tree honestly once floated
- the already-shipped quick-dock path still works after menu-driven float succeeds

#### Done Shape

`Phase 4.2` is done when:

- the slotted `Catalog` titlebar `Float` action produces a real floating window
- the shared simple optional-surface menu path no longer silently drops the float action

## [x] `Catalog-1 / Phase 5` - `Persistence And Popup Decision`

### Phase 5 Summary
#### Purpose

Finish the workspace-hosting foundation by making startup restore truth explicit for `catalog` and resolving the current popup or popout support inconsistency honestly.

#### Owns

- startup restore truth for `catalog`
- persisted-layout round-trip proof at the app-shell boundary
- explicit popup or popout scope decision for `catalog`
- any narrow metadata alignment needed if popup support is deferred

#### Does Not Own

- broad popup implementation if it does not clearly belong here
- shell-contract widening
- loader behavior

#### Current Live Read

Phase 4 is now landed, so the live Phase 5 owners are:

- `src/app/workspace/workspacePersistence.ts`
  - already serializes and normalizes persisted workspace layout
  - already parses `catalog` through the generic surface-kind path
  - already persists detached optional surfaces when their surface kind participates in persistence
- `src/app/workspace/useWorkspacePersistenceBridge.ts`
  - is the real startup restore seam that hydrates the saved workspace layout from storage and writes the normalized layout back out
  - still gates restore behind a `window.confirm(...)` prompt, so the phase needs honest proof for both the accepted-restore path and the declined-start-fresh path if either one changes
- `src/app/workspace/useWorkspaceStore.test.ts`
  - already proves detached `catalog` surfaces survive serialize and normalize round-trips at the store level
  - so the main missing persistence truth is no longer generic serializer support, but real app-shell restore behavior
- `src/app/workspace/useWorkspacePersistenceBridge.test.tsx`
  - now owns the focused startup restore proof for accepted and declined Catalog layout restore through the real persistence bridge
  - keeps the proof on the actual hydration seam without inheriting unrelated noise from the broader `AppShell.test.tsx` suite
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - currently exposes `detachedCatalogFloatingSurfaces`
  - does not yet expose a matching `detachedCatalogPopoutSurfaces` band
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - still limits popup-local available surface kinds to `modelViewer`, `spaghettiEditor`, `console`, and `browser`
  - is therefore an explicit hard exclusion point for `catalog`, not just an unimplemented follow-through
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - now says `catalog` supports `popout: false`
  - so the live repo no longer claims unsupported Catalog popout behavior while popup support remains deferred
- `src/app/workspace/WorkspaceViewportTree.tsx`
  - now respects host-mode capability metadata before exposing slotted popout chrome
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
  - now proves a slotted non-primary `catalog` pane does not surface the unsupported popout action button

#### First Pass Decisions

- persistence landed as the first shipped truth, but at the real `useWorkspacePersistenceBridge.ts` seam rather than only in serializer tests
- popup or popout support now ends this phase with an explicit `no`, and the metadata plus slotted chrome now match that deferral honestly
- the phase stops before popup-host widening so later work can reopen Catalog popout only when `PopupWorkspaceShell.tsx` and the detached-surface selectors are ready for real parity

### Phase 5 Implementation Spec
#### Exact First Code Cut

1. Add focused app-shell restore proof that a saved slotted or detached `catalog` surface rehydrates honestly through `useWorkspacePersistenceBridge.ts` when the user accepts the restore prompt.
2. Confirm the declined-restore path still starts fresh and writes back an honest non-Catalog layout instead of silently reusing stale persisted state.
3. Reuse the already-landed store-level serialize and normalize proof where possible instead of duplicating generic persistence coverage.
4. Decide explicitly whether `catalog` popout support belongs in this lane or is still deferred.
5. If the popout answer is `yes`, widen the app-shell detached-surface selectors, host mounting, and popup owners to give `catalog` real popout parity, including `PopupWorkspaceShell.tsx` available-surface truth.
6. If the popout answer is `no`, narrow the `catalog` metadata and phase wording so the repo stops claiming unsupported popout behavior.
7. Stop once persisted restore truth and the popup decision are honest.

#### Likely Files

- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/useWorkspacePersistenceBridge.ts`
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts` if popout support is accepted
- `src/app/AppShell.tsx` if popout support is accepted
- `src/app/workspace/PopupWorkspaceShell.tsx` if popout support is accepted
- `src/app/workspace/PopupWorkspaceShell.tsx` only if popup or popout scope is intentionally accepted
- `src/app/workspace/workspaceSurfaceCatalog.ts` if unsupported `catalog` popout support is explicitly deferred

#### No-Widening Rule

- do not add popup or popout support by drift
- do not widen shell layout work here
- do not reopen floating host-mode work that Phase 4 already settled
- do not treat persistence proof as a place to reopen surface registration or first-surface work

#### Implementation Risks

- assuming the existing serializer proof means startup restore is already covered when the app-shell bridge still has to hydrate the saved layout honestly
- proving only the accepted-restore path while leaving the declined-start-fresh branch vague even though the bridge owns both outcomes today
- silently leaving `catalog` as `popout: true` in metadata while the live host seams still do not expose Catalog popout behavior
- widening a persistence-and-decision phase into broader shell work or browse implementation

#### Checklist

- [x] verify saved workspace layouts can restore `catalog` through the real shared persistence bridge
- [x] verify the restore-confirmation prompt path stays honest for both accept and decline outcomes
- [x] keep the existing store-level `catalog` persistence proof honest instead of duplicating it blindly
- [x] decide `catalog` popup or popout scope explicitly
- [x] either implement real Catalog popout parity or narrow the metadata to an explicit deferral

#### Verification Shape

Minimum verification for this phase should cover:

- a saved workspace layout can rehydrate a `catalog` surface honestly on startup
- the restore-confirmation branch does not accidentally carry stale `catalog` state through a declined fresh start
- persisted workspace layouts do not drop or corrupt the `catalog` surface through the real persistence bridge
- popup or popout scope ends the phase either explicitly implemented or explicitly deferred
- the repo no longer claims a `catalog` popout path that the live host seams do not actually support

#### Done Shape

`Phase 5` is done when:

- restore behavior for `catalog` is honest at startup, not only inside serializer tests
- popup or popout support for `catalog` is either implemented cleanly or explicitly deferred instead of being left vague

## [x] `Catalog-1 / Phase 6` - `Catalog Item Contract`

### Phase 6 Summary
#### Purpose

Lock one explicit curated item shape before manifest reads or shell rendering start depending on ad hoc filename logic.

#### Owns

- the first shared catalog-item contract
- baseline browse and item-page metadata fields
- honest asset-type and action-kind fields
- the first `Imports`-area contract read

#### Does Not Own

- final reference-family metadata
- final `HDRI` runtime behavior
- full `Generation 2` part-fitment widening

#### Current Live Read

This phase is now shipped. The live owners are:

- `src/app/catalog/catalogItemContract.ts`
  - now owns the first Catalog-specific shared item shape
  - defines the explicit baseline unions for:
    - asset kind
    - action kind
    - source kind
    - preview media kind
  - defines the first Catalog item record plus explicit repo-backed and imports-area source refs
- `src/app/catalog/catalogItemContract.test.ts`
  - now proves the baseline repo-backed and imports-area shapes through one focused pure contract test
- `src/app/references/referenceManifest.ts`
  - remains the older reference-family precedent
  - was intentionally not migrated in this phase so the new Catalog seam could land cleanly first
- `src/app/workspace/CatalogSurface.tsx`
  - remains a placeholder shell and still does not own runtime catalog data yet

#### First Pass Decisions

- the contract should land in one dedicated Catalog-owned module, preferably under a new `src/app/catalog/` home
- the contract should stay generic enough for both later reference assets and later `HDRIs`
- the contract should include enough metadata for:
  - card-grid browse
  - item-page display
  - honest action labeling
- the contract should let the imports area exist as a reuse read without making imports the owner
- the first pass should be type-only or helper-light, not a runtime manifest read
- avoid Gen 2-only fields unless they are truly needed for baseline browse truth
- do not migrate the old reference manifest onto the new contract in this phase; only establish the new seam cleanly first

### Phase 6 Implementation Spec
#### Exact First Code Cut

1. Add one shared Catalog-owned item-contract module.
2. Place it in one explicit long-term Catalog home, most likely `src/app/catalog/catalogItemContract.ts`.
3. Define the first baseline fields needed for:
   - grid display
   - item-page display
   - action labeling
   - family or section organization
   - imports-area reuse classification
4. Add the narrow companion unions or enums needed to keep asset type, source kind, and action kind explicit instead of stringly-typed at call sites.
5. Add one focused pure test that proves the contract exports the intended baseline shape and keeps imports-area or repo-backed classification explicit.
6. Keep the contract generic enough for both reference assets and `HDRIs`.
7. Stop before any loader implementation, manifest migration, or `CatalogSurface` shell rendering starts depending on the new contract.

#### Likely Files

- likely new `src/app/catalog/catalogItemContract.ts`
- likely new `src/app/catalog/catalogItemContract.test.ts`
- `src/app/workspace/CatalogSurface.tsx` only if a type import is genuinely needed for compile follow-through
- `src/app/references/referenceManifest.ts` only as a read reference during implementation, not as the write owner for this phase

#### No-Widening Rule

- do not widen into full family-specific metadata here
- do not import Gen 2 part-platform normalization into this baseline
- do not let the shell parse filenames directly instead of using the new contract
- do not move old reference manifest runtime onto the new contract yet
- do not add curated manifest data or imports loaders here; that belongs to Phase 7

#### Implementation Risks

- making the contract too weak to support the card-grid, item-page, and action-language baseline
- making the contract too large by pulling later Gen 2 fields into the foundation
- letting imports-area entries blur into import-pipeline ownership
- letting the new contract live in `workspace/` or `references/` and immediately creating the wrong long-term owner
- widening a clean type-seam phase into runtime manifest rewiring before the contract itself is stable

#### Checklist

- [x] define the first shared catalog-item contract
- [x] include the fields needed for grid browse and item-page display
- [x] include explicit asset-type and action-kind fields
- [x] include enough source classification to support an imports-area reuse read
- [x] keep later Gen 2 widening out of the baseline contract

#### Verification Shape

Minimum verification for this phase should cover:

- the first shared item contract is explicit and importable from one canonical place
- asset type, source kind, and action kind are explicit instead of being left as ad hoc freeform strings
- the shell no longer depends on ad hoc filename logic as its long-term contract
- imports-area entries can be represented without pretending `Catalog` owns import intake

#### Done Shape

`Phase 6` is done when:

- the first shared item contract is explicit
- later phases can target one stable item shape for baseline `Generation 1` shell work

## [x] `Catalog-1 / Phase 7` - `Manifest Source Seam`

### Phase 7 Summary
#### Purpose

Define where curated catalog items come from so the first runtime shell does not parse raw folders directly.

#### Owns

- one explicit manifest or catalog-source seam
- repo-backed source truth
- the imports-area source read
- separation between source truth and downstream apply behavior

#### Does Not Own

- final loader behavior
- arbitrary folder browsing
- external-source widening

#### Current Live Read

This phase is now shipped. The live owners are:

- `src/app/catalog/catalogItemContract.ts`
  - remains the shared item shape that the source seam emits
- `src/app/catalog/catalogSeedItems.ts`
  - now owns the first authored repo-backed Catalog baseline entries
- `src/app/catalog/catalogSource.ts`
  - now owns the Catalog-curated source seam
  - combines:
    - repo-backed authored entries
    - imports-area reuse entries passed in as read-only source records
  - emits `CatalogItemRecord` for both lanes instead of reviving the old reference-manifest shape
- `src/app/catalog/catalogSource.test.ts`
  - now proves the new source seam exposes both repo-backed and imports-area entries through one Catalog-owned path
- `src/app/references/referenceManifest.ts`
  - remains the older authored-data precedent
  - was intentionally not migrated in this phase so the new Catalog source owner could land cleanly first

#### First Pass Decisions

- the source seam should stay curated and explicit
- the source seam should carry both repo-backed baseline items and imports-area entries honestly
- downstream apply behavior should not be buried inside manifest reads
- the first pass should still read as a `Generation 1` curated library, not a filesystem picker
- the source seam should live under `src/app/catalog/` and emit `CatalogItemRecord`
- the first pass should likely split into:
  - one authored repo-backed seed-data file
  - one Catalog-owned source or selector module that combines repo-backed entries with imports-area reuse entries
- imports-area entries should be surfaced through the source seam as a read only; Phase 7 should not reopen import intake ownership
- do not migrate `references/referenceManifest.ts` yet; establish the new Catalog-owned source seam first

### Phase 7 Implementation Spec
#### Exact First Code Cut

1. Add one explicit Catalog-owned source owner under `src/app/catalog/`, likely something like `catalogSource.ts`.
2. Add one lightweight authored repo-backed data file under the same home for the first curated baseline entries.
3. Make the source seam emit the Phase 6 `CatalogItemRecord` shape instead of a second temporary type.
4. Define how imports-area entries are surfaced through that source seam as a read-only classification after import intake.
5. Add one focused pure test that proves:
   - repo-backed entries come through the source seam
   - imports-area entries can be represented through the same seam
   - the source seam does not hide downstream apply behavior inside the data read
6. Keep later shell work consuming this source instead of raw folder walking or local arrays.
7. Stop before any actual `CatalogSurface` browse UI or import-pipeline rewiring lands.

#### Likely Files

- likely new `src/app/catalog/catalogSource.ts`
- likely new authored data file such as `src/app/catalog/catalogSeedItems.ts`
- likely new `src/app/catalog/catalogSource.test.ts`
- `src/app/catalog/catalogItemContract.ts` for type imports only
- `src/app/references/referenceManifest.ts` only as a read precedent during implementation, not as the write owner

#### No-Widening Rule

- do not widen into external links or archives here
- do not widen into import-pipeline behavior here
- do not hide action behavior inside the manifest source
- do not widen into first Catalog shell regions or `CatalogSurface` browse UI here
- do not migrate the old Browser reference manifest into the new Catalog source in this phase

#### Implementation Risks

- replacing one ad hoc folder read with another ad hoc local parsing rule
- treating imports-area entries as if `Catalog` owns the import pipeline
- over-designing a giant source system before the first curated baseline exists
- introducing a source seam that does not actually emit the new `CatalogItemRecord` contract
- burying repo-backed seed data directly in UI files instead of giving it one Catalog-owned authored home

#### Checklist

- [x] define one explicit catalog-source seam
- [x] author repo-backed entries through that seam
- [x] define the imports-area source read through that seam
- [x] keep the shell off raw folder walking
- [x] keep downstream apply behavior separate from the source read

#### Verification Shape

Minimum verification for this phase should cover:

- the repo has one honest source seam for baseline catalog items
- the source seam emits the shared `CatalogItemRecord` contract from Phase 6
- the shell can later consume item data without inventing local parsing rules
- imports-area entries can be represented through the same curated source contract

#### Done Shape

`Phase 7` is done when:

- the repo has one honest source seam for catalog items
- later UI work can consume item data without inventing local parsing rules

## [x] `Catalog-1 / Phase 8` - `First Catalog Shell Regions`

### Phase 8 Summary
#### Purpose

Lock the first visible browse surface so the first runtime pass does not collapse categories, grid, item page, imports, actions, and previews into one improvised component.

#### Owns

- the first card-grid shell contract
- the no-auto-preview rule
- the item-page-as-decision-surface rule
- the first explicit shell regions

#### Does Not Own

- final family-specific loaders
- real reference-family content
- final search scale-up

#### Current Live Read

This phase is now shipped. The live owners are:

- `src/app/workspace/CatalogSurface.tsx`
  - now acts as the workspace entry host for the first real Catalog shell
  - reads `referenceWorkspace` from app state, normalizes imports-area entries through the shared Catalog source helper, and renders the new visible shell instead of the old placeholder paragraph
- `src/app/catalog/ui/CatalogShell.tsx`
  - now owns the first browse-first shell scaffold
  - defines explicit regions for:
    - categories or filters
    - lightweight card grid
    - selected-item item page
    - honest action area
    - imports area
  - keeps previews user-triggered by showing preview availability without auto-rendering media elements into the grid or item page
- `src/app/catalog/catalogSource.ts`
  - now exposes one Catalog-owned source seam for:
    - repo-backed entries
    - imports-area reuse entries
  - now also exposes the helper that turns `referenceWorkspace` imported-reference state into a Catalog imports snapshot so the shell can stay source-backed without becoming import-runtime-owned
- `src/app/catalog/catalogItemContract.ts`
  - now defines the item shape the shell regions should consume
  - keeps the shell type-honest while selection, item-page, and imports reads stay explicit
- `src/app/workspace/CatalogSurface.test.tsx`
  - now proves the first shell regions render over the shared Catalog source seam
  - proves the shell keeps previews user-triggered instead of auto-loading media elements
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
  - now proves the canonical workspace registry path renders the first visible Catalog shell instead of the retired placeholder copy

The current `Catalog-1` family read still expects the first visible shell to include:
- categories or filters
- a lightweight card grid
- an `Imports` area or equivalent baseline section
- an item page whose primary responsibilities are preview, description, and honest action labeling
- no auto-loaded previews

#### First Pass Decisions

- the first shell should be card-grid based, not list-only
- previews should remain user-triggered, not auto-loaded on grid render
- selecting an item should let the user reach an item page that becomes the main decision surface
- categories, grid, item page, and action area should be explicit regions instead of being improvised inside one render function
- the first shell should consume the existing Catalog source seam directly instead of inventing temporary UI-only arrays
- the next cut should probably introduce a small Catalog UI folder under `src/app/catalog/` for extracted shell regions while keeping `CatalogSurface.tsx` as the workspace entry host
- the first visible shell can stay placeholder-light in styling, but the region boundaries need to be explicit enough that later phases do not have to reopen ownership

### Phase 8 Implementation Spec
#### Exact First Code Cut

1. Replace the current placeholder body in `CatalogSurface.tsx` with the first real visible shell scaffold backed by the existing Catalog source seam.
2. Define the first shell regions for:
   - categories or filters
   - lightweight card grid
   - item page or selected-item decision surface
   - explicit action area
   - imports-area entry point or region
3. Extract region components under a small Catalog UI home if `CatalogSurface.tsx` starts carrying too many direct layout responsibilities.
4. Lock the no-auto-preview rule in the shell contract.
5. Lock the item-page responsibilities in the shell contract.
6. Keep the shell browse-first and type-honest.
7. Stop before any real preview runtime, apply behavior, or family-specific loader wiring lands.

#### Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- `src/app/catalog/catalogSource.ts`
- likely extracted shell-region components under a new `src/app/catalog/ui/` folder
- likely new shell tests such as `CatalogSurface.test.tsx` or small region tests once the first visible contract is rendered
- `src/app/AppShell.test.tsx` only if one narrow visibility smoke check is genuinely needed beyond the focused Catalog UI tests

#### No-Widening Rule

- do not widen into real family loaders in this phase
- do not let the first shell auto-preview every item
- do not let the selected-item decision surface disappear into a generic side panel without explicit contract language
- do not reopen contract or source-shape work that Phases 6 and 7 already settled
- do not turn the first shell pass into final styling or search-scale work

#### Implementation Risks

- turning the first shell into one overloaded component with no stable region boundaries
- leaving the item page implied instead of explicit
- letting preview behavior drift into auto-load because the shell contract was not clear enough
- bypassing the new `catalogSource.ts` seam and quietly recreating local UI-owned seed arrays
- over-investing in polished visuals before the region ownership is stable

#### Checklist

- [x] define categories or filters as an explicit shell region
- [x] define the lightweight card grid as an explicit shell region
- [x] define the item page as the main decision surface for a selected entry
- [x] define the honest action area as an explicit shell region
- [x] lock the no-auto-preview rule
- [x] include the imports-area shell read

#### Verification Shape

Minimum verification for this phase should cover:

- the shell regions are explicit enough to implement without reopening scope questions
- the shell contract clearly says previews are not auto-loaded
- the selected entry can be reasoned about through an item-page decision surface
- the visible shell consumes Catalog source data through the shared Catalog seam instead of local placeholder arrays

#### Done Shape

`Phase 8` is done when:

- the shell layout is explicit enough for implementation without reopening UI-scope questions
- the card-grid, item-page, imports, and no-auto-preview baseline is locked

## [x] `Catalog-1 / Phase 8.1` - `Imports As Browse Section`

### Phase 8.1 Summary
#### Purpose

Correct the first visible Catalog shell read now that the live layout is visible: `Imports` should behave as one browse source inside the browse area, and the selected item should become a full item page inside the shared content area instead of competing as a third column.

#### Owns

- collapsing the shell to a 2-column browse-plus-content layout
- moving `Imports` into the browse-area section list
- making the right-side content area swap between:
  - the catalog card grid
  - one full item page for the selected entry
- the first explicit store-style item-page navigation read

#### Does Not Own

- real preview runtime
- real family-specific loaders
- final search or sort widening
- major data-contract or source-shape changes

#### Current Live Read

This phase is now shipped. The live owners are:

- `src/app/catalog/ui/CatalogShell.tsx`
  - now renders the intended 2-column browse-plus-content shell
  - keeps the left browse rail as the owner for:
    - `All`
    - repo-backed sections
    - `Imports`
  - keeps the right content area as the only content surface and swaps it between:
    - grid mode
    - one full item-page mode
  - gives the item page a clear `Back To Catalog` return path instead of leaving it as a competing third column
- `Imports`
  - now behaves as a browse section instead of a separate peer panel
  - browses imported entries through the same shared content area as the curated catalog
- the selected item page
  - now replaces the shared content area instead of competing beside the grid
  - reads like a store-style destination page with explicit back navigation
- `src/app/theme/surfaces/catalog.css`
  - now owns the 2-column shell layout and the store-style item-page presentation
- `src/app/workspace/CatalogSurface.test.tsx`
  - now proves:
    - the 2-column browse-plus-content shell read
    - the content-area swap between grid and item-page modes
    - imports browsing through the shared content area instead of a separate imports panel

#### First Pass Decisions

- the shell should collapse to 2 columns, not 3
- the left browse column should hold:
  - `All`
  - repo-backed sections
  - `Imports`
- the right content column should be mode-based:
  - grid mode for section browse
  - item-page mode for one selected entry
- `Imports` should not remain visible as a separate peer panel once it becomes a browse section
- the item page should read like a store-style destination page rather than a narrow side detail panel
- the item page should include a clear path back to the catalog grid
- the phase should keep preview behavior honest:
  - no auto-preview on grid render
  - no hidden preview runtime work beyond the visible layout cleanup
- the phase may use one explicit user action such as `Open Item Page` or direct card navigation, but the end state must make the item page replace the content area instead of competing beside it

### Phase 8.1 Implementation Spec
#### Exact First Code Cut

1. Rework the shipped Phase 8 shell from a 3-plus-region dashboard-style layout into a 2-column browse-plus-content layout.
2. Keep the left column as the browse owner for:
   - sections or filters
   - `All`
   - repo-backed sections
   - `Imports`
3. Remove the separate peer `Imports` panel and make imported entries browse through the shared content area when the `Imports` section is active.
4. Make the right column the only content area.
5. In content-area grid mode, render the card grid for the active browse section.
6. In content-area item-page mode, render one full selected-item page that replaces the grid.
7. Give the item page one explicit return-to-catalog affordance so the browse loop reads cleanly.
8. Keep the no-auto-preview rule honest while the layout changes.
9. Stop before real preview runtime, real loader behavior, or search-scale widening lands.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- likely extracted browse or content-mode helpers under `src/app/catalog/ui/`
- `src/app/workspace/CatalogSurface.tsx` only if the shell host props need to widen slightly
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx` only if one narrow expectation needs follow-through
- `src/app/theme/surfaces/catalog.css`

#### No-Widening Rule

- do not reopen `catalogSource.ts` ownership unless the live browse-section read truly requires a narrow selector helper
- do not add real preview media rendering here
- do not widen into real asset-load or apply behavior
- do not keep the old separate `Imports` peer panel alive behind feature drift
- do not treat a narrow layout cleanup as a reason to reopen future search or sort work

#### Implementation Risks

- leaving the item page half-attached to the grid so the shell still feels like 3 columns in practice
- moving `Imports` into browse visually while still preserving a second hidden imports panel path
- making the item page feel like a side drawer instead of a destination page
- collapsing to 2 columns without giving the user a clear return path back to the grid
- widening a layout cleanup phase into loader, preview, or source-contract work

#### Checklist

- [x] collapse the shell to a 2-column browse-plus-content layout
- [x] move `Imports` into the browse-area section list
- [x] remove the separate peer imports panel
- [x] make the content area swap between the card grid and one full item page
- [x] give the item page a clear return-to-catalog path
- [x] keep no-auto-preview behavior honest during the layout cleanup

#### Verification Shape

Minimum verification for this phase should cover:

- the shell reads as 2 columns instead of 3
- `Imports` is reachable through the browse-area section list rather than a separate peer panel
- selecting or opening an item page causes the content area to switch away from the grid into a full item page
- the item page provides a clear way back to the card grid
- the layout cleanup does not silently introduce auto-preview behavior

#### Done Shape

`Phase 8.1` is done when:

- `Catalog` reads as a 2-column browse-plus-content shell
- `Imports` behaves as one browse section instead of a peer panel
- the item page replaces the content area as a real store-style destination instead of competing as a third column

## [x] `Catalog-1 / Phase 8.2` - `Card Density And Overlap Cleanup`

### Phase 8.2 Summary
#### Purpose

Clean up the live card-grid readability now that the post-Phase-8.1 shell is visible: card text should read smaller and calmer, and the cards should stop visually overlapping under real content.

#### Owns

- tightening card typography inside the shared catalog grid
- reducing card crowding and overlap risk
- stabilizing card height or internal spacing so the grid reads cleanly with real copy

#### Does Not Own

- item-page layout changes
- preview runtime
- source-shape or contract work
- search, sort, or loader widening

#### Current Live Read

This phase is now shipped. The live owners are:

- `src/app/theme/surfaces/catalog.css`
  - now owns the tighter grid-card density contract
  - reduces card copy size for:
    - section labels
    - card titles
    - descriptions
    - metadata
    - action buttons
  - increases card separation by:
    - widening the grid minimum card width
    - increasing inter-card gap
    - tightening internal spacing without letting cards visually collide
  - hardens card containment with explicit box sizing, overflow handling, and start-aligned grid behavior so the card boxes stay visually separate
- the shared Catalog grid
  - now fits the current real card copy more calmly
  - no longer depends on crowded narrow cards that visually merge together at the current viewport widths
- `src/app/workspace/CatalogSurface.test.tsx`
  - continues to prove the shipped `Phase 8.1` browse/content behavior while this styling-only cleanup stays local to presentation

#### First Pass Decisions

- favor smaller card typography before widening the card footprint again
- preserve the current 2-column browse-plus-content shell read
- keep the fix local to the grid card presentation and spacing contract
- prioritize eliminating overlap before doing any broader visual styling pass

### Phase 8.2 Implementation Spec
#### Exact First Code Cut

1. Revisit the Catalog grid-card typography and spacing in the live shell.
2. Reduce the size or rhythm of the card label, description, metadata, and button stack where needed.
3. Adjust card min-height, internal gap, or grid sizing so cards no longer visually overlap under real copy.
4. Keep the current browse/content behavior unchanged while the card-density cleanup lands.
5. Stop before item-page, preview, source, or loader work widens.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/theme/surfaces/catalog.css`
- `src/app/workspace/CatalogSurface.test.tsx` only if one narrow class or behavior-proof follow-through is genuinely needed

#### No-Widening Rule

- do not reopen the 2-column shell decision
- do not widen into item-page cleanup here
- do not add new runtime behavior just to fix visual overlap
- do not turn a typography-and-spacing cleanup into a broader design rewrite

#### Implementation Risks

- shrinking text without actually resolving the overlap
- fixing one viewport width while leaving the grid unstable at nearby sizes
- increasing card height too aggressively and making the grid feel bloated
- widening a narrow density fix into unrelated shell cleanup

#### Checklist

- [x] reduce card text density enough to improve readability
- [x] remove visible overlap between neighboring cards
- [x] keep the grid stable under the current real card copy
- [x] preserve the shipped Phase 8.1 browse/content behavior

#### Verification Shape

Minimum verification for this phase should cover:

- card text is visibly calmer and smaller where needed
- neighboring cards no longer overlap
- the current card copy fits inside the grid without visual collisions
- the grid still behaves inside the Phase 8.1 shell without reopening layout mode questions

#### Done Shape

`Phase 8.2` is done when:

- the Catalog cards no longer overlap
- the card typography and spacing read calm enough for the current copy load

## [x] `Catalog-1 / Phase 9` - `Shell File Boundaries And Placeholder Wiring`

### Phase 9 Summary
#### Purpose

Keep the shipped Catalog shell implementation clean by splitting the current monolithic UI owner into focused files before real asset-family behavior arrives.

#### Owns

- clean file boundaries for the shipped shell
- the coordinator-versus-UI-owner split between `CatalogSurface` and the Catalog UI folder
- explicit UI ownership for browse, grid, item-page, and imports-through-browse seams

#### Does Not Own

- final real family content
- loader runtime
- search scale-up

#### Current Live Read

The placeholder-era read is now outdated. The real current risk is file sprawl inside one shipped shell owner:

- `src/app/workspace/CatalogSurface.tsx`
  - is already close to the right long-term read
  - acts as a thin workspace host that reads app state, derives the Catalog snapshot, and renders the UI shell
- `src/app/catalog/ui/CatalogShell.tsx`
  - now carries almost all visible Catalog UI responsibilities in one file, including:
    - browse rail section building and switching
    - shared content-mode switching
    - card-grid rendering
    - card selection highlight behavior
    - item-page rendering
    - imports-through-browse handling
  - this makes it the next honest cleanup target
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the visible shell behavior through the workspace host seam
  - gives Phase 9 a stable proof owner while the UI file boundaries are cleaned up

So the real Phase 9 job is no longer “placeholder wiring.” It is:
- keep `CatalogSurface` thin
- break the current `CatalogShell` into focused UI owners
- keep the shipped source-backed shell behavior intact while those boundaries become explicit

#### Implementation Result

This phase is now shipped. The live owners are:

- `src/app/workspace/CatalogSurface.tsx`
  - remains the thin workspace host
  - reads app state, derives the Catalog snapshot, and renders the shell without regaining UI-owner responsibilities
- `src/app/catalog/ui/CatalogShell.tsx`
  - now acts as the local shell coordinator only
  - keeps:
    - active section state
    - selected item state
    - content-mode switching
  - delegates visible UI ownership to focused Catalog UI files instead of rendering the whole shell inline
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
  - owns the browse rail section list and browse-rule copy
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - owns grid-mode rendering, empty-state rendering, card selection highlight behavior, and the imports-through-browse grid read
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
  - owns the item-page rendering, preview notice, metadata, and explicit action-area copy
- `src/app/catalog/ui/catalogShellShared.ts`
  - owns the shared section-option, section-label, action-label, and visible-items helpers used across the split shell owners
- `src/app/workspace/CatalogSurface.test.tsx`
  - continues to prove the shipped shell behavior through the workspace host seam while the UI file boundaries stay internal to the Catalog UI layer

#### First Pass Decisions

- `CatalogSurface` should remain a coordinator and should not regain UI-state or shell-layout responsibilities
- the next split should happen inside `src/app/catalog/ui/`, not by pushing shell logic back into `workspace/`
- the first extraction pass should likely separate:
  - browse rail or browse sections UI
  - grid mode or card-list UI
  - item-page mode UI
  - small shared card or action pieces only where they clearly reduce duplication
- the imports flow should keep reading as browse-owned, but it should stop being just another special case embedded in the top-level shell file
- the phase should preserve the current source-backed contract and visible behavior while only improving file ownership

### Phase 9 Implementation Spec
#### Exact First Code Cut

1. Keep `CatalogSurface.tsx` as the thin workspace host that derives and passes the Catalog snapshot.
2. Split the current `CatalogShell.tsx` responsibilities into focused UI owners under `src/app/catalog/ui/`.
3. Give browse-rail, grid-mode, and item-page-mode UI one clearer ownership boundary.
4. Give the imports-through-browse path one explicit UI owner inside that split instead of leaving it as a top-level special case.
5. Keep the current Phase 8.1 and 8.2 behavior intact while the file split lands.
6. Stop before any real family-specific load behavior, preview runtime, or search-scale widening is added.

#### Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- `src/app/catalog/ui/CatalogShell.tsx`
- likely new focused UI files under `src/app/catalog/ui/`, such as:
  - browse rail owner
  - grid mode owner
  - item-page owner
  - small card or action helpers where justified
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/catalogSource.ts` only if a narrow selector helper is genuinely needed during the split

#### No-Widening Rule

- do not push shell logic back into `CatalogSurface`
- do not bypass the source seam with local fake objects or UI-local seed arrays
- do not add real family loaders in this phase
- do not let imports-through-browse behavior dissolve into an unnamed special case again
- do not turn a file-boundary cleanup into broader layout redesign

#### Implementation Risks

- leaving `CatalogShell.tsx` as the next monolith even after the prep phase recognized the problem
- extracting too aggressively and creating low-value tiny files with unclear ownership
- letting imports-through-browse get lost between browse and grid owners
- reintroducing UI-state logic into `CatalogSurface`
- widening a structural cleanup into preview, loader, or search behavior changes

#### Checklist

- [x] keep `CatalogSurface` as a thin workspace host
- [x] split the shipped shell into focused UI owners
- [x] give imports-through-browse one explicit UI owner inside the shared shell
- [x] preserve the current source-backed shell behavior while the file boundaries improve

#### Verification Shape

Minimum verification for this phase should cover:

- the shipped shell behavior still passes through the workspace host after the UI split
- the file boundaries are cleaner without bypassing the Catalog source seam
- imports-through-browse still works and now has an explicit UI owner
- `CatalogSurface` remains a coordinator instead of becoming a second shell owner

#### Done Shape

`Phase 9` is done when:

- the shipped shell can live through focused files instead of one overloaded `CatalogShell.tsx`
- `CatalogSurface` stays thin
- imports-through-browse has an explicit structural home inside the Catalog UI layer

## [x] `Catalog-1 / Phase 10` - `Preview And Loader Boundary By Asset Type`

### Phase 10 Summary
#### Purpose

Lock the first honest preview-versus-commit and asset-type loader split so references and `HDRIs` do not pretend to share one fake universal apply path.

#### Owns

- temporary preview versus explicit commit contract
- multiple temporary preview allowance by contract
- empty in-card preview-box loading for the browse grid
- multi-select preview loading into more than one card box
- a Catalog-owned preview-loaded session list plus unload controls
- restore-on-reopen for that preview-loaded list during the running session
- reference loading versus `HDRI` apply separation
- honest action-language boundaries

#### Does Not Own

- final family-specific reference loaders
- final `HDRI` runtime
- project recall after load

#### Current Live Read

The current foundation read now has real live seams, but the action boundary is still only implied:

- `src/app/workspace/CatalogSurface.tsx`
  - already receives `surfaceInstanceId`
  - already owns the narrow handoff from workspace host concerns into the Catalog UI layer
  - is the clearest nearby seam for keeping preview-session state tied to one retained Catalog surface instance instead of leaking it into project truth
- `src/app/catalog/ui/CatalogShell.tsx`
  - already owns local Catalog coordination for:
    - active section
    - selected item
    - grid versus item-page mode
  - is the clearest nearby place to widen single-card selection into local Catalog multi-select without touching broader workspace-selection systems
- `src/app/catalog/catalogItemContract.ts`
  - already owns the explicit `CatalogItemActionKind` union:
    - `load-preview`
    - `add-to-project`
    - `apply-environment`
  - already owns the explicit `CatalogItemAssetKind` split between:
    - `reference-asset`
    - `environment`
  - gives Phase 10 one honest contract root to build on instead of inventing new UI-only action strings
- `src/app/catalog/catalogSeedItems.ts`
  - currently seeds repo-backed Catalog entries as:
    - `assetKind: 'reference-asset'`
    - `actionKind: 'add-to-project'`
  - proves the current curated baseline already expects explicit commit semantics for repo-backed reference entries
- `src/app/catalog/catalogSource.ts`
  - currently normalizes imports-area reuse entries as:
    - `assetKind: 'reference-asset'`
    - `actionKind: 'load-preview'`
  - makes imports reuse the clearest live proof that preview-only behavior already exists in the source contract
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
  - currently renders the action area directly from inline item checks and label helpers
  - still decides the visible button stack locally by mixing:
    - `resolveCatalogPrimaryActionLabel(item)`
    - `isCatalogItemImportsEntry(item)`
    - direct `item.actionKind !== 'load-preview'` checks
  - has no dedicated action-routing or adapter seam yet, so the loader boundary still lives as UI-local branching
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - already owns the live browse-grid card rendering
  - is the clearest nearby UI seam where empty preview boxes and explicit in-card preview triggers will need to land
  - does not yet own any preview-loaded session state, restore behavior, or unload controls
- `src/app/store/useAppStore.ts`
  - already owns the live `referenceWorkspace` runtime, imported reference records, and `referenceLoadBatch` state
  - is the most honest nearby downstream owner family once reference preview or commit behavior stops being placeholder-only

So the real current risk is no longer vague action wording. It is:
- the surface host already knows the Catalog `surfaceInstanceId`, but Phase 10 still has no explicit place to keep one preview session tied to that surface
- the shell coordinator still only knows one `selectedItemId`, so the newer multi-card preview direction has no local owner yet
- the contract already knows distinct action kinds
- the item page already shows distinct action copy
- the grid still has no explicit preview-box or preview-session seam
- and no Catalog-owned action-routing seam exists yet to keep preview, commit, and later environment apply from collapsing back into UI-local special cases

#### Implementation Result

This phase is now shipped. The live owners are:

- `src/app/catalog/catalogPreviewSession.ts`
  - owns the temporary Catalog preview-session state
  - keeps preview-loaded item ids keyed by one `surfaceInstanceId`
  - supports load, unload, unload-all, restore, and local multi-target resolution without claiming project ownership
- `src/app/catalog/catalogActionPlan.ts`
  - owns the first explicit Catalog action-routing seam
  - keeps reference preview, reference commit, and environment apply categories explicit enough that later families do not need to re-derive them from UI copy
- `src/app/workspace/CatalogSurface.tsx`
  - remains the thin workspace host
  - reads the per-surface preview session, sanitizes it against the live Catalog snapshot, and passes that state into the Catalog UI layer without moving it into app-store project truth
- `src/app/catalog/ui/CatalogShell.tsx`
  - now coordinates:
    - local selected item
    - local multi-select preview targeting
    - shared preview-session list rendering
    - preview load and unload actions
  - keeps one focused item-page selection while allowing preview to target more than one selected card
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - now owns empty in-card preview boxes
  - loads preview into card boxes only on explicit user action
  - reflects loaded preview state per card without implying commit
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
  - now consumes the explicit action plan instead of branching action meaning inline
  - keeps `Load Preview` temporary and shows when it will target more than one selected card
- `src/app/workspace/CatalogSurface.test.tsx`
  - now proves:
    - empty preview-box baseline
    - card-box preview loading
    - local multi-card preview loading
    - retained-surface preview-session restore
- focused pure proof under `src/app/catalog/`
  - locks the preview-session behavior and the first action-routing split for repo-backed reference entries, imports reuse entries, and environment-style fixture entries

#### First Pass Decisions

- the first implementation cut should start from `CatalogItemRecord.actionKind`, not from button-label copy or `CatalogShellItemPage.tsx` conditionals
- the next seam should be one Catalog-owned action-routing plus preview-session module under `src/app/catalog/`, not a wider store rewrite
- the preview session should be keyed by `surfaceInstanceId` and consumed through `CatalogSurface.tsx`, so closing and reopening the same retained Catalog surface restores its temporary preview state without claiming project ownership
- the first multi-select pass should stay local to `CatalogShell.tsx` and the card grid instead of widening into shared workspace-selection semantics
- repo-backed reference entries and imports-area reuse entries should both route through the same explicit action-plan seam even though their visible actions differ today
- multiple temporary previews should be locked as allowed baseline behavior in the action contract, not left as vague later polish
- empty card preview boxes should be treated as lightweight default browse UI, not as evidence that previews are already loaded
- the running-session preview-loaded list should stay Catalog-owned temporary state instead of being folded into Browser/project truth
- the first preview-loaded list view should live inside the shared Catalog content area, not as a new pane, overlay, or Browser-adjacent owner
- `HDRI` apply should stay a separate adapter family even if no live environment seed items need to ship in this phase
- the first pass should be allowed to use focused test fixtures for `apply-environment` behavior rather than forcing real `HDRI` onboarding early

### Phase 10 Implementation Spec
#### Exact First Code Cut

1. Add one Catalog-owned preview-session seam under `src/app/catalog/` that tracks which catalog items are currently preview-loaded for one `surfaceInstanceId` without turning them into project truth.
2. Widen the `CatalogSurface.tsx` to `CatalogShell.tsx` handoff just enough that the shell can read and update that preview session while keeping `CatalogSurface` the thin workspace host.
3. Add one Catalog-owned action-routing seam under `src/app/catalog/` that accepts a `CatalogItemRecord` and returns the explicit action-family read for that item.
4. Make those seams own the first honest split between:
   - temporary preview behavior
   - explicit commit behavior
   - in-card preview-box loading
   - local Catalog multi-select preview loading
   - preview-session restore and unload behavior
   - reference-style adapter routing
   - environment-style adapter routing
5. Widen `CatalogShell.tsx` from single-item selection into the smallest honest local multi-select coordinator needed for card preview loading while keeping one focused selected item for item-page navigation.
6. Make the grid render empty preview boxes by default and let the card preview box plus shared `Load Preview` path use the same preview-session seam.
7. Add the first preview-loaded list view plus unload controls inside the shared Catalog content area.
8. Move the current item-page button-stack decisions out of `CatalogShellItemPage.tsx` and onto that dedicated action seam so the item page and grid do not drift.
9. Lock the rule that multiple temporary previews are allowed by baseline contract, even if the first implementation still uses placeholder routing behind the scenes.
10. Prove that remounting or reopening the same retained Catalog surface instance restores its preview-loaded session during the running app session.
11. Keep real family-specific load runtime deferred while making the action categories explicit enough that later `Catalog-2` and `Catalog-3` do not need to reopen the same split.
12. Stop before full reference-family onboarding, final environment runtime, or project-recall behavior lands.

#### Likely Files

- likely new Catalog-owned action seam under `src/app/catalog/`, such as:
  - action-plan owner
  - action or adapter-family owner
- likely new Catalog-owned preview-session owner under `src/app/catalog/`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/catalogItemContract.ts` only if one narrow helper or supporting type belongs with the existing contract
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/ui/catalogShellShared.ts` only if shared label ownership should move beside the new action seam
- focused proof, likely under `src/app/catalog/`, for:
  - repo-backed reference entries
  - imports-area preview-only entries
  - preview-session list restore and unload behavior
  - multi-select preview loading through fixture coverage
  - environment-style action routing through fixture coverage

#### No-Widening Rule

- do not implement the full real reference-family or `HDRI` runtime here
- do not force live `HDRI` seed entries into the source just to prove the environment action family
- do not collapse temporary preview and explicit commit back into one universal action
- do not treat empty preview boxes as preloaded preview state
- do not move temporary preview-session truth into Browser or project state
- do not widen local Catalog multi-select into shared workspace-selection infrastructure
- do not introduce a new preview pane, overlay, or Browser-side list just to host the preview-loaded items
- do not leave the action boundary trapped inside `CatalogShellItemPage.tsx`
- do not bury viewer ownership inside reference-load helpers
- do not widen into downstream ownership proof that belongs to `Phase 11`

#### Implementation Risks

- postponing the split too long and letting later families guess at action meaning from UI labels
- extracting only label helpers while leaving the real action routing inside the item page
- treating multiple temporary previews as optional shell polish instead of baseline contract truth
- storing preview-loaded items as if they were committed project content
- promising restore-on-reopen without one explicit Catalog-owned preview-session seam
- forcing early environment runtime just to prove an action category that should first land as a seam
- rebuilding hidden ownership drift by keeping preview, commit, and apply categories vague

#### Checklist

- [x] lock `Load Preview` as temporary state
- [x] lock `Add To Project` as the explicit commit action
- [x] lock multiple temporary previews as allowed baseline behavior
- [x] add empty card preview boxes that stay unloaded until user action
- [x] let one preview action load more than one selected card preview
- [x] add a Catalog-owned preview-loaded session list with restore-on-reopen during the running session
- [x] add unload controls for preview-loaded items without affecting project truth
- [x] separate reference loading from `HDRI` environment apply
- [x] move item-page action routing onto an explicit Catalog-owned seam
- [x] define explicit file-boundary direction for the action adapters

#### Verification Shape

Minimum verification for this phase should cover:

- card preview boxes stay empty until the user explicitly loads preview state
- one preview action can load more than one locally selected card preview
- the preview-loaded list restores when the same retained `Catalog` surface instance closes and reopens during the running session
- unloading a preview-loaded item clears only temporary preview state
- repo-backed reference entries resolve to explicit commit-oriented action routing
- imports-area reuse entries resolve to explicit preview-oriented action routing
- environment-style fixture coverage resolves to explicit apply-oriented routing without masquerading as reference loading
- the item page consumes the new action seam instead of re-deriving the same split inline
- the action language is explicit enough that preview and commit are not ambiguous
- the loader categories are explicit enough that later `Catalog-2` and `Catalog-3` do not have to reopen the same split
- the contract allows multiple temporary previews without implying hidden commit behavior

#### Done Shape

`Phase 10` is done when:

- the first asset-type loader boundary is explicit
- the preview-versus-commit contract is explicit
- card preview boxes, local multi-select preview loading, preview-session restore, and unload controls are explicit temporary Catalog behavior
- the item page no longer owns the action-family split inline
- later catalog-family widening can build on real load categories instead of reopening this split

## [x] `Catalog-1 / Phase 10.1` - `Preview Session Rail Placement And Weight Reduction`

### Phase 10.1 Summary
#### Purpose

Move the preview-loaded session panel out of the main content area and into a lighter bottom-left Catalog slot under the browse rail so preview-session management stays available without making the grid and item-page surface feel heavier than the intended store-style browse read.

#### Owns

- preview-session panel placement inside the Catalog shell
- bottom-left under-browse positioning
- lighter visual treatment for the preview-loaded list
- keeping unload controls available in the lighter rail slot
- preserving the existing preview-session semantics while reducing shell weight

#### Does Not Own

- preview-session state ownership changes
- preview load or unload behavior changes
- new Browser ownership
- resizable side panels or new shell regions
- downstream commit or environment runtime

#### Current Live Read

`Phase 10` shipped the right preview-session ownership and action split, but the first list placement is still heavier than the intended Catalog browse read:

- `src/app/catalog/ui/CatalogShell.tsx`
  - currently renders the preview-loaded list in the shared content area above the grid or item page
  - keeps the preview-session semantics correct, but gives the content area an extra top block that competes with the main store-style browse surface
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
  - already owns the left browse column and is the most natural nearby UI owner for a secondary lightweight management surface
  - is the clearest place to host a compact preview-session summary under the browse sections without turning it into a new pane
- `src/app/theme/surfaces/catalog.css`
  - already owns the new preview-session styling from `Phase 10`
  - is the right place to reduce visual weight once the panel stops living in the main content area

So the next job is not a new preview feature. It is a shell-balance cleanup:
- move the preview-loaded list out of the content area
- place it at the bottom-left under the browse rail
- keep it light enough that the left column still reads as support chrome, not as a second competing content surface

#### Implementation Result

This phase is now shipped. The live owners are:

- `src/app/catalog/ui/CatalogShell.tsx`
  - no longer renders the preview-session panel at the top of the main content area
  - keeps the content area focused on the primary browse surfaces:
    - grid
    - item page
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
  - now hosts the preview-session panel at the bottom of the left browse rail
  - keeps the same preview-loaded item list and unload controls available from the lighter rail slot
- `src/app/theme/surfaces/catalog.css`
  - now gives the rail-hosted preview-session panel lighter spacing, lighter copy weight, and calmer action sizing so it reads as support chrome instead of a competing content block
- `src/app/workspace/CatalogSurface.test.tsx`
  - now proves the preview-session panel lives under the browse rail and no longer appears inside the main content area while the preview behavior itself stays intact

#### First Pass Decisions

- the preview-session state should stay where `Phase 10` put it; this follow-up is UI placement only
- the new home should be inside the existing left browse column, beneath the browse or browser-style section list
- the panel should read as a lightweight session summary, not as a full second content panel
- unload controls should remain available, but copy and framing should be calmer and shorter than the Phase 10 content-area version
- the content area should return to owning the main browse surfaces only:
  - grid
  - item page
- the first pass should avoid introducing a new split pane, overlay, footer dock, or Browser-owned side feature

### Phase 10.1 Implementation Spec
#### Exact First Code Cut

1. Move the preview-loaded panel rendering out of the main Catalog content area.
2. Add one lightweight preview-session slot at the bottom of the existing browse rail.
3. Pass the existing preview-loaded item list and unload handlers into that browse-rail owner without changing preview-session ownership.
4. Reduce the visual weight of the panel so it reads as compact session chrome rather than a headline content block.
5. Keep the same temporary preview semantics, restore behavior, and unload behavior that shipped in `Phase 10`.
6. Stop before any new preview-session features, new panel resizing rules, or shell-region redesign lands.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/theme/surfaces/catalog.css`
- `src/app/workspace/CatalogSurface.test.tsx` only if one focused shell-placement proof should move with the panel

#### No-Widening Rule

- do not reopen preview-session ownership or action routing
- do not move preview-session truth into Browser or project state
- do not add new preview behavior just because the panel moves
- do not create a new resizable pane, overlay, or footer region
- do not turn the left rail into a second heavy content column
- do not widen into broader shell redesign beyond this panel move and weight reduction

#### Implementation Risks

- moving the panel without reducing its visual weight, leaving the left column feeling crowded
- keeping too much explanatory copy and making the browse rail feel like a dashboard again
- reworking state ownership even though the remaining issue is mostly placement
- accidentally making the preview-session panel feel like Browser or project truth instead of temporary Catalog session state

#### Checklist

- [x] move the preview-loaded panel out of the main content area
- [x] place the preview-loaded panel at the bottom-left under the browse rail
- [x] keep the panel visually light
- [x] preserve unload controls in the lighter rail slot
- [x] preserve the shipped `Phase 10` preview-session semantics without widening scope

#### Verification Shape

Minimum verification for this phase should cover:

- the main Catalog content area no longer renders the preview-loaded panel at the top
- the left browse rail now hosts the preview-session panel under the browse section list
- preview-loaded items and unload actions still work from the new rail slot
- the preview-session state and restore behavior remain unchanged from `Phase 10`

#### Done Shape

`Phase 10.1` is done when:

- the preview-loaded panel sits at the bottom-left under the browse rail
- the panel reads as lightweight support chrome
- the content area is back to owning only the main browse surfaces
- the `Phase 10` preview-session behavior stays intact

## [x] `Catalog-1 / Phase 10.2` - `Card Selection And Open Gesture Cleanup`

### Phase 10.2 Summary
#### Purpose

Simplify Catalog card interaction so selection happens directly on the cards, multiple cards can be selected through card interaction instead of through a dedicated button, and double-click becomes the explicit gesture for opening the item page.

#### Owns

- direct multi-card selection behavior in the Catalog grid
- double-click card-open behavior for the item page
- retiring the `Add To Selection` card button
- cleaner separation between:
  - click to select
  - double-click to open

#### Does Not Own

- preview-session state changes
- preview load semantics
- item-page action routing
- new keyboard-shortcut systems
- broader workspace-selection infrastructure

#### Current Live Read

The current grid already has most of the selection foundation, but the interaction model is still split across too many gestures and controls:

- `src/app/catalog/ui/CatalogShell.tsx`
  - already owns the local selected-card set and the focused selected item
  - currently uses:
    - `handleSelectItem(...)` for one-card selection
    - `handleToggleItemSelection(...)` for widening or narrowing the local selected-card set
    - `handleOpenItemPage(...)` for explicit item-page navigation
  - is the clearest nearby coordinator for simplifying the interaction model without widening into workspace-level selection
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - already renders the card-level interaction surface
  - currently still uses:
    - card click for one-card selection
    - one dedicated `Add To Selection` button to widen selection
    - one dedicated `Open Item Page` button because double-click card-open behavior does not exist yet
  - still keeps the preview box separate with `event.stopPropagation()`, which is the right nearby boundary for preserving preview-box meaning during this cleanup
- `src/app/workspace/CatalogSurface.test.tsx`
  - currently proves:
    - one-card click selection
    - button-driven multi-select preview loading through `Add To Selection`
    - button-driven item-page open through `Open Item Page`
  - gives `Phase 10.2` one focused proof owner for retiring the old button path and replacing it with simpler card gestures

So the next issue is not selection ownership. It is interaction clarity:
- users should be able to select multiple cards directly from the cards themselves
- item-page open should move to a clearer card gesture
- the extra selection button should go away once the card interaction covers that job

#### Implementation Result

This phase is now shipped. The live owners are:

- `src/app/catalog/ui/CatalogShell.tsx`
  - keeps the local selected-item set and focused item-page owner
  - no longer needs a separate one-card select callback because direct card interaction now routes through the local selection-toggle seam
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - now treats the card surface itself as the multi-select interaction owner
  - adds double-click on the card as the item-page open gesture
  - keeps the preview box on its own stopped-propagation interaction path
  - no longer renders the `Add To Selection` button
- `src/app/workspace/CatalogSurface.test.tsx`
  - now proves:
    - direct multi-card selection from card clicks
    - double-click card-open behavior
    - local multi-card preview loading still working after the gesture cleanup

#### First Pass Decisions

- keep single-click as the baseline card-selection gesture
- keep the existing local selected-item set in `CatalogShell.tsx`; this phase should change gestures, not ownership
- add direct multi-select card interaction without inventing a new global selection system
- use double-click on the card as the explicit item-page open gesture
- retire the `Add To Selection` button once card interaction covers that role
- keep the preview box interaction separate so preview click still means preview, not selection or item-page open
- the first pass may keep one small explicit `Open Item Page` affordance only if it is still needed for accessibility or discoverability, but the main behavioral contract should move to double-click on the card itself
- keep this cleanup local to the Catalog grid and shell coordinator

### Phase 10.2 Implementation Spec
#### Exact First Code Cut

1. Rework the `CatalogShell.tsx` card-interaction callbacks so the grid can express both direct one-card selection and direct local multi-select through card gestures instead of a separate selection button.
2. Update `CatalogShellGridMode.tsx` so the card surface itself becomes the widening-selection interaction owner while preserving the preview-box event boundary.
3. Add double-click card interaction for item-page open.
4. Remove the dedicated `Add To Selection` button once direct card interaction covers that behavior.
5. Keep preview-box click behavior unchanged and independent from both selection and item-page open gestures.
6. Update the focused Catalog surface tests so they stop depending on the old button-based path and instead prove direct multi-card selection and double-click open.
7. Stop before adding broader keyboard-selection systems or workspace-shared selection semantics.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/theme/surfaces/catalog.css` only if the card interaction cleanup needs a small action-row or affordance adjustment
- `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not reopen preview-session ownership or action routing
- do not move Catalog selection into shared workspace-selection systems
- do not overload preview-box clicks with selection or open behavior
- do not keep the old selection button alive once direct card selection covers that role
- do not turn this into a broad gesture-system redesign beyond the Catalog grid

#### Implementation Risks

- making single-click and double-click compete in a way that causes accidental item-page opens
- removing the selection button without leaving a clear enough multi-select interaction path
- letting preview-box interaction conflict with the new card-open gesture
- leaving the tests anchored to the retired button path and masking the real user interaction change
- widening local Catalog card-selection behavior into unnecessary shared infrastructure

#### Checklist

- [x] allow multiple cards to be selected directly from the grid
- [x] make double-click on a card open the item page
- [x] remove the `Add To Selection` button
- [x] keep preview-box interaction separate from card selection and open gestures
- [x] keep the selection cleanup local to Catalog grid behavior

#### Verification Shape

Minimum verification for this phase should cover:

- more than one card can be selected through direct card interaction
- double-clicking a card opens the item page
- the dedicated `Add To Selection` button is gone
- preview-box click behavior still works independently of the card selection and open gestures
- the local multi-select preview behavior from `Phase 10` still works after the interaction cleanup

#### Done Shape

`Phase 10.2` is done when:

- multi-card selection is possible directly from card interaction
- double-click opens the item page
- the `Add To Selection` button is retired
- the Catalog card interaction model reads simpler than the current split-button version

## [x] `Catalog-1 / Phase 11.1` - `Reference Commit Handoff Proof`

### Phase 11.1 Summary
#### Purpose

Prove the first honest downstream handoff for committed reference-style Catalog results so `Add To Project` does not leave committed results trapped inside Catalog-local state or UI.

#### Owns

- committed reference-result handoff proof
- `browser-project` downstream-owner proof for reference-style Catalog items
- keeping committed reference truth outside Catalog-local session state

#### Does Not Own

- preview-session behavior changes
- imports pipeline ownership
- environment or `HDRI` apply ownership
- final recall or rebind semantics

#### Current Live Read

The shipped action seam already exposes the first downstream-owner read for reference items, but the runtime handoff is still only implied:

- `src/app/catalog/catalogActionPlan.ts`
  - already resolves reference-style Catalog items to `downstreamOwner: 'browser-project'`
  - already keeps `load-preview` temporary and `add-to-project` distinct, even though the commit path is still `planned`
- `src/app/workspace/CatalogSurface.tsx`
  - still only reads `referenceWorkspace` to build the Catalog imports snapshot and the per-surface preview session
  - does not yet own or prove any downstream commit handoff
- `src/app/store/useAppStore.ts`
  - already owns the nearby `referenceWorkspace` and `projectContent` runtime families where committed reference truth should actually land
- `src/app/catalog/catalogPreviewSession.ts`
  - already proves what Catalog-owned temporary preview state looks like, which makes the remaining committed-owner gap easier to isolate
- `src/app/workspace/CatalogSurface.test.tsx`
  - still proves the visible `Add To Project` item-page affordance
  - does not yet prove that the affordance hands off committed reference results into Browser or project-owned truth

So the next job is not defining a new owner name. It is proving the first real commit route for reference-style Catalog items so `Add To Project` stops being a planned label and becomes one explicit Browser or project downstream handoff instead of implied Catalog-local behavior.

#### First Pass Decisions

- keep this first ownership proof limited to committed reference-style results
- use the shipped `browser-project` action-plan direction as the explicit downstream target
- keep temporary preview-session state out of scope except where needed to show it is not the committed owner
- prefer the smallest first handoff seam that Catalog can call without turning `CatalogSurface` into a new project-content runtime owner

### Phase 11.1 Implementation Spec
#### Exact First Code Cut

1. Add one narrow Catalog-owned commit-routing seam under `src/app/catalog/` that takes a reference-style item plus its action plan and resolves the downstream `browser-project` handoff contract without touching preview-session state.
2. Wire the item-page `Add To Project` path through that seam only for reference-style items whose primary action is `add-to-project`, keeping `load-preview` and environment actions on their existing separate routes.
3. Add focused proof at the first honest Browser or project owner seam that committed reference results hand off out of Catalog and into downstream truth instead of remaining catalog-session state.

#### Likely Files

- likely `src/app/catalog/catalogActionPlan.ts` or one adjacent new `src/app/catalog/` helper that turns action-plan truth into a commit-routing contract
- likely `src/app/catalog/ui/CatalogShellItemPage.tsx` and `src/app/catalog/ui/CatalogShell.tsx` for the first real `Add To Project` dispatch path
- likely `src/app/store/useAppStore.ts` at the first honest Browser or project-content owner seam
- likely `src/app/workspace/CatalogSurface.test.tsx` plus one focused Catalog or store test for the downstream handoff proof

#### No-Widening Rule

- do not widen into imports ownership here
- do not widen into environment apply ownership here
- do not widen into final recall or rebind semantics

#### Implementation Risks

- calling the downstream reference owner “obvious” and never proving the handoff
- mixing reference commit proof with imports or environment proof and making the phase fuzzy

#### Checklist

- [x] make the reference-style `Add To Project` route explicit and testable
- [x] prove committed reference results hand off to Browser or project truth
- [x] prove committed reference results do not stay catalog-local
- [x] keep the proof separate from preview-session behavior

#### Verification Shape

Minimum verification for this phase should cover:

- a reference-style Catalog item with `add-to-project` resolves one explicit downstream Browser or project handoff
- a committed reference result does not stay catalog-local
- the downstream reference owner is explicit and testable

#### Done Shape

`Phase 11.1` is done when:

- the reference-style `Add To Project` route is explicit and testable
- the committed reference handoff is explicit and testable
- later Catalog widening no longer has to guess whether committed reference truth lives in Catalog

## [x] `Catalog-1 / Phase 11.2` - `Preview Session And Imports Boundary Proof`

### Phase 11.2 Summary
#### Purpose

Prove that the temporary preview-loaded session remains Catalog-only temporary state and that imports reuse entries still do not redefine the import pipeline owner.

#### Owns

- temporary preview-session non-ownership proof after commit semantics exist
- imports reuse versus import-pipeline boundary proof
- keeping Catalog preview-session state distinct from downstream committed truth

#### Does Not Own

- reference commit handoff itself
- environment apply ownership
- final import intake redesign

#### Current Live Read

Now that `Phase 11.1` shipped the first real Browser-project commit handoff, the two biggest remaining ambiguity risks are both "not the owner" boundaries:

- `src/app/catalog/catalogPreviewSession.ts`
  - still clearly owns only temporary per-surface preview-loaded item ids
  - still has no commit or project-content write path, which is the right shape
  - now needs focused proof that this state remains temporary even after repo-backed `Add To Project` exists
- `src/app/catalog/catalogSource.ts`
  - still reuses imported reference rows as Catalog browse entries through the same source seam
  - still keeps those reuse entries on `actionKind: 'load-preview'`, which is the right no-fake-commit read
  - now needs focused proof that this reuse does not move import-pipeline or downstream commit ownership into Catalog
- `src/app/workspace/CatalogSurface.tsx`
  - now proves the positive owner split more clearly:
    - preview state stays in the local preview-session owner
    - committed repo-backed references hand off through `addImportedReference(...)`
  - is the clearest nearby seam for proving that preview-session state and imports reuse stay separate from downstream committed truth
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the `Add To Project` handoff lands in downstream Browser/project-owned truth
  - already proves the preview session stays separate during that commit path
  - is the clearest nearby proof owner for the next negative-boundary assertions

So this phase should isolate the two “not the owner” proofs that are easy to blur together later if they stay implicit.

#### First Pass Decisions

- treat the preview-loaded session list as temporary Catalog state only
- treat imports-area reuse as browse reuse, not import-pipeline ownership transfer
- keep this phase focused on semantic boundaries, not on new import or preview features
- prefer proving the boundary at the existing Catalog surface and pure helper seams before adding any new runtime owner

### Phase 11.2 Implementation Spec
#### Exact First Code Cut

1. Add focused proof that the preview-loaded session list stays temporary Catalog state only even after the shipped repo-backed `Add To Project` handoff exists.
2. Add focused proof that imports reuse entries remain browse-only Catalog entries and do not redefine import-pipeline or downstream commit ownership.
3. Keep these proofs separate from the already-shipped reference commit handoff and from later environment apply ownership.

#### Likely Files

- `src/app/catalog/catalogPreviewSession.ts` only if one narrow helper or assertion is needed
- `src/app/catalog/catalogSource.ts` only if one narrow boundary helper or assertion is needed
- `src/app/workspace/CatalogSurface.test.tsx` for the first honest non-owner proof through the live Catalog shell
- focused tests at the preview-session and imports-boundary seams

#### No-Widening Rule

- do not widen into import intake redesign
- do not reopen preview-session UI or behavior
- do not reopen the shipped `Add To Project` routing
- do not mix this phase with environment ownership proof

#### Implementation Risks

- letting the preview-loaded list read like committed project truth
- letting imports reuse quietly redefine import-pipeline ownership
- accidentally widening imports reuse into a second commit path now that repo-backed commit exists
- mixing negative-boundary proof with broader runtime changes

#### Checklist

- [x] prove the preview-loaded session list stays temporary Catalog state even after repo-backed commit exists
- [x] prove imports-area reuse stays separate from the import pipeline
- [x] keep both boundaries explicit and testable

#### Verification Shape

Minimum verification for this phase should cover:

- the preview-loaded session list does not masquerade as committed project truth
- imports reuse entries do not gain a fake downstream commit path
- imports-area reuse does not redefine the import pipeline owner

#### Done Shape

`Phase 11.2` is done when:

- temporary preview-session ownership is explicit and testable
- imports reuse stays clearly separate from import-pipeline ownership

## [x] `Catalog-1 / Phase 11.3` - `Environment Apply Ownership Proof`

### Phase 11.3 Summary
#### Purpose

Prove that environment-style Catalog results hand off to the correct viewer or environment owner instead of masquerading as project geometry or reference content.

#### Owns

- environment apply downstream-owner proof
- `viewer-environment` downstream-owner proof for environment-style Catalog items
- keeping environment apply separate from reference geometry ownership

#### Does Not Own

- real `HDRI` runtime widening
- reference commit handoff
- imports boundary proof

#### Current Live Read

The shipped action seam already makes the environment split explicit, but the actual apply handoff is still missing:

- `src/app/catalog/catalogActionPlan.ts`
  - already resolves environment-style items to `downstreamOwner: 'viewer-environment'`
  - already keeps environment items off the temporary preview-session contract
- `src/app/workspace/CatalogSurface.tsx`
  - currently only wires repo-backed commit into `addImportedReference(...)`
  - still has no parallel environment-apply callback or adapter seam
- `src/app/store/uiPrefsStore.ts`
  - is the nearest live environment-state owner
  - already owns `view.envPreset` plus lighting state through explicit shared setters
- `src/app/components/ViewToolbar.tsx`
  - already reads and writes the shared environment owner through the visible viewer controls
- `src/app/components/ViewToolbar.test.tsx`
  - already proves the current environment controls route through the shared environment owner seam
- `src/app/workspace/CatalogSurface.test.tsx`
  - is the strongest nearby Catalog proof owner because `Phase 11.1` and `Phase 11.2` already use it to prove reference commit and non-owner boundaries

So the remaining job is one narrow handoff cut:
- add one explicit Catalog-owned environment-apply seam
- route environment-style item-page actions to the existing viewer-environment owner
- prove that path stays out of Browser/project geometry content and out of the temporary preview session

#### First Pass Decisions

- keep this phase narrow and proof-first
- target the existing shared environment owner instead of inventing a Catalog-local environment state
- allow focused fixture-based Catalog environment items if live repo seed entries are still intentionally deferred
- use the shipped `viewer-environment` downstream-owner direction as the explicit target
- stop at one honest preset-level or equivalent environment apply proof rather than widening into full `HDRI` family onboarding

### Phase 11.3 Implementation Spec
#### Exact First Code Cut

1. Add one narrow Catalog-owned environment-apply adapter seam under `src/app/catalog/` that accepts an environment-style `CatalogItemRecord` plus its resolved action plan and either returns one explicit viewer-environment apply request or `null`.
2. Widen `CatalogSurface.tsx` with one environment-apply callback that routes the request into the existing shared environment owner instead of Browser/project content.
3. Wire the item-page primary action through that seam only for `apply-environment` items, without reopening preview-session or reference commit behavior.
4. Add focused proof in the nearest Catalog surface and environment-owner tests that environment apply updates viewer-owned environment state and does not create imported references or project geometry content.

#### Likely Files

- likely new `src/app/catalog/catalogEnvironmentApply.ts`
- `src/app/workspace/CatalogSurface.tsx`
- nearby environment owner seam:
  - `src/app/store/uiPrefsStore.ts`
- focused proof:
  - `src/app/workspace/CatalogSurface.test.tsx`
  - `src/app/components/ViewToolbar.test.tsx` only if one owner-level assertion needs widening
  - dedicated Catalog helper test only if the new adapter seam needs one

#### No-Widening Rule

- do not force full `HDRI` runtime onboarding here
- do not reopen reference commit proof here
- do not invent a Catalog-owned environment session or Viewer-only duplicate state
- do not widen into later family-specific runtime just to prove owner naming

#### Implementation Risks

- routing environment apply back through Browser/project helpers because they already exist
- proving only action-plan naming while leaving the real owner handoff absent
- forcing too much real runtime just to prove a seam that should first land as a focused owner proof

#### Checklist

- [x] add one explicit Catalog-to-viewer environment apply seam
- [x] prove environment apply updates the shared viewer-environment owner instead of project geometry content
- [x] keep the environment owner split explicit and testable

#### Verification Shape

Minimum verification for this phase should cover:

- an environment-style Catalog item resolves through one explicit Catalog-to-viewer apply seam
- the shared environment owner updates through that seam
- no imported reference or project-geometry content is created by environment apply

#### Done Shape

`Phase 11.3` is done when:

- Catalog has one explicit environment-apply handoff seam
- the environment owner split is explicit and testable
- later Catalog environment-family widening no longer has to reopen the basic owner question

## [ ] `Catalog-1.12` - `Item Card Add To Project Action`

### Phase 1.12 Summary
#### Purpose

This follow-up branch exists to add one direct card-level `Add To Project` action after the shipped `Catalog-1 / Phase 11.1` commit-handoff seam proved the item-page path.

The goal is to make the grid more honest for repo-backed reference items that are already clearly committable without forcing the user to enter the item page first.

#### Owns

- one explicit `Add To Project` button on eligible Catalog item cards
- reuse of the already-shipped `browser-project` action-plan and reference-commit handoff seams
- focused grid-card proof that direct card commit still becomes downstream Browser/project truth

#### Does Not Own

- item-page action redesign
- preview-session ownership changes
- environment-apply or `HDRI` card-action widening
- multi-select commit batching beyond the one-card button being introduced here

### Phase 1.12 Implementation Spec
#### Current Source Doc

- [Catalog_Phase Catalog-1.12 - Item Card Add To Project Action.md](./Catalog_Phase%20Catalog-1.12%20-%20Item%20Card%20Add%20To%20Project%20Action.md)

#### Readiness Gate

Before implementation, refresh the source doc against the live Catalog grid, action-plan, and reference-commit files.

The worker should not implement `Catalog-1.12` until that source doc names:
- exact likely files
- focused tests
- verification shape
- done shape
- changelog and Doc-Log closeout requirements

## [x] `Catalog-1.13` - `Load All Displayed Preview-Capable Cards`

### Phase 1.13 Summary
#### Purpose

Add one explicit batch preview action that loads temporary previews for every currently displayed preview-capable Catalog card.

This is a Catalog foundation follow-up because it depends on the preview-session contract, visible grid state, filter state, and asset-type action boundaries already established by `Catalog-1`.

#### Owns

- one user-facing `Load All Displayed Previews` style action in the Catalog surface
- limiting the action to cards currently visible after filters/search are applied
- limiting the action to preview-capable cards only
- adding the targeted cards to the temporary Catalog preview-session state
- proof that hidden filtered-out cards, commit-only cards, and apply-environment entries are not accidentally loaded

#### Does Not Own

- committing reference items to Browser/project content
- applying HDRI/environment entries to the scene
- loading hidden filtered-out cards
- changing search or filter semantics
- redesigning the preview viewport itself
- multi-card `Add To Project` batching

#### Current Live Read

The shipped foundation and the new batch-preview control now share the same visible owner split:

- `src/app/catalog/catalogActionPlan.ts`
  - already distinguishes preview, commit, and environment apply action meanings
- `src/app/catalog/catalogPreviewSession.ts`
  - already owns temporary preview-loaded item ids
  - now also resolves the filtered visible preview targets for the grid batch action
- `src/app/catalog/ui/CatalogShell.tsx`
  - resolves the currently displayed preview-capable item ids from the filtered grid list
  - keeps the batch action on the existing temporary preview-session owner
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - owns the visible grid action placement for `Load All Displayed Previews`
- `src/app/catalog/ui/CatalogShell.test.tsx`
  - proves the user-facing action loads only the correct displayed cards

#### First Pass Decisions

- treat this as batch preview loading, not batch commit
- calculate the target set from the currently displayed grid/cards after filters and search
- skip cards whose action meaning is `Add To Project`, `Apply Environment`, or any other non-preview action
- preserve the existing preview-loaded list and unload controls instead of creating a second batch state owner

### Phase 1.13 Implementation Spec

#### Exact First Code Cut

1. Add a visible Catalog control for loading all currently displayed preview-capable cards.
2. Resolve the target ids from the filtered/displayed card collection, not from the full catalog source list.
3. Filter that target set to action kinds that are genuinely preview-loadable.
4. Add those ids to the existing Catalog preview-session owner.
5. Prove that hidden cards and non-preview actions are skipped.

#### Likely Files

- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/catalog/catalogActionPlan.ts`
- `src/app/catalog/catalogPreviewSession.ts`
- `src/app/catalog/ui/CatalogShell.test.tsx`

#### No-Widening Rule

- do not turn this into project commit batching
- do not apply HDRI/environment cards from this action
- do not bypass filters by using the full catalog source list
- do not create a second preview-session owner

#### Implementation Risks

- loading all catalog items instead of only the displayed filtered set
- loading cards that are not preview-capable
- making the action look like it commits project content
- duplicating preview-session state instead of reusing the existing owner

#### Checklist

- [x] a batch preview action is visible from the Catalog grid surface
- [x] the action loads every currently displayed preview-capable card
- [x] hidden filtered-out cards are skipped
- [x] HDRI apply-only or other non-preview cards are skipped
- [x] loaded previews appear in the existing preview-session list and can still be unloaded there

#### Verification Shape

Minimum verification for this phase should cover:

- displayed preview-capable cards load into the temporary preview session
- filtered-out preview-capable cards do not load
- non-preview cards do not load
- no project content is committed and no environment state is applied by this action

#### Done Shape

`Catalog-1.13` is done when:

- users have one clear batch action for loading all currently displayed preview-capable cards
- the action honors filters/search and asset-type action boundaries
- the result remains temporary Catalog preview-session state only

# Home-Page-6 - Control Deck Redesign And Catalog-Grounded Launch Rail

## Doc Header

### Doc History
5. 2026-04-20 01:03:18: Accepted `Home-Page-6 / Phase 4` after Kant added compact left-rail Docs and GitHub shortcuts from the existing Home Page URL exports, added one non-owning read-only Advanced status affordance, preserved startup/catalog launch/orientation/Storage Management/persistence/wipe behavior, and closed `Home-Page-6` with all HLG/CLG satisfied.
4. 2026-04-20 00:55:45: Accepted `Home-Page-6 / Phase 3` after Kant landed Storage Management with preserved buckets, owner seams, policy controls, selected-key wipe behavior, origin/storage notes, internal row scrolling, and a read-only details affordance; closed the storage and preservation HLG/CLG while keeping the left-rail docs/help/debug HLG open for `Home-Page-6 / Phase 4`.
3. 2026-04-20 00:48:29: Accepted `Home-Page-6 / Phase 2` after Kant landed the compact orientation quick-start/status card, preserved GitHub/Docs/version/what's-new from the existing orientation seam, added a non-owning `Get Started with ParaHook` affordance, kept storage and launch behavior unchanged, and prepared `Home-Page-6 / Phase 3` as the Storage Management rename/detail slice.
2. 2026-04-20 00:39:58: Accepted `Home-Page-6 / Phase 1` after Kant landed the control-deck shell, left rail, catalog-grounded launch labels, mockup-label exclusion, behavior-preservation proof, focused tests, and build gate; prepared `Home-Page-6 / Phase 2` as the compact orientation quick-start/status card slice.
1. 2026-04-20 00:29:50: Created the `Home-Page-6` Family Phase Doc from Dispatch 3a Intake 3 so the Home Page mockup redesign routes through Home Page Generation 1 with preserved HLG, new CLG, verified catalog labels, and a first Worker-ready implementation phase instead of becoming a separate redesign lane.

### Purpose

This file turns the Home Page mockup redesign intake into a Home Page Generation 1 family phase.

Use it to answer:
- how the polished control-deck mockup should route into existing Home Page Gen 1
- which mockup labels are verified against the live workspace surface catalog
- which implementation phase Kant should take first
- how the redesign preserves existing startup, launch, persistence, wipe, and storage behavior

Do not use it for:
- adding new workspace surface kinds
- inventing Docker, Scratchpad, or Hotspot catalog entries
- moving storage or graph truth into Home Page
- changing runtime behavior without a Worker handoff and build gate

## Doc Body

### Why This Phase Exists

Dispatch 3a Intake 3 captured a Home Page mockup that wants the existing functional Home Page work to feel like a polished ParaHook workspace landing surface and control deck.

The already shipped Home Page Gen 1 phases made the surface real, added startup behavior, launch actions, storage transparency, persistence toggles, graph browser-storage policy, recent-items policy, and lightweight orientation.

This phase is a Gen 1 continuation because it reshapes those existing Gen 1 outcomes into the intended landing/control surface without changing the family owner or creating a separate redesign lane.

### Current Live Read

Live code seams checked before this phase was written:
- `src/app/workspace/HomePageSurface.tsx`
  - already renders startup surface control, catalog-generated launch buttons, orientation links/version/what's-new, storage rows, toggles, wipe buttons, and origin-storage estimate
  - launch buttons come from `getWorkspaceSurfaceCatalogEntries()` filtered to exclude `homePage`
  - button labels are derived from catalog `defaultLabel` values, trimming ` Viewport` for non-model surfaces
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - current surface kinds are `modelViewer`, `browser`, `catalog`, `console`, `spaghettiEditor`, `dashboard`, `notepad`, and `homePage`
  - current launch labels resolve to `Model Viewport`, `Browser`, `Catalog`, `Console`, `Spaghetti Editor`, `Dashboard`, and `Notepad`
- `src/app/workspace/homePageStorageTransparency.ts`
  - current storage buckets are workspace layout, UI preferences, Dashboard widgets, Notepad notes, graph working set, and recent items
- `src/app/theme/foundation/base.css`
  - current Home Page styles already include startup, launch, orientation, storage rows, dark scrollbars, row alignment, and responsive one-column fallback

Mockup label verification:
- `Browser` maps to current catalog kind `browser`
- `Console` maps to current catalog kind `console`
- `Docker` is not a current `WorkspaceSurfaceKind` or catalog label
- `Scratchpad` is not a current `WorkspaceSurfaceKind` or catalog label; `Notepad` is the current notes surface
- `Hotspot` is not a current `WorkspaceSurfaceKind` or catalog label

### Phase Boundary Rules

This family phase owns the Home Page control-deck reshape only.

It must preserve:
- startup preference restore behavior
- catalog-driven Open Viewport actions
- storage policy toggles
- storage wipe buttons
- file-size alignment
- dark-mode scrollbar styling
- monitor-height usability
- Home Page as a workspace surface, not a route or second Browser

It must not:
- add unverified mockup labels as launch buttons
- create new catalog entries for Docker, Scratchpad, or Hotspot
- move persistence semantics into Home Page
- change storage owner seams
- change graph, recent-items, Browser, Catalog, Console, Notepad, Dashboard, or viewer ownership

## Vision

`Home-Page-6` should make the already functional Home Page read as a compact ParaHook landing/control deck.

The user should still see the same real controls and truths, but arranged with stronger visual hierarchy:
- left rail for identity, startup surface, catalog-grounded Open Viewport actions, docs/help shortcuts, and advanced/debug affordances
- main quick-start/orientation card with repo/docs/version/what's-new and a compact intro/media affordance
- main Storage Management card with aligned bucket rows and internal row scrolling

## Wishlist Organization

### High Level Goals

- [x] `Home-Page-Gen1-HLG-15. Home Page Generation 1 should evolve into a polished workspace landing and control surface rather than remain a plain settings page.`
- [x] `Home-Page-Gen1-HLG-16. Home Page should use a left rail for startup-surface selection, viewport launching, docs/help shortcuts, and debug controls.`
- [x] `Home-Page-Gen1-HLG-17. Open Viewport controls should be generated from canonical workspace surface data where possible and stay current as surfaces are added.`
- [x] `Home-Page-Gen1-HLG-18. Orientation content should become a compact status and quick-start card with docs, GitHub, version, what's-new, and intro/media affordances.`
- [x] `Home-Page-Gen1-HLG-19. Storage transparency should become Storage Management with aligned toggle, wipe, size, detail, and internally scrollable row behavior.`
- [x] `Home-Page-Gen1-HLG-20. The redesign must preserve existing functional Home Page Generation 1 behavior, including startup restore, persistence toggles, storage wipe, canonical viewport launch, dark-mode styling, and monitor-height fit.`
- [x] `Home-Page-Gen1-HLG-21. Spec must verify which mockup labels are current surfaces versus future placeholders before any implementation phase is written.`

### Codex Level Goals

- [x] Home-Page-Gen1-CLG-14. Reshape the existing Home Page into a control-deck layout while preserving its existing startup, launch, orientation, and storage behavior.
- [x] Home-Page-Gen1-CLG-15. Move startup surface choice, catalog-grounded Open Viewport actions, docs/help shortcuts, and advanced/debug affordances into a left rail without changing their owners.
- [x] Home-Page-Gen1-CLG-16. Keep Open Viewport actions generated from the canonical workspace surface catalog and exclude mockup-only labels unless a later phase adds real catalog entries.
- [x] Home-Page-Gen1-CLG-17. Reframe the orientation area as a compact quick-start/status card with GitHub, Docs, version, what's-new, and intro/media affordances without becoming a docs or release-notes owner.
- [x] Home-Page-Gen1-CLG-18. Reframe Storage Transparency as Storage Management with stable row columns for bucket identity, source key, persistence controls, wipe, size, and future details while preserving owner seams.
- [x] Home-Page-Gen1-CLG-19. Preserve monitor-height fit through internal storage-row scrolling and responsive wrapping without clipping Home Page content.
- [x] Home-Page-Gen1-CLG-20. Record verified current catalog mappings before Worker implementation and defer Docker, Scratchpad, and Hotspot as unverified placeholders.

### `Home-Page-6 / Phase 1`

- [x] Turn the current Home Page panel into a control-deck shell with a left rail and main content region.
- [x] Keep the startup surface control in the left rail and preserve the existing `workspaceStartupSurface` behavior.
- [x] Keep Open Viewport buttons generated from the workspace surface catalog.
- [x] Use only verified launch labels in this phase: `Model Viewport`, `Browser`, `Catalog`, `Console`, `Spaghetti Editor`, `Dashboard`, and `Notepad`.
- [x] Keep Docker, Scratchpad, and Hotspot out of the launch rail unless a later approved phase creates real catalog entries or maps them to existing surfaces.
- [x] Preserve GitHub and Docs shortcuts in the left rail or orientation card without becoming a docs dashboard.
- [x] Preserve existing storage rows, toggles, wipe buttons, size text, owner seam labels, and dark scrollbars.
- [ ] `Home-Page-Gen1-HLG-15`
- [ ] `Home-Page-Gen1-HLG-16`
- [x] `Home-Page-Gen1-HLG-17`
- [ ] `Home-Page-Gen1-HLG-20`
- [x] `Home-Page-Gen1-HLG-21`
- [x] `Home-Page-Gen1-CLG-14`
- [ ] `Home-Page-Gen1-CLG-15`
- [x] `Home-Page-Gen1-CLG-16`
- [ ] `Home-Page-Gen1-CLG-19`
- [x] `Home-Page-Gen1-CLG-20`

### `Home-Page-6 / Phase 2`

- [x] Reframe Orientation into a compact quick-start/status card.
- [x] Add a non-owning intro/media affordance such as `Get Started with ParaHook` without adding a full docs or release-notes system.
- [x] Keep GitHub, Docs, version, and what's-new lightweight.
- [x] `Home-Page-Gen1-HLG-18`
- [ ] `Home-Page-Gen1-HLG-20`
- [x] `Home-Page-Gen1-CLG-17`

### `Home-Page-6 / Phase 3`

- [x] Rename or reshape Storage Transparency into Storage Management.
- [x] Preserve the existing bucket inventory and owner seam text.
- [x] Add or reserve a details affordance only if it stays non-owning and does not invent new storage semantics.
- [x] Keep row scrolling internal to the storage rows, with title and copy outside the scroll region.
- [x] `Home-Page-Gen1-HLG-19`
- [x] `Home-Page-Gen1-HLG-20`
- [x] `Home-Page-Gen1-CLG-18`
- [x] `Home-Page-Gen1-CLG-19`

### `Home-Page-6 / Phase 4`

- [x] Add a tiny left-rail docs/help shortcut group and debug/advanced affordance without creating new owners.
- [x] Keep the startup surface control and catalog launch rail unchanged.
- [x] Keep GitHub/Docs URL ownership in `homePageOrientation.ts` or an equally narrow Home Page orientation/helper seam.
- [x] Keep debug/advanced affordance non-owning, read-only, and clearly scoped to existing Home Page status/debug entry points.
- [x] `Home-Page-Gen1-HLG-16`
- [x] `Home-Page-Gen1-CLG-15`

## [x] `Home-Page-6 / Phase 1` - `Control Deck Shell And Catalog-Grounded Launch Rail`

### Phase 1 Summary

#### Purpose

Reshape the current Home Page into the first control-deck layout slice while preserving the behavior that earlier Home Page Gen 1 phases already shipped.

This phase advances `Home-Page-Gen1-HLG-15`, `Home-Page-Gen1-HLG-16`, `Home-Page-Gen1-HLG-17`, `Home-Page-Gen1-HLG-20`, `Home-Page-Gen1-HLG-21`, `Home-Page-Gen1-CLG-14`, `Home-Page-Gen1-CLG-15`, `Home-Page-Gen1-CLG-16`, `Home-Page-Gen1-CLG-19`, and `Home-Page-Gen1-CLG-20`.

#### Owns

- Home Page layout shell split into a left rail and main content region
- Home Page identity treatment in the left rail
- startup surface control placement in the left rail
- Open Viewport launch group placement in the left rail
- catalog-grounded launch labels based on current `workspaceSurfaceCatalog.ts`
- preserving existing Home Page behavior while the visual hierarchy changes
- focused Home Page tests that prove existing launch and preference behavior still works

#### Does Not Own

- adding new workspace surfaces
- adding Docker, Scratchpad, or Hotspot launch buttons
- changing storage bucket owner seams
- changing persistence policy semantics
- changing graph, recent-items, Browser, Catalog, Console, Dashboard, Notepad, or viewer ownership
- Phase 2 orientation/media expansion
- Phase 3 Storage Management rename/detail affordances

#### Current Live Read

- `HomePageSurface.tsx` already reads `workspaceStartupSurface`, writes `setWorkspaceStartupSurface`, renders catalog-driven launch buttons, and renders storage policy controls.
- `workspaceSurfaceCatalog.ts` currently verifies `browser` and `console`; it does not contain Docker, Scratchpad, or Hotspot.
- `HomePageSurface.test.tsx` already proves launch labels and callback kinds for `Model Viewport`, `Browser`, `Catalog`, `Console`, `Spaghetti Editor`, `Dashboard`, and `Notepad`.
- `base.css` already contains Home Page dark-mode layout, scrollbars, row columns, and responsive fallback rules that the redesign should adapt rather than replace wholesale.

#### First Pass Decisions

1. Keep Open Viewport entries catalog-driven from `getWorkspaceSurfaceCatalogEntries()` and keep `homePage` excluded from launch actions.
2. Keep verified launch labels only: `Model Viewport`, `Browser`, `Catalog`, `Console`, `Spaghetti Editor`, `Dashboard`, and `Notepad`.
3. Treat Docker, Scratchpad, and Hotspot as mockup-only placeholders for this phase.
4. Move existing controls into a stronger left-rail/main-region hierarchy before adding new orientation or storage detail behavior.
5. Preserve the existing behavior tests and add assertions only where the layout contract needs proof.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. In `HomePageSurface.tsx`, introduce a control-deck structure inside the existing `HomePageSurfacePanel`:
   - a left rail containing the Home Page identity, startup surface control, Open Viewport launch group, GitHub/Docs shortcuts if the layout needs them there, and a non-invasive advanced/debug placeholder only if it does not add behavior
   - a main content region containing the existing orientation strip/card and storage section
2. Keep the existing state reads, setters, launch callback, storage bucket reads, policy toggles, and wipe function intact.
3. Keep launch button data sourced from `homePageLaunchSurfaceEntries`; do not hard-code mockup-only labels.
4. Update `base.css` Home Page styles to support the left rail/main region, compact dark control-deck hierarchy, responsive collapse, internal storage-list scrolling, and existing dark scrollbar treatment.
5. Update `HomePageSurface.test.tsx` to prove:
   - the left rail exists
   - startup preference toggling still persists
   - Open Viewport buttons still match the verified catalog labels and callback kinds
   - Docker, Scratchpad, and Hotspot do not appear as launch buttons in this phase
   - storage rows, toggles, wipe buttons, and size text remain present

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- optional: `src/app/workspace/workspaceSurfaceCatalog.test.ts` only if the Worker needs to pin catalog label behavior

#### No-Widening Rule

- Do not add new surface kinds.
- Do not add Docker, Scratchpad, or Hotspot as launch buttons.
- Do not replace catalog-driven Open Viewport behavior with a hard-coded mockup list.
- Do not change storage persistence semantics or owner seams.
- Do not change startup restore logic outside the Home Page surface placement and tests needed for this phase.
- Do not implement Phase 2 orientation/media expansion or Phase 3 Storage Management detail behavior.

#### Implementation Risks

- The redesign can accidentally turn catalog-driven launch actions into hard-coded labels.
- Moving controls can break accessible labels or existing tests for startup and storage behavior.
- Adding decorative structure can cause monitor-height overflow if storage rows do not keep internal scrolling.
- GitHub/Docs links can become duplicated or too prominent if Phase 1 tries to solve all orientation work.

#### Checklist

- [x] Home Page has a left rail and main content region.
- [x] Startup surface preference control remains wired to `workspaceStartupSurface`.
- [x] Open Viewport buttons still come from current catalog entries.
- [x] Verified launch labels are preserved.
- [x] Docker, Scratchpad, and Hotspot are absent from launch buttons.
- [x] Storage rows, toggles, wipe buttons, size text, and owner seam text still render.
- [x] Responsive layout keeps content reachable without clipping.
- [x] Existing Home Page behavior tests are updated, not weakened.

#### Verification Shape

- `npm run test -- src/app/workspace/HomePageSurface.test.tsx src/app/workspace/workspaceSurfaceCatalog.test.ts`
- `npm run build`

#### Done Shape

Kant can report this phase complete when Home Page visibly has the control-deck shell and catalog-grounded launch rail, the previous startup/launch/storage behavior remains intact, mockup-only labels are excluded, focused tests pass, and `npm run build` passes.

#### Phase 1 Closeout

Coverage classification: `complete` for the assigned Phase 1 slice.

Kant landed the control-deck shell with a left rail and main content region, moved identity/startup/Open Viewport controls into the rail, preserved existing orientation and storage behavior in the main region, kept launch actions catalog-generated, excluded Docker/Scratchpad/Hotspot, and preserved the existing storage controls and monitor-height behavior.

Verification accepted from Worker:
- `npm.cmd run test -- src/app/workspace/HomePageSurface.test.tsx src/app/workspace/workspaceSurfaceCatalog.test.ts` passed: 2 files, 13 tests.
- `npm.cmd run build` passed with existing Vite warnings.

Tracking accepted:
- `docs/CHANGELOG.md` entry `[1574]` records the shipped runtime behavior.

Residual open coverage:
- `Home-Page-Gen1-HLG-15` remains open until the compact orientation and Storage Management slices land.
- `Home-Page-Gen1-HLG-16` remains partial because Phase 1 landed the left rail for identity/startup/launch while broader docs/help/debug refinement can continue through Phase 2 or a later slice.
- `Home-Page-Gen1-HLG-20` remains open as the behavior-preservation rail across all `Home-Page-6` slices.
- `Home-Page-Gen1-CLG-15` remains partial for the same left-rail docs/help/debug reason.
- `Home-Page-Gen1-CLG-19` remains open through Phase 3 storage fit/detail work.

## [x] `Home-Page-6 / Phase 2` - `Compact Orientation Quick-Start Card`

### Phase 2 Summary

#### Purpose

Reframe the current Home Page orientation area into a compact quick-start/status card that feels like part of the control deck without becoming a docs dashboard or release-notes owner.

This phase advances `Home-Page-Gen1-HLG-18`, keeps `Home-Page-Gen1-HLG-20` active as a preservation rail, and advances `Home-Page-Gen1-CLG-17`.

#### Owns

- compact Orientation card presentation in the Home Page main region
- preserving existing GitHub link, Docs link, version label, and what's-new summary
- one non-owning intro/media affordance such as `Get Started with ParaHook`
- focused Home Page tests proving the orientation content remains lightweight and behavior-preserving

#### Does Not Own

- Storage Management rename, detail arrows, or storage row changes
- new docs navigation systems
- release-note ownership
- changing GitHub or Docs URL ownership
- changing workspace launch actions
- changing persistence toggles, storage wipe behavior, or storage owner seams

#### Current Live Read

- `HomePageSurface.tsx` currently renders `HomePageSurfaceOrientationStrip` in the main region.
- Orientation content currently comes from `homePageOrientation.ts` exports: `homePageGithubUrl`, `homePageDocsUrl`, `homePageVersionLabel`, and `homePageWhatIsNewSummary`.
- `HomePageSurface.test.tsx` already checks the GitHub/Docs links, version, what's-new text, and that the orientation read remains smaller than storage.
- Phase 1 moved the orientation area into the control-deck main region but intentionally did not add the quick-start/media affordance.

#### First Pass Decisions

1. Keep orientation content in Home Page and lightweight.
2. Preserve the existing GitHub and Docs anchors and their current exported URL sources.
3. Preserve version and what's-new text from `homePageOrientation.ts`.
4. Add only a non-owning intro/media affordance, with copy such as `Get Started with ParaHook`.
5. Do not alter storage rows or rename Storage Transparency in this phase.

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. In `HomePageSurface.tsx`, reshape the existing `HomePageSurfaceOrientationStrip` into a compact quick-start/status card.
2. Preserve the existing orientation heading, GitHub link, Docs link, version label, and what's-new summary.
3. Add one small intro/media affordance such as a `Get Started with ParaHook` preview/action surface, without wiring a new docs system, modal, video player, release-note browser, or route.
4. Keep the card compact in the main region and avoid increasing vertical overflow.
5. In `base.css`, update only the Orientation/Home Page main-region styles needed for the quick-start/status card.
6. In `HomePageSurface.test.tsx`, update or add focused coverage that proves:
   - the orientation card still exposes GitHub and Docs links from the existing URL exports
   - version and what's-new text still render
   - `Get Started with ParaHook` or the chosen non-owning intro/media affordance renders
   - storage section labels, rows, toggles, wipe buttons, and launch buttons are not changed by this phase

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- optional: `src/app/workspace/homePageOrientation.ts` only if the Worker needs one tiny exported label for the intro affordance

#### No-Widening Rule

- Do not change storage management, storage row labels, details affordances, row scrolling, storage wipe behavior, or persistence toggles.
- Do not add a docs browser, release-notes browser, modal system, video player, or route.
- Do not change catalog-generated launch actions or launch labels.
- Do not add Docker, Scratchpad, or Hotspot launch buttons.
- Do not change graph, Browser, Catalog, Console, Dashboard, Notepad, recent-items, or viewer ownership.

#### Implementation Risks

- The quick-start affordance can accidentally become a docs or release-notes owner.
- Adding media-like visual treatment can increase vertical height and hurt monitor fit.
- Reworking orientation markup can break existing GitHub/Docs/version/what's-new tests.

#### Checklist

- [x] Orientation renders as a compact quick-start/status card.
- [x] GitHub and Docs links still use existing URL exports.
- [x] Version and what's-new text still render.
- [x] A non-owning `Get Started with ParaHook` style affordance renders.
- [x] Storage Management details are not changed in this phase.
- [x] Launch rail labels remain the verified catalog set.
- [x] Focused Home Page tests cover the orientation card and unchanged neighboring behavior.

#### Verification Shape

- `npm run test -- src/app/workspace/HomePageSurface.test.tsx`
- `npm run build`

#### Done Shape

Kant can report this phase complete when the orientation area reads as a compact quick-start/status card, GitHub/Docs/version/what's-new remain intact, the non-owning intro/media affordance is present, storage details are untouched, focused tests pass, and `npm run build` passes.

#### Phase 2 Closeout

Coverage classification: `complete` for the assigned Phase 2 slice.

Kant reframed Orientation into a compact quick-start/status card, preserved GitHub and Docs links from `homePageOrientation.ts`, preserved `homePageVersionLabel` and `homePageWhatIsNewSummary`, added the non-owning `Get Started with ParaHook` affordance, and left storage rows, labels, scrolling, wipe behavior, persistence toggles, launch labels, and launch behavior untouched.

Verification accepted from Worker:
- `npm.cmd run test -- src/app/workspace/HomePageSurface.test.tsx` passed: 1 file, 9 tests.
- `npm.cmd run build` passed with existing Vite warnings.

Tracking accepted:
- `docs/CHANGELOG.md` entry `[1575]` records the shipped runtime behavior.

Residual open coverage:
- `Home-Page-Gen1-HLG-15` remains open until the Storage Management slice completes the control-deck redesign.
- `Home-Page-Gen1-HLG-16` remains partial because the left rail exists and has docs/help-facing links, while any debug/advanced affordance still needs closeout or explicit deferral.
- `Home-Page-Gen1-HLG-19`, `Home-Page-Gen1-CLG-18`, and `Home-Page-Gen1-CLG-19` remain open for Phase 3.
- `Home-Page-Gen1-HLG-20` remains open as the behavior-preservation rail across all `Home-Page-6` slices.

## [x] `Home-Page-6 / Phase 3` - `Storage Management Rename And Detail Affordance`

### Phase 3 Summary

#### Purpose

Reframe the existing storage area from `Storage transparency` into `Storage Management` while preserving the bucket inventory, owner seam text, persistence controls, wipe behavior, size readouts, and internal row scrolling.

This phase advances `Home-Page-Gen1-HLG-19`, keeps `Home-Page-Gen1-HLG-20` active as the final behavior-preservation rail, and advances `Home-Page-Gen1-CLG-18` and `Home-Page-Gen1-CLG-19`.

#### Owns

- visible rename from Storage Transparency to Storage Management
- storage card presentation inside the Home Page main region
- preserving current bucket inventory, source keys, owner seam text, toggles, wipe buttons, and size readouts
- a small non-owning detail affordance only if it reads from existing bucket fields and does not create new semantics
- internal row scrolling and monitor-height fit
- focused Home Page/storage tests proving the rename and preserved behavior

#### Does Not Own

- changing persistence toggle semantics
- changing storage wipe semantics
- adding or removing storage buckets
- moving storage ownership into Home Page
- changing graph or recent-items owner seams
- changing launch rail behavior or labels
- changing the compact orientation card
- adding Docker, Scratchpad, or Hotspot launch buttons

#### Current Live Read

- `HomePageSurface.tsx` still renders the storage section with `aria-label="Storage transparency"` and visible title `Storage transparency`.
- Storage rows still come from `readHomePageStorageBuckets()` in `homePageStorageTransparency.ts`.
- Each row still renders the bucket label, `storageKey`, `ownerSeam`, persistence controls where applicable, wipe button, and approximate size text.
- `HomePageSurface.test.tsx` still queries the storage section by `aria-label="Storage transparency"` and covers owner seam notes, graph/recent-items policy toggles, wipe behavior, bucket inventory, and unchanged launch labels.
- Phase 2 intentionally left this storage area untouched so Phase 3 can own the rename/detail work without mixing in orientation changes.

#### First Pass Decisions

1. Rename the user-facing storage section to `Storage Management`.
2. Keep `homePageStorageTransparency.ts` as the current data seam unless the Worker finds a small, behavior-neutral naming alias is needed for clarity.
3. Preserve bucket inventory and owner seam text exactly unless an existing test proves copy already changed.
4. Add a detail affordance only as a read-only reveal, badge, chevron, or similar small presentation layer backed by existing bucket fields.
5. Treat persistence toggles, wipe buttons, source keys, row scrolling, and storage owners as behavior-preservation requirements.

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. In `HomePageSurface.tsx`, rename the storage section's visible and accessible presentation from `Storage transparency` to `Storage Management`.
2. Keep `storageBuckets`, `storagePolicyControlsByBucketId`, `wipeStorageBucket`, origin storage estimate, graph persistence note, and recent-items persistence note wired exactly as they are.
3. Preserve the row columns for bucket label, source key, owner seam, persistence controls, wipe button, and size readout.
4. Optionally add one non-owning detail affordance per row only if it uses existing bucket fields and does not introduce new storage state, navigation, modals, destructive actions, or owner semantics.
5. Keep the storage row list internally scrollable, with the title/copy and footer notes outside the row-scroll area.
6. In `base.css`, adjust only Home Page storage-management styles needed for the rename/detail presentation and monitor-height fit.
7. In `HomePageSurface.test.tsx`, update or add focused coverage that proves:
   - the section is now exposed as `Storage Management`
   - all current bucket labels/source keys/owner seam text still render
   - persistence toggles still update the same policies
   - wipe buttons still remove only the selected storage key
   - row scrolling remains internal through the expected storage list class or structure
   - launch labels and orientation card remain unchanged by this phase

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- optional: `src/app/workspace/homePageStorageTransparency.test.ts` only if the Worker needs to pin helper-level inventory details

#### No-Widening Rule

- Do not change persistence policy semantics.
- Do not change wipe semantics or add broader storage clearing.
- Do not add, remove, or rename storage buckets unless the live owner seam already exposes that truth.
- Do not move graph or recent-items storage ownership into Home Page.
- Do not alter launch rail labels or catalog sourcing.
- Do not alter the Phase 2 compact orientation card beyond fixing accidental regressions.
- Do not add Docker, Scratchpad, or Hotspot launch buttons.

#### Implementation Risks

- Renaming the section can break tests that still query `Storage transparency`.
- A detail affordance can accidentally imply Home Page owns storage semantics.
- Changing row structure can break toggle/wipe alignment or monitor-height internal scrolling.
- Touching storage helpers can accidentally widen bucket ownership.

#### Checklist

- [x] User-facing storage section is renamed to `Storage Management`.
- [x] Existing bucket inventory remains intact.
- [x] Existing owner seam text remains intact.
- [x] Persistence toggles preserve their current policy behavior.
- [x] Wipe buttons preserve selected-key-only deletion behavior.
- [x] Size readouts remain aligned with their rows.
- [x] Any detail affordance is read-only and backed by existing bucket fields.
- [x] Storage rows keep internal scrolling with header/copy/footer outside the scroll area.
- [x] Orientation and launch rail behavior remain unchanged.
- [x] Focused tests cover rename, preserved storage behavior, and unchanged neighboring behavior.

#### Verification Shape

- `npm run test -- src/app/workspace/HomePageSurface.test.tsx src/app/workspace/homePageStorageTransparency.test.ts`
- `npm run build`

#### Done Shape

Kant can report this phase complete when the storage area reads as `Storage Management`, current bucket inventory and owner seam text still render, persistence toggles and wipe behavior remain unchanged, row scrolling stays internal, any detail affordance is strictly non-owning, focused tests pass, and `npm run build` passes.

#### `Home-Page-6` Closeout Criteria

If Phase 3 lands with the done shape above and no new regressions:
- Mark `Home-Page-Gen1-HLG-19`, `Home-Page-Gen1-CLG-18`, and `Home-Page-Gen1-CLG-19` complete.
- Mark `Home-Page-Gen1-HLG-20` complete only after Worker proof confirms startup restore, persistence toggles, storage wipe, catalog launch, dark-mode styling, and monitor-height fit remain intact across all three phases.
- Mark `Home-Page-Gen1-HLG-15` complete if the accepted control deck now reads as a polished workspace landing/control surface across left rail, orientation card, and Storage Management.
- Mark `Home-Page-Gen1-HLG-16` and `Home-Page-Gen1-CLG-15` complete only if the final review accepts the current left rail/docs/help/advanced/debug coverage as sufficient; otherwise create a follow-up phase or explicit deferral instead of silently closing them.
- Mark `Home-Page-6` complete only after the changelog entry for Phase 3 exists, focused tests pass, build passes, and this Family Phase Doc plus the Generation Index reflect the final coverage decision.

#### Phase 3 Closeout

Coverage classification: `complete` for the assigned Phase 3 slice.

Kant renamed the storage presentation to `Storage Management`, preserved `storageBuckets`, policy controls, selected-key wipe behavior, origin estimate, graph persistence note, and recent-items persistence note. Current row content still includes bucket label, source key, owner seam, persistence controls, wipe button, and size readout. The new per-row `Details` affordance is read-only and backed by existing bucket fields: label, storage key, and owner seam. The storage row list remains internally scrollable with header/copy/footer outside the scroll region, and Phase 2 orientation plus catalog launch behavior remained unchanged.

Verification accepted from Worker:
- `npm.cmd run test -- src/app/workspace/HomePageSurface.test.tsx src/app/workspace/homePageStorageTransparency.test.ts` passed: 2 files, 11 tests.
- `npm.cmd run build` passed with existing Vite warnings.

Tracking accepted:
- `docs/CHANGELOG.md` entry `[1576]` records the shipped runtime behavior.

Coverage closed:
- `Home-Page-Gen1-HLG-15`
- `Home-Page-Gen1-HLG-19`
- `Home-Page-Gen1-HLG-20`
- `Home-Page-Gen1-CLG-18`
- `Home-Page-Gen1-CLG-19`

Residual open coverage:
- `Home-Page-Gen1-HLG-16` and `Home-Page-Gen1-CLG-15` remain open because the live left rail currently contains identity, startup-surface selection, and catalog-grounded launch actions, but not a left-rail docs/help shortcut group or debug/advanced affordance. `Home-Page-6` therefore needs one final narrow follow-up phase instead of being silently closed.

## [x] `Home-Page-6 / Phase 4` - `Left Rail Help And Debug Affordance Closeout`

### Phase 4 Summary

#### Purpose

Close the remaining left-rail coverage by adding a tiny docs/help shortcut group and a non-owning debug/advanced affordance to the Home Page control rail without changing startup, launch, orientation, storage, or persistence behavior.

This phase advances only `Home-Page-Gen1-HLG-16` and `Home-Page-Gen1-CLG-15`.

#### Owns

- left-rail docs/help shortcut presentation
- one small debug/advanced affordance in the left rail
- preserving the existing startup surface switch
- preserving catalog-grounded launch buttons
- focused tests proving the new rail affordances exist and neighboring behavior remains unchanged

#### Does Not Own

- a docs browser
- release-note ownership
- a debug panel, inspector, console, log viewer, or route
- new workspace surface kinds
- storage management changes
- orientation card changes
- persistence semantic changes
- Docker, Scratchpad, or Hotspot launch buttons

#### Current Live Read

- `HomePageSurface.tsx` currently renders `HomePageSurfaceControlRail` with identity, startup surface selection, and `HomePageSurfaceLaunchActions`.
- GitHub and Docs links currently render in the main orientation card from `homePageOrientation.ts`.
- There is no left-rail docs/help shortcut group and no left-rail debug/advanced affordance.
- The remaining HLG/CLG should close only after that rail coverage exists or is explicitly deferred by Manager.

#### First Pass Decisions

1. Keep any docs/help rail shortcuts tiny and source URLs from the existing orientation seam or another narrow Home Page helper.
2. Keep the debug/advanced affordance read-only and non-owning, such as a status chip or disabled/future-facing button, unless a current Home Page debug entry point already exists.
3. Do not move GitHub/Docs ownership into a larger docs system.
4. Preserve the Phase 1, Phase 2, and Phase 3 behavior contracts.

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. In `HomePageSurface.tsx`, add a small left-rail group below the launch actions or near the rail footer for docs/help shortcuts.
2. Include a tiny non-owning debug/advanced affordance in the same rail area, using existing Home Page state/status only.
3. Reuse the existing GitHub/Docs URL seam if links are added; do not create a docs dashboard or release-note owner.
4. Keep startup surface switching, `homePageLaunchSurfaceEntries`, orientation card, Storage Management rows, persistence toggles, and wipe behavior unchanged.
5. In `base.css`, add only the rail styling needed for the compact docs/help/debug affordances.
6. In `HomePageSurface.test.tsx`, add focused coverage that proves:
   - the left rail exposes startup surface selection, catalog launch actions, docs/help shortcuts, and debug/advanced affordance
   - launch labels remain the verified catalog set
   - orientation and Storage Management remain present
   - persistence toggles and selected-key wipe behavior still pass existing coverage

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- optional: `src/app/workspace/homePageOrientation.ts` only if a tiny exported rail label is needed

#### No-Widening Rule

- Do not add a docs browser, release-note browser, debug drawer, inspector, route, or modal.
- Do not add new surface kinds.
- Do not add Docker, Scratchpad, or Hotspot launch buttons.
- Do not change catalog launch sourcing or callbacks.
- Do not change orientation, Storage Management, persistence, or wipe semantics.

#### Checklist

- [x] Left rail includes docs/help shortcuts.
- [x] Left rail includes one debug/advanced affordance.
- [x] Startup surface switch remains unchanged.
- [x] Launch rail remains catalog-generated with verified labels only.
- [x] Orientation card remains unchanged.
- [x] Storage Management remains unchanged.
- [x] Focused tests cover the rail additions and unchanged neighboring behavior.

#### Verification Shape

- `npm run test -- src/app/workspace/HomePageSurface.test.tsx`
- `npm run build`

#### Done Shape

Kant can report this phase complete when the left rail has startup selection, catalog-grounded launch, docs/help shortcuts, and a non-owning debug/advanced affordance; no neighboring Home Page behavior changes; focused tests pass; and `npm run build` passes. HLG > Spec can close `Home-Page-6` only after this phase lands or Manager explicitly accepts deferring the remaining left-rail docs/help/debug goal outside `Home-Page-6`.

#### Phase 4 Closeout

Coverage classification: `complete` for the assigned Phase 4 slice.

Kant added compact left-rail `Docs` and `GitHub` shortcuts using the existing Home Page URL exports, added one non-owning read-only `Advanced` status affordance, and styled the new rail utility affordances compactly. The focused Home Page coverage proves the help/debug affordances alongside startup, catalog launch, orientation, Storage Management, persistence-toggle, and wipe behavior.

Verification accepted from Worker:
- `npm.cmd run test -- src/app/workspace/HomePageSurface.test.tsx src/app/workspace/homePageStorageTransparency.test.ts src/app/workspace/workspaceSurfaceCatalog.test.ts` passed: 3 files, 15 tests.
- `npm.cmd run build` passed with existing Vite warnings.

Tracking accepted:
- `docs/CHANGELOG.md` entry `[1577]` and Doc History `56` record the shipped runtime behavior.

Coverage closed:
- `Home-Page-Gen1-HLG-16`
- `Home-Page-Gen1-CLG-15`

## [x] `Home-Page-6` - `Final Closeout`

### Final Coverage Read

Coverage classification: `complete`.

`Home-Page-6` now satisfies the Home Page mockup redesign intake inside Home Page Generation 1:
- polished control-deck shell with left rail and main content region
- left rail startup surface selection, catalog-grounded viewport launch, docs/help shortcuts, and non-owning advanced/debug status affordance
- catalog-generated launch labels limited to verified live surfaces
- compact quick-start/status orientation card with GitHub, Docs, version, what's-new, and `Get Started with ParaHook`
- Storage Management presentation with aligned bucket identity, source key, owner seam, persistence controls, selected-key wipe, size, read-only details, and internal row scrolling
- preservation of startup restore, persistence toggles, storage wipe, canonical launch, dark styling, and monitor-height fit
- Docker, Scratchpad, and Hotspot kept out of launch buttons because they remain unverified mockup-only labels

Closed HLG:
- `Home-Page-Gen1-HLG-15`
- `Home-Page-Gen1-HLG-16`
- `Home-Page-Gen1-HLG-17`
- `Home-Page-Gen1-HLG-18`
- `Home-Page-Gen1-HLG-19`
- `Home-Page-Gen1-HLG-20`
- `Home-Page-Gen1-HLG-21`

Closed CLG:
- `Home-Page-Gen1-CLG-14`
- `Home-Page-Gen1-CLG-15`
- `Home-Page-Gen1-CLG-16`
- `Home-Page-Gen1-CLG-17`
- `Home-Page-Gen1-CLG-18`
- `Home-Page-Gen1-CLG-19`
- `Home-Page-Gen1-CLG-20`

Residual risk:
- Worker build passed with existing Vite warnings.
- No remaining `Home-Page-6` implementation gap is known after Phase 4.

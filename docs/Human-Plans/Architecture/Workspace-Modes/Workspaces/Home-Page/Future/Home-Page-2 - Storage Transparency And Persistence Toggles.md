# [x] `Home-Page-2` - `Storage Transparency And Persistence Toggles`

## Doc Header

### Doc History
4. 2026-04-19 16:36:01: Reconciled the guide-rail acceptance closeout for `Home-Page-2`, marking the family phase complete for the current owner seams while leaving graph browser-storage and recent-items explicitly deferred until real downstream owner seams exist.
3. 2026-04-19 16:28:32: Landed `Home-Page-2 / Phase 3 - Extend Transparency To Remaining Owned Buckets And Deferred Owners` after dashboard and notepad persistence toggles were wired through the existing UI prefs and AppShell persistence seams, graph browser-storage and recent-items remained honestly deferred because no live owner seam exists yet, and the focused Home Page, persistence, and AppShell tests plus `npm run build` passed.
2. 2026-04-19 16:16:54: Landed `Home-Page-2 / Phase 2 - Split Visible Persistence Policy For Workspace Restore, View Settings, And Environment` after wiring explicit Home Page policy controls for workspace restore, view settings, and environment through the existing workspace and UI prefs persistence bridges, keeping the read-only storage transparency surface intact, and proving the environment toggle can split cleanly without a broad owner rewrite.
1. 2026-04-19 15:52:08: Created the standalone `Home-Page-2` Family Phase Doc in the newer clean naming format, grounded Phase 1 in the live browser-persistence buckets and workspace seams, and split the later toggles into smaller follow-on phases so `Home Page` can start with read-only transparency before any destructive controls.

### Purpose

This file is the implementation-planning surface for `Home-Page-2` in Home Page Generation 1.

Use it to:
- translate the preserved HLG and CLG into Codex-sized implementation phases
- keep storage transparency and persistence toggles inside real live seams
- make Phase 1 dispatchable without widening into graph, Browser, or docs ownership

## Doc Body

### Why This Phase Exists

`Home-Page-2` exists because Home Page already owns a real workspace surface, and that surface should be able to explain what ParaHook persists before it starts controlling more of that persistence.

The first honest read is not a toggle. It is inventory.

The live seams currently show:
- `src/app/workspace/workspacePersistence.ts` owns the workspace-layout bucket at `parahook.workspace.lastLayout.v1`
- `src/app/store/uiPrefsPersistence.ts` owns the UI prefs bucket at `parahook.uiPrefs.view.v1`
- `src/app/dashboard/dashboardPersistence.ts` owns the dashboard bucket at `parahook.dashboard.widgets.v4`
- `src/app/notepad/notepadPersistence.ts` owns the notepad bucket at `parahook.notepad.notes.v1`
- `src/app/workspace/useWorkspacePersistenceBridge.ts` still performs the saved-layout restore prompt
- `src/app/store/useUiPrefsPersistenceBridge.ts` still writes the current UI prefs snapshot on every change
- `src/app/workspace/workspaceSurfaceCatalog.ts` marks `homePage`, `dashboard`, and `notepad` as participating in persistence
- `src/app/io/graphDocumentPersistence.ts` is file IO, not browser storage persistence

There is no existing browser origin quota seam yet.

That means the first implementation cut should stay read-only and truthful:
- inventory the real persisted buckets
- show their sizes and labels
- distinguish unavailable origin-storage estimates from known values
- leave destructive reset and new toggle behavior for later slices

### Phase Boundary Rules

This family phase stays inside storage transparency and persistence policy.

It does not own:
- first-time workspace registration
- launch routing
- graph document truth
- Browser row semantics
- full docs or changelog ownership
- unconditional clear/reset actions

The first phase should make the storage story legible without changing who owns the stored meaning.

## Vision

`Home-Page-2` should make Home Page a trustworthy storage mirror for ParaHook-owned browser state.

The user should be able to see what is stored, how much is stored, and where that storage lives before any stronger controls are added.

Later phases can turn that read into explicit remember/forget toggles, but the first phase should prove the read-only surface first.

## Wishlist Organization

### High Level Goals

- [x] `Home-Page-Gen1-HLG-3. Home Page should keep track of browser storage so the user can tell if there is a leak.`
- [x] `Home-Page-Gen1-HLG-4. Home Page should help the user understand whether the app is storing data and bloating browser-side storage.`
- [ ] `Home-Page-Gen1-HLG-5. The user should be able to save what they have in their graphs in browser storage and turn that setting on or off.`
- [x] `Home-Page-Gen1-HLG-6. Home Page should show and expose any app-owned data ParaHook stores on the user's computer or in browser storage.`
- [x] `Home-Page-Gen1-HLG-7. Home Page should include a Workspace Restore persistence toggle so browser reload can either remember or forget the last saved workspace layout.`
- [x] `Home-Page-Gen1-HLG-8. Home Page should include a View Settings persistence toggle so browser reload can either remember or forget view presentation preferences.`
- [x] `Home-Page-Gen1-HLG-9. Home Page should include an Environment persistence toggle so browser reload can either remember or forget applied environment state such as a Catalog-loaded HDRI.`
- [x] `Home-Page-Gen1-HLG-10. Home Page should include a Dashboard persistence toggle so dashboard lanes and widget placement can either survive reload or start fresh.`
- [x] `Home-Page-Gen1-HLG-11. Home Page should include a Notepad persistence toggle so notes can either survive reload or be cleared from browser persistence.`
- [ ] `Home-Page-Gen1-HLG-12. Home Page should include a Recent Items persistence toggle when a recent-items owner exists, so recent/resume state can be remembered or forgotten intentionally.`
- [x] `Home-Page-Gen1-HLG-13. Home Page should expose browser storage and quota usage when the browser provides that estimate.`

### Codex Level Goals

- [x] Home-Page-Gen1-CLG-5. Inventory ParaHook-owned persisted browser data separately from browser-managed origin storage.
- [ ] Home-Page-Gen1-CLG-6. Add explicit user controls for graph persistence in browser storage without hiding graph truth inside `Home Page`.
- [x] Home-Page-Gen1-CLG-7. Add a `Workspace Restore` persistence toggle that controls whether saved workspace layout restore survives browser reload and replaces the hidden restore prompt with explicit user preference.
- [x] Home-Page-Gen1-CLG-8. Add a `View Settings` persistence toggle that controls whether view presentation preferences survive browser reload without making `Home Page` the viewer owner.
- [x] Home-Page-Gen1-CLG-9. Add an `Environment` persistence toggle that controls reload memory for applied environment state such as Catalog-loaded HDRIs while leaving environment meaning with the Environment, Catalog apply, and viewer owners.
- [x] Home-Page-Gen1-CLG-10. Add `Dashboard` and `Notepad` persistence toggles that control their existing persisted buckets without making `Home Page` the notes or dashboard layout owner.
- [ ] Home-Page-Gen1-CLG-11. Add a `Recent Items` persistence toggle only after a recent-items owner or storage bucket exists, keeping resume semantics outside `Home Page`.
- [x] Home-Page-Gen1-CLG-12. Add browser storage/quota visibility when supported by the browser, clearly distinguishing unavailable estimates from zero usage.

### `Home-Page-2 / Phase 1`

- [x] Inventory the live persistence buckets that Home Page should explain.
- [x] Show a read-only storage transparency surface with bucket names and approximate sizes.
- [x] Distinguish browser origin storage estimates from browser support that is unavailable.
- [x] Keep all toggle, clear, and reset actions out of the first worker cut.
- [x] Route every visible storage row back to its owning seam or bucket.
- [x] `Home-Page-Gen1-HLG-3`
- [x] `Home-Page-Gen1-HLG-4`
- [x] `Home-Page-Gen1-HLG-6`
- [x] `Home-Page-Gen1-HLG-13`
- [x] `Home-Page-Gen1-CLG-5`
- [x] `Home-Page-Gen1-CLG-12`

## [x] `Home-Page-2 / Phase 1` - `Read Existing Persistence Buckets And Show Read-Only Storage Transparency`

### Phase 1 Summary

Phase 1 makes Home Page tell the truth about the storage it already shares with the rest of the app.

This phase has landed and remains read-only.

This is the right first cut because the live code already has explicit persistence buckets, but the browser-origin quota story does not yet have a dedicated read seam.

### Phase 1 Implementation Spec

#### Purpose

Inventory the current ParaHook-owned browser persistence buckets and present them on Home Page as read-only storage transparency.

#### Owns

- the read-only storage inventory surface on Home Page
- bucket-by-bucket labels and approximate sizes
- an unavailable-or-available origin-storage estimate line
- truthful explanations for current app-owned persistence buckets

#### Does Not Own

- workspace restore toggles
- view settings toggles
- environment persistence toggles
- dashboard or notepad toggles
- graph browser-storage save controls
- recent-items persistence controls
- destructive clear/reset actions

#### Current Live Read

- `workspacePersistence.ts` already serializes the workspace layout bucket
- `uiPrefsPersistence.ts` already serializes the UI prefs bucket
- `dashboardPersistence.ts` already serializes dashboard state
- `notepadPersistence.ts` already serializes notepad state
- `graphDocumentPersistence.ts` is export/import file IO, not browser persistence
- `useWorkspacePersistenceBridge.ts` and `useUiPrefsPersistenceBridge.ts` are the current persistence bridge seams

#### First Pass Decisions

1. Read the live bucket keys from the existing persistence modules instead of inventing a second storage registry.
2. Keep the phase read-only even if a later toggle might be obvious.
3. Treat browser origin storage estimates as optional support, not guaranteed data.
4. Do not guess at graph browser storage or recent-items ownership if the seam is not already present.
5. Keep the storage surface compact enough that the user can see it without leaving Home Page.

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/notepad/notepadPersistence.ts`
- `src/app/io/graphDocumentPersistence.ts`
- a small new storage-inventory helper if the surface needs one

#### No-Widening Rule

- do not add persistence toggles
- do not add delete or clear buttons
- do not move graph truth into Home Page
- do not widen into Browser, Catalog, or docs ownership
- do not make the first worker pass responsible for every future persistence row

#### Verification Shape

- add or update focused Home Page inventory tests
- add a helper-level test if the inventory logic moves into a new module
- run the smallest relevant test slice first
- run `npm run build` before the phase is reported as landed

#### Done Shape

- Home Page shows a read-only list of current ParaHook-owned storage buckets
- the origin-storage estimate row is truthful when available and clearly unavailable when not
- no persistence toggle or clear action exists yet
- the surface makes the next phases obvious without pretending they are already shipped

## [x] `Home-Page-2 / Phase 2` - `Split Visible Persistence Policy For Workspace Restore, View Settings, And Environment`

### Phase 2 Summary

Phase 2 turns the read-only inventory into the first explicit remember/forget controls for the buckets that already have the clearest live persistence seams.

This phase should stay narrow: the goal is to turn visible storage policy into explicit user control without absorbing ownership from the downstream surfaces.

This phase has landed with the first explicit policy controls for workspace restore, view settings, and environment.

### Phase 2 Implementation Spec

#### Purpose

Expose the current workspace-restore, view-settings, and environment persistence policy as explicit user-facing toggles when those buckets can be separated cleanly from the shared snapshot logic.

#### Owns

- workspace restore remember/forget policy
- view settings remember/forget policy
- environment reload-memory policy if it can be split from the shared view snapshot without widening
- the Home Page rows or controls that explain the current policy state

#### Does Not Own

- graph browser-storage save behavior
- dashboard persistence
- notepad persistence
- recent-items persistence
- browser quota reporting
- destructive clear/reset actions

#### Current Live Read

- `useWorkspacePersistenceBridge.ts` now reads the workspace-restore policy on load instead of prompting
- `workspacePersistence.ts` owns the workspace-layout snapshot
- `useUiPrefsPersistenceBridge.ts` hydrates and persists the UI prefs snapshot while honoring separate view and environment persistence policies
- `uiPrefsPersistence.ts` stores the current UI prefs snapshot together with the explicit persistence policy flags in one bucket
- `uiPrefsStore.ts` includes the startup-surface, the explicit persistence policy flags, and the environment-facing view state the bucket currently carries

#### First Pass Decisions

1. Keep the policy split inside the existing persistence bridges instead of adding a second owner.
2. The environment split proved clean enough in this pass, so keep it inside the same bridge/store seam rather than widening to a new owner.
3. Do not widen this phase into dashboard, notepad, graph, or recent-items work.
4. Keep any toggle copy explicit about remember/forget behavior.

#### Likely Files

- `src/app/workspace/useWorkspacePersistenceBridge.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/store/useUiPrefsPersistenceBridge.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`

#### No-Widening Rule

- do not add the remaining feature buckets yet
- do not add destructive controls
- do not replace the downstream owners
- do not turn Home Page into a general settings hub

#### Verification Shape

- focused bridge tests for restore and UI prefs persistence
- focused Home Page control tests for the visible toggles
- `npm run build`

#### Done Shape

- the user can see and change the first explicit persistence policies from Home Page
- workspace restore, view settings, and environment are split cleanly enough to remain explicit policy controls
- the read-only inventory still works
- the phase remains focused on existing buckets only

## [x] `Home-Page-2 / Phase 3` - `Extend Transparency To Remaining Owned Buckets And Deferred Owners`

### Phase 3 Summary

Phase 3 handles the remaining app-owned buckets and the buckets that still need owner-seam confirmation.

This is where Home Page widens from the first policy split into the rest of the storage truth, but only where the live owner seams already exist.

This phase has landed with dashboard and notepad persistence toggles, while graph browser-storage and recent-items remain deferred until a real owner seam exists.

### Phase 3 Implementation Spec

#### Purpose

Add the remaining storage rows and the remaining persistence policy controls only where the live owner seams really exist.

#### Owns

- dashboard persistence visibility and control
- notepad persistence visibility and control
- graph browser-storage save behavior if a browser-storage owner seam exists
- recent-items persistence if and only if a real recent-items owner appears
- origin-storage quota reporting when the browser supports it

#### Does Not Own

- startup routing
- workspace landing behavior
- launch actions
- browser-project ownership
- long-form docs or release-note ownership

#### Current Live Read

- `dashboardPersistence.ts` already owns the dashboard storage bucket
- `notepadPersistence.ts` already owns the notepad storage bucket
- `workspaceSurfaceCatalog.ts` already marks both surfaces as persistence participants
- `uiPrefsPersistence.ts` now carries the dashboard and notepad persistence policy flags
- `AppShell.tsx` gates the dashboard and notepad persistence readers and writers from those policy flags
- `graphDocumentPersistence.ts` still points at file export/import rather than browser storage
- there is still no recent-items owner seam in the live code read captured for this prep

#### First Pass Decisions

1. Only surface a bucket if the owning seam is real.
2. Keep recent-items and graph browser-storage behavior deferred until the owner seam is proven.
3. Keep the Home Page copy careful about browser-managed storage versus ParaHook-owned data.
4. Avoid introducing destructive resets until the owner of the bucket can also own the confirmation story.

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/notepad/notepadPersistence.ts`
- `src/app/notepad/useNotepadStore.ts`
- `src/app/io/graphDocumentPersistence.ts`

#### No-Widening Rule

- do not expand into unrelated workspace areas
- do not reassign Browser ownership
- do not invent recent-items storage if the owner does not exist
- do not turn quota support into a guess

#### Verification Shape

- focused bucket tests for the added rows
- focused Home Page render tests for the new controls or disclosures
- `npm run build`

#### Done Shape

- the remaining owned buckets are visible and honest
- unsupported or absent buckets are clearly labeled
- Home Page still stays a workspace surface, not a settings backend

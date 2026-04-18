# [x] `Catalog-Gen0.2.1` - `Browser References Baseline Removal`

## Doc Header

### Doc History
7. 2026-04-18 13:57:35: Reconciled this `Catalog-Gen0.2.1` future doc to the already-landed shipped state, marking the standalone Browser-baseline-removal ladder complete now that the earlier Phase 1 through Phase 4 implementation work has already retired manifest-backed startup seeding, removed the first-load Browser `References` shell, preserved later imported-reference follow-through, and updated the focused proof surfaces even though this doc's checklist state had not been fully closed out yet
6. 2026-04-18 12:33:49: Implemented `Catalog-Gen0.2.1 / Phase 2 - Browser References Root Removal`, making `selectCurrentProjectContentBrowserRows(...)` stop synthesizing the Browser `References` assembly plus preload-only category rows when the reference workspace has no items, adding focused startup proof that first-load Browser content rows no longer include that root, and tightening `useBrowserPanelController.ts` collapsed-row sync so it only treats the legacy root or category rows as mounted when those rows actually exist in the Browser content tree
5. 2026-04-18 12:22:38: Prepped `Catalog-Gen0.2.1 / Phase 2 - Browser References Root Removal` for implementation against the post-Phase-1 live read where startup `referenceWorkspace` state is now empty but `selectReferenceWorkspaceBrowserTree(...)` in `useAppStore.ts` still always synthesizes a Browser `References` root from `REFERENCE_MANIFEST_CATEGORIES`, `useBrowserPanelController.ts` still consumes that tree plus `REFERENCE_ROOT_ROW_ID` as if the root always exists, and the strongest affected proof surfaces now sit in `selectBrowserTreeRows.test.ts` plus `BrowserPanel.test.tsx`
4. 2026-04-18 12:19:38: Implemented `Catalog-Gen0.2.1 / Phase 1 - Startup Manifest Seeding Removal`, removing the default `REFERENCE_MANIFEST_ITEMS` startup fill from `useAppStore.ts`, adding focused store proof that first-load `referenceWorkspace` state now starts empty instead of manifest-backed, and shifting the still-needed manifest fixture setup into the affected `useAppStore.test.ts` scenarios while leaving Browser `References` root removal and later imported-reference preservation to the following phases
3. 2026-04-18 12:06:41: Prepped `Catalog-Gen0.2.1 / Phase 1 - Startup Manifest Seeding Removal` for implementation, grounding the first runtime cut in the live `useAppStore.ts` startup helpers where `buildInitialReferenceRecords()` and `INITIAL_REFERENCE_RECORD_ORDER` still prefill `referenceWorkspace.importedReferencesById` plus `importedReferenceOrder` from `REFERENCE_MANIFEST_ITEMS`, while keeping `selectReferenceWorkspaceBrowserTree(...)` and Browser-root removal explicitly deferred to later phases so the first pass stays one store-owned preload-retirement cut plus focused `useAppStore.test.ts` proof
2. 2026-04-18 11:48:20: Broke this `Catalog-Gen0.2.1` runtime-removal plan into smaller implementation phases so Codex can land the Browser `References` baseline retirement through a clearer step-by-step ladder covering startup seeding removal, Browser-root removal, imported-reference preservation, and focused proof updates instead of treating the whole cut as one wider pass
1. 2026-04-18 11:44:03: Added this standalone `Catalog-Gen0.2.1` future doc so the already-landed `Catalog-Gen0 - Phase 2 - Ownership Boundary Cleanup` rule now has one narrow implementation-ready follow-on for removing the Browser `References` startup baseline, retiring manifest-backed startup seeding, and preserving imported-reference behavior after real intake without widening into asset-home migration or broader `Catalog-1` or `Catalog-2` work

### Purpose

This doc defines the runtime-removal follow-on for the already-landed `Catalog-Gen0 - Phase 2 - Ownership Boundary Cleanup`.

Use it to answer:
- how to remove the Browser `References` startup baseline from first-load behavior
- which runtime seams still create that legacy baseline today
- how to retire manifest-backed startup seeding without deleting true imported-reference behavior
- how to keep later optional repo-backed reference access routed through `Catalog` instead of Browser preload

### Why This Phase Exists

`Catalog-Gen0 - Phase 2` already locked the ownership read:
- Browser-side manifest preload is the legacy baseline to retire
- Catalog browse should own later optional repo-backed reference access
- imported references should remain a real downstream state after actual intake

But the runtime has not landed that removal yet.

Today the app still starts with Browser `References` content because manifest-backed reference records are seeded into startup state and projected straight into the Browser tree.

This doc exists so that removal can happen through one explicit narrow runtime cut instead of getting lost inside broader `Gen0`, asset-home migration, or later `Catalog-1` work.

### Scope

This doc covers:
- removing the Browser `References` root from first-load baseline behavior
- retiring manifest-backed startup seeding from the reference workspace
- preserving imported-reference behavior after actual intake
- focused Browser and store proof updates for that removal

This doc does not cover:
- moving geometry assets from `ReferenceModels/...` into `Catalog/...`
- widening the Catalog item contract
- adding new Catalog browse or preview behavior
- broader reference-runtime redesign beyond startup-baseline retirement
####
## Doc Body

### Goal

Remove the legacy Browser `References` startup baseline so repo-backed reference families no longer appear as default Browser folders on first load, while preserving real imported-reference behavior after actual intake and leaving later optional repo-backed browsing to `Catalog`.

### Boundaries

This phase should:
- remove the Browser `References` startup root and category rows that exist only because of manifest preload
- stop seeding manifest-backed reference records into startup `referenceWorkspace` state
- preserve imported-reference visibility after true intake or downstream commit
- keep later optional repo-backed reference access on the `Catalog` path

This phase should not:
- migrate asset paths into `public/Catalog/...`
- remove downstream reference runtime behavior after a real import or Catalog commit
- reopen preview-versus-commit ownership or environment-apply ownership
- widen into `Catalog-1`, `Catalog-2`, or later asset-family behavior

### Architecture Direction

The healthy read for this phase is:
- `useAppStore.ts` should stop acting like Browser preload owns the default reference baseline
- Browser should stop mounting a `References` root just because the repo ships manifest reference entries
- imported-reference state should remain a real downstream state after actual intake
- `Catalog` should stay the later intentional browse home for optional repo-backed reference families

The healthy product read is:
- the user no longer lands in a Browser tree that already contains `footpads`, `shoes`, and `premade-foothooks`
- those optional reference families are not implied default project content anymore
- imported or Catalog-committed reference content can still appear later through true user action

### Current Live Read

The current runtime still creates the old Browser baseline through a small cluster of store and panel seams:

- `src/app/store/useAppStore.ts`
  - still builds initial reference records from `REFERENCE_MANIFEST_ITEMS` through `buildInitialReferenceRecords(...)`
  - still seeds those records into startup `referenceWorkspace.importedReferencesById`
  - still seeds their order into `importedReferenceOrder`
  - still treats that manifest-backed state as a Browser-facing baseline instead of only a downstream imported state
- `src/app/store/useAppStore.ts`
  - `selectReferenceWorkspaceBrowserTree(...)` still projects those manifest-backed records into a Browser `References` root
  - `REFERENCE_ROOT_ROW_ID` still acts as the stable Browser row id for that legacy root
  - the tree still exposes category rows such as `footpads`, `shoes`, and `premade-foothooks`
- `src/app/panels/useBrowserPanelController.ts`
  - still consumes the reference-workspace Browser tree directly
  - therefore still gives the Browser panel the legacy startup baseline instead of only later imported-reference state
- proof seams
  - `src/app/store/useAppStore.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/panels/selectBrowserTreeRows.test.ts`
  - nearby Browser interaction or context-menu proof may also still assume the default `References` root exists at startup

So the live read is already narrow:
- the old baseline is not spread everywhere
- it is mainly a startup seeding plus Browser-tree projection path
- that makes it a good `Gen0` runtime-removal cut instead of a large redesign

### Acceptance Read

`Catalog-Gen0.2.1` is healthy when:
- first load no longer shows a Browser `References` root created from manifest preload
- manifest-backed repo references are no longer seeded into startup Browser state
- imported references can still appear after real intake or downstream Catalog commit
- later optional repo-backed reference browsing stays a `Catalog` responsibility instead of falling back to Browser preload
- the phase lands without widening into asset-home migration or broader Catalog-family work

## Wishlist Organization

### High Level Goals

- [x] `HLG 1. Remove Browser-side Manifest-backed Reference Folders From The Default Startup Browse`
- [x] `HLG 2. Retire Manifest-backed Startup Seeding As The Browser Baseline Owner`
- [x] `HLG 3. Preserve True Imported-reference Behavior After Real Intake While Routing Optional Repo-backed Browse Through Catalog`

### `Catalog-Gen0.2.1 Phase 1`

- [x] `1. Manifest-backed Reference Records Stop Seeding Startup Reference Workspace State`
- [x] `HLG 2. Retire Manifest-backed Startup Seeding As The Browser Baseline Owner`

### `Catalog-Gen0.2.1 Phase 2`

- [x] `2. The Browser References Root No Longer Appears On First Load`
- [x] `HLG 1. Remove Browser-side Manifest-backed Reference Folders From The Default Startup Browse`

### `Catalog-Gen0.2.1 Phase 3`

- [x] `3. Imported References Still Work After Real Intake Or Downstream Catalog Commit`
- [x] `HLG 2. Retire Manifest-backed Startup Seeding As The Browser Baseline Owner`
- [x] `HLG 3. Preserve True Imported-reference Behavior After Real Intake While Routing Optional Repo-backed Browse Through Catalog`

### `Catalog-Gen0.2.1 Phase 4`

- [x] `4. Focused Store And Browser Proof Surfaces Reflect The New Startup Read`
- [x] `HLG 1. Remove Browser-side Manifest-backed Reference Folders From The Default Startup Browse`
- [x] `HLG 3. Preserve True Imported-reference Behavior After Real Intake While Routing Optional Repo-backed Browse Through Catalog`

## [x] `Catalog-Gen0.2.1` - `Phase 1 - Startup Manifest Seeding Removal`

### Phase 1 Summary
#### Purpose

Stop the app from seeding manifest-backed reference records into startup `referenceWorkspace` state so Browser preload no longer acts like the default owner of imported references.

#### Owns

- retiring manifest-backed startup seeding from the reference workspace

#### Does Not Own

- Browser root or tree removal beyond what seeding cleanup strictly requires
- imported-reference preservation follow-through after real intake
- focused Browser proof updates beyond the first store-facing change
- repo asset-home migration into `public/Catalog/...`
- broader reference-runtime redesign
- Catalog browse-shell widening
- item metadata, preview behavior, or commit-path redesign

#### Current Live Read

The live seams for this phase are:

- `src/app/store/useAppStore.ts`
  - `buildInitialReferenceRecords()` still turns every `REFERENCE_MANIFEST_ITEMS` entry into one startup `ImportedReferenceRecord` with `sourceKind: 'manifest'`
  - `INITIAL_REFERENCE_RECORD_ORDER` still mirrors that same manifest inventory into the default startup order
  - the initial `referenceWorkspace` state still uses those two startup helpers to prefill `importedReferencesById` and `importedReferenceOrder`
  - `selectReferenceWorkspaceBrowserTree(...)` still consumes that imported-reference state later, but Phase 1 should treat that Browser tree as downstream and leave it untouched
- proof owners
  - `src/app/store/useAppStore.test.ts`
  - already contains startup-state assumptions where manifest ids such as `shoe:shoe-1` exist immediately after `useAppStore.getInitialState()`
  - already uses the default manifest-backed reference count as baseline truth in movement and reference-workspace expectations

So the honest live read for Phase 1 is:

- the Browser `References` startup baseline is currently born in store initialization, not in the Browser panel itself
- `buildInitialReferenceRecords()` and `INITIAL_REFERENCE_RECORD_ORDER` are the narrowest first-cut owners
- the first pass can stay small if it retires those startup helpers and only updates store proof that encodes the old preload assumption
- Browser tree removal, controller cleanup, and later imported-reference preservation should stay deferred to later phases instead of getting folded into this first cut

#### First Pass Decisions

- remove startup seeding first before deleting Browser tree reads
- keep this cut store-owned
- retire the default manifest-backed initial-state fill at its source instead of adding Browser-layer guards
- treat any remaining Browser `References` root as a known temporary follow-on for Phase 2
- keep later imported-reference preservation and proof follow-through as explicit next phases
- keep the cut narrow enough that asset-home migration remains separate follow-up work

### Phase 1 Implementation Spec
#### Exact First Code Cut

1. Remove the `buildInitialReferenceRecords()` plus `INITIAL_REFERENCE_RECORD_ORDER` startup fill from the default `referenceWorkspace` initialization path in `useAppStore.ts`.
2. Leave `selectReferenceWorkspaceBrowserTree(...)`, `REFERENCE_ROOT_ROW_ID`, and Browser-controller consumption untouched so this cut only changes the startup store baseline.
3. Leave downstream imported-reference runtime untouched so real intake and later commit behavior are not reworked in this phase.
4. Update only the store proof that directly describes startup seeding behavior.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

#### No-Widening Rule

- do not migrate assets into `public/Catalog/...` here
- do not redesign imported-reference runtime behavior beyond startup-baseline retirement
- do not remove the Browser `References` root in this phase
- do not widen into new Catalog browse features or new reference-family metadata
- do not reopen preview-session, environment-apply, or downstream Browser-project ownership

#### Implementation Risks

- accidentally coupling startup seeding removal to Browser tree deletion too early
- leaving fallback startup assumptions hidden in helpers or tests
- conflating manifest preload retirement with removal of all imported-reference state

#### Checklist

- [x] manifest-backed reference records no longer seed default startup state
- [x] the default `referenceWorkspace.importedReferencesById` and `importedReferenceOrder` no longer mirror `REFERENCE_MANIFEST_ITEMS` on first load
- [x] focused store proof covers the new startup read

#### Verification Shape

Minimum verification for this phase should cover:

- store proof that startup state no longer seeds manifest-backed imported references by default

#### Done Shape

This phase is done when startup `referenceWorkspace` state no longer comes prefilled from `REFERENCE_MANIFEST_ITEMS`, while later phases still remain responsible for removing the Browser `References` root, preserving imported-reference follow-through, and updating the rest of the affected proof surfaces.

#### Implementation Read

This phase is now landed in:

- `src/app/store/useAppStore.ts`
  - default `referenceWorkspace` startup state now begins with empty `importedReferencesById` and empty `importedReferenceOrder`
  - the old manifest-backed startup helper fill has been removed from the initial state path
- `src/app/store/useAppStore.test.ts`
  - startup proof now explicitly asserts that first-load state does not seed manifest-backed imported references
  - scenarios that still need legacy manifest reference fixtures now build those fixtures locally inside the test file instead of relying on startup preload truth

## [x] `Catalog-Gen0.2.1` - `Phase 2 - Browser References Root Removal`

### Phase 2 Summary
#### Purpose

Remove the Browser `References` root and category rows that only existed to project the old manifest-backed startup preload into first-load browse.

#### Owns

- removing the Browser `References` startup root from first-load browse
- retiring Browser-tree projection that only existed for manifest preload
- updating the Browser-facing selectors or controller seams that currently consume that root

#### Does Not Own

- startup seeding retirement beyond the already-landed Phase 1 change
- imported-reference preservation after real intake
- broader Browser redesign beyond the legacy reference root removal
- asset-home migration or Catalog browse widening

#### Current Live Read

The current Browser-facing seams for this phase are:

- `src/app/store/useAppStore.ts`
  - `selectReferenceWorkspaceBrowserTree(...)`
  - `REFERENCE_ROOT_ROW_ID`
  - any helper paths that still mount the `References` root into Browser rows
- `src/app/panels/useBrowserPanelController.ts`
  - current Browser consumption of the reference-workspace tree
- proof owners
  - `src/app/panels/selectBrowserTreeRows.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`

The post-Phase-1 live read is now more specific:

- startup `referenceWorkspace.importedReferencesById` and `importedReferenceOrder` now start empty
- but `selectReferenceWorkspaceBrowserTree(...)` still always returns a root VM with:
  - `rowId: REFERENCE_ROOT_ROW_ID`
  - `label: 'References'`
  - manifest category rows created from `REFERENCE_MANIFEST_CATEGORIES` even when there are no imported references yet
- `useBrowserPanelController.ts` still memoizes that tree unconditionally and still passes `REFERENCE_ROOT_ROW_ID` into Browser row-selection and row-interaction seams
- the collapsed-row bookkeeping effect still treats the `References` root and each category row as always-controlled Browser rows

So the honest live read for Phase 2 is:

- Phase 1 removed the startup data preload, but not the Browser shell that advertises that old baseline
- the next cut is mainly a Browser-tree and Browser-controller honesty pass
- the root should disappear from first-load browse because there is now no startup-owned reason for it to exist
- later imported-reference display must remain a separate follow-up concern so Phase 2 does not widen into preservation logic that belongs to Phase 3

#### First Pass Decisions

- remove the legacy Browser root after startup seeding has been retired
- keep this phase focused on first-load Browser browse, not all later imported-reference display
- keep the cut narrow enough that imported-reference follow-through can be protected in the next phase
- treat the post-Phase-1 empty startup state as the new baseline and make the Browser tree honest to that state
- prefer retiring unconditional root synthesis in the selector over layering Browser-panel visibility guards on top of a fake root
- keep `REFERENCE_ROOT_ROW_ID` cleanup scoped to first-load Browser usage only; do not widen into every downstream selected-target or context-path seam yet
- leave any later conditional root reappearance for true imported references to Phase 3 rather than rebuilding that behavior here

### Phase 2 Implementation Spec
#### Exact First Code Cut

1. Change `selectReferenceWorkspaceBrowserTree(...)` so it no longer synthesizes a Browser `References` root plus manifest category rows when there are no true imported-reference rows to display.
2. Retire the preload-only category projection from first-load Browser browse instead of preserving an empty root built from `REFERENCE_MANIFEST_CATEGORIES`.
3. Update `useBrowserPanelController.ts` seams that currently assume the root always exists:
   - Browser selected-row resolution input
   - collapsed-row synchronization for reference-controlled rows
   - any interaction filtering that still treats `REFERENCE_ROOT_ROW_ID` as a guaranteed mounted Browser row
4. Update only the Browser-facing proof that directly encodes the old always-mounted root assumption.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`

#### No-Widening Rule

- do not reintroduce startup seeding in order to keep old Browser tests passing
- do not widen into imported-reference preservation logic beyond what root removal strictly requires
- do not migrate assets or reopen Catalog browse behavior
- do not redesign Browser grouping or selection beyond the specific reference-root assumptions touched by this cut
- do not make `Catalog` responsible for rendering replacement Browser rows in this phase

#### Implementation Risks

- leaving hidden root assumptions behind in Browser selectors
- removing later imported-reference display instead of only the preload-driven startup root
- coupling Browser cleanup to unrelated panel behavior
- preserving an empty `References` shell through fallback VM defaults even after selector cleanup
- over-cleaning `REFERENCE_ROOT_ROW_ID` usage in ways that break later imported-reference follow-through before Phase 3 lands

#### Checklist

- [x] startup Browser browse no longer shows the manifest-backed `References` root
- [x] preload-only category rows no longer mount into first-load Browser browse
- [x] Browser controller seams no longer assume the legacy root always exists at startup

#### Verification Shape

Minimum verification for this phase should cover:

- Browser-facing proof that first load no longer exposes the old `References` root
- focused selector or panel proof that empty startup reference state no longer yields preload-only category rows

#### Done Shape

This phase is done when the old preload-driven `References` root is gone from first-load Browser browse and the remaining work has narrowed to preserving true imported-reference follow-through plus updating the focused proof surfaces.

#### Implementation Read

This phase is now landed in:

- `src/app/store/useAppStore.ts`
  - `selectCurrentProjectContentBrowserRows(...)` now stops synthesizing the Browser `References` assembly and preload-only category rows when the reference workspace has no items
  - first-load Browser content rows now stay honest to the empty post-Phase-1 startup reference state instead of rebuilding the old Browser baseline shell
- `src/app/panels/useBrowserPanelController.ts`
  - collapsed-row synchronization now only treats the legacy reference root and category rows as mounted when those rows actually exist in Browser content rows
- `src/app/store/useAppStore.test.ts`
  - startup proof now explicitly asserts that first-load Browser content rows do not contain the `reference-root` assembly or any preload-only reference category rows
  - nearby imported-reference content-row proof still confirms the later `References` hierarchy path survives once real reference items exist

## [x] `Catalog-Gen0.2.1` - `Phase 3 - Imported Reference Preservation`

### Phase 3 Summary
#### Purpose

Preserve real imported-reference Browser behavior after actual intake or downstream Catalog commit so removing the startup preload does not accidentally delete the true imported-reference path.

#### Owns

- preserving imported-reference Browser visibility after true intake
- preserving downstream follow-through after Catalog commit into imported-reference state
- tightening any now-needed separation between preload removal and true imported-reference display

#### Does Not Own

- startup seeding retirement beyond the already-landed Phase 1 change
- first-load Browser root removal beyond the already-landed Phase 2 change
- broad imported-reference redesign
- new Catalog browse or commit semantics

#### Current Live Read

The current downstream seams still worth protecting are:

- `src/app/store/useAppStore.ts`
  - imported-reference state after real intake or commit
- nearby Catalog-to-project or imported-reference paths that currently write true imported-reference records
- Browser-facing consumers that should still render later imported references after user action

#### First Pass Decisions

- preserve user-driven imported-reference behavior explicitly
- do not restore preload-era startup behavior just to keep later imported references visible
- keep the distinction honest between default startup baseline and later user-created imported state

### Phase 3 Implementation Spec
#### Exact First Code Cut

1. Verify the downstream imported-reference write path still produces Browser-visible state after true intake or Catalog commit.
2. Adjust any selectors or Browser consumers that now need to read only true imported-reference state instead of the old preload baseline.
3. Keep the resulting behavior scoped to actual user-driven imported references.

#### Likely Files

- `src/app/store/useAppStore.ts`
- nearby imported-reference write or commit seams only if the preservation path needs a tiny adapter follow-through
- Browser consumers only if they need narrow later-import handling

#### No-Widening Rule

- do not recreate the Browser startup baseline
- do not widen into reference identity, recall, or rebind policy
- do not widen into broader Catalog commit redesign

#### Implementation Risks

- preserving nothing because the old preload path was doing hidden double duty
- reintroducing the startup baseline accidentally while trying to preserve later imports
- widening into downstream reference-runtime rules that belong to later work

#### Checklist

- [ ] imported references still appear after real intake
- [ ] imported references still appear after downstream Catalog commit
- [ ] the preserved path stays user-driven instead of restoring startup preload

#### Verification Shape

Minimum verification for this phase should cover:

- follow-through proof that imported-reference behavior still works after a real downstream intake path

#### Done Shape

This phase is done when removing the startup preload no longer threatens the true imported-reference path and the remaining work has narrowed to final focused proof updates around the new startup read.

#### Implementation Read

This phase is now landed in:

- `src/app/store/useAppStore.ts`
  - the downstream imported-reference Browser path still remains available after true imported-reference state exists instead of depending on the old startup preload shell
- `src/app/store/useAppStore.test.ts`
  - nearby imported-reference content-row proof continues to assert that the later `References` hierarchy appears once real imported-reference items exist
- focused `Catalog-Gen0.2.1` follow-through
  - the runtime-removal ladder now preserves the imported-reference path while keeping first-load Browser state honest to the empty startup baseline

## [x] `Catalog-Gen0.2.1` - `Phase 4 - Focused Proof Update`

### Phase 4 Summary
#### Purpose

Update the focused store and Browser proof surfaces so the new startup read stays explicit, stable, and easy to maintain.

#### Owns

- updating store proof for the retired startup seeding behavior
- updating Browser proof for the removed first-load `References` root
- updating focused follow-through proof for preserved imported-reference behavior

#### Does Not Own

- new runtime behavior beyond what earlier phases already changed
- broader test cleanup outside the affected store and Browser surfaces
- unrelated Browser interaction rewrites

#### Current Live Read

The strongest nearby proof owners are:

- `src/app/store/useAppStore.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- nearby Browser interaction or context-menu proof only if it still directly assumes the old startup root

#### First Pass Decisions

- keep proof updates focused on startup-read truth
- prefer changing the minimum set of tests that actually encode the old preload assumption
- leave unrelated Browser proof alone

### Phase 4 Implementation Spec
#### Exact First Code Cut

1. Update store tests that still expect manifest-backed startup seeding.
2. Update Browser-facing tests that still expect the default `References` root on first load.
3. Add or adjust focused proof that real imported references still appear after user-driven intake or Catalog commit.

#### Likely Files

- `src/app/store/useAppStore.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- nearby Browser interaction or context-menu proof only if directly affected

#### No-Widening Rule

- do not turn this into broad test refactoring
- do not widen test changes into unrelated Browser behavior
- do not add new runtime behavior in the proof phase

#### Implementation Risks

- rewriting too much proof instead of only the startup-read assumptions
- missing one remaining startup-root assumption and leaving flaky expectations behind
- hiding a real behavior regression under over-broad test rewrites

#### Checklist

- [ ] store proof reflects retired startup seeding
- [ ] Browser proof reflects removed startup `References` root
- [ ] focused follow-through proof reflects preserved imported-reference behavior

#### Done Shape

This phase is done when the store and Browser proof surfaces clearly encode the new truth: the app no longer starts with Browser `References` folders created from manifest preload, while true imported-reference behavior still exists after real user-driven intake and later Catalog work can honestly own optional repo-backed browse without Browser preload still shadowing that ownership.

#### Implementation Read

This phase is now landed in:

- `src/app/store/useAppStore.test.ts`
  - startup proof now encodes that manifest-backed imported references do not seed first-load state and that Browser content rows do not synthesize the old `References` startup shell
- `src/app/panels/selectBrowserTreeRows.test.ts`
  - focused Browser proof now stays honest to the empty startup reference state instead of assuming the old preload-only category rows still mount
- nearby Browser proof surfaces
  - the focused Browser and imported-reference follow-through proof now reflect the post-removal startup read without reopening the old Browser preload baseline

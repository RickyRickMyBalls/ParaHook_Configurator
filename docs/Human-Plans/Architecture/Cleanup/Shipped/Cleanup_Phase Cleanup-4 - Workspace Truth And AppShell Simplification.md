# Cleanup Phase Cleanup-4 - Workspace Truth And AppShell Simplification

## Doc Header

### Doc History
8. 2026-04-12 22:21:41: Closed out this standalone `Cleanup 4` phase record after all four internal phases shipped, marked the top-level lane complete, and prepared the doc to move from `Cleanup/Future/` into `Cleanup/Shipped/` so the family handoff to `Cleanup 4A` points at a finished workspace-truth cleanup record instead of an in-progress future plan
7. 2026-04-12 22:18:15: Completed `Phase 4 - Retire Migration-Era Ownership Leakage` as a focused code-and-verification pass by isolating the retained legacy editor split replay and detached browser/console restore plumbing into explicit workspace-side compatibility bridges, shrinking `AppShell.tsx` and `useWorkspacePersistenceBridge.ts` away from transitional owner-like behavior without changing the canonical workspace owner
6. 2026-04-12 22:08:46: Completed `Phase 3 - Reduce AppShell To Composition Over Workspace Truth` as a focused code-and-verification pass by moving the workspace persistence hydration, persisted-layout write-back, and legacy split replay band out of `src/app/AppShell.tsx` into the new `src/app/workspace/useWorkspacePersistenceBridge.ts` hook, reducing the shell back toward composition while intentionally leaving split-menu policy and the broader migration-retirement seam for later cleanup phases
5. 2026-04-12 22:01:34: Completed `Phase 2 - Trace Host Re-Ownership Hotspots` as a docs-and-verification pass by adding one explicit host re-ownership inventory across `AppShell.tsx`, `workspaceSurfaceActions.ts`, `PopupWorkspaceShell.tsx`, `workspacePersistence.ts`, and the AppShell host hooks, separating supporting read-model seams from acceptable coordination, owner-like split and placement orchestration that should shrink in `Phase 3`, and legacy split/persisted-layout migration residue that belongs to `Phase 4`
4. 2026-04-12 21:59:15: Tightened `Phase 2 - Trace Host Re-Ownership Hotspots` into an implementation-ready docs-and-verification pass grounded in the live seam where `AppShell.tsx` still carries workspace persistence hydration, legacy split migration, detached viewer floating coordination, and split-menu glue while `workspaceSurfaceActions.ts`, `PopupWorkspaceShell.tsx`, and the AppShell host hooks still expose policy-shaped mutation helpers that need to be classified before any code cleanup starts
3. 2026-04-12 21:57:39: Completed `Phase 1 - Reconfirm Workspace Truth Boundaries` as a docs-and-verification pass by locking one explicit workspace owner baseline around `src/app/workspace/useWorkspaceStore.ts`, naming `AppShell`, popup shells, workspace helpers, and host seams as supporting-only readers/coordinators instead of second owners, and separating nearby app-wide active-surface and optional-scope decisions from the canonical workspace truth bucket
2. 2026-04-12 21:50:49: Tightened `Cleanup 4 - Workspace Truth And AppShell Simplification` into an implementation-ready cleanup lane grounded in the live repo seam where `src/app/workspace/useWorkspaceStore.ts` is already the canonical workspace owner but `AppShell`, popup shells, workspace action helpers, and persistence/migration glue still carry recovery and coordination bands that can feel owner-like, expanding the internal `Phase 1` through `Phase 4` ladder into a concrete docs-and-code sequence before the later `Cleanup 4A` surface-catalog follow-on
1. 2026-04-12 13:42: Created this standalone `Cleanup 4` future phase doc to hold the top-level workspace-truth and AppShell simplification lane under the Cleanup family

### Purpose

This doc defines the fourth cleanup phase for the `Cleanup` family.

Use it to answer:
- what the workspace truth cleanup is trying to fix
- how `useWorkspaceStore` and `AppShell` should relate
- what the likely high-level cleanup ladder is for this lane

Do not use it for:
- detailed AppShell extraction specs that already belong to AppShell family docs
- broad workspace feature planning unrelated to cleanup
- code-level implementation notes for one hook or host

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - AppShell/workspace simplification lane framing

- `../Canonical-Ownership-Targets.md`
  - workspace ownership target

- `../../AppShell/AppShell-Index.md`
  - AppShell family direction

## Doc Body

## [x] Cleanup 4 - Workspace Truth And AppShell Simplification

### Header

Purpose:
- reduce top-level workspace and shell ambiguity by keeping workspace layout and placement truth clearly canonical in `useWorkspaceStore` while shrinking `AppShell` and related hosts back toward composition and coordination

Owns:
- workspace truth versus host truth clarification
- AppShell simplification at the ownership level
- retirement of migration-era workspace ownership leakage

Does not own:
- new workspace behavior
- full feature planning for every workspace mode
- detailed single-hook extraction steps

### Why This Phase Exists

The cleanup docs already show that workspace truth is one of the major ownership risks:
- layout
- placement
- surface kind per slot
- detached/floating/popout state
- viewport-local presentation state

If those truths spread into hosts and popup shells, cleanup gets harder and behavior becomes harder to localize.

This phase exists to keep that from becoming permanent architecture.

### Scope

This phase covers:
- workspace slot/layout truth
- surface placement truth
- AppShell and host responsibilities relative to workspace truth
- remaining migration-era or host-local ownership leakage

This phase does not cover:
- new workspace UX
- the full workspace roadmap
- generic file-shortening with no ownership gain

### Current Read

The live repo already points at the intended owner split, but it is not fully calm yet.

- `src/app/workspace/useWorkspaceStore.ts`
  - already acts like the canonical workspace owner
  - carries slot tree state, split layout nodes, detached surfaces, browser shell placement, editor surface placement, active viewer viewport identity, and persisted workspace hydration
- `src/app/AppShell.tsx`
  - is still the top-level composition root, which is correct
  - but also still carries a large workspace-host band around store reads, persistence hydration, detached-surface restore, legacy split migration, detached viewer floating coordination, and split-menu / resize glue
- supporting workspace seams already exist but still need a cleaner owner read:
  - `src/app/workspace/workspacePersistence.ts`
  - `src/app/workspace/workspaceSurfaceActions.ts`
  - `src/app/workspace/useWorkspaceChildWindow.ts`
  - `src/app/workspace/PopupWorkspaceShell.tsx`
  - `src/app/workspace/WorkspaceViewportTree.tsx`
- host seams under `src/app/hosts/` are materially better than the older inline shell state, but they still help show where host-local behavior can start feeling like workspace ownership if the boundary is not restated clearly
- the later `Cleanup 4A` workspace-surface catalog lane should remain separate
  - `Cleanup 4` should simplify top-level workspace truth first
  - it should not widen into full surface capability taxonomy, singleton policy, or optional-surface product decisions for dashboard/notepad/radio

### Locked Direction

- workspace layout and surface placement live in `useWorkspaceStore`
- `AppShell` composes and coordinates around that truth
- hosts may render and react, but should not become layout owners
- migration logic should shrink instead of becoming permanent workspace architecture

### Phase Ladder

## [x] Phase 1 - Reconfirm Workspace Truth Boundaries

### Header

#### Purpose:
- restate exactly which workspace truths are canonical in `useWorkspaceStore` so later cleanup can shrink `AppShell` and host seams against one explicit owner baseline instead of against a fuzzy "workspace stuff" bucket

#### Current read:
- the cleanup owner docs already lock workspace layout and placement to `src/app/workspace/useWorkspaceStore.ts`
- the live repo agrees in practice, because the workspace store already owns:
  - viewport slot tree
  - split layout nodes
  - detached surface records
  - browser shell placement state
  - editor surface placement
  - active viewer viewport id
  - viewport-local chrome and result-mode state
- what is still soft is not the store itself, but the exact supporting-only boundary for:
  - `AppShell`
  - popup shells
  - workspace action helpers
  - persistence and migration helpers

#### Read:
- `Phase 1` should stay a docs-and-verification pass
- the right job here is to lock the owner/supporting split before tracing hotspot files in detail
- this phase should not widen into code changes, hook extraction, or AppShell cleanup yet

#### Locked Phase 1 in-scope:
- restate the canonical workspace owner baseline using the shipped cleanup decision docs plus the live repo seam
- name the main supporting-only surfaces that may read, render, coordinate, or persist workspace truth without becoming owners
- separate workspace truth from nearby but different truths such as:
  - app-wide active surface and selected target in `useAppStore`
  - optional-surface product scope decisions
  - viewer-only presentation state that is not canonical workspace layout truth

#### Locked Phase 1 out-of-scope:
- changing code
- moving helper functions
- new workspace capability taxonomy
- optional-surface product decisions
- host hotspot inventory beyond what is needed to lock the boundary

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`

#### Strongest live repo seams for this pass:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`
- `src/app/workspace/PopupWorkspaceShell.tsx`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/hosts/`

#### Preferred Phase 1 implementation shape:
- keep this as a docs-and-verification pass
- write one explicit workspace-truth baseline inside this doc
- stop once later phases can audit hotspots against that baseline instead of re-answering what the store, shell, and popup hosts should each own

### Implementation spec:
1. Re-read the cleanup owner-target and owner-decision docs for workspace layout and placement.
2. Re-scan the live workspace seam in:
   - `useWorkspaceStore.ts`
   - `AppShell.tsx`
   - popup shell and workspace helper files
3. Write one explicit baseline that answers:
   - which truths are canonical in `useWorkspaceStore`
   - which nearby surfaces are supporting-only
   - which adjacent truths are intentionally not part of the workspace owner bucket
4. Stop once `Phase 2` can trace re-ownership hotspots against one named boundary instead of against broad "workspace shell cleanup" language.

#### Implementation stop rule:
- `Phase 1` is ready to implement once the next pass can cite one explicit workspace owner baseline and supporting-only list
- do not widen this into hotspot inventory or code cleanup just to make the phase feel larger

#### Checklist:
- [x] re-read the workspace owner direction in the cleanup docs
- [x] scan the live repo seam around workspace store, AppShell, popup shell, and helper files
- [x] write the explicit workspace-truth baseline
- [x] separate workspace truth from app-wide active selection and optional-surface scope decisions
- [x] stop before code changes or hotspot inventory

#### Target output:
- one explicit workspace owner baseline for later `Cleanup 4` phases

#### Done shape:
- later phases can cite a stable workspace owner baseline
- the family stops treating `AppShell` versus workspace store ownership as still-open every time workspace cleanup starts
- `Phase 2` can trace leaks against one honest target instead of against broad shell discomfort

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`

#### Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- manually confirm in the repo that:
  - `useWorkspaceStore.ts` already holds the main workspace layout and placement truth
  - `AppShell.tsx` still reads heavily from that truth instead of replacing it
  - popup shell and helper seams exist as supporting readers/coordinators around that store
- confirm the resulting baseline matches both the docs and the live repo seam rather than inventing a future-only workspace model

#### Workspace Truth Boundary Baseline

This is the locked workspace owner baseline later `Cleanup 4` phases should cite directly when deciding whether a workspace-related seam is canonical truth, supporting coordination, or a separate adjacent system.

##### Canonical workspace owner

- `src/app/workspace/useWorkspaceStore.ts`

##### Truths that belong in the workspace owner bucket

- viewport slot tree
- split layout nodes
- detached surface records
- floating versus popout versus slotted placement
- surface kind per slot
- browser shell placement state
- editor surface placement state
- active viewer viewport id
- viewport-local chrome and result-mode state that belong to workspace presentation
- persisted workspace layout state once it is hydrated back into canonical workspace state

##### Supporting-only surfaces that may read, render, coordinate, or persist workspace truth

- `src/app/AppShell.tsx`
  - composition root and shell-wide coordinator, not layout owner
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - popup host/presentation surface, not canonical placement owner
- `src/app/workspace/workspacePersistence.ts`
  - persistence and serialization helper around workspace truth, not the truth owner itself
- `src/app/workspace/workspaceSurfaceActions.ts`
  - command/helper layer over workspace state transitions, not a second policy owner
- `src/app/workspace/useWorkspaceChildWindow.ts`
  - child-window bridge for workspace surfaces, not canonical placement truth
- `src/app/workspace/WorkspaceViewportTree.tsx`
  - render/composition surface over the slot tree, not the slot-tree owner
- host hooks and host components under `src/app/hosts/`
  - coordination and render support only unless a later phase proves a narrower owner-like hotspot

##### Explicitly not part of the workspace owner bucket

- app-wide active workspace surface and selected workspace target
  - belongs in `src/app/store/useAppStore.ts`
- optional-surface product scope decisions for dashboard, notepad, and radio
  - remain a separate cleanup/product-decision seam
- viewer-only presentation behavior that does not define canonical workspace layout or placement
  - may read from workspace truth without becoming it

##### Boundary rule going forward

- if the question is about where a surface lives, how it is slotted or detached, or what the workspace layout tree currently is, the owner is `useWorkspaceStore`
- if the question is about app-wide active selection or selected target, the owner is not the workspace store
- hosts, popup shells, persistence helpers, and action helpers may coordinate around workspace truth, but later cleanup phases should treat owner-like behavior there as drift to inventory and shrink rather than as acceptable permanent ownership

## [x] Phase 2 - Trace Host Re-Ownership Hotspots

### Header

#### Purpose:
- identify the concrete places where `AppShell`, popup shells, or workspace helpers still act close enough to owners that later cleanup work risks preserving those seams by accident

#### Current read:
- the main likely hotspot is no longer generic "AppShell is big"
- the live seam is narrower and more specific:
  - persistence hydration and write-back in `AppShell.tsx`
  - legacy split-view migration in `AppShell.tsx`
  - detached-surface restore flows that still route through shell-facing code
  - detached viewer floating coordination still hosted in `AppShell.tsx`
  - split-menu targeting and split-resize glue spanning `AppShell.tsx` and `useAppShellWorkspaceMenus.tsx`
  - helper functions in `workspaceSurfaceActions.ts` and `PopupWorkspaceShell.tsx` that mutate workspace state from outside the store while still reading like policy
  - selector/host seams that are likely acceptable support code, but should be named explicitly so later cleanup does not keep re-auditing them

#### Read:
- `Phase 2` should stay a docs-and-verification pass
- the right job here is to inventory the real re-ownership seams before code cleanup starts
- this phase should not yet move code or retire compatibility logic

#### Locked Phase 2 in-scope:
- inspect `AppShell`, popup shell, workspace helpers, and closely related hosts for owner-like behavior
- classify the main hotspots by type, such as:
  - supporting read only
  - coordination but acceptable
  - owner-like and should shrink
  - migration residue to retire later
- name the highest-value targets for `Phase 3` and `Phase 4`

#### Locked Phase 2 out-of-scope:
- fixing the hotspots
- broad host readability cleanup unrelated to workspace ownership
- capability-catalog work for future surfaces
- optional-surface product policy

#### Strongest live repo seams for this pass:
- `src/app/AppShell.tsx`
- `src/app/workspace/PopupWorkspaceShell.tsx`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/hosts/useAppShellWorkspaceMenus.tsx`

#### Preferred Phase 2 implementation shape:
- keep this as a docs-and-verification pass
- inventory hotspots by seam family instead of by vague file-size discomfort
- classify each hotspot under one explicit bucket so `Phase 3` and `Phase 4` can split the work cleanly:
  - supporting read only
  - coordination but acceptable
  - owner-like and should shrink in `Phase 3`
  - migration or compatibility residue for `Phase 4`
- stop once later code passes can cite one concrete hotspot inventory instead of rerunning a full AppShell/workspace read

#### Initial live hotspot anchors:
- `src/app/AppShell.tsx`
  - persistence hydration and write-back
  - legacy split migration
  - detached viewer floating coordination
  - split-menu and resize glue
- `src/app/workspace/workspaceSurfaceActions.ts`
  - policy-shaped mutation helpers over workspace state transitions
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - popup-side split and placement mutation helpers
- `src/app/hosts/useAppShellWorkspaceMenus.tsx`
  - split-menu targeting and commit orchestration
- `src/app/hosts/useAppShellViewportActions.ts`
  - viewport-slot action coordination that may be acceptable support code or may expose narrower owner-like bands
- `src/app/workspace/workspacePersistence.ts`
  - persistence helper that should stay helper-only, not evolve into a parallel layout-policy owner

### Implementation spec:
1. Re-read the `Phase 1` workspace owner baseline.
2. Trace the main workspace host seams in `AppShell`, popup shells, and helper files.
3. Write one explicit hotspot inventory with buckets such as:
   - acceptable supporting coordination
   - owner-like and should shrink in `Phase 3`
   - migration or compatibility leakage to retire in `Phase 4`
4. Stop once the later code passes have a clear target list instead of another open-ended shell cleanup read.

#### Implementation stop rule:
- `Phase 2` is ready to implement once the repo scan can produce one hotspot inventory with clear follow-on ownership
- do not widen this into app-shell extraction work or helper rewrites yet

#### Checklist:
- [x] re-read the `Phase 1` workspace owner baseline
- [x] scan `AppShell`, popup shell, workspace helpers, and nearby host hooks
- [x] write the hotspot inventory with explicit buckets
- [x] name the highest-value `Phase 3` and `Phase 4` targets
- [x] stop before code edits

#### Target output:
- one explicit host re-ownership hotspot inventory

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`

#### Verification:
- manually re-read the `Phase 1` workspace owner baseline in this doc
- manually confirm in the repo that the hotspot inventory is grounded in live seams such as:
  - persistence hydration and migration behavior in `AppShell.tsx`
  - policy-shaped workspace mutation helpers in `workspaceSurfaceActions.ts`
  - popup-side split and placement mutation helpers in `PopupWorkspaceShell.tsx`
  - split-menu orchestration in `useAppShellWorkspaceMenus.tsx`
- confirm the resulting hotspot list distinguishes between:
  - acceptable supporting coordination
  - owner-like seams that should shrink in `Phase 3`
  - migration or compatibility residue that belongs in `Phase 4`
- stop without code edits or helper extraction

#### Host Re-Ownership Hotspot Inventory

This is the completed hotspot inventory later `Cleanup 4` phases should cite directly when deciding which workspace seams merely read the canonical store, which ones are acceptable coordination, and which ones still behave too much like partial owners.

##### Supporting read only

- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - derived selector layer over workspace slots, detached surfaces, split-menu targets, and dock-suppression state
  - reads like a read-model seam, not a second owner
- `src/app/workspace/WorkspaceViewportTree.tsx`
  - render/composition surface over the slot tree
  - should stay derived from canonical workspace layout truth
- `src/app/workspace/workspacePersistence.ts`
  - serialization and normalization helper around persisted layout payloads
  - helper-only so long as persistence policy does not migrate into this file

##### Coordination but acceptable

- `src/app/hosts/useAppShellViewportActions.ts`
  - broad gesture and command coordination layer that calls through to workspace, viewer, console, and spaghetti actions
  - busy, but mostly reads as command routing over existing owners rather than canonical layout ownership
- `src/app/workspace/useWorkspaceChildWindow.ts`
  - child-window bridge for detached/popout surfaces
  - host bridge, not canonical placement owner
- detached viewer floating drag and rect refs in `src/app/AppShell.tsx`
  - still shell-heavy, but much of this reads as host-local floating-window presentation coordination rather than canonical workspace layout truth

##### Owner-like and should shrink in `Phase 3`

- workspace persistence hydration and immediate write-back effects in `src/app/AppShell.tsx`
  - shell-hosted hydration plus replay of persisted workspace layout still reads close to owner behavior instead of thin coordination
- split-menu targeting and commit orchestration in `src/app/hosts/useAppShellWorkspaceMenus.tsx`
  - commits root and slot splits, resets ratios and priorities, closes surfaces, and routes console/editor split behavior
  - this is productive code, but it still reads like layout policy and placement orchestration rather than simple menu rendering
- policy-shaped mutation helpers in `src/app/workspace/workspaceSurfaceActions.ts`
  - resolve surface kind across workspace, console, and spaghetti seams
  - perform browser, console, editor, dashboard, notepad, and viewer split/float/popout/redock orchestration
  - helper layer is useful, but the current fan-out still reads close to a second policy surface over workspace transitions
- popup-side split and placement mutation helpers in `src/app/workspace/PopupWorkspaceShell.tsx`
  - local popup workspace store plus split helpers duplicate a smaller version of workspace layout orchestration outside the canonical workspace store
  - likely narrower than the main shell problem, but still a visible owner-like seam

##### Migration or compatibility residue for `Phase 4`

- `ensureLegacySplitViewMigrated` in `src/app/AppShell.tsx`
  - explicit legacy split-view bridge that replays older editor split state into the newer workspace slot system
- persisted-layout replay in the workspace hydration effect in `src/app/AppShell.tsx`
  - restores older editor placement fields, then separately migrates legacy split placements
  - still necessary today, but clearly migration-shaped rather than canonical workspace ownership
- retained detached/browser restore flows in `src/app/AppShell.tsx`
  - browser split restoration and detached restore routing are still mixed into shell effects in ways that look transitional rather than final owner shape

##### Highest-value next targets

- `Phase 3`
  - narrow the AppShell workspace persistence and hydration band
  - reduce owner-like split-menu orchestration in `useAppShellWorkspaceMenus.tsx`
  - evaluate whether `workspaceSurfaceActions.ts` should keep its current policy fan-out or hand more of that meaning back toward explicit workspace-store actions
- `Phase 4`
  - isolate or retire `ensureLegacySplitViewMigrated`
  - shrink the persisted-layout replay path that still carries split-view migration behavior
  - reduce visibly transitional restore flows that still read like compatibility plumbing in the shell

#### Done shape:
- later code phases know which seams are merely noisy versus which seams are still acting like owners
- `Cleanup 4` can start shrinking the real owner-like hotspots instead of attacking AppShell size in the abstract

## [x] Phase 3 - Reduce AppShell To Composition Over Workspace Truth

### Header

#### Purpose:
- narrow the owner-like workspace host bands in `AppShell` so the shell reads more like composition and coordination over canonical workspace truth instead of a partial workspace manager

#### Current read:
- shipped AppShell-family work already extracted a meaningful amount of shell logic into host hooks and host components
- the remaining `Cleanup 4` problem is more ownership-oriented than readability-oriented:
  - `AppShell` still carries workspace hydration, migration, detached restore, detached viewer float coordination, and split glue close to the top-level composition root
- the best next move is likely a narrow re-homing of specific owner-like bands, not another giant AppShell extraction for its own sake

#### Read:
- `Phase 3` should be a code-and-verification pass
- it should follow the `Phase 2` hotspot inventory
- the goal is to reduce owner-like shell behavior while keeping workspace truth canonical in the store and keeping user behavior unchanged

#### Locked Phase 3 in-scope:
- move or isolate owner-like workspace host bands out of `AppShell` when they have a clearer home in:
  - focused workspace helpers
  - store-owned actions
  - narrow host hooks that are explicitly coordination-only
- keep AppShell behavior stable while simplifying its ownership read
- prefer small targeted changes over broad shell surgery

#### Locked Phase 3 out-of-scope:
- full workspace surface taxonomy work
- new shell UX
- optional-surface policy changes
- deleting migration logic before it is isolated enough to prove safe

#### Likely target seams:
- workspace persistence hydration and write-back glue
- detached surface restore orchestration
- split-menu target and resize glue that still reads like layout policy
- detached viewer floating coordination if it still reads like layout ownership instead of host presentation

#### Done shape:
- `AppShell` reads mainly as composition and coordination
- workspace policy lives closer to workspace state, explicit actions, or narrow coordination hooks
- later migration-retirement work can attack isolated residue instead of a mixed shell body

#### Implementation result

This phase landed as a narrow owner-band reduction instead of a broad shell rewrite.

##### Moved out of `AppShell`

- workspace persistence hydration and persisted-layout write-back
- legacy split replay and migration carry-through that had been sitting inline beside shell composition

##### New focused owner-adjacent seam

- `src/app/workspace/useWorkspacePersistenceBridge.ts`
  - now owns the workspace persistence hydration, workspace persistence subscription, and legacy split replay bridge that used to live inline in `AppShell`
  - still reads as transitional bridge logic, but it is now isolated near the workspace system instead of inflating the shell body

##### Resulting AppShell read

- `src/app/AppShell.tsx`
  - no longer directly owns the inline workspace persistence hydration and write-back band
  - mounts the new workspace persistence bridge hook while staying focused on top-level composition, activation, floating-viewer presentation, and host orchestration

##### Explicit non-goals kept for later phases

- `src/app/hosts/useAppShellWorkspaceMenus.tsx`
  - split-menu policy/orchestration intentionally left for a later narrower pass
- migration retirement itself
  - not yet removed in this phase
  - only isolated away from the shell body so `Phase 4` can attack the retained compatibility seam more directly

## [x] Phase 4 - Retire Migration-Era Ownership Leakage

### Header

#### Purpose:
- retire or isolate the remaining migration and compatibility residue that still behaves like a workspace owner after `Phase 3` has shrunk the shell-facing hotspots

#### Current read:
- the live workspace seam still contains migration-era bands such as:
  - persisted-layout recovery paths
  - legacy split-view migration behavior
  - detached restore compatibility plumbing
- those seams may still be necessary today, but they should stop looking like permanent workspace ownership once the main host boundary is cleaner

#### Read:
- `Phase 4` should be a code-and-verification pass
- it should follow the earlier owner-baseline and hotspot work
- the right job here is to shrink or isolate retained migration behavior without inventing new shadow owners

#### Locked Phase 4 in-scope:
- retire migration-era workspace ownership leakage that is no longer needed
- isolate any still-needed migration behavior so it clearly reads as finite compatibility plumbing rather than canonical layout ownership
- keep persisted-layout behavior stable while reducing architectural confusion

#### Locked Phase 4 out-of-scope:
- broad workspace feature redesign
- capability-catalog work from `Cleanup 4A`
- optional-surface scope decisions
- generic persistence overhaul unrelated to workspace ownership leakage

#### Likely target seams:
- `src/app/AppShell.tsx`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- any small compatibility helper left after `Phase 3`

#### Done shape:
- migration logic has a visibly shrinking footprint
- retained compatibility paths read as explicit bridges instead of workspace owners
- `Cleanup 4` can hand off to later workspace and surface-catalog work from a cleaner ownership base

#### Implementation result

This phase landed as an isolation pass, not a broad migration deletion pass.

##### Compatibility seams isolated near the workspace layer

- `src/app/workspace/useWorkspaceLegacyCompatibilityBridge.ts`
  - now owns the retained legacy editor split replay and live `'split view'` migration bridge that had still been mixed into the general workspace persistence hook
- `src/app/workspace/useWorkspaceDetachedRestoreCompatibilityBridge.ts`
  - now owns the retained detached browser/console restore effects that had still been mixed into `src/app/AppShell.tsx`

##### Resulting owner read after this pass

- `src/app/workspace/useWorkspacePersistenceBridge.ts`
  - now reads as a narrower persisted-layout hydration and write-back bridge instead of also carrying the legacy split migration policy directly
- `src/app/AppShell.tsx`
  - no longer hosts the inline detached browser/console restore compatibility effects
  - stays focused on composition, host orchestration, and presentation coordination instead of transitional restore ownership

##### What intentionally remains true

- compatibility behavior is still supported
  - this pass isolated it rather than deleting it unsafely
- the canonical workspace owner is still `src/app/workspace/useWorkspaceStore.ts`
- split-menu policy/orchestration and broader workspace capability planning remain outside this phase

### Acceptance Checks

- workspace truth has one stable owner
- `AppShell` and hosts stop acting like second layout owners
- migration logic has a shrinking footprint

### Likely Related Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/`
- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/`

### Success Read

This phase succeeds when:
- workspace truth is easier to localize
- AppShell reads as a shell instead of a hidden workspace owner
- later workspace cleanup can target one real owner instead of several partial ones

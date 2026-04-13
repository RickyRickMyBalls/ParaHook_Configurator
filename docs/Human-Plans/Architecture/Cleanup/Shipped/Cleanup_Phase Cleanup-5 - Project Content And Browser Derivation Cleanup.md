# Cleanup Phase Cleanup-5 - Project Content And Browser Derivation Cleanup

## Doc Header

### Doc History
10. 2026-04-12 23:39:51: Closed out this standalone `Cleanup 5` record as shipped by marking the parent cleanup phase complete so the cleanup family can now point at the finished Browser/project-content ownership lane instead of leaving the completed record under `Future/`
9. 2026-04-12 23:32:25: Completed `Phase 4 - Prove Browser Still Reads Honest Hierarchy` as a focused code-and-verification pass by tightening the main selector proof cases to use explicit post-`Phase 3` reference content rows, tightening the shared-reference selection and reference-category drag/drop Browser panel proof cases to exercise unified `projectContentRows`, and verifying with both `cmd /c npm.cmd test -- src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx` and `cmd /c npm.cmd run build` so the cleanup lane now has direct evidence that Browser hierarchy rendering and the key Browser interactions still follow app-owned content truth after the structural fallback removal
8. 2026-04-12 23:21:15: Tightened `Phase 4 - Prove Browser Still Reads Honest Hierarchy` into an implementation-ready code-and-verification pass by narrowing the next work to targeted proof coverage over the post-`Phase 3` path, using the live `selectBrowserTreeRows.test.ts` reference-hierarchy and content-order cases plus `BrowserPanel.test.tsx` collapse, shared-selection, and drag/drop cases so the follow-on can prove Browser behavior still reads app-owned content hierarchy without reopening the runtime cleanup or widening into unrelated Browser test churn
7. 2026-04-12 23:19:15: Completed `Phase 3 - Reduce Browser Rows To Projection Surfaces` as a focused code-and-verification pass by removing the duplicate reference-hierarchy fallback from `selectBrowserTreeRows.ts`, repointing `useBrowserPanelController.ts` so Browser tree composition no longer feeds `referenceWorkspaceTree` as a structural content input, and verifying with `cmd /c npm.cmd run build` while intentionally keeping the remaining `referenceWorkspaceTree` expansion-state synchronization and selector test-call compatibility outside this narrow hierarchy-synthesis cleanup
6. 2026-04-12 23:12:49: Tightened `Phase 3 - Reduce Browser Rows To Projection Surfaces` into an implementation-ready code-and-verification pass by narrowing the next work to the live duplicate hierarchy-synthesis seam where `selectCurrentProjectContentBrowserRows(...)` already emits reference root/category/object rows while `selectBrowserTreeRows.ts` still accepts `referenceWorkspaceTree` and can rebuild that structure as a fallback, so the code pass can reduce Browser row ownership drift by making content rows the one structural input and keeping any remaining reference-tree reads presentation-only
5. 2026-04-12 23:09:32: Completed `Phase 2 - Trace Browser Shadow-Ownership Seams` as a docs-and-verification pass by classifying the live `selectBrowserTreeRows.ts` reference-hierarchy fallback and normalization path, the `useBrowserPanelController.ts` mixed Browser tree aggregation seam, and the `useAppStore.ts` store-adjacent row-building plus Browser drag-order compatibility path into explicit `honest projection`, `acceptable presentation state`, `compatibility residue`, and `owner-like drift` buckets so later cleanup can target the real projection-shrink seams without reopening the already-locked project-content owner baseline
4. 2026-04-12 23:04:23: Tightened `Phase 2 - Trace Browser Shadow-Ownership Seams` into an implementation-ready docs-and-verification pass by grounding the hotspot inventory in the live `selectBrowserTreeRows.ts` reference-hierarchy fallback and normalization path, the `useBrowserPanelController.ts` mixed Browser tree aggregation seam, and the `useAppStore.ts` store-adjacent row-building plus `referenceWorkspace.contentOrderByParentKey` drag-order compatibility path so the next pass can classify real Browser shadow-ownership drift without widening into code cleanup yet
3. 2026-04-12 23:02:24: Completed `Phase 1 - Reconfirm Project Hierarchy Truth In App Store` as a docs-and-verification pass by re-reading the cleanup and repo-vision owner rules against the live `useAppStore`, `selectCurrentProjectContentBrowserRows(...)`, `selectBrowserTreeRows(...)`, `useBrowserPanelController.ts`, and `outputSurface.ts` seams, then locking one explicit baseline where project content hierarchy stays app-owned, Browser rows stay derived, Browser-local collapse/menu/drag state stays presentation-only, and the remaining Browser tree/controller compatibility seams are carried forward as the main `Phase 2` hotspot candidates
2. 2026-04-12 22:58:07: Tightened this standalone `Cleanup 5` phase doc into an implementation-ready cleanup lane by grounding it in the live `useAppStore` project-content owner seam, the current `selectCurrentProjectContentBrowserRows(...)` plus `selectBrowserTreeRows(...)` Browser derivation path, and the cleanup/vision rule that `Graph Documents` and `Content` stay distinct while Browser rows remain derived presentation over project truth
1. 2026-04-12 13:42: Created this standalone `Cleanup 5` future phase doc to give project-content ownership and Browser-derivation cleanup one explicit planning surface under the Cleanup family

### Purpose

This doc defines the fifth cleanup phase for the `Cleanup` family.

Use it to answer:
- where project-content hierarchy truth should live
- what the Browser should keep derived instead of owning
- how to structure this cleanup lane before implementation starts

Do not use it for:
- Browser feature roadmap work unrelated to ownership cleanup
- detailed row rendering polish
- replacing Browser family docs

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - cleanup north star
  - Browser/project-content lane framing

- `../Canonical-Ownership-Targets.md`
  - project hierarchy and Browser-row ownership targets

- `../Canonical-Owner-Decisions.md`
  - explicit decision that Browser rows are derived only

- `../../Workspace-Modes/Workspaces/Browser/Browser-Index.md`
  - Browser-family direction
  - useful for keeping ownership cleanup separate from Browser feature-roadmap work

## Doc Body

## [x] Cleanup 5 - Project Content And Browser Derivation Cleanup

### Header

Purpose:
- keep project-content hierarchy truth clearly canonical in `useAppStore` while reducing Browser rows and Browser-facing structures back to honest derived projections

Owns:
- project-content hierarchy versus Browser-row ownership clarity
- Browser derivation boundaries
- reduction of Browser-side shadow ownership

Does not own:
- broad Browser UX redesign
- unrelated project-content features
- transform-session cleanup beyond the Browser-derived boundary

### Why This Phase Exists

The Browser is one of the easiest places for false ownership to appear.

Why:
- it has a visible tree
- it has row ids
- it has drag/drop and menus
- it has selectors and controller-local expansion state
- it can start to feel like the thing that owns hierarchy instead of the thing that projects hierarchy

But the cleanup direction and repo vision are already stricter than that:
- project hierarchy lives in `useAppStore`
- Browser rows are derived only
- `Graph Documents` and `Content` must stay distinct
- the Browser should not infer long-term project hierarchy from whichever visible row structure happened to ship first

This phase exists so the code can follow those rules more honestly before later Browser cleanup or feature growth makes the projection seam harder to untangle.

### Scope

This phase covers:
- project content hierarchy ownership
- Browser row derivation
- Browser-side hierarchy leakage
- keeping Browser row state as presentation rather than product truth

This phase does not cover:
- every Browser feature or interaction
- general Browser polish
- wider store decomposition outside the ownership need
- replacing Browser family planning docs

### Current Read

The live repo already has the intended owner answer, but the full Browser projection story is still spread across several seams.

- `src/app/store/useAppStore.ts`
  - already owns `projectContent`
  - already owns content owner mutation paths such as `moveProjectContentOwner(...)`
  - already owns owner-resolution helpers such as `resolveOwnedContentSelection(...)` and `resolveProjectContentOwnerRecord(...)`
  - already exposes `selectCurrentProjectContentBrowserRows(...)` as a store-adjacent derived content-row seam
- `src/app/panels/useBrowserPanelController.ts`
  - still assembles the visible Browser tree from:
    - `projectContentRows`
    - `referenceWorkspaceTree`
    - graph rows
    - local collapse state
    - Browser drag/menu/controller glue
  - this is a useful controller seam, but it also makes it easier for Browser-local shaping to start feeling owner-like if the hierarchy baseline is not restated first
- `src/app/panels/selectBrowserTreeRows.ts`
  - still performs the final Browser tree composition over graph rows, content rows, and reference/browser compatibility inputs
  - still contains a compatibility path that can fall back to `referenceWorkspaceTree` when visible reference hierarchy is not yet fully present in content rows
- Browser-family docs already show the same tension:
  - `Browser-10.2` tightened the move toward one Browser tree derivation
  - later Browser phases still reference cleanup around visible hierarchy convergence and owner honesty

So the next honest move is not yet to refactor code blindly.

The next honest move is to lock one explicit owner-versus-derived baseline for current project content and Browser rows, then let later phases classify the remaining Browser-side shadow-ownership seams against that baseline.

### Locked Direction

- assemblies, components, object ownership, and parent-child content hierarchy live in `useAppStore`
- Browser rows are derived presentation over that truth
- row ids may be stable, but row VMs are not canonical product truth
- Browser controllers and selectors should not become hierarchy owners
- `Graph Documents` and `Content` must stay distinct
  - Browser content hierarchy cleanup should make `Content` more honest, not collapse it into another graph-document list
- published graph output and reference compatibility seams may feed project content, but the Browser should still read project hierarchy as a projection over owned app truth rather than as its own stored hierarchy
- controller-local collapse state, menu state, hover/drag state, and similar Browser UI state are acceptable derived presentation state
  - they are not themselves hierarchy truth

### Phase Ladder

## [x] Phase 1 - Reconfirm Project Hierarchy Truth In App Store

### Header

#### Purpose:
- lock one explicit current owner baseline for project content before Browser cleanup starts, so later phases can classify Browser-side row/tree/controller seams against a stable answer instead of against vague "Browser should be derived" language

#### Current read:
- the canonical cleanup answer already exists in the family docs:
  - `Canonical-Ownership-Targets.md`
    - project content hierarchy lives in `useAppStore`
  - `Canonical-Owner-Decisions.md`
    - Browser rows are derived only
- the live repo also already shows the main owner and projection seams:
  - `src/app/store/useAppStore.ts`
    - owns `projectContent`
    - owns content owner mutation paths
    - owns owner-resolution helpers used by Browser-facing selection/drag flows
  - `selectCurrentProjectContentBrowserRows(...)`
    - derives content Browser rows from owned app truth
  - `src/app/panels/selectBrowserTreeRows.ts`
    - performs final Browser tree composition over derived rows and other Browser-visible lanes
  - `src/app/panels/useBrowserPanelController.ts`
    - gathers the visible Browser inputs and Browser-local presentation state
- the remaining ambiguity is not "who should own hierarchy?"
  - it is "which current Browser-facing seams are still pure projection and which ones are drifting toward shadow ownership?"

#### Read:
- `Phase 1` should stay a docs-and-verification pass
- the right job here is to restate the current owner baseline using the live repo seams before `Phase 2` tries to inventory Browser-side shadow-ownership hotspots
- this phase should not widen into controller refactors or row-shape redesign yet

#### Locked Phase 1 in-scope:
- restate the canonical owner for:
  - assemblies
  - components
  - objects
  - parent-child content hierarchy
  - content-side visibility and transform ownership
- make explicit that Browser rows, tree rows, and row VMs are derived presentation
- name the main live owner and projection seams the next phase should inspect
- restate the `Graph Documents` versus `Content` boundary as part of the owner baseline

#### Locked Phase 1 out-of-scope:
- changing runtime code
- rewriting Browser selectors or controllers
- resolving every Browser hotspot immediately
- replacing Browser feature-family planning
- deciding later content-model richness beyond the current owner baseline

#### Strongest input docs for this pass:
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`

#### Strongest live repo seams for this pass:
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/spaghetti/outputSurface.ts`

#### Initial owner-baseline anchors:
- canonical current project-content owner:
  - `projectContent` in `useAppStore.ts`
- canonical Browser content projection seam:
  - `selectCurrentProjectContentBrowserRows(...)`
- final Browser tree derivation seam:
  - `selectBrowserTreeRows.ts`
- Browser controller aggregation seam:
  - `useBrowserPanelController.ts`
- upstream published-content handoff seam that should feed project truth rather than Browser-owned truth:
  - `buildGraphPublishedContentSurface(...)` in `src/app/spaghetti/outputSurface.ts`

#### Preferred Phase 1 implementation shape:
- keep this as a docs-and-verification pass
- write one explicit owner baseline inside this doc
- stop once later phases can cite one stable answer for:
  - where project hierarchy truth lives
  - what the Browser may derive
  - what must stay outside Browser ownership

### Implementation spec:
1. Re-read the cleanup family direction in `Cleanup-Index.md`, `Cleanup-Vision.md`, `Canonical-Ownership-Targets.md`, and `Canonical-Owner-Decisions.md`.
2. Re-read the repo vision guidance that `Graph Documents` and `Content` stay distinct and that Browser/project hierarchy should remain explicit project composition rather than inferred UI structure.
3. Re-scan the live owner and projection seams in:
   - `useAppStore.ts`
   - `selectCurrentProjectContentBrowserRows(...)`
   - `selectBrowserTreeRows.ts`
   - `useBrowserPanelController.ts`
   - `outputSurface.ts`
4. Write one explicit owner baseline that answers:
   - which current hierarchy facts are owned by `useAppStore`
   - which Browser-facing structures are derived only
   - which Browser-local states remain acceptable presentation state
   - which nearby seams should be treated as the main `Phase 2` hotspot candidates
5. Stop once `Phase 2` can audit shadow-ownership drift against that locked baseline instead of re-arguing the owner answer.

#### Implementation stop rule:
- `Phase 1` is ready to implement once there is one explicit doc-backed answer for current project-content ownership versus Browser derivation
- do not widen this into Browser code cleanup or content-model redesign just to make the phase feel larger

#### Checklist:
- [x] re-read the cleanup family direction and owner-decision docs
- [x] re-read the repo vision rules for Browser/project hierarchy and `Graph Documents` versus `Content`
- [x] scan the live owner and Browser-projection seams
- [x] write one explicit project-content owner baseline
- [x] make Browser row/tree/view-model derivation explicit
- [x] identify the main `Phase 2` hotspot seams without fixing them yet
- [x] stop before code edits

#### Target output:
- one explicit project-content owner baseline for later `Cleanup 5` phases

#### Done shape:
- later phases can distinguish owner truth from Browser projection work
- Browser cleanup can cite one stable answer for where hierarchy lives
- the family stops treating row ids, row VMs, or Browser tree structure as if they might be canonical product truth

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`

#### Verification:
- manually re-read:
  - `docs/Vision.md`
  - `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- manually confirm in source that:
  - `useAppStore.ts` still owns `projectContent`
  - `selectCurrentProjectContentBrowserRows(...)` is a derived row-building seam
  - `selectBrowserTreeRows.ts` still performs Browser tree composition over derived inputs
  - `useBrowserPanelController.ts` still gathers Browser-visible inputs and Browser-local presentation state
  - `outputSurface.ts` remains an upstream published-content seam rather than a Browser-owned hierarchy seam
- confirm the resulting baseline keeps `Graph Documents` and `Content` distinct instead of collapsing the two surfaces together

#### Project Content Owner Baseline

This is the locked owner baseline later `Cleanup 5` phases should cite directly when deciding whether a Browser-facing seam is honest projection or shadow ownership.

##### Canonical project-content owner

- `src/app/store/useAppStore.ts` is the canonical current owner of project content hierarchy.
- The current owned truth includes:
  - assemblies
  - components
  - objects
  - parent-child content hierarchy
  - content-object ownership
  - content-side visibility ownership
  - content-side transform ownership

##### Browser content projection

- Browser content rows are derived presentation over owned `projectContent`.
- `selectCurrentProjectContentBrowserRows(...)` is a current store-adjacent projection seam, not a second owner of hierarchy truth.
- `selectBrowserTreeRows.ts` performs final Browser tree composition over derived row inputs and other Browser-visible lanes, but that composition is still projection rather than canonical content ownership.

##### Browser-local presentation state

- Browser-local collapse state, menu state, hover state, drag-preview state, and similar UI/session state are acceptable Browser-owned presentation state.
- These are not hierarchy truth.
- They may shape how owned content is viewed or manipulated, but they should not become the thing that stores project hierarchy.

##### `Graph Documents` versus `Content`

- `Graph Documents` and `Content` remain distinct Browser surfaces.
- `Graph Documents` are authoring identity and graph-routing context.
- `Content` is project-facing published hierarchy.
- `Cleanup 5` should make `Content` more honest as project composition, not collapse it into a second graph-document list.

##### Upstream handoff rule

- upstream graph publication and output-surface logic may feed project content
- that does not make Browser rows the owner
- the Browser should read project hierarchy as presentation over app-owned truth after that handoff, not reconstruct its own hierarchy from whatever visible row structure or runtime grouping happened to exist

##### Main `Phase 2` hotspot candidates

- `src/app/panels/selectBrowserTreeRows.ts`
  - final Browser tree composition
  - remaining compatibility and mixed-lane shaping
- `src/app/panels/useBrowserPanelController.ts`
  - Browser-wide aggregation of project content rows, graph rows, reference tree state, and Browser-local interaction state
- store-adjacent row-building seams in `useAppStore.ts`
  - still close enough to the owner layer that later phases need to distinguish helpful projection from owner blur

#### Implementation result

Phase 1 completed as a docs-and-verification pass.

- The live repo still matches the cleanup owner decision that `useAppStore.ts` owns project content hierarchy.
- The Browser-facing row and tree seams still read as derived projection over that app-owned truth rather than as a second hierarchy store.
- The main follow-on cleanup owners are now explicit:
  - `selectBrowserTreeRows.ts`
  - `useBrowserPanelController.ts`
  - the store-adjacent Browser row-building seam in `useAppStore.ts`

## [x] Phase 2 - Trace Browser Shadow-Ownership Seams

### Header

#### Purpose:
- inventory the specific Browser seams that still risk acting like hierarchy owners instead of projections, so later cleanup can target the real shadow-ownership bands rather than broad "Browser is too heavy" hunches

#### Current read:
- `Phase 1` already locked the owner baseline:
  - `useAppStore.ts` owns project content hierarchy
  - Browser rows are derived only
- the remaining work is now to classify where current Browser shaping still carries owner-like assumptions:
  - `src/app/panels/selectBrowserTreeRows.ts`
    - normalizes Browser content rows before final tree composition
    - still injects a fallback reference hierarchy when `contentRows` do not yet carry one fully
    - still mixes compatibility categories such as `referenceContainerKind`, imported/source-reference object rows, and Browser-local ordering
  - `src/app/panels/useBrowserPanelController.ts`
    - assembles the final Browser tree inputs from:
      - `projectContentRows`
      - `referenceWorkspaceTree`
      - graph rows
      - `contentOrderByParentKey`
      - grouped selection
      - collapse state
      - drag/menu/controller glue
  - `src/app/store/useAppStore.ts`
    - still keeps the store-adjacent row-building seam close to the owner layer
    - still routes Browser drag ordering through `referenceWorkspace.contentOrderByParentKey`
    - still exposes `resolveBrowserDraggableTargetDrop(...)` as a Browser-named entry into content-owner drop resolution
- that does not automatically mean these seams are wrong
  - it means the next pass should classify which parts are:
    - honest projection
    - acceptable Browser-local presentation state
    - compatibility residue
    - owner-like drift that should shrink later

#### Read:
- `Phase 2` should stay a docs-and-verification pass
- the right job here is to produce one explicit hotspot inventory against the locked `Phase 1` baseline
- this phase should not yet change controller structure, selector shape, or store ownership

#### Locked Phase 2 in-scope:
- inspect Browser row/tree/controller seams for shadow-ownership drift
- classify the main current hotspots into explicit buckets such as:
  - honest projection
  - acceptable presentation state
  - compatibility residue
  - owner-like drift
- include drag/drop ordering and reference-hierarchy compatibility as part of the hotspot inventory
- keep the inventory grounded in the current repo seams, not abstract Browser theory

#### Locked Phase 2 out-of-scope:
- refactoring `selectBrowserTreeRows.ts`
- refactoring `useBrowserPanelController.ts`
- moving fields between `useAppStore` and Browser code yet
- changing Browser interaction behavior
- redesigning the project content model

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`
- especially:
  - `Phase 1` owner baseline
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

#### Strongest live repo seams for this pass:
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/store/useAppStore.ts`

#### Initial hotspot anchors:
- reference-hierarchy fallback and Browser-side normalization:
  - `hasReferenceHierarchyInContentRows`
  - `normalizedContentRows`
  - `referenceWorkspaceTree` fallback branches in `selectBrowserTreeRows.ts`
- Browser tree aggregation and Browser-local control state:
  - `projectContentRows`
  - `referenceWorkspaceTree`
  - `contentOrderByParentKey`
  - `collapsedContentRowIds`
  - grouped selection shaping in `useBrowserPanelController.ts`
- drag/drop and Browser-specific ordering compatibility:
  - `resolveBrowserDraggableTargetDrop(...)`
  - `referenceWorkspace.contentOrderByParentKey`
  - content-order normalization helpers in `useAppStore.ts`

#### Preferred Phase 2 implementation shape:
- keep this as a docs-and-verification pass
- write one explicit hotspot inventory section inside this doc
- classify each hotspot by why it exists and whether it should later stay, shrink, or move
- stop once `Phase 3` can target specific owner-like seams instead of re-discovering them

### Implementation spec:
1. Re-read the locked `Phase 1` owner baseline in this doc.
2. Re-scan the live Browser seams in:
   - `selectBrowserTreeRows.ts`
   - `useBrowserPanelController.ts`
   - `useAppStore.ts`
3. Inventory where Browser derivation still mixes in:
   - compatibility hierarchy fallback
   - Browser-specific ordering adaptation
   - controller-local grouping and row-selection shaping
   - Browser-named drag/drop entry seams over app-owned content rules
4. Write one explicit hotspot inventory that classifies each seam as:
   - honest projection
   - acceptable presentation state
   - compatibility residue
   - owner-like drift
5. Stop once `Phase 3` can use that inventory to choose which projection seams should shrink without reopening the owner baseline.

#### Implementation stop rule:
- `Phase 2` is ready to implement once there is one explicit Browser shadow-ownership hotspot inventory grounded in the current code
- do not widen this into actual code cleanup or Browser architecture redesign yet

#### Checklist:
- [x] re-read the locked `Phase 1` owner baseline
- [x] scan the live Browser tree, controller, and store-adjacent seams
- [x] inventory reference-hierarchy fallback and normalization hotspots
- [x] inventory controller-local grouping and Browser-local state seams
- [x] inventory Browser drag/order compatibility seams
- [x] classify the hotspots into explicit buckets
- [x] stop before code edits

#### Target output:
- one explicit Browser shadow-ownership hotspot inventory for later `Cleanup 5` phases

#### Done shape:
- later phases can point at named Browser shadow-ownership seams instead of vague Browser heaviness
- the family has one explicit read on which Browser seams are honest projection versus owner-like drift
- `Phase 3` can target specific projection cleanup work without re-arguing `Phase 1`

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`

#### Verification:
- manually re-read the locked `Phase 1` owner baseline in this doc
- manually confirm in source that:
  - `selectBrowserTreeRows.ts` still injects compatibility hierarchy when `contentRows` do not fully carry reference hierarchy
  - `useBrowserPanelController.ts` still assembles Browser tree inputs from project content rows, reference tree state, graph rows, ordering, and Browser-local presentation state
  - `useAppStore.ts` still exposes Browser drag/order compatibility seams through `resolveBrowserDraggableTargetDrop(...)` and `referenceWorkspace.contentOrderByParentKey`
- confirm the resulting hotspot inventory does not reopen the already-locked owner answer that project content hierarchy lives in `useAppStore`

#### Browser shadow-ownership hotspot inventory

This inventory classifies the current Browser seams against the locked `Phase 1` baseline where `useAppStore.ts` owns project content hierarchy and Browser rows remain derived presentation.

##### Honest projection

- `selectCurrentProjectContentBrowserRows(...)` in `useAppStore.ts` remains the clearest current projection seam.
  - it derives Browser-facing content rows from owned `projectContent`
  - it does not itself reopen the owner answer
- `selectBrowserTreeRows.ts` still reads as legitimate final tree composition once the inputs are already derived.
  - graph rows, content rows, grouped selection shaping, and collapse reads are acceptable final Browser assembly work as long as the tree builder is not also inventing hierarchy truth

##### Acceptable presentation state

- `collapsedContentRowIds` in `useBrowserPanelController.ts` is acceptable Browser-local presentation state.
- grouped selection shaping and row-menu or drag-preview glue in the controller remain presentation-side coordination, not canonical hierarchy truth.
- these seams are allowed to affect how project content is shown or manipulated without becoming the owner of the hierarchy they present.

##### Compatibility residue

- the `referenceWorkspaceTree` fallback branch in `selectBrowserTreeRows.ts` is the clearest current compatibility residue.
  - `normalizedContentRows` and `hasReferenceHierarchyInContentRows` currently allow Browser tree composition to re-materialize reference hierarchy when derived content rows do not yet carry that structure fully
  - category rows and imported or source-reference object rows still get injected through Browser-side compatibility shaping
- `referenceContainerKind` and related compatibility row fields belong in the same residue bucket.
  - they explain why the Browser can still appear to know hierarchy details that should eventually arrive through cleaner project-content projection instead
- `referenceWorkspace.contentOrderByParentKey` is still a compatibility ordering seam.
  - it preserves working Browser order behavior for current drag or hierarchy reads, but it is also a sign that content-order truth has not been reduced to one simpler derived path yet

##### Owner-like drift

- `useBrowserPanelController.ts` is the clearest current owner-like coordination hotspot.
  - it assembles one Browser tree from `projectContentRows`, `referenceWorkspaceTree`, graph rows, `contentOrderByParentKey`, grouped selection, collapse state, and Browser interaction glue
  - that mixed aggregation is still useful, but it increases the risk that Browser shaping starts to feel like the hierarchy source instead of the projection host
- the Browser-named `resolveBrowserDraggableTargetDrop(...)` seam in `useAppStore.ts` is also owner-like drift.
  - the underlying drop rules still resolve against app-owned content
  - the naming and entry shape keep a Browser-specific compatibility layer near canonical owner logic
- store-adjacent row-building in `useAppStore.ts` stays close enough to the owner layer that later cleanup still needs to decide which parts should remain a supported projection seam and which parts should move farther away from owner logic.

##### Phase 3 targets unlocked by this inventory

- `selectBrowserTreeRows.ts` compatibility hierarchy fallback is the clearest `Phase 3` projection-shrink target.
- `useBrowserPanelController.ts` mixed Browser tree aggregation is the clearest `Phase 3` coordination-simplification target.
- the Browser drag/order compatibility naming and ordering seams in `useAppStore.ts` are the clearest `Phase 3` store-adjacent drift targets.
- these targets do not reopen `Phase 1`.
  - they inherit the already-locked baseline that project content hierarchy remains app-owned and Browser rows remain derived only

#### Implementation result

Phase 2 completed as a docs-and-verification pass.

- The live repo still matches the locked `Phase 1` owner baseline rather than contradicting it.
- `selectBrowserTreeRows.ts` fallback normalization is now recorded as the main compatibility-residue hotspot.
- `useBrowserPanelController.ts` mixed tree aggregation is now recorded as the main owner-like coordination hotspot.
- `useAppStore.ts` row-building plus Browser drag or order compatibility is now recorded as the main store-adjacent drift hotspot.
- No code changes were needed for this phase.

## [x] Phase 3 - Reduce Browser Rows To Projection Surfaces

### Header

#### Purpose:
- reduce the remaining Browser-side duplicate hierarchy synthesis so Browser tree rows read as projection over app-owned content rows instead of as a second place that can reconstruct content structure

#### Current read:
- `Phase 1` already locked the owner baseline:
  - `useAppStore.ts` owns project content hierarchy
  - Browser rows are derived only
- `Phase 2` already identified the highest-leverage drift seam:
  - `selectCurrentProjectContentBrowserRows(...)` in `useAppStore.ts` already emits reference root, category, and reference object rows when `referenceWorkspace` is present
  - `selectBrowserTreeRows.ts` still accepts `referenceWorkspaceTree` and can rebuild similar hierarchy through the `normalizedContentRows` and `hasReferenceHierarchyInContentRows` fallback path
- the live controller seam confirms the likely narrowing:
  - `useBrowserPanelController.ts` still computes both `projectContentRows` and `referenceWorkspaceTree`
  - `referenceWorkspaceTree` still appears necessary for reference expansion-state synchronization
  - but its structural use inside `selectBrowserTreeRows.ts` is the clearest projection-residue target
- the Browser drag/order compatibility seam still exists in `useAppStore.ts`
  - but it is a narrower follow-on concern than the duplicate hierarchy-synthesis seam
  - this phase should only touch that ordering path if the tree cleanup requires a small compatibility repoint for correctness

#### Read:
- `Phase 3` should be a focused code-and-verification pass
- it should execute directly against the locked `Phase 2` hotspot inventory
- the goal is to make `contentRows` the one structural Browser-content input without widening into a broad Browser-controller or store cleanup

#### Locked Phase 3 in-scope:
- remove Browser-side duplicate reference hierarchy synthesis from `selectBrowserTreeRows.ts`
- make `contentRows` the canonical structural input for Browser content hierarchy
- repoint `useBrowserPanelController.ts` so the Browser tree selector no longer depends on `referenceWorkspaceTree` for structural content-row assembly
- if fallback removal exposes a missing content-row field, fill that gap at the canonical projection seam in `selectCurrentProjectContentBrowserRows(...)`
- keep visible Browser behavior stable while shrinking shadow-ownership seams

#### Locked Phase 3 out-of-scope:
- broad Browser controller redesign
- drag/drop behavior redesign
- large renaming passes for Browser drag/order helpers
- moving project-content ownership out of `useAppStore.ts`
- deleting `referenceWorkspaceTree` reads that are still needed for pure presentation or expansion-state synchronization

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`
  - especially:
    - `Phase 1` owner baseline
    - `Phase 2` hotspot inventory
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

#### Strongest live repo seams for this pass:
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/useBrowserPanelController.ts`

#### Initial target seams:
- canonical content-row projection seam:
  - `selectCurrentProjectContentBrowserRows(...)` in `useAppStore.ts`
- Browser-side duplicate hierarchy synthesis seam:
  - `normalizedContentRows`
  - `hasReferenceHierarchyInContentRows`
  - `referenceWorkspaceTree` fallback logic in `selectBrowserTreeRows.ts`
- controller pass-through seam that still feeds the duplicate path:
  - `selectBrowserTreeRows({ referenceWorkspaceTree, contentRows: projectContentRows, ... })`
  - in `useBrowserPanelController.ts`
- retained presentation-only reference-tree seam that may stay after this phase:
  - `referenceWorkspaceTree` expansion-state synchronization in `useBrowserPanelController.ts`

#### Preferred Phase 3 implementation shape:
- keep this as a focused code-and-verification pass
- remove the structural `referenceWorkspaceTree` fallback from `selectBrowserTreeRows.ts`
- keep `selectCurrentProjectContentBrowserRows(...)` as the one place that provides Browser content hierarchy rows
- keep any surviving `referenceWorkspaceTree` reads clearly presentation-only
- stop once the Browser tree selector reads as final composition over provided rows instead of as a second hierarchy synthesizer

### Implementation spec:
1. Re-read the locked `Phase 1` owner baseline and `Phase 2` hotspot inventory in this doc.
2. Reconfirm in source that `selectCurrentProjectContentBrowserRows(...)` already emits the reference root, category, and reference object rows the Browser tree needs.
3. Update `selectBrowserTreeRows.ts` so Browser content hierarchy is built only from `contentRows`, removing the `referenceWorkspaceTree` fallback branch and any now-dead duplicate normalization logic tied to that fallback.
4. Update `useBrowserPanelController.ts` so the Browser tree selector no longer receives `referenceWorkspaceTree` as a structural content input.
5. If fallback removal exposes missing row data, add the missing projection data in `selectCurrentProjectContentBrowserRows(...)` rather than rebuilding hierarchy again inside Browser tree composition.
6. Keep `referenceWorkspaceTree` only where it still serves presentation-side needs such as expansion-state synchronization.
7. Verify that Browser content hierarchy still renders the reference root/category/reference object structure correctly and that the repo still builds cleanly.

#### Implementation stop rule:
- `Phase 3` is ready to implement once Browser content hierarchy is structurally derived from `projectContentRows` without fallback synthesis from `referenceWorkspaceTree`
- do not widen this into a general Browser controller rewrite or a broad drag/order naming cleanup just because related seams are nearby

#### Checklist:
- [x] re-read the locked `Phase 1` owner baseline and `Phase 2` hotspot inventory
- [x] confirm `selectCurrentProjectContentBrowserRows(...)` already carries the needed reference hierarchy rows
- [x] remove the `referenceWorkspaceTree` fallback hierarchy synthesis from `selectBrowserTreeRows.ts`
- [x] repoint `useBrowserPanelController.ts` so Browser tree composition depends on `projectContentRows` for content hierarchy
- [x] keep any surviving `referenceWorkspaceTree` reads presentation-only
- [x] verify Browser content hierarchy still renders correctly
- [x] verify with `cmd /c npm.cmd run build`

#### Target output:
- one narrower Browser tree derivation path where content hierarchy structure comes from the app-owned content-row projection seam instead of from duplicate Browser-side hierarchy synthesis

#### Done shape:
- `selectCurrentProjectContentBrowserRows(...)` is the one structural content-row source for the Browser content tree
- `selectBrowserTreeRows.ts` reads as final Browser composition over provided rows instead of as a compatibility hierarchy owner
- `useBrowserPanelController.ts` still supports presentation-state coordination without feeding a second structural hierarchy source into Browser tree derivation
- later cleanup can target the smaller remaining drag/order compatibility residue without re-fighting the main row-ownership seam

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`
- edit `src/app/panels/selectBrowserTreeRows.ts`
- edit `src/app/panels/useBrowserPanelController.ts`
- edit `src/app/store/useAppStore.ts` only if needed to complete the content-row projection after fallback removal

#### Verification:
- manually re-read the `Phase 1` owner baseline and `Phase 2` hotspot inventory in this doc
- manually confirm in source that:
  - `selectCurrentProjectContentBrowserRows(...)` still emits reference root/category/reference object rows
  - `selectBrowserTreeRows.ts` no longer uses `referenceWorkspaceTree` for structural content-row synthesis
  - `useBrowserPanelController.ts` no longer passes `referenceWorkspaceTree` into Browser tree derivation
  - any remaining `referenceWorkspaceTree` usage is presentation-only or compatibility-only
- run:
  - `cmd /c npm.cmd run build`
- manually confirm Browser content hierarchy still shows:
  - the reference root assembly
  - reference category rows where expected
  - reference object rows in the same visible hierarchy positions as before

#### Implementation result

Phase 3 completed as a focused code-and-verification pass.

- `src/app/panels/selectBrowserTreeRows.ts`
  - no longer reconstructs reference root, category, or reference object rows from `referenceWorkspaceTree`
  - now builds Browser content hierarchy directly from the provided `contentRows`
- `src/app/panels/useBrowserPanelController.ts`
  - no longer passes `referenceWorkspaceTree` into Browser tree derivation
  - still keeps `referenceWorkspaceTree` for reference expansion-state synchronization, which remains presentation-side coordination
- the selector still keeps a compatibility-only `referenceWorkspaceTree` option in its call shape so the existing focused selector tests do not need a broad fixture rewrite in this phase
- build verification passed through `cmd /c npm.cmd run build`

## [x] Phase 4 - Prove Browser Still Reads Honest Hierarchy

### Header

#### Purpose:
- prove that the Browser still renders, selects, collapses, reveals, and reorders against the honest app-owned content hierarchy after `Phase 3` removed the duplicate Browser-side hierarchy synthesis path

#### Current read:
- `Phase 3` already landed the structural cleanup:
  - `selectBrowserTreeRows.ts` now composes Browser content hierarchy directly from `contentRows`
  - `useBrowserPanelController.ts` no longer feeds `referenceWorkspaceTree` into Browser tree derivation
- the main remaining job is proof, not more architecture change
- the live repo already has the strongest proof surfaces:
  - `src/app/panels/selectBrowserTreeRows.test.ts`
    - reference hierarchy rendering cases
    - imported-reference landing and content-order cases
    - local collapse-state cases
  - `src/app/panels/BrowserPanel.test.tsx`
    - collapse behavior
    - shared target-to-row selection reflection
    - reference-aware drag/drop behavior
- one narrow follow-on tension remains from `Phase 3`:
  - the selector still keeps a compatibility-only `referenceWorkspaceTree` option in its call shape so the runtime cleanup did not widen into a broad fixture rewrite
  - `Phase 4` should use that fact as a proof target, not as a reason to reopen the runtime ownership cleanup

#### Read:
- `Phase 4` should be a focused code-and-verification pass
- it should primarily add or tighten proof coverage around the post-`Phase 3` path
- the goal is to prove the Browser still reads honest hierarchy from app-owned content rows while keeping runtime behavior stable

#### Locked Phase 4 in-scope:
- add or tighten targeted selector tests that prove reference root/category/object hierarchy is read correctly from the current content-row path
- add or tighten targeted Browser panel tests that prove:
  - collapse state still hides descendants correctly
  - shared selection still reflects the right Browser rows
  - reference-aware drag/drop still operates against the same app-owned hierarchy
- where helpful, repoint focused selector fixtures so the proof cases describe the post-`Phase 3` `contentRows` path more honestly
- run targeted tests plus build verification

#### Locked Phase 4 out-of-scope:
- more runtime hierarchy cleanup
- Browser UX redesign
- broad test-file cleanup unrelated to post-`Phase 3` hierarchy proof
- removing every compatibility-only selector test input if that turns into large fixture churn
- drag/drop policy redesign

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`
  - especially:
    - `Phase 1` owner baseline
    - `Phase 2` hotspot inventory
    - `Phase 3` implementation result
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

#### Strongest live repo seams for this pass:
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/useBrowserPanelController.ts`

#### Initial proof anchors:
- selector-level hierarchy proof:
  - `renders STEP reference rows as normal items and prefers loading over error in aggregate category state`
  - `renders imported references inside the content hierarchy when they have a landing parent`
  - `interleaves imported reference rows with authored content children using parent content order`
  - in `src/app/panels/selectBrowserTreeRows.test.ts`
- panel-level behavioral proof:
  - `lets the content assembly row collapse and hide descendant content rows`
  - `reflects shared reference and object targets into browser row selection`
  - `drops promoted reference category containers into authored assemblies`
  - in `src/app/panels/BrowserPanel.test.tsx`
- live runtime seams those tests should keep proving:
  - `collapsedContentRowIds`
  - `resolveBrowserSelectedRowIdFromTarget(...)`
  - `resolveBrowserDraggableTargetDrop(...)`
  - presentation-only `referenceWorkspaceTree` expansion synchronization

#### Preferred Phase 4 implementation shape:
- keep runtime changes minimal or zero unless a proof gap exposes a real regression
- prefer tightening existing focused tests over adding broad new Browser integration coverage
- make the proof cases speak in terms of the post-`Phase 3` `contentRows` path where that can be done cleanly
- stop once the repo has clear proof that hierarchy rendering and the key Browser interactions still follow the app-owned content truth

### Implementation spec:
1. Re-read the locked `Phase 1` owner baseline, `Phase 2` hotspot inventory, and `Phase 3` implementation result in this doc.
2. Re-scan the existing selector and Browser panel tests that already cover reference hierarchy, collapse, selection reflection, and reference-aware drag/drop.
3. Tighten or add focused `selectBrowserTreeRows.test.ts` coverage so the proof cases clearly exercise the post-`Phase 3` hierarchy path where Browser content structure comes from `contentRows`.
4. Tighten or add focused `BrowserPanel.test.tsx` coverage that proves collapse, shared selection reflection, and reference-aware drag/drop still behave correctly after the hierarchy-synthesis removal.
5. Keep runtime code unchanged unless a proof gap exposes a real regression that must be fixed to make the Browser read honest hierarchy correctly.
6. Verify with targeted tests and a full build.

#### Implementation stop rule:
- `Phase 4` is ready to implement once the repo has explicit passing proof that Browser hierarchy rendering and the key Browser interactions still read the app-owned content hierarchy after `Phase 3`
- do not widen this into unrelated Browser test cleanup or another architecture pass just because the test files are large

#### Checklist:
- [x] re-read the locked `Phase 1`, `Phase 2`, and `Phase 3` baselines in this doc
- [x] scan the existing selector and Browser panel proof surfaces
- [x] tighten or add focused selector proof for reference hierarchy and content order
- [x] tighten or add focused Browser panel proof for collapse, selection reflection, and reference-aware drag/drop
- [x] keep runtime changes minimal unless a real regression is exposed
- [x] verify with targeted tests
- [x] verify with `cmd /c npm.cmd run build`

#### Target output:
- one explicit proof band showing that Browser hierarchy rendering and the key Browser interactions still follow the app-owned content hierarchy after the `Phase 3` projection narrowing

#### Done shape:
- the cleanup lane has direct evidence that Browser hierarchy is still correct after the structural fallback removal
- reference hierarchy rendering, shared selection reflection, collapse behavior, and reference-aware drag/drop remain tied to app-owned content truth
- the remaining compatibility-only selector option no longer creates ambiguity about whether the Browser still needs the old structural fallback at runtime

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-5 - Project Content And Browser Derivation Cleanup.md`
- edit `src/app/panels/selectBrowserTreeRows.test.ts`
- edit `src/app/panels/BrowserPanel.test.tsx`
- edit runtime Browser files only if a proof gap reveals a real regression

#### Verification:
- manually re-read the `Phase 1`, `Phase 2`, and `Phase 3` sections in this doc
- manually confirm in source that:
  - `selectBrowserTreeRows.ts` still reads Browser content hierarchy from `contentRows`
  - `useBrowserPanelController.ts` still keeps `referenceWorkspaceTree` only on the presentation-side coordination path
- run targeted tests:
  - `cmd /c npm.cmd test -- src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx`
- run:
  - `cmd /c npm.cmd run build`
- manually confirm the final proof cases cover:
  - reference root/category/object hierarchy rendering
  - content-order interleaving for imported references
  - collapse hiding descendants
  - shared target-to-row selection reflection
  - reference-aware drag/drop

#### Implementation result

Phase 4 completed as a focused proof pass.

- `src/app/panels/selectBrowserTreeRows.test.ts`
  - now proves the main reference hierarchy and content-order cases through explicit post-`Phase 3` `contentRows` fixtures instead of through the retired Browser-side hierarchy fallback assumptions
  - keeps the selector-level proof aligned with the current runtime seam where Browser content structure comes from app-owned content rows
- `src/app/panels/BrowserPanel.test.tsx`
  - now includes focused shared-reference selection and reference-category drag/drop proof through unified `projectContentRows`, so those interaction cases still exercise the honest post-`Phase 3` path without needing a broad test-harness rewrite
- runtime Browser files did not need further cleanup in this phase
  - the proof pass confirmed the `Phase 3` narrowing instead of reopening it
- verification passed through:
  - `cmd /c npm.cmd test -- src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx`
  - `cmd /c npm.cmd run build`

### Acceptance Checks

- project hierarchy truth clearly lives in `useAppStore`
- Browser rows stay derived only
- Browser-specific structures no longer feel like a second source of truth
- `Graph Documents` and `Content` remain distinct surfaces
- the Browser reads project hierarchy from explicit app-owned truth instead of reconstructing it from ad hoc row or runtime structure

### Likely Related Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/spaghetti/outputSurface.ts`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/`

### Success Read

This phase succeeds when:
- hierarchy changes have one obvious owner
- Browser rows feel like views, not data owners
- Browser cleanup can proceed without re-litigating hierarchy truth
- later Browser feature work can build on explicit project-content ownership instead of inventing another visible hierarchy owner

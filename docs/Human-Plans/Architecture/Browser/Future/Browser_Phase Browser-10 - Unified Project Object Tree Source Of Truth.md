# Browser-10 - Unified Project Object Tree Source Of Truth

## Summary

Replace the split Browser backing model so ParaHook has one true Fusion-style project tree for all 3D objects in the project, regardless of whether they are generated, imported, linked, reference-backed, loaded, or currently unloaded.

Locked outcome:
- Browser derives from one project-owned hierarchy source of truth
- every real 3D object in the project appears in that one Browser tree
- object origin such as generated, imported, linked, or reference-backed stays metadata on normal hierarchy nodes
- object runtime state such as loaded or unloaded stays row state, not tree membership
- `References` only remains if it is a real project-owned assembly or subtree, not a second Browser model
- `referenceWorkspace` stops acting as a second Browser hierarchy source and becomes support state for metadata, loading, viewer/runtime adapters, and transform compatibility

## Scope

This phase covers:
- collapsing the Browser backing model from:
  - `projectContent`
  - plus a separate Browser-facing `referenceWorkspace` hierarchy
- defining one canonical project tree for:
  - assemblies
  - subassemblies
  - components
  - objects
  - later parts
- keeping unloaded reference-backed objects in the Browser tree as real project objects
- treating load state, source/origin state, and viewer/runtime compatibility as traits on normal project nodes
- deciding whether `References` remains as a real project-owned assembly or is absorbed into other real project-owned parents

This phase does not cover:
- a future asset catalog or insertion shelf
- full shared transform-backend convergence between generated and reference-backed objects
- new part extraction rules beyond the existing Browser-9 direction
- broad viewer/runtime loader redesign beyond what is required to stop Browser from depending on a second hierarchy

## Locked Direction

- Browser should work like a true Fusion-style project tree
- Browser should include all real 3D project objects whether they are:
  - generated
  - imported
  - linked
  - reference-backed
  - loaded
  - unloaded
- Browser should not use loaded-versus-unloaded state to decide whether an object belongs in the tree
- Browser should not use reference-backed origin to decide whether an object belongs in a separate hierarchy model
- `referenceWorkspace` should stop being a second Browser tree source
- if `References` stays visible, it should exist as a real project-owned assembly or subtree inside the unified project hierarchy
- Browser row behavior should come from one owner model, with source/load/runtime differences layered through metadata and adapters

## Why This Phase Exists

`Browser-9` fixed several visible problems:
- reference-backed objects now read much more like normal objects
- ordinary drag behavior is closer to honest move/reparent behavior
- the old special reference container species are mostly hidden behind normal-looking rows

But one deep mismatch still remains:
- `Assembly 1` comes from the real project hierarchy
- `References` still comes from a separate `referenceWorkspace` Browser tree

That means ParaHook is still trying to make two different hierarchy models impersonate one Browser.

This is why the Browser still feels resistant even after the `9.x` cleanup ladder:
- rows can look the same while behaving through different backing seams
- selection and context routing still branch by old reference targets
- loaded/unloaded reference truth still leaks into membership and container behavior

The next clean step is to stop cosmetically merging two trees and instead make one real project tree.

## Current Code Reality

- `src/app/store/useAppStore.ts`
  - real authored assemblies live in `projectContent.assembliesById`
  - Browser-visible reference structure still comes from `referenceWorkspace`
  - `selectReferenceWorkspaceBrowserTree(...)` still synthesizes `References` and its grouped children as a separate hierarchy source
  - reference-backed load state, visibility, errors, transform overrides, and compatibility state still live under `referenceWorkspace`
- `src/app/panels/selectBrowserTreeRows.ts`
  - Browser still derives rows from both:
    - project content hierarchy
    - reference workspace hierarchy
  - converged rows can look like normal `assembly` / `component` / `object` rows while still carrying separate reference-container traits
- `src/app/panels/useBrowserPanelController.ts`
  - drag, preview, and row behavior still contain compatibility branches for synthetic reference-container rows
- `src/app/panels/browserInteractions.ts`
  - selection routing still maps some Browser rows through:
    - `references-root`
    - `reference-category`
    - `reference-item`
- `src/app/components/ViewerHost.tsx`
  - viewer highlight and visibility flows still understand explicit reference-target kinds
- `src/app/console/stagedNavigation.ts`
  - Console navigation still has dedicated reference-root/category paths

So the Browser is not fully unified yet because it still has:
- one real project hierarchy
- one separate reference hierarchy adapted into Browser rows

## Proposed Subphases

`Browser-10` should act as an umbrella reset, not one giant implementation pass.

### Browser-10.1 - Unified Reference-Backed Project Owner Records

Focus:
- give every Browser-visible reference-backed object one canonical project-owner record path
- stop depending on synthetic Browser-only reference hierarchy membership for object existence
- keep unloaded objects visible as real project objects
- implementation-ready direction:
  - the live `imported-reference` owner seam already exists in store
  - `10.1` should collapse the remaining `source-reference` / shelf-only Browser identity onto that existing owner seam instead of inventing a new record model

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-10.1 - Unified Reference-Backed Project Owner Records.md`

### Browser-10.2 - Single Browser Tree Derivation

Focus:
- derive Browser rows from one unified project hierarchy source
- stop deriving visible Browser structure from `selectReferenceWorkspaceBrowserTree(...)`
- keep `referenceWorkspace` only as support state for metadata/runtime traits
- implementation-ready direction:
  - the live mixed seam is `selectBrowserTreeRows(...)` taking both `contentRows` and `referenceWorkspaceTree`
  - `10.2` should delete `referenceWorkspaceTree` as a visible hierarchy input and collapse the Browser onto one visible row lane before the later routing cleanup

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-10.2 - Single Browser Tree Derivation.md`

### Browser-10.3 - Unified Owner Routing Across Browser, Console, And Viewer

Focus:
- collapse Browser selection, context menus, Console navigation, and viewer highlighting onto one owner-target model
- retire dedicated Browser/Console/viewer-routing dependence on:
  - `references-root`
  - `reference-category`
- implementation-ready direction:
  - the remaining live split is no longer hierarchy derivation, it is target routing
  - `browserInteractions.ts`, `useBrowserPanelController.ts`, `useAppStore.ts`, `workspaceIntents.ts`, `ViewerHost.tsx`, and `stagedNavigation.ts` still translate visible unified rows back into old reference target kinds
  - `10.3` should make owner targets primary for Browser selection, Console context, and viewer reflection, while shrinking `reference-item` down to a narrow compatibility adapter where runtime behavior still still needs `referenceId`

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-10.3 - Unified Owner Routing Across Browser Console And Viewer.md`

### Browser-10.4 - Load And Runtime Traits On Normal Nodes

Focus:
- keep loaded/unloaded/visibility/error/runtime state as traits on normal project nodes
- keep Browser membership independent from viewer load state
- preserve current transform/load compatibility while the hierarchy source converges
- implementation-ready direction:
  - the main live seam is no longer hierarchy or owner routing, it is runtime-state fan-out
  - `useAppStore.ts` still stores the reference runtime maps under `referenceWorkspace`, while `selectBrowserTreeRows.ts`, `ViewerHost.tsx`, `browserTreeRowPresenter.tsx`, `browserContextMenu.ts`, and `ConsoleDock.tsx` still read those facts too directly
  - `10.4` should keep the current runtime storage and adapters in place, but unify the read contract so normal owner rows consume load/visibility/error/part/runtime traits through shared selectors first

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-10.4 - Load And Runtime Traits On Normal Nodes.md`

### Browser-10.5 - Compatibility Seam Retirement

Focus:
- remove leftover Browser-only reference hierarchy seams that are no longer needed after unified routing lands
- keep only the compatibility adapters that still provide real value
- shrink the old dual-tree mental model out of the codebase

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-10.5 - Compatibility Seam Retirement.md`

## Implementation Shape

Center the work around:
- choosing one canonical Browser/project hierarchy source of truth
- promoting every Browser-visible reference-backed object into that same hierarchy model
- making load state and source/origin traits attach to normal project owners instead of creating a second hierarchy source
- narrowing `referenceWorkspace` until it acts as support state instead of Browser structure
- collapsing Browser, Console, selection, and viewer routing onto one owner-target model

Likely affected areas:
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserContextMenu.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/console/stagedNavigation.ts`
- Browser/store/viewer tests around hierarchy truth, selection, visibility, and load state

## First-Pass Implementation Sequence

1. define the unified project-tree contract
   - one Browser hierarchy source of truth
   - one owner model for all Browser-visible objects
   - source/origin and load state remain metadata
   - this is the umbrella contract behind `Browser-10.1`
2. promote reference-backed Browser nodes into that project tree
   - every visible reference-backed object becomes a normal project-owned node even when unloaded
   - if `References` stays, it becomes a real project-owned container instead of a synthetic Browser tree
3. stop deriving Browser structure from `selectReferenceWorkspaceBrowserTree(...)`
   - keep only metadata/runtime support in `referenceWorkspace`
   - this is the first big derivation cut under `Browser-10.2`
4. collapse Browser interaction routing onto the unified owner model
   - remove the need for `references-root` and `reference-category` Browser routing
   - narrow `reference-item` compatibility to origin/runtime adapters only
   - this is the routing cleanup under `Browser-10.3`
5. keep current transform/runtime compatibility stable while the hierarchy source converges
   - this is the trait-preserving bridge under `Browser-10.4`

## Shipped Progress

- `Browser-10.1 - Unified Reference-Backed Project Owner Records`
  - shipped result:
    - ordinary Browser reference-backed object identity now commits through the shared `imported-reference` owner seam
    - the older `source-reference` / `place-source` drag-store branch is removed
    - current `reference-item` selection and transform compatibility remains adapter-backed while later Browser-10 routing cleanup is still pending
- `Browser-10.2 - Single Browser Tree Derivation`
  - shipped result:
    - the live Browser now renders from one visible `contentRows` lane instead of a split `referenceRows + contentRows` view model
    - visible reference assembly/category/object rows now come through the unified project-content row path
    - `referenceWorkspaceTree` remains only as a compatibility fallback and metadata/runtime seam instead of the live Browser hierarchy source
- `Browser-10.3 - Unified Owner Routing Across Browser, Console, And Viewer`
  - shipped result:
      - converged Browser rows now commit selection through their visible `assembly` / `component` / `object` owner targets instead of bouncing back into legacy reference target kinds
      - viewer reference picks and highlight reflection now adapt from owner routing instead of using `reference-item` as the primary public selection contract
      - Console owner labels and owner-context routing now understand reference-backed assembly/component/object rows directly while `reference-item` remains only as a narrow runtime compatibility seam
  - `Browser-10.4 - Load And Runtime Traits On Normal Nodes`
    - shipped result:
        - shared reference-backed runtime traits now resolve through one store seam for visibility, load state, error state, transform override, and part rows
        - Browser item/content-row derivation, `ViewerHost`, and `ConsoleDock` now consume that same trait helper for ordinary runtime truth instead of scattering raw `referenceWorkspace` reads
        - Browser membership stays independent from viewer load state while current loader, batch, and transform adapters remain intact
  - `Browser-10.5 - Compatibility Seam Retirement`
    - shipped result:
        - live Browser and Console reference selection now stays on normal `assembly`, `component`, and `object` owner targets
        - the older `references-root`, `reference-category`, and broad public `reference-item` contract is reduced to compatibility fallback behavior instead of the primary live path
        - reference runtime actions still work through owner-first context metadata and helper seams where `referenceId` remains genuinely necessary

## Concrete Implementation Targets

- define one canonical project-owner record path for reference-backed objects that are currently only discoverable through `referenceWorkspace`
- decide whether `References` remains as a real assembly in `projectContent` or whether its current children move under other real project-owned parents
- update Browser selectors so all visible rows come from one hierarchy model
- update Browser interaction and context seams so they target unified project owners first
- keep load state, visibility state, and source metadata readable without reintroducing a second hierarchy
- preserve unloaded object discoverability in Browser without requiring the object to be actively loaded into the viewer

## Public Interface / Type Direction

- Browser should keep one structural hierarchy model:
  - `assembly`
  - later `subassembly`
  - `component`
  - `object`
  - later `part`
- origin/runtime metadata should become traits on those nodes:
  - `generated`
  - `imported`
  - `linked`
  - `reference-backed`
  - `loaded`
  - `unloaded`
  - `error`
- Browser should stop needing a parallel hierarchy type family just because an object is reference-backed
- `referenceWorkspace` should become a support subsystem instead of the source of Browser hierarchy truth

## Questions / Decisions

### q1 - Should Browser include unloaded reference-backed objects as first-class project nodes?

Question:
- if an object is part of the project but not currently loaded into the viewer, should it still appear in Browser as a normal project object?

Suggestion:
- yes
- loaded versus unloaded should be row state, not membership in the project tree

Decision:
- unloaded reference-backed objects should remain first-class project nodes in Browser

### q2 - Should Browser stop deriving visible hierarchy from `referenceWorkspace`?

Question:
- should `referenceWorkspace` continue to generate visible Browser structure, or should Browser derive its hierarchy only from one unified project tree?

Suggestion:
- stop deriving visible hierarchy from `referenceWorkspace`
- keep `referenceWorkspace` only for metadata/runtime support until later cleanup retires more of it

Decision:
- Browser should stop deriving visible hierarchy from `referenceWorkspace`
- Browser should derive visible hierarchy from one unified project tree

### q3 - Should `References` stay visible only if it is a real project-owned assembly?

Question:
- if the project still wants a top-level `References` grouping, should it remain only as a real project-owned assembly/subtree instead of as a synthetic Browser root?

Suggestion:
- yes
- keep the label only if it represents a real project-owned container

Decision:
- `References` may stay visible, but only as a real project-owned assembly or subtree inside the unified Browser hierarchy

### q4 - Should source/origin and load state remain traits instead of structural row species?

Question:
- once Browser moves to one unified project tree, should generated/imported/reference-backed and loaded/unloaded differences stay as row traits instead of new structure types?

Suggestion:
- yes
- one tree model, many traits

Decision:
- source/origin and load state should remain traits instead of structural row species

## Test Plan

- Browser derives all visible hierarchy rows from one project-tree source of truth
- unloaded reference-backed objects still appear in Browser
- generated and reference-backed objects share the same hierarchy model
- row styling and actions still reflect origin/runtime truth without creating separate tree species
- Browser selection, drag, context menus, viewer highlighting, and Console routing all resolve through one owner model
- existing reference-backed transform/load compatibility continues to function during the hierarchy-source convergence

## Assumptions

- the current `References` examples are real project objects, not an asset catalog
- later asset-catalog work remains a separate future feature
- `Browser-10` is the architectural reset after the Browser-9 cleanup ladder, not just another visual polish phase
- `Browser-10` should be broken into smaller implementation-ready subphases before code work starts

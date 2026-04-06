# Browser Phase Browser-6 - BrowserPanel Structure And Row-Family Cleanup

## Doc Header

### Doc History
5. 2026-03-25 22:17: Marked Browser-6 shipped after the BrowserPanel host/controller cleanup landed, moved this phase record into `Shipped/`, and aligned the doc wording with the delivered thin `BrowserPanel` host, new `useBrowserPanelController.ts` seam, preserved Browser-5.x behavior, and canonical row-family/presenter/menu/interaction modules
4. 2026-03-25 21:57: Tightened this Browser-6 phase doc against the live Browser-5.5 and Console-5.1G seams so it now treats the already-landed row-family, presenter, interaction, and menu modules as baseline, shifts the actual phase target to the remaining heavy composition and controller ownership still trapped in `BrowserPanel`, and locks a concrete migration order plus file/test targets for a behavior-preserving structural cleanup
3. 2026-03-25 16:35: Reframed this Browser-6 phase doc to read more clearly as a long-term Browser-vision enabler, tightening the purpose and summary around later shared Browser primitives while keeping the actual phase contract implementation-bounded, behavior-preserving, and explicitly non-owning of the broader end-state convergence work
2. 2026-03-25 16:20: Made this standalone Browser-6 phase doc implementation-ready, locking the BrowserPanel cleanup around a meaningful layered split, family-specific adapter seams, the rule that shared selection plus console-routing plus reference-batch ownership must stay outside `BrowserPanel`, and the default requirement that Browser-6 preserve shipped Browser-5.x behavior while extracting cleaner seams
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the later BrowserPanel structure and row-family cleanup now has its own planning home under `Browser/Future/` instead of staying folded into the Browser umbrella note only

### Purpose

This phase is the structural Browser cleanup that finishes turning `BrowserPanel` into a real host/composition surface instead of a large mixed controller.

Use it to answer:
- what structural cleanup Browser-6 shipped so later Browser convergence stays possible
- which Browser seams are already landed and should be treated as baseline instead of re-planned
- what ownership still needs to leave `BrowserPanel`
- how graph/content/reference/sketch/viewport rows should keep shared shell rules without collapsing current practical family differences too early

## Doc Body

## [x] Browser-6 - BrowserPanel Structure And Row-Family Cleanup

### Summary

Browser-6 is now a second-stage BrowserPanel cleanup, not the first extraction pass.

The Browser already has meaningful supporting seams:
- tree-row derivation:
  - `selectBrowserGraphRows.ts`
  - `selectBrowserTreeRows.ts`
- interaction dispatch:
  - `browserInteractions.ts`
- row-family capability description:
  - `browserRowFamilies.ts`
- row-shell rendering:
  - `browserTreeRowPresenter.tsx`
- section rendering:
  - `browserTreeSections.tsx`
- row-action execution:
  - `browserRowActions.ts`
- context-menu item building:
  - `browserContextMenu.ts`

So Browser-6 should not pretend those seams still need to be invented. The remaining job is to remove the heavy composition, overlay lifecycle, and action/controller glue that still lives inline in `BrowserPanel.tsx`.

Phase outcome:
- `BrowserPanel` becomes a thinner host instead of the place where most Browser behavior is decided inline
- BrowserPanel-level state assembly and action/controller wiring move into narrower panel-specific seams
- already-landed row-vm, interaction, presenter, menu, and row-family seams stay canonical and get used more cleanly
- major row families keep shared Browser shell rules while owning their narrower family-specific behavior through the existing adapter seams
- the structure stays open for later authored/imported convergence instead of hardening today's row families into one permanent Browser species split
- Browser-5.x shipped behavior stays intact by default while the structure becomes easier to extend and test

### Shipped Result

The first shipped Browser-6 cut landed the BrowserPanel host/controller cleanup:
- `BrowserPanel.tsx` now reads as a thinner host/shell instead of the main mixed Browser controller
- the new `useBrowserPanelController.ts` seam now owns the heavy BrowserPanel-wide store reads, derived tree composition, menu state/lifecycle, controller closures, and Browser-scoped transcript helper wiring that previously lived inline
- the existing Browser seams stayed canonical:
  - `selectBrowserGraphRows.ts`
  - `selectBrowserTreeRows.ts`
  - `browserInteractions.ts`
  - `browserRowFamilies.ts`
  - `browserTreeRowPresenter.tsx`
  - `browserTreeSections.tsx`
  - `browserContextMenu.ts`
  - `browserRowActions.ts`
- Browser-5.3 / 5.4 / 5.5 ownership stayed outside `BrowserPanel`:
  - shared selection truth
  - shared console-context routing
  - shared reference batch-load ownership
  - shared workspace/view command-owner seams
- Browser behavior stayed materially the same while the structure became much easier to extend without regrowing one oversized panel file

### Long-Term Alignment

Browser-6 is not the phase that fully unifies folders, objects, references, and later imported/generated Browser primitives.

It is the phase that should make that later direction realistic by:
- removing avoidable `BrowserPanel` ownership
- separating panel host concerns from panel controller/model concerns
- keeping current practical families understandable without treating that first-pass split as the permanent Browser worldview

Hard rule:
- Browser-6 should read as a structural enabler for the longer Browser vision
- Browser-6 should not claim to ship the full folder/object/reference convergence model by itself

### Live Code Alignment

The live Browser structure is already partway through this cleanup.

Already landed and should stay canonical:
- `BrowserPanel.tsx`
  - top-level host
- `selectBrowserGraphRows.ts`
  - graph row derivation
- `selectBrowserTreeRows.ts`
  - Browser tree composition VM
- `browserInteractions.ts`
  - row selection / open / expand / visibility behavior
- `browserRowFamilies.ts`
  - family capability mapping
- `browserTreeRowPresenter.tsx`
  - shared row shell
- `browserTreeSections.tsx`
  - content / graph / editor section rendering
- `browserContextMenu.ts`
  - row menu item construction
- `browserRowActions.ts`
  - row action execution routing

Remaining BrowserPanel-heavy ownership that Browser-6 should clean up:
- broad cross-store reads and derived panel composition
- local overlay lifecycle:
  - context menu
  - import menu
- Browser-scoped console transcript publishing
- panel-level action/controller closure creation for:
  - graph actions
  - editor actions
  - reference actions
  - content actions
- wiring menu builders and row-action runners directly inside the panel body
- keeping too much panel-specific state, event, and effect logic in one file even after the earlier extractions

### Owns

- BrowserPanel host versus controller/model separation
- remaining panel-level state assembly and overlay wiring cleanup
- strengthening the already-landed row-family/presenter/menu seams
- reducing inline panel-specific action closure and menu wiring duplication

### Does Not Own

- new reference-folder authoring features such as rename or add-folder
- new tree move/reorganization behavior
- new transform-command richness
- changing shared selection semantics already shipped in Browser-5.x unless structure forces a bug fix
- re-architecting console ownership away from the existing shared workspace-to-console seam
- replacing the existing Browser row-family seams with a new competing abstraction set
- moving shared selection, console sync, or reference batch ownership back into `BrowserPanel`

### Public Interfaces And State

Browser-6 should preserve the shared seams already established by Browser-5.x and Console `[5.1G]`:
- `workspaceSelection.selectedTarget`
- `workspaceSelection.explicitSelectedTargets`
- `workspaceSelection.selectionAnchorTarget`
- `workspaceSelection.resolvedContentSelection`
- shared console-context routing
- shared reference batch-load ownership
- shared workspace selection commands / workspace intents

Hard rule:
- Browser-6 should not pull those truths back into `BrowserPanel`
- `BrowserPanel` should compose and dispatch
- shared app/viewer/console seams should continue to own the real state and command routing

### Locked Direction

#### 1. Treat the current Browser seams as baseline

Browser-6 should not reopen already-landed extractions as if the repo still had one monolithic Browser file.

Locked rule:
- keep the existing extracted seams as the Browser-6 baseline:
  - `selectBrowserGraphRows.ts`
  - `selectBrowserTreeRows.ts`
  - `browserInteractions.ts`
  - `browserRowFamilies.ts`
  - `browserTreeRowPresenter.tsx`
  - `browserTreeSections.tsx`
  - `browserContextMenu.ts`
  - `browserRowActions.ts`
- Browser-6 should improve how `BrowserPanel` composes those seams
- Browser-6 should not replace them with a second overlapping layer unless a live seam is demonstrably wrong

#### 2. Meaningful remaining structural split

Browser-6 should be a meaningful architecture cleanup, not a cosmetic helper extraction.

Locked rule:
- keep one top-level `BrowserPanel` host
- keep already-extracted row-vm derivation, interaction dispatch, and row rendering where they are
- move the remaining panel-specific composition burden out of the panel body:
  - cross-store BrowserPanel model assembly
  - overlay/menu lifecycle coordination
  - panel-scoped row action/controller closure creation
  - Browser transcript publishing helper wiring
- avoid a helper-only split that leaves the same logic density trapped in one file under new names

#### 3. Family-specific adapter seams stay real, but do not get reinvented

Row-family-specific differences should not stay in one giant central panel switch.

Locked rule:
- keep the shared row shell and shared click grammar centralized
- keep major row-family differences in the narrower family-specific seams that already exist
- Browser-6 may refine those seams, but should not move family-specific exceptions back into `BrowserPanel`
- first family seams should continue to group behavior roughly by:
  - graph-document / graph-owned rows
  - content rows
  - reference rows
  - sketch rows
  - viewport rows

Each family seam should define:
- row identity mapping
- select/open/context-menu capability
- optional grouped-highlight behavior
- optional action surface participation

#### 4. Shared ownership stays outside BrowserPanel

Shared Browser-5.x seams must remain outside `BrowserPanel` ownership.

Locked rule:
- keep these outside `BrowserPanel`:
  - shared selection truth
  - explicit multi-select state
  - resolved grouped content-selection truth
  - console context routing
  - reference batch-load ownership
- `BrowserPanel` should become mainly:
  - row composition
  - event capture
  - dispatch into shared seams
  - visual-state rendering from derived row-vm truth
  - narrow panel-local UI state:
    - collapse state
    - open menu state
    - local ephemeral selection fallback where still required

After Console `[5.1G]`, Browser-6 must also avoid inventing any Browser-local command ownership:
- Browser row selection and row actions may enter shared workspace/view/graph seams
- BrowserPanel should not become a second command owner just because it has buttons or menus

#### 5. Behavior-preserving cleanup by default

Browser-6 should preserve shipped Browser-5.x behavior unless the current structure forces a targeted bug fix.

Locked rule:
- prefer:
  - extract
  - rename
  - isolate seams
  - reduce duplication
  - improve tests around row-family boundaries
- only change shipped Browser-5.x behavior when the current structure makes a bug or inconsistency impossible to avoid
- keep the main success condition as:
  - Browser behavior still works the same
  - adding the next row-family or Browser action is much easier

### Recommended Structural Cut

Recommended first implementation shape:
- keep `BrowserPanel.tsx` as the top-level host and section/menu renderer
- extract a panel-model or panel-controller seam for the BrowserPanel-specific work that still lives inline today

Preferred responsibility split:
- `BrowserPanel.tsx`
  - host markup
  - shell collapse / titlebar shell
  - compose section components and menus
- new BrowserPanel model/controller seam
  - collect the wide store reads and derived panel state now assembled inline
  - expose BrowserPanel handlers for:
    - graph/editor actions
    - reference actions
    - content actions
    - menu open/close lifecycle
  - own the Browser transcript helper instead of calling `appendConsoleEntry` inline from the panel
  - own the glue code that currently wires:
    - `browserInteractions.ts`
    - `browserContextMenu.ts`
    - `browserRowActions.ts`
- existing Browser row/presenter/family modules
  - remain the main row-level seams

Recommended file-shape direction:
- keep:
  - `src/app/panels/BrowserPanel.tsx`
  - `src/app/panels/selectBrowserGraphRows.ts`
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/panels/browserInteractions.ts`
  - `src/app/panels/browserRowFamilies.ts`
  - `src/app/panels/browserTreeRowPresenter.tsx`
  - `src/app/panels/browserTreeSections.tsx`
  - `src/app/panels/browserContextMenu.ts`
  - `src/app/panels/browserRowActions.ts`
- add one or two BrowserPanel-specific files as needed, preferably with responsibilities similar to:
  - `browserPanelModel.ts`
  - `browserPanelController.ts`

Hard rule:
- do not create a second parallel row-family system
- do not create a BrowserPanel abstraction layer that merely re-exports the existing helpers without reducing actual ownership

### Migration Order

The safest Browser-6 order is:
- keep the current Browser behavior surface intact
- identify the BrowserPanel-specific reads, local state, handlers, and effects that still make the file oversized
- extract BrowserPanel model/controller ownership before touching the already-landed row-family seams
- re-point section rendering, row action wiring, and menu building through the narrower panel seam
- leave shared selection, console routing, reference batch loading, and view/workspace command ownership where they already live

Concretely:
1. move BrowserPanel-wide derived state and controller closures out of `BrowserPanel.tsx`
2. keep `browserInteractions.ts`, `browserContextMenu.ts`, and `browserRowActions.ts` canonical, but make BrowserPanel depend on them through the narrower panel seam
3. keep `browserTreeRowPresenter.tsx` and `browserTreeSections.tsx` as the rendering shell
4. only make narrow shared-store or workspace-intent touches if the cleanup reveals a missing common entrypoint

This keeps the phase aligned with the longer Browser vision:
- today:
  - keep practical families such as content, references, graph rows, sketch rows, and viewport rows understandable
- later:
  - leave the architecture open for imported folders/objects and generated folders/objects to converge into broader shared Browser primitives

### Required File Targets

Expected implementation seam owners:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserRowFamilies.ts`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/panels/browserTreeSections.tsx`
- `src/app/panels/browserContextMenu.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/panels/` new BrowserPanel model/controller files as needed
- `src/app/store/useAppStore.ts` only where existing Browser dispatch wiring truly needs a cleaner shared entrypoint
- `src/app/store/workspaceSelectionCommands.ts` or `src/app/store/workspaceIntents.ts` only if Browser-6 reveals a missing shared action seam

Possible related verification seams:
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserInteractions.test.ts`
- `src/app/panels/browserContextMenu.test.ts`
- `src/app/panels/browserRowActions.test.ts`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewerHost.test.tsx`

### Test Plan

Required Browser-6 verification:

- structural regression:
  - existing Browser-5.x selection behavior still works
  - existing Browser-5.3 selection-to-console behavior still works
  - existing Browser-5.4 explicit multi-select behavior still works
  - existing Browser-5.5 reference batch-loading behavior still works
  - graph/open-editor Browser actions still work the same

- row-family seams:
  - content rows still keep grouped parent-selection behavior
  - reference rows still keep root/category/item load and selection behavior
  - graph rows still keep their existing select/open behavior
  - sketch rows still keep their current Browser participation rules
  - viewport rows still keep focus/close behavior

- panel ownership:
  - `BrowserPanel` no longer owns shared selection truth directly
  - `BrowserPanel` no longer owns console-context routing directly
  - `BrowserPanel` no longer owns reference batch-load truth directly
  - `BrowserPanel` no longer builds most row-action/controller closures inline
  - `BrowserPanel` no longer owns Browser transcript publishing inline
  - `BrowserPanel` no longer owns context-menu item building inline

- readability/maintainability:
  - row-family behavior is testable in narrower seams
  - shared row shell behavior remains centralized
  - adding one new row-family-specific action no longer requires editing one oversized BrowserPanel branch tree
  - the main BrowserPanel file reads as a host/composition surface, not as the main Browser controller

### Acceptance

- `BrowserPanel.tsx` is materially smaller and reads as a host/composition file
- existing extracted seams remain canonical rather than being duplicated
- Browser-5.3 / 5.4 / 5.5 ownership stays outside `BrowserPanel`
- Browser behavior remains materially unchanged to the user
- the resulting structure makes the next Browser action or row-family follow-on easier to add without re-growing one large panel file

### Assumptions

- Browser-5 through Browser-5.5 shipped behavior remains the product baseline.
- Shared workspace selection, console-routing, reference batch-loading, and shared command-owner seams stay canonical.
- Current row families may still differ practically in Browser-6 even if the longer-term Browser vision later converges imported and generated items more closely.
- Browser-6 is a structural enabler phase, not the phase that fully delivers the later folder/object convergence vision.
- The most stale part of the older Browser-6 framing was assuming row-family extraction had not happened yet; the real remaining work is BrowserPanel host/controller cleanup around those landed seams.

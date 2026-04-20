# Console-1 - Workspace Modes Catalog-Driven Surface Actions

## Doc Header

### Doc History
7. 2026-04-19 23:07:45: Accepted `Console-1 / Phase 5` after catalog expansion proof and optional Dashboard runtime coverage landed, closed all `Console-Gen1` HLG/CLG as satisfied by the five-phase ladder, and marked `Console-1` complete with the known unrelated broad `ConsoleDock.test.tsx` failure caveat carried as residual suite risk.
6. 2026-04-19 22:59:25: Accepted `Console-1 / Phase 4` after Console Workspace Modes carried one workspace surface target identity across slotted and detached host states, recorded the unrelated broad `ConsoleDock.test.tsx` failure caveat, and prepared `Console-1 / Phase 5` as the next worker-ready surface catalog expansion proof and generation closeout slice.
5. 2026-04-19 22:49:29: Accepted `Console-1 / Phase 3` after runtime Workspace Modes actions consumed shared eligibility before owner-backed execution, diagnostics were covered by focused tests, build proof landed, and prepared `Console-1 / Phase 4` as the next worker-ready unified host-state identity slice.
4. 2026-04-19 22:27:10: Accepted `Console-1 / Phase 2` after Workspace Modes chosen-viewport menu visibility consumed shared eligibility, labels and action ids were preserved, focused tests and build proof landed, and prepared `Console-1 / Phase 3` as the next worker-ready runtime guard and diagnostics slice.
3. 2026-04-19 22:18:15: Accepted `Console-1 / Phase 1` after the shared eligibility helper, blocked reasons, focused tests, changelog, and build proof landed; marked Phase 1 checklist coverage complete and prepared `Console-1 / Phase 2` as the next worker-ready menu-derivation slice.
2. 2026-04-19 22:04:46: Added explicit Yap Intake to HLG to CLG traceability and moved HLG/CLG coverage into each implementation Phase Summary so the full Console Workspace Modes intake has enough phases to complete honestly.
1. 2026-04-19 21:29:35: Created the `Console-1` family phase doc for Console Workspace Modes surface parity, preserving the Gen1 HLG/CLG, routing the work into Codex-sized phases, and preparing `Console-1 / Phase 1` for Worker implementation.

### Purpose

This Family Phase Doc turns `Console Generation 1` into an implementation-ready ladder.

Use it to answer:
- how Console Workspace Modes should become catalog-driven
- which shared owner seams should replace console-local allowlists
- how primary/non-primary and unsupported-action rules should stay consistent
- which implementation phase is ready for Worker dispatch

Do not use it for:
- redesigning the whole Console command language
- changing runtime behavior outside the named implementation phase
- making Console own workspace surface lifecycle truth
- replacing the existing shell UI actions

### Scope

This phase covers the existing Console `Root > Workspace Modes` branch.

It does not create a new top-level command family. It repairs the ownership and eligibility model underneath the already-shipped branch.

## Doc Body

### Family Phase Goal

Console Workspace Modes should expose workspace-mode actions from canonical workspace surface truth.

The action model should match the shared slot UI wherever both surfaces expose the same action:
- supported actions appear
- protected primary targets are handled consistently
- unsupported actions are hidden or produce owner-backed diagnostics
- runtime actions execute through the same workspace owner seams the shell uses

### Existing Shipped Base

Shipped `Workspace 7.5-16` already provided:
- `Root > Workspace Modes`
- `wm` alias
- viewport selection
- split menu
- viewport type menu
- open-in-new-browser/browser-open behavior for supported early surfaces
- float for eligible non-primary `modelViewer`, `browser`, and `console`
- close for eligible non-primary `modelViewer`, `browser`, and `console`
- guided alias cleanup
- `Spaghetti Editor` viewport-type adoption

Shipped `Console 5.1G` already provided:
- the owner-first command rule
- Console as an adapter, not command owner
- shared command behavior through workspace, graph, viewer, and shell owner seams

### Current Live Read

Research from the intake says:
- `Viewport Type` is now mostly catalog-driven through `workspaceSurfaceCatalog`
- the workspace surface catalog includes `modelViewer`, `browser`, `catalog`, `console`, `spaghettiEditor`, `dashboard`, `notepad`, and `homePage`
- `Float`, `Close`, `Pop Out` or browser-open, and some split action paths still use narrow hard-coded Console guards
- Console Workspace Modes mostly targets slotted viewport slots today
- the desired direction is not a Console-owned workspace model, but a Console adapter over canonical workspace catalog/support and shared shell actions

Likely live seams:
- `src/app/workspace/workspaceSurfaceCatalog.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.workspaceModes.test.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`

### Yap Intake To Phase Trace

Source intake:
- `docs/Agents/Dispatch-3a/Dispatch-3a-Yap-Intake-Log.md`
- `Intake 2 - 2026-04-19 21:26 - Console Workspace Modes Surface Parity`

Trace:
- intake HLG candidate 1 becomes `Console-Gen1-HLG-1`
  - advanced by `Console-Gen1-CLG-1`, `Console-Gen1-CLG-2`, `Console-Gen1-CLG-3`, `Console-Gen1-CLG-4`, and `Console-Gen1-CLG-5`
  - routed through `Console-1 / Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`, and `Phase 5`
- intake HLG candidate 2 becomes `Console-Gen1-HLG-2`
  - advanced by `Console-Gen1-CLG-1`, `Console-Gen1-CLG-2`, and `Console-Gen1-CLG-5`
  - routed through `Console-1 / Phase 1`, `Phase 2`, and `Phase 5`
- intake HLG candidate 3 becomes `Console-Gen1-HLG-3`
  - advanced by `Console-Gen1-CLG-2` and `Console-Gen1-CLG-3`
  - routed through `Console-1 / Phase 1`, `Phase 2`, and `Phase 3`
- intake HLG candidate 4 becomes `Console-Gen1-HLG-4`
  - advanced by `Console-Gen1-CLG-4`
  - routed through `Console-1 / Phase 4`
- intake HLG candidate 5 becomes `Console-Gen1-HLG-5`
  - advanced by `Console-Gen1-CLG-1`, `Console-Gen1-CLG-2`, `Console-Gen1-CLG-3`, and `Console-Gen1-CLG-5`
  - routed through `Console-1 / Phase 1`, `Phase 3`, and `Phase 5`
- intake HLG candidate 6 becomes `Console-Gen1-HLG-6`
  - satisfied by the planning ladder itself: `Console-Vision.md`, `Console-Gen1-Index.md`, and this Family Phase Doc

Enough-phase read:
- `Phase 1` creates the shared eligibility model.
- `Phase 2` makes Console menus consume it.
- `Phase 3` makes Console runtime execution and diagnostics consume owner-backed action seams.
- `Phase 4` proves the host-state identity goal that Phase 1 through Phase 3 should not fake.
- `Phase 5` proves catalog expansion and performs honest generation closeout.

### Boundary Rules

- do not add another Console-only workspace surface allowlist
- do not make Console own primary/non-primary rules independently from shell UI
- do not split slotted, floating, detached, and popout into separate Console concepts
- do not widen into unrelated Console command-language or `ConsoleDock` decomposition work
- do not change runtime code outside the active implementation phase

### Acceptance Read

This family phase is complete when:
- Console Workspace Modes derives action eligibility from shared workspace support rules
- Console runtime execution uses shared workspace action owner seams
- primary and non-primary protections are consistent across menu visibility, execution guards, and shell UI behavior
- optional catalog-backed surfaces no longer require console-local allowlist patches for baseline workspace-mode action visibility
- focused tests prove the shared eligibility and Console menu/runtime behavior
- `npm run build` passes for every implementation slice

## Vision

`Console-1` advances `Console Generation 1` by making Console Workspace Modes a real control surface over the same workspace action model used by the shell.

The user-facing promise is simple:
- if a workspace surface supports an action in the shared model, Console can expose it through the same action family
- if a workspace surface does not support an action, Console should either hide the action or report a clear diagnostic from the owner-backed guard

## Wishlist Organization

### High Level Goals

- [x] `Console-Gen1-HLG-1. Users can control every workspace surface from Console with the same action model exposed by the shared slot UI.`
- [x] `Console-Gen1-HLG-2. Console Workspace Modes should read canonical catalog/support data instead of maintaining surface allowlists.`
- [x] `Console-Gen1-HLG-3. Primary and non-primary workspace rules should be explicit, tested, and consistent between Console and shell UI.`
- [x] `Console-Gen1-HLG-4. Slotted, floating, detached, and popped-out surfaces should remain one workspace model, not separate Console concepts.`
- [x] `Console-Gen1-HLG-5. Unsupported actions should either be hidden by shared eligibility rules or produce clear diagnostics.`
- [x] `Console-Gen1-HLG-6. The planning should begin at the Console vision/generation level and work down into index/phase docs instead of jumping directly into one implementation phase.`

### Codex Level Goals

- [x] Console-Gen1-CLG-1. Route Console Workspace Modes surface and action visibility through shared workspace catalog/support and eligibility helpers.
- [x] Console-Gen1-CLG-2. Replace console-local action allowlists for `Split`, `Viewport Type`, `Float`, `Pop Out` or browser-open, and `Close` with shared owner-backed eligibility.
- [x] Console-Gen1-CLG-3. Keep primary and non-primary protections consistent between Console menus, Console execution guards, and shell UI affordances.
- [x] Console-Gen1-CLG-4. Preserve one workspace surface identity model across slotted, floating, detached, and popout states instead of branching Console behavior by host mode.
- [x] Console-Gen1-CLG-5. Add focused regression coverage so new workspace catalog entries and optional surfaces do not require hand-added Console allowlist patches.
- [x] Console-Gen1-CLG-6. Preserve the existing `Root > Workspace Modes` branch and shipped action vocabulary while replacing the brittle eligibility and runtime owner seams beneath it.

### `Console-1 / Phase 1`

- [x] Define one shared workspace action eligibility read model for Console Workspace Modes.
- [x] Make primary/non-primary protections explicit in the eligibility model.
- [x] Cover catalog-backed surface support without per-action Console allowlists.
- [x] Advance `Console-Gen1-HLG-1`.
- [x] Advance `Console-Gen1-HLG-2`.
- [x] Advance `Console-Gen1-HLG-3`.
- [x] Advance `Console-Gen1-HLG-5`.
- [x] Advance `Console-Gen1-CLG-1`.
- [x] Advance `Console-Gen1-CLG-2`.
- [x] Advance `Console-Gen1-CLG-3`.
- [x] Advance `Console-Gen1-CLG-5`.

### `Console-1 / Phase 2`

- [x] Derive chosen-viewport action menus from the shared eligibility read model.
- [x] Preserve shipped labels and breadcrumbs.
- [x] Remove or bypass narrow menu allowlists in `stagedNavigation.ts`.
- [x] Advance `Console-Gen1-HLG-1`.
- [x] Advance `Console-Gen1-HLG-2`.
- [x] Advance `Console-Gen1-HLG-3`.
- [x] Advance `Console-Gen1-CLG-1`.
- [x] Advance `Console-Gen1-CLG-2`.
- [x] Advance `Console-Gen1-CLG-3`.
- [x] Advance `Console-Gen1-CLG-6`.

### `Console-1 / Phase 3`

- [x] Repoint Console runtime action execution to shared workspace owner helpers.
- [x] Keep diagnostics owner-backed and consistent with hidden-action rules.
- [x] Avoid duplicating float, close, popout, or split behavior inside Console.
- [x] Advance `Console-Gen1-HLG-1`.
- [x] Advance `Console-Gen1-HLG-3`.
- [x] Advance `Console-Gen1-HLG-5`.
- [x] Advance `Console-Gen1-CLG-2`.
- [x] Advance `Console-Gen1-CLG-3`.
- [x] Advance `Console-Gen1-CLG-6`.

### `Console-1 / Phase 4`

- [x] Extend targeting reads to remain truthful across slotted, floating, detached, and popout host states where shared workspace identity supports it.
- [x] Keep the action model unified instead of adding host-mode-specific Console branches.
- [x] Advance `Console-Gen1-HLG-1`.
- [x] Advance `Console-Gen1-HLG-4`.
- [x] Advance `Console-Gen1-CLG-4`.

### `Console-1 / Phase 5`

- [x] Add catalog expansion proof for optional surfaces.
- [x] Prove future catalog entries do not need narrow Console allowlist changes for baseline action eligibility.
- [x] Close the generation checklist only for goals genuinely covered by the shipped phases.
- [x] Advance `Console-Gen1-HLG-1`.
- [x] Advance `Console-Gen1-HLG-2`.
- [x] Advance `Console-Gen1-HLG-5`.
- [x] Advance `Console-Gen1-CLG-1`.
- [x] Advance `Console-Gen1-CLG-5`.

## [x] `Console-1 / Phase 1` - `Shared Workspace Action Eligibility Read Model`

### Phase 1 Summary

#### Purpose

Create the shared eligibility read model that Console Workspace Modes will use before later phases rewire menus and runtime execution.

The first Worker slice should make the eligibility rules explicit and tested without changing broad runtime behavior all at once.

#### Owns

- one shared action eligibility helper surface for workspace-mode actions
- primary/non-primary protection reads needed by Console Workspace Modes
- support reads for `Split`, `Viewport Type`, `Float`, `Pop Out` or browser-open, and `Close`
- focused tests proving representative catalog-backed surfaces receive expected eligibility
- enough exports/types for `stagedNavigation.ts` and `useConsoleInteraction.ts` to consume in later phases

#### HLG / CLG Coverage

- advances `Console-Gen1-HLG-1`
- advances `Console-Gen1-HLG-2`
- advances `Console-Gen1-HLG-3`
- advances `Console-Gen1-HLG-5`
- advances `Console-Gen1-CLG-1`
- advances `Console-Gen1-CLG-2`
- advances `Console-Gen1-CLG-3`
- advances `Console-Gen1-CLG-5`

#### Does Not Own

- replacing all Console menus yet
- changing user-visible Console behavior beyond low-risk helper adoption if unavoidable
- runtime execution repointing for float, close, split, or popout
- detached/floating/popout target widening
- command grammar redesign
- shell UI visual changes

#### Current Live Read

The known catalog owner is:
- `src/app/workspace/workspaceSurfaceCatalog.ts`

The known action/runtime owner is:
- `src/app/workspace/workspaceSurfaceActions.ts`

The known Console menu owner is:
- `src/app/console/stagedNavigation.ts`

The known Console runtime owner is:
- `src/app/console/useConsoleInteraction.ts`

Phase 1 should not try to complete all of those rewires. It should create and prove the shared eligibility seam those files can use.

#### First Pass Decisions

- place the first helper near workspace ownership, not under `src/app/console`
- prefer `workspaceSurfaceActions.ts` or a nearby `workspaceSurfaceActionEligibility.ts` if the helper grows too large
- model eligibility as data the Console can read, not as a UI-only menu builder
- include explicit reasons or diagnostic keys when an action is blocked and that reason is useful to runtime guards
- keep primary-slot protection explicit rather than incidental

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a shared workspace action eligibility read model for a workspace surface target.
2. Feed it from canonical catalog/support helpers such as `workspaceSurfaceSupportsHostMode(...)`, `workspaceSurfaceSupportsSplit(...)`, and workspace slot primary state.
3. Cover at least these action families:
   - `split`
   - `viewportType`
   - `float`
   - `popout` or browser-open, using the current owner terminology carefully
   - `close`
4. Return both visibility/support booleans and enough blocked-reason information for later diagnostics.
5. Add focused tests for:
   - primary model viewport protections
   - non-primary model viewport eligibility
   - Browser eligibility
   - Console eligibility
   - optional catalog-backed surface support such as `homePage` or `catalog`
   - unsupported popout or close cases where catalog support or primary rules should block the action
6. Keep existing Console behavior stable unless adopting the helper in a tiny low-risk read path is required to prove the seam.

#### Likely Files

- `src/app/workspace/workspaceSurfaceCatalog.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- optional new `src/app/workspace/workspaceSurfaceActionEligibility.ts`
- `src/app/workspace/workspaceSurfaceCatalog.test.ts`
- optional new `src/app/workspace/workspaceSurfaceActionEligibility.test.ts`
- later consumer files, only if a tiny import is needed:
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/stagedNavigation.workspaceModes.test.ts`

#### No-Widening Rule

Do not migrate the whole Console Workspace Modes branch in Phase 1.

Stop after the shared eligibility seam is explicit, tested, and ready for Phase 2 menu derivation.

#### Implementation Risks

- encoding current console allowlists into a new shared helper without actually using catalog support
- hiding primary-slot protections inside component-specific checks
- treating `Open In New Browser`, `Pop Out`, and browser shell popout as interchangeable without naming the owner-backed action carefully
- accidentally changing Console menus before the later menu-derivation phase is ready

#### Checklist

- [x] Shared eligibility helper exists outside Console-owned files.
- [x] Helper reads canonical workspace surface catalog/support data.
- [x] Helper represents primary/non-primary rules explicitly.
- [x] Helper covers `split`, `viewportType`, `float`, `popout` or browser-open, and `close`.
- [x] Helper exposes blocked reasons useful for later diagnostics.
- [x] Focused tests cover core and optional surfaces.
- [x] Existing Console Workspace Modes behavior remains stable.

#### Verification Shape

Focused verification:

```powershell
npm.cmd test -- workspaceSurfaceCatalog workspaceSurfaceActionEligibility stagedNavigation.workspaceModes
```

If the exact new test filename differs, run the nearest focused workspace eligibility and Console Workspace Modes test set.

Build gate:

```powershell
npm.cmd run build
```

#### Done Shape

Phase 1 is done when a Worker can point to one shared, tested workspace action eligibility seam that later Console phases can consume without re-deciding surface support, primary protection, or catalog ownership.

#### Coverage Review

Accepted.

Kepler added `src/app/workspace/workspaceSurfaceActionEligibility.ts` and `src/app/workspace/workspaceSurfaceActionEligibility.test.ts`, kept the helper under workspace ownership, modeled blocked reasons for later diagnostics, covered primary/non-primary and optional catalog surfaces, updated `docs/CHANGELOG.md` entry `[1569]`, and reported both focused tests and `npm.cmd run build` passing.

Phase 1 advanced its assigned HLG/CLG slice, but the broader Generation 1 HLG/CLG remain open until menu derivation, runtime execution, host-state identity, and catalog expansion proof land in later phases.

## [x] `Console-1 / Phase 2` - `Catalog-Driven Workspace Modes Menus`

### Phase 2 Summary

#### Purpose

Rewire the Console Workspace Modes staged menus to read the shared eligibility model from Phase 1.

This phase makes menu visibility catalog-driven. It should not repoint runtime action execution beyond whatever is necessary to keep existing staged-navigation tests passing.

#### Owns

- chosen-viewport action menu derivation
- hiding unsupported actions by shared eligibility
- replacing `stagedNavigation.ts` local visibility helpers for float, close, and open/popout with the shared eligibility read model
- preserving shipped breadcrumbs, labels, and guided aliases
- focused staged-navigation coverage

#### HLG / CLG Coverage

- advances `Console-Gen1-HLG-1`
- advances `Console-Gen1-HLG-2`
- advances `Console-Gen1-HLG-3`
- advances `Console-Gen1-CLG-1`
- advances `Console-Gen1-CLG-2`
- advances `Console-Gen1-CLG-3`
- advances `Console-Gen1-CLG-6`

#### Does Not Own

- broad runtime action execution cleanup
- owner-backed runtime diagnostics
- detached/floating/popout targeting widening
- command-language redesign

### Phase 2 Implementation Spec

#### Exact Code Cut

1. Import `getWorkspaceSurfaceActionEligibility(...)` into `src/app/console/stagedNavigation.ts`.
2. Add a small local adapter that resolves the selected workspace viewport option into the eligibility target:
   - `surfaceKind`
   - `hostMode: 'slotted'`
   - `isPrimary`
3. Use the eligibility result to derive `buildWorkspaceViewportActionChoices(...)`.
4. Replace or remove the remaining Console-local menu visibility helpers:
   - `supportsWorkspaceViewportOpenInNewBrowser(...)`
   - `supportsWorkspaceViewportFloat(...)`
   - `supportsWorkspaceViewportClose(...)`
5. Preserve the current visible labels, canonical tokens, aliases, breadcrumbs, and action ids:
   - `Split Menu`
   - `Viewport Type Menu`
   - `Float`
   - `Open In New Browser`
   - `Close`
6. Keep `Split Menu` and `Viewport Type Menu` visibility aligned to the shared eligibility model without changing their submenu command vocabulary.
7. Add or update focused `stagedNavigation.workspaceModes` tests so representative catalog-backed surfaces prove menu visibility comes from the shared eligibility helper:
   - primary `modelViewer`
   - non-primary `modelViewer`
   - `browser`
   - `console`
   - optional surface such as `homePage`
   - unsupported popout surface such as `catalog`

#### Likely Files

- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.workspaceModes.test.ts`
- only if needed for narrow test support:
  - `src/app/workspace/workspaceSurfaceActionEligibility.ts`
  - `src/app/workspace/workspaceSurfaceActionEligibility.test.ts`

#### No-Widening Rule

Do not migrate Console runtime execution in Phase 2.

Do not edit `src/app/console/useConsoleInteraction.ts` unless a minimal type or test support adjustment is unavoidable and does not change runtime action semantics.

Phase 3 owns owner-backed runtime execution guards and diagnostics.

#### Implementation Risks

- accidentally preserving the old hard-coded allowlists in a new wrapper
- changing labels, aliases, breadcrumbs, or action ids while changing visibility
- making runtime behavior stricter before Phase 3 owns diagnostics
- treating detached/floating/popout targets as Phase 2 scope

#### Checklist

- [x] `stagedNavigation.ts` menu visibility consumes `getWorkspaceSurfaceActionEligibility(...)`.
- [x] Console-local float, close, and open/popout menu allowlists are removed or bypassed.
- [x] Split and viewport-type menu visibility is derived from shared eligibility.
- [x] Existing labels, aliases, breadcrumbs, and action ids are preserved.
- [x] Focused staged-navigation tests prove primary, non-primary, core, optional, and unsupported-surface visibility.
- [x] Runtime execution parity remains deferred to Phase 3.

#### Verification Shape

Focused verification:

```powershell
npm.cmd test -- stagedNavigation.workspaceModes workspaceSurfaceActionEligibility
```

Build gate:

```powershell
npm.cmd run build
```

#### Done Shape

Phase 2 is done when Console Workspace Modes chosen-viewport menus are derived from the shared eligibility model, no longer from Console-local surface allowlists, while shipped command vocabulary and runtime execution behavior remain stable.

#### Coverage Review

Accepted.

Kepler rewired `src/app/console/stagedNavigation.ts` so chosen-viewport Workspace Modes action visibility consumes `getWorkspaceSurfaceActionEligibility(...)`, removed the local open-in-new-browser, float, and close menu visibility helpers, derived split and viewport-type visibility from the shared helper, preserved labels/tokens/aliases/breadcrumbs/action ids, updated focused staged-navigation coverage, updated `docs/CHANGELOG.md` entry `[1570]`, and reported both `npm.cmd test -- stagedNavigation.workspaceModes workspaceSurfaceActionEligibility` and `npm.cmd run build` passing.

Phase 2 advanced its assigned HLG/CLG slice, but runtime execution guards and diagnostics remain open for Phase 3.

## [x] `Console-1 / Phase 3` - `Owner-Backed Runtime Action Execution And Diagnostics`

### Phase 3 Summary

#### Purpose

Repoint Console Workspace Modes runtime execution guards to the same owner-backed action model used by shell UI.

#### Owns

- runtime action guard cleanup
- diagnostic consistency for blocked actions
- shared helper use inside `useConsoleInteraction.ts`
- preserving existing owner-backed action calls while removing duplicated Console-only runtime allowlist checks

#### HLG / CLG Coverage

- advances `Console-Gen1-HLG-1`
- advances `Console-Gen1-HLG-3`
- advances `Console-Gen1-HLG-5`
- advances `Console-Gen1-CLG-2`
- advances `Console-Gen1-CLG-3`
- advances `Console-Gen1-CLG-6`

#### Does Not Own

- menu derivation already covered by Phase 2
- broad host-state widening covered by Phase 4
- detached/floating/popout listing or targeting beyond the currently selected slotted viewport
- new workspace surface lifecycle behavior

### Phase 3 Implementation Spec

#### Exact Code Cut

1. Import `getWorkspaceSurfaceActionEligibility(...)` into `src/app/console/useConsoleInteraction.ts`.
2. Add a small runtime guard helper near the Workspace Modes action handling that:
   - resolves the selected slotted `targetSlot` from `stagedResult.selections.workspaceViewportId`
   - builds the eligibility target from `targetSlot.surfaceKind`, `hostMode: 'slotted'`, and whether `targetSlot.slotId === defaultPrimaryViewportSlotId`
   - returns the matching eligibility entry for the action being executed
   - appends a clear Diagnostics entry when the target is missing or the shared eligibility says the action is blocked
   - keeps the staged session active and reprints the staged prompt after a blocked action, matching current guard behavior
3. Apply the shared guard to runtime branches for:
   - `workspace.viewport.split.top`
   - `workspace.viewport.split.right`
   - `workspace.viewport.split.bottom`
   - `workspace.viewport.split.left`
   - `workspace.viewport.type.*`
   - `workspace.viewport.openInNewBrowser`
   - `workspace.viewport.float`
   - `workspace.viewport.close`
4. Replace duplicated Console-only runtime allowlist checks where the shared eligibility now owns the rule:
   - primary float/close protection
   - unsupported float host-mode support
   - unsupported popout/open-in-new-browser host-mode support
   - unsupported split support
5. Preserve the existing owner-backed execution calls after eligibility passes:
   - `splitViewportSlot(...)`
   - `setViewportSlotSurfaceKind(...)`
   - `createDetachedViewportSurfaceCopy(...)`
   - `setIsBrowserPoppedOut(...)`
   - `floatWorkspaceSurface(...)`
   - `detachViewportSlotSurface(...)`
   - `removeViewportSlot(...)`
6. Preserve existing user-facing successful action text, command breadcrumb logging, staged-session behavior, and radio burst behavior.
7. Add focused runtime tests in `ConsoleDock.test.tsx` or the nearest existing Console runtime test surface for:
   - blocked primary float/close uses shared eligibility diagnostics
   - blocked unsupported popout/open action on a catalog-backed surface reports a clear diagnostic
   - allowed optional/catalog-backed surface actions that are now menu-visible do not hit old Console-only runtime allowlist diagnostics
   - successful browser/model actions still execute through existing owner calls and keep the staged branch active

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`
- only if a tiny helper export is needed:
  - `src/app/workspace/workspaceSurfaceActionEligibility.ts`
  - `src/app/workspace/workspaceSurfaceActionEligibility.test.ts`

#### No-Widening Rule

Do not change Workspace Modes menu derivation in `stagedNavigation.ts` unless a small test-support adjustment is required.

Do not add detached, floating, or popout surfaces to the Console Workspace Modes picker in Phase 3.

Do not redesign command grammar, labels, aliases, breadcrumbs, or action ids.

Phase 4 owns unified surface identity across slotted, floating, detached, and popout host states.

#### Implementation Risks

- keeping menu visibility catalog-driven while runtime still blocks with stale Console-only surface lists
- changing successful action behavior while replacing guards
- introducing Phase 4 target-listing behavior too early
- emitting vague diagnostics that do not reflect shared eligibility blocked reasons

#### Checklist

- [x] `useConsoleInteraction.ts` runtime Workspace Modes guards consume `getWorkspaceSurfaceActionEligibility(...)`.
- [x] Runtime float, close, split, popout/open, and viewport-type actions no longer duplicate stale Console-only allowlists for shared eligibility rules.
- [x] Blocked runtime actions produce clear Diagnostics entries and keep the staged prompt usable.
- [x] Existing owner-backed execution calls remain the execution path after eligibility passes.
- [x] Existing successful action labels, breadcrumbs, staged-session behavior, and radio bursts are preserved.
- [x] Focused Console runtime tests cover blocked and allowed paths.
- [x] Detached/floating/popout listing remains deferred to Phase 4.

#### Verification Shape

Focused verification:

```powershell
npm.cmd test -- ConsoleDock workspaceSurfaceActionEligibility stagedNavigation.workspaceModes
```

Build gate:

```powershell
npm.cmd run build
```

#### Done Shape

Phase 3 is done when Console Workspace Modes runtime execution checks use the shared eligibility model before calling the existing workspace/shell owners, blocked actions report clear diagnostics, and runtime success behavior remains stable without widening into host-state listing.

#### Coverage Review

Accepted.

Kepler updated `src/app/console/useConsoleInteraction.ts` so Workspace Modes runtime execution now checks `getWorkspaceSurfaceActionEligibility(...)` before calling the existing owner-backed split, viewport-type, open-in-new-browser, float, and close paths. The stale Console-only runtime allowlist blocks were removed, blocked actions produce shared Diagnostics output, successful owner-backed execution remains the post-eligibility path, focused `ConsoleDock` coverage was added for blocked diagnostics and optional/catalog-backed runtime actions, and `docs/CHANGELOG.md` entry `[1571]` records the implementation.

Verification accepted for this phase: `npm.cmd test -- ConsoleDock --testNamePattern "shared workspace eligibility diagnostics|optional workspace surfaces open"` passed, the focused `workspaceSurfaceActionEligibility.test.ts`, `stagedNavigation.workspaceModes.test.ts`, and Phase 3 Workspace Modes `ConsoleDock` tests passed, and `npm.cmd run build` passed with existing Vite warnings. The broader `ConsoleDock.test.tsx` command still has unrelated failures outside this phase, beginning with `ConsoleDock > enters the references scope from the console root` and continuing through reference, graph, sketch-plane, and transform assertions. That caveat is recorded as residual suite risk, not a Phase 3 blocker.

Phase 3 advanced its assigned HLG/CLG slice. Phase 4 remains open for unified surface identity across slotted, floating, detached, and popout host states.

## [x] `Console-1 / Phase 4` - `Unified Surface Identity Across Host States`

### Phase 4 Summary

#### Purpose

Make Console Workspace Modes target the same workspace surface identity across slotted, floating, detached, and popout host states where the shared workspace model supports it.

#### Owns

- target reads across host modes
- truthful labels and breadcrumbs for non-slotted surfaces
- avoiding host-mode-specific Console concepts

#### HLG / CLG Coverage

- advances `Console-Gen1-HLG-1`
- advances `Console-Gen1-HLG-4`
- advances `Console-Gen1-CLG-4`

#### Does Not Own

- inventing new detached-surface behavior
- rewriting workspace persistence or shell layout

### Phase 4 Implementation Spec

Phase 4 is Worker-ready.

#### Worker Assignment

Rework Console Workspace Modes targeting so the selected workspace surface identity can represent slotted, floating, detached, and popout host states through one shared workspace model instead of Console-specific host-mode branches.

#### Exact Code Cut

1. Extend or introduce a shared Console Workspace target option/read model, likely near `src/app/workspace/workspaceViewportLabels.ts`, that can derive options from both slotted `viewportSlotsById` and detached/floating/popout workspace surface state.
2. Carry one target shape through Console navigation with at least `surfaceInstanceId`, `surfaceKind`, `hostMode`, display label, and optional slotted fields such as `slotId` and `isPrimary`.
3. Feed `createConsoleStagedNavigationContext(...)`, `buildConsoleWorkspaceViewportOptions(...)`, and the `Root > Workspace Modes` chosen-surface flow from this unified target list.
4. Update `src/app/console/stagedNavigation.ts` only as needed so menu eligibility receives the target's real host mode and keeps hidden-action behavior shared.
5. Update `src/app/console/useConsoleInteraction.ts` only as needed so submitted actions resolve against the same target identity and keep Phase 3 runtime eligibility diagnostics intact.
6. Preserve existing user-facing labels, aliases, breadcrumbs, action ids, canonical tokens, and command vocabulary unless a host-state suffix is necessary to disambiguate target labels.
7. Add focused coverage proving slotted, floating, detached, and popout targets are represented as one Workspace Modes target set, non-slotted targets do not expose slotted-only actions, and any submitted unsupported action still reports the shared diagnostic path.

#### Likely Files

- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.workspaceModes.test.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` only if the existing host-mode eligibility read cannot express the needed shared rules

#### No-Widening Rule

Do not reopen Phase 3 runtime guard behavior unless a real host-state identity bug requires passing a more truthful target into the existing guard.

Do not invent new lifecycle actions, new command grammar, a global command registry, or separate Console concepts named around floating, detached, or popout surfaces.

Do not close `Console-Gen1` or claim catalog expansion proof in this phase. Phase 5 owns catalog expansion and generation closeout.

#### Checklist

- [x] Console Workspace Modes target options include slotted and detached/floating/popout workspace surface identities where shared workspace state exposes them.
- [x] The selected target shape carries host mode and surface identity without creating host-mode-specific Console branches.
- [x] Menu eligibility uses the target's real host mode and shared eligibility rules.
- [x] Runtime submission resolves the same target identity and preserves Phase 3 diagnostics for unsupported actions.
- [x] Labels and breadcrumbs remain stable, with only necessary host-state disambiguation.
- [x] Focused tests cover unified target listing, slotted-only action hiding for non-slotted targets, and unchanged slotted behavior.

#### Verification Shape

Focused verification:

```powershell
npm.cmd test -- stagedNavigation.workspaceModes ConsoleDock workspaceSurfaceActionEligibility
```

Build gate:

```powershell
npm.cmd run build
```

#### Done Shape

Phase 4 is done when Console Workspace Modes can name and carry one workspace surface identity across slotted, floating, detached, and popout host states, with shared eligibility deciding which actions are visible or diagnosable and without introducing separate Console-only host-state behavior.

#### Coverage Review

Accepted.

Kepler added a unified Console workspace surface target identity carrying `surfaceInstanceId`, `surfaceKind`, `hostMode`, label, and optional slotted metadata; fed slotted plus detached/floating/popout surfaces into Workspace Modes options, context, and chosen-surface flow; passed real host mode into shared eligibility; updated runtime target resolution to use the same identity before execution and diagnostics; and updated `docs/CHANGELOG.md` entry `[1572]`.

Verification accepted for this phase: `npm.cmd test -- ConsoleDock --testNamePattern "detached workspace surfaces"` passed, the focused `workspaceSurfaceActionEligibility.test.ts`, `stagedNavigation.workspaceModes.test.ts`, and Phase 4 `ConsoleDock` coverage passed, and `npm.cmd run build` passed with existing Vite warnings. The broader `ConsoleDock.test.tsx` command still has known unrelated failures outside this phase, so the caveat remains residual suite risk and does not block Phase 4 acceptance.

Phase 4 advanced its assigned HLG/CLG slice. Phase 5 remains open for surface catalog expansion proof and honest `Console-Gen1` closeout.

## [x] `Console-1 / Phase 5` - `Surface Catalog Expansion Proof And Generation Closeout`

### Phase 5 Summary

#### Purpose

Prove that catalog-backed surfaces and future catalog entries can participate in Console Workspace Modes without narrow Console allowlist patches.

#### Owns

- optional-surface proof
- regression tests for catalog expansion behavior
- closeout recommendations for `Console-Gen1` HLG/CLG

#### HLG / CLG Coverage

- advances `Console-Gen1-HLG-1`
- advances `Console-Gen1-HLG-2`
- advances `Console-Gen1-HLG-5`
- advances `Console-Gen1-CLG-1`
- advances `Console-Gen1-CLG-5`

#### Does Not Own

- new surface family onboarding
- unrelated Console cleanup

### Phase 5 Implementation Spec

Phase 5 is Worker-ready.

#### Worker Assignment

Prove the Console Workspace Modes surface/action model now absorbs catalog-backed workspace surfaces and future catalog entries through shared catalog/support and eligibility seams, without adding Console-local menu or runtime allowlists. Then perform the implementation-side closeout needed for HLG > Spec to decide whether `Console-1` and `Console-Gen1` can close.

#### Exact Code Cut

1. Add focused regression coverage that exercises at least one optional or non-original catalog-backed surface through the Console Workspace Modes menu, eligibility, and runtime guard path without adding any Console-specific surface allowlist.
2. Add a catalog-expansion proof test using the existing workspace surface catalog/support seam, a test-only fixture, or the smallest local helper extension that proves a newly catalog-supported surface can appear in Console Workspace Modes and receive shared eligibility decisions without editing Console-specific visibility/runtime conditionals.
3. Audit `src/app/console/stagedNavigation.ts`, `src/app/console/useConsoleInteraction.ts`, `src/app/console/ConsoleDock.tsx`, and `src/app/workspace/workspaceViewportLabels.ts` for remaining hard-coded Console workspace-surface allowlists that decide baseline Workspace Modes visibility, split, viewport type, float, popout/open, or close eligibility.
4. Remove or replace any remaining Console-local allowlist that duplicates shared catalog/support or shared eligibility behavior. Keep surface-owner execution calls where they are the real owner seam.
5. Add or update tests so primary/non-primary protections, unsupported-action hiding or diagnostics, and host-state identity continue to pass after the catalog-expansion proof.
6. Update `docs/CHANGELOG.md` for the implementation.
7. Do not mark planning HLG/CLG closed in code. Report exact coverage so HLG > Spec can perform the final doc closeout.

#### Likely Files

- `src/app/workspace/workspaceSurfaceCatalog.ts`
- `src/app/workspace/workspaceSurfaceCatalog.test.ts`
- `src/app/workspace/workspaceSurfaceActionEligibility.ts`
- `src/app/workspace/workspaceSurfaceActionEligibility.test.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.workspaceModes.test.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`

#### No-Widening Rule

Do not add a new user-facing workspace mode solely to prove catalog expansion unless the existing catalog seam already has a natural entry ready to expose.

Do not redesign Console command grammar, labels, aliases, breadcrumbs, action ids, or owner-backed execution. Keep this as proof and cleanup of the catalog-driven model, not a new Console command system.

Do not fix unrelated broad `ConsoleDock.test.tsx` failures unless one is proven to be caused by Console Workspace Modes catalog expansion work.

#### Checklist

- [x] Optional or non-original catalog-backed surfaces are covered through Console Workspace Modes without Console-local allowlists.
- [x] A catalog-expansion proof shows future catalog-supported surfaces can receive shared eligibility decisions without editing Console menu/runtime branches.
- [x] Remaining Console Workspace Modes menu/runtime allowlist duplicates are removed or justified as owner execution, not eligibility.
- [x] Primary/non-primary protection still comes from shared eligibility.
- [x] Unsupported actions are hidden by shared eligibility or produce shared diagnostics.
- [x] Slotted, floating, detached, and popout target identity remains unified after the proof.
- [x] Worker reports whether all `Console-Gen1` HLG/CLG appear satisfied or names any leftover gap for HLG > Spec closeout.

#### Verification Shape

Focused verification:

```powershell
npm.cmd test -- workspaceSurfaceCatalog workspaceSurfaceActionEligibility stagedNavigation.workspaceModes ConsoleDock
```

Build gate:

```powershell
npm.cmd run build
```

#### Done Shape

Phase 5 is done when a Worker can point to tests and code seams proving Console Workspace Modes derives surface/action availability from canonical catalog/support and shared eligibility for current and future catalog-backed surfaces, without Console-local menu/runtime allowlist patches, and can hand HLG > Spec a clear closeout read for every `Console-Gen1` HLG and CLG.

#### Coverage Review

Accepted.

Kepler added `workspaceSurfaceActionEligibility` coverage proving every registered workspace surface catalog entry mirrors shared action eligibility support, updated `stagedNavigation.workspaceModes` coverage so viewport-type labels and action ids derive from `getWorkspaceSurfaceCatalogEntries(...)`, added Console runtime proof for optional `dashboard` through the Workspace Modes target/menu/runtime popout path, audited the Workspace Modes seams, and updated `docs/CHANGELOG.md` entry `[1573]`.

Verification accepted for this phase: `npm.cmd test -- workspaceSurfaceActionEligibility stagedNavigation.workspaceModes ConsoleDock --testNamePattern "mirrors catalog support|advances into the workspace modes|routes optional dashboard"` passed, `workspaceSurfaceCatalog`, `workspaceSurfaceActionEligibility`, `stagedNavigation.workspaceModes`, and the Phase 5 `ConsoleDock` dashboard/catalog proof passed under the required broad command, and `npm.cmd run build` passed with existing Vite warnings. The broader `ConsoleDock.test.tsx` command still has known unrelated reference, graph, sketch, and transform failures outside this generation closeout.

Final closeout read: no follow-up phase is needed for `Console-1`. The five-phase ladder satisfies `Console-Gen1-HLG-1` through `Console-Gen1-HLG-6` and `Console-Gen1-CLG-1` through `Console-Gen1-CLG-6`. Remaining surface-kind branches are accepted as owner execution details, not Console-local eligibility or visibility allowlists.

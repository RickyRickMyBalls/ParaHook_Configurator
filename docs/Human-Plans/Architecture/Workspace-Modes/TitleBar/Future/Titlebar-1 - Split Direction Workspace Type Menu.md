# Titlebar-1 - Split Direction Workspace Type Menu

## Doc Header

### Doc History
7. 2026-05-18 11:12:21: Implemented and closed `Titlebar-1 / Phase 3 - Regression Proof And Closeout` after focused `ViewportFrame` regression coverage proved canonical third-level workspace type reuse, direct `Split Right` click preservation, selected `Split Right > Browser` callback separation from direct split callbacks, disabled/no-callback inertness, `WorkspaceViewportTree` still proved selected surface-kind split routing, and production build verification passed.
6. 2026-05-18 11:08:40: Prepped `Titlebar-1 / Phase 3 - Regression Proof And Closeout` for implementation against the shipped Phase 1 and Phase 2 menu behavior, existing `ViewportFrame` and `WorkspaceViewportTree` tests, direct split click preservation, selected workspace type split proof, canonical workspace type list reuse, disabled/no-callback safeguards, and final closeout tracking.
5. 2026-05-18 10:13:04: Implemented and closed `Titlebar-1 / Phase 2 - Selected Workspace Split Action` after the third-level titlebar workspace-type choices became active, `ViewportFrame` emitted direction-plus-surface split intents, `WorkspaceViewportTree` bridged those intents into the existing split callback path, AppShell routed them through `splitViewportSlot(..., { surfaceKind })`, focused frame/tree tests proved `Split Right > Browser`, and production build verification passed.
4. 2026-05-18 09:09:06: Prepped `Titlebar-1 / Phase 2 - Selected Workspace Split Action` for implementation against the shipped Phase 1 third-level menu, the existing `ViewportFrame` split direction rows, `WorkspaceViewportTree` slot-level split callback bridge, and `useWorkspaceStore.splitViewportSlot(..., { surfaceKind })` owner path, keeping the work scoped away from new store mutations, floating-titlebar parity, and broad menu redesign.
3. 2026-05-18 08:50:02: Implemented and closed `Titlebar-1 / Phase 1 - Nested Split Direction Menu` after `ViewportFrame` gained third-level canonical workspace-type display submenus under each split direction, direct split-direction clicks stayed on the existing callbacks, focused frame tests covered canonical labels and click preservation, and production build verification passed.
2. 2026-05-18 08:15:50: Prepped `Titlebar-1 / Phase 1 - Nested Split Direction Menu` for implementation against the live `ViewportFrame` action-menu state, existing `splitActions` and `surfaceChoices` reads, third-level split-direction hover state, no selected-workspace split mutation, and focused menu-display plus direct-click preservation proof.
1. 2026-05-18 08:06:14: Added this future `Titlebar-1` plan to capture the titlebar right-click split workflow where each split direction can either run the default split action directly or open a third-level canonical workspace-type menu for choosing the new pane's surface.

### Purpose

Use this phase to plan the workspace titlebar context-menu upgrade.

The goal is to make right-click split authoring more expressive without changing the user's existing quick action. A user should still be able to right-click a workspace titlebar, hover `Split`, and click `Split Right` directly. The new behavior adds a third-level submenu so hovering `Split Right` can also reveal the canonical workspace type list, letting the user choose what surface should appear in the newly split pane.

### Scope

This phase covers:
- titlebar right-click split menu planning
- a third-level workspace-type submenu under each split direction
- canonical viewport/workspace type list reuse
- preserving the existing direct split-direction click behavior
- focused implementation and verification boundaries for later runtime work

This phase does not cover:
- replacing the existing viewport type picker
- changing workspace surface registration
- inventing a new workspace menu list separate from the canonical viewport type choices
- changing floating or pop-out titlebar behavior unless later code proves it can reuse the same frame menu cleanly
- broad visual redesign of the titlebar

## Doc Body

### Summary

`Titlebar-1` adds a richer split flow to the workspace titlebar context menu.

The intended user experience is:
1. The user right-clicks a workspace titlebar.
2. The user hovers `Split`.
3. The user hovers a split direction such as `Split Right`.
4. The user can either click `Split Right` directly or move into a third-level workspace-type submenu.
5. If the user picks `Browser`, `Console`, `Catalog`, or another canonical workspace type, the current workspace splits in that direction and the new pane opens with the selected workspace type.

The interaction should be direction-first, workspace-type-second.

### Current Live Read

Useful current seams:
- `src/app/workspace/ViewportFrame.tsx` owns the shared slotted workspace titlebar and its local action menu.
- `ViewportFrame` already has `hoveredActionSubmenu` and `lockedActionSubmenu` state for first-level action submenus.
- `ViewportFrame` already builds `surfaceChoices` from `getWorkspaceViewportTypeChoiceEntries(availableSurfaceKinds)` and applies primary-slot disabled state through `workspacePrimarySlotSupportsSurfaceKind(...)`.
- `ViewportFrame` already builds `splitActions` from `onSplitTop`, `onSplitRight`, `onSplitBottom`, and `onSplitLeft`.
- Phase 1 changed `ViewportFrame` so the `Split` submenu now renders direction rows that can reveal a third-level canonical workspace type submenu.
- The Phase 1 third-level workspace type buttons are intentionally disabled/display-only until Phase 2 wires selected workspace split mutation.
- `src/app/workspace/WorkspaceViewportTree.tsx` converts slot state into `ViewportFrame` action callbacks.
- `WorkspaceViewportTree` currently passes `onSplitTop`, `onSplitRight`, `onSplitBottom`, and `onSplitLeft` as `slotId + dockSide` wrappers around its `onSplitViewportSlot(...)` prop.
- `WorkspaceViewportTree` can add one direction-plus-surface callback without owning the split mutation itself.
- `src/app/workspace/workspaceViewportTypeChoices.ts` owns the canonical viewport/workspace type menu entries and labels.
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` owns shared titlebar action availability for split, viewport type, float, pop-out, and close.
- `src/app/workspace/useWorkspaceStore.ts` owns the actual split mutation path.
- `useWorkspaceStore.splitViewportSlot(slotId, dockSide, { surfaceKind })` already accepts a selected `WorkspaceSurfaceKind` and creates the new pane with a generated surface instance id.

### Locked Direction

The third menu should reuse the same canonical workspace list as the viewport type picker.

Do:
- keep titlebar context-menu UI owned by `ViewportFrame`
- keep action availability catalog-driven through shared eligibility
- keep the existing direct split-direction click behavior
- let the third-level submenu choose the surface kind for the newly created pane
- include the current workspace type in the third-level list so users can intentionally split into another pane of the same type

Do not:
- create a second hard-coded workspace list
- make users choose a workspace type before they can use the fast direct split action
- move split authoring into individual workspace surface bodies
- treat this as a new workspace surface family

### Likely Implementation Shape

`ViewportFrame` should grow a nested split submenu shape:

```text
Split >
  Split Top >
    Model Viewport
    Browser
    Console
    Catalog
    ...
  Split Right >
    Model Viewport
    Browser
    Console
    Catalog
    ...
  Split Bottom >
    ...
  Split Left >
    ...
```

Clicking `Split Right` itself should still call the existing default split callback.

Choosing `Split Right > Browser` should call a new direction-plus-surface callback, such as:

```ts
onSplitRightWithSurfaceKind?.('browser')
```

`WorkspaceViewportTree` should then route that callback into the existing workspace split owner path with the selected `WorkspaceSurfaceKind`.

## Vision

The user-facing promise is:
- right-click titlebar splitting stays fast for common default splits
- advanced users can choose the next pane's workspace type without doing a split first and then changing the viewport type afterward
- the menu feels like one shared workspace shell feature, not a different custom menu per surface
- future workspace types automatically appear in this third menu through the canonical workspace type list

What must stay true:
- shared workspace shell behavior stays owned by the shared frame and workspace tree
- workspace type labels come from canonical catalog-derived helpers
- split mutations stay in the workspace store owner path
- surface bodies do not own titlebar split behavior

## Wishlist Organization

### High Level Goals
- [x] `Titlebar-1-HLG-1. Right-clicking a workspace titlebar should let the user split the current workspace by direction.`
- [x] `Titlebar-1-HLG-2. Hovering a split direction should reveal a third menu containing the canonical workspace type list.`
- [x] `Titlebar-1-HLG-3. Clicking a direction directly should keep the existing default split behavior.`
- [x] `Titlebar-1-HLG-4. Choosing a workspace type from the third menu should split in that direction and open the chosen workspace type in the new pane.`
- [x] `Titlebar-1-HLG-5. The third menu should stay canonical so new registered workspace types appear without a second hard-coded list.`

### Codex Level Goals
- [x] CLG 1. Reuse `getWorkspaceViewportTypeChoiceEntries(...)` for the third-level workspace type submenu.
- [x] CLG 2. Keep nested titlebar menu state local to `ViewportFrame` unless later implementation shows it must be shared.
- [x] CLG 3. Add direction-plus-surface callbacks from `ViewportFrame` to `WorkspaceViewportTree`.
- [x] CLG 4. Route selected surface-kind splits through the existing workspace split mutation owner.
- [x] CLG 5. Preserve the existing direct split direction click behavior.
- [x] CLG 6. Add focused tests for direct direction split and direction-plus-workspace split.

### `Titlebar-1 / Phase 1`

- [x] Add the third-level split direction workspace-type menu in `ViewportFrame`.
- [x] Preserve direct split-direction click behavior.
- [x] Reuse canonical viewport type choice entries.
- [x] `Titlebar-1-HLG-1`
- [x] `Titlebar-1-HLG-2`
- [x] `Titlebar-1-HLG-3`
- [x] `Titlebar-1-HLG-5`
- [x] CLG 1.
- [x] CLG 2.
- [x] CLG 5.

### `Titlebar-1 / Phase 2`

- [x] Add direction-plus-surface callback plumbing from `ViewportFrame` into `WorkspaceViewportTree`.
- [x] Split the current pane in the requested direction with the selected workspace type.
- [x] Keep unsupported surface choices disabled or filtered according to shared action/catalog rules.
- [x] `Titlebar-1-HLG-4`
- [x] `Titlebar-1-HLG-5`
- [x] CLG 3.
- [x] CLG 4.

### `Titlebar-1 / Phase 3`

- [x] Add focused regression proof for direct split direction behavior.
- [x] Add focused regression proof for split direction plus selected workspace type.
- [x] Close the phase or record follow-on polish separately.
- [x] `Titlebar-1-HLG-1`
- [x] `Titlebar-1-HLG-2`
- [x] `Titlebar-1-HLG-3`
- [x] `Titlebar-1-HLG-4`
- [x] CLG 6.

## [x] `Titlebar-1 / Phase 1` - `Nested Split Direction Menu`

### Phase 1 Summary

Add the third-level submenu structure to the shared titlebar action menu while preserving the existing click behavior for each split direction.

This phase should prove:
- `Split > Split Right` can still be clicked directly
- hovering `Split Right` can reveal the canonical workspace type list
- the list is derived from the existing viewport type choices rather than a duplicate list

### Phase 1 Implementation Spec

#### Purpose

Make the menu structure real without changing split mutation semantics yet.

#### Owns

- `ViewportFrame` nested split menu state
- third-level submenu rendering under each split direction
- canonical workspace type list display
- direct split direction click preservation

#### Does Not Own

- selected workspace type split mutation
- workspace store changes
- new workspace surface registration
- floating-titlebar menu parity
- broad menu styling redesign

#### First Code Cut

This first pass should:
- add nested split direction submenu state to `ViewportFrame`, likely as a direction-specific hover/lock value separate from the existing first-level `split` and `viewportType` submenu state
- reuse the existing `surfaceChoices` read instead of calling `getWorkspaceViewportTypeChoiceEntries(...)` a second time
- render the third-level menu for each split direction from the same `surfaceChoices` entries used by the existing `Viewport Type` submenu
- keep third-level workspace type buttons display-only or disabled/no-op in Phase 1 unless the selected split action already exists in Phase 2
- keep each direction's existing `onSplitTop`, `onSplitRight`, `onSplitBottom`, and `onSplitLeft` direct action intact
- close or reset the third-level hover/lock state when the action menu closes, outside-pointer dismissal runs, Escape/selection closes the menu, or the user leaves the split submenu

#### Implementation Notes

- Keep the current `Split` row as the first-level submenu trigger.
- Convert each split direction row into a submenu-capable row with its own chevron.
- Clicking the split direction row should still call `handleActionSelect(action.onSelect)`.
- Hovering or focusing the split direction row should open the third-level workspace type submenu.
- The third-level submenu should render canonical workspace type labels and disabled state from `surfaceChoices`.
- Phase 1 should not add `onSplitRightWithSurfaceKind` or similar callback props; that belongs to Phase 2.
- Phase 1 should not claim that choosing `Browser` creates a Browser split. If the UI needs selectable-looking entries for proof, the entries should be inert or clearly reserved until Phase 2.

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx` or a focused `ViewportFrame` test if one exists or is added later
- `src/app/theme/foundation/base.css` or the current `ViewportFrameActionSubmenu` CSS owner only if a tiny positioning rule is needed for the third level
- `docs/Human-Plans/Architecture/Workspace-Modes/TitleBar/Future/Titlebar-1 - Split Direction Workspace Type Menu.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Verification Shape

- Focused component/menu test that right-clicking the titlebar opens `Split`, hovering or focusing `Split Right` reveals canonical workspace type labels such as `Model Viewport` and `Browser`.
- Focused proof that clicking `Split Right` still invokes the original `onSplitRight` callback.
- Focused proof that the third-level menu reads canonical entries rather than a hard-coded local list.
- Existing workspace viewport tree tests should continue to pass if touched.

#### Done Shape

- The third-level canonical workspace-type submenu is visible under split directions.
- Direct split direction clicks still call the existing split callbacks.
- No selected-workspace split mutation is claimed until Phase 2.

#### Shipped Result

- `ViewportFrame` now renders split direction rows as nested submenu-capable rows.
- Hovering or focusing a split direction reveals the canonical workspace type list from the same `surfaceChoices` read as the existing viewport type submenu.
- Third-level workspace type buttons are intentionally disabled/display-only in Phase 1 because selected workspace split mutation belongs to Phase 2.
- Direct split direction clicks still call the existing split callbacks and close the titlebar menu.

#### Verification

- `npm.cmd test -- --run src/app/workspace/ViewportFrame.test.tsx`
- `npm.cmd run build`

## [x] `Titlebar-1 / Phase 2` - `Selected Workspace Split Action`

### Phase 2 Summary

Wire the third-level workspace type choice to the split mutation path.

This phase should prove:
- `Split > Split Right > Browser` creates a right split with a Browser workspace in the new pane
- other canonical workspace types use the same shared callback path
- unsupported choices follow the existing catalog/eligibility rules

### Phase 2 Implementation Spec

#### Purpose

Turn the third-level menu from a displayed chooser into an actual split-authoring action.

#### Owns

- direction-plus-surface callback props
- `WorkspaceViewportTree` callback wiring
- selected workspace split mutation through existing workspace owner paths
- focused direct behavior proof

#### Does Not Own

- changing canonical workspace labels
- adding new workspace types
- replacing the separate viewport type picker
- detached/popup titlebar parity

#### First Code Cut

This pass should:
- replace the Phase 1 disabled third-level workspace type buttons with active buttons when the matching direction split callback exists
- add one generic `ViewportFrame` callback such as `onSplitWithSurfaceKind(dockSide, surfaceKind)` instead of four near-duplicate props, unless local TypeScript ergonomics strongly favor explicit direction props
- keep the existing direct direction callbacks unchanged for `Split Right` direct clicks
- route each selected workspace type from `ViewportFrame` into `WorkspaceViewportTree` with the chosen direction and `WorkspaceSurfaceKind`
- have `WorkspaceViewportTree` call `onSplitViewportSlot(slot.slotId, dockSide, { surfaceKind })` or an equivalent widened prop shape
- route the selected surface kind into `useWorkspaceStore.splitViewportSlot(slotId, dockSide, { surfaceKind })` from the existing AppShell owner path
- close the menu after selection
- keep the direct split direction action as the default no-type-selected action

#### Implementation Notes

- Prefer widening the existing split callback shape over adding a second unrelated split system.
- Keep the split mutation owned by the current AppShell/store path. `ViewportFrame` should only emit intent.
- Reuse existing `WorkspaceSplitDockSide` and `WorkspaceSurfaceKind` types.
- Do not create a separate selected-workspace split helper unless it removes real duplication after the first implementation pass.
- Keep the third-level list canonical through the existing `surfaceChoices` read.
- Treat disabled `surfaceChoices` entries the same way as the existing viewport type submenu; if a choice is disabled there, it should not become an active split target here.
- The direct direction button and the third-level type button should be separate click targets: direct `Split Right` uses current/default split behavior, while `Split Right > Browser` creates the new right pane as Browser.

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/ViewportFrame.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/TitleBar/Future/Titlebar-1 - Split Direction Workspace Type Menu.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Verification Shape

- Focused test for direct `Split Right`.
- Focused `ViewportFrame` test that selecting `Split Right > Browser` calls the direction-plus-surface callback and closes the menu.
- Focused `WorkspaceViewportTree` or store-facing test that `Split Right > Browser` creates a right split whose new slot has `surfaceKind: 'browser'`.
- Focused test that the menu options come from the canonical viewport type choices.
- Production build.

#### Done Shape

- Users can split by direction and choose the newly created pane's workspace type in one flow.
- Direct split direction behavior remains intact.
- The third-level workspace type buttons are active for supported choices.
- No floating-titlebar or popup parity is claimed.

#### Shipped Result

- `ViewportFrame` now supports a generic `onSplitWithSurfaceKind(splitDockSide, surfaceKind)` callback.
- Third-level workspace type choices are active when that callback is available and still honor the existing disabled state from canonical `surfaceChoices`.
- `WorkspaceViewportTree` bridges selected workspace type split intents with the current slot id.
- AppShell routes selected workspace type splits through the existing `handleViewportSlotSplit(...)` and `splitViewportSlot(..., { surfaceKind })` owner path.
- Direct direction clicks still use the existing default split behavior.

#### Verification

- `npm.cmd test -- --run src/app/workspace/ViewportFrame.test.tsx`
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx`
- `npm.cmd run build`

## [x] `Titlebar-1 / Phase 3` - `Regression Proof And Closeout`

### Phase 3 Summary

Harden the menu behavior and close the phase honestly.

This phase should prove:
- nested menu hover/click behavior does not regress direct split actions
- selected workspace type splits work for representative surface types
- follow-on polish is recorded separately instead of widening this phase

### Phase 3 Implementation Spec

#### Purpose

Close `Titlebar-1` with focused behavior proof and a clear follow-on boundary.

#### Owns

- regression coverage for direct and selected-type split flows
- final doc closeout
- follow-on polish notes if needed

#### Does Not Own

- large visual redesign
- cross-window menu parity
- broader workspace shell cleanup

#### Current Live Read

- `ViewportFrame.test.tsx` already covers opening the titlebar action menu, revealing `Split`, showing canonical workspace type choices under `Split Right`, preserving direct `Split Right` clicks, and selecting `Split Right > Browser`.
- `WorkspaceViewportTree.test.tsx` already covers the store-facing `Split Right > Browser` path by using the tree callback to call `splitViewportSlot(slotId, dockSide, { surfaceKind })`.
- `ViewportFrame` now owns one generic `onSplitWithSurfaceKind(splitDockSide, nextSurfaceKind)` callback and keeps direct split direction callbacks separate.
- The third-level menu still uses `surfaceChoices`, so canonical workspace type list proof should stay tied to the existing viewport type choice helper instead of a duplicate fixture.
- Phase 3 should add missing guardrails only where the current proof is thin, not reshape the runtime feature.

#### First Pass Decisions

- Treat Phase 3 as regression hardening and closeout, not a new UX phase.
- Prefer focused tests over runtime code edits unless a test exposes a real behavior gap.
- Keep the direct split direction click as the most important preserved behavior.
- Keep `Browser` as the representative selected workspace type because it exercises the selected surface-kind path and the browser split-ratio branch.
- Add a disabled/no-callback guard if current coverage does not already prove that display-only third-level choices cannot fire when `onSplitWithSurfaceKind` is absent.

#### Exact First Code Cut

This pass should:
- add or tighten `ViewportFrame` coverage that direct `Split Right` still calls only `onSplitRight`, even after the third-level submenu has been revealed
- add or tighten `ViewportFrame` coverage that `Split Right > Browser` calls `onSplitWithSurfaceKind('right', 'browser')`, closes the menu, and does not call the direct split callback
- add or tighten coverage that third-level choices are disabled or inert when no selected-workspace split callback is available
- keep canonical-list proof anchored to `getWorkspaceViewportTypeChoiceEntries(...)` / `surfaceChoices`
- keep `WorkspaceViewportTree` coverage for the selected workspace type split path, including the new slot's `surfaceKind`
- update this phase doc with closeout notes after implementation
- update `docs/CHANGELOG.md` and `docs/Doc-Log.md` according to repo rules after implementation

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/TitleBar/Future/Titlebar-1 - Split Direction Workspace Type Menu.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not add floating-titlebar parity, pop-out titlebar parity, new workspace type labels, menu animation work, or broad titlebar visual redesign in this phase. If any of those are desirable, record them as follow-on polish instead of folding them into `Titlebar-1 / Phase 3`.

#### Implementation Risks

- A third-level button could accidentally also trigger the parent direction click if event handling regresses.
- Direct split clicks could become harder to use if hover state steals focus or changes button semantics.
- Disabled third-level choices could become active in shells that do not provide `onSplitWithSurfaceKind`.
- A future workspace type could be missed if tests accidentally hard-code an alternate list instead of proving canonical helper reuse.

#### Checklist

- [x] Preserve direct `Split Right` click behavior after nested submenu reveal.
- [x] Prove `Split Right > Browser` calls the selected workspace split callback only.
- [x] Prove selected workspace type split reaches the tree/store-facing split path with `surfaceKind: 'browser'`.
- [x] Prove third-level choices remain canonical through existing workspace viewport type choices.
- [x] Prove no-callback or disabled third-level choices are inert.
- [x] Close `Titlebar-1` or record follow-on polish separately.

#### Verification Shape

- `npm.cmd test -- --run src/app/workspace/ViewportFrame.test.tsx`
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx`
- `npm.cmd run build`

#### Done Shape

- `Titlebar-1` has shipped or has a clearly recorded follow-on.
- Remaining menu polish is separated from the core split-direction workspace-type action.

#### Shipped Result

- `ViewportFrame` regression coverage now compares split-direction workspace type labels directly against `getWorkspaceViewportTypeChoiceEntries()`, keeping the third-level menu tied to the canonical workspace type list.
- `ViewportFrame` regression coverage now proves `Split Right > Browser` calls only `onSplitWithSurfaceKind('right', 'browser')` and does not also call the direct `onSplitRight` action.
- `ViewportFrame` regression coverage now proves third-level workspace type buttons remain disabled and inert when no selected-type split callback exists.
- `WorkspaceViewportTree` coverage continues to prove `Split Right > Browser` reaches the store-facing split path and creates a right split with a Browser slot.
- No broad titlebar visual redesign, floating-titlebar parity, popup parity, or new workspace surface labels were added.

#### Verification

- `npm.cmd test -- --run src/app/workspace/ViewportFrame.test.tsx`
- `npm.cmd test -- --run src/app/workspace/WorkspaceViewportTree.test.tsx`
- `npm.cmd run build`

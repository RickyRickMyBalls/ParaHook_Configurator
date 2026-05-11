# Workspace Phase Workspace-10 - Shared Workspace Shell Controls

## Doc Header

### Doc History
16. 2026-05-11 16:28:08: Implemented and closed `Workspace-10 / Phase 5 - Popup Parity Decision And Final Shell Closeout` by adding popup-local split-pane inline close parity through `PopupWorkspaceShell` and `ViewportFrame`, proving popup root close protection plus secondary popup split close collapse, and explicitly deferring broader detached floating/popout host titlebar convergence to `Workspace-11` or a later dedicated host-shell lane.
15. 2026-05-11 16:24:01: Prepped `Workspace-10 / Phase 5 - Popup Parity Decision And Final Shell Closeout` against the current `PopupWorkspaceShell`, detached Model Viewer, Dashboard, Notepad, Catalog, Browser, Console, and Spaghetti host seams, narrowing implementation to popup-local `ViewportFrame` parity proof plus explicit detached-host deferral unless reuse is tiny and identical.
14. 2026-05-11 16:21:12: Implemented and closed `Workspace-10 / Phase 3 - Protected-Pane Eligibility And Close Continuity` by deriving slotted pane close callbacks from shared `workspaceSurfaceActionEligibility.canClose`, blocking primary Model Viewer menu-close drift, preserving secondary split-pane direct and menu close continuity, and passing focused eligibility/tree tests plus build verification.
13. 2026-05-11 16:18:18: Prepped `Workspace-10 / Phase 3 - Protected-Pane Eligibility And Close Continuity` against the post-Phase-2 shared shell, naming the remaining `WorkspaceViewportTree` local close exception, shared `workspaceSurfaceActionEligibility` policy, direct inline-close continuity proof, menu-close parity, and no-widening boundary before implementation.
12. 2026-05-11 15:55:21: Implemented and closed `Workspace-10 / Phase 2 - Shared Shell Control Strip Ordering` after moving Browser and Model Viewer presentation controls out of the shared viewport-type button, keeping the shared `-` first in the `ViewportFrame` header, routing pop-out visibility through shared action eligibility, preserving split-only inline close behavior, and passing focused frame/tree/AppShell tests plus `npm run build`.
11. 2026-05-11 15:39:28: Tightened `Workspace-10 / Phase 2 - Shared Shell Control Strip Ordering` prep against the post-Phase-1 `ViewportFrame`, `WorkspaceViewportTree`, viewport-type choice helper, shared action eligibility, Model Viewer primary-button/result-mode seam, and representative surface chrome, keeping the implementation scope narrowly on main-workspace shell-control ordering without widening into popup parity or protected-pane policy.
10. 2026-05-11 15:31:43: Implemented and closed `Workspace-10 / Phase 1 - Anchored Split-Pane Close Button` after adding the shared inline split-pane close affordance through `ViewportFrame`, gating it from `WorkspaceViewportTree` with split structure plus shared close eligibility, preserving the titlebar menu close route, and passing focused frame/tree tests plus `npm run build`.
9. 2026-05-11 15:26:36: Refined `Workspace-10 / Phase 1 - Anchored Split-Pane Close Button` prep against the current `ViewportFrame`, `WorkspaceViewportTree`, eligibility, CSS, and test seams, clarifying the explicit inline-close prop, split-tree gating, shared eligibility import, narrow verification path, build gate, tracking-doc requirement, and stop condition without implementing runtime changes.
8. 2026-05-11 15:19:22: Worked the expanded shared-shell vision down into the `Workspace-10` wishlist and implementation ladder, keeping Phase 1 as the prepared split-pane close-button slice while routing model A/D/F ordering, shared control-strip audit, protected eligibility, and popup parity into explicit follow-on phases.
7. 2026-05-11 15:17:29: Added the model-workspace shell ordering rule that the shared `-` viewport-type button must come before the Model Viewer A/D/F result-mode control, preserving model-specific presentation controls while standardizing the shared pane shell.
6. 2026-05-11 15:13:18: Expanded `Workspace-10` from a close-button-only cleanup into a shared workspace shell control-standardization lane, preserving the split-pane `x` first pass while adding the standard `-` viewport-type button, split-pane close button, and top-right pop-out arrow as one shared `ViewportFrame` control-strip contract.
5. 2026-05-10 12:44:58: Implemented `Workspace-10 / Phase 4 - Canonical Viewport Type Menu Reads` by landing one shared viewport-type choice helper for the runtime picker and Console staged-navigation path, retiring the `ViewportFrame` fallback list plus duplicate label shaping, and adding focused expansion-proof plus build verification.
4. 2026-05-10 12:42:54: Prepped `Workspace-10 / Phase 4 - Canonical Viewport Type Menu Reads` for implementation by grounding the shared menu-choice cleanup against the live `workspaceSurfaceCatalog.ts`, `workspaceSurfaceActionEligibility.ts`, `ViewportFrame.tsx`, and `stagedNavigation.ts` seams, while making the existing duplicate label/order logic and the intended one-helper convergence target explicit.
3. 2026-05-10 12:36:58: Prepped `Workspace-10 / Phase 1 - Anchored Split-Pane Close Button` for implementation by grounding the first close-button cut against the live `ViewportFrame` titlebar shell, `WorkspaceViewportTree` split-slot routing seam, and `useAppShellViewportActions.ts` close-owner behavior, while making the primary-slot `modelViewer -> homePage` exception and the likely proof targets explicit.
2. 2026-05-10 12:31:42: Added `Workspace-10 / Phase 4 - Canonical Viewport Type Menu Reads` so the same shared shell-cleanup family now captures the follow-on work to replace hard-coded viewport-type menu lists with one canonical catalog-driven read path shared by the runtime picker and later workspace-mode menu surfaces.
1. 2026-05-10 12:17:27: Added this new open `Workspace-10` family phase doc so split-workspace close-button cleanup now has one explicit planning home, with the first cleanup slice narrowly aimed at anchoring an `x` close control at the top-right of every split workspace pane through the existing shared close-owner path.

### Purpose

Use this phase to make workspace pane shell controls more direct, standardized, and legible by treating the viewport-type `-` button, split-pane `x` close control, and top-right pop-out arrow as shared `ViewportFrame` chrome instead of per-workspace surface UI.

The first visible cleanup is still the split-pane `x` close control, but the broader family goal is a standard shell control strip that every eligible workspace pane receives through the shared frame.

The goal is to let the user change viewport type, close eligible split panes, and pop out eligible panes from one predictable pane frame without depending on one-off workspace-specific controls, while keeping each action on its already-settled shared owner path.

### Scope

This phase covers:
- standard shared pane-shell controls for viewport type, close, and pop-out
- top-right close affordances on split workspace panes
- shell-level button placement and visibility rules for split mode
- shared placement and eligibility language for the existing viewport-type `-` button
- shared placement and eligibility language for the existing pop-out arrow button
- reuse of the existing shared close owner path
- proof that the close control removes the correct split pane

This phase does not cover:
- a new split-removal or merge ownership model
- unsplit root-workspace close behavior
- popup workspace parity unless the shared-shell control strip stays tiny and identical
- broader titlebar redesign outside the close-control seam
- new viewport surface kinds or new pop-out behavior

## Doc Body

### Summary

`Workspace 10` is the shared workspace shell-control standardization phase, starting with split-workspace close-control discoverability.

It should deliver:
- one shared shell control strip where eligible workspace panes expose viewport-type, close, and pop-out actions through `ViewportFrame`
- one standard `-` viewport-type button path for changing the pane's surface kind
- one visible top-right `x` affordance on every close-eligible split workspace pane
- one standard top-right pop-out arrow affordance on every pop-out-eligible pane
- one shared shell rule for when that button appears
- one reuse of existing action owner paths instead of second local action models
- one focused proof surface that the clicked pane is the pane that closes

### Locked Direction

`Workspace 10` should be:
- a shared workspace pane shell-control cleanup
- a discoverability improvement for existing viewport-type, close, and pop-out behavior
- a standardization pass through `ViewportFrame`, not through individual workspace surfaces
- a reuse of the already-landed `removeViewportSlot(...)` owner path
- one phase that can be edited forward in small follow-on slices if edge cases appear

`Workspace 10` should not be:
- a fresh close or merge architecture
- a root-unsplit workspace removal pass
- a workspace-type-specific button set that only some pane implementations hand-code
- a silent retirement of the existing titlebar menu close action
- a new viewport-type picker architecture after the completed Phase 4 helper cleanup
- a new pop-out ownership model

### Locked Interaction Model

- The `-` viewport-type affordance should remain part of the shared pane frame and should stay wired to the shared viewport-type choice path.
- In Model Viewer workspaces, the shared `-` viewport-type affordance should appear before the Model Viewer A/D/F result-mode control so shell navigation stays first and model presentation mode stays adjacent but secondary.
- The close affordance should be anchored at the top-right of the visible split pane shell.
- The affordance should only appear when the workspace is actually in split mode.
- Clicking the `x` should close that pane through the existing shared close owner path.
- The pop-out arrow should stay a shared top-right pane-shell action for panes whose surface and slot position are pop-out eligible.
- The button should not bypass the current slot-removal truth or invent a local pane-state shortcut.
- The existing menu-based `Close` action should remain available as a secondary route.
- Individual workspace surfaces should not hand-code their own copies of these shell controls.

### Suggested First-Pass Guardrails

- Reuse the existing `ViewportFrame.tsx` titlebar shell instead of creating one workspace-type-specific overlay.
- Treat `ViewportFrame` as the shared home for the `-`, `x`, and pop-out arrow controls.
- Preserve the Model Viewer ordering as `-` first, then A/D/F, then the rest of the shared header controls.
- Keep the split-mode visibility rule structural so unsplit root panes do not get a misleading close button.
- Keep close eligibility aligned with the already-supported `canClose` read instead of hard-coding special-case pane types into the new button.
- Keep viewport-type and pop-out eligibility aligned with the already-shared surface catalog and action-eligibility rules.
- Prove that the clicked split pane closes while its sibling expands through the existing workspace-tree behavior.

### Acceptance Read

This phase counts as honest when:
- split workspaces show a visible top-right `x` close control on each eligible pane
- the shared pane frame owns the visible `-`, `x`, and pop-out arrow shell controls rather than individual surfaces hand-coding them
- the `-` viewport-type control remains available through the canonical Phase 4 choice helper
- the pop-out arrow remains available on eligible panes through the existing pop-out owner path
- the unsplit root workspace does not show that split-only affordance
- clicking the button closes the pane that was clicked
- pane removal still happens through the settled shared workspace owner path
- the existing titlebar menu close route still works

### Current Live Read

Likely current owner seams for this phase:
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/workspaceSurfaceActionEligibility.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`

Current useful truth already present:
- `ViewportFrame.tsx` already accepts an `onClose` action and already owns the titlebar shell where a top-right close button can live honestly
- `ViewportFrame.tsx` already owns the existing `-` viewport-type control and pop-out arrow placement, making it the right shell seam for the standard control strip
- `WorkspaceViewportTree.tsx` already passes `onClose` into split panes and already decides when a slot should use the real shared close path
- `workspaceSurfaceActionEligibility.ts` already computes `canClose`
- `useWorkspaceStore.ts` already owns `removeViewportSlot(...)`
- `AppShell.tsx` and the existing workspace menus already expose close behavior, so the first pass can stay about shell discoverability rather than new removal semantics

## Vision

This phase belongs to the later workspace shell cleanup ladder after split truth and split-corner authoring already exist.

The user-facing promise is:
- every main workspace pane should read as the same kind of pane shell before it reads as Browser, Model Viewer, Console, Catalog, Properties, Settings, or another surface
- the shared `-` viewport-type button should be the first shell navigation affordance
- Model Viewer panes should keep their A/D/F presentation control directly after the shared `-` button
- split panes should expose an obvious `x` close affordance at the pane shell
- pop-out-capable panes should expose the same top-right pop-out arrow through the shared shell
- closing a pane should feel like a direct workspace action, not something hidden behind a menu

Important direction that must stay true:
- shared workspace ownership stays in the existing slot tree and action-owner hooks
- `ViewportFrame` is the shell-control owner for shared pane chrome
- individual workspace surfaces should not hand-code their own copies of `-`, `x`, or pop-out controls
- close affordance is shell-level presentation of an existing action, not a second removal system
- the first pass should stay small enough that later edge cases can become explicit follow-on phases instead of getting buried inside one big cleanup bucket

## Wishlist Organization

### High Level Goals
- [ ] `Workspace-10-HLG-1. Add a visible top-right close button to split workspace panes so pane removal is directly discoverable from the pane shell.`
- [ ] `Workspace-10-HLG-2. Keep the close button shared across workspace pane types instead of turning it into one-off Browser or Model Viewport chrome.`
- [ ] `Workspace-10-HLG-3. Keep pane removal on the existing shared close-owner path instead of inventing a second split-removal model.`
- [ ] `Workspace-10-HLG-4. Keep the first cleanup pass narrow enough that protected-pane rules and later shell polish can stay explicit follow-on work if needed.`
- [ ] `Workspace-10-HLG-5. Standardize the shared workspace shell so eligible panes consistently expose the - viewport-type button, x close button, and top-right pop-out arrow from the pane frame.`
- [ ] `Workspace-10-HLG-6. Keep viewport-type, close, and pop-out controls out of individual workspace surface implementations unless a later surface has an explicit local exception.`
- [ ] `Workspace-10-HLG-7. Keep Model Viewer shell ordering readable by placing the shared - viewport-type button before the A/D/F result-mode control.`

### Codex Level Goals
- [ ] CLG 1. Add one shared shell-level close affordance to split panes through the existing `ViewportFrame` and `WorkspaceViewportTree` path.
- [ ] CLG 2. Gate the new close button to real split-mode panes instead of widening it to the unsplit root workspace.
- [ ] CLG 3. Keep `removeViewportSlot(...)` as the removal owner.
- [ ] CLG 4. Add focused proof that the clicked pane is the pane that closes.
- [ ] CLG 5. Leave popup parity and any protected-pane exceptions as explicit later follow-through unless they are already tiny and shared.
- [ ] CLG 6. Treat `ViewportFrame` as the shared shell owner for the `-`, `x`, and pop-out arrow controls.
- [ ] CLG 7. Keep the viewport-type button on the canonical Phase 4 menu-choice helper and keep the pop-out arrow on the existing pop-out eligibility/action path.
- [ ] CLG 8. Preserve Model Viewer-specific A/D/F controls as adjacent presentation controls after the shared viewport-type button.

### `Workspace-10 / Phase 1`

- [x] Add one anchored top-right `x` button to eligible split workspace panes.
- [x] Reuse the existing shared close action path.
- [x] Keep the unsplit root workspace free of the split-only close affordance.
- [x] Place the new close control as part of the shared `ViewportFrame` shell-control strip beside the existing viewport-type and pop-out controls.
- [x] Add focused proof that the clicked split pane closes correctly.
- [x] `Workspace-10-HLG-1`
- [x] `Workspace-10-HLG-2`
- [x] `Workspace-10-HLG-3`
- [x] `Workspace-10-HLG-5`
- [x] CLG 1.
- [x] CLG 2.
- [x] CLG 3.
- [x] CLG 4.
- [x] CLG 6.

### `Workspace-10 / Phase 2`

- [x] Audit and standardize shared shell-control placement after the Phase 1 close button lands.
- [x] Preserve Model Viewer ordering as `-` before A/D/F.
- [x] Confirm the `-`, `x`, and pop-out arrow are all owned by `ViewportFrame` and not by individual workspace surfaces.
- [x] Keep the viewport-type button on the canonical Phase 4 choice helper and keep pop-out on the existing pop-out path.
- [x] `Workspace-10-HLG-2`
- [x] `Workspace-10-HLG-4`
- [x] `Workspace-10-HLG-5`
- [x] `Workspace-10-HLG-6`
- [x] `Workspace-10-HLG-7`
- [x] CLG 2.
- [x] CLG 5.
- [x] CLG 6.
- [x] CLG 7.
- [x] CLG 8.

### `Workspace-10 / Phase 3`

- [x] Tighten protected-pane and close-eligibility rules if the first shared button pass exposes drift.
- [x] Keep primary or special panes honest without hiding those rules inside button-only branching.
- [x] Recheck the shared close affordance against existing menu actions and workspace-selection continuity.
- [x] `Workspace-10-HLG-2`
- [x] `Workspace-10-HLG-3`
- [x] `Workspace-10-HLG-4`
- [x] CLG 2.
- [x] CLG 3.
- [x] CLG 4.

### `Workspace-10 / Phase 4`

- [x] Replace the hard-coded viewport-type picker list with one shared read derived from the canonical workspace surface catalog plus shared eligibility rules.
- [x] Keep `ViewportFrame` and later workspace-mode menu surfaces aligned to the same surface-choice truth instead of maintaining separate allowlists.
- [x] Preserve ordering, labels, primary-slot restrictions, and host-mode support through one shared helper rather than a raw catalog dump.
- [x] Add expansion-proof tests so newly registered workspace surfaces appear in the viewport-type menu without hand-editing multiple menu owners.
- [x] `Workspace-10-HLG-2`
- [x] `Workspace-10-HLG-4`
- [x] `Workspace-10-HLG-5`
- [x] CLG 2.
- [x] CLG 4.
- [x] CLG 5.
- [x] CLG 7.

### `Workspace-10 / Phase 5`

- [x] Decide whether popup-shell parity is tiny enough to reuse the same close affordance or should stay explicitly deferred.
- [x] Retire or explicitly defer any remaining per-surface shell-control duplication after Phase 2.
- [x] Tighten final shell polish and proof around the shared control strip if later workspace surfaces expose visual drift.
- [x] Close the family honestly around the shared workspace shell-control contract.
- [x] `Workspace-10-HLG-2`
- [x] `Workspace-10-HLG-4`
- [x] `Workspace-10-HLG-5`
- [x] `Workspace-10-HLG-6`
- [x] CLG 5.
- [x] CLG 6.

## [x] `Workspace-10 / Phase 1` - `Anchored Split-Pane Close Button`

### Phase 1 Summary

Add the first visible top-right `x` close control to every eligible split workspace pane.

This phase should prove:
- the shared pane frame can host a direct close button
- the close button joins the existing shared shell controls instead of being hand-coded into individual workspace surfaces
- split panes show that button consistently
- the close control reuses the existing close owner path without changing split-removal semantics

### Phase 1 Implementation Spec

#### Purpose

Make split-pane close behavior directly visible at the pane shell.

#### Owns

- the first shared top-right split-pane close button
- split-mode visibility rules for that button
- focused proof that the clicked pane closes through the existing owner path

#### Does Not Own

- a new slot-removal model
- popup-shell parity
- broad titlebar redesign
- protected-pane policy beyond the minimum needed to keep split-mode close behavior honest

#### Current Live Read

- `src/app/workspace/ViewportFrame.tsx` already owns the titlebar shell and currently exposes `Close` through the menu path plus `onClose`, so this phase can add a direct button there without inventing a second pane-frame owner. Right now the frame has no dedicated inline close affordance, so the first pass likely needs one small new titlebar-button seam rather than another menu branch.
- `src/app/workspace/ViewportFrame.tsx` already owns the `-` viewport-type control and the pop-out arrow placement, so the new close button should join that shared control strip instead of being implemented inside Browser, Model Viewport, Console, Catalog, Properties, Settings, or Dashboard surfaces.
- `src/app/workspace/WorkspaceViewportTree.tsx` already passes `onClose` down for panes that should close through the shared slot-tree path and is the likely structural owner for whether a pane is operating in split mode. It currently sets `onClose` to `undefined` for primary non-model surfaces and routes every other slot to `onCloseViewportSlot(slot.slotId)`, which is the exact seam the new button should continue to use.
- `src/app/workspace/WorkspaceViewportTree.tsx` does not currently import `getWorkspaceSurfaceActionEligibility(...)`, so Phase 1 should add that shared read where the frame props are assembled instead of adding local close/type conditions inside `ViewportFrame`.
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` already computes `canClose`, which should stay the truth source instead of new hard-coded button eligibility rules.
- `src/app/theme/foundation/base.css` already styles `.ViewportFrameModeButton` and `.ViewportFrameActionMenuButton` together, so Phase 1 should add one matching close-button class to that small shared control style rather than creating a separate surface-specific visual language.
- `src/app/workspace/ViewportFrame.tsx` currently uses `actionMenuButtonRef` for the top-right pop-out button even though the right-click action menu opens from the header. If Phase 1 adds a neighboring inline close button, keep the outside-click/ref naming clear enough that the pop-out button, right-click menu, and new inline close button do not accidentally share misleading ref semantics.
- `src/app/workspace/WorkspaceViewportTree.test.tsx` already uses real `useWorkspaceStore.splitViewportSlot(...)` state and can prove that a split tree renders close controls only for eligible split panes, while `src/app/workspace/ViewportFrame.test.tsx` can prove the direct frame button calls `onClose` without replacing the right-click menu close route.
- `src/app/workspace/useWorkspaceStore.test.ts` already proves split slot removal and sibling promotion behavior at the store owner seam, so Phase 1 can use a narrow store-backed proof there if a full `AppShell.test.tsx` click-through would be too broad for the first cut.
- `src/app/hosts/useAppShellViewportActions.ts` already owns `handleCloseViewportSlotFromMenu(...)`, which makes the real root-versus-non-root split explicit: non-primary slots call `removeViewportSlot(slotId)`, while the primary `modelViewer` special case swaps back to `homePage` instead of removing the root slot. This makes it clear that `Phase 1` must stay split-slot-only and must not widen into root close semantics.
- `src/app/workspace/useWorkspaceStore.ts` already owns `removeViewportSlot(...)`, so direct close should remain an affordance upgrade, not a mutation-owner rewrite.
- `src/app/AppShell.test.tsx`, `src/app/workspace/ViewportFrame.test.tsx`, and `src/app/workspace/WorkspaceViewportTree.test.tsx` already cover titlebar interactions, slot routing, and close-related behavior, so the first proof widening should stay focused and should not need a new test harness family.

#### First Pass Decisions

1. The button belongs in the existing shared pane frame, anchored at the top-right of the titlebar shell.
2. Split-mode visibility should be structural and driven by the shared workspace tree, not by workspace-type-specific chrome conditions or by local frame guesses about root status. The likely first-pass structural read is whether `viewportLayoutNodesById[viewportSlotRootNodeId]` is a split node, computed once in `WorkspaceViewportTree` and passed down as frame intent rather than rediscovered inside `ViewportFrame`.
3. The direct button should call the same close action the current titlebar menu already uses.
4. The unsplit root workspace should not show the new split-only close affordance in this first pass, and the primary `modelViewer -> homePage` close special case should remain menu-only unless a later phase explicitly broadens that behavior.
5. The cleanest likely shape is one explicit frame prop, likely `showInlineCloseButton`, with `ViewportFrame` rendering the button only when that prop is true and `onClose` exists, and with `WorkspaceViewportTree` owning when that prop becomes true.
6. The new close control should be treated as the third standard shell-control affordance alongside the existing `-` viewport-type button and pop-out arrow.
7. First-pass visibility should require split mode, an existing non-root close action, and shared close eligibility, likely `getWorkspaceSurfaceActionEligibility({ surfaceKind: slot.surfaceKind, hostMode: 'slotted', isPrimary: isPrimarySlot }).canClose`.

#### First Code Cut

This first pass should:
- add one visible top-right `x` button to the shared pane frame for eligible split panes, using a frame prop such as `showInlineCloseButton`
- keep the button wired to the existing `onClose` action path
- keep the new button in `ViewportFrame` rather than adding surface-local close controls
- show the new control only when the pane is part of a split workspace state and close eligibility says the pane can close
- add the shared close-eligibility read in `WorkspaceViewportTree`, where slot primary status and split structure are already known
- style the button with the existing compact frame-control treatment so it reads beside the viewport-type `-` button and pop-out arrow
- keep the current menu-based `Close` route intact
- avoid widening into the primary-root close branch that currently routes `modelViewer` back to `homePage`
- add focused proof that clicking the button calls the existing close owner for the targeted slot and that the store-level close path removes that pane while sibling expansion remains owned by the existing workspace tree

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` as a read-only dependency unless shared close eligibility itself proves wrong
- `src/app/workspace/useWorkspaceStore.test.ts` for narrow store-level removal or sibling-promotion proof if existing coverage needs a clearer assertion
- `src/app/hosts/useAppShellViewportActions.ts` as a read-only owner-reference unless the existing close callback wiring needs a tiny handoff repair
- `src/app/AppShell.test.tsx` only if Manager wants one integrated click-through proof beyond the narrower frame/tree/store checks

#### No-Widening Rule

- Do not invent a second close or merge mutation path.
- Do not widen into popup-shell parity unless the shared close-button seam is already tiny and identical.
- Do not redesign the whole titlebar just to land the close affordance.
- Do not hide protected-pane or root-unsplit exceptions inside unexplained button conditions.
- Do not use the primary `modelViewer -> homePage` menu-special behavior as justification for showing a root inline `x` in Phase 1.
- Do not move or redesign the Model Viewer A/D/F control in Phase 1 beyond avoiding overlap with the new close button.
- Do not move the completed Phase 4 viewport-type helper or revise viewport-type menu labels/order in this phase.
- Do not convert the pop-out arrow path into a new action-menu architecture while adding the inline close button.

#### Implementation Risks

- If the close button visibility is inferred from local frame state instead of the workspace split structure, unsplit panes can gain a misleading affordance.
- If the button bypasses the existing close action path, direct close and menu close can drift into two removal behaviors.
- If the first pass accidentally reuses the primary-slot close special case, the root model viewport can gain a misleading inline `x` that behaves differently from every real split pane.
- If the new button competes with the header supplement or existing pop-out button, Model Viewer A/D/F controls can overlap or lose their intended ordering.
- If close proof only checks one pane type, later Browser, Console, or secondary viewer panes can regress silently even though the shared shell is supposed to own the control.

#### Checklist

- [x] Add the top-right close button to the shared split-pane shell.
- [x] Keep the unsplit root workspace free of the split-only button.
- [x] Reuse the existing `onClose` path.
- [x] Gate the inline button from `WorkspaceViewportTree` using split structure plus shared close eligibility.
- [x] Keep the button visually aligned with the existing `-` and pop-out frame controls.
- [x] Keep the menu-based `Close` action intact.
- [x] Add focused proof that the clicked split pane closes correctly.
- [x] Run the focused test files touched by the phase.
- [x] Run `npm run build`.
- [x] Add the required permanent implementation entry to `docs/CHANGELOG.md` when runtime behavior ships.
- [x] Update `docs/Doc-Log.md` if the phase doc or other docs change during implementation.

#### Verification Shape

- `ViewportFrame.test.tsx`: focused frame proof that the inline close button renders only when the explicit show prop is true and calls `onClose`
- `ViewportFrame.test.tsx`: focused no-regression proof that the right-click menu `Close` route still works
- `WorkspaceViewportTree.test.tsx`: focused split-tree proof that a close-eligible secondary split pane receives the inline close affordance and clicking it reports that slot id through `onCloseViewportSlot`
- `WorkspaceViewportTree.test.tsx`: focused root no-regression proof that the unsplit primary viewport does not expose the split-only inline close path
- `useWorkspaceStore.test.ts`: focused store-owner proof, if needed, that `removeViewportSlot(...)` removes the targeted split pane and promotes the sibling through the existing tree behavior
- `AppShell.test.tsx`: optional integration proof only if the narrower frame/tree/store checks do not satisfy Manager that the visible button reaches the live close owner
- `npm run build`: required implementation build gate

#### Done Shape

- eligible split workspace panes show one anchored top-right `x` close control
- the new `x` is part of the shared `ViewportFrame` shell-control strip with the existing `-` viewport-type button and pop-out arrow
- the unsplit root workspace does not show that split-only affordance
- direct close still routes through the shared workspace close owner path
- focused tests and `npm run build` pass, or any failure is clearly reported as an implementation blocker
- `docs/CHANGELOG.md` has the implementation entry when code ships, and `docs/Doc-Log.md` records any doc updates
- `Workspace 10` is ready for a later small follow-through only if protected-pane or popup-shell edge cases remain

## [x] `Workspace-10 / Phase 2` - `Shared Shell Control Strip Ordering`

### Phase 2 Summary

Audit and standardize the shared pane-shell control strip after the split-pane close button lands.

This phase should prove:
- eligible workspace panes receive the `-` viewport-type button, `x` close button, and pop-out arrow through the shared `ViewportFrame`
- Model Viewer panes keep the shared `-` viewport-type button before the A/D/F result-mode control
- individual workspace surfaces are not hand-coding their own copies of those shell controls
- viewport-type and pop-out behavior stay on the already-shared owner paths

### Phase 2 Implementation Spec

#### Purpose

Make the main workspace shell read as one standard control language instead of a collection of surface-specific titlebar decisions.

#### Owns

- the shared-shell control-strip audit for `-`, `x`, and pop-out arrow placement
- proof that the controls are shell-owned rather than surface-owned
- Model Viewer header ordering for shared viewport-type control before A/D/F presentation control
- cleanup or explicit deferral of any surface-local duplicates that are cheap to name and remove

#### Does Not Own

- popup-shell parity
- new viewport surface kinds
- new pop-out semantics
- redesigning the full titlebar layout beyond the shared control strip
- protected-pane policy changes beyond preserving the current post-Phase-1 eligibility reads
- floating or popup host chrome such as Browser, Console, or Spaghetti detached-window titlebars

#### Current Live Read

- `src/app/workspace/ViewportFrame.tsx` is already the shared owner for the main pane titlebar composition. It renders `ViewportFrameModeButton` first in `ViewportFrameHeaderStart`, renders the optional start/end `headerSupplement`, then renders the top-right pop-out arrow and the Phase 1 `ViewportFrameInlineCloseButton`.
- `src/app/workspace/ViewportFrame.tsx` now reads viewport-type menu labels and choices through `getWorkspaceViewportTypeChoiceEntries(...)` and `getWorkspaceViewportTypeLabel(...)` from `src/app/workspace/workspaceViewportTypeChoices.ts`, so Phase 2 should preserve that canonical Phase 4 helper instead of reintroducing local label or allowlist logic.
- `src/app/workspace/WorkspaceViewportTree.tsx` now keeps Browser and Model Viewer presentation controls in the `headerStartSupplement` seam so the shared `-` viewport-type button stays first while Browser `- / e / +` and Model Viewer A/D/F controls remain adjacent and secondary.
- `src/app/workspace/WorkspaceViewportTree.tsx` also passes `ViewportOverlayModeTitlebarControls` as a Model Viewer-only `headerSupplement` with `headerSupplementAlignment="start"`. That existing supplement seam is a likely placement option for Model Viewer-only presentation controls, but Phase 2 should preserve overlay controls while adding the shared `-` before A/D/F instead of collapsing unrelated controls together.
- `src/app/workspace/WorkspaceViewportTree.tsx` computes `slotActionEligibility` through `getWorkspaceSurfaceActionEligibility(...)`, gates the Phase 1 inline close button with `isViewportSplit`, `closeViewportSlot`, and `canClose`, and gates pop-out with catalog host-mode support plus current primary/model rules. Phase 2 should audit this wiring and only repair ordering or duplicated placement drift, not redefine protected eligibility.
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` remains the shared action-eligibility source for viewport type, pop-out, and close support. If Phase 2 finds a mismatch between the rendered strip and this helper, the implementation should align the render path to the helper rather than hand-code surface branches in `ViewportFrame`.
- Representative slotted surfaces such as Browser, Console, Catalog, Properties, Settings, Dashboard, Notepad, and Home Page are rendered below `ViewportFrame` through `ViewportSurfaceRegistry` or dedicated viewer host children. Any Browser, Console, or Spaghetti pop-out/detached-window chrome found outside that main slotted frame should be treated as out of Phase 2 unless it is directly duplicating the main `ViewportFrame` `-`, `x`, or pop-out arrow inside a slotted surface body.
- `src/app/panels/BrowserPanel.tsx` and `src/app/console/ConsolePanel.tsx` still own local panel/window chrome for docked, floating, pop-out, or collapsed panel behavior. Phase 2 should not use those host-mode controls as justification to widen into popup parity or detached-window policy.

#### First Pass Decisions

1. Treat `ViewportFrame` header order as the primary contract: shared `-` viewport-type button first, Model Viewer A/D/F/result-mode control next when present, then right-side shared pop-out and inline `x` controls.
2. Keep Model Viewer A/D/F as surface-specific presentation chrome, not a replacement for the shared shell `-` control.
3. Keep `WorkspaceViewportTree` as the place where slot structure, primary-slot status, and action eligibility are converted into `ViewportFrame` props.
4. Keep `workspaceViewportTypeChoices.ts` as the viewport-type menu-choice and label source; do not add another hard-coded menu list in Phase 2.
5. Treat representative surface scans as a no-duplication audit for slotted surface bodies only; popup/floating host chrome belongs to later popup parity or host-specific phases.

#### First Code Cut

This pass should:
- verify the existing `-` viewport-type button still reads from `workspaceViewportTypeChoices.ts`
- repair and verify Model Viewer header ordering so the shared `-` is present before A/D/F/result-mode controls instead of Model Viewer using `primaryButtonLabel` as the A/D/F button
- verify the Phase 1 `x` close button remains shell-owned by `ViewportFrame` and is only shown from the split-gated `WorkspaceViewportTree` prop path
- verify the pop-out arrow remains shell-owned by `ViewportFrame` and still uses the existing `onPopOut` prop path assembled from current pop-out support/eligibility rules
- add or tighten tests around header ordering and no duplicate slotted-surface controls before making any JSX changes
- remove only obvious slotted surface-body duplicates of the shared `-`, `x`, or pop-out arrow if the audit finds them
- document, but do not change, any popup/floating host chrome that looks related but belongs to Phase 5 or another host-specific lane

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/workspace/workspaceViewportTypeChoices.ts` as a read-only dependency unless the helper itself is proven to drift
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` as a read-only dependency unless the rendered strip no longer follows shared eligibility
- representative surface files such as `src/app/panels/BrowserPanel.tsx`, `src/app/console/ConsolePanel.tsx`, `src/app/workspace/CatalogSurface.tsx`, `src/app/workspace/PropertiesSurface.tsx`, `src/app/workspace/SettingsSurface.tsx`, `src/app/workspace/DashboardSurface.tsx`, `src/app/workspace/NotepadSurface.tsx`, and `src/app/workspace/HomePageSurface.tsx` for audit only unless a slotted body duplicate is found

#### No-Widening Rule

- Do not implement popup-shell parity in Phase 2.
- Do not change protected-pane or primary-slot close policy in Phase 2.
- Do not redesign detached Browser, Console, Spaghetti, Dashboard, or Notepad host chrome.
- Do not replace the completed Phase 4 viewport-type choice helper with local `ViewportFrame` or surface-specific lists.
- Do not move A/D/F out of Model Viewer presentation ownership; only preserve its position after the shared `-` control.
- Do not change pop-out behavior semantics; only keep the visible main-pane arrow on the existing shared path.

#### Implementation Risks

- If Model Viewer A/D/F remains packed into `primaryButtonLabel`, the shared `-` viewport-type affordance can be displaced by a surface-specific presentation control.
- If `headerSupplementAlignment="start"` is changed without a DOM-order proof, the Model Viewer presentation controls can drift before the shared shell navigation control.
- If pop-out visibility is checked through catalog support only, it can diverge from the shared action-eligibility contract and primary-slot exceptions.
- If the no-duplication audit treats floating or popup host chrome as in scope, Phase 2 can silently widen into Phase 5.
- If proof only checks a Model Viewer pane, Browser/Console/non-viewer slotted panes can still grow duplicate surface-local shell controls later.

#### Verification Shape

- `ViewportFrame.test.tsx`: focused shell-control proof that the `-`, inline `x`, and pop-out arrow are rendered by `ViewportFrame`, with the `-` coming from the shared viewport-type helper path.
- `ViewportFrame.test.tsx` or `WorkspaceViewportTree.test.tsx`: focused Model Viewer header proof that the shared `-` appears before the A/D/F/result-mode control in DOM order.
- `WorkspaceViewportTree.test.tsx`: focused split-gating proof that the inline `x` reaches `ViewportFrame` only for eligible split panes and remains absent from the unsplit root.
- `WorkspaceViewportTree.test.tsx`: focused pop-out proof that eligible slotted panes receive the shared pop-out arrow through `ViewportFrame` and ineligible panes, such as catalog while pop-out is deferred, do not.
- representative no-duplication proof or source audit for Browser, Model Viewer, Console, and one non-viewer panel surface showing they do not render their own slotted `-`, inline `x`, or shared pop-out arrow inside the pane body.
- `npm run build`: required implementation build gate.

#### Checklist

- [x] Prove the shared `-` viewport-type control is still owned by `ViewportFrame` and fed by `workspaceViewportTypeChoices.ts`.
- [x] Prove Model Viewer header order is shared `-` before A/D/F/result-mode controls.
- [x] Prove the inline `x` remains `ViewportFrame` chrome gated by `WorkspaceViewportTree` split structure and shared close eligibility.
- [x] Prove the pop-out arrow remains `ViewportFrame` chrome on the existing pop-out action path.
- [x] Audit representative slotted surfaces for duplicated `-`, inline `x`, or shared pop-out arrow controls.
- [x] Keep popup parity and protected-pane policy out of Phase 2.
- [x] Run focused tests for the files touched by implementation.
- [x] Run `npm run build`.
- [x] Add the required permanent implementation entry to `docs/CHANGELOG.md` when runtime behavior ships.
- [x] Update `docs/Doc-Log.md` if the phase doc or other docs change during implementation.

#### Done Shape

- `Workspace-10 / Phase 2` has a tested main-workspace control-strip contract: shared `-` first, Model Viewer A/D/F next when present, and right-side pop-out plus split-only `x` from the shared frame.
- No individual slotted workspace surface owns a duplicate copy of the shared `-`, inline `x`, or main-pane pop-out arrow.
- Viewport-type choices still come from the Phase 4 helper and pop-out/close visibility still follow shared owner paths.
- Popup parity, detached host chrome, and protected-pane policy remain explicitly deferred to their own phases.
- Focused verification and `npm run build` pass, or any failure is reported as an implementation blocker.

#### Implementation Result

- Browser and Model Viewer presentation controls now render as `ViewportFrameHeaderControlButton` supplements after the shared viewport-type `-` button.
- Pop-out visibility now uses the shared `slotActionEligibility.canPopout` read while preserving existing primary Model Viewer and non-primary pop-out behavior.
- Phase 2 stayed inside the main slotted `ViewportFrame` shell and left popup parity, detached host chrome, and protected-pane policy to later phases.

## [x] `Workspace-10 / Phase 3` - `Protected-Pane Eligibility And Close Continuity`

### Phase 3 Summary

Tighten close-button eligibility and continuity if the first shared button pass exposes protected-pane drift.

This phase should prove:
- protected or special panes still read honestly
- close eligibility stays shared
- direct button close and existing workspace continuity stay aligned

### Phase 3 Implementation Spec

#### Purpose

Clean up the close-eligibility edge cases exposed by the first direct split-pane button so every visible close affordance reads from the same protected-pane policy.

#### Owns

- protected-pane and close-eligibility tightening
- continuity proof around selection or focus after pane close
- shell-level rule clarification when one pane should not show the same control as its siblings
- retiring or narrowing any local close exception that can disagree with `workspaceSurfaceActionEligibility`
- proving the shared inline `x` and existing menu `Close` route use the same close eligibility

#### Does Not Own

- popup parity unless it is tiny and shared
- new split-tree semantics
- broader shell restyling
- changing pop-out eligibility or detached host chrome
- changing viewport-type menu choices or Model Viewer A/D/F ordering

#### Current Live Read

- `src/app/workspace/workspaceSurfaceActionEligibility.ts` already names primary-slot protection for close actions through `close.blockedReason === 'primary-slot-protected'` and exposes `canClose` as the shared policy bit.
- `src/app/workspace/WorkspaceViewportTree.tsx` now computes `slotActionEligibility` for slotted panes, but it still builds `closeViewportSlot` with a local exception: primary non-Model panes have no close callback, while primary Model Viewer still gets one. The inline `x` is then gated by both `closeViewportSlot !== undefined` and `slotActionEligibility.canClose`, which keeps the visible button protected but leaves menu-close callback policy split between two owners.
- `src/app/workspace/ViewportFrame.tsx` owns both the direct inline `x` and the existing titlebar menu `Close` route through `onClose`, so Phase 3 should make sure any `onClose` callback passed into the frame is already eligibility-honest.
- `src/app/workspace/WorkspaceViewportTree.test.tsx` already proves secondary split panes show the inline close button, primary panes do not, and the clicked pane id is sent to `onCloseViewportSlot`.
- `src/app/workspace/workspaceSurfaceActionEligibility.test.ts` already proves primary Model Viewer `close` is blocked with `primary-slot-protected`, non-primary Model Viewer can close, and catalog-backed non-primary surfaces can close.
- The likely drift to fix is not the button itself; it is the leftover callback construction around `onClose` and the titlebar menu route.

#### First Code Cut

This pass should:
- make `WorkspaceViewportTree` derive `closeViewportSlot` from `slotActionEligibility.canClose` instead of local primary/surface branching
- preserve primary-slot protection for all primary panes, including the primary Model Viewer, unless a narrower architecture doc explicitly creates a new exception
- keep non-primary split panes closeable through the same `onCloseViewportSlot(slot.slotId)` path
- ensure the inline split-pane `x` and the existing `ViewportFrame` menu `Close` route disappear together when `canClose` is false
- add focused proof that primary Model Viewer does not receive a menu-close route even though it may still receive the existing primary Model Viewer pop-out route
- add focused proof that a non-primary Model Viewer and at least one non-primary non-model pane still receive the close route and close the clicked slot
- keep close continuity on the existing slot-removal owner; do not create a new post-close selection or focus system unless the current behavior is demonstrably broken

#### Verification Shape

- `npm.cmd test -- --run src/app/workspace/workspaceSurfaceActionEligibility.test.ts src/app/workspace/WorkspaceViewportTree.test.tsx`
- if AppShell wiring changes, add or run the narrow AppShell close-control tests that cover primary protection and secondary close continuity
- `npm.cmd run build`

#### No-Widening Rule

- Do not implement popup parity in Phase 3.
- Do not change the completed Phase 2 shared control-strip order.
- Do not change the completed Phase 4 viewport-type choice helper.
- Do not alter split-tree removal semantics beyond routing existing close affordances through shared eligibility.
- Do not redesign `ViewportFrame` titlebar visuals unless a tiny CSS adjustment is required by the close eligibility change.

#### Done Shape

- Close eligibility has one runtime truth for slotted panes: `workspaceSurfaceActionEligibility.canClose`.
- Primary panes do not receive hidden menu-close callbacks that contradict their missing inline `x`.
- Secondary split panes still show and execute the direct inline `x` close affordance through the existing close owner.
- Existing titlebar menu close behavior and direct-button close behavior agree for protected and eligible panes.
- Focused eligibility/tree tests and build verification pass, or any failure is recorded as the blocker for implementation.

#### Implementation Result

- `WorkspaceViewportTree` now derives the `ViewportFrame` close callback from `slotActionEligibility.canClose` instead of a local primary/surface exception.
- Primary panes, including the primary Model Viewer, no longer receive an enabled titlebar menu `Close` route when shared close eligibility blocks them.
- Secondary split panes, including secondary Model Viewer panes, still receive the direct inline `x` and titlebar menu `Close` route through the clicked slot id.
- Focused action-eligibility and viewport-tree tests passed before build verification.

## [x] `Workspace-10 / Phase 4` - `Canonical Viewport Type Menu Reads`

### Phase 4 Summary

Replace the remaining hard-coded viewport-type picker lists with one shared catalog-driven read so the runtime menu and later workspace-mode surfaces stay aligned when new workspace surfaces land.

This phase should prove:
- one canonical helper owns viewport-type menu choices
- the right-click runtime picker stops maintaining its own local allowlist
- future catalog additions can appear through shared menu truth instead of repeated menu surgery

### Phase 4 Implementation Spec

#### Purpose

Clean up the shared viewport-type menu path so surface registration in the canonical workspace catalog is what drives menu availability, ordering, and labels.

#### Owns

- one shared helper for viewport-type menu choices
- deriving runtime picker entries from canonical workspace-surface catalog truth plus shared eligibility reads
- keeping runtime picker and workspace-mode menu surfaces aligned to the same surface-choice model
- proof that catalog expansion reaches the menu without local allowlist edits

#### Does Not Own

- the close-button work from `Phase 1` through `Phase 3`
- new workspace-surface kinds
- a raw unfiltered dump of every catalog entry into every host
- broader titlebar redesign outside the menu-read seam

#### Current Live Read

- `src/app/workspace/workspaceSurfaceCatalog.ts` is already the canonical owner for surface kinds, default labels, host-mode support, and optional-surface registration. It already preserves the intended surface order through `workspaceSurfaceCatalogEntries`, so the new helper should probably start from that order instead of inventing a second rank table.
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` already models shared action support and should remain the truth source for whether viewport-type actions are available for the current target surface/host state.
- `src/app/workspace/ViewportFrame.tsx` still carries a local fallback list for the right-click `Viewport Type` picker and its own `surfaceKindLabels` map, which means both availability and display labels can drift from catalog truth.
- `src/app/console/stagedNavigation.ts` already builds viewport-type choices from `getWorkspaceSurfaceCatalogEntries()`, trims non-model labels by removing `Viewport`, and owns the alias table for compact console tokens. That means Console is closer to the desired source of truth than `ViewportFrame`, but it still has its own derived-choice logic instead of sharing one helper.
- `src/app/workspace/workspaceViewportLabels.ts` already consumes `getWorkspaceSurfaceDefaultLabel(...)`, which is another sign that default workspace-surface naming is supposed to come from the catalog rather than per-consumer label maps.
- `src/app/workspace/workspaceSurfaceCatalog.test.ts`, `src/app/workspace/workspaceSurfaceActionEligibility.test.ts`, `src/app/workspace/ViewportFrame.test.tsx`, and `src/app/console/stagedNavigation.workspaceModes.test.ts` are the likely proof surfaces. A small new helper test file may also be justified if the derived-choice seam becomes its own module.

#### First Pass Decisions

1. The target is a shared derived menu helper, not direct raw catalog iteration inside `ViewportFrame`.
2. The helper should preserve the existing shipped picker order by reading `workspaceSurfaceCatalogEntries` order unless a later explicit rank rule replaces it.
3. The helper should own display-label shaping for viewport-type menus so `ViewportFrame` can retire its local `surfaceKindLabels` map for this menu path and Console can stop re-deriving the same trimmed labels independently.
4. The helper should filter through shared eligibility and host-mode support rather than dumping every slotted surface into every host.
5. `ViewportFrame` should consume that helper instead of maintaining its own fallback list.
6. Later workspace-mode menu surfaces should point to the same helper or the same underlying derived-choice seam so one new surface registration does not require repeated menu edits.

#### First Code Cut

This pass should:
- extract one shared helper for viewport-type menu choices from canonical surface metadata plus shared eligibility data
- shape that helper around the real target context, likely something close to current surface kind, host mode, and primary-slot status, so it can answer both runtime picker and workspace-mode menu needs honestly
- replace the local `ViewportFrame.tsx` fallback list with that helper
- keep current ordering, labels, aliases, and primary-slot restrictions intact unless an explicit shared rule changes them
- retarget `stagedNavigation.ts` to the same derived-choice seam or the same underlying helper output instead of maintaining a nearby parallel builder
- add focused expansion-proof coverage so a catalog-supported surface shows up in the runtime picker and console menu through the shared helper path

#### Likely Files

- `src/app/workspace/workspaceSurfaceCatalog.ts`
- `src/app/workspace/workspaceSurfaceActionEligibility.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.workspaceModes.test.ts`
- `src/app/workspace/workspaceSurfaceCatalog.test.ts`
- `src/app/workspace/workspaceSurfaceActionEligibility.test.ts`
- one new shared helper module under `src/app/workspace/` if the derived menu-choice seam should not live inside either `ViewportFrame` or `stagedNavigation`

#### No-Widening Rule

- Do not widen this phase into adding new workspace surfaces.
- Do not let `ViewportFrame` read the raw catalog directly if a shared derived helper can preserve ordering and eligibility more honestly.
- Do not fork separate menu-truth helpers for runtime picker and workspace-mode navigation.
- Do not silently change console aliases or visible surface labels unless the shared helper proves the current vocabulary is wrong.
- Do not mix this menu-read cleanup with popup-shell parity or close-button visual polish.

#### Implementation Risks

- If the helper only mirrors raw catalog order without explicit filtering, protected or unsupported surfaces can leak into the picker.
- If the helper only solves `ViewportFrame` while leaving Console on a parallel builder, the repo will keep regressing whenever a new workspace surface lands.
- If label shaping is not centralized with the helper, `Model Viewport` versus trimmed labels like `Browser`, `Catalog`, and `Properties` can still drift between runtime and console paths even after the hard-coded allowlist is gone.
- If proof only checks current surfaces and not expansion behavior, the repo can drift back to silent menu omissions later.

#### Checklist

- [x] Extract one shared viewport-type choice helper from canonical surface metadata plus shared eligibility reads.
- [x] Move viewport-type display-label shaping into the shared helper or an immediately adjacent shared seam.
- [x] Replace the `ViewportFrame` local fallback list with the shared helper.
- [x] Keep ordering, labels, aliases, and primary-slot restrictions intact.
- [x] Add expansion-proof tests for newly registered workspace surfaces.
- [x] Keep workspace-mode menu truth aligned to the same derived-choice seam.

#### Verification Shape

- focused helper proof for shared viewport-type menu choices
- focused runtime picker proof that `ViewportFrame` consumes the canonical derived list
- focused expansion-proof coverage showing a catalog-supported surface reaches the menu without local allowlist edits
- focused workspace-mode proof that staged navigation stays aligned to the same shared surface-choice truth
- focused label-shape proof that runtime and console menu paths still present the intended visible surface names

#### Done Shape

- viewport-type menu choices come from one shared canonical derived read
- `ViewportFrame` no longer carries a local hard-coded fallback surface list
- runtime picker and workspace-mode navigation stay aligned when new workspace surfaces land
- `Workspace 10` now carries the explicit shared menu-read cleanup follow-through instead of leaving that architectural gap only in chat

## [x] `Workspace-10 / Phase 5` - `Popup Parity Decision And Final Shell Closeout`

### Phase 5 Summary

Close the family honestly by proving the popup-local workspace shell already reuses the shared `ViewportFrame` control language where it truly does, then explicitly deferring broader detached floating/popout host convergence unless the implementation is tiny and identical.

This phase should prove:
- popup-local split panes either reuse the same shared shell controls or have a documented gap
- the shared main-workspace shell-control contract is complete
- detached floating/popout host chrome is either tiny enough to reuse safely or named as later explicit cleanup
- the visible control language is stable across the shared shell

### Phase 5 Implementation Spec

#### Purpose

Finish the shared workspace shell-control family without pretending popup, floating, and popout host reuse are all the same problem.

#### Owns

- popup-local `ViewportFrame` parity decision for the shared control strip
- final shell-control proof and wording cleanup
- cleanup or explicit deferral of detached-host duplicated shell-control behavior
- honest family closeout

#### Does Not Own

- popup convergence beyond what is already tiny and shared
- a broader popup workspace rewrite
- later non-shell-control polish unrelated to the standard control-strip contract
- changing close behavior for the unsplit root workspace
- redesigning floating or popout host titlebars across Model Viewer, Dashboard, Notepad, Catalog, Browser, Console, or Spaghetti
- changing quick-dock, browser dock, console dock, or detached-surface lifecycle semantics

#### Current Live Read

- `src/app/workspace/PopupWorkspaceShell.tsx` already renders popup-local panes through `ViewportFrame`, passes popup-local split actions, passes `onRequestSurfaceKind`, and protects the popup root close path through a root-slot exception.
- `PopupWorkspaceShell` does not currently pass `showInlineCloseButton`, so popup-local split panes may have menu-close parity without the direct inline `x` parity shipped for the main slotted workspace in Phase 1.
- `PopupWorkspaceShell` uses its own popup-local store and `removeViewportSlot(...)` equivalent, so any direct popup-local `x` must call the existing popup close owner instead of touching main workspace slot state.
- `PopupWorkspaceShell` only exposes `modelViewer`, `spaghettiEditor`, `console`, and `browser` as popup-local surface kinds, so proof should stay on that known popup-local subset.
- Detached floating and popout hosts are broader and not one shape:
  - `src/app/AppShell.tsx` owns detached Model Viewer floating and popout chrome.
  - `src/app/hosts/DashboardWindowHost.tsx` owns Dashboard floating and popout chrome.
  - `src/app/hosts/NotepadWindowHost.tsx` owns Notepad floating and popout chrome.
  - `src/app/hosts/SimpleFloatingSurfaceHost.tsx` owns Catalog floating chrome.
  - Browser, Console, and Spaghetti still have their own host-specific detached/dock shell paths.
- `src/app/components/FloatingWindowQuickDockButton.tsx` is a small shared detached-host button, but it is quick-dock chrome, not the same shared pane shell as `ViewportFrame`.
- `Workspace-11` now owns future shell-adoption planning, so Phase 5 should close Workspace-10 by documenting what is done and what moves forward, not start a new generic detached host architecture.

#### First Code Cut

This pass should:
- add focused proof around `PopupWorkspaceShell` showing popup-local panes still use `ViewportFrame` for viewport-type and split/menu close behavior
- if tiny, pass `showInlineCloseButton` to popup-local split panes so popup-local eligible split panes receive the same direct `x` affordance from `ViewportFrame`
- keep the popup root pane protected from direct close, matching the existing `onClose` root exception
- keep popup close behavior on `PopupWorkspaceShell`'s local `removeViewportSlot` owner and owned-editor cleanup path
- audit detached floating/popout hosts for shared-control duplication, then record explicit deferral for broad host-titlebar convergence unless a one-line reuse is truly identical
- update the Workspace-10 done shape to point future detached host standardization at Workspace-11 or a new follow-on phase instead of expanding Phase 5

#### Verification Shape

- focused `PopupWorkspaceShell` proof for shared `ViewportFrame` viewport-type and close/menu parity
- focused popup-local split-pane proof if direct inline `x` is adopted there
- focused root-protection proof showing the popup root close route remains blocked
- focused audit or test note for detached floating/popout host deferral
- `npm.cmd test -- --run` on the touched popup/workspace shell test files
- `npm.cmd run build`

#### No-Widening Rule

- Do not redesign detached floating or popout titlebars in Phase 5.
- Do not move Browser, Console, Spaghetti, Dashboard, Notepad, Catalog, or Model Viewer detached host lifecycle into `ViewportFrame`.
- Do not change quick-dock semantics or detached restore behavior.
- Do not change the completed main-workspace Phase 1 through Phase 4 behavior except for final proof or documentation.
- Do not create a new shared detached-host shell unless the implementation is tiny, mechanical, and already proven by existing host structure.

#### Done Shape

- `Workspace-10` closes with the main slotted shell contract complete: shared `-`, presentation controls after `-`, pop-out eligibility, split-only `x`, and shared close eligibility are all recorded.
- Popup-local workspace behavior is either aligned through the existing `PopupWorkspaceShell` `ViewportFrame` path or explicitly documented as a follow-on if direct `x` parity is not tiny.
- Detached floating/popout host convergence is explicitly deferred to Workspace-11 or a later dedicated host-shell phase unless this phase lands a tiny identical reuse.
- Required changelog and doc-log entries are added when implementation ships.

#### Implementation Result

- `PopupWorkspaceShell` now passes `showInlineCloseButton` to `ViewportFrame` for popup-local secondary split panes while keeping the popup root pane protected.
- Popup-local direct `x` close uses the existing popup-local `handleCloseSlot(...)` path, including owned-editor cleanup and collapse-to-root behavior.
- Focused popup-shell tests prove the popup root menu close route stays disabled, secondary popup split panes show the shared inline `x`, and clicking it collapses back to the protected root.
- Detached floating/popout host titlebar convergence remains explicitly deferred to `Workspace-11` or a later dedicated host-shell phase because those hosts still have separate lifecycle and quick-dock chrome.

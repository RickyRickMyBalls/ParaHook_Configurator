# Workspace Phase Workspace-10 - Split Workspace Top-Right Close Controls

## Doc Header

### Doc History
5. 2026-05-10 12:44:58: Implemented `Workspace-10 / Phase 4 - Canonical Viewport Type Menu Reads` by landing one shared viewport-type choice helper for the runtime picker and Console staged-navigation path, retiring the `ViewportFrame` fallback list plus duplicate label shaping, and adding focused expansion-proof plus build verification.
4. 2026-05-10 12:42:54: Prepped `Workspace-10 / Phase 4 - Canonical Viewport Type Menu Reads` for implementation by grounding the shared menu-choice cleanup against the live `workspaceSurfaceCatalog.ts`, `workspaceSurfaceActionEligibility.ts`, `ViewportFrame.tsx`, and `stagedNavigation.ts` seams, while making the existing duplicate label/order logic and the intended one-helper convergence target explicit.
3. 2026-05-10 12:36:58: Prepped `Workspace-10 / Phase 1 - Anchored Split-Pane Close Button` for implementation by grounding the first close-button cut against the live `ViewportFrame` titlebar shell, `WorkspaceViewportTree` split-slot routing seam, and `useAppShellViewportActions.ts` close-owner behavior, while making the primary-slot `modelViewer -> homePage` exception and the likely proof targets explicit.
2. 2026-05-10 12:31:42: Added `Workspace-10 / Phase 4 - Canonical Viewport Type Menu Reads` so the same shared shell-cleanup family now captures the follow-on work to replace hard-coded viewport-type menu lists with one canonical catalog-driven read path shared by the runtime picker and later workspace-mode menu surfaces.
1. 2026-05-10 12:17:27: Added this new open `Workspace-10` family phase doc so split-workspace close-button cleanup now has one explicit planning home, with the first cleanup slice narrowly aimed at anchoring an `x` close control at the top-right of every split workspace pane through the existing shared close-owner path.

### Purpose

Use this phase to make pane closing more direct and legible inside split workspaces by adding a shared top-right `x` close control to the pane shell itself.

The goal is to let the user close a split pane from the pane frame without depending only on titlebar menus, while keeping pane removal on the already-settled shared owner path.

### Scope

This phase covers:
- top-right close affordances on split workspace panes
- shell-level button placement and visibility rules for split mode
- reuse of the existing shared close owner path
- proof that the close control removes the correct split pane

This phase does not cover:
- a new split-removal or merge ownership model
- unsplit root-workspace close behavior
- popup workspace parity unless the first shared-shell pass stays tiny
- broader titlebar redesign outside the close-control seam

## Doc Body

### Summary

`Workspace 10` is the split-workspace close-control cleanup phase.

It should deliver:
- one visible top-right `x` affordance on every split workspace pane
- one shared shell rule for when that button appears
- one reuse of the existing close action path instead of a second pane-removal model
- one focused proof surface that the clicked pane is the pane that closes

### Locked Direction

`Workspace 10` should be:
- a shared split-pane shell cleanup
- a discoverability improvement for existing pane close behavior
- a reuse of the already-landed `removeViewportSlot(...)` owner path
- one phase that can be edited forward in small follow-on slices if edge cases appear

`Workspace 10` should not be:
- a fresh close or merge architecture
- a root-unsplit workspace removal pass
- a workspace-type-specific button that only some panes receive
- a silent retirement of the existing titlebar menu close action

### Locked Interaction Model

- The close affordance should be anchored at the top-right of the visible split pane shell.
- The affordance should only appear when the workspace is actually in split mode.
- Clicking the `x` should close that pane through the existing shared close owner path.
- The button should not bypass the current slot-removal truth or invent a local pane-state shortcut.
- The existing menu-based `Close` action should remain available as a secondary route.

### Suggested First-Pass Guardrails

- Reuse the existing `ViewportFrame.tsx` titlebar shell instead of creating one workspace-type-specific overlay.
- Keep the split-mode visibility rule structural so unsplit root panes do not get a misleading close button.
- Keep close eligibility aligned with the already-supported `canClose` read instead of hard-coding special-case pane types into the new button.
- Prove that the clicked split pane closes while its sibling expands through the existing workspace-tree behavior.

### Acceptance Read

This phase counts as honest when:
- split workspaces show a visible top-right `x` close control on each eligible pane
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
- `WorkspaceViewportTree.tsx` already passes `onClose` into split panes and already decides when a slot should use the real shared close path
- `workspaceSurfaceActionEligibility.ts` already computes `canClose`
- `useWorkspaceStore.ts` already owns `removeViewportSlot(...)`
- `AppShell.tsx` and the existing workspace menus already expose close behavior, so the first pass can stay about shell discoverability rather than new removal semantics

## Vision

This phase belongs to the later workspace shell cleanup ladder after split truth and split-corner authoring already exist.

The user-facing promise is:
- if the workspace is split, each pane should expose an obvious close affordance at the pane shell
- closing a pane should feel like a direct workspace action, not something hidden behind a menu
- the workspace shell should stay shared across pane types instead of drifting back into Browser-only or viewer-only chrome rules

Important direction that must stay true:
- shared workspace ownership stays in the existing slot tree
- close affordance is shell-level presentation of an existing action, not a second removal system
- the first pass should stay small enough that later edge cases can become explicit follow-on phases instead of getting buried inside one big cleanup bucket

## Wishlist Organization

### High Level Goals
- [ ] `Workspace-10-HLG-1. Add a visible top-right close button to split workspace panes so pane removal is directly discoverable from the pane shell.`
- [ ] `Workspace-10-HLG-2. Keep the close button shared across workspace pane types instead of turning it into one-off Browser or Model Viewport chrome.`
- [ ] `Workspace-10-HLG-3. Keep pane removal on the existing shared close-owner path instead of inventing a second split-removal model.`
- [ ] `Workspace-10-HLG-4. Keep the first cleanup pass narrow enough that protected-pane rules and later shell polish can stay explicit follow-on work if needed.`

### Codex Level Goals
- [ ] CLG 1. Add one shared shell-level close affordance to split panes through the existing `ViewportFrame` and `WorkspaceViewportTree` path.
- [ ] CLG 2. Gate the new close button to real split-mode panes instead of widening it to the unsplit root workspace.
- [ ] CLG 3. Keep `removeViewportSlot(...)` as the removal owner.
- [ ] CLG 4. Add focused proof that the clicked pane is the pane that closes.
- [ ] CLG 5. Leave popup parity and any protected-pane exceptions as explicit later follow-through unless they are already tiny and shared.

### `Workspace-10 / Phase 1`

- [ ] Add one anchored top-right `x` button to eligible split workspace panes.
- [ ] Reuse the existing shared close action path.
- [ ] Keep the unsplit root workspace free of the split-only close affordance.
- [ ] Add focused proof that the clicked split pane closes correctly.
- [ ] `Workspace-10-HLG-1`
- [ ] `Workspace-10-HLG-2`
- [ ] `Workspace-10-HLG-3`
- [ ] CLG 1.
- [ ] CLG 2.
- [ ] CLG 3.
- [ ] CLG 4.

### `Workspace-10 / Phase 2`

- [ ] Tighten protected-pane and close-eligibility rules if the first shared button pass exposes drift.
- [ ] Keep primary or special panes honest without hiding those rules inside button-only branching.
- [ ] Recheck the shared close affordance against existing menu actions and workspace-selection continuity.
- [ ] `Workspace-10-HLG-2`
- [ ] `Workspace-10-HLG-3`
- [ ] `Workspace-10-HLG-4`
- [ ] CLG 2.
- [ ] CLG 3.
- [ ] CLG 4.

### `Workspace-10 / Phase 3`

- [ ] Decide whether popup-shell parity is tiny enough to reuse the same close affordance or should stay explicitly deferred.
- [ ] Tighten final shell polish and proof around the shared close control if later workspace surfaces expose visual drift.
- [ ] Close the family honestly around the shared split-workspace close-control contract.
- [ ] `Workspace-10-HLG-2`
- [ ] `Workspace-10-HLG-4`
- [ ] CLG 4.
- [ ] CLG 5.

### `Workspace-10 / Phase 4`

- [x] Replace the hard-coded viewport-type picker list with one shared read derived from the canonical workspace surface catalog plus shared eligibility rules.
- [x] Keep `ViewportFrame` and later workspace-mode menu surfaces aligned to the same surface-choice truth instead of maintaining separate allowlists.
- [x] Preserve ordering, labels, primary-slot restrictions, and host-mode support through one shared helper rather than a raw catalog dump.
- [x] Add expansion-proof tests so newly registered workspace surfaces appear in the viewport-type menu without hand-editing multiple menu owners.
- [x] `Workspace-10-HLG-2`
- [x] `Workspace-10-HLG-4`
- [x] CLG 2.
- [x] CLG 4.
- [x] CLG 5.

## [ ] `Workspace-10 / Phase 1` - `Anchored Split-Pane Close Button`

### Phase 1 Summary

Add the first visible top-right `x` close control to every eligible split workspace pane.

This phase should prove:
- the shared pane frame can host a direct close button
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
- `src/app/workspace/WorkspaceViewportTree.tsx` already passes `onClose` down for panes that should close through the shared slot-tree path and is the likely structural owner for whether a pane is operating in split mode. It currently sets `onClose` to `undefined` for primary non-model surfaces and routes every other slot to `onCloseViewportSlot(slot.slotId)`, which is the exact seam the new button should continue to use.
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` already computes `canClose`, which should stay the truth source instead of new hard-coded button eligibility rules.
- `src/app/hosts/useAppShellViewportActions.ts` already owns `handleCloseViewportSlotFromMenu(...)`, which makes the real root-versus-non-root split explicit: non-primary slots call `removeViewportSlot(slotId)`, while the primary `modelViewer` special case swaps back to `homePage` instead of removing the root slot. This makes it clear that `Phase 1` must stay split-slot-only and must not widen into root close semantics.
- `src/app/workspace/useWorkspaceStore.ts` already owns `removeViewportSlot(...)`, so direct close should remain an affordance upgrade, not a mutation-owner rewrite.
- `src/app/AppShell.test.tsx`, `src/app/workspace/ViewportFrame.test.tsx`, and `src/app/workspace/WorkspaceViewportTree.test.tsx` already cover titlebar interactions, slot routing, and close-related behavior, so the first proof widening should stay focused and should not need a new test harness family.

#### First Pass Decisions

1. The button belongs in the existing shared pane frame, anchored at the top-right of the titlebar shell.
2. Split-mode visibility should be structural and driven by the shared workspace tree, not by workspace-type-specific chrome conditions or by local frame guesses about root status.
3. The direct button should call the same close action the current titlebar menu already uses.
4. The unsplit root workspace should not show the new split-only close affordance in this first pass, and the primary `modelViewer -> homePage` close special case should remain menu-only unless a later phase explicitly broadens that behavior.
5. The cleanest likely shape is one explicit frame prop for showing the new inline close control, with `WorkspaceViewportTree` owning when that prop becomes true.

#### First Code Cut

This first pass should:
- add one visible top-right `x` button to the shared pane frame for eligible split panes
- keep the button wired to the existing `onClose` action path
- show the new control only when the pane is part of a split workspace state
- keep the current menu-based `Close` route intact
- avoid widening into the primary-root close branch that currently routes `modelViewer` back to `homePage`
- add focused proof that clicking the button removes the correct split pane and leaves sibling expansion on the existing workspace-tree path

#### Likely Files

- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportFrame.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` only if the visibility rule needs one explicit shared eligibility read

#### No-Widening Rule

- Do not invent a second close or merge mutation path.
- Do not widen into popup-shell parity unless the shared close-button seam is already tiny and identical.
- Do not redesign the whole titlebar just to land the close affordance.
- Do not hide protected-pane or root-unsplit exceptions inside unexplained button conditions.

#### Implementation Risks

- If the close button visibility is inferred from local frame state instead of the workspace split structure, unsplit panes can gain a misleading affordance.
- If the button bypasses the existing close action path, direct close and menu close can drift into two removal behaviors.
- If the first pass accidentally reuses the primary-slot close special case, the root model viewport can gain a misleading inline `x` that behaves differently from every real split pane.
- If close proof only checks one pane type, later Browser, Console, or secondary viewer panes can regress silently even though the shared shell is supposed to own the control.

#### Checklist

- [ ] Add the top-right close button to the shared split-pane shell.
- [ ] Keep the unsplit root workspace free of the split-only button.
- [ ] Reuse the existing `onClose` path.
- [ ] Keep the menu-based `Close` action intact.
- [ ] Add focused proof that the clicked split pane closes correctly.

#### Verification Shape

- focused pane-frame proof that the shared split pane shows the new close affordance
- focused workspace proof that clicking the button closes the targeted split pane
- focused no-regression proof that the menu-based close route still works
- focused root no-regression proof that the unsplit primary viewport still does not expose the split-only inline close path

#### Done Shape

- eligible split workspace panes show one anchored top-right `x` close control
- the unsplit root workspace does not show that split-only affordance
- direct close still routes through the shared workspace close owner path
- `Workspace 10` is ready for a later small follow-through only if protected-pane or popup-shell edge cases remain

## [ ] `Workspace-10 / Phase 2` - `Protected-Pane Eligibility And Close Continuity`

### Phase 2 Summary

Tighten close-button eligibility and continuity if the first shared button pass exposes protected-pane drift.

This phase should prove:
- protected or special panes still read honestly
- close eligibility stays shared
- direct button close and existing workspace continuity stay aligned

### Phase 2 Implementation Spec

#### Purpose

Clean up any close-eligibility edge cases exposed by the first direct split-pane button.

#### Owns

- protected-pane and close-eligibility tightening
- continuity proof around selection or focus after pane close
- shell-level rule clarification when one pane should not show the same control as its siblings

#### Does Not Own

- popup parity unless it is tiny and shared
- new split-tree semantics
- broader shell restyling

#### First Code Cut

This pass should:
- name and tighten any protected-pane rule the first button pass exposes
- keep the close eligibility rule shared instead of per-pane ad hoc
- add focused proof for close continuity after direct-button removal

#### Verification Shape

- focused protected-pane eligibility proof
- focused close-continuity proof after direct-button pane removal

## [ ] `Workspace-10 / Phase 3` - `Popup Parity Decision And Final Shell Closeout`

### Phase 3 Summary

Close the family honestly by deciding whether popup-shell parity is already shared enough to adopt the same close affordance or should remain explicitly deferred.

This phase should prove:
- the shared split-workspace close-control contract is complete for the main workspace shell
- popup parity is either tiny and landed or clearly deferred
- the visible close-control language is stable across the shared shell

### Phase 3 Implementation Spec

#### Purpose

Finish the first split-workspace close-control family without pretending popup-shell reuse is free when it is not.

#### Owns

- popup parity decision for this family
- final close-control shell proof and wording cleanup
- honest family closeout

#### Does Not Own

- popup convergence beyond what is already tiny and shared
- a broader popup workspace rewrite
- later non-close shell polish unrelated to the close-control contract

#### First Code Cut

This pass should:
- decide whether popup-shell close control can reuse the same seam cheaply
- otherwise record explicit deferral and keep the shared-workspace family closeout honest
- finish the last proof and shell-read cleanup needed to close `Workspace 10`

#### Verification Shape

- focused parity or deferral proof for popup-shell behavior
- focused final shell-read proof for the shared close-control contract

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

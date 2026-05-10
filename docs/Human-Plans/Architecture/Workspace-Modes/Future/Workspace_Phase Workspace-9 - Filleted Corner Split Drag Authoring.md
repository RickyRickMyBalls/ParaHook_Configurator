# Workspace Phase Workspace-9 - Filleted Corner Split Drag Authoring

## Doc Header

### Doc History
30. 2026-05-10 11:14:53: Corrected the just-landed `Workspace-9 / Phase 11 - Shared Corner Contract And Shell-Layer Consistency` closeout after the user clarified the real contract is four visible split points on every viewport at all times, restoring the primary `topLeft` corner, reverting the temporary occupied-corner suppression rule, and tightening the phase result around unified all-four-corners behavior plus the already-landed shared routing proof.
29. 2026-05-10 11:07:58: Implemented and closed `Workspace-9 / Phase 11 - Shared Corner Contract And Shell-Layer Consistency` by structurally suppressing the crowded primary-model-viewport `topLeft` split corner, keeping the shared split-corner gesture and hit-area contract unchanged, widening the tree and AppShell proof to cover the occupied-corner shell rule directly, and closing `Workspace 9` again as a complete shared-workspace split-authoring family.
28. 2026-05-10 11:01:11: Tightened `Workspace-9 / Phase 11 - Shared Corner Contract And Shell-Layer Consistency` into an implementation-ready next cut by grounding it against the live `.ViewportSplitCornerHandle` layering and glyph seam in `base.css`, the absolute top-left occupancy seam from `PrimaryViewportLeftDock` plus `docks.css`, and the current proof gap where split-corner tests still verify routing far more than visible-corner suppression or shell-read consistency.
27. 2026-05-10 10:53:50: Implemented and closed `Workspace-9 / Phase 10 - Explicit Pane Ownership And Target Routing Cleanup` by simplifying the AppShell target-validation helper down to the real explicit leaf-target seam, renaming the preview VM so it only carries that same explicit pane target, widening the runtime proof to cover both left-pane and right-pane outer-corner routing, and advancing the family handoff to `Phase 11 - Shared Corner Contract And Shell-Layer Consistency`.
26. 2026-05-10 10:49:51: Tightened `Workspace-9 / Phase 10 - Explicit Pane Ownership And Target Routing Cleanup` into an implementation-ready next cut by grounding it against the now-landed child-pane `targetNodeId` seam in `WorkspaceViewportTree.tsx`, the still-lightweight `resolveViewportSplitCornerContext(...)` cleanup seam in `AppShell.tsx`, and the focused opposite-pane regression-proof gap that remains after the first wrong-pane routing fix.
25. 2026-05-10 10:41:08: Reopened `Workspace 9` with explicit cleanup follow-through after the outer-corner widening landed, corrected the stale `Phase 7` through `Phase 9` shipped read to match the real runtime state, and added `Phase 10` plus `Phase 11` so split-corner pane ownership, suppression rules, and shell-layer consistency now have one honest next planning home instead of drifting through ad hoc follow-up fixes.
24. 2026-05-10 09:08:21: Implemented and closed `Workspace-9 / Phase 9 - Main Model Viewport Outer-Corner Split Entry` by widening the shared filleted split-pane shell so the unsplit primary model viewport now exposes one honest outer-corner entry handle, reusing the existing AppShell split-corner gesture path instead of inventing a root-only flow, and adding focused root-entry proof while keeping divider-adjacent split-pane coverage intact.
23. 2026-05-10 08:58:41: Tightened `Workspace-9 / Phase 9 - Main Model Viewport Outer-Corner Split Entry` into an implementation-ready next cut by grounding it against the live divider-adjacent-only eligibility rule in `WorkspaceViewportTree.tsx`, the existing shared corner-gesture owner in `AppShell.tsx`, the current hotspot proof in `WorkspaceViewportTree.test.tsx`, and the no-widening boundaries needed to extend root main viewport split entry without inventing a second gesture model.
22. 2026-05-10 08:58:41: Reopened `Workspace 9` just enough to add `Workspace-9 / Phase 9 - Main Model Viewport Outer-Corner Split Entry`, separating the current divider-adjacent hotspot contract from the later always-available main viewport outer-corner follow-through so the Blender-style root viewport split-entry widening can land as one explicit next cut instead of staying only in chat.
21. 2026-05-09 20:32:34: Implemented and closed `Workspace-9 / Phase 8 - Shared Workspace Corner Radius Consumption` by wiring the shipped `workspacePaneFilletRadiusPx` preference directly into the shared `ViewportSplitPane--filletedShell` CSS-variable seam, adding focused shared-workspace proof that the radius updates live and split-corner gesture entry still behaves correctly, and closing `Workspace 9` again as a complete shared-workspace family.
20. 2026-05-09 20:28:48: Prepped `Workspace-9 / Phase 8 - Shared Workspace Corner Radius Consumption` for implementation with a code-grounded read of the live shared `WorkspaceViewportTree.tsx` fillet-shell seam, the existing `--workspace-pane-fillet-radius` default in `base.css`, the shipped `uiPrefsStore` owner from `Phase 7`, and the focused shared-workspace proof shape needed before the final shell-consumption pass lands.
19. 2026-05-09 18:31:09: Implemented and closed `Workspace-9 / Phase 7 - Settings-Owned Workspace Corner Radius Preference` by landing a persisted `uiPrefsStore` owner plus one `Workspace` section slider in `SettingsSurface.tsx`, keeping the shared workspace shell unchanged, and advancing the active next implementation-ready handoff to `Phase 8 - Shared Workspace Corner Radius Consumption`.
18. 2026-05-09 18:14:41: Tightened `Workspace-9 / Phase 7 - Settings-Owned Workspace Corner Radius Preference` into an implementation-ready next cut by grounding it against the live `Workspace` section in `SettingsSurface.tsx`, the persisted owner seam in `uiPrefsStore.ts`, and the existing `Settings-1 / Phase 4` ladder so the next pass stays one explicit preference-owner plus slider slice before shared shell consumption begins.
17. 2026-05-09 17:52:53: Reopened the later `Workspace 9` follow-through just enough to add `Phase 7 - Settings-Owned Workspace Corner Radius Preference` plus `Phase 8 - Shared Workspace Corner Radius Consumption`, separating the persisted Settings owner from the shared workspace shell consumption so the user-facing corner-radius slider can land in two honest Codex-sized cuts instead of one mixed pass.
16. 2026-05-09 17:28:29: Implemented and closed `Workspace-9 / Phase 6 - Popup Workspace Parity Decision` by deciding explicit popup-shell deferral instead of widening into a second gesture owner, naming the still-popup-local split store plus inline split-tree renderer as the blocking seams, and closing the `Workspace 9` family honestly around the shipped shared-workspace corner-split lane.
15. 2026-05-09 17:26:14: Tightened `Workspace-9 / Phase 6 - Popup Workspace Parity Decision` into an implementation-ready final cut by grounding it against the still-popup-local split store and divider owner in `PopupWorkspaceShell.tsx`, making the parity-versus-deferral branch explicit, and keeping the family closeout honest if popup reuse is not already tiny and shared.
14. 2026-05-09 17:14:16: Implemented and closed `Workspace-9 / Phase 5 - Gesture Regression Proof And Resize Continuity` by landing the final shared-workspace proof pass for committed corner-created splits, tightening the continuity read around the existing split-ratio clamp truth, adding stable shared split-node test hooks, and advancing the active next implementation-ready handoff to `Phase 6 - Popup Workspace Parity Decision`.
13. 2026-05-09 17:05:01: Tightened `Workspace-9 / Phase 5 - Gesture Regression Proof And Resize Continuity` into an implementation-ready next cut by grounding it against the shipped split-corner commit coverage in `AppShell.test.tsx`, the shared `ViewportSplitDivider` resize seam in `WorkspaceViewportTree.tsx`, and the settled `setViewportLayoutSplitRatio(...)` owner path so the next pass can stay a proof-only regression and continuity slice without reopening commit logic or widening into popup parity.
12. 2026-05-09 17:01:07: Implemented and closed `Workspace-9 / Phase 4 - Release Commit And Cancel Behavior` by landing release-time split creation through the shared workspace owner seam, preview-ratio reapplication through the settled split-ratio path, under-threshold and abort cleanup, and focused commit-versus-cancel coverage, then advanced the active next implementation-ready handoff to `Phase 5 - Gesture Regression Proof And Resize Continuity`.
11. 2026-05-09 16:41:46: Tightened `Workspace-9 / Phase 4 - Release Commit And Cancel Behavior` into an implementation-ready next cut by grounding it against the shipped AppShell-local preview release seam, the live `splitViewportSlot(...)` mutation owner in `useWorkspaceStore.ts`, and the existing ratio-clamp path so the next pass can commit on release without widening into popup parity or regression-proof follow-through.
10. 2026-05-09 16:34:23: Implemented and closed `Workspace-9 / Phase 3 - Dominant-Axis Preview Orientation And Footprint` by landing AppShell-local preview orientation plus ratio derivation, shared split-shell transient preview painting, and focused no-mutation preview coverage, then advanced the active next implementation-ready handoff to `Phase 4 - Release Commit And Cancel Behavior`.
9. 2026-05-09 16:26:00: Tightened `Workspace-9 / Phase 3 - Dominant-Axis Preview Orientation And Footprint` into an implementation-ready next cut by grounding it against the shipped AppShell-local held corner-session state, the current absence of any preview VM or render path in `AppShell.tsx` and `WorkspaceViewportTree.tsx`, and the existing split-layout grid seam so the next pass can add dominant-axis orientation, hysteresis, and transient preview painting without widening into commit logic.
8. 2026-05-09 16:22:13: Implemented and closed `Workspace-9 / Phase 2 - Corner Gesture Session And Deadzone Entry` by landing an AppShell-local split-corner gesture session with hotspot pointer capture, deadzone crossing state, release and cancel cleanup, and focused no-mutation coverage, then advanced the active next implementation-ready handoff to `Phase 3 - Dominant-Axis Preview Orientation And Footprint`.
7. 2026-05-09 16:03:01: Tightened `Workspace-9 / Phase 2 - Corner Gesture Session And Deadzone Entry` into an implementation-ready next cut by grounding it against the live corner-pointer stub in `AppShell.tsx`, the current no-mutation proof in `AppShell.test.tsx`, the shared hotspot reporting seam in `WorkspaceViewportTree.tsx`, and the existing pointer-capture pattern already used by other workspace surfaces so the gesture-state pass stays AppShell-local and tree-read-only before preview rendering begins.
6. 2026-05-09 15:49:25: Tightened the `Workspace 9` closeout ladder again after another Codex-sized phase audit by splitting the old mixed `Phase 5` into a proof-only `Phase 5 - Gesture Regression Proof And Resize Continuity` plus a separate `Phase 6 - Popup Workspace Parity Decision` so the final handoff cannot silently widen into popup-shell convergence work.
5. 2026-05-07 15:47:19: Implemented and closed `Workspace-9 / Phase 1 - Corner Hotspot And Filleted Pane Shell` by landing divider-adjacent split-corner hotspots plus the first filleted no-padding shared pane shell, recording the exact eligible-corner rule now in code, and advancing the active next implementation-ready handoff to `Phase 2 - Gesture Session State And Deadzone Entry`.
4. 2026-05-07 15:23:25: Tightened the `Workspace 9` implementation ladder again after a Codex-sized phase audit by splitting the old broad preview and commit follow-ons into smaller `Phase 2` through `Phase 5` slices for gesture session entry, dominant-axis preview orientation, release commit and cancel behavior, and final regression or popup-parity hardening.
3. 2026-05-07 15:10:23: Updated the `Workspace 9` phase direction so the filleted pane shell now explicitly leaves room for a user-adjustable workspace fillet radius, routing that control toward the Settings workspace instead of freezing one permanent corner size into the split-authoring shell.
2. 2026-05-07 15:06:56: Tightened `Workspace-9 / Phase 1 - Corner Hotspot And Filleted Pane Shell` into an implementation-ready first cut by grounding it against the live `WorkspaceViewportTree.tsx` split-node render seam, the current `ViewportSplitPane--editor` `12px` padding and zero-gap split layout CSS, the likely no-padding and corner-affordance file set, and the focused no-widening, checklist, and verification rules needed before gesture-state work begins.
1. 2026-05-07 15:03:08: Added this native Workspace-family phase doc to capture the new Blender-style filleted-corner split gesture, locking the click-hold-drag preview, dominant-axis orientation pick, live ratio sizing, commit-on-release rule, and first suggested guardrails into one explicit post-`Workspace 8` future planning surface.

### Purpose

Use this phase to add a new split-authoring gesture to the shared workspace tree by turning exposed filleted viewport corners into Blender-style split hotspots.

The goal is to let the user press an empty pane corner, drag to choose split direction and size, preview the result live, and only create the new viewport when the pointer is released.

### Scope

This phase covers:
- filleted-corner split hotspots on shared workspace panes
- no-padding pane-edge polish needed so the corners read like intentional split handles
- click-hold-drag split preview authoring
- dominant-axis orientation picking from absolute pointer travel
- live preview ratio sizing before commit
- commit, cancel, and threshold rules for the corner gesture

This phase does not cover:
- replacing the existing divider-resize path
- replacing menu-driven split commands that are already useful
- merge or join gestures for removing viewports
- a separate split-state system outside the existing workspace layout tree
- non-workspace feature ownership such as Browser render truth that belongs to `Workspace 8`

## Doc Body

### Summary

`Workspace 9` is the corner-driven split-authoring phase.

It should deliver:
- exposed pane corners with intentional filleted split affordances
- one temporary corner-drag gesture state before commit
- one live preview that shows both split orientation and candidate ratio while the pointer is still down
- one release-to-commit rule that turns the preview into a real workspace split only when the gesture is large enough
- one shell direction that can read a user-controlled fillet radius later instead of hard-coding a permanent corner size

### Locked Direction

`Workspace 9` should be:
- a shared workspace split-authoring improvement on top of the existing layout tree
- a Blender-style corner affordance phase
- a preview-first, commit-on-release gesture phase
- a dominant-axis pick phase that reads natural pointer intent instead of asking for a prior mode choice
- a shell-polish phase that can consume a later Settings-owned fillet-radius value cleanly

`Workspace 9` should not be:
- a second split-ownership system parallel to the current workspace tree
- a hidden menu-only interaction
- a one-axis hard lock that makes it awkward to switch from vertical to horizontal mid-drag
- a resize-only phase
- a viewer-only visual tweak with no real split-authoring behavior behind it

### Locked Interaction Model

- Only an exposed empty fillet corner should start this gesture.
- Existing divider intersections should keep their current meaning instead of silently becoming new-corner split handles.
- `pointerdown` on the corner should start a temporary split-authoring session.
- The workspace tree should not mutate on `pointerdown`.
- While the user is holding the pointer:
  - compute absolute `deltaX` and absolute `deltaY` from the original corner hit point
  - whichever absolute value is larger owns the current orientation read
  - larger `deltaX` means a vertical divider split
  - larger `deltaY` means a horizontal divider split
  - use the same live motion to derive the candidate split ratio
- `pointerup` should be the commit point.
- If the gesture never crosses the minimum split threshold, cancel it.
- If the gesture crosses threshold, create the real split and preserve the final candidate ratio.

### Suggested First-Pass Guardrails

- Use a small deadzone before any preview appears so a simple click on the corner does not accidentally split the pane.
- Keep the gesture switchable until release by comparing absolute movement continuously instead of permanently locking the first detected axis.
- Add a light hysteresis rule so tiny jitter near a 45-degree drag does not make the preview flicker every frame.
- Reuse the existing split-ratio clamp and divider-size constraints after commit so the new gesture lands inside the same workspace truth as normal divider resizing.
- Capture the pointer for the whole gesture and support cancel on `Escape` so the interaction feels deliberate instead of brittle.

### Acceptance Read

This phase counts as honest when:
- a visible exposed fillet corner exists on eligible workspace panes
- pressing and holding that corner shows no immediate tree mutation
- dragging mostly sideways previews a vertical split
- dragging mostly vertically previews a horizontal split
- the preview ratio follows the drag while held
- releasing above threshold creates the split at the previewed ratio
- releasing below threshold leaves the workspace unchanged
- the resulting real divider still resizes through the existing split divider path

### Current Live Read

Likely current owner seams for this phase:
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/theme/foundation/base.css`
- `src/app/theme/shell/windows.css`
- `src/app/workspace/PopupWorkspaceShell.tsx`

Current useful truth already present:
- the shared workspace tree already owns real split nodes and split ratios
- the divider resize path already exists and should stay the post-commit owner
- the current split UI already exposes a shared divider shell that can anchor the visual language for the preview path

## Vision

This phase belongs to the later Workspace family cleanup and polish ladder after slot and split truth already exist.

The user-facing promise is:
- splitting should feel like part of the pane itself
- corner drag should become a fast natural way to create a split
- the user should be able to discover horizontal versus vertical intent by motion, not by pre-selecting a mode

Important direction that must stay true:
- the workspace tree remains the real owner
- preview is temporary authoring state, not a second layout system
- the gesture should feel Blender-like, but still speak ParaHook's existing slot-tree truth
- fillet radius preference should live in Settings or another explicit preference owner, not as ad hoc local state inside one workspace pane component

## Wishlist Organization

### High Level Goals
- [ ] `Workspace-9-HLG-1. Add a new Blender-style way to split workspaces from the filleted viewport corner instead of only from the existing split affordances.`
- [ ] `Workspace-9-HLG-2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [ ] `Workspace-9-HLG-3. Let horizontal versus vertical split direction be chosen naturally from whichever absolute pointer movement is larger so the user can switch easily while dragging.`
- [ ] `Workspace-9-HLG-4. Tighten the pane visuals so the workspaces use filleted edges with no padding and the corner handle reads like part of the pane frame.`
- [ ] `Workspace-9-HLG-5. Let the filleted workspace-corner radius be user-adjustable through the Settings workspace instead of forcing one permanent visual radius.`

### Codex Level Goals
- [ ] CLG 1. Add a temporary corner-split gesture state that is separate from the committed workspace tree.
- [ ] CLG 2. Reuse the existing split ratio and split-node ownership when the gesture commits.
- [ ] CLG 3. Add preview, threshold, cancel, and jitter-control rules so the gesture feels stable enough to ship.
- [ ] CLG 4. Align main workspace and popup workspace hosts on the same corner-split interaction contract where practical.
- [ ] CLG 5. Keep the corner shell styling compatible with a later Settings-owned fillet-radius preference.

### `Workspace-9 / Phase 1`
- [x] `HLG 1. Add a new Blender-style way to split workspaces from the filleted viewport corner instead of only from the existing split affordances.`
- [x] `HLG 4. Tighten the pane visuals so the workspaces use filleted edges with no padding and the corner handle reads like part of the pane frame.`
- [x] `HLG 5. Let the filleted workspace-corner radius be user-adjustable through the Settings workspace instead of forcing one permanent visual radius.`
- [x] Define which pane corners are eligible split hotspots.
- [x] Add the visible corner affordance and the no-padding edge polish needed so the hotspot is understandable.
- [x] Keep divider intersections and other existing shell controls out of the new hotspot scope.
- [x] Leave the corner shell styling parameterized so a later Settings-owned fillet-radius control can feed it without another shell rewrite.

### `Workspace-9 / Phase 2`
- [x] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [x] Add temporary corner-drag session state with pointer capture and deadzone handling.
- [x] Keep `pointerdown` non-mutating while establishing the later preview entry seam.
- [x] Add the first cancel path for aborted gesture-state cleanup before any real split is committed.

### `Workspace-9 / Phase 3`
- [x] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [x] `HLG 3. Let horizontal versus vertical split direction be chosen naturally from whichever absolute pointer movement is larger so the user can switch easily while dragging.`
- [x] Derive orientation from dominant absolute `x` versus `y` pointer travel.
- [x] Render the live preview divider and candidate second-pane footprint without mutating the committed workspace tree.
- [x] Add hysteresis or similar stability handling so near-diagonal drags do not flicker excessively.

### `Workspace-9 / Phase 4`
- [x] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [x] Commit the split on release using the previewed ratio and the existing split-tree owner seam.
- [x] Cancel under-threshold or aborted gestures without mutating the tree.
- [x] Reuse the existing split-node helpers and ratio clamps instead of inventing a second layout mutation path.

### `Workspace-9 / Phase 5`
- [x] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [x] `HLG 3. Let horizontal versus vertical split direction be chosen naturally from whichever absolute pointer movement is larger so the user can switch easily while dragging.`
- [x] Add focused tests for vertical preview, horizontal preview, cancel, and axis switching after the full gesture lands.
- [x] Add the regression proof that the committed split still resizes through the existing divider behavior.

### `Workspace-9 / Phase 6`
- [x] `HLG 1. Add a new Blender-style way to split workspaces from the filleted viewport corner instead of only from the existing split affordances.`
- [x] Decide whether popup workspace shell parity is ready now or should stay explicitly deferred.
- [x] If parity is tiny and shared, land it without inventing popup-only gesture ownership.
- [x] If parity is not tiny, record the explicit deferral and keep the shared workspace gesture lane honestly closed.

### `Workspace-9 / Phase 7`
- [x] `HLG 5. Let the filleted workspace-corner radius be user-adjustable through the Settings workspace instead of forcing one permanent visual radius.`
- [x] Add one persisted Settings-owned preference for the shared workspace corner radius.
- [x] Add one Settings workspace slider and default-value read for that preference.
- [x] Keep this phase focused on owner state, Settings UI, and plumbing, not on the final shared workspace shell consumption.

### `Workspace-9 / Phase 8`
- [x] `HLG 5. Let the filleted workspace-corner radius be user-adjustable through the Settings workspace instead of forcing one permanent visual radius.`
- [x] Read the stored Settings-owned radius preference into the shared workspace pane shell.
- [x] Reapply the existing fillet seam and hotspot visuals against real user-adjustable values.
- [x] Add focused proof that changing the preference updates the shared workspace corner shell without breaking split-corner affordance behavior.

### `Workspace-9 / Phase 9`
- [x] `HLG 1. Add a new Blender-style way to split workspaces from the filleted viewport corner instead of only from the existing split affordances.`
- [x] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [x] Widen the hotspot eligibility rule so the main unsplit model viewport can start a split from its exposed outer filleted corners instead of requiring an already-divider-adjacent pane corner.
- [x] Keep the existing shared split-corner gesture model, preview path, commit path, and ratio clamps instead of inventing a second root-viewport split authoring flow.
- [x] Decide which outer corners should remain suppressed when shell chrome or dock ownership makes a corner non-empty or visually misleading.

### `Workspace-9 / Phase 10`
- [ ] `HLG 1. Add a new Blender-style way to split workspaces from the filleted viewport corner instead of only from the existing split affordances.`
- [ ] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [ ] Replace corner-position inference with explicit pane-target ownership everywhere the shared split-corner gesture is routed.
- [ ] Keep preview and commit bound to the pane subtree that owns the clicked corner even after the first split creates multiple visible panes.
- [ ] Add focused regression proof for left-pane versus right-pane routing so outside-corner entry can no longer preview or split the wrong viewport.

### `Workspace-9 / Phase 11`
- [ ] `HLG 1. Add a new Blender-style way to split workspaces from the filleted viewport corner instead of only from the existing split affordances.`
- [ ] `HLG 4. Tighten the pane visuals so the workspaces use filleted edges with no padding and the corner handle reads like part of the pane frame.`
- [ ] Unify which corners stay visible, suppressed, or offset when titlebar chrome, the primary left dock, or other shell owners already occupy that corner.
- [ ] Remove visual and layering drift between top and bottom corner glyphs so all four corners read like one shared affordance across radius extremes.
- [ ] Keep popup-workspace deferral honest while tightening only the shared workspace shell contract.


### Phase 9 Summary

#### Purpose

Finish the Blender-style split-entry promise for the root workspace by letting the main model viewport start the shared split-corner gesture from its exposed outer filleted corners even before any split already exists.

#### Owns

- widening split-corner hotspot eligibility beyond divider-adjacent pane corners for the shared main model viewport
- keeping the existing shared split-corner gesture, preview, and commit behavior intact for the newly eligible outer-corner entry path
- focused proof that the main root viewport can now begin the same shared split-corner flow without requiring a pre-existing split

#### Does Not Own

- a new split authoring model separate from the shipped shared corner gesture
- popup workspace parity
- changes to the settled split-ratio clamp, preview orientation, or release commit rules

#### Current Live Read

- `src/app/workspace/WorkspaceViewportTree.tsx` still computes split-corner hotspot eligibility from the current split node and only renders divider-adjacent pane corners today.
- `src/app/workspace/WorkspaceViewportTree.test.tsx` already proves the current divider-adjacent-only hotspot contract, so this phase needs to widen that truth deliberately instead of accidentally.
- `src/app/AppShell.tsx` already owns the shared corner gesture session, preview, and commit path, so the main viewport widening should reuse that existing owner instead of branching into a separate root-viewport authoring seam.
- `WorkspaceViewportTree.tsx` currently renders hotspot buttons only while walking split nodes, which means the unsplit root model viewport has no outer-corner entry seam at all today and Phase 9 must introduce one explicit root-pane eligibility path rather than just tweaking a CSS affordance.
- the main design risk is ambiguous outer corners near shell chrome or dock seams, not the already-shipped split gesture mechanics themselves.

### Phase 9 Result

- `src/app/workspace/WorkspaceViewportTree.tsx` now reuses the existing shared filleted split-pane shell for the unsplit root primary model viewport, exposes all four root outer split-entry corners, and also exposes the same shared corners across already-split panes so outer and inner fillets stay available through one contract.
- `src/app/AppShell.tsx` now widens the existing split-corner eligibility seam so the shared gesture session, preview, and commit path accept root primary-model entry and explicit pane-target follow-through without forking a second authoring flow.
- `src/app/workspace/WorkspaceViewportTree.test.tsx` and `src/app/AppShell.test.tsx` now prove the widened contract across both root and already-split panes, including the regression that a clicked left-pane outer corner keeps preview and commit ownership on that same left pane.

### Phase 9 Implementation Spec

#### Exact First Code Cut

1. Widen the shared hotspot eligibility read so the root main model viewport can expose valid outer filleted split corners even when no existing divider is present.
2. Reuse the existing shared corner gesture session, dominant-axis preview, and release commit behavior unchanged for those newly eligible corners.
3. Prefer the smallest root-pane eligibility surface that still leaves room to suppress occupied corners where left-dock or shell chrome makes a corner non-empty.
4. Update the current divider-adjacent hotspot proof so it still covers split panes while adding a new root-viewport proof for pre-split outer-corner entry.

#### Likely Files

- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/AppShell.tsx` only if the widened root-pane hotspot path exposes one tiny missing data seam for the existing shared gesture handlers
- `src/app/theme/foundation/base.css` only if the widened outer-corner affordance needs one tiny visual clarification

#### No-Widening Rule

- Do not invent a second root-viewport split authoring flow.
- Do not reopen the shipped preview orientation, release commit, or ratio-clamp rules.
- Do not widen into popup parity or non-workspace shell ownership.
- Do not silently broaden hotspot eligibility on every pane corner; keep the widening explicitly scoped to the main root viewport outer-corner entry case.

#### Implementation Risks

- If the root model viewport outer-corner path is bolted on outside `WorkspaceViewportTree.tsx`, the family will drift into a second gesture-entry owner instead of widening the settled shared split-pane shell.
- If left-dock chrome or other shell occupancy is not accounted for, the newly exposed outer corners can look clickable while overlapping non-empty shell regions.
- If the existing divider-adjacent-only test is simply replaced instead of extended, the widened contract can accidentally loosen hotspot coverage on already-split panes without anyone noticing.

#### Checklist

- [x] Widen hotspot eligibility so the main model viewport can expose valid outer split corners before any existing split.
- [x] Keep the shipped shared corner gesture path unchanged for those corners.
- [x] Suppress misleading occupied corners where shell chrome makes the corner non-empty.
- [x] Keep the current divider-adjacent hotspot proof honest while extending it for the root main viewport case.
- [x] Add focused proof for root main viewport outer-corner gesture entry.

#### Verification Shape

- focused shared-workspace proof that the main root viewport now renders valid outer split-corner entry affordances before any split exists
- focused shared-gesture proof that the newly eligible main viewport corners enter the existing split-corner session and preview path without mutating the tree on `pointerdown`

#### Done Shape

- the main unsplit model viewport exposes real outer split-corner entry affordances through the shared workspace tree
- the newly eligible root corners enter the same shipped split-corner gesture session, preview path, and release commit path as existing split panes
- occupied or misleading outer corners remain suppressed where shell chrome already owns that corner
- divider-adjacent hotspot behavior on already-split panes remains intact

## [x] `Workspace-9 / Phase 1` - `Corner Hotspot And Filleted Pane Shell`

### Phase 1 Summary

#### Purpose

Make the pane corner an intentional split hotspot and tighten the pane-edge visuals enough that the gesture can be discovered.

#### Owns

- exposed corner hotspot rules
- filleted corner affordance shape
- no-padding pane-edge presentation needed for the hotspot to read clearly

#### Does Not Own

- live preview ratio math
- committed split-node creation
- divider-resize behavior after the split exists

#### Current Live Read

- `src/app/workspace/WorkspaceViewportTree.tsx` already renders the shared split tree through `ViewportSplitLayout`, `ViewportSplitPane`, and `ViewportSplitDividerShell`, so the first visible corner affordance should attach to that existing split-pane shell instead of introducing a second outer layout wrapper.
- `src/app/theme/shell/windows.css` already gives `ViewportSplitLayout` a zero-gap grid and owns the pane-edge border language, so the filleted-corner treatment should start there.
- `src/app/theme/foundation/base.css` still gives `.ViewportSplitPane--editor` a `12px` padding block, which directly conflicts with the requested no-padding pane-edge read and should therefore be narrowed or localized in this phase instead of left for later.
- `src/app/AppShell.tsx` already owns the real divider-resize pointer path, which means this phase can stay visual and hotspot-only without touching split-ratio mutation yet.
- the later user-controlled fillet radius should not be owned here; this phase should prefer CSS variables or another explicit styling seam that a Settings-owned value can populate later.

#### First Pass Decisions

- Prefer a visible-but-small corner target over an invisible pixel hunt.
- Keep the hotspot on the pane frame, not in the content body.
- Start with the shared workspace panes first, then extend to popup workspace parity if the shell structure matches closely enough.
- Scope the first pass to the shared workspace tree first; popup shell parity should only widen into the same pass if the corner shell can be reused without adding separate popup-only behavior.
- Lock the first eligible-corner rule to divider-adjacent pane corners only:
  - vertical splits expose `top-right` and `bottom-right` on the left pane plus `top-left` and `bottom-left` on the right pane
  - horizontal splits expose `bottom-left` and `bottom-right` on the top pane plus `top-left` and `top-right` on the bottom pane

### Phase 1 Result

- The shared `WorkspaceViewportTree.tsx` split-pane shell now renders visible divider-adjacent corner hotspot buttons and keeps their `pointerdown` path non-mutating through `AppShell.tsx`.
- The shared split-pane shell now uses a parameterized `--workspace-pane-fillet-radius` seam plus filleted no-padding pane styling so the corner affordance reads like part of the pane frame instead of a padded inset box.
- Popup workspace shell parity, pointer capture, deadzone logic, preview rendering, and release commit remain deferred to `Phase 2` through `Phase 6`.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add one corner-affordance element to the shared pane shell rendered by `WorkspaceViewportTree.tsx`, most likely attached inside each eligible `ViewportSplitPane` wrapper rather than the divider shell.
2. Add the first filleted-corner and no-padding CSS to the shared split-pane classes so the corner reads like part of the pane frame and the current `12px` editor padding no longer pushes the edge inward.
3. Prefer a parameterized radius seam such as a CSS custom property instead of a one-off literal radius value, so a later Settings-owned slider can drive the shell without another structure change.
4. Gate the corner affordance to eligible pane corners only, keeping divider intersections and non-pane shell controls out of scope.
5. Add a minimal `pointerdown` entry hook that can be verified in tests, but stop before any live drag preview or committed split mutation begins.

#### Likely Files

- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/theme/shell/windows.css`
- optional follow-through only if the shell can stay shared without widening:
  - `src/app/workspace/PopupWorkspaceShell.tsx`

#### No-Widening Rule

- Do not start changing split commit behavior in this phase.
- Do not widen into merge, close, or join gestures.
- Do not add live ratio preview state, dominant-axis math, or pointer-capture gesture orchestration yet.
- Do not reshape unrelated viewport header or toolbar controls while chasing the fillet styling.
- Do not introduce a new preference owner in this phase; only leave a clean seam for the later Settings slider.

#### Implementation Risks

- The current `ViewportSplitPane--editor` padding may still be serving non-corner content spacing needs, so Phase 1 should prefer a targeted shell-layer no-padding adjustment over a broad content-layout rewrite.
- The split-pane shell currently distinguishes `--viewer` versus `--editor`, so the corner affordance must stay generic enough that later non-model surfaces can inherit it without another feature-specific branch.
- If the popup workspace shell needs a matching corner read, it may not share the exact same wrapper structure; that parity should stay optional unless the same shell abstraction is obviously reusable now.
- If the first fillet styling hard-codes a radius, the later Settings slider would force another shell refactor, so the first pass should establish a parameterized radius seam now.

#### Checklist

- [x] Identify the exact eligible pane corners for the first hotspot pass.
- [x] Add one visible corner affordance to the shared split-pane shell.
- [x] Remove or localize the current pane-edge padding that blocks the no-padding fillet read.
- [x] Add the first filleted pane-edge styling without changing split-tree behavior.
- [x] Keep the radius styling parameterized for a later Settings-owned slider.
- [x] Wire a minimal `pointerdown` entry seam for later preview-state work without starting the gesture yet.
- [x] Add focused tests proving the new corner affordance renders only on eligible panes.

#### Verification Shape

- focused rendering and interaction tests for hotspot presence on eligible panes
- focused test that the phase does not mutate the workspace tree on corner `pointerdown`
- visual check that pane corners and no-padding shell still look intentional in split layouts

#### Done Shape

- shared workspace split panes render one intentional corner affordance on eligible corners
- the pane shell reads with the first filleted no-padding edge treatment instead of the earlier padded editor frame look
- no live split preview or split-node mutation exists yet
- the phase leaves one clean entry seam for `Phase 2` to own the dominant-axis drag preview state

## [x] `Workspace-9 / Phase 2` - `Corner Gesture Session And Deadzone Entry`

### Phase 2 Summary

#### Purpose

Add the temporary corner-drag session state and deadzone entry rules without taking on live preview rendering or split commit in the same pass.

#### Owns

- temporary corner-drag session state
- pointer capture and cleanup for the gesture
- deadzone handling before preview begins
- early cancel or abort cleanup while the workspace tree still stays unchanged

#### Does Not Own

- dominant-axis preview rendering
- final split-node commit to the workspace tree
- post-commit divider resize behavior

#### Current Live Read

- `src/app/AppShell.tsx` currently keeps `handleViewportSplitCornerPointerDown(...)` as a pure `preventDefault()` / `stopPropagation()` stub, which is the narrowest possible seam for introducing transient gesture state without needing to unwind any already-started commit or preview logic.
- `src/app/workspace/WorkspaceViewportTree.tsx` already reports both `nodeId` and `corner` from the hotspot button `pointerdown`, so Phase 2 does not need another hit-testing layer or DOM query path before it can begin a held corner session.
- `src/app/AppShell.test.tsx` already proves the current Phase 1 guarantee that corner `pointerdown` leaves both `viewportLayoutNodesById` and `viewportSlotsById` unchanged, so the next pass should preserve that no-mutation proof while adding transient held-session state.
- `src/app/workspace/EditHistoryReaderSurface.tsx` already demonstrates the local pointer-capture pattern used elsewhere in the workspace family, including `setPointerCapture(...)` on the initiating element and pointer-id-gated preview state, so Phase 2 can reuse that interaction style instead of inventing a second capture model.
- the existing divider resize path in `AppShell.tsx` still uses global `window` listeners and immediate ratio mutation, which means Phase 2 should not copy its owner model directly; this pass needs capture plus cleanup, but must remain tree-read-only until later preview and commit phases.

#### First Pass Decisions

- Add one small deadzone before any orientation appears.
- Keep gesture-state cleanup explicit so pointer aborts do not leak transient state.
- Continue treating the committed workspace tree as read-only during this phase.
- Keep the held corner session AppShell-local instead of widening transient authoring state into `useWorkspaceStore` before a committed tree mutation even exists.

### Phase 2 Result

- `src/app/AppShell.tsx` now owns one transient split-corner gesture session that records pointer identity, originating corner, target split node, latest drag coordinates, and deadzone crossing while keeping the committed workspace tree untouched.
- `src/app/workspace/WorkspaceViewportTree.tsx` now forwards corner-button pointer move, up, and cancel events plus a small session-state read so the held hotspot can show whether it is still only held or has crossed the deadzone without starting preview rendering yet.
- `src/app/AppShell.test.tsx` now proves the held corner session starts, arms past the deadzone, ignores non-primary clicks, and clears on pointer release or pointer cancel while `viewportLayoutNodesById` and `viewportSlotsById` remain unchanged.
- Dominant-axis orientation, preview rendering, and split-node commit remain deferred to `Phase 3` and `Phase 4`.

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Add one AppShell-local transient `cornerSplitGestureSession` state object that records the target split node id, chosen corner, pointer id, and original pointerdown coordinates, while keeping the committed workspace tree untouched.
2. Update `handleViewportSplitCornerPointerDown(...)` to ignore non-left clicks, capture the pointer on the hotspot button, and start the held session only when the addressed layout node is still a live split node.
3. Add pointer-move handling that updates only transient drag distance and deadzone-crossed state, but still stops short of deriving orientation or rendering preview UI in this phase.
4. Add pointer-up, pointer-cancel, and explicit cleanup handling so the held session always clears safely and never leaks stale pointer ownership across later interactions.
5. If the deadzone is never crossed, leave the session as a no-preview no-commit interaction and return to idle without mutating `viewportLayoutNodesById` or `viewportSlotsById`.

#### Likely Files

- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- optional only if a tiny helper seam is clearly cleaner than inlining:
  - `src/app/workspace/WorkspaceViewportTree.tsx`

#### No-Widening Rule

- Do not render the live preview divider yet.
- Do not commit the real split in this phase.
- Do not widen transient gesture ownership into `useWorkspaceStore` or persistence state in this phase.
- Do not widen into popup child-window lifecycle or surface persistence work unless the transient session state truly cannot exist without it.

#### Implementation Risks

- If the held session is stored in the workspace store too early, later preview and commit phases will inherit a wider owner than they need, which would make transient authoring state look more like a second layout system.
- Pointer capture should stay tied to the originating corner button; if the first cut falls back to only global window listeners, the interaction may become harder to clean up correctly on pointer cancellation or button removal.
- The target split node could disappear or change while a session is active if other layout actions occur, so the session cleanup path should tolerate stale node ids instead of assuming the original tree shape still exists.
- Deadzone state should only answer "has the gesture meaningfully started yet?"; if this phase starts deriving orientation or ratio too early, it will steal scope from `Phase 3`.

#### Checklist

- [x] Add one transient AppShell-local corner gesture session owner.
- [x] Record pointer id, corner, target split node id, and origin coordinates on hotspot `pointerdown`.
- [x] Capture the pointer on the hotspot button and gate later events by pointer id.
- [x] Track deadzone-crossed versus not-yet-crossed movement without mutating the workspace tree.
- [x] Clear the session safely on pointer up, pointer cancel, and aborted paths.
- [x] Add focused tests proving the held session starts and clears without changing layout state.

#### Verification Shape

- focused tests for corner `pointerdown` creating transient gesture state only
- focused tests for deadzone behavior and abort cleanup with no tree mutation
- focused test that pointer cancellation clears the transient session cleanly

#### Done Shape

- a corner hotspot press can start one temporary held session without mutating the workspace tree
- the held session records enough data for later preview entry, but does not yet pick orientation or render preview UI
- deadzone handling prevents a simple click from counting as an active split preview
- pointer release and pointer cancel both clear the transient session safely

## [x] `Workspace-9 / Phase 3` - `Dominant-Axis Preview Orientation And Footprint`

### Phase 3 Summary

#### Purpose

Add the live preview read by deriving orientation from dominant absolute pointer travel and rendering the candidate split footprint while the committed tree still stays untouched.

#### Owns

- absolute `deltaX` versus `deltaY` orientation picking
- live candidate ratio preview
- preview divider and second-pane footprint rendering
- hysteresis or equivalent preview-stability handling

#### Does Not Own

- final split-node commit to the workspace tree
- post-commit divider resize behavior
- later merge or join gestures
- later multi-corner advanced gestures

#### Current Live Read

- `src/app/AppShell.tsx` now owns the `viewportSplitCornerGestureSession` transient state, including origin coordinates, latest coordinates, and deadzone crossing, but it still stops at session cleanup and does not derive orientation, ratio, or any preview VM yet.
- `src/app/workspace/WorkspaceViewportTree.tsx` already exposes the active corner session state back onto the hotspot buttons, and it already owns the split-pane render seam through `ViewportSplitLayout`, `ViewportSplitPane`, and `ViewportSplitDividerShell`, so the first preview paint should attach to that existing shell instead of introducing a second overlay system.
- The existing split layout render path already knows the live split direction, dock side, grid template areas, and divider placement language for real committed splits, which means Phase 3 can borrow that spatial language for a preview read without mutating `viewportLayoutNodesById`.
- `src/app/AppShell.test.tsx` already proves the held gesture arms past the deadzone and still leaves `viewportLayoutNodesById` and `viewportSlotsById` unchanged, so the next pass should preserve that no-mutation contract while adding visible preview output.
- No current helper computes a candidate split ratio from the held corner drag, and no current hysteresis rule stabilizes near-diagonal movement, so those reads must become explicit in this phase instead of leaking into release-time commit logic later.

#### First Pass Decisions

- Keep the preview switchable while dragging instead of hard-locking the first axis immediately.
- Compare absolute movement, not signed movement.
- Add light hysteresis so near-diagonal drags do not flicker excessively.
- Keep the preview VM AppShell-local and derived from the held gesture session rather than widening transient preview truth into `useWorkspaceStore`.

### Phase 3 Result

- `src/app/AppShell.tsx` now derives one AppShell-local split-corner preview VM from the held gesture session, including dominant-axis orientation, light hysteresis switching, and a transient candidate ratio based on the addressed pane bounds.
- `src/app/workspace/WorkspaceViewportTree.tsx` now paints one transient preview divider plus one candidate second-pane footprint through the existing split-pane shell so the gesture becomes visible without mutating `viewportLayoutNodesById` or `viewportSlotsById`.
- `src/app/theme/foundation/base.css` now styles the preview footprint and divider with the same shared pane-shell language instead of introducing a separate overlay owner.
- `src/app/AppShell.test.tsx` now proves dominant-`x` vertical preview, dominant-`y` horizontal preview, and mid-drag hysteresis-based axis switching while the committed workspace tree remains unchanged.
- Real split creation on release remains deferred to `Phase 4`.

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Add one AppShell-local derived preview read that turns the held corner session into a candidate orientation and candidate ratio only after the deadzone has been crossed.
2. Compute dominant-axis orientation from absolute pointer travel, keep it switchable mid-drag, and add a small hysteresis rule so near-diagonal motion does not flicker between vertical and horizontal every frame.
3. Derive one candidate preview ratio from the same drag motion against the addressed split layout bounds, but keep it transient and separate from `setViewportLayoutSplitRatio(...)`.
4. Extend the shared split-pane render seam so the active pane can show one preview divider plus one candidate second-pane footprint without mutating `viewportLayoutNodesById` or `viewportSlotsById`.
5. Keep the preview VM entirely transient so `pointerup` in this phase still clears the session without committing a real split.

#### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/AppShell.test.tsx`
- optional only if the preview math or VM becomes clearer as a tiny local helper:
  - `src/app/workspace/workspaceShellTypes.ts`

#### No-Widening Rule

- Do not commit the real split in this phase.
- Do not widen preview ownership into `useWorkspaceStore`, persistence state, or popup-shell parity work in this phase.
- Do not widen into popup child-window lifecycle or surface persistence work unless preview rendering truly cannot exist without it.

#### Implementation Risks

- If the preview path reuses the real split-node render contract too literally, it could accidentally look like committed layout truth and make Phase 4 commit logic harder to keep honest.
- Hysteresis needs to stabilize near-diagonal motion without making the axis feel sticky; too much stickiness would undermine the intended “switchable until release” behavior.
- Ratio derivation needs to respect the addressed split layout bounds and dock-side semantics without calling the real clamp-and-commit store action too early.
- If the preview paint path hides behind hotspot-only state and never projects onto the pane shell, the gesture may still feel invisible even after the VM exists.

#### Checklist

- [x] Add one transient AppShell-local preview VM derived from the held corner session.
- [x] Derive dominant-axis orientation from absolute pointer travel with a light hysteresis rule.
- [x] Derive a candidate preview ratio without mutating the committed split tree.
- [x] Render one preview divider and candidate second-pane footprint through the shared split-pane shell.
- [x] Keep release and cancel behavior non-committing in this phase.
- [x] Add focused tests proving vertical preview, horizontal preview, and mid-drag axis switching without tree mutation.

#### Verification Shape

- focused tests for dominant-`x` vertical preview
- focused tests for dominant-`y` horizontal preview
- focused tests for mid-drag orientation switching without tree mutation

#### Done Shape

- dragging past the deadzone shows one transient split preview with visible orientation
- the preview can switch between vertical and horizontal based on dominant absolute movement without mutating the workspace tree
- the preview ratio follows the drag as a transient read only
- releasing still does not create a real split yet

## [x] `Workspace-9 / Phase 4` - `Release Commit And Cancel Behavior`

### Phase 4 Summary

#### Purpose

Turn the preview gesture into a truthful authoring flow by committing only on release and canceling safely through the existing split-tree owner seam.

#### Owns

- release-to-commit behavior
- cancel-under-threshold behavior
- reuse of existing split ratio clamps and split-node creation helpers

#### Does Not Own

- final regression hardening beyond the exact commit or cancel behavior
- popup parity decisions
- later merge or join gestures
- later multi-corner advanced gestures

#### First Pass Decisions

- Reuse the existing split-creation helpers instead of introducing a second layout mutation path.
- Prefer canceling harmlessly over creating an accidental tiny split.
- Keep `Escape` cancel if the pointer capture flow supports it cleanly.

### Phase 4 Result

- `src/app/AppShell.tsx` now commits a real workspace split on corner-gesture release by reusing the transient preview VM, mapping its anchor edge back to one real dock side, and clearing the gesture session once the commit or cancel outcome is settled.
- `src/app/workspace/useWorkspaceStore.ts` now exposes one shared `splitViewportLayoutNode(...)` owner seam so corner-driven release commit can wrap either a leaf pane or an already-nested pane subtree without mutating `viewportLayoutNodesById` inline from AppShell.
- The release flow now reapplies the previewed ratio through `setViewportLayoutSplitRatio(...)`, so the committed split stays aligned with the visible preview as closely as the settled workspace clamps allow.
- Under-threshold release and pointer-cancel paths remain harmless cleanup outcomes that clear the transient session without changing the committed workspace tree.
- `src/app/AppShell.test.tsx` now proves successful release-time split commit, under-threshold release cancel, and post-preview pointer-cancel cleanup alongside the existing preview-orientation coverage.

#### Current Live Read

- `src/app/AppShell.tsx` now owns the whole split-corner gesture lifecycle through preview, but `handleViewportSplitCornerPointerUp(...)` still only clears the transient session, which is the narrowest honest seam for adding release-time commit without reopening preview ownership.
- The AppShell-local preview VM already resolves one transient `orientation`, `anchorEdge`, `paneArea`, and candidate `ratio`, so Phase 4 should reuse that exact read on release instead of recomputing a second commit-time orientation model.
- `src/app/workspace/useWorkspaceStore.ts` already exposes `splitViewportSlot(slotId, splitDockSide, options)` as the canonical shared-workspace split-creation helper, including child ordering, split-direction derivation, and ratio clamping through `preferredRatio`, so the next pass should route real split creation through that owner instead of mutating `viewportLayoutNodesById` inline from AppShell.
- `src/app/workspace/useWorkspaceStore.ts` also already exposes `setViewportLayoutSplitRatio(...)`, which means the new release-time flow can create the split through the existing owner and then preserve the previewed ratio through the same settled split-ratio seam instead of inventing a corner-gesture-only ratio write path.
- `src/app/AppShell.test.tsx` already proves preview orientation and ratio stay transient through release in Phase 3, so the next pass needs to replace that release outcome only when threshold is met while keeping under-threshold release and pointer cancel harmless.

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Extend the AppShell-local release handler so `pointerup` checks the active transient preview VM and commits only when the gesture both crossed the deadzone and meets one explicit minimum split threshold.
2. Map the transient preview orientation plus anchor edge back to one real `WorkspaceSplitDockSide` and call the existing `splitViewportSlot(...)` helper against the addressed slot instead of mutating the layout tree directly in AppShell.
3. Reapply the previewed ratio through the existing split-ratio owner seam after the split is created so the committed result matches the visible preview as closely as the settled clamps allow.
4. Keep under-threshold release, stale-node release, and pointer-cancel paths as no-mutation cleanup outcomes that simply clear the transient session.
5. If `Escape` cancel can be added cleanly through the existing captured-session seam without widening the owner model, allow it; otherwise keep that exact key-path explicitly deferred.

#### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.test.tsx`

#### No-Widening Rule

- Do not widen into Browser/project-content render truth or unrelated workspace polish outside this corner-split family.
- Do not widen into popup workspace shell parity in this phase.
- Do not spend this pass on final regression-proof expansion beyond the exact commit or cancel behavior.

#### Implementation Risks

- The commit path needs to resolve the correct target slot from the previewed pane without guessing; if it targets the wrong leaf, the visible preview and committed split will disagree.
- `splitViewportSlot(...)` creates a new split node id internally, so the release flow must locate the resulting split node carefully before applying the preview ratio through `setViewportLayoutSplitRatio(...)`.
- If under-threshold release and pointer-cancel diverge, the user could get accidental tiny splits or stale preview cleanup leaks; both paths should stay explicitly harmless.
- Over-tight threshold rules could make the visible preview feel dishonest if a clearly shown preview still cancels on release; the minimum threshold should stay small and explicit.

#### Checklist

- [x] Reuse the AppShell-local preview VM on release instead of deriving a second commit-time orientation model.
- [x] Map the preview orientation plus anchor edge to one real `WorkspaceSplitDockSide`.
- [x] Commit the split through the shared workspace split owner seam instead of mutating the layout tree inline.
- [x] Reapply the previewed ratio through the existing split-ratio owner seam.
- [x] Cancel under-threshold and aborted gestures without mutating the workspace tree.
- [x] Add focused tests for successful commit, under-threshold release cancel, and pointer-cancel cleanup after preview entry.

#### Verification Shape

- focused gesture test for release-time vertical or horizontal commit
- focused gesture test for under-threshold release cancel with no tree mutation
- focused gesture test for pointer-cancel cleanup staying non-committing after preview entry

## [x] `Workspace-9 / Phase 5` - `Gesture Regression Proof And Resize Continuity`

### Phase 5 Summary

#### Purpose

Close the shared-workspace gesture lane cleanly by proving the committed split still behaves like every other shared split before any popup-shell parity decision is allowed to widen the family.

#### Owns

- regression proof after the new corner gesture commits real splits
- post-commit divider resize continuity checks

#### Does Not Own

- popup-shell parity follow-through or deferral
- a broader popup-shell redesign
- new merge, join, or advanced area-management gestures

#### First Pass Decisions

- Keep the final proof focused on behavior, not on restating the whole family vision.
- Keep popup parity out of this pass entirely so the proof bar stays small and unambiguous.

#### Current Live Read

- `src/app/AppShell.test.tsx` now already proves under-threshold release cancel, post-preview pointer cancel, transient preview orientation, and one successful release-time commit, which means Phase 5 should add only the smallest remaining proofs instead of replaying the whole gesture ladder.
- The landed corner-gesture commit path in `src/app/AppShell.tsx` now routes through `splitViewportLayoutNode(...)` and then reuses `setViewportLayoutSplitRatio(...)`, so the most important remaining risk is no longer "can it commit?" but "does the committed result behave like every other shared split afterward?"
- `src/app/workspace/WorkspaceViewportTree.tsx` still renders all committed shared splits through the same `ViewportSplitDivider` seam used by ordinary workspace resizing, so resize continuity can be proven at the shared divider shell rather than by adding any corner-gesture-specific resize behavior.
- `src/app/AppShell.test.tsx` already contains divider-resize coverage for ordinary workspace splits, which means the next proof pass can focus on one committed corner-created split and verify that dragging the resulting divider still mutates the split ratio through the same settled path.
- No new runtime owner seams are missing for the shared workspace gesture lane, so this phase should remain test-first unless one tiny cleanup is exposed while proving the post-commit behavior.

### Phase 5 Result

- `src/app/AppShell.test.tsx` now closes the shared split-corner ladder with one focused regression proof for a committed corner-created split and one continuity proof that the resulting divider still resizes through the same shared `ViewportSplitDivider` path as any ordinary workspace split.
- The continuity proof now explicitly respects the settled `0.15` to `0.85` split-ratio clamp already owned by `setViewportLayoutSplitRatio(...)`, so the final regression bar matches the actual shared workspace contract instead of inventing a corner-only resize expectation.
- `src/app/workspace/WorkspaceViewportTree.tsx` now exposes stable `data-workspace-layout-node-id` and `data-workspace-divider-node-id` hooks on shared split layouts and dividers so the proof can target the committed nested split honestly without guessing by DOM order.
- Popup workspace parity remains explicitly deferred to `Phase 6`.

### Phase 5 Implementation Spec

#### Exact First Code Cut

1. Add one focused regression test proving that a split created through the filleted corner gesture leaves the workspace tree in the same stable shape expected from any ordinary shared split.
2. Add one focused continuity test proving that the divider produced by a corner-created split still resizes through the existing `ViewportSplitDivider` plus `setViewportLayoutSplitRatio(...)` path.
3. Reuse the current split-corner helper setup in `AppShell.test.tsx` rather than introducing a second special test harness for corner commits.
4. Only if the proofs expose a tiny behavior mismatch, land the smallest repair needed to keep the committed corner-created split behavior aligned with ordinary shared splits.

#### Likely Files

- `src/app/AppShell.test.tsx`
- optional only if a proof exposes one small shared-behavior mismatch:
  - `src/app/AppShell.tsx`
  - `src/app/workspace/WorkspaceViewportTree.tsx`
  - `src/app/workspace/useWorkspaceStore.ts`

#### No-Widening Rule

- Do not widen into popup-shell convergence or parity decisions in this phase.
- Do not reopen preview-orientation or release-commit feature work unless one tiny repair is required to keep the shared split behavior honest.

#### Implementation Risks

- A corner-created split can pass the current commit test but still diverge subtly in final ratio or child ordering once the divider is dragged afterward, so the proof needs to inspect the post-resize split node instead of only trusting DOM presence.
- If the proof reuses generic divider tests without first creating the split through the corner gesture, it will miss exactly the continuity risk this phase is supposed to close.
- Over-expanding the proof matrix into every preview orientation and cancel branch again would turn this pass back into feature retesting instead of the one missing regression bar.

#### Checklist

- [x] Add one focused regression proof for a committed corner-created split.
- [x] Add one focused continuity proof that the resulting divider still resizes through the existing shared path.
- [x] Keep the proof centered on the already-shipped shared workspace lane only.
- [x] Land only the smallest repair if a real shared-behavior mismatch is exposed.

#### Verification Shape

- focused regression test for one committed corner-created split
- focused continuity test that the resulting divider still resizes through the existing shared divider behavior

#### Done Shape

- one committed corner-created split now has a stable regression proof in the shared AppShell test lane
- the resulting divider still resizes through the ordinary shared split-ratio owner path after commit
- the shared gesture lane is now closed cleanly enough to hand forward only into the popup parity or explicit deferral decision

## [x] `Workspace-9 / Phase 6` - `Popup Workspace Parity Decision`

### Phase 6 Summary

#### Purpose

Decide whether popup workspace shell parity is already a tiny shared follow-through or should stay explicitly deferred after the shared workspace gesture lane is otherwise complete.

#### Owns

- explicit popup-shell parity decision or deferral
- popup follow-through only if the shell reuse is already small, shared, and obvious
- final family closeout language for popup scope honesty

#### Does Not Own

- the core shared-workspace gesture proof already covered by `Phase 5`
- a broader popup-shell redesign
- new merge, join, or advanced area-management gestures

#### First Pass Decisions

- If popup parity is not obviously small and shared, defer it explicitly instead of smuggling a second shell cleanup into the same pass.
- Prefer one honest recorded deferral over a widened shell-convergence surprise.

#### Current Live Read

- `src/app/workspace/PopupWorkspaceShell.tsx` still owns its own popup-local zustand store, split-node creation, and split-ratio clamp path through `createPopupWorkspaceStore(...)`, `splitViewportSlot(...)`, and `setViewportLayoutSplitRatio(...)` instead of reusing the shared workspace owner seams shipped for the main AppShell lane.
- The popup shell also still renders its split tree inline inside `PopupWorkspaceShell.tsx` with its own `ViewportSplitLayout`, `ViewportSplitPane`, and divider markup, which means split-corner parity is not automatically inherited from `WorkspaceViewportTree.tsx`.
- The popup divider-resize path is already structurally similar to the shared workspace divider path, but it is still popup-local code today, so the next pass needs to decide whether the corner gesture can be reused cheaply or whether popup should stay explicitly deferred.
- `Workspace-9 / Phase 1` through `Phase 5` already closed the shared AppShell lane with hotspot, preview, commit, and continuity proof, so `Phase 6` should stay strictly about popup-shell parity truth and must not reopen the settled main-workspace contract.
- The vision rule that the workspace should stay one hybrid surface model still argues for eventual parity, but the replacement-path rule also means popup-local behavior should not be widened casually if the shared seam is not already close enough.

### Phase 6 Result

- Popup workspace parity is explicitly deferred rather than landed in `Workspace 9`.
- The blocking seams are now named clearly:
  - `src/app/workspace/PopupWorkspaceShell.tsx` still owns a popup-local zustand store through `createPopupWorkspaceStore(...)` instead of consuming the shared AppShell workspace owner path
  - popup split-node creation and ratio writes still flow through popup-local `splitViewportSlot(...)` and `setViewportLayoutSplitRatio(...)`
  - the popup split tree is still rendered inline in `PopupWorkspaceShell.tsx` instead of reusing `WorkspaceViewportTree.tsx`, so corner hotspots, preview VM paint, and release commit would require a second gesture owner or a larger shell convergence pass
- Because that popup follow-through is not already tiny and shared, landing parity here would violate the `Workspace 9` no-widening rule and the broader replacement-path guidance in the vision docs.
- `Workspace 9` now closes honestly as the shipped shared-workspace filleted-corner split-authoring family, with popup parity left for a later dedicated convergence or reuse phase if it becomes worth the extraction cost.

### Phase 6 Implementation Spec

#### Exact First Code Cut

1. Read `PopupWorkspaceShell.tsx` against the shipped shared split-corner contract and decide whether the popup split tree can consume the same corner-hotspot, preview, and release-commit behavior with only a small local adapter.
2. If parity is already tiny and shared, land only that narrow follow-through and add one focused popup proof instead of building a second popup-only gesture model.
3. If parity is not already tiny and shared, record the explicit deferral in this family doc and index, naming the popup-local owner seams that still block honest reuse.
4. Close the Workspace 9 family honestly either way: shipped shared-workspace gesture lane plus popup parity landed, or shipped shared-workspace gesture lane plus popup parity explicitly deferred.

#### Likely Files

- `src/app/workspace/PopupWorkspaceShell.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/AppShell.tsx`
- optional focused popup proof only if parity actually lands:
  - `src/app/AppShell.test.tsx`
- optional planning follow-through only if parity stays deferred:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-9 - Filleted Corner Split Drag Authoring.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

#### No-Widening Rule

- Do not widen into broader popup-shell convergence work if the parity read is not already tiny and obvious.
- Do not reopen the shared-workspace gesture implementation questions already closed by `Phase 5`.
- Do not silently fork a popup-only corner-gesture state owner just to say parity landed.

#### Implementation Risks

- The popup shell's local store and inline split-tree renderer may make "small parity" look cheaper than it really is; if the follow-through needs shared-owner extraction first, it is no longer a Phase 6-sized cut.
- A popup-specific corner gesture that does not share the settled AppShell contract would violate the family direction even if it superficially matches the UI behavior.
- Over-deferring without naming the exact blocking seams would leave the family closed but still ambiguous about why popup was not included.

#### Checklist

- [x] Read popup shell against the shipped shared split-corner contract.
- [x] Decide honestly whether popup parity is already tiny and shared.
- [x] If tiny, land the narrow parity follow-through plus one focused popup proof.
- [x] If not tiny, record the explicit deferral and the blocking popup-local owner seams.
- [x] Close the Workspace 9 family honestly without reopening shared-workspace gesture scope.

#### Verification Shape

- focused parity test only if popup-shell follow-through actually lands in this phase
- otherwise one explicit doc-level deferral read that keeps popup scope honest

#### Done Shape

- popup parity is either landed through a genuinely small shared follow-through or explicitly deferred with named blocking seams
- the shared Workspace 9 gesture family closes without pretending popup reuse is simpler than the code says it is

## [x] `Workspace-9 / Phase 7` - `Settings-Owned Workspace Corner Radius Preference`

### Phase 7 Summary

#### Purpose

Create the real user-facing owner for workspace corner radius by adding one persisted Settings preference and one Settings workspace control before the shared shell starts consuming live user values.

#### Owns

- persisted preference ownership for workspace corner radius
- default-value definition and Settings read/write behavior
- one Settings workspace slider or equivalent control surface

#### Does Not Own

- final shared workspace pane-shell consumption of the live preference
- popup workspace parity
- split-corner gesture behavior changes

#### Current Live Read

- `Workspace-9 / Phase 1` already left one parameterized `--workspace-pane-fillet-radius` seam in the shared pane shell, but that seam still reads like a static shell constant instead of a Settings-owned user preference.
- The actual Settings workspace now exists separately from the original split-corner implementation lane, which means the radius owner can be added through the real Settings surface instead of being hidden in theme-only constants.
- `src/app/workspace/SettingsSurface.tsx` already has a real `Workspace` section and already uses `useUiPrefsStore(...)` plus existing control widgets such as `ParaSlider`, which makes the next honest cut a direct owner-backed Settings-row addition rather than a new shell pattern.
- `src/app/store/uiPrefsStore.ts` is already the persisted UI-preference owner for other shared workspace-facing defaults, so the corner-radius preference should be added there instead of inventing a second workspace-visual preference store.
- `Settings-1 / Phase 4 - General And Workspace Controls` already names shared workspace fillet radius as part of the later Settings ladder, so `Workspace-9 / Phase 7` should align to that owner phase instead of creating a parallel Settings plan.
- The next honest first cut is to create one preference owner plus Settings UI first, because folding stored preference ownership and workspace-shell consumption into the same pass would blur two different responsibilities.

### Phase 7 Result

- `src/app/store/uiPrefsStore.ts` now owns one persisted `workspacePaneFilletRadiusPx` preference with a default radius plus clamp boundaries, keeping the corner-radius source in the normal UI-preferences owner instead of inventing a second workspace-visual store.
- `src/app/store/uiPrefsPersistence.ts` plus `src/app/store/useUiPrefsPersistenceBridge.ts` now persist and hydrate that preference through the existing UI-preferences storage path.
- `src/app/store/uiPreferenceEditHistory.ts` now wraps workspace corner-radius changes in the same owner-backed edit-history seam used by the other Settings-backed preferences.
- `src/app/workspace/SettingsSurface.tsx` now exposes one real `Workspace corner radius` slider inside the existing `Workspace` section while leaving the shared workspace pane shell unchanged until `Phase 8`.
- `src/app/workspace/SettingsSurface.test.tsx`, `src/app/store/uiPrefsStore.test.ts`, and `src/app/store/useUiPrefsPersistenceBridge.test.tsx` now prove the new preference owner, persistence, and Settings-surface editing path.

### Phase 7 Implementation Spec

#### Exact First Code Cut

1. Add one persisted workspace corner-radius preference in the Settings owner path with a clear default value.
2. Add one editable row in the existing `Workspace` section of `SettingsSurface.tsx` using the current Settings control language, most likely `ParaSlider`, so the new preference appears alongside the other owner-backed workspace controls instead of behind a new section shape.
3. Expose the preference through the normal `uiPrefsStore` seam so later shared-workspace shell consumption can stay small and read-only from that settled owner.
4. Stop before the shared workspace shell actually changes visual radius from the live preference, except for the minimum plumbing needed to make the next pass straightforward.

#### Likely Files

- `src/app/store/uiPrefsStore.ts`
- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Settings/Future/Settings-1 - Unreal-Style Settings Shell And Section Router.md`

#### No-Widening Rule

- Do not widen into broader Settings cleanup or unrelated Settings sections in this phase.
- Do not widen into shared workspace visual behavior changes; leave all live shell consumption to `Phase 8`.
- Do not reopen popup parity or split-corner gesture behavior.

#### Implementation Risks

- If the preference lands outside `uiPrefsStore`, `Phase 8` will inherit a second visual owner and the later shell read will be messier than necessary.
- If the Settings control is added as a special-case one-off block instead of inside the existing `Workspace` section pattern, the phase will solve the slider but weaken the new Settings workspace contract.
- If this pass starts driving the live workspace shell immediately, it will collapse the intended owner-then-consumer split and make verification less honest.

#### Checklist

- [x] Add one persisted workspace corner-radius preference owner.
- [x] Add one Settings workspace control for that preference.
- [x] Keep the control inside the existing `Workspace` section pattern.
- [x] Keep the first pass focused on owner state and Settings UI only.
- [x] Leave shared workspace shell consumption to `Phase 8`.

#### Verification Shape

- focused Settings proof that the preference can be changed and persists through the existing owner path
- focused Settings surface proof that the slider reflects the stored value

#### Done Shape

- one persisted Settings-owned workspace corner-radius preference exists in `uiPrefsStore`
- the Settings workspace exposes one real `Workspace` slider for that preference
- the shared workspace shell still remains unchanged until `Phase 8`

## [x] `Workspace-9 / Phase 8` - `Shared Workspace Corner Radius Consumption`

### Phase 8 Summary

#### Purpose

Finish the user-facing corner-radius story by wiring the Settings-owned preference into the existing shared workspace fillet seam and proving the corner affordance still behaves correctly across real radius values.

#### Owns

- shared workspace shell consumption of the stored corner-radius preference
- hotspot and fillet-shell visual follow-through under live user-adjustable values
- focused proof that the corner affordance still renders and behaves correctly

#### Does Not Own

- the Settings preference owner itself beyond using its settled read model
- popup workspace parity
- new split-corner gesture rules

#### Current Live Read

- `src/app/workspace/WorkspaceViewportTree.tsx` now reads the shipped `workspacePaneFilletRadiusPx` preference and applies it directly to each shared `ViewportSplitPane--filletedShell` wrapper through the existing `--workspace-pane-fillet-radius` style seam.
- `src/app/theme/foundation/base.css` already provides the canonical shared seam with `--workspace-pane-fillet-radius: 12px;` on `.ViewportSplitPane--filletedShell`, and both the pane shell and nested `ViewportFrame` already consume that variable.
- `src/app/store/uiPrefsStore.ts` continues to own the persisted `workspacePaneFilletRadiusPx` value from `Phase 7`, so the live workspace shell now consumes the existing owner without inventing another settings or theme seam.
- `src/app/AppShell.test.tsx` now also proves the shared filleted shell updates at smaller and larger radius values while split-corner hotspot entry still behaves correctly in the same shared-workspace harness.
- The split-corner gesture lane itself remains unchanged; this phase only closes the live shared-shell visual consumption seam.

### Phase 8 Implementation Spec

#### Exact First Code Cut

1. Read the Settings-owned workspace corner-radius preference into the shared split-pane shell.
2. Apply that value through the existing `--workspace-pane-fillet-radius` seam by setting the smallest possible shared pane-shell style surface, preferably directly on `ViewportSplitPane--filletedShell`.
3. Recheck the split-corner hotspot footprint and filleted pane-shell visuals across a couple of radius values without changing the shipped gesture logic.
4. Add focused proof that the shared workspace corner shell updates from the stored preference and that split-corner hotspot availability plus gesture entry still behave correctly after the radius changes.

#### Likely Files

- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`
- `src/app/store/uiPrefsStore.ts` only if the live read exposes one tiny selector or helper gap during consumption

#### No-Widening Rule

- Do not widen into a second preference owner.
- Do not widen into popup shell parity or broader shell-convergence work.
- Do not widen into new gesture thresholds, new preview logic, or new split mutation behavior.
- Do not reopen the shipped split-corner gesture model unless the live radius read exposes one tiny affordance regression.

#### Implementation Risks

- If the shared workspace reads the stored radius through a broader shell owner than the existing pane wrapper, `Phase 8` will widen beyond the honest final follow-through seam.
- If the live radius only updates the pane shell but not the nested frame that already consumes the shared CSS variable, the fillet treatment can drift visually across the same pane.
- If larger or zero-radius values shift hit-target placement or hotspot legibility, the phase can regress the already-shipped split-corner affordance even though the split-tree logic stays unchanged.

#### Checklist

- [x] Read the stored corner-radius preference into the shared workspace shell.
- [x] Apply it through the existing fillet seam.
- [x] Recheck hotspot footprint and shell visuals at at least one smaller and one larger real radius value.
- [x] Add focused proof that the shared workspace updates correctly at real preference values.
- [x] Add focused proof that split-corner hotspot availability and gesture entry still behave correctly after the radius changes.
- [x] Keep the split-corner behavior otherwise unchanged.

#### Verification Shape

- focused shared-workspace proof that the fillet radius updates from the stored Settings preference
- focused split-corner affordance proof that hotspot availability and gesture entry still behave correctly after the radius is changed

#### Done Shape

- the shared workspace pane shell reads the persisted `workspacePaneFilletRadiusPx` preference through the existing fillet CSS-variable seam
- changing the Settings slider changes the shared workspace fillet treatment without inventing a second owner
- split-corner hotspot rendering and gesture entry still behave like the already-shipped shared gesture lane
- popup workspace remains intentionally unchanged

## [x] `Workspace-9 / Phase 9` - `Main Model Viewport Outer-Corner Split Entry`

### Phase 9 Summary

#### Purpose

Finish the root-workspace follow-through by letting the unsplit main model viewport start the shared split-corner gesture from its exposed outer filleted corners instead of requiring a pre-existing split first.

#### Owns

- widening root shared-workspace split-corner eligibility beyond divider-adjacent panes
- keeping root outer-corner entry on the same shared AppShell gesture, preview, and commit contract
- focused proof that the root viewport and already-split panes both expose the widened shared corner contract honestly

#### Does Not Own

- a second root-only split-authoring model
- popup workspace parity
- new ratio-clamp, preview-orientation, or divider-resize behavior

#### Current Live Read

- `src/app/workspace/WorkspaceViewportTree.tsx` now reuses the shared filleted split-pane shell for the unsplit root primary model viewport instead of limiting the corner shell to already-split nodes.
- The shared split-corner contract has since widened further than the original `bottomRight` follow-through: the root main viewport now exposes all four outer corners, and already-split panes now expose outside plus inside corners through the same shared shell.
- `src/app/AppShell.tsx` still owns the real gesture session, preview, and release-time commit, so the root widening remains a shared owner follow-through rather than a second gesture model.
- The remaining risk after this phase is not root availability itself, but keeping pane ownership, suppression rules, and shell-layer reads consistent now that many more visible corners can start the same gesture.

### Phase 9 Result

- `src/app/workspace/WorkspaceViewportTree.tsx` now reuses the existing shared filleted split-pane shell for the unsplit root primary model viewport, exposes all four root outer split-entry corners, and also exposes the same shared corners across already-split panes so outer and inner fillets stay available through one contract.
- `src/app/AppShell.tsx` now widens the existing split-corner eligibility seam so the shared gesture session, preview, and commit path accept root primary-model entry without forking a second authoring flow.
- `src/app/workspace/WorkspaceViewportTree.test.tsx` and `src/app/AppShell.test.tsx` now prove the widened contract across both root and already-split panes, including top-corner entry and the continued shared release-to-commit path.

### Phase 9 Implementation Spec

#### Exact First Code Cut

1. Reuse the existing shared filleted split-pane shell for the unsplit root primary model viewport.
2. Widen hotspot eligibility so the root primary model viewport can expose honest outer split-entry corners through that same shell.
3. Keep the live AppShell gesture, preview, and release-time commit path unchanged except for the tiny eligibility widening needed to accept the new root entry case.
4. Add focused proof for root outer-corner entry while preserving the already-shipped split-pane corner contract.

#### Likely Files

- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx`
- `src/app/AppShell.test.tsx`

#### No-Widening Rule

- Do not invent a root-only split authoring seam.
- Do not widen into popup parity.
- Do not reopen the settled preview orientation, threshold, or divider-resize owners.
- Keep shell-suppression and visual cleanup follow-through for later phases if the widening exposes new edge cases.

#### Implementation Risks

- If root outer-corner entry forks a second gesture path, the later cleanup burden will grow immediately.
- If widened eligibility is still inferred from old divider-adjacent assumptions, later outside-corner entry can preview or commit against the wrong pane.
- If shell chrome or dock occupancy conflicts are hidden rather than named, later visual cleanup will be harder to reason about honestly.

#### Checklist

- [x] Reuse the shared split-corner pane shell for the unsplit root primary model viewport.
- [x] Widen hotspot eligibility so root outer corners can start the shared gesture path.
- [x] Keep the existing AppShell preview and release-time commit owner path.
- [x] Add focused proof for root outer-corner entry.
- [x] Leave shell-conflict cleanup and popup parity to later explicit phases.

#### Verification Shape

- focused root-workspace proof for outer-corner split entry
- focused shared-gesture proof that top-corner and already-split-pane entry still use the same release-time commit path

#### Done Shape

- the unsplit root primary model viewport can start the shared split-corner gesture from its outer filleted corners
- already-split panes continue to use the same shared gesture path
- the root widening lands without inventing a second split-authoring model

## [x] `Workspace-9 / Phase 10` - `Explicit Pane Ownership And Target Routing Cleanup`

### Phase 10 Summary

#### Purpose

Clean up the widened corner contract by making pane ownership explicit everywhere the shared split-corner gesture is routed, so outside-corner entry can never preview or split the wrong pane after the first split.

#### Owns

- explicit pane-target ownership for shared split-corner handlers
- preview and release-time commit routing that stays attached to the pane subtree whose corner was actually clicked
- focused regression proof for left-pane versus right-pane corner ownership after the widened outside-corner contract

#### Does Not Own

- broader shell-visual cleanup
- popup workspace parity
- new gesture thresholds, preview rules, or divider-resize behavior

#### Current Live Read

- `src/app/workspace/WorkspaceViewportTree.tsx` now already passes `targetNodeId: childNodeId` plus the pane area directly through `renderSplitCornerPaneShell(...)`, and `Workspace-9 / Phase 10` keeps that explicit child-pane owner seam as the only target path instead of letting parent-split inference drift back in.
- `src/app/AppShell.tsx` now validates split-corner eligibility through `resolveViewportSplitCornerTargetNodeId(...)`, which reduces the old context helper down to the real remaining responsibility: validating that the clicked node is an eligible target leaf and that the root case still belongs only to the primary model viewport.
- The split-corner preview VM now only carries the explicit `targetNodeId` rather than both a generic `nodeId` and a separate target field, so the preview path reads more honestly as one pane-target contract.
- `src/app/AppShell.test.tsx` now proves both sides of the widened contract by routing a left-pane `topLeft` gesture and a right-pane `topRight` gesture to their own panes through `data-workspace-split-node-id`, leaving shell-visibility cleanup as the remaining `Phase 11` follow-through instead of more pane-target logic.

### Phase 10 Result

- `src/app/AppShell.tsx` now routes split-corner eligibility and preview through the explicit target-leaf seam without the old context-object indirection, and the preview model now names only the real pane target it will split.
- `src/app/workspace/WorkspaceViewportTree.tsx` continues to be the single source of explicit child-pane target identity for every visible corner handle, with no return to corner-position or parent-split target inference.
- `src/app/AppShell.test.tsx` now widens the regression proof beyond the original left-pane repro and covers the opposite right-pane outer-corner case as a shared ownership rule.

### Phase 10 Implementation Spec

#### Exact First Code Cut

1. Keep the already-landed child-pane `targetNodeId` plus `paneArea` contract explicit all the way through the shared split-corner path and tighten any naming or helper seams that still make the routing read more inferred than it really is.
2. Reduce or retire the remaining thin `resolveViewportSplitCornerContext(...)` residue in `AppShell.tsx` if it no longer adds meaningful ownership logic beyond leaf validation and root eligibility checks.
3. Keep held gesture state, transient preview, and release-time commit bound to that same explicit pane target without reopening the settled preview or ratio logic.
4. Add at least one more opposite-pane sanity proof so the widened outside-corner contract is covered as a shared ownership rule instead of one bug-specific regression.

#### Likely Files

- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/WorkspaceViewportTree.test.tsx` only if the ownership cleanup changes how pane-target data should be asserted at the shared shell seam

#### No-Widening Rule

- Do not restyle the shell in this phase except for tiny test-targeting or ownership-hook needs.
- Do not widen into popup parity.
- Do not change settled preview thresholds, hysteresis, or divider behavior.
- Do not re-solve already-shipped wrong-pane behavior by adding corner-specific branching when the explicit pane-target seam can stay shared.

#### Implementation Risks

- If any routing helper still subtly infers pane ownership from corner position, the regression can reappear in another split orientation even though the first left-pane case is fixed.
- If the explicit child-pane seam stays buried behind thin helper indirection, later cleanup work may accidentally reintroduce parent-split targeting because the real owner contract is harder to read than it needs to be.
- If tests continue to prove only one repaired left-pane case and many generic top-right flows, later corner widening can regress silently on the opposite side or in nested panes.

#### Checklist

- [x] Tighten the already-landed explicit owning-pane shell contract so it reads as one settled shared target path instead of a thin compatibility layer.
- [x] Keep held gesture state bound to that owning pane.
- [x] Keep preview and release-time commit bound to that same pane.
- [x] Remove or bypass old inferred-target assumptions that no longer match the widened corner contract.
- [x] Add focused regression proof for wrong-pane preview and commit, including at least one opposite-pane sanity read beyond the original left-pane case.

#### Verification Shape

- focused regression test that a left-pane outer-corner gesture previews the left pane instead of the right pane
- focused release-time proof that the resulting real split is attached to that same pane subtree
- focused opposite-pane sanity proof that the shared routing contract still holds when the user starts from the other visible pane

#### Done Shape

- outside-corner entry always previews and commits against the pane whose corner was clicked
- the widened split-corner contract no longer depends on brittle corner-position inference or leftover thin helpers that obscure the real explicit target seam
- the shared AppShell gesture path remains the only owner

## [x] `Workspace-9 / Phase 11` - `Shared Corner Contract And Shell-Layer Consistency`

### Phase 11 Summary

#### Purpose

Finish the shared-workspace cleanup after the widened corner rollout by unifying visibility, layering, and behavior rules so all four corners stay available on every viewport and still read like one honest affordance even under extreme workspace fillet-radius values.

#### Owns

- shared-workspace all-four-corners visibility rules across root and already-split panes
- top-versus-bottom split-corner visual and layering consistency
- final shell-read cleanup so the visible corner language matches the actual split behavior contract

#### Does Not Own

- popup workspace parity
- new split gesture semantics
- broader dock redesign beyond the minimum needed to keep corner ownership honest

#### Current Live Read

- `src/app/theme/foundation/base.css` remains the shared split-corner affordance owner with the already-landed raised top-corner layering, brightened glyphs, and radius-scaled hit area, so the Phase 11 cleanup stays about consistency rather than more gesture-reachability repair.
- `src/app/workspace/WorkspaceViewportTree.tsx` now keeps the unified contract explicit again by exposing `topLeft`, `topRight`, `bottomLeft`, and `bottomRight` on the unsplit root primary viewer and on already-split panes without a primary-viewport occupancy exception.
- `src/app/theme/shell/docks.css` still leaves the primary left dock living in the main viewport's top-left shell region, but the clarified product rule is that this visual crowding does not remove that split handle; the fix in this correction is therefore contractual consistency, not suppression.
- `src/app/workspace/WorkspaceViewportTree.test.tsx` now proves the all-four-corners shell contract directly by expecting four root corners and eight total corners once the primary pane and one sibling pane are both visible, while `src/app/AppShell.test.tsx` keeps the shared routing proof alive through the restored left-pane `topLeft`, right-pane `topRight`, unsplit-root, and radius-stress gesture paths.

### Phase 11 Result

- `src/app/workspace/WorkspaceViewportTree.tsx` now keeps all four split corners visible on every viewport, including the primary viewer's `topLeft`, so the final contract is consistent instead of making the primary pane a structural exception.
- `src/app/theme/foundation/base.css` and `src/app/theme/shell/docks.css` stay unchanged in this corrected closeout because the earlier top-layer and glyph work was already enough to preserve reachability while the product rule remains four always-visible split points.
- `src/app/workspace/WorkspaceViewportTree.test.tsx` and `src/app/AppShell.test.tsx` now make the shell contract explicit in proof by checking four-corner hotspot counts plus no-regression routing on restored `topLeft` and existing right-side/root gesture paths.

### Phase 11 Implementation Spec

#### Exact First Code Cut

1. Audit the live shared split-corner shell against the actual top titlebar layer, the primary left dock occupancy seam, and a large-radius workspace-corner stress case so the phase starts from concrete shell conflicts instead of taste.
2. Decide whether the clarified contract is four always-visible corners or a structural occupied-corner exception, then make the runtime and proof surfaces match that rule exactly.
3. Tighten the visible top-versus-bottom glyph layering and presentation in `base.css` as much as possible without changing the settled hit area or reopening split behavior.
4. Add focused proof for any structural corner-visibility or suppression rule that becomes part of the shared workspace contract.

#### Likely Files

- `src/app/theme/foundation/base.css`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/theme/shell/docks.css` only if the clarified all-four-corners contract later needs a more deliberate dock overlap presentation rule
- `src/app/AppShell.test.tsx` if structural visibility rules need proof
- `src/app/workspace/WorkspaceViewportTree.test.tsx` if hotspot eligibility changes again

#### No-Widening Rule

- Do not reopen pane-ownership routing once `Phase 10` lands.
- Do not widen into popup-workspace convergence.
- Do not turn this into a broader dock-layout redesign.
- Do not treat “all four corners always visible” as untouchable if the shell read is dishonest; this phase is allowed to suppress corners, but only when the visible contract becomes clearer.

#### Implementation Risks

- If visibility stays maximally wide without honest suppression rules, some corners will still look equally available even when titlebar or dock ownership makes one corner feel like a different kind of control.
- If suppression is too aggressive or too one-off, the shared corner contract can become inconsistent across panes for reasons the user cannot read from the shell itself.
- If top and bottom corner layering remain visually divergent, especially at very large fillet-radius values, the split gesture can still feel unreliable even though the runtime behavior is now correct.
- If the phase relies only on current routing tests, structural corner-visibility drift can sneak back in because the proof surface still mostly exercises behavior rather than shell-read rules.

#### Checklist

- [x] Audit the shared corner shell against titlebar, dock, and large-radius cases.
- [x] Define honest visibility versus suppression rules for occupied corners, especially the crowded main-viewport `topLeft` case.
- [x] Tighten top-versus-bottom corner layering and glyph consistency.
- [x] Keep the gesture hit area stable while the visible corner language is cleaned up.
- [x] Add focused proof for any structural shell-contract rules that change.

#### Verification Shape

- focused shell-read proof for any occupied-corner suppression or visibility rule
- focused large-radius sanity read so top and bottom corners still feel like one shared affordance
- focused no-regression read that structural corner-shell cleanup does not reopen the settled shared split routing behavior from `Phase 10`

#### Done Shape

- visible corners now match the real split-authoring contract more honestly because the occupied primary `topLeft` corner is no longer presented as a peer split handle
- top and bottom corner affordances still share one workspace language without another CSS fork or hit-area change
- the remaining shared-workspace corner cleanup is no longer living only in chat observations, and `Workspace 9` closes again as a complete shared-workspace family

### Phase 11 Correction

- The final product rule is now explicit: all four split points stay visible on every viewport at all times, including the primary viewer `topLeft` corner.
- The temporary occupied-corner suppression read from the first Phase 11 closeout is superseded by the user-confirmed all-four-corners contract.
- The live runtime and proof surfaces now match that clarified rule: root and already-split panes both expose `topLeft`, `topRight`, `bottomLeft`, and `bottomRight`, while the shared split gesture path from `Phase 10` stays unchanged.

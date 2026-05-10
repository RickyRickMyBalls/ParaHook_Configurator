# Workspace Phase Workspace-9 - Filleted Corner Split Drag Authoring

## Doc Header

### Doc History
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
- [ ] `HLG 5. Let the filleted workspace-corner radius be user-adjustable through the Settings workspace instead of forcing one permanent visual radius.`
- [ ] Add one persisted Settings-owned preference for the shared workspace corner radius.
- [ ] Add one Settings workspace slider and default-value read for that preference.
- [ ] Keep this phase focused on owner state, Settings UI, and plumbing, not on the final shared workspace shell consumption.

### `Workspace-9 / Phase 8`
- [ ] `HLG 5. Let the filleted workspace-corner radius be user-adjustable through the Settings workspace instead of forcing one permanent visual radius.`
- [ ] Read the stored Settings-owned radius preference into the shared workspace pane shell.
- [ ] Reapply the existing fillet seam and hotspot visuals against real user-adjustable values.
- [ ] Add focused proof that changing the preference updates the shared workspace corner shell without breaking split-corner affordance behavior.

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

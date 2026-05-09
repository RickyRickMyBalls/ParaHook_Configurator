# Workspace Phase Workspace-9 - Filleted Corner Split Drag Authoring

## Doc Header

### Doc History
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
- [ ] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [ ] Add temporary corner-drag session state with pointer capture and deadzone handling.
- [ ] Keep `pointerdown` non-mutating while establishing the later preview entry seam.
- [ ] Add the first cancel path for aborted gesture-state cleanup before any real split is committed.

### `Workspace-9 / Phase 3`
- [ ] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [ ] `HLG 3. Let horizontal versus vertical split direction be chosen naturally from whichever absolute pointer movement is larger so the user can switch easily while dragging.`
- [ ] Derive orientation from dominant absolute `x` versus `y` pointer travel.
- [ ] Render the live preview divider and candidate second-pane footprint without mutating the committed workspace tree.
- [ ] Add hysteresis or similar stability handling so near-diagonal drags do not flicker excessively.

### `Workspace-9 / Phase 4`
- [ ] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [ ] Commit the split on release using the previewed ratio and the existing split-tree owner seam.
- [ ] Cancel under-threshold or aborted gestures without mutating the tree.
- [ ] Reuse the existing split-node helpers and ratio clamps instead of inventing a second layout mutation path.

### `Workspace-9 / Phase 5`
- [ ] `HLG 2. Let the user click and hold an empty fillet corner, drag to size the new viewport live, and only make the new viewport real when the left click is released.`
- [ ] `HLG 3. Let horizontal versus vertical split direction be chosen naturally from whichever absolute pointer movement is larger so the user can switch easily while dragging.`
- [ ] Add focused tests for vertical preview, horizontal preview, cancel, axis switching, and post-commit divider resize continuity.
- [ ] Decide whether popup workspace shell parity is ready now or should stay explicitly deferred.

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
- Popup workspace shell parity, pointer capture, deadzone logic, preview rendering, and release commit remain deferred to `Phase 2` through `Phase 5`.

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

## [ ] `Workspace-9 / Phase 2` - `Corner Gesture Session And Deadzone Entry`

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

#### First Pass Decisions

- Add one small deadzone before any orientation appears.
- Keep gesture-state cleanup explicit so pointer aborts do not leak transient state.
- Continue treating the committed workspace tree as read-only during this phase.

### Phase 2 Implementation Spec

#### Exact First Code Cut

- Add pointer-capture gesture state for corner split authoring.
- Record the corner hit point and maintain held pointer session state.
- Add deadzone gating so micro-movements do not start preview behavior yet.
- Add cancel or abort cleanup without mutating the layout tree.

#### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`

#### No-Widening Rule

- Do not render the live preview divider yet.
- Do not commit the real split in this phase.
- Do not widen into popup child-window lifecycle or surface persistence work unless the transient session state truly cannot exist without it.

#### Verification Shape

- focused tests for corner `pointerdown` creating transient gesture state only
- focused tests for deadzone behavior and abort cleanup with no tree mutation

## [ ] `Workspace-9 / Phase 3` - `Dominant-Axis Preview Orientation And Footprint`

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

#### First Pass Decisions

- Keep the preview switchable while dragging instead of hard-locking the first axis immediately.
- Compare absolute movement, not signed movement.
- Add light hysteresis so near-diagonal drags do not flicker excessively.

### Phase 3 Implementation Spec

#### Exact First Code Cut

- Compute live orientation and candidate ratio from the held drag session.
- Render one preview divider plus candidate second-pane footprint.
- Keep all preview state transient and detached from committed layout mutation.

#### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/useWorkspaceStore.ts`

#### No-Widening Rule

- Do not commit the real split in this phase.
- Do not widen into popup child-window lifecycle or surface persistence work unless preview rendering truly cannot exist without it.

#### Verification Shape

- focused tests for dominant-`x` vertical preview
- focused tests for dominant-`y` horizontal preview
- focused tests for mid-drag orientation switching without tree mutation

## [ ] `Workspace-9 / Phase 4` - `Release Commit And Cancel Behavior`

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

### Phase 4 Implementation Spec

#### Exact First Code Cut

- Commit a real split node and ratio on pointer release when threshold is met.
- Cancel without mutation when the threshold is not met or the gesture aborts.

#### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/WorkspaceViewportTree.tsx`

#### No-Widening Rule

- Do not widen into Browser/project-content render truth or unrelated workspace polish outside this corner-split family.

#### Verification Shape

- focused gesture tests for commit and cancel

## [ ] `Workspace-9 / Phase 5` - `Regression Proof And Popup Parity Decision`

### Phase 5 Summary

#### Purpose

Close the family cleanly by proving the committed split still behaves like every other shared split and by deciding whether popup workspace shell parity is already small enough to land now.

#### Owns

- regression proof after the new corner gesture commits real splits
- post-commit divider resize continuity checks
- explicit popup-shell parity decision or deferral

#### Does Not Own

- a broader popup-shell redesign
- new merge, join, or advanced area-management gestures

#### First Pass Decisions

- If popup parity is not obviously small and shared, defer it explicitly instead of smuggling a second shell cleanup into the same pass.
- Keep the final proof focused on behavior, not on restating the whole family vision.

### Phase 5 Implementation Spec

#### Exact First Code Cut

- Add focused tests for vertical preview, horizontal preview, cancel, and axis switching as needed after the full gesture lands.
- Add the regression proof that the committed split still resizes through the existing divider behavior.
- Decide whether popup shell parity is ready for the same pass or should remain a recorded follow-on.

#### Likely Files

- `src/app/AppShell.test.tsx`
- `src/app/workspace/PopupWorkspaceShell.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`

#### No-Widening Rule

- Do not widen into broader popup-shell convergence work if the parity read is not already tiny and obvious.

#### Verification Shape

- focused gesture tests for commit and cancel
- focused regression test that the committed split still resizes through the existing divider behavior
- focused parity test only if popup-shell follow-through actually lands in this phase

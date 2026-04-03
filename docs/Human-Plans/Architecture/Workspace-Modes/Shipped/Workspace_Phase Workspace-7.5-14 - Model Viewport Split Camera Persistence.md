# Workspace Phase Workspace-7.5-14 - Model Viewport Split Camera Persistence

## Doc Header

### Doc History
1. 2026-04-03 08:50: Closed this phase after live manual validation confirmed that splitting a model viewport now preserves the user camera across both panes, updating the summary, current read, and phase checklist so `Workspace 7.5-14` now reads as finished product truth instead of an open split-camera bug investigation
1. 2026-04-03 08:47: Updated this phase doc after the first timing-hardening implementation slice landed, recording that `viewerBridge.ts` now restores captured split cameras immediately for already-mounted viewers and also replays them through queued post-layout restore frames for remounting viewers, while keeping `7.5-14` open until live manual validation proves the split reset is actually gone
1. 2026-04-03 08:42: Expanded this phase doc with the traced split owner path, the root-layout remount read, the current bridge-based camera restore seam, and a new implementation-ready follow-up plan so the next `7.5-14` pass can instrument the real failing lifecycle and then move the camera persistence contract onto a more durable owner path without guessing
1. 2026-04-03 08:35: Added this future phase doc after live validation showed that splitting a model viewport still resets both cameras instead of preserving the user camera, locking this as a research-first workspace phase so the real split-time camera owner path can be traced before more code changes are guessed at

### Purpose

Use this phase to make model viewport split preserve the user camera when a new viewer pane is created.

The goal is:
- one honest split-time camera persistence contract for model viewports
- one stable owner path for capturing, carrying, and restoring the user camera across split-induced remounts
- one clear distinction between initial shared camera seeding and later independent camera movement

### Scope

This phase covers:
- model viewport split behavior when a viewer is split top, right, bottom, or left
- split-time camera capture and restore ownership between AppShell, workspace state, viewer bridge, and viewer runtime
- remount, resize, selection, and post-split lifecycle seams that may be reframing or otherwise overriding the user camera
- verification that both the original viewport and the new sibling viewport start from the same user camera pose

This phase does not cover:
- model viewport popout behavior already tracked under `Workspace 7.5-13`
- popup-local split behavior from `Workspace 7.5-12`
- general camera command redesign unrelated to split-time persistence
- broad viewer rendering or material polish unrelated to this bug

## Doc Body

### Summary

`Workspace 7.5-14` is the model viewport split-camera persistence follow-up inside the larger `Workspace 7.5` cleanup ladder.

It exists because the intended product rule is now clear:
- when the user moves the camera in one model viewport and then splits that viewport
- both resulting panes should start from that same pre-split camera location, direction, and zoom
- after that shared starting point, the two panes should be free to diverge and behave independently

Shipped behavior is now correct:
- the user can move, zoom, or orbit the camera
- trigger a viewport split on the main model viewport
- and both panes start from that same pre-split camera location, direction, and zoom

The final product rule is now:
- split captures the true live user camera once
- reseeds both the original pane and the new sibling pane from that same pose
- then allows both viewports to diverge normally after the split completes

### Locked Direction

`Workspace 7.5-14` should be:
- a focused model viewport split-camera bug phase
- a runtime-truth and ownership-tracing task
- research-first before another implementation slice is claimed as final

`Workspace 7.5-14` should not be:
- a vague camera polish bucket
- a rewrite of all camera systems
- a hidden reopening of popout work
- a viewer-only task that ignores AppShell and workspace lifecycle ownership

### Current Read

Locked product truth:
- splitting a model viewport should preserve the current user camera
- both panes should start from that same camera immediately after the split
- later camera movement should remain independent per viewport

Desired invariant:
- split should capture the true live user camera once
- restore that same pose into both the original and new viewport hosts
- and avoid any later frame, resize, selection, or mount-time effect that overrides the restored pose

Current implementation status:
- the shipped restore path now reapplies the captured pose immediately to an already-mounted source viewer and also schedules post-layout replay frames for remounting viewers
- live manual validation confirmed that this closes the split reset bug in the real UI
- `Workspace 7.5-14` is now complete

### Traced Owner Path

Confirmed split entry path:
- the viewport titlebar split commands route through `handleViewportSlotSplit(...)` in `src/app/AppShell.tsx`
- that handler reads the current camera from the source `modelViewer` when available
- it then calls `splitViewportSlot(...)` in `src/app/workspace/useWorkspaceStore.ts`
- after the split returns, it queues the captured pose back onto both the source viewport id and the new sibling viewport id

Confirmed current restore seam:
- `ViewerHost.tsx` creates a fresh `Viewer` instance on mount
- it registers `setOnCameraPoseChange(...)` so the bridge can remember the latest pose for each viewport id
- it then restores from `consumeQueuedViewerCameraPose(viewportId) ?? getLatestViewerCameraPose(viewportId)`
- that means the current system already attempts the `capture before split, restore after split` approach

Confirmed current camera storage owner:
- the current persistence seam is transient `viewerBridge` memory, not workspace-owned state
- queued camera restore lives in `queueViewerCameraPose(...)` and `consumeQueuedViewerCameraPose(...)`
- fallback last-known pose lives in `setLatestViewerCameraPose(...)` and `getLatestViewerCameraPose(...)`

### Strongest Current Diagnosis

The live bug does not currently read like "we forgot to copy the new camera once."

The stronger read from the code is:
- the split action already tries to capture and replay the camera
- the workspace root layout likely changes shape from one leaf viewport to a split wrapper with two child panes
- that makes it very plausible that the primary model viewport remounts during the split transition
- if the source viewer remounts, transient bridge restore timing may not be strong enough to survive the full layout transition

That means the likely failure is one of:
- the source camera capture is stale or missing at the exact split moment
- the source and sibling viewers both remount and default camera state wins before restore fully settles
- a later lifecycle seam changes the apparent camera after restore
- the current bridge-memory owner is too weak for a root-layout transition and the real source of truth needs to live higher

### Evidence Collected

Research-backed owner facts:
- `AppShell.tsx` already contains explicit split-time camera capture and queue logic
- `useWorkspaceStore.ts` rewrites the layout tree when a split is created, and root splits replace the root node with a split node
- `AppShell.tsx` renders viewport content from `renderViewportLayoutNode(viewportSlotRootNodeId)`, so changing the root node shape can change the render subtree identity for the original viewer
- `ViewerHost.tsx` restores camera on mount, which means remount timing is directly relevant to whether the fix works
- `Viewer.ts` exposes `getCameraPose()`, `applyCameraPose(...)`, and `setOnCameraPoseChange(...)`, so the missing capability is probably not basic pose access

Negative findings worth carrying forward:
- there is not yet one obvious always-on "frame all on mount" call in the normal split path
- `Viewer.setParts(...)` rebuilds meshes but does not itself obviously call `frameAll()`
- the current failure may therefore still be a remount-and-restore-timing issue rather than a simple post-mount auto-frame command

### Locked Guidance

Current guidance for `7.5-14`:
- preserve the final contract that split captures one live source pose and reseeds both panes from it
- keep later viewport camera movement independent
- treat any future camera polish as new work rather than reopening this closed repair phase

The user is on the right track:
- copying the exact camera before split and restoring it into both panes is still the correct product behavior
- the missing piece is likely where that contract lives and when it replays, not whether the idea itself is wrong

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/viewerBridge.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/AppShell.test.tsx`
- `src/app/components/ViewerHost.test.tsx`

### Research Questions

#### Question 1 - Is the source viewport camera being captured from the real live viewer?
- confirm whether split reads from the current mounted viewer instance or from stale remembered state
- confirm whether the primary viewer is still the registered active viewer at the moment split is committed

#### Question 2 - Does the primary viewport remount during split?
- confirm whether the source model viewport unmounts and remounts as the slot tree changes
- if it remounts, confirm which path is responsible for reseeding its camera

#### Question 3 - What later effect is overriding the restored pose?
- trace post-split viewer mount effects, selection sync, sketch overlays, toolbar-local state, and any frame commands
- confirm whether any reframe happens after the restore rather than before it

#### Question 4 - Should camera persistence live only in the viewer bridge?
- decide whether transient bridge memory is enough
- or whether workspace-owned per-viewport camera state is needed as the durable source of truth

#### Question 5 - Does restore need a later post-layout pass?
- confirm whether mount-time restore lands before the split layout and viewer sizing fully settle
- decide whether a post-commit or `requestAnimationFrame` restore is needed for both panes even after ownership is improved

### Implementation Readiness

`Workspace 7.5-14` is now ready to move from broad research into a narrow evidence-driven implementation sequence.

The next pass should not start with another blind camera-persistence patch.

It should start by proving one of two outcomes:
- the pose is not available or not durable when both viewers mount
- the pose is applied and then later visually overridden by a later lifecycle seam

Once that is proven, the first implementation should move only one ownership seam at a time so live verification stays honest.

### Recommended Next Cut

Strongest first implementation-ready slice:
- add targeted temporary instrumentation around split capture, viewer mount and unmount, queued restore consumption, and latest-pose updates
- reproduce the live `move camera -> split right` bug with that instrumentation
- if the source pose is present but lost during remount, promote camera pose into a more durable per-viewport owner path
- if the source pose is present and applied but later overridden, add one post-layout restore pass and suppress the later override seam instead

Preferred owner direction after instrumentation:
- workspace-owned per-viewport camera persistence state is the strongest likely long-term owner
- `viewerBridge` can remain the live viewer registration and relay seam, but should not be the only durable holder during a root-layout transition
- split should capture once from the true source viewer, seed both viewport ids from one stable pose, and let each viewport diverge after the initial replay

### Latest Implementation Result

Shipped in the first `7.5-14` implementation slice:
- `viewerBridge.ts` now exposes a stronger restore helper that queues the captured pose, applies it immediately when a viewer is already mounted, and schedules follow-up replay frames after split-time layout settling
- viewer registration now picks up pending restore state as soon as a remounting viewer registers
- `AppShell.tsx` split and copied-viewer flows now use that stronger restore path instead of only a queued mount-time replay

What this means:
- the source viewport should now keep the user camera even if it does not remount
- the sibling viewport should still receive the same captured pose if it mounts fresh during the split
- live validation confirmed that the timing-hardened restore path is sufficient for the current split flow
- if future regressions appear, they should be treated as new follow-up work with fresh evidence rather than as an open continuation of this phase

### Phase Sections

## [x] Phase 1 - Split Camera Instrumentation And Truth Capture
### info
Purpose:
- prove exactly where the split-time camera is lost, consumed, or overridden in the live lifecycle

Current read:
- the traced split owner path and root-layout remount read were strong enough to justify one narrow timing-hardening implementation slice before a deeper owner migration

Main work:
- traced `handleViewportSlotSplit(...)` through the workspace store and confirmed the split handler already captures and requeues the camera
- confirmed the root layout changes from a leaf to a split wrapper, making source remount plausible
- confirmed `ViewerHost.tsx` restores from queued or latest bridge pose on mount
- locked the strongest current read that the remaining failure was likely timing-related across the split transition

Done shape:
- the phase doc names one evidence-backed failing seam
- the notes distinguish between one-shot clone failure and post-split timing failure
- the next code-changing slice has one narrow implementation target and one concrete verification loop

## [x] Phase 2 - Durable Camera Owner Adoption
### info
Purpose:
- move the split-time camera contract onto the confirmed durable owner seam

Current read:
- the shipped fix still uses `viewerBridge` as the active restore owner, but it is now durable enough for the current split lifecycle and passes live validation

Main work:
- added a stronger restore helper that replays the captured pose immediately for already-mounted viewers and through scheduled follow-up frames for remounting viewers
- updated split and copied-viewer flows to use that helper for both source and sibling paths

Done shape:
- split no longer loses the camera because of the current mounted-versus-remounted timing race
- live manual validation confirms both panes start from the same pre-split user camera
- later owner promotion work is not required for closing this bug and should only happen if a new repro justifies it

## [x] Phase 3 - Post-Layout Restore And Override Suppression
### info
Purpose:
- finish the behavior if the durable owner fix still needs a later replay step after layout commit

Current read:
- this phase is complete because the shipped timing-hardened replay path covered the needed post-layout restore behavior for the live split flow

Main work:
- add one deliberate post-layout replay seam for split-created source and sibling viewers
- suppress or reorder the later override seam if one is confirmed
- keep the replay scoped only to split initialization so normal camera interaction stays untouched
- add regression coverage for the exact remount-and-override path

Done shape:
- both viewers visibly keep the same user camera immediately after split in the live UI
- no later mount, resize, or selection effect snaps them back to default
- the repair remains narrow and explainable instead of layering hidden retries everywhere

## [x] Phase 4 - Verification And Closeout
### info
Purpose:
- verify the final `7.5-14` behavior in the live split flow and close the task with one honest contract

Current read:
- the final fix is now complete because live manual validation matched the locked product rule and the focused tests already covered the shipped restore seam

Main work:
- verify `move camera -> split top/right/bottom/left` from the primary viewer
- verify both panes start from the same position, direction, and zoom
- verify later camera movement remains independent between panes
- add or adjust focused tests only after the live failing seam is truly covered
- update cleanup docs with the final shipped truth

Done shape:
- live validation confirms the reset is gone
- tests reflect the real owner seam that fixed the bug
- `7.5-14` is ready to close without leaving the camera contract ambiguous

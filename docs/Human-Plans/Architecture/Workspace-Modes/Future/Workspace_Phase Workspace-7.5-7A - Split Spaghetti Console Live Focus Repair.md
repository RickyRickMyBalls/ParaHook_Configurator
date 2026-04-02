# Workspace Phase Workspace-7.5-7A - Split Spaghetti Console Live Focus Repair

## Doc Header

### Doc History
14. 2026-04-01 22:02: Completed `Phase 3 - Report Back To Workspace 7.5-7 And Resume 2F` by folding the durable live-repair outcome back into `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-7 - Spaghetti Editor Split Modes And Console Alignment.md`, recording that the main floating-to-split spaghetti console loop now stays in graph scope without duplicate focus spam, and closing this temporary follow-up doc as execution history while leaving any later Browser-side rollout decision to the main `7.5-7` ladder
13. 2026-04-01 21:54: Implemented `Phase 2E - Dedupe Spaghetti Activation Noise` by collapsing the hosted spaghetti shell publishers in `src/app/hosts/SpaghettiWindowHost.tsx` so floating, meatball, and popout windows no longer stack capture and bubble activation for the same click, adding focused `src/app/AppShell.test.tsx` coverage that one floating spaghetti click now emits one explicit console handoff and one legacy `surface-activation` sync, and keeping `src/app/AppShell.consoleLiveFocus.test.tsx` as reserve composed-shell coverage while the broader `Phase 2F` submit-only decision stays deferred
12. 2026-04-01 21:33: Tightened `Phase 2E - Dedupe Spaghetti Activation Noise` into an implementation-ready next slice after re-reading the current AppShell, SpaghettiPanel, and SpaghettiWindowHost publishers, locking the remaining noise cleanup around one canonical base spaghetti activation per click, the panel-level graph or node refinement path, and the floating-window double-publish seam so the next repair can remove duplicate graph-focus logs without reopening the late-root replay or submit work
11. 2026-04-01 21:32: Implemented the `Phase 2D` retry by adding source-tagged `consoleContextSyncRequest` payloads in `src/app/store/useAppStore.ts`, routing the AppShell `surface-clear` publishers through one helper in `src/app/AppShell.tsx`, and tightening the spaghetti-visibility clear so it only fires when no split, detached, floating, or popout spaghetti surface still exists, with focused `src/app/AppShell.test.tsx` coverage now proving viewer activation uses a tagged clear source and that split-host spaghetti presence does not trigger the `lost-spaghetti-visibility` clear during normal split-dock use
10. 2026-04-01 21:15: Implemented `Phase 2D - Prevent Global Surface-Clear From Treating Split Spaghetti Clicks As Outside Clicks` by widening the in-bounds workspace-click allowlist in `src/app/AppShell.tsx` so split and slotted spaghetti or browser frame clicks no longer fall through the global outside-click clear path, adding focused `src/app/AppShell.test.tsx` coverage that repeated split-host spaghetti header clicks no longer request `surface-clear`, and leaving the real-console `src/app/AppShell.consoleLiveFocus.test.tsx` harness as expected-failure reserve coverage while the broader noisy spaghetti activation cleanup continues in new `Phase 2E` and `Phase 2F` follow-on slices
9. 2026-04-01 21:00: Reworked the next live-repair step after the latest console transcript proved that `Phase 2C` restored repeated split-host spaghetti publishing but each valid graph focus is still followed by another `Returned to root` replay, adding an implementation-ready `Phase 2D - Prevent Global Surface-Clear From Treating Split Spaghetti Clicks As Outside Clicks` slice ahead of the older submit-only reserve so the next work now targets the later global clear or outside-click path that is still overriding valid split spaghetti focus
8. 2026-04-01 20:58: Implemented `Phase 2C - Restore Split Spaghetti Click Publisher Reliability After Dock Or Split` by moving the base split-host spaghetti activation responsibility up to `src/app/workspace/ViewportFrame.tsx` so header and body clicks both publish the workspace-console handoff after dock or split, removing the older duplicate wrapper capture from `src/app/workspace/ViewportSurfaceRegistry.tsx`, and adding focused `src/app/AppShell.test.tsx` regressions that prove repeated split-header clicks after docking keep re-publishing the clicked viewport graph
7. 2026-04-01 20:51: Tightened `Phase 2C - Restore Split Spaghetti Click Publisher Reliability After Dock Or Split` into an implementation-ready next slice after tracing the live split-host activation seams, locking the next repair around the split wrapper in `src/app/workspace/ViewportSurfaceRegistry.tsx`, the panel activation handoff in `src/app/panels/SpaghettiPanel.tsx`, and the drag or redock paths in `src/app/workspace/workspaceSurfaceActions.ts` so the post-dock repeated-click silence can be fixed before the later Browser rollout resumes
6. 2026-04-01 20:48: Recorded the next live clue after retesting the split flow: once the user enters `Graph`, drags the `Spaghetti Editor` into split mode, and repeatedly clicks that split surface, the console no longer emits fresh selection or graph lines at all, so the remaining repair is now also a split-host spaghetti click-publisher reliability problem after docking and not only a stale-root-replay problem
5. 2026-04-01 20:41: Implemented `Phase 2A - Prevent Stale Root Replay After Valid Split Spaghetti Graph Focus` by tightening `ConsoleDock` so legacy `surface-clear` sync no longer forces the shared console back to `Root` while `Spaghetti Editor` is still the active surface, adding focused stale-replay coverage in `src/app/console/ConsoleDock.test.tsx`, and keeping `src/app/AppShell.consoleLiveFocus.test.tsx` as expected-failure composed-shell coverage while the broader split-host harness gap remains isolated from this narrower replay fix
4. 2026-04-01 20:32: Reworked the next repair lane after the live console transcript proved that split-host `Spaghetti Editor` clicks do reach the existing graph-selection path before a second reset pushes the shared console back to `Root`, replacing the older vague `Phase 2` wording with an implementation-ready stale-root-replay fix and a smaller follow-on reserve slice for submit cleanup only if that replay fix does not fully restore graph enter behavior
3. 2026-04-01 20:24: Implemented `Phase 1 - Reproduce The Live Composed Failure In Focused Coverage` by adding `src/app/AppShell.consoleLiveFocus.test.tsx` as a focused real-console integration repro that uses the actual docked `ConsoleDock` path, drives the split model-viewport to right-slot spaghetti click flow, and captures the still-open live mismatch as an expected-failure regression so the next repair slice can target the real composed seam instead of the older mocked shell-only coverage
1. 2026-04-01 20:19: Tightened `Phase 1 - Reproduce The Live Composed Failure In Focused Coverage` into an implementation-ready first slice after re-reading the current shell and console coverage, locking the key discovery that `src/app/AppShell.test.tsx` still mocks `ConsoleDock` so the next honest step is a smaller real-console integration repro around the split spaghetti click, missing selection-line symptom, and failed `Graph` submit path before any more behavior patches land
1. 2026-04-01 20:17: Added this focused follow-up doc after the split-host `Spaghetti Editor` console work in `Workspace 7.5-7` still failed in the live product even though the shell and console unit coverage was green, carving the remaining repro into its own temporary execution surface so the team can trace the live split-click handoff, staged-session freeze, and missing selection-line behavior without cluttering the broader `7.5-7` console-alignment file and with the explicit plan to report back into `Workspace 7.5-7 Phase 2F` after this live repair lands

### Purpose

This doc was used to finish the live mismatch where clicking a split-host `Spaghetti Editor` did not move the shared console out of `Root`, did not append the expected selection line, and could leave the user unable to commit `Graph` into the graph scope.

This is a temporary follow-up execution surface.

Now that the live repair is complete:
- the durable outcome lives back in `Workspace 7.5-7 - Spaghetti Editor Split Modes And Console Alignment`
- any later Browser-side rollout decision belongs there too

### Scope

This doc covers:
- live split-host `Spaghetti Editor` click behavior versus the shared console
- the missing console selection-line symptom
- the root-session freeze or stuck-submit symptom after a split spaghetti click
- the real composed app path where shell activation, spaghetti panel activation, and `ConsoleDock` staging still disagree

This doc does not cover:
- broader Browser rollout work, which still belongs to `Workspace 7.5-7 Phase 2F`
- console-bottom-bar architecture cleanup
- presentation-mode cleanup
- ghost preview cleanup
- popout or split-visual-polish work

## Doc Body

### Summary

`Workspace 7.5-7A` existed because the current `7.5-7` spaghetti/console work was partially green in focused tests but still broken in the live composed app.

Current live repro:
1. Split the model viewport.
2. Change the right slot to `Spaghetti Editor`.
3. Click the model viewport so console is at `Root` with `Graph` as an option.
4. Click the split-host `Spaghetti Editor`.
5. Console does not report the expected selection line, stays effectively at `Root`, and the user cannot reliably commit `Graph` to enter graph scope.

That meant the remaining bug was no longer well-described as one more generic `7.5-7` compatibility bullet. It needed its own short-lived execution surface so the real integrated path could be traced and then folded back into the main `7.5-7` ladder.

Status now:
- that live repair has landed
- the main floating-to-split spaghetti console loop now stays in graph scope without replaying stale root and without duplicate hosted-shell focus spam
- this doc now remains as the execution history for that repair while the durable result lives back in `Workspace 7.5-7`

### Locked Direction

This follow-up should:
- prove where the live composed app still diverges from the currently passing shell/console tests
- stay tightly scoped to the split-host spaghetti click, handoff, staged-session, and submit path
- end by folding the result back into `Workspace 7.5-7`

This follow-up should not:
- become a broad console redesign
- become the Browser rollout phase
- turn into the larger “console as its own bottom bar” architecture task

### Current Read

Resolved repair chain:
- `Phase 1` captured the live composed failure with the real docked `ConsoleDock` path
- `Phase 2A` stopped stale legacy root replay from overriding valid spaghetti focus while spaghetti was still active
- `Phase 2C` restored split-host click publisher reliability after dock or split by moving the base activation seam to the full frame
- `Phase 2D` finished the AppShell-side late-clear cleanup by tagging and gating `surface-clear` publishers so normal spaghetti visibility and in-bounds clicks no longer replay root
- `Phase 2E` deduped hosted spaghetti activation so one floating or hosted click now produces one clean graph-focus transition instead of stacked duplicate console lines

Current conclusion:
- the live spaghetti console mismatch that justified this temporary doc is resolved for the main user loop
- no separate submit-only `Phase 2F` implementation was needed after the replay and duplicate-publish cleanup landed
- any later Browser-side console widening now belongs back in the main `Workspace 7.5-7` ladder

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- possible new focused integration coverage near the shell/console seam

## [x] Phase 1 - Reproduce The Live Composed Failure In Focused Coverage
### info
Purpose:
- stop relying only on mocked shell coverage and capture the actual failing behavior in a smaller real integration slice

Current read:
- the older passing split spaghetti shell tests in `src/app/AppShell.test.tsx` were not enough because that file still mocked `ConsoleDock`
- `Phase 1` is now landed through `src/app/AppShell.consoleLiveFocus.test.tsx`, which uses the real docked `ConsoleDock` path instead of the shell mock
- that focused repro now captures the still-open live mismatch directly:
  - after a split model-viewport to right-slot spaghetti switch, clicking the split spaghetti surface still leaves the real console at `root`
  - the expected selection line is still missing
  - the console still does not move into `graphSelected`

Main work:
- add focused coverage that uses the real `ConsoleDock` path for the split spaghetti click flow
- prove whether the split spaghetti click fails before handoff consumption, during handoff consumption, or during staged submit
- capture the missing selection-line symptom in test form if possible

Done shape:
- we have at least one focused failing regression that matches the live user repro
- the team can point to the exact seam that still differs between the mocked shell tests and the real composed app

### Questions / Decisions

#### [x] Question 1 - What is the first honest gap in the current coverage story?

##### Suggestion / Locked Answer
- `src/app/AppShell.test.tsx` still mocks `ConsoleDock`, so those tests only prove shell publishing
- `Phase 1` should start by adding a smaller real-console integration repro instead of trusting the mocked shell path as proof that the live split spaghetti click works

##### Why
- the current green tests are not sufficient to explain the missing live selection line or the stuck `Graph` submit behavior

#### [x] Question 2 - What exact live flow should the first repro target?

##### Suggestion / Locked Answer
- reproduce the real user sequence:
  1. split the model viewport
  2. change the right slot to `Spaghetti Editor`
  3. click the model viewport so console is at `Root`
  4. click the split-host `Spaghetti Editor`
  5. attempt to commit `Graph`
- the focused repro should check summary text, staged session, and console entries after both the click and the submit

##### Why
- this is the exact failure family the user is seeing live, and it is narrower than a broad console refactor

#### [x] Question 3 - What outputs should tell us where the failure really lives?

##### Suggestion / Locked Answer
- inspect three things in the focused repro:
  - whether `consoleWorkspaceContextHandoff` changed
  - whether the real `ConsoleDock` session left `root`
  - whether a selection-line or graph-prompt entry was appended
- then submit `Graph` and inspect whether the staged session becomes `graphSelected`

##### Why
- this separates publisher failure, consumer failure, and submit-path failure without guessing first

#### [x] Question 4 - What should stay out of scope for Phase 1?

##### Suggestion / Locked Answer
- no new behavior patches yet unless the code read reveals a trivial typo or obviously wrong wiring during reproduction
- no Browser rollout work
- no larger console-bottom-bar architecture work

##### Why
- Phase 1 should first prove the live failure in focused coverage before we widen into repair work

Likely files:
- `src/app/AppShell.consoleLiveFocus.test.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- possible small dedicated integration harness near the shell/console seam
- `src/app/AppShell.tsx`
- `src/app/console/ConsoleDock.tsx`

Highest-signal seams:
- the mocked `ConsoleDock` boundary in `src/app/AppShell.test.tsx`
- the real `ConsoleDock` staged session and summary text after split spaghetti activation
- the existing root-versus-graph submit coverage in `src/app/console/ConsoleDock.test.tsx`
- the split-slot switch path that turns the right viewport into `Spaghetti Editor`

Implementation cut:
1. Add a smaller focused integration repro that uses the real `ConsoleDock` path instead of the AppShell mock.
2. Drive the exact split-viewer-to-spaghetti click sequence from the live repro.
3. Assert the console summary, entries, and staged session after the spaghetti click.
4. Submit `Graph` and assert whether the session enters `graphSelected` or remains at `root`.
5. Use that result to decide whether Phase 2 is a publisher fix, a handoff-consumption fix, or a submit-path fix.

Checklist:
- [x] Reproduce the split spaghetti click in focused real-console coverage
- [x] Check whether the selection line is missing because no explicit handoff was consumed
- [x] Check whether the console remains at `root` after the click
- [x] Check whether submitting `Graph` still fails after the click

Verification:
- focused integration coverage demonstrates the same failure family the user sees live
- the first focused repro makes it obvious whether the remaining bug is before handoff consumption, during handoff consumption, or during staged submit
- `npm.cmd test -- --run src/app/AppShell.consoleLiveFocus.test.tsx`
- `npm.cmd run build`

## [x] Phase 2A - Prevent Stale Root Replay After Valid Split Spaghetti Graph Focus
### info
Purpose:
- stop a later root-reset path from overwriting a valid split spaghetti graph focus in the same interaction cycle

Current read:
- the live transcript proved the split spaghetti click was not purely missing graph focus
- `Phase 2A` is now landed through the narrower `ConsoleDock` precedence fix: legacy `surface-clear` replay no longer forces root while `workspaceActiveSurface` is still `spaghetti`
- the composed-shell repro file still stays in expected-failure mode so the broader shell harness mismatch remains visible without blocking this narrower replay repair

Main work:
- trace and patch the specific stale root-reset path that fires after the valid split spaghetti graph focus
- preserve the already-landed explicit workspace handoff direction instead of backing into more legacy-only sync
- keep the fix narrow enough that the broader Browser rollout still belongs in `Workspace 7.5-7 Phase 2F`

Done shape:
- clicking the split-host `Spaghetti Editor` moves the shared console into the graph path and keeps it there
- the later stale root replay no longer logs `Returned to root` for the same interaction cycle
- the console appends the expected graph-selection feedback and remains in graph scope afterward

### Questions / Decisions

#### [x] Question 1 - What did the live transcript prove about the real failure?

##### Suggestion / Locked Answer
- the split-host `Spaghetti Editor` click is reaching the existing graph-selection path
- the real failure is that a later root-reset path immediately overwrites that valid graph focus

##### Why
- the console log already contains `Active surface: spaghetti`, `Selected target: graph_[1]`, `Select > Graph > graph_[1]`, and `Graph > Choose next [...]` before it logs `Returned to root`

#### [x] Question 2 - What is the next smallest honest repair target?

##### Suggestion / Locked Answer
- patch the stale root replay rather than reworking the graph-focus publisher again
- Phase `2A` should center on preventing a later viewer-root or surface-clear compatibility path from winning after a fresh explicit spaghetti graph handoff

##### Why
- repeating more spaghetti-focus publisher changes would be another patch in the wrong place now that the live log proves the graph focus already landed

#### [x] Question 3 - What outputs should Phase 2A inspect while fixing the replay?

##### Suggestion / Locked Answer
- inspect the order of:
  - `consoleWorkspaceContextHandoff`
  - `consoleContextSyncRequest`
  - any `surface-clear` or viewer-root events
  - staged session changes in the real `ConsoleDock`
- the critical assertion is that a fresh graph-selected session must not be overwritten by a stale root event from the same click cycle

##### Why
- this separates â€œgraph focus never landedâ€ from â€œgraph focus landed and got canceled later,â€ and the live transcript already points strongly to the second case

#### [x] Question 4 - What should stay out of scope for Phase 2A?

##### Suggestion / Locked Answer
- no Browser rollout work yet
- no broader console-bottom-bar redesign
- no broad submit-path rewrite unless the stale root replay fix proves insufficient

##### Why
- the current evidence says the next fix should be a precedence or replay fix, not a fresh architecture restart

Likely files:
- `src/app/AppShell.consoleLiveFocus.test.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/console/ConsoleDock.test.tsx`

Highest-signal seams:
- any `Returned to root` logging path in `src/app/console/ConsoleDock.tsx`
- explicit viewer-root handoff publishers in `src/app/AppShell.tsx`
- `surface-clear` or viewer deselect compatibility paths that may replay after split spaghetti activation
- the relative ordering between explicit spaghetti graph handoff and any later root sync

Implementation cut:
1. Extend the focused real-console repro so it proves the graph-selected session lands before a later root replay.
2. Trace the exact root-reset publisher or consumer path that follows the split spaghetti click.
3. Patch precedence or event ordering so a fresh spaghetti graph focus wins over stale root replay from the same interaction cycle.
4. Keep the already-working split-browser behavior intact.
5. Re-run the focused real-console repro plus the existing console root/graph preference tests.

Checklist:
- [x] Prove the graph-selected session lands before the stale root replay
- [x] Patch the stale root replay seam
- [x] Keep explicit workspace handoff as the preferred direction
- [x] Preserve split-browser behavior
- [x] Add regression coverage for the repaired live flow

Verification:
- live split-host `Spaghetti Editor` click moves the console into the correct graph context and keeps it there
- `Returned to root` no longer replays for the same split spaghetti interaction
- `Graph` remains committable after the click
- `npm.cmd test -- --run src/app/AppShell.consoleLiveFocus.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

## [ ] Phase 2B - Repair Graph Submit Only If Replay Fix Is Not Sufficient
### info
Purpose:
- keep one small reserve slice for the submit path only if stopping the stale root replay does not fully restore graph enter behavior

Current read:
- the current evidence suggests the stale root replay is the primary failure
- if `Phase 2A` removes that replay and the user can commit `Graph`, this reserve slice should stay unused

Main work:
- inspect only the staged-submit path if graph focus remains visible but `Graph` still cannot commit afterward
- keep this slice narrow and avoid reopening publisher or replay work already settled in `Phase 2A`

Done shape:
- either this slice is unnecessary because `Phase 2A` fixed the user flow
- or the remaining submit-only seam is patched without widening the scope

Checklist:
- [ ] Use only if the root replay fix is not enough
- [ ] Keep the submit repair isolated from publisher and replay work
- [ ] Add submit-specific regression coverage only if needed

## [x] Phase 2C - Restore Split Spaghetti Click Publisher Reliability After Dock Or Split
### info
Purpose:
- restore reliable workspace-console handoff publishing when the user clicks a `Spaghetti Editor` after dragging or docking it into split mode

Current read:
- the remaining split-host publisher gap was that the inner spaghetti surface wrapper did not own the whole clickable frame after dock or split
- split-host `Spaghetti Editor` header clicks could therefore bypass the base spaghetti activation publisher entirely because the header lives in `src/app/workspace/ViewportFrame.tsx`, outside the inner `ViewportSurfaceRegistry` wrapper
- `Phase 2C` is now landed by moving the base split-host spaghetti activation up to the whole frame while leaving panel-local graph or node refinement in place

Main work:
- move the base split-host spaghetti activation publisher to the full `ViewportFrame` so header, body, and canvas clicks all publish the same base spaghetti handoff
- remove the older duplicate split-wrapper capture from `ViewportSurfaceRegistry` so one deliberate split click does not emit stacked base events
- lock the split-host behavior with focused AppShell coverage for repeated post-dock header clicks
- keep this separate from the stale-root replay fix already shipped in `Phase 2A`

Done shape:
- after docking or splitting a `Spaghetti Editor`, repeated clicks on the split frame header or body re-publish the clicked viewport graph
- the shared console receives a fresh spaghetti handoff on every deliberate split-frame click just like split `Browser` already does
- this repair does not regress the narrower stale-root replay protection from `Phase 2A`

### Questions / Decisions

#### [x] Question 1 - What does the newest live retest prove about the remaining bug?

##### Suggestion / Locked Answer
- after the editor is already in split mode, repeated clicks on the split-host spaghetti surface are not producing fresh console entries
- that means the next failure is now publisher silence after dock or split, not only console precedence

##### Why
- the user reports no new `Selected target`, graph prompt, or `Active surface: spaghetti` lines when clicking the split spaghetti surface repeatedly after docking

#### [x] Question 2 - What is the next smallest honest repair target?

##### Suggestion / Locked Answer
- repair split-host spaghetti activation publishing after dock or split
- do not widen back into `ConsoleDock` precedence first unless the publisher trace proves a fresh handoff is already being emitted

##### Why
- if repeated clicks produce no new lines at all, the console likely never received a fresh event for those clicks

#### [x] Question 3 - Which code seams should Phase 2C inspect first?

##### Suggestion / Locked Answer
- inspect:
  - the split wrapper `onPointerDownCapture` in `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - the panel activation handoff in `src/app/panels/SpaghettiPanel.tsx`
  - drag or redock helpers in `src/app/workspace/workspaceSurfaceActions.ts`
  - any split-host frame or restore path in `src/app/AppShell.tsx` that may replace the surface without preserving reliable activation

##### Why
- those are the places where split spaghetti activation is attached, restored, or potentially lost after a drag-to-split or redock transition

#### [x] Question 4 - What should stay out of scope for Phase 2C?

##### Suggestion / Locked Answer
- no new Browser rollout work
- no broad console redesign
- no submit-path repair unless the split-host publisher is restored and submit still fails afterward

##### Why
- `2C` should first make repeated split spaghetti clicks reliably publish again before we revisit later command or submit layers

Likely files:
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/AppShell.consoleLiveFocus.test.tsx`

Highest-signal seams:
- `.WorkspaceViewportSlotSurface--spaghetti` wrapper activation in `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `onActivateEditorContext` publish sites in `src/app/panels/SpaghettiPanel.tsx`
- `splitWorkspaceSurfaceToSide(...)` and `redockDetachedSurface(...)` in `src/app/workspace/workspaceSurfaceActions.ts`
- split-host activation regressions in `src/app/AppShell.test.tsx`

Implementation cut:
1. Add or tighten focused coverage for the exact live sequence:
   - enter `Graph`
   - drag or dock `Spaghetti Editor` into split mode
   - click that split surface repeatedly
   - assert fresh activation logs or handoff calls occur each time
2. Trace whether the split wrapper still publishes `onActivateSpaghettiSurface(...)` after dock or split.
3. Trace whether panel-local activation still calls `onActivateEditorContext(...)` after dock or split.
4. Patch the first broken seam so repeated split clicks emit a fresh spaghetti handoff again.
5. Re-run the focused split-host activation coverage plus the current console replay tests.

Checklist:
- [x] Reproduce the no-new-console-lines split-click silence after docking into split mode
- [x] Identify whether the missing publisher is in split wrapper, panel root, or drag-to-split restore wiring
- [x] Restore fresh handoff publishing on repeated split spaghetti clicks
- [x] Keep split-browser activation behavior unchanged
- [x] Add focused regression coverage for repeated split spaghetti clicks after docking

Verification:
- after docking or splitting a `Spaghetti Editor`, repeated clicks on the split frame emit fresh spaghetti handoff again
- the shared console receives a fresh spaghetti handoff on every deliberate split click
- split `Browser` activation still behaves the same
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/AppShell.consoleLiveFocus.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

## [x] Phase 2D - Prevent Global Surface-Clear From Treating Split Spaghetti Clicks As Outside Clicks
### info
Purpose:
- stop a later global clear or outside-click path from replaying `Root` immediately after a valid split-host spaghetti graph focus

Current read:
- `Phase 2D` is now landed through two stacked AppShell repairs:
  - the broader in-bounds allowlist for split and slotted workspace surfaces
  - a source-tagged AppShell clear helper plus a stricter spaghetti-visibility guard that only clears when no split, detached, floating, or popout spaghetti surface remains
- the focused `AppShell` regressions now prove:
  - viewer activation emits a tagged `surface-clear` source
  - split-host spaghetti presence does not trigger the `lost-spaghetti-visibility` clear during normal split use
  - repeated split-host spaghetti header clicks no longer request `surface-clear`
- the broader noisy activation loop is still not fully clean, so the next remaining work moves into `Phase 2E` and `Phase 2F` instead of staying hidden inside this late-clear slice

Main work:
- trace the later root-clear publisher that runs after a valid split-host spaghetti click
- patch the global clear or outside-click path so split spaghetti frame clicks are treated as in-bounds workspace activation, not as outside clicks
- keep the already-working split spaghetti publisher path from `Phase 2C` intact
- keep the earlier stale-root replay protection from `Phase 2A` intact

Done shape:
- split-host spaghetti frame clicks no longer fall through the global outside-click clear path
- repeated split-host spaghetti header clicks no longer request `surface-clear`
- AppShell clear publishers now carry explicit internal sources so later live retests can identify which clear path, if any, still survives
- the remaining cleanup is now narrowed to noisy duplicate spaghetti activation and, only if still necessary later, the final `Graph` submit path

### Questions / Decisions

#### [x] Question 1 - What did the latest live console transcript prove after `Phase 2C` landed?

##### Suggestion / Locked Answer
- split-host spaghetti publishing is working again
- the remaining bug is that a later clear path still replays `Returned to root` after each valid graph focus

##### Why
- the user log now shows fresh spaghetti selection lines on every click before the later root replay appears again

#### [x] Question 2 - What is the next smallest honest repair target?

##### Suggestion / Locked Answer
- trace and patch the later global clear or outside-click path before touching submit behavior
- treat this as a shell-level clear override problem, not another spaghetti publisher problem

##### Why
- the valid spaghetti focus already lands, so the next bug is the later replay that cancels it

#### [x] Question 3 - Which code seams should Phase 2D inspect first?

##### Suggestion / Locked Answer
- inspect:
  - the global `window` `pointerdown` clear logic in `src/app/AppShell.tsx`
  - any selector allowlist used there for in-bounds workspace surfaces
  - the split-host `ViewportFrame` and `ViewportSurfaceRegistry` classnames now used by split spaghetti activation
  - any remaining `surface-clear` requests in `src/app/AppShell.tsx` that can still fire after split spaghetti activation

##### Why
- that is the most likely place a valid split spaghetti click can still be misclassified as an outside click and replay root immediately afterward

#### [x] Question 4 - What should stay out of scope for Phase 2D?

##### Suggestion / Locked Answer
- no Browser rollout work
- no new spaghetti publisher redesign
- no submit-path repair unless root replay still blocks `Graph` after the later clear path is fixed

##### Why
- `Phase 2D` should isolate the later clear override first, because the new log says that is now the remaining bug

Likely files:
- `src/app/AppShell.tsx`
- `src/app/AppShell.consoleLiveFocus.test.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- possible small touch in `src/app/workspace/ViewportFrame.tsx` if the global allowlist needs a stable selector

Highest-signal seams:
- the global `window.addEventListener('pointerdown', ...)` path in `src/app/AppShell.tsx`
- any in-bounds selector or allowlist used to decide whether a click should clear active surface state
- any `requestConsoleContextSync('surface-clear')` path that still runs after a valid split spaghetti click
- the real-console integration repro in `src/app/AppShell.consoleLiveFocus.test.tsx`

Implementation cut:
1. Extend the focused live-console repro so it proves a valid split spaghetti focus lands and then a later clear path still replays root.
2. Trace the specific global clear or outside-click path that fires after the valid split spaghetti click.
3. Patch that path so split spaghetti frame clicks are treated as in-bounds workspace surface activation.
4. Re-run the focused AppShell split-host regressions plus the real-console repro and console replay tests.
5. Only revisit `Phase 2B` if `Graph` submit still fails after this later clear replay is removed.

Checklist:
- [x] Prove the later root replay now comes from a global clear or outside-click path
- [x] Patch the clear path so split spaghetti frame clicks stay in-bounds
- [x] Keep `Phase 2C` split-host publisher behavior intact
- [x] Keep `Phase 2A` stale replay protection intact
- [x] Re-test whether `Graph` submit still needs a later reserve slice

Verification:
- repeated split-host spaghetti header clicks no longer request `surface-clear` in focused `AppShell` coverage
- the global outside-click clear no longer treats split or slotted spaghetti or browser frame clicks as out-of-bounds by default
- AppShell now tags clear publishers such as `viewer-activation`, `global-outside-click`, and `lost-spaghetti-visibility` in focused store-backed coverage
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/AppShell.consoleLiveFocus.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

## [x] Phase 2E - Dedupe Spaghetti Activation Noise
### info
Purpose:
- reduce the repeated identical graph-focus logging that still appears for one deliberate spaghetti click, especially in the floating-to-split user loop

Current read:
- `Phase 2E` is now landed for the hosted spaghetti shells that were still stacking duplicate graph-focus publishers for one click
- the highest-signal duplicate seam turned out to be `SpaghettiWindowHost`, where floating, meatball, and popout shells were still combining base shell activation from more than one pointer path
- the fix now keeps one canonical hosted-shell activation per click and leaves panel-level graph or node targeting as the later refinement path
- the real composed-shell harness in `src/app/AppShell.consoleLiveFocus.test.tsx` stays as reserve coverage, while the permanent lock for this slice is the focused `src/app/AppShell.test.tsx` floating-shell publisher regression

Main work:
- audit all spaghetti activation publishers for one user click across floating and split contexts
- define one canonical base activation per click
- keep graph or node refinement, but prevent multiple identical graph-focus publishes from the same interaction cycle

Done shape:
- one deliberate spaghetti click produces one graph-focus console update by default
- graph or node refinement still works without duplicating the same graph-selection lines several times

### Questions / Decisions

#### [x] Question 1 - What is the remaining bug after `Phase 2D`?

##### Suggestion / Locked Answer
- the remaining bug is duplicate spaghetti activation noise, not missing focus and not late root replay
- one deliberate spaghetti click can still append multiple copies of the same graph-selection lines

##### Why
- the live logs now still end in the right spaghetti graph scope, but they show repeated copies of the same graph-selection and graph-prompt lines for one click

#### [x] Question 2 - What is the next smallest honest repair target?

##### Suggestion / Locked Answer
- define one canonical base spaghetti activation publisher per click and demote the others to refinement-only roles
- do not widen into submit-path cleanup or another AppShell late-clear pass first

##### Why
- the late-clear work is already isolated in `Phase 2D`, and the remaining noise now points to stacked activation publishers instead of another root replay

#### [x] Question 3 - Which code seams should Phase 2E inspect first?

##### Suggestion / Locked Answer
- inspect:
  - the frame-level activation in `src/app/AppShell.tsx` and `src/app/workspace/ViewportFrame.tsx`
  - the panel-level `onActivateEditorContext` path in `src/app/panels/SpaghettiPanel.tsx`
  - the floating-window `onPointerDown` and `onPointerDownCapture` pair in `src/app/hosts/SpaghettiWindowHost.tsx`

##### Why
- those are the places most likely to publish the same graph-focus update more than once for a single click

#### [x] Question 4 - What should stay out of scope for Phase 2E?

##### Suggestion / Locked Answer
- no new late-root replay work unless a focused dedupe trace proves replay is still happening
- no Browser rollout work
- no submit-path cleanup unless `Graph` still fails after duplicate-publish cleanup is complete

##### Why
- `2E` should isolate the duplicate-publish noise first so the final user loop becomes readable before any later submit-only work

Likely files:
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/AppShell.consoleLiveFocus.test.tsx`

Highest-signal seams:
- frame-level split activation versus panel-level refinement
- floating-window `onPointerDown` plus `onPointerDownCapture` pairing
- repeated `requestConsoleWorkspaceContextHandoff(...)` calls for the same graph target in one click cycle
- duplicate graph-selection line counts in the real-console harness

Implementation cut:
1. Add or tighten coverage for one floating spaghetti click and one split spaghetti click, asserting the console does not append multiple identical graph-focus lines by default.
2. Trace which activation publishers fire for each path.
3. Keep one canonical base activation publisher per click.
4. Demote panel-local graph or node handoff to refinement-only when the base activation already resolved the same graph target.
5. Re-run the focused AppShell and real-console suites before considering `Phase 2F`.

Checklist:
- [x] Identify which spaghetti activation publishers are stacking for a single click
- [x] Keep one canonical base activation per click
- [x] Preserve graph or node refinement without duplicate graph focus logs
- [x] Add focused coverage for duplicate-publish suppression

Verification:
- one floating spaghetti click produces one clean graph-focus update by default
- one split spaghetti click produces one clean graph-focus update by default
- graph or node refinement still works when the selected node truly changes
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/AppShell.consoleLiveFocus.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

## [x] Phase 2F - Submit Path Cleanup Only If Still Needed
### info
Purpose:
- keep one final reserve slice for the `Graph` enter or commit path only if replay and duplicate-publish cleanup are both complete and submit still fails

Current read:
- this reserve slice was not needed after the replay and duplicate-publish fixes landed
- keep the note here as execution history only; do not reopen it unless a new live submit failure appears later

Main work:
- inspect staged navigation and submit handling in `ConsoleDock`
- patch only the final `Graph` enter or commit seam
- do not reopen publisher or replay work already settled in `Phase 2A` through `Phase 2E`

Done shape:
- the earlier replay and duplicate-publish repairs restored the user loop, so this reserve slice closed unused
- any future submit-only regression can spin a fresh task instead of quietly reopening this temporary repair doc

Checklist:
- [x] Use only if `Graph` still fails after `Phase 2E`
- [x] Keep the submit repair isolated from publisher and replay cleanup
- [x] Add submit-specific coverage only if this slice becomes necessary

## [x] Phase 3 - Report Back To Workspace 7.5-7 And Resume 2F
### info
Purpose:
- close this temporary follow-up honestly and push the outcome back into the main `7.5-7` ladder

Main work:
- update `Workspace 7.5-7` with the final result and any clarified console-compatibility rule
- explicitly mark this follow-up as reported back
- resume planning or implementation at `Workspace 7.5-7 Phase 2F`

Done shape:
- this live-repair doc is complete
- `Workspace 7.5-7` contains the durable outcome
- the next task is clearly decided back in `Workspace 7.5-7`, not hidden in this temporary doc

Checklist:
- [x] Record the final live repair result in `Workspace 7.5-7`
- [x] Mark this temporary follow-up complete
- [x] Resume `Workspace 7.5-7 Phase 2F`

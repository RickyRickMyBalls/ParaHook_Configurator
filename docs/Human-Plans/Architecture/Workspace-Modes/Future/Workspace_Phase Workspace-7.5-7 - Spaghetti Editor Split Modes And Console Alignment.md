# Workspace Phase Workspace-7.5-7 - Spaghetti Editor Split Modes And Console Alignment

## Doc Header

### Doc History
1. 2026-04-02 07:05: Updated this phase doc after the narrow Browser row pointer-versus-click dedupe landed, recording that `BrowserTreeRowShell` now keeps its one-click selection guard alive until the real `click` consumes it so a single Browser content click no longer prints duplicate `Selected target`, `Select > ...`, and `... > Choose next [...]` lines just because the same row handled both `pointerdown` and `click`
1. 2026-04-02 06:50: Updated this phase doc after the shipped docked Browser root-replay cleanup landed, recording that AppShell now treats the docked Browser panel root and body as in-bounds workspace surfaces for the global pointerdown clear guard so a valid docked Browser content click no longer falls through to a later `Returned to root` / `Root > Choose next [...]` replay
1. 2026-04-01 22:54: Updated this phase doc after a narrow Browser single-click console cleanup landed on top of the shipped `Phase 2F` rollout, recording that Browser content clicks now dedupe the explicit handoff plus legacy `target-selection` replay, that simple Browser row selection no longer emits the redundant `Browser`-layer `Selected ...` entry, and that `selectPart(null)` now avoids logging `Selection cleared` when no part was previously active
1. 2026-04-01 22:35: Updated this phase doc after the shipped `Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion` slice landed, marking that Browser-side rollout complete and recording that Browser selection publishers now emit the explicit `consoleWorkspaceContextHandoff` contract through `workspaceSelectionCommands`, `browserInteractions`, and Browser-owned workspace intents while the older `target-selection` reason remains as fallback compatibility
1. 2026-04-01 22:21: Tightened `Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion` into an implementation-ready Browser-side console cleanup slice after tracing the current Browser seams in `useBrowserPanelController`, `browserInteractions`, and `workspaceSelectionCommands`, locking the next work around upgrading Browser selection publishers to explicit `consoleWorkspaceContextHandoff` payloads while keeping the older `requestConsoleContextSync('target-selection')` path alive only as fallback compatibility
1. 2026-04-01 22:19: Closed `Phase 3 - Final Confidence And Carry Cleanup Ordering` as a doc-only carry decision after the recent spaghetti-console cleanups and live retests showed the split-host plus floating spaghetti loop is now behaving cleanly enough to move on, recording that the phase no longer needs another confidence-only pass before the next active work and that `Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion` is now the explicit next task in this ladder
1. 2026-04-01 22:02: Folded the durable `Workspace 7.5-7A` live-repair outcome back into this main `7.5-7` doc after the floating-to-split spaghetti console loop was cleaned up through the shipped `7.5-7A` phases, replacing the older temporary live-repair note with a report-back summary that the root replay and duplicate activation noise are now resolved for the main spaghetti loop, clarifying that the remaining open work here is the broader `Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion` plus final carry ordering rather than the earlier live spaghetti-root mismatch
1. 2026-04-01 19:57: Updated this phase doc after the shipped `Phase 2E - Split-Host Outer Activation Fallback` slice landed, marking that subphase complete and recording that split-host `Spaghetti Editor` activation now has an outer wrapper fallback again in `ViewportSurfaceRegistry`, that split-host panel-root capture is no longer the primary trigger for console refocus, and that focused `AppShell` coverage now clicks the real split wrapper path to prove the console handoff still reaches the clicked viewport graph without breaking the richer `Phase 2D` graph or node refinement
1. 2026-04-01 19:53: Reworked the next open `7.5-7` console slice after chat confirmed that split-mode Browser clicks already refocus console correctly while split-mode `Spaghetti Editor` clicks still do not, inserting a new implementation-ready `Phase 2E - Split-Host Outer Activation Fallback` slice ahead of the broader Browser rollout and pushing the old rollout lane down to `Phase 2F` so the next fix can restore an outer split-host spaghetti activation safety net before widening the explicit workspace-handoff migration
1. 2026-04-01 18:43: Updated this phase doc after the shipped `Phase 2D - Direct Spaghetti Graph Focus Command` slice landed, marking that subphase complete and recording that spaghetti activation now resolves graph and viewport-local node target directly from `editorViewportId`, that floating or popout activation now passes the clicked viewport through the same direct handoff seam, and that focused `AppShell` plus `ConsoleDock` regressions now prove the console enters the existing graph-selected or node-selected path instead of lingering on `Root`
1. 2026-04-01 18:31: Tightened `Phase 2D - Direct Spaghetti Graph Focus Command` into an implementation-ready slice after re-reading the current spaghetti activation helper, `ConsoleDock` handoff handling, and staged-navigation graph-selected path, locking the next fix around a direct `editorViewportId -> graphDocumentId/nodeId` focus command that should drive the existing `Root -> Graph -> graph_[n]` console location model before the later Browser rollout in `Phase 2E`
1. 2026-04-01 18:30: Revised the next open console slice after chat clarified that the console already has a real `Root -> Graph -> graph_[n]` location model, tightening the post-`Phase 2C` plan so the next work is no longer a vague Browser rollout but a direct `editorViewportId -> graphSelected or nodeSelected` focus handoff lane, then splitting the old `Phase 2D` bucket into a first implementation-ready `Phase 2D - Direct Spaghetti Graph Focus Command` slice and a later `Phase 2E - Browser Publisher Rollout And Legacy Compatibility Demotion` slice
1. 2026-04-01 18:22: Updated this phase doc after the shipped `Phase 2C - Unify Spaghetti Activation Publishers` slice landed, recording that `AppShell` now owns one shared spaghetti activation helper, that split-host activation now routes through `SpaghettiPanel` instead of relying only on the outer split wrapper, and that panel-local graph or node focus actions now publish the same workspace-console handoff so the viewer-versus-spaghetti `root`-stuck repro can move into final manual confirmation before the later Browser rollout in `Phase 2D`
1. 2026-04-01 18:10: Tightened `Phase 2C - Unify Spaghetti Activation Publishers` into an implementation-ready slice after tracing the remaining live `root`-stuck repro through `AppShell`, `ViewportSurfaceRegistry`, `SpaghettiWindowHost`, and `SpaghettiPanel`, locking the next fix around one shared spaghetti activation helper that unifies shell-level and panel-local focus publishing before the later Browser rollout in `Phase 2D`
1. 2026-04-01 18:10: Expanded the post-`Phase 2B` console plan after a deeper live click trace showed the remaining failure is not primarily in `ConsoleDock` anymore but in incomplete spaghetti-side publisher coverage, replacing the old vague `Phase 2C` “broaden publishers” bucket with a more honest `Phase 2C - Unify Spaghetti Activation Publishers` slice and a later `Phase 2D - Browser Publisher Rollout And Legacy Compatibility Demotion` slice so the next work can first unify split-host, floating, popout, and panel-local spaghetti activation behind one canonical console handoff seam before widening the rollout
1. 2026-04-01 18:03: Updated this phase doc after the shipped `Phase 2B - Make ConsoleDock Prefer Explicit Workspace Handoff` slice landed, recording that `ConsoleDock` now reads `consoleWorkspaceContextHandoff` before the legacy reason-only sync path for viewer and spaghetti activation, that fresh handoff `seq` values now count as meaningful console refocus events even when the visible scope repeats, and that the old `consoleContextSyncRequest` path remains alive as fallback while `Phase 2C` stays open for the broader publisher rollout
1. 2026-04-01 18:08: Tightened `Phase 2B - Make ConsoleDock Prefer Explicit Workspace Handoff` into an implementation-ready migration slice after reviewing the current `ConsoleDock` sync effect and focused tests, locking the decision that `consoleWorkspaceContextHandoff` should outrank the old reason-only compatibility path for viewer plus spaghetti activation, that fresh handoff `seq` values must stay meaningful even when the resulting scope repeats, and that sketch plus transform protection rules remain in place while the console preference order changes
1. 2026-04-01 17:53: Updated this phase doc after the shipped `Phase 2A - Define Explicit Console Workspace Context Handoff` slice landed, recording that `useAppStore` now owns an explicit console handoff event payload with sequence semantics, that viewer and spaghetti activation in `AppShell` now publish that payload while still preserving the legacy `consoleContextSyncRequest` path, and that `Phase 2B` is now the next real console-preference switch
1. 2026-04-01 18:00: Tightened `Phase 2A - Define Explicit Console Workspace Context Handoff` into an implementation-ready first compatibility slice after the deeper console trace, locking the concrete new app-store handoff payload, the first viewer-plus-spaghetti publisher seams, the explicit decision to leave `consoleContextSyncRequest` alive as fallback for now, and the focused verification shape before `ConsoleDock` itself is taught to prefer the new handoff in `Phase 2B`
1. 2026-04-01 17:55: Reworked `Phase 2` into a deeper console-compatibility planning lane after a read across `AppShell`, `ViewportWorkspaceHost`, `ConsoleDock`, `stagedNavigation`, and `useAppStore` showed that click-to-console refocus is still being filtered through a generic `consoleContextSyncRequest.reason` plus staged-session compatibility path, so the next `7.5-7` work now explicitly plans an `Explicit Console Workspace Context Handoff` seam in smaller subphases instead of treating the remaining console drift as one more narrow click bug
1. 2026-04-01 17:40: Refreshed the shipped `Phase 1 - Split Editor Click Focuses Console On That Editor Graph` read after the follow-up click-cycle fix landed, recording that deliberate surface activation now wins over stale selected-target context so the user can click back and forth between the model viewport and a split-host `Spaghetti Editor` and `ConsoleDock` re-focuses on every click
1. 2026-04-01 17:29: Updated this phase doc after the shipped `Phase 1 - Split Editor Click Focuses Console On That Editor Graph` implementation slice landed, recording that split-host editor activation now carries the clicked `editorViewportId` through the shared shell activation path so `ConsoleDock` can follow the clicked editor graph instead of stale ambient editor context and marking the focused Phase 1 checklist complete
1. 2026-04-01 17:19: Reworked `Phase 1` into a concrete implementation-ready first slice after chat clarified that the immediate cleanup is the left-versus-right split selection handoff, narrowing the first execution target to the rule that clicking a split-host `Spaghetti Editor` should make `ConsoleDock` focus the graph that editor is looking at while pushing the broader split-mode contract work into later slices
1. 2026-04-01 17:22: Tightened the first `Workspace 7.5-7` cleanup target after chat clarified the concrete split-plus-console expectation that when the user clicks the right split `Spaghetti Editor`, `ConsoleDock` should focus on the graph that editor is looking at, making that behavior the first explicit split-host plus console alignment rule in the phase doc
1. 2026-04-01 17:18: Added this future phase doc as the first larger `Workspace 7.5` cleanup target, carving the broad `Spaghetti Editor` split-mode and console-alignment concern out of the cleanup stack so the next planning surface can define how split-host editor behavior, focus truth, and console context should work together before the later ghost-preview, presentation-mode, popout, and visual-parity cleanup tasks

### Purpose

Use this phase to clean up how `Spaghetti Editor` split modes are supposed to work and how that split-host behavior should align with `ConsoleDock`.

The goal is:
- one clearer split-mode contract for `Spaghetti Editor`
- one clearer rule for how split-host editor focus and console context interact
- one better foundation for the later `Workspace 7.5-8` through `7.5-11` cleanup tasks

### Scope

This phase covers:
- split-host `Spaghetti Editor` behavior
- how split-host editor state should differ from floating and popout behavior
- how `ConsoleDock` should resolve graph, node, and object context when multiple split-host editors are present
- reducing remaining ambiguity around whether split mode is a host/layout concept, a presentation concept, or both

This phase does not cover:
- ghost preview rendering polish itself, which belongs in `Workspace 7.5-8`
- presentation-mode truth for `E`, `O`, collapse, and restore, which belongs in `Workspace 7.5-9`
- popout repair, which belongs in `Workspace 7.5-10`
- split-versus-floating visual parity, which belongs in `Workspace 7.5-11`
- broader AppShell architecture cleanup beyond the split-mode seam

## Doc Body

### Summary

`Workspace 7.5-7` is the first larger cleanup in the current `Workspace 7.5` follow-on ladder.

It exists because `Spaghetti Editor` split behavior is still carrying too much ambiguity:
- some split behavior still reads like host/layout truth
- some still reads like presentation truth
- console context can still feel loosely coupled when several editor surfaces are alive together

Before polishing ghost previews, presentation controls, popout, or visual parity, we should first define what split mode actually means and how the console is supposed to follow it.

Report-back note:
- the narrower live-repair execution in [Workspace_Phase Workspace-7.5-7A - Split Spaghetti Console Live Focus Repair.md](./Workspace_Phase%20Workspace-7.5-7A%20-%20Split%20Spaghetti%20Console%20Live%20Focus%20Repair.md) has now landed and been folded back here
- that follow-up resolved the main floating-to-split spaghetti console loop by fixing late root replay, restoring split-click publisher reliability after dock or split, tightening AppShell clear-source handling, and deduping hosted spaghetti activation noise
- the narrower Browser rollout in `Phase 2F` has now landed too, so the remaining work here is no longer console-context migration drift; it is whether any later `7.5.x` cleanup still needs a separate follow-on phase outside this ladder

### Locked Direction

`Workspace 7.5-7` should be:
- a split-mode semantics cleanup
- a console-context alignment cleanup
- a foundation-setting phase for the later `7.5.x` cleanups

`Workspace 7.5-7` should not be:
- a broad `ConsoleDock` redesign
- a visual polish phase
- a presentation-mode phase
- a hidden AppShell rewrite bucket

### Current Read

Current likely mismatch:
- the original live spaghetti console mismatch that justified `7.5-7A` is now resolved for the main user loop:
  - `load in`
  - `Enter Graph`
  - click floating `Spaghetti Editor`
  - drag into right split
  - click split `Spaghetti Editor`
- the durable console rule is now clearer:
  - deliberate viewer activation can still root the console
  - deliberate spaghetti activation now re-focuses console on that editor's graph without replaying stale root or spamming duplicate graph-focus lines
- the remaining ambiguity in `7.5-7` is no longer the old root-stuck spaghetti bug
- the Browser-side rollout from `Phase 2F` is now landed for the highest-signal Browser selection seams
- Browser selection paths now publish the same explicit `consoleWorkspaceContextHandoff` contract already used by viewer and spaghetti, while the older `target-selection` sync remains only as compatibility
- simple Browser content clicks are now cleaner too:
  - the explicit Browser handoff no longer gets replayed by a second legacy `target-selection` transition
  - simple Browser row selection no longer emits the redundant Browser-layer `Selected ...` log
  - `selectPart(null)` no longer logs `Selection cleared` when Browser click handling did not actually clear an active part
- docked Browser clicks now stay in-bounds too:
  - AppShell no longer treats the docked Browser panel root or body as an outside click
  - a valid docked Browser content click no longer falls through to a later `Returned to root` / `Root > Choose next [...]` replay
- Browser rows now dedupe pointer and click selection too:
  - the row-level one-click guard no longer gets cleared on `pointerup` before the later `click`
  - a single Browser content click no longer prints the same `Selected target`, `Select > ...`, and `... > Choose next [...]` transition twice just because the row handled both low-level events
- the remaining question is no longer Browser rollout; it is simply whether this phase needs any additional closeout maintenance before the next `7.5.x` task starts

Desired invariant:
- split mode should mean one clear thing in the workspace
- console context should resolve from a deliberate selected or active split-host editor rule instead of compatibility-shaped fallback chains
- repeated deliberate clicks between `Model Viewport`, split-host `Spaghetti Editor`, and later Browser surfaces should be meaningful console events, not generic hints that can be neutralized by stale selected-target or staged-session compatibility logic
- the previously broken spaghetti live loop should stay fixed while the remaining Browser rollout question is decided separately

### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

### Phase Sections

## [x] Phase 1 - Split Editor Click Focuses Console On That Editor Graph
### info
Purpose:
- land the first concrete split-plus-console alignment rule

Current read:
- the immediate user-facing bug is narrower than the whole split-mode contract
- when two split-host `Spaghetti Editors` are open, clicking the right-hand editor should make `ConsoleDock` focus the graph that right-hand editor is looking at
- today that handoff can still drift because console context is not consistently resolving from the clicked split-host editor

Main work:
- trace how clicking a split-host `Spaghetti Editor` updates active editor and graph context
- trace how `ConsoleDock` currently resolves graph focus after editor-surface activation
- tighten that handoff so the clicked split-host editor becomes the console graph truth
- add focused regressions for left-versus-right split selection behavior

Done shape:
- clicking either split-host `Spaghetti Editor` makes `ConsoleDock` focus the graph that editor is looking at
- console graph focus no longer drifts back to stale ambient editor or graph context during that handoff
- the shared shell activation path now carries the clicked `editorViewportId` before console context sync runs
- clicking back and forth between the model viewport and a split-host `Spaghetti Editor` now re-focuses the console on every deliberate click instead of letting a stale selected target survive the handoff

Locked direction:
- keep this first slice narrowly about click-to-console graph focus handoff
- do not widen it into general split ghost preview, presentation-mode, popout, or visual parity cleanup
- prefer tightening one existing activation/context seam over inventing a new console ownership model

### Questions / Decisions

#### [x] Question 1 - When multiple split-host editors are open, what should clicking one of them do to `ConsoleDock`?

##### Suggestion / Locked Answer
- clicking a split-host `Spaghetti Editor` should make `ConsoleDock` focus the graph that editor is looking at
- specifically, clicking the right split editor should move console graph focus to the right editor's graph instead of leaving it on the left editor or a stale ambient graph

##### Why
- this is the first concrete user-facing cleanup in `7.5-7`
- it gives the split-plus-console phase one narrow behavior to fix before broader split semantics are planned

#### [x] Question 2 - What should count as console graph-focus truth during this handoff?

##### Suggestion / Locked Answer
- the console should prefer the deliberately targeted or active split-host editor context
- it should not drift back to a generic ambient graph or node fallback when a concrete split-host editor is already known

##### Why
- the user experience gets muddy fast when multiple editors are visible and console actions feel detached from the editor they were working in

#### [x] Question 3 - What should stay out of scope for this first slice?

##### Suggestion / Locked Answer
- broader split-mode semantics
- ghost preview polish
- presentation-mode button semantics
- popout-specific repair
- broader visual parity polish

##### Why
- this first slice should stay small enough to actually ship and verify before the wider split-mode cleanup continues

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

Highest-signal seams:
- editor-surface activation when a split-host `Spaghetti Editor` is clicked
- any `setActiveEditorViewportId(...)` or equivalent graph-focus handoff path
- `ConsoleDock` graph-focus resolution after editor-surface activation
- any helper still preferring ambient active graph over the concretely clicked split-host editor

Implementation cut:
1. Trace what state changes fire when the user clicks the left versus right split-host `Spaghetti Editor`.
2. Identify where `ConsoleDock` currently resolves graph focus after that click.
3. Tighten the smallest activation or context seam so the clicked split-host editor's graph becomes console graph truth.
4. Add focused regressions for left-versus-right split editor clicks and console graph focus.

Checklist:
- [x] Trace the split-editor click activation path
- [x] Trace the console graph-focus resolution path
- [x] Tighten the smallest click-to-console handoff seam
- [x] Add focused regressions for left-versus-right split editor clicks
- [x] Keep the fix out of the later ghost-preview, presentation, popout, and visual-polish tasks

Verification:
- clicking a split-host editor causes `ConsoleDock` to focus that editor's graph instead of a stale ambient graph
- focused regression coverage in `src/app/AppShell.test.tsx` proves a right-hand split-host click activates that exact `editorViewportId`, updates the active graph, and requests console sync with `surface-activation`
- focused `AppShell` and `ConsoleDock` coverage now proves viewer clicks still request root sync when a shared selection exists, and that spaghetti `surface-activation` prefers the active spaghetti graph over a stale selected target

## [ ] Phase 2 - Console Workspace Context Compatibility
### info
Purpose:
- replace the remaining generic console sync compatibility path with one clearer workspace-context handoff contract

Current read:
- the spaghetti side of this compatibility lane is now substantially landed:
  - explicit console workspace handoff exists
  - `ConsoleDock` prefers that handoff
  - spaghetti activation is unified enough across split, floating, and popout paths to keep the console on the correct graph through the main live loop
- `7.5-7A` carried the temporary live repair needed to make that true in the composed app
- the remaining open work here is the later Browser-side rollout and the eventual demotion of the legacy reason-only compatibility path, not the earlier spaghetti root-stuck failure

Main work:
- define one explicit console workspace handoff payload that can describe what the shell wants the console to focus
- route viewer, spaghetti, and later Browser host activation through that handoff instead of relying primarily on bare sync reasons
- demote the current reason-only plus re-derivation path to compatibility fallback while the new handoff lands
- keep staged navigation, transform sessions, and sketch sessions working, but stop letting stale sessions or selected targets silently override deliberate workspace activation

Done shape:
- console context is driven first by one explicit workspace handoff contract
- repeated clicks between viewer, split-host spaghetti editors, and later Browser contexts become deterministic console refocus events
- the old generic `surface-activation` versus `surface-clear` path survives only as fallback compatibility until later cleanup can retire it

### Questions / Decisions

#### [x] Question 1 - Is the remaining problem still a narrow split-click bug, or a broader console compatibility issue?

##### Suggestion / Locked Answer
- treat it as a broader console compatibility issue
- the live code read shows that the split click itself is no longer the only seam; `ConsoleDock` still resolves context through a generic reason-only sync request and then re-derives target context from several competing store truths

##### Why
- this makes the next work honest
- otherwise we will keep patching click sites while the real priority and compatibility problem lives inside `ConsoleDock` and the app-store handoff contract

#### [x] Question 2 - What should become the new primary truth for console context during workspace-surface activation?

##### Suggestion / Locked Answer
- introduce one explicit `Console Workspace Context Handoff` payload published by the shell or host that tells console what to focus
- that payload should be able to carry:
  - `sourceSurface`
  - `editorViewportId`
  - `graphDocumentId`
  - `nodeId`
  - `selectedTarget`
  - `mode` such as `root`, `graph`, `node`, or `selection`
  - a sequence or activation token so repeated deliberate clicks are still meaningful

##### Why
- the current `ConsoleContextSyncReason` values are too weak
- they only say that something happened, not what the console should actually focus next

#### [x] Question 3 - What should happen to the current reason-only `consoleContextSyncRequest` path?

##### Suggestion / Locked Answer
- keep it temporarily as compatibility fallback
- do not try to delete it in the first implementation cut
- make the new explicit handoff path primary for workspace activation, then gradually demote the old path

##### Why
- `ConsoleDock` is entangled with staged navigation, transform flows, and sketch flows
- a two-step migration is safer than a one-shot rewrite

#### [x] Question 4 - Should repeated clicks on viewer or spaghetti surfaces count as meaningful console refocus events even when the resulting scope looks similar?

##### Suggestion / Locked Answer
- yes
- a deliberate workspace click should count as a meaningful console event even if the resulting scope is still `root` or still `graphSelected`
- the new handoff needs an activation token or equivalent freshness marker so `ConsoleDock` can react to repeated deliberate clicks instead of collapsing them into “same session, do nothing”

##### Why
- this is the exact user-facing expectation that still feels broken in workspace modes
- repeated clicks are part of how users move focus between surfaces

#### [x] Question 5 - What should stay out of scope for this phase?

##### Suggestion / Locked Answer
- do not redesign the whole staged-navigation system
- do not fold Browser ghost-preview, presentation-mode, popout, or visual-parity work into this phase
- do not treat this as the larger future AppShell refactor

##### Why
- the core issue is console compatibility with workspace-mode activation, not every console feature or every shell concern at once

### Subphases

#### [x] Phase 2A - Define Explicit Console Workspace Context Handoff
Purpose:
- add the new handoff contract to app state without deleting the legacy reason-only path yet

Current read:
- today `ConsoleContextSyncReason` only has `surface-activation`, `target-selection`, and `surface-clear`
- that is too coarse for workspace modes
- the real publisher seams already exist in the shell:
  - viewer activation from `ViewportWorkspaceHost` through `AppShell`
  - split-host spaghetti activation from `ViewportSurfaceRegistry` through `AppShell`
  - floating and popout spaghetti activation from `SpaghettiWindowHost`
- the missing piece is not another click detector; it is one explicit payload these publishers can send to console instead of only incrementing a coarse reason flag

Main work:
- add one explicit console workspace handoff type in `useAppStore`
- include source surface, graph or node identity, selection identity, target mode, and a sequence token
- keep the existing `consoleContextSyncRequest` as fallback compatibility for now
- teach the first workspace publishers to write that payload:
  - viewer root handoff from `AppShell`
  - spaghetti graph handoff from `AppShell` and spaghetti host wrappers
- do not make `ConsoleDock` consume it yet beyond any optional debug or passive plumbing needed for Phase 2B

Done shape:
- workspace hosts can publish an explicit console focus intent instead of only a generic reason
- the app store can represent repeated deliberate viewer or spaghetti clicks as distinct console handoff events
- `Phase 2B` can switch `ConsoleDock` to this path without having to invent the payload shape mid-implementation
- viewer and spaghetti activation now publish the new handoff payload with fresh `seq` values while the legacy reason-based sync path stays alive for compatibility

### Questions / Decisions

#### [x] Question 1 - What should the first explicit handoff payload be able to represent?

##### Suggestion / Locked Answer
- the first payload should be able to represent only the high-signal workspace cases we actually need immediately:
  - viewer root focus
  - spaghetti graph focus
  - spaghetti node focus when a concrete node is already known
- it should include:
  - `sourceSurface`
  - `mode`
  - `graphDocumentId`
  - `nodeId`
  - `editorViewportId`
  - `selectedTarget`
  - `seq`

##### Why
- this keeps `Phase 2A` small enough to ship
- Browser and more complex selection handoffs can be added later without blocking the first explicit compatibility seam

#### [x] Question 2 - Which publishers should be upgraded first?

##### Suggestion / Locked Answer
- upgrade viewer and spaghetti publishers first
- specifically:
  - `handleActivateViewerSurface(...)` in `AppShell`
  - `handleActivateSpaghettiSurface(...)` in `AppShell`
  - the spaghetti activation callers in `ViewportSurfaceRegistry` and `SpaghettiWindowHost`

##### Why
- these are the exact surfaces driving the currently broken user flow
- Browser can follow in `Phase 2C` once the new handoff path is proven

#### [x] Question 3 - Should `Phase 2A` change `ConsoleDock` behavior yet?

##### Suggestion / Locked Answer
- no, not as the primary goal
- `Phase 2A` should primarily add the explicit payload plus first publishers
- `ConsoleDock` can read it passively if that helps testing, but the real preference switch belongs in `Phase 2B`

##### Why
- this keeps the migration two-step and safer
- otherwise Phase 2A becomes half payload design and half console rewrite at the same time

#### [x] Question 4 - What should happen to repeated deliberate clicks?

##### Suggestion / Locked Answer
- every deliberate workspace click should publish a fresh handoff with a new `seq`
- even if the payload otherwise resolves to the same `mode` or `graphDocumentId`

##### Why
- repeated clicks are part of workspace navigation
- we need a real event channel, not just a memoized state snapshot

#### [x] Question 5 - What should stay out of scope for this first compatibility slice?

##### Suggestion / Locked Answer
- do not upgrade Browser publishers yet
- do not rewrite staged navigation
- do not remove `consoleContextSyncRequest`
- do not fold presentation-mode, popout, or ghost-preview cleanup into this slice

##### Why
- this first compatibility cut should only establish the new contract and its first shell publishers

High-signal seams:
- `ConsoleContextSyncReason` and `consoleContextSyncRequest` in `src/app/store/useAppStore.ts`
- the new explicit handoff type and setter in `src/app/store/useAppStore.ts`
- `handleActivateViewerSurface(...)` in `src/app/AppShell.tsx`
- `handleActivateSpaghettiSurface(...)` in `src/app/AppShell.tsx`
- spaghetti activation callers in `src/app/workspace/ViewportSurfaceRegistry.tsx`
- spaghetti activation callers in `src/app/hosts/SpaghettiWindowHost.tsx`

Implementation cut:
1. Add an explicit `Console Workspace Context Handoff` type plus store field and request method in `useAppStore`.
2. Make viewer activation publish a root or viewer-mode handoff with a fresh `seq`.
3. Make spaghetti activation publish a graph or node-mode handoff with the clicked `editorViewportId`, active graph, and active node context.
4. Keep the legacy `requestConsoleContextSync(...)` calls alive for now so existing console behavior does not regress during migration.
5. Add focused shell and store regressions that prove repeated viewer and spaghetti clicks emit fresh explicit handoff events with the expected payload.

Checklist:
- [x] Add explicit console workspace handoff state and type in `useAppStore`
- [x] Add a request or publish method for explicit console workspace handoff
- [x] Publish viewer root handoff from `AppShell`
- [x] Publish spaghetti graph or node handoff from `AppShell`
- [x] Keep legacy `consoleContextSyncRequest` intact as fallback compatibility
- [x] Add focused tests for emitted handoff payloads and repeated-click `seq` behavior
- [x] Keep Browser publisher work and `ConsoleDock` preference switching deferred to later subphases

Likely files:
- `src/app/store/useAppStore.ts`
- `src/app/AppShell.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/useAppStore.test.ts`

Verification:
- the store exposes one explicit console workspace handoff path that can represent viewer root, spaghetti graph, and later Browser selection contexts
- focused tests prove viewer and spaghetti activation publish the expected explicit handoff payloads with fresh sequence values on repeated clicks
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/store/useAppStore.test.ts`
- `npm.cmd run build`

#### [x] Phase 2B - Make ConsoleDock Prefer Explicit Workspace Handoff
Purpose:
- switch `ConsoleDock` to consume the explicit handoff first

Current read:
- `ConsoleDock` currently re-derives context from `workspaceSelection.selectedTarget`, `workspaceSelection.activeSurface`, spaghetti graph state, and the current staged session
- this is where stale compatibility state can still win
- after `Phase 2A`, `consoleWorkspaceContextHandoff` now exists and viewer plus spaghetti activation already publish it
- the real seam is the large `consoleContextSyncRequest` effect in `src/app/console/ConsoleDock.tsx`, which still starts from reason-only sync and then compares staged-session shape before deciding whether to do anything
- that means explicit workspace handoffs are still not primary truth yet, and repeated deliberate clicks can still be treated as a no-op if the resolved session looks unchanged

Main work:
- update `ConsoleDock` so explicit workspace handoffs outrank stale selected-target compatibility
- preserve sketch and transform special cases where appropriate
- use the handoff sequence token so repeated deliberate clicks are still meaningful
- keep `consoleContextSyncRequest` alive as fallback compatibility for non-upgraded callers
- only switch the handoff cases already published in `2A`: viewer root, spaghetti graph, and spaghetti node

Done shape:
- console refocus follows workspace activation deterministically
- repeated clicks between viewer and spaghetti surfaces re-focus the console every time
- `ConsoleDock` uses explicit viewer plus spaghetti handoffs first and only falls back to reason-only sync when no explicit handoff is available

### Questions / Decisions

#### [x] Question 1 - What should become the new priority order inside `ConsoleDock`?

##### Suggestion / Locked Answer
- explicit `consoleWorkspaceContextHandoff` should outrank `consoleContextSyncRequest.reason` for the upgraded viewer and spaghetti publishers
- the working order should become:
  1. explicit workspace handoff
  2. legacy reason-only sync
  3. existing staged-session compatibility fallback where still needed

##### Why
- this is the whole point of `2A`
- if reason-only sync stays primary, the new handoff is not actually the new truth

#### [x] Question 2 - What should happen when a fresh handoff resolves to the same visible scope as the current console session?

##### Suggestion / Locked Answer
- the fresh handoff `seq` should still count as meaningful
- `ConsoleDock` should not silently no-op a deliberate click just because the resolved scope, breadcrumb, or graph id matches the current session

##### Why
- the user expectation is that every deliberate workspace click re-focuses the console
- the current equality gate is one reason console still feels sticky

#### [x] Question 3 - Which special cases should stay protected during this preference switch?

##### Suggestion / Locked Answer
- preserve the existing sketch-plane pick, geometry-sketch draw, and transform-session protection rules unless the explicit handoff directly requires an override

##### Why
- those are the highest-risk console workflows
- `2B` should be a preference-order switch, not a sketch or transform redesign

#### [x] Question 4 - Which explicit handoff cases should `2B` cover first?

##### Suggestion / Locked Answer
- only the handoffs already published in `2A`:
  - viewer root
  - spaghetti graph
  - spaghetti node

##### Why
- this keeps `2B` tightly coupled to the shipped `2A` infrastructure
- Browser rollout belongs later in `2C`

#### [x] Question 5 - What should stay out of scope for `2B`?

##### Suggestion / Locked Answer
- do not upgrade Browser publishers yet
- do not remove `consoleContextSyncRequest`
- do not redesign `resolveConsoleWorkspaceContextSync(...)`
- do not widen into broader split ghost, popout, presentation, or visual cleanup

##### Why
- `2B` should be the smallest safe console preference migration

High-signal seams:
- the large `consoleContextSyncRequest` effect in `src/app/console/ConsoleDock.tsx`
- the equality guard around `areConsoleStagedNavigationSessionsEqual(...)` in `src/app/console/ConsoleDock.tsx`
- `resolveConsoleWorkspaceContextSync(...)` in `src/app/console/stagedNavigation.ts`
- the `consoleWorkspaceContextHandoff` field in `src/app/store/useAppStore.ts`
- focused regressions in `src/app/console/ConsoleDock.test.tsx`

Implementation cut:
1. Read `consoleWorkspaceContextHandoff` and track its last handled `seq` inside `ConsoleDock`.
2. Resolve explicit viewer-root and spaghetti graph or node handoff first.
3. Preserve the old `consoleContextSyncRequest` effect as fallback for non-upgraded callers.
4. Adjust the equality or no-op gate so a fresh explicit handoff can still re-focus console even when the resulting scope repeats.
5. Keep sketch, draw, and transform protection rules intact while switching preference order.
6. Add focused console regressions for:
   - repeated viewer clicks
   - repeated spaghetti graph clicks
   - alternating viewer and spaghetti clicks
   - stale selected-target no longer winning when an explicit handoff exists

Checklist:
- [x] Read `consoleWorkspaceContextHandoff` inside `ConsoleDock`
- [x] Make explicit handoff outrank legacy reason-only sync for upgraded surfaces
- [x] Treat fresh handoff `seq` values as meaningful even when scope repeats
- [x] Keep sketch and transform guards stable
- [x] Leave `consoleContextSyncRequest` alive as fallback compatibility
- [x] Add focused `ConsoleDock` regressions for viewer and spaghetti handoff preference
- [x] Keep Browser rollout and broader console redesign deferred to `2C` or later

Likely files:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/useAppStore.ts`

Verification:
- focused tests cover viewer-root handoff, spaghetti-graph handoff, repeated click cycles, and stale selected-target override cases
- live repeated clicks between viewer and spaghetti should now behave like real console re-focus events even when the visible scope repeats
- `src/app/console/ConsoleDock.tsx` now reads explicit `consoleWorkspaceContextHandoff` first, consumes fresh handoff `seq` values as meaningful events, and only falls back to `consoleContextSyncRequest` when no fresh explicit handoff exists
- `src/app/console/ConsoleDock.test.tsx` now proves explicit viewer-root and spaghetti-graph handoffs outrank stale selected-target compatibility and that repeated explicit spaghetti graph handoffs still re-focus the console
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx src/app/AppShell.test.tsx`
- `npm.cmd run build`

#### [x] Phase 2C - Unify Spaghetti Activation Publishers
Purpose:
- make every real spaghetti activation path publish the same workspace-console intent

Current read:
- even after `Phase 2B`, the user can still click a split-host `Spaghetti Editor` and watch console stay on `root`
- the deeper trace suggests the remaining problem is not only console preference order
- the shell wrapper paths in `AppShell`, `ViewportSurfaceRegistry`, and `SpaghettiWindowHost` already publish explicit handoffs
- but `SpaghettiPanel` and the editor-local interaction tree still change `activeEditorViewportId` and graph or node focus internally without consistently publishing matching workspace-console intent
- that leaves the system split between:
  - shell wrapper activation
  - editor-local active viewport changes
  - console focus intent
- so the next real job is to unify spaghetti publisher coverage before widening into Browser

Main work:
- identify every meaningful spaghetti activation site:
  - split-host wrapper activation
  - floating and popout shell activation
  - panel-root activation
  - editor-local graph switch or node-focus actions when they clearly represent deliberate user focus
- add one shared spaghetti activation helper or publisher seam that:
  - sets the active editor viewport when needed
  - sets the active workspace surface to `spaghetti`
  - publishes the canonical console workspace handoff
  - keeps legacy reason-based sync only as fallback
- route all spaghetti activation sites through that seam instead of letting panel-local state updates silently diverge from shell-level console intent
- add focused regressions for the exact live failure:
  - model viewport left
  - split-host spaghetti right
  - repeated back-and-forth clicks
  - console must leave `root` and follow the clicked spaghetti graph every time

Done shape:
- all real spaghetti activation paths publish one canonical workspace-console handoff
- clicking into a split-host, floating, or popout spaghetti surface no longer depends on whether the pointer event hit the shell wrapper or the panel-local interaction tree
- repeated viewer-versus-spaghetti clicks become deterministic and the console no longer gets stuck on `root` when the user is clearly focusing spaghetti

### Questions / Decisions

#### [x] Question 1 - Is the next real problem Browser rollout already, or incomplete spaghetti publisher coverage?

##### Suggestion / Locked Answer
- treat the next problem as incomplete spaghetti publisher coverage first
- the live repro still fails even after `ConsoleDock` prefers explicit handoffs, which means the remaining gap is that not every real spaghetti focus path publishes that handoff yet

##### Why
- this keeps the next slice honest
- otherwise `2C` becomes another vague rollout bucket and we skip over the actual broken seam the user is still hitting

#### [x] Question 2 - What should count as a meaningful spaghetti activation publisher?

##### Suggestion / Locked Answer
- any path where the user is deliberately focusing a spaghetti surface or changing the active spaghetti context should be able to publish the canonical workspace-console handoff
- that includes:
  - split-host wrapper clicks
  - floating and popout shell clicks
  - panel-root focus
  - graph switch and clearly deliberate node-focus changes when they are being used as the active editor context

##### Why
- the app currently treats spaghetti focus as partly a shell concern and partly a local panel concern
- the console will keep drifting until those routes share one publisher seam

#### [x] Question 3 - What should the next shared seam actually own?

##### Suggestion / Locked Answer
- one shared spaghetti activation helper should own:
  - active editor viewport selection
  - active workspace surface selection
  - explicit console handoff publishing
  - optional legacy reason-sync fallback

##### Why
- this prevents shell wrappers and panel-local code from each publishing only part of the intent

Likely files:
- `src/app/AppShell.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/AppShell.test.tsx`

High-signal seams:
- `handleActivateSpaghettiSurface(...)` in `src/app/AppShell.tsx`
- split-host spaghetti `onPointerDownCapture` in `src/app/workspace/ViewportSurfaceRegistry.tsx`
- floating and popout spaghetti activation in `src/app/hosts/SpaghettiWindowHost.tsx`
- panel-local `setActiveEditorViewportId(...)` and graph-change paths in `src/app/panels/SpaghettiPanel.tsx`
- the exact viewer-versus-spaghetti repeated-click repro in `src/app/console/ConsoleDock.test.tsx`

Implementation cut:
1. Extract one shared spaghetti activation helper in `AppShell` that owns active viewport selection, active workspace surface selection, explicit console handoff publishing, and the legacy reason-sync fallback.
2. Route the existing shell publishers through that helper:
   - split-host wrapper activation
   - floating shell activation
   - popout activation
3. Pass the helper or a narrow callback down so `SpaghettiPanel` can invoke the same activation flow for the panel-local paths that currently only call `setActiveEditorViewportId(...)`.
4. Upgrade only the clearly user-driven panel-local paths in this slice:
   - panel-root or canvas focus
   - graph switch
   - graph creation or bind actions that intentionally retarget the active editor context
5. Add focused regressions for:
   - viewer left plus split-host spaghetti right repeated clicks
   - shell-wrapper click versus panel-local interaction producing the same console graph focus
   - console leaving `root` when the user deliberately focuses spaghetti

Checklist:
- [x] Trace all live spaghetti activation publishers and local viewport-focus paths
- [x] Define one shared spaghetti activation helper or publisher seam
- [x] Route split-host, floating, and popout spaghetti activation through that seam
- [x] Route the necessary panel-local activation paths through that seam
- [x] Add focused regressions for viewer-versus-spaghetti back-and-forth clicks and root-stuck prevention
- [x] Keep Browser rollout and broader console redesign deferred to later subphases

Verification:
- the user can click back and forth between the model viewport and a split-host spaghetti surface and console no longer stays on `root`
- the same spaghetti surface can be focused through shell wrapper or panel-local interaction and console still resolves to the same graph or node context
- the doc now gives one clear next implementation slice for the still-broken spaghetti refocus seam instead of jumping prematurely to Browser rollout
- the shipped helper seam is small enough that `Phase 2D` can later widen Browser rollout without reworking spaghetti activation again
- `src/app/AppShell.tsx` now owns one shared spaghetti activation helper that sets active viewport and surface truth, publishes explicit console handoff, and preserves the legacy sync fallback for all upgraded spaghetti publishers
- `src/app/panels/SpaghettiPanel.tsx` now exposes panel-root activation plus panel-local graph or node focus callbacks through that same helper seam, while `src/app/workspace/ViewportSurfaceRegistry.tsx` routes split-host spaghetti activation through the panel instead of the outer wrapper alone
- focused regressions in `src/app/AppShell.test.tsx` and `src/app/panels/SpaghettiPanel.test.tsx` now prove nested split-host panel clicks and panel-root activation publish the spaghetti console handoff instead of leaving the console on `root`
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/panels/SpaghettiPanel.test.tsx src/app/hosts/SpaghettiWindowHost.test.tsx`
- `npm.cmd run build`

#### [x] Phase 2D - Direct Spaghetti Graph Focus Command
Purpose:
- make a deliberate split or floating spaghetti click drive console directly into the existing graph or node location model instead of another ambient activation hint

Current read:
- `Phase 2C` unified the spaghetti publishers, but the live user read still says the console can stay on `Root`
- that means the remaining gap is likely not “did a spaghetti handoff fire at all?” but “was the handoff specific enough to move console into the existing graph path?”
- the console already has a real staged-navigation destination for this:
  - `Root`
  - `Graph`
  - `graph_[n]`
  - and deeper node-selected scopes when needed
- so the next fix should stop treating a spaghetti click as a generic activation hint and instead publish or resolve:
  - `editorViewportId`
  - bound `graphDocumentId`
  - viewport-local selected node when present
  - direct target mode of `graph` or `node`

Main work:
- tighten the spaghetti handoff so it resolves the bound graph and viewport-local node directly from `editorViewportId` at publish time
- make `ConsoleDock` consume that direct graph or node target as an authoritative focus command into the existing graph-selected or node-selected staged-navigation path
- stop letting the resulting console move depend on later ambient reads of global `activeGraphDocumentId`, stale `selectedTarget`, or a lingering `root` session
- keep Browser rollout out of this slice until the split spaghetti click reliably leaves `Root`

Done shape:
- clicking a split or floating spaghetti surface drives console directly to `Graph > graph_[n]` for that editor viewport
- if the viewport has a concrete selected node and node-level focus is desired, console can land directly on the existing deeper node location instead
- the remaining open work after this slice is Browser rollout, not “why does spaghetti still stick on root”

### Questions / Decisions

#### [x] Question 1 - Does the console need a new navigation concept for this fix?

##### Suggestion / Locked Answer
- no
- use the existing graph-selected and node-selected console locations that already sit under the console's `Root -> Graph` model

##### Why
- this keeps the fix narrow and honest
- the gap is getting the split spaghetti click to drive the existing destination, not inventing a new console destination

#### [x] Question 2 - What should the spaghetti click publish or resolve directly?

##### Suggestion / Locked Answer
- the click should resolve from `editorViewportId` straight into:
  - `graphDocumentId`
  - viewport-local selected node if present
  - target mode of `graph` or `node`
- then publish that as a direct focus command instead of a generic “surface activation” style hint

##### Why
- this removes the remaining ambiguity around global active graph state and stale root compatibility

#### [x] Question 3 - What should stay out of scope for this slice?

##### Suggestion / Locked Answer
- Browser publisher rollout
- retiring the legacy compatibility path entirely
- any broader staged-navigation redesign beyond making the direct graph or node target authoritative for spaghetti clicks

##### Why
- the next job is still to make the spaghetti click leave `Root` honestly before widening the rollout

Likely files:
- `src/app/AppShell.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

High-signal seams:
- the shared spaghetti activation helper in `src/app/AppShell.tsx`
- viewport-local selected node resolution in `src/app/panels/SpaghettiPanel.tsx` and the spaghetti store selectors
- explicit handoff handling in `src/app/console/ConsoleDock.tsx`
- the graph or node session resolution inside `src/app/console/stagedNavigation.ts`
- the existing `createGraphSelectedSession(...)` and graph-target resolution path in `src/app/console/stagedNavigation.ts`, which should remain the destination rather than being reinvented

Implementation cut:
1. Tighten the spaghetti activation helper so it resolves direct graph or node target from `editorViewportId` at publish time, using the viewport-bound `graphDocumentId` and viewport-local selected node instead of leaning on later ambient graph reads.
2. Keep the existing explicit handoff contract, but make the spaghetti branch authoritative enough that `ConsoleDock` can immediately enter the existing graph-selected or node-selected staged-navigation destination without letting a lingering `Root` session survive.
3. Verify that the target lands in the current graph-selected path under the existing console location model rather than inventing any new navigation concept.
4. Add focused regressions for:
   - viewer left plus split spaghetti right leaving `Root` and landing on `Graph > graph_[n]`
   - repeated spaghetti clicks still re-focusing the same graph entry
   - node-selected cases using the existing deeper node path when a viewport-local node is present

Checklist:
- [x] Lock the direct graph or node target contract for spaghetti clicks
- [x] Resolve graph or node target from `editorViewportId` at publish time
- [x] Make `ConsoleDock` treat that direct spaghetti target as authoritative
- [x] Add focused regressions for `Root -> Graph > graph_[n]` handoff and repeated clicks
- [x] Keep Browser rollout deferred to the next subphase

Verification:
- clicking a split spaghetti editor from `Root` moves the console into that editor's graph path instead of leaving it on `Root`
- repeated clicks on the same spaghetti editor still count as meaningful re-focus events
- node-selected cases still use the existing console node path without inventing a new console model
- the fix lands by driving the already-existing graph-selected or node-selected staged-navigation path, not by adding a second console navigation system
- `src/app/AppShell.tsx` now resolves direct spaghetti graph and node target from `editorViewportId` and publishes that target through the explicit console handoff without depending on ambient `activeGraphDocumentId`
- `src/app/hosts/SpaghettiWindowHost.tsx` now passes the focused floating or popout `editorViewportId` into the same direct handoff path instead of publishing a floating spaghetti activation without a concrete viewport target
- focused regressions in `src/app/AppShell.test.tsx` and `src/app/console/ConsoleDock.test.tsx` now prove stale ambient graph state does not win over the clicked viewport binding and that explicit node handoffs land in the existing `graphNodeSelected` console path
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/console/ConsoleDock.test.tsx src/app/panels/SpaghettiPanel.test.tsx src/app/hosts/SpaghettiWindowHost.test.tsx`
- `npm.cmd run build`

#### [x] Phase 2E - Split-Host Outer Activation Fallback
Purpose:
- restore one reliable split-host spaghetti activation safety net so console refocus does not depend only on the inner panel event path

Current read:
- the live app still fails even after `Phase 2D`, but the Browser comparison now gives the clearest clue:
  - split-mode Browser clicks refocus console correctly
  - split-mode `Spaghetti Editor` clicks still do not
- that strongly suggests the next real gap is not the direct graph-target model anymore
- the remaining issue is more likely that the split-host spaghetti surface is not always publishing activation from the real outer host path
- `Phase 2C` removed the old outer split wrapper reliance in favor of panel-root and panel-local activation
- the new comparison suggests that cleanup went one step too far for the live split-host event path

Main work:
- add back an outer split-host spaghetti activation fallback in `ViewportSurfaceRegistry`
- keep the richer panel-local graph and node handoff from `Phase 2D`
- make the layers explicit:
  - outer split host says “this spaghetti surface is now active”
  - inner panel says “this exact graph or node target is now active”
- keep this slice narrow and avoid widening into Browser rollout until split-host spaghetti clicks reliably leave `Root`

Done shape:
- clicking anywhere meaningful in a split-host spaghetti surface reliably publishes spaghetti activation
- panel-local graph or node focus can still refine that activation with the richer direct target
- split-mode spaghetti click behavior becomes structurally aligned with the already-working Browser split-host activation model

### Questions / Decisions

#### [x] Question 1 - What does the Browser comparison imply about the remaining bug?

##### Suggestion / Locked Answer
- treat the Browser comparison as evidence that the remaining issue is the split-host publisher layer, not the console destination model
- Browser split mode already refocuses console correctly, so the next fix should make split-host spaghetti activation look more like Browser activation structurally

##### Why
- this keeps the next slice grounded in observed live behavior instead of chasing deeper console changes first

#### [x] Question 2 - What should the outer split-host fallback do versus the inner panel path?

##### Suggestion / Locked Answer
- the outer split-host fallback should only guarantee “this spaghetti surface is active”
- the inner panel path should keep owning the richer direct graph or node target

##### Why
- this preserves the direct-target work from `Phase 2D` while making the split-host event path more reliable

#### [x] Question 3 - What should stay out of scope for this slice?

##### Suggestion / Locked Answer
- Browser rollout
- legacy compatibility demotion
- any broader console redesign

##### Why
- the immediate job is still to make split-host spaghetti clicks leave `Root` honestly before widening the migration again

Likely files:
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

High-signal seams:
- the split-host spaghetti wrapper in `src/app/workspace/ViewportSurfaceRegistry.tsx`
- the shared spaghetti activation helper in `src/app/AppShell.tsx`
- the already-working Browser split-host behavior that should stay the baseline comparison

Implementation cut:
1. Restore an outer split-host spaghetti activation fallback in `ViewportSurfaceRegistry` so split-host clicks publish spaghetti activation even when the inner panel root path is not the first or only event seam reached.
2. Keep the richer panel-local graph and node handoff from `Phase 2D` so the outer fallback guarantees activation while the inner panel still refines the direct target.
3. Add focused regressions proving that split-host spaghetti activation now fires from the outer wrapper path and that this fallback does not break the richer direct graph or node handoff path.

Checklist:
- [x] Lock the Browser-comparison conclusion for the next slice
- [x] Lock the outer-fallback versus inner-direct-target layering rule
- [x] Restore a split-host outer activation fallback for spaghetti
- [x] Keep the `Phase 2D` direct graph or node handoff intact
- [x] Add focused regressions for split-host outer activation fallback
- [x] Keep Browser rollout deferred to the following subphase

Verification:
- clicking the split-host spaghetti surface now leaves `Root` even when the real click path does not rely only on the inner panel root
- the richer `Phase 2D` graph or node handoff still wins when panel-local focus information is available
- split-host spaghetti activation now behaves more like the already-working Browser split-host activation model
- `src/app/workspace/ViewportSurfaceRegistry.tsx` now restores an outer split-host `onPointerDownCapture` fallback for `Spaghetti Editor` surfaces and stops relying on split-host panel-root capture as the primary activation trigger
- focused `src/app/AppShell.test.tsx` regressions now click the real split spaghetti wrapper path and prove that wrapper activation still targets the clicked viewport graph even when stale ambient graph state exists or a viewport-local selected node must still refine the handoff
- `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/panels/SpaghettiPanel.test.tsx src/app/hosts/SpaghettiWindowHost.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

#### [x] Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion
Purpose:
- widen the new workspace-console handoff contract after direct spaghetti graph focus is truly stable

Current read:
- the spaghetti and viewer sides of the workspace-console handoff are now substantially landed
- the Browser side is still older:
  - several Browser selection and reveal paths still call `requestConsoleContextSync('target-selection')`
  - the highest-signal seams are in:
    - `src/app/panels/useBrowserPanelController.ts`
    - `src/app/panels/browserInteractions.ts`
    - `src/app/store/workspaceSelectionCommands.ts`
- that means Browser still reaches console primarily through the older reason-only compatibility path instead of the newer explicit workspace handoff model
- `Phase 2F` should now focus on upgrading those Browser publishers without reopening the spaghetti-side live repair work

Main work:
- wire Browser and any other justified workspace publishers into the explicit handoff
- leave the old reason-only sync path only for legacy or non-upgraded callers
- document what still remains deferred

Done shape:
- explicit workspace context handoff is the normal path across workspace-mode surfaces
- legacy reason-only sync is visibly secondary

### Questions / Decisions

#### [x] Question 1 - What is the next smallest honest Browser rollout target?

##### Suggestion / Locked Answer
- upgrade Browser selection and reveal publishers to emit explicit `consoleWorkspaceContextHandoff` payloads first
- do not widen into a broad Browser redesign or a full legacy-path deletion in the same slice

##### Why
- the Browser side is still mostly using `requestConsoleContextSync('target-selection')`
- this keeps `2F` focused on the console-handoff seam instead of reopening unrelated Browser behavior

#### [x] Question 2 - Which Browser code seams should `2F` inspect first?

##### Suggestion / Locked Answer
- inspect:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/panels/browserInteractions.ts`
  - `src/app/store/workspaceSelectionCommands.ts`
- those are the highest-signal places where Browser user actions currently publish selection-driven console sync

##### Why
- the current code trace shows those paths still leaning on the older `target-selection` compatibility reason

#### [x] Question 3 - What should the Browser-side explicit handoff describe?

##### Suggestion / Locked Answer
- Browser should publish the same kind of explicit workspace context payload already used by viewer and spaghetti:
  - `sourceSurface: 'browser'`
  - the concrete selected target
  - any graph or node context already implied by that target when available
  - a fresh `seq` so repeated deliberate Browser clicks still count as meaningful

##### Why
- this keeps Browser on the same contract instead of inventing a second Browser-only console route

#### [x] Question 4 - What should stay out of scope for `2F`?

##### Suggestion / Locked Answer
- do not remove `requestConsoleContextSync(...)` entirely
- do not redesign `resolveConsoleWorkspaceContextSync(...)`
- do not reopen the spaghetti live-repair chain
- do not widen into later visual or workspace-shell cleanup tasks

##### Why
- `2F` should be a Browser publisher rollout and compatibility demotion slice, not a final console rewrite

Likely files:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserInteractions.ts`
- `src/app/store/workspaceSelectionCommands.ts`
- `src/app/store/useAppStore.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/workspaceSelectionCommands.test.ts`

High-signal seams:
- Browser row click / select / reveal publishers in `src/app/panels/useBrowserPanelController.ts`
- shared Browser interaction helpers in `src/app/panels/browserInteractions.ts`
- the selection-command seam in `src/app/store/workspaceSelectionCommands.ts`
- explicit handoff handling already landed in `ConsoleDock`
- current Browser-focused tests that still only assert `requestConsoleContextSync('target-selection')`

Implementation cut:
1. Trace the Browser selection flows that currently call `requestConsoleContextSync('target-selection')`.
2. Add explicit Browser workspace handoff publishing for the highest-signal selection paths first.
3. Preserve the old `target-selection` sync call as fallback during rollout.
4. Update focused Browser and console tests so they assert the new explicit handoff payloads and keep the old sync path only as compatibility.
5. Re-run the focused Browser-plus-console suites before deciding whether any remaining legacy callers should stay deferred.

Checklist:
- [x] Upgrade Browser and the highest-signal Browser-owned workspace publishers to the explicit handoff
- [x] Keep legacy reason-only sync only for fallback compatibility
- [x] Add focused Browser-plus-console regressions once Browser handoffs are real
- [x] Keep the broader staged-navigation redesign and later visual tasks out of scope

Verification:
- Browser and the already-corrected viewer plus spaghetti publishers all use the same explicit console handoff contract
- the legacy reason-only sync path is clearly secondary and no longer the default workspace-mode truth
- focused Browser tests prove row selection and higher-signal Browser actions now emit explicit Browser handoff payloads before or alongside the legacy fallback sync
- `src/app/store/workspaceSelectionCommands.ts` now publishes `mode: 'selection'` explicit handoffs for shared Browser selection commits before the older `target-selection` sync fires
- `src/app/panels/browserInteractions.ts` now uses that shared handoff path for explicit Browser content selection and publishes one direct Browser `selection` handoff for graph-document row clicks after the Browser target is selected
- `src/app/store/workspaceIntents.ts` now upgrades Browser-owned object and reference activation intents onto the same explicit `selection` handoff contract while still preserving the old sync path as fallback
- focused Browser regressions in `src/app/store/workspaceSelectionCommands.test.ts`, `src/app/store/workspaceIntents.test.ts`, `src/app/panels/browserInteractions.test.ts`, and `src/app/panels/BrowserPanel.test.tsx` now prove the Browser rollout is real
- `npm.cmd test -- --run src/app/panels/BrowserPanel.test.tsx src/app/store/workspaceSelectionCommands.test.ts src/app/console/ConsoleDock.test.tsx`
- `npm.cmd test -- --run src/app/store/workspaceSelectionCommands.test.ts src/app/store/workspaceIntents.test.ts src/app/panels/browserInteractions.test.ts src/app/panels/BrowserPanel.test.tsx src/app/console/ConsoleDock.test.tsx`
- `npm.cmd run build`

## [x] Phase 3 - Final Confidence And Carry Cleanup Ordering
### info
Purpose:
- confirm the first click-focus cleanup and the broader contract read are solid before moving on to the later `7.5-8` through `7.5-11` tasks

Current read:
- the temporary `7.5-7A` live repair has now been folded back here
- the practical carry question is now answered:
  - yes, `Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion` is the next active task
- this phase no longer needs another separate confidence-only wait state before that Browser-side rollout begins

Main work:
- manually verify the cleaned split-host behavior
- re-check console alignment with multiple visible editors
- confirm the next tasks remain correctly sequenced

Done shape:
- the confidence and carry decision is explicit
- `Workspace 7.5-7` can now proceed directly to `Phase 2F` without leaving a half-open closeout lane behind

Checklist:
- [x] Re-run focused automated coverage
- [x] Manually verify split-host and console behavior
- [x] Keep later cleanup tasks explicit and separate

Verification:
- split-host semantics feel stable
- console follows the expected editor context
- clicking the right split `Spaghetti Editor` focuses the console on that editor's graph
- the previously broken floating-to-split spaghetti console loop remains clean after the `7.5-7A` fixes are folded back into the main read
- later `7.5-8` through `7.5-11` tasks still read as clean follow-ons rather than residue from this phase
- the next active task in this ladder is now explicitly `Phase 2F - Browser Publisher Rollout And Legacy Compatibility Demotion`

### Acceptance And Done Shape

`Workspace 7.5-7` is done when:
- the first split-editor click-to-console graph-focus handoff works honestly
- split mode has one clear broader behavioral contract
- console context has one clear broader rule when multiple split-host editors are open
- the explicit console handoff path covers shell-level, split-host fallback, and panel-level spaghetti activation before the later Browser rollout lands
- the later ghost-preview, presentation, popout, and visual-parity work can build on this phase instead of redefining it

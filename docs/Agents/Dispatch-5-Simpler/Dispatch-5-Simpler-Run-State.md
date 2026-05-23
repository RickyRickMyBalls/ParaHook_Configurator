# Dispatch 5 Simpler Run State

## Doc Header

### Doc History
1. 2026-05-22 15:51:36: Added this compact Dispatch 5 run-state template so active Manager loops can track the current objective, phase packet, Worker assignment, blockers, last accepted result, and next legal task without recreating a permanent dispatch history ledger.

### Purpose

This file is the compact active-state dashboard for Dispatch 5 Simpler.

Use it for:
- current objective
- active family docs
- active phase packet
- active Worker assignment
- blockers
- last accepted result
- next legal task

Do not use it for:
- a second changelog
- a permanent record of every Worker prompt
- duplicating completed phase checklists
- replacing family docs, `docs/CHANGELOG.md`, or `docs/Doc-Log.md`

## Doc Body

### Active Objective

- Status: complete
- User objective: finish all of `Extrude-8` so active Extrude profile selection hands keyboard focus to clean Console depth entry in both command-first and selected-first flows.
- Active family: `Extrude`
- Active vision/planning surface: `docs/Vision.md`
- Active generation/index surface: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md`
- Active family phase plan doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-8 - Command Flow Console Focus Cleanup.md`
- Active phase packet: `Extrude-8 / Phases 1-3 - Command Flow Console Focus Cleanup`
- Manager resume point: `Extrude-8` phases 1-3 implemented and verified; ready for user review or the next requested phase.

### Active Roles

- Manager: live user-facing Codex
- Worker: Manager-owned local implementation
- Separate spec agent: none active

### Current Phase Packet

- Phase: `Extrude-8 / Phases 1-3 - Command Flow Console Focus Cleanup`
- Scope: add a Console-owned input focus request seam, focus clean Console depth entry after active Extrude profile picks, focus clean Console depth entry when preselected profiles start Extrude directly at Depth, and lock shortcut/camera ownership proof around active Extrude numeric input.
- Exclusions: Extrude graph/runtime geometry semantics, multi-wire profile execution, broad Console staged-navigation redesign, new Extrude feature parameters, and broad camera shortcut redesign.
- Likely files or seams: `src/app/console/useConsoleStore.ts`, `src/app/console/ConsoleDock.tsx`, `src/app/console/useConsoleInteraction.ts`, `src/app/components/ViewerHost.tsx`, focused Console/Viewer/input-routing tests, Extrude family docs, `docs/CHANGELOG.md`, `docs/Doc-Log.md`.
- Verification: focused Extrude Console focus tests, ViewerHost profile-pick focus test, input-routing numeric/camera guard test, TypeScript, and production build passed.
- Build gate: passed.
- Tracking docs: updated `Extrude-8` phase doc, Extrude index, `docs/CHANGELOG.md`, and `docs/Doc-Log.md`.
- Stop condition: met; active Extrude reaches clean focused Console Depth input from both command-first and selected-first paths, and numeric depth entry remains owned by Console while focused.
- Approval mode: low-risk Manager-owned local implementation.

### Last Accepted Result

- 2026-05-23 17:58:13: Accepted `Extrude-8 - Command Flow Console Focus Cleanup` with a Console-owned input focus request seam, command-first viewport profile-pick focus handoff, selected-first clean Depth entry, focused shortcut/camera numeric-input proof, TypeScript, and production build.
- 2026-05-23 16:22:05: Accepted `Build-Path-12.2 - Timeline Selection Edit History` with user-driven master timeline selection Edit History entries, Ctrl+Z/Ctrl+Y selection restoration, graph-truth safety proof, focused tests, TypeScript, and production build.
- 2026-05-23 15:35:05: Accepted the Build Path selection-follow repair with accepted CAD/build event intake auto-selecting the newly committed timeline step, cancelled command selection preservation, focused tests, TypeScript, and production build.
- 2026-05-23 15:09:00: Accepted `Build-Path-12.1 - Graph Lifecycle Timeline Cards` with separate structural lifecycle card state, `Graph Created` and `Graph Loaded` intake, master timeline ordering, distinct card rendering, viewport-mask safety proof, focused tests, TypeScript, production build, and browser smoke coverage.
- 2026-05-23 13:54:15: Prepped `Build-Path-12.1 - Graph Lifecycle Timeline Cards` for explicit `Graph Created` and `Graph Loaded` Build Path cards, with lifecycle-card scope, implementation ladder, exclusions, and verification plan.
- 2026-05-23 12:45:30: Accepted `Build-Path-12 - Loaded Graph Build Path Reconstruction` with reconstructed Sketch/Extrude events from loaded graph structure, reconstructed dependency hints, graph-load runtime intake, focused tests, TypeScript, and production build.
- 2026-05-23 12:27:02: Prepped `Build-Path-11 - Parallel Lane Icon Layout` as a packet-only collaborative phase for drawing Parallel-mode branch-local icons in derived parallel lanes while preserving master timeline order, graph truth, and Edit History.
- 2026-05-23 10:21:56: Accepted `Build-Path-10 - Viewport Scrub Preview Masking` with a Build Path-owned preview read model, source-node fallback, default first-step preview alignment, presentation-only Model Viewport layer masking, focused tests, TypeScript, production build, and browser smoke coverage.
- 2026-05-23 10:06:28: Prepped `Build-Path-10 - Viewport Scrub Preview Masking` with a Phase 1 preview read-model packet, Phase 2 viewport masking handoff, and Phase 3 safety/browser proof plan.
- 2026-05-23 09:09:09: Accepted `Build-Path-9 - Compare Pin And Checkpoint Contracts` with explicit Compare source/target/read-model readiness, Pin/checkpoint persistence boundaries, worker checkpoint/cache owner routing, non-executable Compare/Pin/checkpoint replay proof, TypeScript, and production build.
- 2026-05-23 08:59:03: Accepted `Build-Path-8 - Branch From Here Contract` with branch-from-here readiness data, new graph-document destination policy, branch name preview, graph ownership/storage requirements, confirmation/Edit History policy, non-executable Branch proof, TypeScript, and production build.
- 2026-05-23 08:54:37: Accepted `Build-Path-7 - Restore Readiness Contract` with restore readiness data, missing graph snapshot/worker checkpoint requirements, confirmation/Edit History policy, non-executable Restore proof, TypeScript, and production build.
- 2026-05-23 01:38:53: Accepted `Build-Path-6 - Explicit Actions And Checkpoint Readiness` with checkpoint readiness reads, disabled planned Restore/Branch/Compare/Pin workspace affordances, scrub-trigger safety proof, Edit History safety proof, TypeScript, and production build.
- 2026-05-23 01:21:42: Accepted `Build-Path-5.1 - Dependency Proof And Follow-Up Routing` with a fresh Sketch to dependent Extrude recording-path proof, ready Parallel lane proof, Edit History safety proof, and new future owner docs for restore readiness, branch-from-here, compare/pin, and checkpoint readiness.
- 2026-05-23 00:39:55: Accepted `Build-Path-5 / Phases 2-3 - Branch Lane Rendering And Branch Local Playheads` with explicit graph dependency hints, dependency-backed branch lane rendering, classification readbacks, branch-local playheads, focused Build Path tests, TypeScript, and production build.
- 2026-05-22 23:13:04: Accepted `Build-Path-5 / Phase 1 - Parallel Mode Entry` with a workspace-hosted Master/Parallel switch, dependency-hints-unavailable read, master order preservation proof, Edit History redo safety proof, TypeScript, and production build.
- 2026-05-22 23:09:24: Accepted `Build-Path-4.1 - Viewport Dock Scrub Readback` with compact dock selected-step readback, previous/next controls, focused Edit History safety proof, TypeScript, production build, and browser verification against the live side-panel app.
- 2026-05-22 22:45:13: Accepted the `Build-Path-4` dependent Extrude source Sketch repair with missing source Sketch nodes backfilled before new accepted Extrude events, focused tests, TypeScript, and production build.
- 2026-05-22 21:20:57: Accepted the `Build-Path-4` live event population repair with committed live Sketch/Extrude console commands now feeding the Build Path runtime store, repeated commands receiving distinct live projection ids, cancelled summaries still skipped, focused tests, TypeScript, production build, and browser mounted-strip verification.
- 2026-05-22 21:07:40: Accepted `Build-Path-4` with Build Path-owned visible timeline selection, selected-step styling, selected event readback, focused Edit History/graph safety proof, build proof, and browser mounted-strip verification.

### Blockers

- Full `src/app/console/ConsoleDock.test.tsx` still has unrelated failures in older workspace-mode, graph, reference/transform, and sketch-plane expectations; the new Extrude selected-first focus test passes when run directly.
- Full `src/app/spaghetti/store/useSpaghettiStore.test.ts` still has unrelated OutputPreview expectation mismatches around normalized `publicationMode` fields; the focused graph-load tests for Build-Path-12 and Build-Path-12.1 pass.
- Existing in-memory Build Path events are not retroactively reordered; the source-Sketch backfill applies to new accepted dependent Extrude commits after the hot update.
- Existing in-memory Build Path events are not retroactively annotated with dependency hints; branch lanes appear for new accepted graph command summaries that emit dependency hints.
- Full `src/app/workspace/ViewportSurfaceRegistry.test.tsx` still has an unrelated Properties assertion failure: the existing Properties surface test expects `Object` text that is no longer present in that body. The targeted Build Path registry test from Build-Path-3 passes.

### Next Legal Task

Next legal task is user-guided follow-up after `Extrude-8` review.

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
- User objective: run the Dispatch 5 Simpler manager loop for `VCTS - 4 - Viewport-Local Toolbar Placement And Persistence`.
- Active family: `Viewport Command Toolbar Shell`
- Active vision/planning surface: `docs/Vision.md`
- Active generation/index surface: `docs/Human-Plans/Architecture/Templates/Viewport Command Toolbar Shell/Viewport-Command-Toolbar-Shell-Index.md`
- Active family phase plan doc: `docs/Human-Plans/Architecture/Templates/Viewport Command Toolbar Shell/Future/Viewport_Command_Toolbar_Shell_Phase VCTS - 4 - Viewport-Local Toolbar Placement And Persistence.md`
- Active phase packet: `VCTS - 4 / Phase 1 - Coordinate Owner Audit And Anchor Contract`
- Manager resume point: `VCTS - 4` is Manager-accepted complete under Dispatch 5.

### Active Roles

- Manager: live user-facing Codex
- Worker: Manager-owned local implementation
- Separate spec agent: none active

### Current Phase Packet

- Phase: `VCTS - 4 - Viewport-Local Toolbar Placement And Persistence`
- Scope: shared viewport-local right-anchor helpers, Transform right-anchor repair, Extrude right-anchor adoption, per-viewport manual placement persistence, Sketch follow-on routing, focused verification, and production build proof.
- Exclusions: broad Sketch session rewrite, detached/floating app-window placement, Spaghetti Editor window placement, command graph writes, preview semantics, accept/cancel behavior changes, and reset-to-anchor UI implementation.
- Likely files or seams: `src/app/components/useViewportFloatingToolPanel.ts`, `src/app/components/ReferenceTransformToolbar.tsx`, `src/app/components/ViewportOverlay.tsx`, `src/app/components/ViewerHost.tsx`, `src/app/workspace/workspaceShellTypes.ts`, `src/app/workspace/workspacePersistence.ts`, focused tests, VCTS family docs, `docs/CHANGELOG.md`, and `docs/Doc-Log.md`.
- Verification: passed focused floating-panel helper tests, Transform toolbar placement tests, workspace-store placement tests, Extrude toolbar tests, and production build; browser load smoke passed on `localhost:5173` after `127.0.0.1:5173` was blocked by the browser client.
- Build gate: passed.
- Tracking docs: updated VCTS-4 phase doc, VCTS family index, Dispatch 5 run state, `docs/CHANGELOG.md`, and `docs/Doc-Log.md`.
- Stop condition: met; Transform and Extrude use viewport-local right anchors and remembered manual placement while Sketch/reset work is honestly routed as follow-on.
- Approval mode: Manager-owned implementation accepted.

### Last Accepted Result

- 2026-05-26 06:32:45: Accepted `VCTS - 4 - Viewport-Local Toolbar Placement And Persistence` with shared viewport-local placement helpers, Transform and Extrude right-anchor migration, per-viewport command-toolbar manual placement persistence, focused tests, production build proof, and browser load smoke on `localhost:5173`.
- 2026-05-25 22:23:39: Accepted `Build-Path-16 / Phases 1-2 - Feature Edit Context Menu` with supported timeline/topology right-click edit menus, `edit sketch` and `edit extrude` labels, canonical Sketch Draw handoff, existing-node Extrude command-toolbar handoff with profile/depth prefill, focused tests, and production build proof.
- 2026-05-25 20:03:04: Accepted `VCTS - 3 - Command Panel Visual Structure Extraction` with shared `ViewportCommandPanel*` visual grammar components, Extrude toolbar body/readback/control/title-action migration, focused Extrude and Transform regression tests, shared floating helper tests, and production build proof.
- 2026-05-25 19:32:34: Accepted `VCTS - 2 - Floating Panel Behavior Unification` with shared `useViewportFloatingToolPanel` drag/resize/placement behavior, Extrude toolbar all-edge/corner resize adoption, Transform toolbar migration off local drag/resize math, Sketch follow-on routing, focused helper/toolbar tests, and production build proof.
- 2026-05-25 16:25:46: Accepted `Extrude-9 - Command Toolbar Node Control Unification` with live `Geometry/Extrude` node params as the active command toolbar source of truth, a reusable Extrude control model shared with `NodeView`, `ViewportOverlayToolPanel` toolbar shell adoption, ParaSlider/ParaSelect command controls, cancel rollback of reused-node params, focused Extrude tests, TypeScript, production build, and in-app browser reload smoke.
- 2026-05-25 15:07:48: Accepted `VCTS - 1 - Shared Command Panel Prep` after completing Phase 1 shell-owner read, Phase 2 Extrude shell prep contract, and Phase 3 post-Extrude cleanup route; `ViewportOverlayToolPanel` is locked as the first command-toolbar shell target, Extrude implementation is deferred to `Extrude-9`, and no runtime build was required.
- 2026-05-25 10:44:40: Accepted `Build-Path-15 / Phases 1-2 - Scrub Future Icon State` with presentation-only `past` / `current` / `future` state on linear timeline cards, Fusion-style subdued future icon styling, Parallel topology card/connector future dimming, focused tests, TypeScript, and production build.
- 2026-05-25 10:27:42: Accepted `Build-Path-11 / Phases 3-6 - Parallel Graph Polish And Closeout` with the workspace Parallel topology graph unboxed from nested panel chrome, top/center/bottom UI-only alignment controls, secondary collapsed lane readback, connector/card polish, focused tests, TypeScript, production build, and attempted browser smoke blocked by unavailable `iab`.
- 2026-05-25 10:06:57: Accepted `Build-Path-11 / Phase 2 - Parallel Icon Lane Rendering` with visible workspace topology icon cards, semantic-color SVG connector paths, branch-playhead selection, and focused `1 > 6 > 1` proof.
- 2026-05-25 09:48:43: Accepted `Build-Path-11 / Phase 1 - Parallel Lane Visual Model` with a derived topology layout read model, endpoint-aware dependency metadata, OutputPreview sink reconstruction, shared Spaghetti connector color semantics, and focused `1 > 6 > 1` proof.
- 2026-05-24 15:28:07: Accepted `Console 13 - Root Alias Shortcut Contract` with staged root alias truth, `S` as Sketch, `CA` as Camera, delayed `C` Console focus, Shortcut First plain alias sequences, Console First shifted alias sequences, focused tests, and production build.
- 2026-05-24 11:42:27: Accepted `Console 12 - Root New Graph Command` with root staged-navigation `New Graph`, `graph.new` execution, Spaghetti-owned graph document creation, shared workspace activation, focused staged-navigation/radio/Console runtime tests, and production build.
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

- In-app Browser smoke for `Build-Path-11` could not run because the Browser plugin reported `iab` unavailable, even though a local server was listening on port 5173.
- Full `src/app/console/ConsoleDock.test.tsx` still has unrelated failures in older workspace-mode, graph, reference/transform, and sketch-plane expectations; the focused Console 13 root alias shortcut tests pass.
- Full `src/app/spaghetti/store/useSpaghettiStore.test.ts` still has unrelated OutputPreview expectation mismatches around normalized `publicationMode` fields and reconstructed dependency metadata; the focused Extrude command tests pass.
- Full `src/app/components/ViewerHost.test.tsx` timed out during the `VCTS - 2` combined verification run; focused Extrude command toolbar and Extrude preview tests passed.
- Existing in-memory Build Path events are not retroactively reordered; the source-Sketch backfill applies to new accepted dependent Extrude commits after the hot update.
- Existing in-memory Build Path events are not retroactively annotated with dependency hints; branch lanes appear for new accepted graph command summaries that emit dependency hints.
- Full `src/app/workspace/ViewportSurfaceRegistry.test.tsx` still has an unrelated Properties assertion failure: the existing Properties surface test expects `Object` text that is no longer present in that body. The targeted Build Path registry test from Build-Path-3 passes.

### Next Legal Task

Next legal task is user visual review of Transform/Extrude toolbar placement or a follow-on VCTS cleanup lane for Sketch adoption and reset-to-right-anchor affordance.

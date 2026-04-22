# Edit-History Handoff - 2026-04-22 08:01

## Current Request

Continue the Edit-History manager loop until the explicit Edit-History generations are closed, while keeping exactly one retained Worker alive and around.

Retained Worker:
- Rawls: `019db36c-d315-78b3-83e4-4d1faf35fede`

Do not spawn additional workers. If worker help is needed, use `send_input` to Rawls.

## Latest User Concern And Repair

The user noticed that recent implementation closeouts were being placed in `docs/CHANGELOG.md` under `### Doc History` instead of as permanent numbered `## Doc Body` entries.

Repair completed:
- Promoted changelog Doc History records 181 through 193 into permanent body entries.
- Added `docs/CHANGELOG.md` entries `[1667]` through `[1679]`.
- Left the original Doc History records intact as audit trail.
- Added `docs/Doc-Log.md` entry `2882` documenting the repair.

Important rule going forward:
- Runtime/source/test/config behavior work must receive a real numbered `docs/CHANGELOG.md` body entry.
- Docs/planning changes must update `docs/Doc-Log.md`.
- Do not treat top-level `Doc History` records as a replacement for permanent changelog body entries.

## Current Edit-History State

Gen 1 is complete for current explicit supported seams:
- Canonical edit-history store and dispatch boundary.
- Graph node/wire/move/parameter undo and console parity.
- Node-owned feature stack, feature parameters, committed sketch edits, and draft/runtime exclusions.
- Browser/project organization plus accepted Import/Catalog commit entries.
- Committed Viewer Transform entries and transform dispatch/local-history alignment.
- Derived-reader proof, label/source/target reader contract, and later coverage routing.

Gen 2 current state:
- `Edit-History-Gen2-1` Durable Scene Presentation Undo Candidates is complete for current explicit scope.
- `Edit-History-Gen2-HLG-1` is complete.
- `Edit-History-Gen2-2` Productivity Content Undo Candidates is active.
- `Edit-History-Gen2-HLG-2` remains open.

Accepted `Gen2-2` productivity phases:
- Phase 1 ownership/coalescing proof.
- Phase 1.1 Notepad discrete note create/delete/pin/color entries.
- Phase 1.2 productivity text coalescing routing.
- Phase 1.2a Notepad text focus-session entries.
- Phase 1.2b Dashboard sticky-note text commit entries.
- Phase 1.3 Dashboard board organization coalescing routing.
- Phase 1.3a Dashboard lane create/rename/delete entries.
- Phase 1.3b Sticky Note Placement Gesture Entries.

Current selected next phase:
- `Edit-History-Gen2-2 / Phase 1.3c - Sticky Note Resize Entries`

Rawls has already completed prep for Phase 1.3c:
- Phase doc Doc History entry 32 at `2026-04-22 07:44:17`.
- Dispatch run-state entry 156 shows the prep assignment.
- Phase 1.3c prep focuses on DashboardSurface resize preview/pointer-up seams, raw `setStickyNoteFrame(...)` no-entry behavior, and affected-frame-only undo/redo restore.
- Lane-width proof remains deferred to Phase 1.3d.

## Next Safe Manager Step

Before sending implementation:
1. Manager should review the Phase 1.3c spec in:
   - `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-Gen2-2 - Productivity Content Undo Candidates.md`
2. Manager should inspect the live resize seams enough to approve or repair:
   - `src/app/workspace/DashboardSurface.tsx`
   - `src/app/dashboard/useDashboardStore.ts`
   - `src/app/store/dashboardBoardEditHistory.ts`
   - `src/app/store/dashboardBoardEditHistoryStore.test.ts`
3. If the spec is still good, send Rawls one implementation assignment for Phase 1.3c only.

Expected Phase 1.3c implementation boundaries:
- Add canonical history for completed sticky-note resize only.
- Keep live resize preview pointer movement history-free.
- Keep raw `setStickyNoteFrame(...)` history-free.
- Restore only affected note frame fields: `x`, `y`, `width`, `height`.
- Preserve unrelated lane, placement, parent, and later layout changes.
- Do not widen into lane-width resize, board commands, Notepad, workspace layout/preferences, history UI, checkpoints, branching, persistence architecture, Catalog, Pubwheel, runtime/cache/provider state, command transcript/recall, or collaboration.

Expected verification for Phase 1.3c:
- Focused Dashboard board/edit-history tests.
- Productivity readiness tests.
- Raw Dashboard store tests.
- Any existing DashboardSurface resize-focused UI tests if the implementation touches UI routing.
- `npm run build`.

## Known Verification Status

Most recent accepted runtime phase:
- `Edit-History-Gen2-2 / Phase 1.3b - Sticky Note Placement Gesture Entries`

Manager reran and accepted:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts`
- `npm.cmd test -- --run src/app/workspace/DashboardLaneEditHistory.test.tsx`
- `npm.cmd run build`

Build passed with known Vite warnings:
- `path` / `crypto` externalized by `occt-import-js`
- chunk-size warning

Changelog repair was docs-only, so no tests were run for that repair.

## Worktree Caution

The worktree is dirty with unrelated Catalog, Pubwheel, and prior Edit-History changes.

Do not revert or refactor unrelated dirty work. Treat unrelated dirty files as user/other-agent work unless directly required by the active Edit-History phase.

Relevant recent docs changed by the manager loop include:
- `docs/Agents/Dispatch-4-simple/Dispatch-4-Simple-Run-State.md`
- `docs/Human-Plans/Architecture/Edit-History/Edit-History-Gen2-Index.md`
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-Gen2-2 - Productivity Content Undo Candidates.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

## Process Rules To Preserve

- Keep one Worker: Rawls.
- Manager chooses one phase at a time.
- Worker prep edits only active phase docs and required tracking docs; no code during prep.
- Manager reviews live code seams before approving implementation.
- Worker implements one approved phase only.
- Worker runs focused tests first, then `npm run build`.
- Runtime changes update `docs/CHANGELOG.md` with a permanent numbered body entry.
- Docs changes update `docs/Doc-Log.md`.
- Added/renamed docs update `docs/Doc-Index.md`.
- If implementation coverage is partial, create a follow-up phase inside the same future doc instead of silently closing the goal.

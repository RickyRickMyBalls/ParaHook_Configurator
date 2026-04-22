# Edit History Gen2-2 - Productivity Content Undo Candidates

## Doc Header

### Doc History
48. 2026-04-22 08:50:11: Manager accepted proof-only `Edit-History-Gen2-2 / Phase 1.3f - Dashboard Cleanup Exclusion Proof`, closed `Edit-History-Gen2-HLG-2` for current explicit productivity-content undo coverage, kept lane-width runtime undo deferred until a safe completed-change boundary exists, and routed the retained Worker lane to `Edit-History-Gen2-3 / Phase 1 - Workspace Layout And Preference Ownership Proof` prep.
47. 2026-04-22 08:46:34: Implemented proof-only `Edit-History-Gen2-2 / Phase 1.3f - Dashboard Cleanup Exclusion Proof` by adding focused productivity readiness coverage for raw Dashboard reconcile/remove cleanup, proving cleanup creates no canonical entries, preserves redo, normalizes/prunes sticky-note layouts durably, keeps persistence scoped to lanes/layouts, and passing focused readiness/raw-store verification plus production build.
46. 2026-04-22 08:44:33: Manager approved proof-only `Edit-History-Gen2-2 / Phase 1.3f - Dashboard Cleanup Exclusion Proof` after confirming cleanup/reconcile/remove are downstream raw seams and accepting lane-width runtime undo as an explicit deferred commit-boundary gap that should not block `Edit-History-Gen2-HLG-2` closeout after proof acceptance.
45. 2026-04-22 08:43:04: Added Worker-ready prep for `Edit-History-Gen2-2 / Phase 1.3f - Dashboard Cleanup Exclusion Proof` after researching DashboardSurface reconcile effects, raw Dashboard cleanup store seams, layout normalization behavior, existing productivity readiness and Dashboard store proof coverage, and HLG-2 closeout conditions with lane-width runtime undo still deferred.
44. 2026-04-22 08:41:14: Manager accepted `Edit-History-Gen2-2 / Phase 1.3e - Dashboard Board Command Routing` after rerunning focused Dashboard board helper, DashboardSurface command routing, productivity readiness, and production build verification; retained `Edit-History-Gen2-HLG-2` open for cleanup exclusion proof and lane-width runtime deferral tracking.
43. 2026-04-22 08:38:38: Implemented `Edit-History-Gen2-2 / Phase 1.3e - Dashboard Board Command Routing` by adding command-owned Dashboard board placement history entries for explicit Align and Arrange Grid actions, routing DashboardSurface align/grid buttons through the wrapper, preserving x/y-only undo/redo boundaries for affected notes, keeping fit/camera, smart-align toggle, cleanup/reconcile/remove, lane width, and raw layout methods excluded, and passing focused helper/UI/readiness verification plus production build.
42. 2026-04-22 08:32:59: Manager approved `Edit-History-Gen2-2 / Phase 1.3e - Dashboard Board Command Routing` for narrow runtime implementation after accepting explicit align/grid entries first, command-owned x/y restore boundaries, existing placement-helper reuse only with owned-field safety, fit/camera and smart-align toggle exclusions, and cleanup/reconcile/remove split to later Phase 1.3f.
41. 2026-04-22 08:31:16: Added Worker-ready prep for `Edit-History-Gen2-2 / Phase 1.3e - Dashboard Board Command Routing` after researching DashboardSurface align/grid command seams, fit/camera and smart-align session state, effect-driven reconcile cleanup, raw layout cleanup, and the existing Dashboard placement history helper; recommended a runtime explicit align/grid command slice with cleanup/reconcile/remove exclusion split to a later Phase 1.3f.
40. 2026-04-22 08:29:58: Manager accepted proof-only `Edit-History-Gen2-2 / Phase 1.3d - Dashboard Lane Width Commit Boundary Proof` after rerunning focused productivity readiness, Dashboard store, and production build verification; retained `Edit-History-Gen2-HLG-2` open for lane-width runtime deferral tracking and remaining Dashboard board command planning.
39. 2026-04-22 08:26:14: Implemented proof-only `Edit-History-Gen2-2 / Phase 1.3d - Dashboard Lane Width Commit Boundary Proof` by extending focused productivity readiness and Dashboard store tests to prove raw lane-width writes are durable, no-entry, redo-preserving, scoped to lane records, and no-op for missing/non-adjacent/unchanged normalized widths, with production build verification passing.
38. 2026-04-22 08:24:36: Manager approved the proof-only `Edit-History-Gen2-2 / Phase 1.3d - Dashboard Lane Width Commit Boundary Proof` implementation spec after confirming lane-width pointermove writes durable raw lane width state, pointer-up only clears local resize state, and runtime lane-width undo remains blocked on a safe completed-change boundary.
37. 2026-04-22 08:22:46: Tightened `Edit-History-Gen2-2 / Phase 1.3d - Dashboard Lane Width Commit Boundary Proof` into a Worker-ready proof-only spec after researching DashboardSurface lane-resize pointerdown/pointermove/pointerup behavior, raw `setAdjacentLaneWidths(...)` store semantics, existing raw-store/readiness tests, and the lack of a completed-change boundary without pointer architecture changes.
36. 2026-04-22 08:21:44: Manager accepted `Edit-History-Gen2-2 / Phase 1.3c - Sticky Note Resize Entries` after rerunning focused Dashboard board history, productivity readiness, raw Dashboard store, and production build verification; retained `Edit-History-Gen2-HLG-2` open for lane-width proof and remaining Dashboard board command planning.
35. 2026-04-22 08:20:17: Repaired `Edit-History-Gen2-2 / Phase 1.3c - Sticky Note Resize Entries` proof coverage by extending the focused Dashboard board history test to move the resized note to a later lane after the resize entry, proving frame undo/redo preserves current lane placement while restoring only frame fields.
34. 2026-04-22 08:16:34: Implemented `Edit-History-Gen2-2 / Phase 1.3c - Sticky Note Resize Entries` by adding canonical Dashboard sticky-note frame resize history helpers, routing DashboardSurface resize pointer-up through the wrapper, proving affected-frame-only undo/redo with raw frame no-entry behavior and unrelated layout preservation, and passing focused Dashboard board/readiness/raw-store verification.
33. 2026-04-22 08:12:56: Manager approved `Edit-History-Gen2-2 / Phase 1.3c - Sticky Note Resize Entries` for narrow implementation after confirming DashboardSurface resize pointermove is preview-only, pointer-up currently commits through `setStickyNoteFrame(...)`, raw frame setters must remain history-free, affected-frame-only restore must preserve lane/parent/unrelated layouts, and lane-width resize remains split to Phase 1.3d.
32. 2026-04-22 07:44:17: Tightened `Edit-History-Gen2-2 / Phase 1.3c - Sticky Note Resize Entries` into a Worker-ready runtime spec after researching DashboardSurface resize preview/pointer-up seams, `setStickyNoteFrame(...)` raw store semantics, frame persistence tests, and affected-frame-only restore boundaries while keeping lane width proof split to Phase 1.3d.
31. 2026-04-22 07:43:21: Manager accepted `Edit-History-Gen2-2 / Phase 1.3b - Sticky Note Placement Gesture Entries` after rerunning focused Dashboard board/layout history, productivity readiness, raw Dashboard store, Dashboard lane routing, and production build verification; retained `Edit-History-Gen2-HLG-2` open for sticky-note resize, lane-width proof, and later board command planning.
30. 2026-04-22 07:39:44: Implemented `Edit-History-Gen2-2 / Phase 1.3b - Sticky Note Placement Gesture Entries` by adding canonical Dashboard sticky-note placement history helpers, routing DashboardSurface drag pointer-up through them, proving single-note, selected/multi-note, same-drop attachment, no-op, and raw layout no-entry behavior, and passing focused Dashboard board/readiness/raw-store verification plus production build.
29. 2026-04-22 07:35:43: Manager approved the repaired `Edit-History-Gen2-2 / Phase 1.3b - Sticky Note Placement Gesture Entries` prep after confirming completed drag/drop uses preview-only pointer movement with pointer-up authored placement commits, frame resize is split to Phase 1.3c, lane width proof is split to Phase 1.3d, and Dashboard local/session state remains excluded.
28. 2026-04-22 07:33:51: Repaired `Edit-History-Gen2-2 / Phase 1.3b` prep wording so the implementation-ready slice is explicitly `Sticky Note Placement Gesture Entries`, keeping same-drop attachment parent capture narrow and deferring sticky-note resize to Phase 1.3c plus lane-width proof to Phase 1.3d.
27. 2026-04-22 07:31:13: Tightened `Edit-History-Gen2-2 / Phase 1.3b - Dashboard Layout Gesture Entries` into a Worker-ready routing/spec section after researching DashboardSurface drag/drop, resize, lane-width, selection, and attachment seams; recommended the first implementation slice focus on completed sticky-note placement/lane movement gestures while splitting frame resize and lane-width proof into follow-ups.
26. 2026-04-22 07:29:56: Manager accepted `Edit-History-Gen2-2 / Phase 1.3a - Dashboard Lane Discrete Entries` after rerunning focused Dashboard lane helper, DashboardSurface lane routing, productivity readiness, raw Dashboard store, and production build verification; retained `Edit-History-Gen2-HLG-2` open for lane width resize and Dashboard layout gesture coalescing.
25. 2026-04-22 07:26:32: Implemented `Edit-History-Gen2-2 / Phase 1.3a - Dashboard Lane Discrete Entries` after adding Dashboard lane create/rename/delete canonical history wrappers, routing DashboardSurface lane callbacks through them, proving generated lane ids and later unrelated lanes/layouts survive create/delete undo-redo, proving raw Dashboard store methods remain history-free, and passing focused Dashboard lane/readiness/raw-store verification plus production build.
24. 2026-04-22 07:22:34: Manager approved the prepped `Edit-History-Gen2-2 / Phase 1.3a - Dashboard Lane Discrete Entries` spec for implementation with retained Worker Rawls, requiring lane create/remove restore to merge later unrelated lanes and layouts.
23. 2026-04-22 07:15:27: Tightened `Edit-History-Gen2-2 / Phase 1.3a - Dashboard Lane Discrete Entries` into a Worker-ready implementation spec for Dashboard lane create/rename/remove only, after researching DashboardSurface command boundaries, Dashboard store lane insertion/rename/remove semantics, lane deletion layout migration, raw store tests, and durable lane/layout restore requirements.
22. 2026-04-22 07:15:24: Manager accepted docs-only `Edit-History-Gen2-2 / Phase 1.3 - Dashboard Board Organization Coalescing Routing`, selected lane create/rename/remove as `Phase 1.3a`, and sent retained Worker Rawls the prep-only `Phase 1.3a - Dashboard Lane Discrete Entries` assignment.
21. 2026-04-22 07:13:08: Tightened `Edit-History-Gen2-2 / Phase 1.3 - Dashboard Board Organization Coalescing Routing` into a Worker-ready routing spec after researching DashboardSurface lane/layout mutation boundaries, Dashboard store normalization and persistence, pointer-finished drag/resize seams, and focused Dashboard verification paths.
20. 2026-04-22 07:12:44: Manager accepted `Edit-History-Gen2-2 / Phase 1.2b - Dashboard Sticky Note Text Commit Entries` after rerunning focused Dashboard sticky-note text, Notepad helper, productivity readiness, NotepadSurface, and production build verification; retained `Edit-History-Gen2-HLG-2` open and sent retained Worker Rawls the prep-only `Phase 1.3 - Dashboard Board Organization Coalescing Routing` assignment.
19. 2026-04-22 07:10:31: Implemented `Edit-History-Gen2-2 / Phase 1.2b - Dashboard Sticky Note Text Commit Entries` after routing DashboardSurface sticky-note title/body blur callbacks through the accepted field-targeted note text history helper, preserving DashboardStickyNoteCard local draft/Escape behavior, adding focused DashboardSurface title/body/Escape/no-op proof, and passing focused Notepad edit-history plus productivity readiness verification.
18. 2026-04-22 07:08:23: Manager approved the prepped `Edit-History-Gen2-2 / Phase 1.2b - Dashboard Sticky Note Text Commit Entries` spec for implementation with retained Worker Rawls, keeping Dashboard board drag/resize/lane history deferred.
17. 2026-04-22 07:05:42: Manager accepted `Edit-History-Gen2-2 / Phase 1.2a - Notepad Text Focus Session Entries` after rerunning focused Notepad helper, NotepadSurface, productivity readiness, raw Notepad store, and production build verification; retained `Edit-History-Gen2-HLG-2` open and sent retained Worker Rawls the prep-only `Phase 1.2b - Dashboard Sticky Note Text Commit Entries` assignment.
16. 2026-04-22 07:06:13: Tightened `Edit-History-Gen2-2 / Phase 1.2b - Dashboard Sticky Note Text Commit Entries` into a Worker-ready implementation spec after researching DashboardStickyNoteCard local draft blur/Escape behavior, DashboardSurface raw Notepad callback routing, accepted field-targeted text helper semantics, and likely focused Dashboard card/surface verification paths.
15. 2026-04-22 07:03:44: Implemented `Edit-History-Gen2-2 / Phase 1.2a - Notepad Text Focus Session Entries` after adding field-targeted Notepad title/body text history commits, wiring NotepadSurface focus/blur/Escape behavior while preserving raw live typing, proving Escape no-entry restore and blur one-entry behavior, and passing focused Notepad/productivity readiness tests plus production build verification.
14. 2026-04-22 07:01:32: Manager approved the prepped `Edit-History-Gen2-2 / Phase 1.2a - Notepad Text Focus Session Entries` spec for implementation with retained Worker Rawls, keeping Dashboard sticky-note text deferred to `Phase 1.2b`.
13. 2026-04-22 07:00:09: Manager accepted docs-only `Edit-History-Gen2-2 / Phase 1.2 - Productivity Text Coalescing Routing`, approved the split that implements Notepad focus-session text entries before Dashboard sticky-note text entries, and sent retained Worker Rawls the prep-only `Phase 1.2a - Notepad Text Focus Session Entries` assignment.
12. 2026-04-22 07:00:12: Tightened `Edit-History-Gen2-2 / Phase 1.2a - Notepad Text Focus Session Entries` into a Worker-ready implementation spec for NotepadSurface title/body focus-session commits only, with a field-targeted text helper shape, blur/Escape behavior, native text undo preservation, focused verification gates, and explicit Dashboard sticky-note text deferral.
11. 2026-04-22 06:57:36: Manager accepted `Edit-History-Gen2-2 / Phase 1.1 - Notepad Discrete Note Commit Entries` after rerunning focused Notepad edit-history, productivity readiness, raw Notepad store, and production build verification; retained `Edit-History-Gen2-HLG-2` open for text coalescing and Dashboard board coalescing.
10. 2026-04-22 06:58:06: Tightened `Edit-History-Gen2-2 / Phase 1.2 - Productivity Text Coalescing Routing` into a Worker-ready routing spec after researching NotepadSurface raw title/body `onChange` paths, DashboardStickyNoteCard local draft blur/Escape paths, existing Notepad edit-history helpers, and focused productivity readiness tests; recommended a split into Notepad focus-session commits first and Dashboard sticky-note blur commits second.
9. 2026-04-22 06:55:56: Repaired `Edit-History-Gen2-2 / Phase 1.1` Notepad create/delete restore order handling so undo/redo merges captured target order with current unrelated notes, added focused regressions proving later raw-created notes stay in `noteOrder` and `notesById`, and reran focused Notepad/readiness verification plus production build.
8. 2026-04-22 06:53:17: Implemented `Edit-History-Gen2-2 / Phase 1.1 - Notepad Discrete Note Commit Entries` after adding canonical create/delete/pin/color Notepad wrappers, routing NotepadSurface create/delete/pin buttons through them, proving targeted pin/color metadata undo preserves later title/body edits, verifying raw Notepad setters remain history-free, and passing focused Notepad/productivity readiness tests plus production build verification.
7. 2026-04-22 06:51:12: Manager approved the prepped `Edit-History-Gen2-2 / Phase 1.1 - Notepad Discrete Note Commit Entries` spec for implementation with retained Worker Rawls, adding the constraint that pin/color undo/redo must use targeted metadata restore rather than broad Notepad snapshots that could rewind later title/body edits.
6. 2026-04-22 06:48:48: Tightened `Edit-History-Gen2-2 / Phase 1.1 - Notepad Discrete Note Commit Entries` into a Worker-ready runtime spec for note create/delete/pin/color only, with Notepad snapshot helper boundaries, active-note fallback handling, raw setter exclusions, focused verification gates, and explicit deferral of title/body text coalescing.
5. 2026-04-22 06:47:24: Manager accepted `Edit-History-Gen2-2 / Phase 1 - Ownership And Coalescing Proof` after rerunning focused productivity readiness and production build verification; marked `Edit-History-Gen2-CLG-2` complete and advanced runtime productivity undo toward prep-only `Phase 1.1 - Notepad Discrete Note Commit Entries`.
4. 2026-04-22 06:45:47: Implemented proof-only `Edit-History-Gen2-2 / Phase 1 - Ownership And Coalescing Proof` with focused readiness tests proving raw Notepad and Dashboard productivity mutations are durable, history-free, and redo-preserving before wrappers exist, persistence payloads stay scoped to notes/order and dashboard lanes/layouts, production build verification passed, and runtime productivity undo remains deferred to follow-up coalescing phases.
3. 2026-04-22 06:43:40: Manager approved the prepped `Edit-History-Gen2-2 / Phase 1 - Ownership And Coalescing Proof` spec for proof-only implementation after confirming live Notepad raw text seams, Dashboard local draft and completed-gesture seams, persistence owners, and local UI/session exclusions.
2. 2026-04-22 06:41:00: Tightened `Edit-History-Gen2-2 / Phase 1 - Ownership And Coalescing Proof` into a Worker-ready proof-first spec after researching live Notepad notes, Dashboard lanes/sticky-note layouts, persistence seams, AppShell persistence bridges, and local Dashboard draft/selection/camera state boundaries.
1. 2026-04-22 04:12:09: Created this Gen 2 future planning surface for notepad, dashboard, and durable board organization undo candidates before any runtime implementation starts.

### Purpose

This doc routes productivity content that might later become canonical undo entries.

## Doc Body

### Owns

- notepad or dashboard text only after durable ownership and storage are explicit
- durable board/card/list organization only after the app has a stable authored owner
- later text coalescing direction for typed edits, such as one entry per semantic typing session instead of per keystroke
- later drag/drop coalescing direction for board organization, such as one entry per completed user drag

### Does Not Own

- transient notes, unsaved drafts, focus state, menu state, selection-only state, command transcript, command recall, runtime status, preview/cache/provider state, or collaboration
- Browser/project organization already covered by Gen 1
- history panel UI, persistence architecture, checkpoints, optional branching, Build Path comparison, or Gen 3 history productization

### Ownership / Storage Questions

- Is productivity content project-owned, user-owned, workspace-owned, or session-only?
- Which text surfaces are durable today, and which are local drafts?
- What confirms a text edit: blur, Enter, save, debounce, or explicit command?
- What confirms a board move: pointer release, keyboard command, menu command, or batch update?
- Can undo/redo restore content without capturing focus, selection, scroll, expansion, or active panel state?

### Acceptance Read

This candidate is implementation-ready only when a prep pass identifies concrete durable productivity owners, stable text/board commit APIs, coalescing rules, and focused exclusion proof for local UI/session state.

### No-Widening Rule

Do not make productivity surfaces canonical undo owners until storage and ownership are explicit. Do not capture focus, selection, command transcript, command recall, unsaved drafts, collaboration state, preview/cache/provider state, or broad dashboard architecture.

## Wishlist Organization

### High Level Goals

- [ ] `Edit-History-Gen2-HLG-2` - Evaluate productivity content as authored undo candidates only after storage, text coalescing, and board organization ownership are explicit.

### Codex Level Goals

- [x] `Edit-History-Gen2-CLG-2` - Define notepad/dashboard content ownership, storage, text coalescing, board drag coalescing, and exclusion proof before implementation.

## [x] `Edit-History-Gen2-2 / Phase 1` - `Ownership And Coalescing Proof`

### Phase 1 Summary

Purpose:
- prove which productivity text and board organization data is durable authored state before any canonical productivity undo entries are added
- separate persistent note/dashboard content from workspace-local focus, selection, scroll/camera, menu, draft, and shell placement state
- define the smallest future runtime slices and coalescing rules for text and board/sticky-note interactions

Owns:
- ownership/storage proof for current Notepad and Dashboard productivity data
- text coalescing design for note title/body edits
- drag/resize/lane coalescing design for dashboard sticky-note organization
- focused exclusion test plan for local UI/session state
- routing decision for whether the next implementation should remain proof-only or split into runtime subphases

Does Not Own:
- runtime undo implementation
- Notepad/Dashboard UI redesign
- broad dashboard, notepad, board architecture, or collaboration work
- native text-input undo changes
- command transcript/recall, Browser/project organization, history UI, persistence architecture, checkpoints, branching, Build Path comparison, preview/cache/provider state, or unrelated workspace changes

Current Live Seams:
- `src/app/notepad/useNotepadStore.ts`
  - durable note content lives in `notesById`, `noteOrder`, and `activeNoteId`
  - authored note operations are `createNote(...)`, `renameNote(...)`, `updateNoteBody(...)`, `deleteNote(...)`, `setNotePinned(...)`, and `setNoteColorPreset(...)`
  - `renameNote(...)` and `updateNoteBody(...)` directly mutate persisted note content today, while `setActiveNoteId(...)` is selection-like state that should be excluded from canonical content undo unless a later phase deliberately treats active note as durable productivity state
- `src/app/notepad/notepadPersistence.ts`
  - durable storage key is `parahook.notepad.notes.v1`
  - persisted state includes note records, note order, and active note id
  - normalization handles missing/invalid note fields, default colors, order repair, and active-note fallback
- `src/app/notepad/NotepadSurface.tsx`
  - title `<input>` calls `renameNote(...)` on every `onChange`
  - body `<textarea>` calls `updateNoteBody(...)` on every `onChange`
  - this preserves native text editing locally but has no semantic commit boundary yet; runtime undo should not route this path without a focus-session/debounce/save boundary
  - create/delete/pin are discrete button operations and possible later runtime candidates after ownership proof
- `src/app/dashboard/useDashboardStore.ts`
  - durable board organization lives in `lanes` and `stickyNoteLayoutsByNoteId`
  - authored dashboard operations include `createLane(...)`, `createLaneAfter(...)`, `renameLane(...)`, `removeLane(...)`, `setAdjacentLaneWidths(...)`, `setStickyNotePlacement(...)`, `setStickyNotePlacements(...)`, `setStickyNoteFrame(...)`, `setStickyNoteAttachmentParent(...)`, and `removeStickyNoteLayout(...)`
  - store paths normalize lane order, lane width, note placement, note frame size, lane fallback, parent attachment cleanup, and cycle prevention
- `src/app/dashboard/dashboardPersistence.ts`
  - durable storage key is `parahook.dashboard.widgets.v4`
  - persisted state includes lanes and sticky-note layouts only
  - dashboard persistence excludes local lane camera, current drag preview, resize preview, selection box, selected note ids, open menus, and floating/popout shell placement
- `src/app/workspace/DashboardSurface.tsx`
  - Dashboard has many local UI/session states: lane camera/pan/zoom, selected note ids, selection box, drag preview, resize preview, panning/resizing markers, editing lane title draft, smart-align toggles, and lifted sticky note id
  - completed pointer-up paths call durable store seams such as `setStickyNotePlacements(...)`, `setStickyNoteAttachmentParent(...)`, and `setStickyNoteFrame(...)`
  - lane resize currently updates `setAdjacentLaneWidths(...)` during pointer movement, so a runtime phase needs explicit coalescing rather than per-tick history
  - lane rename has blur/Enter/Escape-style commit/cancel semantics through local draft state
- `src/app/workspace/DashboardStickyNoteCard.tsx`
  - sticky note title/body edits use local drafts and commit on blur through `onRenameNote(...)` / `onUpdateNoteBody(...)`
  - Escape cancels title/body drafts, preserving the existing native text-input-local behavior while editing
  - color and unpin actions are discrete operations over note metadata
- `src/app/AppShell.tsx`
  - hydrates and writes Notepad/Dashboard persistence based on `notepadPersistence` and `dashboardPersistence` toggles
  - persistence bridge is not itself a canonical undo owner and should remain outside Phase 1 runtime scope
- Existing focused tests:
  - `src/app/notepad/useNotepadStore.test.ts`
  - `src/app/dashboard/useDashboardStore.test.ts`
  - `src/app/store/uiPrefsStore.test.ts`
  - `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
  - `src/app/workspace/HomePageSurface.test.tsx` and `homePageStorageTransparency.test.ts` cover persistence toggles/storage visibility

First-Pass Decisions:
- Phase 1 should be proof-only. The app has durable Notepad and Dashboard owners, but text and drag coalescing boundaries are uneven enough that runtime undo should split after ownership proof.
- Notepad main-surface title/body inputs are not runtime-ready for canonical undo because they call raw store setters on every keystroke.
- Dashboard sticky-note title/body cards are closer to runtime-ready because they use local drafts and blur/Escape behavior, but they share the Notepad note owner and should be proven with Notepad ownership before runtime wrappers are added.
- Dashboard board/sticky-note organization is durable, but drag, resize, lane-width, and alignment operations need explicit completed-gesture coalescing before runtime history.
- Notepad create/delete/pin/color and Dashboard lane create/remove/rename may be future discrete runtime slices, but Phase 1 should prove raw no-entry/redo and durable restore payloads first.
- Active note id, selected note ids, selection boxes, lane cameras, drag/resize previews, open menus, focus, scroll, floating/popout host rects, and workspace surface placement are excluded from productivity content undo.

Decision Table:

| Candidate | Current durable owner | Current commit/coalescing seam | Phase 1 decision | Later route |
| --- | --- | --- | --- | --- |
| Notepad title text | `useNotepadStore.notesById[noteId].title` | `NotepadSurface` raw `onChange` calls `renameNote(...)` per keystroke | proof-only; not runtime-ready from main Notepad surface | split to a focus-session/debounce/save runtime phase that preserves native text undo |
| Notepad body text | `useNotepadStore.notesById[noteId].body` | `NotepadSurface` raw `onChange` calls `updateNoteBody(...)` per keystroke | proof-only; not runtime-ready from main Notepad surface | split to text coalescing phase; consider one entry per focus session or explicit save |
| Notepad create/delete | `notesById` and `noteOrder` | button-driven store calls `createNote(...)` / `deleteNote(...)` | proof-only; durable and discrete but needs restore payload/no-entry proof | possible first runtime productivity slice if Manager wants small discrete note entries |
| Notepad pin/color | note metadata plus Dashboard visibility/readers | discrete `setNotePinned(...)` / `setNoteColorPreset(...)` | proof-only; durable but crosses Dashboard reader behavior for pinned notes | possible runtime metadata slice after note snapshot helper exists |
| Dashboard sticky-note title/body | shared Notepad note owner | `DashboardStickyNoteCard` local drafts commit on blur and cancel on Escape | proof-only; likely safer than Notepad main surface but shares note owner | possible text coalescing runtime slice after Notepad owner proof |
| Dashboard lanes | `useDashboardStore.lanes` | create/remove/rename discrete or blur/Enter lane-title commits; lane width updates during drag | proof-only; lane name/create/remove are promising, lane width needs coalescing | split discrete lane operations from lane-width drag coalescing |
| Dashboard sticky-note placement/lane/attachment | `stickyNoteLayoutsByNoteId` | pointer-up calls `setStickyNotePlacements(...)` and `setStickyNoteAttachmentParent(...)`; live preview is local state | proof-only; likely runtime candidate with one entry per completed drag | later board drag coalescing phase |
| Dashboard sticky-note frame size | `stickyNoteLayoutsByNoteId[noteId].width/height` | pointer-up calls `setStickyNoteFrame(...)`; live preview is local state | proof-only; likely runtime candidate with one entry per completed resize | later board resize coalescing phase |
| Dashboard lane camera/pan/zoom | component-local state in `DashboardSurface` | wheel/pointer update local React state | excluded; not durable content | no canonical undo |
| Dashboard selection/focus/menu/lift state | component-local state in `DashboardSurface` / `DashboardStickyNoteCard` | local React state and event handling | excluded; session/UI state | no canonical undo |
| Dashboard/Notepad floating window rects | host-local refs/state in `DashboardWindowHost` / `NotepadWindowHost` | local pointer drag state | excluded here; workspace layout belongs to Gen2-3 if promoted | Gen2-3 workspace layout/preference routing |

### Phase 1 Implementation Spec

Exact First Code Cut / Proof-Only Cut:
- add focused proof tests only; do not add runtime productivity history wrappers or canonical entries
- preferred proof surface:
  - extend or add a narrow `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - use `src/app/notepad/useNotepadStore.ts`, `src/app/dashboard/useDashboardStore.ts`, and persistence serializers directly
  - avoid broad `NotepadSurface` / `DashboardSurface` UI tests unless store-level proof cannot honestly prove the boundary
- prove raw Notepad note operations mutate durable state, create no canonical entries, and preserve redo:
  - create, rename, body update, delete, pin, and color
  - note order and active-note fallback behavior should be recorded as current raw behavior, not canonical undo ownership
- prove raw Dashboard lane/sticky-note layout operations mutate durable state, create no canonical entries, and preserve redo:
  - create/rename/remove lane
  - lane widths
  - sticky-note placement/frame/attachment/layout cleanup
- prove persistence boundaries:
  - Notepad serializes note records/order through `notepadPersistence`
  - Dashboard serializes lanes/layouts through `dashboardPersistence`
  - persistence toggles live in `uiPrefsStore` but are not productivity content entries
- prove exclusion boundaries where feasible:
  - Dashboard local lane camera/selection/preview state is not part of `serializeDashboardState(...)`
  - Notepad/Dashboard floating window host rects are local host state, not productivity content
  - command transcript/recall and Browser/project organization are not part of Notepad/Dashboard persistence

Likely Files For Later Proof:
- `src/app/store/productivityContentEditHistoryReadiness.test.ts` or a focused sibling near store tests
- `src/app/notepad/useNotepadStore.test.ts` only if existing store proof is extended directly
- `src/app/dashboard/useDashboardStore.test.ts` only if existing store proof is extended directly
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx` only if persistence toggles need regression coverage
- `src/app/workspace/DashboardSurface.test.tsx` only if completed drag/resize UI coalescing cannot be proven through store seams, and only in a later runtime/coalescing phase
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during proof/test implementation closeout

No-Widening Rule:
- do not add runtime undo wrappers in Phase 1
- do not make raw Notepad or Dashboard setters historyful
- do not change native text-input-local undo, focus, selection, scroll, menu, draft, camera/pan/zoom, drag-preview, resize-preview, or shell placement behavior
- do not touch command transcript/recall, Browser/project organization, Catalog/Pubwheel, preview/cache/provider state, Build Path comparison, history UI, persistence architecture, collaboration, checkpoints, branching, or unrelated workspace surface work
- do not refactor NotepadSurface, DashboardSurface, DashboardStickyNoteCard, AppShell persistence, workspace host windows, or persistence serializers for proof setup

No-Op / Redo Rules For Later Proof:
- raw productivity operations must create no canonical entries in Phase 1
- raw no-op operations must preserve redo and not invalidate canonical redo
- later runtime note text entries must collapse typing into one semantic entry and preserve native text-input-local undo while focused
- later runtime board drag/resize entries must commit at completed gesture boundaries, not every pointermove
- restore payloads must not include focus, selected note ids, lane camera, selection box, drag/resize preview, open menus, scroll, floating/popout host rects, command transcript/recall, or workspace surface placement

Implementation Risks:
- Notepad main text inputs write raw store state on every keystroke, so adding runtime undo there without a focus-session draft would spam history or break native text undo.
- Dashboard sticky-note text has better local draft semantics, but it writes the same Notepad owner as the main surface; runtime wrappers must avoid duplicate or inconsistent labels across surfaces.
- Dashboard lane width currently mutates during pointer movement, while sticky-note drag/resize commits on pointer-up; runtime board undo should not assume every dashboard operation already has a completed boundary.
- Dashboard board state has many local UI states that look like product behavior but are not persisted content.
- Active note id is persisted today, but it behaves like selection/navigation; Phase 1 should prove it exists and then keep it out of content undo until Manager explicitly promotes it.

Checklist:
- [x] Prove Notepad records/order are durable productivity state.
- [x] Prove Dashboard lanes/sticky-note layouts are durable productivity organization state.
- [x] Prove raw Notepad operations are history-free and redo-preserving before wrappers exist.
- [x] Prove raw Dashboard organization operations are history-free and redo-preserving before wrappers exist.
- [x] Prove Notepad and Dashboard persistence serializers exclude local UI/session state.
- [x] Identify text controls that need focus-session/debounce/save coalescing before runtime.
- [x] Identify board drag/resize/lane-width paths that need completed-gesture coalescing before runtime.
- [x] Preserve native text-input undo, focus/selection/scroll/menu/session state, command transcript/recall, collaboration, preview/cache/provider state, Browser/project organization, history UI, persistence architecture, checkpoints, branching, and Build Path comparison boundaries.

Focused Verification For Later Proof:
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` if a new proof file is added
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts` if Notepad store tests are touched
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` if Dashboard store tests are touched
- `npm.cmd test -- --run src/app/store/useUiPrefsPersistenceBridge.test.tsx -t "notepad|dashboard"` only if persistence bridge behavior is touched

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- proof/test implementation later updates `docs/CHANGELOG.md`
- proof/test implementation later updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- proof/test implementation later updates `docs/Doc-Log.md`
- do not update the Gen2 index or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if proof requires runtime undo wrappers instead of negative tests
- stop if Notepad text coalescing would require a broad editor/input rewrite
- stop if Dashboard drag/resize coalescing requires broad Dashboard architecture or pointer model changes
- stop if restore payloads would need focus, selection, scroll, lane camera, preview/draft, command transcript/recall, shell placement, workspace layout, Browser/project, persistence architecture, collaboration, checkpoints, branching, or Build Path state
- stop if implementation would touch unrelated Catalog/Pubwheel or prior Edit-History work

Done shape:
- Phase 1 prep is done when live productivity owners, durable storage, raw seams, coalescing gaps, exclusion boundaries, focused verification, build gate, and later split recommendations are explicit.
- Phase 1 proof implementation will be done when focused tests prove current raw Notepad/Dashboard productivity operations are history-free/redo-preserving, persistence payloads contain only durable productivity content, local UI/session state is excluded, and docs/tracking are updated.

Acceptance Mapping:
- Manager accepted `Edit-History-Gen2-2 / Phase 1` on 2026-04-22 06:47:24 after rerunning focused productivity readiness and production build verification.
- `Edit-History-Gen2-CLG-2` is complete after focused proof tests confirmed ownership/storage/coalescing boundaries and exclusions.
- `Edit-History-Gen2-HLG-2` remains open for runtime productivity undo phases.
- Recommended next Manager action is prep-only `Phase 1.1 - Notepad Discrete Note Commit Entries`, the smallest first runtime slice before text coalescing.
  - Notepad discrete note operations should cover create/delete/pin/color only if they can stay one-entry and avoid text coalescing.
  - Notepad/Dashboard text focus-session coalescing for title/body edits.
  - Dashboard board drag/resize/lane organization coalescing for completed gestures.

Closeout:
- Added `src/app/store/productivityContentEditHistoryReadiness.test.ts`.
- Focused proof covers raw Notepad create/rename/body/delete/pin/color mutations, raw Dashboard lane/layout/frame/attachment cleanup mutations, redo preservation, and canonical no-entry behavior before wrappers exist.
- Persistence proof confirms Notepad serializes note records/order plus the current persisted `activeNoteId` fallback, while Dashboard serializes only lanes and sticky-note layouts.
- Dashboard component-local lane camera, selection, selection box, drag preview, resize preview, menu, floating rect, and shell placement state remain excluded by persistence boundary and are not promoted to canonical productivity undo.
- Runtime productivity undo entries remain deferred; this phase adds proof only.

Verification:
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed with 3 tests.
- `npm.cmd run build` passed with known Vite warnings about externalized `path`/`crypto` from `occt-import-js` and large chunks.

## [x] `Edit-History-Gen2-2 / Phase 1.1` - `Notepad Discrete Note Commit Entries`

### Phase 1.1 Summary

Purpose:
- add the smallest runtime productivity undo slice by routing Notepad discrete note commands through canonical edit history
- keep title/body text editing and all text coalescing deferred
- preserve raw Notepad store setters as history-free setup/test/live seams
- restore note records, note order, note metadata, and active-note fallback only as needed for coherent note create/delete undo/redo

Owns:
- note create
- note delete
- pin/unpin
- color preset changes
- a Notepad-only snapshot/restore helper over `notesById`, `noteOrder`, and active-note fallback
- explicit history-aware wrappers for discrete Notepad commands
- narrow Notepad UI command routing if implementation proves the current button callbacks can switch to wrappers without changing text inputs

Does Not Own:
- Notepad title/body text edits from `NotepadSurface` raw `onChange`
- Dashboard sticky-note title/body text edits
- text coalescing/focus-session implementation
- Dashboard lanes, sticky-note placement, frame, resize, attachment, or board gesture coalescing
- active note id as standalone navigation/selection history, except as incidental restore/fallback inside note create/delete payloads
- native text-input undo, focus, selection, scroll, menu, draft, camera/pan/zoom, drag-preview, resize-preview, shell placement, command transcript/recall, Browser/project, Catalog/Pubwheel, persistence architecture, history UI, collaboration, checkpoints, branching, or Build Path comparison

Current Live Seams:
- `src/app/notepad/useNotepadStore.ts`
  - raw methods are `createNote(...)`, `deleteNote(...)`, `setNotePinned(...)`, `setNoteColorPreset(...)`, `renameNote(...)`, `updateNoteBody(...)`, and `setActiveNoteId(...)`
  - `createNote(...)` creates a generated note id, inserts it at the front of `noteOrder`, creates a yellow unpinned note record, and sets `activeNoteId` to the new note
  - `deleteNote(...)` removes the note record/order entry and computes a coherent active-note fallback from the deleted note position
  - `setNotePinned(...)` and `setNoteColorPreset(...)` are no-ops for missing notes or unchanged values and touch only note metadata plus `updatedAt`
  - `renameNote(...)` and `updateNoteBody(...)` are raw per-keystroke text paths and must remain outside Phase 1.1
- `src/app/notepad/NotepadSurface.tsx`
  - `New Note` and empty-state create buttons call raw `createNote()`
  - toolbar `Pin to Dashboard` / `Unpin` calls raw `setNotePinned(...)`
  - toolbar `Delete` calls raw `deleteNote(...)`
  - title/body inputs call raw text setters on every `onChange`; these callbacks must not be routed in Phase 1.1
  - no visible color preset control is currently present in `NotepadSurface`, but the store seam exists and should be covered by wrappers/tests for future UI or Dashboard note-card color calls
- `src/app/notepad/useNotepadStore.test.ts`
  - covers raw create/edit/pin/color/delete behavior and persistence roundtrip
  - should remain valid because raw setters stay history-free
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - proves raw Notepad mutations remain durable, history-free, and redo-preserving before wrappers
  - should be retained as raw no-entry regression coverage after wrappers are added
- Existing helper precedent:
  - `src/app/store/materialEditHistory.ts`, `src/app/store/groundEditHistory.ts`, and `src/app/store/environmentLookEditHistory.ts` use small store-adjacent helpers that capture a narrow owner snapshot, run a wrapped action, compare before/after, and commit one canonical entry only when changed
  - Phase 1.1 should follow this pattern locally for Notepad rather than introducing broad productivity infrastructure

First-Pass Decisions:
- Implement Phase 1.1 as a small store-adjacent helper, likely `src/app/store/notepadEditHistory.ts`, unless placing wrappers next to `useNotepadStore.ts` is clearly smaller.
- Snapshot shape should include only:
  - `notesById`
  - `noteOrder`
  - `activeNoteId` as incidental selection/fallback coherence for note create/delete restore
- Do not snapshot Notepad surface focus, text selection, scroll, host placement, menu state, command transcript/recall, or Dashboard readers.
- Raw Notepad store setters remain history-free. New wrappers route only approved discrete commands:
  - `createNoteWithHistory(...)`
  - `deleteNoteWithHistory(noteId)`
  - `setNotePinnedWithHistory(noteId, isPinned)`
  - `setNoteColorPresetWithHistory(noteId, colorPreset)`
- Create undo/redo should preserve the originally generated note id and note record/order position from the captured after snapshot rather than allocating a new note id on redo.
- Delete undo/redo should restore/remove the original note record, order entry, metadata, and active-note fallback from snapshots.
- Pin/color undo/redo should restore only the changed note metadata where feasible, preserving title/body text and unrelated notes changed after the entry.
- Preferred helper shape for pin/color is targeted note metadata restoration over the specific note record. Whole Notepad snapshots are acceptable for create/delete only if tests prove unrelated notes are preserved or Manager accepts the broader note-owner scope.
- UI routing can be tiny:
  - switch `NotepadSurface` create/delete/pin button callbacks to history-aware wrappers
  - do not touch title/body input callbacks
  - color routing may remain store/helper-test-only if no live Notepad color UI exists

### Phase 1.1 Implementation Spec

Exact First Code Cut:
- Add a narrow Notepad edit-history helper, preferably `src/app/store/notepadEditHistory.ts`.
- Include capture/restore utilities over the minimum Notepad owner state needed by each entry.
- Add history-aware wrappers for create/delete/pin/color while keeping raw `useNotepadStore` methods unchanged and history-free.
- Use canonical entry metadata:
  - create:
    - label: `Create note`
    - source surface: `notepad`
    - source id/label: `notes` / `Notes`
    - target id/label: `note:<noteId>` / note title fallback such as `Untitled note`
  - delete:
    - label: `Delete note`
    - source surface: `notepad`
    - source id/label: `notes` / `Notes`
    - target id/label: `note:<noteId>` / note title fallback
  - pin/color:
    - label: `Change note`
    - source surface: `notepad`
    - source id/label: `notes` / `Notes`
    - target ids: `note:<noteId>:pinned`, `note:<noteId>:color`
    - target labels: `Note pin`, `Note color`
- Route `NotepadSurface` discrete create/delete/pin callbacks through wrappers if the implementation can do so without touching text inputs or broad UI structure.
- Do not add history routing for `renameNote(...)`, `updateNoteBody(...)`, or `setActiveNoteId(...)`.

Likely Files:
- `src/app/store/notepadEditHistory.ts`
- `src/app/store/notepadEditHistoryStore.test.ts` or a focused sibling name
- `src/app/store/productivityContentEditHistoryReadiness.test.ts` for raw no-entry regression if touched
- `src/app/notepad/NotepadSurface.tsx` only for tiny button callback routing
- `src/app/notepad/useNotepadStore.test.ts` only if raw store behavior needs regression
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Snapshot / Restore Rules:
- Create entry:
  - before snapshot captures note order and active-note fallback before raw create
  - after snapshot captures the generated note record, generated id, inserted order, and active note
  - undo removes the created note and restores coherent active note from before snapshot
  - redo restores the same generated note id, note record, order position, and active note from after snapshot
- Delete entry:
  - before snapshot captures deleted note record, note order, and active note before raw delete
  - after snapshot captures post-delete order/fallback
  - undo restores the deleted note record and order position
  - redo removes it again and restores post-delete active-note fallback
- Pin/color entry:
  - capture only the target note's relevant metadata and `updatedAt` before/after where feasible
  - undo/redo must not alter title/body text or other notes unless they were part of the same discrete metadata entry
  - missing note, unchanged pinned state, and unchanged color preset create no entry
- Active note id:
  - may be restored as part of create/delete snapshot coherence
  - must not receive standalone canonical history entries
  - implementation should document whether pin/color preserves current active note unchanged

No-Op / Redo Rules:
- missing note delete creates no entry and preserves redo
- missing note pin/color creates no entry and preserves redo
- unchanged pin/color creates no entry and preserves redo
- create should commit only if a note id appears and the Notepad snapshot changed
- wrapper no-op paths must not call `editHistoryStore.commitEntry(...)`
- new real entries invalidate redo through the existing canonical owner behavior
- raw `createNote(...)`, `deleteNote(...)`, `setNotePinned(...)`, and `setNoteColorPreset(...)` remain no-entry and redo-preserving for setup/tests

Verification:
- `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts` if a new focused helper test is added
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` to prove raw no-entry behavior still holds
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts` if raw Notepad behavior is touched
- a focused NotepadSurface test only if one already exists or tiny UI callback routing needs proof; do not create broad UI coverage just to test text inputs
- `npm.cmd run build`

Tracking Docs:
- implementation updates `docs/CHANGELOG.md` for runtime/test behavior
- implementation updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation updates `docs/Doc-Log.md`
- do not update the Gen2 index, Dispatch run-state, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if preserving create/delete redo requires changing raw `createNote(...)` id generation behavior broadly
- stop if pin/color undo/redo would rewind title/body text edits or unrelated notes made after the entry
- stop if UI routing requires broad NotepadSurface restructuring, text input changes, focus handling, keyboard changes, or native text undo changes
- stop if restore payloads need Dashboard selection, Dashboard layout, host window placement, command transcript/recall, persistence architecture, Browser/project, Catalog/Pubwheel, collaboration, checkpoints, branching, or Build Path state

Done Shape:
- [x] runtime wrappers exist for create/delete/pin/color only
- [x] raw Notepad store methods remain history-free
- [x] NotepadSurface discrete create/delete/pin commands route through wrappers if touched and verified
- [x] one canonical entry commits per real discrete operation
- [x] undo/redo restores note record/order/metadata and coherent active-note fallback without making text typing undoable
- [x] no-op/missing/unchanged cases preserve redo
- [x] focused tests and build pass

Acceptance Mapping:
- `Edit-History-Gen2-HLG-2` remains open after Phase 1.1 because text coalescing and Dashboard board coalescing are still deferred.
- Manager approved Phase 1.1 implementation on 2026-04-22 06:51:12 with a targeted pin/color metadata-restore constraint.
- Manager accepted Phase 1.1 on 2026-04-22 06:57:36 after focused verification and production build passed.
- Phase 1.1 is accepted as the first runtime productivity undo slice because create/delete/pin/color wrappers and verification passed.
- Recommended next Manager action is prep-only `Phase 1.2 - Productivity Text Coalescing Routing`. `Edit-History-Gen2-HLG-2` stays open for title/body text coalescing and Dashboard board coalescing.

Closeout:
- Added `src/app/store/notepadEditHistory.ts` with history-aware create/delete/pin/color wrappers.
- Added `src/app/store/notepadEditHistoryStore.test.ts` with focused coverage for one-entry create/delete/pin/color behavior, generated note id redo preservation, active-note fallback restore, targeted pin/color metadata restore, no-op redo preservation, and raw setter no-entry behavior.
- Updated `src/app/notepad/NotepadSurface.tsx` so only discrete create/delete/pin callbacks use history-aware wrappers; title/body raw `onChange` paths remain outside canonical history.
- Repaired create/delete undo/redo order restore to preserve current unrelated notes that were raw-created after the canonical entry while still placing the target note according to the captured before/after order.
- Pin/color undo/redo uses targeted metadata restore and preserves later title/body edits.
- Color wrapper exists for the store seam, but no NotepadSurface color UI was added.

Verification:
- `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts` passed with 7 tests.
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed with 3 tests.
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts` passed with 2 tests.
- `npm.cmd run build` passed with known Vite warnings about externalized `path`/`crypto` from `occt-import-js` and large chunks.

## [x] `Edit-History-Gen2-2 / Phase 1.2` - `Productivity Text Coalescing Routing`

### Phase 1.2 Summary

Purpose:
- route productivity title/body text undo into safe implementation slices without making raw text setters historyful
- decide whether Notepad main-surface title/body focus sessions and Dashboard sticky-note title/body blur commits belong in one phase or separate subphases
- preserve native text-input undo while an input/textarea is focused
- define field-targeted restore payloads so title/body undo does not rewind pin/color, note order, active-note navigation, or unrelated note metadata

Owns:
- Notepad title text routing from `NotepadSurface`
- Notepad body text routing from `NotepadSurface`
- Dashboard sticky-note title/body routing from `DashboardStickyNoteCard` through `DashboardSurface` callbacks
- commit-boundary decisions for focus, blur, Enter, Escape, and local draft behavior
- no-op/redo rules for text commits
- field-targeted snapshot/restore shape for note title and body

Does Not Own:
- note create/delete/pin/color, already covered by Phase 1.1
- Dashboard lanes, sticky-note placement, frame, resize, attachment, or board gesture coalescing
- Dashboard color/unpin metadata routing unless it is already covered by discrete Notepad wrappers
- active note id as standalone navigation/selection history
- native text-input-local undo changes while focused
- focus, text selection, scroll, menus, Dashboard selection/lift/camera/preview state, command transcript/recall, Browser/project, Catalog/Pubwheel, persistence architecture, history UI, collaboration, checkpoints, branching, or Build Path comparison

Current Live Seams:
- `src/app/notepad/NotepadSurface.tsx`
  - title `<input>` is controlled by `activeNote.title` and calls raw `renameNote(activeNote.id, value)` on every `onChange`
  - body `<textarea>` is controlled by `activeNote.body` and calls raw `updateNoteBody(activeNote.id, value)` on every `onChange`
  - there is currently no focus-session draft, blur commit, Enter commit, or Escape cancel path in the main Notepad surface
  - Phase 1.1 already routed create/delete/pin buttons through discrete wrappers; text inputs remain raw
- `src/app/notepad/useNotepadStore.ts`
  - `renameNote(...)` and `updateNoteBody(...)` are raw store setters with missing-note and unchanged-value no-op behavior
  - both setters touch `updatedAt`
  - raw setters must remain history-free for setup/tests/live text editing
- `src/app/workspace/DashboardStickyNoteCard.tsx`
  - title edits use local `titleDraft`, commit on blur through `onRenameNote(...)`, and cancel on Escape
  - body edits use local `bodyDraft`, commit on blur through `onUpdateNoteBody(...)`, and cancel on Escape
  - while editing, `onChange` updates only local draft state, not the Notepad store
  - there is no Enter-to-commit behavior today; adding it is not required for routing
- `src/app/workspace/DashboardSurface.tsx`
  - passes Notepad store callbacks into `DashboardStickyNoteCard`
  - owns local Dashboard UI/session state such as selection, lift, lane camera, drag/resize preview, and menus; text history must not capture those states
- `src/app/store/notepadEditHistory.ts`
  - Phase 1.1 helper already provides Notepad source metadata and targeted metadata restore precedent
  - Phase 1.2 should extend the same helper or add adjacent wrappers for text fields, not introduce broad productivity infrastructure
- `src/app/store/notepadEditHistoryStore.test.ts`
  - covers discrete metadata targeted restore and raw setter no-entry behavior
  - should grow targeted text restore coverage if the implementation adds text wrappers
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - proves raw title/body setters remain no-entry and redo-preserving
  - should stay as raw no-entry proof after wrappers are added

First-Pass Decisions:
- Split Phase 1.2 into implementation subphases rather than doing both main Notepad and Dashboard sticky-note text at once.
- Recommended next implementation is `Phase 1.2a - Notepad Text Focus Session Entries`.
  - Reason: main Notepad text currently writes raw store state per keystroke, so it needs the largest new boundary and should be proven before Dashboard routes into the same wrapper.
  - Implementation should capture the starting title/body field value on focus, let raw `renameNote(...)` / `updateNoteBody(...)` continue during typing, then commit one canonical entry on blur when the field value changed.
  - Escape should restore the captured field value and create no entry so no raw text mutation is stranded outside history.
  - Enter should commit title only if it can stay tiny and not change textarea behavior; otherwise blur-only is acceptable for the first cut.
- Recommended follow-up is `Phase 1.2b - Dashboard Sticky Note Text Commit Entries`.
  - Reason: Dashboard cards already have local drafts and blur/Escape semantics, so they can call the same text commit wrapper once Notepad field-targeted restore exists.
  - Dashboard should not need a new draft model; it should route existing `commitTitle` / `commitBody` callbacks through wrappers.
- Do not use debounce/save for the first runtime slice. Focus-session and blur commit are the clearest live boundaries.
- Text wrappers should be field-targeted, not whole-note snapshots.

Decision Table:

| Surface/control | Current write behavior | Safe runtime boundary | Phase 1.2 decision |
| --- | --- | --- | --- |
| NotepadSurface title input | raw `renameNote(...)` on every `onChange` | capture on focus, raw live updates, commit once on blur; optional Enter if tiny; Escape restores captured title | split to Phase 1.2a |
| NotepadSurface body textarea | raw `updateNoteBody(...)` on every `onChange` | capture on focus, raw live updates, commit once on blur; Escape restores captured body | split to Phase 1.2a |
| DashboardStickyNoteCard title | local `titleDraft` on `onChange`, store write on blur, Escape cancel | route existing blur commit through title wrapper; keep Escape local cancel | split to Phase 1.2b after wrapper exists |
| DashboardStickyNoteCard body | local `bodyDraft` on `onChange`, store write on blur, Escape cancel | route existing blur commit through body wrapper; keep Escape local cancel | split to Phase 1.2b after wrapper exists |
| Raw `renameNote(...)` / `updateNoteBody(...)` | direct store setters | no canonical entry | remain raw no-entry seams |

### Phase 1.2 Implementation Spec

Exact First Code Cut / Routing Cut:
- Treat Phase 1.2 itself as routing/prep for text coalescing, not runtime implementation.
- If Manager approves the recommended split, implement Phase 1.2a first:
  - extend `src/app/store/notepadEditHistory.ts` with `beginNoteTextEditSession(...)`, `commitNoteTextEditSession(...)`, or simpler component-local capture plus `commitNoteTextFieldWithHistory(...)`
  - target one field at a time: title or body
  - keep raw `renameNote(...)` and `updateNoteBody(...)` history-free
  - update `NotepadSurface` only around title/body focus/blur/Escape/optional title Enter boundaries
- Add Phase 1.2b later:
  - route `DashboardStickyNoteCard` existing title/body blur callbacks through the same text wrappers from `DashboardSurface`
  - do not change Dashboard selection/lift/camera/preview state

Likely Files:
- `src/app/store/notepadEditHistory.ts`
- `src/app/store/notepadEditHistoryStore.test.ts`
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `src/app/notepad/NotepadSurface.tsx` for Phase 1.2a
- `src/app/workspace/DashboardStickyNoteCard.tsx` and/or `src/app/workspace/DashboardSurface.tsx` for Phase 1.2b only
- focused UI tests only if existing reliable tests expose the text boundary; otherwise store/helper tests plus component unit tests should stay narrow
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Entry Metadata:
- title:
  - label: `Change note text`
  - source surface: `notepad`
  - source id/label: `notes` / `Notes`
  - target id: `note:<noteId>:title`
  - target label: `Note title`
- body:
  - label: `Change note text`
  - source surface: `notepad`
  - source id/label: `notes` / `Notes`
  - target id: `note:<noteId>:body`
  - target label: `Note body`

Restore Payload Rules:
- target exactly one note id and one text field
- capture before and after values for that field plus `updatedAt` if the raw setter changes it
- undo/redo should update only the target field and `updatedAt` for the target note
- undo/redo must preserve current pin/color metadata, note order, active note id, title/body field not being edited, and unrelated notes changed after the entry
- if the note is missing during undo/redo, the operation should no-op rather than recreating a note in this text phase

Native Text Undo Rules:
- do not intercept Ctrl+Z / Meta+Z while the input or textarea is focused
- canonical undo/redo should remain unavailable to focused editable text controls through existing shared dispatch behavior
- local browser/native text undo must continue to operate inside the active control

No-Op / Redo Rules:
- unchanged text creates no entry and preserves redo
- missing note creates no entry and preserves redo
- Escape/cancel restores the captured field value and creates no entry
- raw `renameNote(...)` and `updateNoteBody(...)` remain no-entry and redo-preserving
- a real focus-session/blur commit creates exactly one canonical entry and invalidates redo once through the existing owner
- duplicate blur-after-Enter must not create a second entry if title Enter commit is implemented

Focused Verification:
- Phase 1.2a:
  - `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts`
  - `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - focused NotepadSurface test if component wiring is added and a narrow reliable test exists
- Phase 1.2b:
  - focused Dashboard sticky-note card/surface test if text callback routing is touched
  - `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts`
  - `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- Build gate for any runtime implementation:
  - `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- runtime implementation later updates `docs/CHANGELOG.md`
- runtime implementation later updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- runtime implementation later updates `docs/Doc-Log.md`
- do not update the Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if NotepadSurface focus-session support requires a broad editor/input refactor
- stop if Escape cannot restore the raw typed field without creating an entry or breaking native text undo
- stop if implementation needs shared keyboard dispatch changes
- stop if field-targeted undo/redo would rewind pin/color, note order, active note id, unrelated note metadata, Dashboard UI state, command transcript/recall, Browser/project, Catalog/Pubwheel, persistence architecture, collaboration, checkpoints, branching, or Build Path state
- stop if Dashboard sticky-note routing needs broad DashboardSurface architecture changes instead of existing blur callbacks

Done Shape:
- Phase 1.2 routing is done when Notepad main text and Dashboard sticky-note text boundaries are explicitly separated, the recommended implementation split is clear, field-targeted restore rules are defined, native text undo is preserved, and verification/stop conditions are recorded.
- Manager accepted Phase 1.2 routing on 2026-04-22 07:00:09.
- Recommended next Manager action is prep-only `Phase 1.2a - Notepad Text Focus Session Entries` first, followed by `Phase 1.2b - Dashboard Sticky Note Text Commit Entries` after the field-targeted text wrapper is accepted.

## [x] `Edit-History-Gen2-2 / Phase 1.2a` - `Notepad Text Focus Session Entries`

### Phase 1.2a Summary

Purpose:
- add canonical undo for NotepadSurface title/body completed focus sessions only
- keep raw live typing responsive through existing `renameNote(...)` / `updateNoteBody(...)`
- commit exactly one `Change note text` entry on blur when the field changed
- preserve native text-input undo while the title input or body textarea is focused

Owns:
- NotepadSurface title input focus-session commits
- NotepadSurface body textarea focus-session commits
- field-targeted text helper for `title` and `body`
- Escape cancel/restore for the focused NotepadSurface field
- no-op and missing-note behavior for text commit helpers

Does Not Own:
- Dashboard sticky-note title/body text
- Dashboard lanes, board placement, resize, attachment, or board gesture history
- note create/delete/pin/color, already covered by Phase 1.1
- active note id as standalone navigation/selection history
- native text-input undo dispatch or shared keyboard dispatch
- focus, selection, scroll, menu/session state, command transcript/recall, Browser/project, Catalog/Pubwheel, history UI, persistence architecture, collaboration, checkpoints, branching, or Build Path comparison

Current Live Seams:
- `src/app/notepad/NotepadSurface.tsx`
  - title input is controlled by `activeNote.title` and calls raw `renameNote(activeNote.id, value)` on every `onChange`
  - body textarea is controlled by `activeNote.body` and calls raw `updateNoteBody(activeNote.id, value)` on every `onChange`
  - neither control currently has `onFocus`, `onBlur`, or `onKeyDown` commit/cancel handling
  - Phase 1.1 already imports Notepad history wrappers for discrete create/delete/pin commands
- `src/app/store/notepadEditHistory.ts`
  - currently owns discrete create/delete/pin/color wrappers
  - already has Notepad source metadata and targeted metadata restore precedent
  - should gain a field-targeted text commit helper rather than a new broad productivity helper
- `src/app/notepad/useNotepadStore.ts`
  - raw `renameNote(...)` and `updateNoteBody(...)` have missing-note and unchanged-value no-op behavior
  - raw setters update `updatedAt` and must remain history-free
- `src/app/store/notepadEditHistoryStore.test.ts`
  - already covers targeted metadata restore preserving later title/body edits
  - should add text helper coverage proving title/body restore preserves pin/color, order, active note, the other text field, and unrelated notes
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - continues proving raw `renameNote(...)` / `updateNoteBody(...)` are no-entry and redo-preserving

First-Pass Decisions:
- Implement one tiny helper, likely:
  - `commitNoteTextFieldWithHistory(noteId, field, beforeValue, afterValue, options)`
  - `field` is only `'title' | 'body'`
- Prefer component-local focus-session capture in `NotepadSurface`:
  - on focus, capture `{ noteId, field, beforeValue }`
  - on change, keep using raw live `renameNote(...)` / `updateNoteBody(...)`
  - on blur, compare captured before value to current field value and call helper once
  - on Escape, restore captured field value through the raw setter, clear the session, and create no entry
- Title Enter commit is optional and should be deferred unless it is tiny and duplicate blur-after-Enter is guarded. Body Enter should remain normal textarea input.
- Do not use debounce/save for this phase.
- Do not route Dashboard sticky-note text yet.

### Phase 1.2a Implementation Spec

Exact First Code Cut:
- Extend `src/app/store/notepadEditHistory.ts` with a field-targeted text commit helper.
- Add focused tests in `src/app/store/notepadEditHistoryStore.test.ts`.
- Update `src/app/notepad/NotepadSurface.tsx` with minimal focus-session state for title/body:
  - capture before value on focus
  - keep raw live setter on every `onChange`
  - commit on blur if changed
  - Escape restores captured value and clears the session without a canonical entry
  - avoid duplicate commit if title Enter is implemented; otherwise do not implement Enter
- Keep raw `renameNote(...)` and `updateNoteBody(...)` unchanged and history-free.

Helper Contract:
- `commitNoteTextFieldWithHistory(noteId, field, beforeValue, afterValue, options?)` returns `boolean`
- if `field` is invalid, note is missing, or `beforeValue === afterValue`, return `false`
- if changed, call the raw setter to ensure the store contains `afterValue` only when needed or assume the live path already wrote it, then commit one canonical entry
- entry metadata:
  - label: `Change note text`
  - source surface: `notepad`
  - source id/label: `notes` / `Notes`
  - title target: `note:<noteId>:title` / `Note title`
  - body target: `note:<noteId>:body` / `Note body`
- undo/redo restore only the target field and the associated `updatedAt` value captured for that field transition

Restore Payload Rules:
- target exactly one note id and one field
- title undo/redo must preserve current body, pin/color, createdAt, note order, activeNoteId, and unrelated notes
- body undo/redo must preserve current title, pin/color, createdAt, note order, activeNoteId, and unrelated notes
- if the note is missing during undo/redo, no-op; do not recreate deleted notes in this phase
- if later unrelated pin/color changes happen after a text entry, text undo/redo must preserve those metadata changes
- if later unrelated note create/delete operations happen after a text entry, text undo/redo must not alter note order

NotepadSurface Focus-Session Rules:
- focus capture should be per field and per note id
- switching active note while editing should commit/cancel only if the focused control blurs through normal React behavior; do not add active-note navigation history
- blur commits only if the captured field still refers to the same note id and field
- Escape restores the captured raw field value and creates no entry
- while focused, browser/native text undo remains local; do not add global keyboard handling
- body Enter remains a newline; title Enter is deferred unless implementation can commit without duplicate blur or broad keyboard handling

No-Op / Redo Rules:
- unchanged blur creates no entry and preserves redo
- missing note commit creates no entry and preserves redo
- Escape restore creates no entry and preserves redo
- raw `renameNote(...)` and `updateNoteBody(...)` remain no-entry and redo-preserving
- one real blur commit creates exactly one canonical entry and invalidates redo through the existing owner

Likely Files:
- `src/app/store/notepadEditHistory.ts`
- `src/app/store/notepadEditHistoryStore.test.ts`
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `src/app/notepad/NotepadSurface.tsx`
- a focused NotepadSurface test only if a narrow reliable one exists or can be added without broad UI scaffolding
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Focused Verification:
- `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts` if raw store behavior is touched
- focused NotepadSurface test if UI wiring coverage is added
- `npm.cmd run build`

Tracking Docs:
- implementation updates `docs/CHANGELOG.md`
- implementation updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation updates `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if focus-session capture requires broad NotepadSurface restructuring
- stop if Escape cannot restore the captured value without creating an entry or breaking native text undo
- stop if field-targeted restore would rewind pin/color, note order, active note id, the other text field, unrelated notes, command transcript/recall, Browser/project, Catalog/Pubwheel, persistence architecture, collaboration, checkpoints, branching, or Build Path state
- stop if implementation needs shared keyboard dispatch or global undo/redo changes

Done Shape:
- [x] NotepadSurface title/body raw live typing remains responsive and history-free per keystroke
- [x] blur commits one canonical `Change note text` entry only when the captured field changed
- [x] Escape cancels/restores the raw field value and creates no entry
- [x] undo/redo restores only the target text field and preserves pin/color, note order, active note id, unrelated notes, and the other text field
- [x] raw text setters remain no-entry and redo-preserving
- [x] focused tests and build pass

Acceptance Mapping:
- Manager accepted Phase 1.2a on 2026-04-22 07:05:42 after focused verification and production build passed.
- Phase 1.2a is accepted because NotepadSurface title/body focus-session entries are verified.
- `Edit-History-Gen2-HLG-2` remains open after Phase 1.2a because Dashboard sticky-note text and Dashboard board coalescing remain deferred.
- Recommended next Manager action is prep-only `Phase 1.2b - Dashboard Sticky Note Text Commit Entries`.

Closeout:
- Extended `src/app/store/notepadEditHistory.ts` with `commitNoteTextFieldWithHistory(...)` for field-targeted title/body text entries.
- Updated `src/app/notepad/NotepadSurface.tsx` so title/body focus captures before values, raw `onChange` still writes live store state, blur commits one entry when changed, and Escape restores the captured field value without an entry.
- Added `src/app/notepad/NotepadSurface.test.tsx` for focused UI wiring proof.
- Extended `src/app/store/notepadEditHistoryStore.test.ts` for title/body helper behavior, field-targeted restore, no-op/missing redo preservation, and preservation of pin/color, note order, active note, unrelated notes, and the other text field.
- Dashboard sticky-note title/body text remains deferred to Phase 1.2b.

Verification:
- `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts` passed with 9 tests.
- `npm.cmd test -- --run src/app/notepad/NotepadSurface.test.tsx` passed with 2 tests.
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed with 3 tests.
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts` passed with 2 tests.
- `npm.cmd run build` passed with known Vite warnings about externalized `path`/`crypto` from `occt-import-js` and large chunks.

## [x] `Edit-History-Gen2-2 / Phase 1.2b` - `Dashboard Sticky Note Text Commit Entries`

### Phase 1.2b Summary

Purpose:
- route Dashboard sticky-note title/body completed blur commits through canonical note text history
- reuse the accepted Phase 1.2a field-targeted `commitNoteTextFieldWithHistory(...)` helper
- keep DashboardStickyNoteCard local draft and Escape behavior unchanged
- avoid changing Dashboard board organization, selection, lift, camera, preview, or drag/resize behavior

Owns:
- Dashboard sticky-note title blur commits
- Dashboard sticky-note body blur commits
- one canonical `Change note text` entry per changed blur commit
- narrow Dashboard callback routing through the accepted Notepad text helper
- focused proof that local Escape cancel still creates no canonical entry

Does Not Own:
- NotepadSurface text, already covered by Phase 1.2a
- Dashboard board drag/resize/lane history
- Dashboard color, pin/unpin, note create/delete, or metadata history
- activeNoteId standalone navigation
- native text-input undo dispatch or shared keyboard dispatch
- focus, selection, scroll, menu/session state, Dashboard selection/lift/camera/preview state, command transcript/recall, Browser/project, Catalog/Pubwheel, history UI, persistence architecture, collaboration, checkpoints, branching, or Build Path

Current Live Seams:
- `src/app/workspace/DashboardStickyNoteCard.tsx`
  - title edit uses local `titleDraft`
  - body edit uses local `bodyDraft`
  - `commitTitle()` runs on blur, sets `isEditingTitle` false, and calls `onRenameNote(note.id, titleDraft)` only when `titleDraft !== note.title`
  - `commitBody()` runs on blur, sets `isEditingBody` false, and calls `onUpdateNoteBody(note.id, bodyDraft)` only when `bodyDraft !== note.body`
  - Escape calls `cancelTitle()` / `cancelBody()`, restores local draft from `note`, and never calls the parent mutation callback
  - while editing, `onChange` mutates only local draft state, so native text editing stays local and raw Notepad store writes happen only on blur
- `src/app/workspace/DashboardSurface.tsx`
  - currently selects raw Notepad setters:
    - `renameNote = useNotepadStore((state) => state.renameNote)`
    - `updateNoteBody = useNotepadStore((state) => state.updateNoteBody)`
  - currently passes `onRenameNote={renameNote}` and `onUpdateNoteBody={updateNoteBody}` to `DashboardStickyNoteCard`
  - owns substantial local UI/session state such as selected notes, focus lift, lane cameras, drag previews, resize previews, menus, and smart-align toggles; Phase 1.2b must not capture or restore any of these
- `src/app/store/notepadEditHistory.ts`
  - Phase 1.2a added `commitNoteTextFieldWithHistory(...)`
  - helper already has field-targeted title/body restore semantics and preserves pin/color, note order, active note id, unrelated notes, and the other text field
- Existing focused tests:
  - `src/app/store/notepadEditHistoryStore.test.ts` covers helper behavior
  - `src/app/store/productivityContentEditHistoryReadiness.test.ts` proves raw setters remain history-free
  - there is no dedicated Dashboard sticky-note text test yet; add a narrow DashboardStickyNoteCard component test or a small DashboardSurface integration test if practical

First-Pass Decisions:
- Do not rewrite `DashboardStickyNoteCard` draft behavior. The existing local draft and Escape cancel flow is already the desired completion boundary.
- Prefer the smallest routing change:
  - update `DashboardSurface` to pass tiny wrappers:
    - title: capture `note.title` from `notesById[noteId]` immediately before commit, then call `commitNoteTextFieldWithHistory(noteId, 'title', beforeTitle, nextTitle)`
    - body: capture `note.body` from `notesById[noteId]` immediately before commit, then call `commitNoteTextFieldWithHistory(noteId, 'body', beforeBody, nextBody)`
  - the helper should call raw setters if the live path has not already written the value
- If callback closure access to before values is unclear, pass before/after from `DashboardStickyNoteCard` by widening callback props minimally:
  - `onRenameNote(noteId, beforeTitle, afterTitle)`
  - `onUpdateNoteBody(noteId, beforeBody, afterBody)`
  - this is acceptable only if it stays local to DashboardStickyNoteCard/DashboardSurface and does not affect NotepadSurface or store APIs
- Do not add Enter-to-commit behavior. Dashboard currently commits on blur and cancels on Escape; preserve that.

### Phase 1.2b Implementation Spec

Exact First Code Cut:
- Update `DashboardSurface` callback routing for sticky-note title/body commits to use `commitNoteTextFieldWithHistory(...)`.
- Keep `DashboardStickyNoteCard` local draft state and Escape handling unchanged if DashboardSurface can capture before values.
- If DashboardSurface cannot reliably capture before values, make a minimal prop signature change so `DashboardStickyNoteCard` passes both `note.title`/`titleDraft` or `note.body`/`bodyDraft` to the parent on blur.
- Do not route Dashboard color/unpin or board operations in this phase.

Entry Metadata:
- reuse `commitNoteTextFieldWithHistory(...)` metadata:
  - label: `Change note text`
  - source surface: `notepad`
  - source id/label: `notes` / `Notes`
  - title target: `note:<noteId>:title` / `Note title`
  - body target: `note:<noteId>:body` / `Note body`
- Do not introduce Dashboard-specific labels; Dashboard sticky-note text edits are authored Notepad note text changes.

Restore Payload Expectations:
- undo/redo targets only one note id and one field
- preserves the other text field, pin/color metadata, note order, active note id, unrelated notes, and later unrelated metadata changes
- if the note is missing during undo/redo, no-op rather than recreating it
- must not capture Dashboard selection, focus lift, lane camera, drag/resize preview, menu state, or board layout state

No-Op / Redo Rules:
- unchanged blur creates no entry and preserves redo
- missing note creates no entry and preserves redo
- Escape cancel creates no entry and preserves redo
- raw `renameNote(...)` and `updateNoteBody(...)` remain no-entry and redo-preserving
- a changed title/body blur creates exactly one canonical entry and invalidates redo once through the existing owner

Likely Files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx` only if callback props need before/after values
- `src/app/store/notepadEditHistoryStore.test.ts`
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- new focused test if needed:
  - preferred: `src/app/workspace/DashboardStickyNoteCard.test.tsx` if component-level callbacks can prove blur/Escape behavior directly
  - alternative: focused `DashboardSurface` test if the surface routing can be mounted narrowly
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Focused Verification:
- `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- focused Dashboard sticky-note card/surface test if added:
  - `npm.cmd test -- --run src/app/workspace/DashboardStickyNoteCard.test.tsx`
  - or the exact focused DashboardSurface test/filter if implementation uses surface integration
- `npm.cmd run build`

Tracking Docs:
- implementation updates `docs/CHANGELOG.md`
- implementation updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation updates `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if routing blur commits requires broad DashboardSurface architecture changes
- stop if callback signature changes ripple into unrelated surfaces or NotepadSurface
- stop if Escape cancel starts calling parent mutation callbacks or canonical history
- stop if implementation needs shared keyboard dispatch/native undo changes
- stop if restore payloads would need Dashboard selection, lift, camera, preview, board layout, command transcript/recall, Browser/project, Catalog/Pubwheel, persistence architecture, collaboration, checkpoints, branching, or Build Path state

Done Shape:
- [x] Dashboard sticky-note title/body drafts and Escape behavior remain unchanged
- [x] changed blur commits one canonical `Change note text` entry using the accepted field-targeted helper
- [x] unchanged blur and Escape create no entries
- [x] raw Notepad text setters remain history-free
- [x] undo/redo restores only the edited field and preserves all non-owned note/Dashboard state
- [x] focused tests and build pass

Acceptance Mapping:
- Phase 1.2b can be accepted when Dashboard sticky-note title/body blur commits route through field-targeted canonical note text history.
- `Edit-History-Gen2-HLG-2` remains open after Phase 1.2b because Dashboard board drag/resize/lane coalescing remains deferred.
- Recommended next Manager action after implementation is Manager acceptance review for Phase 1.2b.

Closeout:
- Updated `src/app/workspace/DashboardSurface.tsx` so sticky-note title/body completed blur callbacks route through `commitNoteTextFieldWithHistory(...)`.
- Left `src/app/workspace/DashboardStickyNoteCard.tsx` unchanged; local title/body draft state, blur commit, and Escape cancel behavior remain intact.
- Added `src/app/workspace/DashboardStickyNoteTextHistory.test.tsx` for focused DashboardSurface proof covering title blur, body blur, Escape no-entry, unchanged blur no-entry, undo/redo field-targeted restore, and Dashboard layout preservation.
- Kept raw Notepad `renameNote(...)` and `updateNoteBody(...)` history-free through existing readiness coverage.
- Dashboard board drag/resize/lane coalescing remains deferred; `Edit-History-Gen2-HLG-2` remains open.

Verification:
- `npm.cmd test -- --run src/app/workspace/DashboardStickyNoteTextHistory.test.tsx` passed with 3 tests.
- `npm.cmd test -- --run src/app/store/notepadEditHistoryStore.test.ts` passed with 9 tests.
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed with 3 tests.
- `npm.cmd run build` passed with known Vite warnings about externalized `path`/`crypto` from `occt-import-js` and large chunks.

## [ ] `Edit-History-Gen2-2 / Phase 1.3` - `Dashboard Board Organization Coalescing Routing`

### Phase 1.3 Summary

Purpose:
- route remaining Dashboard durable board organization candidates into implementation-sized phases
- separate discrete lane/layout operations from completed gesture/coalesced operations
- keep Dashboard board state as durable productivity organization without capturing local Dashboard session state
- identify the smallest next implementation slice after accepted Notepad and sticky-note text entries

Owns:
- Dashboard lane organization routing:
  - lane create
  - lane remove with migration destination
  - lane rename
  - lane width resize coalescing
- Dashboard sticky-note layout routing:
  - placement drag/drop
  - lane movement through placement changes
  - multi-select movement if the existing drag path carries multiple notes
  - sticky-note frame resize
  - sticky-note attachment parent changes
  - layout cleanup/reconcile/remove paths
- restore payload boundaries for `lanes` and `stickyNoteLayoutsByNoteId`
- proof/phase split decisions for discrete versus gesture-coalesced commits

Does Not Own:
- NotepadSurface text, Dashboard sticky-note title/body text, note create/delete/pin/color, or activeNoteId standalone navigation
- Dashboard selection, focus lift, lane cameras, panning/zoom, drag preview, resize preview, selection box, menus, smart-align UI toggles, floating/popout host rects, or shell placement
- Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, collaboration, checkpoints, branching, Build Path comparison, preview/cache/provider state, or unrelated workspace behavior

Current Live Seams:
- `src/app/dashboard/useDashboardStore.ts`
  - durable state is `lanes` plus `stickyNoteLayoutsByNoteId`
  - lane operations:
    - `createLane(title?)`
    - `createLaneAfter(afterLaneId, title?)`
    - `renameLane(laneId, title)`
    - `removeLane(laneId, destinationLaneId)`
    - `setAdjacentLaneWidths(leftLaneId, rightLaneId, leftWidth, rightWidth)`
  - sticky-note layout operations:
    - `reconcileStickyNoteLayouts(noteIds)`
    - `setStickyNotePosition(noteId, x, y)`
    - `setStickyNoteLane(noteId, laneId)`
    - `setStickyNotePlacement(noteId, laneId, x, y)`
    - `setStickyNotePlacements(layouts)`
    - `setStickyNoteFrame(noteId, frame)`
    - `setStickyNoteAttachmentParent(noteId, parentNoteId)`
    - `removeStickyNoteLayout(noteId)`
  - normalization already rounds positions/sizes, validates lanes, removes invalid parents, and skips no-op updates where implemented
- `src/app/dashboard/dashboardPersistence.ts`
  - persisted Dashboard payload is `version`, `lanes`, and `stickyNoteLayoutsByNoteId`
  - local session state such as lane cameras, selected notes, selection boxes, drag previews, resize previews, menus, floating window rects, and shell placement is not serialized
  - `normalizeDashboardStickyNoteLayouts(...)` is the durable layout pruning/cleanup owner for parent and size validity
- `src/app/workspace/DashboardSurface.tsx`
  - discrete-ish lane operations:
    - Add lane button calls `handleCreateLaneAfter(...)` -> `createLaneAfter(...)`
    - lane rename prompt flow calls `renameLane(...)` on commit
    - lane removal prompt resolves destination then calls `removeLane(...)`
  - lane width resize currently mutates `setAdjacentLaneWidths(...)` during pointer movement, so it needs gesture begin/end coalescing rather than per-tick history
  - sticky-note resize keeps `resizePreviewRef`/`resizePreviewLayout` during pointer movement and calls `setStickyNoteFrame(...)` on pointer finish
  - sticky-note drag keeps `dragPreviewRef`/`dragPreview` during pointer movement and calls `setStickyNotePlacements(...)` plus `setStickyNoteAttachmentParent(...)` on pointer finish
  - smart align/grid actions call `setStickyNotePlacements(...)` or repeated `setStickyNotePlacement(...)` from button-like commands; these are durable layout operations but need grouping if routed later
  - `reconcileStickyNoteLayouts(pinnedNoteIds)` runs from an effect to keep durable layouts aligned with pinned notes; treat as derived cleanup/proof before making it canonical
- `src/app/workspace/DashboardStickyNoteCard.tsx`
  - resize handle pointer-down starts DashboardSurface resize preview
  - title-bar pointer-down starts DashboardSurface drag preview
  - card text/color/unpin remain outside Phase 1.3 except where already covered by prior phases
- Existing tests:
  - `src/app/dashboard/useDashboardStore.test.ts` is the nearest raw store behavior suite
  - `src/app/store/productivityContentEditHistoryReadiness.test.ts` already proves raw Dashboard lane/layout mutations are durable, history-free, redo-preserving, and persist only lanes/layouts
  - `src/app/workspace/DashboardStickyNoteTextHistory.test.tsx` proves a narrow DashboardSurface mount pattern exists
  - broad `src/app/AppShell.test.tsx` has Dashboard coverage but is not the preferred first proof path

Candidate Routing Table:

| Candidate | Current boundary | Durable owner | Routing decision |
| --- | --- | --- | --- |
| lane create | discrete Add Lane button / raw `createLaneAfter(...)` | `lanes` | safe discrete runtime candidate after a small Dashboard history helper exists |
| lane rename | prompt commit / raw `renameLane(...)` | `lanes` | safe discrete runtime candidate if unchanged normalized title remains no-entry |
| lane remove | prompt-confirmed destination / raw `removeLane(...)` | `lanes` plus migrated `stickyNoteLayoutsByNoteId` | safe discrete runtime candidate if snapshot preserves destination migration and lane order |
| lane width resize | pointer movement calls `setAdjacentLaneWidths(...)` repeatedly | `lanes[].width` | gesture-coalesced candidate; needs begin/end or pointer-finish wrapper to create one entry |
| sticky-note drag/drop | preview during pointer movement, `setStickyNotePlacements(...)` on pointer finish | `stickyNoteLayoutsByNoteId` | gesture-coalesced candidate; group final placements plus attachment change as one entry |
| multi-select movement | drag path carries `draggedNoteIds` and final preview layouts | `stickyNoteLayoutsByNoteId` | same as drag/drop; must collapse all moved notes into one entry |
| sticky-note lane movement | final placement lane id changes | `stickyNoteLayoutsByNoteId` | part of drag/drop placement snapshot, not a separate per-note entry |
| sticky-note resize | preview during pointer movement, `setStickyNoteFrame(...)` on pointer finish | `stickyNoteLayoutsByNoteId` | gesture-coalesced candidate; one entry per completed resize |
| attachment parent changes | computed on drag finish via `setStickyNoteAttachmentParent(...)` | `stickyNoteLayoutsByNoteId.parentNoteId` | include with drag/drop entry when changed; avoid separate second entry for one drop |
| smart align / grid layout | button-like commands call placement setters for multiple notes | `stickyNoteLayoutsByNoteId` | later discrete multi-layout candidate; should group a button action into one entry |
| reconcile / remove layout cleanup | effect/raw cleanup, not explicit user-authored board command | `stickyNoteLayoutsByNoteId` | proof/exclusion first; do not route until an authored command boundary is explicit |

First-Pass Decisions:
- Split Phase 1.3 into routing only, then implement the smallest next runtime slice as `Phase 1.3a - Dashboard Lane Discrete Entries`.
- `Phase 1.3a` should own lane create/rename/remove only because those operations are discrete, already use stable store seams, and do not require pointer coalescing.
- Defer lane width resize and sticky-note drag/resize/attachment grouping to a later `Phase 1.3b - Dashboard Layout Gesture Entries` because those need completed gesture snapshots and must avoid per-frame history spam.
- Defer smart-align/grid layout buttons to either the gesture phase or a separate `Phase 1.3c - Dashboard Layout Command Entries` if the grouping semantics are easier outside pointer gestures.
- Keep raw Dashboard store methods history-free; use wrapper functions at the DashboardSurface command boundary or a store-adjacent helper invoked only by approved UI callbacks.
- Snapshot/restore only durable Dashboard board organization state:
  - `lanes`
  - `stickyNoteLayoutsByNoteId`
- Do not snapshot Notepad note records/order, Dashboard local UI/session state, shell/window state, or persistence infrastructure.

### Phase 1.3 Implementation Spec

Exact First Code Cut / Prep Output:
- This Phase 1.3 pass is routing/spec prep only.
- Add the next implementation spec as a follow-up phase rather than implementing here:
  - recommended next phase: `Edit-History-Gen2-2 / Phase 1.3a - Dashboard Lane Discrete Entries`
  - owns lane create/rename/remove only
  - uses a dashboard board snapshot helper over `lanes` and `stickyNoteLayoutsByNoteId`, but restores only the authored board state needed by the entry
  - proves raw Dashboard store methods remain history-free
- Keep lane width resize, sticky-note drag/drop, multi-select movement, frame resize, attachment parent changes, smart align/grid, and cleanup/reconcile out of Phase 1.3a unless Manager explicitly widens.

Likely Files For Phase 1.3a:
- `src/app/dashboard/useDashboardStore.ts` only if a tiny exported type/helper seam is required
- new `src/app/store/dashboardBoardEditHistory.ts` or similarly narrow store-adjacent helper
- new focused `src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `src/app/workspace/DashboardSurface.tsx` for routing Add Lane / Rename Lane / Remove Lane callbacks through wrappers
- `src/app/dashboard/useDashboardStore.test.ts` only if raw behavior is touched
- `src/app/store/productivityContentEditHistoryReadiness.test.ts` as raw no-entry/persistence regression
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Restore Payload Boundaries:
- lane create redo restores the same generated lane id, title, order, width, and any resulting normalized order
- lane create undo removes only the created lane and preserves unrelated lanes/layouts created later where possible
- lane rename undo/redo restores only the target lane title with order/width unchanged, preserving later unrelated lane/layout mutations
- lane remove undo restores the deleted lane and affected layouts, including notes migrated to the destination lane by the raw remove path
- lane remove redo removes the same lane and applies the same destination migration effect
- all restore paths must merge with current unrelated Dashboard state instead of replacing the whole store when that is needed to preserve later unrelated operations
- no restore path may capture selected notes, focus lift, lane cameras, panning/zoom, drag preview, resize preview, selection box, menus, smart-align toggles, floating/popout host rects, shell placement, command transcript/recall, or Notepad note text/metadata

No-Op / Redo Rules:
- missing lane create/rename/remove targets create no entry and preserve redo
- unchanged normalized lane rename creates no entry and preserves redo
- invalid remove destination, remove of last lane, missing lane, or same source/destination creates no entry and preserves redo
- raw Dashboard store methods stay no-entry and redo-preserving
- real discrete lane wrapper commits invalidate redo once through the canonical owner
- future gesture phases must commit exactly one entry per completed user gesture and no entry for canceled/no-effective-change gestures

Focused Verification For Phase 1.3a:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` if raw store behavior is touched
- focused `DashboardSurface` lane routing test if UI callback proof is added and practical
- `npm.cmd run build`

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- implementation updates `docs/CHANGELOG.md`
- implementation updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation updates `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if lane create/rename/remove restore requires replacing the whole Dashboard store and losing later unrelated lanes/layouts
- stop if generated lane id redo cannot be preserved without broad store changes
- stop if route wiring requires broad DashboardSurface refactors or changes pointer gesture behavior
- stop if no-op detection cannot preserve redo through the existing store/helper pattern
- stop if implementation would need Dashboard selection/lift/camera/preview/menu/session state, Notepad note records, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, collaboration, checkpoints, branching, or Build Path state

Done Shape:
- [ ] Dashboard board organization candidates are split into discrete lane entries, gesture-coalesced layout entries, and cleanup/proof-only exclusions.
- [ ] Phase 1.3a is ready for Manager approval with lane create/rename/remove only.
- [ ] Durable restore boundaries are limited to `lanes` and `stickyNoteLayoutsByNoteId`.
- [ ] Dashboard local UI/session state remains outside canonical history.
- [ ] Focused verification and build gate are named.

Acceptance Mapping:
- Phase 1.3 can be accepted as routing when the remaining Dashboard board candidates are honestly split and a smallest next implementation phase is explicit.
- `Edit-History-Gen2-HLG-2` remains open after Phase 1.3 because runtime Dashboard lane and layout organization entries are not implemented by this routing prep.
- Recommended next Manager action is approval for a narrow `Phase 1.3a - Dashboard Lane Discrete Entries` implementation prep/assignment.

## [x] `Edit-History-Gen2-2 / Phase 1.3a` - `Dashboard Lane Discrete Entries`

### Phase 1.3a Summary

Purpose:
- add canonical undo/redo entries for the discrete Dashboard lane commands that already have stable authored commit boundaries
- keep lane width resize and sticky-note layout gestures deferred until a gesture coalescing phase
- restore only durable Dashboard board organization state while preserving Dashboard local/session state

Owns:
- Dashboard lane create through the Add Lane button / `createLaneAfter(...)`
- Dashboard lane rename through the existing title edit blur/Enter commit / `renameLane(...)`
- Dashboard lane remove through the existing prompt-confirmed migration path / `removeLane(...)`
- one canonical entry per successful lane create, lane rename, or lane remove operation
- focused proof that raw Dashboard store methods remain history-free

Does Not Own:
- lane width resize
- sticky-note drag/drop, lane movement, multi-select movement, frame resize, attachment parent changes, smart align/grid layout commands, layout cleanup/reconcile/remove
- Dashboard sticky-note title/body text, NotepadSurface text, note create/delete/pin/color, or activeNoteId standalone navigation
- Dashboard selection, focus lift, lane cameras, panning/zoom, drag preview, resize preview, selection box, menus, smart-align UI toggles, floating/popout host rects, shell placement, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, collaboration, checkpoints, branching, Build Path comparison, preview/cache/provider state, or unrelated workspace behavior

Current Live Seams:
- `src/app/workspace/DashboardSurface.tsx`
  - `handleCreateLaneAfter(laneId)` calls `createLaneAfter(laneId, 'New lane')`
  - `handleStartLaneRename(laneId)` starts local edit state with the current lane title
  - `handleCommitLaneRename(laneId, rawTitle?)` trims the draft and calls `renameLane(laneId, normalizedTitleOrCurrentTitle)`, then clears local edit state
  - lane title input commits on blur and Enter, and Escape clears only the local editing state through `handleCancelLaneRename()`
  - lane removal resolves a migration destination through prompt text, confirms deletion, and calls `removeLane(laneId, destinationLaneId)`
- `src/app/dashboard/useDashboardStore.ts`
  - `createLaneAfter(afterLaneId, title = 'New lane')` generates the next stable `lane-N` id, inserts after the requested lane when present, normalizes order, and returns the generated id
  - `createLane(title = 'New lane')` appends a generated lane; keep raw/helper coverage history-free but do not wire UI in Phase 1.3a unless needed for tests
  - `renameLane(laneId, title)` normalizes empty input to `Untitled lane`, updates only the target lane title, and no-ops for missing/unchanged lanes
  - `removeLane(laneId, destinationLaneId)` no-ops when only one lane remains, source/destination missing, or source equals destination; otherwise removes the lane, normalizes remaining order, and migrates layouts from removed lane to destination lane
  - `sortAndNormalizeLanes(...)`, `createInsertedLaneSet(...)`, and `normalizeDashboardStickyNoteLayouts(...)` are current internal normalization paths and should be reused indirectly through raw store methods or a tiny test seam only if absolutely necessary
- `src/app/dashboard/useDashboardStore.test.ts`
  - covers dynamic lane ids, insertion order, rename, minimum-lane preservation, deletion migration, width persistence, and attachment cleanup
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - proves raw Dashboard organization mutations remain durable, no-entry, redo-preserving, and persistence-scoped to lanes/layouts

First-Pass Decisions:
- Add a narrow store-adjacent helper, likely `src/app/store/dashboardBoardEditHistory.ts`, instead of making `useDashboardStore` raw methods automatically historyful.
- Keep raw `createLane(...)`, `createLaneAfter(...)`, `renameLane(...)`, and `removeLane(...)` history-free.
- Preferred wrappers:
  - `createDashboardLaneAfterWithHistory(afterLaneId, title?, options?)`
  - `renameDashboardLaneWithHistory(laneId, title, options?)`
  - `removeDashboardLaneWithHistory(laneId, destinationLaneId, options?)`
- Route only DashboardSurface Add Lane / title rename commit / confirmed delete callbacks through wrappers.
- Use durable Dashboard snapshots over:
  - `lanes`
  - `stickyNoteLayoutsByNoteId`
- For rename, use targeted lane-title restore rather than broad snapshot restore so later width/order/layout changes are preserved.
- For create/remove, snapshot enough lane/layout state to restore the affected lane and remove/migration fallout while merging with later unrelated lanes/layouts.
- Do not include local Dashboard editing state, prompts, selected notes, cameras, previews, menus, smart-align toggles, or shell/window state in any payload.

### Phase 1.3a Implementation Spec

Exact First Code Cut:
- Add a Dashboard board history helper beside the other store-adjacent edit-history helpers.
- Implement lane create wrapper:
  - capture before lanes/layouts
  - call raw `createLaneAfter(...)`
  - capture created lane id, created lane record, after lanes/layouts
  - commit one `Create Dashboard lane` entry only if the generated lane exists and durable lanes changed
  - undo removes only the created lane and preserves unrelated lanes/layouts still present
  - redo restores the same generated lane id/title/order/width rather than allocating a new lane id
- Implement lane rename wrapper:
  - capture target lane title/order/width
  - call raw `renameLane(...)`
  - commit one `Rename Dashboard lane` entry only when normalized title changed
  - undo/redo restores only the target lane title and preserves width/order/layouts plus later unrelated changes
- Implement lane remove wrapper:
  - capture deleted lane record, before lane order, layouts in the removed lane, and destination lane id
  - call raw `removeLane(...)`
  - commit one `Delete Dashboard lane` entry only when source lane is removed
  - undo restores the deleted lane and layouts affected by migration as needed
  - redo removes the same lane and reapplies the same destination migration effect
- Update DashboardSurface lane callbacks to call wrappers:
  - Add Lane button -> create wrapper
  - lane title blur/Enter -> rename wrapper
  - confirmed lane delete -> remove wrapper
- Keep lane width resize, sticky-note layout operations, and cleanup effects raw/history-free.

Entry Metadata:
- lane create:
  - label: `Create Dashboard lane`
  - source surface: `dashboard`
  - source id/label: `board` / `Dashboard board`
  - target id/label: `dashboard-lane:<laneId>` / created lane title
- lane rename:
  - label: `Rename Dashboard lane`
  - source surface: `dashboard`
  - source id/label: `board` / `Dashboard board`
  - target id/label: `dashboard-lane:<laneId>:title` / `Dashboard lane title`
- lane remove:
  - label: `Delete Dashboard lane`
  - source surface: `dashboard`
  - source id/label: `board` / `Dashboard board`
  - target id/label: `dashboard-lane:<laneId>` / deleted lane title

Restore Payload Boundaries:
- create undo removes the created lane but must not drop later unrelated lanes or layouts
- create redo restores the same lane id and normalized order; later unrelated lanes/layouts remain present exactly once
- rename undo/redo changes only the target lane title; lane width/order and all layouts remain as current unless the target lane is missing
- remove undo restores the removed lane record/order and layouts that were migrated away by lane deletion
- remove redo removes the same lane and moves its layouts to the original destination lane using the raw remove semantics or a narrowed equivalent
- if the target lane/destination context is missing during undo/redo, no-op rather than rebuilding unrelated board state
- no restore captures Dashboard selection, editing draft, focus lift, lane cameras, drag/resize previews, menus, smart-align toggles, floating/popout host rects, shell placement, Notepad note records/order, command transcript/recall, or persistence infrastructure

No-Op / Redo Rules:
- missing `afterLaneId` for create should preserve existing raw behavior; if raw create falls back to append and creates a lane, the wrapper may commit the actual durable change
- missing lane rename creates no entry and preserves redo
- unchanged normalized lane rename creates no entry and preserves redo
- empty lane rename follows current raw path: DashboardSurface passes current title when trimmed input is empty; unchanged result creates no entry
- remove missing lane, missing destination, same source/destination, or last remaining lane creates no entry and preserves redo
- raw Dashboard store methods stay no-entry and redo-preserving
- real wrapper commits invalidate redo once through canonical edit history

Likely Files:
- `src/app/store/dashboardBoardEditHistory.ts`
- new `src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/dashboard/useDashboardStore.test.ts` only if raw lane behavior is touched
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- focused DashboardSurface lane routing test only if practical and small; otherwise helper tests plus readiness/store coverage are acceptable for the first cut
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Focused Verification:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` if raw lane behavior is touched
- focused DashboardSurface lane routing test if UI callback proof is added
- `npm.cmd run build`

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- implementation updates `docs/CHANGELOG.md`
- implementation updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation updates `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if preserving generated lane id on redo requires broad dashboard id generation changes
- stop if create/remove restore cannot merge with later unrelated lanes/layouts without replacing the whole Dashboard store
- stop if remove restore would need Notepad note records/order or Dashboard local session state
- stop if DashboardSurface routing requires broad prompt/editing-state refactors
- stop if implementation touches lane width resize, sticky-note drag/drop, sticky-note frame resize, attachment parent changes, multi-select movement, cleanup/reconcile, command transcript/recall, Browser/project, Catalog/Pubwheel, history UI, persistence architecture, collaboration, checkpoints, branching, or Build Path

Done Shape:
- [x] lane create commits one canonical entry and redo restores the same lane id
- [x] lane rename commits one canonical entry only for changed normalized titles
- [x] lane remove commits one canonical entry and restores lane plus migrated layout fallout
- [x] raw Dashboard store methods remain history-free
- [x] no-op/missing/invalid cases preserve redo
- [x] Dashboard local UI/session state remains outside restore payloads
- [x] focused tests and build pass

Implementation Closeout:
- Added `src/app/store/dashboardBoardEditHistory.ts` with canonical Dashboard board entries for lane create, rename, and delete while keeping raw `useDashboardStore` lane methods history-free.
- Routed DashboardSurface Add Lane, lane title blur/Enter, and confirmed lane delete callbacks through the wrappers without changing lane width resize, sticky-note layout gestures, prompts, selection/camera/preview/menu state, or persistence architecture.
- Create/delete restore merges captured target lane ordering with current lanes and layouts so later unrelated lanes/layouts remain present exactly once; rename restore targets only the lane title.
- Added focused store proof in `src/app/store/dashboardBoardEditHistoryStore.test.ts` and focused DashboardSurface wiring proof in `src/app/workspace/DashboardLaneEditHistory.test.tsx`.

Verification Notes:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` passed 5 tests.
- `npm.cmd test -- --run src/app/workspace/DashboardLaneEditHistory.test.tsx` passed 1 test.
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed 3 tests.
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` passed 8 tests.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

Acceptance Mapping:
- Phase 1.3a is accepted for Dashboard lane create/rename/remove runtime entries after Manager reran focused Dashboard lane helper, DashboardSurface lane routing, productivity readiness, raw Dashboard store, and production build verification.
- `Edit-History-Gen2-HLG-2` remains open after Phase 1.3a because lane width resize, sticky-note layout gestures, and board layout command grouping remain deferred.
- Recommended next Manager action is approval/prep handoff for `Phase 1.3b - Sticky Note Placement Gesture Entries`, with sticky-note resize and lane-width proof deferred to Phase 1.3c/1.3d.

## [x] `Edit-History-Gen2-2 / Phase 1.3b` - `Sticky Note Placement Gesture Entries`

### Phase 1.3b Summary

Purpose:
- prepare Dashboard sticky-note placement/lane movement gesture entries after accepted lane create/rename/delete entries
- define one canonical entry per completed sticky-note drag/drop gesture
- keep live pointer movement, previews, selection boxes, lane cameras, resize/width gestures, and menu/session state outside canonical history

Owns:
- completed sticky-note drag/drop placement and lane movement through the existing pointer-up commit boundary
- selected/multi-note movement where the existing `setStickyNotePlacements(...)` pointer-up boundary can represent one completed gesture as one entry
- optional same-drop attachment parent capture only when produced by the same completed placement gesture and representable in the same affected-layout payload
- future proof that raw Dashboard layout store methods remain history-free

Does Not Own:
- lane create/rename/remove, already accepted in Phase 1.3a
- sticky-note frame resize, explicitly deferred to `Phase 1.3c - Sticky Note Resize Entries`
- lane width resize, explicitly deferred to `Phase 1.3d - Dashboard Lane Width Commit Boundary Proof`
- smart align/grid layout commands, layout cleanup/reconcile/remove, sticky-note create/delete/pin/color, NotepadSurface or Dashboard sticky-note text, Dashboard lane title text, active note navigation, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, checkpoints, branching, collaboration, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior
- Dashboard selection, focus lift, lane cameras, panning/zoom, drag preview, resize preview, selection box, menus, smart-align UI toggles, floating/popout host rects, shell placement, and other local/session state

Current Live Seams:
- `src/app/workspace/DashboardSurface.tsx`
  - drag state lives in `dragStateRef` with `originLayoutsByNoteId`, `dragPreviewRef`, and local `dragPreview` state
  - sticky-note drag pointer movement updates preview-only layouts through `setDragPreview(...)`; it does not call the Dashboard store during movement
  - pointer-up `handlePointerFinish(...)` commits drag/drop by routing `finalPreview.layoutsByNoteId` and the same-drop attachment parent candidate through `commitDashboardStickyNotePlacementsWithHistory(...)`
  - single-note, attachment-subtree, and selected-note movement all flow through `dragState.draggedNoteIds`, `movementMode`, and `finalPreview.layoutsByNoteId`
  - resize state lives in `resizeStateRef` and `resizePreviewRef`; pointer movement updates `resizePreviewLayout` only
  - resize pointer-up commits through `setStickyNoteFrame(finalPreview.noteId, { x, y, width, height })`
  - lane width resize is different: pointer movement calls `setAdjacentLaneWidths(...)` directly, while pointer-up only clears `laneResizeStateRef` / `resizingLanePair`
  - lane camera pan, selection rectangle, drag preview, resize preview, and lane resize active state are local UI/session state and must not enter canonical history
- `src/app/dashboard/useDashboardStore.ts`
  - `setStickyNotePlacement(noteId, laneId, x, y)` updates one layout's lane/x/y while preserving size and parent when present through the current-layout spread
  - `setStickyNotePlacements(layouts)` updates multiple lane/x/y placements, preserves current width/height/parent fields, normalizes layouts, and no-ops when every requested placement is unchanged
  - `setStickyNoteFrame(noteId, frame)` updates one layout's x/y/width/height and preserves current lane; it currently omits `parentNoteId` in the authored frame update result
  - `setStickyNoteAttachmentParent(noteId, parentNoteId)` updates/removes one parent id and normalizes invalid/cyclic/cross-lane attachments
  - `setAdjacentLaneWidths(leftLaneId, rightLaneId, leftWidth, rightWidth)` updates durable lane width weights and no-ops for invalid/non-adjacent pairs or unchanged normalized weights
- `src/app/store/dashboardBoardEditHistory.ts`
  - already provides Dashboard board edit-history source metadata and merge-preserving lane helpers from Phase 1.3a
  - can be extended only if layout helpers stay narrow and do not convert raw Dashboard methods into historyful methods
- `src/app/dashboard/useDashboardStore.test.ts`
  - already covers sticky-note placement, frame persistence, attachment normalization, lane width persistence, and lane delete migration
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - proves raw Dashboard layout mutations are durable, no-entry, redo-preserving, and persistence-scoped to lanes/layouts

First-Pass Decisions:
- Phase 1.3b is the sticky-note placement implementation slice, not the whole Dashboard layout gesture bucket.
- Runtime slice: `Phase 1.3b - Sticky Note Placement Gesture Entries`.
  - Own completed drag/drop placement/lane movement only.
  - Include selected/multi-note movement because it flows through the same `setStickyNotePlacements(...)` pointer-up boundary.
  - Include attachment parent change only when it is produced by the same completed drag/drop pointer-up and can be represented inside the same layout-entry restore payload.
- Recommended follow-up: `Phase 1.3c - Sticky Note Resize Entries`.
  - Own completed frame resize through `resizePreviewRef` -> `setStickyNoteFrame(...)` pointer-up.
  - Keep separate because resize restore must reason about frame dimensions and the current `setStickyNoteFrame(...)` parent-preservation behavior.
- Recommended later proof/split: `Phase 1.3d - Dashboard Lane Width Commit Boundary Proof`.
  - Lane width resize currently mutates raw store state during pointer movement and has no completed-value commit call at pointer-up.
  - Do not route it into canonical history until a small draft/commit boundary can be proven without broad DashboardSurface pointer architecture changes.
- Keep smart align/grid layout commands and cleanup/reconcile/remove outside Phase 1.3b; route them to a later discrete board command phase if Manager wants them.

### Phase 1.3b Implementation Spec

Exact First Code Cut:
- Add placement-focused helpers beside the accepted Dashboard board history helper, or extend `src/app/store/dashboardBoardEditHistory.ts` only if the file stays readable and locally scoped.
- Implemented the placement gesture helper as `commitDashboardStickyNotePlacementsWithHistory(layouts, options?)`.
- Capture the relevant starting layouts from current Dashboard store state before applying the final authored placement payload from `finalPreview.layoutsByNoteId` on pointer-up.
- On pointer-up:
  - keep live pointer movement preview-only
  - apply raw `setStickyNotePlacements(...)` to preserve current store semantics
  - apply raw `setStickyNoteAttachmentParent(...)` only when needed by the existing drop logic
  - commit one canonical entry only when the normalized authored layout data for at least one affected note changed
- Undo/redo should restore only the affected notes' authored layout fields:
  - `laneId`
  - `x`
  - `y`
  - optional `parentNoteId` when the completed drop changed attachment
  - preserve `width` / `height` and unrelated fields unless the affected note snapshot explicitly owns them
- Restore must merge affected layouts into current `stickyNoteLayoutsByNoteId`; it must not replace the whole Dashboard store or drop later unrelated lanes/layouts.
- Missing affected notes/layouts during undo/redo should no-op for those note ids rather than rebuilding unrelated state.
- Leave raw `setStickyNotePlacement(...)`, `setStickyNotePlacements(...)`, `setStickyNoteFrame(...)`, `setStickyNoteAttachmentParent(...)`, and `setAdjacentLaneWidths(...)` history-free.

Entry Metadata:
- label: `Move sticky note` / `Move sticky notes`
- source surface: `dashboard`
- source id/label: `board` / `Dashboard board`
- single-note target id/label: `dashboard-note-layout:<noteId>` / `Sticky note layout`
- multi-note target id/label: `dashboard-note-layout:selection` / `Sticky note layouts`
- coalesce key is optional; if used, it should be deterministic per gesture and not merge separate pointer-up gestures

No-Widening Rule:
- Do not implement lane width resize history in Phase 1.3b.
- Do not implement frame resize in Phase 1.3b; keep it split to `Phase 1.3c - Sticky Note Resize Entries`.
- Do not include smart align/grid commands, cleanup/reconcile/remove, note create/delete/pin/color, sticky-note text, lane create/rename/delete, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, collaboration, checkpoints, branching, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior.
- Do not capture/restore Dashboard selection, lifted note id, lane cameras, panning/zoom, drag preview, resize preview, selection box, menus, smart-align toggles, floating/popout host rects, shell placement, prompt state, or focus state.
- Do not make raw Dashboard store methods automatically historyful.

No-Op / Redo Rules:
- canceled drag or pointer finish without `finalPreview` creates no entry and preserves redo
- unchanged normalized placement for all affected notes creates no entry and preserves redo
- missing affected note/layout creates no entry when no effective authored change can be applied
- real completed placement/lane/attachment gestures create one canonical entry and invalidate redo once
- repeated pointermove preview updates create no entries
- raw Dashboard store layout methods remain no-entry and redo-preserving

Implementation Risks:
- `setStickyNotePlacements(...)` preserves width/height/parent by spreading current layouts, while `finalPreview.layoutsByNoteId` includes width/height and maybe parent data for preview rendering; the history helper must decide the authored fields precisely and avoid unintentionally owning frame size in placement entries.
- Attachment parent changes are normalized by `setStickyNoteAttachmentParent(...)`; tests must prove the entry captures the normalized parent result rather than the pre-normalized drop candidate.
- Multi-note selection movement and attachment-subtree movement share the same pointer-up seam but may affect several layouts; restore must merge each affected note id without dropping unrelated current layouts.
- Lane width resize already mutates durable lane width on pointermove, so a future lane-width phase likely needs a draft/begin-end wrapper or proof-only result before runtime undo can be safe.
- jsdom pointer tests may be brittle because DashboardSurface depends on lane board geometry; store-level helper tests should cover restore semantics even if UI proof stays small.

Checklist:
- [x] Confirm completed drag/drop uses preview-only pointermove and raw store commit on pointer-up.
- [x] Define affected layout snapshot shape for placement/lane movement and optional attachment parent changes.
- [x] Keep frame resize split to Phase 1.3c and lane width proof split to Phase 1.3d.
- [x] Keep smart align/grid commands plus cleanup/reconcile/remove outside Phase 1.3b and routed to later board command planning.
- [x] Preserve later unrelated lanes/layouts across undo/redo.
- [x] Keep raw Dashboard store methods history-free.
- [x] Keep Dashboard local UI/session state outside canonical history.
- [x] Name focused verification and build gate.

Likely Files:
- `src/app/store/dashboardBoardEditHistory.ts` or a narrow sibling helper if layout entries grow large
- new or expanded `src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `src/app/workspace/DashboardSurface.tsx`
- focused DashboardSurface gesture/routing test only if practical and small
- `src/app/dashboard/useDashboardStore.test.ts` if raw layout semantics are touched or relied on
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Focused Verification:
- new focused Dashboard board/layout history tests proving:
  - one entry per completed single-note drag/drop
  - one entry per completed selected/multi-note movement where feasible
  - optional attachment parent change is captured only when the same completed drop produces it
  - undo/redo restores only affected note layouts and preserves unrelated lanes/layouts
  - canceled/no-op drag preserves redo
  - raw layout store methods remain no-entry and redo-preserving
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` if raw Dashboard semantics are touched or relied on
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- focused DashboardSurface gesture/routing test only if practical and small
- `npm.cmd run build`

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- implementation later updates `docs/CHANGELOG.md`
- implementation later updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation later updates `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if placement restore requires replacing the whole Dashboard store or can drop later unrelated lanes/layouts
- stop if pointer-up routing cannot pass before/final affected layouts without a broad DashboardSurface pointer architecture rewrite
- stop if selected/multi-note movement cannot be represented as one entry without capturing selection/lift/camera/preview state
- stop if attachment parent changes require a broad attachment model rewrite; split attachment to a later phase instead
- stop if frame resize or lane width resize implementation pressure expands Phase 1.3b beyond placement/lane movement
- stop if tests require fragile broad AppShell/workspace integration instead of focused helper plus small DashboardSurface proof

Done Shape:
- [x] Phase 1.3b is implementation-ready for sticky-note placement/lane movement only.
- [x] Sticky-note frame resize and Dashboard lane width proof are explicitly deferred to Phase 1.3c and Phase 1.3d.
- [x] First implementation slice has one-entry-per-completed-gesture semantics and excludes live pointer movement.
- [x] Restore payloads are affected-layout-only and merge with current Dashboard state.
- [x] Raw Dashboard store layout methods stay history-free.
- [x] Dashboard local UI/session state stays outside canonical history.
- [x] Focused verification and build gate are named.

Acceptance Mapping:
- Phase 1.3b can be accepted when Manager agrees completed sticky-note placement/lane movement gestures now create one canonical entry per completed pointer-up, with optional same-drop attachment parent capture staying narrow.
- `Edit-History-Gen2-HLG-2` remains open after this implementation because sticky-note frame resize, Dashboard lane width commit-boundary proof, smart align/grid commands, and cleanup/reconcile/remove remain split/deferred.
- Recommended next Manager action is acceptance review for `Edit-History-Gen2-2 / Phase 1.3b - Sticky Note Placement Gesture Entries`; do not advance into Phase 1.3c until Manager accepts this slice.

Closeout:
- Added `commitDashboardStickyNotePlacementsWithHistory(...)` to the Dashboard board history helper, preserving raw `useDashboardStore` layout methods as history-free setup/live-update seams.
- Routed `DashboardSurface` drag pointer-up through the placement helper while leaving pointermove previews, resize, lane width, smart align/grid commands, cleanup/reconcile/remove, and local Dashboard session state outside canonical history.
- The helper applies existing raw placement and same-drop attachment semantics first, compares the normalized authored after-state, and commits only when affected note lane/x/y or parent fields changed.
- Undo/redo restores only affected note lane/x/y plus optional same-drop `parentNoteId`, preserving current width/height, unrelated lanes/layouts, later unrelated layout changes, and local UI/session state.
- Same-drop attachment parent capture stayed in Phase 1.3b because it reuses the existing pointer-up drop calculation and the same affected-layout payload; no broader attachment model was added.

Verification Notes:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` passed 10 tests.
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed 3 tests.
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` passed 8 tests.
- `npm.cmd test -- --run src/app/workspace/DashboardLaneEditHistory.test.tsx` passed 1 test.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

## [x] `Edit-History-Gen2-2 / Phase 1.3c` - `Sticky Note Resize Entries`

### Phase 1.3c Summary

Purpose:
- prepare canonical Dashboard sticky-note frame resize entries after accepted sticky-note placement/lane movement entries
- commit one canonical entry per completed resize gesture on pointer-up
- keep live resize previews, local pointer state, selection/camera/pan/zoom, and lane-width resize outside canonical history

Owns:
- completed sticky-note frame resize through the existing `resizeStateRef` / `resizePreviewRef` pointer-up seam in `DashboardSurface`
- raw `useDashboardStore.setStickyNoteFrame(...)` application through a history-aware wrapper only at the approved completed-resize boundary
- affected-frame-only undo/redo over the target note's `x`, `y`, `width`, and `height`
- proof that raw Dashboard frame/layout methods remain history-free and redo-preserving

Does Not Own:
- sticky-note placement/lane movement, already accepted in Phase 1.3b
- lane create/rename/remove, already accepted in Phase 1.3a
- lane width resize/proof, explicitly deferred to `Phase 1.3d - Dashboard Lane Width Commit Boundary Proof`
- smart align/grid layout commands, cleanup/reconcile/remove, sticky-note create/delete/pin/color, sticky-note text, NotepadSurface text, Dashboard lane title text, active note navigation, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, checkpoints, branching, collaboration, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior
- Dashboard selection, lifted note id, lane cameras, pan/zoom, drag preview, resize preview, selection box, menus, smart-align toggles, floating/popout host rects, prompt state, focus state, or other local UI/session state

Current Live Seams:
- `src/app/workspace/DashboardSurface.tsx`
  - `resizeStateRef` captures the target note id, pointer id, lane id, resize direction, origin pointer world coordinates, and origin layout at resize-handle pointer down
  - `resizePreviewRef` and `resizePreviewLayout` hold preview-only frame data during pointer movement
  - pointermove uses `resolveResizedStickyNoteFrame(...)` and updates `resizePreviewRef` / `setResizePreviewLayout(...)`; it does not call the Dashboard store
  - pointer-up `handlePointerFinish(...)` checks the matching resize pointer id, reads `resizePreviewRef.current`, then calls raw `setStickyNoteFrame(finalPreview.noteId, { x, y, width, height })`
  - pointer-up then clears `resizeStateRef`, `resizePreviewRef`, `resizePreviewLayout`, and `resizingNoteId`
  - pointercancel uses the same finish handler; if no final preview exists, the current path clears local resize state without a durable store change
- `src/app/dashboard/useDashboardStore.ts`
  - `setStickyNoteFrame(noteId, frame)` rounds `x`/`y`, clamps `width`/`height` through `normalizeStickyNoteSize(...)`, and no-ops when frame fields are unchanged
  - existing raw behavior preserves current `laneId` and existing `parentNoteId`; the history wrapper still restores only frame fields so later lane/parent changes are not rewound
  - the raw setter creates a fallback layout for a missing note id, but the history wrapper should avoid committing missing/ineffective targets when no existing authored layout can be compared safely
- `src/app/dashboard/useDashboardStore.test.ts`
  - already covers frame persistence through the dashboard-owned frame seam and sticky-note attachment normalization
- `src/app/store/dashboardBoardEditHistory.ts`
  - already owns Dashboard board source metadata, lane history helpers, and Phase 1.3b affected-layout merge restore patterns
  - can be extended with frame-specific snapshot/restore only if raw store methods stay history-free and the file remains locally readable
- `src/app/store/dashboardBoardEditHistoryStore.test.ts`
  - already proves lane and placement entries preserve unrelated lanes/layouts and raw layout methods remain no-entry
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - proves raw Dashboard layout/frame mutations are durable, no-entry, redo-preserving, and persistence-scoped to lanes/layouts

First-Pass Decisions:
- Phase 1.3c is implementation-ready as a narrow runtime slice.
- Own one helper such as `commitDashboardStickyNoteFrameWithHistory(noteId, frame, options?)` invoked from the resize pointer-up branch only.
- Use the existing raw `setStickyNoteFrame(...)` internally so current size clamp, rounding, fallback lane, and no-op behavior are preserved.
- Compare the normalized after-state from the store after the raw call, not the preview object alone.
- Undo/redo should restore only the target note's frame fields:
  - `x`
  - `y`
  - `width`
  - `height`
- Preserve the current `laneId`, `parentNoteId`, unrelated layout fields, unrelated note layouts, lanes, lane widths, Dashboard local UI/session state, and later unrelated layout changes.
- Parent preservation needs focused proof because frame undo/redo must not rewind lane/parent changes made after the resize entry.
- Keep lane width resize separate as Phase 1.3d because lane width currently mutates raw durable state during pointer movement and pointer-up only clears local lane-resize state.

### Phase 1.3c Implementation Spec

Exact First Code Cut:
- Extend `src/app/store/dashboardBoardEditHistory.ts` with a frame-specific helper, or add a tiny sibling only if the existing helper becomes too large.
- Add a frame snapshot type that captures only `noteId`, `x`, `y`, `width`, and `height` from an existing target layout after applying the same rounding/clamping semantics as `setStickyNoteFrame(...)`.
- Implement `commitDashboardStickyNoteFrameWithHistory(noteId, frame, options?)`:
  - read the existing target layout before the raw call
  - call raw `setStickyNoteFrame(noteId, frame)`
  - read the normalized after layout from the store
  - commit one entry only if the affected frame fields changed
  - return `false` for missing targets, unchanged normalized frames, or ineffective updates
- Update only the `DashboardSurface` resize pointer-up branch to call the wrapper in place of raw `setStickyNoteFrame(...)`.
- Leave all raw Dashboard store methods history-free.
- Restore should merge the target frame into current `stickyNoteLayoutsByNoteId`; it must not replace the whole Dashboard store or drop later unrelated lanes/layouts.
- Missing target layouts during undo/redo should no-op rather than rebuilding unrelated state.

Entry Metadata:
- label: `Resize sticky note`
- source surface: `dashboard`
- source id/label: `board` / `Dashboard board`
- target id: `dashboard-note-frame:<noteId>`
- target label: `Sticky note frame`
- coalesce key is optional; if used, it must be deterministic for one completed resize and must not merge separate pointer-up gestures

No-Widening Rule:
- Do not implement lane width resize in Phase 1.3c.
- Do not modify sticky-note placement/lane movement history from Phase 1.3b except for shared helper reuse that does not alter accepted behavior.
- Do not include smart align/grid commands, cleanup/reconcile/remove, note create/delete/pin/color, sticky-note text, lane create/rename/delete, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, collaboration, checkpoints, branching, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior.
- Do not capture/restore Dashboard selection, lifted note id, lane cameras, panning/zoom, drag preview, resize preview, selection box, menus, smart-align toggles, floating/popout host rects, shell placement, prompt state, focus state, or local UI/session state.
- Do not make raw Dashboard store methods automatically historyful.

No-Op / Redo Rules:
- pointer finish with no `resizePreviewRef.current` creates no entry and preserves redo
- unchanged normalized `x`/`y`/`width`/`height` creates no entry and preserves redo
- missing target layout creates no entry and preserves redo
- raw `setStickyNoteFrame(...)` remains no-entry and redo-preserving
- real completed frame resize creates one canonical entry and invalidates redo once
- repeated pointermove preview updates create no entries

Implementation Risks:
- Frame restore must remain affected-frame-only even though raw `setStickyNoteFrame(...)` preserves current lane/parent; the wrapper must not restore lane/parent from the history payload.
- Frame restore must preserve current lane and parent fields even if the note moved after the resize entry; tests should prove a later placement/lane movement or parent change is not rewound by frame undo/redo.
- The helper should not create a layout for missing notes even though raw `setStickyNoteFrame(...)` can create a fallback layout; the history wrapper needs a before-layout guard.
- jsdom pointer tests can be brittle because resize uses lane board geometry; store-level helper tests should be the required proof, with DashboardSurface resize routing tested only if small and reliable.

Checklist:
- [x] Confirm resize pointermove remains preview-only.
- [x] Confirm pointer-up is the only authored resize commit boundary.
- [x] Define affected frame snapshot shape for `x`, `y`, `width`, and `height`.
- [x] Preserve lane, parent, unrelated layouts, lane widths, and local UI/session state across undo/redo.
- [x] Keep raw Dashboard frame/layout methods history-free.
- [x] Keep lane width proof split to Phase 1.3d.
- [x] Name focused verification and build gate.

Likely Files:
- `src/app/store/dashboardBoardEditHistory.ts` or a tiny sibling helper only if needed
- `src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `src/app/workspace/DashboardSurface.tsx`
- focused DashboardSurface resize/routing test only if practical and small
- `src/app/dashboard/useDashboardStore.test.ts` if raw frame semantics are touched or relied on
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Focused Verification:
- focused Dashboard board/layout history tests proving:
  - one entry per completed sticky-note frame resize
  - undo/redo restores only the affected note frame fields
  - lane, parent, unrelated layouts, later unrelated layout changes, and lane widths survive frame undo/redo
  - canceled/no-preview and no-op resize preserve redo
  - raw `setStickyNoteFrame(...)` remains no-entry and redo-preserving
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` if raw Dashboard semantics are touched or relied on
- focused DashboardSurface resize/routing test only if practical and small
- `npm.cmd run build`

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- implementation updated `docs/CHANGELOG.md`
- implementation updated this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation updated `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if frame restore requires replacing the whole Dashboard store or can drop later unrelated lanes/layouts
- stop if preserving parent/lane while restoring frame would require broad raw store behavior changes
- stop if pointer-up routing cannot call a wrapper without rewriting DashboardSurface pointer architecture
- stop if tests require fragile broad AppShell/workspace integration instead of focused helper plus small DashboardSurface proof
- stop if lane width resize implementation pressure expands Phase 1.3c beyond sticky-note frame resize

Done Shape:
- [x] Phase 1.3c is implemented for sticky-note frame resize only.
- [x] One canonical entry is created per completed resize pointer-up and no entry is created for live preview movement.
- [x] Restore payloads are affected-frame-only and merge with current Dashboard state.
- [x] Raw Dashboard frame/layout methods stay history-free.
- [x] Dashboard local UI/session state stays outside canonical history.
- [x] Lane width proof remains deferred to Phase 1.3d.
- [x] Focused verification and build gate are named.

Acceptance Mapping:
- Phase 1.3c can be accepted when Manager agrees completed sticky-note resize pointer-up creates canonical `Resize sticky note` entries and live preview/raw setters remain history-free.
- `Edit-History-Gen2-HLG-2` remains open after this phase because lane-width proof and later board-command candidates remain split.
- Recommended next Manager action is acceptance review for `Edit-History-Gen2-2 / Phase 1.3c - Sticky Note Resize Entries`.

Implementation Closeout:
- Added `commitDashboardStickyNoteFrameWithHistory(noteId, frame, options?)` beside the Dashboard board lane/placement helpers.
- Routed only the `DashboardSurface` resize pointer-up branch through the wrapper; pointermove preview still updates local resize preview state only.
- The wrapper guards missing target layouts before calling raw `setStickyNoteFrame(...)`, compares normalized frame snapshots after the raw call, and commits one `Resize sticky note` entry only for changed `x`/`y`/`width`/`height`.
- Undo/redo restores only affected frame fields and merges into current Dashboard state so current lane, parent, unrelated layouts, lane widths, and later unrelated layout changes survive.
- Focused repair coverage additionally moves the resized note to a later lane after the resize entry, proving frame undo/redo preserves the current lane placement while restoring only frame fields.
- Raw `setStickyNoteFrame(...)` and raw layout methods remain history-free and redo-preserving.
- No DashboardSurface pointer integration test was added because the pointer geometry path is broad and the phase-owned routing swap is a tiny direct replacement covered by focused store helper tests plus existing raw-store proof.

Verification Notes:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` passed 12 tests.
- Focused repair rerun: `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` passed 12 tests after adding later-lane-move preservation proof.
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed 3 tests.
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` passed 8 tests.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

## [x] `Edit-History-Gen2-2 / Phase 1.3d` - `Dashboard Lane Width Commit Boundary Proof`

### Phase 1.3d Summary

Purpose:
- prove the current Dashboard lane-width resize path is durable, raw, history-free, and redo-preserving before any canonical lane-width undo entry is introduced
- document why the current live seam is not implementation-ready for runtime canonical entries: pointermove writes durable lane widths directly, while pointer-up only clears local resize state
- keep lane-width runtime undo deferred until a later phase creates or proves a safe completed-change boundary without rewriting Dashboard pointer architecture

Owns:
- Dashboard lane-width resize seam research and proof around `DashboardSurface` lane resize pointer handling
- raw `useDashboardStore.setAdjacentLaneWidths(...)` durable lane-width mutation behavior
- focused proof that raw lane-width changes create no canonical edit-history entries and preserve redo before wrappers exist
- proof that lane-width persistence belongs to Dashboard lane records while local resize gesture state remains outside persistence/history

Does Not Own:
- runtime canonical lane-width undo wrappers or entries
- sticky-note frame resize, accepted in Phase 1.3c
- sticky-note placement/lane movement, accepted in Phase 1.3b
- lane create/rename/remove, accepted in Phase 1.3a
- smart align/grid layout commands, cleanup/reconcile/remove, sticky-note text, sticky-note create/delete/pin/color, Notepad, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, checkpoints, branching, collaboration, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior
- Dashboard selection, lifted note id, lane cameras, pan/zoom, drag preview, resize preview, selection box, menus, smart-align toggles, floating/popout host rects, prompt state, focus state, or other local UI/session state

Current Live Seams:
- `src/app/workspace/DashboardSurface.tsx`
  - `laneResizeStateRef` captures the left/right lane ids, pointer id, origin client x, origin lane pixel widths, and origin lane width weights on lane-resize handle pointerdown
  - `resizingLanePair` is local UI/session state for active resize styling
  - pointermove checks `laneResizeStateRef.current`, computes the pair width, clamps the left lane pixel width through `resolveMinimumLaneResizeWidth(...)`, derives the right width, converts both back into lane width weights, and calls raw `setAdjacentLaneWidths(leftLaneId, rightLaneId, leftWeight, rightWeight)` immediately
  - pointerup/pointercancel only clears `laneResizeStateRef` and `resizingLanePair`; it does not apply a final durable commit, compare before/after values, or call a completed-change callback
- `src/app/dashboard/useDashboardStore.ts`
  - `setAdjacentLaneWidths(leftLaneId, rightLaneId, leftWidth, rightWidth)` only updates when both lanes exist and are adjacent
  - it normalizes each width through `normalizeLaneWidth(...)`, where non-finite or too-small weights fall back to `1`
  - it no-ops when both normalized widths are unchanged
  - it updates only the two targeted lane records and leaves lane order, titles, sticky-note layouts, and local Dashboard UI/session state untouched
- `src/app/dashboard/useDashboardStore.test.ts`
  - already proves adjacent lane widths update and persist through Dashboard lane records
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - already includes raw `setAdjacentLaneWidths(...)` inside raw Dashboard organization mutation proof and redo-preservation coverage
- `src/app/store/dashboardBoardEditHistory.ts`
  - currently owns Dashboard board canonical history helpers for lane discrete entries, sticky-note placement gestures, and sticky-note frame resize entries
  - should not add lane-width runtime helpers in Phase 1.3d unless live research later proves a completed-change boundary exists

First-Pass Decisions:
- Phase 1.3d should be proof-only.
- The current pointer architecture has durable writes on pointermove, so adding canonical entries now would either spam history per tick or require broad begin/end buffering outside this phase.
- Pointer-up cannot be used as a safe completed-change boundary as-is because the final durable mutation has already happened through raw store writes.
- The next implementation should add or extend focused tests proving current raw lane-width behavior remains durable, no-entry, redo-preserving, and persistence-scoped.
- Runtime canonical lane-width undo should be deferred to a later phase that first introduces or proves a narrow lane-width drag transaction boundary.

### Phase 1.3d Implementation Spec

Exact First Code Cut / Proof-Only Cut:
- Do not add runtime wrappers, canonical entries, or `DashboardSurface` pointer routing changes in Phase 1.3d.
- Add focused proof in `src/app/store/productivityContentEditHistoryReadiness.test.ts`, `src/app/dashboard/useDashboardStore.test.ts`, or a narrow Dashboard board history/readiness sibling if cleaner.
- Prove raw `setAdjacentLaneWidths(...)`:
  - updates only adjacent lane width fields
  - persists through Dashboard lane records
  - creates no canonical `editHistoryStore` entries
  - preserves redo when a redo entry exists before the raw lane-width write
  - no-ops for missing/non-adjacent lane ids and unchanged normalized widths
- Prove current DashboardSurface lane-resize pointer-up has no authored commit callback if a reliable static/component proof exists; otherwise document this from the source seam and avoid broad jsdom pointer tests.
- Document that a future runtime phase needs a new or proven completed-change boundary before `Resize Dashboard lane` entries can be introduced.

Likely Files For Later Proof Implementation:
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `src/app/dashboard/useDashboardStore.test.ts`
- `src/app/store/dashboardBoardEditHistoryStore.test.ts` only if a board-history no-entry proof is clearer there
- `src/app/workspace/DashboardSurface.tsx` read-only unless a later approved runtime phase introduces a commit boundary
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during proof/test closeout

No-Widening Rule:
- Do not implement canonical lane-width runtime history in Phase 1.3d.
- Do not refactor DashboardSurface pointer architecture, lane resize refs, local UI state, or lane width layout rendering.
- Do not alter raw `setAdjacentLaneWidths(...)` semantics unless a focused test exposes a true bug and Manager explicitly approves repair.
- Do not touch sticky-note frame resize, placement, lane create/rename/delete, smart align/grid commands, cleanup/reconcile/remove, Notepad, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, checkpoints, branching, collaboration, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior.
- Do not capture/restore Dashboard selection, lane cameras, pan/zoom, resize preview, menus, floating rects, shell placement, prompt state, focus state, or local UI/session state.

No-Op / Redo Rules:
- raw `setAdjacentLaneWidths(...)` creates no canonical entries and preserves redo
- missing or non-adjacent lane ids no-op and preserve redo
- unchanged normalized widths no-op and preserve redo
- non-finite or too-small raw widths normalize through existing store semantics and remain raw/no-entry
- future runtime entries, if later approved, must commit at most one entry per completed lane-width gesture and must not record pointermove ticks

Implementation Risks:
- A runtime wrapper introduced at the raw store method would make every pointermove tick historyful; Phase 1.3d must avoid this.
- A pointer-up wrapper without begin-state capture would not know the gesture's authored before value because raw pointermove already mutated the durable state.
- A broad DashboardSurface drag transaction refactor would risk selection, camera, local UI state, and unrelated board gesture behavior; that belongs in a later approved runtime phase, not this proof.
- Lane-width undo/redo restore must eventually merge with current Dashboard lanes and avoid rewinding lane title/order/layout changes; Phase 1.3d should route that as a future requirement, not implement it.

Checklist:
- [x] Confirm lane-width pointermove currently writes durable lane width state through raw `setAdjacentLaneWidths(...)`.
- [x] Confirm lane-width pointer-up currently only clears local resize state.
- [x] Prove raw lane-width writes are durable, no-entry, and redo-preserving.
- [x] Prove lane-width persistence is scoped to Dashboard lane records.
- [x] Keep runtime lane-width undo deferred until a commit boundary exists.
- [x] Keep local Dashboard UI/session state outside canonical history.
- [x] Name focused verification and build gate.

Focused Verification For Later Proof Implementation:
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts`
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` only if board-history no-entry coverage is added there
- focused DashboardSurface lane resize test only if a small reliable proof exists; avoid broad pointer geometry tests
- `npm.cmd run build`

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- proof/test implementation updated `docs/CHANGELOG.md`
- proof/test implementation updated this phase doc with checklist truth, closeout, verification notes, and Doc History
- proof/test implementation updated `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if proof work starts requiring DashboardSurface pointer architecture changes
- stop if runtime lane-width entries are needed to pass the proof; report that a commit-boundary phase is required instead
- stop if lane-width restore would require replacing the whole Dashboard store or rewinding unrelated lane/title/order/layout state
- stop if tests require broad AppShell/workspace integration instead of focused store/readiness proof

Done Shape:
- [x] Phase 1.3d is implemented as proof-only for current lane-width behavior.
- [x] Current raw lane-width drag/store updates are proven durable, no-entry, and redo-preserving.
- [x] Pointermove durable mutation and pointer-up local cleanup are documented as the reason runtime lane-width undo remains deferred.
- [x] Dashboard local UI/session state remains outside canonical history.
- [x] A future runtime lane-width entry phase is explicitly blocked on a safe completed-change boundary.
- [x] Focused verification and build gate are named.

Acceptance Mapping:
- Phase 1.3d is accepted because Manager agrees lane-width undo should not ship until a completed-change boundary exists.
- `Edit-History-Gen2-HLG-2` remains open after this proof because lane-width runtime entries and later board command planning remain deferred.
- Recommended next Manager action is prep for `Edit-History-Gen2-2 / Phase 1.3e - Dashboard Board Command Routing`.

Implementation Closeout:
- Added focused readiness coverage proving raw `setAdjacentLaneWidths(...)` updates adjacent lane widths, leaves sticky-note layouts untouched, persists through Dashboard lane records, creates no canonical entries, and preserves redo.
- Added raw Dashboard store coverage proving missing lane ids, non-adjacent lane ids, unchanged normalized widths, and non-finite/too-small width normalization follow existing no-op/normalization behavior.
- No runtime lane-width history wrappers, canonical entries, DashboardSurface pointer routing changes, or production code changes were added.
- Runtime lane-width undo remains deferred until a later phase creates or proves a safe completed-change boundary that does not record pointermove ticks.

Verification Notes:
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed 4 tests.
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` passed 8 tests.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

## [x] `Edit-History-Gen2-2 / Phase 1.3e` - `Dashboard Board Command Routing`

### Phase 1.3e Summary

Purpose:
- route explicit Dashboard board layout commands into the existing canonical productivity history ladder without widening raw cleanup, camera/session state, or lane-width runtime undo
- decide the first implementation-ready command slice after accepted lane create/rename/delete, sticky-note placement gestures, sticky-note resize, and lane-width proof
- keep effect-driven cleanup and local/session command helpers honest instead of silently treating every layout mutation as an authored board command

Owns:
- explicit DashboardSurface Align selected notes and Arrange lane notes into grid button commands
- one-entry grouping for command-triggered sticky-note x/y placement changes
- command-specific restore boundaries that merge into current Dashboard state and preserve unrelated lane/layout/frame/parent changes
- proof/routing for fit/camera, smart-align toggle state, reconcile cleanup, and raw layout removal exclusions

Does Not Own:
- lane width runtime undo; Phase 1.3d proved it remains blocked on a completed-change boundary
- sticky-note drag/drop placement gestures, accepted in Phase 1.3b
- sticky-note frame resize, accepted in Phase 1.3c
- lane create/rename/delete, accepted in Phase 1.3a
- Notepad text/discrete note entries, Dashboard sticky-note text, note create/delete/pin/color, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, checkpoints, branching, collaboration, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior
- Dashboard selection, focus, menus, smart-align toggle persistence, lane cameras, pan/zoom, fit-to-view camera changes, drag preview, resize preview, selection box, floating/popout host rects, prompt state, or other local UI/session state

Current Live Seams:
- `src/app/workspace/DashboardSurface.tsx`
  - `handleAlignSelectedNotes(laneId, direction)` is an explicit button action for selected layouts in one lane.
  - Smart-align enabled path calls raw `setStickyNotePlacements(resolveSmartAlignedPlacements(...))` once.
  - Non-smart align path loops raw `setStickyNotePlacement(...)` once per selected layout.
  - `handleArrangeLaneNotesIntoGrid(laneId)` is an explicit button action that chooses selected layouts when at least two are selected in the lane, otherwise uses all pinned notes in that lane, then calls raw `setStickyNotePlacements(resolveLaneGridPlacements(...))` once.
  - `fitLaneToNotes(laneId)` changes only local `laneCameras` state and should stay outside canonical history.
  - `smartAlignEnabledByLane` is component-local/session UI state; it affects which command algorithm runs but is not durable board content and should stay outside canonical history.
  - `reconcileStickyNoteLayouts(pinnedNoteIds)` runs from an effect when pinned note ids change; it is cleanup derived from Notepad pin/order state rather than a direct authored Dashboard board command.
- `src/app/dashboard/useDashboardStore.ts`
  - raw `setStickyNotePlacement(...)` and `setStickyNotePlacements(...)` remain history-free base methods and normalize lane/x/y while preserving existing size/frame/parent fields.
  - raw `removeStickyNoteLayout(...)` deletes a layout by note id and is currently a cleanup seam without an explicit authored command boundary.
- `src/app/store/dashboardBoardEditHistory.ts`
  - `commitDashboardStickyNotePlacementsWithHistory(...)` already groups placement/lane movement and optional same-drop attachment parent changes into one canonical entry.
  - The existing helper restore includes placement snapshots with `laneId`, `x`, `y`, and `parentNoteId` when present; for align/grid commands, direct reuse needs care because the command only owns x/y, not later parent/lane changes made after the command.
- `src/app/store/dashboardBoardEditHistoryStore.test.ts`
  - already covers placement helper grouping/no-op/raw no-entry behavior for gesture-owned movement entries and can host board command helper coverage if the implementation extends helper metadata/field ownership.
- `src/app/workspace/DashboardLaneEditHistory.test.tsx`
  - already hosts focused DashboardSurface lane command routing proof and is the likely home for focused align/grid button routing proof if UI coverage stays small.

First-Pass Decisions:
- Phase 1.3e should be a runtime implementation slice for explicit align/grid board commands only.
- Split cleanup/exclusion work into a later `Phase 1.3f - Dashboard Cleanup Exclusion Proof` covering `reconcileStickyNoteLayouts(...)`, `removeStickyNoteLayout(...)`, and any other effect/raw cleanup path without an authored command boundary.
- Do not route `fitLaneToNotes(...)`; it is local lane camera/navigation state.
- Do not route `smartAlignEnabledByLane`; it is local/session toggle state. Only the resulting explicit Align button command may create history when it changes note positions.
- The placement helper can be reused for normalization, grouping, labels, and merge restoration only if implementation narrows command restore ownership to fields the command actually owns. If direct reuse would restore `parentNoteId` or `laneId` after unrelated later changes, add a tiny command-specific wrapper or owned-field option instead of using the default gesture helper shape unchanged.

### Phase 1.3e Implementation Spec

Exact First Code Cut:
- In `src/app/store/dashboardBoardEditHistory.ts`, add a tiny command-oriented helper or extend the existing placement helper with owned-field/metadata options:
  - preferred shape: `commitDashboardBoardPlacementCommandWithHistory(command, layouts, options?)`
  - command values:
    - `align-vertical`
    - `align-horizontal`
    - `arrange-grid`
  - the helper should call raw `setStickyNotePlacements(...)` once after capturing before snapshots for the affected note ids.
  - it should compare normalized after-state from the store, not just requested preview values.
  - restore should target only command-owned placement fields, expected first cut `x`/`y`, while preserving current lane, parent, frame size, unrelated layouts, lane widths, and later unrelated layout changes.
- In `DashboardSurface.handleAlignSelectedNotes(...)`:
  - keep selection checks and command algorithms unchanged.
  - replace smart-align raw `setStickyNotePlacements(...)` with the command wrapper.
  - replace the non-smart per-layout `setStickyNotePlacement(...)` loop with one command wrapper call over the computed target layouts, preserving the same final x/y values.
- In `DashboardSurface.handleArrangeLaneNotesIntoGrid(...)`:
  - keep selected-versus-all-pinned target selection unchanged.
  - replace raw `setStickyNotePlacements(resolveLaneGridPlacements(...))` with one command wrapper call.
- Do not touch `fitLaneToNotes(...)`, `smartAlignEnabledByLane`, `reconcileStickyNoteLayouts(...)`, `removeStickyNoteLayout(...)`, lane-width resize, or accepted lane/placement/frame/text/discrete note phases.

Likely Files:
- `src/app/store/dashboardBoardEditHistory.ts`
- `src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardLaneEditHistory.test.tsx` if focused UI button routing proof is practical
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `src/app/dashboard/useDashboardStore.test.ts` only if raw cleanup/no-op proof is touched
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Labels / Metadata:
- source:
  - `surface: dashboard`
  - `sourceId: board`
  - `sourceLabel: Dashboard board`
- align vertical:
  - label: `Align sticky notes`
  - targetId: `dashboard-board-command:align-vertical:<laneId>` or deterministic lane-scoped equivalent
  - targetLabel: `Vertical alignment`
- align horizontal:
  - label: `Align sticky notes`
  - targetId: `dashboard-board-command:align-horizontal:<laneId>` or deterministic lane-scoped equivalent
  - targetLabel: `Horizontal alignment`
- grid:
  - label: `Arrange sticky notes`
  - targetId: `dashboard-board-command:grid:<laneId>` or deterministic lane-scoped equivalent
  - targetLabel: `Sticky note grid`

No-Widening Rule:
- Do not implement lane width runtime undo, cleanup/reconcile/remove history, fit/camera history, smart-align toggle history, or generic board command architecture in Phase 1.3e.
- Do not make raw Dashboard store layout methods historyful.
- Do not capture/restore the whole Dashboard store or local/session UI state.
- Do not restore Dashboard selection, focus, menus, smart-align toggle state, lane cameras, pan/zoom, fit-to-view state, drag preview, resize preview, selection box, floating/popout host rects, prompt state, command transcript/recall, Browser/project, Catalog/Pubwheel, history UI, persistence architecture, checkpoints, branching, collaboration, Build Path, preview/cache/provider state, workspace layout/preferences, or unrelated workspace behavior.
- Do not alter accepted Phase 1.3a/1.3b/1.3c behavior except for shared helper reuse where focused regressions prove no behavior drift.

No-Op / Redo Rules:
- disabled UI commands should still do nothing before helper entry points are reached
- fewer than two affected layouts creates no entry and preserves redo
- missing affected layouts create no entry and preserve redo
- unchanged normalized x/y positions create no entry and preserve redo
- smart-align and non-smart align both create at most one entry per button action when normalized positions change
- grid command creates at most one entry per button action when normalized positions change
- real command entries invalidate redo exactly once
- raw `setStickyNotePlacement(...)`, `setStickyNotePlacements(...)`, `reconcileStickyNoteLayouts(...)`, and `removeStickyNoteLayout(...)` remain no-entry unless a later proof phase changes that with Manager approval

Implementation Risks:
- Directly using `commitDashboardStickyNotePlacementsWithHistory(...)` unchanged may over-restore `parentNoteId` or `laneId` for affected notes after unrelated later changes; implementation should narrow command restore to the fields align/grid own.
- Non-smart align currently loops raw writes, so the implementation must collapse those writes into one wrapper call without changing the final normalized positions.
- Grid commands can target all pinned notes in a lane when fewer than two notes are selected; tests should cover either selected targets or the fallback target mode so command grouping is not accidentally selection-only.
- Broad UI pointer or AppShell tests would be fragile; prefer helper tests plus a focused DashboardSurface button test only if the existing lane-history UI test pattern can stay small.

Checklist:
- [x] Confirm explicit align button commands route through one command helper entry per changed button action.
- [x] Confirm explicit grid button commands route through one command helper entry per changed button action.
- [x] Confirm smart-align toggle state remains local/session-only.
- [x] Confirm fit-to-view camera changes remain excluded.
- [x] Confirm reconcile/remove cleanup paths are split to Phase 1.3f proof/exclusion, not silently routed in Phase 1.3e.
- [x] Confirm command restore preserves unrelated lane/layout/frame/parent changes.
- [x] Confirm raw Dashboard layout methods remain history-free.
- [x] Confirm focused verification and build gate pass.

Focused Verification:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/workspace/DashboardLaneEditHistory.test.tsx` if DashboardSurface command buttons are routed/tested there or a focused sibling is added
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` only if raw cleanup/no-op proof is touched
- `npm.cmd run build`

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- implementation updates `docs/CHANGELOG.md` with a permanent numbered body entry
- implementation updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- implementation updates `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if align/grid command restore cannot preserve later unrelated parent/lane/frame/layout changes without broad helper rewrites
- stop if direct helper reuse would over-restore placement fields and a tiny owned-field option/sibling helper is not enough
- stop if DashboardSurface command routing requires broad selection, smart-align, camera, or AppShell architecture changes
- stop if cleanup/reconcile/remove proof pressure expands this runtime command phase beyond explicit button actions

Done Shape:
- [x] Phase 1.3e routes explicit Align and Arrange Grid Dashboard board commands only.
- [x] Each changed button action creates one canonical command entry.
- [x] Live/raw store methods remain history-free and redo-preserving.
- [x] Undo/redo restores only command-owned x/y placement fields and merges with current Dashboard state.
- [x] Fit/camera, smart-align toggle, reconcile cleanup, raw layout removal, lane width, and local/session state remain excluded or deferred.
- [x] Focused helper/UI/readiness verification and build gate pass.

Acceptance Mapping:
- Phase 1.3e is accepted because Manager agrees explicit Dashboard align/grid button commands create grouped canonical entries while cleanup/session/camera paths remain excluded.
- `Edit-History-Gen2-HLG-2` remains open after Phase 1.3e because cleanup exclusion proof, lane-width runtime deferral, and later board command candidates remain.
- Manager approved the narrow runtime command implementation; cleanup exclusion proof remains split to later `Phase 1.3f`.
- Recommended next Manager action is prep for `Edit-History-Gen2-2 / Phase 1.3f - Dashboard Cleanup Exclusion Proof`.

Implementation Closeout:
- Added `commitDashboardBoardPlacementCommandWithHistory(command, layouts, options)` beside the Dashboard board history helpers for explicit Align vertical, Align horizontal, and Arrange Grid command entries.
- The command helper filters to existing affected layouts, calls raw `setStickyNotePlacements(...)` once, compares normalized after-state, and commits one canonical command entry only when at least one affected note's x/y changed.
- Undo/redo restores only command-owned `x`/`y` fields for changed notes and preserves current lane, parent, width, height, unrelated layouts, lane widths, and later unrelated layout changes.
- Routed `DashboardSurface.handleAlignSelectedNotes(...)` smart-align and non-smart paths through the command helper; the non-smart path now collapses the prior per-note raw loop into one grouped command call.
- Routed `DashboardSurface.handleArrangeLaneNotesIntoGrid(...)` through the command helper while preserving selected-versus-all-pinned target selection.
- Left `fitLaneToNotes(...)`, `smartAlignEnabledByLane`, `reconcileStickyNoteLayouts(...)`, `removeStickyNoteLayout(...)`, lane-width runtime undo, and raw Dashboard layout methods outside canonical history.

Verification Notes:
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` passed 15 tests.
- `npm.cmd test -- --run src/app/workspace/DashboardLaneEditHistory.test.tsx` passed 2 tests.
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed 4 tests.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

## [x] `Edit-History-Gen2-2 / Phase 1.3f` - `Dashboard Cleanup Exclusion Proof`

### Phase 1.3f Summary

Purpose:
- prove Dashboard cleanup and reconciliation seams are durable raw store cleanup, not direct authored Dashboard board commands that should create canonical entries
- keep `reconcileStickyNoteLayouts(...)`, `removeStickyNoteLayout(...)`, and layout normalization outside canonical undo while accepted Notepad and Dashboard authored wrappers remain the undo owners
- close the remaining cleanup/reconcile/remove board-command planning question after Phase 1.3e without adding runtime cleanup history wrappers

Owns:
- proof that `DashboardSurface` calls `reconcileStickyNoteLayouts(pinnedNoteIds)` from an effect when pinned note ids change
- proof that raw `useDashboardStore.reconcileStickyNoteLayouts(noteIds)` creates, prunes, and normalizes durable sticky-note layouts without creating canonical edit-history entries or invalidating redo
- proof that raw `useDashboardStore.removeStickyNoteLayout(noteId)` deletes one layout and relies on `normalizeDashboardStickyNoteLayouts(...)` to detach invalid child parents without creating canonical edit-history entries or invalidating redo
- proof that normalization cleanup prunes invalid `parentNoteId`, invalid size fields, and invalid lane/fallback state as Dashboard-owned cleanup, not a direct board command entry
- proof that accepted Notepad pin/unpin and delete wrappers remain the authored entry seams while Dashboard reconcile/remove cleanup stays downstream and raw

Does Not Own:
- runtime cleanup history wrappers or canonical `Cleanup Dashboard layout` entries
- lane-width runtime undo; Phase 1.3d keeps that deferred until a safe completed-change boundary exists
- accepted align/grid routing from Phase 1.3e
- accepted sticky-note placement, frame resize, lane create/rename/delete, Dashboard sticky-note text, Notepad text, or Notepad discrete note wrappers
- Dashboard selection, lifted note id, lane cameras, pan/zoom, drag preview, resize preview, selection box, menus, smart-align toggle state, floating/popout host rects, prompt state, focus state, local/session state, Browser/project, Catalog/Pubwheel, command transcript/recall, history UI, persistence architecture, checkpoints, branching, collaboration, Build Path, workspace layout/preferences, runtime/cache/provider state, or unrelated workspace behavior

Current Live Seams:
- `src/app/workspace/DashboardSurface.tsx` derives `pinnedNoteIds` from Notepad `noteOrder` and `notesById`, then runs `reconcileStickyNoteLayouts(pinnedNoteIds)` from a `useEffect(...)` keyed by the pinned-note signature.
- `src/app/dashboard/useDashboardStore.ts` exposes raw `reconcileStickyNoteLayouts(noteIds)`; it unique-filters the input ids, removes layouts for absent ids, creates default layouts for new pinned ids, preserves existing layout x/y/lane when valid, falls back invalid lanes to an existing lane, and returns unchanged state when nothing changes.
- `src/app/dashboard/useDashboardStore.ts` exposes raw `removeStickyNoteLayout(noteId)`; it no-ops when the layout is missing, deletes the layout when present, and normalizes remaining layouts.
- `src/app/dashboard/dashboardPersistence.ts` `normalizeDashboardStickyNoteLayouts(...)` clones layouts, rounds/clamps stored size values, removes invalid sizes, removes blank/invalid/cyclic/cross-lane parent links, and keeps persisted Dashboard payloads scoped to lanes plus sticky-note layouts.
- Existing `src/app/store/productivityContentEditHistoryReadiness.test.ts` already proves broad raw Dashboard organization mutations are durable, history-free, and redo-preserving, and includes a raw `removeStickyNoteLayout(...)` call.
- Existing `src/app/dashboard/useDashboardStore.test.ts` already covers reconcile layout creation/pruning, parent detachment when notes cross lanes or disappear, attachment cycle prevention, persistence normalization, and lane/layout durability.

First-Pass Decisions:
- Phase 1.3f should be proof-only. There is no direct authored cleanup button/gesture boundary; cleanup is downstream state reconciliation from Notepad pin/delete or raw maintenance seams.
- Do not route cleanup through canonical history. The accepted upstream wrappers are the correct authored undo seams: Notepad pin/unpin/delete and the accepted Dashboard board operations.
- The implementation proof should explicitly seed redo, call raw reconcile/remove/normalization seams, prove state changes are durable and scoped, and prove canonical redo remains available.
- After Phase 1.3f proof acceptance, this doc can recommend `Edit-History-Gen2-HLG-2` complete for currently supported productivity content undo coverage if Manager accepts lane-width runtime undo as an explicit deferred gap rather than a blocker. If Manager requires lane-width runtime undo before closing HLG-2, keep HLG-2 open and route lane width to a future commit-boundary phase.

### Phase 1.3f Implementation Spec

Exact First Proof Cut:
- Extend `src/app/store/productivityContentEditHistoryReadiness.test.ts` with a focused cleanup proof:
  - seed redo through `editHistoryStore`
  - set up pinned-like layouts with raw Dashboard store calls
  - call `reconcileStickyNoteLayouts([...])` to add, keep, prune, and normalize layouts
  - call `removeStickyNoteLayout(noteId)` to remove a layout and detach dependent child `parentNoteId` values
  - assert durable Dashboard state and persisted payload reflect only lanes and sticky-note layouts
  - assert no canonical undo entries were created and redo remains available
- Extend `src/app/dashboard/useDashboardStore.test.ts` only if raw cleanup semantics need a tighter store-owned assertion:
  - missing `removeStickyNoteLayout(...)` no-ops
  - reconcile no-op for unchanged normalized layouts returns stable state
  - invalid parent/size/lane cleanup follows existing normalization rules
- Use `src/app/store/dashboardBoardEditHistoryStore.test.ts` only if Manager wants adjacent accepted helper no-regression proof that cleanup still does not appear as a board-history command after accepted placement/resize/align/grid entries.
- Do not edit `DashboardSurface` unless a focused test exposes a true contradiction in the documented effect seam; expected implementation is test/proof-only.

Likely Files:
- `src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `src/app/dashboard/useDashboardStore.test.ts`
- `src/app/store/dashboardBoardEditHistoryStore.test.ts` only for adjacent accepted helper no-regression proof if needed
- this phase doc
- `docs/CHANGELOG.md` for proof/test implementation behavior
- `docs/Doc-Log.md`

No-Widening Rule:
- Do not add runtime cleanup history wrappers, canonical cleanup entries, DashboardSurface pointer/effect routing changes, or raw store history behavior.
- Do not implement lane-width runtime undo, align/grid changes, Notepad wrapper changes, Dashboard text/lane/placement/resize changes, board command architecture, cleanup commands, or persistence architecture.
- Do not capture/restore Dashboard selection, lifted note id, lane cameras, pan/zoom, drag preview, resize preview, selection box, menus, smart-align toggle state, floating/popout host rects, prompt state, focus state, local/session state, command transcript/recall, Browser/project, Catalog/Pubwheel, history UI, checkpoints, branching, collaboration, Build Path, workspace layout/preferences, runtime/cache/provider state, or unrelated workspace behavior.

No-Op / Redo Rules:
- raw `reconcileStickyNoteLayouts(...)` creates no canonical entry and preserves redo for added, pruned, normalized, and unchanged layout outcomes
- raw `removeStickyNoteLayout(...)` creates no canonical entry and preserves redo for present and missing target layouts
- normalization cleanup of invalid parent links, invalid size fields, invalid lane fallback, and removed parent layouts creates no canonical entry and preserves redo
- accepted upstream wrappers remain responsible for canonical authored intent; cleanup should not create a second entry after pin/unpin/delete or board command entries

Implementation Risks:
- A broad DashboardSurface test could make local selection/camera/session details look owned by this phase; prefer store-level proof unless Manager asks for effect-level UI coverage.
- Reconcile can create default layouts for newly pinned notes; proof should state that default layout creation is downstream cleanup, while the upstream Notepad pin wrapper owns the authored action.
- `removeStickyNoteLayout(...)` can detach child parent links through normalization. Proof should treat that as cleanup-owned normalization, not as a direct authored attachment command.
- HLG-2 closeout depends on Manager accepting lane-width runtime undo as deferred because no safe completed-change boundary exists today.

Checklist:
- [x] Prove raw reconcile creates, prunes, and normalizes Dashboard layouts without canonical history entries.
- [x] Prove raw layout removal removes only Dashboard layout cleanup state and detaches invalid child parents without canonical history entries.
- [x] Prove cleanup operations preserve redo.
- [x] Prove persisted Dashboard payload remains scoped to lanes and sticky-note layouts.
- [x] Confirm accepted Notepad and Dashboard wrappers remain the authored command seams and cleanup does not double-commit.
- [x] Confirm lane-width runtime undo remains deferred for commit-boundary reasons.
- [x] Confirm focused verification and build gate pass.

Focused Verification:
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts`
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts`
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` only if adjacent accepted helper no-regression proof is added or needed
- `npm.cmd run build`

Build Gate:
- `npm.cmd run build`

Tracking Docs:
- prep updates this phase doc and `docs/Doc-Log.md`
- proof/test implementation later updates `docs/CHANGELOG.md` with a permanent numbered body entry
- proof/test implementation later updates this phase doc with checklist truth, closeout, verification notes, and Doc History
- proof/test implementation later updates `docs/Doc-Log.md`
- do not update Gen2 index, Dispatch run-state, Doc-Index, or mark `Edit-History-Gen2-HLG-2` complete; Manager handles acceptance/status

Stop Conditions:
- stop if proof reveals an explicit authored cleanup command boundary that should be a separate runtime entry rather than exclusion proof
- stop if cleanup proof requires routing Notepad pin/delete or accepted Dashboard board wrappers differently
- stop if preserving redo requires making raw Dashboard cleanup methods historyful
- stop if tests require broad DashboardSurface/AppShell interaction coverage involving selection, camera, menus, previews, shell placement, or session state
- stop if HLG-2 closeout depends on unresolved lane-width runtime undo rather than accepted deferral

Done Shape:
- [x] Phase 1.3f proves Dashboard cleanup/reconcile/remove seams are durable raw cleanup and remain outside canonical history.
- [x] Raw cleanup operations mutate only Dashboard lanes/layouts as expected, preserve redo, and create no canonical entries.
- [x] Accepted upstream Notepad and Dashboard wrappers remain the authored canonical history seams.
- [x] No runtime cleanup wrappers, DashboardSurface routing changes, or broad Dashboard state captures are added.
- [x] Focused cleanup proof and production build verification pass.

Acceptance Mapping:
- Phase 1.3f is accepted because focused proof shows cleanup/reconcile/remove are raw downstream cleanup seams rather than direct authored Dashboard board commands.
- Manager marked `Edit-History-Gen2-HLG-2` complete for supported productivity content undo coverage because lane-width runtime undo has been accepted as an explicit deferred commit-boundary gap.
- If later work introduces a safe lane-width completed-change boundary, route it to a future commit-boundary phase rather than widening Phase 1.3f.
- Recommended next Manager action is prep `Edit-History-Gen2-3 / Phase 1 - Workspace Layout And Preference Ownership Proof`.

Implementation Closeout:
- Extended `src/app/store/productivityContentEditHistoryReadiness.test.ts` with focused cleanup proof for raw `reconcileStickyNoteLayouts(...)` and `removeStickyNoteLayout(...)`.
- The proof seeds redo, builds Dashboard lane/layout state through raw store calls, reconciles pinned-like note ids to add, keep, prune, and normalize layouts, removes a layout, and verifies dependent child parent links are detached by normalization.
- The proof asserts Dashboard persistence remains scoped to `lanes`, `stickyNoteLayoutsByNoteId`, and `version`, with no canonical undo entries created and redo preserved.
- No runtime cleanup wrappers, canonical cleanup entries, DashboardSurface effect/routing changes, raw store history behavior, lane-width runtime undo, or accepted Notepad/Dashboard wrapper changes were added.

Verification Notes:
- `npm.cmd test -- --run src/app/store/productivityContentEditHistoryReadiness.test.ts` passed 5 tests.
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts` passed 8 tests.
- `npm.cmd test -- --run src/app/store/dashboardBoardEditHistoryStore.test.ts` was not run because this phase did not touch adjacent accepted board-history helpers.
- `npm.cmd run build` passed with the known Vite externalized-module and chunk-size warnings.

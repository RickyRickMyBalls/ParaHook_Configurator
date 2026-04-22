# Edit History Vision

## Doc Header

### Doc History
8. 2026-04-22 17:56:30: Added Generation 5 durable CAD-local history batch direction after user review clarified CAD sessions such as Sketch Draw and Viewer Transform need local undo/redo command batches that persist across committed sessions and later session re-entry while remaining nested under canonical app history.
7. 2026-04-22 16:28:35: Marked the active command-session console-focused undo goal complete after Gen4-3 implemented focused Console Sketch Draw undo/redo routing, submitted tool-selection undo/redo, focused tests, and production build proof.
6. 2026-04-22 15:16:08: Added the console-focused command-session undo goal after research showed Sketch Draw staged undo/redo can be blocked by focused console inputs, routing the first fix into Generation 4 while preserving a reusable policy direction for later console-driven active sessions.
5. 2026-04-22 12:12:20: Added the follow-up Sketch Draw staged command-buffer goal after user review clarified completed rectangles and other draw commands must be undoable inside the active Sketch Draw session before the user commits the sketch.
4. 2026-04-22 11:10:11: Added a new Sketch Draw authored command history goal after user review clarified that individual Sketch Draw lines and commands should become undoable/redoable once they commit durable sketch geometry, routing the work into Generation 4 instead of reopening the already-closed Gen 1 feature-stack sketch scope.
3. 2026-04-22 04:12:09: Pointed the Gen 2 vision at the new `Edit-History-Gen2-Index.md` scan surface and its four concise future planning docs for durable scene presentation, productivity content, workspace layout/preference, and sampler/import setting undo candidates.
2. 2026-04-22 04:07:31: Clarified later-generation routing after `Edit-History-6 / Phase 3`, making Gen 2 the lane for durable single-user setting/content undo candidates and Gen 3 the lane for advanced history UX, checkpoints, optional branching, advanced Build Path comparison, and collaboration only if explicitly promoted.
1. 2026-04-22 00:11:26: Created the `Edit History` family vision from the undoable-surface audit, preserving the wishlist of possible undoable surfaces while filtering the first generation toward canonical authored undo/redo, graph and parameter edits, node-owned CAD authoring, Browser/project content commits, committed transforms, and derived-reader alignment.

### Purpose

This doc is the north-star vision for the `Edit History` architecture family.

Use it to answer:
- what should eventually feel undoable in ParaHook
- what should be canonical undo/redo in the first generation
- what should stay outside authored undo until it becomes durable authored state
- how `Edit History` should relate to `Build Path`, command recall, transform history, and other history-like surfaces

## Doc Body

### North Star

ParaHook should have one canonical authored-change history.

Users should be able to press `Ctrl+Z` or `Ctrl+Y` and trust that the app moves through meaningful modeling, graph, project, and committed transform edits instead of only undoing whichever panel happened to be focused.

The system should feel broad to the user but disciplined internally:
- canonical history records authored state changes
- local draft, navigation, preview, runtime, cache, and command-recall state can keep its own local behavior
- derived surfaces such as `Build Path` and history UI read the canonical truth instead of becoming second undo owners

### What Must Stay True

- `Edit History` owns canonical authored undo/redo.
- `Build Path` reads authored history truth but does not own a competing undo stack.
- Continuous interactions can preview live, but they commit one meaningful history entry on release, drop, blur, `Enter`, or explicit confirm.
- Console commands that mutate authored state route through the same mutation seams as visible UI edits.
- Pure navigation, camera motion, hover, selection-only state, command recall, runtime progress, preview cache, provider status, and build cache state do not become first-generation canonical undo entries.
- Later durable UI state can become undoable only when it is intentionally modeled as authored state and has clear transaction boundaries.

### Human Level Goals

- [ ] `Edit-History-HLG-1` - Make graph structure and graph parameter commits undoable first.
- [ ] `Edit-History-HLG-2` - Make node-owned CAD authoring, feature-stack edits, and committed sketch edits undoable through the same canonical owner.
- [ ] `Edit-History-HLG-3` - Make Browser/project organization and accepted import/catalog commits undoable without making selection, visibility-only, preview, cache, or provider status noise canonical.
- [ ] `Edit-History-HLG-4` - Make committed Viewer Transform entries undoable while keeping live drag frames and scrub navigation out of authored undo.
- [ ] `Edit-History-HLG-5` - Keep durable scene presentation, productivity state, workspace layout, and optional sampler settings visible as later undo candidates without starting there.
- [ ] `Edit-History-HLG-6` - Exclude camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, and command recall from first-generation canonical undo.
- [ ] `Edit-History-HLG-7` - Keep `Build Path`, history UI, and other timeline readers derived from canonical edit history instead of letting them become independent undo owners.
- [ ] `Edit-History-HLG-8` - Make completed Sketch Draw lines, shapes, polylines, and delete commands undoable/redoable as individual authored sketch commands while keeping hover, selection, and in-progress draft points local.
- [ ] `Edit-History-HLG-9` - Let users undo and redo completed Sketch Draw commands inside the active Sketch Draw session before committing the final staged sketch change into canonical edit history.
- [x] `Edit-History-HLG-10` - Let active command sessions keep undo/redo ownership after console command submissions so focused console inputs do not trap `Ctrl+Z` / `Ctrl+Y` away from the modeling command the user just committed.
- [ ] `Edit-History-HLG-11` - Store durable CAD-local undo/redo command batches inside or beside authored CAD targets so accepted Sketch Draw, Viewer Transform, and later CAD sessions can restore and replay local command histories after the session is reopened.

### Wishlist Organization

#### Generation 1 - Canonical Authored Undo Foundation

Generation 1 should make the core authored modeling surfaces undoable:
- canonical transaction owner and adapter contract
- graph structure edits
- graph parameter commits
- node-owned CAD authoring and feature-stack edits
- committed sketch edits
- Browser/project organization edits
- accepted import/catalog commits that create, replace, or delete durable project content
- committed Viewer Transform edits
- shared keyboard dispatch and surface-agnostic console mutation parity
- derived-reader refresh so `Build Path` responds to canonical undo/redo

#### Generation 2 - Durable Presentation And Productivity State

Generation 2 can evaluate durable but less foundational surfaces:
- authored scene presentation settings such as saved lighting, environment, material, and display choices after they are modeled as project/user state rather than transient viewer runtime state
- authored visibility/display presets when they become model/project state instead of selection-only or session-only toggles
- notepad/dashboard content and durable board organization after productivity ownership and storage are explicit
- workspace layout or mode preference state if it becomes project or user-authored state rather than window/session navigation
- optional sampler/import setting edits that affect durable authored output, excluding source browsing, provider/cache state, preview sessions, upload status, and other staging-only flows
- first focused future docs for these candidates should define ownership, storage, commit boundaries, and exclusion proof before any runtime undo adapter is implemented

Generation 2 scan surface:
- `Edit-History-Gen2-Index.md`

Initial Gen 2 future planning docs:
- `Future/Edit-History-Gen2-1 - Durable Scene Presentation Undo Candidates.md`
- `Future/Edit-History-Gen2-2 - Productivity Content Undo Candidates.md`
- `Future/Edit-History-Gen2-3 - Workspace Layout And Preference Undo Candidates.md`
- `Future/Edit-History-Gen2-4 - Sampler And Import Setting Undo Candidates.md`

#### Generation 3 - Advanced History UX And Branching

Generation 3 can evaluate richer history workflows:
- visible history UI, reader affordances, filtering, timeline presentation, and inspectable labels beyond the public metadata contract proved in Gen 1
- checkpoints, snapshots, and optional branching after persistence and single-user restore semantics are designed
- advanced `Build Path` comparison, branch comparison, or variant comparison after a live `Build Path` surface exists
- collaboration or multiplayer edit history only if the user promotes it as a product direction, because it changes ownership, conflict, undo, and branch semantics

#### Generation 4 - Sketch Draw Authored Command History

Generation 4 should reopen the intentionally deferred Sketch Draw authored-command seam:
- completed Sketch Draw line, rectangle, circle, and polyline commands should be undoable and redoable as individual commands
- delete-selected Sketch Draw commands should be undoable and redoable after they remove durable sketch components
- while Sketch Draw is active, completed commands should first live in a staged Sketch Draw command buffer so the user can draw five rectangles, undo two, and then commit the remaining three
- `Ctrl+Z` / `Ctrl+Y` should target staged Sketch Draw commands before app-wide canonical history while the Sketch Draw session owns command focus
- after console submissions inside Sketch Draw, focused console inputs should not steal `Ctrl+Z` / `Ctrl+Y` away from the active Sketch Draw command owner when there is no meaningful unsent console draft
- tool-selection commands such as `rec` should have an explicit command-session undo answer instead of relying on accidental native input undo
- committing Sketch Draw should produce canonical app history for the accepted staged delta instead of requiring every in-session command to escape immediately into app-wide history
- hover, selection-only state, local draft points, active tool choice, command prompt text, and camera state must stay local/session behavior
- draft-point undo inside an active command can stay local until the command completes a staged sketch command
- this generation should use the current exclusion proof and the Gen4-1 shipped seam as the starting boundary, then add an explicit staged command buffer before the final canonical commit

Generation 4 scan surface:
- `Edit-History-Gen4-Index.md`

Gen 4 future planning docs:
- `Future/Edit-History-Gen4-1 - Sketch Draw Authored Command Undo.md`
- `Future/Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer.md`
- `Future/Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership.md`

#### Generation 5 - Durable CAD-Local History Batches

Generation 5 should turn the temporary active-session command stack into durable nested CAD-local history:
- Sketch Draw should persist accepted local command batches so a user can make five rectangles, commit, reopen Sketch Draw, undo those five rectangles one by one, and redo them one by one.
- Viewer Transform already provides the reference pattern: target-local history rows are stored beside the target and canonical undo/redo restores both target state and local history rows.
- CAD-local histories should be nested under canonical app history, not competing app-wide undo stacks.
- canonical app entries should snapshot the before/after authored target state and before/after local CAD history batch.
- active CAD sessions should receive `Ctrl+Z` / `Ctrl+Y` first when they have local steps, then fall back to canonical app history.
- command transcript, command recall, hover, focus, camera, runtime/cache/provider/build state, checkpoints, branching, and collaboration remain out of this generation unless explicitly promoted later.

Generation 5 scan surface:
- `Edit-History-Gen5-Index.md`

Gen 5 future planning docs:
- `Future/Edit-History-Gen5-1 - Durable CAD Local History Batches.md`

### First Generation Exclusions

The audit found many things that could look history-like but should not become first-generation canonical undo:
- camera orbit, pan, zoom, fly movement, and temporary view framing
- hover, focus, menu-open, selected-tab, and selected-tool state
- selection-only changes that do not modify authored data
- command transcript and command recall
- build request, progress, cancel, error, result-cache, and preview-cache state
- live slider ticks and live transform drag frames before commit
- sketch draft points before a committed sketch entity exists
- `Build Path` playhead movement and transform scrub index movement when used as navigation
- catalog source/provider/cache/load status and preview readiness
- radio/transport/runtime state

### Implementation Shape

The first implementation should be boring in the best way:
- one shared history store or owner
- explicit entry types or adapters per authored subsystem
- transaction begin/update/commit/cancel semantics for live interactions
- inverse or snapshot payloads that are reliable enough to undo and redo the committed authored change
- focused tests around transaction boundaries, coalescing, redo invalidation, and surface-agnostic dispatch

The vision does not require every subsystem to store history the same way. It requires the user-facing behavior to read as one coherent undo/redo system.

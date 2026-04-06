# Dashboard Phase Dashboard-2 - Create Notepad Workspace And Shared Note Model

## Doc Header

### Doc History
2. 2026-04-03 20:22: Marked `Dashboard-2` shipped after the runtime implementation landed across the shared workspace and new feature-owned notepad seams, recorded that `notepad` now works in the main workspace slot tree with note persistence, split, float, popout, redock, restore, and focused regression coverage, and kept console workspace-modes plus popup-local shell adoption explicitly deferred
1. 2026-04-03 20:08: Added this dedicated `Dashboard-2` future phase doc by lifting `Phase 2 - Create Notepad Workspace And Shared Note Model` out of the umbrella `Dashboard.md`, grounding it in the live post-`Dashboard-1` workspace-surface seams plus the current lack of a generalized feature-persistence layer, and locking the next slice to `notepad` surface onboarding, one feature-owned note store, and narrow note persistence before sticky-note widget work begins

### Purpose

Use this phase to make `Notepad` real as its own workspace surface and to introduce the first shared note model that later dashboard widgets can consume.

The goal is not to ship sticky notes yet.
The goal is to create one honest note-writing surface plus one honest note data model so later dashboard work can attach to something real instead of inventing a second note system.

### Scope

This phase covers:
- adding `Notepad` as a new workspace surface kind
- rendering a first focused note-writing surface inside the workspace shell
- introducing one feature-owned shared note model
- adding note create, update, delete, and active-note selection behavior
- adding narrow note persistence and restore for the note model
- letting the main workspace shell host `Notepad` through split, float, popout, redock, restore, and layout persistence like the other surface kinds

This phase does not cover:
- `Sticky Notes`
- dashboard widgets
- board placement of notes inside `Dashboard`
- tags, folders, or multi-board organization
- rich text
- collaboration or sync
- console `Workspace Modes` adoption for `Notepad`
- popup-local `PopupWorkspaceShell` switching into `Notepad`

## Doc Body

### Summary

`Dashboard-2` is the first note-model phase for the dashboard family.

Current status:
- shipped in the main workspace shell on `2026-04-03`
- console `Workspace Modes` adoption still deferred
- popup-local `PopupWorkspaceShell` adoption still deferred

`Dashboard-1` already proved the main workspace shell can accept a new hosted surface kind cleanly.
That means `Dashboard-2` should stay similarly disciplined:
- add `notepad` as another honest workspace surface kind
- keep note content out of workspace-layout persistence
- introduce one small feature-owned note store instead of smearing note state across `AppShell` or the workspace store

### Current Code-Backed Read

The strongest owner seams for this phase are now:

- `src/app/workspace/workspaceShellTypes.ts`
  - widen `WorkspaceSurfaceKind` again for `notepad`
  - add generated surface-instance id rules for slot onboarding
- `src/app/workspace/ViewportFrame.tsx`
  - expose `Notepad` in the in-app slot type picker and visible labels
- `src/app/workspace/workspaceViewportLabels.ts`
  - add truthful workspace-facing labels for `Notepad`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - render the first `NotepadSurface`
- `src/app/workspace/useWorkspaceStore.ts`
  - keep slot switching, retained-surface reuse, detach, redock, and split flows honest for a second new non-viewer surface kind
- `src/app/workspace/workspaceSurfaceActions.ts`
  - verify float, popout, split, and redock helpers stay truthful for `notepad`
- `src/app/workspace/workspacePersistence.ts`
  - widen workspace layout persistence so surface placement survives with `notepad`
- `src/app/AppShell.tsx`
  - verify detached notepad hosts can stay isolated the same way `Dashboard` now does
- `src/app/hosts/useAppShellViewportActions.ts`
  - widen explicit slot switching through the shared AppShell action seam
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - likely add detached notepad floating or popout selectors if a dedicated host is used
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - still a later follow-on seam for popup-local switching, not part of this phase
- `src/app/console/stagedNavigation.ts`
  - still hard-codes the current supported workspace-mode surface kinds for console flows
  - should stay deferred in this phase for the same reason `Dashboard-1` deferred it
- `src/app/console/radioCommandIdentity.ts`
  - still a later follow-on seam tied to console workspace-mode adoption

The note-model seams are currently missing and should be introduced cleanly:

- there is no existing note store under `src/app/`
- there is no generalized feature persistence layer beyond workspace layout persistence in `workspacePersistence.ts`
- `AppShell.tsx` currently hydrates workspace layout only, which is the right sign that note persistence should stay feature-owned rather than being pushed into the workspace layout snapshot

### Locked Direction

`Dashboard-2` should:
- add `notepad` as a real workspace surface kind
- introduce one shared note model with narrow first-pass fields
- make one focused note-writing surface real
- keep note-model ownership outside `useWorkspaceStore.ts`

`Dashboard-2` should not:
- store note content inside `workspaceLayoutStorageKey`
- invent sticky-note card layout yet
- widen into dashboard widget rendering
- widen into console `Workspace Modes` adoption unless the scope is explicitly revisited

### Locked Shared Note Model

The first shared note model should stay small and stable:

- `id`
- `title`
- `body`
- `createdAt`
- `updatedAt`
- `isPinned`

Recommended truth:
- keep `isPinned` in the shared model now, even though `Sticky Notes` are deferred
- this prevents `Phase 3` from needing a second migration just to mark which notes should appear on the dashboard

This phase should not add:
- rich text blocks
- tags
- folders
- board coordinates
- style presets
- widget-local note variants

### Locked Product Shape

The first shipped `Notepad` surface only needs:
- one calm writing shell
- one active note at a time
- create note
- rename note
- edit note body
- switch active note through a simple note list or strip
- delete note
- persist and restore notes between sessions

If a list is included, keep it small and utilitarian.
This phase is not about designing a full document browser.

### Important Architecture Rule

Workspace layout persistence and note content persistence should stay separate.

`workspacePersistence.ts` should continue to own:
- slot placement
- host mode
- surface placement
- viewport layout restore

The new notepad persistence layer should own:
- note records
- active note identity
- note content fields

Healthy constraint:
- workspace layout should remember that a slot is hosting `notepad`
- the note store should remember which notes exist and what they contain
- neither layer should impersonate the other

### Exact First Code Cut

The implementation-ready first cut is:

1. Add `notepad` to `WorkspaceSurfaceKind` and the shared workspace surface seams already widened for `dashboard`.
2. Add a small feature folder for notepad ownership, likely under `src/app/notepad/`, with:
   - one shared note type file if needed
   - one `useNotepadStore.ts`
   - one `notepadPersistence.ts`
   - one `NotepadSurface.tsx`
3. Render `NotepadSurface` from `ViewportSurfaceRegistry.tsx`.
4. Keep the first note store narrow:
   - `notesById`
   - `noteOrder`
   - `activeNoteId`
   - create, delete, rename, edit-body, set-active, and pin-state actions
5. Add a guarded hydration and autosave path for note data through the new notepad persistence module.
6. Widen the main workspace shell so `notepad` supports slot switch, split, float, popout, redock, restore, and layout persistence in the same main-workspace path as `dashboard`.
7. Add focused tests, then stop without widening into sticky notes, dashboard widget rendering, console workspace-modes adoption, or popup-local shell switching.

### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- one new notepad host if detached notepad windows need the same isolation pattern as dashboard
- `src/app/notepad/useNotepadStore.ts`
- `src/app/notepad/notepadPersistence.ts`
- `src/app/notepad/NotepadSurface.tsx`
- focused tests around slot switching, note-model actions, persistence, and detached host behavior

### Recommended New Files

- `src/app/notepad/useNotepadStore.ts`
  - own shared note records and active note selection
  - stay feature-owned, not workspace-owned
- `src/app/notepad/notepadPersistence.ts`
  - own localStorage read and write for note data
  - use a dedicated key such as `parahook.notepad.notes.v1`
- `src/app/notepad/NotepadSurface.tsx`
  - own the first writing UI
  - keep the first shell calm and simple

### First Pass UI Direction

The safest first `NotepadSurface` shape is:
- left column or top strip with note titles
- main editor area with title input and body textarea
- no formatting toolbar
- no panel maze

The first shell should feel like a clear workspace, not a tiny widget and not a full document suite.

### Follow-On Seams Already Known

These are real later follow-ons, but they should stay out of `Dashboard-2`:

- `Sticky Notes`
  - read pinned notes from the shared note model later
- `Dashboard`
  - later consume `isPinned` note truth without owning note content itself
- `src/app/console/stagedNavigation.ts`
  - later add `Notepad` to `Workspace Modes > Viewport Type Menu`
- `src/app/console/radioCommandIdentity.ts`
  - later add `workspace.viewport.type.notepad`
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - later decide whether popup-local child-window shells also need `Notepad`

### Implementation Risks

The most likely risks in this phase are:

- accidentally pushing note content into workspace layout persistence
- mixing feature note state into `useWorkspaceStore.ts`
- overbuilding the first note model before sticky-note requirements are actually implemented
- treating detached `Notepad` hosting as a one-off AppShell special case instead of following the cleaner `DashboardWindowHost` pattern
- quietly widening into console workspace-mode adoption because surface-kind unions now include another new value

Healthy constraint:
- if this phase finds a reusable detached-host pattern that should serve future surfaces generally, document it clearly
- but do not widen `Dashboard-2` into a large generic host refactor unless the blocker is real and explicit

## [x] Phase Checklist

- [x] Add `notepad` to the canonical workspace surface-kind union and generated-id helpers
- [x] Add one feature-owned `NotepadSurface` and register it in the main viewport surface registry
- [x] Make the in-app slot type picker and labels expose `Notepad` for non-primary slots
- [x] Introduce one shared note model with `id`, `title`, `body`, `createdAt`, `updatedAt`, and `isPinned`
- [x] Add a feature-owned notepad store outside `useWorkspaceStore.ts`
- [x] Add narrow note persistence and restore outside workspace layout persistence
- [x] Support create, rename, edit, delete, set-active, and pin toggle behavior
- [x] Verify main-workspace split, float, popout, redock, and restore accept `notepad`
- [x] Add focused regression coverage for note-model behavior, persistence, and host-mode behavior
- [x] Keep sticky notes, dashboard widget rendering, console workspace-modes adoption, and popup-local switching deferred

## [ ] Verification Shape

Minimum verification for this phase should cover:

- switching a non-primary slot into `Notepad`
- switching a `Notepad` slot back into `Browser`, `Console`, `Spaghetti Editor`, and `Dashboard`
- creating the first note and editing its title and body
- switching active notes without losing persisted content
- deleting a note and recovering a sane next active note
- persisting notes through localStorage and restoring them on reload
- confirming workspace layout persistence still only owns surface placement, not note data
- floating and redocking a `Notepad` surface in the main workspace
- popping out and restoring a `Notepad` surface through the normal detached-surface path
- confirming console staged-navigation and popup-local shell switching were not half-adopted by accident

### Done Shape

`Dashboard-2` is done when:

- the user can open `Notepad` as a real main-workspace surface
- there is one honest shared note model behind the writing surface
- note content persists independently of workspace layout persistence
- later sticky-note widget work can consume the same note records instead of inventing a second note system
- console workspace-modes adoption and popup-local shell switching are still clearly deferred instead of implied

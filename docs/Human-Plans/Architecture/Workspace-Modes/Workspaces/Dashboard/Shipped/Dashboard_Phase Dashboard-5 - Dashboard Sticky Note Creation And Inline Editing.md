# Dashboard Phase Dashboard-5 - Dashboard Sticky Note Creation And Inline Editing

## Doc Header

### Doc History
2. 2026-04-04 06:51: Tightened this phase doc into an implementation-ready execution slice by re-reading the live `DashboardSurface.tsx` and `useNotepadStore.ts` seams, locking the first cut to one dashboard `Add Sticky Note` action, one extracted sticky-note card component, blur-commit inline title/body editing with visually seamless fields, and one dedicated drag handle so the phase stays command-sized instead of widening into a broader note-system redesign
1. 2026-04-04 06:47: Added this dedicated `Dashboard-5` future phase doc as the next dashboard-family implementation slice after shipped `Dashboard-4.1`, locking the next work to dashboard-created sticky notes plus inline title/body editing while keeping one shared note model, `Notepad` as the canonical text editor, and dashboard layout ownership separate from note-content ownership

### Purpose

Use this phase to make sticky notes feel native to `Dashboard` without splitting them into a second unrelated note system.

The goal is not to fork sticky notes away from `Notepad`.
The goal is to let users create and edit notes directly on the dashboard board while keeping `Notepad` as the larger plain-text editor view of the same note.

### Scope

This phase covers:
- adding an `Add Sticky Note` action directly inside `Dashboard`
- creating a new note from `Dashboard` and showing it immediately as a pinned sticky note
- allowing inline sticky-note title editing directly on the card
- allowing inline sticky-note body editing directly on the card
- keeping inline body edit visuals nearly identical to preview visuals so clicking to edit does not visually transform the card
- keeping `Notepad` as a larger editor view of the same note
- preserving `Pin to Dashboard` from `Notepad` as another way to show a note on the board
- preserving dashboard-owned lane and placement state separately from note content

This phase does not cover:
- a second dashboard-only sticky-note data model
- copy-based sync between dashboard notes and notepad notes
- rich-text editing
- note resizing or style presets
- more lanes
- tags, priorities, due dates, or checklist systems
- extra widget families
- console `Workspace Modes` adoption for `Dashboard` or `Notepad`
- popup-local `PopupWorkspaceShell` switching into `Dashboard` or `Notepad`

## Doc Body

### Summary

`Dashboard-5` should be the next product-shape phase after shipped `Dashboard-4.1`.

Current baseline:
- `Notepad` already owns the shared note model
- `Dashboard` already renders pinned notes as sticky notes
- sticky notes already support lane placement, drag, unpin, and open-in-notepad

The next honest slice is:
- let `Dashboard` create new notes directly
- let sticky notes edit title and body directly on the board
- keep `Notepad` as the bigger text-editor surface for the same note

Important product truth:
- every sticky note is still one note
- not every note has to be shown on the dashboard

Implementation-ready first-pass rule:
- keep the first pass on one add action plus one inline-edit path
- do not widen this phase into note resizing, color presets, richer keyboard commands, or notepad-layout redesign

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/notepad/useNotepadStore.ts`
  - already owns note creation, rename, body edits, active-note state, and pin state
  - should remain the canonical owner of note `title` and `body`
  - is the right place for dashboard-created sticky notes to still become normal notes immediately
  - important live constraint: `createNote(...)` currently also makes the new note the global `activeNoteId`, so the first cut should either intentionally keep that behavior or explicitly wrap it instead of leaving the side effect vague
- `src/app/workspace/DashboardSurface.tsx`
  - already owns board rendering, sticky-note drag interaction, and lane grouping
  - should gain the dashboard-local `Add Sticky Note` affordance and the top-level handoff into card editing
  - should likely get thinner, not wider, during this phase
- `src/app/dashboard/useDashboardStore.ts`
  - already owns lane and placement only
  - should stay focused on board metadata, not note text or inline drafts
- `src/app/AppShell.test.tsx`
  - already covers dashboard sticky-note rendering, dragging, persistence, open-in-notepad, and hydration
  - is the right place for end-to-end board-create and inline-edit coverage
- `src/app/notepad/useNotepadStore.test.ts`
  - may need focused coverage if dashboard-created notes widen the expected create flow semantics
- `src/app/theme/foundation/base.css`
  - already styles the sticky-note board and cards
  - should absorb the seamless preview-versus-edit styling so edit mode looks visually identical to read mode

Strong likely extraction:
- `src/app/workspace/DashboardStickyNoteCard.tsx` or a nearby dashboard card component
  - should own per-card inline title/body edit UI, local draft state, and focus rules
  - keeps `DashboardSurface.tsx` from turning into one giant drag-plus-edit file

### Locked Direction

`Dashboard-5` should:
- keep one shared note model
- keep note content in the notepad store
- let `Dashboard` create a new note directly and pin it immediately
- let sticky notes edit the same note inline on the board
- keep `Notepad` as the larger plain-text editor for that same note

`Dashboard-5` should not:
- create a second dashboard-only note database
- fork sticky notes into copy-based note clones
- treat `Notepad` as mandatory for every small note edit
- push note-content ownership into the dashboard widget store

Implementation-ready first-cut decision:
- keep the existing shared note model and existing `useNotepadStore.ts` actions
- do not introduce a new note service layer unless the live implementation proves one is truly needed

### Locked Ownership Split

The ownership split should stay:

- `useNotepadStore.ts`
  - owns note identity
  - owns note title
  - owns note body
  - owns created/updated timestamps
  - owns pin state
- `useDashboardStore.ts`
  - owns lane assignment
  - owns x/y placement
  - owns later board-only visual metadata

Healthy rule:
- `Notepad` answers what the note says
- `Dashboard` answers where the note appears on the board

### Locked Product Shape

The board should support two equally valid entry points into the same note system:

1. `Dashboard`
   - click `Add Sticky Note`
   - a new note is created immediately
   - it appears on the board pinned into `TO DO`
   - the user can edit title and body directly on the sticky note
2. `Notepad`
   - create or edit a note in the larger text editor
   - optionally `Pin to Dashboard`
   - that same note now appears on the board as a sticky note

Important product rule:
- sticky notes can be viewed and edited in `Notepad`, but do not have to be
- notepad notes can be shown on `Dashboard`, but do not have to be

Locked first-create truth:
- `Add Sticky Note` should live in the dashboard hero area as the obvious board entry point
- it should call the existing note-creation seam with `{ title: '', body: '', isPinned: true }`
- it should intentionally keep the current `activeNoteId` side effect from `createNote(...)` in the first pass so the newly created note is the same one that would open in `Notepad`
- the existing dashboard reconcile/layout path should then seed that new pinned note into the `TO DO` lane without a second custom creation path

### Locked Editing UX

The inline editing UX should feel calm and nearly invisible:

- clicking the sticky-note title area should enter title edit mode in place
- clicking the sticky-note body area should enter body edit mode in place
- the edit surface should look visually the same as preview state except for caret and text selection
- textarea/input chrome should not suddenly make the card look like a form

Strong visual rule:
- same font
- same text size
- same line height
- same padding
- same background
- same color
- no default textarea border or resize handle

Locked first-save rule:
- use local draft state inside the sticky-note card while editing
- commit title/body changes on `blur`
- allow `Escape` to cancel the current local draft and leave the persisted note unchanged
- keep richer debounce/autosave behavior out of the first cut unless the simple blur-commit path proves insufficient

### Locked Drag Rule

Because title and body both become clickable editing surfaces, drag should no longer start from the entire text header band.

Recommended direction:
- add one small dedicated drag handle region on the sticky note
- keep title and body safe for click, selection, focus, and typing

Important reason:
- editing and dragging should never fight each other
- the user should not accidentally drag when they meant to place a caret

Locked first-handle rule:
- the existing whole-header drag start should be retired in this phase
- the first cut should move drag to one explicit small handle or grip region inside the sticky-note chrome

### Exact First Code Cut

The implementation-ready first cut is:

1. Extract or introduce one sticky-note card component so inline edit logic does not bloat `DashboardSurface.tsx`.
2. Add one hero-level `Add Sticky Note` action in `DashboardSurface.tsx`.
3. Wire that action to `useNotepadStore.ts` `createNote({ title: '', body: '', isPinned: true })` and let the existing dashboard layout reconcile path place the new note into `TO DO`.
4. Add inline title editing with a visually seamless input surface.
5. Add inline body editing with a visually seamless textarea surface.
6. Save edits back into the existing notepad store through `renameNote(...)` and `updateNoteBody(...)` on blur, with local draft cancellation on `Escape`.
7. Move drag start onto a dedicated handle so text editing is safe.
8. Keep `Open in Notepad` and `Unpin` working.
9. Preserve the existing open-in-notepad path so the same newly created or inline-edited note still opens into the larger text editor view.
10. Add focused regression coverage for:
   - dashboard-created sticky notes
   - inline title edit
   - inline body edit
   - unchanged note identity when opened in `Notepad`
   - drag still working after the handle change

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/notepad/useNotepadStore.ts`
- `src/app/notepad/useNotepadStore.test.ts`
- `src/app/AppShell.test.tsx`
- `src/app/theme/foundation/base.css`

Strong likely non-file:
- `src/app/dashboard/useDashboardStore.ts` probably should not need meaningful note-content changes in this phase beyond using the existing placement reconciliation path

### Main Risks

The main risks in this phase are:

- mixing dashboard layout ownership with note-content ownership
- making inline edit mode look visually different enough that the card feels jumpy
- keeping drag bound to the same region the user now needs for text editing
- letting `DashboardSurface.tsx` absorb too much card-specific complexity

Healthy rule:
- one shared note model
- one larger notepad editor
- one inline sticky-note editing view
- one separate dashboard layout store

Execution safety rule:
- if the phase starts forcing new draft persistence or broader notepad-store API redesign, stop and split that into a later follow-on instead of silently widening `Dashboard-5`

## [ ] Phase Checklist

- [ ] Add an `Add Sticky Note` action directly in `Dashboard`
- [ ] Create a new note from `Dashboard` by using the existing shared note model and pinning it immediately through the current notepad store seam
- [ ] Allow inline sticky-note title editing directly on the card
- [ ] Allow inline sticky-note body editing directly on the card
- [ ] Keep inline edit visuals nearly identical to preview visuals
- [ ] Move sticky-note drag onto a dedicated explicit handle or equivalent non-text interaction zone
- [ ] Keep `Open in Notepad` working for larger editing
- [ ] Keep the first create flow on the current `activeNoteId` semantics instead of widening into a separate dashboard-only active-note model
- [ ] Keep `Pin to Dashboard` and `Unpin` as optional board visibility, not separate note ownership
- [ ] Keep lane/placement ownership in the dashboard store and note-content ownership in the notepad store
- [ ] Keep copy-based note forks, rich text, resizing, style presets, extra widgets, console workspace-modes adoption, and popup-local switching deferred

## [ ] Verification Shape

Minimum verification for this phase should cover:

- creating a sticky note directly from `Dashboard`
- confirming the new note appears pinned in `TO DO`
- confirming the new dashboard-created note becomes the current shared note identity that `Open in Notepad` lands on
- editing the sticky-note title inline and confirming the same note updates in `Notepad`
- editing the sticky-note body inline and confirming the same note updates in `Notepad`
- confirming `Escape` cancels an inline edit without persisting draft text
- confirming the sticky note still opens into `Notepad`
- confirming drag still works from the dedicated handle without interfering with text editing
- confirming unpin still removes the sticky note from the board without deleting the note

Recommended verification commands for the future implementation pass:
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts src/app/AppShell.test.tsx -t dashboard`
- `npx.cmd tsc -p tsconfig.json --noEmit`
- `npm.cmd run build`

## [ ] Done Shape

`Dashboard-5` is done when:

- users can create sticky notes directly from `Dashboard`
- sticky note title and body can be edited inline on the board
- inline edit state looks nearly identical to preview state
- the same note can still be opened in `Notepad`
- `Notepad` still feels like the larger plain-text text editor instead of a sticky-note-only surface
- dashboard layout state and note-content state still stay cleanly separated

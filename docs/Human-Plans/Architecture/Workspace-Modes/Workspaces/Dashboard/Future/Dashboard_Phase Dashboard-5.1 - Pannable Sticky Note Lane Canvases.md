# Dashboard Phase Dashboard-5.1 - Pannable Sticky Note Lane Canvases

## Doc Header

### Doc History
1. 2026-04-04 07:11: Added this dedicated `Dashboard-5.1` future phase doc as the next dashboard-family implementation slice after shipped `Dashboard-5`, locking the follow-on to middle-mouse lane-canvas panning inside `TO DO` and `Completed` while keeping sticky-note note ownership, lane ownership, and note placement persistence unchanged

### Purpose

Use this phase to make the `TO DO` and `Completed` board lanes feel like real sticky-note canvases instead of only bounded drop areas.

The goal is not to redesign sticky-note layout ownership.
The goal is to let users pan around larger sticky-note lane canvases by middle-mouse dragging the board surface while keeping note dragging, inline editing, color menus, and `Notepad` handoff behavior intact.

### Scope

This phase covers:
- making each sticky-note lane board behave like a pannable canvas viewport
- allowing middle-mouse drag panning inside `TO DO`
- allowing middle-mouse drag panning inside `Completed`
- preserving existing left-click sticky-note drag behavior
- preserving inline sticky-note title and body editing behavior
- preserving title-bar right-click color-menu behavior
- preserving dashboard-owned note placement and lane persistence exactly as they already work
- keeping the first cut non-persistent so lane scroll or camera position resets normally after remount or reload

This phase does not cover:
- changing sticky-note `x/y` ownership
- changing sticky-note lane ownership
- persistent board-camera state
- zooming
- minimaps
- infinite canvas virtualization
- extra lanes
- note resizing
- richer gesture support
- trackpad-specific custom gesture layers beyond the native scroll behavior already provided by the browser

## Doc Body

### Summary

`Dashboard-5.1` should be the next product-shape follow-on after shipped `Dashboard-5`.

Current baseline:
- sticky notes already support dashboard creation, inline edit, color presets, title-bar drag, lane placement, and open-in-notepad handoff
- `TO DO` and `Completed` already act as per-lane note boards with absolute sticky-note placement inside each lane board
- each lane board is already an overflow container, which means panning can ride native scroll position instead of forcing a new note-coordinate model

The next honest slice is:
- let the user middle-mouse drag to pan the visible area of each lane board
- keep sticky-note note positions exactly where they already live in lane-local coordinates
- treat panning as a view concern, not a note-model concern

Implementation-ready first-pass rule:
- keep this pass on one panning interaction only
- do not widen into zoom, persistent camera state, or generalized whiteboard navigation

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/workspace/DashboardSurface.tsx`
  - already owns lane-board refs, sticky-note drag preview state, lane hit testing, and the top-level sticky-note board rendering
  - is the right place for per-lane pan-session state or for handing lane-board refs into one very small helper component
  - should remain the owner of the interaction split between note drag and lane-board viewport movement
- `src/app/workspace/DashboardStickyNoteCard.tsx`
  - already owns sticky-note title-bar drag, inline edit mode, and title-bar context-menu behavior
  - should stay focused on the card itself, not lane viewport panning
  - is important because lane-board middle-mouse panning must not interfere with title-bar drag or text editing
- `src/app/theme/foundation/base.css`
  - already styles lane boards as scrollable containers
  - should absorb cursor and active-pan-state styling for the lane canvases
- `src/app/AppShell.test.tsx`
  - already covers dashboard note drag, board interaction, and sticky-note editing paths
  - is the right place for end-to-end lane-pan regressions that prove scroll position changes without moving note placement

Strong implementation truth:
- the lane board already uses DOM overflow rather than a transformed camera layer
- that means middle-mouse panning can likely work by updating `scrollLeft` and `scrollTop` on the lane-board element instead of introducing a second coordinate system

### Locked Direction

`Dashboard-5.1` should:
- keep sticky-note `x/y` as lane-local note coordinates
- keep panning as temporary viewport state on the lane board
- use middle mouse button as the explicit panning gesture
- allow native wheel or trackpad scrolling to continue working normally
- prevent browser middle-click autoscroll when custom lane panning is active

`Dashboard-5.1` should not:
- persist board camera state
- rewrite note placement into camera-relative coordinates
- move note ownership into a new canvas subsystem
- make left click on empty board start panning

Implementation-ready first-cut decision:
- implement panning by directly mutating lane-board scroll position during a middle-mouse drag session
- keep the first version lane-local and DOM-native instead of introducing a global dashboard camera abstraction

### Locked Interaction Rules

The lane interaction split should be:

1. Left mouse button
   - sticky-note title bar drag still moves the note
   - inline text click still edits title or body
   - empty board click still does nothing special
2. Right mouse button
   - sticky-note title bar still opens the sticky-note color menu
   - lane board itself does not gain a new right-click menu in this phase
3. Middle mouse button
   - middle mouse down on a lane board starts lane panning
   - pointer movement scrolls that lane board viewport
   - middle mouse up or cancel ends panning

Important rule:
- middle-mouse panning should work whether the pointer starts on empty lane space or over non-interactive board background
- it should not be started from inside editable text fields or sticky-note action buttons

### Locked UX Direction

The lane board should feel like a pannable canvas viewport:

- idle lane board cursor can stay normal
- middle-mouse panning should switch the lane board into an active `grabbing`-style state
- the pan session should stop cleanly on:
  - `pointerup`
  - `pointercancel`
  - window blur-equivalent pointer cancellation path if the drag session ends abruptly

Healthy first-pass simplicity rule:
- do not add decorative grab handles
- do not add minimap or viewport indicators
- do not add momentum

### Exact First Code Cut

The implementation-ready first cut is:

1. Add one lane-pan session state in `DashboardSurface.tsx` keyed to the active lane board and middle-mouse pointer id.
2. Start that session from `onPointerDown` on the lane board only when `event.button === 1`.
3. Store the lane board’s initial `scrollLeft`, `scrollTop`, and the pointer origin at pan start.
4. During window-level pointer move, update that lane board’s `scrollLeft` and `scrollTop` based on inverse pointer delta so dragging feels like grabbing the canvas.
5. End the session on `pointerup` or `pointercancel`.
6. Call `preventDefault()` on middle-mouse pan start so browser autoscroll does not take over.
7. Add a lane-board active-pan class so CSS can show the panning state cleanly.
8. Keep sticky-note drag, inline edit, and title-bar context-menu behavior unchanged.
9. Add focused regression coverage proving:
   - middle-mouse dragging the lane board changes its scroll position
   - note placement store data does not change during lane panning
   - sticky-note left-drag still works after the lane-pan addition

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/foundation/base.css`

Strong likely non-file:
- `src/app/dashboard/useDashboardStore.ts` should not need changes because lane panning should not persist or affect note coordinates

### Main Risks

The main risks in this phase are:

- accidentally mixing lane-board pan state with sticky-note placement state
- letting middle-mouse panning steal or break sticky-note drag behavior
- triggering browser autoscroll instead of the custom canvas-pan interaction
- starting pan from interactive sticky-note children in ways that feel surprising

Healthy rule:
- one shared note model
- one dashboard-owned placement model
- one lane-board viewport pan layer that stays ephemeral

Execution safety rule:
- if the implementation starts requiring persistent camera state, lane virtualization, or a generalized canvas abstraction, stop and split that into a later follow-on instead of silently widening `Dashboard-5.1`

## [ ] Phase Checklist

- [ ] Let the user middle-mouse drag-pan the `TO DO` lane board
- [ ] Let the user middle-mouse drag-pan the `Completed` lane board
- [ ] Keep lane-board panning ephemeral instead of persisted
- [ ] Keep sticky-note placement and lane ownership unchanged
- [ ] Keep sticky-note left-button title-bar drag working
- [ ] Keep inline sticky-note title and body editing working
- [ ] Keep sticky-note title-bar right-click color menu working
- [ ] Prevent browser middle-click autoscroll from replacing the custom lane-pan behavior
- [ ] Add focused regression coverage for lane panning and no note-placement mutation

## [ ] Verification Shape

Minimum verification for this phase should cover:

- middle-mouse dragging inside a lane changes that lane board’s scroll position
- middle-mouse dragging does not mutate sticky-note placement in the dashboard store
- sticky-note left-drag still moves notes after lane panning lands
- inline sticky-note editing still works
- title-bar right-click color menu still opens and applies color correctly

Recommended verification commands for the future implementation pass:
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts src/app/AppShell.test.tsx -t dashboard`
- `npx.cmd tsc -p tsconfig.json --noEmit`
- `npm.cmd run build`

## [ ] Done Shape

`Dashboard-5.1` is done when:

- `TO DO` and `Completed` both feel like pannable sticky-note canvases
- the user can middle-mouse drag the board viewport without moving note coordinates
- sticky-note note drag, inline edit, and color-menu behavior all still work
- the feature stays lightweight and does not introduce persistent board-camera complexity

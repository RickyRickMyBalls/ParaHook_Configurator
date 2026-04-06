# Dashboard Phase Dashboard-7.10 - Sticky Attachment Bounds And Resizable Notes

## Doc Header

### Doc History
1. 2026-04-04 14:29: Closed `Phase 10.5 - Sticky Note Focus Lift` after shipping one temporary double-click lifted-note override on top of the attachment-aware stack order so overlapping sticky notes can be brought to the front and toggled back cleanly, then staged the later direct-drag detach work next in `Phase 11`
1. 2026-04-04 14:25: Tightened `Phase 10.5 - Sticky Note Focus Lift` into an implementation-ready dashboard slice by grounding it in the shipped attachment-aware stack ordering inside `DashboardSurface.tsx`, the sticky-note shell interactions in `DashboardStickyNoteCard.tsx`, and the focused dashboard regression seam in `AppShell.test.tsx`, then locking the first cut to one temporary double-click front-lift override that can toggle back to the normal attachment-derived stack order
1. 2026-04-04 13:33: Closed `Phase 10.4 - Attachment Stack Layering Polish` after shipping attachment-aware sticky-note render ordering so children now stay visually above parents at rest and during parent-subtree drag, then staged `Phase 10.5` next for the later temporary focus-lift override
1. 2026-04-04 13:25: Reworked the post-resize follow-on inside `Dashboard-7.10` by splitting the old broad `Phase 10.4` placeholder into one implementation-ready `Phase 10.4 - Attachment Stack Layering Polish` pass plus a new later `Phase 10.5 - Sticky Note Focus Lift` pass, then locked `Phase 10.4` around default child-above-parent stack order during attachment-tree rendering and drag while keeping double-click front-lift behavior staged separately
1. 2026-04-04 13:17: Closed `Phase 10.3 - Resizable Sticky Notes Foundation` after landing dashboard-owned persisted sticky-note width and height plus explicit edge and corner resize handles through the dashboard store, persistence seam, surface geometry, sticky-note card chrome, and focused dashboard regressions, then staged `Phase 10.4` next for the later mixed-size attachment and subtree polish pass
1. 2026-04-04 13:05: Tightened `Phase 10.3 - Resizable Sticky Notes Foundation` into an implementation-ready dashboard slice by grounding it in the newly centralized sticky-note geometry seam in `DashboardSurface.tsx`, the still-fixed card props in `DashboardStickyNoteCard.tsx`, and the dashboard-owned store plus persistence model that still lacks note-specific size, then locking the first cut to persisted per-note width and height plus draggable edge and corner resize handles without widening yet into mixed-size attachment polish
1. 2026-04-04 13:01: Closed `Phase 10.2 - Attachment Bounds Refactor For Variable Note Size` after centralizing the live sticky-note dimensions and bounds math in `DashboardSurface.tsx` so attachment, subtree movement, fit, selection, and default board placement now route through one internal geometry seam while keeping the current fixed card behavior unchanged, then staged `Phase 10.3` next for the later user-facing resize foundation
1. 2026-04-04 12:55: Tightened `Phase 10.2 - Attachment Bounds Refactor For Variable Note Size` into an implementation-ready internal dashboard slice by grounding it in the live fixed-size bounds helpers, selection math, fit-to-bounds logic, and subtree drag preview inside `DashboardSurface.tsx`, then locking the first cut to one centralized sticky-note bounds seam that keeps current runtime behavior unchanged while preparing later per-note width and height support for the resize phases
1. 2026-04-04 12:48: Closed `Phase 10.1 - Parent Full-Body Attachment Hit Area` after widening drop-time attachment so the dragged sticky-note title bar can now attach against full parent-note bounds in `DashboardSurface.tsx`, adding the focused AppShell regression for parent-body overlap without parent-title-bar overlap, and staging `Phase 10.2` next for the later variable-bounds refactor
1. 2026-04-04 12:40: Tightened `Phase 10.1 - Parent Full-Body Attachment Hit Area` into an implementation-ready dashboard slice by grounding it in the live drop-time attachment helper inside `DashboardSurface.tsx`, the current fixed sticky-note bounds assumptions, and the focused AppShell attachment regressions, then locking the first cut to title-bar intent for the dragged note plus full-body hit testing for parent candidates only without widening yet into variable note size or resize handles
1. 2026-04-04 12:30: Added this dedicated `Dashboard-7.10` future phase doc to pull the post-`Dashboard-7 / Phase 10` sticky-note attachment-hit and resizing follow-on out of the broader board-tools backlog, locking the next ladder into explicit `Phase 10.1` through `Phase 10.4` slices for full-body parent hit area, variable-bounds refactor, resizable sticky-note foundation, and resize-plus-attachment polish before the later direct-drag detach phase

### Purpose

Use this doc as the dedicated planning surface for the next sticky-note attachment and sizing follow-on after shipped `Dashboard-7 / Phase 10 - Move Attached Note Subtrees`.

The goal here is:
- first widen attachment hit testing so dropping onto any part of a parent note can attach
- then refactor the bounds contract so future note-specific sizes fit honestly
- then add resizable sticky notes through edge and corner drag
- then polish attachment-tree stack layering once resize exists
- then add one optional double-click front-lift override for note editing

### Scope

This phase family covers:
- widening parent attachment hit testing from title-bar-only to full parent note bounds
- refactoring attachment and movement math away from hardcoded fixed sticky-note dimensions
- adding persistent sticky-note width and height in the dashboard-owned board model
- making all sticky-note edges and corners draggable to resize
- validating attachment-tree layering and subtree rendering behavior after resize lands
- adding one temporary front-lift override for editing without changing the underlying attachment-tree ownership

This phase family does not cover:
- direct-drag child detach
- connector lines or stack visuals
- generalized widget resizing
- lane resizing, lane collapse, or lane templates
- changing note content ownership away from the shared notepad model

## Doc Body

### Summary

`Dashboard-7.10` is the dedicated follow-on for sticky-note attachment-hit expansion and later sticky-note resizing.

Current baseline:
- `Phase 8` locked the dashboard-owned attachment-tree contract
- `Phase 9` shipped drop-time attachment creation
- `Phase 10` shipped parent-led subtree movement
- `Phase 10.1` has now widened same-lane drop-time attachment so the dragged note title bar can attach against any visible part of the parent sticky-note body
- `Phase 10.2` has now centralized sticky-note geometry behind one internal dimensions-and-bounds seam while keeping current fixed-size runtime behavior unchanged
- `Phase 10.3` has now landed dashboard-owned persisted note size plus explicit edge and corner resize handles
- direct child detach still remains staged later in `Phase 11`

Locked recommendation:
- do not implement sticky-note resizing first
- first widen the attachment hit area
- then refactor the bounds contract for variable note size
- only then land user-facing resize handles and persistence

Why this order is healthier:
- attachment semantics stay easier to validate before resize handles widen the drag system
- the variable-bounds refactor can land without also shipping new user-facing resize affordances
- once resizing exists, mixed-size attachment and subtree bugs become harder to reason about unless the bounds seam is already honest

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/workspace/DashboardSurface.tsx`
  - already owns sticky-note drag preview, drop-time attachment resolution, and subtree movement
  - is the right place for attachment hit testing, note-bounds helpers, and future resize gesture routing
- `src/app/dashboard/useDashboardStore.ts`
  - already owns durable sticky-note placement plus `parentNoteId`
  - is the right place for future sticky-note width and height persistence
- `src/app/dashboard/dashboardTypes.ts`
  - will be the right place to widen sticky-note board layouts with future size fields
- `src/app/dashboard/dashboardPersistence.ts`
  - will be the right place to normalize and migrate future size-bearing sticky-note layouts
- `src/app/AppShell.test.tsx`
  - already covers drop-time attachment, subtree movement, cross-lane drag, and sticky-note menu behavior
  - is the correct focused regression seam for the 10.1 through 10.4 ladder

### Phase Breakdown

1. `Phase 10.1 - Parent Full-Body Attachment Hit Area`
Reason:
- attachment should first widen from parent-title-bar-only hit testing to full parent-note bounds before note resizing enters the model

2. `Phase 10.2 - Attachment Bounds Refactor For Variable Note Size`
Reason:
- the attachment math should stop assuming one fixed sticky-note size before resizing lands, so later size changes plug into one honest bounds seam instead of rewriting drag and attach logic twice

3. `Phase 10.3 - Resizable Sticky Notes Foundation`
Reason:
- edge and corner resizing is a larger interaction system that deserves its own focused pass after the attachment-hit model and bounds contract are stable

4. `Phase 10.4 - Resize Polish And Attachment Compatibility`
Reason:
- once sticky notes can resize, the first important polish pass is the default attachment-tree stack order so children stay visually above parents even when the parent is dragged or resized

5. `Phase 10.5 - Sticky Note Focus Lift`
Reason:
- the later double-click bring-to-front behavior is a user-intent override and should stay separate from the default attachment-tree stack-order rules

## [x] Phase 10.1 - Parent Full-Body Attachment Hit Area

### Summary

#### Purpose:
- widen attachment creation so the dragged note can attach when its title bar overlaps any part of the parent sticky note, not only the parent title bar

#### Current read:
- `DashboardSurface.tsx` currently resolves the dragged note by title-bar bounds and still compares candidate parents by title-bar bounds too
- this is why attachment only lands when the user drops title-bar-on-title-bar instead of dropping anywhere onto the parent note body
- the next clean widening is to keep the dragged note side on title-bar intent while broadening only the parent candidate hit area
- the current strongest-overlap winner logic and lane-local directly-dragged-note-only contract are already good enough for this slice, so the clean runtime seam is still the existing `resolveDropAttachmentParentNoteId(...)` helper rather than a wider drag rewrite
- the focused regression seam in `AppShell.test.tsx` already covers title-bar overlap attach plus strongest-overlap winner selection, so `Phase 10.1` should extend those tests with one body-overlap attach case instead of inventing a second harness

#### Locked direction:
- keep the dragged note side on title-bar intent
- widen the parent candidate hit area to the parent note's full bounds
- keep strongest-overlap winner selection deterministic
- keep the first cut lane-local and scoped to the directly dragged note
- do not widen this slice into note resizing yet
- keep the current fixed sticky-note width and height constants in place for now; variable-size note bounds stay staged for `Phase 10.2`

### Questions / Decisions

#### [x] Question 1 - Should this phase widen the dragged note hit area too, or only the parent candidate hit area?

##### Locked answer
- only the parent candidate hit area

##### Why
- dragging from the title bar is already the clean move-and-attach intent contract
- widening the dragged side too would blur intent and make the later resize-handle phase harder to separate from ordinary body interaction

#### [x] Question 2 - Should parent selection still use strongest overlap area once parent bodies become the hit target?

##### Locked answer
- yes

##### Why
- the deterministic strongest-overlap rule already shipped in `Phase 9`
- keeping that winner rule stable prevents this slice from changing more than one decision at once

#### [x] Question 3 - Should this phase widen attachment to use the full dragged note body against the full parent body?

##### Locked answer
- no

##### Why
- the current ask is specifically about making it easier to drop onto the parent note anywhere
- leaving the dragged side as title-bar-only preserves the existing title-bar-intent interaction language while still solving the parent-size usability gap

#### [x] Question 4 - Should this phase introduce persisted per-note size ahead of the later resize ladder?

##### Locked answer
- no

##### Why
- `Phase 10.2` and `Phase 10.3` already exist to stage the bounds refactor and later resize foundation separately
- mixing model widening into this slice would make the attachment-hit cleanup harder to validate cleanly

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- add one full-note bounds helper for current fixed sticky-note dimensions
- keep the dragged note side on the existing title-bar bounds helper
- update `resolveDropAttachmentParentNoteId(...)` so candidate parents compare against full note bounds instead of parent title-bar bounds
- keep the same directly-dragged-note-only, lane-local, strongest-overlap winner contract
- keep the current no-overlap detach behavior unchanged

Suggested first-cut execution:
1. Reuse the current fixed sticky-note width and height constants to add one full-note bounds helper beside the existing title-bar bounds helper in `DashboardSurface.tsx`.
2. Keep `resolveDropAttachmentParentNoteId(...)` anchored on the dragged note's title-bar bounds.
3. Change only the parent candidate comparison from `resolveStickyNoteTitleBarBounds(candidateLayout)` to the new full-note bounds helper.
4. Add one focused AppShell regression where the dragged note title bar overlaps the parent body without overlapping the parent title bar and confirm attachment still lands.
5. Keep the existing strongest-overlap regression green so the widened parent body hit area still resolves deterministically.

Explicit exclusions:
- do not introduce per-note width or height persistence yet
- do not add resize handles or edge drag behavior yet
- do not widen the dragged note intent area beyond the title bar
- do not change subtree movement or direct-drag detach behavior in this slice

Checklist:
- [x] Lock the runtime seam to `resolveDropAttachmentParentNoteId(...)` in `DashboardSurface.tsx`
- [x] Lock parent candidate hit testing to full note bounds only
- [x] Keep the dragged note side on title-bar intent only
- [x] Keep strongest-overlap winner selection deterministic
- [x] Keep note resizing and variable bounds staged for `Phase 10.2` and `Phase 10.3`

#### Verification targets:
- dropping a note so its title bar overlaps any visible part of a same-lane parent note attaches
- strongest-overlap winner selection still behaves deterministically when multiple parent bodies overlap
- no-overlap drops still keep the directly dragged note detached
- existing subtree movement and direct-drag child behavior stay unchanged after the widened parent hit area lands

#### Current locked output:
- `Phase 10.1` has now shipped as the parent attachment-hit cleanup slice after shipped subtree movement
- the landed first cut keeps dragged-note title-bar intent while widening parent hit testing to full note bounds only
- strongest-overlap winner selection, same-lane scope, directly-dragged-note-only attachment, and detached no-overlap drops all remain intact from the earlier phases

## [x] Phase 10.2 - Attachment Bounds Refactor For Variable Note Size

### Summary

#### Purpose:
- refactor attachment and movement bounds so the dashboard can support future note-specific width and height without hardcoded fixed-card assumptions

#### Current read:
- `DashboardSurface.tsx` now has more than one place that still assumes shared fixed sticky-note dimensions, including title-bar bounds, full-note bounds, movement clamping, fit-to-notes bounds, selection coverage, and default board placement spacing
- `Phase 10.1` widened parent candidate hit testing by adding one full-note bounds helper, which was the right narrow runtime fix, but the broader dashboard surface still reads size from top-level constants instead of one reusable note-dimensions seam
- that is still fine for the current fixed card size, but it will become the wrong contract once `Phase 10.3` adds per-note width and height persistence plus resize handles
- the healthiest next step is therefore internal refactor only: introduce one sticky-note size and bounds seam, route the existing helper math through it, and keep user-visible behavior exactly the same before resizing lands
- the focused regression seam can stay in `AppShell.test.tsx` because the requirement for this phase is primarily behavioral non-regression while the internals change under it

#### Locked direction:
- introduce one centralized sticky-note dimensions-and-bounds helper seam
- keep current runtime behavior unchanged except for the internal contract cleanup
- keep the current fixed card dimensions as the active default in this phase
- finish this refactor before user-facing sticky-note resizing lands

### Questions / Decisions

#### [x] Question 1 - Should this phase add persisted per-note width and height already?

##### Locked answer
- no

##### Why
- this slice is specifically the internal contract cleanup that makes later size fields safe to add
- mixing persistence widening into the refactor would make it harder to prove behavior stayed unchanged

#### [x] Question 2 - Should this phase intentionally change visible drag, attach, or subtree behavior?

##### Locked answer
- no

##### Why
- this is the safety phase between shipped attachment behavior and later resize behavior
- the goal is to preserve current runtime semantics while cleaning the math underneath them

#### [x] Question 3 - Should the refactor live mainly in `DashboardSurface.tsx` first instead of widening store and persistence now?

##### Locked answer
- yes

##### Why
- the fixed-size assumptions are currently concentrated in the surface-level geometry helpers and drag math
- the model does not need size persistence yet, so widening store and persistence now would be premature

#### [x] Question 4 - Should this phase add new tests or mostly keep existing dashboard behavior regressions green?

##### Locked answer
- mostly keep existing regressions green, with small targeted additions only if one helper seam needs direct coverage

##### Why
- the contract here is “same behavior, cleaner internals”
- the best proof is that shipped attachment, subtree, selection, fit, and drag flows still pass

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- introduce one helper seam for sticky-note dimensions
- route full-note bounds, title-bar bounds, movement bounds, fit bounds, and similar surface math through that seam
- keep using the current fixed width and height values as defaults
- keep persisted layout shape unchanged in this phase
- keep current drag, attach, subtree, and selection behavior unchanged

Suggested first-cut execution:
1. Add one sticky-note dimensions helper in `DashboardSurface.tsx` that returns the current fixed width and height for a note.
2. Route `resolveStickyNoteTitleBarBounds(...)`, full-note bounds, movement bounds, selection overlap checks, and fit-to-notes bounds through that helper instead of directly reading the global width and height constants everywhere.
3. Keep default placement spacing aligned to the same current visual size so no visible layout jump appears in this refactor pass.
4. Keep drop-time parent hit testing and subtree movement behavior exactly as shipped in `Phase 10` plus `Phase 10.1`.
5. Run the focused dashboard AppShell suite and only add one small helper-targeted regression if the refactor introduces a new path that existing behavior tests do not already cover.

Explicit exclusions:
- do not add `width` or `height` to dashboard sticky-note persistence yet
- do not add resize handles, resize gestures, or note chrome changes yet
- do not widen attachment semantics beyond what shipped in `Phase 10.1`
- do not change direct-drag child detach behavior yet

Checklist:
- [x] Lock this slice as internal geometry-contract cleanup only
- [x] Lock the owner seam to `DashboardSurface.tsx`
- [x] Keep current fixed note size as the active default during the refactor
- [x] Keep persistence and runtime behavior unchanged in this phase
- [x] Stage real per-note size fields and resize gestures for `Phase 10.3`

#### Verification targets:
- existing attachment creation behavior stays unchanged
- existing subtree movement behavior stays unchanged
- existing selection, align, fit, and cross-lane drag behavior stay unchanged
- the surface geometry now routes through one honest sticky-note dimensions-and-bounds seam that can later accept variable note size without another broad rewrite

#### Current locked output:
- `Phase 10.2` has now shipped as the internal bounds-contract cleanup slice between shipped attachment behavior and later sticky-note resizing
- the landed first cut centralizes sticky-note dimensions and bounds behind one surface-level seam while current runtime behavior stays visually and behaviorally unchanged
- persisted per-note size, resize handles, and mixed-size polish remain staged for `Phase 10.3` and `Phase 10.4`

## [x] Phase 10.3 - Resizable Sticky Notes Foundation

### Summary

#### Purpose:
- let users resize sticky notes from all edges and corners and persist those dimensions in the dashboard-owned board model

#### Current read:
- `Phase 10.2` now gives the dashboard one centralized surface-level dimensions and bounds seam, which means the geometry is finally ready to consume note-specific size without another broad drag rewrite
- sticky notes still render with one fixed width and height because `DashboardSurface.tsx` still passes fixed dimensions into `DashboardStickyNoteCard.tsx`, and the dashboard-owned sticky-note layout model still persists lane, position, and optional parent but not yet width or height
- the next honest runtime widening is therefore model plus UI together: persist note-specific size in the dashboard board model, route the surface dimensions helper through those layout values, and expose explicit resize handles on all edges and corners
- resize has to stay clearly separate from title-bar drag, inline editing, overflow-menu interactions, and later direct-drag child detach behavior, so the first cut should focus on handle-owned gestures rather than body drag or implicit edge grabbing
- the focused regression seam should stay in `AppShell.test.tsx`, with the geometry owner in `DashboardSurface.tsx`, the durable shape in `dashboardTypes.ts` plus `dashboardPersistence.ts` plus `useDashboardStore.ts`, and the visible chrome in `DashboardStickyNoteCard.tsx` plus `base.css`

#### Locked direction:
- support draggable edges and corners on every sticky note
- persist per-note width and height in the dashboard model
- keep resize separate from direct-drag detach
- keep title-bar drag as the main move gesture while resize handles own edge and corner gestures
- keep attachment semantics exactly as shipped through `Phase 10.2`
- keep the first cut additive and honest before the later mixed-size compatibility polish in `Phase 10.4`

#### Locked recommendation:
- do not implement this before `Phase 10.1` and `Phase 10.2`

### Questions / Decisions

#### [x] Question 1 - Should size live in the dashboard-owned sticky-note layout model instead of the shared notepad note model?

##### Locked answer
- yes

##### Why
- size is board presentation state, not shared note content
- lane, x, y, parent, and future width plus height all belong to the same dashboard-owned layout record

#### [x] Question 2 - Should resize be owned only by explicit handles rather than any edge hover zone on the whole note shell?

##### Locked answer
- yes for the first cut

##### Why
- explicit handles reduce conflict with title-bar drag, body editing, and overflow-menu interactions
- they make the new resize affordance easier to understand and test before later polish

#### [x] Question 3 - Should all edges and corners resize in this phase, or should corners land first?

##### Locked answer
- all edges and corners in this phase

##### Why
- that is the user ask
- shipping only corners first would create another partial interaction contract we would immediately need to widen

#### [x] Question 4 - Should this phase also solve mixed-size attachment and subtree spacing polish completely?

##### Locked answer
- no

##### Why
- `Phase 10.4` already exists for the mixed-size compatibility pass
- this slice should land the durable size model and resize interaction foundation first

### Implementation Spec

Likely files:
- `src/app/dashboard/dashboardTypes.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- add optional persisted sticky-note `width` and `height` to the dashboard layout model
- default older notes forward to the current fixed size during migration and normalization
- route the surface dimensions helper through the note layout when size exists
- add explicit edge and corner resize handles to the sticky-note shell
- keep title-bar drag, inline editing, overflow menu, attachment creation, and subtree drag structurally intact

Suggested first-cut execution:
1. Widen the dashboard sticky-note layout type plus persistence normalization so notes can carry `width` and `height`, with older layouts defaulting to the current fixed size.
2. Add one store action for sticky-note resize updates so size changes commit through the same dashboard-owned layout seam as position and parent changes.
3. Route `DashboardSurface.tsx` dimensions resolution through layout width and height instead of only the fixed defaults, while retaining sane minimum and maximum clamp rules.
4. Add explicit resize handles for the four edges and four corners in `DashboardStickyNoteCard.tsx`, and wire their pointer gestures back up to the surface-owned resize math.
5. Update styling in `base.css` so the handles are visible enough to discover, but do not interfere with the title bar, body editing affordance, or overflow menu.
6. Add focused AppShell regressions covering persisted resize, edge resize, corner resize, and the core “drag still drags / menu still opens / attachment still works” sanity checks.

Explicit exclusions:
- do not widen direct-drag child detach behavior yet
- do not add connector lines, stack chrome, or attachment-preview UI yet
- do not solve all mixed-size attachment and subtree polish in this slice
- do not move size ownership into the shared notepad note model

Checklist:
- [x] Lock size ownership to the dashboard sticky-note layout model
- [x] Lock the first cut to explicit edge and corner handles
- [x] Keep title-bar drag as the primary move gesture
- [x] Keep attachment semantics and direct-drag child behavior unchanged in this phase
- [x] Stage mixed-size attachment and subtree polish for `Phase 10.4`

#### Verification targets:
- all edges and corners resize the note
- resized width and height persist
- existing move, edit, and menu affordances remain reachable
- attachment creation and subtree movement still function after resize exists
- older persisted dashboard notes without size fields still hydrate cleanly at the current default size

#### Current locked output:
- `Phase 10.3` has now shipped as the resize-foundation slice after the geometry-seam refactor
- the landed first cut adds dashboard-owned persisted note size plus explicit edge and corner resize handles while keeping title-bar drag as the main move gesture
- mixed-size attachment, subtree-spacing cleanup, and extra resize polish remain staged for `Phase 10.4`

## [x] Phase 10.4 - Attachment Stack Layering Polish

### Summary

#### Purpose:
- keep attachment-tree rendering honest by making children visually appear above parents by default, including while the parent subtree is dragged after resize exists

#### Current read:
- `Phase 10.3` now allows mixed-size sticky notes, but the visual stack order can still read wrong because a dragged parent can render on top of its attached child even though the relationship is supposed to read as child-above-parent
- this is primarily a layering and render-order problem inside the dashboard surface rather than a persistence or attachment-model problem
- the next clean pass is to derive one attachment-aware visual stack order so attached descendants render above their ancestors by default, and so that dragging a parent subtree still preserves that child-above-parent relationship instead of flattening it
- this pass should stay distinct from the later double-click `bring to front for editing` override, because default relationship layering and temporary edit focus are different rules
- the live owner seam is still `DashboardSurface.tsx`, with the sticky-note shell in `DashboardStickyNoteCard.tsx` and focused regression coverage in `AppShell.test.tsx`

#### Locked direction:
- derive one default attachment-tree stack order where children appear above parents
- preserve that ordering while a parent subtree is dragged
- keep unattached note ordering otherwise stable and unsurprising
- do not add double-click front-lift behavior yet

### Questions / Decisions

#### [x] Question 1 - Should this phase change the underlying attachment model or only visual layering?

##### Locked answer
- only visual layering

##### Why
- the `parentNoteId` model and subtree movement are already shipped
- the problem is how the relationship reads visually, not how the relationship is stored

#### [x] Question 2 - When a parent and child overlap, should the child always render above the parent by default?

##### Locked answer
- yes

##### Why
- that is the intended relationship language for attached notes
- it matches the mental model of notes being stacked onto a parent surface rather than buried beneath it

#### [x] Question 3 - Should this phase also add the user-triggered “bring note to front” override?

##### Locked answer
- no

##### Why
- that is a temporary user-intent override, not the default structural stack rule
- keeping it separate avoids ambiguous precedence between edit-focus lift and relationship layering

#### [x] Question 4 - If a whole subtree moves, should descendants still render above their dragged ancestor during the drag?

##### Locked answer
- yes

##### Why
- dragging should not visually break the attachment relationship
- the subtree should keep reading as one ordered stack while it moves

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- derive an attachment-aware render order for sticky notes within each lane
- keep children above parents by default
- keep dragged subtree rendering consistent with that ordering
- keep resize handles, title-bar drag, menu, and edit interactions unchanged
- keep any temporary focus-lift behavior staged for `Phase 10.5`

Suggested first-cut execution:
1. Add one helper in `DashboardSurface.tsx` that derives render order from the existing dashboard layouts and `parentNoteId` relationships.
2. Keep unattached notes stable relative to their existing board order while ensuring attachment descendants sort above their ancestors.
3. Make sure the drag-preview path uses the same derived ordering so a dragged parent subtree still renders with descendants above the ancestor note.
4. Keep note selection, resize, menu, and inline editing wiring unchanged while only adjusting the stacking/raster order used to render the cards.
5. Add focused AppShell regressions for child-above-parent overlap at rest and while dragging a parent subtree.

Explicit exclusions:
- do not add double-click front-lift behavior yet
- do not change attachment creation or detach rules yet
- do not add connector lines or stack chrome yet
- do not change persisted dashboard layout shape in this phase

Checklist:
- [x] Lock this slice to attachment-aware visual stack ordering only
- [x] Keep children above parents by default
- [x] Keep dragged subtree ordering consistent with the resting stack order
- [x] Keep temporary edit-focus lift staged separately for `Phase 10.5`
- [x] Keep persistence and attachment semantics unchanged in this phase

#### Verification targets:
- attached child notes render above their parent by default when they overlap
- dragging a parent subtree does not cause the parent to visually cover its child
- unattached notes still behave normally
- resize handles, overflow menu, and inline editing remain reachable after the stack-order change

#### Current locked output:
 - `Phase 10.4` has now shipped as the attachment-stack-layering polish slice after resize landed
 - the landed first cut keeps attached children visually above parents both at rest and while a parent-led subtree is dragged
 - temporary double-click front-lift behavior now remains staged separately for `Phase 10.5`

## [x] Phase 10.5 - Sticky Note Focus Lift

### Summary

#### Purpose:
- let the user temporarily bring one sticky note to the front for editing without permanently breaking the attachment-tree stack order

#### Current read:
- once `Phase 10.4` lands, the default stack rule can stay structural and honest, but the product still wants one explicit override so a user can double-click a note and edit it above overlapping notes
- that override should be temporary and reversible, not a permanent z-index mutation
- the strongest live owner seam is still `DashboardSurface.tsx`, because that file now derives the default attachment-aware render order and is therefore the right place to layer one temporary focus-lift override on top of the structural stack rule
- `DashboardStickyNoteCard.tsx` already owns the sticky-note shell and title/body edit affordances, so that card is the right place to emit one explicit double-click signal without widening ordinary single-click selection, title-bar drag, resize handles, or the overflow menu contract
- the focused regression seam should stay in `AppShell.test.tsx`, because this phase is mostly about the interaction precedence between overlapping notes, attachment layering, double-click editing intent, and restoring the same structural order when the override clears

#### Locked direction:
- double-click a note to lift it above the normal stack order
- double-click the same note again to clear that override
- when cleared, the note returns to the normal attachment-aware stack order
- lift only the directly focused note, not the whole subtree
- keep the override temporary and surface-local rather than persisting it in dashboard storage

### Questions / Decisions

#### [x] Question 1 - Should focus lift be persisted in the dashboard model?

##### Locked answer
- no

##### Why
- this is transient editing state, not durable board structure
- persisting it would blur the line between true attachment order and one temporary front-editing override

#### [x] Question 2 - Should double-clicking one note lift only that note or the whole attachment subtree?

##### Locked answer
- lift only that note

##### Why
- the user intent is to edit one note above overlaps, not to permanently or temporarily restack the whole tree
- a narrow override is easier to reason about and less likely to hide neighboring notes unexpectedly

#### [x] Question 3 - Should the override toggle off only on a second double-click of the same note, or also when focus moves away?

##### Locked answer
- first cut: clear on a second double-click of the same note and also clear when the lifted note leaves the board model

##### Why
- that matches the requested reversible interaction without widening immediately into more global blur rules
- automatic cleanup on note removal or unpin is still necessary so stale lifted ids do not linger in surface state

#### [x] Question 4 - Should this phase change the structural child-above-parent stack rule from `Phase 10.4`?

##### Locked answer
- no

##### Why
- `Phase 10.4` already locked the default visual relationship
- this phase should layer one explicit temporary override on top of that rule, not replace it

### Implementation Spec

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/workspace/DashboardStickyNoteCard.tsx`
- `src/app/AppShell.test.tsx`

Locked first-cut direction:
- add one temporary lifted-note id in the dashboard surface state
- keep the default render order attachment-aware exactly as shipped in `Phase 10.4`
- when a note is lifted, render that one note above the normal attachment-derived order
- toggle the override from sticky-note double click
- clear stale lifted-note state if the note is removed, unpinned, or otherwise disappears from the rendered board

Suggested first-cut execution:
1. Add one surface-local `liftedStickyNoteId` state in `DashboardSurface.tsx`.
2. Keep the existing attachment-aware ordering helper as the structural base order.
3. Add one final render-order pass that moves the lifted note to the end of its lane render list without mutating attachment relationships or durable placement state.
4. Add a double-click callback from `DashboardStickyNoteCard.tsx` that toggles the lifted id for that note while avoiding interference with resize handles, menu buttons, inline editors, or title-bar drag.
5. Clear the lifted id when the note is no longer present among pinned dashboard notes.
6. Add focused AppShell regressions for double-click lift, double-click clear, and returning to structural child-above-parent order after the override is removed.

Explicit exclusions:
- do not persist the focus-lift override
- do not widen this slice into direct-drag child detach
- do not add connector lines, stack chrome, or new z-index settings across unrelated widget types
- do not change the underlying attachment-tree model or resize model in this phase

Checklist:
- [x] Lock the override to one temporary lifted note instead of a durable board mutation
- [x] Keep the structural child-above-parent ordering from `Phase 10.4` as the default baseline
- [x] Lift only the directly focused note, not the whole subtree
- [x] Keep drag, resize, menu, and inline editing behavior structurally separate from the new double-click toggle
- [x] Keep persistence and attachment semantics unchanged in this phase

#### Verification targets:
- double-click brings one note to the front for editing
- double-click again clears the override
- clearing the override returns the note to the normal child-above-parent stack order
- existing drag, resize, menu, and edit affordances remain intact

#### Current locked output:
 - `Phase 10.5` has now shipped as the focus-lift slice after the attachment-aware stack-order polish
 - the landed first cut adds one temporary double-click front-editing override for a single note, with a second double click restoring the normal attachment-derived order underneath
 - direct-drag child detach remains staged later in `Phase 11`

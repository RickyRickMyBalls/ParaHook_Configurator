# Transform Phase Transform-6 - History Scrub And Traversal

## Doc Header

### Doc History
7. 2026-03-27 09:26: Marked this phase shipped after the committed reference transform history scrub layer landed in code, moved the standalone phase record into `Shipped/`, and aligned the record with the delivered paraslider traversal, future-row deactivation, viewport overlay truncation, and inserted-branch temporary-tail behavior
6. 2026-03-27 02:06: Reworked this standalone `Transform 6` phase doc into an implementation-ready scrub spec, removing the stale `preview / restore` framing, locking traversal as direct history scrub over the committed model, and spelling out the concrete store, toolbar, viewer, insertion-commit, and verification rules needed to implement the phase
5. 2026-03-27 01:58: Cleaned up the `Transform 6` question state in this standalone phase doc so the already-decided entry-first granularity and preview-versus-restore behavior read as locked direction instead of sounding partially open, leaving explicit restore-history mutation as the main remaining unresolved branch
4. 2026-03-27 01:52: Locked the `Transform 6` branched-commit behavior in this standalone phase doc, deciding that if the user commits a new transform step while scrubbed to an earlier committed entry, that new row should insert immediately after the scrubbed entry, the old future rows should remain after it and replay from that insertion point, and the child-entry numbering should renumber to the new visible order
3. 2026-03-27 01:45: Tightened the first `Transform 6` scrub default-state rule in this standalone phase doc, deciding that when the user is not actively traversing history the history paraslider should sit at `100%` on the newest committed entry, and that each new history commit should advance that idle scrub head forward automatically
2. 2026-03-27 01:41: Locked the first `Transform 6` scrub UX in this standalone phase doc, deciding that traversal should begin as a history paraslider from committed entry `0..last`, and that when the scrub head sits on an earlier entry the later committed entries should deactivate while their future preview lines stop rendering in the viewport
1. 2026-03-27 01:24: Created this standalone `Transform 6` future phase doc under the Transform family, translating the already-locked traversal meaning into a concrete follow-on spec for committed-history scrub, preview emphasis, and explicit restore behavior on top of the shipped `Transform 5` visual baseline

### Purpose

This phase lands the actual traversal layer over committed transform history.

Use it to answer:
- how the user should scrub through committed transform history after the first viewport visuals exist
- how the scrubbed history position should drive the active rendered transform
- what traversal granularity should be used first
- how toolbar and viewport emphasis should coordinate without inventing a second history model

## Doc Body

## [x] Transform 6 - History Scrub And Traversal

### Summary

`Transform 6` starts after:
- `Transform 5`
  - the first committed viewport history visual baseline

By this point:
- committed transform history already exists in one store-owned model
- the toolbar already reads that committed model
- the viewport already renders committed move / rotate / scale history overlays

What is still missing is the actual traversal layer:
- dragging through older committed entries
- making the scrubbed committed entry become the active rendered transform state
- coordinating viewport and toolbar emphasis while traversal is active
- defining how new commits behave when they start from an earlier scrub point

Phase outcome:
- transform history becomes scrub-capable instead of read-only
- traversal uses the same committed history rows the toolbar and viewport already share
- the first traversal control is a history paraslider from entry `0` through the last committed entry
- when the user is not actively traversing, that paraslider sits at `100%` on the newest committed entry
- new history commits auto-advance that idle paraslider forward to the newest committed entry
- committing a new transform step while scrubbed to an earlier entry inserts a new row at that point instead of only appending at the old tail
- old future rows remain after the inserted row, replay from that insertion point, and renumber to the new visible order
- scrubbing backward deactivates later committed rows and hides future history lines and overlays past the scrub head
- the phase stays entry-first and does not widen into a separate session-playback engine too early

### Shipped Result

The shipped `Transform 6` cut landed the intended first committed-history scrub layer:
- the active reference transform shell now owns a history scrub index instead of inventing a second playback model
- `ReferenceTransformToolbar` now exposes a `History Scrub` paraslider plus row-jump controls
- scrubbing to an earlier entry makes that landed committed state the active rendered transform state
- future rows dim out in the toolbar while future viewport history overlays beyond the scrub head stop rendering
- committing from an earlier scrub point inserts a new row immediately after that scrubbed row, replays the old future rows from there, and keeps the scrub head parked on the inserted row as the user's temporary visible tail until they scrub forward again

### Owns

- committed-history traversal state for reference transform
- entry-first scrub behavior over committed transform child rows
- direct scrub-driven rendered state over committed landed history
- viewport / toolbar emphasis rules while traversal is active
- traversal-driven clutter coordination on top of the existing `Transform 5` visuals
- insertion commit behavior when the user starts a new transform from a non-tail scrub point

### Does Not Own

- the first-pass committed-history visual baseline already handled by `Transform 5`
- a second viewer-only or toolbar-only history structure
- a separate restore action or restore button in this first pass
- widening this pass to object, folder, or assembly history traversal in the same cut
- full session-level playback timelines beyond the first entry-first traversal layer

### Locked Direction

#### 1. Traversal is the actual scrub layer

Locked rule:
- traversal is the actual scrub layer in this transform family
- it means stepping through committed transform history and letting the scrubbed committed position become the active rendered transform state
- do not fold traversal back into the earlier viewport-visual baseline phase

#### 2. Stay on the same committed history model

Locked rule:
- traversal should consume the same committed child rows the toolbar and viewport already read
- do not invent a second unsynced playback model
- merged-away rows should disappear from traversal exactly as they disappear from toolbar and viewport

#### 3. Start entry-first with a history paraslider

Locked first-pass rule:
- start traversal at committed child-entry granularity
- make the first traversal control a history paraslider from committed entry `0` through the last committed entry
- let the user scrub through `Move`, `Rotate`, and `Scale` entries directly before inventing session-level playback
- when traversal is inactive, keep the paraslider pinned at `100%` on the newest committed entry
- after each new history commit, auto-advance that idle paraslider to the newest committed entry
- keep grouped session parents as presentation over the same child-entry truth

Reason:
- the committed child row is already the honest unit shared by history storage, toolbar rendering, and viewport visuals
- session-level traversal can be layered later if it proves useful

#### 4. Scrub state is the active rendered state while traversal is in use

Locked first-pass rule:
- when the scrub head is on entry `N`, the object should render at the landed committed state produced by entries `0..N`
- there is no separate preview mode layered on top of traversal in this first pass
- there is no explicit restore button in this first pass
- returning the scrub head to the tail is how the user returns to the newest committed state

Direction:
- row focus may jump the scrub head
- the paraslider remains the canonical traversal control
- scrub itself does not append a new history row

#### 5. Traversal should coordinate emphasis across toolbar and viewport

Locked first-pass rule:
- when the scrub head is on an earlier entry, later committed entries should deactivate
- future committed history lines and overlays beyond the scrub head should stop rendering in the viewport
- the currently scrubbed committed row renders strongest in both toolbar and viewport
- if no traversal focus is active or the scrub head is at the last committed entry, the existing passive committed-history view remains unchanged

#### 6. Committing from an earlier scrub point inserts into history and replays the future

Locked first-pass rule:
- if the user scrubs back to an earlier committed entry and then commits a new transform step, insert that new committed row immediately after the scrubbed entry
- do not discard the old future rows just because a new row was inserted earlier
- keep the old future rows after the inserted row and replay them from that new insertion point onward
- renumber the child-entry labels to match the new visible order after insertion
- once traversal becomes inactive again, let the paraslider return to the far-right latest-entry position over that updated history order

### Implementation Direction

#### Store / state seam

Primary target:
- `src/app/store/useAppStore.ts`

Expected changes:
- add traversal state for the active reference transform shell
- keep traversal state scoped to the active shell rather than global app history state
- store only the minimum traversal selection state needed to derive the active scrubbed landed transform
- support insertion commit semantics when a new transform step is committed from a non-tail scrub index

Suggested state shape:
- active traversed index
- traversal-active flag
- default idle index = latest committed entry

Important rule:
- scrub state should not mutate committed history rows by itself
- moving the scrub head should not append history
- a real new commit from a scrubbed earlier entry is not a pure scrub action; it inserts a new committed row into history and reflows later rows from that insertion point

#### ViewerHost / view-model seam

Primary target:
- `src/app/components/ViewerHost.tsx`

Expected changes:
- derive the scrubbed landed transform from the same committed history rows
- push traversal emphasis into the existing transform-history overlay VM
- keep live draft, committed history overlay, and scrub-driven active state clearly separated

Needed outputs:
- scrubbed transform override for the active reference when traversal is active
- active highlighted history entry for overlay emphasis
- fallback to the normal live draft / committed current state when traversal is inactive

#### Viewer / overlay rendering

Primary targets:
- `src/viewer/Viewer.ts`
- `src/viewer/ReferenceTransformHistoryHelper.ts`

Expected changes:
- let the existing history overlay render stronger emphasis for the scrubbed row
- keep traversal emphasis additive to the already-landed `Transform 5` visuals
- hide future line segments and future rotate / scale history overlays beyond the active scrub index
- when scrub changes the rendered reference transform, keep the viewport overlays legible relative to that active scrubbed state

#### Toolbar coordination

Primary target:
- `src/app/components/ReferenceTransformToolbar.tsx`

Expected changes:
- expose entry-first traversal controls through the existing grouped history UI
- make a history paraslider the primary first-pass traversal control
- let the scrubbed child entry drive row emphasis
- after a new commit inserted from an earlier scrub point, render the renumbered child rows in the updated order

Suggested first-pass controls:
- history paraslider from committed entry `0..last`
- optional previous / next nudges if they still help keyboard or button traversal
- clicking a child row may jump the scrub head to that entry, but the slider remains primary
- when traversal is inactive, the slider remains visually parked at the far-right newest-entry position
- no dedicated restore action in this first pass
- no separate clear-preview action; returning the slider to the tail returns to the newest committed state

#### Commit algorithm

When the scrub head is at the tail:
- committing a new transform step appends normally
- the paraslider stays idle and returns to the new far-right latest entry

When the scrub head is on an earlier committed entry:
- treat the scrubbed landed state as the effective entry origin for the new transform step
- commit the new row immediately after the scrubbed entry
- keep the old future rows after that insertion point
- recompute their `before` / `after` chain from the inserted row onward
- return the paraslider to the far-right latest entry after the commit completes

### Required File Targets

Primary implementation seams:
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/ReferenceTransformHistoryHelper.ts`

Likely test seams:
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/viewer/ReferenceTransformHistoryHelper.test.ts`

### Test Plan

Required verification:

- traversal state:
  - entry-first traversal can target committed child rows directly
  - the history paraslider can scrub from committed entry `0` through the last committed entry
  - when traversal is inactive, the paraslider rests at `100%` on the newest committed entry
  - a new history commit advances that idle paraslider to the newest committed entry automatically
  - committing from scrubbed entry `2` inserts the new row at `3`, shifts the old future rows down, and renumbers the child rows accordingly
  - merged-away rows cannot be traversed
  - locked rows still traverse as normal committed entries

- scrub behavior:
  - scrubbing to an older committed row makes that landed state the active rendered transform without appending history
  - returning the scrub head to the tail returns to the newest committed state without needing a separate action
  - scrubbing does not mutate committed `delta + after` rows
  - scrubbing to an earlier entry deactivates later committed rows in the toolbar/read model
  - future move line segments and future rotate / scale history overlays past the scrub head stop rendering in the viewport

- branched commit behavior:
  - committing a new transform step while scrubbed to an earlier entry inserts a new row immediately after that scrubbed entry
  - the old future rows remain after the inserted row and replay from that updated insertion point
  - child-entry numbering updates to the new visible order after insertion

- coordination:
  - toolbar and viewport highlight the same scrubbed committed row
  - traversal emphasis layers cleanly onto the shipped `Transform 5` move / rotate / scale visuals
  - current live transform shell behavior still works when traversal is inactive

### Assumptions

- this phase stays reference-history first
- the shipped `Transform 5` visual baseline is stable enough to receive traversal emphasis instead of being redesigned again here
- committed child rows remain the shared truth and grouped session parents remain presentation over those rows
- session-level playback, animation-like scrubbing, or later multi-target traversal can be deferred until entry-first traversal proves useful

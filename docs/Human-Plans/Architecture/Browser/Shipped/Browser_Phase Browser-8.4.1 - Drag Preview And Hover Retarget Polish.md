# Browser Phase Browser-8.4.1 - Drag Preview And Hover Retarget Polish

## Doc Header

### Doc History
3. 2026-03-28 12:58: Marked `Browser-8.4.1 - Drag Preview And Hover Retarget Polish` shipped after landing stronger drag-preview feedback, a lightweight dragged-row ghost, and clearer collapsed-owner `into` targeting while preserving the shipped `8.4` legality and drop timing rules
2. 2026-03-28 12:15: Tightened this standalone `Browser-8.4.1` polish doc into a more implementation-ready spec by locking the preview-treatment direction to stronger target emphasis plus a lightweight drag ghost, making provisional parent retargeting intentionally strong and immediate, giving collapsed-owner `into` targeting a distinct stronger treatment, and keeping auto-expand-on-hover out of the first polish pass
1. 2026-03-28 12:08: Added this standalone future Browser polish doc for the post-`Browser-8.4` drag-preview cleanup, locking the next follow-on around stronger provisional target feedback, clearer hover retargeting as the mouse moves across assemblies/components, and keeping real tree mutation deferred until drop

### Purpose

This phase polishes the shipped `Browser-8.4` drag/drop behavior so the user can read the provisional landing target more confidently while dragging.

Use it to answer:
- how the Browser should preview the next candidate parent/container while the mouse moves
- how the drag surface should communicate `before` / `after` / `into` more clearly
- how much provisional movement/ghosting should appear before the actual drop
- how to improve drag readability without mutating the real Browser tree until drop

## Doc Body

## [x] Browser-8.4.1 - Drag Preview And Hover Retarget Polish

### Summary

`Browser-8.4` shipped the first real Browser drag/drop pass:
- same-parent reorder
- cross-parent reparent
- explicit `before` / `after` / `into`
- collapsed-owner direct drop

The next cleanup should make that drag feel more readable.

Shipped outcome:
- the provisional target should update clearly as the mouse moves across assemblies/components
- the user should be able to tell more quickly where the dragged owner will land
- drag feedback should feel like the row is jumping between candidate parents in real time
- the real Browser tree should still mutate only on drop

### Owns

- drag-preview polish for Browser row drag/drop
- stronger hover retarget feedback across candidate assemblies/components
- provisional visual treatment for:
  - active target owner
  - active `into` container
  - active `before` / `after` seam
- dragged-row ghost or placeholder treatment if needed

### Does Not Own

- new drop legality rules
- new draggable row kinds
- multi-select drag/drop
- Console drag/drop parity
- real tree mutation before drop
- auto-expand-on-hover unless a tiny amount is required for readability

### Locked Direction

#### 1. Keep real tree mutation on drop

Locked rule:
- do not reorder or reparent the real Browser tree while dragging
- keep the real mutation at drop time only

The polish should improve readability, not change the data model timing.

#### 2. Strengthen provisional owner targeting

Locked rule:
- as the mouse moves across valid assemblies/components, the active provisional target should retarget immediately and visibly
- the Browser should make it obvious which parent/container currently owns the provisional drop

The drag should feel like it is following the mouse across candidate parents instead of waiting for the user to infer it from a small seam indicator.

#### 3. Keep one explicit intent model

Locked rule:
- keep the same three explicit intents:
  - `before`
  - `after`
  - `into`
- the polish should make those easier to read, not replace them with a new drag grammar

#### 4. Prefer preview layers over live mutation

Locked rule:
- improve the UX with preview layers such as:
  - stronger target highlight
  - clearer `into` owner fill/outline
  - dragged-row ghost
  - placeholder line/block
- do not fake a true moved tree row if that requires mutating the underlying tree before drop

#### 5. Keep collapsed-owner drop readable

Locked rule:
- collapsed valid owners should remain directly droppable
- the polish should make collapsed-owner `into` targeting easier to read than the current first-pass styling

#### 6. Use stronger target emphasis plus a lightweight drag ghost

Locked rule:
- the first polish pass should use:
  - stronger target-only emphasis
  - a lightweight dragged-row ghost
- do not add a full in-tree placeholder in this pass

This keeps the preview readable without implying that the real Browser tree has already mutated.

#### 7. Make provisional parent retargeting strong and immediate

Locked rule:
- as the mouse crosses assemblies/components, the active provisional owner should update immediately and visibly
- subtle-only brightening is not enough for this pass

The drag should read clearly as “you are over this owner now.”

#### 8. Give collapsed-owner `into` targeting a stronger distinct treatment

Locked rule:
- collapsed-owner `into` targeting should be visually stronger than the current first-pass treatment
- keep it visually distinct from:
  - expanded-owner `into`
  - same-parent `before`
  - same-parent `after`

Collapsed owners are the hardest case to read, so they should get the clearest treatment.

#### 9. Keep auto-expand-on-hover out of the first polish pass

Locked rule:
- do not add auto-expand-on-hover in `8.4.1`
- solve readability first with stronger preview layers and provisional target feedback

If the stronger preview still feels insufficient later, auto-expand can be revisited in a separate follow-on.

### Implementation-Ready Direction

The first `8.4.1` implementation should:
- preserve the shipped `Browser-8.4` legality and drop timing rules exactly
- add a lightweight dragged-row ghost rather than a true placeholder row
- strengthen active target emphasis so candidate owners retarget clearly while the mouse moves
- make collapsed-owner `into` targeting visibly stronger than ordinary same-parent reorder seams
- keep real tree mutation deferred until drop

### Suggested Implementation Targets

Primary likely files:
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/theme/surfaces/browser.css`

Possible supporting seams:
- Browser row drag-state helpers
- Browser row-family presenter helpers if the preview treatment needs per-row variation

### Implementation Checklist

- [ ] Add a stronger provisional target highlight for active drag hover.
- [ ] Make `into` targeting visually different from `before` / `after` targeting at a glance.
- [ ] Keep the active provisional target updating as the mouse crosses assemblies/components.
- [ ] Add a lightweight dragged-row ghost for clarity.
- [ ] Do not add a full in-tree placeholder in this pass.
- [ ] Keep collapsed valid-owner targeting readable.
- [ ] Give collapsed-owner `into` targeting a stronger special treatment.
- [ ] Keep invalid-target feedback honest and visually distinct.
- [ ] Preserve the shipped `Browser-8.4` legality and drop timing rules.
- [ ] Keep auto-expand-on-hover out of this pass.

### Test Plan

Manual smoke checks:
- drag an object across two or more candidate assemblies/components and confirm the active provisional target is obvious at each step
- drag into a collapsed component and confirm the `into` target reads clearly before drop
- drag for same-parent reorder and confirm `before` / `after` remains easy to distinguish from `into`
- confirm the dragged-row ghost reads clearly without implying the tree already moved
- drag over invalid targets and confirm the invalid state is still obvious
- confirm the actual Browser tree still changes only on drop

Compatibility:
- `Browser-8.4` same-parent reorder still works
- `Browser-8.4` cross-parent reparent still works
- selection still stays on the moved owner after successful drop
- Console still re-syncs to the moved owner after successful drop

### Assumptions

- this is a polish pass on top of shipped `Browser-8.4`
- the first pass can stay Browser UI only
- drag/drop legality does not widen in this phase

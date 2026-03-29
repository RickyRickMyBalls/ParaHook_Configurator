# Transform Phase Transform-15.1 - Shared Viewer Transform Target Adapter Cleanup

## Doc Header

### Doc History
1. 2026-03-28 00:31: Created this follow-on cleanup phase after `Transform 15` to unify reference and generated-object `Viewer Transform` around one clearer shared target-adapter model and to add a focused-target section in the toolbar that can later widen into a multi-select target list
2. 2026-03-28 00:36: Tightened `Transform 15.1` into a more implementation-ready shared-shell cleanup spec by locking one explicit target-adapter/template direction, pulling object snap parity into the phase, and adding concrete toolbar/store/viewer targets plus a sharper verification matrix
3. 2026-03-28 00:42: Tightened `Transform 15.1` again into an implementation-ready adapter cleanup by locking the exact shared target-descriptor shape, the object-side snap-state widening away from `transformSnapByReferenceId`, the focused-target section contract, and the concrete store/viewer/toolbar verification surface
4. 2026-03-28 00:48: Marked `Transform 15.1` shipped after `Viewer Transform` gained the focused-target toolbar section, object-side snap parity and shared snap execution, plus the first shared target-descriptor cleanup across the toolbar, store, viewer host, and viewer runtime

### Purpose

This phase cleans up the first generated-object `Viewer Transform` pass.

Use it to answer:
- how much of `Viewer Transform` should be truly shared between references and generated objects
- what should stay different underneath only because persistence/truth is different
- how the toolbar should show which target the current `Viewer Transform` session is focused on before multi-select exists
- how object transform snap should join the same shared shell instead of staying reference-only

## Doc Body

## [x] Transform 15.1 - Shared Viewer Transform Target Adapter Cleanup

### Summary

`Transform 15.1` starts after:
- `Transform 15`
  - generated `published-object` targets can already enter `Viewer Transform` and use viewer-only move / rotate / scale

This cleanup phase makes that widening feel intentional instead of adapted:
- references and generated objects should read as the same `Viewer Transform` system
- target-specific branching should move behind a clearer target adapter boundary
- the toolbar should gain one focused-target section that shows which target the current transform session is acting on
- that focused-target section is a single target now, but should be shaped so it can later become the multi-select target list in `Transform 16`
- object transform should gain snap parity through that same shared target adapter instead of staying on a reference-only snap seam

### Owns

- cleanup of leftover reference-first branching in the shared `Viewer Transform` shell
- one clearer shared target-adapter direction for reference and generated-object transform sessions
- one shared transform template/surface direction so the toolbar and shell do not have to be written twice
- one focused-target section in the `Viewer Transform` toolbar
- object-side snap ownership and snap UI parity under that shared shell
- honest wording so object transform history reads as the same transform history system while still remaining viewer-only underneath for now

### Does Not Own

- multi-select transform entry itself
- multi-select target list behavior
- durable generated-object transform graph nodes
- Replicad or graph writeback for generated-object transform
- mixed-target multi-select commit/history truth rules

### Locked Outcome

- `Viewer Transform` should behave like one transform system for references and generated objects
- the shell, toolbar, history surface, and viewer behavior should be shared as much as possible
- target-specific differences should live at the adapter/persistence seam, not throughout the toolbar and shell logic
- snap should become a shared `Viewer Transform` capability for references and generated objects, with target-specific storage/commit rules below it
- the toolbar should show a new focused-target section for the active transform target
- in the single-target era, that section shows one focused target only
- later, `Transform 16` may widen that same area into a target list for multi-select

### Public Interfaces

- add one shared target-descriptor/helper shape for the active `Viewer Transform` target:
  - `kind: 'reference' | 'content-object'`
  - `targetId: string`
  - `label: string`
  - `history: ReferenceTransformHistoryEntry[]`
  - `snapState: ReferenceTransformSnapState`
  - `capabilities:`
    - `supportsSnap: boolean`
    - `supportsTimeline: boolean`
    - `supportsCameraLock: boolean`
  - target actions:
    - `setMode(...)`
    - `setSpace(...)`
    - `setDraft(...)`
    - `reset()`
    - `cancelEntry()`
    - `mergeHistory()`
    - `deleteHistoryEntry(entryId)`
    - `setHistoryEntryDelta(axis, value)`
    - `toggleHistoryLock(entryId)`
    - `setHistoryScrubIndex(index)`
    - `setSnapEnabled(mode, enabled)`
    - `setSnapValue(mode, value)`
    - `setSnapAxisValue(mode, axis, value)`
    - `setSnapLocked(mode, locked)`
- keep this helper internal to the app for now; no user-facing grammar change is required
- store widening required for object snap:
  - add `transformSnapByObjectId: Record<string, ReferenceTransformSnapState>`
- viewer/runtime public seams stay shared:
  - no separate object snap helper or separate object transform toolbar component

### Shared Target Adapter Direction

- stop treating generated-object transform as a special-case rider under a mostly reference-first shell
- define one shared `Viewer Transform` target model that can describe:
  - `reference`
  - `content-object`
- let the target adapter own:
  - target identity lookup
  - baseline transform read
  - draft write
  - commit destination
  - cancel/reset truth source
  - history source id
  - snap state source id
  - snap read/write handlers
  - capability flags for timeline/snap/reference-only features
- keep the rest of the shell shared:
  - mode
  - space
  - handle
  - history UI
  - snap UI
  - viewer execution
  - toolbar sections

### Shared Template Direction

- do not write a second object-specific transform toolbar/template
- keep one shared `Viewer Transform` surface and let it render from one active target descriptor
- use the target adapter to feed the shared template:
  - label
  - kind
  - history
  - snap state
  - reset/cancel/commit handlers
  - capability booleans
- if a control is unavailable for a target kind, hide or disable it from capability rules instead of branching to a separate object transform UI
- in the first pass of this cleanup, object targets should report `supportsTimeline: false` and `supportsCameraLock: false`, but `supportsSnap: true`

### Snap Parity Direction

- object-side `Viewer Transform` should gain the same snap section and runtime snap behavior the reference path already has
- do not leave snap reference-only if the long-term direction is one shared transform system
- first-pass object snap should stay viewer/session-owned just like object transform history and committed object transforms stay viewer/session-owned
- this phase should widen snap ownership from reference-only storage toward the shared target-adapter model:
  - references keep their current snap truth path
  - generated objects gain viewer/session-owned snap state for now
- concretely, this means the toolbar and shell should stop reading snap only from `transformSnapByReferenceId`
- generated-object snap state should live in store under object id and should survive:
  - shell exit
  - reselection in the current app session
- generated-object snap state does not need to survive:
  - full app refresh
  - later graph-node durability not yet owned by this phase
- snap preview visuals should follow the active target the same way transform entry already does
- no graph node or durable object snap truth is required in this cleanup

### Focused Target Section

- add a new section near the top of the `Viewer Transform` toolbar that shows what target this transform session is focused on
- first pass should show:
  - target label
  - target kind
  - a clear single-target presentation
- do not turn this into a selectable multi-target list yet
- shape the layout so it can become the future target list once `Transform 16` widens to multi-select

### History Direction

- references and generated objects should keep using the same `Viewer Transform History` surface
- object history should not look like a fallback or alternate history mode
- viewer-only truth differences should stay in commit/persistence behavior, not in whether history exists
- any wording that would falsely imply durable CAD truth for object history should still stay honest

### Implementation Direction

- introduce or extract a shared viewer-transform target descriptor/helper instead of branching ad hoc throughout the toolbar
- let that descriptor/helper act like the template adapter for the shared shell
- use that target descriptor to derive:
  - active label
  - active target kind
  - active history source
  - active snap source
  - reset/cancel handlers
  - visibility of target-specific controls
- keep snap/timeline/reference-only controls hidden behind honest capability rules instead of target-name checks sprinkled through the component
- widen snap state access so the shared snap section can read/write through the active target adapter instead of only `transformSnapByReferenceId`
- add the focused-target toolbar section using the same shared target descriptor data
- keep actual transform and snap execution viewer-owned; this cleanup is about the shared shell/adapter seam
- the focused-target section should render near the top of the toolbar and include:
  - target label
  - target kind badge/text
  - no click-to-switch behavior yet
- prefer extracting helper hooks/functions rather than renaming the whole toolbar component in this phase

### Concrete Implementation Targets

Primary cleanup targets:
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/console/referenceTransformConsole.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`

Supporting runtime targets if needed:
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

### Tests

- store:
  - `transformSnapByObjectId` defaults empty
  - object snap setters create/update object-local snap state
  - object snap state stays separate from `transformSnapByReferenceId`
- reference and generated-object sessions both render the same top-level `Viewer Transform` shell
- the new focused-target section appears for both target kinds
- the focused-target section shows the active target label and kind
- generated-object history still renders in the shared history section
- the shared snap section renders for both references and generated objects
- object snap updates through the shared target adapter instead of falling back to reference-only state
- object snap preview/runtime uses the same viewer snap execution path during active object transform entry
- reference-only controls remain hidden or disabled for object targets only where capability truly differs
- timeline controls remain unavailable for object targets in this cleanup
- camera lock remains unavailable for object targets in this cleanup
- existing reference transform behavior remains unchanged
- generated-object viewer-only behavior remains unchanged
- object snap stays viewer/session-owned and does not claim durable graph or Replicad truth

### Assumptions

- generated objects are still viewer-only in this cleanup phase
- the goal is to unify the shell and adapter model, not to change persistence truth
- the new focused-target section is the single-target precursor to the later multi-select target list
- snap parity belongs in this cleanup because snap is part of the shared transform surface, not a separate reference-only product

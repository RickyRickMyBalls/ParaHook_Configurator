# Transform Phase Transform-15.2 - Single Viewer Transform Session Model

## Doc Header

### Doc History
3. 2026-03-29 11:03: Shipped `Transform 15.2` after `Viewer Transform` gained one shared app-level target/session seam, one shared viewer session/callback facade, and shared toolbar/viewer-host action routing across references and generated objects, while keeping target-specific history/snap/override storage and the remaining Console-root compatibility as narrow adapters for later parity work
1. 2026-03-29 10:30: Created this standalone future phase after `Transform 15.1` so `Viewer Transform` can stop carrying duplicated reference-versus-generated-object session plumbing under one shared toolbar and instead converge onto one shared store/viewer/Console session model before later multi-select widening
2. 2026-03-29 10:41: Tightened `Transform 15.2` into an implementation-ready cleanup by grounding it in the live split `activeReferenceTransformSession` versus `activeContentObjectTransformSession` seam, the duplicated `ViewerHost` callback/session wiring, and the separate Console `contentObjectTransformRoot` branch, while locking the first-pass shared-session shape and the exact store/viewer/Console cleanup boundaries

### Purpose

This phase collapses the remaining duplicated transform backend under `Viewer Transform`.

Use it to answer:
- whether references and generated objects should keep separate active transform sessions
- how much of the current duplicated store/viewer/Console transform plumbing should converge now
- how to keep one feature surface so future transform features only need to be added once
- what should stay target-specific only as a narrow runtime or persistence adapter

## Doc Body

## [x] Transform 15.2 - Single Viewer Transform Session Model

### Summary

Shipped result:
- `Viewer Transform` now has one shared app-level active target/session seam for references and generated objects
- `ReferenceTransformToolbar.tsx` now reads and writes that shared session/action contract instead of owning a second object-specific action path
- `ViewerHost.tsx` now syncs one shared viewer transform session/callback facade instead of registering separate public reference/object callback families
- `viewerBridge.ts` and `src/viewer/Viewer.ts` now expose that shared viewer-session facade while keeping the older target-specific runtime methods as narrow adapters underneath
- target-specific history, snap, and transform-override storage still remain adapter-backed by target kind
- the older Console `contentObjectTransformRoot` compatibility path is intentionally left as a narrow adapter for the next parity work instead of widening this cleanup into a larger Console rewrite

`Transform 15.2` started after:
- `Transform 15`
  - generated objects can already enter `Viewer Transform`
- `Transform 15.1`
  - the toolbar already reads more like one shared `Viewer Transform` surface and object-side snap parity already exists

But one important duplication still remains:
- store still keeps separate active sessions for references versus generated objects
- viewer host still wires separate reference versus content-object transform callback/session contracts
- Console still carries a separate `contentObjectTransformRoot` branch

This shipped phase removed the most important public duplication:
- `Viewer Transform` should become one real transform session model
- references and generated objects should enter the same shared shell and session contract
- target-specific differences should stay only at the narrow runtime/persistence adapter seam

### Owns

- convergence of `activeReferenceTransformSession` and `activeContentObjectTransformSession` into one shared active `Viewer Transform` session model
- convergence of duplicated reference/object transform store actions where they currently do the same session work
- convergence of duplicated viewer-host callback/session plumbing into one shared `Viewer Transform` contract
- convergence of separate Console transform-root handling into one shared `Viewer Transform` session path
- keeping one shared toolbar feature surface so future work lands once

### Does Not Own

- multi-select transform entry
- multi-select commit/history/truth rules
- durable generated-object transform writeback into graph or Replicad truth
- reference timeline capability widening to generated objects
- deeper viewer-runtime redesign outside the transform session contract needed for this cleanup

### Locked Outcome

- `Viewer Transform` should stop being one shared toolbar over two parallel active-session systems
- references and generated objects should use one shared transform session model
- target identity should be data on that session instead of a forked session type per target kind
- new transform features should be added once against the shared `Viewer Transform` model
- remaining target-specific differences should stay as narrow adapters for:
  - persistence truth
  - target capability flags
  - runtime lookups that honestly still differ by target kind

### First-Pass Direction

The first pass should focus on deleting the duplicated session ownership, not on widening every remaining transform capability.

That means:
- collapse the active reference/object transform session split into one shared active `Viewer Transform` session
- collapse the duplicated shell/entry/mode/space/draft/handle/history-scrub session actions into one shared session-management path
- collapse `ViewerHost` onto one target-aware transform session/callback contract
- collapse Console onto one `Viewer Transform` shell path instead of keeping `contentObjectTransformRoot`
- keep target-specific persistence and capability differences adapter-backed underneath that shared session
- do not mix multi-select or durable object truth into this cleanup

### Current Gap

Today the surface is already partly shared:
- `ReferenceTransformToolbar.tsx` already renders both references and content objects
- many sections already read from one shared template direction

But underneath it still forks:
- `useAppStore.ts`
  - `activeReferenceTransformSession`
  - `activeContentObjectTransformSession`
  - parallel `begin*Shell`, `begin*Entry`, `commit*`, `cancel*`, `reset*`, and history/snap action families
- `ViewerHost.tsx`
  - separate `setReferenceTransformSession(...)`
  - separate `setContentObjectTransformSession(...)`
  - separate `setOnReferenceTransform...`
  - separate `setOnContentObjectTransform...`
- `ConsoleDock.tsx`
  - separate `contentObjectTransformRoot` staging path
  - separate object-shell enter/exit/cancel routing beside the reference path

That is the duplication this phase should delete.

### Exact Live Seams

Primary live seams this phase should collapse:

- `src/app/store/useAppStore.ts`
  - `activeReferenceTransformSession`
  - `activeContentObjectTransformSession`
  - `beginReferenceTransformShell(...)`
  - `beginReferenceTransformEntry(...)`
  - `commitActiveReferenceTransformEntry()`
  - `cancelActiveReferenceTransformEntry()`
  - `beginContentObjectTransformShell(...)`
  - `beginContentObjectTransformEntry(...)`
  - `commitActiveContentObjectTransformEntry()`
  - `cancelActiveContentObjectTransformEntry()`
- `src/app/components/ViewerHost.tsx`
  - `setReferenceTransformSession(...)`
  - `setContentObjectTransformSession(...)`
  - `setOnReferenceTransform...`
  - `setOnContentObjectTransform...`
- `src/app/console/ConsoleDock.tsx`
  - `contentObjectTransformRoot`
  - separate object-shell enter/exit/cancel routing
- `src/app/components/ReferenceTransformToolbar.tsx`
  - parallel active-session reads and object/reference branching that still exists only because the active session is split

### Shared Session Direction

- define one shared active `Viewer Transform` session shape
- that shape should carry:
  - `targetKind: 'reference' | 'content-object'`
  - one stable target id
  - `mode`
  - `space`
  - `shellActive`
  - `entryActive`
  - `activeHandle`
  - `historyScrubIndex`
  - `draftTransform`
  - `entryOrigin`
  - `sessionId`
  - `sessionOrdinal`
- do not keep separate top-level active session slots once this phase lands

Preferred first-pass session shape:
- `activeViewerTransformSession`
  - `targetKind: 'reference' | 'content-object'`
  - `targetId: string`
  - `mode`
  - `space`
  - `shellActive`
  - `entryActive`
  - `activeHandle`
  - `historyScrubIndex`
  - `draftTransform`
  - `entryOrigin`
  - `sessionId`
  - `sessionOrdinal`

The exact symbol name may differ, but the store should stop owning two parallel active transform session slots.

### Shared Action Direction

- collapse duplicated session-management actions where their behavior is structurally the same
- the shared transform session path should own:
  - shell begin / exit
  - entry begin / commit / cancel
  - mode and space changes
  - active handle sync
  - draft updates
  - history scrub changes
- target-specific routing for history or persistence should happen below that shared action layer, not by keeping two public transform APIs forever

First-pass shared actions should cover:
- `beginViewerTransformShell(targetKind, targetId)`
- `exitViewerTransformShell()`
- `beginViewerTransformEntry(mode)`
- `commitActiveViewerTransformEntry()`
- `cancelActiveViewerTransformEntry()`
- `setActiveViewerTransformMode(mode)`
- `setActiveViewerTransformSpace(space)`
- `setActiveViewerTransformHandle(handle)`
- `setActiveViewerTransformDraft(transformOverride)`
- `setActiveViewerTransformHistoryScrubIndex(scrubIndex)`

Target-specific helper routing can still decide:
- where transform overrides are stored
- where history rows are read/written
- which capability flags are exposed

### Viewer Direction

- `ViewerHost` should move toward one shared `Viewer Transform` session/callback contract
- do not keep parallel reference/object transform callback families if the shell is supposed to be one tool
- one shared viewer contract should accept a target descriptor and transform payload
- keep only minimal target adapters where viewer runtime still honestly differs

First-pass viewer contract direction:
- one shared session setter
- one shared transform-change callback
- one shared transform-commit callback
- one shared handle-change callback
- one shared mode-change callback
- one shared space-change callback

It is acceptable for the lower viewer/runtime layer to retain narrow target-kind adapters temporarily if needed, but `ViewerHost` should stop owning two public transform callback families.

### Console Direction

- Console should enter one shared `Viewer Transform` shell
- do not keep `contentObjectTransformRoot` as a second long-term transform-tree owner path
- target-specific wording can stay as status metadata, but the transform shell itself should be singular

First-pass Console lock:
- remove `contentObjectTransformRoot` as a public transform-root branch
- route object transform entry through the same `Viewer Transform` shell path the reference flow uses
- keep target-specific labels/status as metadata inside that shared shell

### Toolbar Direction

- keep `ReferenceTransformToolbar.tsx` as the one toolbar surface for now
- do not create another generated-object transform toolbar
- after this cleanup, any new feature added to the toolbar should depend on one shared transform session contract underneath

### Capability Direction

- the shared transform session model can still expose target capability flags
- first-pass expected capability differences may still include:
  - references support timelines
  - references support camera lock
  - generated objects do not
- those capability differences should not require duplicated session ownership

### Scope Guardrails

This phase does not need to:
- widen timelines to generated objects
- widen camera lock to generated objects
- redesign transform history storage
- redesign transform snap storage
- make generated-object transform durable model truth
- solve multi-select

If a cleanup idea does not help delete the duplicate session contract, it belongs in a later phase.

### Implementation Direction

- extract or define one shared active transform target/session helper in `useAppStore.ts`
- replace the current parallel session reads in the toolbar with that shared active session seam
- collapse duplicate Console transform-root branching onto the shared `Viewer Transform` session
- collapse duplicate viewer-host transform callback registration toward one shared target-aware contract
- preserve current generated-object viewer-only truth rules during the cleanup
- preserve current reference transform behavior and history behavior during the cleanup
- prefer narrowing public transform APIs first and leaving lower-level target-specific adapters in place only where they still honestly reduce risk

### Concrete Implementation Targets

Primary cleanup targets:
- `src/app/store/useAppStore.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/referenceTransformConsole.ts`
- `src/app/console/stagedNavigation.ts`

Supporting runtime targets if needed:
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

### Tests

- one shared active `Viewer Transform` session model can represent either a reference or a generated object
- toolbar still renders correctly for both target kinds from the shared session seam
- Console enters the same `Viewer Transform` shell for both target kinds
- viewer host syncs the active transform session for both target kinds through the shared contract
- object transform no longer depends on a separate public `contentObjectTransformRoot` shell path
- `ViewerHost` no longer depends on a separate public object transform callback/session family at the app-host layer
- generated-object viewer-only transform truth remains unchanged
- reference transform behavior remains unchanged
- object snap parity remains intact
- target-specific capability flags still correctly hide unsupported controls without forking the whole shell
- no new feature needs a second object-only transform toolbar path

### Assumptions

- `Transform 15.2` is the backend/session convergence pass, not another UI fork
- the toolbar is already shared enough that the real cleanup target is the duplicated plumbing underneath
- multi-select should build on one session model in `Transform 16`, not on parallel reference/object active-session systems

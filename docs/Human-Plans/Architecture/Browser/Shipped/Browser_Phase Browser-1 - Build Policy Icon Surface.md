# Browser Phase Browser-1 - Build Policy Icon Surface

## Doc Header

### Doc History
3. 2026-03-24 23:28: Marked Browser-1 shipped after the store-owned Browser build-policy icon surface landed, then moved this phase record from `Future/` to `Shipped/` so the Browser family now treats the first policy-icon cut as completed work instead of an open plan
2. 2026-03-24 13:42: Turned this Browser-1 note into an implementation-ready spec, grounding it in the current `BrowserPanel` local policy state, locking canonical app-store keyed maps plus the first graph/content row scope, and specifying the exact icon/fill-bar behavior that should land before later cascade or runtime-policy phases
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the first Browser build-policy surface cut now has its own planning home under `Browser/Future/` instead of living only as a subphase summary inside `Browser-Index.md`

### Purpose

This phase restores the Browser-side calc-policy icon surface.

Use it to answer:
- which rows expose build-policy cycling first
- how icon colors and fill bars should read
- how calc/build policy differs from visibility
- what canonical store state should back the first Browser policy surface

### Why This Phase Exists

The current Browser already has the beginnings of a policy-icon surface, but it is not the right long-term shape:
- only content rows expose it
- the state is local to `BrowserPanel`
- only `live / release / manual` exist
- graph rows are excluded
- the existing colors do not match the newer Browser direction
- graph and content fill bars still use inconsistent runtime visuals

This phase exists to land the first honest Browser policy surface without widening into:
- policy cascade rules
- authored-versus-effective truth
- real worker/build execution behavior

### Scope

This phase covers:
- the first Browser-owned policy type and store state
- the first Browser icon-cycle surface
- graph-title plus content-row scope
- icon colors
- fill-bar runtime semantics

This phase does not cover:
- graph-to-child propagation
- authored-versus-effective mode display
- build scheduling changes
- worker/runtime enforcement of the new modes

## Doc Body

## [x] Browser-1 - Build Policy Icon Surface

### Summary

- add the first visible Browser calc-policy surface on the left row icon
- keep the eyeball as visibility-only
- use the fill bar as runtime/loading status rather than policy status
- back the surface with canonical app/store state instead of temporary Browser-local state

### Current Constraints

Current code seams:
- `src/app/panels/BrowserPanel.tsx`
  - currently owns local `contentBuildPolicyByRowId`
  - currently limits policy icons to `assembly / component / object`
- `src/app/store/useAppStore.ts`
  - currently owns one global runtime `buildPolicy: 'live' | 'release' | 'manual'`
- `src/app/theme/surfaces/browser.css`
  - currently styles only `live / release / manual`
  - currently uses older colors
  - currently makes graph/content `rebuild` bars inconsistent

Locked constraints for this phase:
- do not replace or reinterpret the existing global runtime `buildPolicy` yet
- do not change current worker/build dispatch behavior
- do not implement graph-to-child visual propagation yet
- do not widen into Browser row interaction cleanup

### Public Interfaces And State

Add a Browser-owned policy type separate from the current runtime path:
- `BrowserBuildPolicy = 'live' | 'release' | 'manual' | 'off'`

Keep the existing global runtime `buildPolicy` behavior untouched in this phase.

Add canonical app/store keyed maps in `useAppStore.ts`:
- `browserGraphBuildPolicyByGraphDocumentId: Record<string, BrowserBuildPolicy>`
- `browserContentBuildPolicyByRowId: Record<string, BrowserBuildPolicy>`

Add store actions:
- `setBrowserGraphBuildPolicy(graphDocumentId, policy)`
- `cycleBrowserGraphBuildPolicy(graphDocumentId)`
- `setBrowserContentBuildPolicy(rowId, policy)`
- `cycleBrowserContentBuildPolicy(rowId)`

Default/fallback policy for any row without an explicit stored value:
- `live`

Implementation rule:
- Browser-1 must use canonical app/store state
- do not ship this phase on top of temporary `useState(...)` inside `BrowserPanel`

### Browser Behavior

Update `BrowserPanel.tsx` to remove the local `contentBuildPolicyByRowId` state.

Rows that get the left policy icon button in Browser-1:
- graph-title rows
- `assembly`
- `component`
- `object`

Rows that do not get policy cycling in Browser-1:
- `sketch`
- references
- viewport rows
- graph-section rows
- graph-node rows
- graph-rebuild-object rows

Graph-title rows participate in Browser-1, but only as authored graph-level surface state:
- the graph row icon is clickable and store-owned
- child rows do not visually propagate from the graph row yet
- Browser-2 owns cascade/effective propagation

Clicking the policy icon must not:
- select the row
- expand/collapse the row
- open/focus anything
- trigger builds

Icon cycle order:
- `live -> release -> manual -> off -> live`

Reuse the existing row letter/icon label:
- keep the same letter
- change only the background/state styling

### Visual Direction

Icon colors:
- `live`
  - green
- `release`
  - blue
- `manual`
  - yellow
- `off`
  - neutral gray disabled tone

The eyeball remains visibility-only:
- do not merge visibility and policy behavior
- `off` is not a hide state

### Fill-Bar Semantics

In `browser.css`, make graph and content fill bars use the same runtime language:
- `done`
  - full green bar
- `building`
  - animated bright blue/cyan bar
- `rebuild` / dirty
  - mostly empty bar with a small yellow left stub around `5%`

This phase only changes the visual semantics of the fill bars:
- it does not redefine the underlying runtime states
- it does not add new worker/result semantics

Required cleanup:
- remove the current graph/content inconsistency where graph `rebuild` is empty while content `rebuild` is full amber

### Boundaries

Browser-1 must not change:
- `requestGraphDocumentBuild(...)`
- current worker dispatch behavior
- `setBuildPolicy(...)`
- `pendingBuildAfterRelease`

Meaning of `manual` and `off` in Browser-1:
- they are surface/authored policy states only
- Browser-3 later makes runtime behavior obey them

Browser-3 later owns:
- `live`
  - build during slider drag
- `release`
  - build on slider release
- `manual`
  - explicit build only
- `off`
  - no worker-produced geometry

### Test Plan

BrowserPanel behavior:
- renders policy icons for:
  - graph rows
  - `assembly`
  - `component`
  - `object`
- does not render policy icons for:
  - `sketch`
  - references
  - viewport rows
  - graph-section rows
  - graph-node rows

Icon interaction:
- icon click cycles:
  - `live -> release -> manual -> off -> live`
- icon click does not trigger:
  - row selection
  - open/focus
  - expand/collapse

State behavior:
- rows without explicit stored policy render as `live`
- graph-row policy is visible and store-owned
- child rows do not visually follow graph-row policy yet

Fill-bar behavior:
- graph and content rows both render:
  - `done` full green
  - `building` animated blue/cyan
  - `rebuild` low yellow stub

Store coverage:
- keyed-map updates and cycle actions in `useAppStore`

Suggested verification targets:
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`

### Assumptions And Defaults

- Browser-1 already uses canonical app/store state, not temporary Browser-local state
- graph-title rows are in scope for Browser-1, but propagation to children is deferred to Browser-2
- `off` is allowed as a Browser-authored policy value before runtime execution semantics land
- the existing global runtime `buildPolicy` path remains intact until Browser-3 replaces or merges it

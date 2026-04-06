# Browser Phase Browser-2 - Cascade And Effective Policy Truth

## Doc Header

### Doc History
3. 2026-03-24 23:28: Cleaned up Browser-2 to match the real shipped interaction model by replacing the older silent inherited-row override wording with explicit `Make Independent` / `Return To Parent` behavior, then moved this phase record from `Future/` to `Shipped/`
2. 2026-03-24 14:35: Turned this Browser-2 phase into an implementation-ready spec by locking the canonical authored/effective build-policy model, graph-to-content cascade rules, override semantics, Browser row display rules, and the exact store/selector changes needed before Browser-3 runtime execution work
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the graph-title and parent-row build-policy cascade work now has its own planning home under `Browser/Future/` instead of remaining only as a Browser index bullet

### Purpose

This phase turns Browser build policy into inherited/effective truth instead of isolated row-local UI state.

Use it to answer:
- how graph-title policy cascades
- how parent rows affect child rows
- whether child rows show authored or effective policy

## Doc Body

## [x] Browser-2 - Cascade And Effective Policy Truth

### Summary

Turn Browser build policy into real authored and effective truth instead of isolated row-local UI state.

This phase locks:
- graph-title authored policy cascading through its Browser-owned content subtree
- assembly and component authored policy overrides
- effective policy calculation for graph, assembly, component, and object rows
- Browser display rules for authored versus effective policy

This phase does not yet make worker execution obey those effective modes.

### Owns

- canonical authored Browser build-policy ownership
- effective build-policy derivation
- graph-to-assembly/component/object cascade rules
- assembly/component child override rules
- Browser authored-versus-effective display semantics
- Browser/app selector and store truth required for those rules

### Does Not Own

- Browser-1 icon/fill-bar visual language
- low-level worker/build execution behavior
- ParaSlider rebuild timing
- worker output suppression behavior
- final runtime meaning of `live`, `release`, `manual`, and `off`

### Public Interfaces And State

Keep the authored Browser policy type from Browser-1:

- `BrowserBuildPolicy = 'live' | 'release' | 'manual' | 'off'`

Add explicit authored policy ownership in `src/app/store/useAppStore.ts`:

- keep:
  - `browserGraphBuildPolicyByGraphDocumentId`
  - `browserContentBuildPolicyByRowId`
- add authored-row helpers:
  - `getBrowserGraphBuildPolicy(graphDocumentId): BrowserBuildPolicy | null`
  - `getBrowserContentBuildPolicy(rowId): BrowserBuildPolicy | null`

Add selector-owned effective policy derivation, not duplicated panel-local logic:

- `selectEffectiveBrowserGraphBuildPolicy(options): BrowserBuildPolicy`
- `selectEffectiveBrowserContentBuildPolicy(options): BrowserBuildPolicy`

Add row-vm fields in Browser selectors:

- `authoredBrowserBuildPolicy: BrowserBuildPolicy | null`
- `effectiveBrowserBuildPolicy: BrowserBuildPolicy`
- `effectiveBrowserBuildPolicySource: 'self' | 'graph' | 'assembly' | 'component' | 'default'`

Do not remove the authored maps in this phase.
Browser-2 adds effective truth on top of them.

### Canonical Cascade Rules

#### First Scoped Tree

Browser-2 only applies cascade inside the Browser-owned graph/content tree:

- graph-document
- assembly
- component
- object

Sketch, reference, viewport, graph-section, and graph-node rows do not participate in effective build-policy cascade in Browser-2.

#### Authored Sources

Authored policy may be stored on:

- graph-document rows
- assembly rows
- component rows
- object rows

#### Parent Chain

Effective policy for a row is resolved from nearest authored ancestor:

1. self authored policy
2. nearest authored parent in the Browser content chain
3. owning graph authored policy
4. default `live`

For each row kind:

- graph-document
  - self authored policy
  - else default `live`
- assembly
  - self
  - else owning graph
  - else default `live`
- component
  - self
  - else parent assembly
  - else owning graph
  - else default `live`
- object
  - self
  - else parent component if present
  - else parent assembly if directly owned
  - else owning graph
  - else default `live`

#### Override Rule

Children may author an override in Browser-2, but independence must be explicit.

That means:
- a graph can be `manual`
- one assembly under it can be `live`
- one component under that assembly can be `off`
- one object under that component can still explicitly choose `release`

Browser-2 must preserve authored child overrides.
It must not flatten everything under the graph to one stored value.

Browser-2 shipped rule:
- inheriting rows follow parent policy by default
- a child only becomes independent through an explicit Browser action
- parent changes continue to affect inheriting children
- parent changes do not overwrite already-independent child rows

### Effective Display Rules

Browser rows need to display effective policy truth without losing authored intent.

Browser-2 display rule:

- row icon color shows `effectiveBrowserBuildPolicy`
- row tooltip shows both:
  - effective policy
  - authored source
- rows with inherited policy get a subtle inherited-state treatment
  - recommended:
    - keep the same effective color
    - add a thin inset ring or low-opacity corner notch
    - do not invent a second color system

Recommended tooltip shapes:

- self-authored:
  - `Build policy: Manual`
- inherited from graph:
  - `Build policy: Manual (from Graph 1)`
- inherited from assembly:
  - `Build policy: Off (from Assembly 1)`
- inherited from component:
  - `Build policy: Release (from Pedal Component)`

Do not show both authored and effective as two side-by-side row chips in Browser-2.
Keep the row readable and let the tooltip explain inheritance.

### Icon And Menu Behavior

Browser-2 ships two distinct behaviors:

- self-authored / default rows
  - left-click cycles that row's authored policy
- inherited rows
  - left-click does not silently create an override
  - right-click/context menu owns the independence transition

Icon interaction must not:
- select row
- expand/collapse row
- open/focus row
- trigger builds

Cycle order stays:

- `live -> release -> manual -> off -> live`

Shipped inherited-row behavior:

- inherited rows continue to show effective policy color
- inherited rows explain their source in the tooltip
- inherited rows use explicit context-menu actions:
  - `Make Independent`
  - `Return To Parent`
- graph/assembly rows use:
  - `Return To Default`

Example:

- graph effective `manual`
- assembly has no authored value, so effective `manual (from graph)`
- left-click assembly icon
  - no override is created
- right-click assembly row and choose `Make Independent`
  - assembly now authors `manual`
- subsequent left-clicks cycle the assembly's self-authored policy

### Browser Row Selector Changes

Update Browser selector code in:

- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/selectBrowserGraphRows.ts`

Requirements:

- graph rows expose authored/effective Browser build policy fields
- assembly/component/object rows expose authored/effective Browser build policy fields
- selectors calculate effective mode once, not in `BrowserPanel.tsx`
- `BrowserPanel.tsx` should read:
  - effective mode for color/styling
  - authored/effective source for tooltip and inherited treatment

### BrowserPanel Rules

Update `src/app/panels/BrowserPanel.tsx`:

- do not read raw store maps directly to decide display color anymore
- use row-vm authored/effective fields instead
- icon label/title should reflect effective mode and inheritance source
- inherited rows should not silently cycle into overrides on ordinary click
- inherited rows should expose explicit:
  - `Make Independent`
  - `Return To Parent`
  - `Return To Default`
  through the row context menu
- independent rows should be visually marked as independent

Browser-2 should leave Browser row family scope unchanged:

- graph-document
- assembly
- component
- object

### Boundaries

Browser-2 must not:

- change `requestGraphDocumentBuild(...)`
- change worker dispatch rules
- change `setBuildPolicy(...)`
- change `pendingBuildAfterRelease`
- make `off` actually suppress geometry generation yet
- make `manual` actually block rebuild requests yet

Browser-2 is truth-model work, not runtime-policy execution work.

### Test Plan

- `useAppStore` selector/store tests:
  - graph authored `manual` makes assembly/component/object effective `manual` by default
  - assembly self-authored `live` overrides graph `manual`
  - component self-authored `off` overrides assembly `live`
  - object self-authored `release` overrides component `off`
  - rows with no authored ancestor fall back to effective `live`

- `selectBrowserTreeRows.test.ts`
  - graph rows expose `authoredBrowserBuildPolicy` and `effectiveBrowserBuildPolicy`
  - content rows expose `authoredBrowserBuildPolicy` and `effectiveBrowserBuildPolicy`
  - `effectiveBrowserBuildPolicySource` is correct for:
    - self
    - graph
    - assembly
    - component
    - default

- `BrowserPanel.test.tsx`
  - inherited rows render effective icon color even without self-authored policy
  - inherited rows show inherited tooltip text
  - clicking an inherited row icon does not create a self-authored override
  - inherited rows become independent only through `Make Independent`
  - independent rows show their independent treatment
  - `Return To Parent` / `Return To Default` restores inheritance/default behavior
  - clicking a self-authored row icon continues cycling self policy
  - graph row authored policy does not visually affect unsupported row families like sketch/reference/viewport in Browser-2

### Assumptions

- default effective Browser build policy remains `live`
- Browser-2 allows child overrides under a graph-authored policy
- Browser-2 requires override creation to be explicit, not silent on ordinary icon click
- Browser-2 shows effective mode in the icon, not authored mode
- Browser-2 uses tooltip/inherited treatment to communicate authored source
- Browser-3 later makes runtime execution honor the effective mode rather than just display it

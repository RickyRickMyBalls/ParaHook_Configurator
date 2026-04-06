## [5.1F]
### Summary
#### Summary
##### Summary
`5.1F` should unify the shared workspace truth across:
- `Console`
- `Browser`
- `Spaghetti Editor`
- `Viewer`

This phase is not about keyboard routing.
`4.1J` already handled input ownership.

This phase is about:
- one canonical workspace-selection seam
- one canonical active-surface model
- one canonical intent layer for shared cross-surface outcomes

Important rule:
- do not turn `ConsoleDock` into the owner of workspace truth
- do not turn `BrowserPanel` into the owner of workspace truth
- do not mirror all domain state into one mega-store

#### Target Outcome

`5.1F` should establish:
- one shared workspace-selection seam above the current surfaces
- one shared `selectedTarget` model
- one shared `activeSurface` model
- one shared canonical intent layer for common outcomes
- surfaces rendering from shared truth instead of syncing each other through one-off glue

In practical terms:
- selecting a graph should consistently drive:
  - browser selection
  - spaghetti editor visibility/open state when appropriate
  - spaghetti active-window highlight
- selecting a target should consistently drive:
  - browser selection state
  - editor selection state
  - viewer highlight state where relevant
- typed commands and clicks should be able to produce the same outcome through the same intent

#### Canonical Seams

`5.1F` should tighten three seams:

1. Workspace-selection seam
- `activeGraphDocumentId`
- `activeEditorViewportId`
- `selectedTarget`
- `activeSurface`

2. Session/tool seam
- existing feature sessions stay in their domain stores
- sketch-plane pick
- sketch draw / review
- reference transform
- future tool sessions

3. Canonical intent seam
- `openGraphDocument`
- `focusEditorViewport`
- `selectTarget`
- `startSketchPlane`
- `startSketchDraw`
- `activateSurface`

Important rule:
- the workspace-selection seam owns coordination truth
- the domain seams still own their real mechanics

### Questions / Decisions

#### [x] `q1` Decide what the minimum canonical workspace-selection state should include.

#### Suggestion
- locked direction:
- the minimum canonical workspace-selection state should include:
  - `activeGraphDocumentId`
  - `activeEditorViewportId`
  - `selectedTarget`
  - `activeSurface`
- `selectedTarget` should be one shared selection model that can cover:
  - graph node
  - reference
  - object
  - part
- selecting a graph should be enough to drive:
  - browser selection
  - spaghetti window visibility/open state
  - spaghetti active highlight

#### [x] `q2` Decide whether selection should be specialized per domain or unified as one shared selected-target model.

#### Suggestion
- locked direction:
- use one shared `selectedTarget` model first
- do not create a separate canonical `selectedSketchNodeId`
- treat `Sketch` as one node family inside graph scope
- deeper branches should belong to node-family command systems, not to separate selection types

#### [x] `q3` Decide what `activeSurface` means.

#### Suggestion
- locked direction:
- `activeSurface` should mean the surface currently foregrounded for the user
- first valid surface ids may be:
  - `console`
  - `browser`
  - `spaghetti`
  - `viewer`
- `activeSurface` should drive:
  - floating-window active highlight
  - visible foreground emphasis
  - light coordination with input ownership
- important distinction:
  - `activeSurface` = which surface is foregrounded
  - `selectedTarget` = what thing is selected

#### [x] `q4` Decide where the canonical workspace-selection state should live.

#### Suggestion
- locked direction:
- the canonical workspace-selection seam should live above the current surfaces and adjacent to the existing stores
- first implementation home:
  - add a dedicated `workspaceSelection` slice in `useAppStore.ts`
- keep graph/editor mechanics in `useSpaghettiStore.ts`
- do not let `useAppStore` become a mirror of `useSpaghettiStore`

#### [x] `q5` Decide what counts as a canonical intent.

#### Suggestion
- locked direction:
- canonical intents are the shared outcome-level actions that every surface should call when they want the same result
- the first canonical intents should include:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `startSketchPlane`
  - `startSketchDraw`
  - `activateSurface`
- if `Console`, `Browser`, and `Spaghetti Editor` can produce the same user outcome, they should call the same canonical intent

#### [x] `q6` Decide which current behaviors are only bridges and should later become canonical.

#### Suggestion
- locked direction:
- distinguish between:
  - real canonical domain-entry behavior
  - temporary cross-surface glue
- examples of real canonical domain-entry behavior:
  - `Graph`
  - `Reference`
  - `Assembly`
- only treat a behavior as temporary glue if it exists because the canonical shared selection/intent system is still incomplete

#### [x] `q7` Decide what should remain local component state.

#### Suggestion
- locked direction:
- keep presentation-only state local unless there is a proven need to share it
- examples:
  - menu open/closed
  - hover state
  - popover visibility
  - cosmetic tray expansion
  - appearance tuning values that do not affect cross-surface coordination

#### [x] `q8` Decide what success looks like.

#### Suggestion
- locked direction:
- success is not â€œall state lives in one mega-storeâ€
- success is:
  - console, browser, and editor agree on active graph/node/surface
  - identical user outcomes go through identical intents
  - browser and editor highlights reflect shared truth
  - console navigation resolves against the same shared workspace truth

### Implementation Spec

Purpose:
- create one canonical cross-surface workspace-selection and intent layer for the main workspace domains

#### Scope

Owned here:
- one shared `workspaceSelection` seam in app-level state
- one shared `selectedTarget` model
- one shared `activeSurface` model
- one first canonical intent layer for common graph/reference/editor outcomes
- surface migration onto those shared intents and selectors

Not owned here:
- input-routing precedence
- full session/tool-state redesign
- full browser hierarchy redesign
- large transcript redesign
- every local UI state migration

#### First Implementation Cut

`5.1F` should likely start narrow:

1. create the `workspaceSelection` seam
- likely in `useAppStore.ts`
- first fields:
  - `selectedTarget`
  - `activeSurface`

2. define canonical selectors and intents
- read shared selection truth
- dispatch shared outcome-level actions

3. migrate the highest-value graph path first
- graph selection from console
- graph selection from browser
- graph/editor highlight reflection

4. prove shared target reflection
- selecting the same thing from different surfaces should yield the same browser/editor/viewer result

5. then extend to more domains
- `Reference`
- `Assembly`
- later node families and deeper authoring branches

#### Likely Integration Seams

Primary seams:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- viewer selection/highlight seams

Likely responsibilities:
- `useAppStore`
  - workspace-selection coordination truth
  - canonical surface activation
  - cross-surface selection model
- `useSpaghettiStore`
  - graph/editor mechanics
  - node/session mechanics
  - graph-domain execution details
- surfaces
  - render from shared truth
  - dispatch shared intents
  - stop inventing panel-local coordination truth

#### First Implementation Steps

`5.1F` should likely be completed in this order:

1. add the app-level `workspaceSelection` seam
2. define the initial `selectedTarget` shape
3. define the first canonical intents
4. route graph-domain entry through those intents
5. make browser/editor/highlight reflection read shared truth
6. add regressions proving identical outcomes from console and browser entry paths
7. extend to additional domains only after graph flow is honest

#### Hard Rules

- do not copy all spaghetti/editor state into `useAppStore`
- do not let panels own canonical workspace truth
- do not make canonical intents so broad that they become UI-script buckets
- do not confuse `activeSurface` with actual selection truth
- do not widen the first cut beyond the highest-value shared outcomes

#### Acceptance Shape

- there is one explicit workspace-selection seam above the current surfaces
- `selectedTarget` and `activeSurface` are shared cross-surface truth
- graph selection can produce the same result from console and browser entry
- browser selection, editor visibility/highlight, and viewer highlight no longer depend on panel-local sync glue for the migrated paths
- the canonical layer coordinates surfaces without becoming a mega-store that owns every feature detail



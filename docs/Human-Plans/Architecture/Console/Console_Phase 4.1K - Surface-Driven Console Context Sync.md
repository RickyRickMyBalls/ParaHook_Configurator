### [x] `4.1K` Surface-Driven Console Context Sync

#### Questions / Decisions

##### [x] `q1` Decide whether UI interaction should move the console into the matching staged scope.

##### Suggestion
- locked direction:
- yes
- clicking a surface or selected target should move the console into the nearest matching staged scope
- this should be treated as context sync, not as a special shortcut hack
- important rule:
  - the handoff updates context
  - the handoff does not auto-run the next deeper command

##### [x] `q2` Decide which shared seams should drive console context handoff.

##### Suggestion
- locked direction:
- console handoff should resolve from shared workspace truth:
  - `activeSurface`
  - `selectedTarget`
  - current staged session state
- do not derive console scope from panel-local assumptions in:
  - `BrowserPanel`
  - `SpaghettiPanel`
  - `ConsoleDock`
- important rule:
  - the same selected target should resolve to the same console scope no matter which surface produced it

##### [x] `q3` Decide what a plain `Spaghetti` surface click should do.

##### Suggestion
- locked direction:
- clicking into `Spaghetti Editor` should move the console into the nearest stable graph-family scope
- first target behavior:
  - if an active graph document exists:
    - enter `Graph > graph_[n]`
  - if a graph-family node target is already selected:
    - enter the matching node-family scope
- do not leave the console at root if the workspace already has enough truth to enter a stable graph scope

##### [x] `q4` Decide what a node click should do from either `Browser` or `Spaghetti`.

##### Suggestion
- locked direction:
- clicking the same node target from either surface should produce the same console scope
- examples:
  - click `Sketch` node in `Spaghetti`
    - console enters sketch scope
  - click the same `Sketch` node in `Browser`
    - console enters the same sketch scope
- important rule:
  - surface choice may affect `Selection` reporting
  - surface choice should not create different staged command scopes for the same selected target

##### [x] `q5` Decide what should happen when the user clicks away from the active authoring surface.

##### Suggestion
- locked direction:
- clicking away should return the console to the nearest valid parent scope
- first target behavior:
  - leaving a node-family target returns to graph scope
  - leaving graph-family authoring returns to root-ready scope if no active graph-family target remains
- important rule:
  - this should feel like backing out of context
  - not like losing command state randomly

##### [x] `q6` Decide whether surface-driven handoff is allowed to overwrite partially typed command text.

##### Suggestion
- locked direction:
- do not silently discard partially typed command text
- prefer:
  - preserve the draft text when possible
  - update staged scope, breadcrumb, and visible choices around it
- if a handoff must clear draft text for correctness, it should be explicit and visibly reported

##### [x] `q7` Decide what the console should report when UI-driven handoff occurs.

##### Suggestion
- locked direction:
- the console should visibly report:
  - active surface changes
  - selected target changes
  - resulting staged scope handoff
- the transcript should make the state transition understandable, for example:
  - `[Selection] Active surface: Spaghetti Editor`
  - `[Selection] Selected target: Sketch`
  - `[Commands] Graph > Sketch`
- do not leave the user to infer the new command scope from prompt changes alone

##### [x] `q8` Decide what the first implementation cut should prove.

##### Suggestion
- locked direction:
- the first cut should prove:
  - clicking `Spaghetti` with an active graph moves the console into graph scope
  - clicking a `Sketch` node in `Spaghetti` moves the console into sketch scope
  - clicking the same `Sketch` node in `Browser` moves the console into the same sketch scope
  - clicking away backs the console out to the nearest valid parent/root
- do not widen to every node family in the first cut

### Implementation Spec

Purpose:
- keep the staged console visibly synchronized with workspace interaction

#### Summary

`4.1K` should make the `Console` follow workspace context instead of acting like a separate navigation universe.

By this point:
- `4.1J` already cleaned up input ownership
- `5.1F` already established:
  - shared `activeSurface`
  - shared `selectedTarget`
  - canonical workspace intents

So `4.1K` should consume those seams and turn them into visible staged-console context handoff.

This phase is working when:
- clicking a surface reports what became active
- clicking a target reports what became selected
- the console enters the matching staged scope automatically
- the next valid commands for that scope are immediately visible

Important rule:
- UI interaction should update command context
- UI interaction should not auto-run the next deeper command

#### Main Decision

The main decision in `4.1K` is:

- should the console remain mostly typed-only, or should it become context-aware and follow shared workspace state?

Locked direction:
- make the console context-aware
- keep explicit command submission for the actual action

#### First Implementation Cut

The first cut should stay narrow:

1. `Spaghetti` surface click
- if an active graph exists:
  - console enters `Graph > graph_[n]`

2. `Sketch` node click in `Spaghetti`
- console enters the matching sketch scope

3. `Sketch` node click in `Browser`
- console enters the same sketch scope

4. click away / leave authoring context
- console returns to the nearest valid parent/root scope

Do not widen the first cut to every node family yet.

#### Likely Integration Seams

Primary seams:

- `src/app/console/ConsoleDock.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/AppShell.tsx`
- staged grammar / staged session utilities already in:
  - `src/app/console/stagedNavigation.ts`

Likely responsibilities:

- shared workspace seams:
  - remain the source of truth for:
    - `activeSurface`
    - `selectedTarget`
- console handoff seam:
  - maps shared workspace truth to nearest valid staged scope
  - updates visible command choices
  - reports the handoff in transcript/status output
- surfaces:
  - continue to publish surface activation and target selection through shared seams
  - do not invent private console-only handoff logic

#### First Implementation Steps

`4.1K` should likely be completed in this order:

1. add one console-context handoff seam above local console parsing
2. map shared graph-first targets to the nearest staged scopes
3. wire `Spaghetti` activation into graph-scope handoff
4. wire `Browser` and `Spaghetti` node selection into the same node-family handoff
5. add parent/root fallback when the user clicks away from the authoring surface
6. add transcript/status reporting so the handoff is visible and understandable
7. lock regressions proving that the same selected target produces the same console scope from both surfaces

#### Hard Rules

- do not auto-run child commands during handoff
- do not create different console scopes for the same `selectedTarget`
- do not let panel-local state become the real source of console context truth
- do not silently erase partially typed command text unless explicit cancel semantics require it
- keep the first cut graph-first and node-family narrow

#### Scope Boundary

Keep `4.1K` focused.

Owned here:
- UI-driven staged-console context sync
- surface/target-to-scope mapping
- visible console reporting of handoff
- parent/root fallback when context is left

Not owned here:
- deeper command-language redesign
- full transcript redesign
- new workspace-selection seams
- every node family in one pass
- auto-running authoring actions from clicks

#### Acceptance Shape

- clicking `Spaghetti` with an active graph moves the console into graph scope
- clicking the same graph-family node in `Browser` or `Spaghetti` produces the same console scope
- clicking away returns the console to the nearest valid parent/root scope
- the transcript makes the handoff understandable to the user
- the console still requires explicit user submission for deeper authoring commands


# [5.1F] Workspace Selection, Surface Activation, And Canonical Intents

## Canonical Workspace Unification
### Fold hack 3
#### Summary

The next major step after `4.1J` is not more key-routing cleanup.

It is full workspace unification between:
- the `Console`
- the `Browser`
- the `Spaghetti Editor`
- the `Viewer`
- active tool/session overlays

The goal is:
- one canonical workspace-selection model
- one canonical session/tool model
- one canonical intent layer

The goal is not:
- making `ConsoleDock` own the app
- making `Browser` own the app
- making `Spaghetti Editor` the only real source of truth

These surfaces should become different views over the same shared workspace state.

#### What Canonical Should Mean

The canonical workspace system should answer:
- which graph is active
- which editor viewport is active
- which node is selected
- which sketch is selected
- which surface is active
- which session/tool is active
- who owns input right now

If those answers are not shared, the surfaces are still only loosely bridged.

#### Surface Roles

`Console`
- captures command input
- issues intents
- shows transcript and command-state feedback
- should not become the owner of graph/editor selection truth

`Browser`
- renders shared workspace selection and hierarchy state
- can issue the same intents as console and editor
- should not become the canonical owner of editor/tool state

`Spaghetti Editor`
- renders and mutates shared graph/editor/session state
- is the main authoring surface
- should not hide â€œrealâ€ active state inside local-only UI assumptions

`Viewer`
- renders spatial result and tool overlays
- participates in the same session/tool state
- should not create parallel selection truth

#### Canonical Seams

The unified system likely needs three explicit seams:

1. Canonical workspace-selection state
- active graph document
- active editor viewport
- selected target
- active surface

2. Canonical session/tool state
- sketch-plane pick
- sketch draw / review
- reference transform
- staged console session
- future feature-local tool sessions

3. Canonical intent layer
- open graph
- focus viewport
- select target
- start sketch plane
- start sketch draw
- activate surface

Important rule:
- clicks and typed commands should issue the same intents
- no surface should need a private side-channel to make the app do the â€œrealâ€ thing

#### How To Achieve This

The clean path is:

1. define one shared workspace-selection model
- start by naming the minimum canonical state
- do not widen it to every possible UI detail

2. define one intent vocabulary
- console, browser, and editor should all dispatch the same actions
- avoid separate â€œbrowser-onlyâ€ or â€œconsole-onlyâ€ execution paths for the same outcome

3. route surface behavior through that shared state
- console command resolves target, then dispatches canonical intent
- browser click resolves target, then dispatches canonical intent
- editor click resolves target, then dispatches canonical intent

4. let surfaces render from shared state
- browser highlights active graph/node from shared state
- spaghetti floating window highlight reflects shared active-surface state
- console staged navigation resolves against shared workspace state

5. keep local UI state local
- tray open/closed
- menu visibility
- hover affordances
- window appearance tuning

Important rule:
- canonical state should own workspace truth
- local component state should own presentation-only details

#### Questions / Decisions

##### [x] `q1` Decide what the minimum canonical workspace-selection state should include.

##### Suggestion
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
- do not start with every possible browser row or UI toggle

##### [x] `q2` Decide whether selection should be specialized per domain or unified as one shared selected-target model.

##### Suggestion
- locked direction:
- use one shared `selectedTarget` model first
- do not create a separate canonical `selectedSketchNodeId`
- treat `Sketch` as one node family inside graph scope
- deeper branches should belong to node-family command systems, not to separate selection types
- if later workflows truly require more domain-specific selection detail, add that on top of the shared target model instead of replacing it

##### [x] `q3` Decide what `active surface` means.

##### Suggestion
- locked direction:
- `activeSurface` should mean the surface currently foregrounded for the user
- first valid surface ids may be:
  - `console`
  - `browser`
  - `spaghetti`
  - `viewer`
- this should drive:
  - floating-window active highlight
  - visible foreground emphasis
  - light coordination with input ownership
- it should not replace selection truth
- important distinction:
  - `activeSurface` = which surface is foregrounded
  - `selectedTarget` = what thing is selected

##### [x] `q4` Decide where the canonical workspace-selection state should live.

##### Suggestion
- locked direction:
- the canonical workspace-selection seam should live above the current surfaces and adjacent to the existing stores
- first implementation home:
  - add a dedicated `workspaceSelection` slice in `useAppStore.ts`
- it should not live:
  - in `ConsoleDock.tsx`
  - in `BrowserPanel.tsx`
  - in `SpaghettiPanel.tsx`
- reason from the current code:
  - graph/editor mechanics already live in `useSpaghettiStore.ts`
    - `activeGraphDocumentId`
    - `activeEditorViewportId`
    - `selectedNodeId`
  - cross-surface state already lives in `useAppStore.ts`
    - reference workspace
    - selected part
    - floating shell activation request
  - `BrowserPanel.tsx` already has to read both stores, which is a sign that the canonical coordination seam should sit above the panels, not inside one of them
- recommended implementation shape:
  - keep graph/editor mechanics in `useSpaghettiStore`
  - add a shared `workspaceSelection` slice in `useAppStore`
  - let that slice own cross-surface active-target truth such as:
    - `selectedTarget`
    - `activeSurface`
    - later other workspace-selection state as needed
  - expose selectors/intents that coordinate with `useSpaghettiStore` instead of duplicating local selection logic in console/browser/editor
- important rules:
  - do not immediately copy all Spaghetti state into `useAppStore`
  - do not let `useAppStore` become a mirror of `useSpaghettiStore`
  - the workspace-selection seam owns coordination truth
  - the domain stores still own their real mechanics
  - migrate additional state only when a real cross-surface coordination need proves it

##### [x] `q5` Decide what counts as a canonical intent.

##### Suggestion
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
- do not create separate:
  - console-only execution paths
  - browser-only execution paths
  - editor-only execution paths
- important rule:
  - canonical intents should stay small and outcome-based at first
  - do not widen them into every possible local UI action

##### [x] `q6` Decide which current behaviors are only bridges and should later become canonical.

##### Suggestion
- locked direction:
- this question should distinguish between:
  - real canonical domain-entry behavior
  - temporary cross-surface glue
- examples of real canonical domain-entry behavior:
  - `Graph`
  - `Reference`
  - `Assembly`
- these are legitimate root workspace domains, not suspect bridges
- if a root command enters one of those domains, it is correct for that command to:
  - make the right surface visible
  - activate the right surface
  - sync browser/editor selection state
- examples of behavior that may still be temporary glue today:
  - local floating-window activation requests
  - panel-local selection sync that exists only because the canonical workspace-selection seam is not complete yet
  - surface-specific fallback logic that manually pokes another surface instead of dispatching a shared canonical intent
- important rule:
  - do not label high-level domain entry as â€œjust a bridgeâ€
  - only treat a behavior as temporary glue if it exists because the canonical shared selection/intent system is still incomplete

##### [x] `q7` Decide what should remain local component state.

##### Suggestion
- locked direction:
- keep these local unless there is a proven need to share them:
  - menu open/closed
  - hover state
  - popover visibility
  - cosmetic tray expansion
  - appearance tuning values that do not affect cross-surface coordination
- only promote state when multiple surfaces truly need to agree on it
- important rule:
  - presentation-only behavior stays local
  - workspace-selection and cross-surface coordination truth become canonical

##### [x] `q8` Decide what success looks like.

##### Suggestion
- success is not â€œall state lives in one mega-storeâ€
- success is:
  - console, browser, and editor agree on active graph/node/surface
  - identical user outcomes go through identical intents
  - browser and editor highlights reflect shared truth
  - console navigation resolves against the same shared workspace truth

#### Likely Future Phase Shape

This likely deserves its own follow-on family after `4.1J`, for example:
- workspace-selection audit
- canonical intent layer
- surface migration
- browser/editor/console reflection hardening

It should not be silently folded into more console-only cleanup.






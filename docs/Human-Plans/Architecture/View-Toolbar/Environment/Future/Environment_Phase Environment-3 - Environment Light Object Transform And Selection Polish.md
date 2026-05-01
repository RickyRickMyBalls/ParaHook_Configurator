# Environment Phase Environment-3 - Environment Light Object Transform And Selection Polish

## Doc Header

### Doc History
3. 2026-04-23 09:15:21: Marked `Environment-3 / Phase 6-10` complete after positional environment lights gained translate-only Viewer Transform history state, move commit insertion, scrub/reset/delete/delta/lock/merge operations, app-level undo/redo snapshots, toolbar history reads, Console `DeleteLatest`, focused tests, and production build proof
2. 2026-04-23 08:15:37: Reworked this future plan into small one-by-one phases, marking the already-fixed environment-light Browser, Console, double-click, zoom, and disabled-helper follow-ups as completed planning phases while splitting the remaining movable-light Viewer Transform history work into focused storage, commit, operation, undo-redo, and UI closeout phases
1. 2026-04-23 08:12:21: Created this standalone `Environment-3` future plan to capture the follow-up environment-light object behavior work around Browser selection, double-click zoom and settings routing, Console ViewTransform options, disabled-light marker visibility, positional-light movement, Shift+Z zoom, and real Viewer Transform history for movable lights

### Purpose

This doc is the future execution surface for `Environment-3`.

Use it to answer:
- which environment-light object behaviors have already been fixed
- which environment-light Viewer Transform behaviors still need implementation
- how to keep environment lights object-like for selection, zoom, and move without turning them into content objects
- how to split the remaining Viewer Transform history work into small Codex-sized phases

### Scope

This phase covers:
- Browser selection and double-click behavior for environment lights
- Console `ViewTransform`, `Move`, `ZoomObject`, `ZO`, and selected-light command routing
- `Shift+Z` zoom-to-selected behavior for environment lights
- disabled-light viewport marker visibility and pickability
- Viewer Transform history for positional environment lights

This phase does not cover:
- changing the locked default environment look
- adding new HDRI catalog browsing behavior
- turning non-positional light types into fake movable objects
- moving environment-light ownership out of Environment state
- adding rotate, scale, snap, timeline, or camera-lock support for light transforms

## Doc Body

### Summary

`Environment-3` captures the follow-up light-object work that grew out of the Browser and Viewer Transform polish pass.

Some of this work is already fixed and should be preserved as completed planning history:
- selecting Key, Fill, Rim, or other environment lights in Browser should not surprise-open Viewer Transform
- Console should offer explicit object-style `ViewTransform` and `Move` options for selected positional lights
- double-clicking a light should frame it and route the Environment settings to that light
- selected-light zoom should work through Console and `Shift+Z`
- disabled light helpers should not stay visible or pickable in the viewport

The remaining work is narrower:
- positional environment lights need real translate-only Viewer Transform history
- that history should behave like object/reference history where it matters
- unsupported light transform modes should stay unavailable

### Current Live Read

Already-fixed or already-routed behavior:
- Browser light selection is selection-only and no longer automatically opens Viewer Transform
- Console can offer environment lights as object-like selected targets
- Console can explicitly open transform movement for positional lights
- non-positional lights such as `hemisphere` warn cleanly instead of opening a fake move shell
- Browser double-click can frame the selected light and focus the light settings
- selected environment lights can route through zoom-object behavior, including `Shift+Z`
- disabled light helpers should be hidden and depicked while Browser rows remain available

Remaining gap:
- environment lights have a Viewer Transform shell
- positional lights can commit position changes
- the commit path still behaves like a direct `LightSpec.position` write
- light moves do not yet have target-local transform history, scrub, delete latest, merge, reset, or edit-history undo/redo parity

### Environment Light Object Contract

Environment lights should be object-like for:
- Browser selection
- viewport picking when enabled
- zoom-to-object and zoom-to-selected
- Console object-style command discovery
- Viewer Transform entry for movable light types
- translate-only transform-history reads once movement is committed

Environment lights should remain Environment-owned for:
- enabled or disabled state
- type, color, intensity, and lighting settings
- Environment toolbar settings
- Environment source and preset ownership
- renderer helper creation and runtime application

Important rule:
- do not store environment lights as content objects
- do not let Browser, Console, toolbar, or viewer helpers become separate light owners

### Movable Light Rule

Only positional light types should enter Viewer Transform:
- `directional`
- `point`
- `spot`

Non-positional light types should not open a move shell:
- `hemisphere`
- any later type without a durable position contract

When a user tries to move a non-positional light, the app should warn cleanly and leave the current selection intact.

## Vision

### Vision Summary

`Environment-3` should make selected environment lights feel coherent across Browser, Console, viewport, and Viewer Transform.

The user should not have to remember which surface they used first. A selected movable light should be frameable, zoomable, and movable from shared object-like language, while light settings remain in the Environment surface.

### Human Level Goals

- `Environment-3-HLG-1. Selecting Environment Lights Should Not Surprise-Open Viewer Transform`
- `Environment-3-HLG-2. Console Should Offer Explicit ViewTransform And Move For Movable Lights`
- `Environment-3-HLG-3. Double-Clicking A Light Should Zoom To It And Open Its Light Settings`
- `Environment-3-HLG-4. Console And Shift+Z Should Treat Selected Lights Like Object Targets For Zoom`
- `Environment-3-HLG-5. Disabled Lights Should Not Leave Active Viewport Markers Behind`
- `Environment-3-HLG-6. Movable Lights Should Have Real Viewer Transform History`

## Wishlist Organization

### High Level Goals

- [x] `Environment-3-HLG-1. Selecting Environment Lights Should Not Surprise-Open Viewer Transform`
- [x] `Environment-3-HLG-2. Console Should Offer Explicit ViewTransform And Move For Movable Lights`
- [x] `Environment-3-HLG-3. Double-Clicking A Light Should Zoom To It And Open Its Light Settings`
- [x] `Environment-3-HLG-4. Console And Shift+Z Should Treat Selected Lights Like Object Targets For Zoom`
- [x] `Environment-3-HLG-5. Disabled Lights Should Not Leave Active Viewport Markers Behind`
- [x] `Environment-3-HLG-6. Movable Lights Should Have Real Viewer Transform History`

### Codex Level Goals

- [x] CLG 1. Keep Browser light selection separate from automatic Viewer Transform activation.
- [x] CLG 2. Route explicit Console `ViewTransform` and `Move` entry for positional lights while warning for non-positional lights.
- [x] CLG 3. Route Browser double-clicks through both object-like framing and light-setting focus.
- [x] CLG 4. Share zoom-object target resolution across Console, `ZoomObject` / `ZO`, and `Shift+Z` for selected environment lights.
- [x] CLG 5. Hide and depick disabled light helpers so off lights do not leave misleading viewport geometry markers.
- [x] CLG 6. Add environment-light transform-history storage and active-session scrub state.
- [x] CLG 7. Make positional-light move commits insert translate-only history entries.
- [x] CLG 8. Wire light history scrub, reset, delete latest, lock, delta edit, and merge operations.
- [x] CLG 9. Wire edit-history undo/redo snapshots for light transform history and position restore.
- [x] CLG 10. Close the toolbar and Console history reads with focused tests while keeping unsupported modes hidden.

### `Environment-3 / Phase 1`

- [x] Browser click selects the environment light
- [x] Browser click does not auto-open Viewer Transform
- [x] selected target state remains object-like for later commands
- [x] `Environment-3-HLG-1. Selecting Environment Lights Should Not Surprise-Open Viewer Transform`

### `Environment-3 / Phase 2`

- [x] Console offers explicit `ViewTransform` and `Move` for selected lights
- [x] positional lights open the existing environment-light transform shell
- [x] non-positional lights warn cleanly
- [x] `Environment-3-HLG-2. Console Should Offer Explicit ViewTransform And Move For Movable Lights`

### `Environment-3 / Phase 3`

- [x] Browser double-click frames the selected light
- [x] Browser double-click opens or focuses Environment settings for that light
- [x] single-click remains selection-only
- [x] `Environment-3-HLG-3. Double-Clicking A Light Should Zoom To It And Open Its Light Settings`

### `Environment-3 / Phase 4`

- [x] selected lights resolve through `ZoomObject` and `ZO`
- [x] direct selected-target `zoom` can frame selected object-like targets
- [x] selected lights resolve through `Shift+Z`
- [x] `Environment-3-HLG-4. Console And Shift+Z Should Treat Selected Lights Like Object Targets For Zoom`

### `Environment-3 / Phase 5`

- [x] disabled light helper geometry is hidden or removed
- [x] disabled light helpers are not pickable
- [x] Browser rows remain available so off lights can be turned back on
- [x] `Environment-3-HLG-5. Disabled Lights Should Not Leave Active Viewport Markers Behind`

### `Environment-3 / Phase 6`

- [x] add `transformHistoryByEnvironmentLightId` to the workspace transform state
- [x] add `historyScrubIndex` to active environment-light transform sessions
- [x] normalize current light history when a positional light opens its transform shell
- [x] preserve the light's current position as the history baseline
- [x] `Environment-3-HLG-6. Movable Lights Should Have Real Viewer Transform History`

### `Environment-3 / Phase 7`

- [x] convert environment-light move commits from direct-only position writes into translate history insertion
- [x] keep committed history translate-only
- [x] sync the latest history-derived position back to `LightSpec.position`
- [x] keep non-positional light movement blocked
- [x] `Environment-3-HLG-6. Movable Lights Should Have Real Viewer Transform History`

### `Environment-3 / Phase 8`

- [x] wire active light-history scrub changes
- [x] wire reset, delete latest, delta edit, lock, and merge for environment-light history
- [x] keep rotate, scale, snap, timeline, and camera-lock operations unavailable for lights
- [x] `Environment-3-HLG-6. Movable Lights Should Have Real Viewer Transform History`

### `Environment-3 / Phase 9`

- [x] include environment-light transform history in Viewer Transform edit-history snapshots
- [x] restore light history and `LightSpec.position` on undo
- [x] restore light history and `LightSpec.position` on redo
- [x] keep undo/redo target labels light-specific
- [x] `Environment-3-HLG-6. Movable Lights Should Have Real Viewer Transform History`

### `Environment-3 / Phase 10`

- [x] show light transform history rows in the Viewer Transform toolbar
- [x] expose Console `DeleteLatest` or equivalent only when light history exists
- [x] keep toolbar sections limited to Move for environment-light targets
- [x] add focused tests across store, toolbar, Console, and viewer behavior
- [x] close Environment-3 docs after verification
- [x] `Environment-3-HLG-6. Movable Lights Should Have Real Viewer Transform History`

## [x] `Environment-3 / Phase 1` - `Browser Selection Without Auto Transform`

### Phase 1 Summary

#### Purpose

Preserve calm Browser selection for environment lights so clicking Key, Fill, Rim, or custom light rows does not surprise-open Viewer Transform.

#### Owns

- Browser row click behavior
- environment-light selected-target identity
- separation between selection and explicit transform entry

#### Does Not Own

- Console transform command routing
- double-click behavior
- transform history

#### Current Live Read

This follow-up behavior has been fixed: Browser selection should select the light and leave Viewer Transform closed until the user explicitly asks for it.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Completed fix:
1. Keep Browser environment-light row click as selection-only.
2. Prevent the Browser selection path from calling Viewer Transform entry.
3. Preserve selected-target state for later Console and shortcut commands.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- Browser selection tests near the panel controller

#### No-Widening Rule

- do not reintroduce automatic Viewer Transform entry on Browser click

#### Done Shape

`Phase 1` is done when single-click selection is calm and explicit transform entry is a separate action.

## [x] `Environment-3 / Phase 2` - `Console Explicit Transform Entry`

### Phase 2 Summary

#### Purpose

Let Console offer object-style transform entry for selected environment lights while honoring the positional-light rule.

#### Owns

- Console `ViewTransform` and `Move` discovery for selected lights
- positional-light transform-shell entry
- clean warnings for non-positional lights

#### Does Not Own

- transform history rows
- toolbar history operations
- fake movement for `hemisphere` lights

#### Current Live Read

This follow-up behavior has been fixed: Console can offer explicit transform entry for selected environment lights, and only positional light types should open the transform shell.

### Phase 2 Implementation Spec

#### Exact First Code Cut

Completed fix:
1. Add selected environment-light routing to Console transform choices.
2. Open the environment-light transform shell for `directional`, `point`, and `spot`.
3. Warn cleanly for `hemisphere` and other non-positional lights.

#### Likely Files

- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/consoleReferenceContentCommands.ts`
- focused Console tests

#### No-Widening Rule

- do not make non-positional lights movable

#### Done Shape

`Phase 2` is done when Console has explicit selected-light transform entry and honest non-positional warnings.

## [x] `Environment-3 / Phase 3` - `Double-Click Zoom And Settings Focus`

### Phase 3 Summary

#### Purpose

Make double-clicking an environment-light Browser row perform both expected actions: frame the light as an object and open its light settings as a light.

#### Owns

- Browser double-click routing
- frame-to-light behavior
- Environment toolbar selected-light settings focus

#### Does Not Own

- single-click settings focus
- automatic Viewer Transform entry
- new light controls

#### Current Live Read

This follow-up behavior has been fixed or routed: double-click should frame the light and focus that light's settings, while single-click remains selection-only.

### Phase 3 Implementation Spec

#### Exact First Code Cut

Completed fix:
1. Route Browser environment-light double-click to frame the light.
2. Route the Environment toolbar to the selected light's settings.
3. Keep click and double-click behavior distinct.

#### Likely Files

- `src/app/panels/browserInteractions.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/components/ViewToolbar.tsx`
- focused Browser and toolbar tests

#### No-Widening Rule

- do not make double-click enter Viewer Transform automatically

#### Done Shape

`Phase 3` is done when double-clicking a light consistently frames it and shows its settings.

## [x] `Environment-3 / Phase 4` - `ZoomObject And Shift+Z Selected-Light Routing`

### Phase 4 Summary

#### Purpose

Make selected environment lights work with selected-object zoom language across Console and keyboard shortcuts.

#### Owns

- direct selected-target `zoom`
- `ZoomObject` and `ZO`
- `Shift+Z` zoom-to-selected
- mixed selected-target bounds where light targets participate

#### Does Not Own

- new camera controls
- transform history
- disabled helper framing

#### Current Live Read

This follow-up behavior has been fixed or routed: selected environment lights should zoom like object-like targets from Console and `Shift+Z`.

### Phase 4 Implementation Spec

#### Exact First Code Cut

Completed fix:
1. Add selected environment-light support to the zoom-object resolver.
2. Route Console `ZoomObject`, `ZO`, and direct selected-target zoom through that resolver.
3. Reuse the resolver for `Shift+Z`.

#### Likely Files

- `src/app/zoomObjectTarget.ts`
- `src/app/useViewerCameraShortcuts.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/stagedNavigation.ts`
- focused Console and shortcut tests

#### No-Widening Rule

- do not frame disabled helpers as active targets

#### Done Shape

`Phase 4` is done when selected environment lights zoom like selected objects across Console and keyboard routing.

## [x] `Environment-3 / Phase 5` - `Disabled Light Helper Visibility`

### Phase 5 Summary

#### Purpose

Stop disabled lights from leaving misleading viewport helper geometry or pick targets while preserving Browser rows for turning lights back on.

#### Owns

- disabled helper visibility
- disabled helper pickability
- Browser row availability for off lights

#### Does Not Own

- deleting disabled lights
- changing light intensity semantics
- hiding Browser rows

#### Current Live Read

This follow-up behavior has been fixed or routed: off lights should not leave active viewport markers behind.

### Phase 5 Implementation Spec

#### Exact First Code Cut

Completed fix:
1. Hide or omit helper geometry for disabled lights.
2. Keep disabled helpers out of picking.
3. Preserve Browser rows for disabled lights.

#### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- Browser tests only if row state changes

#### No-Widening Rule

- do not delete light state when a light is disabled

#### Done Shape

`Phase 5` is done when off lights no longer leave active viewport markers behind.

## [x] `Environment-3 / Phase 6` - `Light Transform History State And Baseline`

### Phase 6 Summary

#### Purpose

Add the minimal state shape needed for environment lights to own translate-only Viewer Transform history.

#### Owns

- environment-light transform-history map
- active environment-light transform session scrub index
- baseline position handling when a shell opens

#### Does Not Own

- committing move entries
- toolbar history rows
- edit-history undo/redo

#### Current Live Read

Environment-light sessions now include `historyScrubIndex`, and workspace transform state includes `transformHistoryByEnvironmentLightId` plus a baseline map so positional lights open against their current position.

### Phase 6 Implementation Spec

#### Exact First Code Cut

1. Add `transformHistoryByEnvironmentLightId` to the workspace transform state.
2. Add `historyScrubIndex` to `ActiveEnvironmentLightTransformSession`.
3. Initialize positional-light shells with normalized history and the latest scrub index.
4. Preserve the selected light's current position as the initial transform baseline.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

#### No-Widening Rule

- do not wire commit/history operations yet
- do not touch non-positional light behavior except for existing gating

#### Implementation Risks

- using the default transform origin would move existing lights unexpectedly
- the baseline must preserve current light position before any history entries exist

#### Checklist

- [x] workspace state includes `transformHistoryByEnvironmentLightId`
- [x] active light transform sessions include `historyScrubIndex`
- [x] shell creation preserves current light position as baseline
- [x] focused store tests cover shell state

#### Verification Shape

Run focused store tests for environment-light shell creation.

#### Done Shape

`Phase 6` is done when a positional light can open a transform shell with real history state but without changing behavior yet.

## [x] `Environment-3 / Phase 7` - `Light Move Commit History Entries`

### Phase 7 Summary

#### Purpose

Make positional-light move commits insert translate-only history entries and sync the history-derived position back to light state.

#### Owns

- translate-only history insertion on light move commit
- history-derived `LightSpec.position` sync
- no-op move detection

#### Does Not Own

- history editing operations
- edit-history undo/redo
- toolbar history display

#### Current Live Read

Light move commits now insert translate-only history entries and sync the history-derived position back to `LightSpec.position`.

### Phase 7 Implementation Spec

#### Exact First Code Cut

1. Update `commitActiveEnvironmentLightTransformEntry` to use the shared transform-history insertion helpers.
2. Limit inserted entries to `move` / translate history.
3. Sync the latest history-derived position to `LightSpec.position`.
4. Preserve clean warnings for non-positional lights.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

#### No-Widening Rule

- do not add rotate, scale, snap, or timeline behavior
- do not expose toolbar history rows until the commit path is proven

#### Implementation Risks

- commit can duplicate no-op entries if the previous position is not compared correctly
- light state and history state can drift if only one side updates

#### Checklist

- [x] light move commits insert translate history
- [x] no-op commits do not create extra entries
- [x] committed history updates `LightSpec.position`
- [x] non-positional lights remain blocked

#### Verification Shape

Run focused store tests for positional and non-positional light commits.

#### Done Shape

`Phase 7` is done when moving a positional light creates real translate history and updates the light position from that history.

## [x] `Environment-3 / Phase 8` - `Light History Operations`

### Phase 8 Summary

#### Purpose

Wire the normal Viewer Transform history operations for environment-light targets.

#### Owns

- scrub
- reset
- delete latest or delete entry
- delta edit
- lock
- merge

#### Does Not Own

- global edit-history undo/redo snapshots
- toolbar layout changes
- Console choice polish

#### Current Live Read

Generic Viewer Transform history operations now route environment-light targets through translate-only light history operations.

### Phase 8 Implementation Spec

#### Exact First Code Cut

1. Add light-specific branches for active scrub changes.
2. Add light-specific reset, delete, delta edit, lock, and merge operations.
3. Ensure every operation syncs the resulting history position to `LightSpec.position`.
4. Keep unsupported transform modes unavailable.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

#### No-Widening Rule

- do not add snap, timeline, camera-lock, rotate, or scale behavior for light targets

#### Implementation Risks

- scrub preview and actual light state can become inconsistent
- reset needs to return to the correct baseline, not the world origin unless that was the true starting position

#### Checklist

- [x] scrub updates active draft and light position
- [x] reset clears light history safely
- [x] delete/delta/lock/merge work for light history
- [x] unsupported operations stay hidden or no-op

#### Verification Shape

Run focused store tests for each light-history operation.

#### Done Shape

`Phase 8` is done when environment-light history can be edited like translate-only object history.

## [x] `Environment-3 / Phase 9` - `Light Transform Edit-History Undo Redo`

### Phase 9 Summary

#### Purpose

Make app-level Viewer Transform undo/redo restore both light transform history and actual light position.

#### Owns

- Viewer Transform snapshot support for environment-light targets
- undo restore for light history and `LightSpec.position`
- redo restore for light history and `LightSpec.position`
- target labels for light transform history entries

#### Does Not Own

- the visible toolbar history list
- Console `DeleteLatest` choices
- broad edit-history redesign

#### Current Live Read

The generic Viewer Transform commit wrapper now captures environment-light before/after snapshots and restores both light history and `LightSpec.position` on undo and redo.

### Phase 9 Implementation Spec

#### Exact First Code Cut

1. Include environment-light targets in Viewer Transform history snapshots.
2. Capture before/after light history and position state.
3. Restore both history entries and `LightSpec.position` on undo/redo.
4. Add focused edit-history tests.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/viewerTransformEditHistoryStore.test.ts`
- `src/app/store/useAppStore.test.ts`

#### No-Widening Rule

- do not change unrelated edit-history entry contracts
- do not persist private light history outside the existing workspace state shape

#### Implementation Risks

- undo/redo can restore history without moving the light, or move the light without restoring history
- snapshot equality must include light history and position

#### Checklist

- [x] light Viewer Transform commits create app-level undo/redo entries
- [x] undo restores light history and position
- [x] redo restores light history and position
- [x] no-op light commits do not create app-level entries

#### Verification Shape

Run focused edit-history store tests for light transform undo/redo.

#### Done Shape

`Phase 9` is done when app-level undo/redo treats light transform commits as real Viewer Transform edits.

## [x] `Environment-3 / Phase 10` - `Light History UI Console And Closeout`

### Phase 10 Summary

#### Purpose

Expose the completed translate-only light transform history through the toolbar and Console without overexposing unsupported modes.

#### Owns

- toolbar transform-history rows for active environment-light targets
- Console `DeleteLatest` or equivalent when light history exists
- Move-only toolbar surface for lights
- focused cross-surface verification
- Environment-3 closeout docs

#### Does Not Own

- rotate, scale, snap, timeline, or camera-lock support
- new light settings controls
- broad Environment-2 grade cleanup

#### Current Live Read

The toolbar keeps environment-light targets Move-only while reading active light history rows, and Console exposes `DeleteLatest` only after light history exists.

### Phase 10 Implementation Spec

#### Exact First Code Cut

1. Return environment-light history from the active Viewer Transform history selector.
2. Keep visible transform sections limited to Move for light targets.
3. Expose Console history choices only when light history exists.
4. Add focused toolbar, Console, and viewer tests.
5. Update the Environment index and Doc Log after verification.

#### Likely Files

- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewerHost.tsx`
- focused tests near those files
- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not expose unsupported light transform modes
- do not make non-positional lights look movable

#### Implementation Risks

- toolbar controls may assume reference/object targets for history editing
- Console choices can overpromise history operations before entries exist

#### Checklist

- [x] toolbar shows light move history rows
- [x] toolbar remains Move-only for light targets
- [x] Console exposes light history choices only when appropriate
- [x] focused cross-surface tests pass
- [x] Environment-3 docs are closed honestly after implementation

#### Verification Shape

Run focused store, toolbar, Console, ViewerHost, and viewer tests touched by the light-history path.

#### Done Shape

`Phase 10` is done when movable environment lights have visible, tested, translate-only Viewer Transform history across store, toolbar, Console, and undo/redo behavior.

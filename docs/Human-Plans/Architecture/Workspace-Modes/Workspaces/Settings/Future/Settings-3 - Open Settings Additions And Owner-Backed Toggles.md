# Settings 3 - Open Settings Additions And Owner-Backed Toggles

## Doc Header

### Doc History
12. 2026-05-11 17:46:18: Implemented and closed `Settings-3 / Phase 5 - Shortcut Priority Hardening And Handoff` by adding focused routing regression coverage for Console-first capture, Shortcuts-first `C`, editable, fly, sketch, sketch-plane, reference, staged Console, and edit-history owners, while recording the handoff to later key-binding visibility and rebinding work.
11. 2026-05-11 17:42:13: Prepped `Settings-3 / Phase 5 - Shortcut Priority Hardening And Handoff` for implementation against the post-Phase-4 routing shape, focused final regression targets, existing full-ConsoleDock failure boundary, editable/fly/sketch/reference/staged owner preservation, and the handoff from the first Console input-priority setting to later key-binding visibility work.
10. 2026-05-11 17:35:50: Implemented and closed `Settings-3 / Phase 4 - Input Priority Routing` by routing the persisted Console input-priority mode through `inputRouting`, `useConsoleInteraction`, and viewer camera shortcuts, preserving Console-first printable capture plus `Shift+Z`, adding Shortcuts-first plain `Z` Zoom Object and `C` Console entry without seeding text, and proving docked/floating plus popout Console focus behavior.
9. 2026-05-11 17:27:37: Prepped `Settings-3 / Phase 4 - Input Priority Routing` for implementation against the live `useConsoleInteraction`, `inputRouting`, `cameraShortcuts`, `inputRouting.test`, and Console keydown paths, tightening the route from persisted mode to Console capture gating, Shortcuts-first `C` entry, Console-first `Shift+Z`, Shortcuts-first plain `Z`, and docked/floating plus popout parity.
8. 2026-05-11 17:21:55: Implemented and closed `Settings-3 / Phase 3 - Settings Console Input Priority Control` by adding the General-section Console-first input-priority toggle, All/General read row projection, history-backed Settings mutation helper, focused Settings tests, and no-keyboard-routing boundary.
7. 2026-05-11 17:16:24: Prepped `Settings-3 / Phase 3 - Settings Console Input Priority Control` for implementation against the live `SettingsSurface` workspace section, `uiPreferenceEditHistory` helper pattern, persisted `consoleInputPriorityMode` store seam, and focused Settings render/mutation tests while preserving the no-routing boundary for Phase 4.
6. 2026-05-11 16:56:10: Implemented and closed `Settings-3 / Phase 2 - Console Input Priority Preference Contract` by adding the persisted `consoleInputPriorityMode` preference with `console-first` default, `shortcuts-first` support, focused store and persistence bridge coverage, and build verification while leaving Settings UI and keyboard routing unchanged.
5. 2026-05-11 16:47:28: Corrected the Console typing-capture preference plan into a Console-first versus Shortcuts-first input-priority mode, where Console-first keeps plain letters typing into Console and routes letter shortcuts through `Shift+letter`, while Shortcuts-first lets plain letters trigger shortcuts and uses `C` as the deliberate Console entry key.
4. 2026-05-11 16:34:12: Prepped `Settings-3 / Phase 2 - Console Capture Preference Contract` for implementation against the live `uiPrefsStore`, `uiPrefsPersistence`, `useUiPrefsPersistenceBridge`, and focused preference tests, naming the semantic capture-mode value, legacy default behavior, persistence hydration/serialization seam, and no-routing/no-UI boundary.
3. 2026-05-10 14:02:14: Implemented and closed `Settings-3 / Phase 1 - Console Capture Owner Audit` as a documentation-only audit, recording the verified automatic capture route, the proposed preference read seam, the proposed manual `C` owner split between shared routing and Console focus side effects, and the focused follow-on test targets for Phases 2 through 5.
2. 2026-05-10 13:58:29: Prepped `Settings-3 / Phase 1 - Console Capture Owner Audit` for implementation by grounding the audit against the live viewport activation, Console global keydown, shared input-routing, viewer camera shortcut, and viewer-local keyboard seams, while locking the phase as documentation-only with no runtime behavior changes.
1. 2026-05-10 13:52:11: Created this `Settings-3` family phase doc as the open lane for one-by-one owner-backed Settings additions, with the first implementation ladder focused on Console typing-capture mode so automatic command typing can be separated from manual `C` Console entry and future letter shortcuts.

### Purpose

This doc owns the open `Settings-3` family phase for focused Settings additions that are small enough to implement one by one.

Use it to answer:
- how miscellaneous user-requested Settings controls should be phased
- how each setting stays owner-backed instead of becoming Settings-owned
- how the first Console input-priority toggle should be implemented
- how the input-priority mode should choose between Console-first typing and Shortcuts-first letter shortcuts

Do not use it for:
- full shortcut rebinding, shortcut profiles, or conflict resolution
- changing shortcut semantics without naming the real input owner
- bundling unrelated Settings controls into one broad implementation pass
- turning Settings into the source of truth for Console, viewport, Browser, or workspace behavior

## Doc Body

### Short Version

`Settings-3` is an open lane for small owner-backed Settings additions.

The first concrete setting is Console input priority:
- `Console First` keeps the current fast behavior where printable keys can enter the Console after workspace interaction.
- In Console-first mode, letter shortcuts use `Shift+letter`, such as `Shift+Z` for `Zoom object` when an object is selected.
- `Shortcuts First` lets ordinary letters go to shortcuts first, such as `Z` for `Zoom object`.
- In Shortcuts-first mode, the user deliberately enters the Console with `C`, then types freely.

The first implementation ladder should stay narrow:
1. map the current Console auto-capture and viewport activation path
2. add one owner-backed preference contract
3. add the visible Settings control
4. route Console-first versus Shortcuts-first keyboard priority
5. harden priority, editable-field, and future key-bindings boundaries

Important planning rule:
- Settings projects and changes the preference, but the Console/input-routing owner decides what the preference means at runtime

### Scope

This phase owns:
- the open `Settings-3` lane for small Settings additions
- the first Console input-priority mode setting
- the Settings projection for that setting
- the runtime routing behavior needed to honor Console-first versus Shortcuts-first priority
- focused proof that plain letters become shortcuts only in Shortcuts-first mode

This phase does not own:
- full key-binding editing
- a complete shortcut conflict resolver
- replacing the `Settings-2` shortcut reference lane
- changing camera, transform, sketch, or viewport shortcut behavior beyond respecting the new Console input-priority preference
- unrelated Settings controls that should become later `Settings-3` phases

### Current Planning Read

The live app currently allows broad Console printable-key capture.

The healthy future read is:
- the user can choose whether plain letters prefer Console command typing or shortcut commands
- Console-first mode preserves the existing fast command feel
- Console-first mode uses `Shift+letter` for letter shortcuts, such as `Shift+Z`
- Shortcuts-first mode lets plain letters such as `Z` go to shortcut routing
- `C` becomes the deliberate Console-entry key while Shortcuts-first mode is active
- direct clicks into the Console input still work in both modes
- text fields and editable controls keep native keyboard ownership
- higher-priority shortcuts still beat Console capture

### Ownership Boundary

The Console/input-routing path owns runtime interpretation.

Settings may:
- expose the mode
- write the preference
- show clear labels and current state

Settings must not:
- duplicate routing logic in the Settings UI
- invent a second command-capture owner
- decide shortcut priority locally
- hide the fact that future key-bindings work belongs to `Settings-2` or a later rebinding family

## Vision

`Settings-3` belongs to `Settings` Generation 1.

This family phase exists so user-requested Settings controls can be added without waiting for one giant settings rebuild.

What must stay true:
- Settings stays a real workspace surface with a left rail and right pane
- each setting names its real owner
- one small Settings request can become one small implementation phase
- Console input priority and shortcut routing become easier to reason about before later key-binding work expands

## Wishlist Organization

### High Level Goals

- [ ] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [ ] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [ ] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [ ] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`
- [ ] `Settings-Gen1-HLG-8. Settings should provide a safe lane for small user-requested controls that can be implemented one by one without losing owner boundaries.`

### Codex Level Goals

- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.
- [ ] Settings-Gen1-CLG-7. Add an open `Settings-3` family lane for small owner-backed Settings controls, beginning with the Console input-priority mode toggle.

### `Settings-3 / Phase 1`

- [x] Audit the live Console auto-capture path from viewport activation through global key routing.
- [x] Identify the exact owner seam where capture eligibility should read a preference.
- [x] Record current priority rules for editable fields, viewer camera shortcuts, fly mode, staged Console prompts, and sketch/reference tool owners.
- [x] Stop before adding UI or changing runtime behavior.
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-8`
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-7.

### `Settings-3 / Phase 2`

- [x] Add one owner-backed preference for Console input-priority mode.
- [x] Use explicit values for Console-first and Shortcuts-first priority.
- [x] Preserve the current default behavior unless the user changes the preference.
- [x] Add focused preference-store coverage before wiring UI behavior.
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-8`
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-7.

### `Settings-3 / Phase 3`

- [x] Add the visible Settings control for Console input priority.
- [x] Place the control in the existing Settings shell without creating a new owner.
- [x] Use user-facing labels that distinguish Console-first typing from Shortcuts-first commands.
- [x] Keep the right-pane control compact and owner-backed.
- [x] `Settings-Gen1-HLG-2`
- [x] `Settings-Gen1-HLG-3`
- [x] `Settings-Gen1-HLG-5`
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-8`
- [x] Settings-Gen1-CLG-2.
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-5.
- [x] Settings-Gen1-CLG-7.

### `Settings-3 / Phase 4`

- [x] Route Console-first mode through the existing printable-key Console capture behavior.
- [x] In Console-first mode, reserve `Shift+letter` for letter shortcuts such as `Shift+Z`.
- [x] In Shortcuts-first mode, prevent ordinary printable keys from auto-focusing and seeding the Console after viewport interaction.
- [x] In Shortcuts-first mode, use `C` as the deliberate Console entry key when no higher-priority owner claims it.
- [x] Keep direct Console input focus and explicit Console clicks working in both modes.
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-8`
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-7.

### `Settings-3 / Phase 5`

- [x] Harden shortcut priority so Console-first and Shortcuts-first behavior does not steal camera, transform, sketch, fly, editable-field, or future key-binding paths.
- [x] Add focused tests for Console-first plain typing, Console-first `Shift+letter` shortcuts, Shortcuts-first plain-letter shortcuts, Shortcuts-first `C` entry, editable targets, staged prompts, and shortcut-priority cases.
- [x] Record the handoff to `Settings-2` or later key-binding work so freed letters can become visible shortcuts later.
- [x] `Settings-Gen1-HLG-5`
- [x] `Settings-Gen1-HLG-6`
- [x] `Settings-Gen1-HLG-8`
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-5.
- [x] Settings-Gen1-CLG-7.

## [x] `Settings-3 / Phase 1` - `Console Capture Owner Audit`

### Phase 1 Summary

Map the live Console typing-capture route before adding an input-priority preference or UI.

This phase should make the current behavior explicit enough that later implementation does not accidentally conflate viewport activation, Console context handoff, and text capture.

### Phase 1 Implementation Spec

#### Purpose

Identify the real owner seam for Console input-priority eligibility.

This phase should leave the next code-changing phase with a verified answer to:
- where the current automatic printable-key capture is enabled
- where a future preference should be read
- which owner should interpret Shortcuts-first `C` entry and Console-first `Shift+letter` shortcut routing
- which tests should prove later behavior changes

#### Owns

- current behavior audit
- routing owner map
- priority and exception notes
- first likely implementation file list
- follow-on test target list for Phases 2 through 5

#### Does Not Own

- preference creation
- Settings UI
- runtime behavior changes
- key-binding or rebinding UI

#### Current Live Read

The current behavior appears to flow through:
- viewport pointer activation
- active viewer surface state
- Console workspace context handoff
- global Console keydown handling
- shared keyboard-routing decision
- Console input focus plus seeded first character

Verified live anchors for the audit:
- `src/app/workspace/ViewportWorkspaceHost.tsx`
  - `onPointerDownCapture` calls `onActivateViewerSurface(viewportId)` for model viewport surfaces.
- `src/app/hosts/useAppShellSurfaceActivation.ts`
  - `handleActivateViewerSurface(...)` sets active viewer state, marks the active surface as `viewer`, and sends a root Console workspace handoff.
- `src/app/console/useConsoleInteraction.ts`
  - `routeConsoleGlobalKey(...)` currently passes `allowFlatConsoleCapture: true` into the shared router.
  - the main window `keydown` capture listener focuses the Console and calls `seedInputText(event.key)` when routing returns `flat-console` or `staged-console`.
  - popout Console handling has a parallel capture path that must be audited before Phase 4 changes behavior.
- `src/app/inputRouting.ts`
  - `routeKeyboardInput(...)` gives editable targets, fly mode, undo/redo, Escape/Enter/Delete, reference selection, reference transform, and viewer camera shortcuts priority before flat Console capture.
  - printable capture is currently the final broad fallback when `allowFlatConsoleCapture` is true.
- `src/app/useViewerCameraShortcuts.ts`
  - active-viewer camera shortcuts use the same shared routing seam and should keep priority over Console capture.
- `src/viewer/Viewer.ts`
  - viewer-local keyboard handling still exists for fly mode, transform gizmo mode/space, frame selected, and frame all; Phase 1 should note any overlap that affects later `C` entry routing.

Phase 1 should confirm these anchors against the live code and update this doc with any drift before the preference is added.

### Phase 1 Audit Result

Phase 1 is complete as a documentation-only audit.

Verified automatic capture route:
- `ViewportWorkspaceHost.tsx` activates the model viewport on pointer-down capture.
- `useAppShellSurfaceActivation.ts` handles that activation by setting the active viewer viewport, setting active surface to `viewer`, and requesting a root Console workspace context handoff.
- `useConsoleInteraction.ts` owns the global Console keydown listener for the docked/floating Console and has a parallel popout listener.
- `useConsoleInteraction.ts` calls `routeConsoleGlobalKey(...)`, which currently passes `allowFlatConsoleCapture: true` into `routeKeyboardInput(...)`.
- `inputRouting.ts` resolves ordinary printable keys as `flat-console` or `staged-console` after higher-priority owners decline the key.
- `useConsoleInteraction.ts` then focuses the Console input, primes sketch-draw staged root when needed, and calls `seedInputText(event.key)`.

Proposed preference read location:
- Phase 2 should add a semantic Console input-priority preference in the existing UI preference owner area.
- Phase 4 should read that preference in `useConsoleInteraction.ts` inside `routeConsoleGlobalKey(...)`, because this is where the Console has access to app, workspace, spaghetti, and Console state before calling the shared router.
- `routeKeyboardInput(...)` should receive a more expressive Console capture mode or eligibility input instead of only depending on the current broad `allowFlatConsoleCapture` boolean.

Proposed input-priority ownership:
- `inputRouting.ts` should own the pure decision: when Shortcuts-first mode is active and no higher-priority owner claims the key, `C` can resolve to an explicit Console-entry owner/action.
- `inputRouting.ts` should also own the pure decision that Console-first mode may route letter shortcuts through `Shift+letter` while plain letters still fall through to Console capture.
- `useConsoleInteraction.ts` should own the side effect: focus the current Console input without seeding the typed `c`.
- Settings should not own either decision or side effect; it only edits the preference.

Priority rules to preserve:
- editable targets stay native before Console capture
- viewer fly movement remains outside Console capture
- undo/redo, Escape, Enter, Delete, reference hide/recover, reference transform, sketch plane, sketch draw, and active-viewer camera shortcuts keep their current priority
- active-viewer camera shortcuts remain ahead of flat Console capture
- popout Console keydown behavior must remain equivalent to docked/floating behavior
- viewer-local `Viewer.ts` keyboard handling still owns fly, transform gizmo mode/space, frame selected, and frame all; Phase 4 should avoid stealing keys from those paths when they are higher priority

Follow-on test targets:
- Phase 2: focused `uiPrefsStore` default and mutation coverage for the capture mode value
- Phase 3: focused Settings surface render/mutation coverage for the visible Console capture control
- Phase 4: `inputRouting.test.ts` coverage for Console-first plain typing, Console-first `Shift+letter` shortcut routing, Shortcuts-first plain-letter shortcut routing, Shortcuts-first `C` entry, editable targets, and active-viewer camera shortcut priority
- Phase 4: focused `ConsoleDock` or `useConsoleInteraction` coverage proving Shortcuts-first `C` focuses the Console without seeding `c`
- Phase 4: popout parity coverage if the implementation touches `handlePopoutKeyDown`
- Phase 5: final regression matrix covering staged prompts, sketch/reference owners, fly mode, camera shortcuts, editable fields, and key-binding handoff notes

#### First Pass Decisions

1. Treat viewport activation as separate from Console text-entry intent.
2. Keep Console staged/prompt behavior visible but do not change it yet.
3. Preserve the current priority order until the preference phase deliberately changes capture eligibility.
4. Record where tests should land for later phases.
5. Treat `useConsoleInteraction.ts` plus `inputRouting.ts` as the likely runtime owner seam for the future preference.
6. Treat Settings as a projection surface only; do not move routing decisions into Settings UI files.
7. Treat the popout Console listener as a required parity check before Phase 4.

#### Exact First Code Cut

This is a planning and audit slice.

The first implementation pass should:
- inspect the live input-routing and Console interaction files
- add notes to this doc describing the verified owner seam
- update this phase checklist and Doc History
- stop before runtime changes

The audit should write a short `### Phase 1 Audit Result` section under this phase with:
- verified automatic capture route
- proposed preference read location
- proposed Console-first and Shortcuts-first input-priority owner
- tests to add in Phases 2 through 5
- any open risks for popout, staged prompts, or viewer-local shortcuts

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
- `src/app/inputRouting.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/hosts/useAppShellSurfaceActivation.ts`
- `src/app/useViewerCameraShortcuts.ts`
- `src/viewer/Viewer.ts`
- this future doc

#### No-Widening Rule

- do not change behavior in this phase
- do not add the Settings UI yet
- do not add a key-binding registry
- do not change camera, transform, sketch, or viewport shortcut priority
- do not add the Console input-priority preference yet
- do not reserve or consume `C` or `Shift+letter` yet
- do not mark the broader `Settings-3` family complete

#### Implementation Risks

- Console capture currently shares logic with staged prompts, flat command capture, and sketch draw assist
- the `C` key and `Shift+letter` shortcuts may already mean something in a future mode, so the routing rule must respect higher-priority owners
- changing capture too early can create subtle command-entry regressions
- docked/floating Console and popout Console key listeners may need parallel changes in Phase 4
- `allowFlatConsoleCapture` is currently a broad router flag, so Phase 2 or Phase 4 may need a more expressive capture-mode input instead of only toggling a boolean
- viewer-local keyboard listeners outside `useConsoleInteraction.ts` may still consume or ignore keys in ways the input-priority mode must respect

#### Checklist

- [x] verify the live viewport activation path
- [x] verify the live global Console keydown path
- [x] verify the shared input-routing owner order
- [x] identify the exact seam where the preference should be read
- [x] record follow-on test targets for Phases 2 through 5
- [x] audit the popout Console keydown path for parity
- [x] audit viewer-local key handlers for possible `C` conflicts
- [x] add `### Phase 1 Audit Result` with the final implementation handoff
- [x] update `docs/Doc-Log.md` when the audit result is recorded

#### Verification Shape

- documentation-only proof in this phase
- no runtime tests required unless code is touched unexpectedly
- if code is touched unexpectedly, run the smallest focused input-routing or Console test that covers that touched file

Phase 1 verification result:
- no source code changed
- no runtime tests were required

## [x] `Settings-3 / Phase 2` - `Console Input Priority Preference Contract`

### Phase 2 Summary

Add the owner-backed preference that describes Console input-priority mode.

This phase should create the durable value before Settings UI or input-routing behavior depends on it.

### Phase 2 Implementation Spec

#### Purpose

Create one typed preference for Console-first versus Shortcuts-first input priority.

#### Owns

- preference type and default
- persistence/store integration
- focused preference tests
- naming and value contract for later phases

#### Does Not Own

- visible Settings control
- global key routing behavior
- `C` Console-entry behavior
- `Shift+letter` shortcut behavior
- shortcut rebinding

#### Current Live Read

The current Console-first behavior should remain the default.

The live preference owner is `src/app/store/uiPrefsStore.ts`.

The implementation should add a semantic mode near the other workspace/input-facing UI preferences:
- exported type: `ConsoleInputPriorityMode`
- exported default: `DEFAULT_CONSOLE_INPUT_PRIORITY_MODE`
- state field: `consoleInputPriorityMode`
- setter: `setConsoleInputPriorityMode(...)`

The first values should be:
- `console-first`
- `shortcuts-first`

The persisted preference owner is `src/app/store/uiPrefsPersistence.ts`.

That persistence seam currently normalizes individual workspace/UI preferences, serializes a versioned snapshot, and hydrates them through `src/app/store/useUiPrefsPersistenceBridge.ts`.

Phase 2 should thread the new field through that same path:
- legacy or missing saved values normalize to `console-first`
- invalid saved values normalize to `console-first`
- saved `shortcuts-first` values round-trip through serialization and hydration
- existing persisted preference snapshots should keep working without migration prompts

Phase 2 should not make `shortcuts-first`, `C`, or `Shift+letter` do anything at runtime yet.

The value is only a durable contract for Phases 3 and 4.

#### First Pass Decisions

1. Preserve Console-first typing as the default to avoid surprising existing users.
2. Store a semantic mode, not a loose boolean, so later input-priority variants can grow cleanly.
3. Keep the preference in the existing UI/settings preference owner area.
4. Persist the value beside the other `uiPrefs` workspace preferences instead of hiding it in Console-local state.
5. Normalize unknown values back to `console-first` so older or hand-edited local storage cannot break startup.
6. Leave `allowFlatConsoleCapture` and every input-routing behavior unchanged until Phase 4.

#### Exact First Code Cut

The implementation pass should:
- add the typed preference, default, state field, and setter in `uiPrefsStore`
- add persistence normalization, serialization, and hydration for the field
- keep `console-first` as the initial store value and legacy persistence fallback
- add focused store tests for default and mutation behavior
- add focused persistence/bridge tests for missing, invalid, and `shortcuts-first` values
- update the phase doc and changelog because runtime preference schema changed

#### Likely Files

- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsStore.test.ts`
- `src/app/store/uiPrefsPersistence.ts`
- `src/app/store/useUiPrefsPersistenceBridge.ts`
- `src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not change key routing yet
- do not add Settings UI yet
- do not add rebinding or shortcut conflict logic
- do not read this preference from `useConsoleInteraction.ts` yet
- do not change `routeKeyboardInput(...)` or `allowFlatConsoleCapture` yet
- do not reserve or consume `C` or `Shift+letter` yet

#### Implementation Risks

- existing persisted preference migration rules may require a compatibility default
- naming the preference too narrowly could make later input-priority variants awkward
- adding the value only to `uiPrefsStore` without persistence would make the Phase 3 Settings control look durable while resetting on reload
- adding routing reads in Phase 2 would blur this contract slice with Phase 4 behavior

#### Checklist

- [x] add Console input-priority mode preference
- [x] keep Console-first capture as the default
- [x] normalize missing and invalid persisted values to `console-first`
- [x] persist and hydrate `shortcuts-first`
- [x] add focused store/default/mutation coverage
- [x] add focused persistence bridge coverage
- [x] update runtime tracking docs

#### Verification Shape

- `npm test -- src/app/store/uiPrefsStore.test.ts src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- typecheck or build if TypeScript exports or persistence call sites require broader proof

#### Done Shape

Phase 2 is done when:
- `useUiPrefsStore.getInitialState().consoleInputPriorityMode` is `console-first`
- the setter can switch to `shortcuts-first` and back to `console-first`
- persisted missing or invalid values hydrate as `console-first`
- persisted `shortcuts-first` values hydrate and re-serialize unchanged
- no Settings UI exists yet for the value
- no Console/input-routing behavior changes yet

Phase 2 implementation result:
- `src/app/store/uiPrefsStore.ts` now owns `ConsoleInputPriorityMode`, `DEFAULT_CONSOLE_INPUT_PRIORITY_MODE`, `consoleInputPriorityMode`, and `setConsoleInputPriorityMode(...)`.
- `src/app/store/uiPrefsPersistence.ts` now serializes, normalizes, and hydrates the preference, using `console-first` for missing or invalid saved values.
- `src/app/store/useUiPrefsPersistenceBridge.ts` now carries the preference through hydration and live persistence writes.
- Focused tests cover store default/mutation behavior and persistence bridge round-trips for `console-first` and `shortcuts-first`.
- No Settings control, input routing, `C`, or `Shift+letter` behavior changed in this phase.

Phase 2 verification result:
- `npm.cmd test -- src/app/store/uiPrefsStore.test.ts src/app/store/useUiPrefsPersistenceBridge.test.tsx`
- `npm.cmd run build`

## [x] `Settings-3 / Phase 3` - `Settings Console Input Priority Control`

### Phase 3 Summary

Project the Console input-priority preference into the Settings workspace.

This phase should add the visible control without changing runtime key behavior yet.

### Phase 3 Implementation Spec

#### Purpose

Let users see and change the Console input-priority mode from Settings.

#### Owns

- Settings control placement
- labels and descriptions
- Settings read/write projection to the real preference owner
- focused Settings UI tests

#### Does Not Own

- key routing behavior
- shortcut rebinding
- broad Settings section redesign

#### Current Live Read

The Settings shell already owns the section rail and right-pane projection.

The live Settings surface is `src/app/workspace/SettingsSurface.tsx`.

Current relevant shape:
- `SettingsSectionId` has `all`, `general`, `workspace`, `viewport`, `spaghettiEditor`, `browser`, and `storage`.
- `buildSettingsRows(...)` projects read-only row cards into the `All` and section panes.
- the `Workspace` section already owns editable controls for workspace shell preferences through an editor panel.
- editable UI preference changes use helpers from `src/app/store/uiPreferenceEditHistory.ts` so undo/redo receives stable `ui-pref:*` target ids.

Phase 3 should add the visible Console input-priority control to the existing Settings surface without waiting for a new `Input` or `Console` section.

First placement:
- put the control in the `General` section, because the current section registry has no `Input` or `Console` section and the setting affects global input priority.
- add a read row for the current mode so `All` and `General` both show the current value.
- add the editable control when rendering the `General` section, using the same right-pane editor-panel pattern as existing Settings controls.
- keep the row copy short and concrete:
  - `Console first`: plain letters type into Console; shortcuts use `Shift+letter`.
  - `Shortcuts first`: plain letters trigger shortcuts; press `C` to type in Console.

The existing `SettingsSurface.test.tsx` already covers:
- all-first section rail rendering
- section routing
- editable Settings controls

Phase 3 should extend those tests instead of adding broad app-shell coverage.

#### First Pass Decisions

1. Prefer a segmented control or compact toggle with two modes.
2. Use plain labels:
   - `Console first`
   - `Shortcuts first`
3. Keep explanatory text short and user-facing.
4. Do not imply key rebinding exists yet.
5. Make the examples concrete: Console-first means `Shift+Z` for Zoom object, Shortcuts-first means `Z` for Zoom object and `C` to enter Console.
6. Reuse `uiPreferenceEditHistory.ts` for a `setConsoleInputPriorityModeWithHistory(...)` helper instead of calling the store directly from the UI.
7. Keep the setting under `General` for this phase; a later settings-organization pass can split out a dedicated `Input` or `Console` section if the surface grows.

#### Exact First Code Cut

The implementation pass should:
- add a `formatConsoleInputPriorityMode(...)` helper for row display
- add `consoleInputPriorityMode` to the `buildSettingsRows(...)` inputs
- add a `console-input-priority` Settings row in the `General` section
- read `consoleInputPriorityMode` from `useUiPrefsStore(...)` inside `SettingsSurface`
- add `setConsoleInputPriorityModeWithHistory(...)` to `uiPreferenceEditHistory.ts`
- render one compact two-choice control in the `General` section, using `Console first` and `Shortcuts first` labels
- wire the control through the history helper
- prove the visible state and mutation with focused Settings tests
- update docs tracking

#### Likely Files

- `src/app/workspace/SettingsSurface.tsx`
- `src/app/workspace/SettingsSurface.test.tsx`
- `src/app/store/uiPreferenceEditHistory.ts`
- `src/app/store/uiPrefsStore.ts`
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not change global key behavior in this phase
- do not create a new Settings owner store
- do not add the full Key Bindings page here
- do not add a new Settings rail section unless the existing section shape makes General unusable
- do not add or consume `C`, `Z`, or `Shift+Z` behavior
- do not add shortcut inventory or rebinding semantics

#### Implementation Risks

- the right Settings section may already be overloaded, so placement should follow existing section ownership
- too much explanatory copy could make the setting feel like a docs panel instead of a control
- skipping the history helper would make this Settings edit less consistent than neighboring owner-backed UI preferences
- adding a brand-new `Input` section now could widen the phase into Settings organization work

#### Checklist

- [x] add the visible Console input-priority control
- [x] wire the control to the real preference owner
- [x] prove changing the control updates the preference
- [x] route the UI mutation through a `uiPreferenceEditHistory` helper
- [x] show the current mode in the `All` / `General` read rows
- [x] keep labels concise and future-key-binding-friendly

#### Verification Shape

- `npm.cmd test -- src/app/workspace/SettingsSurface.test.tsx src/app/store/uiPrefsStore.test.ts`
- build if Settings exports, store exports, or edit-history helpers change

#### Done Shape

Phase 3 is done when:
- Settings shows the current Console input-priority mode in `All` and `General`
- the visible control can switch between `Console first` and `Shortcuts first`
- changing the control updates `useUiPrefsStore.getState().consoleInputPriorityMode`
- the change routes through `uiPreferenceEditHistory.ts`
- focused Settings tests prove render and mutation behavior
- no keyboard routing behavior changes yet

Phase 3 implementation result:
- `src/app/workspace/SettingsSurface.tsx` now shows `Console input priority` in the `All` and `General` read rows and renders a compact General-section toggle where on means `Console first` and off means `Shortcuts first`.
- `src/app/store/uiPreferenceEditHistory.ts` now owns `setConsoleInputPriorityModeWithHistory(...)` with stable target id `ui-pref:consoleInputPriorityMode`.
- `src/app/workspace/SettingsSurface.test.tsx` proves the All/General projection, toggle mutation, store update, and undoable history entry.
- No keyboard routing, `C` Console entry, `Z`, or `Shift+Z` behavior changed in this phase.

Phase 3 verification result:
- `npm.cmd test -- src/app/workspace/SettingsSurface.test.tsx src/app/store/uiPrefsStore.test.ts`

## [x] `Settings-3 / Phase 4` - `Input Priority Routing`

### Phase 4 Summary

Honor the Console input-priority preference in global input routing.

This phase should make Console-first mode keep ordinary printable-key Console capture while routing letter shortcuts through `Shift+letter`, and make Shortcuts-first mode route plain letters to shortcuts while using `C` as the deliberate Console-entry key.

### Phase 4 Implementation Spec

#### Purpose

Separate Console command typing from viewport/tool shortcut letters according to the selected input-priority mode.

#### Owns

- routing through the new preference
- Console-first `Shift+letter` shortcut behavior
- Shortcuts-first plain-letter shortcut behavior
- Shortcuts-first `C` Console entry behavior
- preservation of Console-first plain typing behavior
- focused key-routing tests

#### Does Not Own

- visible Settings control
- shortcut rebinding
- broad shortcut inventory rendering

#### Current Live Read

Console-first mode should behave like the current app for plain typing:
- printable keys can focus and seed the Console when no higher-priority owner claims them
- letter shortcuts should use `Shift+letter`, such as `Shift+Z` for `Zoom object` when an object is selected

Shortcuts-first mode should behave differently:
- printable letters should route to shortcuts first, such as `Z` for `Zoom object`
- ordinary printable letters should not auto-seed the Console
- `C` should focus or arm the Console when no higher-priority owner claims it
- after Console focus, normal input should remain native to the input element

Live implementation anchors as of Phase 4 prep:
- `src/app/console/useConsoleInteraction.ts`
  - `routeConsoleGlobalKey(...)` reads current app, Console, Spaghetti, reference, viewer, and edit-history state before calling `routeKeyboardInput(...)`.
  - it currently always passes `allowFlatConsoleCapture: true`.
  - the docked/floating `window` keydown listener focuses the main Console and seeds `event.key` when routing returns `flat-console` or `staged-console`.
  - the popout keydown listener repeats the same routing and seed path against the popout Console input.
- `src/app/inputRouting.ts`
  - editable targets, fly movement, edit history, Escape/Enter/Delete owners, reference owners, staged Console arrows, sketch/reference transform locals, and viewer camera shortcuts all run before flat Console capture.
  - printable Console capture is currently the final fallback when `allowFlatConsoleCapture` is true.
  - there is not yet a route owner for deliberate Shortcuts-first Console entry.
- `src/app/cameraShortcuts.ts`
  - `Zoom Object` is currently declared as `KeyZ` with `shiftKey: true`.
  - Phase 4 should make shortcut resolution mode-aware so Console-first keeps `Shift+Z` while Shortcuts-first can claim plain `Z`.
- `src/app/inputRouting.test.ts`
  - existing tests already prove editable target priority, fly priority, active-viewer camera shortcuts before Console capture, staged capture, and flat capture.
  - Phase 4 should extend these tests rather than creating a broad integration-only proof.

#### First Pass Decisions

1. Read `useUiPrefsStore.getState().consoleInputPriorityMode` inside `routeConsoleGlobalKey(...)` and pass the semantic mode into `routeKeyboardInput(...)`.
2. Replace the broad routing meaning of `allowFlatConsoleCapture` with an explicit Console input-priority input; keep a compatibility shim only if needed for smaller call-site churn.
3. Keep editable targets native before every Console-entry or shortcut-owner decision.
4. Keep current higher-priority owners ahead of Shortcuts-first `C` Console entry and ahead of shifted/plain letter shortcut routing.
5. Make viewer camera shortcut resolution mode-aware, not globally changed: `Shift+Z` remains the Zoom Object proof in Console-first, and plain `Z` becomes the Zoom Object proof in Shortcuts-first.
6. Add an explicit routing owner/action for Shortcuts-first `C` Console entry so `useConsoleInteraction.ts` can focus the Console without seeding `c`.
7. Preserve staged prompt submit/cancel and arrow behavior before changing any staged prompt semantics; only printable capture and deliberate `C` entry should change in this phase.
8. Apply equivalent handling to the docked/floating and popout listeners in the same implementation pass.

#### Exact First Code Cut

The implementation pass should:
- add a `ConsoleInputPriorityMode` routing input to `routeKeyboardInput(...)`
- read the persisted preference in `routeConsoleGlobalKey(...)`
- gate flat printable Console capture so `console-first` preserves current capture and `shortcuts-first` suppresses ordinary printable auto-seeding
- keep staged submit, staged cancel, staged arrows, sketch draw undo/redo, and direct Console input focus behavior intact
- make the camera shortcut resolver support the Zoom Object proof in both modes:
  - `console-first`: `Shift+Z`
  - `shortcuts-first`: `Z`
- add the Shortcuts-first `C` Console-entry route and handle it in docked/floating and popout listeners by focusing the Console without calling `seedInputText('c')`
- add focused input-routing tests for both modes and priority rules
- add focused Console interaction coverage proving Shortcuts-first `C` focuses without seeding `c`
- update runtime tracking docs

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
- `src/app/inputRouting.ts`
- `src/app/inputRouting.test.ts`
- `src/app/cameraShortcuts.ts`
- `src/app/cameraShortcuts.test.ts` if shortcut resolution grows enough to deserve direct coverage
- `src/app/console/ConsoleDock.test.tsx` or equivalent Console interaction coverage
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not add new viewport shortcuts beyond the first existing shortcut proof needed to verify input priority, such as `Zoom object`
- do not implement key rebinding
- do not change staged Console command semantics beyond what is required for the preference
- do not move the Settings control or add a new Settings section
- do not make `C` enter Console in Console-first mode
- do not make plain letters seed the Console in Shortcuts-first mode

#### Implementation Risks

- `C` and `Shift+letter` can collide with future tool-local shortcuts if routing priority is too broad
- staged Console sessions may need special handling so command choices still feel intentional
- capture behavior may differ between docked, floating, and popout Console modes
- changing the camera shortcut resolver globally could accidentally remove the existing `Shift+Z` affordance in Console-first mode
- suppressing printable capture too broadly could break sketch draw assist or staged command entry if staged/direct Console focus is not separated from flat auto-capture

#### Checklist

- [x] preserve Console-first printable capture
- [x] route Console-first letter shortcuts through `Shift+letter`
- [x] route Shortcuts-first plain letters to shortcuts
- [x] suppress ordinary printable Console capture in Shortcuts-first mode
- [x] focus or arm Console with `C` in Shortcuts-first mode
- [x] keep editable fields native
- [x] keep higher-priority shortcuts ahead of Console-entry and shifted-shortcut routing

#### Verification Shape

- `npm.cmd test -- src/app/inputRouting.test.ts`
- focused `ConsoleDock` or equivalent Console interaction tests for Shortcuts-first `C` focus-without-seed
- focused camera shortcut resolver coverage if `cameraShortcuts.ts` grows mode-aware behavior outside `inputRouting.test.ts`
- popout parity coverage if the implementation touches `handlePopoutKeyDown`
- `npm.cmd run build` because shared routing exports and Console interaction code are likely to change

#### Done Shape

Phase 4 is done when:
- Console-first mode still auto-captures ordinary printable keys into Console when no higher-priority owner claims them
- Console-first mode keeps Zoom Object on `Shift+Z`
- Shortcuts-first mode suppresses ordinary printable Console auto-capture
- Shortcuts-first mode routes plain `Z` to Zoom Object when viewer camera shortcuts own the active viewer
- Shortcuts-first mode focuses the Console with `C` without seeding `c`
- docked/floating and popout Console keydown paths handle Shortcuts-first `C` equivalently
- editable targets remain native

Phase 4 implementation result:
- `src/app/inputRouting.ts` now accepts `consoleInputPriorityMode`, returns a `console-entry` owner for Shortcuts-first `C`, gates flat printable Console capture to Console-first mode, and resolves viewer camera shortcuts with the active input-priority mode.
- `src/app/cameraShortcuts.ts` now resolves Zoom Object as `Shift+Z` in Console-first mode and plain `Z` in Shortcuts-first mode while leaving numpad view shortcuts unchanged.
- `src/app/useViewerCameraShortcuts.ts` now passes the persisted input-priority mode into shared routing and shortcut resolution.
- `src/app/console/useConsoleInteraction.ts` now reads the persisted input-priority mode and focuses the main or popout Console for `console-entry` without seeding text.
- Focused tests prove routing decisions, Shortcuts-first plain `Z`, docked/floating Shortcuts-first `C`, popout Shortcuts-first `C`, and Shortcuts-first printable suppression.

Phase 4 verification result:
- `npm.cmd test -- src/app/inputRouting.test.ts src/app/useViewerCameraShortcuts.test.tsx`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "input priority is Shortcuts first"`
- `npm.cmd run build`

Known verification note:
- A full `npm.cmd test -- src/app/console/ConsoleDock.test.tsx` run currently reports unrelated staged-navigation/reference-flow failures outside the focused Phase 4 assertions. The new Phase 4 Console assertions pass when run directly.

## [x] `Settings-3 / Phase 5` - `Shortcut Priority Hardening And Handoff`

### Phase 5 Summary

Harden the new Console input-priority mode against shortcut drift and record the follow-on handoff for future key-binding work.

This phase should close the first `Settings-3` setting cleanly without adding new shortcut families.

### Phase 5 Implementation Spec

#### Purpose

Make the first Console input-priority setting robust enough that later shortcut work can build on it.

#### Owns

- final priority tests
- documentation of input-priority behavior
- handoff notes for later `Settings-2` or rebinding work
- closeout checklist for the Console input-priority setting

#### Does Not Own

- adding new letter shortcuts beyond the first proof needed by Phase 4
- rendering the full Key Bindings section
- key-binding editing or conflict resolution
- unrelated `Settings-3` controls

#### Current Live Read

Once Shortcuts-first mode works, ordinary letters can become candidate shortcuts later.

Console-first mode should keep those same shortcuts available through `Shift+letter` without immediately requiring a full rebinding system.

Phase 4 shipped the first behavior slice:
- `routeKeyboardInput(...)` accepts `consoleInputPriorityMode`.
- `console-entry` is the pure routing owner for Shortcuts-first `C` when Console capture is explicitly enabled.
- flat printable Console capture only occurs in Console-first mode.
- Zoom Object resolves as `Shift+Z` in Console-first mode and plain `Z` in Shortcuts-first mode.
- docked/floating and popout Console paths focus Console on Shortcuts-first `C` without seeding text.

Phase 5 should harden around this actual shape instead of adding another feature.

The best first proof is still `src/app/inputRouting.test.ts`, because it is pure and already owns the priority matrix.

The Console interaction proof should stay focused:
- keep the targeted `ConsoleDock` Shortcuts-first assertions
- avoid trying to make the entire `ConsoleDock.test.tsx` file the Phase 5 gate while it has unrelated staged-navigation/reference-flow failures recorded during Phase 4
- only expand Console tests if a missing side-effect proof is directly related to input priority

#### First Pass Decisions

1. Treat Phase 5 as a hardening and documentation closeout, not as another routing feature pass.
2. Add missing pure routing assertions before adding heavier React integration tests.
3. Prove `allowFlatConsoleCapture` still gates `console-entry`, so non-Console callers of `routeKeyboardInput(...)` cannot accidentally turn `C` into Console focus.
4. Prove editable targets, fly mode, sketch draw, sketch plane, reference transform, staged Console submit/cancel/arrow owners, and edit-history shortcuts keep priority where they already had it.
5. Keep `C` as the Shortcuts-first Console entry affordance until key-binding work provides a broader remap model.
6. Record the handoff to `Settings-2` / later key-binding work so the next shortcut UI knows:
   - plain-letter shortcuts are legal only in Shortcuts-first contexts unless a higher-priority owner claims them
   - shifted-letter shortcuts remain the Console-first affordance
   - `C` is reserved as Shortcuts-first Console entry until rebinding exists

#### Exact First Code Cut

The implementation pass should:
- add any missing focused `inputRouting.test.ts` regression cases for:
  - Console-first printable capture
  - Console-first `Shift+Z`
  - Shortcuts-first printable suppression
  - Shortcuts-first plain `Z`
  - Shortcuts-first `C`
  - Shortcuts-first `C` ignored when Console capture is not enabled
  - editable target priority
  - fly mode priority for its movement keys
  - sketch draw / sketch plane / reference transform / staged Console priority for their existing owners
- keep or extend the targeted `ConsoleDock` Shortcuts-first assertions only for actual focus-without-seed behavior
- update this doc with the implemented result
- mark the first Console input-priority setting complete only when Console-first, Shortcuts-first, shifted-shortcut, Console-entry, editable-owner, and higher-priority-owner behavior is proven
- add a handoff note for later key-binding visibility and rebinding work

#### Likely Files

- focused tests around `src/app/inputRouting.test.ts`
- targeted `src/app/console/ConsoleDock.test.tsx` only if more focus-without-seed proof is needed
- `src/app/useViewerCameraShortcuts.test.tsx` only if the plain/shifted Zoom Object proof needs one more integration assertion
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not add new shortcut commands
- do not change the Phase 4 runtime routing unless a hardening test exposes a real defect
- do not widen into full `ConsoleDock.test.tsx` staged-navigation/reference-flow repair
- do not move the Settings control
- do not create a Key Bindings UI
- do not start rebinding UI
- do not close broader `Settings-3` just because Phase 1 through Phase 5 landed

#### Implementation Risks

- a passing input-priority happy path is not enough if editable fields or camera shortcuts regress
- future shortcut work may need a clearer visible inventory entry after the behavior lands
- using the full `ConsoleDock.test.tsx` suite as the only gate could bury Phase 5 signal under unrelated existing failures
- adding new shortcuts during hardening would confuse the first input-priority setting with later key-binding work
- letting non-Console route callers trigger `console-entry` would make `C` unexpectedly global

#### Checklist

- [x] prove Console-first mode still captures printable Console input
- [x] prove Console-first `Shift+letter` shortcuts work
- [x] prove Shortcuts-first mode does not auto-capture ordinary printable keys
- [x] prove Shortcuts-first plain-letter shortcuts work
- [x] prove Shortcuts-first `C` entry works
- [x] prove editable fields keep native input
- [x] prove higher-priority shortcuts still win
- [x] record the key-binding handoff

#### Verification Shape

- `npm.cmd test -- src/app/inputRouting.test.ts src/app/useViewerCameraShortcuts.test.tsx`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "input priority is Shortcuts first"` if the targeted Console assertions remain the side-effect proof
- build only if source or exported routing behavior changes
- if only docs change, no runtime tests are required

#### Phase 5 Implementation Result

Phase 5 is complete as a hardening and handoff pass.

Implemented proof:
- `src/app/inputRouting.test.ts` now includes additional regression coverage proving Console-first `C` remains ordinary Console capture, Shortcuts-first `C` only works as an unmodified deliberate Console-entry key when Console capture is enabled, edit-history shortcuts keep priority, fly movement keys keep viewer ownership, sketch draw and sketch-plane local owners still win, reference transform/selection owners still win, and staged Console submit/cancel/recall owners still win.
- Existing Phase 4 tests continue to prove Console-first `Shift+Z`, Shortcuts-first plain `Z`, Shortcuts-first printable suppression, and docked/floating plus popout Console focus-without-seed behavior.
- No runtime routing changes were needed.

Key-binding handoff:
- `Settings-2` or later key-binding work should treat plain-letter shortcuts as legal only in Shortcuts-first contexts unless a higher-priority owner claims the key.
- Console-first should continue to expose letter shortcuts through `Shift+letter` until a broader rebinding model exists.
- `C` remains reserved as the Shortcuts-first Console-entry affordance until key-binding visibility or rebinding work deliberately replaces it.
- Future shortcut inventory UI should show the mode-specific distinction instead of flattening `Z` and `Shift+Z` into one context-free shortcut.

#### Phase 5 Verification Result

- `npm.cmd test -- src/app/inputRouting.test.ts src/app/useViewerCameraShortcuts.test.tsx`
- `npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "input priority is Shortcuts first"`

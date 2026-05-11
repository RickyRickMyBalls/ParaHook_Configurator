# Settings 3 - Open Settings Additions And Owner-Backed Toggles

## Doc Header

### Doc History
3. 2026-05-10 14:02:14: Implemented and closed `Settings-3 / Phase 1 - Console Capture Owner Audit` as a documentation-only audit, recording the verified automatic capture route, the proposed preference read seam, the proposed manual `C` owner split between shared routing and Console focus side effects, and the focused follow-on test targets for Phases 2 through 5.
2. 2026-05-10 13:58:29: Prepped `Settings-3 / Phase 1 - Console Capture Owner Audit` for implementation by grounding the audit against the live viewport activation, Console global keydown, shared input-routing, viewer camera shortcut, and viewer-local keyboard seams, while locking the phase as documentation-only with no runtime behavior changes.
1. 2026-05-10 13:52:11: Created this `Settings-3` family phase doc as the open lane for one-by-one owner-backed Settings additions, with the first implementation ladder focused on Console typing-capture mode so automatic command typing can be separated from manual `C` Console entry and future letter shortcuts.

### Purpose

This doc owns the open `Settings-3` family phase for focused Settings additions that are small enough to implement one by one.

Use it to answer:
- how miscellaneous user-requested Settings controls should be phased
- how each setting stays owner-backed instead of becoming Settings-owned
- how the first Console typing-capture toggle should be implemented
- how the manual Console-entry mode should free normal letters for shortcuts

Do not use it for:
- full shortcut rebinding, shortcut profiles, or conflict resolution
- changing shortcut semantics without naming the real input owner
- bundling unrelated Settings controls into one broad implementation pass
- turning Settings into the source of truth for Console, viewport, Browser, or workspace behavior

## Doc Body

### Short Version

`Settings-3` is an open lane for small owner-backed Settings additions.

The first concrete setting is Console typing capture:
- `Auto-Capture Typing` keeps the current fast behavior where printable keys can enter the Console after workspace interaction.
- `Manual Console Entry` stops ordinary letters from jumping into the Console.
- In manual mode, the user deliberately enters the Console with `C`, then types freely.
- This frees more normal letters for viewport, tool, and later key-binding shortcuts.

The first implementation ladder should stay narrow:
1. map the current Console auto-capture and viewport activation path
2. add one owner-backed preference contract
3. add the visible Settings control
4. route manual `C` Console entry and suppress automatic printable capture
5. harden priority, editable-field, and future key-bindings boundaries

Important planning rule:
- Settings projects and changes the preference, but the Console/input-routing owner decides what the preference means at runtime

### Scope

This phase owns:
- the open `Settings-3` lane for small Settings additions
- the first Console typing-capture mode setting
- the Settings projection for that setting
- the runtime routing behavior needed to honor automatic versus manual Console entry
- focused proof that normal letters become available for shortcuts in manual mode

This phase does not own:
- full key-binding editing
- a complete shortcut conflict resolver
- replacing the `Settings-2` shortcut reference lane
- changing camera, transform, sketch, or viewport shortcut behavior beyond respecting the new Console capture preference
- unrelated Settings controls that should become later `Settings-3` phases

### Current Planning Read

The live app currently allows broad Console printable-key capture.

The healthy future read is:
- the user can choose whether typing after viewport interaction enters the Console
- automatic mode preserves the existing fast command feel
- manual mode keeps viewport activation separate from Console text entry
- `C` becomes the deliberate Console-entry key while manual mode is active
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
- Console typing capture and shortcut routing become easier to reason about before later key-binding work expands

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
- [ ] Settings-Gen1-CLG-7. Add an open `Settings-3` family lane for small owner-backed Settings controls, beginning with the Console typing-capture mode toggle.

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

- [ ] Add one owner-backed preference for Console typing-capture mode.
- [ ] Use explicit values for automatic capture and manual Console entry.
- [ ] Preserve the current default behavior unless the user changes the preference.
- [ ] Add focused preference-store coverage before wiring UI behavior.
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-8`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-7.

### `Settings-3 / Phase 3`

- [ ] Add the visible Settings control for Console typing capture.
- [ ] Place the control in the existing Settings shell without creating a new owner.
- [ ] Use user-facing labels that distinguish automatic command typing from manual Console entry.
- [ ] Keep the right-pane control compact and owner-backed.
- [ ] `Settings-Gen1-HLG-2`
- [ ] `Settings-Gen1-HLG-3`
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-8`
- [ ] Settings-Gen1-CLG-2.
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-7.

### `Settings-3 / Phase 4`

- [ ] Route automatic mode through the existing printable-key Console capture behavior.
- [ ] In manual mode, prevent ordinary printable keys from auto-focusing and seeding the Console after viewport interaction.
- [ ] In manual mode, use `C` as the deliberate Console entry key when no higher-priority owner claims it.
- [ ] Keep direct Console input focus and explicit Console clicks working in both modes.
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-8`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-7.

### `Settings-3 / Phase 5`

- [ ] Harden shortcut priority so manual Console entry does not steal camera, transform, sketch, fly, editable-field, or future key-binding paths.
- [ ] Add focused tests for auto mode, manual mode, `C` entry, editable targets, staged prompts, and shortcut-priority cases.
- [ ] Record the handoff to `Settings-2` or later key-binding work so freed letters can become visible shortcuts later.
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-8`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-7.

## [x] `Settings-3 / Phase 1` - `Console Capture Owner Audit`

### Phase 1 Summary

Map the live Console typing-capture route before adding a preference or UI.

This phase should make the current behavior explicit enough that later implementation does not accidentally conflate viewport activation, Console context handoff, and text capture.

### Phase 1 Implementation Spec

#### Purpose

Identify the real owner seam for Console typing-capture eligibility.

This phase should leave the next code-changing phase with a verified answer to:
- where the current automatic printable-key capture is enabled
- where a future preference should be read
- which owner should interpret `manual-c-key`
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
- Phase 2 should add a semantic Console typing-capture preference in the existing UI preference owner area.
- Phase 4 should read that preference in `useConsoleInteraction.ts` inside `routeConsoleGlobalKey(...)`, because this is where the Console has access to app, workspace, spaghetti, and Console state before calling the shared router.
- `routeKeyboardInput(...)` should receive a more expressive Console capture mode or eligibility input instead of only depending on the current broad `allowFlatConsoleCapture` boolean.

Proposed `manual-c-key` ownership:
- `inputRouting.ts` should own the pure decision: when manual mode is active and no higher-priority owner claims the key, `C` can resolve to an explicit Console-entry owner/action.
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
- Phase 4: `inputRouting.test.ts` coverage for auto capture, manual ordinary-key ignore, manual `C` entry, editable targets, and active-viewer camera shortcut priority
- Phase 4: focused `ConsoleDock` or `useConsoleInteraction` coverage proving manual `C` focuses the Console without seeding `c`
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
- proposed `manual-c-key` owner
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
- do not add the Console typing-capture preference yet
- do not reserve or consume `C` yet
- do not mark the broader `Settings-3` family complete

#### Implementation Risks

- Console capture currently shares logic with staged prompts, flat command capture, and sketch draw assist
- the `C` key may already mean something in a future mode, so the entry rule must respect higher-priority owners
- changing capture too early can create subtle command-entry regressions
- docked/floating Console and popout Console key listeners may need parallel changes in Phase 4
- `allowFlatConsoleCapture` is currently a broad router flag, so Phase 2 or Phase 4 may need a more expressive capture-mode input instead of only toggling a boolean
- viewer-local keyboard listeners outside `useConsoleInteraction.ts` may still consume or ignore keys in ways the manual mode must respect

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

## [ ] `Settings-3 / Phase 2` - `Console Capture Preference Contract`

### Phase 2 Summary

Add the owner-backed preference that describes Console typing-capture mode.

This phase should create the durable value before Settings UI or input-routing behavior depends on it.

### Phase 2 Implementation Spec

#### Purpose

Create one typed preference for Console typing capture.

#### Owns

- preference type and default
- persistence/store integration
- focused preference tests
- naming and value contract for later phases

#### Does Not Own

- visible Settings control
- global key routing behavior
- `C` manual-entry behavior
- shortcut rebinding

#### Current Live Read

The current behavior should remain the default.

The likely values are:
- `auto`
- `manual-c-key`

The final names may vary if the existing preference store has a stricter naming pattern, but the behavior distinction should stay the same.

#### First Pass Decisions

1. Preserve automatic typing as the default to avoid surprising existing users.
2. Store a semantic mode, not a loose boolean, so later manual-entry variants can grow cleanly.
3. Keep the preference in the existing UI/settings preference owner area.

#### Exact First Code Cut

The implementation pass should:
- add the typed preference and default
- expose set/read helpers through the existing preference store pattern
- add focused store tests
- update the phase doc and changelog because runtime preference schema changed

#### Likely Files

- `src/app/store/uiPrefsStore.ts`
- `src/app/store/uiPrefsStore.test.ts`
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not change key routing yet
- do not add Settings UI yet
- do not add rebinding or shortcut conflict logic

#### Implementation Risks

- existing persisted preference migration rules may require a compatibility default
- naming the preference too narrowly could make later manual-entry variants awkward

#### Checklist

- [ ] add Console typing-capture mode preference
- [ ] keep automatic capture as the default
- [ ] add focused store/default coverage
- [ ] update runtime tracking docs

#### Verification Shape

- focused preference-store tests
- typecheck or build if the preference store has broad consumers

## [ ] `Settings-3 / Phase 3` - `Settings Console Capture Control`

### Phase 3 Summary

Project the Console typing-capture preference into the Settings workspace.

This phase should add the visible control without changing runtime key behavior yet.

### Phase 3 Implementation Spec

#### Purpose

Let users see and change the Console typing-capture mode from Settings.

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

This control likely belongs under a Console or Input-oriented Settings area, depending on the current section registry shape at implementation time.

#### First Pass Decisions

1. Prefer a segmented control or compact toggle with two modes.
2. Use plain labels:
   - `Type anywhere to Console`
   - `Press C to type in Console`
3. Keep explanatory text short and user-facing.
4. Do not imply key rebinding exists yet.

#### Exact First Code Cut

The implementation pass should:
- add the control to the existing Settings projection path
- wire it to the preference from Phase 2
- prove the visible state and mutation with focused tests
- update docs tracking

#### Likely Files

- Settings workspace section/content files under `src/app/workspace/`
- `src/app/store/uiPrefsStore.ts`
- focused Settings tests
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not change global key behavior in this phase
- do not create a new Settings owner store
- do not add the full Key Bindings page here

#### Implementation Risks

- the right Settings section may already be overloaded, so placement should follow existing section ownership
- too much explanatory copy could make the setting feel like a docs panel instead of a control

#### Checklist

- [ ] add the visible Console typing-capture control
- [ ] wire the control to the real preference owner
- [ ] prove changing the control updates the preference
- [ ] keep labels concise and future-key-binding-friendly

#### Verification Shape

- focused Settings render/mutation tests
- build if component exports or Settings registries change

## [ ] `Settings-3 / Phase 4` - `Manual Console Entry Routing`

### Phase 4 Summary

Honor the Console typing-capture preference in global input routing.

This phase should make manual mode stop automatic printable-key Console capture and use `C` as the deliberate Console-entry key.

### Phase 4 Implementation Spec

#### Purpose

Separate ordinary viewport/tool shortcut letters from Console text entry when manual mode is active.

#### Owns

- routing through the new preference
- manual `C` Console entry behavior
- preservation of automatic mode behavior
- focused key-routing tests

#### Does Not Own

- visible Settings control
- shortcut rebinding
- new viewport/tool shortcuts that use the freed letters

#### Current Live Read

Automatic mode should behave like the current app:
- printable keys can focus and seed the Console when no higher-priority owner claims them

Manual mode should behave differently:
- printable keys should not auto-seed the Console
- `C` should focus or arm the Console when no higher-priority owner claims it
- after Console focus, normal input should remain native to the input element

#### First Pass Decisions

1. Read the preference from the Console/input-routing owner path.
2. Keep editable targets native.
3. Let higher-priority owners claim keys before `C` Console entry.
4. Preserve staged prompt submit/cancel behavior unless the phase audit finds a narrower rule is needed.

#### Exact First Code Cut

The implementation pass should:
- gate flat printable Console capture by the preference
- add the manual `C` entry route
- keep automatic mode unchanged
- add focused tests for both modes and priority rules
- update runtime tracking docs

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
- `src/app/inputRouting.ts`
- `src/app/inputRouting.test.ts`
- `src/app/console/ConsoleDock.test.tsx` or equivalent Console interaction coverage
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not add new viewport shortcuts in this phase
- do not implement key rebinding
- do not change staged Console command semantics beyond what is required for the preference

#### Implementation Risks

- `C` can collide with future tool-local shortcuts if routing priority is too broad
- staged Console sessions may need special handling so command choices still feel intentional
- capture behavior may differ between docked, floating, and popout Console modes

#### Checklist

- [ ] preserve automatic mode printable capture
- [ ] suppress ordinary printable capture in manual mode
- [ ] focus or arm Console with `C` in manual mode
- [ ] keep editable fields native
- [ ] keep higher-priority shortcuts ahead of manual Console entry

#### Verification Shape

- focused input-routing tests
- focused Console interaction tests
- popout coverage if the implementation touches popout listeners

## [ ] `Settings-3 / Phase 5` - `Shortcut Priority Hardening And Handoff`

### Phase 5 Summary

Harden the new Console typing-capture mode against shortcut drift and record the follow-on handoff for future key-binding work.

This phase should close the first `Settings-3` setting cleanly without adding new shortcut families.

### Phase 5 Implementation Spec

#### Purpose

Make the first Console capture setting robust enough that later shortcut work can build on it.

#### Owns

- final priority tests
- documentation of freed-letter behavior
- handoff notes for later `Settings-2` or rebinding work
- closeout checklist for the Console capture setting

#### Does Not Own

- adding new letter shortcuts
- rendering the full Key Bindings section
- key-binding editing or conflict resolution
- unrelated `Settings-3` controls

#### Current Live Read

Once manual mode works, ordinary letters can become candidate shortcuts later.

This phase should make that true without immediately spending those keys.

#### First Pass Decisions

1. Test priority before adding new shortcuts.
2. Document which owner can safely consume freed letters later.
3. Keep `C` as the manual Console entry affordance until key-binding work provides a broader remap model.

#### Exact First Code Cut

The implementation pass should:
- add any missing focused regression tests
- update this doc with the implemented result
- mark the Console typing-capture phase complete only when auto/manual/manual-entry behavior is proven
- record any follow-on needed for key-binding visibility

#### Likely Files

- focused tests around `src/app/inputRouting.test.ts`
- focused Console and Settings tests touched by earlier phases
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not add new shortcuts just because manual mode frees letters
- do not start rebinding UI
- do not close broader `Settings-3` just because Phase 1 through Phase 5 landed

#### Implementation Risks

- a passing manual-mode happy path is not enough if editable fields or camera shortcuts regress
- future shortcut work may need a clearer visible inventory entry after the behavior lands

#### Checklist

- [ ] prove automatic mode still captures printable Console input
- [ ] prove manual mode does not auto-capture ordinary printable keys
- [ ] prove manual `C` entry works
- [ ] prove editable fields keep native input
- [ ] prove higher-priority shortcuts still win
- [ ] record the key-binding handoff

#### Verification Shape

- focused regression tests for the final priority matrix
- build if routing or Settings exports changed

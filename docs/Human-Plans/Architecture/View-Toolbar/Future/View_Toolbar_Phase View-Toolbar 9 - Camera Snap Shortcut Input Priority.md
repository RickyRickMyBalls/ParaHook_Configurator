# `View-Toolbar 9` - `Camera Snap Shortcut Input Priority`

## Doc Header

### Doc History
3. 2026-05-20 00:37:40: Implemented and closed `View-Toolbar 9 / Phase 1 - Priority-Aware Camera Snap Shortcuts` by making built-in camera snap shortcuts priority-aware through the base resolver and runtime preference path, preserving exact-match custom camera shortcut overrides, proving Console-first plain numpad falls back to Console capture, proving shifted Console-first and plain Shortcuts-first snaps dispatch to the active viewer, and recording focused resolver/runtime/routing/hook plus production build verification.
2. 2026-05-20 00:26:16: Prepped `View-Toolbar 9 / Phase 1 - Priority-Aware Camera Snap Shortcuts` for implementation by grounding the next code cut in the existing resolver-first path, custom preference fallback behavior, shared input-routing owner check, active-viewer hook dispatch, and focused resolver/runtime/routing/hook/inventory proof needed before plain numpad can be returned to Console in `Console first`.
1. 2026-05-20 00:15:48: Created this standalone future phase doc for `View-Toolbar 9`, grounding the camera snap shortcut priority repair in the live `cameraShortcuts`, `viewerCameraShortcutRuntime`, `inputRouting`, `useViewerCameraShortcuts`, shortcut inventory, and Console input priority seams so `Console first` can reserve plain numpad digits for Console while `Shortcuts first` keeps plain camera snaps available.

### Purpose

This doc locks the ninth `View-Toolbar` phase.

Use it to answer:
- how camera snap shortcuts should behave when `Console first` input priority is active
- how the same shortcuts should behave when `Shortcuts first` input priority is active
- which runtime and Settings shortcut inventory seams own the repair
- what must stay out of scope so this remains a small command-routing cleanup

### Why This Phase Exists

The current camera snap shortcuts are plain numpad bindings:
- `Numpad5` = `Top`
- `Numpad2` = `Front`
- `Numpad8` = `Back`
- `Numpad4` = `Left`
- `Numpad6` = `Right`

Those shortcuts currently route through the viewer camera shortcut owner before flat or staged Console printable capture. That means plain numpad input can be stolen from Console when the active surface is the viewer.

`Zoom Object` already has the intended priority-mode behavior:
- `Console first` requires a shifted shortcut
- `Shortcuts first` allows the plain shortcut

Camera snaps should follow the same user-facing rule.

### Scope

This phase covers:
- making existing camera snap shortcuts priority-aware
- requiring `Shift+Numpad2/4/5/6/8` for camera snaps when `Console first` is active
- preserving plain `Numpad2/4/5/6/8` camera snaps when `Shortcuts first` is active
- keeping plain numpad input available to Console in `Console first`
- aligning shortcut runtime tests, routing tests, hook tests, and shortcut inventory display expectations

This phase does not cover:
- adding new camera snap actions such as `Bottom`, `Iso`, `Rear`, or `Reset`
- changing pointer camera controls
- changing `Console first` versus `Shortcuts first` preference ownership
- redesigning Settings keybinding customization
- changing toolbar button behavior
- changing camera preset math or animation behavior

## Doc Body

### Goal

Make camera snap shortcuts behave like true priority-aware shortcuts.

When the user chooses `Console first`, plain numpad digits should be available to Console and camera snaps should require `Shift+Numpad`.

When the user chooses `Shortcuts first`, plain numpad digits should keep acting as camera snap shortcuts.

### Boundaries

This phase should:
- reuse the existing `consoleInputPriorityMode` setting
- keep ownership inside the existing viewer camera shortcut resolver and shared input routing seam
- keep custom shortcut conflict behavior intact
- keep `Zoom Object` behavior intact
- keep the visible View toolbar command surface unchanged

This phase should not:
- invent a separate camera-snap mode
- make Console parse camera snaps directly
- duplicate camera shortcut handling in `ConsoleDock`
- widen into missing view-jump actions
- weaken editable text-field routing

### Architecture Direction

The right architectural read is:
- `View-Toolbar` owns explicit camera/view command planning
- `Console` owns command-language capture and prompt behavior
- `Settings` projects the existing input priority and shortcut inventory
- `inputRouting` decides which owner receives a keyboard event
- `cameraShortcuts` and `viewerCameraShortcutRuntime` decide whether a specific camera shortcut is active for the current priority mode

The repair should mirror the existing `Zoom Object` priority behavior instead of creating a second rule just for numpad snaps.

### Current Live Read

Current shortcut binding owner:
- [src/app/cameraShortcuts.ts](../../../../../src/app/cameraShortcuts.ts)
  - defines plain `Numpad5`, `Numpad2`, `Numpad8`, `Numpad4`, and `Numpad6`
  - already contains priority-aware behavior for `Zoom Object`
  - now treats built-in camera preset shortcuts as priority-aware:
    - `Console first` requires shifted numpad
    - `Shortcuts first` accepts plain numpad

Current runtime owner:
- [src/app/viewerCameraShortcutRuntime.ts](../../../../../src/app/viewerCameraShortcutRuntime.ts)
  - resolves active camera shortcuts through the effective shortcut preferences
  - suppresses conflicting custom bindings
  - now lets uncustomized, conflict-free built-in camera preset rows use the priority-aware base resolver
  - still resolves explicitly customized camera preset rows by exact effective-row binding match

Current routing owner:
- [src/app/inputRouting.ts](../../../../../src/app/inputRouting.ts)
  - checks active viewer camera shortcuts before flat Console capture
  - receives `consoleInputPriorityMode`
  - now lets plain numpad fall through to Console capture in `Console first` because the active camera shortcut resolver returns `null`

Current hook owner:
- [src/app/useViewerCameraShortcuts.ts](../../../../../src/app/useViewerCameraShortcuts.ts)
  - dispatches resolved camera actions to shared camera commands for the active viewer viewport
  - should continue to prevent default only after routing has selected `viewer-camera-shortcuts` and the action resolves

Current Settings projection:
- [src/app/shortcutInventoryReadModel.ts](../../../../../src/app/shortcutInventoryReadModel.ts)
  - renders camera shortcut rows from the binding registry
  - currently formats the built-in camera preset rows as fixed `Numpad N` key chords
  - may need a small display-language adjustment if Phase 1 changes built-in runtime behavior without changing the editable binding value itself

### Acceptance Read

This phase is healthy when:
- in `Console first`, plain `Numpad2/4/5/6/8` no longer routes to `viewer-camera-shortcuts`
- in `Console first`, `Shift+Numpad2/4/5/6/8` routes to the expected camera preset action
- in `Shortcuts first`, plain `Numpad2/4/5/6/8` still routes to the expected camera preset action
- custom camera shortcut overrides still resolve only when conflict-free
- overlapping custom shortcut conflicts still leave the shortcut unclaimed
- `Zoom Object` keeps its shipped priority behavior
- tests prove resolver, routing, and active-viewer dispatch behavior

## Vision

Camera snaps should feel like real shortcuts instead of accidental Console input thieves.

The user-facing rule should be simple:
- `Console first` means type plain numbers into Console; hold `Shift` for camera snaps
- `Shortcuts first` means plain camera shortcut keys can act immediately

This keeps the `View` command family aligned with Console without moving camera behavior into the Console implementation.

## Wishlist Organization

### High Level Goals

- [x] `View-Toolbar-Gen1-HLG-1. Camera snap shortcuts should not steal plain numpad input from Console when Console first is on`
- [x] `View-Toolbar-Gen1-HLG-2. Camera snap shortcuts should still feel instant when Shortcuts first is on`
- [x] `View-Toolbar-Gen1-HLG-3. The fix should reuse the existing input priority and shortcut routing seams`

### Codex Level Goals

- [x] CLG 1. Make camera preset shortcut resolution depend on `consoleInputPriorityMode`.
- [x] CLG 2. Keep shared input routing as the owner arbitration point.
- [x] CLG 3. Keep shortcut customization and conflict handling stable.
- [x] CLG 4. Align Settings shortcut readout with the effective priority-aware camera snap behavior if the current read model exposes fixed key chords.

### `View-Toolbar 9 / Phase 1`

- [x] Require `Shift+Numpad2/4/5/6/8` for built-in camera snap shortcuts in `Console first`.
- [x] Preserve plain `Numpad2/4/5/6/8` camera snaps in `Shortcuts first`.
- [x] Keep plain numpad input available to Console capture in `Console first`.
- [x] Keep custom camera shortcut overrides conflict-safe.
- [x] Add focused resolver, routing, hook, and inventory proof.
- [x] HLG 1. `Camera snap shortcuts should not steal plain numpad input from Console when Console first is on`
- [x] HLG 2. `Camera snap shortcuts should still feel instant when Shortcuts first is on`
- [x] HLG 3. `The fix should reuse the existing input priority and shortcut routing seams`

## [x] `View-Toolbar 9 / Phase 1` - `Priority-Aware Camera Snap Shortcuts`

### Phase 1 Summary

Repair the shipped camera snap keyboard path so existing camera snap actions follow the same `Console first` versus `Shortcuts first` rule as the rest of the shortcut system.

### Phase 1 Implementation Spec

Implementation should:
- update [src/app/cameraShortcuts.ts](../../../../../src/app/cameraShortcuts.ts) first so built-in camera preset bindings resolve as:
  - `Console first`: shifted numpad only for `Numpad2`, `Numpad4`, `Numpad5`, `Numpad6`, and `Numpad8`
  - `Shortcuts first`: plain numpad only for `Numpad2`, `Numpad4`, `Numpad5`, `Numpad6`, and `Numpad8`
- keep `Zoom Object` priority behavior unchanged
- update [src/app/viewerCameraShortcutRuntime.ts](../../../../../src/app/viewerCameraShortcutRuntime.ts) so uncustomized, conflict-free camera preset rows can use the priority-aware base resolver instead of bypassing it through exact effective-row matches
- keep explicitly customized camera preset rows exact-match based unless the implementation proves the custom row is still intended to inherit the built-in priority rule
- update [src/app/inputRouting.ts](../../../../../src/app/inputRouting.ts) only if the resolver cannot express the owner decision cleanly by itself
- update [src/app/shortcutInventoryReadModel.ts](../../../../../src/app/shortcutInventoryReadModel.ts) and related tests if the visible Settings shortcut rows need priority-aware key-chord language
- update [src/app/useViewerCameraShortcuts.ts](../../../../../src/app/useViewerCameraShortcuts.ts) only if active-viewer dispatch needs no-op or prevention behavior adjusted after routing changes

Verification should include:
- [src/app/cameraShortcuts.test.ts](../../../../../src/app/cameraShortcuts.test.ts)
- [src/app/viewerCameraShortcutRuntime.test.ts](../../../../../src/app/viewerCameraShortcutRuntime.test.ts)
- [src/app/inputRouting.test.ts](../../../../../src/app/inputRouting.test.ts)
- [src/app/useViewerCameraShortcuts.test.tsx](../../../../../src/app/useViewerCameraShortcuts.test.tsx)
- shortcut inventory tests if visible Settings key-chord text changes

Recommended implementation order:
1. Add resolver tests that lock `Console first` plain numpad as `null`, `Console first` shifted numpad as the preset action, `Shortcuts first` plain numpad as the preset action, and `Shortcuts first` shifted numpad as `null`.
2. Update the base resolver in [src/app/cameraShortcuts.ts](../../../../../src/app/cameraShortcuts.ts).
3. Add runtime tests proving uncustomized built-in preset rows follow the priority rule and explicitly customized rows still honor their exact effective binding without creating conflict winners.
4. Update [src/app/viewerCameraShortcutRuntime.ts](../../../../../src/app/viewerCameraShortcutRuntime.ts) only as much as those runtime tests require.
5. Add routing tests proving `Console first` plain numpad falls to `staged-console` or `flat-console` when capture is enabled, while `Console first` shifted numpad and `Shortcuts first` plain numpad route to `viewer-camera-shortcuts`.
6. Add hook tests proving the active viewer dispatches shifted numpad in `Console first`, does not dispatch plain numpad in `Console first`, and still dispatches plain numpad in `Shortcuts first`.
7. Adjust shortcut inventory display and tests only if the current fixed `Numpad N` labels become misleading after runtime behavior changes.

Acceptance checks:
- `Console first` plus plain `Numpad4` falls through to Console capture instead of camera snap.
- `Console first` plus `Shift+Numpad4` snaps left.
- `Shortcuts first` plus plain `Numpad4` snaps left.
- `Shortcuts first` plus `Shift+Numpad4` does not double-claim the shortcut unless customization explicitly makes it valid.
- existing `Shift+Z` / plain `Z` `Zoom Object` priority behavior remains unchanged.
- conflicting custom camera shortcut bindings still resolve to no camera action.

### Phase 1 Shipped Read

Implemented:
- [src/app/cameraShortcuts.ts](../../../../../src/app/cameraShortcuts.ts)
  - built-in camera preset shortcut resolution now depends on `consoleInputPriorityMode`
  - `Console first` requires shifted numpad for camera snaps
  - `Shortcuts first` accepts plain numpad for camera snaps
- [src/app/viewerCameraShortcutRuntime.ts](../../../../../src/app/viewerCameraShortcutRuntime.ts)
  - uncustomized, conflict-free built-in camera preset rows now use the priority-aware base resolver
  - customized camera preset rows still use exact effective binding matches
- [src/app/cameraShortcuts.test.ts](../../../../../src/app/cameraShortcuts.test.ts)
  - proves resolver behavior for shifted Console-first, plain Shortcuts-first, and dormant opposite chords
- [src/app/viewerCameraShortcutRuntime.test.ts](../../../../../src/app/viewerCameraShortcutRuntime.test.ts)
  - proves runtime preference behavior for built-in, customized, and conflicting rows
- [src/app/inputRouting.test.ts](../../../../../src/app/inputRouting.test.ts)
  - proves shared owner routing for Console-first shifted snaps, Shortcuts-first plain snaps, and Console-first plain numpad fallback
- [src/app/useViewerCameraShortcuts.test.tsx](../../../../../src/app/useViewerCameraShortcuts.test.tsx)
  - proves active viewer dispatch for shifted Console-first and plain Shortcuts-first snaps
- [src/app/shortcutInventoryReadModel.ts](../../../../../src/app/shortcutInventoryReadModel.ts)
  - adds Settings inventory context text so built-in camera snap rows explain `Console first` versus `Shortcuts first` behavior while preserving editable binding values
- [src/app/shortcutInventoryReadModel.test.ts](../../../../../src/app/shortcutInventoryReadModel.test.ts)
  - proves the built-in camera preset rows expose the priority-mode context text
- [src/app/shortcutCustomPresetModel.ts](../../../../../src/app/shortcutCustomPresetModel.ts)
  - clears built-in priority context text from rows once the user customizes the binding
- [src/app/shortcutCustomPresetModel.test.ts](../../../../../src/app/shortcutCustomPresetModel.test.ts)
  - proves customized rows do not keep the built-in priority note

Verification:
- `npm.cmd test -- --run src/app/cameraShortcuts.test.ts src/app/viewerCameraShortcutRuntime.test.ts src/app/inputRouting.test.ts src/app/useViewerCameraShortcuts.test.tsx src/app/shortcutInventoryReadModel.test.ts src/app/shortcutCustomPresetModel.test.ts`
- `npm.cmd run build`

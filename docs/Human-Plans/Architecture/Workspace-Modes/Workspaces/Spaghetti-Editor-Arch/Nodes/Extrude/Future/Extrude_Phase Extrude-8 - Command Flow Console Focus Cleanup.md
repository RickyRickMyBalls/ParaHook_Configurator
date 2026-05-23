# `Extrude-8` - `Command Flow Console Focus Cleanup`

## Doc Header

### Doc History
3. 2026-05-23 18:44:41: Repaired the command-first Console-first follow-up where guided root text such as `Graph` could survive after the user typed `e`, pressed `Enter`, clicked a profile, and then tried to type a depth; the `extrude-depth` focus request now clears stale staged prompt state and the regression proof starts with `Graph` prefilled before the profile pick.
2. 2026-05-23 17:58:13: Marked all `Extrude-8` phases shipped after the runtime added a Console-owned input focus request seam, wired command-first profile picks and selected-first Extrude startup into clean focused Depth entry, added shortcut/camera numeric-input proof, and passed focused tests, TypeScript, and production build.
1. 2026-05-23 17:35:37: Added this future phase after read-only code research found that active Extrude already clears Console input when it reaches `Depth`, and already supports selected-first command start, but viewport profile clicks do not explicitly hand keyboard focus back to Console for immediate numeric depth entry.

### Purpose

Use this doc as the implementation-planning surface for straightening out active Extrude command input focus after profile selection.

The user-facing goal is:
- start Extrude from the model viewport or Console
- click one or more sketch profiles in the model viewport
- immediately type a numeric depth such as `10`, `20`, or `50`
- press `Enter`
- commit the Extrude without needing an extra manual Console click

### Scope

This phase covers:
- active Extrude command profile-pick to Console input focus handoff
- selected-profile-first Extrude command start into a clean Depth input state
- preserving the current Console-first `Shift+E` and Shortcuts-first `E` shortcut split
- protecting numeric depth entry from camera shortcut overlap while Extrude Depth owns input
- focused regression coverage for both profile-after-command and profile-before-command flows

This phase does not cover:
- changing Extrude graph/runtime geometry meaning
- changing multi-wire profile execution semantics already shipped through `Extrude-7`
- redesigning Console staged navigation
- adding new Extrude feature parameters such as taper, boolean operation, or extent modes
- changing camera shortcut bindings except where active Extrude input ownership requires a narrow guard

## Doc Body

### Summary

`Extrude-8` is a narrow command-flow cleanup phase.

The current code-backed read is:
- `src/app/spaghetti/commands/extrudeCommandSession.ts` already moves the command to `depth` when selected profiles exist
- `src/app/console/useConsoleInteraction.ts` already clears Console input when active Extrude reaches `Depth`
- `src/app/console/useConsoleInteraction.ts` already starts Extrude at `Depth` when valid viewport-selected sketch profiles exist before command start
- `src/app/inputRouting.ts` already routes Console-first `Shift+E` and Shortcuts-first plain `E` to the Extrude viewport command
- `src/app/components/ViewerHost.tsx` currently updates the live Extrude profile selection from viewport profile clicks, but does not explicitly ask Console to focus after the click
- `src/app/cameraShortcuts.ts` already makes built-in camera snap shortcuts priority-aware, but active Extrude numeric entry still needs focus/routing proof so numbers do not get stolen during Depth input

Locked recommendation:
- add one small Console-owned focus request seam instead of reaching from `ViewerHost` directly into Console input DOM
- have the active Extrude profile-pick path request Console input focus only after it has a non-empty profile selection and the session is ready for `Depth`
- keep the existing Depth input clear rule, and prove it with tests
- keep selected-first Extrude start on the same path so profile-before-command and command-before-profile feel identical
- keep input ownership routed through existing `inputRouting` and Console focus behavior instead of adding another keyboard listener

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/components/ViewerHost.tsx`
  - owns viewport profile picking and currently calls `setExtrudeCommandSelectedProfileSources(...)` while an Extrude command session is active
  - likely call site for requesting Console input focus after the session reaches `Depth`
- `src/app/console/useConsoleStore.ts`
  - owns Console input text and prompt/feature assist state
  - best place for a small `requestConsoleInputFocus(...)` style store seam
- `src/app/console/ConsoleDock.tsx`
  - owns the actual docked/floating/popout Console input refs and existing `focusMainConsoleInput(...)` / `focusPopoutConsoleInput(...)` helpers
  - should consume the focus request and focus the visible Console input
- `src/app/console/useConsoleInteraction.ts`
  - owns root Extrude command start, active Extrude submit, Depth assist descriptor sync, and input clearing
  - likely place to request focus when selected profiles already exist before Extrude starts
- `src/app/inputRouting.ts`
  - owns shortcut priority arbitration and should remain the keyboard owner gate
- `src/app/useViewerCameraShortcuts.ts`
  - owns viewer camera shortcut handling and should stay compatible with active Extrude Depth input ownership

## Vision

Extrude should feel like a CAD command, not like a two-surface juggling act.

When the user is in active Extrude and the next meaningful input is a number, ParaHook should put the keyboard where that number belongs: the Console input. That should be true whether the user starts with the shortcut and then picks profiles, or picks profiles first and then starts Extrude.

## Wishlist Organization

### High Level Goals

- [x] `Extrude-Gen1-HLG-1. After the user clicks a profile during active Extrude, their next keyboard command should go to Console so they can type a depth number.`
- [x] `Extrude-Gen1-HLG-2. If the user selects the profile first and then starts Extrude, the depth input should still be clean and fluid.`
- [x] `Extrude-Gen1-HLG-3. Console should be empty when Extrude is ready to accept a number.`
- [x] `Extrude-Gen1-HLG-4. Console-first Shift+E and Shortcuts-first E should both keep working.`
- [x] `Extrude-Gen1-HLG-5. Camera shortcuts should not overlap with Extrude numeric depth input while the command owns Depth entry.`

### Codex Level Goals

- [x] CLG 1. Add an explicit Console input focus request seam owned by Console state and consumed by `ConsoleDock`.
- [x] CLG 2. Trigger that focus request from the Extrude viewport profile-selection path once the session reaches `Depth`.
- [x] CLG 3. Trigger the same focus request when Extrude starts with preselected viewport profiles and lands directly in `Depth`.
- [x] CLG 4. Preserve the existing input clearing and shortcut-priority behavior with focused tests.
- [x] CLG 5. Add camera-shortcut collision proof for active Extrude Depth entry, especially in Shortcuts-first mode.

### `Extrude-8 / Phase 1`

- [x] `HLG 1. After the user clicks a profile during active Extrude, their next keyboard command should go to Console so they can type a depth number.`
- [x] `HLG 3. Console should be empty when Extrude is ready to accept a number.`
- add the narrow Console focus request seam
- wire active Extrude viewport profile selection to request focus after non-empty selection
- prove the Console input is focused and empty after the profile click

### `Extrude-8 / Phase 2`

- [x] `HLG 2. If the user selects the profile first and then starts Extrude, the depth input should still be clean and fluid.`
- [x] `HLG 3. Console should be empty when Extrude is ready to accept a number.`
- request the same focus handoff when root Extrude starts with valid preselected profiles
- prove typing `50` and pressing `Enter` commits the Extrude in the selected-first path

### `Extrude-8 / Phase 3`

- [x] `HLG 4. Console-first Shift+E and Shortcuts-first E should both keep working.`
- [x] `HLG 5. Camera shortcuts should not overlap with Extrude numeric depth input while the command owns Depth entry.`
- keep `Shift+E` and `E` shortcut routing unchanged
- add focused proof that active Extrude Depth numeric input is not stolen by viewer camera shortcuts
- keep the fix inside Console/Extrude/input-routing seams without broad camera shortcut redesign

## [x] `Extrude-8 / Phase 1` - `Profile Pick To Console Focus Handoff`

### Phase 1 Summary

#### Purpose

Make the command-first flow feel straight:
1. user activates the model viewport
2. user starts Extrude with `E` or `Shift+E` according to input priority
3. user clicks one or more sketch profiles
4. Console is focused and empty so the user can type depth immediately

#### Owns

- one explicit Console input focus request seam
- active Extrude profile-pick handoff into Console focus
- clearing stale Console input when the command reaches Depth
- focused proof around the viewport profile-click path

#### Does Not Own

- selected-first startup focus
- camera shortcut collision proof
- Extrude geometry/runtime behavior
- broad Console refactor

#### Current Live Read

The profile click path already updates both `viewportSelectedSketchProfiles` and the active `extrudeCommandSession`. Once a non-empty selection is applied, the session becomes `activeStep: 'depth'`. The missing behavior is not state transition; it is keyboard focus handoff.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a Console-store focus request value with a sequence number and reason.
2. Add an action such as `requestConsoleInputFocus(reason)`.
3. In `ConsoleDock`, subscribe to that request and focus the visible input when the sequence changes.
4. In `ViewerHost` profile-pick handling, request Console input focus after active Extrude receives a non-empty profile selection.
5. Keep the existing `setInputText('')` behavior when active Extrude enters Depth.

#### Likely Files

- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

#### No-Widening Rule

Do not add direct DOM refs from `ViewerHost` to Console. The viewport should request a Console-owned focus action; Console should decide which docked/floating/popout input receives focus.

#### Verification Shape

- active Extrude starts without selected profiles
- viewport profile click moves session to `Depth`
- Console input becomes focused
- Console input is empty
- typing a number updates active Extrude depth

#### Done Shape

The command-first flow no longer requires an extra Console click after profile selection.

## [x] `Extrude-8 / Phase 2` - `Selected-First Depth Entry`

### Phase 2 Summary

#### Purpose

Make the selected-first flow match the command-first flow:
1. user clicks profile/profiles in the model viewport
2. user starts Extrude
3. Console is focused and empty
4. user types `50`
5. `Enter` commits the Extrude

#### Owns

- selected-profile-first Extrude startup focus
- selected-profile-first clean Depth input
- selected-profile-first numeric commit proof

#### Does Not Own

- changing how viewport profile selections are represented
- changing graph connection semantics
- changing existing shortcut priority choices

#### Current Live Read

Root Extrude start already reads `viewportSelectedSketchProfiles` and starts directly at `Depth` when valid profile selections exist. That means this phase should use the same focus request seam from Phase 1 instead of adding a second special selected-first path.

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. In `startRootExtrudeCommand(...)`, detect when the created session starts at `Depth`.
2. After clearing input, request Console input focus through the new shared seam.
3. Add focused ConsoleDock coverage for preselected profile -> Extrude -> type `50` -> `Enter`.

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`

#### No-Widening Rule

Do not change selected-profile validity rules. This phase only fixes the input/focus handoff for the already-supported selected-first path.

#### Verification Shape

- preselect valid viewport profile
- start Extrude through Shortcuts-first `E`
- start Extrude through Console-first `Shift+E`
- input is focused and empty
- `50` plus `Enter` commits the Extrude node depth

#### Done Shape

Profile-first and command-first Extrude flows both arrive at the same clean numeric Depth entry behavior.

## [x] `Extrude-8 / Phase 3` - `Shortcut Priority And Camera Collision Proof`

### Phase 3 Summary

#### Purpose

Lock the keyboard behavior around active Extrude Depth entry so future shortcut changes do not re-break the flow.

#### Owns

- proof that Console-first `Shift+E` still starts Extrude
- proof that Shortcuts-first `E` still starts Extrude
- proof that active Extrude Depth input is not stolen by viewer camera shortcuts while Console is focused
- narrow routing guard if current tests reveal a real active-session collision

#### Does Not Own

- redesigning camera shortcut presets
- adding a new input-priority preference
- changing normal idle viewport camera behavior

#### Current Live Read

`inputRouting.ts` already makes the Extrude viewport shortcut priority-aware. `cameraShortcuts.ts` already makes built-in camera snaps priority-aware. The risk is that an active Extrude Depth session can still feel broken if the depth input is not focused or if a future camera shortcut path outranks the active command owner.

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Add or tighten regression tests around active Extrude Depth keyboard routing.
2. Confirm numeric typing is Console input while the command is active.
3. Confirm normal idle camera shortcut behavior remains unchanged.
4. Only add a routing guard if the test proves a real active-command collision after Phase 1 and Phase 2 focus work.

#### Likely Files

- `src/app/inputRouting.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/useViewerCameraShortcuts.test.tsx`
- `src/app/cameraShortcuts.test.ts`

#### No-Widening Rule

Prefer proof over changing camera behavior. The code change should only touch camera routing if active Extrude Depth remains vulnerable after Console focus is made explicit.

#### Verification Shape

- Console-first `Shift+E` starts Extrude from viewport
- Shortcuts-first `E` starts Extrude from viewport
- active Depth entry accepts number input
- `Enter` commits the number
- idle camera snap shortcuts still behave according to input priority

#### Done Shape

The Extrude command has a documented, tested keyboard ownership path from shortcut start through profile selection to numeric commit.

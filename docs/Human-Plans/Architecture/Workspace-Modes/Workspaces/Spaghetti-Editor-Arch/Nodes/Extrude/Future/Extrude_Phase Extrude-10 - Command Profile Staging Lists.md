# `Extrude-10` - `Command Profile Staging Lists`

## Doc Header

### Doc History
2. 2026-05-26 07:02:05: Completed the Dispatch 5 manager loop for `Extrude-10`, accepting the profile staging session contract, two-list toolbar UI, preview/commit filtering proof, and explicit lock-mode deferral after focused tests, production build, and in-app browser smoke passed.
1. 2026-05-26 06:50:26: Added this future phase doc to plan the active Extrude command toolbar's two-list profile staging model, separating viewport-selected profile candidates from the profiles that will actually preview and commit into the Extrude node.

### Purpose

Use this doc as the implementation-planning surface for making active Extrude profile selection easier to experiment with before commit.

The user-facing goal is:
- when multiple sketch profiles are selected for Extrude, show a two-list profile control in the command toolbar
- keep one list as the viewport-selected/candidate profile set
- keep a second list as the explicit `to extrude` commit set
- let the user turn profiles off without losing them from the candidate list
- make `OK` commit only the profiles in the commit list

### Scope

This phase covers:
- active Extrude command profile staging during the live command
- toolbar UI that separates viewport-selected candidates from profiles to commit
- live preview and command-owned graph wires following only the commit list
- row toggles that remove or restore profiles from the commit list without deleting candidate rows
- `X` removal semantics for deleting a profile from both staged sets
- focused verification for preview, validation, accept, cancel, and viewport profile interaction behavior

This phase does not cover:
- changing Extrude runtime geometry meaning
- changing the `Geometry/Extrude` node's long-term multi-wire collection contract beyond the active command staging path
- changing ParaSlider or ParaSelect behavior
- broad Sketch profile selection redesign
- final lock-button persistence unless a later implementation phase explicitly accepts it

## Doc Body

### Summary

`Extrude-10` is the active command profile-staging lane.

Current read:
- `selectedProfileSources` in `ExtrudeCommandSession` currently means both:
  - profiles visible in the toolbar list
  - profiles used by live preview, live command wires, validation, and `OK` commit
- `ViewerHost` renders the selected-profile list through the shared `FocusedItemList`
- `useSpaghettiStore.setExtrudeCommandSelectedProfileSources` syncs the whole selected source list into live `Geometry/Extrude.ExtrusionProfile` wires
- the preview overlay and accept path both read `session.selectedProfileSources` directly

Locked recommendation:
- keep a candidate list and a commit list distinct
- treat the left list as `Viewport Profiles`
- treat the right list as `Extrude Profiles`
- drive preview, validation, live wires, and accept from `Extrude Profiles`
- keep inactive/off candidates visible in `Viewport Profiles` so users can compare and restore them
- keep `X` as hard removal from both lists

### Proposed UX

The command toolbar `Profiles` area should become a two-list control:

- `Viewport Profiles`
  - all profiles currently staged from the viewport/profile-pick flow
  - rows can be clicked to toggle whether that profile belongs to the commit set
  - inactive rows remain visible but dimmed/off
  - `X` removes the row from the command staging list entirely
- `Extrude Profiles`
  - only profiles that will be used by live preview and `OK`
  - rows can be clicked or removed to take them out of the commit set
  - count should read like `3 to extrude`

Recommended first behavior:
- new viewport selections enter both lists by default
- clicking a candidate row off removes it from `Extrude Profiles` but keeps it visible under `Viewport Profiles`
- clicking it again restores it to `Extrude Profiles`
- clicking `X` removes it from both lists
- if `Extrude Profiles` becomes empty, `OK` should disable and preview should disappear

Lock-button guidance:
- treat a lock button as a later optional phase unless live testing proves it is needed immediately
- unlocked behavior should keep viewport selection and candidates flowing naturally
- a later locked mode could freeze the commit list while new viewport picks only appear as candidates

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - owns the active command session shape and validation
  - should gain an explicit candidate-versus-commit profile model or a disabled/inactive source key set
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns command start/cancel/accept and live command graph sync
  - should sync live `ExtrusionProfile` wires from active commit sources only
- `src/app/components/ViewerHost.tsx`
  - owns active command toolbar rendering and preview overlay projection
  - should render the two-list profile UI and derive preview from commit sources only
- `src/app/components/FocusedItemList.tsx`
  - already owns the reusable focused-item row/list shell
  - can support active/inactive styling through existing `included` semantics
- `src/app/panels/browserInteractions.ts`
  - updates active Extrude selected sources when Browser sketch-profile rows are clicked
  - must preserve the new staging contract instead of overwriting the commit model accidentally

### Boundary Rules

- viewport selection is a candidate source, not automatically the final commit truth after the user starts staging
- live preview and `OK` commit must be driven by the commit list only
- inactive candidate rows must not create live command profile wires
- hard removal with `X` should remove the profile from both candidate and commit lists
- candidate/commit state should remain command-session state, not graph-authored durable node params
- the accepted graph should only contain wires for commit profiles
- cancel should roll back the live command graph exactly as it does today

## Vision

Extrude profile selection should feel inspectable and reversible.

Users should be able to select several profiles from the viewport, temporarily turn some off, compare the live preview, and commit only the profiles they choose without losing track of the profiles they originally selected.

## Wishlist Organization

### High Level Goals

- [x] `Extrude-Gen1-HLG-6. Users should be able to see all viewport-selected profiles separately from the profiles that will actually commit into the Extrude command.`
- [x] `Extrude-Gen1-HLG-7. Users should be able to temporarily turn profiles off without deleting them from the command list.`
- [x] `Extrude-Gen1-HLG-8. Extrude preview and OK commit should follow the explicit commit list, not hidden selection state.`

### Codex Level Goals

- [x] CLG 1. Add a session read model for candidate profile sources versus commit profile sources.
- [x] CLG 2. Make command validation, live profile-edge sync, preview, and accept use commit sources only.
- [x] CLG 3. Render the toolbar profile area as two focused-item lists in one command readout row.
- [x] CLG 4. Preserve hard-remove semantics with `X` while adding row-toggle semantics for temporary exclusion.
- [x] CLG 5. Add focused tests for inactive candidates, empty commit validation, preview filtering, and accepted graph wires.

### `Extrude-10 / Phase 1`

- [x] `HLG 8. Extrude preview and OK commit should follow the explicit commit list, not hidden selection state.`
- identify and introduce the smallest command-session model change needed to represent candidates and commit sources
- add selectors/helpers for active commit profile sources
- update validation and live profile-edge sync to read commit sources only

### `Extrude-10 / Phase 2`

- [x] `HLG 6. Users should be able to see all viewport-selected profiles separately from the profiles that will actually commit into the Extrude command.`
- [x] `HLG 7. Users should be able to temporarily turn profiles off without deleting them from the command list.`
- render `Viewport Profiles` and `Extrude Profiles` as two focused-item lists in the command toolbar
- add click/toggle behavior for temporary exclusion and restoration
- keep `X` as hard removal from both sets

### `Extrude-10 / Phase 3`

- [x] `HLG 8. Extrude preview and OK commit should follow the explicit commit list, not hidden selection state.`
- prove preview uses only commit sources
- prove `OK` commits only active commit sources
- prove inactive candidate rows survive while excluded from graph wires
- prove cancel still rolls back the live command graph

### `Extrude-10 / Phase 4`

- [x] reserve for lock-button follow-up only if needed after Phase 1 through Phase 3
- decided the lock button is not needed for the first accepted staging model
- deferred explicit locked/unlocked behavior until live use proves the basic two-list model is too eager

## [x] `Extrude-10 / Phase 1` - `Profile Staging Session Contract`

### Phase 1 Summary

#### Purpose

Separate command profile candidates from the profiles that actually drive live preview and commit.

#### Owns

- command-session shape for candidate and commit profile sources
- helper/selectors for commit-active sources
- validation based on commit-active sources
- live command graph profile-edge sync based on commit-active sources

#### Does Not Own

- final visual two-list layout
- lock-button mode
- new Extrude geometry semantics
- broader Browser or Sketch selection redesign

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a staging representation to `ExtrudeCommandSession`.
2. Preserve compatibility for command starts that still pass only `selectedProfileSources`.
3. Add a helper that returns commit-active profile sources.
4. Update command validation to use commit-active source count.
5. Update `setExtrudeCommandSelectedProfileSources` or its replacement path so live graph wires sync only commit-active sources.
6. Update accept guards to reject empty commit-active source lists even if candidate rows still exist.

#### Likely Files

- `src/app/spaghetti/commands/extrudeCommandSession.ts`
- `src/app/spaghetti/commands/extrudeCommandSession.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

#### Verification Shape

- a command can hold candidate sources while zero commit sources disables `OK`
- live `ExtrusionProfile` wires exist only for commit-active sources
- accept commits only commit-active source wires
- cancel rollback remains unchanged

#### Done Shape

The command has an explicit staging contract and no longer treats the visible toolbar list as automatically equal to commit truth.

### Phase 1 Acceptance

- Added candidate-versus-commit profile state to the active Extrude command session.
- Preserved compatibility for existing command starts by defaulting commit profiles from selected profile sources.
- Made validation and live command profile wires follow commit-active sources.

## [x] `Extrude-10 / Phase 2` - `Two-List Toolbar Profile UI`

### Phase 2 Summary

#### Purpose

Render the staged profile contract as two side-by-side lists inside the active Extrude command toolbar.

#### Owns

- `Viewport Profiles` candidate list
- `Extrude Profiles` commit list
- inactive candidate row styling
- row click/toggle behavior
- hard remove behavior through `X`

#### Does Not Own

- lock-button mode unless Phase 4 is promoted
- new command-panel shell behavior
- changing ParaSlider/ParaSelect layout

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Reuse `FocusedItemList` for both lists.
2. Label the left list `Viewport Profiles`.
3. Label the right list `Extrude Profiles`.
4. Show counts as candidate count and commit count.
5. Clicking a candidate toggles that source in or out of the commit list.
6. Clicking `X` removes the source from candidates and commit sources.
7. Make inactive candidates visually dimmer through `included={false}` or a scoped class.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/FocusedItemList.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/components/ViewerHost.test.tsx`

#### Verification Shape

- both list labels render
- candidate row click removes/restores the profile from the commit list
- `X` removes the profile from both lists
- `OK` disabled state follows commit-list count

#### Done Shape

The user can see the difference between selected/candidate profiles and profiles that will actually extrude.

### Phase 2 Acceptance

- Rendered `Viewport Profiles` and `Extrude Profiles` as two focused-item lists inside the active Extrude toolbar.
- Candidate row clicks toggle profiles into or out of the commit list.
- `X` remains hard removal from the staged command profile set.

## [x] `Extrude-10 / Phase 3` - `Preview Commit And Rollback Proof`

### Phase 3 Summary

#### Purpose

Prove the two-list staging model stays honest through preview, accept, and cancel.

#### Owns

- preview filtering by commit sources
- accepted graph wire filtering by commit sources
- inactive-candidate survival during preview
- cancel rollback proof
- targeted regression coverage for viewport/browser profile interactions

#### Does Not Own

- lock-button mode
- broad visual polish
- runtime geometry widening

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Update preview overlay derivation to use commit-active sources only.
2. Add tests proving inactive candidates do not produce preview profiles.
3. Add store tests proving accepted graph wires are created only for commit-active sources.
4. Add cancel proof that staged candidates do not leak into graph state after rollback.
5. Check Browser and viewport profile-pick paths do not accidentally reset inactive choices in normal use.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserInteractions.test.ts`

#### Verification Shape

- preview only includes commit-list profiles
- accepted graph only wires commit-list profiles
- inactive candidate rows remain staged until removed or command ends
- cancel leaves the original graph restored

#### Done Shape

The two-list model is end-to-end truthful: the user sees candidates, explicitly chooses commit profiles, and the graph only receives the chosen commit profiles.

### Phase 3 Acceptance

- Preview overlay derivation reads commit-active profile sources only.
- Accepted graph profile wires are created only for commit-active sources.
- Focused command-session, store, and toolbar tests cover inactive candidates, commit filtering, and UI toggles.

## [x] `Extrude-10 / Phase 4` - `Optional Lock Mode Decision`

### Phase 4 Summary

#### Purpose

Reserve a follow-up decision point for whether the two-list model needs a lock button.

#### Owns

- deciding whether later viewport selections should be allowed to auto-add into the commit list
- optional locked/unlocked state copy
- optional lock behavior tests

#### Does Not Own

- Phase 1 through Phase 3 staging basics
- lock persistence after command end
- broader selection system redesign

### Phase 4 Implementation Spec

#### Exact First Code Cut

Only start this phase if live use shows that automatic candidate-to-commit behavior is too eager.

If accepted:
1. Add a command-session lock flag.
2. In unlocked mode, new viewport selections enter candidate and commit lists.
3. In locked mode, new viewport selections enter candidates only.
4. Add a toolbar lock button with clear pressed/unpressed state.
5. Add focused tests for both modes.

#### Verification Shape

- unlocked mode keeps the fast current workflow
- locked mode preserves the commit list while still showing new candidates
- copy makes the mode understandable

#### Done Shape

Lock mode is either explicitly implemented or intentionally deferred with a clear reason.

### Phase 4 Acceptance

- Lock mode is intentionally deferred.
- The accepted first behavior keeps new viewport selections flowing into both candidates and commit profiles while allowing candidate row toggles to remove profiles from the commit list.
- A lock button should be reopened only if live use shows users need to freeze the commit list while continuing to select viewport candidates.

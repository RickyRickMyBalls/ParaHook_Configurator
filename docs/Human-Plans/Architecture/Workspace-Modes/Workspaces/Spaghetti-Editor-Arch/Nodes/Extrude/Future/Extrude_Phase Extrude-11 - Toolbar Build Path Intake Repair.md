# `Extrude-11` - `Toolbar Build Path Intake Repair`

## Doc Header

### Doc History
2. 2026-05-26 07:27:41: Completed the Dispatch 5 manager loop for `Extrude-11`, accepting the shared Extrude Build Path intake helper, toolbar OK recording repair, focused helper/toolbar/Console tests, production build, and in-app browser smoke.
1. 2026-05-26 07:18:47: Added this future phase doc to repair the active Extrude toolbar OK path so a committed toolbar Extrude records the same Build Path event and dependency hints as the Console Extrude path while preserving graph-authored geometry as the source of truth.

### Purpose

Use this doc as the implementation-planning surface for making toolbar-committed Extrude commands appear in Build Path.

The user-facing goal is:
- when the user commits the first Extrude from the viewport toolbar, the Extrude should appear in Build Path
- the Spaghetti graph and built geometry should stay the graph truth
- Build Path should receive an explicit accepted-command projection instead of relying on accidental reconstruction

### Scope

This phase covers:
- the active Extrude command toolbar OK path
- shared Build Path intake after a committed Extrude command summary
- missing upstream Sketch-source backfill for dependent Extrudes
- recorded graph dependency hints from commit profiles to accepted Extrude nodes
- focused tests proving toolbar and console acceptance use the same intake behavior

This phase does not cover:
- changing Extrude runtime geometry meaning
- changing the two-list profile staging UX from `Extrude-10`
- retroactively rebuilding already-missing Build Path cards from current in-memory sessions
- changing Build Path card visuals or topology layout

## Doc Body

### Summary

`Extrude-11` is the narrow repair lane for the gap where toolbar OK commits the graph but does not record a Build Path command event.

Current read:
- `useSpaghettiStore.acceptExtrudeCommandSession()` commits the live Extrude node and returns a `GraphCommandCommitSummary`.
- `ViewerHost` passes that store function directly to `ExtrudeCommandToolbar.onConfirm`, so the returned summary is dropped.
- `useConsoleInteraction` handles the same summary correctly by recording missing Sketch sources, graph dependencies, and the Extrude command summary into Build Path.
- Build Path already accepts Extrude command summaries when they are explicitly routed through `recordGraphCommandSummaryForBuildPath`.

Locked recommendation:
- extract the Console's post-accept Build Path recording block into a shared helper
- make the helper read commit-profile sources from the active session before accept
- route both Console Extrude and toolbar Extrude through the helper after a committed summary
- keep Build Path as a projection of accepted graph commands, not as a second geometry owner

### Boundary Rules

- accepted graph truth remains owned by Spaghetti store command acceptance
- Build Path intake should happen only after a committed summary
- cancelled or invalid Extrude summaries must not create Build Path cards
- dependency hints must use commit-profile sources, not inactive candidate-only profiles
- toolbar and console acceptance should share one helper so this bug does not return as the command surface grows

## Vision

The user should not have to care which surface accepted the Extrude.

If the command creates or reuses a graph-authored `Geometry/Extrude` node and the geometry builds, Build Path should receive the same accepted feature card and dependency context whether the final OK came from Console or from the viewport command toolbar.

## Wishlist Organization

### High Level Goals

- [x] `Extrude-Gen1-HLG-9. Toolbar-committed Extrudes should appear in Build Path the same way Console-committed Extrudes do.`
- [x] `Extrude-Gen1-HLG-10. Build Path dependency hints should follow the actual profiles committed to Extrude, not inactive staged candidates.`

### Codex Level Goals

- [x] CLG 1. Add a shared post-accept Extrude Build Path intake helper.
- [x] CLG 2. Route toolbar OK through the shared helper without changing graph commit behavior.
- [x] CLG 3. Route Console Extrude acceptance through the same helper.
- [x] CLG 4. Add focused tests for toolbar Build Path event recording and commit-profile dependency filtering.

### `Extrude-11 / Phase 1`

- [x] `HLG 9. Toolbar-committed Extrudes should appear in Build Path the same way Console-committed Extrudes do.`
- [x] add a shared helper that accepts a committed Extrude summary plus the pre-accept session read
- [x] move the Console post-accept Build Path recording logic into that helper
- [x] preserve missing Sketch-source backfill behavior

### `Extrude-11 / Phase 2`

- [x] `HLG 9. Toolbar-committed Extrudes should appear in Build Path the same way Console-committed Extrudes do.`
- [x] `HLG 10. Build Path dependency hints should follow the actual profiles committed to Extrude, not inactive staged candidates.`
- [x] wire `ViewerHost` toolbar OK through the shared helper
- [x] ensure dependency hints use commit-profile sources
- [x] prove first toolbar Extrude adds an Extrude Build Path card after the Sketch card

### `Extrude-11 / Phase 3`

- [x] add focused regression tests for console and toolbar intake parity
- [x] run focused test coverage and production build
- [x] update changelog, doc log, phase status, index status, and Dispatch run state

## [x] `Extrude-11 / Phase 1` - `Shared Extrude Build Path Intake Helper`

### Phase 1 Summary

#### Purpose

Create one shared helper for the post-accept Build Path recording that currently exists only in the Console Extrude path.

#### Owns

- helper API shape
- missing source Sketch card backfill
- graph dependency hint recording
- committed Extrude summary recording

#### Does Not Own

- toolbar UI changes
- Build Path visual rendering changes
- Extrude geometry/runtime changes
- profile staging UX changes

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a shared helper near the Build Path graph command recording seam.
2. Let it accept `graphDocumentId`, a committed summary, and profile source node ids captured before the session clears.
3. Return early for cancelled summaries or missing graph document ids.
4. Record missing Sketch source cards, dependencies, and the Extrude summary.

#### Likely Files

- `src/app/buildPath/recordBuildPathGraphCommand.ts`
- `src/app/console/useConsoleInteraction.ts`
- focused tests under `src/app/buildPath` or existing store/viewer tests

#### Verification Shape

- helper records one Sketch card when needed and one Extrude card
- helper skips cancelled summaries
- helper records dependencies from source profile nodes to accepted Extrude nodes

#### Done Shape

Console and toolbar can share one post-accept Build Path intake path.

## [x] `Extrude-11 / Phase 2` - `Toolbar OK Build Path Recording`

### Phase 2 Summary

#### Purpose

Make viewport toolbar OK preserve the returned Extrude command summary and record it into Build Path.

#### Owns

- `ViewerHost` toolbar OK handler
- pre-accept session read for graph document and commit-profile sources
- first toolbar Extrude Build Path card proof

#### Does Not Own

- Console input behavior beyond reusing the helper
- active command toolbar styling
- retrospective recovery for already missing runtime events

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Replace the direct `onConfirm={acceptExtrudeCommandSession}` binding with a local handler.
2. Capture the active session's graph id and commit-profile source node ids before accept clears the session.
3. Call `acceptExtrudeCommandSession()`.
4. Pass the returned summary and captured source ids to the shared helper.
5. Keep cancelled summaries as no-op Build Path intake.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/buildPath/recordBuildPathGraphCommand.ts`

#### Verification Shape

- toolbar OK creates a Build Path Extrude card
- source Sketch card is present before the Extrude card
- inactive candidate-only profiles are not recorded as dependency sources

#### Done Shape

The first toolbar-committed Extrude appears in Build Path after commit.

## [x] `Extrude-11 / Phase 3` - `Verification And Closeout`

### Phase 3 Summary

#### Purpose

Prove the repair and close the phase cleanly.

#### Owns

- focused regression tests
- production build
- docs and tracking closeout

#### Does Not Own

- broad full-suite cleanup of unrelated failures
- browser visual redesign

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Add or update focused tests for the shared helper and toolbar OK path.
2. Run the focused tests that cover Extrude command accept and Build Path intake.
3. Run `npm.cmd run build`.
4. Mark all phase sections `[x]` after proof passes.
5. Update permanent tracking docs.

#### Verification Shape

- focused tests pass
- production build passes
- Build Path recording remains a projection of accepted graph command summaries

#### Done Shape

`Extrude-11` is Manager-accepted complete.

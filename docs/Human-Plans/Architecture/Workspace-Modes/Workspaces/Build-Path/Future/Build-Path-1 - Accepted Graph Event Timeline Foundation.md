# Build Path-1 - Accepted Graph Event Timeline Foundation

## Doc Header

### Doc History
3. 2026-05-22 18:45:37: Added the presentation boundary for Build Path as a clean Model Viewport-docked icon timeline by default, with normal Console-like titlebar chrome when opened as a split, tiled, or windowed workspace surface.
2. 2026-05-22 18:00:21: Prepped `Build-Path-1 / Phase 1 - Accepted Graph Build Event Model` for implementation against the live `src/app/console/commandCommitContract.ts` and `src/app/console/buildPathProjection.ts` seam, narrowing the first code cut to a Build Path-owned event wrapper over existing committed graph command projections instead of duplicating the Spaghetti-side projection helper.
1. 2026-05-22 17:51:51: Added this `Build-Path-1` family phase doc to make the Generation 1 accepted graph event timeline foundation implementation-ready, including the event model, master timeline, view-only master scrub, branch detection, parallel scrub mode, and explicit restore/branch boundaries.

### Purpose

This doc plans `Build-Path-1`.

Use it to answer:
- how accepted graph-authored CAD/build commands should become Build Path events
- how the first master linear Build Path timeline should be derived
- how view-only master scrub differs from Edit History undo/redo
- how parallel branch lanes should be derived from graph dependency structure
- how branch-local scrub should relate to the master timeline
- why restore, branch-from-here, compare, and pin actions are later explicit commands

Do not use it for:
- changing canonical Ctrl+Z / Redo behavior
- making Build Path a second Spaghetti graph editor
- making scrub movement mutate authored graph truth
- implementing worker checkpoint/cache storage before its owning phase
- final comparison UI
- broad graph layout or arrangement UI

## Doc Body

### Short Version

`Build-Path-1` creates the first Build Path foundation in six doable slices:

1. accepted graph build event model
2. master linear timeline
3. view-only master scrub
4. parallel branch detection
5. parallel scrub mode
6. explicit restore/branch action boundaries

The first slice should be deliberately small:
- accepted Sketch/Extrude graph command summaries can become Build Path event records
- cancelled and transient sessions do not
- no Build Path UI or scrub behavior is required yet

### Core Terms

- `Build Event`
  - one accepted graph-authored CAD/build event
  - example: accepted Sketch, accepted Extrude, accepted OutputPreview publication
- `Master Timeline`
  - one linear sequence of accepted Build Events
- `Master Scrub`
  - one global playhead over the Master Timeline
- `Branch Timeline`
  - derived lane for graph events that belong to one dependency branch
- `Branch Scrub`
  - local playhead over one Branch Timeline
- `Checkpoint`
  - stable accepted build-state boundary, especially around merge or restore-ready points

### Ownership Boundary

Build Path owns:
- derived event and timeline reading
- scrub navigation state
- row/card explanation
- branch lane projection
- later explicit restore/branch action surfaces

Build Path does not own:
- canonical undo/redo
- graph authoring truth
- command session mutation
- worker cache implementation
- final geometry execution

## Vision

`Build-Path-1` should make Build Path real without overclaiming it.

The phase should first prove that ParaHook can derive a construction story from accepted graph-authored CAD/build events.

The healthy end state for this family phase:
- accepted graph command summaries produce stable Build Path events
- one master timeline can list those events in order
- the first scrub behavior can inspect earlier accepted build states without acting like Ctrl+Z
- branch mode can explain parallel graph work with local lanes
- restore, branch-from-here, compare, and pin remain explicit later commands

Presentation boundary:
- default Build Path presentation should live in the `Model Viewport` as a compact top- or bottom-dockable icon strip
- bottom-docked Build Path sits above `Console`
- the compact timeline body does not show a visible `Build Path` label
- linear mode uses a string of CAD/build icons to represent accepted events/nodes
- split, tiled, or windowed Build Path mode still uses normal workspace titlebar chrome like `Console`
- the titlebar may identify `Build Path`; the no-label rule applies to the timeline body

## Wishlist Organization

### High Level Goals

- [ ] `Build-Path-Gen1-HLG-1. Build Path should have its own dedicated workspace-family folder with a vision, generation index, and future implementation plan.`
- [ ] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [ ] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [ ] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [ ] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [ ] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [ ] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [ ] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [ ] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Codex Level Goals

- [ ] Build-Path-Gen1-CLG-1. Add a workspace-family planning home and route `Build Path` through the shared workspace surface model.
- [ ] Build-Path-Gen1-CLG-2. Define a stable accepted graph build event record over committed graph command summaries.
- [ ] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.
- [ ] Build-Path-Gen1-CLG-4. Define view-only master scrub behavior that does not create canonical undo entries or mutate the authored graph head.
- [ ] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [ ] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.
- [ ] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.
- [ ] Build-Path-Gen1-CLG-8. Preserve the compact viewport-docked icon-strip presentation while allowing split/tiled/windowed workspace chrome to show a titlebar.

### `Build-Path-1 / Phase 1`

- [ ] Define the accepted graph build event record shape on top of the existing Build Path command projection seam.
- [ ] Project accepted Sketch/Extrude command projections into Build Path events.
- [ ] Skip cancelled and transient command sessions.
- [ ] Preserve graph id, affected node ids, affected edge ids, command family, entry point, mutation summary, output ids, build result state, and accepted ordering metadata when available.
- [ ] Avoid UI, scrub behavior, branch detection, or worker checkpoint scope.
- [ ] `Build-Path-Gen1-HLG-2`
- [ ] `Build-Path-Gen1-HLG-7`
- [ ] Build-Path-Gen1-CLG-2.

### `Build-Path-1 / Phase 2`

- [ ] Derive one master linear timeline from Build Path events.
- [ ] Keep stable timeline ids and display ordering.
- [ ] Support empty state when no accepted build events exist.
- [ ] Keep timeline derivation independent from Edit History private payloads.
- [ ] Preserve icon-first display metadata so the default future UI can render a compact CAD/build icon strip without requiring a visible content label.
- [ ] `Build-Path-Gen1-HLG-4`
- [ ] `Build-Path-Gen1-HLG-7`
- [ ] `Build-Path-Gen1-HLG-9`
- [ ] Build-Path-Gen1-CLG-3.
- [ ] Build-Path-Gen1-CLG-8.

### `Build-Path-1 / Phase 3`

- [ ] Define view-only master scrub state.
- [ ] Move the selected Build Path step without calling canonical undo/redo.
- [ ] Keep authored graph head unchanged during scrub navigation.
- [ ] Preserve redo state and Edit History stack behavior.
- [ ] `Build-Path-Gen1-HLG-3`
- [ ] `Build-Path-Gen1-HLG-7`
- [ ] Build-Path-Gen1-CLG-4.

### `Build-Path-1 / Phase 4`

- [ ] Derive branch lanes from graph dependency structure.
- [ ] Classify build events as linear, branch-local, merge, or checkpoint candidates.
- [ ] Keep master timeline order unchanged.
- [ ] Avoid fake serial ordering when dependencies are parallel.
- [ ] `Build-Path-Gen1-HLG-5`
- [ ] Build-Path-Gen1-CLG-5.

### `Build-Path-1 / Phase 5`

- [ ] Define parallel scrub mode.
- [ ] Add branch-local playhead state over derived branch timelines.
- [ ] Anchor branch scrub positions to master timeline checkpoints or merge boundaries.
- [ ] Keep branch scrub as view-only inspection by default.
- [ ] `Build-Path-Gen1-HLG-6`
- [ ] `Build-Path-Gen1-HLG-7`
- [ ] Build-Path-Gen1-CLG-6.

### `Build-Path-1 / Phase 6`

- [ ] Define explicit restore, branch-from-here, compare, and pin boundaries.
- [ ] Keep these actions out of implicit scrub movement.
- [ ] Define the first future handoff after view-only scrub is proven.
- [ ] `Build-Path-Gen1-HLG-8`
- [ ] Build-Path-Gen1-CLG-7.

## [ ] `Build-Path-1 / Phase 1` - `Accepted Graph Build Event Model`

### Phase 1 Summary

Create the first stable Build Path event model over accepted graph command summaries.

#### Purpose

This phase proves that Build Path can record accepted graph-authored CAD/build events without implementing timeline UI or scrub behavior yet.

#### Owns

- Build Path event type planning
- projection from accepted graph command summaries
- stable event ids
- graph/node back-references
- command-family and entry-point labels
- cancellation and transient-session exclusion

#### Does Not Own

- Build Path workspace UI
- master scrub
- branch detection
- worker checkpoints
- restore or branch actions
- canonical undo/redo changes
- replacing the existing Spaghetti-side command projection helper

#### First Pass Decisions

- use existing Build Path command projections as the first input source
- include Sketch and Extrude first because they are the current strongest shipped command-summary families
- keep `src/app/console/buildPathProjection.ts` as the current Spaghetti-side handoff helper for `GraphCommandCommitSummary -> BuildPathCommandProjection`
- create a new Build Path-owned event helper that consumes `BuildPathCommandProjection`
- skip `null` projections because the existing helper already returns `null` for cancelled summaries
- skip transient preview/session state
- keep accepted result linkage optional through the existing `buildResultState` field
- keep event ordering explicit but caller-supplied for Phase 1 so the later master-timeline phase can own sorting and sequence policy

#### Current Live Read

Live source already contains a narrow Spaghetti-side Build Path projection seam:
- `src/app/console/commandCommitContract.ts`
  - defines `GraphCommandFamily` as `Sketch | Extrude`
  - defines `GraphCommandEntryPoint`
  - defines `CommittedGraphCommandSummary`
  - defines `CancelledGraphCommandSummary`
  - exposes `isCommittedGraphCommandSummary(...)`
- `src/app/console/buildPathProjection.ts`
  - exposes `projectGraphCommandCommitForBuildPath(...)`
  - returns `BuildPathCommandProjection | null`
  - preserves graph document id, command family, entry point, graph mutation summary, affected graph ids, output ids, row label, and build result state
  - skips cancelled summaries by returning `null`
- `src/app/console/buildPathProjection.test.ts`
  - already proves created Sketch projection
  - reused Sketch projection
  - Extrude projection with created node and profile wires
  - cancelled-command skip behavior
  - graph id and mutation preservation

Phase 1 should not move that helper yet.

The first Build Path-owned code should sit downstream from it:
- `BuildPathCommandProjection`
  - Spaghetti/Console-side handoff record
- `BuildPathEvent`
  - Build Path-owned event record used by later master timeline, branch detection, and scrub phases

This keeps the phase small and avoids inventing a second command summary contract.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Add a pure Build Path event helper that turns existing Build Path command projections into Build Path event records.

Suggested helper:

```ts
createBuildPathEventFromCommandProjection(...)
```

Suggested request shape:

```ts
type CreateBuildPathEventFromCommandProjectionRequest = {
  projection: BuildPathCommandProjection
  eventSequence: number
  acceptedAt?: string
}
```

Recommended event fields:
- `buildPathEventId`
- `sourceProjectionId`
- `graphDocumentId`
- `commandFamily`
- `entryPoint`
- `eventSequence`
- `affectedNodeIds`
- `affectedEdgeIds`
- `affectedOutputIds`
- `mutationSummary`
- `buildResultState`
- `acceptedAt`
- `timelineRole`

Recommended first `timelineRole`:
- `unclassified`

Reason:
- Phase 4 owns branch/merge/checkpoint classification
- Phase 1 should not infer dependency lanes early

#### Likely Files

- `src/app/buildPath/`
- `src/app/buildPath/buildPathEvents.ts`
- `src/app/buildPath/buildPathEvents.test.ts`
- existing `src/app/console/buildPathProjection.ts`
- existing `src/app/console/buildPathProjection.test.ts`

#### No-Widening Rule

Do not create UI, scrub state, master timeline sorting, branch lanes, checkpoints, restore actions, worker storage, or Edit History changes in Phase 1.

Do not replace `projectGraphCommandCommitForBuildPath(...)` in Phase 1.

Do not add a runtime Build Path workspace surface in Phase 1.

#### Checklist

- [ ] Define `BuildPathEvent` type.
- [ ] Add pure command-projection to event helper.
- [ ] Preserve projection id as `sourceProjectionId`.
- [ ] Preserve graph id and affected node ids.
- [ ] Preserve affected edge ids and output ids.
- [ ] Preserve command family and entry point.
- [ ] Preserve mutation summary.
- [ ] Preserve `buildResultState`.
- [ ] Preserve caller-provided `eventSequence`.
- [ ] Preserve optional caller-provided `acceptedAt`.
- [ ] Mark first events as `timelineRole: 'unclassified'`.
- [ ] Keep cancelled skip behavior covered through the existing projection helper returning `null`.
- [ ] Add focused unit tests for Sketch and Extrude projections becoming events.
- [ ] Add focused unit test for output ids and linked build result preservation.
- [ ] Add focused unit test that Phase 1 does not classify branch roles.

#### Verification Shape

- focused unit tests for the pure Build Path event helper
- existing `buildPathProjection` tests remain the cancelled-summary proof
- no production UI proof required
- no worker or viewport verification required

Suggested command:

```powershell
npm.cmd test -- --run src/app/buildPath/buildPathEvents.test.ts src/app/console/buildPathProjection.test.ts
```

#### Done Shape

Phase 1 is done when accepted Sketch/Extrude Build Path command projections can produce stable Build Path event records, preserve graph/build references, and leave cancelled/transient exclusion to the existing projection seam without adding UI, scrub, branch, worker, or Edit History behavior.

## [ ] `Build-Path-1 / Phase 2` - `Master Linear Timeline`

### Phase 2 Summary

Derive one master linear timeline from Build Path event records.

### Phase 2 Implementation Spec

The implementation should:
- add a pure timeline derivation helper
- sort accepted events by accepted order
- expose stable timeline step ids
- return an empty timeline when no events exist
- keep display labels presentational

Verification should cover:
- empty input
- Sketch then Extrude order
- repeated command families receiving stable distinct steps
- display labels not becoming command truth

Do not include:
- scrub navigation
- branch lanes
- restore actions
- UI beyond an optional later read-only proof if the phase is widened deliberately

## [ ] `Build-Path-1 / Phase 3` - `View-Only Master Scrub`

### Phase 3 Summary

Define and implement the first master scrub state as view-only Build Path navigation.

### Phase 3 Implementation Spec

The implementation should:
- add local Build Path playhead state
- allow selecting a master timeline step
- prove selection does not call canonical undo/redo
- prove authored graph head is not mutated by scrub navigation
- preserve redo stack behavior

Verification should cover:
- selecting prior step changes Build Path playhead state
- canonical Edit History entry count does not change
- redo stack is preserved
- graph document state is not rewritten by scrub selection

Do not include:
- restore into authored head
- branch-from-here
- worker checkpoint replay
- branch-local scrub

## [ ] `Build-Path-1 / Phase 4` - `Parallel Branch Detection`

### Phase 4 Summary

Classify events into dependency-aware lanes while preserving one master timeline.

### Phase 4 Implementation Spec

The implementation should:
- inspect event graph/node dependency hints
- derive branch lane ids
- classify simple linear chains
- classify independent parallel branches
- classify merge/checkpoint candidates
- keep master timeline ordering intact

Verification should cover:
- one simple linear Sketch -> Extrude chain
- two independent branch chains
- one merge/checkpoint candidate
- no fake serial ordering in branch projection

Do not include:
- branch-local scrub UI
- graph layout or node arrangement
- final checkpoint/cache storage

## [ ] `Build-Path-1 / Phase 5` - `Parallel Scrub Mode`

### Phase 5 Summary

Add branch-local scrub state over derived branch timelines.

### Phase 5 Implementation Spec

The implementation should:
- expose branch-local playhead state
- anchor branch playheads to master timeline context
- keep branch scrub view-only
- keep one source event model
- preserve master timeline position semantics

Verification should cover:
- branch-local playhead can move inside one lane
- master timeline order remains unchanged
- branch scrub does not create canonical undo entries
- branch scrub does not mutate authored graph truth

Do not include:
- restore or branch creation
- comparison UI
- worker checkpoint replay beyond existing available read hooks

## [ ] `Build-Path-1 / Phase 6` - `Explicit Restore Branch And Compare Boundaries`

### Phase 6 Summary

Define the next action boundary after view-only scrub is proven.

### Phase 6 Implementation Spec

The implementation or docs closeout should:
- make restore explicit
- make branch-from-here explicit
- make compare explicit
- make pin/checkpoint affordances explicit
- record the next future family phase that should own those actions

Verification should cover:
- scrub movement remains navigation
- restore/branch/compare are not silently triggered
- next implementation doc is ready if runtime actions are promoted

Do not include:
- unapproved authored restore behavior
- unapproved branch graph storage
- comparison UI before reader truth exists

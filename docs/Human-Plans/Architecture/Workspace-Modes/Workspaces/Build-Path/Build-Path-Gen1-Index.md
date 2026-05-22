# Build Path Gen1 Index

## Doc Header

### Doc History
3. 2026-05-22 18:45:37: Added the Generation 1 presentation boundary for a clean Model Viewport-docked CAD icon timeline with no content label, plus Console-like titlebar chrome when Build Path is split, tiled, or windowed.
2. 2026-05-22 18:00:21: Prepped `Build-Path-1 / Phase 1` as the current implementation handoff, grounding it in the live `console/buildPathProjection` seam and narrowing the first runtime cut to a Build Path-owned event wrapper over existing command projections.
1. 2026-05-22 17:51:51: Added this active Generation 1 planning index for the `Build Path` workspace family, routing graph-authored build events, master scrub, branch timelines, and later restore/branch actions into the first standalone `Build-Path-1` future plan.

### Purpose

This file is the active `Generation 1` planning index for the `Build Path` workspace family under `Workspace Modes`.

Use it to answer:
- how the `Build Path` `Generation 1` vision becomes family phases
- which `Generation 1` HLG are preserved from `Build-Path-Vision.md`
- which first family phase should be created or implemented next
- how Build Path stays separate from canonical Edit History undo/redo
- how Build Path reads Spaghetti graph-authored command history without becoming Spaghetti

Do not use it for:
- broad Build Path north-star ownership that belongs in `Build-Path-Vision.md`
- later generations after a dedicated `Build-Path-GenN-Index.md` exists
- implementation-phase specs that belong in standalone `Future/` Family Phase Docs
- worker cache/checkpoint details before the owning implementation phase
- runtime restore, branch, or comparison UI before view-only scrub exists

### Family Structure

Use this folder like this:

- `Build-Path-Vision.md`
  - north-star product and ownership direction
- `Build-Path-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Future/`
  - standalone implementation-ready `Build Path` Family Phase Docs
- `Shipped/`
  - completed `Build Path` records after implementation closes
- `archive/`
  - old Build Path planning records retained for history

## Doc Body

### Short Version

`Build Path` should become a real workspace surface for reading and scrubbing accepted graph-authored CAD/build history.

The first family lane is `Build-Path-1`.

`Build-Path-1` should prove the graph build timeline foundation first:
- define accepted graph build event records
- derive one master linear timeline
- add view-only master scrub semantics
- derive parallel branch lanes from graph dependencies
- add branch-local scrub mode
- keep explicit restore, branch-from-here, compare, and pin actions separate until the reader is trustworthy
- preserve the default presentation as a clean Model Viewport icon strip with no content label
- keep split/tiled/windowed presentation compatible with normal workspace titlebar chrome

### Current Planning Read

This file owns the active `Generation 1` family-phase routing.

Current legal family-phase ladder:
- `Build-Path-1` - accepted graph event timeline foundation, master scrub, branch detection, and parallel scrub planning

Important planning rule:
- use this index to choose and bound the next `Build-Path-N` family phase
- use a matching standalone `Future/` Family Phase Doc for Codex-sized implementation phases and implementation specs
- do not start runtime implementation from this index alone

Dispatch next:
- implement `Build-Path-1 / Phase 1 - Accepted Graph Build Event Model` from `Future/Build-Path-1 - Accepted Graph Event Timeline Foundation.md`
- start with a Build Path-owned event helper that consumes existing `BuildPathCommandProjection` records from `src/app/console/buildPathProjection.ts`

## Vision

`Build-Path-Vision.md` remains the broad north-star.

This Generation Index Doc owns the current `Generation 1` family-phase routing read.

The healthy Generation 1 read is:
- Build Path records accepted graph-authored build events across all graphs
- master timeline shows one linear accepted order
- branch timelines are derived from dependencies, not stored as a second source of history
- master scrub is the main global playhead
- branch scrub controls are branch-local inspection playheads anchored to the same master story
- scrub navigation is view-only by default
- Edit History remains the canonical Ctrl+Z and Redo owner
- Spaghetti remains the graph authoring owner
- the default Build Path presentation is a compact Model Viewport-docked icon strip
- split, tiled, and windowed Build Path presentations still use normal workspace titlebar chrome like Console
- explicit restore, branch-from-here, compare, and pin actions are later deliberate commands

Important boundary rule:
- if a question is about broad `Build Path` purpose, use `Build-Path-Vision.md`
- if a question is about current `Generation 1` family-phase order, use this index
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc

## Wishlist Organization

### High Level Goals

The canonical human-level goals live in `Build-Path-Vision.md` under `## Doc Body > ### Human Level Goals`.

This index repeats them so current `Generation 1` family-phase routing stays readable.

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

### `Build-Path-1`

- [x] Create the standalone `Future/Build-Path-1 - Accepted Graph Event Timeline Foundation.md` Family Phase Doc.
- [~] Define accepted graph build event shape.
- [ ] Derive a master linear timeline from accepted graph build events.
- [ ] Define view-only master scrub behavior.
- [ ] Derive branch lanes from graph dependencies.
- [ ] Define branch-local scrub mode.
- [ ] Preserve explicit restore, branch, compare, and pin actions as later commands.
- [ ] Keep Edit History, Spaghetti graph authoring, and worker checkpoint ownership separate.
- [ ] Preserve the no-content-label icon timeline direction for the default viewport-docked Build Path surface and the titlebar rule for split/tiled/windowed mode.
- [ ] `Build-Path-Gen1-HLG-1`
- [ ] `Build-Path-Gen1-HLG-2`
- [ ] `Build-Path-Gen1-HLG-3`
- [ ] `Build-Path-Gen1-HLG-4`
- [ ] `Build-Path-Gen1-HLG-5`
- [ ] `Build-Path-Gen1-HLG-6`
- [ ] `Build-Path-Gen1-HLG-7`
- [ ] `Build-Path-Gen1-HLG-8`
- [ ] `Build-Path-Gen1-HLG-9`
- [ ] Build-Path-Gen1-CLG-1.
- [ ] Build-Path-Gen1-CLG-2.
- [ ] Build-Path-Gen1-CLG-3.
- [ ] Build-Path-Gen1-CLG-4.
- [ ] Build-Path-Gen1-CLG-5.
- [ ] Build-Path-Gen1-CLG-6.
- [ ] Build-Path-Gen1-CLG-7.
- [ ] Build-Path-Gen1-CLG-8.

## [ ] `Build-Path-1` - `Accepted Graph Event Timeline Foundation`

### Family Phase Summary

Create the first implementation-planning surface for the `Build Path` workspace.

This phase should make the accepted graph event and scrub-timeline direction concrete before any runtime implementation starts.

The first family phase should be small enough to ship in slices:
1. accepted event model
2. master timeline
3. view-only master scrub
4. branch detection
5. parallel scrub mode
6. explicit restore/branch action boundaries

Current handoff:
- `Build-Path-1 / Phase 1 - Accepted Graph Build Event Model`
- first code cut should consume `BuildPathCommandProjection` instead of replacing the existing `projectGraphCommandCommitForBuildPath(...)` helper

### HLG / CLG Coverage

- [ ] `Build-Path-Gen1-HLG-1. Build Path should have its own dedicated workspace-family folder with a vision, generation index, and future implementation plan.`
- [ ] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [ ] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [ ] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [ ] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [ ] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [ ] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [ ] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [ ] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`
- [ ] Build-Path-Gen1-CLG-1. Add a workspace-family planning home and route `Build Path` through the shared workspace surface model.
- [ ] Build-Path-Gen1-CLG-2. Define a stable accepted graph build event record over committed graph command summaries.
- [ ] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.
- [ ] Build-Path-Gen1-CLG-4. Define view-only master scrub behavior that does not create canonical undo entries or mutate the authored graph head.
- [ ] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [ ] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.
- [ ] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.
- [ ] Build-Path-Gen1-CLG-8. Preserve the compact viewport-docked icon-strip presentation while allowing split/tiled/windowed workspace chrome to show a titlebar.

### Owns

- first Build Path workspace-family implementation ladder
- accepted graph build event model
- master timeline projection
- view-only scrub semantics
- branch lane derivation
- parallel scrub mode direction
- restore/branch boundary planning
- viewport-docked icon-strip presentation boundary
- split/tiled/windowed titlebar chrome boundary

### Does Not Own

- replacing `Edit History`
- changing Ctrl+Z or Redo behavior
- making scrub movement canonical undo entries
- owning Spaghetti graph nodes, wires, or params
- worker checkpoint/cache implementation before its phase
- final restore/branch/compare UI
- broad graph layout or arrangement behavior

### Planning Read

The first implementation should begin from the strongest existing Spaghetti-side bridge:
- accepted graph-command summaries from viewport/console/toolbar command work
- `Spaghetti-Editor 8 / Phase 4` Build Path projection handoff
- committed Sketch and Extrude command summaries
- graph ids, node ids, mutation summaries, command family, and entry point

The first runtime pass should stay conservative:
- cancelled command sessions do not become Build Path events
- transient preview states do not become Build Path events
- Build Path can be empty if there are no accepted graph build events
- no authored graph mutation should happen when the user scrubs

### Family Phase Doc

- [x] `Future/Build-Path-1 - Accepted Graph Event Timeline Foundation.md`

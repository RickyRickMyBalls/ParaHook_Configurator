# `VRI-4` - `Multi-Lane Runtime Cards And Parallel Graph Execution`

## Doc Header

### Doc History
1. 2026-04-10 21:05: Created this standalone future phase doc for `VRI-4`, turning the next viewport runtime-inspector lane into an implementation-ready follow-on for keeping cards as the stable runtime unit while widening them into per-lane progress rows for `Draft` plus `B-Rep` today and later graph-parallel execution lanes

### Purpose

Use this doc as the dedicated planning and execution surface for the fourth `Viewport Runtime Inspector` delivery lane.

The goal here is:
- keep runtime cards as the primary user-facing explanation unit
- widen each card so it can expose one or more lane-local loading bars and states
- make `Draft` plus `B-Rep` read as two honest execution lanes inside one card when `Auto` or similar mixed-lane behavior is active
- prepare the inspector for later true graph-parallel execution without turning it into a generic worker-profiler dashboard
- break the work into small implementation-ready chunks before broader graph-parallel or pool-occupancy visualization grows wider

### Scope

This phase covers:
- card-model widening from one visible runtime task row into one card with one or more lane rows
- lane-local progress, state, and copy rules inside each card
- `Auto`-style mixed-lane card behavior for `Draft` plus `B-Rep`
- the first scalable card contract for later graph-parallel branch activity beneath one authored work unit

This phase does not cover:
- a generic worker-pool dashboard
- low-level CPU or memory profiling
- export-lane visualization unless that lane already exists as honest runtime truth
- a full graph dependency browser
- final graph-parallel scheduler design beyond the runtime-inspector read model needed to stay honest

## Doc Body

### Summary

`VRI-4` is the dedicated multi-lane card lane for keeping the runtime inspector readable after the worker split.

Current read:
- `VRI-1` through `VRI-3` already established:
  - one compact runtime-inspector shell
  - viewport stats
  - current task plus queue/archive truth
  - accepted change-impact summary and grouped rows
- the missing next truth is that the runtime no longer fits comfortably inside a single-worker, single-bar mental model
- newer worker planning now points toward:
  - split `Draft` versus `B-Rep` workers
  - lane-specific latest-intent and freshness truth
  - mixed-lane `Auto` behavior
  - later graph-native parallel execution
- the next honest inspector delivery should therefore keep cards, but change what a card means:
  - one card should represent one meaningful runtime work unit
  - the rows or bars inside that card should represent the execution lanes currently relevant to that work unit

Locked recommendation:
- keep cards as the stable primary runtime unit
- do not explode `Draft` and `B-Rep` into unrelated top-level cards when they belong to the same work unit
- let the card header explain the work unit
- let the internal lane rows explain how that work unit is progressing across `Draft`, `B-Rep`, and later branch-parallel execution
- scale into true graph-parallel execution by widening card internals first, not by immediately redesigning the whole inspector surface

### Current Code-Backed Read

The strongest owner seams for this phase are:

- worker/runtime lane truth under the newer worker direction
  - already now reads as split `Draft` versus authoritative `B-Rep` execution rather than one serial worker job
- `src/app/store/runtimeInspectorTaskStore.ts`
  - is the current queue/archive owner seam for runtime-inspector task truth
  - is the strongest likely place to widen one card entry from a single visible progress fact into one card with lane-local child rows
- `src/app/store/runtimeInspectorVm.ts`
  - is the current combined inspector shaping seam
  - is the strongest owner for turning lane-local runtime truth into one calm visible card VM without pushing grouping logic into JSX
- `src/app/components/TitleStatusBar.tsx`
  - is the current presentation seam for runtime-inspector cards
  - is the strongest visible owner for widening a card body from one progress bar into one or more lane rows
- the shipped `Worker-Vision-1`, `Worker-Vision-2`, and `Worker-Vision-3` lanes
  - already widened runtime truth with:
    - `superseded`
    - delayed and suppressed draft narration
    - split draft-versus-authoritative workers
    - layered `Auto` viewport behavior
  - which means the card model should now read lane-aware instead of pretending one active row tells the whole story

### Product Direction

The recommended shape is:

- one top-level card per meaningful runtime work unit
  - for example one graph build target, output-preview target, or later branch-owned execution unit
- one or more lane rows inside that card
  - for example:
    - `Draft Geometry`
    - `B-Rep Geometry`
    - later `Export`
    - later branch-local geometry lanes if they become honest runtime truth

This means:
- the card header answers:
  - what work unit is this
  - why is it active
  - which authored/runtime target does it belong to
- the lane rows answer:
  - which execution lanes are active or relevant
  - which lane is running now
  - which lane is waiting, reused, delayed, suppressed, or superseded
  - which lane bar should animate and how far it has progressed

### Card Model

Recommended first card anatomy:

- `Card Header`
  - work-unit title
  - compact status chip
  - graph or target identity
  - reason line such as `changed by Hook Radius`
- `Lane Rows`
  - one row per relevant execution lane
  - row label
  - row state
  - row-local loading bar when real progress exists
  - row detail or hold reason when progress should not animate
- `Card Footer`
  - compact visible-result summary such as:
    - `showing Draft`
    - `showing retained Final + Draft overlay`
    - `Final suppressed by Browser off`

Important rule:
- the card stays the user-facing unit
- the lane rows stay the execution-facing unit
- do not force the user to mentally regroup separate top-level cards just to understand that draft and `B-Rep` belong to the same rebuild target

### Lane Row Rules

Useful first lane rows:
- `Draft Geometry`
- `B-Rep Geometry`

Useful later lane rows only when runtime truth exists:
- `Export`
- branch-local geometry lanes
- later scheduler-owned grouped branch progress beneath one output or part card

Useful first lane states:
- `queued`
- `running`
- `done`
- `reused`
- `error`
- `superseded`
- `delayed`
- `released`
- `replaced`
- `suppressed`

Important rule:
- show a loading bar only when the lane has real progress truth
- if a lane is waiting, delayed, suppressed, or superseded, prefer explicit labeled state over a fake moving bar
- do not show `0%` as if it were real progress when the honest truth is `waiting for release` or `suppressed by policy`

### `Auto` Behavior

The first mixed-lane card behavior should be:

- when viewport mode is `Auto` and both lanes are relevant:
  - keep one card
  - render one `Draft Geometry` row
  - render one `B-Rep Geometry` row
- the draft row can show live responsive progress
- the `B-Rep` row can show companion authoritative progress, waiting, delay, suppression, or reuse

Important rule:
- do not split this into two top-level active cards unless runtime ownership later proves they truly belong to different work units
- `Auto` should read as one authored/runtime story with two lane-local bars, not as two disconnected jobs the user has to correlate manually

### Relationship To Queue And Archive

`VRI-4` should widen the meaning of a card, not throw away the queue/archive work already shipped.

Recommended rule:
- queue and archive should still organize top-level cards
- each top-level card may now contain one or more lane rows

This means:
- `Active Queue`
  - ordered work-unit cards still waiting or running
- `Archive`
  - recently resolved work-unit cards, with archived lane outcomes preserved compactly where useful

Important rule:
- do not let lane rows become a second competing top-level queue
- lane rows belong inside a card unless later graph-parallel execution truly needs a deeper grouped section

### Relationship To Future Graph-Parallel Execution

Later true multi-thread processing with parallel graph lanes should still fit this card model if the widening is done carefully.

Recommended first rule:
- keep one top-level card for the authored or runtime work unit the user recognizes
- if that unit later fans into several graph-parallel branches, let the card widen internally before the whole inspector is restructured

Useful later shape:
- `Card`
  - `Draft Geometry`
  - `B-Rep Geometry`
  - `Parallel Branches`
    - `Branch A`
    - `Branch B`
    - `Branch C`

Important rule:
- only widen into visible branch groups once the scheduler/runtime truly exposes honest branch-local truth
- do not fake branch bars from aggregate worker occupancy
- a branch subgroup should exist only when the user gains understanding from it

### Why Cards Should Stay

Keeping cards still has strong product value:

- users recognize cards more easily than a raw scheduler table
- cards keep authored/runtime identity visible while execution truth grows more complex
- lane rows inside a card are easier to read than forcing the user to correlate several top-level rows with the same title
- cards remain compatible with later queue/archive, change-impact, and branch-parallel growth

The card should therefore remain:
- the stable explanation unit

The lane rows and bars should become:
- the scalable execution-detail unit

### Phase Breakdown

1. `VRI-4.1 - Multi-Lane Card Contract And Store Widening`
Reason:
- the first honest cut is widening the current runtime-inspector card/read model so one card can preserve lane-local rows and states before visible multi-bar UI lands
Current status:
- not started
- current handoff:
  - `VRI-4.2 - Multi-Bar Card Surface`

2. `VRI-4.2 - Multi-Bar Card Surface`
Reason:
- once the widened card VM exists, the next smallest useful value is rendering one card with more than one lane-local loading bar or state row
Current status:
- not started
- current handoff:
  - `VRI-4.3 - Auto Mixed-Lane Card Truth`

3. `VRI-4.3 - Auto Mixed-Lane Card Truth`
Reason:
- after multi-bar cards exist, the next missing truth is the first honest `Auto` case where one card can show both `Draft Geometry` and `B-Rep Geometry`
Current status:
- not started
- current handoff:
  - `VRI-4.4 - Parallel Branch Grouping Contract`

4. `VRI-4.4 - Parallel Branch Grouping Contract`
Reason:
- once lane-local card behavior is stable, the next future-proofing step is defining how later graph-parallel branches widen the same card model without turning each branch into an unrelated top-level card
Current status:
- not started
- current handoff:
  - `VRI-4.5 - Card Hardening And Family Handoff`

5. `VRI-4.5 - Card Hardening And Family Handoff`
Reason:
- once the multi-lane and branch-grouped card model exists, the last work is hardening copy, hidden-state behavior, archive carry-forward, and the family handoff into later deeper scheduler or graph-parallel visualization
Current status:
- not started
- this closes `VRI-4` as the first honest multi-lane card subset

## [ ] VRI-4.1 - Multi-Lane Card Contract And Store Widening

### Purpose

Widen the runtime-inspector card/read model so one visible card can preserve one or more lane rows before presentation code grows new bars.

### Owns

- the first card-local lane list shape
- lane-local state and progress ownership
- preserving one stable card header identity while widening the card body

### Does Not Own

- final card styling
- branch-parallel subgroup rendering
- generic worker-pool occupancy dashboards

### Locked Direction

- keep one card entry as the stable top-level queue/archive item
- add one child lane-row list beneath that card
- preserve lane-local fields such as:
  - lane id
  - lane label
  - lane state
  - lane-local progress
  - lane-local detail
- keep card-header meaning stable:
  - title
  - reason
  - target identity
- do not force `TitleStatusBar.tsx` to assemble lane-grouping logic inline

### Expected File Targets

Primary implementation files:
- `src/app/store/runtimeInspectorTaskStore.ts`
- `src/app/store/runtimeInspectorVm.ts`

Likely supporting files:
- `src/app/bootstrapBuildWiring.ts`
- `src/app/bootstrapBuildWiring.test.ts`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`

### First Proof

- one active runtime card can expose more than one lane row in app-facing state
- lane rows stay attached to one card identity
- lane states such as `running`, `reused`, `superseded`, `delayed`, and `suppressed` can coexist without flattening into one misleading card-level status

## [ ] VRI-4.2 - Multi-Bar Card Surface

### Purpose

Render the first visible card body that can show multiple lane-local bars or state rows beneath the same card header.

### Locked Direction

- keep one card header
- render lane rows beneath it
- animate only the rows that truly have running progress
- keep waiting or suppressed rows visibly honest without fake bar motion
- keep card styling calm enough that two bars feel like one work unit, not two competing cards

### Expected File Targets

Primary implementation files:
- `src/app/components/TitleStatusBar.tsx`
- `src/app/theme/foundation/base.css`

Likely supporting files:
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`

### First Proof

- one card can show two visible lane rows
- each row can own its own loading bar
- non-running rows can render honest non-progress states without being mistaken for broken progress bars

## [ ] VRI-4.3 - Auto Mixed-Lane Card Truth

### Purpose

Lock the first honest `Auto`-mode card behavior where `Draft Geometry` and `B-Rep Geometry` belong to the same visible runtime card.

### Locked Direction

- in `Auto`, one card may show:
  - `Draft Geometry`
  - `B-Rep Geometry`
- `Draft` can progress independently
- `B-Rep` can run, wait, delay, reuse, or remain suppressed independently
- the card footer or summary should explain which result lane is currently visible
- keep lane freshness and suppression truth owned by worker/app runtime seams, not inferred in presentation

### Expected File Targets

Primary implementation files:
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/components/TitleStatusBar.tsx`

Likely supporting files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- focused store or viewer proof as needed

### First Proof

- `Auto` can show one card with both `Draft Geometry` and `B-Rep Geometry`
- the visible card does not imply that `B-Rep` is current just because a retained authoritative result exists
- Browser `manual` and `off` remain honest inside the `B-Rep` lane row

## [ ] VRI-4.4 - Parallel Branch Grouping Contract

### Purpose

Prepare the card model for later true graph-parallel execution by defining the first calm internal grouping shape for branch-local progress beneath one card.

### Locked Direction

- keep the top-level card as the primary unit
- allow a later optional grouped branch subsection inside the card
- only render branch groups when runtime truth truly exposes branch-local execution
- do not widen immediately into a scheduler-grid or per-thread dashboard

### Expected File Targets

Primary implementation files:
- `src/app/store/runtimeInspectorTaskStore.ts`
- `src/app/store/runtimeInspectorVm.ts`

Likely supporting files:
- whichever scheduler/runtime seam first publishes honest branch-local truth
- focused store proof

### First Proof

- one card can preserve grouped branch rows without losing the card header identity
- branch grouping remains optional and hidden when runtime truth is not present
- later graph-parallel execution can widen the same card model without forcing a full runtime-inspector redesign

## [ ] VRI-4.5 - Card Hardening And Family Handoff

### Purpose

Close the first multi-lane card lane by hardening copy, hidden-state behavior, archive carry-forward, and the handoff to later deeper scheduler or graph-parallel visualization.

### Locked Direction

- keep cards as the stable visible unit
- keep lane rows as the stable execution-detail unit
- preserve calm archive behavior for multi-lane cards
- prove repeated supersession, delay, suppression, and replacement do not leave stale lane rows or stale bar states behind
- hand forward to later graph-parallel or occupancy-focused work without promising a profiler before the runtime truly exposes that truth

### Expected File Targets

Primary implementation files:
- `src/app/store/runtimeInspectorVm.ts`
- `src/app/components/TitleStatusBar.tsx`

Likely supporting files:
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- focused runtime/store proof where lane cleanup needs hardening

### First Proof

- multi-lane cards stay readable through repeated churn
- archive truth remains calm and distinct for resolved multi-lane cards
- later family work can widen into deeper graph-parallel visibility without replacing the card model again

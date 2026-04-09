# Viewport Runtime Inspector

## Doc Header

### Doc History
2. 2026-04-09 07:05: Reframed this moved architecture vision note as the long-form direction doc for a real `Viewport Runtime Inspector` mini-family, adding pointers to the new family index plus standalone `VRI-1` future phase so the vision stays product-facing while implementation-ready chunking lives in dedicated phase docs
1. 2026-04-03 17:45: Created this wish-feature planning doc to define a viewport-local runtime inspector for `ParaHook Generator v20`, covering viewport stats, worker activity cards, rebuild ordering, and change-impact visualization for procedural model updates

### Purpose

This doc defines the future `Viewport Runtime Inspector` direction for ParaHook.

Use it to answer:
- what model and viewport information should be visible directly under the `ParaHook Generator v20` title card
- how worker progress should be exposed as meaningful build-unit cards instead of one opaque loading bar
- how parameter edits should reveal what is rebuilding, what is reused, and what stays untouched
- which parts of the feature are lightweight UI improvements versus deeper worker and dependency-graph work

### Why This Doc Exists

The current top-left viewport title panel already communicates high-level generator state with a compact status bar and progress track.

That is useful, but it does not yet answer the more important questions users ask once the model grows:
- what is in the viewport right now
- how heavy is the scene
- what exactly is the worker doing
- which parts of the model changed because of the last parameter edit
- which parts did not need to rebuild

This doc exists to turn that small title panel into a more explicit runtime-inspection surface before implementation planning begins.

The goal here is not to lock the final UI or implementation details yet.

The goal is to:
- describe the product shape in clear terms
- identify the most valuable information layers
- separate immediate UI wins from deeper execution-graph features
- prepare the feature to split into later architecture work if it proves important

The standalone family planning surfaces now live at:
- `docs/Human-Plans/Architecture/Worker/Viewport-Runtime-Inspector/Viewport-Runtime-Inspector-Index.md`
- `docs/Human-Plans/Architecture/Worker/Viewport-Runtime-Inspector/Future/Viewport-Runtime-Inspector_Phase VRI-1 - Foundation Runtime Surface.md`

### Scope

This doc covers:
- viewport and model stats shown directly in the left dock under the generator title card
- worker build order and worker activity cards
- rebuild status visibility for parameter-driven updates
- change-impact visualization for procedural rebuilds
- later card states such as queued, active, reused, done, and error

This doc does not cover:
- a full profiler for every subsystem in the app
- low-level GPU debugging tools
- a final dependency-graph engine design
- a final telemetry storage format
- unrelated viewport chrome changes

## Doc Body

### Short Version

ParaHook should eventually expose a viewport-local runtime inspector beneath the existing `ParaHook Generator v20` title card.

That inspector should help the user understand three things at a glance:
- what the current viewport contains
- what the worker is doing right now
- what changed because of the latest edit

This should feel less like a generic dropdown and more like a compact task manager for procedural model rebuilding.

### Current Goal For This Doc

This document should stay focused on feature capture first.

The intended workflow is:
1. define the visible product behavior
2. identify the useful categories of runtime truth
3. separate first-pass UI from deeper worker/dependency work
4. split the resulting work into architecture sub-phases later if needed

Until that later split happens, this doc should avoid overcommitting to implementation details.

### Product Direction

The existing title card should stay the compact summary surface:
- product name
- current overall state
- overall progress bar

When the user clicks or expands that title card, a secondary panel should appear directly underneath it inside the same left dock.

That expanded panel should become the home for:
- viewport stats
- active worker cards
- build queue visibility
- change-impact and rebuild visibility

This lets the current title bar keep its compact always-visible role while also growing into a richer inspection surface when the user wants detail.

### Core Sections

The strongest initial layout is three stacked sections:

- `Viewport`
  - scene and viewport metrics
- `Now Building`
  - current active worker work item
- `Change Impact`
  - what rebuilt, what reused cached results, and what remained untouched

Later, a fourth section can become useful:

- `Build Queue`
  - upcoming and recently completed work cards

### Viewport Stats

The expanded panel should show compact scene and viewport metrics that help the user understand rendering and scene complexity immediately.

Useful first stats:
- triangle count
- line count
- point count
- FPS

Useful later stats:
- draw calls
- selected object or selected node
- active viewport id when multiple model viewports exist
- camera mode
- memory or buffer usage if that becomes meaningful and stable enough to trust

One strong first layout is a compact stat grid beneath the title card so the panel feels valuable even when no build is running.

### Worker Activity Cards

The build system should become visible through worker activity cards rather than only through one global progress fill.

Each card should represent a meaningful build unit such as:
- body mesh
- cable hook pass
- spaghetti solve
- normals rebuild
- viewport upload
- browser summary refresh

The important idea is that the user should see work as named units, not just as anonymous progress.

### Ordered Queue Behavior

The runtime inspector should treat the active work list as an ordered queue.

Useful first rule:
- the first task sits at the top
- later tasks appear underneath it in order
- the worker always processes the task at the top first
- when that top task completes, the next task rises into the top position

This means the active list should read as true execution order from top to bottom.

The user should be able to understand immediately:
- what is being worked on now
- what is next
- how much work remains in the queue

### Card Progress Bars

Each visible task card in the active queue should have its own task-local loading bar.

That card bar should represent only the progress of that one task.

Useful first interpretation:
- the active top card animates and advances while the worker processes it
- queued cards below it can show idle or empty progress bars until they begin
- when a queued card becomes the new top active item, its local progress bar becomes live

This keeps a clean distinction between:
- per-task progress
- total-job progress

### Active Queue And Archive

The runtime inspector should eventually have at least two list regions:

- `Active Queue`
  - ordered tasks still waiting to run or currently running
- `Archive`
  - completed, reused, skipped, or otherwise resolved tasks that have left the active queue

When a task finishes:
- it should leave the active queue
- it should move into the archive area rather than disappearing without trace
- the next queued task should become the top active card

Useful UX rule:
- completed cards can linger briefly before settling into archive so the queue feels alive and understandable instead of abruptly popping

The archive should stay visually quieter than the active queue.

Useful first archive groups:
- `Completed`
- `Reused`
- `Error`

### Total Job Progress Versus Card Progress

The main loading bar at the top of `ParaHook Generator` should always represent the total current job.

It should not represent only the active top card.

This is an important product rule:
- card bars represent individual task progress
- the title-bar progress represents the combined total workload across the whole active job

This lets the compact title card continue to communicate the broad build state while the expanded inspector explains the details.

### Mid-Build Task Insertion

The total-job progress bar should remain honest even when new tasks are added while work is already in progress.

That means if the user changes a parameter mid-build and new work is injected:
- the active queue should grow
- the total workload should increase
- the main title-bar progress should recalculate against the new total workload

Useful result:
- the total bar may slow down
- the total bar may pause
- the total bar may even appear to step backward slightly if the true remaining work increases

That is correct behavior as long as the UI makes it clear that new work entered the queue.

Useful later affordances:
- a subtle `queue updated` pulse
- a small note such as `+4 tasks added by Hook Radius`
- a brief highlight on newly inserted cards

### Queue Truth And User Trust

This queue model matters because it tells the user the truth about the actual build burden.

A fake monotonic progress bar that ignores newly added tasks would feel smoother in the moment, but it would hide the real reason a build took longer than expected.

The better rule is:
- keep the total progress honest
- keep the task cards readable
- make queue changes visible when the workload changes mid-build

This will become especially important once ParaHook supports larger procedural rebuild chains and partial invalidation behavior.

### Queue Patching Versus Worker Restart

Not every new parameter edit should force the worker to restart from scratch.

The useful distinction is:
- cards that are still queued and have not started yet
- the card that is currently active
- cards that already completed

Useful first rule:
- queued cards should remain editable plan objects until execution actually begins

That means if the user changes a parameter on a later CAD command while that command's card is still pending in the queue, the system should prefer patching that queued card rather than restarting the worker.

### Pending Card Mutation

Example:
- the user changes CAD command `4`
- the system queues rebuild cards for commands `4` through `10`
- before the worker has processed cards `4` and `5`, the user changes a parameter in CAD command `6`

In that situation, the best behavior is usually:
- do not restart the whole worker
- update the queued rebuild plan in place
- rewrite or replace the pending card for CAD command `6`
- keep the worker pointed at the front of the queue

This means the user is effectively changing the queued card before it becomes active work.

That is desirable because the worker has not spent any real execution time on that command yet.

### Execution Boundary

The queue should have a clear execution boundary:
- tasks above the boundary already ran
- the task at the boundary is active now
- tasks below the boundary are still mutable queued work

This boundary matters because it decides which kind of update behavior is appropriate.

Useful interpretation:
- pending cards can be patched
- active cards may need cancellation, checkpointing, or supersession
- completed cards may need invalidation and requeueing

### Suggested Queue Update Rules

Useful first queue rules:

- if a card has not started yet
  - patch or replace it in the queue
- if a new edit affects only pending downstream cards
  - do not restart the worker
  - update the queued plan in place
- if a new edit affects the currently active card
  - decide whether to cancel immediately, stop at a safe checkpoint, or mark the active card as superseded
- if a new edit affects already completed cards
  - invalidate from that command onward and queue fresh rebuild work

This lets the worker behave intelligently instead of overreacting to every new change.

### Revision-Aware Queue Behavior

The queue should still remain revision-aware even when pending cards are patched.

That means:
- the system should know which rebuild plan is current
- stale queued work should be replaceable before execution begins
- stale active or completed work should be marked honestly if a newer edit supersedes it

Useful later status values here:
- `updated`
- `superseded`
- `cancelled`

This would help the runtime inspector explain whether a task was:
- modified before it started
- interrupted while active
- replaced by a newer rebuild plan

### Why This Matters

This behavior is especially important for larger procedural models.

Without queue patching, a fast sequence of user edits could cause the system to:
- restart too often
- waste time finishing irrelevant work
- make the queue feel unstable

With queue patching, the system can behave more like a smart planner:
- preserve useful work already at the front of the queue
- rewrite pending downstream work before it starts
- only restart or cancel when the execution boundary actually requires it

That will make the runtime inspector feel much more believable once users begin editing commands deep inside larger CAD histories.

### Worker Card States

Useful first card states:
- `queued`
- `active`
- `done`
- `reused`
- `invalidated`
- `error`

Why this matters:
- `done` means work happened and completed
- `reused` means the system intentionally skipped rebuilding because the result was still valid
- `invalidated` means a prior result was marked stale by an upstream change
- `active` tells the user where time is being spent now

This distinction will be especially important as models become larger and users start asking whether a parameter edit triggered a full rebuild or only a local one.

### Change Impact Visualization

The most valuable long-range feature is not only progress visibility.

It is dependency impact visibility.

When a user changes a parameter, the runtime inspector should answer:
- what was invalidated
- what is rebuilding now
- what reused prior results
- what was unaffected

This could be shown as grouped cards or grouped rows:

- `Rebuilding Now`
- `Queued`
- `Reused`
- `Unaffected`

This would let the system teach the user how their graph behaves instead of forcing them to guess.

### Why Change Impact Matters

As projects grow, users will want to understand:
- which spaghetti areas depend on which parameters
- whether one small tweak caused a broad rebuild
- whether caching or partial rebuild behavior is working correctly
- why some visual regions updated while others remained unchanged

A visible rebuild map creates trust in the procedural system.

It also helps with:
- performance understanding
- graph debugging
- dependency comprehension
- future optimization work

### Card Content Suggestions

Each worker or impact card could eventually display:
- card title
- status chip
- progress bar when active
- reason line such as `invalidated by Hook Radius`
- duration such as `18 ms`
- optional tags for upstream dependencies or affected targets

Useful examples:
- `Spaghetti Solve`
  - active
  - invalidated by `Hook Tension`
- `Body Mesh`
  - reused
  - unchanged by latest edit
- `Viewport Upload`
  - queued
  - waiting on mesh output

### Relationship To Spaghetti

This feature becomes especially useful if it can later point back to spaghetti regions or graph-owned build units.

Useful long-range behavior:
- show which authored graph areas were touched by the last edit
- show which graph areas were not touched
- let the user understand why a particular worker card exists
- later support jumping from a runtime card to the related graph location

This should feel like procedural dependency visibility, not merely a list of logs.

### Interaction Suggestions

Useful interaction rules:
- keep the title card compact when collapsed
- let the expanded panel appear directly underneath inside the same dock
- auto-open the panel briefly on long rebuilds or errors
- keep reused and unaffected items visible but visually quieter
- let the active work card feel more prominent than queued or completed items

Useful later interactions:
- filter to `Only Changed`
- pin the inspector open
- hover a card to highlight affected geometry or graph regions
- click a card to reveal upstream and downstream dependencies

### Good First Product Shape

The best first practical cut is probably:
- compact title card remains as-is
- expand/collapse behavior lands beneath it
- first stat grid shows triangles, lines, points, and FPS
- one current worker card shows active task name and progress
- one small recent-or-queued list shows what is next

That already gives users much more insight without requiring the full dependency map on day one.

### Architecture Suggestions

Keep a healthy separation between:
- viewport rendering statistics
- worker execution state
- dependency invalidation state
- historical or diagnostic telemetry

One useful rule:
- the inspector should not invent fake worker truth only for UI polish
- the worker and rebuild system should expose honest named work units and states that the UI can render directly

Another useful rule:
- do not collapse `reused` and `done` into the same presentation state
- users need to know when the system skipped work correctly

### Data Ownership Suggestions

Likely ownership layers:
- viewport stats come from the viewer/runtime side
- worker card state comes from the build worker or build orchestration layer
- change-impact groups come from dependency invalidation and execution planning
- the dock UI simply renders that combined state in a viewport-local way

This should become even more important now that ParaHook supports more than one model viewport.

### Suggested Planning Phases

The runtime inspector vision appears large enough to split into several phases later.

The most practical planning ladder is:

- `Phase 1 - Expandable Title Panel`
  - make the existing title status surface expandable
  - add one viewport-local details panel beneath it
  - keep the first cut lightweight and UI-focused

- `Phase 2 - Viewport Stats`
  - expose triangle, line, point, and FPS metrics
  - add the compact stats grid
  - ensure the values are stable and understandable

- `Phase 3 - Active Worker Card`
  - expose the currently active build unit from the worker/build pipeline
  - render current task name, state, and progress

- `Phase 4 - Build Queue Visibility`
  - expose queued and recently completed work units
  - differentiate active, queued, done, and reused states visually

- `Phase 5 - Parameter Change Impact`
  - connect parameter edits to invalidated build units
  - show what rebuilt, what reused results, and what was unaffected

- `Phase 6 - Spaghetti And Dependency Visualization`
  - relate impact cards back to spaghetti or graph regions
  - allow the user to inspect why a rebuild happened
  - support graph- or geometry-linked highlighting

- `Phase 7 - Runtime Inspector Stabilization`
  - review which parts belong in `Wish-Features` versus `Architecture`
  - promote the mature execution and dependency pieces into deeper architecture docs

### Recommended First Cut

If the goal is to make this useful soon with the least risk, the best first target is probably:
- `Phase 1`
- `Phase 2`
- the smallest viable slice of `Phase 3`

That would give ParaHook:
- a richer expandable title panel
- immediate viewport stats
- one visible current worker task
- a stronger sense of runtime truth without requiring full dependency-map work yet

### Good First Non-Goals

- full engine-profiler depth on day one
- perfect dependency introspection before the UI lands
- GPU debugger style instrumentation
- a giant logging console embedded in the dock
- pretending broad rebuild visibility exists before honest worker/build-unit naming exists

### Scope Buckets For Later Phase Splitting

Likely feature groups to evaluate later as separate sub-phases:
- expandable viewport title panel and dock layout
- viewport stats collection and presentation
- worker task naming and progress exposure
- build queue and completion history presentation
- invalidation and reuse-state visibility
- parameter-to-build-unit dependency mapping
- spaghetti-region or graph-region highlight integration
- multi-viewport runtime-inspector ownership rules

These buckets should help determine what belongs in the first UI-focused cut versus later worker and dependency architecture work.


# Viewport Runtime Inspector 2

The longer-range professional-CAD direction should not treat the runtime inspector like a generic system monitor.

The more valuable goal is explaining execution truth clearly:
- what is active now
- what is queued next
- what reused prior results
- what failed
- which execution backend is doing the work

A strong long-range shape is:
- one explicit scheduler or build planner
  - owns queue order, cancellation, invalidation, and safe parallel execution boundaries
- one or more execution workers
  - own the actual compute work
- one explicit execution backend
  - such as JS today, WASM later, or a later kernel-facing runtime
- one runtime inspector surface
  - renders that truth without inventing fake task order, fake reuse states, or fake CPU detail

This means the inspector should grow toward showing:
- active task count
- queued task count
- reused or skipped task count
- superseded or canceled task count when that truth exists
- worker pool occupancy later, such as `1/4 workers busy`
- execution backend identity later, such as `JS` or `WASM`

It should not rush into pretending it is a full profiler.

Early honest signals are more valuable than decorative low-level telemetry:
- queue order
- task state
- task-local progress
- archive outcome
- accepted backend identity

Later system-level details can become useful only when the runtime truly exposes them:
- worker pool width
- backend kind
- multi-threaded execution state
- memory or deeper performance counters

The important product rule is:
- prefer scheduler truth over CPU trivia
- prefer execution ownership over decorative load bars
- prefer explicit backend identity over vague `fast` or `optimized` language

That direction should keep `Viewport Runtime Inspector` feeling like a professional CAD execution surface instead of a generic developer dashboard.

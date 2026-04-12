# Cleanup Vision

## Doc Header

### Doc History
1. 2026-04-12 17:05: Added this dedicated Cleanup vision doc after a whole-`src` audit of `/20/parahook` found that the current codebase is not random, but it is carrying a large amount of dead residue, transitional seams, oversized ownership surfaces, and toolchain breakage that now need a deliberate cleanup ladder instead of one-off opportunistic edits

### Purpose

This doc captures the forward-looking Cleanup vision for ParaHook.

Use it to answer:
- what cleanup should mean in this repo beyond "make it prettier"
- which cleanup work should happen before more feature growth
- how dead code, legacy seams, and ownership boundaries should be handled
- what a healthier post-cleanup codebase should feel like

Do not use it for:
- proving that a specific cleanup item already shipped
- detailed implementation checklists
- one-pass delete-everything rewrite planning

### Relationship To Other Docs

- `System-Map.md`
  - current architecture map
  - ownership baseline
  - where cleanup boundaries should converge

- `Worker/Worker-Vision.md`
  - worker scheduling north star
  - useful for separating worker cleanup from app-shell cleanup

- `AppShell/Future/AppShell 4 - Workspace Host Reorganization And Readability Cleanup.md`
  - focused AppShell readability and host extraction direction
  - one major lane that should later live under this broader cleanup umbrella

## Doc Body

### Why This Doc Exists

ParaHook has grown real product direction:
- graph authoring
- worker-driven build execution
- viewer output
- browser-managed project content
- workspace surfaces such as console, dashboard, notepad, and radio

The problem is not that the repo is shapeless.

The problem is that the repo now has too much:
- legacy carry-forward behavior
- half-retired compatibility seams
- placeholder files that never became real systems
- very large stores and UI hosts that own too many jobs
- toolchain rules that describe a cleaner architecture than the code currently follows

Cleanup now needs to be treated as a real architecture lane.

Without that:
- every new feature lands on unstable surfaces
- bugs become harder to localize
- "legacy" logic never actually dies
- lint and type-check stop being trustworthy gates

### Current Audit Snapshot

The `/20/parahook/src` audit found a few strong patterns.

#### 1. The app layer is carrying most of the project weight

Approximate current source footprint:
- `src/app`
  - about `207k` lines
- `src/viewer`
  - about `10.7k` lines
- `src/worker`
  - about `6.7k` lines
- `src/runtime`
  - about `1.3k` lines

This means most complexity currently lives in app-side orchestration, shell state, selectors, panel logic, and editor surface logic rather than in the geometry or worker core.

#### 2. The codebase currently fails its own baseline health checks

Current audit result:
- `npm.cmd run build`
  - failing
- `npm.cmd run lint`
  - failing with a large backlog

This means cleanup cannot stay cosmetic.
Baseline toolchain health must become a first-class cleanup target.

#### 3. There is real dead residue

Examples found during the audit:
- the default Vite starter still exists in `src/App.tsx`
- there are multiple zero-byte source files in:
  - `src/geometry/`
  - `src/viewer/renderers/`
  - `src/viewer/scene/`
  - `src/app/components/`
  - `src/app/panels/`
  - `src/app/store/`

Those files are not transitional implementation.
They are residue and should be either:
- deleted
- replaced with real code
- or moved into docs if they are only placeholders for future intent

#### 4. Several major files have become ownership sinks

Large current hotspots include:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/viewer/Viewer.ts`
- `src/app/panels/useBrowserPanelController.ts`

These files are not merely "long."
They are holding too many different reasons to change.

#### 5. The repo contains explicit architecture rules that are not yet true in code

Example:
- lint says worker-facing contracts should go through `app/protocol.ts`
- that file does not currently exist
- worker files still import directly from app internals

This is important because it means the codebase already knows what cleaner boundaries should look like.
Cleanup work is partly about making the implementation catch up with its own rules.

#### 6. Runtime migration and compatibility logic still lives on hot paths

Examples found during the audit:
- runtime legacy split-view migration still happening in AppShell
- `LEGACY_*` build identities still present in worker-facing build code
- foothook compatibility adapter still acting as a retained bridge
- pipeline still hardcoding stub execution modes

This is the classic sign that old paths were preserved but never fully retired.

### Cleanup North Star

ParaHook cleanup should move the codebase toward a state where:
- the app starts from one honest entry path
- dead surfaces are actually removed, not merely hidden
- architecture boundaries are enforced by code, not only by docs and lint intentions
- each major subsystem has one clear owner
- migrations are finite and get retired after they serve their purpose
- build, lint, and tests become trustworthy again

The cleanup target is not "perfect abstraction."

The cleanup target is:
- smaller ownership surfaces
- fewer fake or empty modules
- fewer compatibility seams
- less surprise in where behavior lives
- a repo that is easier to safely extend

### What Cleanup Means Here

Cleanup in ParaHook should mean all of the following:

#### 1. Restore baseline health

Typecheck, lint, and tests should describe reality again.

If the codebase is red by default:
- every change starts from uncertainty
- regressions are harder to separate from existing debt
- "cleanup" becomes guesswork

#### 2. Delete dead residue

If a file, mode, or feature path is not part of the real product:
- remove it
- do not keep it as sentimental scaffolding

A dead file is not harmless.
It creates false architecture.

#### 3. Retire compatibility seams after the migration is complete

A temporary bridge should be temporary.

If a compatibility seam survives long enough to feel normal, it starts acting like permanent product architecture.
That should be treated as debt, not as success.

#### 4. Split oversized modules by ownership

When one file owns:
- data truth
- UI formatting
- side effects
- migration logic
- persistence
- debug behavior

it becomes hard to change safely.

The right split is by ownership, not by arbitrary line count.

#### 5. Align code with actual product scope

Some surfaces may be core:
- Spaghetti editor
- Browser
- worker pipeline
- viewer

Some surfaces may be secondary:
- dashboard
- notepad
- radio

Cleanup should force an explicit decision:
- keep and support
- isolate as optional
- or retire

### Non-Goals

Cleanup should not mean:
- rewriting the entire app from scratch
- replacing every large file before shipping anything else
- abstracting systems that are still unsettled product-wise
- deleting live user-facing capability just because it is inconvenient
- inventing a new architecture language while the old problems remain unfixed

Important rule:
- prefer honest reduction over ambitious reinvention

### Cleanup Principles

#### 1. Green Before Pretty

Restore build, lint, and test trust first.

Reason:
- a repo without a healthy baseline makes later cleanup harder to verify

#### 2. Delete Before Abstract

When facing residue, ask in this order:
1. can this be deleted?
2. if not, can it be isolated?
3. only then ask whether it should be generalized

#### 3. Shared Contracts Should Live In Shared Places

Worker, app, and viewer boundaries should depend on shared contracts instead of reaching into each other's internal implementation folders.

#### 4. Migrations Should End

A migration path should always have:
- a reason
- a temporary bridge
- a retirement point

If retirement never happens, cleanup should treat that as unfinished work.

#### 5. Stores Should Own Truth, Not Everything

Large stores should hold canonical state and explicit actions.
They should not quietly become:
- persistence layers
- migration layers
- selector factories
- UI command routers
- runtime glue sinks

#### 6. Debug Paths Should Be Explicit

Perf probes, debug logging, and investigation helpers are useful.
But they should be clearly intentional, removable, and separated from normal runtime behavior.

#### 7. Tooling Should Tell The Truth

Lint rules, TS strictness, and architecture restrictions should describe the real intended boundaries.

If a rule is permanently ignored in practice, either:
- fix the code
- or fix the rule

Do not keep both stories alive.

### Main Cleanup Lanes

#### Cleanup Lane 1 - Baseline Health Recovery

Goal:
- restore trustworthy typecheck, lint, and test baselines

This lane includes:
- fixing current `build` failures
- reducing lint noise to meaningful failures
- scoping lint away from generated or vendored artifacts when appropriate
- keeping new cleanup work from increasing baseline noise

Exit condition:
- the repo can return to green locally with intentional rules

#### Cleanup Lane 2 - Dead File And Placeholder Retirement

Goal:
- remove files and paths that are no longer part of real runtime architecture

This lane includes:
- deleting default starter residue
- auditing zero-byte files
- removing unused placeholders from `geometry`, `viewer`, and app-side folders
- moving future-only placeholders into docs instead of source folders

Exit condition:
- source folders only contain real runtime code, tests, or intentionally active stubs

#### Cleanup Lane 3 - Boundary Repair

Goal:
- make app, worker, viewer, and shared contracts line up with the intended architecture

This lane includes:
- creating a real shared protocol/contracts surface for worker-facing data
- removing direct worker imports from app-internal implementation folders
- making viewer and worker boundaries explicit and enforceable

Exit condition:
- architecture restrictions are mostly enforced by real code layout, not only by aspiration

#### Cleanup Lane 4 - App Shell And Workspace Simplification

Goal:
- reduce the top-level shell from "everything host" toward a clearer workspace runtime

This lane includes:
- reducing AppShell migration responsibility
- extracting persistence hydration from hot composition paths
- simplifying detached/popout/floating surface ownership
- removing completed legacy workspace migration logic

Exit condition:
- AppShell is mostly composition, coordination, and host wiring rather than long-lived debt storage

#### Cleanup Lane 5 - Spaghetti Surface Decomposition

Goal:
- break the editor system into clearer ownership slices

This lane includes:
- splitting `useSpaghettiStore`
- splitting `NodeView`
- separating graph truth, view-model shaping, and widget rendering
- removing editor debug/perf residue from the main runtime path

Exit condition:
- the Spaghetti editor is still feature-rich, but easier to reason about by subsystem

#### Cleanup Lane 6 - Browser And Console Complexity Review

Goal:
- reduce broad command-routing and browser-tree logic sinks

This lane includes:
- splitting staged navigation into smaller scope families
- reducing `useConsoleInteraction` responsibility
- separating Browser selection, drag/drop, context menus, and content actions into cleaner seams

Exit condition:
- Browser and Console remain powerful without requiring single giant controller files to understand them

#### Cleanup Lane 7 - Product Scope Decisions

Goal:
- decide which secondary surfaces are core versus optional

Likely decision surfaces:
- dashboard
- notepad
- radio

This lane includes:
- deciding whether these remain first-class product pillars
- isolating them if they are optional tools
- preventing side systems from reshaping core architecture by accident

Exit condition:
- project scope is reflected honestly in folder weight and maintenance effort

#### Cleanup Lane 8 - Naming, Docs, And Honest Labels

Goal:
- reduce "legacy but actually still current" naming confusion

This lane includes:
- removing stale `legacy`, `compat`, and migration labels once retired
- tightening docs so canonical architecture files match runtime truth
- making future-only work explicit as future-only

Exit condition:
- names and docs stop preserving dead stories

### Suggested Cleanup Order

Recommended default ordering:

1. Baseline health recovery
2. Dead file and placeholder retirement
3. Boundary repair
4. AppShell and workspace simplification
5. Spaghetti decomposition
6. Browser and console complexity review
7. Product scope decisions for secondary surfaces
8. Final naming and documentation pass

Reason:
- green baseline makes all later cleanup safer
- deleting dead residue first reduces false architecture
- boundary repair prevents new debt from being reintroduced during refactors
- only then does deeper file decomposition become worth the cost

### Success Criteria

Cleanup should be considered successful when most of the following are true:
- `build`, `lint`, and tests are healthy enough to trust every day
- the repo no longer contains obvious starter residue and empty source placeholders
- worker, app, viewer, and shared layers follow real contract boundaries
- the largest files have been split by responsibility
- migration logic has a shrinking footprint instead of a growing one
- dead or optional product surfaces no longer distort the core architecture
- docs describe the real system instead of a hoped-for one

### Immediate Backlog Seeds

The audit suggests these immediate cleanup seeds:

- fix current typecheck failures in active runtime files before any broader cleanup sweep
- fix lint configuration so generated artifacts do not pollute the signal
- delete `src/App.tsx` starter residue if it is truly not part of runtime
- audit and remove zero-byte files under `src/`
- create the missing shared worker protocol surface and reroute worker imports through it
- retire remaining runtime migration code once persisted layouts no longer require it
- split the biggest ownership sinks beginning with `useAppStore`, `useSpaghettiStore`, and AppShell-related host composition

These are not the whole cleanup plan.
They are the first honest places to start.


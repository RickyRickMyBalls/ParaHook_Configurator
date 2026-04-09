# `VRI-1` - `Foundation Runtime Surface`

## Doc Header

### Doc History
10. 2026-04-09 08:13: Marked `VRI-1.4 - Combined Inspector Read Model And Hardening` shipped after the live runtime inspector moved behind one compact app-side combined model in `runtimeInspectorVm`, `TitleStatusBar` shed most of its panel-local composition branches, and focused left-dock proof hardened the visible unavailable-versus-active-versus-error matrix so `VRI-1` now closes as the first honest runtime-inspector foundation subset
9. 2026-04-09 08:08: Tightened `VRI-1.4 - Combined Inspector Read Model And Hardening` into an implementation-ready final `VRI-1` slice by grounding it in the live `TitleStatusBar`, `viewportRuntimeStatsStore`, `runtimeInspectorTaskStore`, and existing left-dock proof seams, locking that the goal is to consolidate the now-shipped shell, stats, and task reads behind one compact inspector model instead of leaving the panel assembled from multiple direct store subscriptions plus local ad hoc fallback logic
8. 2026-04-09 08:05: Marked `VRI-1.3 - Active Runtime Task Card` shipped after accepted `BuildDispatcher` lifecycle hooks began feeding one compact app-facing current-task read through `bootstrapBuildWiring`, the primary `TitleStatusBar` shell began rendering that active-versus-idle task card beneath the viewport stats block, and focused lifecycle plus left-dock proof verified the current-task seam without regressing the title-area dock target
7. 2026-04-09 08:01: Tightened `VRI-1.3 - Active Runtime Task Card` into an implementation-ready next slice by grounding it in the live `BuildDispatcher` runtime hooks, `bootstrapBuildWiring`, `buildStatsStore`, and `TitleStatusBar` seams, locking that the first current-task card should come from explicit dispatcher/build lifecycle truth instead of inventing task names from per-part stats or console transcript lines
6. 2026-04-09 07:36: Marked `VRI-1.2 - Viewport Stats Foundation` shipped after the live viewer began emitting one explicit triangles/lines/points/FPS snapshot through `Viewer`, `viewerBridge`, and `ViewerHost`, the primary `TitleStatusBar` shell began rendering that compact stats grid with honest unavailable-state copy, and focused left-dock plus `ViewerHost` proof verified the new stats seam without regressing the left-dock preview target
5. 2026-04-09 07:27: Tightened `VRI-1.2 - Viewport Stats Foundation` into an implementation-ready next slice by grounding it in the live `Viewer`, `viewerBridge`, `ViewerHost`, and `TitleStatusBar` seams, locking the need for one explicit viewer-to-app stats contract instead of generic future telemetry wording, and clarifying that the existing `ViewportOverlay` geometry HUD is only a nearby caution seam rather than the runtime-inspector owner
4. 2026-04-09 07:19: Marked `VRI-1.1 - Panel Shell And Expand Collapse Contract` shipped after the live `TitleStatusBar` gained an explicit runtime-inspector toggle plus empty shell, the shell landed beneath the compact title card inside the primary left-dock status zone, and focused dock tests verified the expanded panel placement without regressing the existing left-dock status-target seam
3. 2026-04-09 07:14: Tightened `VRI-1.1 - Panel Shell And Expand Collapse Contract` into an implementation-ready first slice by grounding it in the live `TitleStatusBar`, `PrimaryViewportLeftDock`, dock-preview controller, and left-dock test seams, while also locking that the first shell must preserve existing browser/meatball dock-target behavior under the title area instead of accidentally breaking the primary viewport dock stack
2. 2026-04-09 07:08: Reworked this `VRI-1` future phase doc into the same execution-doc shape used by `Extrude-7`, promoting each remaining subphase into its own real `##` section so the first viewport runtime-inspector lane now reads as one umbrella phase with explicit `VRI-1.1` through `VRI-1.4` Codex-sized implementation surfaces instead of one lighter outline block
1. 2026-04-09 07:05: Created this standalone future phase doc for `VRI-1`, turning the first viewport runtime-inspector delivery into a small-chunk execution ladder focused on the expandable title-panel shell, stable viewport stats, one active runtime task read, and the minimal worker-to-UI contract needed to support that foundation honestly

### Purpose

Use this doc as the dedicated planning and execution surface for the first `Viewport Runtime Inspector` delivery lane.

The goal here is:
- add one expandable runtime-inspector surface beneath the viewport title card
- expose one stable first-pass viewport stats block
- expose one honest active runtime-task card when build work is in flight
- keep the first slice grounded in explicit worker/runtime truth instead of placeholder status chrome
- break the work into small implementation-ready chunks before later queue and change-impact phases

### Scope

This phase covers:
- the expand/collapse shell beneath the viewport title card
- the first runtime-inspector panel layout
- stable first-pass viewport stats
- one active runtime-task card
- one combined read-model seam for the panel
- focused hardening needed to leave the foundation ready for later queue work

This phase does not cover:
- full active queue visibility
- archive group presentation
- invalidated versus reused impact groups
- graph-region highlighting
- deeper dependency visualization
- later family stabilization beyond the first foundation slice

## Doc Body

### Summary

`VRI-1` is the dedicated foundation lane for making the viewport title area expand into one honest runtime-inspector surface.

Current read:
- the vision already says the user should be able to understand what is in the viewport, what the worker is doing, and later what changed because of edits
- the missing piece is an implementation-ready ladder that lands those ideas without mixing shell UI, stats instrumentation, active-task presentation, and later queue/impact work into one oversized pass
- the first honest delivery should stay narrow:
  - one expandable panel beneath the title card
  - one stable stats section
  - one active task card
  - one combined read model that later phases can extend
- this lane should stay worker-adjacent rather than worker-owning:
  - the worker/build runtime owns task and progress truth
  - the viewport/runtime side owns scene stats truth
  - the inspector renders that truth in a compact viewport-local way

Locked recommendation:
- stage the first delivery in Codex-sized cuts:
  - panel shell first
  - viewport stats second
  - active task card third
  - combined read-model hardening last
- keep `VRI-1` honest:
  - no fake queue archive yet
  - no fake dependency impact map yet
  - no invented task naming just to make the UI look busy

### Current Code-Backed Read

The strongest owner seams for this phase are:

- the viewport title-card / left-dock UI surface under `src/app/`
  - is the likely owner for the expandable runtime-inspector shell and first layout placement
- viewer/runtime stats seams under the viewer path
  - are the likely owner for triangles, lines, points, FPS, and fallback behavior when those values are not available
- worker/build orchestration seams under the app/runtime worker path
  - are the likely owner for one honest active-task name, status, and progress read
- one compact selector/read-model seam near the viewport panel surface
  - is the best owner for combining:
    - expansion state
    - viewport stats
    - active task truth
  - before later `VRI-2` queue growth widens the surface

### Phase Breakdown

1. `VRI-1.1 - Panel Shell And Expand Collapse Contract`
Reason:
- the first honest cut is creating the expandable panel shell beneath the existing title card before any deeper stat or task data is wired into it
Current status:
- shipped
- current handoff:
  - `VRI-1.2 - Viewport Stats Foundation`

2. `VRI-1.2 - Viewport Stats Foundation`
Reason:
- once the shell exists, the next smallest useful truth is a stable stats block that gives value even when no build is active
Current status:
- shipped
- current handoff:
  - `VRI-1.3 - Active Runtime Task Card`

3. `VRI-1.3 - Active Runtime Task Card`
Reason:
- after the shell and stats are real, the next missing truth is one honest build/runtime card that names what the worker is doing now without widening into full queue history
Current status:
- shipped
- current handoff:
  - `VRI-1.4 - Combined Inspector Read Model And Hardening`

4. `VRI-1.4 - Combined Inspector Read Model And Hardening`
Reason:
- once the first visible surface is in place, the remaining work is combining the reads cleanly, tightening copy and fallback states, and leaving the foundation ready for `VRI-2`
Current status:
- shipped
- this closes `VRI-1` as the first honest runtime-inspector foundation subset

## [x] VRI-1.1 - Panel Shell And Expand Collapse Contract

### Summary

#### Purpose:
- add the expandable shell beneath the existing viewport title card
- establish the first runtime-inspector panel container and placement contract
- keep this slice on shell behavior only before stats or worker-card truth widens

#### Current strongest read:
- this slice is now shipped
- the first real need is not deep runtime data yet
- it is giving the viewport one stable place where later runtime-inspector sections can live without disturbing unrelated viewport behavior
- the current title-area stack is owned by:
  - `src/app/components/TitleStatusBar.tsx`
    - current always-visible compact summary card
  - `src/app/workspace/PrimaryViewportLeftDock.tsx`
    - current stack order owner for title status above the left-dock panel targets
  - `src/app/hosts/useAppShellDockController.ts`
    - current browser/meatball dock-preview hit-area owner because it explicitly treats `.PrimaryViewportLeftDockStatus` as part of the valid dock target zone
- the shell should support:
  - collapsed state
  - expanded state
  - empty/idle presentation

#### Locked direction:
- keep the runtime inspector directly beneath the viewport title card
- let the title area own expansion and collapse
- keep the first shell calm and layout-safe
- make room for later sections without pre-committing to final queue/impact layouts
- keep the existing compact `TitleStatusBar` role intact:
  - product name
  - overall state
  - overall progress
- do not let the new shell accidentally remove the current left-dock preview affordance for floating browser or meatball surfaces

#### Implementation-ready seam read:
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest first owner seam for the compact summary card plus the expand/collapse trigger
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - is the strongest placement seam for rendering the expanded runtime-inspector shell directly between `.PrimaryViewportLeftDockStatus` and the existing `PanelStack`
- `src/app/hosts/useAppShellDockController.ts`
  - is the strongest behavior seam that must stay honest because browser/meatball dock previews currently treat the title-status area as a valid dock-target zone
- `src/app/theme/foundation/base.css`
  - is the strongest visual seam for title-card styling and any shared title-shell affordances
- `src/app/theme/shell/docks.css`
  - is the strongest layout seam for the left-dock stack, overflow, and panel-shell spacing rules
- `src/app/AppShell.test.tsx`
  - is the strongest app-level proof surface that the primary left dock still mounts only in the primary viewport and keeps its stack behavior
- `src/app/hosts/BrowserDockHost.test.tsx`
  - is the strongest focused proof surface for browser drag-preview and redock behavior against the left-dock title area
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
  - is the strongest focused proof surface for the meatball dock preview using that same left-dock title/status zone

#### Non-goals for this slice:
- do not add real viewport stats yet
- do not add active-task cards yet
- do not widen into queue/archive surfaces
- do not widen into worker/runtime naming decisions beyond placeholder-safe shell copy

### Questions / Decisions

#### [x] Question 1 - Where should the inspector open?

##### Current answer
- directly beneath the existing viewport title card inside the same local dock area

##### Why
- that keeps the runtime explanation surface viewport-local
- it matches the family vision without inventing a second detached inspector

#### [x] Question 2 - What should this slice prove first?

##### Current answer
- expansion and collapse behavior plus stable shell placement

##### Why
- later stats and task truth need a stable host surface first

#### [x] Question 3 - Where should the first expand/collapse state live?

##### Current answer
- in the title-status / primary-left-dock app seam, not in worker/runtime state

##### Why
- `VRI-1.1` is still shell behavior only
- worker/runtime truth should stay reserved for later stats and active-task slices
- keeping shell state local to the left-dock title surface avoids inventing fake worker ownership just to remember whether the panel is open

#### [x] Question 4 - What left-dock behavior must survive this shell change?

##### Current answer
- the browser and meatball dock-preview hit area under the title region must remain valid

##### Why
- `useAppShellDockController.ts` currently resolves dock previews partly through `.PrimaryViewportLeftDockStatus`
- moving or replacing that seam without updating the controller and its tests would make the first shell slice regress unrelated left-dock behavior

### Implementation Spec

Likely files:
- `src/app/components/TitleStatusBar.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/theme/foundation/base.css`
- `src/app/theme/shell/docks.css`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Locked first-cut direction:
1. keep `TitleStatusBar` as the compact always-visible summary card and add one explicit expand/collapse affordance at that seam
2. render one expanded runtime-inspector shell directly beneath `.PrimaryViewportLeftDockStatus` and above the existing `PanelStack`
3. keep collapsed and expanded states explicit without introducing fake runtime data
4. keep idle and empty states readable without implying queue or task truth that does not exist yet
5. preserve the existing browser/meatball dock-preview hit area by either:
   - keeping `.PrimaryViewportLeftDockStatus` as the preview seam
   - or updating `useAppShellDockController.ts` plus its tests to recognize the new shell container honestly

Scope honored:
- keep this slice on shell and placement only
- do not widen into stats instrumentation or worker-card logic

Acceptance checks:
- the runtime-inspector shell can open and close reliably
- the expanded shell sits directly beneath the compact title card inside the primary left dock
- the collapsed state preserves the current calm left-dock footprint
- the new panel placement does not visibly disrupt unrelated viewport behavior
- browser and meatball dock previews still recognize the title-area zone as a valid dock target
- the shell clearly supports later section growth

Implementation status:
- shipped

Shipped read:
- `src/app/components/TitleStatusBar.tsx`
  - now owns the explicit expand/collapse toggle plus the first honest empty runtime-inspector shell
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - still owns the left-dock stack order, with the inspector shell living inside the existing status zone ahead of the `PanelStack`
- `src/app/theme/foundation/base.css`
  - now styles the collapsed/expanded title shell, toggle affordance, and first empty runtime-inspector panel surface
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - proves the shell stays collapsed by default, expands on demand, and remains mounted in the left-dock status zone ahead of the panel stack

Closeout notes:
- this slice intentionally stops at shell behavior and honest placeholder copy
- viewport stats, worker task truth, and combined read-model work remain deferred to `VRI-1.2` through `VRI-1.4`

## [x] VRI-1.2 - Viewport Stats Foundation

### Summary

#### Purpose:
- expose the first stable viewport-stat block inside the new runtime-inspector shell
- make the panel useful even when no build is currently active
- keep this slice focused on understandable stats instead of deep telemetry

#### Current strongest read:
- this slice is now shipped
- the next missing capability is not the panel layout anymore
- it is one explicit viewer-to-app stats seam because the current codebase has:
  - a real viewer owner in `src/viewer/Viewer.ts`
  - a real app bridge contract in `src/app/viewerBridge.ts`
  - a real app host seam in `src/app/components/ViewerHost.tsx`
  - but no dedicated runtime-inspector stats contract yet
- the first useful stat layer should prefer stable scene/viewport reads such as:
  - triangles
  - lines
  - points
  - FPS
- unavailable values should degrade honestly instead of flickering or showing fake precision
- the existing `ViewportOverlay` geometry read is only a nearby caution seam:
  - it already shows compact viewport status copy
  - but it is not the right owner for the runtime-inspector stats block
  - `VRI-1.2` should avoid scattering a second stats read into that overlay instead of establishing the inspector's real contract

#### Locked direction:
- start with a compact stat grid
- prefer trustable numbers over noisy or overly detailed telemetry
- keep unsupported metrics visibly unavailable instead of inventing defaults
- make `VRI-1.2` introduce the first explicit viewer-owned stats snapshot that app/UI surfaces can consume without reaching directly into Three.js internals

#### Implementation-ready seam read:
- `src/viewer/Viewer.ts`
  - is the strongest owner seam for collecting stable viewport stats because it owns:
    - the render loop
    - the renderer
    - the scene graph and preview geometry population
  - it is the best place to derive or sample:
    - triangles
    - lines
    - points
    - FPS
- `src/app/viewerBridge.ts`
  - is the strongest contract seam for widening the app-facing viewer API with one explicit stats read or subscription surface
- `src/app/components/ViewerHost.tsx`
  - is the strongest app seam for subscribing to the viewer-owned stats contract and forwarding that read into app-facing UI state without making `TitleStatusBar` know about viewer internals
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest first presentation seam for rendering the compact runtime-inspector stats grid inside the shipped shell
- `src/app/components/ViewportOverlay.tsx`
  - is the strongest caution seam because it already renders viewport-local summary copy, which means `VRI-1.2` should either leave it alone or consciously avoid duplicating ownership there
- `src/app/components/ViewerHost.test.tsx`
  - is the strongest app-facing proof seam for a widened viewer contract because it already mocks the `Viewer` instance and can verify the new stats subscription or forwarding behavior without requiring a real renderer
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest UI proof seam that the inspector shell now renders real stats content once the viewer contract is wired

#### Non-goals for this slice:
- do not add the active-task card yet
- do not widen into draw-call or memory instrumentation unless those values already exist and are trustworthy
- do not widen into queue or dependency impact work
- do not make `ViewportOverlay` the hidden owner of runtime-inspector stats

### Questions / Decisions

#### [x] Question 1 - Which stats should the first slice prefer?

##### Current answer
- triangles
- lines
- points
- FPS

##### Why
- those are the clearest first-pass scene/runtime numbers from the vision doc
- they offer immediate value without demanding profiler-level instrumentation

#### [x] Question 2 - How should unavailable stats behave?

##### Current answer
- degrade honestly as unavailable rather than showing fake zeroes or unstable filler values

##### Why
- trust matters more than density on this surface

#### [x] Question 3 - What new contract does this slice actually need?

##### Current answer
- one explicit viewer-owned stats snapshot or subscription seam that app surfaces can consume

##### Why
- `Viewer.ts` already owns the underlying runtime facts
- `TitleStatusBar.tsx` should not reach directly into renderer internals
- a narrow bridge contract gives later inspector phases a reusable read instead of forcing panel-local reach-in logic

### Implementation Spec

Likely files:
- `src/viewer/Viewer.ts`
- `src/app/viewerBridge.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`

Locked first-cut direction:
1. add one explicit viewer-owned stats read in `Viewer.ts` that can report the first stable runtime snapshot needed by the inspector
2. widen `viewerBridge.ts` and `ViewerHost.tsx` just enough to move that stats snapshot into app/UI land cleanly
3. render those values in one compact stats block inside the shipped `TitleStatusBar` inspector shell
4. keep unsupported or temporarily unavailable values visibly honest instead of inventing zeroes or fake precision
5. avoid widening into deeper telemetry unless it already exists cleanly

Scope honored:
- keep this slice on stats only
- do not widen into active worker-task presentation yet

Acceptance checks:
- the panel shows a stable first-pass stats block
- the stats block is fed through one explicit viewer-to-app contract instead of panel-local renderer reach-in
- ordinary idle rendering does not cause meaningless stat flicker
- unavailable values remain honest and readable

Implementation status:
- shipped

Shipped read:
- `src/viewer/Viewer.ts`
  - now owns the first explicit runtime-stats snapshot and emits triangles, lines, points, and sampled FPS through one viewer-local callback seam
- `src/app/viewerBridge.ts`
  - now exposes the widened runtime-stats contract on the app-facing viewer API
- `src/app/components/ViewerHost.tsx`
  - now subscribes to the viewer-owned stats seam and forwards those reads into app state keyed by viewport id
- `src/app/store/viewportRuntimeStatsStore.ts`
  - now acts as the compact app-facing runtime-inspector stats read model
- `src/app/components/TitleStatusBar.tsx`
  - now renders the first compact viewport stats grid inside the shipped shell with honest unavailable-state copy before the first sample arrives
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves the left-dock shell renders the stats-grid contract
- `src/app/components/ViewerHost.test.tsx`
  - now proves the widened viewer-owned stats seam reaches the app-facing store

Closeout notes:
- this slice intentionally stops at viewport stats and does not widen into active-task naming or queue visibility
- `VRI-1.3` remains the next honest step for adding one real current runtime-task card

## [x] VRI-1.3 - Active Runtime Task Card

### Summary

#### Purpose:
- add one honest active runtime-task card to the inspector
- name what the worker/build runtime is doing now when real work is in flight
- keep this slice on one current task instead of widening into full queue history

#### Current strongest read:
- this slice is now shipped
- the runtime inspector becomes meaningfully explanatory only once it can answer:
  - what is the worker doing right now
- the first honest answer does not need full queue/archive truth yet
- one active-task card is enough if it is backed by real runtime/build data
- the strongest current code-backed read is:
  - `src/app/buildDispatcher.ts` already emits explicit build lifecycle moments through:
    - `onBuildRequestStarted`
    - `onBuildProgress`
    - `onBuildResultSettled`
    - `onWorkerError`
  - `src/app/bootstrapBuildWiring.ts` is already the app-owned bridge that turns those runtime hooks into build stats and console entries
  - `src/app/store/buildStatsStore.ts` currently owns overall build state plus per-part progress, but it does not yet expose one explicit inspector-friendly "current task" read model
- that means `VRI-1.3` should not invent task naming by scraping console transcript lines or loosely guessing from `partStatsByKey`
- instead it should add one narrow current-task adapter/store seam near the existing build wiring and let the inspector card render that read honestly

#### Locked direction:
- show only the current active task in this slice
- the task name, status, and progress should come from real runtime/build truth
- idle state should read cleanly when nothing is building
- prefer one compact app-facing current-task read model over having `TitleStatusBar.tsx` inspect build-dispatch internals directly
- keep the first card naming honest:
  - graph/build request start can name the current graph/runtime lane
  - active part progress can refine the card while work is actually building
  - idle and error states should stay explicit instead of implying hidden queue state

#### Implementation-ready seam read:
- `src/app/buildDispatcher.ts`
  - is the strongest runtime owner seam because it already receives the accepted worker lifecycle events that define when a build starts, progresses, settles, or errors
- `src/app/bootstrapBuildWiring.ts`
  - is the strongest app-bridge seam because it already translates dispatcher lifecycle hooks into app-owned stores and console surfaces
- `src/app/store/buildStatsStore.ts`
  - is the strongest adjacent state seam because it already tracks:
    - overall build state
    - active seq
    - part order
    - per-part progress
  - but it should either be widened carefully or paired with one dedicated current-task store/selector rather than being treated as if it already contains a real named task card model
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest presentation seam for rendering the first active runtime-task card beneath the shipped viewport stats grid
- `src/app/bootstrapBuildWiring.test.ts`
  - is the strongest lifecycle-proof seam because it already verifies build start, progress, and result bridging into app state
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest UI proof seam that the inspector shell can render active-versus-idle task card states without losing the current stats block
- `src/app/components/ViewerHost.test.tsx`
  - is no longer the primary proof seam for this slice because the current-task card is build/runtime-owned rather than viewer-owned

#### Non-goals for this slice:
- do not add queued or completed lists yet
- do not add archive groups yet
- do not widen into parameter-impact grouping yet
- do not invent task labels by scraping console transcript text
- do not widen into queue ordering or archive truth that belongs to `VRI-2`

### Questions / Decisions

#### [x] Question 1 - What should the first runtime card show?

##### Current answer
- one active task name
- one task status
- one task progress read when available

##### Why
- that is the smallest honest runtime explanation that still answers the key user question

#### [x] Question 2 - Should this slice include the queue?

##### Current answer
- no

##### Why
- queue and archive truth belong to `VRI-2`
- forcing them into `VRI-1.3` would make the first foundation slice too large

#### [x] Question 3 - Where should the first honest current-task read come from?

##### Current answer
- from the existing `BuildDispatcher` lifecycle hooks bridged through app-owned wiring, not from console transcript copy and not from guessing purely off the current per-part stats map

##### Why
- dispatcher hooks already carry the real accepted build lifecycle boundaries
- `bootstrapBuildWiring.ts` is the narrowest place to derive one app-facing inspector task read
- that keeps the task card grounded in actual runtime truth instead of a UI-only reconstruction

### Implementation Spec

Likely files:
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/buildStatsStore.ts`
- one compact current-task adapter/store or selector seam under `src/app/store/`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/bootstrapBuildWiring.test.ts`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`

Locked first-cut direction:
1. derive one explicit app-facing current-task read from accepted dispatcher lifecycle truth at the build-wiring seam
2. keep that read narrow:
   - task label
   - task state
   - progress when available
   - optional graph/build source identity only if it already exists cleanly
3. render one current task card beneath the shipped viewport stats block in `TitleStatusBar.tsx`
4. render a clean idle/no-task state when nothing is building and an honest error state when the current build fails
5. keep queue/archive scope deferred to `VRI-2`

Scope honored:
- keep this slice on one current task only
- do not widen into queue or impact surfaces

Acceptance checks:
- long-running work can render one active-task card
- the card meaningfully names the work unit
- idle state does not imply hidden queued work
- the card is fed by explicit dispatcher/build lifecycle truth rather than console copy reconstruction

Implementation status:
- shipped

Shipped read:
- `src/app/bootstrapBuildWiring.ts`
  - now derives one compact app-facing current-task read directly from accepted dispatcher lifecycle hooks at build start, progress, settle, and error boundaries
- `src/app/store/runtimeInspectorTaskStore.ts`
  - now acts as the dedicated current-task read model for the runtime inspector
- `src/app/components/TitleStatusBar.tsx`
  - now renders the first `Current Runtime Task` card beneath the shipped viewport stats grid with active, idle, and error presentation states
- `src/app/bootstrapBuildWiring.test.ts`
  - now proves the current-task card seam follows accepted lifecycle truth through start, progress, result, and worker-error transitions
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now proves the left-dock inspector shell can render the active runtime task card alongside the stats block

Closeout notes:
- this slice intentionally stops at one current task and does not widen into queue/archive history
- `VRI-1.4` remains the final `VRI-1` pass for combining the now-shipped shell, stats, and current-task reads into one cleaner inspector model

## [x] VRI-1.4 - Combined Inspector Read Model And Hardening

### Summary

#### Purpose:
- combine shell state, viewport stats, and active-task truth into one stable runtime-inspector read model
- harden copy, fallback behavior, and focused verification for the whole `VRI-1` foundation slice
- leave the family ready for later queue and impact work without major reshaping

#### Current strongest read:
- this slice is now shipped
- the visible panel now composes:
  - shell behavior
  - viewport stats
  - one active task card
  - user-facing fallback and hint copy
  through one compact inspector-facing model
- the strongest shipped code-backed read is:
  - `src/app/store/runtimeInspectorVm.ts`
    - now combines:
      - `useBuildStatsStore`
      - `useViewportRuntimeStatsStore`
      - `useRuntimeInspectorTaskStore`
    - and emits one compact runtime-inspector VM for presentation
  - `src/app/components/TitleStatusBar.tsx`
    - now reads that combined model for the visible inspector rendering while keeping expand/collapse local to the title-card seam
  - `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
    - now proves the combined inspector surface across waiting, stats-available, and error-task states
- `VRI-1` now closes with one cleaner inspector-owned read seam before later queue work widens the surface again

#### Locked direction:
- give the panel one compact combined selector/read-model seam
- make idle, unavailable, and active states read clearly
- use this slice to close `VRI-1` without hiding later queue work inside it
- prefer moving formatting/fallback decisions out of `TitleStatusBar.tsx` and into one inspector-specific selector/model seam so future `VRI-2` queue work can extend one stable read instead of one heavily inlined component
- keep expand/collapse behavior local if that remains the lowest-risk choice, unless combining it into the inspector model is clearly cleaner without inventing new global ownership

#### Implementation-ready seam read:
- `src/app/components/TitleStatusBar.tsx`
  - is the strongest current integration seam because it still owns all visible runtime-inspector composition and therefore makes the existing read scattering obvious
- `src/app/store/viewportRuntimeStatsStore.ts`
  - is the current stats owner seam that the combined model should consume rather than bypass
- `src/app/store/runtimeInspectorTaskStore.ts`
  - is the current current-task owner seam that the combined model should consume rather than bypass
- `src/app/store/buildStatsStore.ts`
  - remains an adjacent shell-state seam because the compact title card still derives overall state and progress from it
- one compact inspector selector/read-model seam under `src/app/store/`
  - is the strongest final owner for combining:
    - compact shell status
    - viewport stats
    - current task truth
    - fallback copy decisions
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - is the strongest visible proof seam because it already verifies the left-dock shell content and can be widened into a cleaner matrix for idle, unavailable, active, and error reads
- `src/app/bootstrapBuildWiring.test.ts`
  - remains the strongest lifecycle-proof seam for current-task truth, but `VRI-1.4` should avoid re-proving runtime ownership there beyond what the selector/model needs
- `src/app/components/ViewerHost.test.tsx`
  - remains the strongest stats-proof seam for the viewer-owned stats contract, but the final `VRI-1` slice should focus more on combined inspector rendering than on re-testing the already-shipped lower-level bridge

#### Non-goals for this slice:
- do not widen into queue/archive work
- do not widen into dependency impact mapping
- do not widen into graph-region highlighting
- do not re-open the already-shipped ownership decisions for the stats contract or current-task contract unless a small selector seam genuinely requires a minimal change

### Questions / Decisions

#### [x] Question 1 - Why not keep the panel as multiple unrelated local reads?

##### Current answer
- because later `VRI-2` queue work will be easier and safer if the foundation panel already reads from one explicit combined model

##### Why
- the family should grow from one clear read-model seam instead of accumulating panel-local truth in many places

#### [x] Question 2 - What should this last slice prove before `VRI-1` closes?

##### Current answer
- the shell, stats, and active-task reads compose cleanly and remain readable across idle, unavailable, and active states

##### Why
- that is the actual proof that the foundation is ready for later queue expansion

#### [x] Question 3 - What should stop living inline inside `TitleStatusBar.tsx` after this slice?

##### Current answer
- the combined inspector fallback/read logic that currently stitches together:
  - viewport stats
  - current task truth
  - user-facing hint/copy decisions

##### Why
- `TitleStatusBar.tsx` should remain the presentation seam
- later `VRI-2` expansion will be safer if the inspector already reads from one explicit model instead of accumulating more panel-local condition trees

### Implementation Spec

Likely files:
- one compact inspector selector/read-model seam under `src/app/store/`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/store/viewportRuntimeStatsStore.ts`
- `src/app/store/runtimeInspectorTaskStore.ts`
- `src/app/store/buildStatsStore.ts`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- focused lower-level proof only if the combined selector/model requires it
- this doc and the family index for final `VRI-1` closeout wording

Locked first-cut direction:
1. add one compact combined read-model seam for the full `VRI-1` inspector panel
2. compose the now-shipped shell status, viewport stats, and current-task truth through that seam
3. move visible fallback/copy decisions into that seam where they are currently scattered through `TitleStatusBar.tsx`
4. widen the left-dock inspector proof into a cleaner combined-state matrix:
   - idle + stats unavailable
   - idle + stats available
   - active task
   - error task
5. close `VRI-1` with a clean handoff to `VRI-2`

Scope honored:
- keep this slice on read-model composition and hardening only
- do not widen into queue or dependency-map design

Acceptance checks:
- the panel renders from one stable combined model
- idle, unavailable, and active states stay readable
- `TitleStatusBar.tsx` no longer carries most of the inspector-specific read stitching inline
- the foundation is ready for later `VRI-2` queue work without major reshaping

Implementation status:
- shipped

Shipped read:
- `src/app/store/runtimeInspectorVm.ts`
  - now owns the compact combined runtime-inspector VM for shell state, viewport stats, current-task truth, and visible hint/fallback decisions
- `src/app/components/TitleStatusBar.tsx`
  - now acts primarily as the presentation seam plus local expand/collapse owner instead of assembling the inspector from multiple unrelated subscriptions
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - now hardens the combined inspector matrix across unavailable, stats-available, and error-task states

Closeout notes:
- `VRI-1` is now closed as the first honest viewport runtime-inspector foundation subset
- the next family handoff is `VRI-2 - Queue Visibility And Archive Truth`

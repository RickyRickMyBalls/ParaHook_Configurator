# Browser Phase Browser-3 - Runtime Build Policy Execution

## Doc Header

### Doc History
4. 2026-03-25 00:39: Marked Browser-3 shipped after the graph-first runtime execution path landed in code, and moved this phase record from `Future/` to `Shipped/`
3. 2026-03-25 00:05: Refreshed this Browser-3 implementation-ready spec after locking the remaining umbrella decisions, updating it to use the broader model-parameter meaning of `ParaSlider`, explicitly lock `graph-document` as the first real runtime execution target, confirm that independent children can outrun parent `off`, and tighten explicit `Build` so it is primarily a dirty-`manual` path rather than a cross-mode rebuild shortcut
2. 2026-03-24 23:20: Turned this Browser-3 phase into an implementation-ready spec by locking the runtime-owner/effective-policy execution model, the exact `live / release / manual / off` interaction timing, dirty/output behavior, and the store/dispatcher seams that must change before Browser build modes honestly control rebuild execution
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the real `live / release / manual / off` runtime behavior now has its own planning home under `Browser/Future/` instead of staying mixed into the Browser surface notes

### Purpose

This phase makes runtime build behavior obey the Browser build-policy modes.

Use it to answer:
- how `live`, `release`, `manual`, and `off` behave at runtime
- what the default Browser/build baseline should be
- how model-parameter interactions should trigger builds

## Doc Body

## [x] Browser-3 - Runtime Build Policy Execution

### Summary

Make the real build/runtime path obey Browser effective build policy instead of only displaying it.

This phase locks:
- `live` as the default auto-rebuild baseline
- `release` as deferred rebuild on interaction release
- `manual` as explicit-build-only while preserving last built output
- `off` as no worker-produced output for that row
- effective-policy execution against the Browser-2 authored/effective truth model

This phase is where Browser build modes stop being surface truth only and begin controlling runtime rebuild behavior.

### Owns

- runtime execution behavior for:
  - `live`
  - `release`
  - `manual`
  - `off`
- default `live` baseline
- model-parameter and similar interaction timing rules
- runtime dirty-state handling
- runtime output behavior for `manual` versus `off`
- Browser/build/worker orchestration changes needed so effective row policy controls rebuild dispatch

### Does Not Own

- Browser-1 icon/fill-bar styling
- Browser-2 cascade/effective truth derivation
- broader Browser row interaction cleanup
- low-level worker contract redesign beyond what is necessary to honor per-row execution policy

### Public Interfaces And State

Keep the Browser-authored/effective policy model from Browser-2:

- `BrowserBuildPolicy = 'live' | 'release' | 'manual' | 'off'`

Keep Browser-owned authored maps in [useAppStore.ts](./parahook/src/app/store/useAppStore.ts):

- `browserGraphBuildPolicyByGraphDocumentId`
- `browserContentBuildPolicyByRowId`

Add one selector-owned runtime seam that returns effective execution policy for a rebuild target:

- `selectEffectiveBrowserExecutionPolicy(target): BrowserBuildPolicy`

Initial runtime target kind in Browser-3:

- `graph-document`

Browser rows that still participate in policy truth and dirty read during Browser-3:

- `assembly`
- `component`
- `object`

Do not widen the first Browser-3 execution cut below graph-document.
Current graphs mostly behave like one produced component in practice, so graph-document first is the safest honest runtime target.

Add explicit runtime dirty/build helpers in [useAppStore.ts](./parahook/src/app/store/useAppStore.ts):

- `markBrowserBuildTargetDirty(target)`
- `clearBrowserBuildTargetDirty(target)`
- `requestBrowserTargetBuild(target, options?)`

Add explicit release-defer queueing in app/store state:

- `pendingBrowserBuildTargetIds: string[]`
- or equivalent typed queued target structure if row ids are insufficient

Do not delete the existing global `buildPolicy` state in this phase unless Browser-3 fully replaces it in all active call sites.
If it remains temporarily, Browser-3 must treat Browser effective policy as the stronger source for Browser-owned rebuild execution.

### Canonical Runtime Policy Rules

#### Default Baseline

Rows default to effective `live`.

That means:
- normal graph editing should auto-rebuild without the user pressing `Build`
- a row only behaves differently when the user explicitly authors:
  - `release`
  - `manual`
  - `off`

#### Live

`live` means:
- rebuild during interaction updates
- model-parameter edits may dispatch repeated builds while the value changes
- the user should see current geometry continue to update while dragging where performance allows

Use `live` for:
- slider drag motion
- repeated numeric nudges
- sketch geometry edits that should update downstream model output live
- any edit path that should keep previewing current output as the value changes

#### Release

`release` means:
- mark the row dirty during the interaction
- do not dispatch repeated builds while the value is actively changing
- dispatch one build when the interaction is released/committed

Use `release` for:
- model-parameter drag-release behavior
- other continuous edits where rebuild-on-every-frame is too expensive but automatic rebuild on commit is still desired

#### Manual

`manual` means:
- mark the row dirty
- preserve the last built output
- do not dispatch a build automatically from editing interactions
- only build when the user explicitly invokes a build request

Allowed explicit build paths:
- Browser build action
- graph editor build action
- console build command
- any later unified explicit build trigger

#### Off

`off` means:
- mark the row non-executing
- do not dispatch worker builds for that row
- worker stops producing geometry for that row
- previously accepted output for that row should no longer remain as authoritative runtime output

Browser-3 must treat `off` as stronger than `manual`.

`manual` = hold last built result until explicit build.
`off` = no worker-produced geometry for that row.

### Runtime Truth By Row Kind

Browser-3 executes against effective policy, not merely self-authored policy.

That means:
- graph row runtime behavior uses graph effective policy
- graph execution must still respect effective child independence when later deeper runtime targets exist
- inherited rows obey parent effective policy until explicitly made independent
- explicitly independent children are allowed to outrun parent `off`, because nearest authored effective policy must remain real at runtime too

Nearest effective policy wins for execution just as it already wins for Browser display.

### Trigger Rules

#### Model Parameters / Continuous Edits

Browser-3 must route continuous model-parameter changes through policy-aware behavior:

- `live`
  - rebuild during drag
- `release`
  - queue dirty during drag
  - build once on release
- `manual`
  - dirty only
  - no automatic rebuild
- `off`
  - no rebuild
  - no retained worker execution for that row

Important rule:
- `ParaSlider` in this phase means model parameters, not only visible slider widgets
- if a sketch drives a downstream extrusion, sketch edits must participate in the same policy-aware authored-edit pipeline as slider changes and typed parameter edits

#### Non-Continuous Edits

For discrete authored edits such as:
- node parameter commit
- direct text entry confirm
- graph connection/structural change
- sketch dimension commit

Apply the same policy model:

- `live`
  - build immediately
- `release`
  - build on commit/end of the edit
- `manual`
  - dirty only
- `off`
  - no build

### Runtime Dirty And Output Rules

Browser fill bars remain Browser-1 visual territory, but Browser-3 must define the truth underneath those bars.

Required runtime truth:

- `done`
  - accepted build result matches current authored state for the target
- `building`
  - target has an active in-flight worker request
- `rebuild` / dirty
  - authored state changed after last accepted result
  - or target is blocked by `manual`
  - or target is blocked by `release` pending release

Additional Browser-3 rules:

- `manual`
  - can be dirty while still showing last built geometry
- `release`
  - can be dirty during drag, then build and return to `building/done`
- `off`
  - should not pretend a stale last built result is still current output
  - should read as excluded/non-producing once Browser-3 runtime behavior lands

### Dispatcher / Store Integration Rules

Browser-3 must not leave runtime policy decision-making spread across random UI surfaces.

Policy execution should be centralized in store/dispatcher orchestration, not in:
- BrowserPanel click handlers
- slider widgets
- row VMs

Required direction:

- UI surfaces publish edit intent
- app/store resolves effective Browser execution policy
- store/dispatcher decides:
  - build now
  - queue until release
  - mark dirty only
  - suppress build/output

Do not encode separate `live/release/manual/off` branching independently in:
- BrowserPanel
- graph editor controls
- console handlers

### Initial Runtime Scope

Browser-3 should first honor runtime execution policy at the `graph-document` level:

- graph-document builds

During this first cut:
- `assembly`, `component`, and `object` remain Browser policy and dirty-truth rows
- they do not become the first execution granularity yet

Do not widen initial runtime scope in this phase to:
- sketch visibility rules
- reference loading
- viewer-only show/hide controls
- unrelated non-build Browser row families

### Explicit Build Semantics

An explicit user build request should primarily serve dirty `manual` rows and should not bypass `off`.

That means:
- explicit build on `manual`
  - allowed
- explicit build on `live` / `release`
  - should not be the normal workflow because those modes are expected to self-maintain automatically
- explicit build on `off`
  - still suppressed unless the row is first returned to:
    - `live`
    - `release`
    - or `manual`

This keeps:
- `manual` = explicit build path
- `off` = true exclusion mode

If the product later needs a cross-mode retry path for `live` / `release`, add that as a separate later command such as `Force Rebuild` rather than weakening the meaning of normal `Build`.

### Boundaries

Browser-3 must not:

- redesign Browser row visuals
- redesign Browser inheritance UX
- widen runtime policy to sketch/reference/viewport row families
- pretend Browser is the owner of worker result semantics for unrelated non-Browser consumers

Browser-3 may require targeted store/dispatcher changes, but it should still respect the broader Worker family direction:

- app/store owns policy truth and orchestration
- dispatcher owns sequencing/transport
- worker executes requests, reports progress, and returns results

### Test Plan

- `useAppStore` / orchestration tests:
  - effective `live` dispatches build immediately during parameter changes
  - effective `release` queues dirty during drag and dispatches on release
  - effective `manual` marks dirty without dispatching
  - effective `off` suppresses dispatch and output production
  - explicit build is allowed for `manual`
  - explicit build is not allowed for `off`
  - first runtime execution target stays `graph-document`
  - independent child policy remains real when parent policy is `off`

- interaction tests:
  - `ParaSlider` drag under `live` dispatches repeated build requests
  - `ParaSlider` drag under `release` dispatches none until release
  - `ParaSlider` drag under `manual` leaves output stale and dirty
  - `ParaSlider` drag under `off` produces no build activity

- Browser/build truth tests:
  - a `manual` row keeps last built geometry until explicit build
  - an `off` row no longer contributes worker-produced geometry
  - inherited effective policy drives runtime behavior for non-independent children
  - independent child policy overrides parent runtime behavior

- BrowserPanel integration tests:
  - Browser policy icons continue to display Browser-2 effective truth
  - runtime execution behavior changes without reintroducing Browser-local build-policy branching

### Assumptions

- `live` remains the default effective policy
- Browser-2 authored/effective truth is already the canonical policy source before Browser-3 begins
- `manual` preserves last built geometry until an explicit build
- `off` suppresses worker-produced geometry rather than merely hiding it
- explicit independence from Browser-2 remains the way children stop inheriting parent runtime policy

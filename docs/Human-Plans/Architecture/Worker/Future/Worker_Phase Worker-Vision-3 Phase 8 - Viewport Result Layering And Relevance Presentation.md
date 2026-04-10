# Worker Phase Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation

## Doc Header

### Doc History
10. 2026-04-10 10:40: Marked `Worker-Vision-3 Phase 8.4 - Strict Draft Final Hardening And Viewer Proof` shipped after `selectViewportResultState.ts` adopted a dedicated retained draft mesh-preview base seam, `ViewerHost.tsx` widened the layered render handoff into strict `Draft` and `Final` without allowing final-mode draft fallback, and the focused selector plus host plus Browser-policy proof closed the full `8.1 -> 8.4` ladder
9. 2026-04-10 10:32: Tightened `Worker-Vision-3 Phase 8.4 - Strict Draft Final Hardening And Viewer Proof` into an implementation-ready closeout slice by grounding it in the now-shipped split worker lanes, committed-versus-current selector contract, and `Auto` layered viewer seam, then locking the remaining work around strict `Draft` and `Final` layering boundaries plus Browser `manual` / `off` honesty without reopening selector ownership
8. 2026-04-10 10:29: Marked `Worker-Vision-3 Phase 8.3 - Auto Layered Presentation` shipped after `Viewer.ts` adopted an explicit layered render seam, `ViewerHost.tsx` began feeding retained final plus translucent live draft into that seam only for the shipped `Auto` retained-base case from `selectViewportResultState.ts`, and focused host proof kept Browser/shared-viewer composition behavior honest while handing the family forward to strict `Phase 8.4`
7. 2026-04-10 10:17: Marked `Worker-Vision-3 Phase 8.2 - Viewport Result Contract And Relevance Gating` shipped in the planning surface after the committed-versus-current selector contract landed, then tightened `Phase 8.3 - Auto Layered Presentation` into the implementation-ready next slice around the now-shipped retained-base and overlay facts in `selectViewportResultState.ts`, the current single-render-list handoff in `ViewerHost.tsx`, and the viewer-side need to compose solid retained final plus translucent draft without reopening selector truth ownership
6. 2026-04-10 10:12: Marked `Worker-Vision-3 Phase 8.2 - Viewport Result Contract And Relevance Gating` shipped after `useSpaghettiStore.ts` exposed committed-versus-current geometry selectors, `selectViewportResultState.ts` adopted explicit retained-base and overlay contract facts with dependency-break clearing, and the focused selector/store tests proved retained parameter-churn context versus immediate invalidation on disconnected output dependencies
5. 2026-04-10 09:57: Marked `Worker-Vision-3 Phase 8.1 - Draft Worker Versus Authoritative Worker Split` shipped after the build dispatcher adopted separate draft and authoritative worker instances with lane-specific routing ledgers and authoritative-only handle release, then tightened `Phase 8.2 - Viewport Result Contract And Relevance Gating` into the implementation-ready next slice around the accepted-geometry boundary in `useSpaghettiStore.ts`, the current single-visible-result selector in `selectViewportResultState.ts`, and the now-shipped split worker lane outputs
4. 2026-04-10 09:44: Tightened `Worker-Vision-3 Phase 8.1 - Draft Worker Versus Authoritative Worker Split` into an implementation-ready first slice by grounding it in the live single-worker `BuildDispatcher`, the current worker message loop, and the still-serial `buildModelResult(...)` seam where draft geometry is created first and authoritative follow-through is awaited inside the same request, then locking the first narrow direction around a two-worker split, lane-specific latest-intent handling, and authoritative-handle ownership without widening yet into a generic worker pool
3. 2026-04-10 09:44: Tightened this standalone `Worker-Vision-3 Phase 8` planning surface so the viewport contract now standardizes one `50%` in-progress overlay rule across `Auto`, `Draft`, and `Final`, while also locking the critical honesty distinction that retained committed geometry is allowed only for same-output parameter churn and must clear immediately when a required dependency is disconnected, such as unplugging an `Extrude` sketch reference wire
2. 2026-04-10 09:34: Reworked this standalone `Worker-Vision-3 Phase 8` planning surface after code review clarified that one shared worker is still serializing draft-preview and authoritative follow-through inside the same execution seam, so the split ladder now starts with `Phase 8.1 - Draft Worker Versus Authoritative Worker Split`, shifts the previous viewport-result contract/presentation/hardening slices down to `8.2`, `8.3`, and `8.4`, and explicitly treats export as a later possible third lane rather than first-pass Phase 8 scope
1. 2026-04-10 09:26: Added this standalone `Worker-Vision-3 Phase 8` planning surface so the viewport-result presentation work can now execute as explicit `Phase 8.1`, `Phase 8.2`, and `Phase 8.3` slices instead of remaining one larger mixed selector-plus-viewer-plus-proof pass inside the broader `Worker-Vision-3` family doc

### Purpose

This doc defines the standalone execution breakdown for `Worker-Vision-3 Phase 8`.

Use it to answer:
- how `Worker-Vision-3 Phase 8` should be split into Codex-sized subphases
- which part of the Phase 8 work belongs to selector/store truth versus viewer presentation
- what proof should land before the layered `Auto` result presentation is considered honest
- when retained committed geometry is honest during parameter churn versus dishonest after dependency breakage

Do not use it to:
- redefine Browser timing policy
- redefine authoritative scheduling ownership
- widen Phase 8 into a broad viewer redesign

### Why This Doc Exists

The umbrella Worker Vision 3 phase doc now has a clear high-level `Phase 8` direction, but that slice is still too wide for one safe Codex pass because it combines:
- selector/store relevance and freshness truth
- layered `Auto` viewport presentation
- strict `Draft` and `Final` hardening plus viewer proof

This standalone doc exists to keep the long-range `Phase 8` goal intact while splitting the implementation into narrower internal passes that better match the repo vision rule that build/result truth should stay explicit and view presentation should remain downstream from that owned truth.

### Scope

This doc covers:
- the internal `8.1`, `8.2`, `8.3`, and `8.4` execution split for `Worker-Vision-3 Phase 8`
- the ordered handoff between selector/store truth and viewer presentation
- the focused proof bar for each smaller slice
- the first-pass worker split between draft-preview execution and authoritative execution when that split is needed to keep `Auto` responsive without serializing final catch-up behind the same worker job

This doc does not cover:
- new worker scheduling policy
- new Browser timing ownership
- broad material or theme redesign
- work beyond the `Auto / Draft / Final` viewport result presentation contract

## Doc Body

## [ ] Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation

### Header

Purpose:
- keep the existing Phase 8 product direction intact while splitting it into four implementation-ready subphases

Owns:
- the Phase 8 internal execution order
- the first Phase 8 worker-split decision for draft-versus-authoritative execution
- the split between truth-model work and viewer-presentation work
- the proof boundary between `8.1`, `8.2`, `8.3`, and `8.4`

Does not own:
- Browser timing policy
- authoritative scheduling policy
- broader viewport redesign beyond the narrow honesty cues already planned

### Current Constraints

This split starts from the already-locked `Worker-Vision-3 Phase 8` direction in:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules.md`

It should stay aligned with:
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

Locked starting constraints:
- build/result truth should stay separate from viewer presentation truth
- retained authoritative geometry must not become a second hidden owner
- `Auto` is the only mode allowed to mix retained final and live draft presentation
- `Draft` must stay pure
- `Final` must stay strict
- retained committed geometry is only honest while the current graph revision still describes the same output with changed values rather than a disconnected or invalidated dependency graph

Current live seams still expected to matter:
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/worker/worker.ts`
- `src/worker/buildModel.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/viewer/Viewer.ts`

### Locked Direction

#### 1. Split truth selection from render layering

Recommended first rule:
- if one shared worker keeps serializing draft-preview and authoritative follow-through, split the worker ownership before relying on later selector and viewer work to hide that bottleneck

Important rule:
- do not hide shared-worker serialization behind selector or render tricks
- do not solve stale-promotion bugs only inside render code
- do not make viewer presentation the hidden owner of result relevance

#### 2. Layered `Auto` presentation should follow a stable selector contract

Recommended first rule:
- once worker ownership and lane relevance are explicit, `Auto` can render retained final as a solid base plus live draft as a translucent overlay

Important rule:
- do not ask the viewer to infer stale-versus-current relevance from raw geometry presence

#### 3. Standardize one `50%` in-progress overlay rule, but keep mode-specific base truth

Recommended first rule:
- when a user changes parameters without breaking the feature's dependency identity, the viewport may keep the last committed geometry for that mode as the solid base and show the current in-progress geometry for that mode's preview lane at `0.5` opacity
- `Auto`
  - solid base: last committed authoritative / final geometry
  - `50%` overlay: current draft preview geometry
- `Draft`
  - solid base: last committed draft mesh geometry
  - `50%` overlay: current newer draft preview geometry
- `Final`
  - solid base: last committed authoritative / final geometry
  - `50%` overlay: current authoritative-lane preview geometry only

Important rule:
- do not let `Final` fall back to ordinary draft overlay
- do not vary the default in-progress opacity by mode unless a later viewer-only reason is proven

#### 4. Dependency breakage clears retained geometry immediately

Recommended first rule:
- retained committed geometry is allowed only for same-output parameter churn such as changing an extrude depth from `10` to `50`
- retained committed geometry must clear immediately when the user breaks the dependency that defined that output, such as unplugging the sketch reference from an `Extrude`

Important rule:
- if a required wire, profile source, or other dependency is disconnected, the app must not keep showing the old committed extrude as though it still represents valid current output
- do not treat dependency breakage as ordinary parameter churn just to preserve visual continuity

#### 5. Strict non-`Auto` rules deserve their own hardening slice

Recommended first rule:
- keep one final follow-up pass that proves `Draft` and `Final` do not accidentally inherit the mixed-lane `Auto` behavior

Important rule:
- do not bury strict mode behavior as an unverified side effect of the layered `Auto` implementation

### Sub-Phase Breakdown

## [x] Worker-Vision-3 Phase 8.1 - Draft Worker Versus Authoritative Worker Split

### Purpose

Create the first explicit parallel worker seam so draft mesh/preview execution and authoritative B-rep execution no longer have to take turns through one shared worker job when the Phase 8 viewport behavior needs both lanes to progress independently.

### Owns

- the first split between draft-preview worker execution and authoritative worker execution
- request/result routing needed so both lanes can target the same graph revision without pretending one request is doing two jobs at once
- preserving latest-intent supersession independently for the draft lane and authoritative lane
- keeping authoritative handle ownership attached to the authoritative lane

### Does Not Own

- export-worker separation
- Browser timing policy
- viewport opacity/presentation rules
- broad scheduler-pool generalization beyond the first two-worker split

### Implementation Target

After this slice:
- draft preview requests may run through a dedicated draft worker
- authoritative requests may run through a dedicated authoritative worker
- the app no longer depends on one worker job serially producing draft first and authoritative second for the same graph revision
- draft and authoritative results still stay tied to one graph revision and latest-intent model
- authoritative handle registration and release remain owned by the authoritative lane

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/buildDispatcher.ts`
  - still owns one `private readonly worker`
  - still posts every build request through that one worker instance
  - already owns graph-local latest-request ledgers, which are the strongest current seam for splitting draft-versus-authoritative request ownership without moving that safety model into UI code
- `src/worker/worker.ts`
  - still accepts one `build` message type through one message loop
  - already owns request-local supersession checks inside the worker boundary
  - is the strongest current seam for deciding whether a first two-worker split should keep one shared message contract or route into separate worker entry points
- `src/worker/buildModel.ts`
  - still builds draft geometry immediately
  - still conditionally awaits authoritative geometry inside the same request path when `geometryTarget === 'authoritative'`
  - is therefore the clearest current serialization seam this phase needs to remove
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already owns the heavy authoritative/OpenCascade path
  - already owns authoritative shape-set registration coupling through the authoritative result lifecycle
  - should stay the owner of authoritative handle creation after the split

Important current limitation:
- the repo still thinks one build request may produce draft first and authoritative second through the same worker job
- that is enough for serial follow-through, but not enough for true draft responsiveness plus authoritative progress independence under active churn
- if the app wants both lanes to move honestly at once, request routing must become explicit before later viewport presentation work relies on it

### Locked Direction

#### 1. The first split should be exactly two build workers, not a generic pool

Recommended first rule:
- the first implementation should create one draft-preview worker and one authoritative worker
- do not widen immediately into a variable-size worker pool or generalized scheduler framework

Important rule:
- keep the first split narrow enough that verification still reads as one architectural cleanup rather than a scheduler redesign

#### 2. Draft and authoritative requests must become separate jobs

Recommended first rule:
- the app should stop depending on one authoritative-target request to also deliver the draft-visible lane as part of the same worker job
- instead, draft-visible work and authoritative work should become separate request paths that can target the same graph revision independently

Important rule:
- do not hide this by pretending one request is still doing two jobs while merely dispatching helper work internally
- the request contract must stay honest about which lane is being asked to run

#### 3. Latest-intent supersession should remain lane-specific and graph-local

Recommended first rule:
- keep the existing graph-local latest-intent safety model
- allow draft requests to supersede older draft requests independently of authoritative requests
- allow authoritative requests to supersede older authoritative requests independently of draft requests

Important rule:
- do not collapse draft and authoritative back into one supersession ledger if the whole point of the split is to let them progress independently
- do not widen this phase into cross-graph fairness or queue-priority policy

#### 4. Authoritative handles stay authoritative-lane-only

Recommended first rule:
- authoritative handle registration and release must remain tied only to authoritative results
- draft results must stay handle-free even after the worker split

Important rule:
- do not let the draft lane become a hidden owner of authoritative resources just because both lanes share request identity

#### 5. Export stays out of the first split

Recommended first rule:
- treat export as a later possible third lane after the draft-versus-authoritative split proves itself

Important rule:
- do not widen `8.1` into draft worker plus authoritative worker plus export worker
- the first implementation should only solve the real current bottleneck

### Expected File Targets

Primary implementation files:
- `src/app/buildDispatcher.ts`
- `src/worker/worker.ts`
- `src/worker/buildModel.ts`

Likely supporting files:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/store/useAppStore.test.ts`

### Verification Bar

Required focused proof:
- draft-preview execution can proceed without waiting for authoritative completion on a separate worker lane
- authoritative execution can continue for the same graph revision without blocking newer draft-visible churn
- latest-intent supersession still drops stale draft and stale authoritative results independently
- authoritative handle release stays attached to authoritative results only
- the split does not widen yet into a generic multi-worker queue architecture

### Implementation Spec

Recommended reading order:
1. `src/app/buildDispatcher.ts`
2. `src/worker/worker.ts`
3. `src/worker/buildModel.ts`
4. `src/worker/authoritative/buildAuthoritativeGeometry.ts`
5. `src/shared/buildTypes.ts`
6. `src/app/buildDispatcher.test.ts`
7. `src/app/store/useAppStore.test.ts`

Recommended execution order:
1. identify the exact dispatcher seam where one shared worker instance currently owns both draft-preview and authoritative requests
2. split worker construction so draft and authoritative execution can route to separate worker instances or entry points without changing higher-level app truth ownership
3. make request routing explicit so draft-visible work and authoritative work become separate jobs for the same graph revision instead of one serial combined job
4. preserve graph-local latest-intent replacement independently for the draft lane and the authoritative lane
5. preserve authoritative-handle creation and release as authoritative-only lifecycle work
6. prove the split with focused dispatcher and app-store tests before later viewport selector and viewer presentation work begins

### Implementation-Grade Scenarios

- `Auto can dispatch draft-preview work and authoritative follow-through for the same graph revision without one shared worker serializing both jobs`
- `A newer draft-visible graph revision can supersede an older draft request without corrupting an in-flight authoritative request for a different revision`
- `A stale authoritative completion is rejected without clearing fresher draft truth`
- `Authoritative handle ownership remains on the authoritative lane and is released through the same authoritative result lifecycle`

## [x] Worker-Vision-3 Phase 8.2 - Viewport Result Contract And Relevance Gating

### Purpose

Lock the selector/store contract that decides which result lanes are current, retained, or stale before any layered rendering behavior is added.

### Owns

- lane-specific current-versus-retained relevance rules
- the selector contract for `Auto`, `Draft`, and `Final`
- the rule that stale authoritative arrivals cannot promote visible final truth

### Does Not Own

- opacity tuning
- layered viewer rendering
- broad viewer presentation cleanup beyond the selector/view-model contract
- worker-split architecture beyond consuming the stable lane outputs from `8.1`

### Implementation Target

After this slice:
- the viewport result selector can distinguish current draft truth from retained authoritative truth
- the selector/store contract can distinguish same-output parameter churn from invalidated dependency breakage
- `Auto` can expose the need for:
  - a retained-final base lane when authoritative truth is older than the current graph revision
  - a current draft lane when draft truth is fresher
- `Draft` resolves:
  - retained committed draft base during same-output parameter churn
  - current draft overlay eligibility
- `Final` resolves:
  - retained committed authoritative base during same-output parameter churn
  - current authoritative-only overlay eligibility
- stale later authoritative completions are blocked from visible promotion
- disconnected required dependencies clear retained geometry instead of preserving stale feature output

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns the accepted build-result boundary through `acceptGraphBuildResult(...)`
  - already stores accepted draft geometry, accepted authoritative geometry, and lane-specific accepted revisions
  - is therefore the strongest current owner seam for deciding when retained committed geometry is still relevant for the current graph revision
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already owns the current visible `Auto / Draft / Final` result contract
  - still mostly resolves to one visible winning render VM at a time
  - is the strongest current seam for widening from one winning result into an explicit retained-base-versus-current-overlay selector contract later in `8.3` and `8.4`
- `src/app/buildDispatcher.ts`
  - now provides separate draft-versus-authoritative lane outputs after shipped `8.1`
  - means `8.2` can treat lane outputs as explicit upstream facts instead of still compensating for shared-worker serialization

Important current limitation:
- the store already knows lane-specific accepted revisions, but the selector contract still reads mostly as:
  - final wins if present and allowed
  - otherwise artifact preview wins if allowed
- that is not yet enough to distinguish:
  - retained committed geometry that remains honest during same-output parameter churn
  - retained geometry that must clear immediately after dependency breakage
  - current draft-versus-authoritative overlay eligibility for later phases

### Locked Direction

#### 1. The accepted-state owner should stay in the store, not move into the viewer

Recommended first rule:
- keep lane freshness, retained-geometry eligibility, and dependency-break clearing logic inside the accepted-state/store boundary and selector layer

Important rule:
- do not move result-truth decisions into `ViewerHost` or `Viewer.ts`
- do not make the presentation layer decide whether geometry is still honest

#### 2. Same-output parameter churn and dependency breakage need separate selector facts

Recommended first rule:
- the selector/store contract should explicitly distinguish:
  - same-output parameter churn, where retained committed geometry may remain visible as context
  - dependency breakage, where retained committed geometry must clear immediately

Important rule:
- do not infer this only from viewport mode
- do not keep showing committed geometry just because a retained lane object still exists in runtime state

#### 3. `Auto`, `Draft`, and `Final` should each read their own committed base truth

Recommended first rule:
- `Auto`
  - retained base eligibility should prefer committed authoritative truth when it is still honest
- `Draft`
  - retained base eligibility should prefer committed draft truth only
- `Final`
  - retained base eligibility should prefer committed authoritative truth only

Important rule:
- do not let `Draft` quietly read retained final truth
- do not let `Final` quietly fall back to retained draft truth

#### 4. 8.2 should stop short of actual layered rendering

Recommended first rule:
- finish `8.2` when the selector contract can emit the right retained-base and current-overlay eligibility facts
- leave actual opacity/render-layer application to `8.3` and `8.4`

Important rule:
- do not widen `8.2` into `ViewerHost` render composition work unless the selector contract truly cannot represent the needed states without a tiny view-model extension

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`

Likely supporting files:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Verification Bar

Required focused proof:
- retained-final presentation eligibility is tied to authoritative-lane freshness rather than mere authoritative presence
- retained committed geometry is allowed for parameter churn but not for disconnected required dependencies
- `Auto` can distinguish retained final versus current draft without viewer-side guesswork
- stale authoritative arrivals do not replace visible final truth
- `Draft` stays draft-only in the selector contract
- `Final` stays authoritative-only in the selector contract

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/store/useSpaghettiStore.ts`
2. `src/app/spaghetti/selectors/selectViewportResultState.ts`
3. `src/app/components/ViewerHost.test.tsx`
4. `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
5. `src/app/spaghetti/store/useSpaghettiStore.test.ts`
6. `src/app/buildDispatcher.ts`

Recommended execution order:
1. identify the narrow accepted-state and selector seams that still treat retained geometry as a single winning result instead of an explicit mode-specific retained-base contract
2. add one explicit selector/store fact that distinguishes same-output parameter churn from disconnected-dependency invalidation for retained committed geometry
3. make `Auto`, `Draft`, and `Final` each resolve their own retained-base eligibility without yet applying layered render opacity
4. keep stale authoritative arrivals blocked from visible promotion by continuing to rely on lane-specific accepted revision truth rather than mere payload presence
5. prove the selector contract with focused store and selector tests before later viewer layering begins

### Implementation-Grade Scenarios

- `Auto distinguishes accepted authoritative revision N - 1 from accepted draft revision N without treating the authoritative lane as current`
- `Auto keeps the committed depth 10 result as context while depth changes to 50, but clears the committed extrude immediately if its required sketch wire is unplugged`
- `Auto ignores a stale later authoritative completion for an already superseded graph revision`
- `Draft keeps the committed draft depth 10 mesh as context while depth changes to 50, but clears the committed extrude immediately after required input disconnection`
- `Final keeps the committed authoritative depth 10 result as context while depth changes to 50, but clears the committed extrude immediately after required input disconnection`
- `Final withholds stale authoritative truth instead of falling back to draft`

## [x] Worker-Vision-3 Phase 8.3 - Auto Layered Presentation

### Purpose

Use the stable Phase 8.1 selector contract to render `Auto` as retained final plus translucent draft during active churn.

### Owns

- solid retained-final base presentation in `Auto`
- translucent live-draft overlay presentation in `Auto`
- the visible swap from retained final to newer relevant final once authoritative truth is accepted

### Does Not Own

- authoritative freshness logic itself
- Browser timing policy
- strict `Draft` and `Final` hardening beyond the selector contract already set in `8.2`
- worker-split architecture beyond consuming the split lane outputs already established in `8.1`

### Implementation Target

After this slice:
- `Auto` may show retained final as the solid base geometry during same-output parameter churn
- `Auto` may show current live draft above that base at `50%` opacity
- the draft overlay disappears once newer relevant authoritative truth is accepted
- stale authoritative completions do not replace the retained base presentation
- retained geometry clears immediately instead of lingering when the underlying feature dependency has been disconnected

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - now already publishes:
    - retained base state
    - retained base result class and render VM
    - overlay result class and render VM
  - is therefore the strongest current contract seam for `8.3` because the next pass no longer needs to infer layered meaning from one winning visible result alone
- `src/app/components/ViewerHost.tsx`
  - still reads `viewportResultState`
  - still collapses the viewport handoff to one `renderList`
  - is therefore the clearest current seam where `Auto` layering still has to be made explicit without moving selector truth back upward into React presentation code
- `src/viewer/Viewer.ts`
  - already owns scene object lifecycle, part material setup, and render-time visual treatment
  - is the strongest current seam for applying one presentation-only distinction between solid retained base and translucent overlay
- `src/app/components/ViewportOverlay.tsx`
  - already reads the same `viewportResultState` and status contract for HUD/reporting
  - is likely to need only narrow follow-through so the visible mode/status narration stays honest when `Auto` begins showing two layers instead of one

Important current limitation:
- the selector now knows retained-versus-overlay facts, but the presentation path still behaves like:
  - one `renderVm`
  - one visible list
- that means the repo can now reason about layered `Auto`, but cannot yet actually draw retained final solid plus draft translucent at the same time

### Locked Direction

#### 1. `8.3` should consume selector facts, not reinterpret them

Recommended first rule:
- treat the retained-base and overlay VMs from `selectViewportResultState.ts` as the authoritative input contract for layered `Auto`

Important rule:
- do not rebuild stale-versus-current logic in `ViewerHost.tsx`
- do not make `Viewer.ts` decide whether a layer is retained, current, or invalid

#### 2. The first layered presentation should be narrow and `Auto`-only

Recommended first rule:
- only `Auto` should render simultaneous solid-base plus translucent-overlay composition in `8.3`
- leave `Draft` and `Final` layered behavior to `8.4`

Important rule:
- do not widen `8.3` into shared multi-mode layering just because the selector can now describe it

#### 3. The retained base should stay visually primary

Recommended first rule:
- use retained final as the solid base
- use the current draft lane as the translucent `50%` overlay
- keep selection/highlight behavior anchored to the same presentation truth the viewer is actually drawing

Important rule:
- do not let the translucent draft lane visually replace the retained final before authoritative acceptance actually swaps
- do not let overlay opacity become an ad hoc per-part or per-mode tuning surface in this pass

#### 4. Dependency-break clearing should remain a selector-owned absence, not a viewer fade trick

Recommended first rule:
- when `8.2` says retained geometry cleared because the dependency broke, `8.3` should simply stop rendering that retained base

Important rule:
- do not add viewer-only fade-out persistence for disconnected or unresolved outputs
- the presentation layer should honor cleared retained truth immediately

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/selectors/selectViewportResultState.ts`
2. `src/app/components/ViewerHost.tsx`
3. `src/viewer/Viewer.ts`
4. `src/app/components/ViewportOverlay.tsx`
5. `src/app/components/ViewerHost.test.tsx`
6. `src/app/components/ViewportOverlay.test.tsx`

Recommended execution order:
1. identify the exact single-render-list seam where `ViewerHost.tsx` currently throws away the new retained-base-versus-overlay selector facts
2. widen the viewer handoff just enough that `Auto` can submit a solid retained-base layer plus a translucent overlay layer without moving freshness logic into the viewer
3. apply one stable `50%` presentation treatment to the live draft overlay in `Auto`
4. keep the retained base absent whenever the selector says dependency breakage already cleared it
5. prove the visible swap and stale-authoritative non-promotion behavior with focused viewer tests before touching `Draft` or `Final`

### Expected File Targets

Primary implementation files:
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

Likely supporting files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`

### Verification Bar

Required focused proof:
- `Auto` renders retained final solid plus current draft at `50%` opacity during parameter churn
- the translucent lane is clearly distinct from accepted final
- a newer relevant authoritative acceptance swaps in as the new solid final
- stale authoritative completion does not visibly replace the retained base
- disconnecting a required source wire clears the retained geometry instead of preserving stale feature output

### Implementation-Grade Scenarios

- `Auto shows extrude depth 10 final solid, then while dragging toward 20 keeps depth 10 final solid and shows the live draft path at 50% opacity`
- `Auto ignores an already stale authoritative completion for an intermediate drag value and keeps the retained final plus current draft overlay`
- `Auto swaps to the newer depth 20 final only when that accepted authoritative result is still relevant for the current graph revision`
- `Auto clears the old extrude immediately when the sketch reference wire is unplugged instead of retaining that stale solid as context`

## [x] Worker-Vision-3 Phase 8.4 - Strict Draft Final Hardening And Viewer Proof

### Purpose

Close Phase 8 by proving the non-`Auto` rules stay strict and the layered presentation does not weaken Browser timing or suppression honesty.

### Owns

- final hardening for strict `Draft` and `Final` behavior
- Browser `manual` and `off` honesty checks at the viewer boundary
- the focused regression proof that closes the split `Phase 8` ladder

### Does Not Own

- new Browser timing behavior
- new worker scheduling behavior
- broader viewer polish outside the already-locked result honesty surface

### Implementation Target

After this slice:
- `Draft` remains draft-owned and uses:
  - last committed draft mesh as the solid base during parameter churn
  - newer draft preview at `50%` opacity as the in-progress overlay
- `Final` remains authoritative-owned and uses:
  - last committed authoritative / final result as the solid base during parameter churn
  - newer authoritative-only preview at `50%` opacity as the in-progress overlay when available
- Browser `manual` and `off` continue to govern whether final catch-up is actually happening
- the full split Phase 8 proof is captured in focused viewer and selector regressions
- both modes clear retained geometry immediately when required dependencies are disconnected

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already publishes the retained base and overlay facts needed for all three modes
  - already encodes the important honesty rules from `8.2`:
    - committed-versus-current separation
    - dependency-break clearing
    - no ordinary draft fallback for strict `final`
  - is therefore the strongest current truth seam for `8.4`, because this slice should consume that contract instead of widening it again
- `src/app/components/ViewerHost.tsx`
  - now already consumes the selector contract and routes one explicit layered render handoff into `Viewer.ts`
  - currently special-cases only the shipped `Auto` retained-final-plus-draft-overlay composition
  - is therefore the clearest current seam for extending layered presentation into strict `Draft` and `Final` without moving result-truth ownership into the viewer
- `src/viewer/Viewer.ts`
  - now already supports explicit base-versus-overlay render layers with one fixed `0.5` overlay-opacity seam
  - already keeps picking, gizmo attachment, and shadow behavior coherent across the layered render path
  - should therefore stay a presentation-only surface in `8.4`, not a policy owner
- `src/app/components/ViewportOverlay.tsx`
  - still narrates viewport result state, waiting status, and fallback conditions
  - is the strongest current seam for keeping Browser and mode narration honest once strict `Draft` and `Final` gain their own layered compositions

Important current limitation:
- the viewer seam is now capable of layered presentation, but the host only activates it for the narrow `Auto` retained-final-plus-draft case
- `Draft` and `Final` still rely on the older single-visible-result behavior even though the selector contract can already describe their retained-base and overlay pairing
- the repo therefore still needs one final closeout slice to make strict non-`Auto` presentation match the already-locked contract

### Locked Direction

#### 1. `8.4` should widen presentation only, not selector meaning

Recommended first rule:
- keep `selectViewportResultState.ts` as the single owner of:
  - whether retained geometry exists
  - whether the retained base was cleared by dependency break
  - whether `Final` is allowed to show nothing instead of falling back to draft

Important rule:
- do not add viewer-side or host-side heuristics that reinterpret missing final truth as permission to show ordinary draft in `Final`
- do not reopen `8.2` by moving dependency-break logic back into React or viewer code

#### 2. `Draft` should stay entirely draft-lane-owned

Recommended first rule:
- when `Draft` has:
  - retained committed draft geometry
  - current draft overlay geometry
  - same-output continuation
  then render committed draft as the solid base and current draft at `50%` opacity as the overlay

Important rule:
- do not pull retained authoritative/final geometry into `Draft`
- do not let the `Draft` layered path depend on whether authoritative truth happens to exist

#### 3. `Final` should stay entirely authoritative-lane-owned

Recommended first rule:
- when `Final` has:
  - retained committed authoritative geometry
  - current authoritative overlay geometry
  then render committed authoritative as the solid base and authoritative-only preview at `50%` opacity as the overlay

Important rule:
- do not let `Final` fall back to ordinary draft overlay just because draft is available and authoritative follow-through is still pending
- if no authoritative overlay exists yet, keep showing only the retained final base or nothing, according to the selector contract

#### 4. Browser honesty remains narration and scheduling truth, not viewer invention

Recommended first rule:
- keep Browser `manual` and `off` behavior exactly as the app/store currently defines it
- only prove that the new layered `Draft` and `Final` presentation does not imply worker activity that the Browser policy did not actually allow

Important rule:
- do not make `8.4` a scheduling change
- do not wake or stage worker processing from viewer presentation code

#### 5. Dependency-break clearing should stay immediate in both strict modes

Recommended first rule:
- when the selector clears retained geometry because the current output lost required continuation, `Draft` and `Final` should immediately stop rendering that retained base

Important rule:
- do not fade or preserve disconnected geometry in strict modes for continuity
- the presentation layer should remain downstream from cleared truth

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/selectors/selectViewportResultState.ts`
2. `src/app/components/ViewerHost.tsx`
3. `src/viewer/Viewer.ts`
4. `src/app/components/ViewportOverlay.tsx`
5. `src/app/components/ViewerHost.test.tsx`
6. `src/app/components/ViewportOverlay.test.tsx`
7. `src/app/store/useAppStore.test.ts`

Recommended execution order:
1. identify the current `ViewerHost.tsx` branch that only activates layered composition for the `Auto` case
2. widen that handoff just enough so `Draft` and `Final` can submit their own retained-base-plus-overlay layer pairs without moving mode-policy decisions into `Viewer.ts`
3. keep `Draft` strictly draft-owned and `Final` strictly authoritative-owned while reusing the same fixed `50%` overlay treatment introduced in `8.3`
4. verify that dependency-break clearing still removes retained geometry immediately in both modes
5. prove that Browser `manual` and `off` remain honest at the viewer boundary, meaning presentation may show retained committed context but does not imply automatic final catch-up or suppressed worker wake-up

### Expected File Targets

Primary implementation files:
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

Likely supporting files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/store/useAppStore.test.ts`

### Verification Bar

Required focused proof:
- `Draft` uses retained committed draft plus `50%` draft overlay during same-output parameter churn without pulling in retained final truth
- `Final` uses retained committed authoritative plus `50%` authoritative-only overlay during same-output parameter churn without falling back to ordinary draft overlay
- Browser `manual` does not imply automatic final catch-up
- Browser `off` does not wake worker processing through presentation logic
- disconnecting a required feature dependency clears retained geometry in both `Draft` and `Final`
- the split `8.1 -> 8.2 -> 8.3 -> 8.4` sequence closes on the same honesty goals that the original umbrella Phase 8 intended

### Implementation-Grade Scenarios

- `Draft mode shows committed draft depth 10 solid plus newer draft depth 20 at 50% opacity during parameter churn`
- `Draft mode clears the old extrude immediately when its required sketch reference wire is unplugged`
- `Final mode shows committed authoritative depth 10 solid plus newer authoritative-only preview at 50% opacity when available`
- `Final mode clears or withholds stale final instead of showing ordinary draft fallback`
- `Final mode clears the old extrude immediately when its required sketch reference wire is unplugged`
- `Browser Manual plus Auto may still show retained older final plus draft overlay as presentation, but does not imply automatic final catch-up`
- `Browser Off plus Auto may still retain previously accepted final as presentation, but does not wake worker processing for suppressed targets`

### Recommended Execution Order

1. complete `Phase 8.1` so draft and authoritative execution can stop serializing behind one shared worker when the repo needs both lanes at once
2. complete `Phase 8.2` so selector/store truth becomes explicit against those now-separate lane outputs
3. complete `Phase 8.3` so layered `Auto` rendering depends on that stable contract
4. complete `Phase 8.4` so strict mode behavior and Browser honesty are locked with focused proof

### First Proof

- `Phase 8.1` proves draft and authoritative execution no longer depend on one shared worker job to progress in serial
- `Phase 8.2` proves stale authoritative truth cannot silently promote visible final
- `Phase 8.3` proves `Auto` can show retained final solid plus live draft translucent during churn
- `Phase 8.4` proves `Draft` and `Final` stay strict and Browser suppression/timing semantics remain unchanged

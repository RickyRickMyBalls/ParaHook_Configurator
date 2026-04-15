# Fly Mode Phase Gen2-1 - Runtime Seams And Shared Input Contract

## Doc Header

### Doc History
1. 2026-04-14 23:15:36: Added this standalone `Gen2 Phase 1` plan doc under `Fly-Mode/Future2/`, turning the first gravity-and-FPV follow-on into one implementation-ready architecture lane focused on shared fly-input contracts, clean runtime seams, file splitting, and preserving the current `Generation 1` feel while preparing for later gravity and controller work

### Purpose

This doc locks `Generation 2 / Phase 1`.

Use it to answer:
- what the first `Generation 2` implementation cut should actually do
- how fly runtime and input seams should be split before gravity lands
- what new files should exist before controller and FPV-radio support widen the system
- how to preserve today's free-flight behavior while moving toward a cleaner architecture

### Why This Phase Exists

`Generation 2` now has a clear direction:
- gravity-aware motion
- thrust semantics
- momentum and drag
- gamepad support
- FPV-radio support

But the current fly stack is still shaped like a strong `Generation 1` baseline:
- fly-session truth lives in `src/viewer/Viewer.ts`
- fly movement updates still read held keys directly from the active fly session
- keyboard ownership still routes through `viewerFlyActive`
- camera fly orientation and translation still live in `src/viewer/scene/CameraController.ts`
- visible UI seams currently expose only the narrow controls needed by today's mode

That is enough for the current baseline, but it is not the right foundation for gravity, analog devices, and later calibration surfaces.

This phase exists to create the clean seams first so later `Generation 2` work can widen without turning the viewer files into one permanent fly-feature pile.

### Scope

This phase covers:
- shared semantic fly-input contracts
- shared fly settings contracts for later `Generation 2` modes
- clean file splitting for fly runtime and input adapters
- preserving current keyboard and mouse behavior through the new seam
- focused runtime proof that the refactor did not change the `Generation 1` baseline

This phase does not cover:
- gravity behavior itself
- thrust-powered movement
- new visible fly UI
- standard gamepad support
- FPV-radio calibration
- fly collision, landing, or aerodynamic simulation

## Doc Body

## [ ] `Gen2-1` - `Runtime Seams And Shared Input Contract`

### Header

Purpose:
- establish the architecture seams that the rest of `Generation 2` can build on safely

Owns:
- shared fly-input types
- shared fly settings types
- first fly-runtime file splitting
- keyboard and mouse adaptation into semantic fly input

Keeps for later or elsewhere:
- gravity math
- controller polling
- FPV-radio calibration
- visible HUD and toolbar expansion
- any attempt to replace `Generation 1` free flight in this pass

### Target Result

At the end of this phase:
- the repo has one semantic fly-input contract instead of only direct key-state reads scattered through the current runtime
- `Viewer.ts` no longer has to own every future fly concern directly
- `CameraController.ts` stays focused on camera orientation and translation behavior instead of becoming an input router
- current keyboard and mouse fly behavior still works the same from the user perspective
- later gravity and controller work has obvious expansion seams

### Cross-Doc Boundary

Important rule:
- this phase may reorganize fly-runtime ownership seams, but it must keep actual camera-runtime ownership with `Camera-Controls`

That means:
- `src/viewer/Viewer.ts`
  - may become thinner and more orchestration-focused
- `src/viewer/scene/CameraController.ts`
  - should remain the owner for fly orientation, roll application, and fly translation behavior
- new helper files under focused folders
  - are encouraged if they reduce future widening pressure
- `View-Toolbar` docs
  - do not become the owner of the runtime model just because the planning lane sits beside fly UI docs

### Current Starting Point

Current code-backed read:

- `src/viewer/Viewer.ts`
  - still owns fly-session lifetime through `startFlySession(...)` and `endFlySession(...)`
  - still stores the active `heldKeys` set on the live fly session
  - still computes fly translation directly in `updateFlyMovement(dt)`
  - still applies roll updates from held-key state in the fly update loop
  - already owns user-facing fly move-speed and roll-speed values
- `src/viewer/scene/CameraController.ts`
  - already owns true fly-mode orientation state
  - already exposes the narrow motion primitives:
    - `beginFlyMode()`
    - `endFlyMode(...)`
    - `applyFlyLookDelta(...)`
    - `applyFlyRollDelta(...)`
    - `translateFly(...)`
- `src/app/inputRouting.ts`
  - still routes viewer fly movement keys through the `viewerFlyActive` path
- `src/app/viewerBridge.ts`
  - currently exposes only narrow fly UI seams such as move speed and roll speed
  - does not yet expose any richer fly-input or mode contract

Implementation-ready conclusion:
- the runtime already has a real fly owner split
- the missing layer is a reusable contract between device input and fly motion semantics
- `Gen2-1` should add that missing layer before any new movement model lands

### Locked Architecture Direction

The first `Generation 2` runtime pass should establish four explicit concepts:

1. `semantic fly input`
   - forward, strafe, vertical or thrust intent
   - look intent
   - roll intent
   - boost or modifier intent

2. `fly settings contract`
   - mode identity
   - move speed
   - roll speed
   - later gravity, drag, thrust, and profile values

3. `fly runtime helpers`
   - code that interprets semantic fly input into actual per-frame camera movement
   - thin enough to preserve current free-flight behavior now and widen later

4. `input adapters`
   - keyboard and mouse first
   - gamepad and FPV-radio later

Important rule:
- do not add gamepad logic yet
- do not add gravity values yet
- do create the seams those later features will plug into

### Expected File Direction

This phase should prefer new focused files such as:

- `src/app/fly-input/flyInputTypes.ts`
  - shared semantic input types
- `src/app/fly-input/flySettingsTypes.ts`
  - shared fly settings and mode types
- `src/app/fly-input/keyboardFlyAdapter.ts`
  - current keyboard fly intent mapped into the semantic contract
- `src/viewer/flight/flyRuntime.ts`
  - first shared per-frame fly-runtime helper for applying semantic input to the current free-flight model
- `src/viewer/flight/flySessionTypes.ts`
  - supporting runtime-local fly session types if the live session shape needs to slim down in `Viewer.ts`

Guardrail:
- exact filenames can move slightly during implementation if the same responsibility split is preserved
- the important outcome is the seam split, not one rigid filename fetish

### Questions / Decisions

#### [ ] q1 - Should `Gen2-1` extract a full fly runtime owner or only the first helper layer?

Suggestion:
- extract only the first helper layer
- keep `Viewer.ts` as the fly-session orchestrator for now
- avoid a large ownership rewrite before the new contracts prove useful

#### [ ] q2 - Should the current held-key set remain on the fly session during this phase?

Suggestion:
- it can remain temporarily if it now feeds one keyboard adapter instead of driving movement math directly
- the key point is to stop letting direct held-key reads define the long-term runtime contract

#### [ ] q3 - Should settings already include gravity and thrust fields before those features ship?

Suggestion:
- yes, but only as future-ready optional fields or mode-aware contract slots
- do not wire them into behavior yet

### Internal Phase Ladder

This phase should still ship through a few narrow internal cuts.

## [ ] Phase 1 - Shared Fly Types And Settings Contract

Purpose:
- create the shared language that later input devices and later runtime models will use

This phase should:
- add shared types for semantic fly movement, look, roll, and modifiers
- add shared settings and mode types for current free flight and later gravity-aware follow-ons
- keep the contract broad enough for later analog devices without forcing gravity behavior into the current runtime yet

Likely file targets:
- `src/app/fly-input/flyInputTypes.ts`
- `src/app/fly-input/flySettingsTypes.ts`

Done when:
- the repo has one canonical semantic fly-input contract
- the repo has one canonical fly-settings contract
- later device work can target those types instead of `Viewer.ts` internals directly

## [ ] Phase 2 - Keyboard And Mouse Adapter Extraction

Purpose:
- route today's fly controls through the new semantic contract without changing user-visible behavior

This phase should:
- extract the current held-key interpretation into one keyboard adapter seam
- keep mouse look and roll behavior mapped to the same free-flight semantics as today
- preserve the current `viewerFlyActive` routing behavior while the new adapter lands

Likely file targets:
- `src/app/fly-input/keyboardFlyAdapter.ts`
- `src/app/inputRouting.ts`
- `src/viewer/Viewer.ts`

Done when:
- current keyboard and mouse fly behavior still works
- direct movement semantics are no longer authored only by `Viewer.ts` local held-key reads

## [ ] Phase 3 - Free-Flight Runtime Helper Extraction

Purpose:
- move the per-frame free-flight interpretation into one focused runtime helper that can later gain gravity-aware variants

This phase should:
- extract the current free-flight movement step into a focused helper under `src/viewer/flight/`
- keep `Viewer.ts` as the owner of session lifetime and high-level orchestration
- keep `CameraController.ts` as the owner of applying final camera deltas
- preserve current move-speed, boost, and roll-speed behavior

Likely file targets:
- `src/viewer/flight/flyRuntime.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts` only if a tiny supporting seam is truly needed

Done when:
- the current free-flight update path reads as one reusable runtime seam
- later gravity work has a clear place to branch from
- `Viewer.ts` is thinner and more orchestration-focused

## [ ] Phase 4 - Focused Proof And Stop

Purpose:
- prove that the architectural cleanup preserved today's feel and then stop before this phase widens into gravity implementation

This phase should:
- add or update focused tests around fly-session behavior and the shared contracts
- prove current keyboard/mouse free flight still behaves as before
- stop once the seam cleanup is trustworthy

Likely proof files:
- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewportOverlay.test.tsx` only if a shared settings seam affects existing visible fly controls

Done when:
- the refactor has focused proof
- current free-flight behavior still reads as stable
- the phase ends with clear room for `Gen2 Phase 2` instead of bleeding into gravity work

### Locked Implementation Shape

The next implementation pass should:
1. create the shared semantic fly-input and fly-settings types
2. adapt the current keyboard fly path onto those types
3. extract one focused free-flight runtime helper
4. keep the shipped user-facing behavior aligned with today's free-flight baseline
5. add only the minimum proof needed to trust the seam split

Important rule:
- `Gen2-1` succeeds by changing architecture, not by changing feel
- if the user can feel a major movement-model difference after this phase alone, the phase likely widened too far

### Acceptance Shape

This phase is done when:
- `Generation 2` has one clean technical foundation
- the current fly baseline still behaves like `Generation 1`
- future gravity, gamepad, and FPV-radio work can target explicit shared seams
- the repo is less dependent on one large fly block inside `Viewer.ts`

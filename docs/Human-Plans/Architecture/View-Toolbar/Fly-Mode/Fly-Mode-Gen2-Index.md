# Fly Mode Gen2 Index

## Doc Header

### Doc History
2. 2026-04-14 23:15:36: Added `Future2/Fly-Mode_Phase Gen2-1 - Runtime Seams And Shared Input Contract.md` as the first standalone execution doc under the `Generation 2` lane, so the index now points at one implementation-ready architecture plan for the seam-cleanup pass before gravity, gamepad, and FPV-radio work begin
1. 2026-04-14 23:06:03: Added this dedicated `Fly-Mode-Gen2-Index.md` planning surface so `Generation 2` now has one explicit phased breakdown for gravity-aware flight feel, thrust semantics, gamepad support, FPV-radio support, clean file splitting, and the runtime guardrails that should stay owned by `Camera-Controls`

### Purpose

This file is the phased planning index for `Fly Mode Generation 2`.

Use it to answer:
- what `Generation 2` is actually trying to ship
- what order the gravity-and-FPV work should happen in
- how controller and FPV-radio support fit into the same lane
- what should be split into new files before the feature widens
- what is explicitly out of scope for the first `Generation 2` passes

### Scope Note

This doc is intentionally about `Generation 2` only.

It is mainly about:
- gravity-aware fly-mode planning
- thrust and momentum semantics
- analog-input expansion for fly mode
- phased execution order for the next flight-feel lane

It is not the main home for:
- current `Generation 1` UI polish
- ordinary toolbar-shell work
- pretending `View-Toolbar` now owns camera-runtime math

Those still stay split between:
- `Fly-Mode` for visible fly planning and generation direction
- `Camera-Controls` for actual fly-runtime ownership

## Doc Body

### Relationship To Other Docs

- `docs/Human-Plans/Architecture/View-Toolbar/Fly-Mode/Fly-Mode-Vision.md`
  - the north-star for what `Generation 2` should feel like
  - use it for the quality bar and boundaries

- `docs/Human-Plans/Architecture/View-Toolbar/Fly-Mode/Fly-Mode-Index.md`
  - umbrella family index for the whole `Fly-Mode` subfamily
  - use it for where `Generation 1` and `Generation 2` fit together

- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
  - canonical runtime owner
  - use it for the actual fly session, camera math, and input integration planning

- `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
  - umbrella view-control family
  - use it for visible control placement once `Generation 2` gains explicit UI

- `docs/Human-Plans/Architecture/View-Toolbar/Fly-Mode/Future2/Fly-Mode_Phase Gen2-1 - Runtime Seams And Shared Input Contract.md`
  - first standalone execution doc under the `Generation 2` lane
  - use it for the exact seam-cleanup plan before gravity-aware motion and controller widening begin

### Short Version

`Generation 2` should not start by jamming gravity, momentum, Xbox support, and FPV-radio support directly into the current fly code.

It should ship in clear phases:
- first create clean fly-runtime and input seams
- then add an optional gravity-aware flight model
- then make the visible UI honest about thrust and tuning
- then widen into analog controller support
- then add FPV-radio calibration and device-specific polish

That keeps the repo readable while still letting fly mode grow toward a more FPV-simulator-like feel.

### Why This Doc Exists

The `Fly-Mode-Vision.md` doc now says `Generation 2` is the gravity-and-FPV generation.

That gives the repo a direction, but it does not yet answer:
- what to build first
- what to defer
- how Xbox and FPV-radio support relate to the gravity work
- how to avoid turning `Viewer.ts` and `CameraController.ts` into permanent dumping grounds

This doc exists to make the next lane executable without pretending the north-star alone is already an implementation plan.

### What Generation 2 Means

`Generation 2` is the first fly generation where ParaHook should research and likely ship:
- gravity-aware motion
- thrust semantics instead of only direct translation semantics
- momentum and drag as part of motion truth
- analog control surfaces that make flight feel more intentional

In practical terms, this means:
- the repo's current `1 unit = 1 mm` scale must be treated honestly
- literal Earth gravity would read as roughly `9800 units/s^2`
- real-world gravity should be treated as a reference point, not an automatic shipped constant
- the first gravity-aware mode should probably stay an explicit mode or variant rather than silently replacing `Generation 1` free flight

### Clean Expansion Rule

`Generation 2` should widen through new focused files, not by endlessly extending the old fly block in place.

Preferred responsibility split:
- shared fly-mode types and settings contracts
- fly input normalization
- gravity-flight integration and tuning helpers
- standard gamepad polling and mapping
- later FPV-radio profile and calibration support

Good likely file seams:
- `src/viewer/flight/`
- `src/app/fly-input/`
- `src/app/fly-input/flyInputTypes.ts`
- `src/app/fly-input/gamepadProfiles.ts`
- `src/app/fly-input/gamepadCalibration.ts`

Guardrail:
- keep `Viewer.ts` and `CameraController.ts` as orchestration seams, not as the permanent home for every future fly concern

### Generation 2 Phase Ladder

## [ ] Gen2 Phase 1 - Runtime Seams And Shared Input Contract

Standalone future doc:
- `docs/Human-Plans/Architecture/View-Toolbar/Fly-Mode/Future2/Fly-Mode_Phase Gen2-1 - Runtime Seams And Shared Input Contract.md`

Goal:
- create the clean architecture seams that later gravity and controller work can plug into

This phase should:
- define one shared fly-input contract that describes semantic flight intent instead of raw device events
- split fly-runtime helpers into focused files so future gravity and controller code does not pile into one large viewer update block
- keep keyboard and mouse working through the new seam without changing the current `Generation 1` flight feel yet
- define the first shared settings contract for things like mode, thrust power, gravity strength, drag, and controller profile identity

Important rule:
- this phase is mainly architecture cleanup and boundary creation, not the gravity feature itself

## [ ] Gen2 Phase 2 - Gravity Flight Model Baseline

Goal:
- add the first optional gravity-aware fly mode with velocity-based motion

This phase should:
- add world-space velocity state instead of only direct per-frame translation
- apply gravity as acceleration, not as a constant downward speed
- interpret values in repo units honestly as `mm`
- introduce thrust power, drag, and momentum as explicit runtime concepts
- decide whether `Space` becomes upward thrust in gravity-aware mode
- keep the current `Generation 1` free-flight model available until the gravity variant proves itself

What this phase should not try to solve:
- surface collision
- landing behavior
- full aerodynamic lift simulation
- full drone-simulator parity

## [ ] Gen2 Phase 3 - Honest UI, Naming, And Tuning Surface

Goal:
- make the visible fly surface truthfully represent the gravity-aware mode once it exists

This phase should:
- decide how the user switches between `Free Fly` and the gravity-aware mode
- rename or reinterpret visible controls honestly inside the gravity-aware mode, such as `Fly Speed` becoming `Thrust Power`
- add only the minimum readouts needed to make the new motion feel understandable
- keep any visible fly HUD or toolbar controls pointed at the same runtime truth instead of inventing toolbar-local behavior

Guardrail:
- do not fake FPV feel with HUD chrome alone
- the motion model must stay the primary source of the new feel

## [ ] Gen2 Phase 4 - Standard Gamepad Support

Goal:
- support analog fly control from standard controllers such as an Xbox pad

This phase should:
- use the browser `Gamepad API` as the first standard controller path
- map left and right stick plus triggers and shoulders onto the shared fly-input contract
- add deadzone, sensitivity, and response-curve tuning where needed
- keep controller input as another adapter over the same fly runtime rather than a second camera implementation

Expected outcome:
- a standard gamepad can drive either `Generation 1` free flight or the new gravity-aware mode through the same flight-input seam

## [ ] Gen2 Phase 5 - FPV Radio Support And Calibration

Goal:
- support FPV-style transmitters such as a `RadioMaster TX16S` or `BETAFPV LiteRadio` when they present as USB joystick or gamepad devices

This phase should:
- treat USB joystick or gamepad exposure as the primary support path
- add per-device calibration for axis discovery, reverse, deadzone, and channel order
- save profiles by device identity so repeat use is practical
- allow FPV-radio mappings to drive the same roll, pitch, yaw, and throttle or thrust semantics as other input devices
- research `WebHID` only as a fallback path if a useful target device cannot be supported well enough through the normal gamepad seam

Important rule:
- do not hardcode one fixed axis order and assume all radios behave like an Xbox controller

## [ ] Gen2 Phase 6 - Flight-Feel Polish, Safety, And Ship Decision

Goal:
- decide what part of `Generation 2` is ready to become a stable user-facing flight surface

This phase should:
- tune gravity, thrust, drag, and controller defaults until the mode feels deliberate instead of twitchy or exhausting
- verify that exiting fly mode still hands back to ordinary camera behavior calmly and predictably
- decide whether the gravity-aware mode ships as optional, default, or experimental
- decide whether standard gamepad support is baseline while FPV-radio support remains advanced
- capture the remaining gaps that truly belong to a later generation instead of overstuffing `Generation 2`

Healthy end-state:
- `Generation 2` feels more alive than free noclip
- it remains usable in a CAD workspace
- the repo stays clean enough that later flight work still has obvious expansion seams

### What Is Probably Out Of Scope For Early Gen2

These ideas may be interesting later, but they should not block the first honest `Generation 2` lane:
- full collision and landing simulation
- surface-contact rest states
- obstacle-aware automatic braking
- full Betaflight-level simulator complexity
- replacing every existing fly control and keyboard rule in one pass

### Done Means

This index is doing its job when:
- `Generation 2` has one explicit phased breakdown instead of one loose pile of ideas
- gravity, thrust, controller, and FPV-radio support all read as one coherent lane
- the repo has a clear clean-first implementation shape before runtime work begins
- later execution docs can branch from these phases without re-arguing the whole generation each time

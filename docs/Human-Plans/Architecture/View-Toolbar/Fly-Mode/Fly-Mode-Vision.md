# Fly Mode Vision

## Doc Header

### Doc History
3. 2026-04-14 23:06:03: Updated this vision doc so `Generation 2` now points at the new `Fly-Mode-Gen2-Index.md` phased planning surface, giving the gravity-and-FPV generation one explicit breakdown for runtime seams, gravity flight, visible tuning, standard gamepads, FPV-radio support, and later ship-read polish
2. 2026-04-14 22:59:59: Expanded `Generation 2` so the fly-mode vision now explicitly includes gravity-aware thrust research, the repo's current `1 unit = 1 mm` scale implication for acceleration tuning, possible Xbox-controller support for analog flight input, and an implementation-hygiene rule to grow those features through new focused files instead of bloating the existing viewer and camera files
1. 2026-04-14 22:51:13: Added this dedicated `Fly-Mode-Vision.md` north-star doc under `View-Toolbar/Fly-Mode/` so the repo now has one stable planning home for what fly mode should feel like across generations, including a new `Generation 2` direction to research gravity-influenced motion for a more FPV-simulator-like read while keeping implementation ownership with `Camera-Controls`

### Purpose

This doc captures the long-range vision for fly mode in ParaHook.

Use it to answer:
- what fly mode is supposed to feel like when it is good
- what `generation` fly mode is in today
- what later fly generations should add without blurring ownership
- how visible fly-mode UI and deeper fly-runtime feel should relate
- where gravity and FPV-style follow-ons belong conceptually before implementation details are locked

Do not use it for:
- one specific implementation checklist
- pretending fly-runtime math now belongs to `View-Toolbar`
- replacing the implementation-planning role of `Camera-Controls`

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping fly mode aligned with ParaHook's broader viewer and workspace direction

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for checking that fly-mode growth stays a real user-experience improvement instead of isolated viewer gimmickry

- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
  - canonical runtime and input-owner family
  - useful for actual fly-session ownership, keyboard rules, orientation math, and later gravity implementation planning

- `docs/Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md`
  - umbrella view-control family
  - useful for visible toolbar, HUD, and viewport-facing control placement

- `docs/Human-Plans/Architecture/View-Toolbar/Fly-Mode/Fly-Mode-Index.md`
  - fly-mode family umbrella
  - useful for locating the current standalone fly UI phase docs and family boundary rules

- `docs/Human-Plans/Architecture/View-Toolbar/Fly-Mode/Fly-Mode-Gen2-Index.md`
  - dedicated phased planning surface for `Generation 2`
  - useful for the execution order across gravity research, thrust semantics, controller support, and FPV-radio follow-ons

## Doc Body

### Why This Doc Exists

ParaHook now has real fly-mode behavior and a real `Fly-Mode` subfamily, but the repo was still missing one stable answer to:
- what fly mode should feel like at its best
- how to talk about current fly quality versus later flight-feel generations
- where a more FPV-like direction belongs without smuggling runtime ownership out of `Camera-Controls`

Without a vision doc, fly mode risks drifting into one of two weak shapes:
- a purely functional debug-style noclip camera with no clear quality bar
- a widened `View-Toolbar` family that starts trying to own camera-runtime behavior directly

This doc exists to keep fly mode on the narrow honest path between those two failures.

### Short Version

Fly mode should become a deliberate first-person flight surface for moving through the model space, not just a temporary noclip shortcut.

When it is good, it should feel:
- direct
- smooth
- readable
- spatially trustworthy
- easy to enter and exit
- exciting enough to feel intentional without becoming hard to control in a CAD workspace

The long-range direction should now be read as a generation ladder.

That means:
- `Generation 1` is the current free-flight baseline
- `Generation 2` is the gravity-research generation where fly mode starts exploring a more FPV-simulator-like feel

### Fly Mode North Star

The long-range target is a fly mode that:
- gives the user a convincing sense of moving through 3D space
- feels meaningfully different from ordinary CAD orbit
- remains precise enough to be useful inside ParaHook's modeling workspace
- can temporarily feel more aircraft-like while active without damaging the normal non-fly camera experience

Fly mode should be thought of as:
- a deliberate temporary flight state for spatial inspection and traversal

not as:
- a replacement for normal CAD orbit
- a hidden owner of all camera behavior
- a loose bundle of HUD polish with no motion-quality direction

### Fly Mode Generations

The generations are here to make it easy to say:
- what already exists
- what quality bar the current fly baseline still needs
- what should wait for a later motion-feel generation instead of being smuggled into today's baseline

#### Generation 1 - Free-Flight Baseline

This is the current fly generation.

`Generation 1` means ParaHook already has:
- held-`RMB` fly-session entry and exit
- viewer-local fly ownership
- fly move-speed control
- boost behavior
- roll behavior
- loop-capable pitch
- optional pointer lock
- visible fly HUD and toolbar-facing follow-on space

What `Generation 1` is trying to make true:
- fly mode is a real named system instead of an experiment
- the user can temporarily leave ordinary orbit and traverse space directly
- the baseline can now be improved as one shared fly feature instead of ad hoc viewer hacks

What `Generation 1` still needs:
- stronger visible surface polish
- clearer quality language around what "good flight feel" means
- a stable north-star for later deeper feel work

In short:

`Generation 1` is the current free-flight baseline.

It already works, but it is still more like a strong direct free-flight camera than a fuller flight-feel system.

#### Generation 2 - Gravity Research And FPV Feel

`Generation 2` should be the first fly generation that explicitly researches gravity-influenced motion so fly mode can feel more like an FPV simulator instead of only a neutral noclip camera.

This generation should explore:
- gravity as a real flight-feel ingredient rather than a cosmetic effect
- descent pressure when the user is not actively supporting lift
- speed, climb, and descent reads that feel more earned and physical
- whether momentum and gravity together make traversal feel more alive without ruining control clarity
- a thrust-based control model where the neutral free-flight speed concept may become `thrust power` instead of only direct translation speed
- whether analog controller input such as an Xbox gamepad should become part of the intended flight-feel surface for this generation

One concrete north-star for this generation:
- fly mode should begin to feel like an FPV-style flight state, not merely a camera that can move up, down, and roll

Important clarification:
- `Generation 2` is currently a research direction, not a locked implementation spec
- `Fly-Mode-Gen2-Index.md` is the phased breakdown for turning that direction into executable slices without overloading this vision doc

What this generation is trying to answer:
- what "gravity" should actually mean in ParaHook
- how much physical feel is helpful before the mode becomes frustrating
- whether gravity should be always-on during fly mode or offered as a distinct feel variant
- how to preserve fast precise spatial inspection while making motion feel more alive
- whether `Space` should become upward thrust in a gravity-aware mode instead of staying only a direct vertical translation key
- whether the visible `Fly Speed` surface should be reinterpreted as `Thrust Power` inside a gravity-aware mode instead of staying named as pure free-flight speed

Scale note:
- the repo's current spatial read is `1 unit = 1 mm`
- that means literal Earth gravity would read as roughly `9800 units/s^2`, not `9.8 units/s^2`
- so `Generation 2` should treat real-world gravity as a reference point, not as an automatic first tuning value
- the actual shipped feel may need a tuned gameplay gravity below strict real-world scale if the goal is usable FPV-style traversal inside a CAD workspace

Potential controller direction:
- Xbox-controller support is a good fit for this generation because analog sticks, triggers, and shoulder buttons map naturally onto look, thrust, climb or descend, and roll
- if controller support is added, it should target the same fly-runtime truth as mouse and keyboard rather than becoming a second camera implementation path
- controller support should be treated as an input-surface expansion for fly mode, not as a reason to fork fly motion semantics per device

Important boundary:
- this vision can name gravity and FPV feel as the next quality target
- the actual runtime contract, math, and session rules for gravity still belong in `Camera-Controls`
- the same boundary applies to gamepad support, thrust integration, and momentum math

Implementation hygiene rule:
- `Generation 2` should be implemented cleanly and in expandable slices
- do not bloat `Viewer.ts`, `CameraController.ts`, or one large input-routing file with every later gravity, thrust, momentum, and controller concern
- when the feature widens, add new focused files for the new responsibilities such as:
  - flight-model tuning and integration helpers
  - gamepad polling and mapping
  - shared fly-mode types and settings contracts
  - later visible fly-control surfaces if the UI expands
- prefer small explicit seams over piling more one-off branches into the existing baseline fly code

#### Later Generations

Later generations should be added only when the repo is ready to name a real qualitative step beyond `Generation 2`.

Good reasons to open a later generation:
- the fly camera gains a clearly new capability tier
- a new generation needs its own quality bar and review questions
- the work would otherwise overload the gravity/FPV generation with too many unrelated goals

#### Generation Boundaries

Use the generations as a scoping rule:

- if a change is about making today's held-`RMB` fly mode cleaner, more reliable, or easier to tune, it is still `Generation 1`
- if a change is about researching gravity so flight feels more FPV-like and less like neutral free-flight, it belongs in `Generation 2`
- if a change would introduce a meaningfully new flight tier beyond that, it likely belongs in a later generation

Important rule:

do not open a new fly generation just to avoid finishing the quality bar of the current one.

### What Must Stay True

#### 1. Fly Mode Must Stay Distinct From CAD Orbit

Fly mode should feel like a temporary flight state with its own motion character.

It should not collapse back into:
- normal orbit with slightly different keys
- a hidden debug path
- a vague camera mode that feels the same as everything else

#### 2. Runtime Ownership Still Belongs To Camera-Controls

This vision doc can define what later fly generations should feel like.

It should not steal ownership of:
- fly-session lifetime
- keybinding rules
- camera basis math
- gravity math
- handoff back to ordinary orbit

Those still belong in `Camera-Controls`.

#### 3. Gravity Should Improve Feel, Not Punish Use

If gravity becomes part of fly mode, it should make motion feel richer and more intentional.

It should not become:
- a constant annoyance
- a source of random drift the user cannot understand
- a reason the user loses precise control near the model

Good gravity direction:
- readable
- learnable
- easy to correct against
- clearly part of the flight feel

Bad gravity direction:
- muddy
- surprising
- exhausting
- always fighting the user for no payoff

#### 4. FPV Feel Should Come From Motion Truth, Not Only UI Chrome

If ParaHook wants a more FPV-simulator-like read, that feeling should come primarily from:
- motion behavior
- gravity behavior
- momentum behavior
- climb and descent character

It should not depend mainly on:
- flashy HUD tricks
- cosmetic overlays pretending the camera physics changed

#### 5. Fly Exit Must Stay Calm And Predictable

No matter how expressive fly mode becomes while active, the user should still be able to:
- release out of fly mode cleanly
- keep their useful spatial location
- return to ParaHook's ordinary CAD camera behavior without confusion

The stronger the flight feel becomes, the more important the exit handoff becomes.

### Generation 2 Research Questions

These are the right questions for the gravity generation:

- what is the minimum gravity behavior that makes fly mode feel more FPV-like without making it annoying
- should gravity read as constant downward acceleration, or should it be shaped by throttle and forward speed
- should the current neutral free-flight mode remain the default while gravity becomes an optional mode or follow-on toggle
- how much momentum belongs in ParaHook before close-range inspection becomes too awkward
- what kind of visual readout, if any, is needed once gravity meaningfully affects motion
- should the first gravity-aware mode use a thrust model where `Space` acts like upward thrust and the current speed control becomes `thrust power`
- should controller support ship as part of the same generation so analog sticks and triggers can help the flight feel read more naturally
- what is the clean file-splitting plan before gravity and controller work begin so the current viewer files do not become the permanent dumping ground for every future fly feature

Important rule:
- answer these through `Camera-Controls` research and implementation planning, but keep the quality target anchored here

### Desired End State

When fly mode matures, the user should be able to assume:
- entering fly mode feels intentional
- moving through space feels alive and spatially believable
- the mode is useful for both inspection and expressive traversal
- the active flight feel is easy to read from the controls and motion itself
- exiting fly mode returns cleanly to the normal workspace camera

The codebase should read that way too:
- one clear fly-runtime owner in `Camera-Controls`
- one clear visible fly UI/planning home under `Fly-Mode`
- one stable vision for what later fly generations are trying to achieve

### Non-Goals

This doc does not argue that the first next step is:
- a huge control remap
- game-style weaponized UI chrome
- full simulator complexity
- replacing the current baseline immediately with heavy physics

The main near-term point is:
- name the direction clearly now, so later gravity/FPV work has one honest north-star

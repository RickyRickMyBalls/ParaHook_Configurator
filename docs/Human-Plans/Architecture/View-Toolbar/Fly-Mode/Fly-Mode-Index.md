# Fly Mode Index

## Doc Header

### Doc History
13. 2026-04-14 23:57:29: Marked `Fly-Mode 1 / Phase 6 - Fly Mode Type Split: Drone And Free Cam` complete in the family summary after the shipped runtime pass added a viewer-backed `Fly Mode Type` select to `ViewToolbar.tsx`, preserved the current fly behavior as `Drone`, and introduced first-cut upright no-bank `Free Cam` behavior through a narrow viewer fly-type seam plus one small `CameraController` helper
12. 2026-04-14 23:48:08: Prepped `Fly-Mode 1 / Phase 6 - Fly Mode Type Split: Drone And Free Cam` for implementation by locking the current shipped fly behavior as `Drone`, defining first-cut `Free Cam` around an upright no-bank camera read, and narrowing the next runtime pass to one visible mode select plus the smallest honest roll/banking split in `Viewer.ts`
11. 2026-04-14 23:44:50: Updated the `Fly-Mode` family summary after widening `Fly-Mode 1` with a new internal `Phase 6`, locking the next visible follow-on to naming the current fly behavior as `Drone` and adding one second `Free Cam` mode that should feel more like a normal free camera without widening into the broader `Generation 2` gravity-and-FPV lane
10. 2026-04-14 23:26:08: Marked `Fly-Mode 1 / Phase 5 - Fly Mode Activate Select And Always-On Option` complete in the family summary after the shipped runtime pass added a viewer-backed `Fly Mode Activate` `ParaSelect` to `ViewToolbar.tsx`, introduced one narrow activation-mode seam in `viewerBridge.ts`, and made opt-in `Always On` mode real runtime truth in `Viewer.ts`
9. 2026-04-14 23:15:36: Added `Future2/Fly-Mode_Phase Gen2-1 - Runtime Seams And Shared Input Contract.md` and refreshed the `Fly-Mode` family summary so the newer `Generation 2` lane now has its first standalone execution doc under a dedicated `Future2/` folder, keeping the architecture cleanup pass for shared fly-input contracts and runtime seams discoverable beside the broader Gen2 index
8. 2026-04-14 23:07:18: Prepped `Fly-Mode 1 / Phase 5 - Fly Mode Activate Select And Always-On Option` for implementation by locking the visible owner to the existing `Fly Mode` section in `ViewToolbar.tsx`, attributing the missing shared contract to `viewerBridge.ts`, and making the real runtime blocker explicit in `Viewer.ts`, where fly still starts only from `RMB` pointerdown and keyboard fly routing still keys off `flySession !== null`
7. 2026-04-14 23:06:03: Added `Fly-Mode-Gen2-Index.md` as the dedicated phased planning home for the gravity-and-FPV generation, so the `Fly-Mode` family now points not only at the stable `Generation 2` north-star in `Fly-Mode-Vision.md` but also at one explicit six-phase ladder covering runtime seams, gravity flight, UI truth, gamepads, FPV-radio support, and later ship-read polish
6. 2026-04-14 23:04:15: Updated the `Fly-Mode` family summary after widening `Fly-Mode 1` with a new internal `Phase 5`, locking the next visible follow-on to one `Fly Mode Activate` `ParaSelect` with `Right Click` as the default and one explicit `Always On` option while keeping actual fly-session activation truth with `Camera-Controls` plus `Viewer.ts`
5. 2026-04-14 23:00:11: Marked `Fly-Mode 1 / Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control` complete in the family summary after the shipped runtime pass added a dedicated `Fly Mode` section to `ViewToolbar.tsx`, exposed a viewer-backed `Roll Speed` `ParaSlider`, and replaced the old hard-coded fly-roll seam in `Viewer.ts` with one narrow shared viewer contract
4. 2026-04-14 22:51:13: Added `Fly-Mode-Vision.md` as the stable north-star doc for the fly-mode subfamily, giving the folder one explicit generation ladder and a new `Generation 2` direction to research gravity-influenced motion for a more FPV-simulator-like feel while keeping implementation ownership with `Camera-Controls`
3. 2026-04-14 22:41:32: Prepped `Fly-Mode 1 / Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control` for implementation by locking the visible subsection owner to `ViewToolbar.tsx`, attributing the current fly-roll-speed blocker to the hard-coded `FLY_CAMERA_ROLL_RADIANS_PER_SEC` seam in `Viewer.ts`, and narrowing the next runtime cut to one shared viewer-api contract plus focused toolbar proof
2. 2026-04-14 22:40:15: Updated the `Fly-Mode` family summary after widening `Fly-Mode 1` with a new internal `Phase 4`, locking the next visible fly UI follow-on to one dedicated `Fly Mode` subsection in the `View` toolbar plus a `Roll Speed` `ParaSlider` while keeping actual fly runtime ownership with `Camera-Controls`
1. 2026-04-14 22:36:17: Added this umbrella index for the new `Fly-Mode` subfamily under `View-Toolbar`, pointed it at the first standalone future phase doc for `Fly-Mode 1`, and locked the folder as a forward-only planning home for visible fly-mode UI polish plus small user-facing follow-ons while `Camera-Controls` remains the owner for actual fly-navigation runtime behavior

### Purpose

This file is the umbrella planning index for the `Fly-Mode` subfamily under `Architecture`.

Use it to answer:
- what the `Fly-Mode` subfamily is supposed to own
- where the stable long-range fly-mode vision now lives
- how the fly-mode docs are organized
- where future standalone fly-mode phase docs should branch
- how fly-mode UI polish should stay separate from fly-navigation runtime ownership

### Scope Note

This doc is intentionally about the `Fly-Mode` subfamily only.

It is mainly about:
- visible fly-mode UI and HUD polish
- fly-mode readability and discoverability
- small user-facing fly follow-ons that belong to the viewport UI surface

It is not the main home for:
- fly-session input ownership
- fly camera math
- keyboard-routing rules
- pointer-lock behavior
- core movement semantics

Those still belong in `Camera-Controls`.

## Doc Body

### Short Version

The `Fly-Mode` subfamily should become the forward-only planning home for visible fly-mode UI work.

That means:
- viewport-local HUD/status cleanup
- small fly affordances and readability follow-ons
- future narrow UI polish passes for fly mode

It should not become:
- a second owner for fly runtime behavior
- a replacement for `Camera-Controls`
- a grab bag for general viewer input changes

### Why This Doc Exists

The repo now has real fly-navigation behavior under `Camera-Controls`, including:
- held-`RMB` fly-session ownership
- roll, speed, and pointer-lock follow-ons
- viewport-local fly-speed control

What was still missing was one simple family home for the visible fly-mode surface itself:
- the HUD and small viewport-facing UI around fly mode
- later polish passes that are about what the user sees rather than how the camera runtime works

This doc exists to give that work one clean forward-only landing surface.

### Family Structure

Use this folder like this:

- `Fly-Mode-Index.md`
  - umbrella fly-mode family index
  - forward-only family summary
  - future phase landing surface
- `Fly-Mode-Vision.md`
  - stable north-star doc for fly-mode feel and generation direction
  - current home for the `Generation 2` gravity-and-FPV research target
- `Fly-Mode-Gen2-Index.md`
  - dedicated phased planning home for the `Generation 2` gravity-and-FPV lane
  - current home for the ordered runtime, controller, and FPV-radio follow-on breakdown
- `Future/`
  - later standalone fly-mode execution/planning docs
  - `Fly-Mode_Phase Fly-Mode 1 - Polish UI And Small Features.md`
- `Future2/`
  - standalone execution/planning docs for the `Generation 2` lane
  - `Fly-Mode_Phase Gen2-1 - Runtime Seams And Shared Input Contract.md`

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `Camera-Controls`
  - fly-session start/stop rules
  - keyboard and mouse ownership
  - movement, look, roll, speed, and pointer-lock runtime behavior
- `Fly-Mode`
  - visible fly-mode HUD and small viewport UI follow-ons
  - readability, layout, and discoverability polish for fly mode
  - stable generation-level direction for what later fly mode should feel like
  - narrow user-facing fly conveniences that do not redefine fly runtime ownership
- `View-Toolbar`
  - broader explicit view controls
  - non-fly camera/view control grouping

Important rule:
- do not move fly-navigation truth out of `Camera-Controls` just because a fly-mode UI pass touches the same viewport surface
- do use `Fly-Mode-Vision.md` when the repo needs to name later feel goals such as gravity-influenced FPV-style flight without prematurely locking implementation math here
- do use `Fly-Mode-Gen2-Index.md` when the repo needs the concrete phase order for gravity, thrust, gamepad, and FPV-radio follow-ons without collapsing that planning into `Generation 1` UI polish

### Phase Ladder

The `Fly-Mode` subfamily should stay forward-looking and start with one narrow first phase.

## [ ] Fly-Mode 1 - Polish UI And Small Features

Standalone future doc:
- `docs/Human-Plans/Architecture/View-Toolbar/Fly-Mode/Future/Fly-Mode_Phase Fly-Mode 1 - Polish UI And Small Features.md`

Role in the family:
- first concrete fly-mode UI phase
- first narrow polish-and-follow-on lane for the visible fly surface

Owns:
- viewport-local fly HUD polish
- small quality-of-life improvements around visible fly feedback
- keeping those changes scoped to user-facing fly UI rather than camera-runtime behavior
- the first dedicated `Fly Mode` subsection under the `View` toolbar when fly controls need to graduate from HUD-only status into one explicit visible toolbar home
- the next explicit activation-mode selector in that same `Fly Mode` toolbar home, once the user needs a visible way to switch from hold-`Right Click` entry to an opt-in `Always On` mode

Current shipped follow-on:
- `ViewToolbar.tsx` now has one dedicated `Fly Mode` section with a viewer-backed `Roll Speed` `ParaSlider` plus a `Fly Mode Activate` `ParaSelect`
- that same section now also includes a viewer-backed `Fly Mode Type` `ParaSelect` with:
  - `Drone`
  - `Free Cam`
- the activation select now exposes:
  - `Right Click`
  - `Always On`
- `Right Click` remains the shipped default, while opt-in `Always On` now starts from the next viewport click, consumes that entry click, survives pointer release, and still ends through real runtime stop conditions or switching back to `Right Click`
- `Drone` preserves the current shipped fly behavior
- `Free Cam` now keeps the camera upright while looking around and ignores manual roll input
- the underlying activation truth, roll behavior, and fly runtime still stay owned by `Camera-Controls` plus `Viewer.ts`

Next planned follow-on:
- no new `Fly-Mode 1` follow-on is locked yet
- use the phase doc or the broader `Generation 2` lane before widening the fly feel further

Guardrail:
- keep this lane forward-looking and UI-scoped
- do not widen it into fly camera ownership, keyboard routing, or deeper `Viewer.ts` / `CameraController.ts` behavior unless a tiny supporting seam is truly needed for the visible UI

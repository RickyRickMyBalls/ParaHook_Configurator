# Viewport HUD Index

## Doc Header

### Doc History
2. 2026-04-15 07:26:44: Updated this family index to narrow `Viewport-HUD 1` around exactly two first-cut dock targets, `gizmo-left` and `under-view-toolbar`, and to frame drag as the gesture for switching between those two placements instead of widening the opening lane into free-floating or full edge docking
1. 2026-04-15 00:46:11: Added this umbrella planning index for the new `Viewport-HUD` family under `Architecture`, pointed it at the first standalone future phase doc for `Viewport-HUD 1`, and locked the folder as the forward planning home for viewport-local HUD docking, resizing, and presentation polish without moving geometry, fly, or worker truth out of their current owners

### Purpose

This file is the umbrella planning index for the `Viewport-HUD` family under `Architecture`.

Use it to answer:
- what the `Viewport-HUD` family is supposed to own
- how the HUD should stay separated from `Model-Viewport`, `View-Toolbar`, `Camera-Controls`, and `Worker`
- where future standalone viewport-HUD phase docs should branch
- which visible viewport-HUD follow-ons deserve their own family instead of being buried in nearby docs

### Scope Note

This doc is intentionally about the viewport-local HUD surface only.

It is mainly about:
- viewport-local HUD presentation
- HUD docking and anchoring behavior
- HUD resizing behavior
- HUD readability and visible layout polish

It is not the main home for:
- geometry execution truth
- result-state semantics
- fly runtime behavior
- toolbar command grouping
- viewer input ownership

Those should stay in their current canonical families.

## Doc Body

### Short Version

The `Viewport-HUD` family should become the forward planning home for the small overlay panel that sits inside the active viewport and shows viewport-local readouts such as:
- `Geometry: ...`
- `Mode: ...`
- `Selected: ...`
- `Fly Speed`

This family should own how that HUD docks, sizes, and presents itself.

It should not become:
- a second owner for geometry truth
- a second owner for fly runtime behavior
- a duplicate toolbar family

### Why This Doc Exists

The repo already has real HUD behavior, but its planning direction is currently scattered across nearby families:
- `Model-Viewport` owns viewport presentation and status honesty
- `Camera-Controls` owns fly runtime and the fly-speed seam that the HUD reads
- `View-Toolbar` owns the explicit click-first control surface
- `Worker` owns the deeper result-state semantics behind the visible `Geometry:` readout

What was still missing was one simple family home for the HUD surface itself:
- how it should dock inside the viewport
- how it should resize
- how it should stay viewport-local
- how later visible HUD polish should be planned without turning into another runtime family

This doc exists to give that surface one clean planning home.

### Family Structure

Use this folder like this:

- `Viewport-HUD-Index.md`
  - umbrella viewport-HUD family index
  - family summary
  - future phase landing surface
- `Future/`
  - standalone viewport-HUD execution/planning docs
  - `Viewport-HUD_Phase Viewport-HUD 1 - Docking And Resizing.md`
- `Shipped/`
  - later shipped records if the family grows into multiple implemented cuts

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `Model-Viewport`
  - viewport composition
  - viewport-visible status honesty
  - wider viewport presentation rules
- `Camera-Controls`
  - fly runtime ownership
  - fly-speed behavior and value semantics
- `View-Toolbar`
  - explicit click-first viewport/view controls
  - toolbar grouping and section ownership
- `Worker`
  - deeper result-state semantics and geometry status truth
- `Viewport-HUD`
  - viewport-local overlay panel presentation
  - docking, anchoring, resizing, and visible layout behavior
  - HUD readability and compact presentation polish

Important rule:
- do not let the HUD become a second hidden owner for geometry, fly, or viewer-runtime truth just because it displays those values

### Current Starting Point

Current code-backed read:

- `src/app/components/ViewportOverlay.tsx`
  - renders the current viewport-local HUD through `.ViewportOverlayWidget.ViewportHud`
  - already includes the visible result, mode, selection, and fly-speed surfaces
- `src/app/theme/surfaces/viewport-overlay.css`
  - already owns the current HUD styling seam
- `src/app/components/viewToolbarLayout.ts`
  - already exposes the current HUD-right offset helper used to anchor the surface against the viewport-local gizmo and dock math
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-7.5-15 - Model Viewport Local View Toolbar State.md`
  - already records that the HUD offset should stay tied to per-viewport local axis-widget sizing rather than shared global host math

Implementation-ready rule:
- start from the existing `ViewportOverlay.tsx` HUD seam instead of inventing a second overlay owner

### Phase Ladder

The `Viewport-HUD` family should stay small and start with one explicit first phase.

## [ ] Viewport-HUD 1 - Docking And Resizing

Standalone future doc:
- [`Future/Viewport-HUD_Phase Viewport-HUD 1 - Docking And Resizing.md`](./Future/Viewport-HUD_Phase%20Viewport-HUD%201%20-%20Docking%20And%20Resizing.md)

Role in the family:
- first concrete viewport-HUD execution lane
- first explicit docking-and-resizing pass for the visible HUD surface

Owns:
- viewport-local HUD docking direction for `gizmo-left` and `under-view-toolbar`
- HUD anchoring and repositioning rules
- HUD resizing behavior
- visible presentation cleanup needed to make docking and resizing feel intentional

Guardrail:
- keep this lane presentation-local
- keep the first pass limited to the two explicit dock targets above
- treat drag as the switch gesture between those two placements
- do not widen it into geometry, fly-runtime, toolbar, or worker semantics

### Open Questions

#### [ ] `q1` Should the first pass stay locked to `gizmo-left` and `under-view-toolbar`, or widen only after those two placements prove out?

Suggestion:
- keep the first pass locked to those two named placements
- if later variation is needed, widen only after the two-position dock model proves out cleanly

#### [ ] `q2` Should resizing be purely temporary per viewport or remembered per viewport?

Suggestion:
- prefer per-viewport remembered sizing once the resize seam is real
- keep that state local to the viewport shell instead of inventing a global HUD size

#### [ ] `q3` Should the HUD and the `View` toolbar share layout language without becoming one surface?

Suggestion:
- yes
- share visual logic where helpful, but keep the HUD as a compact readout surface and the toolbar as the explicit control surface

### Done Means

This family is in a healthy state when:

- the repo has one canonical `Viewport-HUD` architecture home
- viewport-local HUD docking and resizing have one dedicated planning surface
- the HUD stays separated cleanly from geometry, fly, worker, and toolbar ownership
- future standalone viewport-HUD execution docs can branch here instead of being invented in unrelated files

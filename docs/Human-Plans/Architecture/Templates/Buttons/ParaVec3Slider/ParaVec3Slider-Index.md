# ParaVec3Slider Index

## Doc Header

### Doc History
1. 2026-04-17 15:59:00: Created this umbrella planning index for the new `ParaVec3Slider` family under `Architecture/Templates/Buttons/`, set up the folderized `Future/` and `Shipped/` structure as a real planning home, and added the first `PV3S - 1` enrichment phase so the current shared vec3 control can grow through one explicit family instead of staying a thin wrapper with feature-local follow-ons

### Purpose

This file is the umbrella planning index for the `ParaVec3Slider` family under `Architecture/Templates/Buttons/`.

Use it to answer:
- what the shared `ParaVec3Slider` surface is supposed to own
- how it should stay separate from `ParaSlider` core behavior
- which current vec3-control needs are already real in live feature call sites
- where future standalone `PV3S` docs should branch

### Scope Note

This doc is intentionally about the shared `ParaVec3Slider` wrapper pattern.

It is mainly about:
- shared three-axis slider presentation
- axis-level forwarding and formatting behavior
- vec3-level enrichment that is already justified by real call sites
- family drift between `ParaVec3Slider` and nearby shared vector controls

It is not the main home for:
- `ParaSlider` scalar behavior
- transform business logic
- toolbar-specific or viewport-specific interaction rules
- one-off feature-local layout copy

Those should stay in their own families or owning implementation surfaces.

## Doc Body

### Short Version

ParaHook already has a real `ParaVec3Slider`, but today it is still the thinner sibling in the vector-control family.

Right now it already gives shared callers:
- one three-column vec3 wrapper
- `x / y / z` axis ordering
- axis-aware `onChangeAxis(...)`
- optional `onChangeEndAxis(...)`
- shared formatting and display hooks
- compact shared styling

But it still trails the neighboring vector family in meaningful ways:
- `ParaVec2Slider` already carries clamp-edit support
- current vec3 callers still solve some state and presentation needs outside the component
- the family has no dedicated planning home yet

The family goal is not to invent a giant generic vector-control framework.

The family goal is to enrich the existing vec3 wrapper honestly, based on the real shared needs already visible in transform, snap, and history surfaces.

### Why This Doc Exists

Recent UI work proves that `ParaVec3Slider` is no longer just a throwaway helper:
- it already renders in `ReferenceTransformToolbar`
- it already renders in `ViewportOverlay`
- it already has shared CSS and a focused test
- it already sits next to a richer `ParaVec2Slider` sibling

That means the vec3 wrapper is now large enough to deserve its own planning home.

This doc exists so `ParaVec3Slider` enrichment can happen:
- as a real shared component family
- without pretending every vector-control concern belongs in `ParaSlider`
- without trapping vec3 follow-ons inside one feature surface

### Family Structure

Use this folder like this:

- `ParaVec3Slider-Index.md`
  - umbrella architecture direction
  - vec3 wrapper ownership summary
  - shared phase ladder
- `Future/`
  - standalone vec3-slider execution/planning docs
  - `ParaVec3Slider_Phase PV3S - 1 - Existing Component Enrichment.md`
- `Shipped/`
  - later shipped vec3-slider phase records

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `ParaVec3Slider`
  - shared vec3 wrapper behavior
  - axis-level vec3 presentation and forwarding
  - vec3-level enrichment justified by multiple live call sites
- `ParaSlider`
  - scalar slider behavior
  - dragging, wrapping, numeric entry, clamp-range runtime
  - scalar visual primitives
- `ParaVec2Slider`
  - shared vec2 wrapper behavior
  - vec2-specific clamp-edit wrapper ownership
- feature surfaces like `ReferenceTransformToolbar` and `ViewportOverlay`
  - transform business logic
  - feature-local state ownership
  - feature-local commands and side effects

Important rule:
- do not let the vec3 family quietly absorb `ParaSlider` core ownership
- do not keep real shared vec3 behavior permanently trapped in feature-local branches when the wrapper should own it

### Current Live Read

Current shared vec3 wrapper owner:
- `src/app/components/ParaVec3Slider.tsx`

Current shared proof surfaces:
- `src/app/components/ParaVec3Slider.test.tsx`
- `src/app/theme/foundation/base.css`

Current live callers:
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`

Current neighboring family reference:
- `src/app/components/ParaVec2Slider.tsx`

Current honest read:
- `ParaVec3Slider` is real and reused
- the current wrapper is intentionally small
- the family already has live call sites that justify shared enrichment
- `ParaVec2Slider` proves that some vector-level behavior should live above scalar `ParaSlider`

### Core Direction

`ParaVec3Slider` should become a slightly richer shared vec3 control, not a fake all-purpose vector UI framework.

Good vec3-family ownership:
- shared axis ordering and labeling
- shared vec3 formatting and display hooks
- axis-level wrapper behavior that multiple vec3 callers need
- honest parity improvements when nearby shared vector controls already prove the pattern

Bad vec3-family ownership:
- generic business logic for every transform surface
- feature-only command routing
- scalar slider runtime that belongs in `ParaSlider`
- speculative abstraction for vector sizes that do not have real callers yet

### Family Phase Ladder

## [ ] `PV3S - 1` - `Existing Component Enrichment`

Goal:
- enrich the existing shared vec3 wrapper through one explicit family phase grounded in the current component, sibling drift, and live transform call sites

Why it exists:
- the current vec3 wrapper is real, reused, and slightly underspecified compared with its neighboring shared vector family

Standalone future doc:
- [ParaVec3Slider_Phase PV3S - 1 - Existing Component Enrichment](./Future/ParaVec3Slider_Phase%20PV3S%20-%201%20-%20Existing%20Component%20Enrichment.md)

Current read:
- this should be the first honest vec3-family enrichment lane before broader template cleanup or speculative vector unification
- the immediate likely target is wrapper-level enrichment that keeps `ParaVec3Slider` simple while giving real shared vec3 callers fewer feature-local workarounds

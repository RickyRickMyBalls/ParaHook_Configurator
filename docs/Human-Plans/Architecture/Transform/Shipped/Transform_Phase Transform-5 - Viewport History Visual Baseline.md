# Transform Phase Transform-5 - Viewport History Visual Baseline

## Doc Header

### Doc History
2. 2026-03-27 01:35: Marked this phase shipped after the committed reference transform-history viewport overlay landed in code, moved the standalone phase record into `Shipped/`, and aligned the doc to the delivered move polyline plus first-pass rotate and scale history overlay behavior
1. 2026-03-27 00:50: Created this standalone `Transform 5` future phase doc under the Transform family, translating the locked viewport-history visual decisions into an implementation-ready first-pass spec for committed move, rotate, and scale history overlays before any traversal / preview / restore behavior exists

### Purpose

This phase lands the first committed transform-history viewport visuals.

Use it to answer:
- how committed transform history should first render in the viewport
- how move, rotate, and scale history visuals should align with the committed toolbar history model
- how to keep committed visuals separate from live in-progress transform guides
- how to keep the first visual pass narrow enough that traversal stays out of scope

## Doc Body

## [x] Transform 5 - Viewport History Visual Baseline

### Summary

`Transform 5` is the first viewport-history visual pass after:
- `Transform 4.2`
  - shared store-owned reference draft/session truth
- `Transform 4.3`
  - grouped reference transform history presentation
- `Transform 4.4`
  - shared Console/toolbar adapter cleanup

By this point, committed transform history exists and the toolbar reads it honestly, but the viewport still has no equivalent committed-history read.

This phase should add the first visual baseline only:
- committed move history should render as the same thin checkpoint-turn polyline used by shipped `SketchPlane` history
- committed rotate history should show before/after normals plus an arc between them
- committed scale history should compare before/after sphere size
- live gizmo / drag visuals should stay separate from the committed history overlays
- traversal, preview, selection playback, and restore remain out of scope

Phase outcome:
- the viewport gains a committed transform-history read aligned with the toolbar
- move history uses the shipped `SketchPlane` visual language
- rotate and scale gain first dedicated committed-history overlays
- the visual pass stays narrow and does not invent traversal state early

### Shipped Result

The shipped `Transform 5` cut landed the intended first committed viewport-history baseline:
- `ViewerHost` now derives a committed reference-transform history overlay VM from the same committed `delta + after` history rows the toolbar reads
- `Viewer` now owns a dedicated reference-transform history overlay seam instead of folding this into unrelated viewer state
- move history now renders as the expected thin checkpoint-turn polyline from the reference base through committed landed move points
- rotate history now renders before/after normals plus an arc
- scale history now renders first-pass before/after sphere-style size comparison guides
- traversal, preview playback, and restore behavior remain out of scope for the later `Transform 6` pass

### Owns

- the first committed viewport-history overlays for reference transform
- committed move-history polyline rendering
- committed rotate-history before/after normal plus arc rendering
- committed scale-history before/after sphere comparison rendering
- separation between committed-history visuals and live in-progress transform guides
- first-pass clutter/emphasis defaults for committed history visuals

### Does Not Own

- traversal / preview / restore behavior
- scrub state or explicit history selection playback
- a second parallel history model separate from committed toolbar/store truth
- widening this pass to object, folder, or assembly transform history in the same first cut
- broader transform-shell or Console grammar cleanup already handled by `Transform 4.4`

### Locked Direction

#### 1. Move history should copy shipped `SketchPlane` history-line behavior

Locked rule:
- copy the shipped `SketchPlane` committed history line behavior
- draw one thin committed polyline from the original origin through each successive committed move origin
- keep visible checkpoint turns where the path changes direction
- keep the committed path separate from any live drag or current-entry guide

Primary reference:
- `src/viewer/sketch/SketchPlanePickHelper.ts`

Expected read model:
- use the same committed move-history truth the toolbar reads
- seed the path from move identity origin `(0, 0, 0)`
- append each committed move landed `after` point in order
- flatten those checkpoints into pairwise line segments for rendering

#### 2. Rotate history should show before/after normals plus an arc

Locked rule:
- rotate history should show the normal direction before and after the committed rotate
- render an arc between those normals to show the angle change
- keep the first pass visual and readable without requiring numeric labels

Expected read model:
- derive `before` from the prior committed rotate state or rotate identity `(0, 0, 0)`
- read `after` from the committed rotate history row
- build one visual per committed rotate row

#### 3. Scale history should compare before/after sphere size

Locked rule:
- scale history should compare the relative size of a before-versus-after sphere
- keep the first pass readable as a size comparison instead of a busier generic overlay stack

Expected read model:
- derive `before` from the prior committed scale state or scale identity `(1, 1, 1)`
- read `after` from the committed scale history row
- build one visual per committed scale row

#### 4. Committed visuals should stay aligned with the committed toolbar history model

Locked rule:
- viewport history should read the same committed history list shown in the toolbar
- do not invent a second unsynced history structure just for rendering
- merged-away rows should disappear from both toolbar and viewport

Direction:
- use committed child rows as the rendering truth
- grouped session parents remain presentation over that same child-entry model
- this phase should remain compatible with the later `Transform 6` traversal layer

#### 5. Keep the first clutter rule simple

Recommended first-pass rule:
- selected or active history rows should render strongest
- older history visuals should stay visible but faded
- merged-away rows should not render

Direction for this phase:
- use that rule as the baseline clutter policy for the first cut
- if no explicit history row is selected yet, render all committed history at passive strength
- defer richer traversal-driven emphasis until `Transform 6`

### Implementation Direction

#### Store / View-Model seam

Primary target:
- `src/app/components/ViewerHost.tsx`

Expected changes:
- derive committed reference transform history overlay data from the same store history rows the toolbar reads
- pass committed move checkpoints and committed rotate/scale before/after visual data into the viewer layer
- keep active draft/session visuals separate from committed history overlay data

Suggested overlay split:
- move history checkpoints or pre-flattened segments
- rotate history visual rows with derived `before` and stored `after`
- scale history visual rows with derived `before` and stored `after`

#### Viewer / helper rendering

Primary targets:
- `src/viewer/Viewer.ts`
- a dedicated reference-transform overlay helper if needed

Expected changes:
- add a committed reference transform history overlay seam parallel to the existing `SketchPlane` history guide pattern
- render move history as thin `LineSegments`
- render rotate history with normal guides plus an arc visual
- render scale history with before/after sphere comparison guides

Important rule:
- live transform gizmo guides remain separate objects from committed history visuals

#### Toolbar / viewport coordination

Primary target:
- `src/app/components/ReferenceTransformToolbar.tsx`

Expected changes:
- no major toolbar reshape is required in this phase
- if row-hover or active-row emphasis is already available, allow the viewport visual layer to consume that emphasis signal
- do not add scrub behavior here

### Required File Targets

Primary implementation seams:
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`

Likely helper / test seams:
- `src/viewer/sketch/SketchPlanePickHelper.ts`
- `src/app/components/ViewerHost.test.tsx`
- viewer-side history overlay tests if added beside the new helper

### Test Plan

Required verification:

- move history:
  - committed move history renders from origin through each committed landed move point
  - the viewport path uses the same checkpoint-turn polyline shape as shipped `SketchPlane`
  - merged-away move rows disappear from the path

- rotate history:
  - committed rotate rows render before/after normal directions
  - an arc renders between those normals
  - the visual uses committed rotate history only, not live drag state

- scale history:
  - committed scale rows render before/after sphere-size comparison visuals
  - first scale row uses `(1, 1, 1)` as the implicit before baseline

- coordination:
  - committed viewport visuals stay aligned with the same committed history rows the toolbar reads
  - live transform guides remain separate from committed history visuals
  - no traversal / preview / restore state is required for the first pass

### Assumptions

- this phase stays reference-history first
- committed history rows already provide enough data to derive rotate/scale `before` from prior committed rows
- `Transform 6` will layer traversal, preview, selection emphasis, and restore on top of this same committed model later
- the first clutter rule should stay simple: active strongest, old faded, merged-away hidden

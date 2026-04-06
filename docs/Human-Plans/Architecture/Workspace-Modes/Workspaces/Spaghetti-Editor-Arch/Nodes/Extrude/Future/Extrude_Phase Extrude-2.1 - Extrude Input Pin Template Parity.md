## Doc Header

### Doc History
3. 2026-04-04 22:54: Closed `Extrude-2.1` after the `Geometry/Extrude` `ExtrusionProfile` row stopped using the plain generic fallback row and now follows the managed row-and-pin language already proven by `SketchPlane` and `SketchDraw`, with focused `NodeView` regressions extended around the new label, default-open essentials state, and row-cycle behavior
1. 2026-04-04 22:37: Created this dedicated `Extrude-2.1` future doc as the first narrow execution slice inside `Extrude-2`, centering it on the extrude profile input pin and its initial parity target with the sketch-template language
2. 2026-04-04 22:37: Tightened `Extrude-2.1` into an implementation-ready row-only slice by grounding it in the live managed sketch input-row treatment for `SketchPlane` and `SketchDraw`, locking the first cut to the `ExtrusionProfile` row and pin only, and leaving the broader extrude toolbar shell for later `Extrude-2` work

## [x] - `Extrude-2.1` - `Extrude Profile Input Row And Pin Parity`

### Summary

#### Purpose:
- make the `Geometry/Extrude` profile input row and pin match the decent managed input-row language already used by `SketchPlane` and `SketchDraw` before wider toolbar polish begins

#### Owns:
- the first dedicated execution slice inside `Extrude-2`
- matching the extrude profile input row and pin presentation to the managed geometry-row language already proven by `Geometry/Sketch`
- clarifying the first profile-input wording so the extrude node speaks the same language as the upstream sketch output
- focused template and port-row regression coverage for the new extrude profile-input shape

#### Does not own:
- the full dedicated extrude toolbar shell
- the later wider toolbar controls for direction, review flow, or command entry
- `Extrude-1B` contract convergence
- plural profile-input rollout
- `taper/offset` runtime support

#### Current seam read:

- `NodeView.tsx` already has a dedicated `template="sketch"` path and a separate `template="extrude"` path
- the sketch node is still messy overall, but its managed input rows for `SketchPlane` and `SketchDraw` already feel materially better than the generic fallback rows
- those sketch rows use the managed geometry-row path in `NodeView.tsx`, including row-open state, chevron behavior, attached body content, and stronger row-specific wording
- the extrude template already exists, but its profile input still renders through the generic `renderInputPortByType(...)` row path without that stronger managed-row treatment
- the current extrude profile input still speaks in the older `ExtrusionProfile` language even though the upstream source family already centers `SketchProfile`

Current strongest read:
- the first `Extrude-2` step should not start with the full toolbar shell
- it should start by making the main profile input row feel like it belongs to the same managed geometry family as `SketchPlane` and `SketchDraw`

### Questions

#### [x] Question 1 - Should this first slice change only styling, or also the displayed wording around the profile input?

##### Locked answer
- do both
- match the pin and row presentation to the managed sketch-row language
- also align the displayed wording around the consumed profile with the upstream `SketchProfile` terminology where that can be done without reopening deeper runtime contracts

##### Why
- pure visual parity would still leave the node speaking two different profile languages
- the point of this slice is to make the extrude input feel like a downstream continuation of the sketch template

#### [x] Question 2 - Should this phase rename the underlying runtime port id immediately?

##### Locked answer
- no
- preserve the current underlying port contract unless a code read during implementation proves that the port id can be changed safely as part of the same narrow slice
- prioritize template parity and displayed-surface honesty first

##### Why
- the first task here is UI and template parity, not a wider contract migration
- keeping the internal wire contract stable makes this slice safer and easier to verify

#### [x] Question 3 - What should count as parity with the sketch input rows?

##### Locked answer
- the extrude input pin should stop reading like a fallback generic port row
- it should use the same managed-row language already visible on `SketchPlane` and `SketchDraw`
- the profile target summary and empty-state hint should read as a direct downstream continuation of the sketch output model

##### Why
- the user should be able to read `Sketch -> Extrude` as one coherent authored flow
- the template language should reinforce that the consumed profile came from sketch-owned truth

#### [x] Question 4 - Should `Extrude-2.1` try to clean up the full sketch template or extract a large shared template framework first?

##### Locked answer
- no
- reuse or extract only the smallest row-and-pin helpers needed for the extrude profile input
- do not widen this slice into "clean up sketch" or "build a full generic template framework"

##### Why
- the sketch node still has a lot of sketch-specific mess outside the decent input-row seam
- the narrow value here is copying the good row/pin language, not dragging in a large abstraction project first

### Spec

Locked first-cut direction:
- treat this as the first concrete `Extrude-2` execution slice
- update the extrude template so the consumed profile input row and pin match the decent managed sketch-row language already present in the node canvas
- keep the slice narrow:
  - one profile input row/pin presentation
  - profile wording and hint text
  - focused regression coverage
- do not widen this pass into the full toolbar shell or later control families

Locked in-scope:
- the `ExtrusionProfile` input row in the `template="extrude"` node canvas path
- the row/pin presentation and affordances for that one input
- the empty-state hint and resolved-value wording shown on that row
- the smallest shared helper extraction only if needed to reuse the sketch input-row language safely

Locked out-of-scope:
- the `Depth` row beyond any incidental style alignment needed to avoid visual breakage
- the broader extrude toolbar shell
- sketch-node cleanup outside the row/pin language we are borrowing
- port-type or runtime contract migration
- `Extrude-1B` contract convergence work

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/registry/nodeRegistry.ts`

Suggested execution order:
1. Re-read the current managed sketch input-row treatment for `SketchPlane` and `SketchDraw` in `NodeView.tsx`.
2. Identify the smallest row/pin helper or render seam that can be reused for the extrude profile input without copying the whole sketch template.
3. Update the `ExtrusionProfile` row so it no longer reads as a generic fallback row beside a dedicated extrude template.
4. Align the displayed row wording and empty-state hint with the sketch-owned `SketchProfile` language where safe, while keeping the underlying wire/runtime contract stable.
5. Extend focused node-template tests so the extrude profile input row and pin shape are locked against regression.

Implementation-ready checks:
- confirm the live managed sketch-row seam is truly reusable before extracting anything larger
- preserve the current `ExtrusionProfile` port id unless a tiny rename is proven safe inside the same narrow slice
- keep the `Depth` row and body summary behavior functionally unchanged in this pass

Acceptance checks:
- the extrude profile input no longer reads like a generic fallback row beside a dedicated geometry template
- the extrude profile input row and pin feel visually consistent with the `SketchPlane` / `SketchDraw` input rows
- the visible profile wording aligns more closely with the sketch-template language
- existing extrude depth and body-summary behavior stay intact
- the landed authored-plane and preview-alignment runtime fixes remain unaffected

Definition of done:
- `Geometry/Extrude` starts from a profile-input surface that visually belongs to the same family as the decent sketch input rows
- the first `Extrude-2` slice is narrow, implementation-ready, and ready to build on for the later dedicated toolbar work

Current shipped output:
- the `ExtrusionProfile` input row in the dedicated extrude template now behaves like a managed row instead of a plain generic fallback row
- the visible row label now reads as `SketchProfile` while the underlying wire/runtime port contract stays stable
- essentials mode now opens that row by default the same way the decent managed sketch input rows do
- the row now cycles through collapsed, essentials, and expanded states with focused attached-body messaging instead of one long fallback hint jammed into the value label

# `Extrude-5` - `Output Row Standardization And UI Cleanup`

## Doc Header

### Doc History
7. 2026-04-08 09:18: Marked `Extrude 5 Phase 3 - Attached Waiting Body And Surface Honesty Cleanup` shipped after the live `SolidBody` attached body stopped repeating the same long summary text in both visible positions, the body title became output-specific for ready states and requirement-specific for waiting states, and focused `NodeView` tests proved the calmer summary/detail split without changing the shipped row shell or shared helper boundary
6. 2026-04-08 09:09: Tightened `Extrude 5 Phase 3 - Attached Waiting Body And Surface Honesty Cleanup` into an implementation-ready next slice by grounding it in the live `renderExtrudeBodyAttachedBody(...)` copy still duplicating the same `bodySummary` across essentials and expanded states, the generic `Ready / Waiting` attached-body title, and the recommendation that the final pass should polish the attached body into one calmer output-specific summary/detail read without changing the shipped row shell or helper boundary
5. 2026-04-08 09:07: Marked `Extrude 5 Phase 2 - Shared Output Row Helper Adoption` shipped after `NodeView.tsx` stopped carrying separate managed-output adoption paths for sketch versus extrude, the new shared managed geometry output helper began owning row-controller hookup plus attached-body passthrough for both families, and the focused node-surface tests proved the helper cleanup kept the shipped `SolidBody` row behavior intact while refreshing this doc so `Phase 3 - Attached Waiting Body And Surface Honesty Cleanup` is now the next honest follow-on
4. 2026-04-08 09:04: Tightened `Extrude 5 Phase 2 - Shared Output Row Helper Adoption` into an implementation-ready next slice by grounding it in the newly shipped managed `SolidBody` row now wired through extra extrude-specific `NodeView.tsx` plumbing, the shared `PortView.tsx` attached-body seam, and the recommendation that the next pass should extract the smallest honest reusable managed-output helper boundary instead of leaving deeper output-row reuse trapped inside the extrude template
3. 2026-04-08 08:54: Marked `Extrude 5 Phase 1 - Output Row Template Contract Lock` shipped after the live `Geometry/Extrude` `SolidBody` output moved onto the managed output-row shell with a left chevron, left/right anchored header text, right-side output pin, and attached expandable body, then refreshed this doc so `Phase 2 - Shared Output Row Helper Adoption` is now the next honest follow-on if deeper helper extraction is still needed
2. 2026-04-08 08:44: Tightened `Extrude 5 Phase 1 - Output Row Template Contract Lock` with the explicit row-shape decisions that the `SolidBody` output should match the standardized input-row shell as a full-width type-colored row with a left chevron, one left-anchored label, one right-anchored status string, a right-side output pin, and expandable attached details
1. 2026-04-08 08:44: Added this dedicated future phase doc by carving the `SolidBody` output-row cleanup lane out of the broader extrude family read, splitting the work into `Extrude 5 Phase 1` through `Phase 3`, and tightening `Phase 1 - Output Row Template Contract Lock` into the first implementation-ready cut

### Purpose

Use this doc as the dedicated planning and execution surface for the next extrude-owned node-surface cleanup after the closed `Extrude-4` contract lane.

The goal here is:
- make the `Geometry/Extrude` `SolidBody` output row look like the calmer shared standardized output-row template
- stop shipping one custom output tile plus detached waiting note beside otherwise more standardized input rows
- keep this lane focused on visible row structure and helper-body attachment without reopening compile/runtime semantics
- let `Extrude` act as the first family-owned proving slice under the broader `Nodes-3` output-row direction

### Scope

This phase covers:
- the visible `SolidBody` output-row shell on `Geometry/Extrude`
- how the output label, value/status lane, border treatment, and output pin should line up with the shared row template
- how the waiting/help copy should attach to the output row as a body instead of reading like a separate floating block
- the first extrude-owned proving slice for broader output-row standardization

This phase does not cover:
- changing extrude compile/runtime behavior
- changing result ownership or output kinds
- reopening `Extrude-4` closed-profile consumption semantics
- broad all-node rollout beyond the first extrude proving slice
- new toolbar behavior or richer feature-stack runtime parity

## Doc Body

### Summary

`Extrude-5` is the dedicated node-surface cleanup lane for bringing the `Geometry/Extrude` `SolidBody` output onto the shared output-row language.

Current read:
- the input side of `Geometry/Extrude` has moved much closer to the shared row-template direction
- the output side still reads like a custom block:
  - one standalone `SolidBody` tile
  - one detached waiting/help card underneath it
- that visible split makes the node feel less settled than the stronger input rows
- the current output problem is UI-template drift, not missing runtime meaning

Locked recommendation:
- keep one visible `SolidBody` output row first
- rebuild it around the calmer shared output-row template instead of inventing another extrude-only output shell
- make the waiting/help copy an attached output-row body
- use this doc as the first extrude-owned `Nodes-3` proving slice rather than treating `Extrude` as a separate output-row system
- make the row read like an output-flavored version of the standardized input row instead of a separate card/tile pattern

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - owns the live `Geometry/Extrude` node surface
  - currently renders the visible `SolidBody` output row and the detached waiting/help body that should be brought back under one calmer row contract
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already carries the selector-owned extrude summary and waiting state that the output row reads
  - is the best seam for keeping output-row status text honest while the shell changes
- shared node-row and output-row helper seams under `src/app/spaghetti/`
  - are the likely source of the standardized row template this phase should adopt instead of rebuilding custom extrude-only chrome
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - remains nearby visible copy context that should stay aligned with whatever output wording the node row settles on

### Phase Breakdown

1. `Extrude 5 Phase 1 - Output Row Template Contract Lock`
Reason:
- the safest first cut is locking what the standardized `SolidBody` output row should structurally be before mixing in helper extraction or visual cleanup details
Current status:
- shipped
- current handoff:
  - `Phase 2 - Shared Output Row Helper Adoption`

2. `Extrude 5 Phase 2 - Shared Output Row Helper Adoption`
Reason:
- once the visible row contract is locked, the next honest step is routing `Extrude` through the shared helper/template seam instead of leaving another family-local output implementation
Current status:
- shipped
- current handoff:
  - `Phase 3 - Attached Waiting Body And Surface Honesty Cleanup`

3. `Extrude 5 Phase 3 - Attached Waiting Body And Surface Honesty Cleanup`
Reason:
- after the row shell is standardized, the remaining work is making the waiting/help body feel structurally attached and making sure the visible copy, pin placement, and row spacing all read as one coherent output surface
Current status:
- shipped
- this closes `Extrude-5` for the current `SolidBody` output-row cleanup subset

## [x] Extrude 5 Phase 1 - Output Row Template Contract Lock

### Summary

#### Purpose:
- lock the first explicit standardized output-row contract for the visible `Geometry/Extrude` `SolidBody` result
- decide what belongs in the row header versus the attached body
- avoid mixing this first slice with runtime, result ownership, or all-node rollout questions

#### Shipped result:
- the live `Geometry/Extrude` node now renders `SolidBody` through the managed output-row shell instead of a custom detached summary card
- the `SolidBody` row now reads as one standardized output row with:
  - a left chevron
  - left-anchored `SolidBody` label
  - right-anchored compact status text
  - right-side output pin
- the waiting/help copy now lives under that row as an attached expandable body instead of a separate floating block
- visible extrude output semantics stayed unchanged while the output row shell became structurally aligned with the calmer input-row language

#### Current handoff:
- `Extrude 5 Phase 2 - Shared Output Row Helper Adoption`
- use that next slice only if the current managed output-row adoption still needs deeper shared-helper extraction beyond the now-shipped row contract

#### Current strongest read:
- the current output mismatch is mainly structural:
  - label/value/pin treatment does not match the calmer row language already emerging elsewhere
  - the waiting/help copy reads like a second unrelated card instead of one output-row body
- the first pass should decide the row contract and adoption target before deeper polish

#### Locked direction:
- keep one `SolidBody` output row first
- make the row shell match the standardized input-row style:
  - full width
  - left chevron
  - one left-anchored text label
  - one right-anchored status string
- treat the output pin as part of the row shell, not as a separate tile affordance
- keep the output pin on the far right edge
- let the row color keep following the output object type
- keep the row compact when collapsed
- let the waiting/help content live as the attached row body
- keep visible output semantics unchanged while the shell becomes standardized

### Questions / Decisions

#### [x] Question 1 - Should `Extrude-5` change output semantics or only output-row structure?

##### Locked answer
- only output-row structure

##### Why
- the visible problem is UI drift, not missing geometry ownership
- reopening semantics here would blur a clean surface-standardization lane into earlier contract work

#### [x] Question 2 - What is the first cleanup target?

##### Locked answer
- the `SolidBody` output row plus its attached waiting/help body

##### Why
- that is the concrete mismatch on the current node
- solving one stable output row first is the cleanest proving slice before widening to more general output-row adoption

#### [x] Question 3 - Should the waiting/help copy stay detached or become an attached row body?

##### Locked answer
- it should become an attached row body

##### Why
- that keeps the output area reading as one result row with expandable detail instead of two unrelated widgets
- it aligns better with the broader `Structured Wire Rows` direction

#### [x] Question 4 - Should this phase be treated as an extrude-only style fork or as part of `Nodes-3`?

##### Locked answer
- treat it as one extrude-owned proving slice under `Nodes-3`

##### Why
- the shared row-template direction should stay generic
- `Extrude` can prove the first adoption slice without inventing another permanent family-local output style

#### [x] Question 5 - What should the visible `SolidBody` row header contain?

##### Locked answer
- one left-anchored label:
  - `SolidBody`
- one right-anchored status string:
  - use a compact readiness/state label rather than repeating the type name
- one right-side output pin

##### Why
- this keeps the row aligned with the standardized two-string row language already expected on the input side
- the details body can carry the longer explanatory text without overloading the row header

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- the shared node-row or output-row helper seams currently used for calmer standardized row rendering elsewhere under `src/app/spaghetti/`

Acceptance checks:
- the visible `SolidBody` row reads like the same family as the shared standardized row template
- the row header uses the same full-width two-string structure as the input rows:
  - label anchored left
  - compact status anchored right
- the output pin placement no longer feels like a custom tile treatment
- the waiting/help content reads like the body of the output row instead of a detached panel
- the node still exposes one `SolidBody` output and unchanged visible semantics

## [x] Extrude 5 Phase 2 - Shared Output Row Helper Adoption

### Summary

#### Purpose:
- move the `SolidBody` output row onto the actual shared output-row helper/template seam if Phase 1 proves a distinct helper/adoption step is needed

#### Shipped result:
- `NodeView.tsx` now routes managed sketch and extrude outputs through one shared managed geometry output helper instead of keeping separate family-specific managed-output adoption paths
- the shared helper now owns:
  - managed output row-controller hookup
  - output-row render call
  - optional attached-body passthrough
- `Geometry/Extrude` keeps the shipped `SolidBody` row shape from `Phase 1` while no longer carrying extra family-local managed-output plumbing for that behavior
- the visible sketch and extrude managed output rows now read more like the same output-row adoption system rather than two nearby but separate stories

#### Current handoff:
- `Extrude 5 Phase 3 - Attached Waiting Body And Surface Honesty Cleanup`
- use that next slice only for any remaining attached-body spacing, copy, or polish cleanup now that the managed helper boundary is cleaner

#### Current strongest read:
- `Phase 1` proved the visible row contract, but the current implementation still carries more extrude-local wiring than we want long-term:
  - `NodeView.tsx` now special-cases `SolidBody` as a managed extrude output row
  - the row reuses the shared `PortView.tsx` shell, but the managed-output adoption path itself is still thin and family-local
  - sketch already has a small managed output-row pass, but extrude and sketch do not yet read like they are both going through one clearer reusable helper boundary
- the next honest cleanup is not another visible redesign
- it is deciding the smallest reusable managed-output helper seam that lets `Extrude` keep its attached body and row controller behavior without leaving output-row reuse trapped inside one family template

#### Locked direction:
- keep the visible `SolidBody` row shape from `Phase 1`
- prefer extracting or clarifying one reusable managed-output helper boundary over adding more family-local output-row code in `NodeView.tsx`
- keep the extraction narrow:
  - managed row controller hookup
  - output-row render call
  - attached-body passthrough
- do not widen this slice into broader all-node output rollout unless a tiny shared helper change is required to let `Extrude` and `Sketch` speak the same managed-output language honestly

### Questions / Decisions

#### [x] Question 1 - What is the real remaining problem after `Phase 1` shipped?

##### Locked answer
- helper-boundary drift, not row-shape drift

##### Why
- the visible `SolidBody` row now looks correct
- the remaining debt is that the managed output adoption path still lives as extra family-local plumbing inside `NodeView.tsx`

#### [x] Question 2 - What should `Phase 2` own?

##### Locked answer
- the smallest honest reusable managed-output helper boundary needed for the shipped `SolidBody` row

##### Why
- that keeps this phase on shared output-row adoption instead of reopening design questions already settled in `Phase 1`
- it leaves broader output-family rollout to later `Nodes-3` work

#### [x] Question 3 - Should `Phase 2` redesign the visible `SolidBody` row again?

##### Locked answer
- no

##### Why
- the visible contract is already locked and shipped
- this phase should preserve that output row while reducing the amount of extrude-specific render plumbing behind it

#### [x] Question 4 - Which seams should anchor the implementation?

##### Locked answer
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- the existing managed row-controller seam in `src/app/spaghetti/canvas/structuredWireRowController.ts`

##### Why
- those are the current owners of the managed row controller, output render call, and attached-body passthrough
- that is enough surface to sharpen reuse without pretending a larger node-template extraction is required immediately

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/structuredWireRowController.ts`
- any tiny shared helper extracted beside those seams if needed to keep managed output-row adoption generic

Acceptance checks:
- `Geometry/Extrude` keeps the shipped `SolidBody` row shape from `Phase 1`
- the managed output-row adoption path is clearer and less family-local than the current direct `NodeView.tsx` plumbing
- the shared helper boundary still supports:
  - left chevron row control
  - right-side output pin
  - compact right-hand status text
  - attached expandable row body
- sketch and extrude no longer look like they need separate managed-output adoption stories for the same row behavior

#### Direction:
- prefer shared helper adoption over another extrude-local output renderer
- keep this slice narrow to structure and reuse only
- do not widen into other nodes in the same pass unless the shared seam needs a tiny generic extraction to let `Extrude` adopt it honestly

## [x] Extrude 5 Phase 3 - Attached Waiting Body And Surface Honesty Cleanup

### Summary

#### Purpose:
- finish the visible cleanup after the row shell is standardized by aligning the attached waiting/help body, spacing, and output copy with the calmer shared output-row language

#### Shipped result:
- the attached `SolidBody` body now uses a calmer summary/detail split instead of repeating the same long `bodySummary` sentence twice
- waiting states now read through a requirements-focused attached-body title:
  - `Build requirements`
- ready states now read through output-specific attached-body titles:
  - `Body Output`
  - `Wall Output`
- the attached hint copy now says what the row publishes or what it still needs before it can publish, while expanded details remain free to carry separate output/result detail later
- the shipped row shell, compact `Ready / Waiting` header status, right-side output pin, and shared managed-output helper boundary all stayed unchanged

#### Current strongest read:
- the visible row shell and helper boundary are now in the right place
- the remaining drift is inside the attached `SolidBody` body itself:
  - the attached body currently repeats the same long `bodySummary` sentence in both its top hint block and its expanded summary row
  - the attached body title is still generic `Ready` / `Waiting` instead of reading like an output-specific body summary
  - the attached body is structurally attached now, but it still reads more like reused placeholder scaffolding than a settled output detail panel
- the final pass should stay on visible honesty and attached-body readability only
- it should not reopen row-shell structure or helper extraction again

#### Locked direction:
- keep the shipped `SolidBody` row shell from `Phase 1`
- keep the shared managed output helper boundary from `Phase 2`
- polish only the attached body:
  - calmer title/readout language
  - less duplicated summary text between essentials and expanded states
  - cleaner split between compact status and longer explanatory detail
- keep waiting and ready states honest to current extrude behavior

### Questions / Decisions

#### [x] Question 1 - What is the real remaining problem after `Phase 2` shipped?

##### Locked answer
- attached-body copy/readability drift, not row-shell drift

##### Why
- the row shell, chevron, right-side pin, and shared helper boundary are already in place
- the remaining mismatch is that the body still feels more verbose and duplicated than the calmer row it hangs from

#### [x] Question 2 - Should `Phase 3` redesign the `SolidBody` row header again?

##### Locked answer
- no

##### Why
- the compact row header contract is already shipped
- this phase should only make the attached body read more intentionally underneath that stable row

#### [x] Question 3 - What should this phase own inside the attached body?

##### Locked answer
- one calmer output-specific title/readout
- one cleaner summary/detail split between essentials and expanded states
- removal of unnecessary repeated `bodySummary` text where the same sentence currently appears twice

##### Why
- that is the smallest honest cleanup that still improves readability
- it keeps the output body informative without feeling like duplicated placeholder copy

#### [x] Question 4 - Which seams should anchor implementation?

##### Locked answer
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

##### Why
- the current attached body is still fully owned in `renderExtrudeBodyAttachedBody(...)`
- focused node-surface tests are enough to prove the visible copy and body-structure cleanup

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

Acceptance checks:
- the shipped `SolidBody` row shell remains unchanged
- the attached body no longer repeats the same long `bodySummary` text in both summary positions
- ready versus waiting states still read honestly
- the attached body title and detail text feel output-specific instead of placeholder-like
- expanded mode adds useful detail instead of just reprinting the same sentence

#### Direction:
- keep the helper body visually attached to `SolidBody`
- keep waiting and placeholder wording honest to current extrude behavior
- leave compile/runtime/result ownership untouched while the visible output surface becomes cleaner


## Doc Header

### Doc History
6. 2026-04-05 00:09: Closed `Nodes-1C` after the first shared managed-row props helper was layered onto `structuredWireRowController`, the repeated managed-row glue in `NodeView.tsx` was reduced across both `Sketch` and `Extrude`, and `Geometry/Extrude` adopted the shared `GeometryNodeShell` frame so the broader `Nodes-1` foundation can now close as materially documented, extracted, and proven in the first live families
5. 2026-04-04 23:53: Closed `Nodes-1B` after extracting the first shared `structuredWireRowController` helper layer from `NodeView.tsx`, re-pointing the first `Sketch` and `Extrude` managed rows to that shared row-mode/cycle/label seam, and extending focused canvas-helper regressions so `Nodes-1C` can now start from a real extracted row-control band instead of repeated family-local glue
4. 2026-04-04 23:43: Tightened `Nodes-1B` into an implementation-ready extraction slice by naming the exact helper layer it should extract from `NodeView.tsx`, clarifying what must stay out of scope, identifying the first live adoption targets in `Sketch` and `Extrude`, and locking the acceptance checks so the pass reduces real family-local duplication instead of becoming a broad template rewrite
3. 2026-04-04 23:40: Closed `Nodes-1A` after the first live `nodeTemplateContract` module landed in the canvas code, moving the shared shell areas, `Structured Wire Rows` (`SWR`) family order, collapsed wiring-surface defaults, and row-mode defaults into one explicit code seam with focused regression coverage so `Nodes-1B` can extract helpers from a stable contract instead of from scattered local assumptions
2. 2026-04-04 23:36: Tightened `Nodes-1A` into an implementation-ready contract-locking slice by naming the exact shell and `SWR` rules it owns, the canonical docs it must align, the nearby live code seams it constrains, the execution order, and the concrete acceptance checks so `Nodes-1B` can start from one stable template contract instead of re-deciding basics during extraction
1. 2026-04-04 23:28: Created this dedicated `Nodes-1` future doc by splitting the shared node-template foundation out of `Nodes-Index.md`, so the umbrella node-template lane now has a real execution home for shell rules, `Structured Wire Rows` (`SWR`), and the first extraction ladder before wider row-type standardization

## [x] - `Nodes-1` - `Shared Shell And Structured Wire Rows`

### Summary

#### Purpose:
- create the first real execution home for the shared node-template foundation before more node families drift into separate custom UI systems

#### Owns:
- locking the shared node shell contract
- locking `Structured Wire Rows` (`SWR`) as the replacement name for the older `EWR` direction
- separating node mode from section visibility
- defining what a row is, what it owns, and how it opens
- the first extraction ladder for shared shell and row helpers

#### Does not own:
- the first reusable numeric-row implementation itself
- full `Depth` standardization
- output-row standardization
- composite / collection row adoption
- the full dedicated extrude toolbar
- the later `Loft` family execution ladder

#### Current seam read:

- `Sketch` now uses the shared shell and managed-row foundation as the first proving family
- `Extrude` now uses the same shared shell direction plus the same managed-row controller-building seam for its first adopted managed profile row
- collapsed node mode now keeps the wiring surface visible while leaving row density and section visibility separated
- the remaining work has moved past basic shell/row-foundation proof and into later reusable row-family standardization

Current strongest read:
- `Nodes-1` was right to stay split into `1A` through `1C`
- that split can now close because the shared shell and `SWR` foundation are no longer only doc-side or helper-side theory

### Questions

#### [x] Question 1 - What replaces the older `EWR` name?

##### Locked answer
- `Structured Wire Rows` (`SWR`)

##### Why
- the important idea is not only that rows expand
- the stronger direction is that rows are the structured wiring surface for both inputs and outputs

#### [x] Question 2 - What should node mode control?

##### Locked answer
- node mode controls row density and row openness defaults
- section headers control section visibility

##### Why
- users should still see the wiring surface in collapsed mode
- hiding sections and collapsing rows are different concepts and should not stay coupled

#### [x] Question 3 - What counts as the shared shell?

##### Locked answer
- title
- family badge
- summary chips
- section headers
- node mode button
- optional family toolbar area

##### Why
- these are the stable shell primitives already emerging across the node surfaces
- anything beyond this should be justified as a family-specific extension rather than quietly becoming part of the shell contract

#### [x] Question 4 - When is `Nodes-1` complete enough to mark shipped?

##### Locked answer
- not when the direction is only described in docs
- not when the behavior lives only as one-off family-local logic
- only after the first shared helper layer is extracted and adopted by the first proving families

##### Why
- otherwise `Nodes-1` would close too early and hide real remaining template debt

### Spec

Locked top-level direction:
- treat `Nodes-1` as the shared foundation lane for the node-template system
- use `SWR` as the canonical row language for both inputs and outputs
- keep this lane focused on shell and row-foundation truth before wider row-type rollout

Locked shared-shell rules:
- the shell is shared across node families
- shell-level exceptions must be explicitly justified in a family doc
- shell owns:
  - title
  - family badge
  - summary chips
  - section headers
  - node mode button
  - optional toolbar region

Locked row rules:
- one row owns one wire target or one wire source
- the row header stays visible when its section is visible
- rows may be `collapsed`, `essentials`, or `expanded`
- attached body content belongs to the row, not to a disconnected custom panel
- visible row labels may differ from internal port ids when the node surface reads better that way

Locked state rules:
- node mode does not auto-hide `Inputs` or `Outputs`
- section headers own section collapse
- row mode owns row openness
- local row overrides should survive node-mode switching when reasonable

### Subphases

#### [x] `Nodes-1A` - `Lock Shell And Row Contract`

Purpose:
- finish the architectural rule-locking pass so future node work can stop renegotiating shell and row basics

Owns:
- the final naming transition from `EWR` to `SWR`
- the shell contract
- the row contract
- the node-mode versus section-collapse contract
- the canonical reference list that later node-family docs should inherit instead of re-describing

Does not own:
- helper extraction work
- row-type implementation work
- visual cleanup by itself
- `Depth` numeric-row standardization
- output/composite/collection rollout

Current seam read:
- the direction is now good enough that teams can start building against it, but the contract still lives partly in:
  - `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
  - this `Nodes-1` doc
  - implicit behavior already landed in `src/app/spaghetti/canvas/NodeView.tsx`
- if `Nodes-1B` starts extracting helpers before this contract is locked more concretely, the extraction will end up deciding shell and row semantics by accident

Locked contract to write down in this phase:
- shared shell owns:
  - title
  - family badge
  - summary chips
  - section headers
  - node mode button
  - optional toolbar region
- `SWR` owns:
  - one row per real wire target/source
  - always-visible header while the section is visible
  - `collapsed / essentials / expanded` row states
  - attached body content as part of the row
  - optional child rows only when the type truly owns structured children
- state ownership:
  - node mode controls row density and row-open defaults
  - section headers control section visibility
  - visible wiring surface remains present in collapsed mode
  - local row overrides survive node-mode switching when reasonable

Canonical docs that must agree before this subphase closes:
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- this `Nodes-1` future doc

Nearby implementation seams this contract governs next:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- focused node-view tests

Implementation-ready checks:
- confirm `SWR` is the canonical forward name everywhere new node-template work will reference it
- confirm `collapsed` mode is officially a compact row-density mode, not a hidden-sections mode
- confirm the shell contract is narrow enough that family docs can justify any exception explicitly
- confirm the next row families are named in order:
  - reference row
  - numeric row
  - output row
  - composite row
  - collection row

Implementation-ready target:
- `Nodes-Index.md` plus this `Nodes-1` doc should agree on:
  - shell ownership
  - row ownership
  - row-state ownership
  - the first reusable row families that come next

Suggested execution order:
1. Re-read `docs/Vision.md` and `docs/Human-Plans/roadmap/Vision-roadmap.md` against the current `Nodes` wording.
2. Normalize the umbrella `Nodes-Index.md` so it stays an umbrella summary and points at this doc for execution detail.
3. Lock the shell and `SWR` contract in this doc with no unresolved naming drift.
4. Confirm the handoff into `Nodes-1B` and `Nodes-2` so extraction and row-type work do not reopen the same questions.

Acceptance checks:
- there is one stable written definition of:
  - shell ownership
  - row ownership
  - row-state ownership
- `Nodes-Index.md` and this doc no longer disagree on the shared node-template foundation
- future family docs can reference `SWR` without redefining it locally
- `Nodes-1B` can start extraction without re-deciding whether node mode hides sections or whether rows own attached bodies

Definition of done:
- there is one stable written contract for shell and row behavior
- new family docs can reference it instead of re-describing it
- `Nodes-1B` can begin as an extraction pass rather than another contract-decision pass

Current shipped output:
- `src/app/spaghetti/canvas/nodeTemplateContract.ts` now holds the first explicit code-side contract for:
  - shared shell areas
  - `SWR` row-family ordering
  - collapsed wiring-surface defaults
  - row-density defaults by node mode
- `src/app/spaghetti/canvas/NodeView.tsx` now consumes that contract for the main section, block, and row-open defaults instead of keeping those rules only as scattered local conditionals
- `src/app/spaghetti/canvas/PortView.tsx` now uses the shared `StructuredWireRowMode` type
- focused regression coverage now exists in `src/app/spaghetti/canvas/nodeTemplateContract.test.ts`

#### [x] `Nodes-1B` - `Extract Shared Shell And Row Helpers`

Purpose:
- turn the new contract into a real implementation seam instead of leaving it only as family-local `NodeView.tsx` logic

Owns:
- the first shared helper extraction for shell and row primitives
- the smallest safe extraction from `Sketch` and `Extrude`
- reducing family-local duplication around row-open state, row rendering, and shell framing

Does not own:
- finishing all row types
- toolbar work
- wide family cleanup
- changing wire/runtime contracts
- redesigning every node family in one pass

Current seam read:
- `Nodes-1A` gave the canvas one explicit contract seam in `nodeTemplateContract.ts`, but the actual render glue is still heavily concentrated in `NodeView.tsx`
- the most obvious duplication now lives around:
  - managed row defaulting
  - row chevron mode calculation
  - row cycle handlers
  - row-attached-body wiring
  - shell block/section framing around the first proving families
- if we widen this pass into all row families at once, the extraction will likely collapse back into another giant `NodeView.tsx` helper blob

Locked extraction target:
- extract only the first helper layer that is clearly shared today
- prefer helpers that stabilize the render seam without prematurely freezing every family-specific attached body

First helper candidates:
- managed row mode helper
  - derives `collapsed / essentials / expanded`
  - centralizes row-cycle transitions
- managed row render wrapper
  - standardizes the `PortView` handoff for shared row props
- shared shell-block helper
  - where the same section/block framing logic now repeats across family branches

First adoption targets:
- `SketchPlane`
- `SketchDraw`
- `SketchProfile`
- `ExtrusionProfile`

Nearby seams most likely to change:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/nodeTemplateContract.ts`
- focused `NodeView` and helper tests

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/GeometryNodeShell.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- focused node-view tests

Implementation-ready checks:
- keep the extraction small enough that `Nodes-1C` still has meaningful first-family adoption cleanup left to do
- do not force `Depth` into the helper design yet; that belongs to `Nodes-2`
- preserve the already-landed collapsed-mode wiring-surface behavior
- preserve the current visible `SketchProfile` and extrude profile-row improvements while changing ownership behind the scenes
- prefer one helper at a time over a speculative abstraction bundle

Suggested execution order:
1. Re-read the current `Sketch` and `Extrude` managed-row seams in `NodeView.tsx`.
2. Identify the smallest repeated band that can move without dragging family-specific attached bodies with it.
3. Extract that helper layer behind the existing row behavior.
4. Repoint the first proving rows in `Sketch` and `Extrude` to the helper.
5. Add or extend focused tests around the helper seam itself plus the first adopted rows.

Acceptance checks:
- at least one real shared helper layer exists for the first shell/row primitives
- `Sketch` and `Extrude` both consume that helper in at least one meaningful path
- the extraction measurably reduces duplicated row/shell glue in `NodeView.tsx`
- the pass does not reopen `Nodes-1A` contract questions
- the pass does not widen into `Nodes-2` row-type implementation work

Definition of done:
- there is a real shared helper layer for the first shell/row primitives
- `Sketch` and `Extrude` both use it in at least one meaningful path
- `Nodes-1C` can start from a real extracted seam instead of from a still-monolithic `NodeView.tsx`

Current shipped output:
- `src/app/spaghetti/canvas/structuredWireRowController.ts` now owns the first extracted shared helper layer for:
  - deriving `collapsed / essentials / expanded` row mode
  - cycling row mode
  - building shared row-toggle labels
- `src/app/spaghetti/canvas/NodeView.tsx` now routes the first managed `Sketch` and `Extrude` rows through that helper seam instead of repeating family-local mode/cycle logic
- focused helper coverage now exists in:
  - `src/app/spaghetti/canvas/nodeTemplateContract.test.ts`
  - `src/app/spaghetti/canvas/structuredWireRowController.test.ts`

#### [x] `Nodes-1C` - `Adopt Shared Foundation In First Families`

Purpose:
- prove the extracted shell/row helper layer is the real path forward

Owns:
- first adoption cleanup in `Sketch`
- first adoption cleanup in `Extrude`
- removal of obvious duplicated shell/row glue where the helper now covers it

Does not own:
- the first reusable numeric-row design beyond what `Nodes-2` explicitly owns
- output-row standardization
- `Loft`

Definition of done:
- `Sketch` and `Extrude` both visibly rely on the same foundation
- the shared helper layer is no longer theoretical
- `Nodes-2` can start from a real extracted base instead of more family-local patchwork

Suggested execution order:
1. Finish `Nodes-1A` rule locking.
2. Extract the smallest real helper layer in `Nodes-1B`.
3. Prove adoption in `Sketch` and `Extrude` through `Nodes-1C`.
4. Hand forward into `Nodes-2` for `reference row` and `numeric row` standardization.

Acceptance checks:
- `SWR` is the stable row-language name across the node docs
- shell rules and row rules no longer drift per family
- node mode versus section visibility stays separated
- at least one real shared helper layer exists in code
- `Sketch` and `Extrude` can both point at the same extracted foundation

Definition of done:
- `Nodes-1` is only marked complete once the shared shell and `SWR` foundation are both documented and materially extracted into the first live families

Current shipped output:
- `src/app/spaghetti/canvas/structuredWireRowController.ts` now builds one shared managed-row controller shape for:
  - deriving `collapsed / essentials / expanded` row mode
  - cycling row state
  - building row-toggle labels
  - handing `NodeView.tsx` one reusable row-props seam
- `src/app/spaghetti/canvas/NodeView.tsx` now uses that shared managed-row seam across:
  - `SketchPlane`
  - `SketchDraw`
  - sketch output rows
  - `ExtrusionProfile`
- `src/app/spaghetti/canvas/NodeView.tsx` now also routes `Geometry/Extrude` through `GeometryNodeShell` so the first proving families share shell framing as well as row control
- focused coverage now exists in:
  - `src/app/spaghetti/canvas/structuredWireRowController.test.ts`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

# `OutputPreview-1 Phase 5c` - `Shared Managed Row Base Refactor`

## Doc Header

### Doc History
10. 2026-04-11 21:26:21: Marked `OutputPreview-1 Phase 5c.5 - OutputPreview Migration` shipped after the lingering `OutputPreview` managed-row wrapper class and row-shell selectors were removed, the publication body stayed local to `OutputPreview`, focused proof re-passed, and the next handoff advanced to `Phase 5c.6 - Cleanup And Proof Matrix`
9. 2026-04-11 21:19:27: Tightened `OutputPreview-1 Phase 5c.5 - OutputPreview Migration` into an implementation-ready follow-on by grounding it in the post-`5c.4` seam where the shared managed input/output shell variants already own `Sketch` and `Extrude`, while `OutputPreview` still enters through `SpaghettiTemplateSection`, keeps the local `SpaghettiOutputPreviewSolidBodiesPortRow` wrapper, and owns custom attached-body publication content that now needs to stay local while the row shell itself migrates
8. 2026-04-11 21:16:19: Marked `OutputPreview-1 Phase 5c.4 - Sketch And Extrude Migration` shipped after the remaining geometry-stack compat selectors were narrowed away from managed rows, the leftover `Extrude` managed-input wrapper class was removed, focused sketch/extrude proof passed again, and the next handoff advanced to `Phase 5c.5 - OutputPreview Migration`
7. 2026-04-11 21:05:16: Tightened `OutputPreview-1 Phase 5c.4 - Sketch And Extrude Migration` into an implementation-ready follow-on by grounding it in the post-`5c.3` seam where both managed render helpers now emit the shared shell variants directly, `Extrude` still carries the local `SpaghettiExtrudeProfilePortRow` wrapper, and the remaining geometry-stack compat selectors should now be pruned against the shared base instead of continuing as shell owners
6. 2026-04-11 21:02:50: Marked `OutputPreview-1 Phase 5c.3 - Shared Managed Output Shell Extraction` shipped after `renderManagedGeometryOutputPort(...)` began emitting the shared managed output-shell class, the duplicated managed output shell CSS moved under that shared owner, focused sketch/extrude output-row proof passed in component-only and real-canvas paths, and the next handoff advanced to `Phase 5c.4 - Sketch And Extrude Migration`
5. 2026-04-11 20:55:48: Tightened `OutputPreview-1 Phase 5c.3 - Shared Managed Output Shell Extraction` into an implementation-ready follow-on by grounding it in the live `renderManagedGeometryOutputPort(...)` seam, the current generic `.SpaghettiTemplateSection--outputs .SpaghettiPort--out` output-shell owner, and the geometry-stack output-row patches that the new shared managed output shell should replace
4. 2026-04-11 20:51:11: Marked `OutputPreview-1 Phase 5c.2 - Shared Managed Input Shell Extraction` shipped after `renderManagedStructuredInputPort(...)` began emitting the shared managed input-shell class, the duplicated input-shell CSS moved under that shared owner, focused node-view plus real-canvas proof confirmed the shared input shell on current managed rows, and the next handoff advanced to `Phase 5c.3 - Shared Managed Output Shell Extraction`
3. 2026-04-11 18:17:20: Tightened `OutputPreview-1 Phase 5c.2 - Shared Managed Input Shell Extraction` into an implementation-ready follow-on by grounding it in the live `renderManagedStructuredInputPort(...)` seam, the current generic `.SpaghettiTemplateSection .SpaghettiPort--in` input-shell owner, and the family-local `Extrude` / `OutputPreview` input-row patches that the new shared managed input shell should replace
2. 2026-04-11 18:04:42: Marked `OutputPreview-1 Phase 5c.1 - Managed Row Contract Lock` shipped by locking the explicit shared managed input/output shell direction, naming the allowed family-local override surface, and advancing the next implementation handoff to `Phase 5c.2 - Shared Managed Input Shell Extraction`
1. 2026-04-11 17:49:58: Created this dedicated `OutputPreview-1 Phase 5c` future plan doc to split the managed-row base refactor into Codex-sized chunks, keeping the visual-shell unification for `Sketch`, `Extrude`, and `OutputPreview` separate from the later `Phase 6` backend default-split publication cleanup

### Purpose

- define the dedicated refactor plan for making the managed collection/input/output row shell a real shared base instead of a stack of family-local CSS overrides
- keep the row-base refactor for `Sketch`, `Extrude`, and `OutputPreview` separate from the later `OutputPreview` publication-mode backend work
- split the refactor into chunks Codex can implement one by one without reopening unrelated runtime or schema behavior

### Scope

This phase covers:
- the shared visual base layer for the managed row families used by the current "perfect" node target set:
  - `Sketch`
  - `Extrude`
  - `OutputPreview`
- input-row and output-row shell ownership where those rows are currently styled as generic template/pin rows plus local family patches
- shared CSS and render-path cleanup so managed rows have one explicit base contract instead of relying on `SpaghettiTemplateSection` ancestry
- focused proof that the three target node families still render the right row hierarchy after the refactor

This phase does not cover:
- `OutputPreview` backend/default publication-mode changes reserved for `Phase 6`
- new node families outside the current `Sketch` / `Extrude` / `OutputPreview` target set unless a tiny compat tweak is needed to keep the shared base honest
- schema, evaluator, publication preparation, or worker behavior
- redesigning primitive numeric rows or enum rows beyond whatever small seam is required to keep the managed-row family boundaries explicit

## Doc Body

## [ ] `OutputPreview-1 Phase 5c` - `Shared Managed Row Base Refactor`

Purpose:
- replace the current "generic template/pin row plus family-local override" layering with one explicit shared managed-row base for the `Sketch`, `Extrude`, and `OutputPreview` node families

Owns:
- naming the real shared managed-row shell contract for the current target nodes
- moving managed input rows off the implicit `.SpaghettiTemplateSection .SpaghettiPort--in` base ownership
- moving managed output rows off the implicit `.SpaghettiTemplateSection--outputs .SpaghettiPort--out` base ownership
- migration of the currently hand-tuned `Sketch`, `Extrude`, and `OutputPreview` managed row surfaces onto that shared base
- focused proof that the three target node families still match the intended "perfect node" visual language after the refactor

Does not own:
- changing output/publication semantics
- changing accepted connection rules
- changing the `Phase 6` default split publication plan
- broad node-theme redesign outside the managed row family

Current seam read:
- the render path is already partially shared in `src/app/spaghetti/canvas/NodeView.tsx`:
  - `renderManagedStructuredInputPort(...)`
  - `renderManagedGeometryOutputPort(...)`
- but the visual base is still fragmented in `src/app/theme/surfaces/spaghetti.css`:
  - generic template-input rules under `.SpaghettiTemplateSection .SpaghettiPort--in ...`
  - generic template-output rules under `.SpaghettiTemplateSection--outputs .SpaghettiPort--out ...`
  - stronger family-local overrides such as:
    - `.SpaghettiExtrudeProfilePortRow ...`
    - `.SpaghettiOutputPreviewSolidBodiesPortRow ...`
- that means the current "good" nodes still share markup but not one honest shell owner:
  - `Sketch` output rows feel close because they live nearest the original template assumptions
  - `Extrude` feels better because it has a stronger family-local patch
  - `OutputPreview` still feels like a generic template input row wearing a good costume
- the honest next move is therefore not another local `OutputPreview` tweak; it is to promote the shared managed row into a real base contract that the three target nodes can all consume directly

Locked direction:
- use one explicit shared base for managed collection-style input rows
- use one explicit shared base for managed collection-style output rows
- make family-local classes thin wrappers for attached-body content and tiny spacing differences only
- stop depending on ancestor selectors like `.SpaghettiTemplateSection .SpaghettiPort--in` as the real shell owner for the target rows

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- focused tests in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`

Suggested implementation order:
1. Lock the shared managed-row shell contract in one narrow audit/contract pass before moving any family.
2. Extract the shared managed input-row base.
3. Extract the shared managed output-row base.
4. Migrate `Sketch`, `Extrude`, and `OutputPreview` onto those shared bases one family at a time.
5. Prune stale family-local shell rules and re-run a focused proof matrix.

Acceptance checks:
- `Sketch`, `Extrude`, and `OutputPreview` managed rows no longer derive their visible shell primarily from the generic template/pin-row ancestry selectors
- managed collection-style input rows across the target node set now read as one family with only small local differences
- managed collection-style output rows across the target node set now read as one family with only small local differences
- `OutputPreview` no longer needs brittle family-local shell overrides just to avoid looking like a generic template input row
- the refactor does not reopen `Phase 6` backend/default publication work

## [x] `OutputPreview-1 Phase 5c.1` - `Managed Row Contract Lock`

Purpose:
- isolate and document the real shared shell contract that should define the managed row family before code starts moving selectors around

Owns:
- identifying which current CSS/render responsibilities truly belong to the shared managed row
- identifying which responsibilities stay family-local
- naming the input and output shared-base class/variant direction the implementation should adopt

Does not own:
- moving all families yet
- deleting old selectors yet
- backend or publication work

Current seam read:
- the managed render helpers already exist, but the CSS owner is still split between generic template selectors and family-local patch selectors
- if the contract is not locked first, later chunks will drift into another round of local one-off fixes

Locked contract:
- the shared managed input-row shell should be emitted from the managed input render path as the explicit base variant `SpaghettiPortShell--managedCollectionIn`
- the shared managed output-row shell should be emitted from the managed output render path as the explicit base variant `SpaghettiPortShell--managedCollectionOut`
- those shared base variants should own the visible shell itself:
  - full row width and box model
  - border, tint, and background
  - pin lane, header layout, chevron treatment, and open/attached-body seam
  - the shared type/name text rhythm for collection-style managed rows
- family-local classes may still own:
  - attached-body content structure
  - tiny spacing adjustments that do not redefine the shell
  - node-specific editor, child-row, or warning content that lives inside the attached body
- family-local classes should not re-own:
  - the primary border/background shell
  - the header grid or pin geometry
  - the core row-width contract
- generic ancestry selectors such as `.SpaghettiTemplateSection .SpaghettiPort--in` and `.SpaghettiTemplateSection--outputs .SpaghettiPort--out` should remain the base only for non-managed rows after the later migration chunks land

Shipped result:
- this doc now locks one explicit shared-base direction for managed collection-style input rows and one for managed collection-style output rows
- later chunks can now treat the current family-local shell selectors as temporary compat wrappers instead of as competing shell owners
- the next implementation-ready handoff inside this refactor is `OutputPreview-1 Phase 5c.2 - Shared Managed Input Shell Extraction`

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- this doc

Acceptance checks:
- the chunk leaves behind one clear shared-base plan that later chunks can implement without guessing
- the allowed family-local override surface is explicit instead of implied
- the doc names the concrete shared-base class/variant direction that later implementation chunks should adopt

## [x] `OutputPreview-1 Phase 5c.2` - `Shared Managed Input Shell Extraction`

Purpose:
- create the real shared managed input-row shell used by the target node families

Owns:
- lifting the currently duplicated input-shell styling into one explicit shared managed input base
- wiring the managed input render path to emit the class/variant needed by that shared base

Does not own:
- output-row extraction
- full family migration beyond the input owners needed to prove the shared base works

Current seam read:
- the render-path owner already exists in `src/app/spaghetti/canvas/NodeView.tsx` as `renderManagedStructuredInputPort(...)`, but that helper still relies on family-local `portClassName` patches instead of emitting the shared managed input-shell variant locked in `Phase 5c.1`
- the real visible input-shell owner in `src/app/theme/surfaces/spaghetti.css` is still the generic template ancestor block:
  - `.SpaghettiTemplateSection .SpaghettiNodePortColumn--in`
  - `.SpaghettiTemplateSection .SpaghettiPort--in`
  - `.SpaghettiTemplateSection .SpaghettiPort--in .SpaghettiPortHeader`
  - `.SpaghettiTemplateSection .SpaghettiPort--in .SpaghettiPortName`
  - `.SpaghettiTemplateSection .SpaghettiPort--in .SpaghettiPortType`
  - `.SpaghettiTemplateSection .SpaghettiPort--in .SpaghettiPortChevron`
- the currently "good" input rows only look managed because they re-style that generic base afterward:
  - `Geometry/Extrude` via `.SpaghettiExtrudeProfilePortRow ...`
  - `System/OutputPreview` via `.SpaghettiOutputPreviewSolidBodiesPortRow ...`
- that means the next implementation slice should not migrate all families yet; it should first make the managed input shell itself real so those later migrations stop depending on template ancestry

Locked implementation direction:
- `renderManagedStructuredInputPort(...)` should emit the shared managed input-shell owner `SpaghettiPortShell--managedCollectionIn`
- the new shared managed input-shell CSS should own:
  - full-width input-row sizing and box model
  - border, tint, and background
  - header layout
  - shared name/type text rhythm
  - chevron visibility/toggle treatment
  - attached-body seam behavior
- the generic `.SpaghettiTemplateSection .SpaghettiPort--in ...` selectors should stop being the primary visual owner for managed collection-style input rows
- local family input-row classes should remain temporarily, but only as thin compat wrappers until later migration chunks prune them

Expected output:
- one real shared managed input-shell path that the current managed input helper emits directly
- at least one focused proof case showing a managed input row now reads from the new shared shell without depending primarily on the generic template input selectors
- a narrow compat posture where later chunks can migrate `Sketch`, `Extrude`, and `OutputPreview` onto the shared shell without redefining the shell again

Shipped result:
- `src/app/spaghetti/canvas/NodeView.tsx` now makes `renderManagedStructuredInputPort(...)` emit the shared managed input-shell owner `SpaghettiPortShell--managedCollectionIn` for managed input rows instead of leaving the helper dependent only on family-local wrapper classes
- `src/app/theme/surfaces/spaghetti.css` now moves the duplicated managed input shell styling under that shared owner so the real input-row shell no longer derives primarily from the generic template-input ancestry block
- the remaining family-local input-row classes stay as thinner compat wrappers:
  - `Geometry/Extrude` keeps its local row identity without re-owning the shared shell metrics
  - `System/OutputPreview` keeps its local tint and row-specific color treatment without re-owning the whole input shell
- focused proof landed in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- the next implementation-ready handoff inside this refactor is `OutputPreview-1 Phase 5c.3 - Shared Managed Output Shell Extraction`

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- focused input-row tests in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`

Suggested implementation order:
1. Update `renderManagedStructuredInputPort(...)` so managed collection-style input rows emit `SpaghettiPortShell--managedCollectionIn`.
2. Add the shared managed input-shell CSS owner in `spaghetti.css`, moving the shell rules that should belong to the shared managed family out of the generic template-input ancestry block.
3. Keep the current family-local input-row classes as thin wrappers only where they still need temporary spacing or attached-body compat.
4. Prove the new shared shell against at least one current managed input family before wider migration.

Acceptance checks:
- the managed input shell no longer relies on `.SpaghettiTemplateSection .SpaghettiPort--in` as its primary visual owner
- `renderManagedStructuredInputPort(...)` now emits the shared managed input-shell variant locked in `Phase 5c.1`
- the new shared base is proven against at least one current target family before wider migration
- the chunk does not yet reopen managed output-shell extraction or broader family cleanup that belongs to later `5c.3+` slices

## [x] `OutputPreview-1 Phase 5c.3` - `Shared Managed Output Shell Extraction`

Purpose:
- create the real shared managed output-row shell used by the target node families

Owns:
- lifting the currently duplicated output-shell styling into one explicit shared managed output base
- wiring the managed output render path to emit the class/variant needed by that shared base

Does not own:
- full family migration beyond the output owners needed to prove the shared base works
- primitive or enum row redesign

Current seam read:
- the render-path owner already exists in `src/app/spaghetti/canvas/NodeView.tsx` as `renderManagedGeometryOutputPort(...)`, but that helper still does not emit the shared managed output-shell variant locked in `Phase 5c.1`
- the real visible output-shell owner in `src/app/theme/surfaces/spaghetti.css` is still split across generic output ancestry:
  - `.SpaghettiTemplateSection--outputs .SpaghettiNodePortColumn--out`
  - `.SpaghettiTemplateSection--outputs .SpaghettiPort--out`
  - `.SpaghettiTemplateSection--outputs .SpaghettiPort--out .SpaghettiPortHeader`
  - `.SpaghettiTemplateSection--outputs .SpaghettiPort--out .SpaghettiPortName`
  - `.SpaghettiTemplateSection--outputs .SpaghettiPort--out .SpaghettiPortType`
  - `.SpaghettiTemplateSection--outputs .SpaghettiPort--out .SpaghettiPortHeaderRight`
- there is also a second layer of output-shell restyling in the geometry stack:
  - `.SpaghettiGeometryNodeStackSection--outputs .SpaghettiPort--out ...`
- that means the currently "good" managed output rows still share markup but not one explicit output-shell owner, especially for rows like `SketchProfiles` and `SolidBodies`

Locked implementation direction:
- `renderManagedGeometryOutputPort(...)` should emit the shared managed output-shell owner `SpaghettiPortShell--managedCollectionOut`
- the new shared managed output-shell CSS should own:
  - full-width output-row sizing and box model
  - border, tint, and background
  - output-side anchor and header layout
  - shared name/type text rhythm
  - header-status alignment on output rows
  - attached-body seam behavior
- the generic `.SpaghettiTemplateSection--outputs .SpaghettiPort--out ...` selectors should stop being the primary visual owner for managed collection-style output rows
- geometry-stack output selectors should be reduced to thinner compat wrappers once the shared output shell exists

Expected output:
- one real shared managed output-shell path that the current managed output helper emits directly
- at least one focused proof case showing a managed output row now reads from the new shared shell without depending primarily on the generic template output selectors
- a narrow compat posture where later chunks can migrate `Sketch` and `Extrude` output families onto the shared shell without redefining the shell again

Shipped result:
- `src/app/spaghetti/canvas/NodeView.tsx` now makes `renderManagedGeometryOutputPort(...)` emit the shared managed output-shell owner `SpaghettiPortShell--managedCollectionOut` for managed output rows instead of leaving the helper dependent on the older generic output ancestry
- `src/app/spaghetti/canvas/NodeView.tsx` now lets the managed output helper forward local output-row classes through `renderOutputPortByType(...)` / `renderOutputPort(...)`, so the shared output shell has a real render-path owner without blocking later family-local compat layers
- `src/app/theme/surfaces/spaghetti.css` now moves the duplicated managed output shell rules under that shared owner, including the row shell, header rhythm, output-side status lane, and attached-body seam, while the geometry-stack output selectors stay as thinner non-managed compat wrappers
- focused proof landed in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- the next implementation-ready handoff inside this refactor is `OutputPreview-1 Phase 5c.4 - Sketch And Extrude Migration`

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- focused output-row tests in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`

Suggested implementation order:
1. Update `renderManagedGeometryOutputPort(...)` so managed collection-style output rows emit `SpaghettiPortShell--managedCollectionOut`.
2. Add the shared managed output-shell CSS owner in `spaghetti.css`, moving the shell rules that should belong to the shared managed family out of the generic template-output ancestry block.
3. Keep the current geometry-stack or family-local output-row classes as thin wrappers only where they still need temporary spacing or attached-body compat.
4. Prove the new shared shell against at least one current managed output family before wider migration.

Acceptance checks:
- the managed output shell no longer relies on `.SpaghettiTemplateSection--outputs .SpaghettiPort--out` as its primary visual owner
- `renderManagedGeometryOutputPort(...)` now emits the shared managed output-shell variant locked in `Phase 5c.1`
- the new shared base is proven against at least one current target family before wider migration
- the chunk does not yet reopen full family migration or cleanup work that belongs to later `5c.4+` slices

## [x] `OutputPreview-1 Phase 5c.4` - `Sketch And Extrude Migration`

Purpose:
- migrate the two already-nearby "perfect node" families onto the shared managed-row base first, so the base contract is proven before `OutputPreview` consumes it

Owns:
- moving `Sketch` managed rows to the shared base
- moving `Extrude` managed rows to the shared base
- trimming family-local shell selectors that become redundant after that move

Does not own:
- `OutputPreview` migration yet
- phase-6 publication defaults

Current seam read:
- the render-path extraction work is now in place in `src/app/spaghetti/canvas/NodeView.tsx`:
  - `renderManagedStructuredInputPort(...)` emits `SpaghettiPortShell--managedCollectionIn`
  - `renderManagedGeometryOutputPort(...)` emits `SpaghettiPortShell--managedCollectionOut`
- that means `5c.4` is no longer about creating shared shells; it is about letting `Sketch` and `Extrude` rely on those shared shells honestly
- `Sketch` is already closest to the shared base because its managed rows mostly read from the generic geometry-stack lane plus the new shared shell owners
- `Extrude` still carries visible local ownership that should now be thinned:
  - `src/app/spaghetti/canvas/NodeView.tsx` still passes `SpaghettiExtrudeProfilePortRow`
  - `src/app/theme/surfaces/spaghetti.css` still carries geometry-stack compat selectors and local `Extrude` row wrappers that overlap with the new shared shell contract
- the honest next move is therefore to trim the `Sketch` / `Extrude` family-local shell ownership against the shared base first, before the later `OutputPreview` migration touches the more custom publication body content

Locked implementation direction:
- keep the shared managed input/output shell variants as the primary shell owners for `Sketch` and `Extrude`
- trim or delete `Sketch` / `Extrude` family-local shell rules that are now redundant with:
  - `SpaghettiPortShell--managedCollectionIn`
  - `SpaghettiPortShell--managedCollectionOut`
- keep only the local family treatment that still genuinely belongs to:
  - attached-body content
  - tiny spacing or identity cues that do not redefine the shell
- reduce geometry-stack compat selectors so they support non-managed rows without continuing to act as the de facto shell owner for the managed `Sketch` / `Extrude` rows

Expected output:
- `Sketch` managed rows visibly keep the settled target look while reading primarily from the shared managed-row base
- `Extrude` managed rows visibly keep the settled target look while the local `SpaghettiExtrudeProfilePortRow` wrapper and overlapping geometry-stack selectors become thinner or disappear
- a narrower pre-`OutputPreview` posture where the shared managed-row base is proven on the two simpler "perfect node" families before the later family with custom publication body content migrates

Shipped result:
- `src/app/theme/surfaces/spaghetti.css` now moves the last managed `Sketch` / `Extrude` detail-lane ownership into the shared managed shell selectors, so managed input/output rows no longer rely on the broader geometry-stack compat selectors for their details-box seam or detail-lane spacing
- `src/app/theme/surfaces/spaghetti.css` now narrows the remaining geometry-stack input/output compat selectors to non-managed rows, leaving `SpaghettiPortShell--managedCollectionIn` and `SpaghettiPortShell--managedCollectionOut` as the primary shell owners for the managed `Sketch` / `Extrude` rows
- `src/app/spaghetti/canvas/NodeView.tsx` no longer passes the leftover `SpaghettiExtrudeProfilePortRow` wrapper into the managed `Extrude` profile row, so the family now relies directly on the shared managed input shell instead of a stale local shell-class handoff
- focused proof landed in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- the next implementation-ready handoff inside this refactor is `OutputPreview-1 Phase 5c.5 - OutputPreview Migration`

Likely files:
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`

Suggested implementation order:
1. Re-read the current `Sketch` and `Extrude` managed row call sites in `NodeView.tsx` and identify which remaining local classes still claim shell ownership instead of only family identity.
2. Trim the overlapping `Sketch` / `Extrude` selectors in `spaghetti.css` so the shared managed input/output shell variants remain the primary shell owners.
3. Keep only the local family treatment that still belongs to attached-body content, tiny spacing, or identity cues.
4. Re-prove the shared shell on both `Sketch` and `Extrude` in component-only and real-canvas tests before moving to `OutputPreview`.

Acceptance checks:
- `Sketch` and `Extrude` still read like the settled target surfaces after the migration
- family-local shell CSS for those two families is visibly thinner
- the managed `Sketch` / `Extrude` rows no longer depend on geometry-stack compat selectors as their primary shell owner
- the chunk does not yet reopen the `OutputPreview` migration or the deferred `Phase 6` backend cleanup

## [x] `OutputPreview-1 Phase 5c.5` - `OutputPreview Migration`

Purpose:
- move `OutputPreview` off the patched generic template/pin-row input base and onto the new shared managed-row base

Owns:
- migration of the `SolidBodies` source row onto the shared managed input shell
- keeping the `OutputPreview` attached-body content, editors, and publication rows local while the shell becomes shared

Does not own:
- default split publication behavior
- changing child publication semantics

Current seam read:
- the shared managed-row base is now proven on the simpler target families:
  - `Sketch`
  - `Extrude`
- that means the remaining mismatch is now isolated to `OutputPreview` itself rather than to the shared shell contract
- the render-path owner already exists in `src/app/spaghetti/canvas/NodeView.tsx`:
  - `renderOutputPreviewTemplate()`
  - `renderManagedStructuredInputPort(...)`
- but `OutputPreview` still keeps local shell ownership layered on top of the shared base:
  - the section still enters through `SpaghettiTemplateSection` ancestry
  - the managed row still passes the local `SpaghettiOutputPreviewSolidBodiesPortRow` wrapper
  - `src/app/theme/surfaces/spaghetti.css` still carries `OutputPreview`-local row styling under `.SpaghettiOutputPreviewSection .SpaghettiOutputPreviewSolidBodiesPortRow ...`
- at the same time, `OutputPreview` also owns real family-local content that should not be flattened into the shared shell:
  - `SpaghettiOutputPreviewAttachedBody`
  - `SpaghettiOutputPreviewMeta`
  - `SpaghettiOutputPreviewPublishedGroup`
  - `SpaghettiOutputPreviewPublishedObjectRow`
  - warning and naming/editor rows that belong to publication-body ownership
- the honest next move is therefore not to genericize the publication body; it is to migrate only the visible `SolidBodies` source-row shell onto the shared managed base while leaving the publication body local to `OutputPreview`

Locked implementation direction:
- keep `SpaghettiPortShell--managedCollectionIn` as the primary shell owner for the `OutputPreview` `SolidBodies` source row
- trim or delete `OutputPreview`-local row-shell selectors that are now redundant with the shared managed input shell
- keep the local `OutputPreview` ownership only where it still genuinely belongs:
  - attached-body publication structure
  - published-object grouping
  - row-owned naming/editor content
  - warnings and source/publication-specific copy
- reduce any remaining `SpaghettiTemplateSection` ancestry dependence so the `OutputPreview` source row no longer reads like a patched generic template input row wearing a good costume

Expected output:
- the `OutputPreview` `SolidBodies` source row visibly reads from the same shared managed-row base as the settled `Sketch` / `Extrude` rows
- the `OutputPreview` publication body remains local and honest, so grouped/split published-child content still reads as family-specific downstream ownership rather than being flattened into the shared shell
- a narrow pre-cleanup posture where the shared managed-row base now covers all three target "perfect node" families before the final cleanup/proof-matrix slice

Shipped result:
- `src/app/spaghetti/canvas/NodeView.tsx` no longer passes the lingering `SpaghettiOutputPreviewSolidBodiesPortRow` wrapper into the managed `OutputPreview` `SolidBodies` source row, so the visible row now relies directly on the shared managed input shell instead of a family-local shell wrapper
- `src/app/theme/surfaces/spaghetti.css` no longer carries `OutputPreview`-local row-shell selectors for the managed `SolidBodies` source row, leaving local ownership on the publication body, warnings, naming/editor rows, and published-child grouping where it still genuinely belongs
- focused proof landed in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
- the next implementation-ready handoff inside this refactor is `OutputPreview-1 Phase 5c.6 - Cleanup And Proof Matrix`

Likely files:
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- focused `OutputPreview` tests

Suggested implementation order:
1. Re-read the current `renderOutputPreviewTemplate()` path and isolate which remaining `OutputPreview` selectors still claim row-shell ownership instead of publication-body ownership.
2. Trim the overlapping `OutputPreview` row-shell selectors in `spaghetti.css` so the shared managed input shell remains the primary owner for the visible `SolidBodies` source row.
3. Keep the local `OutputPreview` publication body, editor rows, warnings, and published-child grouping intact unless a tiny copy or spacing tweak is required to fit the shared shell honestly.
4. Re-prove the migrated `OutputPreview` row in focused node-view and real-canvas tests before the final cleanup/proof-matrix slice.

Acceptance checks:
- `OutputPreview` no longer needs thick family-local shell CSS just to avoid looking like a generic template input row
- the visible `SolidBodies` row now honestly reads as the same row family as the other target nodes
- the local publication body content remains intact and visibly downstream from the owning source row after the shell migration
- the chunk does not yet reopen the final cleanup/proof-matrix work or the deferred `Phase 6` backend cleanup

## [ ] `OutputPreview-1 Phase 5c.6` - `Cleanup And Proof Matrix`

Purpose:
- remove the stale shell leftovers and lock the final proof that the three target nodes now share one real managed-row base

Owns:
- pruning dead or redundant family-local selectors
- focused proof across the `Sketch`, `Extrude`, and `OutputPreview` target set
- final handoff back to the deferred `Phase 6` backend plan

Does not own:
- publication-mode backend work
- broader theme-system redesign

Likely files:
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`

Acceptance checks:
- dead shell selectors from the old generic-template-plus-local-patch layering are removed or clearly demoted
- the proof matrix confirms the "perfect node" target set now shares one managed row base
- the next honest move can return to `OutputPreview-1 Phase 6 - Default Split Publication Backend Cleanup`

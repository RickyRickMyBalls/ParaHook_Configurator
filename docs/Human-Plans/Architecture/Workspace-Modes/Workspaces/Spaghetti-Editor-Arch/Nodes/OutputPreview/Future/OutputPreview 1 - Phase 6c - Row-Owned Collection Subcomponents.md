# `OutputPreview-1 Phase 6c` - `Row-Owned Collection Subcomponents`

## Doc Header

### Doc History
12. 2026-04-12 19:44:07: Marked `OutputPreview-1 Phase 6c.5 - Proof Matrix And Family Handoff` complete after the shipped legacy flat-parent migration repair in `useAppStore.ts` started upgrading runtime-backed published collection members out of the old top-level published component and into their correct row-owned published subcomponents, closing the last live partial-flatten seam without needing a richer generated-part model
11. 2026-04-12 19:37:29: Tightened `OutputPreview-1 Phase 6c.5 - Proof Matrix And Family Handoff` into an implementation-ready closeout-and-repair pass by grounding it in the latest live partial-flatten Browser repro where only one active `SolidBodies` row becomes a nested subcomponent, locking the simpler one-wire-one-subcomponent target, and narrowing the next owner to row-classification plus ownership carry-through instead of any richer generated-part model
10. 2026-04-12 14:25:41: Updated `OutputPreview-1 Phase 6c` to lock the simpler follow-on direction after live Browser review: keep individual solid bodies as published objects, treat each active `SolidBodies` wire as the subcomponent boundary, and avoid introducing generated part rows inside `6c`
9. 2026-04-12 14:06:19: Marked `OutputPreview-1 Phase 6c.4 - Browser Projection And Mixed-Row Proof` complete after the shipped Browser-row and tree-selector carry-through started surfacing nested published subcomponents honestly under one top-level published component while keeping mixed singular published rows direct
8. 2026-04-12 13:55:23: Tightened `OutputPreview-1 Phase 6c.4 - Browser Projection And Mixed-Row Proof` into an implementation-ready pass by grounding it in the shipped `6c.3` nested published-subcomponent project-content shape, naming the remaining Browser seam where component rows still only parent to assemblies, and locking the minimum Browser-row plus tree-selector widening needed before final `6c.5` handoff
7. 2026-04-12 13:34:38: Marked `OutputPreview-1 Phase 6c.3 - Project Content Sync And Runtime Placement` complete after the shipped app-store carry-through widened project content/runtime placement to support nested published subcomponents under one top-level published component while preserving direct published-object `sourceOutputEntryId` truth
6. 2026-04-12 13:14:29: Tightened `OutputPreview-1 Phase 6c.3 - Project Content Sync And Runtime Placement` into an implementation-ready pass by grounding it in the shipped `6c.2` surface widening, naming the real app-store seam where published `subcomponents` still collapse because project content cannot yet nest components under components, and locking the recommended local hierarchy expansion plus stable published-subcomponent id strategy before Browser proof work begins
5. 2026-04-12 13:11:41: Marked `OutputPreview-1 Phase 6c.2 - Output Surface Row-Owned Collection Materialization` complete after shipping the `outputSurface.ts` contract widening that now materializes row-owned `SolidBodies` collection subcomponents and mixed direct-object siblings while preserving the flattened compatibility object list for the later `6c.3` project-content carry-through
4. 2026-04-12 13:05:05: Tightened `OutputPreview-1 Phase 6c.2 - Output Surface Row-Owned Collection Materialization` into an implementation-ready pass by grounding it in the current `buildGraphPublishedContentSurface(...)` flatten-by-total-object-count rule, locking the recommended one-level hierarchy widening for row-owned collection subcomponents under one top-level component, and narrowing the next code owner to `outputSurface.ts` plus focused publication-surface regressions before any `useAppStore` carry-through
3. 2026-04-12 13:02:37: Tightened `OutputPreview-1 Phase 6c.1 - Row-Owned Collection Contract Lock` into an implementation-ready contract pass by locking the recommended Browser/publication rule that grouping keys off active `SolidBodies` row ownership rather than total published object count, keeps many collection rows under one top-level component with one subcomponent per collection row, and leaves singular `SolidBody` rows as direct objects in mixed cases
2. 2026-04-12 12:57:42: Split `OutputPreview-1 Phase 6c - Row-Owned Collection Subcomponents` into a Codex-sized `6c.1-6c.5` ladder so the Browser/publication-structure follow-on can land one owner at a time: contract lock, output-surface materialization, project-content sync, Browser proof for mixed cases, and final handoff
1. 2026-04-12 12:54:39: Created this dedicated `OutputPreview-1 Phase 6c` future plan doc after product direction locked the next Browser/publication-structure follow-on: every published `SolidBodies` input row should own its own subcomponent when more than one collection row is active, instead of the current flattening rule that collapses all published objects into one component whenever the total object count is greater than one

### Purpose

- define the dedicated follow-on plan for row-owned `SolidBodies` publication structure after `Phase 6b` closed the per-object identity, rendering, and selection seams
- separate Browser/publication hierarchy work from the already-closed viewport identity family
- lock the authored output-structure rule for collection rows before implementation starts changing the publication surface and project-content sync shape

### Scope

This phase covers:
- how `OutputPreview` should publish multiple active `SolidBodies` input rows into Browser/project-content structure
- whether one `SolidBodies` row becomes a direct object or a row-owned subcomponent
- the rule for flattening versus nesting when there is one collection row versus many collection rows
- the publication-surface and project-content hierarchy needed to preserve that row-owned structure
- keeping the current split-publication truth where individual solid bodies can remain published objects inside a row-owned collection group

This phase does not cover:
- reopening `Phase 6b` per-object viewer identity, singular-member rendering, or split-object selection work that is already closed
- changing the default grouped-versus-split publication mode from shipped `Phase 6`
- broader Browser hierarchy planning outside `OutputPreview` publication structure
- worker/build artifact semantics unless implementation proves the current published content surface is too shallow to express the chosen row-owned hierarchy
- introducing generated-content `part` rows where one `SolidBodies` wire becomes one published object and each child body becomes a Browser part; that richer object-with-parts model is intentionally out of scope for `6c`

## Doc Body

## [ ] `OutputPreview-1 Phase 6c` - `Row-Owned Collection Subcomponents`

Purpose:
- make published Browser structure reflect row-owned `SolidBodies` collection ownership instead of flattening all published collection children into one component whenever total object count is greater than one

Owns:
- the publication-structure rule for multiple active `SolidBodies` input rows on one `OutputPreview`
- deciding when one collection row should stay flat versus when it should materialize as its own subcomponent
- the `GraphPublishedContentSurface` and project-content hierarchy changes needed so Browser structure can mirror that row-owned collection truth
- focused proof that one authored `SolidBodies` row now maps to one Browser-owned collection group
- locking that `6c` keeps the currently shipped "one concrete solid body => one published object" truth inside those row-owned collection groups

Does not own:
- singular `SolidBody` member rendering or same-row aggregation correctness already closed in `6b`
- Browser/viewer selection identity beyond preserving the already-shipped `sourceOutputEntryId` object truth
- redesigning authored `Extrude` output semantics or upstream body grouping rules
- the alternate publication model where one collection wire becomes one published object and child solid bodies become generated Browser parts

Current seam read:
- `buildGraphPublishedContentSurface(...)` in [src/app/spaghetti/outputSurface.ts](./src/app/spaghetti/outputSurface.ts:223) currently groups only by total published object count:
  - `0` objects => no rows
  - `1` object => one direct object row
  - `2+` objects => one single component row containing every published object
- that flattening rule ignores row ownership, so two active `SolidBodies` rows currently collapse into one Browser component even when product intent wants those two collection rows to remain visibly distinct
- `useAppStore.ts` then materializes that same shallow shape directly into project content, so Browser/project-content cannot recover the missing row-owned collection grouping later
- the current result is:
  - one top-level component
  - many child objects
  - no stable subcomponent boundary per `SolidBodies` source row
- latest live Browser review narrows the desired fix further:
  - the Browser does not need a new generated-part model for `6c`
  - the easier target is simply: each active `SolidBodies` wire owns one subcomponent, and the individual solid bodies under that wire remain normal published objects

Locked direction:
- treat each active `SolidBodies` input row as a row-owned collection publication source
- recommended product rule:
  - one active `SolidBodies` row total => it may stay under one top-level component without extra subcomponent nesting
  - more than one active `SolidBodies` row => each collection row publishes as its own subcomponent
  - singular `SolidBody` rows stay as direct objects unless a later explicit product rule says otherwise
- inside a row-owned `SolidBodies` subcomponent, keep the current simpler publication truth:
  - each concrete solid body remains its own published object
  - do not add generated Browser part rows in `6c`
- preserve the vision rule that Browser/project hierarchy should reflect explicit authored output handoff instead of inferring structure only from total final object count
- prefer a publication-surface shape that makes row ownership explicit, even if that means widening the current `object | component-with-objects` structure into a deeper hierarchy

Canonical easier target:
- `Component 1`
- `Component 1.1`
- `Object 1.1.1`
- `Object 1.1.2`
- `Object 1.1.3`
- `Object 1.1.4`
- `Component 1.2`
- `Object 1.2.1`
- `Object 1.2.2`
- `Object 1.2.3`
- `Object 1.2.4`

Explicitly deferred richer target:
- `Component`
- `Subcomponent per wire`
- `Object per wire`
- `Part per child solid body`
- this richer object-with-parts model may still be valuable later, but it is intentionally not the `6c` implementation target because it would require a new generated-content part contract instead of a narrower row-grouping repair

Questions this phase must answer:
- should the flattening rule key off total published object count, or off the count of active `SolidBodies` collection rows?
- how should mixed cases read:
  - one `SolidBodies` row plus singular `SolidBody` rows
  - two `SolidBodies` rows where one row publishes one child object and the other publishes many
  - one grouped `SolidBodies` row plus one split `SolidBodies` row
- is one top-level component with many subcomponents the right Browser shape, or should row-owned collection groups become direct top-level siblings under the assembly?
- what is the shallowest type/contract expansion that keeps row-owned collection structure explicit without breaking existing `OutputPreview` and Browser consumers?

Likely files:
- [src/app/spaghetti/outputSurface.ts](./src/app/spaghetti/outputSurface.ts:223)
- [src/app/store/useAppStore.ts](./src/app/store/useAppStore.ts:3575)
- [src/app/spaghetti/outputSurface.test.ts](./src/app/spaghetti/outputSurface.test.ts:78)
- [src/app/store/useAppStore.test.ts](./src/app/store/useAppStore.test.ts:1)
- likely Browser-facing follow-on proof in:
  - `src/app/panels/selectBrowserTreeRows.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`

Suggested implementation order:
1. Add one failing publication-surface regression for the authored case:
   - `SolidBodies` row 1 publishes two child objects
   - `SolidBodies` row 2 publishes one child object
   - expected: one top-level component with two row-owned subcomponents, not one flattened component with three children
2. Add the control regression for the simple case:
   - one active `SolidBodies` row total
   - expected: no forced extra subcomponent layer
3. Lock the publication-surface contract that distinguishes:
   - direct object rows
   - direct component rows
   - row-owned collection subcomponents
4. Patch project-content sync so Browser rows and runtime placement preserve the same row-owned collection structure.
5. Re-run focused Browser/content proof for:
   - single collection row
   - many collection rows
   - mixed collection plus singular rows

Implementation stop rule:
- this phase is complete once Browser/project-content publication structure reflects the chosen row-owned collection rule without reopening `6b` rendering or selection seams
- if implementation exposes a deeper Browser-family hierarchy question that is no longer `OutputPreview`-local, stop and hand that broader owner off instead of burying it inside this family

Acceptance checks:
- if there is only one active `SolidBodies` input row, publication may stay at one component without extra subcomponent nesting
- if there are many active `SolidBodies` input rows, each collection row publishes as its own subcomponent
- one collection row that splits into many published objects still keeps those objects grouped under that row-owned subcomponent
- Browser/project-content hierarchy no longer collapses many collection rows into one component merely because total published object count is greater than one
- `6c` does not require generated Browser part rows for published collection members; the child solid bodies may remain ordinary published objects inside the row-owned subcomponent

## [x] `OutputPreview-1 Phase 6c.1` - `Row-Owned Collection Contract Lock`

Purpose:
- lock the exact publication rule for when `SolidBodies` rows stay flat versus when they become row-owned subcomponents

Owns:
- naming the canonical product rule for:
  - one active `SolidBodies` row
  - many active `SolidBodies` rows
  - mixed `SolidBodies` plus singular `SolidBody` rows
- deciding whether the new grouping boundary belongs under one top-level component or as direct assembly children
- locking the smallest content-surface contract expansion needed before code changes begin
- drawing the stop-rule boundary so `6c.2` can implement structure without reopening product-policy questions

Does not own:
- implementation of the new hierarchy in `outputSurface.ts`
- project-content sync or Browser selector work

Current contract seam:
- the current published-content rule keys off total published object count instead of row ownership:
  - `0` published objects => no rows
  - `1` published object => direct object row
  - `2+` published objects => one component containing every published object
- that means these authored shapes all collapse too similarly:
  - `SolidBodies row A -> 2 objects` plus `SolidBodies row B -> 1 object`
  - `SolidBodies row A -> 1 object` plus `SolidBodies row B -> 1 object`
  - `SolidBodies row A -> 2 objects` plus singular `SolidBody row B -> 1 object`
- product direction now wants collection ownership to stay visible at the row boundary, so `SolidBodies` rows should not disappear merely because their children can be flattened into one final object list

Locked direction:
- grouping keys off active `SolidBodies` row ownership, not off total published object count
- recommended Browser/publication rule:
  - if there is exactly one active `SolidBodies` row total, that collection may stay under one top-level component without an extra subcomponent wrapper
  - if there are two or more active `SolidBodies` rows, each active collection row owns one subcomponent, even if one of those rows currently publishes only one child object
  - singular `SolidBody` rows remain direct objects in mixed cases
  - row-owned collection groups stay under one top-level published component rather than becoming direct assembly children
- grouped versus split still affects how many child objects live inside a row-owned collection group; it does not change whether that collection row owns a group at all once many collection rows are present

Locked mixed-case answers:
- `SolidBodies row A + SolidBodies row B`:
  - one top-level component
  - one subcomponent for row A
  - one subcomponent for row B
- `SolidBodies row A + singular SolidBody row B`:
  - one top-level component
  - row A becomes one row-owned subcomponent
  - row B stays one direct object sibling under the top-level component
- `SolidBodies row A (grouped one child) + SolidBodies row B (split many children)`:
  - both rows still become their own subcomponents once many collection rows are active
  - row A simply has one child object inside its row-owned subcomponent

Questions this phase must answer:
- what is the shallowest published-content surface shape that can express:
  - direct objects
  - row-owned collection subcomponents
  - child objects inside those row-owned subcomponents
- can the current top-level `component` row stay as the stable outer owner while only the interior hierarchy widens by one level?

Likely files:
- [docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/OutputPreview/Future/OutputPreview 1 - Phase 6c - Row-Owned Collection Subcomponents.md](./docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/OutputPreview/Future/OutputPreview%201%20-%20Phase%206c%20-%20Row-Owned%20Collection%20Subcomponents.md)
- [src/app/spaghetti/outputSurface.ts](./src/app/spaghetti/outputSurface.ts:223)
- [src/app/store/useAppStore.ts](./src/app/store/useAppStore.ts:3575)

Suggested implementation order:
1. Replace the open policy questions in this phase with one explicit contract statement for:
   - single collection row
   - many collection rows
   - mixed collection plus singular rows
2. Lock the recommended outer hierarchy answer:
   - one top-level component
   - row-owned collection subcomponents only when many collection rows are active
3. Name the minimum type expansion that `6c.2` will need in `GraphPublishedContentSurface`.
4. Stop before changing code or Browser selectors.

Implementation stop rule:
- this phase is complete once the row-owned grouping rule is explicit enough that `6c.2` can implement `outputSurface.ts` without inventing policy on the fly
- if a broader Browser hierarchy debate appears, stop and record it instead of burying that uncertainty inside the `OutputPreview` contract

Acceptance checks:
- the doc states one unambiguous rule for single-row, multi-row, and mixed-row publication structure
- the doc explicitly says grouping keys off active `SolidBodies` row count rather than total published object count
- the implementation target is narrowed to one shallow hierarchy expansion instead of a vague Browser redesign
- `6c.2` can now be framed as a direct contract-materialization pass rather than another product-policy discussion

## [x] `OutputPreview-1 Phase 6c.2` - `Output Surface Row-Owned Collection Materialization`

Purpose:
- teach `buildGraphPublishedContentSurface(...)` to emit row-owned collection groups instead of flattening purely by total object count

Owns:
- the `outputSurface.ts` contract/type change for row-owned collection subcomponents
- publication-surface shaping for:
  - one `SolidBodies` row total
  - many `SolidBodies` rows
  - split and grouped collection rows
- focused output-surface regressions that prove the authored shape now stays row-owned

Does not own:
- Browser/project-content runtime sync
- Browser row rendering or tree selectors

Current implementation seam:
- [buildGraphPublishedContentSurface(...)](./src/app/spaghetti/outputSurface.ts:223) currently computes one flat `publishedObjects` list and then chooses only between:
  - no rows
  - one direct object row
  - one single component row containing every published object
- that shape cannot represent the `6c.1` rule once many active `SolidBodies` rows are present, because it has no room for one row-owned collection group per collection row
- this phase therefore needs to widen the published-content surface by one level, but should stop there rather than reaching into `useAppStore.ts` or Browser consumers yet

Locked direction:
- keep the current top-level component owner when publication needs grouping
- widen only the interior published-content shape by one level so it can express:
  - direct object children
  - row-owned collection subcomponents with their own child objects
- materialize row-owned collection grouping only when the `6c.1` contract says many active `SolidBodies` rows are present
- preserve the current simpler surface for:
  - zero published objects
  - one direct object
  - one active `SolidBodies` row total when no extra subcomponent layer is required
- do not patch `useAppStore.ts` in this phase; that carry-through belongs to `6c.3`

Questions this phase must answer:
- what is the smallest `GraphPublishedContentSurfaceRow` expansion that can carry:
  - a top-level component
  - direct object children
  - row-owned collection subcomponents and their child objects
- can the existing singleton/direct-object cases remain simple while only the many-collection-row case widens?
- how should the output-surface shape encode provenance for a row-owned collection group:
  - owning `slotId`
  - source-row label
  - child object entries only

Likely files:
- [src/app/spaghetti/outputSurface.ts](./src/app/spaghetti/outputSurface.ts:223)
- [src/app/spaghetti/outputSurface.test.ts](./src/app/spaghetti/outputSurface.test.ts:78)
- possibly minimal exhaustiveness touchups in other `GraphPublishedContentSurface` readers, but only if the widened type requires them

Suggested implementation order:
1. Add the failing authored regression for the motivating case:
   - `SolidBodies` row 1 publishes two child objects
   - `SolidBodies` row 2 publishes one child object
   - expected: one top-level component with two row-owned collection subcomponents
2. Add the control regression for the simpler contract case:
   - one active `SolidBodies` row total
   - expected: no forced extra subcomponent layer
3. Widen `GraphPublishedContentSurfaceRow` just enough to express row-owned collection subcomponents under one top-level component.
4. Materialize the new rule in `buildGraphPublishedContentSurface(...)`.
5. Re-run focused output-surface proof before touching `useAppStore`.

Implementation stop rule:
- this phase is complete once the publication surface itself can distinguish row-owned collection subcomponents from flat object rows
- stop before project-content sync or Browser selectors; that carry-through belongs to `6c.3`
- if the type widening needed here starts forcing a broader Browser/project-content contract redesign, stop and record that broader owner instead of burying it inside `outputSurface.ts`

Acceptance checks:
- output-surface tests prove the authored multi-row collection case no longer collapses into one component
- one-row collection publication still stays as simple as the locked contract allows
- the widened content-surface type is still shallow and explicit enough that `6c.3` can consume it without another policy pass

Verification notes:
- Passed `cmd /c npm.cmd test -- --run src/app/spaghetti/outputSurface.test.ts`
- The shipped surface now exposes row-owned `subcomponents` plus optional `directObjects` while preserving the flattened compatibility `objects` list for later `6c.3` project-content sync
- `useAppStore.ts` and Browser/runtime carry-through remain intentionally unmodified in this phase

## [x] `OutputPreview-1 Phase 6c.3` - `Project Content Sync And Runtime Placement`

Purpose:
- carry the new row-owned collection structure from published content surface into project content without losing placement or ownership truth

Owns:
- `useAppStore.ts` project-content sync for row-owned collection subcomponents
- runtime placement for collection-owned child objects under the new subcomponent layer
- keeping existing `sourceOutputEntryId` object identity intact while the parent grouping shape changes

Does not own:
- Browser tree rendering polish
- viewer selection/identity semantics already closed in `6b`

Current implementation seam:
- shipped `6c.2` now lets [buildGraphPublishedContentSurface(...)](./src/app/spaghetti/outputSurface.ts:223) emit:
  - one top-level published component row
  - optional direct object children
  - row-owned collection `subcomponents`
- but [useAppStore.ts](./src/app/store/useAppStore.ts:3575) still only knows how to consume:
  - one published object row, or
  - one published component row with one flat `publishedRow.objects` list
- the current app-store sync therefore still collapses any `6c.2` `subcomponents` back into:
  - one published component record
  - many direct object children
- the deeper local seam is that `ProjectComponentRecord` currently supports:
  - `parentAssemblyId`
  - `childObjectIds`
  - but not:
    - `parentComponentId`
    - ordered child row ownership that can include nested components
- so `6c.3` is not just a loop update; it must widen project-content/runtime placement one level so a row-owned published subcomponent can exist under the top-level published component without becoming a whole new Browser-family redesign

Locked direction:
- keep the shipped `6c.1-6c.2` Browser/publication rule:
  - one top-level published component remains the outer owner
  - each row-owned `SolidBodies` collection group becomes its own published subcomponent under that owner when required
  - direct singular `SolidBody` rows stay direct objects under the top-level published component in mixed cases
- recommended local project-content expansion:
  - allow `ProjectComponentRecord` to express nested published components under another component
  - prefer one ordered child-row list for components, parallel to assemblies, rather than inventing a separate one-off `publishedSubcomponents` side channel
  - preserve `childObjectIds` as a compatibility-oriented derived view where existing downstream readers still expect it
- recommended stable id strategy:
  - keep the existing top-level published component id from `buildProjectPublishedComponentId(...)`
  - mint deterministic published-subcomponent ids from `projectFileId + graphDocumentId + slotId`
- preserve per-object truth:
  - child objects keep their direct `sourceOutputEntryId`
  - row-owned subcomponents are grouping owners only, not replacements for object identity
- stop at project-content/runtime placement carry-through; Browser proof and selector polish remain `6c.4`

Questions this phase must answer:
- what is the smallest `ProjectComponentRecord` widening that can express:
  - one top-level published component
  - nested row-owned published subcomponents
  - direct objects under either level
- should component nesting use:
  - `parentComponentId + childRowIds`, or
  - some narrower published-only special case?
- how should runtime cleanup/order preservation treat published subcomponents so:
  - valid runtime row ids stay deterministic
  - empty transient collection groups do not incorrectly survive or disappear
  - previous ordering remains stable across rebuilds
- which existing selectors/readers must receive only minimal exhaustiveness touchups so the new nested project-content shape compiles before `6c.4` does the Browser-facing proof?

Likely files:
- [src/app/store/useAppStore.ts](./src/app/store/useAppStore.ts:3575)
- [src/app/store/useAppStore.test.ts](./src/app/store/useAppStore.test.ts:1)
- likely minimal type/read touchups in:
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/components/ViewerHost.tsx`
  - any helper in `useAppStore.ts` that currently assumes components only own objects

Suggested implementation order:
1. Add the failing `useAppStore` regression for the motivating authored case:
   - `SolidBodies` row 1 publishes two child objects
   - `SolidBodies` row 2 publishes one child object
   - expected project content:
     - one top-level published component
     - two nested published subcomponents
     - child objects parented under the correct subcomponent
2. Add the mixed-case control regression:
   - one `SolidBodies` row
   - one singular `SolidBody` row
   - expected project content:
     - one top-level published component
     - one nested published subcomponent for the collection row
     - one direct object sibling for the singular row
3. Widen `ProjectComponentRecord` and the relevant runtime placement helpers just enough to express nested published subcomponents while preserving compatibility for existing component/object readers.
4. Patch the published-content sync in `useAppStore.ts` so it:
   - registers stable runtime row ids for published subcomponents
   - materializes deterministic subcomponent records
   - parents objects under either the top-level component or the correct subcomponent
   - preserves `sourceOutputEntryId` on every object
5. Re-run focused app-store/runtime proof before touching Browser-facing proof assertions.

Implementation stop rule:
- this phase is complete once project content can materialize the new row-owned collection groups without flattening them back out
- stop before Browser tree proof/polish; that authored projection work still belongs to `6c.4`
- if the smallest working change here starts requiring a generic repo-wide component-tree redesign beyond published runtime sync, stop and record that broader owner instead of burying it inside `6c.3`

Acceptance checks:
- project-content sync creates the expected parent/child structure for many collection rows
- child objects still preserve their direct `sourceOutputEntryId` ownership under the new parent grouping
- one top-level published component can now own published subcomponents without forcing those subcomponents to masquerade as assemblies or loose objects
- mixed collection-plus-singular publication keeps the singular object direct while the collection row becomes a nested grouping owner

Verification notes:
- Passed `cmd /c npm.cmd test -- --run src/app/store/useAppStore.test.ts -t "syncs many published SolidBodies rows into nested published subcomponents in project content|keeps mixed singular published rows direct while collection rows become nested subcomponents"`
- The shipped app-store sync now materializes deterministic published-subcomponent component records and keeps `childObjectIds` as the flattened compatibility subtree view
- Browser tree projection is not yet updated to render those nested published subcomponents honestly; that proof/polish still belongs to `6c.4`

## [x] `OutputPreview-1 Phase 6c.4` - `Browser Projection And Mixed-Row Proof`

Purpose:
- prove that Browser rows now read the new collection grouping honestly across the tricky mixed authored cases

Owns:
- Browser-facing proof for:
  - many `SolidBodies` rows
  - one `SolidBodies` row plus singular `SolidBody` rows
  - one grouped collection row plus one split collection row
- any minimal selector/test adjustments needed so Browser tree reads the new row-owned grouping shape correctly

Does not own:
- new Browser UX beyond honest projection of the already-locked structure
- broader Browser-family hierarchy redesign

Current implementation seam:
- shipped `6c.3` now materializes nested published subcomponents in project content:
  - one top-level published component
  - row-owned published subcomponent components underneath it when required
  - published objects parented either to the top-level component or to the correct subcomponent
- but the Browser-facing shape still flattens component parenting:
  - [ProjectContentBrowserRowVm](./src/app/store/useAppStore.ts:318) component rows carry `parentAssemblyId` but not `parentComponentId`
  - [selectCurrentProjectContentBrowserRows(...)](./src/app/store/useAppStore.ts:8319) emits component rows as if they only live under assemblies
  - [selectBrowserTreeRows(...)](./src/app/panels/selectBrowserTreeRows.ts:650) currently groups:
    - assemblies under assemblies
    - components under assemblies
    - objects under components
    - but not components under components
- so the remaining user-visible symptom after `6c.3` is that Browser projection still cannot show the row-owned published subcomponents as their own nested rows even though project content now has that truth

Locked direction:
- keep the shipped `6c.1-6c.3` structure rule:
  - one top-level published component remains the outer owner
  - row-owned collection groups appear as nested component rows when present
  - direct singular published objects remain direct object children under the top-level component in mixed cases
- recommended Browser-row widening:
  - let component Browser rows carry optional `parentComponentId`
  - keep `parentAssemblyId` for top-level placement and fallback policy reads
  - use `childObjectCount` as the compatibility count for the flattened subtree unless implementation proves the Browser needs a separate direct-child count field right now
- recommended selector widening:
  - teach `selectBrowserTreeRows(...)` to group component rows by either parent component or parent assembly
  - preserve existing object-under-component behavior
  - do not redesign row visuals beyond showing the already-authored hierarchy honestly
- keep this pass proof-oriented:
  - many `SolidBodies` rows should now show one parent component plus many nested subcomponents
  - mixed collection-plus-singular rows should now show one nested collection subcomponent plus one direct object sibling

Questions this phase must answer:
- what is the smallest Browser-row VM expansion needed so nested published subcomponents can surface without disturbing existing assembly/component/object rows?
- do Browser policy inheritance and breadcrumb/selection helpers need minimal parent-component support for component rows, or is Browser projection alone enough for this phase?
- does the current `childObjectCount` remain an acceptable Browser meta for nested published subcomponents, or is a direct-child count needed before closeout?

Likely files:
- [src/app/store/useAppStore.ts](./src/app/store/useAppStore.ts:8319)
- [src/app/panels/selectBrowserTreeRows.ts](./src/app/panels/selectBrowserTreeRows.ts:650)
- `src/app/panels/selectBrowserTreeRows.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- [src/app/store/useAppStore.test.ts](./src/app/store/useAppStore.test.ts:1)

Suggested implementation order:
1. Add the failing Browser-facing regression for the motivating case:
   - `SolidBodies` row 1 publishes two child objects
   - `SolidBodies` row 2 publishes one child object
   - expected Browser rows:
     - one top-level published component
     - two nested published subcomponent rows
     - child objects under the correct subcomponent rows
2. Add the mixed-case control regression:
   - one `SolidBodies` row
   - one singular `SolidBody` row
   - expected Browser rows:
     - one top-level published component
     - one nested collection subcomponent row
     - one direct object sibling under the top-level component
3. Widen `ProjectContentBrowserRowVm` component rows just enough to carry `parentComponentId`.
4. Patch `selectCurrentProjectContentBrowserRows(...)` and `selectBrowserTreeRows(...)` so component rows can parent under components as well as assemblies.
5. Re-run focused Browser projection proof without reopening app-store/runtime ownership.

Implementation stop rule:
- this phase is complete once Browser-facing proof shows the new row-owned collection groups stay distinct in the authored cases that motivated `6c`
- stop before final family closeout wording; that belongs to `6c.5`
- if Browser projection here exposes a broader generic nested-component UX problem unrelated to published `OutputPreview` rows, stop and record that narrower non-`6c` owner instead of hiding it in this family

Acceptance checks:
- the Browser no longer shows one single component for the "2 objects in row 1, 1 object in row 2" case
- mixed collection-plus-singular publication reads stay deterministic and honest
- nested published subcomponents appear as component rows under the top-level published component instead of flattening back to assembly-level siblings or disappearing entirely

Verification notes:
- Passed `cmd /c npm.cmd test -- --run src/app/store/useAppStore.test.ts -t "syncs many published SolidBodies rows into nested published subcomponents in project content|keeps mixed singular published rows direct while collection rows become nested subcomponents"`
- Passed `cmd /c npm.cmd test -- --run src/app/panels/selectBrowserTreeRows.test.ts -t "renders nested published subcomponents under their parent component while keeping direct object siblings"`
- Browser projection now follows parent-component ownership for nested published component rows; final family closeout remains in `6c.5`

## [x] `OutputPreview-1 Phase 6c.5` - `Proof Matrix And Family Handoff`

Purpose:
- close the row-owned collection publication follow-on by repairing the last live partial-flatten seam and then re-running one focused Browser/content proof matrix before family handoff

Owns:
- the final repair plus proof across:
  - one collection row total
  - many collection rows
  - mixed collection plus singular rows
  - grouped versus split collection rows
- deciding whether `6c` closes cleanly or reveals one narrower non-`OutputPreview` owner
- capturing the latest live Browser truth after `6c.4`, including the partial-misgroup case where only one active `SolidBodies` row becomes a nested subcomponent and the sibling row still leaks loose objects under the top-level component
- the narrower repair needed so the locked easier target becomes true in the actual Browser:
  - one top-level component
  - one nested subcomponent per active `SolidBodies` wire when many rows are active
  - concrete solid-body members remain object rows under the correct subcomponent

Does not own:
- speculative follow-on architecture if the final proof stays clean
- inventing generated-content Browser part rows; if that richer model is still desired later, it belongs to a new follow-on family rather than `6c`
- redesigning the current split-publication contract so one collection wire becomes one published object with generated parts

Current live seam:
- the latest live Browser repro shows `6c.4` was only partially successful:
  - one active `SolidBodies` row now becomes a nested subcomponent
  - the sibling active `SolidBodies` row still leaks its member objects directly under the top-level component
- that means the Browser can already display nested subcomponents, but authored many-row collection ownership is still not being applied consistently across every active `SolidBodies` wire
- the strongest current hypothesis is a remaining row-classification or ownership-carry-through seam, not a missing Browser capability:
  - one source row is being treated as collection-owned
  - the sibling source row is still being flattened as direct objects

Locked direction:
- keep the simpler `6c` target that was re-affirmed after live review:
  - each active `SolidBodies` wire is the grouping boundary
  - each concrete solid body inside that wire remains a published object
  - no generated Browser `part` rows are introduced in this family
- the correct many-row collection Browser/content shape is:
  - one top-level published component
  - one nested published subcomponent per active `SolidBodies` wire
  - concrete solid-body object rows under the correct subcomponent
- if implementation proves the current row-classification signal is still too weak, prefer the smallest owner-local rule that makes active multi-body rows deterministic:
  - effective source port type `solidBodies`
  - or multiple published members / `memberIndex`
  - or another row-local authored signal
- do not reopen the broader object-vs-part publication-model debate inside `6c.5`

Questions this phase must answer:
- where is the last partial-flatten break actually happening:
  - publication-surface row classification in `outputSurface.ts`
  - project-content carry-through in `useAppStore.ts`
  - or Browser projection ordering/grouping
- what is the smallest deterministic rule that ensures every active `SolidBodies` wire in the many-row case becomes a nested subcomponent instead of allowing one sibling row to leak direct objects?
- after that repair lands, does the authored matrix now fully match the locked easier target, or does one narrower non-`6c` owner remain?

Likely files:
- [src/app/spaghetti/outputSurface.ts](./src/app/spaghetti/outputSurface.ts:232)
- [src/app/store/useAppStore.ts](./src/app/store/useAppStore.ts:3560)
- [src/app/panels/selectBrowserTreeRows.ts](./src/app/panels/selectBrowserTreeRows.ts:650)
- [src/app/spaghetti/outputSurface.test.ts](./src/app/spaghetti/outputSurface.test.ts:720)
- [src/app/store/useAppStore.test.ts](./src/app/store/useAppStore.test.ts:1618)
- [src/app/panels/selectBrowserTreeRows.test.ts](./src/app/panels/selectBrowserTreeRows.test.ts:966)

Suggested implementation order:
1. Add the failing regression for the exact live partial-flatten case:
   - two active `SolidBodies` rows
   - both rows publish many concrete solid-body objects
   - current bad shape:
     - one row becomes a nested subcomponent
     - the sibling row leaks direct objects under the top-level component
   - expected:
     - one nested subcomponent per active `SolidBodies` wire
     - no leaked direct objects from collection rows
2. Add the compact control proofs:
   - one active `SolidBodies` row total
   - many active `SolidBodies` rows
   - one collection row plus one singular row
3. Patch the first bad transition where one active collection row is still losing its row-owned grouping.
4. Re-run focused Browser/content proof across the locked easier target.
5. Mark `6c` complete if no broader owner remains.

Implementation stop rule:
- this phase is complete once the partial-flatten live repro is repaired and the final proof matrix can close `6c` without ambiguity
- stop if the only remaining desired change is the richer "one wire => one object with generated parts" model; that belongs to a new follow-on family instead of being buried inside `6c`

Acceptance checks:
- the final proof says either:
  - `Phase 6c` is complete and the family can hand off cleanly, or
  - one narrower owner remains and is named explicitly
- the final Browser shape for the many-row collection case matches the easier locked target:
  - one top-level component
  - one nested collection subcomponent per active `SolidBodies` wire
  - concrete solid-body members remain object rows under that subcomponent rather than requiring generated part rows
- no active `SolidBodies` row in the many-row case leaks its concrete object members directly under the top-level component

Verification notes:
- Passed `cmd /c npm.cmd test -- --run src/app/store/useAppStore.test.ts -t "migrates legacy flat published object placement into row-owned subcomponents when many collection rows are active|syncs many published SolidBodies rows into nested published subcomponents in project content|keeps mixed singular published rows direct while collection rows become nested subcomponents"`
- Passed `cmd /c npm.cmd test -- --run src/app/panels/selectBrowserTreeRows.test.ts -t "renders nested published subcomponents under their parent component while keeping direct object siblings"`
- The shipped closeout repair lives in `useAppStore.ts`, where runtime-backed published objects/components now upgrade out of the old flattened top-level published-component parent when a newer row-owned published subcomponent hierarchy is derived
- `Phase 6c` now closes on the simpler locked model:
  - one nested subcomponent per active `SolidBodies` wire in the many-row case
  - concrete solid-body members remain ordinary published objects under that subcomponent
  - no richer generated-content Browser part model was needed for this family

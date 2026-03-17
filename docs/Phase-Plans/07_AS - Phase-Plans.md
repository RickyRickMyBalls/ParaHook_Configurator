# AS - Phase-Plans
## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
22. 2026-03-16 14:02: Reframed the new `Graph Documents` note under `AS6.Q2` as an explicit post-Phase-6 entry so the locked Phase 6 answer remains historical/canonical while the newer `Needs Rebuild` plus `Nodes` idea is preserved as later carry-forward instead of a retroactive answer change
21. 2026-03-16 14:01: Added the post-`02.3` `Graph Documents` carry-forward note under `AS6.Q2`, recording the newer direction that graph children should later split into a normally-open `Needs Rebuild` section and a normally-closed `Nodes` section, with the rebuild list hiding empty/non-producing rows like `s002`
20. 2026-03-16 13:35: Marked `AS - Phase 6` complete after the real `02.3` implementation shipped, updating this family doc so the completed phase now records the first honest `Content` build/control surface as landed work instead of an active question surface
19. 2026-03-16 13:17: Promoted `02.3` into the active execution-spec stage by updating this family doc so the locked `AS6.Q1` through `AS6.Q6` answers now explicitly feed the active `docs/Phase-Plans/Tasks/02.3 - AS - Project Content Inspection And Build Control Surface.md` spec, and by marking the remaining Phase 6 definition checklist items complete at the family-guidance level
18. 2026-03-16 13:12: Locked `AS6.Q6` so Phase 6 explicitly stops at the first honest `Content` build/control surface and defers full `Part` truth, revisions, later `SEQ / ALL`, deeper worker/runtime chunk truth, graph-native worker-contract replacement, nested assembly/package work, and richer viewer/material/reference systems to later lanes
17. 2026-03-16 13:08: Locked `AS6.Q5` so build/policy controls stay separate from view controls on published `Content`, with published rows defaulting to `Live` on load and later mixed child policy state treated as a later layer rather than a reason to merge policy and view behavior
16. 2026-03-16 13:07: Locked `AS6.Q4` so `Assembly`, `Component`, and `Object` are all treated as real build/loading rows in Phase 6, with later `Part` truth extending `Object` rather than replacing it
15. 2026-03-16 13:04: Locked `AS6.Q3` so graph/source traceability remains available on published `Content`, but moves into secondary actions such as `View In Graph`, right-click authoring jumps, and reveal/highlight behavior instead of defining the main row face
14. 2026-03-16 13:02: Locked `AS6.Q2` so `Graph Documents` stays intentionally simple in Phase 6 as the authoring/document surface, while published build/policy behavior remains on `Content`; a possible later graph-node list under `Graph Documents` is now explicitly treated as future work rather than part of this phase
13. 2026-03-16 12:58: Locked `AS6.Q1` so published `Content` row click now means rebuild that row scope, with parent rows such as `Assembly` still rebuilding only the descendant content that actually needs work instead of forcing unnecessary rebuilds
12. 2026-03-16 12:54: Updated the `AS` family doc after `02.2` closed by promoting `AS - Phase 5` from an active question surface into completed family guidance, marking its checklist complete, and expanding `AS - Phase 6` into the new family-level question surface for `2.3` around content row meaning, build-state presentation, graph-vs-content separation, source-trace secondary actions, and policy-versus-view controls
11. 2026-03-16 12:17: Promoted the `02.2` task into the active implementation-ready execution spec and aligned `AS - Phase 5` to treat the current defaults as locked guidance rather than provisional suggestions, replacing the open-question framing with settled family rules for the Phase 5 publish contract, singleton-versus-grouped hierarchy, id model, lift shape, source-trace carry-forward, and explicit defers
10. 2026-03-16 12:03: Expanded the remaining `AS - Phase 5` open items so every sub-question now carries an explicit suggested answer, and synced those recommendations back into the main `AS5.Q4` through `AS5.Q6` answer blocks for multi-singleton lift shape, slot-based highlight acceptance, and receive-link collapse behavior
9. 2026-03-16 11:58: Locked the `AS - Phase 5` singleton `componentLabel` rule, clarifying that `componentLabel` is ignored for single-object publish groups and only becomes meaningful when a real multi-object component grouping exists
8. 2026-03-16 11:56: Locked the singleton-to-multi-object promotion rule for `AS - Phase 5`, clarifying that when a singleton publish group later becomes multi-object the original object keeps its `objectId`, a new `componentId` is introduced only for the new grouping layer, and only the new sibling objects receive new ids
7. 2026-03-16 11:52: Added a `Locked Decisions So Far` block and a `Remaining Decision Questions` block to `AS - Phase 5`, recording the settled singleton-object rule that single-object publish groups are truly object-native with no hidden component identity, and clarifying that the remaining open items are sub-decisions under `AS5.Q1` through `AS5.Q6` rather than a separate competing checklist
6. 2026-03-16 11:48: Refined the `AS - Phase 5` suggested answers so a published `Component` is no longer treated as mandatory for every `OutputPreview`; single-object output previews now lift directly as `Object` rows under the root assembly, while `Component` becomes a grouping row only when a preview publishes multiple objects and needs Browser hierarchy
5. 2026-03-16 11:45: Added suggested first-pass answers for `AS5.Q1` through `AS5.Q6`, locking the current code-backed Phase 5 direction around the authored `componentLabel + objects[] + slots[] + nextSlotIndex` publish contract, `Assembly -> Component -> Object` Browser content hierarchy, stable published ids, graph-to-project lift shape, required source mapping carry-forward, and explicit defers to later `Part`, build-bar, and runtime-truth work
4. 2026-03-16 11:37: Expanded `AS - Phase 5` from a simple placeholder into the active family question surface for Browser-facing graph output structure, adding the implementation-readiness questions around authored publish contract shape, first-pass `Assembly -> Component -> Object` hierarchy, id/ownership rules, Browser lift shape, and explicit scope defers before a dedicated task doc is written
3. 2026-03-11 12:23: Renamed the future `AS - Phase 5` and `AS - Phase 6` placeholders to match the roadmap carry-forward, so the family doc now points at Browser-facing graph output structure work and later project-content inspection/build-control work instead of the older narrower OutputPreview/inspection placeholder wording
2. 2026-03-08 00:00: Rebuilt the completed `AS` phases from `docs/CHANGELOG.md`, keeping `AS - Phase 3` as an inferred gap phase and adding real summaries, grouped checklists, and file-footprint sections for `AS - Phase 1`, `2`, `3`, and `4`
1. 2026-03-08 00:00: Created this family phase-plan file in the settled canonical structure so the `AS` family now has a proper home for later changelog reconstruction, checklist buildout, and future preview-assembly planning

##### Purpose

This file is the simple phase-family history document for the `AS` prefix.

Use this file for:
- the canonical `AS` phase sequence
- a simple explanation of what each `AS` phase did
- understanding how preview assembly and part-output identity evolved over time
- seeing where major `AS` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `AS` Means

`AS` is the canonical preview-assembly prefix.

It is used when the main work is about:
- parts list behavior
- part ordering
- artifact identity
- assembled-output direction
- preview assembly mapping between produced parts and visible output

##### Format And Depth

Use this file as the planning and checklist home for canonical `AS` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - AS - Phase 1 - `Parts List Replacement` - Reconstructed

Human Summary: This removed the history-scrubber direction from the restart baseline and replaced it with a parts-list model, shifting the product toward part-driven inspection instead of time-travel UI.

### Phase 1 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 8` restored restart band.

It is the first clear `AS` move away from the old scrubber/history mindset.

##### Phase Summary

Current understanding:
- the restart baseline dropped the history-scrubber direction
- a parts-list model became the main inspection surface
- selection moved toward part-focused controls instead of scrubbing through time
- future history support was pushed out of the base product direction

##### Files Changed

- `src/app/panels/PartsListPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/shared/partsTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`

### Phase 1 CheckList

- [x] remove the history-scrubber direction from the restart baseline
- [x] replace it with a parts-list inspection model
- [x] make part selection focus relevant controls instead of time-travel UI
- [x] treat future history support as optional later layering rather than the base product surface

## [x] - AS - Phase 2 - `Deterministic Part Ordering` - Reconstructed

Human Summary: This locked deterministic visible part ordering, making part order a stable product rule tied to pipeline/build order rather than ad hoc UI sorting.

### Phase 2 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 8` restored restart band.

It follows directly from the shift into a parts-list-first product surface.

##### Phase Summary

Current understanding:
- base parts were locked first as the default visible ordering
- future toe instances were inserted after the base parts in deterministic sequence
- visible order became a stable product rule rather than arbitrary UI sorting
- later parts were tied to declared build/pipeline order

##### Files Changed

- `src/shared/partsTypes.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

### Phase 2 CheckList

- [x] lock base parts first as the default visible ordering
- [x] insert future toe instances after the base parts in deterministic sequence
- [x] treat visible part order as a stable product rule
- [x] lock later parts to declared pipeline/build order instead of ad hoc UI order

## [?] - AS - Phase 3 - `First Parts / Artifact Baseline`

Human Summary: This is an inferred bridge phase that likely established the first stable part/artifact identity layer, turning the restart from one preview mesh into named output parts.

### Phase 3 Overview
#### Fold Hack 4

##### Phase Notes

This is an inferred gap phase from the reconstructed history band rather than a fully evidenced completed log entry.

##### Phase Summary

Current understanding:
- this likely defined the first stable part/artifact identity layer between the restart and later assembled-direction work
- this likely turned the product from one preview mesh into named output parts
- this likely gave later part-order and assembled-output work a concrete baseline

##### Files Changed

- exact file set unknown
- likely touched `src/shared/partsTypes.ts`
- likely touched `src/shared/buildTypes.ts`
- likely touched `src/worker/pipeline/artifactEmitter.ts`

### Phase 3 CheckList

- [?] define the first stable part/artifact identity layer between restart and later assembled-output work
- [?] turn the product from one preview mesh into named output parts
- [?] provide the likely baseline for later part-order and assembled-direction work

## [x] - AS - Phase 4 - `Canonical Part Identity And Assembled Direction` - Reconstructed

Human Summary: This clarified part identity as a canonical concept and strengthened the distinction between part outputs and the assembled output, moving the product away from a looser single-preview-blob model.

### Phase 4 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 9` restored restart band.

It sits directly after the earlier inferred part/artifact baseline.

##### Phase Summary

Current understanding:
- part identity was clarified as a canonical concept instead of a loose preview blob
- the distinction between part outputs and the assembled output was strengthened
- the product moved away from looser `final` wording toward assembled identity

##### Files Changed

- `src/shared/partsTypes.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/panels/PartsListPanel.tsx`

### Phase 4 CheckList

- [x] clarify part identity as a canonical product concept
- [x] strengthen the distinction between part outputs and the assembled output
- [x] move the product away from loose `final` wording toward assembled identity

## [x] - AS - Phase 5 - `Browser-Facing Graph Output Structure`

Human Summary: Completed family guidance. This phase locked and shipped the first Browser-facing publish/content structure above `OutputPreview`, establishing the honest Phase 5 `Assembly / Component / Object` content model before later build-surface work in Phase 6.

### Phase 5 Overview
#### Fold Hack 4

##### Phase Notes

This is now a completed canonical `AS` phase.

It is the main `AS` planning home after:
- `SP - Phase 10`
  - graph-aware routing and graph-owned output handoff
- `GE - Phase 12`
  - project file and first project-content ownership
- `SP - Phase 11`
  - the first honest Browser hierarchy for graph documents and thin child outputs

Current state:
- the roadmap now treats this as Lane `[2.2]`
- the vision roadmap now clarifies that `Graph Documents` and published `Content` must stay separate surfaces
- this phase answered the structure questions needed before and during the dedicated `02.2` task/spec pass
- build bars, row policy, and the full `Content` execution surface still belong mainly to `AS - Phase 6`

##### Phase Summary

Current completed understanding:
- this phase turned graph output handoff into a clearer Browser-facing content structure
- it became the family home for the first honest `Assembly / Component / Object` published-content direction
- it intentionally kept `Part`, build bars, row policy, and deeper execution truth deferred into later phases

##### Family-Level 5 Planning Questions
#### Fold Hack 5

##### Planning Notes

- Use this as the family-level lock surface for `AS - Phase 5 - Browser-Facing Graph Output Structure`.
- The goal here is to preserve the canonical family answers that now feed the active `02.2` execution spec.
- Keep this phase focused on publish/content structure:
  - authored publish contract
  - project-content hierarchy
  - source mapping / id shape
  - Browser read shape
- Do not let this section absorb the later row-policy / build-bar / execution-truth work that belongs mainly to `AS - Phase 6` and later build/runtime lanes.

##### Phase 5 Question CheckList

- [x] `AS5.Q1` - Lock the authored publish contract above the current slot-only `OutputPreview` seam
- [x] `AS5.Q2` - Lock the first-pass published hierarchy shipped into Browser `Content`
- [x] `AS5.Q3` - Lock the stable published ids and ownership split required before implementation
- [x] `AS5.Q4` - Lock the graph-to-project lift used to create project content records and Browser rows
- [x] `AS5.Q5` - Lock the source mapping / highlight / authoring-jump data that must survive the lift
- [x] `AS5.Q6` - Lock the simplifications and defers that keep Phase 5 out of Phase 6 and later runtime/build work

##### Locked Decisions So Far

- Single-object publish groups are truly object-native in Phase 5:
  - no hidden `componentId`
  - no hidden parent component record
  - `componentLabel` is ignored while the group remains singleton
- Multi-object publish groups become real grouped content only when Browser hierarchy is actually needed:
  - `1 object` -> `Assembly -> Object`
  - `2+ objects` -> `Assembly -> Component -> Object`
- If a singleton publish group later becomes multi-object:
  - the original object keeps its `objectId`
  - a new `componentId` is introduced only for the grouping layer
  - only the new sibling objects receive new `objectId` values
- `objects[]` is the canonical first-pass authored publish seam.
- `Part` remains an explicit later extension, not a Phase 5 row model.

#### [x] `AS5.Q1` - Lock the authored publish contract above the current slot-only `OutputPreview` seam

##### Why This Matters

- this is the contract question that decides whether Browser `Content` is reading authored publish truth or reconstructing structure from flat runtime artifacts
- without this answer, the implementation will drift back toward guessing hierarchy from meshes or slot rows

##### This Asks

- what node-authored metadata must live above `slots`
- how `component` and `object` structure should be declared
- how much slot compatibility must be preserved in the first pass

##### Implementation Target

- define the minimum authored publish payload above the current slot seam
- keep the current slot/runtime compatibility path intact
- make the next-layer publish structure explicit enough for Browser `Content` to stop guessing

##### Locked Answer

- Phase 5 should explicitly bless an authored publish contract of:
  - `objects[]`
  - `slots[]`
  - `nextSlotIndex`
- `componentLabel` should be ignored for singleton publish groups and should only become meaningful when a publish group has two or more objects and needs a real visible component row.
- `objects[]` should be the canonical first-pass authored publish seam rather than a hidden implementation detail.
- This should be documented as a bridge contract:
  - Phase 5 publishes `Object` as the leaf entity
  - later phases may let `Object` own `parts[]` without replacing the Phase 5 `assemblyId/componentId/objectId` structure
- If a singleton publish group later expands into a multi-object group, the original object should keep its existing `objectId` and the new component layer should be added around it rather than replacing object identity.
- Slot compatibility should stay intact in Phase 5:
  - slot rows remain the runtime/preview compatibility layer
  - Browser `Content` should stop reconstructing structure from slots directly
- Empty authored object rows may exist in authored state, but only non-empty published objects should lift into project `Content` in the first pass.

#### [x] `AS5.Q2` - Lock the first-pass published hierarchy shipped into Browser `Content`

##### Why This Matters

- this is the scope boundary for what becomes real now versus what stays deferred
- without a locked first-pass hierarchy, the phase can sprawl into premature `Part`, nested assembly, or export-driven complexity

##### This Asks

- whether first pass is truly `Assembly -> Component -> Object`
- when `Part` is allowed to become a visible first-class Browser row
- how much assembly depth the first shipped cut should own

##### Implementation Target

- lock the first honest Browser `Content` hierarchy for this phase
- keep it small enough to match the current runtime/build truth
- leave room for later `Part`, `Sub Assembly`, and other deeper structure without blocking them

##### Locked Answer

- The first shipped Browser `Content` hierarchy for Phase 5 should be conditional:
  - single published object: `Assembly -> Object`
  - multi-object publish group: `Assembly -> Component -> Object`
- `Assembly` should be a single root assembly for the project-content surface in this phase.
- `Component` should be a grouping row only when one `OutputPreview` publishes two or more objects and the Browser needs hierarchy.
- A single published object should not get a redundant visible parent `Component`.
- `Object` should be the first real published row, whether it appears directly under the root assembly or under a multi-object component.
- If a singleton later becomes multi-object, the original object should stay the same object and only gain a new parent component layer.
- `Part` should not become a first-class Browser row in Phase 5.
- Nested assemblies, sub-assemblies, and deeper output packaging should remain deferred until the runtime/build truth can support them honestly.

#### [x] `AS5.Q3` - Lock the stable published ids and ownership split required before implementation

##### Why This Matters

- the publish/content layer needs stable identity before later build/runtime truth can attach honestly
- without this answer, later row policy, revision tracking, or source mapping will end up bolted onto unstable ad hoc keys

##### This Asks

- which id families must exist now:
  - `assemblyId`
  - `componentId`
  - `objectId`
  - later `partId`
- which layer owns:
  - authored publish declarations
  - project-content records
  - later execution/runtime truth

##### Implementation Target

- lock the minimum stable id families required for Phase 5
- lock the graph-owned versus project-owned split clearly enough that Phase 6 does not have to reinterpret it later

##### Locked Answer

- Phase 5 should canonically lock these stable published id families:
  - `assemblyId`
  - `objectId`
- `componentId` should exist only for multi-object publish groups that need a real grouping entity in project content.
- `partId` should be named as a planned future id family, but it should not be required for Phase 5 implementation.
- Ownership split should be locked as:
  - graph-owned authored publish declarations in `OutputPreview` params
  - graph-owned derived publish surface after graph evaluation
  - project-owned lifted content records used by Browser `Content`
  - later runtime/execution truth owned by the later build/runtime lane rather than Phase 5 selectors
- Phase 5 should treat `assemblyId/componentId/objectId` as stable enough that later row policy, revisions, and execution truth can attach without replacing those ids.

#### [x] `AS5.Q4` - Lock the graph-to-project lift used to create project content records and Browser rows

##### Why This Matters

- this is the seam between graph publication and project composition
- without a clear lift/read model, Browser selectors and panels will end up inventing structure locally instead of reading a canonical content shape

##### This Asks

- what the graph-owned derived publish surface should look like
- what the project-owned content records should look like after lift
- which layer should derive Browser row nesting and ordering

##### Implementation Target

- define the graph-to-project lift path for:
  - `Assembly`
  - `Component`
  - `Object`
- keep Browser selectors/renderers as read layers rather than ownership layers

##### Locked Answer

- Phase 5 should lock a lift path of:
  - authored `OutputPreview` publish declarations
  - graph-owned runtime/output surface
  - graph-owned published component surface
  - project-owned content records
  - Browser read-model rows
- The graph layer should own publish derivation and filtering of publishable output entities.
- The project layer should own stable content records and ids for `Assembly`, conditional `Component`, and `Object`.
- The lift should collapse singleton publish groups:
  - one published object lifts directly under the root assembly
  - two or more published objects from one authored publish group lift under a component row
- If one graph document has multiple separate singleton publish groups, each singleton should lift as its own direct object row under the root assembly with no extra graph-document grouping row added on top.
- Browser selectors should derive read shape, nesting, and ordering from project-owned content records rather than inventing ownership locally.
- The Browser tree should remain a read surface over project content, not a second content-model authority.

#### [x] `AS5.Q5` - Lock the source mapping / highlight / authoring-jump data that must survive the lift

##### Why This Matters

- Browser `Content` still needs a truthful relationship back to graph authorship even while staying separate from `Graph Documents`
- without explicit carry-forward source data, later reveal/highlight/`view in graph` behavior will rely on weak label matching or hidden UI assumptions

##### This Asks

- what source graph/node ids must survive publication
- what viewer/highlight keys must survive the lift
- what minimum source mapping Browser rows need for later reveal or authoring-jump behavior

##### Implementation Target

- lock the source-trace fields that must travel with lifted published entities
- keep those fields quiet in the row language while still making future interactions possible

##### Locked Answer

- Phase 5 should preserve at least:
  - `sourceGraphDocumentId`
  - `sourceNodeId`
  - `sourceOutputEntryId`
  - `slotId`
- Browser content rows should carry enough source data for:
  - viewer highlight
  - reveal
  - later `view in graph`
  - later right-click authoring jumps
- Phase 5 should explicitly accept viewer/highlight identity remaining slot-based where that is how the current preview pipeline works.
- The doc should call out slot-based highlight identity as an accepted Phase 5 limitation rather than pretending object/entity-native highlight truth already exists.
- These fields should remain structural metadata, not noisy primary row language.

#### [x] `AS5.Q6` - Lock the simplifications and defers that keep Phase 5 out of Phase 6 and later runtime/build work

##### Why This Matters

- this phase is close to both `AS - Phase 6` and the later build/runtime contract lane
- without an explicit defer list, the first Phase 5 implementation will keep trying to solve row policy, bars, `Part` chunk truth, or graph-native worker-contract questions too early

##### This Asks

- what Phase 5 should intentionally not own yet
- what remains the responsibility of:
  - `AS - Phase 6`
  - later build/runtime work
  - later Browser/viewer control work

##### Implementation Target

- keep explicit defers visible for:
  - full `Part` rows
  - row policy and build bars
  - execution truth and revisions
  - nested assembly management
  - materials/visibility controls
  - graph-native worker contract replacement

##### Locked Answer

- Phase 5 should explicitly not own:
  - full `Part` rows and `partId` runtime truth
  - `SEQ / ALL` execution policy
  - final row policy modes such as `Live / Release / Manual`
  - truthful lower-level build bars and revision truth
  - nested assembly management
  - materials and richer visibility control surfaces
  - graph-native worker-contract replacement
- Phase 5 should allow only the first honest content structure and the minimum source-trace carry-forward needed to support later Browser interactions.
- Receive-link content should follow the same visible singleton-collapse rule on the Browser `Content` surface immediately, even if its internal implementation remains lighter until later work.
- `AS - Phase 6` should remain the phase that turns `Content` into the first real build-surface layer.
- Later build/runtime phases should remain responsible for execution truth, chunk truth, revisions, and deeper `Part` honesty.

### Phase 5 CheckList

- [x] define the first authored publish contract above `OutputPreview`
- [x] define the first-pass published hierarchy for Browser `Content`
- [x] lock the stable published ids and graph-owned versus project-owned split
- [x] define the graph-to-project lift shape used by Browser selectors and rows
- [x] preserve enough source mapping for later reveal/highlight/authoring-jump behavior
- [x] keep full `Part` rows, row policy/build bars, runtime execution truth, and nested assembly management out of this phase

## [x] - AS - Phase 6 - `Project Content Inspection And Build Control Surface`

Human Summary: Completed family guidance. This phase locked and shipped the first honest `Content` inspection/build-control layer after `02.2`, turning published `Assembly`, `Component`, and `Object` rows into real Browser build/policy targets while keeping `Graph Documents` simple and document-oriented.

### Phase 6 Overview
#### Fold Hack 4

##### Phase Notes

This is now a completed canonical `AS` phase.

It is the main `AS` planning home after:
- `AS - Phase 5`
  - Browser-facing graph output structure and the first honest published-content hierarchy
- Lane `[2.3]`
  - published content row meaning, build-state presentation, and policy-versus-view separation
- later Lane `[4]`
  - deeper runtime/build truth that should not be prematurely absorbed here

##### Phase Summary

Current completed understanding:
- this phase exposed published `Content` as the first honest project-content inspection and build-oriented Browser surface
- it became the family home for the first real assembly/component/object build bars, build-status rows, calmer content-row interaction rules, and inline policy chips
- it kept `Graph Documents` as the authoring/document surface while `Content` became the published-entity build/policy surface
- it kept build-control UI separate from visibility/material/view-control UI
- it intentionally stopped short of deeper runtime/build truths that still belong to later lanes

##### Family-Level 6 Planning Questions
#### Fold Hack 5

##### Planning Notes

- Use this as the family-level lock surface for `AS - Phase 6 - Project Content Inspection And Build Control Surface`.
- The goal here is to preserve the canonical family answers that fed the completed `02.3` execution spec and now explain the shipped Phase 6 behavior.
- Keep this phase focused on published `Content` row meaning:
  - content row interaction
  - build-state presentation
  - graph-vs-content separation
  - source-trace secondary actions
  - policy-versus-view control separation
- Do not let this section absorb:
  - full `Part` rows
  - final revision truth
  - later `SEQ / ALL`
  - deeper runtime/build chunk truth from later build/runtime lanes

##### Phase 6 Question CheckList

- [x] `AS6.Q1` - Lock what row click and primary interaction should mean on published `Content`
- [x] `AS6.Q2` - Lock how `Graph Documents` versus published `Content` should read and behave as separate Browser surfaces
- [x] `AS6.Q3` - Lock where graph/source traceability should live once `Content` rows stop reading like graph rows
- [x] `AS6.Q4` - Lock the first build/loading state presentation for `Assembly`, `Component`, and `Object`
- [x] `AS6.Q5` - Lock the first policy-versus-view-control separation for published `Content`
- [x] `AS6.Q6` - Lock the explicit defers that keep Phase 6 out of later runtime/build-truth lanes

#### [x] `AS6.Q1` - Lock what row click and primary interaction should mean on published `Content`

##### Why This Matters

- once `Content` stops reading like a second graph list, row click can no longer inherit graph-row behavior by accident
- without a locked answer, the Browser will drift between selection-only rows and implicit rebuild buttons

##### This Asks

- whether row click means:
  - rebuild that published row/branch
  - selection only
  - mixed behavior with explicit modifiers or secondary actions
- how much row interaction should be primary versus hidden in menus

##### Implementation Target

- define the first calm but honest row interaction rule for published `Content`
- keep rebuild/build interaction truthful without making the Browser row language noisy

##### Locked Answer

- In Phase 6, primary row click on published `Content` should mean:
  - rebuild that published row scope
- This applies to published `Content` rows:
  - `Assembly`
  - `Component`
  - `Object`
- This does not redefine graph-document row click behavior.
- Parent-row rebuild should still be selective:
  - clicking an `Assembly` should target the assembly scope
  - but the system should rebuild only the descendant content that actually needs rebuild work
  - content that is already up to date should not be rebuilt just because the parent row was clicked
- The interaction goal is:
  - row click stays meaningful and direct
  - rebuild scope follows the clicked published entity
  - execution still respects truthful incremental rebuild rules instead of forcing blanket rebuilds

#### [x] `AS6.Q2` - Lock how `Graph Documents` versus published `Content` should read and behave as separate Browser surfaces

##### Why This Matters

- `02.2` made `Content` structurally honest, but `02.3` has to make the two Browser surfaces feel different in meaning
- without a clear separation, graph-document save/export/readiness state and published-content build state will collapse back together

##### This Asks

- what belongs on graph rows versus content rows
- how each surface should read in primary label, secondary text, and status treatment
- how to keep authored-document behavior separate from published-entity behavior

##### Implementation Target

- lock the Browser reading model where:
  - `Graph Documents` = authoring/document surface
  - `Content` = published build/policy surface

##### Locked Answer

- In Phase 6, `Graph Documents` should stay intentionally simple.
- `Graph Documents` should read as the authored/document surface:
  - graph identity
  - open/focus/save/export oriented behavior
  - calm document-level state only
- `Graph Documents` should not become the main published build-control surface in this phase:
  - no full published-content rebuild stack there
  - no per-published-row loading bars there
  - no attempt to make graph rows and content rows do the same job
- Published `Content` should read as the build/policy surface:
  - published entity identity
  - rebuild interaction
  - build/loading status
  - later policy controls
- If `Graph Documents` later grows into a Browser list of all nodes in the canvas, that should be treated as later work:
  - not required for Phase 6
  - not a reason to blur graph-document rows with published-content rows now

##### Post-Phase-6 Entry

- The locked `AS6.Q2` answer above stays unchanged as the canonical Phase 6 answer.
- The following note is later carry-forward discovered after the shipped `02.3` cut:
  - `Needs Rebuild`
    - first child section under a graph document
    - normally open
    - shows only produced published objects/outputs that currently need rebuild
    - rows disappear once rebuilt and clean
    - do not show empty/non-producing rows such as `s002`
  - `Nodes`
    - second child section under a graph document
    - normally closed
    - acts as the authored node inventory for the canvas
- This should be treated as later carry-forward:
  - not a reason to reinterpret the completed Phase 6 rule that `Graph Documents` stayed intentionally simple in the first shipped `Content` build/control pass
  - but it is the preferred later expansion shape instead of keeping one mixed list of authored output entries

#### [x] `AS6.Q3` - Lock where graph/source traceability should live once `Content` rows stop reading like graph rows

##### Why This Matters

- published `Content` still needs truthful traceability back to graph authorship
- but if source details stay in the main row face, `Content` will keep reading like graph metadata instead of project content

##### This Asks

- where `view in graph`, right-click authoring jumps, and source traceability should live
- what source info can remain visible quietly versus what should move to secondary actions

##### Implementation Target

- keep source traceability available for reveal/highlight/authoring jumps
- move graph/source emphasis out of the primary row language when possible

##### Locked Answer

- In Phase 6, graph/source traceability should remain available on published `Content`, but it should move into secondary actions rather than defining the main row face.
- Primary `Content` row language should stay about the published entity:
  - `Assembly`
  - `Component`
  - `Object`
- Graph/source traceability should live in:
  - `View In Graph`
  - right-click/context actions
  - reveal/highlight behavior
  - row metadata carried for later authoring jumps
- Source mapping should still survive with the row internally, but graph names, node ids, and slot ids should not dominate the visible row identity unless temporary disambiguation is truly needed.
- The main reading rule should be:
  - primary row = what published thing is this
  - secondary action = where did this come from in authoring

#### [x] `AS6.Q4` - Lock the first build/loading state presentation for `Assembly`, `Component`, and `Object`

##### Why This Matters

- this is the first phase where published `Content` should start reading like a build/inspection surface rather than only a structure tree
- without a locked presentation rule, Browser bars and status text will sprawl inconsistently across row types

##### This Asks

- how build/loading state should appear for:
  - `Assembly`
  - `Component`
  - `Object`
- how strong the visual treatment should be on each row type

##### Implementation Target

- make `Assembly`, `Component`, and `Object` all real build/loading rows in Phase 6
- leave room for later `Part` truth to extend `Object` rather than replacing it

##### Locked Answer

- In Phase 6, `Assembly`, `Component`, and `Object` should all be treated as real build/loading rows.
- `Object` should not stay artificially light just because `Part` may arrive later.
- Later `Part` truth should extend `Object`, not replace it.
- The first visual hierarchy should still allow:
  - `Assembly` to read as the top aggregate row
  - `Component` to read as grouped branch rows
  - `Object` to read as a real build target row
- The important rule is:
  - make `Object` real now
  - add deeper `Part` detail later

#### [x] `AS6.Q5` - Lock the first policy-versus-view-control separation for published `Content`

##### Why This Matters

- build policy and visibility/material controls are easy to mix if the separation is not locked early
- without this answer, later Browser rows will blur execution controls with view toggles

##### This Asks

- where build/generate on-off belongs versus view/show on-off
- whether policy defaults to `Live` on load
- how mixed child policy state should read in the first pass

##### Implementation Target

- lock the first rule that build/policy controls stay separate from viewer/material/presentation controls
- leave room for later parent-driven policy, mixed child state, and deeper execution modes

##### Locked Answer

- In Phase 6, build/policy controls should stay separate from view controls on published `Content`.
- Build/policy controls are things like:
  - `Live`
  - later `Release`
  - later `Manual`
- View controls are different:
  - show/hide
  - isolate
  - later materials/visibility behavior
- `generate/build on-off` should not be merged with `view on-off`.
- Published `Content` should default to `Live` on load in the first pass.
- Mixed child policy state may be added later, but it should extend the policy surface rather than blur policy and view behavior together.

#### [x] `AS6.Q6` - Lock the explicit defers that keep Phase 6 out of later runtime/build-truth lanes

##### Why This Matters

- this phase is very close to the later runtime/build-truth lane
- without an explicit defer list, `02.3` will try to solve revisions, chunk truth, and deeper execution state too early

##### This Asks

- what must remain deferred to later work:
  - revisions
  - later `SEQ / ALL`
  - full `Part` truth
  - deeper worker/runtime truth

##### Implementation Target

- keep the first content-row build surface honest but intentionally limited
- preserve a clean handoff into the later build/runtime lane instead of pretending those truths are already solved

##### Locked Answer

- Phase 6 should stop at the first honest `Content` build/control surface.
- Phase 6 should own:
  - real `Content` row meaning
  - row click = rebuild scope
  - first build/loading bars and status
  - first policy-versus-view separation
  - `Assembly`, `Component`, and `Object` as real published build rows
- Phase 6 should explicitly not own:
  - full `Part` row truth
  - revisions/history truth
  - later `SEQ / ALL`
  - deeper worker/runtime chunk truth
  - graph-native worker-contract replacement
  - nested assembly/package systems
  - richer materials, visibility, and reference workspace behavior
- The important handoff rule is:
  - Phase 6 should make `Content` honest
  - later lanes should make the deeper runtime final

### Phase 6 CheckList

- [x] define the target published-content inspection surface
- [x] define what row click and primary interaction mean on `Content`
- [x] define how `Graph Documents` and `Content` read as separate Browser surfaces
- [x] define where Browser row build bars and build-status rows belong for `Assembly`, `Component`, and `Object`
- [x] keep build/generate controls separate from view/visibility controls
- [x] move source traceability into calmer secondary actions without losing reveal/highlight/authoring-jump behavior
- [x] leave room for later row actions such as isolate, rename, export, and deeper item actions
- [x] keep revisions, later `SEQ / ALL`, full `Part` truth, and deeper runtime/build truth out of this phase

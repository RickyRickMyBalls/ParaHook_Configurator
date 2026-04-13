# Cleanup Phase Cleanup-8A - Feature-Stack And Graph-Native CAD Contract Convergence

## Doc Header

### Doc History
14. 2026-04-13 12:40:33: Closed out this standalone `Cleanup 8A` phase doc as a shipped cleanup lane after the convergence-boundary baseline, hybrid-contract inventory, shared-core rule, family-local boundary lock, narrow Geometry seam proof, and final proof-plus-handoff closeout all landed, so the authored-contract lane now lives under `Cleanup/Shipped/` instead of remaining in `Cleanup/Future/`
13. 2026-04-13 12:38:04: Completed `Phase 6 - Proof, Cleanup, And Later Family Handoff` as a proof-and-doc-closeout pass by re-reading the landed `Phase 5` Geometry family seam against `Cleanup-Vision.md` and `Cleanup-Index.md`, confirming the shared-core versus family-local versus adapter split still holds, locking the remaining compatibility-shim, later-consumer, later-family, and packaging-only follow-on buckets without starting them, and closing `Cleanup 8A` with one explicit authored-contract rule plus a narrow later-family handoff
12. 2026-04-13 12:27:26: Tightened `Phase 6 - Proof, Cleanup, And Later Family Handoff` into an implementation-ready proof-and-doc-closeout pass by grounding it in the landed `Phase 5` Geometry family contract seam, locking the expected re-read against `Cleanup-Vision.md` and `Cleanup-Index.md`, making the residual follow-on buckets explicit around remaining shim retirement, later direct-consumer repoints, and later family-local candidate seams, and preserving the stop rule so this closeout does not widen into a second convergence implementation lane
11. 2026-04-13 12:24:11: Completed `Phase 5 - Prove The Contract With One Narrow Convergence Slice` by extracting the graph-native sketch-to-extrude profile contract seam into `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`, reducing the older flat `features/` seam helpers to explicit compatibility re-exports, repointing `src/app/spaghetti/registry/nodeRegistry.ts` plus `src/app/spaghetti/selectors/selectNodeVm.ts` to the new family-local contract band, and verifying the locked proof surface with the targeted registry, selector, compile-feature-stack, and effective-ports tests plus a green build
10. 2026-04-13 12:08:36: Tightened `Phase 5 - Prove The Contract With One Narrow Convergence Slice` into an implementation-ready code-and-verification pass by grounding it in the completed `Phase 4` family-local boundary, narrowing the first proof to the sketch-to-extrude profile contract seam across the sketch/extrude virtual-port helpers plus the supporting `Geometry/Sketch` and `Geometry/Extrude` helper band in `nodeRegistry.ts`, and naming `nodeRegistry.ts`, `selectNodeVm.ts`, `FeatureStackView.tsx`, and `ExtrudeFeatureView.tsx` as the smallest honest consumer repoint set with focused proof anchored in the existing registry and selector test surfaces
9. 2026-04-13 12:06:07: Completed `Phase 4 - Lock The Family-Local Contract Boundary` as a docs-and-verification pass by turning the completed `Phase 3` rule into one explicit first family-local boundary around the graph-native sketch-to-extrude profile contract seam, locking the virtual-port helpers plus the supporting `Geometry/Sketch` and `Geometry/Extrude` helper band in `nodeRegistry.ts` as the first family-local target set, preserving `featureTypes.ts`, `featureSchema.ts`, and `compileFeatureStack.ts` as the shared core, and naming `nodeRegistry.ts`, `selectNodeVm.ts`, `FeatureStackView.tsx`, and `ExtrudeFeatureView.tsx` as the smallest honest downstream consumer band for the later proof pass
8. 2026-04-13 11:59:55: Tightened `Phase 4 - Lock The Family-Local Contract Boundary` into an implementation-ready docs-and-verification pass by grounding it in the completed `Phase 3` shared-core rule, narrowing the first proof slice to the graph-native sketch-to-extrude profile contract seam across `sketchProfileVirtualPorts.ts`, `extrudeProfileConnections.ts`, `extrudeProfileEntryPorts.ts`, `extrudeBodyVirtualPorts.ts`, and the supporting sketch/extrude helper band in `nodeRegistry.ts`, and naming the smallest honest compile plus selector/view consumers that the later proof pass may repoint without widening into a full family migration
7. 2026-04-13 11:26:51: Completed `Phase 3 - Lock The Shared Authored-Contract Rule` as a docs-and-verification pass by turning the `Phase 2` inventory into one explicit shared-core rule centered on stable profile/reference identity, shared sketch/extrude authored field shapes, schema normalization, and generic compile/lowering in `featureTypes.ts`, `featureSchema.ts`, and `compileFeatureStack.ts`, while explicitly excluding graph-native port and managed-param helpers plus legacy compatibility residue from the shared target set and locking the sketch-to-extrude profile contract seam as the first `Phase 4` boundary proof
6. 2026-04-13 11:18:59: Tightened `Phase 3 - Lock The Shared Authored-Contract Rule` into an implementation-ready docs-and-verification pass by grounding it in the completed `Phase 2` inventory, narrowing the shared-rule decision onto the stable profile/reference/lowering core in `featureTypes.ts`, `featureSchema.ts`, and `compileFeatureStack.ts`, explicitly excluding graph-native sketch/extrude bridge helpers plus legacy compatibility residue from the shared target set, and locking the sketch-to-extrude profile seam as the downstream `Phase 4` proof target
5. 2026-04-13 11:15:04: Completed `Phase 2 - Inventory Hybrid CAD Contract Drift` as a docs-and-verification pass by classifying the live shared authored-contract seams, the graph-native sketch/extrude bridge helpers, the mixed selector and feature-stack view surfaces, and the still-live part-template `featureStack` carryover into explicit shared-vocabulary, family-local-candidate, adapter-only, and legacy-residue buckets while locking the first `Phase 3` and `Phase 4` convergence targets around the sketch-to-extrude profile contract seam
4. 2026-04-13 11:12:07: Tightened `Phase 2 - Inventory Hybrid CAD Contract Drift` into an implementation-ready docs-and-verification pass by grounding it in the live shared authored-contract seams in `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts`, the still-hybrid part-node versus graph-native registry split in `nodeRegistry.ts`, the graph-native sketch/extrude profile-port helpers, and the mixed selector plus feature-stack view surfaces so the next pass can classify real contract drift before `Phase 3` locks the shared authored-contract rule
3. 2026-04-13 10:52:49: Completed `Phase 1 - Reconfirm Convergence Boundary After Cleanup 8` as a docs-and-verification pass by re-reading the cleanup and repo vision rules against the shipped `Cleanup 7` owner baseline and the shipped `Cleanup 8` packaging proof, then locking one explicit authored-contract boundary where graph-native node params, wiring, outputs, and graph-local CAD sessions remain canonical in spaghetti store ownership surfaces while shared feature-stack seams stay shared only when they are honestly cross-family and current part-template `featureStack` paths are treated as legacy-leaning carryover unless the later inventory proves otherwise
2. 2026-04-13 10:41:13: Tightened `Phase 1 - Reconfirm Convergence Boundary After Cleanup 8` into an implementation-ready docs-and-verification pass by grounding the first authored-contract boundary read in the live shared feature-stack seams in `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts`, the still-live part-node `featureStack` params in `nodeRegistry.ts`, the graph-native `Geometry/Sketch` managed-feature seam, and the mixed selector/view surfaces in `selectNodeVm.ts`, `FeatureStackView.tsx`, `SketchFeatureView.tsx`, and `ExtrudeFeatureView.tsx`, while making the packaging-follow-on versus authored-contract-convergence boundary explicit before the inventory phase starts
1. 2026-04-13 10:32:51: Created this standalone future phase doc for `Cleanup 8A` to hold the authored-contract convergence lane after shipped `Cleanup 8`, grounding it in the proven CAD packaging baseline, the remaining shared contract seams in `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts`, and the still-hybrid `Sketch` and `Extrude` family surfaces that need one clearer contract model before later graph-native CAD families expand

### Purpose

This doc defines the `Cleanup 8A` follow-on phase for the `Cleanup` family.

Use it to answer:
- how feature-stack CAD contracts and graph-native CAD node contracts should relate after `Cleanup 8`
- which authored fields, ports, outputs, and lowering seams should stay shared versus family-local
- where `Sketch` and `Extrude` still behave like hybrid families across feature-stack and graph-native seams
- how to prove one convergence rule without reopening the packaging-only work that belonged to `Cleanup 8`

Do not use it for:
- reopening the node-owned authoring baseline already locked by `Cleanup 7`
- re-running the packaging-only `OutputPreview` or sketch command-library follow-ons that still belong to `Cleanup 8`
- broad Browser, Console, or workspace cleanup outside the CAD authored-contract seam
- a full worker/runtime geometry execution redesign

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - cleanup family scan surface
  - lane ordering after shipped `Cleanup 8`

- `../Cleanup-Vision.md`
  - cleanup framing for ownership drift, hybrid surfaces, and repo-shape honesty

- `../Canonical-Ownership-Targets.md`
  - owner baseline this lane must preserve while reconciling authored contracts

- `../Canonical-Owner-Decisions.md`
  - one-real-owner rules this lane must not reopen

- `../Shipped/Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`
  - locked node-owned CAD authoring truth and adapter boundary

- `../Shipped/Cleanup_Phase Cleanup-8 - CAD Node Family Packaging And Command Library Extraction.md`
  - proven family-root and command-library packaging baseline plus explicit `Cleanup 8A` handoff

- `../../Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Vision.md`
  - longer-range node-family direction and graph-native CAD growth

- `../../../../Vision.md`
  - repo-level `What Must Stay True` summary

- `../../../roadmap/Vision-roadmap.md`
  - canonical north star for graph-native CAD and explicit downstream geometry/output contracts

## Doc Body

## [x] Cleanup 8A - Feature-Stack And Graph-Native CAD Contract Convergence

### Header

Purpose:
- define one explicit authored-contract relationship between feature-stack CAD helpers and graph-native CAD node families now that `Cleanup 8` proved the packaging baseline

Owns:
- feature-stack versus graph-native CAD authored-contract convergence
- shared versus family-local authored field, port, and output vocabulary
- the contract boundary for current hybrid families such as `Sketch` and `Extrude`
- one narrow proof slice that validates the chosen convergence rule without widening back into packaging cleanup

Does not own:
- the node-owned CAD truth baseline already locked in `Cleanup 7`
- packaging-only follow-ons still reserved for `Cleanup 8`
- worker execution ownership or accepted-result ownership already handled by earlier cleanup lanes
- broad Browser, Console, viewer, or workspace cleanup outside the CAD authored-contract seam

### Why This Phase Exists

`Cleanup 8` solved the repo-shape problem first:
- one family-root seed now exists under `src/app/spaghetti/families/OutputPreview/system/`
- one shared sketch command-library seed now exists under `src/app/spaghetti/sketchCommands/drawCommands.ts`
- packaging-only follow-ons are now separate from the deeper authored-contract questions

That means the next problem is no longer "where should this file live?"

The next problem is contract shape.

Current CAD families still read as partially hybrid across:
- graph-native node definitions and node params
- feature-stack schema and feature-stack helper contracts
- lowering and compile seams
- UI and selector surfaces that still bridge both models

Without a convergence lane:
- each later CAD family will keep re-deciding whether it is feature-stack owned, graph-node owned, or an inconsistent mix
- `Sketch` and `Extrude` will keep carrying partly duplicated or loosely-coupled authored vocabulary
- later packaging passes will keep hitting the same contract ambiguity instead of finishing the harder cleanup question

This phase exists so we can:
1. lock the convergence boundary after the shipped packaging proof,
2. inventory the live hybrid contract seams,
3. define one explicit shared-versus-family-local authored-contract rule,
4. prove that rule with one narrow real family slice,
5. then hand later family growth forward from a cleaner authored baseline.

### Scope

This phase covers:
- authored-contract convergence between feature-stack CAD helpers and graph-native node families
- shared versus family-local ownership for authored fields, ports, outputs, and lowering helpers
- current hybrid family seams, especially `Sketch` and `Extrude`
- one narrow proof slice that validates the chosen convergence rule in live code

This phase does not cover:
- packaging-only import retirement from `Cleanup 8`
- generic command-library adoption work that does not require authored-contract decisions
- broad feature-family migration for every CAD family in one pass
- worker/runtime execution redesign
- viewer-only or Browser-only cleanup

### Current Read

The repo now has a proven CAD packaging baseline, but the authored-contract layer still crosses multiple partially-overlapping homes.

- `src/app/spaghetti/features/featureSchema.ts`
  - still acts as one of the clearest authored-contract surfaces
  - currently mixes shared feature-stack vocabulary with families that now also exist as graph-native node families

- `src/app/spaghetti/features/featureTypes.ts`
  - still carries feature-stack authored shapes that later graph-native family work has to mentally reconcile

- `src/app/spaghetti/features/compileFeatureStack.ts`
  - remains one of the main shared lowering seams where authored feature meaning becomes executable graph/runtime meaning

- `src/app/spaghetti/registry/nodeRegistry.ts`
  - now reads more honestly as shared registry plumbing after `Cleanup 8`
  - still exposes where node-family contracts and shared authored helpers overlap

- `src/app/spaghetti/features/`
  - still contains family-adjacent authored helpers that are neither purely generic nor cleanly family-local
  - strongest current live examples remain around `Sketch` and `Extrude`

- `src/app/spaghetti/ui/features/`
  - still shows the older feature-stack-facing family read model
  - current examples:
    - `SketchFeatureView.tsx`
    - `ExtrudeFeatureView.tsx`
    - `CloseProfileFeatureView.tsx`
    - `profilePreview.tsx`

- `src/app/spaghetti/canvas/NodeView.tsx`
  - remains a downstream adapter surface
  - still exposes where graph-native node presentation and feature-stack vocabulary have not fully converged

- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - still acts as one of the strongest read seams where graph-native node data, feature-stack interpretation, and family UI shaping meet

### Locked Direction

- `Cleanup 8A` converges authored contracts after the shipped `Cleanup 8` packaging proof; it does not reopen packaging as the main question
- `Cleanup 8A` must preserve the `Cleanup 7` node-owned authoring baseline:
  - node params, wiring, outputs, graph documents, and graph-local CAD sessions stay canonical in spaghetti store ownership surfaces
- shared authored vocabulary should remain shared only when it is truly cross-family and stable
- family-local authored vocabulary should move toward family-owned contracts when it exists only to support one graph-native CAD family
- selectors, views, and node surfaces should stay downstream adapters over the chosen authored-contract model rather than becoming quiet second owners
- this lane should prove one narrow convergence rule before expanding to later CAD families

### Authored-Contract Baseline

The working default for this lane is:
- preserve one explicit split between:
  - truly shared authored CAD contract surfaces
  - family-local authored CAD contract surfaces
  - adapter-only read or interaction surfaces

Shared authored CAD contract surfaces may own:
- stable cross-family authored vocabulary
- stable shared field shapes that multiple CAD families genuinely use
- lowering helpers that are still honestly shared after a real family audit

Family-local CAD contract surfaces should own:
- family-specific authored fields
- family-specific port and output identity
- family-specific defaults and lowering shims
- family-specific UI shaping that only exists because one family has special authored semantics

Adapter-only surfaces should not own:
- canonical authored field identity
- long-term family contract meaning
- duplicate lowering vocabulary

### Phase Ladder

## [x] Phase 1 - Reconfirm Convergence Boundary After Cleanup 8

Purpose:
- lock one explicit baseline that says `Cleanup 8A` is an authored-contract convergence lane downstream from the shipped `Cleanup 8` packaging baseline

Read:
- `Phase 1` should stay a docs-and-verification pass

Current read:
- the strongest still-shared authored-contract seams are:
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
- the strongest live hybrid examples are:
  - part-template and proof nodes that still carry `params.featureStack` in `src/app/spaghetti/registry/nodeRegistry.ts`
  - graph-native `Geometry/Sketch` params that already carry a managed `sketch` feature shape in `src/app/spaghetti/registry/nodeRegistry.ts`
  - mixed read/presentation surfaces in:
    - `src/app/spaghetti/selectors/selectNodeVm.ts`
    - `src/app/spaghetti/ui/FeatureStackView.tsx`
    - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
    - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- shipped `Cleanup 8` already separated packaging-only follow-ons from the deeper contract problem:
  - `OutputPreview` import retirement
  - later family packaging for `Sketch` and `Extrude`
  - later command-library adoption into `stagedNavigation.ts` and `NodeView.tsx`
- that means `Phase 1` should explicitly answer the harder next question:
  - which live CAD contract seams are truly shared authored vocabulary
  - which are legacy-leaning part-template carryover
  - which already belong to graph-native family ownership but still read through older feature-stack surfaces

Locked in-scope:
- re-read the shipped `Cleanup 7` and `Cleanup 8` boundaries
- make explicit what belongs to `Cleanup 8A` versus what remains a packaging-only follow-on
- identify the main hybrid authored-contract hotspots for `Phase 2`

Locked out-of-scope:
- code movement
- contract rewrites
- family migration
- packaging-only import retirement

Strongest live repo seams:
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-8 - CAD Node Family Packaging And Command Library Extraction.md`

Implementation spec:
1. Re-read the cleanup family direction and repo vision rules that should keep authored truth explicit and downstream outputs derived.
2. Re-read the shipped `Cleanup 7` and `Cleanup 8` records.
3. Re-scan the live hybrid authored-contract seams listed above.
4. Write one explicit boundary baseline that answers:
   - what still belongs to the canonical owner surfaces
   - what this lane can reconcile safely as authored-contract work
   - what remains packaging-only and should stay reserved for later `Cleanup 8` follow-ons
   - which feature-stack-facing seams are honestly shared versus legacy-leaning carryover versus already-graph-native family meaning
   - what should carry forward as the main `Phase 2` contract-drift inventory targets
5. Stop once the hotspot inventory can be written against a locked convergence boundary.

Stop rule:
- do not widen this into code movement or folder creation

Checklist:
- [x] re-read cleanup family and repo vision rules
- [x] re-read shipped `Cleanup 7` and `Cleanup 8` boundaries
- [x] scan live authored-contract seams
- [x] write one explicit convergence boundary baseline
- [x] identify the main `Phase 2` hotspot seams
- [x] stop before code edits

Verification:
- manually confirm the canonical owner surfaces from `Cleanup 7` still hold in source
- manually confirm the packaging-only follow-ons recorded in shipped `Cleanup 8` remain packaging-only rather than authored-contract work
- manually confirm the current shared feature-stack seams and mixed selector/view seams still match the current read above

Convergence boundary baseline:
- inherited owner baseline from `Cleanup 7`:
  - `src/app/spaghetti/store/useSpaghettiStore.ts` remains the canonical owner for graph documents, node params, node wiring, node outputs, graph-local CAD sessions, and graph-local accepted/runtime state
  - `src/app/spaghetti/canvas/NodeView.tsx`, `src/app/components/ViewportOverlay.tsx`, and `src/app/console/useConsoleInteraction.ts` remain adapter surfaces over canonical graph/session truth rather than authored-contract owners
- inherited packaging baseline from `Cleanup 8`:
  - packaging-only follow-ons such as `OutputPreview` shim retirement, later `Sketch` and `Extrude` family-folder packaging, and later command-library adoption into `stagedNavigation.ts` and `NodeView.tsx` remain outside `Cleanup 8A`
  - `Cleanup 8A` is not the lane for deciding where files live; it is the lane for deciding what authored contract meaning should stay shared versus family-local
- what `Cleanup 8A` may reconcile safely:
  - shared authored vocabulary currently centralized in `src/app/spaghetti/features/featureSchema.ts`, `src/app/spaghetti/features/featureTypes.ts`, and `src/app/spaghetti/features/compileFeatureStack.ts`
  - the relationship between part-node `params.featureStack` authoring and graph-native node params such as `Geometry/Sketch` `params.sketch`
  - mixed selector and feature-view read surfaces that still interpret both feature-stack and graph-native family meaning
- what `Cleanup 8A` must not treat as authored-contract convergence:
  - repo-shape migration by itself
  - compatibility-import retirement by itself
  - generic command-library extraction by itself
  - worker/request/result ownership decisions already handled by earlier cleanup lanes
- working convergence direction:
  - graph-native node params, ports, outputs, and graph-local sessions remain canonical in spaghetti store ownership surfaces
  - shared feature-stack seams should stay shared only when they represent stable cross-family authored vocabulary that multiple graph-native families still honestly need
  - current part-template `featureStack` paths tied to `Part/Baseplate`, `Part/ToeHook`, `Part/HeelKick`, `Part/Cube`, and similar product-specific or proof nodes are now treated as legacy-leaning carryover unless the later inventory proves a seam is honestly shared
  - graph-native family meaning such as `Geometry/Sketch` managed sketch params should not be forced back behind part-template feature-stack wrappers just because older feature-stack helpers still exist

Implementation result:
- `Cleanup 8A` is now explicitly locked as an authored-contract convergence lane downstream from the shipped `Cleanup 8` packaging baseline rather than as a second packaging pass.
- The main `Phase 2` inventory targets are now explicit:
  - shared authored-contract seams in `src/app/spaghetti/features/featureSchema.ts`, `src/app/spaghetti/features/featureTypes.ts`, and `src/app/spaghetti/features/compileFeatureStack.ts`
  - the still-live hybrid contract seam in `src/app/spaghetti/registry/nodeRegistry.ts` where part-node `featureStack` params and graph-native `Geometry/Sketch` managed feature params coexist
  - mixed read and presentation surfaces in `src/app/spaghetti/selectors/selectNodeVm.ts`, `src/app/spaghetti/ui/FeatureStackView.tsx`, `src/app/spaghetti/ui/features/SketchFeatureView.tsx`, and `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- The first inventory rule is now explicit:
  - classify each seam as honestly shared authored vocabulary, legacy-leaning part-template carryover, or already-graph-native family meaning before any code convergence pass starts

## [x] Phase 2 - Inventory Hybrid CAD Contract Drift

Purpose:
- classify the live authored-contract drift between shared feature-stack helpers and graph-native family contracts before any convergence pass starts moving code

Read:
- `Phase 2` should still be a docs-and-verification pass

Locked in-scope:
- classify the shared authored-contract seams that still define sketch, close-profile, and extrude vocabulary for both part-template and graph-native reads
- classify the graph-native bridge seams where `Geometry/Sketch` and `Geometry/Extrude` still depend on shared feature-stack-shaped helpers
- classify the selector and feature-stack view surfaces that still reinterpret authored meaning downstream
- name the clearest first `Phase 3` shared-rule candidates and the clearest first `Phase 4` family-local proof slice

Locked out-of-scope:
- code movement
- contract rewrites
- family packaging follow-ons that still belong to `Cleanup 8`
- broad migration of `Sketch` and `Extrude` in the same pass

Current read:
- `src/app/spaghetti/features/featureSchema.ts`
  - still defines the shared authored shapes for `sketch`, `closeProfile`, and `extrude`
  - still carries legacy compatibility transforms such as sketch `entities`, optional `profileIndex`, and defaulted output/profile normalization
- `src/app/spaghetti/features/featureTypes.ts`
  - still acts as the main shared authored vocabulary surface for `ProfileOutput`, `ProfileReference`, `CloseProfileOutputRef`, `SketchFeature`, and `ExtrudeFeature`
  - still mixes honest shared profile semantics with family-specific sketch and extrude meaning plus legacy compatibility notes
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - still lowers shared stack-authored `Sketch`, `Close Profile`, and `Extrude` meaning directly into geometry-request IR
  - still reconciles legacy profile ids and close-profile indirection in one shared lowering seam instead of a clearer shared-versus-family-local split
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - still holds both part-node `params.featureStack` schemas for `Part/Baseplate`, `Part/ToeHook`, `Part/Cube`, and similar proof/product nodes
  - still also owns graph-native `Geometry/Sketch` managed-sketch params plus `Geometry/Extrude` stored param defaults and normalizers, making it the clearest coexistence seam between legacy-leaning part-template carryover and graph-native family-local contracts
- `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`, `extrudeProfileConnections.ts`, `extrudeProfileEntryPorts.ts`, and `extrudeBodyVirtualPorts.ts`
  - already read like graph-native sketch/extrude contract helpers
  - still depend on shared feature-stack `SketchFeature` and `ProfileOutput` shapes plus registry helpers, making them strong first family-local contract candidates
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - still combines graph-native node evaluation reads, registry-level extrude/sketch param interpretation, feature-stack dependency analysis, and feature virtual-input shaping in one mixed downstream surface
- `src/app/spaghetti/ui/FeatureStackView.tsx`, `src/app/spaghetti/ui/features/SketchFeatureView.tsx`, and `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - still behave as downstream read and interaction surfaces over part-node `featureStack` data
  - still carry family-specific profile, rectangle, and close-profile interpretation that should eventually read through a cleaner authored-contract seam rather than quietly shaping it themselves

Strongest hotspot candidates:
- shared authored-contract seams:
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
- graph-native bridge seams:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
- downstream adapter and read surfaces:
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

Inventory buckets to classify:
- honest shared authored vocabulary
- graph-native family-local contract candidates
- adapter-only read and presentation surfaces
- legacy-leaning part-template carryover and compatibility residue

Implementation spec:
1. Re-read the locked `Phase 1` boundary.
2. Walk the shared authored-contract seams in `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts`, and classify which shapes and lowering helpers are honestly cross-family versus carrying sketch- or extrude-specific meaning.
3. Walk the graph-native bridge seams in `nodeRegistry.ts`, `sketchProfileVirtualPorts.ts`, `extrudeProfileConnections.ts`, `extrudeProfileEntryPorts.ts`, and `extrudeBodyVirtualPorts.ts`, and record where graph-native sketch/extrude behavior still depends on shared feature-stack-shaped vocabulary.
4. Walk the mixed downstream surfaces in `selectNodeVm.ts`, `FeatureStackView.tsx`, `SketchFeatureView.tsx`, and `ExtrudeFeatureView.tsx`, and classify which reads are adapter-only versus which still duplicate or reshape authored contract meaning.
5. Record the strongest legacy-leaning part-template carryover and compatibility residue that should stay visible but should not be mistaken for honest shared authored vocabulary.
6. Name the strongest first convergence candidates for:
   - `Phase 3` shared authored-contract rule locking
   - `Phase 4` first family-local proof slice
7. Stop once the drift is classified clearly enough to lock one explicit authored-contract rule without starting code movement.

Stop rule:
- do not start code migration from the inventory pass

Checklist:
- [x] classify shared authored vocabulary in `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts`
- [x] classify graph-native bridge seams in `nodeRegistry.ts` and the sketch/extrude virtual-port helpers
- [x] classify adapter-only read and presentation surfaces
- [x] classify the legacy-leaning part-template carryover and compatibility residue
- [x] name the strongest `Phase 3` shared-rule candidates and the strongest `Phase 4` first proof slice
- [x] stop before code edits

Verification:
- manually confirm part-template nodes in `nodeRegistry.ts` still carry `params.featureStack` while graph-native `Geometry/Sketch` and `Geometry/Extrude` still carry their own managed params
- manually confirm the shared feature-stack seams still define the profile/reference/lowering vocabulary that the graph-native bridge helpers consume
- manually confirm `selectNodeVm.ts`, `FeatureStackView.tsx`, `SketchFeatureView.tsx`, and `ExtrudeFeatureView.tsx` still read as downstream mixed surfaces over both feature-stack and graph-native authored meaning

Hotspot inventory:
- honest shared authored vocabulary:
  - `src/app/spaghetti/features/featureTypes.ts`
    - `ProfileOutput`, `ProfileReference`, `CloseProfileOutputRef`, and the core `SketchFeature` / `ExtrudeFeature` authored shapes are still the clearest shared authored vocabulary because both part-template stacks and graph-native bridge helpers depend on them
    - the stable shared center is profile identity, profile selection/reference identity, sketch plane data, and the minimum sketch/extrude authored fields that lower into geometry requests
  - `src/app/spaghetti/features/featureSchema.ts`
    - still honestly owns parsing and normalization for the shared authored stack shapes
    - the shared part is schema validation and deterministic normalization for cross-family authored data, not every compatibility transform currently living beside it
  - `src/app/spaghetti/features/compileFeatureStack.ts`
    - still honestly owns the shared lowering seam from stack-authored `Sketch`, `Close Profile`, and `Extrude` meaning into geometry-request IR
    - the shared part is the compile/lowering handshake itself, especially profile reference lowering and deterministic sketch/extrude IR emission
- graph-native family-local contract candidates:
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
    - reads as graph-native `Geometry/Sketch` output-contract logic rather than general feature-stack vocabulary
    - dynamic `SketchProfile:<id>` port identity is tied to graph-native sketch-node behavior, even though it currently consumes shared `SketchFeature` and `ProfileOutput` shapes
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
    - reads as graph-native `Geometry/Extrude` profile-target semantics rather than a generic shared authored layer
    - aggregate-versus-single contributor rules, endpoint normalization, and sketch-profile contributor classification are the strongest first family-local contract band
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
    - `ExtrusionProfile::entry::<edgeId>` identity is graph-native extrude UI/wiring vocabulary rather than cross-family authored vocabulary
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
    - body-member port identity and `NewObjects` expansion behavior are graph-native extrude output semantics, not a generally shared stack contract
  - `src/app/spaghetti/registry/nodeRegistry.ts`
    - graph-native helpers such as `geometrySketchParamsSchema`, `geometryExtrudeParamsSchema`, `createManagedSketchFeature()`, `readManagedSketchFeatureFromParams(...)`, and the geometry extrude normalizers already read as family-local contract support that currently shares a home with legacy-leaning part-template schemas
- adapter-only read and presentation surfaces:
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
    - should remain a downstream read surface that interprets node evaluation and authored state for UI
    - its current sketch/extrude vm shaping, feature virtual-input shaping, and feature-stack dependency read-through make it contract-aware, but it still should not become the owner of canonical authored meaning
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
    - should remain a downstream part-node stack reader over `readFeatureStack(...)` plus compiled IR output
    - its current profile-summary, close-profile resolution, and highlight shaping show where the UI still carries too much contract interpretation
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
    - should remain a sketch feature editor over canonical authored fields and store-owned mutations
    - rectangle-special-case reading and linked-input display are UI shaping, not canonical contract ownership
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
    - should remain an extrude feature editor over canonical authored fields and store-owned mutations
    - profile-source selection, close-profile read-through, and preview-option shaping show the downstream surface that should eventually read through a cleaner contract seam
- legacy-leaning part-template carryover and compatibility residue:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
    - `Part/Baseplate`, `Part/ToeHook`, `Part/HeelKick`, `Part/Cube`, and similar params schemas still embedding `featureStack` remain the clearest legacy-leaning carryover surface
    - `buildRectangleExtrudeFeatureStack(...)` is useful seed logic, but it is still part-template/proof carryover rather than evidence that the whole stack contract is honestly shared forever
  - `src/app/spaghetti/features/featureSchema.ts`
    - legacy sketch `entities` support, optional/defaulted `profileIndex`, and output compatibility transforms are residue that should stay visible but should not drive the long-term authored split
  - `src/app/spaghetti/features/compileFeatureStack.ts`
    - legacy preferred-profile-id reconciliation and close-profile profile-index forcing are compatibility-shaped lowering details rather than the clean target contract

Implementation result:
- the `Phase 2` inventory now separates the live hybrid seam into four explicit buckets:
  - honest shared authored vocabulary
  - graph-native family-local contract candidates
  - adapter-only read and presentation surfaces
  - legacy-leaning part-template carryover and compatibility residue
- the strongest honest shared authored-contract core is now explicit:
  - profile identity and profile reference vocabulary
  - shared sketch/extrude authored field shapes
  - the compile/lowering handshake in `compileFeatureStack.ts`
- the strongest first family-local convergence band is now explicit:
  - the graph-native sketch-to-extrude profile contract seam spanning:
    - `sketchProfileVirtualPorts.ts`
    - `extrudeProfileConnections.ts`
    - `extrudeProfileEntryPorts.ts`
    - `extrudeBodyVirtualPorts.ts`
    - the graph-native sketch/extrude helper band in `nodeRegistry.ts`
- the downstream surfaces that should stay adapters are now explicit:
  - `selectNodeVm.ts`
  - `FeatureStackView.tsx`
  - `SketchFeatureView.tsx`
  - `ExtrudeFeatureView.tsx`
- the strongest legacy-leaning carryover is now explicit:
  - part-node `params.featureStack` embedding in `nodeRegistry.ts`
  - schema and lowering compatibility transforms that still preserve older stack data
- the first `Phase 3` shared-rule targets are now locked:
  - decide which parts of `featureTypes.ts`, `featureSchema.ts`, and `compileFeatureStack.ts` are truly stable cross-family authored vocabulary
  - explicitly separate that shared core from compatibility residue and graph-native family meaning
- the first `Phase 4` proof slice is now locked:
  - use the graph-native sketch-to-extrude profile contract seam as the first narrow family-local boundary proof
  - keep the proof focused on profile/output/port identity plus immediate lowering/read consumers instead of widening into a full `Sketch` or `Extrude` migration

## [x] Phase 3 - Lock The Shared Authored-Contract Rule

Purpose:
- define one explicit rule for what authored CAD contract vocabulary should stay shared across feature-stack and graph-native families

Read:
- `Phase 3` should still be a docs-and-verification pass

Locked in-scope:
- turn the completed `Phase 2` inventory into one explicit shared-authored-contract rule
- apply that rule to the shared-core seams in `featureTypes.ts`, `featureSchema.ts`, and `compileFeatureStack.ts`
- explicitly separate the shared core from graph-native family-local contract helpers and from legacy compatibility residue
- name the exact first family-local surfaces that `Phase 4` should boundary-lock without widening into a broad migration

Locked out-of-scope:
- code movement
- repointing graph-native sketch/extrude helpers in runtime code
- packaging-only follow-ons from `Cleanup 8`
- broad family migration for `Sketch` and `Extrude`

Current read:
- the completed `Phase 2` inventory already narrowed the honest shared core to:
  - profile identity and profile selection/reference vocabulary
  - the minimum sketch/extrude authored field shapes required for deterministic compile/lowering
  - schema validation and deterministic normalization for those shared authored shapes
  - the compile/lowering handshake that emits geometry-request IR from stack-authored sketch/close-profile/extrude meaning
- the completed `Phase 2` inventory already narrowed the strongest non-shared candidates to:
  - graph-native sketch output-port identity in `sketchProfileVirtualPorts.ts`
  - graph-native extrude profile-target and body-member port identity in `extrudeProfileConnections.ts`, `extrudeProfileEntryPorts.ts`, and `extrudeBodyVirtualPorts.ts`
  - graph-native sketch/extrude managed-param helpers in `nodeRegistry.ts`
- the completed `Phase 2` inventory already isolated the strongest residue that should not shape the shared rule:
  - part-template `params.featureStack` carryover in `nodeRegistry.ts`
  - legacy sketch `entities` support and defaulted profile compatibility in `featureSchema.ts`
  - legacy preferred-profile-id and close-profile compatibility lowering in `compileFeatureStack.ts`

Done shape:
- one explicit rule for when authored fields and lowering helpers stay in shared homes
- one explicit rule for when contract meaning must move toward family-local ownership
- one explicit rule that selectors, views, and node surfaces remain downstream adapters

Shared-rule targets to apply first:
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`

Shared-rule exclusions to keep visible:
- `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
- `src/app/spaghetti/features/extrudeProfileConnections.ts`
- `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
- `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
- graph-native sketch/extrude helper seams in `src/app/spaghetti/registry/nodeRegistry.ts`
- compatibility residue that only exists to preserve older stack or part-template reads

Rule shape to lock:
- shared authored-contract surfaces should keep only the stable vocabulary that multiple families or both authoring paths genuinely need:
  - profile output identity
  - profile reference identity
  - close-profile handoff identity
  - the minimum sketch/extrude authored fields that lower deterministically into geometry requests
  - schema parsing/normalization and lowering helpers that stay generic after compatibility residue is mentally removed
- family-local contract meaning should move out of the shared target set when it defines:
  - graph-native port identity
  - graph-native output expansion behavior
  - graph-native sketch/extrude managed-param defaults or normalizers
  - family-specific profile-target semantics
- selectors, views, and node surfaces should consume the result of that rule, not participate in defining canonical authored vocabulary
- compatibility residue may remain temporarily, but `Phase 3` should explicitly mark it as non-target residue rather than shared-core evidence

Implementation spec:
1. Re-read the completed `Phase 2` inventory.
2. Lock one explicit shared-authored-contract rule that answers:
   - what authored vocabulary is stable enough to remain shared
   - what family-local meaning should be excluded from the shared target set
   - what compatibility residue should stay visible but should not shape the target rule
3. Apply that rule to `featureTypes.ts` and name the exact authored types or concepts that remain in the shared core versus the ones that are only tolerated there today because of compatibility or bridge pressure.
4. Apply that rule to `featureSchema.ts` and separate:
   - stable shared parsing/normalization responsibilities
   - compatibility transforms that should not define the long-term shared contract
5. Apply that rule to `compileFeatureStack.ts` and separate:
   - stable shared lowering responsibilities
   - compatibility-shaped lowering details
   - any semantics that are already better described as family-local proof targets
6. Name the strongest remaining hybrid surfaces that should move toward family-local homes in `Phase 4`, keeping the first proof slice centered on the graph-native sketch-to-extrude profile contract seam.
7. Stop before runtime code movement.

Stop rule:
- do not turn this into a broad implementation pass

Checklist:
- [x] re-read the `Phase 2` inventory
- [x] lock the shared authored-contract criteria
- [x] apply the rule to `featureTypes.ts`
- [x] apply the rule to `featureSchema.ts`
- [x] apply the rule to `compileFeatureStack.ts`
- [x] name the first family-local convergence candidates for `Phase 4`
- [x] stop before code edits

Verification:
- manually confirm the shared-core rule still preserves the graph-native authoring direction from `docs/Vision.md` and `docs/Human-Plans/roadmap/Vision-roadmap.md`
- manually confirm the shared-core rule still matches the completed `Phase 2` inventory buckets instead of quietly re-promoting graph-native bridge helpers into the shared set
- manually confirm the chosen `Phase 4` target still centers on the sketch-to-extrude profile seam rather than widening into a full family migration

Shared authored-contract rule:
- keep a seam shared only when it defines stable authored vocabulary or deterministic lowering that both part-template stacks and graph-native family reads genuinely need
- do not keep a seam shared just because legacy part-template carryover, graph-native bridge helpers, or adapter reads still reference it today
- move a seam toward family-local ownership when it defines graph-native port identity, graph-native output expansion behavior, managed family params/defaults, or family-specific profile-target semantics
- keep selectors, views, and node surfaces downstream adapters over canonical authored meaning rather than letting them become second owners
- allow compatibility residue to remain temporarily, but mark it as tolerated residue rather than evidence that the long-term shared core is broader than it really is

Applied rule:
- `src/app/spaghetti/features/featureTypes.ts`
  - stays in the shared core for:
    - `ProfileOutput`
    - `ProfileReference`
    - `CloseProfileOutputRef`
    - the minimum shared `SketchFeature` and `ExtrudeFeature` authored field shapes needed for deterministic lowering
    - shared sketch plane and transform types re-exported from `shared/sketchTypes`
  - should not be treated as shared-core evidence for:
    - legacy read-only `entities`
    - `entityIds` compatibility residue
    - any future graph-native port or managed-param identity that only one family needs
- `src/app/spaghetti/features/featureSchema.ts`
  - stays in the shared core for:
    - validating and normalizing the shared authored stack shapes
    - deterministic profile/reference parsing
    - stable sketch/close-profile/extrude schema boundaries that multiple authored paths still consume
  - remains visible but outside the target shared-core rule for:
    - `entities` compatibility ingestion
    - defaulted `profileIndex` compatibility shaping
    - other transforms that only preserve older stack payloads rather than define the intended long-term contract
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - stays in the shared core for:
    - generic lowering from stack-authored sketch/close-profile/extrude meaning into geometry-request IR
    - profile reference lowering
    - deterministic sketch/extrude compile sequencing
  - remains visible but outside the target shared-core rule for:
    - `reconcileProfileIds(...)` legacy preferred-profile-id behavior
    - forced `profileIndex: 0` compatibility details around close-profile indirection
    - any semantics that are better described as graph-native family-local proof targets than as permanent shared lowering vocabulary

Implementation result:
- the shared authored-contract rule is now explicit:
  - shared homes keep only stable profile/reference identity, minimum shared authored field shapes, and generic parsing/lowering responsibilities
  - graph-native port identity, graph-native managed-param helpers, and family-specific profile-target semantics do not qualify for the shared target set
  - compatibility transforms stay visible but are now explicitly called non-target residue
- the shared-core seam is now locked around:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
- the strongest excluded graph-native helper band remains explicit for the next phase:
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
  - graph-native sketch/extrude helper seams in `src/app/spaghetti/registry/nodeRegistry.ts`
- the adapter-only read rule is now reaffirmed for:
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- the first `Phase 4` family-local convergence candidates are now locked:
  - graph-native sketch profile output-port identity in `sketchProfileVirtualPorts.ts`
  - graph-native extrude profile-target, entry-port, and body-member identity in `extrudeProfileConnections.ts`, `extrudeProfileEntryPorts.ts`, and `extrudeBodyVirtualPorts.ts`
  - the supporting graph-native sketch/extrude managed-param helper band in `nodeRegistry.ts`
- the first `Phase 4` proof slice remains:
  - the sketch-to-extrude profile contract seam
  - bounded around profile/output/port identity plus the immediate lowering and downstream read consumers, not a full `Sketch` or `Extrude` migration

## [x] Phase 4 - Lock The Family-Local Contract Boundary

Purpose:
- turn the shared-contract rule into one explicit family-local contract boundary for the first real hybrid family slice

Read:
- `Phase 4` should stay docs-and-verification only

Locked in-scope:
- lock one explicit family-local boundary for the graph-native sketch-to-extrude profile contract seam
- define the exact split between the already-locked shared core and the first graph-native family-local helper band
- name the smallest honest downstream consumer set that will prove the boundary later in `Phase 5`
- preserve selector/view surfaces as downstream readers rather than silent second owners

Locked out-of-scope:
- broad `Sketch` migration
- broad `Extrude` migration
- changing the shared-core rule from `Phase 3`
- packaging-only follow-ons from `Cleanup 8`
- moving code in this phase

Primary candidates:
- `Sketch`
- `Extrude`

Preferred first proof slice:
- one narrow `Sketch` plus immediate `Extrude` boundary where authored field, port, or lowering meaning is currently hybrid but bounded enough to converge honestly

Current read:
- `Phase 3` already locked the shared core around:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
- that means the first family-local proof slice should not argue about shared profile/reference identity itself
- the strongest remaining graph-native family-local seam is the sketch-to-extrude profile contract band:
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
    - graph-native sketch output-port identity via `SketchProfile:<profileId>`
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
    - graph-native extrude contributor classification, endpoint normalization, and profile-target semantics
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
    - graph-native extrude entry-port identity via `ExtrusionProfile::entry::<edgeId>`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
    - graph-native extrude body-member output identity for `NewObjects`
  - `src/app/spaghetti/registry/nodeRegistry.ts`
    - the supporting `Geometry/Sketch` and `Geometry/Extrude` helper band that currently supplies the managed-param/default/normalizer side of the same seam
- the strongest downstream consumers that should remain visible but secondary are:
  - compile/downstream contract consumers:
    - `src/app/spaghetti/registry/nodeRegistry.ts`
  - read/adapter consumers:
    - `src/app/spaghetti/selectors/selectNodeVm.ts`
    - `src/app/spaghetti/ui/FeatureStackView.tsx`
    - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

Boundary split to lock:
- shared authored-contract surfaces:
  - `featureTypes.ts`
  - `featureSchema.ts`
  - `compileFeatureStack.ts`
  - these keep stable profile/reference identity plus generic stack parsing and lowering
- first family-local contract surfaces:
  - `sketchProfileVirtualPorts.ts`
  - `extrudeProfileConnections.ts`
  - `extrudeProfileEntryPorts.ts`
  - `extrudeBodyVirtualPorts.ts`
  - the supporting graph-native sketch/extrude helper band inside `nodeRegistry.ts`
  - these own graph-native port identity, graph-native output/member identity, graph-native extrude target semantics, and managed-param/default logic needed only for this seam
- adapter-only read surfaces:
  - `selectNodeVm.ts`
  - `FeatureStackView.tsx`
  - `ExtrudeFeatureView.tsx`
  - these may need repoints later, but they should not define the contract boundary

Implementation spec:
1. Re-read the completed `Phase 3` rule.
2. Lock the first narrow family slice as the graph-native sketch-to-extrude profile contract seam rather than a whole `Sketch` or whole `Extrude` migration.
3. Define the exact split between:
   - shared authored-contract surfaces
   - family-local authored-contract surfaces
   - adapter-only read surfaces
4. Name the exact family-local responsibilities that the first proof slice should own:
   - sketch profile output-port identity
   - extrude profile-target identity and endpoint normalization
   - extrude entry-port identity
   - extrude body-member output identity
   - supporting graph-native sketch/extrude managed-param helper logic tied directly to that seam
5. Name the smallest honest downstream consumer set for the later proof pass:
   - immediate supporting helper owner:
     - `src/app/spaghetti/registry/nodeRegistry.ts`
   - immediate downstream readers:
     - `src/app/spaghetti/selectors/selectNodeVm.ts`
     - `src/app/spaghetti/ui/FeatureStackView.tsx`
     - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
6. Record the explicit exclusions that keep the later proof narrow:
   - no whole-family folder migration
   - no broad `SketchFeatureView.tsx` rewrite
   - no shared-core schema/type rewrite beyond the already-locked rule
   - no broad selector/view cleanup outside the immediate seam consumers
7. Stop before broad runtime movement.

Stop rule:
- do not widen into multiple family migrations in the same pass

Checklist:
- [x] re-read the `Phase 3` contract rule
- [x] pick one narrow first proof slice
- [x] define shared versus family-local versus adapter boundaries
- [x] name the exact family-local responsibilities for the proof slice
- [x] name the smallest honest downstream consumer set
- [x] record the explicit exclusions that keep the proof narrow
- [x] stop before code edits

Verification:
- manually confirm the chosen proof slice still sits outside the shared-core targets locked in `Phase 3`
- manually confirm the chosen proof slice still centers on graph-native port/output identity and profile-target semantics rather than broader family UI behavior
- manually confirm the named downstream consumers are the smallest honest set that reads this seam today

Locked family-local boundary:
- shared authored-contract surfaces stay:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
  - these continue to own stable profile/reference identity, generic stack parsing, and generic lowering
- first family-local contract surfaces become:
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
  - the supporting `Geometry/Sketch` and `Geometry/Extrude` helper band in `src/app/spaghetti/registry/nodeRegistry.ts`
  - these now define the first explicit family-local contract band for:
    - sketch profile output-port identity
    - extrude profile-target identity
    - extrude target-endpoint normalization
    - extrude entry-port identity
    - extrude body-member output identity
    - managed sketch/extrude helper logic tied directly to those graph-native identities
- adapter-only read surfaces remain:
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - these may consume and display the boundary later, but they do not own it

Smallest honest consumer set for the later proof:
- immediate supporting helper owner and compile-adjacent consumer:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
- immediate downstream read consumers:
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

Explicit exclusions for the later proof:
- no whole `Sketch` family migration
- no whole `Extrude` family migration
- no broad `SketchFeatureView.tsx` rewrite
- no change to the shared-core rule already locked in `Phase 3`
- no broad selector/view cleanup beyond the immediate seam consumers
- no packaging-only follow-ons from `Cleanup 8`

Implementation result:
- the first family-local contract boundary is now explicit:
  - the shared core stops at stable profile/reference identity plus generic parsing and lowering
  - the graph-native sketch-to-extrude profile contract seam is the first family-local target band
- the exact first family-local responsibilities are now locked:
  - `SketchProfile:<profileId>` output-port identity
  - `ExtrusionProfile` contributor classification and target semantics
  - `ExtrusionProfile::entry::<edgeId>` identity
  - `SolidBody:<memberIndex>` output-member identity for `NewObjects`
  - the supporting graph-native sketch/extrude helper logic in `nodeRegistry.ts`
- the `Phase 5` proof band is now explicitly bounded:
  - target set:
    - `sketchProfileVirtualPorts.ts`
    - `extrudeProfileConnections.ts`
    - `extrudeProfileEntryPorts.ts`
    - `extrudeBodyVirtualPorts.ts`
    - the supporting `Geometry/Sketch` / `Geometry/Extrude` helper band in `nodeRegistry.ts`
  - smallest honest downstream consumer set:
    - `nodeRegistry.ts`
    - `selectNodeVm.ts`
    - `FeatureStackView.tsx`
    - `ExtrudeFeatureView.tsx`
- the later proof remains intentionally narrow:
  - it should prove the sketch-to-extrude profile contract seam can move behind the shared-versus-family-local boundary
  - it should not widen into a full family packaging pass or a broad UI cleanup pass

## [x] Phase 5 - Prove The Contract With One Narrow Convergence Slice

Purpose:
- implement one narrow authored-contract convergence slice that proves the new rule is workable in live code

Read:
- `Phase 5` should be the first code-and-verification pass in this lane

Locked in-scope:
- one narrow convergence slice
- the smallest honest consumer repoint
- focused proof around the converged contract seam

Locked out-of-scope:
- full multi-family convergence
- packaging-only `Cleanup 8` follow-ons
- broad Browser, Console, or NodeView cleanup beyond the chosen proof slice

Current read:
- `Phase 4` already locked the first family-local target set to the graph-native sketch-to-extrude profile contract seam:
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
  - the supporting `Geometry/Sketch` / `Geometry/Extrude` helper band in `src/app/spaghetti/registry/nodeRegistry.ts`
- the shared core that should remain intact in this proof is already locked:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
- the smallest honest downstream consumer set is already clear in live code:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- the strongest existing proof anchors are already close to this seam:
  - `src/app/spaghetti/registry/nodeRegistry.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/features/compileFeatureStack.test.ts`
  - `src/app/spaghetti/features/effectivePorts.test.ts`

Recommended done shape:
- one explicit converged authored-contract seam exists for the sketch-to-extrude profile contract slice
- graph-native sketch/extrude port and target semantics read through one narrower family-local helper band
- the shared authored helpers remain unchanged except for smaller or cleaner dependency boundaries around this seam
- the smallest selector/view consumers read through the converged seam without redefining profile-target meaning themselves

Preferred first proof band:
- family-local target set:
  - `sketchProfileVirtualPorts.ts`
  - `extrudeProfileConnections.ts`
  - `extrudeProfileEntryPorts.ts`
  - `extrudeBodyVirtualPorts.ts`
  - the supporting `Geometry/Sketch` / `Geometry/Extrude` helper band in `nodeRegistry.ts`
- smallest honest consumer repoints:
  - `nodeRegistry.ts`
  - `selectNodeVm.ts`
  - `FeatureStackView.tsx`
  - `ExtrudeFeatureView.tsx`
- keep out of the first proof unless unexpectedly required:
  - `SketchFeatureView.tsx`
  - broad `featureSchema.ts` / `featureTypes.ts` rewrites
  - broad `compileFeatureStack.ts` reshaping
  - any whole-family folder migration

Implementation spec:
1. Re-read the completed `Phase 4` boundary and preserve the locked shared-core rule from `Phase 3`.
2. Create or repoint the minimal family-local helper seam required for the sketch-to-extrude profile contract slice:
   - sketch profile member-port identity
   - extrude contributor classification and endpoint normalization
   - extrude entry-port identity
   - extrude body-member identity
   - the supporting graph-native sketch/extrude registry helper logic tied directly to those identities
3. Keep `featureTypes.ts`, `featureSchema.ts`, and `compileFeatureStack.ts` as the shared core unless one tiny import-level or helper-level adjustment is required to let the boundary become explicit.
4. Repoint the smallest honest consumer band:
   - `nodeRegistry.ts`
   - `selectNodeVm.ts`
   - `FeatureStackView.tsx`
   - `ExtrudeFeatureView.tsx`
5. Add focused proof around:
   - registry-level sketch/extrude contract behavior
   - selector-level sketch/extrude profile-target reads
   - any new family-local helper seam added for the proof
6. Verify with the narrowest honest test band plus build.
7. Stop before the lane widens into:
   - a broad `Sketch` migration
   - a broad `Extrude` migration
   - broad selector/view cleanup
   - packaging work that belongs to `Cleanup 8`

Stop rule:
- do not widen beyond the chosen proof slice

Checklist:
- [x] create or repoint the minimal contract surfaces for the first proof slice
- [x] converge the chosen family-specific contract meaning
- [x] repoint the smallest honest consumer set
- [x] add focused proof for the converged seam
- [x] verify with targeted tests plus build

Verification:
- passed `cmd /c npm.cmd test -- src/app/spaghetti/registry/nodeRegistry.test.ts`
- passed `cmd /c npm.cmd test -- src/app/spaghetti/selectors/selectNodeVm.test.ts`
- passed `cmd /c npm.cmd test -- src/app/spaghetti/features/compileFeatureStack.test.ts src/app/spaghetti/features/effectivePorts.test.ts`
- passed `cmd /c npm.cmd run build`

Implementation result:
- the first narrow live family-local contract seam now exists in:
  - `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - this one seam now owns:
    - sketch profile member-port identity
    - extrude contributor classification and endpoint normalization
    - extrude entry-port identity
    - extrude body-member identity
    - the supporting graph-native sketch/extrude params schemas, defaults, and read helpers tied directly to that seam
- the older flat `features/` seam helpers now act as explicit compatibility re-export shims:
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
- the smallest honest direct consumer repoints landed in:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
- the downstream adapter-only UI surfaces stayed unchanged:
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - these were re-read during the proof pass, but they did not import the seam directly and did not need a no-value repoint
- the shared core stayed untouched:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
- the proof stayed intentionally narrow:
  - no whole `Sketch` family migration
  - no whole `Extrude` family migration
  - no broad selector/view cleanup
  - no packaging-only follow-on work from `Cleanup 8`

## [x] Phase 6 - Proof, Cleanup, And Later Family Handoff

Purpose:
- prove the first convergence slice holds and separate later family growth from the first authored-contract proof

Read:
- `Phase 6` should be a proof-and-doc-closeout pass unless `Phase 5` exposes one small structural correction

Residual buckets to record:
- remaining compatibility-shim retirement that should happen only when later consumers move honestly
- later direct-consumer repoints that may read through the new Geometry family seam but did not need to move in `Phase 5`
- later family-local convergence candidates after the first proof slice
- any still-honest shared authored helpers that should remain shared
- any packaging-only follow-ons that still belong to `Cleanup 8` instead of this lane

Current read:
- `Phase 5` already proved the first narrow authored-contract slice in live code:
  - `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - this seam now owns:
    - sketch profile member-port identity
    - extrude contributor classification and endpoint normalization
    - extrude entry-port identity
    - extrude body-member identity
    - graph-native sketch/extrude param schemas, defaults, and read helpers tied directly to that seam
- the older flat helper files now remain only as compatibility shims:
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
- the first direct consumer repoints are already landed:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
- the adapter-only UI surfaces re-read during `Phase 5` stayed unchanged:
  - `src/app/spaghetti/ui/FeatureStackView.tsx`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- the shared core stayed unchanged through the proof:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
- the proof anchors are now concrete rather than hypothetical:
  - `src/app/spaghetti/registry/nodeRegistry.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/features/compileFeatureStack.test.ts`
  - `src/app/spaghetti/features/effectivePorts.test.ts`
  - `cmd /c npm.cmd run build`

Implementation spec:
1. Re-read the landed `Phase 5` proof against `Cleanup-Vision.md` and `Cleanup-Index.md` so the authored-contract result is checked against the broader cleanup north star rather than only against the local lane wording.
2. Confirm the proof still matches the intended split:
   - shared authored core remains shared
   - the first family-local Geometry seam remains family-local
   - selectors, views, and any still-flat helper shims remain downstream adapters or compatibility residue instead of second owners
3. Re-run or tighten the focused proof surfaces only if needed; prefer the already-landed `Phase 5` proof band unless a new regression or doc mismatch appears.
4. Record the remaining follow-on buckets without starting them:
   - compatibility-shim retirement candidates
   - later direct-consumer repoint candidates
   - later family-local contract candidates beyond the sketch-to-extrude seam
   - any still-honest shared helpers that should stay shared
   - any packaging-only work that still belongs to `Cleanup 8`
5. Write one explicit handoff that tells later cleanup passes what should happen next and what should not be reopened.
6. Stop once the authored-contract rule is proven, the residual buckets are named, and the later path is explicit.

Stop rule:
- do not continue into another broad convergence pass after the first proof slice lands
- do not turn `Phase 6` into shim retirement, whole-family migration, or a second consumer-repoint implementation pass

Checklist:
- [x] re-read the landed proof against `Cleanup-Vision.md` and `Cleanup-Index.md`
- [x] confirm the landed proof still preserves the shared-core versus family-local versus adapter split
- [x] prove the first convergence slice
- [x] name the remaining convergence follow-ons without starting them
- [x] write the explicit later-family handoff
- [x] stop before a second broad implementation lane starts

Verification:
- manually re-read the landed `Phase 5` result against `Cleanup-Vision.md`
- manually re-read the landed `Phase 5` result against `Cleanup-Index.md`
- confirmed the fresh `Phase 5` proof remains the active verification anchor:
  - `cmd /c npm.cmd test -- src/app/spaghetti/registry/nodeRegistry.test.ts`
  - `cmd /c npm.cmd test -- src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `cmd /c npm.cmd test -- src/app/spaghetti/features/compileFeatureStack.test.ts src/app/spaghetti/features/effectivePorts.test.ts`
  - `cmd /c npm.cmd run build`
- no new runtime movement was introduced in `Phase 6`, so no proof re-run was required for this closeout

Expected closeout result:
- `Cleanup 8A` ends with one proven authored-contract rule:
  - shared authored core stays in the shared feature-stack surfaces when it is honestly cross-family
  - graph-native family-specific authored semantics move behind family-local contract seams
  - selectors, views, and compatibility layers stay downstream
- the first Geometry family-local seam remains the concrete proof point:
  - `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
- the residual buckets are explicit for later work:
  - which old flat helpers are now only compatibility shims
  - which direct consumers may later repoint
  - which later CAD seams still need a family-local read
  - which shared helpers should remain shared
  - which packaging-only items still belong to `Cleanup 8`
- the lane closes without reopening:
  - broad `Sketch` migration
  - broad `Extrude` migration
  - shared-core schema/lowering rewrites
  - packaging-only family moves

Implementation result:
- the landed `Phase 5` seam still matches the broader cleanup direction:
  - cleanup continues to favor one honest owner, smaller contract surfaces, and downstream adapters instead of quiet second owners
  - the first Geometry seam reads as a real family-local contract home rather than another flat shared dumping ground
- the shared-core versus family-local versus adapter split is now proven and explicit:
  - shared authored core remains in:
    - `src/app/spaghetti/features/featureTypes.ts`
    - `src/app/spaghetti/features/featureSchema.ts`
    - `src/app/spaghetti/features/compileFeatureStack.ts`
  - the first family-local contract seam remains:
    - `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - selectors, views, and compatibility layers remain downstream:
    - `src/app/spaghetti/selectors/selectNodeVm.ts`
    - `src/app/spaghetti/ui/FeatureStackView.tsx`
    - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
    - the older flat sketch/extrude helper files under `src/app/spaghetti/features/`
- the remaining follow-on buckets are now explicit without being started:
  - compatibility-shim retirement candidates:
    - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
    - `src/app/spaghetti/features/extrudeProfileConnections.ts`
    - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
    - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
    - these should retire only when later consumers move honestly to the family-local seam
  - later direct-consumer repoint candidates:
    - `src/app/spaghetti/compiler/evaluateGraph.ts`
    - `src/app/spaghetti/compiler/compileGraph.ts`
    - `src/app/spaghetti/features/effectivePorts.ts`
    - `src/app/spaghetti/canvas/NodeView.tsx`
    - these are legitimate future consumers of the family-local seam, but they were not required for the first proof
  - later family-local candidate seams beyond the first proof:
    - additional `Sketch` and `Extrude` authored helpers should move only when a later pass proves they are family-specific rather than honestly shared
  - still-honest shared helpers that should remain shared:
    - stable profile/reference identity
    - generic feature-stack parsing
    - generic feature-stack lowering
  - packaging-only follow-ons that still belong to `Cleanup 8`:
    - any remaining packaging or import-retirement work that does not change authored-contract meaning
- the later-family handoff is now explicit:
  - next authored-contract work should start from later direct-consumer repoints or the next proven family-local seam
  - later work should preserve the same rule:
    - keep truly cross-family authored vocabulary shared
    - move family-specific authored semantics behind family-local seams
    - keep selectors, views, and compatibility layers downstream
  - later work should not reopen:
    - the `Cleanup 7` node-owned authoring baseline
    - the `Cleanup 8` packaging baseline
    - the `Cleanup 8A` shared-core rule already proven here

Lane closeout:
- `Cleanup 8A` is now complete as a narrow authored-contract convergence lane after shipped `Cleanup 8`
- the repo now has:
  - one explicit shared authored core
  - one explicit first Geometry family-local authored seam
  - one explicit downstream adapter read model
- any further CAD convergence should now proceed as later targeted follow-on work instead of extending `Cleanup 8A`

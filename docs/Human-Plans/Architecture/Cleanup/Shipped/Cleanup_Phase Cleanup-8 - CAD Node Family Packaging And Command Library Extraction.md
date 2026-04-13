# Cleanup Phase Cleanup-8 - CAD Node Family Packaging And Command Library Extraction

## Doc Header

### Doc History
12. 2026-04-13 10:11:06: Completed `Phase 6 - Proof, Cleanup, And Cleanup 8A Handoff` by re-verifying the landed `OutputPreview` family-root seed and `drawCommands.ts` command-library seam against the focused proof band plus a green build, then recording the remaining packaging follow-ons separately from the authored-contract convergence questions so `Cleanup 8` now ends with one explicitly proven packaging pattern and a clean `Cleanup 8A` handoff boundary
11. 2026-04-13 10:08:30: Tightened `Phase 6 - Proof, Cleanup, And Cleanup 8A Handoff` into an implementation-ready proof-and-doc-closeout pass by grounding it in the newly landed `OutputPreview` family seed and `drawCommands.ts` command-library seam, naming the exact proof surfaces and narrow residual packaging follow-ons that should still be recorded here, and making the `Cleanup 8A` handoff boundary explicit so the next pass can close the packaging lane without reopening authored-contract convergence
10. 2026-04-13 10:04:15: Completed `Phase 5 - Prove The Contract With One Narrow Extraction` by extracting the first shared sketch draw-command seam into `src/app/spaghetti/sketchCommands/drawCommands.ts`, moving the `OutputPreview` helper cluster into `src/app/spaghetti/families/OutputPreview/system/`, reducing the old `system/` paths to narrow compatibility re-exports, repointing the bounded store/console/viewport and registry/preview/output consumers, adding focused new proof around the extracted seams, and verifying the targeted tests plus green build
9. 2026-04-13 09:42:19: Tightened `Phase 5 - Prove The Contract With One Narrow Extraction` into an implementation-ready code-and-verification pass by grounding the first family slice in the live `OutputPreview` helper cluster (`outputPreviewNode.ts`, `ensureOutputPreviewSingleton.ts`, `ensureOutputPreviewSlots.ts`) and its downstream consumers in `nodeRegistry.ts`, `previewPreparation.ts`, `outputSurface.ts`, and `useSpaghettiStore.ts`, while grounding the first sketch-command slice in the repeated draw-tool and companion-command mapping across `useSpaghettiStore.ts`, `useConsoleInteraction.ts`, and `ViewportOverlay.tsx`, then narrowing the phase to one minimal dual extraction with focused proof instead of a broad multi-family migration
8. 2026-04-13 09:39:59: Completed `Phase 4 - Lock The Sketch Command-Library Contract` as a docs-and-verification pass by confirming the store-owned `runGeometrySketchDrawCommand(...)` seam still owns sketch-session mutation, locking `src/app/spaghetti/sketchCommands/` as the reusable command-library home for command vocabulary, metadata, alias normalization, and staged-action mapping, preserving `stagedNavigation.ts`, `useConsoleInteraction.ts`, `ViewportOverlay.tsx`, and `NodeView.tsx` as adapters, and naming the first `Phase 5` extraction targets around the draw-tool band plus its immediate companion commands
7. 2026-04-13 09:33:16: Tightened `Phase 4 - Lock The Sketch Command-Library Contract` into an implementation-ready docs-and-verification pass by grounding it in the live store-owned `runGeometrySketchDrawCommand(...)` execution seam, the staged sketch-draw action ids in `stagedNavigation.ts`, the repeated action-to-command and typed-alias routing in `useConsoleInteraction.ts`, and the viewport overlay tool forwarding in `ViewportOverlay.tsx`, then locking the first extraction band around the draw tools plus their immediate companion commands while preserving console, viewport, and node surfaces as adapters
6. 2026-04-13 09:13:40: Completed `Phase 3 - Lock The CAD Family Folder Contract` as a docs-and-verification pass by turning the `Phase 2` inventory into one explicit family-root packaging contract under `src/app/spaghetti/families/<Family>/`, locking what belongs in family-local homes versus what stays in shared registry/compiler/store/contracts/selectors infrastructure, preserving `nodeRegistry.ts` as shared plumbing, and naming `OutputPreview` as the first extraction seed with `Sketch` as the backup family candidate for the first narrow packaging pass
5. 2026-04-13 09:13:40: Tightened `Phase 3 - Lock The CAD Family Folder Contract` into an implementation-ready docs-and-verification pass by grounding it in the completed `Phase 2` inventory, narrowing the first family packaging targets to the strongest `Sketch` and `Extrude` helper/view candidates plus `Output Preview` as the clearest already-family-shaped seed seam, and explicitly preserving `nodeRegistry.ts` as shared registry infrastructure that should depend on fewer scattered family imports rather than becoming the migration target itself
4. 2026-04-13 08:45:27: Completed `Phase 2 - Inventory Mixed Family Placement And Command Drift` as a docs-and-verification pass by classifying the live flat `features/` seams, the split `ui/features/` family-view seams, the `Output Preview` family helper seam in `system/outputPreviewNode.ts`, the family assembly pressure in `nodeRegistry.ts`, and the still-spread sketch draw command shaping across `useSpaghettiStore.ts`, `NodeView.tsx`, `ViewportOverlay.tsx`, and `useConsoleInteraction.ts` into explicit honest shared homes, family-local home candidates, command-library home candidates, adapter-only surfaces, and compatibility residue so the cleanup lane now has clear `Phase 3` family-packaging targets plus clear `Phase 4` sketch-command-library targets
3. 2026-04-13 08:45:27: Tightened `Phase 2 - Inventory Mixed Family Placement And Command Drift` into an implementation-ready docs-and-verification pass by grounding it in the live flat family-helper seams in `src/app/spaghetti/features/`, the split family-view seams in `src/app/spaghetti/ui/features/`, the `Output Preview` helper seam in `src/app/spaghetti/system/outputPreviewNode.ts`, the registry assembly pressure in `src/app/spaghetti/registry/nodeRegistry.ts`, and the still-spread sketch draw command shaping across `useSpaghettiStore.ts`, `NodeView.tsx`, `ViewportOverlay.tsx`, and `useConsoleInteraction.ts`, so the next step can classify real packaging drift against the locked `Cleanup 7` owner baseline without widening into code movement
2. 2026-04-13 08:45:27: Completed `Phase 1 - Reconfirm Packaging Boundary After Cleanup 7` as a docs-and-verification pass by re-reading the cleanup and repo vision rules against the shipped `Cleanup 7` owner baseline and the live mixed CAD family-placement seams in `registry/`, `features/`, `ui/features/`, `system/`, `useSpaghettiStore.ts`, `NodeView.tsx`, `ViewportOverlay.tsx`, and `useConsoleInteraction.ts`, then locking one explicit packaging boundary where `Cleanup 8` only reorganizes family-local and command-library placement while canonical graph/session truth remains in the existing owner surfaces
1. 2026-04-13 08:45:27: Created this standalone `Cleanup 8` future phase doc to hold the CAD node-family packaging and sketch-command library extraction lane under the Cleanup family, aligning it to the shipped `Cleanup 7` ownership baseline plus the broader cleanup and repo vision docs while grounding the plan in the live `registry/`, `features/`, `ui/features/`, `system/`, `useSpaghettiStore.ts`, `NodeView.tsx`, `ViewportOverlay.tsx`, and `useConsoleInteraction.ts` seams

### Purpose

This doc defines the eighth cleanup phase for the `Cleanup` family.

Use it to answer:
- how CAD node families should be packaged once node-owned authoring truth is already locked
- where graph-native family-local code should live versus shared cross-family code
- how sketch command semantics should be separated from console, viewport, and node-surface adapters
- how this cleanup lane should be sequenced before `Cleanup 8A`

Do not use it for:
- reopening the owner baseline already locked by `Cleanup 7`
- the later authored-contract convergence work reserved for `Cleanup 8A`
- a full worker/runtime geometry contract redesign
- generic Browser or Console cleanup outside the CAD packaging and sketch-command boundary

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface
  - lane ordering and boundary against `Cleanup 8A`

- `../Cleanup-Vision.md`
  - cleanup framing for repo-shape drift, ownership sinks, and family packaging

- `../Canonical-Ownership-Targets.md`
  - owner baseline this lane must preserve while packaging changes

- `../Canonical-Owner-Decisions.md`
  - one-real-owner rules this lane should not reopen

- `../Shipped/Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`
  - locked node-owned CAD authoring truth and command-adapter boundary

- `../../Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Vision.md`
  - longer-range node-family direction and future sketch/extrude ideas

- `../../../../Vision.md`
  - repo-level `What Must Stay True` summary

- `../../../roadmap/Vision-roadmap.md`
  - canonical north-star for graph-native CAD, packaging direction, and explicit command boundaries

## Doc Body

## [x] Cleanup 8 - CAD Node Family Packaging And Command Library Extraction

### Header

Purpose:
- package graph-native CAD families into repeatable family homes and separate sketch command semantics from surface-specific tool adapters without reopening the owner rules already locked by `Cleanup 7`

Owns:
- CAD node-family packaging direction
- family-local versus shared cross-family file-boundary rules
- sketch command-library versus surface-adapter boundary
- one narrow first extraction path that proves the packaging contract is workable

Does not own:
- the node-owned CAD truth baseline already locked in `Cleanup 7`
- the later feature-stack versus graph-native authored-contract convergence reserved for `Cleanup 8A`
- worker execution ownership or accepted-result ownership already handled by earlier cleanup lanes
- broad Browser, Console, or viewer cleanup outside the packaging and command-library seam

### Why This Phase Exists

`Cleanup 7` closed the most important upstream ownership question:
- graph documents, node params, node wiring, node outputs, and graph-local CAD sessions stay canonical in the spaghetti store
- toolbar, console, viewport, and node surfaces stay adapters over that same truth

That means the next problem is no longer "who owns CAD truth?"

The next problem is repo shape.

Right now CAD-family code is still spread across several parallel homes:
- `registry/`
- `features/`
- `ui/features/`
- `system/`
- large store files
- surface adapters such as console, viewport, and node views

That spread is survivable for a few families, but it becomes harder to grow once more graph-native CAD families and more sketch-editing commands land.

Without a packaging lane:
- each new family will keep reassembling itself across the same mixed folders
- the sketch command surface will keep growing as store-local and adapter-local behavior instead of one reusable command library
- future refactors will be forced to touch the same giant files again
- `Cleanup 8A` would have to reason about authored-contract convergence before the repo even has stable family homes

This phase exists so we can:
1. lock the packaging boundary without reopening ownership,
2. inventory the live mixed-placement seams,
3. define one repeatable family folder contract,
4. define one sketch command-library contract,
5. prove the contract with one narrow extraction path,
6. then hand the remaining authored-contract questions forward to `Cleanup 8A`.

### Scope

This phase covers:
- packaging rules for graph-native CAD node families such as `Sketch`, `Extrude`, and `Output Preview`
- family-local code boundaries versus generic shared spaghetti infrastructure
- sketch command-library extraction for reusable command semantics
- separation between pure sketch command logic and console, viewport, and node-surface adapters
- one narrow first extraction/repoint pass that validates the packaging pattern

This phase does not cover:
- deciding whether graph-native families and feature-stack contracts should fully merge
- broad feature-schema redesign across every CAD family
- replacing all existing family placement in one pass
- viewer-only transform cleanup
- optional workspace-family scope decisions

### Current Read

The live repo already has the owner baseline needed for packaging cleanup, but the family-local code still spans several flat or mixed surfaces.

- `src/app/spaghetti/registry/nodeRegistry.ts`
  - central generic registry seam
  - currently also acts as one of the assembly points for concrete CAD family definitions

- `src/app/spaghetti/features/`
  - holds mixed cross-family and family-local code in one flat home
  - notable live seams include:
    - `featureSchema.ts`
    - `featureTypes.ts`
    - `compileFeatureStack.ts`
    - `profileDerivation.ts`
    - `sketchProfileVirtualPorts.ts`
    - `extrudeProfileConnections.ts`
    - `extrudeProfileEntryPorts.ts`
    - `extrudeBodyIdentity.ts`
    - `extrudeBodyVirtualPorts.ts`

- `src/app/spaghetti/ui/features/`
  - holds family-local feature views in a separate UI-only home
  - current examples:
    - `SketchFeatureView.tsx`
    - `ExtrudeFeatureView.tsx`
    - `CloseProfileFeatureView.tsx`
    - `profilePreview.tsx`

- `src/app/spaghetti/system/`
  - already carries family-adjacent `Output Preview` helpers in a separate system home
  - current examples:
    - `outputPreviewNode.ts`
    - `ensureOutputPreviewSingleton.ts`
    - `ensureOutputPreviewSlots.ts`

- `src/app/spaghetti/graphCommands/`
  - already reads as an honest shared graph-mutation home
  - should stay shared and generic rather than become a family dump

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - remains the owner of graph-native CAD sessions and mutations
  - still also carries a large amount of sketch command/session logic that future families should not have to copy

- `src/app/spaghetti/canvas/NodeView.tsx`
  - now behaves more honestly as an adapter after `Cleanup 7`
  - still reflects how family-specific UI affordances and sketch command entry are distributed across a large mixed surface

- `src/app/components/ViewportOverlay.tsx`
  - remains a cross-surface adapter over sketch sessions
  - still forwards family- and command-specific actions from one large mixed presentation file

- `src/app/console/useConsoleInteraction.ts`
  - remains a grammar/router surface, not the owner of sketch truth
  - still exposes how command vocabulary and adapter behavior can sprawl if sketch commands do not get a clearer reusable home

### Locked Direction

- `Cleanup 8` packages around the `Cleanup 7` ownership rule; it does not renegotiate it
- graph-native CAD families should move toward one repeatable family-root pattern instead of continuing to split themselves across `features/`, `ui/features/`, `system/`, and registry glue
- shared generic spaghetti infrastructure should remain shared and generic:
  - registry plumbing
  - graph command primitives
  - graph compiler orchestration
  - store ownership of graph and session truth
- sketch command semantics should move toward one reusable command-library seam
  - pure command meaning and state transitions should not stay trapped inside console, viewport, or node adapters
  - interactive surface concerns such as focus, prompts, radio burst, pointer capture, and toolbar chrome should remain adapters
- this lane should prefer one narrow first extraction path over an all-family reorg
- authored-contract convergence questions that cut across feature schema, graph-native contracts, and family vocabulary should stay reserved for `Cleanup 8A`

### Packaging Baseline

The working default for this lane is:
- create one family-root pattern under `src/app/spaghetti/families/<Family>/`

That family root should be allowed to own:
- family-local params/defaults/labels
- family-local ports and virtual-port helpers
- family-local compile/lowering helpers
- family-local UI views and templates
- family-local output/system helpers
- family-local tests

The family root should not absorb:
- generic registry infrastructure
- generic graph command primitives
- generic workspace intent helpers
- generic viewer or Browser infrastructure
- cross-family authored-contract questions that belong to `Cleanup 8A`

### Sketch Command-Library Baseline

The working default for this lane is:
- create one reusable sketch-command home under `src/app/spaghetti/sketchCommands/`

That command-library home should be allowed to own:
- pure command ids and command vocabulary
- command-state transition helpers
- command parameter parsing/normalization helpers
- reusable command execution over canonical sketch-session truth
- command metadata that multiple surfaces can read

That command-library home should not own:
- console transcript formatting
- viewport pointer capture and overlay chrome
- node-toolbar affordances
- workspace shell focus behavior
- graph/session ownership itself

### Phase Ladder

## [x] Phase 1 - Reconfirm Packaging Boundary After Cleanup 7

Purpose:
- lock one explicit baseline that says `Cleanup 8` is a packaging and command-library lane downstream from the shipped `Cleanup 7` owner rules

Read:
- `Phase 1` should stay a docs-and-verification pass

Locked in-scope:
- restate the upstream boundaries inherited from `Cleanup 7`
- make explicit what `Cleanup 8` is and is not allowed to reorganize
- identify the main live family-placement and sketch-command hotspot candidates for `Phase 2`

Locked out-of-scope:
- code moves
- folder extraction
- command-library implementation
- contract redesign that belongs to `Cleanup 8A`

Strongest live repo seams:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/features/`
- `src/app/spaghetti/ui/features/`
- `src/app/spaghetti/system/`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`

Implementation spec:
1. Re-read the cleanup family direction and repo vision rules that packaging should follow ownership rather than replace it.
2. Re-read the shipped `Cleanup 7` record and pull forward the locked owner boundary.
3. Re-scan the live mixed family-placement seams listed above.
4. Write one explicit packaging baseline that answers:
   - what still belongs to the canonical owner surfaces
   - what this lane can reorganize safely
   - what should be carried forward as the main `Phase 2` hotspot inventory targets
5. Stop once the hotspot inventory can be written against a locked packaging boundary.

Stop rule:
- do not widen this into code movement or folder creation

Checklist:
- [x] re-read cleanup family and repo vision rules
- [x] re-read the shipped `Cleanup 7` owner baseline
- [x] scan live family-placement and command-vocabulary seams
- [x] write one explicit packaging boundary baseline
- [x] identify the main `Phase 2` hotspot seams
- [x] stop before code edits

Verification:
- manually confirm the canonical owner surfaces from `Cleanup 7` still hold in source
- manually confirm the main mixed family-placement and command-adapter seams still match the current read above

Packaging boundary baseline:
- inherited owner baseline from `Cleanup 7`:
  - `src/app/spaghetti/store/useSpaghettiStore.ts` remains the canonical owner for graph documents, node params, node wiring, node outputs, graph-local CAD sessions, and store-owned sketch command/session truth
  - `src/app/spaghetti/graphCommands/` remains the shared generic graph-mutation helper home rather than a family-specific packaging sink
  - `src/app/spaghetti/canvas/NodeView.tsx`, `src/app/components/ViewportOverlay.tsx`, and `src/app/console/useConsoleInteraction.ts` remain adapter surfaces over canonical graph/session truth
- what `Cleanup 8` may reorganize safely:
  - family-local CAD helpers currently split across `src/app/spaghetti/features/`, `src/app/spaghetti/ui/features/`, and `src/app/spaghetti/system/`
  - family-local registry-adjacent wiring that currently forces `nodeRegistry.ts` to act as a mixed assembly point
  - reusable sketch command semantics that are currently embedded inside store- and adapter-adjacent surfaces
- what `Cleanup 8` must not reorganize as if it were only packaging:
  - graph/session ownership
  - accepted-result ownership
  - workspace intent ownership
  - authored-contract convergence across feature-stack and graph-native families, which remains reserved for `Cleanup 8A`
- working packaging direction:
  - package graph-native family-local code toward `src/app/spaghetti/families/<Family>/`
  - package reusable sketch command semantics toward `src/app/spaghetti/sketchCommands/`
  - keep generic shared homes such as `registry/`, `graphCommands/`, `compiler/`, `store/`, `contracts/`, and `selectors/` shared unless a seam is clearly family-local

Implementation result:
- `Cleanup 8` is now explicitly locked as a repo-shape and packaging lane downstream from the shipped `Cleanup 7` owner baseline, not as a second ownership or session-truth lane.
- The main `Phase 2` inventory targets are now explicit:
  - flat mixed family-local helpers in `src/app/spaghetti/features/`
  - split family-local UI views in `src/app/spaghetti/ui/features/`
  - `Output Preview` family helpers in `src/app/spaghetti/system/`
  - registry-adjacent family assembly pressure in `src/app/spaghetti/registry/nodeRegistry.ts`
  - sketch command vocabulary and execution shaping still spread across `useSpaghettiStore.ts`, `NodeView.tsx`, `ViewportOverlay.tsx`, and `useConsoleInteraction.ts`

## [x] Phase 2 - Inventory Mixed Family Placement And Command Drift

Purpose:
- classify the live CAD family-placement and sketch-command seams into honest shared homes, family-local homes, adapter-only surfaces, and compatibility residue

Read:
- `Phase 2` should stay a docs-and-verification pass

Current read:
- `src/app/spaghetti/features/` currently mixes cross-family infrastructure with family-local sketch and extrude helpers in one flat home, which makes it harder to tell what should stay shared versus what should later move under a family root
- `src/app/spaghetti/ui/features/` already reads like a family-local UI home, but it is split away from related family-local compile, contract, and system helpers
- `src/app/spaghetti/system/outputPreviewNode.ts` shows that `Output Preview` already has family-local system logic living outside both `features/` and `ui/features/`, which is a useful seam but also a packaging drift signal
- `src/app/spaghetti/registry/nodeRegistry.ts` currently has to assemble concrete family behavior from several separate homes, which is honest for generic registry plumbing but also a sign of family-local placement pressure
- `src/app/spaghetti/store/useSpaghettiStore.ts`, `src/app/spaghetti/canvas/NodeView.tsx`, `src/app/components/ViewportOverlay.tsx`, and `src/app/console/useConsoleInteraction.ts` still expose sketch draw command shaping spread across canonical store execution and multiple surface adapters

Locked in-scope:
- build one explicit hotspot inventory for:
  - family-local code living in flat shared folders
  - sketch command semantics still spread across store and adapters
  - honest generic shared homes worth preserving
  - compatibility or residue seams that should not shape the target packaging model

Locked out-of-scope:
- moving files
- inventing new family contracts in code
- broad store refactors

Strongest live repo seams:
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
- `src/app/spaghetti/features/extrudeProfileConnections.ts`
- `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
- `src/app/spaghetti/features/extrudeBodyIdentity.ts`
- `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/ui/features/profilePreview.tsx`
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/console/useConsoleInteraction.ts`

Inventory buckets:
- honest generic shared home
- honest family-local home candidate
- honest command-library home candidate
- adapter-only surface
- compatibility residue / leave for later

Initial hotspot clusters:
- `Sketch` family packaging pressure:
  - `featureSchema.ts`
  - `featureTypes.ts`
  - `profileDerivation.ts`
  - `sketchProfileVirtualPorts.ts`
  - `SketchFeatureView.tsx`
  - `profilePreview.tsx`
- `Extrude` family packaging pressure:
  - `featureTypes.ts`
  - `extrudeProfileConnections.ts`
  - `extrudeProfileEntryPorts.ts`
  - `extrudeBodyIdentity.ts`
  - `extrudeBodyVirtualPorts.ts`
  - `ExtrudeFeatureView.tsx`
- `Output Preview` family packaging pressure:
  - `outputPreviewNode.ts`
  - adjacent consumers in `previewPreparation.ts`, `outputSurface.ts`, and viewer selectors
- registry assembly pressure:
  - `nodeRegistry.ts` pulling family-local concerns from several separate homes
- sketch command-library pressure:
  - canonical draw-command execution in `useSpaghettiStore.ts`
  - node-surface command entry in `NodeView.tsx`
  - viewport command forwarding in `ViewportOverlay.tsx`
  - console command grammar and draw-command shaping in `useConsoleInteraction.ts`

Implementation spec:
1. Re-scan the anchor files above against the locked `Cleanup 7` and `Phase 1` boundary.
2. Classify each seam into one of the inventory buckets.
3. Group the findings into the explicit hotspot clusters above rather than leaving them as file-by-file notes.
4. Name the highest-leverage `Phase 3` family-packaging targets.
5. Name the highest-leverage `Phase 4` sketch-command-library targets.
6. Stop once `Phase 3` and `Phase 4` can be written against explicit hotspot buckets instead of intuition.

Stop rule:
- do not move code yet

Checklist:
- [x] re-scan the live seam files against the locked packaging boundary
- [x] classify live mixed family-placement seams
- [x] classify live sketch-command seams
- [x] group the findings into explicit `Sketch`, `Extrude`, `Output Preview`, registry, and sketch-command hotspot clusters
- [x] preserve honest shared homes explicitly
- [x] lock the top `Phase 3` family-packaging targets
- [x] lock the top `Phase 4` sketch-command-library targets

Verification:
- manually confirm the inventory matches the current source layout and command surfaces

Hotspot inventory:
- honest generic shared home:
  - `src/app/spaghetti/graphCommands/`
    - still reads as the shared graph-mutation helper band that should remain generic instead of being absorbed into per-family packaging
  - `src/app/spaghetti/compiler/`
    - still reads as shared graph compile orchestration rather than a family-local home
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - remains the canonical owner of graph/session truth and the final execution boundary for sketch draw commands
  - `src/app/spaghetti/contracts/` and `src/app/spaghetti/selectors/`
    - still read as shared typed-boundary and read-model homes rather than family-local targets
- honest family-local home candidate:
  - `src/app/spaghetti/features/profileDerivation.ts`
    - currently behaves like `Sketch` family logic rather than broad cross-family infrastructure
  - `src/app/spaghetti/features/sketchProfileVirtualPorts.ts`
    - currently behaves like `Sketch` family-local output and wiring logic
  - `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - `src/app/spaghetti/ui/features/profilePreview.tsx`
    - both already read like `Sketch` family UI slices that are simply parked in a split UI-only home
  - `src/app/spaghetti/features/extrudeProfileConnections.ts`
  - `src/app/spaghetti/features/extrudeProfileEntryPorts.ts`
  - `src/app/spaghetti/features/extrudeBodyIdentity.ts`
  - `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
    - these currently read as `Extrude` family-local helpers and views rather than true shared feature infrastructure
  - `src/app/spaghetti/system/outputPreviewNode.ts`
    - currently reads as `Output Preview` family-local system logic and already behaves like a seed family root in all but folder placement
- honest command-library home candidate:
  - the draw-command vocabulary inside `useSpaghettiStore.ts` for:
    - `line`
    - `pline`
    - `rectangle`
    - `circle`
    - `previous`
    - `undo`
    - `enter`
    - `delete`
    - `back`
    - `x`
  - this is still canonical execution, but the command meaning and alias vocabulary are now strong candidates for extraction behind a reusable sketch-command seam
- adapter-only surface:
  - `src/app/spaghetti/canvas/NodeView.tsx`
    - remains a node-surface adapter that should consume packaged family helpers and command-library seams rather than become their permanent home
  - `src/app/components/ViewportOverlay.tsx`
    - remains a viewport adapter that should forward command actions rather than own command semantics
  - `src/app/console/useConsoleInteraction.ts`
    - remains a grammar/router adapter over canonical sketch truth rather than a command-library owner
  - `src/app/spaghetti/ui/features/`
    - remains a family-view presentation area, but its current split placement is itself one of the packaging drifts to resolve
- compatibility residue / leave for later:
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
    - these still mix broader feature-stack and cross-family contract concerns with family-local usage, which makes them real seams to inventory but not safe first-move targets for packaging without crossing into the authored-contract convergence work reserved for `Cleanup 8A`
  - `src/app/spaghetti/registry/nodeRegistry.ts`
    - honest registry plumbing should stay shared, but its current imports from family-local helpers show assembly pressure rather than making the whole file a migration target by itself

Cluster read:
- `Sketch` packaging drift:
  - strongest family-local candidates:
    - `profileDerivation.ts`
    - `sketchProfileVirtualPorts.ts`
    - `SketchFeatureView.tsx`
    - `profilePreview.tsx`
  - caution seams to leave for later:
    - `featureSchema.ts`
    - `featureTypes.ts`
- `Extrude` packaging drift:
  - strongest family-local candidates:
    - `extrudeProfileConnections.ts`
    - `extrudeProfileEntryPorts.ts`
    - `extrudeBodyIdentity.ts`
    - `extrudeBodyVirtualPorts.ts`
    - `ExtrudeFeatureView.tsx`
  - caution seam to leave for later:
    - shared `featureTypes.ts`
- `Output Preview` packaging drift:
  - strongest family-local candidate:
    - `outputPreviewNode.ts`
  - adjacent consumers to keep in view without widening the pass:
    - `previewPreparation.ts`
    - `outputSurface.ts`
    - viewer selectors and tests
- registry assembly pressure:
  - `nodeRegistry.ts` should remain shared registry infrastructure
  - the real drift is that it currently assembles `Sketch`, `Extrude`, and `Output Preview` from helpers scattered across several homes
- sketch command-library drift:
  - canonical execution truth is in `useSpaghettiStore.ts`
  - command entry and forwarding are spread across:
    - `NodeView.tsx`
    - `ViewportOverlay.tsx`
    - `useConsoleInteraction.ts`
  - that split is acceptable as adapters, but the draw-command vocabulary itself is now the clearest candidate for a reusable command-library seam

Implementation result:
- `Phase 3` should target the strongest family-packaging candidates first:
  - `Sketch` family-local helper and view seams
  - `Extrude` family-local helper and view seams
  - `Output Preview` as the clearest already-family-shaped seed seam
- `Phase 4` should target the draw-command vocabulary and alias band as the first sketch-command-library candidate while preserving `useSpaghettiStore.ts` as the execution owner and leaving console, node, and viewport surfaces as adapters.
- `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts` are now explicitly treated as convergence-adjacent caution seams to keep visible without turning `Cleanup 8` into `Cleanup 8A`.

## [x] Phase 3 - Lock The CAD Family Folder Contract

Purpose:
- define one repeatable family-root packaging contract for graph-native CAD node families

Read:
- `Phase 3` should stay a docs-and-verification pass unless the repo scan shows a tiny structural proof slice is necessary

Current read:
- the completed `Phase 2` inventory already shows the main family-local candidates are not evenly distributed
- `Output Preview` is the clearest seed seam because `src/app/spaghetti/system/outputPreviewNode.ts` already behaves like a family-local system home with a stable public identity and multiple downstream consumers
- `Sketch` has the strongest next family-local helper and view candidates in:
  - `profileDerivation.ts`
  - `sketchProfileVirtualPorts.ts`
  - `SketchFeatureView.tsx`
  - `profilePreview.tsx`
- `Extrude` has a similarly coherent helper/view cluster in:
  - `extrudeProfileConnections.ts`
  - `extrudeProfileEntryPorts.ts`
  - `extrudeBodyIdentity.ts`
  - `extrudeBodyVirtualPorts.ts`
  - `ExtrudeFeatureView.tsx`
- `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts` remain convergence-adjacent caution seams, so `Phase 3` should define the folder contract around them without treating them as the first migration targets
- `nodeRegistry.ts` should stay shared registry infrastructure, but the folder contract should reduce how many scattered family-local imports it needs to assemble a concrete family definition

Locked in-scope:
- lock the preferred family-root path and sub-areas
- define what stays in family roots versus what stays shared
- identify the strongest candidate families and one narrow first extraction path

Locked out-of-scope:
- full family migration
- authored-contract convergence across every family
- broad registry redesign
- moving the caution seams that belong to `Cleanup 8A`

Preferred contract:
- family root:
  - `src/app/spaghetti/families/<Family>/`
- likely family-local sub-areas:
  - `contracts/`
  - `compile/`
  - `ui/`
  - `system/`
  - `tests/`

Shared homes that should remain shared:
- `src/app/spaghetti/registry/`
- `src/app/spaghetti/graphCommands/`
- `src/app/spaghetti/compiler/`
- `src/app/spaghetti/store/`
- `src/app/spaghetti/contracts/`
- `src/app/spaghetti/selectors/`

Primary family-root candidates from `Phase 2`:
- `Sketch`
  - `profileDerivation.ts`
  - `sketchProfileVirtualPorts.ts`
  - `SketchFeatureView.tsx`
  - `profilePreview.tsx`
- `Extrude`
  - `extrudeProfileConnections.ts`
  - `extrudeProfileEntryPorts.ts`
  - `extrudeBodyIdentity.ts`
  - `extrudeBodyVirtualPorts.ts`
  - `ExtrudeFeatureView.tsx`
- `OutputPreview`
  - `outputPreviewNode.ts`
  - adjacent read-through consumers in `previewPreparation.ts`, `outputSurface.ts`, and viewer selectors should stay visible but should not force a broad cross-folder migration in the first extraction slice

Recommended first extraction shape:
- first seed family:
  - `OutputPreview`
- follow-on family candidates after the seed:
  - `Sketch`
  - `Extrude`
- reason:
  - `Output Preview` is already the least entangled and most obviously family-local seam
  - `Sketch` and `Extrude` are strong next candidates, but both still touch caution seams that should stay visible until the family-root contract is locked clearly

Done shape:
- one explicit folder contract that answers where family-local contracts, compile helpers, UI views, system helpers, and tests belong
- one explicit rule that `nodeRegistry.ts` stays shared and consumes family entry seams instead of remaining a mixed family assembly bucket
- one explicit first extraction recommendation for `Phase 5`

Implementation spec:
1. Re-read the completed `Phase 2` inventory and keep the `Cleanup 8A` caution seams out of the first packaging target set.
2. Lock one preferred family-root folder contract.
3. Define the "belongs in family root" versus "stays shared" rules.
4. Apply that rule to the live `Sketch`, `Extrude`, and `Output Preview` seams.
5. Name the narrowest first family extraction candidate for `Phase 5`, with a backup candidate if the seed seam proves too coupled.
6. Stop before broad file movement.

Stop rule:
- do not perform the full extraction in this phase

Checklist:
- [x] re-read the completed `Phase 2` inventory against the `Cleanup 8A` caution seams
- [x] lock the preferred family-root path
- [x] define family-local sub-areas
- [x] define which existing shared homes stay shared
- [x] apply the contract to `Sketch`, `Extrude`, and `Output Preview`
- [x] pick one narrow first extraction candidate and one backup candidate

Verification:
- manually confirm the contract can map onto the current `Sketch`, `Extrude`, and `Output Preview` seams without reopening `Cleanup 7` ownership

Family folder contract:
- preferred family-root path:
  - `src/app/spaghetti/families/<Family>/`
- preferred family-local sub-areas:
  - `contracts/`
  - `compile/`
  - `ui/`
  - `system/`
  - `tests/`
- belongs in family root:
  - family-local compile/lowering helpers
  - family-local ports and virtual-port helpers
  - family-local UI views and preview helpers
  - family-local system helpers
  - family-local tests
- stays shared:
  - `src/app/spaghetti/registry/`
    - generic registry plumbing and node-definition lookup
  - `src/app/spaghetti/graphCommands/`
    - shared graph mutation primitives
  - `src/app/spaghetti/compiler/`
    - graph-wide orchestration
  - `src/app/spaghetti/store/`
    - canonical graph/session truth
  - `src/app/spaghetti/contracts/`
    - shared typed boundaries
  - `src/app/spaghetti/selectors/`
    - shared read-model surfaces
- explicit caution seams kept out of the first migration target set:
  - `featureSchema.ts`
  - `featureTypes.ts`
  - `compileFeatureStack.ts`
  - these remain visible convergence-adjacent seams for `Cleanup 8A`

Family application read:
- `OutputPreview`
  - strongest current family-local seam:
    - `src/app/spaghetti/system/outputPreviewNode.ts`
  - first packaged target shape:
    - move the family-local helper into `families/OutputPreview/system/`
  - adjacent consumers such as `previewPreparation.ts`, `outputSurface.ts`, and viewer selectors should repoint to the family seam without forcing a broad second move
- `Sketch`
  - strongest current family-local seams:
    - `profileDerivation.ts`
    - `sketchProfileVirtualPorts.ts`
    - `SketchFeatureView.tsx`
    - `profilePreview.tsx`
  - first packaged target shape after the seed:
    - family-local compile and UI helpers under `families/Sketch/`
- `Extrude`
  - strongest current family-local seams:
    - `extrudeProfileConnections.ts`
    - `extrudeProfileEntryPorts.ts`
    - `extrudeBodyIdentity.ts`
    - `extrudeBodyVirtualPorts.ts`
    - `ExtrudeFeatureView.tsx`
  - first packaged target shape after the seed:
    - family-local compile and UI helpers under `families/Extrude/`

Registry rule:
- `src/app/spaghetti/registry/nodeRegistry.ts` stays shared registry infrastructure.
- The goal is not to migrate registry code into family roots.
- The goal is to let registry definitions depend on fewer scattered family-local helpers by giving each packaged family a clearer import seam.

Implementation result:
- `Cleanup 8` now has one explicit CAD family-root contract under `src/app/spaghetti/families/<Family>/` with named sub-areas and a matching shared-home boundary.
- `OutputPreview` is now locked as the first narrow extraction seed for `Phase 5`.
- `Sketch` is now locked as the backup family candidate if the `OutputPreview` seed slice proves too coupled.
- `Extrude` remains in the first packaging band, but behind the seed and backup candidates.
- `Phase 5` can now focus on one honest family-root extraction slice instead of reopening the folder contract or the shared-versus-family boundary.

## [x] Phase 4 - Lock The Sketch Command-Library Contract

Purpose:
- define one reusable sketch-command-library boundary that separates pure command meaning from console, viewport, and node-surface adapters

Read:
- `Phase 4` should stay a docs-and-verification pass unless a tiny naming proof is needed

Current read:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - remains the canonical sketch-session and sketch-command execution owner through `runGeometrySketchDrawCommand(...)`
  - already carries the concrete draw-command vocabulary and state transitions for:
    - `line`
    - `pline`
    - `rectangle`
    - `circle`
    - `previous`
    - `undo`
    - `enter`
    - `delete`
    - `back`
    - `x`
- `src/app/console/stagedNavigation.ts`
  - already exposes a reusable staged action vocabulary for the first draw tools through:
    - `sketchdraw.tool.line`
    - `sketchdraw.tool.pline`
    - `sketchdraw.tool.rectangle`
    - `sketchdraw.tool.circle`
  - already packages that band under `createSketchDrawRootSession(...)`
- `src/app/console/useConsoleInteraction.ts`
  - still repeats staged action id to draw-command mapping in more than one submit path
  - still owns the typed alias band for:
    - `line` / `l`
    - `pline` / `pl`
    - `rectangle` / `rec`
    - `circle` / `cc`
    - `previous` / `p`
    - `back` / `b`
  - still forwards directly into `runGeometrySketchDrawCommand(...)`
- `src/app/components/ViewportOverlay.tsx`
  - still forwards the first tool band directly from overlay buttons into `runGeometrySketchDrawCommand(...)`
  - still carries direct forwarding for the immediate companion commands such as `enter`, `back`, and `x`
- `src/app/spaghetti/canvas/NodeView.tsx`
  - remains an adapter surface that should read packaged sketch-command metadata and session state rather than become the permanent home for command meaning
- this means the current live drift is no longer command ownership, which already belongs to the store
- the current live drift is command-library shape:
  - repeated command ids
  - repeated alias vocabulary
  - repeated staged action to command mapping
  - repeated command metadata and display vocabulary that should not keep spreading across adapters

Locked in-scope:
- lock the preferred command-library path
- define what belongs in pure command logic versus adapters
- identify the first narrow command set for extraction

Locked out-of-scope:
- moving every sketch command at once
- rewriting console grammar
- changing session ownership in `useSpaghettiStore.ts`
- changing pointer-capture, overlay-chrome, or toolbar-visibility behavior
- broad sketch-session reducer cleanup beyond what the command-library contract needs to describe
- moving later advanced commands such as `move`, `stretch`, `polygon`, `join`, `explode`, `dimensions`, `copy`, `rotate`, or `mirror`

Preferred contract:
- command-library root:
  - `src/app/spaghetti/sketchCommands/`
- pure command library may own:
  - command ids
  - command metadata
  - state-transition helpers
  - staged action id to canonical command mapping helpers
  - typed alias normalization helpers
  - reusable execution helpers over canonical sketch-session truth
- `useSpaghettiStore.ts` remains the execution owner:
  - the command library should help describe and normalize sketch commands
  - the store should still remain the final canonical surface that mutates sketch-session truth
- adapters remain in:
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/useConsoleInteraction.ts`
  - `src/app/components/ViewportOverlay.tsx`
  - `src/app/spaghetti/canvas/NodeView.tsx`

First extraction command band:
- `line`
- `pline`
- `rectangle`
- `circle`

Immediate companion command band to carry with the first tools:
- `previous`
- `undo`
- `enter`
- `delete`
- `back`
- `x`

Later command band:
- `move`
- `stretch`
- `polygon`
- `join`
- `explode`
- `dimensions`
- `copy`
- `rotate`
- `mirror`

Primary live command seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - canonical execution and session-truth seam
- `src/app/console/stagedNavigation.ts`
  - staged sketch-draw action-id vocabulary
- `src/app/console/useConsoleInteraction.ts`
  - repeated action-to-command mapping plus typed alias routing
- `src/app/components/ViewportOverlay.tsx`
  - overlay button and action forwarding seam
- `src/app/spaghetti/canvas/NodeView.tsx`
  - downstream node-surface adapter that should consume command metadata rather than define command meaning

Done shape:
- one explicit rule that `src/app/spaghetti/sketchCommands/` owns the reusable command vocabulary, metadata, alias normalization, and staged-action mapping for the first draw-command band
- one explicit rule that `useSpaghettiStore.ts` remains the final sketch-command execution and session-truth owner
- one explicit first extraction recommendation for `Phase 5` that moves the first draw tools and their immediate companion commands behind the shared command-library seam before touching later advanced commands

Implementation spec:
1. Re-read the completed `Phase 2` inventory and preserve the `Cleanup 7` rule that command adapters are downstream from store-owned sketch truth.
2. Lock one preferred sketch-command-library path under `src/app/spaghetti/sketchCommands/`.
3. Define the precise split between:
   - reusable command-library responsibilities
   - store-owned execution responsibilities
   - console, viewport, and node-surface adapter responsibilities
4. Apply that rule to the live command seams in `useSpaghettiStore.ts`, `stagedNavigation.ts`, `useConsoleInteraction.ts`, and `ViewportOverlay.tsx`.
5. Name the smallest first extraction band for `Phase 5`:
   - first draw tools
   - immediate companion commands
   - smallest honest consumer repoints
6. Stop before broad runtime movement or full command migration.

Stop rule:
- do not rewrite the whole sketch session engine here

Checklist:
- [x] re-read the `Phase 2` command-drift inventory against the shipped `Cleanup 7` owner baseline
- [x] lock the preferred command-library path
- [x] define reusable command-library versus store-execution versus adapter boundaries
- [x] classify the live staged action ids, typed aliases, and draw-command band against that boundary
- [x] pick one narrow first extraction command band plus its immediate companion commands
- [x] name the smallest honest runtime consumer set for the later repoint

Verification:
- manually confirm the proposed command-library boundary still preserves store-owned session truth and adapter-only console/viewport/node surfaces
- manually confirm the live draw-command vocabulary, staged action ids, alias band, and viewport forwarding seams still match the current read above

Implementation result:
- `src/app/spaghetti/sketchCommands/` is now locked as the reusable command-library home for the first sketch draw-command band:
  - canonical draw-tool vocabulary
  - immediate companion command vocabulary
  - command metadata
  - alias normalization
  - staged action id to canonical command mapping
- `src/app/spaghetti/store/useSpaghettiStore.ts` remains the final execution and sketch-session owner:
  - `runGeometrySketchDrawCommand(...)` should keep mutating canonical sketch-session truth
  - the first extraction should narrow repeated command meaning around that owner instead of moving mutation ownership away from it
- `src/app/console/stagedNavigation.ts` remains an adapter-side staged-choice home:
  - it may continue owning staged session structure and prompt choices
  - it should stop being the permanent second home for draw-command meaning once the shared command-library seam lands
- `src/app/console/useConsoleInteraction.ts` is now locked as the top `Phase 5` command drift target:
  - repeated staged action to command mapping
  - repeated typed alias routing
  - repeated draw-command help/read surfaces
- `src/app/components/ViewportOverlay.tsx` is now locked as the second `Phase 5` command drift target:
  - repeated first-tool-band metadata and direct command forwarding should be repointed to the shared command-library seam
- `src/app/spaghetti/canvas/NodeView.tsx` remains a downstream adapter-only read surface to keep in view, but it is not the first extraction target.
- the first `Phase 5` command extraction slice is now explicit:
  - tools:
    - `line`
    - `pline`
    - `rectangle`
    - `circle`
  - immediate companion commands:
    - `previous`
    - `undo`
    - `enter`
    - `delete`
    - `back`
    - `x`
  - smallest honest runtime consumer set:
    - `useSpaghettiStore.ts`
    - `useConsoleInteraction.ts`
    - `ViewportOverlay.tsx`

## [x] Phase 5 - Prove The Contract With One Narrow Extraction

Purpose:
- implement one narrow family-packaging and command-library extraction slice that proves the new contract is workable without widening into a repo-wide migration

Read:
- `Phase 5` should be the first code-and-verification pass in this lane

Current read:
- the completed `Phase 3` contract already picked `OutputPreview` as the narrowest first family seed
- the live `OutputPreview` family-local helper cluster is still concentrated in:
  - `src/app/spaghetti/system/outputPreviewNode.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSingleton.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.ts`
- the current downstream consumer band for that seed is legible and bounded:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/outputSurface.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- that makes `OutputPreview` the strongest first family extraction because:
  - it already behaves like a family-local system cluster
  - it has a stable public identity
  - it has fewer convergence-adjacent ties than `Sketch` or `Extrude`
- the completed `Phase 4` contract already picked the first command-library slice:
  - draw tools:
    - `line`
    - `pline`
    - `rectangle`
    - `circle`
  - immediate companion commands:
    - `previous`
    - `undo`
    - `enter`
    - `delete`
    - `back`
    - `x`
- the live command drift for that slice is still concentrated in:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
    - canonical execution and prompt/session read helpers
  - `src/app/console/useConsoleInteraction.ts`
    - repeated staged action to command mapping
    - repeated typed alias routing
    - repeated draw-help text
  - `src/app/components/ViewportOverlay.tsx`
    - repeated first-tool-band metadata and direct command forwarding
- `src/app/console/stagedNavigation.ts` remains in view as the staged-choice vocabulary surface, but the smallest honest first repoint is still the store, console interaction, and viewport overlay set rather than a full staged-navigation redesign

Locked in-scope:
- one narrow family extraction slice
- one narrow sketch-command extraction slice
- repoint the smallest honest set of consumers

Locked out-of-scope:
- full multi-family migration
- full sketch-command migration
- authored-contract convergence work for `Cleanup 8A`
- moving `Sketch` or `Extrude` family helpers in the same pass as the seed unless the `OutputPreview` slice is unexpectedly blocked
- rewriting console staged-session architecture beyond consuming the new command-library seam
- broad node-surface cleanup in `NodeView.tsx`

Recommended first extraction shape:
- family slice:
  - move the `OutputPreview` helper cluster into:
    - `src/app/spaghetti/families/OutputPreview/system/`
- command slice:
  - move the first draw-command band plus immediate companion commands behind one reusable seam in:
    - `src/app/spaghetti/sketchCommands/`

Recommended consumer repoints:
- family consumers:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewportOverlay.tsx`

Done shape:
- one new `families/OutputPreview/system/` seed seam exists and the bounded `OutputPreview` consumers read from it instead of the older flat `system/` placement
- one new `sketchCommands/` seed seam exists for:
  - canonical draw-tool ids
  - immediate companion-command ids
  - alias normalization
  - staged action id to canonical command mapping
  - reusable command metadata/read helpers
- `useSpaghettiStore.ts` still owns final sketch-command execution and sketch-session mutation
- `useConsoleInteraction.ts` and `ViewportOverlay.tsx` read through the new shared command-library seam instead of each carrying their own first-band command meaning
- focused proof covers both the new family seam and the new command-library seam without widening into broad suite churn

Implementation spec:
1. Create the minimal new roots needed for the first dual extraction:
   - `src/app/spaghetti/families/OutputPreview/system/`
   - `src/app/spaghetti/sketchCommands/`
2. Move the bounded `OutputPreview` helper cluster into the family root and preserve its public exports cleanly.
3. Repoint the smallest bounded `OutputPreview` consumer set:
   - `nodeRegistry.ts`
   - `previewPreparation.ts`
   - `outputSurface.ts`
   - `useSpaghettiStore.ts`
4. Extract the first sketch-command band into `sketchCommands/`:
   - draw tools
   - immediate companion commands
   - alias normalization
   - staged action id to canonical command mapping
   - reusable metadata/read helpers
5. Repoint the smallest honest command consumers:
   - `useSpaghettiStore.ts`
   - `useConsoleInteraction.ts`
   - `ViewportOverlay.tsx`
6. Add focused proof around the new family and command seams.
7. Stop before the lane turns into:
   - `Sketch` or `Extrude` family migration
   - full staged-navigation redesign
   - broad node-surface cleanup

Stop rule:
- do not widen beyond the chosen seed slices

Checklist:
- [x] create the minimal `families/OutputPreview/system/` and `sketchCommands/` roots
- [x] extract the bounded `OutputPreview` helper cluster
- [x] repoint the smallest bounded `OutputPreview` consumer set
- [x] extract the first draw-tool and companion-command band into `sketchCommands/`
- [x] repoint `useSpaghettiStore.ts`, `useConsoleInteraction.ts`, and `ViewportOverlay.tsx`
- [x] add focused proof for the family and command seams
- [x] verify with targeted tests plus build

Verification:
- targeted tests covering:
  - the extracted `OutputPreview` family seam
  - the extracted sketch-command seam
  - the repointed console and viewport command consumers
- `cmd /c npm.cmd run build`

Implementation result:
- the first family extraction seed now exists at:
  - `src/app/spaghetti/families/OutputPreview/system/outputPreviewNode.ts`
  - `src/app/spaghetti/families/OutputPreview/system/ensureOutputPreviewSingleton.ts`
  - `src/app/spaghetti/families/OutputPreview/system/ensureOutputPreviewSlots.ts`
- the older flat `src/app/spaghetti/system/` `OutputPreview` files are now narrow compatibility re-export seams with an explicit retirement condition instead of remaining the target home
- the bounded `OutputPreview` consumer repoint landed in:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/outputSurface.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- the first shared sketch command-library seed now exists at:
  - `src/app/spaghetti/sketchCommands/drawCommands.ts`
- that new shared command seam now owns the first extracted band:
  - canonical draw-tool ids
  - immediate companion-command ids
  - alias normalization
  - staged action id to canonical command mapping
  - shared first-band labels and help text
- the bounded command repoint landed in:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/console/useConsoleInteraction.ts`
  - `src/app/components/ViewportOverlay.tsx`
- focused proof now exists in:
  - `src/app/spaghetti/sketchCommands/drawCommands.test.ts`
  - `src/app/spaghetti/families/OutputPreview/system/outputPreviewFamily.test.ts`
- the existing console and viewport proof surfaces still pass against the repointed shared seams, so the lane now has one proven dual extraction without widening into `Sketch`, `Extrude`, or a staged-navigation redesign

## [x] Phase 6 - Proof, Cleanup, And Cleanup 8A Handoff

Purpose:
- prove the first extraction holds and hand the remaining authored-contract questions forward without blurring `Cleanup 8` into `Cleanup 8A`

Read:
- `Phase 6` should be a proof-and-doc-closeout pass unless `Phase 5` exposes one small structural correction

Current read:
- `Phase 5` already proved the first family-root and command-library seed can land without reopening ownership:
  - `src/app/spaghetti/families/OutputPreview/system/`
  - `src/app/spaghetti/sketchCommands/drawCommands.ts`
- the strongest live proof surfaces for that extraction now exist in:
  - `src/app/spaghetti/families/OutputPreview/system/outputPreviewFamily.test.ts`
  - `src/app/spaghetti/sketchCommands/drawCommands.test.ts`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/components/ViewportOverlay.test.tsx`
- the strongest remaining packaging follow-ons are now clearer but should stay as follow-ons rather than becoming part of the closeout pass:
  - broader `OutputPreview` import retirement outside the bounded repoint set, where the old `src/app/spaghetti/system/` files are still compatibility shims
  - later family packaging candidates:
    - `Sketch`
    - `Extrude`
  - later sketch command-library adoption targets still outside the first repoint band:
    - `src/app/console/stagedNavigation.ts`
    - `src/app/spaghetti/canvas/NodeView.tsx`
- the strongest convergence-adjacent seams that must be handed to `Cleanup 8A` rather than resolved here are still:
  - `src/app/spaghetti/features/featureSchema.ts`
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/features/compileFeatureStack.ts`
  - any question about whether graph-native family-local contracts and feature-stack contracts should merge or stay distinct

Locked in-scope:
- proof over the new family and command-library seams
- residual-gap inventory for later family migrations
- explicit handoff notes for `Cleanup 8A`

Locked out-of-scope:
- starting the next large family move
- reopening feature-stack versus graph-native authored-contract questions directly
- widening the `OutputPreview` compatibility-shim retirement into a repo-wide import rewrite
- expanding the first command-library seed into a full staged-navigation or node-surface rewrite

Proof surfaces to use first:
- `src/app/spaghetti/families/OutputPreview/system/outputPreviewFamily.test.ts`
- `src/app/spaghetti/sketchCommands/drawCommands.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`

Residual follow-on buckets to record:
- family packaging follow-ons:
  - retire the remaining `OutputPreview` compatibility imports once the rest of the repo is ready
  - package the next family candidates:
    - `Sketch`
    - `Extrude`
- command-library follow-ons:
  - extend shared command-library adoption into:
    - `stagedNavigation.ts`
    - `NodeView.tsx`
  - keep store-owned execution and adapter-only surfaces intact while that happens
- convergence questions for `Cleanup 8A`:
  - feature-stack versus graph-native family contract overlap
  - whether current shared feature schema/types/compile helpers should stay shared, split, or converge into a clearer authored-contract surface

Implementation spec:
1. Re-read the landed `Phase 5` extraction against the cleanup vision and cleanup index so the closeout remains a packaging proof pass rather than a second implementation lane.
2. Re-run or tighten the focused proof surfaces only if needed to show the new family-root and command-library seams remain honest.
3. Record the narrow remaining packaging follow-ons that now have a clearer destination but do not belong in this closeout pass.
4. Write one explicit `Cleanup 8A` handoff block that separates:
   - packaging follow-ons that still belong to `Cleanup 8`
   - authored-contract convergence questions that now belong to `Cleanup 8A`
5. Stop once the packaging pattern is proven, the residual packaging work is named, and the `Cleanup 8A` boundary is explicit.

Stop rule:
- do not continue into another broad extraction after the first proof slice lands

Checklist:
- [x] re-read the landed `Phase 5` extraction against `Cleanup-Vision.md` and `Cleanup-Index.md`
- [x] prove the first family-root slice
- [x] prove the first command-library slice
- [x] name the remaining packaging follow-ons without starting them
- [x] hand authored-contract convergence questions to `Cleanup 8A`

Verification:
- targeted proof commands for the extracted seams:
  - `cmd /c npm.cmd test -- src/app/spaghetti/sketchCommands/drawCommands.test.ts src/app/spaghetti/families/OutputPreview/system/outputPreviewFamily.test.ts`
  - `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "accepts l as a sketch-local alias for line on submit"`
  - `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "executes sketch draw from staged navigation and clears the staged session"`
  - `cmd /c npm.cmd test -- src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npm.cmd run build`

Done shape:
- `Cleanup 8` ends with one explicitly proven packaging pattern:
  - one family-root seed
  - one command-library seed
- the remaining packaging work is recorded as follow-on packaging, not left as fuzzy residue
- the authored-contract convergence questions are handed cleanly to `Cleanup 8A`
- the lane is ready either for shipped doc cleanup if no more packaging follow-ons are needed, or for a clearly scoped additional `Cleanup 8` packaging pass if the user wants to keep pushing packaging before `8A`

Implementation result:
- the focused proof band still holds after the landed `Phase 5` extraction:
  - `src/app/spaghetti/families/OutputPreview/system/outputPreviewFamily.test.ts`
  - `src/app/spaghetti/sketchCommands/drawCommands.test.ts`
  - the targeted console sketch draw continuity proofs in `src/app/console/ConsoleDock.test.tsx`
  - `src/app/components/ViewportOverlay.test.tsx`
  - `cmd /c npm.cmd run build`
- `Cleanup 8` now ends with one explicitly proven packaging pattern:
  - one family-root seed under `src/app/spaghetti/families/OutputPreview/system/`
  - one shared command-library seed under `src/app/spaghetti/sketchCommands/drawCommands.ts`
- the remaining packaging follow-ons are now explicit but still packaging-only:
  - retire the remaining repo-wide `OutputPreview` compatibility imports once the rest of the consumer surface is ready
  - package the next family candidates:
    - `Sketch`
    - `Extrude`
  - extend command-library adoption later into:
    - `src/app/console/stagedNavigation.ts`
    - `src/app/spaghetti/canvas/NodeView.tsx`
- those follow-ons are intentionally separate from the authored-contract convergence questions, which now hand off cleanly to `Cleanup 8A`

Cleanup 8A handoff:
- `Cleanup 8` proved the repo-shape direction:
  - family-local code can move into a family-root seam
  - shared sketch command meaning can move into a command-library seam
  - store-owned execution and adapter-only surfaces can remain intact while packaging improves
- `Cleanup 8A` should take the convergence-adjacent questions that `Cleanup 8` explicitly did not reopen:
  - whether `featureSchema.ts`, `featureTypes.ts`, and `compileFeatureStack.ts` should stay shared, split, or converge into a clearer authored-contract surface
  - whether graph-native family-local contracts and feature-stack contracts should remain distinct or move toward one more explicit shared authored-contract model
  - any cross-family contract vocabulary decisions that cut across `Sketch`, `Extrude`, and later graph-native CAD families
- that means `Cleanup 8A` should begin from a now-proven packaging baseline rather than having to answer repo-shape and authored-contract questions at the same time

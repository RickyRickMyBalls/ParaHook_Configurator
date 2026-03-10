# FS - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
5. 2026-03-08 00:00: Added a cautious `L` legacy pass across the confirmed `FS` phases, marking only the explicit transitional seams that look like compatibility aliases, proof-path scaffolding, debug-only naming debt, or preserved legacy identity behavior that may later be removed
4. 2026-03-08 00:00: Rebuilt `FS - Phase 9` through `FS - Phase 15` from `docs/CHANGELOG.md`, adding grouped detailed checklists, file-footprint sections, and stronger summaries so the `FS` family file now carries the concrete implementation history instead of only thin placeholders
3. 2026-03-08 00:00: Updated this family file to the settled family phase-plan layout by removing `Doc Body`, moving phase titles to `##`, adding the overview-side `Fold Hack 4` wrapper, and keeping checklist content directly visible under each phase checklist
2. 2026-03-07 17:31: Normalized this file to the newer family phase-plan layout so it matches the `OO` structure more closely, with `####` overview/checklist buckets and `#####` only for deeper detail
1. 2026-03-07 16:50: Built this file as the family-level `FS` phase doc using `docs/CHANGELOG.md` as the primary evidence source and the existing family docs as the structure template

##### Purpose

This file is the simple phase-family history document for the `FS` prefix.

Use this file for:
- the canonical `FS` phase sequence
- a simple explanation of what each `FS` phase did
- understanding how the feature-stack system evolved over time
- seeing where major `FS` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `FS` Means

`FS` is the canonical feature-stack prefix.

It is used when the main work is about:
- feature-stack runtime structure
- feature-stack pipeline execution
- renderable part flow through the part pipeline
- feature-stack contracts and dependency structure
- multi-part feature-stack support

##### Format And Depth

Use this file as the planning and checklist home for canonical `FS` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [?] - FS - Phases 1-8 - `Unconfirmed Early Feature Stack Gap`

Human Summary: The current changelog evidence for `FS` begins at `Phase 9`, so the earlier feature-stack phases remain an explicit unresolved gap rather than invented completed history.

### Phase 1-8 Overview
#### Fold Hack 4

##### Phase Notes

This is a grouped early-gap block rather than eight separate placeholder phases.

The current confirmed `FS` family story in `docs/CHANGELOG.md` starts at `FS - Phase 9`.

##### Phase Summary

Current understanding:
- there is not enough visible changelog evidence to lock a canonical `FS - Phase 1` through `Phase 8`
- earlier feature-stack groundwork may exist in older history, but it is not yet consolidated into the current family story
- this grouped gap keeps the numbering honest without creating a large run of empty placeholder sections

### Phase 1-8 CheckList

- [ ] search older history/docs for confirmed canonical `FS - Phase 1-8` evidence
- [ ] split this grouped gap into real phases only if stronger evidence is found

## [x] - FS - Phase 9 - `Feature Stack v1 App-Layer Alignment`

Human Summary: This aligned the first modern feature-stack work with the app layer so the stack could fit the current product/UI architecture instead of living as a detached experimental path.

### Phase 9 Overview
#### Fold Hack 4

##### Phase Notes

This is the first confirmed `FS` phase in the visible modern changelog block.

##### Phase Summary

Main outcomes:
- aligned canonical feature-stack helpers, diagnostics, and compile emission to one app-layer contract
- locked deterministic profile derivation, profile-id generation, and default profile linking at the app layer
- updated the store and feature-stack UI to use the canonical helpers instead of local compatibility paths
- prepared the stack for the later worker-pipeline and debug-preview phases by keeping compile-owned IR shape deterministic

##### Files Changed

- `src/app/spaghetti/features/profileDerivation.ts`
- `src/app/spaghetti/features/autoLink.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/profileDerivation.test.ts`
- `src/app/spaghetti/features/autoLink.test.ts`

### Phase 9 CheckList

- [x] add canonical profile derivation exports:
  - `hashFnv1a32(str)`
  - `profileIdFromSignature(sig)`
  - `deriveProfiles(entities)`
- [x] keep compatibility aliases for the previous profile-derivation and auto-link helpers
- [L] retire the compatibility aliases `deriveProfilesFromLines` and `findDefaultExtrudeProfileRef` once callers/tests only use the canonical helper names
- [x] align diagnostics to the canonical `{ featureId, level, message }` shape
- [x] lock deterministic profile derivation rules for point keys, traversal, signature normalization, zero-area rejection, and stable output sorting
- [x] update the store and UI to use canonical `deriveProfiles(...)` and `pickDefaultProfileRef(...)`
- [x] recompute sketch profile outputs immediately after line edits
- [x] make feature-stack UI diagnostics and keys deterministic
- [x] align `sp_featureStackIR` compile emission to non-empty feature-stack presence
- [x] preserve the current IR payload shape and deterministic part-key mapping

## [x] - FS - Phase 10 - `Feature Stack v1 Worker Pipeline`

Human Summary: This pushed the feature stack through a worker-pipeline execution model so the runtime path moved closer to a real end-to-end stack pipeline.

### Phase 10 Overview
#### Fold Hack 4

##### Phase Notes

This phase is currently represented by the `Option-B Runtime Execution` entry in the changelog.

##### Phase Summary

Main outcomes:
- emitted Option-B sketch payload data from app compile with deterministic resolved profiles
- added a worker-side feature-stack runtime that executes parts/features in stable order and treats app-emitted profile ids as authoritative
- integrated runtime execution into the active worker build path through a thin `buildModel` coordinator while preserving legacy artifact output
- locked deterministic runtime diagnostics and mesh-pack merge behavior without changing protocol or scheduler contracts

##### Files Changed

- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/worker/cad/cadTypes.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/products/foothook/buildFoothook.ts`

### Phase 10 CheckList

- [x] emit `profilesResolved` loop geometry for sketch ops from app compile
- [x] normalize runtime loop closure and ordering for Option-B sketch payloads
- [L] retire the `Option-B` naming once this runtime path is no longer being treated as one branch among multiple competing FS execution paths
- [x] add worker feature-stack runtime execution in sorted part-key and IR feature order
- [x] treat compile-emitted `profileId` as authoritative at runtime
- [x] extrude by `profileRef.profileId` with deterministic `bodyId` handling and first-wins duplicate policy
- [x] use deterministic mesh-pack merge semantics instead of claiming CAD boolean fuse behavior
- [x] add bounded deterministic diagnostics with one worker-side flush per build
- [x] integrate runtime execution into the active build path without changing the legacy `PartArtifact[]` envelope
- [L] replace the preserved legacy `PartArtifact[]` transitional envelope only if a stronger repo-wide canonical FS artifact contract fully supersedes it

## [x] - FS - Phase 11 - `Feature Stack v1 Debug Preview`

Human Summary: This added an app-layer IR-driven debug preview so feature-stack output could be inspected more directly while the system was still being brought online.

### Phase 11 Overview
#### Fold Hack 4

##### Phase Notes

This phase follows directly from the v1 worker-pipeline work.

##### Phase Summary

Main outcomes:
- added deterministic Feature Stack Debug Preview driven by compile-path IR rather than UI-side recompilation
- extracted shared compile helpers so payload emission and UI cache use the same part-IR derivation path
- added sketch and extrude preview surfaces with deterministic ordering, labels, diagnostics, and formatting
- locked part-node panel placement so Feature Stack sits in the canonical `uiSections -> params -> Feature Stack` order

##### Files Changed

- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- `src/app/spaghetti/ui/features/profilePreview.tsx`
- `src/app/spaghetti/ui/features/profilePreview.test.ts`
- `src/app/theme/v15Theme.css`

### Phase 11 CheckList

- [x] add deterministic Feature Stack Debug Preview driven by compile-path IR
- [x] extract a shared compile helper so payload emission and UI cache use the same derivation path
- [x] add store-level cache and selector access for per-part Feature Stack IR by node id
- [x] add sketch profile SVG previews with deterministic fit mapping, loop enforcement, labels, and numeric formatting
- [x] add extrude preview summaries and profile highlighting keyed strictly on `profileRef.profileId`
- [x] apply deterministic diagnostics sort/key policy and per-level badge counts
- [x] keep Feature Stack panel placement locked to `uiSections -> params -> Feature Stack`
- [L] absorb the dedicated debug-preview naming/surface into the normal Feature Stack inspection UI later if the separate debug-only framing stops carrying real value

## [x] - FS - Phase 12 - `First Renderable Part Through Existing Part Pipeline`

Human Summary: This got the first renderable part all the way through the existing part pipeline, proving that the feature-stack work could feed a real visible part path instead of staying theoretical.

### Phase 12 Overview
#### Fold Hack 4

##### Phase Notes

This is a key proof phase in the visible `FS` sequence.

##### Phase Summary

Main outcomes:
- added `Part/CubeProof` as a minimal proof node with a deterministic rectangle-to-extrude default Feature Stack
- extended compile-time part ownership so graph compile maps the proof node to canonical `cubeProof` part ownership
- reused the existing worker/runtime and OutputPreview path instead of inventing a parallel mesh-output architecture
- proved that graph-produced feature-stack parts can travel through the current artifact, selector, and viewer pipeline end to end

##### Files Changed

- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`

### Phase 12 CheckList

- [x] add `Part/CubeProof` as a deterministic proof node with rectangle-to-extrude default stack content
- [L] retire the dedicated `Part/CubeProof` proof path once normal part nodes cover the same proof/integration role without a special demo node
- [x] map `Part/CubeProof` to canonical `cubeProof` part ownership in compile-time part ownership logic
- [x] document the handoff from part node type to compile-owned `partKey`
- [x] document the handoff from OutputPreview slot edge to `nodeId -> partKey -> artifact` lookup
- [x] reuse `sp_featureStackIR` worker execution in the existing pipeline instead of adding a separate path
- [x] emit graph-produced `cubeProof` output through the existing `PartArtifact { kind: 'box', params }` envelope
- [x] relax artifact validation only enough to accept graph-produced non-legacy part ids while preserving existing ordering behavior
- [x] add deterministic compile/runtime/selector coverage for proof-part flow and unresolved-slot behavior

## [x] - FS - Phase 13 - `Feature Stack Solid Contract Lock`

Human Summary: This hardened the feature-stack contract around solid behavior so later expansion work had a more trustworthy baseline.

### Phase 13 Overview
#### Fold Hack 4

##### Phase Notes

This phase reads as a contract-locking checkpoint before the broader expansion work in Phase 14.

##### Phase Summary

Main outcomes:
- locked `src/shared/buildTypes.ts` as the canonical solid artifact contract for feature-stack-produced parts
- made `PartArtifact` require canonical part identity and collapsed competing shared type definitions onto that contract
- formalized preview resolution around slot/source/artifact mapping without mutating source artifact identity
- hardened viewer and build-result validation around canonical artifacts before the larger FS expansion work

##### Files Changed

- `src/shared/buildTypes.ts`
- `src/shared/buildTypes.test.ts`
- `src/shared/partsTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/viewer/Viewer.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/stageAssembler.ts`
- `src/worker/products/foothook/parts/baseplate.ts`
- `src/worker/products/foothook/parts/heelKick.ts`
- `src/worker/products/foothook/parts/toeHook.ts`

### Phase 13 CheckList

- [x] lock `src/shared/buildTypes.ts` as the canonical solid artifact contract
- [x] require `PartArtifact` to carry canonical `partKey` and `partKeyStr`
- [x] collapse `src/shared/partsTypes.ts` onto the canonical shared contract
- [x] formalize preview resolution as `slotId -> sourceNodeId -> sourcePartKeyStr -> PartArtifact`
- [x] remove preview-time `partKeyStr` mutation and replace it with explicit slot-scoped `viewerKey` metadata
- [x] update `ViewerHost` and `Viewer` to consume slot-keyed viewer entries with canonical artifacts
- [x] tighten build-result validation so worker artifacts are treated as canonical instead of optional identity payloads
- [x] add deterministic regression coverage for artifact contract, preview mapping, and repeated graph-produced cube builds

## [x] - FS - Phase 14 - `Feature Stack Expansion And Dependency Visualization`

Human Summary: This expanded the feature stack in a major way by adding core operations, build/cache integration, and dependency visualization so the stack became both more capable and easier to inspect.

### Phase 14 Overview
#### Fold Hack 4

##### Phase Notes

This is the largest visible `FS` phase cluster in the current changelog.

##### Phase Summary

Main outcomes:
- added generic feature enable/disable support and shared feature dependency analysis without changing compile/runtime ownership boundaries
- integrated build stats and cache rows with deterministic canonical part-key identity for spaghetti-driven feature-stack builds
- threaded selector-owned dependency rows and internal dependency overlays through the part-node UI without recomputing feature graph logic in the view layer
- kept FS-1 contract rules and existing feature ordering/compile behavior intact while making the system more inspectable and controllable

##### Phase Sub-Phases

- build stats and cache integration
- core operations expansion
- dependency visualization

##### Files Changed

- `src/shared/buildStatsKeys.ts`
- `src/shared/buildStatsKeys.test.ts`
- `src/app/buildDispatcher.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/pipeline/signatures.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/featureSchema.ts`
- `src/app/spaghetti/features/featureDependencies.ts`
- `src/app/spaghetti/features/featureDependencies.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/features/diagnostics.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/theme/v15Theme.css`
- `src/worker/cad/featureStackRuntime.test.ts`

### Phase 14 CheckList

- [x] add a shared deterministic build-stats key helper for spaghetti feature-stack builds
- [x] narrow build-request translation to the minimal profile patch plus canonical `partKeys` list for stats seeding
- [x] extend dispatcher and worker progress routing so spaghetti builds emit canonical part progress/cache rows
- [x] scope `sp_*` changed-id invalidation to the relevant spaghetti row set without redesigning cache semantics
- [x] add generic feature enabled-state support with backward-compatible default enable behavior
- [L] drop the backward-compatible default-enable path once older stored feature rows no longer depend on implicit enabled behavior
- [x] introduce shared feature dependency analysis for compile, validation, diagnostics, and reorder guards
- [x] harden `compileFeatureStack` to emit deterministic IR from effective enabled-feature order only
- [x] add commit-boundary move-up, move-down, and enable/disable actions in the store
- [x] update Feature Stack UI to expose row-level reorder and enable/disable controls while keeping disabled features visible
- [x] thread selector-owned feature row ids, row indexes, and dependency edges through `selectNodeVm`
- [x] render local internal dependency overlays only in `everything` mode with `Show internal wiring` enabled
- [x] keep dependency styling structural-only so diagnostics remain the status layer

## [x] - FS - Phase 15 - `Multi-Part Feature Stack Support`

Human Summary: This extended the feature stack from single-path assumptions into multi-part support so the stack could represent and execute more realistic product structures.

### Phase 15 Overview
#### Fold Hack 4

##### Phase Notes

This is the latest confirmed `FS` phase in the current changelog.

##### Phase Summary

Main outcomes:
- generalized compile-owned part ownership so supported spaghetti part nodes now produce deterministic canonical `partKeyStr` values across singleton and multi-instance graphs
- threaded compile-owned ordered part keys into build-request translation, build stats, worker execution, and cache-row ordering
- hardened worker/runtime execution so part-local sketch/profile/body identity does not collide across different graph-owned parts
- preserved OutputPreview slot mapping while allowing multiple feature-stack-driven parts to build and render together

##### Files Changed

- `src/app/parts/partKeyResolver.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/shared/buildStatsKeys.ts`
- `src/shared/buildStatsKeys.test.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`

### Phase 15 CheckList

- [x] generalize compile-owned spaghetti part ownership to deterministic canonical `partKeyStr` values across singleton and multi-instance graphs
- [x] preserve legacy singleton keys where they are still required
- [L] remove the preserved legacy singleton-key special-cases once canonical multi-part `partKeyStr` ownership is universal across supported spaghetti part nodes
- [x] thread compile-owned ordered part keys into build-request translation and shared part-key ordering helpers
- [x] align build stats, cache rows, and worker/runtime ordering to the same canonical part-identity rules
- [x] harden worker/runtime multi-part execution so part-local sketch/profile/body identities do not collide across different graph-owned parts
- [x] preserve explicit OutputPreview slot mapping through `nodeId -> sourcePartKeyStr -> artifact`
- [x] add regression coverage for multi-slot preview resolution, unresolved-slot behavior, compile/build parity, and deterministic cache-hit ordering

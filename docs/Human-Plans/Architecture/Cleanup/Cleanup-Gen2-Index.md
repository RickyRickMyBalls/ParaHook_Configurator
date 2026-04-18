# Cleanup Gen2 Index

## Doc Header

### Doc History
1. 2026-04-18 10:03:44: Created this `Cleanup Gen2` index as the first research-backed planning surface for the next cleanup generation, grounding it in the current read that the live graph-native worker path still carries old `stub_box` and `profile_editor` naming from the initial worker, newer migration-era bridges such as `foothookCompatibilityAdapter`, likely-removable legacy routing fallback in `buildDispatcher.ts`, and box-artifact or stage-assembler residue that now need one explicit keep-isolate-retire map instead of scattered notes

### Purpose

This doc captures the current planning read for `Cleanup Generation 2`.

Use it to answer:
- what `Gen 2` is trying to clean up after the shipped `Cleanup` family groundwork
- which worker and legacy seams look truly active versus likely residual
- which cleanup lanes should happen first
- which seams still need more research before they should be renamed, isolated, or deleted

Do not use it for:
- final implementation checklists
- pretending every listed seam is already proven dead
- replacing the broader `Cleanup` family index or vision

### Relationship To Other Docs

- `Cleanup-Index.md`
  - umbrella cleanup family ladder
  - shipped cleanup history and broader lane ordering

- `Cleanup-Vision.md`
  - broad cleanup north star
  - rules for residue retirement, boundary honesty, and migration cleanup

- `Canonical-Ownership-Targets.md`
  - canonical owner targets
  - useful for deciding whether a seam should be deleted, isolated, or promoted into a real owner

- `../Worker/Worker.md`
  - worker family architecture read
  - useful for keeping worker cleanup aligned with the intended long-term execution model

## Doc Body

### Why `Gen 2` Exists

The shipped `Cleanup` family already did important first-pass ownership, packaging, and boundary work.

What still remains is a narrower but very real second-generation cleanup problem:
- old worker naming that no longer matches the graph-native engine
- migration-era compatibility bridges that stayed on hot paths after cutover
- fallback identities and box-artifact contracts that look increasingly optional
- likely residual worker or assembly helpers that no longer appear to sit on the live runtime path

This generation exists so the next cleanup wave can stay focused on:
- worker truth
- legacy seam retirement
- honest naming
- residue isolation and deletion

Instead of reopening all cleanup lanes at once.

### Current `Gen 2` Read

Current research suggests three different kinds of cleanup are mixed together in the same area of the codebase:

#### 1. Initial-worker legacy that survived into the graph-native runtime

Examples:
- `stub_box`
- `profile_editor`
- box-artifact contracts in shared types and test fixtures

Current read:
- these names are not new migration bridges
- they date back to the earliest v20 worker shape
- they now misdescribe the current graph-native build pipeline

#### 2. Newer migration-era bridges that were added during worker cutover

Examples:
- `foothookCompatibilityAdapter`
- `LEGACY_RUNTIME_*` build identities
- fallback routing identity creation in `buildDispatcher.ts`

Current read:
- these seams are newer than the oldest worker naming
- they appear to have been added to keep the worker alive during graph-native cutover
- some may still be serving a real compatibility role, but they should now be treated as explicit cleanup targets rather than permanent architecture

#### 3. Likely residual or secondary paths that may no longer belong on the main product path

Examples:
- `stageAssembler.ts`
- `buildFoothookParts(...)`
- generic or fallback `kind: 'box'` helper paths outside the main graph-native mesh flow

Current read:
- these look more suspicious than the live draft or authoritative build path
- they may be useful only as compatibility scaffolding, old product assembly residue, or test ballast
- they need direct call-path proof before deletion, but they are strong `Gen 2` candidates

### Confirmed Research So Far

#### Confirmed `Gen 2` cleanup targets

- `src/worker/pipeline/signatures.ts`
  - `EngineMode = 'stub_box'` and `ControlMode = 'profile_editor'` are still active in build signatures
  - the naming is old and no longer reflects the current graph-native worker

- `src/worker/pipeline/buildPipeline.ts`
  - still hardcodes `ENGINE_MODE = 'stub_box'` and `CONTROL_MODE = 'profile_editor'`
  - this makes the naming seam part of cache and signature identity, not just cosmetic copy

- `src/worker/buildModel.ts`
  - still routes the draft path through `foothookCompatibilityAdapter`
  - this means the product-specific compatibility seam is still on the main worker path

- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
  - appears to be a deliberate migration bridge added during graph-native worker cutover rather than an original worker file
  - should be treated as active compatibility architecture, not ignored as harmless glue

- `src/app/buildDispatcher.ts`
  - still exposes `createLegacyRoutingIdentity(...)`
  - live app-store build request paths appear to pass explicit routing identities already, which makes the fallback look increasingly like cleanup-only compatibility

#### Confirmed historical reads

- `stub_box` and the older box-oriented worker story go back to the earliest v20 worker
- `foothookCompatibilityAdapter` appears later during the graph-native worker cutover
- `legacy-runtime-project` and `legacy-runtime-graph` also look like later migration-era additions rather than original worker architecture
- `jakeMode` appears in history and docs, not as a live current source family in this repo state

### `Gen 2` Goals

- rename old worker labels so runtime naming matches current graph-native truth
- isolate product-specific compatibility bridges from the generic worker entry path
- prove which fallback routing or identity seams are still needed
- retire likely dead box-artifact or assembly residue once real call-path proof exists
- reduce how much shared worker vocabulary still advertises a worker that no longer exists

### `Gen 2` Rules

- do not delete a seam only because the name feels old; prove whether it still sits on the hot path
- do not keep a migration bridge on the main worker path without naming it explicitly as a bridge
- prefer active-path naming and boundary cleanup before wide dead-file deletion
- treat build-signature naming changes as behavior-sensitive work because cache identity depends on them
- keep this generation focused on worker, contract, and residue cleanup; do not widen it into unrelated viewer or workspace polish

### Proposed `Gen 2` Ladder

## [ ] Cleanup Gen2-1 - Worker Naming And Signature Honesty

Reason:
- `stub_box` and `profile_editor` are confirmed holdovers from the earliest worker
- they now misdescribe the graph-native CAD build path
- the names are still active inside signatures, so the cleanup should happen deliberately rather than through random one-off renames

Initial focus:
- inventory every active `stub_box` and `profile_editor` dependency
- decide the honest replacement naming
- plan the cache and signature migration rules
- keep worker behavior stable while removing false worker-era labels

### Likely owners

- `src/worker/pipeline/signatures.ts`
- `src/worker/pipeline/buildPipeline.ts`
- any tests or diagnostics that assert the old labels directly

## [ ] Cleanup Gen2-2 - Worker Compatibility Bridge Isolation

Reason:
- `buildModel.ts` still routes live draft behavior through `foothookCompatibilityAdapter`
- the bridge may still be necessary, but it should stop reading like the generic worker architecture

Initial focus:
- identify the exact bridge responsibilities that still belong to `foothook`
- separate generic worker orchestration from product-specific compatibility
- decide whether the bridge should stay as a named temporary adapter, become a product-owned runtime seam, or be retired after a deeper cutover

### Likely owners

- `src/worker/buildModel.ts`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
- `src/worker/products/foothook/buildFoothook.ts`

## [ ] Cleanup Gen2-3 - Legacy Routing And Runtime Identity Retirement

Reason:
- `buildDispatcher.ts` still owns fallback `LEGACY_RUNTIME_*` identities
- live graph-document build paths appear to pass explicit routing identities already

Initial focus:
- prove whether any non-test live caller still relies on omitted routing identity
- isolate test-only fallback use if it still exists
- remove or quarantine runtime fallback identity generation once the proof is clear

### Likely owners

- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- nearby dispatcher and bootstrap proof surfaces

## [ ] Cleanup Gen2-4 - Box Artifact And Residual Assembly Path Audit

Reason:
- box-artifact contracts and older assembly helpers still exist around the worker
- some of those paths may now be pure residue or secondary scaffolding

Initial focus:
- prove which `kind: 'box'` paths remain intentional product behavior
- separate test ballast from real runtime requirements
- audit `stageAssembler.ts` and `buildFoothookParts(...)` for live ownership versus residue
- retire dead assembly or placeholder box paths only after call-path proof

### Likely owners

- `src/shared/buildTypes.ts`
- `src/worker/pipeline/stageAssembler.ts`
- `src/worker/products/foothook/buildFoothook.ts`
- viewer and selector tests that still assume box artifacts by default

### Open Research Questions

- which remaining `kind: 'box'` paths are still true runtime contracts versus only test fixtures
- whether `stageAssembler.ts` is still part of any live product path or only retained for historical assembly experiments
- whether the draft `foothook` compatibility bridge should converge into a neutral feature-stack adapter or disappear entirely after a deeper worker cleanup
- whether `LEGACY_RUNTIME_*` ids are still needed for any hidden non-test path
- how much naming cleanup can land before a wider worker cache invalidation or signature reset becomes necessary

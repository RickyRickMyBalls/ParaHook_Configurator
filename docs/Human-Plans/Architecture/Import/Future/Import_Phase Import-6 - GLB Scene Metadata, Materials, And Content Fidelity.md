# `Import-6` - `GLB Scene Metadata, Materials, And Content Fidelity`

## Doc Header

### Doc History
1. 2026-04-16: Created this standalone future phase doc for `Import-6`, giving `.glb` imports one explicit later home for stronger scene metadata, material or texture truth, animation or camera or light presence honesty, and preview-to-commit fidelity instead of leaving those format-specific gaps parked under the generic staged import surface

### Purpose

This doc defines the later import-family phase focused on `.glb` imports.

Use it to answer:
- how `.glb` imports should get stronger format-specific truth inside the shipped staged import flow
- what extra scene, node, material, texture, animation, camera, or light information the staged importer should surface for `.glb`
- how ParaHook should explain what a `.glb` file contains versus what the app actually imports today
- how far ParaHook should push `.glb`-specific staged fidelity without turning import into a full animation, material-authoring, or scene-runtime rewrite
- how this `.glb` lane should be broken into smaller implementation cuts

### Why This Phase Exists

The import family now has:
- one shipped direct `.obj` batch lane
- one still-open direct-row compatibility parity lane
- one shipped reviewed staged import baseline
- one active staged-session hardening lane
- one later `.step`-specific fidelity lane

That means the generic import surface is no longer the biggest `.glb` problem either.

The current code-backed read is:
- `.glb` already enters through the same staged reviewed import flow as the other supported types
- the staged importer can already show generic structure truth and the generic import settings
- `Import-4` already owns the generic `.glb` split-import correctness, performance, and staged-session recovery work
- but `.glb` still does not have its own clearer staged contract for scene metadata, material or texture truth, and "what this file contains versus what ParaHook will actually keep" honesty

So the later `.glb` gap is not:
- add another import button
- replace the staged importer
- reopen the split-import repair lane

The later `.glb` gap is:
- stronger staged truth around scenes, nodes, materials, and textures
- clearer user-facing honesty about embedded animation, camera, light, or skin content when present
- better preview-to-commit parity for `.glb`-specific reviewed choices
- better default behavior when a `.glb` contains more scene structure than the generic importer currently explains well

This should stay a later lane after `Import-5`.

Reason:
- `Import-4` still owns the next mainline generic session-honesty gap
- `Import-5` is still the first format-specific proving ground
- `.glb` enrichment should land after the family proves the STEP-first format-specific pattern cleanly instead of widening two richer file-type lanes at once

## Doc Body

## [ ] `Import-6` - `GLB Scene Metadata, Materials, And Content Fidelity`

### Summary

#### Purpose:
- harden `.glb` imports inside the shipped staged import flow so scene structure, materials, textures, and extra embedded content read as explicit reviewed truth instead of generic object-tree guesswork

#### Target result:
- staged `.glb` files can carry a dedicated GLB-specific metadata contract without widening every other import type
- the staged dialog can show clearer `.glb` scene truth such as:
  - scene count
  - default scene when one is defined
  - meaningful node or mesh labels when they exist
  - material and texture presence
- the staged dialog can explain whether a `.glb` includes:
  - animations
  - cameras
  - lights
  - skins
  - or other richer scene content
- the staged dialog can tell the user honestly what ParaHook currently:
  - imports
  - preserves
  - previews only
  - or ignores for now
- `.glb` preview and accepted import result can stay aligned on the reviewed scene interpretation instead of silently diverging
- meaningful `.glb` structure can produce better labels and smarter import-mode defaults without inventing scene fidelity the file did not really expose

#### Scope statement:
- `Import-6` means `.glb`-specific import fidelity inside the shipped `Import Files...` flow
- `Import-6` does not mean animation playback, full PBR material authoring, camera-runtime onboarding, light-system onboarding, or a new scene editor

### Current State

Today `.glb` already has real support:
- ParaHook can stage `.glb` through the reviewed import dialog
- the importer can already read generic structure truth well enough to support `1 Object` and the repaired split-import path
- the active `Import-4` family already owns:
  - split-import correctness
  - split-import performance
  - staged-session recovery
  - object preview polish

But `.glb` still behaves like a generic supported type rather than a scene-rich format:
- the staged importer does not yet carry a `.glb`-specific metadata contract
- scene-level truth is still mostly flattened into the generic structure read
- the dialog does not yet speak clearly about embedded materials, textures, animations, cameras, lights, or skins when they exist
- the user cannot yet tell easily which richer `.glb` content ParaHook will preserve now versus treat as out of scope

### Locked Direction

- keep `Import Files...` as the mainline surface for `.glb` improvements
- keep the first `.glb` pass inside the reviewed staged flow instead of reopening the older direct compatibility rows first
- keep generic split-import correctness and performance with `Import-4`
- use `Import-6` only for `.glb`-specific fidelity and honesty work that remains after the generic staged flow is already working
- if ParaHook does not truly preserve a `.glb` content type yet, represent that honestly instead of implying it becomes full project truth automatically
- make staged preview and accepted `.glb` result consume the same reviewed `.glb` interpretation where that is actually supported

### Non-Goals

`Import-6` should not expand into:
- full animation playback or timeline runtime
- camera import as a first-class viewport or workspace system
- light import as a finished scene-lighting system
- a full material editor
- arbitrary texture-pipeline reauthoring
- new file formats
- replacing the staged importer with a scene editor

## Wishlist Organization

### Wishlist Header
Use the `Import-6` phases to organize wishlist items like this:

- put each wishlist item under the one phase that should own it first
- leave achieved wishlist items in place and change them from `[ ]` to `[x]`
- if a wish grows beyond one phase, keep the first owned entry where it belongs and add the wider follow-on to the later phase instead of moving history around

### `Import-6 Phase 0`
- [ ] `1. Current GLB Import Path And Finished-State Read Is Documented`
- [ ] `2. The Existing Split-Import And Generic Staged Owners Are Distinguished From Later GLB Fidelity Work`
- [ ] `3. The Repo Records What GLB Content Types Are Already Loaded, Ignored, Or Flattened Today`
#### implementation target:
  - lock the current `.glb` import read before later implementation guesses wrong about which gaps are already owned by the generic staged family versus the later `.glb`-specific lane

### `Import-6 Phase 1`
- [ ] `4. GLB-Specific Staged Metadata Has One Explicit Owner`
- [ ] `5. Non-GLB Files Keep Using The Existing Generic Staged Contract`
- [ ] `6. Scene, Material, And Extra-Content Truth Can Travel With A GLB Row Without Widening Every File Type`
#### implementation target:
  - create the narrow `.glb`-only staged metadata shell before richer scene or material wording widens on top of it

### `Import-6 Phase 2`
- [ ] `7. The Staged Dialog Shows Scene Count And Default Scene Truth When Present`
- [ ] `8. Meaningful Node Or Mesh Labels Are Surfaced More Clearly`
- [ ] `9. Smarter GLB Import-Mode Defaults Appear Only When The Real Scene Structure Supports Them`
#### implementation target:
  - make `.glb` scene and node truth clearer in the staged importer without reopening the already-owned generic split-import and staged-session behavior

### `Import-6 Phase 3`
- [ ] `10. Material And Texture Presence Is Surfaced Honestly`
- [ ] `11. The User Can Tell Whether GLB Material Content Is Preserved, Preview-Only, Or Not Yet First-Class`
- [ ] `12. GLB Material Truth Stops Hiding Behind Generic Structure Copy`
#### implementation target:
  - add the first honest user-facing read for `.glb` material and texture content without widening into a full material-authoring system

### `Import-6 Phase 4`
- [ ] `13. Animation Presence Is Surfaced Honestly`
- [ ] `14. Camera, Light, And Skin Presence Is Surfaced Honestly`
- [ ] `15. The Dialog States Clearly What Richer GLB Content ParaHook Ignores Or Defers Today`
#### implementation target:
  - make richer `.glb` content visible and honest in the staged importer even before ParaHook fully supports those content types as first-class runtime systems

### `Import-6 Phase 5`
- [ ] `16. Reviewed GLB-Specific Truth Stays Aligned Between Staged Preview And Accepted Result`
- [ ] `17. GLB-Specific Wording And Defaults Stay Narrow And Truthful`
- [ ] `18. Focused Regression Coverage Exists For The Enriched GLB Import Story`
#### implementation target:
  - finish the `.glb` lane with parity, wording cleanup, and proof once the format-specific truth is stable

### Internal Phase Ladder

The cleanest `.glb` ladder is:

1. `Import-6 Phase 0 - Current GLB Import Path And Finished-State Research`
2. `Import-6 Phase 1 - GLB-Specific Staged Metadata Contract`
3. `Import-6 Phase 2 - Scene, Node, And Default-Scene Truth`
4. `Import-6 Phase 3 - Material And Texture Honesty`
5. `Import-6 Phase 4 - Animation, Camera, Light, And Skin Presence Honesty`
6. `Import-6 Phase 5 - Preview-To-Commit Fidelity, Cleanup, And Regression Pass`

Reason:
- the current `.glb` import read should be locked first so the new lane does not duplicate generic staged work already owned elsewhere
- the staged metadata shell should exist before richer `.glb` scene or material copy lands
- scene truth should become clear before material and extra-content copy builds on top of it
- material and texture honesty should land before the app tries to explain richer animation, camera, light, or skin content
- the final pass should keep parity and cleanup narrow once the `.glb`-specific truth is explicit

### Current Recommendation

`Import-6` should stay queued behind `Import-5`.

Reason:
- `Import-5` is still the first format-specific proving ground for the post-foundation import family
- once the STEP-first pattern is explicit, `.glb` can become the next format-specific lane without reopening the generic import foundation
- `.glb` enrichment should stay additive and format-specific rather than widening back into generic staged import redesign

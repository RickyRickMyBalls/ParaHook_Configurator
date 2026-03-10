# Leaving Legacy

## Doc History
1. 2026-03-06 22:20: Created this roadmap as the master plan for removing legacy code paths and migrating ParaHook toward a fully Spaghetti-native canonical model

## Purpose

This file is the roadmap for leaving the legacy system behind.

Use it to answer:
- what still counts as `legacy`
- what order legacy removal should happen in
- what has to be true before a legacy system can be deleted
- which cleanup steps are architecture work versus UI cleanup versus docs cleanup

This is a roadmap.
It is not a changelog.
It is not a task dump.

## Main Checklist

- [ ] 1. Define the final no-legacy target
- [ ] 2. Replace legacy model truth with Spaghetti truth everywhere
- [ ] 3. Remove legacy build-request patching and make the worker graph-native
- [ ] 4. Retire legacy part-generation paths
- [ ] 5. Remove legacy node and port compatibility layers
- [ ] 6. Remove legacy app mode and old panel assumptions
- [ ] 7. Replace legacy viewer/workbench carryovers with intentional modern systems
- [ ] 8. Decide what old feature experiments are real versus archival
- [ ] 9. Clean docs, changelog, and roadmap language after the code transition
- [ ] 10. Do the final delete pass

## 1. Define The Final No-Legacy Target

Goal:
- define what the app should look like when legacy is truly gone

Main questions:
- is `Spaghetti` the only canonical model truth?
- is `Jake mode` the only simplified editing layer?
- does the worker eventually consume graph-native compiled data instead of legacy-style box params?
- which old viewer/audio/radio systems are real future systems versus leftover code?

Done means:
- you can describe the final architecture in one sentence
- you know which systems are transitional and which are permanent

Current best target:
- `Spaghetti` is the canonical authoring model
- `Jake mode` is the simplified editing layer over drivers
- the worker consumes graph-derived build data
- legacy box-style editing is gone

## 2. Replace Legacy Model Truth With Spaghetti Truth Everywhere

Goal:
- make sure the app no longer depends on the old legacy parameter model as a parallel truth

Likely legacy areas:
- `inputMode: 'legacy' | 'spaghetti'`
- box-param ownership in the app store
- any UI that edits legacy params directly instead of editing graph/driver data

Main work:
- define the canonical graph-backed model for the current real product
- move current product editing into Spaghetti-backed drivers, params, and part nodes
- make app-level state read from graph-derived outputs instead of a second legacy source

Done means:
- no second product-truth model exists beside Spaghetti
- app state manages mode, selection, visibility, and orchestration
- graph/driver state owns product definition

## 3. Remove Legacy Build-Request Patching And Make The Worker Graph-Native

Goal:
- stop treating Spaghetti as a patch layer over an older build-request format

Current transitional shape:
- compile graph
- convert build inputs into a legacy-style request patch
- send that patched payload into the worker

Main work:
- define the durable graph-native worker request shape
- move build-relevant product inputs into typed compiled payloads
- shrink the old box-param payload until it no longer matters
- make build signatures and change detection graph-native

Done means:
- the worker request contract reflects current engine truth
- Spaghetti compile output is first-class, not an adapter over legacy params

## 4. Retire Legacy Part-Generation Paths

Goal:
- stop building the real product through old fallback part derivation paths

Current transitional shape:
- legacy parts still exist
- feature-stack parts are layered on top in the worker

Main work:
- decide which current real parts are fully owned by the graph/feature-stack pipeline
- move Baseplate, ToeHook, and HeelKick toward one durable compiled/runtime path
- remove old fallback part derivation once parity is proven

Done means:
- the current real product builds through one intentional path
- no duplicate product-generation route remains

## 5. Remove Legacy Node And Port Compatibility Layers

Goal:
- stop carrying old naming and endpoint behavior once the new contracts are stable

Likely legacy areas:
- old port aliases
- dual-read driver ID compatibility
- hidden primitive compatibility nodes
- older input/output naming carried only for migration

Main work:
- audit compatibility aliases in registry, validation, compile, and selectors
- decide which node types remain user-facing
- retire legacy-only node families or hide them behind conversion tools
- delete compatibility code only after graph migration is safe

Done means:
- node and port naming is canonical
- driver IDs are canonical
- the graph surface no longer depends on migration-era aliases

## 6. Remove Legacy App Mode And Old Panel Assumptions

Goal:
- remove the old app shell behavior that assumes a separate legacy editing path

Likely areas:
- `legacy` input mode
- `BoxPanel`
- old part-list assumptions tied to legacy output flow
- UI that only exists to support the old direct-param path

Main work:
- decide the post-legacy top-level mode structure
- likely move toward:
  - `Spaghetti mode`
  - `Jake mode`
  - shared viewer / debug / docs infrastructure
- remove the old direct box-editing shell

Done means:
- the app shell no longer branches around a legacy authoring mode
- the current top-level UI matches the future product story

## 7. Replace Legacy Viewer / Workbench Carryovers With Intentional Modern Systems

Goal:
- keep the good old ideas, but stop carrying random old structures just because they already exist

Important note:
- some viewer/workbench code is not bad legacy
- some of it is useful future groundwork

Main work:
- separate `keep and modernize` from `delete`
- keep things that align with the long-term vision:
  - gizmo
  - control-viz direction
  - materials
  - lighting
  - sectioning/workbench ideas
- remove or refactor anything that only survives as an old experiment with no current role

Done means:
- the viewer feels like one intentional modern system
- old workbench carryover is either integrated cleanly or removed

## 8. Decide What Old Feature Experiments Are Real Versus Archival

Goal:
- stop letting half-alive experiments blur the actual product direction

Likely candidates:
- radio / sampler systems
- scenes
- leftover panel ideas
- old workspace concepts

Main work:
- decide which old features are:
  - future product features
  - platform experiments worth preserving
  - archive-only history
- mark archive-only systems clearly in docs before deleting code

Done means:
- every old experimental system has a status:
  - keep
  - redesign later
  - archive and remove

## 9. Clean Docs, Changelog, And Roadmap Language After The Code Transition

Goal:
- make the docs stop speaking in transitional language once the code is no longer transitional

Main work:
- update architecture docs to remove legacy-vs-Spaghetti duality once it is truly gone
- update changelog conventions so new work is always canonical
- move historical conversion notes into `docs/History`
- keep roadmap and phase docs centered on the post-legacy system

Done means:
- docs describe the current truth, not the migration state

## 10. Do The Final Delete Pass

Goal:
- remove dead code only after the replacement systems are real

Delete candidates once ready:
- old app-store legacy fields
- old legacy build request helpers
- legacy-only worker build code
- old node aliases and compatibility readers
- legacy UI panels and routing branches
- stale docs that still imply two truths

Important rule:
- do not delete first and hope the architecture emerges later
- replace first, prove parity, then delete

Done means:
- no meaningful legacy execution path remains
- remaining history lives in docs, not in active runtime code

## Recommended Order

If you want the safest practical order:

1. Define final no-legacy target
2. Strengthen driver and graph-native product truth
3. Move worker requests and part generation to graph-native paths
4. Remove legacy app mode
5. Remove compatibility aliases and fallback systems
6. Clean viewer/workbench leftovers
7. Clean docs and changelog language
8. Final delete pass

## Short Version

Leaving legacy does not mainly mean deleting old code.

It means:
- make Spaghetti the only real product truth
- make drivers the real control contract
- make the worker consume graph-native compiled data
- make Jake the future simplified surface
- then remove the old box-param and compatibility systems after the replacements are stable

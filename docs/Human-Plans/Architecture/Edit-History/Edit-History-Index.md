# Edit History Index

## Doc Header

### Doc History
37. 2026-04-22 18:29:20: Closed Generation 5 after implementing target-scoped durable Sketch Draw local history batches, canonical before/after batch snapshots, reopen hydration, and geometry-first same-tool local undo/redo while keeping Viewer Transform as the shared reference pattern and `editHistoryStore` as the only app-wide owner.
36. 2026-04-22 17:56:30: Added Generation 5 routing for durable CAD-local history batches after user review clarified Sketch Draw and Viewer Transform should store replayable local command histories inside or beside authored CAD targets, preserving canonical app history as the app-wide owner while allowing local CAD undo/redo after committed sessions are reopened.
35. 2026-04-22 16:28:35: Closed the promoted Gen4 focused-console undo lane after `Edit-History-Gen4-3` implemented active Sketch Draw ownership from focused Console, completed staged geometry undo/redo, submitted tool-selection undo/redo, focused tests, and production build proof.
34. 2026-04-22 16:12:20: Reconciled the umbrella index with the promoted Gen4 console-focused undo lane by marking the completed Gen4 Sketch Draw command-buffer goals complete, adding `Edit-History-HLG-10`, listing the Gen4-2 and Gen4-3 planning surfaces in the later-generation routing, and pointing the Gen4 phase summary at the focused-console follow-up.
33. 2026-04-22 15:16:08: Added `Edit-History-Gen4-3` routing after user review clarified console-submitted Sketch Draw commands must keep active undo/redo ownership even when the console input remains focused, with Sketch Draw as the first implementation slice of a reusable command-session undo policy.
32. 2026-04-22 12:12:20: Added the `Edit-History-Gen4-2` staged Sketch Draw command-buffer planning lane after user review clarified completed draw commands must be undoable inside the active Sketch Draw session before the final sketch commit reaches canonical app history.
31. 2026-04-22 11:10:11: Added Generation 4 routing for Sketch Draw authored command undo after user review clarified completed Sketch Draw lines/shapes/polylines and delete commands should become individual canonical undo/redo steps, with a new Gen4 index and future plan doc.
30. 2026-04-22 10:57:31: Closed the explicit Edit-History manager-loop scope across Gen 1, Gen 2, and Gen 3 after Gen3-3 was accepted as a deferred no-current-scope Build Path comparison closeout, the generated Edit-History-focused test sweep passed 23 files and 175 tests, production build passed with known Vite warnings, and broad `npm.cmd test` was attempted but timed out before returning results.
29. 2026-04-22 09:52:07: Added the `Edit-History-Gen3-Index.md` planning surface plus three Gen 3 future docs for history reader UX and labels, checkpoints/snapshots/optional branching, and advanced Build Path comparison; refreshed this family index so Gen 3 is visible as planning-only advanced history productization after Gen 2 closeout.
28. 2026-04-22 04:12:09: Added the `Edit-History-Gen2-Index.md` planning surface and four concise Gen 2 future docs for durable scene presentation, productivity content, workspace layout/preference, and sampler/import setting undo candidates before any Gen 2 runtime implementation starts.
27. 2026-04-22 04:10:03: Accepted the `Edit-History-6 / Phase 3` docs-only closeout and marked `Edit-History-CLG-30`, `Edit-History-HLG-5`, `Edit-History-HLG-6`, and `Edit-History-HLG-7` complete after Manager review confirmed later durable setting/content candidates are routed to Gen 2, advanced history UX/checkpoint/branch/comparison candidates are routed to Gen 3, collaboration remains conditional, first-generation exclusion proof exists across foundation and adapter phases, and current live source research still shows no feature-stack remove seam or live Build Path playhead surface; marked `Edit-History-CLG-12` and `Edit-History-CLG-28` complete for current supported seams with future live-surface follow-up required if those missing authored operations are introduced.
26. 2026-04-22 04:07:31: Routed later Edit-History coverage after the `Edit-History-6 / Phase 3` docs-only closeout by splitting the holding pen into Gen 2 durable single-user setting/content undo candidates and Gen 3 advanced history UX/checkpoint/branch/comparison candidates while keeping `Edit-History-CLG-28` open for a future live Build Path playhead surface and leaving collaboration/multiplayer conditional on explicit user promotion.
25. 2026-04-22 04:04:53: Marked `Edit-History-CLG-29` complete after Manager accepted `Edit-History-6 / Phase 2`, covering the public reader contract for canonical entry labels, source metadata, target metadata, undo/redo stack reads, representative Gen 1 adapter metadata across graph, feature, sketch, Browser/project, Import/Catalog, and Viewer Transform entries, same-seam UI/console graph metadata proof, focused reader-contract verification, and production build proof while keeping history UI, persistence, Build Path UI, Gen 2 durable setting implementation, and runtime/cache/provider state out of scope.
24. 2026-04-22 03:54:31: Marked `Edit-History-CLG-27` complete after Manager accepted `Edit-History-6 / Phase 1.1`, covering the current live Build Path-adjacent derived build/viewport reader proof after canonical authored undo/redo, confirming derived reads do not create duplicate canonical history, build runtime/progress state remains excluded without invalidating redo, and no live Build Path surface or playhead exists yet; `Edit-History-CLG-28` remains open/deferred for the future live Build Path playhead surface.
23. 2026-04-22 03:46:27: Marked `Edit-History-CLG-26` and `Edit History 5` complete after Manager accepted `Edit-History-5 / Phase 2`, covering transform-context canonical undo/redo routing proof, existing Viewer Transform History row/reader alignment with canonical restored state, local transform row-control no-entry proof, focused input-routing and Viewer Transform history verification, production build proof, and a manager doc correction that `Tab` is not part of the current transform-local routing seam.
22. 2026-04-22 03:38:43: Marked `Edit-History-CLG-23`, `Edit-History-CLG-24`, `Edit-History-CLG-25`, and `Edit-History-HLG-4` complete after Manager accepted `Edit-History-5 / Phase 1`, covering reference and content-object committed Viewer Transform undo/redo through canonical `Change Viewer transform` entries, live draft no-entry behavior, scrub movement no-entry and redo preservation, environment-light no-entry proof, explicit-null transform override restoration repair, focused transform-history verification, transform-filtered app-store regression verification, and production build proof while keeping `Edit-History-CLG-26` open for transform-context dispatch/local-reader alignment.
21. 2026-04-22 03:23:43: Marked `Edit-History-CLG-21`, `Edit-History-CLG-22`, and `Edit-History-HLG-3` complete after Manager accepted `Edit-History-4 / Phase 3.2`, covering direct Catalog Add To Project canonical entries, narrow same-id imported-reference undo/redo restoration that excludes unrelated `projectContent`, Catalog eligibility/no-entry proof, accepted Import and Catalog source/session/cache/provider exclusion proof, focused store and eligibility tests, production build proof, and the known unrelated CatalogSurface `Imported Catalog Entries` heading expectation drift.
20. 2026-04-22 03:14:13: Marked `Edit-History-CLG-20` complete after Manager accepted `Edit-History-4 / Phase 3.1`, covering successful and partial staged Import acceptance through canonical `Accept Import` entries, raw/no-draft/no-file/failed-only no-entry behavior, stable accepted-reference undo/redo restoration, and proof that unrelated imported-reference state plus staged draft/session, selection, transform preference, and command transcript state stay outside the accepted Import entry while leaving Catalog direct Add To Project and final `Edit-History-CLG-22` closeout open.
19. 2026-04-22 02:58:48: Marked `Edit-History-CLG-19` complete after Manager accepted `Edit-History-4 / Phase 2`, covering authored Browser/project assembly and component create/delete undo/redo through canonical `Create Browser item` and `Delete Browser item` entries with stable create redo ids, subtree delete restore, raw base-method no-entry behavior, invalid no-entry behavior, focused Browser organization history verification, and production build proof while leaving accepted Import/Catalog commits and excluded Browser/runtime state open inside `Edit History 4`.
18. 2026-04-22 02:48:02: Marked `Edit-History-CLG-18` complete after Manager accepted `Edit-History-4 / Phase 1.2`, covering Browser/project reorder, reparent, grouped move, and multi-step completed-drop undo/redo as one canonical `Move Browser item` entry per user drop while preserving invalid/no-change no-entry behavior and leaving create/delete, Import/Catalog commits, and excluded Browser/runtime state open inside `Edit History 4`.
17. 2026-04-22 02:39:12: Marked `Edit-History-CLG-17` complete after Manager accepted `Edit-History-4 / Phase 1.1`, covering Browser/project assembly and authored-component rename undo/redo through canonical `Rename Browser item` entries with no-entry protection for unchanged, missing, unsupported, and validation-failed rename attempts while leaving Browser drop organization, create/delete, Import/Catalog commits, and excluded Browser/runtime state open inside `Edit History 4`.
16. 2026-04-22 02:25:19: Marked `Edit-History-CLG-15` and `Edit-History-CLG-16` complete after Manager accepted `Edit-History-3 / Phase 4`, covering focused proof that local sketch draft/session actions, current sketch-session finish/delete graph mutations, representative graph runtime/build/preview/result/cache operations, and cached graph save metadata stay outside canonical edit history while authored sketch undo/redo does not capture excluded draft or runtime state.
15. 2026-04-22 02:15:44: Marked `Edit-History-CLG-14` complete after Manager accepted `Edit-History-3 / Phase 3`, covering durable authored sketch component add/update/reorder/delete and cube-seed rectangle dimension commits through canonical sketch-history entries while leaving local sketch draft/session exclusion, runtime/cache/provider exclusion proof, and the feature remove seam gap open inside `Edit History 3`.
14. 2026-04-22 02:05:42: Marked `Edit-History-CLG-13` complete after Manager accepted `Edit-History-3 / Phase 2`, covering close-profile source selects, extrude profile-reference selects, and extrude depth/taper/offset numeric commits through canonical feature-parameter history while leaving feature remove, committed sketch edits, local sketch draft exclusion, and runtime/cache/provider exclusions open inside `Edit History 3`.
13. 2026-04-22 01:45:48: Marked `Edit-History-CLG-11`, `Edit-History-HLG-1`, and `Edit History 2` complete after Manager accepted `Edit-History-2 / Phase 4`, covering existing console-authored graph mutations through the same canonical graph-history seams and confirming focused console parity, graph-history regression, and production build verification.
12. 2026-04-22 01:35:13: Marked `Edit-History-CLG-10` complete after Manager accepted `Edit-History-2 / Phase 3.1`, covering typed generic graph node numeric parameter commits on `Enter` or blur through the accepted graph parameter history seam while leaving console parity open inside `Edit History 2`.
11. 2026-04-22 01:26:13: Marked `Edit-History-CLG-9` complete after Manager accepted `Edit-History-2 / Phase 3`, covering generic UI graph node numeric parameter slider/range release undo/redo as one canonical `Change graph parameter` entry while moving typed numeric confirm/blur commits into `Edit-History-2 / Phase 3.1`.
10. 2026-04-22 01:08:01: Marked `Edit-History-CLG-8` complete after Manager accepted `Edit-History-2 / Phase 2`, covering completed graph node movement undo/redo as one canonical entry per changed rounded-position release while leaving graph parameter slider commits, typed numeric commits, and console parity open inside `Edit History 2`.
9. 2026-04-22 00:58:17: Marked `Edit-History-CLG-6` and `Edit-History-CLG-7` complete after Manager accepted `Edit-History-2 / Phase 1`, covering canonical graph node add/remove and wire connect/remove undo/redo while leaving node movement, graph parameter commits, and console parity open inside `Edit History 2`.
8. 2026-04-22 00:44:08: Marked `Edit-History-CLG-5` and `Edit History 1` complete after Manager accepted `Edit-History-1 / Phase 4`, closing the canonical transaction foundation across owner ordering, redo invalidation, no-op protection, transaction collapse, shared dispatch, and pure view/runtime exclusion proof before moving to graph adapters.
7. 2026-04-22 00:39:46: Marked `Edit-History-CLG-4` complete after Manager accepted `Edit-History-1 / Phase 3`, noting that owner, transaction-collapse, and shared dispatch coverage now advance `Edit-History-CLG-5` while the remaining pure view/runtime exclusion proof still needs a foundation follow-up before graph adapters begin.
6. 2026-04-22 00:33:14: Marked `Edit-History-CLG-3` complete after Manager accepted `Edit-History-1 / Phase 2`, noting that transaction-collapse owner coverage advanced `Edit-History-CLG-5` while shared dispatch, view/runtime exclusion proof, graph adapters, and later canonical surfaces remain open.
5. 2026-04-22 00:26:39: Marked `Edit-History-CLG-1` and `Edit-History-CLG-2` complete after Manager accepted `Edit-History-1 / Phase 1`, leaving transaction lifecycle, shared dispatch, graph adapters, and later canonical surfaces open.
4. 2026-04-22 00:11:26: Added `Edit-History-Vision.md`, converted the undoable-surface audit recommendations into stable wishlist items, filtered the first generation down into a graph/CAD/project/transform/derived-reader ladder, and added implementation-ready `Future/` plans for `Edit History 1` through `Edit History 6`.
3. 2026-04-22 00:00:54: Added `Edit History 0` as the completed undoable-surface audit before canonical implementation, pointing the family at the new future doc and recording the recommended first coverage order from graph commands through node-owned CAD authoring, Browser/project organization, committed transforms, and later durable scene or productivity surfaces
2. 2026-03-28 13:15: Locked the initial `Edit History` questions into explicit decisions, added a first `Edit History 1` through `Edit History 5` phase ladder, and tightened the family so canonical authored history, transaction boundaries, surface scope, console parity, and later `Build Path` sync now read as one sequenced implementation plan instead of only an umbrella concept
1. 2026-03-28 13:07: Created this folder-root architecture index for the new `Edit-History` family, establishing canonical authored-change history for global undo/redo, locking its relationship to `Build Path` as a derived scrub reader instead of a competing history owner, and reserving `Future/` and `Shipped/` for later standalone planning and shipped records

### Purpose

This doc defines the umbrella architecture direction for `Edit History`.

This file is the umbrella index for the `Edit-History` family.

Use it to answer:
- what should count as canonical authored edit history in ParaHook
- how `Ctrl+Z` and `Ctrl+Y` should behave across the main editing surfaces
- how `Edit History` should differ from `Build Path` scrub/traversal
- what transaction and coalescing rules are implied by sliders, drags, and console-issued edits
- how future standalone planning docs under this family should be organized

### Family Structure

Use this folder like this:

- `Edit-History-Index.md`
  - umbrella architecture direction
  - canonical history ownership
  - first implementation rules
- `Edit-History-Vision.md`
  - north-star direction
  - stable wishlist items
  - generation routing for undoable surfaces
- `Edit-History-Gen2-Index.md`
  - Generation 2 scan surface
  - durable setting/content candidate routing
  - setup gate before Gen 2 runtime implementation
- `Edit-History-Gen3-Index.md`
  - Generation 3 scan surface
  - advanced history UX, checkpoint/snapshot, optional branching, and Build Path comparison routing
  - setup gate before advanced history productization implementation
- `Edit-History-Gen4-Index.md`
  - Generation 4 scan surface
  - Sketch Draw authored, staged, and console-focused command undo routing
  - setup gate before turning completed draw commands into staged session entries, final canonical commits, and focused-console active command undo ownership
- `Edit-History-Gen5-Index.md`
  - Generation 5 scan surface
  - durable CAD-local command history batches for Sketch Draw, Viewer Transform, and later CAD sessions
  - setup gate before local CAD histories become replayable after committed sessions are reopened
- `Future/`
  - later standalone `Edit History` phase or execution docs
  - current planning records:
    - `Edit-History 0 - Undoable Surface Audit And First Coverage Recommendation.md`
    - `Edit-History-1 - Canonical Transaction Foundation.md`
    - `Edit-History-2 - Graph And Parameter Undo Coverage.md`
    - `Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
    - `Edit-History-4 - Browser Project Content And Accepted Import Undo Coverage.md`
    - `Edit-History-5 - Viewer Transform Commit Undo Integration.md`
    - `Edit-History-6 - Derived Readers And Later Coverage.md`
    - `Edit-History-Gen2-1 - Durable Scene Presentation Undo Candidates.md`
    - `Edit-History-Gen2-2 - Productivity Content Undo Candidates.md`
    - `Edit-History-Gen2-3 - Workspace Layout And Preference Undo Candidates.md`
    - `Edit-History-Gen2-4 - Sampler And Import Setting Undo Candidates.md`
    - `Edit-History-Gen3-1 - History Reader UX And Labels.md`
    - `Edit-History-Gen3-2 - Checkpoints Snapshots And Optional Branching.md`
    - `Edit-History-Gen3-3 - Advanced Build Path Comparison.md`
    - `Edit-History-Gen4-1 - Sketch Draw Authored Command Undo.md`
    - `Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer.md`
    - `Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership.md`
    - `Edit-History-Gen5-1 - Durable CAD Local History Batches.md`
- `Shipped/`
  - later shipped records for completed `Edit History` cuts

### Concept

`Edit History` is the canonical authored-change history for ParaHook.

It should record meaningful user edits across the main editing surfaces, such as:
- `Spaghetti Editor` graph edits
- Browser/content organization edits
- committed transform edits
- slider and typed parameter edits
- console-issued commands that mutate the same underlying authored state

The goal is to give ParaHook one honest undo/redo truth instead of a separate local undo model for every surface.

### Why This Doc Exists

The current codebase already has several local history-like systems:
- command recall in the console
- committed transform history for viewer transform
- sketch-local draft/history behavior
- later `Build Path` scrub planning

But those are not the same thing as one app-wide authored undo/redo model.

`Edit History` exists to define that missing canonical layer:
- `Edit History` owns authored mutation history
- `Ctrl+Z` and `Ctrl+Y` traverse that authored history
- `Build Path` reads that truth and should visually respond to it, but should not become a second competing undo owner

## Doc Body

### Vision

A single canonical edit-history system for ParaHook that makes authored changes undoable and redoable across the major surfaces without inventing separate conflicting history truths.

Vision source:
- `Edit-History-Vision.md`

First generation filter:
- start with canonical authored state
- prove graph structure and graph parameter commits first
- widen into node-owned CAD authoring and committed sketch edits
- widen into Browser/project content organization and accepted import/catalog commits
- integrate committed Viewer Transform entries
- make `Build Path` and history UI derived readers of canonical truth
- keep camera, navigation, hover, focus, selection-only, build/runtime, preview/cache/provider, command recall, and transcript state outside first-generation canonical undo

### Core Mechanics

- `Canonical Entries`
  - each meaningful authored change becomes one undoable history entry
- `Undo / Redo`
  - `Ctrl+Z` moves backward through authored changes and `Ctrl+Y` moves forward through them
- `Transactions`
  - continuous live interaction can update the UI freely, but history should commit one meaningful entry when the interaction is released or confirmed
- `Derived Readers`
  - surfaces such as `Build Path`, transform overlays, and Browser labels should refresh from canonical history state rather than store their own conflicting undo truths

### Relationship To Build Path

`Edit History` and `Build Path` should coordinate, but they should not be the same system.

Recommended relationship:
- `Edit History`
  - canonical authored-change history
  - source of truth for undo/redo
- `Build Path`
  - derived scrub/traversal surface
  - reflects the current authored history state
  - should visually change when undo/redo changes authored truth

Important rule:
- moving a `Build Path` playhead is navigation state, not automatically an authored edit
- `Ctrl+Z` should normally undo authored changes, not timeline navigation

### Surface Scope

The first honest scope should target authored surfaces that users will expect to undo:

- `Spaghetti Editor`
  - add/remove nodes
  - connect/remove wires
  - move nodes
  - parameter changes
- Browser/content organization
  - rename
  - reorder
  - reparent
  - delete/create where supported
- transform surfaces
  - committed transform edits
  - not every live drag frame
- parameter controls
  - `ParaSlider`
  - `ParaVec2Slider`
  - `ParaVec3Slider`
  - typed numeric field commits
- console commands
  - only when they mutate the same authored state as the visible UI surfaces

### Non-Goals

The first `Edit History` cut should stay disciplined:

- do not treat every navigation state change as authored history
- do not make camera movement part of canonical undo/redo
- do not record every slider tick or gizmo drag frame as its own history step
- do not let `Build Path` become a second owner of undo truth
- do not require every derived visual surface to invent custom history storage before canonical edit history exists

### Transaction Rules

The first edit-history model should prefer meaningful transaction boundaries over raw event spam.

Recommended first rules:

- slider drags
  - live-update continuously
  - record one entry on pointer release if the value changed
- typed numeric edits
  - record one entry on `Enter` or blur when the committed value changed
- drag-reorder or drag-reparent
  - record one entry on drop
- transform drags
  - live-update continuously
  - record one committed entry on release/commit
- console mutation commands
  - route into the same shared mutation seams used by the UI
  - reuse the same history transaction rather than creating console-only inverse logic

### Storage Direction

The first honest storage direction should be one canonical edit-history layer with explicit transaction records, while still allowing different subsystems to adapt into it.

Recommended shape:

- canonical history records authored mutations
- entries should carry enough information to undo and redo safely
- storage may be snapshot-based, inverse-command-based, or hybrid per subsystem
- the user-facing behavior should still read as one shared undo/redo system

### First Constraints

The first `Edit History` cut should stay disciplined:

- history must be canonical for authored state
- derived surfaces should read history truth instead of duplicating it
- continuous interactions should coalesce into one committed step
- undo/redo should stay honest per surface and not claim support for pure view-state changes that are not yet modeled as authored edits
- the first cut should prioritize strong single-user undo/redo semantics before later collaboration, branching, or multiplayer history behavior

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-HLG-1` - Make graph structure and graph parameter commits undoable first.
- [x] `Edit-History-HLG-2` - Make node-owned CAD authoring, feature-stack edits, and committed sketch edits undoable through the same canonical owner.
- [x] `Edit-History-HLG-3` - Make Browser/project organization and accepted import/catalog commits undoable without making selection, visibility-only, preview, cache, or provider status noise canonical.
- [x] `Edit-History-HLG-4` - Make committed Viewer Transform entries undoable while keeping live drag frames and scrub navigation out of authored undo.
- [x] `Edit-History-HLG-5` - Keep durable scene presentation, productivity state, workspace layout, and optional sampler settings visible as later undo candidates without starting there.
- [x] `Edit-History-HLG-6` - Exclude camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, and command recall from first-generation canonical undo.
- [x] `Edit-History-HLG-7` - Keep `Build Path`, history UI, and other timeline readers derived from canonical edit history instead of letting them become independent undo owners.
- [x] `Edit-History-HLG-8` - Make completed Sketch Draw lines, shapes, polylines, and delete commands undoable/redoable as individual authored sketch commands while keeping hover, selection, and in-progress draft points local.
- [x] `Edit-History-HLG-9` - Let users undo and redo completed Sketch Draw commands inside the active Sketch Draw session before committing the final staged sketch change into canonical edit history.
- [x] `Edit-History-HLG-10` - Let active command sessions keep undo/redo ownership after console command submissions so focused console inputs do not trap `Ctrl+Z` / `Ctrl+Y` away from the modeling command the user just committed.
- [x] `Edit-History-HLG-11` - Store durable CAD-local undo/redo command batches inside or beside authored CAD targets so accepted Sketch Draw, Viewer Transform, and later CAD sessions can restore and replay local command histories after the session is reopened.

### First Generation Checklist

- [x] `Edit-History-CLG-1` - Create one canonical authored edit-history owner with undo, redo, commit, clear, and redo-invalidation behavior.
- [x] `Edit-History-CLG-2` - Define the first undoable entry contract, including label, surface/source metadata, undo payload, redo payload, and optional coalescing or transaction identity.
- [x] `Edit-History-CLG-3` - Define transaction begin/update/commit/cancel semantics so live sliders, drags, drops, and typed edits can commit one meaningful entry.
- [x] `Edit-History-CLG-4` - Add first shared dispatch rules for `Ctrl+Z` and `Ctrl+Y` without stealing focus from text editing or modal contexts that must keep local behavior.
- [x] `Edit-History-CLG-5` - Add tests proving owner ordering, redo invalidation, no-op protection, transaction collapse, and exclusion of pure view/runtime state.
- [x] `Edit-History-CLG-6` - Make node add/remove undoable and redoable.
- [x] `Edit-History-CLG-7` - Make wire connect/remove undoable and redoable.
- [x] `Edit-History-CLG-8` - Make node movement undoable as one committed move per completed drag.
- [x] `Edit-History-CLG-9` - Make graph parameter slider commits undoable as one entry on release.
- [x] `Edit-History-CLG-10` - Make typed numeric parameter commits undoable on `Enter`, blur, or equivalent confirm.
- [x] `Edit-History-CLG-11` - Route console graph/parameter mutations through the same authored seams so canonical undo is surface-agnostic.
- [x] `Edit-History-CLG-12` - Make stable feature-stack add/remove/reorder operations undoable where the app already supports those authored operations.
- [x] `Edit-History-CLG-13` - Make feature parameter commits undoable through the same transaction semantics as graph parameters.
- [x] `Edit-History-CLG-14` - Make committed sketch entity edits undoable after the edit becomes durable authored state.
- [x] `Edit-History-CLG-15` - Keep local sketch draft interactions outside canonical undo until they commit an authored entity.
- [x] `Edit-History-CLG-16` - Keep worker progress, preview geometry, and result cache state outside canonical undo.
- [x] `Edit-History-CLG-17` - Make Browser/project rename commits undoable.
- [x] `Edit-History-CLG-18` - Make reorder and reparent commits undoable as one entry on drop.
- [x] `Edit-History-CLG-19` - Make durable create/delete operations undoable where the app already supports them.
- [x] `Edit-History-CLG-20` - Make accepted Import commits undoable after they mutate project content.
- [x] `Edit-History-CLG-21` - Make accepted Catalog/Add To Project commits undoable after they mutate project content.
- [x] `Edit-History-CLG-22` - Keep source browsing, previews, cache status, provider status, selection-only state, and unaccepted import/catalog sessions outside canonical undo.
- [x] `Edit-History-CLG-23` - Make committed Viewer Transform entries undoable through canonical history.
- [x] `Edit-History-CLG-24` - Preserve live transform dragging without per-frame canonical history entries.
- [x] `Edit-History-CLG-25` - Keep transform scrub index movement and preview navigation outside canonical authored undo.
- [x] `Edit-History-CLG-26` - Align existing transform-history reads with canonical authored undo semantics instead of duplicating truth.
- [x] `Edit-History-CLG-27` - Make `Build Path` refresh when canonical authored undo/redo changes the current authored state.
- [x] `Edit-History-CLG-28` - Keep `Build Path` playhead movement as navigation unless an explicit authored commit action is introduced.
- [x] `Edit-History-CLG-29` - Add enough entry labels and metadata for future history UI to read canonical entries.
- [x] `Edit-History-CLG-30` - Route durable scene presentation, productivity, workspace layout, and sampler settings into later generation docs instead of hiding them inside Gen 1 implementation.

### Later Generation Holding Pen

These audit findings remain valid wishlist candidates, but they should not widen the first generation.

Generation 2 is closed for current explicit durable single-user undo candidates after each candidate was implemented, proven, or deliberately deferred according to ownership, storage, and commit boundaries:
- authored scene/material/environment presentation settings after they are modeled as project/user state instead of runtime viewer state
- saved visibility or display presets after they become durable authored/project state instead of selection-only or session-only state
- notepad/dashboard content and durable board organization after productivity ownership is explicit
- workspace layout or mode preference state after ownership/storage is clear and it is no longer merely window/session navigation
- sampler/import setting edits that affect durable authored output, excluding source browsing, preview/session, provider/cache, upload status, and other staging-only state

Generation 2 planning surfaces:
- `Edit-History-Gen2-Index.md`
- `Future/Edit-History-Gen2-1 - Durable Scene Presentation Undo Candidates.md`
- `Future/Edit-History-Gen2-2 - Productivity Content Undo Candidates.md`
- `Future/Edit-History-Gen2-3 - Workspace Layout And Preference Undo Candidates.md`
- `Future/Edit-History-Gen2-4 - Sampler And Import Setting Undo Candidates.md`

Generation 3 is closed for current explicit advanced history productization and comparison scope:
- inspectable history UI/readers, richer timeline presentation, filtering, and labels beyond the Gen 1 public metadata contract
- checkpoints/snapshots and optional branching after persistence and single-user restore semantics are designed
- advanced `Build Path` comparison or branch/variant comparison after a live `Build Path` surface exists
- collaboration/multiplayer history only if the user explicitly promotes it, because it changes undo ownership, conflict handling, and branch semantics

Generation 3 planning surfaces:
- `Edit-History-Gen3-Index.md`
- `Future/Edit-History-Gen3-1 - History Reader UX And Labels.md`
- `Future/Edit-History-Gen3-2 - Checkpoints Snapshots And Optional Branching.md`
- `Future/Edit-History-Gen3-3 - Advanced Build Path Comparison.md`

Generation 4 is closed for the current promoted Sketch Draw command-session gaps:
- completed Sketch Draw lines, rectangles, circles, polylines, and delete-selected commands are now routed through staged in-session command undo before the final accepted sketch delta becomes canonical app history
- in-progress draft points, hover, selection-only state, command prompt text, camera/view changes, and local draft behavior should remain outside canonical history
- focused Console input must cooperate with the active Sketch Draw command owner so submitted commands remain undoable/redoable before final sketch commit

Generation 4 planning surfaces:
- `Edit-History-Gen4-Index.md`
- `Future/Edit-History-Gen4-1 - Sketch Draw Authored Command Undo.md`
- `Future/Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer.md`
- `Future/Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership.md`

Generation 5 is closed for durable nested Sketch Draw local history batches:
- Sketch Draw preserves accepted local command histories after final commit and later session re-entry
- Viewer Transform local history remains the reference shape for target-local rows restored by canonical undo/redo
- local CAD histories stay nested under canonical app history instead of becoming app-wide competing owners
- active Sketch Draw sessions consume local undo/redo first, then fall back to canonical app history when no local step exists

Generation 5 planning surfaces:
- `Edit-History-Gen5-Index.md`
- `Future/Edit-History-Gen5-1 - Durable CAD Local History Batches.md`

Routing rule:
- Gen 1 is closed around current authored CAD/project/transform/derived-reader foundations.
- Gen 2 is closed around current durable scene presentation, productivity content, workspace layout/preference, and sampler/import setting candidates, with later runtime work allowed only if a deferred candidate gains a safe authored commit boundary.
- Gen 3 is closed around current visible history reader, checkpoint/snapshot planning, and Build Path comparison readiness; runtime checkpoints and Build Path comparison remain blocked until their future storage/surface prerequisites exist.
- Gen 4 is closed for current explicit Sketch Draw command-session scope: Gen4-1, Gen4-2, and Gen4-3 cover completed authored commands, staged in-session undo/redo, final canonical commit behavior, focused-console active command-session routing, and submitted tool-selection undo/redo.
- Gen 5 is closed around durable Sketch Draw local-history batches that survive committed sessions and later session re-entry while staying nested under canonical app history.
- `Edit-History-CLG-12` is complete for current supported feature-stack operations: add and reorder are undoable, and no live supported feature-stack remove seam exists yet.
- `Edit-History-CLG-28` is complete for the current app surface: no live `Build Path` playhead exists, current scrub/playhead-like navigation stays no-entry/no-redo-invalidation, and any future live Build Path playhead must reopen coverage in Gen 3 or a new follow-up.
- `Edit-History-CLG-30` is complete as routing only; no runtime undo implementation is implied by that closeout.

## Phases

### [x] Edit History 0 - Undoable Surface Audit And First Coverage Recommendation

- audit the live app surfaces that could eventually become undoable
- separate authored edits from navigation, runtime, view, preview, and shell-only state
- recommend the first coverage order before canonical implementation starts
- keep `Edit History 1` narrow enough to prove the transaction owner on graph commands first

Standalone phase doc:
- `Future/Edit-History 0 - Undoable Surface Audit And First Coverage Recommendation.md`

Recommended first coverage order from the audit:
- graph structure and graph parameter commits
- node-owned CAD authoring, feature-stack edits, and committed sketch edits
- Browser/project content organization and accepted import/catalog commits
- committed viewer transform entries
- later durable scene presentation, notepad/dashboard, workspace layout, and optional sampler settings

### [x] Edit History 1 - Canonical Entry And Transaction Foundation

- establish one canonical authored edit-history layer for ParaHook
- define the base undo/redo entry shape, transaction lifecycle, and per-surface adapter model
- lock the first coalescing rules so continuous interaction can stay live without spamming history
- keep this phase focused on foundation, not complete surface coverage
- cover `Edit-History-CLG-1` through `Edit-History-CLG-5`

Recommended first ownership:
- one shared history owner layer
- one shared transaction concept
- one clear boundary between authored edits and pure navigation/view state

Standalone phase doc:
- `Future/Edit-History-1 - Canonical Transaction Foundation.md`

### [x] Edit History 2 - Spaghetti Graph And Parameter Commit Coverage

- make the highest-value graph edits undoable and redoable first
- cover node add/remove, wire connect/remove, node move, and graph parameter commits
- include slider and typed parameter commits under release/confirm semantics instead of per-tick history spam
- keep console mutations routed into the same graph/parameter seams where possible
- cover `Edit-History-CLG-6` through `Edit-History-CLG-11`

Recommended first proof:
- `Spaghetti Editor` graph mutations
- `ParaSlider`, `ParaVec2Slider`, and `ParaVec3Slider` commit behavior
- typed numeric field commit parity with the same underlying store actions

Standalone phase doc:
- `Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`

### [x] Edit History 3 - Node CAD And Sketch Undo Coverage

- widen canonical undo/redo into node-owned CAD authoring
- cover feature-stack edits where authored state is stable
- cover feature parameter commits using the same transaction semantics as graph parameters
- cover committed sketch entity edits while keeping local draft sketch points outside canonical undo
- cover `Edit-History-CLG-12` through `Edit-History-CLG-16`

Recommended first proof:
- node-owned feature-stack edits
- feature parameter commit behavior
- committed sketch entity create/delete/modify behavior

Standalone phase doc:
- `Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`

### [x] Edit History 4 - Browser Project Content And Accepted Import Undo Coverage

- widen canonical undo/redo into Browser/project content organization
- cover rename, reorder, reparent, and durable create/delete where the app already supports those actions
- cover accepted Import commits and accepted Catalog/Add To Project commits that mutate durable project content
- keep previews, source/cache/provider state, and selection-only state outside canonical undo
- cover `Edit-History-CLG-17` through `Edit-History-CLG-22`

Recommended first proof:
- Browser/project structure edits
- accepted Import content commits
- accepted Catalog/Add To Project content commits
- content-organization commands issued through `Console`

Standalone phase doc:
- `Future/Edit-History-4 - Browser Project Content And Accepted Import Undo Coverage.md`

### [x] Edit History 5 - Viewer Transform Commit Undo Integration

- widen edit history into committed transform behavior without recording every live drag frame
- keep transform draft/live drag responsive while only committing history on release or explicit commit
- route transform-context keyboard undo/redo through canonical authored history where appropriate
- preserve the already-shipped local transform-history reads while aligning canonical authored undo semantics
- cover `Edit-History-CLG-23` through `Edit-History-CLG-26`

Recommended first proof:
- committed transform entries become undoable authored steps
- `Ctrl+Z` and `Ctrl+Y` route through canonical history in transform contexts
- transform entry/live drag remains separate from canonical commit history

Standalone phase doc:
- `Future/Edit-History-5 - Viewer Transform Commit Undo Integration.md`

### [x] Edit History 6 - Derived Readers And Later Coverage

- make `Build Path` and other derived history readers respond to canonical authored undo/redo truth
- keep `Build Path` as a scrub/read surface instead of a second undo owner
- define how later history UI, labels, timeline emphasis, or audit surfaces read from canonical entries
- leave collaboration, multiplayer branching, and more advanced history visualization to later follow-ons unless needed earlier
- cover `Edit-History-CLG-27` through `Edit-History-CLG-30`

Recommended first proof:
- `Build Path` visibly changes when authored undo/redo changes the canonical model state
- timeline scrub remains navigation state, not an authored edit by default
- derived readers can rebuild from canonical history without inventing duplicate undo models

Standalone phase doc:
- `Future/Edit-History-6 - Derived Readers And Later Coverage.md`

### [ ] Edit History Gen3 - Advanced History UX And Checkpoints Planning

- route advanced history productization into a dedicated planning surface after Gen 1 metadata proof and Gen 2 durable-surface closeout
- keep the canonical edit-history owner intact while planning read-only history UX, checkpoints/snapshots, optional branching, and advanced Build Path comparison
- keep collaboration/multiplayer conditional unless the user explicitly promotes it
- keep these docs planning-only until Manager approves a proof or runtime slice

Generation index:
- `Edit-History-Gen3-Index.md`

Standalone future docs:
- `Future/Edit-History-Gen3-1 - History Reader UX And Labels.md`
- `Future/Edit-History-Gen3-2 - Checkpoints Snapshots And Optional Branching.md`
- `Future/Edit-History-Gen3-3 - Advanced Build Path Comparison.md`

### [ ] Edit History Gen4 - Sketch Draw Command Session Undo

- route the promoted Sketch Draw command-session gaps into a dedicated generation after Gen 1-3 closeout
- keep completed Sketch Draw line/rectangle/circle/polyline and delete-selected commands undoable inside the active staged session before the final accepted delta becomes canonical app history
- add focused-console active command-session undo ownership so submitted Console commands do not lose `Ctrl+Z` / `Ctrl+Y` to native input history
- preserve the existing exclusion rule for local draft points, hover, selection-only state, command prompt text, camera/view state, command transcript/recall, and runtime/cache/build state

Generation index:
- `Edit-History-Gen4-Index.md`

Standalone future docs:
- `Future/Edit-History-Gen4-1 - Sketch Draw Authored Command Undo.md`
- `Future/Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer.md`
- `Future/Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership.md`
- `Future/Edit-History-Gen5-1 - Durable CAD Local History Batches.md`

## Questions / Decisions

### [x] q1 - should `Edit History` be the canonical authored history for ParaHook, with `Build Path` reading that truth instead of owning a second undo model?

#### Suggestion

Yes. `Edit History` should be the canonical authored history. `Build Path` should derive its scrub/read surface from that truth and should visually respond when undo/redo changes the authored state.

Decision:

- yes
- `Edit History` should be the canonical authored history for ParaHook
- `Build Path` should read and visually respond to canonical authored history changes
- `Build Path` should not become a second competing undo owner

### [x] q2 - should the first cut prioritize authored data edits and explicitly exclude pure navigation/view-state changes such as camera orbit and temporary selection-only state?

#### Suggestion

Yes. The first cut should prioritize authored data edits. Keep camera movement, temporary hover state, and other pure navigation/view state out of canonical undo/redo unless those states later become explicitly authored features.

Decision:

- yes
- the first cut should prioritize authored data edits
- camera movement, temporary hover state, and other pure navigation/view state should stay out of canonical undo/redo in the first pass
- these view-state surfaces can be widened later only if they become explicitly authored features

### [x] q3 - should slider and drag-style interactions commit one history entry on release/confirm instead of recording every intermediate live value?

#### Suggestion

Yes. Keep live interaction fluid, but commit one history entry on release or confirm. That makes undo meaningful and prevents history spam.

Decision:

- yes
- slider and drag-style interactions should stay live during interaction
- canonical history should record one entry on release, drop, confirm, `Enter`, or equivalent commit
- do not record every intermediate live value as its own history step

### [x] q4 - should console commands that mutate authored state reuse the same shared store mutation seams as the visible UI so undo/redo stays surface-agnostic?

#### Suggestion

Yes. Console mutations should flow through the same underlying authored mutation seams as the UI. The history system should record the shared state change, not the fact that the command came from the console.

Decision:

- yes
- console commands that mutate authored state should reuse the same shared store mutation seams as the UI
- undo/redo should record the shared authored state change rather than the entry surface
- `Console` should stay an adapter into canonical history, not a separate history owner

### [x] q5 - should the first implementation phase start with the highest-value authored surfaces such as graph edits, parameter commits, Browser organization, and committed transforms before widening into every edge case?

#### Suggestion

Yes. Start with the highest-value authored surfaces first. Prove the canonical model on graph edits, parameter commits, Browser organization, and committed transforms before widening into lower-priority or more ambiguous edit classes.

Decision:

- yes
- the first implementation phase should start with the highest-value authored surfaces
- prove the model first on graph edits, parameter commits, Browser organization, and committed transforms
- widen into lower-priority or more ambiguous edit classes only after the canonical model is stable

# Transform

## Doc Header

### Doc History
54. 2026-03-27 19:04: Split the earlier combined `Transform 14` feature in this family index into a narrower `Transform 14` rename/alignment pass plus a new `Transform 15` generated-object viewer-motion pass, so the toolbar/shell naming cleanup no longer waits on the harder target-widening work
53. 2026-03-27 19:01: Added the new `Transform 14` feature follow-on to this family index, locking that the current transform toolbar/shell should be renamed `Viewer Transform` and widened so generated objects can use the same viewer-owned transform interaction while staying explicitly viewer-only and not writing those edits back into Replicad truth
52. 2026-03-27 17:27: Expanded the open `Transform 13.1` rotate preview follow-on so it now explicitly owns a dedicated transform-reference `i`-menu `Rotate Snap Preview` section with viewer-only controls for on/off, line size, thickness, preview radius, and preview delay
51. 2026-03-27 17:24: Tightened the new `Transform 13.1` rotate snap preview-lines follow-on into a more implementation-ready spec by locking stable angular keying, one concrete visible-window rule, active-axis-only activation constraints, and sharper helper/viewer test expectations while keeping free-rotate and scale out of scope
50. 2026-03-27 17:19: Cleaned up the Transform-family docs after shipping `Transform 13.2` by moving its standalone move-snap lattice record into `Shipped/`, adding the new implementation-ready `Transform 13.1` rotate snap preview-lines doc in `Future/`, and tightening this index so rotate is now the next open snap-visual follow-on while the move-only rebuild reads as complete
49. 2026-03-27 16:53: Tightened the rebuilt `Transform 13.2` direction with one small polish lock so the highlighted current snap dot should stay only modestly larger than the normal field dots and transfer that emphasis on arrival at the next snapped point, reinforcing the intended “gizmo moves from dot to dot” read
48. 2026-03-27 16:43: Rebuilt the `Transform 13.2` follow-on in the family docs as a clean move snap visual-system rewrite instead of a narrower lattice cleanup pass, tightening the next viewer work around one stable world-keyed lattice plus a visible-window and emphasis layer so the move dots stop reading like a gizmo-owned patch
47. 2026-03-27 16:38: Tightened the standalone `Transform 13.2` follow-on into a more implementation-ready spec, locking one exact `Move Snap Radius` viewer control and explicit buffered-lattice/keying rules so the next move-only snap-visual correction now reads as direct helper/store/viewer work instead of only higher-level product intent
46. 2026-03-27 16:33: Tightened the new `Transform 13.2` follow-on so the future move snap lattice cleanup now explicitly includes an `i`-menu viewer control for expanding the visible dot radius/neighborhood, keeping that control presentation-only and separate from real snap spacing/math
45. 2026-03-27 16:28: Added a new standalone `Transform 13.2` future follow-on for persistent move snap lattice cleanup, tightening the next move-only viewer correction around world-anchored dot identity, buffered absolute snap fields, and size/opacity emphasis so the move snap dots stop reading like a gizmo-attached moving block
44. 2026-03-27 15:18: Cleaned up the Transform-family docs after the shipped `Transform 13` move snap visual pass by moving its standalone phase record from `Future/` into `Shipped/` and updating this family index so the move visual phase no longer points at a stale future-path planning surface
43. 2026-03-27 15:14: Marked `Transform 13` shipped in this family index after the first move-only snap availability visuals landed in the viewer, keeping the pass scoped to active move drag only, preserving rotate for later `Transform 13.1`, and leaving scale out of scope
42. 2026-03-27 15:10: Added the standalone implementation-ready `Transform 13` future phase doc for move snap availability visuals, and tightened this family index so `Transform 13` is now move-only during active move-drag entry while the earlier rotate visual idea is deferred into later `Transform 13.1`
41. 2026-03-27 15:05: Tightened the new `Transform 13` viewport snap-visual direction in this family index against a concrete sketch, clarifying that enabled move snap should render a local field of tiny white snap dots around the active gizmo context rather than a broad red-debug-style scatter, while keeping rotate on nearby guide lines and leaving scale out of scope
40. 2026-03-27 15:02: Added the next snap-visualization follow-on to this family index as `Transform 13`, locking the first viewport direction so enabled move snap should render nearby snap-point dots/spheres while dragging, enabled rotate snap should render nearby snap-guide lines while rotating, and scale should stay out of scope for that first visual pass
39. 2026-03-27 14:45: Cleaned up the Transform-family docs after the shipped `Transform 11` Console snap parity work by moving its standalone phase record into `Shipped/`, updating this family index so `Transform 11` now reads as complete, and adding the new standalone implementation-ready `Transform 12` future phase doc for transform-shell polish and canonical adapter cleanup
38. 2026-03-27 14:20: Added the standalone `Transform 11` future phase doc for Console snap parity cleanup, updated this family index so the next open Transform follow-on now reads as a narrow Console-side adapter cleanup after the shipped `Transform 10` per-axis snap model, and locked the first `Transform 11` decisions around one enable-state action, `Locked / Unlocked` wording, and keeping mode-local `Snap` paths as adapters into the shared owner branch
37. 2026-03-27 14:04: Marked `Transform 10` shipped in this family index after the ratio-locked per-axis snap work landed, removed the stale `Transform 11` split for viewer execution because that gizmo/runtime widening shipped in the same pass, and added the new standalone shipped record for the unified per-axis snap phase
36. 2026-03-27 13:20: Cleaned up the Transform-family docs after shipping `Transform 9` by marking the shared toolbar `X` exit sync complete in this index, moving its standalone record into `Shipped/`, and splitting the next snap follow-on into `Transform 10` shared snap `XYZ` lock plus adapter ownership versus later `Transform 11` per-axis snap execution in the viewer/gizmo seam
35. 2026-03-27 11:49: Locked the first `Transform 8` snap direction in this family index, deciding that transform snap lives under `Transform > Settings > Snap`, that `Move`, `Rotate`, and `Scale` each expose both whole-mode snap and deeper axis-specific snap paths, and that mode-local `Snap` entry points are only adapters into that same shared settings tree
34. 2026-03-27 11:36: Cleaned up the Transform family after shipping `Transform 7`, marking the shared `Local / World` work complete in this index, moving its standalone phase record into `Shipped/`, narrowing the open follow-ons down to `Transform 8` snap controls plus `Transform 9` toolbar `X` exit sync, and making `Transform 8` the active next task
33. 2026-03-27 09:44: Tightened the `Transform 7` direction again in this family index so the honest hierarchy now reads as `Transform > Settings > Space > Choose next [Local, World]`, while `L` and `W` are documented as common transform-shell shortcuts that can be called from almost anywhere and resolve into that same shared setting instead of becoming a second owner path
32. 2026-03-27 09:39: Tightened the `Transform 7` command wording in this family index so transform space now reads as `space:Local` / `space:World`, defaults to `Local` when the user enters `Transform`, and only surfaces the opposite mode as the available command instead of showing both at once
31. 2026-03-27 09:36: Tightened the `Transform 7` direction again in this family index so the `Local / World` Console command now explicitly has to stay synced with the reference-transform `Local / World` button, making both surfaces read and write the same shared transform-space state
30. 2026-03-27 09:34: Tightened the `Transform 7` direction in this family index so `Local / World` now reads as a transform-shell command the user can call from almost anywhere inside `Transform`, more like `Move` / `Rotate` / `Scale`, instead of a root-only `Space` branch
29. 2026-03-27 09:31: Expanded the `Transform 7` block in this family index with a fuller question set, adding explicit open questions around the shell-entry default for `Local / World`, whether space switching should be allowed only at the `Transform` root or also during active sub-entries, and how space should relate to scrubbed history versus committed transform rows
28. 2026-03-27 09:26: Marked `Transform 6` shipped in this family index after the history scrub layer landed, moved its standalone phase record into `Shipped/`, and split the next transform follow-ons into `Transform 7` console `Local / World` space access, `Transform 8` shared transform snap controls, and `Transform 9` toolbar `X` exit sync with the Console shell
27. 2026-03-27 02:06: Tightened the `Transform 6` family index into implementation-ready scrub language, removing the stale `preview / restore` framing, renaming the phase direction around direct history scrub and traversal, and locking that there is no separate restore action in the first pass because the scrub head itself owns the active rendered history position
26. 2026-03-27 01:58: Cleaned up the `Transform 6` question list in this family index so the stale open markers now match the actual locked direction, marking history granularity and preview-versus-restore behavior as answered while leaving explicit restore-history mutation as the main remaining open `Transform 6` question
25. 2026-03-27 01:52: Locked the `Transform 6` branched-commit rule in this family index, deciding that if the user scrubs back to an earlier committed entry and then commits a new transform step, that new row should insert immediately after the scrubbed entry, the old future rows should remain after it and replay from that insertion point, and the child-entry numbering should renumber to the new visible order
24. 2026-03-27 01:45: Tightened the first `Transform 6` scrub default-state rule in this family index, deciding that when the user is not actively traversing history the history paraslider should stay pinned at `100%` on the newest committed entry, and that each new history commit should advance that idle scrub head forward to the latest entry automatically
23. 2026-03-27 01:41: Locked the first `Transform 6` traversal-entry and emphasis direction in this family index, deciding that the initial scrub model should be a history paraslider from entry `0..last`, and that when the scrub head sits on an earlier entry the later committed entries should deactivate while their future preview lines stop rendering in the viewport
22. 2026-03-27 01:35: Marked `Transform 5` shipped in this family index after the committed viewport-history baseline landed, moved its standalone phase record from `Future/` into `Shipped/`, and advanced the Transform family so `Transform 6` is now the only remaining open follow-on
21. 2026-03-27 01:31: Expanded the `Transform 6` block in this family index so the actual traversal follow-on now carries the fuller question set inline here too, adding explicit open questions around preview entry, restore semantics, viewport/toolbar emphasis, and how traversal should suspend the live transform shell while scrub preview is active
20. 2026-03-27 01:24: Added the standalone `Transform 6` future phase doc for history traversal / preview / restore, so the Transform family now has an explicit planning surface for the post-visual scrub layer instead of leaving that follow-on only as an open block in this umbrella index
19. 2026-03-27 00:13: Tightened the shared merge direction in this family index so collapsing transform history should preserve at least one surviving committed entry for each transform kind that exists in the merged set, instead of collapsing `Move`, `Rotate`, and `Scale` together into one last unlocked row
18. 2026-03-27 00:10: Tightened `Transform 5 q1` in this family index against the shipped SketchPlane visual example so the first move-history viewport path now explicitly reads as the same thin committed polyline with visible checkpoint turns between committed origins rather than only a generic connected line description
17. 2026-03-27 00:09: Locked `Transform 5 q2` in this family index so rotate history should show the before/after normal directions with an arc between them, while scale history should compare the relative size of a before-versus-after sphere instead of staying at the earlier generic overlay wording
16. 2026-03-27 00:06: Split the old `Transform 5` follow-on in this family index into `Transform 5` viewport-history visuals versus later `Transform 6` traversal / preview / restore, locking that the first move-history visual should copy the shipped `SketchPlane` committed history line behavior and clarifying that traversal is the actual scrub layer over committed history rather than part of the first visual baseline
15. 2026-03-26 23:55: Marked the shipped `Transform 3`, `Transform 4.2`, `Transform 4.3`, and `Transform 4.4` records complete in this family index after the shell, shared-draft, grouped-history, and adapter-cleanup work landed, moved those standalone phase docs into `Shipped/`, and advanced the Transform family so `Transform 5` is now the next clear open follow-on
14. 2026-03-26 22:10: Added the standalone `Transform 4.4` future phase doc for Console-and-toolbar adapter cleanup, so the Transform family now has an explicit cleanup phase focused on extracting transform-specific prompt, breadcrumb, handle-sync, and submit/cancel policy out of `ConsoleDock` instead of leaving that structural cleanup only implicit in chat
13. 2026-03-26 20:49: Locked the `Transform 4.3` grouped-session-history questions in this family index, deciding that committed child entries remain the base truth with per-entry `sessionId` and `sessionOrdinal` metadata, that shell sessions start on entering `Transform` and close on `CommitTransform`, that empty shells create no parent row, that the newest session defaults expanded while older sessions default collapsed, that parent rows stay expand/collapse-only, and that session numbering remains persistent per target
12. 2026-03-26 20:46: Expanded the `Transform 4.3` section in this family index with a fuller grouped-session-history question set, adding explicit open `[ ]` decisions around storage shape, shell-session start/end rules, empty-session behavior, default expand/collapse behavior, parent-row actions, and persistent session numbering so the new `4.3` phase doc can be tightened into an implementation-ready toolbar/history reshape
11. 2026-03-26 20:43: Added the standalone `Transform 4.3` future phase doc for grouped transform-session history, so the Transform family now has a dedicated follow-on for turning flat committed history into expandable shell-session rows like `Transform 1`, `Transform 2`, and later sessions without mixing that toolbar/history reshape back into the already-narrowed `Transform 4.2` draft-sync cleanup
10. 2026-03-26 20:10: Narrowed `Transform 4.2` back down in this family index by moving grouped transform-session history out of the draft/session cleanup and into a separate `Transform 4.3` follow-on, so `4.2` now stays focused on shared draft/session sync while grouped history remains a later toolbar/history reshape
9. 2026-03-26 20:03: Expanded `Transform 4` in this family index with a dedicated `Transform 4.2` question block, adding explicit open `[ ]` decisions around one shared reference draft session, viewer-to-draft sync, Console/toolbar draft reads, commit-vs-cancel behavior, and whether the cleanup should stay reference-first
8. 2026-03-26 20:00: Added the standalone `Transform 4.2` future phase doc for reference-side shared draft and session cleanup, so the next Console-polish step now explicitly captures the need to restructure reference transform around one shared store-owned draft session like sketch-plane transform instead of leaving that cleanup only implicit in chat
7. 2026-03-26 19:50: Reframed the later transform ladder so `Transform 4` is now the console cleanup bridge between the durable shell work and the heavier viewport-history phase, while the older viewport-history plus traversal direction moved down to `Transform 5`
6. 2026-03-26 19:21: Updated `Transform` phase and question status markers in this family index so locked questions now use `[x]`, still-open questions use `[ ]`, and fully locked phase titles show `[x]` while later phases with open questions remain `[ ]`
5. 2026-03-26 19:19: Locked `Transform 3` `q1` through `q3`, deciding that committed transform entries should return to the same target-local `Transform` shell until the user explicitly exits with `CommitTransform`, that transform history should remain visible while repeated steps continue, and that the shared session shell should stay app/store-owned across Console and toolbar surfaces; also added a new `q4` to explicitly lock whether entering `Transform` itself should spawn the shared transform session and toolbar
4. 2026-03-26 18:22: Locked the `Transform 2` questions in this family index, deciding that `Transform` is the canonical first transform entry under valid targets, direct target-local `Move/Rotate/Scale` remain allowed only as adapter shortcuts into that branch, and real non-reference ownership in this phase should cover object, folder, and assembly targets instead of faking them through reference transform
3. 2026-03-26 18:14: Locked the first `Transform 1` questions in this family index, deciding that the foundation phase stays reference-first, active transforms must enter the live transform session instead of staying at the generic selected-reference menu, and committed transform history should persist for the life of the target instead of being auto-pruned
2. 2026-03-26 18:10: Expanded the new `Transform` family index by turning the phase ladder into explicit `###` phase sections with `####` questions and `##### Suggestion` blocks for `Transform 1` through `Transform 4`, so the family now reads like a real planning surface instead of only a short cross-link back to Browser
1. 2026-03-26 17:55: Created the new `Transform` architecture family with `Future/` and `Shipped/` folders plus this umbrella index so the Browser transform direction can grow into its own cross-surface architecture home instead of staying only inside Browser planning

### Purpose

This doc defines the architecture direction for the ParaHook transform family.

This file is the umbrella index for `Transform`.

Use it to answer:
- what the transform family should own
- what Browser, Console, viewport, and toolbar surfaces should adapt into rather than own themselves
- where future and shipped transform-phase docs should live
- how transform session, history, and viewport visualization planning should relate across target kinds

### Family Structure

Use this folder like this:

- `transform-index.md`
  - umbrella transform architecture direction
  - live seam read
  - transform-family summary
- `Future/`
  - standalone implementation-ready transform phase docs
- `Shipped/`
  - later shipped transform phase records

### Why This Doc Exists

Transform work is no longer only a Browser follow-on.

It now spans:
- Browser-selected target hierarchy
- Console transform grammar
- target-local transform session behavior
- viewer-owned transform execution
- app/store-owned history
- viewport history visualization

That makes transform a cross-surface feature family, not only a Browser subtree concern.

### Scope

This doc covers:
- transform-family ownership
- transform session and history direction
- transform alignment across Browser, Console, viewport, and toolbar surfaces
- future transform phase organization

This doc does not cover:
- general Browser row architecture outside transform entry paths
- general viewer rendering outside transform execution and transform-history visuals
- unrelated camera/view commands
- unrelated shell/window placement behavior

## Doc Body

### Short Version

Transform should be one cross-surface family with one honest target-local hierarchy.

It should:
- expose one canonical `Transform > Move / Rotate / Scale` path
- let multiple surfaces adapt into that same path
- keep live transform execution viewer-owned
- keep target-local history app/store-owned
- keep viewport visuals aligned with the same committed history the toolbar renders

It should not:
- stay trapped as a Browser-only planning concern forever
- fork transform behavior by surface
- let the toolbar become the hidden owner of transform semantics

### Initial Direction

The Transform family should eventually own planning for:
- canonical transform hierarchy
- target-local transform session behavior
- target-local transform history behavior
- shared Console transform grammar
- viewport transform-history visualization
- target-family ownership for reference, object, folder, and later assembly transforms

### Current Relationship To Browser

The broader Browser transform umbrella still carries the top-level long-range direction, but the landed shell and cleanup work now has Transform-native shipped records.

Current live umbrella source:
- `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-7.5 - Final Transform Direction And Phase Split.md`

Current Transform-native shipped records:
- `Transform 3`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-3 - Shared Transform Shell And Repeated Steps.md`
- `Transform 4.2`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-4.2 - Reference Draft Sync And Session Cleanup.md`
- `Transform 4.3`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-4.3 - Grouped Session History.md`
- `Transform 4.4`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-4.4 - Console And Toolbar Adapter Cleanup.md`
- `Transform 5`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-5 - Viewport History Visual Baseline.md`
- `Transform 6`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-6 - History Scrub And Traversal.md`
- `Transform 7`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-7 - Console Local World Space.md`
- `Transform 9`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-9 - Toolbar X Exit Sync To Console.md`
- `Transform 10`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-10 - Ratio Locked Per Axis Snap.md`
- `Transform 11`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-11 - Console Snap Parity Cleanup.md`
- `Transform 13`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-13 - Move Snap Availability Visuals.md`
- `Transform 13.2`
  - `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-13.2 - Persistent Move Snap Lattice Cleanup.md`

This family now owns the shipped Transform-shell cleanup trail directly, while Browser `7.5` still holds the broader future ladder until the remaining open transform-native follow-ons are written down outside Browser.

### Next Steps

Expected next open transform-native follow-ons:

1. land the first rotate snap preview visual as `Transform 13.1`
2. rename the current surface to `Viewer Transform` as `Transform 14`
3. widen that renamed shell to generated-object viewer motion as `Transform 15`, while keeping those edits viewer-only and not Replicad truth yet
4. keep deciding how much of the remaining Browser-umbrella direction should be re-expressed as Transform-native future records instead of staying Browser-numbered
5. keep cleaning stale family links whenever a transform follow-on moves from `Future/` to `Shipped/`


## Phases

### [x] Transform 1 - Reference Session And History Foundation
#### Info
- own the reference-first live transform session and append-on-commit history foundation
- prove the store/history/commit-callback model on the already-real reference transform path
- keep this as the transform-family foundation even though the original planning record came from Browser `7.3`

#### [x] q1 - Should `Transform 1` stay reference-first, or widen into object and assembly ownership immediately?

##### Suggestion
- keep `Transform 1` reference-first
- build on the already-real reference transform path first
- use this phase to prove the history/session model before widening target ownership

Decision:
- keep `Transform 1` reference-first
- build on the already-real reference transform path first
- use this phase to prove the history/session model before widening target ownership

#### [x] q2 - While a reference transform is active, should Console stay at the generic selected-reference menu or enter the live transform session?

##### Suggestion
- enter the live transform session
- do not keep the generic selected-reference `Choose next [...]` menu visible while transform is active
- keep the active Console path honest to the live transform state

Decision:
- enter the live transform session
- do not keep the generic selected-reference `Choose next [...]` menu visible while transform is active
- keep the active Console path honest to the live transform state

#### [x] q3 - Where should committed reference transform history live, and when should it append?

##### Suggestion
- keep live transform execution viewer-owned
- keep committed history app/store-owned
- append one entry only on real commit, never during preview drag
- keep transform history persistent for the life of the target
- do not auto-prune old entries
- let the user control cleanup through merge and later explicit history tools instead of automatic deletion

Decision:
- keep live transform execution viewer-owned
- keep committed history app/store-owned
- append one entry only on real commit, never during preview drag
- keep transform history persistent for the life of the target
- do not auto-prune old entries
- let the user control cleanup through merge and later explicit history tools instead of automatic deletion
- keep committed child rows as enriched `delta + after` history entries, with `before` derived from earlier committed rows instead of stored directly

### [x] Transform 2 - Canonical Hierarchy And Target Ownership
#### Info
- move valid transform targets onto the honest `Select > <Target> > Transform > Move/Rotate/Scale` hierarchy
- keep target-local `m / r / s` as convenience adapters into that hierarchy
- add real non-reference target ownership beside the existing reference path

#### [x] q1 - Should `Transform` be the canonical first transform entry under valid targets?

##### Suggestion
- yes
- selected transformable targets should expose `Transform`
- `Move`, `Rotate`, and `Scale` should live one level deeper under that branch

Decision:
- yes
- selected transformable targets should expose `Transform`
- `Move`, `Rotate`, and `Scale` should live one level deeper under that branch

#### [x] q2 - Should direct target-local `Move`, `Rotate`, and `Scale` still be allowed?

##### Suggestion
- yes, as adapter shortcuts only
- direct `Move`, `Rotate`, and `Scale` should auto-enter the canonical `Transform > Move/Rotate/Scale` path
- breadcrumbs should still resolve honestly through `Transform`

Decision:
- yes, as adapter shortcuts only
- direct `Move`, `Rotate`, and `Scale` should auto-enter the canonical `Transform > Move/Rotate/Scale` path
- breadcrumbs should still resolve honestly through `Transform`

#### [x] q3 - Which target kinds should gain real transform ownership in this phase?

##### Suggestion
- add real object, folder, and assembly transform state paths beside the existing reference path
- do not fake those targets by redirecting them into reference-owned transform

Decision:
- add real object, folder, and assembly transform state paths beside the existing reference path
- do not fake those targets by redirecting them into reference-owned transform

### [x] Transform 3 - Shared Transform Shell And Repeated Steps
#### Info
- keep the target-local transform shell alive across repeated committed steps
- align post-commit return, lock, merge, and history-shell behavior across target kinds
- make the transform session feel like one durable command shell instead of a one-shot action

#### [x] q1 - After a committed transform, should Console return to the broader selected-target scope or stay inside `Transform`?

##### Suggestion
- return to the same target-local `Transform > Choose next` scope
- keep the transform shell alive after commit so repeated transform steps remain local

Decision:
- after a committed `Move`, `Rotate`, or `Scale` entry, return to the same target-local `Transform > Choose next` scope
- keep the transform shell alive after each committed transform entry
- do not return to the broader selected-target scope until the user explicitly exits the shell with `CommitTransform`

#### [x] q2 - Should transform history remain visible while repeated transform steps continue?

##### Suggestion
- yes
- the transform toolbar/history shell should stay visible between committed steps
- repeated transforms should append into the same visible target-local history session

Decision:
- yes
- the transform toolbar/history shell should stay visible between committed steps
- repeated transforms should append into the same visible target-local history session

#### [x] q3 - Should lock and merge semantics align across target kinds?

##### Suggestion
- yes
- preserve one shared append-on-commit, lock, and merge model across reference and later non-reference target families where the behaviors match

Decision:
- yes
- preserve one shared append-on-commit, lock, and merge model across reference and later non-reference target families where the behaviors match
- keep the shared transform shell app/store-owned so Console and toolbar stay as aligned adapter surfaces over the same session state
- when collapsing transform history, preserve at least one surviving committed entry for each transform kind present in the merged set, so `Move`, `Rotate`, and `Scale` do not collapse dishonestly into one last unlocked row

#### [x] q4 - Should entering `Transform` itself spawn the shared transform session and toolbar?

##### Suggestion
- yes
- entering `Transform` should create or activate the target-local shared transform session
- the toolbar should appear because that session exists, not because Console directly tells a toolbar to open
- Console and toolbar should both adapt into the same underlying session

Decision:
- yes
- entering `Transform` should create or activate the target-local shared transform session
- the toolbar should appear because that session exists, not because Console directly tells a toolbar to open
- Console and toolbar should both adapt into the same underlying session

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-3 - Shared Transform Shell And Repeated Steps.md`

### [x] Transform 4 - Console Cleanup And Transform Shell Polish
#### Header
- clean up the remaining Console rough edges before the heavier history-visualization phase
- make the durable transform shell read clearly and consistently in breadcrumbs, prompts, and submit ownership
- keep this as the short bridge phase between `Transform 3` shell behavior and the later viewport-history work


##### [x] q1 - What Console cleanup is required before the history-visualization phase starts?

##### Suggestion
- finish the transform-shell wording cleanup first
- remove any stale staged-menu language that still reads like generic `Choose next` text when the transform shell should read more directly
- keep breadcrumbs, prompt labels, and submit ownership honest to the durable `Transform` shell

Decision:
- finish the transform-shell wording cleanup through shared reference-transform helpers instead of leaving the remaining policy in scattered `ConsoleDock` branches
- keep breadcrumbs, prompt labels, path status, and handle-driven prompt depth honest to the durable `Transform` shell
- have Console and toolbar read the same transform presentation seam so later cleanup does not drift across surfaces

##### [x] q2 - Where should `CommitTransform` surface in the Console after the shell becomes durable?

##### Suggestion
- surface `CommitTransform` at the `Transform` root only
- do not keep it duplicated inside `Move`, `Rotate`, or `Scale`
- let per-entry submits commit the current transform entry, while `CommitTransform` exits the shell

Decision:
- surface `CommitTransform` at the `Transform` root only
- do not duplicate it inside `Move`, `Rotate`, or `Scale`
- let per-entry submits commit the current transform entry while `CommitTransform` exits the shell

##### [x] q3 - What input/prompt cleanup should happen before traversal and viewport visuals are added?

##### Suggestion
- make assisted vec3, axis float, and plane vec2 entry behavior fully consistent across `Move`, `Rotate`, and `Scale`
- ensure clearing typed input cleanly restores the default assisted option where that behavior is intended
- lock Console submit, cancel, and shortcut behavior before layering traversal or viewport-history playback on top

Decision:
- keep assisted vec3, axis, and plane prompt behavior aligned across `Move`, `Rotate`, and `Scale`
- make axis prompts relative-by-default with explicit absolute `@...` override, and keep live prompt autofill honest about that absolute value
- make axis/plane escape cancel live drag cleanly and step back without re-opening stale prompts
- return committed axis/plane and root shorthand submits back to the shared `Transform` root before later traversal or viewport-history work is layered on top

#### Transform 4.2

##### [x] q4.2-1 - Should reference transform get one explicit active draft session object in store?

###### Suggestion
- yes
- replace the current spread-across-several-fields model with one honest active draft session for the active reference transform

Decision:
- yes
- replace the current spread-across-several-fields model with one honest active draft session for the active reference transform

##### [x] q4.2-2 - During a live reference transform entry, should Console and toolbar read from the draft session directly?

###### Suggestion
- yes
- Console and toolbar should both read the same live draft object directly instead of reconstructing state from committed override fields

Decision:
- yes
- Console and toolbar should both read the same live draft object directly instead of reconstructing state from committed override fields

##### [x] q4.2-3 - Should viewer gizmo changes write into the active draft continuously?

###### Suggestion
- yes
- mirror the sketch-plane pattern
- keep the viewer as execution owner while the store remains the draft/session owner

Decision:
- yes
- mirror the sketch-plane pattern
- keep the viewer as execution owner while the store remains the draft/session owner

##### [x] q4.2-4 - Should commit promote the draft into committed transform state and history, while cancel restores from entry origin?

###### Suggestion
- yes
- commit should promote the draft into committed transform state and append history when the value changed
- cancel should restore draft and applied state from the captured entry origin
- keep existing committed history intact during this cleanup
- defer grouped transform-session history like `Transform 1`, `Transform 2`, and later session rows to `Transform 4.3`

Decision:
- yes
- commit should promote the draft into committed transform state and append history when the value changed
- cancel should restore draft and applied state from the captured entry origin
- keep existing committed history intact during this cleanup
- defer grouped transform-session history like `Transform 1`, `Transform 2`, and later session rows to `Transform 4.3`

##### [x] q4.2-5 - Should `Transform 4.2` stay reference-first, or widen to object, folder, and assembly in the same pass?

###### Suggestion
- keep it reference-first
- prove the shared draft/session cleanup on the existing reference path before widening it to other target kinds

Decision:
- keep it reference-first
- prove the shared draft/session cleanup on the existing reference path before widening it to other target kinds

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-4.2 - Reference Draft Sync And Session Cleanup.md`


#### Transform 4.3

##### [x] q4.3-1 - Should committed history be grouped into expandable transform-shell session rows like `Transform 1`, `Transform 2`, and later sessions?

###### Suggestion
- yes
- keep all committed history
- move the grouped-history toolbar reshape into `Transform 4.3` instead of mixing it into the draft/session cleanup

Decision:
- yes
- keep all committed history
- move the grouped-history toolbar reshape into `Transform 4.3` instead of mixing it into the draft/session cleanup

##### [x] q4.3-2 - What store shape should own grouped transform-session history?

###### Suggestion
- keep the committed child entry rows as the base truth
- add a `sessionId` onto each committed entry rather than building a second parallel grouped-history tree
- let the toolbar derive grouped parent rows from that session metadata

Decision:
- keep the committed child entry rows as the base truth
- add `sessionId` and persistent `sessionOrdinal` metadata onto each committed entry
- do not build a second parallel grouped-history tree
- let the toolbar derive grouped parent rows from that session metadata

##### [x] q4.3-3 - When does a grouped transform session start and end?

###### Suggestion
- start a new grouped session when the user enters `Transform`
- keep appending child `Move` / `Rotate` / `Scale` entries into that active session while the shell stays open
- close the grouped session only when the user exits with `CommitTransform`

Decision:
- start a new grouped session when the user enters `Transform`
- keep appending child `Move` / `Rotate` / `Scale` entries into that active session while the shell stays open
- close the grouped session only when the user exits with `CommitTransform`

##### [x] q4.3-4 - If the user enters `Transform` and exits without committing any child entries, should a `Transform N` row still be created?

###### Suggestion
- no
- only create a grouped parent session row if that shell session produced at least one committed child entry
- do not create empty placeholder sessions

Decision:
- no
- only create a grouped parent session row if that shell session produced at least one committed child entry
- do not create empty placeholder sessions

##### [x] q4.3-5 - What should the default expand/collapse behavior be for grouped transform sessions?

###### Suggestion
- default the newest grouped transform session to expanded
- let older grouped sessions start collapsed for readability
- keep expand/collapse as a local toolbar presentation state unless a later phase explicitly needs persistence

Decision:
- default the newest grouped transform session to expanded
- let older grouped sessions start collapsed for readability
- keep expand/collapse as a local toolbar presentation state unless a later phase explicitly needs persistence

##### [x] q4.3-6 - What actions should live on the grouped parent session row?

###### Suggestion
- keep the parent row simple in the first pass
- parent rows should only support expand/collapse
- keep `Lock/Unlock` and merge behavior on the committed child entries instead of inventing parent-level actions in the same phase

Decision:
- keep the parent row simple in the first pass
- parent rows should only support expand/collapse
- keep `Lock/Unlock` and merge behavior on the committed child entries instead of inventing parent-level actions in the same phase

##### [x] q4.3-7 - How should grouped session labels be numbered?

###### Suggestion
- use persistent per-target creation order like `Transform 1`, `Transform 2`, `Transform 3`
- do not renumber older sessions after merge or collapse
- let the label reflect the original shell-session order, not the current visible row order

Decision:
- use persistent per-target creation order like `Transform 1`, `Transform 2`, `Transform 3`
- do not renumber older sessions after merge or collapse
- let the label reflect the original shell-session order, not the current visible row order

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-4.3 - Grouped Session History.md`

#### Transform 4.4

- shipped cleanup:
  - extracted shared reference-transform breadcrumb, prompt, prefill, status-path, and handle-resolution helpers out of `ConsoleDock`
  - aligned `ConsoleDock` and `ReferenceTransformToolbar` around that shared transform presentation seam
  - finished the remaining reference transform shell polish around handle-driven prompt sync, escape/cancel behavior, relative-versus-absolute axis entry, and direct root scalar commit for `Rotate` / `Scale`

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-4.4 - Console And Toolbar Adapter Cleanup.md`




### [x] Transform 5 - Viewport History Visual Baseline

- land the first committed viewport history visuals before any scrub behavior
- start with move-history path rendering that matches the shipped `SketchPlane` committed history line behavior
- keep traversal / scrub behavior out of scope for this first visual pass

#### [x] q1 - How should committed move history render in the viewport?

##### Suggestion
- copy the shipped `SketchPlane` committed history line behavior
- draw a connected path from the original origin through each successive committed moved origin point
- render it as the same thin committed polyline the shipped `SketchPlane` history uses, with visible checkpoint turns where the committed path changes direction
- keep the visual aligned with the same committed history list shown in the toolbar
- keep the live in-progress transform guide separate from the committed path

Decision:
- copy the shipped `SketchPlane` committed history line behavior for the first move-history viewport pass
- draw a connected path from the original origin through each successive committed moved origin point
- render it as the same thin committed polyline the shipped `SketchPlane` history uses, with visible checkpoint turns where the committed path changes direction
- keep the visual aligned with the same committed history list shown in the toolbar
- keep the live in-progress transform guide separate from the committed path

#### [x] q2 - How should committed scale and rotate history render in the viewport?

##### Suggestion
- scale:
  - compare the relative size of a before-versus-after sphere
  - keep the first pass readable as a size comparison instead of a busy generic overlay stack
- rotate:
  - show the normal direction before and after the committed rotate
  - render an arc between those two normals to show the angle change without requiring a numeric label

Decision:
- scale history should compare the relative size of a before-versus-after sphere in the first viewport pass
- rotate history should show the normal direction before and after the committed rotate
- rotate history should render an arc between those two normals to show the angle change without requiring a numeric label

#### [ ] q3 - What clutter rules should govern viewport history visuals?

##### Suggestion
- selected or active history rows should render strongest
- older history visuals should stay visible but faded
- merged-away rows should disappear from both the toolbar and viewport visuals

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-5 - Viewport History Visual Baseline.md`

### [x] Transform 6 - History Scrub / Traversal

- add the actual scrub layer over committed transform history after the first viewport visuals exist
- let the scrub head define the active rendered committed-history position without inventing a second unsynced history model
- define how new commits behave when they start from an earlier scrub point

#### [x] q1 - What does traversal mean in this transform family?

##### Suggestion
- traversal is the actual scrub layer
- it should mean stepping through committed transform history and letting the scrubbed committed position become the active rendered transform state from that same committed model
- do not mix this into the first viewport-visual baseline phase

Decision:
- traversal is the actual scrub layer in this transform family
- it should mean stepping through committed transform history and letting the scrubbed committed position become the active rendered transform state from that same committed model
- do not mix this into the first viewport-visual baseline phase

#### [x] q2 - What history granularity should traversal target first?

##### Suggestion
- start entry-first
- let traversal step through committed child entries before inventing session-level playback behavior
- keep grouped session rows as presentation over the same child-entry truth

Decision:
- start traversal at committed child-entry granularity
- let traversal step through committed child entries before inventing session-level playback behavior
- keep grouped session rows as presentation over the same child-entry truth

#### [x] q3 - How should scrub state behave?

##### Suggestion
- the scrub head should directly define the active rendered committed-history position
- returning the scrub head to the tail should return to the newest committed state
- do not invent a separate preview mode or restore action in the first pass

Decision:
- the scrub head should directly define the active rendered committed-history position
- returning the scrub head to the tail should return to the newest committed state
- do not invent a separate preview mode or restore action in the first pass
- scrub alone should never append a new history row

#### [x] q4 - How should traversal enter first?

##### Suggestion
- make the first traversal control a history paraslider
- let the user drag that paraslider from committed entry `0` through the last committed entry
- let the scrub head drive which landed committed state is active
- keep grouped parent rows as expand/collapse presentation only, not as the first traversal unit

Decision:
- make the first traversal control a history paraslider
- let the user drag that paraslider from committed entry `0` through the last committed entry
- let the scrub head drive which landed committed state is active
- when traversal is inactive, keep the paraslider pinned at `100%` on the newest committed entry
- after each new history commit, auto-advance that idle paraslider to the newest committed entry
- keep grouped parent rows as expand/collapse presentation only, not as the first traversal unit

#### [x] q5 - Do we need an explicit restore action in the first pass?

##### Suggestion
- no
- let the scrub head itself own the active rendered history position
- returning the scrub head to the tail is enough to return to the newest committed state
- keep first-pass commit behavior focused on append-at-tail and insert-after-scrub-point, not a separate restore command

Decision:
- no
- let the scrub head itself own the active rendered history position
- returning the scrub head to the tail is enough to return to the newest committed state
- keep first-pass commit behavior focused on append-at-tail and insert-after-scrub-point, not a separate restore command

#### [x] q6 - How should traversal emphasis coordinate across toolbar and viewport?

##### Suggestion
- when the scrub head is on an earlier entry, later committed entries should deactivate
- future committed history lines beyond the scrub head should stop rendering in the viewport
- the currently scrubbed committed row should render strongest in both toolbar and viewport
- if traversal is inactive or the scrub head is at the last committed entry, fall back to the normal full committed-history read

Decision:
- when the scrub head is on an earlier entry, later committed entries should deactivate
- future committed history lines beyond the scrub head should stop rendering in the viewport
- the currently scrubbed committed row should render strongest in both toolbar and viewport
- if traversal is inactive or the scrub head is at the last committed entry, fall back to the normal full committed-history read

#### [x] q7 - What should happen to the live transform shell while traversal scrub is active?

##### Suggestion
- traversal scrub should suspend live entry editing while it is active
- clear any active gizmo handle and keep the shell at the shared `Transform` root while scrub is driving the rendered state
- returning the scrub head to the tail should return to the real current committed state
- do not let traversal scrub silently append history or remain mixed with an in-progress drag entry

Decision:
- traversal scrub should suspend any already-active live entry while it is active
- clear any active gizmo handle and keep the shell at the shared `Transform` root while scrub is driving the rendered state
- if the user starts and commits a new transform step while scrubbed to an earlier committed entry, insert that new committed row immediately after the scrubbed entry rather than only appending at the old tail
- keep the old future committed rows after that insertion point, replay them from the new inserted row onward, and renumber the child-entry labels to the new visible order
- returning the scrub head to the tail without a new commit should return to the real current live draft / committed state

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-6 - History Scrub And Traversal.md`

### [x] Transform 7 - Console Local / World Space

- shipped the shared transform-shell `Local / World` mode for reference transform
- kept `Local / World` as one shared shell-state seam across Console, toolbar, and viewer
- landed the canonical `Transform > Settings > Space > [Local, World]` path plus broad `L` / `W` shortcuts

#### Shipped cleanup

- `Transform` now defaults the active shell to `Local`
- the honest Console path is `Transform > Settings > Space > Choose next [Local, World]`
- `L` and `W` can be called from almost anywhere in the transform shell instead of being limited to the root
- same-value requests reprint that the setting is already applied instead of mutating shell state
- deep prompts like `Move X` can switch space and collapse back to the owning mode root
- the reference-transform `Local / World` button, Console commands, and viewer gizmo mode all read and write the same shared `activeReferenceTransformSession.space` state

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-7 - Console Local World Space.md`

### [x] Transform 8 - Shared Transform Snap Controls

- shipped the first shared reference-transform snap pass for move, rotate, and scale
- kept snap ownership shared across Console, toolbar, and viewer instead of growing a Console-only snap path
- replaced the old rotate-only owner seam with one per-reference shared snap record
- kept the honest owner path under `Transform > Settings > Snap`
- limited v1 to one snap value per mode because the current gizmo still consumes one scalar per transform kind

#### [x] q1 - Which transform channels should gain explicit snap controls in this phase?

##### Suggestion
- cover move, rotate, and scale in the same family pass
- do not leave transform snap half-owned by rotate-only controls forever
- let each transform kind carry its own snap enabled-state and interval or step value

Decision:
- cover move, rotate, and scale in the same family pass
- do not leave transform snap half-owned by rotate-only controls forever
- let each transform kind carry its own snap enabled-state and interval or step value

#### [x] q2 - Where should transform snap state live?

##### Suggestion
- keep transform snap state in the shared transform-shell or target-owned transform state
- make Console, toolbar, and viewer all read and write the same snap truth
- do not hide snap settings inside one surface adapter

Decision:
- keep transform snap state in the shared transform shell
- make Console, toolbar, and viewer all read and write the same snap truth
- do not hide snap settings inside one surface adapter

#### [x] q3 - How should Console expose transform snap?

##### Suggestion
- add a `Snap` branch under `Transform > Settings`
- let `Snap` own first-pass move / rotate / scale snap controls
- keep direct mode-local `Snap` entry points allowed only as adapters into that shared branch

Decision:
- the honest owner path is `Transform > Settings > Snap > Choose next [Move, Rotate, Scale]`
- inside each transform kind, a direct numeric entry at the mode level applies one shared snap value to all three axes for that kind
- canonical examples:
  - `Transform > Settings > Snap > Move > 10`
  - `Transform > Settings > Snap > Rotate > 15`
  - `Transform > Settings > Snap > Scale > 0.25`
- mode-local `Snap` entry points are only adapters into that same shared settings tree:
  - `Transform > Move > Snap` resolves into `Transform > Settings > Snap > Move`
  - `Transform > Rotate > Snap` resolves into `Transform > Settings > Snap > Rotate`
  - `Transform > Scale > Snap` resolves into `Transform > Settings > Snap > Scale`
- each mode root exposes explicit `On` / `Off` plus direct numeric value submit

#### [x] q4 - How should whole-mode snap and axis-specific snap relate?

##### Suggestion
- let the mode root hold one whole-mode snap value that applies to `X/Y/Z`
- let deeper axis children override only the selected axis when needed
- keep the path honest so mode-level numeric entry means "all axes for this transform kind", while deeper axis entry means "only this axis"

Decision:
- `Transform > Settings > Snap > Move > 10` applies that move snap value to all three move axes
- `Transform > Settings > Snap > Rotate > 15` applies that rotate snap value to all three rotate axes
- `Transform > Settings > Snap > Scale > 0.25` applies that scale snap value to all three scale axes
- axis-specific snap paths are deferred from this first pass because the current gizmo only supports one scalar per transform kind
- whole-mode values are the only shipped v1 snap granularity

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Future/Transform_Phase Transform-8 - Shared Transform Snap Controls.md`

### [x] Transform 9 - Toolbar X Exit Sync To Console

- shipped the shared transform-shell exit seam for toolbar `X` and Console `CommitTransform`
- removed the old toolbar-local close policy so toolbar and Console now exit through the same owner path
- kept the post-exit Console scope and shell cleanup aligned across both surfaces

#### [x] q1 - What should the transform-toolbar `X` mean?

##### Suggestion
- make the toolbar `X` mean the same thing as `CommitTransform` at the transform-shell level
- do not let toolbar close become a second hidden cancel policy
- keep `Esc` and entry-cancel behavior separate from shell exit

Decision:
- make the toolbar `X` mean the same thing as `CommitTransform` at the transform-shell level
- do not let toolbar close become a second hidden cancel policy
- keep `Esc` and entry-cancel behavior separate from shell exit

#### [x] q2 - Which seam should own toolbar `X` exit behavior?

##### Suggestion
- route toolbar `X` and Console `CommitTransform` through the same shared transform-shell exit action
- keep toolbar and Console as adapters into that owner seam
- avoid duplicate cleanup logic between the two surfaces

Decision:
- route toolbar `X` and Console `CommitTransform` through the same shared transform-shell exit action
- keep toolbar and Console as adapters into that owner seam
- avoid duplicate cleanup logic between the two surfaces

#### [x] q3 - What state should sync when the toolbar `X` exits the shell?

##### Suggestion
- hide the toolbar
- clear active handle and other shell-local transform UI state
- return Console to the same post-transform scope it would reach after `CommitTransform`
- preserve already-committed history and other shipped transform semantics

Decision:
- hide the toolbar
- clear active handle and other shell-local transform UI state
- return Console to the same post-transform scope it would reach after `CommitTransform`
- preserve already-committed history and other shipped transform semantics

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-9 - Toolbar X Exit Sync To Console.md`

### [x] Transform 10 - Ratio Locked Per Axis Snap

- shipped the full shared per-axis snap pass for reference transform
- replaced the first scalar-only snap model with shared `enabled + xyzLocked + x/y/z` snap ownership for move, rotate, and scale
- kept toolbar and Console as equal adapters over the same shared per-reference snap truth
- widened the viewer / gizmo seam in the same phase so unlocked per-axis snap values are real runtime behavior, not stored-only metadata

#### [x] q1 - Should move, rotate, and scale snap gain a shared `XYZ` lock state?

##### Suggestion
- yes
- each snap mode should carry a `locked/unlocked` state in shared transform snap ownership
- default that lock to `on`
- keep the toolbar `Lock` button and Console `snapXYZ:Lock` / `snapXYZ:Unlock` path as adapters into that same shared state

Decision:
- yes
- each of `Move`, `Rotate`, and `Scale` snap should gain a shared `XYZ` lock state
- default the snap `XYZ` lock to `on`
- toolbar and Console should only surface the opposite lock action that can currently be chosen
- snap state should now be stored per mode as `enabled + xyzLocked + x/y/z`

#### [x] q2 - How should the toolbar snap section render while locked versus unlocked?

##### Suggestion
- while locked, keep the current single snap slider because one value owns all three axes
- when unlocked, replace that single row with a `Vec3` snap editor for the mode
- allow the `Vec3` editor to expand into three normal float parasliders, one row per axis, for finer editing

Decision:
- while locked, each snap mode should continue to show one shared snap slider
- when unlocked, that snap row should become a `Vec3` snap editor for the mode
- the unlocked `Vec3` editor should be expandable into three normal float parasliders, one per axis row
- `Q` should stay a local toolbar-only quick-preset toggle and remain default `off`

#### [x] q3 - How should Console expose locked versus unlocked snap ownership?

##### Suggestion
- keep the honest owner path under `Transform > Settings > Snap > Move/Rotate/Scale`
- at the mode root, add `snapXYZ:Lock` / `snapXYZ:Unlock` and surface only the opposite action from the current state
- once the mode exists, expose `Move X`, `Move Y`, `Move Z` style snap children from that same mode root

Decision:
- keep the honest owner path under `Transform > Settings > Snap > Choose next [Move, Rotate, Scale]`
- at `Transform > Settings > Snap > Move`, `Rotate`, and `Scale`, add `snapXYZ:Lock` or `snapXYZ:Unlock` and only show the opposite state-changing action
- mode roots should also expose axis-owned snap children:
  - `Move X`
  - `Move Y`
  - `Move Z`
  - and the same pattern for `Rotate` and `Scale`
- mode-local adapters like `Transform > Move > Snap` should still route into that same shared owner path

#### [x] q4 - How should whole-mode numeric submit relate to axis-owned snap children?

##### Suggestion
- preserve whole-mode numeric submit at the mode root
- mode-level numeric entry should still mean "apply this value to all three axes"
- axis children should own the per-axis values once the mode is unlocked

Decision:
- preserve whole-mode numeric submit at the mode root
- `Transform > Settings > Snap > Move > 10` should still apply that value to all move axes
- deeper axis children should own per-axis snap values once the mode is unlocked
- whole-mode numeric submit should keep blasting all three axes equally even while the mode is unlocked

#### [x] q5 - What should re-locking mean once the user has divergent axis values?

##### Suggestion
- do not collapse or average the unlocked vector back to one scalar
- preserve the current vector exactly when the user re-locks
- let locked mode become linked proportional editing over the preserved `X/Y/Z` ratios

Decision:
- re-locking preserves the current `X/Y/Z` vector exactly
- locked mode means linked proportional editing, not forced axis equality
- editing one locked axis rescales the other two by ratio
- axes already at `0` stay pinned at `0` during linked scaling

#### Shipped cleanup

- snap now persists per reference as shared per-axis state for move, rotate, and scale
- legacy scalar snap state is normalized into locked `x=y=z=value`
- while locked, the root toolbar slider and mode-root Console numeric submit use `X` as the driver value
- while unlocked, toolbar can expand `Vec3` into three per-axis float rows
- `Transform > Settings > Snap > Move > X > 10` style paths now edit real axis-owned values
- viewer and gizmo execution now consume the same per-axis snap state the toolbar and Console author
- rotate-snap timeline compatibility stays tied to the `X` driver value and falls back to `basic` when rotate snap is unlocked

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-10 - Ratio Locked Per Axis Snap.md`

### [x] Transform 11 - Console Snap Parity Cleanup

- tightened Console snap wording and action shape so the shipped `Transform 10` snap model now reads honestly in Console too
- kept the phase narrow to Console adapter cleanup instead of widening snap state or viewer behavior again
- aligned prompt text, status text, and radio identities with the newer toolbar-facing `On / Off` toggle plus `Locked / Unlocked` wording

#### [x] q1 - Should Console snap mode roots keep showing both `On` and `Off`?

##### Suggestion
- no
- show only the currently available enabled-state action at each mode root
- keep Console choices action-oriented rather than showing two permanent toggles

Decision:
- no
- if a snap mode is disabled, its mode root should show only `snap:On`
- if a snap mode is enabled, its mode root should show only `snap:Off`
- Console should stop showing both enable-state choices at once

#### [x] q2 - How should Console describe snap lock state after the shipped toolbar cleanup?

##### Suggestion
- keep the mode-root lock choice action-oriented
- continue to show only the currently available lock-state action
- use `Locked / Unlocked` wording in Console status text and confirmations so Console matches the shipped toolbar state language

Decision:
- keep only the currently available lock-state action visible:
  - `snapXYZ:Unlock` while locked
  - `snapXYZ:Lock` while unlocked
- Console status and confirmation text should use `Locked / Unlocked` wording
- this phase does not need a second snap-lock owner path or state rewrite

#### [x] q3 - What should mode-root and axis-root snap behavior stay tied to?

##### Suggestion
- keep the shipped `Transform 10` model exactly
- mode-root numeric submit still writes all three axes equally
- unlocked mode roots still expose `X / Y / Z` snap children
- do not widen behavior again in this cleanup pass

Decision:
- keep the shipped `Transform 10` snap behavior exactly
- mode-root numeric submit still writes all three axes equally
- unlocked mode roots still expose `Move X / Y / Z`, `Rotate X / Y / Z`, and `Scale X / Y / Z`
- axis-root numeric submit keeps the shipped locked-versus-unlocked behavior

#### [x] q4 - Should mode-local `Snap` entries become separate owners in this cleanup?

##### Suggestion
- no
- keep `Transform > Move > Snap`, `Rotate > Snap`, and `Scale > Snap` as adapters only
- the honest owner path should stay under `Transform > Settings > Snap`

Decision:
- no
- keep mode-local `Snap` entries as adapters only
- the honest owner path stays:
  - `Transform > Settings > Snap > Choose next [Move, Rotate, Scale]`

#### Shipped cleanup

- snap mode roots now show one enabled-state action at a time:
  - `snap:On` while disabled
  - `snap:Off` while enabled
- Console status text now uses the same `Locked / Unlocked` language the toolbar uses
- mode-local `Transform > Move/Rotate/Scale > Snap` entries remain adapters into `Transform > Settings > Snap`
- the shipped `Transform 10` snap model stayed unchanged; this phase only cleaned the Console adapter layer

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-11 - Console Snap Parity Cleanup.md`

### [ ] Transform 12 - Transform Shell Polish And Canonical Adapter Cleanup

- clean up root transform shortcuts so they read like explicit adapters instead of historically accumulated affordances
- tighten canonical breadcrumb and transcript wording so adapter jumps always narrate the honest owner path
- do one small transform-toolbar density pass without widening transform ownership or runtime behavior again

#### [x] q1 - Should root transform shortcuts stay as direct adapters into the shared settings owner paths?

##### Suggestion
- yes
- keep `SE` and `SN` as direct root adapters
- add `SP` as a direct root adapter into `Transform > Settings > Space`
- do not let any of those shortcuts become second ownership seams

Decision:
- yes
- keep `SE` and `SN` as direct root adapters
- add `SP` as a direct root adapter into `Transform > Settings > Space`
- all of those shortcuts remain adapters into the same shared settings owner paths

#### [x] q2 - How should adapter jumps print in Console summaries and transcript output?

##### Suggestion
- always print the canonical owner path
- shortcuts should feel fast, but the breadcrumb should stay honest
- `Transform > SN` should narrate `Transform > Settings > Snap`
- `Transform > SP` should narrate `Transform > Settings > Space`

Decision:
- always print the canonical owner path in Console summaries and transcript output
- `Transform > SN` should narrate through `Transform > Settings > Snap`
- `Transform > SP` should narrate through `Transform > Settings > Space`
- existing `L / W` space shortcuts should keep narrating through `Settings > Space`

#### [x] q3 - What should stay aligned between toolbar and Console in this cleanup?

##### Suggestion
- keep wording aligned, not identical command labels
- toolbar should keep `On / Off` and `Locked / Unlocked`
- Console should keep `snap:On / snap:Off` and `snapXYZ:Lock / snapXYZ:Unlock`
- resulting state text should still read `On / Off` and `Locked / Unlocked`

Decision:
- keep wording aligned, not identical raw command labels
- toolbar keeps `On / Off` and `Locked / Unlocked`
- Console keeps `snap:On / snap:Off` and `snapXYZ:Lock / snapXYZ:Unlock`
- state text and confirmations should keep reading `On / Off` and `Locked / Unlocked`

#### [x] q4 - How far should the toolbar cleanup go in this phase?

##### Suggestion
- keep it cosmetic
- tighten shared button chrome, spacing, and section density where the current toolbar still feels too bubbly
- do not add new transform-only behavior in this phase

Decision:
- keep the toolbar cleanup cosmetic
- tighten shared button chrome, spacing, and section density where the transform toolbar still feels too bubbly
- do not add new transform-only behavior or widen transform state ownership in this phase

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Future/Transform_Phase Transform-12 - Transform Shell Polish And Canonical Adapter Cleanup.md`

### [x] Transform 13 - Viewport Snap Availability Visuals

- add the first viewport snap-availability visual while the user is actively dragging with move snap enabled
- keep `Transform 13` move-only so the first pass stays honest to the current gizmo drag context
- defer rotate visuals to later `Transform 13.1`
- leave scale out of scope for the first visual pass

#### [x] q1 - What should enabled move snap render in the viewport while the user is dragging?

##### Suggestion
- render nearby snap points as tiny dots or spheres around the active move path
- let the spacing of those points follow the committed move snap value
- show the points that matter to the current handle scope, such as `XY` plane movement versus single-axis movement
- keep those points white in the real product surface
- keep the field local to the active gizmo neighborhood instead of filling the whole viewport
- split the move visual by active move-handle context:
  - single-axis move
  - two-axis plane move
  - center / three-axis move

Decision:
- when move snap is enabled and the user is actively dragging a move handle, the viewport should render nearby snap options as tiny dots or spheres
- the spacing of those move snap dots should follow the current committed move snap value
- the visual should represent the nearby snap positions the user can drag the gizmo toward from the current handle context
- those move snap dots should render white in the real product surface
- the first pass should render only a local neighborhood of nearby snap points around the active gizmo context, not a full-scene scatter of points
- the move visual should split into three handle-context variants:
  - single-axis move
  - two-axis plane move
  - center / three-axis move

#### [x] q2 - Should move snap availability visuals split by active move-handle context?

##### Suggestion
- yes
- single-axis move, plane move, and center move expose different reachable snap destinations
- give each move-handle family its own local dot-field shape instead of forcing one generic overlay onto all move drags

Decision:
- yes
- move snap availability visuals should split by active move-handle context
- single-axis move should render a local 1D line of snap dots
- two-axis plane move should render a local 2D field of snap dots on that plane
- center / three-axis move should render a local 3D field of snap dots around the gizmo neighborhood

#### [x] q3 - Should rotate snap land in this same first phase?

##### Suggestion
- no
- keep `Transform 13` move-only
- split rotate into later `Transform 13.1` so the first pass can stay tightly scoped to move drag visuals

Decision:
- no
- rotate snap visuals do not land in `Transform 13`
- rotate moves to later `Transform 13.1`
- first-pass viewport snap visuals should cover move only

#### [x] q4 - Should scale snap get a viewport visual in this first pass?

##### Suggestion
- no
- keep scale out of the first viewport snap-visual pass
- land move first before deciding whether scale has an honest enough visual language

Decision:
- no
- scale gets no viewport snap visual in the first pass
- first-pass viewport snap visuals should cover move only

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-13 - Move Snap Availability Visuals.md`

### [ ] Transform 13.1 - Rotate Snap Preview Lines

- add the first rotate snap preview visual while the user is actively dragging a snapped rotate gizmo handle
- keep this first rotate pass scoped to axis rotate handles:
  - `Rotate X`
  - `Rotate Y`
  - `Rotate Z`
- keep the visual viewer-owned and keyed to stable angular snap positions around the rotate origin
- leave free-rotate and scale out of scope

#### [x] q1 - Should the first rotate preview pass stay axis-only instead of widening into free-rotate?

##### Suggestion
- yes
- keep the first rotate preview pass on `Rotate X / Y / Z`
- leave free-rotate out until the axis-based angular field is proven

Decision:
- yes
- the first rotate preview pass stays axis-only
- it covers `Rotate X`, `Rotate Y`, and `Rotate Z`
- free-rotate remains out of scope in this phase

#### [x] q2 - What should rotate snap render while the user is actively dragging a snapped rotate axis?

##### Suggestion
- render a circular neighborhood of short white radial preview lines around the rotate origin
- space those lines by the current committed rotate snap value
- show one landed/current line as the rotate equivalent of the move current dot
- keep the preview local to the active angular neighborhood instead of making the full circle equally loud

Decision:
- while a snapped rotate axis drag is active, the viewer should render a circular neighborhood of short white radial preview lines around the rotate origin
- the spacing of those lines should follow the committed rotate snap value
- one landed/current line should act as the rotate equivalent of the move current dot
- the preview should stay local to the active angular neighborhood instead of making the full circle equally loud

#### [x] q3 - How should the rotate preview field stay honest while the gizmo moves from snapped angle to snapped angle?

##### Suggestion
- build the field from stable angular snap identity, not from a gizmo-attached effect
- keep the preview segments fixed in angular space
- transfer the landed/current highlight on arrival at the next snapped angle
- do not pre-grow the destination line too early

Decision:
- build the rotate preview from stable angular snap identity instead of a gizmo-attached effect
- keep the preview segments fixed in angular space
- transfer the landed/current highlight on arrival at the next snapped angle
- do not pre-grow the destination line too early

#### [x] q4 - What reference direction should each rotate axis use for its preview ring?

##### Suggestion
- use one stable perpendicular reference ray per axis:
  - `Rotate X`
    - `+Y`
  - `Rotate Y`
    - `+X`
  - `Rotate Z`
    - `+X`

Decision:
- use one stable perpendicular reference ray per axis:
  - `Rotate X`
    - `+Y`
  - `Rotate Y`
    - `+X`
  - `Rotate Z`
    - `+X`

#### [x] q5 - What visible neighborhood should the first rotate preview pass render around the landed snapped angle?

##### Suggestion
- keep one bounded angular neighborhood:
  - current landed line
  - `4` snap lines on each side
- keep one hidden buffered line beyond each visible edge so new lines can ghost in before the window runs out

Decision:
- render one bounded angular neighborhood:
  - current landed line
  - `4` snap lines on each side
- keep one hidden buffered line beyond each visible edge so new lines can ghost in before the visible window runs out

#### [x] q6 - Should `Transform 13.1` add a dedicated rotate preview section in the transform reference `i` menu?

##### Suggestion
- yes
- add one viewer-only `Rotate Snap Preview` section in the transform reference `i` menu
- keep rotate tuning separate from `Move Snap Dots`
- let the first rotate pass own:
  - `On / Off`
  - `Line Size`
  - `Line Thickness`
  - `Preview Radius`
  - `Preview Delay`
- keep those controls presentation-only
- do not let them change rotate snap values or rotate math

Decision:
- yes
- `Transform 13.1` should add one dedicated `Rotate Snap Preview` section in the transform reference `i` menu
- that section should stay viewer-only and separate from `Move Snap Dots`
- the first rotate pass should own:
  - `On / Off`
  - `Line Size`
  - `Line Thickness`
  - `Preview Radius`
  - `Preview Delay`
- these controls affect rotate preview presentation only
- they must not change rotate snap values or rotate math

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Future/Transform_Phase Transform-13.1 - Rotate Snap Preview Lines.md`

### [x] Transform 13.2 - Persistent Move Snap Visual System Rebuild

- rebuild the shipped move snap visual as one clean viewer-owned system so the dots read as absolute snap points in space instead of a small block that appears to travel with the gizmo
- keep this follow-on move-only and leave rotate on later `Transform 13.1`
- preserve the shipped move snap math and shared snap state while rebuilding the viewer-owned visual ownership model underneath it

#### [x] q1 - Should the move snap dots represent persistent world snap points instead of a recentered local patch that visually shifts with the gizmo?

##### Suggestion
- yes
- the move snap dots should read as persistent absolute snap points in world space
- the gizmo should move from dot to dot
- do not let the visible field feel like a small dot block that gets rebuilt around the latest snapped target

Decision:
- yes
- move snap dots should represent persistent absolute snap points in world space
- the gizmo should move from dot to dot across that stable lattice
- the visible move field should stop reading like a small recentered dot block attached to the gizmo
- the stable lattice should become the real viewer-owned source of truth for the move snap overlay

#### [x] q2 - How should the viewer keep the snap field continuous while the user drags across axis and plane snap steps?

##### Suggestion
- build the move visual from a larger world-keyed buffered lattice instead of only the immediately visible neighborhood
- keep each dot keyed by absolute snap position, not by relative offset from the current snapped target
- axis drag should use a longer persistent 1D corridor with hidden headroom on both ends
- plane drag should use a larger persistent 2D patch with a hidden outer band beyond the visible dots
- center drag should follow the same absolute-position identity rule while keeping its lattice bounded

Decision:
- build the move snap field from a larger world-keyed buffered lattice instead of only the immediately visible neighborhood
- keep each dot keyed by absolute snap position, not by relative offset from the current snapped target
- axis drag should use a longer persistent 1D corridor with hidden headroom on both ends
- plane drag should use a larger persistent 2D patch with a hidden outer band beyond the visible dots
- center drag should follow the same absolute-position identity rule while keeping its lattice bounded

#### [x] q3 - What should animate when the snapped move target changes during an active drag?

##### Suggestion
- animate only dot emphasis
- dot positions should stay fixed on their absolute snap points
- size should do most of the work
- opacity can support the weighting, but should not make the dots read like light sources
- the landed dot should grow as the gizmo reaches it, and surrounding dots should rebalance around the new snapped target while the mouse button is still down

Decision:
- animate only dot emphasis when the snapped move target changes during an active drag
- dot positions stay fixed on their absolute snap points
- size should do most of the work
- opacity may support the weighting, but should stay secondary so the dots still read as solid points rather than light sources
- the landed dot should grow as the gizmo reaches it, and surrounding dots should rebalance around the new snapped target while the mouse button is still down

#### [x] q5 - Should the user get an `i`-menu control to expand how far the move snap dot neighborhood is rendered?

##### Suggestion
- yes
- add a viewer-only `i`-menu control that expands or contracts the visible move snap dot radius
- keep that control presentation-only
- do not let it change the underlying snap spacing, snap values, or snap math

Decision:
- yes
- add a viewer-only `i`-menu control that expands or contracts the visible move snap dot radius/neighborhood
- this control should only widen or tighten how much of the buffered absolute lattice is shown
- it must not change the underlying snap spacing, snap values, or snap math

#### [x] q4 - Should this correction phase widen into rotate or scale snap visuals?

##### Suggestion
- no
- keep this follow-on strictly move-only
- leave rotate on `Transform 13.1`
- leave scale out of scope

Decision:
- no
- this correction phase stays move-only
- rotate remains a separate later `Transform 13.1` follow-on
- scale stays out of scope

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Shipped/Transform_Phase Transform-13.2 - Persistent Move Snap Lattice Cleanup.md`

### [ ] Transform 14 - Viewer Transform Rename And Shared Surface Alignment

- rename the current transform toolbar/shell surface from the narrower reference wording to `Viewer Transform`
- keep this phase narrow to wording and shared-surface alignment
- do not widen target behavior yet

#### [x] q1 - Should this follow-on rename the active transform surface to `Viewer Transform` instead of leaving the reference-first wording in place?

##### Suggestion
- yes
- the current surface is no longer only about one reference-specific toolbar
- rename it to `Viewer Transform` so the name matches the real cross-target viewer ownership direction

Decision:
- yes
- this follow-on should rename the active transform surface to `Viewer Transform`
- the old reference-first wording should stop reading like the feature is reference-only forever

#### [x] q2 - Should `Transform 14` stay a rename/alignment pass instead of widening into generated-object behavior immediately?

##### Suggestion
- yes
- keep `Transform 14` narrow so the naming cleanup can land quickly
- move generated-object viewer motion into a separate follow-on
- do not make the simple shared-surface rename wait on the harder target-widening work

Decision:
- yes
- `Transform 14` should stay a rename/alignment pass
- generated-object viewer motion should move into later `Transform 15`
- this phase should not widen target behavior yet

#### [x] q3 - What should `Transform 14` own after the rename?

##### Suggestion
- own shared wording and shell alignment only
- rename the toolbar/header and related shell wording to `Viewer Transform`
- keep references using the same underlying transform behavior
- leave generated-object viewer motion to a separate follow-on

Decision:
- `Transform 14` should own shared wording and shell alignment only
- it should rename the toolbar/header and related shell wording to `Viewer Transform`
- reference behavior stays otherwise unchanged in this phase
- generated-object viewer motion moves to later `Transform 15`

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Future/Transform_Phase Transform-14 - Viewer Transform Rename And Shared Surface Alignment.md`

### [ ] Transform 15 - Generated Object Viewer Motion Under Viewer Transform

- widen the renamed `Viewer Transform` shell so generated objects can use move / rotate / scale in the viewport
- keep this first generated-object transform pass explicitly viewer-only
- do not claim that generated-object transform writes back into Replicad geometry or graph truth yet

#### [x] q1 - Should generated objects be allowed to use the same `Viewer Transform` shell even if those edits are not yet durable Replicad truth?

##### Suggestion
- yes
- let generated objects use the same viewer-owned transform shell for viewport manipulation
- keep the first pass honest that this is viewer motion only, not Replicad graph ownership
- do not block the feature just because durable generated-object transform truth is a later problem

Decision:
- yes
- generated objects should be allowed to use the same `Viewer Transform` shell
- the first pass remains viewer-only for generated objects
- these edits must not claim to be durable Replicad truth yet

#### [x] q2 - What should generated-object transform own in the first pass?

##### Suggestion
- own viewer motion only
- allow move / rotate / scale interaction in the viewport
- keep the transform local to the current viewer/session state
- do not write the result back into Replicad model generation or graph state

Decision:
- generated-object transform should own viewer motion only in the first pass
- it should allow move / rotate / scale interaction in the viewport
- it should stay local to viewer/session state
- it must not write back into Replicad model generation, graph state, or durable CAD truth

#### [x] q3 - Should this feature fork a separate generated-object transform UI, or should both references and generated objects adapt into the same renamed `Viewer Transform` shell?

##### Suggestion
- do not fork
- keep one shared `Viewer Transform` shell and toolbar surface
- let reference and generated-object targets adapt into the same viewer-owned interaction model
- keep target-specific truth/commit rules below that shared shell

Decision:
- do not fork a separate generated-object transform UI
- references and generated objects should adapt into the same renamed `Viewer Transform` shell
- target-specific truth and commit rules should stay below that shared shell

Standalone phase doc:
- `docs/Human-Plans/Architecture/Transform/Future/Transform_Phase Transform-15 - Generated Object Viewer Motion Under Viewer Transform.md`

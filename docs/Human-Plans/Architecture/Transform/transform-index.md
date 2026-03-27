# Transform

## Doc Header

### Doc History
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

The current Browser transform work remains the live source of the locked direction.

Current live umbrella source:
- `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-7.5 - Final Transform Direction And Phase Split.md`

Current live Browser follow-ons already feeding this family:
- `Transform 1`
  - reference-first history/session foundation
- `Transform 2`
  - canonical hierarchy plus non-reference target ownership
- `Transform 3`
  - shared target-local transform shell behavior
- `Transform 4`
  - console cleanup and transform-shell polish
- `Transform 5`
  - viewport history visuals, traversal/restore, and later cleanup

This new family folder exists so those directions can later migrate into transform-native phase docs without staying permanently nested under Browser.

### Next Steps

Expected next cleanup after creating this family:

1. move the umbrella transform direction from Browser-native planning into a first standalone Transform future phase
2. decide whether the old Browser `7.4` traversal direction should stay Browser-numbered or be folded into the Transform-native ladder beside `Transform 1`, `Transform 2`, `Transform 3`, `Transform 4`, and `Transform 5`
3. update the broader docs map if the Transform family becomes the canonical home instead of only a new container


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

### [ ] Transform 3 - Shared Transform Shell And Repeated Steps
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

#### [ ] q4 - Should entering `Transform` itself spawn the shared transform session and toolbar?

##### Suggestion
- yes
- entering `Transform` should create or activate the target-local shared transform session
- the toolbar should appear because that session exists, not because Console directly tells a toolbar to open
- Console and toolbar should both adapt into the same underlying session

### [ ] Transform 4 - Console Cleanup And Transform Shell Polish
#### Header
- clean up the remaining Console rough edges before the heavier history-visualization phase
- make the durable transform shell read clearly and consistently in breadcrumbs, prompts, and submit ownership
- keep this as the short bridge phase between `Transform 3` shell behavior and the later viewport-history work
- standalone spec:
  - `docs/Human-Plans/Architecture/Transform/Future/Transform_Phase Transform-4.2 - Reference Draft Sync And Session Cleanup.md`


##### [ ] q1 - What Console cleanup is required before the history-visualization phase starts?

##### Suggestion
- finish the transform-shell wording cleanup first
- remove any stale staged-menu language that still reads like generic `Choose next` text when the transform shell should read more directly
- keep breadcrumbs, prompt labels, and submit ownership honest to the durable `Transform` shell

##### [ ] q2 - Where should `CommitTransform` surface in the Console after the shell becomes durable?

##### Suggestion
- surface `CommitTransform` at the `Transform` root only
- do not keep it duplicated inside `Move`, `Rotate`, or `Scale`
- let per-entry submits commit the current transform entry, while `CommitTransform` exits the shell

##### [ ] q3 - What input/prompt cleanup should happen before traversal and viewport visuals are added?

##### Suggestion
- make assisted vec3, axis float, and plane vec2 entry behavior fully consistent across `Move`, `Rotate`, and `Scale`
- ensure clearing typed input cleanly restores the default assisted option where that behavior is intended
- lock Console submit, cancel, and shortcut behavior before layering traversal or viewport-history playback on top


#### Transform 4.1 cleanup

#### Transform 4.2

##### [ ] q4.2-1 - Should reference transform get one explicit active draft session object in store?

###### Suggestion
- yes
- replace the current spread-across-several-fields model with one honest active draft session for the active reference transform

##### [ ] q4.2-2 - During a live reference transform entry, should Console and toolbar read from the draft session directly?

###### Suggestion
- yes
- Console and toolbar should both read the same live draft object directly instead of reconstructing state from committed override fields

##### [ ] q4.2-3 - Should viewer gizmo changes write into the active draft continuously?

###### Suggestion
- yes
- mirror the sketch-plane pattern
- keep the viewer as execution owner while the store remains the draft/session owner

##### [ ] q4.2-4 - Should commit promote the draft into committed transform state and history, while cancel restores from entry origin?

###### Suggestion
- yes
- commit should promote the draft into committed transform state and append history when the value changed
- cancel should restore draft and applied state from the captured entry origin
- keep existing committed history intact during this cleanup
- defer grouped transform-session history like `Transform 1`, `Transform 2`, and later session rows to `Transform 4.3`

##### [ ] q4.2-5 - Should `Transform 4.2` stay reference-first, or widen to object, folder, and assembly in the same pass?

###### Suggestion
- keep it reference-first
- prove the shared draft/session cleanup on the existing reference path before widening it to other target kinds


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
- `docs/Human-Plans/Architecture/Transform/Future/Transform_Phase Transform-4.3 - Grouped Session History.md`

#### Transform 4.4

- 




### [ ] Transform 5 - Viewport History Visuals And Traversal

- land move, scale, and rotate viewport history visuals
- add traversal / preview / restore behavior
- finish with any later shared transform-session cleanup only after the target paths have stabilized

#### [ ] q1 - How should committed move history render in the viewport?

##### Suggestion
- draw a connected path from the original origin through each successive committed moved origin point
- keep the visual aligned with the same committed history list shown in the toolbar

#### [ ] q2 - How should committed scale and rotate history render in the viewport?

##### Suggestion
- scale:
  - compare original and committed scale with overlay shapes
  - use an ellipsoid-style overlay when scale is non-uniform
- rotate:
  - compare original and committed plane-normal directions
  - render an AutoCAD-style angle-dimension guide between them without requiring a numeric label

#### [ ] q3 - What clutter and traversal rules should govern viewport history visuals?

##### Suggestion
- selected or active history rows should render strongest
- older history visuals should stay visible but faded
- merged-away rows should disappear from both the toolbar and viewport visuals
- traversal / preview / restore should be layered onto the same committed history model rather than inventing a second unsynced path

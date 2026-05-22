# Build Path Index

## Doc Header

### Doc History
10. 2026-04-06 15:46: Added an explicit build-policy ownership rule to the `Build Path` family, locking the recommendation that build policy should govern authoritative/final build timing (`Live / On Release / Manual / Off`) while draft-preview display stays a separate `Model Viewport` result-mode concern instead of letting browser/build cadence and draft/final viewport behavior blur together
9. 2026-04-05 13:43: Cleaned up stale timeline-era wording after the workspace-viewport rewrite, replacing leftover `timeline` / `strip` language with command-row and build-workspace terminology, renaming the derived step descriptor layer to match the newer row/card model, and softening a few places that were overcommitted to one visual framing
8. 2026-04-05 13:33: Reframed `Build Path` around the new dedicated workspace-viewport direction, replacing the earlier Fusion-like slim-strip emphasis with a vertical row/card command surface that supports both compressed `List View` and expanded `Branch View`, shared scrub semantics across both views, visible branch merges, and inline toolbar expansion inside each command row
7. 2026-04-05 13:18: Renamed the `Pasta Path` family to `Build Path`, moved the family folder and index file to `Build-Path/Build-Path-Index.md`, and updated the surrounding docs so the roadmap, wishlist, edit-history relationship, and docs index all use the new name consistently
6. 2026-04-05 13:05: Expanded the umbrella plan so `Build Path` now has a clearer derived-reader contract, explicit step identity and playhead semantics, stronger inspect/sync rules, a real phase ladder, and a naming-direction section that keeps the current title as a working codename until a better product name is chosen
5. 2026-03-22 14:18: Added `#### Suggestion` blocks under every open `Build Path` question, so the new `Questions / Decisions` section now carries concrete recommended answers for placement, scope, mapping, branching, sync, and representation instead of acting only as a neutral question list
4. 2026-03-22 14:15: Added a dedicated `Questions / Decisions` section to the `Build Path` index, turning the main unresolved product and architecture choices into explicit `### [ ] qN - ...` checklist-style headings so the concept can be tightened incrementally instead of leaving those decisions scattered implicitly through the vision text
3. 2026-03-22 14:12: Added a `Fusion` visual-takeaways section to the `Build Path` index, locking the recommendation that the first timeline surface should borrow the low-profile footer-like density, horizontal step-strip readability, and clear playhead emphasis of a Fusion-style history bar without literally copying its strictly linear feature-stack assumptions
2. 2026-03-22 14:10: Added the first workspace-placement suggestion for `Build Path`, locking the direction that it should likely live as another `+/e/-` style surface mode with a slim full-width bottom footprint, using roughly `100px` of height by default and growing vertically only when parallel branch rows are actually needed
1. 2026-03-22 14:06: Created this folder-root architecture index for the new `Build Path` family, establishing the umbrella vision for a hybrid parametric history/timeline surface that bridges the `Spaghetti` node graph and a scrub-friendly linear stack while reserving `Future/` and `Shipped/` for later standalone execution and shipped records

### Purpose

This doc defines the umbrella architecture direction for `Build Path`.

This file is the umbrella index for the `Build-Path` family.

Use it to answer:
- what the `Build Path` concept is trying to accomplish
- how it relates to the existing `Spaghetti Editor`
- what the main user-facing scrub and build-view mechanics are
- what technical seams are implied by scrubbing and partial evaluation
- how future standalone planning docs under this family should be organized

### Family Structure

Use this folder like this:

- `Build-Path-Index.md`
  - umbrella architecture direction
  - concept explanation
  - initial implementation goals
- `Future/`
  - later standalone `Build Path` phase or execution docs
- `Shipped/`
  - later shipped records for completed `Build Path` cuts

### Concept

`Build Path` is a hybrid parametric UI that bridges the gap between:
- the non-linear `Spaghetti` node graph
- a readable command-oriented build workspace

The goal is to let the user collapse complex graph logic into a structured vertical build surface that can be scrubbed, inspected, and edited at the command level without losing the deeper graph underneath.

### Why This Doc Exists

The current `Spaghetti Editor` is good for explicit graph logic, but it is weaker at:
- showing build order as one readable temporal story
- letting the user scrub backward through model generation
- surfacing parallel construction branches in a way that still feels sequential and understandable

`Build Path` exists to explore a second authoring/read surface:
- the graph remains the source of truth
- the build workspace becomes a condensed command/history view

## Doc Body

### Vision

A scrub-friendly build workspace for ParaHook that collapses complex node logic into a readable vertical command path.

It should answer a very practical user question:

- "show me how this model got here without making me read the entire graph"

### Core Mechanics

- `The Scrub`
  - a shared playhead that allows the user to move backward and forward through the model's construction from either `List View` or `Branch View`
- `Command Rows`
  - each CAD command reads as a box-like row or card such as `Sketch`, `Extrude`, `Fillet`, `Sketch 2`, or `Extrude 2`
- `Parallel Branches`
  - branch-heavy work can expand into explicit vertical branch lanes with visible split and merge structure
- `History Rollback`
  - moving the playhead backward suppresses downstream nodes and shows an earlier model state for debugging, inspection, and explanation

### Workspace Direction

The intended surface is a dedicated `Build Path` workspace viewport:

- vertical reading first
- one command row/card per visible step
- inline expansion for command editing
- scrubable from both compressed and expanded representations
- strong branch visibility when parallel sketch-heavy work matters

### Relationship To Spaghetti

`Build Path` does not replace the `Spaghetti Editor`.

Recommended relationship:
- `Spaghetti Editor`
  - source-of-truth graph authoring surface
- `Build Path`
  - condensed build-reading and command-editing surface
- both surfaces should describe the same underlying build graph from different viewpoints

### Relationship To Edit History

`Build Path` should stay downstream of canonical authored history.

Recommended relationship:

- `Edit History`
  - canonical authored undo/redo truth
  - owns committed authored mutations
- `Build Path`
  - derived scrub and inspection surface
  - rebuilds from accepted authored/build state
  - may expose navigation state such as playhead position or focused step

Important rule:

- moving the `Build Path` playhead is navigation state by default
- it should not silently create undo entries just because the user scrubbed around
- authored undo/redo should visibly update the `Build Path` surface because the underlying accepted history changed

### Build Policy Boundary

`Build Path` should own build-trigger timing semantics, not draft-versus-final viewport display semantics.

Recommended ownership split:

- `Build Policy`
  - governs when authoritative/final build work is triggered after authored parameter changes
  - first honest family:
    - `Live`
    - `On Release`
    - `Manual`
    - `Off`
- `Model Viewport`
  - governs which geometry result class the user sees
  - should keep owning:
    - `Auto`
    - `Draft`
    - `Final`

Important rule:

- `Build Policy` is mainly about authoritative/final build cadence
- it should not quietly become the owner of draft preview display rules
- draft preview may still remain responsive during edits even when final build policy is conservative
- this keeps `Build Path` responsible for execution timing while `Model Viewport` stays responsible for result presentation and swap honesty

Recommended first interpretation:

- `Live`
  - start authoritative/final builds during edits
- `On Release`
  - wait until drag or edit release, then start authoritative/final build
- `Manual`
  - mark dirty state but only start authoritative/final build on explicit request
- `Off`
  - do not auto-trigger authoritative/final builds

This keeps the app from overloading one policy with two jobs:

- build cadence
- viewport result preference

### Suggested Workspace Placement

Recommended first placement:

- `Build Path` should be a real workspace viewport, not only a footer-like strip
- it should sit beside the other major workspace surfaces as its own mode
- it should have enough room to show row cards, branch structure, merge points, and inline expanded controls honestly

Suggested first shape:

- full workspace panel
- scrollable command surface
- rows as the primary reading unit
- branch structure shown inline when needed rather than hidden behind a tiny footer abstraction

Recommended relationship to the current editor modes:

- full `Spaghetti Editor`
  - best for graph authoring
- `Build Path`
  - best for temporal reading, scrub, rollback, branch overview, and command-level editing
- model viewport
  - best for seeing the resulting geometry state

This keeps `Build Path` close to the current workspace model while giving it enough space to become a real build-reading and build-editing surface.


### Technical Integration

- input
  - multi-output node graph from the `Spaghetti Editor`
- process
  - deterministic mapping from graph and accepted history into a vertical command-step surface
- output
  - a scrub-friendly row/card workspace for temporal model control

### View Modes

`Build Path` should expose two representations over the same underlying step model.

- `List View`
  - a compressed readable build story
  - one command row per visible step
  - parallel work may be summarized into grouped rows when full branch detail would overwhelm the user
- `Branch View`
  - an expanded structural view
  - the same steps are shown with explicit branch lanes and merge points
  - best for understanding ownership, parallel sketch work, and recombination

Important rule:

- `List View` and `Branch View` are two projections of the same underlying build data
- they must share the same step ids
- they must share the same current playhead position
- switching views must not change the user's scrub position or rewrite history semantics

### Derived Data Model

The first honest architecture shape should treat `Build Path` as a derived read model, not a second authored graph.

Recommended derived layers:

- `Canonical authored history`
  - the committed edits that `Edit History` owns
- `Accepted build snapshots / result bundles`
  - stable accepted evaluation results that later scrub can target without guessing
- `Build step descriptors`
  - grouped readable command units derived from graph and history truth
- `View projection data`
  - row layout for `List View`
  - branch lane layout for `Branch View`
- `Build Path navigation state`
  - current playhead index
  - selected or hovered step
  - current view mode
  - whether branch groups or rows are expanded

The main design goal is that ParaHook should be able to recompute the same `Build Path` view from trusted source data instead of storing a second fragile history structure.

### Command Row Model

The first visible `Build Path` units should be command rows, not raw every-node rows.

Recommended first step model:

- each visible step should map to one stable derived step id
- a step may represent:
  - one command-like authored operation
  - one grouped feature-level step
  - one accepted transform or parameter commit
- every step should still retain a back-reference to:
  - contributing node ids
  - authored history entry ids where relevant
  - accepted build/result identity where relevant

Recommended collapsed row content:

- command name
- icon or type label
- short result summary
- branch or merge marker when relevant
- selected/current/suppressed state
- expand or collapse affordance

Recommended expanded row behavior:

- the row opens inline rather than redirecting the user to a separate inspector immediately
- the expanded content can host the associated command toolbar in a collapsed-to-expanded form
- parameter editing should happen against the same underlying authored truth the rest of the app uses
- the row should still offer a handoff back to `Spaghetti` when deeper graph editing is required

Good first grouping rules:

- prefer meaningful user-recognizable feature or operation labels over internal node noise
- keep grouping deterministic so the same graph/history state produces the same visible command path
- never group so aggressively that ownership becomes mysterious
- allow later inspect detail to reveal the raw node contributors behind a grouped step

### Playhead Semantics

The `Build Path` playhead should act like a filtered accepted-state reader shared across both views.

Recommended first rules:

- the playhead points at a derived step boundary, not an arbitrary floating time value
- moving the playhead backward requests an earlier accepted filtered state
- moving the playhead forward restores later accepted state
- scrub should be fast and reversible
- scrub should not destructively mutate the graph
- both `List View` and `Branch View` should scrub the same underlying sequence
- clicking a row, dragging a rail, or otherwise scrubbing from either view should update the same shared current step
- leaving scrub should make it clear whether the user is:
  - only inspecting a prior state
  - or returning to present authored truth

The first cut should bias toward an explicit "inspection" feeling instead of pretending the user has actually rewritten model history.

Recommended visual direction:

- a strong vertical scrub rail that works in both views
- row alignment against that rail so the current scrub position is obvious
- clear distinction between:
  - active/current step
  - future/suppressed steps
  - grouped or collapsed branch clusters

### Inspection And Sync

The real value of `Build Path` is not only the row/card surface itself. It is the coordinated explanation across surfaces.

Recommended sync behavior:

- selecting or hovering a `Build Path` step should highlight the related grouped logic in `Spaghetti`
- the viewport should update to the matching filtered model state
- labels in the build surface should help the user understand:
  - what changed here
  - what branch this belongs to
  - what downstream work depends on it
- the current authored/present state should stay visually obvious so users do not confuse inspection with committed rollback

Good first inspect affordances:

- step label
- icon or type chip
- source highlight in `Spaghetti`
- basic dependency emphasis
- lightweight detail panel or tooltip, not a giant inspector rewrite

### List View Compression

`List View` should provide a readable build story even when many sketches and sub-branches exist.

Recommended compression rules:

- summarize parallel work into one grouped command row when full branch detail would overwhelm the story
- never invent fake serial order just to make the list look neat
- show grouped badges or counts when multiple hidden branch steps are represented by one row
- allow expansion from a grouped row into fuller detail when needed
- preserve stable mapping so the compressed row still corresponds to real underlying step ids and scrub boundaries

### Branch View Presentation

`Branch View` should preserve honest split and merge structure without turning into raw graph spaghetti.

Recommended first branch rules:

- keep rows/cards as the primary visual unit
- use explicit branch sections, lanes, or grouped vertical stacks when parallel work matters
- show visible split and merge points
- avoid rendering the full raw node graph inside this surface
- let branch-heavy sections collapse back into simpler summaries when the user returns to `List View`

The first goal is not to expose all graph complexity. The goal is to expose the complexity that matters to comprehension.

### Implementation Goals

1. implement a graph-and-history to command-row mapping algorithm
2. develop a shared playhead that supports partial graph evaluation from both views
3. create a dedicated `Build Path` workspace viewport with row/card layout, branch expansion, and inline toolbar expansion

### First Constraints

The first `Build Path` cut should stay disciplined:

- graph remains the source of truth
- the build surface is derived, not separately authored
- rollback should be partial evaluation, not destructive graph mutation
- list compression should not fake command order
- branch view should visualize branching logic without hiding execution ownership
- inline row editing should reuse existing command and parameter truth instead of inventing a shadow command model
- the first slice should prioritize read/scrub/debug value with selective inline editing before full direct graph restructuring inside `Build Path`

### Non-Goals

`Build Path` should stay disciplined about what it is not.

The first honest non-goals are:

- not a second graph authoring system
- not a replacement for canonical `Edit History`
- not a destructive rollback system
- not a fake fully linear feature stack when the graph is not actually linear
- not a raw mirror of the full node graph
- not direct drag-reorder graph editing on day one

## Phases

### [ ] Build Path 1 - Derived Command Row Model And Workspace Surface

- establish the derived command-step model
- define stable step ids, row summaries, and list-versus-branch projection rules
- render the first dedicated `Build Path` workspace surface
- keep this phase focused on derived reading, not full editing depth

Recommended first proof:

- deterministic command rows
- one visible present-state marker
- one selected-step state
- no direct graph restructuring from this surface

### [ ] Build Path 2 - Shared Scrub In List View And Branch View

- add a real playhead that can move across derived step boundaries
- rebuild the viewport from earlier accepted state without mutating authored graph truth
- make inspection of earlier build states fast enough to feel natural
- keep scrub clearly separated from authored undo/redo
- ensure both views share one current step and one filtered-state result

Recommended first proof:

- scrub backward to earlier accepted state
- scrub forward back to present
- clear visual indication when not at present
- switching between `List View` and `Branch View` preserves the same scrub position

### [ ] Build Path 3 - Row Expansion, Inline Toolbars, And Basic Inspect UI

- sync hovered and selected build steps back to `Spaghetti`
- highlight the relevant grouped graph ownership
- add minimal inspect information for "what is this step" and "what does it affect"
- let rows expand inline to show the associated toolbar or command parameters
- keep the first inspect layer lightweight and fast

Recommended first proof:

- row selection highlights graph contributors
- viewport and graph stay in sync with the same chosen step
- grouped labels are understandable without opening the raw graph every time
- expanding a row reveals inline editable controls without creating a second source of truth

### [ ] Build Path 4 - Honest Branch Sections, Split Points, And Merge Points

- add explicit branch presentation when parallel sketch-heavy work matters
- preserve the main story while revealing split and merge structure honestly
- let expansion stay compact by default
- keep branch sections readable as command cards, not graph noise

Recommended first proof:

- branch-aware layout for one real branching case
- collapsed default view plus expanded detail
- visible merge points
- no misleading single-list flattening when ownership would become ambiguous

### [ ] Build Path 5 - Richer Inspection, Labels, And Later Edit Hooks

- improve step naming, dependency explanation, and branch summaries
- explore later interaction hooks such as step pinning, compare modes, or handoff back into authoring surfaces
- keep deeper direct editing secondary until the read model, shared scrub semantics, and inline expansion model are stable
- leave full graph restructuring ambitions for later follow-on docs

Recommended first proof:

- richer step labels
- dependency breadcrumbs or related-step emphasis
- explicit handoff from timeline step into graph authoring focus

## Naming

`Build Path` is now the active name for this family.

Why it fits:

- build story
- traversal
- command-path readability
- graph-aware pathing
- readable construction flow

Why it wins over the older codename:

- `Build Path`
  - clearer and more product-facing
  - still flexible enough to cover both scrub/history reading and graph-derived grouping
  - matches the idea that the surface explains the model's build story rather than only listing undo entries

Secondary alternatives worth remembering if the language changes later:

- `Feature Path`
  - strongest alternate if ParaHook wants more explicit CAD terminology
- `Model Tree`
  - strongest alternate if the surface becomes more structural and hierarchical than timeline-like
- `History Tree`
  - usable, but more likely to blur together with canonical `Edit History`

## Questions / Decisions

### [x] q1 - should `Build Path` become a dedicated workspace viewport instead of a slim footer-like surface?

#### Suggestion

Yes. `Build Path` should be a dedicated workspace viewport. The command-row and branch-heavy direction needs more room than a slim footer can provide, especially once rows can expand inline to show command controls.

Decision:

- yes
- `Build Path` should be treated as its own real workspace mode
- do not optimize the first honest cut around a Fusion-style bottom strip anymore

### [x] q2 - should `Build Path` support inline row expansion for parameter editing in the first meaningful cut, while still avoiding direct graph reordering?

#### Suggestion

Yes. Allow inline row expansion for command-level parameter editing because that is core to the row/card workspace idea. Still avoid direct graph reordering or structural editing until the derived mapping and scrub semantics are stable.

Decision:

- yes
- row expansion should open the associated toolbar or parameter surface inline
- do not add drag-reorder graph editing in the first cut

### [x] q3 - should `Build Path` support both a compressed `List View` and an expanded `Branch View` over the same underlying step model?

#### Suggestion

Yes. The compressed and expanded views are both necessary. Sketch-heavy graphs will otherwise become either unreadable or misleading. The key is to keep both views tied to the same step ids and the same scrub position.

Decision:

- yes
- `List View` is the compressed build story
- `Branch View` is the expanded structural truth
- both views must share one step model and one playhead

### [x] q4 - in `List View`, should parallel work be compressed into grouped rows even when that means summarizing multiple real branch steps into one readable line?

#### Suggestion

Yes, but only as a summary. `List View` should compress parallel work into grouped rows when needed, while still making it obvious that the row is representing multiple underlying steps or a branch cluster. It should never silently invent fake serial order.

Decision:

- yes
- compressed rows are allowed
- fake serial ordering is not allowed
- grouped rows should expose counts, badges, or expansion affordances

### [x] q5 - should the `Build Path` playhead scrub the same underlying model state from both `List View` and `Branch View`?

#### Suggestion

Yes. There should be one shared scrub model. `List View` and `Branch View` are different visualizations of the same build, not separate histories. Moving the playhead from either view should request the same filtered accepted state and the same graph sync.

Decision:

- yes
- one playhead
- one current step
- one filtered model state
- one graph-sync response

### [x] q6 - should the first visible `Build Path` units be command rows/cards backed by grouped step descriptors instead of raw node entries?

#### Suggestion

Yes. Command rows/cards are the right visible unit. Raw node entries will be too noisy for this workspace, especially once many sketches exist. Grouped step descriptors give the user a clean build surface without severing the back-reference to real graph ownership.

Decision:

- yes
- rows/cards are the visible unit
- grouped derived steps back them
- raw node ownership remains inspectable behind the row

### [x] q7 - should ParaHook keep the renamed `Build Path` title as the main product-facing family name for now?

#### Suggestion

Yes. Keep `Build Path` as the main family name for now. It is clearer than the old codename, reads well beside `Edit History`, and still leaves room for later refinement if the surface becomes more tree-like than path-like.

Decision:

- yes
- `Build Path` is the active family name
- do not keep the old codename in live planning docs except when mentioning the rename historically
- keep `Model Tree` and `Feature Path` as fallback alternatives only if the surface direction changes substantially

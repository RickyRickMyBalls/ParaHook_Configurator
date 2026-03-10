# 6 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for new planning batches after `5_CodexChatNotes.md`.
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.

## Doc Body

## Session 1 Notes

## `Achievement 5` - [53] 2026-03-08 - `[1.4] GE - Phase 12 - Multi-Document Graph Ownership` Planning Start

### 2026-03-08 18:30 - Session 1 Focus - What We Need To Achieve In `[1.4] GE - Phase 12`

This planning batch is for:

- `GE - Phase 12 - Multi-Document Graph Ownership`

This phase should define the ownership model above individual graph documents.

The core job here is to make the future `Browser` structurally real at the project/content level without drifting too early into full Browser UI polish.

Current working direction from the roadmap:

- app truth should support more than one `graph document`
- a higher `Project File` layer should exist above graph documents
- the Browser should expose project-local structure
- graph ownership should remain intact even when graphs publish to each other or when multiple graphs are active in the same project

### [0] 2026-03-08 18:30 - Current Decision Checklist - `[1.4] GE - Phase 12 - Multi-Document Graph Ownership`

#### Decision 1 Checlist Notes

- Use this as the active Session 1 checklist for `GE - Phase 12`.
- Keep the old question as `~` if it gets replaced by a better `QN.1`.
- If you say `update QN`, update both:
  - the top `Decision 1 Checlist`
  - and the matching `#### QN` section below
- Substantive timestamped entries in this file should continue the absolute `[N]` numbering after `5_CodexChatNotes.md`.

#### Question Explinations

##### Q1 - `What is the minimum canonical shape of a Project File above graph documents?`

This asks:
- what the smallest honest project-level container object is once one app session can hold more than one graph document

Why it matters:
- before the Browser can own multiple graphs, we need to know what object actually owns them

Humanized summary:
- what is the smallest real project/file object that can hold more than one graph

##### Q2 - `How should a Project File own multiple graph documents without collapsing them back into one active graph?`

This asks:
- what the ownership and lifecycle rules are when many graph documents live under one project

Why it matters:
- we already decided one editor viewport should not define whether a graph is active, cached, or relevant

Humanized summary:
- how do many graphs live in one project without one of them becoming the only "real" graph again

##### Q3 - `What state should become project-local instead of app-global or graph-local?`

This asks:
- what information belongs at the project layer once we introduce a `Project File` above individual graphs

Why it matters:
- we now have a three-layer ownership split:
  - `app-global`
  - `project-local`
  - `graph-local`
- this phase needs to define the middle layer more clearly

Humanized summary:
- what belongs to the project/browser layer itself

##### Q4 - `How should graphs, assemblies, objects, and parts relate at the ownership level in GE - Phase 12?`

This asks:
- how the Browser tree should be parented once graphs and project-local content coexist

Why it matters:
- we have already defined:
  - `Project File -> Assembly tree -> Objects -> Parts`
- but we still need to define how graph documents publish into that structure

Humanized summary:
- how do graphs connect into the project tree without confusing graph truth and output structure

##### Q4.1 - `How should graphs, components, assemblies, objects, and parts relate at the ownership level in GE - Phase 12?`

This asks:
- whether `Component` should become the cleaner bridge term between graph-authored output and project-level composition

Why it matters:
- we have started using `Component` as a possible name for the graph-produced bundle
- that may be clearer than forcing `graph -> assembly/object` wording directly at every layer

Humanized summary:
- should a graph publish a `Component` first, and then let the project place that component into assemblies and objects

##### Q5 - `How should external reference assets stay outside project-owned graph truth?`

This asks:
- how references like shoe / footpad geometry should remain separate from the project's authored graph content

Why it matters:
- the Browser will likely show both project content and external references
- but they should not share the same ownership rules

Humanized summary:
- how do we keep references visible without pretending they are authored project graphs

##### Q6 - `How should Publish / Receive work across graph documents without breaking graph ownership?`

This asks:
- how one graph can expose data to another graph while keeping the rule that each graph owns its own authored truth and built outputs

Why it matters:
- cross-graph communication is one of the easiest ways to accidentally break clean ownership

Humanized summary:
- how can graphs talk to each other without turning into one merged ownership mess

##### Q7 - `What current singleton store assumptions must change for GE - Phase 12 to count as real?`

This asks:
- which parts of the current app/store shape still assume one global graph, one global graph store, or one app-owned graph list

Why it matters:
- this keeps the phase grounded in real code instead of only product language

Humanized summary:
- what single-graph store assumptions do we actually need to break

##### Q8 - `What is out of scope for GE - Phase 12 so multi-document ownership does not sprawl into full Browser UI and later project systems?`

This asks:
- where this phase should stop so it defines ownership cleanly without trying to finish every future Browser/project feature

Why it matters:
- this phase can easily sprawl into:
  - full Browser UI
  - full project-file persistence
  - rich assembly editing
  - materials and references

Humanized summary:
- what should GE12 define now, and what should wait

#### Decision 1 Checlist

- [x] Q1 - What is the minimum canonical shape of a `Project File` above graph documents?
- [x] Q2 - How should a `Project File` own multiple graph documents without collapsing them back into one active graph?
- [x] Q3 - What state should become project-local instead of app-global or graph-local?
- [~] Q4 - How should graphs, assemblies, objects, and parts relate at the ownership level in `GE - Phase 12`?
  - [x] Q4.1 - How should graphs, `components`, assemblies, objects, and parts relate at the ownership level in `GE - Phase 12`?
- [x] Q5 - How should external reference assets stay outside project-owned graph truth?
- [x] Q6 - How should `Publish / Receive` work across graph documents without breaking graph ownership?
- [x] Q7 - What current singleton store assumptions must change for `GE - Phase 12` to count as real?
- [x] Q8 - What is out of scope for `GE - Phase 12` so multi-document ownership does not sprawl into full Browser UI and later project systems?

#### [x] Q1 - What is the minimum canonical shape of a `Project File` above graph documents?

##### [54] 2026-03-09 09:05 - Resolved Q1 - Start The `Project File` Small As The Container Above Graph Documents, But Leave Clear Room For It To Grow Later

Recommended minimum canonical shape:

- `projectFileId`
- `name`
- `version`
- `graphDocuments`
- `rootAssembly`
- optional if easy:
  - `createdAt`
  - `updatedAt`

Working meaning:

- `projectFileId`
  - stable identity for the whole project
- `name`
  - the user-facing project name
- `version`
  - schema/version identity for later save/load and migration
- `graphDocuments`
  - the graph files this project owns
- `rootAssembly`
  - the top-level project content tree above graph outputs

Working rule:

- exporting a `Project File` should be able to carry all the graph files inside it
- a `Spaghetti File` remains the smaller graph-level export

Important scope note:

- the minimum `Project File` should stay small in `GE - Phase 12`
- but it should be designed to grow later into a fuller project container

Likely later growth areas:

- stored camera views
- project-level materials / material library records
- imported objects / reference assets
- radio sampler setup
- project settings and other project-scoped systems

#### [x] Q2 - How should a `Project File` own multiple graph documents without collapsing them back into one active graph?

##### [56] 2026-03-09 09:18 - Resolved Q2 - `Project File` Owns The Graph Documents, While The `Browser` Shows And Manages Them Without Turning One Back Into The Only Real Graph

Locked direction:

- a `Project File` owns multiple `graph documents`
- those graph documents remain separate owned records inside the project
- the `Browser` is the UI surface that shows and manages that graph list
- a spaghetti editor window is only a viewport into one graph at a time

Important rule:

- no single editor viewport should redefine project truth back into:
  - "one real graph"
  - "one active graph"
  - or "one graph that matters"

Working result:

- many graphs can exist in one project at once
- many graphs can remain relevant/active in the project at once
- the `Browser` / project layer owns their collection and lifecycle
- the editor layer only decides which graph a given viewport is currently showing

#### [x] Q3 - What state should become project-local instead of app-global or graph-local?

##### [57] 2026-03-09 09:24 - Resolved Q3 - Use The Middle Layer For Project-Owned Graph Collections, Browser Tree Structure, And Project-Level Output Organization

Recommended ownership split:

`App-global`

- main viewer shell
- camera state
- global rendering prefs
- toolbar/tool mode state
- focused editor window
- workspace/window layout
- keyboard shortcut routing
- worker service lifetime
- theme/layout prefs

`Project-local`

- `projectFileId`
- project name
- project version
- the list of graph documents the project owns
- which graphs are cached in this project
- project-level graph active/inactive state
- the Browser tree / project content tree
- project-level assembly/object parenting
- project-level placement of graph-produced content
- project-level organization metadata

Likely later project-local growth:

- stored camera views
- project materials library
- imported/reference asset records
- radio sampler config
- project settings

`Graph-local`

- node locations
- wire connections
- param values
- part/feature/driver authored configuration
- authored `generate on/off`
- compile/build memory
- preview/output memory
- graph output declaration / handoff state
- graph-owned build stats / build sequence memory

Working rule:

- `app-global`
  - things about the workspace itself
- `project-local`
  - things about how graphs and outputs are organized together inside one project
- `graph-local`
  - things authored inside one graph and what that graph built

Minimum middle-layer items to lock first:

- graph document list
- cached/active graph state per project
- Browser/project tree
- project-level assembly/object placement

#### [~] Q4 - How should graphs, assemblies, objects, and parts relate at the ownership level in `GE - Phase 12`?

##### [55] 2026-03-09 09:12 - Resolved Q4 - Graphs Should Publish Project Content Upward, While Project-Level Parenting Owns The Bigger Browser Tree

Working first-pass Browser hierarchy:

```text
Project File
  Object: ParaHook
    Part: Baseplate
    Part: Toe Hook
    Part: Heel Kick
  Graph Documents
    Graph: ParaHook
```

Also valid when the user wants more organization:

```text
Project File
  Assembly List
    Assembly: Assembly 1
      Object: ParaHook
        Part: Baseplate
        Part: Toe Hook
        Part: Heel Kick
  Graph Documents
    Graph: ParaHook
```

Locked direction:

- `Assembly` should be optional in the simple case
- a project can own `Objects` directly
- a project can also own an `Assembly List` when the user wants grouped/nested organization

Ownership split:

- `Graph Document`
  - owns authored compute truth
  - publishes outputs through the `Graph Output` node
- `Graph Output`
  - can organize what the graph is publishing upward
  - may publish:
    - one `Object`
    - multiple `Objects`
    - or a graph-authored `Assembly`
- `Project File`
  - owns the bigger Browser tree and higher-level placement/nesting

Important refinement:

- `Parts` do not need to live as top-level graph-owned Browser items
- `Parts` are better treated as sub-objects inside an `Object`
- the `Part` layer is mainly for:
  - material zones
  - internal object organization
  - later manufacturing/sub-part split work

Graph versus project assembly rule:

- the `graph` can own the `assembly definition` it authors
- the `project` should own where that authored assembly gets placed in the bigger Browser tree
- this allows a graph-produced assembly to later be nested under another project-level assembly without breaking graph ownership

Possible terminology refinement:

- the graph-produced bundle may later be better named a `Component`
- that would give a cleaner bridge between:
  - graph-authored output
  - and project-level composition

Current high-confidence rule:

- `Graph Documents` are the authored logic side
- `Objects` / `Assemblies` / `Parts` are the project-content side
- graphs publish upward into the project tree rather than needing the graph tree and Browser tree to be identical

#### [x] Q4.1 - How should `graphs, components, assemblies, objects, and parts` relate at the ownership level in `GE - Phase 12`?

##### [58] 2026-03-09 09:31 - Resolved Q4.1 - Use `Component` As The Graph-Produced Bundle That The Project Composes Upward

Recommended ownership stack:

- `Graph Document`
  - authors one `Component`
- `Component`
  - is the graph-produced bundle
  - may contain:
    - one `Object`
    - multiple `Objects`
    - maybe a graph-authored internal `Assembly`
- `Project File`
  - owns the larger project tree
  - places `Components` into higher-level `Assemblies`
- `Assembly`
  - groups:
    - `Components`
    - and/or `Objects`
    - and later maybe other `Assemblies`
- `Object`
  - contains:
    - `Parts`
- `Part`
  - internal/material/structural subdivision
  - may later contain:
    - `Sub-Parts`

Key distinction:

- the `Graph` does not need to own the final whole project tree
- the `Graph` owns a `Component`
- the `Project` composes those components into the bigger Browser structure

Working shorthand:

- graph-authored side:
  - `Graph Document -> Component -> Object -> Part`
- project-composition side:
  - `Project File -> Assembly tree -> Components / Objects`

Why this is strong:

- it keeps graph truth cleaner
- it gives the project layer a stable reusable unit
- it avoids overloading `Assembly` as the only container term

#### [x] Q5 - How should external reference assets stay outside project-owned graph truth?

##### [60] 2026-03-09 09:42 - Resolved Q5 - Keep External Reference Assets App-Global For Now, Outside `Project File` Ownership And Export

Locked current rule:

- external reference assets should stay `app-global`
- they should remain outside `Project File` ownership for the first pass
- they should remain outside project export for the first pass

What this means now:

- the user can still load references for context
- the viewer / Browser can still show them
- but they do not become project-authored graph/content truth

Likely later feature direction:

- allow imported `.step`, `.obj`, `.stl`, and maybe `.glb` assets
- later allow the user to include selected imported assets inside the `Project File`
- later allow project export to carry those included assets with the project

Why this boundary is useful:

- it keeps `GE - Phase 12` focused on graph/project ownership instead of reference-asset packaging
- it leaves room for a later richer import/export/reference-asset system

#### [x] Q6 - How should `Publish / Receive` work across graph documents without breaking graph ownership?

##### [61] 2026-03-09 09:49 - Resolved Q6 - `Publish / Receive` Should Support Both `Link` And `Hard Copy` Modes Across Graph Documents

Locked direction:

- if `Graph B` wants to use published data from `Graph A`, the user should have two clear options:
  - `Link`
  - `Hard Copy`

`Link` mode:

- `Graph A` keeps ownership of the published source data
- `Graph B` receives that data as a live dependency
- if the user changes the source params in `Graph A`, the updates flow into `Graph B`

`Hard Copy` mode:

- `Graph B` copies the received data into its own graph-owned state
- once copied, `Graph B` owns that local data
- from that point on, the copied data no longer depends on live updates from `Graph A`

Export rule:

- if the user wants to export `Graph B` as a standalone graph file, linked received data should first be converted to `Hard Copy`
- this keeps the exported graph self-contained instead of depending on an external graph source

Why this is a strong ownership rule:

- `Link`
  - preserves source-graph ownership
  - keeps cross-graph live dependency explicit
- `Hard Copy`
  - creates clear local ownership in the receiving graph
  - prevents exported graphs from shipping with hidden external dependencies

#### [x] Q7 - What current singleton store assumptions must change for `GE - Phase 12` to count as real?

##### [62] 2026-03-09 09:58 - Resolved Q7 - `GE - Phase 12` Must Break The Singleton Graph Store, Singleton Spaghetti State, And One-Window Assumptions

Current singleton seams in code:

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - one global `graph`
  - one global canvas selection state
  - one global edge waypoint set
  - one global UI message
  - this is the biggest blocker for multi-document ownership

- `src/app/store/useAppStore.ts`
  - one global:
    - `inputMode`
    - `parts`
    - `partsVisibility`
    - `selectedPartKey`
    - `assembled`
    - `spaghettiLastCompile`
    - `spaghettiPreviousBuildInputs`
  - methods like `setSpaghettiGraph`, `compileSpaghetti`, and `requestSpaghettiBuild` still assume one current graph

- `src/app/AppShell.tsx`
  - one spaghetti floating window controlled by `inputMode === 'spaghetti'`
  - still treats spaghetti like one app mode instead of many graph viewports

- `src/app/components/ViewerHost.tsx`
  - one global `parts`
  - one global `assembled`
  - one singleton `useSpaghettiStore.graph`
  - still routes viewer state through one active graph path

- `src/app/panels/PartsListPanel.tsx`
  - still assumes one global parts list plus one singleton spaghetti graph

- `src/app/panels/SpaghettiPanel.tsx`
  - directly drives one global spaghetti graph through sample-load buttons and one compile/build surface

Locked recommendation:

- replace one global `useSpaghettiStore.graph` with project-owned graph documents
- stop storing one app-global spaghetti compile/build memory bucket
- stop treating spaghetti as one app mode/window
- move toward:
  - project-owned graph collection
  - editor viewport -> chosen graph document
  - graph-local authored state
  - project-local graph lifecycle

High-confidence read:

- biggest blocker:
  - singleton `useSpaghettiStore`
- second blocker:
  - app-global spaghetti state in `useAppStore`
- third blocker:
  - one-window `AppShell` assumption

#### [x] Q8 - What is out of scope for `GE - Phase 12` so multi-document ownership does not sprawl into full Browser UI and later project systems?

##### [63] 2026-03-09 10:06 - Resolved Q8 - Break `GE - Phase 12` Into `12A / 12B / 12C` And Keep Full Browser UI, Asset Packaging, And Rich Project Systems Out Of Scope For Now

Working `GE - Phase 12` split:

- `12A - Project File Core And Graph Collection Ownership`
  - define the minimum `Project File` shape
  - define how a project owns multiple graph documents
  - define project-local graph list / graph lifecycle ownership

- `12B - Project Content Tree Ownership`
  - define the project-local Browser tree structure
  - define how graphs publish `Components` upward into project content
  - define the ownership boundary between:
    - `Project File`
    - `Assemblies`
    - `Components`
    - `Objects`
    - `Parts`

- `12C - Cross-Graph Ownership Rules`
  - define how `Publish / Receive` works across graph documents
  - define `Link` versus `Hard Copy`
  - confirm export-safe cross-graph ownership rules
  - define which singleton store assumptions must be broken

Keep out of scope for now:

- full Browser UI polish
- final Browser interactions and context menus
- full project-file persistence/packaging details
- imported reference assets inside project export
- material library/project material systems
- radio sampler project systems
- rich assembly editing tools
- deeper `Sub-Components`
- later `Sub-Parts`
- full viewer/reference workspace behavior

Working scope rule:

- `GE - Phase 12` should define ownership and containment
- it should not try to finish every later project, Browser, or asset-management feature

#### Session 1 - Future Feature Captures

##### [59] 2026-03-09 09:36 - Future Structure Note - `Components` May Later Need `Sub-Components` For Deeper Graph-Owned Output Organization

Working later idea:

- a `Graph Document` can start by authoring one top-level `Component`
- that `Component` can first stay simple:
  - `Component -> Object -> Part`
- later, when the user needs deeper organization, a `Component` may need to contain:
  - `Sub-Components`

Why this matters later:

- it would let users organize graph-produced content more deeply without forcing every grouping problem into `Assembly`
- it may be the cleaner graph-owned parallel to project-level assembly nesting

Current recommendation:

- keep `Sub-Components` out of the first-pass `GE - Phase 12` implementation
- but leave room for them as a later extension of the `Component` model

#### Session 1 - Working Notes

## `Achievement 6` - [64] 2026-03-09 - `[1.1A] SP - Phase 9A - Graph Document Core` Planning Start

### 2026-03-09 10:18 - Session 2 Focus - What We Need To Achieve In `[1.1A] SP - Phase 9A`

This planning batch is for:

- `SP - Phase 9A - Graph Document Core`

This is the earliest concrete implementation slice inside Lane `[1]`.

The job here is to define the smallest real graph-document object and the minimum editor/store changes needed so the app can stop pretending there is only one hidden graph.

Current working direction from earlier planning:

- a `graph document` can be valid even when empty
- a graph document owns authored graph truth
- spaghetti editors are viewports into graphs, not the graphs themselves
- later persistence and Browser ownership should build on this core shape rather than redefining it

### [0] 2026-03-09 10:18 - Current Decision Checklist - `[1.1A] SP - Phase 9A - Graph Document Core`

#### Decision 2 Checlist Notes

- Use this as the active Session 2 checklist for `SP - Phase 9A`.
- Keep the old question as `~` if it gets replaced by a better `QN.1`.
- If you say `update QN`, update both:
  - the top `Decision 2 Checlist`
  - and the matching `#### QN` section below
- Substantive timestamped entries in this file should continue the absolute `[N]` numbering path.

#### Question Explinations

##### Q1 - `What is the minimum canonical shape of one graph document in app state?`

This asks:
- what the smallest honest graph-document object is before persistence, Browser UI, or later project ownership layers expand it

Why it matters:
- `SP - Phase 9A` should define the graph-document core, not just talk about it abstractly

Humanized summary:
- what is the smallest real graph object the app should recognize

##### Q2 - `Which authored state belongs inside the graph document core versus outside it?`

This asks:
- what graph-authored state must live inside the graph document itself and what should stay in viewer/editor/workspace state instead

Why it matters:
- this is where the graph-document boundary gets real enough for later save/load and Browser work

Humanized summary:
- what should the graph document actually own

##### Q3 - `What identity fields does a graph document core need from day one?`

This asks:
- what ids and basic metadata the graph document needs before later persistence and project ownership layers grow on top of it

Why it matters:
- later routing, save/load, Browser lists, and project ownership all depend on stable graph identity

Humanized summary:
- what fields make one graph document feel like a real document

##### Q4 - `How should an editor viewport point at a graph document without becoming the owner of graph truth?`

This asks:
- how the app should relate one spaghetti editor surface to one graph document while keeping the graph document as the real source of authored truth

Why it matters:
- we already decided editors are viewports, not the deepest owner

Humanized summary:
- how does one editor look at one graph without becoming the graph itself

##### Q5 - `What current singleton state must move or split first to make graph documents real in SP - Phase 9A?`

This asks:
- what concrete store/app seams have to change first so graph documents can exist as more than one hidden singleton graph

Why it matters:
- this keeps the phase grounded in current code instead of only product language

Humanized summary:
- what old single-graph assumptions do we need to break first

##### Q6 - `What should stay out of SP - Phase 9A so the graph-document core does not sprawl into later Browser and persistence phases?`

This asks:
- where the first graph-document core phase should stop

Why it matters:
- this phase can easily drift into full Browser ownership, save/load, routing, or UI polish if the boundary is not explicit

Humanized summary:
- what belongs in graph-document core now, and what should wait

#### Decision 2 Checlist

- [x] Q1 - What is the minimum canonical shape of one `graph document` in app state?
- [x] Q2 - Which authored state belongs inside the `graph document` core versus outside it?
- [x] Q3 - What identity fields does a `graph document` core need from day one?
- [x] Q4 - How should an editor viewport point at a `graph document` without becoming the owner of graph truth?
- [x] Q5 - What current singleton state must move or split first to make graph documents real in `SP - Phase 9A`?
- [x] Q6 - What should stay out of `SP - Phase 9A` so the graph-document core does not sprawl into later Browser and persistence phases?

#### [x] Q1 - What is the minimum canonical shape of one `graph document` in app state?

##### [65] 2026-03-09 10:24 - Resolved Q1 - A Graph Document Core Should Be A Valid Document-Like Object With Identity, Graph Data, And A Default `0,0,0` Origin Reference

Recommended minimum canonical shape:

- `graphDocumentId`
- `name`
- `version`
- `graph`
  - `nodes`
  - `edges`
- `origin`
  - default `0,0,0` reference

Working rule:

- a graph document should still be valid even when empty
- that means it can contain:
  - no nodes yet
  - no edges yet
- but it still needs:
  - stable identity
  - graph data container
  - default origin/reference space

Important clarification:

- `origin` does not need to be a rich object in `SP - Phase 9A`
- it does not need to be a visible graph node yet
- for now it is just the default `0,0,0` reference the graph is built around

#### [x] Q2 - Which authored state belongs inside the `graph document` core versus outside it?

##### [66] 2026-03-09 10:29 - Resolved Q2 - The Graph Document Core Should Own Authored Graph Truth, But Not Editor, Window, Or Viewer State

Keep inside the `graph document` core:

- node locations
- edge connections
- node params / values
- node canvas mode:
  - `collapsed`
  - `essentials`
  - `expanded`
- part / feature / driver authored configuration
- authored `generate` state
- graph-owned output declaration state

Keep outside the `graph document` core:

- which editor window is showing the graph
- whether the editor is popped out
- window size / position
- current focused editor
- viewer camera
- Browser panel open / closed state
- `view on/off` state
- temporary selection / hover UI state

Working rule:

- if it is part of the graph's authored meaning or needed to recreate the authored canvas, it belongs inside the graph document
- if it is only about how the graph is currently being viewed, edited, or displayed in the app, it stays outside

Important note:

- node position is not pure semantic build logic
- but it should still live inside the graph document core because it is needed to recreate the authored canvas faithfully
- node canvas mode should also live inside the graph document core for the same reason

Refined rule:

- the graph owns:
  - node layout
  - node wiring
  - node values/config
  - node presentation mode on the canvas
- the workspace/editor owns:
  - window placement
  - pop-out state
  - active viewport focus

#### [x] Q3 - What identity fields does a `graph document` core need from day one?

##### [67] 2026-03-09 10:38 - Resolved Q3 - The Graph Document Core Only Needs Stable Id, User-Facing Name, And Version From Day One

Recommended day-one identity core:

- `graphDocumentId`
- `name`
- `version`

Working meaning:

- `graphDocumentId`
  - stable machine identity
- `name`
  - user-facing graph label for lists and editor switching
- `version`
  - schema/version base for later save/load and migration

Why this is enough for `SP - Phase 9A`:

- it makes the graph document listable
- it makes the graph document switchable
- it makes later save/load and compile/build routing easier to layer on
- it keeps the first document-core phase small

Likely later identity / metadata fields:

- `parentFileId`
- `createdAt`
- `updatedAt`
- `description`
- `author`
- `units`
- richer project-linked metadata

#### [x] Q4 - How should an editor viewport point at a `graph document` without becoming the owner of graph truth?

##### [68] 2026-03-09 10:43 - Resolved Q4 - An Editor Viewport Should Point At A `graphDocumentId`, Not Own The Graph Document

Locked direction:

- the `Graph Document` owns the authored graph truth
- the `Editor Viewport` only stores a reference to that graph
- the clean binding is:
  - `graphDocumentId`

Working rule:

- when the editor changes something, it edits the referenced graph document
- it does not become the owner of that graph

Why this is the right split:

- the same graph could later be shown in more than one editor viewport
- switching a viewport from `Graph A` to `Graph B` should not change graph ownership
- closing a viewport should not delete the graph document
- the `Browser` / project layer should continue owning the graph collection

Viewport meaning:

- `Editor Viewport`
  - reference to a graph document
  - plus local UI/workspace state later if needed
- `Graph Document`
  - real authored source of truth

#### [x] Q5 - What current singleton state must move or split first to make graph documents real in `SP - Phase 9A`?

##### [69] 2026-03-09 10:52 - Resolved Q5 - Break The Singleton State In Order: Global Graph Store First, Global Spaghetti Build Memory Second, One-Editor Ownership Assumption Third

Break the singleton state in this order, because these are the first seams that stop one graph document from being real:

1. `useSpaghettiStore.graph`
- biggest blocker
- right now the whole spaghetti editor is built around one global graph
- this should become:
  - graph-document-owned state
  - looked up by `graphDocumentId`
  - not one singleton graph for the whole app

2. app-global spaghetti compile/build memory in `useAppStore`
- these fields are still one-bucket state:
  - `spaghettiLastCompile`
  - `spaghettiPendingChangedParamIds`
  - `spaghettiPendingStatsPartKeys`
  - `spaghettiPendingInstances`
  - `spaghettiPreviousBuildInputs`
- these should stop being "the spaghetti state" for the whole app
- they should move toward graph-local document memory

3. one-editor assumption in `SpaghettiPanel` and `AppShell`
- `SpaghettiPanel` still acts like one global editor surface
- `AppShell` still gates spaghetti through one `inputMode === 'spaghetti'`
- `SP - Phase 9A` should at least stop tying graph truth to one editor surface

What can stay for now:

- one worker service
- one viewer shell
- one app shell
- one Browser shell

Clean first recommendation:

- `SP - Phase 9A` should first split the singleton spaghetti graph and singleton spaghetti compile/build memory, while leaving the larger app shell and worker service shared

In practical terms:

- first move:
  - `useSpaghettiStore.graph`
- second move:
  - spaghetti compile/build memory out of one app-global bucket
- third move:
  - stop letting one panel/window define graph ownership

Why this is the right scope:

- this is the smallest real break that makes graph documents real
- it does not require finishing all later Browser/persistence work at the same time

#### [x] Q6 - What should stay out of `SP - Phase 9A` so the graph-document core does not sprawl into later Browser and persistence phases?

##### [70] 2026-03-09 11:01 - Resolved Q6 - Split `SP - Phase 9A` Into Immediate Graph-Document Core Work Versus Later Follow-On Work In The Wider Phase 9 Lane

Recommended sub-phases to achieve now inside `SP - Phase 9A`:

- `9A.1 - Graph Document Shape And Identity`
  - define the minimum graph-document object
  - lock:
    - `graphDocumentId`
    - `name`
    - `version`
    - `graph`
    - default `0,0,0` origin reference

- `9A.2 - Graph-Owned Authored Canvas State`
  - lock what the graph document owns
  - include:
    - node positions
    - edge wiring
    - node values/config
    - node canvas mode:
      - `collapsed`
      - `essentials`
      - `expanded`

- `9A.3 - Viewport Binding And First Singleton Split`
  - make the editor viewport point at `graphDocumentId`
  - begin breaking:
    - singleton `useSpaghettiStore.graph`
    - one-bucket spaghetti document assumptions

Later sub-phases to achieve in the wider Phase 9 lane, but not force into `9A`:

- `9B - Multi-Editor Browser Foundation`
  - multiple editor viewports
  - graph switching across viewports
  - Browser-facing graph list behavior

- `9C - Graph-Local Compile / Preview Preparation`
  - graph-local compile/build memory
  - graph-local preview/output preparation
  - stronger bridge into `SP - Phase 10`

Keep out of `SP - Phase 9A` for now:

- full Browser ownership and project-file work
- save/load implementation details
- multi-editor window management polish
- full graph-local compile/build routing
- full preview/output hierarchy work
- Browser UI polish

Working scope rule:

- `SP - Phase 9A` should make one graph document real
- later `9B / 9C` should make that graph document usable across Browser/editor/view routing

#### Session 2 - Future Feature Captures

#### Session 2 - Working Notes

### Session 2 Summary

`SP - Phase 9A` is now defined as the phase that makes one graph document real as a first-class app object.

The phase is intentionally small:
- define one graph document core
- define what authored graph/canvas state it owns
- bind editor viewports to graph documents by id
- break the first singleton seams without drifting into full Browser, persistence, or preview-routing work

### Session 2 - Main Decisions Captured

- a graph document is valid even when empty
- a graph document core should contain:
  - `graphDocumentId`
  - `name`
  - `version`
  - `graph`
  - default `0,0,0` origin reference
- the graph document owns:
  - node layout
  - node wiring
  - node values/config
  - node canvas mode:
    - `collapsed`
    - `essentials`
    - `expanded`
- editor/workspace state stays outside the graph document
- an editor viewport should point at `graphDocumentId`, not own graph truth
- the first singleton seams to split are:
  - `useSpaghettiStore.graph`
  - app-global spaghetti compile/build memory
  - one-editor ownership assumptions in `SpaghettiPanel` / `AppShell`
- `SP - Phase 9A` should stop before:
  - Browser ownership work
  - save/load details
  - graph-local compile/preview routing
  - Browser UI polish

### Session 2 - Hand-off Into Achievement 7

The next planning target is:

- `SP - Phase 9B - Multi-Editor Browser Foundation`

That phase should answer how multiple editor viewports, Browser graph switching, focus, and graph-editor coordination should work once the graph document core exists.

## `Achievement 7` - [71] 2026-03-09 - `[1.1B] SP - Phase 9B - Multi-Editor Browser Foundation` Planning Start

### 2026-03-09 11:12 - Session 3 Focus - What We Need To Achieve In `[1.1B] SP - Phase 9B`

This planning batch is for:

- `SP - Phase 9B - Multi-Editor Browser Foundation`

This phase should make graph documents usable through more than one editor viewport and start turning the Browser into the surface that coordinates those viewports.

The job here is not full Browser polish. The job is to define the first real multi-editor behavior above the graph-document core.

### [0] 2026-03-09 11:12 - Current Decision Checklist - `[1.1B] SP - Phase 9B - Multi-Editor Browser Foundation`

#### Decision 3 Checlist Notes

- Use this as the active Session 3 checklist for `SP - Phase 9B`.
- Keep the old question as `~` if it gets replaced by a better `QN.1`.
- If you say `update QN`, update both:
  - the top `Decision 3 Checlist`
  - and the matching `#### QN` section below
- Substantive timestamped entries in this file should continue the absolute `[N]` numbering path.

#### Question Explinations

##### Q1 - `What is the minimum real shape of an editor viewport above graph documents?`

This asks:
- what object or state bundle represents one spaghetti editor surface once editors are no longer identical to the graph itself

Why it matters:
- `SP - Phase 9B` needs a real viewport concept, not just a graph plus a floating panel

Humanized summary:
- what is one editor viewport made of

##### Q2 - `How should the Browser coordinate multiple open editor viewports without owning graph truth itself?`

This asks:
- how the Browser should manage open/focused graph editors while still leaving graph truth in the graph documents

Why it matters:
- the Browser should coordinate viewports, not collapse back into owning the graphs as UI-only entries

Humanized summary:
- how does the Browser manage open graph editors without becoming the graph owner

##### Q3 - `How should focus work when more than one graph editor viewport is open?`

This asks:
- what the simple focus rule is when the user has multiple spaghetti editors open at once

Why it matters:
- focus behavior will shape Browser/editor coordination and command routing

Humanized summary:
- if many graph editors are open, which one counts as the one the user is working in

##### Q4 - `How should graph switching inside one editor viewport work?`

This asks:
- how one editor viewport should swap from one graph document to another without changing graph ownership or graph activity in the project

Why it matters:
- you already defined that a graph can stay active in the project even when an editor stops viewing it

Humanized summary:
- what happens when one editor switches from Graph A to Graph B

##### Q5 - `What editor/window state belongs to the viewport layer in SP - Phase 9B?`

This asks:
- what state should live on the editor viewport itself once we separate graph truth from editor behavior

Why it matters:
- this phase needs to define viewport behavior without pushing that state back into the graph document

Humanized summary:
- what belongs to the editor window itself instead of the graph

##### Q6 - `What current one-window or one-mode assumptions must change for SP - Phase 9B to count as real?`

This asks:
- which current app/editor assumptions still force spaghetti into one app-wide window or one mode toggle

Why it matters:
- this keeps the phase grounded in the current `AppShell` / `SpaghettiPanel` / toolbar behavior

Humanized summary:
- what current app behavior still assumes there can only be one spaghetti editor

##### Q7 - `What should stay out of SP - Phase 9B so it does not sprawl into full Browser UI and later project ownership work?`

This asks:
- where the multi-editor foundation phase should stop

Why it matters:
- this phase could easily sprawl into full Browser UI, graph output hierarchy, or project-file behavior if the boundary is not explicit

Humanized summary:
- what belongs in multi-editor foundation now, and what should wait

#### Decision 3 Checlist

- [x] Q1 - What is the minimum real shape of an `editor viewport` above graph documents?
- [x] Q2 - How should the `Browser` coordinate multiple open editor viewports without owning graph truth itself?
- [x] Q3 - How should focus work when more than one graph editor viewport is open?
- [x] Q4 - How should graph switching inside one editor viewport work?
- [x] Q5 - What editor/window state belongs to the viewport layer in `SP - Phase 9B`?
- [x] Q6 - What current one-window or one-mode assumptions must change for `SP - Phase 9B` to count as real?
- [x] Q7 - What should stay out of `SP - Phase 9B` so it does not sprawl into full Browser UI and later project ownership work?

#### [x] Q1 - What is the minimum real shape of an `editor viewport` above graph documents?

##### [72] 2026-03-09 11:20 - Resolved Q1 - An `Editor Viewport` Should Be A Small UI/Workspace Object That Points At One Graph Document And Owns Local Window State

Recommended minimum real shape:

- `editorViewportId`
- `graphDocumentId`
- `isFocused`
- `windowMode`
- optional layout state:
  - `position`
  - `size`

Recommended `windowMode` support:

- `collapsed`
- `essentials`
- `expanded`
- `separateWindow`

Working rule:

- the `Graph Document` owns authored graph truth
- the `Editor Viewport` owns how one editor surface is currently looking at that graph

What the viewport should not own:

- graph nodes
- graph edges
- graph params / values
- compile/build truth
- project ownership

Important clarification:

- node display mode and viewport window mode are different layers
- graph-owned node mode:
  - `collapsed`
  - `essentials`
  - `expanded`
- viewport-owned window mode:
  - `collapsed`
  - `essentials`
  - `expanded`
  - `separateWindow`

##### [73] 2026-03-09 11:28 - Q1 Clarification - The Spaghetti Editor Needs Both A True `collapsed` Row Mode And A `meatball editor view`

Refined viewport behavior:

- the spaghetti editor should have a fully collapsed state that reduces to one toolbar-style row like:
  - `Spaghetti Editor`
- this is the true `collapsed` / minimized state

- above that, the editor should also have a compact focused mode called:
  - `meatball editor view`
- in that mode:
  - it stays visible in the app
  - it can focus on one node at a time
  - there is a `next` action so the canvas auto-zooms or jumps to the next node in sequence

Refined window-mode read:

- `collapsed`
  - one row only
  - behaves more like the `Preview Mode` or `Parts List` collapsed buttons
- `meatball editor view`
  - compact working editor mode
  - good for one-node-at-a-time focus
- `expanded`
  - larger in-app editor view
- `separateWindow`
  - popped-out browser window

Top-of-editor window controls:

- when the editor is open in-app, the header should expose actions to move between:
  - `meatball editor view`
  - `expanded`
  - `separateWindow`
- full toolbar-row collapse should remain available as a deeper minimize action

Why this matters:

- it separates:
  - true minimize/collapse
  - compact focused editing
- and it keeps viewport-mode ownership clearly in the editor viewport layer rather than the graph-document layer

#### [x] Q2 - How should the `Browser` coordinate multiple open editor viewports without owning graph truth itself?

##### [76] 2026-03-09 11:47 - Resolved Q2 - The `Browser` Should Coordinate Open Editor Viewports As A Manager, While `Graph Document` Remains The Authored Truth

Locked ownership split:

- `Project File`
  - owns graph documents
- `Browser`
  - coordinates open editor viewports
  - acts as the project navigation and viewport-management surface
- `Editor Viewport`
  - shows one graph at a time
- `Graph Document`
  - remains the authored source of truth

What the `Browser` should coordinate:

- which graph documents are currently open in viewports
- which viewport is focused
- which viewport is embedded versus `separateWindow`
- open / close / swap / pop-out actions

What the `Browser` should not own:

- graph nodes / edges / params
- compile/build truth
- graph-authored content

Working rule:

- `Browser` = viewport manager and project navigation surface
- `Graph Document` = authored truth

#### [x] Q3 - How should focus work when more than one graph editor viewport is open?

##### [77] 2026-03-09 11:56 - Resolved Q3 - Focus Should Follow The Last Clicked Editor Viewport, Raise It In Z-Order, And Keep Only One `meatball editor view` Alive At A Time

Locked focus rule:

- focus should follow the last editor viewport the user clicked in
- mouse hover alone should not change focus

What focus should do:

- the clicked editor viewport becomes focused
- that viewport should move to the top of the in-app editor stack / z-order
- the `Browser` should reflect that focused viewport
- keyboard commands and viewport-specific actions should route there

`meatball editor view` rule:

- many normal editor viewports can exist
- but only one `meatball editor view` can exist at a time

If the user requests `meatball editor view` on another graph:

- the existing `meatball editor view` should switch/focus to the new graph
- it should not spawn a second overlapping `meatball editor view`

Why this is strong:

- it avoids overlap/hover ambiguity
- it keeps command routing simple
- it keeps the compact focused mode from becoming cluttered

#### [x] Q4 - How should graph switching inside one editor viewport work?

##### [78] 2026-03-09 12:02 - Resolved Q4 - One Editor Viewport Should Switch Graphs Through A Graph Dropdown In The Spaghetti Editor Header

Locked interaction:

- the first item in the spaghetti editor header should be the focused graph name
- that item should act as a dropdown
- when the user clicks it, it should show a list of available graphs to pick from

Working rule:

- selecting a graph from that dropdown switches what this editor viewport is showing
- it does not transfer graph ownership to the viewport
- it does not deactivate the previously viewed graph in the project

UI clarification:

- this graph dropdown should replace the old `Collapse Header`-style first item in the current header layout
- the header becomes the natural surface for:
  - graph switching
  - viewport mode changes
  - quick graph-level convenience actions

#### [x] Q5 - What editor/window state belongs to the viewport layer in `SP - Phase 9B`?

##### [79] 2026-03-09 12:07 - Resolved Q5 - The Viewport Layer Should Own Window Behavior, Local UI Presentation, And Current Graph Binding, While The Graph Owns Authored Truth

Viewport-owned state should include:

- `editorViewportId`
- `graphDocumentId`
- `isFocused`
- `windowMode`
  - `collapsed`
  - `meatball editor view`
  - `expanded`
  - `separateWindow`
- in-app position
- in-app size
- z-order
- local header / toolbar visibility state if needed later
- local node-focus state for `meatball editor view`
  - current focused node id
  - or current node traversal index

What should not live on the viewport:

- graph nodes
- graph edges
- graph params / values
- graph `generate` state
- graph output declarations
- compile/build memory
- Browser/project ownership

Working rule:

- viewport state:
  - window behavior
  - local UI presentation
  - current graph binding
- graph state:
  - authored graph truth

#### [x] Q6 - What current one-window or one-mode assumptions must change for `SP - Phase 9B` to count as real?

##### [80] 2026-03-09 12:16 - Resolved Q6 - `SP - Phase 9B` Must Break The One-Window, One-Panel, And One-Mode Spaghetti Assumptions

Current code seams:

- `src/app/AppShell.tsx`
  - `showSpaghettiFloating = inputMode === 'spaghetti'`
  - spaghetti is still treated as one global app mode
  - only one floating spaghetti window exists

- `src/app/components/Toolbar.tsx`
  - there is still one global `inputMode: legacy | spaghetti`
  - the current `Preview Mode` area still exposes the legacy/spaghetti toggle at the app level

- `src/app/panels/SpaghettiPanel.tsx`
  - still behaves like one global spaghetti editor surface
  - one header collapse state
  - one debug drawer state
  - one compile/build control area
  - one sample-graph load surface

- `src/app/store/useAppStore.ts`
  - still carries one global `inputMode`
  - and one global spaghetti compile/build memory path

What must change:

1. `inputMode === 'spaghetti'` should stop being the thing that creates "the spaghetti editor"
- spaghetti editors should become viewport instances, not one app-wide mode panel

2. one floating spaghetti window in `AppShell`
- must become a viewport manager model that can support more than one editor viewport

3. one `SpaghettiPanel`
- should stop being the only spaghetti editor surface in the app
- its local UI state should become viewport-specific if reused

4. one global compile/build surface for spaghetti
- actions must route through the focused viewport / chosen graph document, not one global spaghetti panel

Preview-mode seam to plan out:

- the current `Preview Mode` panel still contains the app-global `legacy / spaghetti` toggle
- that reads like an old mode-switch seam that should likely be removed or redesigned later
- the app should move away from:
  - one app-wide `legacy` versus `spaghetti` editor mode
- and toward:
  - Browser/project/viewports coordinating graph editors directly

What can stay for now:

- one app shell
- one viewer shell
- one Browser shell
- one worker lifecycle

Working rule:

- `SP - Phase 9B` must stop treating spaghetti as one app-wide mode and one floating panel
- it should instead treat spaghetti as one or more editor viewports managed by the Browser and focused by user interaction

#### [x] Q7 - What should stay out of `SP - Phase 9B` so it does not sprawl into full Browser UI and later project ownership work?

##### [81] 2026-03-09 12:24 - Resolved Q7 - Keep `SP - Phase 9B` As One Plan With A Clear Immediate Scope And A Clear Deferred List

Recommended immediate `SP - Phase 9B` scope:

- define the minimum editor viewport object
- lock:
  - `editorViewportId`
  - `graphDocumentId`
  - `windowMode`
  - focus
  - z-order
- define the one-viewport-focus rule
- keep only one `meatball editor view` alive at a time
- make the editor header graph-name dropdown the graph switch surface
- let the Browser coordinate open/focused editor viewports
- keep `Browser` as viewport manager, not graph owner
- stop treating spaghetti as one app-wide mode
- stop treating one floating spaghetti panel as the only editor surface
- begin moving current panel/window state toward viewport-local ownership

Things we should include now in `SP - Phase 9B`:

- editor viewport identity and binding
- focus and z-order rules
- single `meatball editor view` rule
- graph switching inside one viewport
- Browser coordination of open/focused viewports
- breaking the old `legacy / spaghetti` one-mode seam

Things we should save for later:

- full Browser UI polish and rich graph-list interactions
- per-row Browser controls, materials, and context menus
- full output hierarchy and Browser-facing project content structure
- build bars and deeper build-control surfaces
- full workspace presentation systems beyond the minimum viewport modes
- advanced control-viz / Jake integration

Roadmap placement for later work:

- save for `Lane [2]`:
  - Browser-facing graph/content hierarchy
  - richer Browser controls
  - reference/material/visibility workspace behavior
- save for `Lane [3]`:
  - workspace presentation systems
  - build sequencing/build bars
  - deeper control-surface systems

Working scope rule:

- `SP - Phase 9B` should make multiple editor viewports real and Browser-coordinated
- it should not try to finish the full Browser experience or the later control/build/workspace systems

#### Session 3 - Future Feature Captures

##### [74] 2026-03-09 11:42 - Achievement 7 Note - The Spaghetti Editor Likely Needs A Stable Internal Layout With Header, Hidden Toolbar, And Canvas

Working UI direction:

- the spaghetti editor likely has a stable internal structure:
  - `header`
  - hidden toolbar
  - canvas
- the current canvas-level controls should probably move upward into the editor toolbar later to keep the canvas cleaner

Current read:

- this is an important viewport-layout decision
- but it is not part of the minimum identity shape of the editor viewport itself

##### [75] 2026-03-09 11:42 - Achievement 7 Note - The Focused Graph Row In The Editor Should Mirror Browser `view` / `generate` Controls

Working UI direction:

- next to the focused graph name in the editor, there should be quick controls such as an eyeball/toggle surface
- those controls should stay synced with the Browser rather than inventing a second owner

Recommended ownership read:

- `generate on/off`
  - graph/project-owned state
- `view on/off`
  - Browser/viewer-owned state

Current read:

- the editor should expose these controls for convenience
- but the Browser remains the coordinating surface that keeps them coherent

#### Session 3 - Working Notes

## `Achievement 8` - [82] 2026-03-09 - `[1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation` Planning Start

### 2026-03-09 12:38 - Session 4 Focus - What We Need To Achieve In `[1.1C] SP - Phase 9C`

This planning batch is for:

- `SP - Phase 9C - Graph-Local Compile / Preview Preparation`

This phase should prepare the compile/build/preview side so the new graph-document and multi-editor foundations do not still collapse back into one global graph/output path.

The job here is to make graph-local compile/build memory and preview preparation real enough to hand off cleanly into `SP - Phase 10`.

### [0] 2026-03-09 12:38 - Current Decision Checklist - `[1.1C] SP - Phase 9C - Graph-Local Compile / Preview Preparation`

#### Decision 4 Checlist Notes

- Use this as the active Session 4 checklist for `SP - Phase 9C`.
- Keep the old question as `~` if it gets replaced by a better `QN.1`.
- If you say `update QN`, update both:
  - the top `Decision 4 Checlist`
  - and the matching `#### QN` section below
- Substantive timestamped entries in this file should continue the absolute `[N]` numbering path.

#### Question Explinations

##### Q1 - `What compile/build memory should become graph-local in SP - Phase 9C before full SP - Phase 10 routing work?`

This asks:
- what build-oriented state should stop living in one global spaghetti bucket before the later graph-aware routing phase fully expands it

Why it matters:
- `SP - Phase 9C` is the bridge between graph documents and later graph-aware build routing

Humanized summary:
- what spaghetti build memory should each graph keep for itself

##### Q2 - `What preview-preparation state should become graph-local before the Browser-facing output structure is finished?`

This asks:
- what preview/output preparation belongs to each graph before the later Browser-facing hierarchy work lands

Why it matters:
- this phase should prepare graph-local preview ownership without trying to finish later output structure

Humanized summary:
- what preview prep belongs to one graph before the Browser output tree is built

##### Q3 - `How should graph-local compile/build memory relate to one shared worker and one shared viewer shell?`

This asks:
- how to keep graph-local state while still sharing the app-wide worker and viewer shells

Why it matters:
- this is where we keep the app from swinging too far toward one extreme:
  - one global spaghetti bucket
  - or totally fragmented graph-specific app shells

Humanized summary:
- how do graphs keep their own build memory while the app still has one worker and one viewer

##### Q4 - `What current global compile/build seams must be softened in SP - Phase 9C before SP - Phase 10 takes over?`

This asks:
- which current global compile/build assumptions should be reduced in this bridge phase even if full routing work lands later in `SP - Phase 10`

Why it matters:
- this keeps `9C` grounded in the real app/store seams instead of only describing later ideal behavior

Humanized summary:
- what global spaghetti build assumptions should we start loosening now

##### Q5 - `What should stay out of SP - Phase 9C so it does not collapse into full SP - Phase 10 or AS work?`

This asks:
- where the preview-preparation bridge phase should stop

Why it matters:
- this phase can easily sprawl into:
  - full graph-aware routing
  - full Browser-facing output hierarchy
  - richer object/assembly/part structure

Humanized summary:
- what belongs in the bridge phase, and what should wait for the next phases

#### Decision 4 Checlist

- [x] Q1 - What compile/build memory should become graph-local in `SP - Phase 9C` before full `SP - Phase 10` routing work?
- [x] Q2 - What preview-preparation state should become graph-local before the Browser-facing output structure is finished?
- [x] Q3 - How should graph-local compile/build memory relate to one shared worker and one shared viewer shell?
- [x] Q4 - What current global compile/build seams must be softened in `SP - Phase 9C` before `SP - Phase 10` takes over?
- [x] Q5 - What should stay out of `SP - Phase 9C` so it does not collapse into full `SP - Phase 10` or `AS` work?

#### [x] Q1 - What compile/build memory should become graph-local in `SP - Phase 9C` before full `SP - Phase 10` routing work?

##### [83] 2026-03-09 12:47 - Resolved Q1 - Each Graph Should Own Its Own Compile/Build Memory Bundle Before Full `SP - Phase 10` Routing Work

Recommended graph-local compile/build memory bundle:

- `lastCompileResult`
- `previousBuildInputs`
- `pendingChangedParamIds`
- `pendingStatsPartKeys`
- `pendingInstances`
- `lastBuildSeq` for that graph, if useful

Why these first:

- they are already spaghetti-specific
- they are currently the main one-bucket state that would clash across graphs
- moving them graph-local gives each graph its own build memory without forcing all of `SP - Phase 10` yet

Working rule:

- in `SP - Phase 9C`, every graph should keep its own compile/build memory instead of sharing one global spaghetti compile/build memory bucket

What not to force yet:

- full viewer ownership per graph
- full output hierarchy
- final Browser-facing structure
- final worker routing model

#### [x] Q2 - What preview-preparation state should become graph-local before the Browser-facing output structure is finished?

##### [84] 2026-03-09 12:52 - Resolved Q2 - Each Graph Should Own Its Own Preview-Preparation Bundle Before The Browser-Facing Output Structure Is Finished

Recommended graph-local preview-preparation state:

- graph-local output declaration state
- graph-local preview candidate list
- graph-local source/build part identity mapping
- graph-local build-stats-ready part keys
- graph-local "what this graph is trying to preview" memory

Working rule:

- each graph should prepare its own previewable outputs and preview identity locally
- the richer Browser-facing hierarchy that consumes those outputs can come later

What this phase is not trying to finish:

- full `Component / Assembly / Object / Part` Browser structure
- final Browser nesting
- later material/reference/UI controls

#### [x] Q3 - How should graph-local compile/build memory relate to one shared worker and one shared viewer shell?

##### [85] 2026-03-09 12:58 - Resolved Q3 - Keep One Shared Worker And One Shared Viewer Shell, But Route Graph-Local Memory Through Them By Graph Identity

Locked direction:

- shared app services can stay shared:
  - one worker lifecycle
  - one viewer shell
- graph-local state should still become graph-local:
  - compile/build memory bundle per graph
  - preview-preparation bundle per graph

Working rule:

- the worker does not need to become "one worker per graph"
- the viewer does not need to become "one viewer per graph"
- but requests, results, and preview-prep state should stay tagged/routed by `graphDocumentId`

Why this is strong:

- it avoids over-fragmenting the app
- it keeps infrastructure simpler
- it still prevents graphs from stomping each other's state

#### [x] Q4 - What current global compile/build seams must be softened in `SP - Phase 9C` before `SP - Phase 10` takes over?

##### [86] 2026-03-09 13:05 - Resolved Q4 - `SP - Phase 9C` Should Start Softening The Global Spaghetti Compile/Build/Preview-Prep Bucket Without Trying To Finish Full Routing Yet

Seams to soften now:

- global spaghetti compile/build memory in `useAppStore.ts`
  - `spaghettiLastCompile`
  - `spaghettiPreviousBuildInputs`
  - `spaghettiPendingChangedParamIds`
  - `spaghettiPendingStatsPartKeys`
  - `spaghettiPendingInstances`

- current single-graph compile/build calls in `useAppStore.ts`
  - `compileSpaghetti()`
  - `requestSpaghettiBuild()`
  - these still implicitly operate on one global graph

- build wiring assumptions in `bootstrapBuildWiring.ts`
  - it still reads one global spaghetti pending-state path based on `inputMode === 'spaghetti'`

- viewer-prep path in `ViewerHost.tsx`
  - still pulls one `useSpaghettiStore.graph` and one preview path

Working rule:

- in `9C`, start replacing one global spaghetti compile/build/preview-prep bucket with graph-keyed state
- leave the full dispatcher/worker routing replacement for `SP - Phase 10`

Do not lose these deferred pieces:

- full per-graph request/result routing in dispatcher/worker
- final Browser-facing output hierarchy
- final viewer ownership model
- later object/assembly output structure

Why this boundary is useful:

- `9C` becomes a real bridge phase
- it prepares the current app for graph-local memory without trying to finish the whole routing architecture too early

Implementation consequence:

- shared service accepts graph-tagged request
  - `graphDocumentId`
  - `buildSeq` / `requestId`

- shared service returns graph-tagged result
  - `graphDocumentId`
  - `buildSeq` / `requestId`

Then the mutable runtime buckets that currently behave like one global spaghetti path should move toward graph-keyed state such as:

- `buildStateByGraphId[graphDocumentId]`
- `previewPrepByGraphId[graphDocumentId]`
- `lastCompileByGraphId[graphDocumentId]`

Working read:

- the shared worker/viewer can stay singleton services
- the state they process should become graph-scoped

#### [x] Q5 - What should stay out of `SP - Phase 9C` so it does not collapse into full `SP - Phase 10` or `AS` work?

##### [87] 2026-03-09 13:20 - Resolved Q5 - Keep `SP - Phase 9C` As A Bridge Phase Only

`SP - Phase 9C` should include:

- graph-local compile/build memory bundle
- graph-local preview-prep bundle
- first softening of global spaghetti compile/build seams
- enough graph-keyed state to hand off cleanly into `SP - Phase 10`

`SP - Phase 9C` should stay out of:

- full dispatcher/worker routing redesign
- full Browser-facing output hierarchy
- final `Component / Assembly / Object / Part` output structure
- Browser UI work
- project ownership work
- build bars / build-control UX
- rich viewer reference/material systems

Working lane map:

- `9C = bridge`
- `10 = routing`
- `AS = output structure`
- `SP 11 = Browser surface`

#### Session 4 - Future Feature Captures

#### Session 4 - Working Notes

# 10 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for raw planning notes before implementation work.
- Current planning focus:
  - `[2.1E]` dockable left panels and in-app floating panel shell
  - the remaining left-dock cleanup tail
  - ownership alignment with the golden rule
- Primary source docs for this planning pass:
  - `docs/Human-Plans/roadmap/roadmap.md`
  - `docs/Human-Plans/Architecture/Engine-Architecture.md`
  - `docs/Human-Plans/Architecture/System-Map.md`
  - `docs/Phase-Plans/Tasks/Future/02.1E - VR-SP - Dockable Left Panels And In-App Floating Panel Shell.md`
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.

## Doc Body

## Session 1 Notes

##### [152] 2026-03-15 23:16 - `[2.1E]` Should Be Planned As Left-Dock Shell Completion, Not As More Browser-Only Polish

Current framing:

- `[2.1E]` should stay about finishing one believable left-dock panel shell system
- it should not drift back into:
  - Browser-only popout tweaks
  - generic workspace framework planning
  - detached window planning

Working definition:

- this lane owns:
  - docked versus floating presentation for the first supported left panels
  - drag-out
  - drag-back
  - dock previews
  - left-dock slot behavior
- this lane does not own:
  - graph/editor truth
  - worker/build truth
  - viewer rendering truth

##### [153] 2026-03-15 23:16 - Golden Rule Read For `[2.1E]`

Most important ownership read:

- the app owns truth for workspace shell behavior
- `AppShell` should own:
  - panel presentation state
  - dock targets
  - preview geometry
  - docked/floating transitions
  - collapse persistence for dockable left panels

What should not drift into `useSpaghettiStore`:

- left-dock slot geometry
- shell preview state
- generic panel movement policy
- Browser/meatball dock contracts

Safe rule:

- `useSpaghettiStore` can keep editor/document state
- `AppShell` should keep left-panel shell behavior

##### [154] 2026-03-15 23:16 - Remaining `[2.1E]` Tail Looks Small But Important

Current read after the shipped cleanup wave:

- the main fixed-slot dock shell is already real
- the remaining work looks like polish and ownership hardening, not a new architecture phase

Most likely remaining finish line:

- preserve collapsed state across docked and floating transitions
- make dock-preview push/downstream movement feel intentional instead of overlay-like
- re-check any spawn/dock behavior that still feels more store-owned than shell-owned

Planning consequence:

- `[2.1E]` should probably close with one focused implementation pass
- after that, the roadmap should treat the left-dock shell as a finished base rather than an open-ended UI cleanup bucket

##### [155] 2026-03-15 23:40 - Browser Row Interaction Cleanup Likely Belongs Back In `[2.1]`

New read after re-checking the current Browser row behavior:

- the current graph row still mixes:
  - selection
  - editor-routing
  - reveal/build/save status
- if the Browser should become a calmer project/content tree, the main row click behavior needs to separate:
  - viewport inspection
  - authoring jump

Recommended direction:

- single click on the row/loading bar should:
  - select the row
  - highlight the corresponding object/result in the model viewport
  - avoid immediately opening or swapping the editor
- double click on the row/loading bar should:
  - open the owning graph if needed
  - focus the relevant node in the graph when the row is a deeper child with a stable source mapping

Important row-family rule:

- graph-document rows and content rows should not necessarily behave identically
- likely split:
  - graph-document row:
    - stays more document-oriented
    - may keep lighter document/open behavior
  - content/object/part row:
    - becomes inspection-first
    - single click = viewport highlight
    - double click = authoring jump

Why this likely belongs back in `[2.1]`:

- this is still Browser interaction cleanup
- it changes how Browser rows behave as a workspace/navigation surface
- it should be settled before deeper `[2.2]` Browser-facing content structure inherits the wrong click language

Plain-English rule:

- one click should answer:
  - `show me this`
- two clicks should answer:
  - `take me to where this is made`

Carry-forward consequence:

- `[2.2]` can then reuse the row-shell/status-bar language without also inheriting editor-heavy single-click behavior by accident

##### [156] 2026-03-16 00:11 - `[2.2]` Should Start With File-Level Assemblies And Output-Published Components, While Nested Assemblies Wait For Later Browser Reorganization

Current structure decision:

- the Browser `Content` tree should not treat:
  - graph count
  - merged mesh count
  - viewer artifact count
  as the assembly structure automatically
- instead, first-pass hierarchy should be:
  - `Project`
  - `Assembly` per project file
  - `Component` per published output node
  - later inside the component:
    - `Object`
    - `Part`

Recommended first-pass ownership:

- the app/project owns:
  - the top-level project content tree
  - one file-level assembly container for each project file brought into the project
- the output node owns:
  - the published component payload
  - the labels and stable source ids that describe what object/part structure is inside that component
- the Browser should not have to infer component/object/part grouping from one anonymous final mesh

Practical first-pass rule:

- one output node should publish one `Component`
- that component may contain:
  - one or more `Object`s
  - each object containing one or more `Part`s
- multiple graphs in the same file should usually contribute multiple components into that file's assembly

Important future requirement:

- later, users will need real nested assembly organization
- example:
  - the user creates their own multi-component assembly inside one project
  - then imports a friend's assembly into that same project
  - now both assemblies need to live under a parent assembly so the user can export the whole project as one larger assembly

What waits for later:

- parent assemblies above file-level assemblies
- sub-assemblies inside assemblies
- drag/drop reorganization of assemblies/components inside the Browser
- explicit Browser-side assembly management tools for moving imported/user-made assemblies around

Why this split is important:

- `[2.2]` can become implementable now with:
  - truthful file-level assemblies
  - output-published components
  - later object/part children
- without prematurely taking on:
  - nested assembly authoring
  - drag/drop Browser restructuring
  - export-parent assembly management

Plain-English rule:

- now:
  - `1 project file = 1 assembly container`
  - `1 output node = 1 published component`
- later:
  - users can organize multiple assemblies under a parent assembly and rearrange them directly in the Browser

##### [157] 2026-03-16 00:14 - Next Suggested Task Should Be Making `[2.2]` Implement-Ready Through The Output Publish Contract

Recommended immediate next task:

- stop doing more Browser-shell cleanup for the moment
- define the first real `[2.2]` output publish contract so the Browser can read truthful content structure from the graph/runtime boundary

Why this should come next:

- `[155]` already cleaned up the first-pass Browser row interaction language
- the main missing piece is no longer row behavior
- the main missing piece is the structure contract for what an output node actually publishes into project content

What this task should define:

- the output node should publish a structured content payload, not just one final anonymous mesh
- first-pass publish structure should support:
  - `Component`
  - `Object`
  - `Part`
- each published payload should retain:
  - stable ids
  - labels
  - source node ids
  - viewer/highlight keys
  - enough structure for Browser rows to stop guessing what belongs where

First-pass contract target:

- `Project`
  - `Assembly` per project file
    - `Component` per output node
      - `Object`
        - `Part`

Important scope guard:

- do not take on sub-assemblies yet
- do not take on Browser drag/drop reorganization yet
- do not take on export-parent assembly management yet
- just make the output-publish payload and project-content model real enough that `[2.2]` can be implemented cleanly

Plain-English next step:

- define exactly what the output node sends to the app so the Browser can show real components, objects, and parts instead of reconstructing structure from final mesh results

##### [158] 2026-03-16 00:19 - `[2.2]` Output Publish Contract Should Become Implement-Ready As A Structured Publish Layer Above The Existing Slot Surface

Implementation-ready summary:

- keep the existing `10C` graph-owned `GraphOutputSurface` as the minimal slot/runtime seam
- do not rewrite `10C` to hold final Browser hierarchy truth directly
- add the next structured publish layer above it so `[2.2]` can stop treating:
  - slot rows
  - accepted artifact keys
  - and project components
  as if they are the final same thing

Current code truth that this plan must respect:

- `OutputPreview` params are still only:
  - `slots`
  - `nextSlotIndex`
- `GraphOutputSurface` entries still only carry:
  - `outputEntryId`
  - `slotId`
  - `sourceNodeId`
  - `label`
  - `state`
  - `acceptedArtifactKey`
- `12B` project content is still only:
  - `Assembly Root -> Component`
- current shared build contracts still expose flat `PartArtifact[]`, not a finished object/assembly bundle contract

Recommended first implementation cut:

- keep target hierarchy as:
  - `Project`
  - `Assembly`
  - `Component`
  - `Object`
  - `Part`
- but ship the first `[2.2]` pass as:
  - authored output-node component/object metadata
  - project-owned `Assembly -> Component -> Object` runtime records
  - Browser rendering for those rows
  - with `Part` remaining a thin derived leaf until source/build contracts can expose object-internal part membership honestly

Why this cut is safer:

- it aligns with current code instead of pretending the repo already has object-bundle build artifacts
- it makes the output node the owner of publish structure
- it avoids making `BrowserPanel` or selectors guess object structure from final mesh results
- it preserves room for the later true `Part` layer once the publish/build seam can carry it cleanly

Recommended authored contract change:

- evolve the current `OutputPreview` node into a structured publish node without losing slot compatibility
- keep the existing slot list, but add authored publish metadata above it

Suggested first-pass node params:

```ts
type OutputPreviewObjectParams = {
  objectId: string
  label: string
  slotId: string
  orderIndex: number
}

type OutputPreviewParams = {
  componentLabel: string
  objects: OutputPreviewObjectParams[]
  slots: Array<{ slotId: string }>
  nextSlotIndex: number
}
```

First-pass rules for that authored contract:

- one output node publishes one `Component`
- `componentLabel` is node-level authored publish metadata
- each declared `object` maps to exactly one output `slotId` in first pass
- `object` order is explicit and authored
- if a slot exists without an authored object entry, treat it as:
  - unpublished for Browser object structure
  - but still valid for low-level slot/runtime debugging until migration is complete

Important scope guard for first pass:

- do not support one object spanning multiple slots yet
- do not support one output node publishing multiple components yet
- do not support graph-authored assemblies yet
- do not support sub-assemblies or Browser drag/drop organization yet

Recommended derived runtime layer:

- keep `GraphOutputSurface` unchanged for slot/runtime truth
- add a new derived graph-owned selector/model above it, for example:

```ts
type GraphPublishedComponentSurface = {
  graphDocumentId: string
  componentLabel: string
  objects: Array<{
    objectId: string
    label: string
    outputEntryId: string
    slotId: string
    sourceNodeId: string
    acceptedArtifactKey: string | null
    state: 'empty' | 'unresolved' | 'resolved'
  }>
}
```

Rules:

- this layer is still graph-owned derived truth
- it is derived from:
  - authored output-node params
  - `GraphOutputSurface`
- it is the first place where graph publication becomes:
  - `Component`
  - `Object`
  instead of only `slot`

Recommended project-content lift:

- evolve `ProjectContentState` from:
  - `assembliesById`
  - `componentsById`
- into:
  - `assembliesById`
  - `componentsById`
  - `objectsById`

Suggested first-pass project records:

```ts
type ProjectObjectRecord = {
  objectId: string
  parentComponentId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  sourceNodeId: string
  label: string
  resolutionState: 'resolved' | 'unresolved'
  highlightViewerKey: string | null
}
```

Lift rules:

- one project file owns one file-level `Assembly`
- one output node lift becomes one project `Component`
- each authored object entry under that output node lifts into one project `Object`
- `Object.highlightViewerKey` should use the resolved slot/viewer identity in first pass
- `Component` remains the double-click authoring bridge back to the graph
- `Object` should later become the main content row for single-click viewport inspection

Recommended Browser first-pass read surface:

- `Content`
  - `Assembly`
    - `Component`
      - `Object`

Interaction carry-forward:

- `Component` rows can keep the current single-click inspect / double-click authoring-jump rule
- `Object` rows should inherit that same rule once they exist
- `Assembly` remains structural/selection-only in this cut

What stays explicitly deferred:

- true Browser `Part` rows until publish/build contracts can expose object-internal part membership honestly
- graph-authored assembly publication
- parent assemblies above file-level assemblies
- Browser drag/drop reorganization
- export-parent assembly workflows

Likely files for the first execution pass:

- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.tsx`
- relevant selector/store/panel tests

Proof bar for calling the first pass complete:

- output node can author:
  - one component label
  - one or more object rows mapped to slots
- graph-owned selectors can derive one structured published component surface above `GraphOutputSurface`
- project content can lift:
  - file assembly
  - component
  - object
- Browser `Content` can render:
  - `Assembly -> Component -> Object`
- Browser selection/highlight/open behavior works on the new object rows without breaking current component/published-output behavior

Plain-English implementation rule:

- do not replace the current slot seam
- build the first real `Component -> Object` publish contract above it
- then let the later `Part` layer arrive once the artifact/publish seam can represent object-internal parts honestly

##### [159] Browser content-row polish should split into `tree structure now` and `row chrome later`

Suggested timing:

- do the `Content` tree polish next as part of the active `[2.2]` wave:
  - `Assembly Root` gets a local `+/-` expand toggle
  - `Component` rows get `+/-` when they own child `Object` rows
  - `Object` rows render as indented leaf rows under their parent
  - Browser owns local expand/collapse state for `Content`, just like it already does for `Graph Documents`
- defer graph-row chrome on `Content` rows until later:
  - `Live / Release / Manual`
  - graph-style loading bars
  - graph save button
  - graph `...` menu shell

Reasoning:

- `[158]` made the Browser `Content` hierarchy real enough that tree controls now improve usability immediately
- those graph-row controls are still document-authoring controls, not clearly content-tree controls
- adding them to `Assembly` / `Component` / `Object` rows too early would blur `project content` versus `graph document`

Recommended first follow-up cut:

- make `Content` behave like a real collapsible tree first
- keep `Assembly` mostly structural
- keep `Component` and `Object` interaction-focused
- revisit whether `Component` rows want richer status/body chrome only after the meaning of content-row status is defined under the later `[2.3]` Browser surface work

##### [160] `Content` should stop speaking in graph language because `Graph Documents` already owns that surface

Direction:

- do not show `graphs` as the main identity of rows in the `Content` section
- `Content` should read as project/model structure only:
  - `Assembly`
  - `Component`
  - `Object`
  - later `Part`
- `Graph Documents` already owns:
  - graph identity
  - build policy
  - save/export
  - editor open/swap behavior
  - build-state chrome

Implication for Browser wording:

- remove `Graph X` as the primary meta language from `Content` rows
- component/object rows should use content-native labels and hierarchy first
- if graph origin still needs to be visible, keep it secondary and quiet:
  - subtle source hint
  - small badge
  - tooltip
  - or only as part of double-click/jump behavior

Reasoning:

- right now `1 graph -> 1 published component` creates an apparent duplicate between `Graph Documents` and `Content`
- that duplicate should be reduced in presentation, not by merging the two ownership models
- `Graph Document` and published `Component` are still different truths:
  - one is authoring/runtime/document state
  - one is published project content

Recommendation:

- keep the underlying ownership split
- make the `Content` area read like content, not like a second graph list
- carry graph linkage through interaction and subtle source traceability, not through loud row naming

##### [161] Implementation-ready follow-up: make `Content` a real collapsible tree with content-native row language

Summary:

- carry this as the immediate `[2.2]` Browser follow-up after `[158]`
- goal is to make `Content` behave like a proper local tree:
  - collapsible parents
  - indented children
  - content-first row wording
- do **not** pull graph-row chrome into this pass

Scope:

- add Browser-local expand/collapse state for the `Content` tree
- `Assembly Root` should render a `+/-` toggle when it owns at least one child row
- `Component` rows should render a `+/-` toggle when they own child `Object` rows
- `Object` rows stay leaf rows with no expand toggle
- `Object` rows should render visually nested beneath their parent `Component`
- `Component` rows should render visually nested beneath `Assembly Root`
- preserve current single-click inspect / double-click authoring-jump behavior for `Component` and `Object`
- keep `Assembly Root` structural/selection-only

Row-language cleanup in the same pass:

- remove loud `Graph X` meta from `Content` rows
- prefer content-first wording:
  - `Assembly Root`
  - `Published Component` or authored component label
  - authored object label
- if graph origin still needs to be visible, keep it subtle only:
  - optional quiet suffix
  - tooltip
  - or no visible source text in this pass

Implementation shape:

- `BrowserPanel` should own:
  - local `expandedContentRowIds`
  - click handlers for expanding/collapsing `assembly` and `component` rows
- `selectBrowserTreeRows` should derive:
  - parent/child row nesting for `contentRows`
  - `isExpandable`
  - `isExpanded`
  - depth/indent metadata or explicit hierarchical row ordering
- `useAppStore` should keep exposing flat project content records
- the Browser selector/panel layer should own presentation nesting, not the store

Recommended render rule:

- store remains flat:
  - `assembly`
  - `component`
  - `object`
- selector builds the visible tree order:
  - `assembly`
    - `component`
      - `object`
- hidden descendants are filtered by `expandedContentRowIds`

Non-goals for this cut:

- no `Live / Release / Manual` on content rows
- no content-row save button
- no content-row `...` menu shell
- no graph-style loading bars on `Content` rows
- no drag/drop reorganization
- no nested assemblies beyond the current root assembly
- no new content ownership model changes

Likely files:

- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/selectBrowserTreeRows.test.ts`
- maybe small `Content` row CSS adjustments in `src/app/theme/v15Theme.css`

Proof bar:

- `Assembly Root` can collapse/expand its component children
- `Component` can collapse/expand its object children
- `Object` rows render indented under the right component
- collapsed parents hide descendants deterministically
- Browser selection remains local and stable while expanding/collapsing
- single-click/double-click behavior for `Component` / `Object` still works
- `Content` no longer reads like a second graph list

##### [162] Suggested tree-guide pass: draw hierarchy lines in the Browser as selector-owned presentation metadata

Goal:

- visually connect `Assembly Root -> Component -> Object` with tree guide lines
- strengthen the new hierarchy without changing ownership or content records

Recommended approach:

- keep this as Browser-only presentation work
- do **not** move tree-guide ownership into `useAppStore`
- extend `selectBrowserTreeRows` with minimal tree-guide metadata derived from visible row order, for example:
  - `isLastSibling`
  - `hasChildren`
  - maybe an `ancestorGuideColumns` array or equivalent
- let `BrowserPanel` / row-shell rendering use that metadata to draw:
  - vertical continuation lines
  - elbow connectors into child rows
  - correct stop points for last-child rows

Why this way:

- the store should keep owning flat content truth
- the Browser selector already owns visible tree order, depth, and collapse filtering
- tree connector lines depend on visible siblings and collapsed state, which are presentation concerns

Render direction:

- use the existing left tree gutter / lead area
- draw guides behind the row affordances instead of mixing them into content labels
- `Assembly Root` should show the main vertical trunk when expanded
- `Component` rows should show elbows from the assembly trunk
- `Object` rows should show elbows from their parent component branch

Non-goals:

- no new content data model
- no drag/drop tree lines yet
- no graph-row connector lines in `Graph Documents`
- no attempt to make this a generic tree framework beyond current `Content`

##### [163] Suggested content-row naming polish: use content-native component fallback labels and source-traceability meta

Goal:

- make `Content` rows read less like implementation output language and more like actual project structure
- keep graph traceability available without turning `Content` into a second graph list

Recommended label/meta rule:

- `Component` primary label:
  - keep the authored output-node component label if the user renamed it
  - otherwise use a fallback label like `Component 1`, `Component 2`, etc.
- `Component` secondary meta:
  - replace weak count meta like `1 Object` with quiet source traceability such as `Graph 1`
- `Object` rows:
  - keep object/native labels as the primary identity
  - do not add loud graph wording unless traceability is missing elsewhere

Why this way:

- `Published Component` is implementation language, not user-facing content language
- object counts are less useful than source traceability right now
- `Graph Documents` already owns graph identity and document controls, so `Content` should stay content-first while still answering “where did this come from?”

Suggested implementation shape:

- change the default fallback component label generation from `Published Component` to numbered `Component N`
- keep authored custom component labels untouched
- change component-row meta in `useAppStore` / Browser selectors to use source graph label instead of object-count meta
- if needed later, object count can return in a quieter tertiary/hover treatment rather than the main meta slot

Non-goals:

- no graph-row controls on `Content`
- no renaming of graph documents themselves
- no extra chips/buttons/tooltips in this first naming pass unless the plain meta treatment is still too ambiguous

##### [164] Suggested content-row naming polish: use content-native object fallback labels

Goal:

- finish the first-pass content naming cleanup so object rows stop reading like slot/runtime ids
- keep `Content` user-facing and structural instead of exposing `s001`-style implementation labels by default

Recommended label/meta rule:

- `Object` primary label:
  - keep the authored output-node object label if the user renamed it
  - otherwise use a fallback label like `Object 1`, `Object 2`, etc., in component-local order
- `Object` secondary meta:
  - keep resolved rows quiet by default
  - keep unresolved state as small secondary text like `Unresolved`
  - do not move graph/source wording into the main object identity

Why this way:

- default slot ids like `s001` are useful internally but poor Browser-facing content labels
- `Assembly 1` and `Component 1` already moved the tree toward content-native naming, so object rows should follow the same rule
- source traceability is already covered better at the component/meta layer than in the object primary label

Suggested implementation shape:

- change the default fallback object label generation from slot-id-like labels to numbered `Object N`
- keep authored custom object labels untouched
- derive numbering from visible published object order inside each component, not from global app state
- leave object-row secondary meta as:
  - `''` when resolved
  - `Unresolved` when unresolved

Non-goals:

- no new object/part data model
- no object build bars yet
- no graph-source suffixes in the main object label
- no change to single-click/double-click behavior

##### [165] Implementation-ready content-row status pass: add passive right-side readiness state to `Assembly`, `Component`, and unresolved `Object` rows

Goal:

- start giving the `Content` tree a truthful status surface without dragging graph-document controls into it
- use the right side of content rows for calm readiness/build-state language instead of more subtext under the main label

Scope:

- `Assembly` row:
  - show aggregate content readiness on the right
- `Component` row:
  - show published readiness derived from its child objects on the right
- `Object` row:
  - stay quiet when resolved
  - show `Unresolved` on the right when unresolved

Recommended status rule:

- `Assembly`:
  - `Unresolved` if any descendant component/object is unresolved
  - `Ready` if it has at least one component and all visible published content is resolved
  - `''` if the assembly has no content yet
- `Component`:
  - `Unresolved` if any child object is unresolved
  - `Ready` if it has one or more child objects and all are resolved
  - `Linked` / `Unresolved Link` can stay for receive-link rows until a later pass decides whether they should join the same status vocabulary
- `Object`:
  - `''` when resolved
  - `Unresolved` when unresolved

Important rendering rule:

- move this status to a right-aligned passive slot in the content row shell
- do not overload the current main `meta` text slot with both source traceability and readiness at the same time
- for first pass:
  - keep `Component` source traceability like `Graph 1` in the existing secondary text slot
  - put `Ready` / `Unresolved` in a new right-side status slot

Suggested implementation shape:

- extend `ProjectContentBrowserRowVm` with optional passive status fields, for example:
  - `statusLabel: string`
  - maybe `statusTone: 'quiet' | 'ready' | 'warning'`
- derive those values in `useAppStore` / `selectCurrentProjectContentBrowserRows`
- let `selectBrowserTreeRows` carry the status through without inventing new content truth
- render the new right-side status span in `BrowserPanel.tsx`
- add small content-row CSS in `v15Theme.css` so:
  - status sits on the far right
  - resolved/ready is subtle
  - unresolved is more visible but still calmer than graph build bars

Non-goals:

- no `Live / Release / Manual`
- no content-row save button
- no content-row `...` menu
- no graph-style loading bars in this pass
- no new build-policy semantics for `Content`
- no assembly/component export controls yet

Proof bar:

- `Assembly 1` shows no status when content is empty
- `Assembly 1` shows `Ready` when all content is resolved
- `Assembly 1` shows `Unresolved` when any descendant is unresolved
- published `Component` rows show `Ready` / `Unresolved` on the right while still keeping source traceability like `Graph 1` in their normal meta slot
- resolved `Object` rows stay visually quiet
- unresolved `Object` rows show `Unresolved` on the right
- graph-document rows remain unchanged

##### [166] Reset question list: what must be decided before `Content` becomes a row-level build surface

Use this as the focused design-question list before more Browser/content implementation.

#### Row Meaning

1. What does each `Content` row fundamentally represent in the target ParaHook content model?
- `Root Assembly`
- `Sub Assembly`
- `Component`
- `Object`
- `Part`
- later `Sub Part`

Clarification:

- this question means the app's own long-term Browser/content truth
- not just the temporary first-pass implementation
- and not necessarily a 1:1 mirror of a final `.step` export file
- the exported assembly structure should eventually align with this model, but the Browser/content hierarchy should first be defined as ParaHook's honest internal content model

Current first-pass read:

- in basic terms, `Component` is the publish unit produced by one graph's `OutputPreview`
- current simplest rule:
  - `1 graph`
  - `1 OutputPreview`
  - `1 published Component`

Future graph-output vision to keep open:

- one graph may later publish multiple `Component`s
- an `Object` may later be allowed to live directly under an `Assembly` with no `Component` wrapper
- those are valid future expansions, but they should not blur the current first-pass rule while row-level build policy and rebuild semantics are still being defined

2. Is every `Content` row really intended to be a build/loading bar, or are some rows still structural containers with lighter aggregate bars?

3. What is the one-sentence meaning of the bar fill for each row type?

Suggested answer:

- the bar fill represents the row's current execution/readiness state for that build chunk
- `Live / Release / Manual` is a separate control state, not the bar fill itself

Practical reading:

- empty / partial / full fill = how current that row's built chunk is
- color / animation = unresolved vs building vs ready
- policy chip/control = how that row should behave in the future (`Live / Release / Manual`)

Important distinction:

- `policy` = rule
- `fill/state` = current result

#### Row Interaction

4. Does single click on a `Content` row now mean `rebuild this row` instead of `inspect/highlight`?

Suggested answer:

- yes, single click on a `Content` row should now mean `rebuild this row` for that build chunk
- inspect/highlight should move out of the primary row click and into the row's right-click menu
- this keeps `Content` execution-first while still preserving a secondary inspect/reveal path

5. If row click becomes rebuild, where does inspect/highlight move?

Suggested answer:

- into the row's right-click menu on the fill-bar area
- do not keep inspect/highlight as the primary visible click behavior once `Content` becomes a build-chunk control surface

6. What should double click on a `Content` row do in the new model?

Suggested answer:

- remove double click from the `Content` row interaction model
- do not rely on double click for graph-jump behavior once the primary row click becomes rebuild
- instead, add an explicit `view in graph` action/button for the row kinds that have a meaningful graph source

Row-kind rule:

- `Part` / `Object`: `view in graph` should open the owning graph and focus the source node when that source mapping exists
- `Component`: `view in graph` should open the owning graph, but does not need to focus a specific source node in the first pass
- `Assembly`: no `view in graph` action for now, because an assembly may span multiple graphs; later this could evolve into an `open all related graphs` behavior once multi-graph editor opening is real

7. Should `Graph Documents` keep the current document/open/build role while `Content` becomes the published-entity execution surface?

Suggested answer:

- yes, keep the split
- `Graph Documents` should remain the authoring/document surface:
  - open graph
  - edit graph
  - save/export graph
  - graph-level document/build tools
- `Content` should become the published-entity execution surface:
  - rebuild chunks
  - control `Live / Release / Manual`
  - control build sequence
  - later material/color and other chunk-level controls
- both surfaces may show status, but they should not collapse into the same role

#### Policy Model

8. Should every row default to `Live` on load with no explicit user setup?

Suggested answer:

- yes, every `Content` row should default to `Live` on load with no explicit user setup
- this keeps first-time publish behavior automatic instead of making the user press a separate build button after wiring output

9. Are `Live / Release / Manual` true per-row policies for:
- `Assembly`
- `Component`
- `Object`
- later `Part`

Suggested answer:

- yes, these are true per-row policies
- the user should have direct control over every row's build mode
- first-pass target:
  - `Assembly`
  - `Component`
  - `Object`
- later:
  - `Part`

10. Are parent rows allowed to push policy downward into all descendants in one action?

Suggested answer:

- yes, a parent row should be allowed to push its selected policy downward into all descendants in one action

11. Are child rows allowed to override parent policy afterward?

Suggested answer:

- yes, child rows should be allowed to override parent policy afterward
- parent push-down is a convenience action, not a permanent lock

12. When children disagree, what does the parent show?
- mixed?
- strongest child wins?
- weakest child wins?
- parent stays explicit while children show local override?

Suggested answer:

- the parent should show `Mixed` when children disagree
- do not collapse the parent back to strongest/weakest-child-wins behavior

13. If a parent is switched to `Live`, does that always overwrite all child policies immediately?

Suggested answer:

- yes, switching a parent to `Live` should immediately overwrite all child policies in that branch at that moment
- after that, children may still be changed back to `Release` or `Manual` individually

14. After a child is changed back to `Release` or `Manual`, should the parent show:
- `Live`
- `Mixed`
- aggregate derived state only

Suggested answer:

- the parent should show `Mixed`
- this keeps the parent honest once descendants no longer share one policy

#### Rebuild Semantics

15. What exactly does `rebuild this row` mean for an `Assembly`?
- rebuild all descendants?
- rebuild only stale descendants?
- force everything regardless of policy?

Suggested answer:

- rebuilding an `Assembly` means rebuilding that row and its entire descendant branch
- the parent row should later support two execution strategies for its children:
  - rebuild children all at once
  - rebuild children in sequence, one by one, using the current `Content` list order
- this execution strategy should be user-controlled at the parent row

16. What exactly does `rebuild this row` mean for a `Component`?
- rerun the owning graph publication for that component?
- rebuild only that published entity?

Suggested answer:

- rebuilding a `Component` means rebuilding that component row and its child rows for that branch
- it should follow the same parent execution-strategy idea when the component owns multiple child objects:
  - all at once
  - or in sequence by visible child order

17. What exactly does `rebuild this row` mean for an `Object`?
- rerun the owning graph and target only the object output?
- rebuild the whole component but focus the object row?

Suggested answer:

- rebuilding an `Object` means rebuilding that object row as its own build chunk
- later, when `Part` rows are real, object rebuild should also include that object's child parts

18. Can two sibling rows build independently, or is row-level rebuild really graph-scoped under the hood?

Suggested answer:

- two sibling rows should be able to build independently
- row-level rebuild should become real engine/runtime truth, not just a graph-scoped UI abstraction
- this is the whole point of the `Content` build-chunk model:
  - `Object 1` can rebuild by itself
  - `Object 2` does not rebuild unless needed or explicitly targeted
- long-range goal:
  - each sibling row is a real independent build chunk in the worker/runtime
  - row bars and row rebuild controls should be honest reflections of that chunk truth

#### Ownership / Truth

19. What new stable published ids do we need so worker/runtime truth can be attached to rows honestly?
- `assemblyId`
- `componentId`
- `objectId`
- later `partId`

Suggested answer:

- use one stable id family per entity type:
  - `assemblyId`
  - `componentId`
  - `objectId`
  - later `partId`
- do not introduce separate id types for root/sub variants
- `Root Assembly` and `Sub Assembly` should both use `assemblyId`
- `Part` and later `Sub Part` should both use `partId`
- root vs sub should come from hierarchy/relationship fields, not from different id kinds

Why this matters:

- it keeps the worker/runtime contract simpler
- it avoids creating extra entity types just for tree position
- it lets the same entity move between root/sub positions later without changing its id family

20. Where should row policy truth live?
- project/app state?
- graph-owned publish contract?
- worker/runtime?

Suggested answer:

- row policy truth should live in project/app state
- `Live / Release / Manual` is a user-controlled workspace/project behavior, so it should belong to the assembled `Content` tree rather than to one graph's authored geometry contract
- it also should not live in worker/runtime, because the worker should execute policy, not own the user's policy decisions

Suggested ownership split:

- `graph-owned publish contract` owns:
  - what entities exist
  - their labels
  - their hierarchy contributions
  - source graph/node mappings
  - stable published ids
- `project/app state` owns:
  - row policy (`Live / Release / Manual`)
  - parent/child policy inheritance
  - child overrides
  - `SEQ / ALL`
  - row order / build sequence
  - later organization choices
- `worker/runtime` owns:
  - current execution truth
  - actual rebuild execution
  - revision acceptance

21. Where should row execution truth live?
- building
- ready
- unresolved
- stale
- last built revision

Suggested answer:

- row execution truth should live in worker/runtime
- the worker/runtime should own:
  - `building`
  - `ready`
  - `unresolved`
  - `stale`
  - current executing chunk
  - last accepted build revision
- this is actual execution truth, not user preference, so it should not be invented locally by the Browser or app selectors

Important distinction:

- `project/app state` owns what the user wants:
  - row policy
  - row order
  - parent/child execution mode
- `worker/runtime` owns what is actually happening and what build result was actually accepted
- the Browser should only render that worker/runtime-derived truth

Practical note:

- app/project may still keep a convenient mirrored summary for selector use
- but the source of truth should still be worker/runtime-derived rather than UI-invented

22. What revisions need to exist so bars are truthful instead of decorative?
- authored revision
- published revision
- accepted build revision

Suggested answer:

- we need at least three revisions per published row/build chunk:
  - `authoredRevision`
  - `publishedRevision`
  - `acceptedBuildRevision`

What each means:

- `authoredRevision`
  - increments when the source graph/object/chunk definition changes
  - answers: has the authored source changed?
- `publishedRevision`
  - increments when the graph/output publish contract for that row changes
  - answers: has the published chunk definition changed?
- `acceptedBuildRevision`
  - records the last revision the worker/runtime successfully built and accepted for that row
  - answers: what build is actually current in runtime?

Why this matters:

- if `acceptedBuildRevision === publishedRevision`, the row is current/ready
- if `publishedRevision > acceptedBuildRevision`, the row is stale / needs rebuild
- if source changed before publish/build caught up, `authoredRevision` explains that upstream authoring moved first

Practical note:

- the simplest first pass could start with:
  - `publishedRevision`
  - `acceptedBuildRevision`
- then add `authoredRevision` when upstream invalidation needs to be more precise

#### Browser Language

23. How do we keep `Content` from becoming a duplicate of `Graph Documents` once rows become bars with policies?

Suggested answer:

- keep `Content` and `Graph Documents` focused on different kinds of truth
- `Content` should remain the chunk-scoped execution surface:
  - what chunks exist
  - how each chunk should behave
  - rebuild this exact row/branch
- `Graph Documents` should become the graph-scoped authoring/impact surface:
  - what source graph changed
  - which downstream chunks from that graph now need rebuild
  - rebuild everything this graph is responsible for

Practical reading:

- `Content` = chunk tree with row-level policy and row-level rebuild
- `Graph Documents` = graph source plus rebuild-impact trace of affected downstream chunks

Important separation:

- do not duplicate the whole `Content` tree under `Graph Documents`
- show only the affected published chunks for that graph
- this keeps `Graph Documents` graph-scoped and `Content` chunk-scoped

24. Which row types should show source traceability like `Graph 1`, and where should that live once bars/policies are present?

Suggested answer:

- do not show source traceability like `Graph 1` on the primary row surface
- the main row should stay focused on:
  - build bar
  - row policy
  - rebuild action
  - later core row controls
- hierarchy lines already carry the structural context the user needs in the tree
- graph/source access should stay in secondary actions instead:
  - `view in graph`
  - right-click menu
  - later tooltip only if truly needed

Important separation:

- `Graph Documents` remains the main visible graph-identity surface
- `Content` should stay visually clean and build-focused rather than turning back into a graph-labeled list

End product description:

- in the end product, a `Content` row should read as a clean build chunk, not as a graph-labeled document row
- the user should understand structure from:
  - hierarchy lines
  - indentation
  - row placement in the tree
- the user should access graph/source context through explicit secondary actions rather than row text clutter

Likely phase steps:

- first: keep visible graph/source labels off the primary `Content` row surface
- next: provide explicit `view in graph` access for the row kinds that support it
- later: use the right-click menu for deeper source/reveal actions
- only add tooltip-level source hints later if the cleaner row still leaves a real usability gap

25. Should `Assembly` and `Component` both get full bars first, while `Object` stays lighter until part-level truth exists?

Suggested answer:

- yes, `Assembly` and `Component` should get the first full bars
- `Object` should stay lighter until part-level truth is real enough to make lower-level chunk behavior honest

Why this likely helps:

- `Assembly` and `Component` are the clearest parent execution/control rows
- they map most cleanly to:
  - branch rebuild
  - `Live / Release / Manual`
  - `SEQ / ALL`
  - aggregate child state
- `Object` is important, but its full bar semantics stay somewhat ambiguous until `Part` exists as the clearer lower-level independent chunk

End product description:

- in the end product, all major `Content` rows should still belong to the same build-row family
- but parent rows and leaf rows do not need to be identical in behavior
- `Assembly` / `Component` / later `Object` can act as stronger orchestration rows
- `Part` should likely become the clearest true leaf build row

Likely phase steps:

- first: full bars on `Assembly` and `Component`
- next: keep `Object` meaningful but lighter while part-level truth is still missing
- later: once `Part` rows are real, make `Object` a fuller parent/orchestration row and let `Part` become the true lower-level leaf bar

26. When do we introduce `Part` rows so row-level policies stop being ambiguous at the object/component layer?

Suggested answer:

- introduce `Part` rows when the worker/runtime can treat parts as real independent build chunks with stable ids and truthful revision/build state
- this should be the next lane's system goal, not just a later UI garnish

Minimum truth needed first:

- stable `partId`
- independent sibling part rebuild
- truthful worker/runtime part-level state:
  - `building`
  - `ready`
  - `unresolved`
  - `stale`
  - accepted build revision
- clear source mapping for `view in graph`
- `Object` can honestly act as the parent/orchestration row over child parts

Why this matters:

- until `Part` is real in the engine/runtime, `Object` is doing double duty as both a lower-level build row and a future parent row
- once `Part` exists, the model gets cleaner:
  - `Object` = parent/orchestration row
  - `Part` = true lower-level leaf build row

Likely phase steps:

- first: full bars on `Assembly` and `Component`
- next: keep `Object` real but lighter
- next lane: make part-level rebuild real in the publish contract and worker/runtime
- after that: add Browser `Part` rows and let `Object` become the clearer parent row over parts

##### [167] Locked direction: `Content` is a build-chunk hierarchy, not just a Browser tree

This is the clarified long-range direction after the vision reset.

Core answer:

- yes, every `Content` row is intended to become a real build/loading bar
- `Content` is not just a visual hierarchy
- `Content` is the user's build-chunk orchestration surface

What that means:

- each row is a build chunk the user can control separately:
  - `Root Assembly`
  - `Sub Assembly`
  - `Component`
  - `Object`
  - later `Part`
- list order in `Content` is also the intended build sequence
- this exists because the geometry engine is not reliable enough to force whole-model opaque rebuilds all the time

Policy direction:

- on load, all published rows default to `Live`
- if the user connects a wire into `OutputPreview`, the affected published content should update without requiring a separate top-level manual `Build` click
- every row can eventually carry:
  - `Live`
  - `Release`
  - `Manual`
- parent rows can push policy downward into children
- child overrides remain allowed afterward
- child overrides must be reflected back upward in the parent aggregate policy/state instead of being silently erased

Concrete example:

- `Object 1` is `Live`
- `Object 2` is `Release`
- if the parent `Component` is switched to `Live`, both children become `Live`
- if the user then switches `Object 2` back to `Release`, the parent must honor that mixed child state instead of pretending everything is uniformly `Live`

Row interaction direction:

- clicking a `Content` row should rebuild that row's build chunk
- this means `Content` is execution-first, while `Graph Documents` stays the authoring/document surface

Important consequence:

- the Browser `Content` tree should now be designed around:
  - chunk identity
  - build sequence
  - row policy
  - row rebuild targeting
  - truthful row-level build/update state
- not around passive selection-first tree behavior alone

##### [168] Future control note: each `Content` row may later need a separate material/color button

Future UX direction:

- besides build policy and build-state surfaces, each `Content` row may later need its own material/color control on the right side
- this would let the user color:
  - `Part`
  - `Object`
  - `Component`
  - maybe `Assembly`

Important separation:

- material/color is not the same system as build policy
- material/color is not the same system as build-state fill
- if this lands later, it should remain a separate button/control from:
  - `Live / Release / Manual`
  - row rebuild click
  - row loading/status bar

Why this matters:

- users will likely want to visually distinguish different build chunks in the viewport
- that is especially useful once the Browser/content tree becomes the main chunk-orchestration surface

Scope note:

- this is a later Browser/content control pass
- do not fold it into the first row-policy/build-surface implementation

##### [169] Future control note: every `Content` row should later have a right-click menu on the fill-bar area

Future UX direction:

- every `Content` row should later support a right-click menu
- the intended target is the row/fill-bar area itself, not just a tiny overflow button
- this menu should hold the deeper controls that cannot fit directly in the compact one-line row

Why this matters:

- the row needs to stay calm and compact
- but the user will still need access to more than:
  - row rebuild
  - row build policy
  - later material/color
- right click gives each build chunk a richer control surface without bloating the main row

Likely future menu content:

- row-specific build actions
- policy actions
- material/color actions
- reveal/inspect actions
- later export or organization actions when appropriate

Important separation:

- the main row should stay focused on:
  - build state bar
  - primary row interaction
  - a very small set of visible controls
- the right-click menu is the overflow surface for deeper row-specific features

Scope note:

- this is a later Browser/content interaction pass
- do not rely on the menu to define the core row interaction model
- the primary visible row language still has to make sense on its own

##### [170] Deferred idea: let `Graph Documents` later show a lightweight rebuild trace of affected content rows

Future UX direction:

- under `Graph Documents`, each graph may later show a lightweight trace of the published chunks that currently need rebuild because of that graph
- this should not become a second full `Content` tree
- it should stay a graph-side impact/readiness trace tied to the authoring source

Why this might help:

- `Content` will become the build-chunk execution surface
- `Graph Documents` will still be the authoring/document surface
- a lightweight trace under the graph can answer:
  - what changed here?
  - which published chunks are now affected?
  - what downstream objects/parts/components now need rebuild?

Suggested shape:

- keep the graph row itself compact
- later expose a short affected-entities list through:
  - row expand
  - or a right-click/overflow surface
- show only the impacted published rows, not the entire content hierarchy

Scope note:

- this is useful, but it does not look like a near-term priority
- do not pull it ahead of the row-policy / build-state / chunk-identity work that `Content` still needs first

##### [171] Future control note: parent `Content` rows may need a visible `SEQ / ALL` execution-mode button

Future UX direction:

- parent rows may later need a small explicit child-execution-mode button
- suggested labels:
  - `SEQ` = rebuild child rows one-by-one in current `Content` order
  - `ALL` = rebuild child rows together

Why this matters:

- this is not the same thing as `Live / Release / Manual`
- `Live / Release / Manual` controls when a row rebuilds
- `SEQ / ALL` controls how that parent row runs its children when that branch rebuilds
- because the engine may be sensitive to larger all-at-once rebuilds, this execution mode likely needs to be visible and easy to change

Suggested row scope:

- show this only on rows that actually own child build chunks:
  - `Root Assembly`
  - `Sub Assembly`
  - `Component`
- do not show it on leaf rows
- later, if `Object` rows own real `Part` children, they may also qualify

Suggested default:

- default to `SEQ` first if the engine/runtime remains more reliable with incremental child rebuilds

Scope note:

- this is a later Browser/content control pass
- do not fold it into the earliest row-policy/build-surface implementation until the rebuild execution model is more locked

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

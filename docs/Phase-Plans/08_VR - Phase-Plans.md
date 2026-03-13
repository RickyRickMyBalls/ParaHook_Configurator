# VR - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
8. 2026-03-12 14:45: Added a `2.1C` carry-forward note under the shared `[2.1]` `VR` planning surface so the family doc now explicitly treats the Fusion-style Browser cleanup as a real later subcut covering tree-first row presentation, moving heavy row commands into context menus, and making Browser section labels honest about current shell reality rather than burying that work in later `[3.3]` workspace-presentation polish
7. 2026-03-13 10:48: Locked the shared `[2.1]` `VR` questions and created the first dedicated future task doc, so the Browser/workspace side of `Lane [2.1]` now has a closed first-pass decision surface plus a plan-doc home for the next implementation-spec rewrite
6. 2026-03-13 10:41: Tightened the shared `[2.1]` `VR` suggested answers to capture the intended Browser row model directly, locking the idea that every Browser row should share one calm row anatomy with small right-aligned controls while single-click selection may drive presentation-only viewer emphasis without mutating editor focus or composition truth
5. 2026-03-13 10:34: Added first-pass suggested answers under the shared `[2.1]` `VR` questions so the Browser/workspace side of the lane now has a concrete proposal for the minimum visible workspace win, first row-interaction model, Browser selection/reveal behavior, local Browser UI state, and the out-of-scope line before deciding whether `[2.1]` needs subphases
4. 2026-03-13 10:28: Added a shared `Lane [2.1]` question surface in the `VR` family doc so the Browser/workspace interaction questions now have a proper planning home before any `2.1` split or task-doc setup, while leaving graph/editor coordination questions to the `SP` family doc
3. 2026-03-11 12:23: Renamed the future `VR - Phase 5` and `VR - Phase 6` placeholders to match the roadmap carry-forward, so the family doc now points at reference/project-view layers and later Browser controls/materials/rich visibility work instead of the older section-cut and multi-part placeholder wording
2. 2026-03-08 00:00: Rebuilt the completed `VR` phases from `docs/CHANGELOG.md`, promoting `VR - Phase 1` to reconstructed status and adding a real summary, grouped checklist, and file-footprint section while leaving the later viewer phases as future placeholders
1. 2026-03-08 00:00: Created this family phase-plan file in the settled canonical structure so the `VR` family now has a proper home for later changelog reconstruction, checklist buildout, and future viewer-layer planning

##### Purpose

This file is the simple phase-family history document for the `VR` prefix.

Use this file for:
- the canonical `VR` phase sequence
- a simple explanation of what each `VR` phase did
- understanding how viewer ownership evolved over time
- seeing where major viewer-facing work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `VR` Means

`VR` is the canonical viewer-layer prefix.

It is used when the main work is about:
- viewer ownership
- camera and framing behavior
- presentation-only controls
- visibility, materials, and gizmo behavior
- keeping viewer concerns separate from geometry execution

##### Format And Depth

Use this file as the planning and checklist home for canonical `VR` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - VR - Phase 1 - `Viewer Ownership` - Reconstructed

Human Summary: This locked viewer-only controls in the rebuilt app as rebuild-free presentation concerns, keeping camera, materials, and visibility on the viewer side instead of letting them leak into CAD behavior.

### Phase 1 Overview
#### Fold Hack 4

##### Phase Notes

This is a changelog-backed reconstructed phase recovered from the `Conv 8` restored restart band.

It is the foundational viewer-boundary lock for later workbench and presentation systems.

##### Phase Summary

Current understanding:
- viewer-only controls were locked as rebuild-free concerns
- camera, materials, and visibility stayed presentation behavior rather than CAD behavior
- the viewer boundary was kept clean for later workbench systems
- the worker remained focused on geometry and export artifacts instead of presentation state

##### Files Changed

- `src/viewer/Viewer.ts`
- `src/viewer/scene/SceneManager.ts`
- `src/app/viewerBridge.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/viewer/gizmo/`
- `src/viewer/controlViz/`

### Phase 1 CheckList

- [x] lock viewer-only controls as rebuild-free concerns
- [x] keep camera, materials, and visibility as presentation behavior instead of CAD behavior
- [x] preserve a clean viewer boundary for later workbench systems
- [x] keep the worker focused on geometry and export artifacts rather than presentation state

## [ ] - VR - Phase 2 - `Gizmo Parity Return`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 2 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `VR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should restore stronger gizmo parity and overlay interaction

### Phase 2 CheckList

- [ ] define the target gizmo parity return scope

## [ ] - VR - Phase 3 - `Scenes Return`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 3 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `VR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should restore richer scene atmosphere and preset behavior

### Phase 3 CheckList

- [ ] define the target scene return scope

## [ ] - VR - Phase 4 - `Radio Sampler Return`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 4 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `VR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should restore optional radio/sampler viewer personality features

### Phase 4 CheckList

- [ ] define the target radio/sampler return scope

## [ ] - VR - Phase 5 - `Reference Asset Workspace And Project View Layers`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 5 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `VR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should add Browser/viewer sections for external reference assets and project-view context layers
- it should keep references separate from `Project File` ownership in the first pass
- it should become the family home for project-versus-reference view layering after the earlier Browser and ownership foundations land

### Phase 5 CheckList

- [ ] define the reference-asset workspace surface
- [ ] keep references outside first-pass `Project File` ownership
- [ ] define project-versus-reference visibility separation
- [ ] leave stronger section-cut or deeper inspection behavior as later viewer follow-up if still needed

## [ ] - VR / SP - Lane [2.1] - `Browser Workspace Shell And Item Interaction`

Human Summary: Active planning surface. This shared lane section is where the Browser/workspace interaction questions should be clarified before `[2.1]` is split into subphases or turned into a dedicated task doc.

### Lane [2.1] Overview
#### Fold Hack 4

##### Phase Notes

- This is a shared lane-planning surface, not a new canonical numbered `VR` phase.
- Use the `VR` family doc for the Browser/workspace semantics owned mainly by viewer/workspace behavior.
- Keep graph/editor coordination questions in the matching `SP` family section.

##### Phase Summary

Current planning understanding:
- `[2.1]` should turn the first honest Browser tree into a usable workspace shell
- it should deepen Browser interaction without stealing final content hierarchy work from `[2.2]`
- it should deepen Browser/viewer coordination without stealing materials/visibility control work from `[2.5]`

### Lane [2.1] VR Question Surface
#### Fold Hack 5

##### Planning Notes

- Use this as the active question list for the `VR` side of `[2.1] VR / SP - Browser Workspace Shell And Item Interaction`.
- Keep these questions about Browser/workspace semantics, reveal behavior, and viewer-facing coordination.
- Do not use this section to answer graph/store ownership questions that belong in `GE` or `SP`.

##### Lane [2.1] VR Question CheckList

- [x] `2.1.VR.Q1` - What minimum Browser workspace behavior should make `[2.1]` count as real beyond the shipped Lane `[1]` Browser tree?
- [x] `2.1.VR.Q2` - What row interaction model belongs in the first `[2.1]` pass?
- [x] `2.1.VR.Q3` - How should Browser selection, reveal, and viewer emphasis relate in the first pass?
- [x] `2.1.VR.Q4` - What Browser/workspace UI state should exist as local interaction state rather than project/graph truth?
- [x] `2.1.VR.Q5` - What must stay out of `[2.1]` so it does not collapse into `[2.2]`, `[2.5]`, or `[3.3]`?

#### [x] `2.1.VR.Q1` - What minimum Browser workspace behavior should make `[2.1]` count as real beyond the shipped Lane `[1]` Browser tree?

##### Why This Matters

- Lane `[1]` already made the Browser structurally honest
- `[2.1]` needs a visible usability win, not just more row plumbing

Locked answer:
- `[2.1]` should count as real when the Browser stops feeling like a passive tree and becomes an active workspace shell for inspection and navigation
- the minimum visible win should be:
  - row-level interaction beyond open/focus
  - lightweight Browser selection state
  - a clear reveal/emphasis path into the shared viewer or active editor context
  - one consistent row model that makes every Browser item feel like part of the same workspace system
  - clearer separation between:
    - selected item
    - focused graph/editor
    - visible/emphasized viewer target
- first pass should not require:
  - final content hierarchy
  - build bars
  - materials/visibility control stacks
  - multi-window orchestration
- plain-English rule:
  - make the Browser feel like the workspace's interaction shell, not just its tree

#### [x] `2.1.VR.Q2` - What row interaction model belongs in the first `[2.1]` pass?

##### Why This Matters

- `[2.1]` likely needs more than open/focus plus expand/collapse
- but it should not absorb the full later context-menu and control stack yet

Locked answer:
- the first `[2.1]` row interaction model should add:
  - single-click select
  - double-click or primary-open behavior for open/focus where appropriate
  - lightweight inline actions only where they clarify navigation or reveal
  - hover/active affordances that make row state legible
- every Browser row should use the same core anatomy:
  - `[Expand] [Type Icon] [Name / Label] [State] [Controls]`
- row-model rule:
  - the row is the control surface
  - controls belong on the row, not below it
  - controls stay:
    - small
    - right-aligned
    - secondary to the hierarchy
- scalable first-pass examples:
  - graph row
    - `▶ [Graph Icon] Graph 1 [State] [Save] [Open]`
  - published output row
    - `[Output Icon] Output A [State] [Reveal]`
  - viewport row
    - `[Viewport Icon] Graph 1 Editor [State]`
- first pass should avoid:
  - heavy right-click context-menu systems
  - dense inline toolbars on every row
  - rename/delete/material/build controls on the same pass
- row interaction should stay tiered:
  - graph rows
    - navigation/open/focus + selection
  - published output rows
    - selection + reveal/emphasis behavior
- plain-English rule:
  - add a real interaction model, not a control explosion

#### [x] `2.1.VR.Q3` - How should Browser selection, reveal, and viewer emphasis relate in the first pass?

##### Why This Matters

- this is where Browser/workspace interaction can easily become incoherent
- the app needs one rule for how Browser rows point at what the viewer should emphasize without redefining ownership

Locked answer:
- Browser selection should be a workspace interaction state, not ownership truth
- selecting a row should:
  - identify the current workspace target
  - allow the viewer/editor to emphasize or reveal that target when possible
- clicking a graph row in the first `[2.1]` pass should:
  - create lightweight Browser selection
  - optionally request presentation-only viewer emphasis for that graph's currently resolved published outputs
- this emphasis must not:
  - automatically open or focus an editor viewport
  - retarget the shared viewer's composition source
  - change shared composition membership
  - mutate graph/project ownership truth
- reveal/emphasis should be:
  - derived from the selected Browser target plus current available graph/viewer context
  - not treated as a permanent ownership link
- first pass should use this rule:
  - Browser selection points at a target
  - viewer emphasis reveals that target when the viewer can represent it
  - focus and ownership remain separate
- first pass should not require:
  - full isolate/hide systems
  - viewer-picked-object round-trip selection parity
  - final object/part-level selection sync
- plain-English rule:
  - Browser selection points; viewer emphasis shows

#### [x] `2.1.VR.Q4` - What Browser/workspace UI state should exist as local interaction state rather than project/graph truth?

##### Why This Matters

- `[2.1]` will likely introduce temporary or convenience state
- that boundary needs to stay clear so Browser interaction does not become fake ownership

Locked answer:
- local Browser/workspace interaction state in `[2.1]` should include:
  - selected Browser row/item id
  - hover/active row affordances
  - panel-local expansion state where still useful
  - temporary reveal/emphasis requests
  - lightweight inspection-pane or details-panel selection state if introduced
- this should not become:
  - project-content ownership truth
  - graph publication truth
  - shared-viewer composition truth
  - durable project file data
- plain-English rule:
  - let the Browser own interaction context, not ownership facts

#### [x] `2.1.VR.Q5` - What must stay out of `[2.1]` so it does not collapse into `[2.2]`, `[2.5]`, or `[3.3]`?

##### Why This Matters

- `[2.1]` sits next to several tempting later clusters
- without a stop line, it can absorb output structure, rich row controls, or workspace-presentation polish too early

Locked answer:
- keep out of `[2.1]`:
  - final `Component / Object / Part` hierarchy decisions
  - richer Browser-facing output structure
  - material, visibility, and selectability control stacks
  - build bars and build-control surfaces
  - broader workspace-presentation mode systems
  - final context-menu/action density
- later homes:
  - `[2.2]`
    - deeper Browser-facing output/content structure
  - `[2.5]`
    - rich Browser controls, materials, and visibility
  - `[3.3]`
    - workspace presentation modes and broader layout polish
- plain-English rule:
  - `[2.1]` should make the Browser usable, not complete

### Lane [2.1] VR Carry-Forward - `2.1C Browser Cleanup`
#### Fold Hack 5

##### Carry-Forward Notes

- The newly visible Browser cleanup pressure after shipped `2.1A` / `2.1B` belongs in a later `2.1C` follow-up, not in `[3.3]`.
- This is still Browser/workspace interaction work because it changes how rows read and what Browser sections claim to mean.

##### Working Read

- `2.1C` should likely cover:
  - moving heavy row commands such as `Save`, `Open`, `Reveal`, `New Editor`, and `Swap Editor` out of the always-visible row face
  - using right-click or row options as the calmer command surface
  - making rows read more like:
    - chevron
    - icon/state
    - label
    - quiet meta
  - making the Browser feel more like one calm tree and less like stacked mini toolbars
- `2.1C` should also address section-label honesty where needed:
  - if `Open Viewports` is still listing stored viewport/session records rather than literal visible editor windows, the Browser should not overstate that current shell reality

##### Plain-English Rule

- `2.1C` should make the Browser look and read more honestly before later hierarchy and materials work deepen it again

## [ ] - VR - Phase 6 - `Browser Controls, Materials, And Rich Visibility`

Human Summary: Future placeholder. This phase is listed in the canonical setup ladder but has not been completed in the current tracked history.

### Phase 6 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `VR` phase.

##### Phase Summary

Current placeholder understanding:
- this phase should add the richer Browser/viewer item controls intentionally deferred out of the first `SP - Phase 11` Browser pass
- it should become the family home for per-row visibility/material/selectability controls and richer Browser-side row controls
- it should keep viewer/browser presentation controls separate from build-control and ownership work

### Phase 6 CheckList

- [ ] define the richer Browser/viewer row-control surface
- [ ] add per-row visibility, material, and selectability controls
- [ ] define richer Browser interactions and context-menu actions
- [ ] keep full project packaging and export concerns out of this viewer-layer phase

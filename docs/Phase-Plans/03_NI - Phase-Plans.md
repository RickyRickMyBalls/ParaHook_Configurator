# NI - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
3. 2026-03-08 00:00: Updated this family file to the settled family phase-plan layout by removing `Doc Body`, moving phase titles to `##`, adding the overview-side `Fold Hack 4` wrapper, and keeping checklist content directly visible under each phase checklist
2. 2026-03-07 17:01: Folded the legacy `NI ([011]-[020])` and `NI ([026]-[036])` checklist detail from `docs/TaskHistoryCompilation.md` into `NI - Phase 3` and `NI - Phase 4` so the family doc now holds that checklist truth directly
1. 2026-03-07 16:45: Built this file as the family-level `NI` phase doc using `docs/CHANGELOG.md` as the primary evidence source and the existing family docs as the structure template

##### Purpose

This file is the simple phase-family history document for the `NI` prefix.

Use this file for:
- the canonical `NI` phase sequence
- a simple explanation of what each `NI` phase did
- understanding how the node-interaction and node-surface UI work evolved over time
- seeing where major `NI` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `NI` Means

`NI` is the canonical node-interaction / node-surface UI prefix.

It is used when the main work is about:
- node-surface behavior
- node selection and drag interactions
- row and lane layout behavior
- wire/socket visual organization
- per-node interaction and display controls

##### Format And Depth

Use this file as the planning and checklist home for canonical `NI` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [?] - NI - Phase 1 - `Unconfirmed Early Node Interaction Gap` - Reconstructed

Human Summary: There is not enough current changelog evidence to lock a canonical `NI - Phase 1`, so this remains an explicit early gap rather than an invented completed phase.

### Phase 1 Overview
#### Fold Hack 4
##### Phase Notes

This is currently treated as a soft historical gap.

The current confirmed `NI` story in the changelog starts at `Phase 3`.

##### Phase Summary

Current understanding:
- a canonical `NI - Phase 1` is not currently evidenced in `docs/CHANGELOG.md`
- there may have been earlier node-interaction groundwork under another prefix or in pre-canonical history
- this section exists so the numbering gap stays explicit instead of being silently ignored

### Phase 1 CheckList

- [ ] search older history/docs for a confirmed canonical `NI - Phase 1`
- [ ] only convert this into a real completed phase if stronger evidence is found

## [?] - NI - Phase 2 - `Unconfirmed Early Node UI Gap` - Reconstructed

Human Summary: The changelog also does not currently prove a canonical `NI - Phase 2`, so this remains a second explicit early gap before the confirmed modern node-surface phases.

### Phase 2 Overview
#### Fold Hack 4
##### Phase Notes

This is also currently treated as a soft historical gap.

##### Phase Summary

Current understanding:
- the visible `NI` family in the current changelog begins at `Phase 3`
- `Phase 2` may never have existed as a canonical `NI` phase, or it may have been absorbed into earlier mixed history
- the explicit gap keeps the numbering honest until stronger evidence appears

### Phase 2 CheckList

- [ ] search older history/docs for a confirmed canonical `NI - Phase 2`
- [ ] only convert this into a real completed phase if stronger evidence is found

## [x] - NI - Phase 3 - `Baseplate And Node Surface UI`

Human Summary: This established the first strong modern `NI` cluster by shaping the baseplate and node-surface interaction model, especially around mode switching, headers, controls, and click behavior.

### Phase 3 Overview
#### Fold Hack 4
##### Phase Notes

This is the first confirmed canonical `NI` phase in the current changelog.

It appears as a broad cluster rather than a single isolated entry.

##### Files Changed

- [x] Canvas and node interaction files
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/canvas/NodeView.tsx`
  - [x] `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
- [x] Theme and support files
  - [x] `src/app/theme/v15Theme.css`
  - [x] `docs/listofchanges.md`

##### Phase Summary

Main outcomes:
- established the first real node-surface interaction model for the modern Spaghetti UI rather than leaving mode and click behavior as loose local affordances
- refined header-level mode switching, context-menu routing, and title/input/anchor click ownership into a more deliberate node interaction contract
- stabilized scrub-control placement and drag-related rerender behavior so the node surface felt more deterministic under active editing

##### Phase Sub-Phases

- canvas drag rerender guard
- anchor bar / input / title click mode behavior
- scrub control layout cleanup
- header mode picker and context-menu routing

### Phase 3 CheckList

- [x] Drag and rerender stability
  - [x] add the canvas-drag rerender guard
  - [x] keep hover validation and drop-state updates keyed to stable anchor identity instead of full pointer-move churn
- [x] Node mode and click routing
  - [x] force essentials mode through anchor-bar and input-click behaviors
  - [x] tighten chevron interaction guarding
  - [x] make title-click behavior deterministic
  - [x] improve header mode-picker and context-menu routing
  - [x] remove the title-click mode buttons
  - [x] implement mode transition behavior and interaction flow improvements
- [x] Scrub and control-surface cleanup
  - [x] restore scrub-toggle presets
  - [x] keep the scrub slider in a stable half-width layout
  - [x] align the scrub slider left edge
  - [x] move the `Drivers` label below scrub controls
  - [x] improve scrub/input interaction controls and contextual routing behavior
- [x] Early node-surface scaffolding
  - [x] add template scaffolding and node-template flagging setup

## [x] - NI - Phase 4 - `Node UI And Wire Layout Pass`

Human Summary: This was the big layout-and-polish pass for node UI and wires, tightening row sizing, lane widths, reorder controls, typed sockets, and several interaction regressions across the node surface.

### Phase 4 Overview
#### Fold Hack 4
##### Phase Notes

This is the largest visible `NI` phase cluster in the current changelog.

It reads as a sustained UI/layout cleanup pass rather than one narrow feature.

##### Files Changed

- [x] Canvas and wire presentation files
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/canvas/NodeView.tsx`
  - [x] `src/app/spaghetti/canvas/PortView.tsx`
  - [x] `src/app/spaghetti/canvas/WireLayer.tsx`
  - [x] `src/app/spaghetti/canvas/typeColors.ts`
- [x] Field and theme files
  - [x] `src/app/spaghetti/canvas/fields/NumberField.tsx`
  - [x] `src/app/spaghetti/canvas/fields/Vec2Field.tsx`
  - [x] `src/app/theme/v15Theme.css`
- [x] Change tracking
  - [x] `docs/listofchanges.md`

##### Phase Summary

Main outcomes:
- turned the node surface into a much more deliberate layout system by tightening sockets, lanes, widths, row heights, and section sizing across the full editor surface
- improved wire and socket presentation so typed endpoints, drag previews, and lane alignment read more consistently with the node layout model
- cleaned up several visible interaction regressions and toolbar/preset/reorder-control issues that made the node UI feel improvised

##### Phase Sub-Phases

- typed sockets and wires
- row height and lane-width cleanup
- preset picker / section width / toolbar visibility cleanup
- reorder arrow and reorder-button alignment pass

### Phase 4 CheckList

- [x] Typed sockets and wire visuals
  - [x] add typed sockets and wire support to the node UI pass
  - [x] move socket and wire coloring onto shared type-color mapping
  - [x] make drag-preview wire color follow the current source endpoint when determinable
  - [x] continue deterministic UI behavior alignment with the wiring model
- [x] Row and lane layout cleanup
  - [x] remove the output composite toggle from that layout model
  - [x] align section widths and lane widths
  - [x] tune output row height and minimum-height behavior
  - [x] fit preset picker width and expand/collapse visibility behavior
  - [x] improve node row layout, expand/collapse behavior, and toolbar UX polish
- [x] Reorder-control pass
  - [x] shrink row reorder arrow controls
  - [x] resize row reorder arrows
  - [x] pin row reorder arrows
  - [x] align output row reorder controls
  - [x] set reorder button size
  - [x] center reorder glyph
  - [x] clean up reorder arrow sizing, centering, and alignment
- [x] Toolbar and style polish
  - [x] improve driver-section styling and toolbar editor presentation
  - [x] add the per-node toolbar editor launcher and its supporting compact control treatment
  - [x] raise the wire layer above conflicting baseplate/output surfaces where needed
- [x] Regression cleanup
  - [x] fix right-side click regression

## [x] - NI - Phase 5 - `Modern Node Interaction Cleanup`

Human Summary: This modernized the node interaction model by tightening selection, drag behavior, per-node view modes, and section-collapse consistency so node interactions feel more deliberate and stable.

### Phase 5 Overview
#### Fold Hack 4
##### Phase Notes

This is the latest confirmed `NI` phase in the changelog.

##### Files Changed

- [x] Node interaction and mode files
  - [x] `src/app/spaghetti/canvas/NodeView.tsx`
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/canvas/rowViewMode.ts`
  - [x] `src/app/spaghetti/canvas/state/spaghettiUiStore.ts`
  - [x] `src/app/spaghetti/canvas/interactionModel.ts`
- [x] Verification files
  - [x] `src/app/spaghetti/canvas/NodeView.test.tsx`
  - [x] `src/app/spaghetti/canvas/rowViewMode.test.ts`
  - [x] `src/app/spaghetti/canvas/state/spaghettiUiStore.test.ts`
  - [x] `src/app/spaghetti/canvas/interactionModel.test.ts`
- [x] Feature-stack UI files
  - [x] `src/app/spaghetti/ui/FeatureStackView.tsx`
  - [x] `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - [x] `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

##### Phase Summary

Main outcomes:
- split node interaction ownership more cleanly between drag-capable header surfaces and selection-only body surfaces
- replaced canvas-global row mode with node-scoped mode ownership, giving each node a more stable independent interaction state
- normalized section-shell and collapse behavior so part-node sections follow one deterministic visibility rule instead of mixed local exceptions

##### Phase Sub-Phases

- node selection and drag model
- per-node view mode system
- node section collapse consistency

### Phase 5 CheckList

- [x] Node selection and drag model
  - [x] tighten the node selection and drag model
  - [x] reserve header hits for drag-capable selection and body hits for selection-only behavior
  - [x] prevent inside-node clicks from leaking into empty-canvas deselection
  - [x] add deterministic interaction-model tests for selection, drag gating, and canvas clearing
- [x] Per-node view mode system
  - [x] add node-scoped mode state with deterministic fallback to `essentials`
  - [x] replace the canvas-global row mode with node-owned mode state
  - [x] standardize the vocabulary to `collapsed | essentials | expanded`
  - [x] remove the remaining internal `everything` mode token
  - [x] make node context menus target the clicked node's stored mode
- [x] Section collapse consistency
  - [x] make `Drivers`, `Inputs`, `Feature Stack`, and `Outputs` share one deterministic body-visibility rule
  - [x] keep section toggles node-scoped and independent
  - [x] restore deterministic title-click mode cycling through the canonical NI mode vocabulary
  - [x] keep Feature Stack linked-input indicators status-only while real wireable inputs stay in `Inputs`

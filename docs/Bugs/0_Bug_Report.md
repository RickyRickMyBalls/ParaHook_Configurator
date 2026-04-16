# 0 - Bug Report

## Doc History
13. 2026-04-15 16:05: Added `Bug 20` for the Browser multi-select post-scroll jump/glitch where shift-range selection becomes unreliable after scrolling larger Browser lists, linking the new note into the master bug list with the current strongest read pointing at the Browser FLIP row animation layer
12. 2026-04-13 20:00:17: Added `Bug 19` for the remaining viewport behavior that may still diverge from the newly explicit `Worker 11` presentation contract, linking the new note into the master bug list as the current investigation surface for symptom-by-symptom checks across `auto / live`, `draft`, `final`, and branch-local visual stability after the recent Worker 10 viewport work
11. 2026-04-04 21:31: Added `Bug 12` for the still-open post-`Extrude-1A` viewport mismatch where `Geometry/Sketch -> Geometry/Extrude -> OutputPreview` now honors plane placement better but the blue body can still drift from the live sketch coordinates or stay behind while sketch origin/plane draft moves, and linked the new note into the master bug list as the active follow-on to the older extrude preview bug family
10. 2026-04-01 10:42: Added `Bug 11` for the new post-`Workspace 7.5-5` multi-floating `Spaghetti Editor` blank-screen regression, indexing the report that opening a second floating editor can still collapse the visible app into the same dark blank-screen family and linking the new note into the master bug list as the current follow-on to the earlier workspace blank-surface bugs
9. 2026-03-30 14:42: Added `Bug 10` to capture the stronger Console-versus-Spaghetti popup comparison finding, indexing the fact that Console popout already works as a single-owner child-window surface while Spaghetti popup still mixes workspace placement truth with legacy viewport/runtime truth, and linked the new note into the master bug list as the concrete repair-planning companion to `Bug 9`
8. 2026-03-30 13:54: Added `Bug 9` for the still-open post-`Workspace 5.2` detached Spaghetti Editor popup blank-surface regression, linked it to the `Workspace 5.2` split-brain surface-ownership seam, and recorded the full sequence of popup lifecycle, focus, layout, and render-ownership fixes already attempted so far
7. 2026-03-30 13:14: Added `Bug 8` for the new post-`Workspace 5.2` dark blue-black startup screen, linked it to the older unstable-selector black-screen family, and recorded the likely `SpaghettiWindowHost -> selectOrderedEditorViewports` direct hook subscription as the strongest current cause
6. 2026-03-23 13:50: Updated `Bug 7` to `[resolved?]` after the graph-native mesh-preview repair landed in code, keeping it visible in the short bug list while manual in-app verification of the irregular `Sketch Draw -> Geometry/Extrude -> OutputPreview` case still remains
1. 2026-03-06 16:21: Re-formatted the `## Bug List` entries so each line now reads in the order `Bug N`, then status key, then the note text
2. 2026-03-06 16:20: Added status tags to every entry in `## Bug List` so the short bug index now shows each bug's current state at a glance without changing the separate `Priority Order` section
3. 2026-03-06 16:19: Re-formatted `## Priority Order` to match the one-line bug-list style so the ranked bug order now reads as a clean bug index instead of plain numbered prose
4. 2026-03-06 16:18: Populated the new `## Bug List` section with one-line entries for the remaining current bugs so the file now has a short index above the detailed writeups
5. 2026-03-06 16:16: Created this file as the master bug report for the current known ParaHook problems, grouping the bugs already identified across the Spaghetti editor, preview pipeline, and related planning docs

## Purpose

This file is the running bug report for known problems in the current app.

Use it for:
- active bugs
- clear symptom summaries
- likely causes
- likely affected files or systems
- quick links back to the more detailed planning docs when they exist

This is not:
- the feature wishlist
- the phase roadmap
- the permanent changelog

It is the place to keep a clean list of real problems that still need to be fixed.

## Summary

The current bug picture is mostly concentrated in two areas:

- Spaghetti editor surface/layout instability
- preview-path visibility and trust

That means the next useful bug-fix work is not random cleanup.
It is mainly:
- fix the editor split/layout problems
- restore trust in the preview path
- make the graph easier to read when preview routing is active



## Related Planning Docs

- `/docs/Phases/UI_Window-Update_PhasePlan.md`
- `/docs/Plans/Wish-Features/Spaghetti-Editor/01.2 - Spaghetti Editor Tool Bar.md`
- `/docs/Plans/Wish-Features/Spaghetti-Editor/01.3 - Wires ui.md`
- `/docs/Phases/DBG_PhasePlan.md`

## Status Key

- `[open]` bug is still believed to exist
- `[investigating]` bug is real but the exact cause is still not confirmed
- `[planned]` bug is accepted and already has a clear future task/phase
- `[resolved?]` bug may already be fixed or partially fixed, but still needs verification



## Priority Order

Current practical order:

- `Bug 19` - Worker 11 viewport presentation contract gap still needs symptom-by-symptom classification
- `Bug 20` - Browser multi-select can glitch after scroll and make shift-range selection unreliable
- `Bug 11` - Workspace 7.5-5 opening a second floating Spaghetti editor can blank the app
- `Bug 12` - Geometry/Sketch extrude preview drifts from live sketch coordinates
- `Bug 9` - Workspace 5.2 detached Spaghetti Editor popup opens blank
- `Bug 10` - Workspace 5.2 detached Spaghetti popup still mixes ownership unlike Console
- `Bug 8` - Workspace 5.2 startup can collapse into a dark blue-black screen
- `Bug 7` - Geometry/Sketch profile does not extrude the real Sketch Draw shape
- `Bug 4` - Cube connected to OutputPreview does not render
- `Bug 1` - Spaghetti editor toolbar drag bar cannot move high enough
- `Bug 2` - Spaghetti editor toolbar drag bar is not aligned to the real canvas boundary
- `Bug 3` - Debug inspector drag bar gets stuck
- `Bug 5` - Spaghetti toolbar is fragmented across too many UI regions
- `Bug 6` - Wires lack clear render-path and active-flow visibility

## Bug List

- `Bug 1` - `[open]` - Spaghetti editor toolbar drag bar cannot move high enough
- `Bug 2` - `[open]` - Spaghetti editor toolbar drag bar is not aligned to the real canvas boundary
- `Bug 3` - `[open]` - Debug inspector drag bar gets stuck
- `Bug 4` - `[investigating]` - Cube connected to OutputPreview does not render
- `Bug 5` - `[planned]` - Spaghetti toolbar is fragmented across too many UI regions
- `Bug 6` - `[planned]` - Wires lack clear render-path and active-flow visibility
- `Bug 7` - `[resolved?]` - Geometry/Sketch profile loses the real Sketch Draw shape before Geometry/Extrude
- `Bug 8` - `[investigating]` - Workspace 5.2 startup can collapse into a dark blue-black screen
- `Bug 9` - `[investigating]` - Workspace 5.2 detached Spaghetti Editor popup opens but stays blank
- `Bug 10` - `[planned]` - Workspace 5.2 detached Spaghetti popup still mixes workspace and legacy viewport ownership unlike Console
- `Bug 11` - `[investigating]` - Workspace 7.5-5 opening a second floating Spaghetti editor can blank the app
- `Bug 12` - `[investigating]` - Geometry/Sketch extrude preview can still drift from live sketch coordinates or lag behind sketch origin / plane draft edits
- `Bug 19` - `[investigating]` - Live viewport behavior may still diverge from the explicit Worker 11 presentation contract across `auto / live`, `draft`, `final`, or branch-local visual stability
- `Bug 20` - `[investigating]` - Browser multi-select can jump or glitch after scroll and make post-scroll shift-range selection unreliable



## Current Known Bugs

### Bug 19 - Live viewport behavior may still diverge from the explicit Worker 11 presentation contract

Status:
- `[investigating]`

Problem:
- `Worker 11` now defines the intended viewport presentation contract explicitly across:
  - `auto / live`
  - `draft`
  - `final`
  - branch-local visual stability
- but live viewport behavior may still disagree with that contract in one or more states
- the current need is to compare each observed symptom directly against `Worker 11` before deciding whether the next fix belongs to already-shipped Worker 10 work, the still-open `Worker 10 Phase 3`, or a separate new bug

Strongest current likely cause:
- not yet one confirmed root cause
- the current strongest need is symptom classification against contract truth rather than another mixed patch
- likely remaining seams are still in the viewport presentation read-through band across:
  - selector-owned result-state truth
  - viewer-host layering
  - viewer layer rendering

Likely ownership:
- `WK`
- `VR`

Likely files:
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/viewer/Viewer.ts`

Related docs:
- `/docs/Bugs/19_2026-04-13_20-00-17_worker-11-viewport-presentation-contract-gap.md`
- `/docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 10 - Last-Committed Viewport Baseline During Live Preview.md`
- `/docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`

### Bug 12 - Geometry/Sketch extrude preview can still drift from live sketch coordinates

Status:
- `[investigating]`

Problem:
- after the recent `Extrude-1A` fixes, `Geometry/Sketch -> Geometry/Extrude -> OutputPreview` now behaves better on authored planes
- but the blue body can still appear offset from the cyan sketch outline
- and moving sketch origin / sketch-plane draft can move the overlay while the body remains behind

Strongest current likely cause:
- the live viewport appears to mix two authorities
- sketch overlay is live/session-driven
- graph mesh preview is still driven by accepted build outputs or otherwise non-draft-aware preview state
- viewer grouping/pivot anchoring remains a secondary seam worth ruling out, but no longer looks like the strongest first suspect

Likely ownership:
- `SP`
- `VR`

Likely files:
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/viewer/Viewer.ts`

Related docs:
- `/docs/Bugs/12_GeometrySketch-Extrude-OutputPreview-Authored-Coordinate-Drift.md`
- `/docs/Bugs/4_GeometrySketch-Extrude-Profile-Handoff-Regression.md`
- `/docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md`

### Bug 11 - Workspace 7.5-5 opening a second floating Spaghetti editor can blank the app

Status:
- `[investigating]`

Problem:
- after the recent `Workspace 7.5-5` multi-surface work, opening a second floating `Spaghetti Editor` in the model viewport can still collapse the visible app into a dark blank screen
- this appears to be more severe than simple window overlap and looks like the same broader blank-screen family as the earlier workspace regressions

Strongest current likely cause:
- the new multi-floating `SpaghettiWindowHost` render branch is still the strongest live suspect
- a second floating editor surface may still be entering a bad full-viewport render state or destabilizing the shared shell when several in-app floating editor windows coexist

Likely ownership:
- `SP`
- `VR`

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Related docs:
- `/docs/Bugs/11_Workspace-7.5-5-Multi-Floating-Spaghetti-Blank-Screen.md`
- `/docs/Bugs/8_Workspace-5.2-SpaghettiWindowHost-OrderedViewport-Selector-BlackScreen.md`
- `/docs/Bugs/9_Workspace-5.2-SpaghettiEditor-Detached-Popup-Blank.md`
- `/docs/Bugs/10_Workspace-5.2-SpaghettiPopup-Mixed-Ownership-Vs-Console.md`
- `/docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-5 - Multiple Spaghetti Editor Surface Parity.md`

### Bug 10 - Workspace 5.2 detached Spaghetti popup still mixes workspace and legacy viewport ownership unlike Console

Status:
- `[planned]`

Problem:
- Console popout already works because it is a single-owner child-window surface
- Spaghetti popout still mixes shared workspace placement truth with legacy `useSpaghettiStore` viewport/runtime truth
- that mixed ownership is now the strongest architecture-level explanation for why the Spaghetti popup window can open and theme correctly while the real editor surface still never paints

Strongest current likely cause:
- `SpaghettiWindowHost` still discovers and renders detached popup surfaces through a mixed path that depends on:
  - workspace placement state
  - `editorViewportsById`
  - `editorViewportOrder`
  - `activeEditorViewportId`
- unlike `ConsoleDock`, Spaghetti popup still does not render from one canonical detached-surface record

Likely ownership:
- `SP`
- `VR`

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`

Related docs:
- `/docs/Bugs/10_Workspace-5.2-SpaghettiPopup-Mixed-Ownership-Vs-Console.md`
- `/docs/Bugs/9_Workspace-5.2-SpaghettiEditor-Detached-Popup-Blank.md`
- `/docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.2 - Multiple Editor Surface Instances And Graph Binding.md`

### Bug 9 - Workspace 5.2 detached Spaghetti Editor popup opens but stays blank

Status:
- `[investigating]`

Problem:
- clicking `PO` on the Spaghetti Editor opens a child browser window
- the popup now tends to stay open
- but the popup still renders only a dark blank surface instead of the real editor UI

Strongest current likely cause:
- `Workspace 5.2` widened editor ownership into a mixed model where detached placement truth lives in the shared workspace seam while the legacy active-editor runtime still survives in `useSpaghettiStore`
- `SpaghettiWindowHost` still mixes those two ownership models in its detached render path
- the popup shell can now open correctly, but the real detached editor subtree is still not fully driven by one stable canonical detached-surface record

Likely ownership:
- `SP`
- `VR`

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/useWorkspaceChildWindow.ts`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

Related docs:
- `/docs/Bugs/9_Workspace-5.2-SpaghettiEditor-Detached-Popup-Blank.md`
- `/docs/Bugs/10_Workspace-5.2-SpaghettiPopup-Mixed-Ownership-Vs-Console.md`
- `/docs/Bugs/8_Workspace-5.2-SpaghettiWindowHost-OrderedViewport-Selector-BlackScreen.md`
- `/docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.2 - Multiple Editor Surface Instances And Graph Binding.md`

### Bug 8 - Workspace 5.2 startup can collapse into a dark blue-black screen

Status:
- `[investigating]`

Problem:
- after the first `Workspace 5.2` detached-editor widening landed, the app can boot into a dark blue-black screen
- the normal Browser and workspace shell disappear even though background styling remains visible

Strongest current likely cause:
- `SpaghettiWindowHost` now directly subscribes to `useSpaghettiStore(selectOrderedEditorViewports)`
- `selectOrderedEditorViewports` allocates a fresh array every time it runs
- under the current React 19 + Zustand behavior, that matches the older unstable-snapshot crash family that previously produced the same black-screen symptom

Likely ownership:
- `SP`
- `VR`

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Related docs:
- `/docs/Bugs/8_Workspace-5.2-SpaghettiWindowHost-OrderedViewport-Selector-BlackScreen.md`
- `/docs/Bugs/1_BrowserPanel-Startup-Crash.md`
- `/docs/Bugs/2_BrowserPanel-ProjectContent-Selector-Crash.md`
- `/docs/Bugs/3_ReferenceWorkspace-BlackScreen-Regression.md`

### Bug 1 - Spaghetti editor toolbar drag bar cannot move high enough

Status:
- `[open]`

Problem:
- the upper drag bar stops early and does not let the toolbar/header collapse or resize as far as intended

Likely cause:
- a min-height, max-height, or flex constraint is blocking the split from moving higher

Likely ownership:
- `SP`

Likely files:
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/theme/v15Theme.css`

Related docs:
- `/docs/Phases/UI_Window-Update_PhasePlan.md`

### Bug 2 - Spaghetti editor toolbar drag bar is not aligned to the real canvas boundary

Status:
- `[open]`

Problem:
- the drag bar is not sitting directly above the true canvas region
- some controls appear to still belong to the wrong layout region

Desired fix:
- the drag bar should clearly represent:
  - toolbar/header above
  - canvas below

Likely ownership:
- `SP`

Likely files:
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

Related docs:
- `/docs/Phases/UI_Window-Update_PhasePlan.md`
- `/docs/Plans/Wish-Features/Spaghetti-Editor/01.2 - Spaghetti Editor Tool Bar.md`

### Bug 3 - Debug inspector drag bar gets stuck

Status:
- `[open]`

Problem:
- the debug drawer resize handle can stop moving or feel blocked

Likely cause:
- the canvas and debug region are fighting over height
- the canvas min-height may still be clamping the available panel space

Likely ownership:
- `SP`

Likely files:
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`
- `src/app/theme/v15Theme.css`

Related docs:
- `/docs/Phases/UI_Window-Update_PhasePlan.md`

### Bug 4 - Cube connected to OutputPreview does not render

Status:
- `[investigating]`

Problem:
- `Part/Cube` can be connected to `System/OutputPreview` but still fail to render

Why this matters:
- this is the clearest current end-to-end preview-path regression
- it can mean failure in compile, artifact creation, slot mapping, preview VM, or ViewerHost input

Known diagnostic path:
- Part/Cube
- `compileGraph`
- `PartArtifact`
- OutputPreview slot mapping
- `selectPreviewRenderVm`
- `ViewerHost`

Likely ownership:
- `AS`
- `DBG`
- possibly `FS` or `VM` depending on where the drop happens

Likely files:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/components/ViewerHost.tsx`
- related OutputPreview selector/mapping files

Related docs:
- `/docs/Phases/DBG_PhasePlan.md`

### Bug 5 - Spaghetti toolbar is fragmented across too many UI regions

Status:
- `[planned]`

Problem:
- controls are split between:
  - `SpaghettiPanel`
  - `SpaghettiEditor`
  - `SpaghettiCanvas`
- this makes the toolbar feel like multiple unfinished toolbars instead of one real tool surface

User-facing symptoms:
- canvas contains toolbar-like controls
- help/info area is oversized
- load/sample controls feel temporary and dev-oriented

Likely ownership:
- `SP`

Likely files:
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

Related docs:
- `/docs/Plans/Wish-Features/Spaghetti-Editor/01.2 - Spaghetti Editor Tool Bar.md`

### Bug 6 - Wires lack clear render-path and active-flow visibility

Status:
- `[planned]`

Problem:
- it is still too hard to tell which wires are actively feeding `OutputPreview`
- the graph is missing stronger active-path feedback

User-facing symptoms:
- hard to understand why something is or is not contributing to preview
- hard to visually follow the important path through the graph

Likely ownership:
- `NI`
- `VM`

Likely files:
- wire-rendering canvas files
- active-path selectors beside `selectPreviewRenderVm`

Related docs:
- `/docs/Plans/Wish-Features/Spaghetti-Editor/01.3 - Wires ui.md`

### Bug 7 - Geometry/Sketch profile does not extrude the real Sketch Draw shape

Status:
- `[investigating]`

Problem:
- irregular closed shapes authored in `Sketch Draw`, especially `PLine`-based profiles, can be selected and fed into `Geometry/Extrude`
- but the resulting extruded body does not match the real 2D shape the user drew

Why this matters:
- this breaks trust in the graph-native geometry pipeline
- it makes `Sketch -> Extrude -> OutputPreview` look connected while still producing the wrong body
- it suggests the authored `Sketch Draw` profile data is being reduced or rebuilt incorrectly before runtime extrusion

Current likely cause:
- the graph-native `Geometry/Sketch -> Geometry/Extrude` compile seam appears to rebuild a synthetic sketch payload from evaluated profile output and drop the richer loop-segment structure

Likely ownership:
- `AS`
- `Geometry`
- worker CAD runtime contract

Likely files:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/worker/cad/featureStackRuntime.ts`

Related docs:
- `/docs/Bugs/4_GeometrySketch-Extrude-Profile-Handoff-Regression.md`

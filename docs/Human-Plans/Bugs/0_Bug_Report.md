# 0 - Bug Report

## Doc History
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



## Current Known Bugs

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

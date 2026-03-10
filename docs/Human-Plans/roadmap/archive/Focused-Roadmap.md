# Focused Roadmap

## Doc History
1. 2026-03-06 16:14: Re-formatted the roadmap into a true numbered sequence so the main phases and their next-step items read in clear execution order
2. 2026-03-06 16:12: Created this file as the short phase-oriented "what should happen next" roadmap, pulling the near-term execution order out of the larger roadmap, vision docs, and recent Spaghetti planning notes

## Purpose

This is the focused roadmap.

It is not the full long-range roadmap.
It is the shorter answer to:

- what should happen next
- what should happen after that
- what order makes the most sense if the goal is to keep momentum without creating more structural debt

Use this when you want the practical phase order, not the whole future universe of ideas.

## Current Read

My current read of the project is:

- the core architecture is real
- Spaghetti is the canonical advanced authoring path
- the next risk is not lack of ambition, it is surface instability and incomplete control contracts
- the app needs a better bridge from:
  - graph authoring
  - to deterministic preview
  - to real part hardening
  - to Jake mode

So the focused roadmap should prioritize:
- stability
- observability
- driver/control contracts
- real part usefulness
- then broader product-facing polish

## Phase Order

### 1. Phase 1 - Spaghetti Editor Stability

Goal:
- make the editor stable enough to be the daily working surface

Main phases:
1. `SP-1` Spaghetti editor window update
2. `SP-1A` drag-bar / split constraint fixes
3. `SP-1B` toolbar / half-screen / full-screen modes
4. `SP-2` Spaghetti editor toolbar redesign
5. `NI-4` node UI rendering cleanup and consistency

Why first:
- the editor shell is still getting in your way
- the toolbar and drag behavior are part of daily use
- node UI inconsistency still makes everything above it harder

### 2. Phase 2 - Wires, Preview Path, And Debug Visibility

Goal:
- make the graph easier to read and the preview path easier to trust

Main phases:
1. `NI-5` wires UI and wire interaction overhaul
2. `NI-5A` wire validation feedback and active render-path visuals
3. `AS-1` OutputPreview render-path stabilization
4. `AS-2` graph-aware parts / preview inspection improvements
5. `DBG-2` graph and node state inspector
6. `DBG-3` Feature Stack inspector

Why second:
- right now the biggest practical pain is still "why didn’t this render?"
- you need wire clarity and pipeline clarity before adding more complexity

### 3. Phase 3 - Driver Contract Foundations

Goal:
- turn drivers into the real reusable control system

Main phases:
1. `DR-1` canonical driver node contract
2. `DR-2` input and parameter node system completion
3. `DR-3` pin-to-input and promoted parameter system
4. `DR-4` user-facing versus internal driver metadata

Why third:
- Jake mode, control-viz, and typed future systems all depend on a cleaner driver layer
- this is the bridge between advanced authoring and simplified editing

### 4. Phase 4 - Current Real Parts Hardening

Goal:
- make the current real parts actually worth building on

Main phases:
1. `PT-1` Baseplate hardening, presets, and metadata
2. `PT-2` ToeHook hardening and production-quality control setup
3. `PT-3` HeelKick hardening and production-quality control setup
4. `FS-6` feature diagnostics and dependency surfacing
5. `FS-7` feature parameter exposure and promotion rules

Why fourth:
- once the editor and drivers are more stable, part hardening becomes much more efficient
- this is where the app starts feeling like a real product instead of only a promising system

### 5. Phase 5 - Jake Mode Foundations

Goal:
- create the first real simplified end-user path

Main phases:
1. `JK-1` Jake mode shell and app-level mode switching
2. `JK-2` driver-backed Jake controls
3. `JK-3` control-viz spheres
4. `JK-3A` plane-constrained handle motion
5. `JK-3B` `vec2` endpoint-style controls

Why fifth:
- Jake mode should come after the driver layer is real
- otherwise it becomes a second temporary UI system instead of the correct simplified layer

### 6. Phase 6 - Viewer Parity Return

Goal:
- bring back the strongest old workbench features in a cleaner modern form

Main phases:
1. `VR-1A` gizmo parity
2. `VR-1B` Scenes return
3. `VR-1C` radio sampler return
4. `VR-1D` section cut / reference workspace / richer layer-material controls
5. `VR-2` multi-part rendering and highlighting

Why sixth:
- these are important and desirable, but they benefit from a more stable authoring/control pipeline underneath

### 7. Phase 7 - Export And Product Completion

Goal:
- make the app more complete as a usable product system

Main phases:
1. `EX-1` STL export
2. `EX-2` STEP export
3. `EX-3` profile export
4. `EX-4` manufacturing metadata export
5. `JK-4` Jake mode grouped controls and simplified panels
6. `JK-6` Jake mode polish as the end-user experience

Why seventh:
- export matters more once the current parts and simplified editing path are real

### 8. Phase 8 - Multi-Graph And Platform Expansion

Goal:
- expand the system beyond one active graph and toward the Spaghetti Studio future

Main phases:
1. `SP-7` graph document foundations
2. `SP-8` graph-aware worker and preview routing
3. `SP-9` Graphs panel and nested parts
4. `SP-10` shared viewport composition
5. `SP-11` multi-window graph editing
6. `SP-12` multi-graph debug and polish

Why later:
- this is important architecture
- but it should follow a more stable single-graph product path unless multi-graph suddenly becomes urgent

## Immediate Next 5

If I had to pick the tightest next set right now, I would choose:

1. [ ] `SP-1` Spaghetti editor window update
2. [ ] `SP-2` Spaghetti editor toolbar redesign
3. [ ] `NI-4` node UI rendering cleanup and consistency
4. [ ] `NI-5` wires UI and wire interaction overhaul
5. [ ] `DR-1` canonical driver node contract

## Why This Order

This order tries to preserve a clean build path:

- first make the main editor usable
- then make the graph readable and debuggable
- then make the control contract real
- then make the current parts stronger
- then expose the simplified user mode
- then return the richer viewer/workbench features
- then expand into multi-graph and broader platform ideas

## Deferred But Important

These are not the first move, but they are clearly important:

- `DBG-4` resolver and validation inspector
- `DBG-5` graph wiring inspector
- `FS-5` feature expansion beyond `sketch` and `extrude`
- `GE-1` graph persistence and save/load
- `GE-4` multi-document graph ownership
- `ADV-*` experimental systems

## Summary

The short version of the focused roadmap is:

- stabilize Spaghetti
- stabilize wires and preview/debug visibility
- formalize drivers
- harden the current real parts
- build Jake mode on top of those driver contracts
- bring back the stronger old viewer features
- then expand toward multi-graph and the broader Spaghetti Studio future

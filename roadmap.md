# Spaghetti Editor Architecture Roadmap

Date: 2026-03-05

## Goal
Turn the current editor and node system into a deterministic, maintainable architecture while continuing feature delivery.

## Guardrails
- Keep deterministic graph behavior (load/save, validation, evaluate, compile).
- Keep resolver as single source of truth for effective ports.
- No worker/protocol/scheduler changes unless a phase explicitly says so.
- Prefer additive migrations with dual-read compatibility windows.

## Current State
- OutputPreview OP-0 and OP-1 are implemented (node contract + singleton invariant).
- Driver and feature virtual input/output wiring foundations are implemented.
- Phase 4A runtime bridge hardening is in place for deterministic tessellation and compile payload stability.

## Phase 1: Complete OutputPreview as the Render Contract
Priority: Highest

### Outcomes
- Viewer and Parts List are driven only by OutputPreview slot wiring.
- Exactly one system OutputPreview node exists and remains non-deletable.

### Work
- OP-2: Dynamic slot input ports via resolver (`in:solid:<slotId>`).
- OP-3: Slot normalization and deterministic auto-append behavior.
- OP-4: OutputPreview node UI plus Parts List panel wired to filled slots.
- OP-5: ViewerHost reads a dedicated selector (`selectPreviewRenderList`).
- OP-6: Full tests and changelog verification.

### Exit Criteria
- Connecting to trailing empty slot always appends one empty slot.
- Slot order and slot IDs are stable.
- Viewer renders only OutputPreview-connected parts in slot order.

## Phase 2: De-Spaghetti Core by Extracting a Graph Command Kernel
Priority: Highest

### Outcomes
- Canvas/UI components stop mutating graph structure directly.
- Store applies deterministic graph patches from pure command helpers.

### Work
- Introduce `graphCommands/` pure helpers for node/edge/slot/repair operations.
- Move edge add/remove/replace logic out of `SpaghettiCanvas.tsx`.
- Move graph repair logic to a shared normalization pipeline in store.
- Keep all commands deterministic and unit tested in isolation.

### Exit Criteria
- `SpaghettiCanvas.tsx` and `NodeView.tsx` are significantly slimmer and mostly orchestration.
- Graph mutations are testable without rendering UI.

## Phase 3: Separate Source Graph State from Derived VM State
Priority: High

### Outcomes
- Rendering state is selector-driven and not manually duplicated.
- Undo/redo and recompute behavior becomes predictable.

### Work
- Keep source-of-truth store data minimal (graph + UI placement + lightweight flags).
- Add selectors for:
  - node row VM
  - driver VM
  - preview render VM
  - diagnostics VM
- Remove duplicated computed state from component-local logic where possible.

### Exit Criteria
- Derived state is recomputed from graph deterministically.
- Reduced stale-state bugs and fewer cross-file special cases.

## Phase 4: Contract Lock Across Resolver, Validation, Evaluate, and Canvas
Priority: High

### Outcomes
- One endpoint contract path is used by cheap-check and full validation.
- Port/path semantics are consistent across all layers.

### Work
- Centralize endpoint-key and path normalization helpers.
- Enforce shared reason codes for parity checks.
- Add contract tests that compare cheap-check and full validator decisions for key scenarios.

### Exit Criteria
- No known validator vs canvas parity drift.
- New port types can be added with one resolver extension path.

## Phase 5: Feature Delivery on Stable Architecture
Priority: Medium

### Outcomes
- New capabilities ship without re-introducing structural coupling.

### Work
- Phase 2C v2.2: Driven number offset mode.
- Additional feature input wiring targets beyond extrude depth/taper/offset.
- Continue OutputPreview-driven user workflow hardening.

### Exit Criteria
- New features rely on command kernel + selectors, not canvas-local state hacks.

## Phase 6: Sketch System Expansion (Phase 4 Track)
Priority: Medium

### Outcomes
- Baseplate sketch workflow matures from MVP to robust component model.

### Work
- Complete remaining Phase 4/4A checklist items:
  - SketchBuild/CloseProfile contracts
  - deterministic closure and diagnostics
  - feature stack integration and compiler parity

### Exit Criteria
- Closed profile to extrude path is deterministic and fully tested.
- Runtime pipeline remains unchanged unless explicitly approved.

## Phase 7: Optional Child-Container Migration (Phase 3 Track)
Priority: Low (gated)

### Outcomes
- Drivers/Inputs/FeatureStack/Outputs can become real child containers if still needed.

### Work
- Execute only after Phases 1 to 4 are stable for at least one release cycle.
- Use staged approach: 3A model + adapter, 3B dual-read, 3C migration tool, 3D default-on, 3E cleanup.

### Exit Criteria
- Migration is deterministic, reversible, and covered by compatibility tests.

## Release Gates (Every Phase)
- `npm.cmd run test`
- `npm.cmd run build`
- Determinism checks on compile payload snapshots for representative fixtures.
- Changelog/docs updated with scope, constraints, and verification steps.

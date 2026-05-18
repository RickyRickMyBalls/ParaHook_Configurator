# [ ] `Export-2` - `Cleanup And Feature Enrichment`

## Doc Header

### Doc History
3. 2026-05-18 08:32:58: Marked `Export-2 / Phase 2 - Workspace Header Export Action Placement` shipped after moving the active `Export STEP` button, status, and readiness hint from the `Export Review` panel into the main `Workspace / Export` header panel while preserving the existing authoritative STEP handoff and focused placement coverage.
2. 2026-05-18 08:23:50: Marked `Export-2 / Phase 1 - Top Panel Export Action Placement` shipped after moving the active `Export STEP` button, export status, and readiness hint into the top `Export Review` panel while preserving the existing authoritative STEP handoff, keeping related outputs and settings read-only, and adding focused surface coverage for the new button placement.
1. 2026-05-18 08:14:11: Created `Export-2 - Cleanup And Feature Enrichment` as the next open Export family phase after `Export-1` closed, intentionally keeping the phase ladder lightweight so the user can define cleanup and feature-enrichment slices one phase at a time.

### Purpose

This family phase is the open follow-on lane for Export cleanup and feature enrichment after the first visible Export workspace surface shipped.

Use it to collect and prepare small Export improvements one phase at a time without reopening `Export-1` or pretending the full enrichment ladder is already known.

### Scope

This doc covers:
- cleanup work around the shipped Export surface
- small Export workflow enrichments
- targeted UI, state, copy, test, and behavior polish
- phase-by-phase preparation as new user ideas become concrete

This doc does not cover by default:
- large worker-side multi-format writer implementation
- project-file schema ownership
- graph/spaghetti persistence schema ownership
- exporting from Three.js viewer meshes
- broad B-rep viewer/runtime architecture

If a future slice grows into one of those larger systems, split it into a narrower family phase instead of hiding it inside `Export-2`.

## Doc Body

### Goal

Keep improving the Export workspace after `Export-1` without losing the clean ownership boundaries that were established there.

`Export-2` should be a flexible cleanup and enrichment runway. Each implementation phase should be defined only when the next user-facing or architecture cleanup target is clear.

### Starting Point

`Export-1` shipped:
- the optional `Export` workspace surface
- `STEP` as the only executable geometry export format
- target review seeded from workspace selection
- format-specific settings readouts
- read-only related output neighbors for geometry export, graph file, project file, and spaghetti file ownership

`Export-2` starts from that shipped surface and should make it better phase by phase.

### Ownership Boundary

`Export-2` owns:
- cleanup inside the Export surface and nearby Export-owned helpers
- clearer export readiness, target review, format, settings, result, and related-output presentation
- small owner-backed workflow enrichments
- focused tests for each enrichment slice
- tracking when an enrichment should become a separate family phase

`Export-2` does not own by default:
- new worker file writers unless a phase explicitly prepares and owns that writer path
- project-file save/load schemas
- graph/spaghetti save/load schemas
- viewport mesh export
- major B-rep viewer implementation

### Phase Intake Rule

The user will define this family phase one slice at a time.

When a new idea arrives:
1. Add it as the next `Export-2 / Phase N`.
2. Prep that phase with a current code read, ownership boundary, implementation spec, and verification shape.
3. Implement only that prepared phase.
4. If the idea is too large, split it into a later `Export-3+` family phase instead.

## Wishlist Organization

### High Level Goals

- [ ] `Export-2-HLG-1` - `Use Export-2 as a clean cleanup and feature-enrichment lane after the first Export surface shipped.`
- [ ] `Export-2-HLG-2` - `Let the user define each enrichment phase as the next concrete Export improvement becomes clear.`
- [ ] `Export-2-HLG-3` - `Preserve true B-rep export honesty and persistence ownership boundaries while improving the surface.`

### Codex Level Goals

- [ ] CLG 1. Keep each `Export-2` phase small, explicit, and implementation-ready before code work starts.
- [ ] CLG 2. Prefer cleanup and owner-backed enrichments over broad speculative export architecture.
- [ ] CLG 3. Move any worker-writer, persistence-schema, or viewer-runtime widening into its own family phase when needed.

### `Export-2 / Phase 1`

- [x] HLG: `Export-2-HLG-1`
- [x] HLG: `Export-2-HLG-2`
- [x] HLG: `Export-2-HLG-3`
- [x] CLG: move the active export action into the first top panel
- [x] CLG: preserve the existing authoritative STEP export behavior
- [x] CLG: keep the first slice narrow enough to verify cleanly

## [x] `Export-2 / Phase 1` - `Top Panel Export Action Placement`

### Phase 1 Summary

Phase 1 moves the active export button out of the lower standalone action panel and into the first top `Export Review` panel.

This keeps the primary action near target review and makes the first Export panel feel like the command center for the export job without changing what the button does.

### Phase 1 Implementation Spec

Implementation is shipped.

Shipped scope:
- moved `Export STEP`, the export status label, status detail, and readiness hint into the top `Export Review` panel
- removed the separate bottom action panel from the rendered layout
- kept `requestGraphDocumentStepExport(...)` as the only active executable export handoff
- kept unavailable formats and non-graph targets disabled as before
- added focused coverage proving the export button now lives inside the targets panel

Definition of done:
- shipped: the primary export action appears in the first top panel
- shipped: the export handoff behavior is unchanged
- shipped: unsupported target and format gating is unchanged
- shipped: focused Export surface tests pass

## [x] `Export-2 / Phase 2` - `Workspace Header Export Action Placement`

### Phase 2 Summary

Phase 2 moves the active export command into the main `Workspace / Export` header panel that introduces the Export surface.

This supersedes the Phase 1 placement by putting the command in the exact top panel that contains:
- `Workspace`
- `Export`
- `Prepare an authoritative export job from graph-owned geometry.`

### Phase 2 Implementation Spec

Implementation is shipped.

Shipped scope:
- moved `Export STEP`, export status, status detail, and readiness hint into the main `ExportSurfaceHeader`
- removed the inline action block from the `Export Review` targets panel
- preserved the same `requestGraphDocumentStepExport(...)` action path
- preserved unavailable format and non-graph target gating
- updated focused coverage so the primary action is expected in the workspace header and not in the targets panel

Definition of done:
- shipped: the primary export action appears in the main `Workspace / Export` header panel
- shipped: the export handoff behavior is unchanged
- shipped: unsupported target and format gating is unchanged
- shipped: focused Export surface tests pass

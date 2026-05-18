# [ ] `Export-2` - `Cleanup And Feature Enrichment`

## Doc Header

### Doc History
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

- [ ] HLG: `Export-2-HLG-1`
- [ ] HLG: `Export-2-HLG-2`
- [ ] CLG: wait for the user's first concrete cleanup or enrichment target
- [ ] CLG: prep Phase 1 before implementation
- [ ] CLG: keep the first slice narrow enough to verify cleanly

## [ ] `Export-2 / Phase 1` - `User-Defined Cleanup Or Enrichment Slice`

### Phase 1 Summary

Phase 1 is intentionally open until the user names the first concrete cleanup or feature-enrichment target.

This placeholder exists so the Export family has a clean next home without forcing a speculative implementation plan.

### Phase 1 Implementation Spec

Implementation is not ready yet.

Before implementation:
- collect the user's first `Export-2` cleanup or enrichment target
- read the current Export surface and adjacent owner files
- define the exact code/doc scope
- define the no-widening rules
- define focused tests and build verification

Definition of done:
- Phase 1 has a concrete title
- Phase 1 has a current code read
- Phase 1 has an implementation spec
- Phase 1 has focused verification targets

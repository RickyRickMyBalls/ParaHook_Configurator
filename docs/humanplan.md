Humanized master plan (v20 → real toe hook)
Where we are now

App is stable: React UI + Zustand + warm worker + latest-only/stale-drop.

Viewer-only systems are working: camera/gizmo/overlays, build stats drawer, assemble-on-demand caching.

Geometry is still stubbed as 4 boxes (baseplate / heelKick / toeHook / final legacy).

Pipeline already supports progress events + caches + deterministic signatures.

What we’re building next

We’re turning “a giant bag of params” into a scalable system where:

Each parameter belongs to a part instance (baseplate, toeHook#1, toeHook#2, heelKick#1, etc.).

Worker only recomputes parts whose “recipe” changed.

Parts can have filter stacks (v15-style).

Viewer transforms are fast and ephemeral until “Apply.”

Assembled preview is on-demand and becomes the validation gate before export.

Phase plan
Phase A — Param ownership + routing (foundation for scalability)

Goal: if user changes a param, we know which part(s) it affects.

Adopt a param naming convention:

bp_* → baseplate

th1_*, th2_* → toe hook instances

hk1_* → heel kick instances

Store tracks changedParamIds per edit burst.

Build requests carry changedParamIds (optional metadata).

Worker pipeline uses:

per-part input extractors

per-part signatures

routing to avoid recomputing unrelated parts

Deliverable:

Keep 4-box outputs unchanged, but see cache hits for unaffected parts.

Phase B — Right-side ViewToolbar (finish)

Goal: fully match v15 “viewer control surface”:

Camera presets + frame

Gizmo enable/mode/space/snap

View toggles: grid/axes/shadows/wireframe/tone/exposure/env

Environment: lighting list editor (add/remove/config)

Materials: v15-style material preset toolbar + per-part assignment

All viewer-only; never rebuild.

Phase C — Parts List becomes powerful

Goal: Parts List is not just visibility. It becomes the “part inspector.”

For each part instance:

enable/disable

select/focus controls

stage view: raw/final (optional)

filter stack editor (fillet per toe)

“Apply transform” commit button (when gizmo moved it)

Phase D — Real toe hook v1 (replace stub)

Goal: replace toeHook box generator with real toe geometry while preserving architecture.

Introduce canonical part input schema for toe hook:

profile refs / stations / thickness / width

root transform

filters list

Worker:

build raw toe solid

apply root transform

apply filters (fillet optional)

emit artifacts

Phase E — Assembled preview → validation gate

Goal: assembled preview becomes “pre-export check.”

Assemble merges enabled parts with filters applied.

Worker emits:

assembled mesh

validation status (ok/warn/error + codes)

UI shows errors in title bar / drawer.

Export uses cached assembled if signature matches.

Phase F — Undo/Redo + share codes

Goal: CAD-grade usability.

Undo/redo stores canonical schema snapshots (not meshes).

Share code / URL encodes canonical state + version.

Optional telemetry panel shows diffs + signature per step.

Future areas to keep in mind

Dual engine routing (legacy vs hookspec) reintroduced behind toggles when toe geometry is real.

Per-part “filter stage artifacts” (raw → fillet → final) for fast editing workflows.

Export pipeline: STEP/STL in worker, with progress + caching.

Long-term: part instances (th3, hk2, etc.) with stable IDs.

Debug: structured logs (BUILD_START, PARAM_DIFF, PART_CACHE_HIT, PART_BUILD_MS, APPLY_SEQ, STALE_DROP).
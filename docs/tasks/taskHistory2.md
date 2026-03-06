Phase A ([001]-[010]) - App Creation Foundation
- [x] Build initial Spaghetti editor foundation (node add/search menu, typed ports, anchored floating editor).
- [x] Establish deterministic graph behavior (path-aware endpoints, stable validate/evaluate/compile ordering).
- [x] Add advanced wire editing/routing (curviness, reroute points, tangency controls).
- [x] Add inline numeric interaction model (value bars, drag-scrub, step controls, baseplate sketch inputs).
- [x] Add composite field-tree/path system for leaf-level wiring and deterministic endpoint identity.
- [x] Complete Feature Stack v1 app-layer spec alignment (profile derivation, auto-link, diagnostics contract).
- [x] Activate Feature Stack v1 worker runtime path (Option-B execution, deterministic part/feature/body order).
- [x] Add IR-driven Feature Stack debug preview UI with deterministic labels/sorting/diagnostics.
- [x] Add row view mode system (collapsed / essentials / everything) with composite leaf rendering rules.
- [x] Stabilize interaction and performance guards (drag rerender guard, interactive target guard, anchor click mode lock).
- [x] Complete early floating window UX hardening (default geometry + immediate drag behavior).
- [x] Verify quality gate repeatedly (`npm.cmd run test` and `npm.cmd run build`).

Phase B ([011]-[020]) - Interaction Mode Pass and Scaffolding
- [x] Implement mode transition behavior and interaction flow improvements.
- [x] Improve scrub/input interaction controls and contextual routing behavior.
- [x] Add template scaffolding and node-template flagging setup.

Phase C ([021]-[025]) - Part Template Taxonomy and Definition Population
- [x] Lock Drivers/Inputs/Outputs taxonomy for part-node templates.
- [x] Populate and align Baseplate/ToeHook/HeelKick template definitions.
- [x] Keep template behavior consistent with app-layer graph contracts.

Phase D ([026]-[036]) - Node UI Polish and Typed Wiring Visuals
- [x] Implement typed sockets/wire visuals and lane layout refinements.
- [x] Improve node row layout, expand/collapse behavior, and toolbar UX polish.
- [x] Continue deterministic UI behavior alignment with wiring model.

Phase E ([037]-[042], [044]) - Phase 1 Contract Lock and Task Infrastructure
- [x] Finalize partSlots/contract hardening work for Phase 1 closeout.
- [x] Establish docs task infrastructure and planning checklist structure.
- [x] Sync status and closure entries across roadmap/tasklist/changelog docs.

Phase F ([043], [045]-[051]) - Feature Wiring v1 and Row Ordering Track
- [x] Add feature virtual input contract and whole-port wiring behavior.
- [x] Add/normalize row order metadata and reorder UI behavior.
- [x] Stabilize feature stack row rendering order and related UI polish passes.
- [x] Add parity tests for compile/evaluate/validation/UI behavior.

Phase G ([052]-[055], [057], [060]) - Driver Wiring Evolution and 2B v2.0 Expansion
- [x] Roll out driver input/output virtual port wiring and parity behavior.
- [x] Implement and harden driver input auto-replace behavior.
- [x] Expand feature virtual inputs beyond `Extrude.depth` to `taper` and `offset`.
- [x] Preserve resolver/validator/canvas/evaluator parity with deterministic behavior.

Phase H ([054], [056], [058], [059], [061], [063], [065]) - Documentation and Planning Maintenance
- [x] Keep changelog/tasklist sequencing, numbering, and completion markers consistent.
- [x] Maintain roadmap format updates/restores as documentation-only operations.
- [x] Apply checklist and numbering housekeeping in NODE task docs.
- [x] Track next queued runtime-bridge tasks in changelog.

Phase I ([062]) - Runtime Bridge Hardening
- [x] Move runtime tessellation logic to compiler-local helper and keep boundary at compile payload emission.
- [x] Enforce deterministic tessellation pipeline (canonicalization, epsilon suppression, closure snap, CCW).
- [x] Add deterministic compile payload tests and focused tessellation unit tests.
- [x] Preserve runtime op contract and schema invariants.

Phase J ([064]) - DR-0 Canonical Driver ID Contract
- [x] Adopt canonical driver port IDs: `in:drv:<paramId>` and `out:drv:<paramId>`.
- [x] Keep legacy aliases dual-readable for compatibility.
- [x] Canonicalize alias handling in validator endpoint counting and auto-replace endpoint keys.
- [x] Update canvas/VM driver row binding to paramId-based canonical mapping.
- [x] Add compatibility and mismatch regression tests.

Phase K ([066]) - 2C v2.2 Driven Numeric Offset Mode
- [x] Extend part params schema with `driverOffsetByParamId` and `driverDrivenByParamId` (optional).
- [x] Add commit-boundary normalization to initialize missing numeric offset to `0` when first driven.
- [x] Persist driven-state metadata deterministically with no topology mutation.
- [x] Preserve stored offsets on disconnect and clear driven flags when no longer driven.
- [x] Update driver virtual output semantics so driven numeric `out:drv:*` emits effective value.
- [x] Extend driver VM with driven/offset/effective fields for numeric rows.
- [x] Update canvas-derived VM data and number-change path for offset edits.
- [x] Update node UI layout for driven numeric rows (driven read-only, offset editable, effective read-only).
- [x] Add scoped styling for driven offset mode.
- [x] Add regression coverage for normalization, output resolver, evaluate behavior, validation parity, and NodeView rendering.
- [x] Record changelog entry and verification runs.

Phase L ([067]) - CK-1 Graph Command Kernel Centralization
- [x] Introduce `graphCommands/` pure helpers for node and edge operations.
- [x] Move edge add/remove/replace logic out of `SpaghettiCanvas` into command helpers.
- [x] Move driver auto-replace graph mutation logic into command helpers.
- [x] Centralize graph mutation commit path through store normalization.
- [x] Add command-layer tests (node/edge ops, auto-replace behavior, determinism, OutputPreview invariant).
- [x] Reduce canvas/editor responsibility to orchestration only.
- [x] Record changelog entry and verification runs.

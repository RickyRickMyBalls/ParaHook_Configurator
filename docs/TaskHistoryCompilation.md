----------------------------------------------------------------------------------------------------------------------------
MASTER CONSOLIDATION - Unified Docs Task Map (header, unnumbered)
----------------------------------------------------------------------------------------------------------------------------

Purpose: single index for routes/branches/dead-ends across `/docs` so flowchart work can start from one place.

Imported task-list sources (open / in-progress / done snapshot):
- [~] roadmap.md (16 / 0 / 8)
- [~] tasks/Phase 2C v2.2 Driven Number Offset Mode (5 / 0 / 0)
- [~] tasks/Phase 2B v2.0 Feature Input Wiring Expansion (25 / 0 / 0)
- [~] tasks/Phase 2B v2.0 Feature Input Wiring Expansion (Extrude taper + offset) (33 / 0 / 19)
- [~] tasks/Phase 3.md (17 / 0 / 0)
- [~] tasks/Phase 4 v1 - Sketch System (78 / 0 / 5)
- [~] tasks/Phase 4A v1 Baseplate Sketch MVP Checklist (62 / 0 / 6)
- [~] plans/Phase4a runtime bridge/Phase 4A Runtime Bridge (41 / 0 / 0)
- [~] plans/Phase4a runtime bridge/Phase OP/Phase OP Tasks (25 / 11 / 33)
- [~] silly/NODE-tasklist.md (30 / 0 / 74)
- [~] silly/datNEWNEW_task-list.md (26 / 4 / 43)
- [~] silly/UI-Wishlist.md (87 / 4 / 28) (contains duplicate sections)
- [~] tasks/design.md (13 / 1 / 20)
- [~] silly/checklist.md (13 / 0 / 19)
- [~] old/master-tasks.md (5 / 1 / 5)
- [~] old/targetrepo.md (legacy architecture + engine route map; no checkbox counters)
- [~] old/oldchanges.md and old/listofchanges*.md (legacy branch history; narrative source)
- [~] silly/wishlist_Params.md and silly/Master Plan*.md (idea backlog; narrative source)

Phase breakdown derived from old/listofchanges.md ([001]-[062]):
- [x] Phase A - App creation + Spaghetti foundation ([001]-[010])
  - core editor/canvas, path-aware endpoints, reroute/tangent wiring, floating window baseline, interaction guards
- [x] Phase B - Interaction mode pass + template scaffolding ([011]-[020])
  - mode transitions, scrub controls, context routing, node template flagging setup
- [x] Phase C - Part template taxonomy + part definitions ([021]-[025])
  - Drivers/Inputs/Outputs taxonomy, Baseplate/ToeHook/HeelKick template population and alignment
- [x] Phase D - Node UI polish + typed wiring visuals ([026]-[036])
  - typed sockets/wires, output lane/row layout passes, toolbar/expand-collapse UX refinements
- [x] Phase E - Phase 1 contract + planning/tasklist infrastructure ([037]-[042], [044])
  - partSlots contract, closure hardening, docs task infra, status sync entries
- [x] Phase F - Feature wiring and row ordering tracks ([043], [045]-[051])
  - external feature virtual input wiring (v1) + row order metadata and reorder UI polish
- [x] Phase G - Driver wiring evolution ([052]-[055], [057], [060])
  - driver outputs, wire->driver inputs, auto-replace semantics, 2B v2.0 taper/offset expansion
- [x] Phase H - Changelog/tasklist maintenance checkpoints ([054], [056], [058], [059], [061])
  - completion markers, renumbering, next-task tracking
- [x] Phase I - Runtime bridge hardening ([062])
  - tessellation determinism + CCW lock at compile boundary

Phase breakdown derived from docs/CHANGELOG.md ([001]-[067], canonical timeline):
- [x] Phase A - App creation + Spaghetti foundation ([001]-[010])
- [x] Phase B - Interaction/mode pass + template scaffolding ([011]-[020])
- [x] Phase C - Part template taxonomy + part definitions ([021]-[025])
- [x] Phase D - UI polish + typed wiring visuals ([026]-[036])
- [x] Phase E - Phase 1 contract + task infra ([037]-[042], [044])
- [x] Phase F - Feature wiring v1 + row ordering track ([043], [045]-[051])
- [x] Phase G - Driver wiring evolution + 2B v2.0 expansion ([052]-[055], [057], [060])
- [x] Phase H - Documentation maintenance checkpoints ([054], [056], [058], [059], [061], [063], [065])
- [x] Phase I - Runtime bridge hardening ([062])
- [x] Phase J - DR-0 canonical driver ID contract + dual-read compatibility ([064])
- [x] Phase K - 2C v2.2 driven numeric offset mode ([066])
- [x] Phase L - CK-1 graph command kernel centralization ([067])

Detailed import from docs/CHANGELOG.md (newest first, canonical):
- [x] [067] CK-1 graph command kernel centralization (graphCommands + store/apply path + canvas/editor call-site migration + command tests)
- [x] [066] 2C v2.2 driven numeric offset mode (normalization metadata + effective out:drv + driven/offset/effective UI)
- [x] [065] Roadmap restore rollback (docs-only format restore)
- [x] [064] DR-0 canonical driver IDs + legacy dual-read compatibility (`in:drv:*`, `out:drv:*`)
- [x] [063] Roadmap execution-queue reorganization (docs-only)
- [x] [062] Runtime bridge hardening (deterministic tessellation + CCW lock at compile boundary)
- [x] [061] Runtime bridge next-task changelog add (docs-only)
- [x] [060] 2B v2.0 expansion: extrude taper/offset feature virtual inputs
- [x] [059]-[058] NODE tasklist maintenance/renumbering (docs-only)
- [x] [057] 2C v2.1 driver input auto-replace hardening
- [x] [056]-[054] completion tracking + changelog housekeeping (docs-only)
- [x] [055]-[052] driver input/output virtual port rollout phases
- [x] [051]-[045] feature stack virtual input v1 and row ordering passes
- [x] [044]-[037] phase-1 contract closes + planning/tasklist setup
- [x] [036]-[026] node UI/wiring visual polish passes
- [x] [025]-[021] part template taxonomy and node definition population
- [x] [020]-[011] interaction mode passes and scaffolding
- [x] [010]-[001] app creation foundation and early spaghetti architecture

Newest / active branch routes (top priority):
- [~] CK-1 Graph Command Kernel (de-spaghetti graph mutation commands)
- [~] 2C v2.2 Driven Numeric Offset Mode (Output+UI scope)
- [ ] DR-0 Driver Input+Output Ports (global wiring)
- [ ] CT-1 Contract lock (resolver/validator/canvas parity)
- [ ] VM-1 Derived VM selector split (source vs derived state)

Next branch routes:
- [ ] 2B v2.0+ feature wiring expansion beyond Extrude.depth (taper/offset + parity/tests)
- [ ] SK-1/SK-2/SK-3 sketch system contract + diagnostics + compiler parity
- [ ] FS-1/FS-2 first real shape path (part solid output + feature-stack node MVP)
- [ ] ND-1/ND-2/ND-3 expansion nodes + internal dependency visualization

Flowchart prep checklist (routes / branches / dead-ends):
- [ ] Build branch map from docs source files: roadmap + tasks + plans + silly + old
- [ ] Tag each branch as Active / Parked / Legacy / Dead-end candidate
- [ ] Add dependency arrows (example: CK-1 before VM-1; SK track before FS rollout)
- [ ] Mark branch merge points (OutputPreview, Feature Wiring, Driver Wiring)
- [ ] Mark abandoned or superseded paths explicitly in this file (append-only notes)

Oldest branch candidates identified during consolidation:
- [ ] Legacy container-migration track (Phase 3 optional child-container migration)
- [ ] Legacy Feature 2B backlog variants duplicated across old/silly docs
- [ ] Legacy engine-routing architecture branch from old/targetrepo.md (keep near bottom in priority)


----------------------------------------------------------------------------------------------------------------------------
COMPLETED PHASE TASKLISTS (newest at top -> oldest at bottom)
----------------------------------------------------------------------------------------------------------------------------

Phase L ([067]) - CK-1 Graph Command Kernel Centralization
- [x] Introduce `graphCommands/` pure helpers for node and edge operations.
- [x] Move edge add/remove/replace logic out of `SpaghettiCanvas` into command helpers.
- [x] Move driver auto-replace graph mutation logic into command helpers.
- [x] Centralize graph mutation commit path through store normalization.
- [x] Add command-layer tests (node/edge ops, auto-replace behavior, determinism, OutputPreview invariant).
- [x] Reduce canvas/editor responsibility to orchestration only.
- [x] Record changelog entry and verification runs.

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

Phase J ([064]) - DR-0 Canonical Driver ID Contract
- [x] Adopt canonical driver port IDs: `in:drv:<paramId>` and `out:drv:<paramId>`.
- [x] Keep legacy aliases dual-readable for compatibility.
- [x] Canonicalize alias handling in validator endpoint counting and auto-replace endpoint keys.
- [x] Update canvas/VM driver row binding to paramId-based canonical mapping.
- [x] Add compatibility and mismatch regression tests.

Phase I ([062]) - Runtime Bridge Hardening
- [x] Move runtime tessellation logic to compiler-local helper and keep boundary at compile payload emission.
- [x] Enforce deterministic tessellation pipeline (canonicalization, epsilon suppression, closure snap, CCW).
- [x] Add deterministic compile payload tests and focused tessellation unit tests.
- [x] Preserve runtime op contract and schema invariants.

Phase H ([054], [056], [058], [059], [061], [063], [065]) - Documentation and Planning Maintenance
- [x] Keep changelog/tasklist sequencing, numbering, and completion markers consistent.
- [x] Maintain roadmap format updates/restores as documentation-only operations.
- [x] Apply checklist and numbering housekeeping in NODE task docs.
- [x] Track next queued runtime-bridge tasks in changelog.

Phase G ([052]-[055], [057], [060]) - Driver Wiring Evolution and 2B v2.0 Expansion
- [x] Roll out driver input/output virtual port wiring and parity behavior.
- [x] Implement and harden driver input auto-replace behavior.
- [x] Expand feature virtual inputs beyond `Extrude.depth` to `taper` and `offset`.
- [x] Preserve resolver/validator/canvas/evaluator parity with deterministic behavior.

Phase F ([043], [045]-[051]) - Feature Wiring v1 and Row Ordering Track
- [x] Add feature virtual input contract and whole-port wiring behavior.
- [x] Add/normalize row order metadata and reorder UI behavior.
- [x] Stabilize feature stack row rendering order and related UI polish passes.
- [x] Add parity tests for compile/evaluate/validation/UI behavior.

Phase E ([037]-[042], [044]) - Phase 1 Contract Lock and Task Infrastructure
- [x] Finalize partSlots/contract hardening work for Phase 1 closeout.
- [x] Establish docs task infrastructure and planning checklist structure.
- [x] Sync status and closure entries across roadmap/tasklist/changelog docs.

Phase D ([026]-[036]) - Node UI Polish and Typed Wiring Visuals
- [x] Implement typed sockets/wire visuals and lane layout refinements.
- [x] Improve node row layout, expand/collapse behavior, and toolbar UX polish.
- [x] Continue deterministic UI behavior alignment with wiring model.

Phase C ([021]-[025]) - Part Template Taxonomy and Definition Population
- [x] Lock Drivers/Inputs/Outputs taxonomy for part-node templates.
- [x] Populate and align Baseplate/ToeHook/HeelKick template definitions.
- [x] Keep template behavior consistent with app-layer graph contracts.

Phase B ([011]-[020]) - Interaction Mode Pass and Scaffolding
- [x] Implement mode transition behavior and interaction flow improvements.
- [x] Improve scrub/input interaction controls and contextual routing behavior.
- [x] Add template scaffolding and node-template flagging setup.

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

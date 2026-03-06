# NODE Tasklist

Legend: `[ ]` todo, `[~]` in progress, `[x]` done
Difficulty Scale: `1 = easiest`, `100 = hardest`

## 1) Baseline Decisions (Locked) - Easy to Hard: 15/100
- [x] Keep Drivers/Inputs/Outputs VM-row generated in Phase 1 (no child-node container migration yet).
- [x] Keep Feature Stack embedded in `part.params.featureStack` in Phase 1.
- [x] Limit Phase 1 to app-layer changes only.
- [x] Exclude drag-and-drop from Phase 1.
- [x] Preserve backward compatibility for legacy graphs.
- [x] Keep NodeView generic.

## 2) Phase 1: Part Container Contract - Easy to Hard: 45/100
- [x] Add additive `partSlots` metadata to part nodes:
  - `drivers: true`
  - `inputs: true`
  - `featureStack: true`
  - `outputs: true`
- [x] Add canonical helper(s) for deterministic `partSlots` creation/repair.
- [x] Normalize legacy part nodes that are missing `partSlots`.
- [x] Emit deterministic warning code: `partSlots_missing_normalized`.
- [x] Validate `partSlots` shape and enforce exact keys only:
  - `drivers`, `inputs`, `featureStack`, `outputs`
- [x] Repair invalid shapes deterministically to canonical object.
- [x] Emit deterministic warning code: `partSlots_invalid_shape_repaired`.
- [x] Preserve all legacy fields while normalizing/repairing `partSlots`.

## 3) Phase 1: Locked Render Contract - Easy to Hard: 55/100
- [x] Lock part section render order to:
  - `Drivers -> Inputs -> Feature Stack -> Outputs`
- [x] Keep row rendering logic unchanged within each section.
- [x] Keep Drivers/Inputs/Outputs sourced from existing VM generation.
- [x] Keep Feature Stack rendering sourced from `part.params.featureStack`.
- [x] Ensure no auto-sort of user-defined row order.

## 4) Phase 1: Tests and Verification - Easy to Hard: 65/100
- [x] Add test: legacy part node without `partSlots` normalizes deterministically.
- [x] Add test: invalid `partSlots` shape repairs deterministically.
- [x] Add test: warning codes are stable and reproducible.
- [x] Add test: renderer order always `Drivers -> Inputs -> Feature Stack -> Outputs`.
- [x] Add test: Feature Stack still reads from embedded `part.params.featureStack`.
- [x] Run unit/integration tests relevant to store, validator, and canvas rendering.
- [x] Run build and confirm no regressions.

## 5) Phase 2A: Row Ordering Infrastructure (Implemented) - Easy to Hard: 80/100
- [x] Define stable rowId scheme for driverVm rows (drivers/inputs/outputs).
- [x] Add per-part ordering metadata (`partRowOrder.{drivers,inputs,outputs}: rowId[]`).
- [x] Normalize/repair row order deterministically (drop missing ids, dedupe first-wins, preserve order).
- [x] Render rows using ordering metadata with fallback to current VM order.
- [x] Add reorder UI and deterministic metadata persistence with tests.

## 6) Phase 2B v1: External Feature-Input Wiring (Implemented) - Easy to Hard: 85/100
- [x] Define strict v1 wire contract:
  - inputs only
  - `Extrude.depth` only
  - no composite paths
  - max one incoming edge
  - external-only simplification (`from.nodeId !== to.nodeId`)
- [x] Add stable virtual input ID contract: `fs:in:<featureId>:extrude:depth`.
- [x] Add shared effective-port resolver and use it in validator/evaluator/canvas/UI listing.
- [x] Extend validation for feature virtual inputs and emit deterministic `FEATURE_WIRE_INTRA_NODE_UNSUPPORTED`.
- [x] Extend evaluation to resolve virtual inputs into `inputsByNodeId[nodeId][virtualPortId]`.
- [x] Extend compile flow to apply deterministic in-memory depth overrides before feature IR generation.
- [x] Add Extrude-only UI wiring endpoint and driven-state depth editor lock.
- [x] Add determinism and compatibility tests for resolver, validation, evaluation, compile, and UI behavior.

## 7) Phase 2B v2.0 — Add second wireable feature input (still inputs-only)

[ ] Pick 1 additional feature param to wire (recommend: Extrude.taper or Extrude.twist if it exists; otherwise Sketch plane/offset or Loft sections count—whatever is already in your feature param model)
[ ] Add new virtual port ID(s) in featureVirtualPorts.ts (same namespace style)
[ ] Extend effectivePorts resolver (virtual inputs list)
[ ] Extend validateGraph rules + tests (maxConnectionsIn=1, external-only invariant if still locked)
[ ] Extend evaluateGraph mapping into inputsByNodeId
[ ] Extend compileGraph override logic for the new param
[ ] Add UI endpoint in the corresponding FeatureView (like ExtrudeFeatureView)
[ ] Regression tests + build

## 8) Phase 2C v1: Driver -> Input Wiring (Implemented) - Easy to Hard: 88/100
- [x] Add driver virtual output ports (`drv:<paramId>`) for nodeParam drivers.
- [x] Add `wireOutputType` metadata to nodeParam driver specs in `nodeRegistry`.
- [x] Extend effective-port resolver to include driver virtual outputs.
- [x] Update validation to accept driver output -> input edges via resolver.
- [x] Extend evaluation to emit driver virtual outputs into `outputsByNodeId`.
- [x] Render driver output pins on driver rows in `NodeView`.
- [x] Ensure canvas cheap validation parity through resolver.
- [x] Add driverVirtualPorts unit tests.
- [x] Add validateGraph driver wiring tests.
- [x] Add evaluateGraph deterministic driver output tests.
- [x] Add UI tests for driver pin rendering and driven input behavior.
- [x] Lock `drv:<paramId>` parser to `^[A-Za-z0-9_]+$` (non-empty, no `:`) for deterministic namespace-safe IDs.

## 9) Phase 2C v2: Wire -> Driver (Implemented) - Easy to Hard: 90/100
- [x] Introduce driver virtual input ports (`drv:in:<paramId>`) with strict parser lock.
- [x] Allow graph edges targeting driver params.
- [x] Override driver param values during evaluation when driven (non-mutating resolved params).
- [x] Lock driver UI when driver becomes driven.
- [x] Enforce maxConnectionsIn = 1 for driver inputs.
- [x] Enforce path rejection on driver virtual inputs with parity code:
  - `DRIVER_VIRTUAL_INPUT_PATH_UNSUPPORTED`
- [x] Add determinism/parity tests for driver override behavior, unresolved-driven lock semantics, and cheap/full validation agreement.

## 10) Phase 2C v2.1: Driver Input Auto-Replace (Implemented) - Easy to Hard: 91/100
- [x] Auto-replace applies only to `drv:in:<paramId>` drop targets (scope lock).
- [x] Occupied driver virtual input endpoints accept compatible drops in cheap-check (replace-allowed).
- [x] Exact duplicate re-drop on clean occupied target is a no-op (existing edge preserved).
- [x] Non-identical drop removes existing incoming edge(s) at same driver endpoint and appends one new edge.
- [x] Whole-port endpoint-key lock enforced for driver virtual inputs (`normalizedPathKey = ""`).
- [x] Cycle checks remain enforced at final drop commit on candidate graph.
- [x] Added deterministic helper and tests for replacement/no-op/healing/cycle-sensitive candidate behavior.

## 11) Phase 2C v2.2: Numeric Offset Mode for Driven Drivers (Planned) - Easy to Hard: 90/100

- [ ] Add offsetValue support for numeric nodeParam drivers (same unit as driver).
- [ ] Default offsetValue = 0 when driver first becomes driven.
- [ ] Evaluation rule:
  - drivenValue = resolved value from drv:in:<paramId>
  - effectiveValue = drivenValue + offsetValue
- [ ] Do not apply offset when driver is unresolved; keep unresolved semantics.
- [ ] Ensure driver virtual outputs (drv:<paramId>) emit effectiveValue.
- [ ] Update driverVm.ts to expose drivenValue, offsetValue, and effectiveValue for UI.
- [ ] Update NodeView.tsx driver rows:
  - display drivenValue (read-only)
  - editable offset control (existing slider/drag input)
  - display effectiveValue
  - visual styling change for offset mode.
- [ ] Lock offset feature to numeric drivers only (nodeParamNumber).
- [ ] Validate unit compatibility between driven input and driver unit.
- [ ] Add evaluateGraph tests for deterministic effectiveValue calculation.
- [ ] Add UI tests verifying offset editing updates effective value.
- [ ] Add regression tests for unresolved-driven driver behavior.
- [ ] Run full regression suite (`npm.cmd run test` + `npm.cmd run build`).

## 12) Phase 2B v2+: Feature Wiring Expansion (Future) - Easy to Hard: 90/100
- [ ] Add additional feature input targets beyond `Extrude.depth`.
- [ ] Define feature output endpoints and feature-to-feature/internal wiring semantics.
- [ ] Replace v1 same-node simplification with true "inside same Feature Stack source" checks.
- [ ] Add profileRef wiring support (currently deferred in v1).
- [ ] Add migration/compatibility rules for mixed v1/v2 graphs.

## 13) Phase 3: Optional True Child-Container Migration (Future) - Easy to Hard: 95/100
- [ ] Decide whether Drivers/Inputs/Feature Stack/Outputs should become true child-node containers.
- [ ] If adopted, define schema migration and compatibility window.
- [ ] Keep renderer behavior stable during migration via adapter layer.
- [ ] Keep deterministic ordering and warning behavior through migration.

## 14) Quality Gates Before Declaring "Editor Working" - Easy to Hard: 75/100
- [x] Deterministic graph load/save under repeated normalization.
- [x] Deterministic diagnostics order and content across runs.
- [x] No worker/protocol regressions from app-layer work.
- [x] Clear user-facing diagnostics for all repaired states.
- [x] Changelog updated for each implementation step.
- [x] Phase 2 v1 compile determinism verified (`depth` override path).
- [x] Phase 2 v1 full regression (`npm.cmd run test` + `npm.cmd run build`) passing.
- [x] Phase 2C v2 full regression (`npm.cmd run test` + `npm.cmd run build`) passing.
- [x] Phase 2C v2.1 full regression (`npm.cmd run test` + `npm.cmd run build`) passing.

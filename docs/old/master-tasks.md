# Master Tasks

Legend: `[ ]` todo, `[~]` in progress, `[x]` done

## Current Priority
- [~] Phase 2B v2+: Feature wiring expansion beyond `Extrude.depth` (after Phase 2C v2 closure)

## Active Work
- [ ] Add additional feature input targets beyond `Extrude.depth`.
- [ ] Define feature output endpoints and feature-to-feature/internal wiring semantics.
- [ ] Replace v1 same-node simplification with final semantic source checks.

## Backlog
- [ ] Phase 2B v2: add `profileRef` wiring and compatibility rules.
- [ ] Phase 3: evaluate child-container migration plan and compatibility window.

## Completed
- [x] 2026-03-04: Phase 1 closure (partSlots contract, normalization/invariants, locked section order, diagnostics/tests).
- [x] 2026-03-04: Phase 2A row-order metadata (stable rowIds, normalization, reorder controls, deterministic persistence/tests).
- [x] 2026-03-04: Phase 2B v1 external feature-input wiring (`Extrude.depth` virtual input, resolver unification, validator/evaluator/compile/UI integration, tests/build green).
- [x] 2026-03-04: Phase 2C v1 driver virtual outputs (`drv:<paramId>` to inputs, resolver parity, validation/evaluation/UI pins, tests/build green).
- [x] 2026-03-04: Phase 2C v2 wire->driver (`drv:in:<paramId>`, driven-lock semantics, unresolved-driven behavior, path-rejection parity, tests/build green).

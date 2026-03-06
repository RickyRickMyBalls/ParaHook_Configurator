## Phase 4A v1 - Baseplate Sketch MVP Checklist

Legend: [ ] todo  [~] in progress  [x] done

Scope Locks
[x] Implement Sketch as a Feature Stack composite operation (not a new top-level UI section)
[x] Focus only on Baseplate path for Phase A
[x] Support only single ProfileLoop output
[x] Keep whole-port wiring only in v1
[x] Keep deterministic compile/eval/diagnostic behavior
[x] No worker/protocol/scheduler changes
[ ] Defer ProfileInsert to later phase
[ ] Defer holes, multi-loop, constraints, solver features

Data Structures
[ ] Add feature kind: SketchBuild
[ ] Add feature kind: CloseProfile
[ ] Add sketch plane field on SketchBuild params
[ ] Add ordered components[] on SketchBuild params
[ ] Separate rowId (UI identity) from componentId (semantic identity)
[ ] Add Line component definition
[ ] Add Spline component definition (cubic bezier)
[ ] Add Arc component definition (3-point)
[ ] Add ProfileLoop output shape (single outer loop)
[ ] Add deterministic serialization order for sketch components

Feature Stack Integration
[ ] Add default Baseplate stack sequence: SketchBuild -> CloseProfile -> Extrude
[ ] Ensure CloseProfile consumes SketchBuild output
[ ] Ensure Extrude consumes CloseProfile ProfileLoop output
[ ] Keep existing Extrude depth/taper/offset behavior unchanged

Sketch Component Types (Phase A)
[ ] Line component supported end-to-end
[ ] Spline component supported end-to-end
[ ] Arc component supported end-to-end
[ ] Component row add/remove/reorder supported
[ ] Component row order is compile/eval order

Compiler Pipeline
[ ] Extend compileFeatureStack with SketchBuild operation handling
[ ] Extend compileFeatureStack with CloseProfile operation handling
[ ] Emit deterministic sketch IR command order from component rows
[ ] Apply numeric canonicalization before closure comparison
[ ] Enforce ProfileLoop orientation convention before IR emit
[ ] Map compiled profile into existing Extrude compile path

Validation Rules
[ ] Validate component schema and required fields
[ ] Validate SketchBuild has at least one component
[ ] Validate profile closure (no silent auto-close)
[ ] Emit SKETCH_PROFILE_NOT_CLOSED on open loop
[ ] Emit SKETCH_COMPONENT_TYPE_MISMATCH on invalid wiring
[ ] Emit SKETCH_COMPONENT_PATH_UNSUPPORTED for path-address attempts
[ ] Emit deterministic diagnostics ordering

UI Changes (Feature Row Editors)
[ ] Add SketchBuild feature editor UI
[ ] Add Sketch plane selector
[ ] Add components list with stable row rendering
[ ] Add row controls: Line, Spline, Arc
[ ] Add per-row parameter editors
[ ] Add row output pins for component objects (if enabled in v1 UI)
[ ] Add CloseProfile status row (closed/unresolved + diagnostics)
[ ] Keep NodeView generic (no special-cased Part-only section)

Deterministic Evaluation Rules
[ ] Evaluate Feature Stack strictly in row order
[ ] Evaluate sketch components strictly in row order
[ ] Canonicalize numeric coordinates with fixed precision before comparisons
[ ] Use explicit closure equality rule on canonicalized endpoints
[ ] Normalize final loop winding to defined orientation
[ ] Preserve deterministic unresolved behavior and codes

Testing
[ ] Unit: sketch component type parsing and defaults
[ ] Unit: closure checker (closed/open edge cases)
[ ] Unit: orientation normalization
[ ] Validation tests for sketch-specific diagnostics
[ ] Compile tests for deterministic sketch/profile IR output
[ ] Integration test: Baseplate sketch closes and extrudes into solid
[ ] Snapshot test: identical graph input -> byte-identical IR

Verification
[ ] npm.cmd run test
[ ] npm.cmd run build

Minimal Acceptance
[ ] User can build Baseplate profile from Line/Spline/Arc component rows
[ ] CloseProfile returns one ProfileLoop when closed
[ ] Extrude consumes that ProfileLoop and produces Solid
[ ] Open profile fails deterministically with standardized diagnostics
[ ] No worker/protocol/scheduler changes

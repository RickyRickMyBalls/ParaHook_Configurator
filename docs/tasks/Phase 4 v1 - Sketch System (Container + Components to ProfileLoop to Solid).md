## Phase 4 v1 - Sketch System (Container + Components to ProfileLoop to Solid)

Legend: [ ] todo  [~] in progress  [x] done

Scope Locks
[x] Sketch is a container object (plane + ordered components[]), not a flat param bag
[x] Sketch components own geometry params (Line/Arc/Spline/Polyline/ProfileInsert)
[x] Deterministic component evaluation order follows row order
[x] Whole-port wiring only for SketchComponent objects in v1 (no path addressing)
[x] No worker/protocol/scheduler changes for v1 sketch plumbing
[ ] Lock v1 loop policy to single outer ProfileLoop (Baseplate-first)

Type System
[ ] Add primitive param support for number:<unit>, boolean, vec2
[ ] Add graph object type Sketch2
[ ] Add graph object type SketchComponent2 (tagged union)
[ ] Add component object tags Line2, Arc2, Spline2, Polyline2
[ ] Add component object tag ProfileInsert2
[ ] Add graph object type ProfileLoop
[ ] Confirm Solid output type compatibility from feature stack

Sketch Data Model (Part Node Params)
[ ] Add node.params.sketch2 = { plane, components: SketchComponentDef[] }
[ ] Add stable row identity key rowId (UI/wiring identity)
[ ] Add stable component identity key componentId (semantic identity)
[ ] Implement LineDef { id, a: Vec2Expr, b: Vec2Expr }
[ ] Implement SplineDef { id, p0: Vec2Expr, p1: Vec2Expr, p2: Vec2Expr, p3: Vec2Expr }
[ ] Implement ArcDef shape for v1 parity
[ ] Implement ProfileInsertDef { id, profileRef: ProfileLoopRefExpr }
[ ] Preserve deterministic serialization order for components[]

Port and Wiring Model
[ ] Expose component row output pin skc:<componentId> with type SketchComponent2
[ ] Add Sketch Components drop target surface (instead of raw array input)
[ ] Enforce maxConnectionsIn = 1 for row input pins
[ ] Add type rule: ProfileLoop source can connect only to ProfileInsert row input
[ ] Add type rule: SketchComponent2 source can connect only to imported component input (if enabled)
[ ] Keep v1 whole-port only behavior and reject path addressing

Auto-Insert UX (Atomic Graph Patch)
[ ] Add drop handler for Sketch Components surface
[ ] On ProfileLoop drop, create ProfileInsert row and wire source -> row input
[ ] On SketchComponent2 drop, create imported component row and wire source -> row input (if enabled)
[ ] Support explicit insertion index from hover target
[ ] Fall back to append when no index is provided
[ ] Apply create-row + insert + wire as one undoable atomic patch
[ ] Ensure deterministic patch result given same graph + drop payload

Sketch Build and Closure
[ ] Implement SketchBuild evaluator from ordered component rows
[ ] Implement CloseProfile operation: Sketch2 -> ProfileLoop
[ ] v1 closure check: strict resolved endpoint equality (documented)
[ ] Emit unresolved output + diagnostic when not closed (no silent auto-close)
[ ] Define and enforce loop orientation convention for ProfileLoop
[ ] Add numeric canonicalization policy before closure comparison (deterministic precision)

Feature Stack Integration
[ ] Add feature operation node SketchBuild in stack pipeline
[ ] Add feature operation node CloseProfile in stack pipeline
[ ] Ensure Offset2D accepts ProfileLoop and returns ProfileLoop
[ ] Ensure Extrude consumes ProfileLoop and returns Solid
[ ] Keep Replicad mapping only in compileFeatureStack (not UI)

Compiler and IR
[ ] Extend compileFeatureStack for SketchBuild + CloseProfile + Offset2D + Extrude chain
[ ] Emit ordered Sketch IR components deterministically
[ ] Emit Profile IR referencing closure result deterministically
[ ] Emit Extrude IR consuming profile + depth/taper/offset
[ ] Preserve existing deterministic IR ordering guarantees

Validation and Diagnostics
[ ] Extend validateGraph for sketch row pin compatibility
[ ] Add diagnostic code SKETCH_PROFILE_NOT_CLOSED
[ ] Add diagnostic code SKETCH_COMPONENT_TYPE_MISMATCH
[ ] Add diagnostic code SKETCH_COMPONENT_PATH_UNSUPPORTED
[ ] Add diagnostic code SKETCH_COMPONENT_DANGLING_INPUT
[ ] Ensure deterministic diagnostic ordering across validation/evaluation

NodeView UI
[ ] Add Sketch section to Part NodeView
[ ] Add Components list with ordered rows
[ ] Add row add actions: Line, Spline, Arc, Insert Profile
[ ] Add stable drag reorder for component rows
[ ] Add per-row output pins (and input pins where applicable)
[ ] Add drop zone UI: "Drop Profile / Drop Component here"
[ ] Lock local editors for driven params and show resolved values
[ ] Preserve generic NodeView architecture

Testing
[ ] Type tests for new object/param type registrations
[ ] Reducer/store tests for sketch row create/remove/reorder determinism
[ ] Validation tests for allowed/disallowed sketch connections
[ ] Evaluation tests for SketchBuild + CloseProfile resolved/unresolved behavior
[ ] Compiler tests for deterministic Sketch/Profile/Extrude IR output
[ ] UI tests for row rendering, drop-zone behavior, driven-lock behavior
[ ] Snapshot test: identical graph input => byte-identical IR output

Verification
[ ] npm.cmd run test
[ ] npm.cmd run build

Phased Delivery
[ ] Phase A - Baseplate Sketch MVP: row storage + Line/Spline/Arc editors + CloseProfile + Extrude consume ProfileLoop
[ ] Phase B - Auto-Insert Profile: ProfileInsert row + drop handler + deterministic insertion index
[ ] Phase C - Wireable Sketch Params: per-row virtual inputs + Vec2 param node support
[ ] Phase D - Offset and Multi-Loop Prep: Offset2D inner/outer + groundwork for ProfileRegion (outer + holes)

Acceptance
[ ] Users can construct a baseplate profile entirely from sketch component rows
[ ] Users can produce one closed ProfileLoop deterministically from Sketch2
[ ] Users can drop ProfileLoop onto Sketch and auto-create/wire ProfileInsert row
[ ] Extrude can consume sketch-produced ProfileLoop with existing depth/taper/offset wiring
[ ] Validation/evaluation/compile/UI all agree on sketch wiring semantics
[ ] No worker/protocol/scheduler changes

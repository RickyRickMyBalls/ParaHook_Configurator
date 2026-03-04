PARAHOOK MASTER PLAN (UPDATED)
Phase 1 — Engine Stability

Status: Complete

 Warm worker lifecycle

 Latest-only rebuild scheduling

 Stale-drop protection

 Deterministic build envelope

 STEP/STL export pipeline

Phase 2 — Canonical Layout System

Status: Complete

 Canonical layout representation

 Deterministic sanitizeLayoutMm

 Segment operations (pure)

 Layout joints + shrink rules

 Jake mode writes canonical layout

 Legacy adapter preserved

Phase 3 — Spaghetti Graph System

Status: Complete

Canvas + Node UX

 Node add menu with search

 Typed port colors

 Floating editor anchoring

 Node port layout (inputs TL, outputs BR)

 Panel collapsible sections

Wiring System

 Curviness slider

 Reroute points

 Tangent enforcement

 Waypoint segment routing

Composite Field System

 fieldTree composite introspection

 vec2 composite mapping

 composite parent/leaf UI

Path Endpoint Architecture

 EdgeEndpoint { nodeId, portId, path }

 path-aware anchors

 path-aware connection validation

 path-aware rewire logic

Compiler / Runtime

 deterministic composite assembly

 leaf-path precedence

 whole-port fallback

 literal fallback

 type-default fallback

Composite UX

 inline collapsed vec2 controls

 whole-port driven authority mode

 leaf-axis disable logic

 composite parent context menu

 break/group pins

 show/hide info

 warning badge for mixed graphs

Tests

 fieldTree tests

 validateGraph tests

 evaluateGraph tests

Phase 4 — Feature Stack v1

Status: Pending (next milestone)

This phase introduces parametric feature modeling inside Part nodes.

4.1 Feature Stack Core

Status: Pending

 Add FeatureStack data model

 Add SketchFeature

 Add ExtrudeFeature

 Stable ID system:

 featureId

 entityId

 profileId

 bodyId

 Zod schema for feature stack

4.2 Deterministic Profile Derivation

Status: Pending

 Implement canonical deriveProfiles

 Implement deterministic adjacency graph

 Implement deterministic cycle traversal

 Canonical signature generation

 Implement FNV-1a 32-bit hash

 profileId = prof_<base36>

 Deterministic profile sorting:

area desc

signature asc

profileId asc

4.3 Extrude Auto-Link

Status: Pending

 Implement pickDefaultProfileRef

 nearest prior sketch search

 single profile auto-select

 multi-profile → largest area

 null when no valid profile

4.4 Diagnostics Layer

Status: Pending

 Diagnostic type

 getFeatureDiagnostics

 warning: extrude missing profile

 error: sketch missing

 error: profile missing

 non-blocking UI behavior

4.5 Feature Stack UI

Status: Pending

Panel added to all Part/* nodes.

 FeatureStackView

 SketchFeatureView

 ExtrudeFeatureView

 append after uiSections

 preserve params JSON panel

UI behaviors

 + Sketch button

 + Extrude button

 sketch summary: "N lines, M profiles"

 extrude summary:

Profile: <SketchShort>/<ProfileLabel>, Depth: <value>

 profile labels A..Z then numeric fallback

 sketch dropdown restricted to prior sketches

 profile dropdown deterministic order

 reuse inline vec2 editors

4.6 Compile Integration

Status: Pending

 implement compileFeatureStack

 produce IR ops:

IRSketch
IRExtrude

 attach IR to compile output

resolvedShared.sp_featureStackIR
4.7 Payload Integration

Status: Pending

Emit into:

profile.sp_featureStackIR

Shape:

{
  schemaVersion: 1,
  parts: Record<PartKey, IR[]>
}

Rules:

 include all existing part keys

 deterministic key order

 empty arrays allowed

4.8 Patch Churn Control

Status: Pending

 extend spProfileKeys

 include sp_featureStackIR

 emit patch when IR exists

 emit null once when IR removed

 stable JSON hashing for change detection

4.9 Store Integration

Status: Pending

Update useSpaghettiStore:

 getPartFeatureStack

 setPartFeatureStack

 recompute sketch profiles on edit

 use canonical APIs:

deriveProfiles

pickDefaultProfileRef

4.10 Tests

Status: Pending

profileDerivation

 rectangle test

 multi-loop sort test

 signature rotation equivalence test

autoLink

 nearest sketch

 multi-profile selection

 null behavior

Regression

 npm run test

 npm run build

Phase 5 — Feature Stack v2 (Future)

Status: Not started

 Boolean operations

 Multiple bodies

 Feature reordering

 Feature suppression

 driver expressions

 sketch constraints

 sketch editor canvas

Phase 6 — State History

Status: Not started

 undo / redo middleware

 history compression

 worker rebuild isolation

Phase 7 — Multi-Product Scaling

Status: Not started

 product-agnostic part nodes

 reusable feature IR

 product adapters

Current Status
Phase 1  COMPLETE
Phase 2  COMPLETE
Phase 3  COMPLETE
Phase 4  NEXT

Immediate next milestone:

Implement Feature Stack v1.
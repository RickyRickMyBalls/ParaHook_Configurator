Next task: Implement the Phase 4A runtime bridge that converts analytic ProfileLoop segments into runtime vertex loops used by the existing sketch runtime op.

Context

The system now produces analytic sketch geometry:

ProfileLoop {
  segments: Segment2[]
}

Segment2 is one of:
- Line2
- Bezier2 (cubic)
- Arc3pt2

Sketch and closeProfile are evaluated analytically in the app layer. However the current worker runtime still expects vertex loops for sketch execution.

Therefore we must add a deterministic conversion step at the compile → worker boundary.

Important constraints

- Do NOT change worker protocol shape.
- Worker ops remain only:
  - sketch
  - extrude
- closeProfile remains compile-time only.
- Analytic segments remain authoritative in the app model.
- Tessellation occurs ONLY when building the worker payload.

Goal

Implement a deterministic tessellation step that converts:

ProfileLoop.segments → vec2[] vertex loop

This happens only in the compileGraph / compileFeatureStack boundary before sending the payload to the worker.

Implementation requirements

1) Create a tessellation module

Create a new module:

src/app/spaghetti/features/tessellateProfileLoop.ts

Export:

tessellateProfileLoop(profileLoop: ProfileLoop): Vec2[]

Segment conversion rules:

Line2
- Emit the segment start point.
- The final segment emits its end point.

Bezier2
- Fixed step sampling.
- Use constant:
  CURVE_TESSELLATION_BEZIER_STEPS = 24
- Use uniform parameter t from 0..1.
- Do not emit duplicate points between segments.

Arc3pt2
- Compute circle through start, mid, end.
- Determine arc direction.
- Use constant:
  CURVE_TESSELLATION_ARC_STEPS = 24
- Sample deterministic angles.

2) Canonical numeric rules

Use the same canonicalization rule used elsewhere:

round6(x) = Number(x.toFixed(6))

Apply to all emitted vertex coordinates.

3) Orientation enforcement

After tessellation:

- Compute signed polygon area.
- If winding is clockwise, reverse vertices to enforce CCW.

4) Compile boundary integration

Update compileGraph.ts (or compileFeatureStack.ts depending on where payload is assembled):

When emitting the runtime sketch payload:

- Convert analytic ProfileLoop.segments → vertex loops via tessellateProfileLoop.
- Pass vertices to the runtime sketch op.

Do NOT modify runtime ops or schemaVersion.

5) Determinism rules

The tessellation must be deterministic given identical input.

Constants must be centralized:

CURVE_TESSELLATION_BEZIER_STEPS
CURVE_TESSELLATION_ARC_STEPS
CANON_PRECISION = 1e-6

6) Tests

Add tests covering:

compileGraph.test.ts
- identical analytic sketch input → identical runtime payload JSON

profileDerivation.test.ts
- closure preserved after tessellation
- CCW orientation enforced

tessellateProfileLoop.test.ts
- deterministic output for line
- deterministic output for bezier
- deterministic output for arc3pt

7) Non-goals

Do NOT implement:

- arc-length sampling
- adaptive tessellation
- sketch component wiring
- profile holes
- multi-loop profiles
- worker op changes

Acceptance criteria

- Existing worker sketch + extrude pipeline still runs unchanged.
- Baseplate sketch can be converted to a runtime vertex loop.
- Payload determinism tests pass.
- npm run test passes.
- npm run build passes.
DETAILED TASK LIST — Phase 4A Runtime Bridge (Analytic ProfileLoop → Runtime Vertices)

Legend: [ ] todo  [~] in progress  [x] done

------------------------------------------------
0) RECON + CONTRACT LOCK
------------------------------------------------
[ ] 0.1 Locate where worker payload is assembled (compileGraph.ts vs compileFeatureStack.ts).
[ ] 0.2 Locate runtime sketch op input shape in worker (what field holds loop vertices).
[ ] 0.3 Lock the “runtime vertices” format:
        - Vec2 array shape (x,y)
        - closure rule (explicit last==first OR implicit closure)
        - expected CCW/CW requirement (we enforce CCW anyway)
[ ] 0.4 Identify current profile container in runtime IR:
        - profilesResolved? profileLoops? profileId/index mapping?
[ ] 0.5 Add a small comment near the payload assembly stating:
        “analytic segments are tessellated only here for runtime compatibility”.

------------------------------------------------
1) NEW MODULE: TESSELLATION
------------------------------------------------
[ ] 1.1 Create file:
        src/app/spaghetti/features/tessellateProfileLoop.ts
[ ] 1.2 Define constants in ONE place (export them):
        CURVE_TESSELLATION_BEZIER_STEPS = 24
        CURVE_TESSELLATION_ARC_STEPS = 24
        CANON_DECIMALS = 6
[ ] 1.3 Add helpers:
        round6(x): number
        canonVec2({x,y}): {x,y}
        vec2Eq(a,b): boolean (exact equality post-canon)
[ ] 1.4 Implement tessellateLine2(line):
        - emit start
        - caller controls end emission to avoid duplicates
[ ] 1.5 Implement tessellateBezier2(bezier):
        - sample uniform t sequence deterministically
        - emit points excluding last point (unless caller says “final”)
        - use standard cubic Bezier evaluation formula
        - canon each point
[ ] 1.6 Implement tessellateArc3pt2(arc):
        - compute circle from 3 points deterministically
        - determine start angle / end angle
        - determine direction (lock rule: follow orientation passing through mid)
        - sample fixed step count
        - canon each point
[ ] 1.7 Implement main:
        tessellateProfileLoop(profileLoop):
        - iterate segments in order
        - append points with duplicate suppression at joints
        - ensure closure rule at end (match runtime expectation)
        - enforce CCW winding (reverse if needed)
        - return vertices

------------------------------------------------
2) ORIENTATION + CLOSURE UTILITIES
------------------------------------------------
[ ] 2.1 Implement signedArea(vertices) (deterministic).
[ ] 2.2 Implement ensureCCW(vertices):
        - if area < 0 => reverse
[ ] 2.3 Implement ensureClosed(vertices):
        - if runtime wants explicit closure:
            if first != last => append first
        - else keep open polyline but document it
[ ] 2.4 Add “no-duplicate” rule:
        - do not emit identical consecutive vertices
        - ensure last point equals first only once (no double-close)

------------------------------------------------
3) COMPILE BOUNDARY INTEGRATION (ONLY PLACE IT HAPPENS)
------------------------------------------------
[ ] 3.1 Import tessellateProfileLoop into the payload assembly module.
[ ] 3.2 At the point where runtime IRSKetch is built:
        - for each analytic ProfileLoop:
            vertices = tessellateProfileLoop(loop)
            emit into runtime profile container field
[ ] 3.3 Confirm extrude’s profileRef resolution still works:
        - profileId/profileIndex mapping unchanged
        - closeProfile remap already implemented in compile step
[ ] 3.4 Ensure schemaVersion unchanged and runtime ops unchanged:
        - ops remain: sketch, extrude
[ ] 3.5 Ensure stable ordering:
        - feature stack order preserved
        - profiles within a sketch emitted in stable index order (4A: index 0)

------------------------------------------------
4) TESTS — UNIT
------------------------------------------------
[ ] 4.1 Create:
        src/app/spaghetti/features/tessellateProfileLoop.test.ts
[ ] 4.2 Line test:
        - one Line2 segment -> expected vertices (canon applied)
        - no duplicates
[ ] 4.3 Bezier test:
        - fixed input -> stable vertex count and stable first/last
        - repeated run equality
[ ] 4.4 Arc3pt test:
        - simple 90° arc -> stable count and direction passes through mid
        - repeated run equality
[ ] 4.5 CCW enforcement test:
        - feed a CW loop -> output becomes CCW deterministically
[ ] 4.6 Closure test:
        - open input -> closure behavior matches locked runtime expectation

------------------------------------------------
5) TESTS — COMPILER PAYLOAD DETERMINISM
------------------------------------------------
[ ] 5.1 Update/add:
        src/app/spaghetti/compiler/compileGraph.test.ts
[ ] 5.2 Build a minimal graph/stack fixture:
        sketch (line rectangle) -> closeProfile -> extrude
[ ] 5.3 Assert:
        - payload JSON is byte-identical across two compiles
        - schemaVersion remains 1
        - runtime ops list contains only sketch/extrude
        - runtime sketch profile vertices are present and CCW
[ ] 5.4 Assert tessellation constants are applied:
        - bezier/arc vertex counts match constants (when used)

------------------------------------------------
6) END-TO-END SANITY (LOCAL DEV)
------------------------------------------------
[ ] 6.1 Run:
        npm.cmd run test
[ ] 6.2 Run:
        npm.cmd run build
[ ] 6.3 Manually verify in UI:
        - Baseplate sketch closes
        - extrude runs
        - worker returns body/mesh artifact as before

------------------------------------------------
7) CHANGELOG + DOCS
------------------------------------------------
[ ] 7.1 Add listofchanges entry:
        “Phase 4A: Runtime tessellation bridge (analytic → vertices)”
[ ] 7.2 Mention:
        - no worker/protocol changes
        - constants locked
        - determinism snapshot added

------------------------------------------------
ACCEPTANCE
------------------------------------------------
[ ] A) Analytic ProfileLoop.segments converts deterministically to runtime vertices.
[ ] B) Worker runtime still receives only sketch/extrude ops.
[ ] C) Baseplate pipeline runs through worker (sketch → extrude).
[ ] D) Determinism tests pass (byte-identical payload).
[ ] E) npm.cmd run test + npm.cmd run build pass.
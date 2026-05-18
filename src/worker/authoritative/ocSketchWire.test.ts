import { describe, expect, it, vi } from 'vitest'
import { buildOcSketchProfileFace, buildOcSketchProfileWire } from './ocSketchWire'

const createFakeRuntime = (options?: {
  edgeDelete?: ReturnType<typeof vi.fn>
  wireDelete?: ReturnType<typeof vi.fn>
  faceDelete?: ReturnType<typeof vi.fn>
  failFaceConstruction?: boolean
  failSingleCurveEdgeConstruction?: boolean
}) => {
  const edgeKinds: string[] = []
  const edgeArgCounts: number[] = []
  const wireEdgeCounts: number[] = []
  const faceBuildCounts: number[] = []
  const pointCoords: Array<{ x: number; y: number; z: number }> = []

  class gp_Pnt {
    public readonly x: number
    public readonly y: number
    public readonly z: number

    public constructor(x: number, y: number, z: number) {
      this.x = x
      this.y = y
      this.z = z
      pointCoords.push({ x, y, z })
    }

    public delete(): void {}
  }

  class TColgp_Array1OfPnt {
    public readonly values = new Map<number, gp_Pnt>()
    public readonly lower: number
    public readonly upper: number

    public constructor(lower: number, upper: number) {
      this.lower = lower
      this.upper = upper
    }

    public SetValue(index: number, point: gp_Pnt): void {
      this.values.set(index, point)
    }

    public delete(): void {}
  }

  class Geom_BezierCurve {
    public readonly points: TColgp_Array1OfPnt

    public constructor(points: TColgp_Array1OfPnt) {
      this.points = points
    }

    public delete(): void {}
  }

  class FakeArcCurve {
    public get(): FakeArcCurveValue {
      return new FakeArcCurveValue()
    }

    public delete(): void {}
  }

  class FakeArcCurveValue {
    public delete(): void {}
  }

  class Handle_Geom_Curve {
    public readonly curve: Geom_BezierCurve | FakeArcCurveValue

    public constructor(curve: Geom_BezierCurve | FakeArcCurve | FakeArcCurveValue) {
      if (curve instanceof FakeArcCurve) {
        throw new Error('trimmed curve handle must be unwrapped before upcast')
      }
      this.curve = curve
    }

    public delete(): void {}
  }

  class GC_MakeArcOfCircle {
    public readonly start: gp_Pnt
    public readonly mid: gp_Pnt
    public readonly end: gp_Pnt

    public constructor(start: gp_Pnt, mid: gp_Pnt, end: gp_Pnt) {
      this.start = start
      this.mid = mid
      this.end = end
    }

    public Value(): FakeArcCurve {
      return new FakeArcCurve()
    }

    public delete(): void {}
  }

  class BRepBuilderAPI_MakeEdge {
    public readonly args: unknown[]

    public constructor(...args: unknown[]) {
      const [first] = args
      const source = first instanceof Handle_Geom_Curve ? first.curve : first
      if (
        options?.failSingleCurveEdgeConstruction === true &&
        args.length === 1 &&
        (source instanceof Geom_BezierCurve || source instanceof FakeArcCurveValue)
      ) {
        throw new Error('single curve edge construction unavailable')
      }
      this.args = args
    }

    public Edge(): { kind: string; delete: ReturnType<typeof vi.fn> } {
      const [first] = this.args
      const source = first instanceof Handle_Geom_Curve ? first.curve : first
      const kind =
        source instanceof gp_Pnt
          ? 'line2'
          : source instanceof Geom_BezierCurve
            ? 'bezier2'
            : 'arc3pt2'
      edgeKinds.push(kind)
      edgeArgCounts.push(this.args.length)
      return {
        kind,
        delete: options?.edgeDelete ?? vi.fn(),
      }
    }

    public delete(): void {}
  }

  class BRepBuilderAPI_MakeWire {
    private readonly edges: unknown[] = []

    public Add(edge: unknown): void {
      this.edges.push(edge)
    }

    public Wire(): { delete: ReturnType<typeof vi.fn> } {
      wireEdgeCounts.push(this.edges.length)
      return {
        delete: options?.wireDelete ?? vi.fn(),
      }
    }

    public delete(): void {}
  }

  class BRepBuilderAPI_MakeFace {
    public readonly wire: { delete: ReturnType<typeof vi.fn> }

    public constructor(wire: { delete: ReturnType<typeof vi.fn> }) {
      this.wire = wire
    }

    public Face(): { delete: ReturnType<typeof vi.fn> } {
      if (options?.failFaceConstruction) {
        throw new Error('face build failed')
      }
      faceBuildCounts.push(1)
      return {
        delete: options?.faceDelete ?? vi.fn(),
      }
    }

    public delete(): void {}
  }

  const oc = {
    gp_Pnt,
    TColgp_Array1OfPnt,
    Geom_BezierCurve,
    Handle_Geom_Curve,
    GC_MakeArcOfCircle,
    BRepBuilderAPI_MakeEdge,
    BRepBuilderAPI_MakeWire,
    BRepBuilderAPI_MakeFace,
  }

  return {
    edgeKinds,
    edgeArgCounts,
    wireEdgeCounts,
    faceBuildCounts,
    pointCoords,
    runtime: {
      oc,
      constructOcValue: (target: Record<string, unknown>, constructorName: string, args: unknown[]) =>
        Reflect.construct(
          target[constructorName] as new (...ctorArgs: unknown[]) => unknown,
          args,
        ),
      invokeOcMethod: (target: object, methodNames: readonly string[], args: unknown[]) => {
        for (const methodName of methodNames) {
          const candidate = (target as Record<string, unknown>)[methodName]
          if (typeof candidate === 'function') {
            return candidate.apply(target, args)
          }
        }
        throw new Error(`Method unavailable: ${methodNames.join(' | ')}`)
      },
      releaseOcResources: (resources: readonly { delete?: () => void }[]) => {
        for (const resource of resources) {
          resource.delete?.()
        }
      },
    },
  }
}

describe('buildOcSketchProfileWire', () => {
  it('lowers typed line, bezier, and arc segments into one OC wire', () => {
    const { runtime, edgeKinds, wireEdgeCounts } = createFakeRuntime()

    const result = buildOcSketchProfileWire(runtime, {
      profileId: 'profile-1',
      profileIndex: 0,
      area: 42,
      loop: {
        winding: 'CCW',
        segments: [
          {
            kind: 'line2',
            a: { x: 0, y: 0 },
            b: { x: 10, y: 0 },
          },
          {
            kind: 'bezier2',
            p0: { x: 10, y: 0 },
            p1: { x: 12, y: 2 },
            p2: { x: 12, y: 8 },
            p3: { x: 10, y: 10 },
          },
          {
            kind: 'arc3pt2',
            start: { x: 10, y: 10 },
            mid: { x: 4, y: 12 },
            end: { x: 0, y: 0 },
          },
        ],
      },
      verticesProxy: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ],
    })

    expect(result).not.toBeNull()
    expect(edgeKinds).toEqual(['line2', 'bezier2', 'arc3pt2'])
    expect(wireEdgeCounts).toEqual([3])
    expect(result?.ownedResources).toHaveLength(4)
  })

  it('falls back to bounded curve edge overloads for first-class circle arcs', () => {
    const { runtime, edgeKinds, edgeArgCounts, wireEdgeCounts } = createFakeRuntime({
      failSingleCurveEdgeConstruction: true,
    })

    const result = buildOcSketchProfileWire(runtime, {
      profileId: 'profile-circle',
      profileIndex: 0,
      area: 1256,
      loop: {
        winding: 'CCW',
        segments: [
          {
            kind: 'arc3pt2',
            start: { x: 20, y: 0 },
            mid: { x: 0, y: 20 },
            end: { x: -20, y: 0 },
          },
          {
            kind: 'arc3pt2',
            start: { x: -20, y: 0 },
            mid: { x: 0, y: -20 },
            end: { x: 20, y: 0 },
          },
        ],
      },
      verticesProxy: [
        { x: 20, y: 0 },
        { x: 0, y: 20 },
        { x: -20, y: 0 },
        { x: 0, y: -20 },
      ],
    })

    expect(result).not.toBeNull()
    expect(edgeKinds).toEqual(['arc3pt2', 'arc3pt2'])
    expect(edgeArgCounts).toEqual([3, 3])
    expect(wireEdgeCounts).toEqual([2])
  })

  it('can build a planar face from the lowered wire with projected world-space points', () => {
    const { runtime, faceBuildCounts, pointCoords } = createFakeRuntime()

    const result = buildOcSketchProfileFace(
      {
        ...runtime,
        projectSketchPoint: (point) => ({
          x: point.x + 100,
          y: point.y + 200,
          z: 5,
        }),
      },
      {
        profileId: 'profile-face',
        profileIndex: 0,
        area: 100,
        loop: {
          winding: 'CCW',
          segments: [
            {
              kind: 'line2',
              a: { x: 0, y: 0 },
              b: { x: 10, y: 0 },
            },
            {
              kind: 'line2',
              a: { x: 10, y: 0 },
              b: { x: 10, y: 10 },
            },
            {
              kind: 'line2',
              a: { x: 10, y: 10 },
              b: { x: 0, y: 10 },
            },
            {
              kind: 'line2',
              a: { x: 0, y: 10 },
              b: { x: 0, y: 0 },
            },
          ],
        },
        verticesProxy: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 0, y: 10 },
        ],
      },
    )

    expect(result).not.toBeNull()
    expect(faceBuildCounts).toEqual([1])
    expect(pointCoords.slice(0, 2)).toEqual([
      { x: 100, y: 200, z: 5 },
      { x: 110, y: 200, z: 5 },
    ])
    expect(result?.ownedResources).toHaveLength(6)
  })

  it('returns null for profiles with no loop segments', () => {
    const { runtime } = createFakeRuntime()

    expect(
      buildOcSketchProfileWire(runtime, {
        profileId: 'profile-empty',
        profileIndex: 0,
        area: 0,
        loop: {
          winding: 'CCW',
          segments: [],
        },
        verticesProxy: [],
      }),
    ).toBeNull()
  })

  it('returns null for open or disconnected segment chains before OC resources are created', () => {
    const { runtime, edgeKinds, wireEdgeCounts, pointCoords } = createFakeRuntime()

    expect(
      buildOcSketchProfileWire(runtime, {
        profileId: 'profile-open',
        profileIndex: 0,
        area: 10,
        loop: {
          winding: 'CCW',
          segments: [
            {
              kind: 'line2',
              a: { x: 0, y: 0 },
              b: { x: 10, y: 0 },
            },
            {
              kind: 'line2',
              a: { x: 20, y: 0 },
              b: { x: 20, y: 10 },
            },
            {
              kind: 'line2',
              a: { x: 20, y: 10 },
              b: { x: 0, y: 0 },
            },
          ],
        },
        verticesProxy: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 20, y: 10 },
        ],
      }),
    ).toBeNull()
    expect(edgeKinds).toEqual([])
    expect(wireEdgeCounts).toEqual([])
    expect(pointCoords).toEqual([])
  })

  it('releases lowered wire resources when face construction fails after wire creation', () => {
    const edgeDelete = vi.fn()
    const wireDelete = vi.fn()
    const { runtime, faceBuildCounts } = createFakeRuntime({
      edgeDelete,
      wireDelete,
      failFaceConstruction: true,
    })

    expect(
      buildOcSketchProfileFace(runtime, {
        profileId: 'profile-face-failure',
        profileIndex: 0,
        area: 100,
        loop: {
          winding: 'CCW',
          segments: [
            {
              kind: 'line2',
              a: { x: 0, y: 0 },
              b: { x: 10, y: 0 },
            },
            {
              kind: 'line2',
              a: { x: 10, y: 0 },
              b: { x: 10, y: 10 },
            },
            {
              kind: 'line2',
              a: { x: 10, y: 10 },
              b: { x: 0, y: 10 },
            },
            {
              kind: 'line2',
              a: { x: 0, y: 10 },
              b: { x: 0, y: 0 },
            },
          ],
        },
        verticesProxy: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 0, y: 10 },
        ],
      }),
    ).toBeNull()
    expect(faceBuildCounts).toEqual([])
    expect(edgeDelete).toHaveBeenCalledTimes(4)
    expect(wireDelete).toHaveBeenCalledTimes(1)
  })
})

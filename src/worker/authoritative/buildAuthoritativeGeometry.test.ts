import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CompiledBuildData } from '../../shared/buildTypes'
import type { ProfileLoop } from '../../shared/sketchTypes'
import { releaseAuthoritativeShapeSets, resetAuthoritativeShapeSetsForTests } from '../authoritativeGeometryStore'

const { getOcMock } = vi.hoisted(() => ({
  getOcMock: vi.fn(),
}))

vi.mock('../oc/ocInit', () => ({
  getOc: getOcMock,
}))

import { buildAuthoritativeGeometry } from './buildAuthoritativeGeometry'

const rectangleProfileLoop = {
  segments: [
    {
      kind: 'line2' as const,
      a: { x: 0, y: 0 },
      b: { x: 20, y: 0 },
    },
    {
      kind: 'line2' as const,
      a: { x: 20, y: 0 },
      b: { x: 20, y: 20 },
    },
    {
      kind: 'line2' as const,
      a: { x: 20, y: 20 },
      b: { x: 0, y: 20 },
    },
    {
      kind: 'line2' as const,
      a: { x: 0, y: 20 },
      b: { x: 0, y: 0 },
    },
  ],
  winding: 'CCW' as const,
}

const triangleProfileLoop = {
  segments: [
    {
      kind: 'line2' as const,
      a: { x: 0, y: 0 },
      b: { x: 20, y: 0 },
    },
    {
      kind: 'line2' as const,
      a: { x: 20, y: 0 },
      b: { x: 10, y: 15 },
    },
    {
      kind: 'line2' as const,
      a: { x: 10, y: 15 },
      b: { x: 0, y: 0 },
    },
  ],
  winding: 'CCW' as const,
}

const circleProfileLoop = {
  segments: [
    {
      kind: 'arc3pt2' as const,
      start: { x: 20, y: 0 },
      mid: { x: 0, y: 20 },
      end: { x: -20, y: 0 },
    },
    {
      kind: 'arc3pt2' as const,
      start: { x: -20, y: 0 },
      mid: { x: 0, y: -20 },
      end: { x: 20, y: 0 },
    },
  ],
  winding: 'CCW' as const,
}

const openProfileLoop = {
  segments: [
    {
      kind: 'line2' as const,
      a: { x: 0, y: 0 },
      b: { x: 20, y: 0 },
    },
    {
      kind: 'line2' as const,
      a: { x: 30, y: 0 },
      b: { x: 20, y: 20 },
    },
    {
      kind: 'line2' as const,
      a: { x: 20, y: 20 },
      b: { x: 0, y: 0 },
    },
  ],
  winding: 'CCW' as const,
}

const resolvedProfile = (
  profileId: string,
  options?: {
    loop?: ProfileLoop
    verticesProxy?: Array<{ x: number; y: number }>
  },
) => ({
  profileId,
  profileIndex: 0,
  area: 400,
  loop: options?.loop ?? rectangleProfileLoop,
  verticesProxy:
    options?.verticesProxy ?? [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 20 },
      { x: 0, y: 20 },
    ],
})

const resolvedProfileRef = (sketchFeatureId: string, profileId: string) => ({
  sketchFeatureId,
  profileId,
  profileIndex: 0,
})

const profileSelectionAllFromSketch = (sketchFeatureId: string) => ({
  mode: 'allFromSketch' as const,
  sketchFeatureId,
})

const profileSelectionContributors = (
  contributors: Array<
    | {
        kind: 'allFromSketch'
        sketchFeatureId: string
      }
    | {
        kind: 'single'
        sketchFeatureId: string
        profileId: string
        profileIndex: number
      }
  >,
) => ({
  mode: 'contributors' as const,
  contributors,
})

const cubeCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['cube'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        cube: [
          {
            op: 'sketch',
            featureId: 'cube-sketch-1',
            profilesResolved: [resolvedProfile('cube-profile-1')],
          },
          {
            op: 'extrude',
            featureId: 'cube-extrude-1',
            profileRef: resolvedProfileRef('cube-sketch-1', 'cube-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'cube-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const wallsCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['walls'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        walls: [
          {
            op: 'sketch',
            featureId: 'walls-sketch-1',
            profilesResolved: [resolvedProfile('walls-profile-1')],
          },
          {
            op: 'extrude',
            featureId: 'walls-extrude-1',
            profileRef: resolvedProfileRef('walls-sketch-1', 'walls-profile-1'),
            extrudeType: 'Walls',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'walls-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const multiCubeCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['cube#1', 'cube#2'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        'cube#1': [
          {
            op: 'sketch',
            featureId: 'cube-1-sketch-1',
            profilesResolved: [resolvedProfile('cube-1-profile-1')],
          },
          {
            op: 'extrude',
            featureId: 'cube-1-extrude-1',
            profileRef: resolvedProfileRef('cube-1-sketch-1', 'cube-1-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'cube-body-1',
          },
        ],
        'cube#2': [
          {
            op: 'sketch',
            featureId: 'cube-2-sketch-1',
            profilesResolved: [resolvedProfile('cube-2-profile-1')],
          },
          {
            op: 'extrude',
            featureId: 'cube-2-extrude-1',
            profileRef: resolvedProfileRef('cube-2-sketch-1', 'cube-2-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'cube-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const triangleCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['triangle'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        triangle: [
          {
            op: 'sketch',
            featureId: 'triangle-sketch-1',
            profilesResolved: [
              resolvedProfile('triangle-profile-1', {
                loop: triangleProfileLoop,
                verticesProxy: [
                  { x: 0, y: 0 },
                  { x: 20, y: 0 },
                  { x: 10, y: 15 },
                ],
              }),
            ],
          },
          {
            op: 'extrude',
            featureId: 'triangle-extrude-1',
            profileRef: resolvedProfileRef('triangle-sketch-1', 'triangle-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'triangle-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const circleCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['circle'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        circle: [
          {
            op: 'sketch',
            featureId: 'circle-sketch-1',
            profilesResolved: [
              resolvedProfile('circle-profile-1', {
                loop: circleProfileLoop,
                verticesProxy: [
                  { x: 20, y: 0 },
                  { x: 0, y: 20 },
                  { x: -20, y: 0 },
                  { x: 0, y: -20 },
                ],
              }),
            ],
          },
          {
            op: 'extrude',
            featureId: 'circle-extrude-1',
            profileRef: resolvedProfileRef('circle-sketch-1', 'circle-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'circle-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const aggregateCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['aggregate'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        aggregate: [
          {
            op: 'sketch',
            featureId: 'aggregate-sketch-1',
            profilesResolved: [
              resolvedProfile('aggregate-profile-1'),
              resolvedProfile('aggregate-profile-2', {
                verticesProxy: [
                  { x: 30, y: 0 },
                  { x: 40, y: 0 },
                  { x: 40, y: 10 },
                  { x: 30, y: 10 },
                ],
                loop: {
                  segments: [
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 0 },
                      b: { x: 40, y: 0 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 0 },
                      b: { x: 40, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 10 },
                      b: { x: 30, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 10 },
                      b: { x: 30, y: 0 },
                    },
                  ],
                  winding: 'CCW' as const,
                },
              }),
            ],
          },
          {
            op: 'extrude',
            featureId: 'aggregate-extrude-1',
            profileSelection: profileSelectionAllFromSketch('aggregate-sketch-1'),
            profileRef: null,
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'aggregate-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const multiSketchContributorCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['aggregate'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        aggregate: [
          {
            op: 'sketch',
            featureId: 'aggregate-sketch-1',
            profilesResolved: [resolvedProfile('aggregate-profile-1')],
          },
          {
            op: 'sketch',
            featureId: 'aggregate-sketch-2',
            profilesResolved: [
              resolvedProfile('aggregate-profile-2', {
                verticesProxy: [
                  { x: 30, y: 0 },
                  { x: 40, y: 0 },
                  { x: 40, y: 10 },
                  { x: 30, y: 10 },
                ],
                loop: {
                  segments: [
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 0 },
                      b: { x: 40, y: 0 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 0 },
                      b: { x: 40, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 10 },
                      b: { x: 30, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 10 },
                      b: { x: 30, y: 0 },
                    },
                  ],
                  winding: 'CCW' as const,
                },
              }),
            ],
          },
          {
            op: 'extrude',
            featureId: 'aggregate-extrude-contributors',
            profileSelection: profileSelectionContributors([
              {
                kind: 'allFromSketch',
                sketchFeatureId: 'aggregate-sketch-1',
              },
              {
                kind: 'allFromSketch',
                sketchFeatureId: 'aggregate-sketch-2',
              },
            ]),
            profileRef: null,
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'aggregate-body-contributors',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const sharedSketchSingleSelectionCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['extrude#1', 'extrude#2'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        'extrude#1': [
          {
            op: 'sketch',
            featureId: 'shared-sketch-1',
            profilesResolved: [
              resolvedProfile('shared-profile-1'),
              resolvedProfile('shared-profile-2', {
                verticesProxy: [
                  { x: 30, y: 0 },
                  { x: 40, y: 0 },
                  { x: 40, y: 10 },
                  { x: 30, y: 10 },
                ],
                loop: {
                  segments: [
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 0 },
                      b: { x: 40, y: 0 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 0 },
                      b: { x: 40, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 10 },
                      b: { x: 30, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 10 },
                      b: { x: 30, y: 0 },
                    },
                  ],
                  winding: 'CCW' as const,
                },
              }),
            ],
          },
          {
            op: 'extrude',
            featureId: 'shared-extrude-1',
            profileSelection: {
              mode: 'single' as const,
              sketchFeatureId: 'shared-sketch-1',
              profileId: 'shared-profile-1',
              profileIndex: 0,
            },
            profileRef: resolvedProfileRef('shared-sketch-1', 'shared-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'shared-body-1',
          },
        ],
        'extrude#2': [
          {
            op: 'sketch',
            featureId: 'shared-sketch-1',
            profilesResolved: [
              resolvedProfile('shared-profile-1'),
              resolvedProfile('shared-profile-2', {
                verticesProxy: [
                  { x: 30, y: 0 },
                  { x: 40, y: 0 },
                  { x: 40, y: 10 },
                  { x: 30, y: 10 },
                ],
                loop: {
                  segments: [
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 0 },
                      b: { x: 40, y: 0 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 0 },
                      b: { x: 40, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 40, y: 10 },
                      b: { x: 30, y: 10 },
                    },
                    {
                      kind: 'line2' as const,
                      a: { x: 30, y: 10 },
                      b: { x: 30, y: 0 },
                    },
                  ],
                  winding: 'CCW' as const,
                },
              }),
            ],
          },
          {
            op: 'extrude',
            featureId: 'shared-extrude-2',
            profileSelection: {
              mode: 'single' as const,
              sketchFeatureId: 'shared-sketch-1',
              profileId: 'shared-profile-2',
              profileIndex: 1,
            },
            profileRef: resolvedProfileRef('shared-sketch-1', 'shared-profile-2'),
            extrudeType: 'Body',
            depthResolved: 30,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'shared-body-2',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const staleAggregateCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['aggregate'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        aggregate: [
          {
            op: 'sketch',
            featureId: 'aggregate-sketch-1',
            profilesResolved: [resolvedProfile('aggregate-profile-1')],
          },
          {
            op: 'extrude',
            featureId: 'aggregate-extrude-1',
            profileSelection: profileSelectionAllFromSketch('missing-sketch'),
            profileRef: resolvedProfileRef('aggregate-sketch-1', 'aggregate-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'aggregate-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const emptyAggregateCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['aggregate'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        aggregate: [
          {
            op: 'sketch',
            featureId: 'aggregate-sketch-1',
            profilesResolved: [],
          },
          {
            op: 'extrude',
            featureId: 'aggregate-extrude-1',
            profileSelection: profileSelectionAllFromSketch('aggregate-sketch-1'),
            profileRef: null,
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'aggregate-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const malformedAggregateCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['aggregate'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        aggregate: [
          {
            op: 'sketch',
            featureId: 'aggregate-sketch-1',
            profilesResolved: [
              resolvedProfile('aggregate-profile-1'),
              {
                profileId: 'aggregate-profile-bad',
                profileIndex: 1,
                area: 0,
                loop: {
                  segments: [],
                  winding: 'CCW' as const,
                },
                verticesProxy: [
                  { x: 0, y: 0 },
                  { x: 10, y: 0 },
                ],
              },
            ],
          },
          {
            op: 'extrude',
            featureId: 'aggregate-extrude-1',
            profileSelection: profileSelectionAllFromSketch('aggregate-sketch-1'),
            profileRef: null,
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'aggregate-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const malformedProfileCompiledBuildData = (): CompiledBuildData => ({
  orderedPartKeys: ['broken'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        broken: [
          {
            op: 'sketch',
            featureId: 'broken-sketch-1',
            profilesResolved: [
              resolvedProfile('broken-profile-1', {
                loop: openProfileLoop,
                verticesProxy: [
                  { x: 0, y: 0 },
                  { x: 20, y: 0 },
                  { x: 20, y: 20 },
                ],
              }),
            ],
          },
          {
            op: 'extrude',
            featureId: 'broken-extrude-1',
            profileRef: resolvedProfileRef('broken-sketch-1', 'broken-profile-1'),
            extrudeType: 'Body',
            depthResolved: 20,
            taperResolved: 0,
            offsetResolved: 0,
            bodyId: 'broken-body-1',
          },
        ],
      },
    },
  },
  outputEntries: [],
})

const createFakeOc = (options: {
  shapeDelete: ReturnType<typeof vi.fn>
  edgeDelete?: ReturnType<typeof vi.fn>
  wireDelete?: ReturnType<typeof vi.fn>
  faceDelete?: ReturnType<typeof vi.fn>
  recordEdgeKind?: (kind: string) => void
  recordEdgeArgCount?: (count: number) => void
  recordWireEdgeCount?: (count: number) => void
  recordPrismVector?: (vector: { x: number; y: number; z: number }) => void
  failSingleCurveEdgeConstruction?: boolean
  failOnShapeCall?: number
}) => {
  let shapeCallCount = 0

  class gp_Pnt {
    public readonly x: number
    public readonly y: number
    public readonly z: number

    public constructor(x: number, y: number, z: number) {
      this.x = x
      this.y = y
      this.z = z
    }

    public delete(): void {}
  }

  class gp_Vec {
    public readonly x: number
    public readonly y: number
    public readonly z: number

    public constructor(x: number, y: number, z: number) {
      this.x = x
      this.y = y
      this.z = z
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
        options.failSingleCurveEdgeConstruction === true &&
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
      options.recordEdgeKind?.(kind)
      options.recordEdgeArgCount?.(this.args.length)
      return {
        kind,
        delete: options.edgeDelete ?? vi.fn(),
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
      options.recordWireEdgeCount?.(this.edges.length)
      return {
        delete: options.wireDelete ?? vi.fn(),
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
      return {
        delete: options.faceDelete ?? vi.fn(),
      }
    }

    public delete(): void {}
  }

  class BRepPrimAPI_MakePrism {
    public readonly face: { delete: ReturnType<typeof vi.fn> }
    public readonly vector: gp_Vec

    public constructor(face: { delete: ReturnType<typeof vi.fn> }, vector: gp_Vec) {
      this.face = face
      this.vector = vector
      options.recordPrismVector?.(vector)
    }

    public Shape(): { delete: ReturnType<typeof vi.fn> } {
      shapeCallCount += 1
      if (options.failOnShapeCall === shapeCallCount) {
        throw new Error(`shape failure ${shapeCallCount}`)
      }
      return {
        delete: options.shapeDelete,
      }
    }

    public delete(): void {}
  }

  return {
    gp_Pnt,
    gp_Vec,
    TColgp_Array1OfPnt,
    Geom_BezierCurve,
    Handle_Geom_Curve,
    GC_MakeArcOfCircle,
    BRepBuilderAPI_MakeEdge,
    BRepBuilderAPI_MakeWire,
    BRepBuilderAPI_MakeFace,
    BRepPrimAPI_MakePrism,
  }
}

afterEach(() => {
  resetAuthoritativeShapeSetsForTests()
  getOcMock.mockReset()
  vi.doUnmock('../../shared/geometryResult')
})

describe('buildAuthoritativeGeometry', () => {
  it('mints a first authoritative shape_set handle for supported rectangular body extrudes', async () => {
    const shapeDelete = vi.fn()
    getOcMock.mockResolvedValue(createFakeOc({ shapeDelete }))

    const result = await buildAuthoritativeGeometry({
      compiledBuildData: cubeCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        partKeys: ['cube'],
      },
    })

    expect(result.authoritativeGeometryResult).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-1',
          partKeys: ['cube'],
        },
        resultClass: 'authoritative',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
    expect(result.authoritativeGeometryResult?.meshPreview).not.toBeNull()
    expect(Object.keys(result.authoritativeGeometryResult?.bodies ?? {})).toEqual([
      'cube:cube-body-1',
    ])
    expect(getOcMock).toHaveBeenCalledTimes(1)

    const handleId = result.authoritativeGeometryResult?.authoritativeHandle?.handleId
    expect(handleId).toBe('shape-set-1')
    expect(releaseAuthoritativeShapeSets(handleId === undefined ? [] : [handleId])).toBe(1)
    expect(shapeDelete).toHaveBeenCalledTimes(1)
  })

  it('stays honest and returns null for unsupported authoritative body kinds', async () => {
    const result = await buildAuthoritativeGeometry({
      compiledBuildData: wallsCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-2',
        partKeys: ['walls'],
      },
    })

    expect(result.authoritativeGeometryResult).toBeNull()
    expect(getOcMock).not.toHaveBeenCalled()
  })

  it('mints authoritative geometry for a non-rectangular closed sketch body extrude through the face-driven path', async () => {
    const edgeDelete = vi.fn()
    const wireDelete = vi.fn()
    const faceDelete = vi.fn()
    const edgeKinds: string[] = []
    const wireEdgeCounts: number[] = []
    const prismVectors: Array<{ x: number; y: number; z: number }> = []
    getOcMock.mockResolvedValue(
      createFakeOc({
        shapeDelete: vi.fn(),
        edgeDelete,
        wireDelete,
        faceDelete,
        recordEdgeKind: (kind) => edgeKinds.push(kind),
        recordWireEdgeCount: (count) => wireEdgeCounts.push(count),
        recordPrismVector: (vector) => prismVectors.push(vector),
      }),
    )

    const result = await buildAuthoritativeGeometry({
      compiledBuildData: triangleCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-triangle',
        partKeys: ['triangle'],
      },
    })

    expect(result.authoritativeGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'authoritative',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
    expect(getOcMock).toHaveBeenCalledTimes(1)
    expect(edgeKinds).toEqual(['line2', 'line2', 'line2'])
    expect(wireEdgeCounts).toEqual([3])
    expect(prismVectors).toEqual([{ x: 0, y: 0, z: 20 }])
    expect(edgeDelete).toHaveBeenCalledTimes(3)
    expect(wireDelete).toHaveBeenCalledTimes(1)
    expect(faceDelete).toHaveBeenCalledTimes(1)
    const handleId = result.authoritativeGeometryResult?.authoritativeHandle?.handleId
    expect(handleId).toBe('shape-set-1')
    expect(releaseAuthoritativeShapeSets(handleId === undefined ? [] : [handleId])).toBe(1)
  })

  it('mints authoritative geometry for a first-class circle sketch body extrude through two arc edges', async () => {
    const edgeDelete = vi.fn()
    const wireDelete = vi.fn()
    const faceDelete = vi.fn()
    const edgeKinds: string[] = []
    const edgeArgCounts: number[] = []
    const wireEdgeCounts: number[] = []
    const prismVectors: Array<{ x: number; y: number; z: number }> = []
    getOcMock.mockResolvedValue(
      createFakeOc({
        shapeDelete: vi.fn(),
        edgeDelete,
        wireDelete,
        faceDelete,
        failSingleCurveEdgeConstruction: true,
        recordEdgeKind: (kind) => edgeKinds.push(kind),
        recordEdgeArgCount: (count) => edgeArgCounts.push(count),
        recordWireEdgeCount: (count) => wireEdgeCounts.push(count),
        recordPrismVector: (vector) => prismVectors.push(vector),
      }),
    )

    const result = await buildAuthoritativeGeometry({
      compiledBuildData: circleCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-circle',
        partKeys: ['circle'],
      },
    })

    expect(result.authoritativeGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'authoritative',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
    expect(Object.keys(result.authoritativeGeometryResult?.bodies ?? {})).toEqual([
      'circle:circle-body-1',
    ])
    expect(result.authoritativeGeometryResult?.meshPreview).not.toBeNull()
    expect(getOcMock).toHaveBeenCalledTimes(1)
    expect(edgeKinds).toEqual(['arc3pt2', 'arc3pt2'])
    expect(edgeArgCounts).toEqual([3, 3])
    expect(wireEdgeCounts).toEqual([2])
    expect(prismVectors).toEqual([{ x: 0, y: 0, z: 20 }])
    expect(edgeDelete).toHaveBeenCalledTimes(2)
    expect(wireDelete).toHaveBeenCalledTimes(1)
    expect(faceDelete).toHaveBeenCalledTimes(1)
    const handleId = result.authoritativeGeometryResult?.authoritativeHandle?.handleId
    expect(handleId).toBe('shape-set-1')
    expect(releaseAuthoritativeShapeSets(handleId === undefined ? [] : [handleId])).toBe(1)
  })

  it('mints one authoritative result for aggregate closed-profile selection without collapsing to a single profile', async () => {
    const shapeDelete = vi.fn()
    const edgeDelete = vi.fn()
    const wireDelete = vi.fn()
    const faceDelete = vi.fn()
    const wireEdgeCounts: number[] = []
    const prismVectors: Array<{ x: number; y: number; z: number }> = []
    getOcMock.mockResolvedValue(
      createFakeOc({
        shapeDelete,
        edgeDelete,
        wireDelete,
        faceDelete,
        recordWireEdgeCount: (count) => wireEdgeCounts.push(count),
        recordPrismVector: (vector) => prismVectors.push(vector),
      }),
    )

    const result = await buildAuthoritativeGeometry({
      compiledBuildData: aggregateCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-aggregate',
        partKeys: ['aggregate'],
      },
    })

    expect(result.authoritativeGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'authoritative',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
    expect(Object.keys(result.authoritativeGeometryResult?.bodies ?? {})).toEqual([
      'aggregate:aggregate-body-1',
    ])
    expect(result.authoritativeGeometryResult?.meshPreview).not.toBeNull()
    expect(getOcMock).toHaveBeenCalledTimes(1)
    expect(wireEdgeCounts).toEqual([4, 4])
    expect(prismVectors).toEqual([
      { x: 0, y: 0, z: 20 },
      { x: 0, y: 0, z: 20 },
    ])
    const handleId = result.authoritativeGeometryResult?.authoritativeHandle?.handleId
    expect(handleId).toBe('shape-set-1')
    expect(releaseAuthoritativeShapeSets(handleId === undefined ? [] : [handleId])).toBe(1)
    expect(shapeDelete).toHaveBeenCalledTimes(2)
    expect(edgeDelete).toHaveBeenCalledTimes(8)
    expect(wireDelete).toHaveBeenCalledTimes(2)
    expect(faceDelete).toHaveBeenCalledTimes(2)
  })

  it('mints one authoritative result for ordered contributor selections across multiple SketchProfiles sources', async () => {
    const shapeDelete = vi.fn()
    const edgeDelete = vi.fn()
    const wireDelete = vi.fn()
    const faceDelete = vi.fn()
    const wireEdgeCounts: number[] = []
    const prismVectors: Array<{ x: number; y: number; z: number }> = []
    getOcMock.mockResolvedValue(
      createFakeOc({
        shapeDelete,
        edgeDelete,
        wireDelete,
        faceDelete,
        recordWireEdgeCount: (count) => wireEdgeCounts.push(count),
        recordPrismVector: (vector) => prismVectors.push(vector),
      }),
    )

    const result = await buildAuthoritativeGeometry({
      compiledBuildData: multiSketchContributorCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-contributors',
        partKeys: ['aggregate'],
      },
    })

    expect(result.authoritativeGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'authoritative',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
    expect(Object.keys(result.authoritativeGeometryResult?.bodies ?? {})).toEqual([
      'aggregate:aggregate-body-contributors',
    ])
    expect(result.authoritativeGeometryResult?.meshPreview).not.toBeNull()
    expect(getOcMock).toHaveBeenCalledTimes(1)
    expect(wireEdgeCounts).toEqual([4, 4])
    expect(prismVectors).toEqual([
      { x: 0, y: 0, z: 20 },
      { x: 0, y: 0, z: 20 },
    ])
    const handleId = result.authoritativeGeometryResult?.authoritativeHandle?.handleId
    expect(handleId).toBe('shape-set-1')
    expect(releaseAuthoritativeShapeSets(handleId === undefined ? [] : [handleId])).toBe(1)
    expect(shapeDelete).toHaveBeenCalledTimes(2)
    expect(edgeDelete).toHaveBeenCalledTimes(8)
    expect(wireDelete).toHaveBeenCalledTimes(2)
    expect(faceDelete).toHaveBeenCalledTimes(2)
  })

  it('keeps single-profile authoritative extrusion stable when parallel branches reuse one sketch feature id', async () => {
    const shapeDelete = vi.fn()
    const edgeDelete = vi.fn()
    const wireDelete = vi.fn()
    const faceDelete = vi.fn()
    const wireEdgeCounts: number[] = []
    const prismVectors: Array<{ x: number; y: number; z: number }> = []
    getOcMock.mockResolvedValue(
      createFakeOc({
        shapeDelete,
        edgeDelete,
        wireDelete,
        faceDelete,
        recordWireEdgeCount: (count) => wireEdgeCounts.push(count),
        recordPrismVector: (vector) => prismVectors.push(vector),
      }),
    )

    const result = await buildAuthoritativeGeometry({
      compiledBuildData: sharedSketchSingleSelectionCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-shared-sketch-single',
        partKeys: ['extrude#1', 'extrude#2'],
      },
    })

    expect(result.authoritativeGeometryResult).toEqual(
      expect.objectContaining({
        resultClass: 'authoritative',
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    )
    expect(Object.keys(result.authoritativeGeometryResult?.bodies ?? {})).toEqual([
      'extrude#1:shared-body-1',
      'extrude#2:shared-body-2',
    ])
    expect(result.authoritativeGeometryResult?.meshPreview).not.toBeNull()
    expect(getOcMock).toHaveBeenCalledTimes(1)
    expect(wireEdgeCounts).toEqual([4, 4])
    expect(prismVectors).toEqual([
      { x: 0, y: 0, z: 20 },
      { x: 0, y: 0, z: 30 },
    ])
    const handleId = result.authoritativeGeometryResult?.authoritativeHandle?.handleId
    expect(handleId).toBe('shape-set-1')
    expect(releaseAuthoritativeShapeSets(handleId === undefined ? [] : [handleId])).toBe(1)
    expect(shapeDelete).toHaveBeenCalledTimes(2)
    expect(edgeDelete).toHaveBeenCalledTimes(8)
    expect(wireDelete).toHaveBeenCalledTimes(2)
    expect(faceDelete).toHaveBeenCalledTimes(2)
  })

  it('returns null without minting a shape handle for malformed open sketch loops even when preview geometry exists', async () => {
    const edgeDelete = vi.fn()
    const wireDelete = vi.fn()
    const shapeDelete = vi.fn()
    getOcMock.mockResolvedValue(
      createFakeOc({
        shapeDelete,
        edgeDelete,
        wireDelete,
      }),
    )

    await expect(
      buildAuthoritativeGeometry({
        compiledBuildData: malformedProfileCompiledBuildData(),
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-broken',
          partKeys: ['broken'],
        },
      }),
    ).resolves.toEqual({
      authoritativeGeometryResult: null,
    })
    expect(getOcMock).toHaveBeenCalledTimes(1)
    expect(edgeDelete).not.toHaveBeenCalled()
    expect(wireDelete).not.toHaveBeenCalled()
    expect(shapeDelete).not.toHaveBeenCalled()
    expect(releaseAuthoritativeShapeSets(['shape-set-1'])).toBe(0)
  })

  it('returns null for stale aggregate selection instead of falling back through singular profileRef', async () => {
    const result = await buildAuthoritativeGeometry({
      compiledBuildData: staleAggregateCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-stale-aggregate',
        partKeys: ['aggregate'],
      },
    })

    expect(result.authoritativeGeometryResult).toBeNull()
    expect(getOcMock).not.toHaveBeenCalled()
    expect(releaseAuthoritativeShapeSets(['shape-set-1'])).toBe(0)
  })

  it('returns null for empty aggregate selection without minting any authoritative handle', async () => {
    const result = await buildAuthoritativeGeometry({
      compiledBuildData: emptyAggregateCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-empty-aggregate',
        partKeys: ['aggregate'],
      },
    })

    expect(result.authoritativeGeometryResult).toBeNull()
    expect(getOcMock).not.toHaveBeenCalled()
    expect(releaseAuthoritativeShapeSets(['shape-set-1'])).toBe(0)
  })

  it('returns null for partially invalid aggregate selection so authoritative output stays aligned with draft failure honesty', async () => {
    const result = await buildAuthoritativeGeometry({
      compiledBuildData: malformedAggregateCompiledBuildData(),
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-malformed-aggregate',
        partKeys: ['aggregate'],
      },
    })

    expect(result.authoritativeGeometryResult).toBeNull()
    expect(getOcMock).not.toHaveBeenCalled()
    expect(releaseAuthoritativeShapeSets(['shape-set-1'])).toBe(0)
  })

  it('returns null instead of throwing when the OC boot seam is unavailable', async () => {
    getOcMock.mockRejectedValue(new Error('OC boot failed'))

    await expect(
      buildAuthoritativeGeometry({
        compiledBuildData: cubeCompiledBuildData(),
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-3',
          partKeys: ['cube'],
        },
      }),
    ).resolves.toEqual({
      authoritativeGeometryResult: null,
    })
    expect(getOcMock).toHaveBeenCalledTimes(1)
    expect(releaseAuthoritativeShapeSets(['shape-set-1'])).toBe(0)
  })

  it('releases partially built OC resources and returns null when authoritative generation fails', async () => {
    const shapeDelete = vi.fn()
    getOcMock.mockResolvedValue(
      createFakeOc({
        shapeDelete,
        failOnShapeCall: 2,
      }),
    )

    await expect(
      buildAuthoritativeGeometry({
        compiledBuildData: multiCubeCompiledBuildData(),
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-4',
          partKeys: ['cube#1', 'cube#2'],
        },
      }),
    ).resolves.toEqual({
      authoritativeGeometryResult: null,
    })
    expect(shapeDelete).toHaveBeenCalledTimes(1)
    expect(releaseAuthoritativeShapeSets(['shape-set-1'])).toBe(0)
  })

  it('releases a minted shape_set handle and returns null when bundle assembly fails', async () => {
    vi.resetModules()
    const shapeDelete = vi.fn()
    getOcMock.mockResolvedValue(createFakeOc({ shapeDelete }))
    const createAuthoritativeGeometryResultBundleMock = vi.fn(() => {
      throw new Error('bundle assembly failed')
    })
    vi.doMock('../../shared/geometryResult', async () => {
      const actual = await vi.importActual<typeof import('../../shared/geometryResult')>(
        '../../shared/geometryResult',
      )
      return {
        ...actual,
        createAuthoritativeGeometryResultBundle: createAuthoritativeGeometryResultBundleMock,
      }
    })

    const { buildAuthoritativeGeometry } = await import('./buildAuthoritativeGeometry')
    await expect(
      buildAuthoritativeGeometry({
        compiledBuildData: cubeCompiledBuildData(),
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-5',
          partKeys: ['cube'],
        },
      }),
    ).resolves.toEqual({
      authoritativeGeometryResult: null,
    })
    expect(createAuthoritativeGeometryResultBundleMock).toHaveBeenCalledTimes(1)
    expect(shapeDelete).toHaveBeenCalledTimes(1)
    expect(releaseAuthoritativeShapeSets(['shape-set-1'])).toBe(0)
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CompiledBuildData } from '../../shared/buildTypes'
import { releaseAuthoritativeShapeSets, resetAuthoritativeShapeSetsForTests } from '../authoritativeGeometryStore'

const { getOcMock } = vi.hoisted(() => ({
  getOcMock: vi.fn(),
}))

vi.mock('../oc/ocInit', () => ({
  getOc: getOcMock,
}))

import { buildAuthoritativeGeometry } from './buildAuthoritativeGeometry'

const emptyProfileLoop = {
  segments: [],
  winding: 'CCW' as const,
}

const resolvedProfile = (profileId: string) => ({
  profileId,
  profileIndex: 0,
  area: 400,
  loop: emptyProfileLoop,
  verticesProxy: [
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

const createFakeOc = (options: {
  shapeDelete: ReturnType<typeof vi.fn>
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

  class gp_Dir {
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

  class gp_Ax2 {
    public readonly origin: gp_Pnt
    public readonly normal: gp_Dir
    public readonly xDirection: gp_Dir

    public constructor(origin: gp_Pnt, normal: gp_Dir, xDirection: gp_Dir) {
      this.origin = origin
      this.normal = normal
      this.xDirection = xDirection
    }

    public delete(): void {}
  }

  class BRepPrimAPI_MakeBox {
    public readonly axis: gp_Ax2
    public readonly width: number
    public readonly length: number
    public readonly depth: number

    public constructor(axis: gp_Ax2, width: number, length: number, depth: number) {
      this.axis = axis
      this.width = width
      this.length = length
      this.depth = depth
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
    gp_Dir,
    gp_Ax2,
    BRepPrimAPI_MakeBox,
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

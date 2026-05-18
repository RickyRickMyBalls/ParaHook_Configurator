import { describe, expect, it } from 'vitest'
import type { ArtifactMesh } from '../shared/buildTypes'
import type { GeometryTopologyPreview } from '../shared/geometryResult'
import {
  createSemanticEdgeOverlayGeometry,
  createSemanticEdgeSelectionGeometry,
  createSemanticFaceHighlightGeometry,
  createSemanticPointMarkerGeometry,
  resolveTopologyPointPosition,
  resolveTopologyFaceFromTriangleIndex,
} from './semanticTopologySelection'

const topologyPreview = {
  faces: [
    { faceId: 'face:top', bodyId: 'body:1', label: 'Top' },
    { faceId: 'face:side', bodyId: 'body:1', label: 'Side' },
  ],
  triangleFaceIds: ['face:top', 'face:top', 'face:side', null],
  edges: [
    {
      edgeId: 'edge:top-front',
      bodyId: 'body:1',
      faceIds: ['face:top'],
      polyline: [
        0, 0, 0,
        1, 0, 0,
        1, 1, 0,
      ],
    },
  ],
  points: [
    {
      pointId: 'point:origin',
      bodyId: 'body:1',
      position: [0, 0, 0],
    },
  ],
} satisfies GeometryTopologyPreview

const mesh = {
  vertices: [
    0, 0, 0,
    1, 0, 0,
    1, 1, 0,
    0, 1, 0,
    0, 0, 1,
  ],
  indices: [
    0, 1, 2,
    0, 2, 3,
    0, 1, 4,
    1, 2, 4,
  ],
} satisfies ArtifactMesh

describe('semantic topology selection', () => {
  it('resolves a triangle hit to the owning semantic face', () => {
    expect(resolveTopologyFaceFromTriangleIndex(topologyPreview, 1)).toEqual({
      faceId: 'face:top',
      bodyId: 'body:1',
    })
  })

  it('falls back when a triangle has no semantic face', () => {
    expect(resolveTopologyFaceFromTriangleIndex(topologyPreview, 3)).toBeNull()
    expect(resolveTopologyFaceFromTriangleIndex(topologyPreview, null)).toBeNull()
    expect(resolveTopologyFaceFromTriangleIndex(null, 0)).toBeNull()
  })

  it('builds a highlight geometry from every triangle in the selected semantic face', () => {
    const geometry = createSemanticFaceHighlightGeometry(mesh, topologyPreview, 'face:top')
    expect(geometry).not.toBeNull()
    expect(geometry?.getAttribute('position').count).toBe(6)
  })

  it('does not build a highlight for an unknown semantic face', () => {
    expect(createSemanticFaceHighlightGeometry(mesh, topologyPreview, 'face:missing')).toBeNull()
  })

  it('builds semantic edge overlay geometry from edge polylines', () => {
    const geometry = createSemanticEdgeOverlayGeometry(topologyPreview)
    expect(geometry).not.toBeNull()
    expect(geometry?.getAttribute('position').count).toBe(4)
  })

  it('builds a selected semantic edge geometry from one edge polyline', () => {
    const geometry = createSemanticEdgeSelectionGeometry(topologyPreview, 'edge:top-front')
    expect(geometry).not.toBeNull()
    expect(geometry?.getAttribute('position').count).toBe(4)
  })

  it('builds and resolves semantic point marker geometry', () => {
    const geometry = createSemanticPointMarkerGeometry(topologyPreview, 'point:origin')
    expect(geometry).not.toBeNull()
    expect(geometry?.getAttribute('position').count).toBe(1)
    expect(resolveTopologyPointPosition(topologyPreview, 'point:origin')).toEqual([0, 0, 0])
    expect(createSemanticPointMarkerGeometry(topologyPreview, 'point:missing')).toBeNull()
  })
})

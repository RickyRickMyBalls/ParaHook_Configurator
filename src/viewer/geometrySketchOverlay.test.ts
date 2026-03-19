import { describe, expect, it } from 'vitest'
import type { GeometrySketchOverlayVm } from '../app/viewerBridge'
import { buildGeometrySketchRenderPolylines, projectSketchPointToWorld } from './geometrySketchOverlay'

describe('geometrySketchOverlay helpers', () => {
  it('maps sketch points onto XY, XZ, and YZ viewer planes', () => {
    expect(projectSketchPointToWorld('XY', { x: 4, y: 7 }, 0.02)).toEqual({
      x: 4,
      y: 7,
      z: 0.02,
    })
    expect(projectSketchPointToWorld('XZ', { x: 4, y: 7 }, 0.02)).toEqual({
      x: 4,
      y: 0.02,
      z: 7,
    })
    expect(projectSketchPointToWorld('YZ', { x: 4, y: 7 }, 0.02)).toEqual({
      x: 0.02,
      y: 4,
      z: 7,
    })
  })

  it('marks the selected review profile distinctly from non-selected profiles', () => {
    const overlay: GeometrySketchOverlayVm = {
      mode: 'review',
      plane: 'XY',
      components: [
        {
          rowId: 'row-line',
          componentId: 'cmp-line',
          type: 'line',
          a: { kind: 'lit', x: 0, y: 0 },
          b: { kind: 'lit', x: 10, y: 0 },
        },
      ],
      profiles: [
        {
          profileId: 'profile-a',
          vertices: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
            { x: 0, y: 0 },
          ],
        },
        {
          profileId: 'profile-b',
          vertices: [
            { x: 20, y: 0 },
            { x: 30, y: 0 },
            { x: 30, y: 10 },
            { x: 20, y: 10 },
            { x: 20, y: 0 },
          ],
        },
      ],
      selectedProfileId: 'profile-b',
    }

    const polylines = buildGeometrySketchRenderPolylines(overlay)

    expect(polylines.filter((polyline) => polyline.layer === 'component')).toHaveLength(1)
    expect(polylines.filter((polyline) => polyline.layer === 'profile')).toHaveLength(1)
    expect(polylines.filter((polyline) => polyline.layer === 'selectedProfile')).toHaveLength(1)
  })
})

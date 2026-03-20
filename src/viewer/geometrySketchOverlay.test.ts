import { describe, expect, it } from 'vitest'
import type { GeometrySketchOverlayVm } from '../app/viewerBridge'
import { buildGeometrySketchRenderPolylines, projectSketchPointToWorld } from './geometrySketchOverlay'

describe('geometrySketchOverlay helpers', () => {
  it('maps sketch points onto XY, XZ, and YZ viewer planes', () => {
    expect(projectSketchPointToWorld('XY', undefined, { x: 4, y: 7 }, 0.02)).toEqual({
      x: 4,
      y: 7,
      z: 0.02,
    })
    expect(projectSketchPointToWorld('XZ', undefined, { x: 4, y: 7 }, 0.02)).toEqual({
      x: 4,
      y: 0.02,
      z: 7,
    })
    expect(projectSketchPointToWorld('YZ', undefined, { x: 4, y: 7 }, 0.02)).toEqual({
      x: 0.02,
      y: 4,
      z: 7,
    })
  })

  it('applies sketch plane transform when projecting points into world space', () => {
    expect(
      projectSketchPointToWorld(
        'XY',
        {
          offsetMm: 0,
          inPlaneRotationDeg: 0,
          translation: { x: 10, y: -2, z: 5 },
          rotationDeg: { x: 0, y: 0, z: 0 },
        },
        { x: 4, y: 7 },
        0.02,
      ),
    ).toEqual({
      x: 14,
      y: 5,
      z: 5.02,
    })
  })

  it('marks the selected review profile distinctly from non-selected profiles', () => {
    const overlay: GeometrySketchOverlayVm = {
      mode: 'review',
      plane: 'XY',
      planeTransform: {
        offsetMm: 0,
        inPlaneRotationDeg: 0,
        translation: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
      },
      drawStage: null,
      activeTool: 'line',
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
      drawDraft: null,
      ui: {
        snapEnabled: true,
        snapDistancePx: 14,
        crosshairSize: 1,
        startPointVisible: true,
        startPointSymbolSize: 1,
        startPointSymbolType: 'crosshair',
        plinePointVisible: true,
        plinePointSymbolSize: 1,
        plinePointSymbolType: 'crosshair',
      },
    }

    const polylines = buildGeometrySketchRenderPolylines(overlay)

    expect(polylines.filter((polyline) => polyline.layer === 'component')).toHaveLength(1)
    expect(polylines.filter((polyline) => polyline.layer === 'profile')).toHaveLength(1)
    expect(polylines.filter((polyline) => polyline.layer === 'selectedProfile')).toHaveLength(1)
  })

  it('builds viewer-owned draft chain and ghost polylines during draw mode', () => {
    const overlay: GeometrySketchOverlayVm = {
      mode: 'draw',
      plane: 'XY',
      planeTransform: {
        offsetMm: 0,
        inPlaneRotationDeg: 0,
        translation: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
      },
      drawStage: 'draftActive',
      activeTool: 'pline',
      components: [],
      profiles: [],
      selectedProfileId: undefined,
      drawDraft: {
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
        ],
        hoverPoint: { x: 15, y: 5 },
        hoverSnapTarget: null,
      },
      ui: {
        snapEnabled: true,
        snapDistancePx: 14,
        crosshairSize: 1,
        startPointVisible: true,
        startPointSymbolSize: 1,
        startPointSymbolType: 'crosshair',
        plinePointVisible: true,
        plinePointSymbolSize: 1,
        plinePointSymbolType: 'crosshair',
      },
    }

    const polylines = buildGeometrySketchRenderPolylines(overlay)

    expect(polylines.filter((polyline) => polyline.layer === 'draftChain')).toHaveLength(1)
    expect(polylines.filter((polyline) => polyline.layer === 'draftGhost')).toHaveLength(1)
    expect(
      polylines.find((polyline) => polyline.layer === 'draftGhost')?.points,
    ).toEqual([
      { x: 10, y: 0, z: 0.02 },
      { x: 15, y: 5, z: 0.02 },
    ])
  })
})

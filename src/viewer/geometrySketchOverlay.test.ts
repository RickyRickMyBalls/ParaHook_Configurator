import { describe, expect, it } from 'vitest'
import type { GeometrySketchOverlayVm } from '../app/viewerBridge'
import {
  buildGeometrySketchRenderPolylines,
  collectGeometrySketchEndpointCandidates,
  collectGeometrySketchSelectionIds,
  expandGeometrySketchSelectionFromRowId,
  projectSketchPointToWorld,
} from './geometrySketchOverlay'

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

  it('builds a closed rectangle ghost polyline from the first corner and hovered opposite corner', () => {
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
      activeTool: 'rectangle',
      components: [],
      profiles: [],
      selectedProfileId: undefined,
      drawDraft: {
        points: [{ x: 2, y: 3 }],
        hoverPoint: { x: 12, y: 15 },
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

    expect(polylines.filter((polyline) => polyline.layer === 'draftChain')).toHaveLength(0)
    expect(polylines.filter((polyline) => polyline.layer === 'draftGhost')).toHaveLength(1)
    expect(
      polylines.find((polyline) => polyline.layer === 'draftGhost')?.points,
    ).toEqual([
      { x: 2, y: 3, z: 0.02 },
      { x: 12, y: 3, z: 0.02 },
      { x: 12, y: 15, z: 0.02 },
      { x: 2, y: 15, z: 0.02 },
      { x: 2, y: 3, z: 0.02 },
    ])
  })

  it('builds a sampled circle ghost polyline from the committed center and hovered radius witness', () => {
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
      activeTool: 'circle',
      components: [],
      profiles: [],
      selectedProfileId: undefined,
      drawDraft: {
        points: [{ x: 2, y: 3 }],
        hoverPoint: { x: 7, y: 3 },
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
    const ghost = polylines.find((polyline) => polyline.layer === 'draftGhost')

    expect(polylines.filter((polyline) => polyline.layer === 'draftChain')).toHaveLength(0)
    expect(ghost).toBeDefined()
    expect(ghost?.points).toHaveLength(49)
    expect(ghost?.points[0]).toEqual({ x: 7, y: 3, z: 0.02 })
    expect(ghost?.points.at(-1)?.x).toBeCloseTo(7)
    expect(ghost?.points.at(-1)?.y).toBeCloseTo(3)
    expect(ghost?.points.at(-1)?.z).toBeCloseTo(0.02)
  })

  it('expands grouped pline child hits to the full entity selection set', () => {
    const components: GeometrySketchOverlayVm['components'] = [
      {
        rowId: 'row-line-a',
        componentId: 'cmp-line-a',
        type: 'line',
        drawGroupId: 'group-1',
        a: { kind: 'lit', x: 0, y: 0 },
        b: { kind: 'lit', x: 10, y: 0 },
      },
      {
        rowId: 'row-line-b',
        componentId: 'cmp-line-b',
        type: 'line',
        drawGroupId: 'group-1',
        a: { kind: 'lit', x: 10, y: 0 },
        b: { kind: 'lit', x: 10, y: 10 },
      },
      {
        rowId: 'row-rect',
        componentId: 'cmp-rect',
        type: 'rectangle',
        a: { kind: 'lit', x: 20, y: 20 },
        b: { kind: 'lit', x: 30, y: 30 },
      },
    ]

    expect(expandGeometrySketchSelectionFromRowId(components, 'row-line-a')).toEqual([
      'row-line-a',
      'row-line-b',
    ])
    expect(expandGeometrySketchSelectionFromRowId(components, 'row-rect')).toEqual(['row-rect'])
  })

  it('distinguishes window selection from crossing selection', () => {
    const components: GeometrySketchOverlayVm['components'] = [
      {
        rowId: 'row-line-crossing',
        componentId: 'cmp-line-crossing',
        type: 'line',
        a: { kind: 'lit', x: -5, y: 5 },
        b: { kind: 'lit', x: 5, y: 5 },
      },
      {
        rowId: 'row-rect-inside',
        componentId: 'cmp-rect-inside',
        type: 'rectangle',
        a: { kind: 'lit', x: 1, y: 1 },
        b: { kind: 'lit', x: 4, y: 4 },
      },
    ]

    expect(
      collectGeometrySketchSelectionIds(
        components,
        { x: 0, y: 0 },
        { x: 6, y: 6 },
        'window',
      ),
    ).toEqual(['row-rect-inside'])

    expect(
      collectGeometrySketchSelectionIds(
        components,
        { x: 0, y: 0 },
        { x: 6, y: 6 },
        'crossing',
      ),
    ).toEqual(['row-line-crossing', 'row-rect-inside'])
  })

  it('collects deduped committed endpoint snap candidates from lines, pline segments, and rectangles', () => {
    const components: GeometrySketchOverlayVm['components'] = [
      {
        rowId: 'row-line-a',
        componentId: 'cmp-line-a',
        type: 'line',
        drawGroupId: 'group-1',
        a: { kind: 'lit', x: 0, y: 0 },
        b: { kind: 'lit', x: 10, y: 0 },
      },
      {
        rowId: 'row-line-b',
        componentId: 'cmp-line-b',
        type: 'line',
        drawGroupId: 'group-1',
        a: { kind: 'lit', x: 10, y: 0 },
        b: { kind: 'lit', x: 10, y: 10 },
      },
      {
        rowId: 'row-rect',
        componentId: 'cmp-rect',
        type: 'rectangle',
        a: { kind: 'lit', x: 20, y: 20 },
        b: { kind: 'lit', x: 30, y: 30 },
      },
    ]

    expect(collectGeometrySketchEndpointCandidates(components)).toEqual([
      { point: { x: 0, y: 0 }, target: 'endpoint' },
      { point: { x: 10, y: 0 }, target: 'endpoint' },
      { point: { x: 10, y: 10 }, target: 'endpoint' },
      { point: { x: 20, y: 20 }, target: 'endpoint' },
      { point: { x: 30, y: 20 }, target: 'endpoint' },
      { point: { x: 30, y: 30 }, target: 'endpoint' },
      { point: { x: 20, y: 30 }, target: 'endpoint' },
    ])
  })
})

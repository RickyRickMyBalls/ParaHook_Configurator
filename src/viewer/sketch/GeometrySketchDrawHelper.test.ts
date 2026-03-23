import { describe, expect, it } from 'vitest'
import { Group, LineSegments, PerspectiveCamera, Vector3 } from 'three'
import type { GeometrySketchOverlayVm } from '../../app/viewerBridge'
import { GeometrySketchDrawHelper } from './GeometrySketchDrawHelper'

const makeOverlay = (
  overrides: Partial<GeometrySketchOverlayVm> = {},
): GeometrySketchOverlayVm => ({
  mode: 'draw',
  plane: 'XY',
  planeTransform: {
    offsetMm: 0,
    inPlaneRotationDeg: 0,
    translation: { x: 0, y: 0, z: 0 },
    rotationDeg: { x: 0, y: 0, z: 0 },
  },
  drawStage: 'sessionIdle',
  activeTool: null,
  components: [],
  profiles: [],
  drawDraft: null,
  selectedComponentIds: [],
  hoveredComponentId: null,
  selectionWindowDraft: null,
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
  ...overrides,
})

describe('GeometrySketchDrawHelper', () => {
  it('shows a centered 300x300 working grid during idle sketch draw', () => {
    const helper = new GeometrySketchDrawHelper()
    helper.setOverlay(makeOverlay())

    expect(helper.getGroup().visible).toBe(true)

    const workingGrid = helper.getGroup().getObjectByName('GeometrySketchWorkingGrid') as Group | undefined
    expect(workingGrid).toBeInstanceOf(Group)

    const gridCoordinates = (workingGrid?.children ?? []).flatMap((child) => {
      if (!(child instanceof LineSegments)) {
        return []
      }
      const positions = (
        child.geometry.getAttribute('position') as { array: ArrayLike<number> } | undefined
      )?.array
      return positions === undefined ? [] : Array.from(positions)
    })
    const planarCoordinates = gridCoordinates.filter((_, index) => index % 3 !== 2)
    const minGridCoordinate = Math.min(...planarCoordinates)
    const maxGridCoordinate = Math.max(...planarCoordinates)

    expect(minGridCoordinate).toBeCloseTo(-150, 6)
    expect(maxGridCoordinate).toBeCloseTo(150, 6)

    helper.dispose()
  })

  it('snaps to the nearest committed endpoint in screen-space', () => {
    const helper = new GeometrySketchDrawHelper()
    const camera = new PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.set(0, 0, 50)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()

    helper.setOverlay(
      makeOverlay({
        drawStage: 'toolSelected',
        activeTool: 'line',
        ui: {
          ...makeOverlay().ui,
          snapDistancePx: 100,
        },
        components: [
          {
            rowId: 'row-line-1',
            componentId: 'cmp-line-1',
            type: 'line',
            a: { kind: 'lit', x: 10, y: 0 },
            b: { kind: 'lit', x: 20, y: 0 },
          },
        ],
        drawDraft: {
          points: [],
          hoverPoint: null,
          hoverSnapTarget: null,
        },
      }),
    )

    const projectedEndpoint = new Vector3(10, 0, 0).project(camera)
    const domElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      }),
    } as HTMLElement

    const hit = helper.projectPointerToSketch(
      camera,
      domElement,
      ((projectedEndpoint.x + 1) / 2) * 200,
      ((1 - projectedEndpoint.y) / 2) * 200,
    )

    expect(hit).toEqual({
      point: { x: 10, y: 0 },
      snapTarget: 'endpoint',
    })

    helper.dispose()
  })

  it('renders the gold snap square on the snapped endpoint during active draw hover', () => {
    const helper = new GeometrySketchDrawHelper()
    helper.setOverlay(
      makeOverlay({
        drawStage: 'draftActive',
        activeTool: 'line',
        drawDraft: {
          points: [{ x: 0, y: 0 }],
          hoverPoint: { x: 10, y: 0 },
          hoverSnapTarget: 'endpoint',
        },
      }),
    )

    const snapMarker = helper.getGroup().getObjectByName('GeometrySketchSnapMarker') as LineSegments | undefined

    expect(snapMarker).toBeInstanceOf(LineSegments)
    expect(snapMarker?.visible).toBe(true)
    expect(snapMarker?.position.x).toBeCloseTo(10)
    expect(snapMarker?.position.y).toBeCloseTo(0)
    expect(snapMarker?.renderOrder).toBeGreaterThan(123)

    helper.dispose()
  })

  it('snaps to origin when the pointer is near the sketch origin', () => {
    const helper = new GeometrySketchDrawHelper()
    const camera = new PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.set(0, 0, 50)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()

    helper.setOverlay(
      makeOverlay({
        drawStage: 'toolSelected',
        activeTool: 'line',
        ui: {
          ...makeOverlay().ui,
          snapDistancePx: 24,
        },
        drawDraft: {
          points: [],
          hoverPoint: null,
          hoverSnapTarget: null,
        },
      }),
    )

    const projectedOrigin = new Vector3(0, 0, 0).project(camera)
    const domElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      }),
    } as HTMLElement

    const hit = helper.projectPointerToSketch(
      camera,
      domElement,
      ((projectedOrigin.x + 1) / 2) * 200,
      ((1 - projectedOrigin.y) / 2) * 200,
    )

    expect(hit).toEqual({
      point: { x: 0, y: 0 },
      snapTarget: 'origin',
    })

    helper.dispose()
  })

  it('lets active pline draft points participate in snapping so the chain can close back to its start', () => {
    const helper = new GeometrySketchDrawHelper()
    const camera = new PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.set(0, 0, 50)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()

    helper.setOverlay(
      makeOverlay({
        drawStage: 'draftActive',
        activeTool: 'pline',
        ui: {
          ...makeOverlay().ui,
          snapDistancePx: 48,
        },
        drawDraft: {
          points: [
            { x: 4, y: 2 },
            { x: 10, y: 2 },
            { x: 10, y: 10 },
          ],
          hoverPoint: null,
          hoverSnapTarget: null,
        },
      }),
    )

    const projectedStartPoint = new Vector3(4, 2, 0).project(camera)
    const domElement = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
      }),
    } as HTMLElement

    const hit = helper.projectPointerToSketch(
      camera,
      domElement,
      ((projectedStartPoint.x + 1) / 2) * 200,
      ((1 - projectedStartPoint.y) / 2) * 200,
    )

    expect(hit).toEqual({
      point: { x: 4, y: 2 },
      snapTarget: 'endpoint',
    })

    helper.dispose()
  })
})

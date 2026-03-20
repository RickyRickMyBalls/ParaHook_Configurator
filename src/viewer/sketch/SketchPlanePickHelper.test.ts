import { describe, expect, it } from 'vitest'
import { LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial } from 'three'
import { SketchPlanePickHelper } from './SketchPlanePickHelper'
import type { SketchPlanePickOverlayVm } from '../../app/viewerBridge'

const makeOverlay = (
  overrides: Partial<SketchPlanePickOverlayVm> = {},
): SketchPlanePickOverlayVm => ({
  stage: 'pick',
  gizmoMode: 'translate',
  draftPlane: 'XY',
  previewPlane: null,
  draftTransform: {
    offsetMm: 0,
    inPlaneRotationDeg: 0,
    translation: { x: 0, y: 0, z: 0 },
    rotationDeg: { x: 0, y: 0, z: 0 },
  },
  snap: {
    translateMm: null,
    rotateDeg: null,
  },
  ui: {
    gizmoScale: 1,
    ghostPlaneScale: 1,
  },
  ...overrides,
})

describe('SketchPlanePickHelper', () => {
  it('shows all ghost planes during the pick stage', () => {
    const helper = new SketchPlanePickHelper()
    helper.setOverlay(makeOverlay({ stage: 'pick', draftPlane: 'XZ' }))

    const planeRoots = helper
      .getPreviewPivot()
      .children.filter((child) => child.userData.sketchPlaneId !== undefined)

    expect(planeRoots).toHaveLength(3)
    expect(planeRoots.every((child) => child.visible)).toBe(true)

    helper.dispose()
  })

  it('hides inactive ghost planes during adjust and keeps only the active plane visible', () => {
    const helper = new SketchPlanePickHelper()
    helper.setOverlay(makeOverlay({ stage: 'adjust', draftPlane: 'YZ' }))

    const planeRoots = helper
      .getPreviewPivot()
      .children.filter((child) => child.userData.sketchPlaneId !== undefined)
    const visiblePlanes = planeRoots
      .filter((child) => child.visible)
      .map((child) => child.userData.sketchPlaneId)

    expect(visiblePlanes).toEqual(['YZ'])

    helper.dispose()
  })

  it('highlights a hovered ghost plane during pick before selection', () => {
    const helper = new SketchPlanePickHelper()
    helper.setOverlay(makeOverlay({ stage: 'pick', draftPlane: 'XY' }))
    helper.setHoveredPlane('XZ')

    const inactiveDraftPlaneRoot = helper
      .getPreviewPivot()
      .children.find((child) => child.userData.sketchPlaneId === 'XY')
    const inactiveDraftPlaneMesh = inactiveDraftPlaneRoot?.children[0]
    const planeRoot = helper
      .getPreviewPivot()
      .children.find((child) => child.userData.sketchPlaneId === 'XZ')
    const planeMesh = planeRoot?.children[0]
    const planeOutline = planeRoot?.children[1]

    expect(inactiveDraftPlaneMesh).toBeInstanceOf(Mesh)
    expect(planeRoot?.visible).toBe(true)
    expect(planeMesh).toBeInstanceOf(Mesh)
    expect(planeOutline).toBeInstanceOf(LineSegments)
    expect(((inactiveDraftPlaneMesh as Mesh).material as MeshBasicMaterial).opacity).toBe(0.12)
    expect(((planeMesh as Mesh).material as MeshBasicMaterial).opacity).toBe(0.2)
    expect(((planeOutline as LineSegments).material as LineBasicMaterial).opacity).toBe(0.9)

    helper.dispose()
  })

  it('uses the overlay preview plane as a hover-equivalent during pick', () => {
    const helper = new SketchPlanePickHelper()
    helper.setOverlay(makeOverlay({ stage: 'pick', draftPlane: 'XY', previewPlane: 'YZ' }))

    const previewPlaneRoot = helper
      .getPreviewPivot()
      .children.find((child) => child.userData.sketchPlaneId === 'YZ')
    const previewPlaneMesh = previewPlaneRoot?.children[0]
    const previewPlaneOutline = previewPlaneRoot?.children[1]

    expect(previewPlaneRoot?.visible).toBe(true)
    expect(((previewPlaneMesh as Mesh).material as MeshBasicMaterial).opacity).toBe(0.2)
    expect(((previewPlaneOutline as LineSegments).material as LineBasicMaterial).opacity).toBe(0.9)
    const activeGrid = helper.getPreviewPivot().children.find(
      (child) => child.name === 'SketchPlaneActiveGrid',
    )
    expect(activeGrid?.rotation.y).toBeCloseTo(Math.PI / 2, 6)

    helper.dispose()
  })

  it('offsets ghost planes away from the origin while keeping the active grid centered like the main viewer', () => {
    const helper = new SketchPlanePickHelper()
    helper.setOverlay(makeOverlay({ stage: 'pick', draftPlane: 'XY' }))

    const xyRoot = helper
      .getPreviewPivot()
      .children.find((child) => child.userData.sketchPlaneId === 'XY')
    const xzRoot = helper
      .getPreviewPivot()
      .children.find((child) => child.userData.sketchPlaneId === 'XZ')
    const yzRoot = helper
      .getPreviewPivot()
      .children.find((child) => child.userData.sketchPlaneId === 'YZ')

    const xyMesh = xyRoot?.children[0]
    const xzMesh = xzRoot?.children[0]
    const yzMesh = yzRoot?.children[0]

    expect(xyMesh?.position.x).toBeGreaterThan(13)
    expect(xyMesh?.position.y).toBeGreaterThan(13)
    expect(xzMesh?.position.x).toBeGreaterThan(13)
    expect(xzMesh?.position.y).toBeLessThan(-13)
    expect(yzMesh?.position.x).toBeLessThan(-13)
    expect(yzMesh?.position.y).toBeGreaterThan(13)

    const activeGrid = helper.getPreviewPivot().children.find(
      (child) => child.name === 'SketchPlaneActiveGrid',
    )
    const gridLineSets = activeGrid?.children ?? []
    const gridCoordinates = gridLineSets.flatMap((child) => {
      if (!(child instanceof LineSegments)) {
        return []
      }
      const positions = (
        child.geometry.getAttribute('position') as { array: ArrayLike<number> } | undefined
      )?.array
      return positions === undefined ? [] : Array.from(positions)
    })
    const gridPlanarCoordinates = gridCoordinates.filter((_, index) => index % 3 !== 2)
    const minGridCoordinate = Math.min(...gridPlanarCoordinates)
    const maxGridCoordinate = Math.max(...gridPlanarCoordinates)

    expect(minGridCoordinate).toBeLessThan(0)
    expect(maxGridCoordinate).toBeGreaterThan(0)

    helper.dispose()
  })

  it('scales ghost plane size and offset from the overlay ui settings', () => {
    const helper = new SketchPlanePickHelper()
    helper.setOverlay(
      makeOverlay({
        stage: 'pick',
        draftPlane: 'XY',
        ui: {
          gizmoScale: 1,
          ghostPlaneScale: 2,
        },
      }),
    )

    const xyRoot = helper
      .getPreviewPivot()
      .children.find((child) => child.userData.sketchPlaneId === 'XY')
    const xyMesh = xyRoot?.children[0]

    expect(xyMesh?.scale.x).toBeCloseTo(2, 6)
    expect(xyMesh?.position.x).toBeGreaterThan(25)
    expect(xyMesh?.position.y).toBeGreaterThan(25)

    helper.dispose()
  })
})

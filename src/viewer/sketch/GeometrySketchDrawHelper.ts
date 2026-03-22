import {
  BufferGeometry,
  Camera,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from 'three'
import type { GeometrySketchOverlayVm } from '../../app/viewerBridge'
import {
  applySketchPlaneFrameToObject,
  getSketchPlaneWorldNormal,
  getSketchPlaneWorldOrigin,
  projectWorldPointToSketchLocal,
} from './sketchPlaneMath'

const GRID_SIZE = 72
const GRID_MINOR_STEP = 1
const GRID_MAJOR_STEP = 10
const GRID_DOUBLE_MAJOR_STEP = 50
const DRAFT_GEOMETRY_ELEVATION = 0.02
const ORIGIN_MARKER_ELEVATION = 0.08
const DRAFT_POINT_MARKER_ELEVATION = DRAFT_GEOMETRY_ELEVATION
const CIRCLE_START_POINT_SYMBOL_SCALE = 0.72
const PLINE_HISTORICAL_POINT_COLOR = 0x8bbdff

const isMultipleOf = (value: number, step: number): boolean => Math.abs(value % step) < 1e-6

const shouldExcludeGridCoordinate = (
  coordinate: number,
  excludedSteps: readonly number[],
): boolean => excludedSteps.some((step) => isMultipleOf(coordinate, step))

const getGridCoordinates = (size: number, step: number): number[] => {
  const halfSize = size / 2
  const coordinates = new Set<number>([0])

  for (let coordinate = step; coordinate <= halfSize + 1e-6; coordinate += step) {
    const normalizedCoordinate = Math.round(coordinate * 1_000) / 1_000
    coordinates.add(normalizedCoordinate)
    coordinates.add(-normalizedCoordinate)
  }

  return [...coordinates].sort((left, right) => left - right)
}

const createGridLayer = (
  size: number,
  step: number,
  opacity: number,
  excludedSteps: readonly number[] = [],
): LineSegments => {
  const positions: number[] = []
  const half = size / 2
  for (const coordinate of getGridCoordinates(size, step)) {
    if (shouldExcludeGridCoordinate(coordinate, excludedSteps)) {
      continue
    }
    positions.push(-half, coordinate, 0, half, coordinate, 0)
    positions.push(coordinate, -half, 0, coordinate, half, 0)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const material = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity,
    toneMapped: false,
    depthTest: false,
  })
  const grid = new LineSegments(geometry, material)
  grid.frustumCulled = false
  return grid
}

const createOriginMarker = (): LineSegments => {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [
        -1.25, 0, 0, 1.25, 0, 0,
        0, -1.25, 0, 0, 1.25, 0,
      ],
      3,
    ),
  )
  const material = new LineBasicMaterial({
    color: 0xffd66b,
    transparent: true,
    opacity: 0.98,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
  })
  const marker = new LineSegments(geometry, material)
  marker.frustumCulled = false
  return marker
}

const createCrosshairMarker = (): LineSegments => {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [
        -0.85, 0, 0, 0.85, 0, 0,
        0, -0.85, 0, 0, 0.85, 0,
      ],
      3,
    ),
  )
  const material = new LineBasicMaterial({
    color: 0xf4f8ff,
    transparent: true,
    opacity: 0.98,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
  })
  const marker = new LineSegments(geometry, material)
  marker.frustumCulled = false
  return marker
}

const createCircleMarker = (): LineSegments => {
  const geometry = new BufferGeometry()
  const radius = 0.78
  const segments = 18
  const positions: number[] = []
  for (let index = 0; index < segments; index += 1) {
    const startAngle = (Math.PI * 2 * index) / segments
    const endAngle = (Math.PI * 2 * (index + 1)) / segments
    positions.push(
      Math.cos(startAngle) * radius,
      Math.sin(startAngle) * radius,
      0,
      Math.cos(endAngle) * radius,
      Math.sin(endAngle) * radius,
      0,
    )
  }
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const material = new LineBasicMaterial({
    color: 0xf4f8ff,
    transparent: true,
    opacity: 0.98,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
  })
  const marker = new LineSegments(geometry, material)
  marker.frustumCulled = false
  return marker
}

const createSnapSquareMarker = (): LineSegments => {
  const halfSize = 1.15
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [
        -halfSize, -halfSize, 0, halfSize, -halfSize, 0,
        halfSize, -halfSize, 0, halfSize, halfSize, 0,
        halfSize, halfSize, 0, -halfSize, halfSize, 0,
        -halfSize, halfSize, 0, -halfSize, -halfSize, 0,
      ],
      3,
    ),
  )
  const material = new LineBasicMaterial({
    color: 0xffd66b,
    transparent: true,
    opacity: 1,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
  })
  const marker = new LineSegments(geometry, material)
  marker.frustumCulled = false
  return marker
}

const createMarkerByType = (
  type: 'crosshair' | 'circle',
  colorHex: number,
): LineSegments => {
  const marker = type === 'circle' ? createCircleMarker() : createCrosshairMarker()
  ;(marker.material as LineBasicMaterial).color.set(colorHex)
  marker.renderOrder = 121
  return marker
}

const setLinePoints = (line: Line, points: Vector3[]): void => {
  const geometry = line.geometry as BufferGeometry
  geometry.setFromPoints(points)
  geometry.computeBoundingSphere()
}

export class GeometrySketchDrawHelper {
  private readonly group = new Group()
  private readonly planePivot = new Group()
  private readonly planeRoot = new Group()
  private readonly raycaster = new Raycaster()
  private readonly pointer = new Vector2()
  private readonly projectionPlane = new Plane()
  private readonly workingGrid = new Group()
  private readonly originMarker = createOriginMarker()
  private readonly snapMarker = createSnapSquareMarker()
  private readonly draftAnchorCrosshairMarker = createCrosshairMarker()
  private readonly draftAnchorCircleMarker = createCircleMarker()
  private readonly cursorMarker = createCrosshairMarker()
  private readonly plineHistoricalCrosshairMarkers = new Group()
  private readonly plineHistoricalCircleMarkers = new Group()
  private readonly chainLine = new Line(
    new BufferGeometry(),
    new LineBasicMaterial({
      color: 0x8bbdff,
      transparent: true,
      opacity: 1,
      toneMapped: false,
      depthTest: false,
      depthWrite: false,
    }),
  )
  private readonly ghostLine = new Line(
    new BufferGeometry(),
    new LineBasicMaterial({
      color: 0xc7ffd5,
      transparent: true,
      opacity: 1,
      toneMapped: false,
      depthTest: false,
      depthWrite: false,
    }),
  )
  private overlay: GeometrySketchOverlayVm | null = null

  public constructor() {
    const minor = createGridLayer(GRID_SIZE, GRID_MINOR_STEP, 0.1, [GRID_MAJOR_STEP, GRID_DOUBLE_MAJOR_STEP])
    const major = createGridLayer(GRID_SIZE, GRID_MAJOR_STEP, 0.3, [GRID_DOUBLE_MAJOR_STEP])
    const doubleMajor = createGridLayer(GRID_SIZE, GRID_DOUBLE_MAJOR_STEP, 1)
    major.position.z = 0.001
    doubleMajor.position.z = 0.002
    this.workingGrid.add(minor)
    this.workingGrid.add(major)
    this.workingGrid.add(doubleMajor)

    this.group.name = 'GeometrySketchDrawHelper'
    this.group.visible = false
    this.planePivot.add(this.planeRoot)
    this.planeRoot.add(this.workingGrid)
    this.planeRoot.add(this.originMarker)
    this.planeRoot.add(this.snapMarker)
    this.group.add(this.planePivot)
    this.planeRoot.add(this.plineHistoricalCrosshairMarkers)
    this.planeRoot.add(this.plineHistoricalCircleMarkers)
    this.planeRoot.add(this.draftAnchorCrosshairMarker)
    this.planeRoot.add(this.draftAnchorCircleMarker)
    this.group.add(this.chainLine)
    this.group.add(this.ghostLine)
    this.planeRoot.add(this.cursorMarker)

    this.chainLine.frustumCulled = false
    this.ghostLine.frustumCulled = false
    this.chainLine.renderOrder = 119
    this.ghostLine.renderOrder = 120
    this.snapMarker.renderOrder = 121
    this.draftAnchorCrosshairMarker.renderOrder = 122
    this.draftAnchorCircleMarker.renderOrder = 122
    this.cursorMarker.renderOrder = 123
    this.originMarker.renderOrder = 118
    ;(this.draftAnchorCrosshairMarker.material as LineBasicMaterial).color.set(0xffd66b)
    ;(this.draftAnchorCircleMarker.material as LineBasicMaterial).color.set(0xffd66b)
  }

  public getGroup(): Group {
    return this.group
  }

  public setOverlay(overlay: GeometrySketchOverlayVm | null): void {
    this.overlay = overlay
    const showDrawPreview =
      overlay !== null &&
      overlay.mode === 'draw' &&
      overlay.drawDraft !== null &&
      (overlay.activeTool === 'line' ||
        overlay.activeTool === 'pline' ||
        overlay.activeTool === 'rectangle' ||
        overlay.activeTool === 'circle')
    this.group.visible = showDrawPreview
    if (!showDrawPreview || overlay === null || overlay.drawDraft === null) {
      setLinePoints(this.chainLine, [])
      setLinePoints(this.ghostLine, [])
      this.snapMarker.visible = false
      this.setPlineHistoricalMarkers('crosshair', false, [], 1)
      this.setPlineHistoricalMarkers('circle', false, [], 1)
      this.draftAnchorCrosshairMarker.visible = false
      this.draftAnchorCircleMarker.visible = false
      this.cursorMarker.visible = false
      return
    }

    this.planePivot.matrixAutoUpdate = false
    this.planePivot.matrix.identity()
    this.planePivot.matrixWorld.identity()
    applySketchPlaneFrameToObject(this.planeRoot, overlay.plane, overlay.planeTransform)
    this.cursorMarker.scale.setScalar(overlay.ui.crosshairSize)
    this.draftAnchorCrosshairMarker.scale.setScalar(overlay.ui.startPointSymbolSize)
    this.draftAnchorCircleMarker.scale.setScalar(
      overlay.ui.startPointSymbolSize * CIRCLE_START_POINT_SYMBOL_SCALE,
    )
    this.snapMarker.scale.setScalar(overlay.ui.startPointSymbolSize)
    this.syncPlineHistoricalMarkers(overlay)

    setLinePoints(this.chainLine, [])
    this.chainLine.visible = false

    const anchorPoint =
      overlay.activeTool === 'line' ||
      overlay.activeTool === 'rectangle' ||
      overlay.activeTool === 'circle'
        ? overlay.drawDraft.points[0] ?? null
        : overlay.drawDraft.points[overlay.drawDraft.points.length - 1] ?? null
    const activeDraftAnchorMarker =
      overlay.ui.startPointSymbolType === 'circle'
        ? this.draftAnchorCircleMarker
        : this.draftAnchorCrosshairMarker
    const inactiveDraftAnchorMarker =
      overlay.ui.startPointSymbolType === 'circle'
        ? this.draftAnchorCrosshairMarker
        : this.draftAnchorCircleMarker
    inactiveDraftAnchorMarker.visible = false
    if (overlay.ui.startPointVisible && anchorPoint !== null) {
      activeDraftAnchorMarker.visible = true
      activeDraftAnchorMarker.position.set(
        anchorPoint.x,
        anchorPoint.y,
        DRAFT_POINT_MARKER_ELEVATION,
      )
    } else {
      activeDraftAnchorMarker.visible = false
    }

    if (overlay.ui.snapEnabled && overlay.drawDraft.hoverSnapTarget === 'origin') {
      this.snapMarker.visible = true
      this.snapMarker.position.set(0, 0, DRAFT_POINT_MARKER_ELEVATION)
    } else {
      this.snapMarker.visible = false
    }

    const ghostStart =
      overlay.activeTool === 'line' ||
      overlay.activeTool === 'rectangle' ||
      overlay.activeTool === 'circle'
        ? overlay.drawDraft.points[0] ?? null
        : overlay.drawDraft.points[overlay.drawDraft.points.length - 1] ?? null
    const ghostEnd = overlay.drawDraft.hoverPoint
    if (
      overlay.activeTool === 'circle' &&
      ghostStart !== null &&
      ghostEnd !== null &&
      (ghostStart.x !== ghostEnd.x || ghostStart.y !== ghostEnd.y)
    ) {
      setLinePoints(this.ghostLine, [
        new Vector3(ghostStart.x, ghostStart.y, DRAFT_GEOMETRY_ELEVATION),
        new Vector3(ghostEnd.x, ghostEnd.y, DRAFT_GEOMETRY_ELEVATION),
      ])
      this.ghostLine.visible = true
    } else {
      setLinePoints(this.ghostLine, [])
      this.ghostLine.visible = false
    }

    if (overlay.drawDraft.hoverPoint !== null) {
      this.cursorMarker.visible = true
      this.cursorMarker.position.set(
        overlay.drawDraft.hoverPoint.x,
        overlay.drawDraft.hoverPoint.y,
        DRAFT_POINT_MARKER_ELEVATION,
      )
      ;(this.cursorMarker.material as LineBasicMaterial).color.set(
        overlay.drawDraft.hoverSnapTarget === 'origin' ? 0xffd66b : 0xf4f8ff,
      )
    } else {
      this.cursorMarker.visible = false
    }

    this.originMarker.position.z = ORIGIN_MARKER_ELEVATION
  }

  private syncPlineHistoricalMarkers(overlay: GeometrySketchOverlayVm): void {
    const drawDraft = overlay.drawDraft
    const shouldShowHistoricalPoints =
      overlay.activeTool === 'pline' &&
      overlay.ui.plinePointVisible &&
      drawDraft !== null &&
      drawDraft.points.length > 1
    const historicalPoints = shouldShowHistoricalPoints
      ? drawDraft.points.slice(0, -1)
      : []
    this.setPlineHistoricalMarkers(
      'crosshair',
      overlay.ui.plinePointSymbolType === 'crosshair',
      historicalPoints,
      overlay.ui.plinePointSymbolSize,
    )
    this.setPlineHistoricalMarkers(
      'circle',
      overlay.ui.plinePointSymbolType === 'circle',
      historicalPoints,
      overlay.ui.plinePointSymbolSize * CIRCLE_START_POINT_SYMBOL_SCALE,
    )
  }

  private setPlineHistoricalMarkers(
    symbolType: 'crosshair' | 'circle',
    visible: boolean,
    points: Array<{ x: number; y: number }>,
    scale: number,
  ): void {
    const group =
      symbolType === 'circle'
        ? this.plineHistoricalCircleMarkers
        : this.plineHistoricalCrosshairMarkers
    while (group.children.length < points.length) {
      group.add(createMarkerByType(symbolType, PLINE_HISTORICAL_POINT_COLOR))
    }
    group.children.forEach((child, index) => {
      const marker = child as LineSegments
      if (!visible || index >= points.length) {
        marker.visible = false
        return
      }
      const point = points[index]
      marker.visible = true
      marker.position.set(point.x, point.y, DRAFT_POINT_MARKER_ELEVATION)
      marker.scale.setScalar(scale)
    })
  }

  public projectPointerToSketch(
    camera: Camera,
    domElement: HTMLElement,
    clientX: number,
    clientY: number,
  ): { point: { x: number; y: number }; snapTarget: 'origin' | null } | null {
    if (
      this.overlay === null ||
      this.overlay.mode !== 'draw'
    ) {
      return null
    }

    const rect = domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return null
    }

    this.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1),
    )
    this.raycaster.setFromCamera(this.pointer, camera)

    const planeOrigin = getSketchPlaneWorldOrigin(this.overlay.plane, this.overlay.planeTransform)
    const planeNormal = getSketchPlaneWorldNormal(this.overlay.plane, this.overlay.planeTransform)
    this.projectionPlane.setFromNormalAndCoplanarPoint(planeNormal, planeOrigin)
    const hit = this.raycaster.ray.intersectPlane(this.projectionPlane, new Vector3())
    if (hit === null) {
      return null
    }

    const supportsOriginSnap =
      this.overlay.drawDraft !== null &&
      (this.overlay.activeTool === 'line' ||
        this.overlay.activeTool === 'pline' ||
        this.overlay.activeTool === 'rectangle' ||
        this.overlay.activeTool === 'circle')
    const snappedToOrigin =
      supportsOriginSnap &&
      this.overlay.ui.snapEnabled &&
      planeOrigin
        .clone()
        .project(camera)
        .sub(new Vector3(this.pointer.x, this.pointer.y, 0))
        .length() *
        Math.min(rect.width, rect.height) /
        2 <=
      this.overlay.ui.snapDistancePx
    if (snappedToOrigin) {
      return {
        point: { x: 0, y: 0 },
        snapTarget: 'origin',
      }
    }

    const localPoint = projectWorldPointToSketchLocal(
      this.overlay.plane,
      this.overlay.planeTransform,
      hit,
    )
    return {
      point: {
        x: Math.round(localPoint.x * 1_000) / 1_000,
        y: Math.round(localPoint.y * 1_000) / 1_000,
      },
      snapTarget: null,
    }
  }

  public dispose(): void {
    ;[
      this.chainLine,
      this.ghostLine,
      this.originMarker,
      this.snapMarker,
      ...this.plineHistoricalCrosshairMarkers.children,
      ...this.plineHistoricalCircleMarkers.children,
      this.draftAnchorCrosshairMarker,
      this.draftAnchorCircleMarker,
      this.cursorMarker,
      ...this.workingGrid.children,
    ].forEach((object) => {
      if (object instanceof Line || object instanceof LineSegments) {
        object.geometry.dispose()
        const material = object.material
        if (Array.isArray(material)) {
          material.forEach((entry) => entry.dispose())
        } else {
          material.dispose()
        }
      }
    })
  }
}

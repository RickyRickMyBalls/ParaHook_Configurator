import {
  BufferGeometry,
  Camera,
  Color,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3,
} from 'three'
import type { SketchPlane } from '../../app/spaghetti/features/featureTypes'
import type { SketchPlanePickOverlayVm } from '../../app/viewerBridge'

const PLANE_SIZE = 26
const PLANE_ORIGIN_GAP = 3
const GRID_SIZE = 72
const GRID_MINOR_STEP = 1
const GRID_MAJOR_STEP = 10
const GRID_DOUBLE_MAJOR_STEP = 50
const AXIS_LENGTH = 26
const ACTIVE_FILL = new Color('#7cd4ff')
const ACTIVE_EDGE = new Color('#ffd66b')
const INACTIVE_FILL = new Color('#8aa9d8')
const INACTIVE_EDGE = new Color('#cfd9ff')
const ORIGIN_COLOR = new Color('#ffffff')
const HOVER_FILL = new Color('#f6c67d')
const HOVER_EDGE = new Color('#fff0c6')

const PLANE_IDS: readonly SketchPlane[] = ['XY', 'XZ', 'YZ'] as const

const DEFAULT_NORMALS: Record<SketchPlane, Vector3> = {
  XY: new Vector3(0, 0, 1),
  XZ: new Vector3(0, 1, 0),
  YZ: new Vector3(1, 0, 0),
}

const getPlanePositiveQuadrantOffsetLocal = (
  plane: SketchPlane,
  planeScale: number,
): Vector3 => {
  const half = (PLANE_SIZE * planeScale) / 2
  const offset = PLANE_ORIGIN_GAP + half
  if (plane === 'XZ') {
    return new Vector3(offset, -offset, 0)
  }
  if (plane === 'YZ') {
    return new Vector3(-offset, offset, 0)
  }
  return new Vector3(offset, offset, 0)
}

const setPlaneBaseRotation = (target: Object3D, plane: SketchPlane): void => {
  target.rotation.set(0, 0, 0)
  if (plane === 'XZ') {
    target.rotateX(-Math.PI / 2)
    return
  }
  if (plane === 'YZ') {
    target.rotateY(Math.PI / 2)
  }
}

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

const createAxisLine = (direction: Vector3, color: Color): LineSegments => {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [0, 0, 0, direction.x * AXIS_LENGTH, direction.y * AXIS_LENGTH, direction.z * AXIS_LENGTH],
      3,
    ),
  )
  const material = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
    depthTest: false,
  })
  const line = new LineSegments(geometry, material)
  line.frustumCulled = false
  line.renderOrder = 112
  return line
}

const createOriginCross = (): LineSegments => {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [
        -1.2, 0, 0, 1.2, 0, 0,
        0, -1.2, 0, 0, 1.2, 0,
        0, 0, -1.2, 0, 0, 1.2,
      ],
      3,
    ),
  )
  const material = new LineBasicMaterial({
    color: ORIGIN_COLOR,
    transparent: true,
    opacity: 0.95,
    toneMapped: false,
    depthTest: false,
  })
  const cross = new LineSegments(geometry, material)
  cross.frustumCulled = false
  cross.renderOrder = 113
  return cross
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
  grid.renderOrder = 109 + opacity
  return grid
}

const createPlaneGrid = (): Group => {
  const group = new Group()
  group.name = 'SketchPlaneActiveGrid'
  const minor = createGridLayer(
    GRID_SIZE,
    GRID_MINOR_STEP,
    0.1,
    [GRID_MAJOR_STEP, GRID_DOUBLE_MAJOR_STEP],
  )
  const major = createGridLayer(GRID_SIZE, GRID_MAJOR_STEP, 0.3, [GRID_DOUBLE_MAJOR_STEP])
  const doubleMajor = createGridLayer(GRID_SIZE, GRID_DOUBLE_MAJOR_STEP, 1)
  major.position.z = 0.001
  doubleMajor.position.z = 0.002
  group.add(minor)
  group.add(major)
  group.add(doubleMajor)
  return group
}

const getPlaneOffsetVector = (
  plane: SketchPlane,
  overlay: SketchPlanePickOverlayVm,
): Vector3 => {
  const normal = DEFAULT_NORMALS[plane].clone()
  return normal.multiplyScalar(overlay.draftTransform.offsetMm)
}

type PlaneVisual = {
  root: Group
  mesh: Mesh
  outline: LineSegments
}

const createPlaneVisual = (plane: SketchPlane): PlaneVisual => {
  const root = new Group()
  root.name = `sketch-plane-preview:${plane}`
  root.userData.sketchPlaneId = plane
  const positiveQuadrantOffset = getPlanePositiveQuadrantOffsetLocal(plane, 1)

  const mesh = new Mesh(
    new PlaneGeometry(PLANE_SIZE, PLANE_SIZE),
    new MeshBasicMaterial({
      color: INACTIVE_FILL,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
      side: DoubleSide,
    }),
  )
  mesh.userData.sketchPlaneId = plane
  mesh.frustumCulled = false
  mesh.renderOrder = 108
  mesh.position.copy(positiveQuadrantOffset)

  const outline = new LineSegments(
    new EdgesGeometry(mesh.geometry),
    new LineBasicMaterial({
      color: INACTIVE_EDGE,
      transparent: true,
      opacity: 0.68,
      toneMapped: false,
      depthTest: false,
    }),
  )
  outline.frustumCulled = false
  outline.renderOrder = 109
  outline.position.copy(positiveQuadrantOffset)

  root.add(mesh)
  root.add(outline)
  return { root, mesh, outline }
}

export class SketchPlanePickHelper {
  private readonly group = new Group()
  private readonly previewPivot = new Group()
  private readonly axesGroup = new Group()
  private readonly planeVisuals = new Map<SketchPlane, PlaneVisual>()
  private readonly activeGrid = createPlaneGrid()
  private readonly raycaster = new Raycaster()
  private readonly pointer = new Vector2()
  private overlay: SketchPlanePickOverlayVm | null = null
  private hoveredPlane: SketchPlane | null = null

  public constructor() {
    this.group.name = 'SketchPlanePickHelper'
    this.group.visible = false
    this.group.renderOrder = 108

    this.axesGroup.add(createAxisLine(new Vector3(1, 0, 0), new Color('#ff6464')))
    this.axesGroup.add(createAxisLine(new Vector3(0, 1, 0), new Color('#4bff7a')))
    this.axesGroup.add(createAxisLine(new Vector3(0, 0, 1), new Color('#52a6ff')))
    this.axesGroup.add(createOriginCross())
    this.axesGroup.renderOrder = 112

    for (const plane of PLANE_IDS) {
      const visual = createPlaneVisual(plane)
      this.planeVisuals.set(plane, visual)
      this.previewPivot.add(visual.root)
    }

    this.previewPivot.add(this.axesGroup)
    this.previewPivot.add(this.activeGrid)
    this.group.add(this.previewPivot)
  }

  public getGroup(): Group {
    return this.group
  }

  public getPreviewPivot(): Group {
    return this.previewPivot
  }

  public setOverlay(overlay: SketchPlanePickOverlayVm | null): void {
    this.overlay = overlay
    this.hoveredPlane = overlay?.stage === 'pick' ? this.hoveredPlane : null
    this.group.visible = overlay !== null
    if (overlay === null) {
      this.previewPivot.position.set(0, 0, 0)
      this.previewPivot.rotation.set(0, 0, 0)
      return
    }

    this.previewPivot.position.set(
      overlay.draftTransform.translation.x,
      overlay.draftTransform.translation.y,
      overlay.draftTransform.translation.z,
    )
    this.previewPivot.rotation.set(
      MathUtils.degToRad(overlay.draftTransform.rotationDeg.x),
      MathUtils.degToRad(overlay.draftTransform.rotationDeg.y),
      MathUtils.degToRad(overlay.draftTransform.rotationDeg.z),
      'XYZ',
    )

    this.axesGroup.rotation.set(0, 0, 0)

    for (const plane of PLANE_IDS) {
      const visual = this.planeVisuals.get(plane)
      if (visual === undefined) {
        continue
      }
      const planeScale = overlay.ui.ghostPlaneScale
      const positiveQuadrantOffset = getPlanePositiveQuadrantOffsetLocal(plane, planeScale)
      visual.root.position.set(0, 0, 0)
      visual.root.rotation.set(0, 0, 0)
      setPlaneBaseRotation(visual.root, plane)
      if (plane === overlay.draftPlane) {
        visual.root.rotateZ(MathUtils.degToRad(overlay.draftTransform.inPlaneRotationDeg))
      }
      visual.mesh.scale.setScalar(planeScale)
      visual.outline.scale.setScalar(planeScale)
      visual.mesh.position.copy(positiveQuadrantOffset)
      visual.outline.position.copy(positiveQuadrantOffset)

      const isActive = overlay.stage !== 'pick' && plane === overlay.draftPlane
      const isHovered = overlay.stage === 'pick' && plane === this.hoveredPlane
      visual.root.visible = overlay.stage === 'pick' || isActive
      ;(visual.mesh.material as MeshBasicMaterial).color.copy(
        isActive ? ACTIVE_FILL : isHovered ? HOVER_FILL : INACTIVE_FILL,
      )
      ;(visual.mesh.material as MeshBasicMaterial).opacity = isActive ? 0.26 : isHovered ? 0.2 : 0.12
      ;(visual.outline.material as LineBasicMaterial).color.copy(
        isActive ? ACTIVE_EDGE : isHovered ? HOVER_EDGE : INACTIVE_EDGE,
      )
      ;(visual.outline.material as LineBasicMaterial).opacity = isActive ? 0.94 : isHovered ? 0.9 : 0.68
    }

    this.activeGrid.position.set(0, 0, 0)
    this.activeGrid.rotation.set(0, 0, 0)
    setPlaneBaseRotation(this.activeGrid, overlay.draftPlane)
    this.activeGrid.rotateZ(MathUtils.degToRad(overlay.draftTransform.inPlaneRotationDeg))
    this.activeGrid.position.copy(getPlaneOffsetVector(overlay.draftPlane, overlay))
  }

  public readDraftTransform(): SketchPlanePickOverlayVm['draftTransform'] | null {
    if (this.overlay === null) {
      return null
    }
    return {
      offsetMm: this.overlay.draftTransform.offsetMm,
      inPlaneRotationDeg: this.overlay.draftTransform.inPlaneRotationDeg,
      translation: {
        x: this.previewPivot.position.x,
        y: this.previewPivot.position.y,
        z: this.previewPivot.position.z,
      },
      rotationDeg: {
        x: MathUtils.radToDeg(this.previewPivot.rotation.x),
        y: MathUtils.radToDeg(this.previewPivot.rotation.y),
        z: MathUtils.radToDeg(this.previewPivot.rotation.z),
      },
    }
  }

  public pickPlane(
    camera: Camera,
    domElement: HTMLElement,
    clientX: number,
    clientY: number,
  ): SketchPlane | null {
    if (this.overlay === null || !this.group.visible) {
      return null
    }
    const rect = domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) {
      return null
    }
    this.pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    )
    this.raycaster.setFromCamera(this.pointer, camera)
    const hits = this.raycaster.intersectObjects(
      [...this.planeVisuals.values()].map((visual) => visual.mesh),
      false,
    )
    for (const hit of hits) {
      const planeId = hit.object.userData.sketchPlaneId
      if (planeId === 'XY' || planeId === 'XZ' || planeId === 'YZ') {
        return planeId
      }
    }
    return null
  }

  public setHoveredPlane(plane: SketchPlane | null): void {
    if (this.hoveredPlane === plane) {
      return
    }
    this.hoveredPlane = plane
    this.setOverlay(this.overlay)
  }

  public dispose(): void {
    for (const visual of this.planeVisuals.values()) {
      visual.mesh.geometry.dispose()
      ;(visual.mesh.material as MeshBasicMaterial).dispose()
      visual.outline.geometry.dispose()
      ;(visual.outline.material as LineBasicMaterial).dispose()
    }
    this.activeGrid.children.forEach((child) => {
      if (child instanceof LineSegments) {
        child.geometry.dispose()
        ;(child.material as LineBasicMaterial).dispose()
      }
    })
    this.axesGroup.children.forEach((child) => {
      if (child instanceof LineSegments) {
        child.geometry.dispose()
        ;(child.material as LineBasicMaterial).dispose()
      }
    })
  }
}

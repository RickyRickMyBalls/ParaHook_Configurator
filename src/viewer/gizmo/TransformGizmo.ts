import { Camera, MathUtils, Object3D, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import type { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'

type GizmoSpace = 'local' | 'world'
type GizmoAxis = 'X' | 'Y' | 'Z' | 'E' | 'XYZ' | 'XYZE'
type PointerLike = { x: number; y: number; button: number }
type InternalTransformControls = TransformControls & {
  axis: string | null
  dragging: boolean
  pointerDown: (pointer: PointerLike) => void
  pointerUp: (pointer: PointerLike | null) => void
  reset: () => void
  _onPointerMove: (event: PointerEvent) => void
}

export class TransformGizmo {
  private camera: Camera
  private readonly domElement: HTMLElement
  private readonly orbitControls: OrbitControls
  private readonly controls: TransformControls
  private readonly helper: Object3D
  private enabled = true
  private attachedObject: Object3D | null = null
  private onObjectChange: ((object: Object3D) => void) | null = null
  private onDragComplete: ((object: Object3D) => void) | null = null
  private lastPointerClient: { clientX: number; clientY: number; pointerId: number } | null = null
  private dragDidMutateObject = false
  private suppressNextDragComplete = false

  public constructor(
    camera: Camera,
    domElement: HTMLElement,
    orbitControls: OrbitControls,
  ) {
    this.camera = camera
    this.domElement = domElement
    this.orbitControls = orbitControls
    this.controls = new TransformControls(camera, domElement)
    this.helper = this.controls.getHelper()
    this.helper.visible = false
    this.controls.addEventListener('dragging-changed', this.onDraggingChanged)
    this.controls.addEventListener('objectChange', this.onObjectChanged)
    this.domElement.addEventListener('pointermove', this.handlePointerTrack)
  }

  public getHelper(): Object3D {
    return this.helper
  }

  public dispose(): void {
    this.controls.removeEventListener('dragging-changed', this.onDraggingChanged)
    this.controls.removeEventListener('objectChange', this.onObjectChanged)
    this.domElement.removeEventListener('pointermove', this.handlePointerTrack)
    this.controls.dispose()
  }

  public attach(object: Object3D): void {
    if (this.attachedObject === object && this.enabled && this.helper.visible) {
      return
    }
    this.attachedObject = object
    if (!this.enabled) {
      return
    }
    this.controls.attach(object)
    this.helper.visible = true
  }

  public detach(): void {
    this.controls.detach()
    this.attachedObject = null
    this.helper.visible = false
  }

  public setMode(mode: TransformControlsMode): void {
    const currentMode =
      typeof (this.controls as TransformControls & { getMode?: () => TransformControlsMode }).getMode ===
      'function'
        ? (this.controls as TransformControls & { getMode: () => TransformControlsMode }).getMode()
        : null
    if (currentMode === mode) {
      return
    }
    this.controls.setMode(mode)
    this.controls.axis = null
  }

  public setSpace(space: GizmoSpace): void {
    this.controls.setSpace(space)
  }

  public setCamera(camera: Camera): void {
    this.camera = camera
    ;(this.controls as TransformControls & { camera?: Camera }).camera = camera
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
    this.controls.enabled = enabled
    if (!enabled) {
      this.controls.detach()
      this.helper.visible = false
      return
    }
    if (this.attachedObject !== null) {
      this.controls.attach(this.attachedObject)
      this.helper.visible = true
    }
  }

  public isAttached(): boolean {
    return this.attachedObject !== null
  }

  public setOnObjectChange(handler: ((object: Object3D) => void) | null): void {
    this.onObjectChange = handler
  }

  public setOnDragComplete(handler: ((object: Object3D) => void) | null): void {
    this.onDragComplete = handler
  }

  public setSnap(translateMm?: number, rotateDeg?: number, scale?: number): void {
    this.controls.setTranslationSnap(translateMm ?? null)
    this.controls.setRotationSnap(
      rotateDeg === undefined ? null : MathUtils.degToRad(rotateDeg),
    )
    this.controls.setScaleSnap(scale ?? null)
  }

  public setSize(size: number): void {
    ;(this.controls as TransformControls & { setSize: (nextSize: number) => void }).setSize(size)
  }

  public activateHandle(mode: TransformControlsMode, axis: GizmoAxis): void {
    this.controls.setMode(mode)
    this.controls.axis = axis
  }

  public clearActiveHandle(): void {
    this.controls.axis = null
  }

  public beginHandleDrag(mode: TransformControlsMode, axis: GizmoAxis): boolean {
    this.activateHandle(mode, axis)

    if (!this.enabled || this.attachedObject === null || this.lastPointerClient === null) {
      return false
    }

    const controls = this.controls as InternalTransformControls
    const pointer = this.toPointerLike(
      this.lastPointerClient.clientX,
      this.lastPointerClient.clientY,
    )

    try {
      this.domElement.setPointerCapture(this.lastPointerClient.pointerId)
    } catch {
      // Pointer capture is best-effort here because this drag is keyboard-initiated.
    }

    this.domElement.addEventListener('pointermove', controls._onPointerMove)
    controls.pointerDown(pointer)
    return true
  }

  public completeActiveDrag(): void {
    const controls = this.controls as InternalTransformControls
    if (!controls.dragging) {
      return
    }
    this.domElement.removeEventListener('pointermove', controls._onPointerMove)
    controls.pointerUp(null)
  }

  public cancelActiveDrag(): void {
    const controls = this.controls as InternalTransformControls
    if (!controls.dragging) {
      return
    }
    this.suppressNextDragComplete = true
    controls.reset()
    this.domElement.removeEventListener('pointermove', controls._onPointerMove)
    controls.pointerUp(null)
  }

  public beginTranslateCenterHandleDragFromGizmoCenter(): boolean {
    this.activateHandle('translate', 'XYZ')

    if (!this.enabled || this.attachedObject === null) {
      return false
    }

    const worldPosition = this.attachedObject.getWorldPosition(new Vector3())
    const projected = worldPosition.clone().project(this.camera)
    const rect = this.domElement.getBoundingClientRect()
    const clientX = rect.left + ((projected.x + 1) * 0.5 * rect.width)
    const clientY = rect.top + (((-projected.y) + 1) * 0.5 * rect.height)
    const controls = this.controls as InternalTransformControls

    this.domElement.addEventListener('pointermove', controls._onPointerMove)
    controls.pointerDown(this.toPointerLike(clientX, clientY))
    return true
  }

  public beginCenterHandleDragFromGizmoCenter(
    mode: TransformControlsMode,
    axis: Extract<GizmoAxis, 'XYZ' | 'XYZE'>,
  ): boolean {
    this.activateHandle(mode, axis)

    if (!this.enabled || this.attachedObject === null) {
      return false
    }

    const worldPosition = this.attachedObject.getWorldPosition(new Vector3())
    const projected = worldPosition.clone().project(this.camera)
    const rect = this.domElement.getBoundingClientRect()
    const clientX = rect.left + ((projected.x + 1) * 0.5 * rect.width)
    const clientY = rect.top + (((-projected.y) + 1) * 0.5 * rect.height)
    const controls = this.controls as InternalTransformControls

    this.domElement.addEventListener('pointermove', controls._onPointerMove)
    controls.pointerDown(this.toPointerLike(clientX, clientY))
    return true
  }

  private toPointerLike(clientX: number, clientY: number): PointerLike {
    const rect = this.domElement.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1,
      button: 0,
    }
  }

  private readonly handlePointerTrack = (event: PointerEvent): void => {
    this.lastPointerClient = {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerId: event.pointerId,
    }
  }

  private readonly onDraggingChanged = (event: { value?: unknown }): void => {
    const dragging = event.value === true
    this.orbitControls.enabled = !dragging
    if (dragging) {
      this.dragDidMutateObject = false
      this.suppressNextDragComplete = false
      return
    }
    if (this.suppressNextDragComplete) {
      this.dragDidMutateObject = false
      this.suppressNextDragComplete = false
      return
    }
    if (this.attachedObject !== null && this.dragDidMutateObject) {
      this.onDragComplete?.(this.attachedObject)
    }
    this.dragDidMutateObject = false
  }

  private readonly onObjectChanged = (): void => {
    if (this.attachedObject === null) {
      return
    }
    this.dragDidMutateObject = true
    this.onObjectChange?.(this.attachedObject)
  }
}

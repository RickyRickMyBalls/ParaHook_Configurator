import { Camera, MathUtils, Object3D } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import type { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'

type GizmoSpace = 'local' | 'world'

export class TransformGizmo {
  private readonly orbitControls: OrbitControls
  private readonly controls: TransformControls
  private readonly helper: Object3D
  private enabled = true
  private attachedObject: Object3D | null = null

  public constructor(
    camera: Camera,
    domElement: HTMLElement,
    orbitControls: OrbitControls,
  ) {
    this.orbitControls = orbitControls
    this.controls = new TransformControls(camera, domElement)
    this.helper = this.controls.getHelper()
    this.helper.visible = false
    this.controls.addEventListener('dragging-changed', this.onDraggingChanged)
  }

  public getHelper(): Object3D {
    return this.helper
  }

  public dispose(): void {
    this.controls.removeEventListener('dragging-changed', this.onDraggingChanged)
    this.controls.dispose()
  }

  public attach(object: Object3D): void {
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
    this.controls.setMode(mode)
  }

  public setSpace(space: GizmoSpace): void {
    this.controls.setSpace(space)
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

  public setSnap(translateMm?: number, rotateDeg?: number, scale?: number): void {
    this.controls.setTranslationSnap(translateMm ?? null)
    this.controls.setRotationSnap(
      rotateDeg === undefined ? null : MathUtils.degToRad(rotateDeg),
    )
    this.controls.setScaleSnap(scale ?? null)
  }

  private readonly onDraggingChanged = (event: { value?: unknown }): void => {
    const dragging = event.value === true
    this.orbitControls.enabled = !dragging
  }
}

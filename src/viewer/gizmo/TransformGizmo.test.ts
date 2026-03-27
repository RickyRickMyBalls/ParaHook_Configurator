// @vitest-environment jsdom

import { Object3D, PerspectiveCamera } from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const attachMock = vi.fn()
const detachMock = vi.fn()
const setModeMock = vi.fn()
const setSpaceMock = vi.fn()
const setTranslationSnapMock = vi.fn()
const setRotationSnapMock = vi.fn()
const setScaleSnapMock = vi.fn()
const addEventListenerMock = vi.fn()
const removeEventListenerMock = vi.fn()
const disposeMock = vi.fn()
const setSizeMock = vi.fn()
const getModeMock = vi.fn<() => 'translate' | 'rotate' | 'scale'>()

const helper = new Object3D()

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: class {
    public enabled = true
  },
}))

vi.mock('three/examples/jsm/controls/TransformControls.js', () => ({
  TransformControls: class {
    public axis: string | null = null
    public dragging = false
    public enabled = true
    public object: Object3D | null = null

    public addEventListener = addEventListenerMock
    public removeEventListener = removeEventListenerMock
    public attach = (object: Object3D) => {
      this.object = object
      attachMock(object)
    }
    public detach = () => {
      this.object = null
      detachMock()
    }
    public dispose = disposeMock
    public getHelper = () => helper
    public getMode = getModeMock
    public setMode = setModeMock
    public setSpace = setSpaceMock
    public setTranslationSnap = setTranslationSnapMock
    public setRotationSnap = setRotationSnapMock
    public setScaleSnap = setScaleSnapMock
    public setSize = setSizeMock
    public pointerDown = vi.fn()
    public pointerUp = vi.fn()
    public reset = vi.fn()
    public _onPointerMove = vi.fn()
  },
}))

import { TransformGizmo } from './TransformGizmo'

describe('TransformGizmo', () => {
  beforeEach(() => {
    attachMock.mockClear()
    detachMock.mockClear()
    setModeMock.mockClear()
    setSpaceMock.mockClear()
    setTranslationSnapMock.mockClear()
    setRotationSnapMock.mockClear()
    setScaleSnapMock.mockClear()
    addEventListenerMock.mockClear()
    removeEventListenerMock.mockClear()
    disposeMock.mockClear()
    setSizeMock.mockClear()
    getModeMock.mockReset()
    getModeMock.mockReturnValue('translate')
    helper.visible = false
  })

  it('does not reset axis when setMode receives the already-active mode', () => {
    const domElement = document.createElement('div')
    const gizmo = new TransformGizmo(
      new PerspectiveCamera(),
      domElement,
      { enabled: true } as never,
    )

    const target = new Object3D()
    gizmo.attach(target)
    gizmo.activateHandle('translate', 'X')
    setModeMock.mockClear()

    gizmo.setMode('translate')

    expect(setModeMock).not.toHaveBeenCalled()
    gizmo.dispose()
  })

  it('does not reattach the same object repeatedly', () => {
    const domElement = document.createElement('div')
    const gizmo = new TransformGizmo(
      new PerspectiveCamera(),
      domElement,
      { enabled: true } as never,
    )

    const target = new Object3D()

    gizmo.attach(target)
    gizmo.attach(target)

    expect(attachMock).toHaveBeenCalledTimes(1)
    gizmo.dispose()
  })

  it('reports transform dragging state changes', () => {
    const domElement = document.createElement('div')
    const gizmo = new TransformGizmo(
      new PerspectiveCamera(),
      domElement,
      { enabled: true } as never,
    )
    const handleDraggingChange = vi.fn()
    gizmo.setOnDraggingChange(handleDraggingChange)

    const draggingChangedHandler = addEventListenerMock.mock.calls.find(
      ([eventName]) => eventName === 'dragging-changed',
    )?.[1] as ((event: { value?: unknown }) => void) | undefined

    draggingChangedHandler?.({ value: true })
    draggingChangedHandler?.({ value: false })

    expect(handleDraggingChange).toHaveBeenNthCalledWith(1, true)
    expect(handleDraggingChange).toHaveBeenNthCalledWith(2, false)
    gizmo.dispose()
  })
})

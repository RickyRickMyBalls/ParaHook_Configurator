import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { setViewer } from './viewerBridge'
import {
  frameAllCommand,
  frameExtentsCommand,
  framePreviousCommand,
  frameReferenceCommand,
  frameSelectedCommand,
  frameSelectedGeometrySketchCommand,
  setCameraPresetCommand,
  setConsoleCameraModeCommand,
  setProjectionModeCommand,
} from './viewCommands'

describe('viewCommands', () => {
  beforeEach(() => {
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    setViewer(null)
  })

  it('updates projection through one shared view command seam', () => {
    setProjectionModeCommand('orthographic')

    expect(useUiPrefsStore.getState().view.projectionMode).toBe('orthographic')
  })

  it('routes frame and camera commands through the active viewer bridge', () => {
    const setCameraPreset = vi.fn()
    const frameAll = vi.fn()
    const frameExtents = vi.fn()
    const framePrevious = vi.fn()
    const frameSelected = vi.fn()
    const frameSelectedGeometrySketch = vi.fn(() => true)
    const frameReference = vi.fn()
    const setConsoleCameraMode = vi.fn()

    setViewer({
      setCameraPreset,
      frameAll,
      frameExtents,
      framePrevious,
      frameSelected,
      frameSelectedGeometrySketch,
      frameReference,
      setConsoleCameraMode,
    } as any)

    setCameraPresetCommand('top')
    frameAllCommand()
    frameExtentsCommand()
    framePreviousCommand()
    frameSelectedCommand('part:object-1')
    expect(frameSelectedGeometrySketchCommand()).toBe(true)
    frameReferenceCommand('shoe:shoe-1')
    setConsoleCameraModeCommand('orbit')

    expect(setCameraPreset).toHaveBeenCalledWith('top')
    expect(frameAll).toHaveBeenCalledTimes(1)
    expect(frameExtents).toHaveBeenCalledTimes(1)
    expect(framePrevious).toHaveBeenCalledTimes(1)
    expect(frameSelected).toHaveBeenCalledWith('part:object-1')
    expect(frameSelectedGeometrySketch).toHaveBeenCalledTimes(1)
    expect(frameReference).toHaveBeenCalledWith('shoe:shoe-1')
    expect(setConsoleCameraMode).toHaveBeenCalledWith('orbit')
  })
})

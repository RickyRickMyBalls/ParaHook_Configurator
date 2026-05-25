import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUiPrefsStore } from './store/uiPrefsStore'
import { setViewer } from './viewerBridge'
import {
  frameAllCommand,
  frameEnvironmentLightCommand,
  frameExtentsCommand,
  framePreviousCommand,
  frameReferenceCommand,
  frameSelectedCommand,
  frameSelectedGeometrySketchCommand,
  frameSelectionSetCommand,
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
    const frameSelectionSet = vi.fn(() => true)
    const frameReference = vi.fn()
    const frameEnvironmentLight = vi.fn(() => true)
    const setConsoleCameraMode = vi.fn()

    setViewer('model-viewer-primary', {
      setCameraPreset,
      frameAll,
      frameExtents,
      framePrevious,
      frameSelected,
      frameSelectedGeometrySketch,
      frameSelectionSet,
      frameReference,
      frameEnvironmentLight,
      setConsoleCameraMode,
    } as any)

    setCameraPresetCommand('top')
    setCameraPresetCommand('back', undefined, {
      animate: true,
      durationMs: 320,
    })
    frameAllCommand('model-viewer-primary')
    frameExtentsCommand()
    framePreviousCommand()
    frameSelectedCommand('part:object-1', 'model-viewer-primary', {
      animate: true,
      durationMs: 320,
    })
    expect(frameSelectedGeometrySketchCommand()).toBe(true)
    expect(
      frameSelectionSetCommand(['part:object-1'], ['shoe:shoe-1'], 'model-viewer-primary', {
        animate: true,
        durationMs: 320,
      }),
    ).toBe(true)
    frameReferenceCommand('shoe:shoe-1', 'model-viewer-primary', {
      animate: true,
      durationMs: 320,
    })
    expect(
      frameEnvironmentLightCommand('light-key', 'model-viewer-primary', {
        animate: true,
        durationMs: 320,
      }),
    ).toBe(true)
    setConsoleCameraModeCommand('orbit')

    expect(setCameraPreset).toHaveBeenCalledWith('top')
    expect(setCameraPreset).toHaveBeenNthCalledWith(2, 'back', {
      animate: true,
      durationMs: 320,
    })
    expect(frameAll).toHaveBeenCalledTimes(1)
    expect(frameExtents).toHaveBeenCalledTimes(1)
    expect(framePrevious).toHaveBeenCalledTimes(1)
    expect(frameSelected).toHaveBeenCalledWith('part:object-1', {
      animate: true,
      durationMs: 320,
    })
    expect(frameSelectedGeometrySketch).toHaveBeenCalledTimes(1)
    expect(frameSelectionSet).toHaveBeenCalledWith(
      ['part:object-1'],
      ['shoe:shoe-1'],
      {
        animate: true,
        durationMs: 320,
      },
    )
    expect(frameReference).toHaveBeenCalledWith('shoe:shoe-1', {
      animate: true,
      durationMs: 320,
    })
    expect(frameEnvironmentLight).toHaveBeenCalledWith('light-key', {
      animate: true,
      durationMs: 320,
    })
    expect(setConsoleCameraMode).toHaveBeenCalledWith('orbit')
  })

  it('reports environment-light framing failure when there is no active viewer', () => {
    expect(frameEnvironmentLightCommand('missing-light', 'missing-viewport')).toBe(false)
  })
})

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { TitleStatusBar } from './components/TitleStatusBar'
import { ViewToolbar } from './components/ViewToolbar'
import { ViewerHost } from './components/ViewerHost'
import { ViewportOverlay } from './components/ViewportOverlay'
import { ConsoleDock } from './console/ConsoleDock'
import { BrowserPanel } from './panels/BrowserPanel'
import { RadioPanel } from './panels/RadioPanel'
import { SpaghettiPanel } from './panels/SpaghettiPanel'
import { AudioEngine, AudioEngineError } from '../runtime/audio/AudioEngine'
import {
  buildSoundCloudPlayerUrl,
  createFallbackRadioSourceDescriptor,
  DEFAULT_GUSANO_URL,
  resolveRadioSourceDescriptor,
} from '../runtime/audio/ClipLibrary'
import {
  resolveRepeatOffsetsSec,
  resolveSamplerStepFadeEnvelope,
  resolveSamplerStepPlaybackWindow,
  resolveStepDurationSec,
} from '../runtime/audio/TimelineTransport'
import { registerRadioRuntimeWarmupHandler } from '../runtime/audio/radioRuntimeWarmup'
import { createBrowserSoundCloudWidgetClient } from '../runtime/audio/SoundCloudWidgetClient'
import {
  defaultViewportPosition,
  defaultViewportSize,
  selectActiveEditorViewport,
  selectEditorViewportById,
  useSpaghettiStore,
} from './spaghetti/store/useSpaghettiStore'
import { useAudioSamplerStore, type RadioRuntimeSourceKind } from './store/audioSamplerStore'
import { useAppStore } from './store/useAppStore'
import {
  defaultSpaghettiWindowAppearance,
  mergeSpaghettiWindowAppearance,
  type SpaghettiWindowAppearance,
} from './panels/spaghettiWindowAppearance'
import {
  defaultWorkspaceSplitDirection,
  defaultWorkspaceSplitPriority,
  type WorkspaceSplitDirection,
  type WorkspaceSplitPriority,
} from './workspace/workspaceSplitTypes'

type FloatingPosition = {
  x: number
  y: number
}

type FloatingSize = {
  width: number
  height: number
}

type LeftDockPanelId = 'browser' | 'meatball-editor'

type DockTargetRect = {
  left: number
  right: number
  top: number
  bottom: number
}

type LeftDockResizeMenuState = {
  x: number
  y: number
}

type WorkspaceSplitMenuState = {
  x: number
  y: number
  scope: 'floating-titlebar' | 'divider'
}

const initialFloatingPosition: FloatingPosition = defaultViewportPosition
const initialFloatingSize: FloatingSize = defaultViewportSize

const minFloatingWidth = 200
const minFloatingHeight = 200
const minBrowserFloatingWidth = 280
const minBrowserFloatingHeight = 220
const floatingEdgePadding = 12
const minVisibleFloatingHandleHeight = 56
const splitDividerHeight = 10
const dockGhostHeight = 72
const normalizedFloatingHeightRatio = 0.9
const floatingDockLockGap = 25
const defaultBrowserFloatingPosition: FloatingPosition = { x: 16, y: 96 }
const defaultBrowserFloatingSize: FloatingSize = { width: 320, height: 560 }
const defaultLeftDockWidth = 320
const minLeftDockWidth = 260
const maxLeftDockWidth = 520

const createRadioAudioEngine = (
  radioAudioEngineRef: { current: AudioEngine | null },
  radioSoundCloudIframeRef: { current: HTMLIFrameElement | null },
): AudioEngine =>
  radioAudioEngineRef.current ??
  new AudioEngine({
    createSoundCloudWidgetClient: () =>
      createBrowserSoundCloudWidgetClient({
        getIframe: () => radioSoundCloudIframeRef.current,
      }),
  })

const resolveActiveRadioDescriptor = (
  sourceUrl: string,
  runtimeSourceKind: RadioRuntimeSourceKind,
) => {
  if (runtimeSourceKind === 'generated-tone') {
    return createFallbackRadioSourceDescriptor(sourceUrl, 'supported-url-runtime-fallback')
  }
  return resolveRadioSourceDescriptor(sourceUrl)
}

const resolveSamplerStepPlaybackInput = (input: {
  cueRatio: number
  stepDurationSec: number
  startScoochSec: number
  endScoochSec: number
  fadeInSec: number
  fadeOutSec: number
}) => {
  const playbackWindow = resolveSamplerStepPlaybackWindow(
    input.stepDurationSec,
    input.startScoochSec,
    input.endScoochSec,
  )
  const fadeEnvelope = resolveSamplerStepFadeEnvelope(
    playbackWindow.durationSec,
    input.fadeInSec,
    input.fadeOutSec,
  )
  return {
    normalizedSamplePosition: input.cueRatio,
    sampleBurstTime: playbackWindow.durationSec,
    startOffsetSec: playbackWindow.startOffsetSec,
    fadeInSec: fadeEnvelope.fadeInSec,
    fadeOutSec: fadeEnvelope.fadeOutSec,
  }
}

const playRadioBurstFromSource = async (input: {
  engine: AudioEngine
  sourceUrl: string
  runtimeSourceKind: RadioRuntimeSourceKind
  normalizedSamplePosition: number
  sampleBurstTime: number
  startOffsetSec?: number
  fadeInSec?: number
  fadeOutSec?: number
}): Promise<void> => {
  const sourceDescriptor = resolveActiveRadioDescriptor(input.sourceUrl, input.runtimeSourceKind)

  if (sourceDescriptor.kind === 'unsupported-url') {
    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: 'unsupported',
      message: `Radio url is not supported yet: ${sourceDescriptor.sourceUrl}`,
      sourceKind: sourceDescriptor.kind,
    })
    useAudioSamplerStore.getState().setRadioTransportState({
      currentTimeSec: 0,
      durationSec: 0,
      isSeekable: false,
      isPlaying: false,
    })
    return
  }

  useAudioSamplerStore.getState().setRadioRuntimeState({
    status: 'loading',
    message: 'Preparing radio source',
    sourceKind: sourceDescriptor.kind,
  })

  const playDescriptor = async (descriptor: typeof sourceDescriptor) =>
    input.engine.playBurst({
      descriptor,
      normalizedSamplePosition: input.normalizedSamplePosition,
      sampleBurstTime: input.sampleBurstTime,
      startOffsetSec: input.startOffsetSec,
      fadeInSec: input.fadeInSec,
      fadeOutSec: input.fadeOutSec,
    })

  try {
    await playDescriptor(sourceDescriptor)
    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: sourceDescriptor.isFallback ? 'fallback' : 'ready',
      message: sourceDescriptor.isFallback ? 'Radio using fallback generated tone' : null,
      sourceKind: sourceDescriptor.kind,
    })
    const transport = await input.engine.getTransportState(sourceDescriptor)
    useAudioSamplerStore.getState().setRadioTransportState(transport)
    return
  } catch (error) {
    if (error instanceof AudioEngineError && error.reason === 'blocked') {
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: 'blocked',
        message: error.message,
        sourceKind: sourceDescriptor.kind,
      })
      return
    }

    if (sourceDescriptor.kind === 'soundcloud-widget') {
      const fallbackDescriptor = createFallbackRadioSourceDescriptor(
        sourceDescriptor.sourceUrl,
        'supported-url-runtime-fallback',
      )
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: 'loading',
        message: 'SoundCloud playback unavailable, using fallback generated tone',
        sourceKind: fallbackDescriptor.kind,
      })

      try {
        await playDescriptor(fallbackDescriptor)
        useAudioSamplerStore.getState().setRadioRuntimeState({
          status: 'fallback',
          message: 'SoundCloud playback unavailable, using fallback generated tone',
          sourceKind: fallbackDescriptor.kind,
        })
        const transport = await input.engine.getTransportState(fallbackDescriptor)
        useAudioSamplerStore.getState().setRadioTransportState(transport)
        return
      } catch (fallbackError) {
        if (fallbackError instanceof AudioEngineError && fallbackError.reason === 'blocked') {
          useAudioSamplerStore.getState().setRadioRuntimeState({
            status: 'blocked',
            message: fallbackError.message,
            sourceKind: fallbackDescriptor.kind,
          })
          return
        }
        useAudioSamplerStore.getState().setRadioRuntimeState({
          status: 'error',
          message:
            fallbackError instanceof Error
              ? fallbackError.message
              : 'Radio playback failed',
          sourceKind: fallbackDescriptor.kind,
        })
        return
      }
    }

    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: 'error',
      message: error instanceof Error ? error.message : 'Radio playback failed',
      sourceKind: sourceDescriptor.kind,
    })
  }
}

function isPointInsideRect(clientX: number, clientY: number, rect: DockTargetRect | null): boolean {
  if (rect === null) {
    return false
  }
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  )
}

function SpaghettiWindowTitleBar(props: {
  editorViewportId: string
  onPrimaryViewModeCycle: () => void
  onActionTrayToggle: () => void
  onWindowSettingsToggle: () => void
  onHeaderToggle: () => void
  onCanvasToolbarToggle: () => void
  onMeatball: () => void
  onMaximizeToggle: () => void
  onSplitToggle: () => void
  onClose: () => void
  onDragStart?: (event: ReactPointerEvent<HTMLDivElement>) => void
  onShellClick?: (event: ReactMouseEvent<HTMLDivElement>) => void
  onContextMenu?: (event: ReactMouseEvent<HTMLDivElement>) => void
  isCollapsed: boolean
  isActionTrayExpanded: boolean
  isWindowSettingsOpen: boolean
  isHeaderCollapsed: boolean
  isCanvasToolbarVisible: boolean
  isMeatball?: boolean
  isMaximized: boolean
  isSplit: boolean
}) {
  const {
    editorViewportId,
    isCollapsed,
    isActionTrayExpanded,
    isWindowSettingsOpen,
    isHeaderCollapsed,
    isCanvasToolbarVisible,
    isMeatball = false,
    isMaximized,
    isSplit,
    onClose,
    onActionTrayToggle,
    onPrimaryViewModeCycle,
    onWindowSettingsToggle,
    onCanvasToolbarToggle,
    onDragStart,
    onHeaderToggle,
    onMaximizeToggle,
    onMeatball,
    onSplitToggle,
    onShellClick,
    onContextMenu,
  } = props
  const requestGraphDocumentBuild = useAppStore((state) => state.requestGraphDocumentBuild)
  const viewport = useSpaghettiStore((state) => selectEditorViewportById(state, editorViewportId))
  const graphDocumentId = viewport?.graphDocumentId ?? ''
  const isEssentials = !isCollapsed && isHeaderCollapsed && !isCanvasToolbarVisible
  const primaryModeButtonLabel = isCollapsed ? '+' : isEssentials ? 'e' : '-'
  const primaryModeButtonAriaLabel = isCollapsed
    ? 'Restore expanded editor'
    : isEssentials
      ? 'Collapse editor from essentials mode'
      : 'Switch editor to essentials mode'
  const primaryModeButtonTitle = isCollapsed
    ? 'Restore expanded editor'
    : isEssentials
      ? 'Collapse editor from essentials mode'
      : 'Switch editor to essentials mode'

  const stopPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleBuild = () => {
    if (graphDocumentId.length === 0) {
      return
    }
    requestGraphDocumentBuild(graphDocumentId)
  }

  return (
    <div
      className={`SpaghettiFloatingHandle ${isMeatball ? 'isMeatball' : ''}`}
      onPointerDown={onDragStart}
      onClick={onShellClick}
      onContextMenu={onContextMenu}
    >
      <div className="SpaghettiFloatingHandleStart">
        <button
          type="button"
          className={`SpaghettiWindowAction SpaghettiWindowAction--collapse ${
            isCollapsed || isEssentials ? 'isActive' : ''
          }`}
          onPointerDown={stopPointer}
          onClick={onPrimaryViewModeCycle}
          aria-label={primaryModeButtonAriaLabel}
          aria-expanded={!isCollapsed}
          title={primaryModeButtonTitle}
        >
          {primaryModeButtonLabel}
        </button>
        <span className="SpaghettiFloatingHandleTitle">
          {isMeatball ? 'Meatball Editor' : 'Spaghetti Editor'}
        </span>
      </div>
      <div className="SpaghettiFloatingHandleRow">
        <div className="SpaghettiFloatingHandleActions">
          <button
            type="button"
            className="SpaghettiWindowAction SpaghettiWindowAction--build"
            onPointerDown={stopPointer}
            onClick={handleBuild}
            disabled={graphDocumentId.length === 0}
            aria-label="Compile and build graph"
            title="Compile and build graph"
          >
            []
          </button>
          <div
            className={`SpaghettiFloatingHandleAdvancedActions ${
              isActionTrayExpanded ? 'isExpanded' : ''
            }`}
            aria-hidden={!isActionTrayExpanded}
          >
            <button
              type="button"
              className={`SpaghettiWindowAction ${isWindowSettingsOpen ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onWindowSettingsToggle}
              aria-label={isWindowSettingsOpen ? 'Close window settings' : 'Open window settings'}
              title={isWindowSettingsOpen ? 'Close window settings' : 'Open window settings'}
            >
              i
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction ${!isHeaderCollapsed ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onHeaderToggle}
              aria-label={isHeaderCollapsed ? 'Expand spaghetti toolbar' : 'Collapse spaghetti toolbar'}
              title={isHeaderCollapsed ? 'Expand spaghetti toolbar' : 'Collapse spaghetti toolbar'}
            >
              t
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction ${isCanvasToolbarVisible ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onCanvasToolbarToggle}
              aria-label={isCanvasToolbarVisible ? 'Hide canvas toolbar' : 'Show canvas toolbar'}
              title={isCanvasToolbarVisible ? 'Hide canvas toolbar' : 'Show canvas toolbar'}
            >
              c
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction SpaghettiWindowAction--meatball ${
                isMeatball ? 'isActive' : ''
              }`}
              onPointerDown={stopPointer}
              onClick={onMeatball}
              aria-label={isMeatball ? 'Return to spaghetti editor' : 'Move editor to meatball editor view'}
              title={isMeatball ? 'Return to spaghetti editor' : 'Move editor to meatball editor view'}
            >
              {isMeatball ? 'MB' : 'SP'}
            </button>
          </div>
          <button
            type="button"
            className={`SpaghettiWindowAction SpaghettiWindowActionTrayToggle ${
              isActionTrayExpanded ? 'isActive' : ''
            }`}
            onPointerDown={stopPointer}
            onClick={onActionTrayToggle}
            aria-label={isActionTrayExpanded ? 'Collapse titlebar actions' : 'Expand titlebar actions'}
            title={isActionTrayExpanded ? 'Collapse titlebar actions' : 'Expand titlebar actions'}
          >
            {isActionTrayExpanded ? '>' : '<'}
          </button>
          <div className="SpaghettiFloatingHandleCoreActions">
            <button
              type="button"
              className={`SpaghettiWindowAction ${isMaximized ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onMaximizeToggle}
              aria-label={isMaximized ? 'Restore editor to floating size' : 'Maximize editor'}
              title={isMaximized ? 'Restore editor to floating size' : 'Maximize editor'}
            >
              []
            </button>
            <button
              type="button"
              className={`SpaghettiWindowAction ${isSplit ? 'isActive' : ''}`}
              onPointerDown={stopPointer}
              onClick={onSplitToggle}
              aria-label={isSplit ? 'Exit split view' : 'Enter split view'}
              title={isSplit ? 'Exit split view' : 'Enter split view'}
            >
              ==
            </button>
            <button
              type="button"
              className="SpaghettiWindowAction"
              onPointerDown={stopPointer}
              onClick={onClose}
              aria-label="Close editor"
              title="Close editor"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppShell() {
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession ?? null)
  const latestRadioBurstRequest = useAudioSamplerStore((state) => state.latestBurstRequest)
  const isRadioEnabled = useAudioSamplerStore((state) => state.isRadioEnabled)
  const isRadioToolbarOpen = useAudioSamplerStore((state) => state.isRadioToolbarOpen)
  const radioSourceUrl = useAudioSamplerStore((state) => state.sourceUrl)
  const radioRuntimeStatus = useAudioSamplerStore((state) => state.radioRuntimeStatus)
  const radioRuntimeSourceKind = useAudioSamplerStore((state) => state.radioRuntimeSourceKind)
  const latestRadioSeekRequest = useAudioSamplerStore((state) => state.latestSeekRequest)
  const latestRadioReloadRequestId = useAudioSamplerStore((state) => state.latestReloadRequestId)
  const latestSamplerStepPreviewRequest = useAudioSamplerStore(
    (state) => state.latestSamplerStepPreviewRequest,
  )
  const samplerStepCount = useAudioSamplerStore((state) => state.samplerStepCount)
  const samplerBpm = useAudioSamplerStore((state) => state.samplerBpm)
  const samplerIsPlaying = useAudioSamplerStore((state) => state.samplerIsPlaying)
  const samplerSteps = useAudioSamplerStore((state) => state.samplerSteps)
  const samplerNoteRepeat = useAudioSamplerStore((state) => state.samplerNoteRepeat)
  const floatingShellActivationRequest = useAppStore((state) => state.floatingShellActivationRequest)
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const setActiveSurface = useAppStore((state) => state.setActiveSurface)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const setEditorViewportWindowMode = useSpaghettiStore((state) => state.setEditorViewportWindowMode)
  const setEditorViewportHeaderCollapsed = useSpaghettiStore(
    (state) => state.setEditorViewportHeaderCollapsed,
  )
  const setEditorViewportCanvasToolbarVisible = useSpaghettiStore(
    (state) => state.setEditorViewportCanvasToolbarVisible,
  )
  const setEditorViewportPresentationMode = useSpaghettiStore(
    (state) => state.setEditorViewportPresentationMode,
  )
  const setEditorViewportSplitRatio = useSpaghettiStore((state) => state.setEditorViewportSplitRatio)
  const setEditorViewportSplitDirection = useSpaghettiStore(
    (state) => state.setEditorViewportSplitDirection,
  )
  const setEditorViewportSplitPriority = useSpaghettiStore(
    (state) => state.setEditorViewportSplitPriority,
  )
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const setEditorViewportSize = useSpaghettiStore((state) => state.setEditorViewportSize)
  const showEditorSurface = activeEditorViewport !== null
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const radioAudioEngineRef = useRef<AudioEngine | null>(null)
  const radioSoundCloudIframeRef = useRef<HTMLIFrameElement | null>(null)
  const lastHandledRadioBurstRequestIdRef = useRef<number | null>(null)
  const lastHandledRadioSeekRequestIdRef = useRef<number | null>(null)
  const lastHandledRadioReloadRequestIdRef = useRef<number | null>(null)
  const lastHandledSamplerStepPreviewRequestIdRef = useRef<number | null>(null)
  const samplerLoopTimeoutRef = useRef<number | null>(null)
  const samplerRepeatTimeoutIdsRef = useRef<number[]>([])
  const viewportRef = useRef<HTMLElement | null>(null)
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const dockedMeatballHostRef = useRef<HTMLDivElement | null>(null)
  const browserFloatingWindowRef = useRef<HTMLDivElement | null>(null)
  const [isBrowserFloating, setIsBrowserFloating] = useState(false)
  const [isBrowserCollapsed, setIsBrowserCollapsed] = useState(false)
  const [activeLeftDockPreviewPanelId, setActiveLeftDockPreviewPanelId] = useState<LeftDockPanelId | null>(
    null,
  )
  const [isBottomSplitDockPreviewActive, setIsBottomSplitDockPreviewActive] = useState(false)
  const [browserFloatingPos, setBrowserFloatingPos] = useState<FloatingPosition>(
    defaultBrowserFloatingPosition,
  )
  const [browserFloatingSize, setBrowserFloatingSize] = useState<FloatingSize>(
    defaultBrowserFloatingSize,
  )
  const [leftDockWidth, setLeftDockWidth] = useState(defaultLeftDockWidth)
  const [isLeftDockViewportSplit, setIsLeftDockViewportSplit] = useState(false)
  const [leftDockResizeMenu, setLeftDockResizeMenu] = useState<LeftDockResizeMenuState | null>(null)
  const headerCollapsedByViewportId = useSpaghettiStore(
    (state) => state.editorViewportHeaderCollapsedById,
  ) ?? {}
  const [windowSettingsOpenByViewportId, setWindowSettingsOpenByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [actionTrayExpandedByViewportId, setActionTrayExpandedByViewportId] = useState<
    Record<string, boolean>
  >({})
  const [windowAppearanceByViewportId, setWindowAppearanceByViewportId] = useState<
    Record<string, SpaghettiWindowAppearance>
  >({})
  const [windowClampEditingByViewportId, setWindowClampEditingByViewportId] = useState<
    Record<string, boolean>
  >({})
  const canvasToolbarVisibleByViewportId = useSpaghettiStore(
    (state) => state.editorViewportCanvasToolbarVisibleById,
  ) ?? {}
  const [headerToggleRevisionByViewportId, setHeaderToggleRevisionByViewportId] = useState<
    Record<string, number>
  >({})
  const [, setActiveFloatingShell] = useState<'spaghetti' | 'browser' | null>(null)
  const [workspaceSplitMenu, setWorkspaceSplitMenu] = useState<WorkspaceSplitMenuState | null>(null)

  useEffect(() => {
    return () => {
      radioAudioEngineRef.current?.dispose()
      radioAudioEngineRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isRadioEnabled) {
      return
    }
    radioAudioEngineRef.current?.stopBurst()
    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: 'idle',
      message: null,
      sourceKind: 'none',
    })
    useAudioSamplerStore.getState().setRadioTransportState({
      currentTimeSec: 0,
      durationSec: 0,
      isSeekable: false,
      isPlaying: false,
    })
  }, [isRadioEnabled])

  useEffect(() => {
    const unregisterWarmupHandler = registerRadioRuntimeWarmupHandler((nextSourceUrl) => {
      const nextDescriptor = resolveRadioSourceDescriptor(nextSourceUrl)
      if (nextDescriptor.kind !== 'soundcloud-widget') {
        return
      }
      const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
      radioAudioEngineRef.current = engine
      void engine.ensureSourceReady(nextDescriptor).catch(() => {
        // Ignore eager warmup failures. The later burst path reports runtime status honestly.
      })
    })

    return unregisterWarmupHandler
  }, [])

  useEffect(() => {
    if (!isRadioEnabled) {
      return
    }
    const nextDescriptor = resolveRadioSourceDescriptor(radioSourceUrl)
    if (nextDescriptor.kind !== 'soundcloud-widget') {
      return
    }
    const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
    radioAudioEngineRef.current = engine
    void engine
      .ensureSourceReady(nextDescriptor)
      .then((ready) => {
        useAudioSamplerStore.getState().setRadioTransportState({
          durationSec: ready.durationSec,
          currentTimeSec: 0,
          isSeekable: true,
          isPlaying: false,
        })
      })
      .catch(() => {
        // Ignore background preload failures. The active burst path reports runtime status honestly.
      })
  }, [isRadioEnabled, radioSourceUrl])

  useEffect(() => {
    if (latestRadioBurstRequest === null) {
      return
    }
    if (latestRadioBurstRequest.requestId === lastHandledRadioBurstRequestIdRef.current) {
      return
    }

    lastHandledRadioBurstRequestIdRef.current = latestRadioBurstRequest.requestId
    useAudioSamplerStore.getState().markRadioBurstHandled(latestRadioBurstRequest.requestId)

    const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
    radioAudioEngineRef.current = engine

    let cancelled = false
    void playRadioBurstFromSource({
      engine,
      sourceUrl: latestRadioBurstRequest.sourceUrl,
      runtimeSourceKind: radioRuntimeSourceKind,
      normalizedSamplePosition: latestRadioBurstRequest.samplePosition,
      sampleBurstTime: latestRadioBurstRequest.sampleBurstTime,
    }).catch(() => {
      if (cancelled) {
        return
      }
      // The helper already reports runtime state honestly.
    })

    return () => {
      cancelled = true
    }
  }, [latestRadioBurstRequest, radioRuntimeSourceKind])

  useEffect(() => {
    if (latestRadioSeekRequest === null) {
      return
    }
    if (latestRadioSeekRequest.requestId === lastHandledRadioSeekRequestIdRef.current) {
      return
    }

    lastHandledRadioSeekRequestIdRef.current = latestRadioSeekRequest.requestId
    useAudioSamplerStore.getState().markRadioSeekHandled(latestRadioSeekRequest.requestId)

    const descriptor = resolveActiveRadioDescriptor(radioSourceUrl, radioRuntimeSourceKind)
    if (descriptor.kind !== 'soundcloud-widget') {
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: radioRuntimeStatus,
        message: 'Current radio source does not support seeking',
        sourceKind: descriptor.kind,
      })
      return
    }

    const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
    radioAudioEngineRef.current = engine

    void engine
      .seekTo({
        descriptor,
        timeSec: latestRadioSeekRequest.timeSec,
      })
      .then((transport) => {
        useAudioSamplerStore.getState().setRadioRuntimeState({
          status: 'ready',
          message: null,
          sourceKind: descriptor.kind,
        })
        useAudioSamplerStore.getState().setRadioTransportState(transport)
      })
      .catch((error) => {
        if (error instanceof AudioEngineError && error.reason === 'blocked') {
          useAudioSamplerStore.getState().setRadioRuntimeState({
            status: 'blocked',
            message: error.message,
            sourceKind: descriptor.kind,
          })
          return
        }
        useAudioSamplerStore.getState().setRadioRuntimeState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Radio seek failed',
          sourceKind: descriptor.kind,
        })
      })
  }, [latestRadioSeekRequest, radioRuntimeSourceKind, radioRuntimeStatus, radioSourceUrl])

  useEffect(() => {
    if (latestRadioReloadRequestId === null) {
      return
    }
    if (latestRadioReloadRequestId === lastHandledRadioReloadRequestIdRef.current) {
      return
    }

    lastHandledRadioReloadRequestIdRef.current = latestRadioReloadRequestId
    useAudioSamplerStore.getState().markRadioReloadHandled(latestRadioReloadRequestId)

    const descriptor = resolveActiveRadioDescriptor(radioSourceUrl, radioRuntimeSourceKind)
    if (descriptor.kind === 'unsupported-url') {
      useAudioSamplerStore.getState().setRadioRuntimeState({
        status: 'unsupported',
        message: `Radio url is not supported yet: ${descriptor.sourceUrl}`,
        sourceKind: descriptor.kind,
      })
      useAudioSamplerStore.getState().setRadioTransportState({
        currentTimeSec: 0,
        durationSec: 0,
        isSeekable: false,
        isPlaying: false,
      })
      return
    }

    const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
    radioAudioEngineRef.current = engine
    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: 'loading',
      message: 'Reloading radio source',
      sourceKind: descriptor.kind,
    })

    void engine
      .ensureSourceReady(descriptor)
      .then(() => engine.getTransportState(descriptor))
      .then((transport) => {
        useAudioSamplerStore.getState().setRadioRuntimeState({
          status: descriptor.isFallback ? 'fallback' : 'ready',
          message: descriptor.isFallback ? 'Radio using fallback generated tone' : null,
          sourceKind: descriptor.kind,
        })
        useAudioSamplerStore.getState().setRadioTransportState(transport)
      })
      .catch((error) => {
        if (error instanceof AudioEngineError && error.reason === 'blocked') {
          useAudioSamplerStore.getState().setRadioRuntimeState({
            status: 'blocked',
            message: error.message,
            sourceKind: descriptor.kind,
          })
          return
        }
        useAudioSamplerStore.getState().setRadioRuntimeState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Radio reload failed',
          sourceKind: descriptor.kind,
        })
      })
  }, [latestRadioReloadRequestId, radioRuntimeSourceKind, radioSourceUrl])

  useEffect(() => {
    if (latestSamplerStepPreviewRequest === null) {
      return
    }
    if (
      latestSamplerStepPreviewRequest.requestId ===
      lastHandledSamplerStepPreviewRequestIdRef.current
    ) {
      return
    }

    lastHandledSamplerStepPreviewRequestIdRef.current = latestSamplerStepPreviewRequest.requestId
    useAudioSamplerStore
      .getState()
      .markSamplerStepPreviewHandled(latestSamplerStepPreviewRequest.requestId)

    const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
    radioAudioEngineRef.current = engine

    const state = useAudioSamplerStore.getState()
    const previewStep = state.samplerSteps.find(
      (currentStep) => currentStep.id === latestSamplerStepPreviewRequest.stepId,
    )
    if (previewStep === undefined) {
      return
    }
    const stepDurationSec = resolveStepDurationSec(state.samplerBpm, state.samplerStepCount)
    const samplerPlaybackInput = resolveSamplerStepPlaybackInput({
      cueRatio: previewStep.cueRatio,
      stepDurationSec,
      startScoochSec: previewStep.startScoochSec,
      endScoochSec: previewStep.endScoochSec,
      fadeInSec: previewStep.fadeInSec,
      fadeOutSec: previewStep.fadeOutSec,
    })

    void playRadioBurstFromSource({
      engine,
      sourceUrl: state.sourceUrl,
      runtimeSourceKind: state.radioRuntimeSourceKind,
      ...samplerPlaybackInput,
    }).catch(() => {
      // The shared helper already reports runtime status honestly.
    })
  }, [latestSamplerStepPreviewRequest])

  useEffect(() => {
    if (!isRadioEnabled || !isRadioToolbarOpen) {
      return
    }

    const descriptor = resolveActiveRadioDescriptor(radioSourceUrl, radioRuntimeSourceKind)
    if (descriptor.kind === 'unsupported-url') {
      useAudioSamplerStore.getState().setRadioTransportState({
        currentTimeSec: 0,
        durationSec: 0,
        isSeekable: false,
        isPlaying: false,
      })
      return
    }

    const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
    radioAudioEngineRef.current = engine

    let cancelled = false
    const syncTransport = () => {
      void engine.getTransportState(descriptor).then((transport) => {
        if (cancelled) {
          return
        }
        useAudioSamplerStore.getState().setRadioTransportState(transport)
      }).catch(() => {
        // Keep the latest visible transport state if polling fails temporarily.
      })
    }

    syncTransport()
    const intervalId = window.setInterval(syncTransport, 250)
    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [isRadioEnabled, isRadioToolbarOpen, radioRuntimeSourceKind, radioSourceUrl])

  useEffect(() => {
    const clearSamplerTimers = () => {
      if (samplerLoopTimeoutRef.current !== null) {
        window.clearTimeout(samplerLoopTimeoutRef.current)
        samplerLoopTimeoutRef.current = null
      }
      samplerRepeatTimeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
      samplerRepeatTimeoutIdsRef.current = []
    }

    if (!samplerIsPlaying || !isRadioEnabled) {
      clearSamplerTimers()
      useAudioSamplerStore.getState().setSamplerPlayheadStepIndex(null)
      return
    }

    const engine = createRadioAudioEngine(radioAudioEngineRef, radioSoundCloudIframeRef)
    radioAudioEngineRef.current = engine

    let cancelled = false

    const runStep = (stepIndex: number) => {
      if (cancelled || !useAudioSamplerStore.getState().samplerIsPlaying) {
        return
      }

      const state = useAudioSamplerStore.getState()
      const activeStepCount = state.samplerStepCount
      const activeSteps = state.samplerSteps.slice(0, activeStepCount)
      if (activeSteps.length === 0) {
        state.stopSampler()
        return
      }

      const nextStepIndex = stepIndex % activeSteps.length
      const step = activeSteps[nextStepIndex] ?? activeSteps[0]
      if (step === undefined) {
        state.stopSampler()
        return
      }

      state.setSamplerPlayheadStepIndex(nextStepIndex)
      const stepDurationSec = resolveStepDurationSec(state.samplerBpm, state.samplerStepCount)

      if (step.enabled) {
        const repeatOffsetsSec = state.samplerNoteRepeat.enabled
          ? resolveRepeatOffsetsSec(
              stepDurationSec,
              state.samplerNoteRepeat.count,
              state.samplerNoteRepeat.rate,
            )
          : [0]

        repeatOffsetsSec.forEach((offsetSec) => {
          const trigger = () => {
            if (cancelled || !useAudioSamplerStore.getState().samplerIsPlaying) {
              return
            }
            void playRadioBurstFromSource({
              engine,
              sourceUrl: useAudioSamplerStore.getState().sourceUrl,
              runtimeSourceKind: useAudioSamplerStore.getState().radioRuntimeSourceKind,
              ...resolveSamplerStepPlaybackInput({
                cueRatio: step.cueRatio,
                stepDurationSec,
                startScoochSec: step.startScoochSec,
                endScoochSec: step.endScoochSec,
                fadeInSec: step.fadeInSec,
                fadeOutSec: step.fadeOutSec,
              }),
            }).catch(() => {
              // The shared helper already writes runtime status.
            })
          }

          if (offsetSec <= 0) {
            trigger()
            return
          }

          const timeoutId = window.setTimeout(trigger, Math.round(offsetSec * 1000))
          samplerRepeatTimeoutIdsRef.current.push(timeoutId)
        })
      }

      samplerLoopTimeoutRef.current = window.setTimeout(
        () => runStep((nextStepIndex + 1) % activeSteps.length),
        Math.round(stepDurationSec * 1000),
      )
    }

    clearSamplerTimers()
    runStep(0)

    return () => {
      cancelled = true
      clearSamplerTimers()
    }
  }, [
    isRadioEnabled,
    radioRuntimeSourceKind,
    samplerBpm,
    samplerIsPlaying,
    samplerNoteRepeat,
    samplerStepCount,
    samplerSteps,
  ])
  const lastHandledFloatingShellActivationSeqRef = useRef(0)
  const floatingPosRef = useRef<FloatingPosition>(initialFloatingPosition)
  const floatingSizeRef = useRef<FloatingSize>(initialFloatingSize)
  const browserFloatingPosRef = useRef<FloatingPosition>(defaultBrowserFloatingPosition)
  const browserFloatingSizeRef = useRef<FloatingSize>(defaultBrowserFloatingSize)
  const isBottomSplitDockPreviewActiveRef = useRef(false)
  const floatingDockLockRef = useRef<{
    editorViewportId: string
  } | null>(null)
  const dragRef = useRef<{
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null>(null)
  const resizeRef = useRef<{
    startPointerX: number
    startPointerY: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const browserDragRef = useRef<{
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const browserDockDragIntentRef = useRef<{
    startClientX: number
    startClientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    width: number
    height: number
  } | null>(null)
  const meatballDockDragIntentRef = useRef<{
    startClientX: number
    startClientY: number
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const splitResizeRef = useRef<{
    viewportTop: number
    viewportHeight: number
  } | null>(null)
  const leftDockResizeRef = useRef<{
    startPointerX: number
    startWidth: number
  } | null>(null)

  const activeWindowMode = activeEditorViewport?.windowMode ?? null
  const isHeaderCollapsed =
    activeEditorViewport === null
      ? false
      : (headerCollapsedByViewportId[activeEditorViewport.editorViewportId] ?? false)
  const headerToggleRevision =
    activeEditorViewport === null
      ? 0
      : (headerToggleRevisionByViewportId[activeEditorViewport.editorViewportId] ?? 0)
  const isCanvasToolbarVisible =
    activeEditorViewport === null
      ? true
      : (canvasToolbarVisibleByViewportId[activeEditorViewport.editorViewportId] ?? true)
  const showSplitLayout = showEditorSurface && activeWindowMode === 'split view'
  const showMeatballDock = showEditorSurface && activeWindowMode === 'meatball editor view'
  const showFloatingShell =
    showEditorSurface &&
    (activeWindowMode === 'expanded' ||
      activeWindowMode === 'maximized' ||
      activeWindowMode === 'collapsed')
  const canDragFloatingWindow =
    activeWindowMode === 'expanded' || activeWindowMode === 'collapsed'
  const canResizeFloatingWindow = activeWindowMode === 'expanded'
  const splitRatio = activeEditorViewport?.splitRatio ?? 0.5
  const splitDirection = activeEditorViewport?.splitDirection ?? defaultWorkspaceSplitDirection
  const splitPriority = activeEditorViewport?.splitPriority ?? defaultWorkspaceSplitPriority
  const splitDirectionClass =
    splitDirection === 'vertical' ? 'isVertical' : 'isHorizontal'
  const splitPriorityClass =
    splitPriority === 'favorFirst'
      ? 'isFavorFirst'
      : splitPriority === 'favorSecond'
        ? 'isFavorSecond'
        : 'isBalanced'
  const isBrowserDockPreviewActive = activeLeftDockPreviewPanelId === 'browser'
  const isMeatballDockPreviewActive = activeLeftDockPreviewPanelId === 'meatball-editor'
  const isWindowSettingsOpen =
    activeEditorViewport === null
      ? false
      : (windowSettingsOpenByViewportId[activeEditorViewport.editorViewportId] ?? false)
  const savedActionTrayExpanded =
    activeEditorViewport === null
      ? false
      : (actionTrayExpandedByViewportId[activeEditorViewport.editorViewportId] ?? false)
  const isActionTrayExpanded = activeWindowMode === 'maximized' ? true : savedActionTrayExpanded
  const activeWindowAppearance =
    activeEditorViewport === null
      ? defaultSpaghettiWindowAppearance
      : (windowAppearanceByViewportId[activeEditorViewport.editorViewportId] ??
        defaultSpaghettiWindowAppearance)
  const isWindowClampEditing =
    activeEditorViewport === null
      ? false
      : (windowClampEditingByViewportId[activeEditorViewport.editorViewportId] ?? false)

  const getViewportLimits = useCallback(() => {
    const viewportElement = viewportRef.current
    if (viewportElement === null) {
      return {
        maxWidth: minFloatingWidth,
        maxHeight: minFloatingHeight,
      }
    }
    return {
      maxWidth: Math.max(minFloatingWidth, viewportElement.clientWidth - 24),
      maxHeight: Math.max(minFloatingHeight, viewportElement.clientHeight - 24),
    }
  }, [])

  const getBrowserFloatingLimits = useCallback(() => {
    const shellElement = appShellRef.current
    if (shellElement === null) {
      return {
        maxWidth: minBrowserFloatingWidth,
        maxHeight: minBrowserFloatingHeight,
      }
    }
    return {
      maxWidth: Math.max(minBrowserFloatingWidth, shellElement.clientWidth - 24),
      maxHeight: Math.max(minBrowserFloatingHeight, shellElement.clientHeight - 24),
    }
  }, [])

  const clampLeftDockWidth = useCallback((nextWidth: number) => {
    const shellWidth = appShellRef.current?.clientWidth ?? 1440
    const cappedMaxWidth = Math.min(maxLeftDockWidth, Math.max(minLeftDockWidth, shellWidth - 240))
    return Math.min(cappedMaxWidth, Math.max(minLeftDockWidth, Math.round(nextWidth)))
  }, [])

  const getWindowAppearanceStyle = useCallback((appearance: SpaghettiWindowAppearance) => {
    const titlebarTintById: Record<
      SpaghettiWindowAppearance['titlebarTint'],
      { start: [number, number, number]; end: [number, number, number] }
    > = {
      default: {
        start: [24, 28, 36],
        end: [6, 8, 12],
      },
      slate: {
        start: [32, 36, 44],
        end: [10, 12, 16],
      },
      blue: {
        start: [20, 34, 62],
        end: [6, 10, 18],
      },
      green: {
        start: [20, 44, 38],
        end: [6, 14, 12],
      },
      red: {
        start: [64, 24, 28],
        end: [16, 6, 8],
      },
    }
    const bodyTintById: Record<
      SpaghettiWindowAppearance['bodyTint'],
      {
        backgroundRgb: [number, number, number]
        backgroundAlpha: number
        borderRgb: [number, number, number]
        borderAlpha: number
      }
    > = {
      default: {
        backgroundRgb: [20, 20, 24],
        backgroundAlpha: 0.9,
        borderRgb: [255, 255, 255],
        borderAlpha: 0.14,
      },
      'cool-dark': {
        backgroundRgb: [16, 22, 30],
        backgroundAlpha: 0.9,
        borderRgb: [120, 166, 255],
        borderAlpha: 0.16,
      },
      'neutral-dark': {
        backgroundRgb: [24, 24, 24],
        backgroundAlpha: 0.92,
        borderRgb: [255, 255, 255],
        borderAlpha: 0.12,
      },
      'glass-dark': {
        backgroundRgb: [14, 18, 28],
        backgroundAlpha: 0.76,
        borderRgb: [180, 198, 255],
        borderAlpha: 0.18,
      },
    }
    const fontSizeById: Record<SpaghettiWindowAppearance['fontScale'], string> = {
      sm: '11px',
      md: '12px',
      lg: '13px',
    }
    const fontFamilyById: Record<SpaghettiWindowAppearance['fontFamily'], string> = {
      default: '"Segoe UI", sans-serif',
      mono: '"Consolas", "Courier New", monospace',
      serif: '"Georgia", "Times New Roman", serif',
    }
    const paddingScaleById: Record<
      SpaghettiWindowAppearance['paddingScale'],
      { x: string; y: string; gap: string }
    > = {
      tight: { x: '6px', y: '6px', gap: '6px' },
      normal: { x: '8px', y: '8px', gap: '8px' },
      loose: { x: '10px', y: '10px', gap: '10px' },
    }
    const bodyTint = bodyTintById[appearance.bodyTint]
    const titlebarTint = titlebarTintById[appearance.titlebarTint]
    const paddingScale = paddingScaleById[appearance.paddingScale]
    const shellInsetX = `${Math.round(appearance.bodyInsetX * 12)}px`
    const shellInsetY = `${Math.round(appearance.bodyInsetY * 12)}px`
    const titlebarAlpha = Math.max(0.2, Math.min(1, appearance.titlebarOpacity * 0.96))
    const bodyAlpha = Math.max(0.2, Math.min(1, bodyTint.backgroundAlpha * appearance.windowOpacity))
    const borderAlpha = Math.max(0.08, Math.min(0.6, bodyTint.borderAlpha * appearance.windowOpacity))
    return {
      '--sp-window-opacity': `${appearance.windowOpacity}`,
      '--sp-graph-content-opacity': `${appearance.graphContentOpacity}`,
      '--sp-window-body-rgb': `${bodyTint.backgroundRgb.join(', ')}`,
      '--sp-window-body-alpha': `${bodyAlpha}`,
      '--sp-window-titlebar-bg': `linear-gradient(180deg, rgba(${titlebarTint.start.join(
        ', ',
      )}, ${titlebarAlpha}) 0%, rgba(${titlebarTint.end.join(', ')}, ${titlebarAlpha}) 100%)`,
      '--sp-window-body-bg': `rgba(${bodyTint.backgroundRgb.join(', ')}, ${bodyAlpha})`,
      '--sp-window-body-border': `rgba(${bodyTint.borderRgb.join(', ')}, ${borderAlpha})`,
      '--sp-window-font-size': fontSizeById[appearance.fontScale],
      '--sp-window-font-family': fontFamilyById[appearance.fontFamily],
      '--sp-window-pad-x': paddingScale.x,
      '--sp-window-pad-y': paddingScale.y,
      '--sp-window-gap': paddingScale.gap,
      '--sp-window-shell-pad-x': shellInsetX,
      '--sp-window-shell-pad-y': shellInsetY,
    } as CSSProperties
  }, [])

  const clampFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getViewportLimits()
      return {
        width: Math.min(limits.maxWidth, Math.max(minFloatingWidth, Math.round(size.width))),
        height: Math.min(limits.maxHeight, Math.max(minFloatingHeight, Math.round(size.height))),
      }
    },
    [getViewportLimits],
  )

  const normalizeFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getViewportLimits()
      const clamped = clampFloatingSize(size)
      const isDefaultSize =
        size.width === defaultViewportSize.width && size.height === defaultViewportSize.height

      if (!isDefaultSize) {
        return clamped
      }

      return {
        width: clamped.width,
        height: Math.min(
          limits.maxHeight,
          Math.max(minFloatingHeight, Math.round(limits.maxHeight * normalizedFloatingHeightRatio)),
        ),
      }
    },
    [clampFloatingSize, getViewportLimits],
  )

  const clampFloatingPos = useCallback((pos: FloatingPosition): FloatingPosition => {
    const viewportElement = viewportRef.current
    if (viewportElement === null) {
      return {
        x: Math.max(0, Math.round(pos.x)),
        y: Math.max(0, Math.round(pos.y)),
      }
    }
    const maxX = Math.max(0, viewportElement.clientWidth - floatingSizeRef.current.width - floatingEdgePadding)
    const maxY = Math.max(
      0,
      viewportElement.clientHeight - minVisibleFloatingHandleHeight,
    )
    return {
      x: Math.min(maxX, Math.max(0, Math.round(pos.x))),
      y: Math.min(maxY, Math.max(0, Math.round(pos.y))),
    }
  }, [])

  const resolveDockLockedFloatingPos = useCallback(
    (nextLeftDockWidth: number): FloatingPosition | null => {
      if (
        activeEditorViewport === null ||
        (activeEditorViewport.windowMode !== 'expanded' &&
          activeEditorViewport.windowMode !== 'collapsed')
      ) {
        return null
      }
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined) {
        return null
      }
      const lockBoundaryX = Math.max(
        0,
        Math.round(nextLeftDockWidth - viewportRect.left + floatingDockLockGap),
      )
      const isLockedToDock =
        floatingDockLockRef.current?.editorViewportId === activeEditorViewport.editorViewportId
      if (!isLockedToDock && floatingPosRef.current.x >= lockBoundaryX) {
        return null
      }
      return clampFloatingPos({
        x: lockBoundaryX,
        y: floatingPosRef.current.y,
      })
    },
    [activeEditorViewport, clampFloatingPos],
  )

  const clampBrowserFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getBrowserFloatingLimits()
      return {
        width: Math.min(limits.maxWidth, Math.max(minBrowserFloatingWidth, Math.round(size.width))),
        height: Math.min(
          limits.maxHeight,
          Math.max(minBrowserFloatingHeight, Math.round(size.height)),
        ),
      }
    },
    [getBrowserFloatingLimits],
  )

  const clampBrowserFloatingPos = useCallback((pos: FloatingPosition): FloatingPosition => {
    const shellElement = appShellRef.current
    if (shellElement === null) {
      return {
        x: Math.max(0, Math.round(pos.x)),
        y: Math.max(0, Math.round(pos.y)),
      }
    }
    const maxX = Math.max(
      0,
      shellElement.clientWidth - browserFloatingSizeRef.current.width - floatingEdgePadding,
    )
    const maxY = Math.max(
      0,
      shellElement.clientHeight - browserFloatingSizeRef.current.height - floatingEdgePadding,
    )
    return {
      x: Math.min(maxX, Math.max(0, Math.round(pos.x))),
      y: Math.min(maxY, Math.max(0, Math.round(pos.y))),
    }
  }, [])

  const openBrowserFloatingFromDock = useCallback(() => {
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const dockedRect = dockedBrowserHostRef.current?.getBoundingClientRect()
    if (shellRect !== undefined && dockedRect !== undefined) {
      const nextSize = clampBrowserFloatingSize({
        width: dockedRect.width,
        height: Math.min(dockedRect.height, defaultBrowserFloatingSize.height),
      })
      browserFloatingSizeRef.current = nextSize
      setBrowserFloatingSize(nextSize)
      const nextPos = clampBrowserFloatingPos({
        x: dockedRect.left - shellRect.left,
        y: dockedRect.top - shellRect.top,
      })
      browserFloatingPosRef.current = nextPos
      setBrowserFloatingPos(nextPos)
    }
    setIsBrowserFloating(true)
  }, [clampBrowserFloatingPos, clampBrowserFloatingSize])

  const getLeftDockTargetRect = useCallback((panelId: LeftDockPanelId): DockTargetRect | null => {
    const targetElement =
      panelId === 'browser' ? dockedBrowserHostRef.current : dockedMeatballHostRef.current
    if (targetElement === null) {
      return null
    }
    const targetRect = targetElement.getBoundingClientRect()
    const parentRect = targetElement.parentElement?.getBoundingClientRect()
    const left = targetRect.width > 1 ? targetRect.left : (parentRect?.left ?? targetRect.left)
    const right = targetRect.width > 1 ? targetRect.right : (parentRect?.right ?? targetRect.right)
    const top = targetRect.top
    const height = Math.max(targetRect.height, dockGhostHeight)
    return {
      left,
      right,
      top,
      bottom: top + height,
    }
  }, [])

  const resolveLeftDockPreviewPanelId = useCallback(
    (panelId: LeftDockPanelId, clientX: number, clientY: number): LeftDockPanelId | null =>
      isPointInsideRect(clientX, clientY, getLeftDockTargetRect(panelId)) ? panelId : null,
    [getLeftDockTargetRect],
  )

  const shouldPreviewBottomSplitDock = useCallback(
    (candidateY: number, titleBarHeight: number) => {
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return false
      }
      const bottomEdge = candidateY + titleBarHeight
      return bottomEdge >= viewportElement.clientHeight - 20
    },
    [],
  )

  useEffect(() => {
    floatingPosRef.current = activeEditorViewport?.position ?? initialFloatingPosition
  }, [activeEditorViewport?.position])

  useEffect(() => {
    floatingSizeRef.current = activeEditorViewport?.size ?? initialFloatingSize
  }, [activeEditorViewport?.size])

  useEffect(() => {
    browserFloatingPosRef.current = browserFloatingPos
  }, [browserFloatingPos])

  useEffect(() => {
    browserFloatingSizeRef.current = browserFloatingSize
  }, [browserFloatingSize])

  useEffect(() => {
    if (!isBrowserFloating || typeof ResizeObserver === 'undefined') {
      return
    }
    const element = browserFloatingWindowRef.current
    if (element === null) {
      return
    }

    const syncBrowserFloatingHeight = () => {
      const nextHeight = Math.round(element.getBoundingClientRect().height)
      if (nextHeight <= 0) {
        return
      }
      browserFloatingSizeRef.current = {
        ...browserFloatingSizeRef.current,
        height: nextHeight,
      }
    }

    syncBrowserFloatingHeight()
    const observer = new ResizeObserver(() => {
      syncBrowserFloatingHeight()
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isBrowserFloating])

  useEffect(() => {
    isBottomSplitDockPreviewActiveRef.current = isBottomSplitDockPreviewActive
  }, [isBottomSplitDockPreviewActive])

  useEffect(() => {
    if (leftDockResizeMenu === null) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('.LeftDockResizeMenu') !== null) {
        return
      }
      setLeftDockResizeMenu(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      if (event.key === 'Escape') {
        setLeftDockResizeMenu(null)
      }
    }

    const handleWindowChange = () => {
      setLeftDockResizeMenu(null)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('blur', handleWindowChange)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('blur', handleWindowChange)
    }
  }, [leftDockResizeMenu])

  useEffect(() => {
    if (workspaceSplitMenu === null) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('.WorkspaceSplitMenu') !== null) {
        return
      }
      setWorkspaceSplitMenu(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      if (event.key === 'Escape') {
        setWorkspaceSplitMenu(null)
      }
    }

    const handleWindowChange = () => {
      setWorkspaceSplitMenu(null)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('blur', handleWindowChange)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('blur', handleWindowChange)
    }
  }, [workspaceSplitMenu])

  useEffect(() => {
    if (
      activeLeftDockPreviewPanelId === 'browser' &&
      !isBrowserFloating &&
      browserDragRef.current === null
    ) {
      setActiveLeftDockPreviewPanelId(null)
    }
  }, [activeLeftDockPreviewPanelId, isBrowserFloating])

  useEffect(() => {
    if (
      activeLeftDockPreviewPanelId === 'meatball-editor' &&
      activeWindowMode === 'meatball editor view' &&
      dragRef.current === null &&
      meatballDockDragIntentRef.current === null
    ) {
      setActiveLeftDockPreviewPanelId(null)
    }
  }, [activeLeftDockPreviewPanelId, activeWindowMode])

  useEffect(() => {
    if (!showFloatingShell && isBottomSplitDockPreviewActive) {
      setIsBottomSplitDockPreviewActive(false)
    }
  }, [isBottomSplitDockPreviewActive, showFloatingShell])

  useEffect(() => {
    if (!showFloatingShell && workspaceActiveSurface === 'spaghetti') {
      setActiveFloatingShell(null)
      setActiveSurface(null)
      requestConsoleContextSync('surface-clear')
    }
  }, [requestConsoleContextSync, setActiveSurface, showFloatingShell, workspaceActiveSurface])

  useEffect(() => {
    if (!isBrowserFloating && workspaceActiveSurface === 'browser') {
      setActiveFloatingShell(null)
      setActiveSurface(null)
      requestConsoleContextSync('surface-clear')
    }
  }, [isBrowserFloating, requestConsoleContextSync, setActiveSurface, workspaceActiveSurface])

  useEffect(() => {
    if (
      floatingShellActivationRequest === null ||
      floatingShellActivationRequest.seq === lastHandledFloatingShellActivationSeqRef.current
    ) {
      return
    }
    lastHandledFloatingShellActivationSeqRef.current = floatingShellActivationRequest.seq
    if (floatingShellActivationRequest.target === 'spaghetti') {
      if (showFloatingShell) {
        setActiveFloatingShell('spaghetti')
        setActiveSurface('spaghetti')
      }
      return
    }
    if (isBrowserFloating) {
      setActiveFloatingShell('browser')
      setActiveSurface('browser')
    }
  }, [floatingShellActivationRequest, isBrowserFloating, setActiveSurface, showFloatingShell])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        (target.closest('.SpaghettiFloatingWindow') !== null ||
          target.closest('.BrowserFloatingWindow') !== null ||
          target.closest('.ViewportViewerSurface') !== null)
      ) {
        return
      }
      if (workspaceActiveSurface === 'spaghetti' || workspaceActiveSurface === 'browser') {
        setActiveFloatingShell(null)
        setActiveSurface(null)
        requestConsoleContextSync('surface-clear')
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [requestConsoleContextSync, setActiveSurface, workspaceActiveSurface])

  useEffect(() => {
    if (
      !showFloatingShell ||
      activeEditorViewport === null ||
      (activeWindowMode !== 'expanded' && activeWindowMode !== 'collapsed')
    ) {
      return
    }
    const clampedSize = normalizeFloatingSize(activeEditorViewport.size)
    if (
      clampedSize.width !== activeEditorViewport.size.width ||
      clampedSize.height !== activeEditorViewport.size.height
    ) {
      setEditorViewportSize(activeEditorViewport.editorViewportId, clampedSize)
    }
    const clampedPos = clampFloatingPos(activeEditorViewport.position)
    if (
      clampedPos.x !== activeEditorViewport.position.x ||
      clampedPos.y !== activeEditorViewport.position.y
    ) {
      setEditorViewportPosition(activeEditorViewport.editorViewportId, clampedPos)
    }
  }, [
    activeEditorViewport,
    clampFloatingPos,
    normalizeFloatingSize,
    setEditorViewportPosition,
    setEditorViewportSize,
    activeWindowMode,
    showFloatingShell,
  ])

  useEffect(() => {
    const handleResize = () => {
      if (
        activeEditorViewport === null ||
        (activeWindowMode !== 'expanded' && activeWindowMode !== 'collapsed')
      ) {
        return
      }
      const nextSize = normalizeFloatingSize(activeEditorViewport.size)
      if (
        nextSize.width !== activeEditorViewport.size.width ||
        nextSize.height !== activeEditorViewport.size.height
      ) {
        setEditorViewportSize(activeEditorViewport.editorViewportId, nextSize)
      }
      const nextPos = clampFloatingPos(activeEditorViewport.position)
      if (
        nextPos.x !== activeEditorViewport.position.x ||
        nextPos.y !== activeEditorViewport.position.y
      ) {
        setEditorViewportPosition(activeEditorViewport.editorViewportId, nextPos)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [
    activeEditorViewport,
    activeWindowMode,
    clampFloatingPos,
    normalizeFloatingSize,
    setEditorViewportPosition,
    setEditorViewportSize,
  ])

  useEffect(() => {
    const handleResize = () => {
      if (!isBrowserFloating) {
        return
      }
      const nextSize = clampBrowserFloatingSize(browserFloatingSizeRef.current)
      if (
        nextSize.width !== browserFloatingSizeRef.current.width ||
        nextSize.height !== browserFloatingSizeRef.current.height
      ) {
        browserFloatingSizeRef.current = nextSize
        setBrowserFloatingSize(nextSize)
      }
      const nextPos = clampBrowserFloatingPos(browserFloatingPosRef.current)
      if (
        nextPos.x !== browserFloatingPosRef.current.x ||
        nextPos.y !== browserFloatingPosRef.current.y
      ) {
        browserFloatingPosRef.current = nextPos
        setBrowserFloatingPos(nextPos)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [clampBrowserFloatingPos, clampBrowserFloatingSize, isBrowserFloating])

  const beginFloatingSpaghettiDrag = useCallback(
    (
      editorViewportId: string,
      pointerOffsetX: number,
      pointerOffsetY: number,
      titleBarHeight: number,
    ) => {
      setActiveLeftDockPreviewPanelId(null)
      setIsBottomSplitDockPreviewActive(false)
      setActiveEditorViewportId(editorViewportId)
      dragRef.current = {
        pointerOffsetX,
        pointerOffsetY,
        titleBarHeight,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const viewport = viewportRef.current
        const dragState = dragRef.current
        if (viewport === null || dragState === null) {
          return
        }
        const rect = viewport.getBoundingClientRect()
        const candidate = {
          x: moveEvent.clientX - rect.left - dragState.pointerOffsetX,
          y: moveEvent.clientY - rect.top - dragState.pointerOffsetY,
        }
        const clamped = clampFloatingPos(candidate)
        floatingPosRef.current = clamped
        setEditorViewportPosition(editorViewportId, clamped)
        setActiveLeftDockPreviewPanelId(
          resolveLeftDockPreviewPanelId('meatball-editor', moveEvent.clientX, moveEvent.clientY),
        )
        const shouldPreviewBottomDock = shouldPreviewBottomSplitDock(clamped.y, dragState.titleBarHeight)
        isBottomSplitDockPreviewActiveRef.current = shouldPreviewBottomDock
        setIsBottomSplitDockPreviewActive(shouldPreviewBottomDock)
      }

      const handleUp = (upEvent: PointerEvent) => {
        const dragState = dragRef.current
        const shouldDockToSplit =
          isBottomSplitDockPreviewActiveRef.current ||
          (dragState !== null &&
            shouldPreviewBottomSplitDock(floatingPosRef.current.y, dragState.titleBarHeight))
        const shouldDockToMeatball =
          resolveLeftDockPreviewPanelId('meatball-editor', upEvent.clientX, upEvent.clientY) ===
          'meatball-editor'
        dragRef.current = null
        setActiveLeftDockPreviewPanelId(null)
        setIsBottomSplitDockPreviewActive(false)
        if (shouldDockToSplit) {
          setEditorViewportWindowMode(editorViewportId, 'split view')
        } else if (shouldDockToMeatball) {
          setEditorViewportHeaderCollapsed(editorViewportId, true)
          setEditorViewportWindowMode(editorViewportId, 'meatball editor view')
        }
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [
      clampFloatingPos,
      resolveLeftDockPreviewPanelId,
      shouldPreviewBottomSplitDock,
      setActiveLeftDockPreviewPanelId,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      setEditorViewportWindowMode,
      setEditorViewportHeaderCollapsed,
    ],
  )

  const handleSpaghettiDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || !canDragFloatingWindow) {
        return
      }
      const viewportElement = viewportRef.current
      const titleBarElement = event.currentTarget
      if (viewportElement === null) {
        return
      }

      const viewportRect = viewportElement.getBoundingClientRect()
      const titleBarRect = titleBarElement.getBoundingClientRect()
      const pointerOffsetX = event.clientX - viewportRect.left - floatingPosRef.current.x
      const pointerOffsetY = event.clientY - viewportRect.top - floatingPosRef.current.y
      beginFloatingSpaghettiDrag(
        activeEditorViewport.editorViewportId,
        pointerOffsetX,
        pointerOffsetY,
        Math.max(1, Math.round(titleBarRect.height)),
      )
      event.preventDefault()
    },
    [
      activeEditorViewport,
      beginFloatingSpaghettiDrag,
      canDragFloatingWindow,
    ],
  )

  const handleSpaghettiResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || !canResizeFloatingWindow) {
        return
      }
      setActiveEditorViewportId(activeEditorViewport.editorViewportId)
      resizeRef.current = {
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startWidth: floatingSizeRef.current.width,
        startHeight: floatingSizeRef.current.height,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const state = resizeRef.current
        if (state === null) {
          return
        }
        const nextSize = clampFloatingSize({
          width: state.startWidth + (moveEvent.clientX - state.startPointerX),
          height: state.startHeight + (moveEvent.clientY - state.startPointerY),
        })
        floatingSizeRef.current = nextSize
        setEditorViewportSize(activeEditorViewport.editorViewportId, nextSize)
        const clamped = clampFloatingPos(floatingPosRef.current)
        floatingPosRef.current = clamped
        setEditorViewportPosition(activeEditorViewport.editorViewportId, clamped)
      }

      const handleUp = () => {
        resizeRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
      event.stopPropagation()
    },
    [
      activeEditorViewport,
      canResizeFloatingWindow,
      clampFloatingPos,
      clampFloatingSize,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      setEditorViewportSize,
    ],
  )

  const handleBrowserDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !isBrowserFloating) {
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      const shellRect = appShellRef.current?.getBoundingClientRect()
      if (shellRect === undefined) {
        return
      }
      browserDragRef.current = {
        pointerOffsetX: event.clientX - shellRect.left - browserFloatingPosRef.current.x,
        pointerOffsetY: event.clientY - shellRect.top - browserFloatingPosRef.current.y,
      }
      event.preventDefault()
    },
    [isBrowserFloating],
  )

  const handleBrowserDockDragStart = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isBrowserFloating) {
      return
    }
    setActiveLeftDockPreviewPanelId(null)
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const panelElement = event.currentTarget.parentElement
    const panelRect = panelElement?.getBoundingClientRect()
    if (shellRect === undefined || panelRect === undefined) {
      return
    }
    browserDockDragIntentRef.current = {
      startClientX: event.clientX,
      startClientY: event.clientY,
      pointerOffsetX: event.clientX - panelRect.left,
      pointerOffsetY: event.clientY - panelRect.top,
      width: panelRect.width,
      height: panelRect.height,
    }
    event.preventDefault()
  }, [isBrowserFloating])

  const handleLeftDockResizeStart = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }
    setLeftDockResizeMenu(null)
    leftDockResizeRef.current = {
      startPointerX: event.clientX,
      startWidth: leftDockWidth,
    }
    event.preventDefault()
    event.stopPropagation()
  }, [leftDockWidth])

  const handleLeftDockResizeContextMenu = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setLeftDockResizeMenu({
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  const handleResetLeftDockWidth = useCallback(() => {
    setLeftDockWidth(defaultLeftDockWidth)
    setLeftDockResizeMenu(null)
  }, [])

  const handleToggleLeftDockViewportSplit = useCallback(() => {
    setIsLeftDockViewportSplit((current) => !current)
    setLeftDockResizeMenu(null)
  }, [])

  const handleWindowSettingsToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setWindowSettingsOpenByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleActionTrayToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setActionTrayExpandedByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleWindowClampEditingToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    setWindowClampEditingByViewportId((current) => ({
      ...current,
      [editorViewportId]: !(current[editorViewportId] ?? false),
    }))
  }, [activeEditorViewport])

  const handleWindowAppearanceChange = useCallback(
    (editorViewportId: string, patch: Partial<SpaghettiWindowAppearance>) => {
      setWindowAppearanceByViewportId((current) => ({
        ...current,
        [editorViewportId]: mergeSpaghettiWindowAppearance(
          current[editorViewportId] ?? defaultSpaghettiWindowAppearance,
          patch,
        ),
      }))
    },
    [],
  )

  const handleResetWindowAppearance = useCallback((editorViewportId: string) => {
    setWindowAppearanceByViewportId((current) => ({
      ...current,
      [editorViewportId]: defaultSpaghettiWindowAppearance,
    }))
  }, [])

  const handleLeftDockSplitTogglePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
    },
    [],
  )

  const handleLeftDockSplitToggleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handleToggleLeftDockViewportSplit()
    },
    [handleToggleLeftDockViewportSplit],
  )

  const handleMeatballDockDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        event.button !== 0 ||
        activeEditorViewport === null ||
        activeEditorViewport.windowMode !== 'meatball editor view'
      ) {
        return
      }
      const panelRect = dockedMeatballHostRef.current?.getBoundingClientRect()
      if (panelRect === undefined) {
        return
      }
      const editorViewportId = activeEditorViewport.editorViewportId
      const startSize = activeEditorViewport.size
      let hasUndocked = false
      meatballDockDragIntentRef.current = {
        startClientX: event.clientX,
        startClientY: event.clientY,
        pointerOffsetX: event.clientX - panelRect.left,
        pointerOffsetY: event.clientY - panelRect.top,
      }
      setActiveLeftDockPreviewPanelId(null)

      const handleMove = (moveEvent: PointerEvent) => {
        const viewportElement = viewportRef.current
        const intent = meatballDockDragIntentRef.current
        if (viewportElement === null || intent === null) {
          return
        }
        const deltaX = moveEvent.clientX - intent.startClientX
        const deltaY = moveEvent.clientY - intent.startClientY
        if (Math.hypot(deltaX, deltaY) < 8) {
          return
        }
        const viewportRect = viewportElement.getBoundingClientRect()
        const nextPos = clampFloatingPos({
          x: moveEvent.clientX - viewportRect.left - intent.pointerOffsetX,
          y: moveEvent.clientY - viewportRect.top - intent.pointerOffsetY,
        })
        if (!hasUndocked) {
          const nextSize = normalizeFloatingSize(startSize)
          floatingSizeRef.current = nextSize
          setEditorViewportSize(editorViewportId, nextSize)
          setEditorViewportWindowMode(editorViewportId, 'expanded')
          hasUndocked = true
        }
        floatingPosRef.current = nextPos
        setEditorViewportPosition(editorViewportId, nextPos)
      }

      const handleUp = () => {
        meatballDockDragIntentRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
    },
    [
      activeEditorViewport,
      clampFloatingPos,
      normalizeFloatingSize,
      setEditorViewportPosition,
      setEditorViewportSize,
      setEditorViewportWindowMode,
    ],
  )

  const handleSplitResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || activeEditorViewport === null || activeWindowMode !== 'split view') {
        return
      }
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }
      const rect = viewportElement.getBoundingClientRect()
      splitResizeRef.current = {
        viewportTop: rect.top,
        viewportHeight: rect.height - splitDividerHeight,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const state = splitResizeRef.current
        if (state === null) {
          return
        }
        const viewportRect = viewportRef.current?.getBoundingClientRect()
        if (viewportRect === undefined) {
          return
        }
        const nextRatio =
          splitDirection === 'vertical'
            ? (moveEvent.clientX - viewportRect.left) / Math.max(1, viewportRect.width - splitDividerHeight)
            : (moveEvent.clientY - state.viewportTop) / Math.max(1, state.viewportHeight)
        setEditorViewportSplitRatio(activeEditorViewport.editorViewportId, nextRatio)
      }

      const handleUp = () => {
        splitResizeRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
      event.stopPropagation()
    },
    [activeEditorViewport, activeWindowMode, setEditorViewportSplitRatio, splitDirection],
  )

  const handlePrimaryViewModeCycle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    const editorViewportId = activeEditorViewport.editorViewportId
    const headerCollapsed = headerCollapsedByViewportId[editorViewportId] ?? false
    const canvasToolbarVisible = canvasToolbarVisibleByViewportId[editorViewportId] ?? true
    const isEssentials = activeEditorViewport.windowMode !== 'collapsed' && headerCollapsed && !canvasToolbarVisible

    if (activeEditorViewport.windowMode === 'collapsed') {
      setEditorViewportPresentationMode(editorViewportId, 'expanded')
      return
    }

    if (isEssentials) {
      setEditorViewportPresentationMode(editorViewportId, 'collapsed')
      return
    }

    setEditorViewportPresentationMode(editorViewportId, 'essentials')
  }, [
    activeEditorViewport,
    canvasToolbarVisibleByViewportId,
    headerCollapsedByViewportId,
    setEditorViewportPresentationMode,
  ])

  const handleHeaderToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setHeaderToggleRevisionByViewportId((current) => ({
      ...current,
      [activeEditorViewport.editorViewportId]:
        (current[activeEditorViewport.editorViewportId] ?? 0) + 1,
    }))
    setEditorViewportHeaderCollapsed(
      activeEditorViewport.editorViewportId,
      !(headerCollapsedByViewportId[activeEditorViewport.editorViewportId] ?? false),
    )
  }, [activeEditorViewport, headerCollapsedByViewportId, setEditorViewportHeaderCollapsed])

  const handleSetHeaderCollapsed = useCallback(
    (collapsed: boolean) => {
      if (activeEditorViewport === null) {
        return
      }
      setEditorViewportHeaderCollapsed(activeEditorViewport.editorViewportId, collapsed)
    },
    [activeEditorViewport, setEditorViewportHeaderCollapsed],
  )

  const handleCanvasToolbarToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportCanvasToolbarVisible(
      activeEditorViewport.editorViewportId,
      !(canvasToolbarVisibleByViewportId[activeEditorViewport.editorViewportId] ?? true),
    )
  }, [activeEditorViewport, canvasToolbarVisibleByViewportId, setEditorViewportCanvasToolbarVisible])

  const handleMeatballMode = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setActiveLeftDockPreviewPanelId(null)
    if (activeEditorViewport.windowMode !== 'meatball editor view') {
      setEditorViewportHeaderCollapsed(activeEditorViewport.editorViewportId, true)
    }
    setEditorViewportWindowMode(
      activeEditorViewport.editorViewportId,
      activeEditorViewport.windowMode === 'meatball editor view' ? 'expanded' : 'meatball editor view',
    )
  }, [activeEditorViewport, setEditorViewportHeaderCollapsed, setEditorViewportWindowMode])

  const handleMaximizeToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'maximized')
  }, [activeEditorViewport, setEditorViewportWindowMode])

  const handleSplitToggle = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'split view')
  }, [activeEditorViewport, setEditorViewportWindowMode])

  const handleFloatingSplitMenu = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (activeEditorViewport === null || activeWindowMode === 'split view') {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setWorkspaceSplitMenu({
        x: event.clientX,
        y: event.clientY,
        scope: 'floating-titlebar',
      })
    },
    [activeEditorViewport, activeWindowMode],
  )

  const handleDividerSplitMenu = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setWorkspaceSplitMenu({
      x: event.clientX,
      y: event.clientY,
      scope: 'divider',
    })
  }, [])

  const handleSetSplitDirection = useCallback(
    (nextDirection: WorkspaceSplitDirection) => {
      if (activeEditorViewport === null) {
        return
      }
      const editorViewportId = activeEditorViewport.editorViewportId
      setEditorViewportSplitDirection(editorViewportId, nextDirection)
      if (activeWindowMode !== 'split view') {
        setEditorViewportWindowMode(editorViewportId, 'split view')
      }
      setWorkspaceSplitMenu(null)
    },
    [
      activeEditorViewport,
      activeWindowMode,
      setEditorViewportSplitDirection,
      setEditorViewportWindowMode,
    ],
  )

  const handleResetSplitRatio = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportSplitRatio(activeEditorViewport.editorViewportId, 0.5)
    setWorkspaceSplitMenu(null)
  }, [activeEditorViewport, setEditorViewportSplitRatio])

  const handleSplitTitleBarClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!event.ctrlKey || activeEditorViewport === null || activeWindowMode !== 'split view') {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'expanded')
    },
    [activeEditorViewport, activeWindowMode, setEditorViewportWindowMode],
  )

  const handleSplitTitleBarDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        event.button !== 0 ||
        !event.ctrlKey ||
        activeEditorViewport === null ||
        activeWindowMode !== 'split view'
      ) {
        return
      }
      const viewportElement = viewportRef.current
      const titleBarElement = event.currentTarget
      if (viewportElement === null) {
        return
      }

      const viewportRect = viewportElement.getBoundingClientRect()
      const titleBarRect = titleBarElement.getBoundingClientRect()
      const pointerOffsetX = event.clientX - titleBarRect.left
      const pointerOffsetY = event.clientY - titleBarRect.top
      const nextPos = clampFloatingPos({
        x: event.clientX - viewportRect.left - pointerOffsetX,
        y: event.clientY - viewportRect.top - pointerOffsetY,
      })

      floatingPosRef.current = nextPos
      setEditorViewportPosition(activeEditorViewport.editorViewportId, nextPos)
      setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'expanded')
      beginFloatingSpaghettiDrag(
        activeEditorViewport.editorViewportId,
        pointerOffsetX,
        pointerOffsetY,
        Math.max(1, Math.round(titleBarRect.height)),
      )
      event.preventDefault()
      event.stopPropagation()
    },
    [
      activeEditorViewport,
      activeWindowMode,
      beginFloatingSpaghettiDrag,
      clampFloatingPos,
      setEditorViewportPosition,
      setEditorViewportWindowMode,
    ],
  )

  const handleSetSplitPriority = useCallback((nextPriority: WorkspaceSplitPriority) => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportSplitPriority(activeEditorViewport.editorViewportId, nextPriority)
    setWorkspaceSplitMenu(null)
  }, [activeEditorViewport, setEditorViewportSplitPriority])

  const handleCloseSplitFromMenu = useCallback(() => {
    if (activeEditorViewport === null || activeWindowMode !== 'split view') {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'split view')
    setWorkspaceSplitMenu(null)
  }, [activeEditorViewport, activeWindowMode, setEditorViewportWindowMode])

  const handleCloseEditor = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    closeEditorViewport(activeEditorViewport.editorViewportId)
  }, [activeEditorViewport, closeEditorViewport])

  const handleToggleBrowserFloating = useCallback(() => {
    setActiveLeftDockPreviewPanelId(null)
    if (isBrowserFloating) {
      setIsBrowserFloating(false)
      return
    }
    openBrowserFloatingFromDock()
  }, [isBrowserFloating, openBrowserFloatingFromDock])

  const handleActivateSpaghettiFloatingWindow = useCallback(() => {
    setActiveFloatingShell('spaghetti')
    setActiveSurface('spaghetti')
    requestConsoleContextSync('surface-activation')
  }, [requestConsoleContextSync, setActiveSurface])

  const handleActivateSpaghettiSurface = useCallback(() => {
    setActiveSurface('spaghetti')
    requestConsoleContextSync('surface-activation')
  }, [requestConsoleContextSync, setActiveSurface])

  const handleActivateViewerSurface = useCallback(() => {
    setActiveFloatingShell(null)
    setActiveSurface('viewer')
    if (sketchPlanePickSession !== null) {
      return
    }
    requestConsoleContextSync('surface-clear')
  }, [requestConsoleContextSync, setActiveSurface, sketchPlanePickSession])

  const handleActivateBrowserFloatingWindow = useCallback(() => {
    setActiveFloatingShell('browser')
    setActiveSurface('browser')
  }, [setActiveSurface])

  const splitLayoutStyle = useMemo(
    () => ({
      gridTemplateColumns:
        splitDirection === 'vertical'
          ? `${splitRatio}fr ${splitDividerHeight}px ${1 - splitRatio}fr`
          : 'minmax(0, 1fr)',
      gridTemplateRows:
        splitDirection === 'vertical'
          ? 'minmax(0, 1fr)'
          : `${splitRatio}fr ${splitDividerHeight}px ${1 - splitRatio}fr`,
      ['--left-dock-split-width' as const]: `${leftDockWidth}px`,
    }),
    [leftDockWidth, splitDirection, splitRatio],
  )

  const newEditorSpawnPosition = useMemo(
    () => ({
      x: leftDockWidth + floatingDockLockGap,
      y: 16,
    }),
    [leftDockWidth],
  )

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (browserDockDragIntentRef.current !== null && !isBrowserFloating) {
        const shellRect = appShellRef.current?.getBoundingClientRect()
        if (shellRect !== undefined) {
          const intent = browserDockDragIntentRef.current
          const deltaX = event.clientX - intent.startClientX
          const deltaY = event.clientY - intent.startClientY
          if (Math.hypot(deltaX, deltaY) >= 8) {
            const nextSize = clampBrowserFloatingSize({
              width: intent.width,
              height: intent.height,
            })
            const nextPos = clampBrowserFloatingPos({
              x: event.clientX - shellRect.left - intent.pointerOffsetX,
              y: event.clientY - shellRect.top - intent.pointerOffsetY,
            })
            browserFloatingSizeRef.current = nextSize
            browserFloatingPosRef.current = nextPos
            setBrowserFloatingSize(nextSize)
            setBrowserFloatingPos(nextPos)
            setIsBrowserFloating(true)
            browserDragRef.current = {
              pointerOffsetX: intent.pointerOffsetX,
              pointerOffsetY: intent.pointerOffsetY,
            }
            browserDockDragIntentRef.current = null
          }
        }
      }

      if (browserDragRef.current !== null) {
        const shellRect = appShellRef.current?.getBoundingClientRect()
        if (shellRect === undefined) {
          return
        }
        const nextPos = clampBrowserFloatingPos({
          x: event.clientX - shellRect.left - browserDragRef.current.pointerOffsetX,
          y: event.clientY - shellRect.top - browserDragRef.current.pointerOffsetY,
        })
        browserFloatingPosRef.current = nextPos
        setBrowserFloatingPos(nextPos)
        setActiveLeftDockPreviewPanelId(
          resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY),
        )
      }

      if (leftDockResizeRef.current !== null) {
        const nextWidth = clampLeftDockWidth(
          leftDockResizeRef.current.startWidth + (event.clientX - leftDockResizeRef.current.startPointerX),
        )
        setLeftDockWidth(nextWidth)
        const dockLockedPos = resolveDockLockedFloatingPos(nextWidth)
        if (dockLockedPos !== null && activeEditorViewport !== null) {
          floatingDockLockRef.current = {
            editorViewportId: activeEditorViewport.editorViewportId,
          }
          floatingPosRef.current = dockLockedPos
          setEditorViewportPosition(activeEditorViewport.editorViewportId, dockLockedPos)
        }
      }

    }

    const handlePointerUp = (event: PointerEvent) => {
      const shouldDockBrowser =
        browserDragRef.current !== null &&
        resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY) === 'browser'
      browserDragRef.current = null
      leftDockResizeRef.current = null
      browserDockDragIntentRef.current = null
      meatballDockDragIntentRef.current = null
      floatingDockLockRef.current = null
      setActiveLeftDockPreviewPanelId(null)
      if (shouldDockBrowser) {
        setIsBrowserFloating(false)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [
    activeEditorViewport,
    clampBrowserFloatingPos,
    clampBrowserFloatingSize,
    clampLeftDockWidth,
    isBrowserFloating,
    resolveDockLockedFloatingPos,
    resolveLeftDockPreviewPanelId,
    setEditorViewportPosition,
  ])

  const leftDockResizeMenuStyle =
    leftDockResizeMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              leftDockResizeMenu.x,
              (typeof window === 'undefined' ? leftDockResizeMenu.x : window.innerWidth) - 220,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              leftDockResizeMenu.y,
              (typeof window === 'undefined' ? leftDockResizeMenu.y : window.innerHeight) - 120,
            ),
          )}px`,
        }

  const workspaceSplitMenuStyle =
    workspaceSplitMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              workspaceSplitMenu.x,
              (typeof window === 'undefined' ? workspaceSplitMenu.x : window.innerWidth) - 240,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              workspaceSplitMenu.y,
              (typeof window === 'undefined' ? workspaceSplitMenu.y : window.innerHeight) - 280,
            ),
          )}px`,
        }

  const consoleListLeftOffset =
    isLeftDockViewportSplit && !showSplitLayout ? 0 : leftDockWidth

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <aside
        className="LeftDock"
        style={{
          width: `${leftDockWidth}px`,
          minWidth: `${leftDockWidth}px`,
          maxWidth: `${leftDockWidth}px`,
          bottom:
            showSplitLayout &&
            splitDirection === 'horizontal' &&
            (!isLeftDockViewportSplit || splitPriority !== 'favorFirst')
              ? `calc(${((1 - splitRatio) * 100).toFixed(4)}% + ${splitDividerHeight}px)`
              : '0px',
        }}
      >
        <div className="LeftDockContent">
          <TitleStatusBar />
          <div
            className={`LeftDockPanelStackShell ${
              isLeftDockViewportSplit || showSplitLayout ? 'isConstrained' : ''
            }`}
          >
            <div className={`PanelStack ${isLeftDockViewportSplit || showSplitLayout ? 'isConstrained' : ''}`}>
              <div
                ref={dockedBrowserHostRef}
                className={`LeftDockPanelTarget LeftDockPanelTarget--browser ${
                  isBrowserDockPreviewActive ? 'isPreviewActive' : ''
                }`}
              >
                {!isBrowserFloating ? (
                  <BrowserPanel
                    isCollapsed={isBrowserCollapsed}
                    onToggleCollapsed={() => setIsBrowserCollapsed((current) => !current)}
                    onTogglePopout={handleToggleBrowserFloating}
                    onTitleBarPointerDown={handleBrowserDockDragStart}
                    newEditorSpawnPosition={newEditorSpawnPosition}
                  />
                ) : null}
                <div className="LeftDockPanelGhostSlot" aria-hidden={!isBrowserDockPreviewActive}>
                  <div className="LeftDockPanelGhost">Browser Dock Target</div>
                </div>
              </div>
              <div
                ref={dockedMeatballHostRef}
                className={`LeftDockPanelTarget LeftDockPanelTarget--meatball-editor ${
                  isMeatballDockPreviewActive ? 'isPreviewActive' : ''
                }`}
              >
                {showMeatballDock && activeEditorViewport !== null ? (
                  <div
                    className="SpaghettiMeatballHost SpaghettiWindowShell"
                    onPointerDownCapture={handleActivateSpaghettiSurface}
                    style={getWindowAppearanceStyle(activeWindowAppearance)}
                  >
                    <SpaghettiWindowTitleBar
                      editorViewportId={activeEditorViewport.editorViewportId}
                      onPrimaryViewModeCycle={handlePrimaryViewModeCycle}
                      onActionTrayToggle={handleActionTrayToggle}
                      onWindowSettingsToggle={handleWindowSettingsToggle}
                      onHeaderToggle={handleHeaderToggle}
                      onCanvasToolbarToggle={handleCanvasToolbarToggle}
                      onMeatball={handleMeatballMode}
                      onMaximizeToggle={handleMaximizeToggle}
                      onSplitToggle={handleSplitToggle}
                      onClose={handleCloseEditor}
                      onDragStart={handleMeatballDockDragStart}
                      isCollapsed={false}
                      isActionTrayExpanded={isActionTrayExpanded}
                      isWindowSettingsOpen={isWindowSettingsOpen}
                      isHeaderCollapsed={isHeaderCollapsed}
                      isCanvasToolbarVisible={isCanvasToolbarVisible}
                      isMeatball
                      isMaximized={false}
                      isSplit={false}
                    />
                    <SpaghettiPanel
                      editorViewportId={activeEditorViewport.editorViewportId}
                      isWindowSettingsOpen={isWindowSettingsOpen}
                      isClampEditing={isWindowClampEditing}
                      windowAppearance={activeWindowAppearance}
                      onWindowAppearanceChange={(patch) =>
                        handleWindowAppearanceChange(activeEditorViewport.editorViewportId, patch)
                      }
                      onToggleClampEditing={handleWindowClampEditingToggle}
                      onResetWindowAppearance={() =>
                        handleResetWindowAppearance(activeEditorViewport.editorViewportId)
                      }
                      isHeaderCollapsed={isHeaderCollapsed}
                      isCanvasToolbarVisible={isCanvasToolbarVisible}
                      headerToggleRevision={headerToggleRevision}
                      onSetHeaderCollapsed={handleSetHeaderCollapsed}
                    />
                  </div>
                ) : null}
                <div className="LeftDockPanelGhostSlot" aria-hidden={!isMeatballDockPreviewActive}>
                  <div className="LeftDockPanelGhost">Meatball Dock Target</div>
                </div>
              </div>
            </div>
            <div
              className={`LeftDockResizeHandle ${
                isLeftDockViewportSplit && showSplitLayout ? 'isViewportSplit' : ''
              }`}
              onPointerDown={handleLeftDockResizeStart}
              onContextMenu={handleLeftDockResizeContextMenu}
              aria-hidden="true"
            >
              <button
                type="button"
                className={`LeftDockResizeToggle ${isLeftDockViewportSplit ? 'isActive' : ''}`}
                onPointerDown={handleLeftDockSplitTogglePointerDown}
                onClick={handleLeftDockSplitToggleClick}
                aria-label="Toggle left dock viewport split"
                title={isLeftDockViewportSplit ? 'Unsplit viewport' : 'Split viewport'}
              >
                []
              </button>
            </div>
          </div>
        </div>
      </aside>
      <section
        ref={viewportRef}
        className={`ViewportArea ${isLeftDockViewportSplit && !showSplitLayout ? 'isLeftDockSplit' : ''}`}
        style={{
          marginLeft:
            isLeftDockViewportSplit && !showSplitLayout ? `${leftDockWidth}px` : undefined,
        }}
      >
        {showSplitLayout && activeEditorViewport !== null ? (
          <div
            className={`ViewportSplitLayout ${splitDirectionClass} ${splitPriorityClass} ${
              isLeftDockViewportSplit ? 'isLeftDockSplit' : ''
            }`}
            style={splitLayoutStyle}
          >
            <div className="ViewportSplitPane ViewportSplitPane--viewer">
              <div className="ViewportViewerSurface" onPointerDownCapture={handleActivateViewerSurface}>
                <ViewerHost />
              </div>
              <ViewportOverlay />
            </div>
            <div className="ViewportSplitDividerShell">
              <button
                type="button"
                className="ViewportSplitDivider"
                onPointerDown={handleSplitResizeStart}
                onContextMenu={handleDividerSplitMenu}
                onDoubleClick={handleResetSplitRatio}
                aria-label="Resize split view"
                title="Drag to resize viewport and editor"
              />
            </div>
            <div className="ViewportSplitPane ViewportSplitPane--editor">
              <div
                className="SpaghettiSplitWindow SpaghettiWindowShell"
                onPointerDownCapture={handleActivateSpaghettiSurface}
                style={getWindowAppearanceStyle(activeWindowAppearance)}
              >
                <SpaghettiWindowTitleBar
                  editorViewportId={activeEditorViewport.editorViewportId}
                  onPrimaryViewModeCycle={handlePrimaryViewModeCycle}
                  onActionTrayToggle={handleActionTrayToggle}
                  onWindowSettingsToggle={handleWindowSettingsToggle}
                  onHeaderToggle={handleHeaderToggle}
                  onCanvasToolbarToggle={handleCanvasToolbarToggle}
                  onMeatball={handleMeatballMode}
                  onMaximizeToggle={handleMaximizeToggle}
                  onSplitToggle={handleSplitToggle}
                  onDragStart={handleSplitTitleBarDragStart}
                  onShellClick={handleSplitTitleBarClick}
                  onContextMenu={handleDividerSplitMenu}
                  onClose={handleCloseEditor}
                  isCollapsed={false}
                  isActionTrayExpanded={isActionTrayExpanded}
                  isWindowSettingsOpen={isWindowSettingsOpen}
                  isHeaderCollapsed={isHeaderCollapsed}
                  isCanvasToolbarVisible={isCanvasToolbarVisible}
                  isMeatball={false}
                  isMaximized={false}
                  isSplit
                />
                <div className="SpaghettiFloatingBody">
                  <SpaghettiPanel
                    editorViewportId={activeEditorViewport.editorViewportId}
                    isWindowSettingsOpen={isWindowSettingsOpen}
                    isClampEditing={isWindowClampEditing}
                    windowAppearance={activeWindowAppearance}
                    onWindowAppearanceChange={(patch) =>
                      handleWindowAppearanceChange(activeEditorViewport.editorViewportId, patch)
                    }
                    onToggleClampEditing={handleWindowClampEditingToggle}
                    onResetWindowAppearance={() =>
                      handleResetWindowAppearance(activeEditorViewport.editorViewportId)
                    }
                    isHeaderCollapsed={isHeaderCollapsed}
                    isCanvasToolbarVisible={isCanvasToolbarVisible}
                    headerToggleRevision={headerToggleRevision}
                    onSetHeaderCollapsed={handleSetHeaderCollapsed}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="ViewportViewerSurface" onPointerDownCapture={handleActivateViewerSurface}>
              <ViewerHost />
            </div>
            {showFloatingShell && isBottomSplitDockPreviewActive ? (
              <div
                className={`ViewportBottomSplitDockGhost ${
                  isLeftDockViewportSplit && splitPriority !== 'favorSecond' ? 'isLeftDockShifted' : ''
                }`}
                style={{
                  top: `calc(${(splitRatio * 100).toFixed(4)}% + ${splitDividerHeight}px)`,
                  '--left-dock-split-width': `${leftDockWidth}px`,
                } as CSSProperties}
                aria-hidden="true"
              />
            ) : null}
            <ViewportOverlay />
          </>
        )}
        {showFloatingShell && activeEditorViewport !== null ? (
          <aside className="SpaghettiFloatingDock">
            <div
              className={`SpaghettiFloatingWindow SpaghettiWindowShell ${
                activeWindowMode === 'maximized'
                  ? 'isMaximized'
                  : activeWindowMode === 'collapsed'
                    ? 'isCollapsed'
                    : ''
              } ${workspaceActiveSurface === 'spaghetti' ? 'isActiveWindow' : ''}`}
              onPointerDown={handleActivateSpaghettiFloatingWindow}
              onPointerDownCapture={handleActivateSpaghettiSurface}
              style={{
                left:
                  activeWindowMode === 'maximized' ? '0px' : `${activeEditorViewport.position.x}px`,
                top:
                  activeWindowMode === 'maximized' ? '0px' : `${activeEditorViewport.position.y}px`,
                width:
                  activeWindowMode === 'maximized' ? '100%' : `${activeEditorViewport.size.width}px`,
                height:
                  activeWindowMode === 'maximized'
                    ? '100%'
                    : activeWindowMode === 'collapsed'
                      ? undefined
                      : `${activeEditorViewport.size.height}px`,
                zIndex: activeEditorViewport.zOrder,
                ...getWindowAppearanceStyle(activeWindowAppearance),
              }}
            >
              <SpaghettiWindowTitleBar
                editorViewportId={activeEditorViewport.editorViewportId}
                onPrimaryViewModeCycle={handlePrimaryViewModeCycle}
                onActionTrayToggle={handleActionTrayToggle}
                onWindowSettingsToggle={handleWindowSettingsToggle}
                onHeaderToggle={handleHeaderToggle}
                onCanvasToolbarToggle={handleCanvasToolbarToggle}
                onMeatball={handleMeatballMode}
                onMaximizeToggle={handleMaximizeToggle}
                onSplitToggle={handleSplitToggle}
                onClose={handleCloseEditor}
                onDragStart={handleSpaghettiDragStart}
                onContextMenu={handleFloatingSplitMenu}
                isCollapsed={activeWindowMode === 'collapsed'}
                isActionTrayExpanded={isActionTrayExpanded}
                isWindowSettingsOpen={isWindowSettingsOpen}
                isHeaderCollapsed={isHeaderCollapsed}
                isCanvasToolbarVisible={isCanvasToolbarVisible}
                isMeatball={false}
                isMaximized={activeWindowMode === 'maximized'}
                isSplit={false}
              />
              {activeWindowMode !== 'collapsed' ? (
                <div className="SpaghettiFloatingBody">
                  <SpaghettiPanel
                    editorViewportId={activeEditorViewport.editorViewportId}
                    isWindowSettingsOpen={isWindowSettingsOpen}
                    isClampEditing={isWindowClampEditing}
                    windowAppearance={activeWindowAppearance}
                    onWindowAppearanceChange={(patch) =>
                      handleWindowAppearanceChange(activeEditorViewport.editorViewportId, patch)
                    }
                    onToggleClampEditing={handleWindowClampEditingToggle}
                    onResetWindowAppearance={() =>
                      handleResetWindowAppearance(activeEditorViewport.editorViewportId)
                    }
                    isHeaderCollapsed={isHeaderCollapsed}
                    isCanvasToolbarVisible={isCanvasToolbarVisible}
                    headerToggleRevision={headerToggleRevision}
                    onSetHeaderCollapsed={handleSetHeaderCollapsed}
                  />
                </div>
              ) : null}
              {canResizeFloatingWindow ? (
                <div
                  className="SpaghettiFloatingResizeHandle"
                  onPointerDown={handleSpaghettiResizeStart}
                />
              ) : null}
            </div>
          </aside>
        ) : null}
        <ConsoleDock listLeftOffset={consoleListLeftOffset} />
      </section>
      {isBrowserFloating ? (
        <aside className="BrowserFloatingDock">
          <div
            ref={browserFloatingWindowRef}
            className={`BrowserFloatingWindow ${isBrowserCollapsed ? 'isCollapsed' : ''} ${
              workspaceActiveSurface === 'browser' ? 'isActiveWindow' : ''
            }`}
            onPointerDown={handleActivateBrowserFloatingWindow}
            style={{
              left: `${browserFloatingPos.x}px`,
              top: `${browserFloatingPos.y}px`,
              width: `${browserFloatingSize.width}px`,
            }}
          >
            <BrowserPanel
              isCollapsed={isBrowserCollapsed}
              onToggleCollapsed={() => setIsBrowserCollapsed((current) => !current)}
              isFloating
              onTogglePopout={handleToggleBrowserFloating}
              onTitleBarPointerDown={handleBrowserDragStart}
              newEditorSpawnPosition={newEditorSpawnPosition}
            />
          </div>
        </aside>
      ) : null}
      {leftDockResizeMenu !== null ? (
        <div className="LeftDockResizeMenu" style={leftDockResizeMenuStyle}>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={handleResetLeftDockWidth}
          >
            Default Width
          </button>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={handleToggleLeftDockViewportSplit}
          >
            {isLeftDockViewportSplit ? 'Unsplit Viewport' : 'Split Viewport'}
          </button>
        </div>
      ) : null}
      {workspaceSplitMenu !== null ? (
        <div className="WorkspaceSplitMenu LeftDockResizeMenu" style={workspaceSplitMenuStyle}>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={() => handleSetSplitDirection('horizontal')}
          >
            Split Horizontal
          </button>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={() => handleSetSplitDirection('vertical')}
          >
            Split Vertical
          </button>
          {workspaceSplitMenu.scope === 'divider' ? (
            <>
              <button
                type="button"
                className="LeftDockResizeMenuAction"
                onClick={handleResetSplitRatio}
              >
                Reset Ratio
              </button>
              <button
                type="button"
                className={`LeftDockResizeMenuAction ${
                  splitPriority === 'balanced' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('balanced')}
              >
                Balanced Priority
              </button>
              <button
                type="button"
                className={`LeftDockResizeMenuAction ${
                  splitPriority === 'favorFirst' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('favorFirst')}
              >
                Favor First Pane
              </button>
              <button
                type="button"
                className={`LeftDockResizeMenuAction ${
                  splitPriority === 'favorSecond' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('favorSecond')}
              >
                Favor Second Pane
              </button>
              <button
                type="button"
                className="LeftDockResizeMenuAction"
                onClick={handleCloseSplitFromMenu}
              >
                Close Split
              </button>
              <button
                type="button"
                className="LeftDockResizeMenuAction"
                onClick={handleCloseSplitFromMenu}
              >
                Merge With Neighbor
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      {isRadioToolbarOpen ? <RadioPanel /> : null}
      <iframe
        ref={radioSoundCloudIframeRef}
        title="Radio SoundCloud Bridge"
        src={buildSoundCloudPlayerUrl(DEFAULT_GUSANO_URL)}
        allow="autoplay"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: 'absolute',
          width: '0px',
          height: '0px',
          border: '0',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <ViewToolbar />
    </div>
  )
}

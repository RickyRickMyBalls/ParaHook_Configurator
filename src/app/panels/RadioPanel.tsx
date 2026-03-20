import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { ParaSlider } from '../components/ParaSlider'
import {
  ViewportOverlayToolPanel,
  ViewportOverlayToolSection,
  ViewportOverlayToolSplitLayout,
  type ViewportOverlayToolPanelResizeDirection,
} from '../components/ViewportOverlayToolPanel'
import { useAudioSamplerStore } from '../store/audioSamplerStore'

type PanelPosition = {
  x: number
  y: number
}

type PanelSize = {
  width: number
  height: number
}

const DEFAULT_PANEL_WIDTH = 440
const DEFAULT_PANEL_HEIGHT = 360
const PANEL_MIN_WIDTH = 360
const PANEL_MIN_HEIGHT = 280
const PANEL_MARGIN = 16

const getDefaultPanelPosition = (): PanelPosition => {
  if (typeof window === 'undefined') {
    return { x: 24, y: 96 }
  }
  return {
    x: Math.max(PANEL_MARGIN, window.innerWidth - DEFAULT_PANEL_WIDTH - 48),
    y: 96,
  }
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const clampPanelRect = (position: PanelPosition, size: PanelSize) => {
  if (typeof window === 'undefined') {
    return { position, size }
  }
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const clampedWidth = clamp(size.width, PANEL_MIN_WIDTH, viewportWidth - PANEL_MARGIN * 2)
  const clampedHeight = clamp(size.height, PANEL_MIN_HEIGHT, viewportHeight - PANEL_MARGIN * 2)
  return {
    size: {
      width: clampedWidth,
      height: clampedHeight,
    },
    position: {
      x: clamp(position.x, PANEL_MARGIN, viewportWidth - clampedWidth - PANEL_MARGIN),
      y: clamp(position.y, PANEL_MARGIN, viewportHeight - clampedHeight - PANEL_MARGIN),
    },
  }
}

const formatDuration = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.round(seconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const secs = safeSeconds % 60
  if (hours > 0) {
    return `${hours}:${`${minutes}`.padStart(2, '0')}:${`${secs}`.padStart(2, '0')}`
  }
  return `${minutes}:${`${secs}`.padStart(2, '0')}`
}

const formatRuntimeStatus = (status: string): string =>
  status.replace(/-/g, ' ').replace(/\b\w/g, (token) => token.toUpperCase())

export function RadioPanel() {
  const isRadioEnabled = useAudioSamplerStore((state) => state.isRadioEnabled)
  const sourceUrl = useAudioSamplerStore((state) => state.sourceUrl)
  const sampleBurstTime = useAudioSamplerStore((state) => state.sampleBurstTime)
  const radioRuntimeStatus = useAudioSamplerStore((state) => state.radioRuntimeStatus)
  const radioRuntimeMessage = useAudioSamplerStore((state) => state.radioRuntimeMessage)
  const radioRuntimeSourceKind = useAudioSamplerStore((state) => state.radioRuntimeSourceKind)
  const radioTransport = useAudioSamplerStore((state) => state.radioTransport)
  const closeRadioToolbar = useAudioSamplerStore((state) => state.closeRadioToolbar)
  const turnRadioOn = useAudioSamplerStore((state) => state.turnRadioOn)
  const turnRadioOff = useAudioSamplerStore((state) => state.turnRadioOff)
  const setSampleBurstTime = useAudioSamplerStore((state) => state.setSampleBurstTime)
  const randomizeSampleTimes = useAudioSamplerStore((state) => state.randomizeSampleTimes)
  const requestRadioReload = useAudioSamplerStore((state) => state.requestRadioReload)
  const requestRadioSeek = useAudioSamplerStore((state) => state.requestRadioSeek)
  const [sampleBurstDraft, setSampleBurstDraft] = useState(`${sampleBurstTime}`)
  const [position, setPosition] = useState<PanelPosition>(() => getDefaultPanelPosition())
  const [size, setSize] = useState<PanelSize>({
    width: DEFAULT_PANEL_WIDTH,
    height: DEFAULT_PANEL_HEIGHT,
  })
  const dragStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    startPosition: PanelPosition
  } | null>(null)
  const resizeStateRef = useRef<{
    pointerId: number
    direction: ViewportOverlayToolPanelResizeDirection
    startX: number
    startY: number
    startPosition: PanelPosition
    startSize: PanelSize
  } | null>(null)

  useEffect(() => {
    setSampleBurstDraft(`${sampleBurstTime}`)
  }, [sampleBurstTime])

  const commitSampleBurstDraft = () => {
    const nextValue = Number(sampleBurstDraft)
    if (!Number.isFinite(nextValue) || nextValue <= 0) {
      setSampleBurstDraft(`${sampleBurstTime}`)
      return
    }
    setSampleBurstTime(nextValue)
    setSampleBurstDraft(`${nextValue}`)
  }

  const handleTitleBarPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    if (target?.closest('button, input') !== null) {
      return
    }
    event.preventDefault()
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: position,
    }

    const move = (moveEvent: PointerEvent) => {
      const state = dragStateRef.current
      if (state === null || moveEvent.pointerId !== state.pointerId) {
        return
      }
      const next = clampPanelRect(
        {
          x: state.startPosition.x + (moveEvent.clientX - state.startX),
          y: state.startPosition.y + (moveEvent.clientY - state.startY),
        },
        size,
      )
      setPosition(next.position)
      setSize(next.size)
    }

    const stop = (stopEvent: PointerEvent) => {
      const state = dragStateRef.current
      if (state === null || stopEvent.pointerId !== state.pointerId) {
        return
      }
      dragStateRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  const handleResizePointerDown = (
    direction: ViewportOverlayToolPanelResizeDirection,
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    resizeStateRef.current = {
      pointerId: event.pointerId,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: position,
      startSize: size,
    }

    const move = (moveEvent: PointerEvent) => {
      const state = resizeStateRef.current
      if (state === null || moveEvent.pointerId !== state.pointerId) {
        return
      }
      const deltaX = moveEvent.clientX - state.startX
      const deltaY = moveEvent.clientY - state.startY
      let nextPosition = { ...state.startPosition }
      let nextSize = { ...state.startSize }

      if (state.direction.includes('e')) {
        nextSize.width = state.startSize.width + deltaX
      }
      if (state.direction.includes('s')) {
        nextSize.height = state.startSize.height + deltaY
      }
      if (state.direction.includes('w')) {
        nextPosition.x = state.startPosition.x + deltaX
        nextSize.width = state.startSize.width - deltaX
      }
      if (state.direction.includes('n')) {
        nextPosition.y = state.startPosition.y + deltaY
        nextSize.height = state.startSize.height - deltaY
      }

      const next = clampPanelRect(nextPosition, nextSize)
      setPosition(next.position)
      setSize(next.size)
    }

    const stop = (stopEvent: PointerEvent) => {
      const state = resizeStateRef.current
      if (state === null || stopEvent.pointerId !== state.pointerId) {
        return
      }
      resizeStateRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  const transportDisplay = useMemo(
    () => `${formatDuration(radioTransport.currentTimeSec)} / ${formatDuration(radioTransport.durationSec)}`,
    [radioTransport.currentTimeSec, radioTransport.durationSec],
  )
  const normalizedSliderValue =
    radioTransport.durationSec > 0 ? radioTransport.currentTimeSec / radioTransport.durationSec : 0

  return (
    <div className="ViewportOverlayWidget RadioPanelHost">
      <ViewportOverlayToolPanel
        className="RadioPanel"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        title="Radio"
        titleMeta={`${formatRuntimeStatus(radioRuntimeStatus)} | ${radioRuntimeSourceKind}`}
        onTitleBarPointerDown={handleTitleBarPointerDown}
        onResizeHandlePointerDown={handleResizePointerDown}
        titleActions={
          <div className="RadioPanelTitleActions">
            <button
              type="button"
              className="RadioPanelActionButton"
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              onClick={closeRadioToolbar}
              aria-label="Close radio toolbar"
              title="Close radio toolbar"
            >
              X
            </button>
          </div>
        }
      >
        <ViewportOverlayToolSplitLayout
          className="RadioPanelSplitLayout"
          defaultTopHeight={172}
          top={
            <ViewportOverlayToolSection label="Transport">
              <div className="RadioPanelSectionBody">
                <div className="RadioPanelStatusGrid">
                  <div className="RadioPanelField">
                    <span className="RadioPanelFieldLabel">Source</span>
                    <span className="RadioPanelFieldValue" title={sourceUrl}>
                      {sourceUrl}
                    </span>
                  </div>
                  <div className="RadioPanelField">
                    <span className="RadioPanelFieldLabel">Status</span>
                    <span className="RadioPanelFieldValue">{formatRuntimeStatus(radioRuntimeStatus)}</span>
                  </div>
                  <div className="RadioPanelField">
                    <span className="RadioPanelFieldLabel">Position</span>
                    <span className="RadioPanelFieldValue">{transportDisplay}</span>
                  </div>
                </div>
                <div
                  className={`RadioPanelSliderShell ${
                    radioTransport.isSeekable ? '' : 'isDisabled'
                  }`}
                >
                  <ParaSlider
                    label="Time"
                    displayLabel="Time Position"
                    displayValue={transportDisplay}
                    value={normalizedSliderValue}
                    min={0}
                    max={1}
                    step={0.001}
                    hideCaps
                    onChange={(nextValue) => {
                      if (!radioTransport.isSeekable || radioTransport.durationSec <= 0) {
                        return
                      }
                      requestRadioSeek(nextValue * radioTransport.durationSec)
                    }}
                  />
                </div>
                {!radioTransport.isSeekable ? (
                  <div className="RadioPanelHint">Seek is unavailable for the current radio source.</div>
                ) : null}
                {radioRuntimeMessage !== null ? (
                  <div className="RadioPanelHint">{radioRuntimeMessage}</div>
                ) : null}
              </div>
            </ViewportOverlayToolSection>
          }
          bottom={
            <ViewportOverlayToolSection label="Sampler">
              <div className="RadioPanelSectionBody">
                <div className="RadioPanelActionsRow">
                  <button
                    type="button"
                    className={`RadioPanelActionButton ${isRadioEnabled ? 'isActive' : ''}`}
                    onClick={() => {
                      turnRadioOn()
                      requestRadioReload()
                    }}
                  >
                    On
                  </button>
                  <button
                    type="button"
                    className={`RadioPanelActionButton ${!isRadioEnabled ? 'isActive' : ''}`}
                    onClick={turnRadioOff}
                  >
                    Off
                  </button>
                  <button
                    type="button"
                    className="RadioPanelActionButton"
                    onClick={() => {
                      randomizeSampleTimes()
                    }}
                  >
                    Randomize
                  </button>
                  <button
                    type="button"
                    className="RadioPanelActionButton"
                    onClick={() => {
                      requestRadioReload()
                    }}
                  >
                    Reload
                  </button>
                </div>
                <label className="RadioPanelBurstField">
                  <span className="RadioPanelFieldLabel">Sample Burst Time</span>
                  <input
                    className="RadioPanelInput"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={sampleBurstDraft}
                    onChange={(event) => setSampleBurstDraft(event.target.value)}
                    onBlur={commitSampleBurstDraft}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        commitSampleBurstDraft()
                      }
                    }}
                  />
                </label>
              </div>
            </ViewportOverlayToolSection>
          }
        />
      </ViewportOverlayToolPanel>
    </div>
  )
}

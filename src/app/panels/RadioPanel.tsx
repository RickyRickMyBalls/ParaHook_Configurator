import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { ParaSlider } from '../components/ParaSlider'
import { RadioWaveformStrip } from '../components/RadioWaveformStrip'
import {
  ViewportOverlayToolPanel,
  ViewportOverlayToolSection,
  type ViewportOverlayToolPanelResizeDirection,
} from '../components/ViewportOverlayToolPanel'
import { useAudioSamplerStore } from '../store/audioSamplerStore'
import {
  SAMPLER_NOTE_REPEAT_OPTIONS,
  SAMPLER_STEP_COUNT_OPTIONS,
  resolveStepDurationSec,
} from '../../runtime/audio/TimelineTransport'

type PanelPosition = {
  x: number
  y: number
}

type PanelSize = {
  width: number
  height: number
}

const DEFAULT_PANEL_WIDTH = 680
const DEFAULT_PANEL_HEIGHT = 640
const PANEL_MIN_WIDTH = 520
const PANEL_MIN_HEIGHT = 420
const PANEL_MARGIN = 16
const RADIO_SECTION_MIN_HEIGHT = 156
const SAMPLER_SECTION_MIN_HEIGHT = 220
const SECTION_SPLIT_HANDLE_HEIGHT = 12

const getDefaultPanelPosition = (): PanelPosition => {
  if (typeof window === 'undefined') {
    return { x: 24, y: 96 }
  }
  return {
    x: Math.max(PANEL_MARGIN, window.innerWidth - DEFAULT_PANEL_WIDTH - 48),
    y: 88,
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

const formatCueDisplay = (cueRatio: number, durationSec: number): string => {
  if (durationSec > 0) {
    return formatDuration(cueRatio * durationSec)
  }
  return `${Math.round(cueRatio * 100)}%`
}

const formatSecondsDisplay = (seconds: number): string => `${seconds.toFixed(3)}s`

const countEnabledSteps = (steps: { enabled: boolean }[]): number =>
  steps.reduce((count, step) => (step.enabled ? count + 1 : count), 0)

export function RadioPanel() {
  const isRadioEnabled = useAudioSamplerStore((state) => state.isRadioEnabled)
  const sourceUrl = useAudioSamplerStore((state) => state.sourceUrl)
  const sampleBurstTime = useAudioSamplerStore((state) => state.sampleBurstTime)
  const radioRuntimeStatus = useAudioSamplerStore((state) => state.radioRuntimeStatus)
  const radioRuntimeMessage = useAudioSamplerStore((state) => state.radioRuntimeMessage)
  const radioRuntimeSourceKind = useAudioSamplerStore((state) => state.radioRuntimeSourceKind)
  const radioTransport = useAudioSamplerStore((state) => state.radioTransport)
  const radioWaveform = useAudioSamplerStore((state) => state.radioWaveform)
  const isRadioToolbarSectionExpanded = useAudioSamplerStore(
    (state) => state.isRadioToolbarSectionExpanded,
  )
  const isSamplerToolbarSectionExpanded = useAudioSamplerStore(
    (state) => state.isSamplerToolbarSectionExpanded,
  )
  const isSamplerStepsSectionExpanded = useAudioSamplerStore(
    (state) => state.isSamplerStepsSectionExpanded,
  )
  const expandedSamplerStepIds = useAudioSamplerStore((state) => state.expandedSamplerStepIds)
  const samplerStepCount = useAudioSamplerStore((state) => state.samplerStepCount)
  const samplerBpm = useAudioSamplerStore((state) => state.samplerBpm)
  const samplerIsPlaying = useAudioSamplerStore((state) => state.samplerIsPlaying)
  const samplerPlayheadStepIndex = useAudioSamplerStore((state) => state.samplerPlayheadStepIndex)
  const samplerSteps = useAudioSamplerStore((state) => state.samplerSteps)
  const samplerNoteRepeat = useAudioSamplerStore((state) => state.samplerNoteRepeat)
  const closeRadioToolbar = useAudioSamplerStore((state) => state.closeRadioToolbar)
  const turnRadioOn = useAudioSamplerStore((state) => state.turnRadioOn)
  const turnRadioOff = useAudioSamplerStore((state) => state.turnRadioOff)
  const setSampleBurstTime = useAudioSamplerStore((state) => state.setSampleBurstTime)
  const randomizeSampleTimes = useAudioSamplerStore((state) => state.randomizeSampleTimes)
  const requestRadioReload = useAudioSamplerStore((state) => state.requestRadioReload)
  const requestRadioSeek = useAudioSamplerStore((state) => state.requestRadioSeek)
  const setRadioToolbarSectionExpanded = useAudioSamplerStore(
    (state) => state.setRadioToolbarSectionExpanded,
  )
  const setSamplerToolbarSectionExpanded = useAudioSamplerStore(
    (state) => state.setSamplerToolbarSectionExpanded,
  )
  const setSamplerStepsSectionExpanded = useAudioSamplerStore(
    (state) => state.setSamplerStepsSectionExpanded,
  )
  const toggleSamplerStepExpanded = useAudioSamplerStore((state) => state.toggleSamplerStepExpanded)
  const setSamplerStepCount = useAudioSamplerStore((state) => state.setSamplerStepCount)
  const setSamplerBpm = useAudioSamplerStore((state) => state.setSamplerBpm)
  const playSampler = useAudioSamplerStore((state) => state.playSampler)
  const stopSampler = useAudioSamplerStore((state) => state.stopSampler)
  const setSamplerStepCueRatio = useAudioSamplerStore((state) => state.setSamplerStepCueRatio)
  const setSamplerStepPlaybackShape = useAudioSamplerStore((state) => state.setSamplerStepPlaybackShape)
  const rerollSamplerStep = useAudioSamplerStore((state) => state.rerollSamplerStep)
  const rerollAllSamplerSteps = useAudioSamplerStore((state) => state.rerollAllSamplerSteps)
  const toggleSamplerStepEnabled = useAudioSamplerStore((state) => state.toggleSamplerStepEnabled)
  const toggleSamplerStepLocked = useAudioSamplerStore((state) => state.toggleSamplerStepLocked)
  const requestSamplerStepPreview = useAudioSamplerStore((state) => state.requestSamplerStepPreview)
  const setSamplerNoteRepeatEnabled = useAudioSamplerStore(
    (state) => state.setSamplerNoteRepeatEnabled,
  )
  const setSamplerNoteRepeatCount = useAudioSamplerStore((state) => state.setSamplerNoteRepeatCount)
  const setSamplerNoteRepeatRate = useAudioSamplerStore((state) => state.setSamplerNoteRepeatRate)
  const [sampleBurstDraft, setSampleBurstDraft] = useState(`${sampleBurstTime}`)
  const [position, setPosition] = useState<PanelPosition>(() => getDefaultPanelPosition())
  const [size, setSize] = useState<PanelSize>({
    width: DEFAULT_PANEL_WIDTH,
    height: DEFAULT_PANEL_HEIGHT,
  })
  const [radioSectionHeight, setRadioSectionHeight] = useState(232)
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
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const sectionSplitDragStateRef = useRef<{
    pointerId: number
    startY: number
    startHeight: number
    availableHeight: number
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
  const normalizedTransportSliderValue =
    radioTransport.durationSec > 0 ? radioTransport.currentTimeSec / radioTransport.durationSec : 0
  const stepCountSliderValue = useMemo(
    () => Math.max(0, SAMPLER_STEP_COUNT_OPTIONS.indexOf(samplerStepCount)),
    [samplerStepCount],
  )
  const repeatCountSliderValue = useMemo(
    () => Math.max(0, SAMPLER_NOTE_REPEAT_OPTIONS.indexOf(samplerNoteRepeat.count)),
    [samplerNoteRepeat.count],
  )
  const repeatRateSliderValue = useMemo(
    () => Math.max(0, SAMPLER_NOTE_REPEAT_OPTIONS.indexOf(samplerNoteRepeat.rate)),
    [samplerNoteRepeat.rate],
  )
  const enabledStepCount = useMemo(() => countEnabledSteps(samplerSteps), [samplerSteps])
  const samplerStepDurationSec = useMemo(
    () => resolveStepDurationSec(samplerBpm, samplerStepCount),
    [samplerBpm, samplerStepCount],
  )
  const visibleSamplerMarkers = useMemo(
    () => samplerSteps.slice(0, samplerStepCount),
    [samplerStepCount, samplerSteps],
  )
  const hasResizableSplit = isRadioToolbarSectionExpanded && isSamplerToolbarSectionExpanded

  useEffect(() => {
    if (!hasResizableSplit) {
      return
    }
    const bodyElement = bodyRef.current
    const availableHeight = bodyElement?.clientHeight ?? 0
    if (availableHeight <= 0) {
      return
    }
    const maxRadioHeight = Math.max(
      RADIO_SECTION_MIN_HEIGHT,
      availableHeight - SAMPLER_SECTION_MIN_HEIGHT - SECTION_SPLIT_HANDLE_HEIGHT,
    )
    const nextDefaultHeight = Math.round(availableHeight * 0.38)
    setRadioSectionHeight((currentHeight) =>
      clamp(
        currentHeight > 0 ? currentHeight : nextDefaultHeight,
        RADIO_SECTION_MIN_HEIGHT,
        maxRadioHeight,
      ),
    )
  }, [hasResizableSplit, size.height])

  const handleSectionSplitPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasResizableSplit) {
      return
    }
    const bodyElement = bodyRef.current
    const availableHeight = bodyElement?.clientHeight ?? 0
    if (availableHeight <= 0) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    sectionSplitDragStateRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: radioSectionHeight,
      availableHeight,
    }

    const move = (moveEvent: PointerEvent) => {
      const state = sectionSplitDragStateRef.current
      if (state === null || moveEvent.pointerId !== state.pointerId) {
        return
      }
      const maxRadioHeight = Math.max(
        RADIO_SECTION_MIN_HEIGHT,
        state.availableHeight - SAMPLER_SECTION_MIN_HEIGHT - SECTION_SPLIT_HANDLE_HEIGHT,
      )
      const nextHeight = clamp(
        state.startHeight + (moveEvent.clientY - state.startY),
        RADIO_SECTION_MIN_HEIGHT,
        maxRadioHeight,
      )
      setRadioSectionHeight(nextHeight)
    }

    const stop = (stopEvent: PointerEvent) => {
      const state = sectionSplitDragStateRef.current
      if (state === null || stopEvent.pointerId !== state.pointerId) {
        return
      }
      sectionSplitDragStateRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  const radioPanelBodyStyle = hasResizableSplit
    ? {
        gridTemplateRows: `${radioSectionHeight}px ${SECTION_SPLIT_HANDLE_HEIGHT}px minmax(0, 1fr)`,
      }
    : {
        gridTemplateRows: 'auto auto',
      }

  return (
    <div className="ViewportOverlayWidget RadioPanelHost">
      <ViewportOverlayToolPanel
        className="RadioPanel RadioPanel--merged"
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
        <div
          ref={bodyRef}
          className={`RadioPanelBody ${hasResizableSplit ? 'hasResizableSplit' : ''}`}
          style={radioPanelBodyStyle}
        >
          <ViewportOverlayToolSection
            className="RadioPanelMergedSection"
            label={
              <button
                type="button"
                className="RadioPanelSectionToggle"
                onClick={() => setRadioToolbarSectionExpanded(!isRadioToolbarSectionExpanded)}
                aria-expanded={isRadioToolbarSectionExpanded}
              >
                <span
                  className={`RadioPanelSectionChevron ${
                    isRadioToolbarSectionExpanded ? 'isExpanded' : ''
                  }`}
                  aria-hidden="true"
                >
                  {'>'}
                </span>
                <span>Radio</span>
                <span className="RadioPanelSectionSummary">{transportDisplay}</span>
              </button>
            }
          >
            {isRadioToolbarSectionExpanded ? (
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
                    value={normalizedTransportSliderValue}
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
                <RadioWaveformStrip
                  waveform={radioWaveform}
                  transport={radioTransport}
                  stepMarkers={visibleSamplerMarkers}
                  activeStepIndex={samplerPlayheadStepIndex}
                />
                {!radioTransport.isSeekable ? (
                  <div className="RadioPanelHint">Seek is unavailable for the current radio source.</div>
                ) : null}
                {radioRuntimeMessage !== null ? (
                  <div className="RadioPanelHint">{radioRuntimeMessage}</div>
                ) : null}
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
                    onClick={randomizeSampleTimes}
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
            ) : null}
          </ViewportOverlayToolSection>

          {hasResizableSplit ? (
            <div
              className="RadioPanelSplitHandle"
              onPointerDown={handleSectionSplitPointerDown}
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize radio and sampler sections"
            >
              <div className="RadioPanelSplitRule" />
            </div>
          ) : null}

          <ViewportOverlayToolSection
            className="RadioPanelMergedSection"
            label={
              <button
                type="button"
                className="RadioPanelSectionToggle"
                onClick={() => setSamplerToolbarSectionExpanded(!isSamplerToolbarSectionExpanded)}
                aria-expanded={isSamplerToolbarSectionExpanded}
              >
                <span
                  className={`RadioPanelSectionChevron ${
                    isSamplerToolbarSectionExpanded ? 'isExpanded' : ''
                  }`}
                  aria-hidden="true"
                >
                  {'>'}
                </span>
                <span>Sampler</span>
                <span className="RadioPanelSectionSummary">
                  {enabledStepCount}/{samplerSteps.length} Steps
                </span>
              </button>
            }
          >
            {isSamplerToolbarSectionExpanded ? (
              <div className="RadioPanelSectionBody RadioPanelSamplerBody">
                <div className="AudioSamplerPanelActionsRow">
                  <button
                    type="button"
                    className={`AudioSamplerPanelActionButton ${samplerIsPlaying ? 'isActive' : ''}`}
                    onClick={() => {
                      if (!isRadioEnabled) {
                        return
                      }
                      playSampler()
                    }}
                    disabled={!isRadioEnabled}
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    className={`AudioSamplerPanelActionButton ${!samplerIsPlaying ? 'isActive' : ''}`}
                    onClick={stopSampler}
                  >
                    Stop
                  </button>
                  <button
                    type="button"
                    className="AudioSamplerPanelActionButton"
                    onClick={rerollAllSamplerSteps}
                  >
                    Reroll All
                  </button>
                </div>
                <div className="AudioSamplerPanelSliderGrid">
                  <ParaSlider
                    label="Steps"
                    displayLabel="Step Count"
                    displayValue={`${samplerStepCount}`}
                    value={stepCountSliderValue}
                    min={0}
                    max={SAMPLER_STEP_COUNT_OPTIONS.length - 1}
                    step={1}
                    hideCaps
                    onChange={(nextValue) => {
                      const nextIndex = clamp(
                        Math.round(nextValue),
                        0,
                        SAMPLER_STEP_COUNT_OPTIONS.length - 1,
                      )
                      setSamplerStepCount(SAMPLER_STEP_COUNT_OPTIONS[nextIndex] ?? 16)
                    }}
                  />
                  <ParaSlider
                    label="BPM"
                    displayLabel="BPM"
                    displayValue={`${samplerBpm}`}
                    value={samplerBpm}
                    min={40}
                    max={180}
                    step={1}
                    hideCaps
                    onChange={(nextValue) => {
                      setSamplerBpm(nextValue)
                    }}
                  />
                </div>
                <div className="AudioSamplerPanelStepsRow" data-step-count={samplerSteps.length}>
                  {samplerSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`AudioSamplerStepCell ${
                        step.enabled ? 'isEnabled' : 'isDisabled'
                      } ${samplerPlayheadStepIndex === index ? 'isActive' : ''} ${
                        step.isLocked ? 'isLocked' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className="AudioSamplerStepMain"
                        onClick={() => toggleSamplerStepEnabled(step.id)}
                        title={step.enabled ? 'Disable step' : 'Enable step'}
                      >
                        <span className="AudioSamplerStepIndex">{index + 1}</span>
                        <span className="AudioSamplerStepCue">
                          {Math.round(step.cueRatio * 100)}%
                        </span>
                      </button>
                      <div className="AudioSamplerStepControlsRow">
                        <button
                          type="button"
                          className="AudioSamplerStepReroll"
                          onClick={() => rerollSamplerStep(step.id)}
                          title="Reroll step cue"
                        >
                          R
                        </button>
                        <button
                          type="button"
                          className={`AudioSamplerStepLock ${step.isLocked ? 'isActive' : ''}`}
                          onClick={() => toggleSamplerStepLocked(step.id)}
                          title={step.isLocked ? 'Unlock step cue' : 'Lock step cue'}
                        >
                          L
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="RadioPanelNestedSection">
                  <button
                    type="button"
                    className="RadioPanelSectionToggle RadioPanelSectionToggle--nested"
                    onClick={() => setSamplerStepsSectionExpanded(!isSamplerStepsSectionExpanded)}
                    aria-expanded={isSamplerStepsSectionExpanded}
                  >
                    <span
                      className={`RadioPanelSectionChevron ${
                        isSamplerStepsSectionExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      {'>'}
                    </span>
                    <span>Step Details</span>
                    <span className="RadioPanelSectionSummary">
                      {enabledStepCount}/{samplerSteps.length} Enabled
                    </span>
                  </button>
                  {isSamplerStepsSectionExpanded ? (
                    <div className="RadioPanelStepList">
                      {samplerSteps.map((step, index) => {
                        const isStepExpanded = expandedSamplerStepIds.includes(step.id)
                        const cueDisplay = formatCueDisplay(
                          step.cueRatio,
                          radioTransport.durationSec,
                        )
                        const fadeInDisplay = formatSecondsDisplay(step.fadeInSec)
                        const fadeOutDisplay = formatSecondsDisplay(step.fadeOutSec)
                        const startScoochDisplay = formatSecondsDisplay(step.startScoochSec)
                        const endScoochDisplay = formatSecondsDisplay(step.endScoochSec)
                        return (
                          <div key={step.id} className="RadioPanelStepDetailCard">
                            <div className="RadioPanelStepSummaryRow">
                              <button
                                type="button"
                                className="RadioPanelStepToggle"
                                onClick={() => toggleSamplerStepExpanded(step.id)}
                                aria-expanded={isStepExpanded}
                              >
                                <span
                                  className={`RadioPanelSectionChevron ${
                                    isStepExpanded ? 'isExpanded' : ''
                                  }`}
                                  aria-hidden="true"
                                >
                                  {'>'}
                                </span>
                                <span className="RadioPanelStepTitle">Step {index + 1}</span>
                                <span className="RadioPanelStepSummaryText">{cueDisplay}</span>
                              </button>
                              <div className="RadioPanelStepSummaryActions">
                                <button
                                  type="button"
                                  className={`RadioPanelActionButton ${
                                    step.enabled ? 'isActive' : ''
                                  }`}
                                  onClick={() => toggleSamplerStepEnabled(step.id)}
                                >
                                  {step.enabled ? 'Enabled' : 'Disabled'}
                                </button>
                                <button
                                  type="button"
                                  className="RadioPanelActionButton"
                                  onClick={() => {
                                    requestSamplerStepPreview(step.id)
                                  }}
                                >
                                  Play
                                </button>
                                <button
                                  type="button"
                                  className="RadioPanelActionButton"
                                  onClick={() => rerollSamplerStep(step.id)}
                                >
                                  Reroll
                                </button>
                                <button
                                  type="button"
                                  className={`RadioPanelActionButton ${
                                    step.isLocked ? 'isActive' : ''
                                  }`}
                                  onClick={() => toggleSamplerStepLocked(step.id)}
                                >
                                  {step.isLocked ? 'Locked' : 'Lock'}
                                </button>
                              </div>
                            </div>
                            {isStepExpanded ? (
                              <div className="RadioPanelStepDetailBody">
                                <div
                                  className={`RadioPanelSliderShell ${
                                    step.isLocked ? 'isDisabled' : ''
                                  }`}
                                >
                                  <ParaSlider
                                    label={`Step ${index + 1} Time Position`}
                                    displayLabel={`Step ${index + 1} Time Position`}
                                    displayValue={cueDisplay}
                                    value={step.cueRatio}
                                    min={0}
                                    max={1}
                                    step={0.001}
                                    hideCaps
                                    onChange={(nextValue) => {
                                      if (step.isLocked) {
                                        return
                                      }
                                      setSamplerStepCueRatio(step.id, nextValue)
                                    }}
                                    onChangeEnd={() => {
                                      if (step.isLocked) {
                                        return
                                      }
                                      requestSamplerStepPreview(step.id)
                                    }}
                                  />
                                </div>
                                <ParaSlider
                                  label={`Step ${index + 1} Fade In`}
                                  displayLabel={`Step ${index + 1} Fade In`}
                                  displayValue={fadeInDisplay}
                                  value={step.fadeInSec}
                                  min={0}
                                  max={samplerStepDurationSec}
                                  step={0.001}
                                  hideCaps
                                  onChange={(nextValue) => {
                                    setSamplerStepPlaybackShape(step.id, {
                                      fadeInSec: nextValue,
                                    })
                                  }}
                                />
                                <ParaSlider
                                  label={`Step ${index + 1} Fade Out`}
                                  displayLabel={`Step ${index + 1} Fade Out`}
                                  displayValue={fadeOutDisplay}
                                  value={step.fadeOutSec}
                                  min={0}
                                  max={samplerStepDurationSec}
                                  step={0.001}
                                  hideCaps
                                  onChange={(nextValue) => {
                                    setSamplerStepPlaybackShape(step.id, {
                                      fadeOutSec: nextValue,
                                    })
                                  }}
                                />
                                <ParaSlider
                                  label={`Step ${index + 1} Start Scooch`}
                                  displayLabel={`Step ${index + 1} Start Scooch`}
                                  displayValue={startScoochDisplay}
                                  value={step.startScoochSec}
                                  min={0}
                                  max={samplerStepDurationSec}
                                  step={0.001}
                                  hideCaps
                                  onChange={(nextValue) => {
                                    setSamplerStepPlaybackShape(step.id, {
                                      startScoochSec: nextValue,
                                    })
                                  }}
                                  onChangeEnd={() => {
                                    requestSamplerStepPreview(step.id)
                                  }}
                                />
                                <ParaSlider
                                  label={`Step ${index + 1} End Scooch`}
                                  displayLabel={`Step ${index + 1} End Scooch`}
                                  displayValue={endScoochDisplay}
                                  value={step.endScoochSec}
                                  min={0}
                                  max={samplerStepDurationSec}
                                  step={0.001}
                                  hideCaps
                                  onChange={(nextValue) => {
                                    setSamplerStepPlaybackShape(step.id, {
                                      endScoochSec: nextValue,
                                    })
                                  }}
                                  onChangeEnd={() => {
                                    requestSamplerStepPreview(step.id)
                                  }}
                                />
                                <div className="RadioPanelStepMetaGrid">
                                  <div className="RadioPanelField">
                                    <span className="RadioPanelFieldLabel">Cue Position</span>
                                    <span className="RadioPanelFieldValue">{cueDisplay}</span>
                                  </div>
                                  <div className="RadioPanelField">
                                    <span className="RadioPanelFieldLabel">Enabled</span>
                                    <span className="RadioPanelFieldValue">
                                      {step.enabled ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                  <div className="RadioPanelField">
                                    <span className="RadioPanelFieldLabel">Locked</span>
                                    <span className="RadioPanelFieldValue">
                                      {step.isLocked ? 'Yes' : 'No'}
                                    </span>
                                  </div>
                                  <div className="RadioPanelField">
                                    <span className="RadioPanelFieldLabel">Step Length</span>
                                    <span className="RadioPanelFieldValue">
                                      {formatSecondsDisplay(samplerStepDurationSec)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="AudioSamplerPanelNoteRepeat">
                  <div className="AudioSamplerPanelActionsRow">
                    <button
                      type="button"
                      className={`AudioSamplerPanelActionButton ${
                        samplerNoteRepeat.enabled ? 'isActive' : ''
                      }`}
                      onClick={() => setSamplerNoteRepeatEnabled(!samplerNoteRepeat.enabled)}
                    >
                      Note Repeat
                    </button>
                  </div>
                  <div className="AudioSamplerPanelSliderGrid">
                    <ParaSlider
                      label="Count"
                      displayLabel="Repeat Count"
                      displayValue={`${samplerNoteRepeat.count}`}
                      value={repeatCountSliderValue}
                      min={0}
                      max={SAMPLER_NOTE_REPEAT_OPTIONS.length - 1}
                      step={1}
                      hideCaps
                      onChange={(nextValue) => {
                        const nextIndex = clamp(
                          Math.round(nextValue),
                          0,
                          SAMPLER_NOTE_REPEAT_OPTIONS.length - 1,
                        )
                        setSamplerNoteRepeatCount(SAMPLER_NOTE_REPEAT_OPTIONS[nextIndex] ?? 1)
                      }}
                    />
                    <ParaSlider
                      label="Rate"
                      displayLabel="Repeat Rate"
                      displayValue={`${samplerNoteRepeat.rate}x`}
                      value={repeatRateSliderValue}
                      min={0}
                      max={SAMPLER_NOTE_REPEAT_OPTIONS.length - 1}
                      step={1}
                      hideCaps
                      onChange={(nextValue) => {
                        const nextIndex = clamp(
                          Math.round(nextValue),
                          0,
                          SAMPLER_NOTE_REPEAT_OPTIONS.length - 1,
                        )
                        setSamplerNoteRepeatRate(SAMPLER_NOTE_REPEAT_OPTIONS[nextIndex] ?? 1)
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </ViewportOverlayToolSection>
        </div>
      </ViewportOverlayToolPanel>
    </div>
  )
}

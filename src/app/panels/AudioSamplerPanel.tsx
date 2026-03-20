import {
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
import {
  SAMPLER_NOTE_REPEAT_OPTIONS,
  SAMPLER_STEP_COUNT_OPTIONS,
} from '../../runtime/audio/TimelineTransport'

type PanelPosition = {
  x: number
  y: number
}

type PanelSize = {
  width: number
  height: number
}

const DEFAULT_PANEL_WIDTH = 620
const DEFAULT_PANEL_HEIGHT = 320
const PANEL_MIN_WIDTH = 480
const PANEL_MIN_HEIGHT = 240
const PANEL_MARGIN = 16

const getDefaultPanelPosition = (): PanelPosition => {
  if (typeof window === 'undefined') {
    return { x: 24, y: 480 }
  }
  return {
    x: 24,
    y: Math.max(160, window.innerHeight - DEFAULT_PANEL_HEIGHT - 120),
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

const formatRuntimeStatus = (status: string): string =>
  status.replace(/-/g, ' ').replace(/\b\w/g, (token) => token.toUpperCase())

export function AudioSamplerPanel() {
  const isRadioEnabled = useAudioSamplerStore((state) => state.isRadioEnabled)
  const sourceUrl = useAudioSamplerStore((state) => state.sourceUrl)
  const radioRuntimeStatus = useAudioSamplerStore((state) => state.radioRuntimeStatus)
  const radioRuntimeSourceKind = useAudioSamplerStore((state) => state.radioRuntimeSourceKind)
  const samplerStepCount = useAudioSamplerStore((state) => state.samplerStepCount)
  const samplerBpm = useAudioSamplerStore((state) => state.samplerBpm)
  const samplerIsPlaying = useAudioSamplerStore((state) => state.samplerIsPlaying)
  const samplerPlayheadStepIndex = useAudioSamplerStore((state) => state.samplerPlayheadStepIndex)
  const samplerSteps = useAudioSamplerStore((state) => state.samplerSteps)
  const samplerNoteRepeat = useAudioSamplerStore((state) => state.samplerNoteRepeat)
  const setSamplerStepCount = useAudioSamplerStore((state) => state.setSamplerStepCount)
  const setSamplerBpm = useAudioSamplerStore((state) => state.setSamplerBpm)
  const playSampler = useAudioSamplerStore((state) => state.playSampler)
  const stopSampler = useAudioSamplerStore((state) => state.stopSampler)
  const rerollSamplerStep = useAudioSamplerStore((state) => state.rerollSamplerStep)
  const rerollAllSamplerSteps = useAudioSamplerStore((state) => state.rerollAllSamplerSteps)
  const toggleSamplerStepEnabled = useAudioSamplerStore((state) => state.toggleSamplerStepEnabled)
  const setSamplerNoteRepeatEnabled = useAudioSamplerStore((state) => state.setSamplerNoteRepeatEnabled)
  const setSamplerNoteRepeatCount = useAudioSamplerStore((state) => state.setSamplerNoteRepeatCount)
  const setSamplerNoteRepeatRate = useAudioSamplerStore((state) => state.setSamplerNoteRepeatRate)
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

  return (
    <div className="ViewportOverlayWidget AudioSamplerPanelHost">
      <ViewportOverlayToolPanel
        className="AudioSamplerPanel"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        title="Sampler"
        titleMeta={`${formatRuntimeStatus(radioRuntimeStatus)} | ${radioRuntimeSourceKind}`}
        onTitleBarPointerDown={handleTitleBarPointerDown}
        onResizeHandlePointerDown={handleResizePointerDown}
      >
        <ViewportOverlayToolSplitLayout
          className="AudioSamplerPanelSplitLayout"
          defaultTopHeight={124}
          top={
            <ViewportOverlayToolSection label="Transport">
              <div className="AudioSamplerPanelSectionBody">
                <div className="AudioSamplerPanelStatusRow">
                  <div className="AudioSamplerPanelField">
                    <span className="AudioSamplerPanelFieldLabel">Source</span>
                    <span className="AudioSamplerPanelFieldValue" title={sourceUrl}>
                      {sourceUrl}
                    </span>
                  </div>
                  <div className="AudioSamplerPanelField">
                    <span className="AudioSamplerPanelFieldLabel">Status</span>
                    <span className="AudioSamplerPanelFieldValue">
                      {formatRuntimeStatus(radioRuntimeStatus)}
                    </span>
                  </div>
                </div>
                <div className="AudioSamplerPanelActionsRow">
                  <button
                    type="button"
                    className={`AudioSamplerPanelActionButton ${
                      samplerIsPlaying ? 'isActive' : ''
                    }`}
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
                    className={`AudioSamplerPanelActionButton ${
                      !samplerIsPlaying ? 'isActive' : ''
                    }`}
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
              </div>
            </ViewportOverlayToolSection>
          }
          bottom={
            <ViewportOverlayToolSection label="Pattern">
              <div className="AudioSamplerPanelSectionBody">
                <div className="AudioSamplerPanelStepsRow" data-step-count={samplerSteps.length}>
                  {samplerSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`AudioSamplerStepCell ${
                        step.enabled ? 'isEnabled' : 'isDisabled'
                      } ${samplerPlayheadStepIndex === index ? 'isActive' : ''}`}
                    >
                      <button
                        type="button"
                        className="AudioSamplerStepMain"
                        onClick={() => toggleSamplerStepEnabled(step.id)}
                        title={step.enabled ? 'Disable step' : 'Enable step'}
                      >
                        <span className="AudioSamplerStepIndex">{index + 1}</span>
                        <span className="AudioSamplerStepCue">{Math.round(step.cueRatio * 100)}%</span>
                      </button>
                      <button
                        type="button"
                        className="AudioSamplerStepReroll"
                        onClick={() => rerollSamplerStep(step.id)}
                        title="Reroll step cue"
                      >
                        R
                      </button>
                    </div>
                  ))}
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
            </ViewportOverlayToolSection>
          }
        />
      </ViewportOverlayToolPanel>
    </div>
  )
}

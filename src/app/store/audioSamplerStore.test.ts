import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
  DEFAULT_RADIO_SAMPLE_BURST_TIME,
  DEFAULT_RADIO_URL,
  RADIO_SUPPORT_PROFILE,
  resetAudioSamplerStore,
  useAudioSamplerStore,
} from './audioSamplerStore'

describe('audioSamplerStore', () => {
  beforeEach(() => {
    resetAudioSamplerStore()
  })

  it('starts with the default radio settings', () => {
    const state = useAudioSamplerStore.getState()

    expect(state.isRadioEnabled).toBe(false)
    expect(state.sourceUrl).toBe(DEFAULT_RADIO_URL)
    expect(state.sampleBurstTime).toBe(DEFAULT_RADIO_SAMPLE_BURST_TIME)
    expect(state.latestBurstRequest).toBeNull()
    expect(state.radioRuntimeStatus).toBe('idle')
    expect(state.radioRuntimeSourceKind).toBe('none')
    expect(state.isRadioToolbarOpen).toBe(false)
    expect(state.radioTransport).toEqual({
      currentTimeSec: 0,
      durationSec: 0,
      isSeekable: false,
      isPlaying: false,
    })
    expect(state.radioWaveform).toEqual({
      kind: 'none',
      sourceId: null,
      sourceKind: 'none',
      durationSec: 0,
      sampleCount: DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
      samples: [],
      message: null,
      lastResolvedAt: null,
    })
    expect(state.latestSeekRequest).toBeNull()
    expect(state.latestReloadRequestId).toBeNull()
    expect(state.latestSamplerStepPreviewRequest).toBeNull()
    expect(state.samplerStepCount).toBe(16)
    expect(state.samplerBpm).toBe(96)
    expect(state.samplerIsPlaying).toBe(false)
    expect(state.samplerPlayheadStepIndex).toBeNull()
    expect(state.samplerSteps).toHaveLength(16)
    expect(state.samplerSteps[0]?.isLocked).toBe(false)
    expect(state.samplerSteps[0]?.fadeInSec).toBe(0)
    expect(state.samplerSteps[0]?.fadeOutSec).toBe(0)
    expect(state.samplerSteps[0]?.startScoochSec).toBe(0)
    expect(state.samplerSteps[0]?.endScoochSec).toBe(0)
    expect(state.samplerNoteRepeat).toEqual({
      enabled: false,
      count: 1,
      rate: 1,
    })
    expect(state.isRadioToolbarSectionExpanded).toBe(true)
    expect(state.isSamplerToolbarSectionExpanded).toBe(true)
    expect(state.isSamplerStepsSectionExpanded).toBe(false)
    expect(state.expandedSamplerStepIds).toEqual([])
    expect(state.lastHandledSamplerStepPreviewRequestId).toBeNull()
  })

  it('turns radio on when a custom url is set', () => {
    useAudioSamplerStore.getState().setRadioUrl('https://soundcloud.com/example/track')

    const state = useAudioSamplerStore.getState()
    expect(state.isRadioEnabled).toBe(true)
    expect(state.sourceUrl).toBe('https://soundcloud.com/example/track')
  })

  it('keeps radio classified as an optional background-runtime seam outside workspace surfaces', () => {
    expect(RADIO_SUPPORT_PROFILE).toEqual({
      classification: 'optional-background-runtime',
      label: 'Optional Background Runtime',
      requiresWorkspaceSurface: false,
    })
  })

  it('keeps sample positions stable until randomize is called', () => {
    const first = useAudioSamplerStore.getState().ensureSamplePosition('Console.Command.Help')
    const second = useAudioSamplerStore.getState().ensureSamplePosition('Console.Command.Help')
    const other = useAudioSamplerStore.getState().ensureSamplePosition('Console.Command.Status')

    expect(first).toBe(second)
    expect(first).not.toBe(other)

    useAudioSamplerStore.getState().randomizeSampleTimes()

    const randomized = useAudioSamplerStore.getState().ensureSamplePosition('Console.Command.Help')
    expect(randomized).not.toBe(first)
  })

  it('does not publish burst requests while radio is disabled', () => {
    const request = useAudioSamplerStore
      .getState()
      .requestRadioBurst('Console.Radio.On', 'enter')

    expect(request).toBeNull()
    expect(useAudioSamplerStore.getState().latestBurstRequest).toBeNull()
  })

  it('publishes canonical burst requests with the current radio settings once enabled', () => {
    useAudioSamplerStore.getState().setRadioUrl('https://soundcloud.com/example/trigger-track')

    const request = useAudioSamplerStore
      .getState()
      .requestRadioBurst('Console.Radio.Url.PromptSubmit', 'enter')

    expect(request).not.toBeNull()
    expect(request?.requestId).toBe(1)
    expect(request?.commandIdentity).toBe('Console.Radio.Url.PromptSubmit')
    expect(request?.sourceUrl).toBe('https://soundcloud.com/example/trigger-track')
    expect(request?.sampleBurstTime).toBe(DEFAULT_RADIO_SAMPLE_BURST_TIME)
    expect(request?.triggerKind).toBe('enter')
    expect(request?.samplePosition).toBe(
      useAudioSamplerStore
        .getState()
        .samplePositionByCommandId['Console.Radio.Url.PromptSubmit'],
    )
    expect(useAudioSamplerStore.getState().latestBurstRequest).toEqual(request)
  })

  it('reuses the same sample position across repeated burst requests for the same identity', () => {
    useAudioSamplerStore.getState().turnRadioOn()

    const firstRequest = useAudioSamplerStore
      .getState()
      .requestRadioBurst('Console.Graph.Sketch', 'arrowDown')
    const secondRequest = useAudioSamplerStore
      .getState()
      .requestRadioBurst('Console.Graph.Sketch', 'arrowUp')

    expect(firstRequest).not.toBeNull()
    expect(secondRequest).not.toBeNull()
    expect(firstRequest?.samplePosition).toBe(secondRequest?.samplePosition)
    expect(secondRequest?.requestId).toBe((firstRequest?.requestId ?? 0) + 1)
  })

  it('tracks runtime status and the last handled request id for the playback bridge', () => {
    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: 'fallback',
      message: 'Using fallback generated tone',
      sourceKind: 'generated-tone',
    })
    useAudioSamplerStore.getState().markRadioBurstHandled(3)

    const state = useAudioSamplerStore.getState()
    expect(state.radioRuntimeStatus).toBe('fallback')
    expect(state.radioRuntimeMessage).toBe('Using fallback generated tone')
    expect(state.radioRuntimeSourceKind).toBe('generated-tone')
    expect(state.lastHandledBurstRequestId).toBe(3)
  })

  it('stores and clears canonical radio waveform state', () => {
    useAudioSamplerStore.getState().setRadioWaveformState({
      kind: 'limited',
      sourceId: 'radio-soundcloud:test',
      sourceKind: 'soundcloud-widget',
      durationSec: 120,
      sampleCount: 128,
      samples: [],
      message: 'Detailed waveform unavailable for current source',
      lastResolvedAt: 1234,
    })

    expect(useAudioSamplerStore.getState().radioWaveform).toMatchObject({
      kind: 'limited',
      sourceId: 'radio-soundcloud:test',
      sourceKind: 'soundcloud-widget',
      durationSec: 120,
      sampleCount: 128,
      message: 'Detailed waveform unavailable for current source',
      lastResolvedAt: 1234,
    })

    useAudioSamplerStore.getState().clearRadioWaveformState()

    expect(useAudioSamplerStore.getState().radioWaveform).toEqual({
      kind: 'none',
      sourceId: null,
      sourceKind: 'none',
      durationSec: 0,
      sampleCount: DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
      samples: [],
      message: null,
      lastResolvedAt: null,
    })
  })

  it('tracks toolbar visibility, transport state, seek requests, and reload requests', () => {
    useAudioSamplerStore.getState().openRadioToolbar()
    useAudioSamplerStore.getState().setRadioTransportState({
      currentTimeSec: 12,
      durationSec: 120,
      isSeekable: true,
      isPlaying: true,
    })

    const seekRequest = useAudioSamplerStore.getState().requestRadioSeek(33.5)
    const reloadRequestId = useAudioSamplerStore.getState().requestRadioReload()
    useAudioSamplerStore.getState().markRadioSeekHandled(seekRequest?.requestId ?? null)
    useAudioSamplerStore.getState().markRadioReloadHandled(reloadRequestId)
    useAudioSamplerStore.getState().closeRadioToolbar()

    const state = useAudioSamplerStore.getState()
    expect(state.isRadioToolbarOpen).toBe(false)
    expect(state.radioTransport).toEqual({
      currentTimeSec: 12,
      durationSec: 120,
      isSeekable: true,
      isPlaying: true,
    })
    expect(seekRequest).toEqual({
      requestId: 1,
      timeSec: 33.5,
    })
    expect(state.lastHandledSeekRequestId).toBe(1)
    expect(reloadRequestId).toBe(1)
    expect(state.lastHandledReloadRequestId).toBe(1)
  })

  it('publishes sampler step preview requests only when radio is enabled', () => {
    const firstStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''

    expect(useAudioSamplerStore.getState().requestSamplerStepPreview(firstStepId)).toBeNull()

    useAudioSamplerStore.getState().turnRadioOn()
    const previewRequest = useAudioSamplerStore.getState().requestSamplerStepPreview(firstStepId)
    useAudioSamplerStore.getState().markSamplerStepPreviewHandled(previewRequest?.requestId ?? null)

    expect(previewRequest).toEqual({
      requestId: 1,
      stepId: firstStepId,
      cueRatio: useAudioSamplerStore.getState().samplerSteps[0]?.cueRatio,
    })
    expect(useAudioSamplerStore.getState().lastHandledSamplerStepPreviewRequestId).toBe(1)
  })

  it('tracks merged toolbar disclosure state in the canonical store', () => {
    const firstStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''

    useAudioSamplerStore.getState().setRadioToolbarSectionExpanded(false)
    useAudioSamplerStore.getState().setSamplerToolbarSectionExpanded(false)
    useAudioSamplerStore.getState().setSamplerStepsSectionExpanded(true)
    useAudioSamplerStore.getState().toggleSamplerStepExpanded(firstStepId)
    useAudioSamplerStore.getState().toggleSamplerStepExpanded(firstStepId)
    useAudioSamplerStore.getState().toggleSamplerStepExpanded(firstStepId)

    const state = useAudioSamplerStore.getState()
    expect(state.isRadioToolbarSectionExpanded).toBe(false)
    expect(state.isSamplerToolbarSectionExpanded).toBe(false)
    expect(state.isSamplerStepsSectionExpanded).toBe(true)
    expect(state.expandedSamplerStepIds).toEqual([firstStepId])
  })

  it('resizes sampler steps while preserving leading cues and rerolls individual or all step cues', () => {
    const initialSteps = useAudioSamplerStore.getState().samplerSteps
    const firstCue = initialSteps[0]?.cueRatio
    const secondCue = initialSteps[1]?.cueRatio

    useAudioSamplerStore.getState().setSamplerStepCount(8)
    expect(useAudioSamplerStore.getState().samplerSteps).toHaveLength(8)
    expect(useAudioSamplerStore.getState().samplerSteps[0]?.cueRatio).toBe(firstCue)
    expect(useAudioSamplerStore.getState().samplerSteps[1]?.cueRatio).toBe(secondCue)

    useAudioSamplerStore.getState().setSamplerStepCount(32)
    expect(useAudioSamplerStore.getState().samplerSteps).toHaveLength(32)
    expect(useAudioSamplerStore.getState().samplerSteps[0]?.cueRatio).toBe(firstCue)

    const targetStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''
    useAudioSamplerStore.getState().rerollSamplerStep(targetStepId)
    const rerolledCue = useAudioSamplerStore.getState().samplerSteps[0]?.cueRatio
    expect(rerolledCue).not.toBe(firstCue)

    const beforeRerollAll = useAudioSamplerStore.getState().samplerSteps.map((step) => step.cueRatio)
    useAudioSamplerStore.getState().rerollAllSamplerSteps()
    const afterRerollAll = useAudioSamplerStore.getState().samplerSteps.map((step) => step.cueRatio)
    expect(afterRerollAll).not.toEqual(beforeRerollAll)
  })

  it('keeps locked sampler steps fixed across reroll and direct cue edits', () => {
    const [firstStep, secondStep] = useAudioSamplerStore.getState().samplerSteps
    const firstStepId = firstStep?.id ?? ''
    const secondStepId = secondStep?.id ?? ''
    const firstCue = firstStep?.cueRatio
    const secondCue = secondStep?.cueRatio

    useAudioSamplerStore.getState().toggleSamplerStepLocked(firstStepId)
    useAudioSamplerStore.getState().rerollSamplerStep(firstStepId)
    useAudioSamplerStore.getState().setSamplerStepCueRatio(firstStepId, 0.8123)
    useAudioSamplerStore.getState().rerollAllSamplerSteps()

    const state = useAudioSamplerStore.getState()
    expect(state.samplerSteps[0]?.isLocked).toBe(true)
    expect(state.samplerSteps[0]?.cueRatio).toBe(firstCue)
    expect(state.samplerSteps[1]?.cueRatio).not.toBe(secondCue)

    useAudioSamplerStore.getState().toggleSamplerStepLocked(firstStepId)
    useAudioSamplerStore.getState().setSamplerStepCueRatio(firstStepId, 0.8123)
    useAudioSamplerStore.getState().rerollSamplerStep(secondStepId)

    const unlockedState = useAudioSamplerStore.getState()
    expect(unlockedState.samplerSteps[0]?.isLocked).toBe(false)
    expect(unlockedState.samplerSteps[0]?.cueRatio).toBe(0.8123)
    expect(unlockedState.samplerSteps[1]?.cueRatio).not.toBe(secondCue)
  })

  it('updates a step cue ratio directly for the merged toolbar time-position slider', () => {
    const targetStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''

    useAudioSamplerStore.getState().setSamplerStepCueRatio(targetStepId, 0.7321)

    expect(useAudioSamplerStore.getState().samplerSteps[0]?.cueRatio).toBe(0.7321)
  })

  it('stores per-step fade and scooch settings for sampler playback shaping', () => {
    const targetStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''

    useAudioSamplerStore.getState().setSamplerStepPlaybackShape(targetStepId, {
      fadeInSec: 0.05,
      fadeOutSec: 0.07,
      startScoochSec: 0.02,
      endScoochSec: 0.03,
    })

    expect(useAudioSamplerStore.getState().samplerSteps[0]).toMatchObject({
      fadeInSec: 0.05,
      fadeOutSec: 0.07,
      startScoochSec: 0.02,
      endScoochSec: 0.03,
    })
  })

  it('tracks sampler playback, enabled steps, and note-repeat settings', () => {
    const targetStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''

    useAudioSamplerStore.getState().playSampler()
    useAudioSamplerStore.getState().setSamplerPlayheadStepIndex(3)
    useAudioSamplerStore.getState().toggleSamplerStepEnabled(targetStepId)
    useAudioSamplerStore.getState().setSamplerNoteRepeatEnabled(true)
    useAudioSamplerStore.getState().setSamplerNoteRepeatCount(4)
    useAudioSamplerStore.getState().setSamplerNoteRepeatRate(8)
    useAudioSamplerStore.getState().setSamplerBpm(128)
    useAudioSamplerStore.getState().stopSampler()

    const state = useAudioSamplerStore.getState()
    expect(state.samplerBpm).toBe(128)
    expect(state.samplerIsPlaying).toBe(false)
    expect(state.samplerPlayheadStepIndex).toBeNull()
    expect(state.samplerSteps[0]?.enabled).toBe(false)
    expect(state.samplerNoteRepeat).toEqual({
      enabled: true,
      count: 4,
      rate: 8,
    })
  })
})

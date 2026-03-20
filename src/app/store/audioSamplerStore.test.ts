import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_RADIO_SAMPLE_BURST_TIME,
  DEFAULT_RADIO_URL,
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
  })

  it('turns radio on when a custom url is set', () => {
    useAudioSamplerStore.getState().setRadioUrl('https://soundcloud.com/example/track')

    const state = useAudioSamplerStore.getState()
    expect(state.isRadioEnabled).toBe(true)
    expect(state.sourceUrl).toBe('https://soundcloud.com/example/track')
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
})

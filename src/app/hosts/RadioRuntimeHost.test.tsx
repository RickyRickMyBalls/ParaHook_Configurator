// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RadioRuntimeHost } from './RadioRuntimeHost'
import {
  RADIO_SUPPORT_PROFILE,
  resetAudioSamplerStore,
  useAudioSamplerStore,
} from '../store/audioSamplerStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let mockSoundCloudPlaybackMode: 'ready' | 'throw' = 'ready'
const mockSoundCloudEnsureSourceReady = vi.fn(async () => {
  if (mockSoundCloudPlaybackMode === 'throw') {
    throw new Error('SoundCloud playback unavailable')
  }
  return { durationSec: 120 }
})
const mockSoundCloudPlayWindow = vi.fn(async () => {
  if (mockSoundCloudPlaybackMode === 'throw') {
    throw new Error('SoundCloud playback unavailable')
  }
})
const mockSoundCloudGetTransportState = vi.fn(async () => ({
  currentTimeSec: 0,
  durationSec: 120,
  isSeekable: true as const,
  isPlaying: false,
}))
const mockSoundCloudSeekTo = vi.fn(async () => undefined)
const mockSoundCloudStop = vi.fn(() => undefined)
const mockSoundCloudDispose = vi.fn(() => undefined)

vi.mock('../../runtime/audio/SoundCloudWidgetClient', () => ({
  createBrowserSoundCloudWidgetClient: () => ({
    ensureSourceReady: mockSoundCloudEnsureSourceReady,
    getTransportState: mockSoundCloudGetTransportState,
    seekTo: mockSoundCloudSeekTo,
    playWindow: mockSoundCloudPlayWindow,
    stop: mockSoundCloudStop,
    dispose: mockSoundCloudDispose,
  }),
}))

describe('RadioRuntimeHost', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalAudioContext = window.AudioContext

  class MockAudioBuffer {
    public readonly duration = 12
    private readonly channel = new Float32Array(1200)

    public getChannelData(): Float32Array {
      return this.channel
    }
  }

  class MockAudioBufferSource {
    public buffer: MockAudioBuffer | null = null

    public connect(_destination: unknown): void {}

    public disconnect(): void {}

    public start(_when = 0, _offset = 0, _duration = 0): void {}

    public stop(_when = 0): void {}
  }

  class MockAudioContext {
    public readonly state = 'running'
    public readonly currentTime = 0
    public readonly sampleRate = 100
    public readonly destination = {}

    public async resume(): Promise<void> {}

    public createBuffer(
      _channels: number,
      _length: number,
      _sampleRate: number,
    ): MockAudioBuffer {
      return new MockAudioBuffer()
    }

    public createBufferSource(): MockAudioBufferSource {
      return new MockAudioBufferSource()
    }
  }

  const renderHost = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<RadioRuntimeHost />)
    })
  }

  beforeEach(() => {
    resetAudioSamplerStore()
    mockSoundCloudPlaybackMode = 'ready'
    mockSoundCloudEnsureSourceReady.mockClear()
    mockSoundCloudGetTransportState.mockClear()
    mockSoundCloudSeekTo.mockClear()
    mockSoundCloudPlayWindow.mockClear()
    mockSoundCloudStop.mockClear()
    mockSoundCloudDispose.mockClear()
    window.AudioContext = MockAudioContext as unknown as typeof AudioContext
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
    resetAudioSamplerStore()
    window.AudioContext = originalAudioContext
    vi.useRealTimers()
  })

  it('renders the hidden SoundCloud bridge iframe as the optional background-runtime seam', async () => {
    await renderHost()

    const iframe = container?.querySelector('iframe[title="Radio SoundCloud Bridge"]')
    expect(iframe).not.toBeNull()
    expect(iframe?.getAttribute('data-radio-support-classification')).toBe(
      RADIO_SUPPORT_PROFILE.classification,
    )
    expect(iframe?.getAttribute('data-radio-requires-workspace-surface')).toBe('false')
  })

  it('consumes a supported SoundCloud radio burst request through the mounted runtime host', async () => {
    await renderHost()

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().requestRadioBurst('Console.Root.Radio', 'enter')
    })

    expect(useAudioSamplerStore.getState().lastHandledBurstRequestId).toBe(1)
    expect(useAudioSamplerStore.getState().radioRuntimeStatus).toBe('ready')
    expect(useAudioSamplerStore.getState().radioRuntimeSourceKind).toBe('soundcloud-widget')
    expect(useAudioSamplerStore.getState().radioRuntimeMessage).toBeNull()
    expect(mockSoundCloudEnsureSourceReady).toHaveBeenCalledTimes(2)
    expect(mockSoundCloudPlayWindow).toHaveBeenCalledTimes(1)
  })

  it('disposes the audio engine and clears runtime timers on unmount', async () => {
    vi.useFakeTimers()
    await renderHost()

    await act(async () => {
      useAudioSamplerStore.getState().turnRadioOn()
      useAudioSamplerStore.getState().openRadioToolbar()
      useAudioSamplerStore.getState().setSamplerStepCount(4)
      useAudioSamplerStore.getState().setSamplerBpm(120)
      useAudioSamplerStore.getState().playSampler()
    })

    expect(useAudioSamplerStore.getState().samplerPlayheadStepIndex).toBe(0)
    expect(mockSoundCloudPlayWindow.mock.calls.length).toBeGreaterThan(0)

    const transportCallsBeforeUnmount = mockSoundCloudGetTransportState.mock.calls.length
    const playWindowCallsBeforeUnmount = mockSoundCloudPlayWindow.mock.calls.length
    const playheadBeforeUnmount = useAudioSamplerStore.getState().samplerPlayheadStepIndex

    await act(async () => {
      root?.unmount()
    })
    root = null

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(mockSoundCloudStop).toHaveBeenCalled()
    expect(mockSoundCloudDispose).toHaveBeenCalledTimes(1)
    expect(mockSoundCloudGetTransportState.mock.calls.length).toBe(transportCallsBeforeUnmount)
    expect(mockSoundCloudPlayWindow.mock.calls.length).toBe(playWindowCallsBeforeUnmount)
    expect(useAudioSamplerStore.getState().samplerPlayheadStepIndex).toBe(playheadBeforeUnmount)
  })
})

import { describe, expect, it } from 'vitest'
import { AudioEngine } from './AudioEngine'
import {
  createFallbackRadioSourceDescriptor,
  DEFAULT_GUSANO_URL,
  resolveRadioSourceDescriptor,
} from './ClipLibrary'

class FakeAudioBuffer {
  public readonly duration: number
  private readonly channels: Float32Array[]

  public constructor(length: number, sampleRate: number, channelCount: number) {
    this.duration = length / sampleRate
    this.channels = Array.from({ length: channelCount }, () => new Float32Array(length))
  }

  public getChannelData(channel: number): Float32Array {
    return this.channels[channel]!
  }
}

class FakeAudioBufferSourceNode {
  public buffer: FakeAudioBuffer | null = null
  public startCalls: Array<{ when: number; offset: number; duration: number }> = []
  public stopCalls: number[] = []

  public connect(_destination: unknown): void {}
  public disconnect(): void {}

  public start(when = 0, offset = 0, duration = 0): void {
    this.startCalls.push({ when, offset, duration })
  }

  public stop(when = 0): void {
    this.stopCalls.push(when)
  }
}

class FakeAudioContext {
  public state: 'running' | 'suspended' | 'closed'
  public currentTime = 0
  public readonly sampleRate = 100
  public readonly destination = { kind: 'destination' }
  public readonly sources: FakeAudioBufferSourceNode[] = []
  private readonly shouldFailResume: boolean

  public constructor(options: { state?: 'running' | 'suspended' | 'closed'; shouldFailResume?: boolean } = {}) {
    this.state = options.state ?? 'running'
    this.shouldFailResume = options.shouldFailResume ?? false
  }

  public async resume(): Promise<void> {
    if (this.shouldFailResume) {
      throw new Error('Gesture required')
    }
    this.state = 'running'
  }

  public createBuffer(channels: number, length: number, sampleRate: number): FakeAudioBuffer {
    return new FakeAudioBuffer(length, sampleRate, channels)
  }

  public createBufferSource(): FakeAudioBufferSourceNode {
    const source = new FakeAudioBufferSourceNode()
    this.sources.push(source)
    return source
  }
}

describe('AudioEngine', () => {
  it('plays a burst at the requested normalized position and duration', async () => {
    const fakeContext = new FakeAudioContext()
    const engine = new AudioEngine({
      createAudioContext: () => fakeContext,
    })
    const descriptor = createFallbackRadioSourceDescriptor(DEFAULT_GUSANO_URL)

    const playback = await engine.playBurst({
      descriptor,
      normalizedSamplePosition: 0.5,
      sampleBurstTime: 0.25,
    })

    const activeSource = fakeContext.sources.at(-1)
    expect(activeSource?.startCalls).toEqual([
      {
        when: 0,
        offset: 6,
        duration: 0.25,
      },
    ])
    expect(playback).toEqual({
      sourceId: descriptor.sourceId,
      startTimeSec: 6,
      endTimeSec: 6.25,
      durationSec: 0.25,
    })
  })

  it('raises a blocked error when audio resume fails', async () => {
    const engine = new AudioEngine({
      createAudioContext: () => new FakeAudioContext({ state: 'suspended', shouldFailResume: true }),
    })

    await expect(
      engine.ensureSourceReady(createFallbackRadioSourceDescriptor(DEFAULT_GUSANO_URL)),
    ).rejects.toMatchObject({
      name: 'AudioEngineError',
      reason: 'blocked',
    })
  })

  it('uses the injected SoundCloud widget client for supported real-link playback', async () => {
    const soundCloudClient = {
      ensureSourceReady: async () => ({ durationSec: 120 }),
      playWindow: async () => undefined,
      stop: () => undefined,
      dispose: () => undefined,
    }
    const engine = new AudioEngine({
      createSoundCloudWidgetClient: () => soundCloudClient,
    })
    const descriptor = resolveRadioSourceDescriptor(DEFAULT_GUSANO_URL)
    if (descriptor.kind !== 'soundcloud-widget') {
      throw new Error('Expected SoundCloud widget descriptor')
    }

    const playback = await engine.playBurst({
      descriptor,
      normalizedSamplePosition: 0.5,
      sampleBurstTime: 0.25,
    })

    expect(playback).toEqual({
      sourceId: descriptor.sourceId,
      startTimeSec: 60,
      endTimeSec: 60.25,
      durationSec: 0.25,
    })
  })
})

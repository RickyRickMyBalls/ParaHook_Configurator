import type {
  GeneratedToneRadioSourceDescriptor,
  RadioSourceDescriptor,
} from './ClipLibrary'
import type { SoundCloudWidgetPlaybackClient } from './SoundCloudWidgetClient'
import { resolveBurstWindow } from './TimelineTransport'

export type AudioEngineErrorReason = 'blocked' | 'unsupported' | 'error'

export class AudioEngineError extends Error {
  public readonly reason: AudioEngineErrorReason

  public constructor(reason: AudioEngineErrorReason, message: string) {
    super(message)
    this.name = 'AudioEngineError'
    this.reason = reason
  }
}

type AudioBufferLike = {
  duration: number
  getChannelData: (channel: number) => Float32Array
}

type AudioBufferSourceNodeLike = {
  buffer: AudioBufferLike | null
  connect: (destination: unknown) => void
  disconnect: () => void
  start: (when?: number, offset?: number, duration?: number) => void
  stop: (when?: number) => void
}

type AudioContextLike = {
  readonly state: 'running' | 'suspended' | 'closed'
  readonly currentTime: number
  readonly sampleRate: number
  readonly destination: unknown
  resume: () => Promise<void>
  createBuffer: (channels: number, length: number, sampleRate: number) => AudioBufferLike
  createBufferSource: () => AudioBufferSourceNodeLike
}

const createBrowserAudioContext = (): AudioContextLike => {
  const AudioContextCtor =
    typeof window !== 'undefined'
      ? (window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
      : undefined

  if (AudioContextCtor === undefined) {
    throw new AudioEngineError('unsupported', 'Web Audio is not available in this environment')
  }

  return new AudioContextCtor() as unknown as AudioContextLike
}

const fillGeneratedToneBuffer = (
  buffer: AudioBufferLike,
  sampleRate: number,
  descriptor: GeneratedToneRadioSourceDescriptor,
): void => {
  const channel = buffer.getChannelData(0)
  const { primaryHz, accentHz, modulationHz } = descriptor.toneProfile
  for (let index = 0; index < channel.length; index += 1) {
    const time = index / sampleRate
    const envelope =
      0.55 +
      0.25 * Math.sin(Math.PI * 2 * modulationHz * time) +
      0.12 * Math.sin(Math.PI * 2 * 0.125 * time)
    const primary = Math.sin(Math.PI * 2 * primaryHz * time)
    const accent = Math.sin(Math.PI * 2 * accentHz * time)
    channel[index] = (0.28 * primary + 0.14 * accent) * envelope
  }
}

export const extractGeneratedToneWaveformEnvelope = (
  descriptor: GeneratedToneRadioSourceDescriptor,
  sampleCount: number,
): number[] => {
  const safeSampleCount = Math.max(1, Math.floor(sampleCount))
  const values = Array.from({ length: safeSampleCount }, (_, bucketIndex) => {
    const startTimeSec = (bucketIndex / safeSampleCount) * descriptor.durationSec
    const endTimeSec = ((bucketIndex + 1) / safeSampleCount) * descriptor.durationSec
    const sampleSpan = Math.max(4, Math.round((endTimeSec - startTimeSec) * 64))
    let peak = 0
    for (let sampleIndex = 0; sampleIndex < sampleSpan; sampleIndex += 1) {
      const ratio = sampleSpan <= 1 ? 0 : sampleIndex / (sampleSpan - 1)
      const time =
        startTimeSec +
        ratio * Math.max(0.0001, endTimeSec - startTimeSec)
      const envelope =
        0.55 +
        0.25 * Math.sin(Math.PI * 2 * descriptor.toneProfile.modulationHz * time) +
        0.12 * Math.sin(Math.PI * 2 * 0.125 * time)
      const primary = Math.sin(Math.PI * 2 * descriptor.toneProfile.primaryHz * time)
      const accent = Math.sin(Math.PI * 2 * descriptor.toneProfile.accentHz * time)
      const amplitude = Math.abs((0.28 * primary + 0.14 * accent) * envelope)
      peak = Math.max(peak, amplitude)
    }
    return Number(Math.min(1, peak / 0.42).toFixed(4))
  })
  return values
}

export type AudioEngineOptions = {
  createAudioContext?: () => AudioContextLike
  createSoundCloudWidgetClient?: () => SoundCloudWidgetPlaybackClient
}

export type AudioEnginePlayback = {
  sourceId: string
  startTimeSec: number
  endTimeSec: number
  durationSec: number
}

export type AudioEngineTransportState = {
  currentTimeSec: number
  durationSec: number
  isSeekable: boolean
  isPlaying: boolean
}

export class AudioEngine {
  private readonly createAudioContext: () => AudioContextLike
  private readonly createSoundCloudWidgetClient: (() => SoundCloudWidgetPlaybackClient) | null
  private audioContext: AudioContextLike | null = null
  private activeDescriptor: RadioSourceDescriptor | null = null
  private activeBuffer: AudioBufferLike | null = null
  private activeSource: AudioBufferSourceNodeLike | null = null
  private soundCloudWidgetClient: SoundCloudWidgetPlaybackClient | null = null
  private fallbackCurrentTimeSec = 0
  private fallbackIsPlaying = false

  public constructor(options: AudioEngineOptions = {}) {
    this.createAudioContext = options.createAudioContext ?? createBrowserAudioContext
    this.createSoundCloudWidgetClient = options.createSoundCloudWidgetClient ?? null
  }

  public async ensureSourceReady(descriptor: RadioSourceDescriptor): Promise<{ durationSec: number }> {
    if (descriptor.kind === 'unsupported-url') {
      throw new AudioEngineError('unsupported', 'Radio URL is not supported for real-link playback')
    }

    if (descriptor.kind === 'soundcloud-widget') {
      const widgetClient = this.getSoundCloudWidgetClient()
      const ready = await widgetClient.ensureSourceReady(descriptor)
      this.activeDescriptor = descriptor
      this.fallbackCurrentTimeSec = 0
      this.fallbackIsPlaying = false
      return {
        durationSec: ready.durationSec,
      }
    }

    if (this.audioContext === null) {
      this.audioContext = this.createAudioContext()
    }

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch (error) {
        throw new AudioEngineError(
          'blocked',
          error instanceof Error ? error.message : 'Audio resume was blocked',
        )
      }
    }

    if (this.audioContext.state !== 'running') {
      throw new AudioEngineError('blocked', 'Audio context is not running')
    }

    if (this.activeDescriptor?.sourceId !== descriptor.sourceId || this.activeBuffer === null) {
      const frameLength = Math.max(
        1,
        Math.round(this.audioContext.sampleRate * descriptor.durationSec),
      )
      const nextBuffer = this.audioContext.createBuffer(1, frameLength, this.audioContext.sampleRate)
      fillGeneratedToneBuffer(nextBuffer, this.audioContext.sampleRate, descriptor)
      this.activeDescriptor = descriptor
      this.activeBuffer = nextBuffer
    }

    return {
      durationSec: this.activeBuffer.duration,
    }
  }

  public async playBurst(input: {
    descriptor: RadioSourceDescriptor
    normalizedSamplePosition: number
    sampleBurstTime: number
    startOffsetSec?: number
    fadeInSec?: number
    fadeOutSec?: number
  }): Promise<AudioEnginePlayback> {
    const ready = await this.ensureSourceReady(input.descriptor)

    this.stopBurst()

    const burstWindow = resolveBurstWindow(
      ready.durationSec,
      input.normalizedSamplePosition,
      input.sampleBurstTime,
      {
        startOffsetSec: input.startOffsetSec,
      },
    )

    if (input.descriptor.kind === 'soundcloud-widget') {
      const widgetClient = this.getSoundCloudWidgetClient()
      await widgetClient.playWindow({
        descriptor: input.descriptor,
        startTimeSec: burstWindow.startTimeSec,
        durationSec: burstWindow.durationSec,
      })
      this.activeDescriptor = input.descriptor
      return {
        sourceId: input.descriptor.sourceId,
        startTimeSec: burstWindow.startTimeSec,
        endTimeSec: burstWindow.endTimeSec,
        durationSec: burstWindow.durationSec,
      }
    }

    if (this.audioContext === null || this.activeBuffer === null) {
      throw new AudioEngineError('error', 'Audio engine was not ready after source preparation')
    }

    const source = this.audioContext.createBufferSource()
    const safeFadeInSec = Math.max(0, Number.isFinite(input.fadeInSec) ? input.fadeInSec ?? 0 : 0)
    const safeFadeOutSec = Math.max(
      0,
      Number.isFinite(input.fadeOutSec) ? input.fadeOutSec ?? 0 : 0,
    )
    if (safeFadeInSec > 0 || safeFadeOutSec > 0) {
      const sourceChannel = this.activeBuffer.getChannelData(0)
      const startSampleIndex = Math.max(
        0,
        Math.round(burstWindow.startTimeSec * this.audioContext.sampleRate),
      )
      const burstSampleLength = Math.max(
        1,
        Math.round(burstWindow.durationSec * this.audioContext.sampleRate),
      )
      const burstBuffer = this.audioContext.createBuffer(
        1,
        burstSampleLength,
        this.audioContext.sampleRate,
      )
      const burstChannel = burstBuffer.getChannelData(0)
      const fadeInSampleLength = Math.max(
        0,
        Math.min(burstSampleLength, Math.round(safeFadeInSec * this.audioContext.sampleRate)),
      )
      const fadeOutSampleLength = Math.max(
        0,
        Math.min(burstSampleLength, Math.round(safeFadeOutSec * this.audioContext.sampleRate)),
      )

      for (let sampleIndex = 0; sampleIndex < burstSampleLength; sampleIndex += 1) {
        const sourceIndex = Math.min(
          sourceChannel.length - 1,
          startSampleIndex + sampleIndex,
        )
        let envelope = 1
        if (fadeInSampleLength > 0) {
          envelope = Math.min(envelope, Math.min(1, sampleIndex / fadeInSampleLength))
        }
        if (fadeOutSampleLength > 0) {
          envelope = Math.min(
            envelope,
            Math.min(1, (burstSampleLength - sampleIndex - 1) / fadeOutSampleLength),
          )
        }
        burstChannel[sampleIndex] = (sourceChannel[sourceIndex] ?? 0) * Math.max(0, envelope)
      }

      source.buffer = burstBuffer
      source.connect(this.audioContext.destination)
      source.start(0, 0, burstWindow.durationSec)
    } else {
      source.buffer = this.activeBuffer
      source.connect(this.audioContext.destination)
      source.start(0, burstWindow.startTimeSec, burstWindow.durationSec)
    }
    this.activeSource = source
    this.activeDescriptor = input.descriptor
    this.fallbackCurrentTimeSec = burstWindow.startTimeSec
    this.fallbackIsPlaying = true

    return {
      sourceId: input.descriptor.sourceId,
      startTimeSec: burstWindow.startTimeSec,
      endTimeSec: burstWindow.endTimeSec,
      durationSec: burstWindow.durationSec,
    }
  }

  public stopBurst(): void {
    this.soundCloudWidgetClient?.stop()
    this.fallbackIsPlaying = false
    if (this.activeSource === null) {
      return
    }
    try {
      this.activeSource.stop(0)
    } catch {
      // Ignore double-stop behavior from the underlying browser node.
    }
    this.activeSource.disconnect()
    this.activeSource = null
  }

  public async getTransportState(
    descriptor: RadioSourceDescriptor,
  ): Promise<AudioEngineTransportState> {
    if (descriptor.kind === 'unsupported-url') {
      return {
        currentTimeSec: 0,
        durationSec: 0,
        isSeekable: false,
        isPlaying: false,
      }
    }

    if (descriptor.kind === 'soundcloud-widget') {
      const widgetClient = this.getSoundCloudWidgetClient()
      this.activeDescriptor = descriptor
      return widgetClient.getTransportState(descriptor)
    }

    const ready = await this.ensureSourceReady(descriptor)
    return {
      currentTimeSec: Math.min(this.fallbackCurrentTimeSec, ready.durationSec),
      durationSec: ready.durationSec,
      isSeekable: false,
      isPlaying: this.fallbackIsPlaying,
    }
  }

  public async seekTo(input: {
    descriptor: RadioSourceDescriptor
    timeSec: number
  }): Promise<AudioEngineTransportState> {
    if (input.descriptor.kind === 'unsupported-url') {
      throw new AudioEngineError('unsupported', 'Radio URL does not support seeking')
    }

    if (input.descriptor.kind === 'soundcloud-widget') {
      const widgetClient = this.getSoundCloudWidgetClient()
      await widgetClient.seekTo({
        descriptor: input.descriptor,
        timeSec: input.timeSec,
      })
      this.activeDescriptor = input.descriptor
      return widgetClient.getTransportState(input.descriptor)
    }

    const ready = await this.ensureSourceReady(input.descriptor)
    this.fallbackCurrentTimeSec = Math.min(Math.max(0, input.timeSec), ready.durationSec)
    this.fallbackIsPlaying = false
    return {
      currentTimeSec: this.fallbackCurrentTimeSec,
      durationSec: ready.durationSec,
      isSeekable: false,
      isPlaying: false,
    }
  }

  public dispose(): void {
    this.stopBurst()
    this.activeBuffer = null
    this.activeDescriptor = null
    this.fallbackCurrentTimeSec = 0
    this.fallbackIsPlaying = false
    this.soundCloudWidgetClient?.dispose()
    this.soundCloudWidgetClient = null
  }

  private getSoundCloudWidgetClient(): SoundCloudWidgetPlaybackClient {
    if (this.soundCloudWidgetClient !== null) {
      return this.soundCloudWidgetClient
    }
    if (this.createSoundCloudWidgetClient === null) {
      throw new AudioEngineError(
        'unsupported',
        'SoundCloud widget playback is not configured in this environment',
      )
    }
    this.soundCloudWidgetClient = this.createSoundCloudWidgetClient()
    return this.soundCloudWidgetClient
  }
}

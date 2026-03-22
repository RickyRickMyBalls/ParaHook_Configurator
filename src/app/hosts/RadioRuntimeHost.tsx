import { useEffect, useRef } from 'react'
import {
  AudioEngine,
  AudioEngineError,
  extractGeneratedToneWaveformEnvelope,
} from '../../runtime/audio/AudioEngine'
import {
  buildSoundCloudPlayerUrl,
  createFallbackRadioSourceDescriptor,
  DEFAULT_GUSANO_URL,
  resolveRadioWaveformCapability,
  resolveRadioSourceDescriptor,
} from '../../runtime/audio/ClipLibrary'
import {
  resolveRepeatOffsetsSec,
  resolveSamplerStepFadeEnvelope,
  resolveSamplerStepPlaybackWindow,
  resolveStepDurationSec,
} from '../../runtime/audio/TimelineTransport'
import { registerRadioRuntimeWarmupHandler } from '../../runtime/audio/radioRuntimeWarmup'
import { createBrowserSoundCloudWidgetClient } from '../../runtime/audio/SoundCloudWidgetClient'
import {
  DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
  useAudioSamplerStore,
  type RadioRuntimeSourceKind,
} from '../store/audioSamplerStore'

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

export function RadioRuntimeHost() {
  const latestRadioBurstRequest = useAudioSamplerStore((state) => state.latestBurstRequest)
  const isRadioEnabled = useAudioSamplerStore((state) => state.isRadioEnabled)
  const isRadioToolbarOpen = useAudioSamplerStore((state) => state.isRadioToolbarOpen)
  const radioSourceUrl = useAudioSamplerStore((state) => state.sourceUrl)
  const radioRuntimeStatus = useAudioSamplerStore((state) => state.radioRuntimeStatus)
  const radioRuntimeSourceKind = useAudioSamplerStore((state) => state.radioRuntimeSourceKind)
  const radioTransport = useAudioSamplerStore((state) => state.radioTransport)
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
  const radioAudioEngineRef = useRef<AudioEngine | null>(null)
  const radioSoundCloudIframeRef = useRef<HTMLIFrameElement | null>(null)
  const lastHandledRadioBurstRequestIdRef = useRef<number | null>(null)
  const lastHandledRadioSeekRequestIdRef = useRef<number | null>(null)
  const lastHandledRadioReloadRequestIdRef = useRef<number | null>(null)
  const lastHandledSamplerStepPreviewRequestIdRef = useRef<number | null>(null)
  const samplerLoopTimeoutRef = useRef<number | null>(null)
  const samplerRepeatTimeoutIdsRef = useRef<number[]>([])

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
    const currentState = useAudioSamplerStore.getState()
    const isAlreadyIdle =
      currentState.radioRuntimeStatus === 'idle' &&
      currentState.radioRuntimeSourceKind === 'none' &&
      currentState.radioRuntimeMessage === null &&
      currentState.radioTransport.currentTimeSec === 0 &&
      currentState.radioTransport.durationSec === 0 &&
      currentState.radioTransport.isSeekable === false &&
      currentState.radioTransport.isPlaying === false &&
      currentState.radioWaveform.kind === 'none'

    if (isAlreadyIdle) {
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
    useAudioSamplerStore.getState().clearRadioWaveformState()
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
    if (!isRadioEnabled) {
      return
    }

    const descriptor = resolveActiveRadioDescriptor(radioSourceUrl, radioRuntimeSourceKind)
    const capability = resolveRadioWaveformCapability(descriptor)
    const now = Date.now()

    if (capability === 'exact' && descriptor.kind === 'generated-tone') {
      useAudioSamplerStore.getState().setRadioWaveformState({
        kind: 'exact',
        sourceId: descriptor.sourceId,
        sourceKind: descriptor.kind,
        durationSec: descriptor.durationSec,
        sampleCount: DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
        samples: extractGeneratedToneWaveformEnvelope(
          descriptor,
          DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
        ),
        message: null,
        lastResolvedAt: now,
      })
      return
    }

    if (capability === 'limited') {
      useAudioSamplerStore.getState().setRadioWaveformState({
        kind: 'limited',
        sourceId: descriptor.sourceId,
        sourceKind: descriptor.kind,
        durationSec: radioTransport.durationSec,
        sampleCount: DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
        samples: [],
        message: 'Detailed waveform unavailable for current source',
        lastResolvedAt: now,
      })
      return
    }

    useAudioSamplerStore.getState().setRadioWaveformState({
      kind: 'none',
      sourceId: descriptor.sourceId,
      sourceKind: descriptor.kind,
      durationSec: 0,
      sampleCount: DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
      samples: [],
      message:
        descriptor.kind === 'unsupported-url'
          ? 'Waveform unavailable for unsupported source'
          : null,
      lastResolvedAt: now,
    })
  }, [isRadioEnabled, radioRuntimeSourceKind, radioSourceUrl, radioTransport.durationSec])

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
      // The helper already reports runtime status honestly.
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
      void engine
        .getTransportState(descriptor)
        .then((transport) => {
          if (cancelled) {
            return
          }
          useAudioSamplerStore.getState().setRadioTransportState(transport)
        })
        .catch(() => {
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

  return (
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
  )
}

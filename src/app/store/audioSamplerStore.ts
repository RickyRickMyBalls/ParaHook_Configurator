import { create } from 'zustand'
import {
  SAMPLER_NOTE_REPEAT_OPTIONS,
  SAMPLER_STEP_COUNT_OPTIONS,
  type SamplerNoteRepeatValue,
  type SamplerStepCount,
} from '../../runtime/audio/TimelineTransport'

export const DEFAULT_RADIO_URL = 'https://soundcloud.com/keota-us/gusano'
export const DEFAULT_RADIO_SAMPLE_BURST_TIME = 0.1
export const DEFAULT_SAMPLER_BPM = 96

const SAMPLE_SLOT_COUNT = 2048

export type RadioBurstTriggerKind = 'enter' | 'arrowUp' | 'arrowDown'

export type RadioBurstRequest = {
  requestId: number
  commandIdentity: string
  samplePosition: number
  sourceUrl: string
  sampleBurstTime: number
  triggerKind: RadioBurstTriggerKind
}

export type RadioRuntimeStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'fallback'
  | 'unsupported'
  | 'blocked'
  | 'error'
export type RadioRuntimeSourceKind =
  | 'none'
  | 'generated-tone'
  | 'soundcloud-widget'
  | 'unsupported-url'

export type RadioTransportState = {
  currentTimeSec: number
  durationSec: number
  isSeekable: boolean
  isPlaying: boolean
}

export type RadioSeekRequest = {
  requestId: number
  timeSec: number
}

export type SamplerStep = {
  id: string
  index: number
  enabled: boolean
  cueRatio: number
}

export type SamplerNoteRepeatState = {
  enabled: boolean
  count: SamplerNoteRepeatValue
  rate: SamplerNoteRepeatValue
}

export type AudioSamplerState = {
  isRadioEnabled: boolean
  isRadioToolbarOpen: boolean
  sourceUrl: string
  sampleBurstTime: number
  samplePositionByCommandId: Record<string, number>
  sampleSlotOrder: number[]
  nextSampleSlotIndex: number
  latestBurstRequest: RadioBurstRequest | null
  nextBurstRequestId: number
  radioRuntimeStatus: RadioRuntimeStatus
  radioRuntimeMessage: string | null
  radioRuntimeSourceKind: RadioRuntimeSourceKind
  radioTransport: RadioTransportState
  lastHandledBurstRequestId: number | null
  latestSeekRequest: RadioSeekRequest | null
  nextSeekRequestId: number
  lastHandledSeekRequestId: number | null
  latestReloadRequestId: number | null
  nextReloadRequestId: number
  lastHandledReloadRequestId: number | null
  samplerStepCount: SamplerStepCount
  samplerBpm: number
  samplerIsPlaying: boolean
  samplerPlayheadStepIndex: number | null
  samplerSteps: SamplerStep[]
  samplerNoteRepeat: SamplerNoteRepeatState
  turnRadioOn: (url?: string) => void
  turnRadioOff: () => void
  openRadioToolbar: () => void
  closeRadioToolbar: () => void
  setRadioUrl: (url: string) => void
  setSampleBurstTime: (value: number) => void
  randomizeSampleTimes: () => void
  ensureSamplePosition: (commandId: string) => number
  requestRadioBurst: (
    commandIdentity: string,
    triggerKind: RadioBurstTriggerKind,
  ) => RadioBurstRequest | null
  setRadioRuntimeState: (next: {
    status: RadioRuntimeStatus
    message?: string | null
    sourceKind?: RadioRuntimeSourceKind
  }) => void
  setRadioTransportState: (next: Partial<RadioTransportState>) => void
  requestRadioSeek: (timeSec: number) => RadioSeekRequest | null
  markRadioSeekHandled: (requestId: number | null) => void
  requestRadioReload: () => number | null
  markRadioReloadHandled: (requestId: number | null) => void
  markRadioBurstHandled: (requestId: number | null) => void
  setSamplerStepCount: (stepCount: SamplerStepCount) => void
  setSamplerBpm: (bpm: number) => void
  playSampler: () => void
  stopSampler: () => void
  setSamplerPlayheadStepIndex: (stepIndex: number | null) => void
  rerollSamplerStep: (stepId: string) => void
  rerollAllSamplerSteps: () => void
  toggleSamplerStepEnabled: (stepId: string) => void
  setSamplerNoteRepeatEnabled: (enabled: boolean) => void
  setSamplerNoteRepeatCount: (count: SamplerNoteRepeatValue) => void
  setSamplerNoteRepeatRate: (rate: SamplerNoteRepeatValue) => void
}

const createSampleSlotOrder = (): number[] => {
  const slots = Array.from({ length: SAMPLE_SLOT_COUNT }, (_, index) => index)
  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = slots[index]
    slots[index] = slots[swapIndex] ?? slots[index] ?? index
    slots[swapIndex] = current ?? swapIndex
  }
  return slots
}

const createSamplerCueRatio = (): number =>
  Number((0.03 + Math.random() * 0.9).toFixed(4))

const clampSamplerBpm = (value: number): number =>
  Math.min(180, Math.max(40, Math.round(Number.isFinite(value) ? value : DEFAULT_SAMPLER_BPM)))

const isSamplerStepCount = (value: number): value is SamplerStepCount =>
  SAMPLER_STEP_COUNT_OPTIONS.includes(value as SamplerStepCount)

const isSamplerNoteRepeatValue = (value: number): value is SamplerNoteRepeatValue =>
  SAMPLER_NOTE_REPEAT_OPTIONS.includes(value as SamplerNoteRepeatValue)

const createSamplerSteps = (
  stepCount: SamplerStepCount,
  existingSteps: SamplerStep[] = [],
): SamplerStep[] =>
  Array.from({ length: stepCount }, (_, index) => {
    const existingStep = existingSteps[index] ?? null
    if (existingStep !== null) {
      return {
        ...existingStep,
        index,
      }
    }
    return {
      id: `sampler-step-${index + 1}`,
      index,
      enabled: true,
      cueRatio: createSamplerCueRatio(),
    }
  })

const createInitialState = (): Omit<
  AudioSamplerState,
  | 'turnRadioOn'
  | 'turnRadioOff'
  | 'openRadioToolbar'
  | 'closeRadioToolbar'
  | 'setRadioUrl'
  | 'setSampleBurstTime'
  | 'randomizeSampleTimes'
  | 'ensureSamplePosition'
  | 'requestRadioBurst'
  | 'setRadioRuntimeState'
  | 'setRadioTransportState'
  | 'requestRadioSeek'
  | 'markRadioSeekHandled'
  | 'requestRadioReload'
  | 'markRadioReloadHandled'
  | 'markRadioBurstHandled'
  | 'setSamplerStepCount'
  | 'setSamplerBpm'
  | 'playSampler'
  | 'stopSampler'
  | 'setSamplerPlayheadStepIndex'
  | 'rerollSamplerStep'
  | 'rerollAllSamplerSteps'
  | 'toggleSamplerStepEnabled'
  | 'setSamplerNoteRepeatEnabled'
  | 'setSamplerNoteRepeatCount'
  | 'setSamplerNoteRepeatRate'
> => ({
  isRadioEnabled: false,
  isRadioToolbarOpen: false,
  sourceUrl: DEFAULT_RADIO_URL,
  sampleBurstTime: DEFAULT_RADIO_SAMPLE_BURST_TIME,
  samplePositionByCommandId: {},
  sampleSlotOrder: createSampleSlotOrder(),
  nextSampleSlotIndex: 0,
  latestBurstRequest: null,
  nextBurstRequestId: 1,
  radioRuntimeStatus: 'idle',
  radioRuntimeMessage: null,
  radioRuntimeSourceKind: 'none',
  radioTransport: {
    currentTimeSec: 0,
    durationSec: 0,
    isSeekable: false,
    isPlaying: false,
  },
  lastHandledBurstRequestId: null,
  latestSeekRequest: null,
  nextSeekRequestId: 1,
  lastHandledSeekRequestId: null,
  latestReloadRequestId: null,
  nextReloadRequestId: 1,
  lastHandledReloadRequestId: null,
  samplerStepCount: 16,
  samplerBpm: DEFAULT_SAMPLER_BPM,
  samplerIsPlaying: false,
  samplerPlayheadStepIndex: null,
  samplerSteps: createSamplerSteps(16),
  samplerNoteRepeat: {
    enabled: false,
    count: 1,
    rate: 1,
  },
})

export const useAudioSamplerStore = create<AudioSamplerState>((set, get) => ({
  ...createInitialState(),
  turnRadioOn: (url) => {
    const trimmedUrl = url?.trim()
    set((state) => ({
      isRadioEnabled: true,
      sourceUrl: trimmedUrl !== undefined && trimmedUrl.length > 0 ? trimmedUrl : state.sourceUrl,
    }))
  },
  turnRadioOff: () => {
    set((state) => ({
      isRadioEnabled: false,
      radioTransport: {
        ...state.radioTransport,
        isPlaying: false,
      },
      samplerIsPlaying: false,
      samplerPlayheadStepIndex: null,
    }))
  },
  openRadioToolbar: () => {
    set({ isRadioToolbarOpen: true })
  },
  closeRadioToolbar: () => {
    set({ isRadioToolbarOpen: false })
  },
  setRadioUrl: (url) => {
    const trimmedUrl = url.trim()
    if (trimmedUrl.length === 0) {
      return
    }
    set({
      sourceUrl: trimmedUrl,
      isRadioEnabled: true,
    })
  },
  setSampleBurstTime: (value) => {
    set({
      sampleBurstTime: value,
    })
  },
  randomizeSampleTimes: () => {
    set({
      samplePositionByCommandId: {},
      sampleSlotOrder: createSampleSlotOrder(),
      nextSampleSlotIndex: 0,
    })
  },
  ensureSamplePosition: (commandId) => {
    const normalizedCommandId = commandId.trim()
    if (normalizedCommandId.length === 0) {
      return 0
    }

    const existing = get().samplePositionByCommandId[normalizedCommandId]
    if (existing !== undefined) {
      return existing
    }

    const state = get()
    const slotIndex = state.nextSampleSlotIndex % state.sampleSlotOrder.length
    const slot = state.sampleSlotOrder[slotIndex] ?? slotIndex
    const normalizedPosition = (slot + 0.5) / SAMPLE_SLOT_COUNT

    set({
      samplePositionByCommandId: {
        ...state.samplePositionByCommandId,
        [normalizedCommandId]: normalizedPosition,
      },
      nextSampleSlotIndex: state.nextSampleSlotIndex + 1,
    })

    return normalizedPosition
  },
  requestRadioBurst: (commandIdentity, triggerKind) => {
    const normalizedCommandIdentity = commandIdentity.trim()
    if (normalizedCommandIdentity.length === 0) {
      return null
    }

    const stateBeforeRequest = get()
    if (!stateBeforeRequest.isRadioEnabled) {
      return null
    }

    const samplePosition = get().ensureSamplePosition(normalizedCommandIdentity)
    const state = get()
    const burstRequest: RadioBurstRequest = {
      requestId: state.nextBurstRequestId,
      commandIdentity: normalizedCommandIdentity,
      samplePosition,
      sourceUrl: state.sourceUrl,
      sampleBurstTime: state.sampleBurstTime,
      triggerKind,
    }

    set({
      latestBurstRequest: burstRequest,
      nextBurstRequestId: state.nextBurstRequestId + 1,
    })

    return burstRequest
  },
  setRadioRuntimeState: ({ status, message = null, sourceKind }) => {
    set((state) => ({
      radioRuntimeStatus: status,
      radioRuntimeMessage: message,
      radioRuntimeSourceKind: sourceKind ?? state.radioRuntimeSourceKind,
    }))
  },
  setRadioTransportState: (next) => {
    set((state) => ({
      radioTransport: {
        ...state.radioTransport,
        ...next,
      },
    }))
  },
  requestRadioSeek: (timeSec) => {
    const normalizedTimeSec = Number.isFinite(timeSec) ? Math.max(0, timeSec) : 0
    const state = get()
    const request: RadioSeekRequest = {
      requestId: state.nextSeekRequestId,
      timeSec: normalizedTimeSec,
    }
    set({
      latestSeekRequest: request,
      nextSeekRequestId: state.nextSeekRequestId + 1,
    })
    return request
  },
  markRadioSeekHandled: (requestId) => {
    set({
      lastHandledSeekRequestId: requestId,
    })
  },
  requestRadioReload: () => {
    const state = get()
    const requestId = state.nextReloadRequestId
    set({
      latestReloadRequestId: requestId,
      nextReloadRequestId: requestId + 1,
    })
    return requestId
  },
  markRadioReloadHandled: (requestId) => {
    set({
      lastHandledReloadRequestId: requestId,
    })
  },
  markRadioBurstHandled: (requestId) => {
    set({
      lastHandledBurstRequestId: requestId,
    })
  },
  setSamplerStepCount: (stepCount) => {
    const normalizedStepCount = isSamplerStepCount(stepCount) ? stepCount : 16
    set((state) => ({
      samplerStepCount: normalizedStepCount,
      samplerSteps: createSamplerSteps(normalizedStepCount, state.samplerSteps),
      samplerPlayheadStepIndex:
        state.samplerPlayheadStepIndex === null
          ? null
          : Math.min(state.samplerPlayheadStepIndex, normalizedStepCount - 1),
    }))
  },
  setSamplerBpm: (bpm) => {
    set({
      samplerBpm: clampSamplerBpm(bpm),
    })
  },
  playSampler: () => {
    set({
      samplerIsPlaying: true,
      samplerPlayheadStepIndex: 0,
    })
  },
  stopSampler: () => {
    set({
      samplerIsPlaying: false,
      samplerPlayheadStepIndex: null,
    })
  },
  setSamplerPlayheadStepIndex: (stepIndex) => {
    set((state) => ({
      samplerPlayheadStepIndex:
        stepIndex === null
          ? null
          : Math.min(Math.max(0, Math.floor(stepIndex)), state.samplerStepCount - 1),
    }))
  },
  rerollSamplerStep: (stepId) => {
    const normalizedStepId = stepId.trim()
    if (normalizedStepId.length === 0) {
      return
    }
    set((state) => ({
      samplerSteps: state.samplerSteps.map((step) =>
        step.id === normalizedStepId
          ? {
              ...step,
              cueRatio: createSamplerCueRatio(),
            }
          : step,
      ),
    }))
  },
  rerollAllSamplerSteps: () => {
    set((state) => ({
      samplerSteps: state.samplerSteps.map((step) => ({
        ...step,
        cueRatio: createSamplerCueRatio(),
      })),
    }))
  },
  toggleSamplerStepEnabled: (stepId) => {
    const normalizedStepId = stepId.trim()
    if (normalizedStepId.length === 0) {
      return
    }
    set((state) => ({
      samplerSteps: state.samplerSteps.map((step) =>
        step.id === normalizedStepId
          ? {
              ...step,
              enabled: !step.enabled,
            }
          : step,
      ),
    }))
  },
  setSamplerNoteRepeatEnabled: (enabled) => {
    set((state) => ({
      samplerNoteRepeat: {
        ...state.samplerNoteRepeat,
        enabled,
      },
    }))
  },
  setSamplerNoteRepeatCount: (count) => {
    const normalizedCount = isSamplerNoteRepeatValue(count) ? count : 1
    set((state) => ({
      samplerNoteRepeat: {
        ...state.samplerNoteRepeat,
        count: normalizedCount,
      },
    }))
  },
  setSamplerNoteRepeatRate: (rate) => {
    const normalizedRate = isSamplerNoteRepeatValue(rate) ? rate : 1
    set((state) => ({
      samplerNoteRepeat: {
        ...state.samplerNoteRepeat,
        rate: normalizedRate,
      },
    }))
  },
}))

export const resetAudioSamplerStore = (): void => {
  useAudioSamplerStore.setState(useAudioSamplerStore.getInitialState(), true)
}

import { create } from 'zustand'

export const DEFAULT_RADIO_URL = 'https://soundcloud.com/keota-us/gusano'
export const DEFAULT_RADIO_SAMPLE_BURST_TIME = 0.1

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

export type AudioSamplerState = {
  isRadioEnabled: boolean
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
  lastHandledBurstRequestId: number | null
  turnRadioOn: (url?: string) => void
  turnRadioOff: () => void
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
  markRadioBurstHandled: (requestId: number | null) => void
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

const createInitialState = (): Omit<
  AudioSamplerState,
  | 'turnRadioOn'
  | 'turnRadioOff'
  | 'setRadioUrl'
  | 'setSampleBurstTime'
  | 'randomizeSampleTimes'
  | 'ensureSamplePosition'
  | 'requestRadioBurst'
  | 'setRadioRuntimeState'
  | 'markRadioBurstHandled'
> => ({
  isRadioEnabled: false,
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
  lastHandledBurstRequestId: null,
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
    set({ isRadioEnabled: false })
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
  markRadioBurstHandled: (requestId) => {
    set({
      lastHandledBurstRequestId: requestId,
    })
  },
}))

export const resetAudioSamplerStore = (): void => {
  useAudioSamplerStore.setState(useAudioSamplerStore.getInitialState(), true)
}

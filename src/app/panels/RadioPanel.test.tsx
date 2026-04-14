// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RadioPanel } from './RadioPanel'
import {
  RADIO_SUPPORT_PROFILE,
  resetAudioSamplerStore,
  useAudioSamplerStore,
} from '../store/audioSamplerStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('RadioPanel', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  const renderPanel = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<RadioPanel />)
    })
  }

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
  })

  beforeEach(() => {
    resetAudioSamplerStore()
    useAudioSamplerStore.getState().openRadioToolbar()
    useAudioSamplerStore.getState().turnRadioOn()
    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: 'ready',
      sourceKind: 'soundcloud-widget',
    })
    useAudioSamplerStore.getState().setRadioTransportState({
      currentTimeSec: 30,
      durationSec: 120,
      isSeekable: true,
      isPlaying: true,
    })
    useAudioSamplerStore.getState().setRadioWaveformState({
      kind: 'limited',
      sourceId: 'radio-soundcloud:https://soundcloud.com/keota-us/gusano',
      sourceKind: 'soundcloud-widget',
      durationSec: 120,
      sampleCount: 512,
      samples: [],
      message: 'Detailed waveform unavailable for current source',
      lastResolvedAt: 1,
    })
  })

  it('renders the transport and sampler sections from canonical radio state', async () => {
    await renderPanel()

    const host = container?.querySelector('.RadioPanelHost')
    expect(host?.getAttribute('data-radio-support-classification')).toBe(
      RADIO_SUPPORT_PROFILE.classification,
    )
    expect(host?.getAttribute('data-radio-requires-workspace-surface')).toBe('false')
    expect(container?.textContent).toContain('Radio')
    expect(container?.textContent).toContain('Sampler')
    expect(container?.textContent).toContain(RADIO_SUPPORT_PROFILE.label)
    expect(container?.textContent).toContain('https://soundcloud.com/keota-us/gusano')
    expect(container?.textContent).toContain('Ready')
    expect(container?.textContent).toContain('0:30 / 2:00')
    expect(container?.querySelector('.RadioWaveformStrip')).not.toBeNull()
    expect(container?.querySelectorAll('.RadioWaveformStepMarker')).toHaveLength(16)
    expect(container?.querySelectorAll('.AudioSamplerStepCell')).toHaveLength(16)
    expect(container?.querySelectorAll('.AudioSamplerStepLock')).toHaveLength(16)
    expect(container?.textContent).toContain('Play')
    expect(container?.textContent).toContain('Stop')
  })

  it('closes the toolbar and publishes reload requests from panel actions', async () => {
    await renderPanel()

    const closeButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.getAttribute('aria-label') === 'Close radio toolbar',
    )
    expect(closeButton).not.toBeNull()

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().isRadioToolbarOpen).toBe(false)

    await act(async () => {
      useAudioSamplerStore.getState().openRadioToolbar()
      root?.render(<RadioPanel />)
    })

    const reloadButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent?.trim() === 'Reload',
    )
    expect(reloadButton).not.toBeNull()

    await act(async () => {
      reloadButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().latestReloadRequestId).toBe(1)

    const burstInput = container?.querySelector('.RadioPanelInput') as HTMLInputElement | null
    expect(burstInput).not.toBeNull()
    expect(burstInput?.value).toBe('0.1')
  })

  it('renders expandable step detail rows with time-position controls inside the merged toolbar', async () => {
    await renderPanel()

    await act(async () => {
      useAudioSamplerStore.getState().setSamplerStepsSectionExpanded(true)
      const firstStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''
      useAudioSamplerStore.getState().toggleSamplerStepExpanded(firstStepId)
      root?.render(<RadioPanel />)
    })

    expect(container?.textContent).toContain('Step Details')
    expect(container?.textContent).toContain('Step 1 Time Position')
    expect(container?.textContent).toContain('Cue Position')
  })

  it('publishes a sampler step preview request from the expanded step play button', async () => {
    await renderPanel()

    await act(async () => {
      useAudioSamplerStore.getState().setSamplerStepsSectionExpanded(true)
      const firstStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''
      useAudioSamplerStore.getState().toggleSamplerStepExpanded(firstStepId)
      root?.render(<RadioPanel />)
    })

    const stepPlayButtons = Array.from(container?.querySelectorAll('button') ?? []).filter(
      (button) => button.textContent?.trim() === 'Play',
    )
    const stepPlayButton = stepPlayButtons.at(-1) ?? null
    expect(stepPlayButton).not.toBeNull()

    await act(async () => {
      stepPlayButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().latestSamplerStepPreviewRequest?.requestId).toBe(1)
  })

  it('locks a sampler step from the horizontal row and reflects that in step detail', async () => {
    await renderPanel()

    const lockButtons = Array.from(container?.querySelectorAll('.AudioSamplerStepLock') ?? [])
    const firstLockButton = (lockButtons[0] ?? null) as HTMLButtonElement | null
    expect(firstLockButton).not.toBeNull()

    await act(async () => {
      firstLockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const firstStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''
    expect(useAudioSamplerStore.getState().samplerSteps[0]?.isLocked).toBe(true)

    await act(async () => {
      useAudioSamplerStore.getState().setSamplerStepsSectionExpanded(true)
      useAudioSamplerStore.getState().toggleSamplerStepExpanded(firstStepId)
      root?.render(<RadioPanel />)
    })

    expect(container?.textContent).toContain('Locked')
    expect(container?.textContent).toContain('Yes')
  })
})

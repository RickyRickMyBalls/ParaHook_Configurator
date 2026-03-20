// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { RadioPanel } from './RadioPanel'
import { resetAudioSamplerStore, useAudioSamplerStore } from '../store/audioSamplerStore'

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
  })

  it('renders the transport and sampler sections from canonical radio state', async () => {
    await renderPanel()

    expect(container?.textContent).toContain('Transport')
    expect(container?.textContent).toContain('Sampler')
    expect(container?.textContent).toContain('https://soundcloud.com/keota-us/gusano')
    expect(container?.textContent).toContain('Ready')
    expect(container?.textContent).toContain('0:30 / 2:00')
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
})

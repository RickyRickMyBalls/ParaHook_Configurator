// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AudioSamplerPanel } from './AudioSamplerPanel'
import { resetAudioSamplerStore, useAudioSamplerStore } from '../store/audioSamplerStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('AudioSamplerPanel', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  const renderPanel = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<AudioSamplerPanel />)
    })
  }

  beforeEach(() => {
    resetAudioSamplerStore()
    useAudioSamplerStore.getState().turnRadioOn()
    useAudioSamplerStore.getState().setRadioRuntimeState({
      status: 'fallback',
      sourceKind: 'generated-tone',
    })
  })

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

  it('renders the current source, step row, and note-repeat controls', async () => {
    await renderPanel()

    expect(container?.textContent).toContain('Sampler')
    expect(container?.textContent).toContain('https://soundcloud.com/keota-us/gusano')
    expect(container?.querySelectorAll('.AudioSamplerStepCell')).toHaveLength(16)
    expect(container?.textContent).toContain('Note Repeat')
  })

  it('updates sampler controls from the panel actions', async () => {
    await renderPanel()

    const playButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent?.trim() === 'Play',
    )
    const rerollAllButton = Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent?.trim() === 'Reroll All',
    )
    const firstStepButton = container?.querySelector('.AudioSamplerStepMain') as HTMLButtonElement | null
    const firstRerollButton = container?.querySelector('.AudioSamplerStepReroll') as HTMLButtonElement | null

    const initialCue = useAudioSamplerStore.getState().samplerSteps[0]?.cueRatio

    await act(async () => {
      playButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      firstStepButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      firstRerollButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      rerollAllButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().samplerIsPlaying).toBe(true)
    expect(useAudioSamplerStore.getState().samplerSteps[0]?.enabled).toBe(false)
    expect(useAudioSamplerStore.getState().samplerSteps[0]?.cueRatio).not.toBe(initialCue)
  })
})

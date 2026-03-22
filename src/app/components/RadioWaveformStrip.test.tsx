// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { RadioWaveformStrip } from './RadioWaveformStrip'
import type { RadioTransportState, RadioWaveformState, SamplerStep } from '../store/audioSamplerStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const transport: RadioTransportState = {
  currentTimeSec: 30,
  durationSec: 120,
  isSeekable: true,
  isPlaying: true,
}

const stepMarkers: SamplerStep[] = [
  {
    id: 'sampler-step-1',
    index: 0,
    enabled: true,
    cueRatio: 0.2,
    isLocked: false,
    fadeInSec: 0,
    fadeOutSec: 0,
    startScoochSec: 0,
    endScoochSec: 0,
  },
  {
    id: 'sampler-step-2',
    index: 1,
    enabled: true,
    cueRatio: 0.6,
    isLocked: true,
    fadeInSec: 0,
    fadeOutSec: 0,
    startScoochSec: 0,
    endScoochSec: 0,
  },
]

describe('RadioWaveformStrip', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  const renderStrip = async (waveform: RadioWaveformState) => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(
        <RadioWaveformStrip
          waveform={waveform}
          transport={transport}
          stepMarkers={stepMarkers}
          activeStepIndex={1}
        />,
      )
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

  it('renders exact waveform bars and sampler markers', async () => {
    await renderStrip({
      kind: 'exact',
      sourceId: 'radio-fallback-gusano',
      sourceKind: 'generated-tone',
      durationSec: 12,
      sampleCount: 4,
      samples: [0.1, 0.4, 0.8, 0.2],
      message: null,
      lastResolvedAt: 1,
    })

    expect(container?.querySelectorAll('.RadioWaveformBar')).toHaveLength(4)
    expect(container?.querySelectorAll('.RadioWaveformStepMarker')).toHaveLength(2)
    expect(container?.querySelector('.RadioWaveformStepMarker.isActive')).not.toBeNull()
    expect(container?.querySelector('.RadioWaveformStepMarker.isLocked')).not.toBeNull()
  })

  it('renders limited waveform mode message without fake bars', async () => {
    await renderStrip({
      kind: 'limited',
      sourceId: 'radio-soundcloud:test',
      sourceKind: 'soundcloud-widget',
      durationSec: 120,
      sampleCount: 512,
      samples: [],
      message: 'Detailed waveform unavailable for current source',
      lastResolvedAt: 2,
    })

    expect(container?.querySelectorAll('.RadioWaveformBar')).toHaveLength(0)
    expect(container?.textContent).toContain('Detailed waveform unavailable for current source')
    expect(container?.querySelector('.RadioWaveformLimitedLane')).not.toBeNull()
  })
})

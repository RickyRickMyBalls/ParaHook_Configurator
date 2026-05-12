import { beforeEach, describe, expect, it } from 'vitest'
import {
  EMPTY_RENDER_PREVIEW_STATUS,
  formatRenderPreviewStatusLabel,
  selectRenderPreviewStatus,
  useRenderPreviewStatusStore,
} from './renderPreviewStatusStore'

describe('render preview status store', () => {
  beforeEach(() => {
    useRenderPreviewStatusStore.setState(useRenderPreviewStatusStore.getInitialState(), true)
  })

  it('returns an inactive fallback for viewports without render preview status', () => {
    const status = selectRenderPreviewStatus(
      useRenderPreviewStatusStore.getState(),
      'model-viewer-primary',
    )

    expect(status).toEqual(EMPTY_RENDER_PREVIEW_STATUS)
    expect(formatRenderPreviewStatusLabel(status)).toBe('')
  })

  it('tracks fallback entry and inactive preview exit per viewport', () => {
    useRenderPreviewStatusStore.getState().enterFallback('model-viewer-primary')

    expect(
      formatRenderPreviewStatusLabel(
        selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
      ),
    ).toBe('Render Preview: interactive fallback')

    useRenderPreviewStatusStore.getState().leavePreview('model-viewer-primary')

    const status = selectRenderPreviewStatus(
      useRenderPreviewStatusStore.getState(),
      'model-viewer-primary',
    )
    expect(status.status).toBe('inactive')
    expect(status.staleReason).toBe('display-mode-exit')
    expect(formatRenderPreviewStatusLabel(status)).toBe('')
  })

  it('formats iteration and sample progress labels', () => {
    useRenderPreviewStatusStore.getState().updateProgress('model-viewer-primary', {
      completedIterations: 12.8,
      targetIterations: 64,
    })

    expect(
      formatRenderPreviewStatusLabel(
        selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
      ),
    ).toBe('Render Preview: 12 / 64 iterations')

    useRenderPreviewStatusStore.getState().updateProgress('model-viewer-primary', {
      completedIterations: null,
      targetIterations: null,
      completedSamples: 128,
      targetSamples: 512,
    })

    expect(
      formatRenderPreviewStatusLabel(
        selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
      ),
    ).toBe('Render Preview: 128 / 512 samples')
  })

  it('marks active previews stale without leaking across viewports', () => {
    useRenderPreviewStatusStore.getState().enterFallback('model-viewer-primary')
    useRenderPreviewStatusStore.getState().markStale('model-viewer-primary', 'camera')
    useRenderPreviewStatusStore.getState().markStale('model-viewer-secondary', 'geometry')

    const primaryStatus = selectRenderPreviewStatus(
      useRenderPreviewStatusStore.getState(),
      'model-viewer-primary',
    )
    const secondaryStatus = selectRenderPreviewStatus(
      useRenderPreviewStatusStore.getState(),
      'model-viewer-secondary',
    )

    expect(primaryStatus.status).toBe('stale')
    expect(primaryStatus.staleReason).toBe('camera')
    expect(formatRenderPreviewStatusLabel(primaryStatus)).toBe(
      'Render Preview: stale - camera changed',
    )
    expect(secondaryStatus.status).toBe('inactive')
  })

  it('labels terminal and availability states', () => {
    useRenderPreviewStatusStore.getState().markUnsupported('model-viewer-primary')
    expect(
      formatRenderPreviewStatusLabel(
        selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
      ),
    ).toBe('Render Preview: unavailable')

    useRenderPreviewStatusStore.getState().markComplete('model-viewer-primary')
    expect(
      formatRenderPreviewStatusLabel(
        selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
      ),
    ).toBe('Render Preview: complete')

    useRenderPreviewStatusStore.getState().markCanceled('model-viewer-primary')
    expect(
      formatRenderPreviewStatusLabel(
        selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
      ),
    ).toBe('Render Preview: canceled')

    useRenderPreviewStatusStore.getState().markError('model-viewer-primary', 'Render failed')
    expect(
      formatRenderPreviewStatusLabel(
        selectRenderPreviewStatus(useRenderPreviewStatusStore.getState(), 'model-viewer-primary'),
      ),
    ).toBe('Render Preview: error')
  })
})

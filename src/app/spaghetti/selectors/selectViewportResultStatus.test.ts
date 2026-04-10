import { describe, expect, it } from 'vitest'
import type { ViewportResultState } from './selectViewportResultState'
import { selectViewportResultStatus } from './selectViewportResultStatus'

const createViewportResultState = (
  overrides: Partial<ViewportResultState> = {},
): ViewportResultState => ({
  requestedMode: 'auto',
  visibleResultClass: null,
  visibleSourceKind: 'none',
  geometryResult: null,
  artifactBuildOutputs: [],
  previewPreparation: null,
  renderVm: {
    items: [],
    viewerParts: [],
  },
  previewRenderVm: {
    items: [],
    viewerParts: [],
  },
  retainedBaseState: 'none',
  retainedBaseResultClass: null,
  retainedBaseSourceKind: 'none',
  retainedBaseGeometryResult: null,
  retainedBaseRenderVm: {
    items: [],
    viewerParts: [],
  },
  overlayResultClass: null,
  overlaySourceKind: 'none',
  overlayGeometryResult: null,
  overlayRenderVm: {
    items: [],
    viewerParts: [],
  },
  isPendingFinal: false,
  isUsingFallback: false,
  fallbackReason: null,
  ...overrides,
})

describe('selectViewportResultStatus', () => {
  it('returns Final when the viewport is showing final geometry', () => {
    expect(
      selectViewportResultStatus(
        createViewportResultState({
          visibleResultClass: 'final',
          visibleSourceKind: 'retained-final',
        }),
      ),
    ).toEqual({
      kind: 'final',
      label: 'Final',
    })
  })

  it('returns Building Final... when draft remains visible while final is pending', () => {
    expect(
      selectViewportResultStatus(
        createViewportResultState({
          visibleResultClass: 'draft',
          visibleSourceKind: 'artifact-preview',
          isPendingFinal: true,
          isUsingFallback: true,
          fallbackReason: 'artifact-preview-bridge',
        }),
      ),
    ).toEqual({
      kind: 'building-final',
      label: 'Building Final...',
    })
  })

  it('returns Final Unavailable for the explicit final-only fallback', () => {
    expect(
      selectViewportResultStatus(
        createViewportResultState({
          requestedMode: 'final',
          isUsingFallback: true,
          fallbackReason: 'final-unavailable',
        }),
      ),
    ).toEqual({
      kind: 'final-unavailable',
      label: 'Final Unavailable',
    })
  })

  it('returns Draft when draft is the visible result and final is not pending', () => {
    expect(
      selectViewportResultStatus(
        createViewportResultState({
          visibleResultClass: 'draft',
          visibleSourceKind: 'artifact-preview',
          isUsingFallback: true,
          fallbackReason: 'artifact-preview-bridge',
        }),
      ),
    ).toEqual({
      kind: 'draft',
      label: 'Draft',
    })
  })

  it('returns Waiting For Geometry when there is no accepted visible result yet', () => {
    expect(
      selectViewportResultStatus(
        createViewportResultState({
          isUsingFallback: true,
          fallbackReason: 'no-accepted-geometry',
        }),
      ),
    ).toEqual({
      kind: 'waiting-for-geometry',
      label: 'Waiting For Geometry',
    })
  })
})

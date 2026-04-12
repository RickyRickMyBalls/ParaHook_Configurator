import { describe, expect, it } from 'vitest'
import { toViewerRenderablePart, type PartArtifact } from '../../../shared/buildTypes'
import type { ViewportResultState } from './selectViewportResultState'
import { selectViewportResultStatus } from './selectViewportResultStatus'

const createArtifact = (partKeyStr: string): PartArtifact => ({
  id: `artifact:${partKeyStr}`,
  kind: 'box',
  label: partKeyStr,
  partKeyStr,
  partKey: { id: partKeyStr, instance: null },
  params: { width: 10, length: 20, height: 5 },
})

const createViewportResultState = (
  overrides: Partial<ViewportResultState> = {},
): ViewportResultState => ({
  requestedMode: 'auto',
  browserExecutionPolicy: 'live',
  isInteractionActive: false,
  hasQueuedPreview: false,
  hasRetainedAcceptedBase: false,
  hasLivePreview: false,
  hasPreviewReadyResult: false,
  visiblePresentationStateId: null,
  retainedBasePresentationStateId: null,
  overlayPresentationStateId: null,
  lastLoadedState: {
    isAvailable: false,
    presentationStateId: null,
    resultClass: null,
    sourceKind: 'none',
    geometryResult: null,
    renderVm: {
      items: [],
      viewerParts: [],
    },
  },
  previewState: {
    kind: 'none',
    presentationStateId: null,
    resultClass: null,
    sourceKind: 'none',
    geometryResult: null,
    renderVm: {
      items: [],
      viewerParts: [],
    },
  },
  acceptedState: {
    kind: 'none',
    resultClass: null,
    sourceKind: 'none',
    geometryResult: null,
    renderVm: {
      items: [],
      viewerParts: [],
    },
    isVisible: false,
  },
  visibleResultClass: null,
  visibleSourceKind: 'none',
  geometryResult: null,
  artifactBuildOutputs: [],
  acceptedPreviewBuildBundle: null,
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

  it('keeps Waiting For Geometry while retained committed fallback remains visible', () => {
    expect(
      selectViewportResultStatus(
        createViewportResultState({
          hasRetainedAcceptedBase: true,
          retainedBaseState: 'retained',
          retainedBaseResultClass: 'final',
          retainedBaseSourceKind: 'retained-final',
          retainedBasePresentationStateId: 'lastLoaded',
          lastLoadedState: {
            isAvailable: true,
            presentationStateId: 'lastLoaded',
            resultClass: 'final',
            sourceKind: 'retained-final',
            geometryResult: null,
            renderVm: {
              items: [],
              viewerParts: [
                toViewerRenderablePart(
                  createArtifact('authoritative-preview'),
                  'graph-document-1:authoritative-preview',
                ),
              ],
            },
          },
          retainedBaseRenderVm: {
            items: [],
            viewerParts: [
              toViewerRenderablePart(
                createArtifact('authoritative-preview'),
                'graph-document-1:authoritative-preview',
              ),
            ],
          },
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

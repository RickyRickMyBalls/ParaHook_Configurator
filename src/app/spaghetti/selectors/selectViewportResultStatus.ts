import type { ViewportResultState } from './selectViewportResultState'

export type ViewportResultStatusKind =
  | 'draft'
  | 'final'
  | 'building-final'
  | 'final-unavailable'
  | 'waiting-for-geometry'

export type ViewportResultStatus = {
  kind: ViewportResultStatusKind
  label: string
}

export const selectViewportResultStatus = (
  resultState: ViewportResultState,
): ViewportResultStatus => {
  if (resultState.visibleResultClass === 'final') {
    return {
      kind: 'final',
      label: 'Final',
    }
  }

  if (resultState.isPendingFinal) {
    return {
      kind: 'building-final',
      label: 'Building Final...',
    }
  }

  if (resultState.fallbackReason === 'final-unavailable') {
    return {
      kind: 'final-unavailable',
      label: 'Final Unavailable',
    }
  }

  if (resultState.visibleResultClass === 'draft') {
    return {
      kind: 'draft',
      label: 'Draft',
    }
  }

  return {
    kind: 'waiting-for-geometry',
    label: 'Waiting For Geometry',
  }
}

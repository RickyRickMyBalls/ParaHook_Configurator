import type { WorkspaceViewportResultMode } from './workspaceShellTypes'

export type WorkspaceViewportResultModeBehavior = {
  mode: WorkspaceViewportResultMode
  allowsDraftDisplay: boolean
  allowsFinalDisplay: boolean
  allowsFinalReplacement: boolean
  prefersSkippingDraftWork: boolean
  mayRunFinalInBackground: boolean
}

export const resolveWorkspaceViewportResultModeBehavior = (
  mode: WorkspaceViewportResultMode,
): WorkspaceViewportResultModeBehavior => {
  if (mode === 'draft') {
    return {
      mode,
      allowsDraftDisplay: true,
      allowsFinalDisplay: false,
      allowsFinalReplacement: false,
      prefersSkippingDraftWork: false,
      mayRunFinalInBackground: true,
    }
  }

  if (mode === 'final') {
    return {
      mode,
      allowsDraftDisplay: false,
      allowsFinalDisplay: true,
      allowsFinalReplacement: false,
      prefersSkippingDraftWork: true,
      mayRunFinalInBackground: true,
    }
  }

  return {
    mode,
    allowsDraftDisplay: true,
    allowsFinalDisplay: true,
    allowsFinalReplacement: true,
    prefersSkippingDraftWork: false,
    mayRunFinalInBackground: true,
  }
}

export const cycleWorkspaceViewportResultMode = (
  mode: WorkspaceViewportResultMode,
): WorkspaceViewportResultMode =>
  mode === 'auto' ? 'draft' : mode === 'draft' ? 'final' : 'auto'

export const getWorkspaceViewportResultModeLabel = (
  mode: WorkspaceViewportResultMode,
): 'Auto' | 'Draft' | 'Final' =>
  mode === 'draft' ? 'Draft' : mode === 'final' ? 'Final' : 'Auto'

export const getWorkspaceViewportResultModeShortLabel = (
  mode: WorkspaceViewportResultMode,
): 'A' | 'D' | 'F' =>
  mode === 'draft' ? 'D' : mode === 'final' ? 'F' : 'A'

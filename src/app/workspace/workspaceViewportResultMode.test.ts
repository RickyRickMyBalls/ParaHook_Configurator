import { describe, expect, it } from 'vitest'
import {
  cycleWorkspaceViewportResultMode,
  getWorkspaceViewportResultModeLabel,
  getWorkspaceViewportResultModeShortLabel,
  resolveWorkspaceViewportResultModeBehavior,
} from './workspaceViewportResultMode'

describe('workspaceViewportResultMode', () => {
  it('treats auto as the only mode that allows visible draft-to-final replacement', () => {
    expect(resolveWorkspaceViewportResultModeBehavior('auto')).toEqual({
      mode: 'auto',
      allowsDraftDisplay: true,
      allowsFinalDisplay: true,
      allowsFinalReplacement: true,
      prefersSkippingDraftWork: false,
      mayRunFinalInBackground: true,
    })
  })

  it('treats draft as draft-only display while still allowing final background work', () => {
    expect(resolveWorkspaceViewportResultModeBehavior('draft')).toEqual({
      mode: 'draft',
      allowsDraftDisplay: true,
      allowsFinalDisplay: false,
      allowsFinalReplacement: false,
      prefersSkippingDraftWork: false,
      mayRunFinalInBackground: true,
    })
  })

  it('treats final as final-only display and marks draft work skippable when supported', () => {
    expect(resolveWorkspaceViewportResultModeBehavior('final')).toEqual({
      mode: 'final',
      allowsDraftDisplay: false,
      allowsFinalDisplay: true,
      allowsFinalReplacement: false,
      prefersSkippingDraftWork: true,
      mayRunFinalInBackground: true,
    })
  })

  it('cycles viewport result mode in auto -> draft -> final -> auto order', () => {
    expect(cycleWorkspaceViewportResultMode('auto')).toBe('draft')
    expect(cycleWorkspaceViewportResultMode('draft')).toBe('final')
    expect(cycleWorkspaceViewportResultMode('final')).toBe('auto')
  })

  it('exposes full and short labels for viewport result mode chrome', () => {
    expect(getWorkspaceViewportResultModeLabel('auto')).toBe('Auto')
    expect(getWorkspaceViewportResultModeLabel('draft')).toBe('Draft')
    expect(getWorkspaceViewportResultModeLabel('final')).toBe('Final')
    expect(getWorkspaceViewportResultModeShortLabel('auto')).toBe('A')
    expect(getWorkspaceViewportResultModeShortLabel('draft')).toBe('D')
    expect(getWorkspaceViewportResultModeShortLabel('final')).toBe('F')
  })
})

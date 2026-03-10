import { describe, expect, it } from 'vitest'
import { getNextViewMode, getRowViewFlags } from './rowViewMode'

describe('viewMode', () => {
  it('returns deterministic collapsed flags', () => {
    expect(getRowViewFlags('collapsed')).toEqual({
      showEditors: true,
      showDebugInfo: false,
      renderLeafRows: false,
      forceLeafRows: false,
    })
  })

  it('returns deterministic essentials flags', () => {
    expect(getRowViewFlags('essentials')).toEqual({
      showEditors: true,
      showDebugInfo: false,
      renderLeafRows: true,
      forceLeafRows: false,
    })
  })

  it('returns deterministic expanded flags', () => {
    expect(getRowViewFlags('expanded')).toEqual({
      showEditors: true,
      showDebugInfo: true,
      renderLeafRows: true,
      forceLeafRows: true,
    })
  })

  it('cycles view modes deterministically', () => {
    expect(getNextViewMode('collapsed')).toBe('essentials')
    expect(getNextViewMode('essentials')).toBe('expanded')
    expect(getNextViewMode('expanded')).toBe('collapsed')
  })
})

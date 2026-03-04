import { describe, expect, it } from 'vitest'
import { getRowViewFlags } from './rowViewMode'

describe('rowViewMode', () => {
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

  it('returns deterministic everything flags', () => {
    expect(getRowViewFlags('everything')).toEqual({
      showEditors: true,
      showDebugInfo: true,
      renderLeafRows: true,
      forceLeafRows: true,
    })
  })
})

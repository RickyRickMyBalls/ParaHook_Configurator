import { describe, expect, it } from 'vitest'
import { buildCompositeExpansionKey } from './compositeExpansion'

describe('compositeExpansion', () => {
  it('builds parent composite expansion key for inputs', () => {
    expect(buildCompositeExpansionKey('in', 'node-1', 'anchorPoint1')).toBe(
      'spComp|in|node-1|anchorPoint1',
    )
  })

  it('builds parent composite expansion key for outputs', () => {
    expect(buildCompositeExpansionKey('out', 'node-2', 'anchorSpline2')).toBe(
      'spComp|out|node-2|anchorSpline2',
    )
  })

  it('does not include path or encoded path tokens', () => {
    const key = buildCompositeExpansionKey('in', 'node-3', 'port%2Fwith%2Fpath')
    expect(key).toBe('spComp|in|node-3|port%2Fwith%2Fpath')
    expect(key.includes('::')).toBe(false)
    expect(key.includes('/')).toBe(false)
  })
})

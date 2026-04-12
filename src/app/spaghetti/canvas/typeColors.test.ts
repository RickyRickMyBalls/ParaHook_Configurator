import { describe, expect, it } from 'vitest'
import { TYPE_COLOR_MAP, getTypeColor } from './typeColors'

describe('typeColors body family contract', () => {
  it('keeps solidBody and solidBodies on one lavender family distinct from number rows', () => {
    expect(getTypeColor('solidBody')).toBe('#b19dff')
    expect(getTypeColor('solidBodies')).toBe('#9c88f4')
    expect(TYPE_COLOR_MAP.solidBody).not.toBe(TYPE_COLOR_MAP.solidBodies)
    expect(getTypeColor('number')).toBe('#ffffff')
  })
})

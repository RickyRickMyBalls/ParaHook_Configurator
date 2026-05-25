import { describe, expect, it } from 'vitest'
import {
  defaultSpaghettiWindowAppearance,
  normalizeSpaghettiWindowAppearance,
} from './spaghettiWindowAppearance'

describe('spaghettiWindowAppearance', () => {
  it('allows the window opacity default clamp to reach zero', () => {
    expect(defaultSpaghettiWindowAppearance.windowClamp).toEqual({ min: 0, max: 1 })

    const normalizedAppearance = normalizeSpaghettiWindowAppearance({
      ...defaultSpaghettiWindowAppearance,
      windowOpacity: 0,
    })

    expect(normalizedAppearance.windowOpacity).toBe(0)
  })

  it('migrates the legacy 65 percent window opacity clamp to zero', () => {
    const normalizedAppearance = normalizeSpaghettiWindowAppearance({
      ...defaultSpaghettiWindowAppearance,
      windowClamp: { min: 0.65, max: 1 },
      windowOpacity: 0,
    })

    expect(normalizedAppearance.windowClamp).toEqual({ min: 0, max: 1 })
    expect(normalizedAppearance.windowOpacity).toBe(0)
  })
})

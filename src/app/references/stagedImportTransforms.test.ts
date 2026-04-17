import { describe, expect, it } from 'vitest'
import {
  resolveStagedImportScaleAlignmentFromMultiplier,
  resolveStagedImportScaleAlignmentFactor,
  resolveStagedImportScaleMultiplier,
  resolveStagedImportUpAxisRotationDeg,
} from './stagedImportTransforms'

describe('resolveStagedImportUpAxisRotationDeg', () => {
  it('returns the canonical staged up-axis rotation for each supported option', () => {
    expect(resolveStagedImportUpAxisRotationDeg('z-up')).toEqual({ x: 0, y: 0, z: 0 })
    expect(resolveStagedImportUpAxisRotationDeg('y-up')).toEqual({ x: 90, y: 0, z: 0 })
    expect(resolveStagedImportUpAxisRotationDeg('x-up')).toEqual({ x: 0, y: -90, z: 0 })
  })
})

describe('resolveStagedImportScaleAlignmentFactor', () => {
  it('returns the canonical staged scale factor for each supported option', () => {
    expect(resolveStagedImportScaleAlignmentFactor('current-size')).toBe(1)
    expect(resolveStagedImportScaleAlignmentFactor('millimeters')).toBe(1)
    expect(resolveStagedImportScaleAlignmentFactor('centimeters')).toBe(10)
    expect(resolveStagedImportScaleAlignmentFactor('meters')).toBe(1000)
    expect(resolveStagedImportScaleAlignmentFactor('inches')).toBe(25.4)
  })
})

describe('resolveStagedImportScaleMultiplier', () => {
  it('prefers the explicit staged scale multiplier and otherwise falls back to the preset mapping', () => {
    expect(
      resolveStagedImportScaleMultiplier({
        scaleAlignment: 'current-size',
        scaleMultiplier: 25.4,
      }),
    ).toBe(25.4)
    expect(
      resolveStagedImportScaleMultiplier({
        scaleAlignment: 'centimeters',
      }),
    ).toBe(10)
  })
})

describe('resolveStagedImportScaleAlignmentFromMultiplier', () => {
  it('resolves exact preset labels from the numeric multiplier and prefers mm over Current at 1', () => {
    expect(resolveStagedImportScaleAlignmentFromMultiplier(1)).toBe('millimeters')
    expect(resolveStagedImportScaleAlignmentFromMultiplier(10)).toBe('centimeters')
    expect(resolveStagedImportScaleAlignmentFromMultiplier(1000)).toBe('meters')
    expect(resolveStagedImportScaleAlignmentFromMultiplier(25.4)).toBe('inches')
    expect(resolveStagedImportScaleAlignmentFromMultiplier(2.5)).toBe('custom')
  })
})

import { describe, expect, it } from 'vitest'
import { buildGeometryExtrudeControlModel } from './extrudeControlModel'

describe('buildGeometryExtrudeControlModel', () => {
  it('shows one-side body depth and taper controls by default', () => {
    const model = buildGeometryExtrudeControlModel({
      params: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        depthMm: 12,
        taperAngleDeg: 4,
      },
    })

    expect(model.depthVisible).toBe(true)
    expect(model.startDepthVisible).toBe(false)
    expect(model.endDepthVisible).toBe(false)
    expect(model.taperVisible).toBe(true)
    expect(model.effectiveDepthMm).toBe(12)
    expect(model.effectiveTaperAngleDeg).toBe(4)
  })

  it('switches two-sided extrudes to start and end depth controls', () => {
    const model = buildGeometryExtrudeControlModel({
      params: {
        extrudeType: 'Body',
        extrudeDirection: 'TwoSides',
        depthMm: 20,
        startDepthMm: 6,
        endDepthMm: 7,
        taperAngleDeg: 4,
      },
    })

    expect(model.depthVisible).toBe(false)
    expect(model.startDepthVisible).toBe(true)
    expect(model.endDepthVisible).toBe(true)
    expect(model.taperVisible).toBe(false)
    expect(model.effectiveStartDepthMm).toBe(6)
    expect(model.effectiveEndDepthMm).toBe(7)
  })
})

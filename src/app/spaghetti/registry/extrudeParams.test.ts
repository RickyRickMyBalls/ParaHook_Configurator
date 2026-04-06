import { describe, expect, it } from 'vitest'
import {
  getNodeDef,
  readGeometryExtrudeDirectionFromParams,
  readGeometryExtrudeTaperAngleDegFromParams,
  readGeometryExtrudeTypeFromParams,
} from './nodeRegistry'

describe('Geometry/Extrude param readers', () => {
  it('keeps Walls when extra extrude params are present', () => {
    expect(
      readGeometryExtrudeTypeFromParams({
        extrudeType: 'Walls',
        depthMm: 20,
        taperDeg: 3,
        wallThicknessMm: 1.5,
      }),
    ).toBe('Walls')
  })

  it('normalizes legacy Twist to Walls even when extra params are present', () => {
    expect(
      readGeometryExtrudeTypeFromParams({
        extrudeType: 'Twist',
        depthMm: 20,
        taperDeg: 3,
      }),
    ).toBe('Walls')
  })

  it('keeps TwoSides direction when extra extrude params are present', () => {
    expect(
      readGeometryExtrudeDirectionFromParams({
        extrudeType: 'Walls',
        extrudeDirection: 'TwoSides',
        depthMm: 20,
        taperDeg: 3,
        wallThicknessMm: 1.5,
      }),
    ).toBe('TwoSides')
  })

  it('defaults missing direction to OneSide even when extra extrude params are present', () => {
    expect(
      readGeometryExtrudeDirectionFromParams({
        extrudeType: 'Walls',
        depthMm: 20,
        taperDeg: 3,
      }),
    ).toBe('OneSide')
  })

  it('keeps taper angle when extra extrude params are present', () => {
    expect(
      readGeometryExtrudeTaperAngleDegFromParams({
        extrudeType: 'Walls',
        extrudeDirection: 'TwoSides',
        depthMm: 20,
        taperAngleDeg: 3.5,
        wallThicknessMm: 1.5,
      }),
    ).toBe(3.5)
  })

  it('exposes the phase 2 depth row ports without backfilling split params into defaults', () => {
    const extrudeDef = getNodeDef('Geometry/Extrude')

    expect(extrudeDef?.inputs.map((port) => port.portId)).toEqual([
      'ExtrusionProfile',
      'Type',
      'Direction',
      'Depth',
      'StartDepth',
      'EndDepth',
      'TaperAngle',
    ])
    expect(extrudeDef?.defaultParams).toMatchObject({
      extrudeType: 'Body',
      extrudeDirection: 'OneSide',
      depthMm: 20,
      taperAngleDeg: 0,
    })
    expect(extrudeDef?.defaultParams).not.toHaveProperty('startDepthMm')
    expect(extrudeDef?.defaultParams).not.toHaveProperty('endDepthMm')
  })
})

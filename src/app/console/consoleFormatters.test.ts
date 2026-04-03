import { describe, expect, it } from 'vitest'
import {
  parseConsoleSignedFloatLiteral,
  parseConsoleVec2Literal,
  parseConsoleVec3Literal,
} from './consoleFormatters'

describe('consoleFormatters', () => {
  it('parses vec2 literals and rejects invalid values', () => {
    expect(parseConsoleVec2Literal('1,2')).toEqual({ x: 1, y: 2 })
    expect(parseConsoleVec2Literal(' -1.5 , .25 ')).toEqual({ x: -1.5, y: 0.25 })
    expect(parseConsoleVec2Literal('1')).toBeNull()
    expect(parseConsoleVec2Literal('1, nope')).toBeNull()
  })

  it('parses vec3 literals in plain and wrapped forms', () => {
    expect(parseConsoleVec3Literal('1,2,3')).toEqual({ x: 1, y: 2, z: 3 })
    expect(parseConsoleVec3Literal('vec3(1.5, -2, 0.25)')).toEqual({
      x: 1.5,
      y: -2,
      z: 0.25,
    })
    expect(parseConsoleVec3Literal('vec3(1,2)')).toBeNull()
  })

  it('parses signed float literals and rejects malformed input', () => {
    expect(parseConsoleSignedFloatLiteral('1')).toBe(1)
    expect(parseConsoleSignedFloatLiteral('-1.25')).toBe(-1.25)
    expect(parseConsoleSignedFloatLiteral('.5')).toBe(0.5)
    expect(parseConsoleSignedFloatLiteral('1.2.3')).toBeNull()
    expect(parseConsoleSignedFloatLiteral('')).toBeNull()
  })
})

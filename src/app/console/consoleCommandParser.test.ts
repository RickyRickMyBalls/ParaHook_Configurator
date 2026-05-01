import { describe, expect, it } from 'vitest'
import {
  normalizeRadioCommandIdentity,
  parseConsoleCommand,
  parseZoomCommandAction,
} from './consoleCommandParser'

describe('consoleCommandParser', () => {
  it('parses known commands and aliases', () => {
    expect(parseConsoleCommand('frame all')).toEqual({
      raw: 'frame all',
      name: 'frame',
      args: ['all'],
      argumentText: 'all',
    })

    expect(parseConsoleCommand('z extents')).toEqual({
      raw: 'z extents',
      name: 'zoom',
      args: ['extents'],
      argumentText: 'extents',
    })
    expect(parseConsoleCommand('zo')).toEqual({
      raw: 'zo',
      name: 'zoomobject',
      args: [],
      argumentText: '',
    })

    expect(parseConsoleCommand('  m   1,2,3  ')).toEqual({
      raw: 'm   1,2,3',
      name: 'move',
      args: ['1,2,3'],
      argumentText: '1,2,3',
    })
  })

  it('keeps unknown commands visible while leaving the command name null', () => {
    expect(parseConsoleCommand('mystery token')).toEqual({
      raw: 'mystery token',
      name: null,
      args: ['token'],
      argumentText: 'token',
    })
  })

  it('returns null for empty command input', () => {
    expect(parseConsoleCommand('   ')).toBeNull()
  })

  it('parses zoom actions from normalized terminal tokens', () => {
    expect(parseZoomCommandAction(['all'])).toBe('all')
    expect(parseZoomCommandAction(['>', 'E'])).toBe('extents')
    expect(parseZoomCommandAction(['something', 'p'])).toBe('previous')
    expect(parseZoomCommandAction(['window'])).toBe('window')
    expect(parseZoomCommandAction(['o'])).toBe('object')
    expect(parseZoomCommandAction(['mystery'])).toBeNull()
  })

  it('normalizes prompt and feature-assist identity text consistently', () => {
    expect(normalizeRadioCommandIdentity('  open   toolbar  ')).toBe('OPEN TOOLBAR')
    expect(normalizeRadioCommandIdentity('x')).toBe('X')
  })
})

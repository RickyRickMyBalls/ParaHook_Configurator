import { describe, expect, it } from 'vitest'
import {
  buildSketchDrawSessionIdlePrompt,
  getPrimarySketchDrawConsoleToolLabel,
  getPrimarySketchDrawToolLabel,
  normalizeGeometrySketchDrawCommand,
  resolveGeometrySketchDrawCommandFromActionId,
  resolveGeometrySketchDrawCommandFromInput,
  SKETCH_DRAW_HELP_TEXT,
} from './drawCommands'

describe('drawCommands', () => {
  it('normalizes first-band aliases into canonical sketch draw commands', () => {
    expect(normalizeGeometrySketchDrawCommand('l')).toBe('line')
    expect(normalizeGeometrySketchDrawCommand('pl')).toBe('pline')
    expect(normalizeGeometrySketchDrawCommand('rec')).toBe('rectangle')
    expect(normalizeGeometrySketchDrawCommand('cc')).toBe('circle')
    expect(normalizeGeometrySketchDrawCommand('p')).toBe('previous')
    expect(normalizeGeometrySketchDrawCommand('del')).toBe('delete')
    expect(normalizeGeometrySketchDrawCommand('b')).toBe('back')
  })

  it('resolves staged action ids into canonical sketch draw commands', () => {
    expect(resolveGeometrySketchDrawCommandFromActionId('sketchdraw.tool.line')).toBe('line')
    expect(resolveGeometrySketchDrawCommandFromActionId('sketchdraw.tool.pline')).toBe('pline')
    expect(resolveGeometrySketchDrawCommandFromActionId('sketchdraw.previous')).toBe('previous')
    expect(resolveGeometrySketchDrawCommandFromActionId('sketchdraw.delete')).toBe('delete')
    expect(resolveGeometrySketchDrawCommandFromActionId('sketchdraw.back')).toBe('back')
    expect(resolveGeometrySketchDrawCommandFromActionId('sketchdraw.exit')).toBe('x')
    expect(resolveGeometrySketchDrawCommandFromActionId('sketchdraw.done')).toBeNull()
  })

  it('exposes shared tool labels, help text, and the idle prompt', () => {
    expect(getPrimarySketchDrawToolLabel('pline')).toBe('PLine')
    expect(getPrimarySketchDrawConsoleToolLabel('rectangle')).toBe('REC')
    expect(buildSketchDrawSessionIdlePrompt(null)).toBe(
      'Sketch Draw > [Line, PLine, Rectangle, Circle, X]',
    )
    expect(buildSketchDrawSessionIdlePrompt('line')).toBe(
      'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]',
    )
    expect(resolveGeometrySketchDrawCommandFromInput('  REC  ')).toBe('rectangle')
    expect(SKETCH_DRAW_HELP_TEXT).toContain('rectangle (rec)')
  })
})

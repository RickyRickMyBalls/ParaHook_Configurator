import { describe, expect, it } from 'vitest'
import {
  NODE_TEMPLATE_SHELL_AREAS,
  STRUCTURED_WIRE_ROW_FAMILIES,
  STRUCTURED_WIRE_NUMERIC_ROW_CONTRACT,
  STRUCTURED_WIRE_REFERENCE_ROW_CONTRACT,
  buildUnitAwareNumericRowDrivenMessage,
  buildUnitAwareNumericRowLabel,
  getDefaultNodeTemplateSectionOpen,
  getDefaultStructuredWireBlockOpen,
  getDefaultStructuredWireRowMode,
  isWiringSurfaceSection,
} from './nodeTemplateContract'

describe('nodeTemplateContract', () => {
  it('keeps inputs and outputs classified as wiring surfaces', () => {
    expect(isWiringSurfaceSection('inputs')).toBe(true)
    expect(isWiringSurfaceSection('outputs')).toBe(true)
    expect(isWiringSurfaceSection('featureStack')).toBe(false)
  })

  it('keeps wiring sections open by default in collapsed mode', () => {
    expect(getDefaultNodeTemplateSectionOpen('collapsed', 'inputs')).toBe(true)
    expect(getDefaultNodeTemplateSectionOpen('collapsed', 'outputs')).toBe(true)
    expect(getDefaultNodeTemplateSectionOpen('collapsed', 'drivers')).toBe(false)
  })

  it('keeps geometry shell content open and wiring blocks visible in collapsed mode', () => {
    expect(getDefaultStructuredWireBlockOpen('collapsed', 'inputs')).toBe(true)
    expect(getDefaultStructuredWireBlockOpen('collapsed', 'content')).toBe(true)
    expect(getDefaultStructuredWireBlockOpen('collapsed', 'outputs')).toBe(true)
  })

  it('maps node mode to structured wire row density defaults', () => {
    expect(getDefaultStructuredWireRowMode('collapsed', true)).toBe('collapsed')
    expect(getDefaultStructuredWireRowMode('essentials', true)).toBe('essentials')
    expect(getDefaultStructuredWireRowMode('essentials', false)).toBe('collapsed')
    expect(getDefaultStructuredWireRowMode('expanded', false)).toBe('expanded')
  })

  it('locks the shared shell areas and initial row-family order', () => {
    expect(NODE_TEMPLATE_SHELL_AREAS).toEqual([
      'title',
      'familyBadge',
      'summaryChips',
      'sectionHeaders',
      'nodeModeButton',
      'toolbarRegion',
    ])
    expect(STRUCTURED_WIRE_ROW_FAMILIES).toEqual([
      'reference',
      'numeric',
      'artifact',
      'composite',
      'collection',
    ])
  })

  it('locks the reusable reference-row and numeric-row contracts', () => {
    expect(STRUCTURED_WIRE_REFERENCE_ROW_CONTRACT).toEqual({
      family: 'reference',
      rowOwnsSingleStructuredTarget: true,
      allowsUserFacingLabelOverride: true,
      supportsAttachedBody: true,
    })
    expect(STRUCTURED_WIRE_NUMERIC_ROW_CONTRACT).toEqual({
      family: 'numeric',
      unitAware: true,
      collapsedSummary: 'resolvedValue',
      essentialsEditor: 'inlineNumberField',
      expandedBody: 'explanationOrDiagnostics',
      keepsLocalFallbackWhenDriven: true,
    })
  })

  it('builds unit-aware numeric-row summary and driven-message text', () => {
    expect(buildUnitAwareNumericRowLabel('30', 'mm')).toBe('30 mm')
    expect(buildUnitAwareNumericRowDrivenMessage('20', 'mm')).toBe(
      'Wire drives the effective value. Local fallback stays at 20 mm.',
    )
  })
})

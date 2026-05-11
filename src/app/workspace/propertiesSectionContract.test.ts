import { describe, expect, it } from 'vitest'
import { propertiesMaterialsSectionDefinition } from './PropertiesMaterialsSection'
import {
  buildPropertiesFocusSummary,
  resolvePropertiesShellState,
} from './propertiesSectionContract'

describe('propertiesSectionContract', () => {
  const sections = [propertiesMaterialsSectionDefinition]

  it('returns an empty shell state when nothing is focused', () => {
    const shellState = resolvePropertiesShellState(
      sections,
      buildPropertiesFocusSummary(null),
      null,
      'materials',
    )

    expect(shellState.kind).toBe('empty')
  })

  it('returns an unsupported shell state when no section supports the focused target', () => {
    const selectedTarget = {
      kind: 'graph-node' as const,
      graphDocumentId: 'graph-doc-1',
      nodeId: 'node-1',
    }

    const shellState = resolvePropertiesShellState(
      sections,
      buildPropertiesFocusSummary(selectedTarget),
      selectedTarget,
      'materials',
    )

    expect(shellState.kind).toBe('unsupported')
  })

  it('returns a ready shell state with the materials section for supported object focus', () => {
    const selectedTarget = {
      kind: 'object' as const,
      objectId: 'object-1',
    }

    const shellState = resolvePropertiesShellState(
      sections,
      buildPropertiesFocusSummary(selectedTarget),
      selectedTarget,
      'materials',
    )

    expect(shellState.kind).toBe('ready')
    if (shellState.kind !== 'ready') {
      throw new Error('Expected ready shell state')
    }
    expect(shellState.activeSection.id).toBe('materials')
    expect(shellState.sectionContext.selectedTarget.kind).toBe('object')
    if (shellState.sectionContext.selectedTarget.kind !== 'object') {
      throw new Error('Expected object target in ready materials shell state')
    }
    expect(shellState.sectionContext.selectedTarget.objectId).toBe('object-1')
  })

  it('returns a no-sections shell state when no sections are registered', () => {
    const selectedTarget = {
      kind: 'object' as const,
      objectId: 'object-1',
    }

    const shellState = resolvePropertiesShellState(
      [],
      buildPropertiesFocusSummary(selectedTarget),
      selectedTarget,
      null,
    )

    expect(shellState.kind).toBe('no-sections')
  })
})

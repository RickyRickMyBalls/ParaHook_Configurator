import { describe, expect, it } from 'vitest'
import { getWorkspaceSurfaceCatalogEntries } from './workspaceSurfaceCatalog'
import {
  getWorkspaceViewportTypeChoiceEntries,
  getWorkspaceViewportTypeLabel,
} from './workspaceViewportTypeChoices'

describe('workspaceViewportTypeChoices', () => {
  it('derives default viewport type choices from slotted catalog surfaces in catalog order', () => {
    const expectedKinds = getWorkspaceSurfaceCatalogEntries()
      .filter((entry) => entry.supports.slotted)
      .map((entry) => entry.kind)

    const choices = getWorkspaceViewportTypeChoiceEntries()

    expect(choices.map((choice) => choice.kind)).toEqual(expectedKinds)
    expect(choices.map((choice) => choice.label)).toEqual(
      expectedKinds.map(getWorkspaceViewportTypeLabel),
    )
  })

  it('preserves caller-provided surface order for custom viewport type menus', () => {
    const choices = getWorkspaceViewportTypeChoiceEntries(['properties', 'browser', 'modelViewer'])

    expect(choices.map((choice) => choice.kind)).toEqual([
      'properties',
      'browser',
      'modelViewer',
    ])
    expect(choices.map((choice) => choice.label)).toEqual([
      'Properties',
      'Browser',
      'Model Viewport',
    ])
  })

  it('exposes the shared compact aliases for console viewport type tokens', () => {
    const byKind = Object.fromEntries(
      getWorkspaceViewportTypeChoiceEntries().map((choice) => [choice.kind, choice.aliases]),
    )

    expect(byKind.modelViewer).toEqual(['MV'])
    expect(byKind.browser).toEqual(['BRO'])
    expect(byKind.spaghettiEditor).toEqual(['SE', 'SP'])
    expect(byKind.homePage).toEqual(['HP', 'HOME'])
    expect(byKind.properties).toEqual(['PROP', 'PROPS'])
    expect(byKind.export).toEqual(['EXP'])
    expect(byKind.buildPath).toEqual(['BP', 'PATH'])
    expect(byKind.settings).toEqual([])
  })
})

import { describe, expect, it } from 'vitest'
import { createWorkspaceSurfaceInstanceIdForSlot } from './workspaceShellTypes'
import {
  getWorkspaceSurfaceCatalogEntry,
  isWorkspaceSurfaceOptional,
  parseWorkspaceSurfaceKind,
  workspaceSurfaceParticipatesInPersistence,
  workspaceSurfaceSupportsHostMode,
  workspaceSurfaceSupportsSplit,
} from './workspaceSurfaceCatalog'

describe('workspaceSurfaceCatalog', () => {
  it('registers catalog as an optional persisted split-capable workspace surface with popout deferred', () => {
    expect(parseWorkspaceSurfaceKind('catalog')).toBe('catalog')
    expect(isWorkspaceSurfaceOptional('catalog')).toBe(true)
    expect(workspaceSurfaceSupportsSplit('catalog')).toBe(true)
    expect(workspaceSurfaceParticipatesInPersistence('catalog')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('catalog', 'floating')).toBe(true)
    expect(workspaceSurfaceSupportsHostMode('catalog', 'popout')).toBe(false)
    expect(getWorkspaceSurfaceCatalogEntry('catalog')).toEqual(
      expect.objectContaining({
        kind: 'catalog',
        defaultLabel: 'Catalog Viewport',
        renderFamily: 'catalog',
        scope: 'optional',
        participatesInPersistence: true,
        coordination: 'plain',
        supports: expect.objectContaining({
          slotted: true,
          floating: true,
          popout: false,
          split: true,
        }),
      }),
    )
  })

  it('creates explicit slot instance ids for catalog instead of falling through to spaghetti ids', () => {
    expect(createWorkspaceSurfaceInstanceIdForSlot('catalog', 'workspace-slot-secondary')).toBe(
      'catalog-workspace-slot-secondary',
    )
  })
})
